/* eslint-disable react-hooks/exhaustive-deps */
import { type WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, type PublicKey } from "@solana/web3.js";
import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useNotifications } from "./notificationContext";

const UPDATE_BALANCE_INTERVAL_MS = 10000;

export interface IAppWalletContext {
    connected: boolean;
    publicKey: PublicKey | null;
    address?: string;
    addressTrimmed?: string;
    balance: number;
    network: WalletAdapterNetwork;
    setNetwork: (network: WalletAdapterNetwork) => void;
    disconnect: () => Promise<void>;
}

export const AppWalletContext = createContext<IAppWalletContext | null>(null);

export function useAppWallet() {
    const appWallet = useContext(AppWalletContext);

    if (!appWallet)
        throw new Error("Make sure you call this within a AppWalletContext.");

    return appWallet;
}

export default function CustomWalletProvider({
    network,
    setNetwork,
    children,
}: {
    network: WalletAdapterNetwork;
    setNetwork: (network: WalletAdapterNetwork) => void;
    children: ReactNode;
}) {
    const balanceTimeoutRef = useRef<NodeJS.Timeout>();
    const { connected, publicKey, disconnect } = useWallet();
    const { connection } = useConnection();
    const { showNotification } = useNotifications();

    const address = useMemo(() => publicKey?.toBase58(), [publicKey]);
    const addressTrimmed = useMemo(
        () =>
            address &&
            `${address.substring(0, 4)}...${address.substring(
                address.length - 4,
                address.length
            )}`,
        [address]
    );

    const [balance, setBalance] = useState<number>(0);

    useEffect(() => {
        if (connected) {
            showNotification(`Connected to ${addressTrimmed}`, "info");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connected]);

    const disconnectWallet = useCallback(async () => {
        await disconnect();
        showNotification(`Disconnected from ${addressTrimmed}`, "info");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addressTrimmed]);

    const getBalance = useCallback(async () => {
        if (!publicKey) return;

        try {
            const newBalance = await connection.getBalance(publicKey);
            setBalance(newBalance / LAMPORTS_PER_SOL);
        } finally {
            balanceTimeoutRef.current = setTimeout(
                getBalance,
                UPDATE_BALANCE_INTERVAL_MS
            );
        }
    }, [publicKey, network]);

    useEffect(() => {
        if (balanceTimeoutRef.current) {
            clearTimeout(balanceTimeoutRef.current);
        }

        if (!publicKey) {
            return;
        }

        getBalance();

        return () => {
            if (balanceTimeoutRef.current) {
                clearTimeout(balanceTimeoutRef.current);
            }
        };
    }, [publicKey, network]);

    return (
        <AppWalletContext.Provider
            value={{
                connected,
                balance,
                publicKey,
                address,
                addressTrimmed,
                network,
                setNetwork,
                disconnect: disconnectWallet,
            }}
        >
            {children}
        </AppWalletContext.Provider>
    );
}
