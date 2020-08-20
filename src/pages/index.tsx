import { Box, Button, Text } from '@chakra-ui/core';
import Link from 'next/link';
import React from 'react';
import { Tag } from '../../types';
import { ContentBox } from '../components/ContentBox';
import Header from '../components/Header';
import { H3 } from '../components/Headings';
import { MetaHead } from '../components/MetaHead';
import { MAIN_PADDING } from '../lib/constants';

type HomePageProps = {
  referrer: string;
  tags: Tag[];
};

const Home: React.FC<HomePageProps> = () => {
  return (
    <main>
      <MetaHead suffix="Free Yoga for Everyone" />
      <Header />
      <Box w="100%" h={[355, 475]}>
        <div className="hero" data-color1="#D38312 45%" data-color2="#A83279">
          <Box className="hero--content" fontSize={[48, 52, 64, 72]}>
            <div>
              <span className="hero--text">Yoga; free for everyone</span>
            </div>
          </Box>
          <span className="hero--attrib">
            <a
              target="_blank"
              rel="noopener"
              href="https://www.pexels.com/@elly-fairytale?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels"
            >
              Photo by Elly Fairytale
            </a>
          </span>
        </div>
      </Box>

      <ContentBox>
        <Link href="/practice">
          <Button size="lg">Let's go!</Button>
        </Link>
      </ContentBox>

      <div style={{ width: '100%', backgroundColor: '#515e64', color: 'white' }}>
        <ContentBox>
          <Box pb={MAIN_PADDING}>
            <H3 text="What is this?" />
            <Text>
              DoSome.yoga is a free yoga practice planner. We catalogue and categorize content and generate yoga
              practice playlists that suit your needs - all for free!
            </Text>
          </Box>
          <Box pb={MAIN_PADDING}>
            <H3 text="Why?" />
            <p>
              The benefits of yoga are numerous and well documented, from increasing flexibility, muscle strength and
              tone to improved respiration, energy and vitality. Whether you are looking to recover from an injury or
              just prevent reoccuring issues from appearing.
            </p>
          </Box>
        </ContentBox>
      </div>
    </main>
  );
};

export default Home;
