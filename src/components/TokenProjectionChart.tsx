import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateProjectionData } from "@/utils/tokenomics"
import { CartesianGrid, Legend, Line, LineChart, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface TokenProjectionChartProps {
  monthlyReward: number
}

export function TokenProjectionChart({ monthlyReward }: TokenProjectionChartProps) {
  const data = generateProjectionData(monthlyReward, 12)

  const formatTooltip = (value: number) => {
    return `${value.toFixed(2)} токенов`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Прогноз накопления токенов</CardTitle>
        <CardDescription>
          Накопление токенов за 12 месяцев при текущих показателях
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
            <XAxis
              dataKey="month"
              label={{ value: "Месяц", position: "insideBottom", offset: -5 }}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              label={{ value: "Токены", angle: -90, position: "insideLeft" }}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <RechartsTooltip
              formatter={formatTooltip}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--popover-foreground))",
              }}
            />
            <Legend
              wrapperStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Накоплено токенов"
              dot={{ r: 4, fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

