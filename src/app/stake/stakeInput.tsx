import Image from "next/image";
import { Dispatch, SetStateAction, useMemo } from "react";
import { DECIMAL_PLACES } from "../constants/keys";
import {
    formatCurrency,
    formattedCurrencyToNumber,
} from "../helpers/convertionHelpers";

export interface IStakeInputProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tokenIcon: any;
    tokenText: string;
    value: number;
    setValue?: Dispatch<SetStateAction<number>>;
}

export default function StakeInput({
    tokenIcon,
    tokenText,
    value,
    setValue,
}: IStakeInputProps) {
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
