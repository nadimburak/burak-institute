import theme from "@/theme/account/theme";
import ThemeRegistry from "@/theme/account/ThemeRegistry";
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
    <ThemeRegistry>
      <NextAppProvider theme={theme} >
        <WebsiteHeader />
        {children}
        <WebsiteFooter />
      </NextAppProvider></ThemeRegistry>
  );
}
