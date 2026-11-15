import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const root=document.querySelector('#game');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x9baeb4);
scene.fog=new THREE.Fog(0x9baeb4,34,115);
const camera=new THREE.PerspectiveCamera(74,innerWidth/innerHeight,.1,180);
camera.position.set(0,1.72,13);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.12;
root.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xdceaf0,0x4b5050,2.0));
const sun=new THREE.DirectionalLight(0xffe2b6,2.6);
sun.position.set(-22,34,15);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-55;sun.shadow.camera.right=55;sun.shadow.camera.top=55;sun.shadow.camera.bottom=-55;
scene.add(sun);

const mat=(color,roughness=.85,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const mats={
 asphalt:mat(0x30383c),sidewalk:mat(0x858b89),concrete:mat(0xb4b5ac),white:mat(0xe0dfd5),
 dark:mat(0x26343a),glass: new THREE.MeshStandardMaterial({color:0x49636b,roughness:.28,metalness:.35}),
 brick:mat(0x8b7770),sand:mat(0xb8a38a),blue:mat(0x526d78),green:mat(0x526c58),yellow:mat(0xd4ad65),
 roadline:mat(0xd9d5c7),leaf:mat(0x526b50),trunk:mat(0x57483c),amber:mat(0xdcae61)
};
function box(parent,x,y,z,w,h,d,material,shadow=true){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=shadow;m.receiveShadow=true;parent.add(m);return m}
function cylinder(parent,x,y,z,r1,r2,h,material,segments=12){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),material);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m}
function ground(){
 box(scene,0,-.18,0,150,.35,150,mat(0x777e78),false);
 box(scene,0,.005,0,12,.06,112,mats.asphalt,false);
 box(scene,-9,.02,0,5,.12,112,mats.sidewalk,false);box(scene,9,.02,0,5,.12,112,mats.sidewalk,false);
 box(scene,0,.04,0,.13,.02,105,mats.roadline,false);
 for(let z=-48;z<55;z+=8){box(scene,-3,.045,z,2.1,.02,.11,mats.roadline,false);box(scene,3,.045,z,2.1,.02,.11,mats.roadline,false)}
 for(const x of [-6.3,6.3])for(let z=-50;z<55;z+=8)box(scene,x,.11,z,.12,.1,3.6,mat(0x656d6d),false);
}
function makeBuilding(x,z,w,d,h,wall,seed=0){
 const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
 box(g,0,h/2,0,w,h,d,wall);
 box(g,0,h+.08,0,w+.3,.18,d+.3,mats.dark);
 const floors=Math.max(2,Math.floor(h/3.1)),cols=Math.max(2,Math.floor(w/2.8));
 for(let f=0;f<floors;f++)for(let c=0;c<cols;c++){
  const wx=-w/2+(c+.5)*w/cols,wy=1.35+f*2.7;
  if(wy>h-.7)continue;
  box(g,wx,wy,d/2+.018,w/cols*.55,1.35,.06,mats.glass,false);
  box(g,wx,wy+.73,d/2+.04,w/cols*.62,.09,.12,mats.concrete,false);
 }
 // storefront and recessed entrance
 if(h>7){box(g,0,1.7,d/2+.025,w*.28,2.9,.09,mats.dark,false);box(g,0,1.8,d/2+.085,w*.19,2.55,.04,mats.glass,false)}
 box(g,0,.22,0,w+.15,.35,d+.15,mats.concrete,false);
 // restrained facade details
 for(let k=0;k<3;k++)box(g,-w*.35+k*w*.35,h*.72,d/2+.08,.12,.55,.12,mats.amber,false);
 return g;
}
function tree(x,z,s=1){cylinder(scene,x,.9*s,z,.15*s,.23*s,1.8*s,mats.trunk);const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(1.1*s,1),mats.leaf);crown.position.set(x,2*s,z);crown.castShadow=true;scene.add(crown)}
function streetLamp(x,z){cylinder(scene,x,2.1,z,.07,.09,4.2,mat(0x343e42));box(scene,x+.55,4.1,z,.9,.08,.08,mat(0x343e42));const light=new THREE.PointLight(0xffd69a,.45,9);light.position.set(x+.9,3.9,z);scene.add(light)}
function car(x,z,color){const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);box(g,0,.65,0,2.05,.65,4,mat(color,.45));box(g,0,1.15,-.2,1.65,.65,2.05,mats.glass);for(const wx of [-.86,.86])for(const wz of [-1.25,1.25]){const w=cylinder(g,wx,.38,wz,.36,.36,.18,mat(0x171c20),16);w.rotation.z=Math.PI/2}}
function makePerson(x,z,shirt,pants,scale=1){
 const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
 const bodyMat=mat(shirt),legMat=mat(pants),skin=mat(0xc69b7a);
 const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.28*scale,.62*scale,4,8),bodyMat);torso.position.y=1.15*scale;torso.castShadow=true;g.add(torso);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.19*scale,12,10),skin);head.position.y=1.78*scale;head.castShadow=true;g.add(head);
 const legs=[];for(const dx of [-.13,.13]){const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.105*scale,.55*scale,3,7),legMat);leg.position.set(dx,.48*scale,0);g.add(leg);legs.push(leg)}
 const arms=[];for(const dx of [-.34,.34]){const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.09*scale,.48*scale,3,7),skin);arm.position.set(dx,1.2*scale,0);arm.rotation.z=dx>0?-.13:.13;g.add(arm);arms.push(arm)}
 return {group:g,legs,arms};
}
ground();
// A compact, authored city block with varied civic and commercial facades.
makeBuilding(-15,-7,13,15,17,mats.brick);makeBuilding(15,-8,13,16,22,mats.sand);
makeBuilding(-16,17,14,17,12,mats.blue);makeBuilding(16,18,14,16,15,mats.green);
makeBuilding(-15,-31,15,16,19,mats.sand);makeBuilding(15,-32,15,15,14,mats.brick);
makeBuilding(-31,-6,14,18,23,mats.blue);makeBuilding(31,-6,14,18,20,mats.sand);
makeBuilding(-31,22,14,16,13,mats.green);makeBuilding(31,22,14,16,18,mats.blue);
for(const x of [-8,8])for(const z of [-42,-26,-10,7,24,41]){streetLamp(x,z)}
for(const x of [-10,10])for(const z of [-38,-22,-4,14,34])tree(x,z,.9);
// Park-like community assembly plaza at the north end of the avenue.
box(scene,0,.08,-48,21,.16,15,mats.concrete,false);
box(scene,0,.18,-48,7,.08,5,mat(0x8b9d92),false);
for(const x of [-8,8])for(const z of [-52,-44])tree(x,z,.85);
box(scene,0,1.2,-54,7,2.3,.25,mats.dark);
box(scene,0,2.5,-54,7,.12,.4,mats.amber);
const signText=makePerson(0,0,0xffffff,0xffffff,.01);scene.remove(signText.group);
// Enterable community response center: open doorway, reception area and public seating.
const interiorFloor=mat(0x777d79),interiorWall=mat(0xc3c0b4),interiorTrim=mat(0x59666a);
box(scene,0,.12,-68,14,.24,18,interiorFloor,false);
box(scene,-7,4.2,-68,.35,8.4,18,interiorWall);
box(scene,7,4.2,-68,.35,8.4,18,interiorWall);
box(scene,0,4.2,-77,14,8.4,.35,interiorWall);
box(scene,-4.85,4.2,-59,4.3,8.4,.35,interiorWall);
box(scene,4.85,4.2,-59,4.3,8.4,.35,interiorWall);
const roofMat=new THREE.MeshStandardMaterial({color:0x89969a,transparent:true,opacity:.12,side:THREE.DoubleSide,roughness:1,depthWrite:false});
box(scene,0,8.35,-68,14,.18,18,roofMat,false);
box(scene,0,1.45,-70.8,5.4,1.15,1.15,interiorTrim);
box(scene,0,2.08,-70.8,5.5,.12,1.2,mats.amber,false);
for(const x of [-4.5,4.5]){box(scene,x,.65,-65,1.5,.25,2.2,interiorTrim);box(scene,x,.9,-65,1.5,.18,2.2,mats.concrete)}
for(const x of [-5.8,5.8]){box(scene,x,3.2,-64,1.2,1.7,.08,mats.glass,false);box(scene,x,4.08,-64,1.35,.12,.18,interiorTrim,false)}
const ceilingLight=new THREE.PointLight(0xffe2b8,1.5,18);ceilingLight.position.set(0,6.8,-67);scene.add(ceilingLight);
const interiorLabel=box(scene,0,2.8,-76.72,4.8,.8,.12,mats.dark,false);
box(scene,0,2.8,-76.62,3.9,.05,.05,mats.amber,false);
const cars=[{x:-4,z:5},{x:4,z:-26}];car(-4,5,0x52656a);car(4,-26,0x8a8172);
// Resident characters are distinct and visibly identifiable.
const residents=[
 {person:makePerson(-3.7,-5,0x9a715b,0x303d49),state:'waiting',name:'Maya Chen',need:'I am looking for my younger brother. I last saw him near the library.'},
 {person:makePerson(3.4,-14,0x667f86,0x4b4d49),state:'waiting',name:'Daniel Brooks',need:'I have a mobility concern and would appreciate someone walking with me.'},
 {person:makePerson(-2.7,-23,0x9b9b72,0x343c48),state:'waiting',name:'Elena Rivera',need:'I am worried about leaving my apartment unattended. I need clear information.'}
];
residents.forEach((r,i)=>{r.person.group.userData.resident=i});
const assembly=new THREE.Vector3(0,0,-49);
const ring=new THREE.Mesh(new THREE.RingGeometry(3.2,3.55,48),new THREE.MeshBasicMaterial({color:0x75d0b0,side:THREE.DoubleSide,transparent:true,opacity:.8}));
ring.rotation.x=-Math.PI/2;ring.position.set(0,.22,-48);scene.add(ring);
const beacon=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,4,12),new THREE.MeshBasicMaterial({color:0x7bd0b0,transparent:true,opacity:.24}));beacon.position.set(0,2.1,-48);scene.add(beacon);
const arrow=new THREE.Mesh(new THREE.ConeGeometry(.55,1.3,4),new THREE.MeshBasicMaterial({color:0xe7b65f}));arrow.rotation.x=Math.PI;arrow.position.set(0,4.4,-48);scene.add(arrow);

const scenarios={
 welfare:{title:'CIVIC QUARTER WELFARE CHECK',sector:'SPECIAL RESPONSE / SECTOR 04',lead:'Unit 04 is assigned to a residential welfare call in the Civic Quarter. Establish communications, identify the people involved, assess their needs and complete a documented, peaceful resolution.',description:'A resident welfare call. Speak with the people involved, verify information and arrange appropriate support.',event1:{id:'power',title:'DISPATCH / INFORMATION UPDATE 01',text:'Dispatch advises that the original caller information is incomplete. Confirm details directly and do not treat unverified information as fact.'},event2:{id:'medical',title:'WELFARE SUPPORT / UPDATE 02',text:'A person at the location may need additional assistance. Coordinate an appropriate welfare referral and record the outcome.'}},
 missing:{title:'CIVIC QUARTER MISSING PERSON',sector:'SPECIAL RESPONSE / SECTOR 04',lead:'Unit 04 is assigned to a missing-person follow-up in the Civic Quarter. Gather reliable information from people at the location, check welfare concerns and coordinate a clear handover.',description:'A missing-person follow-up. Gather reliable accounts, identify welfare needs and coordinate information with dispatch.',event1:{id:'power',title:'DISPATCH / INFORMATION UPDATE 01',text:'Dispatch has received a new but unconfirmed sighting. Record it as unverified until corroborated.'},event2:{id:'medical',title:'WELFARE SUPPORT / UPDATE 02',text:'A person connected to the call may need support. Coordinate a welfare referral and document the handover.'}},
 alarm:{title:'MARKET STREET ALARM CALL',sector:'SPECIAL RESPONSE / SECTOR 09',lead:'Unit 04 is assigned to a commercial alarm call on Market Street. Establish contact with the responsible parties, verify the available information and record a clear outcome.',description:'A commercial alarm call. Verify the report with responsible parties and preserve an accurate incident record.',event1:{id:'power',title:'DISPATCH / INFORMATION UPDATE 01',text:'The alarm provider cannot yet confirm the source of the alert. Keep the incident status pending verification.'},event2:{id:'medical',title:'SUPPORT REQUEST / UPDATE 02',text:'Dispatch advises that a staff member may require assistance. Coordinate a suitable support referral and record the result.'}}
}
let activeScenario=scenarios.welfare;
const scenarioSelect=document.querySelector('#scenario-select');
scenarioSelect?.addEventListener('change',()=>{activeScenario=scenarios[scenarioSelect.value]||scenarios.welfare;document.querySelector('#brief-lead').textContent=activeScenario.lead;document.querySelector('#scenario-description').textContent=activeScenario.description;document.querySelector('#mission-title').textContent=activeScenario.title;document.querySelector('#mission-subline').textContent=activeScenario.sector;});
let yaw=0,pitch=0,started=false,paused=false,complete=false,assisted=0,activeResident=null,selectedResident=null,dialogueOpen=false,radioReady=false,teamBriefed=false,radioEntries=[],missionStartElapsed=0,dispatchEventOne=false,dispatchEventTwo=false,activeDispatch=null,dispatchResolved=0,teamAssignments=[],teamActivities=[],briefingTask='Resident support',missionStartedAt=0,missionEndedAt=0,decisionScore=0,verifiedInfo=0,supportActions=0;
const keys={};const clock=new THREE.Clock();

const interaction=document.querySelector('#interaction');
const interactionText=document.querySelector('#interaction-text');
const briefing=document.querySelector('#briefing'),pauseScreen=document.querySelector('#pause'),completeScreen=document.querySelector('#complete');
const dialogue=document.querySelector('#dialogue'),dialogueName=document.querySelector('#dialogue-name'),dialogueLine=document.querySelector('#dialogue-line');
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1900)}
function logRadio(message){
 const stamp=document.querySelector('#clock')?.textContent||'08:42';
 radioEntries.push({time:stamp,message});
 updateHud();
}
function updateHud(){
 document.querySelector('#objective-count').innerHTML='People contacted <strong>'+assisted+' / 3</strong>';
 document.querySelector('#progress-fill').style.width=(assisted/3*100)+'%';
 residents.forEach((r,i)=>{
  const status=document.querySelector('#resident-status-'+i);
  const row=document.querySelector('#resident-row-'+i);
  if(!status||!row)return;
  const labels={waiting:'NOT YET CONTACTED',escorting:'ACCOMPANIED',safe:'SAFE / CONTACT COMPLETE'};
  status.textContent=labels[r.state]||'UNKNOWN';
  row.dataset.state=r.state;
 });
 const radioState=document.querySelector('#radio-state');
 const radioLog=document.querySelector('#radio-log');
 if(radioState){radioState.textContent=radioReady?'LINK ESTABLISHED':'AWAITING RADIO CHECK';radioState.classList.toggle('ready',radioReady)}
 if(radioLog)radioLog.textContent=radioReady?'UNIT 04: ON SCENE. DISPATCH CHANNEL OPEN.':'NO OUTBOUND REPORT RECORDED';
 const teamState=document.querySelector('#team-state');
 if(teamState){teamState.textContent=teamBriefed?'TEAM BRIEFED':'BRIEFING REQUIRED';teamState.classList.toggle('ready',teamBriefed)}
 const activity=document.querySelector('#team-activity');
 if(activity)activity.innerHTML=teamActivities.map((a,i)=>'<div class="team-activity-row"><b>'+a.name+'</b><span>'+a.status+'</span></div>').join('')||'<div class="radio-entry muted">AWAITING TEAM BRIEFING</div>';
 const log=document.querySelector('#radio-transcript');
 if(log)log.innerHTML=radioEntries.slice(-5).map(entry=>'<div class="radio-entry"><span>'+entry.time+'</span> '+entry.message+'</div>').join('')||'<div class="radio-entry muted">NO TRAFFIC LOGGED</div>';
 const eventPanel=document.querySelector('#dispatch-event');
 if(eventPanel)eventPanel.classList.toggle('hidden',!activeDispatch);
 const eventTitle=document.querySelector('#dispatch-event-title');
 const eventText=document.querySelector('#dispatch-event-text');
 if(activeDispatch&&eventTitle&&eventText){eventTitle.textContent=activeDispatch.title;eventText.textContent=activeDispatch.text}
 const eventCount=document.querySelector('#dispatch-count');
 if(eventCount)eventCount.textContent='UPDATES RESOLVED: '+dispatchResolved+'/2';
}
updateHud();
function start(){started=true;paused=false;missionStartedAt=performance.now();missionStartElapsed=clock.elapsedTime;logRadio('DISPATCH: Response scenario confirmed — '+activeScenario.title+'.');briefing.classList.add('hidden');pauseScreen.classList.add('hidden');renderer.domElement.requestPointerLock?.();clock.getDelta()}
document.querySelector('#start').addEventListener('click',start);
document.querySelector('#resume').addEventListener('click',()=>{paused=false;pauseScreen.classList.add('hidden');renderer.domElement.requestPointerLock?.()});
document.querySelector('#replay').addEventListener('click',()=>location.reload());
document.addEventListener('pointerlockchange',()=>{if(started&&!complete&&!dialogueOpen&&document.pointerLockElement!==renderer.domElement&&!paused){paused=true;pauseScreen.classList.remove('hidden')}});
document.addEventListener('mousemove',e=>{if(document.pointerLockElement===renderer.domElement){yaw-=e.movementX*.0022;pitch-=e.movementY*.0018;pitch=Math.max(-1.25,Math.min(1.25,pitch))}});
document.addEventListener('keydown',e=>{
 keys[e.code]=true;
 if(e.code==='Escape'&&dialogueOpen){closeDialogue();return}
 if(e.code==='Escape'&&started&&!complete){paused=true;pauseScreen.classList.remove('hidden')}
 if(e.code==='KeyR'&&started&&!paused&&!complete&&!radioReady){
  radioReady=true;logRadio('DISPATCH: Unit 04 radio check acknowledged. Channel open.');
  toast('Dispatch: radio check acknowledged. Unit 04 is on the incident channel.');
 }
 if(e.code==='KeyE'&&started&&!paused&&!complete)interact()
});
document.addEventListener('keyup',e=>keys[e.code]=false);
renderer.domElement.addEventListener('click',()=>{if(started&&!paused&&!complete&&document.pointerLockElement!==renderer.domElement)renderer.domElement.requestPointerLock?.()});
function openDialogue(r){
 if(!r||r.state!=='waiting')return;
 selectedResident=r;dialogueOpen=true;dialogueName.textContent=r.name.toUpperCase();
 dialogueLine.textContent=r.informed?'Thank you for explaining. What would you like me to do?':'Hello. I am not sure what is happening. Can you help me understand?';
 dialogue.classList.remove('hidden');interaction.classList.remove('visible');
}
function closeDialogue(){
 dialogueOpen=false;dialogue.classList.add('hidden');selectedResident=null;
 if(started&&!paused&&!complete)renderer.domElement.requestPointerLock?.();
}
function chooseDialogue(choice){
 const r=selectedResident;if(!r||r.state!=='waiting')return;
 if(choice==='explain'){
  r.informed=true;decisionScore+=1;supportActions++;dialogueLine.textContent='Unit 04 is following up on a call in this area. I can explain what is confirmed and what remains unknown.';
  toast('You explained the situation clearly.');
 }else if(choice==='needs'){
  r.needsDiscussed=true;decisionScore+=2;supportActions++;dialogueLine.textContent=r.need;
  toast('You listened to the resident.');
 }else if(choice==='guide'){
  if(!radioReady){dialogueLine.textContent='Before we move, please establish radio contact with dispatch. Press R to complete the radio check.';toast('Dispatch contact required before escort.');return}
  if(!teamBriefed){dialogueLine.textContent='The response team has not been briefed yet. Assign team roles and issue the briefing from the command panel first.';toast('Team briefing required before escort.');return}
  r.state='escorting';decisionScore+=1;supportActions++;logRadio('UNIT 04: '+r.name+' accepted voluntary assistance.');r.person.group.traverse(o=>{if(o.material?.color)o.material.color.set(0x79a995)});
  dialogueLine.textContent='Thank you. I will accompany you to the designated safe location.';
  toast(r.name+' accepted your offer to accompany them.');
  dialogueOpen=false;dialogue.classList.add('hidden');selectedResident=null;activeResident=null;
  if(started&&!paused&&!complete)renderer.domElement.requestPointerLock?.();
 }
}
function interact(){if(dialogueOpen){closeDialogue();return}if(activeResident)openDialogue(activeResident)}
document.querySelectorAll('.dialogue-choice').forEach(button=>button.addEventListener('click',()=>chooseDialogue(button.dataset.choice)));
document.querySelector('#dialogue-close').addEventListener('click',closeDialogue);

const briefButton=document.querySelector('#issue-briefing');
if(briefButton)briefButton.addEventListener('click',()=>{
 const roles=[...document.querySelectorAll('.team-role')].map(el=>el.value);
 const order=document.querySelector('#team-order')?.value||'Resident support';
 if(new Set(roles).size!==3){toast('Assign a different responsibility to each team member.');return}
 teamBriefed=true;teamAssignments=roles;briefingTask=order;
 teamActivities=[
  {name:'A. MORGAN',role:roles[0],status:'STANDING BY'},
  {name:'S. LEE',role:roles[1],status:'STANDING BY'},
  {name:'J. PATEL',role:roles[2],status:'STANDING BY'}
 ];
 const liaisonIndex=roles.findIndex(role=>role==='Resident liaison');
 const medicalIndex=roles.findIndex(role=>role==='Medical liaison');
 const coordinationIndex=roles.findIndex(role=>role==='Team coordination');
 if(liaisonIndex>=0)teamActivities[liaisonIndex].status='RESIDENT SUPPORT READY';
 if(medicalIndex>=0)teamActivities[medicalIndex].status='WELFARE COORDINATION READY';
 if(coordinationIndex>=0)teamActivities[coordinationIndex].status='DISPATCH COORDINATION READY';
 logRadio('UNIT 04: Team briefed. Roles: '+roles.join(', ')+'. Task: '+order+'.');
 updateHud();
 toast('Team briefing issued. Responsibilities recorded.');
});


function updateTeamActivities(){
 if(!teamBriefed)return;
 const waiting=residents.filter(r=>r.state==='waiting').length;
 teamActivities.forEach(member=>{
  if(member.role==='Resident liaison')member.status=waiting?'MONITORING '+waiting+' RESIDENT(S)':'RESIDENT SUPPORT COMPLETE';
  else if(member.role==='Medical liaison')member.status='WELFARE CHANNEL AVAILABLE';
  else if(member.role==='Team coordination')member.status=activeDispatch?'SUPPORTING DISPATCH RESPONSE':'COORDINATING UNIT';
 });
 updateHud();
}
function raiseDispatchEvent(event){
 if(activeDispatch||complete)return;
 activeDispatch=event;
 updateTeamActivities();
 logRadio('DISPATCH: '+event.title+' — '+event.text);
 updateHud();
 toast('New dispatch update received.');
}
function resolveDispatch(choice){
 if(!activeDispatch)return;
 const event=activeDispatch;
 if(event.id==='power'){
  const message=choice==='verify'?'UNIT 04: Information remains UNCONFIRMED and will be recorded as such.':'UNIT 04: Requested a corroborating update from dispatch.';
  logRadio(message);decisionScore+=choice==='verify'?2:1;if(choice==='verify')verifiedInfo++;
 }else if(event.id==='medical'){
  const message=choice==='assign'?'UNIT 04: Medical liaison assigned to coordinate the welfare referral.':'UNIT 04: Welfare concern acknowledged; support needs will be monitored.';
  logRadio(message);decisionScore+=choice==='assign'?2:1;if(choice==='assign'){const m=teamActivities.find(a=>a.role==='Medical liaison');if(m)m.status='WELFARE CHECK COORDINATED'}
 }
 dispatchResolved++;
 activeDispatch=null;
 updateTeamActivities();
 updateHud();
 toast('Dispatch update acknowledged.');
 if(started&&!complete){paused=false;pauseScreen.classList.add('hidden');renderer.domElement.requestPointerLock?.()}
}
document.querySelector('#dispatch-choice-a')?.addEventListener('click',()=>resolveDispatch('verify'));
document.querySelector('#dispatch-choice-b')?.addEventListener('click',()=>{
 const id=activeDispatch?.id;
 resolveDispatch(id==='medical'?'assign':'request');
});

function nearestResident(){let nearest=null,dist=3.4;for(const r of residents){if(r.state!=='waiting')continue;const d=camera.position.distanceTo(r.person.group.position);if(d<dist){dist=d;nearest=r}}return nearest}
function update(dt,t){
 const missionSeconds=t-missionStartElapsed;
 if(radioReady&&teamBriefed&&!dispatchEventOne&&missionSeconds>=25&&!activeDispatch){
  dispatchEventOne=true;
  raiseDispatchEvent(activeScenario.event1);
 }
 if(radioReady&&teamBriefed&&dispatchEventOne&&!dispatchEventTwo&&missionSeconds>=65&&!activeDispatch){
  dispatchEventTwo=true;
  raiseDispatchEvent(activeScenario.event2);
 }
 const forward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));
 const right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));
 const move=new THREE.Vector3();
 if(keys.KeyW||keys.ArrowUp)move.add(forward);
 if(keys.KeyS||keys.ArrowDown)move.sub(forward);
 if(keys.KeyD||keys.ArrowRight)move.add(right);
 if(keys.KeyA||keys.ArrowLeft)move.sub(right);
 if(move.lengthSq()>0&&!dialogueOpen){
  move.normalize().multiplyScalar((keys.ShiftLeft||keys.ShiftRight?5.0:3.15)*dt);
  // Resolve movement per axis so the player cannot pass through parked vehicles.
  const nextX=camera.position.x+move.x,nextZ=camera.position.z+move.z;
  const blockedCar=(x,z)=>cars.some(c=>Math.abs(x-c.x)<1.35&&Math.abs(z-c.z)<2.35);
  const blocked=(x,z)=>blockedCar(x,z)||
   (((camera.position.z>-59.7&&z<=-59.7)||(camera.position.z<=-59.7&&z>-59.7))&&Math.abs(x)>2.55)||
   (z<-59&&z>-77.5&&Math.abs(x)>6.35)||
   (z<=-77.5&&Math.abs(x)<6.7)||
   (Math.abs(x)<3.15&&Math.abs(z+70.8)<1.25);
  if(!blocked(nextX,camera.position.z))camera.position.x=nextX;
  if(!blocked(camera.position.x,nextZ))camera.position.z=nextZ;
 }
 camera.position.x=THREE.MathUtils.clamp(camera.position.x,-6.1,6.1);
 camera.position.z=THREE.MathUtils.clamp(camera.position.z,-82,52);
 camera.position.y=1.72;
 camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch;
 activeResident=dialogueOpen?null:nearestResident();
 if(activeResident){interaction.classList.add('visible');interactionText.textContent='TALK · '+activeResident.name.toUpperCase()}else interaction.classList.remove('visible');
 residents.forEach((r,i)=>{
 const g=r.person.group;let walking=false;
 if(r.state==='escorting'){
  // Residents follow the player in a loose, readable formation instead of
  // teleporting toward the destination. The player must lead them to the plaza.
  const forward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));
  const right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));
  const target=camera.position.clone().sub(forward.clone().multiplyScalar(1.8+Math.floor(i/2)*.85));
  target.add(right.multiplyScalar((i-1)*.8));
  const dir=target.sub(g.position);dir.y=0;
  const distance=dir.length();
  if(distance>1.15){dir.normalize();g.position.addScaledVector(dir,Math.min(1.75*dt,distance-1.05));g.rotation.y=Math.atan2(dir.x,dir.z);walking=true}
  const atPlaza=camera.position.distanceTo(assembly)<4.2&&g.position.distanceTo(assembly)<5.8;
  if(atPlaza){
   r.state='safe';assisted++;decisionScore+=2;updateTeamActivities();logRadio('UNIT 04: '+r.name+' arrived at the community plaza.');updateHud();toast(r.name+' has arrived at the community plaza.');
   if(assisted===3){
    complete=true;
    const thoughtfulSupport=residents.filter(person=>person.informed&&person.needsDiscussed).length;
    missionEndedAt=performance.now();
    const rating=!radioReady?'COMMS INCOMPLETE':thoughtfulSupport===3&&dispatchResolved===2&&decisionScore>=16?'EXCELLENT':thoughtfulSupport>=1&&dispatchResolved>=1?'COMMENDABLE':'COMPLETED';
    const duration=Math.max(0,Math.round((missionEndedAt-missionStartedAt)/1000));
    const mins=String(Math.floor(duration/60)).padStart(2,'0'),secs=String(duration%60).padStart(2,'0');
    const report=document.querySelector('#report-details');
    if(report)report.innerHTML='<div><span>MISSION TIME</span><b>'+mins+':'+secs+'</b></div><div><span>DECISION SCORE</span><b>'+decisionScore+'</b></div><div><span>DISPATCH UPDATES</span><b>'+dispatchResolved+'/2</b></div><div><span>VERIFIED INFORMATION</span><b>'+verifiedInfo+'</b></div><div><span>SUPPORT ACTIONS</span><b>'+supportActions+'</b></div><div><span>RESIDENTS SAFE</span><b>'+assisted+'/3</b></div>';
    setTimeout(()=>{completeScreen.classList.remove('hidden');document.exitPointerLock?.();document.querySelector('#final-count').textContent='03 / 03';document.querySelector('#final-rating').textContent=rating},800)
   }
  }
 }else if(r.state==='waiting'){g.rotation.y=Math.sin(t*.35+i)*.12}
 r.person.legs.forEach((leg,j)=>{leg.rotation.x=walking?Math.sin(t*7+j*Math.PI)*.35:Math.sin(t*1.2+j)*.025});
});
 ring.material.opacity=.55+Math.sin(t*2)*.2;arrow.position.y=4.2+Math.sin(t*2)*.18;
 document.querySelector('#clock').textContent=new Date(8*3600*1000+42*60000+Math.floor(t*1000)).toISOString().slice(11,19);
 const z=camera.position.z;document.querySelector('#location').textContent=z<-59&&z>-79?'CIVIC QUARTER / COMMUNITY RESPONSE CENTER':z<-38?'CIVIC QUARTER / COMMUNITY PLAZA':z<-15?'CIVIC QUARTER / NORTH AVENUE':z<8?'CIVIC QUARTER / EAST AVENUE':'CIVIC QUARTER / SOUTH AVENUE';
}
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04),t=clock.elapsedTime;if(started&&!paused&&!complete)update(dt,t);renderer.render(scene,camera)}
animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.8))});
