---
layout: article
title: Wczytywanie scen w Unity
sub-title: Zmiana sceny oraz wizualizacja postępu
title-image: /media/posts/historia-powstania-bloga.jpg
date: 2020-07-25
description: Zmiana sceny oraz wizualizacja postępu
category: [Unity]
---

Abstract...


## Jak zmienić scenę?

Na samym początku upewniamy się, że wszystkie interesujące nam sceny dodane są do *Builda* (`Ctrl+Shift+B`)
![BuildSettings](/media/posts/20200725/scenes.png)

Teraz wstarczy jedno wywołanie statycznej metody klasy `SceneManager` znajdującej się w *namespace* `UnityEngine.SceneManagement`

```c#
public void ChangeScene(int sceneIndex)
{
    SceneManager.LoadScene(sceneIndex);
}
```

Powyższy kod zmieni scenę, czyli dokona dokładnie tego, czego potrzebujemy, ale w sposób niezbyt przyjemny dla oka, co możemy zaobserwować poniżej.
![Proste wczytywanie](/media/posts/20200725/load-scene-simple.gif)

Dlatego zazwyczaj używamy **asynchronicznego** ładowania scen, które niesie za sobą szereg korzyści, wśród których najważniejszy jest brak blokowania głównego wątku, a co za tym idzie, możliwość wyświetlenia znaczników zmiany sceny, na przykład atrakcyjnego paska postępu.

## Asynchroniczna zmiana sceny

Aby tego dokonać ponownie skorzystamy z klasy `SceneManager`, tym razem używająć **asynchronicznej** wersji wcześniej wywoływanej metody oraz mechanizmu *coroutines*.

```c#
public void ChangeScene(int sceneIndex)
{
    StartCoroutine(LoadSceneCoroutine(sceneId));
}

public IEnumerator LoadSceneCoroutine(int sceneId, LoadSceneMode mode = LoadSceneMode.Single)
{
    var loading = SceneManager.LoadSceneAsync(sceneId, mode);
    while (!loading.isDone)
    {
        var progress = loading.progress;

        yield return null;
    }
}
```

Przy tym podejściu otrzymujemy możliwość wyświetlania dowolnych elementów do czasu załadowania sceny, a także informację o postępie ładowania.
Jednak szybko zauważymy, że nasza zmienna `progress` przechodzi płynnie w zakresie `<0;0.9>`, następnie zatrzymuje się i od razu przeskakuje do wartości `1`.
Dzieje się tak dlatego, że silnik aktywuje scenę, gdy wartość asynchronicznej operacji ładowania wynosi `0.9`.

Ponadto jeżeli mamy bardzo lekką scenę, która ładuje się szybko, możemy zaobserwować, że cały czas do zmiennej `process` będzie przypisana wartość `0`, co uniemożliwi nam utworzenie płynnego przejścia.

< tutaj gif >

## Płynna zmiana sceny

Wiedząc już o wartości aktywacji sceny, możemy odpowiednio zareagować modyfikująć kod do następującej postaci:

```c#
public IEnumerator LoadSceneCoroutine(int sceneId, LoadSceneMode mode = LoadSceneMode.Single)
{
    const float activationThreshold = 0.9f;

    var loading = SceneManager.LoadSceneAsync(sceneId, mode);
    loading.allowSceneActivation = false;

    var progress = loading.progress;
    while (progress < activationThreshold)
    {
        progress = loading.progress;

        yield return null;
    }

    progress = loading.progress;
}
```

