/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import Svg, { G, Mask, Path } from 'react-native-svg';

export const GoBackIcon = props => (
  <Svg
    width={18}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M17 7a1 1 0 1 1 0 2V7ZM.293 8.707a1 1 0 0 1 0-1.414L6.657.929A1 1 0 0 1 8.07 2.343L2.414 8l5.657 5.657a1 1 0 1 1-1.414 1.414L.293 8.707ZM17 9H1V7h16v2Z"
      fill="#023373"
    />
  </Svg>
);
export const CrossIcon = props => (
  <Svg
    width={25}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Mask
      id="a"
      style={{
        maskType: 'alpha',
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={25}
      height={24}
    >
      <Path fill="#D9D9D9" d="M.105 0h23.936v24H.105z" />
    </Mask>
    <G mask="url(#a)">
      <Path
        d="M6.489 18.65 5.44 17.6l5.586-5.6L5.44 6.4 6.49 5.35l5.585 5.6 5.585-5.6 1.047 1.05-5.585 5.6 5.585 5.6-1.047 1.05-5.585-5.6-5.585 5.6Z"
        fill="#999"
      />
    </G>
  </Svg>
);

export const CartIcon = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      fill="#000"
      fillRule="evenodd"
      d="M2 2a1 1 0 0 0 0 2h.472a1 1 0 0 1 .965.737l.416 1.526L6 14.133V16c0 .694.235 1.332.63 1.84A2.5 2.5 0 1 0 10.95 19h3.1a2.5 2.5 0 1 0 4.771-.43A1 1 0 0 0 18 17H9.001a1 1 0 0 1-1-1v-1h10.236a2 2 0 0 0 1.93-1.474l1.635-6A2 2 0 0 0 19.87 5H5.582l-.215-.79A3 3 0 0 0 2.472 2H2Zm14.5 17a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1Zm1.736-6H7.764L6.127 7h13.744l-1.635 6ZM8.5 19a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1Z"
      clipRule="evenodd"
    />
  </Svg>
);

export const SearchIcon = props => (
  <Svg
    width={25}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Mask
      id="a"
      style={{
        maskType: 'alpha',
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={25}
      height={24}
    >
      <Path fill="#D9D9D9" d="M.5 0h24v24H.5z" />
    </Mask>
    <G mask="url(#a)">
      <Path
        d="m20.05 20.575-6.3-6.275c-.5.417-1.075.742-1.725.975-.65.233-1.316.35-2 .35-1.716 0-3.166-.592-4.35-1.775C4.492 12.667 3.9 11.217 3.9 9.5c0-1.7.592-3.146 1.775-4.338 1.184-1.191 2.634-1.787 4.35-1.787 1.7 0 3.142.592 4.325 1.775 1.184 1.183 1.775 2.633 1.775 4.35 0 .717-.116 1.4-.35 2.05a5.612 5.612 0 0 1-.95 1.7l6.275 6.275-1.05 1.05Zm-10.025-6.45c1.284 0 2.371-.45 3.263-1.35.892-.9 1.337-1.992 1.337-3.275s-.445-2.375-1.337-3.275c-.892-.9-1.98-1.35-3.263-1.35-1.3 0-2.395.45-3.287 1.35C5.846 7.125 5.4 8.217 5.4 9.5s.446 2.375 1.338 3.275c.892.9 1.987 1.35 3.287 1.35Z"
        fill="#999"
      />
    </G>
  </Svg>
);

export const SearchIconBlack = props => (
  <Svg
    width={25}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Mask
      id="a"
      style={{
        maskType: 'alpha',
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={25}
      height={24}
    >
      <Path fill="#D9D9D9" d="M.5 0h24v24H.5z" />
    </Mask>
    <G mask="url(#a)">
      <Path
        d="m20.05 20.575-6.3-6.275c-.5.417-1.075.742-1.725.975-.65.233-1.316.35-2 .35-1.716 0-3.166-.592-4.35-1.775C4.492 12.667 3.9 11.217 3.9 9.5c0-1.7.592-3.146 1.775-4.338 1.184-1.191 2.634-1.787 4.35-1.787 1.7 0 3.142.592 4.325 1.775 1.184 1.183 1.775 2.633 1.775 4.35 0 .717-.116 1.4-.35 2.05a5.612 5.612 0 0 1-.95 1.7l6.275 6.275-1.05 1.05Zm-10.025-6.45c1.284 0 2.371-.45 3.263-1.35.892-.9 1.337-1.992 1.337-3.275s-.445-2.375-1.337-3.275c-.892-.9-1.98-1.35-3.263-1.35-1.3 0-2.395.45-3.287 1.35C5.846 7.125 5.4 8.217 5.4 9.5s.446 2.375 1.338 3.275c.892.9 1.987 1.35 3.287 1.35Z"
        fill="#000"
      />
    </G>
  </Svg>
);

export const RemoveIcon = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    viewBox="0 0 24 24"
    {...props}
  >
    <Path fill="none" d="M0 0h24v24H0z" />
    <Path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm-8 5v6h2v-6H9zm4 0v6h2v-6h-2zM9 4v2h6V4H9z" />
  </Svg>
);

export const HomeIcon = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 48 48"
  >
    <Path d="M23.951 4a1.5 1.5 0 0 0-.879.322L8.86 15.52A7.504 7.504 0 0 0 6 21.41V40.5C6 41.864 7.136 43 8.5 43h10c1.364 0 2.5-1.136 2.5-2.5v-10c0-.295.205-.5.5-.5h5c.295 0 .5.205.5.5v10c0 1.364 1.136 2.5 2.5 2.5h10c1.364 0 2.5-1.136 2.5-2.5V21.41a7.504 7.504 0 0 0-2.86-5.89L24.929 4.322A1.5 1.5 0 0 0 23.95 4zM24 7.41l13.285 10.467A4.494 4.494 0 0 1 39 21.41V40h-9v-9.5c0-1.915-1.585-3.5-3.5-3.5h-5c-1.915 0-3.5 1.585-3.5 3.5V40H9V21.41c0-1.38.63-2.679 1.715-3.533L24 7.41z" />
  </Svg>
);
