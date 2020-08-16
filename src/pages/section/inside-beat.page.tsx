import React from 'react';
import { actions, GetArticles } from '../../shared/src/client';
import { formatDateAbriviated } from '../../shared/src/utils';
import NotFound from '../404.page';
import { Section, Theme, Grid, ActivityIndicator, Card, Banner } from '../../components';
import { styleHelpers, imgix } from '../../utils';
import { useRouter } from 'next/router';

function Category({ 
  initSection
}: { 
  initSection: GetArticles
}) {
  const router = useRouter();
  const styles = Theme.useStyleCreator(styleCreator);
  const theme = Theme.useTheme();

  const [ section, setSection ] = React.useState(initSection);
  const [ isLoading, setIsLoading ] = React.useState(false);

  async function loadMore() {
    if(!section.nextToken || isLoading) return;
    setIsLoading(true);

    const { actions: clientActions } = await import('../../shared/src/client');

    const res = await clientActions.getArticles({
      category: 'inside-beat',
      limit: 20,
      nextToken: section.nextToken
    });
    setSection({
      ...res,
      items: section.items.concat(res.items)
    });
    setIsLoading(false);
  }

  if (router.isFallback) {
    return <ActivityIndicator.Screen/>
  }

  if(!section) {
    return <NotFound/>;
  }

  return (
    <Section style={styles.page}>
      <Banner 
        text='Inside'
        accentText='Beat'
      />
      
      <Grid.Row spacing={theme.spacing(2.5)}>
        <Grid.Col xs={24} md={12}>
          <Card.StackedResponsive
            id={section.items[0].id}
            tag='Category'
            imageData={imgix(section.items[0].media[0], {
              xs: imgix.presets.sm('1:1'),
              md: imgix.presets.md('2:1')
            })}
            title={section.items[0].title}
            href='/article/[year]/[month]/[slug]'
            as={'/'+section.items[0].slug}
            aspectRatioDesktop={2 / 1}
            date={formatDateAbriviated(section.items[0].publishDate)}
            author={section.items[0].authors.join(' ')}
          />
        </Grid.Col>

        <Grid.Col xs={24} md={12}>
          <Card.StackedResponsive
            id={section.items[1].id}
            tag='Category'
            imageData={imgix(section.items[1].media[0], {
              xs: imgix.presets.sm('1:1'),
              md: imgix.presets.md('2:1')
            })}
            title={section.items[1].title}
            href='/article/[year]/[month]/[slug]'
            as={'/'+section.items[1].slug}
            aspectRatioDesktop={2 /1}
            date={formatDateAbriviated(section.items[1].publishDate)}
            author={section.items[1].authors.join(' ')}
          />
        </Grid.Col>

        {section.items.slice(2).map(item => (
          <Grid.Col 
            key={item.id}
            xs={24}
            md={12}
            lg={8}
          >
            <Card.Compact
              id={item.id}
              tag='Category'
              imageData={imgix(item.media[0], {
                xs: imgix.presets.sm('1:1')
              })}
              title={item.title}
              href='/article/[year]/[month]/[slug]'
              as={'/'+item.slug}
              date={formatDateAbriviated(item.publishDate)}
            author={item.authors.join(' ')}
            />
          </Grid.Col>
        ))}
      </Grid.Row>

      {section.nextToken ? (
        <ActivityIndicator.ProgressiveLoader 
          onVisible={loadMore}
        />
      ) : null}

    </Section>
  );
}

const styleCreator = Theme.makeStyleCreator(theme => ({
  page: {
    ...styleHelpers.page(theme, 'compact'),
    backgroundColor: theme.colors.background,
  },
  tag: {
    color: '#fff',
    backgroundColor: theme.colors.accent,
    padding: theme.spacing(0.5, 1),
    marginBottom: theme.spacing(1),
  },
  // all cards
  cardBody: {
    padding: theme.spacing(2),
    backgroundColor: theme.colors.surface,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  // cmall cards
  cardSmall: {
    ...styleHelpers.hideLink(),
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(2),
  },
  cardSmallImage: {
    height: 170,
    ...styleHelpers.lockWidth(170),
    ...styleHelpers.centerBackgroundImage(),
  },
  // medium cards
  cardMedium: {
    ...styleHelpers.hideLink(),
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
  },
  cardMediumImage: {
    height: 250,
    ...styleHelpers.aspectRatioFullWidth(4 / 1),
    ...styleHelpers.centerBackgroundImage(),
  }
}));

export async function getStaticProps() {
  const initSection = await actions.getArticles({
    category: 'inside-beat',
    limit: 20
  });
  
  return {
    props: {
      initSection
    },
    revalidate: 60 // seconds
  }
};

export default Category;