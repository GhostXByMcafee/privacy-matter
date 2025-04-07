'use client';

import { useTranslation } from '../../i18n/useTranslation';
import { Header, Footer } from '../../components/LocalizedComponents';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutPage() {
  const { t } = useTranslation();

  const team = [
    {
        name: 'Joao Campos',
        role: t('about.team.roles.tech'),
        image: '/team/joaocampos.jpg'
      },
    {
        name: 'Eliécer Hernández',
        role: t('about.team.roles.privacy'),
        image: '/team/paraguanads.jpg'
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
                {t('about.title')}
              </h1>
              <p className="text-xl text-gray-300 mb-12">
                {t('about.subtitle')}
              </p>
            </motion.div>

            <div className="grid gap-12 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-300"
              >
                <h2 className="text-2xl font-bold mb-4 text-white">
                  {t('about.mission.title')}
                </h2>
                <p className="leading-relaxed">
                  {t('about.mission.description')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-300"
              >
                <h2 className="text-2xl font-bold mb-4 text-white">
                  {t('about.vision.title')}
                </h2>
                <p className="leading-relaxed">
                  {t('about.vision.description')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-white">
                  {t('about.team.title')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {team.map((member, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {member.name}
                      </h3>
                      <p className="text-gray-400">
                        {member.role}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 