import { Button, Flex, SimpleGrid, Text } from '@chakra-ui/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { Filters, Tag } from '../../../types';
import { ClientOnly } from '../../components/ClientOnly';
import { ContentBox } from '../../components/ContentBox';
import Header from '../../components/Header';
import { H2 } from '../../components/Headings';
import { PracticeListItem } from '../../components/PracticeListItem';
import { APP_NAME, MAIN_PADDING } from '../../lib/constants';
import { useLocalStorage } from '../../lib/useLocalStorage';

type HomePageProps = {
  tags: Tag[];
  query: Filters;
};

const Home: React.FC<HomePageProps> = () => {
  const [practices, setPractices] = useLocalStorage('practices', []);
  const router = useRouter();
  const hasPractices = practices.length > 0;

  const removePractice = (key: string) => {
    setPractices(practices.filter((f) => f.key !== key));
  };

  const createPractice = () => {
    router.push('/practice/new');
  };

  return (
    <main>
      <Head>
        <title>{APP_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <ContentBox>
        <ClientOnly>
          <Flex justifyContent="space-between">
            <H2 text="My Practices" />
            {hasPractices && (
              <Button size="sm" variantColor="purple" onClick={createPractice}>
                + Add Practice
              </Button>
            )}
          </Flex>
          <SimpleGrid columns={[1, 1, 1, 2]} spacing={10}>
            {practices.map((p) => (
              <PracticeListItem key={p.key} practice={p} onRemove={() => removePractice(p.key)} />
            ))}
          </SimpleGrid>
        </ClientOnly>
        {!hasPractices && (
          <>
            <Flex justifyContent="center" pb={MAIN_PADDING}>
              <Text>You have not created any practices yet, click the button below to get started</Text>
            </Flex>
            <Flex justifyContent="center">
              <Button size="lg" variantColor="purple" onClick={createPractice}>
                Create First Practice
              </Button>
            </Flex>
          </>
        )}
      </ContentBox>
    </main>
  );
};

// export const getServerSideProps = async (): Promise<{ props: HomePageProps | {} }> => {
//   const tags = await fetchApiData(`tags`);
//   return { props: { tags } };
// };

export default Home;
