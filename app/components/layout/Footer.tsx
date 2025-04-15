'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faShieldAlt, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../i18n/useTranslation';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface FooterProps {
  customClass?: string;
}

export default function Footer({ customClass = '' }: FooterProps) {
  const { t } = useTranslation();
  const params = useParams();
  const locale = params?.locale as string || 'en';
  
  const links = [
    {
      href: `/${locale}`,
      label: t('nav.home'),
      isProductLink: false,
      disabled: false,
      isAnchor: false
    },
    {
      href: `/${locale}/about`,
      label: t('nav.about'),
      isProductLink: false,
      disabled: false,
      isAnchor: false
    },
    {
      href: `/${locale}/privacy`,
      label: t('nav.privacy'),
      isProductLink: false,
      disabled: false,
      isAnchor: false
    }
  ];
  
  const legalLinks = [
    /*
    {
      href: `/${locale}/privacy-policy`,
      label: t('footer.privacy'),
      icon: faShieldAlt
    },
    {
      href: `/${locale}/terms`,
      label: t('footer.terms'),
      icon: faFileAlt
    },
    */
    {
      href: `/${locale}/contact`,
      label: t('footer.contact'),
      icon: faEnvelope
    }
  ];

  return (
    <footer className={`relative overflow-hidden py-12 bg-[#030712] ${customClass}`} 
      style={{
        borderTop: '1px solid rgba(99, 102, 241, 0.1)'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] to-black opacity-90 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href={`/${locale === 'en' ? '' : locale}`} className="flex items-center mb-4">
              <div className="relative h-9 w-9 mr-3">
                <Image 
                  src="/pm-logo-sole.png" 
                  alt="Privacy Matters Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-semibold text-white">
                Privacy Matters
              </span>
            </Link>
            <p className="text-zinc-400 mb-4">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {legalLinks.map((link, index) => (
                <Link 
                  key={index}
                  href={link.href}
                  className="gradient-icon hover:scale-110 transition-transform"
                >
                  <FontAwesomeIcon icon={link.icon} size="lg" />
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors hover:translate-x-1 inline-block transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
              Legal
            </h3>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors hover:translate-x-1 inline-block transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-zinc-800/50 mt-12 pt-8">
          <div className="flex items-center justify-center space-x-2 text-zinc-400">
            <span>{t('footer.madeWith')}</span>
            <span className="text-red-500">❤️</span>
            <span>{t('footer.by')}</span>
            <motion.a
              href="https://dexkit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut"
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-lg filter blur-xl"
                animate={{
                  opacity: [0.5, 0.7, 0.5],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <Image
                src="/dexkitLogo.png"
                alt="DexKit"
                width={120}
                height={40}
                className="relative z-10 transition-all duration-300 hover:brightness-110"
              />
            </motion.a>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/5 to-purple-900/5 pointer-events-none opacity-20" />
    </footer>
  );
} 