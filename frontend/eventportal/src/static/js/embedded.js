class Frame{

    constructor(domain_url, uuid_event){
        this.domain_url = domain_url;
        this.uuid_event = uuid_event;
    }

    mount(container_tag_id){
        const app = document.getElementById(container_tag_id)
        var ifrm = document.createElement('iframe');
        console.log("setting iframe")
        ifrm.setAttribute('id', 'portal');
        ifrm.setAttribute('style', 'width: 100vw; height:100vh; border: none;');
        ifrm.setAttribute('src', this.domain_url + '/' + this.uuid_event);
        console.log(ifrm);
        const tag = `&lt;iframe id="portal" style="width: 100vw; height:100vh; border: none;" src=${`https://tickets.socialpass.io/${this.uuid_event}`}&gt;&lt;/iframe&gt;`;
        document.write(tag);


        // var parent_container = document.getElementById(container_tag_id);
        // parent_container.appendChild(ifrm);
    }
}
