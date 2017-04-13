<template>
    <div class="cm_border">
        <div class="cm_r_title"><i class="anticon"></i><h5>网站公告</h5></div>
        <div class="cm_punlic">
            <div class="ant-row" v-for="item in list">
                <div class="ant-col-24"><p @click="openPromptbox(item.id)">{{ item.date }} {{ item.title }}</p></div>
            </div>
        </div>
        <div class="phonobuy_webnews">
            <img class="qs_webnews" src="../../static/css/images/erweima.png">

            <div class="buyTitle_webnews">
                <span class="strongColor_webnews">手机投注 随时随地</span>
                <p><img src="../../static/upload/26541.png" width="138" height="45"></p>
            </div>
        </div>
    </div>
</template>

<script>
    import { datatype } from '../common/basic';
    import * as ajax from '../api';
    
    export default {
        name: 'HomeLatestNotices',
        data(){
            return {
                list: []
            };
        },
        created(){
            this.fetchNoticesList();
        },
        methods: {
            fetchNoticesList(){
                return ajax.apiFetchNoticeList().then(json => {
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                        return;
                    }

                    if(datatype(json) !== 'array') return;
                    
                    let list = [];
                    json.forEach(item => {
                        list.push({
                            id: item.Id,
                            title: item.Title,
                            date: item.Date
                        });
                    });
                    this.list = list;
                });
            },
            openPromptbox(id){
                this.$root.$children[0].$refs.promptbox.open(id);
            }
        }
    };
</script>
