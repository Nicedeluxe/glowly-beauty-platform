'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import Link from 'next/link';

interface PaymentData {
  bookingId: string;
  masterName: string;
  masterPhone: string;
  clientName: string;
  clientPhone: string;
  date: string;
  time: string;
  services: string[];
  totalPrice: number;
  platformCommission: number;
  masterAmount: number;
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { getBookingById, updateBookingStatus } = useBooking();
  
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  useEffect(() => {
    const bookingId = searchParams.get('bookingId');
    console.log('Payment page - bookingId:', bookingId);
    
    if (!bookingId) {
      console.log('No bookingId found, redirecting to home');
      router.push('/');
      return;
    }

    const booking = getBookingById(bookingId);
    console.log('Payment page - booking:', booking);
    
    if (!booking) {
      console.log('No booking found, redirecting to home');
      router.push('/');
      return;
    }

    // Calculate platform commission (10%)
    const platformCommission = Math.round(booking.totalPrice * 0.1);
    const masterAmount = booking.totalPrice - platformCommission;

    setPaymentData({
      bookingId: booking.id,
      masterName: booking.masterName,
      masterPhone: booking.masterPhone,
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      date: booking.date,
      time: booking.time,
      services: booking.services,
      totalPrice: booking.totalPrice,
      platformCommission,
      masterAmount
    });

    setCardholderName(user?.name || '');
    setLoading(false);
  }, [searchParams, getBookingById, router, user]);

  const handlePayment = async () => {
    if (!paymentData) return;

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update booking status to 'paid'
      updateBookingStatus(paymentData.bookingId, 'paid');

      // Redirect to success page
      router.push(`/payment/success?bookingId=${paymentData.bookingId}`);
    } catch (error) {
      console.error('Payment failed:', error);
      router.push(`/payment/failed?bookingId=${paymentData.bookingId}`);
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Завантаження...</div>
      </div>
    );
  }

  if (!paymentData) {
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
            <div className="text-white">
              <span className="text-sm">Оплата послуги</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Summary */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <h1 className="text-2xl font-bold text-white mb-6">Підтвердження оплати</h1>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-purple-200">Майстер:</span>
              <span className="text-white font-medium">{paymentData.masterName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Дата та час:</span>
              <span className="text-white font-medium">{paymentData.date} о {paymentData.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Послуги:</span>
              <span className="text-white font-medium">{paymentData.services.join(', ')}</span>
            </div>
            <div className="border-t border-white/20 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-purple-200">Вартість послуг:</span>
                <span className="text-white">{paymentData.totalPrice} грн</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-purple-200">Комісія платформи (10%):</span>
                <span className="text-white">-{paymentData.platformCommission} грн</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-white">До сплати:</span>
                <span className="text-yellow-400">{paymentData.totalPrice} грн</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Спосіб оплати</h2>
          
          <div className="space-y-4 mb-6">
            <label className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                className="w-4 h-4 text-purple-600"
              />
              <span className="text-white">💳 Банківська картка</span>
            </label>
            
            <label className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="apple_pay"
                checked={paymentMethod === 'apple_pay'}
                onChange={(e) => setPaymentMethod(e.target.value as 'apple_pay')}
                className="w-4 h-4 text-purple-600"
              />
              <span className="text-white">🍎 Apple Pay</span>
            </label>
            
            <label className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="google_pay"
                checked={paymentMethod === 'google_pay'}
                onChange={(e) => setPaymentMethod(e.target.value as 'google_pay')}
                className="w-4 h-4 text-purple-600"
              />
              <span className="text-white">📱 Google Pay</span>
            </label>
          </div>

          {/* Card Details */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 text-sm mb-2">Номер картки</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-200 text-sm mb-2">Термін дії</label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 text-sm mb-2">CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, '').substring(0, 3))}
                    placeholder="123"
                    maxLength={3}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-purple-200 text-sm mb-2">Ім&apos;я на картці</label>
                <input
                  type="text"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="Іван Іванов"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={processing || (paymentMethod === 'card' && (!cardNumber || !expiryDate || !cvv || !cardholderName))}
          className="w-full bg-yellow-400 text-purple-900 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {processing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-purple-900 border-t-transparent rounded-full animate-spin"></div>
              <span>Обробка платежу...</span>
            </div>
          ) : (
            `Сплатити ${paymentData.totalPrice} грн`
          )}
        </button>

        {/* Security Info */}
        <div className="mt-6 text-center">
          <p className="text-purple-200 text-sm">
            🔒 Ваші дані захищені SSL-шифруванням
          </p>
          <p className="text-purple-200 text-xs mt-2">
            Після успішної оплати запис буде підтверджено автоматично
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Завантаження...</div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
