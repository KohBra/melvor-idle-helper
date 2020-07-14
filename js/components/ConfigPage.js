import * as toolDefinitions from '../tools/index.js'
import { configKeys } from '../const.js'
import ToolToggles from './ToolToggles.js'
import AutoBuryConfig from './AutoBuryConfig.js'
import AutoOpenConfig from './AutoOpenConfig.js'
import AutoMinerConfig from './AutoMinerConfig.js'
import AutoSellConfig from './AutoSellConfig.js'
import AutoFarmConfig from './AutoFarmConfig.js'
import ItemsPerHourConfig from './ItemsPerHourConfig.js'

export default {
    components: {
        ToolToggles,
        AutoBuryConfig,
        AutoOpenConfig,
        AutoMinerConfig,
        AutoSellConfig,
        AutoFarmConfig,
        ItemsPerHourConfig
    },
    template: `
<div class="row row-deck">
    <div class="col-md-12">
        <div class="block block-rounded block-link-pop border-top border-settings border-4x">
            <div class="block-content">
                <tool-toggles></tool-toggles>
                <component
                    v-for="(toolConfigComponent, toolName) in toolConfigComponents"
                    :key="toolName"
                    v-if="toolConfigComponent !== null"
                    :is="toolConfigComponent"
                    :config="toolConfig(toolName)"
                ></component>
            </div>
        </div>
    </div>
</div>
`,
    props: {
        config: Object,
    },
    computed: {
        toolConfigComponents () {
            return this.config[configKeys.enabledTools].reduce((components, toolName) => {
                let tool = new toolDefinitions[toolName]
                components[toolName] = tool.configComponent()
                return components
            }, {})
        },
    },
    methods: {
        toolConfig (toolName) {
            if (typeof this.config[toolName] === 'undefined') {
                this.$set(this.config, toolName, {})
            }

            return this.config[toolName]
        }
    }
}