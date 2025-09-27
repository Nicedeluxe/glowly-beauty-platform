'use client';

import { useState } from 'react';
import { User } from '../contexts/AuthContext';

interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  editable?: boolean;
  onImageChange?: (file: File) => void;
}

export default function Avatar({ user, size = 'md', className = '', editable = false, onImageChange }: AvatarProps) {
  const [localImage, setLocalImage] = useState<string | null>(null);
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500', 
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ];
    
    // Use name to get consistent color
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Будь ласка, виберіть файл зображення');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Розмір файлу не повинен перевищувати 5MB');
        return;
      }

      // Create local URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLocalImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Call parent callback
      if (onImageChange) {
        onImageChange(file);
      }
    }
  };

  const imageSrc = localImage || user.avatar;

  if (editable) {
    return (
      <div className="relative">
        <label className="cursor-pointer">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={user.name}
              className={`${sizeClasses[size]} rounded-full object-cover ${className} hover:opacity-80 transition-opacity`}
            />
          ) : (
            <div className={`${sizeClasses[size]} rounded-full ${getRandomColor(user.name)} flex items-center justify-center text-white font-semibold ${className} hover:opacity-80 transition-opacity`}>
              {getInitials(user.name)}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {editable && (
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
            <svg className="w-3 h-3 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    );
  }

  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt={user.name}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full ${getRandomColor(user.name)} flex items-center justify-center text-white font-semibold ${className}`}>
      {getInitials(user.name)}
    </div>
  );
}
