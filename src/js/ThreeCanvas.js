import React, { useRef, useState } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const Grid = () => {
  const { scene } = useThree();

  // 격자 생성
  const gridHelper = new THREE.GridHelper(100, 100, 0x000000, 0x000000);
  scene.add(gridHelper);

  return null;
};

const ThreeCanvas = () => {
  const [controlsEnabled, setControlsEnabled] = useState(false);
  return (
    <>
      <Canvas style={{ width: "100vw", height: "100vh" }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Grid />
        <OrbitControls />
      </Canvas>
      <button
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 1,
        }}
        onClick={() => setControlsEnabled(true)}
      >
        Enable Controls
      </button>
    </>
  );
};

export default ThreeCanvas;
