---
title: "Quick Tip: Relevanssi Out of Memory when Indexing"
draft: false
type: default
pubDatetime: 2024-08-30T12:49:27.026Z
tags:
  - WordPress
  - webdev
description: Is Relevanssi failing to index your posts? A plugin conflict may be to blame.
---

## Short on time? Here's the important part.

I recently had trouble getting the Relevanssi search plugin for WordPress to build a new index. The cause turned out to be WordPress running out of memory, and the solution was to deactivate the Query Monitor plugin before indexing.

## The problem

When testing the Relevanssi search plugin in a local WordPress instance, I found that I was unable to complete the indexing process. Every time I clicked the "Build Index" button, the progress log would start tracking indexing progress before getting stuck indefinitely without any explanation.

When I checked my PHP error logs, I found an error similar to the following after every attempt at building an index:

```
PHP Fatal error: Allowed memory size of {XXX} bytes exhausted
(tried to allocate {XXXX} bytes) in {file path} on line {XXX}.
```

## Troubleshooting

### Fixing PHP errors

One positive side effect of this problem is that it caused me to look at my code more carefully. When Relevanssi builds its index, it has to look at every page on the site. As it does so, it triggers any PHP errors that may exist on any page. By checking my logs during indexing, I was able to spot and fix a number of previously unnoticed errors and exceptions.

I initially thought that fixing all of the PHP errors would fix my indexing problem, but it did not.

### Too many posts?

The site I was indexing had about 900 posts. That's quite a few, but not excessive for a WordPress site. I assumed that a plugin as popular, long-lived, and stable as Relevanssi should be able to handle far more posts than I was indexing and did not pursue the post count as a possible cause for my issue. If nothing else had worked, I probably would have investigated the possiblity, but fortunately it was not necessary.

### Why not increase the memory limit?

I briefly looked into increasing the allowed memory size for my local development environment, but excessive memory use is a symptom of a deeper problem. Solving the underlying issue is always better. Besides, even if I had been able to increase the memory limit on my own computer, I could not (and should not) do the same thing on the live site's server.

## Solution: Deactivate Query Monitor

I always run the Query Monitor plugin during active WordPress development to help me troubleshoot problems and better understand what my code is doing. It's really good at tracing and reporting important information like queries, API requests, template paths, and error logs.

But this useful information comes at a cost. Much like in quantum physics[^observer-effect], observing WordPress in this way changes its behavior. Specifically, it uses more resources and slows things down. This effect is usually trivial, especially for a single page load, but it multiplies when a lot of posts are queried in quick succession. That's exactly what happens when you tell Relevanssi to build an index.

Based on a theory that Query Monitor's extra processes were eating up my system resources, I tried deactivating the plugin before running the Relevanssi indexer. It worked! With Query Monitor deactivated, the index completed in less than 1 minute.

## Future testing and unproven hypotheses

I don't know _exactly_ why this fix worked, and there may be a better way to fix the issue without completely deactivating Query Monitor. Here are some ideas for future testing that might give me a better solution.

- I think part of the reason Query Monitor becomes so active during indexing is because it logs PHP errors to the browser console in real time. Would triggering the indexing outside of the browser using WP-CLI avoid the issue?
- Does Query Monitor have a hook of some kind that I could use to disable it specifically for Relevanssi indexing requests?
- Are there certain types of information that are more computationally expensive for Query Monitor to collect than others? If so, can certain checks be disabled without deactivating the entire plugin?

[^observer-effect]: In physics, this is called "the observer effect". You know you want to hit up the [Wikipedia article about the observer effect](<https://en.wikipedia.org/wiki/Observer_effect_(physics)>), you nerd.
