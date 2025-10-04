// src/store/useAuthStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cliente, Trabalhador } from '../types/api';

// Define um tipo unificado para o usuário, adicionando o papel (role)
type User = (Cliente | Trabalhador) & { role: 'cliente' | 'trabalhador' };

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // Nome da chave no localStorage
    }
  )
);