import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/utils';
import userEvent from '@testing-library/user-event';
import Autocomplete from './Autocomplete';

describe('Autocomplete Component', () => {
  const mockFetchOptions = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with label', () => {
    render(
      <Autocomplete
        label="Department"
        value=""
        onChange={() => {}}
        fetchOptions={mockFetchOptions}
      />
    );

    expect(screen.getByText('Department')).toBeInTheDocument();
  });

  it('should show required indicator when required prop is true', () => {
    render(
      <Autocomplete
        label="Department"
        value=""
        onChange={() => {}}
        fetchOptions={mockFetchOptions}
        required
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should display error message when error prop is provided', () => {
    render(
      <Autocomplete
        label="Department"
        value=""
        onChange={() => {}}
        fetchOptions={mockFetchOptions}
        error="Department is required"
      />
    );

    expect(screen.getByText('Department is required')).toBeInTheDocument();
  });

  it('should call onChange when user types', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Autocomplete
        label="Department"
        value=""
        onChange={handleChange}
        fetchOptions={mockFetchOptions}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'Eng');

    expect(handleChange).toHaveBeenCalled();
  });

  it('should fetch and display options when user types', async () => {
    const mockOptions = [
      { id: 1, name: 'Engineering' },
      { id: 2, name: 'Engineering Support' },
    ];
    mockFetchOptions.mockResolvedValue(mockOptions);

    const user = userEvent.setup({ delay: null });

    render(
      <Autocomplete
        label="Department"
        value=""
        onChange={() => {}}
        fetchOptions={mockFetchOptions}
        debounceMs={0}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'Eng');

    await waitFor(() => {
      expect(mockFetchOptions).toHaveBeenCalledWith('Eng');
    });

    await waitFor(() => {
      expect(screen.getByText('Engineering')).toBeInTheDocument();
      expect(screen.getByText('Engineering Support')).toBeInTheDocument();
    });
  });

  it('should show loading state while fetching', async () => {
    mockFetchOptions.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    const user = userEvent.setup({ delay: null });

    render(
      <Autocomplete
        label="Department"
        value=""
        onChange={() => {}}
        fetchOptions={mockFetchOptions}
        debounceMs={0}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'Eng');

    await waitFor(() => {
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });
  });

  it('should call onChange with selected option when user clicks', async () => {
    const mockOptions = [
      { id: 1, name: 'Engineering' },
      { id: 2, name: 'Operations' },
    ];
    mockFetchOptions.mockResolvedValue(mockOptions);

    const handleChange = vi.fn();
    const user = userEvent.setup({ delay: null });

    render(
      <Autocomplete
        label="Department"
        value=""
        onChange={handleChange}
        fetchOptions={mockFetchOptions}
        debounceMs={0}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'Eng');

    await waitFor(() => {
      expect(screen.getByText('Engineering')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Engineering'));

    expect(handleChange).toHaveBeenCalledWith('Engineering');
  });

  it('should show "No results found" when no options match', async () => {
    mockFetchOptions.mockResolvedValue([]);

    const user = userEvent.setup({ delay: null });

    render(
      <Autocomplete
        label="Department"
        value=""
        onChange={() => {}}
        fetchOptions={mockFetchOptions}
        debounceMs={0}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'XYZ');

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  it('should display fetch error when API call fails', async () => {
    mockFetchOptions.mockRejectedValue(new Error('Network error'));

    const user = userEvent.setup({ delay: null });

    render(
      <Autocomplete
        label="Department"
        value=""
        onChange={() => {}}
        fetchOptions={mockFetchOptions}
        debounceMs={0}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'Eng');

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });
});
