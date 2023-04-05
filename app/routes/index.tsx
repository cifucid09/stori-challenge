import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div className="block">
      <Link to="/newsletter" className="block p-4 text-xl text-blue-500">
        Send Newsletter
      </Link>
      <div className="bg-blue h-full w-full"> STATS PLACEHOLDER</div>
    </div>
  );
}
