import { Copy, Download, MessageCircle, Share2 } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';

import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import type { Product } from '@app-types/product';
import { buildProductShareLinkUrl } from '@lib/shareUrls';

export interface ProductShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  imageUrl: string;
}

function humanizeCategorySlug(slug: string): string {
  if (!slug.trim()) return '—';
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function buildFormattedShareMessage(product: Product, url: string): string {
  const v0 = product.variants[0];
  const moreVariants = product.variants.length > 1;
  const sizeLine = v0
    ? `${v0.size}${v0.color ? ` · ${v0.color}` : ''}${moreVariants ? ' (more options on product page)' : ''}`
    : 'See product page';
  const productNo =
    v0?.sku?.trim() ||
    (typeof product.id === 'string' && product.id.trim() ? product.id : '') ||
    'Not specified';
  const category = humanizeCategorySlug(product.categorySlug);
  const headline = (product.title || 'Uniform order').toUpperCase();

  return [
    `🥋 *${headline}* 🥋`,
    '',
    `📏 *Size:* ${sizeLine}`,
    `📁 *Category:* ${category}`,
    `🏷 *Product No:* ${productNo}`,
    `✨ *Brand:* ${product.brand || '—'}`,
    '',
    `🔗 *View full details & order:*`,
    url,
    '',
    '🚚 *Fast delivery across Pakistan*',
    '💬 *Contact for pricing & orders*',
  ].join('\n');
}

export function ProductShareModal({ isOpen, onClose, product, imageUrl }: ProductShareModalProps) {
  const url = useMemo(() => buildProductShareLinkUrl(product.slug), [product.slug]);
  const shareText = useMemo(() => buildFormattedShareMessage(product, url), [product, url]);

  const copyCombined = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('Copied full product details + link');
    } catch {
      toast.error('Could not copy to clipboard');
    }
  }, [shareText]);

  const copyLinkOnly = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied');
    } catch {
      toast.error('Could not copy link');
    }
  }, [url]);

  const openWhatsApp = useCallback(() => {
    const text = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  }, [shareText]);

  const downloadImage = useCallback(async () => {
    if (!imageUrl) {
      toast.error('No image available');
      return;
    }
    try {
      const res = await fetch(imageUrl, { mode: 'cors' });
      if (!res.ok) throw new Error('fetch failed');
      const blob = await res.blob();
      const ext = blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : 'jpg';
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `${product.slug.replace(/[^\w-]+/g, '-') || 'product'}.${ext}`;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      toast.success('Image download started');
    } catch {
      try {
        window.open(imageUrl, '_blank', 'noopener,noreferrer');
        toast.info('Opened image in a new tab — save from there if download is blocked.');
      } catch {
        toast.error('Could not download image (blocked by browser or CORS).');
      }
    }
  }, [imageUrl, product.slug]);

  const quickShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: shareText,
          url,
        });
        toast.success('Shared');
      } catch (e) {
        if ((e as Error).name === 'AbortError') return;
        await copyCombined();
      }
    } else {
      await copyCombined();
    }
  }, [copyCombined, product.title, shareText, url]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share product"
      size="lg"
       
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl border border-border bg-muted shadow-soft">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No image</div>
          )}
        </div>
        <p className="line-clamp-2 text-center text-sm font-semibold text-foreground">{product.title}</p>

        

        <div className="grid w-full gap-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            leftIcon={<MessageCircle className="h-4 w-4" />}
            onClick={openWhatsApp}
          >
            WhatsApp
          </Button>
          <Button type="button" variant="outline" leftIcon={<Copy className="h-4 w-4" />} onClick={() => void copyCombined()}>
            Copy details + link
          </Button>
          <Button type="button" variant="outline" leftIcon={<Copy className="h-4 w-4" />} onClick={() => void copyLinkOnly()}>
            Copy link only
          </Button>
          <Button type="button" variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={() => void downloadImage()}>
            Download image
          </Button>
          <Button
            type="button"
            className="sm:col-span-2"
            leftIcon={<Share2 className="h-4 w-4" />}
            onClick={() => void quickShare()}
          >
            Quick share
          </Button>
        </div>
      </div>
    </Modal>
  );
}
