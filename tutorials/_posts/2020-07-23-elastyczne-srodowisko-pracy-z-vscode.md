---
layout: article
title: Elastyczne środowisko pracy z&nbsp;VSCode
sub-title: VS Code + Docker = ❤️
title-image: /media/posts/elastyczne-srodowisko-pracy-z-vscode.jpg
date: 2020-07-23
description: Historia powstania bloga oraz decyzje projektowe
category: [Narzędzia, DevOps]
---

## Wprowadzenie

Przygotowanie środowiska developerskiego nie jest prostym zadaniem, a przynajmniej nie było, dopóki nie pojawiły się narzędzia służące do konteneryzacji,
dzięki którym możemy dostarczać oprogramowanie na odpowiednio dostosowanej wersji systemu operacyjnego wraz ze wszystkimi niezbędnymi zależnościami.
Zanim narzędzia te stały się popularne istniała potrzeba pisania różnego rodzaju skryptów i ciągłego ich aktualizowania, czy używania maszyn wirtualnych dopasowanych w mniejszym lub większym stopniu do wymagań systemu.

Korzystając z dobrodziejstw konteneryzacji, a dokładniej *Dockera* oraz jego integracji z *VS Code* możemy pójść o krok dalej i cały proces tworzenia oprogramowania wykonywać w kontenerze, co daje nam niesamowitą przenośność.
Na naszym *hostcie* potrzebujemy jedynie dwóch wcześniej wymienionych, wieloplatformowych programów, które udostępnione są jako otwarte oprogramowanie.

## VSCode w kontenerze

### Przygotowania
Potrzebujemy wtyczki do *VSCode*: `ms-vscode-remote.remote-containers`. Daje nam ona możliwość uruchomienia edytora (lub jego podpięcia) w kontenerze. Bardzo łatwo zainstalujemy ją za pomocą wbudowanego sklepu (`Ctrl+Shift+X`).
W przypadku, gdy nie potrzebujemy tworzyć zaawansowanych konfiguracji możemy skorzystać z opcji autogenerowania i od razu przejść do [otwierania w kontenerze](#otwieranie). Jeśli wygenerowany plik nas zadowala lub chcemy od razu skonfigurować środowisko, tworzymy folder **.devcontainer**, a w nim plik **devcontainer.json**, który uzupełniamy poniższą konfiguracją:

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

Kolekcję `"extensions"` możemy uzupełniać o kolejne roszerzenia, które automatycznie zostaną doinstalowane do naszego edytora w kontenerze roboczym. W kolekcji `"forwardPorts"` możemy wskazać porty, które powinny zostać przekierowane, natomiast za pomocą `"mounts"` ustalamy współdzielenie zasobów dyskowych pomiędzy *hostem*, a kontenerem.

Zamiast klucza `"build"` możemy wskazać bezpośrednio obraz *Dockera* za pomocą `"image"`. Wtedy konfiguracja zawierałaby:
```json
{
    "image": "nazwa-obrazu:tag",
}
```

Dokładny opis pliku konfiguracyjnego można znaleźć w [oficjalnej dokumentacji rozszerzenia](https://code.visualstudio.com/docs/remote/devcontainerjson-reference).

### Otwieranie
Otwieramy panel komend edytora (`Ctrl+Shift+P`), lub klikamy w zielony przycisk znajdujący się w lewym dolnym rogu okna, a następnie wybieramy opcję: `Reopen in container`.

## VSCode i Docker compose
A co w przypadku, gdy potrzebujemy na przykład bazy danych, albo innego serwisu, który nie znajduje się w naszym projekcie, trzeba go odpalać ręcznie?
Odpowiedzią na to pytanie będzie użycie *Docker compose*.

Tworzymy plik **docker-compose.yml** w uprzednio stworzonym folderze **.devcontainer** i uzupełniamy go definiując serwis na którym będziemy pracowali w następujący sposób:

```yaml
version: "3.5"
services:
    developer-vscode:
        volumes:
            - ../:/workspace:delegated
        command: /bin/sh -c "while sleep 1000; do :; done"
```

Następnie w pliku **devcontainer.json** zastępujemy klucz `"build"` lub `"image"` następującymi wpisami:

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

Po zaktualizowaniu plików konfiguracyjnych możemy przebudować oraz otworzyć projekt w kontenerze i gotowe. Możemy cieszyć się w pełni przenośnym i łatwo zarządzalnym środowiskiem developerskim.