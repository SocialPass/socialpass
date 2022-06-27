class CheckoutPortalWidget{
    // reference: https://developers.clicksign.com/docs/instalacao-do-widget-embedded

    constructor(uuidEvent){
        this.uuidEvent = uuidEvent;
        this.domainUrl = "https://tickets.socialpass.io"
    }

    _getIFrameElement(){
        let ifrm = document.createElement('iframe');
        ifrm.setAttribute('class', 'socialpass-checkoutportal-frame');
        ifrm.setAttribute('style', 'width: 100vw; height:100vh; border: none;');
        ifrm.setAttribute('src', this.domainUrl + '/' + this.uuidEvent);
        return ifrm
    }

    getEmbeddableTag(){
        /* With this method, the HTML for embedding the event checkout portal
        can be displayed to the event organizer. This way, he can embed it however he desires.*/
        return ifrm.outerHTML
    }

    mount(container_tag_id){
        /* Appends the configured iFrame as a child to the given container */
        const container = document.getElementById(container_tag_id);
        container.appendChild()
    }
}
