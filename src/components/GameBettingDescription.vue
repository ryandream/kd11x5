<template>
    <div class="betting-description">
        <div class="bottom_boxs">
            <h3 @click="toggle(1)"><strong>开奖形态</strong><span class="more_kje"><b>{{ tab1 ? '收起' : '展开' }}</b></span></h3>
            <div class="content_openprizehistory" v-show="tab1">
                <div class="ant-table">
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
                                <th><span>期号</span></th>
                                <th><span>开奖结果</span></th>
                                <th colspan="3"><span>和值</span></th>
                            </tr>
                        </thead>
                        <tbody class="ant-table-tbody">
                            <tr class="ant-table-row" v-for="(item, index) in lotteryResultNotice.list">
                                <td>{{ item.number }}</td>
                                <td>{{ item.balls }}</td>
                                <td>{{ lotteryResultNotice.andValues[index].andValue }}</td>
                                <td><em :class="lotteryResultNotice.andValues[index].largeOrSmall.class">{{ lotteryResultNotice.andValues[index].largeOrSmall.name }}</em></td>
                                <td><em :class="lotteryResultNotice.andValues[index].oddOrEven.class">{{ lotteryResultNotice.andValues[index].oddOrEven.name }}</em></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="bottom_box_playmethod">
            <h3 @click="toggle(2)"><strong>中奖说明</strong><span class="more_kje"><b>{{ tab2 ? '收起' : '展开' }}</b></span></h3>
            <div class="helpContent" v-show="tab2">
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
                            <th><span>玩法</span></th>
                            <th><span>开奖号码示例</span></th>
                            <th><span>投注号码示例</span></th>
                            <th><span>中奖规则</span></th>
                            <th><span>赔率</span></th>
                        </tr>
                    </thead>
                    <tbody class="ant-table-tbody">
                        <tr class="ant-table-row">
                            <td>前二直选</td>
                            <td>1 2 3 4 5</td>
                            <td>12***</td>
                            <td>投注号码与当期开奖号码的连续前面两位号码按位相符（万位+千位），即中奖</td>
                            <td>100</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>前二组选</td>
                            <td>1 2 3 4 5</td>
                            <td>01-11组合，两个成一注</td>
                            <td>投注号码与当期开奖号码的连续前面两位（万位+千位）号码相同，即中奖</td>
                            <td>51</td>
                        </tr>
                        <tr class="ant-table-row ">
                            <td>前二组选胆拖</td>
                            <td>1 2 3 4 5</td>
                            <td>胆码：01-11（胆码最多一个）拖码：01-11（不与胆码相同）</td>
                            <td>投注号码与当期开奖号码的连续前面两位（万位+千位）号码相同，即中奖</td>
                            <td>51</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>后二直选</td>
                            <td>1 2 3 4 5</td>
                            <td>***45</td>
                            <td>投注号码与当期开奖号码的连续后两位号码按位相符（十位+个位），即中奖</td>
                            <td>100</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>后二组选</td>
                            <td>1 2 3 4 5</td>
                            <td>01-11组合，两个成一注</td>
                            <td>投注号码与当期开奖号码的连续后两位号码按位相符（十位+个位），即中奖</td>
                            <td>51</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>后二组选胆拖</td>
                            <td>1 2 3 4 5</td>
                            <td>胆码：01-11（胆码最多一个）拖码：01-11（不与胆码相同）</td>
                            <td>投注号码与当期开奖号码的连续后两位号码按位相符（十位+个位），即中奖</td>
                            <td>51</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>前三直选</td>
                            <td>1 2 3 4 5</td>
                            <td>123**</td>
                            <td>投注号码与当期开奖号码的连续前面三位号码按位相符（万位+千位+百位），即中奖</td>
                            <td>900</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>前三组选</td>
                            <td>1 2 3 4 5</td>
                            <td>自选内容：01-11组合，三个成一注</td>
                            <td>投注号码与当期开奖号码的连续前面三位（万位+千位+百位）号码相同（顺序不限），即中奖</td>
                            <td>150</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>前三组选胆拖</td>
                            <td>1 2 3 4 5</td>
                            <td>胆码：01-11（胆码最多一个拖码：01-11（不与胆码相同，至少2个）</td>
                            <td>投注号码与当期开奖号码的连续前面三位（万位+千位+百位）号码相同（顺序不限），即中奖</td>
                            <td>150</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>中三直选</td>
                            <td>1 2 3 4 5</td>
                            <td>*233*</td>
                            <td>投注号码与当期开奖号码的连续中间三位号码按位相符（千位+百位+十位），即中奖</td>
                            <td>900</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>中三组选</td>
                            <td>1 2 3 4 5</td>
                            <td>自选内容：01-11组合，三个成一注</td>
                            <td>投注号码与当期开奖号码的连续中间三位（千位+百位+十位）号码相同（顺序不限），即中奖</td>
                            <td>150</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>中三组选胆拖</td>
                            <td>1 2 3 4 5</td>
                            <td>胆码：01-11（胆码最多一个拖码：01-11（不与胆码相同，至少2个</td>
                            <td>投注号码与当期开奖号码的连续中间三位（千位+百位+十位）号码相同（顺序不限），即中奖</td>
                            <td>150</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>后三直选</td>
                            <td>1 2 3 4 5</td>
                            <td>**354</td>
                            <td>投注号码与当期开奖号码的连续后三位号码按位相符（百位+十位+个位），即中奖</td>
                            <td>900</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>后三组选</td>
                            <td>1 2 3 4 5</td>
                            <td>自选内容：01-11组合，三个成一注</td>
                            <td>投注号码与当期开奖号码的连续后三位号码按位相符顺序不限（百位+十位+个位），即中奖</td>
                            <td>150</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>后三组选胆拖</td>
                            <td>1 2 3 4 5</td>
                            <td>胆码：01-11（胆码最多一个）拖码：01-11（不与胆码相同，至少2个</td>
                            <td>投注号码与当期开奖号码的连续后三位号码按位相符顺序不限（百位+十位+个位），即中奖</td>
                            <td>150</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>定位胆</td>
                            <td>1 2 3 4 5</td>
                            <td>从01-11中任意选择1个号码为一注</td>
                            <td>投注号码与所开奖的对应位置（包括个位，十位，百位，千位，万位）相同且与开奖号码相同，即中奖。</td>
                            <td>10</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>非定位胆前三</td>
                            <td>1 2 3 4 5</td>
                            <td>从01-11中任意选择1个号码为一注</td>
                            <td>投注号码与所开奖的前三位（包括万位，千位，百位）任意一位相同，即中奖。</td>
                            <td>3</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>非定位胆中三</td>
                            <td>1 2 3 4 5</td>
                            <td>从01-11中任意选择1个号码为一注</td>
                            <td>投注号码与所开奖的中间三位（包括千位，百位，十位）任意一位相同，即中奖。</td>
                            <td>3</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>非定位胆后三</td>
                            <td>1 2 3 4 5</td>
                            <td>从01-11中任意选择1个号码为一注</td>
                            <td>投注号码与所开奖的后三位（包括百位，十位，个位）任意一位相同，即中奖。</td>
                            <td>3</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>任选一中一</td>
                            <td>1 2 3 4 5</td>
                            <td>从01-11中任意选择1个号码为一注</td>
                            <td>投注号码与所开奖的号码任意一位相同，即中奖。</td>
                            <td>2</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>任选二中二</td>
                            <td>1 2 3 4 5</td>
                            <td>从01-11中任意选择2个号码为一注</td>
                            <td>投注号码与所开奖的号码任意两位相同，即中奖。</td>
                            <td>5</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>任选三中三</td>
                            <td>1 2 3 4 5</td>
                            <td>从01-11中任意选择3个号码为一注</td>
                            <td>投注号码与所开奖的号码任意三位相同，即中奖。</td>
                            <td>15</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>任选四中四</td>
                            <td>1 2 3 4 5</td>
                            <td>从01-11中任意选择4个号码为一注</td>
                            <td>投注号码与所开奖的号码任意四位相同，即中奖。</td>
                            <td>62</td>
                        </tr>
                        <tr class="ant-table-row ">
                            <td>任选五中五</td>
                            <td>1 2 3 4 5</td>
                            <td>从01-11中任意选择5个号码为一注</td>
                            <td>投注号码与所开奖的号码任意五位相同，即中奖。</td>
                            <td>300</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>任选六中五</td>
                            <td>1 2 3 4 5</td>
                            <td>从01-11中任意选择6个号码为一注</td>
                            <td>投注号码与所开奖的号码任意五位相同，即中奖</td>
                            <td>72</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>任选七中五</td>
                            <td>1 2 3 4 5</td>
                            <td>从01-11中任意选择7个号码为一注</td>
                            <td>投注号码与所开奖的号码任意五位相同，即中奖。</td>
                            <td>20</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>任选八中五</td>
                            <td>1 2 3 4 5</td>
                            <td>从01-11中任意选择8个号码为一注</td>
                            <td>投注号码与所开奖的号码任意五位相同，即中奖。</td>
                            <td>7</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>任选胆拖二中二</td>
                            <td>1 2 3 4 5</td>
                            <td>胆码：01-11（胆码至少一个）拖码：01-11（一个拖码）</td>
                            <td>投注号码与所开奖的号码任意两位相同，即中奖。</td>
                            <td>5</td>
                        </tr>
                        <tr class="ant-table-row ">
                            <td>任选胆拖三中三</td>
                            <td>1 2 3 4 5</td>
                            <td>胆码：01-11（胆码至少一个）拖码：01-11（两个拖码）</td>
                            <td>投注号码与所开奖的号码任意三位相同，即中奖。</td>
                            <td>15</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>任选胆拖四中四</td>
                            <td>1 2 3 4 5</td>
                            <td>胆码：01-11（胆码至少一个）拖码：01-11（三个拖码）</td>
                            <td>62</td>
                        </tr>
                        <tr class="ant-table-row  ">
                            <td>任选胆拖五中五</td>
                            <td>1 2 3 4 5</td>
                            <td>胆码：01-11（胆码至少一个）拖码：01-11（四个拖码）</td>
                            <td>投注号码与所开奖的号码任意五位相同，即中奖。</td>
                            <td>300</td>
                        </tr>
                        <tr class="ant-table-row  ">
                            <td>任选胆拖六中五</td>
                            <td>1 2 3 4 5</td>
                            <td>胆码：01-11（胆码至少一个）拖码：01-11（五个拖码）</td>
                            <td>投注号码与所开奖的号码任意五位相同，即中奖。</td>
                            <td>72</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>任选胆拖七中五</td>
                            <td>1 2 3 4 5</td>
                            <td>胆码：01-11（胆码至少一个）拖码：01-11（六个拖码）</td>
                            <td>投注号码与所开奖的号码任意五位相同，即中奖。</td>
                            <td>20</td>
                        </tr>
                        <tr class="ant-table-row">
                            <td>任选胆拖八中五</td>
                            <td>1 2 3 4 5</td>
                            <td>胆码：01-11（胆码至少一个）拖码：01-11（七个拖码）</td>
                            <td>投注号码与所开奖的号码任意五位相同，即中奖。</td>
                            <td>7</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import * as ajax from '../api';
    import gameBasic from '../mixins/gameBasic';

    export default {
        name: 'GameBettingDescription',
        mixins: [gameBasic],
        props: ['lotteryResultNotice'],
        data(){
            return {
                tab1: false,
                tab2: false
            };
        },
        methods: {
            toggle(index){
                this['tab' + index] = !this['tab' + index];
            }
        }
    };
</script>
