<template>
	<div id="checks">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="$router.go(-1)"></i>

			<span>账面收支明细</span>

			<span class="screenBtn" @click="$router.push('/checkFilter')">筛选</span>

			<!-- 收入 / 支出 选项 -->
			<div class="itemSelection">
				<span :class="{'selected':flag==1}" @click="flag=1">当月收支</span>
				<span :class="{'selected':flag==2}" @click="flag=2">季度收支</span>
				<span :class="{'selected':flag==3}" @click="flag=3">年度收支</span>
			</div>
		</div>

		<!-- 收支总计 -->
		<div class="total">
			<p class="date">{{ '当月 :' }}<span class="beginDate">{{ firstDay }}</span> - <span>{{ lastDay }}</span></p>

			<div class="accountIo">
				<div>
					<p>账面收入 : <span class="incomeNum">{{ checks.in }}</span></p>
					<p>账面支出 : <span class="outcomeNum">{{ checks.out }}</span></p>
				</div>

				<div>
					<p>账面利润 : <span class="profitNum">{{ checks.in - checks.out | accuracy }}</span></p>
				</div>
			</div>
		</div>

		<!-- 收支列表 -->
		<div class="menus">
			<div class="menu" v-for="(item, i) in checks.list" @click="$router.push('/singleCheck?id=' + item.id)">
				<div>
					<div>
						<img src="../assets/inImg.png" v-if="item.type==1">
						<img src="../assets/outImg.png" v-if="item.type==2">

						<div>
							<!-- 交易对象 -->
							<p class="companyName">{{ item.company_name || '[无]' }}</p>
							<!-- 待付款 / 待收款 -->
							<p :class="['restMoney', {'income': item.type==1}, {'outcome': item.type==2}]" v-if="item.total_money - item.paid_money!=0">待{{ item.type==1?'收':'付' }}款:{{ item.total_money - item.paid_money }}</p>
						</div>
					</div>

					<p class="date">{{ item.created_at | toDate }}</p>
				</div>

				<span>
					<span class="num">{{ item.total_money }}</span>
					<i class="iconfont icon-youjiantou"></i>
				</span>
			</div>
		</div>

		<!-- <p class="bottom">没有更多数据</p> -->

		<van-pagination v-model="currentPage" :page-count="pageCount" mode="simple"></van-pagination>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import qs from 'qs'

	import { Notify, SwipeCell, Button, Pagination } from 'vant'
	Vue.use(Notify).use(SwipeCell).use(Button).use(Pagination)


	export default {
		name: 'checks',

		data() {
			return {
				flag: 1,

				firstDay: '',
				lastDay: '',

				firstMonthDay: '', // 当前月份第一天
				lastMonthDay: '', // 当前月份最后一天

				firstQuarterDay: '', // 当前季度第一天
				lastQuarterDay: '', // 当前季度最后一天

				firstYearDay: '', // 当前年份第一天
				lastYearDay: '', // 当前年份最后一天

				checks: [],

				currentPage: 1, // 当前分页
				pageCount: 0, // 总页数
			}
		},


		methods: {
			getCheck() {
				console.log(this.currentPage)
			},
			// 日期格式化
			fmt(date) {
				return date.toString().padStart(2, '0')
			},

			// 获取账单数据
			getChecks() {
				console.log(this.firstDay)
				console.log(this.lastDay)
				console.log('getChecks')
				axios
					.get('http://jizhang-api-dev.it266.com/api/record/account?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'type': this.$route.query.type,
						'category_id': this.$route.query.category_id,
						'begin_date': this.firstDay,
						'end_date': this.lastDay,
						'page': this.currentPage,
					}))
					.then(res => {
						console.log(res.data.data)
						if (res.data.status) {
							this.checks = res.data.data
							this.pageCount = this.checks.page.pageCount
						}
					})
			}
		},

		created() {
			console.log(JSON.stringify( this.$route.query ))
			if (JSON.stringify( this.$route.query ) != '{}') { this.flag = 0 }

			var date = new Date()

			var year = date.getFullYear()
			var month = date.getMonth()

			// 计算本月起止日期
			var lastMonthDay = this.fmt( new Date(year, month + 1, 0).getDate() )
			var presentMonth = this.fmt( month + 1 )

			this.firstMonthDay = year + '-' + presentMonth + '-01'
			this.lastMonthDay = year + '-' + presentMonth + '-' + lastMonthDay

			// 计算季度起止日期
			var firstMonth = month - (month % 3) + 1
			var lastMonth = month - (month % 3) + 3
			var lastQuarterDay = this.fmt( new Date(year, lastMonth, 0).getDate() )

			this.firstQuarterDay = year + '-' + this.fmt(firstMonth) + '-01'
			this.lastQuarterDay = year + '-' + this.fmt(lastMonth) + '-' + lastQuarterDay

			// 计算年度起止日期
			this.firstYearDay = year + '-01-01'
			this.lastYearDay = year + '-12-31'

			this.firstDay = this.firstMonthDay
			this.lastDay = this.lastMonthDay
			this.getChecks()
		},

		filters: {
			accuracy(data) {
				return Number(data).toFixed(2)
			},

			toDate(date) {
				return date.substr(5, 5)
			}
		},

		watch: {
			flag: function(val) {
				switch (val) {
					case 1:
						this.firstDay = this.firstMonthDay
						this.lastDay = this.lastMonthDay
						break;
					case 2:
						this.firstDay = this.firstQuarterDay
						this.lastDay = this.lastQuarterDay
						break;
					case 3:
						this.firstDay = this.firstYearDay
						this.lastDay = this.lastYearDay
						break;
				}
				this.getChecks()
			},

			currentPage: function(val) {
				this.getChecks()
			}
		}
	}
</script>

<style scoped>
	.head{
		height: 108px;
	}

	.head .screenBtn{
		position: absolute;
		right: 10px;
	}

	/*收入 / 支出标题*/
	.itemSelection{
		display: flex;
		margin: auto;
		margin-top: 10px;
		width: 90%;
		border: solid 1px #eee;
		border-radius: 3px;
		font-size: 0;
	}

	.itemSelection span{
		width: 33.33%;
		font-size: 16px;
		line-height: 32px;
	}

	/*选中的选项*/
	.itemSelection .selected{
		background-color: #fff;
		color: #0c79a2;
	}

	/*账面总计*/
	.total{
		background-color: #F2F2F2;
		padding: 10px 10px 16px;
	}

	/*日期*/
	.date{
		margin: 0 0 12px;
	}
	.date span{
		color: green;
	}
	.date .beginDate{
		margin-left: 20px;
	}

	/*收支 / 利润*/
	.accountIo{
		font-size: 0;
	}

	.accountIo div{
		display: inline-block;
		width: 50%;
		vertical-align: top;
	}

	.accountIo p{
		font-size: 16px;
		margin: 0;
	}


	/*数额*/
	.accountIo p span{
		margin-left: 10px;
	}

	.accountIo .incomeNum{
		color: red;
	}

	.accountIo .outcomeNum{
		color: green;
	}

	.accountIo .profitNum{
		color: #F9A808;
	}



	/*账面列表*/
	.menu{
		padding-top: 10px;
		padding-bottom: 10px;
	}

	/*收支图标*/
	.menu img{
		width: 60px;
		vertical-align: middle;
	}

	.menu div{
		display: inline-block;
		vertical-align: middle;
	}

	.menu p{
		margin: 0;
		line-height: 16px;
	}

	/*日期*/
	.menu .date{
		width: 60px;
		text-align: center;
	}

	/*交易对象*/
	.menu .companyName{
		font-size: 18px;
	}

	/*剩余交易额*/
	.menu .restMoney{
		border: solid 1px;
		margin-top: 7px;
		border-radius: 12px;
		padding: 4px 8px 2px;
		font-size: 14px;
		text-align: center;
	}

	/*代收款*/
	.menu .income{
		border-color: red;
		color: red;
	}

	/*代付款*/
	.menu .outcome{
		border-color: green;
		color: green;
	}

	/*数额*/
	.menu .num{
		font-size: 21px;
		vertical-align: middle;
	}


	.bottom{
		text-align: center;
		color: #969696;
	}
</style>