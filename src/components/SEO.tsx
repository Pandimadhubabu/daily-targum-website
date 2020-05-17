import React from 'react';

export type SEOProps = {
  title?: string,
  description?: string,
  twitterHandle?: string,
  type?: 'article' | 'website',
  imageSrc?: string,
  imageAlt?: string,
  url?: string,
  host?: string,
  pathname?: string,
  facebookAppId?: string
};

export function SEO({
  title = 'The Daily Targum',
  description = "The Daily Targum is where you can find Rutgers University's campus news, Scarlet Knights sports coverage, features, opinions and breaking news for New Brunswick, New Jersey",
  twitterHandle = '@daily_targum',
  type = 'website',
  imageSrc = 'https://daily-targum-website.now.sh/social-media-card-image.png',
  host = 'https://daily-targum-website-kbgveocu3.now.sh/',
  pathname = '/',
  imageAlt = 'logo',
  facebookAppId = ''
}: SEOProps) {
  return (
    <>
      <title>{title} | Underreacted</title>

      <meta name="twitter:card" content="summary"/>
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:image" content={imageSrc} />

      <meta property="og:title" content={title} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={host+pathname} />
      <meta property="og:image" content={imageSrc} />
      <meta property="fb:image:alt" content={imageAlt} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content='Underreacted' />
      <meta property="fb:app_id" content={facebookAppId} />
    </>
  );
}