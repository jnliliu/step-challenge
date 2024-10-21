"use client";
import ArrowDownIcon from "@/app/assets/arrow-down.svg";
import StepIcon from "@/app/assets/step-logo.png";
import XStepIcon from "@/app/assets/xstep.svg";
import Image, { StaticImageData } from "next/image";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { StepToken } from "../api/types";
import { useAppWallet } from "../components/customWalletContext";
import { getAmount } from "../helpers/mathHelper";

export enum StakeMode {
    stake = "stake",
    unstake = "unstake",
}

interface IStakeInput {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tokenIcon: any;
    tokenText: string;
    valueStatue: [
        number | undefined,
        Dispatch<SetStateAction<number | undefined>>
    ];
}

function StakeInput({ tokenIcon, tokenText, valueStatue }: IStakeInput) {
    const [value, setValue] = valueStatue;
    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-black h-16 w-full">
            <div className="flex items-center font-bold">
                <Image src={tokenIcon} alt={tokenIcon} width={28} height={28} />
                <span>{tokenText}</span>
            </div>
            <input
                value={value}
                type="number"
                autoComplete="off"
                placeholder="0.00"
                className="input-number bg-transparent font-bold text-lg pl-3 text-white rounded-sm text-end"
                style={{
                    appearance: "textfield",
                }}
                onChange={(event) => setValue(parseFloat(event.target.value))}
            />
        </div>
    );
}

export type TokenConfig = {
    tokenType: StepToken;
    icon: StaticImageData;
    amount: number;
};

export default function StakeComponent() {
    const [stakeValue, setStakeValue] = useState<number>();
    const [receiveValue, setReceiveValue] = useState<number>();
    const [stakeMode, setStakeMode] = useState(StakeMode.stake);
    const { tokenAccounts } = useAppWallet();

    const stepAmount = useMemo(
        () =>
            tokenAccounts?.STEP?.amount
                ? getAmount(tokenAccounts.STEP.amount, 9)
                : 0,
        [tokenAccounts]
    );

    const xStepAmount = useMemo(
        () =>
            tokenAccounts?.xSTEP?.amount
                ? getAmount(tokenAccounts.xSTEP.amount, 9)
                : 0,
        [tokenAccounts]
    );

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
                            valueStatue={[stakeValue, setStakeValue]}
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
                            valueStatue={[receiveValue, setReceiveValue]}
                        />
                    </div>
                </div>
            </div>
            <button
                className={`${
                    !buttonConfig.disabled ? "btn-success capitalize" : ""
                } bg-box mt-5 p-3 text-base font-extrabold rounded-sm h-16`}
                disabled={buttonConfig.disabled}
            >
                <span>{buttonConfig.text}</span>
            </button>
        </div>
    );
}
