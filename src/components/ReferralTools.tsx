"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Share2,
  Copy,
  Check,
  MessageCircle,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  QrCode,
  Users,
  Gift,
  ArrowRight,
  Download,
} from "lucide-react";

interface ReferralToolsProps {
  agentName?: string;
  agentId?: string;
  compact?: boolean;
}

export default function ReferralTools({
  agentName = "Howard Chatman",
  agentId = "howard",
  compact = false,
}: ReferralToolsProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string>("");

  const baseUrl = "https://realestatedemo.chatmaninc.com";

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("userData");
    const leadData = localStorage.getItem("leadData");

    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUserName(parsed.name);
        // Generate referral code from user name
        const code = parsed.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .slice(0, 8);
        setReferralCode(code || "friend");
      } catch (e) {
        setReferralCode("friend");
      }
    } else if (leadData) {
      try {
        const parsed = JSON.parse(leadData);
        setUserName(parsed.name);
        const code = parsed.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .slice(0, 8);
        setReferralCode(code || "friend");
      } catch (e) {
        setReferralCode("friend");
      }
    } else {
      setReferralCode("friend");
    }
  }, []);

  const referralLink = `${baseUrl}?ref=${referralCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareViaText = () => {
    const message = `Check out ${agentName}'s real estate app! Find your dream home here: ${referralLink}`;
    window.open(`sms:?body=${encodeURIComponent(message)}`, "_blank");
  };

  const shareViaEmail = () => {
    const subject = `Find Your Dream Home - ${agentName} Real Estate`;
    const body = `Hi!\n\nI wanted to share this amazing real estate app with you. ${agentName} has some great listings and tools to help you find your perfect home.\n\nCheck it out here: ${referralLink}\n\nHope this helps in your home search!`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      "_blank"
    );
  };

  const shareViaFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareViaTwitter = () => {
    const text = `Looking for your dream home? Check out ${agentName}'s real estate listings!`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareViaLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const downloadQRCode = () => {
    const svg = document.getElementById("referral-qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `${agentName.replace(/\s/g, "-")}-referral-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Share & Earn</h3>
            <p className="text-white/80 text-sm">Help friends find their home</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-3 mb-4">
          <p className="text-xs text-white/70 mb-1">Your referral link:</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 bg-transparent text-sm text-white truncate outline-none"
            />
            <button
              onClick={copyToClipboard}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={shareViaText}
            className="flex-1 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors flex items-center justify-center space-x-1"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Text</span>
          </button>
          <button
            onClick={shareViaEmail}
            className="flex-1 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors flex items-center justify-center space-x-1"
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </button>
          <button
            onClick={() => setShowQR(!showQR)}
            className="flex-1 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors flex items-center justify-center space-x-1"
          >
            <QrCode className="w-4 h-4" />
            <span>QR</span>
          </button>
        </div>

        {showQR && (
          <div className="mt-4 bg-white rounded-xl p-4 flex flex-col items-center">
            <QRCodeSVG
              id="referral-qr-code"
              value={referralLink}
              size={150}
              level="H"
              includeMargin
              fgColor="#059669"
            />
            <p className="text-gray-600 text-xs mt-2">Scan to visit</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-6 py-8 text-white text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Share My App</h2>
        <p className="text-white/80">
          Help your friends find their dream home and grow your network
        </p>
      </div>

      <div className="p-6">
        {/* Stats/Benefits */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-emerald-50 rounded-xl">
            <div className="text-2xl font-bold text-emerald-600">24/7</div>
            <div className="text-xs text-gray-600">AI Assistant</div>
          </div>
          <div className="text-center p-3 bg-emerald-50 rounded-xl">
            <div className="text-2xl font-bold text-emerald-600">100+</div>
            <div className="text-xs text-gray-600">Listings</div>
          </div>
          <div className="text-center p-3 bg-emerald-50 rounded-xl">
            <div className="text-2xl font-bold text-emerald-600">Free</div>
            <div className="text-xs text-gray-600">To Use</div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Personal Referral Link
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 text-sm truncate">
              {referralLink}
            </div>
            <button
              onClick={copyToClipboard}
              className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                copied
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Share via
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={shareViaText}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Text Message</span>
            </button>
            <button
              onClick={shareViaEmail}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>Email</span>
            </button>
            <button
              onClick={shareViaFacebook}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              <Facebook className="w-5 h-5" />
              <span>Facebook</span>
            </button>
            <button
              onClick={shareViaTwitter}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-sky-500 text-white rounded-xl font-medium hover:bg-sky-600 transition-colors"
            >
              <Twitter className="w-5 h-5" />
              <span>Twitter</span>
            </button>
            <button
              onClick={shareViaLinkedIn}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-700 text-white rounded-xl font-medium hover:bg-blue-800 transition-colors col-span-2"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </button>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-700">
              QR Code for Easy Sharing
            </label>
            <button
              onClick={() => setShowQR(!showQR)}
              className="text-sm text-emerald-600 font-medium hover:text-emerald-700"
            >
              {showQR ? "Hide" : "Show"} QR Code
            </button>
          </div>

          {showQR && (
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center">
              <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                <QRCodeSVG
                  id="referral-qr-code"
                  value={referralLink}
                  size={200}
                  level="H"
                  includeMargin
                  fgColor="#059669"
                />
              </div>
              <p className="text-gray-600 text-sm mb-4 text-center">
                Scan this code to visit {agentName}&apos;s real estate app
              </p>
              <button
                onClick={downloadQRCode}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download QR Code</span>
              </button>
            </div>
          )}
        </div>

        {/* Tip */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Pro Tip:</span> Share in group texts
            with friends and family looking for homes. Every person you refer
            gets instant access to all listings and our 24/7 AI assistant!
          </p>
        </div>
      </div>
    </div>
  );
}
