import { create } from 'zustand'
import { SCALE, TIME_SCALE } from '@constants'

export interface Control {
    focus: string
    focusIndex: number
    showDetail: boolean
    showSetting: boolean
    sizeScale: number
    distanceScale: number
    speedScale: number
    showOrbitLine: boolean
    ignoreAxis: boolean
    pauseOrbitWhenFocus: boolean
    setControl: (values: Partial<Omit<Control, "setControl">>) => void
}

export const defaultControl = {
    focus: "",
    focusIndex: 0,
    showSetting: false,
    showDetail: false,
    sizeScale: SCALE,
    distanceScale: SCALE,
    speedScale: TIME_SCALE,
    showOrbitLine: true,
    ignoreAxis: false,
    pauseOrbitWhenFocus: true,
}

export const useControlStore = create<Control>((set) => ({
    ...defaultControl,
    setControl: (values) => set((state) => ({ ...state, ...values })),
}))


interface Galaxy {
    focus: string
    setFocus: (focus: string) => void
}

export const useGalaxyStore = create<Galaxy>((set) => ({
    focus: "",
    setFocus: (focus: string) => set((state) => ({ ...state, focus })),
}))