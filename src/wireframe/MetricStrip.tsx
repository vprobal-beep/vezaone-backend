import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import type { MetricItem } from "@/src/wireframe/types"

interface MetricStripProps {
  metrics: MetricItem[]
  loading?: boolean
}

export function MetricStrip({ metrics, loading = false }: MetricStripProps) {
  const gridCols =
    metrics.length <= 2
      ? "sm:grid-cols-2"
      : metrics.length === 3
        ? "sm:grid-cols-3"
        : "sm:grid-cols-2 xl:grid-cols-4"

  return (
    <div className={`grid grid-cols-1 gap-4 ${gridCols}`}>
      {metrics.map((metric) => (
        <Card key={metric.id} className="shadow-none">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium">
              {metric.label}
            </CardDescription>
            <CardTitle className="font-heading text-2xl font-semibold tabular-nums">
              {loading ? <Skeleton className="h-8 w-20" /> : metric.value}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-3 w-32" />
            ) : typeof metric.progress === "number" ? (
              <div className="flex flex-col gap-1.5">
                <Progress value={metric.progress} className="h-1.5" />
                {metric.helper && (
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {metric.helper}
                  </p>
                )}
              </div>
            ) : (
              metric.helper && (
                <p className="text-xs text-muted-foreground tabular-nums">
                  {metric.helper}
                </p>
              )
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
