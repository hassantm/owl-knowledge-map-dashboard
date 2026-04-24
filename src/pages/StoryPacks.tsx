import { useEffect, useState } from 'react'
import { CheckCircle, Clock, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'

const BASE = '/api'

interface StoryPack {
  id: number
  unit_id: number
  subject: string
  year: number
  term: string
  unit: string
  model: string
  input_tokens: number
  output_tokens: number
  human_approved: boolean
  approved_by: string | null
  approved_at: string | null
  created_at: string
  warnings: string[] | null
  warning_count: number | null
  fact_check_count: number
  avg_rubric_score: number | null
}

interface StoryPackDetail extends StoryPack {
  story_pack_text: string
  fact_check_results: { claim: string; verified: boolean; source_page: number | null }[]
  rubric_scores: Record<string, { score: number; justification: string }>
}

async function fetchPacks(filters: { subject?: string; year?: string; approvedOnly: boolean }) {
  const params = new URLSearchParams()
  if (filters.subject) params.set('subject', filters.subject)
  if (filters.year)    params.set('year', filters.year)
  if (filters.approvedOnly) params.set('approved_only', 'true')
  const res = await fetch(`${BASE}/story-packs?${params}`)
  return res.json() as Promise<StoryPack[]>
}

async function fetchPack(id: number) {
  const res = await fetch(`${BASE}/story-packs/${id}`)
  return res.json() as Promise<StoryPackDetail>
}

async function approvePack(id: number, approvedBy: string) {
  const res = await fetch(`${BASE}/story-packs/${id}/approve`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ approved_by: approvedBy }),
  })
  return res.json()
}

async function unapprovePack(id: number) {
  const res = await fetch(`${BASE}/story-packs/${id}/unapprove`, { method: 'PATCH' })
  return res.json()
}

const SUBJECTS = ['History', 'Geography', 'Religion']
const YEARS    = ['3', '4', '5', '6']

const RUBRIC_LABELS: Record<string, string> = {
  causal_chain:             'Causal chain',
  vocabulary_integration:   'Vocabulary integration',
  dramatic_structure:       'Dramatic structure',
  knowledge_fidelity:       'Knowledge fidelity',
  register:                 'Register',
  performance_architecture: 'Performance architecture',
}

function ScoreBadge({ score }: { score: number }) {
  const colour = score >= 4 ? 'bg-green-100 text-green-700'
               : score >= 3 ? 'bg-amber-100 text-amber-700'
               : 'bg-red-100 text-red-700'
  return <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${colour}`}>{score}/5</span>
}

function PackDetail({ id, onApprovalChange }: { id: number; onApprovalChange: () => void }) {
  const [pack, setPack]           = useState<StoryPackDetail | null>(null)
  const [loading, setLoading]     = useState(true)
  const [approverName, setApproverName] = useState('')
  const [saving, setSaving]       = useState(false)
  const [showFacts, setShowFacts] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchPack(id).then(setPack).finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-slate-400 text-sm p-4">Loading...</p>
  if (!pack)   return <p className="text-red-500 text-sm p-4">Failed to load pack.</p>

  const unverified = pack.fact_check_results?.filter(r => !r.verified) ?? []

  async function handleApprove() {
    if (!approverName.trim()) return
    setSaving(true)
    await approvePack(pack!.id, approverName.trim())
    await fetchPack(id).then(setPack)
    setSaving(false)
    onApprovalChange()
  }

  async function handleUnapprove() {
    setSaving(true)
    await unapprovePack(pack!.id)
    await fetchPack(id).then(setPack)
    setSaving(false)
    onApprovalChange()
  }

  return (
    <div className="space-y-6">

      {/* Rubric scores */}
      {pack.rubric_scores && Object.keys(pack.rubric_scores).length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Rubric scores
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(pack.rubric_scores).map(([key, val]) => (
              <div key={key} className="flex items-start gap-2 bg-slate-50 rounded p-2">
                <ScoreBadge score={val.score} />
                <div>
                  <p className="text-xs font-medium text-ink">{RUBRIC_LABELS[key] ?? key}</p>
                  <p className="text-xs text-slate-500">{val.justification}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fact check */}
      {pack.fact_check_results?.length > 0 && (
        <div>
          <button
            onClick={() => setShowFacts(f => !f)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2"
          >
            Fact check ({unverified.length} unverified / {pack.fact_check_results.length} claims)
            {showFacts ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          {showFacts && (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {pack.fact_check_results.map((r, i) => (
                <div key={i} className={`flex gap-2 text-xs p-1.5 rounded ${r.verified ? 'bg-green-50' : 'bg-red-50'}`}>
                  <span className={r.verified ? 'text-green-500' : 'text-red-500'}>
                    {r.verified ? '✓' : '✗'}
                  </span>
                  <span className="text-slate-700">{r.claim}</span>
                  {r.source_page && <span className="text-slate-400 shrink-0">p.{r.source_page}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Warnings */}
      {pack.warnings?.length > 0 && (
        <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded p-3">
          <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
          <ul className="text-xs text-amber-700 space-y-0.5">
            {pack.warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}

      {/* Story text */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
          Story pack
        </h3>
        <pre className="whitespace-pre-wrap font-sans text-sm text-ink bg-slate-50 rounded p-4 max-h-[60vh] overflow-y-auto leading-relaxed">
          {pack.story_pack_text}
        </pre>
      </div>

      {/* Approval */}
      <div className="border-t border-slate-200 pt-4">
        {pack.human_approved ? (
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-600 font-medium flex items-center gap-1.5">
              <CheckCircle size={15} />
              Approved by {pack.approved_by}
            </p>
            <button
              onClick={handleUnapprove}
              disabled={saving}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              Revoke approval
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Your name"
              value={approverName}
              onChange={e => setApproverName(e.target.value)}
              className="flex-1 text-sm border border-slate-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-owl-purple"
            />
            <button
              onClick={handleApprove}
              disabled={saving || !approverName.trim()}
              className="px-4 py-1.5 text-sm font-medium bg-owl-purple text-white rounded hover:bg-owl-purple/90 disabled:opacity-40 transition-colors"
            >
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function StoryPacks() {
  const [packs, setPacks]           = useState<StoryPack[]>([])
  const [loading, setLoading]       = useState(true)
  const [subject, setSubject]       = useState('')
  const [year, setYear]             = useState('')
  const [approvedOnly, setApprovedOnly] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  function load() {
    setLoading(true)
    fetchPacks({ subject, year, approvedOnly })
      .then(setPacks)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [subject, year, approvedOnly])

  const selected = packs.find(p => p.id === selectedId)

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8 min-h-screen">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-ink mb-1">Story Packs</h1>
        <p className="text-sm text-slate-500">
          AI-generated teacher story packs. Review, approve, and track coverage across the curriculum.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <select
          value={subject}
          onChange={e => { setSubject(e.target.value); setSelectedId(null) }}
          className="text-sm border border-slate-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-owl-purple"
        >
          <option value="">All subjects</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={year}
          onChange={e => { setYear(e.target.value); setSelectedId(null) }}
          className="text-sm border border-slate-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-owl-purple"
        >
          <option value="">All years</option>
          {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
        </select>

        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={approvedOnly}
            onChange={e => { setApprovedOnly(e.target.checked); setSelectedId(null) }}
            className="rounded"
          />
          Approved only
        </label>

        <span className="ml-auto text-sm text-slate-400">
          {packs.length} pack{packs.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-[320px_1fr] gap-6 items-start">
        {/* Pack list */}
        <div className="space-y-2">
          {loading && <p className="text-slate-400 text-sm">Loading...</p>}
          {!loading && packs.length === 0 && (
            <p className="text-slate-400 text-sm">No story packs found.</p>
          )}
          {packs.map(pack => (
            <button
              key={pack.id}
              onClick={() => setSelectedId(pack.id === selectedId ? null : pack.id)}
              className={`w-full text-left rounded-lg border p-3 transition-colors ${
                pack.id === selectedId
                  ? 'border-owl-purple bg-owl-purple/5'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-ink leading-snug">{pack.unit}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {pack.subject} · Y{pack.year} · {pack.term}
                  </p>
                </div>
                {pack.human_approved
                  ? <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />
                  : <Clock size={15} className="text-slate-300 shrink-0 mt-0.5" />
                }
              </div>
              <div className="flex items-center gap-3 mt-2">
                {pack.avg_rubric_score !== null && (
                  <span className="text-xs text-slate-500">
                    avg score <span className="font-medium text-ink">{pack.avg_rubric_score}</span>
                  </span>
                )}
                {pack.warning_count ? (
                  <span className="text-xs text-amber-600 flex items-center gap-0.5">
                    <AlertTriangle size={11} /> {pack.warning_count}
                  </span>
                ) : null}
                <span className="text-xs text-slate-400 ml-auto">
                  {pack.output_tokens} tok
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-20">
          {selectedId === null || !selected ? (
            <p className="text-slate-400 text-sm">Select a pack to review it.</p>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="font-serif text-xl font-semibold text-ink">{selected.unit}</h2>
                <p className="text-sm text-slate-400">
                  {selected.subject} · Year {selected.year} · {selected.term}
                </p>
              </div>
              <PackDetail key={selectedId} id={selectedId} onApprovalChange={load} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
