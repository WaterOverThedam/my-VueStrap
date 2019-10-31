<template>
    <div>
      <modal :show.sync="grade.show" effect="fade" width="85%">
            <div slot="title" class="modal-title">
                <span class="glyphicon glyphicon-info-sign text-danger"></span>
                <b  class="text-danger" v-text="grade.title"></b> 
            </div>
            <div slot="modal-body" class="modal-body">
                  <div class="parent">
                    <div class="ui segment" v-for="(key,item) in grade.data" track-by="$index">
                        <h3>{{key}}</h3>
                        <div class="ui segment" v-for="(k,v) in item">
                            <h4><b>{{progress(k,v)}}</b></h4>
                            <div class="ui segment">
                                <a href="javascript:void()" style="margin:0" v-for="i of v" class="tooltips" :title="i.subSection+(i.status==1?'【已完成】':'【未完成】')">
                                    <img class="smallicon" :alt="i.subSection" :src="statusUrl[i.status]">
                                </a>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
            <div slot="modal-footer" >
               <p class="text-center">
                <button type="button" class="btn btn-danger btn-block" @click="grade.show=false;">知道了，关闭</button>
               </p> 
            </div>
        </modal> 
    </div>

 </template>

<script> 
    import modal from '@/src/Modal.vue';
    export default {
        components:{
            modal
        },
        props: {

        },
        data:function(){
            return {
                grade:{
                    show:false,
                    title:"OTS老师培训进度提醒",
                    data:[]
                },
                statusUrl:["https://static.thelittlegym.com.cn/assert/img/oasis/small/cross.gif","https://static.thelittlegym.com.cn/assert/img/oasis/small/tick.gif",]
            }
        },
        computed:{
 
        },
        methods:{
            progress:function(k,v){
                let finish=0,all=0;
                v.forEach(function(i){
                    all++;
                    if(i.status==1) finish++;
                })
                let ratio=(finish*100/all).toFixed(1)
                return `${k}(已完成${ratio}%）`;
            },
            getLs:function(){
                var self=this;
                var sql=sql_getGrades;
                //sql=sql.replace('iduser',276502);
                //sql=sql.replace('iduser',393766);
                sql=this.convertor.ToUnicode(sql);
                this.$axios.get(url_local,{
                    params:{sql1:sql}
                })
                .then(function(res){
                    if(res.data&&res.data.errcode==0){
                        let ls=res.data.ls;
                        let arr=[]
                        if(ls){
                            ls.forEach(element => {
                                arr.push(element.name)
                            });
                        }
                       if(arr.length>0){
                         self.getGrades("'"+arr.join("','")+"'");
                       }
                       
                    }
                },function(res){
                    console.error(res);
                });
            },
            getGrades:function(ls){
                var self=this;
                this.$axios.get(url_grade,{
                    params:{user:ls}
                })
                .then(function(res){
                    if(res.status=200){
                       self.grade.data=res.data;
                       self.grade.show=true;
                       self.$nextTick(function(){
                            $('.tooltips').toolTip();
                       })
                    }
                    //console.error(JSON.stringify(self.grade));
                },function(res){
                    console.error(res);
                });
            },
        },
        ready:function(){
           this.getLs();
        }
    }
</script>
<style scoped>
        .parent{
            height:370px;
            overflow:scroll;
        }
 
        .smallicon{
            height: 20px;
            width: 2%;
            margin-left:0;
            margin-right:0;
        }
</style>