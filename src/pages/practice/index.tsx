import Head from 'next/head';
import React from 'react';
import { Filters, Tag } from '../../../types';
import { ContentBox } from '../../components/ContentBox';
import Header from '../../components/Header';
import VideoSearchForm from '../../components/VideoSearch';
import { APP_NAME } from '../../lib/constants';
import { fetchApiData } from '../../lib/fetchApiData';

type Props = {
  tags: Tag[];
  query: Filters;
};

const Practice: React.FC<Props> = ({ tags }) => {
  return (
    <main>
      <Head>
        <title>{APP_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <ContentBox>
        <VideoSearchForm tags={tags} />
      </ContentBox>
    </main>
  );
};

export const getServerSideProps = async ({ req }): Promise<{ props: Props | {} }> => {
  const tags = await fetchApiData(req, `tags`);
  return { props: { tags } };
};

export default Practice;
