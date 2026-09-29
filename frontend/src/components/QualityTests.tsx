import { useEffect, useState } from "react"

type QualityTest = {
  id: number
  batch_code: string
  moisture_percent: string
  quality_grade: string
  test_result: string
  tested_date: string
  created_at: string
}

function QualityTests() {
  const [tests, setTests] = useState<QualityTest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/quality-tests")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch quality test data")
        }

        return response.json()
      })
      .then((data) => {
        setTests(data.quality_tests || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setError("Unable to connect to Honey Chain backend")
        setLoading(false)
      })
  }, [])

  const totalTests = tests.length

  const passedTests = tests.filter(
    (test) => test.test_result.toLowerCase() === "passed"
  ).length

  const pendingTests = tests.filter(
    (test) =>
      test.test_result.toLowerCase() === "pending" ||
      test.test_result.toLowerCase() === "review"
  ).length

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Quality Tests
        </h1>

        <p className="mt-1 text-gray-400">
          Monitor honey quality and laboratory test results
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">
          <p className="text-gray-400">
            Loading quality test data...
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
                Tests Completed
              </p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {totalTests}
              </h2>
            </div>

            <div className="rounded-2xl border border-green-400/20 bg-[#0b1118] p-5">
              <p className="text-sm text-gray-400">
                Passed
              </p>

              <h2 className="mt-2 text-3xl font-bold text-green-400">
                {passedTests}
              </h2>
            </div>

            <div className="rounded-2xl border border-yellow-400/20 bg-[#0b1118] p-5">
              <p className="text-sm text-gray-400">
                Pending Tests
              </p>

              <h2 className="mt-2 text-3xl font-bold text-yellow-400">
                {pendingTests}
              </h2>
            </div>

          </div>

          {/* Quality Parameters */}
          <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">

            <h2 className="text-xl font-semibold text-white">
              Quality Parameters
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Key parameters recorded during honey testing
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

              {/* Moisture */}
              <div className="rounded-xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-gray-400">
                  Moisture Content
                </p>

                <p className="mt-2 text-2xl font-bold text-blue-400">
                  {tests.length > 0
                    ? `${tests[0].moisture_percent}%`
                    : "--"}
                </p>

                <p className="mt-1 text-xs text-green-400">
                  Recorded test value
                </p>
              </div>

              {/* Grade */}
              <div className="rounded-xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-gray-400">
                  Honey Grade
                </p>

                <p className="mt-2 text-2xl font-bold text-yellow-400">
                  {tests.length > 0
                    ? `Grade ${tests[0].quality_grade}`
                    : "--"}
                </p>

                <p className="mt-1 text-xs text-green-400">
                  Quality classification
                </p>
              </div>

              {/* Test Status */}
              <div className="rounded-xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-gray-400">
                  Test Status
                </p>

                <p className="mt-2 text-2xl font-bold text-green-400">
                  {tests.length > 0
                    ? tests[0].test_result
                    : "--"}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Latest laboratory result
                </p>
              </div>

            </div>

          </div>

          {/* Test Table */}
          <div className="rounded-2xl border border-white/10 bg-[#0b1118] p-6">

            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">
                Recent Quality Tests
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Latest honey batch testing records
              </p>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b border-white/10 text-sm text-gray-500">
                    <th className="px-4 py-3">Batch ID</th>
                    <th className="px-4 py-3">Moisture</th>
                    <th className="px-4 py-3">Grade</th>
                    <th className="px-4 py-3">Test Date</th>
                    <th className="px-4 py-3">Result</th>
                  </tr>
                </thead>

                <tbody>

                  {tests.map((test) => {

                    const passed =
                      test.test_result.toLowerCase() === "passed"

                    return (
                      <tr
                        key={test.id}
                        className="border-b border-white/5"
                      >

                        <td className="px-4 py-4 font-medium text-white">
                          {test.batch_code}
                        </td>

                        <td className="px-4 py-4 text-blue-400">
                          {test.moisture_percent}%
                        </td>

                        <td className="px-4 py-4 text-yellow-400">
                          Grade {test.quality_grade}
                        </td>

                        <td className="px-4 py-4 text-gray-400">
                          {new Date(
                            test.tested_date
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        <td className="px-4 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              passed
                                ? "bg-green-400/10 text-green-400"
                                : "bg-yellow-400/10 text-yellow-400"
                            }`}
                          >
                            {test.test_result}
                          </span>

                        </td>

                      </tr>
                    )
                  })}

                </tbody>

              </table>

              {tests.length === 0 && (
                <div className="py-10 text-center">
                  <p className="text-gray-500">
                    No quality tests found in the database.
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

export default QualityTests