import { useRef, useState } from 'react'
import React, { useEffect } from "react";
import { Canvas, RootState, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, useScroll, ScrollControls, SoftShadows } from "@react-three/drei";
import { EffectComposer, TiltShift2 } from "@react-three/postprocessing";
import { GroupProps } from "@react-three/fiber";
import { AnimationAction, AnimationClip, Group } from '../node_modules/@types/three';

interface ModelProps extends GroupProps { }

const Model: React.FC<ModelProps> = (props) => {
  const group = useRef<Group>(null);
  const scroll = useScroll();
  const { nodes, materials, animations } = useGLTF("/jump-transformed.glb") as any;
  // console.log("nodes", nodes)
  // console.log(animations)
  const { ref, actions, names } = useAnimations<AnimationClip>(animations);

  // console.log(names)
  // useEffect(() => {
  //   if (actions.jump) {
  //     return void (actions.jump.play())
  //   }
  // }, [actions]);
  useEffect(() => {
    if (actions && names.length) {
      // console.log("actions", actions[names[0]])
      const action = actions[names[0]] as AnimationAction;
      // console.log("action", action)
      action.play();
    }
  }, [actions, names, group])

  useFrame((state: RootState, delta: number, xrFrame: any) => {
    if (actions.jump) {
      // console.log(state)
      console.log("actions.jump.getClip().duration", actions.jump.getClip().duration, "scroll.offset", scroll.offset)
      return (actions.jump.time = actions.jump.getClip().duration * scroll.offset);
    }
  });

  if (ref == undefined || ref == null) {
    return <></>
  } else {
    return (
      // <group {...props} ref={ref}>
      <group {...props} ref={ref} dispose={null}>
        <primitive object={nodes.mixamorigHips} />
        <skinnedMesh
          castShadow
          receiveShadow
          geometry={nodes.Ch03.geometry}
          material={materials.Ch03_Body}
          skeleton={nodes.Ch03.skeleton}
        />
      </group>
    );
  }


};


function App() {

  return (
    <Canvas shadows gl={{ antialias: false }} camera={{ position: [1, 0.5, 2.5], fov: 50 }}>
      <color attach="background" args={["#f0f0f0"]} />
      <fog attach="fog" args={["#f0f0f0", 0, 20]} />
      <ambientLight intensity={0.5} />
      <directionalLight intensity={2} position={[-5, 5, 5]} castShadow shadow-mapSize={2048} shadow-bias={-0.0001} />
      <ScrollControls damping={0.2} maxSpeed={0.5} pages={2}>
        <Model position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.01} />
      </ScrollControls>
      {/* <mesh rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -1.01, 0]} receiveShadow>
        <planeGeometry args={[10, 10, 1, 1]} />
        <shadowMaterial transparent opacity={0.75} />
      </mesh> */}
      {/* <SoftShadows size={40} samples={16} /> */}
      {/* <EffectComposer enableNormalPass multisampling={4}>
        <TiltShift2 blur={1} />
      </EffectComposer> */}
    </Canvas>
  )
}

export default App
