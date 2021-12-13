import React from "react";
import { Piano } from "../piano";

// this effect is pretty cool
// https://codesandbox.io/s/jflps

export const App = () => {
  return (
    <>
      <h3>Press QWERTY keys</h3>
      <Piano />
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
