import axios from 'axios';

// Cria a instância do Axios
export const api = axios.create({
  baseURL: 'http://api-facilitei:8080/api', // URL do seu Backend Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para tratamento de erros global (logs)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na requisição API:", error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

// Helpers para requisições mais limpas nos componentes
export const get = <T>(url: string, params?: any) => 
  api.get<T>(url, { params }).then(res => res.data);

export const post = <T>(url: string, body: any) => 
  api.post<T>(url, body).then(res => res.data);

export const put = <T>(url: string, body: any) => 
  api.put<T>(url, body).then(res => res.data);

export const patch = <T>(url: string, body: any) => 
  api.patch<T>(url, body).then(res => res.data);

export const del = <T>(url: string) => 
  api.delete<T>(url).then(res => res.data);

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  // 'file' deve ser igual ao @RequestParam("file") do seu Java Controller
  formData.append('file', file); 

  const response = await api.post<{ url: string }>('/arquivos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.url;
};
