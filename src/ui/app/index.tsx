import React, { useState } from "react";
import { SkyboxScene } from "../skybox";

// this effect is pretty cool
// https://codesandbox.io/s/jflps

export const App = () => {
  const [count, setCount] = useState<number>(0);
  const click = () => {
    setCount(count + 1);
  };
  return (
    <>
      <h3>foo barz</h3>
      <SkyboxScene />
    </>
  );
};

/**
 * The challenge of using React + three.js is that the contents of a canvas is not part of the DOM
 * And any re-rendering of the canvas basically causes all of the contents to be recreated
 *
 * What I'd like to achieve
 * - a reusable component with props that change based on some user input
 * - contains a canvas with some contents
 * - contents change based on the props of the parent component
 * - but somehow the contents are not recreated every time
 */
