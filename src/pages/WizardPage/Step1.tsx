import { useState, useEffect } from "react";
import { type UserRole, type BasicInfo } from "../../types";
import { validateStep1 } from "../../utils/validation";
import { fetchDepartments } from "../../utils/api";
import { useEmployeeId } from "../../hooks/useEmployeeId";
import Autocomplete from "../../components/Autocomplete/Autocomplete";
import "./Step1.css";

interface Step1Props {
  formData: Partial<BasicInfo>;
  onChange: (data: Partial<BasicInfo>) => void;
  onNext: () => void;
  role: UserRole;
}

const ROLE_OPTIONS = [
  { value: "Ops", label: "Ops" },
  { value: "Admin", label: "Admin" },
  { value: "Engineer", label: "Engineer" },
  { value: "Finance", label: "Finance" },
];

function Step1({ formData, onChange, onNext, role }: Step1Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Auto-generate Employee ID based on department
  const { employeeId: generatedId, isLoading: isGeneratingId } = useEmployeeId(
    formData?.department
  );

  // Update employee ID when it's generated
  useEffect(() => {
    if (generatedId && generatedId !== formData.employeeId) {
      onChange({ ...formData, employeeId: generatedId });
    }
  }, [generatedId]);

  const handleFieldChange = (field: keyof BasicInfo, value: string) => {
    const updatedData = { ...formData, [field]: value };
    onChange(updatedData);

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleBlur = (field: keyof BasicInfo) => {
    setTouched({ ...touched, [field]: true });
    validateForm();
  };

  const validateForm = () => {
    const validation = validateStep1({
      fullName: formData.fullName,
      email: formData.email,
      department: formData.department,
      role: formData.role,
      employeeId: formData.employeeId,
    });

    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleNext = () => {
    // Mark all fields as touched
    setTouched({
      fullName: true,
      email: true,
      department: true,
      role: true,
      employeeId: true,
    });

    // Validate
    if (validateForm()) {
      onNext();
    }
  };

  const isNextEnabled = () => {
    return validateStep1({
      fullName: formData.fullName,
      email: formData.email,
      department: formData.department,
      role: formData.role,
      employeeId: formData.employeeId,
    }).isValid;
  };

  return (
    <div className="step1">
      <div className="step1__header">
        <h2 className="step1__title">Step 1: Basic Information</h2>
        <p className="step1__subtitle">
          Please provide the employee's basic information
        </p>
      </div>

      <div className="step1__form">
        {/* Full Name */}
        <div className="step1__field">
          <label className="step1__label">
            Full Name
            <span className="step1__required">*</span>
          </label>
          <input
            type="text"
            className={`step1__input ${
              touched.fullName && errors.fullName ? "step1__input--error" : ""
            }`}
            value={formData.fullName || ""}
            onChange={(e) => handleFieldChange("fullName", e.target.value)}
            onBlur={() => handleBlur("fullName")}
            placeholder="Enter full name"
          />
          {touched.fullName && errors.fullName && (
            <div className="step1__error">{errors.fullName}</div>
          )}
        </div>

        {/* Email */}
        <div className="step1__field">
          <label className="step1__label">
            Email
            <span className="step1__required">*</span>
          </label>
          <input
            type="email"
            className={`step1__input ${
              touched.email && errors.email ? "step1__input--error" : ""
            }`}
            value={formData.email || ""}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="Enter email address"
          />
          {touched.email && errors.email && (
            <div className="step1__error">{errors.email}</div>
          )}
        </div>

        {/* Department - Autocomplete */}
        <Autocomplete
          label="Department"
          value={formData.department || ""}
          onChange={(value) => handleFieldChange("department", value)}
          fetchOptions={fetchDepartments}
          placeholder="Search department..."
          required
          error={touched.department ? errors.department : undefined}
        />

        {/* Role - Select */}
        <div className="step1__field">
          <label className="step1__label">
            Role
            <span className="step1__required">*</span>
          </label>
          <select
            className={`step1__select ${
              touched.role && errors.role ? "step1__select--error" : ""
            }`}
            value={formData.role || ""}
            onChange={(e) => handleFieldChange("role", e.target.value)}
            onBlur={() => handleBlur("role")}
          >
            <option value="">Select role</option>
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {touched.role && errors.role && (
            <div className="step1__error">{errors.role}</div>
          )}
        </div>

        {/* Employee ID - Auto-generated, read-only */}
        <div className="step1__field">
          <label className="step1__label">
            Employee ID
            <span className="step1__required">*</span>
          </label>
          <div className="step1__employee-id-wrapper">
            <input
              type="text"
              className="step1__input step1__input--readonly"
              value={formData.employeeId || ""}
              readOnly
              placeholder={
                isGeneratingId ? "Generating..." : "Select department first"
              }
            />
            {isGeneratingId && (
              <div className="step1__generating-badge">Generating...</div>
            )}
          </div>
          <div className="step1__hint">
            Automatically generated based on department
          </div>
          {touched.employeeId && errors.employeeId && (
            <div className="step1__error">{errors.employeeId}</div>
          )}
        </div>
      </div>

      <div className="step1__actions">
        <button
          type="button"
          className="step1__next-btn"
          onClick={handleNext}
          disabled={!isNextEnabled()}
        >
          Next
        </button>
      </div>

      <div className="step1__info">
        <p className="step1__info-text">
          <strong>Note:</strong> This data will be saved locally and submitted
          in Step 2.
        </p>
      </div>
    </div>
  );
}

export default Step1;
