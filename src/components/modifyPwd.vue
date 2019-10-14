<template>
	<div id="modifyPwd">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="goBack"></i>
			<span>修改密码</span>
		</div>

		<!-- 输入框 -->
		<div class="menus">
			<div class="menu" v-for="(item, i) in menus" :key="i">
				<input type="password" :placeholder="item.placeholder" v-model="item.pwd">
			</div>
		</div>

		<!-- 确认修改 -->
		<div class="submit" @click="modifyPwdPost">确认修改</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import qs from 'qs'

	import { Notify } from 'vant'
	Vue.use(Notify)


	export default {
		name: 'modifyPwd',

		data() {
			return {
				menus: [
					{'placeholder': '请输入旧密码', 'pwd': ''},
					{'placeholder': '请输入新密码', 'pwd': ''},
					{'placeholder': '再次输入密码', 'pwd': ''},
				]
			}
		},

		methods: {
			goBack() {
				this.$router.go(-1)
			},

			// 修改密码
			modifyPwdPost() {
				axios
					.post('http://jizhang-api-dev.it266.com/api/user/password?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'password': this.menus[0].pwd,
						'new_password': this.menus[1].pwd,
					}))
					.then(res => {
						// console.log(res)
						if (res.data.status) {
							Notify({ type: 'success', message: '密码修改成功' })
							this.$router.go(-1)
						} else {
							Notify({ type: 'warning', message: res.data.data })
						}
					})
			}
		}
	}
</script>