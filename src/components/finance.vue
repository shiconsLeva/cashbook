<template>
	<div id="finance">
		<!-- 间隔 -->
		<div class="gap"></div>

		<div class="menus">
			<!-- 资产账户 -->
			<div class="assets menu" @click="jumpTo('/assetsAccount')">
				<span>
					<i class="iconfont icon-meiyuan"></i>

					<span class="title">资产账户</span>
				</span>

				<i class="iconfont icon-youjiantou"></i>
			</div>
		</div>


		<!-- 间隔 -->
		<div class="gap"></div>

		<div class="menus">
			<!-- 收入类别 -->
			<div class="income menu" @click="jumpTo('/incomeTypes')">
				<span>
					<i class="iconfont icon-mulu"></i>

					<span class="title">收入类别</span>
				</span>

				<i class="iconfont icon-youjiantou"></i>
			</div>

			<!-- 支出类别 -->
			<div class="outcome menu" @click="jumpTo('/outcomeTypes')">
				<span>
					<i class="iconfont icon-mulu"></i>

					<span class="title">支出类别</span>
				</span>

				<i class="iconfont icon-youjiantou"></i>
			</div>
		</div>


		<!-- 间隔 -->
		<div class="gap"></div>

		<div class="menus">
			<!-- 记账成员 -->
			<div class="member menu" @click="jumpTo('/bookMember')">
				<span>
					<i class="iconfont icon-chengyuan"></i>

					<span class="title">记账成员</span>
				</span>

				<i class="iconfont icon-youjiantou"></i>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'finance',

		data() {
			return {

			}
		},

		methods: {
			jumpTo(link) {
				this.$router.push(link)
			}
		}
	}
</script>

<style scoped>
/*资产账户*/
.icon-meiyuan{
	color: #0c79a2;
}

/*收入类别*/
.income .icon-mulu{
	color: red;
}

/*支出类别*/
.outcome .icon-mulu{
	color: green;
}

/*记账成员*/
.icon-chengyuan{
	color: #0c79a2;
}
</style>