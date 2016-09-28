import * as moment from 'moment';

const MOM_LOCALES = {
  'es': require('moment/locale/es'),
  'fr': require('moment/locale/fr'),
  'it': require('moment/locale/it'),
  'pt': require('moment/locale/pt'),
  'zh-cn': require('moment/locale/zh-cn')
};

export function loadLocale(locale: string) {
  if (locale) {
    let loc_mom = MOM_LOCALES[locale];
    if (!loc_mom) {
      return;
    }
    let keys = Object.keys(loc_mom);
    let config = {};
    keys.map(item => {
      config[item.substring(1)] = loc_mom[item];
    });
    moment.locale(locale, config);
  }
}
