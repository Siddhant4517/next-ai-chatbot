"use client";

import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white gap-4">
      <div className="text-5xl">⚠️</div>
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-gray-400 text-sm">{error.message}</p>
      <button
        onClick={reset}
        className="px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-500 transition"
      >
        Try Again
      </button>
    </div>
  );
}