import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/utils';
import WizardPage from './WizardPage';

// Mock the hooks
vi.mock('../../hooks/useDraftAutoSave', () => ({
  useDraftAutoSave: vi.fn(() => ({
    clearCurrentDraft: vi.fn(),
    loadSavedDraft: vi.fn(() => null),
  })),
}));

vi.mock('../../hooks/useEmployeeId', () => ({
  useEmployeeId: vi.fn(() => ({
    employeeId: 'ENG-001',
    isLoading: false,
    error: null,
  })),
}));

vi.mock('../../utils/api', () => ({
  fetchDepartments: vi.fn(async () => []),
}));

describe('WizardPage', () => {
  it('should render wizard page', () => {
    render(<WizardPage />);
    expect(screen.getByText('Employee Registration')).toBeInTheDocument();
  });

  it('should display admin role badge by default', () => {
    render(<WizardPage />);
    expect(screen.getByText(/role:/i)).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });

  it('should show Clear Draft button', () => {
    render(<WizardPage />);
    expect(screen.getByText('Clear Draft')).toBeInTheDocument();
  });
});
