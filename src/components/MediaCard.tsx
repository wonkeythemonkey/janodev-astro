import { slugifyStr } from "@utils/slugify";
import { type DateFormatOptions } from "./Datetime";
import type { CollectionEntry } from "astro:content";
import zeroPad from "@utils/zeroPad";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"mediaposts">["data"];
  dateFormat?: DateFormatOptions;
  secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, description, details } = frontmatter;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className:
      "text-lg font-medium decoration-dashed decoration-dashed underline-offset-4 group-focus-visible:no-underline group-focus-visible:underline-offset-0 group-hover:underline",
  };

  let displayTitle = "";
  if (details?.series) {
    displayTitle = `${details.series} — `;
  }

  if (details?.season || details?.episode) {
    let episodeDisplay = "";
    episodeDisplay += details?.season ? `S${details.season}` : "";
    episodeDisplay += details?.episode ? `E${zeroPad(details.episode, 2)}` : "";
    displayTitle += `${episodeDisplay}: `;
  }

  displayTitle += `${title}`;

  return (
    <li className="my-10">
      <a
        href={href}
        className="group inline-flex items-center text-lg font-medium text-skin-accent"
      >
        {secHeading ? (
          <h2 {...headerProps}>{displayTitle}</h2>
        ) : (
          <h3 {...headerProps}>{displayTitle}</h3>
        )}
      </a>

      {/* <Datetime
        pubDatetime={pubDatetime}
        modDatetime={modDatetime}
        dateFormat={dateFormat}
      /> */}
      <p className="mt-4">{description}</p>
    </li>
  );
}
