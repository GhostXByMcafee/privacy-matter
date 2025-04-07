'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '@/app/i18n/useTranslation';

export default function AdminLogin() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('admin.login.form.error'));
      }

      // Redirección forzada
      window.location.replace('/admin/dashboard');
      return;
      
    } catch (error) {
      setError(error instanceof Error ? error.message : t('admin.login.form.error'));
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            {t('admin.login.title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            {t('admin.login.subtitle')}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {t('admin.login.form.email.label')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-zinc-700 placeholder-zinc-500 text-white bg-zinc-800 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t('admin.login.form.email.placeholder')}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t('admin.login.form.password.label')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-zinc-700 placeholder-zinc-500 text-white bg-zinc-800 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder={t('admin.login.form.password.placeholder')}
              />
            </div>
          </div>
          
          {error && (
            <div className="rounded-md bg-red-900/50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-400">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading 
                  ? 'bg-indigo-600/50 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  {t('admin.login.form.signing')}
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faLock} className="mr-2" />
                  {t('admin.login.form.submit')}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 