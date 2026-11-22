import { RFQTender, QuotationBid } from '../../types';

export const mockRFQs: RFQTender[] = [
  {
    id: 'rfq-01',
    schoolId: 'sch-01',
    schoolName: 'Achimota Preparatory & International School',
    schoolLocality: 'Achimota',
    title: 'Procurement of 2026/2027 Branded Student Exercise Books & Graph Pads',
    category: 'Stationery & Books',
    description: 'Achimota Preparatory requests competitive bids from registered stationery manufacturers for the supply of customized school exercise books with four-colour crest covers on 250gsm card and 80gsm inner bond.',
    items: [
      { name: '80-page Ruled Exercise Books (A4 size)', quantity: 15000, unit: 'copies' },
      { name: '60-page Square Grid Math Books (A4 size)', quantity: 8000, unit: 'copies' },
      { name: 'Custom Science Practical Record Books with Graph', quantity: 3500, unit: 'copies' }
    ],
    deadline: '2026-07-31',
    deliveryLocality: 'Achimota Campus, Forest Road, Accra',
    createdAt: '2026-05-01',
    status: 'Open',
    bidsCount: 2
  },
  {
    id: 'rfq-02',
    schoolId: 'sch-04',
    schoolName: 'Tema Community International College',
    schoolLocality: 'Tema',
    title: 'Supply and Installation of 40 Desktop Computer Workstations for Robotics Lab',
    category: 'ICT & Software',
    description: 'TCIC invites quotations for enterprise-grade Core i7 mini-PCs with dual 24-inch monitors, mechanical keyboards, and 3-year warranty for our secondary robotics workshop.',
    items: [
      { name: 'Core i7 Mini PC Workstations (32GB RAM, 1TB NVMe)', quantity: 40, unit: 'units' },
      { name: '24-inch IPS Dual Ergonomic Monitor Arms', quantity: 40, unit: 'pairs' },
      { name: '1000VA Line-Interactive Smart UPS', quantity: 40, unit: 'units' }
    ],
    deadline: '2026-08-10',
    deliveryLocality: 'Community 22, Tema Campus',
    createdAt: '2026-05-12',
    status: 'Open',
    bidsCount: 3
  },
  {
    id: 'rfq-03',
    schoolId: 'sch-03',
    schoolName: 'Cantonments Montessori & Childcare Centre',
    schoolLocality: 'Cantonments',
    title: 'Supply of Child-Safe Beechwood Outdoor Playground Set & Soft Turf',
    category: 'School Furniture',
    description: 'Design, supply, and secure anchoring of non-toxic Montessori climbing frames, slides, balance beams, and shock-absorbent artificial grass for outdoor play area.',
    items: [
      { name: 'Modular Wooden Climbing Frame with Slide', quantity: 2, unit: 'sets' },
      { name: 'Outdoor Sensory Balance Beam Course', quantity: 1, unit: 'set' },
      { name: '40mm High-Density Cushion Artificial Grass', quantity: 250, unit: 'sq metres' }
    ],
    deadline: '2026-07-15',
    deliveryLocality: 'Circular Road, Cantonments, Accra',
    createdAt: '2026-05-08',
    status: 'Open',
    bidsCount: 1
  }
];

export const mockBids: QuotationBid[] = [
  {
    id: 'bid-01',
    rfqId: 'rfq-01',
    rfqTitle: 'Procurement of 2026/2027 Branded Student Exercise Books & Graph Pads',
    schoolId: 'sch-01',
    schoolName: 'Achimota Preparatory & International School',
    supplierId: 'sup-01',
    supplierName: 'Accra Educational Supplies & Stationery Ltd',
    supplierCategory: 'Stationery & Books',
    totalAmountGHS: 142500,
    deliveryTimelineDays: 21,
    warrantyPeriodMonths: 6,
    validUntil: '2026-08-30',
    proposalNotes: 'Pricing includes complimentary graphic design proofing, shrink-wrap bundling into packs of 10, and scheduled delivery directly to Achimota storehouse.',
    submittedAt: '2026-05-18T14:20:00Z',
    status: 'Shortlisted'
  }
];
