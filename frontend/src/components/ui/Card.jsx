import React from 'react';
import './Card.css';

/**
 * Card Component - Consistent card styling across the application
 * 
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} props.padding - Card padding size
 * @param {'none'|'sm'|'md'|'lg'|'xl'} props.shadow - Card shadow intensity
 * @param {boolean} props.hover - Whether card has hover effects
 * @param {boolean} props.clickable - Whether card is clickable
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler (if clickable)
 */
const Card = ({
  padding = 'md',
  shadow = 'md',
  hover = false,
  clickable = false,
  children,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'card';
  const paddingClass = `card--padding-${padding}`;
  const shadowClass = `card--shadow-${shadow}`;
  const hoverClass = hover ? 'card--hover' : '';
  const clickableClass = clickable ? 'card--clickable' : '';

  const classes = [
    baseClasses,
    paddingClass,
    shadowClass,
    hoverClass,
    clickableClass,
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (clickable && onClick) {
      onClick(e);
    }
  };

  const Component = clickable ? 'button' : 'div';

  return (
    <Component
      className={classes}
      onClick={handleClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * Card Header Component
 */
const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card__header ${className}`} {...props}>
    {children}
  </div>
);

/**
 * Card Body Component
 */
const CardBody = ({ children, className = '', ...props }) => (
  <div className={`card__body ${className}`} {...props}>
    {children}
  </div>
);

/**
 * Card Footer Component
 */
const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card__footer ${className}`} {...props}>
    {children}
  </div>
);

/**
 * Card Title Component
 */
const CardTitle = ({ children, className = '', truncate = false, ...props }) => (
  <h3 className={`card__title ${truncate ? 'truncate' : ''} ${className}`} {...props}>
    {children}
  </h3>
);

/**
 * Card Description Component
 */
const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`card__description ${className}`} {...props}>
    {children}
  </p>
);

// Export all components
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;