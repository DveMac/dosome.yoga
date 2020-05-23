import { Heading } from '@chakra-ui/core';
import { HALF_PADDING } from '../lib/constants';

export const H2 = ({ text }) => {
  return (
    <Heading as="h2" fontWeight={600} fontSize={[24, 24, 32]} mb={HALF_PADDING}>
      {text}
    </Heading>
  );
};

export const H3 = ({ text }) => {
  return (
    <Heading as="h3" fontWeight={600} letterSpacing={'tighter'} fontSize={[16, 18, 22]} mb={[3, 6, 8]}>
      {text}
    </Heading>
  );
};
