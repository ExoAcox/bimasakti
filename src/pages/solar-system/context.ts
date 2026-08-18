import { createContext } from 'react';

export interface Control {
    focus: string,
    speed: number,
    setControl: (values: object) => void
}

export const ControlContext = createContext<Control>({
    focus: "",
    speed: 1,
    setControl: () => null
})