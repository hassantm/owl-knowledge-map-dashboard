import { useEffect, useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { fetchEdges, type EdgeListItem } from '../lib/api'
import { EDGE_NATURE_COLOURS } from '../lib/colours'

const SUBJECT_COLOURS: Record<string, string> = {
  History: '#3B82F6',
  Geography: '#699940',
  'Religion & Worldviews': '#D97706',
  Religion: '#D97706',
}

const SUBJECT_ORDER = ['History', 'Geography', 'Religion']

const NATURE_LABELS: Record<string, string> = {
  reinforcement: 'Reinforcement',
  extension: 'Extension',
  application: 'Application',
}

interface VisNode {
  id: string
  term: string
  conceptId: number
  subject: string
  year: number
  unit: string
  x: number
  y: number
}

interface VisEdge {
  source: VisNode
  target: VisNode
  nature: string
}

export default function ArchitectureView() {
  const [edges, setEdges] = useState<EdgeListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showReinforcement, setShowReinforcement] = useState(false)
  const [hoveredConcept, setHoveredConcept] = useState<string | null>(null)
  const [_hoveredEdge, setHoveredEdge] = useState<number | null>(null)

  useEffect(() => {
    fetchEdges()
      .then(data => { setEdges(data.edges); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filteredEdges = useMemo(() => {
    if (showReinforcement) return edges
    return edges.filter(e => e.edge_nature !== 'reinforcement')
  }, [edges, showReinforcement])

  // Build the lane diagram layout
  const { nodes, visEdges, svgWidth, svgHeight } = useMemo(() => {
    const LANE_WIDTH = 220
    const YEAR_HEIGHT = 160
    const HEADER_HEIGHT = 50
    const PADDING_X = 40
    const PADDING_Y = 30


    // Collect unique nodes from edges
    const nodeMap = new Map<string, VisNode>()

    for (const e of filteredEdges) {
      const fromKey = `${e.term}-${e.from_subject}-${e.from_year}`
      const toKey = `${e.term}-${e.to_subject}-${e.to_year}`

      if (!nodeMap.has(fromKey)) {
        nodeMap.set(fromKey, {
          id: fromKey,
          term: e.term,
          conceptId: e.concept_id,
          subject: e.from_subject,
          year: e.from_year,
          unit: e.from_unit,
          x: 0, y: 0,
        })
      }
      if (!nodeMap.has(toKey)) {
        nodeMap.set(toKey, {
          id: toKey,
          term: e.term,
          conceptId: e.concept_id,
          subject: e.to_subject,
          year: e.to_year,
          unit: e.to_unit,
          x: 0, y: 0,
        })
      }
    }

    // Position nodes: x by subject lane, y by year
    const subjectLanes = new Map<string, number>()
    SUBJECT_ORDER.forEach((s, i) => subjectLanes.set(s, i))

    // Track node positions within each year-subject cell to prevent overlap
    const cellCounts = new Map<string, number>()

    const allNodes = Array.from(nodeMap.values())
    // Sort for deterministic layout
    allNodes.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      const la = subjectLanes.get(a.subject) ?? 0
      const lb = subjectLanes.get(b.subject) ?? 0
      if (la !== lb) return la - lb
      return a.term.localeCompare(b.term)
    })

    for (const node of allNodes) {
      const lane = subjectLanes.get(node.subject) ?? 0
      const cellKey = `${node.year}-${lane}`
      const idx = cellCounts.get(cellKey) ?? 0
      cellCounts.set(cellKey, idx + 1)

      const col = idx % 4
      const row = Math.floor(idx / 4)
      node.x = PADDING_X + lane * LANE_WIDTH + 30 + col * 45
      node.y = HEADER_HEIGHT + PADDING_Y + (node.year - 3) * YEAR_HEIGHT + 30 + row * 20
    }

    const vEdges: VisEdge[] = filteredEdges.map(e => {
      const fromKey = `${e.term}-${e.from_subject}-${e.from_year}`
      const toKey = `${e.term}-${e.to_subject}-${e.to_year}`
      return {
        source: nodeMap.get(fromKey)!,
        target: nodeMap.get(toKey)!,
        nature: e.edge_nature,
      }
    }).filter(e => e.source && e.target)

    return {
      nodes: allNodes,
      visEdges: vEdges,
      svgWidth: PADDING_X * 2 + SUBJECT_ORDER.length * LANE_WIDTH,
      svgHeight: HEADER_HEIGHT + PADDING_Y * 2 + 4 * YEAR_HEIGHT,
    }
  }, [filteredEdges])

  const handleNodeHover = useCallback((conceptTerm: string | null) => {
    setHoveredConcept(conceptTerm)
  }, [])

  const isNodeHighlighted = (node: VisNode) => {
    if (!hoveredConcept) return true
    return node.term === hoveredConcept
  }

  const isEdgeHighlighted = (edge: VisEdge) => {
    if (!hoveredConcept) return true
    return edge.source.term === hoveredConcept || edge.target.term === hoveredConcept
  }

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

  const LANE_WIDTH = 220
  const YEAR_HEIGHT = 160
  const HEADER_HEIGHT = 50
  const PADDING_X = 40
  const PADDING_Y = 30

  return (
    <div className="px-6 py-8">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-semibold text-ink mb-2">Curriculum Architecture</h1>
          <p className="text-slate-500 text-sm max-w-3xl leading-relaxed">
            How vocabulary connects across subjects and years. Each node is a concept;
            lines show where the same idea recurs, deepens, or crosses into another subject.
            <strong className="text-slate-600"> Application</strong> edges (cross-subject connections) reveal the curriculum's intellectual architecture.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mb-6">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showReinforcement}
              onChange={e => setShowReinforcement(e.target.checked)}
              className="rounded border-slate-300"
            />
            Show reinforcement edges
          </label>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            {Object.entries(NATURE_LABELS).map(([key, label]) => {
              if (key === 'reinforcement' && !showReinforcement) return null
              return (
                <span key={key} className="flex items-center gap-1.5">
                  <span
                    className="w-4 h-0.5 rounded-full inline-block"
                    style={{ backgroundColor: EDGE_NATURE_COLOURS[key], height: key === 'application' ? 3 : 2 }}
                  />
                  {label}
                </span>
              )
            })}
          </div>

          <div className="ml-auto text-xs text-slate-400">
            {filteredEdges.length} edges · {nodes.length} concept appearances
          </div>
        </div>

        {/* Graph */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-x-auto">
          <svg
            width={svgWidth}
            height={svgHeight}
            className="block"
            style={{ minWidth: svgWidth }}
          >
            {/* Subject lane backgrounds */}
            {SUBJECT_ORDER.map((subject, i) => (
              <g key={subject}>
                <rect
                  x={PADDING_X + i * LANE_WIDTH}
                  y={0}
                  width={LANE_WIDTH}
                  height={svgHeight}
                  fill={i % 2 === 0 ? '#FDFBF7' : '#F8F6F0'}
                />
                <text
                  x={PADDING_X + i * LANE_WIDTH + LANE_WIDTH / 2}
                  y={HEADER_HEIGHT / 2 + 5}
                  textAnchor="middle"
                  className="text-xs font-semibold"
                  fill={SUBJECT_COLOURS[subject] ?? '#64748B'}
                >
                  {subject}
                </text>
              </g>
            ))}

            {/* Year dividers */}
            {[3, 4, 5, 6].map(year => {
              const y = HEADER_HEIGHT + PADDING_Y + (year - 3) * YEAR_HEIGHT
              return (
                <g key={year}>
                  <line
                    x1={10}
                    y1={y}
                    x2={svgWidth - 10}
                    y2={y}
                    stroke="#E2E8F0"
                    strokeWidth={1}
                  />
                  <text
                    x={14}
                    y={y + 18}
                    className="text-[11px] font-bold"
                    fill="#94A3B8"
                  >
                    Y{year}
                  </text>
                </g>
              )
            })}

            {/* Edges */}
            {visEdges.map((edge, i) => {
              const highlighted = isEdgeHighlighted(edge)
              const isApp = edge.nature === 'application'
              return (
                <line
                  key={i}
                  x1={edge.source.x}
                  y1={edge.source.y}
                  x2={edge.target.x}
                  y2={edge.target.y}
                  stroke={EDGE_NATURE_COLOURS[edge.nature] ?? '#94A3B8'}
                  strokeWidth={isApp ? 2.5 : 1.5}
                  strokeOpacity={highlighted ? (isApp ? 0.8 : 0.5) : 0.08}
                  onMouseEnter={() => setHoveredEdge(i)}
                  onMouseLeave={() => setHoveredEdge(null)}
                  className="transition-opacity duration-150"
                />
              )
            })}

            {/* Nodes */}
            {nodes.map(node => {
              const highlighted = isNodeHighlighted(node)
              const colour = SUBJECT_COLOURS[node.subject] ?? '#64748B'
              return (
                <g
                  key={node.id}
                  onMouseEnter={() => handleNodeHover(node.term)}
                  onMouseLeave={() => handleNodeHover(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={6}
                    fill={highlighted ? colour : '#E2E8F0'}
                    stroke="white"
                    strokeWidth={1.5}
                    className="transition-all duration-150"
                  />
                  <text
                    x={node.x + 9}
                    y={node.y + 4}
                    className="text-[10px]"
                    fill={highlighted ? '#1E293B' : '#CBD5E1'}
                  >
                    {node.term}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Hovered concept detail */}
        {hoveredConcept && (
          <div className="mt-4 bg-parchment rounded-lg border border-slate-200/80 p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-ink">{hoveredConcept}</span>
                <span className="text-slate-400 text-sm ml-2">
                  — appears {nodes.filter(n => n.term === hoveredConcept).length} time{nodes.filter(n => n.term === hoveredConcept).length !== 1 ? 's' : ''} across the curriculum
                </span>
              </div>
              <Link
                to={`/concepts/${nodes.find(n => n.term === hoveredConcept)?.conceptId}`}
                className="text-sm text-owl-purple hover:underline"
              >
                View journey →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
