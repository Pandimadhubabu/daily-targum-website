import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { actions, GetArticle } from '../../../../shared/src/client';
import { SEOProps, Section, Grid, Text, Newsletter, Divider, Byline, Br, AspectRatioImage, ActivityIndicator, HTML, Ad } from '../../../../components';

import NotFound from '../../../404.page';
import { imgix, processNextQueryStringParam } from '../../../../utils';
import { useRouter } from 'next/router';

import styles from './[slug].module.scss';
import { theme } from '../../../../constants';


function Article({
  article 
}: {
  article: GetArticle
}) {
  const router = useRouter();

  if (router.isFallback) {
    return <ActivityIndicator.Screen/>;
  }

  if (!article) {
    return <NotFound/>;
  }
  
  return (
    <>
      <Section className={styles.page}>
        <Grid.Row 
          spacing={theme.spacing(4)}
          cols={[ '1fr', '300px' ]}
        >
          <Grid.Col xs={0} md={0}/>

          <Grid.Col xs={2} md={1}>
            <main>
              <article>
                <Text variant='h1' htmlTag='h1'>{article.title}</Text>
                <Byline.Authors 
                  authors={article.authors}
                  updatedAt={article.updatedAt} 
                  publishDate={article.publishDate}
                />
                <AspectRatioImage
                  aspectRatio={16 / 9}
                  data={imgix(article.media[0]?.url ?? '', {
                    xs: imgix.presets.md('16:9'),
                    md: imgix.presets.xl('16:9')
                  })}
                  altText={article.media[0]?.altText ?? article.media[0]?.description ?? undefined}
                />
                <Text className={styles.photoCredit}>Photo by {article.media[0]?.credits}</Text>
                <Divider/>

                <Br/>
                <HTML 
                  ads
                  html={article.body} 
                />
              </article>
            </main>
          </Grid.Col>

          <Grid.Col xs={0} md={1}>
            <Ad type='rectange' style={{ marginBottom: '1rem' }} />
            <Ad type='skyscraper' />
          </Grid.Col>

          {/* <Grid.Col xs={12}>
            <Ad type='banner'/>
          </Grid.Col> */}

        </Grid.Row>
      </Section>

      {/* <Divider/>
      <Section className={classes.page}>
        <Grid.Row 
          spacing={spacing(4)}
          cols={['165px', '1fr', '165px']}
        >
          <Grid.Col xs={3} md={0} lg={1}></Grid.Col>
          <Grid.Col>
            <Text variant='h2'>Comments</Text>
          </Grid.Col>
        </Grid.Row>
      </Section> */}

      <Divider/>
      <Newsletter.Section/>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const year = processNextQueryStringParam(ctx.params?.year, '');
  const month = processNextQueryStringParam(ctx.params?.month, '');
  const slug = processNextQueryStringParam(ctx.params?.slug, '');

  const article = await actions.getArticle({
    slug: `article/${year}/${month}/${slug}`
  });

  if (!article) {
    return {
      props: {}
    };
  }

  let seo: SEOProps = {
    pathname: `/article/${year}/${month}/${slug}`,
    title: article?.title,
    type: 'article'
  };

  if (article?.abstract) {
    seo.description = article.abstract;
  }

  if (article?.media[0]) {
    seo.imageSrc = article.media[0].url;
  }

  return {
    props: { 
      article: article ?? null,
      seo
    }
  };
};

export const getStaticPaths: GetStaticPaths = async () =>  {
  return {
    paths: [],
    fallback: true
  };
}

export default Article;