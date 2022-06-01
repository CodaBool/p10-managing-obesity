import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useRouter } from 'next/router'

function FoodGroup({ hover }) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/food_group.glb')
  useFrame(() => {
    if (hover) {
      group.current.rotation.y += 0.008
    }
  })
  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <group rotation={[0, -1.8, -1]} scale={0.158} position={[-.4,-1.5,0]} ref={group} dispose={null}>
        <mesh castShadow receiveShadow geometry={nodes.Apple_lambert1_0.geometry} material={materials.lambert1} position={[-1.8, 3.29, 7.36]} />
        <mesh castShadow receiveShadow geometry={nodes.Avocado_lambert1_0.geometry} material={materials.lambert1} position={[-1.83, 4.92, -8.79]} />
        <mesh castShadow receiveShadow geometry={nodes.Carrot_lambert1_0.geometry} material={materials.lambert1} position={[-2.57, 13.96, 1.48]} />
      </group>
    </>
  )
}

function Bike({ hover }) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/bike.glb')
  useFrame(() => {
    if (hover) {
      group.current.rotation.z -= 0.008
    }
  })
  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <group ref={group} dispose={null} rotation={[2.2, 3, 2]} scale={2.8} position={[0,-1.4,0]}>
        <mesh castShadow receiveShadow geometry={nodes.Object_2.geometry} material={materials.main_texture} position={[0, 0.51, 0]} />
      </group>
    </>
  )
}

function Scale({ hover }) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/scale.glb')
  useFrame(() => {
    if (hover) {
      group.current.rotation.y += 0.008
    }
  })
  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <group ref={group} dispose={null} scale={12} rotation={[1, 1, 0]} position={[0,-.4,0]}>
        <mesh castShadow receiveShadow geometry={nodes.Weighing_Scale_Weighing_Scale_Mat_0.geometry} material={materials.Weighing_Scale_Mat} />
      </group>
    </>
  )
}

export default function test() {
  const [dietHover, setDietHover] = useState()
  const [exerciseHover, setExerciseHover] = useState()
  const [weightHover, setWeightHover] = useState()
  const router = useRouter()

  return (
    <Row className='mt-5 justify-content-center'>
      <Col className="track-col">
        <div className='canvas-container' onMouseEnter={() => setDietHover(true)} onMouseLeave={() => setDietHover(false)}>
          <p className='display-1'>Diet</p>
          <Canvas className="track-canvas" onClick={() => router.push('/track/diet')}>
            <FoodGroup hover={dietHover} />
          </Canvas>
        </div>
      </Col>
      <Col className="track-col">
        <div className='canvas-container' onMouseEnter={() => setExerciseHover(true)} onMouseLeave={() => setExerciseHover(false)}>
          <p className='display-2 mt-2'>Exercise</p>
          <Canvas className="track-canvas"  onClick={() => router.push('/track/exercise')} >
            <Bike hover={exerciseHover} />
          </Canvas>
        </div>
      </Col>
      <Col className="track-col">
        <div className='canvas-container' onMouseEnter={() => setWeightHover(true)} onMouseLeave={() => setWeightHover(false)}>
          <p className='display-1'>Weight</p>
          <Canvas className="track-canvas" onClick={() => router.push('/track/weight')}>
            <Scale hover={weightHover} />
          </Canvas>
        </div>
      </Col>
    </Row>
  )
}
