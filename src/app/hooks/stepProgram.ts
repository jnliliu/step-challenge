import { StepStakingJSON } from "@/app/program/step_staking";
import {
    AnchorProvider,
    BN,
    Program,
    setProvider,
    Wallet,
    web3,
} from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppWallet } from "../components/customWalletContext";
import { useNotifications } from "../components/notificationContext";
import {
    STEP_MINT,
    XSTEP_MINT,
    XSTEP_PROGRAM_ID,
    XSTEP_TOKEN_VAULT,
} from "../constants/keys";

export default function useStepProgram() {
    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet();
    const { publicKey, stepTokenAccounts } = useAppWallet();
    const { showNotification } = useNotifications();
    const [nonce, setNonce] = useState<number>();

    const program = useMemo(() => {
        if (!connection) {
            return null;
        }

        const provider = new AnchorProvider(
            connection,
            anchorWallet as Wallet,
            {}
        );

        setProvider(provider);
        return new Program(StepStakingJSON, XSTEP_PROGRAM_ID, provider);
    }, [connection, anchorWallet]);

    function onPriceChange() {
        showNotification({
            title: "You are staking STEP",
            description: "Confirmation in progress...",
            type: "info",
        });
    }

    const stake = useCallback(
        (value: number) => {
            if (
                !publicKey ||
                !program ||
                !nonce ||
                !stepTokenAccounts.STEP ||
                !stepTokenAccounts.xSTEP
            )
                return;

            const accounts = {
                tokenMint: STEP_MINT,
                xTokenMint: XSTEP_MINT,
                tokenFrom: stepTokenAccounts.STEP.address,
                tokenFromAuthority: publicKey,
                tokenVault: XSTEP_TOKEN_VAULT,
                xTokenTo: stepTokenAccounts.xSTEP.address,
                tokenProgram: TOKEN_PROGRAM_ID,
            };

            console.log(
                "stake request",
                value,
                Object.entries(accounts).map(([key, v]) => [key, v.toBase58()])
            );

            return program.rpc.stake(nonce, new BN(value), {
                accounts,
            });
        },
        [
            publicKey,
            program,
            nonce,
            stepTokenAccounts.STEP,
            stepTokenAccounts.xSTEP,
        ]
    );

    const unstake = useCallback(
        (value: number) => {
            if (
                !publicKey ||
                !program ||
                !nonce ||
                !stepTokenAccounts.STEP ||
                !stepTokenAccounts.xSTEP
            )
                return;

            const accounts = {
                tokenMint: STEP_MINT,
                xTokenMint: XSTEP_MINT,
                xTokenFrom: stepTokenAccounts.xSTEP.address,
                xTokenFromAuthority: publicKey,
                tokenVault: XSTEP_TOKEN_VAULT,
                tokenTo: stepTokenAccounts.STEP.address,
                tokenProgram: TOKEN_PROGRAM_ID,
            };

            console.log(
                "unstake request",
                value,
                Object.entries(accounts).map(([key, v]) => [key, v.toBase58()])
            );
            return program.rpc.unstake(nonce, new BN(value), {
                accounts,
            });
        },
        [
            publicKey,
            program,
            nonce,
            stepTokenAccounts.STEP,
            stepTokenAccounts.xSTEP,
        ]
    );

    useEffect(() => {
        if (!program) {
            return;
        }

        const listener = program.addEventListener("PriceChange", onPriceChange);

        // Get nonce
        const seed = [STEP_MINT.toBuffer()];
        const [pda, bump] = web3.PublicKey.findProgramAddressSync(
            seed,
            program.programId
        );

        if (pda.equals(XSTEP_TOKEN_VAULT)) {
            setNonce(bump);
        }

        return () => {
            program.removeEventListener(listener);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [program]);

    return {
        anchorWallet,
        program,
        stake,
        unstake,
    };
}
