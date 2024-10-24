import { StepStakingJSON } from "@/app/idl/step_staking";
import {
    AnchorProvider,
    Program,
    setProvider,
    Wallet,
} from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useMemo } from "react";
import { useAppWallet } from "../components/customWalletContext";

export default function useStepProgram(programId?: PublicKey) {
    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet();
    const { stepTokens } = useAppWallet();

    const program = useMemo(() => {
        if (!connection || !programId || !stepTokens) {
            return null;
        }

        console.log("creating provider", programId, stepTokens);
        const provider = new AnchorProvider(
            connection,
            anchorWallet as Wallet,
            {}
        );

        setProvider(provider);

        console.log(provider);

        return new Program(StepStakingJSON, programId, provider);
    }, [connection, anchorWallet, programId, stepTokens]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // function onPriceChange(e: any, s: any) {
    //     console.log("Price Change In Slot ", s);
    //     console.log("From", e.oldStepPerXstepE9.toString());
    //     console.log("From", e.oldStepPerXstep.toString());
    //     console.log("To", e.newStepPerXstepE9.toString());
    //     console.log("To", e.newStepPerXstep.toString());
    // }

    useEffect(() => {
        if (!program) {
            return;
        }

        // program.rpc.initialize({
        //     accounts:
        // });
        // const listener = program.addEventListener("PriceChange", onPriceChange);

        // return () => {
        //     program.removeEventListener(listener);
        // };
    }, [program]);

    return {
        anchorWallet,
        program,
    };
}
