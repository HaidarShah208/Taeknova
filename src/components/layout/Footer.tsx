import { Facebook, Instagram, Mail, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Container } from '@components/ui/Container';
import { Input } from '@components/ui/Input';
import { APP_DESCRIPTION, APP_NAME } from '@constants/app';
import { FOOTER_NAV } from '@constants/navigation';

import { Logo } from './Logo';

const SOCIAL = [
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
];

export function Footer() {
  return (
    <footer className="relative mt-24 bg-foreground text-white">
      <div className="absolute left-0 right-0 top-0 h-16 -translate-y-full overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          className="h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,64 C120,98 240,98 360,72 C480,46 600,46 720,72 C840,98 960,98 1080,72 C1200,46 1320,46 1440,72 L1440,120 L0,120 Z"
            fill="#0F1729"
          />
        </svg>
      </div>
      <Container className="py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo size="lg" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white">
              {APP_DESCRIPTION}
            </p>
            <form
              className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={(event) => event.preventDefault()}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address"
                leftIcon={<Mail className="h-4 w-4" aria-hidden="true" />}
                className="border-slate-300/70 bg-white/80 text-white placeholder:text-slate-500 focus-visible:ring-primary/40"
                containerClassName="flex-1"
              />
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-3 text-xs text-slate-500">
              Join 25,000+ teams using {APP_NAME} for premium uniforms.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-7">
            {FOOTER_NAV.map((group) => (
              <div key={group.title}>
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-white">
                  {group.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className="text-xs text-white transition-colors hover:text-slate-900"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-300/60 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {SOCIAL.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={item.label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/80 text-white transition-colors hover:border-white hover:text-slate-900"
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
