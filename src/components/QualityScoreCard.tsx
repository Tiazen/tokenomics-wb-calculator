import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { CalculationResult } from "@/utils/tokenomics"
import { Award, TrendingDown, TrendingUp } from "lucide-react"

interface QualityScoreCardProps {
  result: CalculationResult
}

export function QualityScoreCard({ result }: QualityScoreCardProps) {
  // Convert score from 0-1 to 0-100 for display
  const scorePercent = result.qualityScore * 100
  
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-400"
    if (score >= 0.6) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 0.8) return "default"
    if (score >= 0.6) return "secondary"
    return "destructive"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return "Отлично"
    if (score >= 0.6) return "Хорошо"
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
              {scorePercent.toFixed(1)}%
            </span>
          </div>
          <Progress value={scorePercent} className="h-3 transition-smooth" />
          {result.qualityScore < 0.6 && (
            <p className="text-xs text-destructive mt-1">
              Минимум 60% для получения токенов
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3" />
              <span>Возвраты (40%)</span>
            </div>
            <div className="text-sm font-medium">
              {(result.breakdown.returnRateComponent * 100).toFixed(1)}%
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Доставка (30%)</span>
            </div>
            <div className="text-sm font-medium">
              {(result.breakdown.deliveryComponent * 100).toFixed(1)}%
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Award className="h-3 w-3" />
              <span>Рейтинг (30%)</span>
            </div>
            <div className="text-sm font-medium">
              {(result.breakdown.ratingsComponent * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

