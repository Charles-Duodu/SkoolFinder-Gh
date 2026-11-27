import { mockSchools } from './schools';
import { mockProfessionals } from './professionals';
import { mockSuppliers } from './suppliers';
import { mockVacancies, mockApplications } from './recruitment';
import { mockRFQs, mockBids } from './procurement';
import { mockSafeguardingCases } from './cases';
import { mockAdmissionApplications } from './admissions';
import { ParentUser, ParentEnquiry, StudentAdmissionApplication } from '../../types';

export const mockInitialParent: ParentUser = {
  id: 'par-01',
  fullName: 'Ama Mensah',
  email: 'ama.mensah.accra@gmail.com',
  phone: '+233 24 551 2290',
  locality: 'East Legon',
  children: [
    { name: 'Nana Yaw Mensah', currentAge: 11, targetLevel: 'Junior High School' },
    { name: 'Akosua Mensah', currentAge: 5, targetLevel: 'Kindergarten' }
  ],
  savedSchoolIds: [],
  shortlistedSchoolIds: [],
  comparisonSchoolIds: [],
  alertPreferences: {
    admissionsDeadlines: true,
    feeChanges: false,
    newMatchingSchools: true
  }
};

export const mockInitialEnquiries: ParentEnquiry[] = [
  {
    id: 'enq-01',
    schoolId: 'sch-01',
    schoolName: 'Achimota Preparatory & International School',
    parentName: 'Ama Mensah',
    parentEmail: 'ama.mensah.accra@gmail.com',
    parentPhone: '+233 24 551 2290',
    childTargetLevel: 'Junior High School',
    subject: 'Inquiry regarding JHS 1 Admissions for 2026/2027 Academic Year',
    message: 'Good day. My son Nana Yaw is completing Primary 6. We would like to understand your diagnostic entrance assessment schedule and whether bus transit reaches East Legon.',
    submittedAt: '2026-05-16T10:15:00Z',
    status: 'Responded',
    responseNotes: 'We look forward to receiving Nana Yaw. Our East Legon route bus departs from American House at 6:45 AM. Entrance diagnostics take place on June 20th.'
  },
  {
    id: 'enq-02',
    schoolId: 'sch-02',
    schoolName: 'East Legon Cambridge Academy',
    parentName: 'Ama Mensah',
    parentEmail: 'ama.mensah.accra@gmail.com',
    parentPhone: '+233 24 551 2290',
    childTargetLevel: 'Junior High School',
    subject: 'Cambridge Checkpoint transition inquiry',
    message: 'Hello, could you share the fee schedule for Year 7 entry and whether extracurricular robotics is included?',
    submittedAt: '2026-05-18T14:30:00Z',
    status: 'Pending'
  }
];

export interface EcosystemState {
  schools: typeof mockSchools;
  professionals: typeof mockProfessionals;
  suppliers: typeof mockSuppliers;
  vacancies: typeof mockVacancies;
  applications: typeof mockApplications;
  rfqs: typeof mockRFQs;
  bids: typeof mockBids;
  enquiries: typeof mockInitialEnquiries;
  admissionApplications: StudentAdmissionApplication[];
  parent: typeof mockInitialParent;
  cases: typeof mockSafeguardingCases;
}

export const getInitialEcosystemState = (): EcosystemState => ({
  schools: [...mockSchools],
  professionals: [...mockProfessionals],
  suppliers: [...mockSuppliers],
  vacancies: [...mockVacancies],
  applications: [...mockApplications],
  rfqs: [...mockRFQs],
  bids: [...mockBids],
  enquiries: [...mockInitialEnquiries],
  admissionApplications: [...mockAdmissionApplications],
  parent: { ...mockInitialParent },
  cases: [...mockSafeguardingCases]
});
