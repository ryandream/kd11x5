<template>
    <li class="lottery-box"><!--This is same as HomeLotteryTabPanel-->
        <dl>
            <dt><div class="sywicon_ticketlist" :class="'big_lottery_' + game.id"></div></dt>
            <dd>
                <h4>{{ game.name }}</h4>
                <p>{{ game.advantage }}</p>
            </dd>
        </dl>
        <div class="det_ticketlist">
            <p>当前期：第 <i class="c_red">{{ prevLottery.number }}</i></p>
            <p>开奖号码：<i class="c_red">{{ prevLottery.balls.join(',') }}</i></p>
            <p><span>和值：{{ prevLotteryAndValue.andValue }}</span> <span>形态：
                <em :class="prevLotteryAndValue.largeOrSmall.class">{{ prevLotteryAndValue.largeOrSmall.name }}</em>
                <em :class="prevLotteryAndValue.oddOrEven.class">{{ prevLotteryAndValue.oddOrEven.name }}</em>
            </span></p>
            <div>
                <router-link :to="'/game/' + game.id" class="bg_red">立即投注</router-link>
                <router-link :to="'/history/' + game.id" data-type="sywln" class="bg_org">历史开奖</router-link>
            </div>
        </div>
    </li>
</template>

<script>
    import gameBasic from '../mixins/gameBasic';
    import HomeLotteryBox from '../components/HomeLotteryBox';

    export default {
        name: 'HomeLotteryBox',
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
