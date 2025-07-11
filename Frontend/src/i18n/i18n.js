import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: 'Welcome to AI Contact Center',
          login: 'Login',
          dashboard: 'Dashboard',
          chat: 'Chat',
          analytics: 'Analytics',
          settings: 'Settings',
          logout: 'Logout',
          email: 'Email',
          name:'Name',
          password: 'Password',
          forgotpass:'Forgot password',
          submit: 'Submit',
          signup:'Sign Up',
          search: 'Search',
          newChat: 'New Chat',
          sendMessage: 'Send Message',
          customerService: 'Customer Service',
          sentiment: 'Sentiment Analysis',
          predictive: 'Predictive Analytics'
        }
      },
      te: {
        translation: {
          welcome: 'AI కాంటాక్ట్ సెంటర్‌కు స్వాగతం',
          login: 'లాగిన్',
          dashboard: 'డాష్‌బోర్డ్',
          chat: 'చాట్',
          analytics: 'అనలిటిక్స్',
          settings: 'సెట్టింగ్స్',
          logout: 'లాగ్ అవుట్',
          email: 'ఇమెయిల్',
          name:"పేరు",
          password: 'పాస్‌వర్డ్',
          forgotpass:'పాస్‌వర్డ్ మర్చిపోయాను',
          submit: 'సమర్పించు',
          signup:'సైన్ అప్',
          search: 'వెతుకు',
          newChat: 'కొత్త చాట్',
          sendMessage: 'సందేశం పంపు',
          customerService: 'కస్టమర్ సర్వీస్',
          sentiment: 'భావోద్వేగ విశ్లేషణ',
          predictive: 'ప్రెడిక్టివ్ అనలిటిక్స్'
        }
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
