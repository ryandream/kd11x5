<template>
    <carousel class="war_carousel" :autoplay="true" :perPage="1" :autoplayTimeout="3000" :autoplayHoverPause="true" :speed="500" :loopPlay="true">
        <slide v-for="(item, index) in list" :key="'carouosel-item-' + index"><a :href="item.link" target="_blank"><img :src="item.image" alt="advertise"></a></slide>
    </carousel>
</template>

<script>
    import * as ajax from '../api';
    import { datatype } from '../common/basic';
    import { Carousel, Slide } from 'vue-carousel';

    export default {
        name: 'HomeCarousel',
        data(){
            return {
                list: []
            };
        },
        created(){
            this.fetchAdsList();
        },
        methods: {
            fetchAdsList(){
                return ajax.apiFetchAdvertisement().then(json => {
                    if(typeof json.S !== 'undefined'){
                        console.log(json);
                        return;
                    }
                    if(datatype(json) !== 'array') return;

                    let list = [];
                    json.forEach(item => {
                        list.push({
                            link: item.Link_URL,
                            image: item.File_Path
                        });
                    });
                    this.list = list;
                });
            }
        },
        components: {
            Carousel,
            Slide
        }
    };
</script>
