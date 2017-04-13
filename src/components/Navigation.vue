<template>
    <nav class="nav_banner">
        <div class="w1000">
            <ul class="ant-menu-horizontal">
                <li class="ant-menu-submenu-horizontal" @mouseenter="openCategories" @mouseleave="closeCategories">
                    <div class="ant-menu-submenu-title">
                        <span>全部彩票类型</span>
                    </div>
                    <div class="all_sort" id="leixing" v-show="isHomePage || isCategoriesShowed">
                        <ul class="index_sub">
                            <li class="con_index" v-for="game in gameList">
                                <router-link class="ticket_list" :to="'/game/' + game.id">
                                    <img class="sywicon_navbanner" :class="'navbanner_' + game.id">
                                    <i>{{ game.name }}</i>
                                    <em>{{ game.advantage }}</em>
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </li>
                <li class="ant-menu-item">
                    <router-link to="/">首页</router-link>
                </li>
                <li class="ant-menu-item">
                    <router-link :to="'/buy-together/' + (currentGame === null ? 'sd' : currentGame.id)">合买大厅</router-link>
                </li>
                <li class="ant-menu-item">
                    <router-link :to="'/history/' + (currentGame === null ? 'sd' : currentGame.id)">历史开奖</router-link>
                </li>
                <li class="ant-menu-item">
                    <router-link to="/activities">优惠活动</router-link>
                </li>
                <li class="ant-menu-item">
                    <router-link to="/cooperation">代理合作</router-link>
                </li>
                <li class="ant-menu-item">
                    <router-link to="/on-phone-buy">手机购彩</router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
    import gameBasic from '../mixins/gameBasic';

    export default {
        name: 'Navigation',
        mixins: [gameBasic],
        data(){
            return {
                isCategoriesShowed: false
            };
        },
        computed: {
            // state

            // getters

            // computed
            isHomePage: {
                get(){
                    return this.$route.path === '/';
                },
                set(val){
                    this.isHomePage = val;
                }
            }
        },
        watch: {
            '$route'(to, from){
                if(to.name !== 'HomePage'){
                    this.isCategoriesShowed = false;
                }
            }
        },
        methods: {
            openCategories(){
                this.isCategoriesShowed = true;
            },
            closeCategories(){
                this.isCategoriesShowed = false;
            }
        }
    };
</script>
