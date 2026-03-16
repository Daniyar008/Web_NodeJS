import { Outlet } from 'react-router-dom'
import { Sidebar } from '../ui/Sidebar'
import { Topbar } from '../ui/Topbar'

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

