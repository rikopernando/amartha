import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { type Employee, type BasicInfo, type Details } from "../../types";
import { fetchBasicInfo, fetchAllDetails } from "../../utils/api";
import "./EmployeeListPage.css";

const itemsPerPage = 10;
function EmployeeListPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch from both endpoints
      const [basicInfoList, detailsList]: [BasicInfo[], Details[]] =
        await Promise.all([fetchBasicInfo(), fetchAllDetails()]);

      // Merge data by email or employeeId
      const merged = basicInfoList.map((basic) => {
        const detail = detailsList.find(
          (d: Details & { email?: string }) => d.email === basic.email
        );

        return {
          employeeId: basic.employeeId,
          fullName: basic.fullName,
          email: basic.email,
          department: basic.department,
          role: basic.role,
          officeLocation: detail?.officeLocation,
          employmentType: detail?.employmentType,
          photo: detail?.photo,
          notes: detail?.notes,
        } as Employee;
      });

      setEmployees(merged);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load employees");
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = employees.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPlaceholder = (value: string | undefined) => {
    return value || "—";
  };

  if (isLoading) {
    return (
      <div className="employee-list-page">
        <div className="employee-list-loading">Loading employees...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-list-page">
        <div className="employee-list-error">
          <p>Error: {error}</p>
          <button onClick={loadEmployees} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-list-page">
      <div className="employee-list-header">
        <h1 className="employee-list-title">Employee List</h1>
        <Link to="/wizard" className="btn-add-employee">
          + Add Employee
        </Link>
      </div>

      {employees.length === 0 ? (
        <div className="employee-list-empty">
          <p>No employees found. Add your first employee!</p>
          <Link to="/wizard" className="btn-add-first">
            + Add Employee
          </Link>
        </div>
      ) : (
        <>
          <div className="employee-list-info">
            Showing {startIndex + 1}-{Math.min(endIndex, employees.length)} of{" "}
            {employees.length} employees
          </div>

          {/* Desktop Table View */}
          <div className="employee-list-table-wrapper">
            <table className="employee-list-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Employment</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees?.map((employee) => (
                  <tr key={employee.employeeId}>
                    <td>
                      {employee.photo ? (
                        <img
                          src={employee.photo}
                          alt={employee.fullName}
                          className="employee-photo"
                        />
                      ) : (
                        <div className="employee-photo-placeholder">
                          {employee.fullName
                            ? employee.fullName?.charAt(0)?.toUpperCase()
                            : "A"}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="employee-name">
                        {employee.fullName ?? "-"}
                      </div>
                      <div className="employee-email">
                        {employee.email ?? "-"}
                      </div>
                    </td>
                    <td>{employee.department ?? "-"}</td>
                    <td>{employee.role ?? "-"}</td>
                    <td>{getPlaceholder(employee.officeLocation)}</td>
                    <td>{getPlaceholder(employee.employmentType)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="employee-list-cards">
            {currentEmployees.map((employee) => (
              <div key={employee.employeeId} className="employee-card">
                <div className="employee-card-header">
                  {employee.photo ? (
                    <img
                      src={employee.photo}
                      alt={employee.fullName}
                      className="employee-card-photo"
                    />
                  ) : (
                    <div className="employee-card-photo-placeholder">
                      {employee.fullName
                        ? employee.fullName?.charAt(0)?.toUpperCase()
                        : "A"}
                    </div>
                  )}
                  <div className="employee-card-info">
                    <div className="employee-card-name">
                      {employee.fullName ?? "-"}
                    </div>
                    <div className="employee-card-email">
                      {employee.email ?? "-"}
                    </div>
                  </div>
                </div>
                <div className="employee-card-details">
                  <div className="employee-card-row">
                    <span className="label">Department:</span>
                    <span className="value">{employee.department ?? "-"}</span>
                  </div>
                  <div className="employee-card-row">
                    <span className="label">Role:</span>
                    <span className="value">{employee.role ?? "-"}</span>
                  </div>
                  <div className="employee-card-row">
                    <span className="label">Location:</span>
                    <span className="value">
                      {getPlaceholder(employee.officeLocation)}
                    </span>
                  </div>
                  <div className="employee-card-row">
                    <span className="label">Employment:</span>
                    <span className="value">
                      {getPlaceholder(employee.employmentType)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="employee-list-pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`pagination-number ${
                        page === currentPage ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EmployeeListPage;
