const phantom = require('phantom');

(async()=>{
    const instance = await phantom.create();
    const page = await instance.createPage();
    let name = "template";
    await page.property("viewportSize",{width: 1400 , height: 700});
    await page.property("paperSize",{width: 800 , height: 1030});
    // 不加會有神秘留白
    // 完美QQ

    // await page.on("onResourceRequested", function(requestData) {
    //         console.info('Requesting', requestData.url)
    // });
    page.open(`${name}.html`)
    .then(status=>{
        setTimeout(()=>{
            console.log(`Page opened with status [${status}].`);
            // page.render('google_home.jpeg', {format: 'jpeg', quality: '100'})
            page.render(`${name}-pdf.pdf`, {format: 'pdf', quality: '100'})
                .then(r=>{
                    instance.exit();
                });
            console.log(`File created at [./${name}-pdf.pdf]`);
        },1500);
    })
    .catch(err=>{});

    // const status = await page.open(`${name}.html`);
    // console.log(`Page opened with status [${status}].`);
    // await page.render(`${name}-pdf.pdf`);
    // console.log(`File created at [./${name}-pdf.pdf]`);
    // await instance.exit();


    // await page.open(`${name}.html`);
    // const content = await page.property('content');
    // console.log(content);
    // await instance.exit();
})();
//
// Du bist eine frau und Ich bin ein Mann
// Das wasser und das brot
// Sie ist ein Junge
// Er twinkt
// Twinkt er?
// Is he drinking
// he is drinking water
// Er twinkt das wasser
