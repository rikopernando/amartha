import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/utils';
import userEvent from '@testing-library/user-event';
import Step2 from './Step2';

// Mock the API utilities
vi.mock('../../utils/api', () => ({
  fetchLocations: vi.fn(async () => [
    { id: 1, name: 'Jakarta' },
    { id: 2, name: 'Depok' },
  ]),
  postBasicInfo: vi.fn(async () => ({ success: true })),
  postDetails: vi.fn(async () => ({ success: true })),
  delay: vi.fn(async () => {}),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Step2 Component', () => {
  const mockOnChange = vi.fn();
  const mockOnBack = vi.fn();
  const mockOnClearDraft = vi.fn();

  const defaultProps = {
    formData: {},
    basicInfo: {
      fullName: 'John Doe',
      email: 'john@example.com',
      department: 'Engineering',
      role: 'Engineer',
      employeeId: 'ENG-001',
    },
    onChange: mockOnChange,
    onBack: mockOnBack,
    role: 'admin' as const,
    onClearDraft: mockOnClearDraft,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Step 2 form', () => {
    render(<Step2 {...defaultProps} />);

    expect(screen.getByText('Step 2: Additional Details')).toBeInTheDocument();
  });

  it('should display all required fields', () => {
    render(<Step2 {...defaultProps} />);

    expect(screen.getByText('Photo')).toBeInTheDocument();
    expect(screen.getByText('Employment Type')).toBeInTheDocument();
    expect(screen.getByText('Office Location')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });

  it('should show Back button for admin role', () => {
    render(<Step2 {...defaultProps} />);

    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('should not show Back button for ops role', () => {
    render(<Step2 {...defaultProps} role="ops" onBack={undefined} />);

    expect(screen.queryByText('Back')).not.toBeInTheDocument();
  });

  it('should call onChange when employment type is selected', async () => {
    const user = userEvent.setup();
    render(<Step2 {...defaultProps} />);

    // Find select by its options
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'Full-time');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should call onChange when notes are typed', async () => {
    const user = userEvent.setup();
    render(<Step2 {...defaultProps} />);

    const textarea = screen.getByPlaceholderText(/additional notes/i);
    await user.type(textarea, 'Test notes');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should disable Submit button when form is invalid', () => {
    render(<Step2 {...defaultProps} />);

    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeDisabled();
  });

  it('should enable Submit button when all required fields are filled', () => {
    const validFormData = {
      employmentType: 'Full-time',
      officeLocation: 'Jakarta',
    };

    render(<Step2 {...defaultProps} formData={validFormData} />);

    const submitButton = screen.getByText('Submit');
    expect(submitButton).not.toBeDisabled();
  });

  it('should call onBack when Back button is clicked', async () => {
    const user = userEvent.setup();
    render(<Step2 {...defaultProps} />);

    const backButton = screen.getByText('Back');
    await user.click(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });

  it('should display employment type options', () => {
    render(<Step2 {...defaultProps} />);

    expect(screen.getByText('Full-time')).toBeInTheDocument();
    expect(screen.getByText('Part-time')).toBeInTheDocument();
    expect(screen.getByText('Contract')).toBeInTheDocument();
    expect(screen.getByText('Intern')).toBeInTheDocument();
  });

  it('should show note about optional notes field', () => {
    render(<Step2 {...defaultProps} />);

    expect(screen.getByText(/optional field - included in draft auto-save/i)).toBeInTheDocument();
  });

  it('should show submission info', () => {
    render(<Step2 {...defaultProps} />);

    expect(screen.getByText(/POST to two separate endpoints/i)).toBeInTheDocument();
  });

  it('should show progress indicator during submission', async () => {
    const user = userEvent.setup();
    const validFormData = {
      employmentType: 'Full-time',
      officeLocation: 'Jakarta',
    };

    render(<Step2 {...defaultProps} formData={validFormData} />);

    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);

    // Should show progress indicator
    await waitFor(() => {
      expect(screen.getByText(/Submitting basicInfo.../i)).toBeInTheDocument();
    });
  });
});
