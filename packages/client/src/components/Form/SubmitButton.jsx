export default function Button({ label, type = 'submit', size, styles }) {
  const btnSize = size === 'small' ? 'py-1' : 'py-2';
  return (
    <button
      type={type}
      className={`my-3 w-72 rounded bg-primary-shade px-4 font-semibold text-white shadow-md ${btnSize} ${styles} text-lg`}>
      {label}
    </button>
  );
}
