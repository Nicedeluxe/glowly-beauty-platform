'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import Avatar from '../../components/Avatar';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
}

interface MasterAppointment {
  id: string;
  clientName: string;
  clientPhone: string;
  service: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
}

interface WorkSchedule {
  day: string;
  isWorking: boolean;
  startTime: string;
  endTime: string;
}

export default function MasterDashboard() {
  const { user } = useAuth();
  const { 
    getBookingsByMaster, 
    cancelBooking, 
    getMasterProfile, 
    updateMasterProfile, 
    addMasterService, 
    updateMasterService, 
    removeMasterService 
  } = useBooking();
  const [activeTab, setActiveTab] = useState<'profile' | 'services' | 'schedule' | 'appointments'>('profile');
  const [masterProfile, setMasterProfile] = useState({
    name: '',
    phone: '',
    type: 'salon' as 'salon' | 'freelance',
    photo: '',
    description: ''
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  
  // Get services from booking context
  const masterProfileData = user ? getMasterProfile(user.id) : undefined;
  const services: Service[] = masterProfileData?.services || [
    { id: '1', name: 'Манікюр + покриття гель-лаком', price: 400, duration: 90 },
    { id: '2', name: 'Педікюр', price: 350, duration: 120 },
    { id: '3', name: 'Дизайн нігтів', price: 150, duration: 30 }
  ];
  
  const [workSchedule, setWorkSchedule] = useState<WorkSchedule[]>([
    { day: 'Понеділок', isWorking: true, startTime: '09:00', endTime: '18:00' },
    { day: 'Вівторок', isWorking: true, startTime: '09:00', endTime: '18:00' },
    { day: 'Середа', isWorking: true, startTime: '09:00', endTime: '18:00' },
    { day: 'Четвер', isWorking: true, startTime: '09:00', endTime: '18:00' },
    { day: 'П\'ятниця', isWorking: true, startTime: '09:00', endTime: '18:00' },
    { day: 'Субота', isWorking: true, startTime: '10:00', endTime: '16:00' },
    { day: 'Неділя', isWorking: false, startTime: '09:00', endTime: '18:00' }
  ]);
  
  // Get appointments from booking context
  const bookings = getBookingsByMaster(user?.id || '');
  const appointments: MasterAppointment[] = bookings.map(booking => ({
    id: booking.id,
    clientName: booking.clientName,
    clientPhone: booking.masterPhone,
    service: booking.services.join(', '),
    date: booking.date,
    time: booking.time,
    status: booking.status === 'confirmed' ? 'upcoming' : 'completed',
    price: booking.totalPrice
  }));

  const addToGoogleCalendar = (appointment: MasterAppointment) => {
    const startDate = new Date(`${appointment.date}T${appointment.time}`);
    const endDate = new Date(startDate.getTime() + 90 * 60 * 1000); // +90 minutes default
    
    const eventDetails = {
      summary: `${appointment.service} - ${appointment.clientName}`,
      location: masterProfile.type === 'salon' ? 'Салон краси' : 'Домашній візит',
      description: `Клієнт: ${appointment.clientName}\nТелефон: ${appointment.clientPhone}\nПослуга: ${appointment.service}\nЦіна: ${appointment.price} грн`,
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

  const cancelAppointment = (appointmentId: string) => {
    if (confirm('Ви впевнені, що хочете скасувати запис? Клієнту буде повернуто гроші.')) {
      cancelBooking(appointmentId);
      alert('Запис скасовано. Гроші повернуто клієнту.');
    }
  };

  const addService = () => {
    if (user) {
      addMasterService(user.id, {
        name: '',
        price: 0,
        duration: 60
      });
    }
  };

  const updateService = (id: string, field: keyof Service, value: string | number) => {
    if (user) {
      updateMasterService(user.id, id, { [field]: value });
    }
  };

  const removeService = (id: string) => {
    if (user) {
      removeMasterService(user.id, id);
    }
  };

  const updateSchedule = (day: string, field: keyof WorkSchedule, value: boolean | string) => {
    setWorkSchedule(workSchedule.map(schedule => 
      schedule.day === day ? { ...schedule, [field]: value } : schedule
    ));
  };

  const handleImageChange = (file: File) => {
    setProfileImage(file);
    // In real app, you would upload the file to a server here
    console.log('New profile image:', file.name);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA');
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
                <span className="text-white">Кабінет майстра</span>
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
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-white/10 rounded-xl p-1 mb-8 overflow-x-auto">
          {[
            { id: 'profile', label: 'Профіль' },
            { id: 'services', label: 'Послуги' },
            { id: 'schedule', label: 'Графік' },
            { id: 'appointments', label: 'Записи' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'profile' | 'services' | 'schedule' | 'appointments')}
              className={`flex-shrink-0 py-3 px-6 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-purple-700'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Профіль майстра</h2>
            
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
                  Ім&apos;я та прізвище
                </label>
                <input
                  type="text"
                  value={masterProfile.name}
                  onChange={(e) => setMasterProfile({...masterProfile, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="Ваше ім'я та прізвище"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Номер телефону
                </label>
                <input
                  type="tel"
                  value={masterProfile.phone}
                  onChange={(e) => setMasterProfile({...masterProfile, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="+380 XX XXX XX XX"
                />
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Тип роботи
                </label>
                <select
                  value={masterProfile.type}
                  onChange={(e) => setMasterProfile({...masterProfile, type: e.target.value as 'salon' | 'freelance'})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="salon">Салон</option>
                  <option value="freelance">Приватний майстер</option>
                </select>
              </div>
              
            </div>
            
            <div className="mt-6">
              <label className="block text-white/80 text-sm font-medium mb-2">
                Опис послуг
              </label>
              <textarea
                value={masterProfile.description}
                onChange={(e) => setMasterProfile({...masterProfile, description: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                placeholder="Опишіть ваші послуги та досвід..."
              />
            </div>
            
            <div className="mt-8">
              <button className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-xl hover:bg-white/90 transition-colors">
                Зберегти профіль
              </button>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Мої послуги</h2>
              <button
                onClick={addService}
                className="px-4 py-2 bg-white text-purple-700 font-medium rounded-xl hover:bg-white/90 transition-colors"
              >
                + Додати послугу
              </button>
            </div>
            
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-1">
                        Назва послуги
                      </label>
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateService(service.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                        placeholder="Назва послуги"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-1">
                        Ціна (грн)
                      </label>
                      <input
                        type="number"
                        value={service.price}
                        onChange={(e) => updateService(service.id, 'price', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-1">
                        Тривалість (хв)
                      </label>
                      <input
                        type="number"
                        value={service.duration}
                        onChange={(e) => updateService(service.id, 'duration', parseInt(e.target.value) || 60)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                        placeholder="60"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        onClick={() => removeService(service.id)}
                        className="px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                      >
                        Видалити
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Графік роботи</h2>
            
            <div className="space-y-4">
              {workSchedule.map((schedule) => (
                <div key={schedule.day} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-32 text-white font-medium">{schedule.day}</div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={schedule.isWorking}
                          onChange={(e) => updateSchedule(schedule.day, 'isWorking', e.target.checked)}
                          className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                        />
                        <span className="text-white/80 text-sm">Працюю</span>
                      </label>
                    </div>
                    
                    {schedule.isWorking && (
                      <div className="flex items-center space-x-4">
                        <div>
                          <label className="block text-white/80 text-xs mb-1">З</label>
                          <input
                            type="time"
                            value={schedule.startTime}
                            onChange={(e) => updateSchedule(schedule.day, 'startTime', e.target.value)}
                            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                          />
                        </div>
                        <div>
                          <label className="block text-white/80 text-xs mb-1">До</label>
                          <input
                            type="time"
                            value={schedule.endTime}
                            onChange={(e) => updateSchedule(schedule.day, 'endTime', e.target.value)}
                            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Записи клієнтів</h2>
            
            {appointments.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
                <div className="text-white/60 text-lg">У вас немає записів</div>
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
                          <p>Клієнт: {appointment.clientName}</p>
                          <p>Телефон: {appointment.clientPhone}</p>
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
                          <div className="flex space-x-2">
                            <button
                              onClick={() => addToGoogleCalendar(appointment)}
                              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
                            >
                              ✨ Календар
                            </button>
                            <button
                              onClick={() => cancelAppointment(appointment.id)}
                              className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                            >
                              Скасувати
                            </button>
                          </div>
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
