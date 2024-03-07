import { slugifyStr } from "@utils/slugify";
import Datetime, { type DateFormatOptions } from "./Datetime";
import type { CollectionEntry } from "astro:content";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
  dateFormat?: DateFormatOptions;
  secHeading?: boolean;
}

export default function Card({
  href,
  frontmatter,
  dateFormat,
  secHeading = true,
}: Props) {
  const {
    title,
    pubDatetime,
    modDatetime,
    description,
    externalLink,
    externalLinkSite,
  } = frontmatter;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className:
      "text-lg font-medium decoration-dashed decoration-dashed underline-offset-4 group-focus-visible:no-underline group-focus-visible:underline-offset-0 group-hover:underline",
  };

  const externalLinkSVG = (
    <div className="ml-2 flex items-center group-hover:scale-110">
      <svg
        className="h-4 w-4"
        width="800px"
        height="800px"
        viewBox="0 0 32.822 32.822"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Link to a different website</title>
        <g fill="currentColor">
          <path d="M 24 22.82 L 24 27.82 C 24 28.37 23.55 28.82 23 28.82 L 5 28.82 C 4.45 28.82 4 28.37 4 27.82 L 4 9.82 C 4 9.27 4.45 8.82 5 8.82 L 10 8.82 C 11.1 8.82 12 7.93 12 6.82 C 12 5.72 11.1 4.82 10 4.82 L 3 4.82 C 1.34 4.82 0 6.17 0 7.82 L 0 29.82 C 0 31.48 1.34 32.82 3 32.82 L 25 32.82 C 26.66 32.82 28 31.48 28 29.82 L 28 22.82 C 28 21.72 27.1 20.82 26 20.82 C 24.9 20.82 24 21.72 24 22.82 Z"></path>
          <rect width="16" height="4" rx="2" x="16" y="0.82"></rect>
          <rect
            width="16"
            height="4"
            rx="2"
            transform="matrix(0, 1, -1, 0, 32, 0.822)"
          ></rect>
          <rect
            width="32.3"
            height="3.97"
            rx="1.99"
            transform="matrix(0.70711, -0.70711, 0.70711, 0.70711, 7.178, 22.836)"
          ></rect>
        </g>
      </svg>
    </div>
  );

  return (
    <li className="my-10">
      <a
        href={externalLink ? externalLink : href}
        className="group inline-flex items-center font-mono text-lg font-medium text-skin-accent"
      >
        {secHeading ? (
          <h2 {...headerProps}>{title}</h2>
        ) : (
          <h3 {...headerProps}>{title}</h3>
        )}

        {externalLinkSite ? (
          <div className="ml-2 flex text-sm">
            [&nbsp;{externalLinkSite} {externalLink ? externalLinkSVG : ""}
            &nbsp;]
          </div>
        ) : (
          ""
        )}
      </a>
      <Datetime
        pubDatetime={pubDatetime}
        modDatetime={modDatetime}
        dateFormat={dateFormat}
      />
      <p className="mt-4">{description}</p>
      {externalLink ? (
        <p className="notice my-4">
          <i>
            <b>Notice:</b> This article is hosted on a different site, and I do
            not have full rights to it. As such, it does not fall under the same
            copyright or license as the content on Jano[Dev]
          </i>
        </p>
      ) : (
        ""
      )}
    </li>
  );
}
