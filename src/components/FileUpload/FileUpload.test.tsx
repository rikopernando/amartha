import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../test/utils';
import userEvent from '@testing-library/user-event';
import FileUpload from './FileUpload';

describe('FileUpload Component', () => {
  it('should render with label', () => {
    render(<FileUpload label="Photo" value="" onChange={() => {}} />);

    expect(screen.getByText('Photo')).toBeInTheDocument();
  });

  it('should show dropzone when no file is selected', () => {
    render(<FileUpload label="Photo" value="" onChange={() => {}} />);

    expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
    expect(screen.getByText(/drag and drop/i)).toBeInTheDocument();
  });

  it('should display preview when value is provided', () => {
    const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    render(<FileUpload label="Photo" value={base64Image} onChange={() => {}} />);

    const image = screen.getByAltText('Preview');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', base64Image);
  });

  it('should show remove button when image is displayed', () => {
    const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    render(<FileUpload label="Photo" value={base64Image} onChange={() => {}} />);

    expect(screen.getByLabelText('Remove image')).toBeInTheDocument();
  });

  it('should call onChange with empty string when remove button is clicked', async () => {
    const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<FileUpload label="Photo" value={base64Image} onChange={handleChange} />);

    const removeButton = screen.getByLabelText('Remove image');
    await user.click(removeButton);

    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('should display error message when error prop is provided', () => {
    render(<FileUpload label="Photo" value="" onChange={() => {}} error="Photo is required" />);

    expect(screen.getByText('Photo is required')).toBeInTheDocument();
  });

  it('should show file size hint with correct maxSizeMB', () => {
    render(<FileUpload label="Photo" value="" onChange={() => {}} maxSizeMB={10} />);

    expect(screen.getByText(/up to 10MB/i)).toBeInTheDocument();
  });

  it('should handle file selection via input', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    // Create a mock file
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    render(<FileUpload label="Photo" value="" onChange={handleChange} />);

    const input = screen.getByLabelText('Photo') as HTMLInputElement;
    await user.upload(input, file);

    // Wait for base64 conversion and onChange to be called
    await vi.waitFor(() => {
      expect(handleChange).toHaveBeenCalled();
    });
  });

  it('should validate file size and show error for large files', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    // Create a file larger than the limit (6MB file with 5MB limit)
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.png', { type: 'image/png' });

    render(<FileUpload label="Photo" value="" onChange={handleChange} maxSizeMB={5} />);

    const input = screen.getByLabelText('Photo') as HTMLInputElement;
    await user.upload(input, largeFile);

    await vi.waitFor(() => {
      expect(screen.getByText(/exceeds 5MB limit/i)).toBeInTheDocument();
    });

    expect(handleChange).not.toHaveBeenCalled();
  });
});
