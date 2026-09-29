import { useMemo, useState } from "react"
import {
  Users as UsersIcon,
  UserPlus,
  ShieldCheck,
  Search,
  Eye,
} from "lucide-react"

type User = {
  name: string
  email: string
  role: string
  status: string
  lastActive: string
}

function Users() {
  const [searchTerm, setSearchTerm] = useState("")

  const [users] = useState<User[]>([
    {
      name: "Admin User",
      email: "admin@honeychain.com",
      role: "Administrator",
      status: "Active",
      lastActive: "Just now",
    },
    {
      name: "Farm Manager",
      email: "manager@honeychain.com",
      role: "Farm Manager",
      status: "Active",
      lastActive: "5 min ago",
    },
    {
      name: "Quality Inspector",
      email: "quality@honeychain.com",
      role: "Quality Inspector",
      status: "Active",
      lastActive: "18 min ago",
    },
    {
      name: "Supply Manager",
      email: "supply@honeychain.com",
      role: "Supply Manager",
      status: "Active",
      lastActive: "42 min ago",
    },
  ])

  const filteredUsers = useMemo(() => {
    const search = searchTerm.toLowerCase().trim()

    if (!search) {
      return users
    }

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search) ||
        user.status.toLowerCase().includes(search)
    )
  }, [users, searchTerm])

  const totalUsers = users.length

  const activeUsers = users.filter(
    (user) => user.status.toLowerCase() === "active"
  ).length

  const roleCount = new Set(
    users.map((user) => user.role)
  ).size

  const handleAddUser = () => {
    window.alert(
      "User creation will be connected to the Honey Chain backend and MySQL database."
    )
  }

  const handleViewUser = (user: User) => {
    window.alert(
      `User: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nStatus: ${user.status}`
    )
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <p className="text-sm text-purple-400">
            ACCESS MANAGEMENT
          </p>

          <h1 className="mt-1 text-3xl font-bold text-white">
            Users & Roles
          </h1>

          <p className="mt-2 text-gray-400">
            Manage Honey Chain users, roles and system access.
          </p>
        </div>

        <button
          onClick={handleAddUser}
          className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300"
        >
          <UserPlus size={18} />
          Add User
        </button>

      </div>

      {/* Summary */}
      <div className="grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl border border-purple-400/10 bg-[#0b0f15] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Total Users
            </p>

            <UsersIcon
              size={22}
              className="text-purple-400"
            />
          </div>

          <h2 className="mt-3 text-3xl font-bold text-white">
            {totalUsers}
          </h2>

          <p className="mt-2 text-xs text-gray-500">
            Registered system users
          </p>
        </div>

        <div className="rounded-2xl border border-green-400/10 bg-[#0b0f15] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Active Users
            </p>

            <ShieldCheck
              size={22}
              className="text-green-400"
            />
          </div>

          <h2 className="mt-3 text-3xl font-bold text-white">
            {activeUsers}
          </h2>

          <p className="mt-2 text-xs text-green-400">
            Currently active
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-400/10 bg-[#0b0f15] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Roles
            </p>

            <ShieldCheck
              size={22}
              className="text-cyan-400"
            />
          </div>

          <h2 className="mt-3 text-3xl font-bold text-white">
            {roleCount}
          </h2>

          <p className="mt-2 text-xs text-gray-500">
            Permission groups
          </p>
        </div>

      </div>

      {/* Search */}
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b0f15] px-4 py-3">

        <Search
          size={18}
          className="text-gray-500"
        />

        <input
          type="text"
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          placeholder="Search users..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
        />

      </div>

      {/* Search result information */}
      {searchTerm && (
        <p className="text-sm text-gray-500">
          Showing {filteredUsers.length} user
          {filteredUsers.length !== 1 ? "s" : ""} matching "
          <span className="text-purple-400">
            {searchTerm}
          </span>
          "
        </p>
      )}

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f15]">

        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-lg font-semibold text-white">
            System Users
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Users with access to Honey Chain
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[750px]">

            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-gray-500">

                <th className="px-6 py-4">
                  User
                </th>

                <th className="px-6 py-4">
                  Role
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Last Active
                </th>

                <th className="px-6 py-4">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.email}
                    className="border-b border-white/5 transition hover:bg-white/[0.02]"
                  >

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-400/10 text-sm font-semibold text-purple-400">
                          {user.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-white">
                            {user.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-5">

                      <span className="rounded-full bg-purple-400/10 px-3 py-1 text-xs text-purple-300">
                        {user.role}
                      </span>

                    </td>

                    <td className="px-6 py-5">

                      <span className="flex items-center gap-2 text-xs text-green-400">

                        <span className="h-2 w-2 rounded-full bg-green-400" />

                        {user.status}

                      </span>

                    </td>

                    <td className="px-6 py-5 text-xs text-gray-400">
                      {user.lastActive}
                    </td>

                    <td className="px-6 py-5">

                      <button
                        onClick={() =>
                          handleViewUser(user)
                        }
                        className="flex items-center gap-2 text-xs text-cyan-400 transition hover:text-cyan-300"
                      >
                        <Eye size={15} />
                        View
                      </button>

                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* Roles */}
      <div className="rounded-2xl border border-white/10 bg-[#0b0f15] p-6">

        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white">
            Access Roles
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Permission levels used throughout the system
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

          {[
            ["Administrator", "Full system access"],
            ["Farm Manager", "Hive & farm management"],
            ["Quality Inspector", "Quality testing access"],
            ["Supply Manager", "Batch & distribution"],
            ["Customer", "QR verification only"],
          ].map(([role, description]) => (
            <div
              key={role}
              className="rounded-xl border border-white/10 bg-[#080b10] p-4"
            >

              <ShieldCheck
                size={20}
                className="text-purple-400"
              />

              <p className="mt-3 text-sm font-medium text-white">
                {role}
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                {description}
              </p>

            </div>
          ))}

        </div>

      </div>

      {/* Backend note */}
      <div className="rounded-xl border border-purple-400/10 bg-purple-400/[0.03] p-5">

        <div className="flex gap-3">

          <ShieldCheck
            size={20}
            className="mt-0.5 text-purple-400"
          />

          <div>
            <p className="text-sm font-medium text-purple-300">
              Role-Based Access Control
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              The current project includes the user
              management interface and role structure.
              User authentication and database-backed
              permissions can be connected to the backend
              when required.
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}

export default Users