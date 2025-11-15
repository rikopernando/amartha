import { useState, useEffect } from "react";
import { fetchBasicInfo } from "../utils/api";
import {
  generateEmployeeId,
  countEmployeesByDepartment,
} from "../utils/employeeId";
import { type BasicInfo } from "../types";

interface UseEmployeeIdReturn {
  employeeId: string;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to auto-generate Employee ID based on department
 * Fetches existing employees and generates next ID in sequence
 */
export function useEmployeeId(
  departmentName: string | undefined
): UseEmployeeIdReturn {
  const [employeeId, setEmployeeId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!departmentName) {
      setEmployeeId("");
      return;
    }

    const generateId = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all existing employees
        const allEmployees: BasicInfo[] = await fetchBasicInfo();

        // Count employees in the selected department
        const count = countEmployeesByDepartment(allEmployees, departmentName);

        // Generate new employee ID
        const newId = generateEmployeeId(departmentName, count);
        setEmployeeId(newId);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate employee ID"
        );
        setEmployeeId("");
      } finally {
        setIsLoading(false);
      }
    };

    generateId();
  }, [departmentName]);

  return {
    employeeId,
    isLoading,
    error,
  };
}
