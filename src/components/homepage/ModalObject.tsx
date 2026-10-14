import type { CelestialObject } from "@types"
import { useTranslation } from "react-i18next"

interface Props {
    data: CelestialObject
    onClose: () => void
}

const ModalObject = ({ data, onClose }: Props) => {

    const { t } = useTranslation()

    const handleClose = () => {
        onClose()
    }

    return <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50" onClick={handleClose}>
        <h5>{t(`object.${data.id}.name`)}</h5>
        <p>{t(`object.${data.id}.description`)}</p>
    </div>
}

export default ModalObject