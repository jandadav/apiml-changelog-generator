let jsdom = require('jsdom');
const { JSDOM } = jsdom;
let axios = require('axios');
const fs = require('fs');


axios.get('https://github.com/zowe/api-layer/compare/v1.18.1...v1.19.2')
.then((response) => {
    if(response.status === 200) {
    const html = response.data;
    const { window } = new JSDOM(html);
    let $ = require('jquery')(window);
    
    $(".pr-1").each( async (index, element) => {

        
        //console.log($(element).find("code").text());
        let name = $(element).find("code").find("a").text();
        let title = $(element).find("code").find("a").attr("title");
        
        
        
        let commitHref = $(element).find("code").find("a").attr('href');
        commitHref = commitHref != null ? "https://github.com" + commitHref : null
        let prHref = $(element).find(".issue-link").attr('href');

        // sometimes fires both
        if(prHref != null) {
            await getPr(prHref);
        } else if (commitHref != null) {
            await getCommit(commitHref);
        }

        if (name) {
            console.log(name);
            console.log(title);
            console.log(commitHref);
            console.log(prHref);

            //results.push({"name": name, "title": title,"commit": commitHref, "pr": prHref})
            console.log("==============================");
        }

        //console.log(results);
        

    })
    
    //console.log(results);

    // fs.writeFile("output.json", JSON.stringify(results), function(err) {
    //     if(err) {
    //         return console.log(err);
    //     }
    //     console.log("The file was saved!");
    // });

    console.log("Function has returned");
    
}
}, (error) => console.log(error) );




async function getPr(prHref) {
    try {
        const response = await axios.get(prHref);

        if(response.status === 200) { 
            console.log("retrieved: " + prHref);
            const html = response.data;
            const { window } = new JSDOM(html);
            var $ = require('jquery')(window);
            // does not work well with repo:branch styled PR's
            console.log($(".gh-header-meta").find(".css-truncate-target").eq(2).text());
        }
    } catch (err) {
        console.log(err);
    }


}

async function getCommit(commitHref) {
    try {
        const response = await axios.get(commitHref);

        if(response.status === 200) { 
            console.log("retrieved: " + commitHref);
            const html = response.data;
            const { window } = new JSDOM(html);
            var $ = require('jquery')(window);

            let prHref = $(".issue-link").attr("href");
             

            console.log("found prhref: " + prHref);
            
            if (prHref) {
                await getPr(prHref)
            }
        }
    } catch (err) {
        console.log(err);
    }
}