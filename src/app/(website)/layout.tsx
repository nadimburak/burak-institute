"use client";

import WebsiteLayout from "@/layout/website";
import { websiteNavigation } from "@/layout/website/navigation";
import WebsiteThemeRegistry from "@/theme/account/ThemeRegistry";

import { AppProvider } from "@toolpad/core";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <WebsiteThemeRegistry>
      <AppProvider navigation={websiteNavigation}>
        <WebsiteLayout>{children}</WebsiteLayout>
      </AppProvider>
    </WebsiteThemeRegistry>
  );
}


