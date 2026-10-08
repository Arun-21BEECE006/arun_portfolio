import { Link } from "react-router-dom";
import { RiArrowLeftLine } from "react-icons/ri";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center section-pad text-center">
      <div>
        <p className="eyebrow mb-3">404</p>
        <h1 className="font-display text-3xl font-semibold mb-4">
          Page not found.
        </h1>
        <p className="text-muted mb-6">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link
          to="/"
          className="text-teal-300 hover:text-teal-200 inline-flex items-center gap-2"
        >
          <RiArrowLeftLine /> Back to portfolio
        </Link>
      </div>
    </div>
  );
}
