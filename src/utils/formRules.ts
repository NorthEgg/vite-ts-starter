import { i18n } from '@/locales';
// import {
//   regexExtraSpace
// } from '@/utils/regularExpression'
import { regexExtraSpace } from '@/utils/regularExpression';

function validatorRules(validator?: any, trigger = '', params?: any): any {
  const rule = {
    required: true,
    trigger,
    validator: '',
    ...params,
  };
  if (validator) {
    rule.validator = validator;
  } else {
    delete rule.validator;
  }
  return rule;
}
function requiredRules(params = {}) {
  const { trigger, message } = Object.assign(
    {},
    {
      trigger: 'blur',
      message: i18n.global.t('validation.required'),
    },
    params,
  );

  return validatorRules((rule: any, value: string, callback: any) => {
    value = value && value.trim();
    if (!value) {
      callback(new Error(message));
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        callback(new Error(message));
      } else {
        callback();
      }
    } else if (!String(value).replace(new RegExp(regexExtraSpace), '')) {
      callback(new Error(message));
    } else {
      callback();
    }
  }, trigger);
}

function requiredRadioRules(params = {}) {
  const { trigger, message } = Object.assign(
    {},
    {
      trigger: 'change',
      message: i18n.global.t('validation.required'),
    },
    params,
  );
  return validatorRules((rule: any, value: string, callback: any) => {
    if (['boolean', 'number'].includes(typeof value)) {
      callback();
    } else if (
      value === '' ||
      !value.replace(new RegExp(regexExtraSpace), '')
    ) {
      callback(new Error(message));
    }
  }, trigger);
}
function imageListRules(errMsg = i18n.global.t('validation.imageIncomplete')) {
  const errSingle = i18n.global.t('validation.imageSingle');
  const validator = (rule: any, value: any[], callback: any) => {
    if (!value) {
      callback(new Error(errSingle));
    } else if (Array.isArray(value) && value.some((img) => !img.url)) {
      if (value.length > 1) {
        callback(new Error(errMsg));
      } else {
        callback(new Error(errSingle));
      }
    } else {
      callback();
    }
  };
  return validatorRules(validator);
}

export { requiredRules, validatorRules, imageListRules, requiredRadioRules };
