import { School } from '../../types';

export const mockSchools: School[] = [
  {
    id: 'sch-01',
    name: 'Achimota Preparatory & International School',
    slug: 'achimota-preparatory-international',
    tagline: 'Excellence in holistic basic and primary education in Accra since 1958',
    crestUrl: '/logo-icon.svg',
    coverImageUrl: '/images/schools/school-achimota.jpg',
    galleryImages: [
      '/images/schools/school-achimota.jpg',
      '/images/hero-1.jpg',
      '/images/hero-2.jpg'
    ],
    locality: 'Achimota',
    digitalAddress: 'GA-112-9042',
    address: 'Near Achimota Forest Reserve, Forest Road, Accra',
    phone: '+233 30 240 1928',
    email: 'admissions@achimotaprep.edu.gh',
    website: 'https://achimotaprep.edu.gh',
    yearEstablished: 1958,
    ownershipType: 'Private',
    educationLevels: ['Creche & Nursery', 'Kindergarten', 'Primary', 'Junior High School'],
    curricula: ['GES / NaCCA', 'British-Ghanaian Dual'],
    boardingStatus: 'Day Only',
    gender: 'Co-educational',
    facilities: [
      'Modern Science Lab',
      'ICT Innovation Suite',
      'Multi-purpose Sports Complex',
      'Library & Media Resource Room',
      'Music & Performing Arts Studio',
      'Air-conditioned Kindergarten block',
      'School Bus Fleet'
    ],
    annualFeeRange: {
      min: 14500,
      max: 26000,
      currency: 'GHS'
    },
    studentTeacherRatio: '14:1',
    averageClassSize: 22,
    verificationStatus: 'approved',
    featured: true,
    aboutText: 'Achimota Preparatory & International School has provided generations of young Ghanaians with a rigorous, nurturing, and disciplined foundation. Nestled amidst serene greenery near the Achimota enclave, our school integrates modern STEM pedagogy with Ghanaian civic ethos, producing well-rounded scholars with exceptional BECE performance.',
    admissionsOverview: 'Admissions for Creche, KG, and Primary 1-5 for the upcoming academic year are now open. Prospective students entering Upper Primary and JHS must sit a diagnostic proficiency test in English and Mathematics.',
    admissionsDeadline: '2026-08-15',
    contactPerson: {
      name: 'Mrs. Janet Quaye',
      role: 'Head of Admissions',
      phone: '+233 24 411 9087',
      email: 'j.quaye@achimotaprep.edu.gh'
    }
  },
  {
    id: 'sch-02',
    name: 'East Legon Cambridge Academy',
    slug: 'east-legon-cambridge-academy',
    tagline: 'World-class British curriculum education from Early Years through IGCSE',
    crestUrl: '/logo-icon.svg',
    coverImageUrl: '/images/schools/school-east-legon.jpg',
    galleryImages: [
      '/images/schools/school-east-legon.jpg',
      '/images/hero-2.jpg',
      '/images/hero-3.jpg'
    ],
    locality: 'East Legon',
    digitalAddress: 'GD-204-5519',
    address: 'Lagos Avenue, Off Mensah Wood Street, East Legon, Accra',
    phone: '+233 30 252 8841',
    email: 'info@eastlegoncambridge.com',
    website: 'https://eastlegoncambridge.com',
    yearEstablished: 2012,
    ownershipType: 'International Private',
    educationLevels: ['Creche & Nursery', 'Kindergarten', 'Primary', 'Junior High School', 'Senior High School'],
    curricula: ['Cambridge International'],
    boardingStatus: 'Day Only',
    gender: 'Co-educational',
    facilities: [
      'Robotics & Coding Lab',
      'Swimming Pool (Heated & Covered)',
      'Cambridge Certified Exam Centre',
      'Catering Hall with Organic Menu',
      'Tennis & Basketball Courts',
      'CCTV Secured Campus'
    ],
    annualFeeRange: {
      min: 38000,
      max: 75000,
      currency: 'GHS'
    },
    studentTeacherRatio: '10:1',
    averageClassSize: 16,
    verificationStatus: 'approved',
    featured: true,
    aboutText: 'East Legon Cambridge Academy offers a premiere British curriculum tailored for globally-minded families. Our students consistently excel in Cambridge Checkpoint and IGCSE examinations, with strong placement into leading secondary colleges both in the UK and North America.',
    admissionsOverview: 'Rolling admissions for Nursery through Year 10. Parent interviews and student assessments are conducted weekly.',
    admissionsDeadline: '2026-07-30',
    contactPerson: {
      name: 'Dr. Michael Bruce-Addy',
      role: 'Principal & Registrar',
      phone: '+233 20 890 1234',
      email: 'm.bruce@eastlegoncambridge.com'
    }
  },
  {
    id: 'sch-03',
    name: 'Cantonments Montessori & Childcare Centre',
    slug: 'cantonments-montessori-centre',
    tagline: 'Child-centered developmental foundation for infants, toddlers and kindergarteners',
    crestUrl: '/logo-icon.svg',
    coverImageUrl: '/images/schools/school-cantonments.jpg',
    galleryImages: [
      '/images/schools/school-cantonments.jpg',
      '/images/hero-1.jpg'
    ],
    locality: 'Cantonments',
    digitalAddress: 'GL-019-3312',
    address: 'Circular Road, Cantonments Diplomatic Enclave, Accra',
    phone: '+233 30 277 4432',
    email: 'enrol@cantonmentsmontessori.gh',
    yearEstablished: 2017,
    ownershipType: 'Private',
    educationLevels: ['Creche & Nursery', 'Kindergarten', 'Primary'],
    curricula: ['Montessori', 'British-Ghanaian Dual'],
    boardingStatus: 'Day Only',
    gender: 'Co-educational',
    facilities: [
      'Montessori Prepared Environments',
      'Sensory Garden & Mini Farm',
      'Pediatric First Aid Bay',
      'Shaded Softplay Area',
      'Nutritious On-site Kitchen'
    ],
    annualFeeRange: {
      min: 22000,
      max: 42000,
      currency: 'GHS'
    },
    studentTeacherRatio: '6:1',
    averageClassSize: 12,
    verificationStatus: 'approved',
    featured: true,
    isClaimed: false,
    aboutText: 'Dedicated to the fundamental early years of human development, Cantonments Montessori provides an authentic AMI-aligned environment fostering curiosity, self-confidence, motor refinement, and independence in early learners.',
    admissionsOverview: 'Children admitted from 6 months old through 8 years. Termly intake available upon classroom space vacancy.',
    contactPerson: {
      name: 'Ms. Akua Frimpong',
      role: 'Director of Early Childhood',
      phone: '+233 24 555 7789',
      email: 'a.frimpong@cantonmentsmontessori.gh'
    }
  },
  {
    id: 'sch-04',
    name: 'Tema Community International College',
    slug: 'tema-community-international-college',
    tagline: 'Leading Day & Boarding Senior High and Cambridge Sixth Form in Greater Accra',
    crestUrl: '/logo-icon.svg',
    coverImageUrl: '/images/schools/school-tema.jpg',
    galleryImages: [
      '/images/schools/school-tema.jpg',
      '/images/hero-3.jpg',
      '/images/hero-2.jpg'
    ],
    locality: 'Tema',
    digitalAddress: 'TX-044-8891',
    address: 'Community 22, Near Afariwaa, Tema',
    phone: '+233 30 330 9920',
    email: 'info@temacollege.edu.gh',
    website: 'https://temacollege.edu.gh',
    yearEstablished: 2004,
    ownershipType: 'International Private',
    educationLevels: ['Junior High School', 'Senior High School'],
    curricula: ['International Baccalaureate (IB)', 'Cambridge International', 'GES / NaCCA'],
    boardingStatus: 'Day & Boarding',
    gender: 'Co-educational',
    facilities: [
      'Executive Boarding Hostels',
      'Olympic-sized Swimming Pool',
      'Advanced Robotics & STEM Foundry',
      'Full FIFA-standard Football Pitch',
      'Auditorium with 1200 capacity'
    ],
    annualFeeRange: {
      min: 45000,
      max: 95000,
      currency: 'GHS'
    },
    studentTeacherRatio: '11:1',
    averageClassSize: 18,
    verificationStatus: 'approved',
    featured: true,
    aboutText: 'Tema Community International College delivers rigorous IB Diploma and Cambridge A-Levels alongside GES SHS science and business tracks. Our sprawling, secure 15-acre campus in Community 22 provides optimal boarding conditions and unparalleled extracurricular infrastructure.',
    admissionsOverview: 'Entrance examinations held in March, May, and July. Boarding spot allocations require early reservation.',
    admissionsDeadline: '2026-07-15',
    contactPerson: {
      name: 'Mr. Emmanuel Osei-Tutu',
      role: 'Dean of Boarding Admissions',
      phone: '+233 24 332 1109',
      email: 'e.oseitutu@temacollege.edu.gh'
    }
  },
  {
    id: 'sch-05',
    name: 'Ridge View Christian High School',
    slug: 'ridge-view-christian-high',
    tagline: 'Moral discipline and exemplary WASSCE academic results in the heart of Ridge',
    crestUrl: '/logo-icon.svg',
    coverImageUrl: '/images/hero-3.jpg',
    galleryImages: [
      '/images/hero-3.jpg',
      '/images/schools/school-tema.jpg'
    ],
    locality: 'Ridge',
    digitalAddress: 'GA-029-7104',
    address: 'Gamel Abdul Nasser Avenue, Ridge, Accra',
    phone: '+233 30 222 6601',
    email: 'admissions@ridgeviewhigh.edu.gh',
    yearEstablished: 1999,
    ownershipType: 'Mission / Faith-Based',
    educationLevels: ['Junior High School', 'Senior High School'],
    curricula: ['GES / NaCCA'],
    boardingStatus: 'Day & Boarding',
    gender: 'Co-educational',
    facilities: [
      'Physics, Chemistry & Biology Labs',
      'Chapel & Assembly Hall',
      'Modern Dining Facilities',
      'Computer & Coding Lab'
    ],
    annualFeeRange: {
      min: 12000,
      max: 24000,
      currency: 'GHS'
    },
    studentTeacherRatio: '18:1',
    averageClassSize: 28,
    verificationStatus: 'approved',
    featured: false,
    aboutText: 'Ridge View Christian High School blends deep Christian virtues with rigorous national curriculum training. Recognized among the highest performing private institutions in the Greater Accra WASSCE rankings.',
    admissionsOverview: 'BECE graduates can apply directly with their raw score slips. Direct scholarship assistance available for top performers.',
    contactPerson: {
      name: 'Rev. Samuel Mensah',
      role: 'Headmaster',
      phone: '+233 20 112 3344',
      email: 'head@ridgeviewhigh.edu.gh'
    }
  },
  {
    id: 'sch-06',
    name: 'Spintex Grace Children Academy',
    slug: 'spintex-grace-children-academy',
    tagline: 'Affordable, community-focused basic education excellence on Spintex Road',
    crestUrl: '/logo-icon.svg',
    coverImageUrl: '/images/hero-1.jpg',
    galleryImages: [
      '/images/hero-1.jpg',
      '/images/schools/school-achimota.jpg'
    ],
    locality: 'Spintex',
    digitalAddress: 'GT-319-2011',
    address: 'Near Baatsona Total, Spintex Road, Accra',
    phone: '+233 30 281 4099',
    email: 'info@spintexgrace.edu.gh',
    yearEstablished: 2015,
    ownershipType: 'Private',
    educationLevels: ['Creche & Nursery', 'Kindergarten', 'Primary', 'Junior High School'],
    curricula: ['GES / NaCCA'],
    boardingStatus: 'Day Only',
    gender: 'Co-educational',
    facilities: [
      'ICT Lab with High-Speed Fiber',
      'Art & Craft Workshop',
      'Fenced Play Playground',
      'Sick Bay with Registered Nurse'
    ],
    annualFeeRange: {
      min: 8000,
      max: 15000,
      currency: 'GHS'
    },
    studentTeacherRatio: '16:1',
    averageClassSize: 24,
    verificationStatus: 'approved',
    featured: false,
    aboutText: 'Serving the vibrant Spintex and Baatsona communities, Grace Children Academy is committed to providing middle-income Ghanaian families with world-class basic education standards at accessible tuition structures.',
    admissionsOverview: 'Admissions open throughout the academic terms for primary classes with continuous assessment.',
    contactPerson: {
      name: 'Mrs. Cynthia Donkor',
      role: 'School Administrator',
      phone: '+233 24 990 0112',
      email: 'c.donkor@spintexgrace.edu.gh'
    }
  },
  {
    id: 'sch-07',
    name: 'Dansoman Heritage International School',
    slug: 'dansoman-heritage-international',
    tagline: 'Pioneering holistic bilingual learning in West Accra',
    crestUrl: '/logo-icon.svg',
    coverImageUrl: '/images/schools/school-achimota.jpg',
    galleryImages: [
      '/images/schools/school-achimota.jpg',
      '/images/hero-2.jpg'
    ],
    locality: 'Dansoman',
    digitalAddress: 'GA-541-0021',
    address: 'Sahara Street, Dansoman Estate, Accra',
    phone: '+233 30 231 7765',
    email: 'enquiries@dansomanheritage.gh',
    yearEstablished: 2008,
    ownershipType: 'Private',
    educationLevels: ['Kindergarten', 'Primary', 'Junior High School'],
    curricula: ['GES / NaCCA', 'British-Ghanaian Dual'],
    boardingStatus: 'Day Only',
    gender: 'Co-educational',
    facilities: [
      'French Language Immersion Lab',
      'Science Workshop',
      'Basketball Court',
      'Band & Orchestral Studio'
    ],
    annualFeeRange: {
      min: 11000,
      max: 19500,
      currency: 'GHS'
    },
    studentTeacherRatio: '15:1',
    averageClassSize: 20,
    verificationStatus: 'approved',
    featured: false,
    aboutText: 'Situated in the heart of Dansoman, Heritage International offers vibrant co-curricular programming with strong English and French dual-language immersion, shaping future Pan-African leaders.',
    admissionsOverview: 'Limited spaces available for Primary 2-6 and JHS 1.',
    contactPerson: {
      name: 'Mr. David Annan',
      role: 'Admissions Officer',
      phone: '+233 20 771 9982',
      email: 'd.annan@dansomanheritage.gh'
    }
  },
  {
    id: 'sch-08',
    name: 'Airport Hills Early Learning Haven',
    slug: 'airport-hills-early-haven',
    tagline: 'Nurturing curiosity, creativity, and foundational literacy',
    crestUrl: '/logo-icon.svg',
    coverImageUrl: '/images/schools/school-cantonments.jpg',
    galleryImages: [
      '/images/schools/school-cantonments.jpg',
      '/images/hero-1.jpg'
    ],
    locality: 'Airport Residential',
    digitalAddress: 'GA-088-3412',
    address: 'Near Villaggio Vista, Airport Residential, Accra',
    phone: '+233 30 278 1239',
    email: 'hello@airporthillshaven.com',
    yearEstablished: 2020,
    ownershipType: 'Private',
    educationLevels: ['Creche & Nursery', 'Kindergarten'],
    curricula: ['Montessori'],
    boardingStatus: 'Day Only',
    gender: 'Co-educational',
    facilities: [
      'Infant Sleep Sanctuary',
      'Splash Pool & Water Play',
      'Reggio-Emilia Inspired Art Studio',
      'Organic Meal Kitchen'
    ],
    annualFeeRange: {
      min: 30000,
      max: 55000,
      currency: 'GHS'
    },
    studentTeacherRatio: '4:1',
    averageClassSize: 10,
    verificationStatus: 'under_review',
    featured: false,
    aboutText: 'Airport Hills Haven provides infant care and early years education with international caregiver certifications, strict safety hygiene protocols, and sensory-rich outdoor exploration.',
    admissionsOverview: 'Infant admissions accepted year-round. Nursery sessions operate full-day and extended flex-care.',
    contactPerson: {
      name: 'Ms. Belinda Koomson',
      role: 'Director',
      phone: '+233 24 100 2233',
      email: 'b.koomson@airporthillshaven.com'
    }
  }
];
