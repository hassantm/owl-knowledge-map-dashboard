import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import louvain from 'graphology-communities-louvain'
import Graph from 'graphology'
import { fetchGraph, fetchSemanticClusters, type GraphParams, type SemanticClusterResponse } from '../lib/api'
import { EDGE_NATURE_COLOURS, SUBJECT_COLOURS } from '../lib/colours'
import {
  buildFGData, buildSemanticFGData, nodeNeighbours,
  communityColour,
  type FGNode, type FGLink, type FilterState,
} from '../lib/graphUtils'

const EDGE_NATURES = ['reinforcement', 'extension', 'application'] as const
const SUBJECTS = ['History', 'Geography', 'Religion'] as const
type LayoutMode = 'force' | 'community' | 'semantic'

interface SelectedNode {
  label: string; subject?: string; year?: number; term_period?: string
  unit?: string; chapter?: string; is_introduction?: boolean
  cluster?: number; cluster_label?: string
  term_in_context?: string
  degree: number
  neighbours: Array<{ label: string; subject: string; edge_nature: string }>
}

export default function GraphView() {
  const mountRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphInstanceRef = useRef<any>(null)

  const [graphData, setGraphData] = useState<import('../lib/api').GraphResponse | null>(null)
  const [semanticData, setSemanticData] = useState<SemanticClusterResponse | null>(null)
  const [semanticClusters, setSemanticClusters] = useState(10)
  const [communityMap, setCommunityMap] = useState<Record<string, number>>({})
  const [selected, setSelected] = useState<SelectedNode | null>(null)
  const [loading, setLoading] = useState(true)
  const [semanticLoading, setSemanticLoading] = useState(false)
  const [semanticElapsed, setSemanticElapsed] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('force')
  const [filterOpen, setFilterOpen] = useState(true)
  const [nodeCount, setNodeCount] = useState(0)
  const [linkCount, setLinkCount] = useState(0)

  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set(SUBJECTS))
  const [selectedNatures, setSelectedNatures] = useState<Set<string>>(new Set(['reinforcement', 'extension', 'application']))
  const [crossSubjectOnly, setCrossSubjectOnly] = useState(false)
  const [yearFrom, setYearFrom] = useState(3)
  const [yearTo, setYearTo] = useState(6)

  useEffect(() => {
    if (!mountRef.current) return
    let fg: any = null
    import('3d-force-graph').then(mod => {
      const ForceGraph3D = mod.default
      fg = ForceGraph3D()
      fg(mountRef.current)
      fg.backgroundColor('#020617')
        .nodeLabel('label')
        .nodeColor((n: FGNode) => n.color)
        .nodeVal((n: FGNode) => n.size ?? 4)
        .nodeOpacity(0.9)
        .linkColor((l: FGLink) => l.color)
        .linkWidth(0.8)
        .linkOpacity(0.6)
        .linkDirectionalArrowLength(4)
        .linkDirectionalArrowRelPos(1)
        .linkDirectionalParticles(1)
        .linkDirectionalParticleWidth(1.5)
        .onNodeClick((node: FGNode) => {
          const links: FGLink[] = fg.graphData().links
          const nodeMap = new Map<string, FGNode>(
            fg.graphData().nodes.map((n: FGNode) => [n.id, n])
          )
          const neighbours = nodeNeighbours(node.id, links, nodeMap)
          setSelected({
            label: node.label, subject: node.subject, year: node.year,
            term_period: node.term_period, unit: node.unit, chapter: node.chapter,
            is_introduction: node.is_introduction,
            term_in_context: node.term_in_context,
            cluster: node.cluster, cluster_label: node.cluster_label,
            degree: neighbours.length, neighbours,
          })
          const d = 80, x = node.x ?? 0, y = node.y ?? 0, z = node.z ?? 0
          fg.cameraPosition({ x: x + d, y: y + d, z: z + d }, { x, y, z }, 800)
        })
        .onBackgroundClick(() => setSelected(null))
      graphInstanceRef.current = fg
    }).catch(e => setError(`Failed to load 3D graph: ${e.message}`))

    return () => {
      if (fg && mountRef.current) {
        mountRef.current.innerHTML = ''
      }
      graphInstanceRef.current = null
    }
  }, [])

  const filter: FilterState = useMemo(() => ({
    selectedSubjects, selectedNatures, crossSubjectOnly,
  }), [selectedSubjects, selectedNatures, crossSubjectOnly])

  const fgData = useMemo(() => {
    if (layoutMode === 'semantic') return semanticData ? buildSemanticFGData(semanticData.nodes) : { nodes: [], links: [] }
    if (!graphData) return { nodes: [], links: [] }
    return buildFGData(graphData, filter, communityMap, layoutMode === 'community')
  }, [graphData, semanticData, layoutMode, filter, communityMap])

  useEffect(() => {
    const fg = graphInstanceRef.current
    if (!fg) return
    fg.graphData(fgData)
    fg.cooldownTicks(layoutMode === 'semantic' ? 1 : 200)
    if (layoutMode === 'semantic') {
      fg.linkDirectionalArrowLength(0).linkDirectionalParticles(0)
    } else {
      fg.linkDirectionalArrowLength(4).linkDirectionalParticles(1)
    }
    setNodeCount(fgData.nodes.length)
    setLinkCount(fgData.links.length)
  }, [fgData, layoutMode])

  const loadGraph = useCallback(() => {
    setLoading(true); setError(null)
    fetchGraph({ yearFrom, yearTo } as GraphParams)
      .then(setGraphData).catch(e => setError(String(e))).finally(() => setLoading(false))
  }, [yearFrom, yearTo])
  useEffect(() => { loadGraph() }, [loadGraph])

  useEffect(() => {
    if (layoutMode !== 'semantic') return
    setSemanticLoading(true)
    fetchSemanticClusters(semanticClusters)
      .then(setSemanticData).catch(e => setError(String(e))).finally(() => setSemanticLoading(false))
  }, [layoutMode, semanticClusters])

  // Elapsed-time counter for semantic loading — reassures the user it hasn't hung
  useEffect(() => {
    if (!semanticLoading) {
      setSemanticElapsed(0)
      return
    }
    setSemanticElapsed(0)
    const id = setInterval(() => setSemanticElapsed(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [semanticLoading])

  useEffect(() => {
    if (layoutMode !== 'community' || !graphData) return
    try {
      const g = new Graph()
      graphData.nodes.forEach(n => g.hasNode(String(n.id)) || g.addNode(String(n.id)))
      graphData.edges.forEach(e => {
        const k = `${e.source}-${e.target}`
        if (!g.hasEdge(k) && g.hasNode(String(e.source)) && g.hasNode(String(e.target)))
          g.addEdgeWithKey(k, String(e.source), String(e.target))
      })
      setCommunityMap(louvain(g))
    } catch { setCommunityMap({}) }
  }, [layoutMode, graphData])

  const toggleSet = (set: Set<string>, key: string) => {
    const next = new Set(set); next.has(key) ? next.delete(key) : next.add(key); return next
  }
  const communityCount = new Set(Object.values(communityMap)).size

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Filter sidebar */}
      <div className={`flex-shrink-0 bg-white border-r border-slate-200 overflow-y-auto transition-[width] duration-200 z-10 ${filterOpen ? 'w-60' : 'w-10'}`}>
        <div className="flex items-center p-3 border-b border-slate-100 gap-2">
          {filterOpen && <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide flex-1">Filters</span>}
          <button
            onClick={() => setFilterOpen(p => !p)}
            className="text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer ml-auto"
          >
            {filterOpen ? '←' : '→'}
          </button>
        </div>
        {filterOpen && (
          <div className="p-4">
            <Section label="Layout">
              {(['force', 'community', 'semantic'] as LayoutMode[]).map(mode => (
                <label key={mode} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                  <input type="radio" name="layout" checked={layoutMode === mode} onChange={() => setLayoutMode(mode)} />
                  <span className="text-[13px] text-slate-700 capitalize">{mode}</span>
                  {mode === 'community' && communityCount > 0 && (
                    <span className="text-[11px] text-slate-400">({communityCount})</span>
                  )}
                </label>
              ))}
              {layoutMode === 'semantic' && (
                <div className="mt-2">
                  <div className="text-[11px] text-slate-400 mb-1">Clusters: {semanticClusters}</div>
                  <input
                    type="range" min={3} max={20} value={semanticClusters}
                    onChange={e => setSemanticClusters(+e.target.value)}
                    className="w-full"
                  />
                </div>
              )}
            </Section>

            {layoutMode !== 'semantic' && <>
              <Section label="Subject">
                {SUBJECTS.map(s => (
                  <label key={s} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                    <input type="checkbox" checked={selectedSubjects.has(s)} onChange={() => setSelectedSubjects(prev => toggleSet(prev, s))} />
                    <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ background: SUBJECT_COLOURS[s] }} />
                    <span className="text-[13px] text-slate-700">{s}</span>
                  </label>
                ))}
              </Section>
              <Section label="Connection">
                {EDGE_NATURES.map(n => (
                  <label key={n} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                    <input type="checkbox" checked={selectedNatures.has(n)} onChange={() => setSelectedNatures(prev => toggleSet(prev, n))} />
                    <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ background: EDGE_NATURE_COLOURS[n] }} />
                    <span className="text-[13px] text-slate-700 capitalize">{n}</span>
                  </label>
                ))}
              </Section>
              <Section label="Year Range">
                <div className="flex gap-2 items-center">
                  <input
                    type="number" min={3} max={6} value={yearFrom}
                    onChange={e => setYearFrom(+e.target.value)}
                    className="w-14 border border-slate-200 rounded px-2 py-1 text-[13px]"
                  />
                  <span className="text-slate-400">–</span>
                  <input
                    type="number" min={3} max={6} value={yearTo}
                    onChange={e => setYearTo(+e.target.value)}
                    className="w-14 border border-slate-200 rounded px-2 py-1 text-[13px]"
                  />
                </div>
              </Section>
              <label className="flex items-center gap-2 cursor-pointer mb-4">
                <input type="checkbox" checked={crossSubjectOnly} onChange={e => setCrossSubjectOnly(e.target.checked)} />
                <span className="text-[13px] text-slate-700">Cross-subject only</span>
              </label>
              <button
                onClick={loadGraph}
                className="w-full bg-slate-950 text-white text-[13px] py-2 rounded-lg border-0 cursor-pointer hover:bg-slate-800 transition-colors"
              >
                Apply
              </button>
            </>}
          </div>
        )}
      </div>

      {/* 3D canvas */}
      <div className="flex-1 relative bg-[#020617] overflow-hidden">
        {(loading || semanticLoading) && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-950/70">
            <div className="flex flex-col items-center gap-4 text-center">
              {/* Spinner */}
              <svg
                className="animate-spin"
                width="40" height="40" viewBox="0 0 40 40"
                fill="none" xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="20" cy="20" r="16" stroke="#334155" strokeWidth="4" />
                <path
                  d="M20 4 A16 16 0 0 1 36 20"
                  stroke="#865595" strokeWidth="4" strokeLinecap="round"
                />
              </svg>

              <div>
                <div className="text-slate-200 text-sm font-medium">
                  {semanticLoading ? 'Computing semantic clusters…' : 'Loading graph…'}
                </div>
                {semanticLoading && (
                  <>
                    <div className="text-slate-500 text-xs mt-1 tabular-nums">
                      {semanticElapsed}s elapsed
                    </div>
                    {semanticElapsed >= 8 && (
                      <div className="text-slate-500 text-xs mt-2 max-w-[240px] leading-relaxed">
                        The sentence-transformer model is loading on first use — this is a one-time cost per server restart.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-red-950 border border-red-800 rounded-lg p-4 text-red-300 text-[13px] max-w-[400px]">
              {error}
            </div>
          </div>
        )}

        <div ref={mountRef} className="w-full h-full" />

        {/* Stats badge */}
        <div className="absolute top-4 left-4 bg-slate-800/80 border border-slate-700 rounded-full px-3 py-1 text-xs text-slate-400 z-10 pointer-events-none">
          {nodeCount} nodes · {linkCount} edges · drag to rotate · scroll to zoom
        </div>

        {/* Semantic cluster legend */}
        {layoutMode === 'semantic' && semanticData && (
          <div className="absolute bottom-4 right-4 bg-slate-950/90 border border-slate-700 rounded-xl p-3.5 z-10 max-w-[220px] max-h-[60vh] overflow-y-auto">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2.5">
              Semantic clusters · node colour
            </div>
            {Object.entries(semanticData.cluster_labels).map(([id, label]) => (
              <div key={id} className="flex items-start gap-2 mb-[7px]">
                <span
                  className="w-3 h-3 rounded-full inline-block shrink-0 mt-0.5"
                  style={{ background: communityColour(Number(id)) }}
                />
                <span className="text-[11px] text-slate-400 leading-snug">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Selected node panel */}
        {selected && (
          <div className="absolute top-4 right-4 bg-slate-950/95 border border-slate-700 rounded-2xl p-5 w-[272px] z-20 text-slate-100">
            <div className="flex justify-between items-start mb-3">
              <div className="font-bold text-[15px] leading-tight flex-1">{selected.label}</div>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-500 hover:text-slate-300 bg-transparent border-none cursor-pointer text-lg ml-2 leading-none"
              >
                ×
              </button>
            </div>
            <div className="text-xs text-slate-400 mb-3 pb-3 border-b border-slate-800">
              {selected.subject && (
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-slate-200">
                    {selected.subject}{selected.year ? ` · Year ${selected.year}` : ''}
                  </span>
                  {selected.is_introduction !== undefined && (
                    <span className={`text-[10px] font-semibold uppercase tracking-wide px-[7px] py-[2px] rounded-full ${
                      selected.is_introduction
                        ? 'bg-emerald-900 text-emerald-300'
                        : 'bg-blue-900 text-blue-300'
                    }`}>
                      {selected.is_introduction ? 'Introduction' : 'Recurrence'}
                    </span>
                  )}
                </div>
              )}
              {selected.term_period && <div>{selected.term_period}</div>}
              {selected.unit && (
                <div className="mt-0.5 truncate" title={selected.unit}>{selected.unit}</div>
              )}
              {selected.cluster_label && <div className="italic mt-1">{selected.cluster_label}</div>}
            </div>
            {selected.term_in_context && (
              <div className="text-xs text-slate-400 leading-relaxed mb-3 pb-3 border-b border-slate-800">
                <HighlightedContext text={selected.term_in_context} term={selected.label} />
              </div>
            )}
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
              {selected.degree} connection{selected.degree !== 1 ? 's' : ''}
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {selected.neighbours.map((nb, i) => (
                <div key={i} className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="text-slate-300 flex-1 truncate">{nb.label}</span>
                  <span className="text-[10px] text-slate-500 ml-2 shrink-0 capitalize">{nb.edge_nature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function HighlightedContext({ text, term }: { text: string; term: string }) {
  if (!text) return null
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === term.toLowerCase()
          ? <strong key={i} className="text-slate-100 font-bold">{part}</strong>
          : <span key={i}>{part}</span>
      )}
    </span>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">{label}</div>
      {children}
    </div>
  )
}
