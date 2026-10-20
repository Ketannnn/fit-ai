import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { API_BASE, STREAMLIT_URL } from '../config';

export { API_BASE, STREAMLIT_URL };

export interface UserProfile {
  username: string;
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  fitness_goal: string;
  activity_level: string;
  injuries: string;
  workout_days: number;
}

export interface BmiHistoryPoint {
  height_cm: number;
  weight_kg: number;
  bmi: number;
  recorded_at: string;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  updateStats: (height_cm: number, weight_kg: number) => Promise<void>;
  getBmiHistory: () => Promise<BmiHistoryPoint[]>;
  logout: () => void;
  isLoading: boolean;
}

export interface SignupData {
  username: string;
  password: string;
  age: number;
  gender: string;
  height_cm: number;
  weight_kg: number;
  fitness_goal: string;
  activity_level: string;
  injuries: string;
  workout_days: number;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('fitai_username');
    if (storedUsername) {
      axios.get<UserProfile>(`${API_BASE}/profile/${storedUsername}`)
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('fitai_username'))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await axios.post<{ success: boolean; profile: UserProfile }>(
      `${API_BASE}/login`,
      { username, password }
    );
    localStorage.setItem('fitai_username', res.data.profile.username);
    setUser(res.data.profile);
  };

  const signup = async (data: SignupData) => {
    const res = await axios.post<{ success: boolean; profile: UserProfile }>(
      `${API_BASE}/signup`,
      data
    );
    localStorage.setItem('fitai_username', res.data.profile.username);
    setUser(res.data.profile);
  };

  const updateStats = async (height_cm: number, weight_kg: number) => {
    if (!user) return;
    const res = await axios.post<{ success: boolean; profile: UserProfile }>(
      `${API_BASE}/update-stats`,
      { username: user.username, height_cm, weight_kg }
    );
    setUser(res.data.profile);
  };

  const getBmiHistory = async () => {
    if (!user) return [];
    const res = await axios.get<BmiHistoryPoint[]>(
      `${API_BASE}/bmi-history/${user.username}`
    );
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('fitai_username');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, updateStats, getBmiHistory, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
