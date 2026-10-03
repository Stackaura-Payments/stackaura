import Link from "next/link";
import type { ReactNode } from "react";
import {
  BrandLockup,
  cn,
  PublicBackground,
  publicFieldLabelClass,
  publicFormSurfaceClass,
} from "./stackaura-ui";

type AuthFeature = {
  label: string;
  title: string;
  description: string;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  features,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  features: readonly AuthFeature[];
  children: ReactNode;
}) {
  return (
    <PublicBackground className="bg-[#0d1b20] text-white dark:bg-[#0d1b20]">
      <div className="dark relative min-h-screen bg-[#0d1b20] text-white">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(121,159,151,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(121,159,151,.16)_1px,transparent_1px)] [background-size:64px_64px]" aria-hidden="true" />

        <div className="relative flex min-h-screen justify-center px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="w-full max-w-[1240px]">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
              <div className="shrink-0">
                <BrandLockup inverse />
              </div>

              <div className="ml-auto shrink-0">
                <Link
                  href="/"
                  className="text-sm font-medium text-[#c5f273] transition hover:text-white"
                >
                  Back to home
                </Link>
              </div>
            </div>

            <section className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,520px)] lg:items-start lg:gap-16">
              <section className="hidden max-w-md lg:block lg:space-y-8 lg:pt-3">
                <div>
                  <div className={publicFieldLabelClass}>{eyebrow}</div>
                  <h1 className="mt-5 text-5xl font-semibold leading-[1.08] text-white">
                    {title}
                  </h1>
                  <p className="mt-5 text-base leading-7 text-[#b9cbc3]">
                    {description}
                  </p>
                </div>

                <div className="space-y-0 border-t border-[#37574e]">
                  {features.map((feature, index) => (
                    <div
                      key={feature.title}
                      className="border-b border-[#37574e] py-5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center border border-[#527269] text-sm font-semibold text-[#c5f273]">
                          {index + 1}
                        </span>
                        <div>
                          <div className={publicFieldLabelClass}>{feature.label}</div>
                          <div className="mt-1 text-base font-semibold text-white">{feature.title}</div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#b9cbc3]">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mx-auto w-full max-w-xl lg:ml-auto lg:mr-0 lg:max-w-[520px] lg:pt-10">
                {children}
              </section>
            </section>
          </div>
        </div>
      </div>
    </PublicBackground>
  );
}

export function AuthFormFrame({
  eyebrow,
  title,
  description,
  status,
  statusTone = "muted",
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  status?: string;
  statusTone?: "success" | "violet" | "muted" | "warning";
  children: ReactNode;
}) {
  return (
    <div className={cn("auth-card-enter mx-auto max-w-xl p-6 sm:p-8 lg:p-9", publicFormSurfaceClass)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className={publicFieldLabelClass}>{eyebrow}</div>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            {title}
          </h2>
        </div>

        {status ? <span className={cn("border px-2.5 py-1 text-xs font-semibold", statusTone === "success" ? "border-[#9fc2aa] text-[#c5f273]" : "border-[#527269] text-[#b9cbc3]")}>{status}</span> : null}
      </div>

      <p className="mt-4 text-sm leading-6 text-[#b9cbc3]">{description}</p>

      <div className="mt-8">{children}</div>
    </div>
  );
}
