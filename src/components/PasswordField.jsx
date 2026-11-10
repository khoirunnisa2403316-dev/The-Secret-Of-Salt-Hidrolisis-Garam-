import { useState } from 'react';

/**
 * PasswordField Component — Media Pembelajaran Kimia
 * Reusable password input with lock icon, show/hide toggle, and error handling.
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
    <div className="w-full mb-4">
      {/* Label Row */}
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-[#134E4A]"
        >
          {label}
          {required && <span className="text-[#DC2626] ml-1" aria-hidden="true">*</span>}
        </label>
        {rightAction && (
          <div className="text-xs sm:text-sm font-medium">
            {rightAction}
          </div>
        )}
      </div>

      <div className="relative rounded-xl shadow-xs transition-all duration-200">
        {/* Left Lock Icon */}
        <div
          className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]"
          aria-hidden="true"
        >
          <svg
            className="w-5 h-5"
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
          className={`w-full py-2.5 sm:py-3 pl-10 sm:pl-11 pr-11 rounded-xl text-sm sm:text-base text-[#134E4A] bg-[#FFFFFF] border transition-all duration-200 placeholder:text-[#94A3B8] outline-none ${
            error
              ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-3 focus:ring-[#DC2626]/20 bg-[#FEF2F2]'
              : 'border-[#CBD5E1] hover:border-[#94A3B8] focus:border-[#0F766E] focus:ring-3 focus:ring-[#0F766E]/20'
          } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
        />

        {/* Right Toggle Show/Hide Button */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#0F766E] transition-colors focus:outline-none focus:text-[#0F766E]"
          aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
        >
          {showPassword ? (
            /* Eye Off Icon */
            <svg
              className="w-5 h-5"
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
            /* Eye Icon */
            <svg
              className="w-5 h-5"
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
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-xs sm:text-sm text-[#DC2626] flex items-center gap-1 font-medium animate-fadeIn"
        >
          <svg
            className="w-4 h-4 shrink-0 text-[#DC2626]"
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

