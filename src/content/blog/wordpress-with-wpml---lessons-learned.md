---
title: WordPress with WPML - Lessons Learned
slug: wpml-lessons-learned
description: The WordPress Multi-Lingual (WPML) plugin can be complicated for theme developers. Here are some problems I ran into on a recent project, and how I fixed them.
pubDatetime: 2025-04-17T19:54:39.816Z
modDatetime: 2025-04-17T19:54:40.698Z
tags:
    - WordPress
    - Code
author: Jesse Janowiak
---

I recently built a WordPress theme for a site that needed to support multiple languages. They chose the popular [WPML (WordPress Multlingual) plugin](https://wpml.org/) to manage their translations. Although I have always been aware of WPML and WordPress translation in general, this was the first time I'd had to fully support it. We quickly ran into complications when the client activated WPML and began adding translations, most of them having to do with text that was visible on the site but not in the translation interface. Here are some important lessons I learned while diagnosing and fixing those problems.

## Lesson 1: Always use a translation function for static text

Translation functions like ([`__()`](https://developer.wordpress.org/reference/functions/__/) and [`_e()`](https://developer.wordpress.org/reference/functions/_e/)) are the first thing that most theme and plugin developers learn about creating translatable code. Wrapping a static string in one of these functions allows it to be indexed by WPML or any other WordPress translation tool.

I knew about these functions before I started my latest project. I've been pretty good about using them in my themes and plugins for years, but when I had to actually translate a theme for the first time I discovered the different between "pretty good" and "good enough". My code was riddled with unwrapped strings that I had overlooked due to a combination of haste and habit.

One place to watch out for in your own code is templating languages. I use Twig with [Timber](https://upstatement.com/timber), but other developers might use Blade, Jade, or Mustache. The WordPress translation functions might feel natural in PHP, it's tempting to skip them when you are writing code like this:

```twig title="search-form.twig"
<form name="s">
    <label for="search-field">Search Site</label>
    <input type="search" placeholder="Search…" />
    <button type="submit">Search</button>
</form>
```

What I did instead to make my Twig translatable was use variables inside my Twig templates and pass translated strings to them from the PHP files that call them.[^timber-inline-functions]

```twig title="search-form.twig"
<form name="s">
    <label for="search-field">{{ search_field_label }}</label>
    <input type="search" placeholder="{{ search_field_placeholder }}" />
    <button type="submit">{{ search_field_submit }}</button>
</form>
```

```php title="search-form.php"
Timber::compile( 'search-form.twig', array(
    'search_field_label' => __( 'Search Site', 'my-theme' ),
    'search_field_placeholder' => __( 'Search Site', 'my-theme' ) . '…',
    'search_field_submit' => __( 'Search', 'my-theme' ),
) );
```

## Lesson 2: WPML cannot see Site Editor templates stored in the theme

Many of the block themes that I develop for clients include block templates saved as HTML files in the theme's `/templates` directory. For example, the search results template is stored as `/templates/search.html`. This is a good way to make sure that all of the custom markup is included whenever the theme is deployed to a new site.

The normal way to set translations for block templates with WPML is to find them in the "Templates" section of the main translation tools. My theme's templates were not showing up in that list, making them impossible to translate.

I discovered that WPML can only see templates that are stored in the site's database, and HTML template files are only included in the database if they've been modified in the WordPress interface. To force WordPress to add those templates to the database, open each one in the Site Editor, make some small change, and re-publish it. Undo the change and publish one more time. Afterwards, the templates will be listed in the translation tools.

**Important:** Once you have modified the template in the editor, it will no longer be in sync with the HTML file. If you make changes to the HTML file, you will need to "Reset" the template in the Site Editor. After resetting it, repeat the "change, publish, undo, publish" process to restore it in the database.

## Lesson 3: `get_posts()` includes all post translations by default

When you are listing posts with translations, like in a post archive or a "Latest Posts" list, you only want to include the versions of each post in a single language. For most WordPress queries, WPML handles this automatically, filtering out all of the translated posts except for the current language.

I built several custom block types that generate post lists by passing query arguments to [`get_posts()`](https://developer.wordpress.org/reference/functions/get_posts), and was surprised to find that it returned *all* posts, including translations.

`get_posts()` is a convenience function that generates a `WP_Query` object using some sensible default arguments and immediately returns its `posts` value. It is my go-to method for getting a list of posts from a query because it saves me a couple of steps compared to `new WP_Query()` and reduces the chances that I'll forget a common query argument. However, one of its "sensible defaults" is to set `suppress_filters` to `true`. WPML uses a filter to control which version of a translated post to display, and suppressing all filters disables that behavior.

To restore the translation filtering, you have two options. To continue using `get_posts()`, you can pass the argument `'suppress_filters' => false`.

```php title="post-list-get-posts.php"
$my_posts = get_posts( array(
    'numberposts' => 3,
    'suppress_filters' => false
) );
```

If you prefer more manual control over your query, you can use `WP_Query` directly.

```php title="post-list-wp-query.php"
$my_query = new WP_Query( array(
    'posts_per_page' => 3,
) );

$my_posts = $my_query->posts;
```

## Lesson 4: Translate your URLs, too

On a properly translated site, all of your links on a translated page should also go to translated pages. For example, a link on an English page that goes to `/about` should go to `/es/about` on a Spanish page. This usually works automatically with WPML, but if you have hard coded any links you might run into problems.

For example, let's revisit the search form from above. That form should have an `action` attribute that directs to the front page and a `name` that adds `?s={search term}` to the URL. My old habit was to code an `action` url of `/` directly into my Twig template.

```twig title="search-form.twig"
<form action="/" name="s"><!-- Form contents --></form>
```

That URL won't adapt to multisites or sites inside subdirectories, including translated content at URLs like `/es/`. Instead of hard-coding URL strings for links, you can use a function like [`get_home_url()`](https://developer.wordpress.org/reference/functions/get_home_url) that uses filters to adjust the site root as needed.[^theme-root]

```twig title="search-form.twig"
<form action="{{ form_action }}" name="s"><!-- Form contents --></form>
```

```php title="search-form.php"
Timber::compile( 'search-form.twig', array(
    'form_action' => get_home_url(),
) );
```

## More Resources about WordPress Translation and Internationalization

https://wpmudev.com/blog/ultimate-guide-wordpress-localization/#understanding

https://developer.wordpress.org/themes/functionality/internationalization/

## Footnotes

[^timber-inline-functions]: [Timber also supports WordPress translation functions directly](https://timber.github.io/docs/v2/guides/internationalization/#translation-functions): <span style="white-space: preserve nowrap">`{{ __('Search', 'my-theme') }}`.</span>  
I usually don't do this because I reuse my Twig files outside of WordPress, where WordPress functions are not supported.

[^theme-root]: Do *not* use adaptive URL functions like `get_home_url()` to link to assets like CSS or JavaScript in your theme or plugin directories. For URLs that always stay the same, use functions like `get_template_directory_uri()`.