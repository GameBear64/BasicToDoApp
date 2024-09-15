export default function Icon({ icon, full, dense, clickable, styles, ...rest }) {
  return (
    <span
      style={{ FILL: full ? 1 : 0, letterSpacing: dense ? '-0.2em' : '0' }}
      className={`material-symbols-rounded ${clickable ? 'cursor-pointer ' : ''}${styles || ''}`}
      {...rest}
    >
      {icon}
    </span>
  );
}
