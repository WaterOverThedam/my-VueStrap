<template>
        <div class="ui segment">
            <table class="ui selectable celled table">
                <tr class="positive">
                    <th>本期会员数</th>
                    <th>本期非会员数</th>
                    <th>期末截止活跃会员总数</th>
                    <th>期末截止历史会员总数</th>
                    <th>期末截止会员总数</th>
                    <th>期末截止用户总数</th>
                    <th>期末筹备中的中心</th>
                    <th>期末已开业的中心</th>
                    <th>期末截止中心总数</th>
                </tr>
                <tr>
                    <td>{{stat['会员']}}</td>
                    <td>{{stat['非会员']}}</td>
                    <td>{{stat['期末截止活跃会员总数']}}</td>
                    <td>{{stat['期末截止历史会员总数']}}</td>
                    <td>{{stat['期末截止会员总数']}}</td>
                    <td>{{stat['期末截止用户总数']}}</td>
                    <td>{{stat['筹备中的中心']}}</td>
                    <td>{{stat['已开业的中心']}}</td>
                    <td>{{stat['期末截止中心总数']}}</td>
                </tr>
            <table>
        </div>
 </template>

<script> 
    export default {
        props: {
            //loading进度
            stat: {
                type: Object,
                default: {}
            },

        },
        data:function(){
            return {
            }
        },
        computed:{

        },
        methods:{
        
        },
        created:function(){

        }
    }
</script>
<style scoped>
  
</style>