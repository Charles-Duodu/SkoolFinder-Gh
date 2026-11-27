'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  UserRole,
  School,
  Professional,
  Supplier,
  JobVacancy,
  JobApplication,
  RFQTender,
  QuotationBid,
  ParentEnquiry,
  SafeguardingCase,
  VerificationStatus,
  StudentAdmissionApplication,
  ToastNotification,
} from '../types';
import { getInitialEcosystemState, EcosystemState } from '../data/mock/initialState';
import { createClient } from '@/lib/supabase/client';
import { mapParentWorkspace } from '@/lib/supabase/mappers';

interface DemoContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  state: EcosystemState;
  dataSource: 'supabase' | 'demo_seed';
  isBootstrapping: boolean;
  refreshEcosystem: () => Promise<void>;
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;

  // School actions
  addSchool: (school: Omit<School, 'id' | 'verificationStatus' | 'featured'>) => string;
  preloadSchool: (school: Omit<School, 'id' | 'verificationStatus' | 'featured'>) => string;
  claimSchool: (schoolId: string, claimantName: string, claimantEmail: string) => void;
  updateSchoolStatus: (schoolId: string, status: VerificationStatus) => void;
  updateSchool: (school: School) => void;

  // Parent actions
  toggleSaveSchool: (schoolId: string) => void;
  toggleShortlistSchool: (schoolId: string) => void;
  toggleCompareSchool: (schoolId: string) => void;
  submitEnquiry: (enquiry: Omit<ParentEnquiry, 'id' | 'submittedAt' | 'status'>) => void;
  respondToEnquiry: (enquiryId: string, responseNotes: string) => void;
  submitAdmissionApplication: (app: Omit<StudentAdmissionApplication, 'id' | 'submittedAt' | 'status'>) => void;
  updateAdmissionStatus: (
    id: string,
    status: StudentAdmissionApplication['status'],
    notes?: string,
    assessmentDate?: string
  ) => void;

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
  submitSafeguardingReport: (
    report: Omit<SafeguardingCase, 'id' | 'reportedAt' | 'status' | 'notes'> & {
      reporterName?: string;
      reporterContact?: string;
    }
  ) => void;

  // Global actions
  resetDemoData: () => void;
}

const STORAGE_KEY = 'skoolfinder_ghana_demo_state';
const ROLE_KEY = 'skoolfinder_ghana_demo_role';

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('guest');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [state, setState] = useState<EcosystemState>(() => getInitialEcosystemState());
  const [dataSource, setDataSource] = useState<'supabase' | 'demo_seed'>('demo_seed');
  const [isBootstrapping, setIsBootstrapping] = useState<boolean>(true);
  const isHydrated = useRef(false);

  const addToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastNotification = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const syncApi = useCallback(
    (url: string, method: 'POST' | 'PATCH' | 'PUT', payload: unknown) => {
      if (typeof window === 'undefined') return;
      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(async (res) => {
          if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            const msg = errBody?.error || `Sync failed (${res.status})`;
            console.warn(`API sync ${method} ${url}:`, msg);
            if (res.status === 401 || res.status === 403 || res.status >= 500) {
              addToast({
                title: 'Sync Notice',
                message: msg,
                type: 'warning',
              });
            }
          }
        })
        .catch((err) => {
          console.warn(`Background API sync to ${url} failed:`, err);
        });
    },
    [addToast]
  );

  const refreshEcosystem = useCallback(async () => {
    try {
      const res = await fetch('/api/bootstrap', { cache: 'no-store' });
      if (!res.ok) return;
      const payload = await res.json();

      if (payload.configured && payload.source === 'supabase') {
        setDataSource('supabase');
        const pristine = getInitialEcosystemState();

        setState((prev) => {
          const nextParent = payload.user
            ? mapParentWorkspace(payload.user, payload.workspace, prev.parent || pristine.parent)
            : prev.parent;

          return {
            ...prev,
            schools: Array.isArray(payload.schools) && payload.schools.length > 0 ? payload.schools : prev.schools,
            professionals: Array.isArray(payload.professionals) ? payload.professionals : prev.professionals,
            suppliers: Array.isArray(payload.suppliers) ? payload.suppliers : prev.suppliers,
            vacancies: Array.isArray(payload.vacancies) ? payload.vacancies : prev.vacancies,
            rfqs: Array.isArray(payload.rfqs) ? payload.rfqs : prev.rfqs,
            parent: nextParent,
            ...(payload.user
              ? {
                  admissionApplications: Array.isArray(payload.admissionApplications)
                    ? payload.admissionApplications
                    : prev.admissionApplications,
                  enquiries: Array.isArray(payload.enquiries) ? payload.enquiries : prev.enquiries,
                  applications: Array.isArray(payload.applications) ? payload.applications : prev.applications,
                  bids: Array.isArray(payload.bids) ? payload.bids : prev.bids,
                  cases:
                    payload.user.role === 'super_admin' && Array.isArray(payload.cases)
                      ? payload.cases
                      : prev.cases,
                }
              : {}),
          };
        });

        if (payload.user?.role) {
          setRoleState(payload.user.role as UserRole);
        }
      }
    } catch (err) {
      console.warn('Bootstrap from Supabase failed, retaining local state:', err);
    } finally {
      setIsBootstrapping(false);
    }
  }, []);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        const pristine = getInitialEcosystemState();
        setState({
          ...pristine,
          ...parsed,
          admissionApplications: parsed.admissionApplications || pristine.admissionApplications,
        });
      }
    } catch (e) {
      console.warn('Failed to hydrate saved state, using default mock data', e);
    } finally {
      isHydrated.current = true;
    }

    // Determine authentication state: only mark authenticated if Supabase user or explicit active session
    const supabase = createClient();
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          setIsAuthenticated(true);
          const userRole =
            (data.user.app_metadata?.role as UserRole) ||
            (data.user.user_metadata?.requested_role as UserRole) ||
            'parent';
          setRoleState(userRole);
        } else {
          // If no active Supabase user, check if session was explicitly authenticated during this session
          const hasSessionAuth = typeof window !== 'undefined' && sessionStorage.getItem('skoolfinder_session_authenticated') === 'true';
          if (hasSessionAuth) {
            setIsAuthenticated(true);
            const savedRole = localStorage.getItem(ROLE_KEY);
            if (savedRole && savedRole !== 'guest') {
              setRoleState(savedRole as UserRole);
            }
          } else {
            setIsAuthenticated(false);
            setRoleState('guest');
            try {
              localStorage.removeItem('skoolfinder_auth_active');
              localStorage.removeItem(ROLE_KEY);
            } catch {}
          }
        }
      }).catch(() => {
        setIsAuthenticated(false);
        setRoleState('guest');
      });
    } else {
      setIsAuthenticated(false);
      setRoleState('guest');
    }

    refreshEcosystem();

    const subscription = supabase?.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setRoleState('guest');
        try {
          localStorage.removeItem('skoolfinder_auth_active');
        } catch {}
      }
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        refreshEcosystem();
      }
    }).data.subscription;

    return () => {
      subscription?.unsubscribe();
    };
  }, [refreshEcosystem]);

  useEffect(() => {
    if (!isHydrated.current || dataSource === 'supabase') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not persist demo state', e);
    }
  }, [state, dataSource]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole !== 'guest') {
      setIsAuthenticated(true);
      try {
        localStorage.setItem('skoolfinder_auth_active', 'true');
        sessionStorage.setItem('skoolfinder_session_authenticated', 'true');
      } catch (e) {}
    } else {
      setIsAuthenticated(false);
      try {
        localStorage.removeItem('skoolfinder_auth_active');
        sessionStorage.removeItem('skoolfinder_session_authenticated');
      } catch (e) {}
    }
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
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ROLE_KEY);
      localStorage.removeItem('skoolfinder_auth_active');
      sessionStorage.removeItem('skoolfinder_session_authenticated');
    } catch {}
    refreshEcosystem();
  };

  // School actions
  const addSchool = (schoolData: Omit<School, 'id' | 'verificationStatus' | 'featured'>): string => {
    const newId = `sch-${Date.now().toString().slice(-4)}`;
    const newSchool: School = {
      ...schoolData,
      id: newId,
      verificationStatus: 'under_review',
      featured: false,
      isClaimed: true,
      planTier: 'free_launch',
    };
    setState((prev) => ({
      ...prev,
      schools: [newSchool, ...prev.schools],
    }));
    syncApi('/api/schools', 'POST', newSchool);
    return newId;
  };

  const preloadSchool = (schoolData: Omit<School, 'id' | 'verificationStatus' | 'featured'>): string => {
    const newId = `sch-${Date.now().toString().slice(-4)}`;
    const newSchool: School = {
      ...schoolData,
      id: newId,
      verificationStatus: 'approved',
      featured: false,
      isClaimed: false,
      planTier: 'free_launch',
    };
    setState((prev) => ({
      ...prev,
      schools: [newSchool, ...prev.schools],
    }));
    syncApi('/api/schools', 'POST', newSchool);
    addToast({
      title: 'School Pre-Loaded to Directory',
      message: `${schoolData.name} (${schoolData.locality}) is live as an unclaimed verified listing.`,
      type: 'success',
    });
    return newId;
  };

  const claimSchool = (schoolId: string, claimantName: string, claimantEmail: string) => {
    setState((prev) => ({
      ...prev,
      schools: prev.schools.map((s) =>
        s.id === schoolId
          ? {
              ...s,
              isClaimed: true,
              contactPerson: { ...s.contactPerson, name: claimantName, email: claimantEmail },
            }
          : s
      ),
    }));
    syncApi('/api/schools', 'PATCH', { id: schoolId, isClaimed: true, claimantName, claimantEmail });
    addToast({
      title: 'Claim Request Logged',
      message: `Ownership claim submitted for ${claimantName}. Super Admin will link your Supabase account shortly.`,
      type: 'success',
    });
  };

  const updateSchoolStatus = (schoolId: string, status: VerificationStatus) => {
    const target = state.schools.find((s) => s.id === schoolId);
    setState((prev) => ({
      ...prev,
      schools: prev.schools.map((s) => (s.id === schoolId ? { ...s, verificationStatus: status } : s)),
    }));
    syncApi('/api/admin/approvals', 'PATCH', {
      entityType: 'School',
      entityId: schoolId,
      status,
      recipientEmail: target?.email,
      entityName: target?.name,
    });
  };

  const updateSchool = (school: School) => {
    setState((prev) => ({
      ...prev,
      schools: prev.schools.map((s) => (s.id === school.id ? school : s)),
    }));
    syncApi('/api/schools', 'PATCH', school);
  };

  // Parent actions
  const persistWorkspace = (patch: Partial<EcosystemState['parent']>) => {
    syncApi('/api/parent-workspace', 'PUT', patch);
  };

  const toggleSaveSchool = (schoolId: string) => {
    setState((prev) => {
      const exists = prev.parent.savedSchoolIds.includes(schoolId);
      const savedSchoolIds = exists
        ? prev.parent.savedSchoolIds.filter((id) => id !== schoolId)
        : [...prev.parent.savedSchoolIds, schoolId];

      const school = prev.schools.find((s) => s.id === schoolId);
      const name = school ? school.name : 'School';
      addToast({
        title: exists ? 'Removed from Saved' : 'School Saved',
        message: exists ? `${name} removed from your saved list.` : `${name} saved to your parent profile.`,
        type: exists ? 'info' : 'success',
      });
      persistWorkspace({ savedSchoolIds });

      return {
        ...prev,
        parent: { ...prev.parent, savedSchoolIds },
      };
    });
  };

  const toggleShortlistSchool = (schoolId: string) => {
    setState((prev) => {
      const exists = prev.parent.shortlistedSchoolIds.includes(schoolId);
      const shortlistedSchoolIds = exists
        ? prev.parent.shortlistedSchoolIds.filter((id) => id !== schoolId)
        : [...prev.parent.shortlistedSchoolIds, schoolId];

      const school = prev.schools.find((s) => s.id === schoolId);
      const name = school ? school.name : 'School';
      addToast({
        title: exists ? 'Removed from Shortlist' : 'Prioritized in Shortlist',
        message: exists ? `${name} removed from shortlist.` : `${name} marked for priority admission follow-up.`,
        type: exists ? 'info' : 'success',
      });
      persistWorkspace({ shortlistedSchoolIds });

      return {
        ...prev,
        parent: { ...prev.parent, shortlistedSchoolIds },
      };
    });
  };

  const toggleCompareSchool = (schoolId: string) => {
    setState((prev) => {
      const exists = prev.parent.comparisonSchoolIds.includes(schoolId);
      let comparisonSchoolIds = [...prev.parent.comparisonSchoolIds];
      const school = prev.schools.find((s) => s.id === schoolId);
      const name = school ? school.name : 'School';

      if (exists) {
        comparisonSchoolIds = comparisonSchoolIds.filter((id) => id !== schoolId);
        addToast({
          title: 'Removed from Comparison',
          message: `${name} removed from matrix (${comparisonSchoolIds.length}/4).`,
          type: 'info',
        });
      } else {
        if (comparisonSchoolIds.length >= 4) {
          comparisonSchoolIds.shift();
        }
        comparisonSchoolIds.push(schoolId);
        addToast({
          title: 'Added to Comparison',
          message: `${name} added to comparison matrix (${comparisonSchoolIds.length}/4).`,
          type: 'success',
        });
      }
      persistWorkspace({ comparisonSchoolIds });
      return {
        ...prev,
        parent: { ...prev.parent, comparisonSchoolIds },
      };
    });
  };

  const submitEnquiry = (enquiryData: Omit<ParentEnquiry, 'id' | 'submittedAt' | 'status'>) => {
    const newEnquiry: ParentEnquiry = {
      ...enquiryData,
      id: `enq-${Date.now().toString().slice(-4)}`,
      submittedAt: new Date().toISOString(),
      status: 'Pending',
    };
    setState((prev) => ({
      ...prev,
      enquiries: [newEnquiry, ...prev.enquiries],
    }));
    const targetSchool = state.schools.find((s) => s.id === enquiryData.schoolId);
    syncApi('/api/enquiries', 'POST', { ...newEnquiry, schoolEmail: targetSchool?.email });
    addToast({
      title: 'Enquiry Dispatched',
      message: `Your message was delivered to the admissions desk at ${enquiryData.schoolName}.`,
      type: 'success',
    });
  };

  const respondToEnquiry = (enquiryId: string, responseNotes: string) => {
    setState((prev) => ({
      ...prev,
      enquiries: prev.enquiries.map((e) =>
        e.id === enquiryId ? { ...e, status: 'Responded', responseNotes } : e
      ),
    }));
    syncApi('/api/enquiries', 'PATCH', { id: enquiryId, responseNotes });
    addToast({
      title: 'Response Sent',
      message: 'Official response delivered to prospective parent.',
      type: 'success',
    });
  };

  const submitAdmissionApplication = (
    appData: Omit<StudentAdmissionApplication, 'id' | 'submittedAt' | 'status'>
  ) => {
    const newId = `adm-${Date.now().toString().slice(-4)}`;
    const newApp: StudentAdmissionApplication = {
      ...appData,
      id: newId,
      submittedAt: new Date().toISOString(),
      status: 'Submitted',
    };
    setState((prev) => ({
      ...prev,
      admissionApplications: [newApp, ...(prev.admissionApplications || [])],
    }));
    const targetSchool = state.schools.find((s) => s.id === appData.schoolId);
    syncApi('/api/admissions', 'POST', { ...newApp, schoolEmail: targetSchool?.email });
    addToast({
      title: 'Application Lodged Successfully',
      message: `Formal admission application for ${appData.studentName} sent to ${appData.schoolName}. Ref: #${newId.toUpperCase()}`,
      type: 'success',
      duration: 5500,
    });
  };

  const updateAdmissionStatus = (
    id: string,
    status: StudentAdmissionApplication['status'],
    notes?: string,
    assessmentDate?: string
  ) => {
    setState((prev) => ({
      ...prev,
      admissionApplications: (prev.admissionApplications || []).map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              ...(notes !== undefined ? { schoolNotes: notes } : {}),
              ...(assessmentDate !== undefined ? { assessmentDate } : {}),
            }
          : a
      ),
    }));
    syncApi('/api/admissions', 'PATCH', { id, status, schoolNotes: notes, assessmentDate });
    addToast({
      title: 'Admission Stage Updated',
      message: `Application #${id} status changed to "${status}".`,
      type: 'info',
    });
  };

  // Professional actions
  const addProfessional = (proData: Omit<Professional, 'id' | 'verificationStatus'>): string => {
    const newId = `pro-${Date.now().toString().slice(-4)}`;
    const newPro: Professional = {
      ...proData,
      id: newId,
      verificationStatus: 'under_review',
    };
    setState((prev) => ({
      ...prev,
      professionals: [newPro, ...prev.professionals],
    }));
    syncApi('/api/professionals', 'POST', newPro);
    return newId;
  };

  const updateProfessionalStatus = (proId: string, status: VerificationStatus) => {
    const target = state.professionals.find((p) => p.id === proId);
    setState((prev) => ({
      ...prev,
      professionals: prev.professionals.map((p) =>
        p.id === proId ? { ...p, verificationStatus: status } : p
      ),
    }));
    syncApi('/api/admin/approvals', 'PATCH', {
      entityType: 'Professional',
      entityId: proId,
      status,
      recipientEmail: target?.email,
      entityName: target?.fullName,
    });
  };

  const applyForJob = (appData: Omit<JobApplication, 'id' | 'submittedAt' | 'status'>) => {
    const newApp: JobApplication = {
      ...appData,
      id: `app-${Date.now().toString().slice(-4)}`,
      submittedAt: new Date().toISOString(),
      status: 'Submitted',
    };
    setState((prev) => ({
      ...prev,
      applications: [newApp, ...prev.applications],
      vacancies: prev.vacancies.map((v) =>
        v.id === appData.jobId ? { ...v, applicantsCount: v.applicantsCount + 1 } : v
      ),
    }));
    syncApi('/api/job-applications', 'POST', newApp);
    addToast({
      title: 'Application Submitted',
      message: `Your professional profile & NTC verification sent for "${appData.jobTitle}".`,
      type: 'success',
    });
  };

  const updateApplicationStatus = (appId: string, status: JobApplication['status']) => {
    setState((prev) => ({
      ...prev,
      applications: prev.applications.map((a) => (a.id === appId ? { ...a, status } : a)),
    }));
    syncApi('/api/job-applications', 'PATCH', { id: appId, status });
    addToast({
      title: 'Applicant Stage Updated',
      message: `Candidate application moved to "${status}".`,
      type: 'info',
    });
  };

  // Supplier actions
  const addSupplier = (supData: Omit<Supplier, 'id' | 'verificationStatus'>): string => {
    const newId = `sup-${Date.now().toString().slice(-4)}`;
    const newSup: Supplier = {
      ...supData,
      id: newId,
      verificationStatus: 'under_review',
    };
    setState((prev) => ({
      ...prev,
      suppliers: [newSup, ...prev.suppliers],
    }));
    syncApi('/api/suppliers', 'POST', newSup);
    return newId;
  };

  const updateSupplierStatus = (supId: string, status: VerificationStatus) => {
    const target = state.suppliers.find((s) => s.id === supId);
    setState((prev) => ({
      ...prev,
      suppliers: prev.suppliers.map((s) =>
        s.id === supId ? { ...s, verificationStatus: status } : s
      ),
    }));
    syncApi('/api/admin/approvals', 'PATCH', {
      entityType: 'Supplier',
      entityId: supId,
      status,
      recipientEmail: target?.email,
      entityName: target?.businessName,
    });
  };

  const createRFQ = (rfqData: Omit<RFQTender, 'id' | 'createdAt' | 'status' | 'bidsCount'>) => {
    const newRfq: RFQTender = {
      ...rfqData,
      id: `rfq-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      status: 'Open',
      bidsCount: 0,
    };
    setState((prev) => ({
      ...prev,
      rfqs: [newRfq, ...prev.rfqs],
    }));
    syncApi('/api/rfqs', 'POST', newRfq);
    addToast({
      title: 'Tender Published',
      message: `New RFQ "${rfqData.title}" is now open for supplier bids.`,
      type: 'success',
    });
  };

  const submitBid = (bidData: Omit<QuotationBid, 'id' | 'submittedAt' | 'status'>) => {
    const newBid: QuotationBid = {
      ...bidData,
      id: `bid-${Date.now().toString().slice(-4)}`,
      submittedAt: new Date().toISOString(),
      status: 'Pending Review',
    };
    setState((prev) => ({
      ...prev,
      bids: [newBid, ...prev.bids],
      rfqs: prev.rfqs.map((r) => (r.id === bidData.rfqId ? { ...r, bidsCount: r.bidsCount + 1 } : r)),
    }));
    syncApi('/api/bids', 'POST', newBid);
    addToast({
      title: 'Quotation Bid Lodged',
      message: `Your bid of GHS ${bidData.totalAmountGHS.toLocaleString()} was delivered to ${bidData.schoolName}.`,
      type: 'success',
    });
  };

  const updateBidStatus = (bidId: string, status: QuotationBid['status']) => {
    setState((prev) => ({
      ...prev,
      bids: prev.bids.map((b) => (b.id === bidId ? { ...b, status } : b)),
    }));
    syncApi('/api/bids', 'PATCH', { id: bidId, status });
    addToast({
      title: 'Bid Status Updated',
      message: `Quotation bid stage changed to "${status}".`,
      type: 'info',
    });
  };

  // Recruitment actions
  const postVacancy = (jobData: Omit<JobVacancy, 'id' | 'createdAt' | 'status' | 'applicantsCount'>) => {
    const newJob: JobVacancy = {
      ...jobData,
      id: `job-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      status: 'Open',
      applicantsCount: 0,
    };
    setState((prev) => ({
      ...prev,
      vacancies: [newJob, ...prev.vacancies],
    }));
    syncApi('/api/vacancies', 'POST', newJob);
    addToast({
      title: 'Vacancy Published',
      message: `Position for "${jobData.title}" is now live on the Ghanaian educator network.`,
      type: 'success',
    });
  };

  // Governance actions
  const updateCaseStatus = (caseId: string, status: SafeguardingCase['status']) => {
    setState((prev) => ({
      ...prev,
      cases: prev.cases.map((c) => (c.id === caseId ? { ...c, status } : c)),
    }));
    syncApi('/api/safeguarding', 'PATCH', { id: caseId, status });
    addToast({
      title: 'Safeguarding Case Updated',
      message: `Investigation case #${caseId} changed to "${status}".`,
      type: 'info',
    });
  };

  const submitSafeguardingReport = (
    report: Omit<SafeguardingCase, 'id' | 'reportedAt' | 'status' | 'notes'> & {
      reporterName?: string;
      reporterContact?: string;
    }
  ) => {
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
          : 'Report lodged anonymously by community whistleblower.',
      ],
    };
    setState((prev) => ({
      ...prev,
      cases: [newCase, ...prev.cases],
    }));
    syncApi('/api/safeguarding', 'POST', {
      ...report,
      id: newId,
    });
    addToast({
      title: 'Safeguarding Report Lodged',
      message: `Reference #${newId.toUpperCase()} logged for national review. All reports are strictly confidential.`,
      type: 'warning',
      duration: 6000,
    });
  };

  return (
    <DemoContext.Provider
      value={{
        role,
        setRole,
        isAuthenticated,
        setIsAuthenticated,
        state,
        dataSource,
        isBootstrapping,
        refreshEcosystem,
        toasts,
        addToast,
        removeToast,
        addSchool,
        preloadSchool,
        claimSchool,
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
        resetDemoData,
      }}
    >
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
