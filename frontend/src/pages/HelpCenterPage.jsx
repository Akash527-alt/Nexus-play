import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  User,
  Trophy,
  CreditCard,
  ShieldCheck,
  Handshake,
  HelpCircle,
  ChevronDown,
  Mail,
} from "lucide-react";
import LandingNavbar from "../components/landing/LandingNavbar";

const categories = [
  {
    icon: User,
    title: "Account & Login",
    description: "Registration, login, profiles and account access.",
  },
  {
    icon: Trophy,
    title: "Tournaments",
    description: "Find tournaments, registrations and participation.",
  },
  {
    icon: CreditCard,
    title: "Payments",
    description: "Tournament and sponsorship payment information.",
  },
  {
    icon: ShieldCheck,
    title: "Verification",
    description: "Organizer and sponsor verification process.",
  },
  {
    icon: Handshake,
    title: "Sponsorships",
    description: "Sponsorship requests, approvals and payments.",
  },
  {
    icon: HelpCircle,
    title: "General Help",
    description: "General questions about using NexusPlay.",
  },
];

const faqs = [
  {
    question: "How do I create a NexusPlay account?",
    answer:
      "Click Register and select the appropriate account type. Enter the required details and complete the registration process.",
  },
  {
    question: "How can I register for a tournament?",
    answer:
      "Browse the available tournaments, select a tournament, enter the required player or team details, accept the required agreements and complete the payment if applicable.",
  },
  {
    question: "When is my tournament registration confirmed?",
    answer:
      "For paid tournaments, your registration is confirmed after the payment is successfully completed and verified.",
  },
  {
    question: "How does organizer verification work?",
    answer:
      "Organizers submit their required organization and verification details. The Super Admin reviews the information and approves or rejects the verification request.",
  },
  {
    question: "How can I become a sponsor?",
    answer:
      "Register as a sponsor and complete the required sponsor information. After Super Admin verification, you can browse tournaments and submit sponsorship requests.",
  },
  {
    question: "How does tournament sponsorship work?",
    answer:
      "A verified sponsor can select a tournament and submit a sponsorship request. The organizer reviews the request. Once approved, the sponsor can complete the sponsorship payment.",
  },
  {
    question: "Where can I see my tournament participation history?",
    answer:
      "Participants can view their previous tournament participation from the History section of their dashboard.",
  },
  {
    question: "What should I do if I cannot log in?",
    answer:
      "Check your email and password and try again. If you have forgotten your password, use the Forgot Password option on the login page.",
  },
];

export function HelpCenterPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter((faq) =>
    `${faq.question} ${faq.answer}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#050A18] text-white">
      <LandingNavbar />

      <main>
        <section className="border-b border-white/10 bg-[#07101F] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Support
            </p>

            <h1 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
              How can we help?
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Find answers to common questions about accounts, tournaments,
              payments and sponsorships on NexusPlay.
            </p>

            <div className="relative mx-auto mt-8 max-w-2xl">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                placeholder="Search for help..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#091122] py-4 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50"
              />
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#050A18] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
                Help Topics
              </p>

              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Browse by category
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const Icon = category.icon;

                return (
                  <div
                    key={category.title}
                    className="rounded-xl border border-white/10 bg-[#091122] p-5 transition hover:border-indigo-500/30"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Icon size={20} />
                    </div>

                    <h3 className="mt-4 text-sm font-bold sm:text-base">
                      {category.title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm">
                      {category.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#07101F] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
                Frequently Asked Questions
              </p>

              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Common questions
              </h2>
            </div>

            <div className="space-y-3">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => {
                  const isOpen = openFaq === index;

                  return (
                    <div
                      key={faq.question}
                      className="overflow-hidden rounded-xl border border-white/10 bg-[#091122]"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      >
                        <span className="text-sm font-semibold text-slate-200">
                          {faq.question}
                        </span>

                        <ChevronDown
                          size={18}
                          className={`shrink-0 text-slate-500 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="border-t border-white/10 px-5 py-4">
                          <p className="text-xs leading-6 text-slate-400 sm:text-sm">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-white/10 bg-[#091122] px-5 py-10 text-center">
                  <p className="text-sm text-slate-400">
                    No matching questions found.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-[#050A18] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-4xl rounded-2xl border border-indigo-500/20 bg-[#091122] p-7 text-center sm:p-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
              <Mail size={22} />
            </div>

            <h2 className="mt-5 text-xl font-bold sm:text-2xl">
              Still need help?
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">
              If you could not find the answer you were looking for, contact the
              NexusPlay support team.
            </p>

            <Link
              to="/contact-us"
              className="mt-6 inline-flex rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#030711]">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div>
              <p className="text-base font-bold">
                Nexus<span className="text-indigo-500">Play</span>
              </p>

              <p className="mt-1 text-[10px] text-slate-600">
                Compete. Connect. Conquer.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-5 text-xs text-slate-500 sm:justify-end">
              <Link
                to="/help-center"
                className="transition hover:text-slate-300"
              >
                Help Center
              </Link>

              <Link
                to="/contact-us"
                className="transition hover:text-slate-300"
              >
                Contact Us
              </Link>

              <Link
                to="/privacy-policy"
                className="transition hover:text-slate-300"
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-5 text-center text-[10px] text-slate-600">
            © {new Date().getFullYear()} NexusPlay. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HelpCenterPage;
