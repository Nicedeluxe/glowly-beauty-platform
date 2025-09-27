'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Booking {
  id: string;
  masterId: string;
  masterName: string;
  masterSpecialization: string;
  masterAddress: string;
  masterPhone: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  services: string[];
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => void;
  cancelBooking: (bookingId: string) => void;
  getBookingsByMaster: (masterId: string) => Booking[];
  getBookingsByClient: (clientId: string) => Booking[];
  isTimeSlotBooked: (masterId: string, date: string, time: string) => boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Load bookings from localStorage on mount
  useEffect(() => {
    const savedBookings = localStorage.getItem('glowly-bookings');
    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings));
      } catch (error) {
        console.error('Error loading bookings from localStorage:', error);
      }
    }
  }, []);

  // Save bookings to localStorage whenever bookings change
  useEffect(() => {
    localStorage.setItem('glowly-bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    
    setBookings(prev => [...prev, newBooking]);
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: 'cancelled' as const }
        : booking
    ));
  };

  const getBookingsByMaster = (masterId: string) => {
    return bookings.filter(booking => 
      booking.masterId === masterId && booking.status === 'confirmed'
    );
  };

  const getBookingsByClient = (clientId: string) => {
    return bookings.filter(booking => 
      booking.clientId === clientId && booking.status === 'confirmed'
    );
  };

  const isTimeSlotBooked = (masterId: string, date: string, time: string) => {
    return bookings.some(booking => 
      booking.masterId === masterId && 
      booking.date === date && 
      booking.time === time && 
      booking.status === 'confirmed'
    );
  };

  const value = {
    bookings,
    addBooking,
    cancelBooking,
    getBookingsByMaster,
    getBookingsByClient,
    isTimeSlotBooked,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
