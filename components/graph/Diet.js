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
import { useEffect, useState } from 'react'
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
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
}

export default function DietGraph({ data }) {
  const [month, setMonth] = useState(4)
  const [year, setYear] = useState(2022)
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
    return new Date(2022, 5, 0).getDate()
  }

  function getMonthlyData() {
    if (!data) return []
    const d = new Date(year, month)

    // create new label
    setLabels([...Array(daysInThisMonth(d)).keys()].map(i => i+1))

    const tempArr = new Array(daysInThisMonth(d)).fill(null)
    const allYears = []
    for (const item of data) {
      const date = new Date(item.measuredAt)
      // check if same year
      if (year === date.getFullYear()) {
        // check if same month
        if (month === date.getMonth()) {
          tempArr[date.getDate() - 1] = item.calories
        }
      }

      if (!allYears.includes(date.getFullYear())) {
        allYears.push(date.getFullYear())
      }
    }
    setYearOptions(allYears)
    return tempArr
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
            label: 'Calories',
            data: monthlyData,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            spanGaps: true
          },
        ],
      }} />
    </>
  )
}
