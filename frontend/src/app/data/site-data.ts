export const COMPANY = {
  name: 'Sri Raghavendra Engineering Services',
  shortName: 'SRES',
  tagline: 'Diesel Generator Sets · Engines · Alternators',
  description:
    'Specialists in erection, commissioning, repairs and overhauls of diesel generator sets, diesel engines, and alternators. Sale & purchase of second hand gensets.',
  phone: '+91 9440039765',
  email: 'info@sriraghavendraengineering.com',
  address: 'Hyderabad, Telangana, India',
  hours: 'Mon–Sat: 9:00 AM – 6:00 PM',
};

export interface SiteService {
  id: number;
  name: string;
  description: string;
  details: string[];
}

export const SERVICES: SiteService[] = [
  {
    id: 1,
    name: 'Erection & Commissioning of DG Sets',
    description:
      'Complete erection, alignment, piping, cabling, and commissioning of diesel generator sets for industrial and commercial installations.',
    details: [
      'Foundation and base frame installation',
      'Exhaust, fuel, and cooling system integration',
      'Electrical termination and control panel wiring',
      'Load testing and handover commissioning',
    ],
  },
  {
    id: 2,
    name: 'Repairs & Overhauls of Diesel Generator Sets',
    description:
      'Comprehensive repair and overhaul services for diesel generator sets to restore performance, reliability, and operational life.',
    details: [
      'Breakdown diagnosis and corrective repairs',
      'Major and minor overhauls',
      'Performance restoration and load trials',
      'Preventive inspection and servicing',
    ],
  },
  {
    id: 3,
    name: 'Repairs & Overhauls of Diesel Engines',
    description:
      'Expert repair and overhaul of diesel engines used in generator sets and industrial applications across leading OEM brands.',
    details: [
      'Engine dismantling and inspection',
      'Cylinder, piston, and bearing overhauls',
      'Fuel injection and turbocharger servicing',
      'Testing and calibration after overhaul',
    ],
  },
  {
    id: 4,
    name: 'Repairs & Overhauls of Alternators',
    description:
      'Specialized alternator repair and overhaul services including winding, insulation, and AVR-related corrective work.',
    details: [
      'Alternator fault diagnosis',
      'Winding and insulation repairs',
      'Bearing replacement and alignment checks',
      'Output testing and voltage stability checks',
    ],
  },
  {
    id: 5,
    name: 'Sale & Purchase of Second Hand Gensets',
    description:
      'We deal with sale and purchase of all types of second hand diesel generator sets — inspected, tested, and ready for deployment.',
    details: [
      'All kVA ranges and brands available',
      'Quality inspection before sale',
      'Purchase of used gensets at fair valuation',
      'Transportation and installation support',
    ],
  },
  {
    id: 6,
    name: 'Annual Maintenance Contract (AMC)',
    description:
      'Scheduled preventive maintenance plans to keep your DG sets, engines, and alternators running reliably year-round.',
    details: [
      'Periodic servicing schedules',
      'Oil, filter, and coolant changes',
      'Emergency breakdown visits',
      'Performance and service reports',
    ],
  },
  {
    id: 7,
    name: 'Emergency Breakdown Service',
    description:
      'Rapid on-site breakdown support for generator sets, diesel engines, and alternators to minimize downtime.',
    details: [
      '24/7 emergency response',
      'On-site fault diagnosis',
      'Critical spare parts support',
      'Temporary power restoration',
    ],
  },
  {
    id: 8,
    name: 'Load Bank Testing & Spare Parts',
    description:
      'Load bank testing, control panel service, ATS checks, and genuine/spare parts supply for all major brands.',
    details: [
      'Full load and capacity testing',
      'AVR and control panel repairs',
      'Transfer switch servicing',
      'OEM and compatible spare parts',
    ],
  },
];

export const SPECIALIST_BRANDS = [
  'Ashok Leyland',
  'Kirloskar',
  'Caterpillar',
  'Cummins',
  'Rustom',
  'Other',
];

export const BRANDS = SPECIALIST_BRANDS.filter((b) => b !== 'Other').concat(['Mahindra', 'Greaves', 'Koel']);

export const QUOTATION_SERVICES = [
  { id: 'erection', name: 'Erection & Commissioning of DG Sets', category: 'Installation' },
  { id: 'dg-repair', name: 'Repairs & Overhauls of Diesel Generator Sets', category: 'Repairs' },
  { id: 'engine-repair', name: 'Repairs & Overhauls of Diesel Engines', category: 'Repairs' },
  { id: 'alternator-repair', name: 'Repairs & Overhauls of Alternators', category: 'Repairs' },
  { id: 'sh-sale', name: 'Sale of Second Hand Gensets', category: 'Second Hand' },
  { id: 'sh-purchase', name: 'Purchase of Second Hand Gensets', category: 'Second Hand' },
  { id: 'amc', name: 'Annual Maintenance Contract (AMC)', category: 'Maintenance' },
  { id: 'breakdown', name: 'Emergency Breakdown Service', category: 'Maintenance' },
  { id: 'load-test', name: 'Load Bank Testing', category: 'Testing' },
  { id: 'spares', name: 'Spare Parts Supply', category: 'Supply' },
  { id: 'fuel-system', name: 'Fuel System Service', category: 'Maintenance' },
  { id: 'control-panel', name: 'Control Panel & ATS Service', category: 'Electrical' },
];

export interface QuotationRecord {
  quotationNo: string;
  date: string;
  customerName: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  brand: string;
  equipmentDetails: string;
  powerKVA: string;
  selectedServices: string[];
  message: string;
  urgency: string;
}

export const HIGHLIGHTS = [
  { title: 'DG Set Erection', desc: 'Professional installation and commissioning' },
  { title: 'Repairs & Overhauls', desc: 'Generator sets, engines & alternators' },
  { title: 'Second Hand Gensets', desc: 'Sale & purchase of all types' },
  { title: 'Brand Specialists', desc: 'Ashok Leyland, Kirloskar, CAT, Cummins, Rustom' },
];

export interface HistoryMilestone {
  year: string;
  title: string;
  description: string;
}

export const COMPANY_HISTORY = {
  intro:
    'Sri Raghavendra Engineering Services began as a small-scale industry in 1995, with a modest workshop and a handful of skilled technicians dedicated to diesel generator repair. Over three decades of steady growth, we have evolved into a trusted name for DG set erection, commissioning, repairs, overhauls, and second-hand genset trading across Telangana and Andhra Pradesh.',
  milestones: [
    {
      year: '1995',
      title: 'Humble Beginnings',
      description:
        'Founded as a small-scale industry in Hyderabad with a focus on diesel generator repairs and basic engine servicing for local factories and commercial establishments.',
    },
    {
      year: '2000',
      title: 'Expanding Workshop Capabilities',
      description:
        'Invested in workshop infrastructure and tooling to handle major overhauls of diesel engines and alternators, serving a growing industrial client base.',
    },
    {
      year: '2005',
      title: 'Erection & Commissioning Services',
      description:
        'Extended services to include complete DG set erection, alignment, piping, cabling, and commissioning for new installations at industrial sites.',
    },
    {
      year: '2010',
      title: 'Multi-Brand Expertise',
      description:
        'Built specialist capabilities across leading brands including Cummins, Kirloskar, Caterpillar, Ashok Leyland, and Rustom — becoming a one-stop service partner.',
    },
    {
      year: '2015',
      title: 'Second Hand Genset Trading',
      description:
        'Launched sale and purchase of second-hand diesel generator sets with quality inspection, load testing, and installation support for buyers and sellers.',
    },
    {
      year: '2020',
      title: 'AMC & Emergency Response',
      description:
        'Introduced Annual Maintenance Contracts and 24/7 emergency breakdown services to help clients minimize downtime and maintain reliable power backup.',
    },
    {
      year: 'Today',
      title: 'Three Decades of Trust',
      description:
        'From a small workshop in 1995 to a full-service engineering company — we continue to deliver honest workmanship, timely service, and lasting relationships with every client we serve.',
    },
  ] as HistoryMilestone[],
  values: [
    'Quality workmanship on every repair and overhaul',
    'Transparent pricing and honest assessments',
    'On-time project delivery for erection and commissioning',
    'Long-term partnerships through AMC and support contracts',
  ],
};

export const ENQUIRY_TYPES = QUOTATION_SERVICES.map((s) => s.name).concat(['General Enquiry']);
