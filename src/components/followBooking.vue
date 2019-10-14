<template>
	<div id="followBooking">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="$router.go(-1)"></i>

			<span>后续{{ type==1?'收':'付' }}款</span>
		</div>

		<div class="menus">
			<!-- 金额 -->
			<div class="menu">
				<span>{{ type==1?'收':'付' }}款金额</span>
				<input type="text" placeholder="0.00" v-model="money">
			</div>

			<!-- 账户 -->
			<div class="menu" @click="accountBoxDisplay='block'">
				<span>{{ type==1?'收':'付' }}款账户</span>

				<span>
					<span>{{ account.name || '请选择' }}</span>
					<i class="iconfont icon-youjiantou"></i>
				</span>
			</div>

			<!-- 凭证 -->
			<div class="menu">
				<span>{{ type==1?'收入':'支出' }}凭证</span>
				<div style="display: inline-block">
					<van-uploader multiple v-model="fileList" :after-read="imgPost">
						<img src="../assets/camera.png" width="72">
					</van-uploader>

					<i class="iconfont icon-youjiantou"></i>
				</div>
			</div>

			<!-- 日期 -->
			<div class="menu">
				<span>{{ type==1?'收':'付' }}款日期</span>
				<input type="date" v-model="date">
			</div>
		</div>

		<div class="submit" @click="post">{{ type==1?'收':'付' }}款</div>


		<!-- 收支账户选择框 -->
		<div class="alertBox checkBox" :style="{'display': accountBoxDisplay}" @click.self="accountBoxDisplay='none'">
			<div class="alert">
				<label @click="account=[];accountBoxDisplay='none'">
					<input type="radio" name="account" checked><span>请选择</span>
				</label>
				<label v-for="(item, i) in accounts" @click="selectAccount(item)">
					<input type="radio" name="account"><span>{{ item.name }}</span>
				</label>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import qs from 'qs'

	import { Notify, Uploader, Button } from 'vant'
	Vue.use(Notify, Uploader, Button)


	export default {
		name: 'followBooking',

		data() {
			return{
				type: '',

				money: '',
				accounts: [],
				account: [],
				date: '',

				imgKeys: [],

				accountBoxDisplay: 'none',
				fileList: [],
			}
		},

		methods: {
			// 选择收支账户
			selectAccount(item) {
				this.account = item
				this.accountBoxDisplay = 'none'
			},

			// 上传图片
			imgPost() {
				this.fileList.forEach(item => {
					let data = new FormData()
					data.append("file",item.file)

					axios
						.post('http://jizhang-api-dev.it266.com/api/upload/image?' + qs.stringify({
							'token': localStorage.getItem('cashBookToken'),
						}), data)
						.then(res => {
							console.log(res.data.data)
							if (res.data.data.status) {
								this.imgKeys.push(res.data.data.file.fileKey)
							}else {
								Notify({ type: 'warning', message: res.data.data.message })
							}
						})
					})
			},

			// 上传后续记账
			post() {
				axios
					.post('http://jizhang-api-dev.it266.com/api/record/sequel?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'record_id': this.$route.query.id,
						'money': this.money,
						'account_id': this.account.id,
						'date': this.date,
						'image_keys': this.imgKeys.toString(),
					}))
					.then(res => {
						console.log(res.data.data)
						if (res.data.status) {
							Notify({ type: 'success', message: res.data.data })
							this.$router.go(-1)
						}else {
							Notify({ type: 'warning', message: res.data.data })
						}
					})
			}
		},

		created() {
			console.log(this.$route.query)
			this.type = this.$route.query.type

			// 获取账户
			axios
				.get('http://jizhang-api-dev.it266.com/api/account?' + qs.stringify({
					'token': localStorage.getItem('cashBookToken'),
				}))
				.then(res => {
					console.log(res.data)
					if (res.data.status) {
						this.accounts = res.data.data
					}
				})
		}
	}
</script>

<style scoped>
	.van-uploader{
		vertical-align: middle;
	}
	.van-uploader__wrapper{
		height: 78px;
	}
	.van-uploader__input-wrapper{
		height: 78px;
	}
	.van-uploader__input{
		height: 78%;
	}
</style>