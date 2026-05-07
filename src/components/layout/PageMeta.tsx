import { Helmet } from 'react-helmet-async';

import { APP_NAME } from '@constants/app';

interface PageMetaProps {
  title: string;
  description?: string;
  ogImage?: string;
}

export function PageMeta({ title, description, ogImage }: PageMetaProps) {
  const fullTitle = title.includes(APP_NAME) ? title : `${title} | ${APP_NAME}`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
