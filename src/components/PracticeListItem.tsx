import { Box, Button, Flex, Heading, Progress, Tag, TagIcon, TagLabel } from '@chakra-ui/core';
import jdenticon from 'jdenticon';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { FiClock, FiTrash } from 'react-icons/fi';
import { Practice } from '../../types';
import { HALF_PADDING } from '../lib/constants';
import { useLocalStorage } from '../lib/useLocalStorage';
import { getItemStorageKey } from '../lib/utils';
import { ConfirmPopup } from './ConfirmPopup';
import { TagLinksList } from './TagList';

export const PracticeListItem: React.FC<{ practice: Practice; onRemove: () => void }> = ({ practice, onRemove }) => {
  const router = useRouter();
  const [completed, , removePosition] = useLocalStorage(getItemStorageKey(practice.key), []);
  const [title] = useLocalStorage(getItemStorageKey(practice.key, 'title'), practice.key);

  const completedPercentage = Math.floor((completed.length / practice.playlistLength) * 100);
  const handleRemove = () => {
    removePosition();
    onRemove();
  };
  const icon = useRef(null);
  const href = '/practice/:planId';
  const as = `/practice/${practice.key}`;

  useEffect(() => {
    jdenticon.update(icon.current, practice.key);
  }, [practice.key]);

  return (
    <>
      <style jsx>
        {`
          .container {
            display: grid;
            grid-template-columns: auto 1fr auto;
            gap: 2rem;
            grid-template-areas: 'image tiel links';
            align-items: flex-start;
          }

          .image {
            grid-area: image;
          }

          .tiel {
            grid-area: tiel;
          }

          .links {
            grid-area: links;
          }
        `}
      </style>
      <Box borderWidth="1px" borderColor="gray" rounded="md" padding="4">
        <div className="container">
          <Box className="image" width={[75, 100, 150]}>
            <svg width="100%" height="100%" ref={icon} data-jdenticon-value={practice.key}></svg>
            <small>Progress</small>
            <Progress color="green" size="sm" value={completedPercentage} />
          </Box>

          <div className="tiel">
            <Heading as="h4" size="md" pb={HALF_PADDING}>
              {title}
            </Heading>

            <Box pb={HALF_PADDING}>
              <Tag size={'sm'} variantColor="blue" marginRight="1">
                <TagIcon icon={FiClock} />
                <TagLabel>{practice.duration} minute</TagLabel>
              </Tag>

              <TagLinksList tags={practice.tags} displayLimit={4} />
            </Box>
            <Flex justifyContent="right">
              <Button size="sm" onClick={() => router.push(href, as)}>
                Continue Practice
              </Button>
            </Flex>
          </div>
          <div className="links">
            <ConfirmPopup
              title={'Delete Practice'}
              body={'Are you sure? You can`t undo this action.'}
              onConfirm={handleRemove}
            >
              <Box cursor="pointer" as={FiTrash} color="gray.200" />
            </ConfirmPopup>
          </div>
        </div>
      </Box>
    </>
  );
};
