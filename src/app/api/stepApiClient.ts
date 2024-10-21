import { IMarket, IStepTokenMap, ITokensResponse, StepToken } from "./types";

export const STEP_API_BASE_URL = "https://api.step.finance/v1";

const fetchStepApi = <T = unknown>(endpoint: string, init: RequestInit) =>
    fetch(`${STEP_API_BASE_URL}${endpoint}`, init).then((res) => {
        if (!res.ok) throw new Error(res.statusText, { cause: res });

        return res.json() as Promise<T>;
    });

export const getStepTokens = async (
    cluster: string
): Promise<IStepTokenMap> => {
    const tokens = await fetchStepApi<ITokensResponse>(
        `/markets/tokens?cluster=${cluster}`,
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

export const getXStepMarket = (
    cluster: string,
    fundingStart: string
): Promise<IMarket> =>
    fetchStepApi<IMarket>(
        `/markets/xstep?cluster=${cluster}&funding_start=${fundingStart}`,
        {
            method: "GET",
        }
    );
