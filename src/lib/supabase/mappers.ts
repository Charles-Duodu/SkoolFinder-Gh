import type {
  School,
  Professional,
  Supplier,
  JobVacancy,
  JobApplication,
  RFQTender,
  QuotationBid,
  StudentAdmissionApplication,
  ParentEnquiry,
  SafeguardingCase,
  ParentUser,
  GreaterAccraLocality,
  EducationLevel,
  CurriculumType,
  VerificationStatus,
  SupplierCategory,
} from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbRow = Record<string, any>;

const DEFAULT_CREST = '/logo-icon.svg';
const DEFAULT_COVER = '/images/schools/school-east-legon.jpg';
const DEFAULT_AVATAR = '/images/professionals/teacher-kofi.jpg';
const DEFAULT_LOGO = '/images/ecosystem-suppliers.jpg';

export function mapSchoolRow(row: DbRow): School {
  return {
    id: String(row.id),
    name: String(row.name || ''),
    slug: String(row.slug || row.id),
    tagline: String(row.tagline || ''),
    crestUrl: row.crest_url || DEFAULT_CREST,
    coverImageUrl: row.cover_image_url || DEFAULT_COVER,
    galleryImages: Array.isArray(row.gallery_images) && row.gallery_images.length > 0
      ? row.gallery_images
      : [row.cover_image_url || DEFAULT_COVER],
    locality: (row.locality || 'East Legon') as GreaterAccraLocality,
    digitalAddress: String(row.digital_address || ''),
    address: String(row.address || ''),
    phone: String(row.phone || ''),
    email: String(row.email || ''),
    website: row.website || undefined,
    yearEstablished: Number(row.year_established || 2020),
    ownershipType: (row.ownership_type || 'Private') as School['ownershipType'],
    educationLevels: (row.education_levels || []) as EducationLevel[],
    curricula: (row.curricula || []) as CurriculumType[],
    boardingStatus: (row.boarding_status || 'Day Only') as School['boardingStatus'],
    gender: (row.gender || 'Co-educational') as School['gender'],
    facilities: Array.isArray(row.facilities) ? row.facilities : [],
    annualFeeRange: {
      min: Number(row.annual_fee_min || 10000),
      max: Number(row.annual_fee_max || 25000),
      currency: 'GHS',
    },
    studentTeacherRatio: String(row.student_teacher_ratio || '12:1'),
    averageClassSize: Number(row.class_size_avg || 18),
    verificationStatus: (row.verification_status || 'under_review') as VerificationStatus,
    featured: Boolean(row.featured),
    isClaimed: Boolean(row.is_claimed),
    planTier: (row.plan_tier || 'free_launch') as School['planTier'],
    aboutText: String(row.about_text || ''),
    admissionsOverview: String(row.admissions_overview || ''),
    admissionsDeadline: row.admissions_deadline || undefined,
    contactPerson: {
      name: String(row.contact_person_name || 'Admissions Office'),
      role: String(row.contact_person_role || 'Head of Admissions'),
      phone: String(row.contact_person_phone || row.phone || ''),
      email: String(row.email || ''),
    },
  };
}

export function mapProfessionalRow(row: DbRow): Professional {
  const services =
    Array.isArray(row.services_offered) && row.services_offered.length > 0
      ? row.services_offered
      : Array.isArray(row.service_offerings)
      ? row.service_offerings.map((title: string, idx: number) => ({
          id: `srv-${row.id}-${idx}`,
          title,
          description: `${row.title || 'Specialist'} educational support.`,
          category: 'Educational Consulting' as const,
          rateGHS: row.rate_range || 'Negotiable',
          active: true,
        }))
      : [];

  const qualifications =
    Array.isArray(row.qualifications) && row.qualifications.length > 0
      ? row.qualifications
      : row.highest_qualification
      ? [{ degree: String(row.highest_qualification), institution: 'Accredited Institution', year: 2018 }]
      : [];

  return {
    id: String(row.id),
    fullName: String(row.full_name || ''),
    avatarUrl: row.avatar_url || DEFAULT_AVATAR,
    title: String(row.title || ''),
    mode: (row.mode || 'both') as Professional['mode'],
    locality: (row.locality || 'East Legon') as GreaterAccraLocality,
    phone: String(row.phone || ''),
    email: String(row.email || ''),
    verificationStatus: (row.verification_status || 'under_review') as VerificationStatus,
    summary: String(row.bio || ''),
    qualifications,
    ntcLicenseNumber: row.ntc_license_number || undefined,
    yearsOfExperience: Number(row.years_experience || 0),
    subjects: Array.isArray(row.subjects) ? row.subjects : [],
    targetLevels: (row.education_levels || []) as EducationLevel[],
    employmentPreference: (row.availability || 'Full-time') as Professional['employmentPreference'],
    servicesOffered: services,
    cvUrl: row.cv_file_path || undefined,
  };
}

export function mapSupplierRow(row: DbRow): Supplier {
  return {
    id: String(row.id),
    businessName: String(row.business_name || ''),
    registrationNumber: String(row.registration_number || ''),
    category: (row.category || 'Stationery & Books') as SupplierCategory,
    additionalCategories: (row.additional_categories || []) as SupplierCategory[],
    logoUrl: row.logo_url || DEFAULT_LOGO,
    locality: (row.locality || 'Osu') as GreaterAccraLocality,
    address: String(row.address || ''),
    phone: String(row.phone || ''),
    email: String(row.email || ''),
    website: row.website || undefined,
    description: String(row.description || ''),
    verificationStatus: (row.verification_status || 'under_review') as VerificationStatus,
    coverageAreas: Array.isArray(row.service_areas) ? row.service_areas : [],
    products: Array.isArray(row.products) ? row.products : [],
  };
}

export function mapJobVacancyRow(row: DbRow): JobVacancy {
  return {
    id: String(row.id),
    schoolId: String(row.school_id),
    schoolName: String(row.school_name || ''),
    schoolLocality: (row.school_locality || 'East Legon') as GreaterAccraLocality,
    title: String(row.title || ''),
    department: String(row.department || ''),
    educationLevel: (row.education_level || 'Primary') as EducationLevel,
    contractType: (row.employment_type || 'Full-time') as JobVacancy['contractType'],
    salaryRangeGHS: String(row.salary_range_ghs || ''),
    description: String(row.description || ''),
    requirements: Array.isArray(row.requirements) ? row.requirements : [],
    deadline: String(row.deadline || ''),
    createdAt: String(row.created_at || new Date().toISOString()),
    status: (row.status || 'Open') as JobVacancy['status'],
    applicantsCount: Number(row.applicants_count || 0),
  };
}

export function mapJobApplicationRow(row: DbRow): JobApplication {
  return {
    id: String(row.id),
    jobId: String(row.job_id),
    jobTitle: String(row.job_title || ''),
    schoolId: String(row.school_id),
    schoolName: String(row.school_name || ''),
    professionalId: String(row.applicant_id || ''),
    applicantName: String(row.applicant_name || ''),
    applicantEmail: String(row.applicant_email || ''),
    applicantPhone: String(row.applicant_phone || ''),
    qualificationsSummary: String(row.qualifications_summary || 'Registered SkoolFinder Educator'),
    coverNote: String(row.cover_note || ''),
    submittedAt: String(row.submitted_at || new Date().toISOString()),
    status: (row.status || 'Submitted') as JobApplication['status'],
  };
}

export function mapRfqRow(row: DbRow): RFQTender {
  return {
    id: String(row.id),
    schoolId: String(row.school_id),
    schoolName: String(row.school_name || ''),
    schoolLocality: (row.school_locality || 'East Legon') as GreaterAccraLocality,
    title: String(row.title || ''),
    category: (row.category || 'Stationery & Books') as SupplierCategory,
    description: String(row.description || ''),
    items: Array.isArray(row.items) ? row.items : [],
    deadline: String(row.deadline || ''),
    deliveryLocality: String(row.delivery_locality || ''),
    createdAt: String(row.created_at || new Date().toISOString()),
    status: (row.status || 'Open') as RFQTender['status'],
    bidsCount: Number(row.bids_count || 0),
  };
}

export function mapBidRow(row: DbRow): QuotationBid {
  return {
    id: String(row.id),
    rfqId: String(row.rfq_id),
    rfqTitle: String(row.rfq_title || ''),
    schoolId: String(row.school_id),
    schoolName: String(row.school_name || ''),
    supplierId: String(row.supplier_id),
    supplierName: String(row.supplier_name || ''),
    supplierCategory: (row.supplier_category || 'Stationery & Books') as SupplierCategory,
    totalAmountGHS: Number(row.total_amount_ghs || 0),
    deliveryTimelineDays: Number(row.delivery_timeline_days || 14),
    warrantyPeriodMonths: Number(row.warranty_period_months || 6),
    validUntil: String(row.valid_until || ''),
    proposalNotes: String(row.proposal_notes || ''),
    submittedAt: String(row.submitted_at || new Date().toISOString()),
    status: (row.status || 'Pending Review') as QuotationBid['status'],
  };
}

export function mapAdmissionRow(row: DbRow): StudentAdmissionApplication {
  return {
    id: String(row.id),
    schoolId: String(row.school_id),
    schoolName: String(row.school_name || ''),
    schoolLocality: (row.school_locality || 'East Legon') as GreaterAccraLocality,
    parentName: String(row.parent_name || ''),
    parentEmail: String(row.parent_email || ''),
    parentPhone: String(row.parent_phone || ''),
    studentName: String(row.student_name || ''),
    dateOfBirth: String(row.date_of_birth || ''),
    gender: (row.gender || 'Male') as StudentAdmissionApplication['gender'],
    targetLevel: (row.target_level || 'Primary') as EducationLevel,
    targetTerm: (row.target_term || 'Term 1 (September)') as StudentAdmissionApplication['targetTerm'],
    targetYear: Number(row.target_year || 2026),
    digitalAddress: String(row.digital_address || ''),
    previousSchool: row.previous_school || undefined,
    specialNeeds: row.special_needs || undefined,
    documentsAttached: Array.isArray(row.documents_attached) ? row.documents_attached : [],
    submittedAt: String(row.submitted_at || new Date().toISOString()),
    status: (row.status || 'Submitted') as StudentAdmissionApplication['status'],
    assessmentDate: row.assessment_date || undefined,
    schoolNotes: row.school_notes || undefined,
  };
}

export function mapEnquiryRow(row: DbRow): ParentEnquiry {
  return {
    id: String(row.id),
    schoolId: String(row.school_id),
    schoolName: String(row.school_name || ''),
    parentName: String(row.parent_name || ''),
    parentEmail: String(row.parent_email || ''),
    parentPhone: String(row.parent_phone || ''),
    childTargetLevel: (row.child_target_level || 'Primary') as EducationLevel,
    subject: String(row.subject || ''),
    message: String(row.message || ''),
    submittedAt: String(row.submitted_at || new Date().toISOString()),
    status: (row.status || 'Pending') as ParentEnquiry['status'],
    responseNotes: row.response_notes || undefined,
  };
}

export function mapSafeguardingRow(row: DbRow): SafeguardingCase {
  return {
    id: String(row.id),
    title: String(row.title || ''),
    category: (row.category || 'Safety Concern') as SafeguardingCase['category'],
    entityType: (row.entity_type || 'School') as SafeguardingCase['entityType'],
    entityName: String(row.entity_name || ''),
    severity: (row.severity || 'Medium') as SafeguardingCase['severity'],
    status: (row.status || 'New') as SafeguardingCase['status'],
    reportedAt: String(row.reported_at || new Date().toISOString()),
    summary: String(row.summary || ''),
    notes: Array.isArray(row.notes) ? row.notes : [],
  };
}

export function mapParentWorkspace(
  profileRow: DbRow | null,
  workspaceRow: DbRow | null,
  fallbackParent: ParentUser
): ParentUser {
  return {
    id: String(profileRow?.id || fallbackParent.id),
    fullName: String(profileRow?.full_name || fallbackParent.fullName),
    email: String(profileRow?.email || fallbackParent.email),
    phone: String(profileRow?.phone || fallbackParent.phone || ''),
    locality: ((profileRow?.locality as GreaterAccraLocality) || fallbackParent.locality),
    children: Array.isArray(workspaceRow?.children)
      ? workspaceRow.children
      : fallbackParent.children,
    savedSchoolIds: Array.isArray(workspaceRow?.saved_school_ids)
      ? workspaceRow.saved_school_ids
      : fallbackParent.savedSchoolIds,
    shortlistedSchoolIds: Array.isArray(workspaceRow?.shortlisted_school_ids)
      ? workspaceRow.shortlisted_school_ids
      : fallbackParent.shortlistedSchoolIds,
    comparisonSchoolIds: Array.isArray(workspaceRow?.comparison_school_ids)
      ? workspaceRow.comparison_school_ids
      : fallbackParent.comparisonSchoolIds,
    alertPreferences:
      workspaceRow?.alert_preferences && typeof workspaceRow.alert_preferences === 'object'
        ? workspaceRow.alert_preferences
        : fallbackParent.alertPreferences,
  };
}
