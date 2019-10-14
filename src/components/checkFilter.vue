<template>
	<div id="checkFilter">
		<div class="head">
			<i class="iconfont icon-zuojiantou" @click="$router.go(-1)"></i>

			<span>账面收支筛选</span>
		</div>

		<div class="menus">
			<div class="gap"></div>

			<!-- 收入支出 -->
			<div class="menu" @click="typeBoxDisplay='block'">
				<span>收入支出</span>

				<span>
					<span>{{ type.name }}</span>
					<i class="iconfont icon-youjiantou"></i>
				</span>
			</div>

			<!-- 收支类别 -->
			<div class="menu" @click="ioTypeBoxDisplay='block'">
				<span>收支类别</span>

				<span>
					<span>{{ ioType.name }}</span>
					<i class="iconfont icon-youjiantou"></i>
				</span>
			</div>
		</div>


		<div class="submit" @click="filterPost">筛选</div>

		<!-- 收支方式选择框 -->
		<div class="alertBox checkBox" :style="{'display': typeBoxDisplay}" @click.self="typeBoxDisplay='none'">
			<div class="alert">
				<label v-for="(item, i) in types" @click="type=item;typeBoxDisplay='none'">
					<input type="radio" name="type" :checked="i==0"><span>{{ item.name }}</span>
				</label>
			</div>
		</div>

		<!-- 收支类别选择框 -->
		<div class="alertBox checkBox" :style="{'display': ioTypeBoxDisplay}" @click.self="ioTypeBoxDisplay='none'">
			<div class="alert">
				<label v-for="(item, i) in ioTypes" @click="ioType=item;ioTypeBoxDisplay='none'">
					<input type="radio" name="ioType" :checked="i==0"><span>{{ item.name }}</span>
				</label>
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
		name: 'checkFilter',

		data() {
			return {
				types: [
					{'id':3, 'name': '不限'},
					{'id':1, 'name': '收入'},
					{'id':2, 'name': '支出'},
				],
				type: '',

				incomeTypes: [],
				outcomeTypes: [],
				orgTypes: [{'id': '', 'name': '不限'}],

				ioTypes: [],
				ioType: '',


				typeBoxDisplay: 'none', // 收支方式选择
				ioTypeBoxDisplay: 'none', // 收支类别选择框
			}
		},

		methods: {
			// 获取收支类别
			getIoTypes(type) {
				axios
					.get('http://jizhang-api-dev.it266.com/api/category?' + qs.stringify({
						'token': localStorage.getItem('cashBookToken'),
						'type': type,
						'dataType': 1,
					}))
					.then(res => {
						if (type == 1) {
							this.incomeTypes = res.data.data
							this.incomeTypes.unshift(this.orgTypes[0])
						}else {
							this.outcomeTypes = res.data.data
							this.outcomeTypes.unshift(this.orgTypes[0])
						}
					})
			},

			filterPost() {
				this.$router.push('/checks?' + qs.stringify({
					'type': this.type.id,
					'category_id': this.ioType.id,
				}))
			}
		},

		watch: {
			type: function(val) {
				switch (val.id) {
					case 1:
						this.ioTypes = this.incomeTypes
						break;
					case 2:
						this.ioTypes = this.outcomeTypes
						break;
					default:
						this.ioTypes = this.orgTypes
						break;
				}
				this.ioType = this.ioTypes[0]
			}
		},

		created() {
			this.type = this.types[0]
			this.ioTypes = this.orgTypes
			this.ioType = this.ioTypes[0]
			this.getIoTypes(1)
			this.getIoTypes(2)
		}
	}
</script>