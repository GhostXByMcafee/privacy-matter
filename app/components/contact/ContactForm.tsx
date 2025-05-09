'use client';

import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSpinner, faCheck, faExclamationTriangle, faTimes, faLock, faShieldAlt, faKey } from '@fortawesome/free-solid-svg-icons';
import PadlockCaptcha from './PadlockCaptcha';
import { useIntl } from 'react-intl';
import { CaptchaValidationEvent } from './PadlockCaptcha';
import { withLocalization, WithTranslation } from '../../i18n/withLocalization';

type FormState = 'idle' | 'submitting' | 'success' | 'error';
type Priority = 'URGENT' | 'NORMAL' | 'LOW';

interface FormData {
  alias: string;
  email: string;
  message: string;
  priority: Priority;
}

interface ContactFormProps extends WithTranslation {
}

const generateRandomAlias = () => {
  const adjectives = ['Digital', 'Cyber', 'Quantum', 'Stealth', 'Phantom', 'Shadow', 'Ghost', 'Anonymous', 'Hidden', 'Encrypted'];
  const nouns = ['Squirrel', 'Eagle', 'Wolf', 'Tiger', 'Phoenix', 'Dragon', 'Raven', 'Panther', 'Hawk', 'Fox'];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  return `${randomAdjective}${randomNoun}${randomNumber}`;
};

function ContactForm({ t }: ContactFormProps) {
  const intl = useIntl();
  
  const [formData, setFormData] = useState<FormData>({
    alias: '',
    email: '',
    message: '',
    priority: 'NORMAL',
  });
  
  const [formState, setFormState] = useState<FormState>('idle');
  const [captchaValid, setCaptchaValid] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [aliasPlaceholder, setAliasPlaceholder] = useState(generateRandomAlias());
  const [formError, setFormError] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({
    alias: '',
    email: '',
    message: '',
    captcha: ''
  });

  useEffect(() => {
    if (!formData.alias) {
      setFormData(prev => ({ ...prev, alias: aliasPlaceholder }));
    }
  }, [aliasPlaceholder, formData.alias]);

  useEffect(() => {
    const handleCaptchaValidation = (event: Event) => {
      const customEvent = event as CustomEvent<CaptchaValidationEvent>;
      if (customEvent.detail.captchaId === 'contact-form-captcha') {
        setCaptchaValid(customEvent.detail.isValid);
        setCaptchaCode(customEvent.detail.code);
      }
    };

    window.addEventListener('captchaValidation', handleCaptchaValidation);

    return () => {
      window.removeEventListener('captchaValidation', handleCaptchaValidation);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAliasFocus = () => {
    if (formData.alias === aliasPlaceholder) {
      setFormData(prev => ({ ...prev, alias: '' }));
    }
  };

  const handleAliasBlur = () => {
    if (!formData.alias.trim()) {
      const newAlias = generateRandomAlias();
      setAliasPlaceholder(newAlias);
      setFormData(prev => ({ ...prev, alias: newAlias }));
    }
  };

  const resetForm = () => {
    const newAlias = generateRandomAlias();
    setAliasPlaceholder(newAlias);
    setFormData({
      alias: newAlias,
      email: '',
      message: '',
      priority: 'NORMAL',
    });
    setCaptchaValid(false);
    setFormState('idle');
    setFormError('');
  };

  const validateForm = () => {
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError('Please provide a valid email address.');
      return false;
    }
    
    if (!formData.message.trim()) {
      setFormError('Please write a message.');
      return false;
    }
    
    if (!captchaValid) {
      setFormError('Please complete the security verification.');
      return false;
    }
    
    setFormError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setFormState('submitting');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          captchaCode,
        }),
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        setFormState('success');
        setTimeout(() => {
          resetForm();
        }, 3000);
      } else {
        const errorMessage = responseData.message || responseData.error || 'Hubo un error al enviar tu mensaje.';
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error sending form:', error);
      setFormState('error');
      setFormError(error.message || 'There was an error sending your message. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 md:p-8 max-w-3xl mx-auto mb-12"
    >
      <div className="mb-8 p-6 bg-indigo-950/30 border border-indigo-900/50 rounded-lg">
        <div className="flex items-center mb-3">
          <FontAwesomeIcon icon={faShieldAlt} className="text-indigo-400 mr-3 text-xl" />
          <span className="text-indigo-300 text-lg font-semibold">
            <FontAwesomeIcon icon={faLock} className="mr-2" />
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
              {t('contact.encryption.title', 'End-to-End Encryption')}
            </span>
          </span>
        </div>
        <p className="text-zinc-400 mb-4">
          {t('contact.encryption.description', 'All data in this form is encrypted using AES-256-GCM before being stored in our database.')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <span className="text-yellow-500 mr-2">
              <FontAwesomeIcon icon={faKey} />
            </span>
            <span className="text-zinc-300">
              {t('contact.encryption.methods.aes', 'AES-256 Encryption')}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-2">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <span className="text-zinc-300">
              {t('contact.encryption.methods.storage', 'Encrypted Storage')}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-blue-500 mr-2">
              <FontAwesomeIcon icon={faShieldAlt} />
            </span>
            <span className="text-zinc-300">
              {t('contact.encryption.methods.protection', 'Data Protection')}
            </span>
          </div>
        </div>
      </div>

      {formState === 'success' && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-800 rounded-lg">
          <p className="text-green-300">
            {t('states.success', 'Your message has been sent securely. We will contact you soon.')}
          </p>
        </div>
      )}
      
      {formState === 'error' && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg">
          <p className="text-red-300">
            {t('states.error', 'There was an error sending your message. Please try again.')} 
            {formError && `: ${formError}`}
          </p>
        </div>
      )}

      {formErrors.captcha && (
        <p className="text-red-500 text-sm mt-1">{formErrors.captcha}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Alias o Pseudónimo */}
        <div>
          <label className="block mb-2 text-gray-300">
            {t('contact.form.alias.label', 'Alias or Pseudonym')}
          </label>
          <input
            type="text"
            name="alias"
            value={formData.alias}
            onChange={handleChange}
            onFocus={handleAliasFocus}
            onBlur={handleAliasBlur}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            placeholder={t('contact.form.alias.placeholder', 'Anonymous Identifier')}
          />
        </div>
        
        {/* Email */}
        <div>
          <label className="block mb-2 text-gray-300">
            {t('contact.form.email.label', 'Email')} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            placeholder={t('contact.form.email.placeholder', 'Your email address')}
          />
        </div>

        {/* Prioridad */}
        <div>
          <label className="block mb-2 text-gray-300">
            {t('contact.form.priority.label', 'Priority')}
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          >
            <option value="URGENT">{t('contact.form.priority.options.urgent', 'Urgent')}</option>
            <option value="NORMAL">{t('contact.form.priority.options.normal', 'Normal')}</option>
            <option value="LOW">{t('contact.form.priority.options.low', 'Low')}</option>
          </select>
        </div>

        {/* Mensaje */}
        <div>
          <label className="block mb-2 text-gray-300">
            {t('contact.form.message.label', 'Your Message')} <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
            placeholder={t('contact.form.message.placeholder', 'Write your message here...')}
          ></textarea>
        </div>

        {/* Captcha */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-300">
            {t('contact.form.captcha.label', 'Security Verification')} <span className="text-red-500">*</span>
          </label>
          <PadlockCaptcha 
            id="contact-form-captcha"
            onValidation={(isValid) => setCaptchaValid(isValid)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
          <motion.button
            type="button"
            onClick={resetForm}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={formState === 'submitting'}
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            {t('contact.form.buttons.reset', 'Clear Form')}
          </motion.button>
          
          <motion.button
            type="submit"
            className={`
              px-6 py-3 rounded-lg font-medium transition flex items-center justify-center
              ${formState === 'submitting' ? 'bg-gradient-to-r from-indigo-600/80 to-purple-700/80' :
                formState === 'success' ? 'bg-gradient-to-r from-green-600 to-green-700' :
                formState === 'error' ? 'bg-gradient-to-r from-red-600 to-red-700' :
                'bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800'
              }
              text-white
            `}
            whileHover={formState === 'idle' ? { scale: 1.02 } : {}}
            whileTap={formState === 'idle' ? { scale: 0.98 } : {}}
            disabled={formState === 'submitting' || formState === 'success'}
          >
            {formState === 'submitting' ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                {t('contact.form.sending', 'Sending...')}
              </>
            ) : formState === 'success' ? (
              <>
                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                {t('contact.form.success', 'Sent!')}
              </>
            ) : formState === 'error' ? (
              <>
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                {t('contact.form.error', 'Error sending message')}
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                {t('contact.form.submit', 'Send Message')}
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

export default withLocalization(ContactForm); 