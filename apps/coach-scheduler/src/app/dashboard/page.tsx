import { headers } from 'next/headers'

export default async function Dashboard() {
  const url = new URL(headers().get('x-href') ?? '');
  url.pathname = `/api/coaches/${headers().get('x-user-id')}`;
  const res = await fetch(url);
  const user = await res.json();
  console.log('dashboard\t', user);

  return (
    <>
      <header>
        <h1>Hi {user.userType === 'coach' && 'Coach'} {user.username}</h1>
      </header>
      <section>
      </section>
    </>
  );
}
