# Step-by-Step Implementation Plan
Sistema de Atendimento para Aproveitamento de Cargas Horárias Complementares

---

## Phase 0 — Project Foundations

### 0.1 Project kickoff & alignment
- [ ] **0.1.1** Review PRD and confirm MVP scope with stakeholders  
  _Ensure no extra features sneak in (dashboard, integrations, etc.)_  
  **Depends on:** none
- [ ] **0.1.2** Define user roles and permissions formally (Aluno, Coordenação)  
  _Create a simple permission matrix for allowed actions_  
  **Depends on:** 0.1.1

---

## Phase 1 — Technical Setup

### 1.1 Repository & tooling
- [ ] **1.1.1** Create monorepo or separate frontend/backend repositories  
  _Decide structure early to avoid refactors_  
  **Depends on:** 0.1.2
- [ ] **1.1.2** Initialize backend project (Node.js + TypeScript)  
  _Include linting, formatting, env config_  
  **Depends on:** 1.1.1
- [ ] **1.1.3** Initialize frontend project (React + TypeScript)  
  _Basic routing and build setup_  
  **Depends on:** 1.1.1

### 1.2 Infrastructure baseline
- [ ] **1.2.1** Set up database (PostgreSQL)  
  _Local development configuration_  
  **Depends on:** 1.1.2
- [ ] **1.2.2** Set up file storage strategy (local filesystem for MVP)  
  _Define upload directory, naming convention_  
  **Depends on:** 1.1.2

---

## Phase 2 — Core Domain Modeling (Backend)

### 2.1 Data models
- [x] **2.1.1** Define User model  
  _Fields: id, name, email, role (Aluno | Coordenação)_  
  **Depends on:** 1.2.1
- [x] **2.1.2** Define Solicitação model  
  _Fields: alunoId, tipoAtividade, título, instituição, datas, cargaHorária, prioridade, status_  
  **Depends on:** 2.1.1
- [x] **2.1.3** Define Certificado model  
  _Fields: solicitaçãoId, filePath, uploadedAt_  
  **Depends on:** 2.1.2
- [x] **2.1.4** Create database migrations for all models  
  _Ensure relationships and constraints_  
  **Depends on:** 2.1.3

---

## Phase 3 — Authentication & Authorization

### 3.1 Authentication
- [x] **3.1.1** Implement basic authentication (login/logout)  
  _No complex SSO; simple credential-based auth_  
  **Depends on:** 2.1.4
- [x] **3.1.2** Implement role-based access control middleware  
  _Restrict endpoints based on user role_  
  **Depends on:** 3.1.1

---

## Phase 4 — Solicitação Submission (Aluno)

### 4.1 Backend APIs
- [x] **4.1.1** Create API endpoint to submit a solicitação  
  _Validate required fields and business rules_  
  **Depends on:** 3.1.2
- [x] **4.1.2** Implement PDF upload handling  
  _Accept only PDF, enforce size limits, store file_  
  **Depends on:** 4.1.1
- [x] **4.1.3** Persist solicitação with status = "Em análise"  
  _Automatically compute priority from autodeclaração_  
  **Depends on:** 4.1.2

### 4.2 Frontend (Aluno)
- [x] **4.2.1** Create "Nova Solicitação" form UI  
  _Match PRD fields exactly_  
  **Depends on:** 3.1.1
- [x] **4.2.2** Implement PDF upload component  
  _Client-side validation for PDF only_  
  **Depends on:** 4.2.1
- [x] **4.2.3** Connect form to backend submission API  
  _Handle success and error states_  
  **Depends on:** 4.1.3

---

## Phase 5 — Solicitação Listing & Status (Aluno)

### 5.1 Backend
- [x] **5.1.1** Create API to list solicitações by aluno  
  _Order by submission date_  
  **Depends on:** 4.1.3
- [x] **5.1.2** Create API to fetch solicitação details  
  _Include status and coordenação response_  
  **Depends on:** 5.1.1
- [x] **5.1.3** Create API to cancel solicitação (if pending)  
  _Prevent cancel after decision_  
  **Depends on:** 5.1.1

### 5.2 Frontend
- [x] **5.2.1** Build list view of solicitações  
  _Show basic status info_  
  **Depends on:** 5.1.1
- [x] **5.2.2** Build solicitação detail page  
  _Show full data, PDF link, response message_  
  **Depends on:** 5.1.2
- [x] **5.2.3** Implement cancel action for pending solicitações  
  _Confirmation dialog_  
  **Depends on:** 5.1.3

---

## Phase 6 — Coordenação Review Flow

### 6.1 Backend
- [x] **6.1.1** Create API to list all solicitações  
  _Include priority indicator, ordered by priority + date_  
  **Depends on:** 3.1.2
- [x] **6.1.2** Create API to approve solicitação  
  _Apply max hours per activity type_  
  **Depends on:** 6.1.1
- [x] **6.1.3** Create API to reject solicitação  
  _Require justification text_  
  **Depends on:** 6.1.1

### 6.2 Frontend (Coordenação)
- [x] **6.2.1** Build coordenação list view  
  _Show: aluno nome, tipo atividade, instituição, prioridade_  
  **Depends on:** 6.1.1
- [x] **6.2.2** Build review screen for solicitação  
  _PDF preview/download + decision controls_  
  **Depends on:** 6.2.1
- [x] **6.2.3** Implement approve/reject actions  
  _Include standard message + manual justification_  
  **Depends on:** 6.1.2, 6.1.3

---

## Phase 7 — Messaging & Status Updates

### 7.1 Backend
- [x] **7.1.1** Persist coordenação response message  
  _Store standard message + custom justification_  
  **Depends on:** 6.1.2, 6.1.3
- [x] **7.1.2** Update solicitação status on decision  
  _Approved or Rejected_  
  **Depends on:** 7.1.1

### 7.2 Frontend
- [x] **7.2.1** Display coordenação message in solicitação detail page  
  _Aluno-only visibility_  
  **Depends on:** 7.1.2

---

## Phase 8 — Validation, Testing & Hardening

### 8.1 Validation
- [x] **8.1.1** Add backend validation for all inputs  
  _Dates, numbers, required fields_  
  **Depends on:** 7.1.2
- [x] **8.1.2** Add frontend form validation and error states  
  **Depends on:** 8.1.1

### 8.2 Testing
- [ ] **8.2.1** Write backend unit tests for core business rules  
  **Depends on:** 8.1.1
- [ ] **8.2.2** Write basic frontend integration tests  
  **Depends on:** 8.1.2

---

## Phase 9 — Deployment & Documentation

### 9.1 Deployment
- [ ] **9.1.1** Configure production environment variables  
  **Depends on:** 8.2.1
- [ ] **9.1.2** Deploy backend service  
  **Depends on:** 9.1.1
- [ ] **9.1.3** Deploy frontend application  
  **Depends on:** 9.1.2

### 9.2 Documentation
- [ ] **9.2.1** Write developer setup documentation  
  **Depends on:** 9.1.3
- [ ] **9.2.2** Write basic user guide (Aluno & Coordenação)  
  **Depends on:** 9.1.3

---

✅ All tasks are connected  
✅ No orphan tasks  
✅ Incremental complexity  
✅ MVP-focused and PRD-aligned
