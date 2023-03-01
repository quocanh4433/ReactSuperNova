import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteStudent, getStudent, getStudents } from 'api/student.api'
import { useQueryString } from 'hook/useQueryString'
import { abort } from 'process'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const LIMIT = 10

export default function Students() {
  /************************ DON'T USE REACT QUERY ************************/
  // const [students, setStudents] = useState<StudentsType>([])
  // const [isLoading, setIsLoading] = useState<boolean>(false)
  // useEffect(() => {
  //   setIsLoading(true)
  //   getStudents(1, 10)
  //     .then((res) => {
  //       setStudents(res.data)
  //     })
  //     .finally(() => setIsLoading(false))
  // }, [])

  /************************ CODE USE REACT QUERY ************************/
  const queryString: { page?: string } = useQueryString()
  const page = Number(queryString.page) || 1
  const queryClient = useQueryClient()

  const studentsQuery = useQuery({
    queryKey: ['students', page],
    queryFn: ({ signal }) => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 5000)

      return getStudents(page, LIMIT, controller.signal)
    },
    // staleTime: 60 * 1000,
    // cacheTime: 5000,
    keepPreviousData: true,
    retry: 0
  })

  const totalStudentCount = Number(studentsQuery?.data?.headers['x-total-count']) || 0
  const totalPage = Math.ceil(totalStudentCount / LIMIT)

  const deleteStudentMutation = useMutation({
    mutationFn: (id: string | number) => deleteStudent(id),
    onSuccess: (_, id) => {
      toast.success(`Xóa thành công với ${id} `)
      queryClient.invalidateQueries({ queryKey: ['students', page], exact: true })
    }
  })

  const handleDeleteStudent = (id: string | number) => {
    deleteStudentMutation.mutate(id)
  }

  const handlePrefetching = (id: number) => {
    queryClient.prefetchQuery(['student', String(id)], {
      queryFn: () => getStudent(id),
      staleTime: 1000 * 10
    })
  }

  const prefetchStudent = () => {
    studentsQuery.refetch()
  }

  const canclePrefetchStudent = () => {
    queryClient.cancelQueries({ queryKey: ['students', page] })
  }

  return (
    <div>
      <h1 className='text-lg'>Students</h1>

      <Link
        to='/students/add'
        type='button'
        className='mb-2 mt-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
      >
        Add student
      </Link>

      <div
        className='mb-2 mt-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        onClick={() => prefetchStudent()}
      >
        Prefetch
      </div>

      <div
        className='mb-2 mt-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        onClick={() => canclePrefetchStudent()}
      >
        Cancel prefetch
      </div>
      {studentsQuery.isLoading && (
        <div role='status' className='mt-6 animate-pulse'>
          <div className='mb-4 h-4  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <span className='sr-only'>Loading...</span>
        </div>
      )}

      {!studentsQuery.isLoading && (
        <Fragment>
          <div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
              <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='py-3 px-6'>
                    #
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Avatar
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Name
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Email
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    <span className='sr-only'>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentsQuery?.data?.data?.map((student, index) => (
                  <tr
                    onMouseDown={() => handlePrefetching(student.id)}
                    className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
                  >
                    <td className='py-4 px-6'>{index + 1}</td>
                    <td className='py-4 px-6'>
                      <img src={student.avatar} alt='student' className='h-5 w-5' />
                    </td>
                    <th scope='row' className='whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white'>
                      {student.last_name}
                    </th>
                    <td className='py-4 px-6'>{student.email}</td>
                    <td className='py-4 px-6 text-right'>
                      <Link
                        to={`/students/${student.id}`}
                        className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'
                      >
                        Edit
                      </Link>
                      <button
                        className='font-medium text-red-600 dark:text-red-500'
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='mt-6 flex justify-center'>
            <nav aria-label='Page navigation example'>
              <ul className='inline-flex -space-x-px'>
                <li>
                  <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                    Previous
                  </span>
                </li>
                {Array(totalPage)
                  .fill(0)
                  .map((_, index) => {
                    const pageNumber = index + 1
                    return (
                      <li>
                        <Link
                          className='border border-gray-300 bg-white py-2 px-3 leading-tight  text-gray-500   hover:bg-gray-100 hover:text-gray-700 '
                          to={`/students?page=${pageNumber}`}
                        >
                          {pageNumber}
                        </Link>
                      </li>
                    )
                  })}
                <li>
                  <a
                    className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    href='/students?page=1'
                  >
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </Fragment>
      )}
    </div>
  )
}
