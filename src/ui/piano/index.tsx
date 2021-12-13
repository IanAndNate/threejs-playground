/**
 * Putting stuff together, I want to
 * - draw some boxes representing the piano keys
 * - when a key is pressed, show a bloom effect on the key so it "glows"
 */
import { Canvas, useFrame, Vector3 } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { CameraControls } from "../common/camera-controls";
import { Mesh } from "three";
import { BloomLayeredRenderer } from "../custom-renderer/bloom-layered-renderer";
import create from "zustand";

const Container = styled.div`
  width: 100%;
  height: 500px;
  border: 1px solid black;
`;

interface State {
  keysDown: Set<string>;
  keyDown: (e: KeyboardEvent) => void;
  keyUp: (e: KeyboardEvent) => void;
}

const useStore = create<State>((set, get) => ({
  keysDown: new Set<string>(),
  keyDown: (e: KeyboardEvent) => {
    const { keysDown } = get();
    keysDown.add(e.key);
    set({ keysDown });
  },
  keyUp: (e: KeyboardEvent) => {
    const { keysDown } = get();
    keysDown.delete(e.key);
    set({ keysDown });
  },
}));

const KeyboardControls = () => {
  const { keyDown, keyUp } = useStore(({ keyDown, keyUp }) => ({ keyDown, keyUp }));
  useEffect(() => {
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
    }
  }, [keyDown, keyUp]);
  return null;
}

const Key = ({ position, color, keyCode }: { position: Vector3; color: string; keyCode: string }) => {
  const meshRef = useRef<Mesh>();
  useFrame(() => {
    if (meshRef.current) {
      const { keysDown } = useStore.getState();
      if (keysDown.has(keyCode)) {
        meshRef.current.layers.enable(1);
      } else {
        meshRef.current.layers.disable(1);
      }
    }
  });
  return (
    <mesh position={position} ref={meshRef}>
      <boxGeometry args={[1, 5, 0.3]} attach="geometry" />
      <meshPhongMaterial color={color} />
    </mesh>
  );
};

export const Piano = () => {
  const KEYS = "qwertyuiop".split('');
  const keys = KEYS.map((keyCode, idx) => {
    const xPos = 1.3 * idx - (KEYS.length * 1.3 / 2);
    return <Key position={[xPos, 0, 0]} color="white" keyCode={keyCode} key={idx} />;
  });
  return (
    <Container>
      <Canvas
        flat
        dpr={window.devicePixelRatio}
        camera={{ far: 10000, position: [0, -5, 2] }}
      >
        <color attach="background" args={["black"]} />
        <CameraControls lookAt={[0, 0, 0]} />
        {keys}
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, -2, 4]} intensity={0.5} />
        <BloomLayeredRenderer bloomLayer={1}/>
      </Canvas>
      <KeyboardControls/>
    </Container>
  );
};
