<template>
	<div id="app">
		<div class="ui container" id="result">
			<div class="ui segments" >
				<div class="ui segment" >
					<div class="ui one column stackable grid">
						<div class="column" >
							<div class="ui tabular menu">
				               <a v-for="m of select.menuGroup" :key="m.name" v-show="m.enabled" class="item" :class="{active:m.isActive}" @click="menuChange(m)" v-link="{path:m.path}" v-text="m.name"></a>
							</div>
						</div>
					</div>
				</div> 
                <div class="ui segment">
                    <div class="ui one column stackable grid">
                        <div class="column left aligned">
						   <div class="input-group">
							  <span class="input-group-addon">中心</span>           
			                  <v-select :value.sync="select.gym_selected" :multiple="select.multi" :options="gyms_valid" options-label="name" options-value="id" placeholder="请选择中心" search close-on-select></v-select>	
                           </div>
                        </div>
                    </div>
                </div>
			</div>
            <router-view :select="select"></router-view> 
		</div>
	</div>	
</template>

<script>
import vSelect from '@/src/Select.vue';
import exception from './components/campaign_exception.json'

export default {
	  data(){
		return  { 
			select: {
                onlysql:false,
                menuGroup:[
                    {name:'Home',path:"/home/1",isActive:true,enabled:true},
                    {name:'Report',path:"/report",isActive:false,enabled:false}
                ],
                vgroup:[{name:'常用',members:['官网预约体验','开业地推','地推派发','大众点评名单']},{name:'比赛',members:['挑战赛','冠军赛']},{name:'小小奥运',members:['小小奥运','集训营']},{name:'线下',members:['线下']},{name:'其它',members:['*']}],
                group_cur:null,
                start: false,
                loading_pic:"https://bbk.800app.com/uploadfile/staticresource/238592/279833/loading.gif",
                isShow: true,
				campaigns:[],
				campaign_selected:null,
                acl: "",
				ids:[],
                gyms: [],
				gymNames:{},
				gym_selected:"",
                data: null,
                multi:false
            }
		}
	  },
      components:{
           vSelect
      },
	  computed:{
            gyms_valid:function(){
                var self=this;
                if(self.select.gyms.length==0) return []; //确保先有gymName,再gym_selected触发查询
                var gyms=self.select.gyms;
                gyms&&gyms.filter(function(g){
                    self.select.gymNames[g.id]=g.name;
                    return g.status==1;
                    //||self.isadmin;//中心看不到停用，管理员可以看到所有
                });
                if(self.select.acl
                  &&self.select.acl!="no record!"&&
                  !(self.select.acl.indexOf("系统管理员")==-1
                  &&self.select.acl.indexOf("运营顾问")==-1
                  &&self.select.acl.indexOf("市场专员")==-1
                  &&self.select.acl.indexOf("月球运营总监开发")==-1
                  &&self.select.acl.indexOf("测试员工")==-1
                  &&self.select.acl.indexOf("市场顾问")==-1)){
                    gyms.unshift({id:"all",name:"所有中心"})
                }
                if(gyms[0]){
                   self.select.gym_selected=gyms[0].id;
                }
                return gyms;
            },
            isadmin:function(){
    	      if(this.select.acl.indexOf('系统管理员')!=-1
              ||this.select.acl.indexOf('市场顾问')!=-1
              ||this.select.acl.indexOf('运营顾问')!=-1
              ||this.select.acl.indexOf("月球运营总监开发")!=-1
              ||this.select.acl.indexOf("测试员工")!=-1
              ||this.select.acl.indexOf('市场专员')!=-1){
    		     return true;
    		  }
    		  return false;
            }
	  },
      methods: {
        menuChange(cur){
            this.select.menuGroup.map((n)=>{
                n.isActive=false;
            });
            cur.isActive=true;
        },
        getAcl_jsonp:function(){
            let self=this;
		    this.$axios({
				method: 'post',
				url:url_jsonp,
                data:$.param({sql1:sql_quanxian})
			}).
            then(function(res){
                if(res.data.info[0].rec.constructor !=String){
                     self.select.acl = res.data.info[0].rec[0].acl;
				}
            },function(res){
                console.log(res.status);
            });
        },
        getgym:function(func){
		     var self=this;
             sql_getGym = this.convertor.ToUnicode(sql_getGym);
             self.select.gyms=[];
		     self.$axios({
				method: 'post',
				url:url_jsonp,
                data:$.param({sql1:sql_getGym})
			}).then(function(res){
                 if(typeof res.data.info[0].rec!="string"){
                    self.select.gyms = res.data.info[0].rec; //触其它data更新
                 }
             },function(res){
                 console.log(res.status);
             });
       },
       getCampaign:function(func){
            var self=this;
            self.select.campaigns=[];
			self.$axios({
				method: 'post',
				url:url_jsonp,
                data:$.param({sql1:sql_campaign})
			}).then(function(res){
                 var campaigns= res.data.info[0].rec;
                 campaigns.map(function(g){
                     if(self.isadmin){
                        self.select.campaigns.push({id:g.name,name:g.name});
                     }else {
                        //if(g.name=='东方CJ') console.error(exception.indexOf(g.name))
                        if(exception.indexOf(g.name)==-1){
                           self.select.campaigns.push({id:g.name,name:g.name});
                        }
                     }
                 }) 
             },function(res){
                 console.log(res.status);
             });
        },
        debug: function () {
	       alert(JSON.stringify(this.check["msg"]))
           alert(JSON.stringify(this.check))
        } 
      },
      created: function () {
           //console.log(exception)
           this.getAcl_jsonp();
           this.getCampaign();
           this.getgym();
      }
  } 

</script>
   <style>
        .ui .label.total{
            font-size: 2.4em;
        }
	    #result{
          width:98%!important;

        }
        .btn-sm{
           line-height: 1!important;
        }
        .ui .checkbox {
            cursor:pointer!important;
            margin-right: 20px!important;
        }
        select {
          border: none;
          outline: none;
          cursor: default;
        }
        .fans{
            font-size: 1.8em;
        }
		th{
		  font-size:1.6em;
		}
		td{
		  font-size:1.4em;
		}
		.bold{
		  font-size:1.8em;
		  font-weight:900;
		}
		.blue{
		  color:blue;
		  font-size:1.4em;
		  font-weight:500;
		}
    </style>
