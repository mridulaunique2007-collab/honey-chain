import { useEffect, useState } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet"
import L from "leaflet"
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

type LocationData = {
  name: string
  hives: number
  production: number
  status: string
  health: string
  beeCount: number
  latitude: number
  longitude: number
}

/* Fix Leaflet marker icons */
const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

/* Center map automatically */
function MapUpdater({
  locations,
}: {
  locations: LocationData[]
}) {
  const map = useMap()

  useEffect(() => {
    if (locations.length === 1) {
      map.setView(
        [locations[0].latitude, locations[0].longitude],
        12
      )
    }

    if (locations.length > 1) {
      const bounds = L.latLngBounds(
        locations.map((location) => [
          location.latitude,
          location.longitude,
        ])
      )

      map.fitBounds(bounds, {
        padding: [40, 40],
      })
    }
  }, [locations, map])

  return null
}

function MapsLocations() {
  const [hives, setHives] = useState<Hive[]>([])
  const [batches, setBatches] = useState<HoneyBatch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [hivesResponse, batchesResponse] =
          await Promise.all([
            fetch("http://https://honey-chain-2.onrender.com/api/hives"),
            fetch("http://https://honey-chain-2.onrender.com/api/honey-batches"),
          ])

        const hivesData = await hivesResponse.json()
        const batchesData = await batchesResponse.json()

        setHives(hivesData.hives || [])
        setBatches(batchesData.batches || [])
      } catch (error) {
        console.error("Failed to load map data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  /*
    Temporary coordinates for locations.

    Your database currently stores the location name
    but does not yet contain latitude/longitude columns.

    These coordinates allow the real map to work now.
  */
  const coordinateMap: Record<
    string,
    [number, number]
  > = {
    "Test Farm": [11.0168, 76.9558],
    Coimbatore: [11.0168, 76.9558],
    Ooty: [11.4102, 76.6950],
    Kodaikanal: [10.2381, 77.4892],
    Chennai: [13.0827, 80.2707],
  }

  const locations: LocationData[] = []

  const uniqueLocations = [
    ...new Set(hives.map((hive) => hive.location)),
  ]

  uniqueLocations.forEach((locationName) => {
    const locationHives = hives.filter(
      (hive) => hive.location === locationName
    )

    const hiveCodes = locationHives.map(
      (hive) => hive.hive_code
    )

    const locationBatches = batches.filter((batch) =>
      hiveCodes.includes(batch.hive_code)
    )

    const production = locationBatches.reduce(
      (total, batch) =>
        total + Number(batch.quantity_kg),
      0
    )

    const hasCritical = locationHives.some(
      (hive) =>
        hive.hive_health.toLowerCase() === "critical"
    )

    const hasWarning = locationHives.some(
      (hive) =>
        hive.hive_health.toLowerCase() === "warning"
    )

    let status = "Healthy"

    if (hasCritical) {
      status = "Critical"
    } else if (hasWarning) {
      status = "Attention"
    }

    const coordinates =
      coordinateMap[locationName] || [
        11.0168,
        76.9558,
      ]

    locations.push({
      name: locationName,
      hives: locationHives.length,
      production,
      status,
      health: locationHives[0]?.hive_health || "Unknown",
      beeCount: locationHives.reduce(
        (total, hive) =>
          total + Number(hive.bee_count),
        0
      ),
      latitude: coordinates[0],
      longitude: coordinates[1],
    })
  })

  const totalFarms = locations.length

  const activeLocations = locations.filter(
    (location) => location.status !== "Critical"
  ).length

  const totalHives = hives.length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Maps & Locations
        </h1>

        <p className="mt-2 text-gray-400">
          Real-time geographical view of Honey Chain
          hive locations
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-yellow-500/20 bg-[#0b0f14] p-6">
          <div className="flex items-center gap-3">
            <MapPin className="text-yellow-400" />

            <span className="text-gray-400">
              Total Locations
            </span>
          </div>

          <p className="mt-3 text-3xl font-bold text-white">
            {totalFarms}
          </p>
        </div>

        <div className="rounded-2xl border border-green-500/20 bg-[#0b0f14] p-6">
          <div className="flex items-center gap-3">
            <Activity className="text-green-400" />

            <span className="text-gray-400">
              Active Locations
            </span>
          </div>

          <p className="mt-3 text-3xl font-bold text-white">
            {activeLocations}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-[#0b0f14] p-6">
          <div className="flex items-center gap-3">
            <Home className="text-blue-400" />

            <span className="text-gray-400">
              Total Hives
            </span>
          </div>

          <p className="mt-3 text-3xl font-bold text-white">
            {totalHives}
          </p>
        </div>
      </div>

      {/* Real Map */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f14]">
        <div className="border-b border-white/10 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">
            Honey Chain Map
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Interactive map powered by OpenStreetMap
          </p>
        </div>

        <div className="h-[500px] w-full">
          {!loading && (
            <MapContainer
              center={[11.0168, 76.9558]}
              zoom={7}
              scrollWheelZoom={true}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapUpdater locations={locations} />

              {locations.map((location) => (
                <Marker
                  key={location.name}
                  position={[
                    location.latitude,
                    location.longitude,
                  ]}
                  icon={markerIcon}
                >
                  <Popup>
                    <div className="min-w-[220px]">
                      <h3 className="text-lg font-bold">
                        {location.name}
                      </h3>

                      <div className="mt-2 space-y-1 text-sm">
                        <p>
                          <strong>Hives:</strong>{" "}
                          {location.hives}
                        </p>

                        <p>
                          <strong>Bee Count:</strong>{" "}
                          {location.beeCount.toLocaleString()}
                        </p>

                        <p>
                          <strong>Production:</strong>{" "}
                          {location.production.toFixed(2)} kg
                        </p>

                        <p>
                          <strong>Health:</strong>{" "}
                          {location.health}
                        </p>

                        <p>
                          <strong>Status:</strong>{" "}
                          {location.status}
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>

      {/* Location list */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-white">
          Registered Locations
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <div
              key={location.name}
              className="rounded-2xl border border-white/10 bg-[#0b0f14] p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white">
                    {location.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    {location.hives} hive
                    {location.hives !== 1
                      ? "s"
                      : ""}
                  </p>
                </div>

                <MapPin className="text-yellow-400" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">
                    Production
                  </p>

                  <p className="mt-1 font-semibold text-yellow-400">
                    {location.production.toFixed(2)} kg
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Status
                  </p>

                  <p className="mt-1 font-semibold text-green-400">
                    {location.status}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-yellow-500/30 px-4 py-2 text-sm text-yellow-400 transition hover:bg-yellow-500/10"
              >
                <Navigation size={16} />
                View on Map
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Information */}
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-blue-400">
            Map data:
          </span>{" "}
          Hive and honey production information is
          loaded from the Honey Chain database. Map
          coordinates are currently assigned to the
          registered location names and can later be
          replaced with exact GPS coordinates.
        </p>
      </div>
    </div>
  )
}

export default MapsLocations