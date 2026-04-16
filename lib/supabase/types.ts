export type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
  is_guest: boolean;
  has_onboarded: boolean;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image_url: string;
  color_from: string;
  color_to: string;
  created_at: string;
};

export type Question = {
  id: string;
  category_id: string;
  sequence: string[];
  sequence_images: string[];
  correct_answer: string;
  correct_answer_image: string;
  options: string[];
  option_images: string[];
  difficulty: number;
  explanation: string;
  created_at: string;
};

export type GameSession = {
  id: string;
  user_id: string;
  category_id: string;
  score: number;
  time_bonus: number;
  total_score: number;
  title: string;
  answers: AnswerRecord[];
  completed_at: string;
};

export type AnswerRecord = {
  question_id: string;
  selected: string;
  correct: string;
  is_correct: boolean;
  time_left: number;
  points: number;
};

export type LeaderboardEntry = {
  user_id: string;
  username: string;
  total_score: number;
  title: string;
  category_name: string;
  category_slug: string;
  completed_at: string;
};
