import { ArrowRight, BadgePercent, Mail, Sparkles } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';

import { Button } from '@components/ui/Button';
import { Container } from '@components/ui/Container';
import { Input } from '@components/ui/Input';

const PERKS = [
  { icon: BadgePercent, label: 'Early access to drops' },
  { icon: Sparkles, label: 'Members-only discounts' },
  { icon: Mail, label: 'Team styling tips & guides' },
];

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    setEmail('');
    toast.success('You are in. Check your inbox for a welcome offer.');
  };

  return (
    <section className="relative overflow-hidden bg-foreground py-16 text-background sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
      />

      <Container className="relative">
        <div className="mx-auto grid max-w-5xl gap-10 rounded-3xl border border-background/10 bg-background/5 p-8 backdrop-blur sm:p-10 lg:grid-cols-2 lg:p-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-background/30 bg-background/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-background/80">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              Newsletter
            </span>
            <h2 className="mt-4 text-white font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Join the Tiknova insider list.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-background/75 sm:text-base">
              Be first in line for new drops, team-pricing previews, and limited-edition kits.
              No spam — just the good stuff.
            </p>
            <ul className="mt-6 space-y-2.5">
              {PERKS.map((perk) => (
                <li key={perk.label} className="flex items-center gap-2.5 text-sm text-background/85">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-background/10 text-background">
                    <perk.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {perk.label}
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center gap-4 rounded-2xl border border-background/10 bg-background/5 p-6 sm:p-8"
          >
            <label className="text-xs font-semibold uppercase tracking-widest text-background/70">
              Email address
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@team.com"
              autoComplete="email"
              size="lg"
              leftIcon={<Mail className="h-4 w-4" aria-hidden="true" />}
              className="border-background/20 bg-background/5 text-background placeholder:text-background/60 focus-visible:ring-background/40"
            />
            <Button
              type="submit"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="h-4 w-4" />}
              className="bg-background text-foreground hover:bg-background/90"
            >
              Subscribe
            </Button>
            <p className="text-xs leading-relaxed text-background/60">
              By subscribing, you agree to receive emails from Tiknova. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
}
