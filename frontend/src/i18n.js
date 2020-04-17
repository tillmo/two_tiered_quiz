import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import common_de from "./translations/de/common.json";
import common_en from "./translations/en/common.json";

i18n
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
          common: common_en // 'common' is our custom namespace
          },
      de: {
          common: common_de
          },
    },
    fallbackLng: "en",
    lng: process.env.REACT_APP_LANGUAGE,
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
