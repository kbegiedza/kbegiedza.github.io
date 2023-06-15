---
layout: article
date: "2023-06-18"
thumbnail: /assets/img/20230618/title-sm.png
title-image: /assets/img/20230618/title.png
title: Enable hot reload for Jekyll inside container on Windows
description: Embrace jekyll's auto-regeneration feature to speed up your writing
categories: jekyll
---

### Problem



### Solution

```dockerfile
CMD ["jekyll", "serve", "--watch", "--force_polling", "--livereload"]
```

### Further reading

