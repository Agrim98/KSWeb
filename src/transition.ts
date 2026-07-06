import { createContext, useContext } from 'react'

/** Navigate with the curtain page transition. Provided by App. */
export const TransitionContext = createContext<(to: string) => void>(() => {})

export function useTransitionNav() {
  return useContext(TransitionContext)
}
