/**
 * Solves the performance problem via fetching state directly
 *
 * https://docs.pmnd.rs/react-three-fiber/advanced/pitfalls#fetch-state-directly
 */
import { Canvas, Vector3, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import styled from "@emotion/styled";
import { Color, DoubleSide, Mesh, MeshBasicMaterial } from "three";
import create from "zustand";
import { CameraControls } from "../common/camera-controls";

interface Props {}

interface BoxProps extends Props {
  position: Vector3;
}

interface State {
  i: number;
  click: () => void;
  getColor: () => string;
}

const colors = ["red", "green", "blue"];

const useStore = create<State>((set, get) => ({
  i: 0,
  click: () => set(({ i }) => ({ i: i + 1 })),
  getColor: () => {
    const { i } = get();
    return colors[i % colors.length];
  },
}));

const Box = ({ position }: BoxProps) => {
  // useEffect(() => {
  //   console.log("box mount", color, position);
  // }, []);
  const ref = useRef<Mesh>();
  const materialRef = useRef<MeshBasicMaterial>();
  useFrame(() => {
    // @ts-ignore
    ref.current.rotation.x += 0.01;
    // @ts-ignore
    ref.current.rotation.y += 0.005;
    (ref.current.material as MeshBasicMaterial).color = new Color(
      useStore.getState().getColor()
    );
  });
  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial ref={materialRef} color="red" side={DoubleSide} />
    </mesh>
  );
};

const Container = styled.div`
  width: 100%;
  height: 400px;
  border: 1px solid black;
`;

const Scene = () => {
  const boxes = Array(10000)
    .fill(0)
    .map((_, i) => (
      <Box key={i} position={[(i % 100) * 1.2, Math.floor(i / 100) * 1.2, 0]} />
    ));
  return (
    <Container>
      <Canvas
        flat
        dpr={window.devicePixelRatio}
        camera={{ far: 10000, position: [50, 50, 10] }}
      >
        <ambientLight />
        {boxes}
        <CameraControls />
      </Canvas>
    </Container>
  );
};

export const ZustandScene = ({}: Props) => {
  const click = useStore((state) => state.click);
  return (
    <>
      <Scene />
      <button onClick={click}>click to change colour</button>
    </>
  );
};
