import { Link } from 'react-router-dom';

function EmployeeListPage() {
  return (
    <div className="employee-list-page">
      <h1>Employee List</h1>

      <div className="employee-list-actions">
        <Link to="/wizard?role=admin" className="btn-add-employee">
          + Add Employee
        </Link>
      </div>

      {/* Employee list will be implemented in later tasks */}
      <div className="employee-list-placeholder">
        <p>Employee list table will be implemented here</p>
      </div>
    </div>
  );
}

export default EmployeeListPage;
