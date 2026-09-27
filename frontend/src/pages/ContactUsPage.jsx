import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MessageSquare, Send } from "lucide-react";
import LandingNavbar from "../components/landing/LandingNavbar";

export function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    e.target.reset();
  };

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
              Contact Us
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Have a question or need help with NexusPlay? Send us a message and
              our support team will be happy to help.
            </p>
          </div>
        </section>

        <section className="bg-[#050A18] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-2xl border border-white/10 bg-[#091122] p-6 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <Mail size={21} />
              </div>

              <h2 className="mt-5 text-xl font-bold">
                We'd love to hear from you
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Whether you have a question about tournaments, registrations,
                sponsorships or your account, feel free to contact us.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex gap-3">
                  <MessageSquare
                    size={18}
                    className="mt-0.5 shrink-0 text-indigo-400"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      General Support
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Questions about using NexusPlay
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail size={18} className="mt-0.5 shrink-0 text-indigo-400" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      Support Hours
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      We'll get back to you as soon as possible.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#091122] p-6 sm:p-8">
              {submitted ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                    <Send size={24} />
                  </div>

                  <h2 className="mt-5 text-2xl font-bold">
                    Thanks for contacting us!
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                    Your message has been received. Our support team will get
                    back to you as soon as possible.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-6 rounded-lg border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-indigo-500/30 hover:text-white"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold">Send us a message</h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Fill in the details below.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-semibold text-slate-300">
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your name"
                          className="w-full rounded-lg border border-white/10 bg-[#050A18] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500/50"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold text-slate-300">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="you@example.com"
                          className="w-full rounded-lg border border-white/10 bg-[#050A18] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-300">
                        Subject
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="How can we help?"
                        className="w-full rounded-lg border border-white/10 bg-[#050A18] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500/50"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-300">
                        Message
                      </label>
                      <textarea
                        required
                        rows="6"
                        placeholder="Write your message..."
                        className="w-full resize-none rounded-lg border border-white/10 bg-[#050A18] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-indigo-500/50"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                    >
                      <Send size={17} />
                      Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
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

export default ContactUsPage;
