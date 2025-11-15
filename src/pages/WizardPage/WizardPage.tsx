import { useSearchParams } from 'react-router-dom';

type UserRole = 'admin' | 'ops';

function WizardPage() {
  const [searchParams] = useSearchParams();
  const role = (searchParams.get('role') || 'admin') as UserRole;

  return (
    <div className="wizard-page">
      <h1>Employee Wizard</h1>
      <p>Current Role: <strong>{role}</strong></p>

      {role === 'admin' && (
        <div className="wizard-info">
          <p>Admin has access to Step 1 + Step 2</p>
        </div>
      )}

      {role === 'ops' && (
        <div className="wizard-info">
          <p>Ops has access to Step 2 only</p>
        </div>
      )}

      {/* Steps will be implemented in later tasks */}
      <div className="wizard-placeholder">
        <p>Wizard form steps will be implemented here</p>
      </div>
    </div>
  );
}

export default WizardPage;
