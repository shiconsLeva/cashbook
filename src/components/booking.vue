<template>
	<div id="booking">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="$router.go(-1)"></i>
			<span><slot name="name"></slot>的账簿</span>

			<!-- 收入 / 支出 选项 -->
			<div class="itemSelection">
				<span :class="{'selected':flag}" @click="flag=true">收入</span>
				<span :class="{'selected':!flag}" @click="flag=false">支出</span>
			</div>
		</div>

		<div class="menus">
			<!-- 账面收支 -->
			<div class="menu">
				<span>{{ ioInputs[0].title }}</span>
				<input type="text" :placeholder="ioInputs[0].placeholder" v-model="bookIo">
			</div>

			<!-- 交易对象 -->
			<div class="menu">
				<span>{{ ioInputs[1].title }}</span>
				<input type="text" :placeholder="ioInputs[1].placeholder" v-model="transactionObject">
			</div>

			<!-- 方式 -->
			<div class="menu" @click="wayBoxDisplay='block'">
				<span>{{ ioWays.title }}</span>

				<span>
					<span>{{ ioWays.options[ioWay] }}</span>
					<i class="iconfont icon-youjiantou"></i>
				</span>
			</div>

			<!-- 首付 / 首收 -->
			<div class="menu" v-show="ioWay==1">
				<span>首款{{ flag?'收款':'付款' }}</span>
				<input type="text" placeholder="0.00" v-model="realIo">
			</div>


			<!-- 账户 -->
			<div class="menu" @click="getAccounts">
				<span>{{ flag?'收款':'付款' }}账户</span>

				<span>
					<span>{{ ioAccount.name || '请选择' }}</span>
					<i class="iconfont icon-youjiantou"></i>
				</span>
			</div>


			<!-- 类别 -->
			<div class="menu" @click="getTypes">
				<span>{{ flag?'收入':'支出' }}类别</span>

				<span>
					<span>{{ flag?incomeType.name || '请选择':outcomeType.name || '请选择' }}</span>
					<i class="iconfont icon-youjiantou"></i>
				</span>
			</div>

			<!-- 日期 -->
			<div class="menu">
				<span>{{ flag?'收款':'付款' }}日期</span>

				<input type="date" v-model="ioDate">
			</div>

			<!-- 凭证 -->
			<div class="menu">
				<span>{{ flag?'收入':'支出' }}凭证</span>

				<div style="display: inline-block">
					<!-- 上传图片表单 -->
					<van-uploader multiple :after-read="imgPost" preview-size="70px" v-model="fileList">
						<img src="../assets/camera.png" height="70">
					</van-uploader>

					<i class="iconfont icon-youjiantou"></i>
				</div>
			</div>

			<!-- 备注 -->
			<div class="menu">
				<textarea name="file" placeholder="请输入备注..." v-model="remark"></textarea>
			</div>
		</div>

		<!-- 提交 -->
		<div class="submit" @click="postBook">保存</div>

		<!-- 收支方式选择框 -->
		<div class="alertBox checkBox" :style="{'display': wayBoxDisplay}" @click.self="wayBoxDisplay='none'">
			<div class="alert">
				<label v-for="(option, i) in ioWays.options" @click="selectWay(i)">
					<input type="radio" name="ioWay" :checked="i==0"><span>{{ option }}</span>
				</label>
			</div>
		</div>

		<!-- 收支账户选择框 -->
		<div class="alertBox checkBox" :style="{'display': accountBoxDisplay}" @click.self="accountBoxDisplay='none'">
			<div class="alert">
				<label @click="ioAccount=[];accountBoxDisplay = 'none'">
					<input type="radio" name="ioAccount" checked><span>请选择</span>
				</label>
				<label v-for="(item, i) in ioAccounts" @click="selectAccount(item)">
					<input type="radio" name="ioAccount"><span>{{ item.name }}</span>
				</label>
			</div>
		</div>



		<!-- 收支类别选项 -->
		<div class="alertBox ioTypes" :style="{'display': typeBoxDisplay}">
			<div class="head">请选择类别</div>

			<div class="typeBox">
				<div class="ioType" v-for="(item, i) in flag?incomeTypes:outcomeTypes" @click="selectType(item)">{{ item.name }}</div>
			</div>

			<!-- 底部 -->
			<div class="bottom">
				<div class="submit" @click="addTypeBoxDisplay='block'">新增类别</div>

				<div class="close" @click="typeBoxDisplay='none'">关闭</div>
			</div>


			<!-- 新增类别 -->
			<div class="alertBox addTypeBox confirmBox" :style="{'display': addTypeBoxDisplay}" @click.self="addTypeBoxDisplay='none';newType=''">
				<div class="alert">
					<h4>新建类别</h4>

					<p>请输入类别名</p>

					<div><input type="text" v-model="newType"></div>

					<div class="confirm">
						<span class="no" @click="addTypeBoxDisplay='none';newType=''">取消</span>
						<span class="yes" @click="postNewType">确定</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import qs from 'qs'

	import { Notify, Uploader, Button } from 'vant'
	Vue.use(Notify).use(Button).use(Uploader)


	export default {
		name: 'booking',

		data() {
			return {
				flag: true, // 收入 / 支出 选项切换

				ioInputs: '',
				ioWays: [], // 收支方式

				ioAccounts: [], // 收支账户

				incomeType: [], // 收入类别选择
				outcomeType: [], // 支出类别选择


				"bookIo": '', // 账面收支
				'transactionObject': '', // 交易对象
				'ioWay': 0, // 收支方式
				"realIo": '', // 实付金额
				"ioAccount": [], // 收支账户
				"ioDate": "", // 收支日期
				"ioProof": '', // 收支凭证
				"remark": "", // 备注


				wayBoxDisplay: 'none', // 收支方式选择

				accountBoxDisplay: 'none', // 收支账户选择

				typeBoxDisplay: 'none', // 选择类别
				addTypeBoxDisplay: 'none', //新增类别
				newType: '', // 待添加的新类别
				// ..........

				// 收入输入框
				incomeInputs: [
					{'title': '账面收入', 'placeholder': '0.00'},
					{'title': '交易对象', 'placeholder': '请输入交易对象'},
				],

				// 收款方式
				incomeWays: {'name': 'incomeWay', 'title': '收款方式', 'options': ['全额收款', '分期收款']},

				// 收入类别
				incomeTypes: [],
				// ..........

				// 支出输入框
				outcomeInputs: [
					{'title': '账面支出', 'placeholder': '0.00'},
					{'title': '交易对象', 'placeholder': '请输入交易对象'},
				],

				// 支出方式
				outcomeWays: {'name': 'outcomeWay', 'title': '付款方式', 'options': ['全额付款', '分期付款']},

				// 支出类别
				outcomeTypes: [],

				fileList: [], // 图片列表
				imgKeys: [],
			}
		},

		watch: {
			flag: function(val) {
				if (val) {
					this.ioInputs = this.incomeInputs
					this.ioWays = this.incomeWays
				}else {
					this.ioInputs = this.outcomeInputs
					this.ioWays = this.outcomeWays
				}
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

			// 关闭提示弹出框
			closeAlertBox() {
				this.io.forEach((item) => {
					item.optionBoxDisplay = 'none'
				})
			},

			// 弹出菜单选项
			alertOptionBox(i) {
				this.io[i].optionBoxDisplay = 'block'
			},

			// 选择收支方式
			selectWay(i) {
				this.ioWay = i
				this.wayBoxDisplay = 'none'
			},

			// 获取账户
			getAccounts() {
				axios
					.get('http://jizhang-api-dev.it266.com/api/account?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken')
					}))
					.then(res => {
						this.ioAccounts = res.data.data
						this.accountBoxDisplay = 'block'
					})
			},

			// 选择收支账户
			selectAccount(item) {
				this.ioAccount = item
				this.accountBoxDisplay = 'none'
			},

			// 获取收支类别
			getTypes() {
				axios
					.get('http://jizhang-api-dev.it266.com/api/category?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'type': this.flag?1:2,
						'dataType': 1,
					}))
					.then(res => {
						// console.log(res.data.data)
						if (this.flag) {
							this.incomeTypes= res.data.data
						}else {
							this.outcomeTypes = res.data.data
						}
						this.typeBoxDisplay = 'block'
					})
			},

			// 选择收支类别
			selectType(ioType) {
				if (this.flag) {
					this.incomeType = ioType
				}else {
					this.outcomeType = ioType
				}
				this.typeBoxDisplay = 'none'
			},


			// 上传新收支类型
			postNewType() {
				axios
					.post('http://jizhang-api-dev.it266.com/api/category/create?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'parent_id': 0,
						'type': this.flag?1:2,
						'name': this.newType,
						'sort': 0,
					}))
					.then(res => {
						if (res.data.status) {
							Notify({ type: 'success', message: '新建成功' })
							this.addTypeBoxDisplay = 'none'
							this.typeBoxDisplay = 'none'
							this.newType = ''
						}else {
							Notify({ type: 'warning', message: res.data.data })
						}
					})
			},

			// 上传账单
			postBook() {
				axios
					.post('http://jizhang-api-dev.it266.com/api/record/create?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'total_money': this.bookIo,
						'money': this.ioWay==0?this.bookIo:this.realIo,
						'account_id': this.ioAccount.id,
						'category_id': this.flag?this.incomeType.id:this.outcomeType.id,
						'date': this.ioDate,
						'company_name': this.transactionObject,
						'remark': this.remark,
						'image_keys': this.imgKeys.toString(),
					}))
					.then(res => {
						if (res.data.status) {
							Notify({ type: 'success', message: res.data.data })
							this.$router.go(-1)
						}else {
							Notify({ type: 'warning', message: res.data.data })
						}
					})
			},
		},

		created() {
			this.ioInputs = this.incomeInputs
			this.ioWays = this.incomeWays
		},
	}
</script>

<style scoped>
	.head{
		height: 108px;
	}

	/*收入 / 支出标题*/
	.itemSelection{
		display: flex;
		margin: auto;
		width: 180px;
		border: solid 1px #eee;
		border-radius: 3px;
		font-size: 0;
	}

	.itemSelection span{
		width: 50%;
		font-size: 16px;
		line-height: 32px;
	}

	/*选中的选项*/
	.itemSelection .selected{
		background-color: #fff;
		color: #0c79a2;
	}

	/*背景字*/
	input::-webkit-input-placeholder{
		color: #b2b2b2;
	}



	/*收支类别*/
	.ioTypes{
		background-color: #fff;
		position: absolute;
	}

	.ioTypes .head{
		height: 56px;
		position: fixed;
		width: 100%;
	}

	.typeBox{
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		padding: 10px 3px;
		margin: 56px 0 90px;
	}

	.ioType{
		width: 48%;
		height: 64px;
		line-height: 64px;
		text-align: center;
		border: solid 1px #ccc;
		margin-bottom: 8px;
	}

	.addTypeBox input{
		display: block;
		border: solid 1px #dedede;
		border-radius: 5px;
		width: 85%;
		font-size: 12px;
		padding: 3px;
		margin: 20px auto 32px;
	}


	/*底部栏*/
	.bottom{
		position: fixed;
		width: 100%;
		bottom: 0;
		background-color: #fff;
	}

	/*提交按钮*/
	.bottom .submit{
		width: 75%;
		font-size: 15px;
		height: 36px;
		line-height: 36px;
		margin: 0 auto 10px;
	}

	/*关闭按钮*/
	.bottom .close{
		text-align: center;
		background-color: #f2f2f2;
		font-size: 18px;
		color: #333;
		line-height: 42px;
	}

	.van-uploader{
		vertical-align: middle;
	}

	.van-uploader__input-wrapper{
		height: 80px;
	}

	.menu .van-uploader__input-wrapper .van-uploader__input{
		line-height: 15px;
		height: 80px;
	}
</style>