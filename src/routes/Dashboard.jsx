import { useEffect, useState } from "react"
import './Dashboard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { getDayInfo } from './utils';

export default function Dashboard() {
  const [dayInfo, setDayInfo] = useState(getDayInfo())

  useEffect(() => {

  }, [dayInfo])

  const handleNextDay = () => {
    setDayInfo((prevDayInfo) => {
      const nextDayId = prevDayInfo.id % 7 + 1
      const prevDayName = getDayInfoById(nextDayId).name
      return { id: nextDayId, name: prevDayName}
    })
  }

  const handlePrevDay = () => {
    setDayInfo((prevDayInfo) => {
      const prevDayId = (prevDayInfo.id + 5) % 7 + 1
      const prevDayName = getDayInfoById(prevDayId).name
      return { id: prevDayId, name: prevDayName}
    })
  }

  const getDayInfoById = (id) => {
    const daysOfWeek = [
      { id: 1, name: 'Lunes' },
      { id: 2, name: 'Martes' },
      { id: 3, name: 'Miércoles' },
      { id: 4, name: 'Jueves' },
      { id: 5, name: 'Viernes' },
      { id: 6, name: 'Sábado' },
      { id: 7, name: 'Domingo' }
    ];
    return daysOfWeek.find(day => day.id === id);
  }

  return (
    <div className="dashboardPage">
      <header className="header">
        <span className="icon-button" onClick={handlePrevDay} >
          <FontAwesomeIcon icon={faChevronLeft} className="fa-2x"/>
        </span>
        <h1>{dayInfo.name}</h1>
        <span className="icon-button" onClick={handleNextDay}>
          <FontAwesomeIcon icon={faChevronRight} className="fa-2x"/>
        </span>
      </header>
      <main className="content">
      </main>
    </div>
  )
}