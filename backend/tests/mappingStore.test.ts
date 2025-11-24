/**
 * Example unit tests for the mapping store
 */

import { describe, it, expect, beforeEach } from "vitest";
import { MappingStore } from "../src/store/mappingStore.js";
import type { MappingEntry } from "../src/models/mapping.js";

describe("MappingStore", () => {
  let store: MappingStore;

  beforeEach(() => {
    store = new MappingStore();
  });

  it("should add and retrieve entries", () => {
    const entry: MappingEntry = {
      id: "test-1",
      cis_control_id: "CIS Control 06",
      cis_safeguard_id: "6.3",
      iso_27001_clause_ids: ["5.2"],
      iso_27001_annex_a_ids: ["A.5.36"],
      nis2_article_ids: ["Art 21(2)(d)"],
      sources: ["CIS_ISO"],
      relationship_type: "covers"
    };

    store.addEntry(entry);
    const retrieved = store.getEntry("test-1");

    expect(retrieved).toBeDefined();
    expect(retrieved?.cis_control_id).toBe("CIS Control 06");
    expect(retrieved?.cis_safeguard_id).toBe("6.3");
  });

  it("should find entries by CIS control", () => {
    const entry1: MappingEntry = {
      id: "test-1",
      cis_control_id: "CIS Control 06",
      cis_safeguard_id: "6.3",
      iso_27001_clause_ids: [],
      iso_27001_annex_a_ids: [],
      nis2_article_ids: [],
      sources: ["CIS_ISO"],
      relationship_type: "covers"
    };

    const entry2: MappingEntry = {
      id: "test-2",
      cis_control_id: "CIS Control 06",
      cis_safeguard_id: "6.4",
      iso_27001_clause_ids: [],
      iso_27001_annex_a_ids: [],
      nis2_article_ids: [],
      sources: ["CIS_ISO"],
      relationship_type: "supports"
    };

    store.addEntry(entry1);
    store.addEntry(entry2);

    const results = store.findByCIS("CIS Control 06");
    expect(results.length).toBeGreaterThanOrEqual(2);
  });

  it("should find entries by ISO Annex A", () => {
    const entry: MappingEntry = {
      id: "test-1",
      cis_control_id: "CIS Control 06",
      iso_27001_clause_ids: [],
      iso_27001_annex_a_ids: ["A.5.36"],
      nis2_article_ids: [],
      sources: ["CIS_ISO"],
      relationship_type: "covers"
    };

    store.addEntry(entry);
    const results = store.findByISO(undefined, "A.5.36");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].iso_27001_annex_a_ids).toContain("A.5.36");
  });

  it("should find entries by NIS2 article", () => {
    const entry: MappingEntry = {
      id: "test-1",
      cis_control_id: "CIS Control 06",
      iso_27001_clause_ids: [],
      iso_27001_annex_a_ids: [],
      nis2_article_ids: ["Art 21(2)(d)"],
      sources: ["CIS_NIS2"],
      relationship_type: "covers"
    };

    store.addEntry(entry);
    const results = store.findByNIS2("Art 21(2)(d)");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].nis2_article_ids).toContain("Art 21(2)(d)");
  });

  it("should search across all frameworks", () => {
    const entry: MappingEntry = {
      id: "test-1",
      cis_control_id: "CIS Control 06",
      cis_safeguard_id: "6.3",
      iso_27001_clause_ids: ["5.2"],
      iso_27001_annex_a_ids: ["A.5.36"],
      nis2_article_ids: ["Art 21(2)(d)"],
      sources: ["CIS_ISO"],
      relationship_type: "covers"
    };

    store.addEntry(entry);

    const results = store.search("6.3");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.framework === "CIS")).toBe(true);
  });

  it("should return correct count", () => {
    expect(store.getCount()).toBe(0);

    const entry: MappingEntry = {
      id: "test-1",
      cis_control_id: "CIS Control 06",
      iso_27001_clause_ids: [],
      iso_27001_annex_a_ids: [],
      nis2_article_ids: [],
      sources: ["CIS_ISO"],
      relationship_type: "covers"
    };

    store.addEntry(entry);
    expect(store.getCount()).toBe(1);
  });
});

