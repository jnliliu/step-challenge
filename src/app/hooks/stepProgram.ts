import { StepStakingJSON } from "@/app/idl/step_staking";
import {
    AnchorProvider,
    Idl,
    Program,
    setProvider,
    Wallet,
} from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useEffect, useMemo } from "react";

export default function useStepProgram() {
    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet();

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

        return new Program(StepStakingJSON as unknown as Idl, provider);
    }, [connection, anchorWallet]);

    function onPriceChange(...args: unknown[]) {
        console.log("Price changed", ...args);
    }

    useEffect(() => {
        if (!program) {
            return;
        }

        // program.methods.initialize();
        const listener = program.addEventListener("PriceChange", onPriceChange);

        return () => {
            program.removeEventListener(listener);
        };
    }, [program]);

    return {
        anchorWallet,
        program,
    };
}
