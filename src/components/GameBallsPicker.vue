<template>
    <ul class="colum_BallPickerColum">
        <li class="digit_DigitName"><div>{{ title }}</div></li>
        <li class="ball-region">
            <div class="ball-items" v-for="ball in balls">
                <span class="normal_Ball" :class="{'selected_Ball': ball.selected}" :data-id="ball.id" @click="toggleToSelect(ball.id)">{{ ball.name }}</span>
            </div>
        </li>
        <li class="quickPicker_BallQuickPicker" v-if="hasTool">
            <button type="button" @click="selectAll">全</button>
            <button type="button" @click="selectLarge">大</button>
            <button type="button" @click="selectSmall">小</button>
            <button type="button" @click="selectOdd">单</button>
            <button type="button" @click="selectEven">双</button>
            <button type="button" @click="clearAllSelected">清</button>
        </li>
    </ul>
</template>

<script>
    export default {
        name: 'GameBallsPicker',
        props: {
            title: {
                type: String,
                required: true
            },
            hasTool: {
                type: Boolean,
                default: true
            },
            refName: {
                type: String,
                required: true
            },
            repeat: {
                type: Boolean,
                default: true
            },
            max: [Number, Array]
        },
        data(){
            return {
                balls: {
                    b01: {
                        id: 'b01',
                        name: '1',
                        value: 1,
                        selected: false
                    },
                    b02: {
                        id: 'b02',
                        name: '2',
                        value: 2,
                        selected: false
                    },
                    b03: {
                        id: 'b03',
                        name: '3',
                        value: 3,
                        selected: false
                    },
                    b04: {
                        id: 'b04',
                        name: '4',
                        value: 4,
                        selected: false
                    },
                    b05: {
                        id: 'b05',
                        name: '5',
                        value: 5,
                        selected: false
                    },
                    b06: {
                        id: 'b06',
                        name: '6',
                        value: 6,
                        selected: false
                    },
                    b07: {
                        id: 'b07',
                        name: '7',
                        value: 7,
                        selected: false
                    },
                    b08: {
                        id: 'b08',
                        name: '8',
                        value: 8,
                        selected: false
                    },
                    b09: {
                        id: 'b09',
                        name: '9',
                        value: 9,
                        selected: false
                    },
                    b10: {
                        id: 'b10',
                        name: '10',
                        value: 10,
                        selected: false
                    },
                    b11: {
                        id: 'b11',
                        name: '11',
                        value: 11,
                        selected: false
                    }
                },
                odds: ['01','03','05','07','09','11'],
                evens: ['02','04','06','08','10'],
                larges: ['06','07','08','09','10','11'],
                smalls: ['01','02','03','04','05']
            };
        },
        computed: {
            selectedBalls(){
                let list = [], id;
                for(id in this.balls){
                    if(!this.balls.hasOwnProperty(id)) continue;
                    if(!this.balls[id].selected) continue;
                    list.push({
                        id: id,
                        name: this.balls[id].name,
                        value: this.balls[id].value
                    });
                }
                return list;
            }
        },
        watch: {
            selectedBalls(val){
                this.$emit('input', val);
            }
        },
        methods: {
            toggleToSelect(id, selected){
                if(typeof selected === 'undefined'){
                    selected = !this.balls[id].selected;
                }
                if(selected && this.max && this.selectedBalls.length >= this.max){
                    let maxId = this.selectedBalls[this.max - 1].id;
                    let minId = this.selectedBalls[0].id;
                    let delId;
                    if(id > maxId){
                        delId = minId;
                    }else{
                        delId = maxId;
                    }
                    this.balls[delId].selected = false;
                }
                if(selected && !this.repeat){
                    this.makeUnique(id);
                }
                this.balls[id].selected = selected;
            },
            makeUnique(id){
                let refName, refs = this.$parent.$refs;
                for(refName in refs){
                    if(refName === this.refName) continue;
                    if(!refs.hasOwnProperty(refName)) continue;
                    if(typeof refs[refName] === 'undefined') continue;
                    refs[refName].balls[id].selected = false;
                }
            },
            selectAll(){
                let id;
                for(id in this.balls){
                    if(!this.balls.hasOwnProperty(id)) continue;
                    this.toggleToSelect(id, true);
                }
            },
            selectLarge(){
                this.clearAllSelected();
                this.larges.forEach(id => {
                    this.toggleToSelect('b' + id, true);
                });
            },
            selectSmall(){
                this.clearAllSelected();
                this.smalls.forEach(id => {
                    this.toggleToSelect('b' + id, true);
                });
            },
            selectOdd(){
                this.clearAllSelected();
                this.odds.forEach(id => {
                    this.toggleToSelect('b' + id, true);
                });
            },
            selectEven(){
                this.clearAllSelected();
                this.evens.forEach(id => {
                    this.toggleToSelect('b' + id, true);
                });
            },
            clearAllSelected(){
                let id;
                for(id in this.balls){
                    if(!this.balls.hasOwnProperty(id)) continue;
                    this.toggleToSelect(id, false);
                }
            }
        }
    };
</script>
