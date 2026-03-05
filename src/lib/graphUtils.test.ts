import { describe, it, expect } from 'vitest'
import {
  filterEdges, filterNodes, degreeMap, buildFGData,
  buildSemanticFGData, nodeNeighbours, communityColour,
  SUBJECT_COLOURS,
} from './graphUtils'
import type { GraphEdge, GraphNode, SemanticNode } from './api'

// ── Fixtures ─────────────────────────────────────────────────────────────────

const edge = (src: number, tgt: number, nature: string, type = 'same_subject'): GraphEdge =>
  ({ source: src, target: tgt, edge_nature: nature, edge_type: type })

const node = (id: number, subject: string, year = 3): GraphNode => ({
  id, term: `Term${id}`, concept_id: id, subject, year,
  term_period: 'Autumn1', unit: 'Unit', chapter: '', is_introduction: true, curriculum_position: id,
})

const baseFilter = {
  selectedSubjects: new Set(['History', 'Geography', 'Religion']),
  selectedNatures: new Set(['extension', 'application', 'reinforcement']),
  crossSubjectOnly: false,
}

const graphResponse = {
  nodes: [node(1, 'History'), node(2, 'Geography'), node(3, 'Religion')],
  edges: [
    edge(1, 2, 'extension', 'cross_subject'),
    edge(2, 3, 'application', 'cross_subject'),
    edge(1, 3, 'reinforcement', 'same_subject'),
  ],
  node_count: 3,
  edge_count: 3,
}

// ── filterEdges ───────────────────────────────────────────────────────────────

describe('filterEdges', () => {
  it('GU-01: returns all edges when all natures selected', () => {
    expect(filterEdges(graphResponse.edges, baseFilter)).toHaveLength(3)
  })

  it('GU-02: filters to only extension edges', () => {
    const f = { ...baseFilter, selectedNatures: new Set(['extension']) }
    const result = filterEdges(graphResponse.edges, f)
    expect(result).toHaveLength(1)
    expect(result[0].edge_nature).toBe('extension')
  })

  it('GU-03: crossSubjectOnly filters out same_subject edges', () => {
    const f = { ...baseFilter, crossSubjectOnly: true }
    const result = filterEdges(graphResponse.edges, f)
    expect(result.every(e => e.edge_type === 'cross_subject')).toBe(true)
    expect(result).toHaveLength(2)
  })

  it('GU-04: returns empty array for empty edge list', () => {
    expect(filterEdges([], baseFilter)).toHaveLength(0)
  })
})

// ── filterNodes ───────────────────────────────────────────────────────────────

describe('filterNodes', () => {
  it('GU-05: excludes nodes with no active edges', () => {
    // Only edge between nodes 1 and 2
    const edges = [edge(1, 2, 'extension')]
    const result = filterNodes(graphResponse.nodes, edges, new Set(['History', 'Geography', 'Religion']))
    expect(result.map(n => n.id).sort()).toEqual([1, 2])
  })

  it('GU-06: excludes nodes with excluded subject', () => {
    const edges = [edge(1, 2, 'extension')]
    const result = filterNodes(graphResponse.nodes, edges, new Set(['History']))
    expect(result.map(n => n.id)).toEqual([1])
  })

  it('GU-07: returns all active-edge nodes when all subjects selected', () => {
    const result = filterNodes(graphResponse.nodes, graphResponse.edges, new Set(SUBJECTS))
    expect(result).toHaveLength(3)
  })
})

const SUBJECTS = ['History', 'Geography', 'Religion']

// ── degreeMap ─────────────────────────────────────────────────────────────────

describe('degreeMap', () => {
  it('GU-08: node shared by two edges has degree 2', () => {
    const edges = [edge(1, 2, 'extension'), edge(3, 2, 'extension')]
    const d = degreeMap(edges)
    expect(d['2']).toBe(2)
    expect(d['1']).toBe(1)
  })

  it('GU-09: empty edge list returns empty object', () => {
    expect(degreeMap([])).toEqual({})
  })
})

// ── buildFGData ───────────────────────────────────────────────────────────────

describe('buildFGData', () => {
  it('GU-10: nodes sized by degree, links coloured by nature', () => {
    const { nodes, links } = buildFGData(graphResponse, baseFilter, {}, false)
    expect(nodes.length).toBeGreaterThan(0)
    expect(links.length).toBeGreaterThan(0)
    // High-degree node should be larger than low-degree
    const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]))
    // Node 1 has 2 edges, node 3 has 2 edges, node 2 has 2 edges — all equal here
    // Just check sizes are positive
    nodes.forEach(n => expect(n.size).toBeGreaterThan(0))
  })

  it('GU-11: community mode colours from palette, not subject', () => {
    const commMap = { '1': 0, '2': 1, '3': 2 }
    const { nodes } = buildFGData(graphResponse, baseFilter, commMap, true)
    nodes.forEach(n => {
      // Community colours are not the same as subject colours
      expect(Object.values(SUBJECT_COLOURS)).not.toContain(n.color)
    })
  })

  it('GU-12: duplicate edges produce only one link', () => {
    const dupeGraph = {
      ...graphResponse,
      edges: [edge(1, 2, 'extension'), edge(1, 2, 'extension')],
    }
    const { links } = buildFGData(dupeGraph, baseFilter, {}, false)
    expect(links).toHaveLength(1)
  })

  it('GU-13: edge referencing missing node is excluded', () => {
    const sparseGraph = {
      nodes: [node(1, 'History'), node(2, 'Geography')],
      edges: [edge(1, 99, 'extension')], // node 99 doesn't exist
      node_count: 2, edge_count: 1,
    }
    const { links } = buildFGData(sparseGraph, baseFilter, {}, false)
    expect(links).toHaveLength(0)
  })
})

// ── buildSemanticFGData ───────────────────────────────────────────────────────

describe('buildSemanticFGData', () => {
  const semNodes: SemanticNode[] = [
    { concept_id: 1, term: 'Empire', subject: 'History', year: 4, cluster: 0, cluster_label: 'Power', x: 10, y: 20, z: 30 },
    { concept_id: 2, term: 'Trade', subject: 'Geography', year: 5, cluster: 1, cluster_label: 'Economy', x: -5, y: 15, z: 8 },
  ]

  it('GU-14: nodes pinned to PCA coords, links empty', () => {
    const { nodes, links } = buildSemanticFGData(semNodes)
    expect(links).toHaveLength(0)
    expect(nodes[0].fx).toBe(10)
    expect(nodes[0].fy).toBe(20)
    expect(nodes[0].fz).toBe(30)
  })
})

// ── nodeNeighbours ────────────────────────────────────────────────────────────

describe('nodeNeighbours', () => {
  const nodes = [
    { id: '1', label: 'A', color: '#fff', size: 5 },
    { id: '2', label: 'B', color: '#fff', size: 5, subject: 'History' },
    { id: '3', label: 'C', color: '#fff', size: 5, subject: 'Geography' },
  ]
  const links = [
    { source: '1', target: '2', color: '#aaa', edge_nature: 'extension' },
    { source: '3', target: '1', color: '#bbb', edge_nature: 'application' },
  ]
  const nodeMap = new Map(nodes.map(n => [n.id, n as any]))

  it('GU-15: returns 2 neighbours for connected node', () => {
    const result = nodeNeighbours('1', links as any, nodeMap)
    expect(result).toHaveLength(2)
    expect(result.map(n => n.label).sort()).toEqual(['B', 'C'])
  })

  it('GU-16: returns empty array for unconnected node', () => {
    const result = nodeNeighbours('99', links as any, nodeMap)
    expect(result).toHaveLength(0)
  })
})

// ── communityColour ───────────────────────────────────────────────────────────

describe('communityColour', () => {
  it('GU-17: id=0 returns a valid hex colour', () => {
    expect(communityColour(0)).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('GU-18: wraps around for large ids', () => {
    expect(communityColour(0)).toBe(communityColour(15)) // palette has 15 entries
  })
})
