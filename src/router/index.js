import Vue from 'vue'
import Router from 'vue-router'


import register from '@/components/register' // 注册页面组件
import login from '@/components/login' // 登录页面组件
import resetPwd from '@/components/resetPwd' // 修改密码页面组件

import accountBook from '@/components/accountBook' // 记账首页

import checks from '@/components/checks' // 账面收支详情页
import checkFilter from '@/components/checkFilter' // 账面收支筛选页
import singleCheck from '@/components/singleCheck' // 记账单条详情页
import singleCheckUpdate from '@/components/singleCheckUpdate' // 记账单条修改页
import followBooking from '@/components/followBooking' // 后续记账页

import collections from '@/components/collections' // 待收 / 待付页

import booking from '@/components/booking' // 记一笔页面


import finance from '@/components/finance' // 财务页面

import assetsAccount from '@/components/assetsAccount' // 资产账户页面
import addAssetsAccount from '@/components/addAssetsAccount' // 添加资产账户页面
import assetsUpdate from '@/components/assetsUpdate' // 修改资产账户页面

import incomeTypes from '@/components/incomeTypes' // 收入类别页面
import addIncomeTypes from '@/components/addIncomeTypes' // 添加收入类别页面
import incomeUpdate from '@/components/incomeUpdate' // 修改收入类别页面

import outcomeTypes from '@/components/outcomeTypes' // 支出类别页面
import addOutcomeTypes from '@/components/addOutcomeTypes' // 添加支出类别页面
import outcomeUpdate from '@/components/outcomeUpdate' // 修改支出类别页面

import bookMember from '@/components/bookMember' // 记账成员页面
import addBookMember from '@/components/addBookMember' // 添加记账成员页面


import user from '@/components/user' // 用户页面

import userInfo from '@/components/userInfo' // 个人资料页面
import modifyName from '@/components/modifyName' // 修改昵称页面

import setting from '@/components/setting' // 设置页面
import modifyPwd from '@/components/modifyPwd' // 修改密码页面
import changeTel from '@/components/changeTel' // 更换手机页面

import accountAdmin from "@/components/accountAdmin" // 账簿管理
import addAccount from "@/components/addAccount" // 添加新账簿
import bookEdit from "@/components/bookEdit" // 添加新账簿

import feedback from '@/components/feedback' // 意见反馈页面



import top from '@/components/top' // 顶部菜单栏
import foot from '@/components/foot' // 底部菜单栏


Vue.use(Router)


export default new Router({
	routes: [{
		path: '/', // 首页跳转登录页
		redirect: 'login',
	}, {
		path: '/register', // 注册页
		name: 'register',
		component: register,
	}, {
		path: '/login', // 登录页
		name: 'login',
		component: login,
	}, {
		path: '/resetPwd', // 重置密码页
		name: 'resetPwd',
		component: resetPwd,
	}, {
		path: '/accountBook', // 记账页
		components: {
			'default': accountBook,
			'top': top,
			'foot': foot,
		}
	}, {
		path: '/booking', // 记一笔页
		name: booking,
		component: booking,
	}, {
		path: '/finance', // 财务页
		components: {
			'default': finance,
			'top': top,
			'foot': foot,
		}
	}, {
		path: '/user', // 用户页
		components: {
			'default': user,
			'top': top,
			'foot': foot,
		}
	}, {
		path: '/setting', // 设置页
		name: 'setting',
		component: setting,
	}, {
		path: '/modifyPwd', // 更换手机页
		name: 'modifyPwd',
		component: modifyPwd,
	}, {
		path: '/changeTel', // 修改密码页
		name: 'changeTel',
		component: changeTel,
	}, {
		path: '/userInfo', // 个人资料页
		name: 'userInfo',
		component: userInfo,
	}, {
		path: '/modifyName', // 修改昵称页
		name: 'modifyName',
		component: modifyName,
	}, {
		path: '/feedback', // 意见反馈页
		name: 'feedback',
		component: feedback,
	}, {
		path: '/accountAdmin', // 账簿管理页
		name: 'accountAdmin',
		component: accountAdmin,
	}, {
		path: '/addAccount', // 添加新账簿页
		name: 'addAccount',
		component: addAccount,
	}, {
		path: '/assetsAccount', // 资产账户页
		name: 'assetsAccount',
		component: assetsAccount,
	}, {
		path: '/addAssetsAccount', // 添加资产账户页
		name: 'addAssetsAccount',
		component: addAssetsAccount,
	}, {
		path: '/assetsUpdate', // 修改资产账户页
		name: 'assetsUpdate',
		component: assetsUpdate,
	}, {
		path: '/incomeTypes', // 收入类别页
		name: 'incomeTypes',
		component: incomeTypes,
	}, {
		path: '/outcomeTypes', // 支出类别页
		name: 'outcomeTypes',
		component: outcomeTypes,
	}, {
		path: '/addIncomeTypes', // 添加收入类别页
		name: 'addIncomeTypes',
		component: addIncomeTypes,
	}, {
		path: '/incomeUpdate', // 修改收入类别页
		name: 'incomeUpdate',
		component: incomeUpdate,
	}, {
		path: '/addOutcomeTypes', // 添加支出类别页
		name: 'addOutcomeTypes',
		component: addOutcomeTypes,
	}, {
		path: '/outcomeUpdate', // 修改支出类别页
		name: 'outcomeUpdate',
		component: outcomeUpdate,
	}, {
		path: '/bookMember', // 记账成员页
		name: 'bookMember',
		component: bookMember,
	}, {
		path: '/addBookMember', // 添加记账成员页
		name: 'addBookMember',
		component: addBookMember,
	}, {
		path: '/checks', // 账面收支详情页
		name: 'checks',
		component: checks,
	}, {
		path: '/checkFilter', // 账面收支筛选页
		name: 'checkFilter',
		component: checkFilter,
	}, {
		path: '/singleCheck', // 记账单条详情页
		name: 'singleCheck',
		component: singleCheck,
	}, {
		path: '/singleCheckUpdate', // 记账单条修改页
		name: 'singleCheckUpdate',
		component: singleCheckUpdate,
	}, {
		path: '/followBooking', // 后续记账页
		name: 'followBooking',
		component: followBooking,
	}, {
		path: '/bookEdit', // 修改账簿页
		name: 'bookEdit',
		component: bookEdit,
	}, {
		path: '/collections', // 待收 / 待付页
		name: 'collections',
		component: collections,
	}]
})