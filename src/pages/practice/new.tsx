import { Box } from '@chakra-ui/core';
import React from 'react';
import { Filters, Tag } from '../../../types';
import { ContentBox } from '../../components/ContentBox';
import Header from '../../components/Header';
import { H2 } from '../../components/Headings';
import { MetaHead } from '../../components/MetaHead';
import NewPracticeForm from '../../components/NewPracticeForm';
import { MAIN_PADDING } from '../../lib/constants';
import { fetchApiData } from '../../lib/fetchApiData';

type NewPracticePageProps = {
  tags: Tag[];
  query: Filters;
};

const NewPractivePage: React.FC<NewPracticePageProps> = ({ tags }) => {
  return (
    <main>
      <MetaHead suffix="Build Your Practice" />
      <Header />
      <ContentBox>
        <H2 text="New Practice" />
        <Box pb={MAIN_PADDING}>
          <p>
            Choose a duration, select some tags and click generate to create a schedule of sessions that you can
            practice over the next 30 days
          </p>
        </Box>
        <NewPracticeForm tags={tags} />
      </ContentBox>
    </main>
  );
};

export const getServerSideProps = async ({ req }): Promise<{ props: NewPracticePageProps | {} }> => {
  const [tags] = await Promise.all([fetchApiData(req, `tags`)]);
  return { props: { tags } };
};

export default NewPractivePage;
