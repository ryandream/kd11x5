<template>
    <div class="box_TicketBar">
        <div class="row_Ticket11">
            <ul class="ticket-lister">
                <li class="ticket_Ticket_n" v-for="item, index in cartList.list">
                    <dl>
                        <dd class="number_Ticket">
                            <span class="ball_Resolution">注单内容 : {{ item.content }}</span>
                        </dd>
                        <dt>
                            <span class="method_Ticket" :title="item.categoryName">[{{ item.categoryName }}]</span>
                            <span class="prize_Ticket">共<span class="red">{{ item.number }}</span>注</span>
                            <span class="multiple_Ticket">
                                <input class="input_NumberInput" v-model.number.trim="unitPrices[index]"> 元
                            </span>
                            <span class="money_Ticket">共 <span class="red">{{ item.amount }}</span> 元</span>
                            <span class="last_Ticket" @click="deleteItemOfCart(index)"><span class="red">x</span></span>
                        </dt>
                    </dl>
                </li>
            </ul>
            <div class="tiket-quick-maker" @click="clearCart"><div>清空列表</div></div>
        </div>
        <div class="row_tonhji">
            <div class="bill-bar_BillBar">
                <span>共<span class="red">{{ cartList.totalNumber }}</span>注</span>
                <span>共<span class="red">{{ cartList.totalAmount }}</span>元</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { copyObject } from '../common/basic';
    import gameBasic from '../mixins/gameBasic';

    export default {
        name: 'GameBettingCartList',
        mixins: [gameBasic],
        computed: {
            // state
            categories(){
                return this.currentGame.categories;
            },
            products(){
                return this.currentGame.products;
            },
            cart(){
                return this.currentGame.cart;
            },
            unitPrices(){
                return this.currentGame.unitPrices;
            },

            // computed
            cartList(){
                let list = [], totalNumber = 0, totalAmount = 0, categoryId, productId, index, content, number, unitPrice, amount;
                this.currentGame.cart.forEach((item, index) => {
                    content = '';
                    number = 0;
                    unitPrice = 0;
                    amount = 0;
                    item.forEach((subItem, subIndex) => {
                        content += (subIndex > 0 ? ', ' : '') + subItem.name;
                        unitPrice = subItem.amount;
                        amount += subItem.amount * subItem.number;
                        number += subItem.number;
                        categoryId = subItem.categoryId;
                        productId = subItem.productId;
                    });
                    totalAmount += amount;
                    totalNumber += number;
                    list.push({
                        categoryId: categoryId,
                        categoryName: this.categories[categoryId].name + (categoryId !== this.currentGame.id + '-t1' ? '-' + this.products[categoryId][productId].name : ''),
                        content: content,
                        amount: amount,
                        number: number,
                        unitPrice: unitPrice
                    });
                });
                return {
                    list,
                    totalNumber,
                    totalAmount
                };
            }
        },
        watch: {
            unitPrices: {
                handler: function(prices, oldPrices){
                    if(prices.length !== oldPrices.length){ // 添加或者删除
                        // console.log('change length');
                    }else{ // 更改
                        // console.log('change price');
                        this.updatePrices();
                    }
                },
                deep: true
            }
        },
        methods: {
            // mutations
            setCart(gameId, payload){
                this.$store.commit('ga' + gameId + 'SetCart', payload);
            },

            // actions

            // methods
            deleteItemOfCart(index){
                let cart = copyObject(this.cart);
                cart.splice(index, 1);

                this.setCart(this.currentGame.id, cart);
            },
            clearCart(){
                this.setCart(this.currentGame.id, []);
            },
            updatePrices(){
                let cart = copyObject(this.currentGame.cart);
                cart.forEach((item, index) => {
                    item.forEach((subItem, subIndex) => {
                        cart[index][subIndex].amount = this.unitPrices[index];
                    });
                });
                this.setCart(this.currentGame.id, cart);
            }
        }
    };
</script>
