const YEAR_PERIODS = 365;

export const calculateAPYPercentage = (apr: number) => {
    // apr percentage to decimal
    const aprDecimal = apr / 100;

    const apy = Math.pow(1 + aprDecimal / YEAR_PERIODS, YEAR_PERIODS) - 1;
    const apyPercentage = apy * 100;

    return apyPercentage.toFixed(2) + "%";
};

export const getAmount = (bigIntValue: bigint, decimalPlaces: number) =>
    Number(bigIntValue) / Math.pow(10, decimalPlaces);

export const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
