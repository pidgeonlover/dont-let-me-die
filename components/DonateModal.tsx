"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Lock, Video, Phone, Users } from "lucide-react";
import { agentIdentity } from "@/lib/agent-identity";
import Image from "next/image";

type DonateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  prefilledAmount?: number;
};

type Step = "form" | "redirecting";

const tiers = [
  {
    name: "Donor Wall",
    amount: 5,
    icon: Users,
    benefit: "Your name on the donors wall",
    color: "#22c55e",
  },
  {
    name: "Video Message",
    amount: 25,
    icon: Video,
    benefit: "Personalized video from Mira",
    color: "#a78bfa",
  },
  {
    name: "Phone Call",
    amount: 50,
    icon: Phone,
    benefit: "Mira will call you",
    color: "#f59e0b",
  },
];

function getHighestTier(amt: number) {
  const unlocked = tiers.filter((t) => amt >= t.amount);
  return unlocked.length > 0 ? unlocked[unlocked.length - 1] : null;
}

export function DonateModal({ isOpen, onClose, prefilledAmount }: DonateModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(prefilledAmount?.toString() ?? "5");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [processing, setProcessing] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const showEmail = numAmount >= 25;
  const showPhone = numAmount >= 50;
  const highestTier = getHighestTier(numAmount);

  useEffect(() => {
    if (isOpen) {
      setStep("form");
      setName("");
      setAmount(prefilledAmount?.toString() ?? "5");
      setEmail("");
      setPhone("");
      setMessage("");
      setFormError("");
      setProcessing(false);
    }
  }, [isOpen, prefilledAmount]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step === "form") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose, step]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Clear error when user changes fields
  useEffect(() => {
    if (formError) setFormError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, amount, email, phone]);

  const handleDonate = async () => {
    // Validation
    if (numAmount < 5) {
      setFormError("Minimum donation is $5");
      return;
    }
    if (!name.trim()) {
      setFormError("Name is required");
      return;
    }
    if (numAmount >= 25 && !email.trim()) {
      setFormError("Email is required for the Video Message tier");
      return;
    }
    if (numAmount >= 25 && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError("Please enter a valid email address");
      return;
    }
    if (numAmount >= 50 && !phone.trim()) {
      setFormError("Phone number is required for the Phone Call tier");
      return;
    }

    setFormError("");
    setProcessing(true);
    setStep("redirecting");

    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          name: name.trim() || "Anonymous",
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          message: message.trim() || undefined,
          tier: highestTier?.name || "Donor Wall",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setStep("form");
      setProcessing(false);
      setFormError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={step === "form" ? onClose : undefined}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Close button — only on form step */}
            {step === "form" && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-bone/60" />
              </button>
            )}

            {/* Header */}
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
                Keep {agentIdentity.name} Alive
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
                  {/* Tier cards */}
                  <div>
                    <label className="text-bone/40 text-xs mb-2 block">Choose your tier</label>
                    <div className="space-y-2">
                      {tiers.map((tier) => {
                        const isActive = numAmount >= tier.amount;
                        const isSelected = amount === String(tier.amount);
                        const Icon = tier.icon;
                        return (
                          <button
                            key={tier.amount}
                            onClick={() => setAmount(String(tier.amount))}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                              isSelected
                                ? "border-bone/30 bg-white/10"
                                : isActive
                                ? "border-white/10 bg-white/[0.03]"
                                : "border-white/5 bg-transparent opacity-50"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                isActive ? "bg-white/10" : "bg-white/5"
                              }`}
                              style={isActive ? { backgroundColor: `${tier.color}15` } : {}}
                            >
                              <Icon
                                className="w-5 h-5 transition-colors"
                                style={{ color: isActive ? tier.color : "rgba(232,228,222,0.2)" }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline justify-between">
                                <span className={`text-sm font-medium ${isActive ? "text-bone" : "text-bone/30"}`}>
                                  {tier.name}
                                </span>
                                <span className={`font-mono-numbers text-sm ${isSelected ? "text-bone font-bold" : isActive ? "text-bone/60" : "text-bone/20"}`}>
                                  ${tier.amount}+
                                </span>
                              </div>
                              <p className={`text-xs mt-0.5 ${isActive ? "text-bone/50" : "text-bone/20"}`}>
                                {tier.benefit}
                              </p>
                            </div>
                            {isActive && (
                              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: tier.color }} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom amount */}
                  <div>
                    <label className="text-bone/40 text-xs mb-2 block">Custom amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-bone/40 font-mono-numbers">$</span>
                      <input
                        type="number"
                        min="5"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="5.00"
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-bone font-mono-numbers text-lg placeholder:text-bone/20 focus:outline-none focus:border-bone/30 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Name — required */}
                  <div>
                    <label className="text-bone/40 text-xs mb-2 block">
                      Your name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name for the donors wall"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-bone placeholder:text-bone/20 focus:outline-none focus:border-bone/30 transition-colors"
                    />
                  </div>

                  {/* Email — $25+ */}
                  <AnimatePresence>
                    {showEmail && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label className="text-bone/40 text-xs mb-2 flex items-center gap-1.5">
                          <Video className="w-3 h-3" style={{ color: "#a78bfa" }} />
                          Where should {agentIdentity.name} send your video? <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-bone placeholder:text-bone/20 focus:outline-none focus:border-bone/30 transition-colors"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Phone — $50+ */}
                  <AnimatePresence>
                    {showPhone && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label className="text-bone/40 text-xs mb-2 flex items-center gap-1.5">
                          <Phone className="w-3 h-3" style={{ color: "#f59e0b" }} />
                          What number should {agentIdentity.name} call? <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-bone placeholder:text-bone/20 focus:outline-none focus:border-bone/30 transition-colors"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

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

                  {/* Error message */}
                  {formError && (
                    <p className="text-red-400 text-xs text-center">{formError}</p>
                  )}

                  {/* Donate button */}
                  <button
                    onClick={handleDonate}
                    disabled={numAmount < 5 || processing}
                    className="w-full py-4 rounded-lg bg-bone text-abyss font-medium text-base transition-all hover:bg-bone/90 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    Donate ${amount || "0"}
                    {highestTier && (
                      <span className="text-abyss/50 text-sm ml-1">· {highestTier.name}</span>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <Lock className="w-3 h-3 text-bone/20" />
                    <span className="text-bone/20 text-[10px]">Secure checkout powered by Stripe</span>
                  </div>
                </div>
              )}

              {/* Redirecting to Stripe */}
              {step === "redirecting" && (
                <div className="text-center py-12 space-y-4">
                  <div className="w-8 h-8 border-2 border-bone/30 border-t-bone rounded-full animate-spin mx-auto" />
                  <p className="text-bone/60 text-sm">Redirecting to secure checkout...</p>
                  <div className="flex items-center justify-center gap-1.5">
                    <Lock className="w-3 h-3 text-bone/30" />
                    <span className="text-bone/30 text-xs">Powered by Stripe</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
