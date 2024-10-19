import { StepStakingJSON } from "@/app/idl/step_staking";
import {
    AnchorProvider,
    Idl,
    Program,
    setProvider,
    Wallet,
} from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useMemo } from "react";

export default function useStepProgram() {
    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet();

    const program = useMemo(() => {
        const provider = new AnchorProvider(
            connection,
            anchorWallet as Wallet,
            {}
        );
        setProvider(provider);

        return new Program(StepStakingJSON as unknown as Idl, {
            connection,
        });
    }, [connection, anchorWallet]);

    return {
        anchorWallet,
        program,
    };
}
