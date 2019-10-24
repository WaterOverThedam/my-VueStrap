<template>
    <div>
      <modal :show.sync="grade.show" effect="fade" >
            <div slot="title" class="modal-title">
                <span class="glyphicon glyphicon-info-sign text-danger"></span>
                <b  class="text-danger" v-text="u.name"></b> 
            </div>
            <div slot="modal-body" class="modal-body">
                <template v-for="d,key of grade.data" >
                      {{key}}
                </template>
            </div>
            <div slot="modal-footer" >
               <p class="text-center">
                <button type="button" class="btn btn-danger btn-block">知道了，关闭</button>
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
                    data:{


                    }
                };
            }
        },
        computed:{
 
        },
        methods:{
 
        },
        ready:function(){

        }
    }
</script>
<style scoped>
 
</style>