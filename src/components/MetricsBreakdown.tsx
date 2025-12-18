import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { CalculationResult } from "@/utils/tokenomics"
import { Info } from "lucide-react"

interface MetricsBreakdownProps {
  result: CalculationResult
}

export function MetricsBreakdown({ result }: MetricsBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Детали расчета</CardTitle>
        <CardDescription>
          Разбивка расчета токенов по компонентам
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Базовая эмиссия</span>
            <span className="text-sm font-medium">{result.baseEmission.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Коэффициент времени</span>
            <Badge variant="secondary">{result.timeDecayFactor.toFixed(2)}x</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Множитель качества</span>
            <Badge variant={result.qualityMultiplier >= 1 ? "default" : "secondary"}>
              {result.qualityMultiplier.toFixed(2)}x
            </Badge>
          </div>
          {result.penalties > 0 && (
            <div className="flex items-center justify-between text-destructive">
              <span className="text-sm">Штрафы</span>
              <span className="text-sm font-medium">-{result.penalties.toFixed(2)}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Месячная награда</span>
            <span className="text-lg font-bold text-primary">
              {result.monthlyTokenReward.toFixed(2)} токенов
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            <span>При текущих показателях</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">За 6 месяцев</span>
            <span className="text-sm font-semibold">
              {result.projection6Months.toFixed(2)} токенов
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">За 12 месяцев</span>
            <span className="text-sm font-semibold">
              {result.projection12Months.toFixed(2)} токенов
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

