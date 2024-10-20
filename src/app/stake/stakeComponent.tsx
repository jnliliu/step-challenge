"use client";
import ArrowDownIcon from "@/app/assets/arrow-down.svg";
import StepIcon from "@/app/assets/step-logo.png";
import Image from "next/image";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
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
                <Image src={tokenIcon} alt={tokenIcon} />
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

export default function StakeComponent({ mode }: { mode: StakeMode }) {
    const [stakeValue, setStakeValue] = useState<number>();
    const [receiveValue, setReceiveValue] = useState<number>();

    // const onTabClick = useCallback(
    //     (tab: StakeMode) =>
    //         router.replace(`/${tab}`, undefined, { shallow: true }),
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     []
    // );

    const tabs = useMemo(
        () =>
            Object.values(StakeMode).map((m) => (
                <div
                    key={m}
                    className={`tab-btn flex-1 py-3 capitalize rounded-t-lg ${
                        mode === m ? "selected bg-box" : "bg-box-dark"
                    }`}
                    // onClick={() => onTabClick(m)}
                >
                    {m}
                </div>
            )),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [mode]
    );

    return (
        <div className="flex flex-col items-stretch">
            <div className="flex flex-col">
                <div className="tabs flex text-center">
                    {tabs}
                    <div className="flex-1"></div>
                </div>
                <div className="flex flex-col bg-box gap-4 p-5 items-stretch rounded-b-lg rounded-tr-lg">
                    <div className="flex-1 flex justify-between">
                        <span>You stake</span>
                        <span>Balance: 0</span>
                    </div>
                    <div className="flex-1">
                        <StakeInput
                            tokenIcon={StepIcon}
                            tokenText="STEP"
                            valueStatue={[stakeValue, setStakeValue]}
                        />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <Image src={ArrowDownIcon} alt="" />
                    </div>
                    <div className="flex-1 flex justify-between">
                        <span>You receive</span>
                        <span>Balance: 0</span>
                    </div>
                    <div className="flex-1">
                        <StakeInput
                            tokenIcon={StepIcon}
                            tokenText="xSTEP"
                            valueStatue={[receiveValue, setReceiveValue]}
                        />
                    </div>
                </div>
            </div>
            <button className="bg-box mt-5 p-3 text-base font-extrabold rounded-sm h-16">
                <span>Enter an amount</span>
            </button>
        </div>
    );
}
