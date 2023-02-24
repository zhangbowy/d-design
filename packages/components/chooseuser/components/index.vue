<template>
	<a-modal
		:visible="visible"
		wrapClassName="choose-user-dialog"
		:destroyOnClose="true"
		:title="title"
		width="720px"
		centered
		:footer="null"
		:zIndex="zIndex"
		@cancel="closeDialog">
		<div class="choose-user-wrapper">
			<div class="choose-user-left">
				<!-- 多选展示部门 -->
				<template v-if="this.multiSelect">
					<div class="input-box">
						<input
							type="text"
							v-model="keyWord"
							class=""
							placeholder="搜索同事"
							@compositionstart="compositionstart"
							@compositionend="compositionend"
							@clear="cancelSearchShow"
							@keyup="throttle" />
						<span
							class="iconfont qzz_icon_fill_chacha"
							v-if="this.keyWord"
							@click="cancelSearchShow"></span>
					</div>
					<div
						class="search-result"
						v-if="this.showSearchResultList && this.keyWord">
						<ul v-if="this.searchResultList.length > 0">
							<li
								class="user-type"
								:class="{'user-type-bg': item.isChecked}"
								v-for="item in searchResultList"
								:key="item"
								@click="searchAddOne(item)">
								<img
									class="choose-avatar-img"
									v-if="item.avatar"
									:src="item.avatar"
									alt="" />
								<span class="choose-avatar-text" v-else>{{
									item.name?.slice(0, 1)
								}}</span>
								<span class="name"
									>{{ item.name
									}}<span v-if="item.roster">({{ item.roster }})</span></span
								>
							</li>
						</ul>
						<div v-else class="search-result-empty">暂未搜索到相关人员</div>
					</div>
					<div class="choose-user-deps">
						<div class="choose-user-breadcrumb">
							<span
								class="breadcrumb-item breadcrumb-item-active"
								:class="{'breadcrumb-item-first': index == 0}"
								v-for="(item, index) in breadCrumbList"
								:key="item"
								@click="updateBreadCrumb(item)">
								<span class="breadcrumb-item-inner">{{ item.name }}</span>
								<span class="breadcrumb-item-separator">/</span>
							</span>
						</div>
					</div>
					<div class="choose-user-cont">
						<template v-if="this.showCheckbox">
							<div
								class="select-all"
								@click="selectAll"
								v-if="
									this.userList?.depts?.length > 0 ||
									this.userList?.users?.length > 0
								">
								<span
									v-if="!isSelectAll"
									class="iconfont qzz_icon_checkbox-weixuan"></span>
								<span
									v-if="isSelectAll"
									class="iconfont qzz_icon_checkbox-checked"></span>
								<span class="text">全选</span>
							</div>
						</template>
						<!-- v-loading="loading" -->
						<ul
							class="choose-user-list"
							v-if="
								this.userList?.depts?.length > 0 ||
								this.userList?.users?.length > 0
							">
							<li
								class="dep-type"
								:class="{'dep-type-selected': i.isChecked}"
								v-for="i in userList.depts"
								:key="i"
								@click="selectOne(i, 'dept')">
								<template v-if="this.showCheckbox">
									<span
										v-if="!i.isChecked"
										class="checkbox iconfont qzz_icon_checkbox-weixuan"></span>
									<span
										v-if="i.isChecked"
										class="checkbox iconfont qzz_icon_checkbox-checked"></span>
								</template>
								<span class="name" :title="i.name"
									>{{ formatText(i.name) }}（{{ i.cnt }}人）</span
								>
								<span class="expand-btn" @click.stop="expandNext(i)">
									<span class="text">下一级</span>
									<span class="iconfont qzz_icon_fill_right"></span>
								</span>
							</li>
							<li
								class="user-type"
								v-for="o in userList.users"
								:key="o"
								@click="selectOne(o, 'user')">
								<span
									v-if="!o.isChecked"
									class="checkbox iconfont qzz_icon_checkbox-weixuan"></span>
								<span
									v-if="o.isChecked"
									class="checkbox iconfont qzz_icon_checkbox-checked"></span>
								<img
									class="choose-avatar-img"
									v-if="o.avatar"
									:src="o.avatar"
									alt="" />
								<span class="choose-avatar-text" v-else>{{
									o.name?.slice(0, 1)
								}}</span>
								<span class="name"
									>{{ o.name
									}}<span v-if="o.roster">({{ o.roster }})</span></span
								>
							</li>
						</ul>
						<a-empty v-else description="该部门暂无员工"></a-empty>
					</div>
				</template>
				<!-- 单选只展示搜索框 -->
				<template v-else>
					<div class="input-box">
						<input
							type="text"
							v-model="keyWord"
							class=""
							placeholder="搜索同事"
							@compositionstart="compositionstart"
							@compositionend="compositionend"
							@clear="cancelSearchShow"
							@keyup="throttle" />
						<span
							class="iconfont icon-guanbi"
							v-if="this.keyWord"
							@click="this.keyWord = ''"></span>
					</div>
					<div
						class="search-result search-result-static"
						v-if="this.showSearchResultList">
						<ul v-if="this.searchResultList.length > 0">
							<li
								class="user-type"
								:class="{'user-type-bg': item.isChecked}"
								v-for="item in searchResultList"
								:key="item"
								@click="addOneUser(item)">
								<img
									class="choose-avatar-img"
									v-if="item.avatar"
									:src="item.avatar"
									alt="" />
								<span class="choose-avatar-text" v-else>{{
									item.name?.slice(0, 1)
								}}</span>
								<span class="name"
									>{{ item.name
									}}<span v-if="item.roster">({{ item.roster }})</span></span
								>
							</li>
						</ul>
						<a-empty v-else description="暂无数据"></a-empty>
					</div>
				</template>
			</div>
			<div class="choose-user-right">
				<div class="choose-user-selected">
					<template v-for="k in selectList" :key="k.id">
						<span class="selected-box">
							<span class="text">
								{{ k.name
								}}<template v-if="k.type == 'dept'">({{ k.cnt }})</template>
							</span>
							<span
								class="iconfont qzz_icon_line_close"
								@click="delSelected(k)"></span>
						</span>
					</template>
				</div>
				<div class="choose-user-btns">
					<span class="common-btn cancel-btn" @click="closeDialog">取消</span>
					<span
						class="common-btn sure-btn"
						v-if="selectList.length > 0"
						@click="saveUsers"
						>确定</span
					>
					<span class="common-btn sure-btn disabled-btn" v-else>确定</span>
				</div>
			</div>
		</div>
	</a-modal>
</template>
<!--/*-->
<!--* 组件配置:{-->
<!--*  visible:true/false        //是否可见      默认false-->
<!--   searchAllZone:true/false  //搜索全部空间   默认false-->
<!--*  filterSelf:true/false      //是否过滤掉自己 默认true-->
<!--*  showDeft:true/false       //是否展示部门，如果不展示只显示用户,赞不支持，下一版本优化-->
<!--*  multiSelect:true/false    //是否可多选 默认多选-->
<!--*  updateUserIds:funciton(userIds){} //事件回调 返回已选中的部门或者用户转化成最终的userIds-->
<!--*-->
<!--* */-->
<script>
import {
	SEARCH_USER,
	SEARCH_ZONE_USER,
	GET_DEPT_INFO,
	GET_USERIDS,
} from '../api';
import {getQueryVariable} from '@/utils/utils';
let G_CORPID = getQueryVariable('corpId');
let G_APPID = getQueryVariable('appId');
let IS_INPUT_CH = false;
let G_TIME = null;
export default {
	name: 'ChooseUser',
	emits: ['updateUserIds', 'close'],
	props: {
		visible: {
			type: Boolean,
			required: true,
		},
		zIndex: {
			type: Number,
			default: 1000,
		},
		filterSelf: {
			type: Boolean,
			default: false,
		},
		searchAllZone: {
			type: Boolean,
			default: false,
		},
		multiSelect: {
			type: Boolean,
			default: true,
		},
		showCheckbox: {
			type: Boolean,
			default: true,
		},
		title: {
			type: String,
			default: '请选择人员',
		},
		selectedUsers: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			keyWord: '',
			deptName: '', //1级部门名称
			userList: [], //左侧部门人员列表
			searchResultList: [], //输入框搜索人员结果列表
			showSearchResultList: false, //是否展示搜索结果
			selectList: [], //右侧已选部门人员列表
			isSelectAll: false, //是否都被选中
			breadCrumbList: [],
			loading: false,
		};
	},
	mounted() {
		this.getDeptOrUsers();
	},
	methods: {
		getFirst(str) {
			return getFirstStr(str);
		},
		returnImgUrl(originalImgUrl, size) {
			return originalImgUrl + size;
		},
		formatText(str) {
			let formatS = '';
			if (str.length > 10) {
				formatS = str.substr(0, 8) + '...';
			} else {
				formatS = str;
			}
			return formatS;
		},
		/*
		 * 搜索部门或者用户
		 * */
		getDeptOrUsers() {
			if (this.multiSelect) {
				this.getDeptInfo('1');
			} else {
				this.queryUser();
			}
			// 将selectUsers赋值给selectList
			this.selectedUsers.forEach((user) => {
				const obj = {
					...user,
					type: 'user',
					isChecked: true,
					id: user.userId,
				};
				this.selectList.push(obj);
			});
		},
		/*
		 * 获取部门信息
		 * params:{
		 *    tpf:1,
		 *    appId:appId,
		 *    corpId:corpId,
		 *    deptId:deptId //部门id， 根目录传1
		 *    loginUserId:loginUserId //登录用户id
		 * }
		 * */
		getDeptInfo(deptId) {
			const params = {
				tpf: 1,
				appId: G_APPID,
				corpId: G_CORPID,
				deptId: deptId,
			};
			GET_DEPT_INFO(params)
				.then((res) => {
					if (res.code == 1) {
						//重置全选状态
						this.isSelectAll = false;
						//渲染数据 过滤掉自己
						if (this.filterSelf) {
							let oData = res.data;
							let selfId = JSON.parse(localStorage.getItem('OKR_DATA'))?.user
								.userId;
							let newUsers = oData.users.filter(
								(item) => item.userId != selfId
							);
							oData.users = newUsers;
							this.userList = oData;
						} else {
							this.userList = res.data;
						}
						//渲染面包屑
						if (deptId == 1) {
							this.deptName = res.data.name;
							this.breadCrumbList[0] = {
								name: res.data.name,
								deptId: deptId,
							};
						}
					}
				})
				.catch((error) => {
					console.log('error', error);
				});
		},
		/*
		 * 节流
		 * */
		throttle() {
			if (IS_INPUT_CH) return;
			if (G_TIME) {
				clearTimeout(G_TIME);
			}
			G_TIME = setTimeout(() => {
				this.queryUser();
			}, 300);
		},
		/*
		 * 搜索用户
		 * */
		queryUser() {
			this.loading = true;
			//根据配置决定用哪个接口请求
			let SEARCH = null;
			if (this.searchAllZone) {
				SEARCH = SEARCH_ZONE_USER;
			} else {
				SEARCH = SEARCH_USER;
			}
			SEARCH({
				tpf: 1,
				appId: G_APPID,
				corpId: G_CORPID,
				curPage: 1,
				pageSize: 50,
				code: localStorage.getItem('DINGDING_CODE'),
				fuzzyName: this.keyWord,
				dataSourceType: 0, // 0 表示走数据库 1表示走ES
			})
				.then((res) => {
					this.loading = false;
					if (res.code == 1) {
						let data = res.data;
						this.showSearchResultList = true;
						//过滤自己
						if (this.filterSelf) {
							const selfId = JSON.parse(localStorage.getItem('OKR_DATA'))?.user
								.userId;
							this.searchResultList = data.resultList.filter(
								(item) => item.userId != selfId
							);
						} else {
							this.searchResultList = data.resultList;
						}
					}
				})
				.catch((error) => {
					console.log('error', error);
				});
		},
		/*
		 * 取消搜索的展示
		 * */
		cancelSearchShow() {
			//清空内容
			this.keyWord = '';
			//多选就隐藏弹层，单选就重新请求数据
			if (this.multiSelect) {
				this.showSearchResultList = false;
			} else {
				this.queryUser();
			}
		},
		compositionstart() {
			IS_INPUT_CH = true;
		},
		compositionend() {
			IS_INPUT_CH = false;
		},
		/*
		 * 全选
		 * */
		selectAll() {
			//如果是全选就取消
			if (this.isSelectAll) {
				this.userList?.depts.forEach((i) => {
					i.isChecked = false;
				});
				this.userList?.users.forEach((i) => {
					i.isChecked = false;
				});
			}
			//否则全选
			else {
				this.userList?.depts.forEach((i) => {
					i.isChecked = true;
				});
				this.userList?.users.forEach((i) => {
					i.isChecked = true;
				});
			}
			//切换全选状态
			this.isSelectAll = !this.isSelectAll;
			//同步渲染状态
			this.renderSelected();
		},
		/*
		 * 单选切换状态
		 * */
		selectOne(item, type) {
			if (!this.showCheckbox && type == 'dept') {
				return;
			}
			item.isChecked = !item.isChecked;
			//判断全选状态
			this.checkSelectAllStatus();
			//渲染单个选中/反选
			this.renderOneSelected(item, type);
		},
		/*
		 * 渲染选中/反选
		 * */
		renderOneSelected(item, type) {
			//删除
			if (!item.isChecked) {
				const oIndex = this.selectList.findIndex((k) => k.id == item.id);
				if (oIndex != -1) {
					this.selectList.splice(oIndex, 1);
				}
			}
			//添加
			else {
				let obj = item;
				if (type == 'dept') {
					obj.id = item.deptId;
					obj.type = 'dept';
				} else if (type == 'user') {
					obj.id = item.userId;
					obj.type = 'user';
				}
				this.selectList.push(obj);
				//去重
				this.selectList = this.delSameArr(this.selectList, 'id');
			}
		},
		/*
		 * 同步渲染状态
		 * */
		renderSelected() {
			let arr = [];
			this.userList?.depts.forEach((i) => {
				//同步添加
				if (i.isChecked) {
					let obj = {};
					obj.type = 'dept';
					obj.name = i.name;
					obj.cnt = i.cnt;
					obj.deptId = i.deptId;
					obj.id = i.deptId; //只用来去重
					arr.push(obj);
				}
				//同步删除
				else {
					let dIdx = this.selectList.findIndex((k) => i.deptId == k.deptId);
					if (dIdx != -1) {
						this.selectList.splice(dIdx, 1);
					}
				}
			});
			this.userList?.users.forEach((i) => {
				//同步添加
				if (i.isChecked) {
					let obj = {};
					obj.type = 'user';
					obj.name = i.name;
					obj.userId = i.userId;
					obj.id = i.userId; //只用来去重
					arr.push(obj);
				}
				//同步删除
				else {
					let uIdx = this.selectList.findIndex((k) => i.deptId == k.deptId);
					if (uIdx != -1) {
						this.selectList.splice(uIdx, 1);
					}
				}
			});
			//赋值
			this.selectList = this.selectList.concat(arr);
			//去重
			this.selectList = this.delSameArr(this.selectList, 'id');
		},
		/*
		 * 判断全选选中还是取消选中
		 * */
		checkSelectAllStatus() {
			//部门
			let dNoChexkIndex = this.userList?.depts?.findIndex((i) => !i.isChecked); //未选中
			//人员
			let uNoCheckIndex = this.userList?.users?.findIndex((i) => !i.isChecked); //未选中
			//部门和人员都选中了才是全选
			if (dNoChexkIndex == -1 && uNoCheckIndex == -1) {
				this.isSelectAll = true;
			} else {
				this.isSelectAll = false;
			}
		},
		/*
		 * 展开下级
		 * */
		expandNext(item) {
			//如果全选了 就不能点开下级
			if (item.isChecked) {
				return;
			}
			//获取子部门数据
			let deptId = item.deptId;
			this.getDeptInfo(deptId);
			//渲染面包屑
			this.breadCrumbList.push(item);
		},
		/*
		 * 删除选中
		 * */
		delSelected(item) {
			/***************************组织列表中的数据切换**********************************/
			if (item.type == 'dept') {
				let o = this.userList?.depts?.find((i) => item.deptId == i.deptId);
				if (o) {
					//取消左侧选中
					o.isChecked = false;
				}
				//渲染列表中删除
				let sIndex = this.selectList.findIndex((i) => item.deptId == i.deptId);
				if (sIndex != -1) {
					this.selectList.splice(sIndex, 1);
				}
			}
			if (item.type == 'user') {
				let m = this.userList?.users?.find((i) => item.userId == i.userId);
				if (m) {
					//取消左侧选中
					m.isChecked = false;
				}
				//渲染列表中删除
				let dIndex = this.selectList.findIndex((i) => item.userId == i.userId);
				if (dIndex != -1) {
					this.selectList.splice(dIndex, 1);
				}
			}
			/***************************搜索列表中的数据切换**********************************/
			const kItem = this.searchResultList.find((i) => item.userId == i.userId);
			if (kItem) {
				kItem.isChecked = false;
			}
			//判断全选选中状态
			this.checkSelectAllStatus();
		},
		/*
		 * 保存人员请求接口把部门id和人员id都换算成人员id
		 * */
		saveUsers() {
			//换算成deptIds和userIds
			let deptIds = [];
			let userIds = [];
			this.selectList.forEach((i) => {
				if (i.type == 'dept') {
					deptIds.push(i.deptId);
				} else if (i.type == 'user') {
					userIds.push(i.userId);
				}
			});
			//发送请求
			GET_USERIDS({
				tpf: 1,
				appId: G_APPID,
				corpId: G_CORPID,
				deptIds: deptIds + '', //解决数组传参问题
				userIds: userIds + '', //解决数组传参问题
			})
				.then((res) => {
					if (res.code == 1) {
						let users = [];
						if (this.filterSelf) {
							const selfId = JSON.parse(localStorage.getItem('OKR_DATA'))?.user
								.userId;
							users = res.data?.userIds.filter((item) => item.userId != selfId);
						} else {
							users = res.data?.userIds;
						}
						this.$emit('updateUserIds', users);
						//清空已选
						this.selectList = [];
					}
				})
				.catch((error) => {
					console.log('error', error);
				});
		},
		/*
		 *  更新面包屑展示并重新渲染左侧数据
		 * */
		updateBreadCrumb(item) {
			let oIndex = this.breadCrumbList.findIndex(
				(i) => i.deptId == item.deptId
			);
			let arr = [];
			this.breadCrumbList.forEach((i, index) => {
				if (index <= oIndex) {
					arr.push(this.breadCrumbList[index]);
				}
			});
			this.breadCrumbList = arr;
			//重新渲染左侧数据
			this.getDeptInfo(item.deptId);
		},
		/*
		 * 删除对象数组中重复的项
		 * objList:对象数组类似:[{"id":"121212","userId":"feef98812"}]
		 * key:去要去重的key例如上边的""
		 * */
		delSameArr(data, key) {
			let obj = {};
			let peon = data.reduce((cur, next) => {
				obj[next[key]] ? '' : (obj[next[key]] = true && cur.push(next));
				return cur;
			}, []);
			return peon;
		},
		/*
		 * 搜索中的添加
		 * */
		searchAddOne(item) {
			if (!item.isChecked) {
				let obj = item;
				obj.id = item.userId;
				obj.type = 'user';
				this.selectList.push(obj);
				//去重
				this.selectList = this.delSameArr(this.selectList, 'id');
				//隐藏
				this.showSearchResultList = false;
				this.keyWord = '';
			}
			// //已选列表中的值
			// const o = this.selectList.find((i) => i.id == item.userId);
			// const oIndex = this.selectList.findIndex((i) => i.id == item.userId);
			// //在下边的组织架构人员列表中用户
			// const x = this.userList?.users?.find((i) => i.userId == item.userId);
			// //删除
			// if (item.isChecked) {
			//     if(oIndex != -1){
			//         this.selectList.splice(oIndex, 1);
			//     }
			//     if(x){x.isChecked = false;}
			// }
			// //添加
			// else {
			//     //单选就需要删除上一个选中的人
			//     const m = this.searchResultList.find((i) => i.isChecked);
			//     if (m) {
			//         m.isChecked = false;
			//     }
			//     this.selectList.splice(oIndex, 1);
			//     //在下边的组织架构人员列表中同步用户
			//     if(x){x.isChecked = true;}
			//
			//     //构建数据格式添加到已选列表
			//     let obj = item;
			//     obj.id = item.userId;
			//     obj.type = 'user';
			//     this.selectList.push(obj);
			//     //去重
			//     this.selectList = this.delSameArr(this.selectList,'id');
			// }
			// item.isChecked = !item.isChecked;
		},
		/*
		 * 单选的添加
		 * */
		addOneUser(item) {
			//已选列表中的值
			const o = this.selectList.find((i) => i.id == item.userId);
			const oIndex = this.selectList.findIndex((i) => i.id == item.userId);
			//在下边的组织架构人员列表中用户
			const x = this.userList?.users?.find((i) => i.userId == item.userId);
			//删除
			if (item.isChecked) {
				if (oIndex != -1) {
					this.selectList.splice(oIndex, 1);
				}
				if (x) {
					x.isChecked = false;
				}
			}
			//添加
			else {
				//单选就需要删除上一个选中的人
				const m = this.searchResultList.find((i) => i.isChecked);
				if (m) {
					m.isChecked = false;
				}
				this.selectList.splice(oIndex, 1);
				//在下边的组织架构人员列表中同步用户
				if (x) {
					x.isChecked = true;
				}

				//构建数据格式添加到已选列表
				let obj = item;
				obj.id = item.userId;
				obj.type = 'user';
				this.selectList.push(obj);
				//去重
				this.selectList = this.delSameArr(this.selectList, 'id');
			}
			item.isChecked = !item.isChecked;
		},
		/*
		 * 关闭弹层
		 * */
		closeDialog() {
			//清空右侧数据
			this.selectList = [];
			//调用外部时间关闭弹层
			this.$emit('close');
		},
		clearArr(json1, json2, key) {
			let json = json1.concat(json2); //两个数组对象合并
			let newJson = []; //盛放去重后数据的新数组
			for (let item1 of json) {
				//循环json数组对象的内容
				let flag = true; //建立标记，判断数据是否重复，true为不重复
				for (let item2 of newJson) {
					//循环新数组的内容
					if (item1.id == item2.id) {
						//让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
						flag = false;
					}
				}
				if (flag) {
					//判断是否重复
					newJson.push(item1); //不重复的放入新数组。  新数组的内容会继续进行上边的循环。
				}
			}
			return newJson;
		},
	},
};
</script>
<style lang="less">
@import './../style/index.less';
</style>
