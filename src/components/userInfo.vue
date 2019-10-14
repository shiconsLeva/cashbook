<template>
	<div id="userInfo">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="goBack"></i>
			<span>个人资料</span>
		</div>

		<!-- 头像栏 -->
		<div class="menus">
			<div class="headSculpture menu">
				<span>头像</span>
				<span>
					<!-- 头像图片 -->
					<van-uploader :after-read="postImage">
						<img :src="headSculpture">
					</van-uploader>
					<i class="iconfont icon-youjiantou"></i>
				</span>
			</div>

			<!-- 昵称 -->
			<div class="menu" @click="jumpTo('/modifyName')">
				<span>昵称</span>
				<span>
					<slot name="name"></slot>
					<i class="iconfont icon-youjiantou"></i>
				</span>
			</div>

			<!-- 手机号 -->
			<div class="menu" @click="jumpTo('/changeTel')">
				<span>手机号</span>
				<span>
					<slot name="tel"></slot>
					<i class="iconfont icon-youjiantou"></i>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import qs from 'qs'
	import { Notify, Uploader, Button } from 'vant'

	Vue.use(Notify).use(Uploader).use(Button)


	export default {
		name: 'userInfo',

		data() {
			return {
				headSculpture: '',
				fileKey: '',
			}
		},

		methods: {
			goBack() {
				this.$router.go(-1)
			},

			jumpTo(link) {
				this.$router.push(link)
			},

			postImage(file) {
				var data = new FormData()
				data.append("file",file.file)

				axios
					.post('http://jizhang-api-dev.it266.com/api/upload/image?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
					}), data)
					.then(res => {
						console.log(res.data.data)
						if (res.data.data.status) {
							this.headSculpture = res.data.data.file.url
							axios
								.post('http://jizhang-api-dev.it266.com/api/user/profile/update?' + qs.stringify({
									'token': localStorage.getItem('cashBookToken'),
									'avatar': res.data.data.file.fileKey
								}))
								.then(res => {
									Notify({ type: 'success', message: res.data.data })
								})
						}else {
							Notify({ type: 'warning', message: res.data.data.message })
						}
					})
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
						console.log(res.data.data)
						this.headSculpture = res.data.data.avatar_url
					}else {
						Notify({ type: 'warning', message: res.data.data })
					}
				})
		}
	}
</script>

<style scoped>
	#userInfo .menus{
		border-bottom: solid 1px #ddd;
	}
	/*头像*/
	.headSculpture img{
		vertical-align: middle;
		padding-bottom: 3px;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		padding: 5px 0;
	}


	.headSculpture input{
		display: inline-block;
		height: 50px;
	}
</style>