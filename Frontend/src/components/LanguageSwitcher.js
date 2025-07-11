import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.css";

function LanguageSwitcher() {
  useEffect(() => {
    localStorage.setItem('lang', 'en');
  }, []);

  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
    console.log(lng);
  };

  return (
    <div className="language-switcher">
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('te')}>తెలుగు</button>
    </div>
  );
}

export default LanguageSwitcher;
