"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Users,
  BookOpen,
  DollarSign,
  Star,
  Grid3X3,
  Clock,
  GraduationCap,
  UserCheck,
} from "lucide-react";

import { getDashboardData } from "@/services/admin.service";
import {
  PieChart,
  BarChart,
  AreaChart,
  StatsCard,
  StatsCardGrid,
} from "@/components/ui";
import { ChartConfig } from "@/components/ui/chart";

// Chart color configs
const pieChartConfig: ChartConfig = {
  STUDENT: { label: "Students", color: "hsl(var(--chart-1))" },
  TUTOR: { label: "Tutors", color: "hsl(var(--chart-2))" },
  ADMIN: { label: "Admins", color: "hsl(var(--chart-3))" },
  ACTIVE: { label: "Active", color: "hsl(var(--chart-1))" },
  BANNED: { label: "Banned", color: "hsl(var(--chart-2))" },
  PENDING: { label: "Pending", color: "hsl(var(--chart-1))" },
  ACCEPTED: { label: "Accepted", color: "hsl(var(--chart-2))" },
  REJECTED: { label: "Rejected", color: "hsl(var(--chart-3))" },
  COMPLETED: { label: "Completed", color: "hsl(var(--chart-4))" },
  PAID: { label: "Paid", color: "hsl(var(--chart-1))" },
  UNPAID: { label: "Unpaid", color: "hsl(var(--chart-2))" },
  INACTIVE: { label: "Inactive", color: "hsl(var(--chart-3))" },
};

const barChartConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
  bookings: { label: "Bookings", color: "hsl(var(--chart-2))" },
  students: { label: "Students", color: "hsl(var(--chart-1))" },
  tutors: { label: "Tutors", color: "hsl(var(--chart-2))" },
  total: { label: "Total", color: "hsl(var(--chart-3))" },
  tutorCount: { label: "Tutors", color: "hsl(var(--chart-1))" },
  count: { label: "Count", color: "hsl(var(--chart-1))" },
};

const areaChartConfig: ChartConfig = {
  totalUsers: { label: "Total Users", color: "hsl(var(--chart-1))" },
  students: { label: "Students", color: "hsl(var(--chart-2))" },
  tutors: { label: "Tutors", color: "hsl(var(--chart-3))" },
  cumulativeRevenue: { label: "Cumulative", color: "hsl(var(--chart-1))" },
  monthlyRevenue: { label: "Monthly", color: "hsl(var(--chart-2))" },
  count: { label: "Bookings", color: "hsl(var(--chart-1))" },
};

const AdminDashboardPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const response = await getDashboardData();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch dashboard data");
      }
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <StatsCardGrid columns={4}>
          {Array.from({ length: 8 }).map((_, i) => (
            <StatsCard key={i} title="Loading..." value="..." loading />
          ))}
        </StatsCardGrid>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[300px] animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <p>Error loading dashboard data: {(error as Error)?.message}</p>
        </div>
      </div>
    );
  }

  const { pieCharts, barCharts, areaCharts, stats } = data;

  // Transform data for charts
  const userRoleData = pieCharts.userRoleDistribution.map((item) => ({
    name: item.role,
    value: item.count,
    fill: `var(--color-${item.role})`,
  }));

  const userStatusData = pieCharts.userStatusDistribution.map((item) => ({
    name: item.status,
    value: item.count,
    fill: `var(--color-${item.status})`,
  }));

  const bookingStatusData = pieCharts.bookingStatusDistribution.map((item) => ({
    name: item.status,
    value: item.count,
    fill: `var(--color-${item.status})`,
  }));

  const paymentStatusData = pieCharts.paymentStatusDistribution.map((item) => ({
    name: item.status,
    value: item.count,
    fill: `var(--color-${item.status})`,
  }));

  const tutorStatusData = pieCharts.tutorStatusDistribution.map((item) => ({
    name: item.status,
    value: item.count,
    fill: `var(--color-${item.status})`,
  }));

  const monthlyRevenueData = barCharts.monthlyRevenue.map((item) => ({
    month: item.month,
    revenue: item.revenue,
  }));

  const monthlyBookingsData = barCharts.monthlyBookings.map((item) => ({
    month: item.month,
    bookings: item.bookings,
  }));

  const monthlyRegistrationsData = barCharts.monthlyRegistrations.map((item) => ({
    month: item.month,
    students: item.students,
    tutors: item.tutors,
    total: item.total,
  }));

  const topCategoriesData = barCharts.topCategories.map((item) => ({
    name: item.name,
    tutorCount: item.tutorCount,
  }));

  const tutorExperienceData = barCharts.tutorExperienceDistribution.map((item) => ({
    range: item.range,
    count: item.count,
  }));

  const hourlyRateData = barCharts.hourlyRateDistribution.map((item) => ({
    range: item.range,
    count: item.count,
  }));

  const platformGrowthData = areaCharts.platformGrowth.map((item) => ({
    month: item.month,
    totalUsers: item.totalUsers,
    students: item.students,
    tutors: item.tutors,
  }));

  const revenueTrendData = areaCharts.revenueTrend.map((item) => ({
    month: item.month,
    cumulativeRevenue: item.cumulativeRevenue,
    monthlyRevenue: item.monthlyRevenue,
  }));

  const bookingVolumeData = areaCharts.bookingVolume.map((item) => ({
    date: item.date,
    count: item.count,
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number | null) => {
    if (value === null) return "N/A";
    return new Intl.NumberFormat("en-US").format(value);
  };

  const formatRating = (value: number | null) => {
    if (value === null) return "N/A";
    return value.toFixed(1);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <StatsCardGrid columns={4}>
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.totalPlatformRevenue)}
          icon={DollarSign}
        />
        <StatsCard
          title="Active Bookings"
          value={formatNumber(stats.totalActiveBookings)}
          icon={BookOpen}
        />
        <StatsCard
          title="Avg Tutor Rating"
          value={formatRating(stats.averageTutorRating)}
          icon={Star}
        />
        <StatsCard
          title="Total Categories"
          value={formatNumber(stats.totalCategories)}
          icon={Grid3X3}
        />
        <StatsCard
          title="Avg Session Duration"
          value={`${formatNumber(stats.averageSessionDuration)} min`}
          icon={Clock}
        />
        <StatsCard
          title="Total Students"
          value={formatNumber(stats.totalStudents)}
          icon={GraduationCap}
        />
        <StatsCard
          title="Total Tutors"
          value={formatNumber(stats.totalTutors)}
          icon={UserCheck}
        />
        <StatsCard
          title="Total Users"
          value={formatNumber(stats.totalUsers)}
          icon={Users}
        />
      </StatsCardGrid>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <PieChart
          data={userRoleData}
          config={pieChartConfig}
          title="User Role Distribution"
          description="Breakdown of users by role"
          showLegend
        />
        <PieChart
          data={userStatusData}
          config={pieChartConfig}
          title="User Status Distribution"
          description="Active vs banned users"
          showLegend
        />
        <PieChart
          data={bookingStatusData}
          config={pieChartConfig}
          title="Booking Status"
          description="Pending, accepted, rejected, completed"
          showLegend
        />
        <PieChart
          data={paymentStatusData}
          config={pieChartConfig}
          title="Payment Status"
          description="Paid vs unpaid bookings"
          showLegend
        />
        <PieChart
          data={tutorStatusData}
          config={pieChartConfig}
          title="Tutor Status"
          description="Active, inactive, banned tutors"
          showLegend
        />
      </div>

      {/* Bar Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarChart
          data={monthlyRevenueData}
          config={barChartConfig}
          dataKeys={["revenue"]}
          xAxisKey="month"
          title="Monthly Revenue"
          description="Revenue per month"
          yAxisFormatter={(value) => `$${value}`}
        />
        <BarChart
          data={monthlyBookingsData}
          config={barChartConfig}
          dataKeys={["bookings"]}
          xAxisKey="month"
          title="Monthly Bookings"
          description="Number of bookings per month"
        />
        <BarChart
          data={monthlyRegistrationsData}
          config={barChartConfig}
          dataKeys={["students", "tutors", "total"]}
          xAxisKey="month"
          title="Monthly Registrations"
          description="New user registrations by type"
        />
        <BarChart
          data={topCategoriesData}
          config={barChartConfig}
          dataKeys={["tutorCount"]}
          xAxisKey="name"
          title="Top Categories"
          description="Categories with most tutors"
        />
        <BarChart
          data={tutorExperienceData}
          config={barChartConfig}
          dataKeys={["count"]}
          xAxisKey="range"
          title="Tutor Experience"
          description="Years of experience distribution"
        />
        <BarChart
          data={hourlyRateData}
          config={barChartConfig}
          dataKeys={["count"]}
          xAxisKey="range"
          title="Hourly Rate Ranges"
          description="Tutors grouped by hourly rate"
        />
      </div>

      {/* Area Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AreaChart
          data={platformGrowthData}
          config={areaChartConfig}
          dataKeys={["totalUsers", "students", "tutors"]}
          xAxisKey="month"
          title="Platform Growth"
          description="Cumulative user growth over time"
          variant="area"
        />
        <AreaChart
          data={revenueTrendData}
          config={areaChartConfig}
          dataKeys={["cumulativeRevenue", "monthlyRevenue"]}
          xAxisKey="month"
          title="Revenue Trend"
          description="Cumulative and monthly revenue"
          variant="area"
          yAxisFormatter={(value) => `$${value}`}
        />
        <AreaChart
          data={bookingVolumeData}
          config={areaChartConfig}
          dataKeys={["count"]}
          xAxisKey="date"
          title="Booking Volume (30 Days)"
          description="Daily booking volume"
          variant="area"
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;