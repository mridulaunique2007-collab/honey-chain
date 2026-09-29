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

type QualityTest = {
  id: number
  batch_code: string
  moisture_percent: string
  quality_grade: string
  test_result: string
  tested_date: string
}

function Reports() {
  const [hives, setHives] = useState<Hive[]>([])
  const [batches, setBatches] = useState<HoneyBatch[]>([])
  const [qualityTests, setQualityTests] = useState<QualityTest[]>([])

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:5000/api/hives").then((res) => res.json()),
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
      })
      .catch((error) => {
        console.error("Error loading report data:", error)
      })
  }, [])

  /* -----------------------------
     REPORT CALCULATIONS
  ----------------------------- */

  const totalProduction = batches.reduce(
    (total, batch) => total + Number(batch.quantity_kg),
    0
  )

  const activeHives = hives.length

  const passedTests = qualityTests.filter(
    (test) => test.test_result.toLowerCase() === "passed"
  ).length

  const qualityPassRate =
    qualityTests.length > 0
      ? Math.round((passedTests / qualityTests.length) * 100)
      : 0

  const verifiedBatches = batches.filter(
    (batch) => batch.status.toLowerCase() === "verified"
  ).length

  const healthyHives = hives.filter(
    (hive) => hive.hive_health.toLowerCase() === "good"
  ).length

  const warningHives = hives.filter(
    (hive) => hive.hive_health.toLowerCase() === "warning"
  ).length

  const criticalHives = hives.filter(
    (hive) => hive.hive_health.toLowerCase() === "critical"
  ).length

  const healthyPercentage =
    activeHives > 0
      ? Math.round((healthyHives / activeHives) * 100)
      : 0

  const warningPercentage =
    activeHives > 0
      ? Math.round((warningHives / activeHives) * 100)
      : 0

  const criticalPercentage =
    activeHives > 0
      ? Math.round((criticalHives / activeHives) * 100)
      : 0

  /* Quality grade calculations */

  const gradeAPercentage =
    qualityTests.length > 0
      ? Math.round(
          (qualityTests.filter(
            (test) => test.quality_grade.toUpperCase() === "A"
          ).length /
            qualityTests.length) *
            100
        )
      : 0

  const reviewPercentage =
    qualityTests.length > 0
      ? Math.round(
          (qualityTests.filter(
            (test) =>
              test.test_result.toLowerCase() === "pending" ||
              test.test_result.toLowerCase() === "review"
          ).length /
            qualityTests.length) *
            100
        )
      : 0

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Reports & Analytics
        </h1>

        <p className="mt-1 text-gray-400">
          Analyze honey production, hive health and quality performance
        </p>
      </div>

      {/* Report Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-orange-400/20 bg-[#0b1118] p-5">
          <p className="text-sm text-gray-400">
            Total Production
          </p>

          <h2 className="mt-2 text-3xl font-bold text-orange-400">
            {totalProduction.toFixed(2)} kg
          </h2>

          <p className="mt-2 text-xs text-green-400">
            From recorded batches
          </p>
        </div>

        <div className="rounded-2xl border border-blue-400/20 bg-[#0b1118] p-5">
          <p className="text-sm text-gray-400">
            Active Hives
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-400">
            {activeHives}
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            Registered in Honey Chain
          </p>
        </div>

        <div className="rounded-2xl border border-green-400/20 bg-[#0b1118] p-5">
          <p className="text-sm text-gray-400">
            Quality Pass Rate
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-400">
            {qualityPassRate}%
          </h2>

          <p className="mt-2 text-xs text-green-400">
            Based on recorded tests
          </p>
        </div>

        <div className="rounded-2xl border border-purple-400/20 bg-[#0b1118] p-5">
          <p className="text-sm text-gray-400">
            Verified Batches
          </p>

          <h2 className="mt-2 text-3xl font-bold text-purple-400">
            {verifiedBatches}
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            Traceability records
          </p>
        </div>

      </div>

      {/* Production Report */}
      <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">

        <div>
          <h2 className="text-xl font-semibold text-white">
            Production Report
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Recorded honey production by batch
          </p>
        </div>

        {/* Production chart */}
        <div className="mt-8 flex h-64 items-end gap-3 border-b border-white/10 px-4">

          {batches.length > 0 ? (
            batches.map((batch) => {

              const maxProduction = Math.max(
                ...batches.map((item) => Number(item.quantity_kg))
              )

              const height =
                maxProduction > 0
                  ? (Number(batch.quantity_kg) / maxProduction) * 180
                  : 0

              return (
                <div
                  key={batch.id}
                  className="flex flex-1 flex-col items-center justify-end gap-2"
                >

                  <span className="text-xs text-gray-400">
                    {Number(batch.quantity_kg).toFixed(1)} kg
                  </span>

                  <div
                    className="w-full max-w-16 rounded-t-lg bg-yellow-400/70 transition hover:bg-yellow-400"
                    style={{ height: `${Math.max(height, 8)}px` }}
                  />

                  <span className="max-w-20 truncate text-xs text-gray-500">
                    {batch.batch_code}
                  </span>

                </div>
              )
            })
          ) : (
            <div className="flex w-full items-center justify-center text-gray-500">
              No production records available
            </div>
          )}

        </div>

      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Hive Report */}
        <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">

          <h2 className="text-xl font-semibold text-white">
            Hive Health Report
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Current health distribution
          </p>

          <div className="mt-6 space-y-4">

            {/* Healthy */}
            <div>
              <div className="mb-2 flex justify-between text-sm">

                <span className="text-gray-400">
                  Healthy
                </span>

                <span className="text-green-400">
                  {healthyPercentage}%
                </span>

              </div>

              <div className="h-2 rounded-full bg-white/5">

                <div
                  className="h-2 rounded-full bg-green-400"
                  style={{ width: `${healthyPercentage}%` }}
                />

              </div>
            </div>

            {/* Warning */}
            <div>
              <div className="mb-2 flex justify-between text-sm">

                <span className="text-gray-400">
                  Warning
                </span>

                <span className="text-yellow-400">
                  {warningPercentage}%
                </span>

              </div>

              <div className="h-2 rounded-full bg-white/5">

                <div
                  className="h-2 rounded-full bg-yellow-400"
                  style={{ width: `${warningPercentage}%` }}
                />

              </div>
            </div>

            {/* Critical */}
            <div>
              <div className="mb-2 flex justify-between text-sm">

                <span className="text-gray-400">
                  Critical
                </span>

                <span className="text-red-400">
                  {criticalPercentage}%
                </span>

              </div>

              <div className="h-2 rounded-full bg-white/5">

                <div
                  className="h-2 rounded-full bg-red-400"
                  style={{ width: `${criticalPercentage}%` }}
                />

              </div>
            </div>

          </div>

        </div>

        {/* Quality Report */}
        <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">

          <h2 className="text-xl font-semibold text-white">
            Quality Report
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Honey quality distribution
          </p>

          <div className="mt-6 space-y-4">

            <div className="flex items-center justify-between rounded-xl border border-green-400/10 bg-green-400/[0.03] p-4">

              <span className="text-gray-300">
                Grade A
              </span>

              <span className="font-semibold text-green-400">
                {gradeAPercentage}%
              </span>

            </div>

            <div className="flex items-center justify-between rounded-xl border border-blue-400/10 bg-blue-400/[0.03] p-4">

              <span className="text-gray-300">
                Passed Tests
              </span>

              <span className="font-semibold text-blue-400">
                {qualityPassRate}%
              </span>

            </div>

            <div className="flex items-center justify-between rounded-xl border border-yellow-400/10 bg-yellow-400/[0.03] p-4">

              <span className="text-gray-300">
                Total Tests
              </span>

              <span className="font-semibold text-yellow-400">
                {qualityTests.length}
              </span>

            </div>

            <div className="flex items-center justify-between rounded-xl border border-red-400/10 bg-red-400/[0.03] p-4">

              <span className="text-gray-300">
                Review Required
              </span>

              <span className="font-semibold text-red-400">
                {reviewPercentage}%
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* Export Section */}
      <div className="flex flex-col gap-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.03] p-6 md:flex-row md:items-center md:justify-between">

        <div>

          <h2 className="font-semibold text-cyan-300">
            Generate Reports
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Export production, hive and quality information for analysis.
          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={() => {
              const reportData = {
                totalProduction,
                activeHives,
                qualityPassRate,
                verifiedBatches,
                healthyPercentage,
                warningPercentage,
                criticalPercentage,
              }

              const csvContent =
                "Metric,Value\n" +
                Object.entries(reportData)
                  .map(([key, value]) => `${key},${value}`)
                  .join("\n")

              const blob = new Blob([csvContent], {
                type: "text/csv;charset=utf-8;",
              })

              const url = URL.createObjectURL(blob)

              const link = document.createElement("a")
              link.href = url
              link.download = "honey-chain-report.csv"

              link.click()

              URL.revokeObjectURL(url)
            }}
            className="rounded-xl border border-white/10 bg-[#0b1118] px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
          >
            Export CSV
          </button>

          <button
            onClick={() => window.print()}
            className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-black hover:bg-cyan-300"
          >
            Generate Report
          </button>

        </div>

      </div>

      {/* Data Source */}
      <div className="rounded-2xl border border-blue-400/20 bg-blue-400/[0.03] p-5">

        <p className="text-sm text-gray-500">

          <span className="font-semibold text-blue-300">
            Data source:
          </span>{" "}
          Reports are generated from Honey Chain database records
          including registered hives, honey batches and quality tests.

        </p>

      </div>

    </div>
  )
}

export default Reports