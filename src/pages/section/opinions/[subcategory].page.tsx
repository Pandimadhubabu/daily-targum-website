import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { Section, Text, Grid, Card, ActivityIndicator, FlatList, SEOProps, Divider, Ad, Sticky, AdBlockDector, Semantic, Donate } from '../../../components';
import { actions, GetArticlesBySubcategory } from '../../../shared/src/client';
import { formatDateAbriviated, hyphenatedToCapitalized } from '../../../shared/src/utils';
import { processNextQueryStringParam, imgix } from '../../../utils';
import NotFound from '../../404.page';
import { useRouter } from 'next/router';
import { useArticles } from '../../../machines';
import { theme } from '../../../constants';
import styles from './[subcategory].module.scss';

function Author({
  initialArticles,
  subcategory
}: {
  initialArticles: GetArticlesBySubcategory | null
  subcategory: string
}) {
  const { articles, loadMore } = useArticles({
    initialArticles,
    subcategory
  });

  const router = useRouter();

  if (router.isFallback) {
    return <ActivityIndicator.Screen/>;
  }

  if (!articles) {
    return <NotFound/>;
  }

  return (
    <Section.StickyContainer className={styles.page}>
      <Grid.Row
        spacing={theme.spacing(4)}
        cols={[ '1fr', '1px', 'minmax(auto, 300px)' ]}
        disableGridOnPrit
      >
        <Grid.Col xs={2} md={1}>
          <Semantic role='main' pritable skipNavContent>
            <Text variant='h4'>Opinions</Text>
            <Text variant='h1' htmlTag='h1'>{hyphenatedToCapitalized(subcategory)}</Text>

            <Divider className={styles.divider}/>
          
            <FlatList
              data={articles}
              keyExtractor={article => article.id}
              renderItem={article => (
                <Card.CompactResponsive
                  className={styles.articleCard}
                  title={article.title}
                  imageData={imgix(article.media[0]?.url ?? '', {
                    xs: imgix.presets.md('1:1')
                  })}
                  href='/article/[year]/[month]/[slug]'
                  as={'/'+article.slug}
                  aspectRatioDesktop={3 / 2}
                  date={formatDateAbriviated(article.publishDate)}
                  altText={article.media[0]?.altText ?? article.media[0]?.description ?? undefined}
                />
              )}
              ItemSeparatorComponent={<Card.Spacer/>}
            />
          </Semantic>
          
          <ActivityIndicator.ProgressiveLoader
            onVisible={loadMore}
          />
        </Grid.Col>

        <Grid.Col xs={0} md={1} style={{height: '100%', overflow: 'hidden'}}>
          <Divider.Vertical/>
        </Grid.Col>

        <Grid.Col xs={0} xl={1}>
          <Sticky>
            <Semantic role='aside'>
              <Ad type='rectange' style={{ marginBottom: '1rem' }} />
              <Ad type='skyscraper' />
              <AdBlockDector>
                <Donate.SidebarCard/>
              </AdBlockDector>
            </Semantic>
          </Sticky>
        </Grid.Col>

      </Grid.Row>
    </Section.StickyContainer>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const subcategory = processNextQueryStringParam(ctx.params?.subcategory, '');

  const initialArticles = await actions.getArticlesBySubcategory({
    subcategory,
    limit: 50
  });

  const seo: SEOProps = {
    title: hyphenatedToCapitalized(subcategory)
  };

  const firstArticle = initialArticles?.[0];
  if (firstArticle?.media?.[0]?.url) {
    seo.imageSrc = firstArticle.media[0].url;
  }

  return {
    props: { 
      initialArticles: initialArticles ?? null,
      subcategory,
      seo
    },
    revalidate: 60 // seconds
  };
};

export const getStaticPaths: GetStaticPaths = async () =>  {
  return {
    paths: [],
    fallback: true
  };
}

export default Author;