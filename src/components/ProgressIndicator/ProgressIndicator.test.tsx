import { describe, it, expect } from "vitest";
import { render, screen } from "../../test/utils";
import ProgressIndicator, { type ProgressStep } from "./ProgressIndicator";

describe("ProgressIndicator Component", () => {
  const mockSteps: ProgressStep[] = [
    {
      id: "step1",
      label: "Submitting basic info",
      status: "success",
      message: "Basic info saved!",
    },
    {
      id: "step2",
      label: "Submitting details",
      status: "loading",
      message: "Processing...",
    },
    {
      id: "step3",
      label: "Finalizing",
      status: "pending",
    },
  ];

  it("should render all steps", () => {
    render(<ProgressIndicator steps={mockSteps} />);

    expect(screen.getByText("Submitting basic info")).toBeInTheDocument();
    expect(screen.getByText("Submitting details")).toBeInTheDocument();
    expect(screen.getByText("Finalizing")).toBeInTheDocument();
  });

  it("should display step messages when provided", () => {
    render(<ProgressIndicator steps={mockSteps} />);

    expect(screen.getByText("Basic info saved!")).toBeInTheDocument();
    expect(screen.getByText("Processing...")).toBeInTheDocument();
  });

  it("should render correct icons for different statuses", () => {
    render(<ProgressIndicator steps={mockSteps} />);

    // Check for emoji icons
    expect(screen.getByText("✅")).toBeInTheDocument(); // success
    expect(screen.getByText("⏳")).toBeInTheDocument(); // loading
    expect(screen.getByText("⚪")).toBeInTheDocument(); // pending
  });

  it("should show error icon for error status", () => {
    const errorSteps: ProgressStep[] = [
      {
        id: "step1",
        label: "Failed step",
        status: "error",
        message: "An error occurred",
      },
    ];

    render(<ProgressIndicator steps={errorSteps} />);

    expect(screen.getByText("❌")).toBeInTheDocument();
    expect(screen.getByText("An error occurred")).toBeInTheDocument();
  });

  it("should calculate correct progress percentage", () => {
    render(<ProgressIndicator steps={mockSteps} />);

    const progressBar = screen.getByRole("progressbar");
    // 1 out of 3 steps completed = 33.33%
    expect(progressBar).toHaveAttribute("aria-valuenow", "33.33333333333333");
  });

  it("should show 100% progress when all steps are successful", () => {
    const completedSteps: ProgressStep[] = [
      { id: "step1", label: "Step 1", status: "success" },
      { id: "step2", label: "Step 2", status: "success" },
    ];

    render(<ProgressIndicator steps={completedSteps} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "100");
  });

  it("should show 0% progress when no steps are completed", () => {
    const pendingSteps: ProgressStep[] = [
      { id: "step1", label: "Step 1", status: "pending" },
      { id: "step2", label: "Step 2", status: "loading" },
    ];

    render(<ProgressIndicator steps={pendingSteps} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "0");
  });

  it("should handle empty steps array", () => {
    render(<ProgressIndicator steps={[]} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "0");
  });

  it("should highlight current step when currentStep prop is provided", () => {
    const { container } = render(
      <ProgressIndicator steps={mockSteps} currentStep="step2" />
    );

    const activeStep = container.querySelector(
      ".progress-indicator__step--active"
    );
    expect(activeStep).toBeInTheDocument();
    expect(activeStep).toHaveTextContent("Submitting details");
  });
});
