export default {
    template: `
<div>
    <h2 class="content-heading border-bottom mb-2 pb-2 pt-0">
        <slot name="title"></slot>
    </h2>
    <div class="row py-4">
        <slot></slot>
    </div>
</div>
`
}