import React, { Suspense } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import RadarGraph from '../../components/graph/Radar'
import BarGraph from '../../components/graph/BMIBar'
import Three from '../../components/Three'

export default function allTrack() {
  const { data, error, mutate } = useSWR('/api/user', url => axios.get(url))

  return (
    <>
      <Suspense fallback={<div style={{width: '100%', height: '398px'}}></div>}>
        <Three />
      </Suspense>
      <RadarGraph d={data?.data} />
      <BarGraph d={data?.data} />
    </>
  )
}
