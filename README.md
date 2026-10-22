# Familjehub för Home Assistant

Lägg till detta förråd i Home Assistants tilläggsbutik:

```text
https://github.com/mc-attack/familjehub-addon
```

Installera Familjehub, starta tillägget och öppna webbgränssnittet.
Förrådet innehåller installationsinformation; själva appen hämtas från de publika
paketen `familjehub-amd64` eller `familjehub-aarch64` på GitHub Container Registry.

## Publicering

Efter test och bygge skickar utvecklingsrepot en `familjehub-release`-signal med
version och källrevision. Arbetsflödet **Publicera till Home Assistant** kontrollerar
att alla tre containerpaket är publika innan `familjehub/config.yaml` uppdateras.
`familjehub/release.json` sparar den publicerade versionen och revisionen, så att
byggflödet kan kontrollera att publiceringen faktiskt är klar.

Äldre versioner får inte ersätta nyare. Ett versionsnummer med sparad källrevision
får inte publiceras igen med annan kod. Publiceringsskydden testas automatiskt.

Manuell publicering finns kvar: Actions → Publicera till Home Assistant → Run workflow,
med ett versionsnummer som redan är byggt och publikt på GHCR.

För automatiken skapas en fine-grained token begränsad till detta repo med
Contents: Read and write. Den sparas som `ADDON_REPO_TOKEN` i utvecklingsrepots
Actions-secrets. Lägg aldrig token i filer, ärenden eller chatt. Förnya den före utgång.

## Data och uppdateringar

Familjehub har ett eget tilläggs-id. En äldre Familjetavla-installations data flyttas
inte automatiskt; använd appens säkerhetskopia vid flytt. Installerade inställningar
sparas i tilläggets datamapp och kan ingå i Home Assistants säkerhetskopior.

Home Assistant hittar nya versioner efter publicering. Installation sker manuellt
eller via Home Assistants automatiska uppdateringar om du väljer att aktivera dem.
