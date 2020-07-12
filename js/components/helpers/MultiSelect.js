export default {
    components: {
        'v-multiselect': window.VueMultiselect.default,
    },
    template: `
    <v-multiselect
        label="text"
        track-by="id"
        :options="options"
        :multiple="true"
        :close-on-select="false"
        :hide-selected="true"
        @input="input"
        :value="selectedOptions"
        class="mit-multiselect"
    >
        <template v-slot:option="{option}">
            <div class="d-flex align-items-center">
                <img class="option__image skill-icon-sm" :src="option.img" :alt="option.text" v-if="option.img" :class="option.imgClass">
                <div class="option__desc">
                    <span class="option__title">{{ option.text }}</span>
                </div>
            </div>
        </template>
        <template v-slot:tag="{option, remove}">
            <div class="d-flex align-items-center">
                <img class="option__image skill-icon-sm" :src="option.img" :alt="option.text" v-if="option.img" :class="option.imgClass">
                <div class="option__desc">
                    <span class="option__title">{{ option.text }}</span>
                </div>
                <div @click.stop.prevent="remove(option)" class="p-2 text-danger pointer-enabled">
                    ✕
                </div>
            </div>
        </template>
    </v-multiselect>
</div>
`,
    props: {
        value: null,
        options: Array,
    },
    computed: {
        selectedOptions () {
            if (Array.isArray(this.value)) {
                return this.value.map(itemId => this.options.find(option => option.id === itemId))
            } else {
                return []
            }
        },
    },
    methods: {
        input (options) {
            this.$emit('input', options.map(option => option.id))
        },
    }
}