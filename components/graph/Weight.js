import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
// import { faker } from '@faker-js/faker'
import Form from 'react-bootstrap/Form'
import { useEffect, useState} from 'react'
import Load from '../Load'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    }
  }
}

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function WeightGraph({ data }) {
  const [year, setYear] = useState(new Date().getFullYear())
  const [yearOptions, setYearOptions] = useState([])
  const [monthlyData, setMontlyData] = useState()
  
  function changeYear(e) {
    if (year !== e.target.value) {
      setYear(Number(e.target.value))
    }
  }

  useEffect(() => {
    if (year && data) {
      setMontlyData(getMonthlyData())
    }
  }, [data, year])

  if (!data || !monthlyData) return <Load />

  function getMonthlyData() {
    if (!data) return []
    const allYears = []
    const tempMonthlyData = []
    const obj = {...[...Array(12).keys()]}
    const selectedYear = year || new Date().getFullYear()
    Object.keys(obj).map(i => obj[i] = [])

    // add data for each month
    for (const item of data) {
      const date = new Date(item.measuredAt)

      // only display data for the selected year
      if (date.getFullYear() === selectedYear) {
        obj[date.getMonth()].push(item.weight)
      }

      // store an array of all years found in the data to create a drop down select
      if (!allYears.includes(date.getFullYear())) {
        allYears.push(date.getFullYear())
      }
    }
    setYearOptions(allYears)

    for (const month in obj) {
      if (obj[month].length > 0) {
        const average = obj[month].reduce((a, b) => a + b) / obj[month].length
        obj[month] = average
      }
    }
    [...Array(12).keys()].forEach(month => {
      if (typeof obj[month] === 'number') {
        tempMonthlyData.push(obj[month])
      } else {
        tempMonthlyData.push(null)
      }
    })
    return tempMonthlyData
  }

  return (
    <>
      <Form.Select className="d-inline" style={{maxWidth: '100px'}} onChange={changeYear}>
        {yearOptions.length > 0 && yearOptions.map(year => (
          <option value={year} key={year}>{year}</option>
        ))}
      </Form.Select>
      <Line options={options} data={{
        labels,
        datasets: [
          {
            label: 'Weight',
            data: monthlyData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.4,
            spanGaps: true,
          }
        ]
      }} />
    </>
  )
}
