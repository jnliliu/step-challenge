/* eslint-disable react-hooks/exhaustive-deps */
import { Account, unpackAccount } from "@solana/spl-token";
import { type WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
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
import { getStepTokens } from "../api/stepApiClient";
import { IStepTokenMap, StepToken } from "../api/types";
import { useNotifications } from "./notificationContext";

// const UPDATE_BALANCE_INTERVAL_MS = 10000;

export interface IAppWalletContext {
    connected: boolean;
    publicKey: PublicKey | null;
    address?: string;
    addressTrimmed?: string;
    balance: number;
    network: WalletAdapterNetwork;
    stepTokens?: IStepTokenMap;
    tokenAccounts?: IStepTokenAccounts;
    programId?: PublicKey;
    setNetwork: (network: WalletAdapterNetwork) => void;
    disconnect: () => Promise<void>;
}

export type IStepTokenAccounts = {
    [key in StepToken]: Account | null;
};

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

    const [stepTokens, setStepTokens] = useState<IStepTokenMap>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [programId, setProgramId] = useState<PublicKey>();
    const [balance, setBalance] = useState<number>(0);
    const [tokenAccounts, setTokenAccounts] = useState<IStepTokenAccounts>();
    // const [tokenBalances, setTokenBalances] = useState<IStepTokenBalances>();

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

    const disconnectWallet = useCallback(async () => {
        await disconnect();
        showNotification(`Disconnected from ${addressTrimmed}`, "info");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addressTrimmed]);

    async function getStepTokenAccount(
        tokenAddress: PublicKey,
        publicKey: PublicKey,
        programId: PublicKey
    ) {
        try {
            const tokenAccount = await connection.getTokenAccountsByOwner(
                publicKey,
                {
                    programId,
                    mint: tokenAddress,
                },
                "confirmed"
            );

            const programAccount = tokenAccount.value[0];

            if (!programAccount) return null;

            return unpackAccount(
                programAccount.pubkey,
                programAccount.account,
                programId
            );
        } catch {
            return null;
        }
    }

    async function getTokenAccounts() {
        if (!publicKey) return;

        const pId = await getProgramId();
        console.log("ProgramId: ", pId);
        if (!pId) return;

        const stepTokenAccount = await getStepTokenAccount(
            new PublicKey(stepTokens!.STEP.address),
            publicKey,
            pId
        );

        const xStepTokenAccount = await getStepTokenAccount(
            new PublicKey(stepTokens!.xSTEP.address),
            publicKey,
            pId
        );

        setTokenAccounts({
            [StepToken.STEP]: stepTokenAccount,
            [StepToken.xSTEP]: xStepTokenAccount,
        });
    }

    async function getWalletBalance() {
        if (!publicKey) return 0;
        const newBalance = await connection.getBalance(publicKey);
        setBalance(newBalance / LAMPORTS_PER_SOL);
    }

    async function getBalances() {
        if (!publicKey) return;

        await getWalletBalance();
        await getTokenAccounts();
        try {
            // await Promise.all([getWalletBalance(), getTokenAccounts()]);
        } finally {
            // balanceTimeoutRef.current = setTimeout(
            //     getBalances,
            //     UPDATE_BALANCE_INTERVAL_MS
            // );
        }
    }

    async function getProgramId() {
        if (!stepTokens) return;

        const response = await connection.getAccountInfo(
            new PublicKey(stepTokens.STEP.address)
        );

        setProgramId(response?.owner);
        return response?.owner;
    }

    useEffect(() => {
        if (connected) {
            showNotification(`Connected to ${addressTrimmed}`, "info");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connected]);

    useEffect(() => {
        getStepTokens(network).then(setStepTokens);
    }, [network]);

    useEffect(() => {
        if (balanceTimeoutRef.current) {
            clearTimeout(balanceTimeoutRef.current);
            balanceTimeoutRef.current = undefined;
        }

        if (!publicKey || !stepTokens) return;

        getBalances();

        return () => {
            if (balanceTimeoutRef.current) {
                clearTimeout(balanceTimeoutRef.current);
                balanceTimeoutRef.current = undefined;
            }
        };
    }, [publicKey, stepTokens]);

    useEffect(() => {
        document.title =
            connected && balance
                ? `$${balance} SOL | STEP`
                : "Step Challenge - joliliu";
    }, [balance, connected]);

    return (
        <AppWalletContext.Provider
            value={{
                connected,
                balance,
                publicKey,
                address,
                addressTrimmed,
                network,
                stepTokens,
                tokenAccounts,
                programId,
                setNetwork,
                disconnect: disconnectWallet,
            }}
        >
            {children}
        </AppWalletContext.Provider>
    );
}
