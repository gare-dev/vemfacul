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

  public async forgotPassword(email: string) {
    return await this._instance.post("/api/forgotpassword", {
      email,
    });
  }

  public async resetPassword(password: string, email: string) {
    return await this._instance.post("/api/resetpassword", {
      password, email
    });
  }
  public async editProfile(formData: any) {
    return await this._instance.post('/api/editprofile', formData, {
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

  public async insertPersonalLocalEvent(day: string, month: string, year: string, title: string, descricao: string, color: string, main_title: string, isImportant: boolean, hora: string) {
    return await this._instance.post("/api/insertpelocal", {
      day,
      month,
      year,
      title,
      descricao,
      color,
      main_title,
      isImportant,
      hora
    })
  }

  public async deletePersonalEvent(id: string) {
    return await this._instance.post("/api/deletepevents", {
      id_pevent: id,
    });
  }

  public async getUserProfile(username: string) {
    return await this._instance.post("/api/getuserprofile", {
      username,
    });
  }

  public async createPostagem(content: string) {
    return await this._instance.post("api/createPostagem", {
      content
    })
  }

  public async getPostagem(username: string) {
    return await this._instance.post(`/api/postagens/:${username}`)
  }
}

const Api = new _Api("https://invest-api-rose.vercel.app/"); //https://invest-api-rose.vercel.app/

export default Api;
