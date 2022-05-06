import { useState } from 'react';
import { animated, config, useChain, useSpring, useSpringRef, useTransition } from 'react-spring';
import './App.css'

const branches = [
  {side: 'right', path: 'M333.886 250.862C292.195 289.645 235.718 311.056 212.69 316.914V347.213C263.108 327.821 314.495 274.899 333.886 250.862Z'},
  {side: 'left', path: 'M204.813 123C215.963 181.659 232.082 188.648 238.748 184.81L227.84 209.049C212.327 202.747 206.025 149.057 204.813 123Z'},
  {side: 'left', path: 'M163 255.71C185.3 256.679 202.995 283.181 209.055 296.31V329.033C198.874 290.251 174.11 263.991 163 255.71Z'},
]

const leaves = [
  {x: 315.798, y: 151.273, width: 133.495, height: 128.727, fill: '#18B07B'},
  {x: 175.652, y: 68.3384, width: 59.7879, height: 57.404, fill: '#0F9748'},
  {x: 389.697, y: 96.4445, width: 40.5253, height: 39.3333, fill: '#18B07B'},
  {x: 91.7172, y: 221.596, width: 87.0101, height: 83.4343, fill: '#D4DE29'},
  {x: 50, y: 179.879, width: 58.404, height: 58.404, fill: '#0F9648'},
  {x: 82.1818, y: 96.4445, width: 113.232, height: 109.657, fill: '#18B07B'},
  {x: 241.899, y: 115.515, width: 133.495, height: 128.727, fill: '#D4DE29'},
  {x: 259.778, y: 44, width: 60.7879, height: 58.404, fill: '#D4DE29'}, 
  {x: 345.596, y: 258.545, width: 60.7879, height: 58.404, fill: '#119848'},
  {x: 334.869, y: 61.8788, width: 40.5253, height: 39.3333, fill: '#18B07B'},
];

export default function App() {
  const [trunkLength, setTrunkLength] = useState(0);

  // Build a spring and catch the ref
  const growRef = useSpringRef();
  const growAnimation = useSpring({
    ref: growRef,
    from: {
      // Use the popular strokeDashArray / strokeDashOffset
      // combination to animate the stroke being drawn
      strokeDasharray: trunkLength,
      strokeDashoffset: trunkLength,
      fillOpacity: 0,
      strokeWidth: 3,
    },
    to: [
      { strokeDasharray: trunkLength, strokeDashoffset: 0},
      // After drawing the stroke, get rid of it and fill in the shape
      { fillOpacity: 1 },
    ],
  });

  const trunk = <animated.path ref={(ref) => {
    if(ref) {
      setTrunkLength(ref.getTotalLength());
    }
  }} stroke="#CF9C52" style={growAnimation} className=" origin-bottom" d="M225.416 424.901C159.001 253.772 237.738 158.472 285.408 132.213C192.814 221.898 230.264 364.707 260.563 424.901C274.622 446.717 301.164 457.018 312.677 459.442H206.025C223.962 449.747 226.426 432.375 225.416 424.901Z" fill="#CF9C52"/>;

  const branchTransitionRef = useSpringRef();
  
  const branchTransitions = useTransition(branches, {
    ref: branchTransitionRef,
    from: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
    },
    config: config.gentle,
  });

  const branchElements = branchTransitions(({opacity}, item) => (
    <animated.path d={item.path} fill="#CF9C52" className={item.side === 'left' ? 'origin-bottom-right' : 'origin-bottom-left'} style={{
      opacity,
      transformBox: 'fill-box',
      transform: opacity.to((o) => {
        const degrees = item.side === 'left' ? -90 : 90;
        const translateAmount = item.side === 'left' ? 10 : -10;
        const translatePx = translateAmount - (o * translateAmount) + 'px';

        return `rotate(${(degrees) - (o * degrees)}deg) translate(${translatePx}, ${translatePx}) scale(${o})`;
      }),
    }}/>
  ));
  
  const leavesTransitionRef = useSpringRef();
  const leavesTransitions = useTransition(leaves, {
    ref: leavesTransitionRef,
    from: {
      transform: 'scale(0)',
    },
    enter: {
      transform: 'scale(1)',
    },
    config: config.wobbly,
    trail: 100,
  });

  const leavesElements = leavesTransitions((props, {x, y, width, height, fill}) => (
    <animated.rect className='origin-center' x={x} y={y} width={width} height={height} fill={fill} style={{
      transformBox: 'fill-box',
      ...props
    }}></animated.rect>
  ));

  useChain([growRef, branchTransitionRef, leavesTransitionRef]);

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        {trunk}
        {branchElements}
        {leavesElements}
      </svg>
    </div>
  )
}