import { FC } from 'react';

interface ActivityRecommendationsProps {
  weatherCondition: string;
  temperature: number;
  location: string;
}

declare const ActivityRecommendations: FC<ActivityRecommendationsProps>;

export default ActivityRecommendations; 