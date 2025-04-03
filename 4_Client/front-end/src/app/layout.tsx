// src/app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Loan Approval Prediction',
  description: 'CS 4442B Project',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-hidden">
        <header className="bg-blue-100 p-4 flex justify-between items-center">
          <div className="text-lg font-bold">CS 4442B Project</div>
          <div className="text-lg font-semibold">Rohan Datta, Hamza Kamran</div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
