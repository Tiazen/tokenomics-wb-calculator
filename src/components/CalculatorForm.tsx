import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { SellerMetrics } from "@/utils/tokenomics"
import { HelpCircle } from "lucide-react"

interface CalculatorFormProps {
  metrics: SellerMetrics
  onMetricsChange: (metrics: SellerMetrics) => void
}

export function CalculatorForm({ metrics, onMetricsChange }: CalculatorFormProps) {
  const updateMetric = <K extends keyof SellerMetrics>(
    key: K,
    value: SellerMetrics[K]
  ) => {
    onMetricsChange({ ...metrics, [key]: value })
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Параметры продавца</CardTitle>
        <CardDescription>
          Введите ваши показатели для расчета токенов
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly Sales Volume */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="sales-volume">Объем продаж в месяц (заказов)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Количество заказов, которые вы обрабатываете в месяц</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
            <Input
            id="sales-volume"
            type="number"
            min="0"
            value={metrics.monthlySalesVolume}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMetric("monthlySalesVolume", Number(e.target.value) || 0)}
            className="transition-smooth"
          />
        </div>

        <Separator />

        {/* Return Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="return-rate">Процент возвратов</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Процент заказов, возвращенных покупателями. Чем ниже, тем лучше.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-sm font-medium">{metrics.returnRate.toFixed(1)}%</span>
          </div>
          <Slider
            id="return-rate"
            min={0}
            max={50}
            step={0.1}
            value={[metrics.returnRate]}
            onValueChange={([value]: number[]) => updateMetric("returnRate", value)}
            className="w-full"
          />
        </div>

        {/* On-Time Delivery Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="delivery-rate">Доставка в срок</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Процент заказов, доставленных в срок. Чем выше, тем лучше.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-sm font-medium">{metrics.onTimeDeliveryRate.toFixed(1)}%</span>
          </div>
          <Slider
            id="delivery-rate"
            min={0}
            max={100}
            step={0.1}
            value={[metrics.onTimeDeliveryRate]}
            onValueChange={([value]: number[]) => updateMetric("onTimeDeliveryRate", value)}
            className="w-full"
          />
        </div>

        {/* Ratings */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="ratings">Рейтинг</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Рейтинг продавца от покупателей (0-100%). Чем выше, тем лучше.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-sm font-medium">{metrics.ratings.toFixed(1)}%</span>
          </div>
          <Slider
            id="ratings"
            min={0}
            max={100}
            step={0.1}
            value={[metrics.ratings]}
            onValueChange={([value]: number[]) => updateMetric("ratings", value)}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Months on Platform */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="months-on-platform">Месяцев на платформе</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Время работы на платформе. Эмиссия токенов уменьшается со временем.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="months-on-platform"
            type="number"
            min="0"
            max="60"
            value={metrics.monthsOnPlatform}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMetric("monthsOnPlatform", Number(e.target.value) || 0)}
            className="transition-smooth"
          />
        </div>
      </CardContent>
    </Card>
  )
}

