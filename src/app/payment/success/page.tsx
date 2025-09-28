'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBooking } from '../../../contexts/BookingContext';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getBookingById } = useBooking();
  
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
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-white mb-4">Оплата успішна!</h1>
          <p className="text-purple-200 text-lg">
            Ваш запис підтверджено та додано до календаря
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
              <span className="text-purple-200">Телефон майстра:</span>
              <span className="text-white font-medium">{booking.masterPhone}</span>
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

        {/* Next Steps */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Що далі?</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-yellow-400 text-lg">📅</span>
              <div>
                <p className="text-white font-medium">Запис додано до календаря</p>
                <p className="text-purple-200 text-sm">Ви отримаєте нагадування за день до процедури</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-yellow-400 text-lg">📞</span>
              <div>
                <p className="text-white font-medium">Можете зв'язатися з майстром</p>
                <p className="text-purple-200 text-sm">Телефон: {booking.masterPhone}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-yellow-400 text-lg">🔄</span>
              <div>
                <p className="text-white font-medium">Можете перенести або скасувати</p>
                <p className="text-purple-200 text-sm">У вашому особистому кабінеті</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="w-full bg-white text-purple-900 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-center block"
          >
            Перейти до особистого кабінету
          </Link>
          
          <button
            onClick={() => window.open(`tel:${booking.masterPhone}`)}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            📞 Подзвонити майстру
          </button>
          
          <Link
            href="/"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors text-center block"
          >
            Повернутися на головну
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-purple-200 text-sm">
            Дякуємо за вибір Glowly! 💜
          </p>
          <p className="text-purple-200 text-xs mt-2">
            Якщо у вас виникли питання, зверніться до служби підтримки
          </p>
        </div>
      </div>
    </div>
  );
}
