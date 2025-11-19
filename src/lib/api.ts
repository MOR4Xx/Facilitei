import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080/api', // URL base do seu Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para tratamento de erros global (Opcional mas recomendado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na requisição API:", error);
    return Promise.reject(error);
  }
);