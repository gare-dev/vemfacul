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

  public async registerAccount(email: string, password: string) {
    return await this._instance.post("/api/createaccount", {
      email,
      password,
    });
  }

  public async confirmAccount(token: string) {
    return await this._instance.post('/api/confirmaccount', {
      token,
    })
  }

  public async loginAccount(email: string, password: string) {
    return await this._instance.post("/api/loginaccount", {
      email,
      password,
    });
  }

  public async createAccount(formData: any) {
    console.log(formData)
    return await this._instance.post("/api/registeraccount", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
  }
}

const Api = new _Api("http://localhost:3001/"); //https://invest-api-rose.vercel.app/

export default Api;
