<template>
    <div class="ball-picker">
        <div class="sywsum_SYWSum">
            <div class="row_SYWSum" :class="{'middle_SYWSum': index === 1}" v-for="group, index in groupedProducts">
                <div class="ball-items big_Ball" v-for="product in group">
                    <span class="normal_Ball" :class="{'selected_Ball': product.selected}" :data-id="product.id" @click="toggleToSelect(product.id)">{{ product.name }}</span>
                    <span>{{ product.odds }}</span>
                </div>
            </div>
        </div>
        <button type="button" class="ticket-maker" @click="confirmSelected">确认选号</button>
    </div>
</template>

<script>
    import { length, copyObject } from '../common/basic';
    import gameBasic from '../mixins/gameBasic';

    export default {
        name: 'GameBettingSelectBallsAndValue',
        mixins: [gameBasic],
        props: ['categoryId'],
        computed: {
            // state
            products(){
                return this.currentGame.products[this.categoryId];
            },
            cart(){
                return this.currentGame.cart;
            },

            // computed
            groupedProducts(){
                let groups = [], subGroup = [], specialGroup = [], key, count = 0,
                    products = this.currentGame.products[this.categoryId],
                    len = length(products);
                for(key in products){
                    if(!products.hasOwnProperty(key)) continue;
                    if(products[key].name === '30' || /[^\d]/.test(products[key].name)){
                        specialGroup.push(products[key]);
                    }else{
                        count++;
                        subGroup.push(products[key]);
                        if(count % 15 === 0 || count === len){
                            groups.push(subGroup);
                            subGroup = [];
                        }
                    }
                }
                groups.splice(1, 0, specialGroup);
                return groups;
            }
        },
        methods: {
            // mutations
            setGame(gameId, payload){
                this.$store.commit('ga' + gameId + 'SetGame', payload);
            },
            setProducts(gameId, payload){
                this.$store.commit('ga' + gameId + 'SetProducts', payload);
            },
            setCart(gameId, payload){
                this.$store.commit('ga' + gameId + 'SetCart', payload);
            },

            // actions

            // methods
            switchProduct(productId, selected){
                this.setProducts(this.currentGame.id, {
                    categoryId: this.categoryId,
                    productId: productId,
                    value: {
                        selected: selected
                    }
                });
            },
            toggleToSelect(productId){
                let product = this.products[productId];
                if(typeof product === 'undefined') return;
                if(!product.enableBet) return;

                if(product.selected === true){
                    this.switchProduct(productId, false);
                }else{
                    this.switchProduct(productId, true);
                }
            },
            confirmSelected(){
                let cart = copyObject(this.cart),
                    currentList = [],
                    productId, product, length = 0;
                
                for(productId in this.products){
                    if(!this.products.hasOwnProperty(productId)) continue;
                    product = this.products[productId];

                    if(product.selected === false) continue;
                    length++;
                    currentList.push({
                        categoryId: this.categoryId,
                        productId: productId,
                        amount: this.products[productId].min,
                        name: product.name,
                        value: product.value,
                        number: 1,
                        odds: product.odds
                    });
                    this.switchProduct(productId, false);
                }
                if(length > 0){
                    cart.unshift(currentList);
                    this.setCart(this.currentGame.id, cart);
                    this.initUnitPrices(cart);
                }else{
                    this.$error({
                        content: "还有未选号码"
                    });
                }
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
        }
    };
</script>
