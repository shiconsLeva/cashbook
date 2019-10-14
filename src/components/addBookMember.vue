<template>
	<div id="addBookMember">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="$router.go(-1)"></i>

			<span>添加记账成员</span>
		</div>

		<div class="menus">
			<div class="menu">
				<input type="text" placeholder="请输入记账成员手机号" v-model="memberTel">
			</div>
		</div>

		<!-- 保存 -->
		<div class="submit" @click="newMemberPost">保存</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import qs from 'qs'

	import { Notify } from 'vant'
	Vue.use(Notify)


	export default {
		name: 'addBookMember',

		data() {
			return {
				memberTel: '', // 新成员手机号
				bookId: '', // 账簿id
			}
		},

		methods: {
			// 上传新成员
			newMemberPost() {
				axios
					.post('http://jizhang-api-dev.it266.com/api/member/add?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'book_id': this.bookId,
						'mobile': this.memberTel,
					}))
					.then(res => {
						console.log(res.data)
						if (res.data.status) {
							Notify({type: 'success', message: res.data.data})
						}else {
							Notify({ type: 'warning', message: res.data.data })
						}
					})
			}
		},

		created() {
			// 获取账簿id
			axios
				.get('http://jizhang-api-dev.it266.com/api/book/get-default?' + qs.stringify({
					'token': localStorage.getItem('cashBookToken'),
				}))
				.then(res => {
					// console.log(res.data)
					if (res.data.status) {
						this.bookId = res.data.data.id
					}
				})
		}
	}
</script>