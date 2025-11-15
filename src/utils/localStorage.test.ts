import { describe, it, expect, beforeEach } from "vitest";
import {
  saveDraft,
  loadDraft,
  clearDraft,
  hasDraft,
  getDraftKey,
} from "./localStorage";
import { type FormData } from "../types";

describe("localStorage utilities", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe("getDraftKey", () => {
    it("should return correct key for admin role", () => {
      expect(getDraftKey("admin")).toBe("draft_admin");
    });

    it("should return correct key for ops role", () => {
      expect(getDraftKey("ops")).toBe("draft_ops");
    });
  });

  describe("saveDraft and loadDraft", () => {
    it("should save and load draft data for admin", () => {
      const mockData: FormData = {
        basicInfo: {
          fullName: "John Doe",
          email: "john@example.com",
        },
        details: {
          notes: "Test notes",
        },
      };

      saveDraft("admin", mockData);
      const loaded = loadDraft("admin");

      expect(loaded).toEqual(mockData);
    });

    it("should save and load draft data for ops", () => {
      const mockData: FormData = {
        basicInfo: {},
        details: {
          employmentType: "Full-time",
          notes: "Ops notes",
        },
      };

      saveDraft("ops", mockData);
      const loaded = loadDraft("ops");

      expect(loaded).toEqual(mockData);
    });

    it("should keep admin and ops drafts separate", () => {
      const adminData: FormData = {
        basicInfo: { fullName: "Admin User" },
        details: {},
      };
      const opsData: FormData = {
        basicInfo: {},
        details: { notes: "Ops User" },
      };

      saveDraft("admin", adminData);
      saveDraft("ops", opsData);

      expect(loadDraft("admin")).toEqual(adminData);
      expect(loadDraft("ops")).toEqual(opsData);
    });

    it("should return null when no draft exists", () => {
      expect(loadDraft("admin")).toBeNull();
    });
  });

  describe("clearDraft", () => {
    it("should clear draft for specific role only", () => {
      const adminData: FormData = {
        basicInfo: { fullName: "Admin" },
        details: {},
      };
      const opsData: FormData = {
        basicInfo: {},
        details: { notes: "Ops" },
      };

      saveDraft("admin", adminData);
      saveDraft("ops", opsData);

      clearDraft("admin");

      expect(loadDraft("admin")).toBeNull();
      expect(loadDraft("ops")).toEqual(opsData);
    });
  });

  describe("hasDraft", () => {
    it("should return true when draft exists", () => {
      const mockData: FormData = {
        basicInfo: { fullName: "Test" },
        details: {},
      };

      saveDraft("admin", mockData);

      expect(hasDraft("admin")).toBe(true);
    });

    it("should return false when draft does not exist", () => {
      expect(hasDraft("admin")).toBe(false);
    });

    it("should return false after clearing draft", () => {
      const mockData: FormData = {
        basicInfo: { fullName: "Test" },
        details: {},
      };

      saveDraft("admin", mockData);
      clearDraft("admin");

      expect(hasDraft("admin")).toBe(false);
    });
  });
});
