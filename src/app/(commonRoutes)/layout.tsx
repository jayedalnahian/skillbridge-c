import NavbarWrapper from "@/components/navbar/NavbarWrapper";

export default function CommonRoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavbarWrapper />
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}
