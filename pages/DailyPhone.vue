<template>
<div class="ui segment" @click="flushstate">
    <div class="ui segment isPrint">
        <h1 class="title">每日电话报表</h1>
    </div>
    <div class="ui segment noPrint">
        <div class='ui three column stackable grid'>
    		  <div class="row">
                <div class="column right aligned">
                     <v-select :value.sync="select.idgym" :options="select.gyms" options-label="name" options-value="id" placeholder="请选择中心" search clear-button close-on-select>
                     </v-select>
                </div>
                <div class="column center aligned">
    	             <datepicker :value.sync="select.dtReport" format="yyyy-MM-dd" placeholder="请选择日期"></datepicker>
                </div>
                <div class="column left aligned">
                    <a href="javascript:" class="btn btn-default" @click="getQuery()">查询</a>
					<input type="button" class="btn btn-default"  value="打印" onclick="PrintDoc()" />
                    <input id="Button1" type="button" class="btn btn-danger"  value="导出EXCEL" class="rbtn23" @click.client="HtmlExportToExcel('PanelExcel','DailyPhoneCall')" />
					<a id="dlink" style="display: none;"></a>
                </div>
            </div>
            <div class="row">
    		    <div class="column"></div>
    			<div class="column">
                    <div class="ui two column grid">
                            <div class="column">
                                <tooltip effect="scale" placement="bottom" content="GD分配需要今日电话的例子家庭">
                                     <checkbox :checked.sync="onlyAllocated" type="danger">显示自己今天需要跟进的</checkbox>
                                </tooltip>
                            </div>
                            <div class="column">
                                <tooltip effect="scale" placement="bottom" content="负责老师是自己的例子家庭">
                                    <checkbox :checked.sync="onlyCharge" type="danger">显示自己负责的</checkbox>                   
                                </tooltip>
                            </div>
                    </div>
    			</div>
    			<div class="column" v-if="select.acl.indexOf('系统管理员')!=-1">
    			      <checkbox :checked.sync="select.onlysql" type="danger" >是否打印sql（仅管理员）</checkbox>
    			</div>
    			<div class="column"></div>
            </div>
            <div class="row" v-show="select.start">
                 <div class="column"></div>
                <div class="column center aligned">
                   <img :src="select.loading_pic" width="40px" height="40px">
                </div>
            </div>
    	</div>	
    </div>
    <div class="ui segment" v-show="select.onlysql">
        <pre v-for="s of select.datasql" track-by="$index" v-text="s"></pre>
    </div>

    <div class="ui segment" id="PanelExcel">
        <div class="ui grid onlyPrint subtitle">
            <div class="four wide column"></div>
            <div class="six wide column">{{select.gymNames[select.idgym]?'中心：'+select.gymNames[select.idgym]:''}}</div>
            <div class="six wide column">{{select.dtReport}}</div>
        </div>
        <panel v-for="st of subtitles">
            <p slot="header" style="text-align: center;font-size: 20px;font-weight:bold;">{{st.content}}</p>
            <table class="table console" width="100%">
                <thead>
                    <tr>
                        <th v-for="f of st.fields" width="10%" v-if="f!='每日电话说明'">{{f}}</td>
                        <th v-if="isadmin" width="10%" class="noPrint">操作</td>
                    </tr>
                </thead>
                <tbody  v-for="p of st.data">
                    <tr :class="{'success':todayGt(p)}">
                        <td class="noPrint" width="10%" v-html="p|family_url"></td>
                        <td :class="{'onlyPrint':f=='家长'}" v-for="f of st.fields" v-if="f!='每日电话说明'">{{p[f]}}</td>
                        <td v-if="isadmin" class="noPrint"><button @click="allocate(p)" class="btn btn-primary btn-mini">分配老师</button></td>
                    </tr>
                    <tr :class="{'success':todayGt(p)}" v-if="st.fields.indexOf('每日电话说明')!=-1">
                        <td align="left" :colspan="st.fields.length+1">【每日电话说明】<span v-html="p['每日电话说明']"></span>
                            <hr style="height:1px;border:none;border-top:1px dashed #0066CC;">
                        </td>
                    </tr>    
                    <tr :class="{'success':todayGt(p)}">
                        <td align="left" :colspan="st.fields.length+1">
                            <span v-if="p&&!isempty(p['沟通记录'])" v-html="'【沟通记录】'+p['沟通记录']"></span>
                            <hr style="height:1px;border:none;border-top:1px dashed #0066CC;">
                        </td>
                    </tr>          
                </tbody>
            </table>
        </panel>
    </div>
    <div>
        <modal :show.sync="saveLsModal.show" effect="fade" small>
            <div slot="modal-header" class="modal-header">
                <h4 class="modal-title">
                <b>{{saveLsModal.title}}</b> 
                </h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <div class="ui form">
                        <div class="field "><v-select :value.sync="saveLsModal.newer" placeholder="今日电话老师" clearable :options="saveLsModal.newers|lsFilter" options-label="name" options-value="id" required></v-select></div>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-success" @click="save()">确定</button>
                <button type="button" class="btn btn-danger" @click="saveLsModal.show=false;">取消</button>
            </div>
        </modal>
        <alert :show.sync="error.show" placement="top" duration="3000" type="danger" width="400px" dismissable>
            <span class="glyphicon glyphicon-info-sign alert-icon-float-left"></span>
            <strong>错误提示!</strong>
            <p style="font-size:1.5em">{{error.content}}</p>
        </alert>
    </div>
</div>
</template>

<script>

import Tag from 'src/tag';
import alert from '@/src/Alert.vue';
import vSelect from '@/src/Select.vue';
import modal from '@/src/Modal.vue';
import tooltip from '@/src/Tooltip.vue';
import datepicker from 'src/Datepicker.vue';
import checkbox from 'src/checkbox';
import panel from 'src/Panel.vue';

import qs from 'qs';

export default {
	  data(){
		return  { 
			select: {
                onlysql:false,
                start: false,
                loading_pic:"https://bbk.800app.com/uploadfile/staticresource/238592/279833/loading.gif",
				acl: "",
                iduser:null,
                username:"",
                idgym:null,
                row:null,
                gyms:[],
                gymNames:{},
                phonePlans:[],
                datasql:[],
	            dtReport:this.fmtDt_s(new Date())
            },
            subtitles:[
                {type:1,fields:['家长','手机','孩子','负责老师','今日电话老师'],content:"三天前录入且尚未预约体验",data:[]},
                {type:2,fields:['家长','手机','孩子','负责老师','班级','今日电话老师'],content:"前天体验且未报名",data:[]},
                {type:3,fields:['家长','手机','孩子','负责老师','班级','最近体验信息','今日电话老师'],content:"昨天体验未出席",data:[]},
                {type:4,fields:['家长','手机','孩子','负责老师','班级','考勤状态','今日电话老师'],content:"明天体验",data:[]},
                {type:5,fields:['家长','手机','孩子','负责老师','咨询日期','每日电话说明','最近体验信息','今日电话老师'],content:"今天计划联系",data:[]},
                {type:6,fields:['家长','手机','孩子','负责老师','咨询日期','每日电话说明','最近体验信息','今日电话老师'],content:"过去30天没有联系的潜在客户",data:[]},
                {type:7,fields:['家长','手机','孩子','生日','今日电话老师'],content:"即将到来的生日会",data:[]}
            ],
            isadmin:false,
            onlyAllocated:false,
            onlyCharge:false,
            error:{
                show:false,
                content:''
            },
            saveLsModal:{show:false,title:'指派老师负责电话跟进',dropback:false,formers:[],newers:[],former:null,newer:null}
		}
	  },
      components:{
           modal,
           Tag,
           panel,
           alert,
           vSelect,
           checkbox,
           tooltip,
           datepicker
      },
	  computed:{
          id_sql:function(){
              var data=this.select.phonePlans;
              var sql="";
              data&&data.forEach(function(el,index){
                sql += "select "+el.id+" idzx,"+index+" xh union all ";
              }); 
              sql = sql.slice(0,-10)
              return  sql;
          }
      },
      filters:{
        simplefy:function(val){
            if(!val) return '';
            let indx=val.indexOf("中心");
            val=val.substr(indx+3);
            return val;
        },
        family_url:function(row){
           if(row){
                let url = "<a href='https://bbk.800app.com/index.jsp?mlist=1&mfs1=crm_zdytable_238592_25111&menu=3&mzdyshowname=咨询中心&mRelateClassName=crm_sj&mRelateID=@idjt&mid=@idzxzx' target='_blank'>@name</a>";
                url=url.replace("@idjt",row.idjt).replace("@idzxzx",row.id).replace("@name",row['家长']);
                return url;
           }else{
                return '';
           }
        },
        lsFilter:function(val){
          let self=this;
          return val&&val.filter(function(v){
              return v.id!=self.saveLsModal.former;
           })
        }
      },
      watch: {
            "select.idgym":{
                handler(newValue, oldValue) {
                    newValue&&this.getQuery();
        　　　   },
        　　　   deep: true
            },
            "select.dtReport":{
                handler(newValue, oldValue) {
                    newValue&&this.getQuery();
        　　　   },
        　　　   deep: true
            },
            "select.phonePlans":{
                handler(newValue, oldValue) {
                    this.phoneFilter();
        　　　   },
        　　　   deep: true
            },
            "onlyAllocated":{
                handler(newValue, oldValue) {
                    this.phoneFilter();
        　　　   },
        　　　   deep: true
            },
            "onlyCharge":{
                handler(newValue, oldValue) {
                    this.phoneFilter();
        　　　   },
        　　　   deep: true
            }          
      },
      methods: {
        flushstate:function(){
           if(this.id_sql){
                let self=this,res=[];
                let sql="select zx.crmzdy_87682347 ls,trans.*,isnull((select convert(varchar(10),create_time,120)+';' from crm_zdytable_238592_23576_238592 ty where ty.isdelete=0 and ty.crmzdy_81620307_id=zx.id for xml path('')),'')dtappoint,replace(replace('<b>'+ltrim(isnull( '家长需求：'+nullif(crmzdy_87677161,''),'')+isnull( ' 孩子性格：'+nullif(crmzdy_87676839,''),'')+isnull( ' 距离：'+nullif(crmzdy_87676845,''),'')+isnull( ' 早教课程：'+nullif(crmzdy_87676842,''),'')+isnull( ' 家庭带养人：'+nullif(crmzdy_87676848 ,''),'')),' ','，')+'</b> '+replace(case when patindex('|%|%|%|%',isnull(crmzdy_81802275,''))>0 then substring(isnull(crmzdy_81802275,''),2,charindex('|',isnull(crmzdy_81802275,''),2)-3)+substring(replace(reverse(left(reverse(isnull(crmzdy_81802275,'')),charindex('|',reverse(isnull(crmzdy_81802275,'')),charindex('|',reverse(isnull(crmzdy_81802275,'')))+1))),'|',''),0,8000) else substring(replace(isnull(crmzdy_81802275,''),'|',''),0,8000) end,char(13),' '),char(10),'。')gt from crm_zdytable_238592_25111_238592_view zx join (@trans) trans on zx.id=trans.idzx";
                sql=sql.replace("@dtReport",this.select.dtReport).replace("@trans",this.id_sql);
                sql = this.convertor.ToUnicode(sql);
                self.$axios.get(url_jsonp,{
                    params:{sql1: sql}
                }).then(function(res){
                    if(res.status==200){
                        res = res.data.info[0].rec;
                        if(res&& typeof res!='string'){
                            res.map(function(r){
                                if(self.select.phonePlans[r.xh]){
                                    self.select.phonePlans[r.xh]['沟通记录']=r.gt;
                                    self.select.phonePlans[r.xh]['今日电话老师']=r.ls;  
                                    self.select.phonePlans[r.xh]['dtappoint']=r.dtappoint;  
                                }
                            })
                        }
                    } 
                },function(res){
                    console.error(res.status);
                });
           }
        },
        HtmlExportToExcel:function(id,name){
            HtmlExportToExcel(id,name+'_'+this.select.dtReport);
            // window.location.reload();
        },
        param:function(sql){
           //281584(月总)  292939 246152(陈婕) 301931(pd)
          //sql = sql.replace(/iduser/ig,281584);
           var param=GetRequest() 
           if(param&&param.iduser){
               sql = sql.replace(/iduser/ig,param.iduser);
           }
           if(this.select.iduser){
               sql = sql.replace(/iduser/ig,this.select.iduser);
           }
           sql = sql.replace(/@idgym/ig,this.select.idgym);
           sql = sql.replace(/@dtReport/ig,this.select.dtReport);
           sql = sql.replace(/@former/ig,this.saveLsModal.former);
           sql = sql.replace(/@newer/ig,this.saveLsModal.newer);
           sql = sql.replace(/@id/ig,this.select.row&&this.select.row.id);
           return sql;
        },
        todayGt:function(p){
            return p&&p['沟通记录']&&(p['沟通记录'].indexOf(this.select.dtReport)!=-1||
                      p.dtappoint&&p.dtappoint.indexOf(this.select.dtReport+";")!=-1
                    );
            
        },
        isempty:function(str){
            if(str){
              str=str.replace('<b></b>','');
              return str.indexOf(':')+1==str.length;
            }else{
              return true;
            }
        },
        phoneFilter:function(){
            var self=this;
            var data=[];
            self.subtitles.map(function(s){
                data = self.select.phonePlans.filter(function(p){
                    return  s.type==p.type&&(
                                (!self.onlyAllocated&&!self.onlyCharge)||
                                (self.onlyAllocated&&p.idls==self.select.iduser)||
                                (self.onlyCharge&&p.idfzls==self.select.iduser)
                           )
                })
                if(data) s.data=data;
            })
        },
        getAcl:function(){
            var self=this
            var sql = this.param(sql_quanxian);
            self.$axios.get(url_jsonp,{
                 params:{sql1: sql}
             }).then(function(res){
                if(res.status==200&&res.data.info[0].rec.constructor !=String){
                    self.select.acl = res.data.info[0].rec[0].crm_jiandang;
                    self.select.iduser = res.data.info[0].rec[0].id;
                    if(self.select.acl.indexOf('系统管理员')!=-1
                    ||self.select.acl.indexOf('运营顾问')!=-1
                    ||self.select.acl.indexOf('运营总监')!=-1
                    ){
                        self.onlyAllocated=false;
                        self.isadmin=true;
                    }
                    self.getGym();
                }  
            },function(res){
                console.error(res);
            });
        },
        getGym:function(func){
             let self=this;
             let sql=sql_getGym;
             sql=this.param(sql);
			 sql_getGym = this.convertor.ToUnicode(sql);
             self.$axios.get(url_jsonp,{
                 params:{sql1: sql_getGym}
             }).then(function(res){
                 if(res.status==200){
                    self.select.gyms = res.data.info[0].rec;
                    self.select.gyms.map(function(g){
                        self.select.gymNames[g.id]=g.name;
                        if(self.select.acl.indexOf('系统管理员')==-1){
                           self.select.idgym=g.id;
                        }
                    })
                 } 
             },function(res){
                 console.error(res.status);
             });
        },
        valid:function(){
            if(!this.select.idgym) {
                this.error={show:true,content:"请选择中心"};
                return false
             }
            if(!this.select.dtReport) {
                this.error={show:true,content:"请选择日期"};
                return false
            }
            return true;
        },
        getQuery:function(){
            if(!this.valid()||this.select.start) return;//防止重复提交
            this.select.datasql=[];
            this.select.phonePlans=[];
            this.getPhonePlans();
            this.getBirthDayPlans();
        },
        getPhonePlans:function(){
             let self=this;
             let sql=sql_getPhonePlans;
             sql = this.param(sql);
             self.select.start=true;
             sql = this.convertor.ToUnicode(sql);
             self.$axios({
                    method: 'post',
                    url:url_local,
                    data:qs.stringify({sql1:sql,onlysql:(self.select.onlysql?1:0)})
                }).then(function(res){
                 if(res.status==200){
                    let sql =res.data.sql;
				    sql =sql.replace(/quot;/gi,"'")
                    self.select.datasql.push(sql)
                    res=res.data.phones;
                    if(typeof res=='object'){
                       self.select.phonePlans = res.concat(self.select.phonePlans);
                    }
                 } 
                 self.select.start=false;
             },function(res){
                 console.error(res.status);
                 self.select.start=false;
             });
        },
        getBirthDayPlans:function(){
            if(!this.valid()) return;
             let self=this;
             let sql=sql_getBirthdayList;
             sql = this.param(sql);
             sql = this.convertor.ToUnicode(sql);
             self.$axios({
                    method: 'post',
                    url:url_jsonp,
                    data:qs.stringify({sql1:sql,onlysql:(self.select.onlysql?1:0)})
                }).then(function(res){
                 if(res.status==200){
                    let sql =res.data.info[1].sql;
				    sql =sql.replace(/quot;/gi,"'")
                    self.select.datasql.push(sql)
                    res=res.data.info[0].rec;
                    if(typeof res=='object'){
                       self.select.phonePlans = self.select.phonePlans.concat(res);
                    }
                 } 
             },function(res){
                 console.error(res.status);
             });
        },
	    getLs:function(){
			let self=this;
			self.select.start=true;
            let sql=this.param(sql_ls);
			sql = this.convertor.ToUnicode(sql);
			self.$axios({
				method: 'post',
				url:url_local,
                params:{sql1:sql,onlysql:(self.select.onlysql?1:0)}
			}).then(function(res){
			    if(res.status=200){
				   self.saveLsModal.newers=res.data.newers;
				   self.saveLsModal.show=true;
				}
				self.select.start=false;
            },function(res){
                self.select.start=false;
                console.log(res.status);
            });
        },
        allocate:function(row){
            this.select.row=row;
            this.saveLsModal.newer=null;
            // this.saveLsModal.former=row.idls;
            // this.saveLsModal.formers.push({id:row.idls,name:row['每日电话老师']||row['负责老师']});
            this.getLs();
            this.saveLsModal.show=true;    
        },
	    save(){
           let sql_update="update zx set crmzdy_87682347_id=@newer from crm_zdytable_238592_25111_238592_view zx where zx.id=@id;";
           sql_update = this.param(sql_update);
           //console.log(sql_update)
		   if(sql_update){
				sql_update+="select top 1 0 errcode,'ok' errmsg,'@sql'sql for json path,without_array_wrapper;"
				sql_update=this.convertor.ToUnicode(sql_update);
				let self=this;
				self.saveLsModal.show=false;
				self.$axios({
						method: 'post',
						url:url_local,
						params:{sql1:sql_update,onlysql:(self.select.onlysql?1:0)}
					}).then(function(res){
						if(res.status=200&&res.data.errcode==0){
                            self.select.row.idls=self.saveLsModal.newer
                            let n = self.saveLsModal.newers.find(function(n){
                                return self.saveLsModal.newer==n.id;
                            });
                            //console.log(n)
                            self.select.row['今日电话老师']=n['name'];
                            console.log(self.select.row)
						}else{
                            self.alertError={title:"错误提示",msg:"操作失败",show:true}
						}
					},function(res){
						console.log(res.status);
					});
		    }
	    }
      },
      created: function () {
           this.getAcl();
           let self=this;
           setInterval(() => {
               if(self.select.phonePlans&&self.select.phonePlans.length>0){
                 self.flushstate();
               }
           }, 110000);
      }
  } 

</script>
<style scoped>
    .field{
       border:1px solid transparent;
    }
    table.console{  
        font-family:"微软雅黑";
        font-size:10px;
        color:#474747;
        text-align:left;
    }

    .title{
       text-align:center;
       font-size:2.5em;
       font-weight: bold;
       
    }
    .ui.subtitle{
       margin-bottom:2%;
       margin-top:3%;
    }
    .subtitle{
       font-size:1.4em;
    }
    @media screen{
        .onlyPrint{
           display: none;
        } 
    }
    @media print{
        .onlyPrint{
            display: "";
        } 
        :not(hr) {
            padding:0!important;
            border:none!important;
        }
        .table {
            margin: 0!important;
        }
    }
    .panel{
       margin-bottom:5px!important;
    }
    [v-cloak]{
       display:none;
    }

    .alert-icon-float-left {
        font-size:32px;
        float:left;
        margin-right:15px;
    }
    .btn-mini [class^="icon-"],
    .btn-mini [class*=" icon-"] {
    margin-top: -1px;
    }
    .btn-mini {
    padding: 0 6px;
    font-size: 10.5px;
    -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
            border-radius: 3px;
    }
    
</style>
