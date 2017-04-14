<template>
    <main class="kd-body content_styles buy-together-body">
        <ul class="join_li">
            <router-link :to="'/buy-together/' + game.id" tag="li" v-for="game in gameList" @click="switchGame(game.id)" :key="'buyTogether' + game.id"><a>{{ game.name }}</a></router-link>
        </ul>
        <div class="rcontent_styles">
            <div class="minihead_styles">
                <div class="ico icoah minilogo_styles"></div>
                <div class="info_styles">
                    <div class="item_styles">
                        <h2>{{ currentGame.name }}</h2>
                        <p>第<span class="bold_styles">{{ currentLottery.number }}</span> 期 <span class="des_styles">每10分钟，开1期</span></p>
                    </div>
                    <div class="time_styles">投注截止时间： {{ currentLottery.endTime }}</div>
                    <div class="button_styles">
                        <router-link :to="'/game/' + currentGame.id">发起合买</router-link>
                        <router-link :to="'/game/' + currentGame.id">我要自购</router-link>
                        <router-link :to="'/game/' + currentGame.id">我的合买</router-link>
                    </div>
                </div>
            </div>
            <div class="table_styles hemai">
                <div class="ant-table">
                    <div class="ant-table-title tit">{{ currentGame.name }}</div>
                    <div class="ant-table-content hemaid">
                        <table>
                            <colgroup>
                                <col>
                                <col>
                                <col>
                                <col>
                                <col>
                                <col>
                                <col>
                                <col>
                                <col>
                                <col>
                            </colgroup>
                            <thead class="ant-table-thead hea">
                                <tr>
                                    <th><span>序号</span></th>
                                    <th><span>发起人</span></th>
                                    <th><span>战绩</span></th>
                                    <th><span>彩种</span></th>
                                    <th><span>方案进度</span></th>
                                    <th><span>方案金额</span></th>
                                    <th><span>每份金额</span></th>
                                    <th><span>剩余份数</span></th>
                                    <th><span>认购份数</span></th>
                                    <th><span>操作</span></th>
                                </tr>
                            </thead>
                            <tbody class="ant-table-tbody hea">
                                <tr v-if="list.length === 0">
                                    <td colspan="10">暂时没有数据</td>
                                </tr>
                                <tr v-else v-for="(item, index) in list">
                                    <td>{{ lengthPerPage * (currentPage - 1) + index + 1 }}</td>
                                    <td>{{ item.userName }}</td>
                                    <td>{{ item.militaryExploits }}</td>
                                    <td>{{ gameList[item.gameId].name }}</td>
                                    <td>{{ item.progress }}</td>
                                    <td>￥{{ item.totalAmount }}</td>
                                    <td>￥{{ item.unitAmount }}</td>
                                    <td>{{ item.remainCount }}份</td>
                                    <td><span class="chupiao" v-if="item.disabledBuy">{{ item.status }}</span><input v-else class="ant-input-gou-input" type="number" v-model="item.count"></td>
                                    <td>
                                        <span>
                                            <a @click="goToJoin(item, index)" :class="{'tdisabled_styles': item.disabledBuy}">参与</a>
                                            <span class="ant-divider"></span>
                                            <router-link :to="'/buy-together-detail/' + item.gameId + '/' + item.id">详情</router-link>
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <mod-pager v-if="list.length > 0" :currentPage="currentPage" :totalPages="totalPages" :totalCount="totalCount" @toPage="fetchListOfTogetherBuy"></mod-pager>
            </div>
        </div>
        <transition enter-active-class="animated zoom-in" leave-active-class="animated bounce-out">
            <section class="ant-modal" v-show="alert.isOpened" ref="goToJoinAlert">
                <div class="ant-modal-mask"></div>
                <div class="ant-modal-content">
                    <div class="ant-modal-body">
                        <i class="anticon" :class="'ant-confirm-' + alert.status"></i>
                        <span class="ant-confirm-title" v-if="alert.status === 'loading'">正在购买...</span>
                        <span class="ant-confirm-title" v-else-if="alert.status === 'error'">购买失败！</span>
                        <span class="ant-confirm-title" v-else-if="alert.status === 'success'">成功！</span>
                        <span class="ant-confirm-title" v-else>请确认您的下注信息！</span>

                        <div class="ant-confirm-content" v-if="alert.status === 'success'">{{ alert.validate }}</div>
                        <div class="ant-confirm-content" v-else>
                            <p>认购份数： {{ alert.count }} 份</p>
                            <p>每份金额：￥{{ alert.unitAmount }}</p>
                            <p>交易金额：￥{{ alert.unitAmount * alert.count }}</p>
                            <div class="validate" v-if="alert.validate">{{ alert.validate }}</div>
                        </div>
                        <div class="ant-confirm-btns">
                            <button type="button" class="ant-btn-lg" @click="close"><span>取消</span></button>
                            <button v-if="alert.status !== 'success'" type="button" class="ant-btn-lg" @click="joinToTogetherBuy" :disabled="alert.status === 'error'"><span>确定</span></button>
                        </div>
                    </div>
                </div>
            </section>
        </transition>
    </main>
</template>

<script>
    import * as ajax from '../api';
    import { datatype, getNameByCode, kdTimestamp } from '../common/basic';
    import gameBasic from '../mixins/gameBasic';

    export default {
        name: 'PageBuyTogether',
        mixins: [gameBasic],
        data(){
            return {
                lengthPerPage: 50,

                currentLottery: {
                    number: '',
                    endTime: ''
                },
                currentPage: 1,
                totalPages: 1,
                totalCount: 0,
                list: [],
                alert: {
                    isOpened: false,
                    status: 'info', // info, error, success, loading
                    planId: '',
                    unitAmount: 0,
                    count: 0,
                    validate: false,
                    index: false
                }
            };
        },
        computed: {
            // state
            systemTime(){
                return this.$store.state.time;
            },
            gameName(){
                return this.currentGame.name;
            }
        },
        watch: {
            '$route'(to, from){
                this.fetchListOfTogetherBuy(1);
            }
        },
        created(){
            this.fetchListOfTogetherBuy(1);
        },
        methods: {
            fetchListOfTogetherBuy(pageNum){
                return ajax.apiFetchListOfTogetherBuy({
                    currentPage: pageNum, //页码，提交空字符串时默认为1
                    lengthPerPage: this.lengthPerPage, //每页记录数，提交空字符串时默认为15
                    gameId: this.currentGame.id //游戏编码
                }).then(json => {
                    if(typeof json === 'undefined') return;
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                        return;
                    }

                    let list = [];

                    this.currentLottery = {
                        number: json.game.numbers, // 当期正在销售的期号
                        endTime: json.game.endDate // 投注截止时间
                    };
                    this.currentPage = parseInt(json.page, 10);
                    this.totalPages = parseInt(json.totalPage, 10);
                    this.totalCount = parseInt(json.total, 10);
                    if(datatype(json.list) === 'array'){
                        json.list.forEach(item => {
                            list.push({
                                id: item.planId, // 合买id
                                userName: item.User_Name, // 发起人
                                militaryExploits: item.zhanji, // 战绩
                                gameId: item.gameNo, // 彩种
                                progress: item.progress, // 进度
                                totalAmount: item.amount, // 总金额
                                unitAmount: item.perAmount, // 每份金额
                                totalCount: item.divNum, // 总份数
                                selfCount: item.buyNum, // 发起人购买份数
                                status: getNameByCode(item.state, ['未满员', '已满员', '已出票', '已撤单']), // 3、已出票 1、未满员 2 已满员 4 已撤单
                                joinCount: item.joinNum, // 跟单份数
                                remainCount: item.restNum, // 剩余份数
                                number: item.Numbers, // 期号
                                time: item.createDate, // 创建时间,

                                disabledBuy: item.state !== 1 || item.restNum === 0 || kdTimestamp(this.systemTime) >= kdTimestamp(this.currentLottery.endTime),
                                count: 1
                            });
                        });
                    }
                    this.list = list;
                });
            },
            joinToTogetherBuy(){
                this.alert.status = 'loading';
                return ajax.apiJoinToTogetherBuy({
                    planId: this.alert.planId,
                    count: this.alert.count,
                    gameId: this.currentGame.id
                }).then(json => {
                    if(typeof json === 'undefined') return;
                    if(json.S === 674){
                        this.alert.status = 'success';
                        this.alert.validate = json.S + ': ' + json.D;
                        this.list[this.alert.index].remainCount -= this.alert.count;
                    }else{
                        this.alert.status = 'error';
                        this.alert.validate = json.S + ':' + json.D;
                    }
                });
            },
            goToJoin(item, index){
                if(item.disabledBuy) return;

                this.$refs.goToJoinAlert.removeEventListener('animationend', this.resetAlert);
                this.alert.isOpened = true;

                this.alert.planId = item.id;
                this.alert.count = item.count;
                this.alert.unitAmount = item.unitAmount;
                this.alert.index = index;

                if(item.count > item.remainCount){
                    this.alert.status = 'error';
                    this.alert.validate = '购买份数不能超过剩余份数';
                }
            },
            resetAlert(){
                this.alert.status = 'info';
                this.alert.planId = '';
                this.alert.count = 0;
                this.alert.unitAmount = 0;
                this.alert.validate = false;
                this.alert.index = false;
            },
            close(){
                this.alert.isOpened = false;
                this.$refs.goToJoinAlert.addEventListener('animationend', this.resetAlert);
            }
        }
    };
</script>
