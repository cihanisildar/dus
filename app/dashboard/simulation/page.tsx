import { redirect } from "next/navigation"
import { getCurrentAuthUser } from "@/lib/actions/auth"
import { userQueries } from "@/lib/db/queries/users"
import { getSimulationResults } from "@/lib/actions/simulation-actions"
import { SimulationClient } from "@/components/simulation/simulation-client"
import { TrendingUp, RefreshCw } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function SimulationPage() {
  const authUser = await getCurrentAuthUser()
  const user = await userQueries.getById(authUser.id)

  if (!user) redirect("/login")
  if (user.accountStatus !== "active") redirect("/dashboard/payment")

  const result = await getSimulationResults()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Tercih Simülasyonu</h1>
          </div>
          <p className="text-gray-600">
            Tüm kullanıcıların tercihlerine göre gerçek zamanlı doluluk tahmini.
            Veriler 5 dakikada bir güncellenir.
          </p>
        </div>

        {result.success ? (
          <SimulationClient results={result.data} />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-600">{result.error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
