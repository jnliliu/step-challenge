"use client";
import ArrowDownIcon from "@/app/assets/arrow-down.svg";
import Image from "next/image";
export type StakeMode = "stake" | "unstake";

export default function StakeComponent({ mode }: { mode: StakeMode }) {
    return (
        <div className="flex flex-col items-stretch">
            <div className="flex flex-col">
                <div className="tabs flex text-center">
                    <div
                        className={`tab-btn flex-1 bg-box py-3 ${
                            mode === "stake" ? "selected" : ""
                        }`}
                    >
                        Stake
                    </div>
                    <div
                        className={`tab-btn flex-1 bg-box py-3 ${
                            mode === "unstake" ? "selected" : ""
                        }`}
                    >
                        Unstake
                    </div>
                    <div className="flex-1"></div>
                </div>
                <div className="flex flex-col bg-box gap-4 p-5 items-center">
                    <div className="flex-1 flex justify-between">
                        <span>You stake</span>
                        <span>Balance: 0</span>
                    </div>
                    <div className="flex-1">
                        <input type="number" step={0.01} />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <Image src={ArrowDownIcon} alt="" />
                    </div>
                    <div className="flex-1 flex justify-between">
                        <span>You receive</span>
                        <span>Balance: 0</span>
                    </div>
                    <div className="flex-1">
                        <input type="number" step={0.01} />
                    </div>
                </div>
            </div>
            <button className="bg-box mt-5 p-3 text-base font-extrabold">
                <span>Insufficient STEP balance</span>
            </button>
        </div>
    );
}
