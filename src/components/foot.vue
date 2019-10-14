<template>
	<van-tabbar id="foot" v-model="active" active-color="#0c79a2" inactive-color="#999">
		<van-tabbar-item v-for="(item, i) in menus" :key="i" :class="['footMenu', 'iconfont', item.icon]" :to="item.link">{{ item.title }}</van-tabbar-item>
	</van-tabbar>
</template>

<script>
	import Vue from 'vue'

	// Tabbar插件
	import { Tabbar, TabbarItem } from 'vant'
	Vue.use(Tabbar).use(TabbarItem)

	export default {
		name: 'foot',

		data() {
			return {
				// 底部菜单栏数据
				menus: [
					{'title': '记账', 'icon': 'icon-shuxie', 'link': '/accountBook'},
					{'title': '财务', 'icon': 'icon-shuben', 'link': '/finance'},
					{'title': '我', 'icon': 'icon-wo', 'link': '/user'},
				],

				// active: 0, // 选中的菜单之索引
			}
		},

		computed: {
			'active': {
				get: function(){
						return this.menus.findIndex(item => item.link == this.$route.path)
				},
				set: function(){
					return this.menus.findIndex(item => item.link == this.$route.path)
			}}
		}
	}
</script>

<style scoped>
#foot{
	display: flex;
	justify-content: space-between;
	width: 100%;
	position: fixed;
	bottom: 0;
	border-top: solid 1px #ddd;
	height: 54px;
}


.footMenu{
	width: 33.33%;
	text-align: center;
	font-size: 12px;
	padding: 5px 0px 7px;
}

.footMenu::before{
	font-size: 24px;
}


/*选中的菜单*/
.van-tabbar-item--active{
	background-color: #e8e8e8;
}
</style>