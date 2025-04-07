'use client';

import { motion } from 'framer-motion';
import { Header, Footer } from '../../components/LocalizedComponents';
import ContactForm from '../../components/contact/ContactForm';
import { useTranslation } from '../../i18n/useTranslation';

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen bg-zinc-950 text-white contact-page">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
              {t('contact.title', 'Confidential Contact')}
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-gray-300">
              {t('contact.subtitle', 'Use this form to contact us securely. All information is transmitted and stored with end-to-end encryption.')}
            </p>
          </motion.div>
          
          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  );
} 