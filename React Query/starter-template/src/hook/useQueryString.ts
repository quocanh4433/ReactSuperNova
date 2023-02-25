import { useSearchParams } from 'react-router-dom'

export const useQueryString = () => {
  const [searchParams] = useSearchParams()
  const searchParamsObject = Object.fromEntries([...searchParams])
  console.log('searchParams', useSearchParams(), searchParamsObject)
  return searchParamsObject
}
