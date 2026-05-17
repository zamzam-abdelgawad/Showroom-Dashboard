import { useState } from "react";
import { X, Car, ArrowRight, ArrowLeft, Lock, CircleCheck, TrendingUp, CreditCard, Banknote } from "lucide-react";
import { AnimatedButton } from "../../shared/components/animations/AnimatedButton";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DELIVERY_FEE = 350;
const TIME_SLOTS = ["09:00","10:00","11:00","13:00","14:00","15:00","16:00","17:00"];
const FINANCE_TERMS = [12, 24, 36, 48, 60, 72];
const APR = 0.049;

function formatDate(date) {
  if (!date) return "—";
  return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

function calcMonthly(principal, months) {
  const r = APR / 12;
  return Math.round((principal * r) / (1 - Math.pow(1 + r, -months)));
}

// ─── Step bar — defined outside main component, safe to render repeatedly ────
function StepBar({ current }) {
  const steps = ["Contact", "Delivery", "Confirm"];
  return (
    <div className="flex items-center bg-zinc-950 px-6">
      {steps.map((label, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className={`flex items-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors
              ${active ? "text-brand-primary" : done ? "text-zinc-400" : "text-zinc-700"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] border transition-colors flex-shrink-0
                ${active ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                         : done   ? "border-zinc-600 bg-zinc-800 text-zinc-400"
                                  : "border-zinc-800 text-zinc-700"}`}>
                {done ? <CircleCheck className="w-3 h-3" /> : i + 1}
              </span>
              {label}
            </div>
            {i < steps.length - 1 && <div className="flex-1 mx-3 h-px bg-zinc-800" />}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function DeliveryBookingModal({ car, onClose, onConfirm, isSubmitting }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ address: "", phone: "", altPhone: "", date: null, slot: null });
  const [paymentMode, setPaymentMode] = useState("full");
  const [financeTerm, setFinanceTerm] = useState(60);

  function setField(field, val) { setForm(f => ({ ...f, [field]: val })); }

  const total   = (car.sellingPrice ?? 0) + DELIVERY_FEE;
  const monthly = calcMonthly(total, financeTerm);

  // ── Full delivery payload — everything needed by context + admin view ──────
  function buildPayload() {
    const base = {
      // contact & schedule
      address:  form.address,
      phone:    form.phone,
      altPhone: form.altPhone,
      date:     form.date,
      slot:     form.slot,
      // pricing
      deliveryFee: DELIVERY_FEE,
      totalPrice:  total,
      // payment choice
      paymentMode,
    };
    // Only include financing fields when the user actually chose finance
    // — avoids storing null in Firestore for full-payment orders
    if (paymentMode === "finance") {
      base.financeTerm    = financeTerm;
      base.monthlyPayment = monthly;
    }
    return base;
  }

  const confirmRows = [
    { label: "Vehicle",         value: `${car.brand} ${car.name}` },
    { label: "Address",         value: form.address },
    { label: "Primary contact", value: form.phone },
    { label: "Alt. contact",    value: form.altPhone || "—" },
    { label: "Delivery date",   value: formatDate(form.date) },
    { label: "Time window",     value: form.slot },
  ];

  return (
    <>
      {/* Scoped calendar styles */}
      <style>{`
        .delivery-calendar-wrap .react-datepicker { font-family: inherit; width: 100%; background: transparent; border: none; }
        .delivery-calendar-wrap .react-datepicker__month-container { width: 100%; }
        .delivery-calendar-wrap .react-datepicker__header { background: transparent; border-bottom: 1px solid rgb(228 228 231 / 0.5); padding-bottom: 8px; }
        .dark .delivery-calendar-wrap .react-datepicker__header { border-bottom-color: rgb(39 39 42 / 0.8); }
        .delivery-calendar-wrap .react-datepicker__current-month { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.15em; color: rgb(24 24 27); margin-bottom: 8px; }
        .dark .delivery-calendar-wrap .react-datepicker__current-month { color: rgb(244 244 245); }
        .delivery-calendar-wrap .react-datepicker__day-name { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgb(161 161 170); width: 2rem; line-height: 2rem; margin: 0.1rem; }
        .delivery-calendar-wrap .react-datepicker__day { width: 2rem; line-height: 2rem; font-size: 11px; font-weight: 500; border-radius: 8px; color: rgb(63 63 70); margin: 0.1rem; transition: all 0.15s; }
        .dark .delivery-calendar-wrap .react-datepicker__day { color: rgb(212 212 216); }
        .delivery-calendar-wrap .react-datepicker__day:hover:not(.react-datepicker__day--disabled) { background: rgb(244 244 245); border-radius: 8px; color: rgb(24 24 27); }
        .dark .delivery-calendar-wrap .react-datepicker__day:hover:not(.react-datepicker__day--disabled) { background: rgb(39 39 42); color: rgb(244 244 245); }
        .delivery-calendar-wrap .react-datepicker__day--selected,
        .delivery-calendar-wrap .react-datepicker__day--keyboard-selected { background: var(--color-brand-primary, #7c3aed) !important; color: white !important; font-weight: 700; }
        .delivery-calendar-wrap .react-datepicker__day--today { border: 1px solid rgb(212 212 216); font-weight: 700; background: transparent; }
        .dark .delivery-calendar-wrap .react-datepicker__day--today { border-color: rgb(63 63 70); }
        .delivery-calendar-wrap .react-datepicker__day--disabled { color: rgb(212 212 216) !important; cursor: default; }
        .dark .delivery-calendar-wrap .react-datepicker__day--disabled { color: rgb(63 63 70) !important; }
        .delivery-calendar-wrap .react-datepicker__navigation { top: 4px; }
        .delivery-calendar-wrap .react-datepicker__navigation-icon::before { border-color: rgb(161 161 170); border-width: 2px 2px 0 0; width: 7px; height: 7px; }
        .delivery-calendar-wrap .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before { border-color: rgb(24 24 27); }
        .dark .delivery-calendar-wrap .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before { border-color: rgb(244 244 245); }
        .delivery-calendar-wrap .react-datepicker__month { margin: 0; }
        .delivery-calendar-wrap .react-datepicker__week { display: flex; justify-content: space-around; }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="w-full max-w-lg bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 max-h-[90vh] flex flex-col">

          {/* Header */}
          <div className="bg-zinc-950 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                <Car className="w-4 h-4 text-brand-primary" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white">Reserve Vehicle</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">{car.brand} {car.name} · {car.modelYear}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <StepBar current={step} />

          {/* Progress line */}
          <div className="h-0.5 bg-zinc-900 flex-shrink-0">
            <div className="h-0.5 bg-brand-primary transition-all duration-500" style={{ width: `${(step / 2) * 100}%` }} />
          </div>

          {/* Body — scrollable */}
          <div className="p-6 overflow-y-auto flex-1">

            {/* ── STEP 0: Contact ──────────────────────────────────────────── */}
            {step === 0 && (
              <div className="space-y-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Car className="w-3.5 h-3.5 text-brand-primary" /> Contact Details
                </p>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Delivery Address</label>
                    <input
                      type="text"
                      placeholder="123 Main Street, City, State"
                      value={form.address}
                      onChange={e => setField("address", e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Primary Number</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={form.phone}
                        onChange={e => setField("phone", e.target.value)}
                        className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-brand-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Alternate Number</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0001"
                        value={form.altPhone}
                        onChange={e => setField("altPhone", e.target.value)}
                        className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-brand-primary transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                  <div className="bg-zinc-50 dark:bg-zinc-900/60 px-5 py-3 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800">
                    <TrendingUp className="w-3.5 h-3.5 text-brand-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Payment Method</span>
                  </div>

                  <div className="bg-white dark:bg-zinc-950 px-5 py-4 space-y-4">
                    {/* Market valuation */}
                    <div className="flex items-start gap-2.5 px-3.5 py-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 rounded-xl">
                      <TrendingUp className="w-3.5 h-3.5 text-brand-primary flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        <span className="font-bold text-zinc-700 dark:text-zinc-300">Market Valuation:</span>{" "}
                        {car.name} ({car.modelYear}) is listed at{" "}
                        <span className="font-bold text-brand-primary">${car.sellingPrice?.toLocaleString()}</span>,
                        aligned with verified {car.brand} market rates. Delivery fee of ${DELIVERY_FEE.toLocaleString()} applies.
                      </p>
                    </div>

                    {/* Pay in Full / Finance toggle */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPaymentMode("full")}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left transition-all duration-200
                          ${paymentMode === "full"
                            ? "bg-brand-primary/5 border-brand-primary"
                            : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                      >
                        <Banknote className={`w-4 h-4 flex-shrink-0 ${paymentMode === "full" ? "text-brand-primary" : "text-zinc-400"}`} />
                        <div>
                          <p className={`text-[10px] font-bold uppercase tracking-widest ${paymentMode === "full" ? "text-brand-primary" : "text-zinc-600 dark:text-zinc-300"}`}>Pay in Full</p>
                          <p className="text-[10px] text-zinc-400 mt-0.5">${total.toLocaleString()} once</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setPaymentMode("finance")}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left transition-all duration-200
                          ${paymentMode === "finance"
                            ? "bg-brand-primary/5 border-brand-primary"
                            : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
                      >
                        <CreditCard className={`w-4 h-4 flex-shrink-0 ${paymentMode === "finance" ? "text-brand-primary" : "text-zinc-400"}`} />
                        <div>
                          <p className={`text-[10px] font-bold uppercase tracking-widest ${paymentMode === "finance" ? "text-brand-primary" : "text-zinc-600 dark:text-zinc-300"}`}>Finance</p>
                          <p className="text-[10px] text-zinc-400 mt-0.5">Monthly installments</p>
                        </div>
                      </button>
                    </div>

                    {/* Finance term picker — only when finance is selected */}
                    {paymentMode === "finance" && (
                      <div className="space-y-3 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Loan Term</p>
                          <div className="grid grid-cols-6 gap-1.5">
                            {FINANCE_TERMS.map(mo => (
                              <button
                                key={mo}
                                onClick={() => setFinanceTerm(mo)}
                                className={`h-9 rounded-xl text-[10px] font-bold tracking-wider border transition-all
                                  ${financeTerm === mo
                                    ? "bg-brand-primary/10 border-brand-primary text-brand-primary"
                                    : "border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600"}`}
                              >
                                {mo}mo
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-end justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800">
                          <div className="space-y-0.5">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Est. Monthly</p>
                            <p className="text-[10px] text-zinc-400 italic">{financeTerm} mo · {(APR * 100).toFixed(1)}% APR · incl. delivery</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-brand-primary tracking-tighter leading-none">
                              ${monthly.toLocaleString()}<span className="text-xs font-semibold text-zinc-400">/mo</span>
                            </p>
                            <p className="text-[10px] text-zinc-400 mt-0.5">Total: ${total.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <AnimatedButton
                  variant="primary"
                  className="w-full h-12 text-xs font-bold uppercase tracking-widest rounded-xl"
                  onClick={() => setStep(1)}
                  disabled={!form.address.trim() || !form.phone.trim()}
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </AnimatedButton>
              </div>
            )}

            {/* ── STEP 1: Delivery ─────────────────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Select Delivery Date & Time</p>

                <div className="delivery-calendar-wrap">
                  <DatePicker
                    selected={form.date}
                    onChange={d => { setField("date", d); setField("slot", null); }}
                    minDate={new Date()}
                    inline
                    calendarClassName="!bg-transparent !border-0 !w-full"
                  />
                </div>

                {form.date && (
                  <>
                    <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Select Time Window</p>
                      <div className="grid grid-cols-4 gap-2">
                        {TIME_SLOTS.map(s => (
                          <button
                            key={s}
                            onClick={() => setField("slot", s)}
                            className={`h-9 rounded-xl text-xs font-bold tracking-wider border transition-all
                              ${form.slot === s
                                ? "bg-brand-primary/10 border-brand-primary text-brand-primary"
                                : "border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-600"}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(0)}
                    className="h-12 px-5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <AnimatedButton
                    variant="primary"
                    className="flex-1 h-12 text-xs font-bold uppercase tracking-widest rounded-xl"
                    onClick={() => setStep(2)}
                    disabled={!form.date || !form.slot}
                  >
                    Review Order <ArrowRight className="w-4 h-4 ml-2" />
                  </AnimatedButton>
                </div>
              </div>
            )}

            {/* ── STEP 2: Confirm ──────────────────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Order Summary</p>

                <div className="bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {confirmRows.map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-start px-5 py-3 gap-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex-shrink-0 pt-0.5">{label}</span>
                        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 text-right">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-zinc-200 dark:border-zinc-700 px-5 py-3 space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      <span>Vehicle price</span><span>${car.sellingPrice?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      <span>Delivery fee</span><span>${DELIVERY_FEE.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Payment method row */}
                  <div className={`border-t border-zinc-200 dark:border-zinc-700 px-5 py-3 ${paymentMode === "finance" ? "bg-brand-primary/5" : "bg-emerald-50/60 dark:bg-emerald-950/10"}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      {paymentMode === "finance"
                        ? <CreditCard className="w-3 h-3 text-brand-primary" />
                        : <Banknote className="w-3 h-3 text-emerald-600" />}
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${paymentMode === "finance" ? "text-brand-primary" : "text-emerald-600 dark:text-emerald-500"}`}>
                        {paymentMode === "finance" ? `Financing — ${financeTerm} mo · ${(APR * 100).toFixed(1)}% APR` : "Pay in Full"}
                      </span>
                    </div>
                    {paymentMode === "finance" ? (
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-zinc-400">Estimated monthly payment</span>
                        <span className="text-sm font-bold text-brand-primary">${monthly.toLocaleString()}/mo</span>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-zinc-400">Full amount charged at delivery</span>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500">${total.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t-2 border-zinc-200 dark:border-zinc-700 px-5 py-4 flex justify-between items-end bg-white dark:bg-zinc-950">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Total Due</p>
                      <p className="text-[10px] text-zinc-400 italic">
                        {paymentMode === "finance"
                          ? `${financeTerm} monthly payments of $${monthly.toLocaleString()}`
                          : "Single payment at delivery"}
                      </p>
                    </div>
                    <p className="text-3xl font-bold text-brand-primary tracking-tighter leading-none">${total.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                    className="h-12 px-5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors disabled:opacity-40"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <AnimatedButton
                    variant="primary"
                    className="flex-1 h-12 text-xs font-bold uppercase tracking-widest rounded-xl shadow-xl shadow-brand-primary/20"
                    onClick={() => onConfirm(buildPayload())}
                    isLoading={isSubmitting}
                  >
                    <Lock className="w-3.5 h-3.5 mr-2" /> Confirm Order
                  </AnimatedButton>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}