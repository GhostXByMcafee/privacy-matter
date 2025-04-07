'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGavel, faCoins, faHandshake, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../i18n/useTranslation';

interface PrivacyToolsProps {
  customClass?: string;
}

export default function PrivacyTools({ customClass = '' }: PrivacyToolsProps) {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [randomCodes, setRandomCodes] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  const codeLines = [
    "const privacy = require('privacy-matters');",
    "const user = new privacy.SecureUser();",
    "user.enableEncryption('aes-256-gcm');",
    "user.protectData();",
    "privacy.secureConnection();",
    "privacy.enableVPN();",
    "privacy.protectMetadata();",
    "user.encryptFiles();",
    "privacy.createSecureBackup();",
    "const vpn = new privacy.VPN('military-grade');",
    "vpn.connect('secure-server-12');",
    "privacy.maskBrowsingActivity();",
    "user.generateStrongPassword(32);",
    "privacy.checkForLeaks(email);",
    "vpn.enableKillSwitch();",
    "const messenger = privacy.createE2EChat();",
    "messenger.verifyKeys(recipient);",
    "privacy.routeThroughTor();",
    "const browser = privacy.secureBrowser();",
    "browser.blockTrackers();",
    "browser.enablePrivateMode();"
  ];
  
  useEffect(() => {
    setIsClient(true);
    
    const codes = Array(25).fill(0).map(() => 
      Math.random().toString(36).substring(2, 9) + '.' + 
      Math.random().toString(36).substring(2, 9)
    );
    setRandomCodes(codes);
  }, []);
  
  const services = [
    {
      icon: faGavel,
      title: 'privacy.tools.legalAssistance.title',
      description: 'privacy.tools.legalAssistance.description',
      href: '/legal-assistance',
      cta: 'privacy.tools.legalAssistance.cta'
    },
    {
      icon: faCoins,
      title: 'privacy.tools.ghostX.title',
      description: 'privacy.tools.ghostX.description',
      href: '/ghostx',
      cta: 'privacy.tools.ghostX.cta'
    },
    {
      icon: faHandshake,
      title: 'privacy.tools.attorneyNetwork.title',
      description: 'privacy.tools.attorneyNetwork.description',
      href: '/attorney-network',
      cta: 'privacy.tools.attorneyNetwork.cta'
    },
    {
      icon: faUserShield,
      title: 'privacy.tools.financialPrivacy.title',
      description: 'privacy.tools.financialPrivacy.description',
      href: '/financial-privacy',
      cta: 'privacy.tools.financialPrivacy.cta'
    }
  ];
  
  return (
    <section 
      ref={sectionRef} 
      id="privacy-tools"
      className={`relative overflow-hidden py-24 bg-black ${customClass}`}
      style={{
        background: 'linear-gradient(to bottom, #000000, #030712)'
      }}
    >
      <div className="privacy-gradient absolute top-0 left-0 w-full h-full opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tools-heading inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
            {t('privacy.tools.heading', 'Protection Services')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-6">
            {t('privacy.tools.subheading', 'We protect your economic rights and financial privacy in countries with oppressive regimes')}
          </p>
        </motion.div>
        
        <div className="tools-grid grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 15, 
                delay: 0.2 + index * 0.1 
              }}
              className="privacy-tool-card rounded-xl p-6 transform"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className={`mb-6 w-16 h-16 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center privacy-tool-icon`}
                whileHover={{ rotate: 5 }}
              >
                <FontAwesomeIcon icon={service.icon} className="text-white h-8 w-8" />
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-3 text-white">
                {t(service.title)}
              </h3>
              
              <p className="text-gray-300 mb-6 min-h-[80px]">
                {t(service.description)}
              </p>
              
              <Link href={service.href}>
                <motion.button 
                  className={`privacy-tool-button bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-6 rounded-full w-full`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t(service.cta)}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <Link href="/tools">
            <motion.button 
              className="footer-language-btn bg-transparent border-2 border-blue-500 text-white hover:bg-blue-900/30 px-8 py-4 rounded-full font-medium text-lg inline-flex items-center space-x-2"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span>{t('viewAll')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
      
      {isClient && (
        <div className="code-lines absolute inset-0 overflow-hidden opacity-15 z-0 pointer-events-none">
          {codeLines.map((line, index) => (
            <div 
              key={index} 
              className="code-line text-blue-300 font-mono text-sm" 
              style={{
                position: 'absolute',
                left: `${Math.floor(Math.random() * 85)}%`,
                top: `${Math.floor(Math.random() * 100)}%`,
                transform: `rotate(${Math.random() * 5 - 2.5}deg)`,
                opacity: 0.8,
                textShadow: '0 0 12px rgba(59, 130, 246, 0.5)'
              }}
            >
              {line}
            </div>
          ))}
          {randomCodes.map((code, index) => (
            <div 
              key={`rand-${index}`} 
              className="code-line text-cyan-300 font-mono text-xs" 
              style={{
                position: 'absolute',
                left: `${Math.floor(Math.random() * 90)}%`,
                top: `${Math.floor(Math.random() * 100)}%`,
                transform: `rotate(${Math.random() * 5 - 2.5}deg)`,
                opacity: 0.7,
                textShadow: '0 0 8px rgba(6, 182, 212, 0.5)'
              }}
            >
              {code}
            </div>
          ))}
          
          {Array(15).fill(0).map((_, index) => (
            <div 
              key={`extra-${index}`} 
              className="code-line text-indigo-300 font-mono text-xs" 
              style={{
                position: 'absolute',
                left: `${Math.floor(Math.random() * 95)}%`,
                top: `${Math.floor(Math.random() * 100)}%`,
                transform: `rotate(${Math.random() * 5 - 2.5}deg)`,
                opacity: 0.65,
                textShadow: '0 0 8px rgba(99, 102, 241, 0.5)'
              }}
            >
              {`const ${Math.random().toString(36).substring(2, 5)}_key = "${Math.random().toString(36).substring(2, 15)}";`}
            </div>
          ))}
          
          {Array(10).fill(0).map((_, index) => (
            <div 
              key={`fragment-${index}`} 
              className="code-line text-sky-300 font-mono text-xs" 
              style={{
                position: 'absolute',
                left: `${Math.floor(Math.random() * 80)}%`,
                top: `${Math.floor(Math.random() * 100)}%`,
                transform: `rotate(${Math.random() * 5 - 2.5}deg)`,
                opacity: 0.7,
                textShadow: '0 0 10px rgba(14, 165, 233, 0.5)'
              }}
            >
              {`function protect${Math.random().toString(36).substring(2, 6)}() { return privacy.shield(); }`}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}