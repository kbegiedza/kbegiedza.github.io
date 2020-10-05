---
layout: article
title: Wczytywanie scen w Unity
sub-title: Zmiana sceny oraz wizualizacja postępu
title-image: /media/posts/wczytywanie-scen-w-unity.jpg
thumbnail: /media/posts/wczytywanie-scen-w-unity-tb.jpg
date: 2020-07-25
description: Zmiana sceny oraz wizualizacja postępu
category: [Unity]
---

## Wprowadzenie

Niezależnie od tego, czy pracujemy nad grą indie, hyper-casual lub triple-A, zawsze potrzebujemy bardziej lub mniej złożonych przejść pomiędzy scenami. Może być to prosty wskaźnik ładowania w postaci kręcącego się logo, pasek postępu lub płynna zmiana koloru otoczenia. Ale jak właściwie można je zrobić w Unity?

## Jak zmienić scenę?

Na samym początku upewniamy się, że wszystkie interesujące nas sceny dodane są do *Builda* (`Ctrl+Shift+B`)

{: .post-image}
![BuildSettings](/media/posts/20200725/scenes.png)

Teraz wstarczy jedno wywołanie statycznej metody klasy `SceneManager` znajdującej się w *namespace* `UnityEngine.SceneManagement`

```c#
public void ChangeScene(int sceneIndex)
{
    SceneManager.LoadScene(sceneIndex);
}
```

Powyższy kod zmieni scenę, czyli dokona dokładnie tego, czego potrzebujemy, ale w sposób niezbyt przyjemny dla oka, co możemy zaobserwować poniżej.

{: .post-image}
![Synchroniczne wczytywanie sceny](/media/posts/20200725/load-scene-simple.gif)

Dlatego zazwyczaj używamy **asynchronicznego** ładowania scen, które niesie za sobą szereg korzyści, wśród których najważniejszy jest brak blokowania głównego wątku, a co za tym idzie, możliwość wyświetlenia znaczników zmiany sceny, na przykład atrakcyjnego paska postępu.

## Asynchroniczna zmiana sceny

Aby tego dokonać ponownie skorzystamy z klasy `SceneManager`, tym razem używając **asynchronicznej** wersji wcześniej wywoływanej metody oraz mechanizmu *coroutines*.

```c#
public void ChangeScene(int sceneIndex)
{
    StartCoroutine(LoadSceneCoroutine(sceneId));
}

public IEnumerator LoadSceneCoroutine(int sceneId)
{
    var loading = SceneManager.LoadSceneAsync(sceneId);
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

Ponadto jeżeli mamy bardzo lekką scenę, która ładuje się szybko, możemy zaobserwować, że cały czas do zmiennej `progress` będzie przypisana wartość `0`, a dopiero po pełnym załadowaniu jej wartość zmieni się na `1`, co uniemożliwi nam utworzenie płynnego przejścia.

Aby lepiej zilustrować problem dodajemy bardzo prosty *slider* wraz z komponentem tekstowym, którego wartość odpowiada wartości `progress`.

{: .post-image}
![Asynchroniczne wczytywanie sceny](/media/posts/20200725/second-load.gif)

## Płynna zmiana sceny

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

Dzięki zastosowaniu tego sposobu ładowania sceny otrzymujemy gładkie i estetyczne przejście pomiedzy scenami.
Bez problemu możemy też połączyć nasz kod z animacjami wykonanymi we wbudowanym w silnik systemie animacji, aby stworzyć bardziej złożone animacje przejścia scen.    

{: .post-image}
![Płynne przejście sceny](/media/posts/20200725/fluent-load.gif)

Efekt który otrzymaliśmy jest o wiele przyjemniejszy dla oka. W porównaniu do pierwotej, naiwnej implementacji nie odstrasza użytkownika nagłą i bezwględną zmianą sceny, a łagodnie przechodzi pomiędzy jedną, a drugą.

Projekt do pobrania wraz z kompletnym kodem źródłowym możesz znaleźć [tutaj](https://github.com/Ursanon/SimpleSceneTransition).    

Jeśli udało Ci się stworzyć jakiś ciekawy efekt podziel się nim w komentarzu.