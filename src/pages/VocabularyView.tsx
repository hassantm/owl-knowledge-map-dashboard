import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  fetchVocabNavigation,
  fetchChapterClusters,
  type NavigationResponse,
  type Cluster,
} from '../lib/api'
import ChapterSelector, { type Selection } from '../components/vocabulary/ChapterSelector'
import ClusterCardsView from '../components/vocabulary/ClusterCardsView'
import WordDetailPanel from '../components/vocabulary/WordDetailPanel'

export default function VocabularyView() {
  const [params, setParams] = useSearchParams()

  const subject   = params.get('subject')   ?? ''
  const year      = params.get('year')      ?? ''
  const unit      = params.get('unit')      ?? ''
  const chapter   = params.get('chapter')   ?? ''
  const conceptId = params.get('conceptId') ? Number(params.get('conceptId')) : null

  const [nav, setNav]               = useState<NavigationResponse | null>(null)
  const [navLoading, setNavLoading] = useState(true)
  const [clusters, setClusters]     = useState<Cluster[]>([])
  const [clustersLoading, setClustersLoading] = useState(false)
  const [clustersError, setClustersError]     = useState<string | null>(null)

  function updateParams(next: Partial<Selection & { conceptId?: number | null }>) {
    const merged: Record<string, string> = {}
    if ((next.subject ?? subject) !== '') merged.subject = next.subject ?? subject
    if ((next.year    ?? year)    !== '') merged.year    = next.year    ?? year
    if ((next.unit    ?? unit)    !== '') merged.unit    = next.unit    ?? unit
    if ((next.chapter ?? chapter) !== '') merged.chapter = next.chapter ?? chapter

    if (next.subject !== undefined) {
      delete merged.year; delete merged.unit; delete merged.chapter
    }
    if (next.year !== undefined) { delete merged.unit; delete merged.chapter }
    if (next.unit !== undefined) { delete merged.chapter }

    const cid = next.conceptId !== undefined ? next.conceptId : conceptId
    if (cid !== null && cid !== undefined) merged.conceptId = String(cid)

    setParams(merged, { replace: false })
  }

  useEffect(() => {
    fetchVocabNavigation()
      .then(setNav)
      .catch(console.error)
      .finally(() => setNavLoading(false))
  }, [])

  useEffect(() => {
    if (!unit || !chapter) {
      setClusters([])
      return
    }
    setClustersLoading(true)
    setClustersError(null)
    fetchChapterClusters(unit, chapter)
      .then(r => { setClusters(r.clusters); setClustersLoading(false) })
      .catch(err => {
        setClustersError(err instanceof Error ? err.message : 'Failed to load clusters')
        setClustersLoading(false)
      })
  }, [unit, chapter])

  const handleClose      = useCallback(() => updateParams({ conceptId: null }), [params])
  const handleWordSelect = useCallback((id: number) => updateParams({ conceptId: id }), [params])

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8 bg-cream min-h-screen">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-ink mb-1">
          Vocabulary Explorer
        </h1>
        <p className="text-sm text-slate-500">
          Select a chapter to see its vocabulary clusters. Click any word for a teacher briefing.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <ChapterSelector
            nav={nav}
            value={{ subject, year, unit, chapter }}
            onChange={next => updateParams(next)}
            loading={navLoading}
          />
          {navLoading && (
            <span className="flex items-center gap-2 text-sm text-slate-400">
              <span className="w-4 h-4 border-2 border-slate-300 border-t-owl-purple rounded-full animate-spin shrink-0" />
              Loading curriculum…
            </span>
          )}
        </div>
      </div>

      {(unit && chapter) ? (
        <ClusterCardsView
          clusters={clusters}
          loading={clustersLoading}
          error={clustersError}
          onWordSelect={handleWordSelect}
        />
      ) : (
        <p className="text-slate-400 text-sm italic">
          {nav ? 'Select a subject, year, unit, and chapter above.' : 'Loading navigation…'}
        </p>
      )}

      <WordDetailPanel
        conceptId={conceptId}
        unit={unit}
        chapter={chapter}
        onClose={handleClose}
        onWordSelect={handleWordSelect}
      />
    </div>
  )
}
