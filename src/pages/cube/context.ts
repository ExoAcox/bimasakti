import { createContext } from 'react';

export const ColorContext = createContext(0);

export const EffectContext = createContext({
    colorIndex: 0,
    isFalling: false,
    isInitial: true,
})