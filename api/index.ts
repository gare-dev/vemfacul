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
      withCredentials: true,
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
    return await this._instance.post("/api/registeraccount", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
  }

  public async getEvents() {
    return await this._instance.post('/api/getevents')
  }

  public async getPersonalEvents() {
    return await this._instance.post('/api/getpevents')
  }

  public async insertPersonalEvent(day: number, month: number, year: number, title: string, cursinho: string, descricao: string, foto: string, link: string, type: string, color: string, main_title: string) {
    return await this._instance.post("/api/insertpevennts", {
      day,
      month,
      year,
      title,
      cursinho,
      descricao,
      foto,
      link,
      type,
      color,
      main_title
    })
  }
}

const Api = new _Api("http://localhost:3001/"); //https://invest-api-rose.vercel.app/

export default Api;
