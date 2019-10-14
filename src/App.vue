<template>
	<div id="app" ref="app">
		<!-- <img src="./assets/logo.png"> -->
		<!-- 顶部栏 -->
		<router-view name="top">{{ userInfo.nickname }}</router-view>

		<router-view>
			<span class="name" slot="name">{{ userInfo.nickname }}</span>
			<span class="tel" slot="tel">{{ userInfo.mobile }}</span>
		</router-view>

		<router-view name="foot"></router-view> <!-- 底部栏 -->
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import qs from 'qs'
	import { Notify, Uploader } from 'vant'

	Vue.use(Notify).use(Uploader)


	export default {
		name: 'App',

		data() {
			return{
				userInfo: [],
			}
		},


		created() {
			// 获取用户信息
			axios
				.get('http://jizhang-api-dev.it266.com/api/user/profile?' + qs.stringify({
					'token': localStorage.getItem('cashBookToken')
				}))
				.then(res => {
					if (res.data.status) {
						// console.log(res.data.data)
						this.userInfo = res.data.data
					}else {
						Notify({ type: 'warning', message: res.data.data })
					}
				})
		}
	}
</script>

<style>
	@import url('http://at.alicdn.com/t/font_1417446_fv20bskpc4u.css');
	@import url('components/public.css');
	@import url('index.css');
</style>
