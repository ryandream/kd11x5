<template>
    <div class="ball-lottery">
        <div class="playMethod">
            <ul class="mainPlayMethod">
                <li v-for="category, categoryId in categories" :class="{cur: currentCategoryId === categoryId}" :data-id="categoryId" @click="selectCategory(categoryId)">{{ category.name }}</li>
            </ul>
            <div class="subPlayMethod">
                <div v-if="isCurrentCategoryAndValue">
                    <input type="radio" id="subPlayMethod0" v-model="currentProductId" value=""><label for="subPlayMethod0">和值</label>
                </div>
                <div v-else v-for="product in products[currentCategoryId]">
                    <input type="radio" :id="'subPlayMethod' + product.id" v-model="currentProductId" :value="product.id"><label :for="'subPlayMethod' + product.id">{{ product.name }}</label>
                </div>
            </div>
            <p class="notice_PlayMethond">{{ productDescription }}</p>
            <p class="notice_PlayMethond" v-if="currentProductOdds">该玩法赔率为： {{ currentProductOdds }}</p>
        </div>
        <mod-game-betting-select-balls-and-value v-if="isCurrentCategoryAndValue" :categoryId="currentCategoryId"></mod-game-betting-select-balls-and-value>
        <mod-game-betting-select-balls v-else :categoryId="currentCategoryId" :productId="currentProductId"></mod-game-betting-select-balls>
        <mod-game-betting-cart-list :categoryId="currentCategoryId" :productId="currentProductId"></mod-game-betting-cart-list>
        <mod-game-betting-type v-model="bettingType" ref="bettingType"></mod-game-betting-type>
        <button type="button" class="submit_Submit" @click="doBet">{{ currentLottery.status ? '立即投注' : '封 盘 中' }}</button>
        <mod-game-betting-description :lotteryResultNotice="lotteryResultNotice"></mod-game-betting-description>
    </div>
</template>

<script>
    import * as ajax from '../api';
    import gameBasic from '../mixins/gameBasic';
    import GameBettingSelectBallsAndValue from './GameBettingSelectBallsAndValue';
    import GameBettingSelectBalls from './GameBettingSelectBalls';
    import GameBettingCartList from './GameBettingCartList';
    import GameBettingType from './GameBettingType';
    import GameBettingDescription from './GameBettingDescription';

    export default {
        name: 'GameBetting',
        mixins: [gameBasic],
        props: ['lotteryResultNotice'],
        data(){
            return {
                currentCategoryId: '',
                currentProductId: '',

                bettingType: {} // 0自购，1合买，2追号
            };
        },
        computed: {
            // state
            currentLottery(){
                return this.currentGame.currentLottery;
            },
            categories(){
                return this.currentGame.categories;
            },
            products(){
                return this.currentGame.products;
            },
            cart(){
                return this.currentGame.cart;
            },

            // getters

            // computed
            isCurrentCategoryAndValue(){
                return (this.currentGame.id + '-t1') === this.currentCategoryId;
            },
            productDescription(){
                if(typeof this.categories[this.currentCategoryId] === 'undefined'
                    || typeof this.products[this.currentCategoryId] === 'undefined') return '';

                if(this.currentGame.id + '-t1' === this.currentCategoryId){
                    let minOdds = 0, maxOdds = 0, pid, productOdds;
                    for(pid in this.products[this.currentCategoryId]){
                        if(!this.products[this.currentCategoryId].hasOwnProperty(pid)) continue;
                        productOdds = this.products[this.currentCategoryId][pid].odds;

                        minOdds = minOdds === 0 ? productOdds : Math.min(productOdds, minOdds);
                        maxOdds = maxOdds === 0 ? productOdds : Math.max(productOdds, maxOdds);
                    }
                    return this.categories[this.currentCategoryId].tip.replace('{{min}}', minOdds).replace('{{max}}', maxOdds);
                }else{
                    return this.products[this.currentCategoryId][this.currentProductId].tip;
                }
            },
            currentProductOdds(){
                if(typeof this.products[this.currentCategoryId] === 'undefined'
                    || typeof this.products[this.currentCategoryId][this.currentProductId] === 'undefined') return 0;
                
                return this.products[this.currentCategoryId][this.currentProductId].odds;
            }
        },
        created(){
            this.selectCategory(this.currentGame.id + '-t1');
        },
        watch: {
            '$route'(to, from){
                this.selectCategory(this.currentGame.id + '-t1');
            }
        },
        methods: {
            // mutations
            setCart(gameId, payload){
                this.$store.commit('ga' + gameId + 'SetCart', payload);
            },

            // actions

            // methods
            selectCategory(categoryId){
                this.currentCategoryId = categoryId;
                if(this.isCurrentCategoryAndValue){
                    this.currentProductId = '';
                }else{
                    this.currentProductId = this.firstPropOfObject(this.products[categoryId]).id;
                }
            },
            firstPropOfObject(obj){
                let key;
                for(key in obj){
                    if(!obj.hasOwnProperty(key)) continue;

                    return obj[key];
                }
            },
            clearCart(){
                this.setCart(this.currentGame.id, []);
            },
            doBet(){
                if(this.currentLottery.status === 0) return;
                let bettingDataList = this.generateBetDatas();
                if(bettingDataList.length === 0){
                    this.$alert({
                        type: "error",
                        title: "错误",
                        content: "没有投注内容！"
                    });
                    return;
                }
                if(this.$refs.bettingType && !this.$refs.bettingType.validate()) return;
                
                let togetherBuyData = this.generateTogetherBuyData();
                return ajax.apiDoBet({
                    gameId: this.currentGame.id,
                    bettingData: bettingDataList,
                    number: this.currentLottery.number,
                    numbers: this.bettingType.type === 2 ? this.bettingType.value.join(';') : '',
                    togetherBuyData: togetherBuyData
                }).then(json => {
                    if(json.S === 200){
                        this.$alert({
                            type: "success",
                            title: "成功！",
                            content: json.S + ': ' + json.D
                        });
                        this.clearCart();
                        let refs = this.$refs;
                        if(refs.bettingType){
                            refs.bettingType.resetTogetherBuyPlanDescription();
                            refs.bettingType.numbersLength = 5;
                        }
                    }else{
                        this.$alert({
                            type: "error",
                            title: '提示',
                            content: json.S + ': ' + json.D
                        });
                    }
                });
            },
            generateBetDatas(){
                let bettingDataList = [];
                this.cart.forEach((item, index) => {
                    item.forEach((subItem, subIndex) => {
                        bettingDataList.push({
                            playno: subItem.productId,
                            amount: subItem.amount,
                            content: subItem.value,
                            number: subItem.number,
                            odds: subItem.odds
                        });
                    });
                });
                return bettingDataList;
            },
            generateTogetherBuyData(){
                let result = {},
                    type = this.bettingType.type,
                    data = this.bettingType.value;
                return type === 1 ? {
                    divNum: data.totalCount,
                    buyNum: data.selfCount,
                    remainNum: data.keepCount,
                    publicType: data.publicType,
                    planTitle: data.title,
                    planDesc: data.info
                } : {};
            }
        },
        components: {
            modGameBettingSelectBallsAndValue: GameBettingSelectBallsAndValue,
            modGameBettingSelectBalls: GameBettingSelectBalls,
            modGameBettingCartList: GameBettingCartList,
            modGameBettingType: GameBettingType,
            modGameBettingDescription: GameBettingDescription
        }
    };
</script>
