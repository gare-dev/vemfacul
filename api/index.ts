import { AcademicData, AddressData, FinancialData, InstitutionData, LoginData, MediaData } from "@/pages/cursinho/cadastro";
import { handleDates } from "@/utils/date";
import getAdminToken from "@/utils/getAdminToken";
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

    // this._instance.interceptors.request.use((config) => {
    //   // if (getAuth()) {
    //   //   if (config.headers) {
    //   //     config.headers['Authorization'] = `Bearer ${getAuth()}`;
    //   //   }
    //   // }
    //   // if (getAdminToken()) {
    //   //   if (config.headers) {
    //   //     config.headers['Admin-Token'] = getAdminToken();
    //   //   }
    //   // }
    //   return config;
    // });

    
  }
  public setCookie(cookie: string) {
    this._instance.defaults.headers.common['Cookie'] = cookie;
  }

  public async registerAccount(email: string, password: string) {

    return await this._instance.post("/user/email", {
      email,
      password,
    });
  }

  public async confirmAccount(token: string) {
    try {
      return await this._instance.patch('/user/auth/confirm', {
        token,
      });
    } catch (error) {
      console.error("Error confirming account:", error);
      throw error;
    }
  }

  public async loginAccount(email: string, password: string) {

    return await this._instance.post("/user/login", {
      email,
      password,
    });
  }

  public async createAccount(formData: any) {
    try {
      return await this._instance.post("/user/register", formData, {
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
      return await this._instance.post("/user/forgot-password/email", {
        email,
      });
    } catch (error) {
      console.error("Error in forgot password:", error);
      throw error;
    }

  }

  public async resetPassword(password: string, cryptrEmail: string) {
    try {
      return await this._instance.patch("/user/forgot-password", {
        password,
        cryptrEmail
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  }


  public async editProfile(formData: any) {

    try {
      return await this._instance.put('/user/profile/edit', formData, {
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
    return await this._instance.get('/events')
  }

  public async getPersonalEvents() {
    try {
      return await this._instance.get('/user/event')
    } catch (error) {
      console.error("Error fetching personal events:", error);
      throw error;
    }
  }

  public async insertPersonalEvent(day: number, month: number, year: number, title: string, cursinho: string, descricao: string, foto: string, link: string, type: string, color: string, main_title: string) {
    try {
      return await this._instance.post("/user/event", {
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
      throw error;
    }
  }

  public async insertPersonalLocalEvent(day: string, month: string, year: string, title: string, descricao: string, color: string, main_title: string, isImportant: boolean, hora: string) {
    try {
      return await this._instance.post("/user/local/event", {
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
      return await this._instance.delete(`/user/event/${id}`);
    } catch (error) {
      console.error("Error deleting personal event:", error);
      throw error;
    }
  }

  public async getUserProfile(username: string) {
    return await this._instance.get(`/user/${username}/profile`);

  }

  public async getProfileInfo() {
    try {
      return await this._instance.get("/user/profile/info");
    } catch (error) {
      console.error("Error fetching profile info:", error);
      throw error;
    }
  }

  public async validateProfile() {
    return await this._instance.get("/user/validate");
  }

  public async createPostagem(content: string) {
    return await this._instance.post("/user/post", {
      content
    })
  }
  public async createComentario(postagem_pai: string | number, content: string) {
    return await this._instance.post("/coment", {
      content,
      postagem_pai
    })
  }
  public async getPostagem(username: string) {
    return await this._instance.get(`/user/${username}/post`)
  }

  public async getSinglePostagem(id_postagem: string | number) {
    return await this._instance.get(`/post/${id_postagem}`)
  }

  public async getComentarios(id_pai: string | number) {
    return await this._instance.get(`/post/coment/${id_pai}`)
  }

  public async likePostagem(id_postagem: number | string) {
    return await this._instance.patch('/user/post/like', {
      id_postagem
    });
  }

  public async unLinkePostagem(id_postagem: number | string) {
    return await this._instance.patch('/user/post/unlike', { id_postagem });
  }

  public async getLikesCount(id_postagem: number | string) {
    return await this._instance.get(`/user/post/${id_postagem}/like`)
  }

  public async selectAllPosts() {
    return await this._instance.get('/post')
  }

  public async getNotificationsNull() {
    return await this._instance.get("/notifications")
  }

  public async insertCursinho(formData: any) {
    return await this._instance.post('/course', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
  }

  public async loginAdmin(username: string, password: string) {
    return await this._instance.post('/admin/login', {
      username,
      password
    });
  }

  public async adminAuth() {
    return await this._instance.get('/admin/auth');
  }

  public async selectAproveList() {
    return await this._instance.get('/admin/course/approve')
  }

  public async approveCursinho(id: string) {
    return await this._instance.patch(`/admin/course/${id}/approve`)
  }


  public async questoes(year: number, offset: number) {
    return await this._instance.get(`https://api.enem.dev/v1/exams/${year}/questions?limit=9&offset=${offset}`, {
      withCredentials: false
    })
  }

  public async getCursinho() {
    return await this._instance.get('/courses')
  }

  public async getCursinhoById(id_course: string) {
    return await this._instance.get(`/course/${id_course}`);
  }

  public async insertReview(id_cursinho: string, stars: number, content: string) {
    return await this._instance.post("/course/review", {
      id_cursinho,
      stars,
      content
    });
  }

  public async tokenTeste() {
    return await this._instance.get('/token/teste');
  }

  public async removeAuthToken() {
    return await this._instance.delete('/user/auth');
  }

  public async getBestCourses() {
    return await this._instance.get("/course/bests")
  }
  public async insertQuestion(index: number, year: number, id_disciplines: number, isCorret: boolean) {
    return await this._instance.post("/exercicios/questoes/usuario", {
      index,
      year,
      id_disciplines,
      isCorret
    })
  }
  public async getRankingUsers() {
    return await this._instance.get("/exercicios/questoes/ranking")
  }

  public async setPersonalEventImportant(id_pevent: string) {
    return await this._instance.patch(`/user/event/important/${id_pevent}`)
  }

  public async setPersonalEventDone(id_pevent: string) {
    return await this._instance.patch(`/user/event/done/${id_pevent}`)
  }

  public async getAdminUsers() {
    return await this._instance.get("/admin/users")
  }

  public async setAdminUserVerify(value: boolean, id_user: string) {
    return await this._instance.patch("/admin/users/verify", {
      value,
      id_user
    })
  }

  public async setAdminUserRole(id_user: string, role: string) {
    return await this._instance.patch("/admin/users/role", {
      id_user,
      role,
    })
  }
  public async getAdminLogs() {
    return await this._instance.get("/admin/api/log")
  }

  public async insertAdminCourseEvent(title: string, descricao: string, link: string, type: string, main_title: string, hora: string, day: string, month: string, year: string) {
    return await this._instance.post("/course/admin/event", {
      day,
      month,
      year,
      title,
      descricao,
      link,
      type,
      main_title,
      hora
    })
  }

  public async deleteCursinhoEvent(id_event: string) {
    return await this._instance.delete(`/user/event/${id_event}`)
  }

  public async editPersonalEvent(id_pevent: string, title: string, descricao: string, hora: string) {
    return await this._instance.patch(`/user/event/${id_pevent}`, {
      title,
      descricao,
      hora
    }
    )
  }

  public async getCourseEventById(id_cursinho: string) {
    return await this._instance.get(`/course/event/${id_cursinho}`)
  }

  public async getUsersSearchBar(nome: string) {
    return await this._instance.get(`/page/search/${nome}`)
  }

  public async getTop10Users(mode: string) {
    return await this._instance.get(`/exercicios/questoes/ranking/${mode}`)
  }
  public async getNotifications(mode: string) {
    return await this._instance.get(`/notifications/${mode}`)
  }

  public async insertEssay(essay: string, theme: string, title: string) {
    return await this._instance.post("/user/essay", {
      essay,
      theme,
      title
    })
  }

  public async userEssays() {
    return await this._instance.get("/user/essay", {
      timeout: 120000
    })
  }

  public async getUsernameLists(username: string) {
    return await this._instance.get(`/user/username/${username}`)
  }

  public async deletePost(id_postagem: string | number) {
    return await this._instance.delete(`/user/post/${id_postagem}`)
  }

  public async reportPost(id_post: string) {
    return await this._instance.post('/user/post/report', {
      id_post
    })
  }
}

const Api = new _Api(process.env.NEXT_PUBLIC_API_URL ?? "");



export default Api;
