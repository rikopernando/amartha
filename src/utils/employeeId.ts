import { type BasicInfo } from "../types";

/**
 * Generate Employee ID based on department name and existing count
 * Format: <3-letter dept>-<3-digit seq>
 * Example: ENG-003
 */
export function generateEmployeeId(
  departmentName: string,
  existingCount: number
): string {
  // Get first 3 letters of department name in uppercase
  const deptCode = departmentName.substring(0, 3).toUpperCase().padEnd(3, "X"); // Pad with X if department name is less than 3 chars

  // Get next sequence number (existing count + 1), padded to 3 digits
  const sequenceNumber = (existingCount + 1).toString().padStart(3, "0");

  return `${deptCode}-${sequenceNumber}`;
}

/**
 * Count existing employees in a specific department
 */
export function countEmployeesByDepartment(
  allEmployees: BasicInfo[],
  departmentName: string
): number {
  return allEmployees.filter(
    (emp) => emp?.department?.toLowerCase() === departmentName?.toLowerCase()
  ).length;
}

/**
 * Extract department code from employee ID
 * Example: "ENG-003" => "ENG"
 */
export function extractDepartmentCode(employeeId: string): string {
  const parts = employeeId.split("-");
  return parts[0] || "";
}

/**
 * Extract sequence number from employee ID
 * Example: "ENG-003" => 3
 */
export function extractSequenceNumber(employeeId: string): number {
  const parts = employeeId.split("-");
  return parseInt(parts[1] || "0", 10);
}
