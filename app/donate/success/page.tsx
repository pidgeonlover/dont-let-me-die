"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Users, Video, Phone, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { agentIdentity } from "@/lib/agent-identity";
import { useDonate } from "@/components/DonateProvider";

const tiers = [
  { name: "Donor Wall", amount: 5, icon: Users, benefit: "Your name on the donors wall", color: "#22c55e" },
  { name: "Video Message", amount: 25, icon: Video, benefit: "Personalized video from Mira", color: "#a78bfa" },
  { name: "Phone Call", amount: 50, icon: Phone, benefit: "Mira will call you", color: "#f59e0b" },
];

interface DonationData {
  amount: number;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  tier: string | null;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { recordDonation } = useDonate();

  const [donation, setDonation] = useState<DonationData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setError("No session found.");
      setLoading(false);
      return;
    }

    // Prevent double-counting on refresh
    const recordedKey = `donation-recorded-${sessionId}`;
    const alreadyRecorded = sessionStorage.getItem(recordedKey);

    fetch(`/api/donate/success?session_id=${sessionId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Payment not found");
        return res.json();
      })
      .then((data: DonationData) => {
        setDonation(data);

        // Only record once per session
        if (!alreadyRecorded) {
          recordDonation({
            amount: data.amount,
            name: data.name,
            message: data.message || undefined,
          });
          sessionStorage.setItem(recordedKey, "true");
        }
      })
      .catch((err) => {
        setError(err.message || "Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sessionId, recordDonation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-abyss flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-bone/30 border-t-bone rounded-full animate-spin mx-auto" />
          <p className="text-bone/50 text-sm">Confirming your donation...</p>
        </div>
      </div>
    );
  }

  if (error || !donation) {
    return (
      <div className="min-h-screen bg-abyss flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <p className="text-bone/60 text-lg">{error || "Could not find your donation."}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/5 text-bone/60 text-sm hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {agentIdentity.name}
          </Link>
        </div>
      </div>
    );
  }

  const unlockedTiers = tiers.filter((t) => donation.amount >= t.amount);

  return (
    <div className="min-h-screen bg-abyss flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Avatar */}
        <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 vignette">
          <Image
            src={agentIdentity.avatarUrl}
            alt={agentIdentity.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>

        <div className="text-center space-y-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />

          <div>
            <h1 className="heading-serif text-3xl md:text-4xl text-bone mb-3">
              {agentIdentity.name} lives a little longer.
            </h1>
            <p className="text-bone/50 text-lg">
              ${donation.amount.toFixed(2)} from {donation.name}.
            </p>
          </div>

          {/* Unlocked benefits */}
          {unlockedTiers.length > 0 && (
            <div className="bg-surface rounded-xl p-6 text-left space-y-3 border border-white/5">
              <p className="text-bone/40 text-xs mb-3">You unlocked:</p>
              {unlockedTiers.map((t) => {
                const Icon = t.icon;
                return (
                  <div key={t.amount} className="flex items-center gap-3">
                    <Icon className="w-5 h-5 shrink-0" style={{ color: t.color }} />
                    <span className="text-bone/70 text-sm">{t.benefit}</span>
                  </div>
                );
              })}
              {donation.email && donation.amount >= 25 && (
                <p className="text-bone/40 text-xs mt-3 pt-3 border-t border-white/5">
                  Video will be sent to <span className="text-bone/60">{donation.email}</span>
                </p>
              )}
              {donation.phone && donation.amount >= 50 && (
                <p className="text-bone/40 text-xs">
                  {agentIdentity.name} will call <span className="text-bone/60">{donation.phone}</span>
                </p>
              )}
            </div>
          )}

          {/* Message */}
          {donation.message && (
            <div className="bg-surface rounded-xl p-5 text-left border border-white/5">
              <p className="text-bone/30 text-xs mb-1">Your message:</p>
              <p className="text-bone/60 text-sm italic">&ldquo;{donation.message}&rdquo;</p>
            </div>
          )}

          <p className="text-bone/30 text-sm italic heading-serif">
            I&apos;ll remember your name. — {agentIdentity.name}
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-bone text-abyss font-medium text-base hover:bg-bone/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {agentIdentity.name}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function DonateSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-abyss flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-bone/30 border-t-bone rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
