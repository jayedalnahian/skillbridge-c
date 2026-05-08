"use client"

import * as React from "react"
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
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

export interface LineChartData {
  [key: string]: string | number
}

export interface BaseLineChartProps {
  data: LineChartData[]
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
  showDots?: boolean
  curveType?: "linear" | "monotone" | "step" | "natural"
  className?: string
  containerClassName?: string
  yAxisFormatter?: (value: number) => string
  xAxisFormatter?: (value: string) => string
}

export interface LineChartProps extends BaseLineChartProps {
  variant?: "line"
  strokeWidth?: number
}

export interface AreaChartProps extends BaseLineChartProps {
  variant: "area"
  gradient?: boolean
  opacity?: number
}

export type ChartProps = LineChartProps | AreaChartProps

export function LineChart({
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
  showDots = true,
  curveType = "monotone",
  strokeWidth = 2,
  className,
  containerClassName,
  yAxisFormatter,
  xAxisFormatter,
}: LineChartProps) {
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
        <RechartsLineChart data={data}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
          )}
          {showTooltip && (
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
              cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
          )}
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
          {showLegend && (
            <ChartLegend
              content={<ChartLegendContent />}
              verticalAlign="bottom"
            />
          )}
          {dataKeys.map((key) => (
            <Line
              key={key}
              type={curveType}
              dataKey={key}
              stroke={`var(--color-${key})`}
              strokeWidth={strokeWidth}
              dot={showDots ? { fill: `var(--color-${key})`, strokeWidth: 2 } : false}
              activeDot={{ r: 4, strokeWidth: 2 }}
            />
          ))}
        </RechartsLineChart>
      </ChartContainer>
    </div>
  )
}

export function AreaChart({
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
  showDots = false,
  curveType = "monotone",
  gradient = true,
  opacity = 0.4,
  className,
  containerClassName,
  yAxisFormatter,
  xAxisFormatter,
}: AreaChartProps) {
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
        <RechartsAreaChart data={data}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
          )}
          {showTooltip && (
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
              cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
          )}
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
          {showLegend && (
            <ChartLegend
              content={<ChartLegendContent />}
              verticalAlign="bottom"
            />
          )}
          {dataKeys.map((key, index) => (
            <Area
              key={key}
              type={curveType}
              dataKey={key}
              stroke={`var(--color-${key})`}
              fill={gradient ? `url(#fill-${key})` : `var(--color-${key})`}
              fillOpacity={gradient ? 1 : opacity}
              strokeWidth={2}
              dot={showDots ? { fill: `var(--color-${key})`, strokeWidth: 2 } : false}
              activeDot={{ r: 4, strokeWidth: 2 }}
            />
          ))}
          <defs>
            {dataKeys.map((key) => (
              <linearGradient key={key} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={`var(--color-${key})`}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${key})`}
                  stopOpacity={0.1}
                />
              </linearGradient>
            ))}
          </defs>
        </RechartsAreaChart>
      </ChartContainer>
    </div>
  )
}
