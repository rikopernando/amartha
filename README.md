# Employee Registration Wizard - Amartha Frontend Assignment

A modern, role-based employee registration system built with React, TypeScript, and Vite. This application demonstrates advanced frontend concepts including async autocomplete, file upload with Base64 conversion, auto-generated IDs, draft auto-save, and bulk async submissions.

## Live Demo

**Hosted URL:** [https://amartha-virid.vercel.app/](https://amartha-virid.vercel.app/)

## Features

### Core Functionality

- **Role-Based Access Control**: Admin (Step 1 + 2) and Ops (Step 2 only) with toggle UI
- **Two-Step Wizard Form**:
  - Step 1: Basic Info (Full Name, Email, Department, Role, Employee ID)
  - Step 2: Details (Photo Upload, Employment Type, Office Location, Notes)
- **Async Autocomplete**: Department and Location search with debounced API calls
- **Auto-Generated Employee ID**: Format `<3-letter dept>-<3-digit seq>` (e.g., `ENG-003`)
- **File Upload**: Image preview with Base64 conversion
- **Draft Auto-Save**: Debounced localStorage persistence (2 seconds) per role
- **Sequential POST Simulation**: Two async submissions with progress tracking
- **Employee List Page**: Data merging from two APIs with pagination (10 items/page)
- **Responsive Design**: Fully responsive from 360px to 1440px

### Technical Highlights

- **TypeScript**: Full type safety across the application
- **React 19**: Latest React features with hooks
- **Custom CSS**: BEM methodology, no CSS frameworks
- **Comprehensive Testing**: 116+ tests with Vitest and React Testing Library
- **Design System**: CSS variables for colors, spacing, typography
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

## Tech Stack

- **Frontend**: React 19.2, TypeScript 5.9
- **Build Tool**: Vite 7.2
- **Routing**: React Router DOM 7.9
- **Testing**: Vitest 4.0, React Testing Library 16.3
- **Mock API**: json-server 1.0 (2 instances on ports 4001 & 4002)
- **Styling**: Vanilla CSS with CSS Variables (BEM naming convention)
- **Font**: Inter (Google Fonts)

## Project Structure

```
amartha/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Autocomplete/    # Async autocomplete with debounce
│   │   ├── FileUpload/      # Image upload with Base64 conversion
│   │   └── ProgressIndicator/
│   ├── pages/
│   │   ├── WizardPage/      # Multi-step form with role toggle
│   │   │   ├── Step1.tsx    # Basic Info (Admin only)
│   │   │   └── Step2.tsx    # Details (Admin + Ops)
│   │   └── EmployeeListPage/
│   ├── hooks/
│   │   ├── useDraftAutoSave.ts
│   │   └── useEmployeeId.ts
│   ├── utils/
│   │   ├── api.ts           # API utilities
│   │   ├── validation.ts    # Form validation
│   │   ├── localStorage.ts  # Draft persistence
│   │   ├── employeeId.ts    # ID generation logic
│   │   └── debounce.ts      # Debounce utility
│   ├── types/               # TypeScript interfaces
│   ├── test/                # Test utilities
│   └── index.css            # Global styles & design system
├── db-step1.json            # Mock DB for basicInfo & departments
├── db-step2.json            # Mock DB for details & locations
└── package.json
```

## Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd amartha
```

2. Install dependencies:

```bash
npm install
```

### Running the Application

You need to run **3 processes** simultaneously:

#### Terminal 1: Frontend Dev Server

```bash
npm run dev
```

Access the app at: `http://localhost:5173`

#### Terminal 2: Mock API Server 1 (Port 4001)

```bash
npm run api:step1
```

Serves: `/basicInfo`, `/departments`

#### Terminal 3: Mock API Server 2 (Port 4002)

```bash
npm run api:step2
```

Serves: `/details`, `/locations`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests with UI

```bash
npm run test:ui
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Test Coverage

The project includes **116+ tests** covering:

1. **Autocomplete Component** (9 tests)

   - Renders correctly with label and placeholder
   - Fetches and displays options on input
   - Handles option selection
   - Shows loading state during fetch
   - Displays error messages
   - Shows "No results found" message
   - Debounces API calls (300ms default)

2. **FileUpload Component** (9 tests)

   - File selection and preview
   - Base64 conversion
   - File size validation
   - File type validation (image/\* only)
   - Clear functionality

3. **Step1 Form** (14 tests)

   - Form validation (email, required fields)
   - Department autocomplete integration
   - Auto-generated Employee ID
   - Next button enablement
   - Draft auto-save functionality

4. **Step2 Form** (13 tests)

   - Photo upload integration
   - Location autocomplete
   - Sequential POST submission
   - Progress bar states
   - Success/error handling

5. **Employee List Page** (10 tests)

   - Data fetching and merging
   - Pagination (10 items per page)
   - Empty state handling
   - Error state with retry
   - Placeholder display for missing fields
   - Responsive card/table views

6. **Utility Functions** (48 tests)
   - Email validation
   - Employee ID generation
   - Debounce functionality
   - LocalStorage operations
   - Draft management per role

## Usage Guide

### Admin Workflow

1. Click **Admin** toggle button
2. Fill out **Step 1: Basic Info**
   - Enter Full Name
   - Enter Email (with validation)
   - Search Department (autocomplete)
   - Select Role from dropdown
   - Employee ID auto-generates
3. Click **Next** (enabled only when valid)
4. Fill out **Step 2: Details**
   - Upload Photo (optional)
   - Select Employment Type
   - Search Office Location (autocomplete)
   - Add Notes (optional)
5. Click **Submit**
6. Watch progress: `Submitting basicInfo...` → `Submitting details...` → Success!
7. Auto-redirect to Employee List

### Ops Workflow

1. Click **Ops** toggle button
2. Goes directly to **Step 2: Details**
3. Fill out details and submit
4. Note: No Step 1 data, so employee list shows placeholders for missing fields

### Draft Auto-Save

- **Auto-saves every 2 seconds** after you stop typing (debounced)
- **Separate drafts** for Admin (`draft_admin`) and Ops (`draft_ops`)
- **Auto-restores** on page reload
- **Clear Draft** button removes current role's draft only

### Employee List

- Displays all submitted employees
- **Pagination**: 10 employees per page
- **Data Merging**: Combines data from both APIs
- **Placeholders**: Shows "—" for missing fields (Ops users)
- **Add Employee** button returns to wizard
- **Responsive**: Table view on desktop, card view on mobile

## Design System

### Color Palette

- **Primary**: #b63f99 (Purple/Magenta)
- **Primary Hover**: #9d3582
- **Primary Light**: #fce8f7
- **Secondary**: #d35fb8
- **Success**: #27ae60
- **Error**: #e74c3c

### Typography

- **Font Family**: Inter (Google Fonts)
- **Weights**: 400 (Normal), 500 (Medium), 600 (Semi-bold), 700 (Bold)

### Spacing

- Based on `rem` units (0.25rem to 3rem)
- Consistent throughout the application

### Responsive Breakpoints

- **Mobile**: 360px - 480px
- **Tablet**: 481px - 768px
- **Desktop**: 769px - 1440px

## API Endpoints

### Port 4001 (Step 1 Server)

- `GET /departments?name_like={query}` - Search departments
- `GET /basicInfo` - Fetch all basic info
- `POST /basicInfo` - Submit basic info

### Port 4002 (Step 2 Server)

- `GET /locations?name_like={query}` - Search locations
- `GET /details` - Fetch all details
- `POST /details` - Submit details

## Known Limitations & Future Enhancements

### Current Limitations

- Mock APIs reset on server restart
- No authentication/authorization
- No server-side validation
- No edit/delete functionality

### Potential Enhancements

- Add edit employee functionality
- Implement search/filter in employee list
- Add export to CSV/Excel
- Multi-step form progress persistence across sessions
- Real backend integration
- Email notifications on submission

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Performance Optimizations

- **Debounced autocomplete**: Reduces API calls
- **Lazy loading**: Code splitting by route
- **Image optimization**: Base64 for small previews
- **Memoized components**: Prevents unnecessary re-renders
- **CSS variables**: Faster style computation

## Accessibility Features

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Screen reader compatible
- Proper form labels and error messages

## License

This project is part of a technical assignment for Amartha.

## Author

Riko Pernando

## Submission Notes

This project was completed as part of the Amartha Frontend Developer assignment. All requirements have been implemented including:

- ✅ 2-step role-based wizard (Admin & Ops)
- ✅ Async autocomplete with debounce
- ✅ File upload with Base64 conversion
- ✅ Auto-generated Employee ID
- ✅ Draft auto-save (2s debounced)
- ✅ Sequential POST simulation with progress
- ✅ Employee list with pagination
- ✅ Responsive design (360-1440px)
- ✅ Vanilla CSS with BEM methodology
- ✅ Comprehensive testing (116+ tests)
- ✅ TypeScript throughout
- ✅ Clean, modular architecture
