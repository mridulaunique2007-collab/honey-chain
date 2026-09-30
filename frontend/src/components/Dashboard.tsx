import { useEffect, useState } from "react"

type Hive = {
  id: number
  hive_code: string
  location: string
  bee_count: number
  queen_status: string
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

function Dashboard() {
  const [hives, setHives] = useState<Hive[]>([])
  const [batches, setBatches] = useState<HoneyBatch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("http://https://honey-chain-2.onrender.com/api/hives").then((res) =>
        res.json()
      ),
      fetch("http://https://honey-chain-2.onrender.com/api/honey-batches").then((res) =>
        res.json()
      ),
    ])
      .then(([hiveData, batchData]) => {
        setHives(hiveData.hives || [])
        setBatches(batchData.batches || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("Dashboard data error:", error)
        setLoading(false)
      })
  }, [])

  const totalHives = hives.length

  const healthyHives = hives.filter(
    (hive) => hive.hive_health.toLowerCase() === "good"
  ).length

  const warningHives = hives.filter(
    (hive) => hive.hive_health.toLowerCase() === "warning"
  ).length

  const criticalHives = hives.filter(
    (hive) => hive.hive_health.toLowerCase() === "critical"
  ).length

  const totalHoneyProduced = batches.reduce(
    (total, batch) => total + Number(batch.quantity_kg),
    0
  )

  const totalBatches = batches.length

  const verifiedBatches = batches.filter(
    (batch) => batch.status.toLowerCase() === "verified"
  ).length

  const activeAlerts = warningHives + criticalHives

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="mt-1 text-gray-400">
          Honey Chain overview and beekeeping performance
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-5">
          <p className="text-gray-400">
            Loading Honey Chain data...
          </p>
        </div>
      )}

      {/* KPI Cards */}
      {!loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          {/* Total Hives */}
          <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-5">
            <p className="text-sm text-gray-400">
              Total Hives
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              {totalHives}
            </h2>

            <p className="mt-2 text-sm text-green-400">
              Live database count
            </p>
          </div>

          {/* Honey Produced */}
          <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-5">
            <p className="text-sm text-gray-400">
              Honey Produced
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              {totalHoneyProduced.toFixed(2)} kg
            </h2>

            <p className="mt-2 text-sm text-green-400">
              From registered batches
            </p>
          </div>

          {/* Total Batches */}
          <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-5">
            <p className="text-sm text-gray-400">
              Total Batches
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              {totalBatches}
            </h2>

            <p className="mt-2 text-sm text-green-400">
              {verifiedBatches} verified
            </p>
          </div>

          {/* Active Alerts */}
          <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-5">
            <p className="text-sm text-gray-400">
              Active Alerts
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              {activeAlerts}
            </h2>

            <p className="mt-2 text-sm text-yellow-400">
              Based on hive health
            </p>
          </div>

        </div>
      )}

      {/* Honey Production */}
      <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">

        <h2 className="text-xl font-semibold text-white">
          Honey Production
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Current registered honey production
        </p>

        <div className="mt-8 flex h-64 items-end gap-3">

          {batches.length > 0 ? (
            batches.map((batch) => {

              const maxQuantity = Math.max(
                ...batches.map((item) =>
                  Number(item.quantity_kg)
                )
              )

              const height =
                (Number(batch.quantity_kg) / maxQuantity) * 100

              return (
                <div
                  key={batch.id}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >

                  <div
                    className="w-full max-w-12 rounded-t-lg bg-yellow-400"
                    style={{
                      height: `${Math.max(height, 10)}%`,
                    }}
                  />

                  <span className="text-xs text-gray-500">
                    {batch.batch_code}
                  </span>

                </div>
              )
            })
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-gray-500">
                No honey production data available.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Hive Health + Recent Batches */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Hive Health */}
        <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">

          <h2 className="text-xl font-semibold text-white">
            Hive Health Overview
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Current hive status
          </p>

          <div className="mt-6 space-y-5">

            {/* Healthy */}
            <div>
              <div className="mb-2 flex justify-between">

                <span className="text-gray-300">
                  Healthy
                </span>

                <span className="text-green-400">
                  {healthyHives}
                </span>

              </div>

              <div className="h-2 rounded-full bg-gray-800">

                <div
                  className="h-2 rounded-full bg-green-400"
                  style={{
                    width:
                      totalHives > 0
                        ? `${(healthyHives / totalHives) * 100}%`
                        : "0%",
                  }}
                />

              </div>
            </div>

            {/* Warning */}
            <div>
              <div className="mb-2 flex justify-between">

                <span className="text-gray-300">
                  Warning
                </span>

                <span className="text-yellow-400">
                  {warningHives}
                </span>

              </div>

              <div className="h-2 rounded-full bg-gray-800">

                <div
                  className="h-2 rounded-full bg-yellow-400"
                  style={{
                    width:
                      totalHives > 0
                        ? `${(warningHives / totalHives) * 100}%`
                        : "0%",
                  }}
                />

              </div>
            </div>

            {/* Critical */}
            <div>
              <div className="mb-2 flex justify-between">

                <span className="text-gray-300">
                  Critical
                </span>

                <span className="text-red-400">
                  {criticalHives}
                </span>

              </div>

              <div className="h-2 rounded-full bg-gray-800">

                <div
                  className="h-2 rounded-full bg-red-400"
                  style={{
                    width:
                      totalHives > 0
                        ? `${(criticalHives / totalHives) * 100}%`
                        : "0%",
                  }}
                />

              </div>
            </div>

          </div>

        </div>

        {/* Recent Batches */}
        <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">

          <h2 className="text-xl font-semibold text-white">
            Recent Honey Batches
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Latest batch activity
          </p>

          <div className="mt-6 space-y-4">

            {batches.length > 0 ? (
              batches.slice(0, 5).map((batch) => (

                <div
                  key={batch.id}
                  className="flex items-center justify-between border-b border-white/10 pb-3"
                >

                  <div>

                    <p className="font-medium text-white">
                      {batch.batch_code}
                    </p>

                    <p className="text-sm text-gray-500">
                      {batch.flower_source} •{" "}
                      {batch.quantity_kg} kg
                    </p>

                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      batch.status.toLowerCase() === "verified"
                        ? "bg-green-400/10 text-green-400"
                        : "bg-yellow-400/10 text-yellow-400"
                    }`}
                  >
                    {batch.status}
                  </span>

                </div>

              ))
            ) : (
              <p className="py-6 text-center text-gray-500">
                No honey batches found.
              </p>
            )}

          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard