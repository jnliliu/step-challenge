"use client";
import ArrowDownIcon from "@/app/assets/arrow-down.svg";
import StepIcon from "@/app/assets/step-logo.png";
import XStepIcon from "@/app/assets/xstep.svg";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import Image, { StaticImageData } from "next/image";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { StepToken } from "../api/types";
import { useAppWallet } from "../components/customWalletContext";
import { useNotifications } from "../components/notificationContext";
import { DECIMAL_PLACES } from "../constants/keys";
import {
    formatCurrency,
    formattedCurrencyToNumber,
    getAmountFromDecimal,
    getDecimalAmount,
} from "../helpers/convertionHelpers";
import useStepProgram from "../hooks/stepProgram";

export enum StakeMode {
    stake = "stake",
    unstake = "unstake",
}

interface IStakeInput {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tokenIcon: any;
    tokenText: string;
    value: number;
    setValue?: Dispatch<SetStateAction<number>>;
}

function StakeInput({ tokenIcon, tokenText, value, setValue }: IStakeInput) {
    const displayValue: string = useMemo(() => {
        if (!setValue && !value) return "0.00";

        if (!value) return "";

        return formatCurrency(value, 0, DECIMAL_PLACES);
    }, [value, setValue]);

    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-black h-16 w-full">
            <div className="flex items-center font-bold">
                <Image src={tokenIcon} alt={tokenIcon} width={28} height={28} />
                <span>{tokenText}</span>
            </div>

            {!setValue ? (
                <span className="font-bold text-lg pl-3 text-white rounded-sm text-end">
                    {displayValue || "0.00"}
                </span>
            ) : (
                <input
                    value={displayValue}
                    type="text"
                    maxLength={22}
                    autoComplete="off"
                    placeholder="0.00"
                    className="input-number bg-transparent font-bold text-lg pl-3 text-white rounded-sm text-end"
                    style={{
                        appearance: "textfield",
                    }}
                    onChange={(event) =>
                        setValue(formattedCurrencyToNumber(event.target.value))
                    }
                />
            )}
        </div>
    );
}

export type TokenConfig = {
    tokenType: StepToken;
    icon: StaticImageData;
    amount: number;
};

export default function StakeComponent({
    pricePerXToken,
}: {
    pricePerXToken?: number;
}) {
    const [isWaiting, setIsWaiting] = useState(false);
    const [stakeValue, setStakeValue] = useState<number>(0);
    const [stakeMode, setStakeMode] = useState(StakeMode.stake);
    const anchorWallet = useAnchorWallet();
    const { stepTokenAccounts, updateTokensAndPrices } = useAppWallet();
    const { showNotification } = useNotifications();
    const { stake, unstake } = useStepProgram();

    const stepAmount = useMemo(
        () =>
            stepTokenAccounts.STEP?.amount
                ? getDecimalAmount(
                      stepTokenAccounts.STEP.amount,
                      DECIMAL_PLACES
                  )
                : 0,
        [stepTokenAccounts.STEP]
    );

    const xStepAmount = useMemo(
        () =>
            stepTokenAccounts.xSTEP?.amount
                ? getDecimalAmount(
                      stepTokenAccounts.xSTEP.amount,
                      DECIMAL_PLACES
                  )
                : 0,
        [stepTokenAccounts.xSTEP]
    );

    const receiveValue = useMemo(() => {
        if (!pricePerXToken || !stakeValue) return 0;

        if (stakeMode === StakeMode.stake) {
            return stakeValue / pricePerXToken;
        }

        return stakeValue * pricePerXToken;
    }, [stakeValue, pricePerXToken, stakeMode]);

    const [stakeConfig, receiveConfig] = useMemo<[TokenConfig, TokenConfig]>(
        () => {
            const stepConfig = {
                tokenType: StepToken.STEP,
                icon: StepIcon,
                amount: stepAmount,
            };

            const xStepConfig = {
                tokenType: StepToken.xSTEP,
                icon: XStepIcon,
                amount: xStepAmount,
            };

            return stakeMode === StakeMode.unstake
                ? [xStepConfig, stepConfig]
                : [stepConfig, xStepConfig];
        },
        // stakeMode === StakeMode.unstake,
        [stakeMode, stepAmount, xStepAmount]
    );

    const tabs = useMemo(
        () =>
            Object.values(StakeMode).map((m) => (
                <div
                    key={m}
                    className={`tab-btn cursor-pointer flex-1 py-3 capitalize rounded-t-lg ${
                        stakeMode === m ? "selected bg-box" : "bg-box-dark"
                    }`}
                    onClick={() => setStakeMode(m)}
                >
                    {m}
                </div>
            )),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [stakeMode]
    );

    const buttonConfig = useMemo<{ text: string; disabled: boolean }>(() => {
        if (!stakeValue)
            return {
                text: "Enter an amount",
                disabled: true,
            };

        if (stakeValue > stakeConfig.amount) {
            return {
                text: `Insufficient ${stakeConfig.tokenType} balance`,
                disabled: true,
            };
        }

        return {
            text: stakeMode,
            disabled: false,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stakeValue, stakeConfig]);

    async function onStakeButtonClick() {
        if (
            !stakeValue ||
            !anchorWallet ||
            !stepTokenAccounts.STEP ||
            !stepTokenAccounts.xSTEP
        )
            return;

        setIsWaiting(true);
        showNotification({
            title: "Approve transactions from your wallet.",
            type: "info",
        });

        try {
            const value = getAmountFromDecimal(stakeValue, DECIMAL_PLACES);
            const signature =
                stakeMode === StakeMode.stake
                    ? await stake(value)
                    : await unstake(value);

            console.log(`${stakeMode} submitted`, signature);
            // showNotification({
            //     title: "You are staking STEP",
            //     description: "Confirmation in progress...",
            //     link: `https://solscan.io/tx/${signature}`,
            //     linkText: "View on solscan",
            //     type: "info",
            // });

            showNotification({
                title: `Staked ${stakeValue} ${stakeConfig.tokenType}`,
                description: `and received ${receiveValue} ${receiveConfig.tokenType}`,
                link: `https://solscan.io/tx/${signature}`,
                linkText: "View on solscan",
                type: "info",
            });
            await updateTokensAndPrices();
        } catch {
            showNotification({
                title: "You declined this transaction.",
                description:
                    "You declined this transaction in your wallet, or the transaction has timed out.",
                type: "info",
            });
        } finally {
            setIsWaiting(false);
        }
    }

    return (
        <div className="flex flex-col items-stretch">
            <div className="flex flex-col">
                <div className="tabs flex text-center">
                    {tabs}
                    <div className="flex-1"></div>
                </div>
                <div className="flex flex-col bg-box gap-4 p-5 items-stretch rounded-b-lg rounded-tr-lg">
                    <div className="flex-1 flex justify-between text-info">
                        <span className="text-white">You stake</span>
                        <span>Balance: {stakeConfig.amount}</span>
                    </div>
                    <div className="flex-1">
                        <StakeInput
                            tokenIcon={stakeConfig.icon}
                            tokenText={stakeConfig.tokenType}
                            value={stakeValue}
                            setValue={setStakeValue}
                        />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <Image src={ArrowDownIcon} alt="" />
                    </div>
                    <div className="flex-1 flex justify-between text-info">
                        <span className="text-white">You receive</span>
                        <span>Balance: {receiveConfig.amount}</span>
                    </div>
                    <div className="flex-1">
                        <StakeInput
                            tokenIcon={receiveConfig.icon}
                            tokenText={receiveConfig.tokenType}
                            value={receiveValue}
                        />
                    </div>
                </div>
            </div>
            <button
                className={`btn ${
                    !buttonConfig.disabled ? "btn-success capitalize" : ""
                } bg-box mt-5 p-3 text-base font-extrabold rounded-sm h-16`}
                disabled={buttonConfig.disabled || isWaiting}
                onClick={onStakeButtonClick}
            >
                <span>{buttonConfig.text}</span>
            </button>
        </div>
    );
}
