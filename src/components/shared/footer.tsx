import Link from "next/link";
import Image from "next/image";

const linkClass = "text-sm text-gray-400 transition-colors hover:text-white";

export function Footer() {
  return (
    <footer className="bg-[#1F1F2E] text-white px-6 py-12 mt-auto">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-white mb-6"
        >
          <Image
            src="/logo.png"
            alt="Roamly"
            width={28}
            height={34}
            className="h-7 w-auto object-contain"
          />
          <span className="font-semibold text-lg text-white">Roamly</span>
        </Link>

        <p className="text-gray-400 text-sm mb-10 max-w-md">
          Your local guide in Romania.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16 max-w-lg">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
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
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
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

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} Roamly. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
