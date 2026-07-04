import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

function isAxiosFailure(err: unknown): err is AxiosError {
  return err instanceof AxiosError;
}

async function call(config: AxiosRequestConfig): Promise<AxiosResponse> {
  return axios.request(config);
}
