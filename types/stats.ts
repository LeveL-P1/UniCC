export interface StatOverview {
  totalSolved: number;
  bestRating: number;
  contestsAttended: number;
}

export interface HeatmapDay {
  date: string;
  count: number;
}

export interface RatingPoint {
  date: string;
  label: string;
  rating: number;
}

export interface DetailedStats {
  heatmap: HeatmapDay[];
  ratingTimeline: RatingPoint[];
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
}
