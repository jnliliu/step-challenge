"use client";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import {
    MathWalletAdapter,
    PhantomWalletAdapter,
    SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { type ReactNode, useMemo, useState } from "react";
import { HELIUS_MAINNET_RPC } from "../constants/rpc";
import CustomWalletProvider from "./customWalletContext";
import { useNotifications } from "./notificationContext";

export const AppWalletProvider = ({ children }: { children: ReactNode }) => {
    const [network, setNetwork] = useState(WalletAdapterNetwork.Mainnet);
    const endpoint = useMemo(
        () =>
            network === WalletAdapterNetwork.Mainnet
                ? HELIUS_MAINNET_RPC
                : clusterApiUrl(network),
        [network]
    );
    const { showNotification } = useNotifications();

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new MathWalletAdapter(),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider
                wallets={wallets}
                autoConnect
                onError={(error) => showNotification(error.message, "error")}
            >
                <WalletModalProvider>
                    <CustomWalletProvider
                        network={network}
                        setNetwork={setNetwork}
                    >
                        {children}
                    </CustomWalletProvider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
