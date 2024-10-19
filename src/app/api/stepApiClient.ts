import { IMarket } from "./types";

export const STEP_API_BASE_URL = "https://api.step.finance/v1";

const fetchStepApi = <T = unknown>(endpoint: string, init: RequestInit) =>
    fetch(`${STEP_API_BASE_URL}${endpoint}`, init).then((res) => {
        if (!res.ok) throw new Error(res.statusText, { cause: res });

        return res.json() as Promise<T>;
    });

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
