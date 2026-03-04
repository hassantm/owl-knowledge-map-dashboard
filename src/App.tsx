import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import GraphView from './pages/GraphView'
import ConceptDetail from './pages/ConceptDetail'
import Browser from './pages/Browser'
import Concepts from './pages/Concepts'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/graph" element={<GraphView />} />
          <Route path="/concepts" element={<Concepts />} />
          <Route path="/concepts/:id" element={<ConceptDetail />} />
          <Route path="/browse" element={<Browser />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
