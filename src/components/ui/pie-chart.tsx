"use client"

import * as React from "react"
import { Pie, PieChart as RechartsPieChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

export interface PieChartData {
  name: string
  value: number
  fill?: string
}

export interface PieChartProps {
  data: PieChartData[]
  config: ChartConfig
  nameKey?: string
  dataKey?: string
  title?: string
  description?: string
  showLegend?: boolean
  showTooltip?: boolean
  innerRadius?: number
  outerRadius?: number
  paddingAngle?: number
  cornerRadius?: number
  className?: string
  containerClassName?: string
}

export function PieChart({
  data,
  config,
  nameKey = "name",
  dataKey = "value",
  title,
  description,
  showLegend = true,
  showTooltip = true,
  innerRadius = 0,
  outerRadius = 80,
  paddingAngle = 0,
  cornerRadius = 0,
  className,
  containerClassName,
}: PieChartProps) {
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
      <ChartContainer config={config} className={cn("aspect-square", className)}>
        <RechartsPieChart>
          {showTooltip && (
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey={nameKey}
                  hideLabel
                />
              }
            />
          )}
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={paddingAngle}
            cornerRadius={cornerRadius}
          />
          {showLegend && (
            <ChartLegend
              content={<ChartLegendContent nameKey={nameKey} />}
              verticalAlign="bottom"
            />
          )}
        </RechartsPieChart>
      </ChartContainer>
    </div>
  )
}

export interface DonutChartProps extends PieChartProps {
  innerRadius?: number
}

export function DonutChart({
  innerRadius = 60,
  ...props
}: DonutChartProps) {
  return <PieChart innerRadius={innerRadius} {...props} />
}
