---
layout: article
title: Elastyczne środowisko pracy z&nbsp;VSCode
sub-title: VS Code + Docker = ❤️
title-image: /media/posts/historia-powstania-bloga.jpg
date: 2020-07-11
description: Historia powstania bloga oraz decyzje projektowe
category: [Narzędzia, DevOps]
---

Intro...   

Daje nam to niesamowitą przenośność, na swoim hostcie potrzebujemy tylko dwóch rzeczy: VSCode i Dockera.

## VSCode w kontenerze

### Przygotowania
Potrzebujemy wtyczki do VSCode `ms-vscode-remote.remote-containers`. Daje nam ona możliwość uruchomienia edytora (lub jego podpięcie) w kontenerze. Bardzo łatwo zainstalujemy ją za pomocą wbudowanego sklepu (`Ctrl+Shift+X`).
Możemy skorzystać z opcji autogenerowania konfiguracji, jeśli jest ona dla Ciebie zadowalająca możesz od razu przejść do [otwierania w kontenerze](#otwieranie-w-kontenerze).   
Jeżeli jednak chcemy od razu skonfigurować środowisko tworzymy folder `.devcontainer`, a w nim plik `devcontainer.json`. Zanim przejdziemy do uzupełniania tego pliku, utwórzmy kolejny folder `operations`, w którym umieszczamy nasz `dockerfile`.
Teraz uzupełniamy plik `devcontainer.json` konfiguracją:

```json
{
    "name": "Nazwa",
    "build": {
        "context": "../operations",
        "dockerfile": "<Dockerfile znajdujący się w wybranym kontekście>"
    },
    "settings": {
        "terminal.integrated.shell.linux": "/bin/bash"
    },
    "extensions": [
        "ms-dotnettools.csharp"
    ],
    "mounts": [
    ],
    "remoteEnv": {
        "RemoveEnvironementVariable": "Value"
    },
    "forwardPorts":[
        80,
        443
    ],
	"workspaceFolder": "/workspace",
}
```

Zamiast klucza `"build"` możemy wskazać bezpośrednio obraz dockera za pomocą `"image"`, wtedy konfiguracja zawierałaby
```json
{
    "name": "Nazwa",
    "image": "nazwa-obrazu:tag",
    //...
}
```

Po dokładniejsze instrukcje odsyłam do [oficjalnej dokumentacji rozszerzenia](https://code.visualstudio.com/docs/remote/containers).

### Otwieranie
Otwieramy panel komend edytora (standardowo: `Ctrl+Shift+P`) i wybieramy opcję: `Reopen in container`.
Po każdej zmianie plików konfiguracyjnych w `.devcontainer` należy przebudować kontener, aby zmiany

## VSCode i Docker compose
