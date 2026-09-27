export interface InsurancePlan {
  id: string;
  type: 'health' | 'term' | 'motor' | 'savings';
  insurer: string;
  name: string;
  logoText: string;
  coverAmount: string;
  coverValue: number;
  monthlyPremium: number;
  annualPremium: number;
  claimRatio: string;
  keyFeatures: string[];
  cashlessHospitals?: number;
  copay?: string;
  roomRentLimit?: string;
  tenureYears?: number;
  badge?: string;
  rating: number;
}

export const INSURANCE_PLANS: InsurancePlan[] = [
  // Health Insurance
  {
    id: 'health-01',
    type: 'health',
    insurer: 'Care Health Insurance',
    name: 'Care Supreme Comprehensive Health Plan',
    logoText: 'Care',
    coverAmount: '₹25 Lakhs',
    coverValue: 2500000,
    monthlyPremium: 980,
    annualPremium: 11450,
    claimRatio: '95.2%',
    cashlessHospitals: 11200,
    copay: '0% Copay across all ages',
    roomRentLimit: 'No Room Rent Capping (Single Pvt AC)',
    rating: 4.8,
    badge: 'Best Value',
    keyFeatures: [
      'Unlimited 100% automatic sum insured restoration',
      'Cumulative Bonus up to 500% (No Claim Bonus)',
      'Free Annual Health Check-ups for all insured members',
      'Day Care treatments & Pre/Post hospitalization covered (60/180 days)'
    ]
  },
  {
    id: 'health-02',
    type: 'health',
    insurer: 'HDFC ERGO General Insurance',
    name: 'Optima Secure 4X Health Shield',
    logoText: 'HDFC ERGO',
    coverAmount: '₹50 Lakhs',
    coverValue: 5000000,
    monthlyPremium: 1540,
    annualPremium: 17890,
    claimRatio: '98.8%',
    cashlessHospitals: 13500,
    copay: '0% Copay',
    roomRentLimit: 'Any Room Category without sub-limits',
    rating: 4.9,
    badge: 'Highest Rated',
    keyFeatures: [
      '2X coverage from Day 1 at zero extra cost',
      '3X coverage after 2 consecutive years',
      'Zero deduction on non-medical consumables (gloves, PPE kits)',
      'Cashless claim approval turnaround within 20 minutes'
    ]
  },
  {
    id: 'health-03',
    type: 'health',
    insurer: 'Niva Bupa Health Insurance',
    name: 'ReAssure 2.0 Titanium Lock-in Age',
    logoText: 'Niva Bupa',
    coverAmount: '₹1 Crore',
    coverValue: 10000000,
    monthlyPremium: 2250,
    annualPremium: 25900,
    claimRatio: '96.4%',
    cashlessHospitals: 10500,
    copay: '0% Copay',
    roomRentLimit: 'Single Private Room',
    rating: 4.7,
    badge: 'Lock-the-Clock Age',
    keyFeatures: [
      'Lock-in entry age premium until you claim',
      'Booster+ Carry forward unutilized sum insured up to 10X',
      'Live Healthy discounts up to 30% on renewal',
      'Air Ambulance & Worldwide Emergency Cover'
    ]
  },

  // Term Life Insurance
  {
    id: 'term-01',
    type: 'term',
    insurer: 'HDFC Life Insurance',
    name: 'Click 2 Protect Super Pure Term Plan',
    logoText: 'HDFC Life',
    coverAmount: '₹1.5 Crore',
    coverValue: 15000000,
    monthlyPremium: 1120,
    annualPremium: 12900,
    claimRatio: '99.5%',
    tenureYears: 40,
    rating: 4.9,
    badge: 'Top Claim Settlement',
    keyFeatures: [
      '99.50% industry-leading Claim Settlement Ratio',
      'Accelerated payout on diagnosis of Terminal Illness',
      'Waiver of all future premiums on Critical Illness or Accidental Disability',
      'Smart Exit Option: Get 100% of all paid premiums back at age 60'
    ]
  },
  {
    id: 'term-02',
    type: 'term',
    insurer: 'Max Life Insurance',
    name: 'Smart Total Elite Protection (STEP)',
    logoText: 'Max Life',
    coverAmount: '₹2 Crore',
    coverValue: 20000000,
    monthlyPremium: 1480,
    annualPremium: 16950,
    claimRatio: '99.6%',
    tenureYears: 45,
    rating: 4.9,
    badge: 'Lowest Premium Ratio',
    keyFeatures: [
      'Instant settlement for eligible claims within 4 hours via InstaClaim',
      'Special discounted rates for non-smokers and female policyholders',
      'Add-on comprehensive 64 Critical Illness rider protection',
      'Life Stage Upgrade: Boost cover on marriage & childbirth without new medicals'
    ]
  },
  {
    id: 'term-03',
    type: 'term',
    insurer: 'ICICI Prudential Life',
    name: 'iProtect Smart with Comprehensive Health Shield',
    logoText: 'ICICI Pru Life',
    coverAmount: '₹1 Crore',
    coverValue: 10000000,
    monthlyPremium: 890,
    annualPremium: 10250,
    claimRatio: '98.9%',
    tenureYears: 35,
    rating: 4.8,
    badge: 'Popular Choice',
    keyFeatures: [
      'Dual payout option: Lump sum + Monthly regular family income',
      'Coverage up to 85 years of age',
      'Tax deduction benefit under Section 80C and tax-free payout under Sec 10(10D)',
      '100% paperless medical underwriting and video medical tele-call'
    ]
  },

  // Motor & Car Insurance
  {
    id: 'motor-01',
    type: 'motor',
    insurer: 'Tata AIG General Insurance',
    name: 'AutoSecure 0% Bumper-to-Bumper Zero Depreciation',
    logoText: 'Tata AIG',
    coverAmount: 'Full IDV + 0% Dep',
    coverValue: 850000,
    monthlyPremium: 680,
    annualPremium: 7850,
    claimRatio: '97.2%',
    cashlessHospitals: 8200, // cashless garages
    rating: 4.8,
    badge: 'Zero Dep',
    keyFeatures: [
      'Cashless repairs at 8,200+ authorized workshops nationwide',
      'Engine & Gearbox Protection against water ingression & oil leakage',
      '24x7 Roadside Assistance with on-spot flat tyre & towing service',
      'Return to Invoice (RTI) cover ensures 100% on-road cost payout in total loss'
    ]
  },

  // Guaranteed Savings / Retirement
  {
    id: 'savings-01',
    type: 'savings',
    insurer: 'Tata AIA Life Insurance',
    name: 'Fortune Guarantee Plus (Guaranteed Tax-Free Income)',
    logoText: 'Tata AIA',
    coverAmount: '₹50 Lakhs + Regular Income',
    coverValue: 5000000,
    monthlyPremium: 8333,
    annualPremium: 100000,
    claimRatio: '99.1%',
    rating: 4.7,
    badge: 'Guaranteed 7.2% Tax-Free',
    keyFeatures: [
      'Guaranteed fixed annual payouts starting from end of premium payment term',
      'Return of 110% of total premiums paid at maturity',
      'Completely exempt from capital gains tax under Section 10(10D)',
      'Ideal for child college education funding or post-retirement pension'
    ]
  }
];
