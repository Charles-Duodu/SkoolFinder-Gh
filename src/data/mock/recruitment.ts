import { JobVacancy, JobApplication } from '../../types';

export const mockVacancies: JobVacancy[] = [
  {
    id: 'job-01',
    schoolId: 'sch-01',
    schoolName: 'Achimota Preparatory & International School',
    schoolLocality: 'Achimota',
    title: 'Senior JHS Mathematics & Computing Facilitator',
    department: 'STEM Department',
    educationLevel: 'Junior High School',
    contractType: 'Full-time',
    salaryRangeGHS: 'GHS 4,500 - GHS 6,500 / month',
    description: 'We are seeking an energetic, licensed educator to teach Upper Primary and Junior High School Mathematics and introductory Computing. The candidate will guide candidates towards outstanding BECE outcomes.',
    requirements: [
      'Bachelor of Education (Mathematics or Computer Science) or equivalent',
      'Valid NTC Teacher License',
      'Minimum 3 years teaching in a reputable private basic school',
      'Strong familiarity with the NaCCA standard-based curriculum',
      'Exemplary classroom discipline and student mentorship skills'
    ],
    deadline: '2026-07-28',
    createdAt: '2026-05-10',
    status: 'Open',
    applicantsCount: 4
  },
  {
    id: 'job-02',
    schoolId: 'sch-02',
    schoolName: 'East Legon Cambridge Academy',
    schoolLocality: 'East Legon',
    title: 'Cambridge Checkpoint & IGCSE Physics Teacher',
    department: 'Science & Technology',
    educationLevel: 'Junior High School',
    contractType: 'Full-time',
    salaryRangeGHS: 'GHS 7,500 - GHS 11,000 / month',
    description: 'Opportunity to join an elite international academic faculty delivering the Cambridge Lower Secondary and IGCSE Physics syllabus in cutting-edge laboratory facilities.',
    requirements: [
      'B.Sc. / B.Ed. in Physics or Applied Sciences',
      'Demonstrated track record of students achieving A* and A grades in IGCSE Physics',
      'Minimum 4 years teaching British curriculum in accredited international institutions',
      'Experience supervising coursework and practical lab investigations'
    ],
    deadline: '2026-08-05',
    createdAt: '2026-05-14',
    status: 'Open',
    applicantsCount: 6
  },
  {
    id: 'job-03',
    schoolId: 'sch-03',
    schoolName: 'Cantonments Montessori & Childcare Centre',
    schoolLocality: 'Cantonments',
    title: 'Lead Montessori Directress (Ages 3-6 / Casa)',
    department: 'Early Years',
    educationLevel: 'Kindergarten',
    contractType: 'Full-time',
    salaryRangeGHS: 'GHS 5,000 - GHS 7,800 / month',
    description: 'Lead a prepared Montessori Casa classroom. Cultivate independent exploration, sensory grace, and early phonemic awareness in a calm, respectful bilingual environment.',
    requirements: [
      'Diploma or Certification from an accredited Montessori training body (AMI/AMS)',
      'Proven experience managing early childhood environments',
      'Warm, patient demeanor with first aid / pediatric CPR qualification'
    ],
    deadline: '2026-07-20',
    createdAt: '2026-05-02',
    status: 'Open',
    applicantsCount: 2
  }
];

export const mockApplications: JobApplication[] = [
  {
    id: 'app-01',
    jobId: 'job-01',
    jobTitle: 'Senior JHS Mathematics & Computing Facilitator',
    schoolId: 'sch-01',
    schoolName: 'Achimota Preparatory & International School',
    professionalId: 'pro-01',
    applicantName: 'Kofi Addo Mensah',
    applicantEmail: 'kofi.addo.edu@gmail.com',
    applicantPhone: '+233 24 388 9102',
    qualificationsSummary: 'B.Sc. Mathematics & Physics (UG), PGDE (UCC), Licensed NTC Teacher with 11 years experience in BECE and IGCSE preparation.',
    coverNote: 'I have closely followed Achimota Preparatory’s historic commitment to STEM excellence. Having produced a 98% distinction rate in past BECE cohorts, I am eager to contribute my pedagogical leadership to your department.',
    submittedAt: '2026-05-15T09:30:00Z',
    status: 'Shortlisted'
  }
];
