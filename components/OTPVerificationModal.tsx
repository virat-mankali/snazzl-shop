'use client';

import { useState, useRef, useEffect } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  onVerify: (otp: string) => Promise<{ success: boolean; message: string }>;
}

export default function OTPVerificationModal({
  isOpen,
  onClose,
  orderId,
  onVerify,
}: OTPVerificationModalProps) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (isOpen) {
      // Focus first input when modal opens
      inputRefs.current[0]?.focus();
      // Reset state
      setOtp(['', '', '', '']);
      setVerificationStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 4; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      setErrorMessage('Please enter all 4 digits');
      return;
    }

    setIsVerifying(true);
    setVerificationStatus('idle');
    setErrorMessage('');

    try {
      const result = await onVerify(otpString);
      if (result.success) {
        setVerificationStatus('success');
        // Close modal after 1.5 seconds
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setVerificationStatus('error');
        setErrorMessage(result.message);
        // Clear OTP for retry
        setOtp(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setVerificationStatus('error');
      setErrorMessage('Verification failed. Please try again.');
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-500 transition-colors"
          disabled={isVerifying}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#F8EEE8] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="text-2xl font-bold text-[#171719] mb-2">Verify OTP</h2>
          <p className="text-slate-500 text-sm">
            Enter the 4-digit OTP provided by the delivery agent
          </p>
          <p className="text-slate-500 text-xs mt-2">
            Order ID: <span className="font-mono font-semibold">{orderId}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <div className="flex gap-3 justify-center mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={isVerifying || verificationStatus === 'success'}
                className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl transition-all
                  ${verificationStatus === 'success'
                    ? 'border-[#A3B18A] bg-[#EDF2E8] text-[#5C7251]'
                    : verificationStatus === 'error'
                    ? 'border-[#DB8585] bg-[#F7E4E4] text-[#C86565] animate-shake'
                    : 'border-slate-200 focus:border-[#D4A373] focus:ring-2 focus:ring-[#F3E7D7]'
                  }
                  ${isVerifying ? 'opacity-50 cursor-not-allowed' : ''}
                  outline-none`}
              />
            ))}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 text-[#C86565] text-sm justify-center animate-in fade-in slide-in-from-top-2">
              <XCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {verificationStatus === 'success' && (
          <div className="mb-6 p-4 bg-[#EDF2E8] border border-[#DDE5D6] rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle className="text-[#5C7251]" size={24} />
            <div>
              <p className="text-[#5C7251] font-semibold">Verified Successfully!</p>
              <p className="text-[#5C7251] text-sm">Order handed to delivery agent</p>
            </div>
          </div>
        )}

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={otp.join('').length !== 4 || isVerifying || verificationStatus === 'success'}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all
            ${otp.join('').length === 4 && verificationStatus !== 'success'
              ? 'bg-[#171719] hover:bg-[#2A2A2D] active:scale-95'
              : 'bg-slate-300 cursor-not-allowed'
            }
            ${isVerifying ? 'opacity-75' : ''}
          `}
        >
          {isVerifying ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Verifying...
            </span>
          ) : verificationStatus === 'success' ? (
            'Verified ✓'
          ) : (
            'Verify OTP'
          )}
        </button>

        {/* Helper Text */}
        <p className="text-center text-xs text-slate-500 mt-4">
          The delivery agent will provide the OTP when picking up the order
        </p>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
