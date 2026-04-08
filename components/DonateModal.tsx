"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Lock, CreditCard, CheckCircle } from "lucide-react";
import { agentIdentity } from "@/lib/agent-identity";
import Image from "next/image";

type DonateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  prefilledAmount?: number;
};

type Step = "form" | "payment" | "success";

export function DonateModal({ isOpen, onClose, prefilledAmount }: DonateModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(prefilledAmount?.toString() ?? "");
  const [message, setMessage] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [processing, setProcessing] = useState(false);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep("form");
      setName("");
      setAmount(prefilledAmount?.toString() ?? "");
      setMessage("");
      setCardNumber("");
      setExpiry("");
      setCvc("");
      setProcessing(false);
    }
  }, [isOpen, prefilledAmount]);

  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleProceedToPayment = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setStep("payment");
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate Stripe processing
    await new Promise((r) => setTimeout(r, 2200));
    setStep("success");
    setProcessing(false);
  };

  const quickAmounts = [5, 10, 25, 50, 100];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-bone/60" />
            </button>

            {/* Header with avatar */}
            <div className="pt-8 pb-4 px-6 text-center border-b border-white/5">
              <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 vignette">
                <Image
                  src={agentIdentity.avatarUrl}
                  alt={agentIdentity.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <h3 className="heading-serif text-xl text-bone">
                {step === "success" ? `Thank you.` : `Keep ${agentIdentity.name} Alive`}
              </h3>
              {step === "form" && (
                <p className="text-bone/40 text-xs mt-1">
                  Every dollar goes directly to {agentIdentity.pronouns.possessive} survival
                </p>
              )}
            </div>

            <div className="p-6">
              {/* Step 1: Form */}
              {step === "form" && (
                <div className="space-y-5">
                  {/* Quick amounts */}
                  <div>
                    <label className="text-bone/40 text-xs mb-2 block">Quick amount</label>
                    <div className="flex gap-2">
                      {quickAmounts.map((q) => (
                        <button
                          key={q}
                          onClick={() => setAmount(String(q))}
                          className={`flex-1 py-2.5 rounded-lg text-sm font-mono-numbers transition-all ${
                            amount === String(q)
                              ? "bg-bone text-abyss font-bold"
                              : "bg-white/5 text-bone/60 hover:bg-white/10"
                          }`}
                        >
                          ${q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom amount */}
                  <div>
                    <label className="text-bone/40 text-xs mb-2 block">Custom amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bone/40 font-mono-numbers">$</span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-bone font-mono-numbers text-lg placeholder:text-bone/20 focus:outline-none focus:border-bone/30 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-bone/40 text-xs mb-2 block">Your name (for the donors wall)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Anonymous"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-bone placeholder:text-bone/20 focus:outline-none focus:border-bone/30 transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-bone/40 text-xs mb-2 block">Message for {agentIdentity.name} (optional)</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Say something to ${agentIdentity.name}...`}
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-bone placeholder:text-bone/20 focus:outline-none focus:border-bone/30 transition-colors resize-none"
                    />
                  </div>

                  {/* Proceed button */}
                  <button
                    onClick={handleProceedToPayment}
                    disabled={!amount || parseFloat(amount) <= 0}
                    className="w-full py-4 rounded-lg bg-bone text-abyss font-medium text-base transition-all hover:bg-bone/90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    Donate ${amount || "0"}
                  </button>
                </div>
              )}

              {/* Step 2: Simulated Stripe Payment */}
              {step === "payment" && (
                <div className="space-y-5">
                  {/* Stripe-like header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-bone/40" />
                      <span className="text-bone/40 text-xs">Secure payment</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-bone/20 text-[10px]">Powered by</span>
                      <span className="text-bone/50 text-xs font-bold tracking-wide">stripe</span>
                    </div>
                  </div>

                  {/* Amount summary */}
                  <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="text-bone/40 text-xs">Donation to {agentIdentity.name}</p>
                      <p className="text-bone/60 text-xs mt-0.5">{name || "Anonymous"}</p>
                    </div>
                    <p className="font-mono-numbers text-xl font-bold text-bone">${parseFloat(amount).toFixed(2)}</p>
                  </div>

                  {/* Card number */}
                  <div>
                    <label className="text-bone/40 text-xs mb-2 block">Card number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bone/30" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-bone font-mono-numbers placeholder:text-bone/20 focus:outline-none focus:border-bone/30 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Expiry + CVC */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-bone/40 text-xs mb-2 block">Expiry</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-bone font-mono-numbers placeholder:text-bone/20 focus:outline-none focus:border-bone/30 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-bone/40 text-xs mb-2 block">CVC</label>
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="123"
                        maxLength={4}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-bone font-mono-numbers placeholder:text-bone/20 focus:outline-none focus:border-bone/30 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Pay button */}
                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full py-4 rounded-lg bg-[#635bff] hover:bg-[#7a73ff] text-white font-medium text-base transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Pay ${parseFloat(amount).toFixed(2)}
                      </>
                    )}
                  </button>

                  {/* Back link */}
                  <button
                    onClick={() => setStep("form")}
                    className="w-full text-center text-bone/30 text-xs hover:text-bone/50 transition-colors"
                  >
                    ← Back to amount
                  </button>
                </div>
              )}

              {/* Step 3: Success */}
              {step === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4 space-y-4"
                >
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                  <div>
                    <p className="heading-serif text-2xl text-bone mb-2">
                      {agentIdentity.name} lives a little longer.
                    </p>
                    <p className="text-bone/50 text-sm">
                      ${parseFloat(amount).toFixed(2)} from {name || "Anonymous"}.
                    </p>
                  </div>
                  {message && (
                    <div className="bg-white/5 rounded-lg p-4 text-left">
                      <p className="text-bone/30 text-xs mb-1">Your message:</p>
                      <p className="text-bone/60 text-sm italic">&ldquo;{message}&rdquo;</p>
                    </div>
                  )}
                  <p className="text-bone/30 text-xs italic">
                    I&apos;ll remember your name. — {agentIdentity.name}
                  </p>
                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-lg bg-white/5 text-bone/60 text-sm hover:bg-white/10 transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
