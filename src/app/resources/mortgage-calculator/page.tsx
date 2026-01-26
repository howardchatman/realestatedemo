"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calculator,
  DollarSign,
  Percent,
  Calendar,
  Home,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  User,
  Download,
  PieChart,
} from "lucide-react";

export default function MortgageCalculatorPage() {
  // Calculator inputs
  const [homePrice, setHomePrice] = useState(450000);
  const [downPayment, setDownPayment] = useState(90000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(1.2);
  const [homeInsurance, setHomeInsurance] = useState(1200);
  const [pmi, setPmi] = useState(0);
  const [hoa, setHoa] = useState(0);

  // Results
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [principalInterest, setPrincipalInterest] = useState(0);
  const [monthlyTax, setMonthlyTax] = useState(0);
  const [monthlyInsurance, setMonthlyInsurance] = useState(0);
  const [monthlyPmi, setMonthlyPmi] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  // Lead capture
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync down payment amount and percentage
  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value);
    setDownPaymentPercent(Math.round((value / homePrice) * 100));
  };

  const handleDownPaymentPercentChange = (percent: number) => {
    setDownPaymentPercent(percent);
    setDownPayment(Math.round(homePrice * (percent / 100)));
  };

  const handleHomePriceChange = (price: number) => {
    setHomePrice(price);
    setDownPayment(Math.round(price * (downPaymentPercent / 100)));
  };

  // Calculate mortgage
  useEffect(() => {
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    // Calculate P&I
    let pi = 0;
    if (monthlyRate > 0) {
      pi =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
      pi = principal / numPayments;
    }
    setPrincipalInterest(pi);

    // Calculate monthly property tax
    const tax = (homePrice * (propertyTax / 100)) / 12;
    setMonthlyTax(tax);

    // Calculate monthly insurance
    const insurance = homeInsurance / 12;
    setMonthlyInsurance(insurance);

    // Calculate PMI (if down payment < 20%)
    let pmiAmount = 0;
    if (downPaymentPercent < 20) {
      pmiAmount = (principal * (pmi / 100)) / 12;
    }
    setMonthlyPmi(pmiAmount);

    // Total monthly payment
    const total = pi + tax + insurance + pmiAmount + hoa;
    setMonthlyPayment(total);

    // Total over loan life
    setTotalPayment(pi * numPayments);
    setTotalInterest(pi * numPayments - principal);
  }, [
    homePrice,
    downPayment,
    downPaymentPercent,
    interestRate,
    loanTerm,
    propertyTax,
    homeInsurance,
    pmi,
    hoa,
  ]);

  // Auto-set PMI
  useEffect(() => {
    if (downPaymentPercent < 20) {
      setPmi(0.5); // Default PMI rate
    } else {
      setPmi(0);
    }
  }, [downPaymentPercent]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save lead to database
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...leadForm,
          source: "mortgage_calculator",
          notes: `Home Price: ${formatCurrency(homePrice)}, Down Payment: ${formatCurrency(downPayment)} (${downPaymentPercent}%), Interest Rate: ${interestRate}%, Monthly Payment: ${formatCurrency(monthlyPayment)}`,
        }),
      });
    } catch (error) {
      console.error("Error saving lead:", error);
    }

    setIsSubmitting(false);
    setLeadSubmitted(true);
  };

  // Payment breakdown percentages for pie chart visualization
  const piPercent = (principalInterest / monthlyPayment) * 100 || 0;
  const taxPercent = (monthlyTax / monthlyPayment) * 100 || 0;
  const insurancePercent = (monthlyInsurance / monthlyPayment) * 100 || 0;
  const pmiPercent = (monthlyPmi / monthlyPayment) * 100 || 0;
  const hoaPercent = (hoa / monthlyPayment) * 100 || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href="/"
            className="inline-flex items-center text-emerald-100 hover:text-white mb-6 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Calculator className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold">Mortgage Calculator</h1>
          </div>
          <p className="text-xl text-emerald-100 max-w-2xl">
            Calculate your monthly mortgage payment and see how much home you
            can afford. Get pre-approved today!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Inputs */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Loan Details
              </h2>

              <div className="space-y-6">
                {/* Home Price */}
                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-emerald-600" />
                      Home Price
                    </span>
                    <span className="text-emerald-600 font-semibold">
                      {formatCurrency(homePrice)}
                    </span>
                  </label>
                  <input
                    type="range"
                    min="100000"
                    max="2000000"
                    step="10000"
                    value={homePrice}
                    onChange={(e) =>
                      handleHomePriceChange(Number(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$100K</span>
                    <span>$2M</span>
                  </div>
                </div>

                {/* Down Payment */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      Down Payment
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        value={downPayment}
                        onChange={(e) =>
                          handleDownPaymentChange(Number(e.target.value))
                        }
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Percent className="w-4 h-4 text-emerald-600" />
                      Down Payment %
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={downPaymentPercent}
                        onChange={(e) =>
                          handleDownPaymentPercentChange(Number(e.target.value))
                        }
                        className="w-full pr-8 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        %
                      </span>
                    </div>
                  </div>
                </div>

                {downPaymentPercent < 20 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                    <strong>Note:</strong> Down payments less than 20% typically
                    require Private Mortgage Insurance (PMI).
                  </div>
                )}

                {/* Interest Rate & Loan Term */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      Interest Rate
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.125"
                        min="0"
                        max="15"
                        value={interestRate}
                        onChange={(e) =>
                          setInterestRate(Number(e.target.value))
                        }
                        className="w-full pr-8 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        %
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      Loan Term
                    </label>
                    <select
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value={30}>30 years</option>
                      <option value={20}>20 years</option>
                      <option value={15}>15 years</option>
                      <option value={10}>10 years</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Costs */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Additional Costs
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Property Tax Rate (% per year)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={propertyTax}
                      onChange={(e) => setPropertyTax(Number(e.target.value))}
                      className="w-full pr-8 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Home Insurance ($ per year)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={homeInsurance}
                      onChange={(e) => setHomeInsurance(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    HOA Fees ($ per month)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={hoa}
                      onChange={(e) => setHoa(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
                {downPaymentPercent < 20 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      PMI Rate (% per year)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="2"
                        value={pmi}
                        onChange={(e) => setPmi(Number(e.target.value))}
                        className="w-full pr-8 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        %
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Monthly Payment */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-lg font-semibold mb-2 text-emerald-100">
                Estimated Monthly Payment
              </h2>
              <div className="text-5xl font-bold mb-4">
                {formatCurrency(monthlyPayment)}
              </div>

              {/* Breakdown */}
              <div className="space-y-3 pt-4 border-t border-white/20">
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-100">Principal & Interest</span>
                  <span className="font-medium">
                    {formatCurrency(principalInterest)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-100">Property Tax</span>
                  <span className="font-medium">
                    {formatCurrency(monthlyTax)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-100">Home Insurance</span>
                  <span className="font-medium">
                    {formatCurrency(monthlyInsurance)}
                  </span>
                </div>
                {monthlyPmi > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-100">PMI</span>
                    <span className="font-medium">
                      {formatCurrency(monthlyPmi)}
                    </span>
                  </div>
                )}
                {hoa > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-100">HOA</span>
                    <span className="font-medium">{formatCurrency(hoa)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Breakdown Visual */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-600" />
                Payment Breakdown
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Principal & Interest</span>
                    <span className="font-medium">{piPercent.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${piPercent}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Property Tax</span>
                    <span className="font-medium">
                      {taxPercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${taxPercent}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Insurance</span>
                    <span className="font-medium">
                      {insurancePercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${insurancePercent}%` }}
                    />
                  </div>
                </div>
                {pmiPercent > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">PMI</span>
                      <span className="font-medium">
                        {pmiPercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${pmiPercent}%` }}
                      />
                    </div>
                  </div>
                )}
                {hoaPercent > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">HOA</span>
                      <span className="font-medium">
                        {hoaPercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${hoaPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Loan Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Loan Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Amount</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(homePrice - downPayment)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total of {loanTerm * 12} Payments</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(totalPayment)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Interest Paid</span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(totalInterest)}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gray-900 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-semibold mb-2">Ready to Get Pre-Approved?</h3>
              <p className="text-gray-400 text-sm mb-4">
                Get personalized rates and find out exactly how much home you
                can afford.
              </p>
              <button
                onClick={() => setShowLeadForm(true)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                Get Pre-Approved
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Capture Modal */}
      {showLeadForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            {!leadSubmitted ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Get Your Free Pre-Approval
                </h2>
                <p className="text-gray-600 mb-6">
                  One of our mortgage specialists will contact you with
                  personalized rates and options.
                </p>

                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={leadForm.name}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, name: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="John Smith"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={leadForm.email}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, email: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="john@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={leadForm.phone}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, phone: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-4 text-sm text-emerald-800">
                    <strong>Your calculation:</strong>
                    <br />
                    {formatCurrency(homePrice)} home with{" "}
                    {formatCurrency(downPayment)} down = {formatCurrency(monthlyPayment)}/month
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {isSubmitting ? "Submitting..." : "Get My Free Quote"}
                  </button>
                </form>

                <button
                  onClick={() => setShowLeadForm(false)}
                  className="w-full mt-4 text-gray-500 hover:text-gray-700 text-sm"
                >
                  Maybe later
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Thank You!
                </h2>
                <p className="text-gray-600 mb-6">
                  A mortgage specialist will contact you within 24 hours with
                  personalized rate options.
                </p>
                <button
                  onClick={() => {
                    setShowLeadForm(false);
                    setLeadSubmitted(false);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
