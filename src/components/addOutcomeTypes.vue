<template>
	<div id="addIncomeTypes">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="$router.go(-1)"></i>

			<span>添加支出类别</span>
		</div>

		<!-- 输入框 -->
		<div class="menus">
			<p class="tip">支出类别名称</p>

			<div class="menu">
				<span>支出类别名称</span>

				<input type="text" placeholder="请输入支出类别名称" v-model="newType">
			</div>
		</div>

		<!-- 保存 -->
		<div class="submit" @click="postNewType">保存</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import qs from 'qs'

	import { Notify } from 'vant'
	Vue.use(Notify)



	export default {
		name: 'addIncomeTypes',

		data() {
			return {
				newType: '',
			}
		},

		methods: {
			// 上传新收支类型
			postNewType() {
				axios
					.post('http://jizhang-api-dev.it266.com/api/category/create?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'parent_id': 0,
						'type': 2,
						'name': this.newType,
						'sort': 0,
					}))
					.then(res => {
						if (res.data.status) {
							Notify({ type: 'success', message: '添加成功' })
							this.$router.go(-1)
						}else {
							Notify({ type: 'warning', message: res.data.data })
						}
					})
			},
		}
	}
</script>