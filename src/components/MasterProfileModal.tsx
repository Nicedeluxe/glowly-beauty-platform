'use client';

import React, { useState } from 'react';
import { useReviews, Review } from '../contexts/ReviewsContext';
import { useAuth } from '../contexts/AuthContext';

interface MasterProfileModalProps {
  master: {
    id: string;
    name: string;
    specialization: string;
    rating: number;
    reviews: number;
    price: string;
    image: string;
    services: string[];
    location: string;
    address: string;
    phone: string;
    experience: string;
    description: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onBook: (master: any) => void;
}

export default function MasterProfileModal({ master, isOpen, onClose, onBook }: MasterProfileModalProps) {
  const { reviews, addReview, getReviewsByMaster } = useReviews();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    serviceName: ''
  });

  const masterReviews = getReviewsByMaster(master.id);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addReview({
      masterId: master.id,
      clientId: user.id,
      clientName: user.name,
      clientAvatar: user.avatar,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      serviceName: reviewForm.serviceName
    });

    setReviewForm({ rating: 5, comment: '', serviceName: '' });
    setShowReviewForm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{master.name}</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'info'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            📋 Інформація
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'reviews'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            ⭐ Відгуки ({masterReviews.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Master Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Основна інформація</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-white/70 text-sm">Спеціалізація:</span>
                    <p className="text-white font-medium">{master.specialization}</p>
                  </div>
                  <div>
                    <span className="text-white/70 text-sm">Досвід роботи:</span>
                    <p className="text-white font-medium">{master.experience}</p>
                  </div>
                  <div>
                    <span className="text-white/70 text-sm">Місцезнаходження:</span>
                    <p className="text-white font-medium">{master.location}</p>
                  </div>
                  <div>
                    <span className="text-white/70 text-sm">Адреса:</span>
                    <p className="text-white font-medium">{master.address}</p>
                  </div>
                  <div>
                    <span className="text-white/70 text-sm">Телефон:</span>
                    <p className="text-white font-medium">{master.phone}</p>
                  </div>
                  <div>
                    <span className="text-white/70 text-sm">Середній рейтинг:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-400 text-lg">⭐</span>
                      <span className="text-white font-medium">{master.rating}</span>
                      <span className="text-white/70 text-sm">({master.reviews} відгуків)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Послуги</h3>
                <div className="space-y-2">
                  {master.services.map((service, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-3">
                      <div className="text-white font-medium">{service}</div>
                      <div className="text-white/70 text-sm">Від {master.price} грн</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Опис</h3>
              <p className="text-white/80 leading-relaxed">{master.description}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-white/10">
              <button
                onClick={() => onBook(master)}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                📅 Записатися
              </button>
              <a
                href={`tel:${master.phone}`}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors text-center"
              >
                📞 Подзвонити
              </a>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Review Stats */}
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Рейтинг майстра</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-yellow-400 text-2xl">⭐</span>
                    <span className="text-white text-xl font-bold">{master.rating}</span>
                    <span className="text-white/70">({masterReviews.length} відгуків)</span>
                  </div>
                </div>
                {user && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    {showReviewForm ? 'Скасувати' : 'Залишити відгук'}
                  </button>
                )}
              </div>
            </div>

            {/* Review Form */}
            {showReviewForm && user && (
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Залишити відгук</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Послуга
                    </label>
                    <select
                      value={reviewForm.serviceName}
                      onChange={(e) => setReviewForm({ ...reviewForm, serviceName: e.target.value })}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Оберіть послугу</option>
                      {master.services.map((service, index) => (
                        <option key={index} value={service} className="bg-gray-800">
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Оцінка
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className={`text-2xl ${
                            star <= reviewForm.rating ? 'text-yellow-400' : 'text-white/30'
                          }`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Коментар
                    </label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Розкажіть про свій досвід..."
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      Відправити відгук
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="bg-white/10 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition-colors"
                    >
                      Скасувати
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {masterReviews.length > 0 ? (
                masterReviews.map((review) => (
                  <div key={review.id} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {review.clientName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-white font-medium">{review.clientName}</h4>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-sm ${
                                  star <= review.rating ? 'text-yellow-400' : 'text-white/30'
                                }`}
                              >
                                ⭐
                              </span>
                            ))}
                          </div>
                          <span className="text-white/60 text-sm">
                            {new Date(review.createdAt).toLocaleDateString('uk-UA')}
                          </span>
                        </div>
                        <p className="text-white/80 text-sm mb-1">
                          <span className="text-purple-300">Послуга:</span> {review.serviceName}
                        </p>
                        <p className="text-white/90">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">⭐</div>
                  <h3 className="text-xl font-bold text-white mb-2">Поки що немає відгуків</h3>
                  <p className="text-purple-200">Станьте першим, хто залишить відгук про цього майстра!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
