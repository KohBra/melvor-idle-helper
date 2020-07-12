// Run after the game has loaded what it needs.
import { Toolset } from './Toolset.js'

const loadedInterval = setInterval(() => {
    if (window.isLoaded) {
        clearInterval(loadedInterval)
        // Get it? Melvor Idle Toolset
        window.MIT = Toolset.run()
        // configurationPage.build(toolset)
        // Get the fuck outta here with the ad container.
        $('#main-container>div:first-child').remove()
    }
}, 50)