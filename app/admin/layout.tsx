'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { 
  faEnvelope, 
  faNewspaper, 
  faTachometer, 
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '@/app/i18n/useTranslation';
import Header from '@/app/components/layout/Header';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsLoading(false);
      return;
    }

    fetch('/api/admin/auth/session')
      .then(res => {
        if (!res.ok) throw new Error('Session invalid');
        return res.json();
      })
      .then(data => {
        setUser(data.user);
        setIsLoading(false);
      })
      .catch(() => {
        window.location.href = '/admin/login';
      });
  }, [pathname]);
  
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Header 
          isAdmin={true}
          user={null}
          onLogout={handleLogout}
        />
        {children}
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <FontAwesomeIcon icon={faSpinner} className="text-2xl text-indigo-500 animate-spin" />
      </div>
    );
  }
  
  if (!user) return null;

  const menuItems = [
    {
      icon: faTachometer,
      label: t('admin.dashboard.title'),
      href: '/admin/dashboard',
      active: pathname === '/admin/dashboard'
    },
    {
      icon: faEnvelope,
      label: t('admin.messages.title'),
      href: '/admin/messages',
      active: pathname === '/admin/messages'
    },
    {
      icon: faNewspaper,
      label: t('admin.newsletter.title'),
      href: '/admin/newsletter',
      active: pathname === '/admin/newsletter'
    }
  ];
  
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <Header 
        isAdmin={true}
        user={user}
        onLogout={handleLogout}
      />
      <div className="flex flex-1">
        <motion.aside 
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-64 bg-zinc-900 border-r border-zinc-800"
        >
          <div className="h-16 flex items-center justify-center border-b border-zinc-800">
            <h1 className="text-xl font-bold text-white">
              {t('admin.title')}
            </h1>
          </div>
          
          <nav className="mt-6">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-6 py-3 text-sm ${
                      item.active
                        ? 'text-white bg-indigo-600'
                        : 'text-gray-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </motion.aside>
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 