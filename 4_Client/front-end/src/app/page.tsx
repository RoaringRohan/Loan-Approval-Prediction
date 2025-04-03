import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-ocean-light flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Loan Approval Prediction</h1>
        <Link href="/wizard">
        <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Start
        </button>
        </Link>
      </div>
    </div>
  );
}
