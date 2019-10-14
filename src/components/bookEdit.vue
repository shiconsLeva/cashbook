<template>
	<div id="bookEdit">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="$router.go(-1)"></i>

			<span>修改账簿</span>
		</div>

		<div class="menus">
			<p class="tip">请输入新的账簿名称</p>

			<div class="menu">
				<span>账簿名称</span>

				<input type="text" v-model="bookName">
			</div>
		</div>

		<div class="submit" @click="bookEditPost">保存</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import qs from 'qs'

	import { Notify } from 'vant'
	Vue.use(Notify)


	export default {
		name: "bookEdit",

		data() {
			return {
				bookId: '',
				bookName: '',
			}
		},

		methods: {
			bookEditPost() {
				axios
					.post('http://jizhang-api-dev.it266.com/api/book/update?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'book_id': this.bookId,
						'book_name': this.bookName,
					}))
					.then(res => {
						// console.log(res)
						if (res.data.status) {
							Notify({ type: 'success', message: '修改成功' })
							this.$router.go(-1)
						}else {
							Notify({ type: 'warning', message: res.data.data })
						}
					})
			}
		},

		created() {
			// console.log(this.$route.query)
			this.bookId = this.$route.query
			// 获取账簿详情
			axios
				.get('http://jizhang-api-dev.it266.com/api/book/detail?' + qs.stringify({
					'token': localStorage.getItem('cashBookToken'),
					'book_id': this.bookId,
				}))
				.then(res => {
					// console.log(res.data)
					if (res.data.status) {
						this.bookName = res.data.data.name
					}
				})
		}
	}
</script>