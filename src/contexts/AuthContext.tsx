'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'CLIENT' | 'MASTER';
  avatar?: string;
  phone?: string;
  birthDate?: string;
  masterInfo?: {
    salonName?: string;
    services: string[];
    workSchedule: Record<string, { isWorking: boolean; startTime: string; endTime: string }>;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, type: 'CLIENT' | 'MASTER') => Promise<boolean>;
  register: (name: string, email: string, password: string, type: 'CLIENT' | 'MASTER') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for testing
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Анна Коваленко',
    email: 'anna@example.com',
    password: 'password123',
    type: 'CLIENT',
    avatar: '',
    phone: '+380 67 123 45 67',
    birthDate: '1990-05-15'
  },
  {
    id: '2',
    name: 'Марія Петренко',
    email: 'maria@example.com',
    password: 'password123',
    type: 'MASTER',
    avatar: '',
    phone: '+380 67 234 56 78',
    masterInfo: {
      salonName: 'Салон краси "Glowly"',
      services: ['Манікюр', 'Педікюр', 'Дизайн нігтів'],
      workSchedule: {
        'Понеділок': { isWorking: true, startTime: '09:00', endTime: '18:00' },
        'Вівторок': { isWorking: true, startTime: '09:00', endTime: '18:00' },
        'Середа': { isWorking: true, startTime: '09:00', endTime: '18:00' },
        'Четвер': { isWorking: true, startTime: '09:00', endTime: '18:00' },
        'П\'ятниця': { isWorking: true, startTime: '09:00', endTime: '18:00' },
        'Субота': { isWorking: true, startTime: '10:00', endTime: '16:00' },
        'Неділя': { isWorking: false, startTime: '09:00', endTime: '18:00' }
      }
    }
  },
  {
    id: '3',
    name: 'Олександр Іваненко',
    email: 'alex@example.com',
    password: 'password123',
    type: 'CLIENT',
    avatar: '',
    phone: '+380 67 345 67 89',
    birthDate: '1985-12-03'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('glowly_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, type: 'CLIENT' | 'MASTER'): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(u => 
      u.email === email && u.password === password && u.type === type
    );
    
    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        type: foundUser.type,
        avatar: foundUser.avatar,
        phone: foundUser.phone,
        birthDate: foundUser.birthDate,
        masterInfo: foundUser.masterInfo
      };
      
      setUser(userData);
      localStorage.setItem('glowly_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, password: string, type: 'CLIENT' | 'MASTER'): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      type,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };
    
    setUser(newUser);
    localStorage.setItem('glowly_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('glowly_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
