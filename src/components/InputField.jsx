import './Auth.css';

/**
 * InputField Component — Media Pembelajaran Kimia
 * Reusable accessible text/email input with icon and validation error display.
 * Includes absolute left indentation guarantee to prevent icon overlapping text.
 */

export default function InputField({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon,
  required = false,
  autoComplete,
  disabled = false,
}) {
  const inputId = id || name;
  const errorId = `${inputId}-error`;

  return (
    <div className="auth-field-group">
      {label && (
        <label htmlFor={inputId} className="auth-label">
          {label}
          {required && (
            <span className="auth-label-required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="auth-input-container">
        {/* Left Icon */}
        {icon && (
          <div className="auth-left-icon" aria-hidden="true">
            {icon}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          style={{
            paddingLeft: icon ? '44px' : '16px',
            paddingRight: '16px',
          }}
          className={`auth-input ${icon ? 'auth-input-with-icon' : ''} ${
            error ? 'auth-input-error' : ''
          }`}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p id={errorId} role="alert" className="auth-field-error">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
