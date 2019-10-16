<template>
    <div class='incompatible'>
        <div id="box"  :class="isCheck?'ui teal message':'ui orange message'">
            <tooltip effect="scale" placement="bottom" content="完成后请打勾">
                <checkbox @click="checked()" class="finish" :disabled="isCheck" :checked.sync="isCheck" type="primary">完成</checkbox>
            </tooltip>
            <div class="content">
                <div class="header">
                    {{title}}
                </div>
                <ul class="list">
                    <li v-for="d of data[wk%7]">
                        <div v-html="d.txt"></div>
                        <ol class="list" v-if="d.subtxt">
                            <li v-for="s of d.subtxt" v-html="s"></li>
                        </ol>
                    </li>
                </ul>
            </div>
            <alert :show.sync="error.show" placement="top" type="danger" width="400px" dismissable>
                <span class="glyphicon glyphicon-info-sign alert-icon-float-left"></span>
                <strong>工作提醒</strong>
                <p style="font-size:1.1em">
                    <span>{{error.content}}</span>
                     <a class="text text-danger" href="https://bbk.800app.com/uploadfile/staticresource/238592/279833/campaign.html#!/home/2" target="_blank">>>转到家庭</a>
                </p>
            </alert>

            <alert :show.sync="showTop" placement="top" type="info" width="650px" class="alert" dismissable>
                <div class="ui" v-show="showzk">
                    <span class="glyphicon glyphicon-info-sign"></span>
                    <strong>转课待处理</strong>
                    <ul class="ui">
                            <li v-for="s of data_zk">
                                <label v-html="s.msg"></label><a class="text text-danger" @click.prevent='toFamily(`https://bbk.800app.com/index.jsp?mlist=1&mfs1=crm_sj&menu=3&mid=${s.id}`)'
                                    >转到家庭</a>
                            </li>
                    </ul>
                </div>
                <div v-show="showYuyue" class="ui">
                    <span class="glyphicon glyphicon-info-sign"></span>
                    <strong>官网预约体验"未处理"</strong>
                    <ul class="ui">
                        <li v-for="s of data_yuyue">
                            <label >你有官网预约未处理，家长手机:{{s.phone}},孩子姓名：{{s.babyname}},</label><a class="text text-danger" href="https://bbk.800app.com/uploadfile/staticresource/238592/279833/campaign.html"
                                    target="_blank">前往处理</a>
                        </li>
                    </ul>
                </div>

                    <div v-show="showDaily" class="ui">
                    <span class="glyphicon glyphicon-info-sign"></span>
                    <strong>每日安全检查</strong>
                    <ul class="ui">
                        <label>您今日{{pm}}的安全检查未执行.</label><a class="text text-danger" href="https://bbk.800app.com/uploadfile/staticresource/238592/279833/trainingDaily_C.html" target="_blank">中心每日安全检查</a>
                    </ul>
                </div>
                <embed class='incompatible' id="music" src="" width="0" height="0">
            </alert>
            <!-- 接收确认 -->
            <alert placement="top" type="warning" width="400px" :show.sync="revWarn.aftershow" duration=3400 dismissable>
            <strong>{{revWarn.afterwarn}}</strong>
            </alert>
            <modal :show.sync="revWarn.show" effect="fade" width="400px">
            <div slot="title" class="modal-title">
                    <span class="glyphicon glyphicon-info-sign text-danger"></span>
                    <b  class="text-danger" v-text="revWarn.title"></b> 
            </div>
            <div slot="modal-body" class="modal-body">
                <h4><b>{{revWarn.content}}</b></h4>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <a class="btn btn-success" :href="revWarn.url" target="_blank" @click="revWarn.show = false">是</a>
                <button type="button" class="btn btn-default" @click="negative()">否</button>
            </div>
            </modal>
        </div>
    </div>
</template>

<script>
	import alert from '@/src/Alert.vue'
	import tooltip from '@/src/Tooltip.vue'
    import checkbox from '@/src/Checkbox.vue'
    import modal from '@/src/Modal.vue';
	import qs from 'qs';

    export default {
            components: {
                tooltip,
                checkbox,
                alert,
                modal
            },
            props: {
                select: {
                    type:Object
                }
            },
            data:function() {
				return	{
                    title:"工作内容",
                    revWarn:{show:false,url:"",title:"转课接收提示",content:"接收中心请确认是否已经收到全额转课款项？",aftershow:false,afterwarn:"请确认收到全额转课款项，再进行oasis合约接收操作!"},
					weeknum: null,
					isCheck: false,
					showTop: false,
					showYuyue: false,
                    showzk:false,
                    showDaily:false,
                    pm:null,
					idgym: "",
					gym: "",
                    role: "",
                    error:{show:false,content:""},
					data_gd: [
						[
							{ txt: "要求所有人必须在大厅" },
							{ txt: "换设备；检查设备安全" },
							{ txt: "打印并分配<a target='_blank' href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportDailyPhoneCall.aspx'>每日电话报表</a>（本周六、日， 下周一）；下周二的可放在周一打" },
							{ txt: "未报名的做好Comments" },
							{ txt: "检查本周合同输入系统；（利用<a href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportContractDetail.aspx' target='_blank'>中心课程合同详情报表</a>报表）" },
							{ txt: "检查课程考勤表做入系统；（利用<a href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportClassRoster.aspx' target='_blank'>课程考勤表</a> '遗漏考勤课时'和'班级上课日期'，课后及时沟通未出席家长）" },
							{ txt: "检查当天所有例子输入系统" },
							{ txt: "打印本周五、本周六、下周一<a target='_blank' href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportDailyPhoneCall.aspx'>每日电话报表</a>" },
							{ txt: "打印下周一<a href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportClassRoster.aspx' target='_blank'>课程考勤表</a>" }
						],
						[
							{ txt: "转移人数多的班级的孩子；升班或调时间；" },
							{ txt: "查看<a target='_blank' href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportNeedFollowUp.aspx'>需要跟进续报家庭</a>和<a target='_blank' href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportColudBeDelayed.aspx'>可能来不及上完课的家庭</a>" },
							{ txt: "导出<a target='_blank' href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportInquiryButNoIntro.aspx'>未体验且未在将来预约体验孩子清单</a>（之前某段时期），分配老师打邀约电话；" },
							{ txt: "导出<a target='_blank' href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportIntroButNeverEnrolled.aspx'>体验后未报名孩子清单</a>（之前某段时期）" },
							{ txt: "分配偏销售老师或销售主管打电话；" },
							{ txt: "督促老师培训、打电话；" },
							{ txt: "打印周二<a href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportClassRoster.aspx' target='_blank'>课程考勤表</a>；" },
							{ txt: "确认所有的例子都得到及时的跟踪和消化（利用<a target='_blank' href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportIntroLog.aspx'>体验清单</a>报表，每周导出跟进）" }
						],
						[
							{ txt: "查看体验邀约量；" },
							{ txt: "搜索简历，打面试电话；" },
							{ txt: "打印周三<a target='_blank' href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportDailyPhoneCall.aspx'>每日电话报表</a>并分配好；" },
							{ txt: "打印周三<a href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportClassRoster.aspx' target='_blank'>课程考勤表</a>；" },
							{ txt: "督促老师培训、打电话；" }
						],
						[
							{ txt: "查看体验邀约量；" },
							{ txt: "督促老师培训、打电话；" },
							{ txt: "打印周四<a target='_blank' href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportDailyPhoneCall.aspx'>每日电话报表</a>并分配好；" },
							{ txt: "打印周四<a href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportClassRoster.aspx' target='_blank'>课程考勤表</a>；" },
							{ txt: "周五、六的<a target='_blank' href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportDailyPhoneCall.aspx'>每日电话报表</a>中的明天体验部分打出来，并分配好；" }
						],
						[
							{ txt: "查看体验邀约量；" },
							{ txt: "督促老师培训、打电话；" },
							{ txt: "打印周五<a target='_blank' href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportDailyPhoneCall.aspx'>每日电话报表</a>并分配好；" },
							{ txt: "打印周五<a href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportClassRoster.aspx' target='_blank'>课程考勤表</a>；" },
							{ txt: "周四确认周末体验的电话，确认周末体验数量和情况，再加紧预约；" },
							{ txt: "面试；" }
						],
						[
							{ txt: "督促老师培训、打电话；" },
							{ txt: "发送周六和周日体验确认短信；" },
							{ txt: "若发现体验人数不够，则再导出名单（之前某段时期的，咨询未体验）继续邀约；" },
							{ txt: "打印周六<a target='_blank' href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportDailyPhoneCall.aspx'>每日电话报表</a>并分配好；" },
							{ txt: "打印周六<a href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportClassRoster.aspx' target='_blank'>课程考勤表</a>；" },
							{ txt: "检查周六、日签单所需物品；" },
							{ txt: "布置周六生日会（若有）；" }
						],
						[
							{ txt: "分例子很重要，所有的例子分配必须在Midannouncement之后由GD统一分配" },
							{ txt: "每个体验跟完后必须在oasis里面做好comments" },
							{ txt: "要求所有老师必须在大厅里；" },
							{ txt: "市场活动（若有）；" },
							{ txt: "打周日未接的体验确认电话；（在周四，最晚周五打完）" },
							{ txt: "再发送一次周日体验确认短信；（周五全部发完）" },
							{ txt: "打印周日<a href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportClassRoster.aspx' target='_blank'>课程考勤表</a>；" },
							{ txt: "和约好周日来报名家长确认；" },
							{ txt: "布置周日生日会；" }
						]
					],
					data_pd: [
						[
							{ txt: "完成自身授课任务" },
							{ txt: "指导师课程的Q3考核" },
							{ txt: "根据中心市场活动及排班需要检查下周课表安排" },
							{ txt: "交谈、回访等方式与家长建立关系" },
							{ txt: "查看邮件、企业微信群获取TLGI、TLGC课程相关信息，并及时告知团队成员" }
						],
						[
							{ txt: "教学例会（如周日未进行）" },
							{ txt: "安排课程音乐的下载和准备（如周日未进行）" },
							{ txt: "根据教案需求组织老师调整设备和归置教具（如周日未进行）" },
							{ txt: "协助中心GD进行OASIS系统每日电话报表的管控" },
							{ txt: "交谈、回访等方式与家长建立关系" },
							{ txt: "查看邮件、企业微信群获取TLGI、TLGC课程相关信息，并及时告知团队成员" },
							{ txt: "检查、督促、推进团队成员<a href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportProgress.aspx' target='_blank'> OTS培训进度及完成情况</a>" },
							{ txt: "新员工入职培训（如有新员工入职）" },
							{ txt: "每日1：00-3：00（或者其他时间）组织中心老师集体演练或培训，每天保证有至少一个小时时间。" },
							{ txt: "新员工Mentor进行沟通了解新员工当天工作、培训情况（如有新员工入职）" }
						],
						[
							{ txt: "安排指导师使用备课表准备下周课程内容" },
							{ txt: "组织进行面试" },
							{ txt: "中心培训" },
							{ txt: "协助中心GD进行OASIS系统每日电话报表的管控" },
							{ txt: "交谈、回访等方式与家长建立关系" },
							{ txt: "查看邮件、企业微信群获取TLGI、TLGC课程相关信息，并及时告知团队成员" },
							{ txt: "检查、督促、推进团队成员OTS培训进度及完成情况" },
							{ txt: "新员工入职培训（如有新员工入职）" },
							{ txt: "每日1：00-3：00（或者其他时间）组织中心老师集体演练或培训，每天保证有至少一个小时时间" },
							{
								txt: "与新员工Mentor进行沟通了解新员工当天工作、培训情况（如有新员工入职）如之前未完成，则需补齐以下事项：", subtxt: ["教学例会（如未进行）",
									"安排课程音乐的下载和准备（如未进行）",
									"根据教案需求组织老师调整设备和归置教具（如未进行）"]
							}
						],
						[
							{ txt: "督促老师完成下周备课，并填写每周备课表，待周五群内提交" },
							{ txt: "将每个班级选择一份备课表并发送至中心内部沟通群中，确保课程宣讲的正确、保质进行" },
							{ txt: "协助中心GD进行OASIS系统每日电话报表的管控" },
							{ txt: "交谈、回访等方式与家长建立关系" },
							{ txt: "查看邮件、企业微信群获取TLGI、TLGC课程相关信息，并及时告知团队成员" },
							{ txt: "检查、督促、推进团队成员<a href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportProgress.aspx' target='_blank'> OTS培训进度及完成情况</a>" },
							{ txt: "新员工入职培训（如有新员工入职）" },
							{ txt: "每日1：00-3：00（或者其他时间）组织中心老师集体演练或培训，每天保证有至少一个小时时间。" },
							{
								txt: "与新员工Mentor进行沟通了解新员工当天工作、培训情况（如有新员工入职）如之前未完成，则需补齐以下事项：", subtxt: ["教学例会（如未进行）",
									"安排课程音乐的下载和准备（如未进行）",
									"根据教案需求组织老师调整设备和归置教具（如未进行）"]
							}
						],
						[
							{ txt: "回收指导师下周教案备课表并进行审查（最晚要在周五前回收）" },
							{ txt: "将每个班级选择一份备课表并发送至中心内部沟通群中，确保课程宣讲的正确、保质进行" },
							{ txt: "协助中心GD进行OASIS系统每日电话报表的管控" },
							{ txt: "交谈、回访等方式与家长建立关系" },
							{ txt: "查看邮件、企业微信群获取TLGI、TLGC课程相关信息，并及时告知团队成员" },
							{ txt: "检查、督促、推进团队成员<a href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportProgress.aspx' target='_blank'> OTS培训进度及完成情况</a>" },
							{ txt: "新员工入职培训（如有新员工入职）" },
							{ txt: "每日1：00-3：00（或者其他时间）组织中心老师集体演练或培训，每天保证有至少一个小时时间。" },
							{ txt: "与新员工Mentor进行沟通了解新员工当天工作、培训情况（如有新员工入职）" }
						],
						[
							{ txt: "回收指导师下周教案备课表并进行审查" },
							{ txt: "将每个班级选择一份备课表并发送至中心内部沟通群中，确保课程宣讲的正确、保质进行" },
							{ txt: "协助中心GD进行OASIS系统每日电话报表的管控" },
							{ txt: "交谈、回访等方式与家长建立关系" },
							{ txt: "查看邮件、企业微信群获取TLGI、TLGC课程相关信息，并及时告知团队成员" },
							{ txt: "检查、督促、推进团队成员<a href='https://bbk.800app.com/uploadfile/staticresource/238592/279833/reportProgress.aspx' target='_blank'> OTS培训进度及完成情况</a>" },
							{ txt: "新员工入职培训（如有新员工入职）" },
							{ txt: "每日1：00-3：00（或者其他时间）组织中心老师集体演练或培训，每天保证有至少一个小时时间。" },
							{ txt: "与新员工Mentor进行沟通了解新员工当天工作、培训情况（如有新员工入职）" }
						],
						[
							{ txt: "完成自身授课任务" },
							{ txt: "指导师课程的Q3考核" },
							{ txt: "交谈、回访等方式与家长建立关系" },
							{ txt: "查看邮件、企业微信群获取TLGI、TLGC课程相关信息，并及时告知团队成员" }
						]
					],
					data: [],
					data_zk: [],
					data_yuyue: []
				}
			},
            computed: {
                wk: function () {
                    var mydate = new Date();
                    //return 4;
                    return this.weeknum || mydate.getDay() || 7
                }
            },
            watch: {
                "select.ispreparing":{
                    handler(newValue, oldValue) {
                        if(newValue==0){
                           this.getchkRec_jsonp()
                           this.getYuyue();
                           this.getCampaignTip();
                           this.getDaily();
                        }
            　　　   },
            　　　   deep: true
                }
            },
            methods: {
                toFamily:function(url){
                    this.revWarn.url=url;
                    this.revWarn.show=true;
                    this.revWarn.aftershow=false;
                },
                negative(){
                    this.revWarn.show=false;
                    this.revWarn.aftershow=true;
                    console.error(this.revWarn)
                },
                showAlert: function () {
                    this.$set('alertIsOpen', true);
                },
                showDialog: function () {
                    this.$set('showCustomModal', true);
                },
                showZKDialog: function () {
                    this.$set('showTop', true);
                },
                getchkRec_jsonp: function () {
                    var self = this;
                    sql_getzk=sql_getzk.replace(/iduser/g,self.select.iduser);
                    self.$http.jsonp(url_jsonp, {
                        sql1: sql_getchkRec
                    }, {
                            jsonp: 'callback'
                        }).then(function (res) {
                            var res = res.data.info[0].rec;
                            if (res[0]) {
                                res = res[0]
                            }
                            if (res && typeof res != "string") {
                                self.weeknum = res.weeknum;
                                self.isCheck = res.id == 0 ? false : true;
                                self.idgym = res.idgym;
                                self.gym = res.gym;
                                self.role = res.crm_jiandang;
                                if (self.role == "课程主管") {
                                    self.data = self.data_pd;
                                    sql_check = sql_check.replace('@type', 'pd');
                                } else if(self.role.indexOf("中心运营总监")!=-1) {
                                    self.data = self.data_gd;
									sql_check = sql_check.replace('@type', 'gd');
									self.getzk();
								}else{
                                    self.data=[];
                                    self.title="每日安全检查";
                                }
                            }
                        }, function (res) {
                            //alert(res.status);
                        });
                },
                getzk: function () {
                    var self = this;
                    sql_getzk=sql_getzk.replace(/iduser/g,self.select.iduser);
                    var sql_zk = GB2312UnicodeConverter.ToUnicode(sql_getzk);
                    self.$http.jsonp(url_jsonp, {
                        sql1: sql_zk
                    }, {
                            jsonp: 'callback'
                        }).then(function (res) {
                            var res = res.data.info[0].rec;
                            if (res[0]) {
                                if (res[0].msg) {
                                    self.data_zk = res;
                                    self.showzk=true;
                                    self.showTop = true;
                                    document.getElementById("music").src = "https://static.thelittlegym.com.cn/assert/audio/zhuankeinfo.mp3";
                                }
                            }
                            if (res && typeof res != "string") {
                                //self.inp=res.msg;
                            };
                            //console.log(JSON.stringify(self.inp));
                        });
                },
                //官网预约查询
                getYuyue: function () {
                    var self = this;
                    var sql = sql_getyuyue.replace(/iduser/g,self.select.iduser);
                    sql = GB2312UnicodeConverter.ToUnicode(sql);
                    self.$http.jsonp(url_jsonp, {
                        sql1: sql
                    }, {
                            jsonp: 'callback'
                        }).then(function (res) {
                            var res = res.data.info[0].rec;
                            if (res[0]) {
                                if (res[0].phone) {
                                    self.data_yuyue = res;
                                    self.showTop = true;
                                    self.showYuyue = true;
                                    //document.getElementById("music").src = "https://static.thelittlegym.com.cn/assert/audio/zhuankeinfo.mp3";
                                }
                            }
                            if (res && typeof res != "string") {
                                //self.inp=res.msg;
                            };
                        });
                },
        
                getDaily:function(){
                    var self=this
                     var hour = new Date().getHours();
                     var minute=new Date().getMinutes();
                     if(hour<8 ||(hour==8 && minute<30)){ //早上8:30前不提醒
                         self.showDaily=false;
                         return false;
                     }
                     var date=new Date();
                     var year=date.getFullYear();
                     var month=date.getMonth()+1;
                     var day=date.getDate();
                     if( hour<14){//上午
                     self.pm="上午";
                      var sql = sql_getdaily.replace(/iduser/g,self.select.iduser).replace(/@column/g,'classam').replace(/@date/g,year+'-'+month+'-'+day);
                      sql = GB2312UnicodeConverter.ToUnicode(sql);
                      self.$http.jsonp(url_jsonp, {
                        sql1: sql
                    }, {
                            jsonp: 'callback'
                        }).then(function (res) {
                            var res = res.data.info[0].rec;
                            if (res[0]) {
                                if (res[0].sum>0) {
                                    self.showDaily = true;
                                    self.showTop = true;
                                }
                            }
                          
                        });

                     }
                     if(hour>=14){//下午
                          self.pm="下午";
                      var sql = sql_getdaily.replace(/iduser/g,self.select.iduser).replace(/@column/g,'classam').replace(/@date/g,year+'-'+month+'-'+day);
                      sql = GB2312UnicodeConverter.ToUnicode(sql);
                      self.$http.jsonp(url_jsonp, {
                        sql1: sql
                    }, {
                            jsonp: 'callback'
                        }).then(function (res) {
                            var res = res.data.info[0].rec;
                            if (res[0]) {
                                if (res[0].sum>0) {
                                    self.showDaily = true;
                                    self.showTop = true;
                                }
                            }
                          
                        });
                     }
                },
                getCampaignTip: function () {
                    var self = this;
                    var sql = sql_campaignTip.replace(/iduser/g,self.select.iduser);
                    sql = GB2312UnicodeConverter.ToUnicode(sql);
                    self.$http.jsonp(url_jsonp, {
                        sql1: sql
                    }, {
                            jsonp: 'callback'
                        }).then(function (res) {
                            var res = res.data.info[0].rec;
                            if (res[0]) {
                                if (res[0].content) {
                                    self.error.content = res[0].content;
                                    self.error.show = true;
                                }
                            }
                            if (res && typeof res != "string") {
                                //self.inp=res.msg;
                            };
                        });
                },
                checked: function () {
                    if (this.isCheck) return;
                    this.$http.jsonp(url_jsonp, {
                        sql1: sql_check
                    }, {
                            jsonp: 'callback'
                        }).then(function (res) {
                        }, function (res) {
                            //alert(res.status);
                        });

                },
                debug: function () {
                    alert(JSON.stringify(this.data[this.wk % 7]))
                }
            }
    };

       
	setTimeout(function () {
		if(jQuery("#music")[0]&&jQuery("#music")[0].pause)jQuery("#music")[0].pause();
    }, 10000)
    
    </script>
	<style scoped>
        #box{
            padding-top:2%;
            min-height:365px!important; /*至少这个宽度，但超过也可以自动扩大*/
        }
        a:link{
           text-decoration:underline;
        }
        .content{
           font-size:1.4em!important;
        }
        .header{
            font-size:1.3em!important;
            margin-top:1.2%!important;
            margin-bottom:2%!important;
        }
        .list{
            margin-top:5%;
        }
        .list >li{
           line-height:120%;
        }
        .ui .checkbox {
            /* //border:  solid red 4px ; */
            margin-right: 20px !important;
        }
        .alert{
            font-size:1.2em!important;
        }
        .alert ul li{
            list-style: none;
        }
        .alert .ui{
            margin-top:2%!important;
        }
        .dt-input {
            cursor: pointer;
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