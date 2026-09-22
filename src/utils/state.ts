import { create } from 'zustand'
import { SCALE, TIME_SCALE } from '@constants'
import type { Belt, CelestialObject } from '@types'

export interface SettingStore {
    mode: "normal" | "third-person" | "first-person"
    showDetail: boolean
    showSetting: boolean
    sizeScale: number
    distanceScale: number
    speedScale: number
    showOrbitLine: boolean
    ignoreAxis: boolean
    pauseOrbitWhenFocus: boolean
    setSetting: (values: Partial<Omit<SettingStore, "setSetting">>) => void
}

export const defaultSetting = {
    showSetting: false,
    showDetail: false,
    sizeScale: SCALE,
    distanceScale: SCALE,
    speedScale: TIME_SCALE,
    showOrbitLine: true,
    ignoreAxis: false,
    pauseOrbitWhenFocus: true,
}

export const useSettingStore = create<SettingStore>((set) => ({
    ...defaultSetting,
    mode: "normal",
    setSetting: (values) => set((state) => ({ ...state, ...values })),
}))

export interface ControlStore {
    focus: string
    focusIndex: number
    focusLandmark: string
    rotateSpeed: number
    axisTilt: number
    cloudVisible: boolean
    landmarkVisible: boolean
    nationVisible: boolean
    artificialSatelliteVisible: boolean
    dayNightMode: boolean
    resetControl: (data: CelestialObject | Belt) => void
    setControl: (values: Partial<Omit<ControlStore, "setControl" | "resetControl">>) => void
}

export const defaultControl = {
    focus: "",
    focusIndex: 0,
    focusLandmark: "",
    rotateSpeed: 1,
    axisTilt: 0,
    dayNightMode: true,
    cloudVisible: true,
    landmarkVisible: true,
    nationVisible: false,
    artificialSatelliteVisible: true,
}

export const useControlStore = create<ControlStore>((set) => ({
    ...defaultControl,
    resetControl: (data) => {
        set((state) => ({
            ...defaultControl,
            focus: state.focus,
            focusIndex: state.focusIndex,
            focusLandmark: "",
            axisTilt: (data as CelestialObject)?.axis || 0,
        }))
    },
    setControl: (values) => set((state) => ({ ...state, ...values })),
}))

export interface ShipStore {
    autopilot: boolean,
    cockpit: boolean,
    distance: number,
    setShip: (values: Partial<Omit<ShipStore, "setShip">>) => void
}

export const defaultShip = {
    autopilot: false,
    cockpit: false,
    distance: 0,
}

export const useShipStore = create<ShipStore>((set) => ({
    ...defaultShip,
    setShip: (values) => set((state) => ({ ...state, ...values })),
}))

interface GalaxyStore {
    focus: string
    setFocus: (focus: string) => void
    reset: () => void
}

export const useGalaxyStore = create<GalaxyStore>((set) => ({
    focus: "",
    reset: () => set((state) => ({ ...state, focus: "" })),
    setFocus: (focus: string) => set((state) => ({ ...state, focus })),
}))