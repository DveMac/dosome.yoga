import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Stack,
} from '@chakra-ui/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer, useState } from 'react';
import * as icons from 'react-icons/fi';
import { FiFrown, FiMeh, FiSmile } from 'react-icons/fi';
import YouTube, { Options } from 'react-youtube';
import { Video } from '../../../types';
import { ClientOnly } from '../../components/ClientOnly';
import { ContentBox } from '../../components/ContentBox';
import Header from '../../components/Header';
import { H3 } from '../../components/Headings';
import { TagLinksList } from '../../components/TagList';
import { APP_NAME, HALF_PADDING } from '../../lib/constants';
import { fetchApiData } from '../../lib/fetchApiData';
import reducer, { State } from '../../lib/player.logic';
import { useInterval } from '../../lib/useInterval';
import { sendEvent } from '../../lib/utils';

type PlayerPageProps = {
  video: Video;
};

// -1 (unstarted)
// 0 (ended)
// 1 (playing)
// 2 (paused)
// 3 (buffering)
// 5 (video cued).

type Step = 'review' | 'done' | 'skipped' | 'video';

const VideoReviewStep = ({ onRestartClick, onNext }) => {
  const rate = (event) => {
    const val = Number(event.currentTarget.dataset.value);
    onNext(val);
  };
  return (
    <Flex flexWrap="wrap" flexDirection="column" backgroundColor="gray" height="100%" paddingTop="10px">
      <Flex flex={1} flexDirection="column" alignItems="center" padding="2">
        <Stack isInline>
          <Button onClick={onRestartClick}>Restart</Button>

          <Popover>
            <PopoverTrigger>
              <Button>Add to My Favorites</Button>
            </PopoverTrigger>
            <PopoverContent zIndex={4}>
              <PopoverArrow />
              <PopoverBody>Coming soon...</PopoverBody>
            </PopoverContent>
          </Popover>
        </Stack>
      </Flex>
      <Divider />
      <Flex padding="5" flexDirection="column">
        <Heading as="h4" size="sm">
          How was the session?
        </Heading>
        <Flex justifyContent="space-around" flex={1} padding="2">
          <Box
            cursor="pointer"
            data-value={0}
            onClick={rate}
            padding="3"
            rounded={'lg'}
            margin="3"
            backgroundColor="orange.300"
          >
            <Box size={[12, 16, 24]} as={FiFrown} aria-label="Poor" />
          </Box>
          <Box
            cursor="pointer"
            data-value={1}
            onClick={rate}
            padding="3"
            rounded={'lg'}
            margin="3"
            backgroundColor="yellow.200"
          >
            <Box size={[12, 16, 24]} as={FiMeh} aria-label="Ok" />
          </Box>
          <Box
            cursor="pointer"
            data-value={2}
            onClick={rate}
            padding="3"
            rounded={'lg'}
            margin="3"
            backgroundColor="green.300"
          >
            <Box size={[12, 16, 24]} as={FiSmile} aria-label="Great" />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

const DoneStep = ({ onNext }) => {
  const router = useRouter();
  return (
    <Flex flexWrap="wrap" backgroundColor="gray" height="100%" paddingTop="10px">
      <Flex flex={1} flexDirection="column" alignItems="center" padding="2">
        <p>Thanks for the feedback!</p>

        <Stack isInline>
          <Button onClick={() => router.push('/practice')}>Back to My Practices</Button>
          <Button onClick={onNext}>Next Session</Button>
        </Stack>
      </Flex>
    </Flex>
  );
};

const SkipVideoStep = ({ video, onContinue, onNext }) => {
  const rate = (event) => {
    const val = Number(event.target.dataset.value);
    onNext(val);
  };
  return (
    <Box>
      <H3 text="Skip Session" />
      <SimpleGrid columns={[1, 1, 2]} gridGap={HALF_PADDING}>
        <Box>
          <Image rounded="md" width="100%" src={video.images.medium} pb={HALF_PADDING} />
        </Box>
        <Flex>
          <Box flex={1}>
            <Stack>
              <Button leftIcon={icons.FiCheck} data-value={-1} onClick={rate}>
                Ive already done it
              </Button>
              <Button leftIcon={icons.FiTv} data-value={-3} onClick={rate}>
                Low quality video or audio
              </Button>
              <Button leftIcon={icons.FiFrown} data-value={-4} onClick={rate}>
                Not feeling it
              </Button>
              <Button leftIcon={icons.FiGlobe} data-value={-5} onClick={rate}>
                Not in my language
              </Button>
              <Button leftIcon={icons.FiStopCircle} data-value={-6} onClick={rate}>
                Not relevant/Inappropriate
              </Button>
              <Button leftIcon={icons.FiZap} data-value={-7} onClick={rate}>
                No reason/Other
              </Button>
            </Stack>
            <Divider />
            <Button leftIcon={icons.FiArrowLeft} onClick={onContinue}>
              Continue Video
            </Button>
          </Box>
        </Flex>
      </SimpleGrid>
    </Box>
  );
};

const initialState: State = {
  playerState: -1,
  currentVideo: undefined,
};

const youtubePlayerOptions: Options = {
  // @ts-ignore
  host: 'https://www.youtube-nocookie.com',
  playerVars: { controls: 1, autoplay: 1, modestbranding: 1, enablejsapi: 1 },
};

const PlayerPage: React.FC<PlayerPageProps> = ({ video }) => {
  const [currentStep, setCurrentStep] = useState<Step>('video');
  const [{ player, playerState, currentVideo, hitWatchThreshold }, dispatch] = useReducer(reducer, {
    ...initialState,
    currentVideo: video,
  });

  const onReady = ({ target }) => dispatch({ type: 'SET_PLAYER', payload: target });
  const onStateChange = (event) => dispatch({ type: 'SET_PLAYER_STATE', payload: event.data });
  const skip = () => {
    dispatch({ type: 'SKIP' });
    setCurrentStep(hitWatchThreshold ? 'review' : 'skipped');
  };
  const playPause = (from?: number) => {
    dispatch({ type: 'PLAY_PAUSE', payload: from });
    setCurrentStep('video');
  };
  const seek = (amount = 15) => dispatch({ type: 'SEEK', payload: amount });
  const refreshVideoPlayPosition = () => dispatch({ type: 'VIDEO_TICK' });
  const finishVideo = (videoId: string, rate: number | null, nextStep: Step | null) => {
    dispatch({ type: 'FINISH_VIDEO', payload: { rate, videoId } });
    setCurrentStep(nextStep);
  };

  useInterval(refreshVideoPlayPosition, 1000);

  useEffect(() => {
    sendEvent(video.videoId, { rate: 100, position: 0, key: '-' });
  }, [video.videoId]);

  return (
    <main>
      <Head>
        <title>{APP_NAME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <ContentBox>
        <ClientOnly>
          {currentVideo && (
            <Box hidden={currentStep !== 'video'}>
              <YouTube
                containerClassName={'youtube-container'}
                videoId={currentVideo.videoId}
                opts={youtubePlayerOptions}
                onReady={onReady}
                onStateChange={onStateChange}
              />
              <Flex justifyContent="center">
                <Button isDisabled={!player} onClick={() => seek(-15)}>
                  -15
                </Button>

                <Button isDisabled={[3].includes(playerState) || !player} onClick={() => playPause()}>
                  {playerState === 1 ? 'Pause' : 'Play'}
                </Button>
                <Button onClick={skip}>{hitWatchThreshold ? 'Done' : 'Skip'}</Button>

                <Button isDisabled={!player} onClick={() => seek(15)}>
                  +15
                </Button>
              </Flex>
              <TagLinksList tags={currentVideo.tags} selected={[]} />
              <small>
                <a href={`https://youtube.com/channel/${currentVideo.channelId}`} target="_blank">
                  Support content creator on YouTube
                </a>
              </small>
            </Box>
          )}
          {
            {
              skipped: (
                <SkipVideoStep
                  video={currentVideo}
                  onContinue={() => playPause()}
                  onNext={(rate) => finishVideo(currentVideo.videoId, rate, null)}
                />
              ),
              review: (
                <VideoReviewStep
                  onRestartClick={() => playPause(0)}
                  onNext={(rate) => {
                    finishVideo(currentVideo.videoId, rate, 'done');
                  }}
                />
              ),
              done: <DoneStep onNext={() => finishVideo(currentVideo.videoId, null, null)} />,
            }[currentStep]
          }
        </ClientOnly>
      </ContentBox>
    </main>
  );
};

export const getServerSideProps = async ({ req, params }): Promise<{ props: PlayerPageProps | {} }> => {
  const { key } = params;
  const video = await fetchApiData(req, `videos/${key}`);
  return { props: { video } };
};

export default PlayerPage;
