'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, 
  faNewspaper, 
  faExclamationTriangle,
  faCheckCircle,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '@/app/i18n/useTranslation';

interface DashboardStats {
  messages: {
    total: number;
    urgent: number;
    pending: number;
  };
  newsletter: {
    total: number;
    active: number;
  };
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminName, setAdminName] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del admin
        const sessionResponse = await fetch('/api/admin/auth/session');
        if (!sessionResponse.ok) {
          throw new Error('No session found');
        }
        const sessionData = await sessionResponse.json();
        setAdminName(sessionData.user.name);

        // Obtener estadísticas
        const statsResponse = await fetch('/api/admin/dashboard/stats');
        if (!statsResponse.ok) {
          throw new Error('Error fetching stats');
        }
        const statsData = await statsResponse.json();
        setStats(statsData);
      } catch (error) {
        setError(t('admin.dashboard.error.loading'));
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [t]);
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            {t('admin.dashboard.title')}
          </h1>
        </div>
        <div className="relative min-h-[400px] bg-zinc-900 rounded-lg">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center space-x-3 bg-zinc-800 px-4 py-2 rounded-lg">
              <FontAwesomeIcon 
                icon={faSpinner} 
                className="text-xl text-indigo-500 animate-spin" 
              />
              <span className="text-gray-300 text-sm">
                {t('admin.common.loading')}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-800 rounded-lg p-4">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-400 mr-3" />
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }
  
  if (!stats) return null;
  
  const cards = [
    {
      title: t('admin.dashboard.stats.totalMessages'),
      value: stats.messages.total,
      icon: faEnvelope,
      color: 'from-blue-600 to-blue-800'
    },
    {
      title: t('admin.dashboard.stats.urgentMessages'),
      value: stats.messages.urgent,
      icon: faExclamationTriangle,
      color: 'from-red-600 to-red-800'
    },
    {
      title: t('admin.dashboard.stats.pendingMessages'),
      value: stats.messages.pending,
      icon: faSpinner,
      color: 'from-yellow-600 to-yellow-800'
    },
    {
      title: t('admin.dashboard.stats.newsletterSubscribers'),
      value: stats.newsletter.total,
      icon: faNewspaper,
      color: 'from-green-600 to-green-800'
    }
  ];
  
  return (
    <div className="pt-24 px-8">
      <h1 className="text-2xl font-bold text-white mb-6">
        {t('admin.dashboard.welcome').replace('{name}', adminName)}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${card.color} rounded-lg p-6 shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">{card.title}</p>
                <p className="text-white text-2xl font-bold mt-2">{card.value}</p>
              </div>
              <FontAwesomeIcon icon={card.icon} className="text-white/50 text-3xl" />
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Gráfico de mensajes por estado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900 rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            {t('admin.dashboard.messageStatus.title')}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500" 
                  style={{ 
                    width: `${(stats.messages.total - stats.messages.pending) / stats.messages.total * 100}%` 
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-green-500">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                  {t('admin.dashboard.messageStatus.processed')}
                </span>
                <span className="text-white">
                  {stats.messages.total - stats.messages.pending}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500" 
                  style={{ 
                    width: `${stats.messages.pending / stats.messages.total * 100}%` 
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-yellow-500">
                  <FontAwesomeIcon icon={faSpinner} className="mr-1" />
                  {t('admin.dashboard.messageStatus.pending')}
                </span>
                <span className="text-white">
                  {stats.messages.pending}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Gráfico de suscriptores newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-900 rounded-lg p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            {t('admin.dashboard.subscriberStatus.title')}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500" 
                  style={{ 
                    width: `${stats.newsletter.active / stats.newsletter.total * 100}%` 
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-green-500">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                  {t('admin.dashboard.subscriberStatus.active')}
                </span>
                <span className="text-white">
                  {stats.newsletter.active}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500" 
                  style={{ 
                    width: `${(stats.newsletter.total - stats.newsletter.active) / stats.newsletter.total * 100}%` 
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-red-500">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
                  {t('admin.dashboard.subscriberStatus.inactive')}
                </span>
                <span className="text-white">
                  {stats.newsletter.total - stats.newsletter.active}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 