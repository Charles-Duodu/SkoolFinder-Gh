export type UserRole = 
  | 'guest' 
  | 'parent' 
  | 'school_owner' 
  | 'professional' 
  | 'supplier' 
  | 'super_admin';

export type VerificationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'corrections_requested' 
  | 'approved' 
  | 'rejected';

export type EducationLevel = 
  | 'Creche & Nursery' 
  | 'Kindergarten' 
  | 'Primary' 
  | 'Junior High School' 
  | 'Senior High School';

export type CurriculumType = 
  | 'GES / NaCCA' 
  | 'Cambridge International' 
  | 'International Baccalaureate (IB)' 
  | 'Montessori' 
  | 'British-Ghanaian Dual';

export type GreaterAccraLocality = 
  | 'East Legon' 
  | 'Cantonments' 
  | 'Airport Residential' 
  | 'Osu' 
  | 'Tema' 
  | 'Spintex' 
  | 'Achimota' 
  | 'Dansoman' 
  | 'Madina' 
  | 'Adenta' 
  | 'Ridge' 
  | 'Labone' 
  | 'Dzorwulu' 
  | 'Legon';

export interface School {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  crestUrl: string;
  coverImageUrl: string;
  galleryImages: string[];
  locality: GreaterAccraLocality;
  digitalAddress: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  yearEstablished: number;
  ownershipType: 'Private' | 'Mission / Faith-Based' | 'International Private';
  educationLevels: EducationLevel[];
  curricula: CurriculumType[];
  boardingStatus: 'Day Only' | 'Boarding Only' | 'Day & Boarding';
  gender: 'Co-educational' | 'Boys Only' | 'Girls Only';
  facilities: string[];
  annualFeeRange: {
    min: number;
    max: number;
    currency: 'GHS';
  };
  studentTeacherRatio: string;
  averageClassSize: number;
  verificationStatus: VerificationStatus;
  featured: boolean;
  isClaimed?: boolean;
  planTier?: 'free_launch' | 'standard' | 'pro' | 'enterprise';
  aboutText: string;
  admissionsOverview: string;
  admissionsDeadline?: string;
  contactPerson: {
    name: string;
    role: string;
    phone: string;
    email: string;
  };
}

export interface ParentUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  locality: GreaterAccraLocality;
  children: {
    name: string;
    currentAge: number;
    targetLevel: EducationLevel;
  }[];
  savedSchoolIds: string[];
  shortlistedSchoolIds: string[];
  comparisonSchoolIds: string[];
  alertPreferences: {
    admissionsDeadlines: boolean;
    feeChanges: boolean;
    newMatchingSchools: boolean;
  };
}

export interface ParentEnquiry {
  id: string;
  schoolId: string;
  schoolName: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childTargetLevel: EducationLevel;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'Pending' | 'Read' | 'Responded';
  responseNotes?: string;
}

export type ProfessionalMode = 'career' | 'services' | 'both';

export interface Professional {
  id: string;
  fullName: string;
  avatarUrl: string;
  title: string;
  mode: ProfessionalMode;
  locality: GreaterAccraLocality;
  phone: string;
  email: string;
  verificationStatus: VerificationStatus;
  summary: string;
  qualifications: {
    degree: string;
    institution: string;
    year: number;
  }[];
  ntcLicenseNumber?: string;
  yearsOfExperience: number;
  subjects: string[];
  targetLevels: EducationLevel[];
  employmentPreference: 'Full-time' | 'Part-time' | 'Contract' | 'Flexible';
  servicesOffered: {
    id: string;
    title: string;
    description: string;
    category: 'STEM Tutoring' | 'Literacy Coaching' | 'Special Needs / SEN' | 'Music & Arts' | 'Educational Consulting';
    rateGHS: string;
    active: boolean;
  }[];
  cvUrl?: string;
}

export type SupplierCategory = 
  | 'Stationery & Books' 
  | 'ICT & Software' 
  | 'School Furniture' 
  | 'School Uniforms' 
  | 'Catering & Food Services' 
  | 'Cleaning & Sanitation' 
  | 'Facility Maintenance' 
  | 'Security Services' 
  | 'Student Transport' 
  | 'Science Lab Equipment' 
  | 'Sports Equipment' 
  | 'Construction & Repairs';

export interface Supplier {
  id: string;
  businessName: string;
  registrationNumber: string;
  category: SupplierCategory;
  additionalCategories: SupplierCategory[];
  logoUrl: string;
  locality: GreaterAccraLocality;
  address: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  verificationStatus: VerificationStatus;
  coverageAreas: string[];
  products: {
    id: string;
    title: string;
    category: SupplierCategory;
    description: string;
    indicativePriceGHS?: number;
    unit?: string;
  }[];
}

export interface JobVacancy {
  id: string;
  schoolId: string;
  schoolName: string;
  schoolLocality: GreaterAccraLocality;
  title: string;
  department: string;
  educationLevel: EducationLevel;
  contractType: 'Full-time' | 'Part-time' | 'Contract';
  salaryRangeGHS: string;
  description: string;
  requirements: string[];
  deadline: string;
  createdAt: string;
  status: 'Open' | 'Interviewing' | 'Closed';
  applicantsCount: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  schoolId: string;
  schoolName: string;
  professionalId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  qualificationsSummary: string;
  coverNote: string;
  submittedAt: string;
  status: 'Submitted' | 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Offered' | 'Declined';
}

export interface RFQTender {
  id: string;
  schoolId: string;
  schoolName: string;
  schoolLocality: GreaterAccraLocality;
  title: string;
  category: SupplierCategory;
  description: string;
  items: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  deadline: string;
  deliveryLocality: string;
  createdAt: string;
  status: 'Open' | 'Under Review' | 'Awarded' | 'Closed';
  bidsCount: number;
}

export interface QuotationBid {
  id: string;
  rfqId: string;
  rfqTitle: string;
  schoolId: string;
  schoolName: string;
  supplierId: string;
  supplierName: string;
  supplierCategory: SupplierCategory;
  totalAmountGHS: number;
  deliveryTimelineDays: number;
  warrantyPeriodMonths: number;
  validUntil: string;
  proposalNotes: string;
  submittedAt: string;
  status: 'Pending Review' | 'Shortlisted' | 'Accepted' | 'Declined';
}

export interface SafeguardingCase {
  id: string;
  title: string;
  category: 'Safety Concern' | 'Disciplinary Escalation' | 'Health & Sanitation' | 'Bullying' | 'Staff Conduct';
  entityType: 'School' | 'Professional' | 'Parent';
  entityName: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'New' | 'Investigating' | 'Action Required' | 'Resolved';
  reportedAt: string;
  summary: string;
  notes: string[];
}

export interface AdminRoleMatrix {
  roleName: string;
  description: string;
  assignedUsersCount: number;
  permissions: {
    schoolsApproval: boolean;
    professionalsVetting: boolean;
    suppliersApproval: boolean;
    safeguardingReview: boolean;
    cmsEditing: boolean;
    systemConfiguration: boolean;
  };
}

export interface StudentAdmissionApplication {
  id: string;
  schoolId: string;
  schoolName: string;
  schoolLocality: GreaterAccraLocality;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  studentName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  targetLevel: EducationLevel;
  targetTerm: 'Term 1 (September)' | 'Term 2 (January)' | 'Term 3 (May)';
  targetYear: number;
  digitalAddress: string;
  previousSchool?: string;
  specialNeeds?: string;
  documentsAttached: string[];
  submittedAt: string;
  status: 'Submitted' | 'Under Review' | 'Assessment Scheduled' | 'Admitted / Offered' | 'Enrolled' | 'Declined';
  assessmentDate?: string;
  schoolNotes?: string;
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}
