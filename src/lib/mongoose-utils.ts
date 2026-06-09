/** Convert Mongoose lean docs to plain JSON-safe values for Client Components */
export function serializeForClient<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Extract MongoDB ObjectId string from populated doc or raw id */
export function getRefId(ref: unknown): string {
  if (!ref) return "";
  if (typeof ref === "string") return ref;
  if (typeof ref === "object" && ref !== null && "_id" in ref) {
    return String((ref as { _id: unknown })._id);
  }
  return String(ref);
}

/** Populated category shape from lean() queries */
export function getPopulatedName(ref: unknown): string | undefined {
  if (typeof ref === "object" && ref !== null && "name" in ref) {
    return String((ref as { name: unknown }).name);
  }
  return undefined;
}
