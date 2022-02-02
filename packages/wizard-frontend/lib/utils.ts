export function truncateHash(hash: string, length = 38): string {
  return hash.replace(hash.substring(6, length), '...')
}
