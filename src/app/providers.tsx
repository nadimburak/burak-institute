"use client";

import ThemeRegistry from "@/theme/account/ThemeRegistry";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ThemeRegistry>
                <NextAppProvider>
                    {children}
                </NextAppProvider>
            </ThemeRegistry>
        </SessionProvider>
    );
}
