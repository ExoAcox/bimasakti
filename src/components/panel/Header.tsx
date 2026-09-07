import { useControlStore } from "@state"
import { useTranslation } from "react-i18next"



const Header = () => {
    const { universe } = useControlStore()
    const { t } = useTranslation()



    return <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50">
        <label className="bg-background text-secondary rounded-b px-4 py-2 text-sm font-semibold">{t(`object.${universe}.title`)}</label>
    </div>
}

export default Header