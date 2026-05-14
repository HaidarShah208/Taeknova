import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

import { APP_NAME } from '@constants/app';

interface PageMetaProps {
  title: string;
  description?: string;
  ogImage?: string;
  /** Path only (e.g. `/products/foo`) for `og:url` when the SPA runs in the browser. */
  canonicalPath?: string;
}

function absolutizeMediaUrl(url: string | undefined): string | undefined {
  if (!url?.trim()) return undefined;
  const u = url.trim();
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  if (u.startsWith('//')) return `https:${u}`;
  if (typeof window === 'undefined') return u.startsWith('/') ? u : `/${u}`;
  const origin = window.location.origin;
  return u.startsWith('/') ? `${origin}${u}` : `${origin}/${u}`;
}

export function PageMeta({ title, description, ogImage, canonicalPath }: PageMetaProps) {
  const fullTitle = title.includes(APP_NAME) ? title : `${title} | ${APP_NAME}`;
  const ogImageAbs = useMemo(() => absolutizeMediaUrl(ogImage), [ogImage]);
  const ogUrl = useMemo(() => {
    if (!canonicalPath || typeof window === 'undefined') return undefined;
    const p = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
    return `${window.location.origin}${p}`;
  }, [canonicalPath]);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {ogImageAbs && <meta property="og:image" content={ogImageAbs} />}
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      {ogImageAbs && <meta name="twitter:image" content={ogImageAbs} />}
    </Helmet>
  );
}
