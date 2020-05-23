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
  useToast,
} from '@chakra-ui/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
import * as icons from 'react-icons/fi';
import { FiFrown, FiMeh, FiSmile } from 'react-icons/fi';
import YouTube, { Options } from 'react-youtube';
import { Video } from '../../../types';
import { ClientOnly } from '../../components/ClientOnly';
import { ContentBox } from '../../components/ContentBox';
import Header from '../../components/Header';
import { H3 } from '../../components/Headings';
import { TagLinksList } from '../../components/TagList';
import { VideoCard } from '../../components/VideoCard';
import { APP_NAME, HALF_PADDING } from '../../lib/constants';
import { fetchApiData } from '../../lib/fetchApiData';
import reducer, { Card, initState, State } from '../../lib/practice.logic';
import { useInterval } from '../../lib/useInterval';

type PlanPageProps = {
  id: string;
  videos: Video[];
};

// -1 (unstarted)
// 0 (ended)
// 1 (playing)
// 2 (paused)
// 3 (buffering)
// 5 (video cued).

const VideoReviewCard = ({ onRestartClick, onNext }) => {
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

const DoneCard = ({ onNext }) => {
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

const SkipVideoCard = ({ video, onRestartClick, onNext }) => {
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
            <Button leftIcon={icons.FiArrowLeft} onClick={onRestartClick}>
              Continue Session
            </Button>
          </Box>
        </Flex>
      </SimpleGrid>
    </Box>
  );
};

const VideoPicker = ({ choices, onSelectVideo }) => {
  const selectVideo = (event) => {
    // <a href={`https://youtu.be/${video.videoId}`} rel="noreferrer" target="_blank">
    //
    onSelectVideo(event.currentTarget.dataset.value);
  };
  return (
    <Box>
      <H3 text="Pick a session for today" />

      <SimpleGrid spacing="10" columns={[1, 1, 3, 3]}>
        {choices.map((vc) => (
          <VideoCard key={vc.videoId} onClick={selectVideo} video={vc} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

const initialState: State = {
  playerState: -1,
  isLastVideo: false,
  videos: [],
  visibleCard: 'picker',
  completed: [],
  choices: [],
};

const youtubePlayerOptions: Options = {
  // @ts-ignore
  host: 'https://www.youtube-nocookie.com',
  playerVars: { controls: 1, autoplay: 1, modestbranding: 1, enablejsapi: 1 },
};

const PracticePage: React.FC<PlanPageProps> = ({ videos, id }) => {
  const toast = useToast();
  const router = useRouter();
  const [{ player, playerState, visibleCard, isLastVideo, currentVideo, choices, completed }, dispatch] = useReducer(
    reducer,
    { ...initialState, id, videos },
    initState,
  );

  const hasFinishedWatching = currentVideo ? completed.indexOf(currentVideo.videoId) >= 0 : false;
  const onReady = ({ target }) => dispatch({ type: 'SET_PLAYER', payload: target });
  const onStateChange = (event) => dispatch({ type: 'SET_PLAYER_STATE', payload: event.data });
  const selectVideo = (videoId: string) => dispatch({ type: 'SELECT_VIDEO', payload: videoId });
  const skip = () => dispatch({ type: 'SKIP' });
  const playPause = (from?: number) => dispatch({ type: 'PLAY_PAUSE', payload: from });
  const seek = (amount = 15) => dispatch({ type: 'SEEK', payload: amount });
  const refreshVideoPlayPosition = () => dispatch({ type: 'VIDEO_TICK' });
  const finishSession = (rate: number, videoId: string, nextCard: Card) =>
    dispatch({ type: 'FINISH_SESSION', payload: { rate, videoId, nextCard } });

  useInterval(refreshVideoPlayPosition, 1000);

  useEffect(() => {
    if (router.asPath.indexOf('#new') > 0) {
      toast({
        title: 'Practice Created',
        description: "Your new practice has been created - let's do some yoga!",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push(router.asPath.replace('#new', ''));
    }
  }, [router.asPath]);

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
            <Box hidden={visibleCard !== 'video'}>
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
                {!isLastVideo && <Button onClick={skip}>{hasFinishedWatching ? 'Done' : 'Skip'}</Button>}

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
              picker: <VideoPicker choices={choices} onSelectVideo={selectVideo} />,
              review: (
                <VideoReviewCard
                  onRestartClick={() => playPause(0)}
                  onNext={(rate) => {
                    finishSession(rate, currentVideo.videoId, 'complete2');
                  }}
                />
              ),
              skipped: (
                <SkipVideoCard
                  video={currentVideo}
                  onRestartClick={() => playPause()}
                  onNext={(rate) => finishSession(rate, currentVideo.videoId, 'picker')}
                />
              ),
              complete2: (
                <DoneCard
                  onNext={() => {
                    finishSession(null, currentVideo.videoId, 'picker');
                  }}
                />
              ),
            }[visibleCard]
          }
        </ClientOnly>
      </ContentBox>
    </main>
  );
};

export const getServerSideProps = async ({ req, params }): Promise<{ props: PlanPageProps | {} }> => {
  const { key } = params;
  const videos = await fetchApiData(req, `practices/${key}/playlist`);
  return { props: { videos, id: key } };
};

export default PracticePage;
