import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { type UserRole, type FormData } from "../../types";
import { useDraftAutoSave } from "../../hooks/useDraftAutoSave";
import Step1 from "./Step1";
import "./WizardPage.css";

function WizardPage() {
  const [searchParams] = useSearchParams();
  const role = (searchParams.get("role") || "admin") as UserRole;

  const [currentStep, setCurrentStep] = useState(role === "admin" ? 1 : 2);
  const [formData, setFormData] = useState<FormData>({
    basicInfo: {},
    details: {},
  });

  // Draft auto-save with 2-second debounce
  const { clearCurrentDraft, loadSavedDraft } = useDraftAutoSave({
    role,
    formData,
    enabled: true,
  });

  // Load saved draft on mount
  useEffect(() => {
    const savedDraft = loadSavedDraft();
    if (savedDraft) {
      setFormData(savedDraft);
    }
  }, []);

  const handleStep1Change = (data: FormData["basicInfo"]) => {
    setFormData((prev) => ({ ...prev, basicInfo: data }));
  };

  const handleStep1Next = () => {
    setCurrentStep(2);
  };

  const handleClearDraft = () => {
    if (
      window.confirm(
        "Are you sure you want to clear the draft? This cannot be undone."
      )
    ) {
      clearCurrentDraft();
      setFormData({ basicInfo: {}, details: {} });
    }
  };

  return (
    <div className="wizard-page">
      <div className="wizard-page__header">
        <h1 className="wizard-page__title">Employee Registration</h1>
        <div className="wizard-page__role-badge">
          Role: <strong>{role.toUpperCase()}</strong>
        </div>
      </div>

      <div className="wizard-page__controls">
        <button
          type="button"
          className="wizard-page__clear-draft"
          onClick={handleClearDraft}
        >
          Clear Draft
        </button>
      </div>

      <div className="wizard-page__steps-indicator">
        {role === "admin" && (
          <>
            <div
              className={`wizard-page__step-dot ${
                currentStep === 1 ? "active" : ""
              } ${currentStep > 1 ? "completed" : ""}`}
            >
              1
            </div>
            <div className="wizard-page__step-line" />
          </>
        )}
        <div
          className={`wizard-page__step-dot ${
            currentStep === 2 ? "active" : ""
          }`}
        >
          2
        </div>
      </div>

      {currentStep === 1 && role === "admin" && (
        <Step1
          formData={formData.basicInfo}
          onChange={handleStep1Change}
          onNext={handleStep1Next}
          role={role}
        />
      )}

      {currentStep === 2 && (
        <div className="wizard-placeholder">
          <p>Step 2 will be implemented in the next phase</p>
          {role === "admin" && (
            <button
              type="button"
              className="wizard-page__back-btn"
              onClick={() => setCurrentStep(1)}
            >
              Back to Step 1
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default WizardPage;
