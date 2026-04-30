export interface HighlightState {
  highlightOn: boolean
  minRecur: 2 | 3 | 4
  highlightColor: string
  traceWord: string
  dimNonMatching: boolean
  boldRecurrences: boolean
}

export const DEFAULT_HIGHLIGHT: HighlightState = {
  highlightOn: false,
  minRecur: 2,
  highlightColor: '#c96442',
  traceWord: '',
  dimNonMatching: true,
  boldRecurrences: true,
}
