import { getPool, CHARSETS } from "./password.js";

export const SET_NAMES = ["upper", "lower", "numbers", "symbols"];

// Draft settings do not contain or change the current password.
export function validateSettings(rawLength, options, requireEach = false) {
  const length = Number(rawLength);
  if (!Number.isInteger(length) || length < 8 || length > 128)
    return { error: "invalid" };
  const selected = Object.fromEntries(
    SET_NAMES.map((name) => [name, Boolean(options[name])]),
  );
  const pool = getPool(selected);
  if (!pool) return { error: "empty" };
  const requiredSets = requireEach
    ? SET_NAMES.filter((name) => selected[name]).map((name) => CHARSETS[name])
    : [];
  return {
    length,
    pool,
    requiredSets,
    signature: `${length}:${pool}:${requireEach}`,
  };
}
