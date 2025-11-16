import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/utils';
import EmployeeListPage from './EmployeeListPage';
import * as api from '../../utils/api';

// Mock the API utilities
vi.mock('../../utils/api', () => ({
  fetchBasicInfo: vi.fn(),
  fetchAllDetails: vi.fn(),
}));

describe('EmployeeListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render employee list page with title and add button', async () => {
    vi.mocked(api.fetchBasicInfo).mockResolvedValue([
      {
        employeeId: 'ENG-001',
        fullName: 'John Doe',
        email: 'john@example.com',
        department: 'Engineering',
        role: 'Engineer',
      },
    ]);

    vi.mocked(api.fetchAllDetails).mockResolvedValue([
      {
        photo: 'data:image/png;base64,abc',
        employmentType: 'Full-time',
        officeLocation: 'Jakarta',
        notes: 'Test notes',
      },
    ]);

    render(<EmployeeListPage />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Employee List')).toBeInTheDocument();
    });

    const addButton = screen.getByText('+ Add Employee');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveAttribute('href', '/wizard?role=admin');
  });

  it('should show loading state initially', () => {
    vi.mocked(api.fetchBasicInfo).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );
    vi.mocked(api.fetchAllDetails).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<EmployeeListPage />);
    expect(screen.getByText('Loading employees...')).toBeInTheDocument();
  });

  it('should display employee data in table', async () => {
    vi.mocked(api.fetchBasicInfo).mockResolvedValue([
      {
        employeeId: 'ENG-001',
        fullName: 'John Doe',
        email: 'john@example.com',
        department: 'Engineering',
        role: 'Engineer',
      },
    ]);

    // Details must include employeeId or email for merging to work
    vi.mocked(api.fetchAllDetails).mockResolvedValue([
      {
        employeeId: 'ENG-001',
        photo: '',
        employmentType: 'Full-time',
        officeLocation: 'Jakarta',
        notes: '',
      } as any,
    ]);

    render(<EmployeeListPage />);

    await waitFor(() => {
      expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
    });

    expect(screen.getAllByText('john@example.com')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Engineering')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Engineer')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Full-time')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Jakarta')[0]).toBeInTheDocument();
  });

  it('should display placeholder for missing optional fields', async () => {
    vi.mocked(api.fetchBasicInfo).mockResolvedValue([
      {
        employeeId: 'ENG-001',
        fullName: 'John Doe',
        email: 'john@example.com',
        department: 'Engineering',
        role: 'Engineer',
      },
    ]);

    // No details available (Ops user scenario)
    vi.mocked(api.fetchAllDetails).mockResolvedValue([]);

    render(<EmployeeListPage />);

    await waitFor(() => {
      expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
    });

    // Should show placeholders for missing fields
    const placeholders = screen.getAllByText('—');
    expect(placeholders.length).toBeGreaterThan(0);
  });

  it('should merge data by email when available', async () => {
    vi.mocked(api.fetchBasicInfo).mockResolvedValue([
      {
        employeeId: 'ENG-001',
        fullName: 'John Doe',
        email: 'john@example.com',
        department: 'Engineering',
        role: 'Engineer',
      },
    ]);

    vi.mocked(api.fetchAllDetails).mockResolvedValue([
      {
        email: 'john@example.com',
        photo: '',
        employmentType: 'Full-time',
        officeLocation: 'Jakarta',
        notes: '',
      } as any,
    ]);

    render(<EmployeeListPage />);

    await waitFor(() => {
      expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
    });

    expect(screen.getAllByText('Full-time')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Jakarta')[0]).toBeInTheDocument();
  });

  it('should handle error state', async () => {
    vi.mocked(api.fetchBasicInfo).mockRejectedValue(
      new Error('Failed to fetch')
    );
    vi.mocked(api.fetchAllDetails).mockResolvedValue([]);

    render(<EmployeeListPage />);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Failed to fetch/)).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('should display empty state when no employees', async () => {
    vi.mocked(api.fetchBasicInfo).mockResolvedValue([]);
    vi.mocked(api.fetchAllDetails).mockResolvedValue([]);

    render(<EmployeeListPage />);

    await waitFor(() => {
      expect(
        screen.getByText('No employees found. Add your first employee!')
      ).toBeInTheDocument();
    });

    // There are multiple "+ Add Employee" buttons (header and empty state)
    const addButtons = screen.getAllByText('+ Add Employee');
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it('should display pagination when more than 10 employees', async () => {
    const employees = Array.from({ length: 25 }, (_, i) => ({
      employeeId: `ENG-${String(i + 1).padStart(3, '0')}`,
      fullName: `Employee ${i + 1}`,
      email: `employee${i + 1}@example.com`,
      department: 'Engineering',
      role: 'Engineer',
    }));

    vi.mocked(api.fetchBasicInfo).mockResolvedValue(employees);
    vi.mocked(api.fetchAllDetails).mockResolvedValue([]);

    render(<EmployeeListPage />);

    await waitFor(() => {
      expect(screen.getAllByText('Employee 1')[0]).toBeInTheDocument();
    });

    // Should show pagination
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();

    // Should show page numbers
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    // Should show employee count
    expect(screen.getByText(/Showing 1-10 of 25 employees/)).toBeInTheDocument();
  });

  it('should display only 10 employees per page', async () => {
    const employees = Array.from({ length: 15 }, (_, i) => ({
      employeeId: `ENG-${String(i + 1).padStart(3, '0')}`,
      fullName: `Employee ${i + 1}`,
      email: `employee${i + 1}@example.com`,
      department: 'Engineering',
      role: 'Engineer',
    }));

    vi.mocked(api.fetchBasicInfo).mockResolvedValue(employees);
    vi.mocked(api.fetchAllDetails).mockResolvedValue([]);

    render(<EmployeeListPage />);

    await waitFor(() => {
      expect(screen.getAllByText('Employee 1')[0]).toBeInTheDocument();
    });

    // First 10 employees should be visible
    expect(screen.getAllByText('Employee 1')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Employee 10')[0]).toBeInTheDocument();

    // Employee 11 should not be visible on page 1
    expect(screen.queryByText('Employee 11')).not.toBeInTheDocument();
  });

  it('should show photo placeholder when no photo available', async () => {
    vi.mocked(api.fetchBasicInfo).mockResolvedValue([
      {
        employeeId: 'ENG-001',
        fullName: 'John Doe',
        email: 'john@example.com',
        department: 'Engineering',
        role: 'Engineer',
      },
    ]);

    vi.mocked(api.fetchAllDetails).mockResolvedValue([
      {
        employeeId: 'ENG-001',
        photo: '',
        employmentType: 'Full-time',
        officeLocation: 'Jakarta',
        notes: '',
      } as any,
    ]);

    render(<EmployeeListPage />);

    await waitFor(() => {
      expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
    });

    // Should show placeholder with first letter (appears in both table and card view)
    const placeholders = screen.getAllByText('J');
    expect(placeholders.length).toBeGreaterThan(0);
  });
});
