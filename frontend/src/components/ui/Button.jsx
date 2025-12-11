import React from 'react';
import './Button.css';

/**
 * Button Component - Consistent button styling across the application
 * 
 * @param {Object} props
 * @param {'primary'|'secondary'|'success'|'danger'|'warning'|'ghost'} props.variant - Button style variant
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {boolean} props.fullWidth - Whether button takes full width
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {'button'|'submit'|'reset'} props.type - Button type
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  children,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClass = `btn--${variant}`;
  const sizeClass = `btn--${size}`;
  const fullWidthClass = fullWidth ? 'btn--full-width' : '';
  const loadingClass = loading ? 'btn--loading' : '';
  const disabledClass = disabled ? 'btn--disabled' : '';

  const classes = [
    baseClasses,
    variantClass,
    sizeClass,
    fullWidthClass,
    loadingClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      type={type}
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="btn__spinner" aria-hidden="true">
          <svg className="btn__spinner-icon" viewBox="0 0 24 24">
            <circle
              className="btn__spinner-circle"
              cx="12"
              cy="12"
              r="10"
              fill="none"
              strokeWidth="2"
            />
          </svg>
        </span>
      )}
      <span className={loading ? 'btn__content--loading' : 'btn__content'}>
        {children}
      </span>
    </button>
  );
};

export default Button;