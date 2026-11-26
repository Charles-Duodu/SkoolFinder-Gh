import { Professional } from '../../types';

export const mockProfessionals: Professional[] = [
  {
    id: 'pro-01',
    fullName: 'Kofi Addo Mensah',
    avatarUrl: '/images/professionals/teacher-kofi.jpg',
    title: 'Senior Physics & Mathematics Lead | IGCSE / WASSCE Specialist',
    mode: 'both',
    locality: 'East Legon',
    phone: '+233 24 388 9102',
    email: 'kofi.addo.edu@gmail.com',
    verificationStatus: 'approved',
    summary: 'Dedicated STEM educator with 11 years of proven success preparing candidates for Cambridge IGCSE, A-Levels, and WASSCE. Licensed by the National Teaching Council (NTC).',
    qualifications: [
      { degree: 'B.Sc. Mathematics & Physics', institution: 'University of Ghana, Legon', year: 2014 },
      { degree: 'Postgraduate Diploma in Education (PGDE)', institution: 'University of Cape Coast', year: 2017 }
    ],
    ntcLicenseNumber: 'NTC/2018/ACC-4912',
    yearsOfExperience: 11,
    subjects: ['Core Mathematics', 'Elective Mathematics', 'Physics', 'Robotics Basics'],
    targetLevels: ['Junior High School', 'Senior High School'],
    employmentPreference: 'Full-time',
    servicesOffered: [
      {
        id: 'srv-01',
        title: 'Intensive IGCSE & WASSCE Math Mastery Clinic',
        description: 'Targeted past-question problem solving, exam techniques, and formula derivation mastery in 1-on-1 weekend sessions.',
        category: 'STEM Tutoring',
        rateGHS: 'GHS 250 / session',
        active: true
      },
      {
        id: 'srv-02',
        title: 'School STEM Lab Curriculum Design',
        description: 'Consulting for private basic schools setting up modern experiential physics and hands-on robotics workshops.',
        category: 'Educational Consulting',
        rateGHS: 'GHS 3,500 / project',
        active: true
      }
    ]
  },
  {
    id: 'pro-02',
    fullName: 'Grace Naa Korkoi Tagoe',
    avatarUrl: '/images/professionals/teacher-grace.jpg',
    title: 'Certified Early Childhood Specialist & Reading Interventionist',
    mode: 'services',
    locality: 'Cantonments',
    phone: '+233 20 445 9918',
    email: 'grace.tagoe.reading@gmail.com',
    verificationStatus: 'approved',
    summary: 'Specialist in early literacy, phonics, and developmental milestones for children aged 3 to 9. Trained in Jolly Phonics and Orton-Gillingham multisensory reading instruction.',
    qualifications: [
      { degree: 'B.Ed. Early Childhood Development', institution: 'University of Education, Winneba', year: 2016 },
      { degree: 'Montessori Early Years Diploma', institution: 'AMI Accredited Training Centre Accra', year: 2019 }
    ],
    ntcLicenseNumber: 'NTC/2019/ACC-8831',
    yearsOfExperience: 8,
    subjects: ['Synthetic Phonics', 'Early Literacy', 'Foundation Numeracy'],
    targetLevels: ['Creche & Nursery', 'Kindergarten', 'Primary'],
    employmentPreference: 'Flexible',
    servicesOffered: [
      {
        id: 'srv-03',
        title: 'Diagnostic Reading Assessment & Remedial Phonics',
        description: 'Comprehensive screening for struggling readers with tailored weekly multisensory intervention plans.',
        category: 'Literacy Coaching',
        rateGHS: 'GHS 200 / hr',
        active: true
      }
    ]
  },
  {
    id: 'pro-03',
    fullName: 'Esi Sutherland-Addy',
    avatarUrl: '/images/professionals/teacher-esi.jpg',
    title: 'Senior Bilingual French & Literature Instructor | DELF / WASSCE Specialist',
    mode: 'career',
    locality: 'Tema',
    phone: '+233 24 119 4432',
    email: 'esi.sutherland.edu@gmail.com',
    verificationStatus: 'approved',
    summary: 'Bilingual French and Literature educator with extensive experience preparing students for DELF Prim, Junior, and WASSCE French examinations.',
    qualifications: [
      { degree: 'B.A. French & Linguistics', institution: 'University of Ghana, Legon', year: 2015 },
      { degree: 'DELF/DALF Examiner Certification', institution: 'Alliance Française d’Accra', year: 2018 }
    ],
    ntcLicenseNumber: 'NTC/2020/ACC-1092',
    yearsOfExperience: 7,
    subjects: ['French Language', 'Oral Communication', 'Francophone Literature'],
    targetLevels: ['Primary', 'Junior High School', 'Senior High School'],
    employmentPreference: 'Full-time',
    servicesOffered: []
  }
];
