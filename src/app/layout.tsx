import StepLogo from "@/app/assets/step.svg";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import { AppWalletProvider } from "./components/appWalletProvider";
import Header from "./components/header";
import NotificationProvider from "./contexts/NotificationContext";
import "./globals.css";

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
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <NotificationProvider>
                    <AppWalletProvider>
                        <Header></Header>
                        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                                <Image
                                    src={StepLogo}
                                    alt="Step logo"
                                    width={180}
                                    height={38}
                                    priority
                                />

                                {children}
                            </main>
                        </div>
                        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
                    </AppWalletProvider>
                </NotificationProvider>
            </body>
        </html>
    );
}
