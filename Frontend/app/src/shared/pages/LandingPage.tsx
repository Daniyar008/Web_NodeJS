export function LandingPage() {
  console.log('LandingPage is rendering!')
  return (
    <div style={{ padding: '2rem', fontSize: '1.5rem', color: 'green' }}>
      <h1>EduFuture Landing Page</h1>
      <p>This is the main page.</p>
      <a href="/test" style={{ color: 'blue', textDecoration: 'underline' }}>Go to Test Page</a>
    </div>
  )
}
