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

        const unsubscribe = y.on('change', (latest) => {
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
    const [controlHeight, setControlHeight] = useState(160);
    const [descHeight, setDescHeight] = useState(140);
    const [telemetryHeight, setTelemetryHeight] = useState(240);

    const [isOpen, setOpen] = useState(false);
    const { focus } = useControlStore();

    useEffect(() => {
        setOpen(!!focus);
        if (focus) {
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
    }, [focus]);

    useEffect(() => {
        if (!focus) return;

        const updateMeasurements = () => {
            if (controlRef.current) {
                const cHeight = controlRef.current.offsetHeight;
                if (cHeight > 0) setControlHeight(cHeight);
            }

            const descEl = document.getElementById('detail-description-section');
            if (descEl) {
                const dHeight = descEl.offsetHeight;
                if (dHeight > 0) setDescHeight(dHeight);
            }

            const teleEl = document.getElementById('detail-telemetry-section');
            if (teleEl) {
                const tHeight = teleEl.offsetHeight;
                if (tHeight > 0) setTelemetryHeight(tHeight);
            }
        };

        updateMeasurements();
        const timer = setTimeout(updateMeasurements, 80);

        const observer = new ResizeObserver(updateMeasurements);
        if (controlRef.current) observer.observe(controlRef.current);
        const descEl = document.getElementById('detail-description-section');
        if (descEl) observer.observe(descEl);
        const teleEl = document.getElementById('detail-telemetry-section');
        if (teleEl) observer.observe(teleEl);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [focus]);

    // 1. Handle (~44px)
    const handleSnap = 44;

    // Hitung 5 snap points dinamis: [0, handle, control panel, description, telemetry, full height]
    const snapPoints = useMemo(() => {
        const windowH = typeof window !== 'undefined' ? window.innerHeight : 844;
        const maxSnapPixels = windowH - 50;

        const s1 = handleSnap; // 1: Handle
        const s2 = Math.min(Math.max(s1 + 60, handleSnap + controlHeight), maxSnapPixels - 140); // 2: Control Panel
        const s3 = Math.min(Math.max(s2 + 60, s2 + descHeight + 32), maxSnapPixels - 70); // 3: Detail Description
        const s4 = Math.min(Math.max(s3 + 60, s3 + telemetryHeight + 16), maxSnapPixels); // 4: Detail Telemetry

        return [0, s1, s2, s3, s4, 1];
    }, [handleSnap, controlHeight, descHeight, telemetryHeight]);

    const handleSnapChange = (index: number) => {
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
        >
            <SheetClamper minVisibleHeight={handleSnap} isActive={isOpen} />
            <Sheet.Container>
                <Sheet.Header />
                <Sheet.Content disableScroll={({ currentSnap }) => currentSnap !== 5}>
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