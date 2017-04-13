<template>
    <div class="downTab_tabbuy">
        <div class="tab" :class="'index-' + currentIndex">
            <a v-for="(game, index) in randomGameList" href="javascript:;" :class="{on: currentGameId === game.id}" @click="activeTab(game.id, index)">{{ game.name }}<span class="ant-tabs-ink-bar"></span></a>
        </div>
        <div class="content" :class="'index-' + currentIndex">
            <div class="qie_huan">
                <mod-home-lottery-tab-panel v-for="(game, index) in randomGameList" :game="game" :key="'lottery-tab-panel-' + index"></mod-home-lottery-tab-panel>
            </div>
        </div>
    </div>
</template>

<script>
    import { random } from '../common/basic';
    import gameBasic from '../mixins/gameBasic';
    import HomeLotteryTabPanel from './HomeLotteryTabPanel';

    export default {
        name: 'HomeLotteryTab',
        mixins: [gameBasic],
        data(){
            return {
                currentIndex: 0,
                currentGameId: '',

                randomGameList: [],

                ids: []
            };
        },
        created(){
            let i = 0, len = 3,
                list = [],
                indexes = [];
            indexes = this.generateRandomGameId(len);
            for(; i < indexes.length; i++){
                list.push(this.gameList[indexes[i]]);
            }
            this.randomGameList = list;
            this.currentGameId = indexes[0];
        },
        methods: {
            // mutations

            // actions

            // methods
            activeTab(gameId, index){
                this.currentIndex = index;
                this.currentGameId = gameId;
            },
            generateRandomGameId(len, ids){
                let index;
                ids = ids || [];
                if(ids.length >= len){
                    this.ids = ids;
                    return ids;
                }

                index = random(0, this.gameIndexes.length);
                if(ids.indexOf(this.gameIndexes[index]) === -1){
                    ids.push(this.gameIndexes[index]);
                }
                return this.generateRandomGameId(len, ids);
            }
        },
        components: {
            modHomeLotteryTabPanel: HomeLotteryTabPanel
        }
    };
</script>
