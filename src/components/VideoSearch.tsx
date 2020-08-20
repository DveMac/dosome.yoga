import { Box, Spinner, useToast } from '@chakra-ui/core';
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
import useFetch from 'use-http';
import { MAIN_PADDING } from '../lib/constants';
import { DurationSlider } from './DurationSlider';
import { H3 } from './Headings';
import { TagListGroups } from './TagList';
import { VideoCardList } from './VideoCardList';

export default ({ tags }) => {
  const [duration, setDuration] = useState(15);
  const [selectedTags, setSelectedTags] = useState([]);
  const [results, setResults] = useState<any>({});
  const { get, response, loading } = useFetch();
  const toast = useToast();

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

  const search = async () => {
    const filter = [];
    const result = await get('/api/videos?' + qs.stringify({ tags: selectedTags, duration, filter }));
    if (response.ok) {
      setResults(result);
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
    search();
  }, [duration, selectedTags]);

  return (
    <>
      <Box pb={MAIN_PADDING}>
        <H3 text="Duration"></H3>
        <DurationSlider initialValue={duration} onChanged={setDuration} />
      </Box>
      <Box pb={MAIN_PADDING}>
        <H3 text="Filter"></H3>
        <TagListGroups tags={tags} selected={selectedTags} onClick={toggleTags} />
      </Box>
      {/*
      <Flex justifyContent="center">
        <Button isDisabled={loading} variantColor="purple" onClick={search}>
          {loading ? <Spinner /> : 'Search'}
        </Button>
      </Flex> */}

      {loading && <Spinner color="black" />}
      {results.items && <VideoCardList query={{ tag: tags, time: duration }} items={results.items} />}
      {results.total === 0 && <div>No results</div>}
    </>
  );
};
