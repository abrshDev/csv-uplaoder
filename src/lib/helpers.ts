interface CSVData {
  identity: string;
  eBayURL: string;
  currency: string;
  rank: string;
}

/**
 * @description validateData takes in an array of a CSVData object and validates it againist the requirements
 * @param data CSVData
 * @returns
 */
export const validateData = (data: CSVData[]) => {
  const eBayUrlRegex = /^https:\/\/www\.ebay\.com\/sch\/i\.html/;

  let invalidUrlCount = 0;
  let incompleteDataCount = 0;
  const invalidDataPositions: number[] = [];

  data.forEach((item, index) => {
    if (index === 0) return;
    
    const { identity, eBayURL, currency, rank } = item;

    // Check if any of the fields are missing
    if (!identity || !eBayURL || !currency || !rank) {
      incompleteDataCount++;
      invalidDataPositions.push(index);
    }

    // Check if the eBay URL does not match the regex
    if (!eBayUrlRegex.test(eBayURL)) {
      invalidUrlCount++;
    }
  });

  return {
    invalidUrlCount,
    incompleteDataCount,
    invalidDataPositions,
  };
};

/**
 * @description this function takes in the symbol of a currency and maps it to the currncy code of the currnecy it represents
 * @param symbol string currency symbol e.g. $
 * @returns currency code for the symbol e.g. getCurrencyCode('$') => USD
 */
export const getCurrencyCode = (symbol: string): string => {
  // Define a map of currency symbols to currency codes
  const currencyMap: { [key: string]: string } = {
    $: "USD", // US Dollar
    "€": "EUR", // Euro
    "£": "GBP", // British Pound
    "¥": "JPY", // Japanese Yen
    "₹": "INR", // Indian Rupee
    "₩": "KRW", // South Korean Won
    "₽": "RUB", // Russian Ruble
    "₺": "TRY", // Turkish Lira
    "₪": "ILS", // Israeli Shekel
    "₫": "VND", // Vietnamese Dong
    "₦": "NGN", // Nigerian Naira
    "฿": "THB", // Thai Baht
    "₴": "UAH", // Ukrainian Hryvnia
    "₱": "PHP", // Philippine Peso
    "₡": "CRC", // Costa Rican Colón
    R: "ZAR", // South African Rand
    C$: "CAD", // Canadian Dollar
    A$: "AUD", // Australian Dollar
    NZ$: "NZD", // New Zealand Dollar
    S$: "SGD", // Singapore Dollar
    HK$: "HKD", // Hong Kong Dollar
    CHF: "CHF", // Swiss Franc
    kr: "NOK", // Norwegian Krone
    "د.إ": "AED", // United Arab Emirates Dirham
    SAR: "SAR", // Saudi Riyal
    Kč: "CZK", // Czech Koruna
    zł: "PLN", // Polish Zloty
    Ft: "HUF", // Hungarian Forint
    Rp: "IDR", // Indonesian Rupiah
    RM: "MYR", // Malaysian Ringgit
    "₸": "KZT", // Kazakhstani Tenge
    лв: "BGN", // Bulgarian Lev
    R$: "BRL", // Brazilian Real
    MX$: "MXN", // Mexican Peso
    "₮": "MNT", // Mongolian Tugrik
    Q: "GTQ", // Guatemalan Quetzal
    RD$: "DOP", // Dominican Peso
    "Bs.": "VES", // Venezuelan Bolívar Soberano
    P: "BWP", // Botswana Pula
    Kz: "AOA", // Angolan Kwanza
    ZK: "ZMW", // Zambian Kwacha
    G$: "GYD", // Guyanese Dollar
    T$: "TOP", // Tongan Paʻanga
    "₲": "PYG", // Paraguayan Guarani
    "៛": "KHR", // Cambodian Riel
    L: "HNL", // Honduran Lempira
    MKD: "MKD", // Macedonian Denar
    "B/.": "PAB", // Panamanian Balboa
    Ksh: "KES", // Kenyan Shilling
    T: "TMT", // Turkmenistani Manat
  };

  // Check if the symbol exists in the map, otherwise return USD
  return currencyMap[symbol] || "USD";
};

/**
 * @description getRandomProxy takes an array of proxy URLs and returns a random proxy url fro ip rotation
 * @param proxyURLs array of proxy urls as array
 * @returns proxyURL string
 */
export const getRandomProxy = (proxyURLs: string[]): string => {
  if (proxyURLs.length === 0) {
    return ""; // Handle case where the array is empty
  }

  const randomArray = new Uint32Array(1);
  crypto.getRandomValues(randomArray);

  const randomIndex = randomArray[0] % proxyURLs.length;
  return proxyURLs[randomIndex];
};
