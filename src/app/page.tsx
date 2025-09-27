'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  // Mock data for time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  // Mock data for booked slots (in real app this would come from API)
  const bookedSlots = ['10:00', '14:00', '16:00']; // These slots are already taken

  // Get available dates (next 7 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const getCalendarDates = () => {
    const today = new Date();
    const calendarDates = [];
    
    // Get the start of the current week (Monday)
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(today.getDate() - daysToMonday);
    
    // Generate 14 days starting from Monday of current week
    for (let i = 0; i < 14; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      const dateStr = date.toISOString().split('T')[0];
      const isPast = date < today;
      const isAvailable = !isPast && i >= 1; // Available from tomorrow
      
      calendarDates.push({
        date: dateStr,
        dateObj: date,
        dayName: date.toLocaleDateString('uk-UA', { weekday: 'short' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('uk-UA', { month: 'short' }),
        isPast,
        isAvailable
      });
    }
    
    return calendarDates;
  };

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Mock location for Kyiv if geolocation fails
          setUserLocation({ lat: 50.4501, lng: 30.5234 });
        }
      );
    } else {
      // Mock location for Kyiv if geolocation is not supported
      setUserLocation({ lat: 50.4501, lng: 30.5234 });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDateTimeModal(true);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setSearchQuery(categoryName);
    setShowDateTimeModal(true);
  };

  const handleDateTimeConfirm = () => {
    if (selectedDate && selectedTimeSlot) {
      const searchParams = new URLSearchParams({
        q: searchQuery,
        date: selectedDate,
        time: selectedTimeSlot,
        lat: userLocation?.lat.toString() || '50.4501',
        lng: userLocation?.lng.toString() || '30.5234'
      });
      router.push(`/search?${searchParams.toString()}`);
    }
  };

  const resetDateTimeModal = () => {
    setShowDateTimeModal(false);
    setSelectedDate('');
    setSelectedTimeSlot('');
  };

  // Get user location on component mount
  React.useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FF6B6B] rounded-3xl mb-4 shadow-2xl">
            <svg className="w-12 h-12 text-white" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 10L61.8 38.2L90 50L61.8 61.8L50 90L38.2 61.8L10 50L38.2 38.2L50 10Z" />
            </svg>
          </div>
          <h1 className="text-6xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
            Glowly
          </h1>
          <p className="text-xl text-white/90 font-medium">Платформа для запису до майстрів краси</p>
          {/* Auto-deploy test */}
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Введіть назву процедури..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 text-lg bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Quick categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg mx-auto">
          {[
            { name: 'Манікюр', emoji: '💅' },
            { name: 'Педикюр', emoji: '🦶' },
            { name: 'Брови', emoji: '🤨' },
            { name: 'Вії', emoji: '👁️' }
          ].map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-colors group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{category.emoji}</div>
              <div className="text-white text-sm font-medium">{category.name}</div>
            </button>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {user.avatar && (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-white font-medium">Привіт, {user.name}!</span>
              </div>
              <button
                onClick={logout}
                className="px-6 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium rounded-xl hover:bg-white/30 transition-colors"
              >
                Вийти
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => router.push('/auth')}
                className="px-8 py-3 bg-white text-purple-700 font-semibold rounded-xl hover:bg-white/90 transition-colors shadow-lg"
              >
                Увійти
              </button>
              <button
                onClick={() => router.push('/auth')}
                className="px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors"
              >
                Зареєструватися
              </button>
            </>
          )}
        </div>
      </div>

      {/* Date & Time Selection Modal */}
      {showDateTimeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Оберіть дату та час</h3>
              <p className="text-white/80">Пошук майстрів для процедури:</p>
              <p className="text-white font-semibold text-lg">{searchQuery}</p>
            </div>

            {/* Date Selection - Calendar Layout */}
            <div className="mb-6">
              <p className="text-white/80 text-sm mb-3">Дата:</p>
              
              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map((day) => (
                  <div key={day} className="text-center text-xs text-white/60 font-medium py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {getCalendarDates().map((dateInfo) => (
                  <button
                    key={dateInfo.date}
                    onClick={() => dateInfo.isAvailable && setSelectedDate(dateInfo.date)}
                    disabled={!dateInfo.isAvailable}
                    className={`p-2 rounded-lg border transition-colors text-center min-h-[48px] flex flex-col items-center justify-center ${
                      selectedDate === dateInfo.date
                        ? 'bg-white text-purple-700 border-white'
                        : dateInfo.isPast
                        ? 'bg-gray-500/20 border-gray-500/30 text-gray-400 cursor-not-allowed'
                        : dateInfo.isAvailable
                        ? 'bg-white/10 border-white/20 text-white hover:bg-white/15'
                        : 'bg-gray-600/20 border-gray-600/30 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-xs font-medium">{dateInfo.dayNumber}</div>
                    {dateInfo.isPast && (
                      <div className="text-[10px] opacity-60">Минуло</div>
                    )}
                    {!dateInfo.isPast && !dateInfo.isAvailable && (
                      <div className="text-[10px] opacity-60">Сьогодні</div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-white/60">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-white/10 rounded border border-white/20"></div>
                  <span>Доступно</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-white rounded border border-white"></div>
                  <span>Обрано</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-500/20 rounded border border-gray-500/30"></div>
                  <span>Недоступно</span>
                </div>
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="mb-6">
                <p className="text-white/80 text-sm mb-3">Час:</p>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => {
                    const isBooked = bookedSlots.includes(time);
                    const isSelected = selectedTimeSlot === time;
                    
                    return (
                      <button
                        key={time}
                        onClick={() => !isBooked && setSelectedTimeSlot(time)}
                        disabled={isBooked}
                        className={`p-3 rounded-xl border transition-colors text-center ${
                          isSelected
                            ? 'bg-white text-purple-700 border-white'
                            : isBooked
                            ? 'bg-red-500/20 border-red-500/30 text-red-300 cursor-not-allowed'
                            : 'bg-white/10 border-white/20 text-white hover:bg-white/15'
                        }`}
                      >
                        {time}
                        {isBooked && <div className="text-xs opacity-60">Зайнято</div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Location Info */}
            {userLocation && (
              <div className="bg-white/10 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <span>📍</span>
                  <span>Ваше місцезнаходження: Київ</span>
                  <span className="text-xs opacity-60">(автоматично визначено)</span>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <button
                onClick={resetDateTimeModal}
                className="flex-1 py-3 bg-white/20 text-white font-medium rounded-xl hover:bg-white/30 transition-colors"
              >
                Скасувати
              </button>
              
              <button
                onClick={handleDateTimeConfirm}
                disabled={!selectedDate || !selectedTimeSlot}
                className="flex-1 py-3 bg-white text-purple-700 font-semibold rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Знайти майстрів
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}