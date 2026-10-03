import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  async function logoutAction() {
    "use server";
    await logout();
    redirect("/admin/login");
  }

  return (
    <AdminLayoutClient logoutAction={logoutAction}>
      {children}
    </AdminLayoutClient>
  );
}
