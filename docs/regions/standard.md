---
title: Region definition and authority
---

# MeshCore Canada region definition and authority

This standard defines one Canada-wide region system: how every location is assigned, how boundaries are generated, how large regions split, who may approve changes, and which source wins when sources disagree.

| Standard | Value |
| --- | --- |
| Identifier | MCC-REG-1 |
| Version | 1.0 proposed |
| Geographic reference | Statistics Canada 2021 Census geography |
| Current semantic input | Canada MeshCore Region Strategy v1.1.1 |
| Current community boundary input | MeshMapper Canada snapshot, 2026-07-12 |
| Adoption | Becomes normative when approved and merged by MeshCore Canada |

!!! important "What is authoritative today?"
    This page is the proposed authority policy. The current map is still a review tool: it contains 29 MeshMapper source polygons mapped to 27 candidate tags and approximate areas for the other candidates. No raw source polygon or approximate circle is an authoritative boundary. A geographic release becomes authoritative only when its complete Dissemination Area membership file passes every release check in this standard.

## The decision

MeshCore Canada will maintain two related layers:

1. **One geographic partition.** Every part of Canada belongs to exactly one geographic leaf in the path `can → province or territory → region → optional subregion`. Sibling areas never overlap and there are no gaps.
2. **A separate routing-overlay registry.** Shared operating scopes such as `ncr`, `lloyd`, `pnw`, a future Lake Ontario scope, or event scopes may overlap the geographic partition. They do not own base geography.

The published MeshCore Canada registry is the single source of truth. A boundary is not stored as a hand-drawn polygon. It is stored as a list of official Statistics Canada geographic cells, then regenerated from those cells.

This distinction matters because MeshCore routes on exact region names. A parent-child tree organizes configuration and responsibility; it does not make a repeater automatically carry a parent or child scope. A repeater must explicitly carry every scope it is meant to forward.

## Canonical model

### Geographic records

| Level | Purpose | Rule |
| --- | --- | --- |
| `can` | National root | One record; short tag remains `can` |
| Province or territory | Jurisdiction and stewardship | The 13 official Canadian jurisdictions |
| Region | Stable operating area | Exhaustive within its jurisdiction |
| Subregion | Optional split of a region | Exhaustive within its parent; never overlaps a sibling |

A region with no children is a geographic leaf. When it is split, all of its cells move to subregions and the former leaf remains their parent. A location has one and only one leaf.

Every record has separate fields for:

- an immutable registry ID such as `ca-ab-r0014`;
- one canonical, globally unique on-air tag;
- English and French labels;
- optional locally approved Indigenous and historical labels;
- its parent registry ID;
- its source and review history;
- its release state: `proposed`, `reviewed`, `active`, `deprecated`, or `retired`.

Names, tags, and geometry may change through review. The immutable ID does not.

### Routing overlays

An overlay is an exact on-air scope with an approved purpose and coverage rule, but it is not a second geographic parent. Examples include:

- `ncr` for the National Capital Region across Ontario and Québec;
- `lloyd` for coordinated operation around Lloydminster across Alberta and Saskatchewan;
- `pnw` where Canadian operators intentionally coordinate with the Pacific Northwest mesh;
- a future `lo` scope if Lake Ontario operators on both sides approve it.

The geographic resolver returns one base path and may recommend zero or more overlays. Cross-jurisdiction overlays require approval from every affected jurisdiction. International overlays also require coordination with the neighbouring network.

One canonical tag cannot be active in both registries. During migration, `ncr` and `lloyd` may have an inactive `legacy-dual-role` overlay marker beside their existing hierarchy record. The marker documents the intended move; it is not a second active scope. Activating the overlay requires removing geographic-cell ownership from the legacy record and assigning those cells to ordinary jurisdiction leaves in the same release.

## Nationwide coverage frame

The topology atom is the **2021 Statistics Canada Dissemination Area (DA)**. The 57,936 DAs together cover all of Canada. They are small, relatively stable, respect census-subdivision and census-tract boundaries, and usually follow visible features such as roads and water.

The generator uses the 76 official **2021 Economic Regions (ERs)** as broad guardrails. ERs keep an urban seed from absorbing a large, unrelated rural area merely because it is the closest seed. ER names are not automatically used as on-air names.

The current strategy contributes 192 candidate geographic seeds. MeshMapper contributes 29 community source polygons mapped to 27 canonical candidate tags. These are inputs to the complete partition, not competing final layers.

| Jurisdiction | ER guardrails | Current candidate leaves | MeshMapper source polygons |
| --- | ---: | ---: | ---: |
| British Columbia | 8 | 29 | 9 |
| Alberta | 8 | 14 | 4 |
| Saskatchewan | 6 | 11 | 1 |
| Manitoba | 8 | 10 | 1 |
| Ontario | 11 | 50 | 10 |
| Québec | 17 | 17 | 4 |
| New Brunswick | 5 | 15 | 0 |
| Nova Scotia | 5 | 18 | 0 |
| Prince Edward Island | 1 | 3 | 0 |
| Newfoundland and Labrador | 4 | 11 | 0 |
| Yukon | 1 | 6 | 0 |
| Northwest Territories | 1 | 5 | 0 |
| Nunavut | 1 | 3 | 0 |
| **Canada** | **76** | **192** | **29** |

The candidate leaf catalog remains machine-readable in [`canada-regions.json`](../assets/regions/canada-regions.json). The table above does not ratify every candidate name or grouping. Fuzzy hub areas—especially in Alberta, Saskatchewan, Manitoba, Newfoundland and Labrador, Yukon, and parts of Québec—remain priorities for local review before activation.

### Current-system audit

The present prototype confirms why a new authority layer is needed:

- all 218 hierarchy records still have `proposal` status;
- 192 overlapping seed-radius areas and 29 raw MeshMapper polygons are displayed together, but they do not form a partition;
- 52 of the 192 seed centres currently resolve to another tag or no tag under the prototype resolver, including three cross-jurisdiction results;
- the 29 MeshMapper polygons contain 29 non-trivial overlap pairs; they must be reconciled before use as one layer;
- the current `YXX` source polygon is an obvious area outlier and must be refreshed or explicitly approved before it can anchor Abbotsford;
- six normalized aliases have more than one owner, so ambiguous searches require jurisdiction context or an explicit choice.

These are migration findings, not accepted region definitions. The active-release checks below turn each one into a fail-closed test.

### Complete guardrail inventory

Every DA falls inside one of these province-or-territory and ER combinations. Codes are from the 2021 Standard Geographical Classification.

| Jurisdiction | Economic regions |
| --- | --- |
| Newfoundland and Labrador | `1010` Avalon Peninsula; `1020` South Coast–Burin Peninsula; `1030` West Coast–Northern Peninsula–Labrador; `1040` Notre Dame–Central Bonavista Bay |
| Prince Edward Island | `1110` Prince Edward Island |
| Nova Scotia | `1210` Cape Breton; `1220` North Shore; `1230` Annapolis Valley; `1240` Southern; `1250` Halifax |
| New Brunswick | `1310` Campbellton–Miramichi; `1320` Moncton–Richibucto; `1330` Saint John–St. Stephen; `1340` Fredericton–Oromocto; `1350` Edmundston–Woodstock |
| Québec | `2410` Gaspésie–Îles-de-la-Madeleine; `2415` Bas-Saint-Laurent; `2420` Capitale-Nationale; `2425` Chaudière-Appalaches; `2430` Estrie; `2433` Centre-du-Québec; `2435` Montérégie; `2440` Montréal; `2445` Laval; `2450` Lanaudière; `2455` Laurentides; `2460` Outaouais; `2465` Abitibi-Témiscamingue; `2470` Mauricie; `2475` Saguenay–Lac-Saint-Jean; `2480` Côte-Nord; `2490` Nord-du-Québec |
| Ontario | `3510` Ottawa; `3515` Kingston–Pembroke; `3520` Muskoka–Kawarthas; `3530` Toronto; `3540` Kitchener–Waterloo–Barrie; `3550` Hamilton–Niagara Peninsula; `3560` London; `3570` Windsor–Sarnia; `3580` Stratford–Bruce Peninsula; `3590` Northeast; `3595` Northwest |
| Manitoba | `4610` Southeast; `4620` South Central; `4630` Southwest; `4640` North Central; `4650` Winnipeg; `4660` Interlake; `4670` Parklands; `4680` North |
| Saskatchewan | `4710` Regina–Moose Mountain; `4720` Swift Current–Moose Jaw; `4730` Saskatoon–Biggar; `4740` Yorkton–Melville; `4750` Prince Albert; `4760` Northern |
| Alberta | `4810` Lethbridge–Medicine Hat; `4820` Camrose–Drumheller; `4830` Calgary; `4840` Banff–Jasper–Rocky Mountain House; `4850` Red Deer; `4860` Edmonton; `4870` Athabasca–Grande Prairie–Peace River; `4880` Wood Buffalo–Cold Lake |
| British Columbia | `5910` Vancouver Island and Coast; `5920` Lower Mainland–Southwest; `5930` Thompson–Okanagan; `5940` Kootenay; `5950` Cariboo; `5960` North Coast; `5970` Nechako; `5980` Northeast |
| Yukon | `6010` Yukon |
| Northwest Territories | `6110` Northwest Territories |
| Nunavut | `6210` Nunavut |

## Authority and source precedence

The **published registry release** is the final operational authority. Its inputs have different jobs:

| Priority | Source | Role |
| ---: | --- | --- |
| 1 | Approved registry decisions | Explicit boundary, naming, split, merge, or overlay decisions |
| 2 | MeshMapper Canada | Main community boundary and identity anchor where it has a Canadian region |
| 3 | Canada MeshCore Region Strategy v1.1.1 | Candidate tags, parent relationships, and seeds outside MeshMapper coverage |
| 4 | Deterministic generator | Assigns every still-unclaimed DA without inventing another manual layer |

Statistics Canada is the topology authority at every priority. MeshMapper and approved community shapes decide intended coverage; the final edge is snapped to whole DAs so neighbours share the same boundary.

Other sources have supporting roles:

- SGC Economic Regions prevent unreasonable long-distance growth.
- Census divisions and census subdivisions add boundary-crossing penalties.
- Current provincial and territorial datasets validate municipal changes and local terminology.
- The Canadian Geographical Names Database validates place names.
- First Nations reserve, Inuit region, Métis settlement, treaty, and Canada Lands data are context and review overlays. They do not become operational boundaries or names without affected-community review.

An approved local decision may refine a MeshMapper anchor. It must identify the changed DAs, explain the local consensus, pass the same QA, and receive a new registry release. Raw polygons from different providers are never stacked together as a final “best effort” layer.

## Deterministic boundary generation

The generator must produce the same result from the same locked inputs.

### 1. Lock inputs

Record the download URL, release date, licence, file size, and SHA-256 hash for:

- the 2021 DA digital and cartographic boundary files;
- the 2021 Dissemination Geographies Relationship File;
- the 2021 SGC Economic Region classification;
- the MeshMapper Canada snapshot;
- the candidate registry, approved overrides, and generator configuration.

Do not mix a newer Census Subdivision file into the 2021 DA suite. Newer municipal files are change advisories until a complete compatible census-geography suite is adopted.

### 2. Normalize geometry

Validate and repair source geometry, calculate area in `ESRI:102001` (Canada Albers Equal Area Conic), and publish web output in WGS 84. Each DA is addressed by its DGUID, not by a row number or a label.

For MCC-REG-1, “DA land geometry” means the matching 2021 cartographic DA geometry after `GEOS MakeValid` and snap-rounding to a 0.1 metre precision grid. “Representative point” means GEOS `PointOnSurface` calculated from that land geometry. Overlap area is measured from that geometry in `ESRI:102001`; the digital DA geometry is not used as a land mask. `sources.lock.json` records the exact cartographic and digital files, while `generator.yml` records the GEOS, PROJ, GDAL, and generator versions plus all repair and precision settings.

Before a source polygon may anchor cells, it must pass geometry validity, non-zero area, declared-centre containment, declared-jurisdiction compatibility, and area-to-declared-radius sanity checks. A geographic anchor is clipped at its province-or-territory boundary; any source area on the other side is logged and may inform an approved overlay, but cannot claim the neighbouring geographic partition. A source that cannot be reconciled safely is quarantined and the candidate falls back to its reviewed strategy seed until the source is corrected.

### 3. Snap approved and MeshMapper anchors

A source polygon claims a DA when either:

- the DA representative point is covered by the source polygon; or
- at least 50% of the DA land area overlaps the source polygon.

If anchors claim the same DA, the winner is selected by:

1. an explicit approved override;
2. the largest overlap ratio;
3. the source-priority value in the registry;
4. the lexically smallest immutable registry ID.

Every conflict is written to the QA report. No conflict is silently discarded.

### 4. Seed uncovered candidate regions

Each accepted strategy region without a locked anchor claims the DA containing its seed point. A seed on a boundary uses the lexically smallest covering DA DGUID. A seed outside its declared jurisdiction is a release-blocking error.

Two candidate seeds in the same DA, or a seed landing in a DA already locked to another region, is also a release-blocking conflict. The registry must correct the seed or add an explicit reviewed membership override; the generator never silently moves a seed or picks a winner.

### 5. Build the adjacency graph

Two DAs are neighbours only when their land polygons share an edge. Corner contact does not count. An edge is weighted by the distance between the DAs' representative points. The initial generator adds a 10 km cost when crossing a Census Subdivision boundary and a further 40 km when crossing a Census Division boundary. These constants are versioned in `generator.yml`.

Automatic growth never crosses a province or territory. Every active geographic record also declares `allowed_er_codes`. The initial candidate list is the ER containing its seed plus any ER touched by its accepted locked anchor; additions or removals require review. Growth stays inside that declared list.

### 6. Fill every gap

Within each jurisdiction and ER, run a multi-source shortest-path assignment from all eligible locked cells and seeds. Equal-cost ties resolve by source priority, then immutable registry ID. The QA report compares each generated region with every strategy radius and source polygon that informed it, including cells and population added or removed. An unexplained ER truncation is release-blocking.

If an ER has no eligible region, create a neutral proposed fallback record for that ER. Do not let the nearest city in another ER absorb it. The fallback must be named or merged through local review before activation.

For a disconnected island or land component, choose an existing owner in this order: same Census Subdivision, same Census Division, same ER, then shortest geodesic distance within the jurisdiction. MultiPolygon output is valid; synthetic water bridges are not.

### 7. Generate both boundary products

- The resolver uses DA **digital** boundaries so coastal water is handled consistently.
- The public map uses DA **cartographic** boundaries for a clean shoreline.

Both products use the same DA membership. A point covered by more than one polygon edge resolves to the leaf with the lexically smallest DA DGUID, then the lexically smallest registry ID.

## Splitting and merging

Large regions split by moving whole DAs, not by drawing a new freehand line.

A split proposal must include:

- the parent region ID;
- the DGUID membership of every proposed child;
- proposed canonical tags and English/French labels;
- the local reason for the split;
- evidence of affected-community review;
- an updated command-budget report.

All parent cells must belong to exactly one child. The old parent remains in the hierarchy and may remain an on-air parent scope; it no longer owns geographic cells.

Aggregate Dissemination Areas are useful starting groups for a split, but their codes are not permanent identity. They may be divided or combined when local geography calls for it.

A merge preserves every retired ID and tag as an alias or tombstone. A retired tag is never silently reused for another place.

## Names and on-air tags

The registry follows the forum's preference for short, flat, human-readable tags. Hierarchy is stored in parent fields rather than repeated inside every tag.

Canonical on-air tags must:

- be globally unique across the connected mesh;
- contain only lowercase `a-z`, `0-9`, and `-`;
- use no more than 29 UTF-8 bytes;
- remain stable once active;
- avoid automatic “largest town wins” naming for broad rural areas;
- be checked against active, deprecated, retired, alias, and overlay tags.

IATA and postal codes may be aliases where helpful, but neither system is the national naming authority. New subregions use a locally meaningful flat tag when one is unambiguous. A parent-prefixed tag is a fallback for collision avoidance, not a requirement.

Generated commands use canonical tags only. Search may accept labels and aliases. The registry stores English and French labels separately; local Indigenous names require review by the affected community and are never inferred.

## Governance

### Responsibilities

| Role | Responsibility |
| --- | --- |
| MeshCore Canada region maintainers | Registry integrity, collision checks, releases, generator and QA |
| Provincial or territorial stewards | Coordinate local proposals and confirm jurisdiction-wide effects |
| Local operators and communities | First review of local names, grouping, and practical coverage |
| Cross-boundary partners | Joint approval of overlays and international scopes |

The national maintainers enforce the data model; they do not invent local identity. A technically valid change may still wait for local review. A locally popular change may still fail if it creates a gap, overlap, collision, or command-budget violation.

### Change process

1. Open a proposal with a map, affected DGUIDs, names, tags, reason, and named reviewers.
2. Generate a before/after diff and QA report.
3. Obtain affected local and jurisdiction review. Cross-boundary proposals require every affected side.
4. Allow a public review window recorded in the proposal.
5. Merge the registry change and publish a versioned release.
6. Keep the previous release available for rollback and migration.

Versioning rules:

- **Major:** census-geography vintage or incompatible authority/model change.
- **Minor:** DA reassignment, split, merge, hierarchy change, tag change, or overlay change.
- **Patch:** labels, aliases, documentation, or source metadata with no membership change.

Operational region boundaries are community routing definitions. They are not legal, electoral, cadastral, treaty, title, or sovereignty claims.

## Release checks

A geographic release fails unless all of these are true:

- all 57,936 DAs appear exactly once in the leaf-membership table;
- every DA's leaf is inside the same province or territory;
- sibling leaves have zero land-area overlap;
- all leaves together equal the chosen Canada digital boundary extent;
- every subregion union equals its parent membership;
- every active region is contiguous by shared land edge, or has a documented island/MultiPolygon exception;
- every active tag is globally unique and within the firmware byte limit;
- every old tag resolves to an active record, a deprecated record, or a tombstone;
- every active geographic record has reviewed `allowed_er_codes`, and no seed or locked-cell conflict remains;
- every MeshMapper anchor has a DA-level deviation report;
- every source polygon passes the area, centre, jurisdiction-compatibility, and review-state checks before it is used as an anchor;
- all generated geometry is valid and reproducible from locked inputs;
- all generated command fixtures fit the 32-region, 172-byte response, and 160-character serial-line limits;
- English and French labels are present for every active geographic and overlay record;
- the QA report contains no unreviewed conflicts or fallback regions.

## Required registry artifacts

Before the first MCC-REG-1 geographic release is marked active, the repository must publish:

| Artifact | Purpose |
| --- | --- |
| `sources.lock.json` | Exact inputs, licences, and hashes |
| `generator.yml` | Algorithm version and all constants |
| `regions.yml` | Geographic records, hierarchy, and reviewed `allowed_er_codes` |
| `overlays.yml` | Shared routing scopes and approvals |
| `da-membership.csv` | One row for every DA DGUID and its leaf ID |
| `aliases.csv` | Current, deprecated, historical, and search aliases |
| `regions.geojson` | Generated cartographic map layer |
| `regions-digital.geojson` | Generated resolver layer |
| `qa.json` and a readable QA report | Release evidence and source deviations |
| `configuration.yml` | Firmware and radio-setting policy kept separate from geography |

Generated GeoJSON is a build output. `regions.yml`, `overlays.yml`, `da-membership.csv`, and the source lock are the authority inputs. A tag duplicated between `regions.yml` and `overlays.yml` is a release error unless the overlay entry is an explicitly inactive migration marker.

## Migration from the current map

| Phase | Result | Boundary status |
| --- | --- | --- |
| Current PR | 192 strategy candidates and 29 MeshMapper source polygons mapped to 27 tags in one UI | Source polygons where present; otherwise approximate |
| Source lock | Statistics Canada, MeshMapper, strategy, and override inputs frozen | Reproducible inputs |
| Generated draft | Every DA assigned; automated QA published | Complete but proposed |
| Local review | Alberta and other fuzzy hub areas corrected; names reviewed in both official languages | Reviewed |
| Active release | Membership and artifacts pass every release check | Authoritative |

During migration, MeshMapper remains the main source where it has a region. The current circles and nearest-seed shading are never promoted as final polygons. `ncr`, `lloyd`, and other shared concepts move into the overlay registry without losing their established on-air tags.

## Repeater configuration rules

Generated instructions must follow the current [official MeshCore CLI documentation](https://docs.meshcore.io/cli_commands/), not copied examples from an older strategy document.

- Use `region def` or `region put` to define the exact tree required by that repeater.
- `name|jump` creates `name` under the current cursor and then moves the cursor to `jump`; `jump` is not the parent of `name`.
- `region def` does not clear the current tree and may leave partial changes after an error.
- Run bare `region` to inspect the result.
- Run `region save` only after the tree and flood permissions are correct.

The setup tool must generate and test commands from registry parent IDs. It must never infer command order by splitting a tag string.

## Source record

- [MeshCore Canada forum discussion](https://forum.meshcore.ca/t/thoughts-canadian-regions-strategy/54), including the complete-coverage and administrative-building-block discussion in [posts 29–36](https://forum.meshcore.ca/t/thoughts-canadian-regions-strategy/54/29), the local-authority discussion in [posts 43–44](https://forum.meshcore.ca/t/thoughts-canadian-regions-strategy/54/43), and the discoverability concern in [post 50](https://forum.meshcore.ca/t/thoughts-canadian-regions-strategy/54/50).
- Canada MeshCore Region Strategy v1.1.1, dated 2026-06-23. Supplied PDF SHA-256: `9f32d71d2656cfa3abfda4736c3ddb64d1b6e7c5d4e88a7d55b63424f9353a3b`.
- [MeshMapper](https://meshmapper.net/) Canada snapshot `meshmapper-ca-2026-07-12`.
- [Statistics Canada 2021 DA definition](https://www12.statcan.gc.ca/census-recensement/2021/ref/dict/az/definition-eng.cfm?ID=geo021), [2021 Boundary Files guide](https://www150.statcan.gc.ca/n1/pub/92-160-g/92-160-g2021001-eng.htm), [2021 dissemination-geography relationships](https://www12.statcan.gc.ca/census-recensement/2021/geo/sip-pis/dguid-idugd/index2021-eng.cfm?year=21), and [2021 Economic Region standard](https://www.statcan.gc.ca/en/subjects/standard/sgc/2021/er-additionalinfo).
- [Statistics Canada Open Licence](https://www.statcan.gc.ca/en/terms-conditions/open-licence).
