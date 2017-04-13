<template>
    <section class="ranking_list">
        <div class="tt_webnews"><i class="anticon "></i>技巧攻略</div>
        <div class="cm_punlic">
            <ul>
                <div class="ant-row" v-for="item in list">
                    <div class="ant-col-24"><p @click="openPromptbox(item.id)">{{ item.title }}</p></div>
                </div>
            </ul>
        </div>
    </section>
</template>

<script>
    import * as ajax from '../api';
    import { datatype } from '../common/basic';

    export default {
        name: 'HomeRankingList',
        data(){
            return {
                list: []
            };
        },
        created(){
            this.fetchRankingList();
        },
        methods: {
            fetchRankingList(){
                return ajax.apiFetchRankingList().then(json => {
                    if(typeof json === 'undefined') return;
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                        return;
                    }

                    if(datatype(json) !== 'array') return;
                    
                    let list = [];
                    json.forEach(item => {
                        list.push({
                            id: item.Id,
                            title: item.Title
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
