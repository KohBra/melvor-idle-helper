import ConfigSection from './ConfigSection.js'
import MultiSelect from './helpers/MultiSelect.js'
import { getBankItem } from '../helpers.js'

export default {
    components: { ConfigSection, MultiSelect },
    template: `
<config-section>
    <template v-slot:title>Auto Runecrafting</template>
    <div class="col-6 col-lg-4 col-xl-3 d-flex flex-column justify-content-center my-3">
        <p class="font-size-sm text-muted m-0">
            Runes to craft
        </p>
        <div class="font-size-xs text-secondary">
            Runes to craft in rotation
        </div>
    </div>
    <div class="col-6 col-lg-8 col-xl-9 d-flex align-items-center py-2">
        <div class="form-group m-0 flex-grow-1">
        <multi-select
            v-model="config.runes"
            :options="runes"
        ></multi-select>
        </div>
    </div>
    <div class="col-6 col-lg-4 col-xl-3 d-flex align-items-center my-3">
        <p class="font-size-sm text-muted m-0">
            Amount of each rune to craft
        </p>
    </div>
    <div class="col-6 col-lg-8 col-xl-9 d-flex align-items-center py-2">
        <div class="form-group m-0 flex-grow-1">
            <input class="form-control" type="number" min="1" :value="config.amount" @input="changeAmount">
        </div>
    </div>
</div>
</config-section>`,
    props: {
        config: Object,
    },
    computed: {
        runes () {
            let runeIds = window.runecraftingItems
                .filter(i => (i.runecraftingCategory === 0 || i.runecraftingCategory === 6)
                    && i.runecraftingLevel <= skillLevel[CONSTANTS.skill.Runecrafting]
                ).map(i => i.itemID)
            return items.map((i, id) => id).filter(id => runeIds.includes(id)).map(id => {
                let bankItem = getBankItem(id) ?? { qty: 0 }
                return {
                    text: `${items[id].name} (${bankItem.qty} owned)`,
                    id: id,
                    img: items[id].media,
                }
            })
        },
    },
    methods: {
        validateConfig () {
            if (!Array.isArray(this.config.runes)) {
                this.$set(this.config, 'runes', [])
            }

            if (typeof this.config.amount !== 'number') {
                this.$set(this.config, 'amount', 100)
            }
        },
        changeAmount (e) {
            this.config.amount = parseInt(e.target.value ?? 0)
        }
    },
    created () {
        this.validateConfig()
    },
}