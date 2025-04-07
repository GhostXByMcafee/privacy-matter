'use client';

import { useTranslation } from '../../i18n/useTranslation';
import { Header, Footer } from '../../components/LocalizedComponents';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faShieldAlt, faUserSecret, faKey } from '@fortawesome/free-solid-svg-icons';

export default function PrivacyPage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: faLock,
      title: t('privacy.features.encryption.title'),
      description: t('privacy.features.encryption.description')
    },
    {
      icon: faShieldAlt,
      title: t('privacy.features.protection.title'),
      description: t('privacy.features.protection.description')
    },
    {
      icon: faUserSecret,
      title: t('privacy.features.anonymity.title'),
      description: t('privacy.features.anonymity.description')
    },
    {
      icon: faKey,
      title: t('privacy.features.control.title'),
      description: t('privacy.features.control.description')
    }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        <section className="relative py-24 overflow-hidden">
          <div className="privacy-gradient absolute top-0 left-0 w-full h-full opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 tools-heading inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
                {t('privacy.page.title')}
              </h1>
              <p className="text-xl text-gray-300 mb-12">
                {t('privacy.page.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-16">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="privacy-tool-card rounded-xl p-6 transform hover:scale-105 transition-transform"
                >
                  <div className="mb-6 w-16 h-16 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                    <FontAwesomeIcon icon={feature.icon} className="text-white h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-20 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 tools-heading inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
                {t('privacy.page.commitment.title')}
              </h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                {t('privacy.page.commitment.description')}
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 