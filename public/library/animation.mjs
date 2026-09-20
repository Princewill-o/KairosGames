export function animationFrame(time,moving,reduced){return moving&&!reduced?Math.floor(time/.13)%4:0;}
export function motionOffset(time,moving,reduced){return reduced?0:Math.sin(time*(moving?12:2.5))*(moving?2.5:1);}
