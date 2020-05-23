import { Box, Tag, TagIcon, TagLabel } from '@chakra-ui/core';
import { SyntheticEvent } from 'react';
import { FiClock } from 'react-icons/fi';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Filters, Video } from '../../types';
import { TagLinksList } from './TagList';

type VideoCardProps = {
  video: Video;
  query?: Filters;
  onClick: (event: SyntheticEvent) => void;
};

export const VideoCard: React.FC<VideoCardProps> = ({ video, query = {}, onClick }) => {
  return (
    <Box cursor="pointer" data-value={video.videoId} onClick={onClick}>
      <LazyLoadImage
        wrapperClassName="video-card-wrapper"
        src={video.images.medium}
        alt={video.title}
        effect="blur"
        width="100%"
        style={{
          border: '1px solid gray',
          borderBottom: 0,
          borderTopRightRadius: '0.25rem',
          borderTopLeftRadius: '0.25rem',
        }}
      />
      <Box
        roundedBottom="md"
        padding={[3, 3, 4]}
        backgroundColor="gray"
        borderWidth="1px"
        borderColor="gray"
        borderTop="0"
      >
        <Tag size={'sm'} variantColor="blue" marginRight="1">
          <TagIcon icon={FiClock} />
          <TagLabel>{video.duration} minute</TagLabel>
        </Tag>

        <TagLinksList selected={query.tag} tags={video.tags} />
      </Box>
    </Box>
  );
};
