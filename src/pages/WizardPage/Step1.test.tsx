import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/utils';
import userEvent from '@testing-library/user-event';
import Step1 from './Step1';

// Mock the hooks and utilities
vi.mock('../../hooks/useEmployeeId', () => ({
  useEmployeeId: vi.fn(() => ({
    employeeId: 'ENG-001',
    isLoading: false,
    error: null,
  })),
}));

vi.mock('../../utils/api', () => ({
  fetchDepartments: vi.fn(async () => [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Operations' },
  ]),
}));

describe('Step1 Component', () => {
  const mockOnChange = vi.fn();
  const mockOnNext = vi.fn();

  const defaultProps = {
    formData: {},
    onChange: mockOnChange,
    onNext: mockOnNext,
    role: 'admin' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Step 1 form', () => {
    render(<Step1 {...defaultProps} />);

    expect(screen.getByText('Step 1: Basic Information')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email address')).toBeInTheDocument();
  });

  it('should display all required fields', () => {
    render(<Step1 {...defaultProps} />);

    expect(screen.getByText('Full Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
    expect(screen.getByText('Employee ID')).toBeInTheDocument();
  });

  it('should show required asterisks for all fields', () => {
    render(<Step1 {...defaultProps} />);

    const asterisks = screen.getAllByText('*');
    expect(asterisks.length).toBeGreaterThanOrEqual(5);
  });

  it('should call onChange when user types in full name', async () => {
    const user = userEvent.setup();
    render(<Step1 {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter full name');
    await user.type(input, 'John Doe');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should call onChange when user types in email', async () => {
    const user = userEvent.setup();
    render(<Step1 {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter email address');
    await user.type(input, 'john@example.com');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should not call onNext when form is invalid and Next is clicked', async () => {
    const user = userEvent.setup();
    render(<Step1 {...defaultProps} />);

    const nextButton = screen.getByText('Next');
    await user.click(nextButton);

    // Next should not be called because form is invalid
    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it.skip('should validate email format and show error on blur', async () => {
    const user = userEvent.setup();
    render(<Step1 {...defaultProps} />);

    const emailInput = screen.getByPlaceholderText('Enter email address');

    // Type invalid email
    await user.type(emailInput, 'invalid');

    // Click outside to blur
    await user.click(document.body);

    // Check if error appears
    await waitFor(() => {
      const error = screen.queryByText('Please enter a valid email address');
      expect(error).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('should disable Next button when form is invalid', () => {
    render(<Step1 {...defaultProps} />);

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('should enable Next button when all fields are valid', async () => {
    const validFormData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      department: 'Engineering',
      role: 'Engineer',
      employeeId: 'ENG-001',
    };

    render(<Step1 {...defaultProps} formData={validFormData} />);

    const nextButton = screen.getByText('Next');
    expect(nextButton).not.toBeDisabled();
  });

  it('should call onNext when Next button is clicked with valid data', async () => {
    const user = userEvent.setup();
    const validFormData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      department: 'Engineering',
      role: 'Engineer',
      employeeId: 'ENG-001',
    };

    render(<Step1 {...defaultProps} formData={validFormData} />);

    const nextButton = screen.getByText('Next');
    await user.click(nextButton);

    expect(mockOnNext).toHaveBeenCalled();
  });

  it('should display employee ID as read-only', () => {
    render(<Step1 {...defaultProps} formData={{ employeeId: 'ENG-001' }} />);

    const employeeIdInput = screen.getByDisplayValue('ENG-001');
    expect(employeeIdInput).toHaveAttribute('readonly');
  });

  it('should show role options in select dropdown', () => {
    render(<Step1 {...defaultProps} />);

    expect(screen.getByText('Ops')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('Finance')).toBeInTheDocument();
  });

  it('should display hint about employee ID auto-generation', () => {
    render(<Step1 {...defaultProps} />);

    expect(screen.getByText('Automatically generated based on department')).toBeInTheDocument();
  });

  it('should display info about data not being submitted yet', () => {
    render(<Step1 {...defaultProps} />);

    expect(screen.getByText(/saved locally and submitted in Step 2/i)).toBeInTheDocument();
  });
});
