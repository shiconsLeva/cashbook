<template>
	<div id="addAccount">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="goBack"></i>
			<span>添加新账簿</span>
		</div>

		<div class="menus">
			<p class="tip">请输入账簿名称</p>

			<div class="menu">
				<span>账户名称</span>
				<input type="text" placeholder="请输入账簿名称" v-model="accountName">
			</div>
		</div>

		<div class="submit" @click="addAccountPost">保存</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import qs from 'qs'

	import { Notify } from 'vant'
	Vue.use(Notify)




	export default {
		data() {
			return {
				accountName: ''
			}
		},

		methods: {
			goBack() {
				this.$router.go(-1)
			},

			// 创建账簿
			addAccountPost() {
				axios
					.post('http://jizhang-api-dev.it266.com/api/book/create?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'name': this.accountName,
					}))
					.then(res => {
						if (res.data.status) {
							Notify({ type: 'success', message: '添加成功' })
							this.goBack()
						}else {
							Notify({ type: 'warning', message: res.data.data })
						}
					})
			}
		}
	}
</script>