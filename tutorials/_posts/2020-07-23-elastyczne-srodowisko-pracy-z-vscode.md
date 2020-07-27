---
layout: article
title: Elastyczne środowisko pracy z&nbsp;VSCode
sub-title: VS Code + Docker = ❤️
title-image: /media/posts/historia-powstania-bloga.jpg
date: 2020-07-23
description: Historia powstania bloga oraz decyzje projektowe
category: [Narzędzia, DevOps]
---

## Wprowadzenie

Przygotowanie środowiska developerskiego nie jest prostym zadaniem, a przynajmniej nie było, dopóki nie pojawiły się narzędzia służące do konteneryzacji,
dzięki którym możemy dostarczać oprogramowanie na odpowiednio dostosowanej wersji systemu operacyjnego wraz z wszystkimi narzędziami.
Zanim narzędzia te stały się popularne istniała potrzeba pisania i ciągłego aktualizowania wszelkiego rodzaju skryptów czy używania maszyn wirtualnych dopasowanych w mniejszym lub większym stopniu do wymagań.

Korzystając z dobrodziejstw konteneryzacji, a dokładniej *Dockera* oraz jego integracji z *VS Code* możemy pójść o krok dalej i cały proces tworzenia oprogramowania wykonywać w kontenerze, co daje nam niesamowitą przenośność.
Na naszym *hostcie* potrzebujemy jedynie dwóch wcześniej wymienionych programów, które są wieloplatformowe, a także udostępnione jako otwarte oprogramowanie.

## VSCode w kontenerze

### Przygotowania
Potrzebujemy wtyczki do VSCode `ms-vscode-remote.remote-containers`. Daje nam ona możliwość uruchomienia edytora (lub jego podpięcie) w kontenerze. Bardzo łatwo zainstalujemy ją za pomocą wbudowanego sklepu (`Ctrl+Shift+X`).
Można również skorzystać z opcji autogenerowania konfiguracji, jeśli wygenerowany plik nas zadowoli, możemy od razu przejść do [otwierania w kontenerze](#otwieranie).
Jeżeli jednak chcemy od razu skonfigurować środowisko tworzymy folder **.devcontainer**, a w nim plik **devcontainer.json**, który uzupełniamy poniższą konfiguracją:

```json
{
    "name": "Nazwa",
    "build": {
        "context": "<ścieżka do kontekstu builda Dockerfile>",
        "dockerfile": "<ścieżka do Dockerfile>"
    },
    "settings": {
        "terminal.integrated.shell.linux": "/bin/bash"
    },
    "extensions": [
        "ms-dotnettools.csharp"
    ],
    "mounts": [],
    "remoteEnv": {},
    "forwardPorts":[],
}
```

Kolekcję `"extensions"` możemy uzupełniać o kolejne roszerzenia, które automatycznie zostaną doinstalowane do naszego kontenera roboczego. W kolekcji `"forwardPorts"` możemy wskazać porty, które powinny być przekierowane, natomiast za pomocą `"mounts"` ustalamy współdzielenie zasobów dyskowych pomiędzy *hostem*, a kontenerem.

Zamiast klucza `"build"` możemy wskazać bezpośrednio obraz *Dockera* za pomocą `"image"`, wtedy konfiguracja zawierałaby:
```json
{
    "name": "Nazwa",
    "image": "nazwa-obrazu:tag",
    //... 
}
```

Dokładny opis pliku konfiguracyjnego można znaleźć w [oficjalnej dokumentacji rozszerzenia](https://code.visualstudio.com/docs/remote/devcontainerjson-reference).

### Otwieranie
Otwieramy panel komend edytora (`Ctrl+Shift+P`), lub klikamy w zielony przycisk znajdujący się w lewym dolnym rogu okna, a następnie wybieramy opcję: `Reopen in container`.

## VSCode i Docker compose
A co w przypadku, gdy potrzebujemy na przykład bazy danych, albo innego serwisu, który nie znajduje się w naszym projekcie, trzeba go odpalać ręcznie?
Odpowiedzią na to pytanie będzie użycie *Docker compose*.

Tworzymy więc plik **docker-compose.yml** w uprzednio stworzony folderze **.devcontainer**

```yaml
version: "3.5"
services:
    developer-vscode:
        volumes:
            - ../:/workspace:delegated
        command: /bin/sh -c "while sleep 1000; do :; done"
```

Zatem w pliku **devcontainer.json** zastępujemy klucz `"build"` lub `"image"` następującymi wpisami:

```json
{
    "service": "developer-vscode",
    "workspaceFolder": "/workspace",
    "dockerComposeFile": [
        "<ścieżka do docker-compose z serwisami>",
        "./docker-compose.yml"
    ]
}
```

Wartość `service` musi odpowiadać nazwie serwisu podanego w pliku **docker-compose.yml**, a jeżeli zdecydujemy rozbić plik konfiguracyjny, to także w **docker-compose z serwisami**.

Teraz możemy przebudować i otworzyć projekt w kontenerze i gotowe, możemy cieszyć się w pełni przenośnym i łatwo zarządzalnym środowiskiem developerskim.