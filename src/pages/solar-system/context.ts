import { createContext } from 'react';
import { SCALE, TIME_SCALE } from './constants';

export interface Control {
    universe: string,
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

export const defaultValue = {
    universe: "solar-system",
    focus: "",
    focusIndex: 0,
    showSetting: false,
    sizeScale: SCALE,
    distanceScale: SCALE,
    speedScale: TIME_SCALE,
    showOrbitLine: true,
    ignoreAxis: false,
    pauseOrbitWhenFocus: true,
}

export const ControlContext = createContext<Control>({
    ...defaultValue,
    setControl: () => null
})

