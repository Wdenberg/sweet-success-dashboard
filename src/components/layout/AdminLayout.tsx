import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { MobileSidebar } from "./MobileSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-muted">
      <MobileSidebar variant="admin" />
      <AdminSidebar />
      <main className="md:pl-64 pt-16 md:pt-0">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
