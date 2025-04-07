'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../i18n/useTranslation';

interface NewsletterSectionProps {
  customClass?: string;
}

export default function NewsletterSection({ customClass = '' }: NewsletterSectionProps) {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
        background: 'linear-gradient(180deg, #000000 0%, #000000 100%)'
      }}
    >
      <div className="privacy-gradient absolute top-0 left-0 w-full h-full opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="privacy-tool-card p-8 rounded-xl max-w-4xl mx-auto relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative z-10">
            <motion.h3 
              className="text-3xl md:text-4xl font-bold mb-6 tools-heading inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {t('privacy.resources.newsletter.title')}
            </motion.h3>
            <p className="text-gray-300 text-center mb-8 mt-6">
              {t('privacy.resources.newsletter.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('privacy.resources.newsletter.placeholder')}
                  required
                  className="newsletter-input flex-grow px-4 py-3 rounded-full text-white border border-zinc-700 focus:outline-none focus:border-indigo-500 bg-opacity-20 bg-black"
                />
                <button
                  type="submit"
                  disabled={subscriptionStatus === 'loading' || subscriptionStatus === 'success'}
                  className="privacy-tool-button bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-6 rounded-full w-full sm:w-auto"
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                  {subscriptionStatus === 'loading' 
                    ? t('privacy.resources.newsletter.sending') 
                    : subscriptionStatus === 'success'
                    ? t('privacy.resources.newsletter.success') 
                    : t('privacy.resources.newsletter.subscribe')}
                </button>
              </form>
            </div>
            
            {subscriptionStatus === 'success' && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-400 mt-4 text-center"
              >
                {t('privacy.resources.newsletter.thankYou')}
              </motion.p>
            )}
            
            {subscriptionStatus === 'error' && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 mt-4 text-center"
              >
                {t('privacy.resources.newsletter.error')}
              </motion.p>
            )}
            
            <p className="text-zinc-500 text-xs mt-4 text-center">
              {t('privacy.resources.newsletter.privacy')}
            </p>
          </div>
          
          <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-indigo-600/5 rounded-full filter blur-2xl"></div>
          <div className="absolute -top-24 -left-24 w-56 h-56 bg-cyan-600/5 rounded-full filter blur-2xl"></div>
        </motion.div>
      </div>
    </section>
  );
} 