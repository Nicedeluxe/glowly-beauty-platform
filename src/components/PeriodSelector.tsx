'use client';

import React, { useState } from 'react';

interface PeriodSelectorProps {
  selectedStartDate: string;
  selectedEndDate: string;
  onDateRangeChange: (startDate: string, endDate: string) => void;
}

export default function PeriodSelector({ selectedStartDate, selectedEndDate, onDateRangeChange }: PeriodSelectorProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(selectedStartDate);
  const [tempEndDate, setTempEndDate] = useState(selectedEndDate);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const generateCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    // Generate 6 weeks (42 days)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const handleDateClick = (date: Date) => {
    const dateString = formatDate(date);
    
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      // Start new selection
      setTempStartDate(dateString);
      setTempEndDate('');
    } else {
      // Complete selection
      if (dateString < tempStartDate) {
        setTempEndDate(tempStartDate);
        setTempStartDate(dateString);
      } else {
        setTempEndDate(dateString);
      }
    }
  };

  const handleApply = () => {
    if (tempStartDate && tempEndDate) {
      onDateRangeChange(tempStartDate, tempEndDate);
      setShowCalendar(false);
    }
  };

  const handleCancel = () => {
    setTempStartDate(selectedStartDate);
    setTempEndDate(selectedEndDate);
    setShowCalendar(false);
  };

  const isDateInRange = (date: Date) => {
    const dateString = formatDate(date);
    if (!tempStartDate || !tempEndDate) return false;
    return dateString >= tempStartDate && dateString <= tempEndDate;
  };

  const isDateSelected = (date: Date) => {
    const dateString = formatDate(date);
    return dateString === tempStartDate || dateString === tempEndDate;
  };

  const isDateToday = (date: Date) => {
    return formatDate(date) === formatDate(today);
  };

  const isDatePast = (date: Date) => {
    return date < today && !isDateToday(date);
  };

  const quickPresets = [
    {
      label: 'Останні 7 днів',
      getDates: () => {
        const end = new Date(today);
        const start = new Date(today);
        start.setDate(start.getDate() - 6);
        return [formatDate(start), formatDate(end)];
      }
    },
    {
      label: 'Останні 30 днів',
      getDates: () => {
        const end = new Date(today);
        const start = new Date(today);
        start.setDate(start.getDate() - 29);
        return [formatDate(start), formatDate(end)];
      }
    },
    {
      label: 'Поточний місяць',
      getDates: () => {
        const start = new Date(currentYear, currentMonth, 1);
        const end = new Date(currentYear, currentMonth + 1, 0);
        return [formatDate(start), formatDate(end)];
      }
    },
    {
      label: 'Попередній місяць',
      getDates: () => {
        const start = new Date(currentYear, currentMonth - 1, 1);
        const end = new Date(currentYear, currentMonth, 0);
        return [formatDate(start), formatDate(end)];
      }
    }
  ];

  const handleQuickPreset = (startDate: string, endDate: string) => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    onDateRangeChange(startDate, endDate);
    setShowCalendar(false);
  };

  return (
    <div className="relative">
      {/* Period Display */}
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 w-full text-white hover:bg-white/20 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="text-left">
            <div className="text-sm text-white/70 mb-1">Період статистики</div>
            <div className="font-medium">
              {selectedStartDate && selectedEndDate ? (
                `${formatDisplayDate(selectedStartDate)} - ${formatDisplayDate(selectedEndDate)}`
              ) : (
                'Оберіть період'
              )}
            </div>
          </div>
          <div className="text-white/60">
            📅
          </div>
        </div>
      </button>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 z-50">
          {/* Quick Presets */}
          <div className="mb-4">
            <div className="text-white/70 text-sm mb-2">Швидкий вибір:</div>
            <div className="grid grid-cols-2 gap-2">
              {quickPresets.map((preset, index) => {
                const [start, end] = preset.getDates();
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickPreset(start, end)}
                    className="bg-purple-600/20 text-white px-3 py-2 rounded-lg text-sm hover:bg-purple-600/30 transition-colors border border-purple-500/30"
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-white font-medium mb-4 text-center">
              {today.toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' })}
            </div>
            
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map(day => (
                <div key={day} className="text-center text-white/60 text-sm font-medium py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays(currentYear, currentMonth).map((date, index) => {
                const dateString = formatDate(date);
                const isCurrentMonth = date.getMonth() === currentMonth;
                const isInRange = isDateInRange(date);
                const isSelected = isDateSelected(date);
                const isToday = isDateToday(date);
                const isPast = isDatePast(date);

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(date)}
                    disabled={isPast}
                    className={`
                      aspect-square text-sm rounded-lg transition-colors
                      ${isCurrentMonth ? 'text-white' : 'text-white/30'}
                      ${isPast ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'}
                      ${isSelected ? 'bg-purple-600 text-white font-bold' : ''}
                      ${isInRange && !isSelected ? 'bg-purple-600/30' : ''}
                      ${isToday && !isSelected ? 'bg-white/20 border border-white/40' : ''}
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleCancel}
              className="flex-1 bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors"
            >
              Скасувати
            </button>
            <button
              onClick={handleApply}
              disabled={!tempStartDate || !tempEndDate}
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Застосувати
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
