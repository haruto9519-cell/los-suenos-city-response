import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--ignore-gpu-blocklist','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage();page.setDefaultTimeout(15000);
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:4173/?e2e=1',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForSelector('canvas',{timeout:20000});await page.waitForFunction(()=>!!window.__SANVEGA_E2E__,null,{timeout:10000});
 assert.equal(await page.locator('#intro').isVisible(),true);
 await page.locator('#start-shift').click();assert.equal((await page.evaluate(()=>window.__SANVEGA_E2E__.state())).onDuty,true);
 assert.match(await page.locator('#duty-state').textContent(),/ON DUTY/);
 await page.locator('#view-toggle').click();assert.match(await page.locator('#view-toggle').textContent(),/THIRD/);
 await page.locator('#view-toggle').click();assert.match(await page.locator('#view-toggle').textContent(),/FIRST/);
 await page.evaluate(()=>window.__SANVEGA_E2E__.setPosition(-15,11));await page.evaluate(()=>window.__SANVEGA_E2E__.interact());
 assert.equal((await page.evaluate(()=>window.__SANVEGA_E2E__.state())).inVehicle,true);
 await page.evaluate(()=>window.__SANVEGA_E2E__.acceptDispatch());assert.equal((await page.evaluate(()=>window.__SANVEGA_E2E__.state())).dispatch,true);
 await page.evaluate(()=>window.__SANVEGA_E2E__.setPosition(31,-28));await page.evaluate(()=>window.__SANVEGA_E2E__.interact());
 assert.equal((await page.evaluate(()=>window.__SANVEGA_E2E__.state())).atScene,true);
 await page.evaluate(()=>window.__SANVEGA_E2E__.setPosition(31,-23));await page.evaluate(()=>window.__SANVEGA_E2E__.interact());
 assert.equal(await page.locator('#dialogue').isVisible(),true);
 await page.locator('[data-talk="listen"]').click();assert.match(await page.locator('#dialogue-text').textContent(),/recurring noise issue/);
 await page.locator('[data-talk="record"]').click();assert.equal((await page.evaluate(()=>window.__SANVEGA_E2E__.state())).contactDone,true);
 assert.equal(await page.locator('#shift-complete').isVisible(),true);assert.equal(errors.length,0);
 console.log('PASS: San Vega launch, shift, camera, vehicle, dispatch, scene arrival, resident dialogue and contact record.');
}catch(e){await page.screenshot({path:'/tmp/san-vega-e2e-failure.png',fullPage:true}).catch(()=>{});console.error(e);console.error('BROWSER ERRORS',JSON.stringify(errors));process.exitCode=1}finally{await browser.close()}