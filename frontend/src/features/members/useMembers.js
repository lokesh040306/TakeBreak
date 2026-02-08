// frontend/src/features/members/useMembers.js

import { DUMMY_MEMBERS } from "./members.constants";

/**
 * useMembers
 * - Static placeholder members hook
 * - NOT the real-time source of truth
 *
 * Real members come from ChatRoom socket state.
 */
export function useMembers() {
  const members = DUMMY_MEMBERS;
  const count = members.length;

  return { members, count };
}
