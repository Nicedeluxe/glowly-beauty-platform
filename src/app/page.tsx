'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import Avatar from '../components/Avatar';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isTimeSlotAvailableGlobally } = useBooking();

  // Mock data for time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  // Mock data for booked slots (in real app this would come from API)
  const bookedSlots: string[] = []; // No slots are booked for testing


  const getCalendarDates = () => {
    const today = new Date();
    const calendarDates = [];
    
    // Start from tomorrow
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 1);
    
    // End date is 30 days from tomorrow
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 31); // +1 to include the 30th day
    
    // Get the start of the calendar grid (Monday of the week containing tomorrow)
    const startOfCalendar = new Date(startDate);
    const dayOfWeek = startDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfCalendar.setDate(startDate.getDate() - daysToMonday);
    
    // Get the end of the calendar grid (Sunday of the week containing the last available day)
    const endOfCalendar = new Date(endDate);
    const lastDayOfWeek = endDate.getDay();
    const daysToSunday = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek;
    endOfCalendar.setDate(endDate.getDate() + daysToSunday);
    
    // Generate all days in the calendar grid
    const currentDate = new Date(startOfCalendar);
    while (currentDate <= endOfCalendar) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const isInRange = currentDate >= startDate && currentDate < endDate;
      const isPast = currentDate < today;
      const isToday = currentDate.toDateString() === today.toDateString();
      const isAvailable = isInRange && !isPast && !isToday;
      
      calendarDates.push({
        date: dateStr,
        dateObj: new Date(currentDate),
        dayName: currentDate.toLocaleDateString('uk-UA', { weekday: 'short' }),
        dayNumber: currentDate.getDate(),
        month: currentDate.toLocaleDateString('uk-UA', { month: 'short' }),
        isInRange,
        isPast,
        isToday,
        isAvailable
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg mx-auto mb-8">
          {[
            { name: 'Манікюр', emoji: '✨' },
            { name: 'Педикюр', emoji: '🌸' },
            { name: 'Брови', emoji: '💫' },
            { name: 'Вії', emoji: '🦋' }
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                href={user.type === 'MASTER' ? '/master-dashboard' : '/dashboard'}
                className="flex items-center space-x-3 text-white hover:text-white/80 transition-colors cursor-pointer underline hover:no-underline text-lg font-medium"
              >
                <Avatar user={user} size="sm" />
                <span>Привіт, {user.name}</span>
              </Link>
              <button 
                onClick={logout}
                className="px-6 py-3 bg-white/20 text-white font-medium rounded-xl hover:bg-white/30 transition-colors"
              >
                Вийти
              </button>
            </div>
          ) : (
            <Link 
              href="/auth" 
              className="px-8 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors"
            >
              Увійти / Реєстрація
            </Link>
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

            {/* Date Selection - Monthly Calendar Layout */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white/80 text-sm">Дата:</p>
                <h4 className="text-white font-semibold text-sm">
                  {(() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const lastDay = new Date();
                    lastDay.setDate(tomorrow.getDate() + 29);
                    return `${tomorrow.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })} - ${lastDay.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}`;
                  })()}
                </h4>
              </div>
              
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
                        : !dateInfo.isInRange
                        ? 'bg-gray-700/20 border-gray-700/30 text-gray-500 cursor-not-allowed'
                        : dateInfo.isPast
                        ? 'bg-gray-500/20 border-gray-500/30 text-gray-400 cursor-not-allowed'
                        : dateInfo.isToday
                        ? 'bg-gray-600/20 border-gray-600/30 text-gray-500 cursor-not-allowed'
                        : dateInfo.isAvailable
                        ? 'bg-white/10 border-white/20 text-white hover:bg-white/15'
                        : 'bg-gray-600/20 border-gray-600/30 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <div className={`text-xs font-medium ${!dateInfo.isInRange ? 'opacity-50' : ''}`}>
                      {dateInfo.dayNumber}
                    </div>
                    {dateInfo.isPast && dateInfo.isInRange && (
                      <div className="text-[10px] opacity-60">Минуло</div>
                    )}
                    {dateInfo.isToday && dateInfo.isInRange && (
                      <div className="text-[10px] opacity-60">Сьогодні</div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center gap-3 mt-3 text-xs text-white/60">
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
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-700/20 rounded border border-gray-700/30"></div>
                  <span>Поза діапазоном</span>
                </div>
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="mb-6">
                <p className="text-white/80 text-sm mb-3">Час:</p>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => {
                    const isBooked = bookedSlots.includes(time) || !isTimeSlotAvailableGlobally(selectedDate, time);
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