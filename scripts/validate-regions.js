#!/usr/bin/env node
"use strict";

// Current-catalog and onboarding safety checks. MCC-REG-1 requires a second,
// geometry-complete validator before any generated DA release can be active.

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "docs", "assets", "regions", "canada-regions.json");
const MESH_MAPPER_PATH = path.join(ROOT, "docs", "assets", "regions", "meshmapper-canada-regions.json");
const SCRIPT_PATH = path.join(ROOT, "docs", "assets", "regions", "regions.js");
const STANDARD_PATH = path.join(ROOT, "docs", "regions", "standard.md");

const MAX_TAG_BYTES = 29;
const MAX_PROFILE_TAGS = 32;
const MAX_RESPONSE_BYTES = 172;
const MAX_REGION_DEF_CHARS = 160;
const TAG_RE = /^[a-z0-9-]+$/;

const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function check(condition, message) {
  if (!condition) fail(message);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    fail(`${path.relative(ROOT, file)} could not be read: ${error.message}`);
    return null;
  }
}

function unique(values) {
  return [...new Set(values)];
}

function normalizeAlias(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function pointInRing(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const xi = Number(ring[i][0]);
    const yi = Number(ring[i][1]);
    const xj = Number(ring[j][0]);
    const yj = Number(ring[j][1]);
    const crosses = ((yi > lat) !== (yj > lat)) &&
      (lon < ((xj - xi) * (lat - yi)) / ((yj - yi) || Number.EPSILON) + xi);
    if (crosses) inside = !inside;
  }
  return inside;
}

function featureContainsPoint(feature, lat, lon) {
  const geometry = feature && feature.geometry;
  if (!geometry || !["Polygon", "MultiPolygon"].includes(geometry.type)) return false;
  const polygons = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polygons.some((polygon) => {
    if (!polygon.length || !pointInRing(lon, lat, polygon[0])) return false;
    return !polygon.slice(1).some((hole) => pointInRing(lon, lat, hole));
  });
}

function ancestryFor(data, tag) {
  const result = [];
  const seen = new Set();
  let current = tag;
  while (current) {
    if (seen.has(current)) {
      fail(`hierarchy cycle found at ${tag}`);
      break;
    }
    seen.add(current);
    result.unshift(current);
    current = data.hierarchy[current] && data.hierarchy[current].parent;
  }
  return result;
}

function validateCatalog(data, collection, scriptText, standardText) {
  check(data.authority && data.authority.standard === "MCC-REG-1", "catalog does not declare MCC-REG-1");
  check(data.authority && data.authority.currentBoundaryStatus === "review-only", "current boundary data must remain review-only");
  check(data.meta && data.meta.rootTag === "can", "root tag must be can");

  const hierarchyTags = Object.keys(data.hierarchy || {});
  const seedTags = (data.seeds || []).map((seed) => seed.tag);
  const overlays = data.routingOverlays || {};
  const expectedNodes = Number(data.strategy && data.strategy.hierarchyNodes);
  const expectedSeeds = Number(data.strategy && data.strategy.selectableRegions);

  check(hierarchyTags.length === expectedNodes, `expected ${expectedNodes} hierarchy nodes, found ${hierarchyTags.length}`);
  check(seedTags.length === expectedSeeds, `expected ${expectedSeeds} selectable seeds, found ${seedTags.length}`);
  check(new Set(seedTags).size === seedTags.length, "selectable seed tags must be unique");

  const jurisdictions = hierarchyTags.filter((tag) => data.hierarchy[tag].parent === "can");
  check(jurisdictions.length === 13, `expected 13 jurisdictions, found ${jurisdictions.length}`);

  const allTags = unique(hierarchyTags.concat(Object.keys(overlays)));
  allTags.forEach((tag) => {
    check(TAG_RE.test(tag), `invalid tag characters: ${tag}`);
    check(Buffer.byteLength(tag, "utf8") <= MAX_TAG_BYTES, `tag exceeds ${MAX_TAG_BYTES} bytes: ${tag}`);
  });

  Object.keys(overlays).filter((tag) => Boolean(data.hierarchy[tag])).forEach((tag) => {
    const overlay = overlays[tag];
    check(
      overlay.active === false && overlay.state === "migration-marker" &&
        overlay.migrationState === "legacy-dual-role" && overlay.legacyHierarchyTag === tag,
      `${tag} cannot be active in both the geographic and overlay registries`
    );
  });

  hierarchyTags.forEach((tag) => {
    const entry = data.hierarchy[tag];
    if (entry.parent !== null) check(Boolean(data.hierarchy[entry.parent]), `${tag} has missing parent ${entry.parent}`);
    (entry.sharedParents || []).forEach((parent) => {
      check(Boolean(data.hierarchy[parent] || overlays[parent]), `${tag} has missing shared scope ${parent}`);
    });
    const chain = ancestryFor(data, tag);
    check(chain[0] === "can", `${tag} does not descend from can`);
    check(Boolean(data.status && data.status[tag]), `${tag} has no status record`);
  });

  check(Object.keys(data.status || {}).length === hierarchyTags.length, "status records must match hierarchy records exactly");
  seedTags.forEach((tag) => check(Boolean(data.hierarchy[tag]), `seed ${tag} is missing from hierarchy`));

  const aliasOwners = new Map();
  Object.entries(data.aliases || {}).forEach(([owner, aliases]) => {
    check(Boolean(data.hierarchy[owner] || overlays[owner]), `alias owner ${owner} is unknown`);
    aliases.forEach((alias) => {
      const normalized = normalizeAlias(alias);
      if (!normalized) return;
      if (!aliasOwners.has(normalized)) aliasOwners.set(normalized, new Set());
      aliasOwners.get(normalized).add(owner);
    });
  });
  const ambiguousAliases = [...aliasOwners.entries()]
    .filter(([, owners]) => owners.size > 1)
    .map(([alias, owners]) => `${alias}=[${[...owners].sort().join(",")}]`)
    .sort();
  if (ambiguousAliases.length) {
    warnings.push(`ambiguous aliases require context: ${ambiguousAliases.join("; ")}`);
    check(scriptText.includes("That name matches more than one region"), "UI must fail closed on ambiguous aliases");
  }

  const features = collection && Array.isArray(collection.features) ? collection.features : [];
  check(features.length === Number(collection && collection.featureCount), "MeshMapper feature count does not match snapshot metadata");
  check(features.length === Object.keys(data.meshMapperTagMap || {}).length, "every MeshMapper feature must have one crosswalk entry");

  const mappedCanonical = new Set();
  let quarantined = 0;
  features.forEach((feature) => {
    const props = feature.properties || {};
    const rawTag = String(props.tag || props.code || "").toLowerCase();
    const target = data.meshMapperTagMap[rawTag];
    check(Boolean(target), `MeshMapper feature ${rawTag} has no crosswalk`);
    check(Boolean(data.hierarchy[target] && seedTags.includes(target)), `MeshMapper feature ${rawTag} maps to invalid target ${target}`);
    if (target) mappedCanonical.add(target);

    const center = props.center || [];
    check(center.length === 2 && center.every(Number.isFinite), `MeshMapper feature ${rawTag} has an invalid centre`);
    if (center.length === 2) {
      check(featureContainsPoint(feature, Number(center[1]), Number(center[0])), `MeshMapper feature ${rawTag} does not contain its centre`);
    }

    const review = (data.meshMapperReview || {})[rawTag];
    if (review && review.state === "quarantined") quarantined += 1;
  });
  check(mappedCanonical.size === 27, `expected 27 canonical MeshMapper mappings, found ${mappedCanonical.size}`);
  check(quarantined >= 1, "known MeshMapper area outlier must be quarantined");

  Object.keys(data.meshMapperReview || {}).forEach((rawTag) => {
    check(features.some((feature) => String(feature.properties.tag).toLowerCase() === rawTag), `review record ${rawTag} has no source feature`);
  });

  let maxTags = 0;
  let maxResponseBytes = 0;
  let maxRegionDefChars = 0;
  seedTags.forEach((tag) => {
    let tags = ancestryFor(data, tag);
    const profile = data.profiles && data.profiles[tag];
    (profile && profile.additionalTags || []).forEach((entry) => {
      const additionalTag = typeof entry === "string" ? entry : entry.tag;
      check(Boolean(data.hierarchy[additionalTag] || overlays[additionalTag]), `${tag} profile references unknown scope ${additionalTag}`);
      tags.push(additionalTag);
    });
    tags = unique(tags);
    const responseBytes = Buffer.byteLength(tags.join(","), "utf8") + 1;
    const defChars = `region def ${tags.join(" ")}`.length;
    maxTags = Math.max(maxTags, tags.length);
    maxResponseBytes = Math.max(maxResponseBytes, responseBytes);
    maxRegionDefChars = Math.max(maxRegionDefChars, defChars);
    check(tags.length <= MAX_PROFILE_TAGS, `${tag} profile exceeds ${MAX_PROFILE_TAGS} tags`);
    check(responseBytes <= MAX_RESPONSE_BYTES, `${tag} profile exceeds ${MAX_RESPONSE_BYTES} response bytes`);
    if (defChars > MAX_REGION_DEF_CHARS) {
      tags.forEach((item) => {
        const parent = data.hierarchy[item] && data.hierarchy[item].parent;
        const command = parent ? `region put ${item} ${parent}` : `region put ${item}`;
        check(command.length <= MAX_REGION_DEF_CHARS, `${item} fallback command exceeds ${MAX_REGION_DEF_CHARS} characters`);
      });
    }
  });

  check(!scriptText.includes("region dump"), "obsolete 'region dump' command remains in regions.js");
  check(scriptText.includes('verificationCommands = ["region"]'), "guided verification must use bare region command");
  check(scriptText.includes('commands.concat(["region"])'), "technical verification must use bare region command");
  check(scriptText.includes("Too many regions selected"), "command generation must fail closed when firmware budgets are exceeded");

  [
    "57,936 DAs",
    "exactly one geographic leaf",
    "da-membership.csv",
    "routing-overlay registry",
    "Run bare `region`",
    "approximate circle is an authoritative boundary"
  ].forEach((phrase) => check(standardText.includes(phrase), `standard is missing required rule: ${phrase}`));

  return {
    hierarchy: hierarchyTags.length,
    seeds: seedTags.length,
    jurisdictions: jurisdictions.length,
    meshMapperFeatures: features.length,
    meshMapperCanonicalTags: mappedCanonical.size,
    quarantined,
    overlays: Object.keys(overlays).length,
    ambiguousAliases: ambiguousAliases.length,
    maxTags,
    maxResponseBytes,
    maxRegionDefChars
  };
}

const data = readJson(DATA_PATH);
const collection = readJson(MESH_MAPPER_PATH);
let scriptText = "";
let standardText = "";
try {
  scriptText = fs.readFileSync(SCRIPT_PATH, "utf8");
  standardText = fs.readFileSync(STANDARD_PATH, "utf8");
} catch (error) {
  fail(`required source could not be read: ${error.message}`);
}

const summary = data && collection
  ? validateCatalog(data, collection, scriptText, standardText)
  : null;

warnings.forEach((warning) => console.warn(`WARN: ${warning}`));
if (failures.length) {
  failures.forEach((failure) => console.error(`ERROR: ${failure}`));
  console.error(`Region validation failed with ${failures.length} error(s).`);
  process.exit(1);
}

console.log(`Prototype/onboarding validation passed: ${JSON.stringify(summary)}`);
