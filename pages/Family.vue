<template>
	<div id="app">
		<div class="ui container" id="result">
			<div class="ui segments" >
				<div class="ui segment" >
					<div class="ui one column stackable grid">
						<div class="column" >
							<div class="ui tabular menu">
				               <a v-for="m of select.menuGroup" :key="m.id" v-show="enabled(m.id)" class="item" :class="{active:m.id==select.cur_menu}" @click="menuChange(m.id)" v-link="{path:m.path}" v-text="m.name"></a>
                               <a class="item" v-show="isadmin" href="https://bbk.800app.com/uploadfile/staticresource/238592/279833/import_family_head.aspx" target="_blank">批量导入家庭</a>
							</div>
						</div>
					</div>
				</div> 
                <div class="ui segment">
                    <div class="ui one column stackable grid">
                        <div class="column left aligned">
						   <div class="input-group">
							  <span class="input-group-addon">中心</span>           
			                  <v-select :value.sync="select.gym_selected" :options="gyms" options-label="name" options-value="gym" placeholder="请选择中心" search close-on-select></v-select>	
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
export default {
	  data(){
		return  { 
			select: {
                onlysql:false,
                menuGroup: [
                    {id:"family",name:'我的家庭',path:"/family/"}
                ],
                cur_menu:'family',
                start: false,
                loading_pic:"https://bbk.800app.com/uploadfile/staticresource/238592/279833/loading.gif",
                user:"",
				acl: "",
				gyms: [],
				gymNames:{},
				gym_selected:"",
                data: null,
                ids:[]
            }
            
		}
	  },
      components:{
           vSelect
      },
	  computed:{
            gyms:function(){
                var self=this;
                var gyms=self.select.gyms;
                if(gyms[0]){
                   self.select.gym_selected=gyms[0].gym;
                }
                return gyms;
            },
            isadmin:function(){
                if(this.select.acl.indexOf('系统管理员')!=-1
                  ||this.select.acl.indexOf('运营顾问')!=-1
                  ||(this.select.acl.indexOf('中心运营总监')!=-1&&this.select.gym_selected&&this.select.gym_selected.split("|")[2]==1)
                ){
                    return true;
                }
                return false;
            },
	  },
      methods: {
        enabled(name){
            if(name=="tutor" && !this.isadmin) return false;
            return true;
        },
        menuChange(cur){
            this.cur_menu=cur;
        },
        getAcl:function(){
            var self=this;
             var param=GetRequest() 
             if(param&&param.iduser){
                sql_quanxian = sql_quanxian.replace(/iduser/ig,param.iduser);
             }
            this.$axios.get(url_jsonp,{
                params:{sql1:sql_quanxian}
            })
            .then(function(res){
                if(res.status==200 && res.data.info[0].rec.constructor !=String){
                    self.select.acl = res.data.info[0].rec[0].crm_jiandang;
                    self.select.user = res.data.info[0].rec[0].crm_qm;
                }  
            },function(res){
                console.error(res);
            });
        },
        getGym:function(func){
             var self=this;
             var param=GetRequest() 
             if(param&&param.iduser){
                sql_getGym = sql_getGym.replace(/iduser/ig,param.iduser);
             }
			 sql_getGym = this.convertor.ToUnicode(sql_getGym);
             self.$axios.get(url_jsonp,{
                 params:{sql1: sql_getGym}
             }).then(function(res){
                 if(res.status==200){
                    self.select.gyms = res.data.info[0].rec;
                    self.select.gyms.map(function(g){
                        self.select.gymNames[g.id]=g.name;
                    })
                 } 
             },function(res){
                 console.error(res.status);
             });
        }
      },
      created: function () {
           this.getAcl();
           this.getGym();
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
