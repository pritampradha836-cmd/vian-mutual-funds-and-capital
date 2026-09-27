export interface PortfolioHolding {
  id: string;
  schemeId: string;
  schemeName: string;
  category: string;
  folioNumber: string;
  units: number;
  averageBuyNav: number;
  currentNav: number;
  investedAmount: number;
  currentValue: number;
  absoluteGain: number;
  returnPercentage: number;
  dayChangePercentage: number;
  dayChangeAmount: number;
  unrealizedLtcg: number;
  unrealizedStcg: number;
  purchaseDate: string;
  sipActive: boolean;
  sipAmount?: number;
}

export interface SipMandate {
  id: string;
  schemeName: string;
  amount: number;
  frequency: 'Monthly' | 'Daily' | 'Weekly';
  debitDate: number;
  nextDebitDate: string;
  bankName: string;
  mandateId: string;
  status: 'Active' | 'Paused';
}

export interface PortfolioTransaction {
  id: string;
  date: string;
  schemeName: string;
  type: 'SIP' | 'Lumpsum' | 'Redemption' | 'Dividend Reinvestment';
  amount: number;
  nav: number;
  units: number;
  status: 'Completed' | 'Processing';
  paymentMode: 'UPI' | 'NetBanking' | 'Auto-Debit (NACH)';
}

export const INITIAL_HOLDINGS: PortfolioHolding[] = [
  {
    id: 'hold-1',
    schemeId: 'ppfc-01',
    schemeName: 'Parag Parikh Flexi Cap Fund - Direct Growth',
    category: 'Flexi Cap',
    folioNumber: 'PPF/892147/01',
    units: 11250.45,
    averageBuyNav: 54.80,
    currentNav: 84.15,
    investedAmount: 616524,
    currentValue: 946725,
    absoluteGain: 330201,
    returnPercentage: 53.56,
    dayChangePercentage: 0.64,
    dayChangeAmount: 6020,
    unrealizedLtcg: 312000,
    unrealizedStcg: 18201,
    purchaseDate: '2022-04-12',
    sipActive: true,
    sipAmount: 15000,
  },
  {
    id: 'hold-2',
    schemeId: 'motilal-mid-05',
    schemeName: 'Motilal Oswal Midcap Fund - Direct Growth',
    category: 'Mid Cap',
    folioNumber: 'MO/449102/09',
    units: 6420.80,
    averageBuyNav: 62.40,
    currentNav: 96.30,
    investedAmount: 400657,
    currentValue: 618323,
    absoluteGain: 217666,
    returnPercentage: 54.33,
    dayChangePercentage: 0.98,
    dayChangeAmount: 6010,
    unrealizedLtcg: 198000,
    unrealizedStcg: 19666,
    purchaseDate: '2022-09-18',
    sipActive: true,
    sipAmount: 10000,
  },
  {
    id: 'hold-3',
    schemeId: 'nippon-small-04',
    schemeName: 'Nippon India Small Cap Fund - Direct Growth',
    category: 'Small Cap',
    folioNumber: 'NIM/771822/02',
    units: 2450.60,
    averageBuyNav: 118.20,
    currentNav: 178.60,
    investedAmount: 289660,
    currentValue: 437677,
    absoluteGain: 148017,
    returnPercentage: 51.10,
    dayChangePercentage: 1.15,
    dayChangeAmount: 4980,
    unrealizedLtcg: 135000,
    unrealizedStcg: 13017,
    purchaseDate: '2023-01-10',
    sipActive: true,
    sipAmount: 7500,
  },
  {
    id: 'hold-4',
    schemeId: 'mirae-elss-06',
    schemeName: 'Mirae Asset ELSS Tax Saver Fund - Direct Growth',
    category: 'ELSS Tax Saver',
    folioNumber: 'MA/318990/04',
    units: 7850.00,
    averageBuyNav: 35.50,
    currentNav: 48.75,
    investedAmount: 278675,
    currentValue: 382687,
    absoluteGain: 104012,
    returnPercentage: 37.32,
    dayChangePercentage: 0.45,
    dayChangeAmount: 1710,
    unrealizedLtcg: 94000,
    unrealizedStcg: 10012,
    purchaseDate: '2022-03-28',
    sipActive: true,
    sipAmount: 5000,
  },
  {
    id: 'hold-5',
    schemeId: 'icici-equity-debt-09',
    schemeName: 'ICICI Prudential Equity & Debt Fund - Direct Growth',
    category: 'Hybrid',
    folioNumber: 'IP/991204/01',
    units: 680.50,
    averageBuyNav: 295.00,
    currentNav: 388.20,
    investedAmount: 200747,
    currentValue: 264170,
    absoluteGain: 63423,
    returnPercentage: 31.59,
    dayChangePercentage: 0.32,
    dayChangeAmount: 840,
    unrealizedLtcg: 58000,
    unrealizedStcg: 5423,
    purchaseDate: '2022-06-15',
    sipActive: true,
    sipAmount: 5000,
  },
  {
    id: 'hold-6',
    schemeId: 'kotak-liquid-11',
    schemeName: 'Kotak Liquid Fund - Direct Growth',
    category: 'Debt & Liquid',
    folioNumber: 'KM/112004/08',
    units: 26.66,
    averageBuyNav: 4720.00,
    currentNav: 4982.50,
    investedAmount: 125835,
    currentValue: 132833,
    absoluteGain: 6998,
    returnPercentage: 5.56,
    dayChangePercentage: 0.02,
    dayChangeAmount: 26,
    unrealizedLtcg: 0,
    unrealizedStcg: 6998,
    purchaseDate: '2023-11-04',
    sipActive: false,
  }
];

export const INITIAL_MANDATES: SipMandate[] = [
  {
    id: 'man-1',
    schemeName: 'Parag Parikh Flexi Cap Fund',
    amount: 15000,
    frequency: 'Monthly',
    debitDate: 5,
    nextDebitDate: '2026-10-05',
    bankName: 'HDFC Bank (A/C **4892)',
    mandateId: 'UMRN-HDFC-9912041',
    status: 'Active',
  },
  {
    id: 'man-2',
    schemeName: 'Motilal Oswal Midcap Fund',
    amount: 10000,
    frequency: 'Monthly',
    debitDate: 10,
    nextDebitDate: '2026-10-10',
    bankName: 'HDFC Bank (A/C **4892)',
    mandateId: 'UMRN-HDFC-9912042',
    status: 'Active',
  },
  {
    id: 'man-3',
    schemeName: 'Nippon India Small Cap Fund',
    amount: 7500,
    frequency: 'Monthly',
    debitDate: 15,
    nextDebitDate: '2026-10-15',
    bankName: 'HDFC Bank (A/C **4892)',
    mandateId: 'UMRN-HDFC-9912043',
    status: 'Active',
  },
  {
    id: 'man-4',
    schemeName: 'Mirae Asset ELSS Tax Saver',
    amount: 5000,
    frequency: 'Monthly',
    debitDate: 20,
    nextDebitDate: '2026-10-20',
    bankName: 'HDFC Bank (A/C **4892)',
    mandateId: 'UMRN-HDFC-9912044',
    status: 'Active',
  },
  {
    id: 'man-5',
    schemeName: 'ICICI Prudential Equity & Debt',
    amount: 5000,
    frequency: 'Monthly',
    debitDate: 25,
    nextDebitDate: '2026-10-25',
    bankName: 'HDFC Bank (A/C **4892)',
    mandateId: 'UMRN-HDFC-9912045',
    status: 'Active',
  },
];

export const INITIAL_TRANSACTIONS: PortfolioTransaction[] = [
  {
    id: 'TXN-902181',
    date: '2026-09-25',
    schemeName: 'ICICI Prudential Equity & Debt Fund',
    type: 'SIP',
    amount: 5000,
    nav: 388.20,
    units: 12.87,
    status: 'Completed',
    paymentMode: 'Auto-Debit (NACH)',
  },
  {
    id: 'TXN-901844',
    date: '2026-09-20',
    schemeName: 'Mirae Asset ELSS Tax Saver Fund',
    type: 'SIP',
    amount: 5000,
    nav: 48.75,
    units: 102.56,
    status: 'Completed',
    paymentMode: 'Auto-Debit (NACH)',
  },
  {
    id: 'TXN-899120',
    date: '2026-09-15',
    schemeName: 'Nippon India Small Cap Fund',
    type: 'SIP',
    amount: 7500,
    nav: 178.60,
    units: 41.99,
    status: 'Completed',
    paymentMode: 'Auto-Debit (NACH)',
  },
  {
    id: 'TXN-894102',
    date: '2026-09-10',
    schemeName: 'Motilal Oswal Midcap Fund',
    type: 'SIP',
    amount: 10000,
    nav: 96.30,
    units: 103.84,
    status: 'Completed',
    paymentMode: 'Auto-Debit (NACH)',
  },
  {
    id: 'TXN-891100',
    date: '2026-09-05',
    schemeName: 'Parag Parikh Flexi Cap Fund',
    type: 'SIP',
    amount: 15000,
    nav: 84.15,
    units: 178.25,
    status: 'Completed',
    paymentMode: 'Auto-Debit (NACH)',
  },
  {
    id: 'TXN-882019',
    date: '2026-08-14',
    schemeName: 'HDFC Flexi Cap Fund',
    type: 'Lumpsum',
    amount: 50000,
    nav: 1940.10,
    units: 25.77,
    status: 'Completed',
    paymentMode: 'UPI',
  }
];
