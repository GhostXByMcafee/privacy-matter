'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faVolumeHigh, 
  faArrowsRotate, 
  faChevronUp, 
  faChevronDown,
  faFingerprint
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../i18n/useTranslation';

interface PadlockCaptchaProps {
  id?: string;
  onValidation?: (isValid: boolean) => void;
}

export interface CaptchaValidationEvent {
  isValid: boolean;
  code: string;
  captchaId: string;
}

export default function PadlockCaptcha({ id = 'default-captcha', onValidation }: PadlockCaptchaProps) {
  const { t } = useTranslation();
  const [digits, setDigits] = useState<number[]>([0, 0, 0, 0]);
  const [targetCode, setTargetCode] = useState<string>("");
  const [isValid, setIsValid] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeDial, setActiveDial] = useState<number | null>(null);
  const speakRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [hintVisible, setHintVisible] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const generateRandomCode = () => {
    const newCode = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join("");
    setTargetCode(newCode);
    setDigits([0, 0, 0, 0]);
    setIsValid(false);
    setHintVisible(true);
    setShowSuccess(false);
    
    // Notificar validación
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent<CaptchaValidationEvent>('captchaValidation', {
        detail: {
          isValid: false,
          code: "",
          captchaId: id
        }
      }));
      
      if (onValidation) {
        onValidation(false);
      }
    }
    
    return newCode;
  };

  useEffect(() => {
    const code = generateRandomCode();
    
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      speakRef.current = new SpeechSynthesisUtterance();
      speakRef.current.rate = 0.8;
      speakRef.current.pitch = 1;
      
      const navigatorLang = navigator.language || 'en-US';
      speakRef.current.lang = navigatorLang;
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis && speakRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [id]);

  useEffect(() => {
    const currentCode = digits.join("");
    const isMatch = currentCode === targetCode;

    if (isMatch && !isValid) {
      setIsValid(true);
      setShowSuccess(true);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent<CaptchaValidationEvent>('captchaValidation', {
          detail: {
            isValid: true,
            code: targetCode,
            captchaId: id
          }
        }));
        
        if (onValidation) {
          onValidation(true);
        }
      }
    } else if (!isMatch && isValid) {
      setIsValid(false);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent<CaptchaValidationEvent>('captchaValidation', {
          detail: {
            isValid: false,
            code: "",
            captchaId: id
          }
        }));
        
        if (onValidation) {
          onValidation(false);
        }
      }
    }
  }, [digits, targetCode, isValid, id, onValidation]);

  const handleDialChange = (index: number, direction: number) => {
    const newDigits = [...digits];
    newDigits[index] = (newDigits[index] + direction + 10) % 10;
    setDigits(newDigits);
  };

  const speakCode = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis && speakRef.current) {
      window.speechSynthesis.cancel();
      speakRef.current.text = targetCode.split('').join(' ');
      window.speechSynthesis.speak(speakRef.current);
    }
  };

  const toggleHint = () => {
    setHintVisible(!hintVisible);
  };

  return (
    <div className="w-full">
      <div className="captcha-container">
        <motion.div 
          className="relative bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl p-6 shadow-xl border border-zinc-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >          
          <h3 className="text-center text-lg font-semibold text-white mb-6">
            {t('contact.form.captcha.title', 'Security Verification')}
          </h3>
          
          <AnimatePresence>
            {showSuccess ? (
              <motion.div 
                className="flex justify-center mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div className="py-2 px-6 bg-green-500/20 rounded-full">
                  <span className="text-green-400 font-semibold">
                    {t('contact.form.captcha.success', '✓ Code verified successfully!')}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="flex justify-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div 
                  className="p-4 bg-indigo-500/10 rounded-full"
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                >
                  <FontAwesomeIcon 
                    icon={faFingerprint} 
                    className="text-4xl text-indigo-400" 
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex justify-center mb-6">
            <motion.button
              onClick={toggleHint}
              className="w-full max-w-xs py-2 px-4 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-md border border-zinc-600 text-zinc-300 hover:text-white font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {hintVisible ? (
                <div className="flex items-center justify-center space-x-2">
                  <span>{t('contact.form.captcha.hideHint', 'Hide Code')}</span>
                  <span className="font-mono font-bold text-yellow-400">{targetCode}</span>
                </div>
              ) : (
                <span>{t('contact.form.captcha.showHint', 'Show Code')}</span>
              )}
            </motion.button>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-4 gap-3">
              {digits.map((digit, index) => (
                <div key={index} className="flex flex-col items-center">
                  <motion.button
                    className="w-12 h-8 bg-zinc-700 hover:bg-zinc-600 rounded-t-md flex items-center justify-center"
                    onClick={() => handleDialChange(index, 1)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FontAwesomeIcon icon={faChevronUp} className="text-white" />
                  </motion.button>
                  
                  <motion.div
                    className={`
                      w-12 h-16 flex items-center justify-center 
                      bg-gradient-to-b from-zinc-600 to-zinc-700
                      border-2 ${activeDial === index ? 'border-indigo-500' : 'border-zinc-500'}
                      font-mono font-bold text-2xl text-white
                    `}
                    animate={{
                      borderColor: activeDial === index ? "#6366f1" : "#3f3f46"
                    }}
                  >
                    {digit}
                  </motion.div>
                  
                  <motion.button
                    className="w-12 h-8 bg-zinc-700 hover:bg-zinc-600 rounded-b-md flex items-center justify-center"
                    onClick={() => handleDialChange(index, -1)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FontAwesomeIcon icon={faChevronDown} className="text-white" />
                  </motion.button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <motion.button
              type="button"
              className="px-4 py-2 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-md text-white flex items-center"
              whileHover={{ scale: 1.05, backgroundColor: "#4f46e5" }}
              whileTap={{ scale: 0.95 }}
              onClick={generateRandomCode}
            >
              <FontAwesomeIcon icon={faArrowsRotate} className="mr-2" />
              {t('contact.form.captcha.reset', 'Reset')}
            </motion.button>
            
            <motion.button
              type="button"
              className="px-4 py-2 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-md text-white flex items-center"
              whileHover={{ scale: 1.05, backgroundColor: "#4f46e5" }}
              whileTap={{ scale: 0.95 }}
              onClick={speakCode}
            >
              <FontAwesomeIcon icon={faVolumeHigh} className="mr-2" />
              {t('contact.form.captcha.listen', 'Listen')}
            </motion.button>
          </div>
        </motion.div>
        
        <p className="text-zinc-400 text-sm mt-3 text-center">
          {t('contact.form.captcha.instructions', 'Enter the four-digit code to unlock')}
        </p>
      </div>
    </div>
  );
}