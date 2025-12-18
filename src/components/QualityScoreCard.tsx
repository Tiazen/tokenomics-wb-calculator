import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { CalculationResult } from "@/utils/tokenomics"
import { Award, Minus, TrendingDown, TrendingUp } from "lucide-react"

interface QualityScoreCardProps {
  result: CalculationResult
}

export function QualityScoreCard({ result }: QualityScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Отлично"
    if (score >= 60) return "Хорошо"
    if (score >= 50) return "Удовлетворительно"
    return "Требует улучшения"
  }

  return (
    <Card className="transition-smooth">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Балл качества</CardTitle>
          <Badge variant={getScoreBadgeVariant(result.qualityScore)}>
            {getScoreLabel(result.qualityScore)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Общий балл</span>
            <span className={`text-2xl font-bold transition-smooth ${getScoreColor(result.qualityScore)}`}>
              {result.qualityScore.toFixed(1)}
            </span>
          </div>
          <Progress value={result.qualityScore} className="h-3 transition-smooth" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3" />
              <span>Возвраты</span>
            </div>
            <div className="text-sm font-medium">
              {result.breakdown.returnRateScore.toFixed(1)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Доставка</span>
            </div>
            <div className="text-sm font-medium">
              {result.breakdown.deliveryScore.toFixed(1)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Minus className="h-3 w-3" />
              <span>Отмены</span>
            </div>
            <div className="text-sm font-medium">
              {result.breakdown.cancellationScore.toFixed(1)}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Award className="h-3 w-3" />
              <span>Остатки</span>
            </div>
            <div className="text-sm font-medium">
              {result.breakdown.inventoryScore.toFixed(1)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

