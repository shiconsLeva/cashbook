<template>
	<div id="collections">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="$router.go(-1)"></i>

			<span>待{{ title }}款</span>

			<!-- 收入 / 支出 选项 -->
			<div class="itemSelection">
				<span :class="{'selected':flag==0}" @click="flag=0">当月待{{ title }}</span>
				<span :class="{'selected':flag==1}" @click="flag=1">季度待{{ title }}</span>
				<span :class="{'selected':flag==2}" @click="flag=2">年度待{{ title }}</span>
			</div>
		</div>

		<div class="total">
			<span class="title">总待{{ title }}金额 : </span>
			<span class="num">{{ collections.total | accuracy }}</span>
		</div>


		<p class="bottom">--没有更多数据--</p>
	</div>
</template>

<script>
	import Vue from 'vue'
	import axios from 'axios'
	import qs from 'qs'

	import { Notify, SwipeCell, Button } from 'vant'
	Vue.use(Notify).use(SwipeCell).use(Button)


	export default {
		name: 'collections',

		data() {
			return {
				flag: 0,
				title: '',
				type: '',


				firstDay: '',
				lastDay: '',

				firstMonthDay: '', // 当前月份第一天
				lastMonthDay: '', // 当前月份最后一天

				firstQuarterDay: '', // 当前季度第一天
				lastQuarterDay: '', // 当前季度最后一天

				firstYearDay: '', // 当前年份第一天
				lastYearDay: '', // 当前年份最后一天

				collections: [],
			}
		},

		methods: {
			// 日期格式化
			fmt(date) {
				return date.toString().padStart(2, '0')
			},

			// 获取账单数据
			getCollections() {
				console.log(this.firstDay)
				console.log(this.lastDay)
				axios
					.get('http://jizhang-api-dev.it266.com/api/record/account/waiting?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'type': this.type,
						'begin_date': this.firstDay,
						'end_date': this.lastDay,
					}))
					.then(res => {
						console.log(res.data.data)
						if (res.data.status) {
							this.collections = res.data.data
						}
					})
			}
		},

		created() {
			// console.log(this.$route.query)
			this.title = (this.type = this.$route.query.type) == 1 ? '收' : '付'

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

			this.getCollections()
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
					case 0:
						// this.checks = this.monthChecks
						this.firstDay = this.firstMonthDay
						this.lastDay = this.lastMonthDay
						break;
					case 1:
						// this.checks = this.quarterChecks
						this.firstDay = this.firstQuarterDay
						this.lastDay = this.lastQuarterDay
						break;
					case 2:
						// this.checks = this.yearChecks
						this.firstDay = this.firstYearDay
						this.lastDay = this.lastYearDay
						break;
				}
				this.getCollections()
			}
		}
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

	/*总计*/
	.total{
		display: flex;
		justify-content: center;
		padding-top: 12px;
		align-items: center;
	}
	.total .title{
		font-size: 25px;
	}
	.total .num{
		color: #f90;
		font-size: 21px;
		margin-left: 12px;
	}



	.bottom{
		text-align: center;
		color: #969696;
	}
</style>