interface CSVData {
  Identity: string;
  eBayURL: string;
  Currency: string | undefined;
  Rank: number;
}

interface getcurrencyCodeParams {
  currencySymbol: string | undefined
}

interface EmailerProps {
  Data?: any,
  ErrorTo?: string
}