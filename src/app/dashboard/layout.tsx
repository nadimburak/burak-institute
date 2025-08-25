"use client";

import AdminLayout from "@/layout/account";
import ThemeRegistry from "@/theme/account/ThemeRegistry";
import { SessionProvider } from "next-auth/react";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <ThemeRegistry>
                    <SessionProvider>
                        <AdminLayout>
                            {children}
                        </AdminLayout>
                    </SessionProvider>
                </ThemeRegistry>
            </body>
        </html>
    );
}