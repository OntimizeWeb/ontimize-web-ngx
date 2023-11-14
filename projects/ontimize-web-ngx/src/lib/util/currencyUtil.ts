export class CurrencyUtil {

  static languageToCurrencyCode = {
    'es': 'EUR', // Spanish
    'en': 'USD', // English
    'pt': 'BRL', // Portuguese
    'fr': 'EUR', // French
    'de': 'EUR', // German
    'it': 'EUR', // Italian
    'ja': 'JPY', // Japanese
    'zh': 'CNY', // Chinese
    'ru': 'RUB', // Russian
    'ar': 'AED', // Arabic
  };

  static currencyCodeToSymbol = {
    'EUR': '€',
    'USD': '$',
    'BRL': 'R$',
    'JPY': '¥',
    'CNY': '¥',
    'RUB': '₽',
    'AED': 'د.إ',
  };
  static getCurrencyCode(language: string): string {
    const code = this.languageToCurrencyCode[language];
    if (code) {
      return code;
    } else {
      return 'USD';
    }
  }
  static getCurrencyCodeFromSymbol(symbol: string): string | undefined {
    const currencyCode = Object.keys(this.currencyCodeToSymbol).find(
      code => this.currencyCodeToSymbol[code] === symbol
    );

    return currencyCode;
  }
}