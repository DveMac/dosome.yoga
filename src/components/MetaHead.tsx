import Head from 'next/head';
import { APP_NAME } from '../lib/constants';

const prod = process.env.NODE_ENV === 'production';
type Props = {
  suffix?: string;
};

export const MetaHead: React.FC<Props> = ({ suffix }) => {
  const title = suffix ? `${APP_NAME} : ${suffix}` : APP_NAME;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content="Free yoga practice planner with 1000s of free yoga sessions" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest"></link>
      {prod ? (
        <script data-goatcounter="https://dosomeyoga10.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
      ) : (
        false
      )}
    </Head>
  );
};
