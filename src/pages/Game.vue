<template>
    <main class="kd-body wrpper mt10">
        <mod-game-head></mod-game-head>
        <mod-game-tab-nav></mod-game-tab-nav>
        <div class="lottery_playContainer">
            <mod-game-betting :lotteryResultNotice="lotteryResultNotice"></mod-game-betting>
            <mod-game-lottery-result-notice v-model="lotteryResultNotice"></mod-game-lottery-result-notice>
        </div>
    </main>
</template>

<script>
    import * as ajax from '../api';
    import ProductBasicInfo from '../common/ProductBasicInfo';
    import gameBasic from '../mixins/gameBasic';

    import GameHead from '../components/GameHead';
    import GameTabNav from '../components/GameTabNav';
    import GameBetting from '../components/GameBetting';
    import GameLotteryResultNotice from '../components/GameLotteryResultNotice';

    //

    export default {
        name: 'PageGame',
        mixins: [gameBasic],
        data(){
            return {
                lotteryResultNotice: []
            };
        },
        computed: {
            // state
            categories(){
                return this.currentGame.categories;
            }
        },
        watch: {
            '$route'(to, from){
                this.init();
            }
        },
        created(){
            this.init();
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
            setCategories(gameId, payload){
                this.$store.commit('ga' + gameId + 'SetCategories', payload);
            },
            setProducts(gameId, payload){
                this.$store.commit('ga' + gameId + 'SetProducts', payload);
            },

            // actions

            // methods
            init(){
                this.fetchGameStateInfo();
                this.fetchGameInfo().then(() => {
                    this.fetchAllOdds();
                });
                this.fetchFutureLotteries().then(() => {
                    this.setCurrentLottery(this.currentGame.id, {
                        shift: true
                    });
                });
            },
            fetchGameStateInfo(){
                let gameId = this.currentGame.id;
                return ajax.apiFetchGameStateInfo({
                    gameId: gameId
                }).then(json => {
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                        return;
                    }
                    json.forEach(data => {
                        this.setPrevLottery(gameId, {
                            number: data.OPEN_RESULTS.N,
                            balls: data.OPEN_RESULTS.R.split(',')
                        });
                    });
                });
            },
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
                                time: item.Open_Time
                            });
                        });
                        this.setGame(gameId, {
                            futureLotteries: list
                        });
                    }
                });
            },
            fetchGameInfo(){
                let gameId = this.currentGame.id;
                return ajax.apiFetchGameInfo({
                    gameId: gameId
                }).then(json => {
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                    }else{
                        let categories = {}, products = {}, isAndValue = false, productBasicInfo, subProductBasicInfo;
                        json.items.forEach(item => {
                            isAndValue = item.no === gameId + '-t1';
                            categories[item.no] = {
                                id: item.no,
                                name: item.name,
                                max: item.max,
                            };
                            productBasicInfo = ProductBasicInfo[item.no.replace(gameId + '-', '')];
                            if(isAndValue){
                                categories[item.no].tip = productBasicInfo.tip;
                            }
                            // generate products data
                            products[item.no] = {};
                            item.items.forEach((subItem, index) => {
                                let val = parseInt(subItem.value, 10);
                                products[item.no][subItem.no] = {
                                    id: subItem.no, // 玩法编码
                                    name: subItem.name, // 名称
                                    value: val, // 玩法值
                                    specialValue: val, // 特殊赔率玩法值
                                    odds: 0, // 标准赔率
                                    specialOdds: 0, // 特殊赔率、
                                    enableBet: 1, // 是否允许投注
                                    min: 0, // 最低下注
                                    max: 0, // 最高下注
                                    selected: false
                                };
                                if(!isAndValue){
                                    subProductBasicInfo = productBasicInfo[subItem.no.replace(gameId, 'id')];
                                    products[item.no][subItem.no].tip = subProductBasicInfo.tip;
                                    products[item.no][subItem.no].ballsPicker = {
                                        type: subProductBasicInfo.type,
                                        titles: subProductBasicInfo.titles,
                                        max: subProductBasicInfo.max, // only for 胆拖
                                        mins: subProductBasicInfo.mins,
                                        totalMin: subProductBasicInfo.totalMin
                                    };
                                }
                            });
                        });
                        this.setCategories(gameId, {
                            categories: categories
                        });
                        this.setProducts(gameId, {
                            value: products
                        });
                    }
                });
            },
            fetchOdds(categoryId, noloading){
                let gameId = this.currentGame.id;
                return ajax.apiFetchGameOdds({
                    gameId: gameId,
                    categoryId: categoryId
                }, noloading).then(json => {
                    if(typeof json.S !== 'undefined'){
                        // console.log(json);
                        return;
                    }
                    json.forEach(item => {
                        this.setProducts(gameId, {
                            categoryId: categoryId,
                            productId: item.N,
                            value: {
                                value: item.P, // 玩法值
                                specialValue: item.PP, // 特殊赔率玩法值
                                odds: item.O, // 标准赔率
                                specialOdds: item.OP, // 特殊赔率、
                                enableBet: item.E, // 是否允许投注
                                min: item.I, // 最低下注
                                max: item.A // 最高下注
                            }
                        });
                    });
                });
            },
            fetchAllOdds(noloading){
                for(let categoryId in this.categories){
                    if(!this.categories.hasOwnProperty(categoryId)) continue;

                    this.fetchOdds(categoryId, noloading);
                }
            }
        },
        components: {
            modGameHead: GameHead,
            modGameTabNav: GameTabNav,
            modGameBetting: GameBetting,
            modGameLotteryResultNotice: GameLotteryResultNotice
        }
    };
</script>
