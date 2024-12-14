import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="h-screen p-4 flex items-center justify-center flex-col text-center">
      <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-blue-500 underline">
        Go Back to Calendar
      </Link>
    </div>
  );
};

export default NotFoundPage;
