import { useEffect, useState } from "react"

function SmartMonitoring() {
  const [sensorData, setSensorData] = useState<any[]>([])

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/sensor-data")
      .then((response) => response.json())
      .then((data) => {
        setSensorData(data.sensor_data)
      })
      .catch((error) => {
        console.error("Error fetching sensor data:", error)
      })
  }, [])

    
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Smart Monitoring
        </h1>

        <p className="mt-1 text-gray-400">
          Monitor hive conditions and smart beekeeping parameters
        </p>
      </div>

      {/* Monitoring Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-orange-400/20 bg-[#0b1118] p-5">
          <p className="text-sm text-gray-400">Temperature</p>
          <h2 className="mt-2 text-3xl font-bold text-orange-400">
            {sensorData.length > 0 ? `${sensorData[0].temperature}°C` : "--"}
            
          </h2>
          <p className="mt-2 text-sm text-green-400">
            Normal range
          </p>
        </div>

        <div className="rounded-2xl border border-blue-400/20 bg-[#0b1118] p-5">
          <p className="text-sm text-gray-400">Humidity</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-400">
            {sensorData.length > 0 ? `${sensorData[0].humidity}%` : "--"}
          
          </h2>
          <p className="mt-2 text-sm text-green-400">
            Stable
          </p>
        </div>

        <div className="rounded-2xl border border-yellow-400/20 bg-[#0b1118] p-5">
          <p className="text-sm text-gray-400">Hive Weight</p>
          <h2 className="mt-2 text-3xl font-bold text-yellow-400">
            {sensorData.length > 0 ? `${sensorData[0].hive_weight} kg` : "--"}

            
          </h2>
          <p className="mt-2 text-sm text-green-400">
            +1.8 kg this week
          </p>
        </div>

        <div className="rounded-2xl border border-green-400/20 bg-[#0b1118] p-5">
          <p className="text-sm text-gray-400">Bee Activity</p>
          <h2 className="mt-2 text-3xl font-bold text-green-400">
            {sensorData.length > 0 ? sensorData[0].bee_activity : "--"}

            
          </h2>
          <p className="mt-2 text-sm text-green-400">
            Healthy activity
          </p>
        </div>

      </div>

      {/* Hive Monitoring Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">

        <div className="mb-5">
          <h2 className="text-xl font-semibold text-white">
            Live Hive Monitoring
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Current readings from monitored hives
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>
              <tr className="border-b border-white/10 text-sm text-gray-500">
                <th className="px-4 py-3">Hive</th>
                <th className="px-4 py-3">Temperature</th>
                <th className="px-4 py-3">Humidity</th>
                <th className="px-4 py-3">Weight</th>
                <th className="px-4 py-3">Bee Activity</th>
                <th className="px-4 py-3">Health</th>
              </tr>
            </thead>

            <tbody>
                {sensorData.map((sensor) => (
    <tr key={sensor.id} className="border-b border-white/5">
      
      <td className="px-4 py-4 font-medium text-white">
        {sensor.hive_code}
      </td>

      <td className="px-4 py-4 text-orange-400">
        {sensor.temperature}°C
      </td>

      <td className="px-4 py-4 text-blue-400">
        {sensor.humidity}%
      </td>

      <td className="px-4 py-4 text-yellow-400">
        {sensor.hive_weight} kg
      </td>

      <td className="px-4 py-4 text-green-400">
        {sensor.bee_activity}
      </td>

      <td className="px-4 py-4">
        <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs text-green-400">
          Healthy
        </span>
      </td>

    </tr>
  ))}
</tbody>
            

              

          </table>

        </div>

      </div>

      {/* Monitoring Note */}
      <div className="rounded-2xl border border-purple-400/20 bg-purple-400/[0.03] p-5">

        <h3 className="font-semibold text-purple-300">
          Smart Monitoring
        </h3>

        <p className="mt-2 text-sm text-gray-400">
          Temperature, humidity, hive weight and bee activity are being
          monitored through the Honey Chain data platform. Sensor
          hardware integration can be added for live field deployment.

          
        </p>

      </div>

    </div>
  )
}

export default SmartMonitoring