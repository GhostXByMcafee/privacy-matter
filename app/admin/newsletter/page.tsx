'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, 
  faExclamationTriangle,
  faCheckCircle,
  faTimesCircle,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '@/app/i18n/useTranslation';

interface Subscription {
  id: string;
  email: string;
  emailHash: string;
  subscribedAt: string;
  active: boolean;
}

interface PaginationInfo {
  total: number;
  pages: number;
  currentPage: number;
  perPage: number;
}

export default function NewsletterPage() {
  const { t } = useTranslation();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    active: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        ...(filters.active && { active: filters.active })
      });
      
      const response = await fetch(`/api/admin/newsletter?${queryParams}`);
      if (!response.ok) {
        throw new Error(t('admin.newsletter.fetch.error'));
      }
      
      const data = await response.json();
      setSubscriptions(data.subscriptions);
      setPagination(data.pagination);
    } catch (error) {
      setError(t('admin.newsletter.fetch.error'));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSubscriptions();
  }, [currentPage, filters]);
  
  const handleStatusChange = async (subscriptionId: string, active: boolean) => {
    try {
      const response = await fetch('/api/admin/newsletter', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: subscriptionId,
          active
        }),
      });
      
      if (!response.ok) {
        throw new Error(t('admin.newsletter.update.error'));
      }
      
      fetchSubscriptions();
    } catch (error) {
      console.error(t('admin.newsletter.update.error'), error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            {t('admin.newsletter.title')}
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
  
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        {t('admin.newsletter.noSubscriptions')}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white"
        >
          {t('admin.newsletter.title')}
        </motion.h1>
        
        <div className="flex space-x-4">
          <select
            value={filters.active}
            onChange={(e) => setFilters(prev => ({ ...prev, active: e.target.value }))}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="">{t('admin.newsletter.filters.allStates')}</option>
            <option value="true">{t('admin.newsletter.filters.active')}</option>
            <option value="false">{t('admin.newsletter.filters.inactive')}</option>
          </select>
        </div>
      </div>
      
      <div className="bg-zinc-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-800">
            <thead className="bg-zinc-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('admin.newsletter.table.status')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('admin.newsletter.table.email')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('admin.newsletter.table.subscriptionDate')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('admin.newsletter.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {subscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-zinc-800/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FontAwesomeIcon 
                        icon={subscription.active ? faCheckCircle : faTimesCircle} 
                        className={subscription.active ? 'text-green-500' : 'text-red-500'} 
                      />
                      <span className="ml-2 text-sm text-gray-300">
                        {subscription.active ? t('admin.newsletter.status.active') : t('admin.newsletter.status.inactive')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {subscription.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(subscription.subscribedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      onClick={() => handleStatusChange(subscription.id, !subscription.active)}
                      className={`px-3 py-1 rounded-lg ${
                        subscription.active
                          ? 'bg-red-900/50 text-red-400 hover:bg-red-900'
                          : 'bg-green-900/50 text-green-400 hover:bg-green-900'
                      }`}
                    >
                      {subscription.active ? t('admin.newsletter.actions.deactivate') : t('admin.newsletter.actions.activate')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {pagination && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {t('admin.newsletter.pagination.showing')
              .replace('{from}', String((pagination.currentPage - 1) * pagination.perPage + 1))
              .replace('{to}', String(Math.min(pagination.currentPage * pagination.perPage, pagination.total)))
              .replace('{total}', String(pagination.total))}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            >
              {t('admin.common.previous')}
            </button>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
              disabled={currentPage === pagination.pages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === pagination.pages
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            >
              {t('admin.common.next')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 