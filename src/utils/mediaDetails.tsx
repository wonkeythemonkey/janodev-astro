import zeroPad from "./zeroPad";

export const SeriesName = ({ series }: { series?: string }) => {
  if (!series) return "";
  return <span>{series}</span>;
};

export const EpisodeNumber = ({
  season,
  episode,
}: {
  season?: number;
  episode?: number;
}) => {
  let seasonStr = season ? `S${season}` : "";
  let episodeStr = episode ? `E${zeroPad(episode, 2)}` : "";

  if (!seasonStr && !episodeStr) return "";

  return (
    <span>
      {seasonStr}
      {episodeStr}
    </span>
  );
};

export const MediaHeader = ({
  title,
  series,
  season,
  episode,
}: {
  title: string;
  series?: string;
  season?: number;
  episode?: number;
}) => {
  return (
    <div>
      <div className="post-superhead text-lg">
        <SeriesName series={series} />
        {" — "}
        <EpisodeNumber season={season} episode={episode} />
      </div>
      <div className="post-title">{title}</div>
    </div>
  );
};
