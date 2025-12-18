import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CalculationResult } from "@/utils/tokenomics"
import { Lightbulb } from "lucide-react"
import { MetricsBreakdown } from "./MetricsBreakdown"
import { QualityScoreCard } from "./QualityScoreCard"
import { TokenProjectionChart } from "./TokenProjectionChart"

interface ResultsDashboardProps {
  result: CalculationResult
}

export function ResultsDashboard({ result }: ResultsDashboardProps) {
  return (
    <div className="space-y-6 h-full overflow-y-auto pb-4">
      {/* Quality Score Card */}
      <QualityScoreCard result={result} />

      {/* Token Rewards Summary */}
      <Card className="transition-smooth">
        <CardHeader>
          <CardTitle className="text-lg">Токены за месяц</CardTitle>
          <CardDescription>Ваша месячная награда в токенах</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary mb-2 transition-smooth">
            {result.monthlyTokenReward.toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">токенов</p>
        </CardContent>
      </Card>

      {/* Metrics Breakdown */}
      <MetricsBreakdown result={result} />

      {/* Projection Chart */}
      <TokenProjectionChart monthlyReward={result.monthlyTokenReward} />

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Рекомендации</CardTitle>
            </div>
            <CardDescription>
              Как улучшить показатели и увеличить токены
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.suggestions.map((suggestion: string, index: number) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

