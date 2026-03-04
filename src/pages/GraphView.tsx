import { useEffect, useRef, useState } from 'react'
import Graph from 'graphology'
import Sigma from 'sigma'
import { fetchGraph, type GraphParams } from '../lib/api'
import { SUBJECT_COLOURS, EDGE_NATURE_COLOURS, SUBJECT_BG, EDGE_NATURE_BG } from '../lib/colours'

interface HoveredNode {
  id: number
  term: string
  subject: string
  year: number
  term_period: string
  unit: string
  chapter: string
  is_introduction: boolean
}

const EDGE_NATURES = ['reinforcement', 'extension', 'application'] as const
const SUBJECTS = ['History', 'Geography', 'Religion'] as const

export default function GraphView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sigmaRef = useRef<Sigma | null>(null)

  const [graphData, setGraphData] = useState<import('../lib/api').GraphResponse | null>(null)
  const [hovered, setHovered] = useState<HoveredNode | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter state
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set(['History', 'Geography', 'Religion']))
  const [selectedNatures, setSelectedNatures] = useState<Set<string>>(new Set(['extension', 'application']))
  const [yearFrom, setYearFrom] = useState(3)
  const [yearTo, setYearTo] = useState(6)
  const [crossSubjectOnly, setCrossSubjectOnly] = useState(false)
  const [filterOpen, setFilterOpen] = useState(true)

  const loadGraph = () => {
    setLoading(true)
    setError(null)
    const params: GraphParams = {
      yearFrom,
      yearTo,
    }
    fetchGraph(params)
      .then(data => {
        setGraphData(data)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadGraph()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!containerRef.current || !graphData) return

    // Kill previous sigma instance
    if (sigmaRef.current) {
      sigmaRef.current.kill()
      sigmaRef.current = null
    }

    const graph = new Graph()

    // Filter nodes and edges
    const filteredEdges = graphData.edges.filter(e => {
      if (!selectedNatures.has(e.edge_nature)) return false
      if (crossSubjectOnly && e.edge_type !== 'cross_subject') return false
      return true
    })

    const activeNodeIds = new Set<number>()
    filteredEdges.forEach(e => {
      activeNodeIds.add(e.source)
      activeNodeIds.add(e.target)
    })

    const filteredNodes = graphData.nodes.filter(n =>
      activeNodeIds.has(n.id) && selectedSubjects.has(n.subject)
    )

    // Compute x/y from curriculum_position if not present
    const subjectIndex: Record<string, number> = { History: 0, Geography: 1, Religion: 2 }
    filteredNodes.forEach(node => {
      if (graph.hasNode(String(node.id))) return
      const si = subjectIndex[node.subject] ?? 0
      // x = curriculum position (year*10 + term order), y = subject lane
      const x = node.curriculum_position * 5 + Math.random() * 2
      const y = si * 50 + Math.random() * 10
      graph.addNode(String(node.id), {
        label: node.term,
        x,
        y,
        size: 6,
        color: SUBJECT_COLOURS[node.subject] ?? '#888',
      })
    })

    filteredEdges.forEach(edge => {
      const src = String(edge.source)
      const tgt = String(edge.target)
      if (!graph.hasNode(src) || !graph.hasNode(tgt)) return
      const edgeKey = `${src}-${tgt}`
      if (graph.hasEdge(edgeKey)) return
      try {
        graph.addEdgeWithKey(edgeKey, src, tgt, {
          color: EDGE_NATURE_COLOURS[edge.edge_nature] ?? '#ccc',
          size: edge.edge_nature === 'application' ? 3 : edge.edge_nature === 'extension' ? 2 : 1,
          type: 'arrow',
        })
      } catch {
        // skip duplicate edges
      }
    })

    const nodeMap = new Map(graphData.nodes.map(n => [String(n.id), n]))

    try {
      sigmaRef.current = new Sigma(graph, containerRef.current, {
        renderEdgeLabels: false,
        defaultEdgeType: 'arrow',
        allowInvalidContainer: true,
      })

      sigmaRef.current.on('enterNode', ({ node }: { node: string }) => {
        const n = nodeMap.get(node)
        if (n) {
          setHovered({
            id: n.id,
            term: n.term,
            subject: n.subject,
            year: n.year,
            term_period: n.term_period,
            unit: n.unit,
            chapter: n.chapter,
            is_introduction: n.is_introduction,
          })
        }
      })
      sigmaRef.current.on('leaveNode', () => setHovered(null))
    } catch (e) {
      console.error('Sigma init error:', e)
    }

    return () => {
      sigmaRef.current?.kill()
      sigmaRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphData, selectedSubjects, selectedNatures, crossSubjectOnly])

  const toggleSubject = (s: string) => {
    setSelectedSubjects(prev => {
      const next = new Set(prev)
      if (next.has(s)) next.delete(s)
      else next.add(s)
      return next
    })
  }

  const toggleNature = (n: string) => {
    setSelectedNatures(prev => {
      const next = new Set(prev)
      if (next.has(n)) next.delete(n)
      else next.add(n)
      return next
    })
  }

  return (
    <div className="flex h-[calc(100vh-0px)] relative">
      {/* Filter sidebar */}
      <div className={`flex-shrink-0 bg-white border-r border-slate-200 overflow-y-auto transition-all ${filterOpen ? 'w-56' : 'w-10'}`}>
        <div className="flex items-center justify-between p-3 border-b border-slate-100">
          {filterOpen && <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Filters</span>}
          <button
            onClick={() => setFilterOpen(p => !p)}
            className="text-slate-400 hover:text-slate-700 text-sm ml-auto"
          >
            {filterOpen ? '←' : '→'}
          </button>
        </div>

        {filterOpen && (
          <div className="p-4 space-y-5">
            {/* Subjects */}
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Subject</div>
              {SUBJECTS.map(s => (
                <label key={s} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSubjects.has(s)}
                    onChange={() => toggleSubject(s)}
                    className="rounded"
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: SUBJECT_COLOURS[s] }}
                  />
                  <span className="text-sm text-slate-700">{s}</span>
                </label>
              ))}
            </div>

            {/* Edge nature */}
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Edge Nature</div>
              {EDGE_NATURES.map(n => (
                <label key={n} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedNatures.has(n)}
                    onChange={() => toggleNature(n)}
                    className="rounded"
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: EDGE_NATURE_COLOURS[n] }}
                  />
                  <span className="text-sm text-slate-700 capitalize">{n}</span>
                </label>
              ))}
            </div>

            {/* Year range */}
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Year Range</div>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min={3} max={6}
                  value={yearFrom}
                  onChange={e => setYearFrom(Number(e.target.value))}
                  className="w-14 border border-slate-200 rounded text-sm px-2 py-1"
                />
                <span className="text-slate-400 text-sm">–</span>
                <input
                  type="number"
                  min={3} max={6}
                  value={yearTo}
                  onChange={e => setYearTo(Number(e.target.value))}
                  className="w-14 border border-slate-200 rounded text-sm px-2 py-1"
                />
              </div>
            </div>

            {/* Cross-subject only */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={crossSubjectOnly}
                  onChange={e => setCrossSubjectOnly(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-slate-700">Cross-subject only</span>
              </label>
            </div>

            <button
              onClick={loadGraph}
              className="w-full bg-slate-900 text-white text-sm py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Graph area */}
      <div className="flex-1 relative bg-slate-50">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm z-10">
            Loading graph…
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm max-w-md">
              {error}
            </div>
          </div>
        )}
        {!loading && !error && graphData && graphData.nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm z-10">
            No confirmed edges yet. Confirm edges in the Anvil app to populate the graph.
          </div>
        )}

        <div ref={containerRef} className="w-full h-full" style={{ minHeight: 'calc(100vh - 0px)' }} />

        {/* Hover tooltip */}
        {hovered && (
          <div className="absolute top-4 right-4 bg-white border border-slate-200 shadow-lg rounded-xl p-4 max-w-xs z-20">
            <div className="text-base font-bold text-slate-900 mb-1">{hovered.term}</div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${SUBJECT_BG[hovered.subject] ?? 'bg-slate-100'}`}>
                {hovered.subject}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${hovered.is_introduction ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                {hovered.is_introduction ? 'INTRO' : 'RECUR'}
              </span>
            </div>
            <div className="text-xs text-slate-500 space-y-0.5">
              <div><span className="font-medium">Year:</span> {hovered.year} · {hovered.term_period}</div>
              <div><span className="font-medium">Unit:</span> {hovered.unit}</div>
              {hovered.chapter && <div><span className="font-medium">Chapter:</span> {hovered.chapter}</div>}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white border border-slate-200 rounded-xl shadow p-4 text-xs z-20">
          <div className="font-semibold text-slate-600 mb-2 uppercase tracking-wide">Legend</div>
          <div className="mb-3">
            <div className="text-slate-400 mb-1">Subjects</div>
            {SUBJECTS.map(s => (
              <div key={s} className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: SUBJECT_COLOURS[s] }} />
                <span className="text-slate-700">{s}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="text-slate-400 mb-1">Edge Nature</div>
            {EDGE_NATURES.map(n => (
              <div key={n} className="flex items-center gap-2 mb-1">
                <span className="w-4 h-0.5 inline-block rounded" style={{ backgroundColor: EDGE_NATURE_COLOURS[n] }} />
                <span className={`px-1.5 py-0.5 rounded text-xs ${EDGE_NATURE_BG[n] ?? ''}`}>{n}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Node count badge */}
        {graphData && (
          <div className="absolute top-4 left-4 bg-white border border-slate-200 rounded-full shadow px-3 py-1 text-xs text-slate-500 z-20">
            {graphData.node_count} nodes · {graphData.edge_count} edges
          </div>
        )}
      </div>
    </div>
  )
}
