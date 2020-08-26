import React from 'react';
import { imgix } from '../utils';

const BASE = {
  siteName: 'The Daily Targum',
  facebookAppId: ''
}

export type SEOProps = {
  title?: string
  description?: string
  twitterHandle?: string
  type?: 'article' | 'website' | 'podcast'
  imageSrc?: string
  imageAlt?: string
  url?: string
  host?: string
  pathname?: string
  siteName?: string
};

export function Podcast({
  audioFile,
  player
}: {
  audioFile: string
  player: string
}) {
  return (
    <>
      <meta property="og:audio" content={audioFile} />
      <meta property="og:audio:type" content='audio/vnd.facebook.bridge' />
      <meta property="og:type" content='music.song' />

      <meta property="twitter:player" content={player} />
      <meta property="twitter:player:width" content='500px' />
      <meta property="twitter:player:width" content='200px' />
    </>
  );
}

export function SEO({
  title,
  description = "The Daily Targum is where you can find Rutgers University's campus news, Scarlet Knights sports coverage, features, opinions and breaking news for New Brunswick, New Jersey",
  twitterHandle = '@daily_targum',
  type = 'website',
  /*
    Imgix image without query
  */
  imageSrc = 'https://dailytargum.imgix.net/images/social-media-card-image.png',
  host = 'https://dailytargum.com/',
  pathname = '/',
  imageAlt = 'logo'
}: SEOProps) {

  return (
    <>
      <title>{title ? (title+' | ') : ''}{BASE.siteName}</title>
      <meta name="description" content={description} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary"/>
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:image" content={imgix.nonResponsive(imageSrc, imgix.presets.twitter()).src} />

      {/* Facebook */}
      <meta property="og:title" content={title || BASE.siteName} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={host+pathname} />
      <meta property="og:site_name" content={BASE.siteName} />
      <meta property="og:image" content={imgix.nonResponsive(imageSrc, imgix.presets.facebook()).src} />
      <meta property="og:image:height" content='630' />
      <meta property="og:image:width" content='1200' />
      <meta property="fb:image:alt" content={imageAlt} />
      <meta property="og:description" content={description} />
      <meta property="fb:app_id" content={BASE.facebookAppId} />
    </>
  );
}