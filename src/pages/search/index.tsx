import { Heading, Input } from '@chakra-ui/core';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useFetch } from 'use-http';
import { VideoCardList } from '../../components/VideoCardList';
import { APP_NAME } from '../../lib/constants';

type SearchPageProps = {};

const SearchPage: React.FC<SearchPageProps> = () => {
  const [value, setValue] = useState('');
  const { get, loading, error, data: videos } = useFetch();
  const handleChange = (event) => setValue(event.target.value);

  useEffect(() => {
    if (value) get(`/api/search?query=${value}`);
  }, [value]);

  return (
    <div className="container">
      <Head>
        <title>{APP_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Heading size="md">{APP_NAME}</Heading>

      <Heading size="sm">Search</Heading>
      <Input value={value} onChange={handleChange} placeholder="Enter search query" size="lg" />

      {!loading && videos && (
        <>
          <h4>
            {videos.items.length}/{videos.total}
          </h4>
          <VideoCardList items={videos.items} query={{ tag: '', time: 0 }} />
        </>
      )}
    </div>
  );
};

// export const getStaticProps = async (context) => {
//   const { query } = context.params;
//   const [, time, tag = ''] = /(\d+?)-minute-(\w+?)?-?yoga/i.exec(query);
//   if (!time) return { props: {} };
//   const min = Number(time) - 3;
//   const max = Number(time) + 3;
//   const json = await getVideos(tag, min, max);
//   return { props: { data: json, query: { time, tag } } };
// };;

// export async function getStaticPaths() {  // Get the paths we want to pre-render based on posts
//   const paths = [
//     {params: { query: '10-minute-yoga' },}
//   ]

//   // We'll pre-render only these paths at build time.
//   // { fallback: false } means other routes should 404.
//   return { paths, fallback: false }
// }

export default SearchPage;
