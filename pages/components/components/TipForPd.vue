<template>
    <div>
      <modal :show.sync="grade.show" effect="fade" @click="grade.show=false;grade.show=true;" >
            <div slot="title" class="modal-title">
                <span class="glyphicon glyphicon-info-sign text-danger"></span>
                <b  class="text-danger" v-text="grade.title"></b> 
            </div>
            <div slot="modal-body" class="modal-body">
          
                    <div class="ui segment" v-for="item in grade.data">
                      {{item.ls}}-{{item.g|json}}
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
                    data:[ {ls:"xxx",g:[{"xx":1}]},


                    ]
                }
            }
        },
        computed:{
 
        },
        methods:{
            getLs:function(){
                var self=this;
                var sql=sql_getGrades;
                sql=sql.replace('@iduser',313345);
                sql=this.convertor.ToUnicode(sql);
                this.$axios.get(url_local,{
                    params:{sql1:sql}
                })
                .then(function(res){
                    if(res.data&&res.data.errcode==0){
                        let ls=res.data.ls;
                        ls.forEach(element => {
                            self.getGrades(element.name);
                        });
                        self.grade.show=true;
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
                   
                       self.grade.data.push({ls:ls,g:res.data});
                            

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
 
</style>