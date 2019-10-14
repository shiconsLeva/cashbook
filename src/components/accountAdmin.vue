<template>
	<div id="accountAdmin">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="goBack"></i>
			<span>账簿管理</span>
		</div>

		<!-- 账簿列表 -->
		<div class="swipe">
			<van-swipe-cell v-for="(item, i) in bookList" :key="i">
				<van-cell :border="false" :title="item.name + ' (创建者:' + item.user_name + ')'"></van-cell>

				<template slot="right">
					<van-button square type="primary" color="#ffac00" text="编辑" @click="$router.push('/bookEdit?id=' + item.id)"></van-button>
					<van-button square type="danger" text="删除" @click="alertDelBox(item.id)"></van-button>
				</template>
			</van-swipe-cell>
		</div>

		<div class="submit" @click="jumpTo('/addAccount')">创建新账簿</div>

		<!-- 删除提示框 -->
		<div class="alertBox confirmBox" :style="{'display': alertBoxDisplay}" @click.self="alertBoxDisplay='none'">
			<div class="alert">
				<h4>提示</h4>

				<p>您确定删除吗?</p>

				<div class="confirm">
					<span class="no" @click="alertBoxDisplay='none'">取消</span>
					<span class="yes" @click="delBook">确定</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import qs from 'qs'

	import { Notify, SwipeCell, Button } from 'vant'
	Vue.use(Notify).use(SwipeCell).use(Button)


	export default {
		data() {
			return {
				bookList: [],

				alertBoxDisplay: 'none',

				delBookId: '', // 待删除的账簿Id
			}
		},

		methods: {
			goBack() {
				this.$router.go(-1)
			},

			jumpTo(link) {
				this.$router.push(link)
			},

			getBooks() {
				// 获取账簿列表
				axios
					.get('http://jizhang-api-dev.it266.com/api/book?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken')
					}))
					.then(res => {
						// console.log(res.data.data)
						this.bookList = res.data.data
					})
			},

			alertDelBox(bookId) {
				this.alertBoxDisplay = 'block'
				this.delBookId = bookId
			},

			delBook() {
				// 删除账簿
				axios
					.post('http://jizhang-api-dev.it266.com/api/book/delete?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'book_id': this.delBookId,
					}))
					.then(res => {
						// console.log(res)
						if (res.data.status) {
							Notify({ type: 'success', message: '删除成功' })
							this.alertBoxDisplay = 'none'
							this.delBookId = ''
							this.getBooks()
						}else {
							Notify({ type: 'warning', message: res.data.data })
						}
					})
			}
		},

		created() {
			this.getBooks()
		}
	}
</script>

<style scoped>
	/*div.van-cell__title span{
		font-size: 16px;
		color: black;
	}

	div.van-swipe-cell__right{
		font-size: 0px;
	}*/
</style>