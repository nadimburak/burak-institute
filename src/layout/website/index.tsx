
import ThemeRegistry from "@/theme/ThemeRegistry";
import { NextAppProvider } from "@toolpad/core/nextjs";
import React from "react";
import WebsiteFooter from "./footer";
import WebsiteHeader from "./header";
import getTheme from "@/theme/theme";

interface LayoutProps {
  children: React.ReactNode;
}

export default function WebsiteLayout(props: LayoutProps) {
  const { children } = props;

  return (
    <ThemeRegistry>
      <NextAppProvider theme={getTheme} >
        <WebsiteHeader />
        {children}
        <WebsiteFooter />
      </NextAppProvider>
      </ThemeRegistry>
  );
}
