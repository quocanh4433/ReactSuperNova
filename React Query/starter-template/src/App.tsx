import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import Loading from 'components/Loading/Loading'
import MainLayout from 'layouts/MainLayout'
import About from 'pages/About'
import AddStudent from 'pages/AddStudent'
import Dashboard from 'pages/Dashboard'
import NotFound from 'pages/NotFound'
import Students from 'pages/Students'
import { useFetcher, useRoutes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const elements = useRoutes([
    {
      path: '/',
      element: <Dashboard />
    },
    {
      path: '/students',
      element: <Students />
    },
    {
      path: '/students/:id',
      element: <AddStudent />
    },
    {
      path: '/students/add',
      element: <AddStudent />
    },
    {
      path: '/about',
      element: <About />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ])

  const isFetching = useIsFetching()
  const isMutating = useIsMutating()

  return (
    <div className='App'>
      {isFetching + isMutating !== 0 && <Loading />}
      <ToastContainer></ToastContainer>
      <MainLayout>{elements}</MainLayout>
    </div>
  )
}

export default App
