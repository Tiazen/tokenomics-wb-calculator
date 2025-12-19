import { Coins } from "lucide-react"
import { useState } from "react"
import { CalculatorForm } from "./components/CalculatorForm"
import { ResultsDashboard } from "./components/ResultsDashboard"
import type { SellerMetrics } from "./utils/tokenomics"
import { calculateTokenRewards } from "./utils/tokenomics"

// Default metrics for demo
const defaultMetrics: SellerMetrics = {
  monthlySalesVolume: 1000,
  returnRate: 8,
  onTimeDeliveryRate: 92,
  ratings: 95,
  monthsOnPlatform: 6,
}

function App() {
  const [metrics, setMetrics] = useState<SellerMetrics>(defaultMetrics)
  const result = calculateTokenRewards(metrics)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Coins className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Калькулятор токенов Wildberries</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Рассчитайте, сколько токенов вы можете получить за качественную работу на платформе.
            Токены выдаются за поведение, которое снижает издержки платформы.
          </p>
        </div>

        {/* Main Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Left Panel - Form */}
          <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-8rem)]">
            <CalculatorForm metrics={metrics} onMetricsChange={setMetrics} />
          </div>

          {/* Right Panel - Results */}
          <div className="lg:h-[calc(100vh-8rem)]">
            <ResultsDashboard result={result} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

