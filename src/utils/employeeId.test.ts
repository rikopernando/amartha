import { describe, it, expect } from "vitest";
import {
  generateEmployeeId,
  countEmployeesByDepartment,
  extractDepartmentCode,
  extractSequenceNumber,
} from "./employeeId";
import { type BasicInfo } from "../types";

describe("employeeId utilities", () => {
  describe("generateEmployeeId", () => {
    it("should generate correct ID format", () => {
      expect(generateEmployeeId("Engineering", 0)).toBe("ENG-001");
      expect(generateEmployeeId("Engineering", 2)).toBe("ENG-003");
      expect(generateEmployeeId("Engineering", 99)).toBe("ENG-100");
    });

    it("should handle different department names", () => {
      expect(generateEmployeeId("Lending", 0)).toBe("LEN-001");
      expect(generateEmployeeId("Funding", 5)).toBe("FUN-006");
      expect(generateEmployeeId("Operations", 10)).toBe("OPE-011");
    });

    it("should use uppercase for department code", () => {
      expect(generateEmployeeId("engineering", 0)).toBe("ENG-001");
      expect(generateEmployeeId("lending", 0)).toBe("LEN-001");
    });

    it("should pad short department names", () => {
      expect(generateEmployeeId("IT", 0)).toBe("ITX-001");
      expect(generateEmployeeId("HR", 5)).toBe("HRX-006");
    });

    it("should pad sequence numbers to 3 digits", () => {
      expect(generateEmployeeId("Engineering", 0)).toBe("ENG-001");
      expect(generateEmployeeId("Engineering", 8)).toBe("ENG-009");
      expect(generateEmployeeId("Engineering", 99)).toBe("ENG-100");
    });

    it("should handle large sequence numbers", () => {
      expect(generateEmployeeId("Engineering", 999)).toBe("ENG-1000");
    });
  });

  describe("countEmployeesByDepartment", () => {
    const mockEmployees: BasicInfo[] = [
      {
        fullName: "John Doe",
        email: "john@example.com",
        department: "Engineering",
        role: "Admin",
        employeeId: "ENG-001",
      },
      {
        fullName: "Jane Smith",
        email: "jane@example.com",
        department: "Engineering",
        role: "Engineer",
        employeeId: "ENG-002",
      },
      {
        fullName: "Bob Johnson",
        email: "bob@example.com",
        department: "Lending",
        role: "Ops",
        employeeId: "LEN-001",
      },
    ];

    it("should count employees in a department", () => {
      expect(countEmployeesByDepartment(mockEmployees, "Engineering")).toBe(2);
      expect(countEmployeesByDepartment(mockEmployees, "Lending")).toBe(1);
    });

    it("should return 0 for department with no employees", () => {
      expect(countEmployeesByDepartment(mockEmployees, "Operations")).toBe(0);
    });

    it("should be case-insensitive", () => {
      expect(countEmployeesByDepartment(mockEmployees, "engineering")).toBe(2);
      expect(countEmployeesByDepartment(mockEmployees, "ENGINEERING")).toBe(2);
    });

    it("should return 0 for empty employee list", () => {
      expect(countEmployeesByDepartment([], "Engineering")).toBe(0);
    });
  });

  describe("extractDepartmentCode", () => {
    it("should extract department code from employee ID", () => {
      expect(extractDepartmentCode("ENG-001")).toBe("ENG");
      expect(extractDepartmentCode("LEN-005")).toBe("LEN");
      expect(extractDepartmentCode("OPE-100")).toBe("OPE");
    });

    it("should return empty string for invalid format", () => {
      expect(extractDepartmentCode("INVALID")).toBe("INVALID");
      expect(extractDepartmentCode("")).toBe("");
    });
  });

  describe("extractSequenceNumber", () => {
    it("should extract sequence number from employee ID", () => {
      expect(extractSequenceNumber("ENG-001")).toBe(1);
      expect(extractSequenceNumber("ENG-005")).toBe(5);
      expect(extractSequenceNumber("ENG-100")).toBe(100);
    });

    it("should return 0 for invalid format", () => {
      expect(extractSequenceNumber("INVALID")).toBe(0);
      expect(extractSequenceNumber("")).toBe(0);
      expect(extractSequenceNumber("ENG-")).toBe(0);
    });
  });
});
