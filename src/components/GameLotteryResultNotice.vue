<template>
    <div class="gameBet_right">
        <div class="title_openprizehistory">
            <span class="fl_openprizehistory"><i class="icofont_openprizehistory"></i>开奖公告</span>
            <span class="fr_openprizehistory"><router-link :to="'/history/' + currentGame.id">开奖历史</router-link></span>
        </div>
        <div class="contentdata_openprizedata">
            <table>
                <colgroup>
                    <col>
                    <col>
                    <col>
                    <col>
                    <col>
                </colgroup>
                <thead class="ant-table-thead">
                    <tr>
                        <th rowspan="2"><span>期数</span></th>
                        <th rowspan="2"><span>奖号</span></th>
                        <th rowspan="2"><span>和值</span></th>
                        <th colspan="4"><span>形态</span></th>
                    </tr>
                </thead>
                <tbody class="ant-table-tbody">
                    <tr class="ant-table-row" v-if="list.length === 0">
                        <td colspan="5">暂时没有数据！</td>
                    </tr>
                    <tr class="ant-table-row" v-else v-for="(item, index) in list">
                        <td>{{ item.number }}</td>
                        <td>{{ item.balls }}</td>
                        <td>{{ andValues[index].andValue}}</td>
                        <td><em :class="andValues[index].largeOrSmall.class">{{ andValues[index].largeOrSmall.name }}</em></td>
                        <td><em :class="andValues[index].oddOrEven.class">{{ andValues[index].oddOrEven.name }}</em></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import * as ajax from '../api';
    import { datatype } from '../common/basic';
    import { largeOrSmallOfAndValue, oddOrEvenOfAndValue } from '../common/Lottery';
    import gameBasic from '../mixins/gameBasic';

    export default {
        name: 'GameLotteryResultNotice',
        mixins: [gameBasic],
        data(){
            return {
                list: []
            };
        },
        computed: {
            // state

            // computed
            andValues(){
                let list = [], andValue, ls, oe;
                this.list.forEach(item => {
                    andValue = 0;
                    item.balls.split(',').forEach(ball => {
                        ball = parseInt(ball, 10);
                        andValue += isNaN(ball) ? 0 : ball;
                    });
                    ls = largeOrSmallOfAndValue(andValue);
                    oe = oddOrEvenOfAndValue(andValue);
                    list.push({
                        andValue: andValue,
                        largeOrSmall: ls,
                        oddOrEven: oe
                    });
                });
                return list;
            }
        },
        created(){
            this.fetchLotteryNotice();
        },
        watch: {
            '$route'(to, from){
                this.list = [];
                this.fetchLotteryNotice();
            },
            list(val){
                this.$emit('input', {
                    list: val,
                    andValues: this.andValues
                });
            }
        },
        methods: {
            fetchLotteryNotice(){
                return ajax.apiFetchGameLotteryResultNotice({
                    gameId: this.currentGame.id
                }).then(json => {
                    if(typeof json === 'undefined') return;
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                        return;
                    }

                    let list = [];
                    if(datatype(json) === 'array'){
                        json.forEach(item => {
                            list.push({
                                number: item.NUMBER.split('').slice(8).join(''),
                                balls: item.OPEN_NUMBER
                            });
                        });
                    }
                    this.list = list;
                });
            }
        }
    };
</script>
