// src/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Loan Approval Prediction",
  description: "CS 4442B Project",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#ffffff" }} className="min-h-screen overflow-hidden">
        <header className="p-4 flex justify-between items-center">
          <div className="text-lg font-bold">CS 4442B Project</div>
          <div className="text-lg font-semibold">Rohan Datta, Hamza Kamran</div>
        </header>
        <section className="flex justify-center mt-4">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl text-center">
            <p className="text-sm text-gray-700">
              This website is an implementation of the final project for the CS 4442B course.
              It is meant for users who would like to know whether applications for loans they apply
              for will be approved or rejected based on their credit information.
            </p>
          </div>
        </section>
        <main className="mt-6">{children}</main>
      </body>
    </html>
  );
}
