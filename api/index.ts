import { handleDates } from "@/utils/date";
import axios, { AxiosInstance } from "axios";

class _Api {
  private _instance: AxiosInstance;
  private _baseUrl: string;

  constructor(apiBaseUrl: string) {
    this._baseUrl = apiBaseUrl;

    this._instance = axios.create({
      timeout: 30000,
      baseURL: this._baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });

    this._instance.interceptors.response.use((response) => {
      return { ...response, data: handleDates(response.data) };
    });
  }

  public async teste() {
    try {
      const response = this._instance.get("/");
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

const Api = new _Api("https://invest-api-rose.vercel.app/");

export default Api;
