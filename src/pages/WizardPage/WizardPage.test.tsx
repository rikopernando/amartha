import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils';
import WizardPage from './WizardPage';

describe('WizardPage', () => {
  it('should render wizard page', () => {
    render(<WizardPage />);
    expect(screen.getByText('Employee Wizard')).toBeInTheDocument();
  });

  it('should display admin role information by default', () => {
    render(<WizardPage />);
    expect(screen.getByText(/current role:/i)).toBeInTheDocument();
    expect(screen.getByText('Admin has access to Step 1 + Step 2')).toBeInTheDocument();
  });
});
