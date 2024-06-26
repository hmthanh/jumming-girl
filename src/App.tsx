import { useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, useScroll, ScrollControls } from "@react-three/drei";
import { BufferGeometry, Object3D, Object3DEventMap, Skeleton } from "three";
// import { GroupProps } from "@react-three/fiber";

interface CustomObj3D extends Object3D<Object3DEventMap> {
  geometry: BufferGeometry
  skeleton: Skeleton
}

const Model = (props: any) => {
  // const group = useRef<Group>(null);
  const scroll = useScroll();
  const { nodes, materials, animations } = useGLTF("/jump-transformed.glb");
  // console.log("nodes", nodes)
  // console.log("animations", animations)
  const { ref, actions, names } = useAnimations(animations);

  // useEffect(() => {
  //   if (group.current == null || group.current == undefined) {
  //     group.current = ref.current
  //   }
  // })

  useEffect(() => {
    if (actions && names.length) {
      if (actions.jump) {
        return void (actions.jump.play());
      }
    }
  }, [actions])

  // state: RootState, delta: number
  useFrame(() => {
    if (actions.jump) {
      // console.log(state)
      return (actions.jump.time = actions.jump.getClip().duration * scroll.offset);
    }
  });

  // console.log("nodes.Ch03.geometry", nodes.Ch03.geometry)
  // console.log("nodes.Ch03.skeleton", nodes.Ch03.skeleton)
  if (ref == undefined || ref == null) {
    return <></>
  } else {
    const nodesObj = nodes.Ch03 as CustomObj3D
    return (
      <group {...props} ref={ref}>
        <primitive object={nodes.mixamorigHips} />
        <skinnedMesh
          castShadow
          receiveShadow
          geometry={nodesObj.geometry}
          material={materials.Ch03_Body}
          skeleton={nodesObj.skeleton}
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
