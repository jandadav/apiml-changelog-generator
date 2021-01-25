let jsdom = require('jsdom');
const { JSDOM } = jsdom;
let axios = require('axios');




axios.get('https://github.com/zowe/api-layer/compare/v1.19.1...v1.19.2')
    .then((response) => {
        if(response.status === 200) {
        const html = response.data;
        const { window } = new JSDOM(html);
        var $ = require('jquery')(window);
        
        $(".pr-1").each( (index, element) => {

            
            //console.log($(element).find("code").text());
            console.log($(element).find("code").find("a").text());
            
            let commitHref = $(element).find("code").find("a").attr('href');
            commitHref = commitHref != null ? "https://github.com" + commitHref : null
            let prHref = $(element).find(".issue-link").attr('href');
            
            console.log(commitHref);
            console.log(prHref);
            

            if(prHref != null) {
                axios.get(prHref).then((response) => {
                    if(response.status === 200) { 
                        console.log(prHref + " retrieved")}
                        const html = response.data;
                        const { window } = new JSDOM(html);
                        var $ = require('jquery')(window);

                        console.log($(".partial-discussion-header").find(".head-ref").text());

                }, (error) => console.log(error) );
            } else if (commitHref != null) {
                axios.get(commitHref).then((response) => {
                    if(response.status === 200) { 
                        console.log(commitHref + " retrieved")}
                }, (error) => console.log(error) );
            }



            console.log("+++++++++++++=");

        })
        
        
    }
    }, (error) => console.log(err) );