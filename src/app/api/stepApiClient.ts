import { STEP_API_BASE_URL } from "../constants/urls";
import {
    IMarket,
    IStepTokenMap,
    ITokenPrices,
    ITokensResponse,
    StepToken,
} from "./types";

const fetchStepApi = <T = unknown>(endpoint: string, init: RequestInit) =>
    fetch(`${STEP_API_BASE_URL}${endpoint}`, init).then((res) => {
        if (!res.ok) throw new Error(res.statusText, { cause: res });

        return res.json() as Promise<T>;
    });

export const getPrices = (cluster: string) =>
    fetchStepApi<ITokenPrices>(`/v2/markets/prices?cluster=${cluster}`, {
        method: "GET",
    });

export const getStepTokens = async (
    cluster: string
): Promise<IStepTokenMap> => {
    const tokens = await fetchStepApi<ITokensResponse>(
        `/v1/markets/tokens?cluster=${cluster}`,
        {
            method: "GET",
        }
    );

    const getTokenData = (token: StepToken) =>
        tokens.tokenMap[tokens.tokenSymbolMap[token]];

    return {
        [StepToken.STEP]: getTokenData(StepToken.STEP),
        [StepToken.xSTEP]: getTokenData(StepToken.xSTEP),
    };
};

export const getXStepMarket = (cluster: string): Promise<IMarket> =>
    fetchStepApi<IMarket>(
        `/v1/markets/xstep?cluster=${cluster}&funding_start="2021-10-14"`,
        {
            method: "GET",
        }
    );
