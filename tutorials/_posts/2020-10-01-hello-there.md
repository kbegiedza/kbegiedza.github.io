---
layout: article
title: Long title to stress-test some stuff, basically top image with title on desktop and mobiles
sub-title: Sub-title
title-image: /static/img/m.png
thumbnail: /static/img/m-sm.png
date: 2020-10-01
description: Long subtitle to test this stuff. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget erat ullamcorper, cursus enim fringilla, imperdiet ipsum. Morbi semper eget magna in rutrum. Praesent purus elit, efficitur eget tortor aliquam, congue suscipit risus.
category: [DevOps]
---

# Root

Hello!

Bacon ipsum dolor amet picanha tail pork buffalo capicola, drumstick chuck kielbasa boudin. Pancetta short loin corned beef boudin tail kielbasa, bresaola beef pastrami strip steak burgdoggen filet mignon hamburger cupim ham hock. Jowl leberkas kielbasa ham hock picanha pastrami beef ribs. Pork loin salami spare ribs, boudin ball tip beef frankfurter cupim sausage turducken picanha capicola.

## Second

In this paragraph we can test `this stuff` and *other* **stuff**.
To test it we need some `code`!

```c#
using System;

public void SomeFoo()
{
    Console.WriteLine("42!");
}
```

This code is **C#** stuff, advanced magic. What about some **C++**?

```c++
int main()
{
    int* ptr = new int[5];

    delete[] ptr;

    return 42;
}
```

### Third but first

Wiedząc już o wartości aktywacji sceny, możemy odpowiednio zareagować modyfikując kod do postaci poniżej.
Przed uruchomieniem `LoadSceneCoroutine` spróbujmy pokazać efekt maskujący, taki jak zaciemnienie widoku kamery, a następnie po załadowaniu nowej sceny usunąć wcześniej ukazywany efekt.

```c#
public IEnumerator LoadSceneCoroutine(int sceneId)
{
    const float activationThreshold = 0.9f;

    var loading = SceneManager.LoadSceneAsync(sceneId);
    loading.allowSceneActivation = false;

    var progress = loading.progress;
    while (progress < activationThreshold)
    {
        progress = loading.progress;

        yield return null;
    }

    // ustawienie tej właściwości wywołuje aktywację i zmianę sceny
    // możemy tutaj zaczekać aż efekt maskujący będzie w pełni widoczny
    loading.allowSceneActivation = true;

    while (!loading.isDone)
    {
        yield return null;
    }

    progress = loading.progress;
}
```

Bacon ipsum dolor amet picanha tail pork buffalo capicola, drumstick chuck kielbasa boudin. `Pancetta short` loin corned beef boudin tail kielbasa.

{: .post-image}
![Asynchroniczne wczytywanie sceny](/media/posts/20200725/second-load.gif)


### Third, second

Projekt do pobrania wraz z kompletnym kodem źródłowym możesz znaleźć [tutaj](https://github.com/Ursanon/SimpleSceneTransition).