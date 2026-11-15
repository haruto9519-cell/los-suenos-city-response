import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({headless:true,args:['--enable-webgl','--ignore-gpu-blocklist','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context = await browser.newContext({viewport:{width:1440,height:900}});
const page = await context.newPage();
page.setDefaultTimeout(12000);
const pageErrors=[],consoleErrors=[],failedRequests=[];
page.on('pageerror',error=>pageErrors.push(error.message));
page.on('console',msg=>{if(msg.type()==='error')consoleErrors.push(msg.text())});
page.on('requestfailed',req=>failedRequests.push({url:req.url(),error:req.failure()?.errorText}));
try {
  await page.goto('http://127.0.0.1:4173/?e2e=1',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>!!window.__LOS_E2E__,null,{timeout:20000});
  await page.waitForSelector('canvas',{timeout:15000});
  assert.equal(await page.locator('#briefing').isVisible(),true,'briefing should be visible on launch');

  await page.locator('#scenario-select').selectOption('transit');
  assert.match(await page.locator('#mission-title').textContent(),/CENTRAL TRANSIT/);
  await page.evaluate(()=>document.querySelector('#start').click());
  await page.locator('#station-console').waitFor({state:'visible'});

  assert.equal(await page.locator('#audio-toggle').textContent(),'AUDIO ON','audio should initialize on entering the operations room');
  await page.evaluate(()=>document.querySelector('#audio-toggle').click());
  assert.equal(await page.locator('#audio-toggle').textContent(),'AUDIO OFF','audio should turn off');
  await page.evaluate(()=>document.querySelector('#audio-toggle').click());
  assert.equal(await page.locator('#audio-toggle').textContent(),'AUDIO ON','audio should turn on again');
  await page.evaluate(()=>{
    const values=['Team coordination','Resident liaison','Medical liaison'];
    document.querySelectorAll('.team-role').forEach((select,index)=>{
      select.value=values[index];
      select.dispatchEvent(new Event('change',{bubbles:true}));
    });
  });
  assert.deepEqual(await page.locator('.team-role').evaluateAll(els=>els.map(el=>el.value)),['Team coordination','Resident liaison','Medical liaison']);
  await page.evaluate(()=>document.querySelector('#issue-briefing').click());
  assert.match(await page.locator('#team-state').textContent(),/TEAM BRIEFED/);
  await page.evaluate(()=>document.querySelector('#deploy-unit').click());
  await page.keyboard.press('r');
  assert.equal((await page.evaluate(()=>window.__LOS_E2E__.state())).radioReady,true,'radio check should be acknowledged');

  for(let i=0;i<3;i++){
    await page.evaluate(index=>window.__LOS_E2E__.openContact(index),i);
    assert.equal(await page.locator('#dialogue').isVisible(),true);
    await page.evaluate(()=>document.querySelector('[data-choice="explain"]').click());
    await page.evaluate(()=>document.querySelector('[data-choice="needs"]').click());
    await page.evaluate(()=>document.querySelector('[data-choice="record"]').click());
  }
  assert.equal((await page.evaluate(()=>window.__LOS_E2E__.state())).assisted,3,'three resident contacts should be documented');

  await page.evaluate(()=>window.__LOS_E2E__.advanceMission(26));
  await page.locator('#dispatch-event').waitFor({state:'visible'});
  assert.match(await page.locator('#dispatch-choice-a').textContent(),/Record both times as estimates/);
  await page.evaluate(()=>document.querySelector('#dispatch-choice-a').click());
  assert.equal((await page.evaluate(()=>window.__LOS_E2E__.state())).dispatchResolved,1);

  await page.evaluate(()=>window.__LOS_E2E__.advanceMission(66));
  await page.locator('#dispatch-event').waitFor({state:'visible'});
  assert.match(await page.locator('#dispatch-choice-a').textContent(),/passenger support liaison/i);
  await page.evaluate(()=>document.querySelector('#dispatch-choice-a').click());
  await page.waitForTimeout(1000);
  const finalState=await page.evaluate(()=>window.__LOS_E2E__.state());
  console.log('STATE AFTER FINAL DISPATCH',JSON.stringify(finalState));
  assert.equal(finalState.dispatchResolved,2,'both dispatch updates should be resolved');
  assert.equal(finalState.assisted,3,'all three contacts should remain documented');
  assert.equal(finalState.complete,true,'incident should close after all objectives');
  await page.locator('#complete').waitFor({state:'visible',timeout:5000});
  const completed=await page.evaluate(()=>window.__LOS_E2E__.state());
  assert.equal(completed.complete,true);
  assert.equal(completed.calls,1);

  await page.evaluate(()=>document.querySelector('#return-station').click());
  await page.locator('#station-console').waitFor({state:'visible'});
  assert.match(await page.locator('#career-record').textContent(),/COMPLETED CALL-OUTS[\s\S]*1/);
  await page.evaluate(()=>document.querySelector('#new-callout').click());
  assert.equal(await page.locator('#briefing').isVisible(),true);
  assert.equal((await page.evaluate(()=>window.__LOS_E2E__.state())).complete,false);
  assert.equal((await page.evaluate(()=>window.__LOS_E2E__.state())).assisted,0);

  await page.locator('#scenario-select').selectOption('square');
  assert.match(await page.locator('#mission-title').textContent(),/MARKET SQUARE/);
  const restoredPage=await context.newPage();
  restoredPage.on('pageerror',error=>pageErrors.push(error.message));
  await restoredPage.goto('http://127.0.0.1:4173/?e2e=1',{waitUntil:'domcontentloaded',timeout:60000});
  await restoredPage.waitForFunction(()=>!!window.__LOS_E2E__,null,{timeout:20000});
  assert.equal((await restoredPage.evaluate(()=>window.__LOS_E2E__.career())).calls,1,'career should persist in a fresh page in the same browser profile');
  assert.equal(pageErrors.length,0,'browser should have no uncaught JavaScript errors');
  await restoredPage.close();
  console.log('PASS: browser launch, audio, scenario selection, briefing, deployment, radio, resident dialogue, dispatch branches, incident closure, station return, next call-out reset and career persistence.');
} catch(error) {
  await page.screenshot({path:'/tmp/los-suenos-e2e-failure.png',fullPage:true}).catch(()=>{});
  console.error(error);
  console.error('PAGE ERRORS',JSON.stringify(pageErrors));
  console.error('CONSOLE ERRORS',JSON.stringify(consoleErrors));
  console.error('FAILED REQUESTS',JSON.stringify(failedRequests));
  process.exitCode=1;
} finally {
  await browser.close();
}
