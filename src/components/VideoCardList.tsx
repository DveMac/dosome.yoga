import { Filters, Video } from '../../types';
import { VideoCard } from './VideoCard';

type VideoCardListProps = {
  items: Video[];
  query: Filters;
};
export const VideoCardList: React.FC<VideoCardListProps> = ({ items, query }) => {
  const gotoVideo = (event) => {
    const { value } = event.currentTarget.dataset;
    window.open(`https://youtu.be/${value}`, '_blank', 'noopener noreferrer');
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
