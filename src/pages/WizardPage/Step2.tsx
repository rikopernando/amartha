import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type UserRole, type BasicInfo, type Details } from '../../types';
import { validateStep2 } from '../../utils/validation';
import { fetchLocations, postBasicInfo, postDetails, delay } from '../../utils/api';
import FileUpload from '../../components/FileUpload/FileUpload';
import Autocomplete from '../../components/Autocomplete/Autocomplete';
import ProgressIndicator, { type ProgressStep } from '../../components/ProgressIndicator/ProgressIndicator';
import './Step2.css';

interface Step2Props {
  formData: Partial<Details>;
  basicInfo: Partial<BasicInfo>;
  onChange: (data: Partial<Details>) => void;
  onBack?: () => void;
  role: UserRole;
  onClearDraft: () => void;
}

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Intern', label: 'Intern' },
];

function Step2({ formData, basicInfo, onChange, onBack, role, onClearDraft }: Step2Props) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([]);

  const handleFieldChange = (field: keyof Details, value: string) => {
    const updatedData = { ...formData, [field]: value };
    onChange(updatedData);

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleBlur = (field: keyof Details) => {
    setTouched({ ...touched, [field]: true });
    validateForm();
  };

  const validateForm = () => {
    const validation = validateStep2({
      employmentType: formData.employmentType,
      officeLocation: formData.officeLocation,
    });

    setErrors(validation.errors);
    return validation.isValid;
  };

  const isSubmitEnabled = () => {
    return validateStep2({
      employmentType: formData.employmentType,
      officeLocation: formData.officeLocation,
    }).isValid;
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    setTouched({
      employmentType: true,
      officeLocation: true,
    });

    // Validate
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Initialize progress steps
    const steps: ProgressStep[] = [
      { id: 'step1', label: 'Submitting basicInfo...', status: 'pending' },
      { id: 'step2', label: 'Submitting details...', status: 'pending' },
      { id: 'step3', label: 'All data processed successfully!', status: 'pending' },
    ];
    setProgressSteps(steps);

    try {
      // Step 1: Submit basicInfo
      setProgressSteps((prev) =>
        prev.map((s) => (s.id === 'step1' ? { ...s, status: 'loading' } : s))
      );

      await delay(3000); // Simulate async delay
      await postBasicInfo(basicInfo);

      setProgressSteps((prev) =>
        prev.map((s) =>
          s.id === 'step1'
            ? { ...s, status: 'success', message: 'basicInfo saved!' }
            : s
        )
      );

      // Step 2: Submit details
      setProgressSteps((prev) =>
        prev.map((s) => (s.id === 'step2' ? { ...s, status: 'loading' } : s))
      );

      await delay(3000); // Simulate async delay
      await postDetails({ ...formData, email: basicInfo.email });

      setProgressSteps((prev) =>
        prev.map((s) =>
          s.id === 'step2'
            ? { ...s, status: 'success', message: 'details saved!' }
            : s
        )
      );

      // Step 3: Complete
      setProgressSteps((prev) =>
        prev.map((s) => (s.id === 'step3' ? { ...s, status: 'success' } : s))
      );

      // Clear draft after successful submission
      onClearDraft();

      // Redirect to employee list after a short delay
      setTimeout(() => {
        navigate('/employees');
      }, 1500);
    } catch (error) {
      // Handle error
      setProgressSteps((prev) =>
        prev.map((s) =>
          s.status === 'loading'
            ? {
                ...s,
                status: 'error',
                message: error instanceof Error ? error.message : 'Submission failed',
              }
            : s
        )
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="step2">
      <div className="step2__header">
        <h2 className="step2__title">
          {role === 'admin' ? 'Step 2: Additional Details' : 'Employee Details'}
        </h2>
        <p className="step2__subtitle">
          {role === 'admin'
            ? 'Complete the employee information'
            : 'Please provide the employee details'}
        </p>
      </div>

      {!isSubmitting ? (
        <div className="step2__form">
          {/* Photo Upload */}
          <FileUpload
            label="Photo"
            value={formData.photo || ''}
            onChange={(base64) => handleFieldChange('photo', base64)}
          />

          {/* Employment Type */}
          <div className="step2__field">
            <label className="step2__label">
              Employment Type
              <span className="step2__required">*</span>
            </label>
            <select
              className={`step2__select ${
                touched.employmentType && errors.employmentType ? 'step2__select--error' : ''
              }`}
              value={formData.employmentType || ''}
              onChange={(e) => handleFieldChange('employmentType', e.target.value)}
              onBlur={() => handleBlur('employmentType')}
            >
              <option value="">Select employment type</option>
              {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {touched.employmentType && errors.employmentType && (
              <div className="step2__error">{errors.employmentType}</div>
            )}
          </div>

          {/* Office Location - Autocomplete */}
          <Autocomplete
            label="Office Location"
            value={formData.officeLocation || ''}
            onChange={(value) => handleFieldChange('officeLocation', value)}
            fetchOptions={fetchLocations}
            placeholder="Search location..."
            required
            error={touched.officeLocation ? errors.officeLocation : undefined}
          />

          {/* Notes */}
          <div className="step2__field">
            <label className="step2__label">Notes</label>
            <textarea
              className="step2__textarea"
              value={formData.notes || ''}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              placeholder="Additional notes (optional)"
              rows={4}
            />
            <div className="step2__hint">Optional field - included in draft auto-save</div>
          </div>

          <div className="step2__actions">
            {onBack && (
              <button type="button" className="step2__back-btn" onClick={onBack}>
                Back
              </button>
            )}
            <button
              type="button"
              className="step2__submit-btn"
              onClick={handleSubmit}
              disabled={!isSubmitEnabled()}
            >
              Submit
            </button>
          </div>

          <div className="step2__info">
            <p className="step2__info-text">
              <strong>Note:</strong> Submission will POST to two separate endpoints with ~3s delay
              each.
            </p>
          </div>
        </div>
      ) : (
        <div className="step2__progress">
          <ProgressIndicator
            steps={progressSteps}
            currentStep={
              progressSteps.find((s) => s.status === 'loading')?.id ||
              progressSteps[progressSteps.length - 1].id
            }
          />
        </div>
      )}
    </div>
  );
}

export default Step2;
