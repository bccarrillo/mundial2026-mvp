'use client'

import { useEffect, useState } from 'react'

export default function StatsCounter() {
  const [stats, setStats] = useState({ users: 0, memories: 0 })

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
  }, [])

  return (
    <div className="flex gap-8 justify-center text-sm text-muted-foreground mb-4">
      <div>
        <span className="font-bold text-2xl text-foreground">{stats.users}</span>
        <p>usuarios registrados</p>
      </div>
      <div>
        <span className="font-bold text-2xl text-foreground">{stats.memories}</span>
        <p>recuerdos creados</p>
      </div>
    </div>
  )
}
