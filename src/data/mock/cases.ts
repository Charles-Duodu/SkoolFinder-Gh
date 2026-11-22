import { SafeguardingCase, AdminRoleMatrix } from '../../types';

export const mockSafeguardingCases: SafeguardingCase[] = [
  {
    id: 'case-01',
    title: 'Perimeter Safety & Unauthorized Visitor Protocol Inquiry',
    category: 'Safety Concern',
    entityType: 'School',
    entityName: 'Spintex Grace Children Academy',
    severity: 'Medium',
    status: 'Investigating',
    reportedAt: '2026-05-11T11:00:00Z',
    summary: 'Parent noted delivery couriers entering primary classroom zones without security badge clearance during break time.',
    notes: [
      '2026-05-11: Report logged by parent via confidential portal triage.',
      '2026-05-12: Contacted school proprietor; revised gate check log and designated courier drop box instituted.'
    ]
  },
  {
    id: 'case-02',
    title: 'Unverified Teacher Credential Misrepresentation Flag',
    category: 'Staff Conduct',
    entityType: 'Professional',
    entityName: 'Applicant ID #PR-8921',
    severity: 'High',
    status: 'Action Required',
    reportedAt: '2026-05-14T16:45:00Z',
    summary: 'NTC license number provided failed automatic checksum validation against National Teaching Council public registry.',
    notes: [
      '2026-05-14: System compliance flagged duplicate ID number.',
      '2026-05-15: Professional profile temporarily suspended from public directory pending submission of certified physical certificate.'
    ]
  }
];

export const mockAdminRoleMatrices: AdminRoleMatrix[] = [
  {
    roleName: 'Super Administrator',
    description: 'Full administrative access across all governance, user directories, compliance, approvals, and platform settings.',
    assignedUsersCount: 2,
    permissions: {
      schoolsApproval: true,
      professionalsVetting: true,
      suppliersApproval: true,
      safeguardingReview: true,
      cmsEditing: true,
      systemConfiguration: true
    }
  },
  {
    roleName: 'Institutional Verification Officer',
    description: 'Inspects and approves school registrations, NTC teacher licenses, and business registrar certificates for suppliers.',
    assignedUsersCount: 4,
    permissions: {
      schoolsApproval: true,
      professionalsVetting: true,
      suppliersApproval: true,
      safeguardingReview: false,
      cmsEditing: false,
      systemConfiguration: false
    }
  },
  {
    roleName: 'Safeguarding & Case Lead',
    description: 'Manages incoming grievances, child safety inquiries, parent disputes, and compliance investigations.',
    assignedUsersCount: 2,
    permissions: {
      schoolsApproval: false,
      professionalsVetting: false,
      suppliersApproval: false,
      safeguardingReview: true,
      cmsEditing: false,
      systemConfiguration: false
    }
  },
  {
    roleName: 'Platform Content Curator',
    description: 'Edits homepage featured schools, educational advice articles, FAQs, and portal announcement banners.',
    assignedUsersCount: 3,
    permissions: {
      schoolsApproval: false,
      professionalsVetting: false,
      suppliersApproval: false,
      safeguardingReview: false,
      cmsEditing: true,
      systemConfiguration: false
    }
  }
];
