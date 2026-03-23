import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-primary-900 mb-4">EduFuture</h1>
              <p className="text-xl text-primary-700 mb-8">Educational Platform with Gamification</p>
              <p className="text-gray-600">Frontend initialization successful</p>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App
