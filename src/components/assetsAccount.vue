<template>
	<div id="assetsAccount">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="$router.go(-1)"></i>

			<span>资产账户管理</span>
		</div>

		<!-- 账户 -->
		<div class="swipe">
			<van-swipe-cell v-for="(item, i) in assets" :key="i">
				<van-cell :border="false" :title="item.name" :value="item.balance"></van-cell>

				<template slot="right">
					<van-button square color="#ffac00" text="编辑" :to="'/assetsUpdate?id=' + item.id"></van-button>
					<van-button square type="danger" text="删除" @click="delId=item.id;alertBoxDisplay='block'"></van-button>
				</template>
			</van-swipe-cell>
		</div>

		<!-- 添加资产 -->
		<div class="submit" @click="jumpTo('/addAssetsAccount')">添加资产账户</div>


		<!-- 删除提示弹出框 -->
		<div class="logoutBox alertBox confirmBox" :style="{'display': alertBoxDisplay}" @click.self="closeAlertBox">
			<div class="logout alert">
				<h4>提示</h4>

				<p>您确定删除吗?</p>

				<div class="confirm">
					<span class="no" @click="closeAlertBox">取消</span>
					<span class="yes" @click="delAccount">确定</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import qs from 'qs'

	import { Notify, SwipeCell, Cell, Button } from 'vant'

	Vue.use(Notify).use(SwipeCell).use(Button).use(Cell)


	export default {
		name: 'assetsAccount',

		data() {
			return {
				assets: [],

				alertBoxDisplay: 'none',
				delId: '',
			}
		},

		methods: {
			jumpTo(link) {
				this.$router.push('/addAssetsAccount')
			},

			// 获取资产数据
			getAccounts() {
				axios
					.get('http://jizhang-api-dev.it266.com/api/account?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
					}))
					.then(res => {
						console.log(res.data)
						if (res.data.status) {
							this.assets = res.data.data
						}
					})
			},


			// 删除资产账户
			delAccount() {
				// console.log(this.delId)
				axios
					.get('http://jizhang-api-dev.it266.com/api/account/delete?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'id': this.delId,
					}))
					.then(res => {
						console.log(res.data)
						if (res.data.status) {
							Notify({ type: 'success', message: res.data.data })
							this.getAccounts()
							this.delId = ''
						}else {
							Notify({ type: 'warning', message: res.data.data })
						}
						this.closeAlertBox()
					})
			},

			// 关闭提示弹出框
			closeAlertBox() {
				this.alertBoxDisplay = 'none'
			},
		},

		created() {
			this.getAccounts()
		},

		filters: {
			accuracy(data) {
				return Number(data).toFixed(2)
			},
		},
	}
</script>

<style scoped>
	.menu .num{
		color: #fa2424;
	}
</style>