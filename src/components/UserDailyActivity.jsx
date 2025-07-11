import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts'

const UserDailyActivity = () => {
  const [sessions, setSessions] = useState([])
  const userId = import.meta.env.VITE_USER

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/user-activity.json')
        const json = await res.json()

        const user = json.find((u) => u.userId === parseInt(userId))
        if (user) setSessions(user.sessions)
      } catch (error) {
        console.error('Erreur de chargement:', error)
      }
    }

    fetchData()
  }, [userId])

  return (
    <div style={{ width: '100%', height: 300, backgroundColor: '#FBFBFB', borderRadius: 5, padding: 20 }}>
      <h4 style={{ marginBottom: 20 }}>Activité quotidienne</h4>
      <ResponsiveContainer>
        <BarChart data={sessions}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" tickFormatter={(date) => new Date(date).getDate()} />
          <YAxis yAxisId="left" orientation="right" dataKey="kilogram" axisLine={false} tickLine={false} />
          <YAxis yAxisId="right" dataKey="calories" hide />
          <Tooltip
            contentStyle={{ backgroundColor: '#E60000', color: 'white' }}
            itemStyle={{ color: 'white' }}
            formatter={(value, name) =>
              name === 'kilogram' ? [`${value}kg`, 'Poids'] : [`${value}Kcal`, 'Calories']
            }
          />
          <Legend verticalAlign="top" align="right" iconType="circle" />
          <Bar yAxisId="left" dataKey="kilogram" fill="#282D30" radius={[10, 10, 0, 0]} barSize={7} name="Poids (kg)" />
          <Bar yAxisId="right" dataKey="calories" fill="#E60000" radius={[10, 10, 0, 0]} barSize={7} name="Calories brûlées (kCal)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default UserDailyActivity
