import { useState } from "react"
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Database,
  User,
  Palette,
  Save,
} from "lucide-react"

function Settings() {
  const [fullName, setFullName] = useState("Admin User")
  const [email, setEmail] = useState("admin@honeychain.com")

  const [notifications, setNotifications] = useState({
    hiveHealth: true,
    qualityTests: true,
    blockchain: true,
    weeklyReports: false,
  })

  const [saved, setSaved] = useState(false)

  const toggleNotification = (
    key: keyof typeof notifications
  ) => {
    setNotifications((current) => ({
      ...current,
      [key]: !current[key],
    }))

    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 3000)
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <p className="text-sm text-yellow-400">
          SYSTEM CONFIGURATION
        </p>

        <h1 className="mt-1 text-3xl font-bold text-white">
          Settings
        </h1>

        <p className="mt-2 text-gray-400">
          Configure Honey Chain system preferences and account settings.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Profile */}
        <div className="rounded-2xl border border-white/10 bg-[#0b0f15] p-6">

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-400/10 p-3">
              <User
                size={20}
                className="text-purple-400"
              />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Profile Settings
              </h2>

              <p className="text-xs text-gray-500">
                Manage your account information
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">

            <div>
              <label className="text-xs text-gray-400">
                Full Name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value)
                  setSaved(false)
                }}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#080b10] px-4 py-3 text-sm text-white outline-none focus:border-purple-400/40"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setSaved(false)
                }}
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#080b10] px-4 py-3 text-sm text-white outline-none focus:border-purple-400/40"
              />
            </div>

          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border border-white/10 bg-[#0b0f15] p-6">

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-400/10 p-3">
              <Bell
                size={20}
                className="text-red-400"
              />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Notifications
              </h2>

              <p className="text-xs text-gray-500">
                Configure system alerts
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">

            {[
              [
                "Hive health alerts",
                "hiveHealth",
              ],
              [
                "Quality test alerts",
                "qualityTests",
              ],
              [
                "Blockchain verification alerts",
                "blockchain",
              ],
              [
                "Weekly reports",
                "weeklyReports",
              ],
            ].map(([label, key]) => {
              const notificationKey =
                key as keyof typeof notifications

              const enabled =
                notifications[notificationKey]

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    toggleNotification(
                      notificationKey
                    )
                  }
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="text-sm text-gray-300">
                    {label}
                  </span>

                  <div
                    className={`h-6 w-11 rounded-full p-1 transition ${
                      enabled
                        ? "bg-green-400/30"
                        : "bg-gray-700"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full transition ${
                        enabled
                          ? "ml-5 bg-green-400"
                          : "bg-gray-400"
                      }`}
                    />
                  </div>
                </button>
              )
            })}

          </div>
        </div>

        {/* Security */}
        <div className="rounded-2xl border border-white/10 bg-[#0b0f15] p-6">

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-400/10 p-3">
              <Shield
                size={20}
                className="text-green-400"
              />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Security
              </h2>

              <p className="text-xs text-gray-500">
                System security configuration
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">

            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#080b10] p-4">
              <div>
                <p className="text-sm text-white">
                  Two-Factor Authentication
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Add an additional security layer
                </p>
              </div>

              <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs text-green-400">
                Enabled
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#080b10] p-4">
              <div>
                <p className="text-sm text-white">
                  Session Security
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Protected session management
                </p>
              </div>

              <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs text-green-400">
                Active
              </span>
            </div>

          </div>
        </div>

        {/* Database */}
        <div className="rounded-2xl border border-white/10 bg-[#0b0f15] p-6">

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-400/10 p-3">
              <Database
                size={20}
                className="text-cyan-400"
              />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Database
              </h2>

              <p className="text-xs text-gray-500">
                Honey Chain data storage
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Database
              </span>

              <span className="text-sm text-white">
                MySQL
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Connection
              </span>

              <span className="flex items-center gap-2 text-sm text-green-400">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Backup
              </span>

              <span className="text-sm text-gray-300">
                Automatic
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Appearance */}
      <div className="rounded-2xl border border-white/10 bg-[#0b0f15] p-6">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-yellow-400/10 p-3">
            <Palette
              size={20}
              className="text-yellow-400"
            />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              Appearance
            </h2>

            <p className="text-xs text-gray-500">
              Honey Chain visual preferences
            </p>
          </div>

        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">

          <div className="rounded-xl border-2 border-yellow-400/50 bg-[#080b10] p-5">
            <div className="h-12 rounded-lg bg-[#05070a]" />

            <p className="mt-3 text-sm font-medium text-white">
              Dark
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Current theme
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#080b10] p-5 opacity-60">
            <div className="h-12 rounded-lg bg-gray-700" />

            <p className="mt-3 text-sm font-medium text-white">
              System
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Follow system preference
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#080b10] p-5 opacity-60">
            <div className="h-12 rounded-lg bg-white" />

            <p className="mt-3 text-sm font-medium text-white">
              Light
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Light interface
            </p>
          </div>

        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-end gap-4">

        {saved && (
          <span className="text-sm text-green-400">
            ✓ Changes saved
          </span>
        )}

        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300"
        >
          <Save size={17} />
          Save Changes
        </button>

      </div>

      {/* Backend note */}
      <div className="rounded-xl border border-yellow-400/10 bg-yellow-400/[0.03] p-5">

        <div className="flex items-start gap-3">

          <SettingsIcon
            size={20}
            className="mt-0.5 text-yellow-400"
          />

          <div>
            <p className="text-sm font-medium text-yellow-300">
              Backend Configuration
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Profile preferences and notification
              settings are currently handled in the
              frontend. They can later be persisted
              through the Honey Chain backend and MySQL
              database.
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}

export default Settings