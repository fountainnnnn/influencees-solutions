import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Overview from './pages/Overview'
import Discovery from './pages/Discovery'
import Leads from './pages/Leads'
import LeadDetail from './pages/LeadDetail'
import Inbox from './pages/Inbox'
import Approvals from './pages/Approvals'
import BusinessBrain from './pages/BusinessBrain'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/discovery" element={<Discovery />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/leads/:id" element={<LeadDetail />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/inbox/:conversationId" element={<Inbox />} />
        <Route path="/approvals" element={<Approvals />} />
        <Route path="/brain" element={<BusinessBrain />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}
