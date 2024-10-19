"use client";
import { useAppWallet } from "./customWalletContext";
import DisconnectedSection from "./disconnectedComponent";

export default function ConnectedPageContent({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { connected } = useAppWallet();

    return <>{connected ? children : <DisconnectedSection />}</>;
}
