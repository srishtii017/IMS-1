const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <p className="text-2xl mt-4">Page Not Found</p>
        <p className="mt-2 text-gray-600">The page you are looking for does not exist or has been moved.</p>
        <a href="/" className="mt-6 inline-block px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          Go Back Home
        </a>
      </div>
    </div>
  );
}

export default ErrorPage;
