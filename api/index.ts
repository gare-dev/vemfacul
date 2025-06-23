import { handleDates } from "@/utils/date";
import getAuth from "@/utils/getAuth";
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

    this._instance.interceptors.request.use((config) => {
      if (getAuth()) {
        if (config.headers) {
          config.headers['Authorization'] = `Bearer ${getAuth()}`;
        }
      }
      return config;
    });

  }


  public async registerAccount(email: string, password: string) {
    try {
      return await this._instance.post("/api/createaccount", {
        email,
        password,
      });
    } catch (error) {
      console.error("Error registering account:", error);
      throw error;
    }
  }

  public async confirmAccount(token: string) {
    try {
      return await this._instance.post('/api/confirmaccount', {
        token,
      });
    } catch (error) {
      console.error("Error confirming account:", error);
      throw error;
    }
  }

  public async loginAccount(email: string, password: string) {

    return await this._instance.post("/api/loginaccount", {
      email,
      password,
    });

  }

  public async createAccount(formData: any) {
    try {
      return await this._instance.post("/api/registeraccount", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  }

  public async forgotPassword(email: string) {
    try {
      return await this._instance.post("/api/forgotpassword", {
        email,
      });
    } catch (error) {
      console.error("Error in forgot password:", error);
      throw error;
    }

  }

  public async resetPassword(password: string, email: string) {
    try {
      return await this._instance.post("/api/resetpassword", {
        password,
        email
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  }


  public async editProfile(formData: any) {

    try {
      return await this._instance.post('/api/editprofile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
    } catch (error) {
      console.error("Error editing profile:", error);
      throw error;
    }
  }

  public async getEvents() {
    try {
      return await this._instance.post('/api/getevents')
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  }

  public async getPersonalEvents() {
    try {
      return await this._instance.post('/api/getpevents')
    } catch (error) {
      console.error("Error fetching personal events:", error);
      throw error;
    }
  }

  public async insertPersonalEvent(day: number, month: number, year: number, title: string, cursinho: string, descricao: string, foto: string, link: string, type: string, color: string, main_title: string) {
    try {
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
    } catch (error) {
      console.error("Error inserting personal event:", error);
      throw error; // Re-throw the error to handle it in the calling function
    }
  }

  public async insertPersonalLocalEvent(day: string, month: string, year: string, title: string, descricao: string, color: string, main_title: string, isImportant: boolean, hora: string) {
    try {
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
    } catch (error) {
      console.error("Error inserting personal local event:", error);
      throw error;
    }
  }

  public async deletePersonalEvent(id: string) {
    try {
      return await this._instance.post("/api/deletepevents", {
        id_pevent: id,
      });
    } catch (error) {
      console.error("Error deleting personal event:", error);
      throw error;
    }
  }

  public async getUserProfile(username: string) {
    return await this._instance.post("/api/getuserprofile", {
      username,
    });

  }

  public async getProfileInfo() {
    try {
      return await this._instance.post("/api/getprofileinfo");
    } catch (error) {
      console.error("Error fetching profile info:", error);
      throw error;
    }
  }

  public async validateProfile() {
    try {
      return await this._instance.post("/api/validateprofile");
    } catch (error) {
      console.error("Error validating profile:", error);
      throw error;
    }
  }

  public async createPostagem(content: string) {
    return await this._instance.post("api/createPostagem", {
      content
    })
  }

  public async getPostagem(username: string) {
    return await this._instance.post(`/api/postagens/${username}`)
  }

  public async getLikesCount(id_postagem: number | string) {
    return await this._instance.post('/api/likePostagem/countlikes', {
      id_postagem
    })
  }
}

const Api = new _Api("http://localhost:3001"); //https://invest-api-rose.vercel.app/

export default Api;
