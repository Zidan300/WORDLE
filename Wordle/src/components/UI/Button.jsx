export function Button({ children, className = '', variant = 'primary', ...props }) {
  return <button className={`button button-${variant} ${className}`} type="button" {...props}>{children}</button>
}
