<template>
	<div id="incomeUpdate">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="$router.go(-1)"></i>

			<span>修改收入类别</span>
		</div>

		<div class="menus">
			<p class="tip">请输入新的收入类别名称</p>

			<div class="menu">
				<span>收入类别名称</span>

				<input type="text" v-model="name">
			</div>
		</div>


		<div class="submit" @click="incomeUpdatePost">保存</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import qs from 'qs'

	import { Notify } from 'vant'
	Vue.use(Notify)


	export default {
		name: 'incomeUpdate',

		data() {
			return {
				name: ''
			}
		},

		methods: {
			incomeUpdatePost() {
				axios
					.post('http://jizhang-api-dev.it266.com/api/category/update?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'id': this.$route.query.id,
						'name': this.name,
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
			this.name = this.$route.query.name
		}
	}
</script>