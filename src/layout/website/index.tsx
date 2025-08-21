import React from "react";
import WebsiteFooter from "./footer";
import WebsiteHeader from "./header";
import { NextAppProvider } from "@toolpad/core/nextjs";

// import theme from "@/theme/account/theme";
// import websiteTheme from "@/theme/website/webTheme";

interface LayoutProps {
  children: React.ReactNode;
}

export default function WebsiteLayout(props: LayoutProps) {
  const { children } = props;

  return (
    <NextAppProvider >
      <WebsiteHeader />
      {children}
      <WebsiteFooter />
    </NextAppProvider>
  );
}
