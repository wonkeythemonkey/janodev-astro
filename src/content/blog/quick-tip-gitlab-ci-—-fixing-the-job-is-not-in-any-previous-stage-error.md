---
title: "Quick Tip: GitLab CI — Job dependencies"
draft: true
type: default
description: Your `gitlab-ci.yml` file is valid, all of your jobs and stages exist — why are you getting a “job is not in any previous stage” error?
tags:
  - web-dev
  - quick-tips
author: Jesse Janowiak
pubDatetime: 2024-06-19T13:43:27.010Z
---

## The Problem

I recently had a GitLab project with a failing [CI (continuous integration)](https://docs.gitlab.com/ee/ci/) pipeline. When I 

```yaml
stages:
  - build-assets
  - build-wordpress

build:assets:
  stage: build-assets
  script:
    - docker-compose run asset-builder
  artifacts:
    paths:
      - dist
  only:
    - main
    - merge_requests

build:wordpress_theme:
   stage: build-wordpress
   before_script:
      - npm ci --omit=dev
   script:
      - npm run build
   artifacts:
     name: "WordPress Themes"
     paths:
       - "themes_deploy"
   needs: 
     - job: "build:assets"
       artifacts: true
```