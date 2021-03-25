import i18next from 'i18next';
import resources from './locales/en';
import app from './app';

export default () => {
    const i18nextInstance = i18next.createInstance();
    return i18nextInstance.init({
        lng: 'ru',
        debug: false,
        resources,
    }).then(() => app(i18nextInstance));
  };