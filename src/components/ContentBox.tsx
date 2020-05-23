import { Box } from '@chakra-ui/core';
import { MAIN_PADDING } from '../lib/constants';

export const ContentBox = ({ children }) => {
  return (
    <Box padding={MAIN_PADDING} paddingLeft={[4, 30, 40]} paddingRight={[4, 30, 40]}>
      {children}
    </Box>
  );
};
