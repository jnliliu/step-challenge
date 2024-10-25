import {
    AnchorProvider,
    BN,
    Program,
    setProvider,
    Wallet,
    web3,
} from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import {
    STEP_MINT,
    XSTEP_MINT,
    XSTEP_PROGRAM_ID,
    XSTEP_TOKEN_VAULT,
} from "../constants/keys";
import { StepStakingIDL, StepStakingJSON } from "./step_staking";

export interface IStepProgramOptions {
    connection: Connection;
    anchorWallet: AnchorWallet;
}

/**
 * @deprecated This class is deprecated and will be removed in the next release.
 * Please use the `useStepProgram` react hook instead.
 */
export class StepProgram {
    public readonly provider: AnchorProvider;
    public readonly program: Program<StepStakingIDL>;

    constructor({ connection, anchorWallet }: IStepProgramOptions) {
        this.provider = new AnchorProvider(
            connection,
            anchorWallet as Wallet,
            {}
        );

        setProvider(this.provider);
        this.program = new Program(
            StepStakingJSON,
            XSTEP_PROGRAM_ID,
            this.provider
        );
    }

    findNonce(): number {
        const seed = [STEP_MINT.toBuffer()];
        const [pda, bump] = web3.PublicKey.findProgramAddressSync(
            seed,
            this.program.programId
        );

        if (!pda.equals(XSTEP_TOKEN_VAULT)) {
            throw new Error(
                `Invalid bump: Returned PDA (${pda.toBase58()}) doesn't match the token vault ${XSTEP_TOKEN_VAULT.toBase58()}`
            );
        }

        console.log("Valid bump found:", bump);
        return bump;
    }

    listenPriceChange(onPriceChanged: () => void) {
        this.program.addEventListener("PriceChange", onPriceChanged);
    }

    stake(
        stepAccountFrom: PublicKey,
        xStepAccountTo: PublicKey,
        value: number
    ) {
        const nonce = this.findNonce();

        const accounts = {
            tokenMint: STEP_MINT,
            xTokenMint: XSTEP_MINT,
            tokenFrom: stepAccountFrom,
            tokenFromAuthority: this.provider.wallet.publicKey,
            tokenVault: XSTEP_TOKEN_VAULT,
            xTokenTo: xStepAccountTo,
            tokenProgram: TOKEN_PROGRAM_ID,
        };

        console.log(
            "stake request",
            value,
            Object.entries(accounts).map(([key, v]) => [key, v.toBase58()])
        );

        return this.program.rpc.stake(nonce, new BN(value), {
            accounts,
        });
    }

    async unstake(
        xStepAccountFrom: PublicKey,
        stepAccountTo: PublicKey,
        value: number
    ) {
        const nonce = this.findNonce();

        return this.program.rpc.unstake(nonce, new BN(value), {
            accounts: {
                tokenMint: STEP_MINT,
                xTokenMint: XSTEP_MINT,
                xTokenFrom: xStepAccountFrom,
                xTokenFromAuthority: this.provider.wallet.publicKey,
                tokenVault: XSTEP_TOKEN_VAULT,
                tokenTo: stepAccountTo,
                tokenProgram: TOKEN_PROGRAM_ID,
            },
        });
    }
}
