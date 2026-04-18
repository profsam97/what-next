import { GameLayoutClient } from "./layout-client";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GameLayoutClient>
      {children}
    </GameLayoutClient>
  );
}
