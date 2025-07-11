import { theme } from "../../constants/theme";
import DrawIcon from "./Draw";
import SelectIcon from "./Select";
import SaveIcon from "./Save";
import BackButtonIcon from "./BackButton";

const icons = {
    backbutton: BackButtonIcon,
    draw: DrawIcon,
    save: SaveIcon,
    select: SelectIcon
}

const Icon = ({ name, size = 24, 
                strokeWidth = 1.9, 
                color = theme.colors.textLight, 
                ...props }) => {

    const IconComponent = icons[name && name.toLowerCase()];
    if (!IconComponent) return null;
    return (
        <IconComponent
            width={size}
            height={size}
            strokeWidth={strokeWidth}
            color={color}
            {...props}
        />
    );
}

export default Icon;

