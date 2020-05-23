import { Box, Divider, Flex, Grid, Link as UILink, Text } from '@chakra-ui/core';
import Error from 'next/error';
import Link from 'next/link';
import React from 'react';
import { Filters, Tag, Video } from '../../../types';
import { ContentBox } from '../../components/ContentBox';
import Header from '../../components/Header';
import { H2, H3 } from '../../components/Headings';
import { MetaHead } from '../../components/MetaHead';
import { TagLinksList } from '../../components/TagList';
import { VideoCardList } from '../../components/VideoCardList';
import { HALF_PADDING, MAIN_PADDING, TIME_INTERVALS } from '../../lib/constants';
import { fetchApiData } from '../../lib/fetchApiData';
import { buildUrl } from '../../lib/utils';

type QueryPageProps = {
  videos?: { items: Video[]; total: number };
  tags: Tag[];
  query: Filters;
};

function encode(str: string): number {
  let num = '0x';
  const length = str.length;
  for (let i = 0; i < length; i++) num += str.charCodeAt(i).toString(16);
  return Number(num);
}

const descriptions = [
  (tag, time) => `We found a great selection of ${tag.replace('_', ' ') || ''} yoga videos that are around ${time} minutes. The perfect way to start your day!`,
  (tag, time) => `We found ${tag.replace('_', ' ') || ''} free yoga videos that are about ${time} minutes. Enjoy your practice.`,
  (tag, time) => `Heres some great free yoga videos that focus on ${tag.replace('_', ' ') || 'all types'} of yoga.`,
]

const getDescription = (tag, time) => {
  const encoded = encode(`${time}:${tag}`);
  const idx = encoded % descriptions.length;
  return descriptions[idx](tag, time);
}

const QueryPage: React.FC<QueryPageProps> = ({ videos, tags, query }) => {
  if (!videos || !query) return <Error statusCode={404} />;
  const time = query && query.time ? Number(query.time) : 10;

  return (
    <main>
      <MetaHead suffix="Find Yoga Videos" />
      <Header />

      <ContentBox>
        <H2 text="Explore" />

        <Box pb={MAIN_PADDING}>
          <Text>
            {getDescription(query.tag, time)}
            {' '}Browse the videos below, or{' '}
            <Link href="/practice/new">
              <UILink className="link__fat">create your own practice plan</UILink>
            </Link>
            .
          </Text>
        </Box>
        <Divider mb={MAIN_PADDING} />
        <Grid templateColumns={['1fr', '1fr', '1fr', '250px 1fr']} gridGap={[3, 6, 8]}>
          <Box>
            <Box pb={HALF_PADDING}>
              <H3 text="Duration" />
              <Flex flexWrap="wrap">
                {TIME_INTERVALS.map((d) => (
                  <Box key={d} mb={HALF_PADDING} mr={HALF_PADDING}>
                    <Link href="/[query]" as={buildUrl(d, query.tag)}>
                      <a>{d} minutes</a>
                    </Link>
                  </Box>
                ))}
              </Flex>
            </Box>
            <Box>
              <H3 text="Tags" />
              <TagLinksList selected={query.tag} tags={tags.map((t) => t.name)} duration={time} />
            </Box>
          </Box>
          <Box>
            <Flex justifyContent="flex-end" p={HALF_PADDING}>
              Showing {videos.items.length} of {videos.total}
            </Flex>
            <VideoCardList items={videos.items} query={query} />
          </Box>
        </Grid>
      </ContentBox>
    </main>
  );
};

export const getServerSideProps = async ({ res, req, params }): Promise<{ props: QueryPageProps | {} }> => {
  const { query } = params || {};
  res.statusCode = 404;
  if (!query) return { props: {} };
  const [, time, tag = ''] = /(\d+?)-minute-(\w+?)?-?yoga/i.exec(query) || [];
  if (!time) return { props: {} };
  const [videos, tags] = await Promise.all([
    fetchApiData(req, `videos?tags=${tag}&duration=${time}`),
    fetchApiData(req, `tags`),
  ]);
  res.statusCode = 200;
  return { props: { videos, tags, query: { time, tag } } };
};

// export const getStaticProps = async ({ params }) => {
//   const { query } = params || {};
//   if (!query) return { props: {} };
//   const [, time, tag = ''] = /(\d+?)-minute-(\w+?)?-?yoga/i.exec(query) || [];
//   if (!time) return { props: {} };
//   const [videos, tags] = await Promise.all([
//     fetchApiData(null, `videos?tags=${tag}&duration=${time}`),
//     fetchApiData(null, `tags`),
//   ]);
//   return { props: { videos, tags, query: { time, tag } } };
// };

// export async function getStaticPaths() {  // Get the paths we want to pre-render based on posts
//   const paths = [
//     {params: { query: '10-minute-yoga' } },
//     {params: { query: '30-minute-intermediate-yoga' } },
//   ]

//   // We'll pre-render only these paths at build time.
//   // { fallback: false } means other routes should 404.
//   return { paths, fallback: false }
// }

export default QueryPage;
