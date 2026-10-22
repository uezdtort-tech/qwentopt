import React from 'react';

interface SocialButtonProps {
  provider: 'yandex' | 'vk';
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function SocialAuthButton({ provider, onClick, loading, disabled }: SocialButtonProps) {
  const configs = {
    yandex: {
      label: 'Войти через Яндекс ID',
      bgColor: 'bg-[#FFCC00]',
      hoverColor: 'hover:bg-[#FFD633]',
      textColor: 'text-black',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm1.5 15h-2.25V9.75L6.5 5.5h2.5l1.75 3.5 1.75-3.5h2.5l-2.75 4.25V15z" fill="black"/>
        </svg>
      ),
    },
    vk: {
      label: 'Войти через VK ID',
      bgColor: 'bg-[#0077FF]',
      hoverColor: 'hover:bg-[#0066DD]',
      textColor: 'text-white',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.7 14.4c-4.2 0-6.6-2.9-6.7-7.7h2.1c.1 3.5 1.6 5 2.8 5.3V6.7h2v2.9c1.2-.1 2.4-1.5 2.8-2.9h2c-.3 1.7-1.5 3-2.4 3.5.9.4 2.3 1.5 2.8 3.5h-2.2c-.4-1.3-1.4-2.3-3-2.5v2.5h-.2z" fill="white"/>
        </svg>
      ),
    },
  };

  const config = configs[provider];

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${config.bgColor} ${config.hoverColor} ${config.textColor} disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        config.icon
      )}
      <span>{loading ? 'Подключение...' : config.label}</span>
    </button>
  );
}
