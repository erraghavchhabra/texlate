import { getFirebaseToken } from "../context/AuthContext";

const API_BASE_URL = process.env.REACT_APP_API_URL;

/**
 * Get the authorization header with a fresh Firebase token.
 * Uses getIdToken() which automatically refreshes expired tokens.
 */
const getAuthHeaders = async () => {
  const token = await getFirebaseToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Create a new organization
 * POST /v1/organizations/create
 */
export const createOrganization = async (name) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/organizations/create`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create organization");
  }

  return await response.json();
};

/**
 * Join an existing organization using an invite code
 * POST /v1/organizations/join
 */
export const joinOrganization = async (inviteCode) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/organizations/join`, {
    method: "POST",
    headers,
    body: JSON.stringify({ invite_code: inviteCode }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to join organization");
  }

  return await response.json();
};

/**
 * Update an organization's name
 * PATCH /v1/organizations/{org_id}
 */
export const updateOrganizationName = async (orgId, newName) => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/organizations/${orgId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ name: newName }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to update organization name");
  }

  return await response.json();
};

/**
 * Fetch the current user's profile from the backend
 * GET /v1/auth/me
 */
export const fetchUserProfile = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch user profile");
  }

  const userData = await response.json();

  // Validate that we have organization and wallet
  if (userData.currentOrgId && !userData.organization) {
    throw new Error("Missing organization data in user profile");
  }

  if (userData.currentOrgId && !userData.wallet) {
    throw new Error("Missing wallet data in user profile");
  }

  return userData;
};
