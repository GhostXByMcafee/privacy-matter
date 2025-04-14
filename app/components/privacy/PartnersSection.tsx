'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useTranslation } from '../../i18n/useTranslation';

interface PartnersSectionProps {
  customClass?: string;
}

export default function PartnersSection({ customClass = '' }: PartnersSectionProps) {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const partners = [
    {
      name: 'GhostX',
      logo: '/ghostX-logo.png',
      alt: t('privacy.partners.ghostX.alt'),
      href: 'https://ghostx.tech',
      width: 200,
      height: 80
    },
    {
      name: 'Bezerra Borges',
      logo: '/bblogo.png',
      alt: t('privacy.partners.bezerraBorges.alt'),
      href: 'https://boazbezerra.com.br/',
      width: 200,
      height: 80
    }
  ];

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
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tools-heading inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
            {t('privacy.partners.title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-6">
            {t('privacy.partners.subtitle')}
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
          {partners.map((partner, index) => (
            <motion.a
              key={partner.name}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
              <div className="relative bg-black/50 rounded-lg p-6 backdrop-blur-sm border border-zinc-800/50 transition-all duration-300 group-hover:border-indigo-500/50">
                <Image
                  src={partner.logo}
                  alt={partner.alt}
                  width={partner.width}
                  height={partner.height}
                  className="transition-all duration-300 group-hover:brightness-110"
                  style={{
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
} 