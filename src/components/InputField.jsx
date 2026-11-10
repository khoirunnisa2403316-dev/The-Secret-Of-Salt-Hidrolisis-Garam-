/**
 * InputField Component — Media Pembelajaran Kimia
 * Reusable accessible text/email input with icon and validation error display.
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
    <div className="w-full mb-4">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-[#134E4A] mb-1.5"
        >
          {label}
          {required && <span className="text-[#DC2626] ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-xs transition-all duration-200">
        {/* Left Icon */}
        {icon && (
          <div
            className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]"
            aria-hidden="true"
          >
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
          className={`w-full py-2.5 sm:py-3 pr-4 rounded-xl text-sm sm:text-base text-[#134E4A] bg-[#FFFFFF] border transition-all duration-200 placeholder:text-[#94A3B8] outline-none ${
            icon ? 'pl-10 sm:pl-11' : 'pl-3.5'
          } ${
            error
              ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-3 focus:ring-[#DC2626]/20 bg-[#FEF2F2]'
              : 'border-[#CBD5E1] hover:border-[#94A3B8] focus:border-[#0F766E] focus:ring-3 focus:ring-[#0F766E]/20'
          } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
        />
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

