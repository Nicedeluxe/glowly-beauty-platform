'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'CLIENT' | 'MASTER'>('CLIENT');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'CLIENT' as 'CLIENT' | 'MASTER'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { login, register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setError('Будь ласка, заповніть всі поля');
      return;
    }

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password, userType);
        if (success) {
          setSuccess('Успішний вхід!');
          setTimeout(() => {
            if (userType === 'MASTER') {
              router.push('/master-dashboard');
            } else {
              router.push('/dashboard');
            }
          }, 1000);
        } else {
          setError('Невірний email, пароль або тип користувача');
        }
      } else {
        const success = await register(formData.name, formData.email, formData.password, userType);
        if (success) {
          setSuccess('Реєстрація успішна! Ви увійшли в систему.');
          setTimeout(() => {
            if (userType === 'MASTER') {
              router.push('/master-dashboard');
            } else {
              router.push('/dashboard');
            }
          }, 1000);
        } else {
          setError('Користувач з таким email вже існує');
        }
      }
    } catch {
      setError('Сталася помилка. Спробуйте ще раз.');
    }
  };

  const handleTestLogin = async (email: string, password: string, type: 'CLIENT' | 'MASTER') => {
    setFormData({ name: '', email, password, userType: type });
    const mockEvent = {
      preventDefault: () => {},
      currentTarget: {} as HTMLFormElement
    } as React.FormEvent<HTMLFormElement>;
    await handleSubmit(mockEvent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FF6B6B] rounded-3xl mb-4 shadow-2xl">
            <svg className="w-12 h-12 text-white" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 10L61.8 38.2L90 50L61.8 61.8L50 90L38.2 61.8L10 50L38.2 38.2L50 10Z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
            Glowly
          </h1>
          <p className="text-white/90 font-medium">
            {isLogin ? 'Увійдіть в свій акаунт' : 'Створіть новий акаунт'}
          </p>
        </div>

        {/* Auth form */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          {/* Toggle buttons */}
          <div className="flex mb-6 bg-white/10 rounded-xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                isLogin ? 'bg-white text-purple-700' : 'text-white/80'
              }`}
            >
              Увійти
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                !isLogin ? 'bg-white text-purple-700' : 'text-white/80'
              }`}
            >
              Реєстрація
            </button>
          </div>

          {/* Test Login Buttons */}
          <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
            <p className="text-yellow-200 text-sm mb-3 font-medium">✨ Тестові кнопки для швидкого входу:</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={async () => {
                  setUserType('CLIENT');
                  setIsLogin(true);
                  setFormData({...formData, email: 'anna@example.com', password: 'password123'});
                  // Simulate form submission
                  const success = await login('anna@example.com', 'password123', 'CLIENT');
                  if (success) {
                    router.push('/dashboard');
                  }
                }}
                className="flex-1 px-3 py-2 bg-white/20 text-white text-sm rounded-lg hover:bg-white/30 transition-colors"
              >
                💫 Клієнт (Анна)
              </button>
              <button
                type="button"
                onClick={async () => {
                  setUserType('MASTER');
                  setIsLogin(true);
                  setFormData({...formData, email: 'maria@example.com', password: 'password123'});
                  // Simulate form submission
                  const success = await login('maria@example.com', 'password123', 'MASTER');
                  if (success) {
                    router.push('/master-dashboard');
                  }
                }}
                className="flex-1 px-3 py-2 bg-white/20 text-white text-sm rounded-lg hover:bg-white/30 transition-colors"
              >
                🦋 Майстер (Марія)
              </button>
            </div>
          </div>

          {/* User type selection */}
          <div className="mb-6">
            <p className="text-white/80 text-sm mb-3">Я:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUserType('CLIENT')}
                className={`p-4 rounded-xl border transition-colors ${
                  userType === 'CLIENT'
                    ? 'bg-white/20 border-white/40 text-white'
                    : 'bg-white/10 border-white/20 text-white/80'
                }`}
              >
                <div className="text-2xl mb-2">💫</div>
                <div className="font-medium">Клієнт</div>
                <div className="text-xs opacity-80">Шукаю майстрів</div>
              </button>
              <button
                onClick={() => setUserType('MASTER')}
                className={`p-4 rounded-xl border transition-colors ${
                  userType === 'MASTER'
                    ? 'bg-white/20 border-white/40 text-white'
                    : 'bg-white/10 border-white/20 text-white/80'
                }`}
              >
                <div className="text-2xl mb-2">💅</div>
                <div className="font-medium">Майстер</div>
                <div className="text-xs opacity-80">Надаю послуги</div>
              </button>
            </div>
          </div>

          {/* Error/Success messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-200 text-sm">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <input
                  type="text"
                  placeholder="Ім'я"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            )}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-white text-purple-700 font-semibold rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Завантаження...' : (isLogin ? 'Увійти' : 'Зареєструватися')}
            </button>
          </form>

          {/* Test login buttons */}
          <div className="mt-6 space-y-3">
            <div className="text-center">
              <p className="text-white/60 text-sm mb-3">Тестові аккаунти:</p>
            </div>
            
            <button
              onClick={() => handleTestLogin('anna@example.com', 'password123', 'CLIENT')}
              className="w-full py-3 bg-yellow-400 text-purple-900 font-semibold rounded-xl hover:bg-yellow-300 transition-colors flex items-center justify-center space-x-2"
            >
              <span>👤</span>
              <span>Клієнт (Анна)</span>
            </button>
            
            <button
              onClick={() => handleTestLogin('maria@example.com', 'password123', 'MASTER')}
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>💄</span>
              <span>Майстер (Марія)</span>
            </button>
            
            <button
              onClick={() => handleTestLogin('admin@glowly.com', 'admin123', 'CLIENT')}
              className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>👑</span>
              <span>Адміністратор</span>
            </button>
          </div>

          {/* Social login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-white/80">або</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

