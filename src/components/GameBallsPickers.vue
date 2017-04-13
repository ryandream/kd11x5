<template>
    <div class="ball-picker-list">
        <!-- // 万位 + 千位 + 百位 + 十位 + 个位 : hasTool : 重复 -->
        <template v-if="ballsPicker.type === 'type1'">
            <mod-game-balls-picker v-model="pos00" :title="ballsPicker.titles[0]" :key="ballsPicker.type + 0 + updated" ref="ballsPicker00" refName="ballsPicker00" :repeat="ballsPicker.repeat" :hasTool="ballsPicker.hasTool"></mod-game-balls-picker>
            <mod-game-balls-picker v-model="pos01" :title="ballsPicker.titles[1]" :key="ballsPicker.type + 1 + updated" ref="ballsPicker01" refName="ballsPicker01" :repeat="ballsPicker.repeat" :hasTool="ballsPicker.hasTool"></mod-game-balls-picker>
            <mod-game-balls-picker v-model="pos02" :title="ballsPicker.titles[2]" :key="ballsPicker.type + 2 + updated" ref="ballsPicker02" refName="ballsPicker02" :repeat="ballsPicker.repeat" :hasTool="ballsPicker.hasTool"></mod-game-balls-picker>
            <mod-game-balls-picker v-model="pos03" :title="ballsPicker.titles[3]" :key="ballsPicker.type + 3 + updated" ref="ballsPicker03" refName="ballsPicker03" :repeat="ballsPicker.repeat" :hasTool="ballsPicker.hasTool"></mod-game-balls-picker>
            <mod-game-balls-picker v-model="pos04" :title="ballsPicker.titles[4]" :key="ballsPicker.type + 4 + updated" ref="ballsPicker04" refName="ballsPicker04" :repeat="ballsPicker.repeat" :hasTool="ballsPicker.hasTool"></mod-game-balls-picker>
        </template>
        <!-- // 万位 + 千位 + 百位 : hasTool : !重复 -->
        <!-- // 千位 + 百位 + 十位 : hasTool : !重复 -->
        <!-- // 百位 + 十位 + 个位 : hasTool : !重复 -->
        <template v-if="ballsPicker.type === 'type2'">
            <mod-game-balls-picker v-model="pos00" :title="ballsPicker.titles[0]" :key="ballsPicker.type + 0 + updated" ref="ballsPicker00" refName="ballsPicker00" :repeat="ballsPicker.repeat" :hasTool="ballsPicker.hasTool"></mod-game-balls-picker>
            <mod-game-balls-picker v-model="pos01" :title="ballsPicker.titles[1]" :key="ballsPicker.type + 1 + updated" ref="ballsPicker01" refName="ballsPicker01" :repeat="ballsPicker.repeat" :hasTool="ballsPicker.hasTool"></mod-game-balls-picker>
            <mod-game-balls-picker v-model="pos02" :title="ballsPicker.titles[2]" :key="ballsPicker.type + 2 + updated" ref="ballsPicker02" refName="ballsPicker02" :repeat="ballsPicker.repeat" :hasTool="ballsPicker.hasTool"></mod-game-balls-picker>
        </template>
        <!-- // 万位 + 千位 : hasTool : !重复 -->
        <!-- // 十位 + 个位 : hasTool : !重复 -->
        <template v-if="ballsPicker.type === 'type3'">
            <mod-game-balls-picker v-model="pos00" :title="ballsPicker.titles[0]" :key="ballsPicker.type + 0 + updated" ref="ballsPicker00" refName="ballsPicker00" :repeat="ballsPicker.repeat" :hasTool="ballsPicker.hasTool"></mod-game-balls-picker>
            <mod-game-balls-picker v-model="pos01" :title="ballsPicker.titles[1]" :key="ballsPicker.type + 1 + updated" ref="ballsPicker01" refName="ballsPicker01" :repeat="ballsPicker.repeat" :hasTool="ballsPicker.hasTool"></mod-game-balls-picker>
        </template>
        <!-- // 胆码 + 拖码 : !hasTool : !重复 -->
        <template v-if="ballsPicker.type === 'type4'">
            <mod-game-balls-picker v-model="pos00" :title="ballsPicker.titles[0]" :key="ballsPicker.type + 0 + updated" ref="ballsPicker00" refName="ballsPicker00" :repeat="ballsPicker.repeat" :hasTool="ballsPicker.hasTool" :max="ballsPicker.max"></mod-game-balls-picker>
            <mod-game-balls-picker v-model="pos01" :title="ballsPicker.titles[1]" :key="ballsPicker.type + 1 + updated" ref="ballsPicker01" refName="ballsPicker01" :repeat="ballsPicker.repeat" :hasTool="ballsPicker.hasTool"></mod-game-balls-picker>
        </template>
        <!-- // 组选 : hasTool : !重复 -->
        <template v-if="ballsPicker.type === 'type5'">
            <mod-game-balls-picker v-model="pos00" :title="ballsPicker.titles[0]" :key="ballsPicker.type + 0 + updated" ref="ballsPicker00" refName="ballsPicker00" :repeat="ballsPicker.repeat" :hasTool="ballsPicker.hasTool"></mod-game-balls-picker>
        </template>
    </div>
</template>

<script>
    import { length } from '../common/basic';
    import GameBallsPicker from './GameBallsPicker';

    export default {
        name: 'GameBallsPickers',
        props: ['ballsPicker'],
        data(){
            return {
                pos00: [],
                pos01: [],
                pos02: [],
                pos03: [],
                pos04: [],

                updated: 0
            };
        },
        computed: {
            selectedBalls(){
                let groups = [];
                for(let i = 0; i < this.ballsPicker.length; i++){
                    if(length(this['pos0' + i]) > 0){
                        groups.push(this['pos0' + i]);
                    }else{
                        groups.push([]);
                    }
                }
                return groups;
            }
        },
        watch: {
            ballsPicker(){
                this.pos00 = {};
                this.pos01 = {};
                this.pos02 = {};
                this.pos03 = {};
                this.pos04 = {};

                this.updated++;
            },
            selectedBalls(val){
                this.$emit('input', val);
            }
        },
        methods: {
            //
        },
        components: {
            modGameBallsPicker: GameBallsPicker
        }
    };
</script>
