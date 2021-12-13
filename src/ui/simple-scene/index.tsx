/**
 * This example demonstrates the problem
 *
 * We draw 10000 meshes on the canvas
 * Mesh material is based on color prop
 * Whenever the prop changes, every mesh gets recreated? There is a lag
 */
import { Canvas, Vector3, extend, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import styled from "@emotion/styled";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DoubleSide } from "three";
import { CameraControls } from "../common/camera-controls";
// import create from 'zustand'
extend({ OrbitControls });

interface Props {
  color: string;
}

interface BoxProps extends Props {
  position: Vector3;
}

// const useStore = create(() => ({ count: 0 }));

const Box = ({ color, position }: BoxProps) => {
  // useEffect(() => {
  //   console.log("box mount", color, position);
  // }, []);
  const ref = useRef();
  useFrame(() => {
    // @ts-ignore
    ref.current.rotation.x += 0.01;
    // @ts-ignore
    ref.current.rotation.y += 0.005;
  });
  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color={color} side={DoubleSide} />
    </mesh>
  );
};

const Container = styled.div`
  width: 100%;
  height: 400px;
  border: 1px solid black;
`;

export const SimpleScene = ({ color }: Props) => {
  const boxes = Array(10000)
    .fill(0)
    .map((_, i) => (
      <Box
        key={i}
        color={color}
        position={[(i % 100) * 1.2, Math.floor(i / 100) * 1.2, 0]}
      />
    ));
  return (
    <Container>
      <Canvas
        flat
        dpr={window.devicePixelRatio}
        camera={{ far: 10000, position: [50, 50, 10] }}
        // frameloop="demand"
      >
        <ambientLight />
        {/* <pointLight position={[10, 10, 10]} /> */}
        <Box color={color} position={[-1.2, 0, 0]} />
        {boxes}
        {/* <Box color="red" position={[1.5, 0, 0]} /> */}
        <CameraControls />
      </Canvas>
    </Container>
  );
};
