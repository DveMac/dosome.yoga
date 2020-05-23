import { Box, Flex, Heading, Icon, Stack } from '@chakra-ui/core';
import Link from 'next/link';
import React from 'react';
import { FiBookOpen, FiSettings } from 'react-icons/fi';
import { APP_NAME } from '../lib/constants';
import { ContentBox } from './ContentBox';

const Header: React.FC = ({}) => {
  return (
    <Box borderBottom="1px" borderColor="gray.200">
      <ContentBox>
        <Stack justifyContent="space-between" alignContent="center" isInline>
          <Heading as="h1" size={'lg'}>
            <Link href="/">
              <a>{APP_NAME}</a>
            </Link>
          </Heading>
          <Flex>
            <Box marginRight={[4, 6, 8]}>
              <Link href="/practice">
                <a aria-label="My Practices">My Practices</a>
              </Link>
            </Box>
            <Box marginRight={[4, 6, 8]}>
              <Link href="/15-minute-yoga" prefetch={false}>
                <a aria-label="Explore">
                  <Icon as={FiBookOpen} size="5" />
                </a>
              </Link>
            </Box>
            <Box>
              <Link href="/settings">
                <a aria-label="Settings">
                  <Icon as={FiSettings} size="5" />
                </a>
              </Link>
            </Box>
          </Flex>
        </Stack>
      </ContentBox>
    </Box>
  );
};

export default Header;
