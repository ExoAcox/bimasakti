/* eslint-disable react-hooks/set-state-in-effect */
import { Suspense, useEffect, useState, type ReactNode } from "react"

interface Props {
    children: ReactNode
    fallbackColor?: string
}

const MaterialFallback = ({ children, fallbackColor }: Props) => {
    const [previousMaterial, setPreviousMaterial] = useState<ReactNode | null>(null)

    useEffect(() => {
        setPreviousMaterial(children)
    }, [children])

    const fallback = previousMaterial || <meshStandardMaterial color={fallbackColor} />

    return (
        <Suspense fallback={fallback}>
            {children}
        </Suspense>
    )
}

export default MaterialFallback
