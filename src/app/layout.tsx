import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppWalletProvider } from "./components/appWalletProvider";
import ConnectedPageContent from "./components/connectedPageComponent";
import Header from "./components/header/header";
import NotificationProvider from "./components/notificationContext";
import "./styles/globals.css";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Step Challenge - joliliu",
    description: "Step Challenge by joliliu",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
            >
                <NotificationProvider>
                    <AppWalletProvider>
                        <Header></Header>
                        <main className="flex flex-1 flex-col gap-8 items-center justify-evenly p-5 mt-20">
                            <ConnectedPageContent>
                                {children}
                            </ConnectedPageContent>
                        </main>
                    </AppWalletProvider>
                </NotificationProvider>
            </body>
        </html>
    );
}
