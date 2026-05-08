"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
  className?: string
  loading?: boolean
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  loading = false,
}: StatsCardProps) {
  if (loading) {
    return (
      <Card className={cn("overflow-hidden border shadow-sm", className)}>
        <CardHeader className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("overflow-hidden border shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardDescription className="text-sm font-medium">
            {title}
          </CardDescription>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {value}
          </CardTitle>
        </div>
        {Icon && (
          <div className="rounded-md bg-primary/10 p-2">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </CardHeader>
      {(description || trend) && (
        <CardContent className="pt-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-medium",
                  trend.isPositive ? "text-emerald-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
            <span>
              {trend?.label || description}
            </span>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export interface StatsCardGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}

export function StatsCardGrid({
  children,
  columns = 4,
  className,
}: StatsCardGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
  }

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  )
}
