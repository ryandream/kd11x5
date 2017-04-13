<template>
    <div class="qid"><!--This is same as HomeLotteryBox-->
        <div class="tag_copy">
            <img class="big_lottery_pulic" :class="'big_lottery_' + game.id">
            <ul class="ticketball_tabbuy_2I6-U">
                <template v-for="(ball, index) in prevLottery.balls">
                    <li class="boder_bg_pulic" :class="'ballbg' + index">{{ ball }}</li>
                    <li class="ballbgadd">{{ index < prevLottery.balls.length - 1 ? '+' : '=' }}</li>
                </template>
                <li class="ballbgadd">{{ prevLotteryAndValue.andValue }}</li>
            </ul>
            <router-link :to="'/game/' + game.id" class="bg_red">立即投注</router-link>
        </div>
        <div class="tag_down">
            <span>当前期：第 <i class="c_red">{{ prevLottery.number }}</i> 期</span>
            <span>开奖号码：<i class="c_red">{{ prevLottery.balls.join(',') }}</i></span>
            <span>和值：<i class="c_red">{{ prevLotteryAndValue.andValue }}</i></span>
            <span>形态：<em :class="prevLotteryAndValue.largeOrSmall.class">{{ prevLotteryAndValue.largeOrSmall.name }}</em><em :class="prevLotteryAndValue.oddOrEven.class">{{ prevLotteryAndValue.oddOrEven.name }}</em></span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'HomeLotteryTabPanel',
        props: ['game'],
        computed: {
            // state
            prevLottery(){
                return this.$store.state['ga' + this.game.id].prevLottery;
            },

            // getters
            prevLotteryAndValue(){
                return this.$store.getters['ga' + this.game.id + 'PrevLotteryAndValue'];
            }
        }
    };
</script>
