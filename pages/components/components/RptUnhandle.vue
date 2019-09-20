<template>
    <div id="PanelExcel" class="ui segment total"  >
            <div class="ui grid">
                <div class="two column row" style="margin-left:0.4%;">
                    <div class="column center aligned">
                            <Tag color="error">超过4小时未及时跟进中心负排名</Tag>
                            <table class="ui celled table">
                                <thead>
                                    <tr class="positive">
                                        <th>排名</th>
                                        <th>中心</th>
                                        <th>人数</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="r of handle_rank_down">
                                        <td>{{$index+1}}</td>
                                        <td>{{r['中心']}}</td>
                                        <td>{{r['人数']}}</td>
                                    </tr>
                                </tbody>
                            </table>
                    </div>
                    <div class="column center aligned">
                            <Tag color="primary">例子平均处理时间排名</Tag>
                            <table class="ui celled table">
                                <thead>
                                    <tr class="positive">
                                        <th ui blue ribbon label>排名</th>
                                        <th>中心</th>
                                        <th class="is-leaf is-sortable" :class="{' ascending':orders.num==1,' descending':orders.num==2}">
                                            <div class="cell">处理例子数<span class="caret-wrapper" >
                                                <i class="sort-caret ascending"  @click="paiXu('num',1)"></i>
                                                <i class="sort-caret descending" @click="paiXu('num',2)"></i></span>
                                            </div>
                                        </th>
                                        <th class="is-leaf is-sortable" :class="{' ascending':orders.time==1,' descending':orders.time==2}">
                                            <div class="cell">平均时长(分钟)<span class="caret-wrapper" >
                                                <i class="sort-caret ascending"  @click="paiXu('time',1)"></i>
                                                <i class="sort-caret descending" @click="paiXu('time',2)"></i></span>
                                            </div>
                                        </th>
                                        <th class="is-leaf is-sortable" :class="{' ascending':orders.mx_time==1,' descending':orders.mx_time==2}">
                                            <div class="cell">最长时间(分钟)<span class="caret-wrapper" >
                                                <i class="sort-caret ascending"  @click="paiXu('mx_time',1)"></i>
                                                <i class="sort-caret descending" @click="paiXu('mx_time',2)"></i></span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="r of handle_time_ave_filter">
                                        <td>{{$index+1}}</td>
                                        <td>{{r['gym']}}</td>
                                        <td>{{r['num']}}</td>
                                        <td>{{r['time']}}</td>
                                        <td>{{r['mx_time']}}</td>
                                    </tr>
                                </tbody>
                            </table>
                    </div>
                </div>
                <div class="one column row">
                    <div class="column center aligned" style="margin-left:0.6%;">
                        <Tag color="success">4小时内及时跟进中心正排名</Tag>
                        <table class="ui celled table">
                            <thead>
                                <tr class="positive">
                                    <th>排名</th>
                                    <th>中心</th>
                                    <th>人数</th>
                                </tr>

                            </thead>
                            <tbody>
                                <tr v-for="r of handle_rank">
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
            handle_rank_down: {
                type: Array,
                default: []
            },
            handle_rank: {
                type: Array,
                default: []
            },
            handle_time_ave: {
                type: Array,
                default: []
            }

        },
        data:function(){
            return {
                 type:'time',
                 orders:{time:1,mx_time:-1,num:-1}
            }
        },
        computed:{
            handle_time_ave_filter:function(){
               var self=this;
               var res=self.handle_time_ave;
               if(res&&self.orders[self.type]!=-1){
                  return res.sort(function(a,b){
                      if(self.orders[self.type]==1){
                          return a[self.type]-b[self.type];
                      }else{
                          return b[self.type]-a[self.type];
                      }
                  })
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