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
import { useEffect, useMemo, useState } from "react";
import { useAppWallet } from "../components/customWalletContext";
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

    async function confirmTransaction(txSignature: string) {
        if (!program) return null;

        const connection = program.provider.connection;
        const latestBlockhash = await connection.getLatestBlockhash();
        const confirmation = await connection.confirmTransaction({
            signature: txSignature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });

        return confirmation.value;
    }

    async function stake(value: number) {
        if (
            !publicKey ||
            !program ||
            !nonce ||
            !stepTokenAccounts.STEP ||
            !stepTokenAccounts.xSTEP
        )
            return null;

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

        return await program.rpc.stake(nonce, new BN(value), {
            accounts,
        });
    }

    async function unstake(value: number) {
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

        return await program.rpc.unstake(nonce, new BN(value), {
            accounts,
        });
    }

    useEffect(() => {
        if (!program) {
            return;
        }

        const listener = program.addEventListener("PriceChange", console.log);

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
        confirmTransaction,
    };
}
