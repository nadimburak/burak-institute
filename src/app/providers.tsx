"use client";

import WebsiteThemeRegistry from "@/theme/website/webThemeRegistry";
import { NextAppProvider } from "@toolpad/core/nextjs";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <WebsiteThemeRegistry>
                <NextAppProvider>
                    {children}
                </NextAppProvider>
            </WebsiteThemeRegistry>
        </SessionProvider>
    );
}
