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
        font: {
          size: 20
        },
        filter: (item, chart) => {
          // Remove a particular legend item goes here
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
    x: {
      grid: {
        color: 'rgba(255, 255, 255, .1)'
      },
    },
    yAxis: {
      display: false
    }
  }
}

// https://wwwn.cdc.gov/nchs/nhanes/search/datapage.aspx?Component=Demographics&Cycle=2017-2020
const labels = [14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70]
const data = [5,  20, 60, 180,300,500,610,650,560,480,350,310,180,130,110,85, 50, 38, 37, 23, 18, 15,  8,  6,  5,  4,  3,  2, 1]

export default function TestGraph() {
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
            data: [{x: 32, y: 480}],
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 10,
            type: 'line',
            order: 1
          }
        ],
      }} />
    </>
  )
}
