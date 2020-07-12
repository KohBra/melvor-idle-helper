export default {
    components: {
        'v-multiselect': window.VueMultiselect.default,
    },
    template: `
    <v-multiselect
        label="text"
        track-by="id"
        :options="options"
        :multiple="false"
        :close-on-select="true"
        :hide-selected="false"
        @input="input"
        :value="selectedOption"
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
        <template v-slot:singleLabel="{option, remove}">
            <div class="d-flex align-items-center">
                <img class="option__image skill-icon-sm" :src="option.img" :alt="option.text" v-if="option.img" :class="option.imgClass">
                <div class="option__desc">
                    <span class="option__title">{{ option.text }}</span>
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
        selectedOption () {
            return this.options.find(option => option.id === this.value)
        }
    },
    methods: {
        input (option) {
            this.$emit('input', option.id)
        }
    }
}