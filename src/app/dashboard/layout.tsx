"use client";

import AdminLayout from "@/layout/account";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <AdminLayout>
            {children}
        </AdminLayout>
    );
}
