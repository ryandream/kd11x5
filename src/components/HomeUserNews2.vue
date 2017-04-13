<template>
    <section class="ranking_list">
        <div class="tt_vipinif">
            <i class="anticon "></i>会员信息
        </div>
        <div class="carouse_content-1">
            <table>
                <tbody>
                    <tr v-for="item in list">
                        <td>
                            <div class="tdcontent_vipinif">会员 {{ item.userName }} 成功提现
                               <span class="moneystyle_vipinif">{{ item.amount }}</span> 元
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
    import * as ajax from '../api';
    import { datatype } from '../common/basic';

    export default {
        name: 'HomeUserNews2',
        data(){
            return {
                list: []
            };
        },
        created(){
            this.fetchMoneyOutList();
        },
        methods: {
            fetchMoneyOutList(){
                return ajax.apiFetchMoneyOutList().then(json => {
                    if(typeof json === 'undefined') return;
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                        return;
                    }

                    if(datatype(json) !== 'array') return;
                    
                    let list = [];
                    json.forEach(item => {
                        list.push({
                            userName: item.user_name,
                            amount: item.amount
                        });
                    });
                    this.list = list;
                });
            }
        }
    };
</script>
