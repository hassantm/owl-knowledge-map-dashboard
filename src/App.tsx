import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import PrepareView from './pages/PrepareView'
import ArchitectureView from './pages/ArchitectureView'
import TimelineView from './pages/TimelineView'
import Concepts from './pages/Concepts'
import JourneyView from './pages/JourneyView'
import Browser from './pages/Browser'
import OverviewView from './pages/OverviewView'
import VocabularyView from './pages/VocabularyView'
import StoryPacks from './pages/StoryPacks'

const VocabTimelineView = lazy(() => import('./pages/VocabTimelineView'))
const WordAtlasView = lazy(() => import('./pages/WordAtlasView'))

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<div className="flex items-center justify-center h-64 text-slate-400 text-sm">Loading…</div>}>
          <Routes>
            <Route path="/" element={<PrepareView />} />
            <Route path="/architecture" element={<ArchitectureView />} />
            <Route path="/timeline" element={<TimelineView />} />
            <Route path="/concepts" element={<Concepts />} />
            <Route path="/concepts/:id" element={<JourneyView />} />
            <Route path="/browse" element={<Browser />} />
            <Route path="/overview" element={<OverviewView />} />
            <Route path="/vocabulary" element={<VocabularyView />} />
            <Route path="/story-packs" element={<StoryPacks />} />
            <Route path="/vocab-timeline" element={<VocabTimelineView />} />
            <Route path="/word-atlas" element={<WordAtlasView />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  )
}
