// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-start justify-center pt-12">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          Loan Approval Prediction
        </h1>
        <Link href="/wizard">
          <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Start
          </button>
        </Link>
      </div>
    </div>
  );
}
