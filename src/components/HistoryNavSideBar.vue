<template>
    <div class="contentleft_openprize">
        <div class="opentitle_openprize">分类查看</div>
        <p><a href="javascript:void(0);" @click="setViewByDigit"><span></span><span>数字</span></a></p>
        <div class="menu_body fn-hide">
        </div>
        <p><a href="javascript:void(0);" @click="toggleDropdown"><span class="icod"></span><span>高频</span></a></p>
        <div class="menu_body" v-show="isOpenedSubMenu">
            <ul>
                <li v-for="game in gameList"><router-link :to="'/history/' + game.id">{{ game.name }}</router-link></li>
            </ul>
        </div>
    </div>
</template>

<script>
    import gameBasic from '../mixins/gameBasic';

    export default {
        name: 'HistoryNavSideBar',
        mixins: [gameBasic],
        data(){
            return {
                isOpenedSubMenu: false
            };
        },
        methods: {
            toggleDropdown(){
                this.isOpenedSubMenu = !this.isOpenedSubMenu;
                this.$emit('input', false);
            },
            setViewByDigit(){
                this.isOpenedSubMenu = false;
                this.$emit('input', true);
            }
        }
    };
</script>
