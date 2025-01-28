// Button.jsx
const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    disabled = false,
    fullWidth = false,
    type = 'button',
    onClick,
    className = ''
  }) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200';
    
    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-300',
      secondary: 'bg-white text-primary-600 border border-primary-600 hover:bg-primary-50',
      outline: 'bg-white text-secondary-600 border border-secondary-300 hover:border-secondary-400',
      ghost: 'bg-transparent text-secondary-600 hover:bg-secondary-50',
      danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
    };
  
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };
  
    return (
      <button
        type={type}
        disabled={disabled || isLoading}
        onClick={onClick}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${disabled ? 'cursor-not-allowed opacity-60' : ''}
          ${className}
        `}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : null}
        {children}
      </button>
    );
  };
  
  // Input.jsx
  const Input = ({
    type = 'text',
    label,
    error,
    placeholder,
    value,
    onChange,
    required = false,
    disabled = false,
    className = ''
  }) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full px-3 py-2 bg-white border rounded-lg
            ${error ? 'border-red-500' : 'border-secondary-300'}
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-secondary-50 disabled:cursor-not-allowed
            ${className}
          `}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  };
  
  // Select.jsx
  const Select = ({
    label,
    options = [],
    value,
    onChange,
    placeholder = 'Selecione uma opção',
    error,
    required = false,
    disabled = false,
    className = ''
  }) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full px-3 py-2 bg-white border rounded-lg appearance-none
            ${error ? 'border-red-500' : 'border-secondary-300'}
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-secondary-50 disabled:cursor-not-allowed
            ${className}
          `}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  };
  
  // Badge.jsx
  const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    className = ''
  }) => {
    const variants = {
      default: 'bg-secondary-100 text-secondary-800',
      primary: 'bg-primary-100 text-primary-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      danger: 'bg-red-100 text-red-800',
    };
  
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };
  
    return (
      <span className={`
        inline-flex items-center font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}>
        {children}
      </span>
    );
  };
  
  // Card.jsx
  const Card = ({
    children,
    padding = 'default',
    className = ''
  }) => {
    const paddings = {
      none: '',
      sm: 'p-3',
      default: 'p-4',
      lg: 'p-6',
    };
  
    return (
      <div className={`
        bg-white rounded-lg shadow-soft
        ${paddings[padding]}
        ${className}
      `}>
        {children}
      </div>
    );
  };
  
  export { Button, Input, Select, Badge, Card };