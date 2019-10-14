<template>
	<div id="singleCheckUpdate">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="$router.go(-1)"></i>

			<span>{{ title }}</span>
		</div>


		<div v-if="option=='image_keys'" class="menus">
			<div class="gap"></div>

			<div class="menu" style="padding-top: 10px;display: flex;flex-wrap: wrap">
				<van-uploader multiple :after-read="imgPost" preview-size="90px" v-model="fileList">
					<img src="../assets/camera.png" height="90">
				</van-uploader>
			</div>
		</div>


		<div v-else class="menus">
			<div class="menu">
				<span>{{ title }}</span>
				<input :type="option=='date'?'date':'text'" v-model="value">
			</div>
		</div>

		<div class="submit" @click="singleCheckUpdatePost">保存</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import qs from 'qs'

	import { Notify, Uploader, Button } from 'vant'
	Vue.use(Notify).use(Uploader).use(Button)


	export default {
		name: 'singleCheckUpdate',

		data() {
			return {
				option: '', // 修改项
				title: '', // 标题
				value: '', // 修改项原值

				itemId: '',
				fileList: [],
				imgKeys: [],
			}
		},

		methods: {
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

			// 上传修改
			singleCheckUpdatePost() {
				var option = this.option
				var value = this.value

				var url
				var datas

				if (this.itemId) {
					url = 'http://jizhang-api-dev.it266.com/api/record/item/update?'
					datas = {
						'token': localStorage.getItem('cashBookToken'),
						'itemId': this.itemId,
					}
					if (this.option == 'image_keys') {
						this.value = this.imgKeys.toString()
					}
				}else {
					url = 'http://jizhang-api-dev.it266.com/api/record/update?'
					datas = {
						'token': localStorage.getItem('cashBookToken'),
						'id': this.$route.query.id,
					}
				}

				console.log(datas)
				// return
				axios
					.post(url + qs.stringify(datas) + '&' + this.option + '=' + this.value)
					.then(res => {
						console.log(res)
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
			this.itemId = this.$route.query.itemId
			this.option = this.$route.query.option
			this.title = this.$route.query.title
			this.value = this.$route.query.value
		}
	}
</script>