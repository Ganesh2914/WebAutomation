const minimist = require("minimist");
let fs=require('fs');
let args=minimist(process.argv);
let puppeteer=require('puppeteer');


 
/*
If we have to use await we have to make use of async
IIFE->Immediately invoked function execution
(function(){

// })
*/
// RUN THIS COMMAND
// node .\webAutomationPractice.js --url="https://www.hackerrank.com/" --config=config.json

function sleep(ms) {
    return new Promise( sol => setTimeout(sol, ms));
}
let json=fs.readFileSync(args.config);
let config=JSON.parse(json);
(async() =>{
const browser = await puppeteer.launch({headless: false,
args:['--start-maximized'],
defaultViewport:null
});
let page=await browser.pages();
await page[0].goto(args.url);
// await page.screenshot({path:'exmp.png'})
// await browser.close();
await page[0].waitForSelector('li#menu-item-12851> a[href="/access-account/"]');
await page[0].click('li#menu-item-12851> a[href="/access-account/"]');

await page[0].waitForSelector('a.hr_button[href="/login/"]');
await page[0].click('a.hr_button[href="/login/"]');

await page[0].waitForSelector("#input-1");
await page[0].type("#input-1",config.userid,{delay:200});
await page[0].waitForSelector("#input-2");
await page[0].type("#input-2",config.password,{delay:300})

await page[0].waitForSelector('button[data-analytics="LoginPassword"]');
await page[0].click('button[data-analytics="LoginPassword"]');

await page[0].waitForSelector('a[data-analytics="NavBarContests"]');
await page[0].click('a[data-analytics="NavBarContests"]');

await page[0].waitForSelector('a[href="/administration/contests/"]');
await page[0].click('a[href="/administration/contests/"]');

 

await page[0].waitForSelector("a[data-attr1='Last']");
let NoOfPages=await page[0].$eval("a[data-attr1='Last']",function(pages){

    let page=pages.getAttribute('data-page');
    return page;
})
 
for(let i=0;i<=NoOfPages-1;i++){
     await handleAllContests(page[0],browser);
     if(i < NoOfPages){
        await page[0].waitForSelector("a[data-attr1='Right']");
        await page[0].click("a[data-attr1='Right']");
     }
}
    await page[0].waitForSelector("i.icon-down-open");
    await page[0].click("i.icon-down-open");

    await page[0].waitForSelector("a.logout-button");
    await page[0].click("a.logout-button");

    await browser.close();
})();

async function handleAllContests(page,browser){
    await page.waitForSelector("a.backbone.block-center");
    let curls= await page.$$eval("a.backbone.block-center",function(atags){
        let urls=[];
    
        for(let i=0;i<atags.length;i++){
            let url=atags[i].getAttribute("href");
            urls.push(url);
        }
    
        return urls;
    });

 for(let i=0;i<curls.length;i++){
    let ctab=await browser.newPage();
    await handleContests(ctab,args.url+curls[i],config.moderator);
    await sleep(1000);

    await ctab.close();
 }

}

async function handleContests(ctab,fullCUrl,moderator){``
     
    await ctab.bringToFront();
    await ctab.goto(fullCUrl);
    await sleep(1000);
    
    await ctab.waitForSelector("li[data-tab='moderators']");
    await ctab.click("li[data-tab='moderators']");
    
    await ctab.waitForSelector("input#moderator");
    await ctab.type("input#moderator",moderator,{delay:500});
     
    await ctab.keyboard.press("Enter");
}

 