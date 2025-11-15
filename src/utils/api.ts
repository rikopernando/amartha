const API_BASE_URL_STEP1 = 'http://localhost:4001';
const API_BASE_URL_STEP2 = 'http://localhost:4002';

/**
 * Fetch departments with optional name filter
 */
export async function fetchDepartments(nameFilter?: string) {
  const url = new URL(`${API_BASE_URL_STEP1}/departments`);
  if (nameFilter) {
    url.searchParams.append('name_like', nameFilter);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to fetch departments');
  }

  return response.json();
}

/**
 * Fetch locations with optional name filter
 */
export async function fetchLocations(nameFilter?: string) {
  const url = new URL(`${API_BASE_URL_STEP2}/locations`);
  if (nameFilter) {
    url.searchParams.append('name_like', nameFilter);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to fetch locations');
  }

  return response.json();
}

/**
 * Fetch all basic info records to count employees by department
 */
export async function fetchBasicInfo() {
  const response = await fetch(`${API_BASE_URL_STEP1}/basicInfo`);
  if (!response.ok) {
    throw new Error('Failed to fetch basic info');
  }

  return response.json();
}

/**
 * Post basic info data (Step 1)
 */
export async function postBasicInfo(data: unknown) {
  const response = await fetch(`${API_BASE_URL_STEP1}/basicInfo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to post basic info');
  }

  return response.json();
}

/**
 * Post details data (Step 2)
 */
export async function postDetails(data: unknown) {
  const response = await fetch(`${API_BASE_URL_STEP2}/details`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to post details');
  }

  return response.json();
}

/**
 * Fetch details with pagination
 */
export async function fetchDetails(page: number = 1, limit: number = 10) {
  const url = new URL(`${API_BASE_URL_STEP2}/details`);
  url.searchParams.append('_page', page.toString());
  url.searchParams.append('_limit', limit.toString());

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to fetch details');
  }

  return response.json();
}

/**
 * Simulate delay for async operations (for submission progress)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
