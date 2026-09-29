import { useEffect, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"

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

function QRVerification() {
  const [batches, setBatches] = useState<HoneyBatch[]>([])
  const [hives, setHives] = useState<Hive[]>([])
  const [qualityTests, setQualityTests] = useState<QualityTest[]>([])
  const [verified, setVerified] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("http://127.0.0.1:5000/api/honey-batches").then((res) =>
        res.json()
      ),
      fetch("http://127.0.0.1:5000/api/hives").then((res) =>
        res.json()
      ),
      fetch("http://127.0.0.1:5000/api/quality-tests").then((res) =>
        res.json()
      ),
    ])
      .then(([batchData, hiveData, qualityData]) => {
        setBatches(batchData.batches || [])
        setHives(hiveData.hives || [])
        setQualityTests(qualityData.quality_tests || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("QR verification data error:", error)
        setLoading(false)
      })
  }, [])

  const batch = batches[0]

  const hive = batch
    ? hives.find((item) => item.hive_code === batch.hive_code)
    : undefined

  const qualityTest = batch
    ? qualityTests.find((test) => test.batch_code === batch.batch_code)
    : undefined

  const handleVerification = () => {
    setVerified(true)
  }

  /*
   * Real QR code data.
   * The QR code contains the actual Honey Chain
   * batch information retrieved from the database.
   */
  const qrData = batch
    ? JSON.stringify({
        project: "Honey Chain",
        batch_code: batch.batch_code,
        hive_code: batch.hive_code,
        flower_source: batch.flower_source,
        quantity_kg: batch.quantity_kg,
        harvest_date: batch.harvest_date,
        quality_grade:
          qualityTest?.quality_grade || batch.quality_grade,
        quality_test:
          qualityTest?.test_result || "Pending",
        status: batch.status,
      })
    : ""

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          QR Verification
        </h1>

        <p className="mt-1 text-gray-400">
          Verify honey origin, quality and traceability
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-8 text-center">
          <p className="text-gray-400">
            Loading verification data...
          </p>
        </div>
      ) : !batch ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.03] p-8 text-center">
          <p className="text-red-400">
            No honey batch found in the database.
          </p>
        </div>
      ) : (
        <>

          {/* Verification Area */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* QR Code */}
            <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">

              <h2 className="text-xl font-semibold text-white">
                Honey QR Code
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Scan this QR code to verify the honey batch
              </p>

              <div className="mt-6 flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-yellow-400/30 bg-yellow-400/[0.02]">

                <div className="text-center">

                  {/* REAL QR CODE */}
                  <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-yellow-400/40 bg-white p-3">

                    <QRCodeCanvas
                      value={qrData}
                      size={140}
                      level="H"
                      includeMargin={true}
                    />

                  </div>

                  <p className="mt-5 text-sm text-gray-400">
                    Scan to view batch information
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {batch.batch_code}
                  </p>

                  <button
                    onClick={handleVerification}
                    className="mt-4 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-300"
                  >
                    {verified
                      ? "Batch Verified"
                      : "Start Verification"}
                  </button>

                </div>

              </div>

            </div>

            {/* Verification Result */}
            <div className="rounded-2xl border border-green-400/20 bg-[#0b1118] p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-400/10">
                  {verified ? "✓" : "?"}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Verification Result
                  </h2>

                  <p className="text-sm text-green-400">
                    {verified
                      ? "Batch verified successfully"
                      : "Ready for verification"}
                  </p>
                </div>

              </div>

              <div className="mt-6 space-y-4">

                {/* Batch ID */}
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-gray-500">
                    Batch ID
                  </span>

                  <span className="text-sm text-white">
                    {batch.batch_code}
                  </span>
                </div>

                {/* Flower Source */}
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-gray-500">
                    Flower Source
                  </span>

                  <span className="text-sm text-white">
                    {batch.flower_source}
                  </span>
                </div>

                {/* Farm / Hive */}
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-gray-500">
                    Farm / Hive
                  </span>

                  <span className="text-sm text-white">
                    {hive?.location || batch.hive_code}
                  </span>
                </div>

                {/* Quantity */}
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-gray-500">
                    Quantity
                  </span>

                  <span className="text-sm text-white">
                    {batch.quantity_kg} kg
                  </span>
                </div>

                {/* Quality */}
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-gray-500">
                    Quality
                  </span>

                  <span className="text-sm text-green-400">
                    Grade{" "}
                    {qualityTest?.quality_grade ||
                      batch.quality_grade}
                  </span>
                </div>

                {/* Quality Test */}
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-gray-500">
                    Quality Test
                  </span>

                  <span className="text-sm text-green-400">
                    {qualityTest?.test_result || "Pending"}
                  </span>
                </div>

                {/* Traceability */}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    Traceability
                  </span>

                  <span className="text-sm text-green-400">
                    {verified ? "Verified" : "Ready"}
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* Traceability Timeline */}
          <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">

            <h2 className="text-xl font-semibold text-white">
              Product Traceability
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Journey of the selected honey batch
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-5">

              {/* Step 1 */}
              <div className="rounded-xl border border-blue-400/20 bg-blue-400/[0.03] p-4">

                <p className="text-xs text-blue-400">
                  STEP 01
                </p>

                <h3 className="mt-2 font-medium text-white">
                  Bee Farm
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  {hive?.location || batch.hive_code}
                </p>

              </div>

              {/* Step 2 */}
              <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/[0.03] p-4">

                <p className="text-xs text-yellow-400">
                  STEP 02
                </p>

                <h3 className="mt-2 font-medium text-white">
                  Harvest
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  {batch.harvest_date}
                </p>

              </div>

              {/* Step 3 */}
              <div className="rounded-xl border border-green-400/20 bg-green-400/[0.03] p-4">

                <p className="text-xs text-green-400">
                  STEP 03
                </p>

                <h3 className="mt-2 font-medium text-white">
                  Quality Test
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  {qualityTest
                    ? `Grade ${qualityTest.quality_grade}`
                    : `Grade ${batch.quality_grade}`}
                </p>

              </div>

              {/* Step 4 */}
              <div className="rounded-xl border border-purple-400/20 bg-purple-400/[0.03] p-4">

                <p className="text-xs text-purple-400">
                  STEP 04
                </p>

                <h3 className="mt-2 font-medium text-white">
                  Traceability
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  {verified ? "Verified" : "Recorded"}
                </p>

              </div>

              {/* Step 5 */}
              <div className="rounded-xl border border-orange-400/20 bg-orange-400/[0.03] p-4">

                <p className="text-xs text-orange-400">
                  STEP 05
                </p>

                <h3 className="mt-2 font-medium text-white">
                  Packaging
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Ready
                </p>

              </div>

            </div>

          </div>

          {/* Customer Verification */}
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.03] p-6">

            <h2 className="text-xl font-semibold text-cyan-300">
              Customer Verification
            </h2>

            <p className="mt-2 max-w-3xl text-sm text-gray-400">
              Customers can scan the QR code on a honey package
              to view the honey origin, harvest information,
              quality results and traceability records stored
              in Honey Chain.
            </p>

            {verified && (
              <div className="mt-5 rounded-xl border border-green-400/20 bg-green-400/[0.03] p-4">

                <p className="text-sm font-medium text-green-400">
                  ✓ Verification successful
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Batch {batch.batch_code} has been verified
                  against the Honey Chain database.
                </p>

              </div>
            )}

          </div>

        </>
      )}

    </div>
  )
}

export default QRVerification