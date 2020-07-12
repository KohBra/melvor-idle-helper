import * as toolDefinitions from '../tools/index.js'
import ConfigSection from './ConfigSection.js'

export default {
    components: { ConfigSection },
    template: `
<config-section>
    <template v-slot:title>Choose Tools to Enable</template>
    <template v-for="(toolClass, toolName) in toolDefinitions">
        <label class="col-12 d-flex hover:bg-black-10 m-0 pointer-enabled py-1">
            <div class="font-size-h4 d-flex flex-column flex-grow-1">
                <div class="text-muted">{{ toolName.match(/[A-Z][a-z]+/g).join(' ') }}</div>
                <span class="font-size-xs text-secondary">{{ toolDefinition(toolName) }}</span>
            </div>
            <div class="align-items-center d-flex">
                <div class="toggle-control">
                    <input type="checkbox" @input="toggleTool(toolName, $event)" :checked="isToolEnabled(toolName)">
                    <div class="control"></div>
                </div>
            </div>
        </label>
    </template>        
</config-section>`,
    data () {
        return {
            toolDefinitions: toolDefinitions,
        }
    },
    methods: {
        toolDefinition (toolName) {
            let tool = new this.toolDefinitions[toolName]
            return tool.getDescription()
        },

        isToolEnabled (toolName) {
            return this.$toolset.isToolEnabled(toolName)
        },

        toggleTool (toolName, event) {
            if (event.target.checked) {
                this.$toolset.startTool(toolName)
            } else {
                this.$toolset.stopTool(toolName)
            }
        },
    }
}