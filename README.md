# Familjehub för Home Assistant

Installationsrepo för Familjehub, baserat på [Familjetavla av murre87](https://github.com/murre87/familjetavla).
Familjehub har även SchoolSoft-matsedel, läxor och prov, kalenderstyrda fritidstider och scrollbara kortkolumner.

## Installation

Den första versionen är under förberedelse. Familjehub visas i butiken först när en version har publicerats.

Efter publicering:

1. Öppna Home Assistants tilläggs-/appbutik.
2. Öppna menyn med tre punkter → Förråd/Repositories.
3. Lägg till `https://github.com/mc-attack/familjehub-addon`.
4. Installera Familjehub och välj Öppna webbgränssnitt.

## Uppdateringar

Nya paket byggs och testas i utvecklingsrepot. Arbetsflödet **Publicera till Home Assistant**
kontrollerar att båda arkitekturerna kan laddas ned anonymt innan versionsnumret publiceras här.
Home Assistant erbjuder därefter uppdateringen. Installation och uppdatering behåller tilläggets `/data`.

### Engångsinställningar för ägaren

- Paketen `familjehub`, `familjehub-amd64` och `familjehub-aarch64` under mc-attack på GHCR ska vara **Public**.
- För automatisk publicering från utvecklingsrepot används dess Actions-secret `ADDON_REPO_TOKEN`.
  Använd en fine-grained token begränsad till detta installationsrepo med **Contents: Read and write**.
  Lägg aldrig token i en fil eller i chatten.
- Token behöver inte Workflow-behörighet: publiceringsjobbet finns redan här.
- Aktivera Actions i detta repo om GitHub frågar.

### Publicera manuellt

Kör **Publicera till Home Assistant** från Actions och ange den version som redan byggts.
Det fungerar utan en token mellan reporna. Automatiken använder samma kontroll via `repository_dispatch`.

Konfigurationen har ett eget slug (`familjehub`). Ett tidigare installerat Familjetavla-tillägg är därför
ett separat tillägg; dess inställningar flyttas inte automatiskt. Använd appens säkerhetskopia vid flytt.
