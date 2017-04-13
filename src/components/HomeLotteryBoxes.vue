<template>
    <div class="mid_fl lottery-boxes-wrapper">
        <ul class="lottery-boxes-inner">
            <mod-home-lottery-box v-for="(game, id) in gameList" :game="game" :key="'lottery-box-' + id"></mod-home-lottery-box>
        </ul>
    </div>
</template>

<script>
    import gameBasic from '../mixins/gameBasic';
    import HomeLotteryBox from '../components/HomeLotteryBox';

    export default {
        name: 'HomeLotteryBoxes',
        mixins: [gameBasic],
        components: {
            modHomeLotteryBox: HomeLotteryBox
        }
    };
</script>
