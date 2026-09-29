import { useEffect, useState } from "react"
import {
  MapPin,
  Navigation,
  Home,
  Activity,
} from "lucide-react"

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

function MapsLocations() {
  const [hives, setHives] = useState<Hive[]>([])
  const [batches, setBatches] = useState<HoneyBatch[]>([])

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:5000/api/hives").then((res) => res.json()),
      fetch("http://127.0.0.1:5000/api/honey-batches").then((res) =>
        res.json()
      ),
    ])
      .then(([hiveData, batchData]) => {
        setHives(hiveData.hives || [])
        setBatches(batchData.batches || [])
      })
      .catch((error) => {
        console.error("Error loading location data:", error)
      })
  }, [])

  /* -----------------------------
     LOCATION DATA
  ----------------------------- */

  const locations = Array.from(
    new Set(hives.map((hive) => hive.location))
  )

  const totalFarms = locations.length

  const activeLocations = locations.filter((location) =>
    hives.some(
      (hive) =>
        hive.location === location &&
        hive.hive_health.toLowerCase() === "good"
    )
  ).length

  const totalHives = hives.length

  const getHivesForLocation = (location: string) =>
    hives.filter((hive) => hive.location === location)

  const getProductionForLocation = (location: string) => {
    const locationHives = getHivesForLocation(location).map(
      (hive) => hive.hive_code
    )

    return batches
      .filter((batch) => locationHives.includes(batch.hive_code))
      .reduce(
        (total, batch) => total + Number(batch.quantity_kg),
        0
      )
  }

  const getLocationStatus = (location: string) => {
    const locationHives = getHivesForLocation(location)

    if (
      locationHives.some(
        (hive) => hive.hive_health.toLowerCase() === "critical"
      )
    ) {
      return "Critical"
    }

    if (
      locationHives.some(
        (hive) => hive.hive_health.toLowerCase() === "warning"
      )
    ) {
      return "Attention"
    }

    return "Healthy"
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <p className="text-sm text-cyan-400">
          LOCATION MANAGEMENT
        </p>

        <h1 className="mt-1 text-3xl font-bold text-white">
          Maps & Locations
        </h1>

        <p className="mt-2 text-gray-400">
          Track apiaries, hive locations and honey production sites.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl border border-cyan-400/10 bg-[#0b0f15] p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm text-gray-400">
              Total Locations
            </p>

            <MapPin
              className="text-cyan-400"
              size={22}
            />

          </div>

          <h2 className="mt-3 text-3xl font-bold text-white">
            {totalFarms}
          </h2>

          <p className="mt-2 text-xs text-gray-500">
            Based on registered hive locations
          </p>

        </div>

        <div className="rounded-2xl border border-green-400/10 bg-[#0b0f15] p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm text-gray-400">
              Active Locations
            </p>

            <Activity
              className="text-green-400"
              size={22}
            />

          </div>

          <h2 className="mt-3 text-3xl font-bold text-white">
            {activeLocations}
          </h2>

          <p className="mt-2 text-xs text-green-400">
            Locations with healthy hives
          </p>

        </div>

        <div className="rounded-2xl border border-yellow-400/10 bg-[#0b0f15] p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm text-gray-400">
              Total Hives
            </p>

            <Home
              className="text-yellow-400"
              size={22}
            />

          </div>

          <h2 className="mt-3 text-3xl font-bold text-white">
            {totalHives}
          </h2>

          <p className="mt-2 text-xs text-gray-500">
            Across registered locations
          </p>

        </div>

      </div>

      {/* Map Area */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f15]">

        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

          <div>

            <h2 className="text-lg font-semibold text-white">
              Apiary Locations
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Geographic distribution of Honey Chain locations
            </p>

          </div>

          <button
            onClick={() =>
              window.alert(
                "Map integration can be connected to real GPS coordinates later."
              )
            }
            className="flex items-center gap-2 rounded-xl bg-cyan-400/10 px-4 py-2 text-sm text-cyan-400 hover:bg-cyan-400/20"
          >
            <Navigation size={16} />
            Locate
          </button>

        </div>

        {/* Map Preview */}
        <div className="relative h-[380px] overflow-hidden bg-[#080d13]">

          <div className="absolute inset-0 opacity-30">

            <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:45px_45px]" />

          </div>

          {/* Dynamic location markers */}
          {locations.map((location, index) => {

            const status = getLocationStatus(location)

            const positions = [
              { left: "20%", top: "30%" },
              { left: "48%", top: "22%" },
              { left: "70%", top: "48%" },
              { left: "35%", top: "60%" },
              { left: "78%", top: "25%" },
            ]

            const position =
              positions[index % positions.length]

            const markerColor =
              status === "Healthy"
                ? "text-green-400 fill-green-400"
                : status === "Attention"
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-red-400 fill-red-400"

            return (
              <div
                key={location}
                className="absolute"
                style={{
                  left: position.left,
                  top: position.top,
                }}
              >

                <div className="group relative">

                  <MapPin
                    size={34}
                    className={`${markerColor} drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]`}
                  />

                  <div className="absolute left-8 top-0 hidden w-52 rounded-xl border border-white/10 bg-[#10161e] p-3 shadow-xl group-hover:block">

                    <p className="font-semibold text-white">
                      {location}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {getHivesForLocation(location).length} hives
                    </p>

                    <p className="mt-2 text-xs text-cyan-400">
                      {getProductionForLocation(location).toFixed(2)} kg production
                    </p>

                    <p
                      className={`mt-1 text-xs ${
                        status === "Healthy"
                          ? "text-green-400"
                          : status === "Attention"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {status}
                    </p>

                  </div>

                </div>

              </div>
            )
          })}

          {/* Map label */}
          <div className="absolute bottom-5 left-5 rounded-xl border border-white/10 bg-[#10161e]/90 px-4 py-3 backdrop-blur">

            <p className="text-xs text-gray-500">
              MAP PREVIEW
            </p>

            <p className="mt-1 text-sm text-white">
              Honey Chain Apiary Network
            </p>

          </div>

        </div>

      </div>

      {/* Locations List */}
      <div className="rounded-2xl border border-white/10 bg-[#0b0f15]">

        <div className="border-b border-white/10 px-6 py-5">

          <h2 className="text-lg font-semibold text-white">
            Registered Locations
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Farm and production location details from Honey Chain
          </p>

        </div>

        <div className="divide-y divide-white/5">

          {locations.length > 0 ? (

            locations.map((location) => {

              const locationHives =
                getHivesForLocation(location)

              const production =
                getProductionForLocation(location)

              const status =
                getLocationStatus(location)

              return (
                <div
                  key={location}
                  className="flex flex-col gap-4 p-6 transition hover:bg-white/[0.02] md:flex-row md:items-center md:justify-between"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10">

                      <MapPin
                        size={20}
                        className="text-cyan-400"
                      />

                    </div>

                    <div>

                      <p className="font-semibold text-white">
                        {location}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Honey Chain registered location
                      </p>

                    </div>

                  </div>

                  <div className="flex flex-wrap items-center gap-6">

                    <div>

                      <p className="text-xs text-gray-500">
                        Hives
                      </p>

                      <p className="mt-1 text-sm text-white">
                        {locationHives.length}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Production
                      </p>

                      <p className="mt-1 text-sm text-white">
                        {production.toFixed(2)} kg
                      </p>

                    </div>

                    <div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          status === "Healthy"
                            ? "bg-green-400/10 text-green-400"
                            : status === "Attention"
                              ? "bg-orange-400/10 text-orange-400"
                              : "bg-red-400/10 text-red-400"
                        }`}
                      >
                        {status}
                      </span>

                    </div>

                  </div>

                </div>
              )
            })

          ) : (

            <div className="p-8 text-center text-gray-500">
              No location data available.
            </div>

          )}

        </div>

      </div>

      {/* Data Source */}
      <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.03] p-5">

        <div className="flex gap-3">

          <MapPin
            size={20}
            className="mt-0.5 text-cyan-400"
          />

          <div>

            <p className="text-sm font-medium text-cyan-300">
              Location Data
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Location information is currently derived from the
              location values stored with Honey Chain hive records.
              GPS-based map coordinates can be integrated later
              using Leaflet and OpenStreetMap.
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}

export default MapsLocations