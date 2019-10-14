<template>
	<div id="addAssetsAccount">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="goBack"></i>

			<span>添加资产账户</span>
		</div>

		<div class="menus">
			<p class="tip">账户信息保存后仅备注可修改</p>

			<!-- 账户名称 -->
			<div class="menu">
				<span>账户名称</span>

				<input type="text" placeholder="请输入账户名称" v-model="accountName">
			</div>
		</div>

		<div class="menus">
			<div class="gap"></div>

			<!-- 账户类型 -->
			<div class="menu" @click="typeBoxDisplay='block'">
				<span>账户类型</span>

				<span>
					<span>{{ typeId?types[typeId-1].name:'请选择' }}</span>
					<i class="iconfont icon-youjiantou"></i>
				</span>
			</div>

			<!-- 初始余额 -->
			<div class="menu">
				<span>初始余额</span>

				<input type="text" placeholder="0.00" v-model="initialBalance">
			</div>
		</div>

		<div class="menus">
			<div class="gap"></div>

			<textarea placeholder="请输入备注..." v-model='remark'></textarea>
		</div>

		<div class="submit" @click="addAccountPost">保存</div>


		<!-- 账户类型选择框 -->
		<div class="alertBox checkBox" :style="{'display': typeBoxDisplay}" @click.self="typeBoxDisplay='none'">
			<div class="alert">
				<label @click="typeId='';typeBoxDisplay='none'">
					<input type="radio" name="accountType" checked><span>请选择</span>
				</label>
				<label v-for="(item, i) in types" @click="selectType(item)">
					<input type="radio" name="accountType"><span>{{ item.name }}</span>
				</label>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import qs from 'qs'

	import { Notify} from 'vant'
	Vue.use(Notify )

	export default {
		name: 'addAssetsAccount',

		data() {
			return {
				accountName: '', // 账户名称
				typeId: '', // 账户类型
				initialBalance: '', // 初始余额
				remark: '', // 备注

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
			goBack() {
				this.$router.go(-1)
			},

			// 选择类型
			selectType(item) {
				this.typeId = item.id
				this.typeBoxDisplay = 'none'
			},

			// 提交新添账户
			addAccountPost() {
				axios
					.post('http://jizhang-api-dev.it266.com/api/account/create?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'name': this.accountName,
						'type': this.typeId,
						'initial_balance': this.initialBalance,
						'remark': this.remark,
					}))
					.then(res => {
						console.log(res.data)
						if (res.data.status) {
							Notify({ type: 'success', message: '添加成功' })
							this.$router.push('/assetsAccount')
						}else {
							Notify({ type: 'warning', message: res.data.data.replace('type', '类型') })
						}
					})
			}
		}
	}
</script>