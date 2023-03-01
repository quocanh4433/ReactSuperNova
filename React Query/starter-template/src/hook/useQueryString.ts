import axios, { AxiosError } from 'axios'
import { useSearchParams } from 'react-router-dom'

export const useQueryString = () => {
  const [searchParams] = useSearchParams()
  const searchParamsObject = Object.fromEntries([...searchParams])
  return searchParamsObject
}

/** Khi hàm này return true thì kiểu trả về là AxiosError */
export const isAxiosError = <T>(error: unknown): error is AxiosError<T> => {
  return axios.isAxiosError(error)
}
