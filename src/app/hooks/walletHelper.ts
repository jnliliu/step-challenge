import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNotifications } from "../components/notificationContext";

const UPDATE_BALANCE_INTERVAL_MS = 10000;

export default function useWalletHelper() {
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

        (async function getBalanceEvery10Seconds() {
            const newBalance = await connection.getBalance(publicKey);
            setBalance(newBalance / LAMPORTS_PER_SOL);

            setTimeout(getBalanceEvery10Seconds, UPDATE_BALANCE_INTERVAL_MS);
        })();
    }, [publicKey, connection, balance]);

    return {
        connected,
        publicKey,
        address,
        addressTrimmed,
        balance,
        disconnect: disconnectWallet,
    };
}
