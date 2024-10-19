const YEAR_PERIODS = 365;

export const calculateAPYPercentage = (apr: number) => {
    // apr percentage to decimal
    const aprDecimal = apr / 100;

    const apy = Math.pow(1 + aprDecimal / YEAR_PERIODS, YEAR_PERIODS) - 1;
    const apyPercentage = apy * 100;

    return apyPercentage.toFixed(2) + "%";
};
