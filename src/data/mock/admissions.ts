import { StudentAdmissionApplication } from '../../types';

export const mockAdmissionApplications: StudentAdmissionApplication[] = [
  {
    id: 'adm-01',
    schoolId: 'sch-01',
    schoolName: 'Achimota Preparatory & International School',
    schoolLocality: 'Achimota',
    parentName: 'Ama Mensah',
    parentEmail: 'ama.mensah.accra@gmail.com',
    parentPhone: '+233 24 551 2290',
    studentName: 'Nana Yaw Mensah',
    dateOfBirth: '2015-03-14',
    gender: 'Male',
    targetLevel: 'Junior High School',
    targetTerm: 'Term 1 (September)',
    targetYear: 2026,
    digitalAddress: 'GA-183-9021',
    previousSchool: 'North Ridge Primary School',
    specialNeeds: 'Mild asthmatic (inhaler kept with school nurse)',
    documentsAttached: [
      'Primary 6 Terminal Report Card.pdf',
      'Birth Certificate.pdf',
      'Ghana Card Guardian Copy.pdf',
      'Immunisation & Clinic Record.pdf'
    ],
    submittedAt: '2026-05-14T09:30:00Z',
    status: 'Assessment Scheduled',
    assessmentDate: '2026-06-20T09:00:00Z',
    schoolNotes: 'Entrance assessment in English Comprehension and Mathematics scheduled for Saturday, 20 June at Main Admin Hall.'
  },
  {
    id: 'adm-02',
    schoolId: 'sch-02',
    schoolName: 'East Legon Cambridge Academy',
    schoolLocality: 'East Legon',
    parentName: 'Ama Mensah',
    parentEmail: 'ama.mensah.accra@gmail.com',
    parentPhone: '+233 24 551 2290',
    studentName: 'Akosua Mensah',
    dateOfBirth: '2021-08-22',
    gender: 'Female',
    targetLevel: 'Kindergarten',
    targetTerm: 'Term 1 (September)',
    targetYear: 2026,
    digitalAddress: 'GA-183-9021',
    previousSchool: 'Little Angels Daycare East Legon',
    documentsAttached: [
      'Child Immunisation Record.pdf',
      'Passport Photograph.jpg',
      'Birth Certificate.pdf'
    ],
    submittedAt: '2026-05-18T11:15:00Z',
    status: 'Under Review',
    schoolNotes: 'Early years readiness questionnaire submitted. Under review with KG Department head.'
  },
  {
    id: 'adm-03',
    schoolId: 'sch-01',
    schoolName: 'Achimota Preparatory & International School',
    schoolLocality: 'Achimota',
    parentName: 'Kwesi Appiah',
    parentEmail: 'kwesi.appiah.gh@outlook.com',
    parentPhone: '+233 20 811 4452',
    studentName: 'Kofi Appiah',
    dateOfBirth: '2017-11-05',
    gender: 'Male',
    targetLevel: 'Primary',
    targetTerm: 'Term 1 (September)',
    targetYear: 2026,
    digitalAddress: 'GW-044-1290',
    previousSchool: 'St. Martin de Porres School Dansoman',
    documentsAttached: [
      'Primary 2 Terminal Report.pdf',
      'Birth Certificate.pdf'
    ],
    submittedAt: '2026-05-10T14:20:00Z',
    status: 'Admitted / Offered',
    assessmentDate: '2026-05-28T10:00:00Z',
    schoolNotes: 'Passed diagnostics with distinction (88% aggregate). Provisional admission offer letter issued.'
  }
];
