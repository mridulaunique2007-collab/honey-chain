import { useEffect, useState } from "react"

type Hive = {
  id: number
  hive_code: string
  location: string
  hive_health: string
}

type HoneyBatch = {
  id: number
  batch_code: string
  hive_code: string
  flower_source: string
  quantity_kg: number
  harvest_date: string
  quality_grade: string
  status: string
}

type QualityTest = {
  id: number
  batch_code: string
  moisture_percent: string
  quality_grade: string
  test_result: string
  tested_date: string
}

function Blockchain() {
  const [hives, setHives] = useState<Hive[]>([])
  const [batches, setBatches] = useState<HoneyBatch[]>([])
  const [qualityTests, setQualityTests] = useState<QualityTest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:5000/api/hives").then((res) =>
        res.json()
      ),
      fetch("http://127.0.0.1:5000/api/honey-batches").then((res) =>
        res.json()
      ),
      fetch("http://127.0.0.1:5000/api/quality-tests").then((res) =>
        res.json()
      ),
    ])
      .then(([hiveData, batchData, qualityData]) => {
        setHives(hiveData.hives || [])
        setBatches(batchData.batches || [])
        setQualityTests(qualityData.quality_tests || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("Traceability data error:", error)
        setLoading(false)
      })
  }, [])

  const totalRecords =
    hives.length + batches.length + qualityTests.length

  const verifiedBatches = batches.filter(
    (batch) => batch.status.toLowerCase() === "verified"
  ).length

  const latestBatch = batches[0]
  const latestQuality = qualityTests[0]
  const latestHive = hives[0]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Blockchain Traceability
        </h1>

        <p className="mt-1 text-gray-400">
          Verify the integrity and traceability of honey production records
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">
          <p className="text-gray-400">
            Loading traceability data...
          </p>
        </div>
      )}

      {!loading && (
        <>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <div className="rounded-2xl border border-purple-400/20 bg-[#0b1118] p-5">
              <p className="text-sm text-gray-400">
                Traceability Records
              </p>

              <h2 className="mt-2 text-3xl font-bold text-purple-400">
                {totalRecords}
              </h2>

              <p className="mt-2 text-xs text-gray-500">
                Hive, batch and quality records
              </p>
            </div>

            <div className="rounded-2xl border border-green-400/20 bg-[#0b1118] p-5">
              <p className="text-sm text-gray-400">
                Verified Batches
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-400">
                {verifiedBatches}
              </h2>

              <p className="mt-2 text-xs text-green-400">
                Database verification status
              </p>
            </div>

            <div className="rounded-2xl border border-blue-400/20 bg-[#0b1118] p-5">
              <p className="text-sm text-gray-400">
                Latest Batch
              </p>

              <h2 className="mt-2 text-2xl font-bold text-blue-400">
                {latestBatch?.batch_code || "--"}
              </h2>

              <p className="mt-2 text-xs text-gray-500">
                Latest registered honey batch
              </p>
            </div>

          </div>

          {/* Traceability Status */}
          <div className="rounded-2xl border border-purple-400/20 bg-purple-400/[0.03] p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10">
                ⛓️
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Traceability Network
                </h2>

                <p className="text-sm text-green-400">
                  ● Traceability system operational
                </p>
              </div>

            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

              <div>
                <p className="text-xs text-gray-500">
                  Record Verification
                </p>

                <p className="mt-1 text-sm text-white">
                  Enabled
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Data Integrity
                </p>

                <p className="mt-1 text-sm text-green-400">
                  Verified
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Traceable Batch
                </p>

                <p className="mt-1 text-sm text-white">
                  {latestBatch?.batch_code || "--"}
                </p>
              </div>

            </div>

          </div>

          {/* Traceability Records */}
          <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">

            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">
                Recent Traceability Records
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Records retrieved from the Honey Chain database
              </p>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b border-white/10 text-sm text-gray-500">

                    <th className="px-4 py-3">
                      Record
                    </th>

                    <th className="px-4 py-3">
                      Type
                    </th>

                    <th className="px-4 py-3">
                      Reference
                    </th>

                    <th className="px-4 py-3">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {latestHive && (
                    <tr className="border-b border-white/5">

                      <td className="px-4 py-4 font-medium text-white">
                        Hive Registration
                      </td>

                      <td className="px-4 py-4 text-blue-400">
                        Hive
                      </td>

                      <td className="px-4 py-4 font-mono text-xs text-gray-400">
                        {latestHive.hive_code}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs text-green-400">
                          Verified
                        </span>
                      </td>

                    </tr>
                  )}

                  {latestBatch && (
                    <tr className="border-b border-white/5">

                      <td className="px-4 py-4 font-medium text-white">
                        Honey Batch
                      </td>

                      <td className="px-4 py-4 text-yellow-400">
                        Harvest
                      </td>

                      <td className="px-4 py-4 font-mono text-xs text-gray-400">
                        {latestBatch.batch_code}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs text-green-400">
                          {latestBatch.status}
                        </span>
                      </td>

                    </tr>
                  )}

                  {latestQuality && (
                    <tr>

                      <td className="px-4 py-4 font-medium text-white">
                        Quality Test
                      </td>

                      <td className="px-4 py-4 text-green-400">
                        Quality
                      </td>

                      <td className="px-4 py-4 font-mono text-xs text-gray-400">
                        {latestQuality.batch_code}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs text-green-400">
                          {latestQuality.test_result}
                        </span>
                      </td>

                    </tr>
                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* Honey Traceability */}
          <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">

            <h2 className="text-xl font-semibold text-white">
              Honey Traceability
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Current batch lifecycle recorded in Honey Chain
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">

              <span className="rounded-xl border border-blue-400/20 bg-blue-400/5 px-4 py-3 text-sm text-blue-300">
                {latestHive?.hive_code || "Bee Farm"}
              </span>

              <span className="text-gray-600">
                →
              </span>

              <span className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 px-4 py-3 text-sm text-yellow-300">
                {latestBatch?.batch_code || "Harvest"}
              </span>

              <span className="text-gray-600">
                →
              </span>

              <span className="rounded-xl border border-green-400/20 bg-green-400/5 px-4 py-3 text-sm text-green-300">
                Quality Test
              </span>

              <span className="text-gray-600">
                →
              </span>

              <span className="rounded-xl border border-purple-400/20 bg-purple-400/5 px-4 py-3 text-sm text-purple-300">
                Verified Record
              </span>

              <span className="text-gray-600">
                →
              </span>

              <span className="rounded-xl border border-orange-400/20 bg-orange-400/5 px-4 py-3 text-sm text-orange-300">
                Packaging
              </span>

              <span className="text-gray-600">
                →
              </span>

              <span className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-sm text-cyan-300">
                Customer
              </span>

            </div>

          </div>

        </>
      )}

    </div>
  )
}

export default Blockchain