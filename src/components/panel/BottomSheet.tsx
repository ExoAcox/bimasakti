/* eslint-disable react-hooks/set-state-in-effect */
import { useControlStore } from '@state';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Sheet, type SheetRef } from 'react-modal-sheet';

import ControlPanel from './ControlPanel';
import { DetailPanel } from '.';
import { When } from 'react-if';

// Helper component untuk meng-clamp batas bawah drag agar handle tidak hilang di bawah layar
const SheetClamper = ({ minVisibleHeight, isActive }: { minVisibleHeight: number; isActive: boolean }) => {
    const { y, height } = Sheet.useContext();

    useEffect(() => {
        if (!isActive || !y || !height) return;
        const maxY = height - minVisibleHeight;

        // Clamp posisi awal jika berada di luar batas
        if (y.get() > maxY) {
            y.set(maxY);
        }

        const unsubscribe = y.on('change', (latest: number) => {
            if (latest > maxY) {
                y.set(maxY);
            }
        });

        return () => unsubscribe();
    }, [y, height, minVisibleHeight, isActive]);

    return null;
};

const BottomSheet = () => {
    const sheetRef = useRef<SheetRef>(null);
    const controlRef = useRef<HTMLDivElement>(null!);
    const [controlHeight, setControlHeight] = useState(0);
    const [descHeight, setDescHeight] = useState(140);
    const [currentSnap, setCurrentSnap] = useState(2);
    const isFocusChangedRef = useRef(false);

    const [isOpen, setOpen] = useState(false);
    const { focus, focusIndex } = useControlStore();

    useEffect(() => {
        setOpen(!!focus);
        if (focus) {
            isFocusChangedRef.current = true;
            // Default snap ke ControlPanel (snap 2) saat berpindah focus atau pertama kali dibuka
            sheetRef.current?.snapTo(2);

            const raf = requestAnimationFrame(() => {
                sheetRef.current?.snapTo(2);
            });
            const timer = setTimeout(() => {
                sheetRef.current?.snapTo(2);
            }, 80);

            return () => {
                cancelAnimationFrame(raf);
                clearTimeout(timer);
            };
        }
    }, [focus, focusIndex]);

    useEffect(() => {
        if (!focus) return;

        const updateMeasurements = () => {
            if (controlRef.current) {
                const cHeight = controlRef.current.offsetHeight;
                if (cHeight > 0) {
                    setControlHeight((prev) => (Math.abs(prev - cHeight) > 1 ? cHeight : prev));
                }
            }

            const descEl = document.getElementById('detail-description-section');
            if (descEl) {
                const dHeight = descEl.offsetHeight;
                if (dHeight > 0) {
                    setDescHeight((prev) => (Math.abs(prev - dHeight) > 1 ? dHeight : prev));
                }
            }
        };

        updateMeasurements();
        const timer1 = setTimeout(updateMeasurements, 60);
        const timer2 = setTimeout(updateMeasurements, 160);

        const observer = new ResizeObserver(updateMeasurements);
        if (controlRef.current) observer.observe(controlRef.current);
        const descEl = document.getElementById('detail-description-section');
        if (descEl) observer.observe(descEl);
        const teleEl = document.getElementById('detail-telemetry-section');
        if (teleEl) observer.observe(teleEl);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            observer.disconnect();
        };
    }, [focus]);

    // 1. Handle (~44px)
    const handleSnap = 44;

    // Hitung 5 snap points dinamis: [0, handle, control panel, description, full height]
    const snapPoints = useMemo(() => {
        const windowH = typeof window !== 'undefined' ? window.innerHeight : 844;
        const maxSnapPixels = windowH - 50;

        const s1 = handleSnap; // 1: Handle
        const targetControlHeight = controlHeight > 0 ? controlHeight : 72;
        const s2 = Math.min(handleSnap + targetControlHeight, maxSnapPixels - 140); // 2: Control Panel
        const s3 = Math.min(Math.max(s2 + 60, s2 + descHeight + 32), maxSnapPixels - 70); // 3: Detail Description

        return [0, s1, s2, s3, 1];
    }, [handleSnap, controlHeight, descHeight]);

    // Pastikan sheet re-snap ke posisi yang tepat begitu controlHeight selesai diukur
    useEffect(() => {
        if (!focus || !controlHeight) return;
        if (isFocusChangedRef.current || currentSnap === 2) {
            sheetRef.current?.snapTo(2);
            isFocusChangedRef.current = false;
        }
    }, [controlHeight, focus, currentSnap]);

    const handleSnapChange = (index: number) => {
        setCurrentSnap(index);
        // Jika karena flick/swipe mengarah ke 0 (closed), segera pantulkan ke snap 1 (Handle)
        if (index === 0 && focus) {
            sheetRef.current?.snapTo(1);
        }
    };

    return (
        <Sheet
            ref={sheetRef}
            isOpen={isOpen}
            onClose={() => null}
            disableDismiss
            detent="full"
            snapPoints={snapPoints}
            initialSnap={2}
            onSnap={handleSnapChange}
            tweenConfig={{
                ease: 'easeOut',
                duration: 0.15,
            }}
        >
            <SheetClamper minVisibleHeight={handleSnap} isActive={isOpen} />
            <Sheet.Container>
                <Sheet.Header />
                <Sheet.Content disableScroll={({ currentSnap: activeSnap }) => activeSnap !== snapPoints.length - 1}>
                    <When condition={focus}>
                        <div ref={controlRef} className="pb-1">
                            <ControlPanel />
                        </div>
                        <div className="mx-6 h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-1" />
                        <DetailPanel />
                    </When>
                </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop className="pointer-events-none bg-transparent!" />
        </Sheet>
    );
};

export default BottomSheet;