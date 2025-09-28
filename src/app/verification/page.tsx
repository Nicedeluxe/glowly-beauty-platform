'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface VerificationDocuments {
  id: string;
  passport: File | null;
  diploma: File | null;
  certificates: File[];
  portfolio: File[];
  businessLicense: File | null;
  insurance: File | null;
}

export default function VerificationPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [documents, setDocuments] = useState<VerificationDocuments>({
    id: user?.id || '',
    passport: null,
    diploma: null,
    certificates: [],
    portfolio: [],
    businessLicense: null,
    insurance: null
  });

  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: 'uploading' | 'success' | 'error' }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Перенаправляем если не мастер
  if (!user || user.userType !== 'MASTER') {
    router.push('/');
    return null;
  }

  const handleFileUpload = (field: keyof VerificationDocuments, file: File | null) => {
    setDocuments(prev => ({
      ...prev,
      [field]: file
    }));
    
    if (file) {
      setUploadStatus(prev => ({
        ...prev,
        [field]: 'uploading'
      }));
      
      // Симуляция загрузки
      setTimeout(() => {
        setUploadStatus(prev => ({
          ...prev,
          [field]: 'success'
        }));
      }, 1000);
    }
  };

  const handleMultipleFileUpload = (field: 'certificates' | 'portfolio', files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    setDocuments(prev => ({
      ...prev,
      [field]: [...prev[field], ...fileArray]
    }));
    
    setUploadStatus(prev => ({
      ...prev,
      [field]: 'uploading'
    }));
    
    // Симуляция загрузки
    setTimeout(() => {
      setUploadStatus(prev => ({
        ...prev,
        [field]: 'success'
      }));
    }, 1000);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Проверяем обязательные документы
    const requiredFields: (keyof VerificationDocuments)[] = ['passport', 'diploma'];
    const missingFields = requiredFields.filter(field => !documents[field]);
    
    if (missingFields.length > 0) {
      alert('Пожалуйста, загрузите все обязательные документы');
      setIsSubmitting(false);
      return;
    }
    
    // Симуляция отправки
    setTimeout(() => {
      alert('Документы успешно отправлены на верификацию! Ожидайте проверки в течение 1-3 рабочих дней.');
      setIsSubmitting(false);
      router.push('/master-dashboard');
    }, 2000);
  };

  const getUploadStatusIcon = (field: string) => {
    const status = uploadStatus[field];
    switch (status) {
      case 'uploading':
        return '⏳';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '📄';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
      {/* Header */}
      <header className="bg-purple-900/50 backdrop-blur-sm border-b border-purple-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#FF6B6B] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50 10L61.8 38.2L90 50L61.8 61.8L50 90L38.2 61.8L10 50L38.2 38.2L50 10Z" />
                </svg>
              </div>
              <span className="text-white text-xl font-bold">Glowly</span>
            </Link>
            
            <Link href="/master-dashboard" className="bg-yellow-400 text-purple-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors">
              Особистий кабінет
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Верифікація майстра
            </h1>
            <p className="text-purple-200 text-lg">
              Завантажте документи для підтвердження вашої кваліфікації
            </p>
          </div>

          {/* Verification Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span className="ml-2 text-white text-sm">Завантаження</span>
              </div>
              <div className="w-8 h-0.5 bg-white/30"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 text-white/60 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="ml-2 text-white/60 text-sm">Перевірка</span>
              </div>
              <div className="w-8 h-0.5 bg-white/30"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 text-white/60 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="ml-2 text-white/60 text-sm">Підтвердження</span>
              </div>
            </div>
          </div>

          {/* Documents Upload */}
          <div className="space-y-6">
            {/* Passport */}
            <div className="bg-white/5 rounded-lg p-4">
              <label className="block text-white font-semibold mb-2">
                📄 Паспорт або ID-карта <span className="text-red-400">*</span>
              </label>
              <p className="text-purple-200 text-sm mb-3">
                Завантажте фото паспорта або ID-карти для підтвердження особи
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('passport', e.target.files?.[0] || null)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-purple-900 file:bg-white file:font-medium"
              />
              {documents.passport && (
                <div className="mt-2 flex items-center text-green-400">
                  <span className="mr-2">{getUploadStatusIcon('passport')}</span>
                  <span className="text-sm">{documents.passport.name}</span>
                </div>
              )}
            </div>

            {/* Diploma */}
            <div className="bg-white/5 rounded-lg p-4">
              <label className="block text-white font-semibold mb-2">
                🎓 Диплом або сертифікат <span className="text-red-400">*</span>
              </label>
              <p className="text-purple-200 text-sm mb-3">
                Завантажте диплом про освіту або сертифікат про проходження курсів
              </p>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload('diploma', e.target.files?.[0] || null)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-purple-900 file:bg-white file:font-medium"
              />
              {documents.diploma && (
                <div className="mt-2 flex items-center text-green-400">
                  <span className="mr-2">{getUploadStatusIcon('diploma')}</span>
                  <span className="text-sm">{documents.diploma.name}</span>
                </div>
              )}
            </div>

            {/* Certificates */}
            <div className="bg-white/5 rounded-lg p-4">
              <label className="block text-white font-semibold mb-2">
                🏆 Додаткові сертифікати
              </label>
              <p className="text-purple-200 text-sm mb-3">
                Завантажте додаткові сертифікати та нагороди (до 5 файлів)
              </p>
              <input
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={(e) => handleMultipleFileUpload('certificates', e.target.files)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-purple-900 file:bg-white file:font-medium"
              />
              {documents.certificates.length > 0 && (
                <div className="mt-2">
                  {documents.certificates.map((file, index) => (
                    <div key={index} className="flex items-center text-green-400 mb-1">
                      <span className="mr-2">{getUploadStatusIcon('certificates')}</span>
                      <span className="text-sm">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Portfolio */}
            <div className="bg-white/5 rounded-lg p-4">
              <label className="block text-white font-semibold mb-2">
                🎨 Портфоліо робіт
              </label>
              <p className="text-purple-200 text-sm mb-3">
                Завантажте фото ваших робіт для демонстрації навичок (до 10 файлів)
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleMultipleFileUpload('portfolio', e.target.files)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-purple-900 file:bg-white file:font-medium"
              />
              {documents.portfolio.length > 0 && (
                <div className="mt-2">
                  {documents.portfolio.map((file, index) => (
                    <div key={index} className="flex items-center text-green-400 mb-1">
                      <span className="mr-2">{getUploadStatusIcon('portfolio')}</span>
                      <span className="text-sm">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Business License */}
            <div className="bg-white/5 rounded-lg p-4">
              <label className="block text-white font-semibold mb-2">
                🏢 Свідоцтво про реєстрацію ФОП/ТОВ
              </label>
              <p className="text-purple-200 text-sm mb-3">
                Завантажте документи про реєстрацію бізнесу (якщо є)
              </p>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload('businessLicense', e.target.files?.[0] || null)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-purple-900 file:bg-white file:font-medium"
              />
              {documents.businessLicense && (
                <div className="mt-2 flex items-center text-green-400">
                  <span className="mr-2">{getUploadStatusIcon('businessLicense')}</span>
                  <span className="text-sm">{documents.businessLicense.name}</span>
                </div>
              )}
            </div>

            {/* Insurance */}
            <div className="bg-white/5 rounded-lg p-4">
              <label className="block text-white font-semibold mb-2">
                🛡️ Страхування
              </label>
              <p className="text-purple-200 text-sm mb-3">
                Завантажте поліс страхування професійної відповідальності (якщо є)
              </p>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload('insurance', e.target.files?.[0] || null)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-purple-900 file:bg-white file:font-medium"
              />
              {documents.insurance && (
                <div className="mt-2 flex items-center text-green-400">
                  <span className="mr-2">{getUploadStatusIcon('insurance')}</span>
                  <span className="text-sm">{documents.insurance.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Відправка...' : 'Відправити на верифікацію'}
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 text-center">
            <p className="text-purple-200 text-sm">
              <span className="text-red-400">*</span> - обов'язкові поля
            </p>
            <p className="text-purple-200 text-xs mt-2">
              Перевірка документів займає 1-3 робочих дні. Ви отримаєте повідомлення про результат.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
