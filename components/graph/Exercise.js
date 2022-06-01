import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import {useEffect, useState} from 'react'
import Form from 'react-bootstrap/Form'
import Load from '../Load'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export const options = {
  plugins: {
    title: {
      display: false
    },
  },
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
}

export default function ExerciseGraph({ data }) {
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [labels, setLabels] = useState([...Array(daysInThisMonth(new Date())).keys()].map(i => i+1))
  const [yearOptions, setYearOptions] = useState([])
  const [monthlyData, setMontlyData] = useState()

  useEffect(() => {
    if (month && data && year) {
      setMontlyData(getMonthlyData())
    }
  }, [data, month, year])

  if (!data || !monthlyData || !labels) return <Load />

  function changeYear(e) {
    if (year !== Number(e.target.value)) {
      setYear(Number(e.target.value))
    }
  }

  function daysInThisMonth(d) {
    return new Date(d.getFullYear(), d.getMonth()+1, 0).getDate()
  }

  function getMonthlyData() {
    if (!data) return []
    const d = new Date(year, month)

    // create new label
    setLabels([...Array(daysInThisMonth(d)).keys()].map(i => i+1))

    const lowArr = new Array(daysInThisMonth(d)).fill(null)
    const medArr = [...lowArr]
    const highArr = [...lowArr]

    const allYears = []
    for (const item of data) {
      const date = new Date(item.measuredAt)
      // check if same year
      if (year === date.getFullYear()) {
        // check if same month
        if (month === date.getMonth()) {
          if (item.intensity === 'low') lowArr[date.getDate() - 1] = item.length
          if (item.intensity === 'medium') medArr[date.getDate() - 1] = item.length
          if (item.intensity === 'high') highArr[date.getDate() - 1] = item.length
        }
      }

      if (!allYears.includes(date.getFullYear())) {
        allYears.push(date.getFullYear())
      }
    }
    setYearOptions(allYears)
    return [lowArr, medArr, highArr]
  }

  return (
    <>
      <Form.Select className="d-inline me-2" value={month} style={{maxWidth: '150px'}} onChange={e => setMonth(Number(e.target.value))}>
        <option value="0">January</option>
        <option value="1">February</option>
        <option value="2">March</option>
        <option value="3">April</option>
        <option value="4">May</option>
        <option value="5">June</option>
        <option value="6">July</option>
        <option value="7">August</option>
        <option value="8">September</option>
        <option value="9">October</option>
        <option value="10">November</option>
        <option value="11">December</option>
      </Form.Select>
      <Form.Select className="d-inline" style={{maxWidth: '120px'}} onChange={changeYear}>
        {yearOptions.length > 0 && yearOptions.map(year => (
          <option value={year} key={year}>{year}</option>
        ))}
      </Form.Select>
      <Bar options={options} data={{
        labels,
        datasets: [
          {
            label: 'Low Intensity',
            data: monthlyData[0],
            backgroundColor: '#DBFF78',
            stack: 'Stack 0',
          },
          {
            label: 'Medium Intensity',
            data: monthlyData[1],
            backgroundColor: '#FFF700',
            stack: 'Stack 0',
          },
          {
            label: 'High Intensity',
            data: monthlyData[2],
            backgroundColor: '#FFDA6B',
            stack: 'Stack 0',
          },
        ],
      }} />
    </>
  )
}
