import { Box, Button, Flex, Icon, Input, InputGroup, InputRightElement, Spinner, useToast } from '@chakra-ui/core';
import { useRouter } from 'next/router';
import React, { createRef, useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import useFetch from 'use-http';
import { MAIN_PADDING } from '../lib/constants';
import { generatePracticeDescription } from '../lib/describer';
import localStore from '../lib/localStore';
import { useLocalStorage } from '../lib/useLocalStorage';
import { getItemStorageKey } from '../lib/utils';
import { DurationSlider } from './DurationSlider';
import { H3 } from './Headings';
import { TagListGroups } from './TagList';

export default ({ tags }) => {
  const inputRef = createRef<HTMLInputElement>();
  const [duration, setDuration] = useState(15);
  const [customTitle, setCustomTitle] = useState<string | undefined>();
  const { post, response, loading } = useFetch('/api/practices');
  const [defaultTitle, setDefaultTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [practices, setPractices] = useLocalStorage('practices', []);
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
    <>
      <Box mb={MAIN_PADDING}>
        <H3 text="Name"></H3>
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
      <Box pb={MAIN_PADDING}>
        <H3 text="Duration"></H3>
        <DurationSlider initialValue={duration} onChanged={setDuration} />
      </Box>
      <Box pb={MAIN_PADDING}>
        <H3 text="Focus"></H3>
        <TagListGroups tags={tags} selected={selectedTags} onClick={toggleTags} />
      </Box>

      <Flex justifyContent="center">
        <Button isDisabled={loading} variantColor="purple" onClick={generate}>
          {loading ? <Spinner /> : 'Create Practice'}
        </Button>
      </Flex>
    </>
  );
};
