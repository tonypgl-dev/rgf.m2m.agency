import Link from "next/link";
import Image from "next/image";

const linkClass = "text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]";

export function Footer() {
  return (
    <footer className="bg-[#EDE9F8] dark:bg-[var(--bg-base)] border-t border-[rgba(120,100,180,0.12)] dark:border-border text-[var(--text-muted)] px-6 py-12 mt-auto">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-[var(--text-primary)] mb-6"
        >
          <Image
            src="/logo3.png"
            alt="Roamly"
            width={36}
            height={44}
            className="h-9 w-auto object-contain [filter:brightness(0.15)_saturate(2)] dark:[filter:none]"
          />
        </Link>

        <p className="text-[var(--text-muted)] text-sm mb-10 max-w-md">
          Your local guide in Romania.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16 max-w-lg">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Explore
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link href="/companions" className={linkClass}>
                  Browse Guides
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className={linkClass}>
                  How it works
                </Link>
              </li>
              <li>
                <Link href="#" className={linkClass}>
                  Safety
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Join us
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link href="/register" className={linkClass}>
                  Become a guide
                </Link>
              </li>
              <li>
                <Link href="/login" className={linkClass}>
                  Guide login
                </Link>
              </li>
              <li>
                <Link href="#" className={linkClass}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-[var(--text-muted)] text-xs">
          © {new Date().getFullYear()} Roamly. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
