let jsdom = require('jsdom');
const { JSDOM } = jsdom;
let axios = require('axios');
const fs = require('fs');

let results = [];

getChangelog(results);



async function getChangelog(results) {
    await axios.get('https://github.com/zowe/api-layer/compare/v1.18.1...v1.19.2')
    .then((response) => {
        if(response.status === 200) {
        const html = response.data;
        const { window } = new JSDOM(html);
        let $ = require('jquery')(window);
        
        $(".pr-1").each( (index, element) => {

            
            //console.log($(element).find("code").text());
            let name = $(element).find("code").find("a").text();
            let title = $(element).find("code").find("a").attr("title");
            
            
            
            let commitHref = $(element).find("code").find("a").attr('href');
            commitHref = commitHref != null ? "https://github.com" + commitHref : null
            let prHref = $(element).find(".issue-link").attr('href');

            // if(prHref != null) {
            //     getPr(prHref)
            // } else if (commitHref != null) {
            //     getCommit(commitHref);
            // }

            if (name) {
                console.log(name);
                console.log(title);
                console.log(commitHref);
                console.log(prHref);

                results.push({"name": name, "title": title,"commit": commitHref, "pr": prHref})
                console.log("==============================");
            }
   
            //console.log(results);
            

        })
        
        //console.log(results);

        fs.writeFile("output.json", JSON.stringify(results), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });


        
    }
    }, (error) => console.log(err) );
}




function getPr(prHref) {
    axios.get(prHref).then((response) => {
        if(response.status === 200) { 
            console.log(prHref + " retrieved")}
            const html = response.data;
            const { window } = new JSDOM(html);
            var $ = require('jquery')(window);

            console.log($(".partial-discussion-header").find(".commit-ref").text());
            
            return "RETURNED";

    }, (error) => console.log(error) );
}

function getCommit(commitHref) {
    axios.get(commitHref).then((response) => {
        if(response.status === 200) { 
            console.log(commitHref + " retrieved")}
    }, (error) => console.log(error) );
    console.log("+++++++++++++=");
}