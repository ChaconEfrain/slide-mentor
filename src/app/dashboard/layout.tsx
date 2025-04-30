import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto">
      <SidebarProvider>
        <AppSidebar />
        <main className="font-outfit w-full px-4 py-10">{children}</main>
      </SidebarProvider>
    </div>
  );
}