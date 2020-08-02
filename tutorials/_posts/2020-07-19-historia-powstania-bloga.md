---
layout: article
title: Historia powstania bloga
sub-title: Czyli jak i dlaczego stworzyłem tego bloga
title-image: /media/posts/historia-powstania-bloga.jpg
date: 2020-07-19
description: Historia powstania bloga oraz decyzje projektowe
category: [Lifestyle]
---

## Ale na sam początek... Hello World!

Skoro już zacząłem standardowym programistycznym zdaniem, możemy przejść dalej.

## Skąd pomysł?

Zawsze mówiłem sobie, że to jeszcze nie czas na pisanie, że stworzenie bloga zajmie mi mnóstwo czasu, że to trzeba zaplanować...    
...a cały pomysł narodził się dosyć dawno, jeszcze, gdy byłem studentem Politechniki Wrocławskiej, na której to dostawałem mnóstwo pytań o porady, zaczynając od standardowego "Jak zacząć programować?", "Jak rozwiązać zadanie X?", jak i bardziej zaawansowane, dotyczące głównie produkcji i optymalizacji gier.    
Chciałem stworzyć miejsce ze wskazówkami, sztuczkami i przykładowymi rozwiązaniami zadań. Jednak przez natłok obowiązków związanych z uczelnią oraz moimi pobocznymi projektami, cały czas pomysł ten schodził na drugi plan.

## Trochę o założeniach i technologii

Chciałem, aby blog był tworzony zgodnie z myślą statycznych stron internetowych, ale w taki sposób, aby można było go łatwo rozszerzać i modyfikować.
Dodatkowo dobrze byłoby, gdyby dodawanie postów było proste tak jak użycie `git add` i&nbsp;`git push`, a ich formatowanie jak *markdown* lub *LATEX*.

Tutaj pojawia się **Jekyll**, czyli generator statycznych stron internetowych wraz z rozwiązaniem nazwanym **GitHub Pages**, czyli hostowaniem wygenerowanej przez Jekyll strony poprzez repozytorium na GitHub.
Mogę zatem dodawać nowe wpisy za pomocą dobrze mi znanych poleceń `git`, mogę też pisać sam tekst i nie martwić się o jego formatowanie, a dodatkowo łatwo rozszerzać bloga o nowe fukcjonalności wykorzystująć Ruby lub Liquid.