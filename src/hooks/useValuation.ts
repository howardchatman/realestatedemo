"use client";

import { useState, useCallback } from 'react';

export interface ValuationResult {
  address: string;
  estimated_value: number;
  low_estimate: number;
  high_estimate: number;
  confidence: 'high' | 'medium' | 'low';
  market_trend: number;
  comparable_count: number;
  formatted: {
    estimated: string;
    low: string;
    high: string;
    trend: string;
  };
}

export interface LeadData {
  name: string;
  email: string;
  phone: string;
}

export interface UseValuationReturn {
  valuation: ValuationResult | null;
  isLoading: boolean;
  error: string | null;
  fetchValuation: (address: string) => Promise<ValuationResult | null>;
  submitWithLead: (leadData: LeadData) => Promise<boolean>;
  reset: () => void;
  address: string;
}

export function useValuation(): UseValuationReturn {
  const [address, setAddress] = useState('');
  const [valuation, setValuation] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchValuation = useCallback(async (inputAddress: string): Promise<ValuationResult | null> => {
    if (!inputAddress.trim()) {
      setError('Please enter an address');
      return null;
    }

    setIsLoading(true);
    setError(null);
    setAddress(inputAddress);

    try {
      const response = await fetch('/api/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: inputAddress }),
      });

      const data = await response.json();

      if (data.success) {
        setValuation(data.data);
        return data.data;
      } else {
        setError(data.error || 'Failed to get valuation');
        return null;
      }
    } catch (err) {
      console.error('Valuation error:', err);
      setError('Network error. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitWithLead = useCallback(async (leadData: LeadData): Promise<boolean> => {
    if (!address || !valuation) {
      setError('No valuation to submit');
      return false;
    }

    try {
      const response = await fetch('/api/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store in localStorage for tracking
        const valuationData = {
          address,
          valuation,
          leadData: {
            name: leadData.name,
            email: leadData.email,
          },
          capturedAt: new Date().toISOString(),
        };
        localStorage.setItem('lastValuation', JSON.stringify(valuationData));
        localStorage.setItem('valuationLeadCaptured', 'true');
        return true;
      } else {
        setError(data.error || 'Failed to submit');
        return false;
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Network error. Please try again.');
      return false;
    }
  }, [address, valuation]);

  const reset = useCallback(() => {
    setValuation(null);
    setAddress('');
    setError(null);
  }, []);

  return {
    valuation,
    isLoading,
    error,
    fetchValuation,
    submitWithLead,
    reset,
    address,
  };
}
