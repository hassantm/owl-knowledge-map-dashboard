import { useEffect, useState, useMemo, useRef, useLayoutEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchEdges, type EdgeListItem } from '../lib/api'

const SUBJECT_ORDER = ['History', 'Geography', 'Religion']
const YEAR_ORDER = [3, 4, 5, 6]

const NATURE_LABELS: Record<string, string> = {
  reinforcement: 'Reinforcement',
  extension: 'Extension',
  application: 'Application',
}

interface Theme {
  bg: string
  grid: string
  colHeader: string[]
  colTint: string[]
  rowLabel: string
  nodeFill: string[]
  nodeHalo: string
  label: string
  sub: string
  edgeBase: Record<string, string>
  edgeHi: Record<string, string>
  panel: string
  panelBorder: string
  panelText: string
  panelSub: string
  panelHover: string
  border: string
}

const LIGHT: Theme = {
  bg: '#fbf8f3',
  grid: '#e9e3d6',
  colHeader: ['#3b6fb6', '#5a8a4a', '#c8702a'],
  colTint: ['rgba(59,111,182,0.04)', 'rgba(90,138,74,0.05)', 'rgba(200,112,42,0.04)'],
  rowLabel: '#8a8275',
  nodeFill: ['#3b82f6', '#5a8a4a', '#e07a2a'],
  nodeHalo: '#ffffff',
  label: '#1f1d18',
  sub: '#8a8275',
  edgeBase: { application: '#8B5CF6', extension: '#F59E0B', reinforcement: '#94A3B8' },
  edgeHi:   { application: '#7C3AED', extension: '#B45309', reinforcement: '#475569' },
  panel: '#fbf8f3',
  panelBorder: '#e9e3d6',
  panelText: '#1f1d18',
  panelSub: '#8a8275',
  panelHover: 'rgba(0,0,0,0.04)',
  border: 'rgba(226,220,210,0.8)',
}

const DARK: Theme = {
  bg: '#15171c',
  grid: '#23262e',
  colHeader: ['#7aa8e8', '#8bc474', '#e8a06a'],
  colTint: ['rgba(122,168,232,0.04)', 'rgba(139,196,116,0.04)', 'rgba(232,160,106,0.04)'],
  rowLabel: '#9aa0ac',
  nodeFill: ['#7aa8e8', '#8bc474', '#e8a06a'],
  nodeHalo: '#15171c',
  label: '#e8e8ec',
  sub: '#7a7f8a',
  edgeBase: { application: '#c4863a', extension: '#8a6ec8', reinforcement: '#3d4452' },
  edgeHi:   { application: '#ffb84d', extension: '#b89eff', reinforcement: '#64748b' },
  panel: '#1c1f26',
  panelBorder: '#2a2e38',
  panelText: '#e8e8ec',
  panelSub: '#7a7f8a',
  panelHover: 'rgba(255,255,255,0.06)',
  border: '#23262e',
}

// Layout constants
const HEADER_H = 46
const LEFT_GUTTER = 52
const CELL_PAD_X = 22
const CELL_PAD_Y = 28
const NODE_GAP_X = 90
const NODE_GAP_Y = 26
const NODE_R = 5

interface VisNode {
  id: string
  term: string
  conceptId: number
  subject: string
  year: number
  unit: string
  colIdx: number
  x: number
  y: number
}

interface VisEdge {
  id: string
  sourceId: string
  targetId: string
  nature: string
  term: string
}

interface Layout {
  nodesById: Map<string, VisNode>
  visEdges: VisEdge[]
  svgHeight: number
  rowYStarts: number[]
  colW: number
}

function edgePath(ax: number, ay: number, bx: number, by: number): string {
  const dx = bx - ax, dy = by - ay
  const dist = Math.hypot(dx, dy)
  if (dist < 1) return `M ${ax} ${ay} L ${bx} ${by}`
  const mx = (ax + bx) / 2, my = (ay + by) / 2
  const perpX = -dy / dist, perpY = dx / dist
  const bend = Math.min(40, dist * 0.12)
  return `M ${ax} ${ay} Q ${mx + perpX * bend} ${my + perpY * bend} ${bx} ${by}`
}

function truncate(s: string, n: number) {
  return s.length <= n ? s : s.slice(0, n - 1) + '…'
}

function buildLayout(apiEdges: EdgeListItem[], width: number, showReinforcement: boolean): Layout {
  const colW = (width - LEFT_GUTTER) / SUBJECT_ORDER.length
  const cols = Math.max(1, Math.floor((colW - CELL_PAD_X * 2) / NODE_GAP_X))

  // Deduplicate nodes
  const nodeData = new Map<string, { term: string; conceptId: number; subject: string; year: number; unit: string }>()
  for (const e of apiEdges) {
    if (!showReinforcement && e.edge_nature === 'reinforcement') continue
    const fk = `${e.term}|${e.from_subject}|${e.from_year}`
    const tk = `${e.term}|${e.to_subject}|${e.to_year}`
    if (!nodeData.has(fk)) nodeData.set(fk, { term: e.term, conceptId: e.concept_id, subject: e.from_subject, year: e.from_year, unit: e.from_unit })
    if (!nodeData.has(tk)) nodeData.set(tk, { term: e.term, conceptId: e.concept_id, subject: e.to_subject, year: e.to_year, unit: e.to_unit })
  }

  // Sort for deterministic layout
  const sorted = [...nodeData.entries()].sort(([, a], [, b]) => {
    const ya = YEAR_ORDER.indexOf(a.year), yb = YEAR_ORDER.indexOf(b.year)
    if (ya !== yb) return ya - yb
    const sa = SUBJECT_ORDER.indexOf(a.subject), sb = SUBJECT_ORDER.indexOf(b.subject)
    if (sa !== sb) return sa - sb
    return a.term.localeCompare(b.term)
  })

  // Cell counts for row height calculation
  const cellCounts = new Map<string, number>()
  for (const [, n] of sorted) cellCounts.set(`${n.subject}|${n.year}`, (cellCounts.get(`${n.subject}|${n.year}`) ?? 0) + 1)

  const rowHeights = YEAR_ORDER.map(yr => {
    const maxCount = Math.max(...SUBJECT_ORDER.map(s => cellCounts.get(`${s}|${yr}`) ?? 0), 0)
    const rows = Math.ceil(maxCount / cols)
    return Math.max(120, CELL_PAD_Y + rows * NODE_GAP_Y + 30)
  })

  const rowYStarts: number[] = []
  let totalY = HEADER_H
  for (const rh of rowHeights) { rowYStarts.push(totalY); totalY += rh }

  // Position nodes
  const cellOffsets = new Map<string, number>()
  const nodesById = new Map<string, VisNode>()
  for (const [id, n] of sorted) {
    const ci = SUBJECT_ORDER.indexOf(n.subject)
    const ri = YEAR_ORDER.indexOf(n.year)
    if (ci < 0 || ri < 0) continue
    const ck = `${n.subject}|${n.year}`
    const idx = cellOffsets.get(ck) ?? 0
    cellOffsets.set(ck, idx + 1)
    const col = idx % cols, row = Math.floor(idx / cols)
    nodesById.set(id, {
      id, term: n.term, conceptId: n.conceptId, subject: n.subject, year: n.year, unit: n.unit, colIdx: ci,
      x: LEFT_GUTTER + ci * colW + CELL_PAD_X + col * NODE_GAP_X + NODE_R + 4,
      y: rowYStarts[ri] + CELL_PAD_Y + row * NODE_GAP_Y,
    })
  }

  // Build visual edges (deduplicated)
  const seenPairs = new Set<string>()
  const visEdges: VisEdge[] = []
  for (const e of apiEdges) {
    if (!showReinforcement && e.edge_nature === 'reinforcement') continue
    const fk = `${e.term}|${e.from_subject}|${e.from_year}`
    const tk = `${e.term}|${e.to_subject}|${e.to_year}`
    const pairKey = [fk, tk].sort().join('→')
    if (seenPairs.has(pairKey)) continue
    seenPairs.add(pairKey)
    if (!nodesById.has(fk) || !nodesById.has(tk)) continue
    visEdges.push({ id: pairKey, sourceId: fk, targetId: tk, nature: e.edge_nature, term: e.term })
  }

  return { nodesById, visEdges, svgHeight: totalY, rowYStarts, colW }
}

interface Tooltip { x: number; y: number; title: string; sub: string; note?: string }

export default function ArchitectureView() {
  const [apiEdges, setApiEdges] = useState<EdgeListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showReinforcement, setShowReinforcement] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [hoverNode, setHoverNode] = useState<string | null>(null)
  const [hoverEdge, setHoverEdge] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<Tooltip | null>(null)
  const [containerWidth, setContainerWidth] = useState(900)
  const containerRef = useRef<HTMLDivElement>(null)

  const T = darkMode ? DARK : LIGHT

  useEffect(() => {
    fetchEdges()
      .then(data => { setApiEdges(data.edges); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useLayoutEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) setContainerWidth(entry.contentRect.width)
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const { nodesById, visEdges, svgHeight, rowYStarts, colW } = useMemo(
    () => buildLayout(apiEdges, containerWidth, showReinforcement),
    [apiEdges, containerWidth, showReinforcement]
  )

  // Adjacency map for highlight
  const adj = useMemo(() => {
    const m = new Map<string, VisEdge[]>()
    for (const e of visEdges) {
      if (!m.has(e.sourceId)) m.set(e.sourceId, [])
      if (!m.has(e.targetId)) m.set(e.targetId, [])
      m.get(e.sourceId)!.push(e)
      m.get(e.targetId)!.push(e)
    }
    return m
  }, [visEdges])

  // Focus: hover overrides selection
  const focusNodeId = hoverNode ?? (hoverEdge === null ? selectedNode : null)

  const { highlightNodes, highlightEdges } = useMemo(() => {
    if (hoverEdge) {
      const e = visEdges.find(x => x.id === hoverEdge)
      if (!e) return { highlightNodes: null, highlightEdges: null }
      return { highlightNodes: new Set([e.sourceId, e.targetId]), highlightEdges: new Set([e.id]) }
    }
    if (focusNodeId) {
      const edges = adj.get(focusNodeId) ?? []
      return {
        highlightNodes: new Set([focusNodeId, ...edges.flatMap(e => [e.sourceId, e.targetId])]),
        highlightEdges: new Set(edges.map(e => e.id)),
      }
    }
    return { highlightNodes: null, highlightEdges: null }
  }, [focusNodeId, hoverEdge, adj, visEdges])

  // Highlighted edges render on top
  const sortedEdges = useMemo(() => {
    if (!highlightEdges) return visEdges
    return [...visEdges].sort((a, b) => (highlightEdges.has(a.id) ? 1 : 0) - (highlightEdges.has(b.id) ? 1 : 0))
  }, [visEdges, highlightEdges])

  const selNode = selectedNode ? nodesById.get(selectedNode) : null
  const selEdges = selNode ? (adj.get(selNode.id) ?? []) : []

  const handleNodeEnter = (node: VisNode, ev: React.MouseEvent) => {
    setHoverNode(node.id)
    const rect = containerRef.current!.getBoundingClientRect()
    setTooltip({ x: ev.clientX - rect.left, y: ev.clientY - rect.top, title: node.term, sub: `${node.subject} · Y${node.year}`, note: node.unit })
  }
  const handleEdgeEnter = (edge: VisEdge, ev: React.MouseEvent) => {
    setHoverEdge(edge.id)
    const a = nodesById.get(edge.sourceId)!, b = nodesById.get(edge.targetId)!
    const rect = containerRef.current!.getBoundingClientRect()
    setTooltip({
      x: ev.clientX - rect.left, y: ev.clientY - rect.top,
      title: edge.term, sub: NATURE_LABELS[edge.nature] ?? edge.nature,
      note: `${a.subject} Y${a.year}  ⇄  ${b.subject} Y${b.year}`,
    })
  }
  const handleMouseMove = (ev: React.MouseEvent) => {
    if (!tooltip) return
    const rect = containerRef.current!.getBoundingClientRect()
    setTooltip(t => t ? { ...t, x: ev.clientX - rect.left, y: ev.clientY - rect.top } : t)
  }
  const handleLeave = () => { setHoverNode(null); setHoverEdge(null); setTooltip(null) }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="text-center">
          <div className="animate-spin w-6 h-6 border-2 border-owl-purple border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm">Loading curriculum architecture…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-2 py-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-semibold text-ink mb-2">Curriculum Architecture</h1>
          <p className="text-slate-500 text-sm max-w-3xl leading-relaxed">
            How vocabulary connects across subjects and years. Each node is a concept;
            curved lines show where the same idea recurs, deepens, or crosses subjects.
            <strong className="text-slate-600"> Application</strong> edges (cross-subject) reveal the curriculum's intellectual architecture.
            Hover to highlight, click to open the detail panel.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mb-4 flex-wrap">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showReinforcement}
              onChange={e => setShowReinforcement(e.target.checked)}
              className="rounded border-slate-300"
            />
            Show reinforcement edges
          </label>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            {(['application', 'extension', ...(showReinforcement ? ['reinforcement'] : [])] as const).map(key => (
              <span key={key} className="flex items-center gap-1.5">
                <span className="inline-block rounded-full" style={{ width: 16, height: 2, backgroundColor: T.edgeBase[key] }} />
                {NATURE_LABELS[key]}
              </span>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-slate-400">
              {visEdges.length} edges · {nodesById.size} concept appearances
            </span>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(d => !d)}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-colors select-none"
              style={{
                background: darkMode ? '#23262e' : '#f1ece3',
                borderColor: darkMode ? '#3a3f4a' : '#d4cdc0',
                color: darkMode ? '#9aa0ac' : '#6b6457',
              }}
            >
              {darkMode ? (
                /* sun */
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                /* moon */
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
              {darkMode ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={containerRef}
          className="rounded-xl shadow-sm relative overflow-hidden transition-colors duration-200"
          style={{ minHeight: 200, background: T.bg, border: `1px solid ${T.border}` }}
          onClick={() => setSelectedNode(null)}
        >
          <svg
            width={containerWidth}
            height={svgHeight}
            viewBox={`0 0 ${containerWidth} ${svgHeight}`}
            style={{ display: 'block' }}
            onMouseMove={handleMouseMove}
          >
            {/* Column tints */}
            {SUBJECT_ORDER.map((s, i) => (
              <rect key={s} x={LEFT_GUTTER + i * colW} y={0} width={colW} height={svgHeight} fill={T.colTint[i]} />
            ))}

            {/* Row separators */}
            {rowYStarts.map((y, i) => i > 0 && (
              <line key={i} x1={0} x2={containerWidth} y1={y} y2={y} stroke={T.grid} strokeWidth={1} />
            ))}
            {/* Column separators */}
            {SUBJECT_ORDER.map((_, i) => i > 0 && (
              <line key={i}
                x1={LEFT_GUTTER + i * colW} x2={LEFT_GUTTER + i * colW}
                y1={HEADER_H} y2={svgHeight}
                stroke={T.grid} strokeWidth={1}
              />
            ))}

            {/* Column headers */}
            {SUBJECT_ORDER.map((s, i) => (
              <text key={s}
                x={LEFT_GUTTER + i * colW + colW / 2} y={HEADER_H / 2 + 6}
                textAnchor="middle" fontSize={15} fontWeight={600}
                fill={T.colHeader[i]} letterSpacing={0.3}
              >{s}</text>
            ))}

            {/* Row labels */}
            {YEAR_ORDER.map((yr, i) => rowYStarts[i] !== undefined && (
              <text key={yr} x={14} y={rowYStarts[i] + 20} fontSize={13} fontWeight={600} fill={T.rowLabel} letterSpacing={0.5}>
                Y{yr}
              </text>
            ))}

            {/* Edges */}
            <g>
              {sortedEdges.map(edge => {
                const a = nodesById.get(edge.sourceId), b = nodesById.get(edge.targetId)
                if (!a || !b) return null
                const isHi = highlightEdges?.has(edge.id) ?? false
                const isDim = highlightEdges !== null && !isHi
                const stroke = isHi ? (T.edgeHi[edge.nature] ?? T.edgeHi.reinforcement) : (T.edgeBase[edge.nature] ?? T.edgeBase.reinforcement)
                const opacity = isDim ? 0.05 : isHi ? 0.9 : 0.45
                return (
                  <path
                    key={edge.id}
                    d={edgePath(a.x, a.y, b.x, b.y)}
                    stroke={stroke}
                    strokeWidth={isHi ? 2.5 : 1.5}
                    fill="none"
                    opacity={opacity}
                    style={{ cursor: 'pointer', transition: 'opacity .15s, stroke-width .15s' }}
                    onMouseEnter={ev => handleEdgeEnter(edge, ev)}
                    onMouseLeave={handleLeave}
                  />
                )
              })}
            </g>

            {/* Nodes */}
            <g>
              {[...nodesById.values()].map(node => {
                const isHi = highlightNodes?.has(node.id) ?? false
                const isDim = highlightNodes !== null && !isHi
                const isSel = selectedNode === node.id
                const fill = T.nodeFill[node.colIdx] ?? T.nodeFill[0]
                const r = isSel ? NODE_R + 1.5 : isHi ? NODE_R + 1 : NODE_R
                return (
                  <g key={node.id}
                    style={{ cursor: 'pointer', opacity: isDim ? 0.18 : 1, transition: 'opacity .15s' }}
                    onMouseEnter={ev => handleNodeEnter(node, ev)}
                    onMouseLeave={handleLeave}
                    onClick={ev => { ev.stopPropagation(); setSelectedNode(node.id) }}
                  >
                    <circle cx={node.x} cy={node.y} r={r + 2} fill={T.nodeHalo} />
                    <circle cx={node.x} cy={node.y} r={r} fill={fill} />
                    {isSel && <circle cx={node.x} cy={node.y} r={r + 4.5} fill="none" stroke={fill} strokeWidth={1.5} opacity={0.45} />}
                    <text
                      x={node.x + 9} y={node.y + 3.5}
                      fontSize={10} fill={T.label}
                      fontWeight={isHi ? 600 : 400}
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >{truncate(node.term, 9)}</text>
                  </g>
                )
              })}
            </g>
          </svg>

          {/* Hover tooltip */}
          {tooltip && (
            <div
              style={{
                position: 'absolute',
                left: Math.min(tooltip.x + 14, containerWidth - 248),
                top: Math.max(tooltip.y - 62, 8),
                background: T.panel,
                border: `1px solid ${T.panelBorder}`,
                color: T.panelText,
                pointerEvents: 'none',
                zIndex: 5,
                boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.5)' : '0 4px 18px rgba(40,30,10,0.10)',
              }}
              className="rounded-lg px-3 py-2.5 max-w-[234px]"
            >
              <div className="font-semibold text-[13px] mb-0.5">{tooltip.title}</div>
              <div className="text-[11px] italic mb-1" style={{ color: T.panelSub }}>{tooltip.sub}</div>
              {tooltip.note && <div className="text-[11px]" style={{ color: T.panelSub }}>{tooltip.note}</div>}
            </div>
          )}

          {/* Detail panel */}
          {selNode && (
            <div
              style={{
                position: 'absolute', right: 12, top: 50, bottom: 12, width: 288, zIndex: 6,
                background: T.panel, border: `1px solid ${T.panelBorder}`, color: T.panelText,
                boxShadow: darkMode ? '0 12px 32px rgba(0,0,0,0.6)' : '0 8px 28px rgba(40,30,10,0.12)',
              }}
              className="rounded-xl overflow-y-auto"
              onClick={ev => ev.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-[10px] tracking-widest uppercase mb-1" style={{ color: T.panelSub }}>
                      {selNode.subject} · Y{selNode.year}
                    </div>
                    <div className="font-serif text-xl font-semibold leading-tight">{selNode.term}</div>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-2xl leading-none ml-2 shrink-0 transition-opacity hover:opacity-60"
                    style={{ color: T.panelSub }}
                  >×</button>
                </div>
                {selNode.unit && (
                  <div className="text-[11px] mb-3" style={{ color: T.panelSub }}>{selNode.unit}</div>
                )}
                <Link
                  to={`/concepts/${selNode.conceptId}`}
                  className="text-sm text-owl-purple hover:underline block mb-4"
                >
                  View full journey →
                </Link>

                {selEdges.length === 0 && (
                  <p className="text-xs italic" style={{ color: T.panelSub }}>No connections to other cells.</p>
                )}

                {(['application', 'extension', 'reinforcement'] as const).map(nature => {
                  if (nature === 'reinforcement' && !showReinforcement) return null
                  const group = selEdges.filter(e => e.nature === nature)
                  if (group.length === 0) return null
                  return (
                    <div key={nature} className="mb-4">
                      <div className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase mb-2" style={{ color: T.panelSub }}>
                        <span className="inline-block rounded" style={{ width: 10, height: 2, backgroundColor: T.edgeBase[nature] }} />
                        {NATURE_LABELS[nature]} · {group.length}
                      </div>
                      {group.map(edge => {
                        const otherId = edge.sourceId === selNode.id ? edge.targetId : edge.sourceId
                        const other = nodesById.get(otherId)
                        if (!other) return null
                        return (
                          <button
                            key={edge.id}
                            onClick={() => setSelectedNode(otherId)}
                            className="w-full text-left px-2 py-1.5 rounded text-xs flex justify-between items-center gap-2 transition-colors"
                            style={{ color: T.panelText }}
                            onMouseEnter={e => (e.currentTarget.style.background = T.panelHover)}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            <span className="font-medium">{other.term}</span>
                            <span className="shrink-0" style={{ color: T.panelSub }}>{other.subject.slice(0, 3)} Y{other.year}</span>
                          </button>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
