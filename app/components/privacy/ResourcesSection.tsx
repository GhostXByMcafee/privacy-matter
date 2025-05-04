'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faFileAlt, faVideo, faPodcast } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../i18n/useTranslation';

interface ResourcesSectionProps {
  customClass?: string;
}

export default function ResourcesSection({ customClass = '' }: ResourcesSectionProps) {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [isClient, setIsClient] = useState(false);
  
  const resources = [
    {
      id: 'guide1',
      title: t('privacy.resources.items.guide1.title'),
      description: t('privacy.resources.items.guide1.description'),
      type: t('privacy.resources.types.guide'),
      icon: faBook,
      url: 'https://blog.privacymatter.org/post/the-beginners-guide-to-digital-privacy/'
    },
    {
      id: 'article1',
      title: t('privacy.resources.items.article1.title'),
      description: t('privacy.resources.items.article1.description'),
      type: t('privacy.resources.types.article'),
      icon: faFileAlt,
      url: 'https://blog.privacymatter.org/post/lock-the-digital-door-a-beginners-guide-to-strong-passwords/'
    },
    {
      id: 'video1',
      title: t('privacy.resources.items.video1.title'),
      description: t('privacy.resources.items.video1.description'),
      type: t('privacy.resources.types.video'),
      icon: faVideo,
      url: 'https://blog.privacymatter.org/post/how-to-stay-safe-online-with-free-vpns/'
    }
    /* 
    {
      id: 'podcast1',
      title: t('privacy.resources.items.podcast1.title'),
      description: t('privacy.resources.items.podcast1.description'),
      type: t('privacy.resources.types.podcast'),
      icon: faPodcast,
      url: '#'
    }
    */
  ];
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };
  
  const childVariants = {
    hidden: { 
      opacity: 0, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  const [randomCodes, setRandomCodes] = useState<string[]>([]);

  const codeLines = [
    "const financialRights = privacy.getEconomicRights();",
    "privacy.detectFinancialSurveillance();",
    "const legalStrategy = privacy.buildLegalDefense();",
    "privacy.analyzeAssetRisks(userFinances);",
    "resources.contactLegalNetwork();",
    "privacy.encryptFinancialRecords();",
    "const ghostXWallet = new privacy.GhostXWallet();",
    "privacy.createAnonymousAccount(user);",
    "const violations = await privacy.detectRightsViolations();",
    "if (violations.length > 0) { privacy.connectWithAttorney(violations); }",
    "privacy.anonymizeTransactionHistory();",
    "const secureChannel = privacy.establishConfidentialCommunication();",
    "privacy.protectFinancialMetadata();",
    "const compensation = privacy.calculateLegalFees();",
    "privacy.allocateGhostXTokens(attorneyID);",
    "resources.accessLegalPrecedents();",
    "privacy.documentEconomicViolations();",
    "user.assessJurisdictionalRisks();",
    "privacy.secureFinancialAssets();",
    "const legalTeam = privacy.findSpecializedAttorneys();",
    "privacy.establishLegalConfidentiality();"
  ];

  useEffect(() => {
    setIsClient(true);
    const codes = Array(25).fill(0).map(() => 
      Math.random().toString(36).substring(2, 9) + '.' + 
      Math.random().toString(36).substring(2, 9)
    );
    setRandomCodes(codes);
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className={`relative overflow-hidden py-24 bg-black ${customClass}`}
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #000000 100%)'
      }}
      id="resources-section"
    >
      <div className="privacy-gradient absolute top-0 left-0 w-full h-full opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tools-heading inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
            {t('privacy.resources.title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-6">
            {t('privacy.resources.subtitle')}
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="tools-grid grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              variants={childVariants}
              className="privacy-tool-card rounded-xl p-6 transform"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className={`mb-6 w-16 h-16 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center privacy-tool-icon`}
                whileHover={{ rotate: 5 }}
              >
                <FontAwesomeIcon icon={resource.icon} className="text-white h-8 w-8" />
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-3 text-white">
                {resource.title}
              </h3>
              
              <p className="text-gray-300 mb-6 min-h-[80px]">
                {resource.description}
              </p>
              
              <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                <motion.button 
                  className={`privacy-tool-button bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-6 rounded-full w-full`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('common.learnMore')}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {isClient && (
        <div className="code-lines absolute inset-0 overflow-hidden opacity-10 z-0 pointer-events-none">
          {codeLines.map((line, index) => (
            <div 
              key={index} 
              className="code-line text-indigo-300 font-mono text-sm" 
              style={{
                position: 'absolute',
                left: `${Math.floor(Math.random() * 85)}%`,
                top: `${Math.floor(Math.random() * 100)}%`,
                transform: `rotate(${Math.random() * 5 - 2.5}deg)`,
                opacity: 0.8,
                textShadow: '0 0 12px rgba(99, 102, 241, 0.5)'
              }}
            >
              {line}
            </div>
          ))}
          {randomCodes.map((code, index) => (
            <div 
              key={`rand-${index}`} 
              className="code-line text-blue-300 font-mono text-xs" 
              style={{
                position: 'absolute',
                left: `${Math.floor(Math.random() * 90)}%`,
                top: `${Math.floor(Math.random() * 100)}%`,
                transform: `rotate(${Math.random() * 5 - 2.5}deg)`,
                opacity: 0.7,
                textShadow: '0 0 8px rgba(59, 130, 246, 0.5)'
              }}
            >
              {code}
            </div>
          ))}
          
          {Array(15).fill(0).map((_, index) => (
            <div 
              key={`extra-${index}`} 
              className="code-line text-cyan-300 font-mono text-xs" 
              style={{
                position: 'absolute',
                left: `${Math.floor(Math.random() * 95)}%`,
                top: `${Math.floor(Math.random() * 100)}%`,
                transform: `rotate(${Math.random() * 5 - 2.5}deg)`,
                opacity: 0.65,
                textShadow: '0 0 8px rgba(6, 182, 212, 0.5)'
              }}
            >
              {`const ${Math.random().toString(36).substring(2, 5)}_${Math.random().toString(36).substring(2, 5)} = ${Math.floor(Math.random() * 1000)};`}
            </div>
          ))}
          
          {Array(10).fill(0).map((_, index) => (
            <div 
              key={`fragment-${index}`} 
              className="code-line text-purple-300 font-mono text-xs" 
              style={{
                position: 'absolute',
                left: `${Math.floor(Math.random() * 80)}%`,
                top: `${Math.floor(Math.random() * 100)}%`,
                transform: `rotate(${Math.random() * 5 - 2.5}deg)`,
                opacity: 0.7,
                textShadow: '0 0 10px rgba(147, 51, 234, 0.5)'
              }}
            >
              {`function secureAssets${Math.random().toString(36).substring(2, 6)}() { return ghostX.protect(); }`}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}