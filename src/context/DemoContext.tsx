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
  VerificationStatus 
} from '../types';
import { getInitialEcosystemState, EcosystemState } from '../data/mock/initialState';

interface DemoContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  state: EcosystemState;
  
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

  const [state, setState] = useState<EcosystemState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
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
      if (exists) {
        comparisonSchoolIds = comparisonSchoolIds.filter(id => id !== schoolId);
      } else {
        if (comparisonSchoolIds.length >= 4) {
          comparisonSchoolIds.shift(); // keep max 4
        }
        comparisonSchoolIds.push(schoolId);
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
  };

  const respondToEnquiry = (enquiryId: string, responseNotes: string) => {
    setState(prev => ({
      ...prev,
      enquiries: prev.enquiries.map(e => e.id === enquiryId ? { ...e, status: 'Responded', responseNotes } : e)
    }));
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
  };

  const updateApplicationStatus = (appId: string, status: JobApplication['status']) => {
    setState(prev => ({
      ...prev,
      applications: prev.applications.map(a => a.id === appId ? { ...a, status } : a)
    }));
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
  };

  const updateBidStatus = (bidId: string, status: QuotationBid['status']) => {
    setState(prev => ({
      ...prev,
      bids: prev.bids.map(b => b.id === bidId ? { ...b, status } : b)
    }));
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
  };

  // Governance actions
  const updateCaseStatus = (caseId: string, status: SafeguardingCase['status']) => {
    setState(prev => ({
      ...prev,
      cases: prev.cases.map(c => c.id === caseId ? { ...c, status } : c)
    }));
  };

  return (
    <DemoContext.Provider value={{
      role,
      setRole,
      state,
      addSchool,
      updateSchoolStatus,
      updateSchool,
      toggleSaveSchool,
      toggleShortlistSchool,
      toggleCompareSchool,
      submitEnquiry,
      respondToEnquiry,
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
