export default function DashboardRoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 bg-card border-r border-border text-foreground p-4">
        <div className="text-xl font-bold mb-8 text-primary">Dashboard</div>
        <nav>Sidebar Menu</nav>
      </aside>
      <main className="flex-1 p-8 bg-background">
        {children}
      </main>
    </div>
  );
}
