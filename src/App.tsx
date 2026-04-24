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

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
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
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
