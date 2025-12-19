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
            <span className="text-sm text-muted-foreground">Пул продавцов</span>
            <span className="text-sm font-medium">{result.sellerPool.toLocaleString()} токенов</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Коэффициент времени</span>
            <Badge variant="secondary">{(result.timeDecayFactor * 100).toFixed(1)}%</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Доля продаж</span>
            <Badge variant="secondary">{(result.salesShare * 100).toFixed(4)}%</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Балл качества</span>
            <Badge variant={result.qualityScore >= 0.6 ? "default" : "destructive"}>
              {(result.qualityScore * 100).toFixed(1)}%
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Недельная награда</span>
            <span className="text-lg font-bold text-primary">
              {result.weeklyTokenReward.toFixed(2)} токенов
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Месячная награда</span>
            <span className="text-lg font-bold text-primary">
              {result.monthlyTokenReward.toFixed(2)} токенов
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            <span>Распределение еженедельно</span>
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

