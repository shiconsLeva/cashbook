<template>
	<div id="resetPwd">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="goBack"></i>
			<span>重置密码</span>
		</div>

		<!-- 输入表单 -->
		<form class="form menus">
			<!-- 手机号 -->
			<div class="menu">
				<input type="text" placeholder="请输入手机号" v-model="tel" maxlength="11">
			</div>

			<!-- 短信验证码 -->
			<div class="menu vcode">
				<input type="text" placeholder="请输入短信验证码" v-model="vcode">
				<span @click="getVcode">获取验证码</span>
			</div>

			<!-- 密码 -->
			<div class="menu">
				<input type="password" placeholder="请输入密码" v-model="pwd">
			</div>
		</form>

		<!-- 确认提交 -->
		<div class="submit" @click="resetPwdPost">提交</div>

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

				<i class="iconfont icon-guanbi" @click="closeAlertBox"></i>
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
		name: 'resetPwd',

		data() {
			return{
				alertBoxDisplay: 'none', // 图形验证码外框display
				vcodePictureSrc: null, // 图形验证码图片url
				pictureVcode: null, // 图形验证码
				pictureVcodeKey: null, // 图形验证码key

				tel: null, // 手机号
				vcode: null, // 短信验证码
				pwd: null, // 密码
			}
		},

		methods: {
			// 跳转上级页面
			goBack() {
				this.$router.go(-1)
			},

			// 获取验证码
			getVcode() {
				// 获取图形验证码
				axios
					.get('http://jizhang-api-dev.it266.com/api/captcha')
					.then(res => {
						console.log(res.data.data)
						this.alertBoxDisplay = 'block'
						this.vcodePictureSrc = res.data.data.url
						this.pictureVcodeKey = res.data.data.key
					})
			},

			// 上传图形验证码并获取短信验证码
			postPictureVcode() {
				axios
					.post('http://jizhang-api-dev.it266.com/api/sms/verify?' + qs.stringify({
						'mobile': this.tel,
						'captcha_code': this.pictureVcode,
						'captcha_key': this.pictureVcodeKey,
					}))
					.then(res => {
						// console.log(res)
						this.closeAlertBox()
						if (res.data.status) {
							Notify({ type: 'success', message: '短信验证码：' + res.data.data.substr(-5, 4) })
						} else {
							if (res.data.code == "-1") {
								Notify({ type: 'warning', message: res.data.data })
							}
							if (res.data.code == "INVALID_CAPTCHA") {
								Notify({ type: 'warning', message: '图形验证码不正确' })
							}
						}
					})
			},

			// 重置密码提交
			resetPwdPost() {
				axios
					.post('http://jizhang-api-dev.it266.com/api/user/token/sms?' + qs.stringify({
						'mobile': this.tel,
						'verify': this.vcode,
						'password': this.pwd,
					}))
					.then(res => {
						// console.log(res)
						if (res.data.status) {
							Notify({ type: 'success', message: '密码修改成功' })
							this.$router.push("/")
						} else {
							Notify({ type: 'warning', message: res.data.data })
						}
					})
			},

			// 关闭图形验证码弹出框
			closeAlertBox() {
				this.alertBoxDisplay = 'none'
				this.pictureVcode = null
			},
		},
	}
</script>