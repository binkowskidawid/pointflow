import { Visit } from '@pointflow/types'

export const dynamic = 'force-dynamic'

export default async function Home() {
  // TODO: replace with auth context in Stage 2
  const visits = await fetch(
    'http://localhost:3001/visits?tenantId=f54f08d9-6a93-4b3f-b75a-4344153f3623',
  )

  if (!visits.ok) {
    return <div>Error fetching visits</div>
  }
  const visitsJson = (await visits.json()) as Visit[]

  if (!visitsJson.length) {
    return <div>No visits</div>
  }

  return (
    <div>
      <h1>PointFlow</h1>
      <ul>
        {visitsJson.map((visit) => (
          <li key={visit.id}>{visit.amountSpent}</li>
        ))}
      </ul>
    </div>
  )
}
