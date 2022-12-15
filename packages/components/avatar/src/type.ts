import {ExtractPropTypes} from "vue";

export const avatarProps = {
    size: {
        type: Number,
        default: 32,
    },
    className: {
        type: String as () => string,
        default: null,
    },
    avatar: {
        type: String as () => string,
        default: null,
    },
    name: {
        type: String as () => string,
        default: null,
    },
};

export type AvatarProps = ExtractPropTypes<typeof avatarProps>;
