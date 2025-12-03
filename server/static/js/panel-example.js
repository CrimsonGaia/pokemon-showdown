"use strict";function _inheritsLoose(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,_setPrototypeOf(t,o);}function _setPrototypeOf(t,e){return _setPrototypeOf=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t;},_setPrototypeOf(t,e);}/**
 * Example Panel
 *
 * Just an example panel for creating new panels/popups
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license AGPLv3
 */var






ExampleRoom=function(_PSRoom){


function ExampleRoom(options){var _this;
_this=_PSRoom.call(this,options)||this;_this.classType='example';return _this;
}_inheritsLoose(ExampleRoom,_PSRoom);return ExampleRoom;}(PSRoom);var


ExamplePanel=function(_PSRoomPanel){function ExamplePanel(){return _PSRoomPanel.apply(this,arguments)||this;}_inheritsLoose(ExamplePanel,_PSRoomPanel);var _proto=ExamplePanel.prototype;_proto.










render=function render(){
var room=this.props.room;
return preact.h(PSPanelWrapper,{room:room},
preact.h("div",{"class":"mainmessage"},preact.h("p",null,"Hello World!"))
);
};return ExamplePanel;}(PSRoomPanel);ExamplePanel.id='exampleview';ExamplePanel.routes=['exampleview','examples-*'];ExamplePanel.Model=ExampleRoom;ExamplePanel.title='Example View';


PS.addRoomType(ExamplePanel);var



ExampleViewPanel=function(_PSRoomPanel2){function ExampleViewPanel(){return _PSRoomPanel2.apply(this,arguments)||this;}_inheritsLoose(ExampleViewPanel,_PSRoomPanel2);var _proto2=ExampleViewPanel.prototype;_proto2.



render=function render(){
var room=this.props.room;
return preact.h(PSPanelWrapper,{room:room},
preact.h("div",{"class":"mainmessage"},preact.h("p",null,"Hello World!"))
);
};return ExampleViewPanel;}(PSRoomPanel);ExampleViewPanel.id='examplevie2';ExampleViewPanel.routes=['exampleview2'];ExampleViewPanel.title='Example View';


PS.addRoomType(ExampleViewPanel);
//# sourceMappingURL=panel-example.js.map