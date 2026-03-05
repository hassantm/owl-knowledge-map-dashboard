import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import louvain from 'graphology-communities-louvain'
import Graph from 'graphology'
import { fetchGraph, fetchSemanticClusters, type GraphParams, type SemanticClusterResponse } from '../lib/api'
import { EDGE_NATURE_COLOURS } from '../lib/colours'
import {
  buildFGData, buildSemanticFGData, nodeNeighbours,
  communityColour, SUBJECT_COLOURS,
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

  // Initialise 3d-force-graph imperatively (avoids react-force-graph's AFRAME dep)
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
          // Get neighbours from current graph data
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
  }, []) // once only

  // Push data into the graph instance whenever fgData changes
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

  // Load data
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
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: filterOpen ? 240 : 40, flexShrink: 0, background: 'white', borderRight: '1px solid #e2e8f0', overflowY: 'auto', transition: 'width 0.2s', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px', borderBottom: '1px solid #f1f5f9', gap: 8 }}>
          {filterOpen && <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', flex: 1 }}>Filters</span>}
          <button onClick={() => setFilterOpen(p => !p)} style={{ color: '#94a3b8', cursor: 'pointer', background: 'none', border: 'none', marginLeft: 'auto' }}>
            {filterOpen ? '←' : '→'}
          </button>
        </div>
        {filterOpen && (
          <div style={{ padding: 16 }}>
            <Section label="Layout">
              {(['force', 'community', 'semantic'] as LayoutMode[]).map(mode => (
                <label key={mode} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer' }}>
                  <input type="radio" name="layout" checked={layoutMode === mode} onChange={() => setLayoutMode(mode)} />
                  <span style={{ fontSize: 13, color: '#334155', textTransform: 'capitalize' }}>{mode}</span>
                  {mode === 'community' && communityCount > 0 && <span style={{ fontSize: 11, color: '#94a3b8' }}>({communityCount})</span>}
                </label>
              ))}
              {layoutMode === 'semantic' && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Clusters: {semanticClusters}</div>
                  <input type="range" min={3} max={20} value={semanticClusters}
                    onChange={e => setSemanticClusters(+e.target.value)} style={{ width: '100%' }} />
                </div>
              )}
            </Section>

            {layoutMode !== 'semantic' && <>
              <Section label="Subject">
                {SUBJECTS.map(s => (
                  <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer' }}>
                    <input type="checkbox" checked={selectedSubjects.has(s)} onChange={() => setSelectedSubjects(prev => toggleSet(prev, s))} />
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: SUBJECT_COLOURS[s], display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#334155' }}>{s}</span>
                  </label>
                ))}
              </Section>
              <Section label="Connection">
                {EDGE_NATURES.map(n => (
                  <label key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer' }}>
                    <input type="checkbox" checked={selectedNatures.has(n)} onChange={() => setSelectedNatures(prev => toggleSet(prev, n))} />
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: EDGE_NATURE_COLOURS[n], display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#334155', textTransform: 'capitalize' }}>{n}</span>
                  </label>
                ))}
              </Section>
              <Section label="Year Range">
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="number" min={3} max={6} value={yearFrom} onChange={e => setYearFrom(+e.target.value)}
                    style={{ width: 52, border: '1px solid #e2e8f0', borderRadius: 4, padding: '4px 8px', fontSize: 13 }} />
                  <span style={{ color: '#94a3b8' }}>–</span>
                  <input type="number" min={3} max={6} value={yearTo} onChange={e => setYearTo(+e.target.value)}
                    style={{ width: 52, border: '1px solid #e2e8f0', borderRadius: 4, padding: '4px 8px', fontSize: 13 }} />
                </div>
              </Section>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 16 }}>
                <input type="checkbox" checked={crossSubjectOnly} onChange={e => setCrossSubjectOnly(e.target.checked)} />
                <span style={{ fontSize: 13, color: '#334155' }}>Cross-subject only</span>
              </label>
              <button onClick={loadGraph} style={{ width: '100%', background: '#0f172a', color: 'white', fontSize: 13, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
                Apply
              </button>
            </>}
          </div>
        )}
      </div>

      {/* 3D canvas */}
      <div style={{ flex: 1, position: 'relative', background: '#020617', overflow: 'hidden' }}>
        {(loading || semanticLoading) && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, background: 'rgba(2,6,23,0.7)' }}>
            <span style={{ color: '#cbd5e1', fontSize: 14 }}>{semanticLoading ? 'Computing semantic clusters…' : 'Loading graph…'}</span>
          </div>
        )}
        {error && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <div style={{ background: '#450a0a', border: '1px solid #991b1b', borderRadius: 8, padding: 16, color: '#fca5a5', fontSize: 13, maxWidth: 400 }}>{error}</div>
          </div>
        )}

        {/* 3d-force-graph mounts here */}
        <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

        {/* Stats */}
        <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(30,41,59,0.8)', border: '1px solid #334155', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#94a3b8', zIndex: 10, pointerEvents: 'none' }}>
          {nodeCount} nodes · {linkCount} edges · drag to rotate · scroll to zoom
        </div>

        {/* Semantic legend */}
        {layoutMode === 'semantic' && semanticData && (
          <div style={{ position: 'absolute', bottom: 16, right: 16, background: 'rgba(15,23,42,0.92)', border: '1px solid #334155', borderRadius: 12, padding: 14, zIndex: 10, maxWidth: 220, maxHeight: '60vh', overflowY: 'auto' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              Semantic clusters · node colour
            </div>
            {Object.entries(semanticData.cluster_labels).map(([id, label]) => (
              <div key={id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 7 }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: communityColour(Number(id)), display: 'inline-block', flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Selected panel */}
        {selected && (
          <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(15,23,42,0.95)', border: '1px solid #334155', borderRadius: 16, padding: 20, width: 272, zIndex: 20, color: '#f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3, flex: 1 }}>{selected.label}</div>
              <button onClick={() => setSelected(null)} style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, marginLeft: 8 }}>×</button>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #1e293b' }}>
              {selected.subject && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{ color: '#e2e8f0' }}>{selected.subject}{selected.year ? ` · Year ${selected.year}` : ''}</span>
                  {selected.is_introduction !== undefined && (
                    <span style={{
                      fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                      padding: '2px 7px', borderRadius: 20,
                      background: selected.is_introduction ? '#064e3b' : '#1e3a5f',
                      color: selected.is_introduction ? '#6ee7b7' : '#93c5fd',
                    }}>
                      {selected.is_introduction ? 'Introduction' : 'Recurrence'}
                    </span>
                  )}
                </div>
              )}
              {selected.term_period && <div>{selected.term_period}</div>}
              {selected.unit && <div style={{ marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={selected.unit}>{selected.unit}</div>}
              {selected.cluster_label && <div style={{ fontStyle: 'italic', marginTop: 4 }}>{selected.cluster_label}</div>}
            </div>
            {selected.term_in_context && (
              <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #1e293b' }}>
                <HighlightedContext text={selected.term_in_context} term={selected.label} />
              </div>
            )}
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              {selected.degree} connection{selected.degree !== 1 ? 's' : ''}
            </div>
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
              {selected.neighbours.map((nb, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, fontSize: 12 }}>
                  <span style={{ color: '#cbd5e1', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nb.label}</span>
                  <span style={{ fontSize: 10, color: '#64748b', marginLeft: 8, flexShrink: 0, textTransform: 'capitalize' }}>{nb.edge_nature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** Renders the context paragraph with the key term bolded wherever it appears */
function HighlightedContext({ text, term }: { text: string; term: string }) {
  if (!text) return null
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === term.toLowerCase()
          ? <strong key={i} style={{ color: '#e2e8f0', fontWeight: 700 }}>{part}</strong>
          : <span key={i}>{part}</span>
      )}
    </span>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  )
}
