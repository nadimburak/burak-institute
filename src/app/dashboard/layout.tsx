"use client";

import AdminLayout from "@/layout/account";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminLayout>
            {children}
        </AdminLayout>
    );
}
