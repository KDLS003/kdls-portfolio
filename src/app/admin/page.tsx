"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiAward,
  FiLayers,
  FiPlusCircle,
  FiRefreshCcw,
  FiTrash2,
} from "react-icons/fi";
import Link from "next/link";
import {
  Achievement,
  AchievementKind,
  AchievementStatus,
  badgeData,
  certificateData,
  defaultCategories,
} from "../../lib/achievements";
import {
  credlyBadges,
  credlyUpdateEvent,
  mergeCredlyLists,
  readCredlyStorage,
  writeCredlyStorage,
  type CredlyCategory,
  type CredlyEmbed,
} from "../../lib/credly";

interface AchievementForm extends Omit<Achievement, "kind"> {
  kind: AchievementKind;
}

const initialFormState: AchievementForm = {
  kind: "certificate",
  title: "",
  issuer: "",
  date: "",
  status: "earned",
  category: defaultCategories[0] ?? "General",
  takeaway: "",
  imageUrl: "",
  previewUrl: "",
  credentialUrl: "",
  pdfUrl: "",
  verificationNote: "",
};

const statusOptions: {
  label: string;
  value: AchievementStatus;
  helper: string;
}[] = [
  {
    label: "Earned",
    value: "earned",
    helper:
      "Use for certifications and badges that are fully complete and verifiable.",
  },
  {
    label: "Upcoming",
    value: "upcoming",
    helper: "Reserve space for milestones that are in progress or planned.",
  },
];

const tabCopy: Record<AchievementKind, { title: string; helper: string }> = {
  certificate: {
    title: "Certifications",
    helper: "Track accredited certifications, bootcamps, or intensive courses.",
  },
  badge: {
    title: "Badges",
    helper: "Capture micro-credentials and lightweight recognitions.",
  },
};

const credlyCategoryOptions: { label: string; value: CredlyCategory }[] = [
  {
    label: "Professional Certifications",
    value: "certification",
  },
  {
    label: "Digital Badges & Challenges",
    value: "badge",
  },
];

const credlyCategoryDescriptions: Record<CredlyCategory, string> = {
  certification:
    "Full-length credentials and assessments that validate in-depth skill mastery.",
  badge:
    "Micro-credentials, community challenges, and short-form achievements that show continued learning.",
};

const credlyScriptSrc = "https://cdn.credly.com/assets/utilities/embed.js";

interface CredlyFormState {
  rawInput: string;
  badgeId: string;
  category: CredlyCategory;
  title: string;
  issuer: string;
}

const initialCredlyForm: CredlyFormState = {
  rawInput: "",
  badgeId: "",
  category: "certification",
  title: "",
  issuer: "",
};

const extractCredlyBadgeId = (value: string) => {
  const pattern =
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  const match = value.match(pattern);

  return match?.[0] ?? "";
};

const FieldLabel = ({ label, helper }: { label: string; helper?: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm font-medium text-white">{label}</span>
    {helper ? <span className="text-xs text-gray-400">{helper}</span> : null}
  </div>
);

const Input = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 ${className ?? ""}`.trim()}
  />
);

const TextArea = ({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={`w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 ${className ?? ""}`.trim()}
  />
);

const TabButton = ({
  isActive,
  children,
  onClick,
}: {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm uppercase tracking-wide transition-colors ${
      isActive
        ? "border-primary bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(59,130,246,0.35)]"
        : "border-white/10 bg-dark text-gray-300 hover:border-primary/50 hover:text-primary"
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {children}
  </motion.button>
);

const PreviewCard = ({
  achievement,
  onDelete,
}: {
  achievement: Achievement;
  onDelete: (achievement: Achievement) => void;
}) => {
  const isUpcoming = achievement.status === "upcoming";

  return (
    <motion.article
      layout
      className="rounded-lg border border-white/10 bg-white/[0.03] p-4 shadow-lg"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wide text-primary">
            {achievement.category}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">
            {achievement.title}
          </h3>
          <p className="text-xs text-gray-400">{achievement.issuer}</p>
        </div>
        <div className="flex flex-col items-end gap-2 self-end sm:flex-row sm:items-center sm:justify-end sm:gap-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide leading-none ${
              isUpcoming
                ? "border border-primary/40 text-primary/80"
                : "border border-emerald-400/40 text-emerald-300"
            }`}
          >
            {isUpcoming ? "Upcoming" : "Earned"}
          </span>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  `Remove ${achievement.title}? This only updates the preview list.`,
                )
              ) {
                onDelete(achievement);
              }
            }}
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] p-2 text-gray-400 transition hover:border-red-400/60 hover:text-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 focus-visible:ring-0 sm:relative sm:z-10"
            aria-label={`Delete ${achievement.title}`}
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-400">{achievement.date}</p>
      {achievement.takeaway ? (
        <p className="mt-3 text-sm text-gray-300">{achievement.takeaway}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-3 text-[11px] uppercase tracking-wide text-gray-500">
        {achievement.previewUrl ? <span>Preview</span> : null}
        {achievement.credentialUrl ? <span>Credential Link</span> : null}
        {achievement.pdfUrl ? <span>PDF</span> : null}
        {achievement.verificationNote ? <span>Verification Note</span> : null}
      </div>
    </motion.article>
  );
};

export default function AdminPage() {
  const [form, setForm] = useState<AchievementForm>(initialFormState);
  const [certifications, setCertifications] =
    useState<Achievement[]>(certificateData);
  const [badges, setBadges] = useState<Achievement[]>(badgeData);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [newCategory, setNewCategory] = useState("");
  const [activeTab, setActiveTab] = useState<AchievementKind>("certificate");
  const [credlyItems, setCredlyItems] = useState<CredlyEmbed[]>(() => {
    const stored = readCredlyStorage();
    return mergeCredlyLists(credlyBadges, stored);
  });
  const [credlyForm, setCredlyForm] =
    useState<CredlyFormState>(initialCredlyForm);
  const [credlyError, setCredlyError] = useState<string | null>(null);
  const hasPersistedCredlyRef = useRef(false);

  const makeKey = (achievement: Achievement) =>
    [
      achievement.kind,
      achievement.title,
      achievement.issuer,
      achievement.date,
    ].join("::");

  useEffect(() => {
    const handleScriptLoad = () => {
      window.Credly?.Tracker?.init?.();
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${credlyScriptSrc}"]`,
    );

    if (existingScript) {
      if (window.Credly) {
        handleScriptLoad();
      } else {
        existingScript.addEventListener("load", handleScriptLoad);
      }

      return () => {
        existingScript.removeEventListener("load", handleScriptLoad);
      };
    }

    const script = document.createElement("script");
    script.src = credlyScriptSrc;
    script.async = true;
    script.addEventListener("load", handleScriptLoad);
    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", handleScriptLoad);
    };
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      window.Credly?.Tracker?.init?.();
    }, 60);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [credlyItems]);

  useEffect(() => {
    if (!hasPersistedCredlyRef.current) {
      hasPersistedCredlyRef.current = true;
      return;
    }

    writeCredlyStorage(credlyItems);
    window.dispatchEvent(
      new CustomEvent(credlyUpdateEvent, { detail: credlyItems }),
    );
  }, [credlyItems]);

  useEffect(() => {
    if (!categories.includes(form.category)) {
      setForm((prev) => ({ ...prev, category: categories[0] ?? "General" }));
    }
  }, [categories, form.category]);

  const previewItems = activeTab === "certificate" ? certifications : badges;

  const handleDelete = (achievement: Achievement) => {
    if (achievement.kind === "certificate") {
      setCertifications((prev) =>
        prev.filter((item) => makeKey(item) !== makeKey(achievement)),
      );
      return;
    }

    setBadges((prev) =>
      prev.filter((item) => makeKey(item) !== makeKey(achievement)),
    );
  };

  const addCategory = () => {
    const value = newCategory.trim();
    if (!value) return;
    if (!categories.some((cat) => cat.toLowerCase() === value.toLowerCase())) {
      setCategories((prev) => [...prev, value]);
    }
    setForm((prev) => ({ ...prev, category: value }));
    setNewCategory("");
  };

  const resetForm = useCallback(() => {
    setForm((prev) => ({
      ...initialFormState,
      category: categories[0] ?? "General",
      kind: prev.kind,
    }));
  }, [categories, setForm]);

  const resetCredlyForm = useCallback(() => {
    setCredlyForm((prev) => ({
      ...initialCredlyForm,
      category: prev.category,
    }));
    setCredlyError(null);
  }, [setCredlyError, setCredlyForm]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: Achievement = {
      ...form,
      takeaway: form.takeaway?.trim() ? form.takeaway : undefined,
      imageUrl: form.imageUrl?.trim() ? form.imageUrl : undefined,
      previewUrl: form.previewUrl?.trim() ? form.previewUrl : undefined,
      credentialUrl: form.credentialUrl?.trim()
        ? form.credentialUrl
        : undefined,
      pdfUrl: form.pdfUrl?.trim() ? form.pdfUrl : undefined,
      verificationNote: form.verificationNote?.trim()
        ? form.verificationNote
        : undefined,
    };

    if (form.kind === "certificate") {
      setCertifications((prev) => [payload, ...prev]);
    } else {
      setBadges((prev) => [payload, ...prev]);
    }

    resetForm();
    setActiveTab(form.kind);
  };

  const isUpcoming = form.status === "upcoming";

  const handleCredlyInputChange = useCallback(
    (value: string) => {
      const badgeId = extractCredlyBadgeId(value);

      setCredlyForm((prev) => ({
        ...prev,
        rawInput: value,
        badgeId,
      }));

      if (!value.trim()) {
        setCredlyError(null);
        return;
      }

      setCredlyError(
        badgeId
          ? null
          : "Unable to find a Credly badge UUID in the provided snippet or URL.",
      );
    },
    [setCredlyError, setCredlyForm],
  );

  const handleCredlySubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const parsedBadgeId =
        credlyForm.badgeId || extractCredlyBadgeId(credlyForm.rawInput);

      if (!parsedBadgeId) {
        setCredlyError(
          "Provide a Credly embed snippet or public badge URL so we can detect the badge UUID.",
        );
        return;
      }

      const payload: CredlyEmbed = {
        badgeId: parsedBadgeId,
        category: credlyForm.category,
        title: credlyForm.title.trim() || undefined,
        issuer: credlyForm.issuer.trim() || undefined,
      };

      setCredlyItems((prev) => {
        const filtered = prev.filter((item) => item.badgeId !== parsedBadgeId);
        return [payload, ...filtered];
      });

      resetCredlyForm();
    },
    [credlyForm, resetCredlyForm, setCredlyError, setCredlyItems],
  );

  const handleCredlyDelete = useCallback(
    (badge: CredlyEmbed) => {
      if (
        !window.confirm(
          `Remove badge ${badge.badgeId}? This only updates the preview list.`,
        )
      ) {
        return;
      }

      setCredlyItems((prev) =>
        prev.filter((item) => item.badgeId !== badge.badgeId),
      );
    },
    [setCredlyItems],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark to-dark-lighter py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            <div className="flex items-center justify-center gap-3 text-primary">
              <FiLayers className="h-6 w-6" />
              <span className="text-sm uppercase tracking-[0.4em] text-primary/80">
                Admin Toolkit
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Achievement Management Hub
            </h1>
            <p className="text-sm text-gray-400 sm:text-base">
              This tucked-away dashboard lets you organise certifications and
              badges without exposing the controls publicly. Add new
              achievements, reserve upcoming slots, and keep categories tidy for
              the main portfolio page.
            </p>
            <div className="text-xs text-gray-500">
              <span className="font-medium text-primary">Heads up:</span> This
              page is intentionally hidden from navigation. Bookmark it for
              quick access when you need to update your achievements.
            </div>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-2">
          <motion.form
            layout
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">
                Add a new achievement
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FiPlusCircle className="h-4 w-4 text-primary" />
                <span>Fields marked optional can be left blank.</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {(Object.keys(tabCopy) as AchievementKind[]).map((key) => (
                <TabButton
                  key={key}
                  isActive={form.kind === key}
                  onClick={() => setForm((prev) => ({ ...prev, kind: key }))}
                >
                  <FiAward className="h-4 w-4" />
                  {tabCopy[key].title}
                </TabButton>
              ))}
            </div>
            <p className="text-xs text-gray-500">{tabCopy[form.kind].helper}</p>

            <div className="grid gap-5">
              <div className="grid gap-2">
                <FieldLabel label="Title" />
                <Input
                  required
                  placeholder="e.g. CCNP Enterprise"
                  value={form.title}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <FieldLabel label="Issuer" />
                <Input
                  required
                  placeholder="Organisation or platform"
                  value={form.issuer}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, issuer: event.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <FieldLabel
                  label="Date"
                  helper="Use a friendly format (e.g. June 2025 or Q3 2025)."
                />
                <Input
                  required
                  placeholder="June 2025"
                  value={form.date}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, date: event.target.value }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <FieldLabel
                  label="Category"
                  helper="Keep related achievements grouped together on the public page."
                />
                <div className="flex flex-col gap-3">
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        category: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-2">
                    <Input
                      placeholder="Add new category"
                      value={newCategory}
                      onChange={(event) => setNewCategory(event.target.value)}
                      className="min-w-[12rem] flex-1"
                    />
                    <button
                      type="button"
                      onClick={addCategory}
                      className="rounded-md border border-primary/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary transition hover:bg-primary/10"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                <FieldLabel
                  label="Status"
                  helper="Switch to upcoming to reserve a placeholder slot."
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  {statusOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer flex-col gap-2 rounded-xl border px-4 py-3 text-sm transition ${
                        form.status === option.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-white/10 bg-white/[0.02] text-gray-300 hover:border-primary/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={option.value}
                        checked={form.status === option.value}
                        onChange={(event) =>
                          setForm((prev) => ({
                            ...prev,
                            status: event.target.value as AchievementStatus,
                          }))
                        }
                        className="hidden"
                      />
                      <span className="font-semibold uppercase tracking-wide">
                        {option.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {option.helper}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <FieldLabel
                  label="Key takeaway"
                  helper="Optional highlight that explains the value of this achievement."
                />
                <TextArea
                  rows={3}
                  placeholder="Summarise what this milestone means for your growth."
                  value={form.takeaway}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      takeaway: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-4 rounded-xl border border-white/10 bg-dark/40 p-4">
                <span className="text-sm font-medium text-white">
                  Verification resources
                </span>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <FieldLabel
                      label="Preview image URL"
                      helper={
                        isUpcoming
                          ? "Optional for upcoming achievements."
                          : "Displays in the main achievements grid."
                      }
                    />
                    <Input
                      placeholder="/images/preview/example.png"
                      value={form.previewUrl}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          previewUrl: event.target.value,
                        }))
                      }
                      disabled={isUpcoming}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FieldLabel
                      label="Badge image URL"
                      helper="Shown on the card when available."
                    />
                    <Input
                      placeholder="/images/example.png"
                      value={form.imageUrl}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          imageUrl: event.target.value,
                        }))
                      }
                      disabled={isUpcoming}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FieldLabel
                      label="Credential URL"
                      helper="Link to Credly or issuing platform."
                    />
                    <Input
                      placeholder="https://www.credly.com/..."
                      value={form.credentialUrl}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          credentialUrl: event.target.value,
                        }))
                      }
                      disabled={isUpcoming}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FieldLabel
                      label="PDF URL"
                      helper="Direct link to certificate PDF."
                    />
                    <Input
                      placeholder="/certifications/example.pdf"
                      value={form.pdfUrl}
                      onChange={(event) =>
                        setForm((prev) => ({
                          ...prev,
                          pdfUrl: event.target.value,
                        }))
                      }
                      disabled={isUpcoming}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <FieldLabel
                    label="Verification note"
                    helper="Optional context such as ‘Verification available on request’."
                  />
                  <Input
                    placeholder="Verification available on request."
                    value={form.verificationNote}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        verificationNote: event.target.value,
                      }))
                    }
                    disabled={isUpcoming}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-secondary"
              >
                <FiPlusCircle className="h-4 w-4" />
                Save achievement
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-xs uppercase tracking-wide text-gray-300 transition hover:border-primary/60 hover:text-primary"
              >
                <FiRefreshCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </motion.form>

          <section className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Live preview
                </h2>
                <p className="text-xs text-gray-400">
                  Review how the public grid will look before publishing any
                  changes.
                </p>
              </div>
              <Link
                href="/"
                className="text-xs font-semibold uppercase tracking-wide text-primary underline-offset-4 hover:underline"
              >
                View portfolio
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              {(Object.keys(tabCopy) as AchievementKind[]).map((key) => (
                <TabButton
                  key={key}
                  isActive={activeTab === key}
                  onClick={() => setActiveTab(key)}
                >
                  <FiAward className="h-4 w-4" />
                  {tabCopy[key].title}
                </TabButton>
              ))}
            </div>

            {previewItems.length > 0 ? (
              <motion.div layout className="grid gap-4 md:grid-cols-2">
                <AnimatePresence>
                  {previewItems.map((achievement) => (
                    <PreviewCard
                      key={`${achievement.title}-${achievement.date}`}
                      achievement={achievement}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-dark/40 p-10 text-center text-sm text-gray-400">
                <FiAward className="h-6 w-6 text-primary" />
                <p>
                  No achievements yet. Start by adding a new record on the left.
                </p>
              </div>
            )}
          </section>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-xl font-semibold text-white">
                Credly badge embeds
              </h2>
              <p className="text-xs text-gray-400 sm:text-sm">
                Control the badges that appear on the public Certifications
                &amp; Badges section. Paste the embed code or a public badge
                URL, optionally add metadata, and review the live embeds without
                leaving this page.
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/70">
              Credly
            </span>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
            <form
              onSubmit={handleCredlySubmit}
              className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-dark/40 p-6"
            >
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FieldLabel
                    label="Credly embed snippet or badge URL"
                    helper="Paste the iframe embed snippet from Credly or a public badge URL. We'll auto-detect the badge UUID."
                  />
                  <TextArea
                    rows={4}
                    placeholder='<div class="credly-badge" data-share-badge-id="..." /> or https://www.credly.com/badges/...'
                    value={credlyForm.rawInput}
                    onChange={(event) =>
                      handleCredlyInputChange(event.target.value)
                    }
                    className="min-h-[150px]"
                  />
                  {credlyError ? (
                    <p className="text-xs text-red-400">{credlyError}</p>
                  ) : credlyForm.badgeId ? (
                    <p className="text-xs text-emerald-400">
                      Badge detected successfully.
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-2">
                  <FieldLabel
                    label="Detected badge UUID"
                    helper="This value powers the embed. Double-check it matches the intended badge before saving."
                  />
                  <Input
                    value={credlyForm.badgeId}
                    readOnly
                    placeholder="Badge UUID will appear once detected"
                  />
                </div>

                <div className="grid gap-2">
                  <FieldLabel
                    label="Category"
                    helper="Choose where the badge will appear on the public page."
                  />
                  <select
                    value={credlyForm.category}
                    onChange={(event) =>
                      setCredlyForm((prev) => ({
                        ...prev,
                        category: event.target.value as CredlyCategory,
                      }))
                    }
                    className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {credlyCategoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2">
                  <FieldLabel
                    label="Title (optional)"
                    helper="Override the badge title shown in the portfolio. Leave blank to use Credly's default."
                  />
                  <Input
                    placeholder="e.g. AWS Certified Cloud Practitioner"
                    value={credlyForm.title}
                    onChange={(event) =>
                      setCredlyForm((prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <FieldLabel
                    label="Issuer (optional)"
                    helper="Add context about the awarding organisation."
                  />
                  <Input
                    placeholder="e.g. Amazon Web Services"
                    value={credlyForm.issuer}
                    onChange={(event) =>
                      setCredlyForm((prev) => ({
                        ...prev,
                        issuer: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-secondary"
                >
                  <FiPlusCircle className="h-4 w-4" />
                  Save badge
                </button>
                <button
                  type="button"
                  onClick={resetCredlyForm}
                  className="flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-xs uppercase tracking-wide text-gray-300 transition hover:border-primary/60 hover:text-primary"
                >
                  <FiRefreshCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </form>

            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Live embed preview
                </h3>
                <p className="text-xs text-gray-400 sm:text-sm">
                  Badges render exactly as they will on the public site.
                  Deleting an item only affects this local preview list.
                </p>
              </div>

              <div className="grid gap-8">
                {credlyCategoryOptions.map((option) => {
                  const items = credlyItems.filter(
                    (item) => item.category === option.value,
                  );

                  return (
                    <div key={option.value} className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
                          {option.label}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {credlyCategoryDescriptions[option.value]}
                        </p>
                      </div>

                      {items.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                          {items.map((item) => {
                            const title = item.title ?? "Credly Badge";

                            return (
                              <div
                                key={item.badgeId}
                                className="group relative flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 via-dark/30 to-dark/40 p-4 shadow-lg shadow-black/10 backdrop-blur-sm"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="space-y-2">
                                    {item.issuer ? (
                                      <p className="text-[11px] uppercase tracking-[0.35em] text-primary/70">
                                        {item.issuer}
                                      </p>
                                    ) : null}
                                    <h5 className="text-base font-semibold text-white">
                                      {title}
                                    </h5>
                                    <p className="text-[11px] font-mono text-gray-500">
                                      {item.badgeId}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleCredlyDelete(item)}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-gray-400 transition hover:border-red-400/60 hover:text-red-400"
                                    aria-label={`Delete ${title}`}
                                  >
                                    <FiTrash2 className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="relative flex grow items-center justify-center rounded-xl border border-white/10 bg-black/20 p-3">
                                  <div className="credly-badge-frame w-full max-w-[280px]">
                                    <div
                                      className="credly-badge block h-[280px] w-full"
                                      data-iframe-width="280"
                                      data-iframe-height="280"
                                      data-hide-footer="true"
                                      data-hide-share="true"
                                      data-share-badge-id={item.badgeId}
                                      data-share-badge-host="https://www.credly.com"
                                    />
                                    <span
                                      className="credly-badge-overlay"
                                      aria-hidden="true"
                                    />
                                  </div>
                                </div>
                                <a
                                  href={`https://www.credly.com/badges/${item.badgeId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-medium uppercase tracking-wide text-primary transition hover:text-secondary"
                                >
                                  View on Credly
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-white/10 bg-dark/40 p-8 text-center text-xs text-gray-500">
                          No badges saved for this category yet.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
