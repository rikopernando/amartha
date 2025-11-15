import { useState, useEffect, useRef } from 'react';
import { debounce } from '../../utils/debounce';
import './Autocomplete.css';

interface AutocompleteOption {
  id: number;
  name: string;
}

interface AutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  fetchOptions: (query: string) => Promise<AutocompleteOption[]>;
  placeholder?: string;
  error?: string;
  required?: boolean;
  debounceMs?: number;
}

function Autocomplete({
  label,
  value,
  onChange,
  fetchOptions,
  placeholder = 'Start typing...',
  error,
  required = false,
  debounceMs = 300,
}: AutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounced fetch function
  const debouncedFetchRef = useRef(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setOptions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setFetchError(null);

      try {
        const results = await fetchOptions(query);
        setOptions(results);
        setIsOpen(true);
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Failed to fetch options');
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs)
  );

  // Fetch options when input changes
  useEffect(() => {
    debouncedFetchRef.current(inputValue);
  }, [inputValue]);

  // Update input when value prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const handleOptionSelect = (option: AutocompleteOption) => {
    setInputValue(option.name);
    onChange(option.name);
    setIsOpen(false);
    setOptions([]);
  };

  const handleInputFocus = () => {
    if (inputValue.trim() && options.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className="autocomplete" ref={wrapperRef}>
      <label className="autocomplete__label">
        {label}
        {required && <span className="autocomplete__required">*</span>}
      </label>

      <div className="autocomplete__input-wrapper">
        <input
          type="text"
          className={`autocomplete__input ${error ? 'autocomplete__input--error' : ''}`}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          aria-label={label}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="autocomplete-listbox"
        />

        {isLoading && (
          <div className="autocomplete__loading" aria-label="Loading">
            Loading...
          </div>
        )}
      </div>

      {error && <div className="autocomplete__error">{error}</div>}
      {fetchError && <div className="autocomplete__error">{fetchError}</div>}

      {isOpen && options.length > 0 && (
        <ul
          className="autocomplete__options"
          id="autocomplete-listbox"
          role="listbox"
          aria-label={`${label} options`}
        >
          {options.map((option) => (
            <li
              key={option.id}
              className="autocomplete__option"
              onClick={() => handleOptionSelect(option)}
              role="option"
              aria-selected={inputValue === option.name}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}

      {isOpen && !isLoading && inputValue.trim() && options.length === 0 && !fetchError && (
        <div className="autocomplete__no-results">No results found</div>
      )}
    </div>
  );
}

export default Autocomplete;
