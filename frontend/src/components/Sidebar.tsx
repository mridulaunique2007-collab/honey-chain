import {
  LayoutDashboard,
  Boxes,
  Activity,
  ShieldCheck,
  Brain,
  QrCode,
  FileText,
  Bell,
  Map,
  Users,
  Settings,
} from "lucide-react"

type SidebarProps = {
  activeSection: string
  setActiveSection: (section: string) => void
}

function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Hives", icon: Boxes },
    { name: "Honey Batches", icon: Boxes },
    { name: "Smart Monitoring", icon: Activity },
    { name: "Quality Tests", icon: ShieldCheck },
    { name: "Blockchain", icon: ShieldCheck },
    { name: "AI Insights", icon: Brain },
    { name: "QR Verification", icon: QrCode },
    { name: "Reports", icon: FileText },
    { name: "Alerts", icon: Bell },
    { name: "Maps & Locations", icon: Map },
    { name: "Users", icon: Users },
    { name: "Settings", icon: Settings },
  ]

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-[#080b10]">
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400/10 text-xl">
          🍯
        </div>

        <div>
          <h1 className="text-lg font-bold text-white">
            Honey Chain
          </h1>

          <p className="text-[10px] uppercase tracking-widest text-gray-500">
            Smart Beekeeping
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4 pb-6">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.name

          return (
            <button
              key={item.name}
              onClick={() => setActiveSection(item.name)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-yellow-400/10 text-yellow-300"
                  : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <Icon size={18} />

              <span>{item.name}</span>

              {isActive && (
                <span className="ml-auto h-2 w-2 rounded-full bg-yellow-400" />
              )}
            </button>
          )
        })}
      </nav>

      {/* System Status */}
      <div className="mx-4 mb-4 shrink-0 rounded-xl border border-green-400/10 bg-green-400/[0.03] p-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-400" />

          <span className="text-xs text-green-400">
            System Online
          </span>
        </div>

        <p className="mt-2 text-[11px] text-gray-500">
          All services operational
        </p>
      </div>

    </aside>
  )
}

export default Sidebar