export const REG_LANGUAGE = /^([a-z]{2})[-|_]([A-Z]{2})$/;

export default class LocaleCode {

  static getLanguageCode(code) {
    const match = code.match(REG_LANGUAGE);
    let result = code.toLowerCase();
    if (match && match.length > 1) {
      result = match[1].toLowerCase();
    }
    return result;
  }

  static getCountryCode(code) {
    const match = code.match(REG_LANGUAGE);
    let result = code.toLowerCase();
    if (match && match.length > 2) {
      result = match[2].toLowerCase();
    } else {
      /*Exception pt is locale id of Portuguese Brazil
      and pt-PT is Portuguese Portugal */
      if (result === 'pt') {
        result = 'br';
      }
    }
    return result;
  }
}
