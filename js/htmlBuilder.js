// Info builders
export const genericInfoContainer = (imgSrc, title, text, subtext, classList, skill) => `${infoContainer(`
<div class="media d-flex align-items-center push">
    <div class="mr-3">
        <img class="shop-img" src="${imgSrc}">
    </div>
    <div class="media-body">
        <div class="font-w600">${title}</div>
            <div class="font-size-sm">${text}</div>
        <div class="font-size-sm text-success" id="harvest-ready-0">${subtext}</div>
    </div>
</div>
`, classList, skill)}`

export const infoContainer = (innerHtml, classList = 'col-12 col-md-6 col-xl-4', skill = 'settings') => `
<div class="${classList}">
    <div class="block block-content block-rounded block-link-pop border-top border-${skill} border-4x d-flex">
        ${innerHtml}
    </div>
</div>
`