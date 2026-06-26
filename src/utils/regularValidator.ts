import { i18n } from '@/locales';

const validatorPositiveInteger = (rule, value, callback) => {
  if (/(^[1-9]\d*$)/.test(value)) {
    callback();
  } else {
    callback(new Error(i18n.global.t('validation.positiveInteger')));
  }
};

const validatorMaxCountFunction = (errorMsg = '', count = 3) => {
  const message = errorMsg || i18n.global.t('validation.maxCount', { count });

  return (rule, value, callback) => {
    if (!value || !value.length) {
      callback(new Error(i18n.global.t('validation.required')));
    } else if (value.length > count) {
      callback(new Error(message));
    } else {
      callback();
    }
  };
};

export { validatorPositiveInteger, validatorMaxCountFunction };
