import { GameBanner, GameBannerProps } from "./GameBanner";

export interface ListGameProps {
  games: GameBannerProps[];
}

export function ListGameBanner(props: ListGameProps) {
  const { games } = props;
  
  return (
    <div className={`grid gap-6 mt-16`} style={{gridTemplateColumns: `repeat(${games.length}, minmax(0, 1fr))`}}>
      {
        games.map((game) => {
          return (
            <GameBanner key={`${game.title}`} bannerUrl={game.bannerUrl} title={game.title} _count={game._count} />
          )
        })
      }
    </div>
  )
}