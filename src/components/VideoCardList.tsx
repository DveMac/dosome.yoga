import { useRouter } from 'next/router';
import { Filters, Video } from '../../types';
import { VideoCard } from './VideoCard';

type VideoCardListProps = {
  items: Video[];
  query: Filters;
};
export const VideoCardList: React.FC<VideoCardListProps> = ({ items, query }) => {
  const router = useRouter();
  const gotoVideo = (event) => {
    const { value } = event.currentTarget.dataset;
    router.push('/play/[key]', `/play/${value}`);
  };
  return (
    <>
      <style jsx>
        {`
          div.grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            grid-gap: 1rem;
          }
        `}
      </style>

      <div className="grid">
        {items.map((i) => (
          <VideoCard key={i.videoId} video={i} query={query} onClick={gotoVideo} />
        ))}
      </div>
    </>
  );
};
