import { Accordion, AccordionItem } from '@components/ui/Accordion';
import { SectionWrapper } from '@components/shared/SectionWrapper';

const FAQS = [
  {
    id: 'lead-time',
    question: 'How long does a custom team order take?',
    answer:
      'Standard production is 14 days from approved mockups, plus shipping. Rush options can compress that to 7 days for an additional fee — talk to your Tikwando stylist when you start an order.',
  },
  {
    id: 'minimum',
    question: 'Is there a minimum order for custom uniforms?',
    answer:
      'There is no minimum on initial samples. Bulk team pricing kicks in at 10+ pieces, and we offer dedicated account management for orders of 50+.',
  },
  {
    id: 'fabric',
    question: 'What fabrics do you use?',
    answer:
      'Our default performance kits use a 4-way stretch, moisture-wicking polyester blend with mesh ventilation panels. Premium and heritage tiers add merino and recycled polyester options.',
  },
  {
    id: 'customization',
    question: 'Which customization techniques are available?',
    answer:
      'You can mix and match dye-sublimation, screen printing, heat-press transfers, and embroidered crests on the same uniform. We will recommend the best fit for your design.',
  },
  {
    id: 'shipping',
    question: 'Do you ship internationally?',
    answer:
      'Yes — we ship to 30+ countries with full tracking. Shipping costs are calculated at checkout based on weight and destination, and orders over $150 ship free domestically.',
  },
  {
    id: 'returns',
    question: 'What is your return policy?',
    answer:
      'In-stock items are returnable within 30 days unworn and unwashed. Custom uniforms are made to order and final sale, but we stand behind every kit with a lifetime stitch warranty.',
  },
  {
    id: 'design-help',
    question: 'I do not have a design — can you help?',
    answer:
      'Absolutely. Our in-house design studio offers complimentary mockups for teams. Share a brief and our designers will deliver three concept directions within 48 hours.',
  },
  {
    id: 'reorders',
    question: 'How do reorders work?',
    answer:
      'Once a design is on file, reorders can be placed in two clicks. Sizing, colors, and player names are saved to your team profile for instant repeat production.',
  },
];

export function FaqSection() {
  return (
    <SectionWrapper
      tone="default"
      eyebrow="Questions, answered"
      title="Everything teams ask before ordering."
      description="Still curious about lead times, fabrics, or customization? Here is the rundown — and our team is one click away if you want to talk it through."
    >
      <div className="rounded-2xl border border-border bg-card px-6 py-2">
        <Accordion type="single" defaultOpen={['lead-time']}>
          {FAQS.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} trigger={faq.question}>
              {faq.answer}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionWrapper>
  );
}
