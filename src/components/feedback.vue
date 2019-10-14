<template>
	<div id="feedback">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="goBack"></i>
			<span>意见反馈</span>
		</div>

		<!-- 问题和建议 -->
		<div class="menus">
			<!-- 提示 -->
			<p class="tip">问题和建议</p>

			<!-- 输入意见 -->
			<div class="menu">
				<textarea draggable="false" placeholder="请简要描述您的问题和意见" v-model='feedbacks'></textarea>
			</div>
		</div>

		<!-- 联系方式 -->
		<div class="menus">
			<!-- 提示 -->
			<p class="tip">联系电话或邮箱</p>

			<!-- 输入框 -->
			<div class="menu">
				<input type="text" placeholder="选填,便于我们与你联系" v-model="contact">
			</div>
		</div>

		<!-- 提交意见 -->
		<div class="submit" @click='feedbackPost'>提交意见</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import qs from 'qs'

	import { Notify } from 'vant'
	Vue.use(Notify)


	export default {
		name: 'feedback',

		data() {
			return {
				feedbacks: '',
				contact: ''
			}
		},

		methods: {
			goBack() {
				this.$router.go(-1)
			},

			feedbackPost() {
				axios
					.post('http://jizhang-api-dev.it266.com/api/feedback/add?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'content': this.feedbacks,
						'contact': this.contact,
					}))
					.then(res => {
						if(res.data.status) {
							Notify({ type: 'success', message: res.data.data })
						} else {
							Notify({ type: 'warning', message: res.data.data })
						}
					})
				this.goBack()
			}
		}
	}
</script>

<style scoped>
	.menu{
		border-top: solid 1px #ddd;
		border-bottom: solid 1px #ddd;
	}
	textarea{
		height: 96px;
		padding: 5px 0;
	}
</style>