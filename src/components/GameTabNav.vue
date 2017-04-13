<template>
    <div class="quickBar_style"><template v-for="(game, id, index) in gameList"><router-link :to="'/game/' + game.id" class="ant-btn"><span>{{ game.name }}</span></router-link><router-link :to="'/buy-together/' + game.id" v-if="index === 3" class="ant-btn mid_style"><span>参与合买</span></router-link></template></div>
</template>

<script>
    import gameBasic from '../mixins/gameBasic';

    export default {
        name: 'GameTabNav',
        mixins: [gameBasic]
    };
</script>
