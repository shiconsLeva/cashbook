<template>
	<div id="user">
		<!-- 间隔 -->
		<div class="gap"></div>

		<!-- 用户信息 -->
		<div class="info" @click="jumpTo('/userInfo')">
			<div>
				<!-- 头像 -->
				<div class="img">
					<img src="../assets/userHead.png">
				</div>

				<!-- 昵称、手机号 -->
				<span class="name_tel">
					<!-- <span class="name">shicons</span> -->
					<slot name='name'></slot>
					<br>
					<slot name='tel'></slot>
				</span>
			</div>

			<!-- 右箭头 -->
			<i class="iconfont icon-youjiantou"></i>
		</div>


		<!-- 菜单 -->
		<div class="menus" v-for="(item, i) in menus" :key="i">
			<!-- 间隔 -->
			<div class="gap"></div>

			<!-- 设置 -->
			<div class="menu" @click="jumpTo(item.link)">
				<span>
					<i :class="['iconfont', item.icon]"></i>
					<span class="title">{{ item.title }}</span>
				</span>

				<i class="iconfont icon-youjiantou"></i>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'user',

		data() {
			return {
				menus: [
					{'title': '设置', 'icon':'icon-config--shixin', 'link': "/setting"},
					{'title': '账簿管理', 'icon':'icon-shu', 'link': "/accountAdmin"},
					{'title': '意见反馈', 'icon':'icon-xinfeng', 'link': "/feedback"},
				]
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
/*用户信息*/
.info{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15px 10px;
	border-bottom: solid 1px #ddd;
	border-top: solid 1px #ddd;
}

/*头像*/
.info .img{
	display: inline-block;
	font-size: 0;
	background-color: #E4E4E4;
	padding: 10px;
	border-radius: 5px;
	border: solid 1px #ccc;
	vertical-align: middle;
}

.info img{
	width: 40px;
}

/*昵称、手机号*/
.info .name_tel{
	display: inline-block;
	vertical-align: middle;
	margin-left: 12px;
}

.info .tel{
	font-size: 14px;
	color: #aaa;
}

.info .icon-youjiantou{
	font-weight: bold;
	color: #aaa;
}
</style>