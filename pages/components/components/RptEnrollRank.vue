<template>
    <div id="PanelExcel" class="ui segment total"  >
            <div class="ui grid">
                <div class="two column row">
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
            }

        },
        data:function(){
            return {
                 type:'time',
                 orders:{time:1,mx_time:-1,num:-1}
            }
        },
        computed:{

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