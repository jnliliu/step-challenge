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
                        <div className="flex">
                            <main className="flex flex-1 flex-col gap-8 row-start-2 items-center p-5 mt-20">
                                <ConnectedPageContent>
                                    {children}
                                </ConnectedPageContent>
                            </main>
                        </div>
                        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
                    </AppWalletProvider>
                </NotificationProvider>
            </body>
        </html>
    );
}
