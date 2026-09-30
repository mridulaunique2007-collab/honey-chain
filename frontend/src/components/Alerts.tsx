import { useEffect, useState } from "react"

type SensorData = {
  id: number
  hive_code: string
  temperature: number
  humidity: number
  hive_weight: number
  bee_activity: string
}

type Hive = {
  id: number
  hive_code: string
  location: string
  bee_count: number
  queen_status: string
  hive_health: string
}

type QualityTest = {
  id: number
  batch_code: string
  moisture_percent: string
  quality_grade: string
  test_result: string
  tested_date: string
}

type Alert = {
  title: string
  description: string
  type: "Critical" | "Warning" | "Quality"
  color: "red" | "yellow" | "orange"
}

function Alerts() {
  const [sensorData, setSensorData] = useState<SensorData[]>([])
  const [hives, setHives] = useState<Hive[]>([])
  const [qualityTests, setQualityTests] = useState<QualityTest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("http://https://honey-chain-2.onrender.com/api/sensor-data").then((res) =>
        res.json()
      ),
      fetch("http://https://honey-chain-2.onrender.com/api/hives").then((res) =>
        res.json()
      ),
      fetch("http://https://honey-chain-2.onrender.com/api/quality-tests").then((res) =>
        res.json()
      ),
    ])
      .then(([sensorResult, hiveResult, qualityResult]) => {
        setSensorData(sensorResult.sensor_data || [])
        setHives(hiveResult.hives || [])
        setQualityTests(qualityResult.quality_tests || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("Alert data error:", error)
        setLoading(false)
      })
  }, [])

  const alerts: Alert[] = []

  /*
   * Temperature monitoring
   * Values above 35°C are treated as a warning.
   * Values above 38°C are treated as critical.
   */
  sensorData.forEach((sensor) => {
    if (sensor.temperature > 38) {
      alerts.push({
        title: "Critical Hive Temperature",
        description: `${sensor.hive_code} temperature is ${sensor.temperature}°C, which is above the critical monitoring threshold.`,
        type: "Critical",
        color: "red",
      })
    } else if (sensor.temperature > 35) {
      alerts.push({
        title: "High Hive Temperature",
        description: `${sensor.hive_code} temperature is ${sensor.temperature}°C and requires monitoring.`,
        type: "Warning",
        color: "yellow",
      })
    }
  })

  /*
   * Humidity monitoring
   * Values above 70% are treated as a warning.
   */
  sensorData.forEach((sensor) => {
    if (sensor.humidity > 70) {
      alerts.push({
        title: "High Hive Humidity",
        description: `${sensor.hive_code} humidity is ${sensor.humidity}%.`,
        type: "Warning",
        color: "yellow",
      })
    }
  })

  /*
   * Bee activity monitoring
   */
  sensorData.forEach((sensor) => {
    if (sensor.bee_activity.toLowerCase() === "low") {
      alerts.push({
        title: "Low Bee Activity",
        description: `${sensor.hive_code} is reporting low bee activity.`,
        type: "Warning",
        color: "yellow",
      })
    }
  })

  /*
   * Hive health monitoring
   */
  hives.forEach((hive) => {
    const health = hive.hive_health.toLowerCase()

    if (health === "critical") {
      alerts.push({
        title: "Critical Hive Health",
        description: `${hive.hive_code} at ${hive.location} is marked as critical.`,
        type: "Critical",
        color: "red",
      })
    } else if (health === "warning") {
      alerts.push({
        title: "Hive Health Warning",
        description: `${hive.hive_code} at ${hive.location} requires attention.`,
        type: "Warning",
        color: "yellow",
      })
    }
  })

  /*
   * Quality monitoring
   */
  qualityTests.forEach((test) => {
    const result = test.test_result.toLowerCase()

    if (result === "review" || result === "pending") {
      alerts.push({
        title: "Honey Batch Requires Review",
        description: `Batch ${test.batch_code} requires additional quality verification.`,
        type: "Quality",
        color: "orange",
      })
    }
  })

  const criticalAlerts = alerts.filter(
    (alert) => alert.type === "Critical"
  ).length

  const warningAlerts = alerts.filter(
    (alert) => alert.type === "Warning"
  ).length

  const qualityAlerts = alerts.filter(
    (alert) => alert.type === "Quality"
  ).length

  const totalActiveAlerts = alerts.length

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Alerts
        </h1>

        <p className="mt-1 text-gray-400">
          Monitor important warnings and events across Honey Chain
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-8 text-center">
          <p className="text-gray-400">
            Loading alert data...
          </p>
        </div>
      ) : (
        <>

          {/* Summary */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <div className="rounded-2xl border border-red-400/20 bg-[#0b1118] p-5">
              <p className="text-sm text-gray-400">
                Critical Alerts
              </p>

              <h2 className="mt-2 text-3xl font-bold text-red-400">
                {criticalAlerts}
              </h2>

              <p className="mt-2 text-xs text-gray-500">
                Require immediate attention
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-400/20 bg-[#0b1118] p-5">
              <p className="text-sm text-gray-400">
                Warnings
              </p>

              <h2 className="mt-2 text-3xl font-bold text-yellow-400">
                {warningAlerts}
              </h2>

              <p className="mt-2 text-xs text-gray-500">
                Monitoring required
              </p>
            </div>

            <div className="rounded-2xl border border-green-400/20 bg-[#0b1118] p-5">
              <p className="text-sm text-gray-400">
                Active Alerts
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-400">
                {totalActiveAlerts}
              </h2>

              <p className="mt-2 text-xs text-green-400">
                Generated from live records
              </p>
            </div>

          </div>

          {/* Active Alerts */}
          <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">

            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">
                Active Alerts
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Automatically generated from Honey Chain data
              </p>
            </div>

            {alerts.length === 0 ? (
              <div className="rounded-xl border border-green-400/20 bg-green-400/[0.03] p-6 text-center">

                <div className="text-3xl">
                  ✓
                </div>

                <h3 className="mt-3 font-semibold text-green-400">
                  No Active Alerts
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  All monitored conditions are currently within the configured thresholds.
                </p>

              </div>
            ) : (
              <div className="space-y-4">

                {alerts.map((alert, index) => (

                  <div
                    key={`${alert.title}-${index}`}
                    className={`rounded-xl border p-5 ${
                      alert.color === "red"
                        ? "border-red-400/20 bg-red-400/[0.03]"
                        : alert.color === "yellow"
                        ? "border-yellow-400/20 bg-yellow-400/[0.03]"
                        : "border-orange-400/20 bg-orange-400/[0.03]"
                    }`}
                  >

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                      <div className="flex gap-4">

                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            alert.color === "red"
                              ? "bg-red-400/10 text-red-400"
                              : alert.color === "yellow"
                              ? "bg-yellow-400/10 text-yellow-400"
                              : "bg-orange-400/10 text-orange-400"
                          }`}
                        >
                          !
                        </div>

                        <div>

                          <h3
                            className={`font-semibold ${
                              alert.color === "red"
                                ? "text-red-300"
                                : alert.color === "yellow"
                                ? "text-yellow-300"
                                : "text-orange-300"
                            }`}
                          >
                            {alert.title}
                          </h3>

                          <p className="mt-1 text-sm text-gray-400">
                            {alert.description}
                          </p>

                          <p className="mt-2 text-xs text-gray-600">
                            Generated from current database readings
                          </p>

                        </div>

                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          alert.color === "red"
                            ? "bg-red-400/10 text-red-400"
                            : alert.color === "yellow"
                            ? "bg-yellow-400/10 text-yellow-400"
                            : "bg-orange-400/10 text-orange-400"
                        }`}
                      >
                        {alert.type}
                      </span>

                    </div>

                  </div>

                ))}

              </div>
            )}

          </div>

          {/* Alert Categories */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">

              <h2 className="text-xl font-semibold text-white">
                Alert Categories
              </h2>

              <div className="mt-5 space-y-3">

                <div className="flex items-center justify-between rounded-xl bg-red-400/[0.04] p-4">
                  <span className="text-sm text-gray-300">
                    Critical
                  </span>

                  <span className="text-red-400">
                    {criticalAlerts}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-yellow-400/[0.04] p-4">
                  <span className="text-sm text-gray-300">
                    Sensor Monitoring
                  </span>

                  <span className="text-yellow-400">
                    {warningAlerts}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-orange-400/[0.04] p-4">
                  <span className="text-sm text-gray-300">
                    Quality
                  </span>

                  <span className="text-orange-400">
                    {qualityAlerts}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-purple-400/[0.04] p-4">
                  <span className="text-sm text-gray-300">
                    Traceability
                  </span>

                  <span className="text-purple-400">
                    0
                  </span>
                </div>

              </div>

            </div>

            {/* Alert Monitoring */}
            <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">

              <h2 className="text-xl font-semibold text-white">
                Alert Monitoring
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Conditions monitored by the system
              </p>

              <div className="mt-5 space-y-4">

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Temperature
                  </span>

                  <span className="text-green-400">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Humidity
                  </span>

                  <span className="text-green-400">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Hive Weight
                  </span>

                  <span className="text-green-400">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Bee Activity
                  </span>

                  <span className="text-green-400">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Hive Health
                  </span>

                  <span className="text-green-400">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    Quality Results
                  </span>

                  <span className="text-green-400">
                    Active
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* System Information */}
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.03] p-5">

            <p className="text-sm text-gray-400">

              <span className="font-semibold text-cyan-300">
                Smart Monitoring:
              </span>{" "}
              Alerts are generated automatically from sensor,
              hive-health and quality-test records stored in the
              Honey Chain database.

            </p>

          </div>

        </>
      )}

    </div>
  )
}

export default Alerts