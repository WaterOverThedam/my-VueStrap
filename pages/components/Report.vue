<template>
    <div class="ui segments" v-show="pageShow">
        <div class="ui segment">
              <alert :show.sync="alertError.show" placement="top" type="danger" width="400px" dismissable>
                <span class="glyphicon glyphicon-info-sign alert-icon-float-left"></span>
                <strong>{{alertError.title}}</strong>
                <p style="font-size:1.5em" v-html="alertError.msg"></p>
              </alert>
              <div class="ui four column stackable grid">
                    <div class="column left aligned">
						<div class="input-group">
							<span class="input-group-addon">报表</span>    
                            <v-select @change="init()" placeholder="请选择报表" :value.sync="report_cur" :options="reports" options-label="label" options-value="id" close-on-select>
                            </v-select>
                        </div>
                    </div>
                    <div class="column left aligned">
						<div class="input-group" v-show="report_cur!='memberstat'">
								<div class="input-group">
									<span class="input-group-addon">活动</span>          
									<v-select v-if="false" :value.sync="select.group_cur" clearable :multiple="select.multi" placeholder="活动分类" :options="select.vgroup" options-label="name" options-value="name" @change="select.campaign_selected=[];" close-on-select>
									</v-select>					
									<i-select  :model.sync="select.campaign_selected" style="width:200px" placeholder="活动名称" multiple filterable>
										<Option-group v-for="g of select.vgroup" :label="g.name" v-if="cFilterby(campaigns,g)">
											<i-option v-for="item in cFilterby(campaigns,g)" :value="item.id">{{ item.name }}</i-option>
										</Option-group>
									</i-select>
								</div>
						</div>
                    </div>
                    <div class="column left aligned">
                        <div class="ui mini action input">
                              <datepicker :value.sync="dtStart" format="yyyy-MM-dd" :clear-button="clear" placeholder="开始日期" ch></datepicker>
                              -<datepicker :value.sync="dtEnd" format="yyyy-MM-dd" :clear-button="clear" placeholder="结束日期"></datepicker>
                            <div type="submit" @click="getQuery()" class="ui primary button"><i class="search icon"></i>搜索</div> 
                            <input id="Button1" type="button" class="ui positive button" value="导出EXCEL" class="rbtn23" @click.client="HtmlExportToExcel('PanelExcel',reportName)" />
                              <a id="dlink" style="display: none;"></a>
                        </div>
                    </div>
              </div>	
        </div>
        <div class="ui segment">
           <div v-show="onlysql.checked"><pre v-for="s of onlysql.value" v-text="s|sql"></pre></div>
        </div>
        <div class="ui segment">
            <div class="ui form">
              <div class="inline fields" v-show="report_cur=='fansData'">
                <label>分组条件：</label>
                <div class="field" v-for="g in groups">
                  <div class="ui checkbox">
                      <input :id="g.id" type="checkbox" :value="g.id" v-model="groups_selected">
                      <label :for="g.id">{{g.name}}</label>
                  </div>
                </div>
              </div>
              <div class="inline fields" v-show="report_cur=='sumData'">
                    <label>分组条件：</label>
                    <div class="field" v-for="g in groups2">
                        <div class="ui radio checkbox">
                            <input :id="g" type="radio" :value="g" @click="init()" v-model="group_selected">
                            <label :for="g">{{g}}</label>
                        </div>
                    </div>
              </div>
              <div class="inline fields" v-if="select.acl.indexOf('系统管理员')!=-1">
                <label>打印SQL</label>
                <div class="field">
                  <div class="ui checkbox">
                    <input id="sql" type="checkbox" v-model="onlysql.checked">
                    <label for="sql">仅打印SQL</label>
                  </div>
                </div>
              </div>
            </div>   
          </div>
        <div class="ui segment">
            <div style="text-align:center" v-show="select.start" ><img :src="select.loading_pic" width="40px" height="40px"></div>
        </div>
        <div class="ui segment total" v-if="report_cur=='sumData'" id='PanelExcel'>
            <div class="ui  column stackable grid">
                <div class="column left aligned">
                    <table class="ui selectable celled table">
                        <thead>
                            <tr class="positive">
                                <th class="center aligned" rowspan="3" v-show="group_selected=='按中心'">中心名称</th>
                                <th class="center aligned" rowspan="3" v-show="group_selected=='按是否来自朋友推荐'">是否来自朋友推荐</th>
                                <th class="center aligned" rowspan="3">新增预报名总数</th>
                                <th class="center aligned" rowspan="3">新增报名总数</th>
                                <th class="center aligned" rowspan="3">新增报名总金额</th>
                                <th class="center aligned" colspan="6"  v-show="group_selected=='按中心'">新增直接在中心报名统计</th>
                            </tr>
                            <tr v-show="group_selected=='按中心'">
                                <th class="center aligned" colspan="2">未通过微信直接在中心报名Camp</th>
                                <th class="center aligned" colspan="2">有通过微信但报名正式课程</th>
                                <th class="center aligned" colspan="2">小计</th>
                            </tr>
                            <tr v-show="group_selected=='按中心'">
                                <th class="center aligned">人数</th>
                                <th class="center aligned">金额</th>
                                <th class="center aligned">人数</th>
                                <th class="center aligned">金额</th>
                                <th class="center aligned">总数</th>
                                <th class="center aligned">总额</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="select.gym_selected=='all' && sumData.length>0">
                                <td class="center aligned">总 计</td>
                                <td class="right aligned" v-text="total.num_pre"></td>
                                <td class="right aligned" v-text="total.enrol_num"></td>
                                <td class="right aligned" v-text="total.enrol_amt"></td>
                                <td class="right aligned" v-text="total.enrol_num2" v-show="group_selected=='按中心'"></td>
                                <td class="right aligned" v-text="total.enrol_amt2" v-show="group_selected=='按中心'"></td>
                                <td class="right aligned" v-text="total.kcht_num" v-show="group_selected=='按中心'"></td>
                                <td class="right aligned" v-text="total.kcht_amt" v-show="group_selected=='按中心'"></td>
                                <td class="right aligned" v-text="add(total.kcht_num,total.enrol_num2)" v-show="group_selected=='按中心'"></td>
                                <td class="right aligned" v-text="add(total.kcht_amt,total.enrol_amt2)" v-show="group_selected=='按中心'"></td>
                            </tr>
                            <tr v-for="item of sumData"  v-show="sumData.length>0">
                                <td class="center aligned" v-text="gymName(item.gym)" v-show="group_selected=='按中心'"></td>
                                <td class="center aligned" v-text="item.type" v-show="group_selected=='按是否来自朋友推荐'"></td>
                                <td class="right aligned" v-text="item.num_pre|n_fmt"></td>
                                <td class="right aligned" v-text="item.enrol_num|n_fmt"></td>
                                <td class="right aligned" v-text="item.enrol_amt|n_fmt"></td>
                                <td class="right aligned" v-text="item.enrol_num2|n_fmt" v-show="group_selected=='按中心'"></td>
                                <td class="right aligned" v-text="item.enrol_amt2|n_fmt" v-show="group_selected=='按中心'"></td>
                                <td class="right aligned" v-text="item.kcht_num|n_fmt" v-show="group_selected=='按中心'"></td>
                                <td class="right aligned" v-text="item.kcht_amt|n_fmt" v-show="group_selected=='按中心'"></td>
                                <td class="right aligned" v-text="add(item.kcht_num,item.enrol_num2)" v-show="group_selected=='按中心'"></td>
                                <td class="right aligned" v-text="add(item.kcht_amt,item.enrol_amt2)" v-show="group_selected=='按中心'"></td>
                            </tr>
                            <tr v-if="sumData.length==0 && noData &&select.gym_selected">
                                <td colspan="11" style="text-align:center">
                                    <div class="ui pointing red  label">
                                        OOPS! No Record!
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui segment" v-if="h5_data.length>0 && report_cur=='fansData'" id='PanelExcel'>
                <div class="ui one column stackable grid">
                    <div class="ui label total">
                            <a class="detail">新增粉丝合计：</a>
                            {{fansTotal}}
                    </div>
                </div>
                <div class="fans" :class="{'ui three column stackable grid':groups_selected.length==3,'ui two column stackable grid':groups_selected.length==2,'ui one column stackable grid':groups_selected.length<2}">
                    <div class="column"  v-show="groupshow('m_code')">
                          <table class="ui celled table">
                              <thead>
                                  <tr>
                                      <th class="center aligned" colspan="3">按物料</th>
                                  </tr>
                                  <tr>
                                      <th class="center aligned">序号</th>
                                      <th class="center aligned">物料</th>
                                      <th class="center aligned">新增粉丝总数</th>
                                    </tr>
                              </thead>
                              <tbody>
                                  <tr  v-for="v of by_m_Data">
                                      <td class="right aligned" v-text="$index+1"></td>
                                      <td class="right aligned" v-text="v.key|m_codeName"></td>
                                      <td class="right aligned" v-text="v.sum"></td>
                                  </tr>
                              </tbody>
                          </table>
                    </div>
                    <div class="column" v-show="groupshow('center')">
                          <table  class="ui celled table">
                              <thead>
                                  <tr>
                                      <th class="center aligned" colspan="3">按来源中心</th>
                                  </tr>
                                  <tr>
                                      <th class="center aligned">序号</th>
                                      <th class="center aligned">来源中心</th>
                                      <th class="center aligned">新增粉丝总数</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr  v-for="v of by_c_Data">
                                      <td class="right aligned" v-text="$index+1"></td>
                                      <td class="right aligned" v-text="v.key|gymName"></td>
                                      <td class="right aligned" v-text="v.sum"></td>
                                  </tr>
                              </tbody>
                          </table>
                    </div>
                    <div class="column" v-show="groupshow('is_recnd')">
                          <table  class="ui celled table">
                              <thead>
                                  <tr>
                                      <th class="center aligned" colspan="3">按朋友推荐</th>
                                  </tr>
                                  <tr>
                                      <th class="center aligned">是否来自朋友推荐</th>
                                      <th class="center aligned">新增粉丝总数</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr  v-for="v of by_is_recnd_data">
                                      <td class="right aligned" v-text="v.key|isrecd"></td>
                                      <td class="right aligned" v-text="v.sum"></td>
                                  </tr>
                              </tbody>
                          </table>
                    </div>
                </div>
        </div>
        <div class="ui segment" v-if="report_cur=='kxjData'" id='PanelExcel'>
            <h1 style="display:none" id="lbl_innum_link">开学季活动报名情况汇总</h1>
            <div class="ui  column stackable grid"> 
                  <div class="column left aligned">
                      <table class="ui selectable celled table">
                          <thead>
                              <tr class="positive">
                                  <th class="center aligned">时间段</th>
                                  <th class="center aligned" >中心名称</th>
                                  <th class="center aligned" >报名合同数</th>
                                  <th class="center aligned" >报名总金额</th>
                                  <th class="center aligned" >其中新报合同数</th>
                                  <th class="center aligned" >其中新报合同金额</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr v-for="item of kxjData"  v-show="kxjData.length>0">
                                  <td style="vertical-align: middle;" class="center aligned" :rowspan="rowGroup[item.time]" v-if="($index-1<0)?true:item.time!=kxjData[$index-1].time"><h1 class="ui center aligned header" v-text="item.time"></h1></td>
                                  <td class="right aligned" :class="{'bold':item.gym=='总 计','blue':item.gym=='合计'}" v-text="item.gym"></td>
                                  <td class="right aligned" v-text="item.num|n_fmt"></td>
                                  <td class="right aligned" v-text="item.jin|n_fmt"></td>
                                  <td class="right aligned" v-text="item.num_x|n_fmt"></td>
                                  <td class="right aligned" v-text="item.jin_x|n_fmt"></td>
                              </tr>
                              <tr v-if="sumData.length==0 && noData &&select.gym_selected">
                                  <td colspan="11" style="text-align:center">
                                      <div class="ui pointing red  label">
                                          OOPS! No Record!
                                      </div>
                                  </td>
                              </tr>
                            </tbody>
                      </table>
                  </div>
            </div>
        </div>    
        <Rpt-camp-trans id='PanelExcel' v-if="report_cur=='camptrans'" :subtitle="subtitle" :stat="stats"></Rpt-camp-trans>
        <Rpt-member id='PanelExcel' v-if="report_cur=='memberstat'" :stat="stat"></Rpt-member>
        <Rpt-unhandle id='PanelExcel' v-if="report_cur=='unhandle_stat'" :handle_time_ave="handle_time_ave" :handle_rank_down="handle_rank_down" :handle_rank="handle_rank"></Rpt-unhandle>
         
    </div>
</template>

<script>
import vSelect from '@/src/Select.vue'
import alert from '@/src/Alert.vue'
import RptMember from './components/RptMember.vue'
import RptUnhandle from './components/RptUnhandle.vue'
import RptCampTrans from './components/RptCampTrans.vue'
import datepicker from '@/src/Datepicker.vue'
import  { iSelect, iOption, OptionGroup } from 'src/select/index.js';
export default {
  props: {
      select: {
        type:Object,
        default:{}
      }
  },
  components:{
	vSelect,
    alert,
    RptMember,
    RptUnhandle,
    RptCampTrans,
    datepicker,
    iSelect,
	iOption, 
	OptionGroup 
  },
  data:function(){
     return {
        dtStart:"",
        dtEnd:"",
        onlysql:{checked:false,value:[]},
        groups:[{id:"m_code",name:"按宣传资料"},{id:"center",name:"按来源中心"},{id:"is_recnd",name:"按是否来自朋友推荐"}],
        groups2:["按中心","按是否来自朋友推荐"],
        groups_selected:["m_code","center","is_recnd"],
        group_selected:"按中心",
        reports:[{id:"fansData",label:"新增粉丝量汇总表"},
                 {id:"sumData",label:"预报名和报名汇总表"},
                 {id:"kxjData",label:"开学季活动报名情况汇总"},
                 {id:"memberstat",label:"系统会员与非会员统计"},
                 {id:"unhandle_stat",label:"总部市场例子跟进情况统计"},
                 {id:"camptrans",label:"总部活动例子转化情况统计"}
                 ],
        report_cur:null,
        sumData:[],
        kxjData:[],
        by_m_Data:{},
        by_c_Data:{},
        by_m_c_Data:{},
        by_is_recnd_data:{},
		myData:"",
        h5_data:[],
        stat:{},
        stats:[],
        fansTotal:0,
        alertError:{show:false,title:'错误提示',msg:''},
        handle_rank_down:[],
        handle_rank:[],
        handle_time_ave:[],
     }
  },
  computed:{
      reportName:function(){
          var self=this;
          var res=self.reports.find(function(r){
              return r.id==self.report_cur;
          })
          return res&&res.label;
      },
      pageShow:function(){
            var self=this;
            var arr=["市场顾问","市场总监","系统管理员","市场专员","运营顾问"]
            var res=arr.findIndex(function(a){
                return a.indexOf(self.select.acl)!=-1
            })
            return arr!=-1;
      },
      rowGroup:function(){
            if(this.kxjData.length==0) return [];
            var rowGroup=this.kxjData.map(function(item){
                //console.error(item.time)
                return item.time;
            })
            rowGroup=this.arr_stat(rowGroup);
            //console.error(JSON.stringify(rowGroup));
            return rowGroup
      },
      where_dt:function(){
          var conditions=[];
          if(this.dtStart) conditions.push("camp.create_time>='"+this.dtStart)
          if(this.dtEnd) conditions.push("camp.create_time<='"+this.dtEnd+" 23:59:59'")
          return conditions.join(" and ")||'1=1';
      },
      where_dtht:function(){
          var conditions=[];
          if(this.dtStart) conditions.push("camp.crmzdy_87677139>='"+this.dtStart)
          if(this.dtEnd) conditions.push("camp.crmzdy_87677139<='"+this.dtEnd+" 23:59:59'")
          return conditions.join(" and ")||'1=1';
      },
      where_dtty:function(){
          var conditions=[];
          if(this.dtStart) conditions.push("ty.dtty>='"+this.dtStart)
          if(this.dtEnd) conditions.push("ty.dtty<='"+this.dtEnd+" 23:59:59'")
          return conditions.join(" and ")||'1=1';
      },
      subtitle:function(){
          var dtEnd=this.dtEnd||this.fmtDt_s(new Date())
          if(this.dtStart){
             return this.dtStart+'至'+dtEnd;
          }else{
             return '截止'+dtEnd
          }
      },
      where_ht_dt:function(){
          return "ht.crmzdy_80646021 between '"+this.dtStart+" 00:00:00' and '"+ this.dtEnd+" 23:59:59'";
      },
      where_bk_dt:function(){
          return "bk.create_time between '"+this.dtStart+" 00:00:00' and '"+ this.dtEnd+" 23:59:59'";
      },
      where_bmks_dt:function(){
          return "bmks.create_time between '"+this.dtStart+" 00:00:00' and '"+ this.dtEnd+" 23:59:59'";
      },
      where_update_dt:function(){
          return "camp.update_time between '"+this.dtStart+" 00:00:00' and '"+ this.dtEnd+" 23:59:59'";
      },
      where_gymcode:function(){
          if(this.select.gym_selected=='all'){
              return "camp.crmzdy_82051555 between '500005' and '600005'";
          }else{
              return "camp.crmzdy_82051555="+this.select.gym_selected;
          }
      },
      where_bj_gymcode:function(){
          if(this.select.gym_selected=='all'){
              return "bj.crmzdy_81803719 between '500005' and '600005'";
          }else{
              return "bj.crmzdy_81803719="+this.select.gym_selected;
          }
      },
      where_ht_gymcode:function(){
          if(this.select.gym_selected=='all'){
              return "ht.crmzdy_81757911 between '500005' and '600005'";
          }else{
              return "ht.crmzdy_81757911="+this.select.gym_selected;
          }
      },
      where_campaign:function(){
			if(this.campaigns_cur.length==0){
				return "1=1";
			}else if(typeof this.campaigns_cur=='object'){
				return "camp.crmzdy_82053258 in ('"+this.campaigns_cur.join("','")+"')";
			}else{
				return "camp.crmzdy_82053258='"+this.campaigns_cur+"'";
			}
      },
      sqlEnrolTotal:function () {
          if(this.group_selected=="按中心"){
              var sql = sql_pre_enrol_total;
          }else{
              var sql = sql_pre_enrolByRecnd;
          }
          sql = sql.replace(/@where_ht_dt/ig,this.where_ht_dt)
          .replace(/@where_bk_dt/ig,this.where_bk_dt)
          .replace(/@where_bmks_dt/ig,this.where_bmks_dt)
          .replace(/@where_dt/ig,this.where_dt)
          .replace(/@where_campaign/ig,this.where_campaign)
          .replace(/@where_gymcode/ig,this.where_gymcode)
          .replace(/@where_bj_gymcode/ig,this.where_bj_gymcode)
          .replace(/@where_ht_gymcode/ig,this.where_ht_gymcode)
          .replace(/@where_update_dt/ig,this.where_update_dt);
          //console.log(sql);
          sql = this.convertor.ToUnicode(sql);
          return sql; 
      },
      total:function(){
          var total={num_pre:0,enrol_num:0,enrol_num:0,enrol_amt:0,enrol_num2:0,enrol_amt2:0,kcht_num:0,kcht_amt:0};
          this.sumData.map(function(s){
              total['num_pre']+=parseInt(s.num_pre||0);
              total['enrol_num']+=parseInt(s.enrol_num||0);
              total['enrol_amt']+=parseInt(s.enrol_amt||0);
              total['enrol_num2']+=parseInt(s.enrol_num2||0);
              total['enrol_amt2']+=parseInt(s.enrol_amt2||0);
              total['kcht_num']+=parseInt(s.kcht_num||0);
              total['kcht_amt']+=parseInt(s.kcht_amt||0);
          })
          return total;
      }  				 
  },
  filters:{
        n_fmt:function(num){
            if(num=="") return 0;
            return parseInt(num);
        },
        m_codeName:function(code){
            if(code=="")  return "无";
            return code;
        },
        typeName:function(code){
            if(code=="是"){
                return '来自朋友推荐';
            }else{
                return '不是来自朋友推荐';
            }
        },
        isrecd:function(val){
            if(val==1){
               return "是";
            }else{
               return "否";
            }
        }
  },
  methods:{
      HtmlExportToExcel:function(id,name){
         HtmlExportToExcel(id,name+'_'+this.subtitle);
      },
      validate:function(showErr=true){
            if(this.report_cur=='memberstat') return true;
            if(!this.select.campaign_selected) {
                if(showErr){
                    this.alertError={title:"错误提示",msg:"活动名称不能为空",show:true}
                }
                return false;
            }
            if(!this.select.gym_selected) {
                if(showErr){
                    this.alertError={title:"错误提示",msg:"中心名称能不为空",show:true}
                }
                return false;
            }
            return true;
      },
	  add:function(a,b){
		   a=a||0;
		   b=b||0;
		   return parseInt(a)+parseInt(b);
      },
	  arr_stat:function(_arr){
		  var res={},key;
          _arr.sort();
          for (var i = 0; i < _arr.length;) {
              var count = 0;
              for (var j = i; j < _arr.length; j++) {
                  if (_arr[i] == _arr[j]) {
                      count++;
                  }
              }
              key =_arr[i];
              res[key]= count;
              i += count;
          }
		  return res;
      },
      groupshow:function(t){
          var context = JSON.stringify(this.groups_selected)
          return context.indexOf(t)!=-1;
      },
      init:function(){
            this.sumData=[];
            this.myData=[];
            this.by_c_Data=[];
            this.by_m_c_Data=[];
            this.by_m_Data=[];
      },
      getQuery:function(){
        if(!this.validate()) return;  
        if(this.report_cur=="fansData"){
            this.getFans();
        }else if(this.report_cur=="sumData"){
            this.getEnrolTotal(); 
        }else if(this.report_cur=="kxjData"){
            this.getKxjTotal(); 
        }else if(this.report_cur=="memberstat"){
            this.getMemberStat(); 
        }else if(this.report_cur=="unhandle_stat"){
            this.getHandleStat(); 
        }else if(this.report_cur=="camptrans"){
            this.getTransStat(); 
        }
      },
      getMemberStat:function(){
            let self=this;
            let sql=member_stat;  
            if(this.dtEnd){
                sql=sql.replace(/@whereend/g,"zx.create_time<='"+this.dtEnd+" 23:59:59'").replace(/@dtend/g,this.dtEnd+" 23:59:59");
            }else{
                sql=sql.replace(/@whereend/g,"1=1").replace(/@dtend/g,this.fmtDt_s(new Date())+' 23:59:59');
            }
            var whereht=[],wherezx=[]
            if(this.dtStart){
                whereht.push("ht.create_time>='"+this.dtStart+" 23:59:59'");
                wherezx.push("zx.create_time>='"+this.dtStart+" 23:59:59'");
            }
            if(this.dtEnd){
                whereht.push("ht.create_time<='"+this.dtEnd+" 23:59:59'");
                wherezx.push("zx.create_time<='"+this.dtEnd+" 23:59:59'");
            }
            if(whereht.length==0){
                sql=sql.replace("@whereht","1=1")
            }else{
                sql=sql.replace("@whereht",whereht.join(" and "))
            }
            if(wherezx.length==0){
                sql=sql.replace(/@wherezx/g,"1=1")
            }else{
                sql=sql.replace(/@wherezx/g,wherezx.join(" and "))
            }

            sql = this.convertor.ToUnicode(sql);
            self.select.start=true;
            self.$http.jsonp(url_jsonp,{
                sql1: sql ,
                onlysql:(self.onlysql.checked?1:0)
            },{
                jsonp:'callback'
            }).then(function(res){
                var sql =res.data.info[1].sql;
                sql =sql.replace(/quot;/gi,"'")
                self.onlysql.value=[sql];
                var res_data = res.data.info[0].rec[0];
                self.stat=res_data;
                self.select.start=false;
            },function(res){
                self.select.start=false;
                console.log(res.status);
            })
      },
      getTransStat:function(){
            let self=this;
            let sql=sql_campaign_trans_stat;  
            sql=sql.replace("@where_dt",this.where_dt);
            sql=sql.replace("@where_dtty",this.where_dtty);
            sql=sql.replace("@where_dtht",this.where_dtht);
            sql=sql.replace(/@where_gymcode/ig,this.where_gymcode);
            sql=sql.replace(/@where_campaign/ig,this.where_campaign);
            sql = this.convertor.ToUnicode(sql);
            self.select.start=true;
            self.$http.jsonp(url_jsonp,{
                sql1: sql ,
                onlysql:(self.onlysql.checked?1:0)
            },{
                jsonp:'callback'
            }).then(function(res){
                var sql =res.data.info[1].sql;
                sql =sql.replace(/quot;/gi,"'")
                self.onlysql.value=[sql];
                var res_data = res.data.info[0].rec;
                self.stats=res_data;
                console.log(JSON.stringify(self.stat))
                self.select.start=false;
            },function(res){
                self.select.start=false;
                console.log(res.status);
            })
      },
	  getKxjTotal:function(){
        var self=this;
        self.select.start=true;
        self.kxjData=[];
        self.check={};
        var sql = sql_kxj_ht;
        sql = sql.replace("@where_ht_dt",this.where_ht_dt);
        sql = this.convertor.ToUnicode(sql);
        self.$http.jsonp(url_jsonp,{
            sql1: sql ,
            onlysql:(self.onlysql.checked?1:0)
        },{
            jsonp:'callback'
        }).then(function(res){
            var sql =res.data.info[1].sql;
            sql =sql.replace(/quot;/gi,"'")
            self.onlysql.value=[sql];
            var res_data = res.data.info[0].rec;
            if(res_data.constructor!=String&&!self.onlysql.checked){ 
                self.kxjData=res_data;
                //console.log(JSON.stringify(self.rowGroup))
            }
            self.select.start=false; 
        },function(res){
            self.select.start=false;
            console.log(res.status);
        });
      }, 
	  getHandleStat:function(){
            if(!this.dtStart||!this.dtEnd){
                this.alertError.msg="请选择开始和结束日期";
                this.alertError.show=true;
                return;
            }
            var dtStart=this.dtStart+' 00:00:00';
            var dtEnd=this.dtEnd+' 23:23:59';
            var self=this;
            self.select.start=true;
            self.handle_rank=[];
            self.handle_rank_down=[];
            self.onlysql.value=[];
            var sql = sql_handle;
            sql = sql.replace("@dtstart",dtStart).replace("@dtend",dtEnd).replace("@where_campaign",this.where_campaign);
            sql = this.convertor.ToUnicode(sql);
            self.$http.jsonp(url_jsonp,{
                sql1: sql ,
                onlysql:(self.onlysql.checked?1:0)
            },{
                jsonp:'callback'
            }).then(function(res){
                var sql =res.data.info[1].sql;
                sql =sql.replace(/quot;/gi,"'")
                if(sql)self.onlysql.value.push(sql);
                var res_data = res.data.info[0].rec;
                if(res_data.constructor!=String&&!self.onlysql.checked){ 
                    self.handle_rank=res_data;
                    //console.log(JSON.stringify(self.rowGroup))
                }
                self.select.start=false; 
            },function(res){
                self.select.start=false;
                console.log(res.status);
            });
            sql = sql_handle_down;
            sql = sql.replace("@dtstart",dtStart).replace("@dtend",dtEnd).replace("@where_campaign",this.where_campaign);
            sql = this.convertor.ToUnicode(sql);
            self.$http.jsonp(url_jsonp,{
                sql1: sql ,
                onlysql:(self.onlysql.checked?1:0)
            },{
                jsonp:'callback'
            }).then(function(res){
                var sql =res.data.info[1].sql;
                sql =sql.replace(/quot;/gi,"'")
                self.onlysql.value.push(sql);
                var res_data = res.data.info[0].rec;
                if(res_data.constructor!=String&&!self.onlysql.checked){ 
                    self.handle_rank_down=res_data;
                    //console.log(JSON.stringify(self.rowGroup))
                }
                self.select.start=false; 
            },function(res){
                self.select.start=false;
                console.log(res.status);
            });
            sql = sql_handle_time_ave;
            sql = sql.replace("@dtstart",dtStart).replace("@dtend",dtEnd).replace("@where_campaign",this.where_campaign);
            sql = this.convertor.ToUnicode(sql);
            self.$http.jsonp(url_jsonp,{
                sql1: sql ,
                onlysql:(self.onlysql.checked?1:0)
            },{
                jsonp:'callback'
            }).then(function(res){
                var sql =res.data.info[1].sql;
                sql =sql.replace(/quot;/gi,"'")
                self.onlysql.value.push(sql);
                var res_data = res.data.info[0].rec;
                if(res_data.constructor!=String&&!self.onlysql.checked){ 
                    self.handle_time_ave=res_data;
                    //console.log(JSON.stringify(self.rowGroup))
                }
                self.select.start=false; 
            },function(res){
                self.select.start=false;
                console.log(res.status);
            });
      }, 
      getEnrolTotal:function(){
        var self=this;
        self.select.start=true;
        self.sumData=[];
        self.check={};
        self.noData=false;
        self.$http.jsonp(url_jsonp,{
            sql1: self.sqlEnrolTotal,
            onlysql:(self.onlysql.checked?1:0)
        },{
            jsonp:'callback'
        }).then(function(res){
            var sql =res.data.info[1].sql;
            sql =sql.replace(/quot;/gi,"'")
            self.onlysql.value=[sql];
            var res_data = res.data.info[0].rec;
            if(res_data.constructor!=String&&!self.onlysql.checked){ 
                self.sumData=res_data;
                self.sumData=self.sumData.sort(function(a,b){
                     return b['num_pre']-a['num_pre'];
                });
            }else{
                self.noData=true;
            }
            self.select.start=false; 
        },function(res){
            self.select.start=false;
            console(res.status);
        });
      },
      getFans:function(){
        var self=this;
        self.fansTotal=0;
        self.by_m_Data=[];
        self.by_c_Data=[];
        self.by_m_c_Data=[];
        self.by_is_recnd_data=[];
        self.select.start=true;
        self.$http.jsonp(url_fans,{
            start:this.toTimeStamp(this.dtStart),
            end:this.toTimeStamp(this.dtEnd+" 23:59:59")
        },{
            jsonp:'callback'
        }).then(function(res){
            var sql =self.sqlBuilder;
            self.onlysql.value=[sql];
            var res_data = res.data;
            if(!res.code&&!self.onlysql.checked){ 
                self.h5_data=res_data.data;
                if(res_data.data.length>0){
                    var m_code={};
                    var centerid={};
                                var is_recnd={};
                    res_data.data.map(function(f){
                        //if($.trim(f.materialcode)!=""){
                            if(!m_code[f.materialcode]){
                                m_code[f.materialcode]=0;
                            }
                            if(!centerid[f.centerid]){
                                centerid[f.centerid]=0;
                            }
                            if(!is_recnd[f.parentid]){
                                is_recnd[f.parentid]=0;
                            }
                            self.fansTotal+=f.sum;
                            self.by_m_c_Data.push(f) 
                            m_code[f.materialcode]+=parseInt(f.sum);
                            centerid[f.centerid]+=parseInt(f.sum);
                                            //console.error(f.parentid+"vs"+f.sum)
                                            is_recnd[f.parentid]+=parseInt(f.sum);
                    })
                    for(var k in m_code){
                        self.by_m_Data.push({key:k,sum:m_code[k]})
                        //console.error(k+"vs"+m_code[k])
                    }
                    for(var k in centerid){
                        self.by_c_Data.push({key:k,sum:centerid[k]})
                    }
                    for(var k in is_recnd){
                        self.by_is_recnd_data.push({key:k,sum:is_recnd[k]})
                    }
                    self.by_m_Data=self.by_m_Data.sort(function(a,b){
                        return b['sum']-a['sum'];
                    });
                    self.by_c_Data=self.by_c_Data.sort(function(a,b){
                        return b['sum']-a['sum'];
                    });
                    self.by_m_c_Data=self.by_m_c_Data.sort(function(a,b){
                        return b['sum']-a['sum'];
                    });
                }  
            } 
            self.select.start=false; 
            self.noData=true;
        },function(res){
            self.select.start=false;
            console(res.status);
        });
       }
  },
  watch: {
      report_cur:function(v){
            var mydate=new Date();
            var timestamp = new Date().getTime();
            var myddy=mydate.getDay()
            if(myddy==0){
                myddy=6;
            }else{
                myddy--;
            }
            if(v=="kxjData"){
                this.dtEnd=this.fmtDt_s(timestamp+1*24*3600*1000)
                this.dtStart=this.fmtDt_s(timestamp-250*24*3600*1000);
                this.campaigns_rpt=this.campaigns.filter(function(c){
                    return c.name.indexOf("开学季")!=-1;
                })
                this.select.campaign_selected=this.campaigns[0]&&this.campaigns[0].name;
            }else if(v=="sumData"||v=="fansData"){
                this.dtEnd=this.fmtDt_s(mydate)
                this.dtStart=this.fmtDt_s(timestamp-myddy*24*3600*1000);
                this.campaigns_rpt=this.campaigns.filter(function(c){
                    return c.name.indexOf("奥运集训营")!=-1;
                })
                this.select.campaign_selected=this.campaigns[0]&&this.campaigns[0].name;
            }else if(this.report_cur=="unhandle_stat"){
                this.select.campaign_selected="所有";
            }else{
                this.campaigns_rpt=this.campaigns;
                this.select.campaign_selected=[];
            }
      }
  },
  created(){
    if(this.$route.path=="/report"){
        this.select.menuGroup.map((n)=>{
            n.isActive=false;
            if(n.name=="Report"){
                n.isActive=true;
                n.enabled=true;
            }
        });
     }
     this.select.campaign_selected=[];
  }
}
</script>