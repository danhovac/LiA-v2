"use client";

import React, { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import SelfAssessmentPopup from "@/components/SelfAssessmentPopup";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  HeartHandshake,
  Brain,
  Pill,
  Sparkles,
  LineChart,
  ChevronRight,
  CalendarDays,
  Hourglass,
  Heart,
  Stethoscope,
  Mail,
  Check,
  Play,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Canvas-derived palette
const brand = {
  // Core
  ink900: "#2F2A26",
  rouge600: "#D65353",
  rouge700: "#B4454A",
  rouge700Hover: "#A03F45",
  rouge200: "#F6BFC6",
  rouge100: "#FCE3E6",

  // Secondary / Accent
  sage500: "#6B7B61",
  sage100: "#E7EFE2",
  champagne: "#C6A572",
  peach300: "#F6C6B0",

  // Neutrals (Surface)
  porcelain: "#EFE7DD",
  fog200: "#E2DED6",
  fog500: "#8F8B85",
  fog700: "#4F4B47",

  background: "#FFFFFF",

  // Semantic
  success: "#2FA37A",
  warning: "#D9952A",
  error: "#D14E47",

  // Legacy mappings
  primary: "#6B7B61",
  accent: "#D65353",
  sand: "#EFE7DD",
  ink: "#2F2A26",
};

type Lang = "KOR" | "ENG";
const copy: Record<Lang, Record<string, string>> = {
  KOR: {
    nav_products: "제품",
    nav_explainer: "쉬운 설명",
    nav_founder: "창업자",
    nav_stories: "이야기",
    nav_community: "커뮤니티",
    nav_pricing: "요금제",
    nav_contact: "문의",
    announce_beta: "베타",
    announce_until: "출시까지",
    announce_days_suffix: "일",
    hero_chip: "감정과 치료 사이, 다리를 놓다.",
    hero_h1_a: "지금 느끼는 감정에서",
    hero_h1_b: "당신의 호르몬 케어",
    hero_body:
      "갱년기 케어가 복잡할수록 방법은 단순해야 합니다. 한 앱에서 공감 대화, 맞춤 미션, 호르몬 치료 가이드를 순서대로.",
    cta_primary: "가장 먼저 만나보기",
    cta_notify: "출시 알림 받기",
    features_title: "AI × 감정 × 호르몬, 하나의 경험",
    features_sub: "공감하는 대화, 근거 기반 정보, 지속 가능한 치료를 한 화면에 담았습니다.",
    explainer_title: "쉽게 풀어쓴 HRT & CBT",
    waitlist_title: "Lia 얼리 액세스에 참여하세요",
    waitlist_consent: "여성 건강 뉴스레터 수신과 개인정보 처리에 동의합니다.",
    waitlist_submit: "얼리 액세스 신청하기",
    contact_title: "문의하기",
    contact_body: "제품·제휴·미디어 관련 문의는 아래 이메일로 부탁드립니다.",
  },
  ENG: {
    nav_products: "Product",
    nav_explainer: "Explainer",
    nav_founder: "Founder",
    nav_stories: "Stories",
    nav_community: "Community",
    nav_pricing: "Pricing",
    nav_contact: "Contact",
    announce_beta: "Beta",
    announce_until: "Until launch",
    announce_days_suffix: "days",
    hero_chip: "Bridging emotions and treatment.",
    hero_h1_a: "From how you feel now,",
    hero_h1_b: " start your hormone care",
    hero_body:
      "The more complex menopause care gets, the simpler the approach should be. Empathic conversations, personalized missions, and hormone therapy guidance—all in one app, step by step.",
    cta_primary: "Get early access",
    cta_notify: "Notify me",
    features_title: "AI × Emotions × Hormones, one experience",
    features_sub: "Empathic conversations, evidence-based guidance, and sustainable care on one screen.",
    explainer_title: "HRT & CBT made simple",
    waitlist_title: "Join Lia Early Access",
    waitlist_consent: "I agree to the newsletter and data processing.",
    waitlist_submit: "Apply for Early Access",
    contact_title: "Contact",
    contact_body: "For product, partnership, or media inquiries please email us below.",
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function Section({ children, id, bg = "" }: { children: React.ReactNode; id?: string; bg?: string }) {
  return (
    <section id={id} className={`${bg} py-20 md:py-28`}>
      {children}
    </section>
  );
}

function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 md:px-8 ${className}`}>{children}</div>;
}

const targetLaunchISO = "2025-11-17T00:00:00+09:00";
const pad = (n: number) => String(n).padStart(2, "0");
const diffMs = (targetTime: number, nowTime: number) => Math.max(0, targetTime - nowTime);

function useCountdown(targetISO: string) {
  const target = new Date(targetISO).getTime();
  const [left, setLeft] = useState<number>(() => diffMs(target, Date.now()));
  useEffect(() => {
    const t = setInterval(() => setLeft(diffMs(target, Date.now())), 1000);
    return () => clearInterval(t);
  }, [target]);
  const days = Math.floor(left / (1000 * 60 * 60 * 24));
  const hours = Math.floor((left % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((left % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((left % (1000 * 60)) / 1000);
  return { left, days, hours, minutes, seconds };
}

function trackOutbound(label: string, url?: string) {
  try {
    (window as any).dataLayer?.push({ event: "outbound_click", label, url });
  } catch {}
  try {
    (window as any).gtag?.("event", "click", { event_category: "outbound", event_label: label, value: 1 });
  } catch {}
}

function goWaitlist() {
  try {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch {}
}

const cssVars: CSSProperties = {
  "--sand": brand.sand,
  "--ink": brand.ink,
  "--primary": brand.primary,
  "--accent": brand.accent,
  "--background": brand.background,
  "--border": brand.fog200,
  "--text": brand.ink900,
  "--text-muted": brand.fog500,
  "--rouge-700": brand.rouge700,
  "--rouge-700-hover": brand.rouge700Hover,
  "--rouge-600": brand.rouge600,
  "--rouge-100": brand.rouge100,
  "--fog-200": brand.fog200,
  "--fog-500": brand.fog500,
  "--fog-700": brand.fog700,
  "--success": brand.success,
  "--rouge-200": brand.rouge200,
  "--primary-hover": brand.rouge700,
  "--sage-500": brand.sage500,
  "--sage-100": brand.sage100,
} as CSSProperties;

if (typeof window !== "undefined") {
  console.assert(pad(3) === "03", "pad should pad to 2 digits");
  console.assert(diffMs(Date.now() - 1000, Date.now()) === 0, "diffMs clamps negatives");
}

function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="flex-shrink-0 w-80 md:w-96">
      <Card className="rounded-3xl border-black/8 h-full shadow-sm hover:shadow-lg transition-all duration-300 hover:border-black/15">
        <CardContent className="p-8">
          <div className="mb-6">
            <svg className="h-8 w-8 text-gray-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
            </svg>
          </div>
          <blockquote className="text-[--ink-900] text-base leading-relaxed mb-6 font-medium italic">
            "{quote}"
          </blockquote>
          <div className="text-sm text-[--ink-900] font-medium">
            — {author} (익명)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; err?: unknown }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, err: undefined };
  }
  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, err: error };
  }
  componentDidCatch(error: unknown, info: unknown) {
    console.error("Runtime error", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, background: "#fff1f0", color: "#7f1d1d", fontFamily: "ui-sans-serif,system-ui" }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>앗! 화면 렌더 중 오류가 발생했어요.</div>
          <div style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{String(this.state.err)}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function LiaLanding() {
  const cd = useCountdown(targetLaunchISO);
  const [lang, setLang] = useState<Lang>("KOR");
  const [showAssessment, setShowAssessment] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTab, setPreviewTab] = useState<"bridge" | "description">("bridge");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const t = (k: string) => (copy[lang]?.[k] ?? copy.KOR[k] ?? k);
  const bridgePreviewItems: Array<{ icon: React.ReactNode; label: string; value: string; helper: string }> = [
    {
      icon: <Brain className="h-4 w-4 text-[--fog-700]" />,
      label: "CBT 퀘스트",
      value: "3개 완료",
      helper: "이번 주 완료",
    },
    {
      icon: <Pill className="h-4 w-4 text-[--fog-700]" />,
      label: "HRT 기록",
      value: "유지 권고",
      helper: "부작용 보고 없음",
    },
    {
      icon: <LineChart className="h-4 w-4 text-[--rouge-600]" />,
      label: "호전 시각화",
      value: "+18%",
      helper: "2주 평균 대비",
    },
    {
      icon: <Sparkles className="h-4 w-4 text-[--rouge-600]" />,
      label: "셀프 케어",
      value: "2회",
      helper: "호흡·스트레칭",
    },
  ];

  useEffect(() => {
    if (!showPreview) {
      return;
    }

    const node = modalRef.current;
    if (!node) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    lastFocusedRef.current = previouslyFocused;

    const focusable = Array.from(
      node.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("data-focus-guard"));

    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setShowPreview(false);
        return;
      }

      if (event.key === "Tab" && focusable.length > 0) {
        const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
        const lastIndex = focusable.length - 1;

        if (event.shiftKey && (currentIndex === 0 || currentIndex === -1)) {
          event.preventDefault();
          focusable[lastIndex]?.focus();
        } else if (!event.shiftKey && currentIndex === lastIndex) {
          event.preventDefault();
          focusable[0]?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      lastFocusedRef.current?.focus();
    };
  }, [showPreview]);

  useEffect(() => {
    if (!showPreview) {
      setPreviewTab("bridge");
    }
  }, [showPreview]);

  const closePreview = () => setShowPreview(false);

  return (
    <ErrorBoundary>
      <div className="min-h-screen text-[--text] pt-16" style={{...cssVars, backgroundColor: "var(--background)"}}>
        <div className="fixed top-0 left-0 right-0 z-50 w-full text-[--ink-900] text-sm">
          <Container className="flex items-center justify-center gap-3 py-2">
            <Hourglass className="h-4 w-4" />
            <span className="font-medium" suppressHydrationWarning>
              {t("announce_beta")} D-{Math.max(0, cd.days)}
            </span>
            <span className="opacity-80">|</span>
            <CalendarDays className="h-4 w-4" />
            <span suppressHydrationWarning>
              {t("announce_until")} {cd.days}
              {t("announce_days_suffix")} {pad(cd.hours)}:{pad(cd.minutes)}:{pad(cd.seconds)}
            </span>
          </Container>
        </div>

        <nav className="sticky top-12 z-40 backdrop-blur bg-[--porcelain]/70 border-b border-[--fog-200]">
          <Container className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[--primary] to-[--primary-hover]" />
              <span className="font-semibold tracking-tight">Lia</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-[--fog-500]">
              <a href="#features" className="hover:text-[--ink-900] transition-colors">
                {t("nav_products")}
              </a>
              <a href="#explainer" className="hover:text-[--ink-900] transition-colors">
                {t("nav_explainer")}
              </a>
              <a href="#founder" className="hover:text-[--ink-900] transition-colors">
                {t("nav_founder")}
              </a>
              <a href="#stories" className="hover:text-[--ink-900] transition-colors">
                {t("nav_stories")}
              </a>
              <a href="#community" className="hover:text-[--ink-900] transition-colors">
                {t("nav_community")}
              </a>
              <a href="#pricing" className="hover:text-[--ink-900] transition-colors">
                {t("nav_pricing")}
              </a>
              <a href="#contact" className="hover:text-[--ink-900] transition-colors">
                {t("nav_contact")}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center rounded-full bg-[--fog-200] p-0.5">
                <button
                  onClick={() => setLang("KOR")}
                  className={`px-3 py-1 rounded-full text-sm ${lang === "KOR" ? "bg-white shadow font-semibold" : "text-[--fog-500]"}`}
                >
                  KOR
                </button>
                <button
                  onClick={() => setLang("ENG")}
                  className={`px-3 py-1 rounded-full text-sm ${lang === "ENG" ? "bg-white shadow font-semibold" : "text-[--fog-500]"}`}
                >
                  ENG
                </button>
              </div>
              <Button
                type="button"
                onClick={goWaitlist}
                className="bg-white border border-[var(--accent)] text-[var(--accent)] hover:bg-[rgba(214,83,83,0.08)] rounded-2xl px-5"
              >
                {t("cta_primary")}
              </Button>
            </div>
          </Container>
        </nav>

        <section
          className="relative overflow-hidden"
          style={{
            background: `radial-gradient(130% 80% at 50% 10%, rgba(239,231,221,0.95), #ffffff 80%)`
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background: `radial-gradient(70% 45% at 85% 15%, rgba(214,83,83,0.32), rgba(214,83,83,0)),
                       radial-gradient(70% 45% at 15% 20%, rgba(107,123,97,0.28), rgba(107,123,97,0))`
            }}
          />
          <div className="relative mx-auto px-6 py-20 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto flex max-w-[65ch] flex-col items-center text-center"
            >
              <HeroChip>{t("hero_chip")}</HeroChip>

              <h1 className="mt-3 mb-6 text-[3.48rem] font-extrabold leading-[1.08] tracking-[-0.015em] text-[--ink-900] sm:text-[4.32rem]">
                지금 느끼는 감정에서,
                <br />
                <span className="whitespace-nowrap">
                  당신의 <span className="text-[--rouge-600]">호르몬 케어</span>를 시작해요
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-[17px] leading-[1.65] text-[--ink-900]">
                복잡할수록 방법은 단순해야 하니까요.
                <br />
                한 화면에서 <b>공감 대화 → 맞춤 미션 → 치료 가이드</b>를 순서대로.
                <br />
                <b>하루 8분 루틴</b>으로 오늘 밤을 조금 더 편안하게.
              </p>

              <p className="mt-4 text-sm text-[--ink-900]">
                많은 분이 치료를 중간에 멈춰요 <b className="text-[--rouge-600]">75%</b>. Lia는 <b className="text-[--rouge-600]">2분 자가 테스트</b>로 첫걸음을 돕고, 작은 루틴으로 이어가요.
              </p>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewTab("bridge");
                    setShowPreview(true);
                  }}
                  className="inline-flex items-center rounded-2xl border border-[--rouge-200] bg-white px-6 py-2 text-sm font-semibold text-[--rouge-600] shadow-sm transition hover:bg-[--rouge-100] focus:outline-none focus:ring-2 focus:ring-[--rouge-200]"
                >
                  제품 미리보기
                </button>
              </div>

              {/* Email capture */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  goWaitlist();
                }}
                className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
              >
                <label className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[--fog-500]" />
                  <input
                    type="email"
                    required
                    placeholder="이메일 주소"
                    className="w-full rounded-2xl border border-[--fog-200] bg-white py-3 pl-10 pr-3 text-[16.5px] shadow-sm outline-none placeholder:text-[--fog-500] focus:border-[--rouge-600] focus:ring-2 focus:ring-[--rouge-100]"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-white shadow-lg transition focus:outline-none focus:ring-2 focus:ring-[--rouge-200]"
                  style={{
                    backgroundImage: "linear-gradient(135deg, var(--primary), var(--accent))",
                    boxShadow: "0 10px 28px rgba(177,55,80,.22)",
                    filter: "brightness(1)"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(0.95)"}
                  onMouseLeave={(e) => e.currentTarget.style.filter = "brightness(1)"}
                >
                  베타 초대 받기
                  <Sparkles className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[--fog-500]">
                <span className="inline-flex items-center gap-1"><Check className="h-4 w-4 text-[--success]" /> 개인정보 안전</span>
                <span className="inline-flex items-center gap-1"><Check className="h-4 w-4 text-[--success]" /> 무료 체험</span>
                <span className="inline-flex items-center gap-1"><Check className="h-4 w-4 text-[--success]" /> 언제든 취소</span>
                <a
                  href="#selftest"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAssessment(true);
                  }}
                  className="ml-auto inline-flex items-center gap-1 text-[--rouge-600] hover:underline"
                >
                  갱년기 2분 자가 테스트 →
                </a>
              </div>
            </motion.div>

          </div>
        </section>

        <Section id="features" bg="bg-white">
          <Container>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="text-center max-w-4xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[--ink-900] mb-4">AI × 감정 × 호르몬, 하나의 경험</h2>
              <p className="text-[17px] leading-[1.65] text-[--ink-900]">하루 8분 루틴으로 지금의 불편을 낮추고, 다음 진료는 한 장 요약으로 준비하세요.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* 카드 1: 호르몬 치료 상담 준비 */}
              <Card className="rounded-3xl border-[--fog-200] h-full shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[--rouge-600]/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                      <Pill className="h-7 w-7 text-gray-700" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-[--ink-900] leading-tight flex-1">호르몬 치료 상담 준비</CardTitle>
                  </div>
                  <p className="text-[16.5px] text-[--ink-900] leading-relaxed">의사에게 바로 보여줄 1페이지 요약을 만들어 드려요.</p>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <div>
                    <h4 className="text-[16.5px] font-semibold text-[--ink-900] mb-2">내가 하는 일</h4>
                    <ul className="text-[16.5px] text-[--ink-900] space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                        <span>건강검진표·복용약 사진 업로드(선택)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                        <span>증상 체크(2분) + 목표 선택</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[16.5px] font-semibold text-[--ink-900] mb-2">앱이 해주는 일</h4>
                    <ul className="text-[16.5px] text-[--ink-900] space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[--accent] flex-shrink-0" />
                        <span>핵심 지표 자동 요약: 나이·BMI·혈압·지질·간·신장·유방/자궁 병력</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[--accent] flex-shrink-0" />
                        <span>위험 신호/금기 자동 체크</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[--accent] flex-shrink-0" />
                        <span>가능한 치료 옵션 + 개인화 질문 3개 생성</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[13px] text-[--ink-900] italic">
                      미리보기: "불안·야간 발한↑ → 비호르몬 A, HRT B(금기 없음)"
                    </p>
                  </div>


                  <div className="border-t pt-3">
                    <p className="text-[13px] text-[--ink-900]">
                      ※ 정보 제공용 자료입니다. 최종 치료 결정은 의료진과 상의하세요.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 카드 2: 공감 챗봇 */}
              <Card className="rounded-3xl border-[--fog-200] h-full shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[--rouge-600]/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                      <HeartHandshake className="h-7 w-7 text-gray-700" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-black leading-tight flex-1">공감 챗봇</CardTitle>
                  </div>
                  <p className="text-[16.5px] text-[--ink-900] leading-relaxed">
                    밤에도 답하는 마음 코치.
                    <br />
                    길게 쓰지 않아도 알아듣습니다.
                  </p>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <div>
                    <h4 className="text-[16.5px] font-semibold text-[--ink-900] mb-2">내가 하는 일</h4>
                    <ul className="text-[16.5px] text-[--ink-900] space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                        <span>짧게 한 줄로 상황 보내기</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                        <span>제안된 즉시 행동 중 하나 실행</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[16.5px] font-semibold text-[--ink-900] mb-2">앱이 해주는 일</h4>
                    <ul className="text-[16.5px] text-[--ink-900] space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[--accent] flex-shrink-0" />
                        <span>감정 라벨링 → 호흡/수면/자기대화 중 1개 즉시 제안</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[--accent] flex-shrink-0" />
                        <span>대화 기록을 주간 리포트로 정리</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[13px] text-[--ink-900]">
                      예) "한밤에 갑자기 더워서 짜증나요"<br />
                      → 90초 쿨다운 호흡 + 수면 팁 제안
                    </p>
                  </div>

                </CardContent>
              </Card>

              {/* 카드 3: CBT 감정 퀘스트 */}
              <Card className="rounded-3xl border-[--fog-200] h-full shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[--rouge-600]/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                      <Brain className="h-7 w-7 text-gray-700" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-black leading-tight flex-1">CBT 감정 퀘스트</CardTitle>
                  </div>
                  <p className="text-[16.5px] text-[--ink-900] leading-relaxed">하루 8분, 작은 연습으로 마음 근육을 키웁니다.</p>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <div>
                    <h4 className="text-[16.5px] font-semibold text-[--ink-900] mb-2">내가 하는 일</h4>
                    <ul className="text-[16.5px] text-[--ink-900] space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                        <span>오늘 할 것 3가지: 체크인 → 미션 → 셀프케어</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                        <span>끝나면 한 줄 메모</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[16.5px] font-semibold text-[--ink-900] mb-2">앱이 해주는 일</h4>
                    <ul className="text-[16.5px] text-[--ink-900] space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[--accent] flex-shrink-0" />
                        <span>난이도 자동 조절, 성공률 트래킹</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[--accent] flex-shrink-0" />
                        <span>"생각-감정-행동" 연결 훈련 스크립트 제공</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                    <p className="text-[13px] text-[--ink-900]">예) 생각 기록하기: 오늘 나를 힘들게 한 생각 1개</p>
                    <p className="text-[13px] text-[--ink-900]">예) 숨 고르기: 4-7-8 호흡 3세트</p>
                    <p className="text-[13px] text-[--ink-900]">예) 말 바꾸기: "나는 망쳤어" → "나는 배우는 중이야"</p>
                  </div>

                </CardContent>
              </Card>
            </div>
          </Container>
        </Section>


        <Section id="metrics" bg="bg-[--primary]/5">
          <Container>
            <div className="text-center mb-10">
              <h3 className="text-[32px] leading-[40px] font-bold tracking-[-0.01em] text-[#0E1116]">
                데이터로 보는 현실
              </h3>
              <p className="mt-2 text-[--ink-900]">교육과 공감, 정보의 빈틈을 줄이는 것이 Lia의 시작점입니다.</p>
            </div>
            <div className="mx-auto max-w-[75rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Metric number="75%" label="호르몬 치료 포기 경험" hint="교육·공감 결핍" />
              <Metric number="24.6%" label="호르몬 실제 치료률" hint="불안·정보 부족" />
              <Metric number="3,000+" label="베타 대기자" hint="초기 커뮤니티" />
              <Metric
                number={<span className="whitespace-nowrap">50만명/년</span>}
                label="폐경 진입자"
                hint="지속 증가"
              />
            </div>
          </Container>
        </Section>

        <Section id="explainer">
          <Container>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h3 className="text-[38.4px] leading-[48px] font-bold tracking-[-0.01em] text-[#0E1116]">
                {t("explainer_title")}
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <Card className="rounded-3xl border-black/8 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-black/15">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-xl flex items-center justify-center bg-gray-100">
                      <Pill className="h-4 w-4 text-[#C04E5A]/80" />
                    </div>
                    <CardTitle className="flex-1 text-[25.92px] leading-[40.32px] font-bold text-[#0E1116]">HRT(호르몬 치료)란?</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="mb-5 text-[17.6px] leading-[28.6px] font-medium" style={{ color: "rgba(14,17,22,0.85)" }}>
                    폐경이 되면 부족해진 호르몬을 의학적으로 조금 보태 증상을 완화해요.
                  </p>
                  <div className="rounded-2xl bg-gray-50 p-4 min-h-[160px]">
                    <ul className="space-y-2.5 text-[16.5px]" style={{ color: "rgba(14,17,22,0.85)", lineHeight: 1.6 }}>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#C04E5A]/70 flex-shrink-0" />
                        <span>효과: 열감·수면장애·골다공증 완화</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#C04E5A]/70 flex-shrink-0" />
                        <span>개별 처방: 약물 종류·용량 다름 → 반드시 의사와 상의</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#C04E5A]/70 flex-shrink-0" />
                        <span>결정 기준: 검사·병력 확인 후 진행</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-3xl border-black/8 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-black/15">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-xl flex items-center justify-center bg-gray-100">
                      <Brain className="h-4 w-4 text-[#C04E5A]/80" />
                    </div>
                    <CardTitle className="flex-1 text-[25.92px] leading-[40.32px] font-bold text-[#0E1116]">CBT(인지행동치료)란?</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="mb-5 text-[17.6px] leading-[28.6px] font-medium" style={{ color: "rgba(14,17,22,0.85)" }}>
                    마음이 쓰는 안경을 살펴보고 더 편안한 안경으로 바꿔 끼는 꾸준한 연습입니다.
                  </p>
                  <div className="rounded-2xl bg-gray-50 p-4 min-h-[160px]">
                    <ul className="space-y-2.5 text-[16.5px]" style={{ color: "rgba(14,17,22,0.85)", lineHeight: 1.6 }}>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#C04E5A]/70 flex-shrink-0" />
                        <span>핵심 원리: 생각·감정·행동 연결 이해</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#C04E5A]/70 flex-shrink-0" />
                        <span>실천 방식: 짧은 숙제로 자기 조절 훈련</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#C04E5A]/70 flex-shrink-0" />
                        <span>지속 효과: 약이 아닌 연습 → 반복할수록 쉬움</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Container>
        </Section>

        <Section id="founder">
          <Container className="grid md:grid-cols-5 gap-10 items-start">
            <div className="md:col-span-3">
              <h3 className="text-2xl md:text-3xl font-semibold">창업자 스토리</h3>
              <p className="mt-2 text-[--ink-900]">
                <span className="font-medium">이예지 MD, MPH</span> — 산부인과 전문의 · 임상심리사
              </p>
              <h4 className="mt-6 text-lg font-semibold text-black/90">제가 LIA를 만들어야만 했던 이유</h4>
              
              <div className="mt-6 p-6 bg-gray-50 border-l-4 border-[--primary] rounded-r-xl">
                <blockquote className="text-[--ink-900] leading-8 space-y-4">
                  <p>
                    안녕하세요, 산부인과 전문의이자 임상심리사 이예지입니다.
                    지난 10년간 진료실에서 깨달았습니다. 나이가 들면서 호르몬이 변화하고, 우리는 많은 신체적·감정적 어려움을 겪게 됩니다. 하지만 이런 힘듦은 감정이 약해서가 아니라, 말할 수 없었을 뿐이라는 것을.
                  </p>
                  <p>
                    짧은 진료시간의 한계를 넘어 당신의 일상에 함께하고 싶었습니다. 감정은 견디는 게 아니라, 나누는 거니까요.
                    호르몬 케어는 마음에서부터 시작됩니다.
                  </p>
                </blockquote>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <Card className="rounded-2xl border-black/5 overflow-hidden">
                <CardContent className="text-sm text-[--ink-900] space-y-4 pt-6">
                  <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-[--sand]">
                    <img
                      src="/thread_profile.jpeg"
                      alt="창업자 프로필"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <div className="font-medium mb-1">학력</div>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>고려대학교 심리학/생명과학 전공</li>
                      <li>서울대학교 의학전문대학원 졸업</li>
                      <li>서울대학교병원 산부인과 수련</li>
                      <li>Columbia University in the City of New York — MPH</li>
                      <li>Medical AI 산후심근병증 AI 모델 개발</li>
                      <li>삼성메디슨 AI &amp; Informatics 근무</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Container>
        </Section>

        <Section id="community">
          <Container className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-2xl md:text-3xl font-semibold">더 깊은 이야기 (Content & Community)</h3>
              <p className="text-[--ink-900]">
                유튜브 <span className="font-medium">'산부인과 지정소'</span>에서 의사 친구를 만나보세요. 의학 지식과 따뜻한 이야기가 기다립니다.
              </p>
            </div>
            <div className="flex md:justify-end">
              <Button
                asChild
                className="rounded-2xl bg-white border border-[--sage-500] text-[--sage-500] hover:bg-[--sage-100] w-full sm:w-auto"
              >
                <a
                  href="https://www.youtube.com/@YourGoToOBGYNFriend/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackOutbound("youtube:산부인과 지정소", "https://www.youtube.com/@YourGoToOBGYNFriend/")}
                >
                  <Play className="mr-2 h-4 w-4" /> 유튜브 채널 바로 가기
                </a>
              </Button>
            </div>
          </Container>
        </Section>

        <Section id="pricing" bg="bg-white">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h3 className="text-3xl font-semibold">요금제 (출시 후 공개)</h3>
              <p className="mt-3 text-[--ink-900]">
                현재는 베타 준비 중입니다. <span className="font-medium">대기명단 가입자</span>께 먼저 초대와 혜택을 드립니다.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-6 items-stretch">
              <PriceCard tier="Basic" price="무료" features={["호르몬 치료 가능성 체크", "감정일지", "주 1회 CBT 퀘스트"]} cta="준비 중" />
              <PriceCard
                tier="Plus"
                price="₩4,900/월"
                features={["모든 Basic 기능", "CBT 전체 코스", "무제한 챗봇", "호전 시각화"]}
                cta="준비 중"
                highlight
              />
              <PriceCard
                tier="Platinum"
                price="₩79,000/월"
                features={["모든 Plus 기능", "임상심리사 상담 월 1회"]}
                cta="준비 중"
              />
              <PriceCard tier="Clinic" price="문의" features={["환자 관리 SaaS", "EMR 연동(준비)"]} cta="준비 중" />
            </div>
            <p className="mt-4 text-center text-xs text-[--fog-500]">* 요금과 구성은 베타 출시 시점에 변경될 수 있습니다.</p>
          </Container>
        </Section>

        <Section id="stories" bg="bg-white/70">
          <Container>
            <div className="text-center max-w-4xl mx-auto mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-black mb-6">
                어쩌면 당신 또는 당신의 가족 이야기일지도 모릅니다.
              </h3>
              <p className="text-[17px] leading-[1.65] text-[--ink-900] font-medium">
                지난 10년간 진료실에서 만난 수많은 여성분들이 들려주신 이야기입니다. Lia는 이 목소리에서 시작되었습니다.
              </p>
            </div>
            
            <div className="relative overflow-hidden">
              <div className="flex gap-6 pb-4 animate-scroll-infinite">
                {[...Array(2)].map((_, setIndex) => 
                  [
                    { quote: "남편에게도, 딸에게도 말 못 할 감정들이 있어요. 괜히 짜증만 내는 사람 같아 너무 힘들어요.", author: "50대, 주부" },
                    { quote: "몸이 힘든 건 참겠는데 예전 같지 않은 내 모습에 자신감이 떨어졌어요. 모든 게 내 잘못 같아요.", author: "40대 후반, 직장인" },
                    { quote: "밤에 잠을 못 자니까 낮에 일도 집중이 안 돼요. 가족들한테 미안하고 저 자신이 한심해요.", author: "40대 중반, 교사" },
                    { quote: "갑자기 확 올라오는 화가 무서워요. 이런 제가 아니었는데... 애들이 저를 피하는 것 같아요.", author: "50대 초반, 직장맘" },
                    { quote: "병원에서는 '나이 드니까 그렇다'고만 하시고... 정말 괜찮아질 수 있는 건지 답답해요.", author: "40대 후반, 사업가" },
                    { quote: "홀로 견디는 시간이 너무 길어요. 누군가 이해해 주면 좋겠는데 어디서부터 말해야 할지...", author: "50대 중반, 주부" }
                  ].map((testimonial, index) => (
                    <div key={`${setIndex}-${index}`} className="flex-shrink-0 w-80 md:w-96">
                      <Card className="rounded-3xl border-[--fog-200] h-full shadow-sm hover:shadow-lg transition-all duration-300 hover:border-[--rouge-600]/20">
                        <CardContent className="p-8">
                          <div className="mb-6">
                            <svg className="h-8 w-8 text-gray-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                            </svg>
                          </div>
                          <blockquote className="text-[--ink-900] text-base leading-relaxed mb-6 font-medium italic">
                            "{testimonial.quote}"
                          </blockquote>
                          <div className="text-sm text-[--ink-900] font-medium">
                            — {testimonial.author} (익명)
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))
                ).flat()}
              </div>
            </div>
          </Container>
        </Section>

        <Section id="waitlist" bg="bg-gradient-to-br from-gray-50 to-white">
          <Container>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold text-[--ink-900] mb-6">{t("waitlist_title")}</h3>


                <p className="text-[17px] leading-[1.65] text-[--ink-900] font-medium max-w-4xl mx-auto">
                  출시 소식을 가장 먼저 알려드리고, 베타 테스터 우선 선발 혜택을 드려요.
                </p>
              </div>
              
              <div className="bg-white rounded-3xl border border-[--fog-200] shadow-lg p-8 md:p-12">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-[--ink-900]">이름</Label>
                      <Input 
                        id="name"
                        type="text" 
                        placeholder="이름을 입력해주세요" 
                        className="rounded-xl h-12 border-[--fog-200] focus:border-[--rouge-600] focus:ring-2 focus:ring-[--rouge-200] transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-[--ink-900]">이메일 주소 *</Label>
                      <Input 
                        id="email"
                        type="email" 
                        placeholder="your@email.com" 
                        className="rounded-xl h-12 border-[--fog-200] focus:border-[--rouge-600] focus:ring-2 focus:ring-[--rouge-200] transition-all" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox id="consent" required className="mt-1" />
                      <Label htmlFor="consent" className="text-sm text-[--fog-700] leading-relaxed cursor-pointer">
                        {t("waitlist_consent")}
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="rounded-xl h-12 px-12 min-w-[280px] font-semibold text-base text-white transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[--rouge-200] bg-[--rouge-700] hover:bg-[--rouge-700-hover]"
                      style={{
                        boxShadow: "0 10px 28px rgba(177,55,80,.22)",
                        filter: "brightness(1)"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(0.95)"}
                      onMouseLeave={(e) => e.currentTarget.style.filter = "brightness(1)"}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                    {t("waitlist_submit")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Container>
        </Section>

        <Section id="contact">
          <Container>
            <h3 className="text-2l md:text-3xl font-semibold">{t("contact_title")}</h3>
            <p className="mt-2 text-[--ink-900]">{t("contact_body")}</p>
            <a
              href="mailto:contact@medicaltica.com"
              className="mt-3 inline-flex items-center font-semibold text-[--ink] underline decoration-[--accent]/40 underline-offset-4"
            >
              contact@medicaltica.com
            </a>
          </Container>
        </Section>

        <footer className="border-t border-black/5 bg-white">
          <div className="h-px w-full bg-black/10" aria-hidden />
          <Container className="py-10 grid md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[--primary] to-[--primary-hover]" />
                <span className="font-semibold">Lia</span>
              </div>
              <p className="text-[--ink-900]">감정과 치료 사이, 다리를 놓다</p>
            </div>
            <div className="space-y-1 text-[--ink-900]">
              <div className="font-medium">연락처</div>
              <div>메디칼티카 | 대표 이예지 MD, MPH</div>
              <div>이메일: contact@medicaltica.com</div>
              <div>사업자 번호: 113-88-03524</div>
              <div>주소: 인천 서구 크리스탈로 100, 708씨65호</div>
            </div>
            <div>
              <div className="font-medium mb-2">바로가기</div>
              <ul className="space-y-1 text-[--ink-900]">
                <li>
                  <a href="#features" className="hover:text-[--accent]">
                    제품 기능
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-[--accent]">
                    요금제
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[--accent]">
                    문의
                  </a>
                </li>
                <li>
                  <a className="hover:text-[--rouge-600]" href="#">
                    개인정보처리방침
                  </a>
                </li>
                <li>
                  <a className="hover:text-[--rouge-600]" href="#">
                    이용약관
                  </a>
                </li>
              </ul>
            </div>
          </Container>
          <Container className="pb-10 text-xs text-[--fog-500]">© {new Date().getFullYear()} Lia. All rights reserved.</Container>
        </footer>

        {showPreview && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closePreview();
              }
            }}
          >
            <div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="product-preview-heading"
              className="relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl focus:outline-none"
            >
              <button
                type="button"
                onClick={closePreview}
                className="absolute right-4 top-4 rounded-full p-2 text-[--fog-500] transition hover:bg-[--fog-200]/40 focus:outline-none focus:ring-2 focus:ring-[--rouge-200]"
                aria-label="Close preview"
              >
                <span aria-hidden="true">X</span>
              </button>
              <div>
                <h2 id="product-preview-heading" className="text-2xl font-semibold text-[--ink-900]">
                  제품 미리보기
                </h2>
                <p className="mt-2 text-sm text-[--fog-700]">
                  브릿지 보드와 핵심 기능을 한 번에 살펴보세요.
                </p>
              </div>
              <div className="mt-4" role="tablist" aria-label="제품 미리보기 탭">
                <button
                  role="tab"
                  type="button"
                  aria-selected={previewTab === "bridge"}
                  id="preview-tab-bridge"
                  aria-controls="product-preview-panel"
                  className={`mr-2 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[--rouge-200] ${
                    previewTab === "bridge"
                      ? "bg-[--rouge-600] text-white"
                      : "border border-[--fog-200] text-[--fog-700] hover:border-[--rouge-200]"
                  }`}
                  onClick={() => setPreviewTab("bridge")}
                >
                  브릿지 보드
                </button>
                <button
                  role="tab"
                  type="button"
                  aria-selected={previewTab === "description"}
                  id="preview-tab-description"
                  aria-controls="product-preview-panel"
                  className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[--rouge-200] ${
                    previewTab === "description"
                      ? "bg-[--rouge-600] text-white"
                      : "border border-[--fog-200] text-[--fog-700] hover:border-[--rouge-200]"
                  }`}
                  onClick={() => setPreviewTab("description")}
                >
                  제품 설명
                </button>
              </div>
              <div
                className="mt-6 space-y-4 text-[--ink-900]"
                role="tabpanel"
                id="product-preview-panel"
                aria-live="polite"
                aria-labelledby={
                  previewTab === "bridge" ? "preview-tab-bridge" : "preview-tab-description"
                }
              >
                {previewTab === "bridge" ? (
                  <div className="rounded-[32px] border border-[#F0E6E0] bg-gradient-to-br from-[#FDF6F2] to-white p-6 shadow-[0_25px_40px_-30px_rgba(206,82,78,0.35)]">
                    <div className="rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-[0_18px_35px_-22px_rgba(141,103,94,0.35)] backdrop-blur">
                      <div className="flex flex-col gap-3">
                        <div>
                          <h3 className="text-lg font-semibold tracking-tight text-[--ink-900]">
                            브릿지 보드 – 감정·치료 한눈에
                          </h3>
                          <p className="mt-2 text-sm text-[--fog-700]">
                            이번 주 감정 안정도 62% · 수면 6.8h · 복약 5/7
                          </p>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[#F1E3DB]">
                          <div className="h-2 w-[64%] rounded-full bg-[--rouge-200]" />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {bridgePreviewItems.map((item) => (
                            <div
                              key={item.label}
                              className="flex flex-col gap-1.5 rounded-[22px] border border-[#E5DED8] bg-white px-4 py-3 shadow-[0_4px_12px_-6px_rgba(77,56,48,0.25)]"
                            >
                              <div className="flex items-center gap-2 text-xs font-medium text-[--fog-700]">
                                {item.icon}
                                <span>{item.label}</span>
                              </div>
                              <div className="text-base font-semibold text-[#0E1116] tracking-[-0.01em]">
                                {item.value}
                              </div>
                              <p className="text-xs text-[#8F8B85]">{item.helper}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold">제품 설명</h3>
                    <p className="mt-3 text-sm leading-relaxed">
                      Lia는 감정 기반 CBT 미션과 호르몬 치료 요약을 하나의 여정으로 제공합니다. 매일 8분 루틴으로
                      감정 패턴을 기록하고, 맞춤 미션과 셀프케어를 실행하며, 의사 상담 준비를 자동화합니다.
                    </p>
                    <ul className="mt-4 space-y-3 text-sm leading-relaxed">
                      <li className="flex items-start gap-3">
                        <Brain className="mt-0.5 h-4 w-4 text-[--rouge-600]" />
                        <span>감정 체크인 → 맞춤 CBT → 셀프케어로 이어지는 데일리 플로우</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Heart className="mt-0.5 h-4 w-4 text-[--rouge-600]" />
                        <span>24시간 공감 대화로, 길게 쓰지 않아도 바로 이해해요.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Stethoscope className="mt-0.5 h-4 w-4 text-[--rouge-600]" />
                        <span>주간 리포트와 1페이지 HRT 브리핑으로 다음 진료까지 연결해요.</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <SelfAssessmentPopup
          isOpen={showAssessment}
          onClose={() => setShowAssessment(false)}
          onGetRoutine={() => {
            setTimeout(() => {
              goWaitlist();
            }, 300);
          }}
        />
      </div>
    </ErrorBoundary>
  );
}


function HeroChip({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center rounded-full bg-transparent text-[--fog-700] px-4 py-2 text-sm md:text-base font-semibold shadow-sm border border-black/10 backdrop-blur supports-[backdrop-filter]:bg-transparent">
      {children}
    </div>
  );
}




function EnhancedMiniStat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-black/10 p-4 bg-white/90 hover:bg-white transition-colors">
      <div className="flex items-center gap-2 text-sm text-[--ink-900] mb-2">
        <span className="text-[--accent]">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-base font-bold text-black/90">
        {value.replace(accent, `<span class="text-[--accent]">${accent}</span>`).split('<span class="text-[--accent]">').map((part, index) => {
          if (index === 0) return part;
          const [accentPart, ...rest] = part.split('</span>');
          return (
            <React.Fragment key={index}>
              <span className="text-[--accent]">{accentPart}</span>
              {rest.join('</span>')}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function BadgeEarlyBird() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 shadow-sm">
      감정과 치료 사이, 다리를 놓다
    </div>
  );
}

function Metric({ number, label, hint }: { number: React.ReactNode; label: string; hint?: string }) {
  return (
    <div className="rounded-[24px] border border-[#E7E7E3] bg-white px-6 py-7 shadow-sm transition-colors">
      <div className="text-[48px] leading-[56px] font-extrabold tracking-[-0.015em] text-[#0E1116]">
        {number}
      </div>
      <div className="mt-2 text-[16px] leading-[24px] font-semibold tracking-[-0.01em]" style={{ color: "rgba(14,17,22,0.9)" }}>
        {label}
      </div>
      {hint && (
        <div className="mt-1.5 text-[13px] leading-[20px] text-[#979A9B]">
          {hint}
        </div>
      )}
    </div>
  );
}

function PriceCard({
  tier,
  price,
  features,
  cta,
  highlight,
}: {
  tier: string;
  price: string;
  features: string[];
  cta: string;
  highlight?: boolean;
}) {
  const [amount, cadence] = price.split("/");
  const radioId = `plan-${tier.toLowerCase()}`;
  return (
    <label
      htmlFor={radioId}
      className="relative block rounded-2xl transition hover:shadow focus-within:ring-2 focus-within:ring-[--accent]/30"
    >
      <input
        type="radio"
        name="plan"
        id={radioId}
        value={tier}
        defaultChecked={highlight}
        className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
        aria-label={`${tier} 플랜 선택`}
      />
      <div className="flex h-full flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors peer-checked:border-neutral-900 peer-checked:bg-neutral-900 peer-checked:text-white">
        <div className="text-sm font-semibold tracking-tight">{tier}</div>
        <div className="text-3xl font-semibold">
          <span>{amount}</span>
          {cadence && (
            <span className="ml-1 text-base font-normal opacity-80">/{cadence}</span>
          )}
        </div>
        <ul className="mt-2 flex-1 list-disc pl-4 text-sm opacity-90">
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <div className="mt-3 inline-flex w-max items-center rounded-full border border-neutral-300 px-3 py-1 text-[11px] tracking-[0.08em] opacity-80 peer-checked:border-white/70 peer-checked:opacity-100">
          {cta}
        </div>
        <button
          type="button"
          className="mt-3 rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/[0.03] peer-checked:border-white peer-checked:bg-white/10"
        >
          선택
        </button>
      </div>
    </label>
  );
}
