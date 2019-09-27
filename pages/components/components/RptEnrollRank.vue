<template>
    <div id="PanelExcel" class="ui segment total" style="margin-left:1%;">
            <div class="ui grid">
                <div class="one column row" v-if="show_active">
                    <div class="column center aligned">
                            <Tag color="primary">活跃会报名及排课</Tag>
                            <table class="ui celled table">
                                <thead>
                                    <tr class="positive">
                                        <th>序号</th>
                                        <th class="is-leaf is-sortable" :class="{' ascending':orders.gym==1,' descending':orders.gym==2}">
                                            <div class="cell">中心<span class="caret-wrapper" >
                                                <i class="sort-caret ascending"  @click="paiXu('gym',1)"></i>
                                                <i class="sort-caret descending" @click="paiXu('gym',2)"></i></span>
                                            </div>
                                        </th>
                                        <th class="is-leaf is-sortable" :class="{' ascending':orders.active==1,' descending':orders.active==2}">
                                            <div class="cell">年龄10个月以上活跃会员数<span class="caret-wrapper" >
                                                <i class="sort-caret ascending"  @click="paiXu('active',1)"></i>
                                                <i class="sort-caret descending" @click="paiXu('active',2)"></i></span>
                                            </div>
                                        </th>
                                        <th class="is-leaf is-sortable" :class="{' ascending':orders.all_enroll==1,' descending':orders.all_enroll==2}">
                                            <div class="cell">报名人数<span class="caret-wrapper" >
                                                <i class="sort-caret ascending"  @click="paiXu('all_enroll',1)"></i>
                                                <i class="sort-caret descending" @click="paiXu('all_enroll',2)"></i></span>
                                            </div>
                                        </th>
                                        <th class="is-leaf is-sortable" :class="{' ascending':orders.active_enroll==1,' descending':orders.active_enroll==2}">
                                            <div class="cell">活跃会员报名人数<span class="caret-wrapper" >
                                                <i class="sort-caret ascending"  @click="paiXu('active_enroll',1)"></i>
                                                <i class="sort-caret descending" @click="paiXu('active_enroll',2)"></i></span>
                                            </div>
                                        </th>
                                        <th class="is-leaf is-sortable" :class="{' ascending':orders.num_class==1,' descending':orders.num_class==2}">
                                            <div class="cell">10月14-20号有排课活跃会员数<span class="caret-wrapper" >
                                                <i class="sort-caret ascending"  @click="paiXu('num_class',1)"></i>
                                                <i class="sort-caret descending" @click="paiXu('num_class',2)"></i></span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="r of data_filter">
                                        <td>{{$index+1}}</td>
                                        <td>{{r['gym']}}</td>
                                        <td>{{r['active']}}</td>                                        
                                        <td>{{r['all_enroll']}}</td>
                                        <td>{{r['active_enroll']}}</td>
                                        <td>{{r['num_class']}}</td>
                                    </tr>
                                </tbody>
                            </table>
                    </div>
                </div>
                <div class="two column row" v-if="!show_active" style="margin-left:0.2%;">
                    <div class="column center aligned">
                            <Tag color="error">报名会员分类统计</Tag>
                            <table class="ui celled table">
                                <thead>
                                    <tr class="positive">
                                        <th>会员分类</th>
                                        <th>人数</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="r of stat.type">
                                        <td>{{r['类别']}}</td>
                                        <td>{{r['人数']}}</td>
                                    </tr>
                                </tbody>
                            </table>
                    </div>
                    <div class="column center aligned">
                            <Tag color="primary">报名人数中心排名</Tag>
                            <table class="ui celled table">
                                <thead>
                                    <tr class="positive">
                                        <th>排名</th>
                                        <th>中心</th>
                                        <th>人数</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="r of stat.rank">
                                        <td>{{$index+1}}</td>
                                        <td>{{r['中心']}}</td>
                                        <td>{{r['人数']}}</td>
                                    </tr>
                                </tbody>
                            </table>
                    </div>
                </div>
            </div>
        </div>

 </template>

<script> 
    import Tag from 'src/tag';
    export default {
        components:{
            Tag
        },
        props: {
            //loading进度
            stat: {
                type: Object,
                default: {}
            },
            show_active: {
                type: Boolean,
                default: false
            }

        },
        data:function(){
            return {
                 type:'gym',
                 orders:{gym:1,active:-1,all_enroll:-1,active_enroll:-1,num_class:-1}
            }
        },
        computed:{
            data_filter:function(){
               var self=this;
               var res=self.stat.data;
               //console.error(self.orders[self.type]);
               if(res&&self.orders[self.type]!=-1){
                  res=res.sort(function(a,b){
                      if(self.orders[self.type]==1){
                          if(self.type=='gym'){
                              return a["gym"].localeCompare(b["gym"],"zh");
                          }
                          return a[self.type]-b[self.type];
                      }else{
                         if(self.type=='gym'){
                              return b["gym"].localeCompare(a["gym"],"zh");
                          }
                          return b[self.type]-a[self.type];
                      }
                  })
                  //console.error(res);
               }
               return res;
            }
        },
        methods:{
            paiXu:function(type,order){
                for(var i in this.orders){
                    this.orders[i]=-1;
                }
                this.orders[type]=order;
                console.log(this.orders);
                this.type=type;
            }
        },
        created:function(){

        }
    }
</script>
<style scoped>
  tr > th{
    font-size: 0.5em!important;
  }
</style>