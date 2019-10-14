<template>
	<div id="setting">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="goBack"></i>
			<span>设置</span>
		</div>

		<!-- 间隔 -->
		<div class="gap"></div>

		<!-- 菜单 -->
		<div class="menus">
			<div class="menu" v-for="(item, i) in menus" :key="i" @click="jumpTo(item.link)">
				<span>
					<i :class="['iconfont', item.icon]"></i>

					<span class="title">{{ item.title }}</span>
				</span>

				<i class="iconfont icon-youjiantou"></i>
			</div>
		</div>

		<!-- 退出登录 -->
		<div class="submit" @click="logout">退出登录</div>

		<!-- 退出确认弹出框 -->
		<div class="logoutBox alertBox confirmBox" :style="{'display': alertBoxDisplay}" @click.self="closeAlertBox">
			<div class="logout alert">
				<h4>提示</h4>

				<p>您确定要退出登录吗?</p>

				<div class="confirm">
					<span class="no" @click="closeAlertBox">取消</span>
					<span class="yes" @click="logoutAct">确定</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import qs from 'qs'


	export default {
		name: 'setting',

		data() {
			return {
				alertBoxDisplay: 'none', // 退出提示弹框display

				menus: [
					{'title': '修改密码','icon': 'icon-suo', 'link': 'modifyPwd'},
					{'title': '更换手机号','icon': 'icon-phone', 'link': 'changeTel'},
				]
			}
		},

		methods: {
			goBack() {
				this.$router.go(-1)
			},

			logout() {
				this.alertBoxDisplay = 'block'
			},

			jumpTo(link) {
				this.$router.push(link)
			},

			// 退出登录
			logoutAct() {
				axios
					.get('http://jizhang-api-dev.it266.com/api/user/logout?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
					}))
					.then(res => {
						console.log(res)
						localStorage.removeItem('cashBookToken')
						this.$router.replace('/')
					})
			},

			// 关闭提示弹出框
			closeAlertBox() {
				this.alertBoxDisplay = 'none'
			},
		}
	}
</script>