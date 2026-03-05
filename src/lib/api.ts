const BASE = '/api'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StatsResponse {
  concepts: number
  confirmed_concepts: number
  occurrences: number
  confirmed_edges: number
  units: number
  by_subject: Record<string, number>
  intros_by_subject: Record<string, Record<string, number>>
  by_nature: Record<string, number>
  by_type: Record<string, number>
  application_flows: Array<{ from: string; to: string; count: number }>
}

export interface GraphNode {
  id: number
  term: string
  concept_id: number
  subject: string
  year: number
  term_period: string
  unit: string
  chapter: string
  is_introduction: boolean
  curriculum_position: number
}

export interface GraphEdge {
  source: number
  target: number
  edge_type: string
  edge_nature: string
}

export interface GraphResponse {
  nodes: GraphNode[]
  edges: GraphEdge[]
  node_count: number
  edge_count: number
}

export interface GraphParams {
  subject?: string
  yearFrom?: number
  yearTo?: number
  edgeType?: string
  edgeNature?: string
}

export interface ConceptRow {
  concept_id: number
  term: string
  subject_area: string | null
  occ_count: number
  subjects: string[]
  first_year: number
  last_year: number
  intro_count: number
}

export interface ConceptsResponse {
  rows: ConceptRow[]
  total: number
  page: number
  page_size: number
}

export interface ConceptsParams {
  q?: string
  subject?: string
  loadBearingOnly?: boolean
  page?: number
  pageSize?: number
}

export interface Occurrence {
  occurrence_id: number
  concept_id: number
  term: string
  subject: string
  year: number
  term_period: string
  unit: string
  chapter: string | null
  slide_number: number | null
  is_introduction: number | boolean
  term_in_context: string | null
  source_path?: string
  validation_status?: string
  vocab_confidence?: string | null
  vocab_match_type?: string | null
  vocab_source?: string | null
  audit_decision?: string | null
  audit_notes?: string | null
  needs_review?: number
  review_reason?: string | null
}

export interface OccurrencesResponse {
  rows: Occurrence[]
  total: number
  page: number
  page_size: number
}

export interface OccurrencesParams {
  subject?: string
  year?: number
  term?: string
  q?: string
  page?: number
  pageSize?: number
}

export interface ConceptDetail {
  concept_id: number
  term: string
  subject_area: string | null
}

export interface EdgeDetail {
  edge_id: number
  from_occurrence: number
  to_occurrence: number
  edge_type: string
  edge_nature: string
  confirmed_by: string | null
  confirmed_date: string | null
  from_year: number
  from_term: string
  from_subject: string
  from_unit: string
  to_year: number
  to_term: string
  to_subject: string
  to_unit: string
}

export interface ConceptDetailResponse {
  concept: ConceptDetail
  occurrences: Occurrence[]
  edges: EdgeDetail[]
}

export interface EdgeListItem {
  from_occurrence: number
  to_occurrence: number
  edge_type: string
  edge_nature: string
  confirmed_by: string | null
  confirmed_date: string | null
  concept_id: number
  term: string
  from_subject: string
  from_year: number
  from_term: string
  from_unit: string
  from_chapter: string | null
  to_subject: string
  to_year: number
  to_term: string
  to_unit: string
  to_chapter: string | null
}

export interface EdgesListResponse {
  edges: EdgeListItem[]
  total: number
}

export interface EdgesParams {
  edgeType?: string
  edgeNature?: string
  subject?: string
}

export interface DensityRow {
  subject: string
  year: number
  term: string
  unit: string
  intros: number
  total: number
  intro_pct: number
}

export interface YearProgressionRow {
  year: number
  new_terms: number
  recurrences: number
  total: number
  recurrence_pct: number
}

export interface CrossSubjectRow {
  term: string
  subjects: string[]
  subject_count: number
  total_occurrences: number
  first_year: number
  last_year: number
}

export interface LongevityRow {
  term: string
  intro_subject: string
  intro_year: number
  last_year: number
  years_active: number
  occurrences: number
}

export interface FilterOptions {
  subjects: string[]
  years: number[]
  terms: string[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
  const url = new URL(`${BASE}${path}`, window.location.origin)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }
  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`)
  }
  return res.json() as Promise<T>
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function fetchStats(): Promise<StatsResponse> {
  return apiFetch<StatsResponse>('/stats')
}

export async function fetchGraph(params?: GraphParams): Promise<GraphResponse> {
  const p: Record<string, string | number | boolean> = {}
  if (params?.subject) p['subject'] = params.subject
  if (params?.yearFrom !== undefined) p['yearFrom'] = params.yearFrom
  if (params?.yearTo !== undefined) p['yearTo'] = params.yearTo
  if (params?.edgeType) p['edgeType'] = params.edgeType
  if (params?.edgeNature) p['edgeNature'] = params.edgeNature
  return apiFetch<GraphResponse>('/graph', p)
}

export async function fetchConcepts(params?: ConceptsParams): Promise<ConceptsResponse> {
  const p: Record<string, string | number | boolean> = {}
  if (params?.q) p['q'] = params.q
  if (params?.subject) p['subject'] = params.subject
  if (params?.loadBearingOnly) p['loadBearingOnly'] = params.loadBearingOnly
  if (params?.page !== undefined) p['page'] = params.page
  if (params?.pageSize !== undefined) p['pageSize'] = params.pageSize
  return apiFetch<ConceptsResponse>('/concepts', p)
}

export async function fetchConcept(id: number): Promise<ConceptDetailResponse> {
  return apiFetch<ConceptDetailResponse>(`/concepts/${id}`)
}

export async function fetchOccurrences(params?: OccurrencesParams): Promise<OccurrencesResponse> {
  const p: Record<string, string | number | boolean> = {}
  if (params?.subject) p['subject'] = params.subject
  if (params?.year !== undefined) p['year'] = params.year
  if (params?.term) p['term'] = params.term
  if (params?.q) p['q'] = params.q
  if (params?.page !== undefined) p['page'] = params.page
  if (params?.pageSize !== undefined) p['pageSize'] = params.pageSize
  return apiFetch<OccurrencesResponse>('/occurrences', p)
}

export async function fetchEdges(params?: EdgesParams): Promise<EdgesListResponse> {
  const p: Record<string, string | number | boolean> = {}
  if (params?.edgeType) p['edgeType'] = params.edgeType
  if (params?.edgeNature) p['edgeNature'] = params.edgeNature
  if (params?.subject) p['subject'] = params.subject
  return apiFetch<EdgesListResponse>('/edges', p)
}

export async function fetchDensity(): Promise<DensityRow[]> {
  return apiFetch<DensityRow[]>('/insights/density')
}

export async function fetchYearProgression(): Promise<YearProgressionRow[]> {
  return apiFetch<YearProgressionRow[]>('/insights/year-progression')
}

export async function fetchCrossSubject(): Promise<CrossSubjectRow[]> {
  return apiFetch<CrossSubjectRow[]>('/insights/cross-subject')
}

export async function fetchLongevity(limit = 40): Promise<LongevityRow[]> {
  return apiFetch<LongevityRow[]>('/insights/longevity', { limit })
}

export async function fetchFilters(): Promise<FilterOptions> {
  return apiFetch<FilterOptions>('/filters')
}

export interface SemanticNode {
  concept_id: number
  term: string
  subject: string
  year: number
  cluster: number
  cluster_label: string
  x: number
  y: number
}

export interface SemanticClusterResponse {
  nodes: SemanticNode[]
  num_clusters: number
  cluster_labels: Record<string, string>
}

export async function fetchSemanticClusters(nClusters = 8): Promise<SemanticClusterResponse> {
  return apiFetch<SemanticClusterResponse>('/semantic-clusters', { n_clusters: nClusters })
}
