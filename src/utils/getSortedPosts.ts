import type { CollectionEntry } from "astro:content";

const getSortedPosts = (
  posts: Array<CollectionEntry<"blog">> | Array<CollectionEntry<"mediaposts">>
) => {
  return posts
    .filter(({ data }) => !data.draft)
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
        )
    );
};

export default getSortedPosts;
