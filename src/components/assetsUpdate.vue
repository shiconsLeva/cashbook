<template>
	<div id="assetsUpdate">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="$router.go(-1)"></i>

			<span>修改资产账户</span>
		</div>

		<div class="menus">
			<div class="tip">请输入新的账户名称</div>

			<div class="menu">
				<span>账户名称</span>
				<input type="text" v-model="name">
			</div>
		</div>

		<div class="menus">
			<div class="gap"></div>

			<div class="menu" @click="typeBoxDisplay='block'">
				<span>账户类型</span>

				<span>
					<span>{{ type?types[type-1].name:'请选择' }}</span>
					<i class="iconfont icon-youjiantou"></i>
				</span>
			</div>

			<div class="menu">
				<textarea placeholder="请输入备注..."></textarea>
			</div>
		</div>

		<div class="submit" @click="assetsUpdatePost">保存</div>


		<!-- 账户类型选择框 -->
		<div class="alertBox checkBox" :style="{'display': typeBoxDisplay}" @click.self="typeBoxDisplay='none'">
			<div class="alert">
				<label @click="type='';typeBoxDisplay='none'">
					<input type="radio" name="accountType"><span>请选择</span>
				</label>
				<label v-for="(item, i) in types" @click="selectType(item)">
					<input type="radio" name="accountType" :checked="type==item.id"><span>{{ item.name }}</span>
				</label>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import qs from 'qs'

	import { Notify } from 'vant'
	Vue.use(Notify )


	export default {
		name: 'assetsUpdate',

		data() {
			return {
				id: '',
				asset: [],
				name: '',
				type: '',
				remark: '',

				// 账户类型列表
				types: [
					{'id': 1, 'name': '现金'},
					{'id': 2, 'name': '银行'},
					{'id': 3, 'name': '支付平台'},
					{'id': 4, 'name': '其它'},
				],

				typeBoxDisplay: 'none', // 类型选择框
			}
		},

		methods: {
			// 选择类型
			selectType(item) {
				this.type = item.id
				this.typeBoxDisplay = 'none'
			},

			// 数据修改上传
			assetsUpdatePost() {
				axios
					.post('http://jizhang-api-dev.it266.com/api/account/update?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'id': this.id,
						'name': this.name,
						'type': this.type,
						'remark': this.remark,
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
			this.id = this.$route.query.id

			// 获取资产账户详情数据]
			axios
				.get('http://jizhang-api-dev.it266.com/api/account/detail?' + qs.stringify({
					'token': localStorage.getItem('cashBookToken'),
					'id': this.id,
				}))
				.then(res => {
					console.log(res)
					if (res.data.status) {
						this.asset = res.data.data
						this.name = this.asset.name
						this.type = this.asset.type
						this.remark = this.asset.remark
					}
				})
		}
	}
</script>