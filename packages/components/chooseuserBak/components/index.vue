<template>
    <Modal
        :visible="props.visible"
        :close-on-click-modal="true"
        :close-on-press-escape="true"
        :custom-class="'choose-user-dialog'"
        :append-to-body="true"
        :destroy-on-close="true"
        :show-close="true"
        :title="props.title"
        width="720px"
    >
<!--        <div class="choose-user-wrapper">-->
<!--            <div class="choose-user-left">-->
<!--                &lt;!&ndash; 多选展示部门 &ndash;&gt;-->
<!--                <template v-if="multiSelect">-->
<!--                    <div class="input-box">-->
<!--                        <input type="text" v-model="keyWord" class=""-->
<!--                               placeholder="搜索同事"-->
<!--                               @compositionstart="compositionstart"-->
<!--                               @compositionend="compositionend"-->
<!--                               @clear="cancelSearchShow"-->
<!--                               @keyup="throttle">-->
<!--                        <span class="iconfont qzz_icon_fill_chacha" v-if="this.keyWord" @click="cancelSearchShow"></span>-->
<!--                    </div>-->
<!--                    <div class="search-result" v-if="this.showSearchResultList && this.keyWord">-->
<!--                        <ul v-if="this.searchResultList.length > 0">-->
<!--                            <li class="user-type" :class="{'user-type-bg':item.isChecked}" v-for="(item,index) in searchResultList" :key="item" @click="searchAddOne(item)">-->
<!--                                <img v-if="item.avatar" class="user-img" :src="returnImgUrl(item.avatar, '_60x60.jpg')"/>-->
<!--                                <span v-else class="user-text">{{ getFirst(item.name) }}</span>-->
<!--                                <span class="name">{{ item.name }}<span v-if="item.roster">({{item.roster}})</span></span>-->
<!--                            </li>-->
<!--                        </ul>-->
<!--                        <div v-else class="search-result-empty">暂未搜索到相关人员</div>-->
<!--                    </div>-->
<!--                    <div class="choose-user-deps">-->
<!--                        <div class="choose-user-breadcrumb">-->
<!--                            <span class="breadcrumb-item breadcrumb-item-active" :class="{'breadcrumb-item-first': index == 0}" v-for="(item,index) in breadCrumbList" :key="item" @click="updateBreadCrumb(item)">-->
<!--                                <span class="breadcrumb-item-inner">{{ item.name }}</span>-->
<!--                                <span class="breadcrumb-item-separator">/</span>-->
<!--                            </span>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <div class="choose-user-cont">-->
<!--                        <template v-if="this.showCheckbox">-->
<!--                            <div class="select-all" @click="selectAll" v-if="this.userList?.depts?.length > 0 || this.userList?.users?.length > 0">-->
<!--                                <span v-if="!isSelectAll" class="iconfont qzz_icon_checkbox-weixuan"></span>-->
<!--                                <span v-if="isSelectAll" class="iconfont qzz_icon_checkbox-checked1"></span>-->
<!--                                <span class="text">全选</span>-->
<!--                            </div>-->
<!--                        </template>-->
<!--                        <ul class="choose-user-list" v-loading="loading" v-if="this.userList?.depts?.length > 0 || this.userList?.users?.length > 0">-->
<!--                            <li class="dep-type" :class="{'dep-type-selected':i.isChecked}" v-for="(i,index) in userList.depts" :key="i" @click="selectOne(i,'dept')">-->
<!--                                <template v-if="this.showCheckbox">-->
<!--                                    <span v-if="!i.isChecked" class="checkbox iconfont qzz_icon_checkbox-weixuan"></span>-->
<!--                                    <span v-if="i.isChecked" class="checkbox iconfont qzz_icon_checkbox-checked1"></span>-->
<!--                                </template>-->
<!--                                <span class="name" :title="i.name">{{ formatText(i.name) }}（{{ i.cnt }}人）</span>-->
<!--                                <span class="expand-btn" @click.stop="expandNext(i)">-->
<!--                                    <span class="text">下一级</span>-->
<!--                                    <span class="iconfont qzz_icon_fill_right"></span>-->
<!--                                </span>-->
<!--                            </li>-->
<!--                            <li class="user-type" v-for="(o,index) in userList.users" :key="o" @click="selectOne(o,'user')">-->
<!--                                <span v-if="!o.isChecked" class="checkbox iconfont qzz_icon_checkbox-weixuan"></span>-->
<!--                                <span v-if="o.isChecked" class="checkbox iconfont qzz_icon_checkbox-checked1"></span>-->
<!--                                <img v-if="o.avatar" class="user-img" :src="returnImgUrl(o.avatar, '_60x60.jpg')"/>-->
<!--                                <span v-else="" class="user-text">{{ getFirst(o.name) }}</span>-->
<!--                                <span class="name">{{ o.name }}<span v-if="o.roster">({{o.roster}})</span></span>-->
<!--                            </li>-->
<!--                        </ul>-->
<!--                        <el-empty v-else description="该部门暂无员工"></el-empty>-->
<!--                    </div>-->
<!--                </template>-->
<!--                &lt;!&ndash; 单选只展示搜索框 &ndash;&gt;-->
<!--                <template v-else>-->
<!--                    <div class="input-box">-->
<!--                        <input type="text" v-model="keyWord" class=""-->
<!--                               placeholder="搜索同事"-->
<!--                               @compositionstart="compositionstart"-->
<!--                               @compositionend="compositionend"-->
<!--                               @clear="cancelSearchShow"-->
<!--                               @keyup="throttle">-->
<!--                        <span class="iconfont qzz_icon_fill_chacha" v-if="this.keyWord" @click="this.keyWord = ''"></span>-->
<!--                    </div>-->
<!--                    <div class="search-result search-result-static" v-if="this.showSearchResultList">-->
<!--                        <ul v-if="this.searchResultList.length > 0">-->
<!--                            <li class="user-type" :class="{'user-type-bg':item.isChecked}" v-for="(item,index) in searchResultList" :key="item" @click="addOneUser(item)">-->
<!--                                <img v-if="item.avatar" class="user-img" :src="returnImgUrl(item.avatar, '_60x60.jpg')"/>-->
<!--                                <span v-else="" class="user-text">{{ getFirst(item.name) }}</span>-->
<!--                                <span class="name">{{ item.name }}<span v-if="item.roster">({{item.roster}})</span></span>-->
<!--                            </li>-->
<!--                        </ul>-->
<!--                        <el-empty v-else description="暂无数据"></el-empty>-->
<!--                    </div>-->
<!--                </template>-->
<!--            </div>-->
<!--            <div class="choose-user-right">-->
<!--                <div class="choose-user-selected">-->
<!--                    <template v-for="(k,index) in selectList" :key="k.id">-->
<!--                        <span class="selected-box">-->
<!--                            <span class="text">-->
<!--                                {{ k.name }}<template v-if="k.type == 'dept'">({{ k.cnt }})</template>-->
<!--                            </span>-->
<!--                            <span class="iconfont qzz_icon_line_close" @click="delSelected(k)"></span>-->
<!--                        </span>-->
<!--                    </template>-->
<!--                </div>-->
<!--                <div class="choose-user-btns">-->
<!--                    <span class="common-btn cancel-btn" @click="closeDialog">取消</span>-->
<!--                    <span class="common-btn sure-btn" v-if="selectList.length > 0" @click="saveUsers">确定</span>-->
<!--                    <span class="common-btn sure-btn disabled-btn" v-else>确定</span>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
        <div></div>
    </Modal>
</template>
<script setup lang="ts">
import { Modal } from 'ant-design-vue'
import { defineProps, defineEmits } from 'vue'
const emits =  defineEmits(["updateUserIds","close"])
const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    filterSelf: {
        type: Boolean,
        default: false
    },
    searchAllZone: {
        type: Boolean,
        default: false
    },
    multiSelect: {
        type: Boolean,
        default: true
    },
    showCheckbox:{
        type: Boolean,
        default: true
    },
    title:{
        type:String,
        default: "请选择人员"
    },
    selectedUsers: {
        type: Array,
        default(){
            return []
        }
    }
})
</script>
