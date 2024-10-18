import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";

export default function useWalletHelper() {
    const { connected, publicKey, disconnect } = useWallet();
    const { connection } = useConnection();

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
        if (!publicKey) return;

        (async function getBalanceEvery10Seconds() {
            const newBalance = await connection.getBalance(publicKey);
            setBalance(newBalance / LAMPORTS_PER_SOL);
            setTimeout(getBalanceEvery10Seconds, 10000);
        })();
    }, [publicKey, connection, balance]);

    return {
        connected,
        publicKey,
        address,
        addressTrimmed,
        balance,
        disconnect,
    };
}
