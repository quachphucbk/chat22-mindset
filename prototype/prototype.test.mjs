// Chạy: node prototype.test.mjs
// Kiểm thử logic bằng DOM giả lập; không thay thế kiểm thử trình duyệt.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Blob } from 'node:buffer';

const html = fs.readFileSync(fileURLToPath(new URL('./index.html', import.meta.url)), 'utf8');
const source = Array.from(html.matchAll(/<script>([\s\S]*?)<\/script>/g), m => m[1]).join('\n');
new vm.Script(source);
const elements = {}, timers = [], listeners = {}, saved = {};
function element(id) {
  return elements[id] ||= {
    id, innerHTML: '', hidden: false, open: false, className: '', dataset: {}, values: {},
    classList: { toggle() {}, add() {}, remove() {} },
    addEventListener() {}, append() {}, remove() {}, focus() {}, scrollIntoView() {},
    querySelector() { return null; },
    showModal() { this.open = true; }, close() { this.open = false; },
    getBoundingClientRect() { return { left: 0, top: 0, right: 100, bottom: 100 }; }
  };
}
const context = vm.createContext({
  Intl, Date, Math, JSON, Set, Map, Object, Array, String, Number, Boolean, RegExp, Error, Blob, URL,
  FormData: class {
    constructor(form) { this.data = form.values || {}; }
    get(key) { return this.data[key] ?? null; }
    getAll(key) { return Array.isArray(this.data[key]) ? this.data[key] : [this.data[key]].filter(Boolean); }
  },
  localStorage: { getItem: k => saved[k] ?? null, setItem: (k, v) => { saved[k] = v; } },
  document: {
    body: { classList: { toggle() {} } }, getElementById: element,
    createElement: () => element('generated-' + Math.random()), querySelector() { return null; },
    addEventListener: (name, handler) => { (listeners[name] ||= []).push(handler); }
  },
  window: { scrollTo() {} },
  setTimeout: fn => { timers.push(fn); return timers.length; }, requestAnimationFrame: fn => fn()
});
vm.runInContext(source, context);
const run = code => vm.runInContext(code, context);
const reset = () => { run("db=initial();Object.assign(ui,{page:'tasks',modal:null,busy:false,analysis:null,failNext:false,selectedConv:'launch',detailTab:'overview',importPreview:null,importDraft:'',importMode:'text',scope:'team',tab:'confirmed',search:'',owner:'',status:'',due:'',conv:'',reviewFilter:'pending',note:null,highlight:null});analysisToken++;render()"); timers.length = 0; };
const click = (act, id = '') => listeners.click[0]({ target: { closest: () => ({ dataset: { act, id } }) } });
const flush = () => { while (timers.length) timers.shift()(); };
const results = [];
function test(name, check) {
  reset();
  try { check(); results.push({ name, passed: true }); }
  catch (error) { results.push({ name, passed: false, error: error.message }); }
}
const ok = code => assert.equal(run(code), true);
test('Cú pháp và HTML tự chứa', () => {
  assert.match(html, /<html lang="vi">/);
  assert.doesNotMatch(html, /<script[^>]+src=|<link[^>]+href=["']https?:/);
});
test('Bảy màn hình render ở cả bốn tài khoản demo', () => ok("PEOPLE.every(user=>{db.user=user;return ['tasks','conversations','review','reminders','evaluation','guide','confirmations'].every(page=>{ui.page=page;render();return document.getElementById('app').innerHTML.length>3000})})"));
test('Mười một ghi chú có đủ trường và bật mặc định', () => ok("db.notes&&Object.keys(NOTES).length===11&&Object.values(NOTES).every(n=>n.length===6&&n.every(Boolean))"));
test('Bảng đối chiếu đủ FR, FR10s và BR', () => ok("FR.length===11&&FR.some(r=>r[0]==='FR10s')&&BR.length===14"));
test('Đồng hồ quá hạn cố định', () => ok("visibleTasks().filter(overdue).length===1&&overdue(db.tasks.find(t=>t.id==='T-004'))"));
test('Chưa duyệt không đổi deadline', () => ok("db.tasks[0].due==='2026-11-20T17:00:00+07:00'&&db.proposals[0].due==='2026-11-23T17:00:00+07:00'"));
test('Duyệt cập nhật, giữ giờ nhắc và yêu cầu rà soát', () => ok("approveProposal('Q-001')&&db.tasks[0].due==='2026-11-23T17:00:00+07:00'&&db.reminders[0].review&&db.reminders[0].at==='2026-11-20T09:00:00+07:00'"));
test('Lịch sử trước/sau và quyết định cũ', () => ok("(()=>{approveProposal('Q-001');const t=db.tasks[0],h=t.history.at(-1);return h.before.due.includes('20T17')&&h.after.due.includes('23T17')&&effectiveAt(t,1).due.includes('20T17')&&effectiveAt(t,2).due.includes('23T17')})()"));
test('Không duyệt hai lần', () => ok("approveProposal('Q-001')&&!approveProposal('Q-001')"));
test('Không tự đoán Mai, người và ngày', () => ok("!approveProposal('Q-002')&&!db.proposals[1].owner&&!db.proposals[1].due&&!dialogContent('clarify','Q-002').includes('value=\"person\" checked')"));
test('Làm rõ chưa đủ vẫn không thể xác nhận', () => ok("(()=>{const p=db.proposals[1];p.owner='Mai';p.clarified=true;return !approveProposal(p.id)&&!p.due})()"));
test('Thông tin bổ sung được giữ trên task', () => ok("(()=>{const p=db.proposals[1];p.owner='Mai';p.due='2026-11-17T16:00:00+07:00';p.clarified=true;p.manual=['Người phụ trách','Thời hạn'];return approveProposal(p.id)&&getTask(p.taskId).manual.length===2})()"));
test('Tạo việc đầu cuối từ phân tích', () => ok("(()=>{startScenario('clear',true);const before=db.tasks.length,r=analyzeConversation('sample-clear'),p=db.proposals.find(p=>p.conv==='sample-clear');return r.added===1&&db.tasks.length===before&&approveProposal(p.id)&&db.tasks.length===before+1})()"));
test('Phân tích lặp không trùng task, đề xuất, nhắc', () => ok("(()=>{startScenario('dedup',true);analyzeConversation('sample-dedup');const p=db.proposals.find(p=>p.conv==='sample-dedup');approveProposal(p.id);const before=[db.tasks.length,db.proposals.length,db.reminders.length].join();analyzeConversation('sample-dedup');analyzeConversation('sample-dedup');return before===[db.tasks.length,db.proposals.length,db.reminders.length].join()})()"));
test('Đan xen: API hoàn thành, giao diện không đổi', () => ok("(()=>{startScenario('mixed',true);analyzeConversation('sample-mixed');const ps=db.proposals.filter(p=>p.conv==='sample-mixed');return ps.length===2&&ps.find(p=>p.kind==='deadline').due===null&&approveProposal(ps.find(p=>p.kind==='complete').id)&&getTask('T-mixed-api').status==='Hoàn thành'&&getTask('T-mixed-ui').status==='Đang thực hiện'})()"));
test('Đổi người chỉ sau duyệt', () => ok("(()=>{startScenario('owner',true);analyzeConversation('sample-owner');const p=db.proposals.find(p=>p.conv==='sample-owner');return getTask(p.taskId).owner==='Nam'&&approveProposal(p.id)&&getTask(p.taskId).owner==='Bình'})()"));
test('Hủy chỉ sau duyệt', () => ok("(()=>{startScenario('cancel',true);analyzeConversation('sample-cancel');const p=db.proposals.find(p=>p.conv==='sample-cancel');return getTask(p.taskId).status==='Đang thực hiện'&&approveProposal(p.id)&&getTask(p.taskId).status==='Đã hủy'})()"));
test('Trao đổi thường không tạo task', () => ok("(()=>{startScenario('ordinary',true);const n=db.tasks.length,r=analyzeConversation('sample-ordinary');return r.added===0&&r.text.includes('Không phát hiện công việc')&&db.tasks.length===n})()"));
test('Bác bỏ có lý do và giữ thông tin hiện hành', () => ok("(()=>{const before=JSON.stringify(snap(db.tasks[0]));return rejectProposal('Q-001','Chưa đủ cơ sở')&&JSON.stringify(snap(db.tasks[0]))===before&&db.tasks[0].history.at(-1).type==='Bị bác bỏ'&&db.proposals[0].rejectReason==='Chưa đủ cơ sở'})()"));
test('Nam không thấy task, nguồn và đề xuất ngoài phạm vi', () => ok("(()=>{db.user='Nam';return visibleTasks().length===2&&!getTask('T-004')&&!getConv('brand')&&!getProposal('Q-003')&&!renderConversations().includes('Nội dung &amp; thương hiệu')})()"));
test('Nam không thể duyệt hoặc gửi nhắc', () => ok("(()=>{db.user='Nam';return !approveProposal('Q-001')&&!changeReminder('R-001','approve')&&!changeReminder('R-001','send')})()"));
test('Từ chối tài nguyên không lộ tiêu đề hoặc nội dung', () => ok("(()=>{const s=dialogContent('access');return s.includes('không có quyền')&&!s.includes('nhóm B')&&!s.includes('Nội dung &amp; thương hiệu')})()"));
test('Nhắc chưa duyệt không gửi', () => ok("!changeReminder('R-001','send')&&db.reminders[0].status==='Chờ duyệt'"));
test('Nhắc được duyệt rồi gửi mô phỏng đúng giờ', () => ok("changeReminder('R-001','approve')&&changeReminder('R-001','send')&&db.reminders[0].status==='Đã gửi mô phỏng'&&db.reminders[0].sentAt===db.reminders[0].at"));
test('Sửa nhắc đưa về chờ duyệt', () => ok("(()=>{changeReminder('R-001','approve');const r=db.reminders[0];return storeReminder({taskId:r.taskId,recipient:r.recipient,at:r.at,content:'Nội dung mới'},r.id)&&r.status==='Chờ duyệt'&&!changeReminder(r.id,'send')})()"));
test('Không tạo nhắc trùng hoặc thời điểm không hợp lệ', () => ok("(()=>{const r=db.reminders[0],a={taskId:r.taskId,recipient:r.recipient,at:r.at,content:r.content};return !storeReminder(a)&&!storeReminder({...a,at:'invalid'})&&!storeReminder({...a,at:'2026-11-15T09:00:00+07:00'})})()"));
test('Hủy nhắc không cho gửi lại', () => ok("changeReminder('R-001','cancel')&&!changeReminder('R-001','send')"));
test('Chỉ tạo nhắc cho task đã xác nhận đang hoạt động', () => ok("!storeReminder({taskId:'Q-002',recipient:'Nam',at:'2026-11-18T09:00:00+07:00',content:'Nhắc'})&&!storeReminder({taskId:'T-005',recipient:'Lan',at:'2026-11-18T09:00:00+07:00',content:'Nhắc'})"));
test('Sửa nguồn đánh dấu task và nhắc cần rà soát', () => ok("changeSource('T-001','L01','Nguồn đã được sửa')&&db.tasks[0].review&&db.reminders[0].review"));
test('Xóa nguồn chặn duyệt bằng chứng cũ', () => ok("changeSource('T-001','L02','',true)&&!approveProposal('Q-001')"));
test('Nhắc cần rà soát không được duyệt/gửi', () => ok("(()=>{changeSource('T-001','L01','Nguồn sửa');return !changeReminder('R-001','approve')&&!changeReminder('R-001','send')})()"));
test('Trạng thái tải, lỗi và thử lại không mất task', () => {
  run("startScenario('failure',true);startAnalysis()"); ok('ui.busy===true');
  flush(); ok("!ui.busy&&ui.analysis.type==='error'&&db.tasks.length===5");
  run('startAnalysis()'); flush(); ok("ui.analysis.type==='success'&&db.tasks.length===5&&db.proposals.some(p=>p.conv==='sample-failure')");
});
test('Đổi vai trò khi đang xử lý hủy kết quả cũ', () => {
  run("startScenario('clear',true);startAnalysis()"); click('set-role', 'Nam'); flush();
  ok("db.user==='Nam'&&!ui.busy&&!db.proposals.some(p=>p.conv==='sample-clear')");
});
test('Kịch bản đặt lại độc lập', () => ok("(()=>{startScenario('clear',true);analyzeConversation('sample-clear');const p=db.proposals.find(p=>p.conv==='sample-clear');approveProposal(p.id);startScenario('ordinary',true);const count=db.tasks.length;startScenario('ordinary',true);return db.tasks.length===count&&db.tasks.some(t=>t.conv==='sample-clear')})()"));
test('JSON hợp lệ giữ ID, thời gian và replyTo', () => ok("(()=>{const a=m('J-A','Lan',SAMPLE_TEXT.report),b=m('J-B','Nam','Đã nhận','08:31','J-A');const r=parseImport(JSON.stringify({messages:[a,b]}),'json');return r.messages.length===2&&r.messages[1].replyTo==='J-A'})()"));
test('JSON sai định dạng, thiếu trường, trùng ID, thời gian và replyTo', () => {
  for (const input of ['{bad', '[{"id":"X"}]', JSON.stringify([{ id:'X',sender:'Lan',text:'a',time:run('DEMO_NOW') },{ id:'X',sender:'Nam',text:'b',time:run('DEMO_NOW') }]), JSON.stringify([{id:'X',sender:'Lan',text:'a',time:'bad'}]),JSON.stringify([{id:'X',sender:'Lan',text:'a',time:run('DEMO_NOW'),replyTo:'missing'}])]) {
    context.badInput=input; assert.throws(()=>run("parseImport(badInput,'json')"));
  }
});
test('Nhập văn bản kiểm tra cấu trúc', () => {
  ok("parseImport('Lan: '+SAMPLE_TEXT.report,'text').messages.length===1");
  assert.throws(()=>run("parseImport('văn bản không có người gửi','text')"));
});
test('ID nguồn đã nhập không tạo hội thoại trùng', () => ok("parseImport(JSON.stringify({messages:db.conversations[0].messages}),'json').existingConv==='launch'"));
test('Nguồn xung đột ID bị từ chối', () => assert.throws(()=>run("parseImport(JSON.stringify({messages:[{...db.conversations[0].messages[0],text:'Dữ liệu khác'}]}),'json')")));
test('Văn bản ngoài bộ mẫu không giả vờ có AI', () => ok("(()=>{db.conversations.push({id:'custom',title:'Thử',topic:'Thử',members:PEOPLE,persist:false,messages:[m('X','Lan','Văn bản tùy ý ngoài bộ mẫu')]});const before=db.proposals.length,r=analyzeConversation('custom');return r.type==='limit'&&r.added===0&&db.proposals.length===before&&r.text.includes('không thực hiện phân tích AI thật')})()"));
test('Dữ liệu nhập riêng không lưu localStorage', () => {
  run("db.conversations.push({id:'private-import',title:'BÍ MẬT NHẬP THỬ',members:PEOPLE,persist:false,messages:[m('PRIVATE-1','Lan','NỘI DUNG RIÊNG')]});db.lastAnalysis['private-import']='RIÊNG';save()");
  assert.doesNotMatch(saved['chat22-prototype-v3'], /BÍ MẬT NHẬP THỬ|NỘI DUNG RIÊNG|private-import/);
});
test('Nguồn mở đúng hội thoại và ID highlight', () => { click('evidence', 'product|P05'); ok("ui.page==='conversations'&&ui.selectedConv==='product'&&ui.highlight==='P05'&&renderConversations().includes('message highlight')"); });
test('Tìm kiếm, trạng thái, người, hạn, hội thoại và trạng thái rỗng', () => {
  ok("(()=>{ui.owner='Nam';ui.status='Đang thực hiện';ui.due='week';ui.conv='launch';ui.search='báo cáo';const s=renderInbox();return s.includes('Hiển thị 1 / 5')&&!s.includes('data-id=\"T-003\"')})()");
  ok("(()=>{ui.search='không tồn tại';return renderInbox().includes('Không tìm thấy công việc')})()");
  ok("(()=>{db.tasks=[];ui.search='';return renderInbox().includes('Chưa có công việc ở đây')})()");
});
test('Chỉ số tính đúng từ nhãn', () => ok("(()=>{const a=metrics();return a.tp===4&&a.fp===1&&a.fn===1&&a.p===.8&&a.r===.8&&a.f===.8})()"));
test('Các hộp thoại chính render', () => ok("[['role',''],['access',''],['reset',''],['scenarios',''],['proposal','Q-001'],['clarify','Q-002'],['edit-proposal','Q-001'],['reject','Q-001'],['request-clarify','Q-001'],['detail','T-001'],['new-reminder','T-001'],['edit-reminder','R-001'],['source','T-001'],['review-source','T-001'],['import',''],['eval-sample','E04']].every(([type,id])=>dialogContent(type,id).includes('dialog-title'))"));
test('Nội dung nhập được escape khi hiển thị', () => ok("esc('<img src=x onerror=alert(1)>').startsWith('&lt;')&&!messageHTML(m('X','Lan','<script>alert(1)<'+ '/script>'),'launch').includes('<script>')"));
test('Đối chiếu lại đề xuất cũ sau khi trạng thái gốc đổi', () => ok("(()=>{db.tasks[0].status='Chưa bắt đầu';const c=getConv('launch');analyzeConversation(c.id);const p=getProposal('Q-001');return p.baseSnapshot.status==='Chưa bắt đầu'&&p.taskStatus==='Chưa bắt đầu'&&p.status==='Cần làm rõ'})()"));
test('Đặt lại demo có bước xác nhận riêng', () => {
  run("db.tasks.pop()"); click('reset'); ok("db.tasks.length===4&&ui.modal.type==='reset'");
  click('confirm-reset'); ok("db.tasks.length===5&&db.proposals.length===4&&db.reminders.length===1");
});

// FR10s: dùng cùng store, bộ phân quyền và router với prototype thật.
test('FR10s: migrate dữ liệu cũ không mất task hoặc đề xuất', () => ok("(()=>{const tasks=db.tasks.length,proposals=db.proposals.length;delete db.manualRequests;delete db.notifications;delete db.manualSeq;ensureManualState();return tasks===db.tasks.length&&proposals===db.proposals.length&&db.manualRequests.length===0&&db.notifications.length===0})()"));
test('FR10s: nút tạo tại Inbox và từng tin nhắn', () => ok("renderInbox().includes('Thêm công việc')&&messageHTML(getConv('launch').messages[0],'launch').includes('Tạo công việc từ tin nhắn')&&renderConfirmations().includes('Chờ xác nhận')"));
test('FR10s: Nam tạo, Lan nhận đúng thông báo, chưa vào Inbox', () => ok("(()=>{db.user='Nam';const r=sendManualRequest({title:'Kiểm tra API',owner:'Nam'});const before=db.tasks.length;if(!r||r.confirmer!=='Lan'||r.due!==null||r.status!=='Chờ xác nhận'||manualNotifications().length)return false;db.user='Lan';return unreadManualCount()===1&&manualActions()[0].id===r.id&&db.tasks.length===before&&r.origin==='Người dùng tạo thủ công'})()"));
test('FR10s: Lan đồng ý việc Nam tạo, không tự tạo reminder', () => ok("(()=>{db.user='Nam';const r=sendManualRequest({title:'Kiểm tra API',owner:'Nam'}),count=db.reminders.length;db.user='Lan';return decideManual(r.id,'accept','',r.revision)&&r.status==='Đã xác nhận'&&getTask(r.taskId).title==='Kiểm tra API'&&getTask(r.taskId).due===null&&getTask(r.taskId).createdBy==='Nam'&&getTask(r.taskId).confirmedBy==='Lan'&&db.reminders.length===count})()"));
test('FR10s: trưởng nhóm giao Nam cần Nam xác nhận nhận việc', () => ok("(()=>{const r=sendManualRequest({title:'Hoàn thiện giao diện',owner:'Nam',due:'2026-11-18T17:00:00+07:00'});return r.confirmer==='Nam'&&!decideManual(r.id,'accept','',1)&&!r.taskId})()"));
test('FR10s: luồng Nam đề nghị sửa → Lan gửi lại → Nam đồng ý', () => ok("(()=>{const r=sendManualRequest({title:'Hoàn thiện giao diện',owner:'Nam',due:'2026-11-18T17:00:00+07:00'});db.user='Nam';if(!decideManual(r.id,'change','Đề nghị dời sang 20/11/2026.',1)||r.status!=='Cần chỉnh sửa')return false;db.user='Lan';if(!unreadManualCount()||!sendManualRequest({title:r.title,description:r.description,owner:r.owner,due:'2026-11-20T17:00:00+07:00'},r.id,1)||r.status!=='Chờ xác nhận'||r.revision!==2)return false;db.user='Nam';return decideManual(r.id,'accept','',2)&&getTask(r.taskId).due==='2026-11-20T17:00:00+07:00'&&r.history.some(h=>h.reason.includes('20/11'))&&getTask(r.taskId).confirmedBy==='Nam'})()"));
test('FR10s: tự duyệt và trưởng nhóm tự giao bị chặn', () => ok("(()=>{if(sendManualRequest({title:'Tự giao',owner:'Lan'}))return false;db.user='Nam';const r=sendManualRequest({title:'Việc Nam tạo',owner:'Nam'});return !decideManual(r.id,'accept','',1)&&r.status==='Chờ xác nhận'})()"));
test('FR10s: bắt buộc tên và người phụ trách, deadline tùy chọn', () => ok("!sendManualRequest({title:'',owner:'Nam'})&&!sendManualRequest({title:'Việc thiếu người'})&&!sendManualRequest({title:'Ngày sai',owner:'Nam',due:'bad'})&&!!sendManualRequest({title:'Chưa có deadline',owner:'Nam',due:null})"));
test('FR10s: lý do bắt buộc cho đề nghị sửa và từ chối', () => ok("(()=>{const r=sendManualRequest({title:'Kiểm tra',owner:'Nam'});db.user='Nam';return !decideManual(r.id,'change',' ',1)&&!decideManual(r.id,'reject','',1)&&r.status==='Chờ xác nhận'&&db.tasks.length===5})()"));
test('FR10s: từ chối giữ lý do, không tạo task và báo người tạo', () => ok("(()=>{const r=sendManualRequest({title:'Việc không nhận',owner:'Nam'});db.user='Nam';if(!decideManual(r.id,'reject','Chưa đủ thời gian.',1)||r.status!=='Bị từ chối'||r.taskId)return false;db.user='Lan';return manualNotifications().some(n=>n.kind==='reject')&&r.history.at(-1).reason==='Chưa đủ thời gian.'&&db.tasks.length===5})()"));
test('FR10s: chỉ người tạo sửa, người ngoài không đọc hay xác nhận', () => ok("(()=>{const r=sendManualRequest({title:'Việc Nam nhận',owner:'Nam'});db.user='Bình';if(getManual(r.id)||manualNotifications().length||decideManual(r.id,'accept','',1))return false;db.user='Nam';return !sendManualRequest({title:'Người khác sửa',owner:'Nam'},r.id,1)})()"));
test('FR10s: chặn nút đồng ý của phiên bản cũ', () => ok("(()=>{const r=sendManualRequest({title:'Bản đầu',owner:'Nam'});sendManualRequest({title:'Bản thứ hai',owner:'Nam'},r.id,1);db.user='Nam';return !decideManual(r.id,'accept','',1)&&decideManual(r.id,'accept','',2)&&db.tasks.length===6})()"));
test('FR10s: sửa sau xác nhận giữ bản có hiệu lực đến khi duyệt lại', () => ok("(()=>{const r=sendManualRequest({title:'Bản đã chốt',owner:'Nam',due:'2026-11-18T17:00:00+07:00'});db.user='Nam';decideManual(r.id,'accept','',1);const id=r.taskId;db.user='Lan';sendManualRequest({title:'Bản được sửa',owner:'Nam',due:'2026-11-20T17:00:00+07:00'},r.id,1);if(getTask(id).title!=='Bản đã chốt'||getTask(id).confirmedRevision!==1||r.status!=='Chờ xác nhận')return false;db.user='Nam';return decideManual(r.id,'accept','',2)&&getTask(id).title==='Bản được sửa'&&getTask(id).confirmedRevision===2&&db.tasks.length===6})()"));
test('FR10s: từ chối bản sửa không xóa công việc đã chốt', () => ok("(()=>{const r=sendManualRequest({title:'Việc hiện hành',owner:'Nam'});db.user='Nam';decideManual(r.id,'accept','',1);db.user='Lan';sendManualRequest({title:'Bản sửa bị từ chối',owner:'Nam'},r.id,1);db.user='Nam';return decideManual(r.id,'reject','Giữ tên ban đầu.',2)&&getTask(r.taskId).title==='Việc hiện hành'&&getTask(r.taskId).confirmationStatus==='Đã xác nhận'})()"));
test('FR10s: sửa lại cần xác nhận, deadline thay đổi đánh dấu reminder', () => ok("(()=>{const r=sendManualRequest({title:'Kiểm tra',owner:'Nam',due:'2026-11-18T17:00:00+07:00'});db.user='Nam';decideManual(r.id,'accept','',1);db.user='Lan';storeReminder({taskId:r.taskId,recipient:'Nam',at:'2026-11-17T09:00:00+07:00',content:'Nhắc kiểm tra'});const reminder=db.reminders.at(-1);changeReminder(reminder.id,'approve');sendManualRequest({title:r.title,owner:r.owner,due:'2026-11-20T17:00:00+07:00'},r.id,1);if(reminder.review)return false;db.user='Nam';decideManual(r.id,'accept','',2);return reminder.review&&reminder.at==='2026-11-17T09:00:00+07:00'&&db.reminders.length===2})()"));
test('FR10s: lưu phiên và thông báo đúng tài khoản sau tải lại', () => ok("(()=>{db.user='Nam';const r=sendManualRequest({title:'Kiểm tra API',owner:'Nam'});save();db=JSON.parse(localStorage.getItem(STORAGE));db.user='Lan';return getManual(r.id).creator==='Nam'&&unreadManualCount()===1&&decideManual(r.id,'accept','',1)})()"));
test('FR10s: không gửi trùng bằng cùng khóa biểu mẫu', () => ok("(()=>{const a={title:'Kiểm tra API',owner:'Nam',submissionKey:'FORM-1'};return !!sendManualRequest(a)&&!sendManualRequest(a)&&db.manualRequests.length===1&&db.notifications.length===1})()"));
test('FR10s: không xác nhận hai lần cùng yêu cầu', () => ok("(()=>{const r=sendManualRequest({title:'Một việc',owner:'Nam'});db.user='Nam';return decideManual(r.id,'accept','',1)&&!decideManual(r.id,'accept','',1)&&db.tasks.length===6})()"));
test('FR10s: tạo từ tin nhắn tự gắn nguồn, truy vết đúng nguồn', () => {
  click('manual-from-message','product|P02'); ok("ui.modal.type==='manual-create'&&ui.modal.extra.values.conv==='product'&&ui.modal.extra.values.sourceMessageId==='P02'");
  ok("(()=>{const r=sendManualRequest({title:'Từ tin nhắn',owner:'Nam',conv:'product',sourceMessageId:'P02',sourceRevision:0});db.user='Nam';return decideManual(r.id,'accept','',1)&&getTask(r.taskId).evidence[0]==='P02'&&getTask(r.taskId).conv==='product'})()");
});
test('FR10s: nguồn sửa/xóa không được xác nhận bằng chứng cũ', () => ok("(()=>{const r=sendManualRequest({title:'Nguồn cần kiểm tra',owner:'Nam',conv:'launch',sourceMessageId:'L01',sourceRevision:0});changeSource('T-001','L01','Nguồn đã sửa');db.user='Nam';return !decideManual(r.id,'accept','',1)&&r.status==='Chờ xác nhận'})()"));
test('FR10s: nguồn ngoài quyền người nhận bị chặn', () => ok("!sendManualRequest({title:'Không được lộ nguồn',owner:'Nam',conv:'brand',sourceMessageId:'B01'})"));
test('FR10s: dữ liệu nhập riêng không lưu yêu cầu, thông báo hoặc task', () => {
  run("db.conversations.push({id:'fr10s-private',title:'Nguồn riêng',topic:'Thử',members:PEOPLE,persist:false,messages:[m('PRIVATE-FR','Lan','VĂN BẢN KHÔNG LƯU')]});const r=sendManualRequest({title:'FR10s KHÔNG LƯU',owner:'Nam',conv:'fr10s-private',sourceMessageId:'PRIVATE-FR',sourceRevision:0});db.user='Nam';decideManual(r.id,'accept','',1);save()");
  assert.doesNotMatch(saved['chat22-prototype-v3'],/FR10s KHÔNG LƯU|fr10s-private|VĂN BẢN KHÔNG LƯU/);
});
test('FR10s: Bình và Mai xác nhận được việc Lan giao', () => ok("['Bình','Mai'].every(owner=>{db.user='Lan';const r=sendManualRequest({title:'Việc của '+owner,owner});db.user=owner;return unreadManualCount()===1&&decideManual(r.id,'accept','',1)&&getTask(r.taskId).owner===owner})"));
test('FR10s: số đếm, thông báo và bộ lọc tách theo tài khoản', () => {
  ok("(()=>{const r=sendManualRequest({title:'Tạo cho Nam',owner:'Nam'});db.user='Nam';return manualActions().length===1&&manualOpenCount()===1&&unreadManualCount()===1&&renderConfirmations().includes('Tạo cho Nam')})()");
  click('manual-read-all'); ok("unreadManualCount()===0&&manualActions().length===1");
  ok("(()=>{ui.manualFilter='Bị từ chối';return renderConfirmations().includes('Chưa có yêu cầu trong mục này')})()");
});
test('FR10s: hai kịch bản demo tạo đúng tài khoản và biểu mẫu', () => {
  run("startScenario('manual-member',true)");ok("db.user==='Nam'&&ui.modal.type==='manual-create'&&ui.modal.extra.values.title==='Kiểm tra API'");
  run("startScenario('manual-lead',true)");ok("db.user==='Lan'&&ui.modal.extra.values.owner==='Nam'&&ui.modal.extra.values.title==='Hoàn thiện giao diện'");
});
test('FR10s: router xử lý gửi biểu mẫu, lý do và đồng ý đầu cuối', () => {
  run("db.user='Lan'");
  const submit=(form)=>listeners.submit[0]({target:form,preventDefault(){},submitter:{}});
  submit({id:'manual-form',dataset:{id:'',revision:'0',submission:'UI-TEST'},values:{title:'Giao diện từ biểu mẫu',description:'Mô tả',owner:'Nam',due:'2026-11-18T17:00',conv:''}});
  ok("db.manualRequests.length===1&&ui.page==='confirmations'");
  click('set-role','Nam');
  submit({id:'manual-reason-form',dataset:{id:'MR-1',revision:'1',decision:'change'},values:{reason:'Dời sang 20/11'}});
  ok("db.manualRequests[0].status==='Cần chỉnh sửa'");
  click('set-role','Lan');
  submit({id:'manual-form',dataset:{id:'MR-1',revision:'1'},values:{title:'Giao diện từ biểu mẫu',description:'Mô tả',owner:'Nam',due:'2026-11-20T17:00',conv:''}});
  click('set-role','Nam');
  listeners.click[0]({target:{closest:()=>({dataset:{act:'manual-accept',id:'MR-1',revision:'2'}})}});
  ok("db.manualRequests[0].status==='Đã xác nhận'&&db.tasks.find(t=>t.id==='T-MR-1').due==='2026-11-20T10:00:00.000Z'");
});

test('FR10s: gửi lại thay thế thông báo cũ, còn một yêu cầu mới', () => ok("(()=>{const r=sendManualRequest({title:'Bản đầu',owner:'Nam'});sendManualRequest({title:'Bản mới',owner:'Nam'},r.id,1);db.user='Nam';return unreadManualCount()===1&&manualActions().length===1&&db.notifications.find(n=>n.revision===1).superseded})()"));
test('FR10s: sau nguồn đổi, có thể gửi lại dù giữ tên và deadline', () => ok("(()=>{const r=sendManualRequest({title:'Theo nguồn',owner:'Nam',conv:'launch',sourceMessageId:'L01',sourceRevision:0});changeSource('T-001','L01','Nguồn chỉnh sửa');if(!sendManualRequest({title:r.title,description:r.description,owner:r.owner,conv:r.conv,sourceMessageId:r.sourceMessageId,sourceRevision:1},r.id,1))return false;db.user='Nam';return decideManual(r.id,'accept','',2)&&getTask(r.taskId).evidence[0]==='L01'})()"));
test('FR10s: sửa mô tả cũng yêu cầu xác nhận lại', () => ok("(()=>{const r=sendManualRequest({title:'Tên giữ nguyên',description:'Mô tả cũ',owner:'Nam'});db.user='Nam';decideManual(r.id,'accept','',1);db.user='Lan';sendManualRequest({title:r.title,description:'Mô tả mới',owner:r.owner},r.id,1);return r.revision===2&&r.status==='Chờ xác nhận'&&getTask(r.taskId).description==='Mô tả cũ'})()"));
test('FR10s: từ chối và đề nghị sửa lưu trong lịch sử task khi tạo lại', () => ok("(()=>{const r=sendManualRequest({title:'Giữ lịch sử',owner:'Nam'});db.user='Nam';decideManual(r.id,'reject','Lý do từ chối được giữ',1);db.user='Lan';sendManualRequest({title:r.title,owner:r.owner},r.id,1);db.user='Nam';decideManual(r.id,'accept','',2);return getTask(r.taskId).history.some(h=>h.type==='Bị bác bỏ'&&h.note.includes('Lý do từ chối được giữ'))})()"));
test('FR10s: task không có nguồn vẫn có bằng chứng và lịch sử rõ ràng', () => ok("(()=>{const r=sendManualRequest({title:'Ngoài hội thoại',owner:'Nam'});db.user='Nam';decideManual(r.id,'accept','',1);ui.detailTab='evidence';const s=detailContent(getTask(r.taskId));return s.includes('Người dùng tạo thủ công')&&s.includes('không có tin nhắn nguồn')&&s.includes('Lịch sử xác nhận')})()"));
test('FR10s: sửa dùng nguồn nhập riêng không ghi đè bản mẫu đã lưu', () => {
  run("(()=>{const r=sendManualRequest({title:'BẢN CÔNG KHAI MẪU',owner:'Nam'});db.user='Nam';decideManual(r.id,'accept','',1);db.user='Lan';db.conversations.push({id:'edit-private',title:'Nguồn riêng',topic:'Thử',members:PEOPLE,persist:false,messages:[m('EP-1','Lan','Nguồn riêng')]});sendManualRequest({title:'BẢN SỬA KHÔNG LƯU',owner:'Nam',conv:'edit-private',sourceMessageId:'EP-1',sourceRevision:0},r.id,1);save()})()");
  assert.match(saved['chat22-prototype-v3'],/BẢN CÔNG KHAI MẪU/);
  assert.doesNotMatch(saved['chat22-prototype-v3'],/BẢN SỬA KHÔNG LƯU|edit-private/);
});
test('FR10s: ghi chú bật tắt theo cơ chế cũ', () => ok("(()=>{if(!noteMark('FR10s').includes('10s'))return false;ui.note='FR10s';renderNote();if(!document.getElementById('note').innerHTML.includes('Không tự duyệt'))return false;db.notes=false;renderNote();return noteMark('FR10s')===''&&document.getElementById('note').hidden})()"));
test('FR10s: reset kịch bản thủ công không làm mất dữ liệu AI', () => ok("(()=>{db.user='Nam';const r=sendManualRequest({title:'Kiểm tra API',owner:'Nam',scenario:'manual-member'});db.user='Lan';decideManual(r.id,'accept','',1);const tasks=db.tasks.filter(t=>!t.manualRequestId).length,proposals=db.proposals.length;startManualScenario('manual-member',true);return db.tasks.filter(t=>!t.manualRequestId).length===tasks&&db.proposals.length===proposals&&!db.manualRequests.some(r=>r.scenario==='manual-member')})()"));

test('FR10s: đổi hội thoại vẫn truy đúng nguồn cũ và mới theo mốc', () => ok("(()=>{const r=sendManualRequest({title:'Đổi nguồn',owner:'Nam',conv:'launch',sourceMessageId:'L01',sourceRevision:0});db.user='Nam';decideManual(r.id,'accept','',1);db.user='Lan';sendManualRequest({title:r.title,owner:'Nam',conv:'product',sourceMessageId:'P02',sourceRevision:0},r.id,1);db.user='Nam';decideManual(r.id,'accept','',2);const t=getTask(r.taskId);return t.history.some(h=>historySourceLinks(h,t).includes('launch|L01'))&&t.history.some(h=>historySourceLinks(h,t).includes('product|P02'))})()"));
test('FR10s: người mới nhận việc không thấy nội dung lịch sử ngoài quyền', () => ok("(()=>{const r=sendManualRequest({title:'BẢN NỘI BỘ CŨ',description:'MÔ TẢ NỘI BỘ CŨ',owner:'Mai',conv:'brand',sourceMessageId:'B01',sourceRevision:0});db.user='Mai';decideManual(r.id,'accept','',1);db.user='Lan';sendManualRequest({title:'Bản chia sẻ cho Nam',description:'Mô tả công khai nhóm',owner:'Nam',conv:'launch',sourceMessageId:'L01',sourceRevision:0},r.id,1);db.user='Nam';if(!decideManual(r.id,'accept','',2))return false;const manual=manualDialog('manual-detail',r.id);ui.detailTab='history';const history=detailContent(getTask(r.taskId));return !manual.includes('BẢN NỘI BỘ CŨ')&&!manual.includes('MÔ TẢ NỘI BỘ CŨ')&&!history.includes('brand|B01')&&history.includes('launch|L01')})()"));

const failed = results.filter(r=>!r.passed);
console.log(JSON.stringify({total:results.length,passed:results.length-failed.length,failed,verification:'Logic + HTML render trong DOM giả lập; chưa xác minh giao diện trên trình duyệt.'},null,2));
if (failed.length) throw new Error(`${failed.length} kiểm thử thất bại.`);
export default results;
