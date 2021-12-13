/**
 * How do we only "bloom" selective elements?
 *
 * Examples seem very complicated
 * https://threejs.org/examples/?q=bloom#webgl_postprocessing_unreal_bloom_selective
 * It requires rendering the scene twice in 2 layers, once without bloom and once with
 *
 * Can't figure out why the bloom disappears at certain angles -- has something to do with rendering the original mesh
 * plus the bloom and getting covered
 */
import { Canvas, extend, Vector2, Vector3 } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { CameraControls } from "../common/camera-controls";
import { SelectiveBloom, EffectComposer } from "@react-three/postprocessing";
import { DoubleSide, Mesh } from "three";

const Container = styled.div`
  width: 100%;
  height: 400px;
  border: 1px solid black;
`;

const Rectangle = ({
  geom,
  position,
  color,
  meshRef,
}: {
  geom: Vector2;
  position: Vector3;
  color: string;
  meshRef?: React.Ref<Mesh>;
}) => {
  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[geom[0], geom[1]]} attach="geometry" />
      <meshBasicMaterial color={color} attach="material" side={DoubleSide} />
    </mesh>
  );
};

export const SelectiveBloomScene = () => {
  const redRef = useRef();
  const yellowRef = useRef();
  const greenRef = useRef();
  const [count, setCount] = useState(0);
  const [bloomRef, setBloomRef] = useState(redRef);
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((count + 1) % 3);
      if (count === 0) {
        setBloomRef(redRef);
      } else if (count === 1) {
        setBloomRef(yellowRef);
      } else {
        setBloomRef(greenRef);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [redRef, greenRef, yellowRef, count]);
  return (
    <Container>
      <Canvas
        flat
        dpr={window.devicePixelRatio}
        camera={{ far: 10000, position: [0, 0, 10] }}
      >
        <color attach="background" args={["black"]} />
        <CameraControls lookAt={[0, 0, 0]} />
        <Rectangle
          meshRef={greenRef}
          geom={[1, 1]}
          position={[-1.1, 0, 0]}
          color="#00ff00"
        />
        <Rectangle
          meshRef={yellowRef}
          geom={[1, 1]}
          position={[0, 0, 0]}
          color="#ffff00"
        />
        <Rectangle
          meshRef={redRef}
          geom={[1, 1]}
          position={[1.1, 0, 0]}
          color="#ff0000"
        />
        <EffectComposer multisampling={8}>
          <SelectiveBloom
            kernelSize={5}
            luminanceThreshold={0}
            luminanceSmoothing={0.4}
            intensity={2.0}
            // selectionLayer={10}
            selection={bloomRef}
          />
        </EffectComposer>
      </Canvas>
    </Container>
  );
};
