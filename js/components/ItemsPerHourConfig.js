import ConfigSection from './ConfigSection.js'
import MultiSelect from './helpers/MultiSelect.js'

export default {
    components: { ConfigSection, MultiSelect },
    template: `
<config-section>
    <template v-slot:title>Items Per Hour</template>
    <div class="col-6 col-lg-4 col-xl-3 d-flex flex-column justify-content-center my-3">
        <div class="font-size-sm text-muted m-0">
            Item change history duration (m)
        </div>
        <div class="font-size-xs text-secondary">
            How long in minutes to keep bank changes. I.E. If you get an item, and don't get another within 5 minutes, it won't be tracked in the items per hour. Set to 600 if you want to keep track of all items for 10 hours.
        </div>
    </div>
    <div class="col-6 col-lg-8 col-xl-9 d-flex align-items-center py-2">
        <div class="form-group m-0 flex-grow-1">
            <input class="form-control" type="number" min="1" max="1440" v-model="config.historyDuration">
        </div>
    </div>
</div>
</config-section>`,
    props: {
        config: Object,
    },
    methods: {
        validateConfig () {
            if (typeof this.config.historyDuration !== 'number') {
                this.$set(this.config, 'historyDuration', 60)
            }
        },
    },
    created () {
        this.validateConfig()
    },
}