<template>
  <div>
	<div class="ui segment">
		<div class="ui grid">
			<div class="four wide column"></div>
			<div class="eight wide column">
				<button class="btn btn-block btn-default" @click="upload.show=true">提交开业相关资料</button>
			</div>
			<div class="four wide column"></div>
		</div>
	</div>	  
	<div class="ui segment">
		<Timeline>
			<Timeline-item :color="t.status=='已完成'?'grean':'red'" v-for="t of tasks">
				<Icon v-if="t.status=='已完成'" color="green" type="ios-trophy" slot="dot"></Icon>
				<p class="time" v-html="t.time"></p>
				<span :class="{'text-danger':t.status=='完成确认未通过，待重新申请','text-success':t.status=='已完成'}" v-html="status_generate(t)"></span>
				<div class="content" id="box" :class="{'ui teal message':t.status=='已完成','ui pink message':t.status=='已申请完成，待审核','ui orange message':t.status=='待申请完成'||t.status=='完成确认未通过，待重新申请'}">
					<tooltip effect="scale" placement="bottom" content="请在完成后，打勾申请完成">
						<checkbox @click="checked(t)" class="finish" :disabled="t.status=='已完成'||t.status=='已申请完成，待审核'" :checked.sync="t.isfinish" type="primary">完成</checkbox>
					</tooltip>
					<div class="content">
						<div class="header">
							工作内容
						</div>
						<ul class="list">
							<li  v-for="con of plans[t.time]">{{con}}</li>
						</ul>
					</div>
				</div>	
			</Timeline-item>
		</Timeline>
	</div>
    <modal :title="upload.title" :show.sync="upload.show" effect="zoom" large>
			<div slot="modal-body" class="modal-body">
					<table class="ui single line table">
						<thead>
							<tr>
								<th>文件名称</th>
								<th>提交形式</th>
								<th>提交结果</th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="f of files">
								<td>{{f.name}}</td>
								<td>{{f.form}}</td>
								<td>
									<Tag color="success"  v-if="f.result">{{f.result}}</Tag>
									<Tag color="error" v-else>待提交</Tag>
								</td>
								<td>
									<Upload
										:format="f.type"
										:on-format-error="handleFormatError"
										:max-size="204800"
										:on-exceeded-size="handleMaxSize"
										:data="{resourceUrl: 'preparationFiles/'+select.code,filename: f.name}"
										:on-success="handleSuccess(f)"
										action="https://tlgc.thelittlegym.com.cn/api/oss">
										<button type="button" class="btn btn-default">
											<span class="glyphicon glyphicon-cloud-upload" aria-hidden="true"></span> Upload
										</button>
									</Upload>
								</td>
							</tr>
						</tbody>
					</table>
			</div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-primary" @click="upload.show=false;">退出</button>
            </div>
    </modal>
	<alert :show.sync="error.show" placement="top" duration="3000" type="danger" width="400px" dismissable>
	<span class="glyphicon glyphicon-info-sign alert-icon-float-left"></span>
	<strong>Heads up!</strong>
	<p>{{error.msg}}</p>
	</alert>
  </div>
</template>

<script>
	import Timeline from 'src/timeline/index.js';
	import Icon from 'src/icon/index.js';
	import TimelineItem from 'src/timeline-item/index.js';
	import ITable from 'src/table/index.js';
	import Upload from 'src/upload/index.js';
	import IButton from 'src/button/index.js';
	import Tooltip from 'src/Tooltip.vue';
	import modal from '@/src/Modal.vue';
	import Checkbox from 'src/Checkbox.vue';
	import alert from '@/src/Alert.vue';
    import Tag from 'src/tag';
	import qs from 'qs';

    export default {
		components: {
			Timeline,
			TimelineItem,
			Tooltip,
			Checkbox,
			modal,
			Upload,
			IButton,
			ITable,
			Icon,
			alert,
			Tag 
		},
		props: {
			select: {
		    	type:Object
			}
		},
		data(){
			return  { 
				error:{show:false,msg:""},
				files:[
					{name:'中心价目表',form:'Excel表格（仅支持上传一个文件）',type:['xls','xlsx'],result:""},
					{name:'中心排课表',form:'Excel表格（仅支持上传一个文件）',type:['xls','xlsx'],result:""},
					{name:'开业申请表',form:'Excel表格（仅支持上传一个文件）',type:['xls','xlsx','jpg','jpeg','png','pdf'],result:""},
					{name:'营业执照',form:'电子照片或扫描件/压缩包（仅支持上传一个文件）',type:['jpg','jpeg','png','pdf','zip','rar','tar.gz','7z'],result:""},
					{name:'中心场地租凭协议',form:'电子照片或扫描件/压缩包（仅支持上传一个文件或打包文件）',type:['jpg','jpeg','png','pdf','zip','rar','tar.gz','7z'],result:""},
					{name:'保险合同扫描件',form:'电子照片或扫描件（仅支持上传一个文件',type:['jpg','jpeg','png','pdf'],result:""},
					{name:'中心消防合格证',form:'电子照片或扫描件（仅支持上传一个文件）',type:['jpg','jpeg','png','pdf'],result:""},
					{name:'让渡协议',form:'电子照片或扫描件/压缩包（仅支持上传一个文件或打包文件）',type:['jpg','jpeg','png','pdf','zip','rar','tar.gz','7z'],result:""},
					{name:'承诺函',form:'电子照片或扫描件（仅支持上传一个文件）',type:['jpg','jpeg','png','pdf'],result:""},
					{name:'中心照片（打包）',form:'电子照片或压缩包（仅支持上传一个文件或打包文件）',type:['jpg','jpeg','png','zip','rar','tar.gz','7z'],result:""}
				],
				visible: false,
				tasks:[],
				upload:{
					show:false,
					title:"上传文件"

				},
				plans:{
                   "Week 1": ["运营培训：启动培训，发出调研表格，Owner需要着手兼职的招聘； 薪酬结构框架图片要给到Owner，跟直营具体的薪酬结构（启动邮件中）结合来说；PD和GD的画像分别给到Owner，了解主要管理人员招聘时关注的问题；调研表格（市场+薪酬），薪酬调研（包括常用招聘渠道/对手品牌薪酬水平/当地的薪资水平）培训部和招聘部的启动培训预约完成。"],
                   "Week 2": [
                               "市场: 第一轮检查调研情况，了解哪些部分拿不到信息的原因（第一周先确认渠道是否可以做，第二周必须拿到价格） 重点是社区，线上热门平台，3公里以内人流密集点活动位置。其中，成熟商场和未开业商场分开调研；微信小号需要申请。当地市场调研（客户画像）的方法要清楚，例如手机平台扫码可以拿礼物，调研地点选择中心周边人流量非常密集的地方，确认学费/关注获得亲子或是课程渠道/关注点/当地热门的品牌。 联系总部的仓库购买小型礼物；",
                               "市场培训：预约进行地推线上培训。",
							   "招聘：招聘渠道需要开通完成，加盟商无论开通什么渠道，总部招聘都会帮忙打理招聘网站（总部更专业）以及简历转发，和一部分的电话邀约。"
                  	],
                   "Week 3": ["市场：完善市场调研，提交到筹备群里；根据调研来制定市场计划，明确进度表；客户画像推进；",
                              "运营：请Owner做作薪酬结构预案。"
							 ],
                   "Week 4": ["市场：市场计划明确进度；落地客户画像，Owner培训兼职；",
				              "运营培训：培训“中心日常工作分配要点”中心日常工作时间分配要点.png，帮助Owner做排班表（前提要有老师）；Review薪酬方案。"
							 ],
                   "Week 5": ["运营：市场调研（客户画像）数据整理；",
				              "市场：地推活动开展（可以包括客户画像的推进），拿例子持续到落地培训有老师通过（派发和展示为主）。"
				             ],
                   "Week 6": ["课程培训：服务意识/销售心态 落地培训前五天在线培训时给到；",
				              "市场：品牌无纺布袋输出；品牌宣传折页输出；市场活动礼物订购。"
				             ],
                   "Week 7&8": ["总部落地培训及考核","课程培训：“课程环节Benefit” 录屏给到销售型老师，在周五运营培训时给到他们看。同时配合真实的课程视频课程环节Benefit。"],
                   "Week 9": [
                             "市场: 线下市场活动开始带技能活动（持续密集型，每周都要有）；微信小号需要加市场活动中的潜在例子，朋友圈要进行美国风品牌内容进行每天推送（60份内容）；",
                             "运营：预售卡方案制定和推送；市场活动后的例子尽快录入系统；拿到例子后，最晚在第二天电话给到家长感谢家长的关注，并且告知近期活动的地点，邀请家长的再次参与，保持互动；",
                             "课程培训：市场活动Skill的介绍话术给到中心；中心Announcement 需要完成视频录制（视频需至少由两位老师完成，涵盖怪兽、趣味小虫和学龄班三个年龄阶段）并加密上传优酷审核。"
                  	    ],
                   "Week 10": ["运营：培训及抽查 OASIS老师日常操作专项（Daily Phone call）；OASIS中心负责人日常管理报表使用专项，抽查GD/PD/销售；",
				               "销售培训： 每个年龄阶段家长的潜在需求、孩子的发展里程碑的销售卡片形式落实中心培训。"],
                   "Week 11": ["市场：可以尝试已有的例子库里进行线上接红包游戏推送；新中心开业套装给到中心；"],
                   "Week 13": ["运营培训：线上培训GD“预售前一周的培训计划/预售前数据要求；确认价格表和排课表的制定；"],
                   "Week 14": ["运营：确认开始预售前一周的培训计划执行；运营抽查：路过沟通流程/体验接待流程。"],
                   "Week 15": ["运营培训：OASIS系统设置（价格和排课）"],
                   "Week 16": [
                               "运营考核及培训：邀约电话和体验确认电话线上抽查；培训“GD课前中后必做要点”；",
                               "课程：运营顾问和培训师一起和Owner进行的Fast Start的电话会议沟通，确定FS重点关注的地方和培训方向。"
                  		], 
                   "Week 17":["（预售）市场：线上活动 打卡有礼；",
				              "培训师：FS期间梳理中心标准运营流程和管理方式 ；评估中心课程质量，并协助制定培训方向和相关计划，以确保中心的课程质量得以持续提升（相关工具：Q3、FS反馈邮件）。"
				        ]
				}
			}
		},
		computed:{
		},
		methods:{
			getTasks:function(){
				var sql=sql_getTasks;
				var my=this;
				sql=sql.replace("@idgym",this.select.idgym);
				sql=this.convertor.ToUnicode(sql);
				this.$axios.get(url_local,{
					params:{sql1:sql}
				})
				.then(function(res){
					if(res.status==200 && res.data.errcode==0){
						my.tasks=res.data.arr;
					}  
				},function(res){
					console.error(res);
				});
			},
            handleFormatError (file) {
				this.error.msg="文件格式不正确";
				this.error.show=true;
			},
            handleMaxSize (file) {
				this.error.msg="超出文件大小限制(最大200M)";
				this.error.show=true;
			},
            handleSuccess (f) {
				var self=this;
				return function (res, file){
				    // console.log(res.data)
					if(res.success){
						file.url = res.data['oss-request-url'];
						if(res.data['oss-stringtosign']&&self.getFileName(res.data['oss-stringtosign'])){
						   file.name = self.getFileName(res.data['oss-stringtosign']);
						}
						f.result="已提交"
					}
				}
			
			},
			getFileName:function(path){
				let res=path.match(/\/([^\/]*)$/);
				if(res){
				  return res[1];
				}else{
				  return null;
				}
			},
			checked: function (t) {
				if(t.isfinish) return;
				var sql=sql_confirm;self=this;
				sql=sql.replace(/@id/g,t.id).replace(/@gymcode/g,t.code).replace(/@wk/g,t.time);
				sql=this.convertor.ToUnicode(sql);
				this.$axios.get(url_local,{
					params:{sql1:sql}
				})
				.then(function(res){
					if(res.status==200 && res.data.errcode==0){
					  let sql=sql_infoaudit.replace(/@idgym/,self.select.idgym);	
					  sql=sql.replace(/\+/g,"add;")
					  sql=self.convertor.ToUnicode(sql);
					  let content=`dblquot;${t.gym}dblquot;已完成筹备任务${t.time},请及时审核！`;
					  content=self.convertor.ToUnicode(content);
					  let title="中心筹备进展审核提醒";
					  title=self.convertor.ToUnicode(title);
					  // console.error(t)
					  self.infoAudit(sql,content,title);	
					  self.getTasks();
					}  
				},function(res){
					console.error(res);
				});
			},
			getOss: function () {
				let url="https://tlgc.thelittlegym.com.cn/api/oss";
				let self=this;
				this.$axios.get(url,{
					params:{resourceUrl:`preparationFiles/${this.select.code}`}
				})
				.then(function(res){
					if(res.status==200){
						let data = res.data && res.data.data;
						self.files.map(function(f){
							if(data && Array.isArray(data) && data.findIndex(function(row){
								return row.name.indexOf(f.name)!=-1;
							})!=-1){
								f.result="已提交";
							}
						})
					}  
				},function(res){
					console.error(res);
				});
			},
			infoAudit: function (sql,content,title) {
				let url="https://bbk.800app.com/uploadfile/staticresource/238592/279833/api_member_set_xcx.aspx?obj=mail_sms_sql";
				let self=this;
				this.$axios.get(url,{
					params:{sql,content,title}
				})
				.then(function(res){
					if(res.status==200){
                       console.log(res.data);
					}  
				},function(res){
					console.error(res);
				});
			},
			status_generate:function(t){
                var mess=t.status;
				mess+=t.reason?('  原因：'+t.reason):'';
				//if() mess='<font color=red>'+mess+'</font>';
				return mess;
			}
		},
		ready(){
			this.getTasks();
			this.getOss();
		},
	}
 </script>
 <style scoped>
    .time{
        font-size: 14px;
        font-weight: bold;
    }
	.ivu-icon{
		font-weight: 600;
	}
    .content{
        padding-left: 5px;
    }
	ol li{ list-style-position:outside;}  
	[v-cloak]{
	   display:none
	}

	.ui .checkbox {
		/* //border:  solid red 4px ; */
		margin-right: 20px !important;
	}
	 .table>tbody>tr>td, .table>tfoot>tr>td{
		padding-bottom: 0!important;
		vertical-align: middle!important;
	}
	.dt-input {
		cursor: pointer;
	}
    .list{
		font-size: 13px;
	}
	alert {
		font-size: 3em;
	}
	.finish {
		float: right;
		font-size: 21px;
		font-weight: bold;
		line-height: 1;
	}
	.alert-icon-float-left {
		font-size:23px;
		float:left;
		margin-right:5px;
	}
</style>