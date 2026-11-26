import { Supplier } from '../../types';

export const mockSuppliers: Supplier[] = [
  {
    id: 'sup-01',
    businessName: 'Accra Educational Supplies & Stationery Ltd',
    registrationNumber: 'CS-44129-2016',
    category: 'Stationery & Books',
    additionalCategories: ['ICT & Software', 'Science Lab Equipment'],
    logoUrl: '/images/ecosystem-suppliers.jpg',
    locality: 'Osu',
    address: 'Oxford Street Commercial Complex, Osu, Accra',
    phone: '+233 30 279 8812',
    email: 'tenders@accraedusupplies.com.gh',
    website: 'https://accraedusupplies.com.gh',
    description: 'Premier supplier of GES & Cambridge certified exercise books, textbooks, teacher supplies, and STEM lab consumables across Greater Accra private schools.',
    verificationStatus: 'approved',
    coverageAreas: ['Accra Central', 'East Legon', 'Tema', 'Dansoman', 'Spintex', 'Achimota'],
    products: [
      {
        id: 'prd-01',
        title: 'Customized School Exercise Books (Bulk 5,000+ copies)',
        category: 'Stationery & Books',
        description: 'Hardback and softback branded exercise books with school crest, ruled or squared paper, 80gsm bond.',
        indicativePriceGHS: 6.50,
        unit: 'per copy'
      },
      {
        id: 'prd-02',
        title: 'Complete Secondary School Science Consumables Kit',
        category: 'Science Lab Equipment',
        description: 'Assorted chemical reagents, beakers, test tubes, and safety goggles calibrated to WASSCE/IGCSE syllabi.',
        indicativePriceGHS: 14500,
        unit: 'kit'
      }
    ]
  },
  {
    id: 'sup-02',
    businessName: 'VoltaCraft School Furniture & Metalworks',
    registrationNumber: 'CS-88192-2018',
    category: 'School Furniture',
    additionalCategories: ['Facility Maintenance'],
    logoUrl: '/logo-icon.svg',
    locality: 'Tema',
    address: 'Heavy Industrial Area, Plot 14, Tema',
    phone: '+233 30 321 0044',
    email: 'info@voltacraftfurniture.com',
    description: 'Ergonomic, durable dual-seater student desks, teacher podiums, library shelving, and cafeteria tables built with Ghanaian mahogany and powder-coated steel.',
    verificationStatus: 'approved',
    coverageAreas: ['Greater Accra Metropolitan Area', 'Kasoa', 'Nsawam'],
    products: [
      {
        id: 'prd-03',
        title: 'Ergonomic Dual-Seater Primary & JHS Desk Set',
        category: 'School Furniture',
        description: 'Heavy gauge steel frame with curved solid wood top, bag hooks, and integrated pencil groove.',
        indicativePriceGHS: 680,
        unit: 'per unit'
      }
    ]
  },
  {
    id: 'sup-03',
    businessName: 'SafeRide Student Transit Ghana',
    registrationNumber: 'CS-19284-2021',
    category: 'Student Transport',
    additionalCategories: ['Security Services'],
    logoUrl: '/images/ecosystem-suppliers.jpg',
    locality: 'Spintex',
    address: 'Spintex Industrial Enclave, Accra',
    phone: '+233 24 901 3322',
    email: 'fleet@saferidetransit.gh',
    description: 'Dedicated school bus outsourcing, GPS-tracked fleet operations, vetted drivers, and onboard child bus assistants serving leading private schools.',
    verificationStatus: 'approved',
    coverageAreas: ['Spintex', 'East Legon', 'Airport', 'Cantonments', 'Tema', 'Adenta'],
    products: [
      {
        id: 'prd-04',
        title: '30-Seater Coaster Bus Dedicated Termly Charter',
        category: 'Student Transport',
        description: 'Fully air-conditioned bus with live GPS parent-tracking app, dashcam, seatbelts, and licensed child attendant.',
        indicativePriceGHS: 32000,
        unit: 'per term'
      }
    ]
  },
  {
    id: 'sup-04',
    businessName: 'K-Tech Digital Classrooms West Africa',
    registrationNumber: 'CS-90218-2022',
    category: 'ICT & Software',
    additionalCategories: ['Facility Maintenance'],
    logoUrl: '/logo-icon.svg',
    locality: 'Airport Residential',
    address: 'Aviation House, 3rd Floor, Airport Residential, Accra',
    phone: '+233 30 276 4920',
    email: 'sales@ktechdigital.com.gh',
    description: 'Interactive smartboards, fiber networking, computer lab setups, and digital attendance hardware for forward-thinking schools.',
    verificationStatus: 'under_review',
    coverageAreas: ['All Greater Accra Districts'],
    products: [
      {
        id: 'prd-05',
        title: '75-inch 4K Interactive Touch Display for Classrooms',
        category: 'ICT & Software',
        description: 'Anti-glare Android/Windows interactive whiteboards with teacher lesson recording and stylus integration.',
        indicativePriceGHS: 24500,
        unit: 'per screen'
      }
    ]
  }
];
