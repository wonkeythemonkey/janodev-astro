import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";
import { map } from "astro/zod";

export const getExternalLink = async () => {
  // Get all posts using glob. This is to get the updated frontmatter
  const globPosts = import.meta.glob(
    "../content/blog/*.md"
  ) as unknown as Promise<CollectionEntry<"blog">["data"][]>;

  // Then, set those frontmatter value in a JS Map with key value pair
  const mapFrontmatter = new Map();
  const globPostsValues = Object.values(globPosts);

  await Promise.all(
    globPostsValues.map(async globPost => {
      const globPostValue = await globPost();

      mapFrontmatter.set(
        slugifyStr(globPostValue.frontmatter.title),
        globPostValue.frontmatter.externalLink
      );
    })
  );

  return mapFrontmatter;
};

const getPostsWithExternalLink = async (posts: CollectionEntry<"blog">[]) => {
  const mapFrontmatter = await getExternalLink();
  return posts.map(post => {
    post.data.externalLink = mapFrontmatter.get(slugifyStr(post.data.title));
    return post;
  });
};

export default getPostsWithExternalLink;
