import { useEffect, useState } from 'react'
import { CheckCircle, Clock, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

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

interface VocabEntry {
  word: string
  pronunciation: string
  definition: string
  example: string
}

interface StorySection {
  slide_marker: string
  title: string
  body_paragraphs: string[]
  connector: string | null
}

interface EmphasisPoint {
  heading: string
  body: string
}

interface StoryPackData {
  title: string
  subtitle: string
  source_grounding: string
  vocabulary: VocabEntry[]
  story_sections: StorySection[]
  emphasis_points: EmphasisPoint[]
}

interface StoryPackDetail extends StoryPack {
  story_pack_text: string
  story_pack_data: StoryPackData | null
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

// Annotation type → Tailwind classes
const ANN_CLASSES: Record<string, string> = {
  PAUSE:        'bg-emerald-50 text-emerald-700',
  VOICE:        'bg-violet-50 text-violet-700',
  PACE:         'bg-amber-50 text-amber-800',
  FEEL:         'bg-rose-50 text-rose-800',
  GESTURE:      'bg-blue-50 text-blue-700',
  'EYE CONTACT':'bg-cyan-50 text-cyan-700',
  REPEAT:       'bg-yellow-50 text-yellow-700',
  HERALD:       'bg-indigo-50 text-indigo-700',
  PARTICIPATE:  'bg-green-50 text-green-700',
  UNVERIFIED:   'bg-red-50 text-red-700',
}

const ANN_RE  = /\[\[([^\]]+)\]\]/g
const BOTH_RE = /\[\[([^\]]+)\]\]|\{([^}]+)\}/g

function annotateRichText(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let last = 0
  BOTH_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = BOTH_RE.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index))
    if (match[1] !== undefined) {
      // [[ANN: content]] — annotation badge
      const inner = match[1]
      const typeKey = inner.split(/[:\u2014\-]/)[0].trim().toUpperCase()
      const cls = ANN_CLASSES[typeKey] ?? 'bg-slate-100 text-slate-600'
      nodes.push(
        <span key={match.index}
          className={`inline-block font-sans text-[10px] font-semibold px-1.5 py-0.5 rounded mx-0.5 leading-tight align-middle ${cls}`}>
          {inner}
        </span>
      )
    } else {
      // {vocab word} — underlined in gold
      nodes.push(
        <span key={match.index}
          className="font-semibold border-b-2 border-amber-400 pb-px">
          {match[2]}
        </span>
      )
    }
    last = match.index + match[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

function VocabGrid({ vocab }: { vocab: VocabEntry[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 mb-5">
      {vocab.map((v, i) => (
        <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <p className="font-serif text-base font-semibold text-ink mb-0.5">{v.word}</p>
          {v.pronunciation && (
            <p className="text-[11px] text-amber-600 italic mb-1.5">{v.pronunciation}</p>
          )}
          <p className="text-xs text-slate-600 leading-relaxed mb-1.5">{v.definition}</p>
          {v.example && (
            <p className="text-[11px] text-slate-500 leading-snug border-l-2 border-amber-300 pl-2 italic">
              {v.example}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

function StorySection({ section }: { section: StorySection }) {
  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-2">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-blue-700 bg-blue-50 rounded px-2 py-0.5 mb-3">
          {section.slide_marker}
        </div>
        <p className="font-serif text-lg font-semibold text-ink mb-4 pb-3 border-b border-slate-100">
          {section.title}
        </p>
        <div className="font-serif text-[15px] leading-[1.85] text-ink space-y-3">
          {section.body_paragraphs.map((para, i) => (
            <p key={i}>{annotateRichText(para)}</p>
          ))}
        </div>
      </div>
      {section.connector && (
        <div className="text-center text-xs text-slate-400 py-1.5 mb-2">
          {section.connector}
        </div>
      )}
    </>
  )
}

function EmphasisBox({ points }: { points: EmphasisPoint[] }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
      {points.map((pt, i) => (
        <div key={i} className="flex gap-3 items-start">
          <div className="shrink-0 w-5 h-5 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-[11px] font-semibold mt-0.5">
            {i + 1}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink leading-snug mb-0.5">{pt.heading}</p>
            <p className="text-xs text-slate-600 leading-relaxed">{pt.body}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function AnnLegend() {
  const items = [
    { label: 'PAUSE', cls: 'bg-emerald-50 text-emerald-700' },
    { label: 'VOICE', cls: 'bg-violet-50 text-violet-700' },
    { label: 'PACE',  cls: 'bg-amber-50 text-amber-800' },
    { label: 'FEEL',  cls: 'bg-rose-50 text-rose-800' },
    { label: 'GESTURE', cls: 'bg-blue-50 text-blue-700' },
  ]
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {items.map(({ label, cls }) => (
        <span key={label} className={`font-sans text-[10px] font-semibold px-1.5 py-0.5 rounded ${cls}`}>
          {label}
        </span>
      ))}
      <span className="text-[11px] text-slate-400 self-center">— inline performance cues</span>
    </div>
  )
}

function RichStoryPack({ data, pack }: { data: StoryPackData; pack: StoryPackDetail }) {
  const subjectColour: Record<string, string> = {
    History:   'bg-amber-50 text-amber-800',
    Geography: 'bg-emerald-50 text-emerald-700',
    Religion:  'bg-violet-50 text-violet-700',
  }
  const subCls = subjectColour[pack.subject] ?? 'bg-slate-100 text-slate-600'

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800">
            Year {pack.year}
          </span>
          <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${subCls}`}>
            {pack.subject}
          </span>
          <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {pack.term}
          </span>
        </div>
        <h2 className="font-serif text-xl font-semibold text-ink mb-1">{data.title}</h2>
        <p className="text-sm text-slate-500">{data.subtitle}</p>
      </div>

      {/* Source grounding */}
      {data.source_grounding && (
        <div className="text-xs text-slate-600 bg-blue-50 border-l-2 border-blue-300 rounded-r px-3 py-2">
          {data.source_grounding}
        </div>
      )}

      {/* Vocabulary */}
      {data.vocabulary?.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
            Step 1 — Vocabulary pre-teach
          </p>
          <VocabGrid vocab={data.vocabulary} />
        </div>
      )}

      {/* Story */}
      {data.story_sections?.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
            Step 2 — The story
          </p>
          <AnnLegend />
          {data.story_sections.map((s, i) => (
            <StorySection key={i} section={s} />
          ))}
        </div>
      )}

      {/* Emphasis */}
      {data.emphasis_points?.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
            Step 3 — What to emphasise
          </p>
          <EmphasisBox points={data.emphasis_points} />
        </div>
      )}
    </div>
  )
}

// ── Legacy markdown renderer (fallback for packs without story_pack_data) ──

const ANNOTATION_COLOURS: Record<string, string> = {
  PAUSE:       'bg-purple-100 text-purple-700',
  PACE:        'bg-blue-100 text-blue-700',
  VOICE:       'bg-teal-100 text-teal-700',
  GESTURE:     'bg-orange-100 text-orange-700',
  FEEL:        'bg-pink-100 text-pink-700',
  REPEAT:      'bg-yellow-100 text-yellow-700',
  HERALD:      'bg-indigo-100 text-indigo-700',
  PARTICIPATE: 'bg-green-100 text-green-700',
  SLIDE:       'bg-slate-200 text-slate-600',
  UNVERIFIED:  'bg-red-100 text-red-700',
}

function annotateText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  ANN_RE.lastIndex = 0
  while ((match = ANN_RE.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    const inner = match[1]
    const key = inner.split(/[:\-]/)[0].trim().toUpperCase()
    const cls = ANNOTATION_COLOURS[key] ?? 'bg-slate-100 text-slate-600'
    parts.push(
      <span key={match.index}
        className={`inline-flex items-center text-[11px] font-semibold px-1.5 py-0.5 rounded mx-0.5 leading-none ${cls}`}>
        {inner}
      </span>
    )
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function annotateChildren(children: React.ReactNode): React.ReactNode {
  if (typeof children === 'string') return annotateText(children)
  if (Array.isArray(children)) return children.map((c, i) =>
    typeof c === 'string' ? <span key={i}>{annotateText(c)}</span> : c
  )
  return children
}

function StoryText({ text }: { text: string }) {
  return (
    <div className="prose prose-sm max-w-none text-ink leading-relaxed [&>h2]:text-base [&>h2]:font-semibold [&>h2]:mt-4 [&>h2]:mb-1 [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:mt-3 [&>h3]:mb-1 [&>p]:mb-3 [&>ul]:mb-3 [&>ul>li]:mb-1">
      <ReactMarkdown
        components={{
          p:  ({ children }) => <p className="mb-3 leading-relaxed">{annotateChildren(children)}</p>,
          li: ({ children }) => <li className="mb-1">{annotateChildren(children)}</li>,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

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
      {(pack.warnings ?? []).length > 0 && (
        <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded p-3">
          <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
          <ul className="text-xs text-amber-700 space-y-0.5">
            {(pack.warnings ?? []).map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}

      {/* Story pack — rich if JSON available, fallback to markdown */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
          Story pack
        </h3>
        <div className="bg-slate-50 rounded-lg p-4 max-h-[70vh] overflow-y-auto">
          {pack.story_pack_data
            ? <RichStoryPack data={pack.story_pack_data} pack={pack} />
            : <StoryText text={pack.story_pack_text} />
          }
        </div>
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
