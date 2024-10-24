import { Account, TOKEN_PROGRAM_ID, unpackAccount } from "@solana/spl-token";
import { type WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { getPrices } from "../api/stepApiClient";
import { ITokenPrices, StepToken } from "../api/types";
import { DECIMAL_PLACES, STEP_MINT, XSTEP_MINT } from "../constants/keys";
import { getDecimalAmount } from "../helpers/convertionHelpers";
import { useNotifications } from "./notificationContext";
export interface IAppWalletContext {
    connected: boolean;
    publicKey: PublicKey | null;
    address?: string;
    addressTrimmed?: string;
    balance: number;
    network: WalletAdapterNetwork;
    tokenAccounts: Account[];
    stepTokenAccounts: IStepTokenAccounts;
    setNetwork: (network: WalletAdapterNetwork) => void;
    disconnect: () => Promise<void>;
    updateTokensAndPrices: () => Promise<void>;
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
    const { connected, publicKey, disconnect } = useWallet();
    const { connection } = useConnection();
    const { showNotification } = useNotifications();

    const [tokenAccounts, setTokenAccounts] = useState<Account[]>([]);
    const [tokenPrices, setTokenPrices] = useState<ITokenPrices>({});

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

    const balance = useMemo(
        () =>
            tokenAccounts.length && Object.keys(tokenPrices).length
                ? tokenAccounts.reduce((total, account) => {
                      const mintAddress = account.mint.toBase58();
                      const price = tokenPrices[mintAddress]?.price;

                      return price
                          ? total +
                                getDecimalAmount(
                                    account.amount,
                                    DECIMAL_PLACES
                                ) *
                                    price
                          : total;
                  }, 0)
                : 0,
        [tokenAccounts, tokenPrices]
    );

    const stepTokenAccounts = useMemo<IStepTokenAccounts>(
        () =>
            tokenAccounts.reduce(
                (stepAccounts, account) => {
                    if (account.mint.equals(STEP_MINT)) {
                        stepAccounts.STEP = account;
                    } else if (account.mint.equals(XSTEP_MINT)) {
                        stepAccounts.xSTEP = account;
                    }

                    return stepAccounts;
                },
                {
                    STEP: null,
                    xSTEP: null,
                } as IStepTokenAccounts
            ),
        [tokenAccounts]
    );

    const disconnectWallet = useCallback(async () => {
        await disconnect();
        showNotification({
            title: `Disconnected from ${addressTrimmed}`,
            type: "info",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addressTrimmed]);

    async function fetchPrices() {
        const prices = await getPrices(network);
        setTokenPrices(prices);
    }

    async function getTokenAccounts() {
        if (!publicKey) return;

        const tokenAccountsResponse = await connection.getTokenAccountsByOwner(
            publicKey,
            {
                programId: TOKEN_PROGRAM_ID,
            },
            "confirmed"
        );

        const accounts = tokenAccountsResponse.value.map((x) =>
            unpackAccount(x.pubkey, x.account)
        );

        setTokenAccounts(accounts);
    }

    async function updateTokensAndPrices() {
        await Promise.all([fetchPrices(), getTokenAccounts()]);
    }

    // initial fetch prices
    useEffect(() => {
        fetchPrices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // handles the wallet conection notifications
    useEffect(() => {
        if (connected) {
            showNotification({
                title: `Connected to ${addressTrimmed}`,
                type: "info",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connected]);

    // fetch wallet token accounts
    useEffect(() => {
        if (!publicKey) return;

        getTokenAccounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [publicKey]);

    useEffect(() => {
        document.title =
            connected && balance
                ? `$${balance} USD | STEP`
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
                tokenAccounts,
                stepTokenAccounts,
                setNetwork,
                disconnect: disconnectWallet,
                updateTokensAndPrices,
            }}
        >
            {children}
        </AppWalletContext.Provider>
    );
}
