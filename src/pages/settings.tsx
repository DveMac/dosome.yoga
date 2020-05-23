import { Box, Button, Divider, useToast } from '@chakra-ui/core';
import React from 'react';
import { ConfirmPopup } from '../components/ConfirmPopup';
import { ContentBox } from '../components/ContentBox';
import Header from '../components/Header';
import { H2, H3 } from '../components/Headings';
import { MetaHead } from '../components/MetaHead';
import { HALF_PADDING } from '../lib/constants';
import localStore from '../lib/localStore';
import { useLocalStorage } from '../lib/useLocalStorage';
import { snooze } from '../lib/utils';

const Home: React.FC = ({}) => {
  const toast = useToast();

  const [practices] = useLocalStorage('practices', []);

  const clearLocalData = async () => {
    localStore.clear();
    await snooze(300);
    toast({
      title: 'Local Data Cleared',
      description: 'All local data has been deleted',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <main>
      <MetaHead suffix="Settings" />

      <Header />
      <ContentBox>
        <H2 text="Settings" />
        <Box pb={HALF_PADDING}>
          <p>
            All data is stored locally on your device. If at anytime you wish to stop using this app click the clear
            local data button below.
          </p>
        </Box>

        <Divider />
        <H3 text={'Clear All Data'} />
        <Box pb={HALF_PADDING}>
          <p>You current have {practices.length} stored practice(s).</p>
        </Box>
        <ConfirmPopup onConfirm={clearLocalData} title="Delete Everything" body="Are you sure you want to delete everything?">
          <Button variantColor="red">Delete Everything</Button>
        </ConfirmPopup>
      </ContentBox>
    </main>
  );
};

export default Home;
