'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';

interface VerificationRequest {
  id: string;
  masterId: string;
  masterName: string;
  masterEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  documents: {
    passport: string;
    diploma: string;
    certificates: string[];
    portfolio: string[];
    businessLicense?: string;
    insurance?: string;
  };
  notes?: string;
}

// Mock data for verification requests
const MOCK_VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: 'verification-1',
    masterId: 'master-1',
    masterName: 'Анна Красива',
    masterEmail: 'anna@example.com',
    status: 'pending',
    submittedAt: '2024-01-15T10:00:00Z',
    documents: {
      passport: '/documents/anna-passport.jpg',
      diploma: '/documents/anna-diploma.pdf',
      certificates: ['/documents/anna-cert1.jpg', '/documents/anna-cert2.pdf'],
      portfolio: ['/documents/anna-work1.jpg', '/documents/anna-work2.jpg'],
    }
  },
  {
    id: 'verification-2',
    masterId: 'master-2',
    masterName: 'Тетяна Манікюр',
    masterEmail: 'tetiana@example.com',
    status: 'approved',
    submittedAt: '2024-01-10T14:30:00Z',
    documents: {
      passport: '/documents/tetiana-passport.jpg',
      diploma: '/documents/tetiana-diploma.pdf',
      certificates: ['/documents/tetiana-cert1.jpg', '/documents/tetiana-cert2.jpg'],
      portfolio: ['/documents/tetiana-work1.jpg', '/documents/tetiana-work2.jpg'],
      businessLicense: '/documents/tetiana-fop.pdf',
      insurance: '/documents/tetiana-insurance.pdf'
    },
    notes: 'Всі документи у порядку, портфоліо якісне'
  }
];

export default function AdminPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<VerificationRequest[]>(MOCK_VERIFICATION_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [notes, setNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [activeTab, setActiveTab] = useState<'verification' | 'masters' | 'analytics' | 'earnings'>('verification');
  const [earningsPeriod, setEarningsPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  // Проверяем права администратора (в реальном приложении это должно быть на сервере)
  const isAdmin = user?.email === 'admin@glowly.com' || user?.name === 'Admin';
  
  // Отладочная информация
  console.log('Admin page - user:', user);
  console.log('Admin page - isAdmin:', isAdmin);
  console.log('Admin page - user?.email:', user?.email);
  console.log('Admin page - user?.name:', user?.name);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Завантаження...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-white mb-4">Доступ заборонено</h1>
          <p className="text-purple-200 mb-6">У вас немає прав доступу до цієї сторінки</p>
          <Link href="/" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
            Повернутися на головну
          </Link>
        </div>
      </div>
    );
  }

  const filteredRequests = requests.filter(request => 
    filterStatus === 'all' || request.status === filterStatus
  );

  const handleApprove = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved', notes: notes || 'Схвалено' } : req
    ));
    setSelectedRequest(null);
    setNotes('');
  };

  const handleReject = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'rejected', notes: notes || 'Відхилено' } : req
    ));
    setSelectedRequest(null);
    setNotes('');
  };

  const getStatusColor = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Glowly" className="w-8 h-8" />
                <span className="text-2xl font-bold text-white">Glowly</span>
              </Link>
              <span className="text-purple-300 text-sm">Панель адміністратора</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white/80 text-sm">Вітаємо, {user.name}!</span>
              <Link 
                href="/"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                На головну
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Панель адміністратора
            </h1>
            <p className="text-purple-200 text-lg">
              Управління платформою Glowly
            </p>
            {/* Debug info */}
            <div className="mt-4 p-4 bg-black/20 rounded-lg">
              <p className="text-xs text-white/60">Debug: user={user?.name}, email={user?.email}, isAdmin={isAdmin.toString()}</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveTab('verification')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'verification'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              📋 Верифікація
            </button>
            <button
              onClick={() => setActiveTab('masters')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'masters'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              👥 Майстри
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              📊 Аналітика
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'earnings'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              💰 Заробіток майстрів
            </button>
          </div>

          {/* Verification Tab */}
          {activeTab === 'verification' && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {requests.filter(r => r.status === 'pending').length}
                  </div>
                  <div className="text-yellow-300 text-sm">На розгляді</div>
                </div>
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {requests.filter(r => r.status === 'approved').length}
                  </div>
                  <div className="text-green-300 text-sm">Схвалено</div>
                </div>
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {requests.filter(r => r.status === 'rejected').length}
                  </div>
                  <div className="text-red-300 text-sm">Відхилено</div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status as 'all' | 'pending' | 'approved' | 'rejected')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterStatus === status
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {status === 'all' ? 'Всі' : status === 'pending' ? 'На розгляді' : status === 'approved' ? 'Схвалені' : 'Відхилені'}
                  </button>
                ))}
              </div>

              {/* Requests List */}
              <div className="bg-white/5 rounded-lg p-6">
                {filteredRequests.length > 0 ? (
                  <div className="space-y-4">
                    {filteredRequests.map(request => (
                      <div key={request.id} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {request.masterName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{request.masterName}</h3>
                            <p className="text-white/70 text-sm">{request.masterEmail}</p>
                            <p className="text-white/50 text-xs">Подано: {new Date(request.submittedAt).toLocaleDateString('uk-UA')}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(request.status)}`}>
                            {request.status === 'pending' ? 'На розгляді' : request.status === 'approved' ? 'Схвалено' : 'Відхилено'}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setNotes(request.notes || '');
                            }}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                          >
                            Переглянути
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📋</div>
                    <h3 className="text-xl font-bold text-white mb-2">Заявок не знайдено</h3>
                    <p className="text-purple-200">Немає заявок з обраним фільтром</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Masters Management Tab */}
          {activeTab === 'masters' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center mb-6">Управління майстрами</h2>
              
              {/* Masters Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">20</div>
                  <div className="text-blue-300 text-sm">Всього майстрів</div>
                </div>
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">15</div>
                  <div className="text-green-300 text-sm">Верифікованих</div>
                </div>
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">3</div>
                  <div className="text-yellow-300 text-sm">На верифікації</div>
                </div>
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">2</div>
                  <div className="text-red-300 text-sm">Заблокованих</div>
                </div>
              </div>

              {/* Masters List */}
              <div className="bg-white/5 rounded-lg p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">Всі</button>
                  <button className="px-4 py-2 bg-white/10 text-white/80 rounded-lg text-sm hover:bg-white/20">Верифіковані</button>
                  <button className="px-4 py-2 bg-white/10 text-white/80 rounded-lg text-sm hover:bg-white/20">Не верифіковані</button>
                  <button className="px-4 py-2 bg-white/10 text-white/80 rounded-lg text-sm hover:bg-white/20">Заблоковані</button>
                </div>
                
                <div className="space-y-4">
                  {/* Master Item 1 */}
                  <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        М
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Марія Петренко</h3>
                        <p className="text-white/70 text-sm">maria@example.com</p>
                        <p className="text-white/50 text-xs">Верифікований • Майстер нігтів</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/30">
                        Активний
                      </span>
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700">
                        Управління
                      </button>
                    </div>
                  </div>

                  {/* Master Item 2 */}
                  <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        А
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Анна Красива</h3>
                        <p className="text-white/70 text-sm">anna@example.com</p>
                        <p className="text-white/50 text-xs">На верифікації • Візажист</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm border border-yellow-500/30">
                        На верифікації
                      </span>
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700">
                        Управління
                      </button>
                    </div>
                  </div>

                  {/* Master Item 3 */}
                  <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        Т
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Тетяна Манікюр</h3>
                        <p className="text-white/70 text-sm">tetiana@example.com</p>
                        <p className="text-white/50 text-xs">Верифікований • Майстер нігтів</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/30">
                        Активний
                      </span>
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700">
                        Управління
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center mb-6">Фінансова аналітика</h2>
              
              {/* Financial Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-400">₴45,680</div>
                  <div className="text-green-300 text-sm">Загальний дохід</div>
                  <div className="text-green-200 text-xs mt-1">+12% за місяць</div>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-400">₴4,568</div>
                  <div className="text-blue-300 text-sm">Комісія платформи</div>
                  <div className="text-blue-200 text-xs mt-1">10% від загального доходу</div>
                </div>
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400">₴41,112</div>
                  <div className="text-purple-300 text-sm">Дохід майстрів</div>
                  <div className="text-purple-200 text-xs mt-1">90% від загального доходу</div>
                </div>
              </div>

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Дохід по місяцях</h3>
                  <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <div className="text-4xl mb-2">📈</div>
                      <div>Графік доходу</div>
                      <div className="text-sm">(Інтеграція з Chart.js)</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Популярні послуги</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white">Манікюр</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-700 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{width: '75%'}}></div>
                        </div>
                        <span className="text-white/70 text-sm">75%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Візаж</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-700 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{width: '60%'}}></div>
                        </div>
                        <span className="text-white/70 text-sm">60%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Брови</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-700 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{width: '45%'}}></div>
                        </div>
                        <span className="text-white/70 text-sm">45%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">Вії</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-700 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{width: '30%'}}></div>
                        </div>
                        <span className="text-white/70 text-sm">30%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Останні транзакції</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <div>
                      <div className="text-white font-medium">Манікюр - Марія Петренко</div>
                      <div className="text-white/60 text-sm">15.01.2024, 14:30</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-medium">+₴450</div>
                      <div className="text-white/60 text-sm">Комісія: ₴45</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <div>
                      <div className="text-white font-medium">Візаж - Анна Красива</div>
                      <div className="text-white/60 text-sm">15.01.2024, 12:15</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-medium">+₴800</div>
                      <div className="text-white/60 text-sm">Комісія: ₴80</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <div>
                      <div className="text-white font-medium">Брови - Тетяна Манікюр</div>
                      <div className="text-white/60 text-sm">15.01.2024, 10:45</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-medium">+₴300</div>
                      <div className="text-white/60 text-sm">Комісія: ₴30</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Earnings Statistics Tab */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center mb-6">Заробіток майстрів</h2>
              
              {/* Period Selector */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <button
                  onClick={() => setEarningsPeriod('week')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    earningsPeriod === 'week'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  Тиждень
                </button>
                <button
                  onClick={() => setEarningsPeriod('month')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    earningsPeriod === 'month'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  Місяць
                </button>
                <button
                  onClick={() => setEarningsPeriod('quarter')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    earningsPeriod === 'quarter'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  Квартал
                </button>
                <button
                  onClick={() => setEarningsPeriod('year')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    earningsPeriod === 'year'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  Рік
                </button>
              </div>

              {/* Period Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {earningsPeriod === 'week' ? '₴8,450' : 
                     earningsPeriod === 'month' ? '₴34,200' : 
                     earningsPeriod === 'quarter' ? '₴98,500' : '₴420,000'}
                  </div>
                  <div className="text-green-300 text-sm">Загальний заробіток</div>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {earningsPeriod === 'week' ? '₴845' : 
                     earningsPeriod === 'month' ? '₴3,420' : 
                     earningsPeriod === 'quarter' ? '₴9,850' : '₴42,000'}
                  </div>
                  <div className="text-blue-300 text-sm">Комісія платформи</div>
                </div>
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {earningsPeriod === 'week' ? '₴7,605' : 
                     earningsPeriod === 'month' ? '₴30,780' : 
                     earningsPeriod === 'quarter' ? '₴88,650' : '₴378,000'}
                  </div>
                  <div className="text-purple-300 text-sm">Заробіток майстрів</div>
                </div>
              </div>

              {/* Masters Earnings Ranking */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Рейтинг майстрів за заробітком</h3>
                <div className="space-y-4">
                  {/* Master 1 */}
                  <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                        1
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          М
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">Марія Петренко</h4>
                          <p className="text-white/70 text-sm">Мастер нігтів • 4.9⭐ (127 відгуків)</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">
                        {earningsPeriod === 'week' ? '₴2,340' : 
                         earningsPeriod === 'month' ? '₴9,800' : 
                         earningsPeriod === 'quarter' ? '₴28,500' : '₴125,000'}
                      </div>
                      <div className="text-white/60 text-sm">
                        {earningsPeriod === 'week' ? '45 замовлень' : 
                         earningsPeriod === 'month' ? '187 замовлень' : 
                         earningsPeriod === 'quarter' ? '542 замовлення' : '2,340 замовлень'}
                      </div>
                    </div>
                  </div>

                  {/* Master 2 */}
                  <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                        2
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          А
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">Анна Красива</h4>
                          <p className="text-white/70 text-sm">Візажист • 4.8⭐ (89 відгуків)</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">
                        {earningsPeriod === 'week' ? '₴1,890' : 
                         earningsPeriod === 'month' ? '₴7,600' : 
                         earningsPeriod === 'quarter' ? '₴22,800' : '₴98,000'}
                      </div>
                      <div className="text-white/60 text-sm">
                        {earningsPeriod === 'week' ? '32 замовлення' : 
                         earningsPeriod === 'month' ? '128 замовлень' : 
                         earningsPeriod === 'quarter' ? '384 замовлення' : '1,680 замовлень'}
                      </div>
                    </div>
                  </div>

                  {/* Master 3 */}
                  <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        3
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          Т
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">Тетяна Манікюр</h4>
                          <p className="text-white/70 text-sm">Мастер нігтів • 4.7⭐ (156 відгуків)</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">
                        {earningsPeriod === 'week' ? '₴1,650' : 
                         earningsPeriod === 'month' ? '₴6,400' : 
                         earningsPeriod === 'quarter' ? '₴19,200' : '₴82,000'}
                      </div>
                      <div className="text-white/60 text-sm">
                        {earningsPeriod === 'week' ? '28 замовлень' : 
                         earningsPeriod === 'month' ? '112 замовлень' : 
                         earningsPeriod === 'quarter' ? '336 замовлень' : '1,440 замовлень'}
                      </div>
                    </div>
                  </div>

                  {/* Master 4 */}
                  <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                        4
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          О
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">Олена Бровист</h4>
                          <p className="text-white/70 text-sm">Мастер бровей • 4.9⭐ (203 відгуки)</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">
                        {earningsPeriod === 'week' ? '₴1,420' : 
                         earningsPeriod === 'month' ? '₴5,600' : 
                         earningsPeriod === 'quarter' ? '₴16,800' : '₴72,000'}
                      </div>
                      <div className="text-white/60 text-sm">
                        {earningsPeriod === 'week' ? '24 замовлення' : 
                         earningsPeriod === 'month' ? '96 замовлень' : 
                         earningsPeriod === 'quarter' ? '288 замовлень' : '1,200 замовлень'}
                      </div>
                    </div>
                  </div>

                  {/* Master 5 */}
                  <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                        5
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          І
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">Ірина Віїст</h4>
                          <p className="text-white/70 text-sm">Мастер вій • 4.6⭐ (78 відгуків)</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">
                        {earningsPeriod === 'week' ? '₴1,150' : 
                         earningsPeriod === 'month' ? '₴4,800' : 
                         earningsPeriod === 'quarter' ? '₴14,400' : '₴61,000'}
                      </div>
                      <div className="text-white/60 text-sm">
                        {earningsPeriod === 'week' ? '18 замовлень' : 
                         earningsPeriod === 'month' ? '72 замовлення' : 
                         earningsPeriod === 'quarter' ? '216 замовлень' : '920 замовлень'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Document Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Заявка від {selectedRequest.masterName}
              </h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-1">Email</label>
                  <p className="text-white">{selectedRequest.masterEmail}</p>
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-1">Дата подачі</label>
                  <p className="text-white">{new Date(selectedRequest.submittedAt).toLocaleDateString('uk-UA')}</p>
                </div>
              </div>

              {/* Documents Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Passport */}
                {selectedRequest.documents.passport && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">📄 Паспорт</h4>
                    <div className="bg-gray-800 rounded p-4 text-center">
                      <div className="text-gray-400 text-sm">[Фото паспорта]</div>
                      <div className="text-xs text-gray-500 mt-1">{selectedRequest.documents.passport}</div>
                    </div>
                  </div>
                )}

                {/* Diploma */}
                {selectedRequest.documents.diploma && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">🎓 Диплом</h4>
                    <div className="bg-gray-800 rounded p-4 text-center">
                      <div className="text-gray-400 text-sm">[PDF диплома]</div>
                      <div className="text-xs text-gray-500 mt-1">{selectedRequest.documents.diploma}</div>
                    </div>
                  </div>
                )}

                {/* Certificates */}
                {selectedRequest.documents.certificates.length > 0 && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">🏆 Сертифікати</h4>
                    <div className="space-y-2">
                      {selectedRequest.documents.certificates.map((cert, index) => (
                        <div key={index} className="bg-gray-800 rounded p-2 text-center">
                          <div className="text-gray-400 text-sm">[Сертифікат {index + 1}]</div>
                          <div className="text-xs text-gray-500">{cert}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Portfolio */}
                {selectedRequest.documents.portfolio.length > 0 && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">🎨 Портфоліо</h4>
                    <div className="space-y-2">
                      {selectedRequest.documents.portfolio.map((work, index) => (
                        <div key={index} className="bg-gray-800 rounded p-2 text-center">
                          <div className="text-gray-400 text-sm">[Робота {index + 1}]</div>
                          <div className="text-xs text-gray-500">{work}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Business License */}
                {selectedRequest.documents.businessLicense && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">🏢 ФОП/ТОВ</h4>
                    <div className="bg-gray-800 rounded p-4 text-center">
                      <div className="text-gray-400 text-sm">[Документ реєстрації]</div>
                      <div className="text-xs text-gray-500 mt-1">{selectedRequest.documents.businessLicense}</div>
                    </div>
                  </div>
                )}

                {/* Insurance */}
                {selectedRequest.documents.insurance && (
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">🛡️ Страхування</h4>
                    <div className="bg-gray-800 rounded p-4 text-center">
                      <div className="text-gray-400 text-sm">[Поліс страхування]</div>
                      <div className="text-xs text-gray-500 mt-1">{selectedRequest.documents.insurance}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-white font-semibold mb-2">
                  Коментарі та примітки
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Додайте коментарі про перевірку документів..."
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300"
                  rows={3}
                />
              </div>

              {/* Previous notes */}
              {selectedRequest.notes && (
                <div className="mb-6">
                  <h4 className="font-semibold text-white mb-2">Попередні примітки:</h4>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-purple-200 text-sm">{selectedRequest.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-4">
                <button
                  onClick={() => handleApprove(selectedRequest.id)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  ✅ Схвалити
                </button>
                <button
                  onClick={() => handleReject(selectedRequest.id)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  ❌ Відхилити
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}