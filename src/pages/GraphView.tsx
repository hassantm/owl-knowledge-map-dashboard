import { useEffect, useRef, useState, useCallback } from 'react'
import Graph from 'graphology'
import Sigma from 'sigma'
import forceAtlas2 from 'graphology-layout-forceatlas2'
import louvain from 'graphology-communities-louvain'
import { fetchGraph, fetchSemanticClusters, type GraphParams, type GraphNode, type SemanticClusterResponse } from '../lib/api'
import { SUBJECT_COLOURS, EDGE_NATURE_COLOURS, SUBJECT_BG, EDGE_NATURE_BG } from '../lib/colours'

const COMMUNITY_COLOURS = [
  '#f97316', '#8b5cf6', '#10b981', '#ef4444', '#3b82f6',
  '#f59e0b', '#ec4899', '#14b8a6', '#a855f7', '#84cc16',
  '#06b6d4', '#e11d48', '#d97706', '#7c3aed', '#059669',
]

const EDGE_NATURES = ['reinforcement', 'extension', 'application'] as const
const SUBJECTS = ['History', 'Geography', 'Religion'] as const

type LayoutMode = 'curriculum' | 'force' | 'community' | 'semantic'

interface SelectedNode extends GraphNode {
  degree: number
  neighbours: Array<{ id: number; term: string; subject: string; edge_nature: string }>
}

function getCommunityColour(id: number) {
  return COMMUNITY_COLOURS[id % COMMUNITY_COLOURS.length]
}

export default function GraphView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sigmaRef = useRef<Sigma | null>(null)

  const [graphData, setGraphData] = useState<import('../lib/api').GraphResponse | null>(null)
  const [selected, setSelected] = useState<SelectedNode | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('force')
  const [communityMap, setCommunityMap] = useState<Record<string, number>>({})
  const [semanticData, setSemanticData] = useState<SemanticClusterResponse | null>(null)
  const [semanticClusters, setSemanticClusters] = useState(8)
  const [semanticLoading, setSemanticLoading] = useState(false)

  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set(['History', 'Geography', 'Religion']))
  const [selectedNatures, setSelectedNatures] = useState<Set<string>>(new Set(['extension', 'application']))
  const [yearFrom, setYearFrom] = useState(3)
  const [yearTo, setYearTo] = useState(6)
  const [crossSubjectOnly, setCrossSubjectOnly] = useState(false)
  const [filterOpen, setFilterOpen] = useState(true)

  const loadGraph = () => {
    setLoading(true)
    setError(null)
    fetchGraph({ yearFrom, yearTo } as GraphParams)
      .then(data => setGraphData(data))
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadGraph() }, []) // eslint-disable-line

  useEffect(() => {
    if (!containerRef.current || !graphData) return
    if (sigmaRef.current) { sigmaRef.current.kill(); sigmaRef.current = null }

    const graph = new Graph()

    const filteredEdges = graphData.edges.filter(e => {
      if (!selectedNatures.has(e.edge_nature)) return false
      if (crossSubjectOnly && e.edge_type !== 'cross_subject') return false
      return true
    })
    const activeNodeIds = new Set<number>()
    filteredEdges.forEach(e => { activeNodeIds.add(e.source); activeNodeIds.add(e.target) })
    const filteredNodes = graphData.nodes.filter(n =>
      activeNodeIds.has(n.id) && selectedSubjects.has(n.subject)
    )

    if (filteredNodes.length === 0) return

    const degreeMap: Record<string, number> = {}
    filteredEdges.forEach(e => {
      degreeMap[String(e.source)] = (degreeMap[String(e.source)] ?? 0) + 1
      degreeMap[String(e.target)] = (degreeMap[String(e.target)] ?? 0) + 1
    })
    const maxDegree = Math.max(...Object.values(degreeMap), 1)

    const subjectIndex: Record<string, number> = { History: 0, Geography: 1, Religion: 2 }
    filteredNodes.forEach(node => {
      if (graph.hasNode(String(node.id))) return
      const si = subjectIndex[node.subject] ?? 0
      const x = layoutMode === 'curriculum'
        ? node.curriculum_position * 5 + Math.random() * 2
        : Math.random() * 200 - 100
      const y = layoutMode === 'curriculum'
        ? si * 50 + Math.random() * 10
        : Math.random() * 200 - 100
      const degree = degreeMap[String(node.id)] ?? 1
      const size = 2 + (degree / maxDegree) * 8

      graph.addNode(String(node.id), {
        label: node.term,
        x, y, size,
        color: SUBJECT_COLOURS[node.subject] ?? '#888',
        originalColor: SUBJECT_COLOURS[node.subject] ?? '#888',
        subject: node.subject,
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
          size: edge.edge_nature === 'application' ? 1.5 : edge.edge_nature === 'extension' ? 1 : 0.5,
          type: 'arrow',
          edge_nature: edge.edge_nature,
        })
      } catch { /* skip */ }
    })

    let communities: Record<string, number> = {}
    try {
      communities = louvain(graph)
      setCommunityMap(communities)
    } catch { setCommunityMap({}) }

    if (layoutMode === 'community') {
      // Pre-position nodes in a circle-of-circles so each community starts
      // in its own spatial zone before ForceAtlas2 refines within it.
      const communityGroups: Record<number, string[]> = {}
      graph.forEachNode(node => {
        const cid = communities[node] ?? 0
        if (!communityGroups[cid]) communityGroups[cid] = []
        communityGroups[cid].push(node)
      })
      const communityIds = Object.keys(communityGroups).map(Number)
      const numCommunities = communityIds.length
      const outerRadius = 600
      communityIds.forEach((cid, ci) => {
        const angle = (2 * Math.PI * ci) / numCommunities
        const cx = outerRadius * Math.cos(angle)
        const cy = outerRadius * Math.sin(angle)
        const members = communityGroups[cid]
        const innerRadius = Math.max(40, members.length * 8)
        members.forEach((node, ni) => {
          const a = (2 * Math.PI * ni) / members.length
          graph.setNodeAttribute(node, 'x', cx + innerRadius * Math.cos(a))
          graph.setNodeAttribute(node, 'y', cy + innerRadius * Math.sin(a))
        })
      })
      try {
        forceAtlas2.assign(graph, {
          iterations: 300,
          settings: { gravity: 0.05, scalingRatio: 80, strongGravityMode: false, linLogMode: true, barnesHutOptimize: graph.order > 200 }
        })
      } catch (e) { console.warn('ForceAtlas2 failed', e) }
      graph.forEachNode(node => {
        const cid = communities[node] ?? 0
        graph.setNodeAttribute(node, 'color', getCommunityColour(cid))
      })
    }

    if (layoutMode === 'force') {
      try {
        forceAtlas2.assign(graph, {
          iterations: 400,
          settings: { gravity: 0.1, scalingRatio: 80, linLogMode: true, strongGravityMode: false, barnesHutOptimize: graph.order > 200 }
        })
      } catch (e) { console.warn('ForceAtlas2 failed', e) }
    }

    try {
      sigmaRef.current = new Sigma(graph, containerRef.current!, {
        renderEdgeLabels: false,
        defaultEdgeType: 'arrow',
        allowInvalidContainer: true,
        labelRenderedSizeThreshold: 6,
        labelSize: 11,
        labelWeight: '500',
        nodeReducer: (node, data) => {
          const res = { ...data }
          if (hovered && node !== hovered) {
            const neighbours = new Set(graph.neighbors(hovered))
            if (!neighbours.has(node)) {
              res.color = '#e2e8f0'
              res.label = ''
            }
          }
          return res
        },
        edgeReducer: (edge, data) => {
          const res = { ...data }
          if (hovered) {
            const [src, tgt] = graph.extremities(edge)
            if (src !== hovered && tgt !== hovered) res.color = '#f1f5f9'
          }
          return res
        },
      })

      sigmaRef.current.on('enterNode', ({ node }) => {
        setHovered(node)
        sigmaRef.current?.refresh()
      })
      sigmaRef.current.on('leaveNode', () => {
        setHovered(null)
        sigmaRef.current?.refresh()
      })
      sigmaRef.current.on('clickNode', ({ node }) => {
        const n = graphData.nodes.find(x => String(x.id) === node)
        if (!n) return
        const degree = degreeMap[node] ?? 0
        const neighbourEdges = filteredEdges.filter(e =>
          String(e.source) === node || String(e.target) === node
        )
        const neighbours = neighbourEdges.map(e => {
          const otherId = String(e.source) === node ? e.target : e.source
          const other = graphData.nodes.find(x => x.id === otherId)
          return { id: otherId, term: other?.term ?? String(otherId), subject: other?.subject ?? '', edge_nature: e.edge_nature }
        })
        setSelected({ ...n, degree, neighbours })
      })
      sigmaRef.current.on('clickStage', () => setSelected(null))
    } catch (e) { console.error('Sigma init error:', e) }

    return () => { sigmaRef.current?.kill(); sigmaRef.current = null }
  }, [graphData, selectedSubjects, selectedNatures, crossSubjectOnly, layoutMode]) // eslint-disable-line


  // Fetch semantic clusters when switching to semantic mode
  useEffect(() => {
    if (layoutMode !== 'semantic') return
    setSemanticLoading(true)
    fetchSemanticClusters(semanticClusters)
      .then(data => {
        setSemanticData(data)
        setSemanticLoading(false)
      })
      .catch(e => { setError(String(e)); setSemanticLoading(false) })
  }, [layoutMode, semanticClusters])

  // Render semantic graph separately
  useEffect(() => {
    if (layoutMode !== 'semantic' || !semanticData || !containerRef.current) return
    if (sigmaRef.current) { sigmaRef.current.kill(); sigmaRef.current = null }

    const graph = new Graph({ multi: false })
    const degreeMap: Record<string, number> = {}

    semanticData.nodes.forEach(node => {
      const key = String(node.concept_id)
      if (graph.hasNode(key)) return
      graph.addNode(key, {
        label: node.term,
        x: node.x,
        y: node.y,
        size: 4,
        color: getCommunityColour(node.cluster),
        subject: node.subject,
        year: node.year,
        cluster: node.cluster,
        cluster_label: node.cluster_label,
      })
    })

    try {
      sigmaRef.current = new Sigma(graph, containerRef.current!, {
        renderEdgeLabels: false,
        allowInvalidContainer: true,
        labelRenderedSizeThreshold: 5,
        labelSize: 11,
        labelWeight: '500',
      })
      sigmaRef.current.on('clickNode', ({ node }) => {
        const n = semanticData.nodes.find(x => String(x.concept_id) === node)
        if (!n) return
        // Reuse selected panel — map SemanticNode to SelectedNode shape
        setSelected({
          id: n.concept_id,
          concept_id: n.concept_id,
          term: n.term,
          subject: n.subject,
          year: n.year,
          term_period: '',
          unit: n.cluster_label,
          chapter: `Semantic cluster ${n.cluster}`,
          is_introduction: false,
          curriculum_position: 0,
          degree: 0,
          neighbours: [],
        })
      })
      sigmaRef.current.on('clickStage', () => setSelected(null))
    } catch (e) { console.error('Sigma semantic init error:', e) }

    return () => { sigmaRef.current?.kill(); sigmaRef.current = null }
  }, [semanticData, layoutMode])

  useEffect(() => { sigmaRef.current?.refresh() }, [hovered])

  const toggleSubject = useCallback((s: string) => {
    setSelectedSubjects(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n })
  }, [])
  const toggleNature = useCallback((n: string) => {
    setSelectedNatures(prev => { const next = new Set(prev); next.has(n) ? next.delete(n) : next.add(n); return next })
  }, [])

  const communityCount = new Set(Object.values(communityMap)).size

  return (
    <div className="flex h-[calc(100vh-0px)] relative">
      {/* Sidebar */}
      <div className={`flex-shrink-0 bg-white border-r border-slate-200 overflow-y-auto transition-all duration-200 ${filterOpen ? 'w-60' : 'w-10'}`}>
        <div className="flex items-center justify-between p-3 border-b border-slate-100">
          {filterOpen && <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Filters</span>}
          <button onClick={() => setFilterOpen(p => !p)} className="text-slate-400 hover:text-slate-700 text-sm ml-auto">
            {filterOpen ? '←' : '→'}
          </button>
        </div>

        {filterOpen && (
          <div className="p-4 space-y-5">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Layout</div>
              {(['curriculum', 'force', 'community', 'semantic'] as LayoutMode[]).map(mode => (
                <label key={mode} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                  <input type="radio" name="layout" checked={layoutMode === mode} onChange={() => setLayoutMode(mode)} />
                  <span className="text-sm text-slate-700 capitalize">{mode}</span>
                  {mode === 'community' && communityCount > 0 && (
                    <span className="text-xs text-slate-400">({communityCount})</span>
                  )}
                  {mode === 'semantic' && semanticData && (
                    <span className="text-xs text-slate-400">({semanticData.num_clusters})</span>
                  )}
                </label>
              ))}
              <p className="text-xs text-slate-400 mt-1 leading-snug">
                {layoutMode === 'community' && 'Louvain clusters — concepts grouped by graph connections, not time.'}
                {layoutMode === 'force' && 'ForceAtlas2 — connected concepts pull together naturally.'}
                {layoutMode === 'curriculum' && 'Chronological — concepts laid out by year and subject.'}
                {layoutMode === 'semantic' && 'Embedding space — concepts placed by meaning of their paragraph context, ignoring all curriculum structure.'}
              </p>
              {layoutMode === 'semantic' && (
                <div className="mt-2">
                  <label className="text-xs text-slate-500 block mb-1">Clusters: {semanticClusters}</label>
                  <input
                    type="range" min={3} max={20} step={1}
                    value={semanticClusters}
                    onChange={e => setSemanticClusters(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Subject</div>
              {SUBJECTS.map(s => (
                <label key={s} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                  <input type="checkbox" checked={selectedSubjects.has(s)} onChange={() => toggleSubject(s)} className="rounded" />
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: SUBJECT_COLOURS[s] }} />
                  <span className="text-sm text-slate-700">{s}</span>
                </label>
              ))}
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Connection Type</div>
              {EDGE_NATURES.map(n => (
                <label key={n} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                  <input type="checkbox" checked={selectedNatures.has(n)} onChange={() => toggleNature(n)} className="rounded" />
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: EDGE_NATURE_COLOURS[n] }} />
                  <span className="text-sm text-slate-700 capitalize">{n}</span>
                </label>
              ))}
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Year Range</div>
              <div className="flex gap-2 items-center">
                <input type="number" min={3} max={6} value={yearFrom} onChange={e => setYearFrom(Number(e.target.value))}
                  className="w-14 border border-slate-200 rounded text-sm px-2 py-1" />
                <span className="text-slate-400 text-sm">–</span>
                <input type="number" min={3} max={6} value={yearTo} onChange={e => setYearTo(Number(e.target.value))}
                  className="w-14 border border-slate-200 rounded text-sm px-2 py-1" />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={crossSubjectOnly} onChange={e => setCrossSubjectOnly(e.target.checked)} className="rounded" />
              <span className="text-sm text-slate-700">Cross-subject only</span>
            </label>

            <button onClick={loadGraph}
              className="w-full bg-slate-900 text-white text-sm py-2 rounded-lg hover:bg-slate-700 transition-colors">
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Graph */}
      <div className="flex-1 relative bg-slate-50">
        {(loading || semanticLoading) && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm z-10 bg-slate-50/80 backdrop-blur-sm">
            {semanticLoading ? (
              <div className="text-center">
                <div className="text-slate-600 font-medium mb-1">Computing semantic clusters…</div>
                <div className="text-xs text-slate-400">Embedding {semanticData ? 'updated' : 'all concepts'} — first run downloads ~80MB model</div>
              </div>
            ) : 'Loading graph…'}
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm max-w-md">{error}</div>
          </div>
        )}
        {!loading && !error && graphData?.nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm z-10">
            No confirmed edges yet. Confirm edges in the Anvil app to populate the graph.
          </div>
        )}

        <div ref={containerRef} className="w-full h-full" style={{ minHeight: 'calc(100vh - 0px)' }} />

        {graphData && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur border border-slate-200 rounded-full shadow-sm px-3 py-1 text-xs text-slate-500 z-20">
            {graphData.node_count} nodes · {graphData.edge_count} edges
          </div>
        )}

        {/* Selected node panel */}
        {selected && (
          <div className="absolute top-4 right-4 bg-white border border-slate-200 shadow-xl rounded-2xl p-5 w-72 z-20">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="text-base font-bold text-slate-900 leading-tight">{selected.term}</div>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SUBJECT_BG[selected.subject] ?? 'bg-slate-100 text-slate-600'}`}>
                    {selected.subject}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${selected.is_introduction ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {selected.is_introduction ? 'First introduced' : 'Recurring'}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-300 hover:text-slate-600 text-lg leading-none mt-0.5">×</button>
            </div>

            <div className="text-xs text-slate-500 space-y-1 mb-4 pb-4 border-b border-slate-100">
              <div><span className="font-medium text-slate-700">Year {selected.year}</span> · {selected.term_period}</div>
              <div className="truncate" title={selected.unit}>{selected.unit}</div>
              {selected.chapter && <div className="text-slate-400 truncate" title={selected.chapter}>{selected.chapter}</div>}
              {layoutMode === 'community' && communityMap[String(selected.id)] !== undefined && (
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: getCommunityColour(communityMap[String(selected.id)]) }} />
                  <span>Community {communityMap[String(selected.id)]}</span>
                </div>
              )}
            </div>

            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              {selected.degree} connection{selected.degree !== 1 ? 's' : ''}
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {selected.neighbours.map((nb, i) => (
                <div key={i} className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-700 truncate font-medium" title={nb.term}>{nb.term}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`px-1.5 py-0.5 rounded ${SUBJECT_BG[nb.subject] ?? 'bg-slate-100 text-slate-600'}`}>
                      {nb.subject.slice(0, 4)}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded ${EDGE_NATURE_BG[nb.edge_nature] ?? 'bg-slate-100 text-slate-500'}`}>
                      {nb.edge_nature.slice(0, 3)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur border border-slate-200 rounded-xl shadow-sm p-4 text-xs z-20">
          {layoutMode === 'semantic' ? (
            <>
              <div className="font-semibold text-slate-600 mb-2 uppercase tracking-wide">Semantic clusters</div>
              <div className="text-slate-400 mb-2 leading-snug max-w-[160px] text-xs">
                Position = meaning of paragraph context. No curriculum structure used.
              </div>
              {semanticData && Object.entries(semanticData.cluster_labels).slice(0, 8).map(([id, label]) => (
                <div key={id} className="flex items-start gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full inline-block mt-0.5 shrink-0" style={{ backgroundColor: getCommunityColour(Number(id)) }} />
                  <span className="text-slate-600 text-xs leading-snug">{label}</span>
                </div>
              ))}
            </>
          ) : layoutMode === 'community' ? (
            <>
              <div className="font-semibold text-slate-600 mb-2 uppercase tracking-wide">Communities</div>
              <div className="text-slate-400 mb-2 leading-snug max-w-[140px] text-xs">
                Colours = concept clusters by graph connection density (not time)
              </div>
            </>
          ) : (
            <>
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
                <div className="text-slate-400 mb-1">Connection type</div>
                {EDGE_NATURES.map(n => (
                  <div key={n} className="flex items-center gap-2 mb-1">
                    <span className="w-4 h-0.5 inline-block rounded" style={{ backgroundColor: EDGE_NATURE_COLOURS[n] }} />
                    <span className={`px-1.5 py-0.5 rounded ${EDGE_NATURE_BG[n] ?? ''}`}>{n}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="mt-3 pt-3 border-t border-slate-100 text-slate-400 leading-snug">
            Node size = connections<br />
            Click a node to explore
          </div>
        </div>
      </div>
    </div>
  )
}
