'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Review {
  id: string;
  masterId: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  rating: number; // 1-5
  comment: string;
  serviceName: string;
  createdAt: string;
  bookingId?: string; // Связь с конкретным заказом
}

export interface MasterReviews {
  masterId: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  positivePercentage: number; // Процент отзывов с рейтингом 4-5
}

interface ReviewsContextType {
  reviews: Review[];
  masterReviews: { [masterId: string]: MasterReviews };
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Review;
  getReviewsByMaster: (masterId: string) => Review[];
  getMasterReviews: (masterId: string) => MasterReviews | null;
  updateMasterRanking: (masters: any[]) => any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

// Mock данные для отзывов
const MOCK_REVIEWS: Review[] = [
  {
    id: 'review-1',
    masterId: '1',
    clientId: 'client-1',
    clientName: 'Анна Клієнт',
    rating: 5,
    comment: 'Чудовий майстер! Дуже професійно зробила манікюр. Рекомендую!',
    serviceName: 'Манікюр',
    createdAt: '2024-01-15T10:00:00Z',
    bookingId: 'booking-1'
  },
  {
    id: 'review-2',
    masterId: '1',
    clientId: 'client-2',
    clientName: 'Марія Клієнт',
    rating: 4,
    comment: 'Добре виконана робота, але трохи довго чекала на прийом.',
    serviceName: 'Манікюр',
    createdAt: '2024-01-14T14:30:00Z',
    bookingId: 'booking-2'
  },
  {
    id: 'review-3',
    masterId: '2',
    clientId: 'client-3',
    clientName: 'Олена Клієнт',
    rating: 5,
    comment: 'Фантастичний візаж! Виглядала як принцеса на святі.',
    serviceName: 'Візаж',
    createdAt: '2024-01-13T16:45:00Z',
    bookingId: 'booking-3'
  },
  {
    id: 'review-4',
    masterId: '1',
    clientId: 'client-4',
    clientName: 'Тетяна Клієнт',
    rating: 5,
    comment: 'Найкращий майстер нігтів у місті! Завжди роблю у неї.',
    serviceName: 'Манікюр',
    createdAt: '2024-01-12T11:20:00Z',
    bookingId: 'booking-4'
  },
  {
    id: 'review-5',
    masterId: '2',
    clientId: 'client-5',
    clientName: 'Ірина Клієнт',
    rating: 4,
    comment: 'Хороший візаж, але хотілося б більше уваги до деталей.',
    serviceName: 'Візаж',
    createdAt: '2024-01-11T13:15:00Z',
    bookingId: 'booking-5'
  },
  {
    id: 'review-6',
    masterId: '1',
    clientId: 'client-6',
    clientName: 'Наталія Клієнт',
    rating: 5,
    comment: 'Професіонал своєї справи! Нігті виглядають ідеально.',
    serviceName: 'Манікюр',
    createdAt: '2024-01-10T09:30:00Z',
    bookingId: 'booking-6'
  },
  {
    id: 'review-7',
    masterId: '3',
    clientId: 'client-7',
    clientName: 'Вікторія Клієнт',
    rating: 4,
    comment: 'Добре зробила брови, але трохи боліло.',
    serviceName: 'Корекція бровей',
    createdAt: '2024-01-09T15:45:00Z',
    bookingId: 'booking-7'
  },
  {
    id: 'review-8',
    masterId: '1',
    clientId: 'client-8',
    clientName: 'Юлія Клієнт',
    rating: 5,
    comment: 'Супер майстер! Завжди задоволена результатом.',
    serviceName: 'Манікюр',
    createdAt: '2024-01-08T12:00:00Z',
    bookingId: 'booking-8'
  },
  {
    id: 'review-9',
    masterId: '2',
    clientId: 'client-9',
    clientName: 'Аліна Клієнт',
    rating: 5,
    comment: 'Чудовий візаж для весілля! Всі гості були в захваті.',
    serviceName: 'Візаж',
    createdAt: '2024-01-07T17:30:00Z',
    bookingId: 'booking-9'
  },
  {
    id: 'review-10',
    masterId: '3',
    clientId: 'client-10',
    clientName: 'Катерина Клієнт',
    rating: 5,
    comment: 'Ідеальні брови! Дуже дякую за роботу.',
    serviceName: 'Фарбування бровей',
    createdAt: '2024-01-06T14:15:00Z',
    bookingId: 'booking-10'
  }
];

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [masterReviews, setMasterReviews] = useState<{ [masterId: string]: MasterReviews }>({});

  // Загружаем отзывы из localStorage
  useEffect(() => {
    const savedReviews = localStorage.getItem('glowly-reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  // Сохраняем отзывы в localStorage
  useEffect(() => {
    localStorage.setItem('glowly-reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Вычисляем статистику по мастерам
  useEffect(() => {
    const reviewsByMaster: { [masterId: string]: Review[] } = {};
    
    reviews.forEach(review => {
      if (!reviewsByMaster[review.masterId]) {
        reviewsByMaster[review.masterId] = [];
      }
      reviewsByMaster[review.masterId].push(review);
    });

    const masterReviewsData: { [masterId: string]: MasterReviews } = {};
    
    Object.keys(reviewsByMaster).forEach(masterId => {
      const masterReviewsList = reviewsByMaster[masterId];
      const averageRating = masterReviewsList.reduce((sum, review) => sum + review.rating, 0) / masterReviewsList.length;
      const positiveReviews = masterReviewsList.filter(review => review.rating >= 4).length;
      const positivePercentage = (positiveReviews / masterReviewsList.length) * 100;

      masterReviewsData[masterId] = {
        masterId,
        reviews: masterReviewsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: masterReviewsList.length,
        positivePercentage: Math.round(positivePercentage)
      };
    });

    setMasterReviews(masterReviewsData);
  }, [reviews]);

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>): Review => {
    const newReview: Review = {
      ...reviewData,
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    setReviews(prev => [...prev, newReview]);
    return newReview;
  };

  const getReviewsByMaster = (masterId: string): Review[] => {
    return reviews.filter(review => review.masterId === masterId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getMasterReviews = (masterId: string): MasterReviews | null => {
    return masterReviews[masterId] || null;
  };

  // Функция для обновления рейтинга мастеров
  const updateMasterRanking = (masters: any[]): any[] => { // eslint-disable-line @typescript-eslint/no-explicit-any
    return masters.map(master => {
      const masterReviewData = masterReviews[master.id];
      if (masterReviewData) {
        return {
          ...master,
          averageRating: masterReviewData.averageRating,
          totalReviews: masterReviewData.totalReviews,
          positivePercentage: masterReviewData.positivePercentage,
          hasMinimumReviews: masterReviewData.totalReviews >= 10
        };
      }
      return {
        ...master,
        averageRating: 0,
        totalReviews: 0,
        positivePercentage: 0,
        hasMinimumReviews: false
      };
    }).sort((a, b) => {
      // Новые мастера (менее 10 отзывов) всегда первые
      if (!a.hasMinimumReviews && !b.hasMinimumReviews) {
        return 0; // Сохраняем оригинальный порядок для новых мастеров
      }
      if (!a.hasMinimumReviews) return -1;
      if (!b.hasMinimumReviews) return 1;

      // Мастера с достаточным количеством отзывов сортируются по проценту положительных отзывов
      return b.positivePercentage - a.positivePercentage;
    });
  };

  const value: ReviewsContextType = {
    reviews,
    masterReviews,
    addReview,
    getReviewsByMaster,
    getMasterReviews,
    updateMasterRanking,
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
}
