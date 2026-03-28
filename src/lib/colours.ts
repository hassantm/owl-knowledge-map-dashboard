// OWL brand colours
export const HOUSE_PURPLE = '#865595'
export const HOUSE_GREEN = '#699940'

// Canonical subject hex colours — keyed on both API-form and DB-form keys
export const SUBJECT_COLOURS: Record<string, string> = {
  // API-form (used by graph, dashboard, OccurrenceCard, Browser)
  History: '#3B82F6',
  Geography: '#699940',
  Religion: '#D97706',
  // DB-form (used by Timeline API response)
  history: '#3B82F6',
  geography: '#699940',
  rw: '#D97706',
}

// Badge classes for subject pills (Browse, Concepts, ConceptDetail)
export const SUBJECT_BG: Record<string, string> = {
  History: 'bg-blue-100 text-blue-800',
  Geography: 'bg-green-100 text-green-800',
  Religion: 'bg-amber-100 text-amber-800',
  history: 'bg-blue-100 text-blue-800',
  geography: 'bg-green-100 text-green-800',
  rw: 'bg-amber-100 text-amber-800',
}

// Chip classes for inline concept chips
export const SUBJECT_CHIP: Record<string, string> = {
  History: 'bg-blue-100 text-blue-900 border-blue-300',
  Geography: 'bg-green-100 text-green-900 border-green-300',
  Religion: 'bg-amber-100 text-amber-900 border-amber-300',
  history: 'bg-blue-100 text-blue-900 border-blue-300',
  geography: 'bg-green-100 text-green-900 border-green-300',
  rw: 'bg-amber-100 text-amber-900 border-amber-300',
}

// Timeline matrix cell styling — DB-form keys only
export const TIMELINE_SUBJECT: Record<string, { bg: string; chip: string; header: string }> = {
  history:   { bg: 'bg-blue-50',   chip: 'bg-blue-100 text-blue-900 border-blue-300',   header: 'bg-blue-200 text-blue-900' },
  geography: { bg: 'bg-green-50',  chip: 'bg-green-100 text-green-900 border-green-300', header: 'bg-green-200 text-green-900' },
  rw:        { bg: 'bg-amber-50',  chip: 'bg-amber-100 text-amber-900 border-amber-300', header: 'bg-amber-200 text-amber-900' },
}

export const EDGE_NATURE_COLOURS: Record<string, string> = {
  reinforcement: '#94A3B8',
  extension: '#F59E0B',
  application: '#8B5CF6',
}

export const EDGE_NATURE_BG: Record<string, string> = {
  reinforcement: 'bg-slate-100 text-slate-700',
  extension: 'bg-amber-100 text-amber-800',
  application: 'bg-violet-100 text-violet-800',
}
