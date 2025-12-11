import React from 'react';
import './Badge.css';

/**
 * Badge Component - Small status indicators and labels
 * 
 * @param {Object} props
 * @param {'primary'|'secondary'|'success'|'danger'|'warning'|'gray'} props.variant - Badge color variant
 * @param {'sm'|'md'|'lg'} props.size - Badge size
 * @param {boolean} props.dot - Whether to show as a dot indicator
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.className - Additional CSS classes
 */
const Badge = ({
  variant = 'gray',
  size = 'md',
  dot = false,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'badge';
  const variantClass = `badge--${variant}`;
  const sizeClass = `badge--${size}`;
  const dotClass = dot ? 'badge--dot' : '';

  const classes = [
    baseClasses,
    variantClass,
    sizeClass,
    dotClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {dot ? null : children}
    </span>
  );
};

export default Badge;