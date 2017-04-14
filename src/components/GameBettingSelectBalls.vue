<template>
    <div class="ball-picker">
        <mod-game-balls-pickers v-model="selectedBalls" :ballsPicker="ballsPicker" :key="'ballsPickers' + updated"></mod-game-balls-pickers>
        <button type="button" class="ticket-maker" @click="confirmSelected">确认选号</button>
    </div>
</template>

<script>
    import { length, copyObject, datatype, C, addZero } from '../common/basic';
    import gameBasic from '../mixins/gameBasic';
    import GameBallsPickers from './GameBallsPickers';

    export default {
        name: 'GameBettingSelectBalls',
        mixins: [gameBasic],
        props: ['categoryId', 'productId'],
        data(){
            return {
                selectedBalls: [],

                updated: 0
            };
        },
        computed: {
            // state
            products(){
                if(length(this.currentGame.products) === 0) return false;
                return this.currentGame.products[this.categoryId] || false;
            },
            cart(){
                return this.currentGame.cart;
            },

            // computed
            ballsPicker(){
                let types, picker, result;
                /*
                * type1 // 万位 + 千位 + 百位 + 十位 + 个位 : hasTool : 重复
                * type2 // 万位 + 千位 + 百位 : hasTool : !重复
                * type2 // 千位 + 百位 + 十位 : hasTool : !重复
                * type2 // 百位 + 十位 + 个位 : hasTool : !重复
                * type3 // 万位 + 千位 : hasTool : !重复
                * type3 // 十位 + 个位 : hasTool : !重复
                * type4 // 胆码 + 拖码 : !hasTool : !重复
                * type5 // 组选 : hasTool : !重复
                */
                types = {
                    type1: {
                        length: 5,
                        hasTool: true,
                        repeat: true
                    },
                    type2: {
                        length: 3,
                        hasTool: true,
                        repeat: false
                    },
                    type3: {
                        length: 2,
                        hasTool: true,
                        repeat: false
                    },
                    type4: {
                        length: 2,
                        hasTool: false,
                        repeat: false
                    },
                    type5: {
                        length: 1,
                        hasTool: true,
                        repeat: false
                    }
                };
                if(!this.products) return false;
                picker = this.products[this.productId].ballsPicker;
                result = {
                    length: types['type' + picker.type].length,
                    type: 'type' + picker.type,
                    hasTool: types['type' + picker.type].hasTool,
                    repeat: types['type' + picker.type].repeat,
                    titles: picker.titles,
                    mins: picker.mins,
                    totalMin: picker.totalMin
                };
                if(typeof picker.max !== 'undefined'){
                    result.max = picker.max;
                }
                return result;
            }
        },
        methods: {
            // mutations
            setGame(gameId, payload){
                this.$store.commit('ga' + gameId + 'SetGame', payload);
            },
            setCart(gameId, payload){
                this.$store.commit('ga' + gameId + 'SetCart', payload);
            },

            // actions

            // methods
            validate(){
                var flag = true,
                    group, groupIndex,
                    mins = this.ballsPicker.mins,
                    totalMin = this.ballsPicker.totalMin,
                    totalLength = 0;
                if(this.selectedBalls.length === 0) return false;
                for(groupIndex = 0; groupIndex < this.selectedBalls.length; groupIndex++){
                    group = this.selectedBalls[groupIndex];
                    if(group.length < mins[groupIndex]){
                        flag = false;
                        break;
                    }
                    totalLength += group.length;
                }
                if(totalLength < totalMin){
                    flag = false;
                }

                return flag;
            },
            computedLengthOfSelectedLottery(){
                let length = 0, index = 0, type = this.ballsPicker.type,
                    selectedBallsLength = this.selectedBalls.length;

                if(type === 'type1'){
                    for(; index < selectedBallsLength; index++){
                        length += this.selectedBalls[index].length;
                    }
                }else if(type === 'type2' || type === 'type3'){
                    length = 1;
                    for(; index < selectedBallsLength; index++){
                        length *= this.selectedBalls[index].length;
                    }
                }else if(type === 'type4'){
                    length = this.selectedBalls[0].length;
                    length = C(this.selectedBalls[1].length, this.ballsPicker.totalMin - length);
                }else if(type === 'type5'){
                    length = C(this.selectedBalls[0].length, this.ballsPicker.totalMin);
                }else{
                    length = 0;
                }
                
                return length;
            },
            confirmSelected(){
                let cart = copyObject(this.cart),
                    currentList = [],
                    groupIndex, groupName = '', groupContent = '', group,
                    index, name = '', content = '',
                    length = 0;

                if(!this.validate()){
                    this.$error({
                        content: "还有未选号码"
                    });
                    return;
                }

                length = this.computedLengthOfSelectedLottery();
                
                for(groupIndex = 0; groupIndex < this.selectedBalls.length; groupIndex++){
                    group = this.selectedBalls[groupIndex];
                    groupName = '';
                    groupContent = '';
                    for(index = 0; index < group.length; index++){
                        groupName += (index === 0 ? '' : ', ') + /*addZero(*/group[index].value/*, 2)*/;
                        groupContent += (index === 0 ? '' : ',') + group[index].value;
                    }
                    name += (groupIndex === 0 ? '' : ' | ') + (groupName === '' ? ' - ' : groupName);
                    content += (groupIndex === 0 ? '' : '|') + (groupContent === '' ? '-' : groupContent);
                }

                currentList.push({
                    categoryId: this.categoryId,
                    productId: this.productId,
                    amount: this.products[this.productId].min,
                    name: name,
                    value: content,
                    number: length,
                    odds: this.products[this.productId].odds
                });

                cart.unshift(currentList);
                this.setCart(this.currentGame.id, cart);
                this.initUnitPrices(cart);

                this.selectedBalls = [];
                this.updated++;
            },
            initUnitPrices(cart){
                let prices = [];
                cart.forEach((item, index) => {
                    prices.push(item[0].amount);
                });
                this.setGame(this.currentGame.id, {
                    unitPrices: prices
                });
            }
        },
        components: {
            modGameBallsPickers: GameBallsPickers
        }
    };
</script>
