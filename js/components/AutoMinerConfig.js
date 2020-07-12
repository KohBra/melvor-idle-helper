import ConfigSection from './ConfigSection.js'
import { miningRocks } from '../const.js'
import SingleSelect from './helpers/SingleSelect.js'

export default {
    components: { ConfigSection, SingleSelect },
    template: `
<config-section>
    <template v-slot:title>Auto Miner</template>
    <template v-for="ore in 3">
        <div class="col-6 col-lg-4 col-xl-3  d-flex align-items-center my-3">
            <p class="font-size-sm text-muted m-0">
                {{ numberWord(ore) }} Ore Priority
            </p>
        </div>
        <div class="col-6 col-lg-8 col-xl-9 d-flex align-items-center py-2">
            <div class="form-group m-0 flex-grow-1">
                <single-select
                    v-model="config.ores[ore]"
                    :options="ores"
                ></single-select>
            </div>
        </div>    
    </template>
</div>
</config-section>`,
    props: {
        config: Object,
    },
    computed: {
        ores () {
            return [{
                img: 'assets/media/skills/mining/rock_empty.svg',
                id: null,
                text: 'None',
            }].concat(oreTypes.map((oreType, rockId) => {
                if (miningData[rockId].level > window.skillLevel[CONSTANTS.skill.Mining]) {
                    return null
                }

                let img = `assets/media/skills/mining/rock_${oreType}.svg`
                if (rockId === miningRocks.runeEssence) {
                    // why
                    img = `assets/media/bank/rune_essence.svg`
                }
                return {
                    img: img,
                    id: rockId,
                    text: window.setToUppercase(oreType)
                }
            })).filter(option => option)
        },
    },
    methods: {
        numberWord (number) {
            switch (number) {
                case 1:
                    return 'First'
                case 2:
                    return 'Second'
                case 3:
                    return 'Third'
            }
        },
        validateConfig () {
            if (!Array.isArray(this.config.ores)) {
                this.$set(this.config, 'ores', [])
            }
        },
    },
    created () {
        this.validateConfig()
    }
}