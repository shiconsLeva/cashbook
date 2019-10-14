<template>
	<div id="accountBook">
		<!-- 账面收支 -->
		<div class="ios">
			<p class="headline">账面收支 2020-10月</p>

			<div class="menus">
				<div class="menu" v-for="(item, i) in ios" :key="i" @click="$router.push('/checks')">
					<span>{{ item.title }}</span>

					<span>
						<span class="num">{{ item.amount | accuracy }}</span>
						<i class="iconfont icon-youjiantou"></i>
					</span>
				</div>
			</div>
		</div>

		<!-- 接收/待付 -->
		<div class="cp">
			<p class="headline">待收/待付</p>

			<div class="menus">
				<div class="menu" v-for="(item, i) in cps" :key="i" @click="$router.push('/collections?type=' + (i + 1))">
					<span class="itemName">
						<i :class="['iconfont', item.icon]"></i>
						<span class="title">{{ item.title }}</span>
					</span>

					<span>
						<span class="num">{{ item.amount | accuracy }}</span>
						<i class="iconfont icon-youjiantou"></i>
					</span>
				</div>
			</div>
		</div>

		<div class="submit" @click="jumpTo('/booking')">记一笔</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import qs from 'qs'


	export default {
		name: 'accountBook',

		data() {
			return {
				accountBookData: [],
				// 账面收支
				ios: [
					{'title': '账面收入', 'amount': 0},
					{'title': '账面支出', 'amount': 0},
					{'title': '账面利润', 'amount': 0},
				],

				// 待收/待付
				cps: [
					{'title': '待收款', 'amount': 0, 'icon': 'icon-daishoukuan'},
					{'title': '待付款', 'amount': 0, 'icon': 'icon-daifukuan'},
				]
			}
		},

		methods: {
			jumpTo(link) {
				this.$router.push(link)
			}
		},

		created() {
			// 获取账面数据
			axios.
				get('http://jizhang-api-dev.it266.com/api/view/home?' + qs.stringify({
					'token': localStorage.getItem('cashBookToken'),
				}))
				.then(res => {
					if (res.data.status) {
						// console.log(res.data.data)
						this.accountBookData = res.data.data
						this.ios[0].amount = this.accountBookData.account.in
						this.ios[1].amount = this.accountBookData.account.out
						this.ios[2].amount = this.ios[0].amount - this.ios[1].amount

						this.cps[0].amount = this.accountBookData.waitingForCollection
						this.cps[1].amount = this.accountBookData.waitingForPayment
					}
				})
		},

		filters: {
			accuracy(data) {
				return Number(data).toFixed(2)
			},
		},
	}
</script>

<style scoped>
.headline,.ios .menus{
	padding-left: 12px;
}

/*小标题*/
.headline{
	background-color: #eee;
	color: #555;
	margin: 0;
	font-size: 15px;
	line-height: 35px;
}

/*菜单*/
.ios .menu{
	padding-left: 0;
}

/*款项图标*/
.menu .itemName .iconfont{
	margin-right: 2px;
	font-size: 20px;
}


/*数字颜色*/
.menu:nth-of-type(1) .num{
	color: red;
}
.menu:nth-of-type(2) .num{
	color: green;
}
.menu:nth-of-type(3) .num{
	color: orange;
}

</style>