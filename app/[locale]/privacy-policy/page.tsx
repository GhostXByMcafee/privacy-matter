'use client';

import { useTranslation } from '../../i18n/useTranslation';
import { Header, Footer } from '../../components/LocalizedComponents';
import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

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
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700 text-center">
                {t('privacyPolicy.title')}
              </h1>
              <div className="space-y-8 text-gray-300">
                {['collection', 'use', 'protection', 'cookies', 'rights', 'updates'].map((section) => (
                  <motion.div
                    key={section}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-2xl font-bold mb-4 text-white">
                      {t(`privacyPolicy.sections.${section}.title`)}
                    </h2>
                    <p className="leading-relaxed mb-4">
                      {t(`privacyPolicy.sections.${section}.description`)}
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      {['point1', 'point2', 'point3'].map((point) => (
                        <li key={point}>
                          {t(`privacyPolicy.sections.${section}.points.${point}`)}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 