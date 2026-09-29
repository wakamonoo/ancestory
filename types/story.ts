export type Story = {
  storyId: string;
  userId: string;
  title: string;
  place: string;
  location: {
    latitude: number;
    longitude: number;
  };
  poster: string;
  story?: string;
  categories: string[];
  source: string;
  readingTime: number;
  createdAt: string;
};
