import { useState } from "react"
import Sidebar from "./components/Sidebar"
import Dashboard from "./components/Dashboard"
import Hives from "./components/Hives"
import HoneyBatches from "./components/HoneyBatches"
import SmartMonitoring from "./components/SmartMonitoring"
import QualityTests from "./components/QualityTests"
import Blockchain from "./components/Blockchain"
import AIInsights from "./components/AIInsights"
import QRVerification from "./components/QRVerification"
import Reports from "./components/Reports"
import Alerts from "./components/Alerts"
import MapsLocations from "./components/MapsLocations"
import Users from "./components/Users"
import Settings from "./components/Settings"

function App() {
  const [activeSection, setActiveSection] = useState("Dashboard")

  return (
    <div className="min-h-screen bg-[#05070a] text-white">

      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-8">

        {/* Dashboard */}
        {activeSection === "Dashboard" && <Dashboard />}

        {/* Hives */}
        {activeSection === "Hives" && <Hives />}
        {activeSection === "Honey Batches" && <HoneyBatches />}
        {activeSection === "Smart Monitoring" && <SmartMonitoring />}
        {activeSection === "Quality Tests" && <QualityTests />}
        {activeSection === "Blockchain" && <Blockchain />}
        {activeSection === "AI Insights" && <AIInsights />}
        {activeSection === "QR Verification" && <QRVerification />}
        {activeSection === "Reports" && <Reports />}
        {activeSection === "Alerts" && <Alerts />}
        {activeSection === "Maps & Locations" && <MapsLocations />}
        {activeSection === "Users" && <Users />}
        {activeSection === "Settings" && <Settings />}

        
      

        {/* Other sections - temporary */}
                
      </main>
    </div>
  )
}

export default App