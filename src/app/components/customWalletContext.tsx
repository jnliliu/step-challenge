import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, type PublicKey } from "@solana/web3.js";
import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
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
    children,
}: {
    children: ReactNode;
}) {
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

    useEffect(() => {
        if (!publicKey) return;

        (async function getBalance() {
            const newBalance = await connection.getBalance(publicKey);
            setBalance(newBalance / LAMPORTS_PER_SOL);

            setTimeout(getBalance, UPDATE_BALANCE_INTERVAL_MS);
        })();
    }, [publicKey, connection, balance]);

    return (
        <AppWalletContext.Provider
            value={{
                connected,
                balance,
                publicKey,
                address,
                addressTrimmed,
                disconnect: disconnectWallet,
            }}
        >
            {children}
        </AppWalletContext.Provider>
    );
}
