"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Sparkles,
  Home,
  Building,
  Copy,
  Check,
  RefreshCw,
  Wand2,
  Upload,
  X,
  ImageIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface PropertyDetails {
  address: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  squareFootage: string;
  lotSize: string;
  yearBuilt: string;
  price: string;
  features: string[];
  neighborhood: string;
  style: "luxury" | "family" | "investment" | "starter" | "commercial";
}

const featureOptions = [
  "Pool",
  "Hot Tub",
  "Garage",
  "Updated Kitchen",
  "Hardwood Floors",
  "Granite Counters",
  "Stainless Appliances",
  "Smart Home",
  "Solar Panels",
  "Fireplace",
  "Outdoor Kitchen",
  "Covered Patio",
  "Fenced Yard",
  "Corner Lot",
  "Cul-de-sac",
  "Waterfront",
  "Mountain Views",
  "City Views",
  "New Roof",
  "New HVAC",
];

const styleOptions = [
  { value: "luxury", label: "Luxury", icon: "✨" },
  { value: "family", label: "Family Home", icon: "🏡" },
  { value: "investment", label: "Investment", icon: "📈" },
  { value: "starter", label: "Starter Home", icon: "🔑" },
  { value: "commercial", label: "Commercial", icon: "🏢" },
];

export default function AIWriterPage() {
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({
    address: "",
    propertyType: "House",
    bedrooms: "",
    bathrooms: "",
    squareFootage: "",
    lotSize: "",
    yearBuilt: "",
    price: "",
    features: [],
    neighborhood: "",
    style: "family",
  });

  const [generatedDescription, setGeneratedDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [listingCreated, setListingCreated] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 10)); // Max 10 photos
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const newPhotos = [...prev];
      URL.revokeObjectURL(newPhotos[index].preview);
      newPhotos.splice(index, 1);
      return newPhotos;
    });
  };

  const validateListing = (): string[] => {
    const errors: string[] = [];
    if (!propertyDetails.address.trim()) errors.push("Address is required");
    if (!propertyDetails.price.trim()) errors.push("Price is required");
    if (!propertyDetails.bedrooms.trim() && propertyDetails.propertyType !== "Land" && propertyDetails.propertyType !== "Commercial") {
      errors.push("Bedrooms is required");
    }
    if (!propertyDetails.bathrooms.trim() && propertyDetails.propertyType !== "Land") {
      errors.push("Bathrooms is required");
    }
    if (!propertyDetails.squareFootage.trim() && propertyDetails.propertyType !== "Land") {
      errors.push("Square footage is required");
    }
    if (photos.length === 0) errors.push("At least 1 photo is required");
    if (!generatedDescription) errors.push("Generate a description first");
    return errors;
  };

  const handleCreateListing = async () => {
    const errors = validateListing();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    setIsCreating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsCreating(false);
    setListingCreated(true);

    // Reset after showing success
    setTimeout(() => {
      setListingCreated(false);
    }, 3000);
  };

  const toggleFeature = (feature: string) => {
    setPropertyDetails((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyDetails: {
            ...propertyDetails,
            bedrooms: propertyDetails.bedrooms ? parseInt(propertyDetails.bedrooms) : undefined,
            bathrooms: propertyDetails.bathrooms ? parseFloat(propertyDetails.bathrooms) : undefined,
            squareFootage: propertyDetails.squareFootage ? parseInt(propertyDetails.squareFootage.replace(/,/g, "")) : undefined,
            yearBuilt: propertyDetails.yearBuilt ? parseInt(propertyDetails.yearBuilt) : undefined,
            price: propertyDetails.price ? parseInt(propertyDetails.price.replace(/,/g, "")) : undefined,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedDescription(data.data.description);
      } else {
        setError(data.error || "Failed to generate description");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedDescription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/demo/admin"
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Listing Writer</h1>
                <p className="text-sm text-gray-500">Generate compelling property descriptions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Home className="w-5 h-5 text-emerald-600" />
              Property Details
            </h2>

            <div className="space-y-4">
              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={propertyDetails.address}
                  onChange={(e) => setPropertyDetails({ ...propertyDetails, address: e.target.value })}
                  placeholder="123 Main St, Houston, TX 77091"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Property Type & Style */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type
                  </label>
                  <select
                    value={propertyDetails.propertyType}
                    onChange={(e) => setPropertyDetails({ ...propertyDetails, propertyType: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="House">House</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Multi-family">Multi-family</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Land">Land</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Neighborhood
                  </label>
                  <input
                    type="text"
                    value={propertyDetails.neighborhood}
                    onChange={(e) => setPropertyDetails({ ...propertyDetails, neighborhood: e.target.value })}
                    placeholder="Oakwood Heights"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Beds, Baths, Sqft */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={propertyDetails.bedrooms}
                    onChange={(e) => setPropertyDetails({ ...propertyDetails, bedrooms: e.target.value })}
                    placeholder="4"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="text"
                    value={propertyDetails.bathrooms}
                    onChange={(e) => setPropertyDetails({ ...propertyDetails, bathrooms: e.target.value })}
                    placeholder="2.5"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Square Feet
                  </label>
                  <input
                    type="text"
                    value={propertyDetails.squareFootage}
                    onChange={(e) => setPropertyDetails({ ...propertyDetails, squareFootage: e.target.value })}
                    placeholder="2,500"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Year, Lot, Price */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year Built
                  </label>
                  <input
                    type="text"
                    value={propertyDetails.yearBuilt}
                    onChange={(e) => setPropertyDetails({ ...propertyDetails, yearBuilt: e.target.value })}
                    placeholder="2020"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lot Size
                  </label>
                  <input
                    type="text"
                    value={propertyDetails.lotSize}
                    onChange={(e) => setPropertyDetails({ ...propertyDetails, lotSize: e.target.value })}
                    placeholder="0.25 acres"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    value={propertyDetails.price}
                    onChange={(e) => setPropertyDetails({ ...propertyDetails, price: e.target.value })}
                    placeholder="550,000"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Writing Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Writing Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {styleOptions.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setPropertyDetails({ ...propertyDetails, style: style.value as PropertyDetails["style"] })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        propertyDetails.style === style.value
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {style.icon} {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features & Highlights
                </label>
                <div className="flex flex-wrap gap-2">
                  {featureOptions.map((feature) => (
                    <button
                      key={feature}
                      onClick={() => toggleFeature(feature)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        propertyDetails.features.includes(feature)
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                          : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-70"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>Generate Description</span>
                  </>
                )}
              </button>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
            </div>
          </div>

          {/* Right Column - Photos & Output */}
          <div className="space-y-6">
            {/* Photo Upload Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" />
                Listing Photos
                <span className="text-sm font-normal text-gray-500">(at least 1 required)</span>
              </h2>

              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Click to upload photos</p>
                <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB each (max 10 photos)</p>
              </div>

              {/* Photo Previews */}
              {photos.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group aspect-square">
                      <Image
                        src={photo.preview}
                        alt={`Property photo ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      {index === 0 && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500 text-white text-xs font-medium rounded">
                          Cover
                        </span>
                      )}
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500 mt-3">
                {photos.length}/10 photos uploaded
              </p>
            </div>

            {/* Generated Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Generated Description
                </h2>
                {generatedDescription && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {generatedDescription ? (
                <div className="prose prose-gray max-w-none">
                  <div className="bg-gray-50 rounded-xl p-6 whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {generatedDescription}
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors disabled:opacity-70"
                    >
                      <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
                      Regenerate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-gray-400">
                  <Sparkles className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-center">
                    Fill in the property details and click
                    <br />
                    <strong>&quot;Generate Description&quot;</strong> to create your listing
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Please fix the following errors:</h4>
                <ul className="mt-2 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm text-red-600">• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Create Listing Button */}
        <div className="mt-8">
          {listingCreated ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-emerald-800">Listing Created Successfully!</h3>
              <p className="text-emerald-600 mt-1">Your property listing has been saved and is ready for review.</p>
            </div>
          ) : (
            <button
              onClick={handleCreateListing}
              disabled={isCreating}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-70"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Creating Listing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Create Listing</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-purple-100">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Building className="w-5 h-5 text-purple-600" />
            Tips for Better Descriptions
          </h3>
          <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              Include the neighborhood name for local appeal
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              Select features that make your property stand out
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              Choose a style that matches your target buyer
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              Regenerate to get different variations
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
