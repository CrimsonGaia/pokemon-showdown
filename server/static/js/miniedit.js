"use strict";













var MAX_UNDO_HISTORY=100;var


MiniEdit=function(){
























function MiniEdit(
el,options)
{var _this=this;this.element=void 0;this._setContent=void 0;this.pushHistory=void 0;this.onKeyDown=function(ev){if(ev.keyCode===13){_this.replaceSelection('\n');ev.preventDefault();}};
this.element=el;

this._setContent=options.setContent;
this.onKeyDown=options.onKeyDown||this.onKeyDown;

this.element.setAttribute('contentEditable','true');
this.element.setAttribute('autoComplete','off');
this.element.setAttribute('spellCheck','false');
this.element.addEventListener('input',function(){
_this.reformat();
});
this.element.addEventListener('keydown',this.onKeyDown);for(var _i2=0,_MiniEdit$plugins2=

MiniEdit.plugins;_i2<_MiniEdit$plugins2.length;_i2++){var Plugin=_MiniEdit$plugins2[_i2];new Plugin(this);}
}var _proto=MiniEdit.prototype;_proto.


traverseText=function traverseText(node,callback){
if(node.nodeType===3){
if(callback(node))return true;
}else{
for(var i=0,len=node.childNodes.length;i<len;++i){
if(this.traverseText(node.childNodes[i],callback))return true;
}
}
return false;
};_proto.

setValue=function setValue(text){var _this$pushHistory;var selection=arguments.length>1&&arguments[1]!==undefined?arguments[1]:this.getSelection();
this._setContent(text);

this.setSelection(selection);
(_this$pushHistory=this.pushHistory)==null||_this$pushHistory.call(this,text,selection);
};_proto.
getValue=function getValue(){
var text=this.element.textContent||'';
if(text.endsWith('\n'))return text.slice(0,-1);
return text;
};_proto.
reformat=function reformat(selection){
this.setValue(this.getValue(),selection);
};_proto.
replaceSelection=function replaceSelection(text){
var selection=this.getSelection();
var oldContent=this.getValue();
var newText=oldContent.slice(0,selection.start)+text+oldContent.slice(selection.end);
this.setValue(newText,{start:selection.start+text.length,end:selection.start+text.length});
};_proto.

getSelection=function getSelection(){
var sel=window.getSelection();
var offset=0;
var start=null;
var end=null;

if(sel.rangeCount){
var range=sel.getRangeAt(0);
this.traverseText(this.element,function(node){
if(start===null&&node===range.startContainer){
start=offset+range.startOffset;
}

if(start!==null&&node===range.endContainer){
end=offset+range.endOffset;
return true;
}

offset+=node.length;
return false;
});
}

return start===null||end===null?null:{start:start,end:end};
};_proto.

setSelection=function setSelection(sel){
if(sel===null)return;

var range=document.createRange();
var offset=0;
var found=false;
range.collapse(true);

if(this.traverseText(this.element,function(n){
var nextOffset=offset+n.length;

if(!found&&sel.start>=offset&&sel.start<=nextOffset){
range.setStart(n,sel.start-offset);
found=true;
}

if(found&&sel.end>=offset&&sel.end<=nextOffset){
range.setEnd(n,sel.end-offset);
return true;
}

offset=nextOffset;
return false;
})){
var selection=window.getSelection();
selection.removeAllRanges();
selection.addRange(range);
}
};_proto.
select=function select(){
this.setSelection({start:0,end:this.getValue().length});
};return MiniEdit;}();MiniEdit.plugins=[];var


MiniEditPastePlugin=
function MiniEditPastePlugin(editor){
editor.element.addEventListener('paste',function(e){

var text=e.clipboardData.getData('text/plain');
editor.replaceSelection(text);
e.preventDefault();
});
};

MiniEdit.plugins.push(MiniEditPastePlugin);var






MiniEditUndoPlugin=





function MiniEditUndoPlugin(editor){var _this2=this;this.editor=void 0;this.undoIndex=null;this.ignoreInput=false;this.history=[];this.







onPushHistory=function(text,selection){
if(_this2.ignoreInput){

_this2.ignoreInput=false;
return;
}

if(_this2.undoIndex!==null){

_this2.history.splice(_this2.undoIndex+1);
_this2.undoIndex=null;
}

_this2.history.push({text:text,selection:selection});

if(_this2.history.length>MAX_UNDO_HISTORY)_this2.history.shift();
};this.

onKeyDown=function(e){

var undoPressed=e.ctrlKey&&e.keyCode===90||e.metaKey&&!e.shiftKey&&e.keyCode===90;

var redoPressed=e.ctrlKey&&e.keyCode===89||e.metaKey&&e.shiftKey&&e.keyCode===90;

if(undoPressed){var _this2$undoIndex;
(_this2$undoIndex=_this2.undoIndex)!=null?_this2$undoIndex:_this2.undoIndex=_this2.history.length-1;
_this2.undoIndex--;

if(_this2.undoIndex<0){
_this2.undoIndex=0;
return;
}
}else if(redoPressed&&_this2.undoIndex!==null){
_this2.undoIndex++;

if(_this2.undoIndex>_this2.history.length-1){
_this2.undoIndex=null;
return;
}
}else{
return;
}

var _this2$history$_this=_this2.history[_this2.undoIndex],text=_this2$history$_this.text,selection=_this2$history$_this.selection;
_this2.ignoreInput=true;
_this2.editor.setValue(text,selection);
};this.editor=editor;this.history.push({text:editor.getValue(),selection:{start:0,end:0}});this.editor.pushHistory=this.onPushHistory;editor.element.addEventListener('keydown',this.onKeyDown);};

MiniEdit.plugins.push(MiniEditUndoPlugin);
//# sourceMappingURL=miniedit.js.map