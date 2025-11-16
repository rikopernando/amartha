import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/utils';
import userEvent from '@testing-library/user-event';
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
  fetchLocations: vi.fn(async () => []),
}));

describe('WizardPage', () => {
  it('should render wizard page', () => {
    render(<WizardPage />);
    expect(screen.getByText('Employee Registration')).toBeInTheDocument();
  });

  it('should display role toggle buttons', () => {
    const { container } = render(<WizardPage />);
    const roleToggle = container.querySelector('.wizard-page__role-toggle');
    expect(roleToggle).toBeInTheDocument();
    expect(roleToggle).toHaveTextContent('Admin');
    expect(roleToggle).toHaveTextContent('Ops');
  });

  it('should show Clear Draft button', () => {
    render(<WizardPage />);
    expect(screen.getByText('Clear Draft')).toBeInTheDocument();
  });

  it('should start with Admin role active by default', () => {
    const { container } = render(<WizardPage />);
    const roleToggle = container.querySelector('.wizard-page__role-toggle');
    const adminBtn = roleToggle?.querySelector('.wizard-page__role-btn.active');
    expect(adminBtn).toHaveTextContent('Admin');
  });

  it('should toggle to Ops role when Ops button clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<WizardPage />);

    // Find the role toggle container and get the Ops button from it
    const roleToggle = container.querySelector('.wizard-page__role-toggle');
    const opsBtn = Array.from(roleToggle?.querySelectorAll('button') || []).find(
      btn => btn.textContent === 'Ops'
    );

    if (opsBtn) {
      await user.click(opsBtn as HTMLElement);
      expect(opsBtn).toHaveClass('active');
    }
  });
});
