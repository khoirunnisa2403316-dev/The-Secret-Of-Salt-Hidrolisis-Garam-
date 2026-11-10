import { useState } from 'react';
import './Auth.css';

/**
 * PasswordField Component — Media Pembelajaran Kimia
 * Reusable password input with lock icon, show/hide toggle, and error handling.
 * Includes explicit padding guarantees so text never overlaps left icon or eye toggle.
 */

export default function PasswordField({
  id,
  name,
  label = 'Kata Sandi',
  value,
  onChange,
  placeholder = 'Masukkan kata sandi',
  error,
  required = false,
  autoComplete = 'current-password',
  disabled = false,
  rightAction, // Optional element like "Lupa Kata Sandi?"
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name;
  const errorId = `${inputId}-error`;

  return (
    <div className="auth-field-group">
      {/* Label Row */}
      <div className="auth-label-row">
        <label htmlFor={inputId} className="auth-label">
          {label}
          {required && (
            <span className="auth-label-required" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {rightAction && (
          <div className="auth-forgot-link-wrapper">
            {rightAction}
          </div>
        )}
      </div>

      <div className="auth-input-container">
        {/* Left Lock Icon */}
        <div className="auth-left-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <input
          id={inputId}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          style={{
            paddingLeft: '44px',
            paddingRight: '44px',
          }}
          className={`auth-input auth-input-with-icon auth-input-password ${
            error ? 'auth-input-error' : ''
          }`}
        />

        {/* Right Toggle Show/Hide Button */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
          className="auth-eye-button"
          aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
        >
          {showPassword ? (
            /* Eye Off Icon */
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            /* Eye On Icon */
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
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
