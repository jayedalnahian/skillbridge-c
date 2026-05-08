"use client"

import * as React from "react"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

export interface BarChartData {
  [key: string]: string | number
}

export interface BarChartProps {
  data: BarChartData[]
  config: ChartConfig
  dataKeys: string[]
  xAxisKey: string
  xAxisLabel?: string
  yAxisLabel?: string
  title?: string
  description?: string
  showLegend?: boolean
  showTooltip?: boolean
  showGrid?: boolean
  layout?: "vertical" | "horizontal"
  barSize?: number
  className?: string
  containerClassName?: string
  yAxisFormatter?: (value: number) => string
  xAxisFormatter?: (value: string) => string
}

export function BarChart({
  data,
  config,
  dataKeys,
  xAxisKey,
  xAxisLabel,
  yAxisLabel,
  title,
  description,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  layout = "horizontal",
  barSize = 20,
  className,
  containerClassName,
  yAxisFormatter,
  xAxisFormatter,
}: BarChartProps) {
  const isVertical = layout === "vertical"

  return (
    <div className={cn("flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm", containerClassName)}>
      {(title || description) && (
        <div className="px-4">
          {title && (
            <h3 className="font-heading text-base font-medium">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <ChartContainer config={config} className={cn("aspect-video", className)}>
        <RechartsBarChart data={data} layout={layout} barSize={barSize}>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={!isVertical}
              horizontal={isVertical}
            />
          )}
          {showTooltip && (
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator={isVertical ? "line" : "dot"}
                />
              }
              cursor={{ fill: "transparent" }}
            />
          )}
          {isVertical ? (
            <>
              <XAxis
                type="number"
                dataKey={dataKeys[0]}
                tickFormatter={yAxisFormatter}
                label={
                  xAxisLabel
                    ? { value: xAxisLabel, position: "insideBottom", offset: -5 }
                    : undefined
                }
              />
              <YAxis
                type="category"
                dataKey={xAxisKey}
                tickFormatter={xAxisFormatter}
                width={80}
                label={
                  yAxisLabel
                    ? { value: yAxisLabel, angle: -90, position: "insideLeft" }
                    : undefined
                }
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={xAxisKey}
                tickFormatter={xAxisFormatter}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                label={
                  xAxisLabel
                    ? { value: xAxisLabel, position: "insideBottom", offset: -5 }
                    : undefined
                }
              />
              <YAxis
                tickFormatter={yAxisFormatter}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                label={
                  yAxisLabel
                    ? { value: yAxisLabel, angle: -90, position: "insideLeft" }
                    : undefined
                }
              />
            </>
          )}
          {showLegend && (
            <ChartLegend
              content={<ChartLegendContent />}
              verticalAlign="bottom"
            />
          )}
          {dataKeys.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              fill={`var(--color-${key})`}
              radius={isVertical ? [0, 4, 4, 0] : [4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ChartContainer>
    </div>
  )
}
