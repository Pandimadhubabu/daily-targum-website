import React from 'react';
import { Article } from '../shared/src/client';
import { formatDateAbriviated } from '../shared/src/utils';
import { Theme, Section, Text, AspectRatioImage } from '../components';
import Link from 'next/link';
import { styleHelpers, imgix } from '../utils';

function Slide({
  article,
  className,
  hide,
  style,
  load
}: {
  article: Article,
  className?: string,
  hide: boolean,
  style?: React.CSSProperties,
  load: boolean
}) {
  const styles = Theme.useStyleCreator(styleCreator);
  return (
    <Link
      href='/article/[year]/[month]/[slug]'
      as={article.slug}
    >
      <a
        style={{
          ...(hide ? styles.hide : null),
          ...styles.link,
          ...styles.slide,
          ...style,
        }}
        className={[
          className, 
          'animate-opacity'
        ].join(' ')}
      >
        <AspectRatioImage
          data={load ? imgix(article.media[0], {
            xs: imgix.presets.sm('16:9'),
            sm: imgix.presets.md('16:9'),
            md: imgix.presets.lg('16:9'),
            lg: imgix.presets.xl('16:9')
          }) : []}
          style={styles.slideImage}
        />
        <div style={styles.slideCardImageOverlay}/>
        <Section>
          <div style={styles.slideCardTitleWrap}>
            <Text 
              variant='h5'
              style={{fontWeight: 900, color: '#fff'}}
            >NEWS</Text>
            <Text.Truncate
              variant='h3' 
              numberOfLines={2} 
              className='animate-opacity-fast'
              style={{
                fontWeight: 400,
                ...styles.sliderCardTitle,
                ...(hide ? styles.hide : null),
              }}
            >
              {article.title}
            </Text.Truncate>

            <div style={{ ...styles.byline, ...styles.contrastTextMuted }}>
              <Text style={styles.date}>{formatDateAbriviated(article.publishDate)}</Text>
              <Text style={styles.author}>{article.authors.join(' ')}</Text>
            </div>
          </div>
        </Section>
      </a>
    </Link>
  );
}

export function NewsSlider({
  articles
}: {
  articles: Article[]
}) {
  const styles = Theme.useStyleCreator(styleCreator);
  const [ index, setIndex ] = React.useState(0);
  const [ loaded, setLoaded ] = React.useState([true]);

  React.useEffect(() => {
    if (!loaded[index]) {
      const clone = loaded.slice(0);
      clone[index] = true;
      setLoaded(clone);
    }
  }, [index]);

  React.useEffect(() => {
    const id = setTimeout(() => {
      if(index < articles.length - 1) {
        setIndex(index + 1);
      } else {
        setIndex(0);
      }
    }, 10 * 1000);
    return () => {
      clearTimeout(id);
    }
  }, [index, articles.length])

  return (
    <div style={{position: 'relative'}}>
      <div style={styles.sider}>
        {articles.map((a, i) => (
          <Slide
            key={a.id}
            article={a}
            hide={i !== index}
            style={{
              ...(i !== index ? styles.hide : null)
            }}
            load={loaded[i]}
          />
        ))}
      </div>
      
      <div style={styles.dots}>
        {articles.map((a, i) => (
          <div
            key={a.id}
            style={{
              ...styles.dot,
              ...(i !== index ? styles.dotActive : null)
            }}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

const styleCreator = Theme.makeStyleCreator(theme => ({
  hide: {
    opacity: 0,
    pointerEvents: 'none'
  },
  dots: {
    position: 'absolute',
    display: 'flex',
    margin: theme.spacing(3),
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center'
  },
  dot: {
    height: 10,
    width: 10,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    borderRadius: '100%',
    borderWidth: 2,
    borderColor: '#fff',
    borderStyle: 'solid',
    cursor: 'pointer'
  },
  dotActive: {
    backgroundColor: '#fff'
  },
  link: {
    textDecoration: 'none',
    color: theme.colors.text
  },
  slide: {
    ...styleHelpers.absoluteFill(),
    ...styleHelpers.flex('column'),
    justifyContent: 'flex-end'
  },
  slideImage: {
    ...styleHelpers.absoluteFill()
  },
  slideCardImageOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.9), transparent)'
  },
  slideCardTitleWrap: {
    ...styleHelpers.flex('column'),
    position: 'relative',
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    width: '100%',
    borderLeft: `4px solid ${theme.colors.accent}`,
    maxWidth: 600
  },
  sliderCardTitle: {
    color: '#fff',
    textAlign: 'justify'
  },
  sider: {
    height: 'calc(25vw + 180px)',
    backgroundColor: '#000',
    position: 'relative',
    overflow: 'hidden'
  },
  date: {
  },
  byline: {
    ...styleHelpers.flex('row'),
    width: '100%',
    justifyContent: 'space-between'
  },
  author: {
    fontStyle: 'italic'
  },
  contrastTextMuted: {
    color: 'rgba(255,255,255,0.7)'
  }
}));

export default NewsSlider;