import { Students } from 'types/student.type'
import http from 'utils/http'

export const getStudents = (page: string | number, limit: string | number) =>
  http.get<Students>('students', { params: { _page: page, _limit: limit } })
