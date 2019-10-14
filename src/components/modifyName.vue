<template>
	<div id="modifyName">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="goBack"></i>
			<span>修改昵称</span>
		</div>

		<!-- 修改昵称输入框 -->
		<div class="menus">
			<!-- 提示 -->
			<p class="tip">请输入新的昵称</p>

			<!-- 输入框 -->
			<div class="menu">
				<input type="text" v-model="name">
			</div>
		</div>

		<!-- 确认修改 -->
		<div class="submit" @click="modifyNamePost">确认修改</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import qs from 'qs'

	import { Notify } from 'vant'
	Vue.use(Notify)


	export default {
		name: 'modifyName',

		data() {
			return {
				name: '',
			}
		},

		methods: {
			goBack() {
				this.$router.go(-1)
			},

			modifyNamePost() {
				axios
					.post('http://jizhang-api-dev.it266.com/api/user/profile/update?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'nickname': this.name,
					}))
					.then(res => {
						if (res.data.status) {
							Notify({ type: 'success', message: res.data.data })
						}else {
							Notify({ type: 'warning', message: res.data.data })
						}
					})
			},
		}
	}
</script>