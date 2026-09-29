import { useEffect, useState } from "react"

type HoneyBatch = {
  id: number
  batch_code: string
  hive_code: string
  flower_source: string
  quantity_kg: number
  harvest_date: string
  quality_grade: string
  status: string
  created_at: string
}

function HoneyBatches() {
  const [batches, setBatches] = useState<HoneyBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/honey-batches")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch honey batch data")
        }

        return response.json()
      })
      .then((data) => {
        setBatches(data.batches)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setError("Unable to connect to Honey Chain backend")
        setLoading(false)
      })
  }, [])

  const totalBatches = batches.length

  const verifiedBatches = batches.filter(
    (batch) => batch.status.toLowerCase() === "verified"
  ).length

  const pendingBatches = batches.filter(
    (batch) => batch.status.toLowerCase() === "pending"
  ).length

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Honey Batches
        </h1>

        <p className="mt-1 text-gray-400">
          Track and manage honey production batches from harvest to packaging
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">
          <p className="text-gray-400">
            Loading honey batch data...
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

      {!loading && !error && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-5">
              <p className="text-sm text-gray-400">
                Total Batches
              </p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {totalBatches}
              </h2>
            </div>

            <div className="rounded-2xl border border-green-400/20 bg-[#0b1118] p-5">
              <p className="text-sm text-gray-400">
                Verified Batches
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-400">
                {verifiedBatches}
              </h2>
            </div>

            <div className="rounded-2xl border border-yellow-400/20 bg-[#0b1118] p-5">
              <p className="text-sm text-gray-400">
                Pending Verification
              </p>

              <h2 className="mt-2 text-3xl font-bold text-yellow-400">
                {pendingBatches}
              </h2>
            </div>

          </div>

          {/* Batch Table */}
          <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">

            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">
                Honey Production Batches
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Complete batch traceability information
              </p>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b border-white/10 text-sm text-gray-500">

                    <th className="px-4 py-3">
                      Batch ID
                    </th>

                    <th className="px-4 py-3">
                      Hive ID
                    </th>

                    <th className="px-4 py-3">
                      Flower Source
                    </th>

                    <th className="px-4 py-3">
                      Quantity
                    </th>

                    <th className="px-4 py-3">
                      Harvest Date
                    </th>

                    <th className="px-4 py-3">
                      Quality
                    </th>

                    <th className="px-4 py-3">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {batches.map((batch) => {

                    const isVerified =
                      batch.status.toLowerCase() === "verified"

                    return (
                      <tr
                        key={batch.id}
                        className="border-b border-white/5"
                      >

                        <td className="px-4 py-4 font-medium text-white">
                          {batch.batch_code}
                        </td>

                        <td className="px-4 py-4 text-gray-400">
                          {batch.hive_code}
                        </td>

                        <td className="px-4 py-4 text-gray-400">
                          {batch.flower_source}
                        </td>

                        <td className="px-4 py-4 text-gray-400">
                          {batch.quantity_kg} kg
                        </td>

                        <td className="px-4 py-4 text-gray-400">
                          {batch.harvest_date}
                        </td>

                        <td className="px-4 py-4 text-green-400">
                          Grade {batch.quality_grade}
                        </td>

                        <td className="px-4 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              isVerified
                                ? "bg-green-400/10 text-green-400"
                                : "bg-yellow-400/10 text-yellow-400"
                            }`}
                          >
                            {batch.status}
                          </span>

                        </td>

                      </tr>
                    )
                  })}

                </tbody>

              </table>

              {batches.length === 0 && (
                <div className="py-10 text-center">
                  <p className="text-gray-500">
                    No honey batches found in the database.
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

export default HoneyBatches