"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  GraduationCap,
  Star,
  Users,
} from "lucide-react";

import { getDashboardData } from "@/services/student.service";
import {
  PieChart,
  BarChart,
  LineChart,
  StatsCard,
  StatsCardGrid,
} from "@/components/ui";
import { ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Chart color configs
const pieChartConfig: ChartConfig = {
  PENDING: { label: "Pending", color: "hsl(var(--chart-1))" },
  ACCEPTED: { label: "Accepted", color: "hsl(var(--chart-2))" },
  REJECTED: { label: "Rejected", color: "hsl(var(--chart-3))" },
  COMPLETED: { label: "Completed", color: "hsl(var(--chart-4))" },
  PAID: { label: "Paid", color: "hsl(var(--chart-1))" },
  UNPAID: { label: "Unpaid", color: "hsl(var(--chart-2))" },
};

const barChartConfig: ChartConfig = {
  bookings: { label: "Bookings", color: "hsl(var(--chart-1))" },
  amount: { label: "Amount", color: "hsl(var(--chart-2))" },
  count: { label: "Count", color: "hsl(var(--chart-1))" },
};

const lineChartConfig: ChartConfig = {
  completed: { label: "Completed", color: "hsl(var(--chart-1))" },
  upcoming: { label: "Upcoming", color: "hsl(var(--chart-2))" },
};

const StudentDashboardPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["student-dashboard"],
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
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
        </div>
        <StatsCardGrid columns={4}>
          {Array.from({ length: 4 }).map((_, i) => (
            <StatsCard key={i} title="Loading..." value="..." loading />
          ))}
        </StatsCardGrid>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
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
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <p>Error loading dashboard data: {(error as Error)?.message}</p>
        </div>
      </div>
    );
  }

  const { pieCharts, barCharts, lineCharts, upcomingSessions, favoriteTutors, stats } = data;

  // Transform data for charts
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

  const subjectDistributionData = pieCharts.subjectDistribution.map((item) => ({
    name: item.subject,
    value: item.count,
    fill: `var(--color-${item.subject})`,
  }));

  const monthlyBookingsData = barCharts.monthlyBookings.map((item) => ({
    month: item.month,
    bookings: item.bookings,
  }));

  const monthlySpendingData = barCharts.monthlySpending.map((item) => ({
    month: item.month,
    amount: item.amount,
  }));

  const sessionTimelineData = lineCharts.sessionTimeline.map((item) => ({
    date: item.date,
    completed: item.completed,
    upcoming: item.upcoming,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <StatsCardGrid columns={4}>
        <StatsCard
          title="Total Bookings"
          value={formatNumber(stats.totalBookings)}
          icon={BookOpen}
        />
        <StatsCard
          title="Completed Sessions"
          value={formatNumber(stats.completedSessions)}
          icon={CheckCircle}
        />
        <StatsCard
          title="Upcoming Sessions"
          value={formatNumber(stats.upcomingSessions)}
          icon={Calendar}
        />
        <StatsCard
          title="Total Spent"
          value={formatCurrency(stats.totalSpent)}
          icon={DollarSign}
        />
        <StatsCard
          title="Unique Tutors"
          value={formatNumber(stats.uniqueTutors)}
          icon={Users}
        />
        <StatsCard
          title="Hours Learned"
          value={`${formatNumber(stats.totalHoursLearned)}h`}
          icon={Clock}
        />
        <StatsCard
          title="Reviews Given"
          value={formatNumber(stats.totalReviews)}
          icon={Star}
        />
        <StatsCard
          title="Avg Rating Given"
          value={formatRating(stats.averageRatingGiven)}
          icon={GraduationCap}
        />
      </StatsCardGrid>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Upcoming Sessions */}
        <Card className="border shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming sessions</p>
            ) : (
              upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col gap-1 rounded-lg border p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{session.tutorName}</span>
                    <Badge variant="outline">{session.duration} min</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{session.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(session.startDateTime)}
                  </p>
                  {session.meetingLink && (
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      Join Meeting
                    </a>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Favorite Tutors */}
        <Card className="border shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Favorite Tutors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {favoriteTutors.length === 0 ? (
              <p className="text-sm text-muted-foreground">No favorite tutors yet</p>
            ) : (
              favoriteTutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{tutor.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {tutor.subject}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{tutor.avgRating.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {tutor.totalSessions} sessions
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Booking Status Pie Chart */}
        <PieChart
          data={bookingStatusData}
          config={pieChartConfig}
          title="Booking Status"
          description="Your booking status distribution"
          showLegend
        />
      </div>

      {/* More Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PieChart
          data={paymentStatusData}
          config={pieChartConfig}
          title="Payment Status"
          description="Paid vs unpaid bookings"
          showLegend
        />
        <PieChart
          data={subjectDistributionData}
          config={{
            ...pieChartConfig,
            ...Object.fromEntries(
              subjectDistributionData.map((item, i) => [
                item.name,
                {
                  label: item.name,
                  color: `hsl(var(--chart-${(i % 5) + 1}))`,
                },
              ])
            ),
          }}
          title="Subjects"
          description="Sessions by subject"
          showLegend
        />
      </div>

      {/* Bar Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarChart
          data={monthlyBookingsData}
          config={barChartConfig}
          dataKeys={["bookings"]}
          xAxisKey="month"
          title="Monthly Bookings"
          description="Your bookings over the last 6 months"
        />
        <BarChart
          data={monthlySpendingData}
          config={barChartConfig}
          dataKeys={["amount"]}
          xAxisKey="month"
          title="Monthly Spending"
          description="Your spending over the last 6 months"
          yAxisFormatter={(value) => `$${value}`}
        />
      </div>

      {/* Session Timeline */}
      <LineChart
        data={sessionTimelineData}
        config={lineChartConfig}
        dataKeys={["completed", "upcoming"]}
        xAxisKey="date"
        title="Session Timeline (30 Days)"
        description="Daily completed vs upcoming sessions"
      />
    </div>
  );
};

export default StudentDashboardPage;