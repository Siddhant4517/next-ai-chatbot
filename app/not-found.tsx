export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white gap-4">
      <div className="text-5xl">404</div>
      <h2 className="text-xl font-semibold">Page Not Found</h2>
      <a
        href="/"
        className="px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-500 transition"
      >
        Go Home
      </a>
    </div>
  );
}