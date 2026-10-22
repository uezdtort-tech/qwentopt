import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getOAuthService } from '../services/oauth';
import { handleOAuthUser } from '../services/supabaseAuth';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Обработка авторизации...');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useApp();

  useEffect(() => {
    processCallback();
  }, []);

  const processCallback = async () => {
    const oauthService = getOAuthService();
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Обработка ошибки от провайдера
    if (error) {
      setStatus('error');
      setError(errorDescription || `Ошибка авторизации: ${error}`);
      return;
    }

    try {
      // Обработка callback
      const result = await oauthService.handleCallback();

      if ('error' in result) {
        setStatus('error');
        setError(result.error);
        return;
      }

      const { user, returnUrl } = result;

      // Обработка пользователя через Supabase
      const authResult = await handleOAuthUser(user);

      if (!authResult.success) {
        if (authResult.needsLinking) {
          setStatus('error');
          setError(authResult.error || 'Необходимо связать аккаунты');
          return;
        }
        setStatus('error');
        setError(authResult.error || 'Ошибка авторизации');
        return;
      }

      // Успешная авторизация
      setStatus('success');
      setMessage('Авторизация успешна! Перенаправляем...');

      // Определяем роль и перенаправляем
      // В production роль берётся из профиля Supabase
      const role: 'buyer' | 'seller' = 'buyer'; // По умолчанию для новых пользователей
      login(role);

      setTimeout(() => {
        navigate(returnUrl || '/');
      }, 1000);
    } catch (err) {
      setStatus('error');
      setError('Произошла ошибка при обработке авторизации');
      console.error('OAuth callback error:', err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl border border-cream-dark p-8 shadow-sm">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-berry mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-semibold text-graphite mb-2">Обработка авторизации</h2>
              <p className="text-sm text-graphite-light">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-sage mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-graphite mb-2">Добро пожаловать!</h2>
              <p className="text-sm text-graphite-light">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="w-16 h-16 text-berry mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-graphite mb-2">Ошибка авторизации</h2>
              <p className="text-sm text-berry mb-4">{error}</p>
              <button
                onClick={() => navigate('/auth')}
                className="bg-berry text-white px-6 py-2.5 rounded-xl font-medium hover:bg-berry-dark transition-colors"
              >
                Вернуться на страницу входа
              </button>
            </>
          )}
        </div>

        {status === 'error' && (
          <div className="mt-6 bg-cream rounded-xl p-4 border border-cream-dark">
            <p className="text-xs text-graphite-light">
              <strong>Возможные причины:</strong> истёк срок действия кода, неверный state параметр, 
              отмена авторизации пользователем или сетевая ошибка. Попробуйте войти снова.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
