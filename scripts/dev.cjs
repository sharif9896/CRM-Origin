const { spawn } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const children = [
  spawn(process.execPath, ['server.js'], { cwd:path.join(root,'backend'), stdio:'inherit', windowsHide:true }),
  spawn(process.execPath, [path.join(root,'frontend/node_modules/vite/bin/vite.js'),'--host','127.0.0.1','--port','5173','--strictPort'], { cwd:path.join(root,'frontend'), stdio:'inherit', windowsHide:true })
];
let stopping=false;
function stop(code=0){if(stopping)return;stopping=true;for(const child of children)child.kill();process.exitCode=code;}
for(const child of children){child.on('error',e=>{console.error(e.message);stop(1);});child.on('exit',code=>stop(code||0));}
process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());

