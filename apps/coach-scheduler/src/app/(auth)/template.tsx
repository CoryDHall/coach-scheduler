
export default async function AuthTemplate({ children } : { children: React.ReactNode; }) {
  return (
    <form action="/auth" method="POST">
      {children}
    </form>
  )
}
