<template>
	<div id="login">
		<div class="head">
			<!-- <i class="iconfont icon-zuojiantou"></i> -->
			<span>登录</span>
		</div>

		<img src="../assets/login_logo.png">

		<!-- 输入表单 -->
		<form class="form menus">
			<!-- 手机号 -->
			<div class="menu">
				<input type="text" placeholder="请输入手机号" v-model="tel" maxlength="11">
			</div>

			<!-- 密码 -->
			<div class="menu">
				<input type="password" placeholder="请输入密码" v-model="pwd">
			</div>
		</form>

		<!-- 登录提交 -->
		<div class="submit" @click="loginPost">登录</div>

		<div class="foot">
			<router-link class="resetPwd" to="/resetPwd">忘记密码?</router-link>
			<router-link class="registerLink" to="/register">新用户注册</router-link>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import qs from 'qs'

	import { Notify } from 'vant'
	Vue.use(Notify)


	export default {
		name: 'login',

		data() {
			return {
				tel: null, // 手机号
				pwd: null, // 密码
			}
		},

		methods: {
			// 登录提交
			loginPost() {
				axios
					.post("http://jizhang-api-dev.it266.com/api/user/token/mobile?" + qs.stringify({
						'mobile': this.tel,
						'password': this.pwd,
					}))
					.then(res => {
						if (res.data.status) {
							Notify({ type: 'success', message: '登录成功' })
							// 获取并保存token
							localStorage.setItem('cashBookToken', res.data.data.token)
							this.$router.push("/accountBook")
						} else {
							Notify({ type: 'warning', message: res.data.data })
						}
					})
			}
		},
	}
</script>

<style scoped>
	/*应用图标*/
	img{
		display: block;
		width: 72px;
		height: 72px;
		margin: auto;
		margin-top: 30px;
	}


	/*foot*/
	.foot{
		display: flex;
		width: 94%;
		justify-content: space-between;
		margin: auto;
		margin-top: 16px;
	}

	.foot a{
		color: #217ec8;
	}
</style>