// app/wizard/page.jsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const steps = [
  {
    name: "No of Dependents",
    field: "no_of_dependents",
    type: "number",
    placeholder: "Enter number of dependents (0-5)",
    validation: (value) => value >= 0 && value <= 5,
    errorMessage: "Please enter a number between 0 and 5",
  },
  {
    name: "Education",
    field: "education",
    type: "text",
    placeholder: "Enter 'graduate' or 'not graduate'",
    validation: (value) => ["graduate", "not graduate"].includes(value.toLowerCase()),
    errorMessage: "Please enter either 'graduate' or 'not graduate'",
  },
  {
    name: "Self Employed",
    field: "self_employed",
    type: "text",
    placeholder: "Enter 'yes' or 'no'",
    validation: (value) => ["yes", "no"].includes(value.toLowerCase()),
    errorMessage: "Please enter either 'yes' or 'no'",
  },
  {
    name: "Income Annum",
    field: "income_annum",
    type: "number",
    placeholder: "Enter your annual income",
    validation: (value) => value > 0,
    errorMessage: "Please enter a positive integer",
  },
  {
    name: "Loan Amount",
    field: "loan_amount",
    type: "number",
    placeholder: "Enter the loan amount",
    validation: (value) => value > 0,
    errorMessage: "Please enter a positive integer",
  },
  {
    name: "Loan Term",
    field: "loan_term",
    type: "number",
    placeholder: "Enter loan term in years (1-20)",
    validation: (value) => value > 0 && value <= 20,
    errorMessage: "Please enter a positive integer between 1 and 20",
  },
  {
    name: "Cibil Score",
    field: "cibil_score",
    type: "number",
    placeholder: "Enter your CIBIL score (0-900)",
    validation: (value) => value >= 0 && value <= 900,
    errorMessage: "Please enter a number between 0 and 900",
  },
  {
    name: "Residential Assets Value",
    field: "residential_assets_value",
    type: "number",
    placeholder: "Enter residential assets value (can be negative)",
    validation: (value) => true, // any number is allowed
    errorMessage: "",
  },
  {
    name: "Commercial Assets Value",
    field: "commercial_assets_value",
    type: "number",
    placeholder: "Enter commercial assets value (non-negative)",
    validation: (value) => value >= 0,
    errorMessage: "Please enter a non-negative integer",
  },
  {
    name: "Luxury Assets Value",
    field: "luxury_assets_value",
    type: "number",
    placeholder: "Enter luxury assets value (non-negative)",
    validation: (value) => value >= 0,
    errorMessage: "Please enter a non-negative integer",
  },
  {
    name: "Bank Asset Value",
    field: "bank_asset_value",
    type: "number",
    placeholder: "Enter bank asset value (non-negative)",
    validation: (value) => value >= 0,
    errorMessage: "Please enter a non-negative integer",
  },
];

export default function Wizard() {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const router = useRouter();

  const handleNext = () => {
    const currentStep = steps[step];
    const value = inputs[currentStep.field];
    // For number inputs, convert to Number before validating
    const numericValue = currentStep.type === "number" ? Number(value) : value;
    if (!currentStep.validation(numericValue)) {
      setError(currentStep.errorMessage);
      return;
    }
    setError("");
    setStep(step + 1);
  };

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [steps[step].field]: e.target.value });
  };

  const handleSubmit = async () => {
    // Compute computed fields
    const computedTotalAssets =
      Number(inputs.residential_assets_value) +
      Number(inputs.commercial_assets_value) +
      Number(inputs.luxury_assets_value) +
      Number(inputs.bank_asset_value);

    const computedDebtToIncome = Number(inputs.loan_amount) / (Number(inputs.income_annum) + 1);
    const computedLoanToAssets = Number(inputs.loan_amount) / (computedTotalAssets + 1);

    // Compute cibil bucket based on the cibil_score
    let bucket;
    const cibilScore = Number(inputs.cibil_score);
    if (cibilScore <= 500) bucket = 0;
    else if (cibilScore <= 700) bucket = 1;
    else bucket = 2;

    // Convert education and self_employed to binary values
    const educationBinary = inputs.education.toLowerCase() === "graduate" ? 1 : 0;
    const selfEmployedBinary = inputs.self_employed.toLowerCase() === "yes" ? 1 : 0;

    // Build the features array in the expected order:
    const features = [
      Number(inputs.no_of_dependents),
      educationBinary,
      selfEmployedBinary,
      Number(inputs.income_annum),
      Number(inputs.loan_amount),
      Number(inputs.loan_term),
      Number(inputs.cibil_score),
      Number(inputs.residential_assets_value),
      Number(inputs.commercial_assets_value),
      Number(inputs.luxury_assets_value),
      Number(inputs.bank_asset_value),
      computedTotalAssets,
      Number(computedDebtToIncome.toFixed(10)),
      Number(computedLoanToAssets.toFixed(10)),
      bucket,
    ];

    // Call your API endpoint
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features }),
      });
      const data = await response.json();
      setResult(data.loan_approval);
      // Move to the results step
      setStep(step + 1);
    } catch (err) {
      setError("Error: " + err.message);
    }
    setLoading(false);
  };

  const currentStepObj = steps[step];

  return (
    <div className="min-h-screen bg-ocean-light flex flex-col items-center justify-center p-4">
      {step < steps.length && (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">{currentStepObj.name}</h2>
          <input
            type={currentStepObj.type}
            placeholder={currentStepObj.placeholder}
            value={inputs[currentStepObj.field] || ""}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2 mb-4"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === steps.length && (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>
          <p className="mb-4">Please review your inputs and submit your loan request.</p>
          {/* (Optional) You could list the entered values here */}
          <div className="flex justify-between">
            <button
              onClick={() => setStep(step - 1)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Submit
            </button>
          </div>
          {loading && <p className="mt-2">Submitting...</p>}
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
      )}

      {step === steps.length + 1 && (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4">Loan Approval Result</h2>
          {result ? (
            <p className="text-2xl">{result}</p>
          ) : (
            <p className="text-2xl text-red-500">No result found.</p>
          )}
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
