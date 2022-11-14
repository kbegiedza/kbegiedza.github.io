---
layout: article
date: "2022-11-13"
thumbnail: /assets/img/20221113/title-sm.png
title-image: /assets/img/20221113/title.png
title: Pushing to git repo with automatic upstream setup
description: Push brand new git branches seamless with auto setup remote option.
categories: git
---

### Abstract

TL;DR ? [Jump to solution](#solution)

I have seen countless times how (not only) junior developers are trying to push their new branch with git CLI typically it would look like this:

Josh stopped coding, test are green, as fast as possible, he is typing `git push` and hits enter.
Suddenly this message with some magic command occurs:

```
fatal: The current branch <branch-name> has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream <origin> <branch-name>

To have this happen automatically for branches without a tracking
upstream, see 'push.autoSetupRemote' in 'git help config'.
```

What to do? Read whole message?    
Nope, just copy, paste and run suggested command, git will push!

Two questions comes to my mind each time I see this situation:
1. Do they just ignored fatal error without investigation?
2. Why do they waste time to bounce off each time?

Answer to first question is clearly: yes. Solution to solve and/or automate remote setup is listed in error just below suggested command, and answer to latter... I don't have any idea.

### Problem

The problem here is that Josh created branch only locally, without proper equivalent on remote, so he have to add `--set-upstream` or `-u` flag to `git push` command to set upstream on remote explicitly for his local branch.

### Solution

You can easily enforce creation of new branch on your remote with a single command:

`git config --global --add --bool push.autoSetupRemote true`

It will affect all your repositories due to `--global` flag and add values directly into your `.gitconfig` file.
Described method requires git >= 2.37.0 and `push.default` to be one of: `simple` (currently default push option), `upstream` or `current` option.

### Further reading
1. [Git push configuration](https://git-scm.com/docs/git-push#_configuration)
