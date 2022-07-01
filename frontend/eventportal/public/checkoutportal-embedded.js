class CheckoutPortalWidget{
    // reference: https://developers.clicksign.com/docs/instalacao-do-widget-embedded

    constructor(uuidEvent){
        this.uuidEvent = uuidEvent;
        this.eventPortalHost = "https://tickets.socialpass.io"
        this.eventPortalUrl = undefined
    }

    getEventPortalUrl(){
        if(this.eventPortalUrl){
            return this.eventPortalUrl
        }else{
            return this.eventPortalHost + '/' + this.uuidEvent
        }
    }

    _getIFrameElement(){
        let ifrm = document.createElement('iframe');
        ifrm.setAttribute('class', 'socialpass-checkoutportal-frame');
        ifrm.setAttribute('style', 'width: 100%; height:100%; border: none;');
        ifrm.setAttribute('src', this.getEventPortalUrl());
        return ifrm
    }

    getEmbeddableTag(){
        /* With this method, the HTML for embedding the event checkout portal
        can be displayed to the event organizer. This way, he can embed it however he desires.*/
        return ifrm.outerHTML
    }

    mount(containerTagId){
        this.unmount()
        /* Appends the configured iFrame as a child to the given container */
        this.container = document.getElementById(containerTagId);
        this.container.appendChild(this._getIFrameElement());
    }

    unmount(){
        if(this.container){
            this.container.innerHTML = '';
            this.container = undefined
        }
    }
}
