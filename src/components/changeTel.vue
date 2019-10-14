<template>
	<div id="changeTel">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="goBack"></i>
			<span>修改手机号</span>
		</div>


		<!-- 输入密码框 -->
		<div class="menus">
			<!-- 间隔 -->
			<div class="gap"></div>

			<!-- 提示 -->
			<p class="tip">为确保您的账号安全，请输入登录密码验证身份</p>

			<!-- 输入密码 -->
			<div class="menu">
				<input type="password" placeholder="请输入密码" v-model="pwd">
			</div>
		</div>


		<!-- 输入手机号框 -->
		<div class="menus">
			<!-- 间隔 -->
			<div class="gap"></div>

			<!-- 提示 -->
			<p class="tip">更换后，下次登录必须使用新手机号登录</p>

			<!-- 输入新手机号 -->
			<div class="menu">
				<input type="text" placeholder="请输入新手机号" v-model="newTel">
			</div>

			<!-- 输入短信验证码 -->
			<div class="menu vcode">
				<input type="text" placeholder="请输入短信验证码" v-model="vcode">

				<span @click="getVcode">获取验证码</span>
			</div>
		</div>

		<!-- 确认修改 -->
		<div class="submit" @click="changTelPost">确认修改</div>

		<!-- 图片验证码弹出框 -->
		<div class="pictureVcodeBox alertBox" :style="{'display': alertBoxDisplay}">
			<div class="pictureVcode alert">
				<div class="pictureVcodeContent">
					<p>请输入图片验证码</p>

					<!-- 验证码图片及输入框 -->
					<div>
						<img :src="vcodePictureSrc" class="vcodePicture"></img>
						<input type="text" class="vcodeInput" v-model="pictureVcode" maxlength="4">
					</div>

					<!-- 确定按钮 -->
					<div class="submit" @click="postPictureVcode">确定</div>
				</div>

				<i class="iconfont icon-guanbi" @click="closePictureVcodeBox"></i>
			</div>
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
		name: 'changeTel',

		data() {
			return {
				alertBoxDisplay: 'none', // 图形验证码外框display
				vcodePictureSrc: null, // 图形验证码图片url
				pictureVcode: null, // 图形验证码
				pictureVcodeKey: null, // 图形验证码key

				pwd: '',
				newTel: '',
				vcode: '',
			}
		},

		methods: {
			goBack() {
				this.$router.go(-1)
			},

			// 获取验证码
			getVcode() {
				// 获取图形验证码
				axios
					.get('http://jizhang-api-dev.it266.com/api/captcha')
					.then(res => {
						// console.log(res.data.data)
						this.alertBoxDisplay = 'block'
						this.vcodePictureSrc = res.data.data.url
						this.pictureVcodeKey = res.data.data.key
					})
			},

			// 上传图形验证码并获取短信验证码
			postPictureVcode() {
				axios
					.post('http://jizhang-api-dev.it266.com/api/sms/verify?' + qs.stringify({
						'mobile': this.newTel,
						'captcha_code': this.pictureVcode,
						'captcha_key': this.pictureVcodeKey,
					}))
					.then(res => {
						// console.log(res)
						this.closePictureVcodeBox()
						if (res.data.status) {
							Notify({ type: 'success', message: '短信验证码：' + res.data.data.substr(-5, 4) })
						} else {
							if (res.data.code == "-1") {
								Notify({ type: 'warning', message: res.data.data })
							} else if (res.data.code == "INVALID_CAPTCHA") {
								Notify({ type: 'warning', message: '图形验证码不正确' })
							}
						}
					})
			},

			// 确认修改提交
			changTelPost() {
				axios
					.post('http://jizhang-api-dev.it266.com/api/user/register?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'password': this.pwd,
						'mobile': this.newTel,
						'verify': this.vcode,
					}))
					.then(res => {
						console.log(res)
						if (res.data.status) {
							Notify({
								message: '手机号修改成功',
								color: '#00f',
							})
							localStorage.setItem('cashBookToken', res.data.data.token)
							this.$router.go(-1)
						} else {
							Notify({
								message: res.data.data,
								color: '#ad0000',
							})
						}
					})
			},

			// 关闭图形验证码弹出框
			closePictureVcodeBox() {
				this.alertBoxDisplay = 'none'
				this.pictureVcode = null
			},

		}
	}
</script>

<style scoped>
	.menu.vcode span{
		background-color: #F5F5F5;
	}
</style>