"use client";

import { SessionProvider } from "next-auth/react";
import AccountThemeRegistry from "@/theme/account/ThemeRegistry";
import AdminLayout from "@/layout/account";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <SessionProvider>
                    {/* <AccountThemeRegistry> */}
                    <AdminLayout>
                        {children}
                    </AdminLayout>
                    {/* </AccountThemeRegistry> */}
                </SessionProvider>
            </body>
        </html>
    );
}
// "use client";

// import AdminLayout from "@/layout/account";
// import { PropsWithChildren } from "react";

// export default function Layout({ children }: PropsWithChildren) {
//     return (
//         <AdminLayout>
//             {children}
//         </AdminLayout>
//     );
// }