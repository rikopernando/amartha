import './ProgressIndicator.css';

export type ProgressStep = {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  message?: string;
};

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep?: string;
}

function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  const getStepIcon = (status: ProgressStep['status']) => {
    switch (status) {
      case 'loading':
        return '⏳';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'pending':
      default:
        return '⚪';
    }
  };

  const getStepClass = (step: ProgressStep) => {
    const baseClass = 'progress-indicator__step';
    const statusClass = `${baseClass}--${step.status}`;
    const activeClass = step.id === currentStep ? `${baseClass}--active` : '';
    return `${baseClass} ${statusClass} ${activeClass}`.trim();
  };

  // Calculate overall progress percentage
  const totalSteps = steps.length;
  const completedSteps = steps.filter((s) => s.status === 'success').length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="progress-indicator">
      <div className="progress-indicator__bar-container">
        <div
          className="progress-indicator__bar-fill"
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="progress-indicator__steps">
        {steps.map((step) => (
          <div key={step.id} className={getStepClass(step)}>
            <div className="progress-indicator__step-icon" aria-label={`Step status: ${step.status}`}>
              {getStepIcon(step.status)}
            </div>
            <div className="progress-indicator__step-content">
              <div className="progress-indicator__step-label">{step.label}</div>
              {step.message && (
                <div className="progress-indicator__step-message">{step.message}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgressIndicator;
