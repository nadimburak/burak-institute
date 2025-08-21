"use client";

import useAuth from "@/hooks/useAuth";
import theme from "@/theme/account/theme";
import { PageContainer } from "@toolpad/core";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { NextAppProvider } from "@toolpad/core/nextjs";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import accountNavigation from "./navigation";

export default function AdminLayout({
  window,
  children,
}: {
  window?: () => Window;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const demoWindow = window !== undefined ? window() : undefined;

  React.useEffect(() => {
    if (!isAuthenticated && pathname !== "/account/sign-in") {
      router.push("/account/sign-in");
    }
  }, [isAuthenticated, pathname, router]);

  return (
    <NextAppProvider
      navigation={accountNavigation}
      theme={theme}
      branding={{
        logo: (
          <Image
            src="/logo1.png"
            alt="Customer Logo"
            width={70}
            height={70}
            style={{ borderRadius: "8px", objectFit: "cover" }}
          />
        ),
        title: "Customer Panel",
        homeUrl: "/",
      }}
      router={{
        pathname,
        navigate: (url) => router.push(url.toString()),
        searchParams: new URLSearchParams(),
      }}
      window={demoWindow}
      session={{
        user: user
          ? {
              ...user,
              id: user.id?.toString() || null,
              name: user.name || "",
              email: user.email || "",
              image: user.image
                ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}/uploads/${user.image}`
                : "",
            }
          : undefined,
      }}
      authentication={{
        signIn: () => router.push("/account/sign-in"),
        signOut: async () => {
          await logout();
          router.push("/account/sign-in");
        },
      }}
    >
      <DashboardLayout>
        <PageContainer
          sx={{
            backgroundColor: "background.default",
            "& .MuiBreadcrumbs-root": {
              display: "none",
            },
            "& .css-5abyqd-MuiTypography-root": {
              fontSize: "1.5rem",
            },
          }}
        >
          {children}
        </PageContainer>
      </DashboardLayout>
    </NextAppProvider>
  );
}
