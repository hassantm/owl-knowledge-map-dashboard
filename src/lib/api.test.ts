import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchGraph, fetchSemanticClusters } from './api'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

const ok = (body: unknown) =>
  Promise.resolve({ ok: true, json: () => Promise.resolve(body) } as Response)
const fail = (status: number) =>
  Promise.resolve({ ok: false, status, statusText: 'Error' } as Response)

beforeEach(() => mockFetch.mockReset())

describe('fetchGraph', () => {
  it('API-01: returns parsed GraphResponse on 200', async () => {
    const payload = { nodes: [], edges: [], node_count: 0, edge_count: 0 }
    mockFetch.mockReturnValue(ok(payload))
    const result = await fetchGraph()
    expect(result).toEqual(payload)
  })

  it('API-02: passes yearFrom/yearTo as query params', async () => {
    mockFetch.mockReturnValue(ok({ nodes: [], edges: [], node_count: 0, edge_count: 0 }))
    await fetchGraph({ yearFrom: 3, yearTo: 5 })
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('yearFrom=3')
    expect(url).toContain('yearTo=5')
  })

  it('API-03: throws on 500 response', async () => {
    mockFetch.mockReturnValue(fail(500))
    await expect(fetchGraph()).rejects.toThrow('500')
  })
})

describe('fetchSemanticClusters', () => {
  it('API-04: passes n_clusters as query param', async () => {
    const payload = { nodes: [], num_clusters: 8, cluster_labels: {} }
    mockFetch.mockReturnValue(ok(payload))
    await fetchSemanticClusters(8)
    const url: string = mockFetch.mock.calls[0][0]
    expect(url).toContain('n_clusters=8')
  })

  it('API-05: returns SemanticClusterResponse on 200', async () => {
    const payload = { nodes: [], num_clusters: 8, cluster_labels: { '0': 'Empire, Trade' } }
    mockFetch.mockReturnValue(ok(payload))
    const result = await fetchSemanticClusters(8)
    expect(result.num_clusters).toBe(8)
    expect(result.cluster_labels['0']).toBe('Empire, Trade')
  })
})
