import { create } from 'zustand'
import { SCALE, TIME_SCALE } from '@constants'
import { Mode, type Belt, type CelestialObject } from '@types'

export interface SettingStore {
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
    setSetting: (values) => set((state) => ({ ...state, ...values })),
}))

export interface ControlStore {
    mode: Mode
    autopilot: boolean
    focus: string
    focusIndex: number
    focusLandmark: string
    variant: string
    rotateSpeed: number
    axisTilt: number
    tidalLock: boolean
    topologyVisible: boolean
    cloudVisible: boolean
    atmosphereVisible: boolean
    landmarkVisible: boolean
    nationVisible: boolean
    artificialSatelliteVisible: boolean
    dayNightMode: boolean
    resetControl: (data?: CelestialObject | Belt) => void
    setControl: (values: Partial<Omit<ControlStore, "setControl" | "resetControl">>) => void
}

export const defaultControl = {
    mode: Mode.Object,
    autopilot: false,
    focus: "",
    focusIndex: 0,
    focusLandmark: "",
    variant: "",
    rotateSpeed: 1,
    axisTilt: 0,
    tidalLock: false,
    dayNightMode: true,
    topologyVisible: false,
    cloudVisible: true,
    atmosphereVisible: true,
    landmarkVisible: true,
    nationVisible: false,
    artificialSatelliteVisible: true,
}

export const useControlStore = create<ControlStore>((set) => ({
    ...defaultControl,
    resetControl: (data) => {
        const object = data as CelestialObject
        const tidalLock = object?.rotate_duration === object?.orbit_duration

        set((state) => ({
            ...defaultControl,
            focus: state.focus,
            focusIndex: state.focusIndex + 1,
            axisTilt: object?.axis ?? 0,
            rotateSpeed: tidalLock ? 0 : 1,
            tidalLock
        }))
    },
    setControl: (values) => set((state) => ({ ...state, ...values })),
}))

// export interface ShipStore {
//     autopilot: boolean,
//     cockpit: boolean,
//     distance: number,
//     setShip: (values: Partial<Omit<ShipStore, "setShip">>) => void
// }

// export const defaultShip = {
//     autopilot: false,
//     cockpit: false,
//     distance: 0,
// }

// export const useShipStore = create<ShipStore>((set) => ({
//     ...defaultShip,
//     setShip: (values) => set((state) => ({ ...state, ...values })),
// }))

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