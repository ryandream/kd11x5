<template>
    <section class="carouse_width">
        <div class="carouse_content">
            <marquee direction="left" loop>
                <table>
                    <tbody>
                        <tr>
                            <td v-for="item in list">
                                <div class="tdcontent">会员{{ item.userName }}中奖<span class="moneystyle">{{ item.amount }}</span> 元</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </marquee>
        </div>
    </section>
</template>

<script>
    import * as ajax from '../api';
    import { datatype } from '../common/basic';
    
    export default {
        name: 'HomeUserNews',
        data(){
            return {
                list: []
            };
        },
        created(){
            this.fetchWinList();
        },
        methods: {
            fetchWinList(){
                return ajax.apiFetchWinList().then(json => {
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
