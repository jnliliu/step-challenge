const YEAR_PERIODS = 365;

export const calculateAPYPercentage = (apr: number) => {
    // apr percentage to decimal
    const aprDecimal = apr / 100;

    const apy = Math.pow(1 + aprDecimal / YEAR_PERIODS, YEAR_PERIODS) - 1;
    const apyPercentage = apy * 100;

    return apyPercentage.toFixed(2) + "%";
};

export const getDecimalAmount = (bigIntValue: bigint, decimalPlaces: number) =>
    Number(bigIntValue) / Math.pow(10, decimalPlaces);

export const getAmountFromDecimal = (value: number, decimalPlaces: number) =>
    value * Math.pow(10, decimalPlaces);

export const formatCurrency = (
    amount: number,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
) =>
    new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(amount);

export const formattedCurrencyToNumber = (formattedValue: string) =>
    Number(formattedValue.replace(/,/g, ""));
