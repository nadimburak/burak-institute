import websiteTheme from "@/theme/website/webTheme";
import WebsiteThemeRegistry from "@/theme/website/webThemeRegistry";
import { NextAppProvider } from "@toolpad/core/nextjs";
import React from "react";
import WebsiteFooter from "./footer";
import WebsiteHeader from "./header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function WebsiteLayout(props: LayoutProps) {
  const { children } = props;

  return (
    <WebsiteThemeRegistry>
      <NextAppProvider theme={websiteTheme} >
        <WebsiteHeader />
        {children}
        <WebsiteFooter />
      </NextAppProvider></WebsiteThemeRegistry>
  );
}
