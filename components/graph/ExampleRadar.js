import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

const options = {
  plugins: {
    legend: {
      display: false
    },
  },
  scales: {
    r: {
      // corner labels
      // https://www.chartjs.org/docs/latest/axes/radial/linear.html#point-label-options
      pointLabels: {
        color: '#949494',
        font: {
          size: 30
        },
      },
      // web grid
      // https://www.chartjs.org/docs/latest/axes/styling.html#grid-line-configuration
      grid: {
        color: 'grey'
      },
      max: 5,
      min: 0,
      // web tick numbers
      // https://www.chartjs.org/docs/latest/axes/#common-tick-options-to-all-axes
      ticks: {
        maxTicksLimit: 6,
        display: false,
        backdropColor: 'rgba(255, 255, 255, .1)',
        color: 'rgba(255, 255, 255, .7)',
        font: {
          size: 18
        }
      },
    },
  },
}

export default function ExampleRadar() {
  const [data, setData] = useState([3, 4, 4])

  useEffect(() => {
    let interval = setInterval(() => {
      // generate random data out of 1-5
      const newData = [Math.floor(Math.random() * 5 + 1), Math.floor(Math.random() * 5 + 1), Math.floor(Math.random() * 5 + 1)]
      setData(newData)
    }, 3000)
    return () => {
      clearInterval(interval)
      interval = null
    }
  }, [])

  return <Radar options={options} style={{maxHeight: '800px'}}
    data={{
      labels: ['Exercise', 'Weight', 'Diet'],
      datasets: [
        {
          label: 'Performance',
          data,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 4,
          tension: 0.1,
        },
      ],
    }}   
  />
}