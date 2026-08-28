import { createContext } from 'react';
import { SCALE, TIME_SCALE } from './constant';

export interface Control {
    focus: string,
    focusIndex: number,
    showSetting: boolean,
    sizeScale: number,
    distanceScale: number,
    speedScale: number,
    showOrbitLine: boolean,
    ignoreAxis: boolean,
    pauseOrbitWhenFocus: boolean,
    setControl: (values: object) => void
}

export const ControlContext = createContext<Control>({
    focus: "",
    focusIndex: 0,
    showSetting: false,
    sizeScale: SCALE,
    distanceScale: SCALE,
    speedScale: TIME_SCALE,
    showOrbitLine: true,
    ignoreAxis: false,
    pauseOrbitWhenFocus: true,
    setControl: () => null
})

