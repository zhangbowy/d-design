<!--<template>-->
<!--    <a-model :visible="visible" :close-on-click-modal="true" :close-on-press-escape="true"-->
<!--        :custom-class="'choose-user-dialog'" :append-to-body="true" :destroy-on-close="true" :show-close="true"-->
<!--        :title="title" width="720px" @open="getDeptOrUsers" @close="closeDialog">-->
<!--        <div class="choose-user-wrapper">-->
<!--            <div class="choose-user-left">-->
<!--                &lt;!&ndash; 多选展示部门 &ndash;&gt;-->
<!--                <template v-if="this.multiSelect">-->
<!--                    <div class="input-box">-->
<!--                        <input type="text" v-model="keyWord" class="" placeholder="搜索同事"-->
<!--                            @compositionstart="compositionstart" @compositionend="compositionend"-->
<!--                            @clear="cancelSearchShow" @keyup="throttle">-->
<!--                        <span class="iconfont qzz_icon_fill_chacha" v-if="keyWord"-->
<!--                            @click="cancelSearchShow"></span>-->
<!--                    </div>-->
<!--                    <div class="search-result" v-if="baseInfo.showSearchResultList && keyWord">-->
<!--                        <ul v-if="baseInfo.searchResultList.length > 0">-->
<!--                            <li class="user-type" :class="{ 'user-type-bg': item.isChecked }"-->
<!--                                v-for="(item, index) in searchResultList" :key="item" @click="searchAddOne(item)">-->
<!--                                <img v-if="item.avatar" class="user-img"-->
<!--                                    :src="returnImgUrl(item.avatar, '_60x60.jpg')" />-->
<!--                                <span v-else class="user-text">{{ getFirst(item.name) }}</span>-->
<!--                                <span class="name">{{ item.name }}<span-->
<!--                                        v-if="item.roster">({{ item.roster }})</span></span>-->
<!--                            </li>-->
<!--                        </ul>-->
<!--                        <div v-else class="search-result-empty">暂未搜索到相关人员</div>-->
<!--                    </div>-->
<!--                    <div class="choose-user-deps">-->
<!--                        <div class="choose-user-breadcrumb">-->
<!--                            <span class="breadcrumb-item breadcrumb-item-active"-->
<!--                                :class="{ 'breadcrumb-item-first': index == 0 }" v-for="(item, index) in breadCrumbList"-->
<!--                                :key="item" @click="updateBreadCrumb(item)">-->
<!--                                <span class="breadcrumb-item-inner">{{ item.name }}</span>-->
<!--                                <span class="breadcrumb-item-separator">/</span>-->
<!--                            </span>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <div class="choose-user-cont">-->
<!--                        <template v-if="showCheckbox">-->
<!--                            <div class="select-all" @click="selectAll"-->
<!--                                v-if="baseInfo.userList?.depts?.length > 0 || baseInfo.userList?.users?.length > 0">-->
<!--                                <span v-if="!isSelectAll" class="iconfont qzz_icon_checkbox-weixuan"></span>-->
<!--                                <span v-if="isSelectAll" class="iconfont qzz_icon_checkbox-checked1"></span>-->
<!--                                <span class="text">全选</span>-->
<!--                            </div>-->
<!--                        </template>-->
<!--                        <ul class="choose-user-list" v-loading="loading"-->
<!--                            v-if="baseInfo.userList?.depts?.length > 0 || baseInfo.userList?.users?.length > 0">-->
<!--                            <li class="dep-type" :class="{ 'dep-type-selected': i.isChecked }"-->
<!--                                v-for="(i, index) in userList.depts" :key="i" @click="selectOne(i, 'dept')">-->
<!--                                <template v-if="showCheckbox">-->
<!--                                    <span v-if="!i.isChecked"-->
<!--                                        class="checkbox iconfont qzz_icon_checkbox-weixuan"></span>-->
<!--                                    <span v-if="i.isChecked"-->
<!--                                        class="checkbox iconfont qzz_icon_checkbox-checked1"></span>-->
<!--                                </template>-->
<!--                                <span class="name" :title="i.name">{{ formatText(i.name) }}（{{ i.cnt }}人）</span>-->
<!--                                <span class="expand-btn" @click.stop="expandNext(i)">-->
<!--                                    <span class="text">下一级</span>-->
<!--                                    <span class="iconfont qzz_icon_fill_right"></span>-->
<!--                                </span>-->
<!--                            </li>-->
<!--                            <li class="user-type" v-for="(o, index) in userList.users" :key="o"-->
<!--                                @click="selectOne(o, 'user')">-->
<!--                                <span v-if="!o.isChecked" class="checkbox iconfont qzz_icon_checkbox-weixuan"></span>-->
<!--                                <span v-if="o.isChecked" class="checkbox iconfont qzz_icon_checkbox-checked1"></span>-->
<!--                                <img v-if="o.avatar" class="user-img" :src="returnImgUrl(o.avatar, '_60x60.jpg')" />-->
<!--                                <span v-else="" class="user-text">{{ getFirst(o.name) }}</span>-->
<!--                                <span class="name">{{ o.name }}<span v-if="o.roster">({{ o.roster }})</span></span>-->
<!--                            </li>-->
<!--                        </ul>-->
<!--                        <el-empty v-else description="该部门暂无员工"></el-empty>-->
<!--                    </div>-->
<!--                </template>-->
<!--                &lt;!&ndash; 单选只展示搜索框 &ndash;&gt;-->
<!--                <template v-else>-->
<!--                    <div class="input-box">-->
<!--                        <input type="text" v-model="keyWord" class="" placeholder="搜索同事"-->
<!--                            @compositionstart="compositionstart" @compositionend="compositionend"-->
<!--                            @clear="cancelSearchShow" @keyup="throttle">-->
<!--                        <span class="iconfont qzz_icon_fill_chacha" v-if="keyWord"-->
<!--                            @click="keyWord = ''"></span>-->
<!--                    </div>-->
<!--                    <div class="search-result search-result-static" v-if="baseInfo.showSearchResultList">-->
<!--                        <ul v-if="baseInfo.searchResultList.length > 0">-->
<!--                            <li class="user-type" :class="{ 'user-type-bg': item.isChecked }"-->
<!--                                v-for="(item, index) in searchResultList" :key="item" @click="addOneUser(item)">-->
<!--                                <img v-if="item.avatar" class="user-img"-->
<!--                                    :src="returnImgUrl(item.avatar, '_60x60.jpg')" />-->
<!--                                <span v-else="" class="user-text">{{ getFirst(item.name) }}</span>-->
<!--                                <span class="name">{{ item.name }}<span-->
<!--                                        v-if="item.roster">({{ item.roster }})</span></span>-->
<!--                            </li>-->
<!--                        </ul>-->
<!--                        <el-empty v-else description="暂无数据"></el-empty>-->
<!--                    </div>-->
<!--                </template>-->
<!--            </div>-->
<!--            <div class="choose-user-right">-->
<!--                <div class="choose-user-selected">-->
<!--                    <template v-for="(k, index) in selectList" :key="k.id">-->
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
<!--    </a-model>-->
<!--</template>-->
<!--<script setup lang="ts">-->
<!--import { AModal } from 'ant-design-vue'-->
<!--import { ref, reactive, onMounted } from 'vue'-->
<!--import {-->
<!--    SEARCH_USER,-->
<!--    SEARCH_ZONE_USER,-->
<!--    GET_DEPT_INFO,-->
<!--    GET_USERIDS,-->
<!--} from '../api'-->
<!--const $emit = defineEmits(["updateUserIds", "close"])-->
<!--let IS_INPUT_CH = false;-->
<!--let G_TIME = null;-->
<!--const props = defineProps({-->
<!--    visible: {-->
<!--        type: Boolean,-->
<!--        required: true-->
<!--    },-->
<!--    filterSelf: {-->
<!--        type: Boolean,-->
<!--        default: false-->
<!--    },-->
<!--    searchAllZone: {-->
<!--        type: Boolean,-->
<!--        default: false-->
<!--    },-->
<!--    multiSelect: {-->
<!--        type: Boolean,-->
<!--        default: true-->
<!--    },-->
<!--    showCheckbox: {-->
<!--        type: Boolean,-->
<!--        default: true-->
<!--    },-->
<!--    title: {-->
<!--        type: String,-->
<!--        default: "请选择人员"-->
<!--    },-->
<!--    selectedUsers: {-->
<!--        type: Array,-->
<!--        default() {-->
<!--            return []-->
<!--        }-->
<!--    },-->
<!--    corpId: {-->
<!--        type: String,-->
<!--        default: ""-->
<!--    },-->
<!--    appId: {-->
<!--        type: String,-->
<!--        default: ""-->
<!--    },-->
<!--    userId: { // 当前用户的UserID-->
<!--        type: String,-->
<!--        default: ""-->
<!--    }-->
<!--})-->

<!--const keyWord = ref('') // 搜索关键字-->
<!--const deptName = ref('') //1级部门名称-->
<!--const loading = ref(false)-->
<!--const isSelectAll = ref(false) //是否都被选中-->
<!--const baseInfo = reactive({-->
<!--    userList: [], //左侧部门人员列表-->
<!--    searchResultList: [], //输入框搜索人员结果列表-->
<!--    showSearchResultList: false, //是否展示搜索结果-->
<!--    selectList: [], //右侧已选部门人员列表-->
<!--    breadCrumbList: [],-->
<!--    loading: false,-->
<!--})-->

<!--onMounted(() => {-->
<!--    getDeptOrUsers()-->
<!--})-->
<!--const getFirst = (str: string) => {-->
<!--    return str && str.substring(0, 1);-->
<!--}-->
<!--const returnImgUrl = (originalImgUrl: string, size: string) => {-->
<!--    return `${originalImgUrl}${size}`;-->
<!--}-->
<!--const formatText = (str: string) => {-->
<!--    let formatS = '';-->
<!--    if (str.length > 10) {-->
<!--        formatS = str.substr(0, 8) + '...';-->
<!--    } else {-->
<!--        formatS = str;-->
<!--    }-->
<!--    return formatS;-->
<!--}-->
<!--/*-->
<!--    * 搜索部门或者用户-->
<!--    * */-->
<!--const getDeptOrUsers = () => {-->
<!--    if (props.multiSelect) {-->
<!--        getDeptInfo('1');-->
<!--    } else {-->
<!--        queryUser();-->
<!--    }-->
<!--    // 将selectUsers赋值给selectList-->
<!--    props.selectedUsers.forEach((user: any) => {-->
<!--        const obj = {-->
<!--            ...user,-->
<!--            type: 'user',-->
<!--            isChecked: true,-->
<!--            id: user.userId,-->
<!--        };-->
<!--        baseInfo.selectList.push(obj);-->
<!--    });-->
<!--}-->
<!--/*-->
<!-- * 获取部门信息-->
<!-- * params:{-->
<!-- *    tpf:1,-->
<!-- *    appId:appId,-->
<!-- *    corpId:corpId,-->
<!-- *    deptId:deptId //部门id， 根目录传1-->
<!-- *    loginUserId:loginUserId //登录用户id-->
<!-- * }-->
<!-- * */-->
<!--const getDeptInfo = (deptId) => {-->
<!--    GET_DEPT_INFO({-->
<!--        tpf: 1,-->
<!--        appId: props.appId,-->
<!--        corpId: props.corpId,-->
<!--        deptId: deptId,-->
<!--    })-->
<!--    .then((res) => {-->
<!--        if (res.code == 1) {-->
<!--            //重置全选状态-->
<!--            isSelectAll.value = false;-->
<!--            //渲染数据 过滤掉自己-->
<!--            if (props.filterSelf) {-->
<!--                let oData = res.data;-->
<!--                let selfId = JSON.parse(localStorage.getItem('OKR_DATA'))?.user-->
<!--                    .userId;-->
<!--                let newUsers = oData.users.filter(-->
<!--                    (item) => item.userId != selfId-->
<!--                );-->
<!--                oData.users = newUsers;-->
<!--                baseInfo.userList = oData;-->
<!--            } else {-->
<!--                baseInfo.userList = res.data;-->
<!--            }-->
<!--            //渲染面包屑-->
<!--            if (deptId == 1) {-->
<!--                deptName.value = res.data.name;-->
<!--                baseInfo.breadCrumbList[0] = {-->
<!--                    name: res.data.name,-->
<!--                    deptId: deptId,-->
<!--                };-->
<!--            }-->
<!--        }-->
<!--    })-->
<!--    .catch((error) => {-->
<!--        console.log('error', error);-->
<!--    });-->
<!--}-->

<!--/*-->
<!--    * 节流-->
<!--    * */-->
<!--    const throttle =()=> {-->
<!--    if (IS_INPUT_CH) return;-->
<!--    if (G_TIME) {-->
<!--        clearTimeout(G_TIME);-->
<!--    }-->
<!--    G_TIME = setTimeout(() => {-->
<!--        queryUser();-->
<!--    }, 300);-->
<!--}-->
<!--/*-->
<!--    * 搜索用户-->
<!--    * */-->
<!--const queryUser =()=> {-->
<!--    loading.value = true;-->
<!--    //根据配置决定用哪个接口请求-->
<!--    let SEARCHFun = null;-->
<!--    if (props.searchAllZone) {-->
<!--        SEARCH = SEARCH_ZONE_USER;-->
<!--    } else {-->
<!--        SEARCH = SEARCH_USER;-->
<!--    }-->
<!--    SEARCH({-->
<!--        tpf: 1,-->
<!--        appId: props.appId,-->
<!--        corpId: props.corpId,-->
<!--        curPage: 1,-->
<!--        pageSize: 50,-->
<!--        code: localStorage.getItem('DINGDING_CODE'),-->
<!--        fuzzyName: keyWord.value,-->
<!--        dataSourceType: 1, // 0 表示走数据库 1表示走ES-->
<!--    })-->
<!--    .then((res) => {-->
<!--        loading.value = false;-->
<!--        if (res.code == 1) {-->
<!--            let data = res.data;-->
<!--            baseInfo.showSearchResultList = true;-->
<!--            //过滤自己-->
<!--            if (props.filterSelf) {-->
<!--                const selfId =props.userId;-->
<!--                baseInfo.searchResultList = data.resultList.filter(-->
<!--                    (item) => item.userId != selfId-->
<!--                );-->
<!--            } else {-->
<!--                baseInfo.searchResultList = data.resultList;-->
<!--            }-->
<!--        }-->
<!--    })-->
<!--    .catch((error) => {-->
<!--        console.log('error', error);-->
<!--    });-->
<!--}-->

<!--/*-->
<!--    * 取消搜索的展示-->
<!--    * */-->
<!--const cancelSearchShow =()=> {-->
<!--    //清空内容-->
<!--    keyWord.value = '';-->
<!--    //多选就隐藏弹层，单选就重新请求数据-->
<!--    if (props.multiSelect) {-->
<!--        baseInfo.showSearchResultList = false;-->
<!--    } else {-->
<!--        queryUser();-->
<!--    }-->
<!--}-->
<!--const compositionstart =()=> {-->
<!--    IS_INPUT_CH = true;-->
<!--}-->
<!--const compositionend =()=> {-->
<!--    IS_INPUT_CH = false;-->
<!--}-->
<!--		/*-->
<!--		 * 全选-->
<!--		 * */-->
<!--        const selectAll =() => {-->
<!--			//如果是全选就取消-->
<!--			if (isSelectAll.value) {-->
<!--				baseInfo.userList?.depts.forEach((i) => {-->
<!--					i.isChecked = false;-->
<!--				});-->
<!--				baseInfo.userList?.users.forEach((i) => {-->
<!--					i.isChecked = false;-->
<!--				});-->
<!--			}-->
<!--			//否则全选-->
<!--			else {-->
<!--				baseInfo.userList?.depts.forEach((i) => {-->
<!--					i.isChecked = true;-->
<!--				});-->
<!--				baseInfo.userList?.users.forEach((i) => {-->
<!--					i.isChecked = true;-->
<!--				});-->
<!--			}-->
<!--			//切换全选状态-->
<!--			isSelectAll.value = !isSelectAll.value;-->
<!--			//同步渲染状态-->
<!--			renderSelected();-->
<!--		},-->
<!--		/*-->
<!--		 * 单选切换状态-->
<!--		 * */-->
<!--		const selectOne=(item:any, type:string)=> {-->
<!--			if (!props.showCheckbox && type == 'dept') {-->
<!--				return;-->
<!--			}-->
<!--			item.isChecked = !item.isChecked;-->
<!--			//判断全选状态-->
<!--			checkSelectAllStatus();-->
<!--			//渲染单个选中/反选-->
<!--			renderOneSelected(item, type);-->
<!--		}-->
<!--		/*-->
<!--		 * 渲染选中/反选-->
<!--		 * */-->
<!--		const renderOneSelected=(item:any, type:string)=> {-->
<!--			//删除-->
<!--			if (!item.isChecked) {-->
<!--				const oIndex = baseInfo.selectList.findIndex((k) => k.id == item.id);-->
<!--				if (oIndex != -1) {-->
<!--					baseInfo.selectList.splice(oIndex, 1);-->
<!--				}-->
<!--			}-->
<!--			//添加-->
<!--			else {-->
<!--				let obj = item;-->
<!--				if (type == 'dept') {-->
<!--					obj.id = item.deptId;-->
<!--					obj.type = 'dept';-->
<!--				} else if (type == 'user') {-->
<!--					obj.id = item.userId;-->
<!--					obj.type = 'user';-->
<!--				}-->
<!--				baseInfo.selectList.push(obj);-->
<!--				//去重-->
<!--				baseInfo.selectList = delSameArr(baseInfo.selectList, 'id');-->
<!--			}-->
<!--		}-->
<!--		/*-->
<!--		 * 同步渲染状态-->
<!--		 * */-->
<!--        const renderSelected =()=> {-->
<!--			let arr = [];-->
<!--			baseInfo.userList?.depts.forEach((i) => {-->
<!--				//同步添加-->
<!--				if (i.isChecked) {-->
<!--					let obj = {};-->
<!--					obj.type = 'dept';-->
<!--					obj.name = i.name;-->
<!--					obj.cnt = i.cnt;-->
<!--					obj.deptId = i.deptId;-->
<!--					obj.id = i.deptId; //只用来去重-->
<!--					arr.push(obj);-->
<!--				}-->
<!--				//同步删除-->
<!--				else {-->
<!--					let dIdx = baseInfo.selectList.findIndex((k) => i.deptId == k.deptId);-->
<!--					if (dIdx != -1) {-->
<!--						baseInfo.selectList.splice(dIdx, 1);-->
<!--					}-->
<!--				}-->
<!--			});-->
<!--			baseInfo.userList?.users.forEach((i) => {-->
<!--				//同步添加-->
<!--				if (i.isChecked) {-->
<!--					let obj = {};-->
<!--					obj.type = 'user';-->
<!--					obj.name = i.name;-->
<!--					obj.userId = i.userId;-->
<!--					obj.id = i.userId; //只用来去重-->
<!--					arr.push(obj);-->
<!--				}-->
<!--				//同步删除-->
<!--				else {-->
<!--					let uIdx = baseInfo.selectList.findIndex((k) => i.deptId == k.deptId);-->
<!--					if (uIdx != -1) {-->
<!--						baseInfo.selectList.splice(uIdx, 1);-->
<!--					}-->
<!--				}-->
<!--			});-->
<!--			//赋值-->
<!--			baseInfo.selectList = baseInfo.selectList.concat(arr);-->
<!--			//去重-->
<!--			baseInfo.selectList = delSameArr(baseInfo.selectList, 'id');-->
<!--		}-->
<!--		/*-->
<!--		 * 判断全选选中还是取消选中-->
<!--		 * */-->
<!--		const checkSelectAllStatus = () => {-->
<!--			//部门-->
<!--			let dNoChexkIndex = baseInfo.userList?.depts?.findIndex((i) => !i.isChecked); //未选中-->
<!--			//人员-->
<!--			let uNoCheckIndex = baseInfo.userList?.users?.findIndex((i) => !i.isChecked); //未选中-->
<!--			//部门和人员都选中了才是全选-->
<!--			if (dNoChexkIndex == -1 && uNoCheckIndex == -1) {-->
<!--				isSelectAll.value = true;-->
<!--			} else {-->
<!--				isSelectAll.value = false;-->
<!--			}-->
<!--		}-->
<!--		/*-->
<!--		 * 展开下级-->
<!--		 * */-->
<!--		const expandNext=(item:any)=> {-->
<!--			//如果全选了 就不能点开下级-->
<!--			if (item.isChecked) {-->
<!--				return;-->
<!--			}-->
<!--			//获取子部门数据-->
<!--			let deptId = item.deptId;-->
<!--			getDeptInfo(deptId);-->
<!--			//渲染面包屑-->
<!--			baseInfo.breadCrumbList.push(item);-->
<!--		}-->
<!--		/*-->
<!--		 * 删除选中-->
<!--		 * */-->
<!--		const delSelected =(item:any) => {-->
<!--			/***************************组织列表中的数据切换**********************************/-->
<!--			if (item.type == 'dept') {-->
<!--				let o = baseInfo.userList?.depts?.find((i) => item.deptId == i.deptId);-->
<!--				if (o) {-->
<!--					//取消左侧选中-->
<!--					o.isChecked = false;-->
<!--				}-->
<!--				//渲染列表中删除-->
<!--				let sIndex = baseInfo.selectList.findIndex((i) => item.deptId == i.deptId);-->
<!--				if (sIndex != -1) {-->
<!--					baseInfo.selectList.splice(sIndex, 1);-->
<!--				}-->
<!--			}-->
<!--			if (item.type == 'user') {-->
<!--				let m = baseInfo.userList?.users?.find((i) => item.userId == i.userId);-->
<!--				if (m) {-->
<!--					//取消左侧选中-->
<!--					m.isChecked = false;-->
<!--				}-->
<!--				//渲染列表中删除-->
<!--				let dIndex = baseInfo.selectList.findIndex((i) => item.userId == i.userId);-->
<!--				if (dIndex != -1) {-->
<!--					baseInfo.selectList.splice(dIndex, 1);-->
<!--				}-->
<!--			}-->
<!--			/***************************搜索列表中的数据切换**********************************/-->
<!--			const kItem = baseInfo.searchResultList.find((i) => item.userId == i.userId);-->
<!--			if (kItem) {-->
<!--				kItem.isChecked = false;-->
<!--			}-->
<!--			//判断全选选中状态-->
<!--			checkSelectAllStatus();-->
<!--		}-->
<!--/*-->
<!--		 * 保存人员请求接口把部门id和人员id都换算成人员id-->
<!--		 * */-->
<!--         const saveUsers =()=> {-->
<!--			//换算成deptIds和userIds-->
<!--			let deptIds = [];-->
<!--			let userIds = [];-->
<!--			baseInfo.selectList.forEach((i) => {-->
<!--				if (i.type == 'dept') {-->
<!--					deptIds.push(i.deptId);-->
<!--				} else if (i.type == 'user') {-->
<!--					userIds.push(i.userId);-->
<!--				}-->
<!--			});-->
<!--			//发送请求-->
<!--			GET_USERIDS({-->
<!--				tpf: 1,-->
<!--				appId: props.appId,-->
<!--				corpId: props.corpId,-->
<!--				deptIds: deptIds + '', //解决数组传参问题-->
<!--				userIds: userIds + '', //解决数组传参问题-->
<!--			})-->
<!--				.then((res) => {-->
<!--					if (res.code == 1) {-->
<!--						let users = [];-->
<!--						if (props.filterSelf) {-->
<!--							const selfId = props.userId;-->
<!--							users = res.data?.userIds.filter((item) => item.userId != selfId);-->
<!--						} else {-->
<!--							users = res.data?.userIds;-->
<!--						}-->
<!--						$emit('updateUserIds', users);-->
<!--						//清空已选-->
<!--						baseInfo.selectList = [];-->
<!--					}-->
<!--				})-->
<!--				.catch((error) => {-->
<!--					console.log('error', error);-->
<!--				});-->
<!--		}-->
<!--		/*-->
<!--		 *  更新面包屑展示并重新渲染左侧数据-->
<!--		 * */-->
<!--		const updateBreadCrumb =(item:any)=> {-->
<!--			let oIndex = baseInfo.breadCrumbList.findIndex(-->
<!--				(i) => i.deptId == item.deptId-->
<!--			);-->
<!--			let arr = [];-->
<!--			baseInfo.breadCrumbList.forEach((i, index) => {-->
<!--				if (index <= oIndex) {-->
<!--					arr.push(baseInfo.breadCrumbList[index]);-->
<!--				}-->
<!--			});-->
<!--			baseInfo.breadCrumbList = arr;-->
<!--			//重新渲染左侧数据-->
<!--			getDeptInfo(item.deptId);-->
<!--		}-->
<!--		/*-->
<!--		 * 删除对象数组中重复的项-->
<!--		 * objList:对象数组类似:[{"id":"121212","userId":"feef98812"}]-->
<!--		 * key:去要去重的key例如上边的""-->
<!--		 * */-->
<!--		const delSameArr =(data, key)=> {-->
<!--			let obj = {};-->
<!--			let peon = data.reduce((cur, next) => {-->
<!--				obj[next[key]] ? '' : (obj[next[key]] = true && cur.push(next));-->
<!--				return cur;-->
<!--			}, []);-->
<!--			return peon;-->
<!--		}-->
<!--		/*-->
<!--		 * 搜索中的添加-->
<!--		 * */-->
<!--		const searchAddOne =(item:any)=> {-->
<!--			if (!item.isChecked) {-->
<!--				let obj = item;-->
<!--				obj.id = item.userId;-->
<!--				obj.type = 'user';-->
<!--				baseInfo.selectList.push(obj);-->
<!--				//去重-->
<!--				baseInfo.selectList = delSameArr(baseInfo.selectList, 'id');-->
<!--				//隐藏-->
<!--				baseInfo.showSearchResultList = false;-->
<!--				keyWord.value = '';-->
<!--			}-->
<!--			// //已选列表中的值-->
<!--			// const o = baseInfo.selectList.find((i) => i.id == item.userId);-->
<!--			// const oIndex = baseInfo.selectList.findIndex((i) => i.id == item.userId);-->
<!--			// //在下边的组织架构人员列表中用户-->
<!--			// const x = baseInfo.userList?.users?.find((i) => i.userId == item.userId);-->
<!--			// //删除-->
<!--			// if (item.isChecked) {-->
<!--			//     if(oIndex != -1){-->
<!--			//         baseInfo.selectList.splice(oIndex, 1);-->
<!--			//     }-->
<!--			//     if(x){x.isChecked = false;}-->
<!--			// }-->
<!--			// //添加-->
<!--			// else {-->
<!--			//     //单选就需要删除上一个选中的人-->
<!--			//     const m = baseInfo.searchResultList.find((i) => i.isChecked);-->
<!--			//     if (m) {-->
<!--			//         m.isChecked = false;-->
<!--			//     }-->
<!--			//     baseInfo.selectList.splice(oIndex, 1);-->
<!--			//     //在下边的组织架构人员列表中同步用户-->
<!--			//     if(x){x.isChecked = true;}-->
<!--			//-->
<!--			//     //构建数据格式添加到已选列表-->
<!--			//     let obj = item;-->
<!--			//     obj.id = item.userId;-->
<!--			//     obj.type = 'user';-->
<!--			//     baseInfo.selectList.push(obj);-->
<!--			//     //去重-->
<!--			//     baseInfo.selectList = this.delSameArr(baseInfo.selectList,'id');-->
<!--			// }-->
<!--			// item.isChecked = !item.isChecked;-->
<!--		}-->
<!--		/*-->
<!--		 * 单选的添加-->
<!--		 * */-->
<!--		const addOneUser =(item:any)=> {-->
<!--			//已选列表中的值-->
<!--			const o = baseInfo.selectList.find((i) => i.id == item.userId);-->
<!--			const oIndex = baseInfo.selectList.findIndex((i) => i.id == item.userId);-->
<!--			//在下边的组织架构人员列表中用户-->
<!--			const x = baseInfo.userList?.users?.find((i) => i.userId == item.userId);-->
<!--			//删除-->
<!--			if (item.isChecked) {-->
<!--				if (oIndex != -1) {-->
<!--					baseInfo.selectList.splice(oIndex, 1);-->
<!--				}-->
<!--				if (x) {-->
<!--					x.isChecked = false;-->
<!--				}-->
<!--			}-->
<!--			//添加-->
<!--			else {-->
<!--				//单选就需要删除上一个选中的人-->
<!--				const m = baseInfo.searchResultList.find((i) => i.isChecked);-->
<!--				if (m) {-->
<!--					m.isChecked = false;-->
<!--				}-->
<!--				baseInfo.selectList.splice(oIndex, 1);-->
<!--				//在下边的组织架构人员列表中同步用户-->
<!--				if (x) {-->
<!--					x.isChecked = true;-->
<!--				}-->

<!--				//构建数据格式添加到已选列表-->
<!--				let obj = item;-->
<!--				obj.id = item.userId;-->
<!--				obj.type = 'user';-->
<!--				baseInfo.selectList.push(obj);-->
<!--				//去重-->
<!--				baseInfo.selectList = delSameArr(baseInfo.selectList, 'id');-->
<!--			}-->
<!--			item.isChecked = !item.isChecked;-->
<!--		}-->
<!--		/*-->
<!--		 * 关闭弹层-->
<!--		 * */-->
<!--		const closeDialog =()=> {-->
<!--			//清空右侧数据-->
<!--			baseInfo.selectList = [];-->
<!--			//调用外部时间关闭弹层-->
<!--			$emit('close');-->
<!--		}-->
<!--		const  clearArr =(json1, json2, key) => {-->
<!--			let json = json1.concat(json2); //两个数组对象合并-->
<!--			let newJson = []; //盛放去重后数据的新数组-->
<!--			for (let item1 of json) {-->
<!--				//循环json数组对象的内容-->
<!--				let flag = true; //建立标记，判断数据是否重复，true为不重复-->
<!--				for (let item2 of newJson) {-->
<!--					//循环新数组的内容-->
<!--					if (item1.id == item2.id) {-->
<!--						//让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false-->
<!--						flag = false;-->
<!--					}-->
<!--				}-->
<!--				if (flag) {-->
<!--					//判断是否重复-->
<!--					newJson.push(item1); //不重复的放入新数组。  新数组的内容会继续进行上边的循环。-->
<!--				}-->
<!--			}-->
<!--			return newJson;-->
<!--		}-->
<!--</script>-->

<!--<script>-->
<!--export default {-->
<!--    name: 'DAChooseUser'-->
<!--}-->
<!--</script>-->

<!--<style lang="less">-->
<!--@import "./../style/index.less";-->
<!--</style>-->
