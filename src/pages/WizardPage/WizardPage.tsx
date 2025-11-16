import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { type UserRole, type FormData } from "../../types";
import { useDraftAutoSave } from "../../hooks/useDraftAutoSave";
import { loadDraft } from "../../utils/localStorage";
import Step1 from "./Step1";
import Step2 from "./Step2";
import "./WizardPage.css";

function WizardPage() {
  const [searchParams] = useSearchParams();
  const role = (searchParams.get("role") || "admin") as UserRole;

  const [currentStep, setCurrentStep] = useState(role === "admin" ? 1 : 2);
  const [formData, setFormData] = useState<FormData>(() => {
    const savedDraft = loadDraft(role);
    return savedDraft || { basicInfo: {}, details: {} };
  });

  // Draft auto-save with 2-second debounce
  const { clearCurrentDraft } = useDraftAutoSave({
    role,
    formData,
    enabled: true,
  });

  const handleStep1Change = (data: FormData["basicInfo"]) => {
    setFormData((prev) => ({ ...prev, basicInfo: data }));
  };

  const handleStep1Next = () => {
    setCurrentStep(2);
  };

  const handleStep2Change = (data: FormData["details"]) => {
    setFormData((prev) => ({ ...prev, details: data }));
  };

  const handleStep2Back = () => {
    setCurrentStep(1);
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

      {role === "admin" && (
        <div className="wizard-page__steps-indicator">
          <div
            className={`wizard-page__step-dot ${
              currentStep === 1 ? "active" : ""
            } ${currentStep > 1 ? "completed" : ""}`}
          >
            1
          </div>
          <div className="wizard-page__step-line" />
          <div
            className={`wizard-page__step-dot ${
              currentStep === 2 ? "active" : ""
            }`}
          >
            2
          </div>
        </div>
      )}

      {currentStep === 1 && role === "admin" && (
        <Step1
          formData={formData.basicInfo}
          onChange={handleStep1Change}
          onNext={handleStep1Next}
          role={role}
        />
      )}

      {currentStep === 2 && (
        <Step2
          formData={formData.details}
          basicInfo={formData.basicInfo}
          onChange={handleStep2Change}
          onBack={role === "admin" ? handleStep2Back : undefined}
          role={role}
          onClearDraft={clearCurrentDraft}
        />
      )}
    </div>
  );
}

export default WizardPage;
