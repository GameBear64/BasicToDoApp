import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-center text-9xl font-bold text-neutral-500">404</h1>
      <h1 className="text-center text-4xl font-bold text-neutral-500">Page not found</h1>
      <h2 className="mt-10 text-center text-xl">The page you are looking for could not be found...</h2>
      <button
        onClick={() => navigate(-1)}
        className="mt-4 rounded bg-neutral-600 px-2.5 py-1 text-lg text-white hover:bg-neutral-700">
        Go back
      </button>
    </div>
  );
}
