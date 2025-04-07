'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, 
  faExclamationTriangle,
  faCheckCircle,
  faHourglassHalf,
  faArchive,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '@/app/i18n/useTranslation';

interface Message {
  id: string;
  alias: string;
  email: string;
  message: string;
  priority: 'URGENT' | 'NORMAL' | 'LOW';
  status: 'PENDING' | 'PROCESSING' | 'RESOLVED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  total: number;
  pages: number;
  currentPage: number;
  perPage: number;
}

export default function MessagesPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority })
      });
      
      const response = await fetch(`/api/admin/messages?${queryParams}`);
      if (!response.ok) {
        throw new Error(t('admin.messages.error.loading'));
      }
      
      const data = await response.json();
      setMessages(data.messages);
      setPagination(data.pagination);
    } catch (error) {
      setError(t('admin.messages.error.loading'));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMessages();
  }, [currentPage, filters]);
  
  const handleStatusChange = async (messageId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: messageId,
          status: newStatus
        }),
      });
      
      if (!response.ok) {
        throw new Error(t('admin.messages.error.update'));
      }
      
      fetchMessages();
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <FontAwesomeIcon icon={faHourglassHalf} className="text-yellow-500" />;
      case 'PROCESSING':
        return <FontAwesomeIcon icon={faSpinner} className="text-blue-500 animate-spin" />;
      case 'RESOLVED':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
      case 'ARCHIVED':
        return <FontAwesomeIcon icon={faArchive} className="text-gray-500" />;
      default:
        return null;
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'text-red-500';
      case 'NORMAL':
        return 'text-blue-500';
      case 'LOW':
        return 'text-gray-500';
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            {t('admin.messages.title')}
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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white"
        >
          {t('admin.messages.title')}
        </motion.h1>
        
        <div className="flex space-x-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="">{t('admin.messages.filters.allStates')}</option>
            <option value="PENDING">{t('admin.messages.status.pending')}</option>
            <option value="PROCESSING">{t('admin.messages.status.processing')}</option>
            <option value="RESOLVED">{t('admin.messages.status.resolved')}</option>
            <option value="ARCHIVED">{t('admin.messages.status.archived')}</option>
          </select>
          
          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="">{t('admin.messages.filters.allPriorities')}</option>
            <option value="URGENT">{t('admin.messages.priority.urgent')}</option>
            <option value="NORMAL">{t('admin.messages.priority.normal')}</option>
            <option value="LOW">{t('admin.messages.priority.low')}</option>
          </select>
        </div>
      </div>
      
      <div className="bg-zinc-900 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-800">
            <thead className="bg-zinc-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('admin.messages.table.status')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('admin.messages.table.alias')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('admin.messages.table.email')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('admin.messages.table.message')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('admin.messages.table.priority')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('admin.messages.table.date')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('admin.messages.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {messages.map((message) => (
                <tr key={message.id} className="hover:bg-zinc-800/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(message.status)}
                      <span className="ml-2 text-sm text-gray-300">
                        {message.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {message.alias}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {message.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    <div className="max-w-xs truncate">
                      {message.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${getPriorityColor(message.priority)}`}>
                      {message.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(message.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <select
                      value={message.status}
                      onChange={(e) => handleStatusChange(message.id, e.target.value)}
                      className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1"
                    >
                      <option value="PENDING">{t('admin.messages.status.pending')}</option>
                      <option value="PROCESSING">{t('admin.messages.status.processing')}</option>
                      <option value="RESOLVED">{t('admin.messages.status.resolved')}</option>
                      <option value="ARCHIVED">{t('admin.messages.status.archived')}</option>
                    </select>
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
            {t('admin.messages.pagination.showing')
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
              {t('admin.messages.pagination.previous')}
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
              {t('admin.messages.pagination.next')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 