import { Box, Button, Flex, Icon, Input, InputGroup, InputRightElement, Spinner, useToast } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import React, { createRef, useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import useFetch from 'use-http';
import { Filters, Tag } from '../../../types';
import { ContentBox } from '../../components/ContentBox';
import { DurationSlider } from '../../components/DurationSlider';
import Header from '../../components/Header';
import { H2, H3 } from '../../components/Headings';
import { MetaHead } from '../../components/MetaHead';
import { TagListGroups } from '../../components/TagList';
import { HALF_PADDING, MAIN_PADDING } from '../../lib/constants';
import { generatePracticeDescription } from '../../lib/describer';
import { fetchApiData } from '../../lib/fetchApiData';
import localStore from '../../lib/localStore';
import { useLocalStorage } from '../../lib/useLocalStorage';
import { getItemStorageKey } from '../../lib/utils';

type NewPracticePageProps = {
  tags: Tag[];
  query: Filters;
};

const NewPractivePage: React.FC<NewPracticePageProps> = ({ tags }) => {
  const inputRef = createRef<HTMLInputElement>();
  const [duration, setDuration] = useState(15);
  const [defaultTitle, setDefaultTitle] = useState('');
  const [customTitle, setCustomTitle] = useState<string | undefined>();
  const [selectedTags, setSelectedTags] = useState([]);
  const [practices, setPractices] = useLocalStorage('practices', []);
  const { post, response, loading } = useFetch('/api/practices');
  const toast = useToast();
  const router = useRouter();

  const toggleTags = (tag: string | string[]) => {
    const inputTags = Array.isArray(tag) ? tag : [tag];
    let nextTags = [...selectedTags];
    for (const t of inputTags) {
      const idx = nextTags.indexOf(t);
      if (idx < 0) nextTags = [...nextTags, tag];
      else nextTags = nextTags.filter((_, i) => i !== idx);
    }
    setSelectedTags(nextTags);
  };

  const generate = async () => {
    const result = await post({ tags: selectedTags, duration });
    if (response.ok) {
      setPractices([...practices, result]);
      // SET LOCAL PRACTICE TITLE - title: customTitle || defaultTitle
      localStore.setJson(getItemStorageKey(result.key) + '-title', customTitle || defaultTitle);
      router.push('/practice/:planId', `/practice/${result.key}#new`);
    } else {
      toast({
        title: 'Uh oh',
        description: result.message || 'There was a problem.',
        status: 'warning',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    setDefaultTitle(generatePracticeDescription(selectedTags, duration));
  }, [duration, selectedTags]);

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
        <Box pb={HALF_PADDING}>
          <H3 text="Duration"></H3>
          <DurationSlider initialValue={duration} onChanged={setDuration} />
        </Box>
        <Box pb={HALF_PADDING}>
          <H3 text="Tags"></H3>
          <TagListGroups tags={tags} selected={selectedTags} onClick={toggleTags} />
        </Box>
        <Box pb={HALF_PADDING}>
          <H3 text="Title"></H3>
          <InputGroup size="md">
            <Input
              ref={inputRef}
              pr="4.5rem"
              placeholder="Choose a title"
              onFocus={() => {
                setCustomTitle('');
              }}
              onBlur={() => {
                if (!customTitle) setCustomTitle(undefined);
              }}
              value={customTitle !== undefined ? customTitle : defaultTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => {
                  setCustomTitle('');
                  inputRef.current.focus();
                }}
              >
                <Icon as={FiX} />
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
        <Flex justifyContent="center">
          <Button isDisabled={loading} variantColor="purple" onClick={generate}>
            {loading ? <Spinner /> : 'Create Practice'}
          </Button>
        </Flex>
      </ContentBox>
    </main>
  );
};

export const getServerSideProps = async ({ req }): Promise<{ props: NewPracticePageProps | {} }> => {
  const [tags] = await Promise.all([fetchApiData(req, `tags`)]);
  return { props: { tags } };
};

export default NewPractivePage;
