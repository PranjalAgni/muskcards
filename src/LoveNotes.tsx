import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./components/Button";
import {
  Heart,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

/**
 * 💌 Love Notes – fancy card edition + handwriting font (with debug logs)
 * + Private entrance screen (password gate)
 *
 * Notes:
 * - Password is set to "forever" (can be changed in getExpectedPassword function)
 * - Unlock state persists in localStorage (key: love:unlocked)
 */

// ------------------- Content ----------------------------------------------
const NOTES: string[] = [
  "Hey love ✨\nBefore anything else… take a deep breath. This little page is just for you.",
  "I love the way you laugh — it’s like a tiny sunrise I get to keep in my pocket ☀️",
  "Thank you for being my calm on loud days and my cheer on quiet ones 💛",
  "Every small moment with you feels like a favorite song on repeat 🎵",
  "You make ordinary days feel like confetti — soft, bright, and a little bit magical 🎊",
  "I’m proud of you. For the big wins, sure — but mostly for the tiny brave steps no one sees.",
  "Here’s a secret: I still get butterflies when I see your name pop up 🦋",
  "No matter where we are, you’re my home. Always. 🏡",
  "P.S. This is me saying it again (and again): I love you. A lot. ♾️💖",
];

// ------------------- Utilities -------------------------------------------
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));
function cn(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}

// Password for the love notes
function getExpectedPassword(): string {
  return "muskuuu";
}

// ------------------- Load handwriting Google Fonts -----------------------
function useHandwritingFonts() {
  useEffect(() => {
    if (document.getElementById("love-notes-fonts")) {
      return;
    }
    const link = document.createElement("link");
    link.id = "love-notes-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Patrick+Hand&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ------------------- Internal Card Shell -------------------
function CardShell({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "relative rounded-[22px] border border-rose-100/70 bg-white shadow-2xl",
        "[box-shadow:0_10px_30px_rgba(244,63,94,0.10),0_4px_10px_rgba(0,0,0,0.05)]",
        "bg-[radial-gradient(120%_80%_at_50%_0%,#fff_0%,#fff7f9_60%,#fff0f3_100%)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-white/60" />
      <div className="pointer-events-none absolute inset-0 rounded-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]" />
      <div
        className={cn(
          "absolute -top-3 left-1/2 -translate-x-1/2 rotate-[-3deg]",
          "h-6 w-28 rounded-sm opacity-80",
          "bg-[repeating-linear-gradient(45deg,#fce7f3_0_6px,#ffe4e6_6px_12px)]",
          "shadow"
        )}
      />
      {children}
    </div>
  );
}

function CardBody({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "p-6 sm:p-7 relative overflow-hidden rounded-[22px]",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[repeating-linear-gradient(0deg,transparent_0,transparent_26px,rgba(244,114,182,0.08)_27px)]",
        className
      )}
    >
      {children}
    </div>
  );
}

// ------------------- Background Hearts -------------------
function HeartBackground() {
  const particles = useMemo(() => {
    const items = Array.from({ length: 60 }, (_, i) => i);
    return items;
  }, []);
  const colors = [
    "text-rose-300",
    "text-pink-300",
    "text-rose-400",
    "text-pink-400",
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-rose-50 via-pink-50 to-white" />
      {particles.map((i) => {
        const delay = Math.random() * 6;
        const duration = 11 + Math.random() * 18;
        const color = colors[i % colors.length];
        const left = Math.random() * 100;
        const startY = 900 + Math.random() * 100; // deeper start, drifts into view near cards
        const size = 6 + Math.random() * 12;
        const drift = Math.random() * 30 - 15;
        return (
          <motion.div
            key={i}
            className={`absolute opacity-40 ${color}`}
            style={{ left: `${left}%` }}
            initial={{
              y: `${startY}%`,
              x: 0,
              scale: 0.7 + Math.random() * 0.7,
              rotate: 0,
            }}
            animate={{ y: "-40%", x: drift, rotate: 15 }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
            onUpdate={(latest: unknown) => {
              const y = (latest as Record<string, unknown>)?.y as number | undefined;
              if (
                typeof y === "number" &&
                Math.abs(Math.floor(y) % 200) === 0
              ) {
                // console.log("[hearts] anim y", y);
              }
            }}
          >
            <Heart style={{ width: `${size}px`, height: `${size}px` }} />
          </motion.div>
        );
      })}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/60 to-transparent" />
    </div>
  );
}

// ------------------- Password Gate ---------------------------------------
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const EXPECTED = getExpectedPassword();

  useEffect(() => {
    const unlocked = localStorage.getItem("love:unlocked");
    if (unlocked === "true") onUnlock();
  }, [onUnlock]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = pwd.trim() === EXPECTED;
    if (ok) {
      localStorage.setItem("love:unlocked", "true");
      onUnlock();
    } else {
      setError("That’s not it — try again 💗");
    }
  };

  return (
    <div className="relative z-10 mx-auto flex h-dvh max-w-sm flex-col items-stretch px-4 pb-10 overflow-hidden">
      <div className="flex-1 grid place-items-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="w-full"
        >
          <CardShell>
            <CardBody>
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 inline-flex items-center gap-2 text-rose-500">
                  <Lock className="h-5 w-5" />
                  <span className="text-sm">only you can open this</span>
                </div>
                <h2
                  className="mb-4 text-2xl text-rose-700"
                  style={{ fontFamily: "'Caveat','Patrick Hand',cursive" }}
                >
                  It’s a secret just for you 💞
                </h2>
                <form onSubmit={submit} className="w-full space-y-3">
                  <div className="flex rounded-xl border border-rose-200 bg-white p-2 shadow-sm text-rose-500">
                    <input
                      type={show ? "text" : "password"}
                      value={pwd}
                      onChange={(e) => setPwd(e.target.value)}
                      placeholder="Enter the secret password"
                      className="flex-1 bg-transparent px-3 py-2 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      className="px-2 text-rose-400"
                    >
                      {show ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {error && (
                    <div className="text-sm text-rose-500">{error}</div>
                  )}
                  <Button
                    className="w-full bg-rose-500 hover:bg-rose-600"
                    type="submit"
                  >
                    Unlock
                  </Button>
                </form>
              </div>
            </CardBody>
          </CardShell>
        </motion.div>
      </div>
    </div>
  );
}

// ------------------- Dev Self-Tests (no runtime behavior change) ---------
function assert(name: string, cond: boolean) {
  if (!cond) throw new Error("Test failed: " + name);
}
function runSelfTests() {
  // Utility tests
  assert("clamp core", clamp(5, 0, 10) === 5);
  assert("clamp low", clamp(-3, 0, 2) === 0);
  assert("clamp high", clamp(9, 0, 2) === 2);

  // Content tests
  assert("notes non-empty", Array.isArray(NOTES) && NOTES.length > 0);
  assert("notes are strings", typeof NOTES[0] === "string");

  // Password expectation test (should always return a non-empty string)
  const pw = getExpectedPassword();
  assert("password non-empty string", typeof pw === "string" && pw.length > 0);
}

// ------------------- Main App --------------------------------------------
export default function LoveNotesApp() {
  useHandwritingFonts();
  const [index, setIndex] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const total = NOTES.length;

  // Debug: log index & current note and run dev tests
  useEffect(() => {
    try {
      runSelfTests();
    } catch (e) {
      console.error("[tests] failed", e);
    }
  }, []);

  const next = () => {
    setIndex((i) => {
      const nv = clamp(i + 1, 0, total - 1);
      return nv;
    });
  };
  const prev = () => {
    setIndex((i) => {
      const nv = clamp(i - 1, 0, total - 1);
      return nv;
    });
  };
  const restart = () => {
    setIndex(0);
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <HeartBackground />

      {!unlocked ? (
        <PasswordGate onUnlock={() => setUnlocked(true)} />
      ) : (
        <div className="relative z-10 mx-auto flex h-dvh max-w-sm flex-col items-stretch px-4 pb-6 overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-20 -mx-4 mb-3 flex items-center justify-between bg-white/60 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-rose-100 text-rose-500">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <p className="text-xs text-rose-500">for my favorite person</p>
                <h1 className="text-lg font-semibold text-rose-500">I Love You</h1>
              </div>
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-rose-100 text-rose-500">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="flex-1 grid place-items-center">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0, rotate: -0.7 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -30, opacity: 0, rotate: 0.7 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="w-full"
              >
                <CardShell>
                  <CardBody>
                    <p
                      className="whitespace-pre-line text-balance leading-relaxed text-rose-900"
                      style={{
                        fontFamily:
                          "'Caveat', 'Patrick Hand', cursive, ui-sans-serif, system-ui",
                        fontSize: "22px",
                        lineHeight: 1.55,
                      }}
                    >
                      {NOTES[index]}
                    </p>
                  </CardBody>
                </CardShell>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-4 space-y-3">
            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5">
              {Array.from({ length: total }, (_, i) => (
                <div
                  key={i}
                  className={
                    "h-1.5 rounded-full transition-all " +
                    (i <= index ? "bg-rose-400 w-5" : "bg-rose-200 w-2")
                  }
                />
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 mb-10">
              <Button
                className="flex-1"
                variant="outline"
                onClick={prev}
                disabled={index === 0}
              >
                Back
              </Button>
              {index < total - 1 ? (
                <Button
                  className="flex-1 bg-rose-500 hover:bg-rose-600"
                  onClick={next}
                >
                  Next
                </Button>
              ) : (
                <Button
                  className="flex-1 bg-rose-500 hover:bg-rose-600"
                  onClick={restart}
                >
                  Again 💖
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
