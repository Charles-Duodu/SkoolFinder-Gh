# SkoolFinder Ghana: Frontend Architecture & Walkthrough (100% Completion Edition)

## Executive Summary
**SkoolFinder Ghana** is a comprehensive multi-portal education technology SaaS frontend for the Greater Accra Region in Ghana. It connects private schools, parents, licensed teachers, and educational suppliers into a single unified digital ecosystem.

The entire frontend is **100% complete**, strictly frontend-driven with zero backend or external database dependencies, powered by client-side reactive demonstration state and a persistent **Demo Persona Switcher**.

---

## 1. Core Modules & Capabilities

### 1.1 Public Discovery & School Directory
- **Hero Carousel**: 3 rotational floating background slides (`hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg`) with Ken-Burns motion, pause-on-hover, and carousel pill navigation indicators.
- **Glassmorphic Search Bar**: Quick search by Locality/Suburb (East Legon, Cantonments, Airport Residential, Tema, Spintex, Achimota, Dansoman, etc.), Education Level, and Curriculum (GES NaCCA, Cambridge, IB, Montessori).
- **Directory Search (`/schools`)**:
  - 3-Way View Switcher: **Grid View**, **List View**, and **Accra Map View**.
  - Multi-Select Facility Highlights checklist in the sidebar (Science Lab, ICT Suite, Robotics, Pool, Bus Fleet, Sick Bay, etc.).
- **Interactive Greater Accra Locality Map**:
  - Geographical SVG map representation of Greater Accra with coastline (Gulf of Guinea, Accra Harbor, Tema Port) and motorway arteries.
  - Interactive hotspot pins across 14 Greater Accra localities showing school counts.
  - Clicking any pin displays a suburb profile and matching school cards with instant preview.
- **School Profile Detail (`/schools/:slug`)**:
  - Full institutional credentials, facilities, curriculum badges, admissions overview, and photo gallery.
  - Action buttons: "Calculate Fees", "Apply for Admission", "Send Enquiry", "Save School", "Compare", and "Report Safeguarding Concern".
- **Side-by-Side School Comparison (`/compare`)**:
  - Side-by-side matrix comparing up to 4 schools on fees, student-teacher ratio, boarding modes, facilities, and direct fee calculation.

---

### 1.2 Interactive Workflows & Modals
- **Student Admission Application Wizard (`StudentAdmissionModal.tsx`)**:
  - 3-step Ghanaian online admission wizard: Student Details (DOB, Level, Academic Term), Guardian Credentials (Ghana phone, GPS Digital Address), and Document Upload checklist (Birth Cert, Report Card, Ghana Card, Immunisation, Passport Photo).
  - Generates tracking reference ID (`#ADM-XXXXXX`), triggers toast, and immediately updates School and Parent dashboards.
- **Ghanaian School Fee Breakdown & Affordability Calculator (`SchoolFeeCalculatorModal.tsx`)**:
  - Stage-weighted base tuition, meal & lunch catering plans, bus transit zones (Zone A, B, C), STEM levy, uniform package, and sibling discounts.
  - Termly net outlay, full 3-term academic year total, installment schedule, and foreign currency reference (USD $ & GBP £).
- **Community Safeguarding & Incident Desk (`SafeguardingReportModal.tsx`)**:
  - Confidential child welfare and compliance incident reporting form.
  - Anonymous whistleblower toggle or attributed contact details.
  - Immediate dispatch to Super Admin governance queue.
- **Global Toast Notification Feedback System (`ToastContainer.tsx`)**:
  - Responsive floating notification stack providing visual feedback across all user operations (saving schools, submitting enquiries, applications, bids, etc.).

---

### 1.3 Unified Stakeholder Portal Hubs
- **School Owners & Administrators (`/school-owners`)**:
  - Unified hub: Overview & Guide, 8-Step School Registration Wizard, and Institutional Management Dashboard.
  - Review incoming student admission applications, schedule diagnostic assessment dates, and issue provisional admission letters.
  - Post teacher job vacancies and publish RFQ tenders to verified suppliers.
- **Teachers & Educators (`/professionals`)**:
  - Unified hub: Educator Guide, 3-Step NTC Verification Onboarding, and Professional Dashboard.
  - Verified NTC Teacher License badge, curriculum mastery profile, active vacancy listings, and one-click job applications.
- **Suppliers & Educational Vendors (`/suppliers`)**:
  - Unified hub: 14-Category Supply Guide, 3-Step Vendor Onboarding, and Procurement Dashboard.
  - 14 commercial categories (Stationery, Lab Equipment, Uniforms, Sports Kits, Robotics Kits, Catering, etc.).
  - Active RFQ tender discovery and competitive quotation bidding.
- **Parents & Guardians Workspace (`/parents`)**:
  - Child profile management (Nana Yaw & Akosua).
  - Admissions & Entry tracking tab with live status badges (`Submitted`, `Under Review`, `Assessment Scheduled`, `Admitted / Offered`).
  - Saved schools, shortlisted schools, comparison matrix, and inquiry inbox.
- **Super Admin Governance (`/super-admin`)**:
  - Applications approvals center (Schools, Professionals, Suppliers).
  - Multi-portal directory manager.
  - Confidential safeguarding triage desk.
  - RBAC admin roles permissions matrix.

---

## 2. Technology Stack & Verification
- **Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom Ghanaian educational palette (Deep Navy `#102A43`, Warm Gold `#D97706`, Coral Accent `#EA580C`)
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: Reactive React Context (`DemoContext`) with localStorage persistence and instant demo reset
- **Build Status**: 100% clean compilation, 0 TypeScript errors, 2215 modules bundled.
- **GitHub Repository**: `https://github.com/Charles-Duodu/SkoolFinder-Gh.git` (`main` branch)
