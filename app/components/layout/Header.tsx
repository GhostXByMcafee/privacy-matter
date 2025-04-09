'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSelector from './LanguageSelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../i18n/useTranslation';

interface HeaderProps {
  customClass?: string;
  isAdmin?: boolean;
  user?: {
    name: string;
    role: string;
  } | null;
  onLogout?: () => void;
}

export default function Header({ 
  customClass = '', 
  isAdmin = false,
  user = null,
  onLogout
}: HeaderProps) {
  const params = useParams();
  const pathname = usePathname();
  const locale = params?.locale as string || 'en';
  const [scrolled, setScrolled] = useState(false);  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const { t } = useTranslation();

  const currentPath = pathname?.replace(`/${locale}`, '') || '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const getPathForLocale = (newLocale: string) => {
    if (newLocale === 'en') {
      return currentPath || '/';
    }
    return `/${newLocale}${currentPath}`;
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'header-glass shadow-lg' : isAdmin ? 'bg-zinc-900' : 'bg-transparent'
        } ${isAdmin ? 'border-b border-zinc-800' : ''} ${customClass}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            <Link href={isAdmin ? '/admin/dashboard' : `/${locale === 'en' ? '' : locale}`} className="flex items-center">
              <div className="relative h-8 w-28 md:hidden mt-1">
                <Image 
                  src="/pm-logo.png" 
                  alt="Privacy Matters Logo"
                  width={112}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="relative h-9 w-9 mr-3 hidden md:block">
                <Image 
                  src="/pm-logo-sole.png" 
                  alt="Privacy Matters Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                  priority
                />
              </div>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl font-semibold text-white hidden sm:inline-block logo-text"
              >
                Privacy Matters
              </motion.span>
            </Link>
            
            <div className="flex items-center space-x-3 md:mt-0 mt-8">
              {isAdmin && user ? (
                <>
                  <div className="flex items-center mr-4">
                    <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
                    <span className="text-white">{user.name}</span>
                    <span className="ml-2 text-sm text-gray-500">({user.role})</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="contact-button py-3 px-4 rounded-md flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    {t('admin.dashboard.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href={locale === 'en' ? '/contact' : `/${locale}/contact`}
                    className={`contact-button py-3 px-4 rounded-md flex items-center justify-center ${
                      currentPath === '/contact' ? 'bg-indigo-600' : ''
                    }`}
                  >
                    <FontAwesomeIcon icon={faLock} className="mr-2" />
                    {t('nav.contact', 'Contacto Seguro')}
                  </Link>
                  <LanguageSelector mode="header" />
                </>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {!isAdmin && (
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 menu-backdrop md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm menu-container shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="h-20" />
                <div className="py-5 px-6">
                  <motion.div 
                    className="pt-6 mt-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <LanguageSelector customClass="flex items-center p-3" />
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="absolute bottom-0 left-0 right-0 p-6 text-center"
                >
                  <span className="text-sm text-gray-400">© {new Date().getFullYear()} Privacy Matters</span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}