import { useEffect } from 'react'
import { AppRouter } from './router'
import { useAppDispatch } from './redux/hooks'
import { fetchCurrentUser } from './redux/slices/authSlice'

export default function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(fetchCurrentUser())
    }
  }, [dispatch])

  return <AppRouter />
}
