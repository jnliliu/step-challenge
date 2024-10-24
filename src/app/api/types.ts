export enum StepToken {
    STEP = "STEP",
    xSTEP = "xSTEP",
}

export interface IMarket {
    apr: number;
    price: number;
    stepPerXStep: number;
    totalStepStaked: number;
    tvl: number;
}

export interface IToken {
    chainId: number;
    address: string;
    name: string;
    decimals: number;
    symbol: string;
    logoURI: string;
    tags: Array<string>;
}

export interface ITokenMap {
    [key: string]: IToken;
}

export type IStepTokenMap = {
    [key in StepToken]: IToken;
};

export interface ITokensResponse {
    tokenMap: ITokenMap;
    tokenSymbolMap: { [key: string]: string };
}

export interface ITokenPrice {
    address: string;
    price: number;
    change24h: number;
}

export interface ITokenPrices {
    [key: string]: ITokenPrice;
}
