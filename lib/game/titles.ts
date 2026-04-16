type TitleConfig = {
  min: number;
  max: number;
  title: string;
  description: string;
};

const TITLES: TitleConfig[] = [
  { min: 0, max: 100, title: "Clueless Rookie", description: "Better luck next time!" },
  { min: 101, max: 200, title: "Trend Watcher", description: "You're starting to see the patterns." },
  { min: 201, max: 300, title: "Pattern Spotter", description: "You've got a keen eye for trends." },
  { min: 301, max: 400, title: "Sequence Master", description: "Impressive pattern recognition!" },
  { min: 401, max: 450, title: "Oracle of What's Next", description: "You can see the future!" },
];

export function getTitle(score: number): { title: string; description: string } {
  const match = TITLES.find((t) => score >= t.min && score <= t.max);
  return match ?? TITLES[0];
}

export function getTitleColor(title: string): string {
  switch (title) {
    case "Clueless Rookie":
      return "from-gray-400 to-gray-600";
    case "Trend Watcher":
      return "from-blue-400 to-blue-600";
    case "Pattern Spotter":
      return "from-purple-400 to-purple-600";
    case "Sequence Master":
      return "from-amber-400 to-amber-600";
    case "Oracle of What's Next":
      return "from-pink-400 via-purple-400 to-cyan-400";
    default:
      return "from-gray-400 to-gray-600";
  }
}
