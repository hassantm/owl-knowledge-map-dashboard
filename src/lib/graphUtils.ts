/**
 * Pure data-transformation utilities for the graph views.
 * No React, no Sigma, no ForceGraph — just logic. Easily testable.
 */
import type { GraphResponse, GraphNode, GraphEdge } from './api'
import { SUBJECT_COLOURS } from './colours'
export { SUBJECT_COLOURS }

export interface FGNode {
  id: string
  label: string
  color: string
  size: number
  subject?: string
  year?: number
  term_period?: string
  unit?: string
  chapter?: string
  is_introduction?: boolean
  term_in_context?: string
  community?: number
  cluster?: number
  cluster_label?: string
  fx?: number; fy?: number; fz?: number
}

export interface FGLink {
  source: string
  target: string
  color: string
  edge_nature: string
}

export interface FGData { nodes: FGNode[]; links: FGLink[] }

export interface FilterState {
  selectedSubjects: Set<string>
  selectedNatures: Set<string>
  crossSubjectOnly: boolean
}

/** Community colour palette */
const PALETTE = [
  '#f97316','#8b5cf6','#10b981','#ef4444','#3b82f6',
  '#f59e0b','#ec4899','#14b8a6','#a855f7','#84cc16',
  '#06b6d4','#e11d48','#d97706','#7c3aed','#059669',
]
export const communityColour = (id: number) => PALETTE[id % PALETTE.length]

export const EDGE_COLOURS: Record<string, string> = {
  reinforcement: '#94a3b8', extension: '#3b82f6', application: '#f97316',
}

/** Filter edges by nature + cross-subject flag */
export function filterEdges(edges: GraphEdge[], f: FilterState): GraphEdge[] {
  return edges.filter(e => {
    if (!f.selectedNatures.has(e.edge_nature)) return false
    if (f.crossSubjectOnly && e.edge_type !== 'cross_subject') return false
    return true
  })
}

/** Filter nodes to those with active edges and matching subject */
export function filterNodes(nodes: GraphNode[], edges: GraphEdge[], subjects: Set<string>): GraphNode[] {
  const activeIds = new Set<number>()
  edges.forEach(e => { activeIds.add(e.source); activeIds.add(e.target) })
  return nodes.filter(n => activeIds.has(n.id) && subjects.has(n.subject))
}

/** Compute degree map from edge list */
export function degreeMap(edges: GraphEdge[]): Record<string, number> {
  const map: Record<string, number> = {}
  edges.forEach(e => {
    map[String(e.source)] = (map[String(e.source)] ?? 0) + 1
    map[String(e.target)] = (map[String(e.target)] ?? 0) + 1
  })
  return map
}

/** Build ForceGraph-compatible node + link arrays from raw graph data */
export function buildFGData(
  data: GraphResponse,
  filter: FilterState,
  communityMap: Record<string, number>,
  useCommColour: boolean,
): FGData {
  const edges = filterEdges(data.edges, filter)
  const nodes = filterNodes(data.nodes, edges, filter.selectedSubjects)

  const degrees = degreeMap(edges)
  const maxDeg = Math.max(...Object.values(degrees), 1)
  const nodeSet = new Set(nodes.map(n => String(n.id)))

  const fgNodes: FGNode[] = nodes.map(n => ({
    id: String(n.id),
    label: n.term,
    size: 2 + ((degrees[String(n.id)] ?? 1) / maxDeg) * 8,
    color: useCommColour
      ? communityColour(communityMap[String(n.id)] ?? 0)
      : (SUBJECT_COLOURS[n.subject] ?? '#888'),
    subject: n.subject,
    year: n.year,
    term_period: n.term_period,
    unit: n.unit,
    chapter: n.chapter,
    is_introduction: n.is_introduction,
    term_in_context: n.term_in_context,
    community: communityMap[String(n.id)] ?? 0,
  }))

  const seen = new Set<string>()
  const fgLinks: FGLink[] = []
  edges.forEach(e => {
    const src = String(e.source), tgt = String(e.target)
    if (!nodeSet.has(src) || !nodeSet.has(tgt)) return
    const k = `${src}-${tgt}`
    if (seen.has(k)) return
    seen.add(k)
    fgLinks.push({ source: src, target: tgt, color: EDGE_COLOURS[e.edge_nature] ?? '#aaa', edge_nature: e.edge_nature })
  })

  return { nodes: fgNodes, links: fgLinks }
}

/** Build FGData for semantic mode from cluster response */
export function buildSemanticFGData(nodes: import('./api').SemanticNode[]): FGData {
  return {
    nodes: nodes.map(n => ({
      id: String(n.concept_id),
      label: n.term,
      color: communityColour(n.cluster),
      size: 3,
      subject: n.subject,
      year: n.year,
      cluster: n.cluster,
      cluster_label: n.cluster_label,
      fx: n.x, fy: n.y, fz: n.z,
    })),
    links: [],
  }
}

/** Find neighbours of a node from the current link list */
export function nodeNeighbours(
  nodeId: string,
  links: FGLink[],
  nodeMap: Map<string, FGNode>,
): Array<{ label: string; subject: string; edge_nature: string }> {
  return links
    .filter(l => {
      const src = typeof l.source === 'object' ? (l.source as FGNode).id : l.source
      const tgt = typeof l.target === 'object' ? (l.target as FGNode).id : l.target
      return src === nodeId || tgt === nodeId
    })
    .map(l => {
      const src = typeof l.source === 'object' ? (l.source as FGNode).id : l.source
      const tgt = typeof l.target === 'object' ? (l.target as FGNode).id : l.target
      const otherId = src === nodeId ? tgt : src
      const other = nodeMap.get(otherId)
      return { label: other?.label ?? otherId, subject: other?.subject ?? '', edge_nature: l.edge_nature }
    })
}
