import React, { Suspense } from 'react'
import RadarGraph from '../../components/graph/Radar'
import BarGraph from '../../components/graph/BMIBar'
import Three from '../../components/Three'
import { index } from '../../constants/data'

export default function allTrack() {
  return (
    <>
      <Suspense fallback={<div style={{width: '100%', height: '398px'}}></div>}>
        <Three />
      </Suspense>
      <RadarGraph d={index} />
      <BarGraph d={index} />
    </>
  )
}
