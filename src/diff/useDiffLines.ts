import { diffLines } from 'diff'

export function useDiffLines(prev: string, next: string) {
  const diff = diffLines(prev, next)
  return diff
}
