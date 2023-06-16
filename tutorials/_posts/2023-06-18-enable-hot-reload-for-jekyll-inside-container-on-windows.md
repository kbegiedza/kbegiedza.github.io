---
layout: article
date: "2023-06-18"
thumbnail: /assets/img/20230618/title-sm.png
title-image: /assets/img/20230618/title.png
title: Enable hot reload for Jekyll inside container on Windows
description: Embrace Jekyll's auto-regeneration feature to speed up your writing
categories: jekyll
---

### Problem

Some time ago, I decided to give Windows a try as my host, my main development environment. I truly appreciate the improvements made by Microsoft for developers. However, there are still some portability caveats that need to be addressed.

This blog is built with Jekyll and hosted on GitHub Pages. I have a habit of testing everything before pushing it anywhere and I love to see results as quickly as possible. Therefore, having hot reload functionality is a must-have for me. Unfortunately, when I tried using my previous `Dockerfile` with `jekyll serve --watch` on Windows, it didn't work as expected.

Few minutes and bunch of documentation pages later, I managed to get it working by adding a few more parameters.

### Solution

I made the following switch in my `Dockerfile`:

From:

```dockerfile
CMD ["jekyll", "serve", "--watch"]
```

To:

```dockerfile
CMD ["jekyll", "serve", "--watch", "--force_polling", "--livereload"]
```

This simple modification did the trick and saved me from switching back to Linux.