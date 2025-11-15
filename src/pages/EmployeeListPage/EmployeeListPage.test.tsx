import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils';
import EmployeeListPage from './EmployeeListPage';

describe('EmployeeListPage', () => {
  it('should render employee list page', () => {
    render(<EmployeeListPage />);
    expect(screen.getByText('Employee List')).toBeInTheDocument();
  });

  it('should display add employee button', () => {
    render(<EmployeeListPage />);
    const addButton = screen.getByText('+ Add Employee');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveAttribute('href', '/wizard?role=admin');
  });
});
