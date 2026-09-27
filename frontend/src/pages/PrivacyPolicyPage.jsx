import { Link } from "react-router-dom";
import LandingNavbar from "../components/landing/LandingNavbar";

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      "NexusPlay may collect information required to create and operate an account, including name, email address, mobile number, college information and account credentials.",
      "Participants may provide tournament registration information such as player details, game UID or IGN, contact information, team information and required agreements.",
      "Organizers may be required to provide organization information, representative details, address and verification information including Aadhaar and PAN details.",
      "Sponsors may provide company information, representative details, contact information, sponsorship preferences and verification information.",
      "Payment transactions may contain payment-related identifiers provided by the payment gateway. NexusPlay does not store sensitive payment credentials such as card PINs or banking passwords.",
    ],
  },
  {
    title: "2. How We Use Information",
    content: [
      "We use account information to provide authentication and access to the appropriate NexusPlay features.",
      "Tournament and registration information is used to manage participation, teams, tournament capacity and tournament records.",
      "Organizer and sponsor verification information is used to review eligibility and maintain platform trust and safety.",
      "Information may be used to process payments, verify transactions, provide support, prevent fraud and maintain platform security.",
      "We may use information to communicate important updates regarding accounts, tournaments, registrations, sponsorships, payments and platform operations.",
    ],
  },
  {
    title: "3. Payment Information",
    content: [
      "NexusPlay uses third-party payment services such as Razorpay to process applicable tournament and sponsorship payments.",
      "Payment processing is subject to the payment provider's terms and policies.",
      "NexusPlay may store transaction identifiers, payment status and related records required to maintain transaction history and verify successful payments.",
      "NexusPlay does not ask users to provide passwords, PINs or other confidential banking credentials directly through the platform.",
    ],
  },
  {
    title: "4. Tournament Cancellation and Refunds",
    content: [
      "Tournament organizers are responsible for the tournaments they create and manage, including tournament schedules, rules, prize commitments and cancellation decisions.",
      "If an organizer cancels a tournament after participants have registered, NexusPlay is not responsible for the organizer's cancellation decision or for guaranteeing a refund from the organizer.",
      "Where applicable, NexusPlay may assist in communicating with the organizer or facilitating the refund process. However, the availability and completion of a refund may depend on the organizer and the applicable payment process.",
      "Participants should review tournament details, rules and cancellation conditions before completing registration and payment.",
    ],
  },
  {
    title: "5. Organizer Responsibilities",
    content: [
      "Organizers must provide accurate organization, representative and verification information.",
      "Organizers are responsible for conducting tournaments according to the information, rules and commitments published on NexusPlay.",
      "If an organizer cancels a tournament without completing it, the organizer is responsible for addressing participant claims and applicable refunds.",
      "Failure to fulfill participant payment or refund obligations may result in suspension or removal from NexusPlay and may expose the organizer to claims or other legal consequences under applicable law.",
      "Organizers must not misuse participant information and must use participant data only for legitimate tournament-related purposes.",
      "Organizers must fulfill approved sponsorship requirements and commitments agreed with sponsors. Failure to meet approved sponsorship requirements may result in platform action, including suspension or removal, and may also result in disputes or legal consequences under applicable agreements and law.",
    ],
  },
  {
    title: "6. Sponsor Responsibilities",
    content: [
      "Sponsors must provide accurate company, representative and verification information.",
      "Sponsors must submit genuine sponsorship requests and provide accurate information about their requirements, budget and intended support.",
      "Sponsors are responsible for completing approved sponsorship payments within the agreed terms.",
      "After a sponsorship request has been approved, sponsors should communicate clearly with the organizer regarding sponsorship requirements and deliverables.",
      "Sponsors must not use NexusPlay to submit fraudulent, misleading, abusive or inappropriate sponsorship proposals.",
      "NexusPlay may suspend or restrict sponsors who repeatedly fail to honor approved sponsorship commitments or misuse the platform.",
    ],
  },
  {
    title: "7. Participant Rules and Fair Play",
    content: [
      "Participants must provide accurate registration and player information.",
      "Cheating, hacking, exploiting game bugs, using unauthorized software, account sharing or attempting to manipulate tournament results is prohibited.",
      "Participants must not use abusive, threatening, discriminatory, hateful or sexually inappropriate language or behavior toward other participants, organizers, sponsors or NexusPlay staff.",
      "Participants must follow the rules and requirements published by the tournament organizer.",
      "NexusPlay or the tournament organizer may take appropriate action against violations, including warnings, removal from a tournament, cancellation of participation, suspension or account termination.",
      "Serious or unlawful conduct may be reported to appropriate authorities where required or appropriate under applicable law.",
    ],
  },
  {
    title: "8. Organizer and Sponsor Verification",
    content: [
      "Certain organizer and sponsor accounts may require verification before they can access specific platform functions.",
      "Verification information must be accurate and belong to the person or organization submitting it.",
      "Submitting false, altered or misleading verification information may result in rejection, suspension or termination of the account.",
      "Verification approval does not guarantee the future conduct, performance or financial obligations of an organizer or sponsor.",
    ],
  },
  {
    title: "9. Account Security",
    content: [
      "Users are responsible for maintaining the confidentiality of their account credentials.",
      "Users should immediately report suspected unauthorized access or suspicious account activity.",
      "NexusPlay may restrict or suspend accounts when necessary to protect users, tournaments, payments or the platform.",
    ],
  },
  {
    title: "10. Account Suspension and Termination",
    content: [
      "NexusPlay may suspend, restrict or terminate accounts that violate platform rules, misuse platform features, provide false information or engage in fraudulent or harmful activity.",
      "NexusPlay may also take action where necessary to protect the security and integrity of the platform.",
      "Account action does not remove any obligations or liabilities that arose before the suspension or termination.",
    ],
  },
  {
    title: "11. Data Security",
    content: [
      "NexusPlay uses reasonable technical and organizational measures to protect information against unauthorized access, alteration, misuse or disclosure.",
      "No online platform can guarantee absolute security. Users should avoid sharing passwords, payment credentials or other confidential information with anyone.",
      "Access to sensitive verification information should be limited to authorized platform functions and personnel where applicable.",
    ],
  },
  {
    title: "12. Cookies and Technical Information",
    content: [
      "NexusPlay may use cookies, browser storage and similar technologies where required for authentication, session management, preferences and platform functionality.",
      "Technical information such as browser type, device information and basic usage information may be processed to maintain security, troubleshoot issues and improve the platform.",
    ],
  },
  {
    title: "13. Third-Party Services",
    content: [
      "NexusPlay may use third-party services for payment processing, hosting, authentication, communication and other platform functionality.",
      "Information processed by third-party services may also be subject to their respective terms and privacy policies.",
      "Users should review the policies of third-party services when using features that depend on them.",
    ],
  },
  {
    title: "14. Data Retention",
    content: [
      "NexusPlay may retain account, tournament, registration, sponsorship and transaction records for as long as reasonably necessary to provide services, maintain records, resolve disputes, prevent fraud and comply with applicable requirements.",
      "Retention periods may vary depending on the type of information and the purpose for which it is maintained.",
    ],
  },
  {
    title: "15. Your Privacy Choices",
    content: [
      "Users may review and update available account information through their profile settings.",
      "Users should contact NexusPlay if they believe their information is inaccurate or if they have questions regarding the handling of their information.",
      "Certain information may need to be retained where required for legitimate platform operations, transaction records, dispute resolution or applicable legal requirements.",
    ],
  },
  {
    title: "16. Policy Updates",
    content: [
      "NexusPlay may update this Privacy Policy and platform rules as the platform develops or requirements change.",
      "Updated policies will be made available through the platform. Continued use of NexusPlay after an update may be subject to the updated policy.",
    ],
  },
];

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#050A18] text-white">
      <LandingNavbar />

      <main>
        <section className="border-b border-white/10 bg-[#07101F] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
              NexusPlay Policies
            </p>

            <h1 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Privacy Policy & Platform Rules
            </h1>

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
              This page explains how NexusPlay handles user information and
              outlines important responsibilities and rules for participants,
              organizers and sponsors.
            </p>

            <p className="mt-5 text-xs text-slate-600">
              Last updated: September 2026
            </p>
          </div>
        </section>

        <section className="bg-[#050A18] px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <h2 className="text-sm font-bold text-amber-300">
                Important Notice
              </h2>

              <p className="mt-2 text-xs leading-6 text-slate-400 sm:text-sm">
                NexusPlay is a tournament management platform. Tournament
                organizers are responsible for the tournaments they conduct,
                including their rules, commitments, cancellations and applicable
                participant refunds. Nothing on this page should be treated as
                legal advice. Users and organizations should obtain independent
                legal advice where necessary.
              </p>
            </div>

            <div className="space-y-5">
              {sections.map((section) => (
                <section
                  key={section.title}
                  className="rounded-xl border border-white/10 bg-[#091122] p-5 sm:p-6"
                >
                  <h2 className="text-base font-bold sm:text-lg">
                    {section.title}
                  </h2>

                  <div className="mt-3 space-y-3">
                    {section.content.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-xs leading-6 text-slate-400 sm:text-sm"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-indigo-500/20 bg-[#091122] p-6 text-center">
              <h2 className="text-lg font-bold">
                Questions about our policies?
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
                If you have questions about privacy, tournament rules,
                sponsorships or account policies, contact the NexusPlay support
                team.
              </p>

              <Link
                to="/contact-us"
                className="mt-5 inline-flex rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Contact Us
              </Link>
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

export default PrivacyPolicyPage;
