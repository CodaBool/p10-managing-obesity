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
// import Load from '../Load'

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
      labels: {
        filter: (item, chart) => {
          // Logic to remove a particular legend item goes here
          return !item.text.includes('Filter Out');
        }
      }
    },
    title: {
      display: false,
    },
    tooltip: {
      enabled: false
    }
  },
  scales: {
    yAxis: {
      display: false
    }
  }
}

// https://wwwn.cdc.gov/nchs/nhanes/search/datapage.aspx?Component=Demographics&Cycle=2017-2020
const labels = [14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70]
const data = [5,  20, 60, 180,300,500,610,650,560,480,350,310,180,130,110,85, 50, 38, 37, 23, 18, 15,  8,  6,  5,  4,  3,  2, 1]

export default function BMIBar({ d }) {
  const [BMI, setBMI] = useState()

  useEffect(() => {
    if (!d) return
    if (!d.height || !d.weights?.weight) return
    
    // BMI = weight (lb) / [height (in)]2 x 703
    const bmi = d.weights.weight / d.height**2 * 703

    // optional, but gets the top of the bar value for setting the y value
    const closest = labels.reduce((prev, curr) => {
      return (Math.abs(curr - bmi) < Math.abs(prev - bmi) ? curr : prev);
    })

    // graph only allows placing on existing numbers
    // so the bmi must be set to a even number
    let evenBMI = 2 * Math.round(Math.round(bmi) / 2)

    // graph is capped at 70
    if (evenBMI > 70) evenBMI = 70

    setBMI({x: evenBMI, y: data[labels.indexOf(closest)]})
  }, [d])

  if (!d) return null

  if (!BMI) return <p className='text-center text-muted' style={{marginBottom: '300px'}}>Enter Weight and Height for additional info regarding BMI</p>

  return (
    <>
      <Bar options={options} data={{
        labels,
        datasets: [
          {
            label: 'Filter Out',
            data,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            spanGaps: true,
            order: 2
          },
          {
            label: 'Your BMI',
            data: [{x: BMI.x, y: BMI.y}],
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 5,
            type: 'line',
            order: 1
          }
        ],
      }} />
      <p className='text-center text-muted mb-5'>BMI Histogram generated from 8388 examinations taken in the United States from 2017 to March 2020 ages 19+, published by the CDC. A healthy BMI is defined between 18.5 and 24.9. Please keep in mind that BMI is a rough assessment and not suited for all body types. For the best health assessment seek a medical professional</p>
    </>
  )
}
