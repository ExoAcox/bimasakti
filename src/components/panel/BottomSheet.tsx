/* eslint-disable react-hooks/set-state-in-effect */
import { useControlStore } from '@state';
import { useEffect, useMemo, useRef, useState } from 'react'
import { Sheet } from 'react-modal-sheet';

import 'react-spring-bottom-sheet/dist/style.css'
import ControlPanel from './ControlPanel';
import { useTranslation } from 'react-i18next';
import { DetailPanel } from '.';
import { When } from 'react-if';

const BottomSheet = () => {
    const controlRef = useRef<HTMLDivElement>(null!)
    const [controlHeight, setControlHeight] = useState(0)

    const [isOpen, setOpen] = useState(false);
    const { t } = useTranslation()
    // const sheetRef = useRef<BottomSheetRef>(null!)

    const { focus } = useControlStore()

    useEffect(() => {
        setOpen(!!focus)
    }, [focus])



    useEffect(() => {
        if (!controlRef.current) return
        setControlHeight(1 / (window.innerHeight / (controlRef.current.offsetHeight + 24)))

    }, [focus])

    console.log(controlHeight)

    return <Sheet
        isOpen={isOpen}
        onClose={() => null}
        disableDismiss
        detent="content"
        snapPoints={[0, 0.25, 0.5, 0.75, 1]}
        initialSnap={2}
    >
        <Sheet.Container>
            <Sheet.Header>
                {/* {t(`object.${focus}.name`)} */}
            </Sheet.Header>
            <Sheet.Content>
                <When condition={focus}>
                    <div ref={controlRef}>

                        <ControlPanel />

                    </div>
                    <DetailPanel />
                </When>
            </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
    </Sheet>
}

export default BottomSheet