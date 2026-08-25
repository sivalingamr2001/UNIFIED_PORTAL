import { useCallback, useRef, useState } from "react"

export const useLoader = () => {
  const [loading, setIsLoading] = useState(false)
  const activeRequests = useRef(0)

  const updateLoading = useCallback((delta: number) => {
    activeRequests.current = Math.max(0, activeRequests.current + delta)
    setIsLoading(activeRequests.current > 0)
  }, [])

  const withLoader = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T> => {
      updateLoading(1)
      try {
        const result = await fn()
        return result
      } finally {
        updateLoading(-1)
      }
    },
    [updateLoading]
  )

  const showLoader = useCallback(() => updateLoading(1), [updateLoading])
  const hideLoader = useCallback(() => updateLoading(-1), [updateLoading])

  return { loading, withLoader, showLoader, hideLoader }
}
