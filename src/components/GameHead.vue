<template>
    <div class="open_containers">
        <div class="cz_logo"><h2>{{ gameName }}</h2>
            <div class="sywicon_ticketlist big_lottery_js"></div>
        </div>
        <div class="cz_daojishi">
            <div class="open_issue" v-if="currentLottery.status">
                距 <b class="c_red">{{ currentLottery.number }}</b> 期投注截止还有：
            </div>
            <div class="open_issue" v-else>
                <b class="c_red">{{ currentLottery.number }}</b> 期已封盘，距下期开始还有：
            </div>
            <div class="j_lottery_time">{{ countdown }}</div>
        </div>
        <div class="cz_openNumb">
            <div class="open_issue">
                第 <b class="c_red">{{ prevLottery.number }}</b> 期开奖号码为：
            </div>
            <div>
                <ul>
                    <li v-for="(ball, index) in prevLottery.balls" :class="['ballbg' + index, 'boder_bg_pulic']">{{ ball }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { datatype, addZero, kdTimestamp, formatSeconds } from '../common/basic';
    import * as ajax from '../api';
    import * as Lottery from '../common/Lottery';
    import gameBasic from '../mixins/gameBasic';

    export default {
        name: 'GameHead',
        mixins: [gameBasic],
        data(){
            return {
                countdown: '加载中...',
                countdownTimer: null,

                dataIsUpdated: 0,
                fetchOpenResultTimer: null
            };
        },
        computed: {
            // state
            systemTime(){
                return this.$store.state.time;
            },
            closeTime(){
                return this.currentGame.closeTime;
            },
            gameName(){
                return this.currentGame.name;
            },
            prevLottery(){
                return this.currentGame.prevLottery;
            },
            currentLottery(){
                return this.currentGame.currentLottery;
            },
            futureLotteries(){
                return this.currentGame.futureLotteries;
            },

            // computed
            prevLotteryNumberIsRight(){
                let prev, curr, prevDate, currDate;
                if(!!this.prevLottery.number === false
                    || !!this.currentLottery.number === false){
                    return false;
                }
                prevDate = parseInt(this.prevLottery.number.substr(0, 8), 10);
                currDate = parseInt(this.currentLottery.number.substr(0, 8), 10);
                if(isNaN(prevDate) || isNaN(currDate)) return false;

                prev = parseInt(this.prevLottery.number.substr(8), 10);
                curr = parseInt(this.currentLottery.number.substr(8), 10);
                if(isNaN(prev) || isNaN(curr)) return false;

                if((currDate > prevDate && curr === 2) || (currDate === prevDate && curr - prev > 1)){
                    return currDate + '' + addZero(curr - 1, 2);
                }else{
                    return true;
                }
            }
        },
        watch: {
            prevLottery: {
                handler: function(){
                    // 进行期号校正
                    this.corectPrevLotteryIssue();

                    // 当触发了prevLottery更新的时候，开始轮询获取开奖数据
                    this.startFetchOpenResultTimer();
                },
                deep: true
            },
            futureLotteries(list){
                if(list.length === 0){
                    // console.log('未来n期数据没有了，该获取了！');
                    this.fetchFutureLotteries();
                }else{
                    // 暂时还有n期数据可用！
                    // console.log('暂时还有' + this.futureLotteries.length + '期数据可用！');
                }
            }
        },
        created(){
            this.startCountdown();
        },
        beforeDestroy(){
            clearTimeout(this.countdownTimer);
            clearTimeout(this.fetchOpenResultTimer);
        },
        methods: {
            // mutations
            setGame(gameId, payload){
                this.$store.commit('ga' + gameId + 'SetGame', payload);
            },
            setPrevLottery(gameId, payload){
                this.$store.commit('ga' + gameId + 'SetPrevLottery', payload);
            },
            setCurrentLottery(gameId, payload){
                this.$store.commit('ga' + gameId + 'SetCurrentLottery', payload);
            },

            // actions

            // methods
            fetchFutureLotteries(){
                let gameId = this.currentGame.id;
                return ajax.apiFetchFutureLotteries({
                    gameId: gameId
                }).then(json => {
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                    }else{
                        let list = [];
                        json.forEach(item => {
                            list.push({
                                number: item.Numbers,
                                time: item.Open_Time,
                                beginTime: item.Begin_Date,
                                endTime: item.End_Date
                            });
                        });
                        this.setGame(gameId, {
                            futureLotteries: list
                        });
                    }
                });
            },
            fetchPrevLotteryOpenedResult(){
                let gameId = this.currentGame.id;
                return ajax.apiFetchGameStateInfo({
                    gameId: gameId
                }, 'noloading').then(json => {
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                        return;
                    }

                    return {
                        number: json[0].OPEN_RESULTS.N,
                        balls: json[0].OPEN_RESULTS.R.split(',')
                    };
                });
            },
            startCountdown(){
                let vm = this, dur, time,
                    gameId = this.currentGame.id;
                this.countdownTimer = setTimeout(function(){
                    if(vm.currentLottery.time !== ''){
                        dur = kdTimestamp(vm.currentLottery.time, true) - kdTimestamp(vm.systemTime, true);
                        if(dur > vm.closeTime){
                            // 距封盘
                            time = dur - vm.closeTime;
                            vm.countdown = formatSeconds(time < 0 ? 0 : time);
                        }else{
                            // 距下期
                            time = dur;
                            vm.countdown = formatSeconds(time < 0 ? 0 : time);

                            if(vm.currentLottery.status){
                                vm.setCurrentLottery(gameId, {
                                    status: 0
                                });
                            }

                            if(dur <= 0){
                                // 结束封盘， 开始下期
                                vm.setPrevLottery(gameId, {
                                    number: vm.currentLottery.number,
                                    balls: '正在开奖中'.split(''),
                                    status: 0
                                });
                                vm.setCurrentLottery(gameId, {
                                    shift: true
                                });
                            }
                        }
                    }else{
                        // console.log("currentLottery.time is null");
                    }

                    vm.startCountdown();
                }, 1000);
            },
            corectPrevLotteryIssue(){
                if(datatype(this.prevLotteryNumberIsRight) !== 'boolean'){
                    this.setPrevLottery(this.currentGame.id, {
                        number: this.prevLotteryNumberIsRight,
                        balls: '正在开奖中'.split(''),
                        status: 0
                    });
                }
            },
            startFetchOpenResultTimer(){
                let vm = this;

                this.fetchOpenResultTimer = setTimeout(function(){
                    if(vm.prevLottery.status === 1){
                        clearTimeout(vm.fetchOpenResultTimer);
                        return;
                    }

                    vm.fetchPrevLotteryOpenedResult().then(lottery => {
                        if(lottery.number.toString() === vm.prevLottery.number.toString()){
                            vm.setPrevLottery(vm.currentGame.id, {
                                balls: lottery.balls,
                                status: 1
                            });
                        }
                    });

                    vm.startFetchOpenResultTimer();
                }, 1000 * 2);
            }
        }
    };
</script>
