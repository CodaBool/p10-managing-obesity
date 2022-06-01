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
        font: {
          size: 20
        },
      },
      // web grid
      // https://www.chartjs.org/docs/latest/axes/styling.html#grid-line-configuration
      grid: {
        color: 'grey'
      },
      suggestedMax: 100,
      suggestedMin: 0,
      // web tick numbers
      // https://www.chartjs.org/docs/latest/axes/#common-tick-options-to-all-axes
      ticks: {
        font: {
          size: 15
        }
      },
      label: {
        font: {
          size: 20
        }
      }
    },
  },
  // onClick: (_1, _2, _3) => null
}

const FILTER_MS = 604800000 // 1 week = 604800000ms

function getScore(a, b) {
  if (!a || !b) return 0
  const greaterValue = Math.max(a, b)
  const dif = Math.abs(a - b)
  const p = dif / greaterValue
  return Math.round((1.0 - p) * 100)
}

export default function Graph({ d }) {
  const [data, setData] = useState()

  useEffect(() => {
    if (d) setData(genData(d))
  }, [d])

  if (d) {
    if (!d.goalCalories && !d.goalExercise && !d.goalWeight) {
      return <p className='text-center text-muted my-5'>Enter your goals on your profile for additional info regarding performance</p>
    }
  }

  function genData(d) {
    if (!d) return []

    // Exercise
    const lastWeekExe = d.exercises.filter(exe => {
      const dif = new Date() - new Date(exe.measuredAt)
      if (dif < FILTER_MS && dif > 0) return true
    })
    let totalExeLen = 0
    lastWeekExe.forEach(exe => totalExeLen += exe.length)

    // Diet
    const lastWeekDiets = d.diets.filter(diet => {
      const dif = new Date() - new Date(diet.measuredAt)
      if (dif < FILTER_MS && dif > 0) return true
    })
    let totalCal = 0
    lastWeekDiets.forEach(diet => totalCal += diet.calories)
    const avgDailyCal = totalCal / lastWeekDiets.length

    // return percent scores for [Exercise, Weight, Diet]
    return [getScore(totalExeLen, d.goalExercise), getScore(d.weights.weight, d.goalWeight), getScore(avgDailyCal, d.goalCalories)]
  }

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
        },
      ],
    }}   
  />
}