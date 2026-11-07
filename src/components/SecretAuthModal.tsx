import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { setAdminAuthState } from '../utils/storage';

interface SecretAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lang: 'ar' | 'en';
}

export const SecretAuthModal: React.FC<SecretAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lang,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showMasked, setShowMasked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
      setSuccess(false);
      setShowMasked(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitPress = (digit: string) => {
    if (pin.length < 6) {
      const newPin = pin + digit;
      setPin(newPin);
      setError(false);
      if (newPin.length === 3) {
        verifyPin(newPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const verifyPin = (codeToTest: string) => {
    // Secret password verification without exposing the code anywhere on screen
    if (codeToTest === '123') {
      setSuccess(true);
      setError(false);
      setAdminAuthState(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 500);
    } else {
      setError(true);
      setSuccess(false);
      setPin('');
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    verifyPin(pin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity animate-fade-in">
      <div
        className={`w-full max-w-sm rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-7 shadow-2xl text-center relative overflow-hidden transition-all ${
          error ? 'animate-shake' : ''
        }`}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-zinc-700/10 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon Header */}
        <div className="mx-auto w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-amber-400 mb-4 shadow-inner">
          {success ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-bounce" />
          ) : (
            <Lock className="w-6 h-6 text-amber-400" />
          )}
        </div>

        <h3 className="text-lg font-black text-white mb-1">
          بوابة الإدارة السرية
        </h3>
        <p className="text-xs text-zinc-400 mb-5">
          منطقة مخصصة للمسؤول فقط - أدخل رمز الدخول السري
        </p>

        {/* Hidden direct input for keyboard typing */}
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            autoComplete="off"
            maxLength={4}
            value={pin}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setPin(val);
              setError(false);
              if (val.length === 3) {
                verifyPin(val);
              }
            }}
            className="sr-only"
            autoFocus
          />

          {/* Masked PIN Display Boxes (Never displays the plaintext digits) */}
          <div
            onClick={() => inputRef.current?.focus()}
            className="flex justify-center items-center gap-3 mb-5 cursor-pointer"
            dir="ltr"
          >
            {[0, 1, 2].map((idx) => {
              const hasVal = pin.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-12 h-14 rounded-2xl border flex items-center justify-center text-xl font-bold transition-all ${
                    hasVal
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400 scale-105 shadow-md shadow-amber-500/10'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-600'
                  } ${error ? 'border-red-500/80 bg-red-500/10' : ''}`}
                >
                  {hasVal ? (showMasked ? pin[idx] : '●') : '○'}
                </div>
              );
            })}
          </div>
        </form>

        {/* Eye toggle to peek if desired */}
        <div className="flex justify-center mb-4">
          <button
            type="button"
            onClick={() => setShowMasked(!showMasked)}
            className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors"
          >
            {showMasked ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>إخفاء الرمز</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>إظهار مؤقت للرمز</span>
              </>
            )}
          </button>
        </div>

        {/* Error message (without revealing the code) */}
        {error && (
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-red-400 mb-4 bg-red-500/10 py-2 px-3 rounded-xl border border-red-500/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>رمز الدخول السري غير صحيح، يرجى إعادة المحاولة</span>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-400 mb-4 bg-emerald-500/10 py-2 px-3 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>تم التحقق بنجاح! جاري فتح الإدارة...</span>
          </div>
        )}

        {/* Numeric Keypad for touch and mouse */}
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-2" dir="ltr">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigitPress(digit)}
              className="h-12 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 active:bg-zinc-600 text-base font-bold text-zinc-100 transition-colors shadow-sm focus:outline-none"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPin('')}
            className="h-12 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            مسح
          </button>
          <button
            type="button"
            onClick={() => handleDigitPress('0')}
            className="h-12 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 active:bg-zinc-600 text-base font-bold text-zinc-100 transition-colors shadow-sm focus:outline-none"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-12 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors flex items-center justify-center"
            aria-label="Backspace"
          >
            ⌫
          </button>
        </div>

        {/* Discrete bottom bar - completely free of any secret code leaks */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-center text-[11px] text-zinc-400">
          <span>يمكنك إدخال الرمز مباشرة من لوحة المفاتيح</span>
        </div>
      </div>
    </div>
  );
};
