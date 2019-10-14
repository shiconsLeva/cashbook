<template>
	<div id="incometypes">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="$router.go(-1)"></i>

			<span>收入类别管理</span>
		</div>

		<!-- 收入类别列表 -->
		<div class="swipe">
			<van-swipe-cell v-for="(item, i) in incomeTypes" :key="i">
				<van-cell :border="false" :title="item.name"></van-cell>

				<template slot="right">
					<van-button square color="#ffac00" text="编辑" :to="'/incomeUpdate?id=' + item.id + '&name=' + item.name"></van-button>
					<van-button square type="danger" text="删除" @click="delId=item.id;alertBoxDisplay='block'"></van-button>
				</template>
			</van-swipe-cell>
		</div>

		<!-- 添加收入类别 -->
		<div class="submit" @click="$router.push('/addIncomeTypes')">添加收入类别</div>


		<!-- 删除提示弹出框 -->
		<div class="alertBox confirmBox" :style="{'display': alertBoxDisplay}" @click.self="closeAlertBox">
			<div class="alert">
				<h4>提示</h4>

				<p>您确定删除吗?</p>

				<div class="confirm">
					<span class="no" @click="closeAlertBox">取消</span>
					<span class="yes" @click="delType">确定</span>
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
		name: 'incomeTypes',

		data() {
			return {
				incomeTypes: [],

				alertBoxDisplay: 'none',
				delId: '',
			}
		},

		methods: {
			// 获取收入类别
			getTypes() {
				axios
				.get('http://jizhang-api-dev.it266.com/api/category?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'type': 1,
						'dataType': 1,
					}))
					.then(res => {
						console.log(res.data.data)
						this.incomeTypes = res.data.data
					})
			},

			// 删除资产账户
			delType() {
				// console.log(this.delId)
				axios
					.get('http://jizhang-api-dev.it266.com/api/category/delete?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'id': this.delId,
					}))
					.then(res => {
						console.log(res.data)
						if (res.data.status) {
							Notify({ type: 'success', message: res.data.data })
							this.getTypes()
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
			this.getTypes()
		}
	}
</script>