'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faShieldAlt, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../i18n/useTranslation';

interface FooterProps {
  customClass?: string;
}

export default function Footer({ customClass = '' }: FooterProps) {
  const { t } = useTranslation();
  
  const links = [
    {
      href: '/',
      label: t('nav.home', 'Home'),
      isProductLink: false,
      disabled: false,
      isAnchor: false
    },
    {
      href: '/about',
      label: t('nav.about', 'About'),
      isProductLink: false,
      disabled: false,
      isAnchor: false
    },
    {
      href: '/resources',
      label: t('nav.privacy', 'Privacy'),
      isProductLink: false,
      disabled: false,
      isAnchor: false
    },
    {
      href: '/contact',
      label: t('nav.contact', 'Contact'),
      isProductLink: false,
      disabled: false,
      isAnchor: false
    }
  ];
  
  const legalLinks = [
    {
      href: '/privacy-policy',
      label: t('footer.privacy', 'Privacy Policy')
    },
    {
      href: '/terms',
      label: t('footer.terms', 'Terms of Service')
    },
    {
      href: '/contact',
      label: t('footer.contact', 'Contact')
    }
  ];

  return (
    <footer className={`relative overflow-hidden py-12 ${customClass}`} 
      style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9))',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(99, 102, 241, 0.2)'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
              Privacy Matter
            </h2>
            <p className="text-zinc-400 mb-4">
              {t('footer.description', 'Protecting your economic rights and privacy in an increasingly surveilled world.')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="gradient-icon hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faEnvelope} size="lg" />
              </a>
              <a href="#" className="gradient-icon hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faShieldAlt} size="lg" />
              </a>
              <a href="#" className="gradient-icon hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faFileAlt} size="lg" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
              {t('footer.quickLinks', 'Enlaces')}
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
        
        <div className="border-t border-zinc-800/50 mt-12 pt-8 text-center">
          <p className="text-zinc-500">
            &copy; {new Date().getFullYear()} Privacy Matter. {t('footer.rights', 'All rights reserved')}
          </p>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/5 to-purple-900/5 pointer-events-none" />
    </footer>
  );
} 