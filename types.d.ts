
export type SearchRow = {
  id: any,
  video_id: string
};

export type Video = {
  videoId: string;
  channelId: string;
  title: string;
  images: { [key: string]: string },
  likeCount: number;
  viewCount: number;
  duration: number;
  likePercentage: number;
  tags: string[];
}

export type Practice = {
  key: string;
  playlistLength: number;
  created: number;
  tags: string[]
  duration: string;
}

export type Filters = { tag: string, time: number };

export type TimeRange = { min: number, max: number };

export type Tag = { name: string, group: string };
