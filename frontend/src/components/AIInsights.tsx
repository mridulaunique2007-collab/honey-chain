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

type SensorData = {
  id: number
  hive_code: string
  temperature: number
  humidity: number
  hive_weight: number
  bee_activity: string
}

type QualityTest = {
  id: number
  batch_code: string
  moisture_percent: string
  quality_grade: string
  test_result: string
  tested_date: string
}

function AIInsights() {
  const [hives, setHives] = useState<Hive[]>([])
  const [batches, setBatches] = useState<HoneyBatch[]>([])
  const [sensorData, setSensorData] = useState<SensorData[]>([])
  const [qualityTests, setQualityTests] = useState<QualityTest[]>([])

  useEffect(() => {
    Promise.all([
      fetch("http://https://honey-chain-2.onrender.com/api/hives").then((res) => res.json()),
      fetch("http://https://honey-chain-2.onrender.com/api/honey-batches").then((res) =>
        res.json()
      ),
      fetch("http://https://honey-chain-2.onrender.com/api/sensor-data").then((res) =>
        res.json()
      ),
      fetch("http://https://honey-chain-2.onrender.com/api/quality-tests").then((res) =>
        res.json()
      ),
    ])
      .then(([hiveData, batchData, sensorDataResult, qualityData]) => {
        setHives(hiveData.hives || [])
        setBatches(batchData.batches || [])
        setSensorData(sensorDataResult.sensor_data || [])
        setQualityTests(qualityData.quality_tests || [])
      })
      .catch((error) => {
        console.error("Error loading AI insight data:", error)
      })
  }, [])

  /* -----------------------------
     AI DATA ANALYSIS
  ----------------------------- */

  const totalHives = hives.length

  const healthyHives = hives.filter(
    (hive) => hive.hive_health.toLowerCase() === "good"
  ).length

  const attentionHives = hives.filter(
    (hive) =>
      hive.hive_health.toLowerCase() === "warning" ||
      hive.hive_health.toLowerCase() === "critical"
  ).length

  const healthyRate =
    totalHives > 0
      ? Math.round((healthyHives / totalHives) * 100)
      : 0

  const totalHoneyProduced = batches.reduce(
    (total, batch) => total + Number(batch.quantity_kg),
    0
  )

  const averageTemperature =
    sensorData.length > 0
      ? sensorData.reduce(
          (total, sensor) => total + Number(sensor.temperature),
          0
        ) / sensorData.length
      : 0

  const averageHumidity =
    sensorData.length > 0
      ? sensorData.reduce(
          (total, sensor) => total + Number(sensor.humidity),
          0
        ) / sensorData.length
      : 0

  const highTemperatureHives = sensorData.filter(
    (sensor) => Number(sensor.temperature) > 35
  )

  const highHumidityHives = sensorData.filter(
    (sensor) => Number(sensor.humidity) > 70
  )

  const lowActivityHives = sensorData.filter(
    (sensor) => sensor.bee_activity.toLowerCase() === "low"
  )

  const qualityIssues = qualityTests.filter(
    (test) =>
      test.test_result.toLowerCase() === "pending" ||
      test.test_result.toLowerCase() === "review"
  )

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          AI Insights
        </h1>

        <p className="mt-1 text-gray-400">
          Data-driven insights for smarter beekeeping decisions
        </p>
      </div>

      {/* AI Overview */}
      <div className="rounded-2xl border border-purple-400/20 bg-purple-400/[0.03] p-6">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-400/10 text-2xl">
            🧠
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Honey Chain AI Engine
            </h2>

            <p className="text-sm text-gray-400">
              Analyzing hive, production and quality data
            </p>
          </div>

          <span className="ml-auto rounded-full bg-green-400/10 px-3 py-1 text-xs text-green-400">
            Analysis Ready
          </span>

        </div>

      </div>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* Production */}
        <div className="rounded-2xl border border-orange-400/20 bg-[#0b1118] p-5">

          <p className="text-sm text-gray-400">
            Honey Production
          </p>

          <h2 className="mt-2 text-3xl font-bold text-orange-400">
            {totalHoneyProduced.toFixed(2)} kg
          </h2>

          <p className="mt-2 text-sm text-green-400">
            Based on recorded batches
          </p>

        </div>

        {/* Healthy Hive Rate */}
        <div className="rounded-2xl border border-green-400/20 bg-[#0b1118] p-5">

          <p className="text-sm text-gray-400">
            Healthy Hive Rate
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-400">
            {healthyRate}%
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            {healthyHives} of {totalHives} hives healthy
          </p>

        </div>

        {/* Risk Detection */}
        <div className="rounded-2xl border border-yellow-400/20 bg-[#0b1118] p-5">

          <p className="text-sm text-gray-400">
            Risk Detection
          </p>

          <h2 className="mt-2 text-3xl font-bold text-yellow-400">
            {attentionHives}
          </h2>

          <p className="mt-2 text-sm text-yellow-400">
            Hives need attention
          </p>

        </div>

      </div>

      {/* Sensor Analysis */}
      <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">

        <h2 className="text-xl font-semibold text-white">
          Environmental Analysis
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Current sensor data analyzed by the Honey Chain insight engine
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-xl border border-white/10 p-4">

            <p className="text-sm text-gray-400">
              Average Temperature
            </p>

            <p className="mt-2 text-2xl font-bold text-orange-400">
              {averageTemperature.toFixed(1)}°C
            </p>

          </div>

          <div className="rounded-xl border border-white/10 p-4">

            <p className="text-sm text-gray-400">
              Average Humidity
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-400">
              {averageHumidity.toFixed(1)}%
            </p>

          </div>

          <div className="rounded-xl border border-white/10 p-4">

            <p className="text-sm text-gray-400">
              Sensor Records
            </p>

            <p className="mt-2 text-2xl font-bold text-purple-400">
              {sensorData.length}
            </p>

          </div>

        </div>

      </div>

      {/* AI Recommendations */}
      <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">

        <h2 className="text-xl font-semibold text-white">
          AI Recommendations
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Potential actions identified from available data
        </p>

        <div className="mt-6 space-y-4">

          {/* Temperature */}
          {highTemperatureHives.length > 0 && (
            <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/[0.03] p-4">

              <div className="flex items-start gap-3">

                <span className="text-xl">
                  ⚠️
                </span>

                <div>

                  <h3 className="font-medium text-yellow-300">
                    Monitor Hive Temperature
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    {highTemperatureHives
                      .map(
                        (sensor) =>
                          `${sensor.hive_code} (${sensor.temperature}°C)`
                      )
                      .join(", ")}{" "}
                    recorded elevated temperature readings.
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* Humidity */}
          {highHumidityHives.length > 0 && (
            <div className="rounded-xl border border-blue-400/20 bg-blue-400/[0.03] p-4">

              <div className="flex items-start gap-3">

                <span className="text-xl">
                  💧
                </span>

                <div>

                  <h3 className="font-medium text-blue-300">
                    Monitor Hive Humidity
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    Some monitored hives have humidity readings above
                    the configured monitoring threshold.
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* Bee Activity */}
          {lowActivityHives.length > 0 && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/[0.03] p-4">

              <div className="flex items-start gap-3">

                <span className="text-xl">
                  🐝
                </span>

                <div>

                  <h3 className="font-medium text-red-300">
                    Check Bee Activity
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    Low bee activity was detected in{" "}
                    {lowActivityHives.length} monitored hive
                    {lowActivityHives.length > 1 ? "s" : ""}.
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* Quality */}
          {qualityIssues.length > 0 && (
            <div className="rounded-xl border border-orange-400/20 bg-orange-400/[0.03] p-4">

              <div className="flex items-start gap-3">

                <span className="text-xl">
                  🍯
                </span>

                <div>

                  <h3 className="font-medium text-orange-300">
                    Quality Tests Need Review
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    {qualityIssues.length} quality test
                    {qualityIssues.length > 1 ? "s are" : " is"} currently
                    pending review.
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* Healthy System */}
          {highTemperatureHives.length === 0 &&
            highHumidityHives.length === 0 &&
            lowActivityHives.length === 0 &&
            qualityIssues.length === 0 && (
              <div className="rounded-xl border border-green-400/20 bg-green-400/[0.03] p-4">

                <div className="flex items-start gap-3">

                  <span className="text-xl">
                    ✓
                  </span>

                  <div>

                    <h3 className="font-medium text-green-300">
                      No Immediate Risks Detected
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      Current hive, sensor and quality records do not
                      show any configured warning conditions.
                    </p>

                  </div>

                </div>

              </div>
            )}

        </div>

      </div>

      {/* AI Models */}
      <div className="rounded-2xl border border-purple-400/20 bg-[#0b1118] p-6">

        <h2 className="text-xl font-semibold text-white">
          AI Analysis Models
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-xl border border-white/10 p-4">

            <p className="text-sm text-gray-400">
              Honey Production Analysis
            </p>

            <p className="mt-2 text-purple-300">
              Data-based Analysis
            </p>

            <span className="mt-3 inline-block text-xs text-green-400">
              Active
            </span>

          </div>

          <div className="rounded-xl border border-white/10 p-4">

            <p className="text-sm text-gray-400">
              Hive Risk Detection
            </p>

            <p className="mt-2 text-purple-300">
              Rule-based Classification
            </p>

            <span className="mt-3 inline-block text-xs text-green-400">
              Active
            </span>

          </div>

          <div className="rounded-xl border border-white/10 p-4">

            <p className="text-sm text-gray-400">
              Anomaly Detection
            </p>

            <p className="mt-2 text-purple-300">
              Sensor Analysis
            </p>

            <span className="mt-3 inline-block text-xs text-green-400">
              Active
            </span>

          </div>

        </div>

      </div>

      {/* Data Source */}
      <div className="rounded-2xl border border-blue-400/20 bg-blue-400/[0.03] p-5">

        <p className="text-sm text-gray-400">

          <span className="font-semibold text-blue-300">
            Data source:
          </span>{" "}
          AI insights are generated from live Honey Chain records
          including hive health, honey production, sensor readings and
          quality test results.

        </p>

      </div>

    </div>
  )
}

export default AIInsights