'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBooking } from '../../../contexts/BookingContext';
import Link from 'next/link';

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getBookingById, cancelBooking } = useBooking();
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bookingId = searchParams.get('bookingId');
    if (!bookingId) {
      router.push('/');
      return;
    }

    const bookingData = getBookingById(bookingId);
    if (!bookingData) {
      router.push('/');
      return;
    }

    setBooking(bookingData);
    setLoading(false);
  }, [searchParams, getBookingById, router]);

  const handleRetryPayment = () => {
    if (booking) {
      router.push(`/payment?bookingId=${booking.id}`);
    }
  };

  const handleCancelBooking = () => {
    if (booking) {
      cancelBooking(booking.id);
      router.push('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Завантаження...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Помилка завантаження даних</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/logo.png" alt="Glowly" className="w-8 h-8" />
              <span className="text-2xl font-bold text-white">Glowly</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-white mb-4">Оплата не вдалася</h1>
          <p className="text-purple-200 text-lg">
            Виникла помилка під час обробки платежу
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Деталі запису</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-purple-200">Майстер:</span>
              <span className="text-white font-medium">{booking.masterName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Дата та час:</span>
              <span className="text-white font-medium">{booking.date} о {booking.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Послуги:</span>
              <span className="text-white font-medium">{booking.services.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Сума:</span>
              <span className="text-yellow-400 font-bold">{booking.totalPrice} грн</span>
            </div>
          </div>
        </div>

        {/* Error Info */}
        <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Можливі причини помилки:</h3>
          <div className="space-y-2 text-purple-200">
            <p>• Недостатньо коштів на картці</p>
            <p>• Неправильні дані картки</p>
            <p>• Тимчасові проблеми з банком</p>
            <p>• Перевищено ліміт операції</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleRetryPayment}
            className="w-full bg-yellow-400 text-purple-900 py-3 rounded-lg font-medium hover:bg-yellow-300 transition-colors"
          >
            🔄 Спробувати ще раз
          </button>
          
          <button
            onClick={handleCancelBooking}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            ❌ Скасувати запис
          </button>
          
          <Link
            href="/dashboard"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors text-center block"
          >
            Перейти до особистого кабінету
          </Link>
          
          <Link
            href="/"
            className="w-full bg-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/20 transition-colors text-center block"
          >
            Повернутися на головну
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center">
          <p className="text-purple-200 text-sm">
            Потрібна допомога?
          </p>
          <p className="text-purple-200 text-xs mt-2">
            Зверніться до служби підтримки: support@glowly.com
          </p>
        </div>
      </div>
    </div>
  );
}
