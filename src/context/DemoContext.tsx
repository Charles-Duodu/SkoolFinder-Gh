import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  School, 
  Professional, 
  Supplier, 
  JobVacancy, 
  JobApplication, 
  RFQTender, 
  QuotationBid, 
  ParentUser, 
  ParentEnquiry, 
  SafeguardingCase, 
  VerificationStatus,
  StudentAdmissionApplication,
  ToastNotification
} from '../types';
import { getInitialEcosystemState, EcosystemState } from '../data/mock/initialState';

interface DemoContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  state: EcosystemState;
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // School actions
  addSchool: (school: Omit<School, 'id' | 'verificationStatus' | 'featured'>) => string;
  updateSchoolStatus: (schoolId: string, status: VerificationStatus) => void;
  updateSchool: (school: School) => void;
  
  // Parent actions
  toggleSaveSchool: (schoolId: string) => void;
  toggleShortlistSchool: (schoolId: string) => void;
  toggleCompareSchool: (schoolId: string) => void;
  submitEnquiry: (enquiry: Omit<ParentEnquiry, 'id' | 'submittedAt' | 'status'>) => void;
  respondToEnquiry: (enquiryId: string, responseNotes: string) => void;
  submitAdmissionApplication: (app: Omit<StudentAdmissionApplication, 'id' | 'submittedAt' | 'status'>) => void;
  updateAdmissionStatus: (id: string, status: StudentAdmissionApplication['status'], notes?: string, assessmentDate?: string) => void;
  
  // Professional actions
  addProfessional: (pro: Omit<Professional, 'id' | 'verificationStatus'>) => string;
  updateProfessionalStatus: (proId: string, status: VerificationStatus) => void;
  applyForJob: (app: Omit<JobApplication, 'id' | 'submittedAt' | 'status'>) => void;
  updateApplicationStatus: (appId: string, status: JobApplication['status']) => void;
  
  // Supplier actions
  addSupplier: (sup: Omit<Supplier, 'id' | 'verificationStatus'>) => string;
  updateSupplierStatus: (supId: string, status: VerificationStatus) => void;
  createRFQ: (rfq: Omit<RFQTender, 'id' | 'createdAt' | 'status' | 'bidsCount'>) => void;
  submitBid: (bid: Omit<QuotationBid, 'id' | 'submittedAt' | 'status'>) => void;
  updateBidStatus: (bidId: string, status: QuotationBid['status']) => void;
  
  // Recruitment actions
  postVacancy: (job: Omit<JobVacancy, 'id' | 'createdAt' | 'status' | 'applicantsCount'>) => void;
  
  // Governance actions
  updateCaseStatus: (caseId: string, status: SafeguardingCase['status']) => void;
  submitSafeguardingReport: (report: Omit<SafeguardingCase, 'id' | 'reportedAt' | 'status' | 'notes'> & { reporterName?: string; reporterContact?: string }) => void;
  
  // Global actions
  resetDemoData: () => void;
}

const STORAGE_KEY = 'skoolfinder_ghana_demo_state';
const ROLE_KEY = 'skoolfinder_ghana_demo_role';

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(ROLE_KEY);
      return (saved as UserRole) || 'guest';
    } catch {
      return 'guest';
    }
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastNotification = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const [state, setState] = useState<EcosystemState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const pristine = getInitialEcosystemState();
        return {
          ...pristine,
          ...parsed,
          admissionApplications: parsed.admissionApplications || pristine.admissionApplications
        };
      }
    } catch (e) {
      console.warn('Failed to parse saved state, using default mock data', e);
    }
    return getInitialEcosystemState();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not persist demo state', e);
    }
  }, [state]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem(ROLE_KEY, newRole);
    } catch (e) {
      console.warn('Could not persist role', e);
    }
  };

  const resetDemoData = () => {
    const pristine = getInitialEcosystemState();
    setState(pristine);
    setRole('guest');
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ROLE_KEY);
    } catch {}
  };

  // School actions
  const addSchool = (schoolData: Omit<School, 'id' | 'verificationStatus' | 'featured'>): string => {
    const newId = `sch-${Date.now().toString().slice(-4)}`;
    const newSchool: School = {
      ...schoolData,
      id: newId,
      verificationStatus: 'under_review',
      featured: false,
    };
    setState(prev => ({
      ...prev,
      schools: [newSchool, ...prev.schools]
    }));
    return newId;
  };

  const updateSchoolStatus = (schoolId: string, status: VerificationStatus) => {
    setState(prev => ({
      ...prev,
      schools: prev.schools.map(s => s.id === schoolId ? { ...s, verificationStatus: status } : s)
    }));
  };

  const updateSchool = (school: School) => {
    setState(prev => ({
      ...prev,
      schools: prev.schools.map(s => s.id === school.id ? school : s)
    }));
  };

  // Parent actions
  const toggleSaveSchool = (schoolId: string) => {
    setState(prev => {
      const exists = prev.parent.savedSchoolIds.includes(schoolId);
      const savedSchoolIds = exists 
        ? prev.parent.savedSchoolIds.filter(id => id !== schoolId)
        : [...prev.parent.savedSchoolIds, schoolId];
      
      const school = prev.schools.find(s => s.id === schoolId);
      const name = school ? school.name : 'School';
      addToast({
        title: exists ? 'Removed from Saved' : 'School Saved',
        message: exists ? `${name} removed from your saved list.` : `${name} saved to your parent profile.`,
        type: exists ? 'info' : 'success'
      });

      return {
        ...prev,
        parent: { ...prev.parent, savedSchoolIds }
      };
    });
  };

  const toggleShortlistSchool = (schoolId: string) => {
    setState(prev => {
      const exists = prev.parent.shortlistedSchoolIds.includes(schoolId);
      const shortlistedSchoolIds = exists 
        ? prev.parent.shortlistedSchoolIds.filter(id => id !== schoolId)
        : [...prev.parent.shortlistedSchoolIds, schoolId];
      
      const school = prev.schools.find(s => s.id === schoolId);
      const name = school ? school.name : 'School';
      addToast({
        title: exists ? 'Removed from Shortlist' : 'Prioritized in Shortlist',
        message: exists ? `${name} removed from shortlist.` : `${name} marked for priority admission follow-up.`,
        type: exists ? 'info' : 'success'
      });

      return {
        ...prev,
        parent: { ...prev.parent, shortlistedSchoolIds }
      };
    });
  };

  const toggleCompareSchool = (schoolId: string) => {
    setState(prev => {
      const exists = prev.parent.comparisonSchoolIds.includes(schoolId);
      let comparisonSchoolIds = [...prev.parent.comparisonSchoolIds];
      const school = prev.schools.find(s => s.id === schoolId);
      const name = school ? school.name : 'School';

      if (exists) {
        comparisonSchoolIds = comparisonSchoolIds.filter(id => id !== schoolId);
        addToast({
          title: 'Removed from Comparison',
          message: `${name} removed from matrix (${comparisonSchoolIds.length}/4).`,
          type: 'info'
        });
      } else {
        if (comparisonSchoolIds.length >= 4) {
          comparisonSchoolIds.shift(); // keep max 4
        }
        comparisonSchoolIds.push(schoolId);
        addToast({
          title: 'Added to Comparison',
          message: `${name} added to comparison matrix (${comparisonSchoolIds.length}/4).`,
          type: 'success'
        });
      }
      return {
        ...prev,
        parent: { ...prev.parent, comparisonSchoolIds }
      };
    });
  };

  const submitEnquiry = (enquiryData: Omit<ParentEnquiry, 'id' | 'submittedAt' | 'status'>) => {
    const newEnquiry: ParentEnquiry = {
      ...enquiryData,
      id: `enq-${Date.now().toString().slice(-4)}`,
      submittedAt: new Date().toISOString(),
      status: 'Pending'
    };
    setState(prev => ({
      ...prev,
      enquiries: [newEnquiry, ...prev.enquiries]
    }));
    addToast({
      title: 'Enquiry Dispatched',
      message: `Your message was delivered to the admissions desk at ${enquiryData.schoolName}.`,
      type: 'success'
    });
  };

  const respondToEnquiry = (enquiryId: string, responseNotes: string) => {
    setState(prev => ({
      ...prev,
      enquiries: prev.enquiries.map(e => e.id === enquiryId ? { ...e, status: 'Responded', responseNotes } : e)
    }));
    addToast({
      title: 'Response Sent',
      message: 'Official response delivered to prospective parent.',
      type: 'success'
    });
  };

  const submitAdmissionApplication = (appData: Omit<StudentAdmissionApplication, 'id' | 'submittedAt' | 'status'>) => {
    const newId = `adm-${Date.now().toString().slice(-4)}`;
    const newApp: StudentAdmissionApplication = {
      ...appData,
      id: newId,
      submittedAt: new Date().toISOString(),
      status: 'Submitted'
    };
    setState(prev => ({
      ...prev,
      admissionApplications: [newApp, ...(prev.admissionApplications || [])]
    }));
    addToast({
      title: 'Application Lodged Successfully',
      message: `Formal admission application for ${appData.studentName} sent to ${appData.schoolName}. Ref: #${newId.toUpperCase()}`,
      type: 'success',
      duration: 5500
    });
  };

  const updateAdmissionStatus = (id: string, status: StudentAdmissionApplication['status'], notes?: string, assessmentDate?: string) => {
    setState(prev => ({
      ...prev,
      admissionApplications: (prev.admissionApplications || []).map(a => 
        a.id === id 
          ? { 
              ...a, 
              status, 
              ...(notes !== undefined ? { schoolNotes: notes } : {}),
              ...(assessmentDate !== undefined ? { assessmentDate } : {})
            } 
          : a
      )
    }));
    addToast({
      title: 'Admission Stage Updated',
      message: `Application #${id} status changed to "${status}".`,
      type: 'info'
    });
  };

  // Professional actions
  const addProfessional = (proData: Omit<Professional, 'id' | 'verificationStatus'>): string => {
    const newId = `pro-${Date.now().toString().slice(-4)}`;
    const newPro: Professional = {
      ...proData,
      id: newId,
      verificationStatus: 'under_review'
    };
    setState(prev => ({
      ...prev,
      professionals: [newPro, ...prev.professionals]
    }));
    return newId;
  };

  const updateProfessionalStatus = (proId: string, status: VerificationStatus) => {
    setState(prev => ({
      ...prev,
      professionals: prev.professionals.map(p => p.id === proId ? { ...p, verificationStatus: status } : p)
    }));
  };

  const applyForJob = (appData: Omit<JobApplication, 'id' | 'submittedAt' | 'status'>) => {
    const newApp: JobApplication = {
      ...appData,
      id: `app-${Date.now().toString().slice(-4)}`,
      submittedAt: new Date().toISOString(),
      status: 'Submitted'
    };
    setState(prev => ({
      ...prev,
      applications: [newApp, ...prev.applications],
      vacancies: prev.vacancies.map(v => v.id === appData.jobId ? { ...v, applicantsCount: v.applicantsCount + 1 } : v)
    }));
    addToast({
      title: 'Application Submitted',
      message: `Your professional profile & NTC verification sent for "${appData.jobTitle}".`,
      type: 'success'
    });
  };

  const updateApplicationStatus = (appId: string, status: JobApplication['status']) => {
    setState(prev => ({
      ...prev,
      applications: prev.applications.map(a => a.id === appId ? { ...a, status } : a)
    }));
    addToast({
      title: 'Applicant Stage Updated',
      message: `Candidate application moved to "${status}".`,
      type: 'info'
    });
  };

  // Supplier actions
  const addSupplier = (supData: Omit<Supplier, 'id' | 'verificationStatus'>): string => {
    const newId = `sup-${Date.now().toString().slice(-4)}`;
    const newSup: Supplier = {
      ...supData,
      id: newId,
      verificationStatus: 'under_review'
    };
    setState(prev => ({
      ...prev,
      suppliers: [newSup, ...prev.suppliers]
    }));
    return newId;
  };

  const updateSupplierStatus = (supId: string, status: VerificationStatus) => {
    setState(prev => ({
      ...prev,
      suppliers: prev.suppliers.map(s => s.id === supId ? { ...s, verificationStatus: status } : s)
    }));
  };

  const createRFQ = (rfqData: Omit<RFQTender, 'id' | 'createdAt' | 'status' | 'bidsCount'>) => {
    const newRfq: RFQTender = {
      ...rfqData,
      id: `rfq-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      status: 'Open',
      bidsCount: 0
    };
    setState(prev => ({
      ...prev,
      rfqs: [newRfq, ...prev.rfqs]
    }));
    addToast({
      title: 'Tender Published',
      message: `New RFQ "${rfqData.title}" is now open for supplier bids.`,
      type: 'success'
    });
  };

  const submitBid = (bidData: Omit<QuotationBid, 'id' | 'submittedAt' | 'status'>) => {
    const newBid: QuotationBid = {
      ...bidData,
      id: `bid-${Date.now().toString().slice(-4)}`,
      submittedAt: new Date().toISOString(),
      status: 'Pending Review'
    };
    setState(prev => ({
      ...prev,
      bids: [newBid, ...prev.bids],
      rfqs: prev.rfqs.map(r => r.id === bidData.rfqId ? { ...r, bidsCount: r.bidsCount + 1 } : r)
    }));
    addToast({
      title: 'Quotation Bid Lodged',
      message: `Your bid of GHS ${bidData.totalAmountGHS.toLocaleString()} was delivered to ${bidData.schoolName}.`,
      type: 'success'
    });
  };

  const updateBidStatus = (bidId: string, status: QuotationBid['status']) => {
    setState(prev => ({
      ...prev,
      bids: prev.bids.map(b => b.id === bidId ? { ...b, status } : b)
    }));
    addToast({
      title: 'Bid Status Updated',
      message: `Quotation bid stage changed to "${status}".`,
      type: 'info'
    });
  };

  // Recruitment actions
  const postVacancy = (jobData: Omit<JobVacancy, 'id' | 'createdAt' | 'status' | 'applicantsCount'>) => {
    const newJob: JobVacancy = {
      ...jobData,
      id: `job-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      status: 'Open',
      applicantsCount: 0
    };
    setState(prev => ({
      ...prev,
      vacancies: [newJob, ...prev.vacancies]
    }));
    addToast({
      title: 'Vacancy Published',
      message: `Position for "${jobData.title}" is now live on the Ghanaian educator network.`,
      type: 'success'
    });
  };

  // Governance actions
  const updateCaseStatus = (caseId: string, status: SafeguardingCase['status']) => {
    setState(prev => ({
      ...prev,
      cases: prev.cases.map(c => c.id === caseId ? { ...c, status } : c)
    }));
    addToast({
      title: 'Safeguarding Case Updated',
      message: `Investigation case #${caseId} changed to "${status}".`,
      type: 'info'
    });
  };

  const submitSafeguardingReport = (report: Omit<SafeguardingCase, 'id' | 'reportedAt' | 'status' | 'notes'> & { reporterName?: string; reporterContact?: string }) => {
    const newId = `case-${Date.now().toString().slice(-4)}`;
    const newCase: SafeguardingCase = {
      id: newId,
      title: report.title,
      category: report.category,
      entityType: report.entityType,
      entityName: report.entityName,
      severity: report.severity,
      status: 'New',
      reportedAt: new Date().toISOString(),
      summary: report.summary,
      notes: [
        'Confidential report lodged via Public Safeguarding Portal.',
        report.reporterName 
          ? `Submitted by: ${report.reporterName} (${report.reporterContact || 'Contact on file'})` 
          : 'Report lodged anonymously by community whistleblower.'
      ]
    };
    setState(prev => ({
      ...prev,
      cases: [newCase, ...prev.cases]
    }));
    addToast({
      title: 'Safeguarding Report Lodged',
      message: `Reference #${newId.toUpperCase()} logged for national review. All reports are strictly confidential.`,
      type: 'warning',
      duration: 6000
    });
  };

  return (
    <DemoContext.Provider value={{
      role,
      setRole,
      state,
      toasts,
      addToast,
      removeToast,
      addSchool,
      updateSchoolStatus,
      updateSchool,
      toggleSaveSchool,
      toggleShortlistSchool,
      toggleCompareSchool,
      submitEnquiry,
      respondToEnquiry,
      submitAdmissionApplication,
      updateAdmissionStatus,
      addProfessional,
      updateProfessionalStatus,
      applyForJob,
      updateApplicationStatus,
      addSupplier,
      updateSupplierStatus,
      createRFQ,
      submitBid,
      updateBidStatus,
      postVacancy,
      updateCaseStatus,
      submitSafeguardingReport,
      resetDemoData
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
