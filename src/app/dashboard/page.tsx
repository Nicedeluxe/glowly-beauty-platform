'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../../components/Avatar';

interface Appointment {
  id: string;
  masterName: string;
  service: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
  phone?: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'appointments'>('profile');
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    birthDate: ''
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      masterName: 'Анна Петренко',
      service: 'Манікюр + покриття гель-лаком',
      date: '2024-10-05',
      time: '14:00',
      status: 'upcoming',
      price: 400
    },
    {
      id: '2',
      masterName: 'Марія Іваненко',
      service: 'Стрижка + укладка',
      date: '2024-10-08',
      time: '11:00',
      status: 'upcoming',
      price: 600
    }
  ]);

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ')[1] || '',
        phone: user.phone || '',
        birthDate: user.birthDate || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = () => {
    // In real app, this would save to backend
    alert('Профіль оновлено!');
  };

  const handleImageChange = (file: File) => {
    setProfileImage(file);
    // In real app, you would upload the file to a server here
    console.log('New profile image:', file.name);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA');
  };

  const addToGoogleCalendar = (appointment: Appointment) => {
    const startDate = new Date(`${appointment.date}T${appointment.time}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hour
    
    const eventDetails = {
      summary: `${appointment.service} - ${appointment.masterName}`,
      location: 'Салон краси',
      description: `Послуга: ${appointment.service}\nМайстер: ${appointment.masterName}\nКонтакт: ${appointment.phone || 'Не вказано'}`,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'Europe/Kiev'
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'Europe/Kiev'
      }
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.summary)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-[#FF6B6B] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 10L61.8 38.2L90 50L61.8 61.8L50 90L38.2 61.8L10 50L38.2 38.2L50 10Z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white">Glowly</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {user && <Avatar user={user} size="sm" />}
                <span className="text-white">Привіт, {user?.name}</span>
              </div>
              <Link 
                href="/auth" 
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                Вийти
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-white/10 rounded-xl p-1 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-white text-purple-700'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Мій профіль
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              activeTab === 'appointments'
                ? 'bg-white text-purple-700'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Мої записи
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Мій профіль</h2>
            
            {/* Profile Avatar */}
            {user && (
              <div className="flex items-center space-x-4 mb-8">
                <Avatar 
                  user={user} 
                  size="lg" 
                  editable={true} 
                  onImageChange={handleImageChange}
                />
                <div>
                  <h3 className="text-xl font-semibold text-white">{user.name}</h3>
                  <p className="text-white/60">{user.email}</p>
                  <p className="text-white/40 text-sm">Натисніть на фото для зміни</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Ім&apos;я
                </label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="Ваше ім'я"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Прізвище
                </label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="Ваше прізвище"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Номер телефону
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="+380 XX XXX XX XX"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Дата народження
                </label>
                <input
                  type="date"
                  value={profile.birthDate}
                  onChange={(e) => setProfile({...profile, birthDate: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
            
            <div className="mt-8">
              <button
                onClick={handleProfileUpdate}
                className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-xl hover:bg-white/90 transition-colors"
              >
                Зберегти зміни
              </button>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Мої записи</h2>
            
            {appointments.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
                <div className="text-white/60 text-lg mb-4">У вас немає записів</div>
                <Link
                  href="/"
                  className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-xl hover:bg-white/90 transition-colors"
                >
                  Записатися
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {appointment.service}
                        </h3>
                        <div className="space-y-1 text-white/80">
                          <p>Майстер: {appointment.masterName}</p>
                          <p>Дата: {formatDate(appointment.date)}</p>
                          <p>Час: {appointment.time}</p>
                          <p>Ціна: {appointment.price} грн</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          appointment.status === 'upcoming'
                            ? 'bg-green-500/20 text-green-300'
                            : appointment.status === 'completed'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {appointment.status === 'upcoming' ? 'Майбутня' :
                           appointment.status === 'completed' ? 'Завершена' : 'Скасована'}
                        </span>
                        
                        {appointment.status === 'upcoming' && (
                          <button
                            onClick={() => addToGoogleCalendar(appointment)}
                            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
                          >
                            📅 Додати в календар
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
