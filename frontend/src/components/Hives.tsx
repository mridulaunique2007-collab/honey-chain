import { useEffect, useState } from "react"

type Hive = {
  id: number
  hive_code: string
  location: string
  bee_count: number
  queen_status: string
  hive_health: string
  created_at: string
}

function Hives() {
  const [hives, setHives] = useState<Hive[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("http://https://honey-chain-2.onrender.com/api/hives")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch hive data")
        }

        return response.json()
      })
      .then((data) => {
        setHives(data.hives)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setError("Unable to connect to Honey Chain backend")
        setLoading(false)
      })
  }, [])

  const totalHives = hives.length

  const healthyHives = hives.filter(
    (hive) => hive.hive_health.toLowerCase() === "good"
  ).length

  const attentionRequired = totalHives - healthyHives

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Hives
        </h1>

        <p className="mt-1 text-gray-400">
          Manage and monitor all registered bee hives
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">
          <p className="text-gray-400">
            Loading hive data...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6">
          <p className="text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* Summary Cards */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* Total Hives */}
            <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-5">
              <p className="text-sm text-gray-400">
                Total Hives
              </p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {totalHives}
              </h2>
            </div>

            {/* Healthy Hives */}
            <div className="rounded-2xl border border-green-400/20 bg-[#0b1118] p-5">
              <p className="text-sm text-gray-400">
                Healthy Hives
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-400">
                {healthyHives}
              </h2>
            </div>

            {/* Attention */}
            <div className="rounded-2xl border border-yellow-400/20 bg-[#0b1118] p-5">
              <p className="text-sm text-gray-400">
                Attention Required
              </p>

              <h2 className="mt-2 text-3xl font-bold text-yellow-400">
                {attentionRequired}
              </h2>
            </div>

          </div>

          {/* Hive Table */}
          <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">

            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">
                Registered Hives
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Current hive information and health status
              </p>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b border-white/10 text-sm text-gray-500">

                    <th className="px-4 py-3">
                      Hive ID
                    </th>

                    <th className="px-4 py-3">
                      Location
                    </th>

                    <th className="px-4 py-3">
                      Bee Count
                    </th>

                    <th className="px-4 py-3">
                      Queen Status
                    </th>

                    <th className="px-4 py-3">
                      Health
                    </th>

                    <th className="px-4 py-3">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {hives.map((hive) => {

                    const isHealthy =
                      hive.hive_health.toLowerCase() === "good"

                    return (
                      <tr
                        key={hive.id}
                        className="border-b border-white/5"
                      >

                        <td className="px-4 py-4 font-medium text-white">
                          {hive.hive_code}
                        </td>

                        <td className="px-4 py-4 text-gray-400">
                          {hive.location}
                        </td>

                        <td className="px-4 py-4 text-gray-400">
                          {hive.bee_count.toLocaleString()}
                        </td>

                        <td className="px-4 py-4 text-gray-400">
                          {hive.queen_status}
                        </td>

                        <td className="px-4 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              isHealthy
                                ? "bg-green-400/10 text-green-400"
                                : "bg-yellow-400/10 text-yellow-400"
                            }`}
                          >
                            {hive.hive_health}
                          </span>

                        </td>

                        <td className="px-4 py-4">

                          <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs text-green-400">
                            Active
                          </span>

                        </td>

                      </tr>
                    )
                  })}

                </tbody>

              </table>

              {hives.length === 0 && (
                <div className="py-10 text-center">
                  <p className="text-gray-500">
                    No hives found in the database.
                  </p>
                </div>
              )}

            </div>
          </div>
        </>
      )}

    </div>
  )
}

export default Hives