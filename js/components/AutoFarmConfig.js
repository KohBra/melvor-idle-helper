import ConfigSection from './ConfigSection.js'
import MultiSelect from './helpers/MultiSelect.js'
import SingleSelect from './helpers/SingleSelect.js'

export default {
    components: { ConfigSection, MultiSelect, SingleSelect },
    template: `
<config-section>
    <template v-slot:title>Auto Farm</template>
    <div class="col-6 col-lg-4 col-xl-3 d-flex flex-column justify-content-center my-3">
        <div class="font-size-sm text-muted m-0">
            Allotment Seeds
        </div>
        <div class="font-size-xs text-secondary">
            Plants in order selected (assuming there is enough seeds)
        </div>
    </div>
    <div class="col-6 col-lg-8 col-xl-9 d-flex align-items-center py-2">
        <div class="form-group m-0 flex-grow-1">
            <multi-select
                v-model="config.allotmentSeeds"
                :options="allotmentSeeds"
            ></multi-select>
        </div>
    </div>
    <div class="col-6 col-lg-4 col-xl-3 d-flex align-items-center my-3">
        <div class="font-size-sm text-muted m-0">
            Allotment Compost
        </div>
    </div>
    <div class="col-6 col-lg-8 col-xl-9 d-flex align-items-center py-2">
        <div class="form-group m-0 flex-grow-1">
            <single-select
                v-model="config.allotmentCompost"
                :options="compostOptions"
            ></single-select>
        </div>
    </div>
    <div class="col-6 col-lg-4 col-xl-3 d-flex flex-column justify-content-center my-3">
        <div class="font-size-sm text-muted m-0">
            Herb Seeds
        </div>
        <div class="font-size-xs text-secondary">
            Plants in order selected (assuming there is enough seeds)
        </div>
    </div>
    <div class="col-6 col-lg-8 col-xl-9 d-flex align-items-center py-2">
        <div class="form-group m-0 flex-grow-1">
        <multi-select
            v-model="config.herbSeeds"
            :options="herbSeeds"
        ></multi-select>
        </div>
    </div>
    <div class="col-6 col-lg-4 col-xl-3 d-flex align-items-center my-3">
        <div class="font-size-sm text-muted m-0">
            Herb Compost
        </div>
    </div>
    <div class="col-6 col-lg-8 col-xl-9 d-flex align-items-center py-2">
        <div class="form-group m-0 flex-grow-1">
            <single-select
                v-model="config.herbCompost"
                :options="compostOptions"
            ></single-select>
        </div>
    </div>
    <div class="col-6 col-lg-4 col-xl-3 d-flex flex-column justify-content-center my-3">
        <div class="font-size-sm text-muted m-0">
            Tree Seeds
        </div>
        <div class="font-size-xs text-secondary">
            Plants in order selected (assuming there is enough seeds)
        </div>
    </div>
    <div class="col-6 col-lg-8 col-xl-9 d-flex align-items-center py-2">
        <div class="form-group m-0 flex-grow-1">
        <multi-select
            v-model="config.treeSeeds"
            :options="treeSeeds"
        ></multi-select>
        </div>
    </div>
    <div class="col-6 col-lg-4 col-xl-3 d-flex align-items-center my-3">
        <div class="font-size-sm text-muted m-0">
            Tree Compost
        </div>
    </div>
    <div class="col-6 col-lg-8 col-xl-9 d-flex align-items-center py-2">
        <div class="form-group m-0 flex-grow-1">
            <single-select
                v-model="config.treeCompost"
                :options="compostOptions"
            ></single-select>
        </div>
    </div>
</div>
</config-section>`,
    props: {
        config: Object,
    },
    computed: {
        allotmentSeeds () {
            return window.allotmentSeeds.filter(s => s.level <= window.skillLevel[CONSTANTS.skill.Farming])
                .map(seed => {
                    return {
                        text: items[seed.itemID].name,
                        id: seed.itemID,
                        img: items[seed.itemID].media,
                    }
                })
        },
        treeSeeds () {
            return window.treeSeeds.filter(s => s.level <= window.skillLevel[CONSTANTS.skill.Farming])
                .map(seed => {
                    return {
                        text: items[seed.itemID].name,
                        id: seed.itemID,
                        img: items[seed.itemID].media,
                    }
                })
        },
        herbSeeds () {
            return window.herbSeeds.filter(s => s.level <= window.skillLevel[CONSTANTS.skill.Farming])
                .map(seed => {
                    return {
                        text: items[seed.itemID].name,
                        id: seed.itemID,
                        img: items[seed.itemID].media,
                    }
                })
        },
        compostOptions () {
            let options = [{
                text: `0 compost`,
                id: 0,
                img: 'assets/media/bank/compost.svg',
                imgClass: 'desaturate',
            }]

            Array(5).fill().map((value, i) => {
                options.push({
                    text: `${i + 1} compost`,
                    id: i + 1,
                    img: 'assets/media/bank/compost.svg'
                })
            })

            options.push({
                text: 'Weird Gloop',
                id: 6,
                img: 'assets/media/bank/weird_gloop.svg'
            })

            return options
        }
    },
    methods: {
        validateConfig () {
            if (!Array.isArray(this.config.allotmentSeeds)) {
                this.$set(this.config, 'allotmentSeeds', [])
            }

            if (!Array.isArray(this.config.herbSeeds)) {
                this.$set(this.config, 'herbSeeds', [])
            }

            if (!Array.isArray(this.config.treeSeeds)) {
                this.$set(this.config, 'treeSeeds', [])
            }

            if (typeof this.config.allotmentCompost !== 'number') {
                this.$set(this.config, 'allotmentCompost', 0)
            }

            if (typeof this.config.herbCompost !== 'number') {
                this.$set(this.config, 'herbCompost', 0)
            }

            if (typeof this.config.treeCompost !== 'number') {
                this.$set(this.config, 'treeCompost', 0)
            }
        },
    },
    created () {
        this.validateConfig()
    },
}