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
    EUR: '€',     // Euro
    USD: '$',     // US Dollar
    BRL: 'R$',    // Brazilian Real
    JPY: '¥',     // Japanese Yen
    CNY: '¥',     // Chinese Yuan
    RUB: '₽',     // Russian Ruble
    AED: 'د.إ',   // UAE Dirham
    CRC: '₡',     // Costa Rican Colón
    NGN: '₦',     // Nigerian Naira
    PHP: '₱',     // Philippine Peso
    PLN: 'zł',    // Polish Zloty
    PYG: '₲',     // Paraguayan Guarani
    THB: '฿',     // Thai Baht
    UAH: '₴',     // Ukrainian Hryvnia
    VND: '₫',     // Vietnamese Dong
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