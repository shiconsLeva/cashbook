<template>
	<div id="bookMember">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="$router.go(-1)"></i>

			<span>记账成员管理</span>
		</div>

		<div class="menus">
			<p class="tip" v-show="!bookMembers">您暂时还没有记账成员</p>

			<div class="menu" v-for="(item, i) in bookMembers">
				<span>{{ item.nickname }} (手机号: {{ item.mobile }})</span>
			</div>
		</div>


		<!-- 添加记账成员 -->
		<div class="submit" @click="$router.push('/addBookMember')">添加记账成员</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import qs from 'qs'


	export default {
		name: 'bookMember',

		data() {
			return {
				bookId: '', // 账簿id
				bookMembers: null, // 记账成员列表
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
					// 获取记账成员列表
					axios
						.get('http://jizhang-api-dev.it266.com/api/member?' + qs.stringify({
							'token': localStorage.getItem('cashBookToken'),
							'book_id': this.bookId,
						}))
						.then(res => {
							console.log(res)
							if (res.data.status) {
								this.bookMembers = res.data.data
							}
						})
				})
		}
	}
</script>