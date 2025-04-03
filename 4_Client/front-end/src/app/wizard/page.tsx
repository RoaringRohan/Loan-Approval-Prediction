// src/app/wizard/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Define types for steps

interface NumberStep {
  name: string;
  field: string;
  type: "number";
  placeholder: string;
  validation: (value: number) => boolean;
  errorMessage: string;
}

interface SelectStep {
  name: string;
  field: string;
  type: "select";
  placeholder: string;
  options: string[];
  validation: (value: string) => boolean;
  errorMessage: string;
}

type Step = NumberStep | SelectStep;

const steps: Step[] = [
  {
    name: "No. of Dependents",
    field: "no_of_dependents",
    type: "number",
    placeholder: "Enter number of dependents (0-5)",
    validation: (value: number) => value >= 0 && value <= 5,
    errorMessage: "Please enter a number between 0 and 5",
  },
  {
    name: "Education",
    field: "education",
    type: "select",
    options: ["graduate", "not graduate"],
    placeholder: "Select your education status",
    validation: (value: string) =>
      value.trim() !== "" &&
      ["graduate", "not graduate"].includes(value.toLowerCase()),
    errorMessage: "Please select an option",
  },
  {
    name: "Self Employed",
    field: "self_employed",
    type: "select",
    options: ["yes", "no"],
    placeholder: "Select if you are self employed",
    validation: (value: string) =>
      value.trim() !== "" && ["yes", "no"].includes(value.toLowerCase()),
    errorMessage: "Please select an option",
  },
  {
    name: "Income Annum",
    field: "income_annum",
    type: "number",
    placeholder: "Enter your annual income",
    validation: (value: number) => value > 0,
    errorMessage: "Please enter a positive integer",
  },
  {
    name: "Loan Amount",
    field: "loan_amount",
    type: "number",
    placeholder: "Enter the loan amount",
    validation: (value: number) => value > 0,
    errorMessage: "Please enter a positive integer",
  },
  {
    name: "Loan Term",
    field: "loan_term",
    type: "number",
    placeholder: "Enter loan term in years (1-50)",
    validation: (value: number) => value > 0 && value <= 50,
    errorMessage: "Please enter a positive integer between 1 and 50",
  },
  {
    name: "Credit Score",
    field: "cibil_score",
    type: "number",
    placeholder: "Enter your Credit (CIBIL) score (0-900)",
    validation: (value: number) => value >= 0 && value <= 900,
    errorMessage: "Please enter a number between 0 and 900",
  },
  {
    name: "Residential Assets Value",
    field: "residential_assets_value",
    type: "number",
    placeholder: "Enter residential assets value (can be negative)",
    validation: () => true,
    errorMessage: "",
  },
  {
    name: "Commercial Assets Value",
    field: "commercial_assets_value",
    type: "number",
    placeholder: "Enter commercial assets value (non-negative)",
    validation: (value: number) => value >= 0,
    errorMessage: "Please enter a non-negative integer",
  },
  {
    name: "Luxury Assets Value",
    field: "luxury_assets_value",
    type: "number",
    placeholder: "Enter luxury assets value (non-negative)",
    validation: (value: number) => value >= 0,
    errorMessage: "Please enter a non-negative integer",
  },
  {
    name: "Bank Asset Value",
    field: "bank_asset_value",
    type: "number",
    placeholder: "Enter bank asset value (non-negative)",
    validation: (value: number) => value >= 0,
    errorMessage: "Please enter a non-negative integer",
  },
];

export default function Wizard() {
  const [stepIndex, setStepIndex] = useState(0);
  // We'll store all inputs as strings
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const router = useRouter();

  const currentStep = steps[stepIndex];

  const handleNext = () => {
    const value = inputs[currentStep.field] || "";
    let isValid: boolean = false;

    if (currentStep.type === "number") {
      const numericValue = Number(value);
      isValid = currentStep.validation(numericValue);
    } else {
      isValid = currentStep.validation(value);
    }

    if (!isValid) {
      setError(currentStep.errorMessage);
      return;
    }
    setError("");
    setStepIndex(stepIndex + 1);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setInputs({ ...inputs, [currentStep.field]: e.target.value });
  };

  const handleSubmit = async () => {
    // Compute computed fields
    const computedTotalAssets =
      Number(inputs["residential_assets_value"]) +
      Number(inputs["commercial_assets_value"]) +
      Number(inputs["luxury_assets_value"]) +
      Number(inputs["bank_asset_value"]);

    const computedDebtToIncome =
      Number(inputs["loan_amount"]) / (Number(inputs["income_annum"]) + 1);
    const computedLoanToAssets =
      Number(inputs["loan_amount"]) / (computedTotalAssets + 1);

    // Compute cibil bucket
    let bucket: number;
    const cibilScore = Number(inputs["cibil_score"]);
    if (cibilScore <= 500) bucket = 0;
    else if (cibilScore <= 700) bucket = 1;
    else bucket = 2;

    // Convert education and self_employed to binary values
    const educationBinary =
      inputs["education"].toLowerCase() === "graduate" ? 1 : 0;
    const selfEmployedBinary =
      inputs["self_employed"].toLowerCase() === "yes" ? 1 : 0;

    // Build the features array in the expected order
    const features = [
      Number(inputs["no_of_dependents"]),
      educationBinary,
      selfEmployedBinary,
      Number(inputs["income_annum"]),
      Number(inputs["loan_amount"]),
      Number(inputs["loan_term"]),
      Number(inputs["cibil_score"]),
      Number(inputs["residential_assets_value"]),
      Number(inputs["commercial_assets_value"]),
      Number(inputs["luxury_assets_value"]),
      Number(inputs["bank_asset_value"]),
      computedTotalAssets,
      Number(computedDebtToIncome.toFixed(10)),
      Number(computedLoanToAssets.toFixed(10)),
      bucket,
    ];

    setLoading(true);
    try {
      const response = await fetch("https://cs4442b-project.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ features }),
      });
      const data = await response.json();
      setResult(data.loan_approval);
      setStepIndex(stepIndex + 1);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Error: " + err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-12">
      {stepIndex < steps.length && (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">{currentStep.name}</h2>
          {currentStep.type === "select" ? (
            <select
              value={inputs[currentStep.field] || ""}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2 mb-4"
            >
              <option value="">{currentStep.placeholder}</option>
              {currentStep.options.map((option, index) => (
                <option key={index} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="number"
              placeholder={currentStep.placeholder}
              value={inputs[currentStep.field] || ""}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2 mb-4"
            />
          )}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex justify-between">
            {stepIndex > 0 && (
              <button
                onClick={() => setStepIndex(stepIndex - 1)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                stepIndex === 0 ? "ml-auto" : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {stepIndex === steps.length && (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>
          <p className="mb-4">
            Please review your inputs and submit your loan request.
          </p>
          <div className="flex justify-between">
            <button
              onClick={() => setStepIndex(stepIndex - 1)}
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

      {stepIndex === steps.length + 1 && (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4">Loan Approval Result</h2>
          {result ? (
            <p className="text-2xl">{result}</p>
          ) : (
            <p className="text-2xl text-red-500">No result found.</p>
          )}
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
