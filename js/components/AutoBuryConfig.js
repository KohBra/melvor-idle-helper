import ConfigSection from './ConfigSection.js'
import MultiSelect from './helpers/MultiSelect.js'
import { getBankItem } from '../helpers.js'

export default {
    components: { ConfigSection, MultiSelect },
    template: `
<config-section>
    <template v-slot:title>Auto Bury</template>
    <div class="col-6 col-lg-4 col-xl-3  d-flex align-items-center my-3">
        <p class="font-size-sm text-muted m-0">
            Bones to bury
        </p>
    </div>
    <div class="col-6 col-lg-8 col-xl-9 d-flex align-items-center py-2">
        <div class="form-group m-0 flex-grow-1">
        <multi-select
            v-model="config.bones"
            :options="bones"
        ></multi-select>
        </div>
    </div>
</div>
</config-section>`,
    props: {
        config: Object,
    },
    computed: {
        bones () {
            return items.map((i, id) => id).filter(id => items[id].isBones).map(id => {
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
            if (!Array.isArray(this.config.bones)) {
                this.$set(this.config, 'bones', [])
            }
        },
    },
    created () {
        this.validateConfig()
    },
}