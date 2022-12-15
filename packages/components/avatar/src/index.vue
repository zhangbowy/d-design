<script lang="ts" >
import { UserOutlined } from '@ant-design/icons-vue';
import { toRefs, defineComponent, onMounted  } from 'vue';
import { avatarProps, AvatarProps } from './type';

export default defineComponent({
    name: 'Avatar',
    components: { UserOutlined },
    props: avatarProps,
    setup(props: AvatarProps) {
        const { size = 32, className, avatar, name } = toRefs(props);
        onMounted(() => {
        });
        return {
            avatarSize: size,
            avatarUrl: avatar,
            avatarClassName: className,
            avatarName: name,
        };
    },
});
</script>
<template>
    <div v-if="avatar">
        <a-avatar :class="[avatarClassName, 'kpi-avatar']" :size="avatarSize" :src="avatarUrl" />
    </div>
    <div v-else-if="!avatarName">
        <a-avatar :class="[avatarClassName, 'kpi-avatar']" :size="avatarSize">
            <UserOutlined />
        </a-avatar>
    </div>
    <div v-else>
        <a-avatar :class="[avatarClassName, 'kpi-avatar']" :size="avatarSize">
            {{ avatarName.slice(0, 1) }}
        </a-avatar>
    </div>
</template>
<style lang="less">
@primary-color: #2B85FF;
.kpi-avatar {
    background-color: @primary-color!important;
    //color: #f5f5f5 !important;
    .ant-avatar-string {
        color: #f5f5f5 !important;
    }
}
</style>
