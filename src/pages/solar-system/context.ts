import { createContext } from 'react';
import { SCALE, TIME_SCALE } from './constant';

export interface Control {
    focus: string,
    speed: number,
    sizeScale: number,
    distanceScale: number,
    speedScale: number,
    showOrbitLine: boolean,
    setControl: (values: object) => void
}

export const ControlContext = createContext<Control>({
    focus: "",
    speed: 1,
    sizeScale: SCALE,
    distanceScale: SCALE,
    speedScale: TIME_SCALE,
    showOrbitLine: true,
    setControl: () => null
})