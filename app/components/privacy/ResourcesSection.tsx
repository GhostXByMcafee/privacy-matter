'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faFileAlt, faVideo, faPodcast, faPaperPlane, faCheckCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../i18n/useTranslation';

interface ResourcesSectionProps {
  customClass?: string;
}

export default function ResourcesSection({ customClass = '' }: ResourcesSectionProps) {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const resources = [
    {
      id: 'guide1',
      title: t('privacy.resources.items.guide1.title', 'Guía de Privacidad Básica'),
      description: t('privacy.resources.items.guide1.description', 'Learn fundamental concepts of digital privacy'),
      type: t('privacy.resources.types.guide', 'Guide'),
      icon: faBook,
      url: '#'
    },
    {
      id: 'article1',
      title: t('privacy.resources.items.article1.title', 'Protect Your Passwords'),
      description: t('privacy.resources.items.article1.description', 'Best practices for password management'),
      type: t('privacy.resources.types.article', 'Article'),
      icon: faFileAlt,
      url: '#'
    },
    {
      id: 'video1',
      title: t('privacy.resources.items.video1.title', 'VPN Setup'),
      description: t('privacy.resources.items.video1.description', 'Step-by-step tutorial for setting up a VPN'),
      type: t('privacy.resources.types.video', 'Video'),
      icon: faVideo,
      url: '#'
    },
    {
      id: 'podcast1',
      title: t('privacy.resources.items.podcast1.title', 'The Future of Privacy'),
      description: t('privacy.resources.items.podcast1.description', 'Interview with digital privacy experts'),
      type: t('privacy.resources.types.podcast', 'Podcast'),
      icon: faPodcast,
      url: '#'
    }
  ];
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  
  const childVariants = {
    hidden: { 
      y: 50, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
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
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscriptionStatus('loading');
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setSubscriptionStatus('success');
        setEmail('');
      } else {
        const data = await response.json();
        console.error('Error in subscription:', data.error);
        setSubscriptionStatus('error');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      setSubscriptionStatus('error');
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className={`relative overflow-hidden py-24 bg-black ${customClass}`}
      style={{
        background: 'linear-gradient(to bottom, #030712, #000000)'
      }}
      id="resources-section"
    >
      <div className="absolute top-0 right-0 bottom-0 left-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-64 -left-64 w-96 h-96 bg-indigo-900/20 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/3 -right-48 w-96 h-96 bg-cyan-900/15 rounded-full filter blur-3xl"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
            {t('privacy.resources.heading', 'Privacy Resources')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-6">
            {t('privacy.resources.subheading', 'Educational materials and tools to help you understand and implement digital privacy')}
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              variants={childVariants}
              className="resource-card rounded-xl h-full"
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-8 flex flex-col h-full">
                <div className="flex items-center mb-3">
                  <motion.div 
                    className="mb-6 w-16 h-16 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center"
                    whileHover={{ rotate: 5 }}
                  >
                    <FontAwesomeIcon icon={resource.icon} className="text-white h-8 w-8" />
                  </motion.div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{resource.title}</h3>
                    <span className="text-sm text-gray-400">{resource.type}</span>
                  </div>
                </div>
                
                <p className="text-gray-300 flex-grow mb-6">{t(resource.description)}</p>
                
                <Link href={resource.url}>
                  <motion.button 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-6 rounded-full w-full"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('common.learnMore', 'Learn More')}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-20 p-8 rounded-xl newsletter-container max-w-4xl mx-auto relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative z-10">
            <motion.h3 
              className="text-2xl md:text-3xl font-bold mb-4 text-center inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {t('privacy.resources.newsletter.title', 'Stay Informed About Your Rights')}
            </motion.h3>
            <p className="text-gray-300 text-center mb-8 mt-6">
              {t('privacy.resources.newsletter.description', 'Subscribe to our newsletter to receive updates on legal cases, news, and financial protection resources')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('privacy.resources.newsletter.placeholder', 'Your email address')}
                  required
                  className="flex-grow px-4 py-3 bg-zinc-800 rounded-lg text-white border border-zinc-700 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={subscriptionStatus === 'loading' || subscriptionStatus === 'success'}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                  {subscriptionStatus === 'loading' 
                    ? t('privacy.resources.newsletter.sending', 'Sending...') 
                    : subscriptionStatus === 'success'
                    ? t('privacy.resources.newsletter.success', 'Subscribed!') 
                    : t('privacy.resources.newsletter.subscribe', 'Subscribe')}
                </button>
              </form>
            </div>
            
            {subscriptionStatus === 'success' && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-400 mt-4 text-center"
              >
                {t('privacy.resources.newsletter.thankYou', 'Thank you for subscribing! You will soon receive our next newsletter.')}
              </motion.p>
            )}
            
            {subscriptionStatus === 'error' && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 mt-4 text-center"
              >
                {t('privacy.resources.newsletter.error', 'There was an error processing your subscription. Please try again.')}
              </motion.p>
            )}
            
            <p className="text-zinc-500 text-xs mt-4 text-center">
              {t('privacy.resources.newsletter.privacy', 'Your information will never be shared with third parties. We promise not to spam you.')}
            </p>
          </div>
          
          <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-indigo-600/10 rounded-full filter blur-2xl"></div>
          <div className="absolute -top-24 -left-24 w-56 h-56 bg-cyan-600/10 rounded-full filter blur-2xl"></div>
        </motion.div>
      </div>
      
      {isClient && (
        <div className="code-lines absolute inset-0 overflow-hidden opacity-15 z-0 pointer-events-none">
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