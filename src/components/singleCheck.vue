<template>
	<div id="singleCheck">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="$router.go(-1)"></i>

			<span>{{ check.type_string }}详情</span>
		</div>

		<div class="menus" style="margin-top: 56px">
			<!-- 账面收支 -->
			<div class="menu" @click="update('total_money', '账面' + check.type_string, check.total_money)">
				<span>账面{{ check.type_string }}</span>

				<span>
					<span :class="io">{{ check.total_money }}</span>
					<i class="iconfont icon-youjiantou"></i>
				</span>
			</div>

			<!-- 交易对象 -->
			<div class="menu" @click="update('company_name', '交易对象', check.company_name)">
				<span>交易对象</span>

				<span>
					<span>{{ check.company_name || '[无]' }}</span>
					<i class="iconfont icon-youjiantou"></i>
				</span>
			</div>

			<!-- 交易方式 -->
			<div class="menu">
				<span>{{ type==1?'收':'付' }}款方式</span>

				<span>{{ rest?'分期':'全额' }}付款</span>
			</div>

			<!-- 收支类别 -->
			<div class="menu">
				<span>{{ check.type_string }}类别</span>

				<span>{{ check.category_name }}</span>
			</div>

			<!-- 结清状态 -->
			<div class="menu">
				<span>结清状态</span>

				<span :class="io">{{ rest?'未结清 ' + '(' + accuracy(rest) + ')':'已结清' }}</span>
			</div>

			<!-- 收支凭证 -->
			<div class="menu imgs" v-if="!rest" @click="update('image_keys', check.type_string + '凭证', imgs, itemId)">
				<span>{{ check.type_string }}凭证</span>

				<span class="img">
					<span>
						<img v-for="(img, i) in imgs" :src="img.thumbnail">
					</span>
					<i class="iconfont icon-youjiantou"></i>
				</span>
			</div>
		</div>


		<!-- 未结清菜单 -->
		<div class="menus" v-if="rest" v-for="(item, i) in check.items">
			<p class="tip">第{{ i+1 }}笔付款</p>
			<!-- 收支金额 -->
			<div class="menu" @click="update('money', '付款金额', item.money, item.id)">
				<span>{{ type==1?'收':'付' }}款金额</span>

				<span>
					<span :class="io">{{ item.money }}</span>
					<i class="iconfont icon-youjiantou"></i>
				</span>
			</div>

			<!-- 收支账户 -->
			<div class="menu" @click="update('account_id', '付款账户', item.account_id, item.id)">
				<span>{{ type==1?'收':'付' }}款账户</span>

				<span>
					<span>{{ item.account_name }}</span>
					<i class="iconfont icon-youjiantou"></i>
				</span>
			</div>

			<!-- 收支凭证 -->
			<div class="menu imgs" @click="update('image_keys', check.type_string + '凭证', item.images, item.id)">
				<span>{{ check.type_string }}凭证</span>

				<span class="img">
					<span>
						<img v-for="(img, j) in item.images" :src="img.thumbnail">
					</span>
					<i class="iconfont icon-youjiantou"></i>
				</span>
			</div>

			<!-- 日期 -->
			<div class="menu" @click="update('date', type==1?'收款日期':'付款日期', item.date, item.id)">
				<span>{{ type==1?'收':'付' }}款日期</span>

				<span>
					<span>{{ item.date }}</span>
					<i class="iconfont icon-youjiantou"></i>
				</span>
			</div>
		</div>


		<!-- 备注 -->
		<div class="menus" @click="update('remark', '备注', check.remark)">
			<p class="tip">备注</p>

			<div class="menu">
				<span class="remark">{{ check.remark || '暂无备注' }}</span>

				<span><i class="iconfont icon-youjiantou"></i></span>
			</div>
		</div>

		<!-- 记账人 / 日期 -->
		<div class="menus" style="margin-bottom: 100px">
			<div class="gap"></div>

			<!-- 记账人 -->
			<div class="menu">
				<span>记账人</span>

				<span>{{ check.user_nickname }}</span>
			</div>

			<!-- 记账日期 -->
			<div class="menu">
				<span>记账日期</span>

				<span>{{ check.created_at }}</span>
			</div>

			<!-- 更新日期 -->
			<div class="menu">
				<span>更新日期</span>

				<span>{{ check.updated_at }}</span>
			</div>
		</div>


		<div class="bottom">
			<div class="submit" v-if="rest" @click="$router.push('/followBooking?type=' + check.type + '&id=' + check.id)">后续{{ check.type==1?'收':'付' }}款</div>
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
		name: 'singleCheck',

		data() {
			return {
				id: '',
				check: [], // 单条
				itemId: '',
				imgs: [],

				type: '', // 收支 or 支出
				rest: '', // 已结清???

				io: '',
			}
		},

		methods: {
			accuracy(data) {
				return Number(data).toFixed(2)
			},

			// 跳转更新页面
			update(option, title, value, itemId = '') {
				this.$router.push('/singleCheckUpdate?' + qs.stringify({
					'id': this.id,
					itemId,
					option,
					title,
					value,
				}))
			}
		},

		created() {
			// 获取账单条id
			var id = this.$route.query.id
			this.id = id

			// 获取账单条详情
			axios
				.get('http://jizhang-api-dev.it266.com/api/record/detail?' + qs.stringify({
					'token': localStorage.getItem('cashBookToken'),
					'id': id,
				}))
				.then(res => {
					console.log(res)
					if (res.data.status) {
						var check = res.data.data
						this.check = check
						this.type = check.type
						this.rest = ( check.total_money - check.paid_money )
						this.io = this.type == 1 ? 'income' : 'outcome'
						this.itemId = check.items[0].id
						this.imgs = check.items[0].images
					}
				})
		},
	}
</script>

<style scoped>
	.head{
		position: fixed;
		width: 100%;
		top: 0;
	}

	.menu span:last-child,.remark{
		color: #888;
	}
	/*数额*/
	.menus .menu .income{
		color: red;
	}
	.menus .menu .outcome{
		color: green;
	}


	.img{
		width: 75%;
	}

	.img span{
		display: inline-block;
		vertical-align: middle;
		width: 90%;
		line-height: 16px;
	}

	.img img{
		height: 72px;
		width: 72px;
		margin: 2px;
		border: 1px solid #c9c9c9;
		border-radius: 5px;
	}


	.bottom{
		position: fixed;
		bottom: -10px;
		width: 100%;
		background-color: #f8f8f8;
	}
</style>