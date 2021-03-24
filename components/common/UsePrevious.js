import React, { useEffect } from 'react';

// USAGE:
// const Counter = () => {
//   const [count, setCount] = useState(0);
//   // 👇 look here
//   const prevCount = usePrevious(count)

//   return <h1> Now: {count}, before: {prevCount} </h1>;
// }

export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}