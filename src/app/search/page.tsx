'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking, MasterWithServices } from '../../contexts/BookingContext';
import Avatar from '../../components/Avatar';
import { searchService, SearchFilters } from '../../services/SearchService';

function SearchContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { isTimeSlotBooked, addBooking, getMastersWithDynamicServices } = useBooking();
  const query = searchParams.get('q') || '';
  const searchDate = searchParams.get('date') || '';
  const searchTime = searchParams.get('time') || '';
  const userLat = parseFloat(searchParams.get('lat') || '50.4501');
  const userLng = parseFloat(searchParams.get('lng') || '30.5234');
  
  const [filteredMasters, setFilteredMasters] = useState<MasterWithServices[]>([]);
  const [selectedMaster, setSelectedMaster] = useState<MasterWithServices | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(searchDate);
  const [selectedTime, setSelectedTime] = useState(searchTime);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Mock data for time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  useEffect(() => {
    const mastersWithDynamicServices = getMastersWithDynamicServices();
    
    const searchFilters: SearchFilters = {
      query: query || undefined,
      date: searchDate || undefined,
      time: searchTime || undefined,
      userLat: userLat,
      userLng: userLng
    };

    const result = searchService.search(
      mastersWithDynamicServices,
      searchFilters,
      isTimeSlotBooked
    );

    setFilteredMasters(result.masters);
  }, [query, searchDate, searchTime, userLat, userLng, isTimeSlotBooked, getMastersWithDynamicServices]);

  const getCalendarDates = () => {
    const today = new Date();
    const calendarDates = [];
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      calendarDates.push(date);
    }
    
    return calendarDates;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('uk-UA', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const isBooked = (date: string, time: string) => {
    return filteredMasters.some(master => isTimeSlotBooked(master.id, date, time));
  };

  const handleBookAppointment = (master: MasterWithServices) => {
    setSelectedMaster(master);
    setSelectedServices(master.services.slice(0, 1)); // Select first service by default
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedMaster || !selectedDate || !selectedTime || selectedServices.length === 0) return;

    const totalPrice = calculateTotalPrice();
    const booking = {
      masterId: selectedMaster.id,
      masterName: selectedMaster.name,
      masterPhone: selectedMaster.phone,
      masterSpecialization: selectedMaster.specialization,
      masterAddress: selectedMaster.address,
      clientId: user?.id || '',
      clientName: user?.name || '',
      clientPhone: user?.phone || '',
      date: selectedDate,
      time: selectedTime,
      services: selectedServices,
      totalPrice,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString()
    };

    addBooking(booking);
    setShowBookingModal(false);
    
    // Redirect to payment page
    window.location.href = `/payment?bookingId=${booking.id}`;
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const calculateTotalPrice = () => {
    if (!selectedMaster) return 0;
    // Simple calculation: base price * number of services
    const basePrice = parseInt(selectedMaster.price.replace(/\D/g, ''));
    return basePrice * selectedServices.length;
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
            
            {user ? (
              <Link href="/dashboard" className="flex items-center space-x-3 text-white hover:text-yellow-300 transition-colors">
                <Avatar user={user} size="sm" />
                <span className="font-medium">{user.name}</span>
              </Link>
            ) : (
              <Link href="/auth" className="bg-yellow-400 text-purple-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors">
                Увійти
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Search Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Search Info */}
        <div className="bg-purple-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Результати пошуку: &quot;{query}&quot;
          </h1>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-purple-200 text-sm sm:text-base">
            {searchDate && (
              <>
                <span className="flex items-center">
                  <span className="mr-1">✨</span>
                  <span>{searchDate}</span>
                </span>
              </>
            )}
            {searchTime && (
              <>
                <span className="flex items-center">
                  <span className="mr-1">⏰</span>
                  <span>{searchTime}</span>
                </span>
              </>
            )}
            <span className="flex items-center">
              <span className="mr-1">🌸</span>
              <span>Сортовано по відстані</span>
            </span>
          </div>
          
          <p className="text-white/80 mt-3 sm:mt-4 text-sm sm:text-base">
            Знайдено {filteredMasters.length} майстрів доступних у вибраний час
          </p>
        </div>

        {/* Masters Grid */}
        {filteredMasters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredMasters.map((master) => (
              <div key={master.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
                  <img 
                    src={master.image} 
                    alt={master.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 truncate">{master.name}</h3>
                    <p className="text-purple-300 text-xs sm:text-sm mb-2">{master.specialization}</p>
                    <div className="flex items-center space-x-1 sm:space-x-2 text-yellow-400">
                      <span className="text-sm sm:text-base">💫</span>
                      <span className="font-semibold text-sm sm:text-base">{master.rating}</span>
                      <span className="text-purple-300 text-xs sm:text-sm">({master.reviews} відгуків)</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex flex-wrap items-center text-purple-200 text-xs sm:text-sm gap-1 sm:gap-2">
                    <span className="flex items-center">
                      <span className="mr-1">🌸</span>
                      <span className="truncate">{master.location}</span>
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center">
                      <span className="mr-1">🦋</span>
                      <span>{master.experience}</span>
                    </span>
                    {searchDate && searchTime && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center">
                          <span className="mr-1">✨</span>
                          <span>
                            {master.lat && master.lng ? searchService.calculateDistance(userLat, userLng, master.lat, master.lng).toFixed(1) : '0.0'} км
                          </span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                <p className="text-purple-200 text-xs sm:text-sm mb-4 line-clamp-2">{master.description}</p>
                
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                  {master.services.slice(0, 2).map((service, index) => (
                    <span key={index} className="bg-purple-700/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs truncate">
                      {service}
                    </span>
                  ))}
                  {master.services.length > 2 && (
                    <span className="bg-purple-700/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs">
                      +{master.services.length - 2} ще
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between gap-2">
                  <span className="text-lg sm:text-2xl font-bold text-white truncate">{master.price}</span>
                  <button
                    onClick={() => handleBookAppointment(master)}
                    className="bg-white text-purple-900 px-3 sm:px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base flex-shrink-0"
                  >
                    Записатися
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-16">
            <div className="text-4xl sm:text-6xl mb-4">💫</div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Майстрів не знайдено</h3>
            <p className="text-purple-200 text-sm sm:text-base px-4">Спробуйте змінити параметри пошуку</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedMaster && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Запис до {selectedMaster.name}</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Date Selection */}
            {!searchDate && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Оберіть дату</h3>
                <div className="grid grid-cols-7 gap-2">
                  {getCalendarDates().map((date, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(formatDate(date))}
                      className={`p-2 text-sm rounded-lg border ${
                        selectedDate === formatDate(date)
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Time Selection */}
            {!searchTime && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Оберіть час</h3>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      disabled={selectedDate ? isBooked(selectedDate, time) : false}
                      className={`p-3 text-sm rounded-lg border ${
                        selectedTime === time
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      } ${selectedDate && isBooked(selectedDate, time) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Service Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Оберіть послуги</h3>
              <div className="space-y-2">
                {selectedMaster.services.map((service, index) => (
                  <label key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Master Info */}
            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-purple-900 mb-2">Інформація про майстра</h4>
              <p className="text-gray-700">📍 {selectedMaster.address}</p>
              <p className="text-gray-700">📞 {selectedMaster.phone}</p>
            </div>

            {/* Total Price */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-semibold text-gray-900">Загальна вартість:</span>
              <span className="text-2xl font-bold text-purple-600">{calculateTotalPrice()} грн</span>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmBooking}
              disabled={!selectedDate || !selectedTime || selectedServices.length === 0}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Підтвердити запис
            </button>
            
            <p className="text-yellow-600 text-sm mt-2">✨ После подтверждения вы будете перенаправлены на страницу оплаты</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
      <div className="text-white text-xl">Завантаження...</div>
    </div>}>
      <SearchContent />
    </Suspense>
  );
}