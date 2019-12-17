<template>
   <div>
        <component :select="select" :is="task"></component>
        <Tip-for-pd></Tip-for-pd>
        <modal v-for="indx of indexes" :show.sync="indx.warn" effect="fade" >
            <div slot="title" class="modal-title">
                <span class="glyphicon glyphicon-info-sign text-danger"></span>
                <b  class="text-danger" v-text="indx.title"></b> 
            </div>
            <div slot="modal-body" class="modal-body">
                <template v-for="item of indx.items" >
                        <p  v-if="item.label" style="padding-left:10%">
                          <tooltip placement="right" :content="formula(item.label)">
                            <Tag color="success" v-if="item.label=='月销售冠军'">Success</Tag>
                            <Tag color="error"   v-if="item.label!='月销售冠军'&&item.standard-item.value>0">Warning</Tag>
                            <Tag color="success" v-if="item.label!='月销售冠军'&&item.standard-item.value<0">Success</Tag>
                            &nbsp;&nbsp;{{item.label}}
                            <code>{{item.label=='月销售冠军'?valTrim(item.value):valTrim(item.value)+'%'}}</code>
                            <b v-if="item.label=='月销售冠军'">￥</b> 
                            <b v-if="item.label!='月销售冠军'&&item.standard-item.value>0">低于标准</b> 
                            <b v-if="item.label!='月销售冠军'&&item.standard-item.value<0">达到标准</b> 
                            <Tag color="default">{{item.label=='月销售冠军'?item.standard:item.standard+'%'}}</Tag>
                            <span v-if="item.label!='月销售冠军'">&nbsp;&nbsp;本月最高<code>{{item.maxer+'%'}}</code></span>
                          </tooltip>
                        </p>
                        <br v-else/>
                </template>
            </div>
            <div slot="modal-footer" >
               <p class="text-center">
                <button type="button" class="btn btn-danger btn-block" @click="updateWarn(indx)">知道了，不再提示</button>
               </p> 
            </div>
        </modal> 
 
        <modal :show.sync="rank.warn" effect="fade" width="75%">
            <div slot="title" class="modal-title">
                <span class="glyphicon glyphicon-info-sign text-danger"></span>
                <b  class="text-danger" v-text="rank.title"></b> 
            </div>
            <div slot="modal-body" class="modal-body">
                <div class="ui segment">
                        <div class="ui grid">
                            <div class="two column row" style="margin-left:0.6%;">
                                <div class="column">           
                                    <tooltip placement="left" content="仅统计25节及以上课程合同">                     
                                    <h3 class="ui header">按合同数</h3>
                                    </tooltip>
                                    <table class="ui celled table">
                                        <thead>
                                            <tr>
                                                <th>城市</th>
                                                <th>排名</th>
                                                <th>中心</th>
                                                <th>本月签约合同数</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="n of rank.data[0]">
                                                <td>{{city(n.type)}}</td>
                                                <td>{{n.xh}}</td>
                                                <td>{{n.gymname}}</td>
                                                <td class="right aligned">{{n.hts}}</td>
                                            </tr>
                                        </tbody>
                                    </table></div>
                                <div class="column">
                                    <tooltip placement="left" content="仅统计25节及以上课程合同">  
                                    <h3 class="ui header">按合同金额</h3>
                                    </tooltip>
                                    <table class="ui celled table">
                                        <thead>
                                            <tr>
                                                <th>城市</th>
                                                <th>排名</th>
                                                <th>中心</th>
                                                <th>本月签约合同金额</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="n of rank.data[1]">
                                                <td>{{city(n.type)}}</td>
                                                <td>{{n.xh}}</td>
                                                <td>{{n.gymname}}</td>
                                                <td class="right aligned">{{n.amt}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div class="ui segment">
                            <h3 class="ui header">分组说明：</h3>
                            <p v-html="'<b>A组：</b>'+(rank.groups['1线']&&rank.groups['1线'].slice(0,-1))"></p>
                            <p v-html="'<b>B组：</b>'+(rank.groups['2线']&&rank.groups['2线'].slice(0,-1))"></p>
                            <p v-html="'<b>C组：</b>'+(rank.groups['3线']&&rank.groups['3线'].slice(0,-1))"></p>
                        </div>
                </div>
            </div>
            <div slot="modal-footer" >
               <p class="text-center">
                <button type="button" class="btn btn-danger btn-block" @click="rank.warn=false;">知道了</button>
               </p> 
            </div>
        </modal>
        <!-- <Tip-for-jump></Tip-for-jump> -->
        <!-- <Tip-for-single-day></Tip-for-single-day> -->
        <Tip-for1212></Tip-for1212>
        <Tip-for-show-week></Tip-for-show-week>
        <alert :show.sync="audit_tip_show" placement="top" type="warning" width="600px" dismissable>
            <div class="ui">
                <span class="glyphicon glyphicon-info-sign"></span>
                <strong>开业筹备进度待审提醒</strong>
                <div class="ui">
                    <div v-for="t of tipForAudit">
                        <p><label></label>“{{t.gym}}” 有完成进度待审核,请及时处理！<a class="text text-danger" :href="url_transfer(t.code)" target="_blank">转到审核</a></p>
                    </div>
                </div>
            </div>
        </alert> 
   </div>
   
</template>

<script>
import MustDo from './components/MustDo.vue';
import Preparations from './components/Preparations.vue';
import TipForPd from './components/components/TipForPd.vue';
import TipForJump from './components/components/TipForJump.vue';
import TipForSingleDay from './components/components/TipForSingleDay.vue';
import TipFor1212 from './components/components/TipFor1212.vue';
import TipForShowWeek from './components/components/TipForShowWeek.vue';
import modal from '@/src/Modal.vue';
import Tag from 'src/tag';
import alert from '@/src/Alert.vue';
import tooltip from '@/src/Tooltip.vue';
import sidebar from 'src/Aside.vue'
export default {
	  data(){
		return  { 
            task:"Must-do",
            docQA:{show:false,title:"飞跃挑战赛Q&A"},
            procedures:{show:false,title:"中心挑战赛（中心复赛）流程",pic:["https://static.thelittlegym.com.cn/assert/img/oasis/small/procedure_fusai1.png","https://static.thelittlegym.com.cn/assert/img/oasis/small/procedure_fusai2.png"]},
            importance:{show:false,title:"关于电子证书编号认证的重要通知"},
            bei:{show:false,content:""},
			select: {
                start: false,
                loading_pic:"https://bbk.800app.com/uploadfile/staticresource/238592/279833/loading.gif",
				acl: "",
                iduser:"",
                username:"",
                idgym:"",
                codes:"",
                code:"",
                ispreparing:undefined,
                dtenrol:undefined
            },
            indexes: [{warn:false,title:"",items:[]},{warn:false,title:"",items:[]},{warn:false,title:"",items:[]},{warn:false,title:"",items:[]},{warn:false,title:"",items:[]}],
            tipForAudit:[],
            rank:{warn:false,title:"本月全国中心即时业绩排名",data:[],groups:{}},
            audit_tip_show:false,
            
		}
	  },
      components:{
           MustDo,
           Preparations,
           modal,
           Tag,
           tooltip,
           alert,
           sidebar,
           TipForPd,
           TipForJump,
           TipForSingleDay,
           TipFor1212,
           TipForShowWeek
      },
	  computed:{
            isadmin:function(){
                if(this.select.acl.indexOf('系统管理员')!=-1
                  ||this.select.acl.indexOf('运营顾问')!=-1
                ){
                    return true;
                }
                return false;
            },
	  },
      watch: {
            "select.codes":{
                handler(newValue, oldValue) {
                    var self=this;
                    if(newValue&&newValue.length>0){
                        newValue.split(";").forEach(function(n){
                            if(n.length==6) self.getIndexes(n);
                        })
                    }
        　　　   },
        　　　   deep: true
            },
            "select.username":{
                handler(newValue, oldValue) {
                    if(newValue){
                       this.get_audit(newValue);
                    }
        　　　   },
        　　　   deep: true
            }  
      },
      methods: {
        city(type){
            switch(type){
                case 1:
                    return 'A组';
                case 2:
                    return 'B组';
                default:
                    return 'C组';
            }
        },
        getRank(){
            var self=this
            var sql=sql_getTMRank;
            sql=this.convertor.ToUnicode(sql);
            this.$axios.get(url_local,{
                params:{sql1:sql}
            })
            .then(function(res){
                res=res.data;
                if(res.errcode==0){
                  self.rank.groups=JSON.parse(res.groups);
                  self.rank.data=[];
                  self.rank.data.push(res.rank_hts);
                  self.rank.data.push(res.rank_htamt);
                  self.rank.warn=true;
                  //console.error(self.rank.groups);
                }  
                
            },function(res){
                console.error(res);
            });
        },
        valTrim(val){
           if(val==-1) return 0;
           return val;
        },
        toJson:function(str){
            return JSON.parse(str);
        },
        formula:function(type){
            if(type=="体验邀约率") return "体验邀约率 = 本期新增家庭已预约体验人次 / 本期新增家庭数"
            if(type=="体验出勤率") return "体验出勤率 = 本期体验出勤人次 / 本期预约体验人次"
            if(type=="新约转化率") return "新约转化率 = 本期新报课程合同数（不含小课包合同） / 本期非会员体验出勤家庭数"
            if(type=="会员出勤率") return "会员出勤率 = ( 本期补课出勤人次 + 本期报名实际出勤人次 ) / ( 本期预约补课人次 + 本期报名课程人次 )" 
            return type;
        },
        getAcl:function(){
            var self=this
            //281584(月总)  292939 246152(陈婕) 301931(pd)
            var sql=sql_quanxian
            //sql=sql.replace('iduser',246152);
            var param=GetRequest() 
            if(param&&param.iduser){
               sql = sql.replace(/iduser/ig,param.iduser);
            }
            sql=this.convertor.ToUnicode(sql);
            this.$axios.get(url_jsonp,{
                params:{sql1:sql}
            })
            .then(function(res){
                if(res.status==200 && res.data.info[0].rec.constructor !=String){
                    self.select.acl = res.data.info[0].rec[0].crm_jiandang;
                    if(res.data.info[0].rec[0].ispreparing==1){
                        self.task="Preparations";
                    }
                    self.select.ispreparing = res.data.info[0].rec[0].ispreparing;
                    self.select.dtenrol = res.data.info[0].rec[0].dtenrol;
                    self.select.idgym = res.data.info[0].rec[0].idgym;
                    self.select.iduser = res.data.info[0].rec[0].id;
                    self.select.username = res.data.info[0].rec[0].crm_qm;
                    self.select.code = res.data.info[0].rec[0].code;
                    self.select.codes = res.data.info[0].rec[0].codes;
                }  
            },function(res){
                console.error(res);
            });
        },
        url_transfer:function(gymcode){
            var urlBase="https://bbk.800app.com/uploadfile/staticresource/238592/279833/gymPreparing.html?gymcode=";
            return urlBase+gymcode;
        },
        get_audit:function(username){
            var sql =sql_getAudit;
            sql =sql.replace("@consultant",username)
            sql=this.convertor.ToUnicode(sql);
            this.$axios.get(url_local,{
                params:{sql1:sql}
            })
            .then(function(res){
                if(res.status==200 && res.data.errcode==0){
                     if(res.data.arr){
                       self.tipForAudit=res.data.arr;
                       self.audit_tip_show=true;
                     }
                }  
            },function(res){
                console.error(res);
            });
        },
        getIndexes:function(code){ 
            var sql=sql_getIndex,self=this;
            sql=sql.replace("@gymcode",code);
            sql=this.convertor.ToUnicode(sql);
            this.$axios.get(url_local,{
                params:{sql1:sql}
            })
            .then(function(res){
                if(res.status==200 && res.data.errcode==0){
                  if(res=res.data.indx){
                        var indx=self.indexes.find(function(indx){
                            return indx.warn==false;
                        });
                        indx.items=[];
                        var champ=res["champion"]&&JSON.parse(res["champion"]);
                        var maxer=res["maxer"]&&JSON.parse(res["maxer"]);
                        if(champ){
                            indx.items.push({
                                label:"月销售冠军",
                                value:champ.name,
                                standard:champ['本月合同总金额']
                            })
                            indx.items.push({}); //空行
                        }
               
                        indx.items.push({
                            label:"体验邀约率",
                            value:res["体验预约率"],
                            standard:res["标准体验预约率"],
                            maxer:maxer["本月预约体验率"]
                        })
                        indx.items.push({
                            label:"体验出勤率",
                            value:res["体验出勤率"],
                            standard:res["标准体验出勤率"],
                            maxer:maxer["本月体验出席率"]
                        })
                        indx.items.push({
                            label:"新约转化率",
                            value:res["新约转化率"],
                            standard:res["标准新约转化率"],
                            maxer:maxer["本月新约转化率"]
                        })
                    
                        if(res.hasmember==1){
                            indx.items.push({}); //空行
                            indx.items.push({
                                label:"会员出勤率",
                                value:res["会员总出勤率"],
                                standard:res["标准会员总出勤率"],
                                maxer:maxer["会员出勤率"]
                            })
                        }
 
                        indx.title=res.name+"关键指标提醒  【月份:"+res.m+"】";
                        indx.warn=true;
                        indx.id=res.id;
                  }
                }  
            },function(res){
                console.error(res);
            });
        },
        updateWarn:function(indx){
            var self=this;
            var sql="update crm_zdytable_238592_27200_238592_view set crmzdy_87676912=0 where id=@id;select 0 errcode,'ok'errmsg for json path,without_array_wrapper";
            sql=sql.replace('@id',indx.id);
            this.$axios.get(url_jsonp,{
                params:{sql1:sql}
            })
            .then(function(res){
                indx.warn=false;
            },function(res){
                console.error(res);
            });
        }
      },
      ready: function () {
            this.getAcl();
            this.getRank();
      },
    

  } 

</script>
<style scoped>
    .text-center{
        padding: 1% 1%;
    }
    [v-cloak]{
        display:none;
    }
 
 
</style>
