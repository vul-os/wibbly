const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/pose-detection.esm-tLLqLZQ1.js","assets/shared-DPyv6PQc.js","assets/index-Df5bBHJu.js"])))=>i.map(i=>d[i]);
var tM=Object.defineProperty;var nM=(r,e,t)=>e in r?tM(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var He=(r,e,t)=>nM(r,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const l of s)if(l.type==="childList")for(const u of l.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&i(u)}).observe(document,{childList:!0,subtree:!0});function t(s){const l={};return s.integrity&&(l.integrity=s.integrity),s.referrerPolicy&&(l.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?l.credentials="include":s.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(s){if(s.ep)return;s.ep=!0;const l=t(s);fetch(s.href,l)}})();var cL=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Py(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function uL(r){if(Object.prototype.hasOwnProperty.call(r,"__esModule"))return r;var e=r.default;if(typeof e=="function"){var t=function i(){return this instanceof i?Reflect.construct(e,arguments,this.constructor):e.apply(this,arguments)};t.prototype=e.prototype}else t={};return Object.defineProperty(t,"__esModule",{value:!0}),Object.keys(r).forEach(function(i){var s=Object.getOwnPropertyDescriptor(r,i);Object.defineProperty(t,i,s.get?s:{enumerable:!0,get:function(){return r[i]}})}),t}var th={exports:{}},pt={};/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var I0;function iM(){if(I0)return pt;I0=1;var r=Symbol.for("react.transitional.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),i=Symbol.for("react.strict_mode"),s=Symbol.for("react.profiler"),l=Symbol.for("react.consumer"),u=Symbol.for("react.context"),f=Symbol.for("react.forward_ref"),d=Symbol.for("react.suspense"),h=Symbol.for("react.memo"),m=Symbol.for("react.lazy"),g=Symbol.iterator;function v(I){return I===null||typeof I!="object"?null:(I=g&&I[g]||I["@@iterator"],typeof I=="function"?I:null)}var b={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},E=Object.assign,S={};function x(I,re,Se){this.props=I,this.context=re,this.refs=S,this.updater=Se||b}x.prototype.isReactComponent={},x.prototype.setState=function(I,re){if(typeof I!="object"&&typeof I!="function"&&I!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,I,re,"setState")},x.prototype.forceUpdate=function(I){this.updater.enqueueForceUpdate(this,I,"forceUpdate")};function y(){}y.prototype=x.prototype;function T(I,re,Se){this.props=I,this.context=re,this.refs=S,this.updater=Se||b}var N=T.prototype=new y;N.constructor=T,E(N,x.prototype),N.isPureReactComponent=!0;var A=Array.isArray,P={H:null,A:null,T:null,S:null},F=Object.prototype.hasOwnProperty;function k(I,re,Se,Ne,Q,me){return Se=me.ref,{$$typeof:r,type:I,key:re,ref:Se!==void 0?Se:null,props:me}}function z(I,re){return k(I.type,re,void 0,void 0,void 0,I.props)}function R(I){return typeof I=="object"&&I!==null&&I.$$typeof===r}function C(I){var re={"=":"=0",":":"=2"};return"$"+I.replace(/[=:]/g,function(Se){return re[Se]})}var H=/\/+/g;function J(I,re){return typeof I=="object"&&I!==null&&I.key!=null?C(""+I.key):re.toString(36)}function K(){}function ce(I){switch(I.status){case"fulfilled":return I.value;case"rejected":throw I.reason;default:switch(typeof I.status=="string"?I.then(K,K):(I.status="pending",I.then(function(re){I.status==="pending"&&(I.status="fulfilled",I.value=re)},function(re){I.status==="pending"&&(I.status="rejected",I.reason=re)})),I.status){case"fulfilled":return I.value;case"rejected":throw I.reason}}throw I}function de(I,re,Se,Ne,Q){var me=typeof I;(me==="undefined"||me==="boolean")&&(I=null);var xe=!1;if(I===null)xe=!0;else switch(me){case"bigint":case"string":case"number":xe=!0;break;case"object":switch(I.$$typeof){case r:case e:xe=!0;break;case m:return xe=I._init,de(xe(I._payload),re,Se,Ne,Q)}}if(xe)return Q=Q(I),xe=Ne===""?"."+J(I,0):Ne,A(Q)?(Se="",xe!=null&&(Se=xe.replace(H,"$&/")+"/"),de(Q,re,Se,"",function(Ke){return Ke})):Q!=null&&(R(Q)&&(Q=z(Q,Se+(Q.key==null||I&&I.key===Q.key?"":(""+Q.key).replace(H,"$&/")+"/")+xe)),re.push(Q)),1;xe=0;var we=Ne===""?".":Ne+":";if(A(I))for(var Ce=0;Ce<I.length;Ce++)Ne=I[Ce],me=we+J(Ne,Ce),xe+=de(Ne,re,Se,me,Q);else if(Ce=v(I),typeof Ce=="function")for(I=Ce.call(I),Ce=0;!(Ne=I.next()).done;)Ne=Ne.value,me=we+J(Ne,Ce++),xe+=de(Ne,re,Se,me,Q);else if(me==="object"){if(typeof I.then=="function")return de(ce(I),re,Se,Ne,Q);throw re=String(I),Error("Objects are not valid as a React child (found: "+(re==="[object Object]"?"object with keys {"+Object.keys(I).join(", ")+"}":re)+"). If you meant to render a collection of children, use an array instead.")}return xe}function W(I,re,Se){if(I==null)return I;var Ne=[],Q=0;return de(I,Ne,"","",function(me){return re.call(Se,me,Q++)}),Ne}function le(I){if(I._status===-1){var re=I._result;re=re(),re.then(function(Se){(I._status===0||I._status===-1)&&(I._status=1,I._result=Se)},function(Se){(I._status===0||I._status===-1)&&(I._status=2,I._result=Se)}),I._status===-1&&(I._status=0,I._result=re)}if(I._status===1)return I._result.default;throw I._result}var Y=typeof reportError=="function"?reportError:function(I){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var re=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof I=="object"&&I!==null&&typeof I.message=="string"?String(I.message):String(I),error:I});if(!window.dispatchEvent(re))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",I);return}console.error(I)};function ye(){}return pt.Children={map:W,forEach:function(I,re,Se){W(I,function(){re.apply(this,arguments)},Se)},count:function(I){var re=0;return W(I,function(){re++}),re},toArray:function(I){return W(I,function(re){return re})||[]},only:function(I){if(!R(I))throw Error("React.Children.only expected to receive a single React element child.");return I}},pt.Component=x,pt.Fragment=t,pt.Profiler=s,pt.PureComponent=T,pt.StrictMode=i,pt.Suspense=d,pt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=P,pt.act=function(){throw Error("act(...) is not supported in production builds of React.")},pt.cache=function(I){return function(){return I.apply(null,arguments)}},pt.cloneElement=function(I,re,Se){if(I==null)throw Error("The argument must be a React element, but you passed "+I+".");var Ne=E({},I.props),Q=I.key,me=void 0;if(re!=null)for(xe in re.ref!==void 0&&(me=void 0),re.key!==void 0&&(Q=""+re.key),re)!F.call(re,xe)||xe==="key"||xe==="__self"||xe==="__source"||xe==="ref"&&re.ref===void 0||(Ne[xe]=re[xe]);var xe=arguments.length-2;if(xe===1)Ne.children=Se;else if(1<xe){for(var we=Array(xe),Ce=0;Ce<xe;Ce++)we[Ce]=arguments[Ce+2];Ne.children=we}return k(I.type,Q,void 0,void 0,me,Ne)},pt.createContext=function(I){return I={$$typeof:u,_currentValue:I,_currentValue2:I,_threadCount:0,Provider:null,Consumer:null},I.Provider=I,I.Consumer={$$typeof:l,_context:I},I},pt.createElement=function(I,re,Se){var Ne,Q={},me=null;if(re!=null)for(Ne in re.key!==void 0&&(me=""+re.key),re)F.call(re,Ne)&&Ne!=="key"&&Ne!=="__self"&&Ne!=="__source"&&(Q[Ne]=re[Ne]);var xe=arguments.length-2;if(xe===1)Q.children=Se;else if(1<xe){for(var we=Array(xe),Ce=0;Ce<xe;Ce++)we[Ce]=arguments[Ce+2];Q.children=we}if(I&&I.defaultProps)for(Ne in xe=I.defaultProps,xe)Q[Ne]===void 0&&(Q[Ne]=xe[Ne]);return k(I,me,void 0,void 0,null,Q)},pt.createRef=function(){return{current:null}},pt.forwardRef=function(I){return{$$typeof:f,render:I}},pt.isValidElement=R,pt.lazy=function(I){return{$$typeof:m,_payload:{_status:-1,_result:I},_init:le}},pt.memo=function(I,re){return{$$typeof:h,type:I,compare:re===void 0?null:re}},pt.startTransition=function(I){var re=P.T,Se={};P.T=Se;try{var Ne=I(),Q=P.S;Q!==null&&Q(Se,Ne),typeof Ne=="object"&&Ne!==null&&typeof Ne.then=="function"&&Ne.then(ye,Y)}catch(me){Y(me)}finally{P.T=re}},pt.unstable_useCacheRefresh=function(){return P.H.useCacheRefresh()},pt.use=function(I){return P.H.use(I)},pt.useActionState=function(I,re,Se){return P.H.useActionState(I,re,Se)},pt.useCallback=function(I,re){return P.H.useCallback(I,re)},pt.useContext=function(I){return P.H.useContext(I)},pt.useDebugValue=function(){},pt.useDeferredValue=function(I,re){return P.H.useDeferredValue(I,re)},pt.useEffect=function(I,re){return P.H.useEffect(I,re)},pt.useId=function(){return P.H.useId()},pt.useImperativeHandle=function(I,re,Se){return P.H.useImperativeHandle(I,re,Se)},pt.useInsertionEffect=function(I,re){return P.H.useInsertionEffect(I,re)},pt.useLayoutEffect=function(I,re){return P.H.useLayoutEffect(I,re)},pt.useMemo=function(I,re){return P.H.useMemo(I,re)},pt.useOptimistic=function(I,re){return P.H.useOptimistic(I,re)},pt.useReducer=function(I,re,Se){return P.H.useReducer(I,re,Se)},pt.useRef=function(I){return P.H.useRef(I)},pt.useState=function(I){return P.H.useState(I)},pt.useSyncExternalStore=function(I,re,Se){return P.H.useSyncExternalStore(I,re,Se)},pt.useTransition=function(){return P.H.useTransition()},pt.version="19.0.0",pt}var F0;function zp(){return F0||(F0=1,th.exports=iM()),th.exports}var G=zp();const M=Py(G);var nh={exports:{}},pl={},ih={exports:{}},ah={};/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var B0;function aM(){return B0||(B0=1,function(r){function e(W,le){var Y=W.length;W.push(le);e:for(;0<Y;){var ye=Y-1>>>1,I=W[ye];if(0<s(I,le))W[ye]=le,W[Y]=I,Y=ye;else break e}}function t(W){return W.length===0?null:W[0]}function i(W){if(W.length===0)return null;var le=W[0],Y=W.pop();if(Y!==le){W[0]=Y;e:for(var ye=0,I=W.length,re=I>>>1;ye<re;){var Se=2*(ye+1)-1,Ne=W[Se],Q=Se+1,me=W[Q];if(0>s(Ne,Y))Q<I&&0>s(me,Ne)?(W[ye]=me,W[Q]=Y,ye=Q):(W[ye]=Ne,W[Se]=Y,ye=Se);else if(Q<I&&0>s(me,Y))W[ye]=me,W[Q]=Y,ye=Q;else break e}}return le}function s(W,le){var Y=W.sortIndex-le.sortIndex;return Y!==0?Y:W.id-le.id}if(r.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var l=performance;r.unstable_now=function(){return l.now()}}else{var u=Date,f=u.now();r.unstable_now=function(){return u.now()-f}}var d=[],h=[],m=1,g=null,v=3,b=!1,E=!1,S=!1,x=typeof setTimeout=="function"?setTimeout:null,y=typeof clearTimeout=="function"?clearTimeout:null,T=typeof setImmediate<"u"?setImmediate:null;function N(W){for(var le=t(h);le!==null;){if(le.callback===null)i(h);else if(le.startTime<=W)i(h),le.sortIndex=le.expirationTime,e(d,le);else break;le=t(h)}}function A(W){if(S=!1,N(W),!E)if(t(d)!==null)E=!0,ce();else{var le=t(h);le!==null&&de(A,le.startTime-W)}}var P=!1,F=-1,k=5,z=-1;function R(){return!(r.unstable_now()-z<k)}function C(){if(P){var W=r.unstable_now();z=W;var le=!0;try{e:{E=!1,S&&(S=!1,y(F),F=-1),b=!0;var Y=v;try{t:{for(N(W),g=t(d);g!==null&&!(g.expirationTime>W&&R());){var ye=g.callback;if(typeof ye=="function"){g.callback=null,v=g.priorityLevel;var I=ye(g.expirationTime<=W);if(W=r.unstable_now(),typeof I=="function"){g.callback=I,N(W),le=!0;break t}g===t(d)&&i(d),N(W)}else i(d);g=t(d)}if(g!==null)le=!0;else{var re=t(h);re!==null&&de(A,re.startTime-W),le=!1}}break e}finally{g=null,v=Y,b=!1}le=void 0}}finally{le?H():P=!1}}}var H;if(typeof T=="function")H=function(){T(C)};else if(typeof MessageChannel<"u"){var J=new MessageChannel,K=J.port2;J.port1.onmessage=C,H=function(){K.postMessage(null)}}else H=function(){x(C,0)};function ce(){P||(P=!0,H())}function de(W,le){F=x(function(){W(r.unstable_now())},le)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(W){W.callback=null},r.unstable_continueExecution=function(){E||b||(E=!0,ce())},r.unstable_forceFrameRate=function(W){0>W||125<W?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):k=0<W?Math.floor(1e3/W):5},r.unstable_getCurrentPriorityLevel=function(){return v},r.unstable_getFirstCallbackNode=function(){return t(d)},r.unstable_next=function(W){switch(v){case 1:case 2:case 3:var le=3;break;default:le=v}var Y=v;v=le;try{return W()}finally{v=Y}},r.unstable_pauseExecution=function(){},r.unstable_requestPaint=function(){},r.unstable_runWithPriority=function(W,le){switch(W){case 1:case 2:case 3:case 4:case 5:break;default:W=3}var Y=v;v=W;try{return le()}finally{v=Y}},r.unstable_scheduleCallback=function(W,le,Y){var ye=r.unstable_now();switch(typeof Y=="object"&&Y!==null?(Y=Y.delay,Y=typeof Y=="number"&&0<Y?ye+Y:ye):Y=ye,W){case 1:var I=-1;break;case 2:I=250;break;case 5:I=1073741823;break;case 4:I=1e4;break;default:I=5e3}return I=Y+I,W={id:m++,callback:le,priorityLevel:W,startTime:Y,expirationTime:I,sortIndex:-1},Y>ye?(W.sortIndex=Y,e(h,W),t(d)===null&&W===t(h)&&(S?(y(F),F=-1):S=!0,de(A,Y-ye))):(W.sortIndex=I,e(d,W),E||b||(E=!0,ce())),W},r.unstable_shouldYield=R,r.unstable_wrapCallback=function(W){var le=v;return function(){var Y=v;v=le;try{return W.apply(this,arguments)}finally{v=Y}}}}(ah)),ah}var z0;function rM(){return z0||(z0=1,ih.exports=aM()),ih.exports}var rh={exports:{}},Un={};/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var k0;function sM(){if(k0)return Un;k0=1;var r=zp();function e(d){var h="https://react.dev/errors/"+d;if(1<arguments.length){h+="?args[]="+encodeURIComponent(arguments[1]);for(var m=2;m<arguments.length;m++)h+="&args[]="+encodeURIComponent(arguments[m])}return"Minified React error #"+d+"; visit "+h+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function t(){}var i={d:{f:t,r:function(){throw Error(e(522))},D:t,C:t,L:t,m:t,X:t,S:t,M:t},p:0,findDOMNode:null},s=Symbol.for("react.portal");function l(d,h,m){var g=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:s,key:g==null?null:""+g,children:d,containerInfo:h,implementation:m}}var u=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function f(d,h){if(d==="font")return"";if(typeof h=="string")return h==="use-credentials"?h:""}return Un.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=i,Un.createPortal=function(d,h){var m=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!h||h.nodeType!==1&&h.nodeType!==9&&h.nodeType!==11)throw Error(e(299));return l(d,h,null,m)},Un.flushSync=function(d){var h=u.T,m=i.p;try{if(u.T=null,i.p=2,d)return d()}finally{u.T=h,i.p=m,i.d.f()}},Un.preconnect=function(d,h){typeof d=="string"&&(h?(h=h.crossOrigin,h=typeof h=="string"?h==="use-credentials"?h:"":void 0):h=null,i.d.C(d,h))},Un.prefetchDNS=function(d){typeof d=="string"&&i.d.D(d)},Un.preinit=function(d,h){if(typeof d=="string"&&h&&typeof h.as=="string"){var m=h.as,g=f(m,h.crossOrigin),v=typeof h.integrity=="string"?h.integrity:void 0,b=typeof h.fetchPriority=="string"?h.fetchPriority:void 0;m==="style"?i.d.S(d,typeof h.precedence=="string"?h.precedence:void 0,{crossOrigin:g,integrity:v,fetchPriority:b}):m==="script"&&i.d.X(d,{crossOrigin:g,integrity:v,fetchPriority:b,nonce:typeof h.nonce=="string"?h.nonce:void 0})}},Un.preinitModule=function(d,h){if(typeof d=="string")if(typeof h=="object"&&h!==null){if(h.as==null||h.as==="script"){var m=f(h.as,h.crossOrigin);i.d.M(d,{crossOrigin:m,integrity:typeof h.integrity=="string"?h.integrity:void 0,nonce:typeof h.nonce=="string"?h.nonce:void 0})}}else h==null&&i.d.M(d)},Un.preload=function(d,h){if(typeof d=="string"&&typeof h=="object"&&h!==null&&typeof h.as=="string"){var m=h.as,g=f(m,h.crossOrigin);i.d.L(d,m,{crossOrigin:g,integrity:typeof h.integrity=="string"?h.integrity:void 0,nonce:typeof h.nonce=="string"?h.nonce:void 0,type:typeof h.type=="string"?h.type:void 0,fetchPriority:typeof h.fetchPriority=="string"?h.fetchPriority:void 0,referrerPolicy:typeof h.referrerPolicy=="string"?h.referrerPolicy:void 0,imageSrcSet:typeof h.imageSrcSet=="string"?h.imageSrcSet:void 0,imageSizes:typeof h.imageSizes=="string"?h.imageSizes:void 0,media:typeof h.media=="string"?h.media:void 0})}},Un.preloadModule=function(d,h){if(typeof d=="string")if(h){var m=f(h.as,h.crossOrigin);i.d.m(d,{as:typeof h.as=="string"&&h.as!=="script"?h.as:void 0,crossOrigin:m,integrity:typeof h.integrity=="string"?h.integrity:void 0})}else i.d.m(d)},Un.requestFormReset=function(d){i.d.r(d)},Un.unstable_batchedUpdates=function(d,h){return d(h)},Un.useFormState=function(d,h,m){return u.H.useFormState(d,h,m)},Un.useFormStatus=function(){return u.H.useHostTransitionStatus()},Un.version="19.0.0",Un}var H0;function oM(){if(H0)return rh.exports;H0=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),rh.exports=sM(),rh.exports}/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var V0;function lM(){if(V0)return pl;V0=1;var r=rM(),e=zp(),t=oM();function i(n){var a="https://react.dev/errors/"+n;if(1<arguments.length){a+="?args[]="+encodeURIComponent(arguments[1]);for(var o=2;o<arguments.length;o++)a+="&args[]="+encodeURIComponent(arguments[o])}return"Minified React error #"+n+"; visit "+a+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function s(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}var l=Symbol.for("react.element"),u=Symbol.for("react.transitional.element"),f=Symbol.for("react.portal"),d=Symbol.for("react.fragment"),h=Symbol.for("react.strict_mode"),m=Symbol.for("react.profiler"),g=Symbol.for("react.provider"),v=Symbol.for("react.consumer"),b=Symbol.for("react.context"),E=Symbol.for("react.forward_ref"),S=Symbol.for("react.suspense"),x=Symbol.for("react.suspense_list"),y=Symbol.for("react.memo"),T=Symbol.for("react.lazy"),N=Symbol.for("react.offscreen"),A=Symbol.for("react.memo_cache_sentinel"),P=Symbol.iterator;function F(n){return n===null||typeof n!="object"?null:(n=P&&n[P]||n["@@iterator"],typeof n=="function"?n:null)}var k=Symbol.for("react.client.reference");function z(n){if(n==null)return null;if(typeof n=="function")return n.$$typeof===k?null:n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case d:return"Fragment";case f:return"Portal";case m:return"Profiler";case h:return"StrictMode";case S:return"Suspense";case x:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case b:return(n.displayName||"Context")+".Provider";case v:return(n._context.displayName||"Context")+".Consumer";case E:var a=n.render;return n=n.displayName,n||(n=a.displayName||a.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case y:return a=n.displayName||null,a!==null?a:z(n.type)||"Memo";case T:a=n._payload,n=n._init;try{return z(n(a))}catch{}}return null}var R=e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,C=Object.assign,H,J;function K(n){if(H===void 0)try{throw Error()}catch(o){var a=o.stack.trim().match(/\n( *(at )?)/);H=a&&a[1]||"",J=-1<o.stack.indexOf(`
    at`)?" (<anonymous>)":-1<o.stack.indexOf("@")?"@unknown:0:0":""}return`
`+H+n+J}var ce=!1;function de(n,a){if(!n||ce)return"";ce=!0;var o=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var c={DetermineComponentFrameRoot:function(){try{if(a){var Ee=function(){throw Error()};if(Object.defineProperty(Ee.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(Ee,[])}catch(he){var oe=he}Reflect.construct(n,[],Ee)}else{try{Ee.call()}catch(he){oe=he}n.call(Ee.prototype)}}else{try{throw Error()}catch(he){oe=he}(Ee=n())&&typeof Ee.catch=="function"&&Ee.catch(function(){})}}catch(he){if(he&&oe&&typeof he.stack=="string")return[he.stack,oe.stack]}return[null,null]}};c.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var p=Object.getOwnPropertyDescriptor(c.DetermineComponentFrameRoot,"name");p&&p.configurable&&Object.defineProperty(c.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var _=c.DetermineComponentFrameRoot(),w=_[0],L=_[1];if(w&&L){var B=w.split(`
`),j=L.split(`
`);for(p=c=0;c<B.length&&!B[c].includes("DetermineComponentFrameRoot");)c++;for(;p<j.length&&!j[p].includes("DetermineComponentFrameRoot");)p++;if(c===B.length||p===j.length)for(c=B.length-1,p=j.length-1;1<=c&&0<=p&&B[c]!==j[p];)p--;for(;1<=c&&0<=p;c--,p--)if(B[c]!==j[p]){if(c!==1||p!==1)do if(c--,p--,0>p||B[c]!==j[p]){var pe=`
`+B[c].replace(" at new "," at ");return n.displayName&&pe.includes("<anonymous>")&&(pe=pe.replace("<anonymous>",n.displayName)),pe}while(1<=c&&0<=p);break}}}finally{ce=!1,Error.prepareStackTrace=o}return(o=n?n.displayName||n.name:"")?K(o):""}function W(n){switch(n.tag){case 26:case 27:case 5:return K(n.type);case 16:return K("Lazy");case 13:return K("Suspense");case 19:return K("SuspenseList");case 0:case 15:return n=de(n.type,!1),n;case 11:return n=de(n.type.render,!1),n;case 1:return n=de(n.type,!0),n;default:return""}}function le(n){try{var a="";do a+=W(n),n=n.return;while(n);return a}catch(o){return`
Error generating stack: `+o.message+`
`+o.stack}}function Y(n){var a=n,o=n;if(n.alternate)for(;a.return;)a=a.return;else{n=a;do a=n,(a.flags&4098)!==0&&(o=a.return),n=a.return;while(n)}return a.tag===3?o:null}function ye(n){if(n.tag===13){var a=n.memoizedState;if(a===null&&(n=n.alternate,n!==null&&(a=n.memoizedState)),a!==null)return a.dehydrated}return null}function I(n){if(Y(n)!==n)throw Error(i(188))}function re(n){var a=n.alternate;if(!a){if(a=Y(n),a===null)throw Error(i(188));return a!==n?null:n}for(var o=n,c=a;;){var p=o.return;if(p===null)break;var _=p.alternate;if(_===null){if(c=p.return,c!==null){o=c;continue}break}if(p.child===_.child){for(_=p.child;_;){if(_===o)return I(p),n;if(_===c)return I(p),a;_=_.sibling}throw Error(i(188))}if(o.return!==c.return)o=p,c=_;else{for(var w=!1,L=p.child;L;){if(L===o){w=!0,o=p,c=_;break}if(L===c){w=!0,c=p,o=_;break}L=L.sibling}if(!w){for(L=_.child;L;){if(L===o){w=!0,o=_,c=p;break}if(L===c){w=!0,c=_,o=p;break}L=L.sibling}if(!w)throw Error(i(189))}}if(o.alternate!==c)throw Error(i(190))}if(o.tag!==3)throw Error(i(188));return o.stateNode.current===o?n:a}function Se(n){var a=n.tag;if(a===5||a===26||a===27||a===6)return n;for(n=n.child;n!==null;){if(a=Se(n),a!==null)return a;n=n.sibling}return null}var Ne=Array.isArray,Q=t.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,me={pending:!1,data:null,method:null,action:null},xe=[],we=-1;function Ce(n){return{current:n}}function Ke(n){0>we||(n.current=xe[we],xe[we]=null,we--)}function Oe(n,a){we++,xe[we]=n.current,n.current=a}var xt=Ce(null),Dt=Ce(null),it=Ce(null),V=Ce(null);function on(n,a){switch(Oe(it,a),Oe(Dt,n),Oe(xt,null),n=a.nodeType,n){case 9:case 11:a=(a=a.documentElement)&&(a=a.namespaceURI)?f0(a):0;break;default:if(n=n===8?a.parentNode:a,a=n.tagName,n=n.namespaceURI)n=f0(n),a=d0(n,a);else switch(a){case"svg":a=1;break;case"math":a=2;break;default:a=0}}Ke(xt),Oe(xt,a)}function ct(){Ke(xt),Ke(Dt),Ke(it)}function Ae(n){n.memoizedState!==null&&Oe(V,n);var a=xt.current,o=d0(a,n.type);a!==o&&(Oe(Dt,n),Oe(xt,o))}function Re(n){Dt.current===n&&(Ke(xt),Ke(Dt)),V.current===n&&(Ke(V),cl._currentValue=me)}var tt=Object.prototype.hasOwnProperty,De=r.unstable_scheduleCallback,O=r.unstable_cancelCallback,D=r.unstable_shouldYield,ne=r.unstable_requestPaint,fe=r.unstable_now,be=r.unstable_getCurrentPriorityLevel,ge=r.unstable_ImmediatePriority,qe=r.unstable_UserBlockingPriority,Ue=r.unstable_NormalPriority,Ve=r.unstable_LowPriority,Et=r.unstable_IdlePriority,Te=r.log,Ge=r.unstable_setDisableYieldValue,et=null,Ye=null;function We(n){if(Ye&&typeof Ye.onCommitFiberRoot=="function")try{Ye.onCommitFiberRoot(et,n,void 0,(n.current.flags&128)===128)}catch{}}function ft(n){if(typeof Te=="function"&&Ge(n),Ye&&typeof Ye.setStrictMode=="function")try{Ye.setStrictMode(et,n)}catch{}}var Qe=Math.clz32?Math.clz32:Be,Ht=Math.log,Z=Math.LN2;function Be(n){return n>>>=0,n===0?32:31-(Ht(n)/Z|0)|0}var ue=128,ve=4194304;function Pe(n){var a=n&42;if(a!==0)return a;switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194176;case 4194304:case 8388608:case 16777216:case 33554432:return n&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return n}}function Ie(n,a){var o=n.pendingLanes;if(o===0)return 0;var c=0,p=n.suspendedLanes,_=n.pingedLanes,w=n.warmLanes;n=n.finishedLanes!==0;var L=o&134217727;return L!==0?(o=L&~p,o!==0?c=Pe(o):(_&=L,_!==0?c=Pe(_):n||(w=L&~w,w!==0&&(c=Pe(w))))):(L=o&~p,L!==0?c=Pe(L):_!==0?c=Pe(_):n||(w=o&~w,w!==0&&(c=Pe(w)))),c===0?0:a!==0&&a!==c&&(a&p)===0&&(p=c&-c,w=a&-a,p>=w||p===32&&(w&4194176)!==0)?a:c}function at(n,a){return(n.pendingLanes&~(n.suspendedLanes&~n.pingedLanes)&a)===0}function Zt(n,a){switch(n){case 1:case 2:case 4:case 8:return a+250;case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return a+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function dn(){var n=ue;return ue<<=1,(ue&4194176)===0&&(ue=128),n}function Nt(){var n=ve;return ve<<=1,(ve&62914560)===0&&(ve=4194304),n}function In(n){for(var a=[],o=0;31>o;o++)a.push(n);return a}function Fn(n,a){n.pendingLanes|=a,a!==268435456&&(n.suspendedLanes=0,n.pingedLanes=0,n.warmLanes=0)}function Wl(n,a,o,c,p,_){var w=n.pendingLanes;n.pendingLanes=o,n.suspendedLanes=0,n.pingedLanes=0,n.warmLanes=0,n.expiredLanes&=o,n.entangledLanes&=o,n.errorRecoveryDisabledLanes&=o,n.shellSuspendCounter=0;var L=n.entanglements,B=n.expirationTimes,j=n.hiddenUpdates;for(o=w&~o;0<o;){var pe=31-Qe(o),Ee=1<<pe;L[pe]=0,B[pe]=-1;var oe=j[pe];if(oe!==null)for(j[pe]=null,pe=0;pe<oe.length;pe++){var he=oe[pe];he!==null&&(he.lane&=-536870913)}o&=~Ee}c!==0&&bo(n,c,0),_!==0&&p===0&&n.tag!==0&&(n.suspendedLanes|=_&~(w&~a))}function bo(n,a,o){n.pendingLanes|=a,n.suspendedLanes&=~a;var c=31-Qe(a);n.entangledLanes|=a,n.entanglements[c]=n.entanglements[c]|1073741824|o&4194218}function ki(n,a){var o=n.entangledLanes|=a;for(n=n.entanglements;o;){var c=31-Qe(o),p=1<<c;p&a|n[c]&a&&(n[c]|=a),o&=~p}}function es(n){return n&=-n,2<n?8<n?(n&134217727)!==0?32:268435456:8:2}function xo(){var n=Q.p;return n!==0?n:(n=window.event,n===void 0?32:D0(n.type))}function Xl(n,a){var o=Q.p;try{return Q.p=n,a()}finally{Q.p=o}}var ti=Math.random().toString(36).slice(2),hn="__reactFiber$"+ti,pn="__reactProps$"+ti,ea="__reactContainer$"+ti,ts="__reactEvents$"+ti,Qu="__reactListeners$"+ti,Ju="__reactHandles$"+ti,ql="__reactResources$"+ti,gr="__reactMarker$"+ti;function Eo(n){delete n[hn],delete n[pn],delete n[ts],delete n[Qu],delete n[Ju]}function ta(n){var a=n[hn];if(a)return a;for(var o=n.parentNode;o;){if(a=o[ea]||o[hn]){if(o=a.alternate,a.child!==null||o!==null&&o.child!==null)for(n=m0(n);n!==null;){if(o=n[hn])return o;n=m0(n)}return a}n=o,o=n.parentNode}return null}function U(n){if(n=n[hn]||n[ea]){var a=n.tag;if(a===5||a===6||a===13||a===26||a===27||a===3)return n}return null}function $(n){var a=n.tag;if(a===5||a===26||a===27||a===6)return n.stateNode;throw Error(i(33))}function se(n){var a=n[ql];return a||(a=n[ql]={hoistableStyles:new Map,hoistableScripts:new Map}),a}function ie(n){n[gr]=!0}var ee=new Set,Me={};function Le(n,a){ke(n,a),ke(n+"Capture",a)}function ke(n,a){for(Me[n]=a,n=0;n<a.length;n++)ee.add(a[n])}var ze=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),rt=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),st={},$e={};function Mt(n){return tt.call($e,n)?!0:tt.call(st,n)?!1:rt.test(n)?$e[n]=!0:(st[n]=!0,!1)}function St(n,a,o){if(Mt(a))if(o===null)n.removeAttribute(a);else{switch(typeof o){case"undefined":case"function":case"symbol":n.removeAttribute(a);return;case"boolean":var c=a.toLowerCase().slice(0,5);if(c!=="data-"&&c!=="aria-"){n.removeAttribute(a);return}}n.setAttribute(a,""+o)}}function Kt(n,a,o){if(o===null)n.removeAttribute(a);else{switch(typeof o){case"undefined":case"function":case"symbol":case"boolean":n.removeAttribute(a);return}n.setAttribute(a,""+o)}}function Lt(n,a,o,c){if(c===null)n.removeAttribute(o);else{switch(typeof c){case"undefined":case"function":case"symbol":case"boolean":n.removeAttribute(o);return}n.setAttributeNS(a,o,""+c)}}function ot(n){switch(typeof n){case"bigint":case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Je(n){var a=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(a==="checkbox"||a==="radio")}function mn(n){var a=Je(n)?"checked":"value",o=Object.getOwnPropertyDescriptor(n.constructor.prototype,a),c=""+n[a];if(!n.hasOwnProperty(a)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var p=o.get,_=o.set;return Object.defineProperty(n,a,{configurable:!0,get:function(){return p.call(this)},set:function(w){c=""+w,_.call(this,w)}}),Object.defineProperty(n,a,{enumerable:o.enumerable}),{getValue:function(){return c},setValue:function(w){c=""+w},stopTracking:function(){n._valueTracker=null,delete n[a]}}}}function wt(n){n._valueTracker||(n._valueTracker=mn(n))}function Kn(n){if(!n)return!1;var a=n._valueTracker;if(!a)return!0;var o=a.getValue(),c="";return n&&(c=Je(n)?n.checked?"true":"false":n.value),n=c,n!==o?(a.setValue(n),!0):!1}function wi(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}var Bn=/[\n"\\]/g;function bn(n){return n.replace(Bn,function(a){return"\\"+a.charCodeAt(0).toString(16)+" "})}function Vt(n,a,o,c,p,_,w,L){n.name="",w!=null&&typeof w!="function"&&typeof w!="symbol"&&typeof w!="boolean"?n.type=w:n.removeAttribute("type"),a!=null?w==="number"?(a===0&&n.value===""||n.value!=a)&&(n.value=""+ot(a)):n.value!==""+ot(a)&&(n.value=""+ot(a)):w!=="submit"&&w!=="reset"||n.removeAttribute("value"),a!=null?Nn(n,w,ot(a)):o!=null?Nn(n,w,ot(o)):c!=null&&n.removeAttribute("value"),p==null&&_!=null&&(n.defaultChecked=!!_),p!=null&&(n.checked=p&&typeof p!="function"&&typeof p!="symbol"),L!=null&&typeof L!="function"&&typeof L!="symbol"&&typeof L!="boolean"?n.name=""+ot(L):n.removeAttribute("name")}function zn(n,a,o,c,p,_,w,L){if(_!=null&&typeof _!="function"&&typeof _!="symbol"&&typeof _!="boolean"&&(n.type=_),a!=null||o!=null){if(!(_!=="submit"&&_!=="reset"||a!=null))return;o=o!=null?""+ot(o):"",a=a!=null?""+ot(a):o,L||a===n.value||(n.value=a),n.defaultValue=a}c=c??p,c=typeof c!="function"&&typeof c!="symbol"&&!!c,n.checked=L?n.checked:!!c,n.defaultChecked=!!c,w!=null&&typeof w!="function"&&typeof w!="symbol"&&typeof w!="boolean"&&(n.name=w)}function Nn(n,a,o){a==="number"&&wi(n.ownerDocument)===n||n.defaultValue===""+o||(n.defaultValue=""+o)}function tn(n,a,o,c){if(n=n.options,a){a={};for(var p=0;p<o.length;p++)a["$"+o[p]]=!0;for(o=0;o<n.length;o++)p=a.hasOwnProperty("$"+n[o].value),n[o].selected!==p&&(n[o].selected=p),p&&c&&(n[o].defaultSelected=!0)}else{for(o=""+ot(o),a=null,p=0;p<n.length;p++){if(n[p].value===o){n[p].selected=!0,c&&(n[p].defaultSelected=!0);return}a!==null||n[p].disabled||(a=n[p])}a!==null&&(a.selected=!0)}}function Tn(n,a,o){if(a!=null&&(a=""+ot(a),a!==n.value&&(n.value=a),o==null)){n.defaultValue!==a&&(n.defaultValue=a);return}n.defaultValue=o!=null?""+ot(o):""}function ns(n,a,o,c){if(a==null){if(c!=null){if(o!=null)throw Error(i(92));if(Ne(c)){if(1<c.length)throw Error(i(93));c=c[0]}o=c}o==null&&(o=""),a=o}o=ot(a),n.defaultValue=o,c=n.textContent,c===o&&c!==""&&c!==null&&(n.value=c)}function Zn(n,a){if(a){var o=n.firstChild;if(o&&o===n.lastChild&&o.nodeType===3){o.nodeValue=a;return}}n.textContent=a}var Qb=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function ym(n,a,o){var c=a.indexOf("--")===0;o==null||typeof o=="boolean"||o===""?c?n.setProperty(a,""):a==="float"?n.cssFloat="":n[a]="":c?n.setProperty(a,o):typeof o!="number"||o===0||Qb.has(a)?a==="float"?n.cssFloat=o:n[a]=(""+o).trim():n[a]=o+"px"}function bm(n,a,o){if(a!=null&&typeof a!="object")throw Error(i(62));if(n=n.style,o!=null){for(var c in o)!o.hasOwnProperty(c)||a!=null&&a.hasOwnProperty(c)||(c.indexOf("--")===0?n.setProperty(c,""):c==="float"?n.cssFloat="":n[c]="");for(var p in a)c=a[p],a.hasOwnProperty(p)&&o[p]!==c&&ym(n,p,c)}else for(var _ in a)a.hasOwnProperty(_)&&ym(n,_,a[_])}function ef(n){if(n.indexOf("-")===-1)return!1;switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Jb=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),ex=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Yl(n){return ex.test(""+n)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":n}var tf=null;function nf(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var is=null,as=null;function xm(n){var a=U(n);if(a&&(n=a.stateNode)){var o=n[pn]||null;e:switch(n=a.stateNode,a.type){case"input":if(Vt(n,o.value,o.defaultValue,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name),a=o.name,o.type==="radio"&&a!=null){for(o=n;o.parentNode;)o=o.parentNode;for(o=o.querySelectorAll('input[name="'+bn(""+a)+'"][type="radio"]'),a=0;a<o.length;a++){var c=o[a];if(c!==n&&c.form===n.form){var p=c[pn]||null;if(!p)throw Error(i(90));Vt(c,p.value,p.defaultValue,p.defaultValue,p.checked,p.defaultChecked,p.type,p.name)}}for(a=0;a<o.length;a++)c=o[a],c.form===n.form&&Kn(c)}break e;case"textarea":Tn(n,o.value,o.defaultValue);break e;case"select":a=o.value,a!=null&&tn(n,!!o.multiple,a,!1)}}}var af=!1;function Em(n,a,o){if(af)return n(a,o);af=!0;try{var c=n(a);return c}finally{if(af=!1,(is!==null||as!==null)&&(Dc(),is&&(a=is,n=as,as=is=null,xm(a),n)))for(a=0;a<n.length;a++)xm(n[a])}}function Mo(n,a){var o=n.stateNode;if(o===null)return null;var c=o[pn]||null;if(c===null)return null;o=c[a];e:switch(a){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(c=!c.disabled)||(n=n.type,c=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!c;break e;default:n=!1}if(n)return null;if(o&&typeof o!="function")throw Error(i(231,a,typeof o));return o}var rf=!1;if(ze)try{var So={};Object.defineProperty(So,"passive",{get:function(){rf=!0}}),window.addEventListener("test",So,So),window.removeEventListener("test",So,So)}catch{rf=!1}var Pa=null,sf=null,jl=null;function Mm(){if(jl)return jl;var n,a=sf,o=a.length,c,p="value"in Pa?Pa.value:Pa.textContent,_=p.length;for(n=0;n<o&&a[n]===p[n];n++);var w=o-n;for(c=1;c<=w&&a[o-c]===p[_-c];c++);return jl=p.slice(n,1<c?1-c:void 0)}function Kl(n){var a=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&a===13&&(n=13)):n=a,n===10&&(n=13),32<=n||n===13?n:0}function Zl(){return!0}function Sm(){return!1}function $n(n){function a(o,c,p,_,w){this._reactName=o,this._targetInst=p,this.type=c,this.nativeEvent=_,this.target=w,this.currentTarget=null;for(var L in n)n.hasOwnProperty(L)&&(o=n[L],this[L]=o?o(_):_[L]);return this.isDefaultPrevented=(_.defaultPrevented!=null?_.defaultPrevented:_.returnValue===!1)?Zl:Sm,this.isPropagationStopped=Sm,this}return C(a.prototype,{preventDefault:function(){this.defaultPrevented=!0;var o=this.nativeEvent;o&&(o.preventDefault?o.preventDefault():typeof o.returnValue!="unknown"&&(o.returnValue=!1),this.isDefaultPrevented=Zl)},stopPropagation:function(){var o=this.nativeEvent;o&&(o.stopPropagation?o.stopPropagation():typeof o.cancelBubble!="unknown"&&(o.cancelBubble=!0),this.isPropagationStopped=Zl)},persist:function(){},isPersistent:Zl}),a}var _r={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},$l=$n(_r),wo=C({},_r,{view:0,detail:0}),tx=$n(wo),of,lf,To,Ql=C({},wo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:uf,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==To&&(To&&n.type==="mousemove"?(of=n.screenX-To.screenX,lf=n.screenY-To.screenY):lf=of=0,To=n),of)},movementY:function(n){return"movementY"in n?n.movementY:lf}}),wm=$n(Ql),nx=C({},Ql,{dataTransfer:0}),ix=$n(nx),ax=C({},wo,{relatedTarget:0}),cf=$n(ax),rx=C({},_r,{animationName:0,elapsedTime:0,pseudoElement:0}),sx=$n(rx),ox=C({},_r,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),lx=$n(ox),cx=C({},_r,{data:0}),Tm=$n(cx),ux={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},fx={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},dx={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function hx(n){var a=this.nativeEvent;return a.getModifierState?a.getModifierState(n):(n=dx[n])?!!a[n]:!1}function uf(){return hx}var px=C({},wo,{key:function(n){if(n.key){var a=ux[n.key]||n.key;if(a!=="Unidentified")return a}return n.type==="keypress"?(n=Kl(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?fx[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:uf,charCode:function(n){return n.type==="keypress"?Kl(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?Kl(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),mx=$n(px),gx=C({},Ql,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Am=$n(gx),_x=C({},wo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:uf}),vx=$n(_x),yx=C({},_r,{propertyName:0,elapsedTime:0,pseudoElement:0}),bx=$n(yx),xx=C({},Ql,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),Ex=$n(xx),Mx=C({},_r,{newState:0,oldState:0}),Sx=$n(Mx),wx=[9,13,27,32],ff=ze&&"CompositionEvent"in window,Ao=null;ze&&"documentMode"in document&&(Ao=document.documentMode);var Tx=ze&&"TextEvent"in window&&!Ao,Rm=ze&&(!ff||Ao&&8<Ao&&11>=Ao),Cm=" ",Dm=!1;function Nm(n,a){switch(n){case"keyup":return wx.indexOf(a.keyCode)!==-1;case"keydown":return a.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Lm(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var rs=!1;function Ax(n,a){switch(n){case"compositionend":return Lm(a);case"keypress":return a.which!==32?null:(Dm=!0,Cm);case"textInput":return n=a.data,n===Cm&&Dm?null:n;default:return null}}function Rx(n,a){if(rs)return n==="compositionend"||!ff&&Nm(n,a)?(n=Mm(),jl=sf=Pa=null,rs=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(a.ctrlKey||a.altKey||a.metaKey)||a.ctrlKey&&a.altKey){if(a.char&&1<a.char.length)return a.char;if(a.which)return String.fromCharCode(a.which)}return null;case"compositionend":return Rm&&a.locale!=="ko"?null:a.data;default:return null}}var Cx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Um(n){var a=n&&n.nodeName&&n.nodeName.toLowerCase();return a==="input"?!!Cx[n.type]:a==="textarea"}function Pm(n,a,o,c){is?as?as.push(c):as=[c]:is=c,a=Oc(a,"onChange"),0<a.length&&(o=new $l("onChange","change",null,o,c),n.push({event:o,listeners:a}))}var Ro=null,Co=null;function Dx(n){s0(n,0)}function Jl(n){var a=$(n);if(Kn(a))return n}function Om(n,a){if(n==="change")return a}var Im=!1;if(ze){var df;if(ze){var hf="oninput"in document;if(!hf){var Fm=document.createElement("div");Fm.setAttribute("oninput","return;"),hf=typeof Fm.oninput=="function"}df=hf}else df=!1;Im=df&&(!document.documentMode||9<document.documentMode)}function Bm(){Ro&&(Ro.detachEvent("onpropertychange",zm),Co=Ro=null)}function zm(n){if(n.propertyName==="value"&&Jl(Co)){var a=[];Pm(a,Co,n,nf(n)),Em(Dx,a)}}function Nx(n,a,o){n==="focusin"?(Bm(),Ro=a,Co=o,Ro.attachEvent("onpropertychange",zm)):n==="focusout"&&Bm()}function Lx(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return Jl(Co)}function Ux(n,a){if(n==="click")return Jl(a)}function Px(n,a){if(n==="input"||n==="change")return Jl(a)}function Ox(n,a){return n===a&&(n!==0||1/n===1/a)||n!==n&&a!==a}var ni=typeof Object.is=="function"?Object.is:Ox;function Do(n,a){if(ni(n,a))return!0;if(typeof n!="object"||n===null||typeof a!="object"||a===null)return!1;var o=Object.keys(n),c=Object.keys(a);if(o.length!==c.length)return!1;for(c=0;c<o.length;c++){var p=o[c];if(!tt.call(a,p)||!ni(n[p],a[p]))return!1}return!0}function km(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Hm(n,a){var o=km(n);n=0;for(var c;o;){if(o.nodeType===3){if(c=n+o.textContent.length,n<=a&&c>=a)return{node:o,offset:a-n};n=c}e:{for(;o;){if(o.nextSibling){o=o.nextSibling;break e}o=o.parentNode}o=void 0}o=km(o)}}function Vm(n,a){return n&&a?n===a?!0:n&&n.nodeType===3?!1:a&&a.nodeType===3?Vm(n,a.parentNode):"contains"in n?n.contains(a):n.compareDocumentPosition?!!(n.compareDocumentPosition(a)&16):!1:!1}function Gm(n){n=n!=null&&n.ownerDocument!=null&&n.ownerDocument.defaultView!=null?n.ownerDocument.defaultView:window;for(var a=wi(n.document);a instanceof n.HTMLIFrameElement;){try{var o=typeof a.contentWindow.location.href=="string"}catch{o=!1}if(o)n=a.contentWindow;else break;a=wi(n.document)}return a}function pf(n){var a=n&&n.nodeName&&n.nodeName.toLowerCase();return a&&(a==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||a==="textarea"||n.contentEditable==="true")}function Ix(n,a){var o=Gm(a);a=n.focusedElem;var c=n.selectionRange;if(o!==a&&a&&a.ownerDocument&&Vm(a.ownerDocument.documentElement,a)){if(c!==null&&pf(a)){if(n=c.start,o=c.end,o===void 0&&(o=n),"selectionStart"in a)a.selectionStart=n,a.selectionEnd=Math.min(o,a.value.length);else if(o=(n=a.ownerDocument||document)&&n.defaultView||window,o.getSelection){o=o.getSelection();var p=a.textContent.length,_=Math.min(c.start,p);c=c.end===void 0?_:Math.min(c.end,p),!o.extend&&_>c&&(p=c,c=_,_=p),p=Hm(a,_);var w=Hm(a,c);p&&w&&(o.rangeCount!==1||o.anchorNode!==p.node||o.anchorOffset!==p.offset||o.focusNode!==w.node||o.focusOffset!==w.offset)&&(n=n.createRange(),n.setStart(p.node,p.offset),o.removeAllRanges(),_>c?(o.addRange(n),o.extend(w.node,w.offset)):(n.setEnd(w.node,w.offset),o.addRange(n)))}}for(n=[],o=a;o=o.parentNode;)o.nodeType===1&&n.push({element:o,left:o.scrollLeft,top:o.scrollTop});for(typeof a.focus=="function"&&a.focus(),a=0;a<n.length;a++)o=n[a],o.element.scrollLeft=o.left,o.element.scrollTop=o.top}}var Fx=ze&&"documentMode"in document&&11>=document.documentMode,ss=null,mf=null,No=null,gf=!1;function Wm(n,a,o){var c=o.window===o?o.document:o.nodeType===9?o:o.ownerDocument;gf||ss==null||ss!==wi(c)||(c=ss,"selectionStart"in c&&pf(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}),No&&Do(No,c)||(No=c,c=Oc(mf,"onSelect"),0<c.length&&(a=new $l("onSelect","select",null,a,o),n.push({event:a,listeners:c}),a.target=ss)))}function vr(n,a){var o={};return o[n.toLowerCase()]=a.toLowerCase(),o["Webkit"+n]="webkit"+a,o["Moz"+n]="moz"+a,o}var os={animationend:vr("Animation","AnimationEnd"),animationiteration:vr("Animation","AnimationIteration"),animationstart:vr("Animation","AnimationStart"),transitionrun:vr("Transition","TransitionRun"),transitionstart:vr("Transition","TransitionStart"),transitioncancel:vr("Transition","TransitionCancel"),transitionend:vr("Transition","TransitionEnd")},_f={},Xm={};ze&&(Xm=document.createElement("div").style,"AnimationEvent"in window||(delete os.animationend.animation,delete os.animationiteration.animation,delete os.animationstart.animation),"TransitionEvent"in window||delete os.transitionend.transition);function yr(n){if(_f[n])return _f[n];if(!os[n])return n;var a=os[n],o;for(o in a)if(a.hasOwnProperty(o)&&o in Xm)return _f[n]=a[o];return n}var qm=yr("animationend"),Ym=yr("animationiteration"),jm=yr("animationstart"),Bx=yr("transitionrun"),zx=yr("transitionstart"),kx=yr("transitioncancel"),Km=yr("transitionend"),Zm=new Map,$m="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll scrollEnd toggle touchMove waiting wheel".split(" ");function Ti(n,a){Zm.set(n,a),Le(a,[n])}var ui=[],ls=0,vf=0;function ec(){for(var n=ls,a=vf=ls=0;a<n;){var o=ui[a];ui[a++]=null;var c=ui[a];ui[a++]=null;var p=ui[a];ui[a++]=null;var _=ui[a];if(ui[a++]=null,c!==null&&p!==null){var w=c.pending;w===null?p.next=p:(p.next=w.next,w.next=p),c.pending=p}_!==0&&Qm(o,p,_)}}function tc(n,a,o,c){ui[ls++]=n,ui[ls++]=a,ui[ls++]=o,ui[ls++]=c,vf|=c,n.lanes|=c,n=n.alternate,n!==null&&(n.lanes|=c)}function yf(n,a,o,c){return tc(n,a,o,c),nc(n)}function Oa(n,a){return tc(n,null,null,a),nc(n)}function Qm(n,a,o){n.lanes|=o;var c=n.alternate;c!==null&&(c.lanes|=o);for(var p=!1,_=n.return;_!==null;)_.childLanes|=o,c=_.alternate,c!==null&&(c.childLanes|=o),_.tag===22&&(n=_.stateNode,n===null||n._visibility&1||(p=!0)),n=_,_=_.return;p&&a!==null&&n.tag===3&&(_=n.stateNode,p=31-Qe(o),_=_.hiddenUpdates,n=_[p],n===null?_[p]=[a]:n.push(a),a.lane=o|536870912)}function nc(n){if(50<nl)throw nl=0,wd=null,Error(i(185));for(var a=n.return;a!==null;)n=a,a=n.return;return n.tag===3?n.stateNode:null}var cs={},Jm=new WeakMap;function fi(n,a){if(typeof n=="object"&&n!==null){var o=Jm.get(n);return o!==void 0?o:(a={value:n,source:a,stack:le(a)},Jm.set(n,a),a)}return{value:n,source:a,stack:le(a)}}var us=[],fs=0,ic=null,ac=0,di=[],hi=0,br=null,na=1,ia="";function xr(n,a){us[fs++]=ac,us[fs++]=ic,ic=n,ac=a}function eg(n,a,o){di[hi++]=na,di[hi++]=ia,di[hi++]=br,br=n;var c=na;n=ia;var p=32-Qe(c)-1;c&=~(1<<p),o+=1;var _=32-Qe(a)+p;if(30<_){var w=p-p%5;_=(c&(1<<w)-1).toString(32),c>>=w,p-=w,na=1<<32-Qe(a)+p|o<<p|c,ia=_+n}else na=1<<_|o<<p|c,ia=n}function bf(n){n.return!==null&&(xr(n,1),eg(n,1,0))}function xf(n){for(;n===ic;)ic=us[--fs],us[fs]=null,ac=us[--fs],us[fs]=null;for(;n===br;)br=di[--hi],di[hi]=null,ia=di[--hi],di[hi]=null,na=di[--hi],di[hi]=null}var kn=null,An=null,Ut=!1,Ai=null,Hi=!1,Ef=Error(i(519));function Er(n){var a=Error(i(418,""));throw Po(fi(a,n)),Ef}function tg(n){var a=n.stateNode,o=n.type,c=n.memoizedProps;switch(a[hn]=n,a[pn]=c,o){case"dialog":Tt("cancel",a),Tt("close",a);break;case"iframe":case"object":case"embed":Tt("load",a);break;case"video":case"audio":for(o=0;o<al.length;o++)Tt(al[o],a);break;case"source":Tt("error",a);break;case"img":case"image":case"link":Tt("error",a),Tt("load",a);break;case"details":Tt("toggle",a);break;case"input":Tt("invalid",a),zn(a,c.value,c.defaultValue,c.checked,c.defaultChecked,c.type,c.name,!0),wt(a);break;case"select":Tt("invalid",a);break;case"textarea":Tt("invalid",a),ns(a,c.value,c.defaultValue,c.children),wt(a)}o=c.children,typeof o!="string"&&typeof o!="number"&&typeof o!="bigint"||a.textContent===""+o||c.suppressHydrationWarning===!0||u0(a.textContent,o)?(c.popover!=null&&(Tt("beforetoggle",a),Tt("toggle",a)),c.onScroll!=null&&Tt("scroll",a),c.onScrollEnd!=null&&Tt("scrollend",a),c.onClick!=null&&(a.onclick=Ic),a=!0):a=!1,a||Er(n)}function ng(n){for(kn=n.return;kn;)switch(kn.tag){case 3:case 27:Hi=!0;return;case 5:case 13:Hi=!1;return;default:kn=kn.return}}function Lo(n){if(n!==kn)return!1;if(!Ut)return ng(n),Ut=!0,!1;var a=!1,o;if((o=n.tag!==3&&n.tag!==27)&&((o=n.tag===5)&&(o=n.type,o=!(o!=="form"&&o!=="button")||Vd(n.type,n.memoizedProps)),o=!o),o&&(a=!0),a&&An&&Er(n),ng(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(i(317));e:{for(n=n.nextSibling,a=0;n;){if(n.nodeType===8)if(o=n.data,o==="/$"){if(a===0){An=Ci(n.nextSibling);break e}a--}else o!=="$"&&o!=="$!"&&o!=="$?"||a++;n=n.nextSibling}An=null}}else An=kn?Ci(n.stateNode.nextSibling):null;return!0}function Uo(){An=kn=null,Ut=!1}function Po(n){Ai===null?Ai=[n]:Ai.push(n)}var Oo=Error(i(460)),ig=Error(i(474)),Mf={then:function(){}};function ag(n){return n=n.status,n==="fulfilled"||n==="rejected"}function rc(){}function rg(n,a,o){switch(o=n[o],o===void 0?n.push(a):o!==a&&(a.then(rc,rc),a=o),a.status){case"fulfilled":return a.value;case"rejected":throw n=a.reason,n===Oo?Error(i(483)):n;default:if(typeof a.status=="string")a.then(rc,rc);else{if(n=Yt,n!==null&&100<n.shellSuspendCounter)throw Error(i(482));n=a,n.status="pending",n.then(function(c){if(a.status==="pending"){var p=a;p.status="fulfilled",p.value=c}},function(c){if(a.status==="pending"){var p=a;p.status="rejected",p.reason=c}})}switch(a.status){case"fulfilled":return a.value;case"rejected":throw n=a.reason,n===Oo?Error(i(483)):n}throw Io=a,Oo}}var Io=null;function sg(){if(Io===null)throw Error(i(459));var n=Io;return Io=null,n}var ds=null,Fo=0;function sc(n){var a=Fo;return Fo+=1,ds===null&&(ds=[]),rg(ds,n,a)}function Bo(n,a){a=a.props.ref,n.ref=a!==void 0?a:null}function oc(n,a){throw a.$$typeof===l?Error(i(525)):(n=Object.prototype.toString.call(a),Error(i(31,n==="[object Object]"?"object with keys {"+Object.keys(a).join(", ")+"}":n)))}function og(n){var a=n._init;return a(n._payload)}function lg(n){function a(te,q){if(n){var ae=te.deletions;ae===null?(te.deletions=[q],te.flags|=16):ae.push(q)}}function o(te,q){if(!n)return null;for(;q!==null;)a(te,q),q=q.sibling;return null}function c(te){for(var q=new Map;te!==null;)te.key!==null?q.set(te.key,te):q.set(te.index,te),te=te.sibling;return q}function p(te,q){return te=Ya(te,q),te.index=0,te.sibling=null,te}function _(te,q,ae){return te.index=ae,n?(ae=te.alternate,ae!==null?(ae=ae.index,ae<q?(te.flags|=33554434,q):ae):(te.flags|=33554434,q)):(te.flags|=1048576,q)}function w(te){return n&&te.alternate===null&&(te.flags|=33554434),te}function L(te,q,ae,_e){return q===null||q.tag!==6?(q=_d(ae,te.mode,_e),q.return=te,q):(q=p(q,ae),q.return=te,q)}function B(te,q,ae,_e){var Xe=ae.type;return Xe===d?pe(te,q,ae.props.children,_e,ae.key):q!==null&&(q.elementType===Xe||typeof Xe=="object"&&Xe!==null&&Xe.$$typeof===T&&og(Xe)===q.type)?(q=p(q,ae.props),Bo(q,ae),q.return=te,q):(q=wc(ae.type,ae.key,ae.props,null,te.mode,_e),Bo(q,ae),q.return=te,q)}function j(te,q,ae,_e){return q===null||q.tag!==4||q.stateNode.containerInfo!==ae.containerInfo||q.stateNode.implementation!==ae.implementation?(q=vd(ae,te.mode,_e),q.return=te,q):(q=p(q,ae.children||[]),q.return=te,q)}function pe(te,q,ae,_e,Xe){return q===null||q.tag!==7?(q=Lr(ae,te.mode,_e,Xe),q.return=te,q):(q=p(q,ae),q.return=te,q)}function Ee(te,q,ae){if(typeof q=="string"&&q!==""||typeof q=="number"||typeof q=="bigint")return q=_d(""+q,te.mode,ae),q.return=te,q;if(typeof q=="object"&&q!==null){switch(q.$$typeof){case u:return ae=wc(q.type,q.key,q.props,null,te.mode,ae),Bo(ae,q),ae.return=te,ae;case f:return q=vd(q,te.mode,ae),q.return=te,q;case T:var _e=q._init;return q=_e(q._payload),Ee(te,q,ae)}if(Ne(q)||F(q))return q=Lr(q,te.mode,ae,null),q.return=te,q;if(typeof q.then=="function")return Ee(te,sc(q),ae);if(q.$$typeof===b)return Ee(te,Ec(te,q),ae);oc(te,q)}return null}function oe(te,q,ae,_e){var Xe=q!==null?q.key:null;if(typeof ae=="string"&&ae!==""||typeof ae=="number"||typeof ae=="bigint")return Xe!==null?null:L(te,q,""+ae,_e);if(typeof ae=="object"&&ae!==null){switch(ae.$$typeof){case u:return ae.key===Xe?B(te,q,ae,_e):null;case f:return ae.key===Xe?j(te,q,ae,_e):null;case T:return Xe=ae._init,ae=Xe(ae._payload),oe(te,q,ae,_e)}if(Ne(ae)||F(ae))return Xe!==null?null:pe(te,q,ae,_e,null);if(typeof ae.then=="function")return oe(te,q,sc(ae),_e);if(ae.$$typeof===b)return oe(te,q,Ec(te,ae),_e);oc(te,ae)}return null}function he(te,q,ae,_e,Xe){if(typeof _e=="string"&&_e!==""||typeof _e=="number"||typeof _e=="bigint")return te=te.get(ae)||null,L(q,te,""+_e,Xe);if(typeof _e=="object"&&_e!==null){switch(_e.$$typeof){case u:return te=te.get(_e.key===null?ae:_e.key)||null,B(q,te,_e,Xe);case f:return te=te.get(_e.key===null?ae:_e.key)||null,j(q,te,_e,Xe);case T:var _t=_e._init;return _e=_t(_e._payload),he(te,q,ae,_e,Xe)}if(Ne(_e)||F(_e))return te=te.get(ae)||null,pe(q,te,_e,Xe,null);if(typeof _e.then=="function")return he(te,q,ae,sc(_e),Xe);if(_e.$$typeof===b)return he(te,q,ae,Ec(q,_e),Xe);oc(q,_e)}return null}function je(te,q,ae,_e){for(var Xe=null,_t=null,Ze=q,nt=q=0,Mn=null;Ze!==null&&nt<ae.length;nt++){Ze.index>nt?(Mn=Ze,Ze=null):Mn=Ze.sibling;var Pt=oe(te,Ze,ae[nt],_e);if(Pt===null){Ze===null&&(Ze=Mn);break}n&&Ze&&Pt.alternate===null&&a(te,Ze),q=_(Pt,q,nt),_t===null?Xe=Pt:_t.sibling=Pt,_t=Pt,Ze=Mn}if(nt===ae.length)return o(te,Ze),Ut&&xr(te,nt),Xe;if(Ze===null){for(;nt<ae.length;nt++)Ze=Ee(te,ae[nt],_e),Ze!==null&&(q=_(Ze,q,nt),_t===null?Xe=Ze:_t.sibling=Ze,_t=Ze);return Ut&&xr(te,nt),Xe}for(Ze=c(Ze);nt<ae.length;nt++)Mn=he(Ze,te,nt,ae[nt],_e),Mn!==null&&(n&&Mn.alternate!==null&&Ze.delete(Mn.key===null?nt:Mn.key),q=_(Mn,q,nt),_t===null?Xe=Mn:_t.sibling=Mn,_t=Mn);return n&&Ze.forEach(function(er){return a(te,er)}),Ut&&xr(te,nt),Xe}function ut(te,q,ae,_e){if(ae==null)throw Error(i(151));for(var Xe=null,_t=null,Ze=q,nt=q=0,Mn=null,Pt=ae.next();Ze!==null&&!Pt.done;nt++,Pt=ae.next()){Ze.index>nt?(Mn=Ze,Ze=null):Mn=Ze.sibling;var er=oe(te,Ze,Pt.value,_e);if(er===null){Ze===null&&(Ze=Mn);break}n&&Ze&&er.alternate===null&&a(te,Ze),q=_(er,q,nt),_t===null?Xe=er:_t.sibling=er,_t=er,Ze=Mn}if(Pt.done)return o(te,Ze),Ut&&xr(te,nt),Xe;if(Ze===null){for(;!Pt.done;nt++,Pt=ae.next())Pt=Ee(te,Pt.value,_e),Pt!==null&&(q=_(Pt,q,nt),_t===null?Xe=Pt:_t.sibling=Pt,_t=Pt);return Ut&&xr(te,nt),Xe}for(Ze=c(Ze);!Pt.done;nt++,Pt=ae.next())Pt=he(Ze,te,nt,Pt.value,_e),Pt!==null&&(n&&Pt.alternate!==null&&Ze.delete(Pt.key===null?nt:Pt.key),q=_(Pt,q,nt),_t===null?Xe=Pt:_t.sibling=Pt,_t=Pt);return n&&Ze.forEach(function(eM){return a(te,eM)}),Ut&&xr(te,nt),Xe}function rn(te,q,ae,_e){if(typeof ae=="object"&&ae!==null&&ae.type===d&&ae.key===null&&(ae=ae.props.children),typeof ae=="object"&&ae!==null){switch(ae.$$typeof){case u:e:{for(var Xe=ae.key;q!==null;){if(q.key===Xe){if(Xe=ae.type,Xe===d){if(q.tag===7){o(te,q.sibling),_e=p(q,ae.props.children),_e.return=te,te=_e;break e}}else if(q.elementType===Xe||typeof Xe=="object"&&Xe!==null&&Xe.$$typeof===T&&og(Xe)===q.type){o(te,q.sibling),_e=p(q,ae.props),Bo(_e,ae),_e.return=te,te=_e;break e}o(te,q);break}else a(te,q);q=q.sibling}ae.type===d?(_e=Lr(ae.props.children,te.mode,_e,ae.key),_e.return=te,te=_e):(_e=wc(ae.type,ae.key,ae.props,null,te.mode,_e),Bo(_e,ae),_e.return=te,te=_e)}return w(te);case f:e:{for(Xe=ae.key;q!==null;){if(q.key===Xe)if(q.tag===4&&q.stateNode.containerInfo===ae.containerInfo&&q.stateNode.implementation===ae.implementation){o(te,q.sibling),_e=p(q,ae.children||[]),_e.return=te,te=_e;break e}else{o(te,q);break}else a(te,q);q=q.sibling}_e=vd(ae,te.mode,_e),_e.return=te,te=_e}return w(te);case T:return Xe=ae._init,ae=Xe(ae._payload),rn(te,q,ae,_e)}if(Ne(ae))return je(te,q,ae,_e);if(F(ae)){if(Xe=F(ae),typeof Xe!="function")throw Error(i(150));return ae=Xe.call(ae),ut(te,q,ae,_e)}if(typeof ae.then=="function")return rn(te,q,sc(ae),_e);if(ae.$$typeof===b)return rn(te,q,Ec(te,ae),_e);oc(te,ae)}return typeof ae=="string"&&ae!==""||typeof ae=="number"||typeof ae=="bigint"?(ae=""+ae,q!==null&&q.tag===6?(o(te,q.sibling),_e=p(q,ae),_e.return=te,te=_e):(o(te,q),_e=_d(ae,te.mode,_e),_e.return=te,te=_e),w(te)):o(te,q)}return function(te,q,ae,_e){try{Fo=0;var Xe=rn(te,q,ae,_e);return ds=null,Xe}catch(Ze){if(Ze===Oo)throw Ze;var _t=_i(29,Ze,null,te.mode);return _t.lanes=_e,_t.return=te,_t}finally{}}}var Mr=lg(!0),cg=lg(!1),hs=Ce(null),lc=Ce(0);function ug(n,a){n=pa,Oe(lc,n),Oe(hs,a),pa=n|a.baseLanes}function Sf(){Oe(lc,pa),Oe(hs,hs.current)}function wf(){pa=lc.current,Ke(hs),Ke(lc)}var pi=Ce(null),Vi=null;function Ia(n){var a=n.alternate;Oe(gn,gn.current&1),Oe(pi,n),Vi===null&&(a===null||hs.current!==null||a.memoizedState!==null)&&(Vi=n)}function fg(n){if(n.tag===22){if(Oe(gn,gn.current),Oe(pi,n),Vi===null){var a=n.alternate;a!==null&&a.memoizedState!==null&&(Vi=n)}}else Fa()}function Fa(){Oe(gn,gn.current),Oe(pi,pi.current)}function aa(n){Ke(pi),Vi===n&&(Vi=null),Ke(gn)}var gn=Ce(0);function cc(n){for(var a=n;a!==null;){if(a.tag===13){var o=a.memoizedState;if(o!==null&&(o=o.dehydrated,o===null||o.data==="$?"||o.data==="$!"))return a}else if(a.tag===19&&a.memoizedProps.revealOrder!==void 0){if((a.flags&128)!==0)return a}else if(a.child!==null){a.child.return=a,a=a.child;continue}if(a===n)break;for(;a.sibling===null;){if(a.return===null||a.return===n)return null;a=a.return}a.sibling.return=a.return,a=a.sibling}return null}var Hx=typeof AbortController<"u"?AbortController:function(){var n=[],a=this.signal={aborted:!1,addEventListener:function(o,c){n.push(c)}};this.abort=function(){a.aborted=!0,n.forEach(function(o){return o()})}},Vx=r.unstable_scheduleCallback,Gx=r.unstable_NormalPriority,_n={$$typeof:b,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Tf(){return{controller:new Hx,data:new Map,refCount:0}}function zo(n){n.refCount--,n.refCount===0&&Vx(Gx,function(){n.controller.abort()})}var ko=null,Af=0,ps=0,ms=null;function Wx(n,a){if(ko===null){var o=ko=[];Af=0,ps=Ud(),ms={status:"pending",value:void 0,then:function(c){o.push(c)}}}return Af++,a.then(dg,dg),a}function dg(){if(--Af===0&&ko!==null){ms!==null&&(ms.status="fulfilled");var n=ko;ko=null,ps=0,ms=null;for(var a=0;a<n.length;a++)(0,n[a])()}}function Xx(n,a){var o=[],c={status:"pending",value:null,reason:null,then:function(p){o.push(p)}};return n.then(function(){c.status="fulfilled",c.value=a;for(var p=0;p<o.length;p++)(0,o[p])(a)},function(p){for(c.status="rejected",c.reason=p,p=0;p<o.length;p++)(0,o[p])(void 0)}),c}var hg=R.S;R.S=function(n,a){typeof a=="object"&&a!==null&&typeof a.then=="function"&&Wx(n,a),hg!==null&&hg(n,a)};var Sr=Ce(null);function Rf(){var n=Sr.current;return n!==null?n:Yt.pooledCache}function uc(n,a){a===null?Oe(Sr,Sr.current):Oe(Sr,a.pool)}function pg(){var n=Rf();return n===null?null:{parent:_n._currentValue,pool:n}}var Ba=0,gt=null,Gt=null,ln=null,fc=!1,gs=!1,wr=!1,dc=0,Ho=0,_s=null,qx=0;function sn(){throw Error(i(321))}function Cf(n,a){if(a===null)return!1;for(var o=0;o<a.length&&o<n.length;o++)if(!ni(n[o],a[o]))return!1;return!0}function Df(n,a,o,c,p,_){return Ba=_,gt=a,a.memoizedState=null,a.updateQueue=null,a.lanes=0,R.H=n===null||n.memoizedState===null?Tr:za,wr=!1,_=o(c,p),wr=!1,gs&&(_=gg(a,o,c,p)),mg(n),_}function mg(n){R.H=Gi;var a=Gt!==null&&Gt.next!==null;if(Ba=0,ln=Gt=gt=null,fc=!1,Ho=0,_s=null,a)throw Error(i(300));n===null||xn||(n=n.dependencies,n!==null&&xc(n)&&(xn=!0))}function gg(n,a,o,c){gt=n;var p=0;do{if(gs&&(_s=null),Ho=0,gs=!1,25<=p)throw Error(i(301));if(p+=1,ln=Gt=null,n.updateQueue!=null){var _=n.updateQueue;_.lastEffect=null,_.events=null,_.stores=null,_.memoCache!=null&&(_.memoCache.index=0)}R.H=Ar,_=a(o,c)}while(gs);return _}function Yx(){var n=R.H,a=n.useState()[0];return a=typeof a.then=="function"?Vo(a):a,n=n.useState()[0],(Gt!==null?Gt.memoizedState:null)!==n&&(gt.flags|=1024),a}function Nf(){var n=dc!==0;return dc=0,n}function Lf(n,a,o){a.updateQueue=n.updateQueue,a.flags&=-2053,n.lanes&=~o}function Uf(n){if(fc){for(n=n.memoizedState;n!==null;){var a=n.queue;a!==null&&(a.pending=null),n=n.next}fc=!1}Ba=0,ln=Gt=gt=null,gs=!1,Ho=dc=0,_s=null}function Qn(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ln===null?gt.memoizedState=ln=n:ln=ln.next=n,ln}function cn(){if(Gt===null){var n=gt.alternate;n=n!==null?n.memoizedState:null}else n=Gt.next;var a=ln===null?gt.memoizedState:ln.next;if(a!==null)ln=a,Gt=n;else{if(n===null)throw gt.alternate===null?Error(i(467)):Error(i(310));Gt=n,n={memoizedState:Gt.memoizedState,baseState:Gt.baseState,baseQueue:Gt.baseQueue,queue:Gt.queue,next:null},ln===null?gt.memoizedState=ln=n:ln=ln.next=n}return ln}var hc;hc=function(){return{lastEffect:null,events:null,stores:null,memoCache:null}};function Vo(n){var a=Ho;return Ho+=1,_s===null&&(_s=[]),n=rg(_s,n,a),a=gt,(ln===null?a.memoizedState:ln.next)===null&&(a=a.alternate,R.H=a===null||a.memoizedState===null?Tr:za),n}function pc(n){if(n!==null&&typeof n=="object"){if(typeof n.then=="function")return Vo(n);if(n.$$typeof===b)return Ln(n)}throw Error(i(438,String(n)))}function Pf(n){var a=null,o=gt.updateQueue;if(o!==null&&(a=o.memoCache),a==null){var c=gt.alternate;c!==null&&(c=c.updateQueue,c!==null&&(c=c.memoCache,c!=null&&(a={data:c.data.map(function(p){return p.slice()}),index:0})))}if(a==null&&(a={data:[],index:0}),o===null&&(o=hc(),gt.updateQueue=o),o.memoCache=a,o=a.data[a.index],o===void 0)for(o=a.data[a.index]=Array(n),c=0;c<n;c++)o[c]=A;return a.index++,o}function ra(n,a){return typeof a=="function"?a(n):a}function mc(n){var a=cn();return Of(a,Gt,n)}function Of(n,a,o){var c=n.queue;if(c===null)throw Error(i(311));c.lastRenderedReducer=o;var p=n.baseQueue,_=c.pending;if(_!==null){if(p!==null){var w=p.next;p.next=_.next,_.next=w}a.baseQueue=p=_,c.pending=null}if(_=n.baseState,p===null)n.memoizedState=_;else{a=p.next;var L=w=null,B=null,j=a,pe=!1;do{var Ee=j.lane&-536870913;if(Ee!==j.lane?(At&Ee)===Ee:(Ba&Ee)===Ee){var oe=j.revertLane;if(oe===0)B!==null&&(B=B.next={lane:0,revertLane:0,action:j.action,hasEagerState:j.hasEagerState,eagerState:j.eagerState,next:null}),Ee===ps&&(pe=!0);else if((Ba&oe)===oe){j=j.next,oe===ps&&(pe=!0);continue}else Ee={lane:0,revertLane:j.revertLane,action:j.action,hasEagerState:j.hasEagerState,eagerState:j.eagerState,next:null},B===null?(L=B=Ee,w=_):B=B.next=Ee,gt.lanes|=oe,ja|=oe;Ee=j.action,wr&&o(_,Ee),_=j.hasEagerState?j.eagerState:o(_,Ee)}else oe={lane:Ee,revertLane:j.revertLane,action:j.action,hasEagerState:j.hasEagerState,eagerState:j.eagerState,next:null},B===null?(L=B=oe,w=_):B=B.next=oe,gt.lanes|=Ee,ja|=Ee;j=j.next}while(j!==null&&j!==a);if(B===null?w=_:B.next=L,!ni(_,n.memoizedState)&&(xn=!0,pe&&(o=ms,o!==null)))throw o;n.memoizedState=_,n.baseState=w,n.baseQueue=B,c.lastRenderedState=_}return p===null&&(c.lanes=0),[n.memoizedState,c.dispatch]}function If(n){var a=cn(),o=a.queue;if(o===null)throw Error(i(311));o.lastRenderedReducer=n;var c=o.dispatch,p=o.pending,_=a.memoizedState;if(p!==null){o.pending=null;var w=p=p.next;do _=n(_,w.action),w=w.next;while(w!==p);ni(_,a.memoizedState)||(xn=!0),a.memoizedState=_,a.baseQueue===null&&(a.baseState=_),o.lastRenderedState=_}return[_,c]}function _g(n,a,o){var c=gt,p=cn(),_=Ut;if(_){if(o===void 0)throw Error(i(407));o=o()}else o=a();var w=!ni((Gt||p).memoizedState,o);if(w&&(p.memoizedState=o,xn=!0),p=p.queue,zf(bg.bind(null,c,p,n),[n]),p.getSnapshot!==a||w||ln!==null&&ln.memoizedState.tag&1){if(c.flags|=2048,vs(9,yg.bind(null,c,p,o,a),{destroy:void 0},null),Yt===null)throw Error(i(349));_||(Ba&60)!==0||vg(c,a,o)}return o}function vg(n,a,o){n.flags|=16384,n={getSnapshot:a,value:o},a=gt.updateQueue,a===null?(a=hc(),gt.updateQueue=a,a.stores=[n]):(o=a.stores,o===null?a.stores=[n]:o.push(n))}function yg(n,a,o,c){a.value=o,a.getSnapshot=c,xg(a)&&Eg(n)}function bg(n,a,o){return o(function(){xg(a)&&Eg(n)})}function xg(n){var a=n.getSnapshot;n=n.value;try{var o=a();return!ni(n,o)}catch{return!0}}function Eg(n){var a=Oa(n,2);a!==null&&Hn(a,n,2)}function Ff(n){var a=Qn();if(typeof n=="function"){var o=n;if(n=o(),wr){ft(!0);try{o()}finally{ft(!1)}}}return a.memoizedState=a.baseState=n,a.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:ra,lastRenderedState:n},a}function Mg(n,a,o,c){return n.baseState=o,Of(n,Gt,typeof c=="function"?c:ra)}function jx(n,a,o,c,p){if(vc(n))throw Error(i(485));if(n=a.action,n!==null){var _={payload:p,action:n,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(w){_.listeners.push(w)}};R.T!==null?o(!0):_.isTransition=!1,c(_),o=a.pending,o===null?(_.next=a.pending=_,Sg(a,_)):(_.next=o.next,a.pending=o.next=_)}}function Sg(n,a){var o=a.action,c=a.payload,p=n.state;if(a.isTransition){var _=R.T,w={};R.T=w;try{var L=o(p,c),B=R.S;B!==null&&B(w,L),wg(n,a,L)}catch(j){Bf(n,a,j)}finally{R.T=_}}else try{_=o(p,c),wg(n,a,_)}catch(j){Bf(n,a,j)}}function wg(n,a,o){o!==null&&typeof o=="object"&&typeof o.then=="function"?o.then(function(c){Tg(n,a,c)},function(c){return Bf(n,a,c)}):Tg(n,a,o)}function Tg(n,a,o){a.status="fulfilled",a.value=o,Ag(a),n.state=o,a=n.pending,a!==null&&(o=a.next,o===a?n.pending=null:(o=o.next,a.next=o,Sg(n,o)))}function Bf(n,a,o){var c=n.pending;if(n.pending=null,c!==null){c=c.next;do a.status="rejected",a.reason=o,Ag(a),a=a.next;while(a!==c)}n.action=null}function Ag(n){n=n.listeners;for(var a=0;a<n.length;a++)(0,n[a])()}function Rg(n,a){return a}function Cg(n,a){if(Ut){var o=Yt.formState;if(o!==null){e:{var c=gt;if(Ut){if(An){t:{for(var p=An,_=Hi;p.nodeType!==8;){if(!_){p=null;break t}if(p=Ci(p.nextSibling),p===null){p=null;break t}}_=p.data,p=_==="F!"||_==="F"?p:null}if(p){An=Ci(p.nextSibling),c=p.data==="F!";break e}}Er(c)}c=!1}c&&(a=o[0])}}return o=Qn(),o.memoizedState=o.baseState=a,c={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Rg,lastRenderedState:a},o.queue=c,o=Yg.bind(null,gt,c),c.dispatch=o,c=Ff(!1),_=Wf.bind(null,gt,!1,c.queue),c=Qn(),p={state:a,dispatch:null,action:n,pending:null},c.queue=p,o=jx.bind(null,gt,p,_,o),p.dispatch=o,c.memoizedState=n,[a,o,!1]}function Dg(n){var a=cn();return Ng(a,Gt,n)}function Ng(n,a,o){a=Of(n,a,Rg)[0],n=mc(ra)[0],a=typeof a=="object"&&a!==null&&typeof a.then=="function"?Vo(a):a;var c=cn(),p=c.queue,_=p.dispatch;return o!==c.memoizedState&&(gt.flags|=2048,vs(9,Kx.bind(null,p,o),{destroy:void 0},null)),[a,_,n]}function Kx(n,a){n.action=a}function Lg(n){var a=cn(),o=Gt;if(o!==null)return Ng(a,o,n);cn(),a=a.memoizedState,o=cn();var c=o.queue.dispatch;return o.memoizedState=n,[a,c,!1]}function vs(n,a,o,c){return n={tag:n,create:a,inst:o,deps:c,next:null},a=gt.updateQueue,a===null&&(a=hc(),gt.updateQueue=a),o=a.lastEffect,o===null?a.lastEffect=n.next=n:(c=o.next,o.next=n,n.next=c,a.lastEffect=n),n}function Ug(){return cn().memoizedState}function gc(n,a,o,c){var p=Qn();gt.flags|=n,p.memoizedState=vs(1|a,o,{destroy:void 0},c===void 0?null:c)}function _c(n,a,o,c){var p=cn();c=c===void 0?null:c;var _=p.memoizedState.inst;Gt!==null&&c!==null&&Cf(c,Gt.memoizedState.deps)?p.memoizedState=vs(a,o,_,c):(gt.flags|=n,p.memoizedState=vs(1|a,o,_,c))}function Pg(n,a){gc(8390656,8,n,a)}function zf(n,a){_c(2048,8,n,a)}function Og(n,a){return _c(4,2,n,a)}function Ig(n,a){return _c(4,4,n,a)}function Fg(n,a){if(typeof a=="function"){n=n();var o=a(n);return function(){typeof o=="function"?o():a(null)}}if(a!=null)return n=n(),a.current=n,function(){a.current=null}}function Bg(n,a,o){o=o!=null?o.concat([n]):null,_c(4,4,Fg.bind(null,a,n),o)}function kf(){}function zg(n,a){var o=cn();a=a===void 0?null:a;var c=o.memoizedState;return a!==null&&Cf(a,c[1])?c[0]:(o.memoizedState=[n,a],n)}function kg(n,a){var o=cn();a=a===void 0?null:a;var c=o.memoizedState;if(a!==null&&Cf(a,c[1]))return c[0];if(c=n(),wr){ft(!0);try{n()}finally{ft(!1)}}return o.memoizedState=[c,a],c}function Hf(n,a,o){return o===void 0||(Ba&1073741824)!==0?n.memoizedState=a:(n.memoizedState=o,n=V_(),gt.lanes|=n,ja|=n,o)}function Hg(n,a,o,c){return ni(o,a)?o:hs.current!==null?(n=Hf(n,o,c),ni(n,a)||(xn=!0),n):(Ba&42)===0?(xn=!0,n.memoizedState=o):(n=V_(),gt.lanes|=n,ja|=n,a)}function Vg(n,a,o,c,p){var _=Q.p;Q.p=_!==0&&8>_?_:8;var w=R.T,L={};R.T=L,Wf(n,!1,a,o);try{var B=p(),j=R.S;if(j!==null&&j(L,B),B!==null&&typeof B=="object"&&typeof B.then=="function"){var pe=Xx(B,c);Go(n,a,pe,si(n))}else Go(n,a,c,si(n))}catch(Ee){Go(n,a,{then:function(){},status:"rejected",reason:Ee},si())}finally{Q.p=_,R.T=w}}function Zx(){}function Vf(n,a,o,c){if(n.tag!==5)throw Error(i(476));var p=Gg(n).queue;Vg(n,p,a,me,o===null?Zx:function(){return Wg(n),o(c)})}function Gg(n){var a=n.memoizedState;if(a!==null)return a;a={memoizedState:me,baseState:me,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ra,lastRenderedState:me},next:null};var o={};return a.next={memoizedState:o,baseState:o,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ra,lastRenderedState:o},next:null},n.memoizedState=a,n=n.alternate,n!==null&&(n.memoizedState=a),a}function Wg(n){var a=Gg(n).next.queue;Go(n,a,{},si())}function Gf(){return Ln(cl)}function Xg(){return cn().memoizedState}function qg(){return cn().memoizedState}function $x(n){for(var a=n.return;a!==null;){switch(a.tag){case 24:case 3:var o=si();n=Va(o);var c=Ga(a,n,o);c!==null&&(Hn(c,a,o),qo(c,a,o)),a={cache:Tf()},n.payload=a;return}a=a.return}}function Qx(n,a,o){var c=si();o={lane:c,revertLane:0,action:o,hasEagerState:!1,eagerState:null,next:null},vc(n)?jg(a,o):(o=yf(n,a,o,c),o!==null&&(Hn(o,n,c),Kg(o,a,c)))}function Yg(n,a,o){var c=si();Go(n,a,o,c)}function Go(n,a,o,c){var p={lane:c,revertLane:0,action:o,hasEagerState:!1,eagerState:null,next:null};if(vc(n))jg(a,p);else{var _=n.alternate;if(n.lanes===0&&(_===null||_.lanes===0)&&(_=a.lastRenderedReducer,_!==null))try{var w=a.lastRenderedState,L=_(w,o);if(p.hasEagerState=!0,p.eagerState=L,ni(L,w))return tc(n,a,p,0),Yt===null&&ec(),!1}catch{}finally{}if(o=yf(n,a,p,c),o!==null)return Hn(o,n,c),Kg(o,a,c),!0}return!1}function Wf(n,a,o,c){if(c={lane:2,revertLane:Ud(),action:c,hasEagerState:!1,eagerState:null,next:null},vc(n)){if(a)throw Error(i(479))}else a=yf(n,o,c,2),a!==null&&Hn(a,n,2)}function vc(n){var a=n.alternate;return n===gt||a!==null&&a===gt}function jg(n,a){gs=fc=!0;var o=n.pending;o===null?a.next=a:(a.next=o.next,o.next=a),n.pending=a}function Kg(n,a,o){if((o&4194176)!==0){var c=a.lanes;c&=n.pendingLanes,o|=c,a.lanes=o,ki(n,o)}}var Gi={readContext:Ln,use:pc,useCallback:sn,useContext:sn,useEffect:sn,useImperativeHandle:sn,useLayoutEffect:sn,useInsertionEffect:sn,useMemo:sn,useReducer:sn,useRef:sn,useState:sn,useDebugValue:sn,useDeferredValue:sn,useTransition:sn,useSyncExternalStore:sn,useId:sn};Gi.useCacheRefresh=sn,Gi.useMemoCache=sn,Gi.useHostTransitionStatus=sn,Gi.useFormState=sn,Gi.useActionState=sn,Gi.useOptimistic=sn;var Tr={readContext:Ln,use:pc,useCallback:function(n,a){return Qn().memoizedState=[n,a===void 0?null:a],n},useContext:Ln,useEffect:Pg,useImperativeHandle:function(n,a,o){o=o!=null?o.concat([n]):null,gc(4194308,4,Fg.bind(null,a,n),o)},useLayoutEffect:function(n,a){return gc(4194308,4,n,a)},useInsertionEffect:function(n,a){gc(4,2,n,a)},useMemo:function(n,a){var o=Qn();a=a===void 0?null:a;var c=n();if(wr){ft(!0);try{n()}finally{ft(!1)}}return o.memoizedState=[c,a],c},useReducer:function(n,a,o){var c=Qn();if(o!==void 0){var p=o(a);if(wr){ft(!0);try{o(a)}finally{ft(!1)}}}else p=a;return c.memoizedState=c.baseState=p,n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:p},c.queue=n,n=n.dispatch=Qx.bind(null,gt,n),[c.memoizedState,n]},useRef:function(n){var a=Qn();return n={current:n},a.memoizedState=n},useState:function(n){n=Ff(n);var a=n.queue,o=Yg.bind(null,gt,a);return a.dispatch=o,[n.memoizedState,o]},useDebugValue:kf,useDeferredValue:function(n,a){var o=Qn();return Hf(o,n,a)},useTransition:function(){var n=Ff(!1);return n=Vg.bind(null,gt,n.queue,!0,!1),Qn().memoizedState=n,[!1,n]},useSyncExternalStore:function(n,a,o){var c=gt,p=Qn();if(Ut){if(o===void 0)throw Error(i(407));o=o()}else{if(o=a(),Yt===null)throw Error(i(349));(At&60)!==0||vg(c,a,o)}p.memoizedState=o;var _={value:o,getSnapshot:a};return p.queue=_,Pg(bg.bind(null,c,_,n),[n]),c.flags|=2048,vs(9,yg.bind(null,c,_,o,a),{destroy:void 0},null),o},useId:function(){var n=Qn(),a=Yt.identifierPrefix;if(Ut){var o=ia,c=na;o=(c&~(1<<32-Qe(c)-1)).toString(32)+o,a=":"+a+"R"+o,o=dc++,0<o&&(a+="H"+o.toString(32)),a+=":"}else o=qx++,a=":"+a+"r"+o.toString(32)+":";return n.memoizedState=a},useCacheRefresh:function(){return Qn().memoizedState=$x.bind(null,gt)}};Tr.useMemoCache=Pf,Tr.useHostTransitionStatus=Gf,Tr.useFormState=Cg,Tr.useActionState=Cg,Tr.useOptimistic=function(n){var a=Qn();a.memoizedState=a.baseState=n;var o={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return a.queue=o,a=Wf.bind(null,gt,!0,o),o.dispatch=a,[n,a]};var za={readContext:Ln,use:pc,useCallback:zg,useContext:Ln,useEffect:zf,useImperativeHandle:Bg,useInsertionEffect:Og,useLayoutEffect:Ig,useMemo:kg,useReducer:mc,useRef:Ug,useState:function(){return mc(ra)},useDebugValue:kf,useDeferredValue:function(n,a){var o=cn();return Hg(o,Gt.memoizedState,n,a)},useTransition:function(){var n=mc(ra)[0],a=cn().memoizedState;return[typeof n=="boolean"?n:Vo(n),a]},useSyncExternalStore:_g,useId:Xg};za.useCacheRefresh=qg,za.useMemoCache=Pf,za.useHostTransitionStatus=Gf,za.useFormState=Dg,za.useActionState=Dg,za.useOptimistic=function(n,a){var o=cn();return Mg(o,Gt,n,a)};var Ar={readContext:Ln,use:pc,useCallback:zg,useContext:Ln,useEffect:zf,useImperativeHandle:Bg,useInsertionEffect:Og,useLayoutEffect:Ig,useMemo:kg,useReducer:If,useRef:Ug,useState:function(){return If(ra)},useDebugValue:kf,useDeferredValue:function(n,a){var o=cn();return Gt===null?Hf(o,n,a):Hg(o,Gt.memoizedState,n,a)},useTransition:function(){var n=If(ra)[0],a=cn().memoizedState;return[typeof n=="boolean"?n:Vo(n),a]},useSyncExternalStore:_g,useId:Xg};Ar.useCacheRefresh=qg,Ar.useMemoCache=Pf,Ar.useHostTransitionStatus=Gf,Ar.useFormState=Lg,Ar.useActionState=Lg,Ar.useOptimistic=function(n,a){var o=cn();return Gt!==null?Mg(o,Gt,n,a):(o.baseState=n,[n,o.queue.dispatch])};function Xf(n,a,o,c){a=n.memoizedState,o=o(c,a),o=o==null?a:C({},a,o),n.memoizedState=o,n.lanes===0&&(n.updateQueue.baseState=o)}var qf={isMounted:function(n){return(n=n._reactInternals)?Y(n)===n:!1},enqueueSetState:function(n,a,o){n=n._reactInternals;var c=si(),p=Va(c);p.payload=a,o!=null&&(p.callback=o),a=Ga(n,p,c),a!==null&&(Hn(a,n,c),qo(a,n,c))},enqueueReplaceState:function(n,a,o){n=n._reactInternals;var c=si(),p=Va(c);p.tag=1,p.payload=a,o!=null&&(p.callback=o),a=Ga(n,p,c),a!==null&&(Hn(a,n,c),qo(a,n,c))},enqueueForceUpdate:function(n,a){n=n._reactInternals;var o=si(),c=Va(o);c.tag=2,a!=null&&(c.callback=a),a=Ga(n,c,o),a!==null&&(Hn(a,n,o),qo(a,n,o))}};function Zg(n,a,o,c,p,_,w){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(c,_,w):a.prototype&&a.prototype.isPureReactComponent?!Do(o,c)||!Do(p,_):!0}function $g(n,a,o,c){n=a.state,typeof a.componentWillReceiveProps=="function"&&a.componentWillReceiveProps(o,c),typeof a.UNSAFE_componentWillReceiveProps=="function"&&a.UNSAFE_componentWillReceiveProps(o,c),a.state!==n&&qf.enqueueReplaceState(a,a.state,null)}function Rr(n,a){var o=a;if("ref"in a){o={};for(var c in a)c!=="ref"&&(o[c]=a[c])}if(n=n.defaultProps){o===a&&(o=C({},o));for(var p in n)o[p]===void 0&&(o[p]=n[p])}return o}var yc=typeof reportError=="function"?reportError:function(n){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var a=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof n=="object"&&n!==null&&typeof n.message=="string"?String(n.message):String(n),error:n});if(!window.dispatchEvent(a))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",n);return}console.error(n)};function Qg(n){yc(n)}function Jg(n){console.error(n)}function e_(n){yc(n)}function bc(n,a){try{var o=n.onUncaughtError;o(a.value,{componentStack:a.stack})}catch(c){setTimeout(function(){throw c})}}function t_(n,a,o){try{var c=n.onCaughtError;c(o.value,{componentStack:o.stack,errorBoundary:a.tag===1?a.stateNode:null})}catch(p){setTimeout(function(){throw p})}}function Yf(n,a,o){return o=Va(o),o.tag=3,o.payload={element:null},o.callback=function(){bc(n,a)},o}function n_(n){return n=Va(n),n.tag=3,n}function i_(n,a,o,c){var p=o.type.getDerivedStateFromError;if(typeof p=="function"){var _=c.value;n.payload=function(){return p(_)},n.callback=function(){t_(a,o,c)}}var w=o.stateNode;w!==null&&typeof w.componentDidCatch=="function"&&(n.callback=function(){t_(a,o,c),typeof p!="function"&&(Ka===null?Ka=new Set([this]):Ka.add(this));var L=c.stack;this.componentDidCatch(c.value,{componentStack:L!==null?L:""})})}function Jx(n,a,o,c,p){if(o.flags|=32768,c!==null&&typeof c=="object"&&typeof c.then=="function"){if(a=o.alternate,a!==null&&Xo(a,o,p,!0),o=pi.current,o!==null){switch(o.tag){case 13:return Vi===null?Rd():o.alternate===null&&an===0&&(an=3),o.flags&=-257,o.flags|=65536,o.lanes=p,c===Mf?o.flags|=16384:(a=o.updateQueue,a===null?o.updateQueue=new Set([c]):a.add(c),Dd(n,c,p)),!1;case 22:return o.flags|=65536,c===Mf?o.flags|=16384:(a=o.updateQueue,a===null?(a={transitions:null,markerInstances:null,retryQueue:new Set([c])},o.updateQueue=a):(o=a.retryQueue,o===null?a.retryQueue=new Set([c]):o.add(c)),Dd(n,c,p)),!1}throw Error(i(435,o.tag))}return Dd(n,c,p),Rd(),!1}if(Ut)return a=pi.current,a!==null?((a.flags&65536)===0&&(a.flags|=256),a.flags|=65536,a.lanes=p,c!==Ef&&(n=Error(i(422),{cause:c}),Po(fi(n,o)))):(c!==Ef&&(a=Error(i(423),{cause:c}),Po(fi(a,o))),n=n.current.alternate,n.flags|=65536,p&=-p,n.lanes|=p,c=fi(c,o),p=Yf(n.stateNode,c,p),ld(n,p),an!==4&&(an=2)),!1;var _=Error(i(520),{cause:c});if(_=fi(_,o),el===null?el=[_]:el.push(_),an!==4&&(an=2),a===null)return!0;c=fi(c,o),o=a;do{switch(o.tag){case 3:return o.flags|=65536,n=p&-p,o.lanes|=n,n=Yf(o.stateNode,c,n),ld(o,n),!1;case 1:if(a=o.type,_=o.stateNode,(o.flags&128)===0&&(typeof a.getDerivedStateFromError=="function"||_!==null&&typeof _.componentDidCatch=="function"&&(Ka===null||!Ka.has(_))))return o.flags|=65536,p&=-p,o.lanes|=p,p=n_(p),i_(p,n,o,c),ld(o,p),!1}o=o.return}while(o!==null);return!1}var a_=Error(i(461)),xn=!1;function Rn(n,a,o,c){a.child=n===null?cg(a,null,o,c):Mr(a,n.child,o,c)}function r_(n,a,o,c,p){o=o.render;var _=a.ref;if("ref"in c){var w={};for(var L in c)L!=="ref"&&(w[L]=c[L])}else w=c;return Dr(a),c=Df(n,a,o,w,_,p),L=Nf(),n!==null&&!xn?(Lf(n,a,p),sa(n,a,p)):(Ut&&L&&bf(a),a.flags|=1,Rn(n,a,c,p),a.child)}function s_(n,a,o,c,p){if(n===null){var _=o.type;return typeof _=="function"&&!gd(_)&&_.defaultProps===void 0&&o.compare===null?(a.tag=15,a.type=_,o_(n,a,_,c,p)):(n=wc(o.type,null,c,a,a.mode,p),n.ref=a.ref,n.return=a,a.child=n)}if(_=n.child,!nd(n,p)){var w=_.memoizedProps;if(o=o.compare,o=o!==null?o:Do,o(w,c)&&n.ref===a.ref)return sa(n,a,p)}return a.flags|=1,n=Ya(_,c),n.ref=a.ref,n.return=a,a.child=n}function o_(n,a,o,c,p){if(n!==null){var _=n.memoizedProps;if(Do(_,c)&&n.ref===a.ref)if(xn=!1,a.pendingProps=c=_,nd(n,p))(n.flags&131072)!==0&&(xn=!0);else return a.lanes=n.lanes,sa(n,a,p)}return jf(n,a,o,c,p)}function l_(n,a,o){var c=a.pendingProps,p=c.children,_=(a.stateNode._pendingVisibility&2)!==0,w=n!==null?n.memoizedState:null;if(Wo(n,a),c.mode==="hidden"||_){if((a.flags&128)!==0){if(c=w!==null?w.baseLanes|o:o,n!==null){for(p=a.child=n.child,_=0;p!==null;)_=_|p.lanes|p.childLanes,p=p.sibling;a.childLanes=_&~c}else a.childLanes=0,a.child=null;return c_(n,a,c,o)}if((o&536870912)!==0)a.memoizedState={baseLanes:0,cachePool:null},n!==null&&uc(a,w!==null?w.cachePool:null),w!==null?ug(a,w):Sf(),fg(a);else return a.lanes=a.childLanes=536870912,c_(n,a,w!==null?w.baseLanes|o:o,o)}else w!==null?(uc(a,w.cachePool),ug(a,w),Fa(),a.memoizedState=null):(n!==null&&uc(a,null),Sf(),Fa());return Rn(n,a,p,o),a.child}function c_(n,a,o,c){var p=Rf();return p=p===null?null:{parent:_n._currentValue,pool:p},a.memoizedState={baseLanes:o,cachePool:p},n!==null&&uc(a,null),Sf(),fg(a),n!==null&&Xo(n,a,c,!0),null}function Wo(n,a){var o=a.ref;if(o===null)n!==null&&n.ref!==null&&(a.flags|=2097664);else{if(typeof o!="function"&&typeof o!="object")throw Error(i(284));(n===null||n.ref!==o)&&(a.flags|=2097664)}}function jf(n,a,o,c,p){return Dr(a),o=Df(n,a,o,c,void 0,p),c=Nf(),n!==null&&!xn?(Lf(n,a,p),sa(n,a,p)):(Ut&&c&&bf(a),a.flags|=1,Rn(n,a,o,p),a.child)}function u_(n,a,o,c,p,_){return Dr(a),a.updateQueue=null,o=gg(a,c,o,p),mg(n),c=Nf(),n!==null&&!xn?(Lf(n,a,_),sa(n,a,_)):(Ut&&c&&bf(a),a.flags|=1,Rn(n,a,o,_),a.child)}function f_(n,a,o,c,p){if(Dr(a),a.stateNode===null){var _=cs,w=o.contextType;typeof w=="object"&&w!==null&&(_=Ln(w)),_=new o(c,_),a.memoizedState=_.state!==null&&_.state!==void 0?_.state:null,_.updater=qf,a.stateNode=_,_._reactInternals=a,_=a.stateNode,_.props=c,_.state=a.memoizedState,_.refs={},sd(a),w=o.contextType,_.context=typeof w=="object"&&w!==null?Ln(w):cs,_.state=a.memoizedState,w=o.getDerivedStateFromProps,typeof w=="function"&&(Xf(a,o,w,c),_.state=a.memoizedState),typeof o.getDerivedStateFromProps=="function"||typeof _.getSnapshotBeforeUpdate=="function"||typeof _.UNSAFE_componentWillMount!="function"&&typeof _.componentWillMount!="function"||(w=_.state,typeof _.componentWillMount=="function"&&_.componentWillMount(),typeof _.UNSAFE_componentWillMount=="function"&&_.UNSAFE_componentWillMount(),w!==_.state&&qf.enqueueReplaceState(_,_.state,null),jo(a,c,_,p),Yo(),_.state=a.memoizedState),typeof _.componentDidMount=="function"&&(a.flags|=4194308),c=!0}else if(n===null){_=a.stateNode;var L=a.memoizedProps,B=Rr(o,L);_.props=B;var j=_.context,pe=o.contextType;w=cs,typeof pe=="object"&&pe!==null&&(w=Ln(pe));var Ee=o.getDerivedStateFromProps;pe=typeof Ee=="function"||typeof _.getSnapshotBeforeUpdate=="function",L=a.pendingProps!==L,pe||typeof _.UNSAFE_componentWillReceiveProps!="function"&&typeof _.componentWillReceiveProps!="function"||(L||j!==w)&&$g(a,_,c,w),Ha=!1;var oe=a.memoizedState;_.state=oe,jo(a,c,_,p),Yo(),j=a.memoizedState,L||oe!==j||Ha?(typeof Ee=="function"&&(Xf(a,o,Ee,c),j=a.memoizedState),(B=Ha||Zg(a,o,B,c,oe,j,w))?(pe||typeof _.UNSAFE_componentWillMount!="function"&&typeof _.componentWillMount!="function"||(typeof _.componentWillMount=="function"&&_.componentWillMount(),typeof _.UNSAFE_componentWillMount=="function"&&_.UNSAFE_componentWillMount()),typeof _.componentDidMount=="function"&&(a.flags|=4194308)):(typeof _.componentDidMount=="function"&&(a.flags|=4194308),a.memoizedProps=c,a.memoizedState=j),_.props=c,_.state=j,_.context=w,c=B):(typeof _.componentDidMount=="function"&&(a.flags|=4194308),c=!1)}else{_=a.stateNode,od(n,a),w=a.memoizedProps,pe=Rr(o,w),_.props=pe,Ee=a.pendingProps,oe=_.context,j=o.contextType,B=cs,typeof j=="object"&&j!==null&&(B=Ln(j)),L=o.getDerivedStateFromProps,(j=typeof L=="function"||typeof _.getSnapshotBeforeUpdate=="function")||typeof _.UNSAFE_componentWillReceiveProps!="function"&&typeof _.componentWillReceiveProps!="function"||(w!==Ee||oe!==B)&&$g(a,_,c,B),Ha=!1,oe=a.memoizedState,_.state=oe,jo(a,c,_,p),Yo();var he=a.memoizedState;w!==Ee||oe!==he||Ha||n!==null&&n.dependencies!==null&&xc(n.dependencies)?(typeof L=="function"&&(Xf(a,o,L,c),he=a.memoizedState),(pe=Ha||Zg(a,o,pe,c,oe,he,B)||n!==null&&n.dependencies!==null&&xc(n.dependencies))?(j||typeof _.UNSAFE_componentWillUpdate!="function"&&typeof _.componentWillUpdate!="function"||(typeof _.componentWillUpdate=="function"&&_.componentWillUpdate(c,he,B),typeof _.UNSAFE_componentWillUpdate=="function"&&_.UNSAFE_componentWillUpdate(c,he,B)),typeof _.componentDidUpdate=="function"&&(a.flags|=4),typeof _.getSnapshotBeforeUpdate=="function"&&(a.flags|=1024)):(typeof _.componentDidUpdate!="function"||w===n.memoizedProps&&oe===n.memoizedState||(a.flags|=4),typeof _.getSnapshotBeforeUpdate!="function"||w===n.memoizedProps&&oe===n.memoizedState||(a.flags|=1024),a.memoizedProps=c,a.memoizedState=he),_.props=c,_.state=he,_.context=B,c=pe):(typeof _.componentDidUpdate!="function"||w===n.memoizedProps&&oe===n.memoizedState||(a.flags|=4),typeof _.getSnapshotBeforeUpdate!="function"||w===n.memoizedProps&&oe===n.memoizedState||(a.flags|=1024),c=!1)}return _=c,Wo(n,a),c=(a.flags&128)!==0,_||c?(_=a.stateNode,o=c&&typeof o.getDerivedStateFromError!="function"?null:_.render(),a.flags|=1,n!==null&&c?(a.child=Mr(a,n.child,null,p),a.child=Mr(a,null,o,p)):Rn(n,a,o,p),a.memoizedState=_.state,n=a.child):n=sa(n,a,p),n}function d_(n,a,o,c){return Uo(),a.flags|=256,Rn(n,a,o,c),a.child}var Kf={dehydrated:null,treeContext:null,retryLane:0};function Zf(n){return{baseLanes:n,cachePool:pg()}}function $f(n,a,o){return n=n!==null?n.childLanes&~o:0,a&&(n|=vi),n}function h_(n,a,o){var c=a.pendingProps,p=!1,_=(a.flags&128)!==0,w;if((w=_)||(w=n!==null&&n.memoizedState===null?!1:(gn.current&2)!==0),w&&(p=!0,a.flags&=-129),w=(a.flags&32)!==0,a.flags&=-33,n===null){if(Ut){if(p?Ia(a):Fa(),Ut){var L=An,B;if(B=L){e:{for(B=L,L=Hi;B.nodeType!==8;){if(!L){L=null;break e}if(B=Ci(B.nextSibling),B===null){L=null;break e}}L=B}L!==null?(a.memoizedState={dehydrated:L,treeContext:br!==null?{id:na,overflow:ia}:null,retryLane:536870912},B=_i(18,null,null,0),B.stateNode=L,B.return=a,a.child=B,kn=a,An=null,B=!0):B=!1}B||Er(a)}if(L=a.memoizedState,L!==null&&(L=L.dehydrated,L!==null))return L.data==="$!"?a.lanes=16:a.lanes=536870912,null;aa(a)}return L=c.children,c=c.fallback,p?(Fa(),p=a.mode,L=Jf({mode:"hidden",children:L},p),c=Lr(c,p,o,null),L.return=a,c.return=a,L.sibling=c,a.child=L,p=a.child,p.memoizedState=Zf(o),p.childLanes=$f(n,w,o),a.memoizedState=Kf,c):(Ia(a),Qf(a,L))}if(B=n.memoizedState,B!==null&&(L=B.dehydrated,L!==null)){if(_)a.flags&256?(Ia(a),a.flags&=-257,a=ed(n,a,o)):a.memoizedState!==null?(Fa(),a.child=n.child,a.flags|=128,a=null):(Fa(),p=c.fallback,L=a.mode,c=Jf({mode:"visible",children:c.children},L),p=Lr(p,L,o,null),p.flags|=2,c.return=a,p.return=a,c.sibling=p,a.child=c,Mr(a,n.child,null,o),c=a.child,c.memoizedState=Zf(o),c.childLanes=$f(n,w,o),a.memoizedState=Kf,a=p);else if(Ia(a),L.data==="$!"){if(w=L.nextSibling&&L.nextSibling.dataset,w)var j=w.dgst;w=j,c=Error(i(419)),c.stack="",c.digest=w,Po({value:c,source:null,stack:null}),a=ed(n,a,o)}else if(xn||Xo(n,a,o,!1),w=(o&n.childLanes)!==0,xn||w){if(w=Yt,w!==null){if(c=o&-o,(c&42)!==0)c=1;else switch(c){case 2:c=1;break;case 8:c=4;break;case 32:c=16;break;case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:c=64;break;case 268435456:c=134217728;break;default:c=0}if(c=(c&(w.suspendedLanes|o))!==0?0:c,c!==0&&c!==B.retryLane)throw B.retryLane=c,Oa(n,c),Hn(w,n,c),a_}L.data==="$?"||Rd(),a=ed(n,a,o)}else L.data==="$?"?(a.flags|=128,a.child=n.child,a=pE.bind(null,n),L._reactRetry=a,a=null):(n=B.treeContext,An=Ci(L.nextSibling),kn=a,Ut=!0,Ai=null,Hi=!1,n!==null&&(di[hi++]=na,di[hi++]=ia,di[hi++]=br,na=n.id,ia=n.overflow,br=a),a=Qf(a,c.children),a.flags|=4096);return a}return p?(Fa(),p=c.fallback,L=a.mode,B=n.child,j=B.sibling,c=Ya(B,{mode:"hidden",children:c.children}),c.subtreeFlags=B.subtreeFlags&31457280,j!==null?p=Ya(j,p):(p=Lr(p,L,o,null),p.flags|=2),p.return=a,c.return=a,c.sibling=p,a.child=c,c=p,p=a.child,L=n.child.memoizedState,L===null?L=Zf(o):(B=L.cachePool,B!==null?(j=_n._currentValue,B=B.parent!==j?{parent:j,pool:j}:B):B=pg(),L={baseLanes:L.baseLanes|o,cachePool:B}),p.memoizedState=L,p.childLanes=$f(n,w,o),a.memoizedState=Kf,c):(Ia(a),o=n.child,n=o.sibling,o=Ya(o,{mode:"visible",children:c.children}),o.return=a,o.sibling=null,n!==null&&(w=a.deletions,w===null?(a.deletions=[n],a.flags|=16):w.push(n)),a.child=o,a.memoizedState=null,o)}function Qf(n,a){return a=Jf({mode:"visible",children:a},n.mode),a.return=n,n.child=a}function Jf(n,a){return z_(n,a,0,null)}function ed(n,a,o){return Mr(a,n.child,null,o),n=Qf(a,a.pendingProps.children),n.flags|=2,a.memoizedState=null,n}function p_(n,a,o){n.lanes|=a;var c=n.alternate;c!==null&&(c.lanes|=a),ad(n.return,a,o)}function td(n,a,o,c,p){var _=n.memoizedState;_===null?n.memoizedState={isBackwards:a,rendering:null,renderingStartTime:0,last:c,tail:o,tailMode:p}:(_.isBackwards=a,_.rendering=null,_.renderingStartTime=0,_.last=c,_.tail=o,_.tailMode=p)}function m_(n,a,o){var c=a.pendingProps,p=c.revealOrder,_=c.tail;if(Rn(n,a,c.children,o),c=gn.current,(c&2)!==0)c=c&1|2,a.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=a.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&p_(n,o,a);else if(n.tag===19)p_(n,o,a);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===a)break e;for(;n.sibling===null;){if(n.return===null||n.return===a)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}c&=1}switch(Oe(gn,c),p){case"forwards":for(o=a.child,p=null;o!==null;)n=o.alternate,n!==null&&cc(n)===null&&(p=o),o=o.sibling;o=p,o===null?(p=a.child,a.child=null):(p=o.sibling,o.sibling=null),td(a,!1,p,o,_);break;case"backwards":for(o=null,p=a.child,a.child=null;p!==null;){if(n=p.alternate,n!==null&&cc(n)===null){a.child=p;break}n=p.sibling,p.sibling=o,o=p,p=n}td(a,!0,o,null,_);break;case"together":td(a,!1,null,null,void 0);break;default:a.memoizedState=null}return a.child}function sa(n,a,o){if(n!==null&&(a.dependencies=n.dependencies),ja|=a.lanes,(o&a.childLanes)===0)if(n!==null){if(Xo(n,a,o,!1),(o&a.childLanes)===0)return null}else return null;if(n!==null&&a.child!==n.child)throw Error(i(153));if(a.child!==null){for(n=a.child,o=Ya(n,n.pendingProps),a.child=o,o.return=a;n.sibling!==null;)n=n.sibling,o=o.sibling=Ya(n,n.pendingProps),o.return=a;o.sibling=null}return a.child}function nd(n,a){return(n.lanes&a)!==0?!0:(n=n.dependencies,!!(n!==null&&xc(n)))}function eE(n,a,o){switch(a.tag){case 3:on(a,a.stateNode.containerInfo),ka(a,_n,n.memoizedState.cache),Uo();break;case 27:case 5:Ae(a);break;case 4:on(a,a.stateNode.containerInfo);break;case 10:ka(a,a.type,a.memoizedProps.value);break;case 13:var c=a.memoizedState;if(c!==null)return c.dehydrated!==null?(Ia(a),a.flags|=128,null):(o&a.child.childLanes)!==0?h_(n,a,o):(Ia(a),n=sa(n,a,o),n!==null?n.sibling:null);Ia(a);break;case 19:var p=(n.flags&128)!==0;if(c=(o&a.childLanes)!==0,c||(Xo(n,a,o,!1),c=(o&a.childLanes)!==0),p){if(c)return m_(n,a,o);a.flags|=128}if(p=a.memoizedState,p!==null&&(p.rendering=null,p.tail=null,p.lastEffect=null),Oe(gn,gn.current),c)break;return null;case 22:case 23:return a.lanes=0,l_(n,a,o);case 24:ka(a,_n,n.memoizedState.cache)}return sa(n,a,o)}function g_(n,a,o){if(n!==null)if(n.memoizedProps!==a.pendingProps)xn=!0;else{if(!nd(n,o)&&(a.flags&128)===0)return xn=!1,eE(n,a,o);xn=(n.flags&131072)!==0}else xn=!1,Ut&&(a.flags&1048576)!==0&&eg(a,ac,a.index);switch(a.lanes=0,a.tag){case 16:e:{n=a.pendingProps;var c=a.elementType,p=c._init;if(c=p(c._payload),a.type=c,typeof c=="function")gd(c)?(n=Rr(c,n),a.tag=1,a=f_(null,a,c,n,o)):(a.tag=0,a=jf(null,a,c,n,o));else{if(c!=null){if(p=c.$$typeof,p===E){a.tag=11,a=r_(null,a,c,n,o);break e}else if(p===y){a.tag=14,a=s_(null,a,c,n,o);break e}}throw a=z(c)||c,Error(i(306,a,""))}}return a;case 0:return jf(n,a,a.type,a.pendingProps,o);case 1:return c=a.type,p=Rr(c,a.pendingProps),f_(n,a,c,p,o);case 3:e:{if(on(a,a.stateNode.containerInfo),n===null)throw Error(i(387));var _=a.pendingProps;p=a.memoizedState,c=p.element,od(n,a),jo(a,_,null,o);var w=a.memoizedState;if(_=w.cache,ka(a,_n,_),_!==p.cache&&rd(a,[_n],o,!0),Yo(),_=w.element,p.isDehydrated)if(p={element:_,isDehydrated:!1,cache:w.cache},a.updateQueue.baseState=p,a.memoizedState=p,a.flags&256){a=d_(n,a,_,o);break e}else if(_!==c){c=fi(Error(i(424)),a),Po(c),a=d_(n,a,_,o);break e}else for(An=Ci(a.stateNode.containerInfo.firstChild),kn=a,Ut=!0,Ai=null,Hi=!0,o=cg(a,null,_,o),a.child=o;o;)o.flags=o.flags&-3|4096,o=o.sibling;else{if(Uo(),_===c){a=sa(n,a,o);break e}Rn(n,a,_,o)}a=a.child}return a;case 26:return Wo(n,a),n===null?(o=y0(a.type,null,a.pendingProps,null))?a.memoizedState=o:Ut||(o=a.type,n=a.pendingProps,c=Fc(it.current).createElement(o),c[hn]=a,c[pn]=n,Cn(c,o,n),ie(c),a.stateNode=c):a.memoizedState=y0(a.type,n.memoizedProps,a.pendingProps,n.memoizedState),null;case 27:return Ae(a),n===null&&Ut&&(c=a.stateNode=g0(a.type,a.pendingProps,it.current),kn=a,Hi=!0,An=Ci(c.firstChild)),c=a.pendingProps.children,n!==null||Ut?Rn(n,a,c,o):a.child=Mr(a,null,c,o),Wo(n,a),a.child;case 5:return n===null&&Ut&&((p=c=An)&&(c=DE(c,a.type,a.pendingProps,Hi),c!==null?(a.stateNode=c,kn=a,An=Ci(c.firstChild),Hi=!1,p=!0):p=!1),p||Er(a)),Ae(a),p=a.type,_=a.pendingProps,w=n!==null?n.memoizedProps:null,c=_.children,Vd(p,_)?c=null:w!==null&&Vd(p,w)&&(a.flags|=32),a.memoizedState!==null&&(p=Df(n,a,Yx,null,null,o),cl._currentValue=p),Wo(n,a),Rn(n,a,c,o),a.child;case 6:return n===null&&Ut&&((n=o=An)&&(o=NE(o,a.pendingProps,Hi),o!==null?(a.stateNode=o,kn=a,An=null,n=!0):n=!1),n||Er(a)),null;case 13:return h_(n,a,o);case 4:return on(a,a.stateNode.containerInfo),c=a.pendingProps,n===null?a.child=Mr(a,null,c,o):Rn(n,a,c,o),a.child;case 11:return r_(n,a,a.type,a.pendingProps,o);case 7:return Rn(n,a,a.pendingProps,o),a.child;case 8:return Rn(n,a,a.pendingProps.children,o),a.child;case 12:return Rn(n,a,a.pendingProps.children,o),a.child;case 10:return c=a.pendingProps,ka(a,a.type,c.value),Rn(n,a,c.children,o),a.child;case 9:return p=a.type._context,c=a.pendingProps.children,Dr(a),p=Ln(p),c=c(p),a.flags|=1,Rn(n,a,c,o),a.child;case 14:return s_(n,a,a.type,a.pendingProps,o);case 15:return o_(n,a,a.type,a.pendingProps,o);case 19:return m_(n,a,o);case 22:return l_(n,a,o);case 24:return Dr(a),c=Ln(_n),n===null?(p=Rf(),p===null&&(p=Yt,_=Tf(),p.pooledCache=_,_.refCount++,_!==null&&(p.pooledCacheLanes|=o),p=_),a.memoizedState={parent:c,cache:p},sd(a),ka(a,_n,p)):((n.lanes&o)!==0&&(od(n,a),jo(a,null,null,o),Yo()),p=n.memoizedState,_=a.memoizedState,p.parent!==c?(p={parent:c,cache:c},a.memoizedState=p,a.lanes===0&&(a.memoizedState=a.updateQueue.baseState=p),ka(a,_n,c)):(c=_.cache,ka(a,_n,c),c!==p.cache&&rd(a,[_n],o,!0))),Rn(n,a,a.pendingProps.children,o),a.child;case 29:throw a.pendingProps}throw Error(i(156,a.tag))}var id=Ce(null),Cr=null,oa=null;function ka(n,a,o){Oe(id,a._currentValue),a._currentValue=o}function la(n){n._currentValue=id.current,Ke(id)}function ad(n,a,o){for(;n!==null;){var c=n.alternate;if((n.childLanes&a)!==a?(n.childLanes|=a,c!==null&&(c.childLanes|=a)):c!==null&&(c.childLanes&a)!==a&&(c.childLanes|=a),n===o)break;n=n.return}}function rd(n,a,o,c){var p=n.child;for(p!==null&&(p.return=n);p!==null;){var _=p.dependencies;if(_!==null){var w=p.child;_=_.firstContext;e:for(;_!==null;){var L=_;_=p;for(var B=0;B<a.length;B++)if(L.context===a[B]){_.lanes|=o,L=_.alternate,L!==null&&(L.lanes|=o),ad(_.return,o,n),c||(w=null);break e}_=L.next}}else if(p.tag===18){if(w=p.return,w===null)throw Error(i(341));w.lanes|=o,_=w.alternate,_!==null&&(_.lanes|=o),ad(w,o,n),w=null}else w=p.child;if(w!==null)w.return=p;else for(w=p;w!==null;){if(w===n){w=null;break}if(p=w.sibling,p!==null){p.return=w.return,w=p;break}w=w.return}p=w}}function Xo(n,a,o,c){n=null;for(var p=a,_=!1;p!==null;){if(!_){if((p.flags&524288)!==0)_=!0;else if((p.flags&262144)!==0)break}if(p.tag===10){var w=p.alternate;if(w===null)throw Error(i(387));if(w=w.memoizedProps,w!==null){var L=p.type;ni(p.pendingProps.value,w.value)||(n!==null?n.push(L):n=[L])}}else if(p===V.current){if(w=p.alternate,w===null)throw Error(i(387));w.memoizedState.memoizedState!==p.memoizedState.memoizedState&&(n!==null?n.push(cl):n=[cl])}p=p.return}n!==null&&rd(a,n,o,c),a.flags|=262144}function xc(n){for(n=n.firstContext;n!==null;){if(!ni(n.context._currentValue,n.memoizedValue))return!0;n=n.next}return!1}function Dr(n){Cr=n,oa=null,n=n.dependencies,n!==null&&(n.firstContext=null)}function Ln(n){return __(Cr,n)}function Ec(n,a){return Cr===null&&Dr(n),__(n,a)}function __(n,a){var o=a._currentValue;if(a={context:a,memoizedValue:o,next:null},oa===null){if(n===null)throw Error(i(308));oa=a,n.dependencies={lanes:0,firstContext:a},n.flags|=524288}else oa=oa.next=a;return o}var Ha=!1;function sd(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function od(n,a){n=n.updateQueue,a.updateQueue===n&&(a.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,callbacks:null})}function Va(n){return{lane:n,tag:0,payload:null,callback:null,next:null}}function Ga(n,a,o){var c=n.updateQueue;if(c===null)return null;if(c=c.shared,(Jt&2)!==0){var p=c.pending;return p===null?a.next=a:(a.next=p.next,p.next=a),c.pending=a,a=nc(n),Qm(n,null,o),a}return tc(n,c,a,o),nc(n)}function qo(n,a,o){if(a=a.updateQueue,a!==null&&(a=a.shared,(o&4194176)!==0)){var c=a.lanes;c&=n.pendingLanes,o|=c,a.lanes=o,ki(n,o)}}function ld(n,a){var o=n.updateQueue,c=n.alternate;if(c!==null&&(c=c.updateQueue,o===c)){var p=null,_=null;if(o=o.firstBaseUpdate,o!==null){do{var w={lane:o.lane,tag:o.tag,payload:o.payload,callback:null,next:null};_===null?p=_=w:_=_.next=w,o=o.next}while(o!==null);_===null?p=_=a:_=_.next=a}else p=_=a;o={baseState:c.baseState,firstBaseUpdate:p,lastBaseUpdate:_,shared:c.shared,callbacks:c.callbacks},n.updateQueue=o;return}n=o.lastBaseUpdate,n===null?o.firstBaseUpdate=a:n.next=a,o.lastBaseUpdate=a}var cd=!1;function Yo(){if(cd){var n=ms;if(n!==null)throw n}}function jo(n,a,o,c){cd=!1;var p=n.updateQueue;Ha=!1;var _=p.firstBaseUpdate,w=p.lastBaseUpdate,L=p.shared.pending;if(L!==null){p.shared.pending=null;var B=L,j=B.next;B.next=null,w===null?_=j:w.next=j,w=B;var pe=n.alternate;pe!==null&&(pe=pe.updateQueue,L=pe.lastBaseUpdate,L!==w&&(L===null?pe.firstBaseUpdate=j:L.next=j,pe.lastBaseUpdate=B))}if(_!==null){var Ee=p.baseState;w=0,pe=j=B=null,L=_;do{var oe=L.lane&-536870913,he=oe!==L.lane;if(he?(At&oe)===oe:(c&oe)===oe){oe!==0&&oe===ps&&(cd=!0),pe!==null&&(pe=pe.next={lane:0,tag:L.tag,payload:L.payload,callback:null,next:null});e:{var je=n,ut=L;oe=a;var rn=o;switch(ut.tag){case 1:if(je=ut.payload,typeof je=="function"){Ee=je.call(rn,Ee,oe);break e}Ee=je;break e;case 3:je.flags=je.flags&-65537|128;case 0:if(je=ut.payload,oe=typeof je=="function"?je.call(rn,Ee,oe):je,oe==null)break e;Ee=C({},Ee,oe);break e;case 2:Ha=!0}}oe=L.callback,oe!==null&&(n.flags|=64,he&&(n.flags|=8192),he=p.callbacks,he===null?p.callbacks=[oe]:he.push(oe))}else he={lane:oe,tag:L.tag,payload:L.payload,callback:L.callback,next:null},pe===null?(j=pe=he,B=Ee):pe=pe.next=he,w|=oe;if(L=L.next,L===null){if(L=p.shared.pending,L===null)break;he=L,L=he.next,he.next=null,p.lastBaseUpdate=he,p.shared.pending=null}}while(!0);pe===null&&(B=Ee),p.baseState=B,p.firstBaseUpdate=j,p.lastBaseUpdate=pe,_===null&&(p.shared.lanes=0),ja|=w,n.lanes=w,n.memoizedState=Ee}}function v_(n,a){if(typeof n!="function")throw Error(i(191,n));n.call(a)}function y_(n,a){var o=n.callbacks;if(o!==null)for(n.callbacks=null,n=0;n<o.length;n++)v_(o[n],a)}function Ko(n,a){try{var o=a.updateQueue,c=o!==null?o.lastEffect:null;if(c!==null){var p=c.next;o=p;do{if((o.tag&n)===n){c=void 0;var _=o.create,w=o.inst;c=_(),w.destroy=c}o=o.next}while(o!==p)}}catch(L){qt(a,a.return,L)}}function Wa(n,a,o){try{var c=a.updateQueue,p=c!==null?c.lastEffect:null;if(p!==null){var _=p.next;c=_;do{if((c.tag&n)===n){var w=c.inst,L=w.destroy;if(L!==void 0){w.destroy=void 0,p=a;var B=o;try{L()}catch(j){qt(p,B,j)}}}c=c.next}while(c!==_)}}catch(j){qt(a,a.return,j)}}function b_(n){var a=n.updateQueue;if(a!==null){var o=n.stateNode;try{y_(a,o)}catch(c){qt(n,n.return,c)}}}function x_(n,a,o){o.props=Rr(n.type,n.memoizedProps),o.state=n.memoizedState;try{o.componentWillUnmount()}catch(c){qt(n,a,c)}}function Nr(n,a){try{var o=n.ref;if(o!==null){var c=n.stateNode;switch(n.tag){case 26:case 27:case 5:var p=c;break;default:p=c}typeof o=="function"?n.refCleanup=o(p):o.current=p}}catch(_){qt(n,a,_)}}function ii(n,a){var o=n.ref,c=n.refCleanup;if(o!==null)if(typeof c=="function")try{c()}catch(p){qt(n,a,p)}finally{n.refCleanup=null,n=n.alternate,n!=null&&(n.refCleanup=null)}else if(typeof o=="function")try{o(null)}catch(p){qt(n,a,p)}else o.current=null}function E_(n){var a=n.type,o=n.memoizedProps,c=n.stateNode;try{e:switch(a){case"button":case"input":case"select":case"textarea":o.autoFocus&&c.focus();break e;case"img":o.src?c.src=o.src:o.srcSet&&(c.srcset=o.srcSet)}}catch(p){qt(n,n.return,p)}}function M_(n,a,o){try{var c=n.stateNode;wE(c,n.type,o,a),c[pn]=a}catch(p){qt(n,n.return,p)}}function S_(n){return n.tag===5||n.tag===3||n.tag===26||n.tag===27||n.tag===4}function ud(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||S_(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==27&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function fd(n,a,o){var c=n.tag;if(c===5||c===6)n=n.stateNode,a?o.nodeType===8?o.parentNode.insertBefore(n,a):o.insertBefore(n,a):(o.nodeType===8?(a=o.parentNode,a.insertBefore(n,o)):(a=o,a.appendChild(n)),o=o._reactRootContainer,o!=null||a.onclick!==null||(a.onclick=Ic));else if(c!==4&&c!==27&&(n=n.child,n!==null))for(fd(n,a,o),n=n.sibling;n!==null;)fd(n,a,o),n=n.sibling}function Mc(n,a,o){var c=n.tag;if(c===5||c===6)n=n.stateNode,a?o.insertBefore(n,a):o.appendChild(n);else if(c!==4&&c!==27&&(n=n.child,n!==null))for(Mc(n,a,o),n=n.sibling;n!==null;)Mc(n,a,o),n=n.sibling}var ca=!1,nn=!1,dd=!1,w_=typeof WeakSet=="function"?WeakSet:Set,En=null,T_=!1;function tE(n,a){if(n=n.containerInfo,kd=Gc,n=Gm(n),pf(n)){if("selectionStart"in n)var o={start:n.selectionStart,end:n.selectionEnd};else e:{o=(o=n.ownerDocument)&&o.defaultView||window;var c=o.getSelection&&o.getSelection();if(c&&c.rangeCount!==0){o=c.anchorNode;var p=c.anchorOffset,_=c.focusNode;c=c.focusOffset;try{o.nodeType,_.nodeType}catch{o=null;break e}var w=0,L=-1,B=-1,j=0,pe=0,Ee=n,oe=null;t:for(;;){for(var he;Ee!==o||p!==0&&Ee.nodeType!==3||(L=w+p),Ee!==_||c!==0&&Ee.nodeType!==3||(B=w+c),Ee.nodeType===3&&(w+=Ee.nodeValue.length),(he=Ee.firstChild)!==null;)oe=Ee,Ee=he;for(;;){if(Ee===n)break t;if(oe===o&&++j===p&&(L=w),oe===_&&++pe===c&&(B=w),(he=Ee.nextSibling)!==null)break;Ee=oe,oe=Ee.parentNode}Ee=he}o=L===-1||B===-1?null:{start:L,end:B}}else o=null}o=o||{start:0,end:0}}else o=null;for(Hd={focusedElem:n,selectionRange:o},Gc=!1,En=a;En!==null;)if(a=En,n=a.child,(a.subtreeFlags&1028)!==0&&n!==null)n.return=a,En=n;else for(;En!==null;){switch(a=En,_=a.alternate,n=a.flags,a.tag){case 0:break;case 11:case 15:break;case 1:if((n&1024)!==0&&_!==null){n=void 0,o=a,p=_.memoizedProps,_=_.memoizedState,c=o.stateNode;try{var je=Rr(o.type,p,o.elementType===o.type);n=c.getSnapshotBeforeUpdate(je,_),c.__reactInternalSnapshotBeforeUpdate=n}catch(ut){qt(o,o.return,ut)}}break;case 3:if((n&1024)!==0){if(n=a.stateNode.containerInfo,o=n.nodeType,o===9)Xd(n);else if(o===1)switch(n.nodeName){case"HEAD":case"HTML":case"BODY":Xd(n);break;default:n.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((n&1024)!==0)throw Error(i(163))}if(n=a.sibling,n!==null){n.return=a.return,En=n;break}En=a.return}return je=T_,T_=!1,je}function A_(n,a,o){var c=o.flags;switch(o.tag){case 0:case 11:case 15:fa(n,o),c&4&&Ko(5,o);break;case 1:if(fa(n,o),c&4)if(n=o.stateNode,a===null)try{n.componentDidMount()}catch(L){qt(o,o.return,L)}else{var p=Rr(o.type,a.memoizedProps);a=a.memoizedState;try{n.componentDidUpdate(p,a,n.__reactInternalSnapshotBeforeUpdate)}catch(L){qt(o,o.return,L)}}c&64&&b_(o),c&512&&Nr(o,o.return);break;case 3:if(fa(n,o),c&64&&(c=o.updateQueue,c!==null)){if(n=null,o.child!==null)switch(o.child.tag){case 27:case 5:n=o.child.stateNode;break;case 1:n=o.child.stateNode}try{y_(c,n)}catch(L){qt(o,o.return,L)}}break;case 26:fa(n,o),c&512&&Nr(o,o.return);break;case 27:case 5:fa(n,o),a===null&&c&4&&E_(o),c&512&&Nr(o,o.return);break;case 12:fa(n,o);break;case 13:fa(n,o),c&4&&D_(n,o);break;case 22:if(p=o.memoizedState!==null||ca,!p){a=a!==null&&a.memoizedState!==null||nn;var _=ca,w=nn;ca=p,(nn=a)&&!w?Xa(n,o,(o.subtreeFlags&8772)!==0):fa(n,o),ca=_,nn=w}c&512&&(o.memoizedProps.mode==="manual"?Nr(o,o.return):ii(o,o.return));break;default:fa(n,o)}}function R_(n){var a=n.alternate;a!==null&&(n.alternate=null,R_(a)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(a=n.stateNode,a!==null&&Eo(a)),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}var un=null,ai=!1;function ua(n,a,o){for(o=o.child;o!==null;)C_(n,a,o),o=o.sibling}function C_(n,a,o){if(Ye&&typeof Ye.onCommitFiberUnmount=="function")try{Ye.onCommitFiberUnmount(et,o)}catch{}switch(o.tag){case 26:nn||ii(o,a),ua(n,a,o),o.memoizedState?o.memoizedState.count--:o.stateNode&&(o=o.stateNode,o.parentNode.removeChild(o));break;case 27:nn||ii(o,a);var c=un,p=ai;for(un=o.stateNode,ua(n,a,o),o=o.stateNode,a=o.attributes;a.length;)o.removeAttributeNode(a[0]);Eo(o),un=c,ai=p;break;case 5:nn||ii(o,a);case 6:p=un;var _=ai;if(un=null,ua(n,a,o),un=p,ai=_,un!==null)if(ai)try{n=un,c=o.stateNode,n.nodeType===8?n.parentNode.removeChild(c):n.removeChild(c)}catch(w){qt(o,a,w)}else try{un.removeChild(o.stateNode)}catch(w){qt(o,a,w)}break;case 18:un!==null&&(ai?(a=un,o=o.stateNode,a.nodeType===8?Wd(a.parentNode,o):a.nodeType===1&&Wd(a,o),hl(a)):Wd(un,o.stateNode));break;case 4:c=un,p=ai,un=o.stateNode.containerInfo,ai=!0,ua(n,a,o),un=c,ai=p;break;case 0:case 11:case 14:case 15:nn||Wa(2,o,a),nn||Wa(4,o,a),ua(n,a,o);break;case 1:nn||(ii(o,a),c=o.stateNode,typeof c.componentWillUnmount=="function"&&x_(o,a,c)),ua(n,a,o);break;case 21:ua(n,a,o);break;case 22:nn||ii(o,a),nn=(c=nn)||o.memoizedState!==null,ua(n,a,o),nn=c;break;default:ua(n,a,o)}}function D_(n,a){if(a.memoizedState===null&&(n=a.alternate,n!==null&&(n=n.memoizedState,n!==null&&(n=n.dehydrated,n!==null))))try{hl(n)}catch(o){qt(a,a.return,o)}}function nE(n){switch(n.tag){case 13:case 19:var a=n.stateNode;return a===null&&(a=n.stateNode=new w_),a;case 22:return n=n.stateNode,a=n._retryCache,a===null&&(a=n._retryCache=new w_),a;default:throw Error(i(435,n.tag))}}function hd(n,a){var o=nE(n);a.forEach(function(c){var p=mE.bind(null,n,c);o.has(c)||(o.add(c),c.then(p,p))})}function mi(n,a){var o=a.deletions;if(o!==null)for(var c=0;c<o.length;c++){var p=o[c],_=n,w=a,L=w;e:for(;L!==null;){switch(L.tag){case 27:case 5:un=L.stateNode,ai=!1;break e;case 3:un=L.stateNode.containerInfo,ai=!0;break e;case 4:un=L.stateNode.containerInfo,ai=!0;break e}L=L.return}if(un===null)throw Error(i(160));C_(_,w,p),un=null,ai=!1,_=p.alternate,_!==null&&(_.return=null),p.return=null}if(a.subtreeFlags&13878)for(a=a.child;a!==null;)N_(a,n),a=a.sibling}var Ri=null;function N_(n,a){var o=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:mi(a,n),gi(n),c&4&&(Wa(3,n,n.return),Ko(3,n),Wa(5,n,n.return));break;case 1:mi(a,n),gi(n),c&512&&(nn||o===null||ii(o,o.return)),c&64&&ca&&(n=n.updateQueue,n!==null&&(c=n.callbacks,c!==null&&(o=n.shared.hiddenCallbacks,n.shared.hiddenCallbacks=o===null?c:o.concat(c))));break;case 26:var p=Ri;if(mi(a,n),gi(n),c&512&&(nn||o===null||ii(o,o.return)),c&4){var _=o!==null?o.memoizedState:null;if(c=n.memoizedState,o===null)if(c===null)if(n.stateNode===null){e:{c=n.type,o=n.memoizedProps,p=p.ownerDocument||p;t:switch(c){case"title":_=p.getElementsByTagName("title")[0],(!_||_[gr]||_[hn]||_.namespaceURI==="http://www.w3.org/2000/svg"||_.hasAttribute("itemprop"))&&(_=p.createElement(c),p.head.insertBefore(_,p.querySelector("head > title"))),Cn(_,c,o),_[hn]=n,ie(_),c=_;break e;case"link":var w=E0("link","href",p).get(c+(o.href||""));if(w){for(var L=0;L<w.length;L++)if(_=w[L],_.getAttribute("href")===(o.href==null?null:o.href)&&_.getAttribute("rel")===(o.rel==null?null:o.rel)&&_.getAttribute("title")===(o.title==null?null:o.title)&&_.getAttribute("crossorigin")===(o.crossOrigin==null?null:o.crossOrigin)){w.splice(L,1);break t}}_=p.createElement(c),Cn(_,c,o),p.head.appendChild(_);break;case"meta":if(w=E0("meta","content",p).get(c+(o.content||""))){for(L=0;L<w.length;L++)if(_=w[L],_.getAttribute("content")===(o.content==null?null:""+o.content)&&_.getAttribute("name")===(o.name==null?null:o.name)&&_.getAttribute("property")===(o.property==null?null:o.property)&&_.getAttribute("http-equiv")===(o.httpEquiv==null?null:o.httpEquiv)&&_.getAttribute("charset")===(o.charSet==null?null:o.charSet)){w.splice(L,1);break t}}_=p.createElement(c),Cn(_,c,o),p.head.appendChild(_);break;default:throw Error(i(468,c))}_[hn]=n,ie(_),c=_}n.stateNode=c}else M0(p,n.type,n.stateNode);else n.stateNode=x0(p,c,n.memoizedProps);else _!==c?(_===null?o.stateNode!==null&&(o=o.stateNode,o.parentNode.removeChild(o)):_.count--,c===null?M0(p,n.type,n.stateNode):x0(p,c,n.memoizedProps)):c===null&&n.stateNode!==null&&M_(n,n.memoizedProps,o.memoizedProps)}break;case 27:if(c&4&&n.alternate===null){p=n.stateNode,_=n.memoizedProps;try{for(var B=p.firstChild;B;){var j=B.nextSibling,pe=B.nodeName;B[gr]||pe==="HEAD"||pe==="BODY"||pe==="SCRIPT"||pe==="STYLE"||pe==="LINK"&&B.rel.toLowerCase()==="stylesheet"||p.removeChild(B),B=j}for(var Ee=n.type,oe=p.attributes;oe.length;)p.removeAttributeNode(oe[0]);Cn(p,Ee,_),p[hn]=n,p[pn]=_}catch(je){qt(n,n.return,je)}}case 5:if(mi(a,n),gi(n),c&512&&(nn||o===null||ii(o,o.return)),n.flags&32){p=n.stateNode;try{Zn(p,"")}catch(je){qt(n,n.return,je)}}c&4&&n.stateNode!=null&&(p=n.memoizedProps,M_(n,p,o!==null?o.memoizedProps:p)),c&1024&&(dd=!0);break;case 6:if(mi(a,n),gi(n),c&4){if(n.stateNode===null)throw Error(i(162));c=n.memoizedProps,o=n.stateNode;try{o.nodeValue=c}catch(je){qt(n,n.return,je)}}break;case 3:if(kc=null,p=Ri,Ri=Bc(a.containerInfo),mi(a,n),Ri=p,gi(n),c&4&&o!==null&&o.memoizedState.isDehydrated)try{hl(a.containerInfo)}catch(je){qt(n,n.return,je)}dd&&(dd=!1,L_(n));break;case 4:c=Ri,Ri=Bc(n.stateNode.containerInfo),mi(a,n),gi(n),Ri=c;break;case 12:mi(a,n),gi(n);break;case 13:mi(a,n),gi(n),n.child.flags&8192&&n.memoizedState!==null!=(o!==null&&o.memoizedState!==null)&&(Ed=fe()),c&4&&(c=n.updateQueue,c!==null&&(n.updateQueue=null,hd(n,c)));break;case 22:if(c&512&&(nn||o===null||ii(o,o.return)),B=n.memoizedState!==null,j=o!==null&&o.memoizedState!==null,pe=ca,Ee=nn,ca=pe||B,nn=Ee||j,mi(a,n),nn=Ee,ca=pe,gi(n),a=n.stateNode,a._current=n,a._visibility&=-3,a._visibility|=a._pendingVisibility&2,c&8192&&(a._visibility=B?a._visibility&-2:a._visibility|1,B&&(a=ca||nn,o===null||j||a||ys(n)),n.memoizedProps===null||n.memoizedProps.mode!=="manual"))e:for(o=null,a=n;;){if(a.tag===5||a.tag===26||a.tag===27){if(o===null){j=o=a;try{if(p=j.stateNode,B)_=p.style,typeof _.setProperty=="function"?_.setProperty("display","none","important"):_.display="none";else{w=j.stateNode,L=j.memoizedProps.style;var he=L!=null&&L.hasOwnProperty("display")?L.display:null;w.style.display=he==null||typeof he=="boolean"?"":(""+he).trim()}}catch(je){qt(j,j.return,je)}}}else if(a.tag===6){if(o===null){j=a;try{j.stateNode.nodeValue=B?"":j.memoizedProps}catch(je){qt(j,j.return,je)}}}else if((a.tag!==22&&a.tag!==23||a.memoizedState===null||a===n)&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===n)break e;for(;a.sibling===null;){if(a.return===null||a.return===n)break e;o===a&&(o=null),a=a.return}o===a&&(o=null),a.sibling.return=a.return,a=a.sibling}c&4&&(c=n.updateQueue,c!==null&&(o=c.retryQueue,o!==null&&(c.retryQueue=null,hd(n,o))));break;case 19:mi(a,n),gi(n),c&4&&(c=n.updateQueue,c!==null&&(n.updateQueue=null,hd(n,c)));break;case 21:break;default:mi(a,n),gi(n)}}function gi(n){var a=n.flags;if(a&2){try{if(n.tag!==27){e:{for(var o=n.return;o!==null;){if(S_(o)){var c=o;break e}o=o.return}throw Error(i(160))}switch(c.tag){case 27:var p=c.stateNode,_=ud(n);Mc(n,_,p);break;case 5:var w=c.stateNode;c.flags&32&&(Zn(w,""),c.flags&=-33);var L=ud(n);Mc(n,L,w);break;case 3:case 4:var B=c.stateNode.containerInfo,j=ud(n);fd(n,j,B);break;default:throw Error(i(161))}}}catch(pe){qt(n,n.return,pe)}n.flags&=-3}a&4096&&(n.flags&=-4097)}function L_(n){if(n.subtreeFlags&1024)for(n=n.child;n!==null;){var a=n;L_(a),a.tag===5&&a.flags&1024&&a.stateNode.reset(),n=n.sibling}}function fa(n,a){if(a.subtreeFlags&8772)for(a=a.child;a!==null;)A_(n,a.alternate,a),a=a.sibling}function ys(n){for(n=n.child;n!==null;){var a=n;switch(a.tag){case 0:case 11:case 14:case 15:Wa(4,a,a.return),ys(a);break;case 1:ii(a,a.return);var o=a.stateNode;typeof o.componentWillUnmount=="function"&&x_(a,a.return,o),ys(a);break;case 26:case 27:case 5:ii(a,a.return),ys(a);break;case 22:ii(a,a.return),a.memoizedState===null&&ys(a);break;default:ys(a)}n=n.sibling}}function Xa(n,a,o){for(o=o&&(a.subtreeFlags&8772)!==0,a=a.child;a!==null;){var c=a.alternate,p=n,_=a,w=_.flags;switch(_.tag){case 0:case 11:case 15:Xa(p,_,o),Ko(4,_);break;case 1:if(Xa(p,_,o),c=_,p=c.stateNode,typeof p.componentDidMount=="function")try{p.componentDidMount()}catch(j){qt(c,c.return,j)}if(c=_,p=c.updateQueue,p!==null){var L=c.stateNode;try{var B=p.shared.hiddenCallbacks;if(B!==null)for(p.shared.hiddenCallbacks=null,p=0;p<B.length;p++)v_(B[p],L)}catch(j){qt(c,c.return,j)}}o&&w&64&&b_(_),Nr(_,_.return);break;case 26:case 27:case 5:Xa(p,_,o),o&&c===null&&w&4&&E_(_),Nr(_,_.return);break;case 12:Xa(p,_,o);break;case 13:Xa(p,_,o),o&&w&4&&D_(p,_);break;case 22:_.memoizedState===null&&Xa(p,_,o),Nr(_,_.return);break;default:Xa(p,_,o)}a=a.sibling}}function pd(n,a){var o=null;n!==null&&n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(o=n.memoizedState.cachePool.pool),n=null,a.memoizedState!==null&&a.memoizedState.cachePool!==null&&(n=a.memoizedState.cachePool.pool),n!==o&&(n!=null&&n.refCount++,o!=null&&zo(o))}function md(n,a){n=null,a.alternate!==null&&(n=a.alternate.memoizedState.cache),a=a.memoizedState.cache,a!==n&&(a.refCount++,n!=null&&zo(n))}function qa(n,a,o,c){if(a.subtreeFlags&10256)for(a=a.child;a!==null;)U_(n,a,o,c),a=a.sibling}function U_(n,a,o,c){var p=a.flags;switch(a.tag){case 0:case 11:case 15:qa(n,a,o,c),p&2048&&Ko(9,a);break;case 3:qa(n,a,o,c),p&2048&&(n=null,a.alternate!==null&&(n=a.alternate.memoizedState.cache),a=a.memoizedState.cache,a!==n&&(a.refCount++,n!=null&&zo(n)));break;case 12:if(p&2048){qa(n,a,o,c),n=a.stateNode;try{var _=a.memoizedProps,w=_.id,L=_.onPostCommit;typeof L=="function"&&L(w,a.alternate===null?"mount":"update",n.passiveEffectDuration,-0)}catch(B){qt(a,a.return,B)}}else qa(n,a,o,c);break;case 23:break;case 22:_=a.stateNode,a.memoizedState!==null?_._visibility&4?qa(n,a,o,c):Zo(n,a):_._visibility&4?qa(n,a,o,c):(_._visibility|=4,bs(n,a,o,c,(a.subtreeFlags&10256)!==0)),p&2048&&pd(a.alternate,a);break;case 24:qa(n,a,o,c),p&2048&&md(a.alternate,a);break;default:qa(n,a,o,c)}}function bs(n,a,o,c,p){for(p=p&&(a.subtreeFlags&10256)!==0,a=a.child;a!==null;){var _=n,w=a,L=o,B=c,j=w.flags;switch(w.tag){case 0:case 11:case 15:bs(_,w,L,B,p),Ko(8,w);break;case 23:break;case 22:var pe=w.stateNode;w.memoizedState!==null?pe._visibility&4?bs(_,w,L,B,p):Zo(_,w):(pe._visibility|=4,bs(_,w,L,B,p)),p&&j&2048&&pd(w.alternate,w);break;case 24:bs(_,w,L,B,p),p&&j&2048&&md(w.alternate,w);break;default:bs(_,w,L,B,p)}a=a.sibling}}function Zo(n,a){if(a.subtreeFlags&10256)for(a=a.child;a!==null;){var o=n,c=a,p=c.flags;switch(c.tag){case 22:Zo(o,c),p&2048&&pd(c.alternate,c);break;case 24:Zo(o,c),p&2048&&md(c.alternate,c);break;default:Zo(o,c)}a=a.sibling}}var $o=8192;function xs(n){if(n.subtreeFlags&$o)for(n=n.child;n!==null;)P_(n),n=n.sibling}function P_(n){switch(n.tag){case 26:xs(n),n.flags&$o&&n.memoizedState!==null&&WE(Ri,n.memoizedState,n.memoizedProps);break;case 5:xs(n);break;case 3:case 4:var a=Ri;Ri=Bc(n.stateNode.containerInfo),xs(n),Ri=a;break;case 22:n.memoizedState===null&&(a=n.alternate,a!==null&&a.memoizedState!==null?(a=$o,$o=16777216,xs(n),$o=a):xs(n));break;default:xs(n)}}function O_(n){var a=n.alternate;if(a!==null&&(n=a.child,n!==null)){a.child=null;do a=n.sibling,n.sibling=null,n=a;while(n!==null)}}function Qo(n){var a=n.deletions;if((n.flags&16)!==0){if(a!==null)for(var o=0;o<a.length;o++){var c=a[o];En=c,F_(c,n)}O_(n)}if(n.subtreeFlags&10256)for(n=n.child;n!==null;)I_(n),n=n.sibling}function I_(n){switch(n.tag){case 0:case 11:case 15:Qo(n),n.flags&2048&&Wa(9,n,n.return);break;case 3:Qo(n);break;case 12:Qo(n);break;case 22:var a=n.stateNode;n.memoizedState!==null&&a._visibility&4&&(n.return===null||n.return.tag!==13)?(a._visibility&=-5,Sc(n)):Qo(n);break;default:Qo(n)}}function Sc(n){var a=n.deletions;if((n.flags&16)!==0){if(a!==null)for(var o=0;o<a.length;o++){var c=a[o];En=c,F_(c,n)}O_(n)}for(n=n.child;n!==null;){switch(a=n,a.tag){case 0:case 11:case 15:Wa(8,a,a.return),Sc(a);break;case 22:o=a.stateNode,o._visibility&4&&(o._visibility&=-5,Sc(a));break;default:Sc(a)}n=n.sibling}}function F_(n,a){for(;En!==null;){var o=En;switch(o.tag){case 0:case 11:case 15:Wa(8,o,a);break;case 23:case 22:if(o.memoizedState!==null&&o.memoizedState.cachePool!==null){var c=o.memoizedState.cachePool.pool;c!=null&&c.refCount++}break;case 24:zo(o.memoizedState.cache)}if(c=o.child,c!==null)c.return=o,En=c;else e:for(o=n;En!==null;){c=En;var p=c.sibling,_=c.return;if(R_(c),c===o){En=null;break e}if(p!==null){p.return=_,En=p;break e}En=_}}}function iE(n,a,o,c){this.tag=n,this.key=o,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=a,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=c,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function _i(n,a,o,c){return new iE(n,a,o,c)}function gd(n){return n=n.prototype,!(!n||!n.isReactComponent)}function Ya(n,a){var o=n.alternate;return o===null?(o=_i(n.tag,a,n.key,n.mode),o.elementType=n.elementType,o.type=n.type,o.stateNode=n.stateNode,o.alternate=n,n.alternate=o):(o.pendingProps=a,o.type=n.type,o.flags=0,o.subtreeFlags=0,o.deletions=null),o.flags=n.flags&31457280,o.childLanes=n.childLanes,o.lanes=n.lanes,o.child=n.child,o.memoizedProps=n.memoizedProps,o.memoizedState=n.memoizedState,o.updateQueue=n.updateQueue,a=n.dependencies,o.dependencies=a===null?null:{lanes:a.lanes,firstContext:a.firstContext},o.sibling=n.sibling,o.index=n.index,o.ref=n.ref,o.refCleanup=n.refCleanup,o}function B_(n,a){n.flags&=31457282;var o=n.alternate;return o===null?(n.childLanes=0,n.lanes=a,n.child=null,n.subtreeFlags=0,n.memoizedProps=null,n.memoizedState=null,n.updateQueue=null,n.dependencies=null,n.stateNode=null):(n.childLanes=o.childLanes,n.lanes=o.lanes,n.child=o.child,n.subtreeFlags=0,n.deletions=null,n.memoizedProps=o.memoizedProps,n.memoizedState=o.memoizedState,n.updateQueue=o.updateQueue,n.type=o.type,a=o.dependencies,n.dependencies=a===null?null:{lanes:a.lanes,firstContext:a.firstContext}),n}function wc(n,a,o,c,p,_){var w=0;if(c=n,typeof n=="function")gd(n)&&(w=1);else if(typeof n=="string")w=VE(n,o,xt.current)?26:n==="html"||n==="head"||n==="body"?27:5;else e:switch(n){case d:return Lr(o.children,p,_,a);case h:w=8,p|=24;break;case m:return n=_i(12,o,a,p|2),n.elementType=m,n.lanes=_,n;case S:return n=_i(13,o,a,p),n.elementType=S,n.lanes=_,n;case x:return n=_i(19,o,a,p),n.elementType=x,n.lanes=_,n;case N:return z_(o,p,_,a);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case g:case b:w=10;break e;case v:w=9;break e;case E:w=11;break e;case y:w=14;break e;case T:w=16,c=null;break e}w=29,o=Error(i(130,n===null?"null":typeof n,"")),c=null}return a=_i(w,o,a,p),a.elementType=n,a.type=c,a.lanes=_,a}function Lr(n,a,o,c){return n=_i(7,n,c,a),n.lanes=o,n}function z_(n,a,o,c){n=_i(22,n,c,a),n.elementType=N,n.lanes=o;var p={_visibility:1,_pendingVisibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null,_current:null,detach:function(){var _=p._current;if(_===null)throw Error(i(456));if((p._pendingVisibility&2)===0){var w=Oa(_,2);w!==null&&(p._pendingVisibility|=2,Hn(w,_,2))}},attach:function(){var _=p._current;if(_===null)throw Error(i(456));if((p._pendingVisibility&2)!==0){var w=Oa(_,2);w!==null&&(p._pendingVisibility&=-3,Hn(w,_,2))}}};return n.stateNode=p,n}function _d(n,a,o){return n=_i(6,n,null,a),n.lanes=o,n}function vd(n,a,o){return a=_i(4,n.children!==null?n.children:[],n.key,a),a.lanes=o,a.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},a}function da(n){n.flags|=4}function k_(n,a){if(a.type!=="stylesheet"||(a.state.loading&4)!==0)n.flags&=-16777217;else if(n.flags|=16777216,!S0(a)){if(a=pi.current,a!==null&&((At&4194176)===At?Vi!==null:(At&62914560)!==At&&(At&536870912)===0||a!==Vi))throw Io=Mf,ig;n.flags|=8192}}function Tc(n,a){a!==null&&(n.flags|=4),n.flags&16384&&(a=n.tag!==22?Nt():536870912,n.lanes|=a,Ms|=a)}function Jo(n,a){if(!Ut)switch(n.tailMode){case"hidden":a=n.tail;for(var o=null;a!==null;)a.alternate!==null&&(o=a),a=a.sibling;o===null?n.tail=null:o.sibling=null;break;case"collapsed":o=n.tail;for(var c=null;o!==null;)o.alternate!==null&&(c=o),o=o.sibling;c===null?a||n.tail===null?n.tail=null:n.tail.sibling=null:c.sibling=null}}function Qt(n){var a=n.alternate!==null&&n.alternate.child===n.child,o=0,c=0;if(a)for(var p=n.child;p!==null;)o|=p.lanes|p.childLanes,c|=p.subtreeFlags&31457280,c|=p.flags&31457280,p.return=n,p=p.sibling;else for(p=n.child;p!==null;)o|=p.lanes|p.childLanes,c|=p.subtreeFlags,c|=p.flags,p.return=n,p=p.sibling;return n.subtreeFlags|=c,n.childLanes=o,a}function aE(n,a,o){var c=a.pendingProps;switch(xf(a),a.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Qt(a),null;case 1:return Qt(a),null;case 3:return o=a.stateNode,c=null,n!==null&&(c=n.memoizedState.cache),a.memoizedState.cache!==c&&(a.flags|=2048),la(_n),ct(),o.pendingContext&&(o.context=o.pendingContext,o.pendingContext=null),(n===null||n.child===null)&&(Lo(a)?da(a):n===null||n.memoizedState.isDehydrated&&(a.flags&256)===0||(a.flags|=1024,Ai!==null&&(Td(Ai),Ai=null))),Qt(a),null;case 26:return o=a.memoizedState,n===null?(da(a),o!==null?(Qt(a),k_(a,o)):(Qt(a),a.flags&=-16777217)):o?o!==n.memoizedState?(da(a),Qt(a),k_(a,o)):(Qt(a),a.flags&=-16777217):(n.memoizedProps!==c&&da(a),Qt(a),a.flags&=-16777217),null;case 27:Re(a),o=it.current;var p=a.type;if(n!==null&&a.stateNode!=null)n.memoizedProps!==c&&da(a);else{if(!c){if(a.stateNode===null)throw Error(i(166));return Qt(a),null}n=xt.current,Lo(a)?tg(a):(n=g0(p,c,o),a.stateNode=n,da(a))}return Qt(a),null;case 5:if(Re(a),o=a.type,n!==null&&a.stateNode!=null)n.memoizedProps!==c&&da(a);else{if(!c){if(a.stateNode===null)throw Error(i(166));return Qt(a),null}if(n=xt.current,Lo(a))tg(a);else{switch(p=Fc(it.current),n){case 1:n=p.createElementNS("http://www.w3.org/2000/svg",o);break;case 2:n=p.createElementNS("http://www.w3.org/1998/Math/MathML",o);break;default:switch(o){case"svg":n=p.createElementNS("http://www.w3.org/2000/svg",o);break;case"math":n=p.createElementNS("http://www.w3.org/1998/Math/MathML",o);break;case"script":n=p.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild);break;case"select":n=typeof c.is=="string"?p.createElement("select",{is:c.is}):p.createElement("select"),c.multiple?n.multiple=!0:c.size&&(n.size=c.size);break;default:n=typeof c.is=="string"?p.createElement(o,{is:c.is}):p.createElement(o)}}n[hn]=a,n[pn]=c;e:for(p=a.child;p!==null;){if(p.tag===5||p.tag===6)n.appendChild(p.stateNode);else if(p.tag!==4&&p.tag!==27&&p.child!==null){p.child.return=p,p=p.child;continue}if(p===a)break e;for(;p.sibling===null;){if(p.return===null||p.return===a)break e;p=p.return}p.sibling.return=p.return,p=p.sibling}a.stateNode=n;e:switch(Cn(n,o,c),o){case"button":case"input":case"select":case"textarea":n=!!c.autoFocus;break e;case"img":n=!0;break e;default:n=!1}n&&da(a)}}return Qt(a),a.flags&=-16777217,null;case 6:if(n&&a.stateNode!=null)n.memoizedProps!==c&&da(a);else{if(typeof c!="string"&&a.stateNode===null)throw Error(i(166));if(n=it.current,Lo(a)){if(n=a.stateNode,o=a.memoizedProps,c=null,p=kn,p!==null)switch(p.tag){case 27:case 5:c=p.memoizedProps}n[hn]=a,n=!!(n.nodeValue===o||c!==null&&c.suppressHydrationWarning===!0||u0(n.nodeValue,o)),n||Er(a)}else n=Fc(n).createTextNode(c),n[hn]=a,a.stateNode=n}return Qt(a),null;case 13:if(c=a.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(p=Lo(a),c!==null&&c.dehydrated!==null){if(n===null){if(!p)throw Error(i(318));if(p=a.memoizedState,p=p!==null?p.dehydrated:null,!p)throw Error(i(317));p[hn]=a}else Uo(),(a.flags&128)===0&&(a.memoizedState=null),a.flags|=4;Qt(a),p=!1}else Ai!==null&&(Td(Ai),Ai=null),p=!0;if(!p)return a.flags&256?(aa(a),a):(aa(a),null)}if(aa(a),(a.flags&128)!==0)return a.lanes=o,a;if(o=c!==null,n=n!==null&&n.memoizedState!==null,o){c=a.child,p=null,c.alternate!==null&&c.alternate.memoizedState!==null&&c.alternate.memoizedState.cachePool!==null&&(p=c.alternate.memoizedState.cachePool.pool);var _=null;c.memoizedState!==null&&c.memoizedState.cachePool!==null&&(_=c.memoizedState.cachePool.pool),_!==p&&(c.flags|=2048)}return o!==n&&o&&(a.child.flags|=8192),Tc(a,a.updateQueue),Qt(a),null;case 4:return ct(),n===null&&Fd(a.stateNode.containerInfo),Qt(a),null;case 10:return la(a.type),Qt(a),null;case 19:if(Ke(gn),p=a.memoizedState,p===null)return Qt(a),null;if(c=(a.flags&128)!==0,_=p.rendering,_===null)if(c)Jo(p,!1);else{if(an!==0||n!==null&&(n.flags&128)!==0)for(n=a.child;n!==null;){if(_=cc(n),_!==null){for(a.flags|=128,Jo(p,!1),n=_.updateQueue,a.updateQueue=n,Tc(a,n),a.subtreeFlags=0,n=o,o=a.child;o!==null;)B_(o,n),o=o.sibling;return Oe(gn,gn.current&1|2),a.child}n=n.sibling}p.tail!==null&&fe()>Ac&&(a.flags|=128,c=!0,Jo(p,!1),a.lanes=4194304)}else{if(!c)if(n=cc(_),n!==null){if(a.flags|=128,c=!0,n=n.updateQueue,a.updateQueue=n,Tc(a,n),Jo(p,!0),p.tail===null&&p.tailMode==="hidden"&&!_.alternate&&!Ut)return Qt(a),null}else 2*fe()-p.renderingStartTime>Ac&&o!==536870912&&(a.flags|=128,c=!0,Jo(p,!1),a.lanes=4194304);p.isBackwards?(_.sibling=a.child,a.child=_):(n=p.last,n!==null?n.sibling=_:a.child=_,p.last=_)}return p.tail!==null?(a=p.tail,p.rendering=a,p.tail=a.sibling,p.renderingStartTime=fe(),a.sibling=null,n=gn.current,Oe(gn,c?n&1|2:n&1),a):(Qt(a),null);case 22:case 23:return aa(a),wf(),c=a.memoizedState!==null,n!==null?n.memoizedState!==null!==c&&(a.flags|=8192):c&&(a.flags|=8192),c?(o&536870912)!==0&&(a.flags&128)===0&&(Qt(a),a.subtreeFlags&6&&(a.flags|=8192)):Qt(a),o=a.updateQueue,o!==null&&Tc(a,o.retryQueue),o=null,n!==null&&n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(o=n.memoizedState.cachePool.pool),c=null,a.memoizedState!==null&&a.memoizedState.cachePool!==null&&(c=a.memoizedState.cachePool.pool),c!==o&&(a.flags|=2048),n!==null&&Ke(Sr),null;case 24:return o=null,n!==null&&(o=n.memoizedState.cache),a.memoizedState.cache!==o&&(a.flags|=2048),la(_n),Qt(a),null;case 25:return null}throw Error(i(156,a.tag))}function rE(n,a){switch(xf(a),a.tag){case 1:return n=a.flags,n&65536?(a.flags=n&-65537|128,a):null;case 3:return la(_n),ct(),n=a.flags,(n&65536)!==0&&(n&128)===0?(a.flags=n&-65537|128,a):null;case 26:case 27:case 5:return Re(a),null;case 13:if(aa(a),n=a.memoizedState,n!==null&&n.dehydrated!==null){if(a.alternate===null)throw Error(i(340));Uo()}return n=a.flags,n&65536?(a.flags=n&-65537|128,a):null;case 19:return Ke(gn),null;case 4:return ct(),null;case 10:return la(a.type),null;case 22:case 23:return aa(a),wf(),n!==null&&Ke(Sr),n=a.flags,n&65536?(a.flags=n&-65537|128,a):null;case 24:return la(_n),null;case 25:return null;default:return null}}function H_(n,a){switch(xf(a),a.tag){case 3:la(_n),ct();break;case 26:case 27:case 5:Re(a);break;case 4:ct();break;case 13:aa(a);break;case 19:Ke(gn);break;case 10:la(a.type);break;case 22:case 23:aa(a),wf(),n!==null&&Ke(Sr);break;case 24:la(_n)}}var sE={getCacheForType:function(n){var a=Ln(_n),o=a.data.get(n);return o===void 0&&(o=n(),a.data.set(n,o)),o}},oE=typeof WeakMap=="function"?WeakMap:Map,Jt=0,Yt=null,vt=null,At=0,jt=0,ri=null,ha=!1,Es=!1,yd=!1,pa=0,an=0,ja=0,Ur=0,bd=0,vi=0,Ms=0,el=null,Wi=null,xd=!1,Ed=0,Ac=1/0,Rc=null,Ka=null,Cc=!1,Pr=null,tl=0,Md=0,Sd=null,nl=0,wd=null;function si(){if((Jt&2)!==0&&At!==0)return At&-At;if(R.T!==null){var n=ps;return n!==0?n:Ud()}return xo()}function V_(){vi===0&&(vi=(At&536870912)===0||Ut?dn():536870912);var n=pi.current;return n!==null&&(n.flags|=32),vi}function Hn(n,a,o){(n===Yt&&jt===2||n.cancelPendingCommit!==null)&&(Ss(n,0),ma(n,At,vi,!1)),Fn(n,o),((Jt&2)===0||n!==Yt)&&(n===Yt&&((Jt&2)===0&&(Ur|=o),an===4&&ma(n,At,vi,!1)),Xi(n))}function G_(n,a,o){if((Jt&6)!==0)throw Error(i(327));var c=!o&&(a&60)===0&&(a&n.expiredLanes)===0||at(n,a),p=c?uE(n,a):Cd(n,a,!0),_=c;do{if(p===0){Es&&!c&&ma(n,a,0,!1);break}else if(p===6)ma(n,a,0,!ha);else{if(o=n.current.alternate,_&&!lE(o)){p=Cd(n,a,!1),_=!1;continue}if(p===2){if(_=a,n.errorRecoveryDisabledLanes&_)var w=0;else w=n.pendingLanes&-536870913,w=w!==0?w:w&536870912?536870912:0;if(w!==0){a=w;e:{var L=n;p=el;var B=L.current.memoizedState.isDehydrated;if(B&&(Ss(L,w).flags|=256),w=Cd(L,w,!1),w!==2){if(yd&&!B){L.errorRecoveryDisabledLanes|=_,Ur|=_,p=4;break e}_=Wi,Wi=p,_!==null&&Td(_)}p=w}if(_=!1,p!==2)continue}}if(p===1){Ss(n,0),ma(n,a,0,!0);break}e:{switch(c=n,p){case 0:case 1:throw Error(i(345));case 4:if((a&4194176)===a){ma(c,a,vi,!ha);break e}break;case 2:Wi=null;break;case 3:case 5:break;default:throw Error(i(329))}if(c.finishedWork=o,c.finishedLanes=a,(a&62914560)===a&&(_=Ed+300-fe(),10<_)){if(ma(c,a,vi,!ha),Ie(c,0)!==0)break e;c.timeoutHandle=h0(W_.bind(null,c,o,Wi,Rc,xd,a,vi,Ur,Ms,ha,2,-0,0),_);break e}W_(c,o,Wi,Rc,xd,a,vi,Ur,Ms,ha,0,-0,0)}}break}while(!0);Xi(n)}function Td(n){Wi===null?Wi=n:Wi.push.apply(Wi,n)}function W_(n,a,o,c,p,_,w,L,B,j,pe,Ee,oe){var he=a.subtreeFlags;if((he&8192||(he&16785408)===16785408)&&(ll={stylesheets:null,count:0,unsuspend:GE},P_(a),a=XE(),a!==null)){n.cancelPendingCommit=a($_.bind(null,n,o,c,p,w,L,B,1,Ee,oe)),ma(n,_,w,!j);return}$_(n,o,c,p,w,L,B,pe,Ee,oe)}function lE(n){for(var a=n;;){var o=a.tag;if((o===0||o===11||o===15)&&a.flags&16384&&(o=a.updateQueue,o!==null&&(o=o.stores,o!==null)))for(var c=0;c<o.length;c++){var p=o[c],_=p.getSnapshot;p=p.value;try{if(!ni(_(),p))return!1}catch{return!1}}if(o=a.child,a.subtreeFlags&16384&&o!==null)o.return=a,a=o;else{if(a===n)break;for(;a.sibling===null;){if(a.return===null||a.return===n)return!0;a=a.return}a.sibling.return=a.return,a=a.sibling}}return!0}function ma(n,a,o,c){a&=~bd,a&=~Ur,n.suspendedLanes|=a,n.pingedLanes&=~a,c&&(n.warmLanes|=a),c=n.expirationTimes;for(var p=a;0<p;){var _=31-Qe(p),w=1<<_;c[_]=-1,p&=~w}o!==0&&bo(n,o,a)}function Dc(){return(Jt&6)===0?(il(0),!1):!0}function Ad(){if(vt!==null){if(jt===0)var n=vt.return;else n=vt,oa=Cr=null,Uf(n),ds=null,Fo=0,n=vt;for(;n!==null;)H_(n.alternate,n),n=n.return;vt=null}}function Ss(n,a){n.finishedWork=null,n.finishedLanes=0;var o=n.timeoutHandle;o!==-1&&(n.timeoutHandle=-1,AE(o)),o=n.cancelPendingCommit,o!==null&&(n.cancelPendingCommit=null,o()),Ad(),Yt=n,vt=o=Ya(n.current,null),At=a,jt=0,ri=null,ha=!1,Es=at(n,a),yd=!1,Ms=vi=bd=Ur=ja=an=0,Wi=el=null,xd=!1,(a&8)!==0&&(a|=a&32);var c=n.entangledLanes;if(c!==0)for(n=n.entanglements,c&=a;0<c;){var p=31-Qe(c),_=1<<p;a|=n[p],c&=~_}return pa=a,ec(),o}function X_(n,a){gt=null,R.H=Gi,a===Oo?(a=sg(),jt=3):a===ig?(a=sg(),jt=4):jt=a===a_?8:a!==null&&typeof a=="object"&&typeof a.then=="function"?6:1,ri=a,vt===null&&(an=1,bc(n,fi(a,n.current)))}function q_(){var n=R.H;return R.H=Gi,n===null?Gi:n}function Y_(){var n=R.A;return R.A=sE,n}function Rd(){an=4,ha||(At&4194176)!==At&&pi.current!==null||(Es=!0),(ja&134217727)===0&&(Ur&134217727)===0||Yt===null||ma(Yt,At,vi,!1)}function Cd(n,a,o){var c=Jt;Jt|=2;var p=q_(),_=Y_();(Yt!==n||At!==a)&&(Rc=null,Ss(n,a)),a=!1;var w=an;e:do try{if(jt!==0&&vt!==null){var L=vt,B=ri;switch(jt){case 8:Ad(),w=6;break e;case 3:case 2:case 6:pi.current===null&&(a=!0);var j=jt;if(jt=0,ri=null,ws(n,L,B,j),o&&Es){w=0;break e}break;default:j=jt,jt=0,ri=null,ws(n,L,B,j)}}cE(),w=an;break}catch(pe){X_(n,pe)}while(!0);return a&&n.shellSuspendCounter++,oa=Cr=null,Jt=c,R.H=p,R.A=_,vt===null&&(Yt=null,At=0,ec()),w}function cE(){for(;vt!==null;)j_(vt)}function uE(n,a){var o=Jt;Jt|=2;var c=q_(),p=Y_();Yt!==n||At!==a?(Rc=null,Ac=fe()+500,Ss(n,a)):Es=at(n,a);e:do try{if(jt!==0&&vt!==null){a=vt;var _=ri;t:switch(jt){case 1:jt=0,ri=null,ws(n,a,_,1);break;case 2:if(ag(_)){jt=0,ri=null,K_(a);break}a=function(){jt===2&&Yt===n&&(jt=7),Xi(n)},_.then(a,a);break e;case 3:jt=7;break e;case 4:jt=5;break e;case 7:ag(_)?(jt=0,ri=null,K_(a)):(jt=0,ri=null,ws(n,a,_,7));break;case 5:var w=null;switch(vt.tag){case 26:w=vt.memoizedState;case 5:case 27:var L=vt;if(!w||S0(w)){jt=0,ri=null;var B=L.sibling;if(B!==null)vt=B;else{var j=L.return;j!==null?(vt=j,Nc(j)):vt=null}break t}}jt=0,ri=null,ws(n,a,_,5);break;case 6:jt=0,ri=null,ws(n,a,_,6);break;case 8:Ad(),an=6;break e;default:throw Error(i(462))}}fE();break}catch(pe){X_(n,pe)}while(!0);return oa=Cr=null,R.H=c,R.A=p,Jt=o,vt!==null?0:(Yt=null,At=0,ec(),an)}function fE(){for(;vt!==null&&!D();)j_(vt)}function j_(n){var a=g_(n.alternate,n,pa);n.memoizedProps=n.pendingProps,a===null?Nc(n):vt=a}function K_(n){var a=n,o=a.alternate;switch(a.tag){case 15:case 0:a=u_(o,a,a.pendingProps,a.type,void 0,At);break;case 11:a=u_(o,a,a.pendingProps,a.type.render,a.ref,At);break;case 5:Uf(a);default:H_(o,a),a=vt=B_(a,pa),a=g_(o,a,pa)}n.memoizedProps=n.pendingProps,a===null?Nc(n):vt=a}function ws(n,a,o,c){oa=Cr=null,Uf(a),ds=null,Fo=0;var p=a.return;try{if(Jx(n,p,a,o,At)){an=1,bc(n,fi(o,n.current)),vt=null;return}}catch(_){if(p!==null)throw vt=p,_;an=1,bc(n,fi(o,n.current)),vt=null;return}a.flags&32768?(Ut||c===1?n=!0:Es||(At&536870912)!==0?n=!1:(ha=n=!0,(c===2||c===3||c===6)&&(c=pi.current,c!==null&&c.tag===13&&(c.flags|=16384))),Z_(a,n)):Nc(a)}function Nc(n){var a=n;do{if((a.flags&32768)!==0){Z_(a,ha);return}n=a.return;var o=aE(a.alternate,a,pa);if(o!==null){vt=o;return}if(a=a.sibling,a!==null){vt=a;return}vt=a=n}while(a!==null);an===0&&(an=5)}function Z_(n,a){do{var o=rE(n.alternate,n);if(o!==null){o.flags&=32767,vt=o;return}if(o=n.return,o!==null&&(o.flags|=32768,o.subtreeFlags=0,o.deletions=null),!a&&(n=n.sibling,n!==null)){vt=n;return}vt=n=o}while(n!==null);an=6,vt=null}function $_(n,a,o,c,p,_,w,L,B,j){var pe=R.T,Ee=Q.p;try{Q.p=2,R.T=null,dE(n,a,o,c,Ee,p,_,w,L,B,j)}finally{R.T=pe,Q.p=Ee}}function dE(n,a,o,c,p,_,w,L){do Ts();while(Pr!==null);if((Jt&6)!==0)throw Error(i(327));var B=n.finishedWork;if(c=n.finishedLanes,B===null)return null;if(n.finishedWork=null,n.finishedLanes=0,B===n.current)throw Error(i(177));n.callbackNode=null,n.callbackPriority=0,n.cancelPendingCommit=null;var j=B.lanes|B.childLanes;if(j|=vf,Wl(n,c,j,_,w,L),n===Yt&&(vt=Yt=null,At=0),(B.subtreeFlags&10256)===0&&(B.flags&10256)===0||Cc||(Cc=!0,Md=j,Sd=o,gE(Ue,function(){return Ts(),null})),o=(B.flags&15990)!==0,(B.subtreeFlags&15990)!==0||o?(o=R.T,R.T=null,_=Q.p,Q.p=2,w=Jt,Jt|=4,tE(n,B),N_(B,n),Ix(Hd,n.containerInfo),Gc=!!kd,Hd=kd=null,n.current=B,A_(n,B.alternate,B),ne(),Jt=w,Q.p=_,R.T=o):n.current=B,Cc?(Cc=!1,Pr=n,tl=c):Q_(n,j),j=n.pendingLanes,j===0&&(Ka=null),We(B.stateNode),Xi(n),a!==null)for(p=n.onRecoverableError,B=0;B<a.length;B++)j=a[B],p(j.value,{componentStack:j.stack});return(tl&3)!==0&&Ts(),j=n.pendingLanes,(c&4194218)!==0&&(j&42)!==0?n===wd?nl++:(nl=0,wd=n):nl=0,il(0),null}function Q_(n,a){(n.pooledCacheLanes&=a)===0&&(a=n.pooledCache,a!=null&&(n.pooledCache=null,zo(a)))}function Ts(){if(Pr!==null){var n=Pr,a=Md;Md=0;var o=es(tl),c=R.T,p=Q.p;try{if(Q.p=32>o?32:o,R.T=null,Pr===null)var _=!1;else{o=Sd,Sd=null;var w=Pr,L=tl;if(Pr=null,tl=0,(Jt&6)!==0)throw Error(i(331));var B=Jt;if(Jt|=4,I_(w.current),U_(w,w.current,L,o),Jt=B,il(0,!1),Ye&&typeof Ye.onPostCommitFiberRoot=="function")try{Ye.onPostCommitFiberRoot(et,w)}catch{}_=!0}return _}finally{Q.p=p,R.T=c,Q_(n,a)}}return!1}function J_(n,a,o){a=fi(o,a),a=Yf(n.stateNode,a,2),n=Ga(n,a,2),n!==null&&(Fn(n,2),Xi(n))}function qt(n,a,o){if(n.tag===3)J_(n,n,o);else for(;a!==null;){if(a.tag===3){J_(a,n,o);break}else if(a.tag===1){var c=a.stateNode;if(typeof a.type.getDerivedStateFromError=="function"||typeof c.componentDidCatch=="function"&&(Ka===null||!Ka.has(c))){n=fi(o,n),o=n_(2),c=Ga(a,o,2),c!==null&&(i_(o,c,a,n),Fn(c,2),Xi(c));break}}a=a.return}}function Dd(n,a,o){var c=n.pingCache;if(c===null){c=n.pingCache=new oE;var p=new Set;c.set(a,p)}else p=c.get(a),p===void 0&&(p=new Set,c.set(a,p));p.has(o)||(yd=!0,p.add(o),n=hE.bind(null,n,a,o),a.then(n,n))}function hE(n,a,o){var c=n.pingCache;c!==null&&c.delete(a),n.pingedLanes|=n.suspendedLanes&o,n.warmLanes&=~o,Yt===n&&(At&o)===o&&(an===4||an===3&&(At&62914560)===At&&300>fe()-Ed?(Jt&2)===0&&Ss(n,0):bd|=o,Ms===At&&(Ms=0)),Xi(n)}function e0(n,a){a===0&&(a=Nt()),n=Oa(n,a),n!==null&&(Fn(n,a),Xi(n))}function pE(n){var a=n.memoizedState,o=0;a!==null&&(o=a.retryLane),e0(n,o)}function mE(n,a){var o=0;switch(n.tag){case 13:var c=n.stateNode,p=n.memoizedState;p!==null&&(o=p.retryLane);break;case 19:c=n.stateNode;break;case 22:c=n.stateNode._retryCache;break;default:throw Error(i(314))}c!==null&&c.delete(a),e0(n,o)}function gE(n,a){return De(n,a)}var Lc=null,As=null,Nd=!1,Uc=!1,Ld=!1,Or=0;function Xi(n){n!==As&&n.next===null&&(As===null?Lc=As=n:As=As.next=n),Uc=!0,Nd||(Nd=!0,vE(_E))}function il(n,a){if(!Ld&&Uc){Ld=!0;do for(var o=!1,c=Lc;c!==null;){if(n!==0){var p=c.pendingLanes;if(p===0)var _=0;else{var w=c.suspendedLanes,L=c.pingedLanes;_=(1<<31-Qe(42|n)+1)-1,_&=p&~(w&~L),_=_&201326677?_&201326677|1:_?_|2:0}_!==0&&(o=!0,i0(c,_))}else _=At,_=Ie(c,c===Yt?_:0),(_&3)===0||at(c,_)||(o=!0,i0(c,_));c=c.next}while(o);Ld=!1}}function _E(){Uc=Nd=!1;var n=0;Or!==0&&(TE()&&(n=Or),Or=0);for(var a=fe(),o=null,c=Lc;c!==null;){var p=c.next,_=t0(c,a);_===0?(c.next=null,o===null?Lc=p:o.next=p,p===null&&(As=o)):(o=c,(n!==0||(_&3)!==0)&&(Uc=!0)),c=p}il(n)}function t0(n,a){for(var o=n.suspendedLanes,c=n.pingedLanes,p=n.expirationTimes,_=n.pendingLanes&-62914561;0<_;){var w=31-Qe(_),L=1<<w,B=p[w];B===-1?((L&o)===0||(L&c)!==0)&&(p[w]=Zt(L,a)):B<=a&&(n.expiredLanes|=L),_&=~L}if(a=Yt,o=At,o=Ie(n,n===a?o:0),c=n.callbackNode,o===0||n===a&&jt===2||n.cancelPendingCommit!==null)return c!==null&&c!==null&&O(c),n.callbackNode=null,n.callbackPriority=0;if((o&3)===0||at(n,o)){if(a=o&-o,a===n.callbackPriority)return a;switch(c!==null&&O(c),es(o)){case 2:case 8:o=qe;break;case 32:o=Ue;break;case 268435456:o=Et;break;default:o=Ue}return c=n0.bind(null,n),o=De(o,c),n.callbackPriority=a,n.callbackNode=o,a}return c!==null&&c!==null&&O(c),n.callbackPriority=2,n.callbackNode=null,2}function n0(n,a){var o=n.callbackNode;if(Ts()&&n.callbackNode!==o)return null;var c=At;return c=Ie(n,n===Yt?c:0),c===0?null:(G_(n,c,a),t0(n,fe()),n.callbackNode!=null&&n.callbackNode===o?n0.bind(null,n):null)}function i0(n,a){if(Ts())return null;G_(n,a,!0)}function vE(n){RE(function(){(Jt&6)!==0?De(ge,n):n()})}function Ud(){return Or===0&&(Or=dn()),Or}function a0(n){return n==null||typeof n=="symbol"||typeof n=="boolean"?null:typeof n=="function"?n:Yl(""+n)}function r0(n,a){var o=a.ownerDocument.createElement("input");return o.name=a.name,o.value=a.value,n.id&&o.setAttribute("form",n.id),a.parentNode.insertBefore(o,a),n=new FormData(n),o.parentNode.removeChild(o),n}function yE(n,a,o,c,p){if(a==="submit"&&o&&o.stateNode===p){var _=a0((p[pn]||null).action),w=c.submitter;w&&(a=(a=w[pn]||null)?a0(a.formAction):w.getAttribute("formAction"),a!==null&&(_=a,w=null));var L=new $l("action","action",null,c,p);n.push({event:L,listeners:[{instance:null,listener:function(){if(c.defaultPrevented){if(Or!==0){var B=w?r0(p,w):new FormData(p);Vf(o,{pending:!0,data:B,method:p.method,action:_},null,B)}}else typeof _=="function"&&(L.preventDefault(),B=w?r0(p,w):new FormData(p),Vf(o,{pending:!0,data:B,method:p.method,action:_},_,B))},currentTarget:p}]})}}for(var Pd=0;Pd<$m.length;Pd++){var Od=$m[Pd],bE=Od.toLowerCase(),xE=Od[0].toUpperCase()+Od.slice(1);Ti(bE,"on"+xE)}Ti(qm,"onAnimationEnd"),Ti(Ym,"onAnimationIteration"),Ti(jm,"onAnimationStart"),Ti("dblclick","onDoubleClick"),Ti("focusin","onFocus"),Ti("focusout","onBlur"),Ti(Bx,"onTransitionRun"),Ti(zx,"onTransitionStart"),Ti(kx,"onTransitionCancel"),Ti(Km,"onTransitionEnd"),ke("onMouseEnter",["mouseout","mouseover"]),ke("onMouseLeave",["mouseout","mouseover"]),ke("onPointerEnter",["pointerout","pointerover"]),ke("onPointerLeave",["pointerout","pointerover"]),Le("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),Le("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),Le("onBeforeInput",["compositionend","keypress","textInput","paste"]),Le("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),Le("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),Le("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var al="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),EE=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(al));function s0(n,a){a=(a&4)!==0;for(var o=0;o<n.length;o++){var c=n[o],p=c.event;c=c.listeners;e:{var _=void 0;if(a)for(var w=c.length-1;0<=w;w--){var L=c[w],B=L.instance,j=L.currentTarget;if(L=L.listener,B!==_&&p.isPropagationStopped())break e;_=L,p.currentTarget=j;try{_(p)}catch(pe){yc(pe)}p.currentTarget=null,_=B}else for(w=0;w<c.length;w++){if(L=c[w],B=L.instance,j=L.currentTarget,L=L.listener,B!==_&&p.isPropagationStopped())break e;_=L,p.currentTarget=j;try{_(p)}catch(pe){yc(pe)}p.currentTarget=null,_=B}}}}function Tt(n,a){var o=a[ts];o===void 0&&(o=a[ts]=new Set);var c=n+"__bubble";o.has(c)||(o0(a,n,2,!1),o.add(c))}function Id(n,a,o){var c=0;a&&(c|=4),o0(o,n,c,a)}var Pc="_reactListening"+Math.random().toString(36).slice(2);function Fd(n){if(!n[Pc]){n[Pc]=!0,ee.forEach(function(o){o!=="selectionchange"&&(EE.has(o)||Id(o,!1,n),Id(o,!0,n))});var a=n.nodeType===9?n:n.ownerDocument;a===null||a[Pc]||(a[Pc]=!0,Id("selectionchange",!1,a))}}function o0(n,a,o,c){switch(D0(a)){case 2:var p=jE;break;case 8:p=KE;break;default:p=Zd}o=p.bind(null,a,o,n),p=void 0,!rf||a!=="touchstart"&&a!=="touchmove"&&a!=="wheel"||(p=!0),c?p!==void 0?n.addEventListener(a,o,{capture:!0,passive:p}):n.addEventListener(a,o,!0):p!==void 0?n.addEventListener(a,o,{passive:p}):n.addEventListener(a,o,!1)}function Bd(n,a,o,c,p){var _=c;if((a&1)===0&&(a&2)===0&&c!==null)e:for(;;){if(c===null)return;var w=c.tag;if(w===3||w===4){var L=c.stateNode.containerInfo;if(L===p||L.nodeType===8&&L.parentNode===p)break;if(w===4)for(w=c.return;w!==null;){var B=w.tag;if((B===3||B===4)&&(B=w.stateNode.containerInfo,B===p||B.nodeType===8&&B.parentNode===p))return;w=w.return}for(;L!==null;){if(w=ta(L),w===null)return;if(B=w.tag,B===5||B===6||B===26||B===27){c=_=w;continue e}L=L.parentNode}}c=c.return}Em(function(){var j=_,pe=nf(o),Ee=[];e:{var oe=Zm.get(n);if(oe!==void 0){var he=$l,je=n;switch(n){case"keypress":if(Kl(o)===0)break e;case"keydown":case"keyup":he=mx;break;case"focusin":je="focus",he=cf;break;case"focusout":je="blur",he=cf;break;case"beforeblur":case"afterblur":he=cf;break;case"click":if(o.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":he=wm;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":he=ix;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":he=vx;break;case qm:case Ym:case jm:he=sx;break;case Km:he=bx;break;case"scroll":case"scrollend":he=tx;break;case"wheel":he=Ex;break;case"copy":case"cut":case"paste":he=lx;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":he=Am;break;case"toggle":case"beforetoggle":he=Sx}var ut=(a&4)!==0,rn=!ut&&(n==="scroll"||n==="scrollend"),te=ut?oe!==null?oe+"Capture":null:oe;ut=[];for(var q=j,ae;q!==null;){var _e=q;if(ae=_e.stateNode,_e=_e.tag,_e!==5&&_e!==26&&_e!==27||ae===null||te===null||(_e=Mo(q,te),_e!=null&&ut.push(rl(q,_e,ae))),rn)break;q=q.return}0<ut.length&&(oe=new he(oe,je,null,o,pe),Ee.push({event:oe,listeners:ut}))}}if((a&7)===0){e:{if(oe=n==="mouseover"||n==="pointerover",he=n==="mouseout"||n==="pointerout",oe&&o!==tf&&(je=o.relatedTarget||o.fromElement)&&(ta(je)||je[ea]))break e;if((he||oe)&&(oe=pe.window===pe?pe:(oe=pe.ownerDocument)?oe.defaultView||oe.parentWindow:window,he?(je=o.relatedTarget||o.toElement,he=j,je=je?ta(je):null,je!==null&&(rn=Y(je),ut=je.tag,je!==rn||ut!==5&&ut!==27&&ut!==6)&&(je=null)):(he=null,je=j),he!==je)){if(ut=wm,_e="onMouseLeave",te="onMouseEnter",q="mouse",(n==="pointerout"||n==="pointerover")&&(ut=Am,_e="onPointerLeave",te="onPointerEnter",q="pointer"),rn=he==null?oe:$(he),ae=je==null?oe:$(je),oe=new ut(_e,q+"leave",he,o,pe),oe.target=rn,oe.relatedTarget=ae,_e=null,ta(pe)===j&&(ut=new ut(te,q+"enter",je,o,pe),ut.target=ae,ut.relatedTarget=rn,_e=ut),rn=_e,he&&je)t:{for(ut=he,te=je,q=0,ae=ut;ae;ae=Rs(ae))q++;for(ae=0,_e=te;_e;_e=Rs(_e))ae++;for(;0<q-ae;)ut=Rs(ut),q--;for(;0<ae-q;)te=Rs(te),ae--;for(;q--;){if(ut===te||te!==null&&ut===te.alternate)break t;ut=Rs(ut),te=Rs(te)}ut=null}else ut=null;he!==null&&l0(Ee,oe,he,ut,!1),je!==null&&rn!==null&&l0(Ee,rn,je,ut,!0)}}e:{if(oe=j?$(j):window,he=oe.nodeName&&oe.nodeName.toLowerCase(),he==="select"||he==="input"&&oe.type==="file")var Xe=Om;else if(Um(oe))if(Im)Xe=Px;else{Xe=Lx;var _t=Nx}else he=oe.nodeName,!he||he.toLowerCase()!=="input"||oe.type!=="checkbox"&&oe.type!=="radio"?j&&ef(j.elementType)&&(Xe=Om):Xe=Ux;if(Xe&&(Xe=Xe(n,j))){Pm(Ee,Xe,o,pe);break e}_t&&_t(n,oe,j),n==="focusout"&&j&&oe.type==="number"&&j.memoizedProps.value!=null&&Nn(oe,"number",oe.value)}switch(_t=j?$(j):window,n){case"focusin":(Um(_t)||_t.contentEditable==="true")&&(ss=_t,mf=j,No=null);break;case"focusout":No=mf=ss=null;break;case"mousedown":gf=!0;break;case"contextmenu":case"mouseup":case"dragend":gf=!1,Wm(Ee,o,pe);break;case"selectionchange":if(Fx)break;case"keydown":case"keyup":Wm(Ee,o,pe)}var Ze;if(ff)e:{switch(n){case"compositionstart":var nt="onCompositionStart";break e;case"compositionend":nt="onCompositionEnd";break e;case"compositionupdate":nt="onCompositionUpdate";break e}nt=void 0}else rs?Nm(n,o)&&(nt="onCompositionEnd"):n==="keydown"&&o.keyCode===229&&(nt="onCompositionStart");nt&&(Rm&&o.locale!=="ko"&&(rs||nt!=="onCompositionStart"?nt==="onCompositionEnd"&&rs&&(Ze=Mm()):(Pa=pe,sf="value"in Pa?Pa.value:Pa.textContent,rs=!0)),_t=Oc(j,nt),0<_t.length&&(nt=new Tm(nt,n,null,o,pe),Ee.push({event:nt,listeners:_t}),Ze?nt.data=Ze:(Ze=Lm(o),Ze!==null&&(nt.data=Ze)))),(Ze=Tx?Ax(n,o):Rx(n,o))&&(nt=Oc(j,"onBeforeInput"),0<nt.length&&(_t=new Tm("onBeforeInput","beforeinput",null,o,pe),Ee.push({event:_t,listeners:nt}),_t.data=Ze)),yE(Ee,n,j,o,pe)}s0(Ee,a)})}function rl(n,a,o){return{instance:n,listener:a,currentTarget:o}}function Oc(n,a){for(var o=a+"Capture",c=[];n!==null;){var p=n,_=p.stateNode;p=p.tag,p!==5&&p!==26&&p!==27||_===null||(p=Mo(n,o),p!=null&&c.unshift(rl(n,p,_)),p=Mo(n,a),p!=null&&c.push(rl(n,p,_))),n=n.return}return c}function Rs(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5&&n.tag!==27);return n||null}function l0(n,a,o,c,p){for(var _=a._reactName,w=[];o!==null&&o!==c;){var L=o,B=L.alternate,j=L.stateNode;if(L=L.tag,B!==null&&B===c)break;L!==5&&L!==26&&L!==27||j===null||(B=j,p?(j=Mo(o,_),j!=null&&w.unshift(rl(o,j,B))):p||(j=Mo(o,_),j!=null&&w.push(rl(o,j,B)))),o=o.return}w.length!==0&&n.push({event:a,listeners:w})}var ME=/\r\n?/g,SE=/\u0000|\uFFFD/g;function c0(n){return(typeof n=="string"?n:""+n).replace(ME,`
`).replace(SE,"")}function u0(n,a){return a=c0(a),c0(n)===a}function Ic(){}function Wt(n,a,o,c,p,_){switch(o){case"children":typeof c=="string"?a==="body"||a==="textarea"&&c===""||Zn(n,c):(typeof c=="number"||typeof c=="bigint")&&a!=="body"&&Zn(n,""+c);break;case"className":Kt(n,"class",c);break;case"tabIndex":Kt(n,"tabindex",c);break;case"dir":case"role":case"viewBox":case"width":case"height":Kt(n,o,c);break;case"style":bm(n,c,_);break;case"data":if(a!=="object"){Kt(n,"data",c);break}case"src":case"href":if(c===""&&(a!=="a"||o!=="href")){n.removeAttribute(o);break}if(c==null||typeof c=="function"||typeof c=="symbol"||typeof c=="boolean"){n.removeAttribute(o);break}c=Yl(""+c),n.setAttribute(o,c);break;case"action":case"formAction":if(typeof c=="function"){n.setAttribute(o,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof _=="function"&&(o==="formAction"?(a!=="input"&&Wt(n,a,"name",p.name,p,null),Wt(n,a,"formEncType",p.formEncType,p,null),Wt(n,a,"formMethod",p.formMethod,p,null),Wt(n,a,"formTarget",p.formTarget,p,null)):(Wt(n,a,"encType",p.encType,p,null),Wt(n,a,"method",p.method,p,null),Wt(n,a,"target",p.target,p,null)));if(c==null||typeof c=="symbol"||typeof c=="boolean"){n.removeAttribute(o);break}c=Yl(""+c),n.setAttribute(o,c);break;case"onClick":c!=null&&(n.onclick=Ic);break;case"onScroll":c!=null&&Tt("scroll",n);break;case"onScrollEnd":c!=null&&Tt("scrollend",n);break;case"dangerouslySetInnerHTML":if(c!=null){if(typeof c!="object"||!("__html"in c))throw Error(i(61));if(o=c.__html,o!=null){if(p.children!=null)throw Error(i(60));n.innerHTML=o}}break;case"multiple":n.multiple=c&&typeof c!="function"&&typeof c!="symbol";break;case"muted":n.muted=c&&typeof c!="function"&&typeof c!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(c==null||typeof c=="function"||typeof c=="boolean"||typeof c=="symbol"){n.removeAttribute("xlink:href");break}o=Yl(""+c),n.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",o);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":c!=null&&typeof c!="function"&&typeof c!="symbol"?n.setAttribute(o,""+c):n.removeAttribute(o);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":c&&typeof c!="function"&&typeof c!="symbol"?n.setAttribute(o,""):n.removeAttribute(o);break;case"capture":case"download":c===!0?n.setAttribute(o,""):c!==!1&&c!=null&&typeof c!="function"&&typeof c!="symbol"?n.setAttribute(o,c):n.removeAttribute(o);break;case"cols":case"rows":case"size":case"span":c!=null&&typeof c!="function"&&typeof c!="symbol"&&!isNaN(c)&&1<=c?n.setAttribute(o,c):n.removeAttribute(o);break;case"rowSpan":case"start":c==null||typeof c=="function"||typeof c=="symbol"||isNaN(c)?n.removeAttribute(o):n.setAttribute(o,c);break;case"popover":Tt("beforetoggle",n),Tt("toggle",n),St(n,"popover",c);break;case"xlinkActuate":Lt(n,"http://www.w3.org/1999/xlink","xlink:actuate",c);break;case"xlinkArcrole":Lt(n,"http://www.w3.org/1999/xlink","xlink:arcrole",c);break;case"xlinkRole":Lt(n,"http://www.w3.org/1999/xlink","xlink:role",c);break;case"xlinkShow":Lt(n,"http://www.w3.org/1999/xlink","xlink:show",c);break;case"xlinkTitle":Lt(n,"http://www.w3.org/1999/xlink","xlink:title",c);break;case"xlinkType":Lt(n,"http://www.w3.org/1999/xlink","xlink:type",c);break;case"xmlBase":Lt(n,"http://www.w3.org/XML/1998/namespace","xml:base",c);break;case"xmlLang":Lt(n,"http://www.w3.org/XML/1998/namespace","xml:lang",c);break;case"xmlSpace":Lt(n,"http://www.w3.org/XML/1998/namespace","xml:space",c);break;case"is":St(n,"is",c);break;case"innerText":case"textContent":break;default:(!(2<o.length)||o[0]!=="o"&&o[0]!=="O"||o[1]!=="n"&&o[1]!=="N")&&(o=Jb.get(o)||o,St(n,o,c))}}function zd(n,a,o,c,p,_){switch(o){case"style":bm(n,c,_);break;case"dangerouslySetInnerHTML":if(c!=null){if(typeof c!="object"||!("__html"in c))throw Error(i(61));if(o=c.__html,o!=null){if(p.children!=null)throw Error(i(60));n.innerHTML=o}}break;case"children":typeof c=="string"?Zn(n,c):(typeof c=="number"||typeof c=="bigint")&&Zn(n,""+c);break;case"onScroll":c!=null&&Tt("scroll",n);break;case"onScrollEnd":c!=null&&Tt("scrollend",n);break;case"onClick":c!=null&&(n.onclick=Ic);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!Me.hasOwnProperty(o))e:{if(o[0]==="o"&&o[1]==="n"&&(p=o.endsWith("Capture"),a=o.slice(2,p?o.length-7:void 0),_=n[pn]||null,_=_!=null?_[o]:null,typeof _=="function"&&n.removeEventListener(a,_,p),typeof c=="function")){typeof _!="function"&&_!==null&&(o in n?n[o]=null:n.hasAttribute(o)&&n.removeAttribute(o)),n.addEventListener(a,c,p);break e}o in n?n[o]=c:c===!0?n.setAttribute(o,""):St(n,o,c)}}}function Cn(n,a,o){switch(a){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Tt("error",n),Tt("load",n);var c=!1,p=!1,_;for(_ in o)if(o.hasOwnProperty(_)){var w=o[_];if(w!=null)switch(_){case"src":c=!0;break;case"srcSet":p=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(i(137,a));default:Wt(n,a,_,w,o,null)}}p&&Wt(n,a,"srcSet",o.srcSet,o,null),c&&Wt(n,a,"src",o.src,o,null);return;case"input":Tt("invalid",n);var L=_=w=p=null,B=null,j=null;for(c in o)if(o.hasOwnProperty(c)){var pe=o[c];if(pe!=null)switch(c){case"name":p=pe;break;case"type":w=pe;break;case"checked":B=pe;break;case"defaultChecked":j=pe;break;case"value":_=pe;break;case"defaultValue":L=pe;break;case"children":case"dangerouslySetInnerHTML":if(pe!=null)throw Error(i(137,a));break;default:Wt(n,a,c,pe,o,null)}}zn(n,_,L,B,j,w,p,!1),wt(n);return;case"select":Tt("invalid",n),c=w=_=null;for(p in o)if(o.hasOwnProperty(p)&&(L=o[p],L!=null))switch(p){case"value":_=L;break;case"defaultValue":w=L;break;case"multiple":c=L;default:Wt(n,a,p,L,o,null)}a=_,o=w,n.multiple=!!c,a!=null?tn(n,!!c,a,!1):o!=null&&tn(n,!!c,o,!0);return;case"textarea":Tt("invalid",n),_=p=c=null;for(w in o)if(o.hasOwnProperty(w)&&(L=o[w],L!=null))switch(w){case"value":c=L;break;case"defaultValue":p=L;break;case"children":_=L;break;case"dangerouslySetInnerHTML":if(L!=null)throw Error(i(91));break;default:Wt(n,a,w,L,o,null)}ns(n,c,p,_),wt(n);return;case"option":for(B in o)if(o.hasOwnProperty(B)&&(c=o[B],c!=null))switch(B){case"selected":n.selected=c&&typeof c!="function"&&typeof c!="symbol";break;default:Wt(n,a,B,c,o,null)}return;case"dialog":Tt("cancel",n),Tt("close",n);break;case"iframe":case"object":Tt("load",n);break;case"video":case"audio":for(c=0;c<al.length;c++)Tt(al[c],n);break;case"image":Tt("error",n),Tt("load",n);break;case"details":Tt("toggle",n);break;case"embed":case"source":case"link":Tt("error",n),Tt("load",n);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(j in o)if(o.hasOwnProperty(j)&&(c=o[j],c!=null))switch(j){case"children":case"dangerouslySetInnerHTML":throw Error(i(137,a));default:Wt(n,a,j,c,o,null)}return;default:if(ef(a)){for(pe in o)o.hasOwnProperty(pe)&&(c=o[pe],c!==void 0&&zd(n,a,pe,c,o,void 0));return}}for(L in o)o.hasOwnProperty(L)&&(c=o[L],c!=null&&Wt(n,a,L,c,o,null))}function wE(n,a,o,c){switch(a){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var p=null,_=null,w=null,L=null,B=null,j=null,pe=null;for(he in o){var Ee=o[he];if(o.hasOwnProperty(he)&&Ee!=null)switch(he){case"checked":break;case"value":break;case"defaultValue":B=Ee;default:c.hasOwnProperty(he)||Wt(n,a,he,null,c,Ee)}}for(var oe in c){var he=c[oe];if(Ee=o[oe],c.hasOwnProperty(oe)&&(he!=null||Ee!=null))switch(oe){case"type":_=he;break;case"name":p=he;break;case"checked":j=he;break;case"defaultChecked":pe=he;break;case"value":w=he;break;case"defaultValue":L=he;break;case"children":case"dangerouslySetInnerHTML":if(he!=null)throw Error(i(137,a));break;default:he!==Ee&&Wt(n,a,oe,he,c,Ee)}}Vt(n,w,L,B,j,pe,_,p);return;case"select":he=w=L=oe=null;for(_ in o)if(B=o[_],o.hasOwnProperty(_)&&B!=null)switch(_){case"value":break;case"multiple":he=B;default:c.hasOwnProperty(_)||Wt(n,a,_,null,c,B)}for(p in c)if(_=c[p],B=o[p],c.hasOwnProperty(p)&&(_!=null||B!=null))switch(p){case"value":oe=_;break;case"defaultValue":L=_;break;case"multiple":w=_;default:_!==B&&Wt(n,a,p,_,c,B)}a=L,o=w,c=he,oe!=null?tn(n,!!o,oe,!1):!!c!=!!o&&(a!=null?tn(n,!!o,a,!0):tn(n,!!o,o?[]:"",!1));return;case"textarea":he=oe=null;for(L in o)if(p=o[L],o.hasOwnProperty(L)&&p!=null&&!c.hasOwnProperty(L))switch(L){case"value":break;case"children":break;default:Wt(n,a,L,null,c,p)}for(w in c)if(p=c[w],_=o[w],c.hasOwnProperty(w)&&(p!=null||_!=null))switch(w){case"value":oe=p;break;case"defaultValue":he=p;break;case"children":break;case"dangerouslySetInnerHTML":if(p!=null)throw Error(i(91));break;default:p!==_&&Wt(n,a,w,p,c,_)}Tn(n,oe,he);return;case"option":for(var je in o)if(oe=o[je],o.hasOwnProperty(je)&&oe!=null&&!c.hasOwnProperty(je))switch(je){case"selected":n.selected=!1;break;default:Wt(n,a,je,null,c,oe)}for(B in c)if(oe=c[B],he=o[B],c.hasOwnProperty(B)&&oe!==he&&(oe!=null||he!=null))switch(B){case"selected":n.selected=oe&&typeof oe!="function"&&typeof oe!="symbol";break;default:Wt(n,a,B,oe,c,he)}return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var ut in o)oe=o[ut],o.hasOwnProperty(ut)&&oe!=null&&!c.hasOwnProperty(ut)&&Wt(n,a,ut,null,c,oe);for(j in c)if(oe=c[j],he=o[j],c.hasOwnProperty(j)&&oe!==he&&(oe!=null||he!=null))switch(j){case"children":case"dangerouslySetInnerHTML":if(oe!=null)throw Error(i(137,a));break;default:Wt(n,a,j,oe,c,he)}return;default:if(ef(a)){for(var rn in o)oe=o[rn],o.hasOwnProperty(rn)&&oe!==void 0&&!c.hasOwnProperty(rn)&&zd(n,a,rn,void 0,c,oe);for(pe in c)oe=c[pe],he=o[pe],!c.hasOwnProperty(pe)||oe===he||oe===void 0&&he===void 0||zd(n,a,pe,oe,c,he);return}}for(var te in o)oe=o[te],o.hasOwnProperty(te)&&oe!=null&&!c.hasOwnProperty(te)&&Wt(n,a,te,null,c,oe);for(Ee in c)oe=c[Ee],he=o[Ee],!c.hasOwnProperty(Ee)||oe===he||oe==null&&he==null||Wt(n,a,Ee,oe,c,he)}var kd=null,Hd=null;function Fc(n){return n.nodeType===9?n:n.ownerDocument}function f0(n){switch(n){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function d0(n,a){if(n===0)switch(a){case"svg":return 1;case"math":return 2;default:return 0}return n===1&&a==="foreignObject"?0:n}function Vd(n,a){return n==="textarea"||n==="noscript"||typeof a.children=="string"||typeof a.children=="number"||typeof a.children=="bigint"||typeof a.dangerouslySetInnerHTML=="object"&&a.dangerouslySetInnerHTML!==null&&a.dangerouslySetInnerHTML.__html!=null}var Gd=null;function TE(){var n=window.event;return n&&n.type==="popstate"?n===Gd?!1:(Gd=n,!0):(Gd=null,!1)}var h0=typeof setTimeout=="function"?setTimeout:void 0,AE=typeof clearTimeout=="function"?clearTimeout:void 0,p0=typeof Promise=="function"?Promise:void 0,RE=typeof queueMicrotask=="function"?queueMicrotask:typeof p0<"u"?function(n){return p0.resolve(null).then(n).catch(CE)}:h0;function CE(n){setTimeout(function(){throw n})}function Wd(n,a){var o=a,c=0;do{var p=o.nextSibling;if(n.removeChild(o),p&&p.nodeType===8)if(o=p.data,o==="/$"){if(c===0){n.removeChild(p),hl(a);return}c--}else o!=="$"&&o!=="$?"&&o!=="$!"||c++;o=p}while(o);hl(a)}function Xd(n){var a=n.firstChild;for(a&&a.nodeType===10&&(a=a.nextSibling);a;){var o=a;switch(a=a.nextSibling,o.nodeName){case"HTML":case"HEAD":case"BODY":Xd(o),Eo(o);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(o.rel.toLowerCase()==="stylesheet")continue}n.removeChild(o)}}function DE(n,a,o,c){for(;n.nodeType===1;){var p=o;if(n.nodeName.toLowerCase()!==a.toLowerCase()){if(!c&&(n.nodeName!=="INPUT"||n.type!=="hidden"))break}else if(c){if(!n[gr])switch(a){case"meta":if(!n.hasAttribute("itemprop"))break;return n;case"link":if(_=n.getAttribute("rel"),_==="stylesheet"&&n.hasAttribute("data-precedence"))break;if(_!==p.rel||n.getAttribute("href")!==(p.href==null?null:p.href)||n.getAttribute("crossorigin")!==(p.crossOrigin==null?null:p.crossOrigin)||n.getAttribute("title")!==(p.title==null?null:p.title))break;return n;case"style":if(n.hasAttribute("data-precedence"))break;return n;case"script":if(_=n.getAttribute("src"),(_!==(p.src==null?null:p.src)||n.getAttribute("type")!==(p.type==null?null:p.type)||n.getAttribute("crossorigin")!==(p.crossOrigin==null?null:p.crossOrigin))&&_&&n.hasAttribute("async")&&!n.hasAttribute("itemprop"))break;return n;default:return n}}else if(a==="input"&&n.type==="hidden"){var _=p.name==null?null:""+p.name;if(p.type==="hidden"&&n.getAttribute("name")===_)return n}else return n;if(n=Ci(n.nextSibling),n===null)break}return null}function NE(n,a,o){if(a==="")return null;for(;n.nodeType!==3;)if((n.nodeType!==1||n.nodeName!=="INPUT"||n.type!=="hidden")&&!o||(n=Ci(n.nextSibling),n===null))return null;return n}function Ci(n){for(;n!=null;n=n.nextSibling){var a=n.nodeType;if(a===1||a===3)break;if(a===8){if(a=n.data,a==="$"||a==="$!"||a==="$?"||a==="F!"||a==="F")break;if(a==="/$")return null}}return n}function m0(n){n=n.previousSibling;for(var a=0;n;){if(n.nodeType===8){var o=n.data;if(o==="$"||o==="$!"||o==="$?"){if(a===0)return n;a--}else o==="/$"&&a++}n=n.previousSibling}return null}function g0(n,a,o){switch(a=Fc(o),n){case"html":if(n=a.documentElement,!n)throw Error(i(452));return n;case"head":if(n=a.head,!n)throw Error(i(453));return n;case"body":if(n=a.body,!n)throw Error(i(454));return n;default:throw Error(i(451))}}var yi=new Map,_0=new Set;function Bc(n){return typeof n.getRootNode=="function"?n.getRootNode():n.ownerDocument}var ga=Q.d;Q.d={f:LE,r:UE,D:PE,C:OE,L:IE,m:FE,X:zE,S:BE,M:kE};function LE(){var n=ga.f(),a=Dc();return n||a}function UE(n){var a=U(n);a!==null&&a.tag===5&&a.type==="form"?Wg(a):ga.r(n)}var Cs=typeof document>"u"?null:document;function v0(n,a,o){var c=Cs;if(c&&typeof a=="string"&&a){var p=bn(a);p='link[rel="'+n+'"][href="'+p+'"]',typeof o=="string"&&(p+='[crossorigin="'+o+'"]'),_0.has(p)||(_0.add(p),n={rel:n,crossOrigin:o,href:a},c.querySelector(p)===null&&(a=c.createElement("link"),Cn(a,"link",n),ie(a),c.head.appendChild(a)))}}function PE(n){ga.D(n),v0("dns-prefetch",n,null)}function OE(n,a){ga.C(n,a),v0("preconnect",n,a)}function IE(n,a,o){ga.L(n,a,o);var c=Cs;if(c&&n&&a){var p='link[rel="preload"][as="'+bn(a)+'"]';a==="image"&&o&&o.imageSrcSet?(p+='[imagesrcset="'+bn(o.imageSrcSet)+'"]',typeof o.imageSizes=="string"&&(p+='[imagesizes="'+bn(o.imageSizes)+'"]')):p+='[href="'+bn(n)+'"]';var _=p;switch(a){case"style":_=Ds(n);break;case"script":_=Ns(n)}yi.has(_)||(n=C({rel:"preload",href:a==="image"&&o&&o.imageSrcSet?void 0:n,as:a},o),yi.set(_,n),c.querySelector(p)!==null||a==="style"&&c.querySelector(sl(_))||a==="script"&&c.querySelector(ol(_))||(a=c.createElement("link"),Cn(a,"link",n),ie(a),c.head.appendChild(a)))}}function FE(n,a){ga.m(n,a);var o=Cs;if(o&&n){var c=a&&typeof a.as=="string"?a.as:"script",p='link[rel="modulepreload"][as="'+bn(c)+'"][href="'+bn(n)+'"]',_=p;switch(c){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":_=Ns(n)}if(!yi.has(_)&&(n=C({rel:"modulepreload",href:n},a),yi.set(_,n),o.querySelector(p)===null)){switch(c){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(o.querySelector(ol(_)))return}c=o.createElement("link"),Cn(c,"link",n),ie(c),o.head.appendChild(c)}}}function BE(n,a,o){ga.S(n,a,o);var c=Cs;if(c&&n){var p=se(c).hoistableStyles,_=Ds(n);a=a||"default";var w=p.get(_);if(!w){var L={loading:0,preload:null};if(w=c.querySelector(sl(_)))L.loading=5;else{n=C({rel:"stylesheet",href:n,"data-precedence":a},o),(o=yi.get(_))&&qd(n,o);var B=w=c.createElement("link");ie(B),Cn(B,"link",n),B._p=new Promise(function(j,pe){B.onload=j,B.onerror=pe}),B.addEventListener("load",function(){L.loading|=1}),B.addEventListener("error",function(){L.loading|=2}),L.loading|=4,zc(w,a,c)}w={type:"stylesheet",instance:w,count:1,state:L},p.set(_,w)}}}function zE(n,a){ga.X(n,a);var o=Cs;if(o&&n){var c=se(o).hoistableScripts,p=Ns(n),_=c.get(p);_||(_=o.querySelector(ol(p)),_||(n=C({src:n,async:!0},a),(a=yi.get(p))&&Yd(n,a),_=o.createElement("script"),ie(_),Cn(_,"link",n),o.head.appendChild(_)),_={type:"script",instance:_,count:1,state:null},c.set(p,_))}}function kE(n,a){ga.M(n,a);var o=Cs;if(o&&n){var c=se(o).hoistableScripts,p=Ns(n),_=c.get(p);_||(_=o.querySelector(ol(p)),_||(n=C({src:n,async:!0,type:"module"},a),(a=yi.get(p))&&Yd(n,a),_=o.createElement("script"),ie(_),Cn(_,"link",n),o.head.appendChild(_)),_={type:"script",instance:_,count:1,state:null},c.set(p,_))}}function y0(n,a,o,c){var p=(p=it.current)?Bc(p):null;if(!p)throw Error(i(446));switch(n){case"meta":case"title":return null;case"style":return typeof o.precedence=="string"&&typeof o.href=="string"?(a=Ds(o.href),o=se(p).hoistableStyles,c=o.get(a),c||(c={type:"style",instance:null,count:0,state:null},o.set(a,c)),c):{type:"void",instance:null,count:0,state:null};case"link":if(o.rel==="stylesheet"&&typeof o.href=="string"&&typeof o.precedence=="string"){n=Ds(o.href);var _=se(p).hoistableStyles,w=_.get(n);if(w||(p=p.ownerDocument||p,w={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},_.set(n,w),(_=p.querySelector(sl(n)))&&!_._p&&(w.instance=_,w.state.loading=5),yi.has(n)||(o={rel:"preload",as:"style",href:o.href,crossOrigin:o.crossOrigin,integrity:o.integrity,media:o.media,hrefLang:o.hrefLang,referrerPolicy:o.referrerPolicy},yi.set(n,o),_||HE(p,n,o,w.state))),a&&c===null)throw Error(i(528,""));return w}if(a&&c!==null)throw Error(i(529,""));return null;case"script":return a=o.async,o=o.src,typeof o=="string"&&a&&typeof a!="function"&&typeof a!="symbol"?(a=Ns(o),o=se(p).hoistableScripts,c=o.get(a),c||(c={type:"script",instance:null,count:0,state:null},o.set(a,c)),c):{type:"void",instance:null,count:0,state:null};default:throw Error(i(444,n))}}function Ds(n){return'href="'+bn(n)+'"'}function sl(n){return'link[rel="stylesheet"]['+n+"]"}function b0(n){return C({},n,{"data-precedence":n.precedence,precedence:null})}function HE(n,a,o,c){n.querySelector('link[rel="preload"][as="style"]['+a+"]")?c.loading=1:(a=n.createElement("link"),c.preload=a,a.addEventListener("load",function(){return c.loading|=1}),a.addEventListener("error",function(){return c.loading|=2}),Cn(a,"link",o),ie(a),n.head.appendChild(a))}function Ns(n){return'[src="'+bn(n)+'"]'}function ol(n){return"script[async]"+n}function x0(n,a,o){if(a.count++,a.instance===null)switch(a.type){case"style":var c=n.querySelector('style[data-href~="'+bn(o.href)+'"]');if(c)return a.instance=c,ie(c),c;var p=C({},o,{"data-href":o.href,"data-precedence":o.precedence,href:null,precedence:null});return c=(n.ownerDocument||n).createElement("style"),ie(c),Cn(c,"style",p),zc(c,o.precedence,n),a.instance=c;case"stylesheet":p=Ds(o.href);var _=n.querySelector(sl(p));if(_)return a.state.loading|=4,a.instance=_,ie(_),_;c=b0(o),(p=yi.get(p))&&qd(c,p),_=(n.ownerDocument||n).createElement("link"),ie(_);var w=_;return w._p=new Promise(function(L,B){w.onload=L,w.onerror=B}),Cn(_,"link",c),a.state.loading|=4,zc(_,o.precedence,n),a.instance=_;case"script":return _=Ns(o.src),(p=n.querySelector(ol(_)))?(a.instance=p,ie(p),p):(c=o,(p=yi.get(_))&&(c=C({},o),Yd(c,p)),n=n.ownerDocument||n,p=n.createElement("script"),ie(p),Cn(p,"link",c),n.head.appendChild(p),a.instance=p);case"void":return null;default:throw Error(i(443,a.type))}else a.type==="stylesheet"&&(a.state.loading&4)===0&&(c=a.instance,a.state.loading|=4,zc(c,o.precedence,n));return a.instance}function zc(n,a,o){for(var c=o.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),p=c.length?c[c.length-1]:null,_=p,w=0;w<c.length;w++){var L=c[w];if(L.dataset.precedence===a)_=L;else if(_!==p)break}_?_.parentNode.insertBefore(n,_.nextSibling):(a=o.nodeType===9?o.head:o,a.insertBefore(n,a.firstChild))}function qd(n,a){n.crossOrigin==null&&(n.crossOrigin=a.crossOrigin),n.referrerPolicy==null&&(n.referrerPolicy=a.referrerPolicy),n.title==null&&(n.title=a.title)}function Yd(n,a){n.crossOrigin==null&&(n.crossOrigin=a.crossOrigin),n.referrerPolicy==null&&(n.referrerPolicy=a.referrerPolicy),n.integrity==null&&(n.integrity=a.integrity)}var kc=null;function E0(n,a,o){if(kc===null){var c=new Map,p=kc=new Map;p.set(o,c)}else p=kc,c=p.get(o),c||(c=new Map,p.set(o,c));if(c.has(n))return c;for(c.set(n,null),o=o.getElementsByTagName(n),p=0;p<o.length;p++){var _=o[p];if(!(_[gr]||_[hn]||n==="link"&&_.getAttribute("rel")==="stylesheet")&&_.namespaceURI!=="http://www.w3.org/2000/svg"){var w=_.getAttribute(a)||"";w=n+w;var L=c.get(w);L?L.push(_):c.set(w,[_])}}return c}function M0(n,a,o){n=n.ownerDocument||n,n.head.insertBefore(o,a==="title"?n.querySelector("head > title"):null)}function VE(n,a,o){if(o===1||a.itemProp!=null)return!1;switch(n){case"meta":case"title":return!0;case"style":if(typeof a.precedence!="string"||typeof a.href!="string"||a.href==="")break;return!0;case"link":if(typeof a.rel!="string"||typeof a.href!="string"||a.href===""||a.onLoad||a.onError)break;switch(a.rel){case"stylesheet":return n=a.disabled,typeof a.precedence=="string"&&n==null;default:return!0}case"script":if(a.async&&typeof a.async!="function"&&typeof a.async!="symbol"&&!a.onLoad&&!a.onError&&a.src&&typeof a.src=="string")return!0}return!1}function S0(n){return!(n.type==="stylesheet"&&(n.state.loading&3)===0)}var ll=null;function GE(){}function WE(n,a,o){if(ll===null)throw Error(i(475));var c=ll;if(a.type==="stylesheet"&&(typeof o.media!="string"||matchMedia(o.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var p=Ds(o.href),_=n.querySelector(sl(p));if(_){n=_._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(c.count++,c=Hc.bind(c),n.then(c,c)),a.state.loading|=4,a.instance=_,ie(_);return}_=n.ownerDocument||n,o=b0(o),(p=yi.get(p))&&qd(o,p),_=_.createElement("link"),ie(_);var w=_;w._p=new Promise(function(L,B){w.onload=L,w.onerror=B}),Cn(_,"link",o),a.instance=_}c.stylesheets===null&&(c.stylesheets=new Map),c.stylesheets.set(a,n),(n=a.state.preload)&&(a.state.loading&3)===0&&(c.count++,a=Hc.bind(c),n.addEventListener("load",a),n.addEventListener("error",a))}}function XE(){if(ll===null)throw Error(i(475));var n=ll;return n.stylesheets&&n.count===0&&jd(n,n.stylesheets),0<n.count?function(a){var o=setTimeout(function(){if(n.stylesheets&&jd(n,n.stylesheets),n.unsuspend){var c=n.unsuspend;n.unsuspend=null,c()}},6e4);return n.unsuspend=a,function(){n.unsuspend=null,clearTimeout(o)}}:null}function Hc(){if(this.count--,this.count===0){if(this.stylesheets)jd(this,this.stylesheets);else if(this.unsuspend){var n=this.unsuspend;this.unsuspend=null,n()}}}var Vc=null;function jd(n,a){n.stylesheets=null,n.unsuspend!==null&&(n.count++,Vc=new Map,a.forEach(qE,n),Vc=null,Hc.call(n))}function qE(n,a){if(!(a.state.loading&4)){var o=Vc.get(n);if(o)var c=o.get(null);else{o=new Map,Vc.set(n,o);for(var p=n.querySelectorAll("link[data-precedence],style[data-precedence]"),_=0;_<p.length;_++){var w=p[_];(w.nodeName==="LINK"||w.getAttribute("media")!=="not all")&&(o.set(w.dataset.precedence,w),c=w)}c&&o.set(null,c)}p=a.instance,w=p.getAttribute("data-precedence"),_=o.get(w)||c,_===c&&o.set(null,p),o.set(w,p),this.count++,c=Hc.bind(this),p.addEventListener("load",c),p.addEventListener("error",c),_?_.parentNode.insertBefore(p,_.nextSibling):(n=n.nodeType===9?n.head:n,n.insertBefore(p,n.firstChild)),a.state.loading|=4}}var cl={$$typeof:b,Provider:null,Consumer:null,_currentValue:me,_currentValue2:me,_threadCount:0};function YE(n,a,o,c,p,_,w,L){this.tag=1,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=In(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.finishedLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=In(0),this.hiddenUpdates=In(null),this.identifierPrefix=c,this.onUncaughtError=p,this.onCaughtError=_,this.onRecoverableError=w,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=L,this.incompleteTransitions=new Map}function w0(n,a,o,c,p,_,w,L,B,j,pe,Ee){return n=new YE(n,a,o,w,L,B,j,Ee),a=1,_===!0&&(a|=24),_=_i(3,null,null,a),n.current=_,_.stateNode=n,a=Tf(),a.refCount++,n.pooledCache=a,a.refCount++,_.memoizedState={element:c,isDehydrated:o,cache:a},sd(_),n}function T0(n){return n?(n=cs,n):cs}function A0(n,a,o,c,p,_){p=T0(p),c.context===null?c.context=p:c.pendingContext=p,c=Va(a),c.payload={element:o},_=_===void 0?null:_,_!==null&&(c.callback=_),o=Ga(n,c,a),o!==null&&(Hn(o,n,a),qo(o,n,a))}function R0(n,a){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var o=n.retryLane;n.retryLane=o!==0&&o<a?o:a}}function Kd(n,a){R0(n,a),(n=n.alternate)&&R0(n,a)}function C0(n){if(n.tag===13){var a=Oa(n,67108864);a!==null&&Hn(a,n,67108864),Kd(n,67108864)}}var Gc=!0;function jE(n,a,o,c){var p=R.T;R.T=null;var _=Q.p;try{Q.p=2,Zd(n,a,o,c)}finally{Q.p=_,R.T=p}}function KE(n,a,o,c){var p=R.T;R.T=null;var _=Q.p;try{Q.p=8,Zd(n,a,o,c)}finally{Q.p=_,R.T=p}}function Zd(n,a,o,c){if(Gc){var p=$d(c);if(p===null)Bd(n,a,c,Wc,o),N0(n,c);else if($E(p,n,a,o,c))c.stopPropagation();else if(N0(n,c),a&4&&-1<ZE.indexOf(n)){for(;p!==null;){var _=U(p);if(_!==null)switch(_.tag){case 3:if(_=_.stateNode,_.current.memoizedState.isDehydrated){var w=Pe(_.pendingLanes);if(w!==0){var L=_;for(L.pendingLanes|=2,L.entangledLanes|=2;w;){var B=1<<31-Qe(w);L.entanglements[1]|=B,w&=~B}Xi(_),(Jt&6)===0&&(Ac=fe()+500,il(0))}}break;case 13:L=Oa(_,2),L!==null&&Hn(L,_,2),Dc(),Kd(_,2)}if(_=$d(c),_===null&&Bd(n,a,c,Wc,o),_===p)break;p=_}p!==null&&c.stopPropagation()}else Bd(n,a,c,null,o)}}function $d(n){return n=nf(n),Qd(n)}var Wc=null;function Qd(n){if(Wc=null,n=ta(n),n!==null){var a=Y(n);if(a===null)n=null;else{var o=a.tag;if(o===13){if(n=ye(a),n!==null)return n;n=null}else if(o===3){if(a.stateNode.current.memoizedState.isDehydrated)return a.tag===3?a.stateNode.containerInfo:null;n=null}else a!==n&&(n=null)}}return Wc=n,null}function D0(n){switch(n){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(be()){case ge:return 2;case qe:return 8;case Ue:case Ve:return 32;case Et:return 268435456;default:return 32}default:return 32}}var Jd=!1,Za=null,$a=null,Qa=null,ul=new Map,fl=new Map,Ja=[],ZE="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function N0(n,a){switch(n){case"focusin":case"focusout":Za=null;break;case"dragenter":case"dragleave":$a=null;break;case"mouseover":case"mouseout":Qa=null;break;case"pointerover":case"pointerout":ul.delete(a.pointerId);break;case"gotpointercapture":case"lostpointercapture":fl.delete(a.pointerId)}}function dl(n,a,o,c,p,_){return n===null||n.nativeEvent!==_?(n={blockedOn:a,domEventName:o,eventSystemFlags:c,nativeEvent:_,targetContainers:[p]},a!==null&&(a=U(a),a!==null&&C0(a)),n):(n.eventSystemFlags|=c,a=n.targetContainers,p!==null&&a.indexOf(p)===-1&&a.push(p),n)}function $E(n,a,o,c,p){switch(a){case"focusin":return Za=dl(Za,n,a,o,c,p),!0;case"dragenter":return $a=dl($a,n,a,o,c,p),!0;case"mouseover":return Qa=dl(Qa,n,a,o,c,p),!0;case"pointerover":var _=p.pointerId;return ul.set(_,dl(ul.get(_)||null,n,a,o,c,p)),!0;case"gotpointercapture":return _=p.pointerId,fl.set(_,dl(fl.get(_)||null,n,a,o,c,p)),!0}return!1}function L0(n){var a=ta(n.target);if(a!==null){var o=Y(a);if(o!==null){if(a=o.tag,a===13){if(a=ye(o),a!==null){n.blockedOn=a,Xl(n.priority,function(){if(o.tag===13){var c=si(),p=Oa(o,c);p!==null&&Hn(p,o,c),Kd(o,c)}});return}}else if(a===3&&o.stateNode.current.memoizedState.isDehydrated){n.blockedOn=o.tag===3?o.stateNode.containerInfo:null;return}}}n.blockedOn=null}function Xc(n){if(n.blockedOn!==null)return!1;for(var a=n.targetContainers;0<a.length;){var o=$d(n.nativeEvent);if(o===null){o=n.nativeEvent;var c=new o.constructor(o.type,o);tf=c,o.target.dispatchEvent(c),tf=null}else return a=U(o),a!==null&&C0(a),n.blockedOn=o,!1;a.shift()}return!0}function U0(n,a,o){Xc(n)&&o.delete(a)}function QE(){Jd=!1,Za!==null&&Xc(Za)&&(Za=null),$a!==null&&Xc($a)&&($a=null),Qa!==null&&Xc(Qa)&&(Qa=null),ul.forEach(U0),fl.forEach(U0)}function qc(n,a){n.blockedOn===a&&(n.blockedOn=null,Jd||(Jd=!0,r.unstable_scheduleCallback(r.unstable_NormalPriority,QE)))}var Yc=null;function P0(n){Yc!==n&&(Yc=n,r.unstable_scheduleCallback(r.unstable_NormalPriority,function(){Yc===n&&(Yc=null);for(var a=0;a<n.length;a+=3){var o=n[a],c=n[a+1],p=n[a+2];if(typeof c!="function"){if(Qd(c||o)===null)continue;break}var _=U(o);_!==null&&(n.splice(a,3),a-=3,Vf(_,{pending:!0,data:p,method:o.method,action:c},c,p))}}))}function hl(n){function a(B){return qc(B,n)}Za!==null&&qc(Za,n),$a!==null&&qc($a,n),Qa!==null&&qc(Qa,n),ul.forEach(a),fl.forEach(a);for(var o=0;o<Ja.length;o++){var c=Ja[o];c.blockedOn===n&&(c.blockedOn=null)}for(;0<Ja.length&&(o=Ja[0],o.blockedOn===null);)L0(o),o.blockedOn===null&&Ja.shift();if(o=(n.ownerDocument||n).$$reactFormReplay,o!=null)for(c=0;c<o.length;c+=3){var p=o[c],_=o[c+1],w=p[pn]||null;if(typeof _=="function")w||P0(o);else if(w){var L=null;if(_&&_.hasAttribute("formAction")){if(p=_,w=_[pn]||null)L=w.formAction;else if(Qd(p)!==null)continue}else L=w.action;typeof L=="function"?o[c+1]=L:(o.splice(c,3),c-=3),P0(o)}}}function eh(n){this._internalRoot=n}jc.prototype.render=eh.prototype.render=function(n){var a=this._internalRoot;if(a===null)throw Error(i(409));var o=a.current,c=si();A0(o,c,n,a,null,null)},jc.prototype.unmount=eh.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var a=n.containerInfo;n.tag===0&&Ts(),A0(n.current,2,null,n,null,null),Dc(),a[ea]=null}};function jc(n){this._internalRoot=n}jc.prototype.unstable_scheduleHydration=function(n){if(n){var a=xo();n={blockedOn:null,target:n,priority:a};for(var o=0;o<Ja.length&&a!==0&&a<Ja[o].priority;o++);Ja.splice(o,0,n),o===0&&L0(n)}};var O0=e.version;if(O0!=="19.0.0")throw Error(i(527,O0,"19.0.0"));Q.findDOMNode=function(n){var a=n._reactInternals;if(a===void 0)throw typeof n.render=="function"?Error(i(188)):(n=Object.keys(n).join(","),Error(i(268,n)));return n=re(a),n=n!==null?Se(n):null,n=n===null?null:n.stateNode,n};var JE={bundleType:0,version:"19.0.0",rendererPackageName:"react-dom",currentDispatcherRef:R,findFiberByHostInstance:ta,reconcilerVersion:"19.0.0"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Kc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Kc.isDisabled&&Kc.supportsFiber)try{et=Kc.inject(JE),Ye=Kc}catch{}}return pl.createRoot=function(n,a){if(!s(n))throw Error(i(299));var o=!1,c="",p=Qg,_=Jg,w=e_,L=null;return a!=null&&(a.unstable_strictMode===!0&&(o=!0),a.identifierPrefix!==void 0&&(c=a.identifierPrefix),a.onUncaughtError!==void 0&&(p=a.onUncaughtError),a.onCaughtError!==void 0&&(_=a.onCaughtError),a.onRecoverableError!==void 0&&(w=a.onRecoverableError),a.unstable_transitionCallbacks!==void 0&&(L=a.unstable_transitionCallbacks)),a=w0(n,1,!1,null,null,o,c,p,_,w,L,null),n[ea]=a.current,Fd(n.nodeType===8?n.parentNode:n),new eh(a)},pl.hydrateRoot=function(n,a,o){if(!s(n))throw Error(i(299));var c=!1,p="",_=Qg,w=Jg,L=e_,B=null,j=null;return o!=null&&(o.unstable_strictMode===!0&&(c=!0),o.identifierPrefix!==void 0&&(p=o.identifierPrefix),o.onUncaughtError!==void 0&&(_=o.onUncaughtError),o.onCaughtError!==void 0&&(w=o.onCaughtError),o.onRecoverableError!==void 0&&(L=o.onRecoverableError),o.unstable_transitionCallbacks!==void 0&&(B=o.unstable_transitionCallbacks),o.formState!==void 0&&(j=o.formState)),a=w0(n,1,!0,a,o??null,c,p,_,w,L,B,j),a.context=T0(null),o=a.current,c=si(),p=Va(c),p.callback=null,Ga(o,p,c),a.current.lanes=c,Fn(a,c),Xi(a),n[ea]=a.current,Fd(n),new jc(a)},pl.version="19.0.0",pl}var G0;function cM(){if(G0)return nh.exports;G0=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),nh.exports=lM(),nh.exports}var uM=cM();const fM=Py(uM);var ml={},W0;function dM(){if(W0)return ml;W0=1,Object.defineProperty(ml,"__esModule",{value:!0}),ml.parse=u,ml.serialize=h;const r=/^[\u0021-\u003A\u003C\u003E-\u007E]+$/,e=/^[\u0021-\u003A\u003C-\u007E]*$/,t=/^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i,i=/^[\u0020-\u003A\u003D-\u007E]*$/,s=Object.prototype.toString,l=(()=>{const v=function(){};return v.prototype=Object.create(null),v})();function u(v,b){const E=new l,S=v.length;if(S<2)return E;const x=(b==null?void 0:b.decode)||m;let y=0;do{const T=v.indexOf("=",y);if(T===-1)break;const N=v.indexOf(";",y),A=N===-1?S:N;if(T>A){y=v.lastIndexOf(";",T-1)+1;continue}const P=f(v,y,T),F=d(v,T,P),k=v.slice(P,F);if(E[k]===void 0){let z=f(v,T+1,A),R=d(v,A,z);const C=x(v.slice(z,R));E[k]=C}y=A+1}while(y<S);return E}function f(v,b,E){do{const S=v.charCodeAt(b);if(S!==32&&S!==9)return b}while(++b<E);return E}function d(v,b,E){for(;b>E;){const S=v.charCodeAt(--b);if(S!==32&&S!==9)return b+1}return E}function h(v,b,E){const S=(E==null?void 0:E.encode)||encodeURIComponent;if(!r.test(v))throw new TypeError(`argument name is invalid: ${v}`);const x=S(b);if(!e.test(x))throw new TypeError(`argument val is invalid: ${b}`);let y=v+"="+x;if(!E)return y;if(E.maxAge!==void 0){if(!Number.isInteger(E.maxAge))throw new TypeError(`option maxAge is invalid: ${E.maxAge}`);y+="; Max-Age="+E.maxAge}if(E.domain){if(!t.test(E.domain))throw new TypeError(`option domain is invalid: ${E.domain}`);y+="; Domain="+E.domain}if(E.path){if(!i.test(E.path))throw new TypeError(`option path is invalid: ${E.path}`);y+="; Path="+E.path}if(E.expires){if(!g(E.expires)||!Number.isFinite(E.expires.valueOf()))throw new TypeError(`option expires is invalid: ${E.expires}`);y+="; Expires="+E.expires.toUTCString()}if(E.httpOnly&&(y+="; HttpOnly"),E.secure&&(y+="; Secure"),E.partitioned&&(y+="; Partitioned"),E.priority)switch(typeof E.priority=="string"?E.priority.toLowerCase():void 0){case"low":y+="; Priority=Low";break;case"medium":y+="; Priority=Medium";break;case"high":y+="; Priority=High";break;default:throw new TypeError(`option priority is invalid: ${E.priority}`)}if(E.sameSite)switch(typeof E.sameSite=="string"?E.sameSite.toLowerCase():E.sameSite){case!0:case"strict":y+="; SameSite=Strict";break;case"lax":y+="; SameSite=Lax";break;case"none":y+="; SameSite=None";break;default:throw new TypeError(`option sameSite is invalid: ${E.sameSite}`)}return y}function m(v){if(v.indexOf("%")===-1)return v;try{return decodeURIComponent(v)}catch{return v}}function g(v){return s.call(v)==="[object Date]"}return ml}dM();var X0="popstate";function hM(r={}){function e(i,s){let{pathname:l,search:u,hash:f}=i.location;return Wh("",{pathname:l,search:u,hash:f},s.state&&s.state.usr||null,s.state&&s.state.key||"default")}function t(i,s){return typeof s=="string"?s:Nl(s)}return mM(e,t,null,r)}function $t(r,e){if(r===!1||r===null||typeof r>"u")throw new Error(e)}function Fi(r,e){if(!r){typeof console<"u"&&console.warn(e);try{throw new Error(e)}catch{}}}function pM(){return Math.random().toString(36).substring(2,10)}function q0(r,e){return{usr:r.state,key:r.key,idx:e}}function Wh(r,e,t=null,i){return{pathname:typeof r=="string"?r:r.pathname,search:"",hash:"",...typeof e=="string"?fo(e):e,state:t,key:e&&e.key||i||pM()}}function Nl({pathname:r="/",search:e="",hash:t=""}){return e&&e!=="?"&&(r+=e.charAt(0)==="?"?e:"?"+e),t&&t!=="#"&&(r+=t.charAt(0)==="#"?t:"#"+t),r}function fo(r){let e={};if(r){let t=r.indexOf("#");t>=0&&(e.hash=r.substring(t),r=r.substring(0,t));let i=r.indexOf("?");i>=0&&(e.search=r.substring(i),r=r.substring(0,i)),r&&(e.pathname=r)}return e}function mM(r,e,t,i={}){let{window:s=document.defaultView,v5Compat:l=!1}=i,u=s.history,f="POP",d=null,h=m();h==null&&(h=0,u.replaceState({...u.state,idx:h},""));function m(){return(u.state||{idx:null}).idx}function g(){f="POP";let x=m(),y=x==null?null:x-h;h=x,d&&d({action:f,location:S.location,delta:y})}function v(x,y){f="PUSH";let T=Wh(S.location,x,y);h=m()+1;let N=q0(T,h),A=S.createHref(T);try{u.pushState(N,"",A)}catch(P){if(P instanceof DOMException&&P.name==="DataCloneError")throw P;s.location.assign(A)}l&&d&&d({action:f,location:S.location,delta:1})}function b(x,y){f="REPLACE";let T=Wh(S.location,x,y);h=m();let N=q0(T,h),A=S.createHref(T);u.replaceState(N,"",A),l&&d&&d({action:f,location:S.location,delta:0})}function E(x){return gM(x)}let S={get action(){return f},get location(){return r(s,u)},listen(x){if(d)throw new Error("A history only accepts one active listener");return s.addEventListener(X0,g),d=x,()=>{s.removeEventListener(X0,g),d=null}},createHref(x){return e(s,x)},createURL:E,encodeLocation(x){let y=E(x);return{pathname:y.pathname,search:y.search,hash:y.hash}},push:v,replace:b,go(x){return u.go(x)}};return S}function gM(r,e=!1){let t="http://localhost";typeof window<"u"&&(t=window.location.origin!=="null"?window.location.origin:window.location.href),$t(t,"No window.location.(origin|href) available to create URL");let i=typeof r=="string"?r:Nl(r);return i=i.replace(/ $/,"%20"),!e&&i.startsWith("//")&&(i=t+i),new URL(i,t)}function Oy(r,e,t="/"){return _M(r,e,t,!1)}function _M(r,e,t,i){let s=typeof e=="string"?fo(e):e,l=Da(s.pathname||"/",t);if(l==null)return null;let u=Iy(r);vM(u);let f=null;for(let d=0;f==null&&d<u.length;++d){let h=CM(l);f=AM(u[d],h,i)}return f}function Iy(r,e=[],t=[],i=""){let s=(l,u,f)=>{let d={relativePath:f===void 0?l.path||"":f,caseSensitive:l.caseSensitive===!0,childrenIndex:u,route:l};d.relativePath.startsWith("/")&&($t(d.relativePath.startsWith(i),`Absolute route path "${d.relativePath}" nested under path "${i}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`),d.relativePath=d.relativePath.slice(i.length));let h=Ra([i,d.relativePath]),m=t.concat(d);l.children&&l.children.length>0&&($t(l.index!==!0,`Index routes must not have child routes. Please remove all child routes from route path "${h}".`),Iy(l.children,e,m,h)),!(l.path==null&&!l.index)&&e.push({path:h,score:wM(h,l.index),routesMeta:m})};return r.forEach((l,u)=>{var f;if(l.path===""||!((f=l.path)!=null&&f.includes("?")))s(l,u);else for(let d of Fy(l.path))s(l,u,d)}),e}function Fy(r){let e=r.split("/");if(e.length===0)return[];let[t,...i]=e,s=t.endsWith("?"),l=t.replace(/\?$/,"");if(i.length===0)return s?[l,""]:[l];let u=Fy(i.join("/")),f=[];return f.push(...u.map(d=>d===""?l:[l,d].join("/"))),s&&f.push(...u),f.map(d=>r.startsWith("/")&&d===""?"/":d)}function vM(r){r.sort((e,t)=>e.score!==t.score?t.score-e.score:TM(e.routesMeta.map(i=>i.childrenIndex),t.routesMeta.map(i=>i.childrenIndex)))}var yM=/^:[\w-]+$/,bM=3,xM=2,EM=1,MM=10,SM=-2,Y0=r=>r==="*";function wM(r,e){let t=r.split("/"),i=t.length;return t.some(Y0)&&(i+=SM),e&&(i+=xM),t.filter(s=>!Y0(s)).reduce((s,l)=>s+(yM.test(l)?bM:l===""?EM:MM),i)}function TM(r,e){return r.length===e.length&&r.slice(0,-1).every((i,s)=>i===e[s])?r[r.length-1]-e[e.length-1]:0}function AM(r,e,t=!1){let{routesMeta:i}=r,s={},l="/",u=[];for(let f=0;f<i.length;++f){let d=i[f],h=f===i.length-1,m=l==="/"?e:e.slice(l.length)||"/",g=Iu({path:d.relativePath,caseSensitive:d.caseSensitive,end:h},m),v=d.route;if(!g&&h&&t&&!i[i.length-1].route.index&&(g=Iu({path:d.relativePath,caseSensitive:d.caseSensitive,end:!1},m)),!g)return null;Object.assign(s,g.params),u.push({params:s,pathname:Ra([l,g.pathname]),pathnameBase:UM(Ra([l,g.pathnameBase])),route:v}),g.pathnameBase!=="/"&&(l=Ra([l,g.pathnameBase]))}return u}function Iu(r,e){typeof r=="string"&&(r={path:r,caseSensitive:!1,end:!0});let[t,i]=RM(r.path,r.caseSensitive,r.end),s=e.match(t);if(!s)return null;let l=s[0],u=l.replace(/(.)\/+$/,"$1"),f=s.slice(1);return{params:i.reduce((h,{paramName:m,isOptional:g},v)=>{if(m==="*"){let E=f[v]||"";u=l.slice(0,l.length-E.length).replace(/(.)\/+$/,"$1")}const b=f[v];return g&&!b?h[m]=void 0:h[m]=(b||"").replace(/%2F/g,"/"),h},{}),pathname:l,pathnameBase:u,pattern:r}}function RM(r,e=!1,t=!0){Fi(r==="*"||!r.endsWith("*")||r.endsWith("/*"),`Route path "${r}" will be treated as if it were "${r.replace(/\*$/,"/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${r.replace(/\*$/,"/*")}".`);let i=[],s="^"+r.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(u,f,d)=>(i.push({paramName:f,isOptional:d!=null}),d?"/?([^\\/]+)?":"/([^\\/]+)"));return r.endsWith("*")?(i.push({paramName:"*"}),s+=r==="*"||r==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):t?s+="\\/*$":r!==""&&r!=="/"&&(s+="(?:(?=\\/|$))"),[new RegExp(s,e?void 0:"i"),i]}function CM(r){try{return r.split("/").map(e=>decodeURIComponent(e).replace(/\//g,"%2F")).join("/")}catch(e){return Fi(!1,`The URL path "${r}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${e}).`),r}}function Da(r,e){if(e==="/")return r;if(!r.toLowerCase().startsWith(e.toLowerCase()))return null;let t=e.endsWith("/")?e.length-1:e.length,i=r.charAt(t);return i&&i!=="/"?null:r.slice(t)||"/"}function DM(r,e="/"){let{pathname:t,search:i="",hash:s=""}=typeof r=="string"?fo(r):r;return{pathname:t?t.startsWith("/")?t:NM(t,e):e,search:PM(i),hash:OM(s)}}function NM(r,e){let t=e.replace(/\/+$/,"").split("/");return r.split("/").forEach(s=>{s===".."?t.length>1&&t.pop():s!=="."&&t.push(s)}),t.length>1?t.join("/"):"/"}function sh(r,e,t,i){return`Cannot include a '${r}' character in a manually specified \`to.${e}\` field [${JSON.stringify(i)}].  Please separate it out to the \`to.${t}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`}function LM(r){return r.filter((e,t)=>t===0||e.route.path&&e.route.path.length>0)}function kp(r){let e=LM(r);return e.map((t,i)=>i===e.length-1?t.pathname:t.pathnameBase)}function Hp(r,e,t,i=!1){let s;typeof r=="string"?s=fo(r):(s={...r},$t(!s.pathname||!s.pathname.includes("?"),sh("?","pathname","search",s)),$t(!s.pathname||!s.pathname.includes("#"),sh("#","pathname","hash",s)),$t(!s.search||!s.search.includes("#"),sh("#","search","hash",s)));let l=r===""||s.pathname==="",u=l?"/":s.pathname,f;if(u==null)f=t;else{let g=e.length-1;if(!i&&u.startsWith("..")){let v=u.split("/");for(;v[0]==="..";)v.shift(),g-=1;s.pathname=v.join("/")}f=g>=0?e[g]:"/"}let d=DM(s,f),h=u&&u!=="/"&&u.endsWith("/"),m=(l||u===".")&&t.endsWith("/");return!d.pathname.endsWith("/")&&(h||m)&&(d.pathname+="/"),d}var Ra=r=>r.join("/").replace(/\/\/+/g,"/"),UM=r=>r.replace(/\/+$/,"").replace(/^\/*/,"/"),PM=r=>!r||r==="?"?"":r.startsWith("?")?r:"?"+r,OM=r=>!r||r==="#"?"":r.startsWith("#")?r:"#"+r;function IM(r){return r!=null&&typeof r.status=="number"&&typeof r.statusText=="string"&&typeof r.internal=="boolean"&&"data"in r}var By=["POST","PUT","PATCH","DELETE"];new Set(By);var FM=["GET",...By];new Set(FM);var ho=G.createContext(null);ho.displayName="DataRouter";var Xu=G.createContext(null);Xu.displayName="DataRouterState";var zy=G.createContext({isTransitioning:!1});zy.displayName="ViewTransition";var BM=G.createContext(new Map);BM.displayName="Fetchers";var zM=G.createContext(null);zM.displayName="Await";var Bi=G.createContext(null);Bi.displayName="Navigation";var Il=G.createContext(null);Il.displayName="Location";var Zi=G.createContext({outlet:null,matches:[],isDataRoute:!1});Zi.displayName="Route";var Vp=G.createContext(null);Vp.displayName="RouteError";function kM(r,{relative:e}={}){$t(po(),"useHref() may be used only in the context of a <Router> component.");let{basename:t,navigator:i}=G.useContext(Bi),{hash:s,pathname:l,search:u}=Bl(r,{relative:e}),f=l;return t!=="/"&&(f=l==="/"?t:Ra([t,l])),i.createHref({pathname:f,search:u,hash:s})}function po(){return G.useContext(Il)!=null}function pr(){return $t(po(),"useLocation() may be used only in the context of a <Router> component."),G.useContext(Il).location}var ky="You should call navigate() in a React.useEffect(), not when your component is first rendered.";function Hy(r){G.useContext(Bi).static||G.useLayoutEffect(r)}function Fl(){let{isDataRoute:r}=G.useContext(Zi);return r?JM():HM()}function HM(){$t(po(),"useNavigate() may be used only in the context of a <Router> component.");let r=G.useContext(ho),{basename:e,navigator:t}=G.useContext(Bi),{matches:i}=G.useContext(Zi),{pathname:s}=pr(),l=JSON.stringify(kp(i)),u=G.useRef(!1);return Hy(()=>{u.current=!0}),G.useCallback((d,h={})=>{if(Fi(u.current,ky),!u.current)return;if(typeof d=="number"){t.go(d);return}let m=Hp(d,JSON.parse(l),s,h.relative==="path");r==null&&e!=="/"&&(m.pathname=m.pathname==="/"?e:Ra([e,m.pathname])),(h.replace?t.replace:t.push)(m,h.state,h)},[e,t,l,s,r])}G.createContext(null);function Bl(r,{relative:e}={}){let{matches:t}=G.useContext(Zi),{pathname:i}=pr(),s=JSON.stringify(kp(t));return G.useMemo(()=>Hp(r,JSON.parse(s),i,e==="path"),[r,s,i,e])}function VM(r,e){return Vy(r,e)}function Vy(r,e,t,i){var y;$t(po(),"useRoutes() may be used only in the context of a <Router> component.");let{navigator:s}=G.useContext(Bi),{matches:l}=G.useContext(Zi),u=l[l.length-1],f=u?u.params:{},d=u?u.pathname:"/",h=u?u.pathnameBase:"/",m=u&&u.route;{let T=m&&m.path||"";Gy(d,!m||T.endsWith("*")||T.endsWith("*?"),`You rendered descendant <Routes> (or called \`useRoutes()\`) at "${d}" (under <Route path="${T}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${T}"> to <Route path="${T==="/"?"*":`${T}/*`}">.`)}let g=pr(),v;if(e){let T=typeof e=="string"?fo(e):e;$t(h==="/"||((y=T.pathname)==null?void 0:y.startsWith(h)),`When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${h}" but pathname "${T.pathname}" was given in the \`location\` prop.`),v=T}else v=g;let b=v.pathname||"/",E=b;if(h!=="/"){let T=h.replace(/^\//,"").split("/");E="/"+b.replace(/^\//,"").split("/").slice(T.length).join("/")}let S=Oy(r,{pathname:E});Fi(m||S!=null,`No routes matched location "${v.pathname}${v.search}${v.hash}" `),Fi(S==null||S[S.length-1].route.element!==void 0||S[S.length-1].route.Component!==void 0||S[S.length-1].route.lazy!==void 0,`Matched leaf route at location "${v.pathname}${v.search}${v.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`);let x=YM(S&&S.map(T=>Object.assign({},T,{params:Object.assign({},f,T.params),pathname:Ra([h,s.encodeLocation?s.encodeLocation(T.pathname).pathname:T.pathname]),pathnameBase:T.pathnameBase==="/"?h:Ra([h,s.encodeLocation?s.encodeLocation(T.pathnameBase).pathname:T.pathnameBase])})),l,t,i);return e&&x?G.createElement(Il.Provider,{value:{location:{pathname:"/",search:"",hash:"",state:null,key:"default",...v},navigationType:"POP"}},x):x}function GM(){let r=QM(),e=IM(r)?`${r.status} ${r.statusText}`:r instanceof Error?r.message:JSON.stringify(r),t=r instanceof Error?r.stack:null,i="rgba(200,200,200, 0.5)",s={padding:"0.5rem",backgroundColor:i},l={padding:"2px 4px",backgroundColor:i},u=null;return console.error("Error handled by React Router default ErrorBoundary:",r),u=G.createElement(G.Fragment,null,G.createElement("p",null,"💿 Hey developer 👋"),G.createElement("p",null,"You can provide a way better UX than this when your app throws errors by providing your own ",G.createElement("code",{style:l},"ErrorBoundary")," or"," ",G.createElement("code",{style:l},"errorElement")," prop on your route.")),G.createElement(G.Fragment,null,G.createElement("h2",null,"Unexpected Application Error!"),G.createElement("h3",{style:{fontStyle:"italic"}},e),t?G.createElement("pre",{style:s},t):null,u)}var WM=G.createElement(GM,null),XM=class extends G.Component{constructor(r){super(r),this.state={location:r.location,revalidation:r.revalidation,error:r.error}}static getDerivedStateFromError(r){return{error:r}}static getDerivedStateFromProps(r,e){return e.location!==r.location||e.revalidation!=="idle"&&r.revalidation==="idle"?{error:r.error,location:r.location,revalidation:r.revalidation}:{error:r.error!==void 0?r.error:e.error,location:e.location,revalidation:r.revalidation||e.revalidation}}componentDidCatch(r,e){console.error("React Router caught the following error during render",r,e)}render(){return this.state.error!==void 0?G.createElement(Zi.Provider,{value:this.props.routeContext},G.createElement(Vp.Provider,{value:this.state.error,children:this.props.component})):this.props.children}};function qM({routeContext:r,match:e,children:t}){let i=G.useContext(ho);return i&&i.static&&i.staticContext&&(e.route.errorElement||e.route.ErrorBoundary)&&(i.staticContext._deepestRenderedBoundaryId=e.route.id),G.createElement(Zi.Provider,{value:r},t)}function YM(r,e=[],t=null,i=null){if(r==null){if(!t)return null;if(t.errors)r=t.matches;else if(e.length===0&&!t.initialized&&t.matches.length>0)r=t.matches;else return null}let s=r,l=t==null?void 0:t.errors;if(l!=null){let d=s.findIndex(h=>h.route.id&&(l==null?void 0:l[h.route.id])!==void 0);$t(d>=0,`Could not find a matching route for errors on route IDs: ${Object.keys(l).join(",")}`),s=s.slice(0,Math.min(s.length,d+1))}let u=!1,f=-1;if(t)for(let d=0;d<s.length;d++){let h=s[d];if((h.route.HydrateFallback||h.route.hydrateFallbackElement)&&(f=d),h.route.id){let{loaderData:m,errors:g}=t,v=h.route.loader&&!m.hasOwnProperty(h.route.id)&&(!g||g[h.route.id]===void 0);if(h.route.lazy||v){u=!0,f>=0?s=s.slice(0,f+1):s=[s[0]];break}}}return s.reduceRight((d,h,m)=>{let g,v=!1,b=null,E=null;t&&(g=l&&h.route.id?l[h.route.id]:void 0,b=h.route.errorElement||WM,u&&(f<0&&m===0?(Gy("route-fallback",!1,"No `HydrateFallback` element provided to render during initial hydration"),v=!0,E=null):f===m&&(v=!0,E=h.route.hydrateFallbackElement||null)));let S=e.concat(s.slice(0,m+1)),x=()=>{let y;return g?y=b:v?y=E:h.route.Component?y=G.createElement(h.route.Component,null):h.route.element?y=h.route.element:y=d,G.createElement(qM,{match:h,routeContext:{outlet:d,matches:S,isDataRoute:t!=null},children:y})};return t&&(h.route.ErrorBoundary||h.route.errorElement||m===0)?G.createElement(XM,{location:t.location,revalidation:t.revalidation,component:b,error:g,children:x(),routeContext:{outlet:null,matches:S,isDataRoute:!0}}):x()},null)}function Gp(r){return`${r} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function jM(r){let e=G.useContext(ho);return $t(e,Gp(r)),e}function KM(r){let e=G.useContext(Xu);return $t(e,Gp(r)),e}function ZM(r){let e=G.useContext(Zi);return $t(e,Gp(r)),e}function Wp(r){let e=ZM(r),t=e.matches[e.matches.length-1];return $t(t.route.id,`${r} can only be used on routes that contain a unique "id"`),t.route.id}function $M(){return Wp("useRouteId")}function QM(){var i;let r=G.useContext(Vp),e=KM("useRouteError"),t=Wp("useRouteError");return r!==void 0?r:(i=e.errors)==null?void 0:i[t]}function JM(){let{router:r}=jM("useNavigate"),e=Wp("useNavigate"),t=G.useRef(!1);return Hy(()=>{t.current=!0}),G.useCallback(async(s,l={})=>{Fi(t.current,ky),t.current&&(typeof s=="number"?r.navigate(s):await r.navigate(s,{fromRouteId:e,...l}))},[r,e])}var j0={};function Gy(r,e,t){!e&&!j0[r]&&(j0[r]=!0,Fi(!1,t))}G.memo(eS);function eS({routes:r,future:e,state:t}){return Vy(r,void 0,t,e)}function Wy({to:r,replace:e,state:t,relative:i}){$t(po(),"<Navigate> may be used only in the context of a <Router> component.");let{static:s}=G.useContext(Bi);Fi(!s,"<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change.");let{matches:l}=G.useContext(Zi),{pathname:u}=pr(),f=Fl(),d=Hp(r,kp(l),u,i==="path"),h=JSON.stringify(d);return G.useEffect(()=>{f(JSON.parse(h),{replace:e,state:t,relative:i})},[f,h,i,e,t]),null}function js(r){$t(!1,"A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.")}function tS({basename:r="/",children:e=null,location:t,navigationType:i="POP",navigator:s,static:l=!1}){$t(!po(),"You cannot render a <Router> inside another <Router>. You should never have more than one in your app.");let u=r.replace(/^\/*/,"/"),f=G.useMemo(()=>({basename:u,navigator:s,static:l,future:{}}),[u,s,l]);typeof t=="string"&&(t=fo(t));let{pathname:d="/",search:h="",hash:m="",state:g=null,key:v="default"}=t,b=G.useMemo(()=>{let E=Da(d,u);return E==null?null:{location:{pathname:E,search:h,hash:m,state:g,key:v},navigationType:i}},[u,d,h,m,g,v,i]);return Fi(b!=null,`<Router basename="${u}"> is not able to match the URL "${d}${h}${m}" because it does not start with the basename, so the <Router> won't render anything.`),b==null?null:G.createElement(Bi.Provider,{value:f},G.createElement(Il.Provider,{children:e,value:b}))}function nS({children:r,location:e}){return VM(Xh(r),e)}function Xh(r,e=[]){let t=[];return G.Children.forEach(r,(i,s)=>{if(!G.isValidElement(i))return;let l=[...e,s];if(i.type===G.Fragment){t.push.apply(t,Xh(i.props.children,l));return}$t(i.type===js,`[${typeof i.type=="string"?i.type:i.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`),$t(!i.props.index||!i.props.children,"An index route cannot have child routes.");let u={id:i.props.id||l.join("-"),caseSensitive:i.props.caseSensitive,element:i.props.element,Component:i.props.Component,index:i.props.index,path:i.props.path,loader:i.props.loader,action:i.props.action,hydrateFallbackElement:i.props.hydrateFallbackElement,HydrateFallback:i.props.HydrateFallback,errorElement:i.props.errorElement,ErrorBoundary:i.props.ErrorBoundary,hasErrorBoundary:i.props.hasErrorBoundary===!0||i.props.ErrorBoundary!=null||i.props.errorElement!=null,shouldRevalidate:i.props.shouldRevalidate,handle:i.props.handle,lazy:i.props.lazy};i.props.children&&(u.children=Xh(i.props.children,l)),t.push(u)}),t}var Au="get",Ru="application/x-www-form-urlencoded";function qu(r){return r!=null&&typeof r.tagName=="string"}function iS(r){return qu(r)&&r.tagName.toLowerCase()==="button"}function aS(r){return qu(r)&&r.tagName.toLowerCase()==="form"}function rS(r){return qu(r)&&r.tagName.toLowerCase()==="input"}function sS(r){return!!(r.metaKey||r.altKey||r.ctrlKey||r.shiftKey)}function oS(r,e){return r.button===0&&(!e||e==="_self")&&!sS(r)}var Zc=null;function lS(){if(Zc===null)try{new FormData(document.createElement("form"),0),Zc=!1}catch{Zc=!0}return Zc}var cS=new Set(["application/x-www-form-urlencoded","multipart/form-data","text/plain"]);function oh(r){return r!=null&&!cS.has(r)?(Fi(!1,`"${r}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${Ru}"`),null):r}function uS(r,e){let t,i,s,l,u;if(aS(r)){let f=r.getAttribute("action");i=f?Da(f,e):null,t=r.getAttribute("method")||Au,s=oh(r.getAttribute("enctype"))||Ru,l=new FormData(r)}else if(iS(r)||rS(r)&&(r.type==="submit"||r.type==="image")){let f=r.form;if(f==null)throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');let d=r.getAttribute("formaction")||f.getAttribute("action");if(i=d?Da(d,e):null,t=r.getAttribute("formmethod")||f.getAttribute("method")||Au,s=oh(r.getAttribute("formenctype"))||oh(f.getAttribute("enctype"))||Ru,l=new FormData(f,r),!lS()){let{name:h,type:m,value:g}=r;if(m==="image"){let v=h?`${h}.`:"";l.append(`${v}x`,"0"),l.append(`${v}y`,"0")}else h&&l.append(h,g)}}else{if(qu(r))throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');t=Au,i=null,s=Ru,u=r}return l&&s==="text/plain"&&(u=l,l=void 0),{action:i,method:t.toLowerCase(),encType:s,formData:l,body:u}}function Xp(r,e){if(r===!1||r===null||typeof r>"u")throw new Error(e)}async function fS(r,e){if(r.id in e)return e[r.id];try{let t=await import(r.module);return e[r.id]=t,t}catch(t){return console.error(`Error loading route module \`${r.module}\`, reloading page...`),console.error(t),window.__reactRouterContext&&window.__reactRouterContext.isSpaMode,window.location.reload(),new Promise(()=>{})}}function dS(r){return r==null?!1:r.href==null?r.rel==="preload"&&typeof r.imageSrcSet=="string"&&typeof r.imageSizes=="string":typeof r.rel=="string"&&typeof r.href=="string"}async function hS(r,e,t){let i=await Promise.all(r.map(async s=>{let l=e.routes[s.route.id];if(l){let u=await fS(l,t);return u.links?u.links():[]}return[]}));return _S(i.flat(1).filter(dS).filter(s=>s.rel==="stylesheet"||s.rel==="preload").map(s=>s.rel==="stylesheet"?{...s,rel:"prefetch",as:"style"}:{...s,rel:"prefetch"}))}function K0(r,e,t,i,s,l){let u=(d,h)=>t[h]?d.route.id!==t[h].route.id:!0,f=(d,h)=>{var m;return t[h].pathname!==d.pathname||((m=t[h].route.path)==null?void 0:m.endsWith("*"))&&t[h].params["*"]!==d.params["*"]};return l==="assets"?e.filter((d,h)=>u(d,h)||f(d,h)):l==="data"?e.filter((d,h)=>{var g;let m=i.routes[d.route.id];if(!m||!m.hasLoader)return!1;if(u(d,h)||f(d,h))return!0;if(d.route.shouldRevalidate){let v=d.route.shouldRevalidate({currentUrl:new URL(s.pathname+s.search+s.hash,window.origin),currentParams:((g=t[0])==null?void 0:g.params)||{},nextUrl:new URL(r,window.origin),nextParams:d.params,defaultShouldRevalidate:!0});if(typeof v=="boolean")return v}return!0}):[]}function pS(r,e,{includeHydrateFallback:t}={}){return mS(r.map(i=>{let s=e.routes[i.route.id];if(!s)return[];let l=[s.module];return s.clientActionModule&&(l=l.concat(s.clientActionModule)),s.clientLoaderModule&&(l=l.concat(s.clientLoaderModule)),t&&s.hydrateFallbackModule&&(l=l.concat(s.hydrateFallbackModule)),s.imports&&(l=l.concat(s.imports)),l}).flat(1))}function mS(r){return[...new Set(r)]}function gS(r){let e={},t=Object.keys(r).sort();for(let i of t)e[i]=r[i];return e}function _S(r,e){let t=new Set;return new Set(e),r.reduce((i,s)=>{let l=JSON.stringify(gS(s));return t.has(l)||(t.add(l),i.push({key:l,link:s})),i},[])}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");var vS=new Set([100,101,204,205]);function yS(r,e){let t=typeof r=="string"?new URL(r,typeof window>"u"?"server://singlefetch/":window.location.origin):r;return t.pathname==="/"?t.pathname="_root.data":e&&Da(t.pathname,e)==="/"?t.pathname=`${e.replace(/\/$/,"")}/_root.data`:t.pathname=`${t.pathname.replace(/\/$/,"")}.data`,t}function Xy(){let r=G.useContext(ho);return Xp(r,"You must render this element inside a <DataRouterContext.Provider> element"),r}function bS(){let r=G.useContext(Xu);return Xp(r,"You must render this element inside a <DataRouterStateContext.Provider> element"),r}var qp=G.createContext(void 0);qp.displayName="FrameworkContext";function qy(){let r=G.useContext(qp);return Xp(r,"You must render this element inside a <HydratedRouter> element"),r}function xS(r,e){let t=G.useContext(qp),[i,s]=G.useState(!1),[l,u]=G.useState(!1),{onFocus:f,onBlur:d,onMouseEnter:h,onMouseLeave:m,onTouchStart:g}=e,v=G.useRef(null);G.useEffect(()=>{if(r==="render"&&u(!0),r==="viewport"){let S=y=>{y.forEach(T=>{u(T.isIntersecting)})},x=new IntersectionObserver(S,{threshold:.5});return v.current&&x.observe(v.current),()=>{x.disconnect()}}},[r]),G.useEffect(()=>{if(i){let S=setTimeout(()=>{u(!0)},100);return()=>{clearTimeout(S)}}},[i]);let b=()=>{s(!0)},E=()=>{s(!1),u(!1)};return t?r!=="intent"?[l,v,{}]:[l,v,{onFocus:gl(f,b),onBlur:gl(d,E),onMouseEnter:gl(h,b),onMouseLeave:gl(m,E),onTouchStart:gl(g,b)}]:[!1,v,{}]}function gl(r,e){return t=>{r&&r(t),t.defaultPrevented||e(t)}}function ES({page:r,...e}){let{router:t}=Xy(),i=G.useMemo(()=>Oy(t.routes,r,t.basename),[t.routes,r,t.basename]);return i?G.createElement(SS,{page:r,matches:i,...e}):null}function MS(r){let{manifest:e,routeModules:t}=qy(),[i,s]=G.useState([]);return G.useEffect(()=>{let l=!1;return hS(r,e,t).then(u=>{l||s(u)}),()=>{l=!0}},[r,e,t]),i}function SS({page:r,matches:e,...t}){let i=pr(),{manifest:s,routeModules:l}=qy(),{basename:u}=Xy(),{loaderData:f,matches:d}=bS(),h=G.useMemo(()=>K0(r,e,d,s,i,"data"),[r,e,d,s,i]),m=G.useMemo(()=>K0(r,e,d,s,i,"assets"),[r,e,d,s,i]),g=G.useMemo(()=>{if(r===i.pathname+i.search+i.hash)return[];let E=new Set,S=!1;if(e.forEach(y=>{var N;let T=s.routes[y.route.id];!T||!T.hasLoader||(!h.some(A=>A.route.id===y.route.id)&&y.route.id in f&&((N=l[y.route.id])!=null&&N.shouldRevalidate)||T.hasClientLoader?S=!0:E.add(y.route.id))}),E.size===0)return[];let x=yS(r,u);return S&&E.size>0&&x.searchParams.set("_routes",e.filter(y=>E.has(y.route.id)).map(y=>y.route.id).join(",")),[x.pathname+x.search]},[u,f,i,s,h,e,r,l]),v=G.useMemo(()=>pS(m,s),[m,s]),b=MS(m);return G.createElement(G.Fragment,null,g.map(E=>G.createElement("link",{key:E,rel:"prefetch",as:"fetch",href:E,...t})),v.map(E=>G.createElement("link",{key:E,rel:"modulepreload",href:E,...t})),b.map(({key:E,link:S})=>G.createElement("link",{key:E,...S})))}function wS(...r){return e=>{r.forEach(t=>{typeof t=="function"?t(e):t!=null&&(t.current=e)})}}var Yy=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u";try{Yy&&(window.__reactRouterVersion="7.6.3")}catch{}function TS({basename:r,children:e,window:t}){let i=G.useRef();i.current==null&&(i.current=hM({window:t,v5Compat:!0}));let s=i.current,[l,u]=G.useState({action:s.action,location:s.location}),f=G.useCallback(d=>{G.startTransition(()=>u(d))},[u]);return G.useLayoutEffect(()=>s.listen(f),[s,f]),G.createElement(tS,{basename:r,children:e,location:l.location,navigationType:l.action,navigator:s})}var jy=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Fu=G.forwardRef(function({onClick:e,discover:t="render",prefetch:i="none",relative:s,reloadDocument:l,replace:u,state:f,target:d,to:h,preventScrollReset:m,viewTransition:g,...v},b){let{basename:E}=G.useContext(Bi),S=typeof h=="string"&&jy.test(h),x,y=!1;if(typeof h=="string"&&S&&(x=h,Yy))try{let R=new URL(window.location.href),C=h.startsWith("//")?new URL(R.protocol+h):new URL(h),H=Da(C.pathname,E);C.origin===R.origin&&H!=null?h=H+C.search+C.hash:y=!0}catch{Fi(!1,`<Link to="${h}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`)}let T=kM(h,{relative:s}),[N,A,P]=xS(i,v),F=DS(h,{replace:u,state:f,target:d,preventScrollReset:m,relative:s,viewTransition:g});function k(R){e&&e(R),R.defaultPrevented||F(R)}let z=G.createElement("a",{...v,...P,href:x||T,onClick:y||l?e:k,ref:wS(b,A),target:d,"data-discover":!S&&t==="render"?"true":void 0});return N&&!S?G.createElement(G.Fragment,null,z,G.createElement(ES,{page:T})):z});Fu.displayName="Link";var AS=G.forwardRef(function({"aria-current":e="page",caseSensitive:t=!1,className:i="",end:s=!1,style:l,to:u,viewTransition:f,children:d,...h},m){let g=Bl(u,{relative:h.relative}),v=pr(),b=G.useContext(Xu),{navigator:E,basename:S}=G.useContext(Bi),x=b!=null&&OS(g)&&f===!0,y=E.encodeLocation?E.encodeLocation(g).pathname:g.pathname,T=v.pathname,N=b&&b.navigation&&b.navigation.location?b.navigation.location.pathname:null;t||(T=T.toLowerCase(),N=N?N.toLowerCase():null,y=y.toLowerCase()),N&&S&&(N=Da(N,S)||N);const A=y!=="/"&&y.endsWith("/")?y.length-1:y.length;let P=T===y||!s&&T.startsWith(y)&&T.charAt(A)==="/",F=N!=null&&(N===y||!s&&N.startsWith(y)&&N.charAt(y.length)==="/"),k={isActive:P,isPending:F,isTransitioning:x},z=P?e:void 0,R;typeof i=="function"?R=i(k):R=[i,P?"active":null,F?"pending":null,x?"transitioning":null].filter(Boolean).join(" ");let C=typeof l=="function"?l(k):l;return G.createElement(Fu,{...h,"aria-current":z,className:R,ref:m,style:C,to:u,viewTransition:f},typeof d=="function"?d(k):d)});AS.displayName="NavLink";var RS=G.forwardRef(({discover:r="render",fetcherKey:e,navigate:t,reloadDocument:i,replace:s,state:l,method:u=Au,action:f,onSubmit:d,relative:h,preventScrollReset:m,viewTransition:g,...v},b)=>{let E=US(),S=PS(f,{relative:h}),x=u.toLowerCase()==="get"?"get":"post",y=typeof f=="string"&&jy.test(f),T=N=>{if(d&&d(N),N.defaultPrevented)return;N.preventDefault();let A=N.nativeEvent.submitter,P=(A==null?void 0:A.getAttribute("formmethod"))||u;E(A||N.currentTarget,{fetcherKey:e,method:P,navigate:t,replace:s,state:l,relative:h,preventScrollReset:m,viewTransition:g})};return G.createElement("form",{ref:b,method:x,action:S,onSubmit:i?d:T,...v,"data-discover":!y&&r==="render"?"true":void 0})});RS.displayName="Form";function CS(r){return`${r} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function Ky(r){let e=G.useContext(ho);return $t(e,CS(r)),e}function DS(r,{target:e,replace:t,state:i,preventScrollReset:s,relative:l,viewTransition:u}={}){let f=Fl(),d=pr(),h=Bl(r,{relative:l});return G.useCallback(m=>{if(oS(m,e)){m.preventDefault();let g=t!==void 0?t:Nl(d)===Nl(h);f(r,{replace:g,state:i,preventScrollReset:s,relative:l,viewTransition:u})}},[d,f,h,t,i,e,r,s,l,u])}var NS=0,LS=()=>`__${String(++NS)}__`;function US(){let{router:r}=Ky("useSubmit"),{basename:e}=G.useContext(Bi),t=$M();return G.useCallback(async(i,s={})=>{let{action:l,method:u,encType:f,formData:d,body:h}=uS(i,e);if(s.navigate===!1){let m=s.fetcherKey||LS();await r.fetch(m,t,s.action||l,{preventScrollReset:s.preventScrollReset,formData:d,body:h,formMethod:s.method||u,formEncType:s.encType||f,flushSync:s.flushSync})}else await r.navigate(s.action||l,{preventScrollReset:s.preventScrollReset,formData:d,body:h,formMethod:s.method||u,formEncType:s.encType||f,replace:s.replace,state:s.state,fromRouteId:t,flushSync:s.flushSync,viewTransition:s.viewTransition})},[r,e,t])}function PS(r,{relative:e}={}){let{basename:t}=G.useContext(Bi),i=G.useContext(Zi);$t(i,"useFormAction must be used inside a RouteContext");let[s]=i.matches.slice(-1),l={...Bl(r||".",{relative:e})},u=pr();if(r==null){l.search=u.search;let f=new URLSearchParams(l.search),d=f.getAll("index");if(d.some(m=>m==="")){f.delete("index"),d.filter(g=>g).forEach(g=>f.append("index",g));let m=f.toString();l.search=m?`?${m}`:""}}return(!r||r===".")&&s.route.index&&(l.search=l.search?l.search.replace(/^\?/,"?index&"):"?index"),t!=="/"&&(l.pathname=l.pathname==="/"?t:Ra([t,l.pathname])),Nl(l)}function OS(r,e={}){let t=G.useContext(zy);$t(t!=null,"`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?");let{basename:i}=Ky("useViewTransitionState"),s=Bl(r,{relative:e.relative});if(!t.isTransitioning)return!1;let l=Da(t.currentLocation.pathname,i)||t.currentLocation.pathname,u=Da(t.nextLocation.pathname,i)||t.nextLocation.pathname;return Iu(s.pathname,u)!=null||Iu(s.pathname,l)!=null}[...vS];const Wr=[{id:"tennis",name:"Tennis",status:"playable",path:"/play",blurb:"Swing your arm to hit the ball. One camera, one player, one gesture.",detail:"The reference game. Three.js court, ball physics and an AI opponent, driven by the SwingRecognizer seam — or by the spacebar if you would rather not use a camera.",gesture:"swing",art:"tennis"},{id:"soccer",name:"Soccer",status:"planned",blurb:"Planned. The first game that needs a gesture below the waist.",detail:"A kick is a lower-body gesture, so it exercises leg keypoints the SwingRecognizer ignores. That is the point: it forces GestureRecognizer to be genuinely plural.",gesture:"kick — not built",art:"soccer"},{id:"boxing",name:"Boxing",status:"planned",blurb:"Planned. The first game that needs both hands tracked independently.",detail:"Two gesture streams from one player, with per-arm cooldowns, rather than one dominant hand — the assumption baked into Calibration.handedness today. Also the natural first test of two players on one camera.",gesture:"punch ×2 — not built",art:"boxing"},{id:"palmworks",name:"Palmworks",status:"planned",blurb:"Planned. Build a factory with your hands.",detail:"Place pumps, boilers, tanks and heat exchangers on a grid and route the pipework between them. The scene and 29 industrial objects are already in games/palmworks — what is missing is the hands: pinch to place, point to select, pinch-drag to connect two ports.",gesture:"pinch + point — not built",art:"palmworks"}];Wr.filter(r=>r.status==="playable");const Bu="wibbly.settings.v1",Xr={usePoseDetection:!0,debug:!1},Zy=Object.keys(Xr);function Yu(){try{return typeof localStorage>"u"?null:(localStorage.setItem(`${Bu}.probe`,"1"),localStorage.removeItem(`${Bu}.probe`),localStorage)}catch{return null}}function IS(){const r=Yu();if(!r)return{...Xr};try{const e=r.getItem(Bu);if(!e)return{...Xr};const t=JSON.parse(e);if(!t||typeof t!="object")return{...Xr};const i={...Xr};for(const s of Zy)typeof t[s]==typeof Xr[s]&&(i[s]=t[s]);return i}catch{return{...Xr}}}function FS(r){const e=Yu();if(e)try{const t={};for(const i of Zy)t[i]=r[i];e.setItem(Bu,JSON.stringify(t))}catch{}}const $y="wibbly.setup.v1";function Qy(){const r=Yu();if(!r)return{seen:!1,outcome:null,at:0};try{const e=JSON.parse(r.getItem($y)||"null");return!e||typeof e!="object"?{seen:!1,outcome:null,at:0}:{seen:e.seen===!0,outcome:e.outcome==="camera"||e.outcome==="keyboard"?e.outcome:null,at:typeof e.at=="number"?e.at:0}}catch{return{seen:!1,outcome:null,at:0}}}function BS(r){const e=Yu();if(e)try{e.setItem($y,JSON.stringify({seen:!0,outcome:r,at:Date.now()}))}catch{}}const zS=({kind:r,planned:e})=>{const t=e?"var(--planned)":"var(--accent)",i="var(--text-4)";return M.createElement("svg",{viewBox:"0 0 120 80",className:"wb-card__art","aria-hidden":"true"},M.createElement("circle",{cx:"42",cy:"20",r:"7",fill:"none",stroke:i,strokeWidth:"2"}),M.createElement("path",{d:"M42 27 L42 48 M42 34 L30 42 M42 48 L34 66 M42 48 L50 66",fill:"none",stroke:i,strokeWidth:"2",strokeLinecap:"round"}),r==="tennis"&&M.createElement(M.Fragment,null,M.createElement("path",{d:"M42 34 L58 26",stroke:t,strokeWidth:"2.5",strokeLinecap:"round"}),M.createElement("ellipse",{cx:"64",cy:"23",rx:"7",ry:"9",fill:"none",stroke:t,strokeWidth:"2.5",transform:"rotate(28 64 23)"}),M.createElement("path",{d:"M74 20 Q88 12 100 22",fill:"none",stroke:t,strokeWidth:"2",strokeDasharray:"3 4",strokeLinecap:"round"}),M.createElement("circle",{cx:"102",cy:"24",r:"3.5",fill:t})),r==="soccer"&&M.createElement(M.Fragment,null,M.createElement("path",{d:"M42 48 L58 62",stroke:t,strokeWidth:"2.5",strokeLinecap:"round"}),M.createElement("path",{d:"M64 60 Q80 44 98 50",fill:"none",stroke:t,strokeWidth:"2",strokeDasharray:"3 4",strokeLinecap:"round"}),M.createElement("circle",{cx:"62",cy:"63",r:"7",fill:"none",stroke:t,strokeWidth:"2.5"}),M.createElement("path",{d:"M58 60 L66 66 M62 56 L62 70",stroke:t,strokeWidth:"1.2"})),r==="boxing"&&M.createElement(M.Fragment,null,M.createElement("path",{d:"M42 34 L60 30",stroke:t,strokeWidth:"2.5",strokeLinecap:"round"}),M.createElement("path",{d:"M42 38 L58 46",stroke:t,strokeWidth:"2.5",strokeLinecap:"round"}),M.createElement("circle",{cx:"65",cy:"29",r:"6",fill:"none",stroke:t,strokeWidth:"2.5"}),M.createElement("circle",{cx:"63",cy:"48",r:"6",fill:"none",stroke:t,strokeWidth:"2.5"}),M.createElement("path",{d:"M74 27 L92 24 M72 50 L90 53",stroke:t,strokeWidth:"2",strokeDasharray:"3 4",strokeLinecap:"round"})),r==="palmworks"&&M.createElement(M.Fragment,null,M.createElement("path",{d:"M42 34 L57 29",stroke:t,strokeWidth:"2.5",strokeLinecap:"round"}),M.createElement("path",{d:"M58 24 Q64 27 62 30",fill:"none",stroke:t,strokeWidth:"2.2",strokeLinecap:"round"}),M.createElement("path",{d:"M58 34 Q64 33 62 30",fill:"none",stroke:t,strokeWidth:"2.2",strokeLinecap:"round"}),M.createElement("path",{d:"M68 29 Q79 24 88 33",fill:"none",stroke:t,strokeWidth:"2",strokeDasharray:"3 4",strokeLinecap:"round"}),M.createElement("rect",{x:"84",y:"34",width:"16",height:"21",rx:"3",fill:"none",stroke:t,strokeWidth:"2.5"}),M.createElement("path",{d:"M84 41 L100 41",stroke:t,strokeWidth:"1.2"}),M.createElement("path",{d:"M92 55 L92 64 L106 64",fill:"none",stroke:i,strokeWidth:"2",strokeLinecap:"round"})))};function kS(){const r=Fl(),[e,t]=G.useState(0),[i]=G.useState(()=>Qy()),s=Wr[e],l=s.status==="playable",u=G.useCallback(f=>{f.status==="playable"&&r(i.seen?f.path:"/setup")},[r,i.seen]);return G.useEffect(()=>{const f=d=>{if(d.key==="ArrowRight")t(h=>(h+1)%Wr.length);else if(d.key==="ArrowLeft")t(h=>(h-1+Wr.length)%Wr.length);else if(d.key==="Enter")u(Wr[e]);else if(d.key.toLowerCase()==="s")r("/setup");else return;d.preventDefault()};return window.addEventListener("keydown",f),()=>window.removeEventListener("keydown",f)},[e,r,u]),M.createElement("div",{className:"wb-court"},M.createElement("div",{className:"wb-grain","aria-hidden":"true"}),M.createElement("div",{className:"wb-stage wb-title"},M.createElement("header",{className:"wb-title__head wb-rise",style:{"--i":0}},M.createElement("div",{className:"wb-title__mark"},M.createElement("p",{className:"wb-eyebrow"},"Camera gesture games ",M.createElement("span",{className:"wb-title__sep"},"/")," browser"," ",M.createElement("span",{className:"wb-title__sep"},"/")," no install"),M.createElement("h1",{className:"wb-wordmark"},"wibbly"),M.createElement("p",{className:"wb-tagline"},"Your camera is the controller.")),M.createElement("aside",{className:"wb-title__privacy"},M.createElement("span",{className:"wb-pill wb-pill--accent"},M.createElement("span",{className:"wb-dot"})," on-device"),M.createElement("p",null,"Tracking runs in this tab. Camera frames are never uploaded — there is no server in this build to upload them to."))),M.createElement("div",{className:"wb-title__games wb-rise",style:{"--i":1},role:"listbox","aria-label":"Games","aria-activedescendant":`game-${s.id}`},Wr.map((f,d)=>{const h=f.status!=="playable",m=d===e;return M.createElement("button",{key:f.id,id:`game-${f.id}`,type:"button",role:"option","aria-selected":m,"aria-disabled":h,className:["wb-card","wb-bracket",m?"is-selected":"",h?"is-planned":"",m?h?"is-planned":"is-live":""].join(" "),onMouseEnter:()=>t(d),onFocus:()=>t(d),onClick:()=>h?t(d):u(f)},M.createElement("span",{className:"wb-card__top"},M.createElement("span",{className:"wb-card__index wb-mono"},String(d+1).padStart(2,"0")),M.createElement("span",{className:`wb-pill ${h?"wb-pill--planned":"wb-pill--playable"}`},h?"Planned":"Playable")),M.createElement(zS,{kind:f.art,planned:h}),M.createElement("span",{className:"wb-card__name"},f.name),M.createElement("span",{className:"wb-card__blurb"},f.blurb),M.createElement("span",{className:`wb-card__gesture wb-mono ${h?"is-planned":""}`},f.gesture))})),M.createElement("section",{className:"wb-title__detail wb-rise",style:{"--i":2},"aria-live":"polite"},M.createElement("div",{className:"wb-title__detailtext"},M.createElement("p",{className:"wb-eyebrow"},"Selected"),M.createElement("h2",{className:"wb-h2"},s.name),M.createElement("p",{className:"wb-lede"},s.detail)),M.createElement("div",{className:"wb-title__actions"},l?M.createElement("button",{type:"button",className:"wb-btn wb-btn--primary",onClick:()=>u(s)},i.seen?"Play":"Set up & play"," ",M.createElement("span",{className:"wb-key"},"Enter")):M.createElement("div",{className:"wb-title__unbuilt wb-blueprint"},M.createElement("span",{className:"wb-pill wb-pill--planned"},"Not built"),M.createElement("span",null,"No code exists for this game. It is a tracked backlog item, not a release.")),M.createElement("button",{type:"button",className:"wb-btn wb-btn--ghost",onClick:()=>r("/setup")},"Camera setup ",M.createElement("span",{className:"wb-key"},"S")))),M.createElement("footer",{className:"wb-title__foot wb-rise",style:{"--i":3}},M.createElement("p",{className:"wb-note wb-note--accent"},M.createElement("strong",null,"Early build.")," Tennis is single-player against an AI, tracks one person, and knows exactly one gesture — a swing. Multi-person tracking, a second gesture and networked play are specified in ",M.createElement("code",{className:"wb-mono"},"WIBBLY.md"),", not built."),M.createElement("p",{className:"wb-note"},M.createElement("strong",null,"No camera?")," Everything is playable on the spacebar. Setup will offer you that path before it asks for permission, and again if permission is refused."),M.createElement("p",{className:"wb-title__keys wb-mono"},M.createElement("span",{className:"wb-key"},"←"),M.createElement("span",{className:"wb-key"},"→")," select",M.createElement("span",{className:"wb-title__sep"},"·"),M.createElement("span",{className:"wb-key"},"Enter")," play",M.createElement("span",{className:"wb-title__sep"},"·"),M.createElement("span",{className:"wb-key"},"S")," setup"))),M.createElement("style",null,`
        .wb-title {
          display: flex; flex-direction: column;
          gap: clamp(1.5rem, 4vh, 2.75rem);
        }

        /* The wordmark bleeds left out of the content column, so the title card
           reads as a graphic laid over the court rather than a centred header. */
        .wb-title__head {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(200px, 280px);
          align-items: end;
          gap: 2rem;
        }
        .wb-title__mark { margin-left: -0.06em; }
        .wb-title__sep { color: var(--text-4); padding: 0 .35em; }

        .wb-title__privacy {
          padding-left: 1.1rem;
          border-left: 1px solid var(--border);
        }
        .wb-title__privacy p {
          margin: .6rem 0 0; color: var(--text-3);
          font-size: .8rem; line-height: 1.55;
        }

        /* ── Fixture strip ─────────────────────────────────────────────── */

        .wb-title__games {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: .85rem;
        }

        .wb-card {
          position: relative;
          display: flex; flex-direction: column; align-items: flex-start; gap: .35rem;
          padding: 1.1rem 1.15rem 1rem;
          text-align: left;
          background: linear-gradient(168deg, var(--bg-secondary), var(--bg-primary));
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          color: var(--text);
          font-family: var(--sans);
          cursor: pointer;
          overflow: hidden;
          transition: transform .24s var(--ease), border-color .24s var(--ease),
                      box-shadow .24s var(--ease), background .24s var(--ease);
        }
        /* A magenta wash that rises from the floor of the selected card — the
           floodlight hitting the thing the director cut to. */
        .wb-card::after { z-index: 3; }
        .wb-card__wash { display: none; }
        .wb-card.is-selected {
          border-color: var(--accent);
          transform: translateY(-5px);
          background:
            radial-gradient(120% 80% at 50% 120%, var(--accent-dim) 0%, transparent 62%),
            linear-gradient(168deg, var(--bg-secondary), var(--bg-primary));
          box-shadow: 0 22px 56px -22px var(--accent-glow);
        }
        .wb-card.is-planned { cursor: default; }
        .wb-card.is-planned.is-selected {
          border-color: var(--planned-line);
          background:
            radial-gradient(120% 80% at 50% 120%, var(--planned-dim) 0%, transparent 62%),
            linear-gradient(168deg, var(--bg-secondary), var(--bg-primary));
          box-shadow: 0 22px 56px -24px rgba(255,176,32,.3);
        }
        .wb-card.is-planned .wb-card__name { color: var(--text-2); }

        .wb-card__top {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; gap: .5rem;
        }
        .wb-card__index {
          color: var(--text-4); font-weight: 700;
          letter-spacing: .1em; font-size: .68rem;
        }
        .wb-card__art { width: 100%; height: 86px; margin: .5rem 0 .45rem; }
        .wb-card__name {
          font-family: var(--display);
          font-weight: 700;
          font-stretch: 110%;
          font-size: 1.6rem; letter-spacing: -.03em; line-height: 1.05;
        }
        .wb-card__blurb { color: var(--text-2); font-size: .84rem; line-height: 1.45; }
        .wb-card__gesture {
          margin-top: .45rem; padding-top: .45rem; width: 100%;
          border-top: 1px dashed var(--border);
          color: var(--text-3);
          letter-spacing: .14em; text-transform: uppercase; font-size: .62rem; font-weight: 600;
        }
        .wb-card__gesture.is-planned { color: var(--planned); opacity: .8; }

        /* ── Now-selected panel ────────────────────────────────────────── */

        .wb-title__detail {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: end; gap: 2rem;
          padding: 1.5rem;
          border-radius: var(--r-lg);
          background: linear-gradient(162deg, var(--bg-secondary), var(--bg-primary));
          border: 1px solid var(--border);
        }
        .wb-title__detailtext { max-width: 66ch; }
        .wb-title__detailtext .wb-eyebrow { margin-bottom: .4rem; }
        .wb-title__actions { display: flex; gap: .7rem; flex-wrap: wrap; align-items: center; }

        .wb-title__unbuilt {
          display: flex; align-items: center; gap: .7rem; flex-wrap: wrap;
          max-width: 42ch;
          padding: .7rem .9rem; border-radius: var(--r-md);
          color: var(--text-3); font-size: .8rem; line-height: 1.45;
        }

        /* ── Footer ────────────────────────────────────────────────────── */

        .wb-title__foot {
          display: grid; gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
          align-items: start;
        }
        .wb-title__foot code { color: var(--text-2); }
        .wb-title__keys {
          display: flex; align-items: center; gap: .4rem; flex-wrap: wrap;
          color: var(--text-4); font-size: .68rem;
          letter-spacing: .12em; text-transform: uppercase;
          align-self: center;
        }

        @media (max-width: 860px) {
          .wb-title__head { grid-template-columns: 1fr; align-items: start; }
          .wb-title__privacy { border-left: 0; padding-left: 0; }
          .wb-title__detail { grid-template-columns: 1fr; align-items: start; }
        }
      `))}function zl(r){const e={};for(const t of r.keypoints)e[t.name]=t;return e}function HS(r,e=.3){const t=zl(r),s=["left_shoulder","right_shoulder","left_hip","right_hip"].map(u=>t[u]).filter(u=>!!u&&u.score>=e),l=s.length>=2?s:r.keypoints.filter(u=>u.score>=e);if(l.length>0){let u=0,f=0;for(const d of l)u+=d.x,f+=d.y;return{x:u/l.length,y:f/l.length}}return r.box?{x:(r.box.xMin+r.box.xMax)/2,y:(r.box.yMin+r.box.yMax)/2}:null}function VS(r,e){const t=r.x-e.x,i=r.y-e.y;return Math.sqrt(t*t+i*i)}const GS={width:640,height:480,fps:30,facingMode:"user"};function WS(r){const e=[],t={width:{ideal:r.width},height:{ideal:r.height}},i=r.facingMode?{facingMode:r.facingMode}:{};r.deviceId&&e.push({deviceId:{exact:r.deviceId},...t,frameRate:{ideal:r.fps}}),e.push({...i,...t,frameRate:{ideal:r.fps}}),e.push({...i,...t}),e.push({...i}),e.push({});const s=new Set;return e.filter(l=>{const u=JSON.stringify(l);return s.has(u)?!1:(s.add(u),!0)})}function Jy(r){const e=r==null?void 0:r.name;return e==="NotAllowedError"||e==="SecurityError"||e==="PermissionDeniedError"}async function XS(r,e,t){const i=WS(e);let s=null;for(let l=0;l<i.length;l++){const u=i[l];try{const f=await r({video:Object.keys(u).length?u:!0,audio:!1});return l>0&&(t==null||t(`Camera started on a reduced constraint set (attempt ${l+1} of ${i.length}). The requested ${e.width}x${e.height}@${e.fps} was not available; using whatever the device offered instead.`)),f}catch(f){if(s=f,Jy(f)||l===i.length-1)throw f}}throw s??new Error("WebcamFrameSource: could not acquire a camera stream")}function qS(r){r.playsInline=!0,r.muted=!0,r.autoplay=!0,r.defaultMuted=!0;try{r.setAttribute("playsinline",""),r.setAttribute("webkit-playsinline",""),r.setAttribute("muted",""),r.setAttribute("autoplay","")}catch{}}function YS(r,e=5e3){return r.readyState>=1?Promise.resolve(!0):new Promise(t=>{let i=!1;const s=d=>{i||(i=!0,clearTimeout(f),r.removeEventListener("loadedmetadata",l),r.removeEventListener("loadeddata",l),r.removeEventListener("error",u),t(d))},l=()=>s(!0),u=()=>s(!1),f=setTimeout(()=>s(!1),e);r.addEventListener("loadedmetadata",l),r.addEventListener("loadeddata",l),r.addEventListener("error",u)})}class jS{constructor(){He(this,"video",null);He(this,"stream",null);He(this,"callbacks",new Set);He(this,"rafHandle",null);He(this,"videoFrameHandle",null);He(this,"stopped",!0);He(this,"size",null);He(this,"onPauseResume",null);He(this,"warn",e=>console.warn("[wibbly-input] %s",e));He(this,"generation",0)}get frameSize(){return this.size}get running(){return!this.stopped}get videoElement(){return this.video}async start(e={}){var m;if(!this.stopped)return;const t={...GS,...e};if(t.onWarning&&(this.warn=t.onWarning),typeof navigator>"u"||!((m=navigator.mediaDevices)!=null&&m.getUserMedia))throw new Error("WebcamFrameSource: getUserMedia is unavailable in this environment");const i=++this.generation,s=()=>this.generation!==i,l=await XS(g=>navigator.mediaDevices.getUserMedia(g),t,g=>this.warn(g));if(s()){l.getTracks().forEach(g=>g.stop());return}this.stream=l;const u=document.createElement("video");qS(u),u.srcObject=l,this.video=u;const f=this.attemptPlay(u),d=await YS(u);if(s()){l.getTracks().forEach(g=>g.stop());return}if(await f,s()){l.getTracks().forEach(g=>g.stop());return}this.size=this.resolveSize(u,l,d),this.stopped=!1;const h=()=>{this.stopped||this.video!==u||this.attemptPlay(u)};u.addEventListener("pause",h),this.onPauseResume=()=>u.removeEventListener("pause",h),this.pump()}async attemptPlay(e){try{const t=e.play();t&&typeof t.then=="function"&&await t}catch(t){const i=(t==null?void 0:t.name)??"Error";this.warn(`Camera video play() was rejected (${i}). The stream is still open and frames may still arrive; if the preview stays black, a user gesture may be required to start playback on this device.`)}}resolveSize(e,t,i){var u,f;if(e.videoWidth>0&&e.videoHeight>0)return{width:e.videoWidth,height:e.videoHeight};const s=(u=t.getVideoTracks)==null?void 0:u.call(t)[0],l=(f=s==null?void 0:s.getSettings)==null?void 0:f.call(s);return l!=null&&l.width&&(l!=null&&l.height)?(i||this.warn("Camera metadata did not arrive in time; using the track-reported frame size instead."),{width:l.width,height:l.height}):(this.warn("Camera frame size is not yet known; it will be read from frames as they arrive."),{width:0,height:0})}pump(){const e=this.video;if(!e||this.rafHandle!==null||this.videoFrameHandle!==null)return;const t=e.requestVideoFrameCallback;if(typeof t=="function"){const f=(d,h)=>{this.videoFrameHandle=null,!(this.stopped||this.video!==e)&&(this.emit(e,h.captureTime??d),!(this.stopped||this.video!==e)&&(this.videoFrameHandle=t.call(e,f)))};this.videoFrameHandle=t.call(e,f);return}this.warn("requestVideoFrameCallback is unavailable; falling back to requestAnimationFrame for capture. Frame timestamps are approximate (arrival time, not capture time).");let i=-1,s=!1,l=0;const u=()=>{if(this.rafHandle=null,!(this.stopped||this.video!==e)){if(e.readyState>=2){const f=e.currentTime,d=typeof f=="number"&&Number.isFinite(f);d&&f!==i?(i>=0&&(s=!0),i=f,l=0,this.emit(e,performance.now())):!d||!s?this.emit(e,performance.now()):++l>=30&&(l=0,this.emit(e,performance.now()))}this.stopped||this.video!==e||(this.rafHandle=requestAnimationFrame(u))}};this.rafHandle=requestAnimationFrame(u)}emit(e,t){for(const i of this.callbacks)try{i(e,t)}catch(s){console.error("[wibbly-input] frame subscriber threw:",s)}}onFrame(e){return this.callbacks.add(e),()=>this.callbacks.delete(e)}stop(){var e,t;if(this.generation+=1,this.stopped=!0,this.rafHandle!==null&&(cancelAnimationFrame(this.rafHandle),this.rafHandle=null),this.videoFrameHandle!==null&&this.video){const i=this.video.cancelVideoFrameCallback;typeof i=="function"&&i.call(this.video,this.videoFrameHandle)}if(this.videoFrameHandle=null,(e=this.onPauseResume)==null||e.call(this),this.onPauseResume=null,(t=this.stream)==null||t.getTracks().forEach(i=>i.stop()),this.stream=null,this.video){try{this.video.pause()}catch{}this.video.srcObject=null,this.video=null}this.size=null,this.callbacks.clear()}}const KS="modulepreload",ZS=function(r){return"/products/wibbly/play/"+r},Z0={},$0=function(e,t,i){let s=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const u=document.querySelector("meta[property=csp-nonce]"),f=(u==null?void 0:u.nonce)||(u==null?void 0:u.getAttribute("nonce"));s=Promise.allSettled(t.map(d=>{if(d=ZS(d),d in Z0)return;Z0[d]=!0;const h=d.endsWith(".css"),m=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${m}`))return;const g=document.createElement("link");if(g.rel=h?"stylesheet":KS,h||(g.as="script"),g.crossOrigin="",g.href=d,f&&g.setAttribute("nonce",f),document.head.appendChild(g),h)return new Promise((v,b)=>{g.addEventListener("load",v),g.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${d}`)))})}))}function l(u){const f=new Event("vite:preloadError",{cancelable:!0});if(f.payload=u,window.dispatchEvent(f),!f.defaultPrevented)throw u}return s.then(u=>{for(const f of u||[])f.status==="rejected"&&l(f.reason);return e().catch(l)})},Q0="models/movenet-multipose-lightning/model.json";function $S(){try{if(typeof document<"u"&&document.baseURI)return new URL(Q0,document.baseURI).href}catch{}return Q0}const QS=["wasm"],JS=["cpu"],J0=6;async function ew(r,e=["webgl"],t=QS,i=JS){let s=null;const l=async h=>{try{if(await r.setBackend(h)&&(await r.ready(),r.getBackend()===h))return!0}catch(m){s=m}return!1};for(const h of e)if(await l(h))return{backend:h,preferred:!0,cspHostile:!1,warning:null};for(const h of i)if(!(e.includes(h)||t.includes(h))&&await l(h))return{backend:h,preferred:!1,cspHostile:!1,warning:`Pose tracking could not start the preferred backend (${e.join(", ")}) and explicitly fell back to "${h}". It will run, but slowly — expect a long startup and low frame rates. This usually means hardware acceleration (WebGL) is disabled or unavailable in this browser.`+(s?` Last error: ${String(s)}`:"")};await r.ready();const u=r.getBackend(),f=t.includes(u),d=f?`Pose tracking fell back to the "${u}" TFJS backend. That backend needs 'wasm-unsafe-eval' in the page's script-src, which the embedded build does NOT have, so tracking will not work here. Preferred: ${e.join(", ")}.`+(s?` Last error: ${String(s)}`:""):`Pose tracking could not start the preferred backend (${e.join(", ")}) and fell back to "${u}". It will run, but slowly — expect a long startup and low frame rates.`+(s?` Last error: ${String(s)}`:"");return{backend:u,preferred:!1,cspHostile:f,warning:d}}class tw{constructor(e={}){He(this,"capabilities",{body:!0,hands:!1,face:!1});He(this,"maxPeople");He(this,"detector",null);He(this,"cfg");He(this,"modelUrl");He(this,"preferredBackends");He(this,"onBackend");He(this,"createDetectorFn");He(this,"backendInfo",null);this.maxPeople=Math.min(e.maxPeople??J0,J0),this.modelUrl=e.modelUrl===void 0?$S():e.modelUrl,this.preferredBackends=e.preferredBackends??["webgl"],this.onBackend=e.onBackend,this.cfg={maxPeople:this.maxPeople,minPoseScore:e.minPoseScore??.25,multiPoseMaxDimension:e.multiPoseMaxDimension??256,enableSmoothing:e.enableSmoothing??!0,flipHorizontal:e.flipHorizontal??!1},this.createDetectorFn=e.createDetector}async init(){var i;if(this.detector)return;if(this.createDetectorFn){this.detector=await this.createDetectorFn("MoveNet",this.modelConfig());return}const[e,t]=await Promise.all([$0(()=>import("./pose-detection.esm-tLLqLZQ1.js"),__vite__mapDeps([0,1])),$0(()=>import("./index-Df5bBHJu.js"),__vite__mapDeps([2,1]))]);await t.ready(),this.backendInfo=await ew(t,this.preferredBackends),this.backendInfo.warning&&console.error("[wibbly-input] %s",this.backendInfo.warning),(i=this.onBackend)==null||i.call(this,this.backendInfo),this.detector=await e.createDetector(e.SupportedModels.MoveNet,this.modelConfig())}modelConfig(){return{modelType:"MultiPose.Lightning",...this.modelUrl===null?{}:{modelUrl:this.modelUrl},enableSmoothing:this.cfg.enableSmoothing,enableTracking:!0,trackerType:"boundingBox",minPoseScore:this.cfg.minPoseScore,multiPoseMaxDimension:this.cfg.multiPoseMaxDimension}}async estimate(e){if(!this.detector)throw new Error("MoveNetMultiPoseTracker: init() not called");const{width:t,height:i}=nw(e);return!t||!i?[]:(await this.detector.estimatePoses(e,{maxPoses:this.maxPeople,flipHorizontal:this.cfg.flipHorizontal})??[]).filter(l=>(l.score??1)>=this.cfg.minPoseScore).slice(0,this.maxPeople).map(l=>iw(l,t,i))}dispose(){var e,t;(t=(e=this.detector)==null?void 0:e.dispose)==null||t.call(e),this.detector=null}}function nw(r){const e=r;if(typeof e.videoWidth=="number"&&e.videoWidth>0)return{width:e.videoWidth,height:e.videoHeight};const t=r;return{width:t.width??0,height:t.height??0}}function iw(r,e,t){const s={keypoints:r.keypoints.map((l,u)=>({name:l.name??`kp_${u}`,x:l.x/e,y:l.y/t,score:l.score??0,...l.z!==void 0?{z:l.z}:{}})),score:r.score??0};return r.id!==void 0&&(s.trackId=r.id),r.box&&(s.box={xMin:r.box.xMin/e,yMin:r.box.yMin/t,xMax:r.box.xMax/e,yMax:r.box.yMax/t}),s}const Ls={maxPlayers:4,matchRadius:.22,forgetAfterMs:1500,minPoseScore:.2,minKeypointScore:.3,allowUnzonedPlayers:!1};class eb{constructor(e={}){He(this,"tracks",[]);He(this,"cfg");He(this,"frameIndex",0);He(this,"nextAutoId",1);this.cfg={maxPlayers:e.maxPlayers??Ls.maxPlayers,matchRadius:e.matchRadius??Ls.matchRadius,forgetAfterMs:e.forgetAfterMs??Ls.forgetAfterMs,minPoseScore:e.minPoseScore??Ls.minPoseScore,minKeypointScore:e.minKeypointScore??Ls.minKeypointScore,allowUnzonedPlayers:e.allowUnzonedPlayers??Ls.allowUnzonedPlayers,claimZones:e.claimZones??[]}}get activePlayers(){return this.tracks.map(e=>e.playerId)}reset(){this.tracks=[],this.frameIndex=0,this.nextAutoId=1}bind(e,t){this.frameIndex+=1;const i=e.filter(m=>m.score>=this.cfg.minPoseScore).map(m=>({person:m,centroid:HS(m,this.cfg.minKeypointScore)})).filter(m=>m.centroid!==null),s=new Array(i.length).fill(!1),l=new Set,u=[],f=[];for(const m of this.tracks){const g=this.predict(m);i.forEach((v,b)=>{f.push({track:m,index:b,dist:VS(g,v.centroid)})})}f.sort((m,g)=>m.dist-g.dist);for(const m of f){if(m.dist>this.effectiveRadius(m.track)||l.has(m.track)||s[m.index])continue;l.add(m.track),s[m.index]=!0;const g=i[m.index];this.updateTrack(m.track,g.centroid,t),u.push({...g.person,playerId:m.track.playerId})}const d=this.tracks.filter(m=>!l.has(m)&&m.zone!==null);for(const m of d){const g=m.zone,v=i.findIndex((E,S)=>!s[S]&&ev(g,E.centroid.x));if(v===-1)continue;l.add(m),s[v]=!0;const b=i[v];this.updateTrack(m,b.centroid,t,!0),u.push({...b.person,playerId:m.playerId})}const h=i.map((m,g)=>({c:m,i:g})).filter(({i:m})=>!s[m]).sort((m,g)=>m.c.centroid.x-g.c.centroid.x);for(const{c:m,i:g}of h){if(this.tracks.length>=this.cfg.maxPlayers)break;const v=this.freeZoneFor(m.centroid.x);if(!v&&this.cfg.claimZones.length>0&&!this.cfg.allowUnzonedPlayers)continue;const b=v?v.playerId:`player_${this.nextAutoId++}`,E={playerId:b,centroid:m.centroid,velocity:{x:0,y:0},lastSeenAt:t,lastFrameIndex:this.frameIndex,zone:v??null,missedFrames:0,seenFrames:1};this.tracks.push(E),s[g]=!0,u.push({...m.person,playerId:b})}for(const m of this.tracks)l.has(m)||(m.missedFrames+=1,m.velocity={x:m.velocity.x*.6,y:m.velocity.y*.6});return this.tracks=this.tracks.filter(m=>t-m.lastSeenAt<=this.cfg.forgetAfterMs),u}predict(e){const t=Math.max(1,this.frameIndex-e.lastFrameIndex),i=Math.min(t,3);return{x:e.centroid.x+e.velocity.x*i,y:e.centroid.y+e.velocity.y*i}}effectiveRadius(e){const t=1+Math.min(e.missedFrames,6)*.25;return this.cfg.matchRadius*Math.min(t,2.5)}updateTrack(e,t,i,s=!1){const l=Math.max(1,this.frameIndex-e.lastFrameIndex),u={x:(t.x-e.centroid.x)/l,y:(t.y-e.centroid.y)/l};s?e.velocity={x:0,y:0}:e.velocity={x:e.velocity.x*(1-.5)+u.x*.5,y:e.velocity.y*(1-.5)+u.y*.5},e.centroid=t,e.lastSeenAt=i,e.lastFrameIndex=this.frameIndex,e.missedFrames=0,e.seenFrames+=1}freeZoneFor(e){const t=new Set(this.tracks.map(i=>{var s;return(s=i.zone)==null?void 0:s.playerId}).filter(Boolean));return this.cfg.claimZones.find(i=>!t.has(i.playerId)&&ev(i,e))??null}}function ev(r,e){return e>=r.xMin&&e<r.xMax}function aw(r,e="player_"){const t=[];for(let i=0;i<r;i++)t.push({playerId:`${e}${i+1}`,xMin:i/r,xMax:i===r-1?1.0001:(i+1)/r});return t}const Yp={minHorizontal:.0625,minVertical:.028,minSpeed:4e-4,windowSize:3,historyLength:5,minSamples:3,cooldownMs:500,minKeypointScore:.3,mirrored:!1};function rw(r,e=!1){const t=r==="right"?1:-1;return e?-t:t}function sw(r,e,t=Yp){const i=P=>({isSwing:!1,horizontalDistance:0,verticalDistance:0,speed:0,direction:"right",stroke:"forehand",confidence:0,reason:P});if(r.length<t.minSamples)return i("Not enough history");const s=r.slice(-t.windowSize),l=s[0],u=s[s.length-1],f=u.wristX-l.wristX,d=u.wristY-l.wristY,h=u.t-l.t;if(h<=0)return i("Non-monotonic timestamps");const g=Math.hypot(f,d)/h,v=f>=0?"right":"left",b=rw(e,t.mirrored),E=Math.sign(f)===b?"forehand":"backhand",S=Math.abs(f)>=t.minHorizontal,x=Math.abs(d)>=t.minVertical,y=g>=t.minSpeed,T=S&&x&&y,N=[Math.abs(f)/t.minHorizontal,Math.abs(d)/t.minVertical,g/t.minSpeed],A=T?Math.min(1,Math.min(...N)/2):0;return{isSwing:T,horizontalDistance:f,verticalDistance:d,speed:g,direction:v,stroke:E,confidence:A,reason:T?`${E} swing (${v})`:`Not a swing: ${[S?null:"horizontal",x?null:"vertical",y?null:"speed"].filter(Boolean).join("+")} below threshold`}}function ow(r,e,t,i=Yp.minKeypointScore){const s=zl(r),l=s[`${e}_wrist`],u=s[`${e}_elbow`],f=s[`${e}_shoulder`];return!l||!u||!f||l.score<i||u.score<i||f.score<i?null:{wristX:l.x,wristY:l.y,elbowX:u.x,elbowY:u.y,shoulderX:f.x,shoulderY:f.y,t}}class tb{constructor(e={}){He(this,"kind","swing");He(this,"config");He(this,"handedness");He(this,"state",new Map);const{handedness:t,...i}=e;this.config={...Yp,...i},this.handedness=t??"right"}handednessFor(e){return typeof this.handedness=="function"?this.handedness(e):this.handedness}setHandedness(e){this.handedness=e}historyFor(e){var t;return((t=this.state.get(e))==null?void 0:t.history)??[]}feed(e,t){const i=[];for(const s of e){const l=this.handednessFor(s.playerId),u=ow(s,l,t,this.config.minKeypointScore);if(!u)continue;let f=this.state.get(s.playerId);if(f||(f={history:[],cooldownUntil:0},this.state.set(s.playerId,f)),f.history.push(u),f.history.length>this.config.historyLength&&f.history.shift(),t<f.cooldownUntil)continue;const d=sw(f.history,l,this.config);d.isSwing&&(f.cooldownUntil=t+this.config.cooldownMs,f.history=[u],i.push({playerId:s.playerId,kind:this.kind,confidence:d.confidence,vector:{x:d.horizontalDistance,y:d.verticalDistance},tCapture:u.t,detail:{direction:d.direction,stroke:d.stroke,speed:d.speed,handedness:l}}))}return i}reset(e){e?this.state.delete(e):this.state.clear()}}class nb{constructor(){He(this,"map",new Map)}getItem(e){return this.map.get(e)??null}setItem(e,t){this.map.set(e,t)}removeItem(e){this.map.delete(e)}}const qh="wibbly.calibration.v1";function lw(){try{if(typeof localStorage<"u")return localStorage.setItem(`${qh}.probe`,"1"),localStorage.removeItem(`${qh}.probe`),localStorage}catch{}return new nb}function cw(r,e="right"){return{playerId:r,handedness:e,reach:null,torsoScale:null,updatedAt:0}}class kl{constructor(e,t=qh){He(this,"profiles",new Map);He(this,"storage");He(this,"key");this.storage=e??lw(),this.key=t,this.load()}load(){try{const e=this.storage.getItem(this.key);if(!e)return;const t=JSON.parse(e);if(!Array.isArray(t))return;for(const i of t)i&&typeof i.playerId=="string"&&(i.handedness==="left"||i.handedness==="right")&&this.profiles.set(i.playerId,{playerId:i.playerId,handedness:i.handedness,reach:i.reach??null,torsoScale:i.torsoScale??null,updatedAt:i.updatedAt??0})}catch{this.profiles.clear()}}persist(){try{this.storage.setItem(this.key,JSON.stringify([...this.profiles.values()]))}catch{}}get(e){return this.profiles.get(e)??cw(e)}has(e){return this.profiles.has(e)}list(){return[...this.profiles.values()]}handednessFor(e){return this.get(e).handedness}setHandedness(e,t){const i={...this.get(e),handedness:t,updatedAt:Date.now()};return this.profiles.set(e,i),this.persist(),i}set(e,t){const i={...this.get(e),...t,playerId:e,updatedAt:Date.now()};return this.profiles.set(e,i),this.persist(),i}clear(e){e?this.profiles.delete(e):this.profiles.clear(),this.persist()}observeReach(e,t,i=.4){const s=zl(t),l=this.handednessFor(e),u=s[`${l}_wrist`],f=s[`${l}_shoulder`];if(!u||!f||u.score<i||f.score<i)return null;const d=Math.hypot(u.x-f.x,u.y-f.y),h=this.get(e),m=h.reach?{min:Math.min(h.reach.min,d),max:Math.max(h.reach.max,d)}:{min:d,max:d},g=s.left_shoulder,v=s.right_shoulder,b=s.left_hip,E=s.right_hip;let S=h.torsoScale;if(g&&v&&b&&E&&[g,v,b,E].every(x=>x.score>=i)){const x=(g.y+v.y)/2,y=(b.y+E.y)/2;S=Math.abs(y-x)}return this.set(e,{reach:m,torsoScale:S})}}function uw(r,e=.3){const t=[];if(!r)return[{code:"framing",message:"No one detected — step into view of the camera."}];const i=zl(r);["left_shoulder","right_shoulder","left_hip","right_hip"].filter(h=>!i[h]||i[h].score<e).length>0&&t.push({code:"framing",message:"Step back so your head, shoulders and hips are all in frame."}),["left_wrist","right_wrist"].map(h=>i[h]).filter(h=>h&&h.score>=e).length===0&&t.push({code:"framing",message:"Your hands are out of frame — step back or centre yourself."});const f=r.keypoints.filter(h=>h.score>0),d=f.length?f.reduce((h,m)=>h+m.score,0)/f.length:0;return d>0&&d<.35&&t.push({code:"lighting",message:"Tracking is weak — try turning on more light, facing it."}),t}const fw={maxFps:60,minFps:8,dutyCycle:.5,smoothing:.2};class dw{constructor(e={}){He(this,"cfg");He(this,"ewma",null);He(this,"lastRunAt",-1/0);He(this,"samples",0);this.cfg={...fw,...e}}get inferenceMs(){return this.ewma}get sampleCount(){return this.samples}get targetFps(){return 1e3/this.intervalMs}get intervalMs(){const e=1e3/this.cfg.maxFps,t=1e3/this.cfg.minFps;if(this.ewma===null)return e;const i=this.ewma/Math.max(.05,Math.min(1,this.cfg.dutyCycle));return hw(i,e,t)}shouldProcess(e){return e-this.lastRunAt>=this.intervalMs}begin(e){this.lastRunAt=e}record(e){!(e>=0)||!Number.isFinite(e)||(this.samples+=1,this.ewma=this.ewma===null?e:this.ewma*(1-this.cfg.smoothing)+e*this.cfg.smoothing)}reset(){this.ewma=null,this.lastRunAt=-1/0,this.samples=0}}function hw(r,e,t){return Math.max(e,Math.min(t,r))}const pw=[["nose","left_eye"],["left_eye","left_ear"],["nose","right_eye"],["right_eye","right_ear"],["left_shoulder","right_shoulder"],["left_shoulder","left_hip"],["right_shoulder","right_hip"],["left_hip","right_hip"],["left_shoulder","left_elbow"],["left_elbow","left_wrist"],["right_shoulder","right_elbow"],["right_elbow","right_wrist"],["left_hip","left_knee"],["left_knee","left_ankle"],["right_hip","right_knee"],["right_knee","right_ankle"]],$c=["#00ff88","#ffb300","#4fd1c7","#ff6b9d","#a78bfa","#f87171"];function mw(r,e){const t=/(\d+)$/.exec(r),i=t?parseInt(t[1],10)-1:e;return $c[(i%$c.length+$c.length)%$c.length]}function ib(r,e,t={}){const{canvas:i}=r,s=i.width,l=i.height,u=t.minScore??.3,f=Math.max(1,s/320);r.clearRect(0,0,s,l),e.forEach((d,h)=>{var S,x;const m=mw(d.playerId,h),g=zl(d),v=y=>({x:y.x*s,y:y.y*l});r.strokeStyle="rgba(255,255,255,0.75)",r.lineWidth=2*f;for(const[y,T]of pw){const N=g[y],A=g[T];if(!N||!A||N.score<u||A.score<u)continue;const P=v(N),F=v(A);r.beginPath(),r.moveTo(P.x,P.y),r.lineTo(F.x,F.y),r.stroke()}const b=((S=t.highlightArm)==null?void 0:S.call(t,d.playerId))??null;if(b){const y=g[`${b}_shoulder`],T=g[`${b}_elbow`],N=g[`${b}_wrist`];if(y&&T&&N&&y.score>=u&&T.score>=u&&N.score>=u){r.strokeStyle=m,r.lineWidth=4*f,r.lineCap="round",r.lineJoin="round",r.beginPath();const A=v(y),P=v(T),F=v(N);r.moveTo(A.x,A.y),r.lineTo(P.x,P.y),r.lineTo(F.x,F.y),r.stroke()}}for(const y of d.keypoints){if(y.score<u)continue;const T=v(y),N=b!==null&&y.name===`${b}_wrist`;r.fillStyle=N?m:"rgba(255,255,255,0.9)",r.beginPath(),r.arc(T.x,T.y,(N?7:3.5)*f*.6,0,Math.PI*2),r.fill()}const E=((x=t.trailFor)==null?void 0:x.call(t,d.playerId))??[];if(E.length>1){r.strokeStyle=m,r.globalAlpha=.55,r.lineWidth=3*f,r.lineCap="round",r.lineJoin="round",r.beginPath(),r.moveTo(E[0].wristX*s,E[0].wristY*l);for(let y=1;y<E.length;y++)r.lineTo(E[y].wristX*s,E[y].wristY*l);r.stroke(),r.globalAlpha=1}if(t.showLabels){const y=g.nose,T=y&&y.score>=u?v(y):null;T&&(r.fillStyle=m,r.font=`${Math.max(11,12*f*.6)}px system-ui, sans-serif`,r.fillText(d.playerId,T.x-20,T.y-14*f*.6))}})}class ab{constructor(e={}){He(this,"source");He(this,"tracker");He(this,"binder");He(this,"calibration");He(this,"pacer");He(this,"recognizers");He(this,"unsubscribe",null);He(this,"busy",!1);He(this,"started",!1);He(this,"generation",0);He(this,"processed",0);He(this,"dropped",0);He(this,"lastPeopleCount",0);He(this,"gestureHandlers",new Set);He(this,"peopleHandlers",new Set);He(this,"errorHandler");He(this,"frameOpts");this.source=e.source??new jS,this.tracker=e.tracker??new tw(e.trackerConfig),this.calibration=e.calibration??new kl,this.binder=e.binder??new eb(e.binderConfig),this.pacer=new dw(e.pacer),this.frameOpts=e.frame??{},this.recognizers=e.recognizers??[new tb({handedness:t=>this.calibration.handednessFor(t)})],e.onGesture&&this.gestureHandlers.add(e.onGesture),e.onPeople&&this.peopleHandlers.add(e.onPeople),this.errorHandler=e.onError}onGesture(e){return this.gestureHandlers.add(e),()=>this.gestureHandlers.delete(e)}onPeople(e){return this.peopleHandlers.add(e),()=>this.peopleHandlers.delete(e)}get stats(){return{inferenceMs:this.pacer.inferenceMs,targetFps:this.pacer.targetFps,processedFrames:this.processed,droppedFrames:this.dropped,peopleLastFrame:this.lastPeopleCount}}get videoElement(){const e=this.source;return typeof e.videoElement<"u"?e.videoElement:null}async start(){if(this.started)return;const e=++this.generation,t=()=>this.generation!==e;if(await this.tracker.init(),t()){this.tracker.dispose();return}if(await this.source.start({width:640,height:480,fps:30,...this.frameOpts}),t()){this.source.stop(),this.tracker.dispose();return}this.unsubscribe=this.source.onFrame((i,s)=>{this.handleFrame(i,s)}),this.started=!0}async handleFrame(e,t){const i=typeof performance<"u"?performance.now():Date.now();if(this.busy||!this.pacer.shouldProcess(i)){this.dropped+=1;return}this.busy=!0,this.pacer.begin(i);const s=i;try{const l=await this.tracker.estimate(e),u=this.binder.bind(l,t);this.lastPeopleCount=u.length,this.processed+=1;for(const f of this.recognizers){const d=f.feed(u,t);for(const h of d)for(const m of this.gestureHandlers)try{m(h)}catch(g){this.reportError(g)}}for(const f of this.peopleHandlers)try{f(u,t)}catch(d){this.reportError(d)}}catch(l){this.reportError(l)}finally{const l=typeof performance<"u"?performance.now():Date.now();this.pacer.record(l-s),this.busy=!1}}reportError(e){this.errorHandler?this.errorHandler(e):console.error("[wibbly-input]",e)}stop(){var e;this.generation+=1,(e=this.unsubscribe)==null||e.call(this),this.unsubscribe=null,this.source.stop(),this.tracker.dispose(),this.binder.reset();for(const t of this.recognizers)t.reset();this.started=!1}}const jp={BASE_URL:"/products/wibbly/play/",VITE_WIBBLY_MODE:"demo"},tv="full",$r="demo",nv="https://tfhub.dev/google/tfjs-model/movenet/multipose/lightning/1",gw="models/movenet-multipose-lightning/model.json";function Kp(r={},e=null){const t=e==null?void 0:e.__WIBBLY_MODE__;return t===$r||t===tv?t:(r==null?void 0:r.VITE_WIBBLY_MODE)===$r?$r:tv}function rb(){return Kp(typeof import.meta<"u"?jp:{},typeof window<"u"?window:null)}function Zp(){return rb()===$r}function _w(r={},e=null,t="/",i=null){const s=Kp(r,e),l=e==null?void 0:e.__WIBBLY_MODEL_URL__,u=typeof l=="string"&&l?l:r==null?void 0:r.VITE_WIBBLY_MODEL;if(u==="cdn"||u===nv){if(s===$r)throw new Error("wibbly: the demo build must be self-contained, so the TF Hub model CDN is refused. The demo is embedded under a `default-src 'self'` CSP where that fetch cannot succeed anyway. Drop VITE_WIBBLY_MODEL=cdn, or build the full app instead.");return nv}if(typeof u=="string"&&u&&u!=="local")return u;const f=`${t.endsWith("/")?t:`${t}/`}${gw}`;if(!i)return f;try{return new URL(f,i).href}catch{return f}}function sb(){const r=typeof import.meta<"u"?jp:{};return _w(r,typeof window<"u"?window:null,(r==null?void 0:r.BASE_URL)||"/",typeof location<"u"?location.href:null)}function vw(r,e="/",t=null){const i=r.replace(/^\/+/,""),s=`${e.endsWith("/")?e:`${e}/`}${i}`;if(!t)return s;try{return new URL(s,t).href}catch{return s}}function ob(r){const e=typeof import.meta<"u"?jp:{};return vw(r,(e==null?void 0:e.BASE_URL)||"/",typeof location<"u"?location.href:null)}function yw(r={},e=null){return Kp(r,e)===$r?null:(e==null?void 0:e.__WIBBLY_PEER_TRANSPORT__)??null}function bw(r){if(r===$r)throw new Error("wibbly: PeerSession must never be constructed in demo mode — the demo is self-contained and opens no peer connections.")}const xw=["wibbly.settings.v1","wibbly.setup.v1","wibbly.calibration.v1"];function Ew(r){if(!r)return 0;let e=0;try{const t=new Set(xw);for(let i=0;i<r.length;i+=1){const s=r.key(i);typeof s=="string"&&s.startsWith("wibbly.")&&t.add(s)}for(const i of t)r.getItem(i)!==null&&(r.removeItem(i),e+=1)}catch{}return e}const Qc="player_1",iv=["intro","handedness","framing"],Mw={intro:"Permission",handedness:"Handedness",framing:"Framing"};function Sw(){const r=Fl(),e=G.useRef(null);e.current||(e.current=new kl);const t=G.useRef(null),i=G.useRef(null),s=G.useRef(null),[l,u]=G.useState("intro"),[f,d]=G.useState("idle"),[h,m]=G.useState(null),[g,v]=G.useState(!1),[b,E]=G.useState(null),[S,x]=G.useState(()=>e.current.handednessFor(Qc)),[y,T]=G.useState(null),[N,A]=G.useState(!1),[P,F]=G.useState(null),k=G.useCallback(async()=>{if(t.current)return;d("starting"),m(null),v(!1),E(null);const J=new ab({calibration:e.current,trackerConfig:{modelUrl:sb()},frame:{width:640,height:480,fps:30,onWarning:K=>{console.warn("[setup]",K),E(K)}},onError:K=>console.error("[setup] pipeline error:",K)});t.current=J,J.onPeople(K=>{const ce=K[0]??null;ce&&A(!0),T(uw(ce)),ce&&e.current.observeReach(Qc,ce);const de=s.current,W=J.videoElement;if(!de||!W)return;const le=W.videoWidth||640,Y=W.videoHeight||480;(de.width!==le||de.height!==Y)&&(de.width=le,de.height=Y);const ye=de.getContext("2d");ye&&ib(ye,K,{highlightArm:()=>e.current.handednessFor(Qc)})});try{if(await J.start(),t.current!==J){J.stop();return}d("live"),u("handedness")}catch(K){console.error("[setup] camera unavailable:",K),v(Jy(K)),m(K instanceof Error?K.message:String(K)),d("failed");try{J.stop()}catch{}t.current===J&&(t.current=null)}},[]);G.useEffect(()=>{var ce;const J=(ce=t.current)==null?void 0:ce.videoElement,K=i.current;if(!(!J||!K))return J.style.width="100%",J.style.height="100%",J.style.objectFit="cover",J.style.display="block",J.style.transform="scaleX(-1)",K.appendChild(J),()=>{J.parentElement===K&&K.removeChild(J)}},[f,l]),G.useEffect(()=>{if(f!=="live")return;const J=setInterval(()=>{var K;return F(((K=t.current)==null?void 0:K.stats)??null)},1e3);return()=>clearInterval(J)},[f]),G.useEffect(()=>()=>{var J;(J=t.current)==null||J.stop(),t.current=null},[]);const z=J=>{e.current.setHandedness(Qc,J),x(J)},R=J=>{var K;BS(J),(K=t.current)==null||K.stop(),t.current=null,r("/play")},C=iv.indexOf(l),H=M.createElement("div",{className:`wb-stagecam wb-bracket ${N?"is-live":""}`},M.createElement("div",{className:"wb-stagecam__bar"},M.createElement("span",{className:"wb-stagecam__id"},M.createElement("span",{className:`wb-stagecam__rec ${N?"is-tracking":""}`}),"CAM 01 ",M.createElement("span",{className:"wb-stagecam__sub"},"/ front")),M.createElement("span",{className:"wb-stagecam__tele"},P?M.createElement(M.Fragment,null,P.peopleLastFrame," tracked",M.createElement("i",null,"·"),Math.round(P.targetFps)," fps",P.inferenceMs!=null&&M.createElement(M.Fragment,null,M.createElement("i",null,"·"),Math.round(P.inferenceMs)," ms")):"standby")),M.createElement("div",{className:"wb-stagecam__frame"},M.createElement("div",{ref:i,className:"wb-stagecam__video"}),M.createElement("canvas",{ref:s,className:"wb-stagecam__overlay"}),M.createElement("div",{className:"wb-stagecam__guide","aria-hidden":"true"}),f==="live"&&!N&&M.createElement("div",{className:"wb-stagecam__hint"},M.createElement("span",{className:"wb-stagecam__hintdot"}),"Waiting for a person — stand back so your head, shoulders and hips are all in frame.")),b&&M.createElement("p",{className:"wb-stagecam__warn",role:"status"},b));return M.createElement("div",{className:"wb-court"},M.createElement("div",{className:"wb-grain","aria-hidden":"true"}),M.createElement("div",{className:"wb-stage wb-setup"},M.createElement("header",{className:"wb-setup__head wb-rise",style:{"--i":0}},M.createElement("div",null,M.createElement("p",{className:"wb-eyebrow"},"Setup"),M.createElement("h1",{className:"wb-h2"},"Get your camera ready")),M.createElement("button",{type:"button",className:"wb-btn wb-btn--ghost wb-btn--small",onClick:()=>r("/")},"Back to title")),M.createElement("ol",{className:"wb-setup__rail wb-rise",style:{"--i":1}},iv.map((J,K)=>M.createElement("li",{key:J,className:K===C?"is-current":K<C?"is-done":"","aria-current":K===C?"step":void 0},M.createElement("span",{className:"wb-setup__railno wb-mono"},String(K+1).padStart(2,"0")),M.createElement("span",{className:"wb-setup__raillabel"},Mw[J]),M.createElement("span",{className:"wb-setup__railtrack"})))),l==="intro"&&M.createElement("section",{className:"wb-setup__intro wb-rise",style:{"--i":2}},M.createElement("div",{className:"wb-panel wb-panel--framed wb-setup__panel"},M.createElement("div",null,M.createElement("p",{className:"wb-eyebrow"},"Step 01"),M.createElement("h2",{className:"wb-h2"},"Before the browser asks")),M.createElement("p",{className:"wb-lede"},"Wibbly reads your body position from your webcam to turn a swing into a game input. When you press the button below, your browser will ask for camera permission — that prompt comes from the browser, not from us."),M.createElement("ul",{className:"wb-setup__facts"},M.createElement("li",null,M.createElement("span",{className:"wb-setup__facticon","aria-hidden":"true"},M.createElement("svg",{viewBox:"0 0 20 20"},M.createElement("path",{d:"M10 2 L17 5 v5c0 4-3 6.5-7 8-4-1.5-7-4-7-8V5z",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinejoin:"round"}))),M.createElement("span",null,M.createElement("strong",null,"Frames stay in this tab.")," Pose estimation runs locally in your browser. Nothing is uploaded; this build has no server to upload to.")),M.createElement("li",null,M.createElement("span",{className:"wb-setup__facticon","aria-hidden":"true"},M.createElement("svg",{viewBox:"0 0 20 20"},M.createElement("circle",{cx:"10",cy:"10",r:"7",fill:"none",stroke:"currentColor",strokeWidth:"1.6"}),M.createElement("path",{d:"M5 15 L15 5",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round"}))),M.createElement("span",null,M.createElement("strong",null,"Nothing is recorded.")," The video element is live only. Closing the tab or leaving this page stops the camera and releases the device.")),M.createElement("li",null,M.createElement("span",{className:"wb-setup__facticon","aria-hidden":"true"},M.createElement("svg",{viewBox:"0 0 20 20"},M.createElement("path",{d:"M10 3 v9 M6.5 8.5 L10 12 l3.5-3.5",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"}),M.createElement("path",{d:"M4 15 h12",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round"}))),M.createElement("span",null,M.createElement("strong",null,"The model ships with the app.")," The ~9 MB pose model is served from this same origin, not fetched from a third-party CDN. It loads once, then your browser caches it.")),M.createElement("li",null,M.createElement("span",{className:"wb-setup__facticon","aria-hidden":"true"},M.createElement("svg",{viewBox:"0 0 20 20"},M.createElement("rect",{x:"2.5",y:"6.5",width:"15",height:"7",rx:"2",fill:"none",stroke:"currentColor",strokeWidth:"1.6"}),M.createElement("path",{d:"M6 10 h8",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round"}))),M.createElement("span",null,M.createElement("strong",null,"You can say no.")," The whole game is playable on the spacebar."))),M.createElement("div",{className:"wb-setup__actions"},M.createElement("button",{type:"button",className:"wb-btn wb-btn--primary",onClick:k,disabled:f==="starting"},f==="starting"?"Starting camera…":"Turn on my camera"),M.createElement("button",{type:"button",className:"wb-btn wb-btn--ghost",onClick:()=>R("keyboard")},"Skip — play with the spacebar")),f==="failed"&&M.createElement("div",{className:"wb-setup__failure"},g?M.createElement("p",{className:"wb-note wb-note--planned"},M.createElement("strong",null,"No camera, then.")," That is a perfectly good answer — the whole game is playable on the spacebar, and nothing below is missing from it except the arm swing. If you change your mind, your browser keeps this permission in its site settings."):M.createElement("p",{className:"wb-note wb-note--danger"},M.createElement("strong",null,"The camera pipeline did not start.")," The browser reported:"," ",M.createElement("code",{className:"wb-mono"},h),M.createElement("br",null),"Common causes: another app is holding the camera, there is no camera attached, or this browser cannot give the pose model a GPU backend. None of them stop you playing."),M.createElement("div",{className:"wb-setup__actions"},g?M.createElement(M.Fragment,null,M.createElement("button",{type:"button",className:"wb-btn wb-btn--primary",onClick:()=>R("keyboard")},"Play with the spacebar"),M.createElement("button",{type:"button",className:"wb-btn wb-btn--ghost",onClick:k},"Ask again")):M.createElement(M.Fragment,null,M.createElement("button",{type:"button",className:"wb-btn",onClick:k},"Try again"),M.createElement("button",{type:"button",className:"wb-btn wb-btn--primary",onClick:()=>R("keyboard")},"Play with the spacebar"))))),M.createElement("aside",{className:"wb-setup__diagram wb-bracket"},M.createElement("p",{className:"wb-eyebrow"},"What good framing looks like"),M.createElement("svg",{viewBox:"0 0 200 150","aria-hidden":"true"},M.createElement("rect",{x:"1",y:"1",width:"198",height:"148",rx:"6",fill:"none",stroke:"var(--border)"}),M.createElement("rect",{x:"30",y:"14",width:"140",height:"122",rx:"4",fill:"none",stroke:"var(--court-line-bright)",strokeDasharray:"4 5"}),M.createElement("circle",{cx:"100",cy:"42",r:"13",fill:"none",stroke:"var(--text-3)",strokeWidth:"2.2"}),M.createElement("path",{d:"M100 55 L100 95 M100 66 L74 82 M100 66 L126 78 M100 95 L86 132 M100 95 L114 132",fill:"none",stroke:"var(--text-3)",strokeWidth:"2.2",strokeLinecap:"round"}),M.createElement("circle",{cx:"126",cy:"78",r:"4.5",fill:"var(--accent)"}),M.createElement("circle",{cx:"74",cy:"82",r:"4.5",fill:"var(--accent)"}),M.createElement("circle",{cx:"100",cy:"55",r:"4.5",fill:"var(--accent)"}),M.createElement("text",{x:"100",y:"146",textAnchor:"middle",fill:"var(--text-4)",style:{font:"600 8px var(--mono)",letterSpacing:".14em"}},"HEAD · SHOULDERS · HIPS")),M.createElement("p",{className:"wb-note"},"Roughly two metres back, light on your face rather than behind you, and room either side to swing."))),l==="handedness"&&M.createElement("section",{className:"wb-setup__split wb-rise",style:{"--i":2}},H,M.createElement("div",{className:"wb-panel wb-panel--framed wb-setup__panel"},M.createElement("div",null,M.createElement("p",{className:"wb-eyebrow"},"Step 02"),M.createElement("h2",{className:"wb-h2"},"Which hand holds the racket?")),M.createElement("p",{className:"wb-lede"},"This is the arm the swing detector watches, and it decides whether a stroke counts as a forehand or a backhand. It is saved to your device for this player only."),M.createElement("div",{className:"wb-setup__hands"},["left","right"].map(J=>M.createElement("button",{key:J,type:"button",className:`wb-hand ${S===J?"is-active":""}`,onClick:()=>z(J),"aria-pressed":S===J},M.createElement("svg",{viewBox:"0 0 60 60","aria-hidden":"true",style:{transform:J==="left"?"scaleX(-1)":"none"}},M.createElement("circle",{cx:"22",cy:"14",r:"6",fill:"none",stroke:"currentColor",strokeWidth:"2.2"}),M.createElement("path",{d:"M22 20 L22 40 M22 26 L12 33 M22 40 L15 55 M22 40 L29 55",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round"}),M.createElement("path",{d:"M22 26 L40 20",stroke:"currentColor",strokeWidth:"2.6",strokeLinecap:"round"}),M.createElement("circle",{cx:"45",cy:"18",r:"6",fill:"none",stroke:"currentColor",strokeWidth:"2.6"})),M.createElement("span",{className:"wb-hand__label"},J==="left"?"Left-handed":"Right-handed"),M.createElement("span",{className:"wb-hand__state wb-mono"},S===J?"selected":"select")))),M.createElement("p",{className:"wb-note wb-note--accent"},M.createElement("strong",null,"Saved live.")," The recogniser reads it again on the very next frame, so you can flip it mid-match from the in-game menu."),M.createElement("div",{className:"wb-setup__actions"},M.createElement("button",{type:"button",className:"wb-btn wb-btn--primary",onClick:()=>u("framing")},"Next — check my framing")))),l==="framing"&&M.createElement("section",{className:"wb-setup__split wb-rise",style:{"--i":2}},H,M.createElement("div",{className:"wb-panel wb-panel--framed wb-setup__panel"},M.createElement("div",null,M.createElement("p",{className:"wb-eyebrow"},"Step 03"),M.createElement("h2",{className:"wb-h2"},"Framing & light")),M.createElement("p",{className:"wb-lede"},"Stand back until your head, shoulders and hips are all visible, with room to swing. These checks come from the library's ",M.createElement("code",{className:"wb-mono"},"checkFraming()")," — the same function the game itself uses."),M.createElement("div",{className:"wb-setup__checks","aria-live":"polite"},y===null&&M.createElement("p",{className:"wb-note"},M.createElement("span",{className:"wb-setup__spin","aria-hidden":"true"})," Scoring the first frame…"),y!==null&&y.length===0&&M.createElement("p",{className:"wb-note wb-note--shipped"},M.createElement("strong",null,"Framing looks good.")," Head, shoulders, hips and at least one wrist are all tracked with confidence."),y!==null&&y.map(J=>M.createElement("p",{key:J.code+J.message,className:"wb-note wb-note--planned"},M.createElement("strong",null,J.code==="lighting"?"Light":"Framing",":")," ",J.message))),M.createElement("div",{className:"wb-setup__actions"},M.createElement("button",{type:"button",className:"wb-btn wb-btn--primary",onClick:()=>R("camera")},"Start playing"),M.createElement("button",{type:"button",className:"wb-btn wb-btn--ghost",onClick:()=>u("handedness")},"Back")),M.createElement("p",{className:"wb-note"},"You can continue with warnings showing — they degrade tracking, they do not block it, and the spacebar always works.")))),M.createElement("style",null,`
        .wb-setup { display: flex; flex-direction: column; gap: 1.4rem; }
        .wb-setup__head {
          display: flex; justify-content: space-between; align-items: flex-end;
          gap: 1rem; flex-wrap: wrap;
        }
        .wb-setup__head .wb-eyebrow { margin-bottom: .35rem; }

        /* ── Progress track ───────────────────────────────────────────── */

        .wb-setup__rail {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: .9rem; list-style: none; margin: 0; padding: 0;
        }
        .wb-setup__rail li {
          display: flex; align-items: baseline; gap: .5rem; flex-wrap: wrap;
          color: var(--text-4); font-size: .82rem;
        }
        .wb-setup__railno {
          font-size: .66rem; font-weight: 700; letter-spacing: .14em; color: inherit;
        }
        .wb-setup__raillabel {
          font-family: var(--mono); font-size: .66rem; font-weight: 600;
          letter-spacing: .16em; text-transform: uppercase;
        }
        .wb-setup__railtrack {
          flex: 1 1 100%; height: 2px; border-radius: 2px;
          background: var(--border); margin-top: .3rem;
          transition: background .3s var(--ease);
        }
        .wb-setup__rail li.is-current { color: var(--accent); }
        .wb-setup__rail li.is-current .wb-setup__railtrack { background: var(--accent); }
        .wb-setup__rail li.is-done { color: var(--text-2); }
        .wb-setup__rail li.is-done .wb-setup__railtrack { background: var(--border-bright); }

        /* ── Panels ───────────────────────────────────────────────────── */

        .wb-setup__panel { display: flex; flex-direction: column; gap: 1rem; }
        .wb-setup__panel > div > .wb-eyebrow { margin-bottom: .3rem; }
        .wb-setup__panel .wb-h2 { margin: 0; }

        .wb-setup__facts { margin: 0; padding: 0; list-style: none; display: grid; gap: .7rem; }
        .wb-setup__facts li {
          display: grid; grid-template-columns: auto minmax(0,1fr); gap: .7rem;
          align-items: start;
          color: var(--text-2); font-size: .88rem; line-height: 1.5;
        }
        .wb-setup__facts strong { color: var(--text); font-weight: 650; }
        .wb-setup__facticon {
          display: grid; place-items: center;
          width: 26px; height: 26px; border-radius: var(--r-sm);
          border: 1px solid var(--border); background: var(--bg-sunken);
          color: var(--accent);
        }
        .wb-setup__facticon svg { width: 15px; height: 15px; }

        .wb-setup__actions { display: flex; gap: .7rem; flex-wrap: wrap; }
        .wb-setup__failure { display: flex; flex-direction: column; gap: 1rem; }
        .wb-setup__failure code { word-break: break-word; color: var(--text); }

        /* ── Intro two-up ─────────────────────────────────────────────── */

        .wb-setup__intro {
          display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
          gap: 1.15rem; align-items: start;
        }
        .wb-setup__diagram {
          padding: 1.15rem; border-radius: var(--r-lg);
          background: var(--bg-sunken); border: 1px solid var(--border);
          display: flex; flex-direction: column; gap: .8rem;
        }
        .wb-setup__diagram svg { width: 100%; height: auto; }

        /* ── Stage split: the picture gets the bigger half ────────────── */

        .wb-setup__split {
          display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
          gap: 1.15rem; align-items: start;
        }

        /* ── The camera stage ─────────────────────────────────────────── */

        .wb-stagecam {
          border-radius: var(--r-lg); overflow: hidden;
          background: var(--bg-sunken);
          border: 1px solid var(--border-strong);
          box-shadow: var(--shadow-lg);
        }
        .wb-stagecam__bar {
          display: flex; align-items: center; justify-content: space-between;
          gap: .75rem; padding: .5rem .7rem;
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border);
          font-family: var(--mono); font-size: .62rem; font-weight: 600;
          letter-spacing: .16em; text-transform: uppercase;
          font-variant-numeric: tabular-nums;
        }
        .wb-stagecam__id { display: inline-flex; align-items: center; gap: .45rem; color: var(--text-2); }
        .wb-stagecam__sub { color: var(--text-4); }
        .wb-stagecam__rec {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--text-4); flex: none;
        }
        .wb-stagecam__rec.is-tracking {
          background: var(--accent); box-shadow: 0 0 9px var(--accent);
          animation: wb-pulse 2s ease-in-out infinite;
        }
        .wb-stagecam__tele {
          display: inline-flex; align-items: center; gap: .3rem;
          color: var(--text-3);
        }
        .wb-stagecam__tele i { color: var(--text-4); font-style: normal; }

        .wb-stagecam__frame {
          position: relative; aspect-ratio: 4 / 3; width: 100%;
          background: #000; overflow: hidden;
        }
        .wb-stagecam__video, .wb-stagecam__overlay {
          position: absolute; inset: 0; width: 100%; height: 100%;
        }
        .wb-stagecam__overlay { transform: scaleX(-1); pointer-events: none; }
        /* The standing guide — chalk on the floor, not a UI element. */
        .wb-stagecam__guide {
          position: absolute; inset: 8% 18%;
          border: 1px dashed rgba(244,240,248,.13);
          border-radius: 4px; pointer-events: none;
        }
        .wb-stagecam__hint {
          position: absolute; left: 0; right: 0; bottom: 0;
          display: flex; align-items: center; gap: .5rem;
          padding: .75rem .85rem; font-size: .8rem; color: var(--text-2);
          background: linear-gradient(to top, rgba(8,6,16,.95), transparent);
        }
        .wb-stagecam__warn {
          margin: 0; padding: .6rem .75rem;
          border-top: 1px solid var(--planned-line);
          background: var(--planned-dim);
          color: var(--planned);
          font-family: var(--mono); font-size: .7rem; line-height: 1.5;
        }
        .wb-stagecam__hintdot {
          width: 6px; height: 6px; border-radius: 50%; flex: none;
          background: var(--planned);
          animation: wb-pulse 1.6s ease-in-out infinite;
        }

        /* ── Handedness ───────────────────────────────────────────────── */

        .wb-setup__hands { display: grid; grid-template-columns: 1fr 1fr; gap: .7rem; }
        .wb-hand {
          display: flex; flex-direction: column; align-items: center; gap: .45rem;
          padding: 1.1rem .75rem .85rem; border-radius: var(--r-md);
          border: 1px solid var(--border); background: var(--bg-sunken);
          color: var(--text-3); font-family: var(--sans);
          cursor: pointer; transition: all .18s var(--ease);
        }
        .wb-hand svg { width: 54px; height: 54px; }
        .wb-hand__label { font-size: .88rem; font-weight: 650; color: var(--text-2); }
        .wb-hand__state {
          font-size: .6rem; font-weight: 700; letter-spacing: .16em;
          text-transform: uppercase; color: var(--text-4);
        }
        .wb-hand:hover { border-color: var(--border-bright); color: var(--text-2); }
        .wb-hand:hover .wb-hand__label { color: var(--text); }
        .wb-hand.is-active {
          border-color: var(--accent); color: var(--accent);
          background: var(--accent-dim);
          box-shadow: 0 14px 36px -20px var(--accent-glow);
        }
        .wb-hand.is-active .wb-hand__label,
        .wb-hand.is-active .wb-hand__state { color: var(--accent); }

        .wb-setup__checks { display: grid; gap: .55rem; }
        .wb-setup__spin {
          display: inline-block; width: 9px; height: 9px; margin-right: .35rem;
          border-radius: 50%; border: 1.5px solid var(--border-bright);
          border-top-color: var(--accent);
          animation: wb-spin .9s linear infinite;
        }
        @keyframes wb-spin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .wb-setup__split, .wb-setup__intro { grid-template-columns: 1fr; }
          .wb-setup__rail { grid-template-columns: 1fr; gap: .5rem; }
          .wb-setup__railtrack { flex-basis: auto; min-width: 60px; }
        }
      `))}/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const $p="174",ww=0,av=1,Tw=2,lb=1,Aw=2,Ma=3,Na=0,ei=1,Ei=2,fr=0,Zs=1,rv=2,sv=3,ov=4,Rw=5,Kr=100,Cw=101,Dw=102,Nw=103,Lw=104,Uw=200,Pw=201,Ow=202,Iw=203,Yh=204,jh=205,Fw=206,Bw=207,zw=208,kw=209,Hw=210,Vw=211,Gw=212,Ww=213,Xw=214,Kh=0,Zh=1,$h=2,eo=3,Qh=4,Jh=5,ep=6,tp=7,cb=0,qw=1,Yw=2,dr=0,jw=1,Kw=2,Zw=3,$w=4,Qw=5,Jw=6,eT=7,lv="attached",tT="detached",ub=300,to=301,no=302,np=303,ip=304,ju=306,io=1e3,cr=1001,zu=1002,qn=1003,fb=1004,Tl=1005,ci=1006,Cu=1007,wa=1008,La=1009,db=1010,hb=1011,Ll=1012,Qp=1013,Qr=1014,Oi=1015,Hl=1016,Jp=1017,em=1018,ao=1020,pb=35902,mb=1021,gb=1022,Mi=1023,_b=1024,vb=1025,$s=1026,ro=1027,tm=1028,nm=1029,yb=1030,im=1031,am=1033,Du=33776,Nu=33777,Lu=33778,Uu=33779,ap=35840,rp=35841,sp=35842,op=35843,lp=36196,cp=37492,up=37496,fp=37808,dp=37809,hp=37810,pp=37811,mp=37812,gp=37813,_p=37814,vp=37815,yp=37816,bp=37817,xp=37818,Ep=37819,Mp=37820,Sp=37821,Pu=36492,wp=36494,Tp=36495,bb=36283,Ap=36284,Rp=36285,Cp=36286,Ul=2300,Pl=2301,lh=2302,cv=2400,uv=2401,fv=2402,nT=2500,iT=0,xb=1,Dp=2,aT=3200,rT=3201,Eb=0,sT=1,lr="",Dn="srgb",jn="srgb-linear",ku="linear",Xt="srgb",Us=7680,dv=519,oT=512,lT=513,cT=514,Mb=515,uT=516,fT=517,dT=518,hT=519,Np=35044,hv="300 es",Ta=2e3,Hu=2001;class mo{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const l=s.indexOf(t);l!==-1&&s.splice(l,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let l=0,u=s.length;l<u;l++)s[l].call(this,e);e.target=null}}}const Pn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let pv=1234567;const Rl=Math.PI/180,so=180/Math.PI;function Ii(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Pn[r&255]+Pn[r>>8&255]+Pn[r>>16&255]+Pn[r>>24&255]+"-"+Pn[e&255]+Pn[e>>8&255]+"-"+Pn[e>>16&15|64]+Pn[e>>24&255]+"-"+Pn[t&63|128]+Pn[t>>8&255]+"-"+Pn[t>>16&255]+Pn[t>>24&255]+Pn[i&255]+Pn[i>>8&255]+Pn[i>>16&255]+Pn[i>>24&255]).toLowerCase()}function yt(r,e,t){return Math.max(e,Math.min(t,r))}function rm(r,e){return(r%e+e)%e}function pT(r,e,t,i,s){return i+(r-e)*(s-i)/(t-e)}function mT(r,e,t){return r!==e?(t-r)/(e-r):0}function Cl(r,e,t){return(1-t)*r+t*e}function gT(r,e,t,i){return Cl(r,e,1-Math.exp(-t*i))}function _T(r,e=1){return e-Math.abs(rm(r,e*2)-e)}function vT(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function yT(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function bT(r,e){return r+Math.floor(Math.random()*(e-r+1))}function xT(r,e){return r+Math.random()*(e-r)}function ET(r){return r*(.5-Math.random())}function MT(r){r!==void 0&&(pv=r);let e=pv+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function ST(r){return r*Rl}function wT(r){return r*so}function TT(r){return(r&r-1)===0&&r!==0}function AT(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function RT(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function CT(r,e,t,i,s){const l=Math.cos,u=Math.sin,f=l(t/2),d=u(t/2),h=l((e+i)/2),m=u((e+i)/2),g=l((e-i)/2),v=u((e-i)/2),b=l((i-e)/2),E=u((i-e)/2);switch(s){case"XYX":r.set(f*m,d*g,d*v,f*h);break;case"YZY":r.set(d*v,f*m,d*g,f*h);break;case"ZXZ":r.set(d*g,d*v,f*m,f*h);break;case"XZX":r.set(f*m,d*E,d*b,f*h);break;case"YXY":r.set(d*b,f*m,d*E,f*h);break;case"ZYZ":r.set(d*E,d*b,f*m,f*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ui(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Ft(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const It={DEG2RAD:Rl,RAD2DEG:so,generateUUID:Ii,clamp:yt,euclideanModulo:rm,mapLinear:pT,inverseLerp:mT,lerp:Cl,damp:gT,pingpong:_T,smoothstep:vT,smootherstep:yT,randInt:bT,randFloat:xT,randFloatSpread:ET,seededRandom:MT,degToRad:ST,radToDeg:wT,isPowerOfTwo:TT,ceilPowerOfTwo:AT,floorPowerOfTwo:RT,setQuaternionFromProperEuler:CT,normalize:Ft,denormalize:Ui};class Ct{constructor(e=0,t=0){Ct.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=yt(this.x,e.x,t.x),this.y=yt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=yt(this.x,e,t),this.y=yt(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(yt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(yt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),l=this.x-e.x,u=this.y-e.y;return this.x=l*i-u*s+e.x,this.y=l*s+u*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class dt{constructor(e,t,i,s,l,u,f,d,h){dt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,l,u,f,d,h)}set(e,t,i,s,l,u,f,d,h){const m=this.elements;return m[0]=e,m[1]=s,m[2]=f,m[3]=t,m[4]=l,m[5]=d,m[6]=i,m[7]=u,m[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,l=this.elements,u=i[0],f=i[3],d=i[6],h=i[1],m=i[4],g=i[7],v=i[2],b=i[5],E=i[8],S=s[0],x=s[3],y=s[6],T=s[1],N=s[4],A=s[7],P=s[2],F=s[5],k=s[8];return l[0]=u*S+f*T+d*P,l[3]=u*x+f*N+d*F,l[6]=u*y+f*A+d*k,l[1]=h*S+m*T+g*P,l[4]=h*x+m*N+g*F,l[7]=h*y+m*A+g*k,l[2]=v*S+b*T+E*P,l[5]=v*x+b*N+E*F,l[8]=v*y+b*A+E*k,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],l=e[3],u=e[4],f=e[5],d=e[6],h=e[7],m=e[8];return t*u*m-t*f*h-i*l*m+i*f*d+s*l*h-s*u*d}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],l=e[3],u=e[4],f=e[5],d=e[6],h=e[7],m=e[8],g=m*u-f*h,v=f*d-m*l,b=h*l-u*d,E=t*g+i*v+s*b;if(E===0)return this.set(0,0,0,0,0,0,0,0,0);const S=1/E;return e[0]=g*S,e[1]=(s*h-m*i)*S,e[2]=(f*i-s*u)*S,e[3]=v*S,e[4]=(m*t-s*d)*S,e[5]=(s*l-f*t)*S,e[6]=b*S,e[7]=(i*d-h*t)*S,e[8]=(u*t-i*l)*S,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,l,u,f){const d=Math.cos(l),h=Math.sin(l);return this.set(i*d,i*h,-i*(d*u+h*f)+u+e,-s*h,s*d,-s*(-h*u+d*f)+f+t,0,0,1),this}scale(e,t){return this.premultiply(ch.makeScale(e,t)),this}rotate(e){return this.premultiply(ch.makeRotation(-e)),this}translate(e,t){return this.premultiply(ch.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ch=new dt;function Sb(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function Ol(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function DT(){const r=Ol("canvas");return r.style.display="block",r}const mv={};function qr(r){r in mv||(mv[r]=!0,console.warn(r))}function NT(r,e,t){return new Promise(function(i,s){function l(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:s();break;case r.TIMEOUT_EXPIRED:setTimeout(l,t);break;default:i()}}setTimeout(l,t)})}function LT(r){const e=r.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function UT(r){const e=r.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const gv=new dt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),_v=new dt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function PT(){const r={enabled:!0,workingColorSpace:jn,spaces:{},convert:function(s,l,u){return this.enabled===!1||l===u||!l||!u||(this.spaces[l].transfer===Xt&&(s.r=Ca(s.r),s.g=Ca(s.g),s.b=Ca(s.b)),this.spaces[l].primaries!==this.spaces[u].primaries&&(s.applyMatrix3(this.spaces[l].toXYZ),s.applyMatrix3(this.spaces[u].fromXYZ)),this.spaces[u].transfer===Xt&&(s.r=Qs(s.r),s.g=Qs(s.g),s.b=Qs(s.b))),s},fromWorkingColorSpace:function(s,l){return this.convert(s,this.workingColorSpace,l)},toWorkingColorSpace:function(s,l){return this.convert(s,l,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===lr?ku:this.spaces[s].transfer},getLuminanceCoefficients:function(s,l=this.workingColorSpace){return s.fromArray(this.spaces[l].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,l,u){return s.copy(this.spaces[l].toXYZ).multiply(this.spaces[u].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return r.define({[jn]:{primaries:e,whitePoint:i,transfer:ku,toXYZ:gv,fromXYZ:_v,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Dn},outputColorSpaceConfig:{drawingBufferColorSpace:Dn}},[Dn]:{primaries:e,whitePoint:i,transfer:Xt,toXYZ:gv,fromXYZ:_v,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Dn}}}),r}const Rt=PT();function Ca(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Qs(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Ps;class OT{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ps===void 0&&(Ps=Ol("canvas")),Ps.width=e.width,Ps.height=e.height;const i=Ps.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Ps}return t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ol("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),l=s.data;for(let u=0;u<l.length;u++)l[u]=Ca(l[u]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Ca(t[i]/255)*255):t[i]=Ca(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let IT=0;class sm{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:IT++}),this.uuid=Ii(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let l;if(Array.isArray(s)){l=[];for(let u=0,f=s.length;u<f;u++)s[u].isDataTexture?l.push(uh(s[u].image)):l.push(uh(s[u]))}else l=uh(s);i.url=l}return t||(e.images[this.uuid]=i),i}}function uh(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?OT.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let FT=0;class wn extends mo{constructor(e=wn.DEFAULT_IMAGE,t=wn.DEFAULT_MAPPING,i=cr,s=cr,l=ci,u=wa,f=Mi,d=La,h=wn.DEFAULT_ANISOTROPY,m=lr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:FT++}),this.uuid=Ii(),this.name="",this.source=new sm(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=l,this.minFilter=u,this.anisotropy=h,this.format=f,this.internalFormat=null,this.type=d,this.offset=new Ct(0,0),this.repeat=new Ct(1,1),this.center=new Ct(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new dt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=m,this.userData={},this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ub)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case io:e.x=e.x-Math.floor(e.x);break;case cr:e.x=e.x<0?0:1;break;case zu:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case io:e.y=e.y-Math.floor(e.y);break;case cr:e.y=e.y<0?0:1;break;case zu:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}wn.DEFAULT_IMAGE=null;wn.DEFAULT_MAPPING=ub;wn.DEFAULT_ANISOTROPY=1;class Ot{constructor(e=0,t=0,i=0,s=1){Ot.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,l=this.w,u=e.elements;return this.x=u[0]*t+u[4]*i+u[8]*s+u[12]*l,this.y=u[1]*t+u[5]*i+u[9]*s+u[13]*l,this.z=u[2]*t+u[6]*i+u[10]*s+u[14]*l,this.w=u[3]*t+u[7]*i+u[11]*s+u[15]*l,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,l;const d=e.elements,h=d[0],m=d[4],g=d[8],v=d[1],b=d[5],E=d[9],S=d[2],x=d[6],y=d[10];if(Math.abs(m-v)<.01&&Math.abs(g-S)<.01&&Math.abs(E-x)<.01){if(Math.abs(m+v)<.1&&Math.abs(g+S)<.1&&Math.abs(E+x)<.1&&Math.abs(h+b+y-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const N=(h+1)/2,A=(b+1)/2,P=(y+1)/2,F=(m+v)/4,k=(g+S)/4,z=(E+x)/4;return N>A&&N>P?N<.01?(i=0,s=.707106781,l=.707106781):(i=Math.sqrt(N),s=F/i,l=k/i):A>P?A<.01?(i=.707106781,s=0,l=.707106781):(s=Math.sqrt(A),i=F/s,l=z/s):P<.01?(i=.707106781,s=.707106781,l=0):(l=Math.sqrt(P),i=k/l,s=z/l),this.set(i,s,l,t),this}let T=Math.sqrt((x-E)*(x-E)+(g-S)*(g-S)+(v-m)*(v-m));return Math.abs(T)<.001&&(T=1),this.x=(x-E)/T,this.y=(g-S)/T,this.z=(v-m)/T,this.w=Math.acos((h+b+y-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=yt(this.x,e.x,t.x),this.y=yt(this.y,e.y,t.y),this.z=yt(this.z,e.z,t.z),this.w=yt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=yt(this.x,e,t),this.y=yt(this.y,e,t),this.z=yt(this.z,e,t),this.w=yt(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(yt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class BT extends mo{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Ot(0,0,e,t),this.scissorTest=!1,this.viewport=new Ot(0,0,e,t);const s={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ci,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const l=new wn(s,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);l.flipY=!1,l.generateMipmaps=i.generateMipmaps,l.internalFormat=i.internalFormat,this.textures=[];const u=i.count;for(let f=0;f<u;f++)this.textures[f]=l.clone(),this.textures[f].isRenderTargetTexture=!0,this.textures[f].renderTarget=this;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,l=this.textures.length;s<l;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new sm(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Jr extends BT{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class wb extends wn{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=qn,this.minFilter=qn,this.wrapR=cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class zT extends wn{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=qn,this.minFilter=qn,this.wrapR=cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class mr{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,l,u,f){let d=i[s+0],h=i[s+1],m=i[s+2],g=i[s+3];const v=l[u+0],b=l[u+1],E=l[u+2],S=l[u+3];if(f===0){e[t+0]=d,e[t+1]=h,e[t+2]=m,e[t+3]=g;return}if(f===1){e[t+0]=v,e[t+1]=b,e[t+2]=E,e[t+3]=S;return}if(g!==S||d!==v||h!==b||m!==E){let x=1-f;const y=d*v+h*b+m*E+g*S,T=y>=0?1:-1,N=1-y*y;if(N>Number.EPSILON){const P=Math.sqrt(N),F=Math.atan2(P,y*T);x=Math.sin(x*F)/P,f=Math.sin(f*F)/P}const A=f*T;if(d=d*x+v*A,h=h*x+b*A,m=m*x+E*A,g=g*x+S*A,x===1-f){const P=1/Math.sqrt(d*d+h*h+m*m+g*g);d*=P,h*=P,m*=P,g*=P}}e[t]=d,e[t+1]=h,e[t+2]=m,e[t+3]=g}static multiplyQuaternionsFlat(e,t,i,s,l,u){const f=i[s],d=i[s+1],h=i[s+2],m=i[s+3],g=l[u],v=l[u+1],b=l[u+2],E=l[u+3];return e[t]=f*E+m*g+d*b-h*v,e[t+1]=d*E+m*v+h*g-f*b,e[t+2]=h*E+m*b+f*v-d*g,e[t+3]=m*E-f*g-d*v-h*b,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,l=e._z,u=e._order,f=Math.cos,d=Math.sin,h=f(i/2),m=f(s/2),g=f(l/2),v=d(i/2),b=d(s/2),E=d(l/2);switch(u){case"XYZ":this._x=v*m*g+h*b*E,this._y=h*b*g-v*m*E,this._z=h*m*E+v*b*g,this._w=h*m*g-v*b*E;break;case"YXZ":this._x=v*m*g+h*b*E,this._y=h*b*g-v*m*E,this._z=h*m*E-v*b*g,this._w=h*m*g+v*b*E;break;case"ZXY":this._x=v*m*g-h*b*E,this._y=h*b*g+v*m*E,this._z=h*m*E+v*b*g,this._w=h*m*g-v*b*E;break;case"ZYX":this._x=v*m*g-h*b*E,this._y=h*b*g+v*m*E,this._z=h*m*E-v*b*g,this._w=h*m*g+v*b*E;break;case"YZX":this._x=v*m*g+h*b*E,this._y=h*b*g+v*m*E,this._z=h*m*E-v*b*g,this._w=h*m*g-v*b*E;break;case"XZY":this._x=v*m*g-h*b*E,this._y=h*b*g-v*m*E,this._z=h*m*E+v*b*g,this._w=h*m*g+v*b*E;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+u)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],l=t[8],u=t[1],f=t[5],d=t[9],h=t[2],m=t[6],g=t[10],v=i+f+g;if(v>0){const b=.5/Math.sqrt(v+1);this._w=.25/b,this._x=(m-d)*b,this._y=(l-h)*b,this._z=(u-s)*b}else if(i>f&&i>g){const b=2*Math.sqrt(1+i-f-g);this._w=(m-d)/b,this._x=.25*b,this._y=(s+u)/b,this._z=(l+h)/b}else if(f>g){const b=2*Math.sqrt(1+f-i-g);this._w=(l-h)/b,this._x=(s+u)/b,this._y=.25*b,this._z=(d+m)/b}else{const b=2*Math.sqrt(1+g-i-f);this._w=(u-s)/b,this._x=(l+h)/b,this._y=(d+m)/b,this._z=.25*b}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(yt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,l=e._z,u=e._w,f=t._x,d=t._y,h=t._z,m=t._w;return this._x=i*m+u*f+s*h-l*d,this._y=s*m+u*d+l*f-i*h,this._z=l*m+u*h+i*d-s*f,this._w=u*m-i*f-s*d-l*h,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,s=this._y,l=this._z,u=this._w;let f=u*e._w+i*e._x+s*e._y+l*e._z;if(f<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,f=-f):this.copy(e),f>=1)return this._w=u,this._x=i,this._y=s,this._z=l,this;const d=1-f*f;if(d<=Number.EPSILON){const b=1-t;return this._w=b*u+t*this._w,this._x=b*i+t*this._x,this._y=b*s+t*this._y,this._z=b*l+t*this._z,this.normalize(),this}const h=Math.sqrt(d),m=Math.atan2(h,f),g=Math.sin((1-t)*m)/h,v=Math.sin(t*m)/h;return this._w=u*g+this._w*v,this._x=i*g+this._x*v,this._y=s*g+this._y*v,this._z=l*g+this._z*v,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),l=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),l*Math.sin(t),l*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class X{constructor(e=0,t=0,i=0){X.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(vv.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(vv.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,l=e.elements;return this.x=l[0]*t+l[3]*i+l[6]*s,this.y=l[1]*t+l[4]*i+l[7]*s,this.z=l[2]*t+l[5]*i+l[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,l=e.elements,u=1/(l[3]*t+l[7]*i+l[11]*s+l[15]);return this.x=(l[0]*t+l[4]*i+l[8]*s+l[12])*u,this.y=(l[1]*t+l[5]*i+l[9]*s+l[13])*u,this.z=(l[2]*t+l[6]*i+l[10]*s+l[14])*u,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,l=e.x,u=e.y,f=e.z,d=e.w,h=2*(u*s-f*i),m=2*(f*t-l*s),g=2*(l*i-u*t);return this.x=t+d*h+u*g-f*m,this.y=i+d*m+f*h-l*g,this.z=s+d*g+l*m-u*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,l=e.elements;return this.x=l[0]*t+l[4]*i+l[8]*s,this.y=l[1]*t+l[5]*i+l[9]*s,this.z=l[2]*t+l[6]*i+l[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=yt(this.x,e.x,t.x),this.y=yt(this.y,e.y,t.y),this.z=yt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=yt(this.x,e,t),this.y=yt(this.y,e,t),this.z=yt(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(yt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,l=e.z,u=t.x,f=t.y,d=t.z;return this.x=s*d-l*f,this.y=l*u-i*d,this.z=i*f-s*u,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return fh.copy(this).projectOnVector(e),this.sub(fh)}reflect(e){return this.sub(fh.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(yt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const fh=new X,vv=new mr;class Ua{constructor(e=new X(1/0,1/0,1/0),t=new X(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Di.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Di.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Di.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const l=i.getAttribute("position");if(t===!0&&l!==void 0&&e.isInstancedMesh!==!0)for(let u=0,f=l.count;u<f;u++)e.isMesh===!0?e.getVertexPosition(u,Di):Di.fromBufferAttribute(l,u),Di.applyMatrix4(e.matrixWorld),this.expandByPoint(Di);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Jc.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Jc.copy(i.boundingBox)),Jc.applyMatrix4(e.matrixWorld),this.union(Jc)}const s=e.children;for(let l=0,u=s.length;l<u;l++)this.expandByObject(s[l],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Di),Di.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(_l),eu.subVectors(this.max,_l),Os.subVectors(e.a,_l),Is.subVectors(e.b,_l),Fs.subVectors(e.c,_l),tr.subVectors(Is,Os),nr.subVectors(Fs,Is),Ir.subVectors(Os,Fs);let t=[0,-tr.z,tr.y,0,-nr.z,nr.y,0,-Ir.z,Ir.y,tr.z,0,-tr.x,nr.z,0,-nr.x,Ir.z,0,-Ir.x,-tr.y,tr.x,0,-nr.y,nr.x,0,-Ir.y,Ir.x,0];return!dh(t,Os,Is,Fs,eu)||(t=[1,0,0,0,1,0,0,0,1],!dh(t,Os,Is,Fs,eu))?!1:(tu.crossVectors(tr,nr),t=[tu.x,tu.y,tu.z],dh(t,Os,Is,Fs,eu))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Di).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Di).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(_a[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),_a[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),_a[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),_a[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),_a[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),_a[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),_a[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),_a[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(_a),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const _a=[new X,new X,new X,new X,new X,new X,new X,new X],Di=new X,Jc=new Ua,Os=new X,Is=new X,Fs=new X,tr=new X,nr=new X,Ir=new X,_l=new X,eu=new X,tu=new X,Fr=new X;function dh(r,e,t,i,s){for(let l=0,u=r.length-3;l<=u;l+=3){Fr.fromArray(r,l);const f=s.x*Math.abs(Fr.x)+s.y*Math.abs(Fr.y)+s.z*Math.abs(Fr.z),d=e.dot(Fr),h=t.dot(Fr),m=i.dot(Fr);if(Math.max(-Math.max(d,h,m),Math.min(d,h,m))>f)return!1}return!0}const kT=new Ua,vl=new X,hh=new X;class $i{constructor(e=new X,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):kT.setFromPoints(e).getCenter(i);let s=0;for(let l=0,u=e.length;l<u;l++)s=Math.max(s,i.distanceToSquared(e[l]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;vl.subVectors(e,this.center);const t=vl.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(vl,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(hh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(vl.copy(e.center).add(hh)),this.expandByPoint(vl.copy(e.center).sub(hh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const va=new X,ph=new X,nu=new X,ir=new X,mh=new X,iu=new X,gh=new X;class Ku{constructor(e=new X,t=new X(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,va)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=va.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(va.copy(this.origin).addScaledVector(this.direction,t),va.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){ph.copy(e).add(t).multiplyScalar(.5),nu.copy(t).sub(e).normalize(),ir.copy(this.origin).sub(ph);const l=e.distanceTo(t)*.5,u=-this.direction.dot(nu),f=ir.dot(this.direction),d=-ir.dot(nu),h=ir.lengthSq(),m=Math.abs(1-u*u);let g,v,b,E;if(m>0)if(g=u*d-f,v=u*f-d,E=l*m,g>=0)if(v>=-E)if(v<=E){const S=1/m;g*=S,v*=S,b=g*(g+u*v+2*f)+v*(u*g+v+2*d)+h}else v=l,g=Math.max(0,-(u*v+f)),b=-g*g+v*(v+2*d)+h;else v=-l,g=Math.max(0,-(u*v+f)),b=-g*g+v*(v+2*d)+h;else v<=-E?(g=Math.max(0,-(-u*l+f)),v=g>0?-l:Math.min(Math.max(-l,-d),l),b=-g*g+v*(v+2*d)+h):v<=E?(g=0,v=Math.min(Math.max(-l,-d),l),b=v*(v+2*d)+h):(g=Math.max(0,-(u*l+f)),v=g>0?l:Math.min(Math.max(-l,-d),l),b=-g*g+v*(v+2*d)+h);else v=u>0?-l:l,g=Math.max(0,-(u*v+f)),b=-g*g+v*(v+2*d)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,g),s&&s.copy(ph).addScaledVector(nu,v),b}intersectSphere(e,t){va.subVectors(e.center,this.origin);const i=va.dot(this.direction),s=va.dot(va)-i*i,l=e.radius*e.radius;if(s>l)return null;const u=Math.sqrt(l-s),f=i-u,d=i+u;return d<0?null:f<0?this.at(d,t):this.at(f,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,l,u,f,d;const h=1/this.direction.x,m=1/this.direction.y,g=1/this.direction.z,v=this.origin;return h>=0?(i=(e.min.x-v.x)*h,s=(e.max.x-v.x)*h):(i=(e.max.x-v.x)*h,s=(e.min.x-v.x)*h),m>=0?(l=(e.min.y-v.y)*m,u=(e.max.y-v.y)*m):(l=(e.max.y-v.y)*m,u=(e.min.y-v.y)*m),i>u||l>s||((l>i||isNaN(i))&&(i=l),(u<s||isNaN(s))&&(s=u),g>=0?(f=(e.min.z-v.z)*g,d=(e.max.z-v.z)*g):(f=(e.max.z-v.z)*g,d=(e.min.z-v.z)*g),i>d||f>s)||((f>i||i!==i)&&(i=f),(d<s||s!==s)&&(s=d),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,va)!==null}intersectTriangle(e,t,i,s,l){mh.subVectors(t,e),iu.subVectors(i,e),gh.crossVectors(mh,iu);let u=this.direction.dot(gh),f;if(u>0){if(s)return null;f=1}else if(u<0)f=-1,u=-u;else return null;ir.subVectors(this.origin,e);const d=f*this.direction.dot(iu.crossVectors(ir,iu));if(d<0)return null;const h=f*this.direction.dot(mh.cross(ir));if(h<0||d+h>u)return null;const m=-f*ir.dot(gh);return m<0?null:this.at(m/u,l)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ht{constructor(e,t,i,s,l,u,f,d,h,m,g,v,b,E,S,x){ht.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,l,u,f,d,h,m,g,v,b,E,S,x)}set(e,t,i,s,l,u,f,d,h,m,g,v,b,E,S,x){const y=this.elements;return y[0]=e,y[4]=t,y[8]=i,y[12]=s,y[1]=l,y[5]=u,y[9]=f,y[13]=d,y[2]=h,y[6]=m,y[10]=g,y[14]=v,y[3]=b,y[7]=E,y[11]=S,y[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ht().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/Bs.setFromMatrixColumn(e,0).length(),l=1/Bs.setFromMatrixColumn(e,1).length(),u=1/Bs.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*l,t[5]=i[5]*l,t[6]=i[6]*l,t[7]=0,t[8]=i[8]*u,t[9]=i[9]*u,t[10]=i[10]*u,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,l=e.z,u=Math.cos(i),f=Math.sin(i),d=Math.cos(s),h=Math.sin(s),m=Math.cos(l),g=Math.sin(l);if(e.order==="XYZ"){const v=u*m,b=u*g,E=f*m,S=f*g;t[0]=d*m,t[4]=-d*g,t[8]=h,t[1]=b+E*h,t[5]=v-S*h,t[9]=-f*d,t[2]=S-v*h,t[6]=E+b*h,t[10]=u*d}else if(e.order==="YXZ"){const v=d*m,b=d*g,E=h*m,S=h*g;t[0]=v+S*f,t[4]=E*f-b,t[8]=u*h,t[1]=u*g,t[5]=u*m,t[9]=-f,t[2]=b*f-E,t[6]=S+v*f,t[10]=u*d}else if(e.order==="ZXY"){const v=d*m,b=d*g,E=h*m,S=h*g;t[0]=v-S*f,t[4]=-u*g,t[8]=E+b*f,t[1]=b+E*f,t[5]=u*m,t[9]=S-v*f,t[2]=-u*h,t[6]=f,t[10]=u*d}else if(e.order==="ZYX"){const v=u*m,b=u*g,E=f*m,S=f*g;t[0]=d*m,t[4]=E*h-b,t[8]=v*h+S,t[1]=d*g,t[5]=S*h+v,t[9]=b*h-E,t[2]=-h,t[6]=f*d,t[10]=u*d}else if(e.order==="YZX"){const v=u*d,b=u*h,E=f*d,S=f*h;t[0]=d*m,t[4]=S-v*g,t[8]=E*g+b,t[1]=g,t[5]=u*m,t[9]=-f*m,t[2]=-h*m,t[6]=b*g+E,t[10]=v-S*g}else if(e.order==="XZY"){const v=u*d,b=u*h,E=f*d,S=f*h;t[0]=d*m,t[4]=-g,t[8]=h*m,t[1]=v*g+S,t[5]=u*m,t[9]=b*g-E,t[2]=E*g-b,t[6]=f*m,t[10]=S*g+v}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(HT,e,VT)}lookAt(e,t,i){const s=this.elements;return oi.subVectors(e,t),oi.lengthSq()===0&&(oi.z=1),oi.normalize(),ar.crossVectors(i,oi),ar.lengthSq()===0&&(Math.abs(i.z)===1?oi.x+=1e-4:oi.z+=1e-4,oi.normalize(),ar.crossVectors(i,oi)),ar.normalize(),au.crossVectors(oi,ar),s[0]=ar.x,s[4]=au.x,s[8]=oi.x,s[1]=ar.y,s[5]=au.y,s[9]=oi.y,s[2]=ar.z,s[6]=au.z,s[10]=oi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,l=this.elements,u=i[0],f=i[4],d=i[8],h=i[12],m=i[1],g=i[5],v=i[9],b=i[13],E=i[2],S=i[6],x=i[10],y=i[14],T=i[3],N=i[7],A=i[11],P=i[15],F=s[0],k=s[4],z=s[8],R=s[12],C=s[1],H=s[5],J=s[9],K=s[13],ce=s[2],de=s[6],W=s[10],le=s[14],Y=s[3],ye=s[7],I=s[11],re=s[15];return l[0]=u*F+f*C+d*ce+h*Y,l[4]=u*k+f*H+d*de+h*ye,l[8]=u*z+f*J+d*W+h*I,l[12]=u*R+f*K+d*le+h*re,l[1]=m*F+g*C+v*ce+b*Y,l[5]=m*k+g*H+v*de+b*ye,l[9]=m*z+g*J+v*W+b*I,l[13]=m*R+g*K+v*le+b*re,l[2]=E*F+S*C+x*ce+y*Y,l[6]=E*k+S*H+x*de+y*ye,l[10]=E*z+S*J+x*W+y*I,l[14]=E*R+S*K+x*le+y*re,l[3]=T*F+N*C+A*ce+P*Y,l[7]=T*k+N*H+A*de+P*ye,l[11]=T*z+N*J+A*W+P*I,l[15]=T*R+N*K+A*le+P*re,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],l=e[12],u=e[1],f=e[5],d=e[9],h=e[13],m=e[2],g=e[6],v=e[10],b=e[14],E=e[3],S=e[7],x=e[11],y=e[15];return E*(+l*d*g-s*h*g-l*f*v+i*h*v+s*f*b-i*d*b)+S*(+t*d*b-t*h*v+l*u*v-s*u*b+s*h*m-l*d*m)+x*(+t*h*g-t*f*b-l*u*g+i*u*b+l*f*m-i*h*m)+y*(-s*f*m-t*d*g+t*f*v+s*u*g-i*u*v+i*d*m)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],l=e[3],u=e[4],f=e[5],d=e[6],h=e[7],m=e[8],g=e[9],v=e[10],b=e[11],E=e[12],S=e[13],x=e[14],y=e[15],T=g*x*h-S*v*h+S*d*b-f*x*b-g*d*y+f*v*y,N=E*v*h-m*x*h-E*d*b+u*x*b+m*d*y-u*v*y,A=m*S*h-E*g*h+E*f*b-u*S*b-m*f*y+u*g*y,P=E*g*d-m*S*d-E*f*v+u*S*v+m*f*x-u*g*x,F=t*T+i*N+s*A+l*P;if(F===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const k=1/F;return e[0]=T*k,e[1]=(S*v*l-g*x*l-S*s*b+i*x*b+g*s*y-i*v*y)*k,e[2]=(f*x*l-S*d*l+S*s*h-i*x*h-f*s*y+i*d*y)*k,e[3]=(g*d*l-f*v*l-g*s*h+i*v*h+f*s*b-i*d*b)*k,e[4]=N*k,e[5]=(m*x*l-E*v*l+E*s*b-t*x*b-m*s*y+t*v*y)*k,e[6]=(E*d*l-u*x*l-E*s*h+t*x*h+u*s*y-t*d*y)*k,e[7]=(u*v*l-m*d*l+m*s*h-t*v*h-u*s*b+t*d*b)*k,e[8]=A*k,e[9]=(E*g*l-m*S*l-E*i*b+t*S*b+m*i*y-t*g*y)*k,e[10]=(u*S*l-E*f*l+E*i*h-t*S*h-u*i*y+t*f*y)*k,e[11]=(m*f*l-u*g*l-m*i*h+t*g*h+u*i*b-t*f*b)*k,e[12]=P*k,e[13]=(m*S*s-E*g*s+E*i*v-t*S*v-m*i*x+t*g*x)*k,e[14]=(E*f*s-u*S*s-E*i*d+t*S*d+u*i*x-t*f*x)*k,e[15]=(u*g*s-m*f*s+m*i*d-t*g*d-u*i*v+t*f*v)*k,this}scale(e){const t=this.elements,i=e.x,s=e.y,l=e.z;return t[0]*=i,t[4]*=s,t[8]*=l,t[1]*=i,t[5]*=s,t[9]*=l,t[2]*=i,t[6]*=s,t[10]*=l,t[3]*=i,t[7]*=s,t[11]*=l,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),l=1-i,u=e.x,f=e.y,d=e.z,h=l*u,m=l*f;return this.set(h*u+i,h*f-s*d,h*d+s*f,0,h*f+s*d,m*f+i,m*d-s*u,0,h*d-s*f,m*d+s*u,l*d*d+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,l,u){return this.set(1,i,l,0,e,1,u,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,l=t._x,u=t._y,f=t._z,d=t._w,h=l+l,m=u+u,g=f+f,v=l*h,b=l*m,E=l*g,S=u*m,x=u*g,y=f*g,T=d*h,N=d*m,A=d*g,P=i.x,F=i.y,k=i.z;return s[0]=(1-(S+y))*P,s[1]=(b+A)*P,s[2]=(E-N)*P,s[3]=0,s[4]=(b-A)*F,s[5]=(1-(v+y))*F,s[6]=(x+T)*F,s[7]=0,s[8]=(E+N)*k,s[9]=(x-T)*k,s[10]=(1-(v+S))*k,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let l=Bs.set(s[0],s[1],s[2]).length();const u=Bs.set(s[4],s[5],s[6]).length(),f=Bs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(l=-l),e.x=s[12],e.y=s[13],e.z=s[14],Ni.copy(this);const h=1/l,m=1/u,g=1/f;return Ni.elements[0]*=h,Ni.elements[1]*=h,Ni.elements[2]*=h,Ni.elements[4]*=m,Ni.elements[5]*=m,Ni.elements[6]*=m,Ni.elements[8]*=g,Ni.elements[9]*=g,Ni.elements[10]*=g,t.setFromRotationMatrix(Ni),i.x=l,i.y=u,i.z=f,this}makePerspective(e,t,i,s,l,u,f=Ta){const d=this.elements,h=2*l/(t-e),m=2*l/(i-s),g=(t+e)/(t-e),v=(i+s)/(i-s);let b,E;if(f===Ta)b=-(u+l)/(u-l),E=-2*u*l/(u-l);else if(f===Hu)b=-u/(u-l),E=-u*l/(u-l);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+f);return d[0]=h,d[4]=0,d[8]=g,d[12]=0,d[1]=0,d[5]=m,d[9]=v,d[13]=0,d[2]=0,d[6]=0,d[10]=b,d[14]=E,d[3]=0,d[7]=0,d[11]=-1,d[15]=0,this}makeOrthographic(e,t,i,s,l,u,f=Ta){const d=this.elements,h=1/(t-e),m=1/(i-s),g=1/(u-l),v=(t+e)*h,b=(i+s)*m;let E,S;if(f===Ta)E=(u+l)*g,S=-2*g;else if(f===Hu)E=l*g,S=-1*g;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+f);return d[0]=2*h,d[4]=0,d[8]=0,d[12]=-v,d[1]=0,d[5]=2*m,d[9]=0,d[13]=-b,d[2]=0,d[6]=0,d[10]=S,d[14]=-E,d[3]=0,d[7]=0,d[11]=0,d[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Bs=new X,Ni=new ht,HT=new X(0,0,0),VT=new X(1,1,1),ar=new X,au=new X,oi=new X,yv=new ht,bv=new mr;class Ki{constructor(e=0,t=0,i=0,s=Ki.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,l=s[0],u=s[4],f=s[8],d=s[1],h=s[5],m=s[9],g=s[2],v=s[6],b=s[10];switch(t){case"XYZ":this._y=Math.asin(yt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(-m,b),this._z=Math.atan2(-u,l)):(this._x=Math.atan2(v,h),this._z=0);break;case"YXZ":this._x=Math.asin(-yt(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(f,b),this._z=Math.atan2(d,h)):(this._y=Math.atan2(-g,l),this._z=0);break;case"ZXY":this._x=Math.asin(yt(v,-1,1)),Math.abs(v)<.9999999?(this._y=Math.atan2(-g,b),this._z=Math.atan2(-u,h)):(this._y=0,this._z=Math.atan2(d,l));break;case"ZYX":this._y=Math.asin(-yt(g,-1,1)),Math.abs(g)<.9999999?(this._x=Math.atan2(v,b),this._z=Math.atan2(d,l)):(this._x=0,this._z=Math.atan2(-u,h));break;case"YZX":this._z=Math.asin(yt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-m,h),this._y=Math.atan2(-g,l)):(this._x=0,this._y=Math.atan2(f,b));break;case"XZY":this._z=Math.asin(-yt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(v,h),this._y=Math.atan2(f,l)):(this._x=Math.atan2(-m,b),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return yv.makeRotationFromQuaternion(e),this.setFromRotationMatrix(yv,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return bv.setFromEuler(this),this.setFromQuaternion(bv,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ki.DEFAULT_ORDER="XYZ";class Tb{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let GT=0;const xv=new X,zs=new mr,ya=new ht,ru=new X,yl=new X,WT=new X,XT=new mr,Ev=new X(1,0,0),Mv=new X(0,1,0),Sv=new X(0,0,1),wv={type:"added"},qT={type:"removed"},ks={type:"childadded",child:null},_h={type:"childremoved",child:null};class en extends mo{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:GT++}),this.uuid=Ii(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=en.DEFAULT_UP.clone();const e=new X,t=new Ki,i=new mr,s=new X(1,1,1);function l(){i.setFromEuler(t,!1)}function u(){t.setFromQuaternion(i,void 0,!1)}t._onChange(l),i._onChange(u),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ht},normalMatrix:{value:new dt}}),this.matrix=new ht,this.matrixWorld=new ht,this.matrixAutoUpdate=en.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=en.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Tb,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return zs.setFromAxisAngle(e,t),this.quaternion.multiply(zs),this}rotateOnWorldAxis(e,t){return zs.setFromAxisAngle(e,t),this.quaternion.premultiply(zs),this}rotateX(e){return this.rotateOnAxis(Ev,e)}rotateY(e){return this.rotateOnAxis(Mv,e)}rotateZ(e){return this.rotateOnAxis(Sv,e)}translateOnAxis(e,t){return xv.copy(e).applyQuaternion(this.quaternion),this.position.add(xv.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ev,e)}translateY(e){return this.translateOnAxis(Mv,e)}translateZ(e){return this.translateOnAxis(Sv,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ya.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?ru.copy(e):ru.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),yl.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ya.lookAt(yl,ru,this.up):ya.lookAt(ru,yl,this.up),this.quaternion.setFromRotationMatrix(ya),s&&(ya.extractRotation(s.matrixWorld),zs.setFromRotationMatrix(ya),this.quaternion.premultiply(zs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(wv),ks.child=e,this.dispatchEvent(ks),ks.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(qT),_h.child=e,this.dispatchEvent(_h),_h.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ya.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ya.multiply(e.parent.matrixWorld)),e.applyMatrix4(ya),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(wv),ks.child=e,this.dispatchEvent(ks),ks.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const u=this.children[i].getObjectByProperty(e,t);if(u!==void 0)return u}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let l=0,u=s.length;l<u;l++)s[l].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(yl,e,WT),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(yl,XT,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let l=0,u=s.length;l<u;l++)s[l].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(f=>({boxInitialized:f.boxInitialized,boxMin:f.box.min.toArray(),boxMax:f.box.max.toArray(),sphereInitialized:f.sphereInitialized,sphereRadius:f.sphere.radius,sphereCenter:f.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function l(f,d){return f[d.uuid]===void 0&&(f[d.uuid]=d.toJSON(e)),d.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=l(e.geometries,this.geometry);const f=this.geometry.parameters;if(f!==void 0&&f.shapes!==void 0){const d=f.shapes;if(Array.isArray(d))for(let h=0,m=d.length;h<m;h++){const g=d[h];l(e.shapes,g)}else l(e.shapes,d)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(l(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const f=[];for(let d=0,h=this.material.length;d<h;d++)f.push(l(e.materials,this.material[d]));s.material=f}else s.material=l(e.materials,this.material);if(this.children.length>0){s.children=[];for(let f=0;f<this.children.length;f++)s.children.push(this.children[f].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let f=0;f<this.animations.length;f++){const d=this.animations[f];s.animations.push(l(e.animations,d))}}if(t){const f=u(e.geometries),d=u(e.materials),h=u(e.textures),m=u(e.images),g=u(e.shapes),v=u(e.skeletons),b=u(e.animations),E=u(e.nodes);f.length>0&&(i.geometries=f),d.length>0&&(i.materials=d),h.length>0&&(i.textures=h),m.length>0&&(i.images=m),g.length>0&&(i.shapes=g),v.length>0&&(i.skeletons=v),b.length>0&&(i.animations=b),E.length>0&&(i.nodes=E)}return i.object=s,i;function u(f){const d=[];for(const h in f){const m=f[h];delete m.metadata,d.push(m)}return d}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}en.DEFAULT_UP=new X(0,1,0);en.DEFAULT_MATRIX_AUTO_UPDATE=!0;en.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Li=new X,ba=new X,vh=new X,xa=new X,Hs=new X,Vs=new X,Tv=new X,yh=new X,bh=new X,xh=new X,Eh=new Ot,Mh=new Ot,Sh=new Ot;class Pi{constructor(e=new X,t=new X,i=new X){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Li.subVectors(e,t),s.cross(Li);const l=s.lengthSq();return l>0?s.multiplyScalar(1/Math.sqrt(l)):s.set(0,0,0)}static getBarycoord(e,t,i,s,l){Li.subVectors(s,t),ba.subVectors(i,t),vh.subVectors(e,t);const u=Li.dot(Li),f=Li.dot(ba),d=Li.dot(vh),h=ba.dot(ba),m=ba.dot(vh),g=u*h-f*f;if(g===0)return l.set(0,0,0),null;const v=1/g,b=(h*d-f*m)*v,E=(u*m-f*d)*v;return l.set(1-b-E,E,b)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,xa)===null?!1:xa.x>=0&&xa.y>=0&&xa.x+xa.y<=1}static getInterpolation(e,t,i,s,l,u,f,d){return this.getBarycoord(e,t,i,s,xa)===null?(d.x=0,d.y=0,"z"in d&&(d.z=0),"w"in d&&(d.w=0),null):(d.setScalar(0),d.addScaledVector(l,xa.x),d.addScaledVector(u,xa.y),d.addScaledVector(f,xa.z),d)}static getInterpolatedAttribute(e,t,i,s,l,u){return Eh.setScalar(0),Mh.setScalar(0),Sh.setScalar(0),Eh.fromBufferAttribute(e,t),Mh.fromBufferAttribute(e,i),Sh.fromBufferAttribute(e,s),u.setScalar(0),u.addScaledVector(Eh,l.x),u.addScaledVector(Mh,l.y),u.addScaledVector(Sh,l.z),u}static isFrontFacing(e,t,i,s){return Li.subVectors(i,t),ba.subVectors(e,t),Li.cross(ba).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Li.subVectors(this.c,this.b),ba.subVectors(this.a,this.b),Li.cross(ba).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Pi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Pi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,l){return Pi.getInterpolation(e,this.a,this.b,this.c,t,i,s,l)}containsPoint(e){return Pi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Pi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,l=this.c;let u,f;Hs.subVectors(s,i),Vs.subVectors(l,i),yh.subVectors(e,i);const d=Hs.dot(yh),h=Vs.dot(yh);if(d<=0&&h<=0)return t.copy(i);bh.subVectors(e,s);const m=Hs.dot(bh),g=Vs.dot(bh);if(m>=0&&g<=m)return t.copy(s);const v=d*g-m*h;if(v<=0&&d>=0&&m<=0)return u=d/(d-m),t.copy(i).addScaledVector(Hs,u);xh.subVectors(e,l);const b=Hs.dot(xh),E=Vs.dot(xh);if(E>=0&&b<=E)return t.copy(l);const S=b*h-d*E;if(S<=0&&h>=0&&E<=0)return f=h/(h-E),t.copy(i).addScaledVector(Vs,f);const x=m*E-b*g;if(x<=0&&g-m>=0&&b-E>=0)return Tv.subVectors(l,s),f=(g-m)/(g-m+(b-E)),t.copy(s).addScaledVector(Tv,f);const y=1/(x+S+v);return u=S*y,f=v*y,t.copy(i).addScaledVector(Hs,u).addScaledVector(Vs,f)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Ab={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},rr={h:0,s:0,l:0},su={h:0,s:0,l:0};function wh(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}class lt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Dn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Rt.toWorkingColorSpace(this,t),this}setRGB(e,t,i,s=Rt.workingColorSpace){return this.r=e,this.g=t,this.b=i,Rt.toWorkingColorSpace(this,s),this}setHSL(e,t,i,s=Rt.workingColorSpace){if(e=rm(e,1),t=yt(t,0,1),i=yt(i,0,1),t===0)this.r=this.g=this.b=i;else{const l=i<=.5?i*(1+t):i+t-i*t,u=2*i-l;this.r=wh(u,l,e+1/3),this.g=wh(u,l,e),this.b=wh(u,l,e-1/3)}return Rt.toWorkingColorSpace(this,s),this}setStyle(e,t=Dn){function i(l){l!==void 0&&parseFloat(l)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let l;const u=s[1],f=s[2];switch(u){case"rgb":case"rgba":if(l=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return i(l[4]),this.setRGB(Math.min(255,parseInt(l[1],10))/255,Math.min(255,parseInt(l[2],10))/255,Math.min(255,parseInt(l[3],10))/255,t);if(l=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return i(l[4]),this.setRGB(Math.min(100,parseInt(l[1],10))/100,Math.min(100,parseInt(l[2],10))/100,Math.min(100,parseInt(l[3],10))/100,t);break;case"hsl":case"hsla":if(l=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return i(l[4]),this.setHSL(parseFloat(l[1])/360,parseFloat(l[2])/100,parseFloat(l[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const l=s[1],u=l.length;if(u===3)return this.setRGB(parseInt(l.charAt(0),16)/15,parseInt(l.charAt(1),16)/15,parseInt(l.charAt(2),16)/15,t);if(u===6)return this.setHex(parseInt(l,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Dn){const i=Ab[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ca(e.r),this.g=Ca(e.g),this.b=Ca(e.b),this}copyLinearToSRGB(e){return this.r=Qs(e.r),this.g=Qs(e.g),this.b=Qs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Dn){return Rt.fromWorkingColorSpace(On.copy(this),e),Math.round(yt(On.r*255,0,255))*65536+Math.round(yt(On.g*255,0,255))*256+Math.round(yt(On.b*255,0,255))}getHexString(e=Dn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Rt.workingColorSpace){Rt.fromWorkingColorSpace(On.copy(this),t);const i=On.r,s=On.g,l=On.b,u=Math.max(i,s,l),f=Math.min(i,s,l);let d,h;const m=(f+u)/2;if(f===u)d=0,h=0;else{const g=u-f;switch(h=m<=.5?g/(u+f):g/(2-u-f),u){case i:d=(s-l)/g+(s<l?6:0);break;case s:d=(l-i)/g+2;break;case l:d=(i-s)/g+4;break}d/=6}return e.h=d,e.s=h,e.l=m,e}getRGB(e,t=Rt.workingColorSpace){return Rt.fromWorkingColorSpace(On.copy(this),t),e.r=On.r,e.g=On.g,e.b=On.b,e}getStyle(e=Dn){Rt.fromWorkingColorSpace(On.copy(this),e);const t=On.r,i=On.g,s=On.b;return e!==Dn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(rr),this.setHSL(rr.h+e,rr.s+t,rr.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(rr),e.getHSL(su);const i=Cl(rr.h,su.h,t),s=Cl(rr.s,su.s,t),l=Cl(rr.l,su.l,t);return this.setHSL(i,s,l),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,l=e.elements;return this.r=l[0]*t+l[3]*i+l[6]*s,this.g=l[1]*t+l[4]*i+l[7]*s,this.b=l[2]*t+l[5]*i+l[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const On=new lt;lt.NAMES=Ab;let YT=0;class ji extends mo{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:YT++}),this.uuid=Ii(),this.name="",this.type="Material",this.blending=Zs,this.side=Na,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Yh,this.blendDst=jh,this.blendEquation=Kr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new lt(0,0,0),this.blendAlpha=0,this.depthFunc=eo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=dv,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Us,this.stencilZFail=Us,this.stencilZPass=Us,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Zs&&(i.blending=this.blending),this.side!==Na&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Yh&&(i.blendSrc=this.blendSrc),this.blendDst!==jh&&(i.blendDst=this.blendDst),this.blendEquation!==Kr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==eo&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==dv&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Us&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Us&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Us&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(l){const u=[];for(const f in l){const d=l[f];delete d.metadata,u.push(d)}return u}if(t){const l=s(e.textures),u=s(e.images);l.length>0&&(i.textures=l),u.length>0&&(i.images=u)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let l=0;l!==s;++l)i[l]=t[l].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Aa extends ji{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new lt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ki,this.combine=cb,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const fn=new X,ou=new Ct;let jT=0;class Yn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:jT++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Np,this.updateRanges=[],this.gpuType=Oi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,l=this.itemSize;s<l;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)ou.fromBufferAttribute(this,t),ou.applyMatrix3(e),this.setXY(t,ou.x,ou.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)fn.fromBufferAttribute(this,t),fn.applyMatrix3(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)fn.fromBufferAttribute(this,t),fn.applyMatrix4(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)fn.fromBufferAttribute(this,t),fn.applyNormalMatrix(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)fn.fromBufferAttribute(this,t),fn.transformDirection(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Ui(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ft(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ui(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ui(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ui(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ui(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ft(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),i=Ft(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),i=Ft(i,this.array),s=Ft(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,l){return e*=this.itemSize,this.normalized&&(t=Ft(t,this.array),i=Ft(i,this.array),s=Ft(s,this.array),l=Ft(l,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=l,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Np&&(e.usage=this.usage),e}}class Rb extends Yn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Cb extends Yn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Si extends Yn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let KT=0;const bi=new ht,Th=new en,Gs=new X,li=new Ua,bl=new Ua,Sn=new X;class zi extends mo{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:KT++}),this.uuid=Ii(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Sb(e)?Cb:Rb)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const l=new dt().getNormalMatrix(e);i.applyNormalMatrix(l),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return bi.makeRotationFromQuaternion(e),this.applyMatrix4(bi),this}rotateX(e){return bi.makeRotationX(e),this.applyMatrix4(bi),this}rotateY(e){return bi.makeRotationY(e),this.applyMatrix4(bi),this}rotateZ(e){return bi.makeRotationZ(e),this.applyMatrix4(bi),this}translate(e,t,i){return bi.makeTranslation(e,t,i),this.applyMatrix4(bi),this}scale(e,t,i){return bi.makeScale(e,t,i),this.applyMatrix4(bi),this}lookAt(e){return Th.lookAt(e),Th.updateMatrix(),this.applyMatrix4(Th.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Gs).negate(),this.translate(Gs.x,Gs.y,Gs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,l=e.length;s<l;s++){const u=e[s];i.push(u.x,u.y,u.z||0)}this.setAttribute("position",new Si(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const l=e[s];t.setXYZ(s,l.x,l.y,l.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ua);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new X(-1/0,-1/0,-1/0),new X(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const l=t[i];li.setFromBufferAttribute(l),this.morphTargetsRelative?(Sn.addVectors(this.boundingBox.min,li.min),this.boundingBox.expandByPoint(Sn),Sn.addVectors(this.boundingBox.max,li.max),this.boundingBox.expandByPoint(Sn)):(this.boundingBox.expandByPoint(li.min),this.boundingBox.expandByPoint(li.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new $i);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new X,1/0);return}if(e){const i=this.boundingSphere.center;if(li.setFromBufferAttribute(e),t)for(let l=0,u=t.length;l<u;l++){const f=t[l];bl.setFromBufferAttribute(f),this.morphTargetsRelative?(Sn.addVectors(li.min,bl.min),li.expandByPoint(Sn),Sn.addVectors(li.max,bl.max),li.expandByPoint(Sn)):(li.expandByPoint(bl.min),li.expandByPoint(bl.max))}li.getCenter(i);let s=0;for(let l=0,u=e.count;l<u;l++)Sn.fromBufferAttribute(e,l),s=Math.max(s,i.distanceToSquared(Sn));if(t)for(let l=0,u=t.length;l<u;l++){const f=t[l],d=this.morphTargetsRelative;for(let h=0,m=f.count;h<m;h++)Sn.fromBufferAttribute(f,h),d&&(Gs.fromBufferAttribute(e,h),Sn.add(Gs)),s=Math.max(s,i.distanceToSquared(Sn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,l=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Yn(new Float32Array(4*i.count),4));const u=this.getAttribute("tangent"),f=[],d=[];for(let z=0;z<i.count;z++)f[z]=new X,d[z]=new X;const h=new X,m=new X,g=new X,v=new Ct,b=new Ct,E=new Ct,S=new X,x=new X;function y(z,R,C){h.fromBufferAttribute(i,z),m.fromBufferAttribute(i,R),g.fromBufferAttribute(i,C),v.fromBufferAttribute(l,z),b.fromBufferAttribute(l,R),E.fromBufferAttribute(l,C),m.sub(h),g.sub(h),b.sub(v),E.sub(v);const H=1/(b.x*E.y-E.x*b.y);isFinite(H)&&(S.copy(m).multiplyScalar(E.y).addScaledVector(g,-b.y).multiplyScalar(H),x.copy(g).multiplyScalar(b.x).addScaledVector(m,-E.x).multiplyScalar(H),f[z].add(S),f[R].add(S),f[C].add(S),d[z].add(x),d[R].add(x),d[C].add(x))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let z=0,R=T.length;z<R;++z){const C=T[z],H=C.start,J=C.count;for(let K=H,ce=H+J;K<ce;K+=3)y(e.getX(K+0),e.getX(K+1),e.getX(K+2))}const N=new X,A=new X,P=new X,F=new X;function k(z){P.fromBufferAttribute(s,z),F.copy(P);const R=f[z];N.copy(R),N.sub(P.multiplyScalar(P.dot(R))).normalize(),A.crossVectors(F,R);const H=A.dot(d[z])<0?-1:1;u.setXYZW(z,N.x,N.y,N.z,H)}for(let z=0,R=T.length;z<R;++z){const C=T[z],H=C.start,J=C.count;for(let K=H,ce=H+J;K<ce;K+=3)k(e.getX(K+0)),k(e.getX(K+1)),k(e.getX(K+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Yn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let v=0,b=i.count;v<b;v++)i.setXYZ(v,0,0,0);const s=new X,l=new X,u=new X,f=new X,d=new X,h=new X,m=new X,g=new X;if(e)for(let v=0,b=e.count;v<b;v+=3){const E=e.getX(v+0),S=e.getX(v+1),x=e.getX(v+2);s.fromBufferAttribute(t,E),l.fromBufferAttribute(t,S),u.fromBufferAttribute(t,x),m.subVectors(u,l),g.subVectors(s,l),m.cross(g),f.fromBufferAttribute(i,E),d.fromBufferAttribute(i,S),h.fromBufferAttribute(i,x),f.add(m),d.add(m),h.add(m),i.setXYZ(E,f.x,f.y,f.z),i.setXYZ(S,d.x,d.y,d.z),i.setXYZ(x,h.x,h.y,h.z)}else for(let v=0,b=t.count;v<b;v+=3)s.fromBufferAttribute(t,v+0),l.fromBufferAttribute(t,v+1),u.fromBufferAttribute(t,v+2),m.subVectors(u,l),g.subVectors(s,l),m.cross(g),i.setXYZ(v+0,m.x,m.y,m.z),i.setXYZ(v+1,m.x,m.y,m.z),i.setXYZ(v+2,m.x,m.y,m.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Sn.fromBufferAttribute(e,t),Sn.normalize(),e.setXYZ(t,Sn.x,Sn.y,Sn.z)}toNonIndexed(){function e(f,d){const h=f.array,m=f.itemSize,g=f.normalized,v=new h.constructor(d.length*m);let b=0,E=0;for(let S=0,x=d.length;S<x;S++){f.isInterleavedBufferAttribute?b=d[S]*f.data.stride+f.offset:b=d[S]*m;for(let y=0;y<m;y++)v[E++]=h[b++]}return new Yn(v,m,g)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new zi,i=this.index.array,s=this.attributes;for(const f in s){const d=s[f],h=e(d,i);t.setAttribute(f,h)}const l=this.morphAttributes;for(const f in l){const d=[],h=l[f];for(let m=0,g=h.length;m<g;m++){const v=h[m],b=e(v,i);d.push(b)}t.morphAttributes[f]=d}t.morphTargetsRelative=this.morphTargetsRelative;const u=this.groups;for(let f=0,d=u.length;f<d;f++){const h=u[f];t.addGroup(h.start,h.count,h.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const d=this.parameters;for(const h in d)d[h]!==void 0&&(e[h]=d[h]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const d in i){const h=i[d];e.data.attributes[d]=h.toJSON(e.data)}const s={};let l=!1;for(const d in this.morphAttributes){const h=this.morphAttributes[d],m=[];for(let g=0,v=h.length;g<v;g++){const b=h[g];m.push(b.toJSON(e.data))}m.length>0&&(s[d]=m,l=!0)}l&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const u=this.groups;u.length>0&&(e.data.groups=JSON.parse(JSON.stringify(u)));const f=this.boundingSphere;return f!==null&&(e.data.boundingSphere={center:f.center.toArray(),radius:f.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const s=e.attributes;for(const h in s){const m=s[h];this.setAttribute(h,m.clone(t))}const l=e.morphAttributes;for(const h in l){const m=[],g=l[h];for(let v=0,b=g.length;v<b;v++)m.push(g[v].clone(t));this.morphAttributes[h]=m}this.morphTargetsRelative=e.morphTargetsRelative;const u=e.groups;for(let h=0,m=u.length;h<m;h++){const g=u[h];this.addGroup(g.start,g.count,g.materialIndex)}const f=e.boundingBox;f!==null&&(this.boundingBox=f.clone());const d=e.boundingSphere;return d!==null&&(this.boundingSphere=d.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Av=new ht,Br=new Ku,lu=new $i,Rv=new X,cu=new X,uu=new X,fu=new X,Ah=new X,du=new X,Cv=new X,hu=new X;class Bt extends en{constructor(e=new zi,t=new Aa){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,u=s.length;l<u;l++){const f=s[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[f]=l}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,l=i.morphAttributes.position,u=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const f=this.morphTargetInfluences;if(l&&f){du.set(0,0,0);for(let d=0,h=l.length;d<h;d++){const m=f[d],g=l[d];m!==0&&(Ah.fromBufferAttribute(g,e),u?du.addScaledVector(Ah,m):du.addScaledVector(Ah.sub(t),m))}t.add(du)}return t}raycast(e,t){const i=this.geometry,s=this.material,l=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),lu.copy(i.boundingSphere),lu.applyMatrix4(l),Br.copy(e.ray).recast(e.near),!(lu.containsPoint(Br.origin)===!1&&(Br.intersectSphere(lu,Rv)===null||Br.origin.distanceToSquared(Rv)>(e.far-e.near)**2))&&(Av.copy(l).invert(),Br.copy(e.ray).applyMatrix4(Av),!(i.boundingBox!==null&&Br.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Br)))}_computeIntersections(e,t,i){let s;const l=this.geometry,u=this.material,f=l.index,d=l.attributes.position,h=l.attributes.uv,m=l.attributes.uv1,g=l.attributes.normal,v=l.groups,b=l.drawRange;if(f!==null)if(Array.isArray(u))for(let E=0,S=v.length;E<S;E++){const x=v[E],y=u[x.materialIndex],T=Math.max(x.start,b.start),N=Math.min(f.count,Math.min(x.start+x.count,b.start+b.count));for(let A=T,P=N;A<P;A+=3){const F=f.getX(A),k=f.getX(A+1),z=f.getX(A+2);s=pu(this,y,e,i,h,m,g,F,k,z),s&&(s.faceIndex=Math.floor(A/3),s.face.materialIndex=x.materialIndex,t.push(s))}}else{const E=Math.max(0,b.start),S=Math.min(f.count,b.start+b.count);for(let x=E,y=S;x<y;x+=3){const T=f.getX(x),N=f.getX(x+1),A=f.getX(x+2);s=pu(this,u,e,i,h,m,g,T,N,A),s&&(s.faceIndex=Math.floor(x/3),t.push(s))}}else if(d!==void 0)if(Array.isArray(u))for(let E=0,S=v.length;E<S;E++){const x=v[E],y=u[x.materialIndex],T=Math.max(x.start,b.start),N=Math.min(d.count,Math.min(x.start+x.count,b.start+b.count));for(let A=T,P=N;A<P;A+=3){const F=A,k=A+1,z=A+2;s=pu(this,y,e,i,h,m,g,F,k,z),s&&(s.faceIndex=Math.floor(A/3),s.face.materialIndex=x.materialIndex,t.push(s))}}else{const E=Math.max(0,b.start),S=Math.min(d.count,b.start+b.count);for(let x=E,y=S;x<y;x+=3){const T=x,N=x+1,A=x+2;s=pu(this,u,e,i,h,m,g,T,N,A),s&&(s.faceIndex=Math.floor(x/3),t.push(s))}}}}function ZT(r,e,t,i,s,l,u,f){let d;if(e.side===ei?d=i.intersectTriangle(u,l,s,!0,f):d=i.intersectTriangle(s,l,u,e.side===Na,f),d===null)return null;hu.copy(f),hu.applyMatrix4(r.matrixWorld);const h=t.ray.origin.distanceTo(hu);return h<t.near||h>t.far?null:{distance:h,point:hu.clone(),object:r}}function pu(r,e,t,i,s,l,u,f,d,h){r.getVertexPosition(f,cu),r.getVertexPosition(d,uu),r.getVertexPosition(h,fu);const m=ZT(r,e,t,i,cu,uu,fu,Cv);if(m){const g=new X;Pi.getBarycoord(Cv,cu,uu,fu,g),s&&(m.uv=Pi.getInterpolatedAttribute(s,f,d,h,g,new Ct)),l&&(m.uv1=Pi.getInterpolatedAttribute(l,f,d,h,g,new Ct)),u&&(m.normal=Pi.getInterpolatedAttribute(u,f,d,h,g,new X),m.normal.dot(i.direction)>0&&m.normal.multiplyScalar(-1));const v={a:f,b:d,c:h,normal:new X,materialIndex:0};Pi.getNormal(cu,uu,fu,v.normal),m.face=v,m.barycoord=g}return m}class Wn extends zi{constructor(e=1,t=1,i=1,s=1,l=1,u=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:l,depthSegments:u};const f=this;s=Math.floor(s),l=Math.floor(l),u=Math.floor(u);const d=[],h=[],m=[],g=[];let v=0,b=0;E("z","y","x",-1,-1,i,t,e,u,l,0),E("z","y","x",1,-1,i,t,-e,u,l,1),E("x","z","y",1,1,e,i,t,s,u,2),E("x","z","y",1,-1,e,i,-t,s,u,3),E("x","y","z",1,-1,e,t,i,s,l,4),E("x","y","z",-1,-1,e,t,-i,s,l,5),this.setIndex(d),this.setAttribute("position",new Si(h,3)),this.setAttribute("normal",new Si(m,3)),this.setAttribute("uv",new Si(g,2));function E(S,x,y,T,N,A,P,F,k,z,R){const C=A/k,H=P/z,J=A/2,K=P/2,ce=F/2,de=k+1,W=z+1;let le=0,Y=0;const ye=new X;for(let I=0;I<W;I++){const re=I*H-K;for(let Se=0;Se<de;Se++){const Ne=Se*C-J;ye[S]=Ne*T,ye[x]=re*N,ye[y]=ce,h.push(ye.x,ye.y,ye.z),ye[S]=0,ye[x]=0,ye[y]=F>0?1:-1,m.push(ye.x,ye.y,ye.z),g.push(Se/k),g.push(1-I/z),le+=1}}for(let I=0;I<z;I++)for(let re=0;re<k;re++){const Se=v+re+de*I,Ne=v+re+de*(I+1),Q=v+(re+1)+de*(I+1),me=v+(re+1)+de*I;d.push(Se,Ne,me),d.push(Ne,Q,me),Y+=6}f.addGroup(b,Y,R),b+=Y,v+=le}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function oo(r){const e={};for(const t in r){e[t]={};for(const i in r[t]){const s=r[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Gn(r){const e={};for(let t=0;t<r.length;t++){const i=oo(r[t]);for(const s in i)e[s]=i[s]}return e}function $T(r){const e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function Db(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Rt.workingColorSpace}const QT={clone:oo,merge:Gn};var JT=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,e1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class hr extends ji{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=JT,this.fragmentShader=e1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=oo(e.uniforms),this.uniformsGroups=$T(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const u=this.uniforms[s].value;u&&u.isTexture?t.uniforms[s]={type:"t",value:u.toJSON(e).uuid}:u&&u.isColor?t.uniforms[s]={type:"c",value:u.getHex()}:u&&u.isVector2?t.uniforms[s]={type:"v2",value:u.toArray()}:u&&u.isVector3?t.uniforms[s]={type:"v3",value:u.toArray()}:u&&u.isVector4?t.uniforms[s]={type:"v4",value:u.toArray()}:u&&u.isMatrix3?t.uniforms[s]={type:"m3",value:u.toArray()}:u&&u.isMatrix4?t.uniforms[s]={type:"m4",value:u.toArray()}:t.uniforms[s]={value:u}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Nb extends en{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ht,this.projectionMatrix=new ht,this.projectionMatrixInverse=new ht,this.coordinateSystem=Ta}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const sr=new X,Dv=new Ct,Nv=new Ct;class Xn extends Nb{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=so*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Rl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return so*2*Math.atan(Math.tan(Rl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){sr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(sr.x,sr.y).multiplyScalar(-e/sr.z),sr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(sr.x,sr.y).multiplyScalar(-e/sr.z)}getViewSize(e,t){return this.getViewBounds(e,Dv,Nv),t.subVectors(Nv,Dv)}setViewOffset(e,t,i,s,l,u){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=l,this.view.height=u,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Rl*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,l=-.5*s;const u=this.view;if(this.view!==null&&this.view.enabled){const d=u.fullWidth,h=u.fullHeight;l+=u.offsetX*s/d,t-=u.offsetY*i/h,s*=u.width/d,i*=u.height/h}const f=this.filmOffset;f!==0&&(l+=e*f/this.getFilmWidth()),this.projectionMatrix.makePerspective(l,l+s,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ws=-90,Xs=1;class t1 extends en{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Xn(Ws,Xs,e,t);s.layers=this.layers,this.add(s);const l=new Xn(Ws,Xs,e,t);l.layers=this.layers,this.add(l);const u=new Xn(Ws,Xs,e,t);u.layers=this.layers,this.add(u);const f=new Xn(Ws,Xs,e,t);f.layers=this.layers,this.add(f);const d=new Xn(Ws,Xs,e,t);d.layers=this.layers,this.add(d);const h=new Xn(Ws,Xs,e,t);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,l,u,f,d]=t;for(const h of t)this.remove(h);if(e===Ta)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),l.up.set(0,0,-1),l.lookAt(0,1,0),u.up.set(0,0,1),u.lookAt(0,-1,0),f.up.set(0,1,0),f.lookAt(0,0,1),d.up.set(0,1,0),d.lookAt(0,0,-1);else if(e===Hu)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),l.up.set(0,0,1),l.lookAt(0,1,0),u.up.set(0,0,-1),u.lookAt(0,-1,0),f.up.set(0,-1,0),f.lookAt(0,0,1),d.up.set(0,-1,0),d.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of t)this.add(h),h.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[l,u,f,d,h,m]=this.children,g=e.getRenderTarget(),v=e.getActiveCubeFace(),b=e.getActiveMipmapLevel(),E=e.xr.enabled;e.xr.enabled=!1;const S=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,l),e.setRenderTarget(i,1,s),e.render(t,u),e.setRenderTarget(i,2,s),e.render(t,f),e.setRenderTarget(i,3,s),e.render(t,d),e.setRenderTarget(i,4,s),e.render(t,h),i.texture.generateMipmaps=S,e.setRenderTarget(i,5,s),e.render(t,m),e.setRenderTarget(g,v,b),e.xr.enabled=E,i.texture.needsPMREMUpdate=!0}}class Lb extends wn{constructor(e,t,i,s,l,u,f,d,h,m){e=e!==void 0?e:[],t=t!==void 0?t:to,super(e,t,i,s,l,u,f,d,h,m),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class n1 extends Jr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Lb(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:ci}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Wn(5,5,5),l=new hr({name:"CubemapFromEquirect",uniforms:oo(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:ei,blending:fr});l.uniforms.tEquirect.value=t;const u=new Bt(s,l),f=t.minFilter;return t.minFilter===wa&&(t.minFilter=ci),new t1(1,10,this).update(e,u),t.minFilter=f,u.geometry.dispose(),u.material.dispose(),this}clear(e,t,i,s){const l=e.getRenderTarget();for(let u=0;u<6;u++)e.setRenderTarget(this,u),e.clear(t,i,s);e.setRenderTarget(l)}}class Yi extends en{constructor(){super(),this.isGroup=!0,this.type="Group"}}const i1={type:"move"};class Rh{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Yi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Yi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new X,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new X),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Yi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new X,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new X),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,l=null,u=null;const f=this._targetRay,d=this._grip,h=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(h&&e.hand){u=!0;for(const S of e.hand.values()){const x=t.getJointPose(S,i),y=this._getHandJoint(h,S);x!==null&&(y.matrix.fromArray(x.transform.matrix),y.matrix.decompose(y.position,y.rotation,y.scale),y.matrixWorldNeedsUpdate=!0,y.jointRadius=x.radius),y.visible=x!==null}const m=h.joints["index-finger-tip"],g=h.joints["thumb-tip"],v=m.position.distanceTo(g.position),b=.02,E=.005;h.inputState.pinching&&v>b+E?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&v<=b-E&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else d!==null&&e.gripSpace&&(l=t.getPose(e.gripSpace,i),l!==null&&(d.matrix.fromArray(l.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,l.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(l.linearVelocity)):d.hasLinearVelocity=!1,l.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(l.angularVelocity)):d.hasAngularVelocity=!1));f!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&l!==null&&(s=l),s!==null&&(f.matrix.fromArray(s.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,s.linearVelocity?(f.hasLinearVelocity=!0,f.linearVelocity.copy(s.linearVelocity)):f.hasLinearVelocity=!1,s.angularVelocity?(f.hasAngularVelocity=!0,f.angularVelocity.copy(s.angularVelocity)):f.hasAngularVelocity=!1,this.dispatchEvent(i1)))}return f!==null&&(f.visible=s!==null),d!==null&&(d.visible=l!==null),h!==null&&(h.visible=u!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Yi;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class om{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new lt(e),this.near=t,this.far=i}clone(){return new om(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class a1 extends en{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ki,this.environmentIntensity=1,this.environmentRotation=new Ki,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class r1{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Np,this.updateRanges=[],this.version=0,this.uuid=Ii()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,l=this.stride;s<l;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ii()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ii()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Vn=new X;class lm{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Vn.fromBufferAttribute(this,t),Vn.applyMatrix4(e),this.setXYZ(t,Vn.x,Vn.y,Vn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Vn.fromBufferAttribute(this,t),Vn.applyNormalMatrix(e),this.setXYZ(t,Vn.x,Vn.y,Vn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Vn.fromBufferAttribute(this,t),Vn.transformDirection(e),this.setXYZ(t,Vn.x,Vn.y,Vn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=Ui(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ft(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=Ft(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ft(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ft(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ft(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Ui(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Ui(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Ui(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Ui(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ft(t,this.array),i=Ft(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ft(t,this.array),i=Ft(i,this.array),s=Ft(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,l){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ft(t,this.array),i=Ft(i,this.array),s=Ft(s,this.array),l=Ft(l,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=l,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let l=0;l<this.itemSize;l++)t.push(this.data.array[s+l])}return new Yn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new lm(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let l=0;l<this.itemSize;l++)t.push(this.data.array[s+l])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const Lv=new X,Uv=new Ot,Pv=new Ot,s1=new X,Ov=new ht,mu=new X,Ch=new $i,Iv=new ht,Dh=new Ku;class o1 extends Bt{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=lv,this.bindMatrix=new ht,this.bindMatrixInverse=new ht,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Ua),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,mu),this.boundingBox.expandByPoint(mu)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new $i),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,mu),this.boundingSphere.expandByPoint(mu)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const i=this.material,s=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ch.copy(this.boundingSphere),Ch.applyMatrix4(s),e.ray.intersectsSphere(Ch)!==!1&&(Iv.copy(s).invert(),Dh.copy(e.ray).applyMatrix4(Iv),!(this.boundingBox!==null&&Dh.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Dh)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new Ot,t=this.geometry.attributes.skinWeight;for(let i=0,s=t.count;i<s;i++){e.fromBufferAttribute(t,i);const l=1/e.manhattanLength();l!==1/0?e.multiplyScalar(l):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===lv?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===tT?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const i=this.skeleton,s=this.geometry;Uv.fromBufferAttribute(s.attributes.skinIndex,e),Pv.fromBufferAttribute(s.attributes.skinWeight,e),Lv.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let l=0;l<4;l++){const u=Pv.getComponent(l);if(u!==0){const f=Uv.getComponent(l);Ov.multiplyMatrices(i.bones[f].matrixWorld,i.boneInverses[f]),t.addScaledVector(s1.copy(Lv).applyMatrix4(Ov),u)}}return t.applyMatrix4(this.bindMatrixInverse)}}class Ub extends en{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Pb extends wn{constructor(e=null,t=1,i=1,s,l,u,f,d,h=qn,m=qn,g,v){super(null,u,f,d,h,m,s,l,g,v),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Fv=new ht,l1=new ht;class cm{constructor(e=[],t=[]){this.uuid=Ii(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,s=this.bones.length;i<s;i++)this.boneInverses.push(new ht)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const i=new ht;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){const e=this.bones,t=this.boneInverses,i=this.boneMatrices,s=this.boneTexture;for(let l=0,u=e.length;l<u;l++){const f=e[l]?e[l].matrixWorld:l1;Fv.multiplyMatrices(f,t[l]),Fv.toArray(i,l*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new cm(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const i=new Pb(t,e,e,Mi,Oi);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){const s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,s=e.bones.length;i<s;i++){const l=e.bones[i];let u=t[l];u===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",l),u=new Ub),this.bones.push(u),this.boneInverses.push(new ht().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,i=this.boneInverses;for(let s=0,l=t.length;s<l;s++){const u=t[s];e.bones.push(u.uuid);const f=i[s];e.boneInverses.push(f.toArray())}return e}}class Lp extends Yn{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const qs=new ht,Bv=new ht,gu=[],zv=new Ua,c1=new ht,xl=new Bt,El=new $i;class u1 extends Bt{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Lp(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,c1)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ua),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,qs),zv.copy(e.boundingBox).applyMatrix4(qs),this.boundingBox.union(zv)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new $i),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,qs),El.copy(e.boundingSphere).applyMatrix4(qs),this.boundingSphere.union(El)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,l=i.length+1,u=e*l+1;for(let f=0;f<i.length;f++)i[f]=s[u+f]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(xl.geometry=this.geometry,xl.material=this.material,xl.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),El.copy(this.boundingSphere),El.applyMatrix4(i),e.ray.intersectsSphere(El)!==!1))for(let l=0;l<s;l++){this.getMatrixAt(l,qs),Bv.multiplyMatrices(i,qs),xl.matrixWorld=Bv,xl.raycast(e,gu);for(let u=0,f=gu.length;u<f;u++){const d=gu[u];d.instanceId=l,d.object=this,t.push(d)}gu.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Lp(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new Pb(new Float32Array(s*this.count),s,this.count,tm,Oi));const l=this.morphTexture.source.data.data;let u=0;for(let h=0;h<i.length;h++)u+=i[h];const f=this.geometry.morphTargetsRelative?1:1-u,d=s*e;l[d]=f,l.set(i,d+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Nh=new X,f1=new X,d1=new dt;class Yr{constructor(e=new X(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Nh.subVectors(i,t).cross(f1.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Nh),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const l=-(e.start.dot(this.normal)+this.constant)/s;return l<0||l>1?null:t.copy(e.start).addScaledVector(i,l)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||d1.getNormalMatrix(e),s=this.coplanarPoint(Nh).applyMatrix4(e),l=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(l),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const zr=new $i,_u=new X;class um{constructor(e=new Yr,t=new Yr,i=new Yr,s=new Yr,l=new Yr,u=new Yr){this.planes=[e,t,i,s,l,u]}set(e,t,i,s,l,u){const f=this.planes;return f[0].copy(e),f[1].copy(t),f[2].copy(i),f[3].copy(s),f[4].copy(l),f[5].copy(u),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Ta){const i=this.planes,s=e.elements,l=s[0],u=s[1],f=s[2],d=s[3],h=s[4],m=s[5],g=s[6],v=s[7],b=s[8],E=s[9],S=s[10],x=s[11],y=s[12],T=s[13],N=s[14],A=s[15];if(i[0].setComponents(d-l,v-h,x-b,A-y).normalize(),i[1].setComponents(d+l,v+h,x+b,A+y).normalize(),i[2].setComponents(d+u,v+m,x+E,A+T).normalize(),i[3].setComponents(d-u,v-m,x-E,A-T).normalize(),i[4].setComponents(d-f,v-g,x-S,A-N).normalize(),t===Ta)i[5].setComponents(d+f,v+g,x+S,A+N).normalize();else if(t===Hu)i[5].setComponents(f,g,S,N).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),zr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),zr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(zr)}intersectsSprite(e){return zr.center.set(0,0,0),zr.radius=.7071067811865476,zr.applyMatrix4(e.matrixWorld),this.intersectsSphere(zr)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let l=0;l<6;l++)if(t[l].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(_u.x=s.normal.x>0?e.max.x:e.min.x,_u.y=s.normal.y>0?e.max.y:e.min.y,_u.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(_u)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ob extends ji{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new lt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Vu=new X,Gu=new X,kv=new ht,Ml=new Ku,vu=new $i,Lh=new X,Hv=new X;class fm extends en{constructor(e=new zi,t=new Ob){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,l=t.count;s<l;s++)Vu.fromBufferAttribute(t,s-1),Gu.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=Vu.distanceTo(Gu);e.setAttribute("lineDistance",new Si(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,l=e.params.Line.threshold,u=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),vu.copy(i.boundingSphere),vu.applyMatrix4(s),vu.radius+=l,e.ray.intersectsSphere(vu)===!1)return;kv.copy(s).invert(),Ml.copy(e.ray).applyMatrix4(kv);const f=l/((this.scale.x+this.scale.y+this.scale.z)/3),d=f*f,h=this.isLineSegments?2:1,m=i.index,v=i.attributes.position;if(m!==null){const b=Math.max(0,u.start),E=Math.min(m.count,u.start+u.count);for(let S=b,x=E-1;S<x;S+=h){const y=m.getX(S),T=m.getX(S+1),N=yu(this,e,Ml,d,y,T,S);N&&t.push(N)}if(this.isLineLoop){const S=m.getX(E-1),x=m.getX(b),y=yu(this,e,Ml,d,S,x,E-1);y&&t.push(y)}}else{const b=Math.max(0,u.start),E=Math.min(v.count,u.start+u.count);for(let S=b,x=E-1;S<x;S+=h){const y=yu(this,e,Ml,d,S,S+1,S);y&&t.push(y)}if(this.isLineLoop){const S=yu(this,e,Ml,d,E-1,b,E-1);S&&t.push(S)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,u=s.length;l<u;l++){const f=s[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[f]=l}}}}}function yu(r,e,t,i,s,l,u){const f=r.geometry.attributes.position;if(Vu.fromBufferAttribute(f,s),Gu.fromBufferAttribute(f,l),t.distanceSqToSegment(Vu,Gu,Lh,Hv)>i)return;Lh.applyMatrix4(r.matrixWorld);const h=e.ray.origin.distanceTo(Lh);if(!(h<e.near||h>e.far))return{distance:h,point:Hv.clone().applyMatrix4(r.matrixWorld),index:u,face:null,faceIndex:null,barycoord:null,object:r}}const Vv=new X,Gv=new X;class h1 extends fm{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,l=t.count;s<l;s+=2)Vv.fromBufferAttribute(t,s),Gv.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Vv.distanceTo(Gv);e.setAttribute("lineDistance",new Si(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class p1 extends fm{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Ib extends ji{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new lt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Wv=new ht,Up=new Ku,bu=new $i,xu=new X;class m1 extends en{constructor(e=new zi,t=new Ib){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,l=e.params.Points.threshold,u=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),bu.copy(i.boundingSphere),bu.applyMatrix4(s),bu.radius+=l,e.ray.intersectsSphere(bu)===!1)return;Wv.copy(s).invert(),Up.copy(e.ray).applyMatrix4(Wv);const f=l/((this.scale.x+this.scale.y+this.scale.z)/3),d=f*f,h=i.index,g=i.attributes.position;if(h!==null){const v=Math.max(0,u.start),b=Math.min(h.count,u.start+u.count);for(let E=v,S=b;E<S;E++){const x=h.getX(E);xu.fromBufferAttribute(g,x),Xv(xu,x,d,s,e,t,this)}}else{const v=Math.max(0,u.start),b=Math.min(g.count,u.start+u.count);for(let E=v,S=b;E<S;E++)xu.fromBufferAttribute(g,E),Xv(xu,E,d,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,u=s.length;l<u;l++){const f=s[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[f]=l}}}}}function Xv(r,e,t,i,s,l,u){const f=Up.distanceSqToPoint(r);if(f<t){const d=new X;Up.closestPointToPoint(r,d),d.applyMatrix4(i);const h=s.ray.origin.distanceTo(d);if(h<s.near||h>s.far)return;l.push({distance:h,distanceToRay:Math.sqrt(f),point:d,index:e,face:null,faceIndex:null,barycoord:null,object:u})}}class Fb extends wn{constructor(e,t,i,s,l,u,f,d,h,m=$s){if(m!==$s&&m!==ro)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&m===$s&&(i=Qr),i===void 0&&m===ro&&(i=ao),super(null,s,l,u,f,d,m,i,h),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=f!==void 0?f:qn,this.minFilter=d!==void 0?d:qn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new sm(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Vl extends zi{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const l=e/2,u=t/2,f=Math.floor(i),d=Math.floor(s),h=f+1,m=d+1,g=e/f,v=t/d,b=[],E=[],S=[],x=[];for(let y=0;y<m;y++){const T=y*v-u;for(let N=0;N<h;N++){const A=N*g-l;E.push(A,-T,0),S.push(0,0,1),x.push(N/f),x.push(1-y/d)}}for(let y=0;y<d;y++)for(let T=0;T<f;T++){const N=T+h*y,A=T+h*(y+1),P=T+1+h*(y+1),F=T+1+h*y;b.push(N,A,F),b.push(A,P,F)}this.setIndex(b),this.setAttribute("position",new Si(E,3)),this.setAttribute("normal",new Si(S,3)),this.setAttribute("uv",new Si(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vl(e.width,e.height,e.widthSegments,e.heightSegments)}}class Wu extends zi{constructor(e=1,t=32,i=16,s=0,l=Math.PI*2,u=0,f=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:l,thetaStart:u,thetaLength:f},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const d=Math.min(u+f,Math.PI);let h=0;const m=[],g=new X,v=new X,b=[],E=[],S=[],x=[];for(let y=0;y<=i;y++){const T=[],N=y/i;let A=0;y===0&&u===0?A=.5/t:y===i&&d===Math.PI&&(A=-.5/t);for(let P=0;P<=t;P++){const F=P/t;g.x=-e*Math.cos(s+F*l)*Math.sin(u+N*f),g.y=e*Math.cos(u+N*f),g.z=e*Math.sin(s+F*l)*Math.sin(u+N*f),E.push(g.x,g.y,g.z),v.copy(g).normalize(),S.push(v.x,v.y,v.z),x.push(F+A,1-N),T.push(h++)}m.push(T)}for(let y=0;y<i;y++)for(let T=0;T<t;T++){const N=m[y][T+1],A=m[y][T],P=m[y+1][T],F=m[y+1][T+1];(y!==0||u>0)&&b.push(N,A,F),(y!==i-1||d<Math.PI)&&b.push(A,P,F)}this.setIndex(b),this.setAttribute("position",new Si(E,3)),this.setAttribute("normal",new Si(S,3)),this.setAttribute("uv",new Si(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wu(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Jn extends ji{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new lt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new lt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Eb,this.normalScale=new Ct(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ki,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Qi extends Jn{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ct(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return yt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new lt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new lt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new lt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class g1 extends ji{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=aT,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class _1 extends ji{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function Eu(r,e,t){return!r||!t&&r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function v1(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function y1(r){function e(s,l){return r[s]-r[l]}const t=r.length,i=new Array(t);for(let s=0;s!==t;++s)i[s]=s;return i.sort(e),i}function qv(r,e,t){const i=r.length,s=new r.constructor(i);for(let l=0,u=0;u!==i;++l){const f=t[l]*e;for(let d=0;d!==e;++d)s[u++]=r[f+d]}return s}function Bb(r,e,t,i){let s=1,l=r[0];for(;l!==void 0&&l[i]===void 0;)l=r[s++];if(l===void 0)return;let u=l[i];if(u!==void 0)if(Array.isArray(u))do u=l[i],u!==void 0&&(e.push(l.time),t.push(...u)),l=r[s++];while(l!==void 0);else if(u.toArray!==void 0)do u=l[i],u!==void 0&&(e.push(l.time),u.toArray(t,t.length)),l=r[s++];while(l!==void 0);else do u=l[i],u!==void 0&&(e.push(l.time),t.push(u)),l=r[s++];while(l!==void 0)}class Gl{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let i=this._cachedIndex,s=t[i],l=t[i-1];e:{t:{let u;n:{i:if(!(e<s)){for(let f=i+2;;){if(s===void 0){if(e<l)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===f)break;if(l=s,s=t[++i],e<s)break t}u=t.length;break n}if(!(e>=l)){const f=t[1];e<f&&(i=2,l=f);for(let d=i-2;;){if(l===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===d)break;if(s=l,l=t[--i-1],e>=l)break t}u=i,i=0;break n}break e}for(;i<u;){const f=i+u>>>1;e<t[f]?u=f:i=f+1}if(s=t[i],l=t[i-1],l===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,l,s)}return this.interpolate_(i,l,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,l=e*s;for(let u=0;u!==s;++u)t[u]=i[l+u];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class b1 extends Gl{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:cv,endingEnd:cv}}intervalChanged_(e,t,i){const s=this.parameterPositions;let l=e-2,u=e+1,f=s[l],d=s[u];if(f===void 0)switch(this.getSettings_().endingStart){case uv:l=e,f=2*t-i;break;case fv:l=s.length-2,f=t+s[l]-s[l+1];break;default:l=e,f=i}if(d===void 0)switch(this.getSettings_().endingEnd){case uv:u=e,d=2*i-t;break;case fv:u=1,d=i+s[1]-s[0];break;default:u=e-1,d=t}const h=(i-t)*.5,m=this.valueSize;this._weightPrev=h/(t-f),this._weightNext=h/(d-i),this._offsetPrev=l*m,this._offsetNext=u*m}interpolate_(e,t,i,s){const l=this.resultBuffer,u=this.sampleValues,f=this.valueSize,d=e*f,h=d-f,m=this._offsetPrev,g=this._offsetNext,v=this._weightPrev,b=this._weightNext,E=(i-t)/(s-t),S=E*E,x=S*E,y=-v*x+2*v*S-v*E,T=(1+v)*x+(-1.5-2*v)*S+(-.5+v)*E+1,N=(-1-b)*x+(1.5+b)*S+.5*E,A=b*x-b*S;for(let P=0;P!==f;++P)l[P]=y*u[m+P]+T*u[h+P]+N*u[d+P]+A*u[g+P];return l}}class x1 extends Gl{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){const l=this.resultBuffer,u=this.sampleValues,f=this.valueSize,d=e*f,h=d-f,m=(i-t)/(s-t),g=1-m;for(let v=0;v!==f;++v)l[v]=u[h+v]*g+u[d+v]*m;return l}}class E1 extends Gl{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}}class Ji{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Eu(t,this.TimeBufferType),this.values=Eu(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Eu(e.times,Array),values:Eu(e.values,Array)};const s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new E1(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new x1(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new b1(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Ul:t=this.InterpolantFactoryMethodDiscrete;break;case Pl:t=this.InterpolantFactoryMethodLinear;break;case lh:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ul;case this.InterpolantFactoryMethodLinear:return Pl;case this.InterpolantFactoryMethodSmooth:return lh}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){const i=this.times,s=i.length;let l=0,u=s-1;for(;l!==s&&i[l]<e;)++l;for(;u!==-1&&i[u]>t;)--u;if(++u,l!==0||u!==s){l>=u&&(u=Math.max(u,1),l=u-1);const f=this.getValueSize();this.times=i.slice(l,u),this.values=this.values.slice(l*f,u*f)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const i=this.times,s=this.values,l=i.length;l===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let u=null;for(let f=0;f!==l;f++){const d=i[f];if(typeof d=="number"&&isNaN(d)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,f,d),e=!1;break}if(u!==null&&u>d){console.error("THREE.KeyframeTrack: Out of order keys.",this,f,d,u),e=!1;break}u=d}if(s!==void 0&&v1(s))for(let f=0,d=s.length;f!==d;++f){const h=s[f];if(isNaN(h)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,f,h),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===lh,l=e.length-1;let u=1;for(let f=1;f<l;++f){let d=!1;const h=e[f],m=e[f+1];if(h!==m&&(f!==1||h!==e[0]))if(s)d=!0;else{const g=f*i,v=g-i,b=g+i;for(let E=0;E!==i;++E){const S=t[g+E];if(S!==t[v+E]||S!==t[b+E]){d=!0;break}}}if(d){if(f!==u){e[u]=e[f];const g=f*i,v=u*i;for(let b=0;b!==i;++b)t[v+b]=t[g+b]}++u}}if(l>0){e[u]=e[l];for(let f=l*i,d=u*i,h=0;h!==i;++h)t[d+h]=t[f+h];++u}return u!==e.length?(this.times=e.slice(0,u),this.values=t.slice(0,u*i)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}}Ji.prototype.TimeBufferType=Float32Array;Ji.prototype.ValueBufferType=Float32Array;Ji.prototype.DefaultInterpolation=Pl;class go extends Ji{constructor(e,t,i){super(e,t,i)}}go.prototype.ValueTypeName="bool";go.prototype.ValueBufferType=Array;go.prototype.DefaultInterpolation=Ul;go.prototype.InterpolantFactoryMethodLinear=void 0;go.prototype.InterpolantFactoryMethodSmooth=void 0;class zb extends Ji{}zb.prototype.ValueTypeName="color";class lo extends Ji{}lo.prototype.ValueTypeName="number";class M1 extends Gl{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){const l=this.resultBuffer,u=this.sampleValues,f=this.valueSize,d=(i-t)/(s-t);let h=e*f;for(let m=h+f;h!==m;h+=4)mr.slerpFlat(l,0,u,h-f,u,h,d);return l}}class co extends Ji{InterpolantFactoryMethodLinear(e){return new M1(this.times,this.values,this.getValueSize(),e)}}co.prototype.ValueTypeName="quaternion";co.prototype.InterpolantFactoryMethodSmooth=void 0;class _o extends Ji{constructor(e,t,i){super(e,t,i)}}_o.prototype.ValueTypeName="string";_o.prototype.ValueBufferType=Array;_o.prototype.DefaultInterpolation=Ul;_o.prototype.InterpolantFactoryMethodLinear=void 0;_o.prototype.InterpolantFactoryMethodSmooth=void 0;class uo extends Ji{}uo.prototype.ValueTypeName="vector";class S1{constructor(e="",t=-1,i=[],s=nT){this.name=e,this.tracks=i,this.duration=t,this.blendMode=s,this.uuid=Ii(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],i=e.tracks,s=1/(e.fps||1);for(let u=0,f=i.length;u!==f;++u)t.push(T1(i[u]).scale(s));const l=new this(e.name,e.duration,t,e.blendMode);return l.uuid=e.uuid,l}static toJSON(e){const t=[],i=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let l=0,u=i.length;l!==u;++l)t.push(Ji.toJSON(i[l]));return s}static CreateFromMorphTargetSequence(e,t,i,s){const l=t.length,u=[];for(let f=0;f<l;f++){let d=[],h=[];d.push((f+l-1)%l,f,(f+1)%l),h.push(0,1,0);const m=y1(d);d=qv(d,1,m),h=qv(h,1,m),!s&&d[0]===0&&(d.push(l),h.push(h[0])),u.push(new lo(".morphTargetInfluences["+t[f].name+"]",d,h).scale(1/i))}return new this(e,-1,u)}static findByName(e,t){let i=e;if(!Array.isArray(e)){const s=e;i=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<i.length;s++)if(i[s].name===t)return i[s];return null}static CreateClipsFromMorphTargetSequences(e,t,i){const s={},l=/^([\w-]*?)([\d]+)$/;for(let f=0,d=e.length;f<d;f++){const h=e[f],m=h.name.match(l);if(m&&m.length>1){const g=m[1];let v=s[g];v||(s[g]=v=[]),v.push(h)}}const u=[];for(const f in s)u.push(this.CreateFromMorphTargetSequence(f,s[f],t,i));return u}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const i=function(g,v,b,E,S){if(b.length!==0){const x=[],y=[];Bb(b,x,y,E),x.length!==0&&S.push(new g(v,x,y))}},s=[],l=e.name||"default",u=e.fps||30,f=e.blendMode;let d=e.length||-1;const h=e.hierarchy||[];for(let g=0;g<h.length;g++){const v=h[g].keys;if(!(!v||v.length===0))if(v[0].morphTargets){const b={};let E;for(E=0;E<v.length;E++)if(v[E].morphTargets)for(let S=0;S<v[E].morphTargets.length;S++)b[v[E].morphTargets[S]]=-1;for(const S in b){const x=[],y=[];for(let T=0;T!==v[E].morphTargets.length;++T){const N=v[E];x.push(N.time),y.push(N.morphTarget===S?1:0)}s.push(new lo(".morphTargetInfluence["+S+"]",x,y))}d=b.length*u}else{const b=".bones["+t[g].name+"]";i(uo,b+".position",v,"pos",s),i(co,b+".quaternion",v,"rot",s),i(uo,b+".scale",v,"scl",s)}}return s.length===0?null:new this(l,d,s,f)}resetDuration(){const e=this.tracks;let t=0;for(let i=0,s=e.length;i!==s;++i){const l=this.tracks[i];t=Math.max(t,l.times[l.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function w1(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return lo;case"vector":case"vector2":case"vector3":case"vector4":return uo;case"color":return zb;case"quaternion":return co;case"bool":case"boolean":return go;case"string":return _o}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function T1(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=w1(r.type);if(r.times===void 0){const t=[],i=[];Bb(r.keys,t,i,"value"),r.times=t,r.values=i}return e.parse!==void 0?e.parse(r):new e(r.name,r.times,r.values,r.interpolation)}const ur={enabled:!1,files:{},add:function(r,e){this.enabled!==!1&&(this.files[r]=e)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};class A1{constructor(e,t,i){const s=this;let l=!1,u=0,f=0,d;const h=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(m){f++,l===!1&&s.onStart!==void 0&&s.onStart(m,u,f),l=!0},this.itemEnd=function(m){u++,s.onProgress!==void 0&&s.onProgress(m,u,f),u===f&&(l=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(m){s.onError!==void 0&&s.onError(m)},this.resolveURL=function(m){return d?d(m):m},this.setURLModifier=function(m){return d=m,this},this.addHandler=function(m,g){return h.push(m,g),this},this.removeHandler=function(m){const g=h.indexOf(m);return g!==-1&&h.splice(g,2),this},this.getHandler=function(m){for(let g=0,v=h.length;g<v;g+=2){const b=h[g],E=h[g+1];if(b.global&&(b.lastIndex=0),b.test(m))return E}return null}}}const R1=new A1;class vo{constructor(e){this.manager=e!==void 0?e:R1,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const i=this;return new Promise(function(s,l){i.load(e,s,t,l)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}vo.DEFAULT_MATERIAL_NAME="__DEFAULT";const Ea={};class C1 extends Error{constructor(e,t){super(e),this.response=t}}class kb extends vo{constructor(e){super(e)}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const l=ur.get(e);if(l!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(l),this.manager.itemEnd(e)},0),l;if(Ea[e]!==void 0){Ea[e].push({onLoad:t,onProgress:i,onError:s});return}Ea[e]=[],Ea[e].push({onLoad:t,onProgress:i,onError:s});const u=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),f=this.mimeType,d=this.responseType;fetch(u).then(h=>{if(h.status===200||h.status===0){if(h.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||h.body===void 0||h.body.getReader===void 0)return h;const m=Ea[e],g=h.body.getReader(),v=h.headers.get("X-File-Size")||h.headers.get("Content-Length"),b=v?parseInt(v):0,E=b!==0;let S=0;const x=new ReadableStream({start(y){T();function T(){g.read().then(({done:N,value:A})=>{if(N)y.close();else{S+=A.byteLength;const P=new ProgressEvent("progress",{lengthComputable:E,loaded:S,total:b});for(let F=0,k=m.length;F<k;F++){const z=m[F];z.onProgress&&z.onProgress(P)}y.enqueue(A),T()}},N=>{y.error(N)})}}});return new Response(x)}else throw new C1(`fetch for "${h.url}" responded with ${h.status}: ${h.statusText}`,h)}).then(h=>{switch(d){case"arraybuffer":return h.arrayBuffer();case"blob":return h.blob();case"document":return h.text().then(m=>new DOMParser().parseFromString(m,f));case"json":return h.json();default:if(f===void 0)return h.text();{const g=/charset="?([^;"\s]*)"?/i.exec(f),v=g&&g[1]?g[1].toLowerCase():void 0,b=new TextDecoder(v);return h.arrayBuffer().then(E=>b.decode(E))}}}).then(h=>{ur.add(e,h);const m=Ea[e];delete Ea[e];for(let g=0,v=m.length;g<v;g++){const b=m[g];b.onLoad&&b.onLoad(h)}}).catch(h=>{const m=Ea[e];if(m===void 0)throw this.manager.itemError(e),h;delete Ea[e];for(let g=0,v=m.length;g<v;g++){const b=m[g];b.onError&&b.onError(h)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class D1 extends vo{constructor(e){super(e)}load(e,t,i,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const l=this,u=ur.get(e);if(u!==void 0)return l.manager.itemStart(e),setTimeout(function(){t&&t(u),l.manager.itemEnd(e)},0),u;const f=Ol("img");function d(){m(),ur.add(e,this),t&&t(this),l.manager.itemEnd(e)}function h(g){m(),s&&s(g),l.manager.itemError(e),l.manager.itemEnd(e)}function m(){f.removeEventListener("load",d,!1),f.removeEventListener("error",h,!1)}return f.addEventListener("load",d,!1),f.addEventListener("error",h,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(f.crossOrigin=this.crossOrigin),l.manager.itemStart(e),f.src=e,f}}class N1 extends vo{constructor(e){super(e)}load(e,t,i,s){const l=new wn,u=new D1(this.manager);return u.setCrossOrigin(this.crossOrigin),u.setPath(this.path),u.load(e,function(f){l.image=f,l.needsUpdate=!0,t!==void 0&&t(l)},i,s),l}}class Zu extends en{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new lt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const Uh=new ht,Yv=new X,jv=new X;class dm{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ct(512,512),this.map=null,this.mapPass=null,this.matrix=new ht,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new um,this._frameExtents=new Ct(1,1),this._viewportCount=1,this._viewports=[new Ot(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Yv.setFromMatrixPosition(e.matrixWorld),t.position.copy(Yv),jv.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(jv),t.updateMatrixWorld(),Uh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Uh),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Uh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class L1 extends dm{constructor(){super(new Xn(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,i=so*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height,l=e.distance||t.far;(i!==t.fov||s!==t.aspect||l!==t.far)&&(t.fov=i,t.aspect=s,t.far=l,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class U1 extends Zu{constructor(e,t,i=0,s=Math.PI/3,l=0,u=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(en.DEFAULT_UP),this.updateMatrix(),this.target=new en,this.distance=i,this.angle=s,this.penumbra=l,this.decay=u,this.map=null,this.shadow=new L1}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Kv=new ht,Sl=new X,Ph=new X;class P1 extends dm{constructor(){super(new Xn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ct(4,2),this._viewportCount=6,this._viewports=[new Ot(2,1,1,1),new Ot(0,1,1,1),new Ot(3,1,1,1),new Ot(1,1,1,1),new Ot(3,0,1,1),new Ot(1,0,1,1)],this._cubeDirections=[new X(1,0,0),new X(-1,0,0),new X(0,0,1),new X(0,0,-1),new X(0,1,0),new X(0,-1,0)],this._cubeUps=[new X(0,1,0),new X(0,1,0),new X(0,1,0),new X(0,1,0),new X(0,0,1),new X(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,s=this.matrix,l=e.distance||i.far;l!==i.far&&(i.far=l,i.updateProjectionMatrix()),Sl.setFromMatrixPosition(e.matrixWorld),i.position.copy(Sl),Ph.copy(i.position),Ph.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Ph),i.updateMatrixWorld(),s.makeTranslation(-Sl.x,-Sl.y,-Sl.z),Kv.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Kv)}}class O1 extends Zu{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new P1}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class hm extends Nb{constructor(e=-1,t=1,i=1,s=-1,l=.1,u=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=l,this.far=u,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,l,u){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=l,this.view.height=u,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let l=i-e,u=i+e,f=s+t,d=s-t;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,m=(this.top-this.bottom)/this.view.fullHeight/this.zoom;l+=h*this.view.offsetX,u=l+h*this.view.width,f-=m*this.view.offsetY,d=f-m*this.view.height}this.projectionMatrix.makeOrthographic(l,u,f,d,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class I1 extends dm{constructor(){super(new hm(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Hb extends Zu{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(en.DEFAULT_UP),this.updateMatrix(),this.target=new en,this.shadow=new I1}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class F1 extends Zu{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Dl{static decodeText(e){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let i=0,s=e.length;i<s;i++)t+=String.fromCharCode(e[i]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class B1 extends vo{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const l=this,u=ur.get(e);if(u!==void 0){if(l.manager.itemStart(e),u.then){u.then(h=>{t&&t(h),l.manager.itemEnd(e)}).catch(h=>{s&&s(h)});return}return setTimeout(function(){t&&t(u),l.manager.itemEnd(e)},0),u}const f={};f.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",f.headers=this.requestHeader;const d=fetch(e,f).then(function(h){return h.blob()}).then(function(h){return createImageBitmap(h,Object.assign(l.options,{colorSpaceConversion:"none"}))}).then(function(h){return ur.add(e,h),t&&t(h),l.manager.itemEnd(e),h}).catch(function(h){s&&s(h),ur.remove(e),l.manager.itemError(e),l.manager.itemEnd(e)});ur.add(e,d),l.manager.itemStart(e)}}class z1 extends Xn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e,this.index=0}}class k1{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Zv(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=Zv();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function Zv(){return performance.now()}const pm="\\[\\]\\.:\\/",H1=new RegExp("["+pm+"]","g"),mm="[^"+pm+"]",V1="[^"+pm.replace("\\.","")+"]",G1=/((?:WC+[\/:])*)/.source.replace("WC",mm),W1=/(WCOD+)?/.source.replace("WCOD",V1),X1=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",mm),q1=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",mm),Y1=new RegExp("^"+G1+W1+X1+q1+"$"),j1=["material","materials","bones","map"];class K1{constructor(e,t,i){const s=i||zt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();const i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){const i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,l=i.length;s!==l;++s)i[s].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}}class zt{constructor(e,t,i){this.path=t,this.parsedPath=i||zt.parseTrackName(t),this.node=zt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new zt.Composite(e,t,i):new zt(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(H1,"")}static parseTrackName(e){const t=Y1.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const l=i.nodeName.substring(s+1);j1.indexOf(l)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=l)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){const i=function(l){for(let u=0;u<l.length;u++){const f=l[u];if(f.name===t||f.uuid===t)return f;const d=i(f.children);if(d)return d}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const i=this.resolvedProperty;for(let s=0,l=i.length;s!==l;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const i=this.resolvedProperty;for(let s=0,l=i.length;s!==l;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const i=this.resolvedProperty;for(let s=0,l=i.length;s!==l;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const i=this.resolvedProperty;for(let s=0,l=i.length;s!==l;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,i=t.objectName,s=t.propertyName;let l=t.propertyIndex;if(e||(e=zt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let h=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let m=0;m<e.length;m++)if(e[m].name===h){h=m;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(h!==void 0){if(e[h]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[h]}}const u=e[s];if(u===void 0){const h=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+h+"."+s+" but it wasn't found.",e);return}let f=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?f=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(f=this.Versioning.MatrixWorldNeedsUpdate);let d=this.BindingType.Direct;if(l!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[l]!==void 0&&(l=e.morphTargetDictionary[l])}d=this.BindingType.ArrayElement,this.resolvedProperty=u,this.propertyIndex=l}else u.fromArray!==void 0&&u.toArray!==void 0?(d=this.BindingType.HasFromToArray,this.resolvedProperty=u):Array.isArray(u)?(d=this.BindingType.EntireArray,this.resolvedProperty=u):this.propertyName=s;this.getValue=this.GetterByBindingType[d],this.setValue=this.SetterByBindingTypeAndVersioning[d][f]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}zt.Composite=K1;zt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};zt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};zt.prototype.GetterByBindingType=[zt.prototype._getValue_direct,zt.prototype._getValue_array,zt.prototype._getValue_arrayElement,zt.prototype._getValue_toArray];zt.prototype.SetterByBindingTypeAndVersioning=[[zt.prototype._setValue_direct,zt.prototype._setValue_direct_setNeedsUpdate,zt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[zt.prototype._setValue_array,zt.prototype._setValue_array_setNeedsUpdate,zt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[zt.prototype._setValue_arrayElement,zt.prototype._setValue_arrayElement_setNeedsUpdate,zt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[zt.prototype._setValue_fromArray,zt.prototype._setValue_fromArray_setNeedsUpdate,zt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];function $v(r,e,t,i){const s=Z1(i);switch(t){case mb:return r*e;case _b:return r*e;case vb:return r*e*2;case tm:return r*e/s.components*s.byteLength;case nm:return r*e/s.components*s.byteLength;case yb:return r*e*2/s.components*s.byteLength;case im:return r*e*2/s.components*s.byteLength;case gb:return r*e*3/s.components*s.byteLength;case Mi:return r*e*4/s.components*s.byteLength;case am:return r*e*4/s.components*s.byteLength;case Du:case Nu:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Lu:case Uu:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case rp:case op:return Math.max(r,16)*Math.max(e,8)/4;case ap:case sp:return Math.max(r,8)*Math.max(e,8)/2;case lp:case cp:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case up:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case fp:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case dp:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case hp:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case pp:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case mp:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case gp:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case _p:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case vp:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case yp:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case bp:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case xp:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case Ep:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case Mp:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case Sp:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case Pu:case wp:case Tp:return Math.ceil(r/4)*Math.ceil(e/4)*16;case bb:case Ap:return Math.ceil(r/4)*Math.ceil(e/4)*8;case Rp:case Cp:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Z1(r){switch(r){case La:case db:return{byteLength:1,components:1};case Ll:case hb:case Hl:return{byteLength:2,components:1};case Jp:case em:return{byteLength:2,components:4};case Qr:case Qp:case Oi:return{byteLength:4,components:1};case pb:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:$p}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=$p);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Vb(){let r=null,e=!1,t=null,i=null;function s(l,u){t(l,u),i=r.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=r.requestAnimationFrame(s),e=!0)},stop:function(){r.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(l){t=l},setContext:function(l){r=l}}}function $1(r){const e=new WeakMap;function t(f,d){const h=f.array,m=f.usage,g=h.byteLength,v=r.createBuffer();r.bindBuffer(d,v),r.bufferData(d,h,m),f.onUploadCallback();let b;if(h instanceof Float32Array)b=r.FLOAT;else if(h instanceof Uint16Array)f.isFloat16BufferAttribute?b=r.HALF_FLOAT:b=r.UNSIGNED_SHORT;else if(h instanceof Int16Array)b=r.SHORT;else if(h instanceof Uint32Array)b=r.UNSIGNED_INT;else if(h instanceof Int32Array)b=r.INT;else if(h instanceof Int8Array)b=r.BYTE;else if(h instanceof Uint8Array)b=r.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)b=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:v,type:b,bytesPerElement:h.BYTES_PER_ELEMENT,version:f.version,size:g}}function i(f,d,h){const m=d.array,g=d.updateRanges;if(r.bindBuffer(h,f),g.length===0)r.bufferSubData(h,0,m);else{g.sort((b,E)=>b.start-E.start);let v=0;for(let b=1;b<g.length;b++){const E=g[v],S=g[b];S.start<=E.start+E.count+1?E.count=Math.max(E.count,S.start+S.count-E.start):(++v,g[v]=S)}g.length=v+1;for(let b=0,E=g.length;b<E;b++){const S=g[b];r.bufferSubData(h,S.start*m.BYTES_PER_ELEMENT,m,S.start,S.count)}d.clearUpdateRanges()}d.onUploadCallback()}function s(f){return f.isInterleavedBufferAttribute&&(f=f.data),e.get(f)}function l(f){f.isInterleavedBufferAttribute&&(f=f.data);const d=e.get(f);d&&(r.deleteBuffer(d.buffer),e.delete(f))}function u(f,d){if(f.isInterleavedBufferAttribute&&(f=f.data),f.isGLBufferAttribute){const m=e.get(f);(!m||m.version<f.version)&&e.set(f,{buffer:f.buffer,type:f.type,bytesPerElement:f.elementSize,version:f.version});return}const h=e.get(f);if(h===void 0)e.set(f,t(f,d));else if(h.version<f.version){if(h.size!==f.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,f,d),h.version=f.version}}return{get:s,remove:l,update:u}}var Q1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,J1=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,eA=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,tA=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,nA=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,iA=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aA=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,rA=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,sA=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,oA=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,lA=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,cA=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,uA=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,fA=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,dA=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,hA=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,pA=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,mA=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,gA=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_A=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,vA=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,yA=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,bA=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,xA=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,EA=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,MA=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,SA=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,wA=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,TA=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,AA=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,RA="gl_FragColor = linearToOutputTexel( gl_FragColor );",CA=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,DA=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,NA=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,LA=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,UA=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,PA=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,OA=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,IA=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,FA=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,BA=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,zA=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,kA=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,HA=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,VA=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,GA=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,WA=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,XA=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,qA=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,YA=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,jA=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,KA=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,ZA=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,$A=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,QA=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,JA=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,eR=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,tR=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,nR=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,iR=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,aR=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,rR=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,sR=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,oR=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,lR=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,cR=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,uR=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,fR=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,dR=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hR=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,pR=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,mR=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,gR=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,_R=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vR=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,yR=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,bR=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,xR=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ER=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,MR=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,SR=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,wR=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,TR=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,AR=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,RR=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,CR=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,DR=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,NR=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,LR=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,UR=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,PR=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,OR=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,IR=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,FR=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,BR=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,zR=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,kR=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,HR=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,VR=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,GR=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,WR=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,XR=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,qR=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,YR=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,jR=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,KR=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,ZR=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const $R=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,QR=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,JR=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,e2=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,t2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,n2=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,i2=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,a2=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,r2=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,s2=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,o2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,l2=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,c2=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,u2=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,f2=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,d2=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,h2=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,p2=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,m2=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,g2=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_2=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,v2=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,y2=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,b2=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,x2=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,E2=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,M2=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,S2=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,w2=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,T2=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,A2=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,R2=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,C2=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,D2=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,mt={alphahash_fragment:Q1,alphahash_pars_fragment:J1,alphamap_fragment:eA,alphamap_pars_fragment:tA,alphatest_fragment:nA,alphatest_pars_fragment:iA,aomap_fragment:aA,aomap_pars_fragment:rA,batching_pars_vertex:sA,batching_vertex:oA,begin_vertex:lA,beginnormal_vertex:cA,bsdfs:uA,iridescence_fragment:fA,bumpmap_pars_fragment:dA,clipping_planes_fragment:hA,clipping_planes_pars_fragment:pA,clipping_planes_pars_vertex:mA,clipping_planes_vertex:gA,color_fragment:_A,color_pars_fragment:vA,color_pars_vertex:yA,color_vertex:bA,common:xA,cube_uv_reflection_fragment:EA,defaultnormal_vertex:MA,displacementmap_pars_vertex:SA,displacementmap_vertex:wA,emissivemap_fragment:TA,emissivemap_pars_fragment:AA,colorspace_fragment:RA,colorspace_pars_fragment:CA,envmap_fragment:DA,envmap_common_pars_fragment:NA,envmap_pars_fragment:LA,envmap_pars_vertex:UA,envmap_physical_pars_fragment:WA,envmap_vertex:PA,fog_vertex:OA,fog_pars_vertex:IA,fog_fragment:FA,fog_pars_fragment:BA,gradientmap_pars_fragment:zA,lightmap_pars_fragment:kA,lights_lambert_fragment:HA,lights_lambert_pars_fragment:VA,lights_pars_begin:GA,lights_toon_fragment:XA,lights_toon_pars_fragment:qA,lights_phong_fragment:YA,lights_phong_pars_fragment:jA,lights_physical_fragment:KA,lights_physical_pars_fragment:ZA,lights_fragment_begin:$A,lights_fragment_maps:QA,lights_fragment_end:JA,logdepthbuf_fragment:eR,logdepthbuf_pars_fragment:tR,logdepthbuf_pars_vertex:nR,logdepthbuf_vertex:iR,map_fragment:aR,map_pars_fragment:rR,map_particle_fragment:sR,map_particle_pars_fragment:oR,metalnessmap_fragment:lR,metalnessmap_pars_fragment:cR,morphinstance_vertex:uR,morphcolor_vertex:fR,morphnormal_vertex:dR,morphtarget_pars_vertex:hR,morphtarget_vertex:pR,normal_fragment_begin:mR,normal_fragment_maps:gR,normal_pars_fragment:_R,normal_pars_vertex:vR,normal_vertex:yR,normalmap_pars_fragment:bR,clearcoat_normal_fragment_begin:xR,clearcoat_normal_fragment_maps:ER,clearcoat_pars_fragment:MR,iridescence_pars_fragment:SR,opaque_fragment:wR,packing:TR,premultiplied_alpha_fragment:AR,project_vertex:RR,dithering_fragment:CR,dithering_pars_fragment:DR,roughnessmap_fragment:NR,roughnessmap_pars_fragment:LR,shadowmap_pars_fragment:UR,shadowmap_pars_vertex:PR,shadowmap_vertex:OR,shadowmask_pars_fragment:IR,skinbase_vertex:FR,skinning_pars_vertex:BR,skinning_vertex:zR,skinnormal_vertex:kR,specularmap_fragment:HR,specularmap_pars_fragment:VR,tonemapping_fragment:GR,tonemapping_pars_fragment:WR,transmission_fragment:XR,transmission_pars_fragment:qR,uv_pars_fragment:YR,uv_pars_vertex:jR,uv_vertex:KR,worldpos_vertex:ZR,background_vert:$R,background_frag:QR,backgroundCube_vert:JR,backgroundCube_frag:e2,cube_vert:t2,cube_frag:n2,depth_vert:i2,depth_frag:a2,distanceRGBA_vert:r2,distanceRGBA_frag:s2,equirect_vert:o2,equirect_frag:l2,linedashed_vert:c2,linedashed_frag:u2,meshbasic_vert:f2,meshbasic_frag:d2,meshlambert_vert:h2,meshlambert_frag:p2,meshmatcap_vert:m2,meshmatcap_frag:g2,meshnormal_vert:_2,meshnormal_frag:v2,meshphong_vert:y2,meshphong_frag:b2,meshphysical_vert:x2,meshphysical_frag:E2,meshtoon_vert:M2,meshtoon_frag:S2,points_vert:w2,points_frag:T2,shadow_vert:A2,shadow_frag:R2,sprite_vert:C2,sprite_frag:D2},Fe={common:{diffuse:{value:new lt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new dt},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new dt}},envmap:{envMap:{value:null},envMapRotation:{value:new dt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new dt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new dt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new dt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new dt},normalScale:{value:new Ct(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new dt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new dt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new dt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new dt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new lt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new lt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0},uvTransform:{value:new dt}},sprite:{diffuse:{value:new lt(16777215)},opacity:{value:1},center:{value:new Ct(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new dt},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0}}},qi={basic:{uniforms:Gn([Fe.common,Fe.specularmap,Fe.envmap,Fe.aomap,Fe.lightmap,Fe.fog]),vertexShader:mt.meshbasic_vert,fragmentShader:mt.meshbasic_frag},lambert:{uniforms:Gn([Fe.common,Fe.specularmap,Fe.envmap,Fe.aomap,Fe.lightmap,Fe.emissivemap,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,Fe.fog,Fe.lights,{emissive:{value:new lt(0)}}]),vertexShader:mt.meshlambert_vert,fragmentShader:mt.meshlambert_frag},phong:{uniforms:Gn([Fe.common,Fe.specularmap,Fe.envmap,Fe.aomap,Fe.lightmap,Fe.emissivemap,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,Fe.fog,Fe.lights,{emissive:{value:new lt(0)},specular:{value:new lt(1118481)},shininess:{value:30}}]),vertexShader:mt.meshphong_vert,fragmentShader:mt.meshphong_frag},standard:{uniforms:Gn([Fe.common,Fe.envmap,Fe.aomap,Fe.lightmap,Fe.emissivemap,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,Fe.roughnessmap,Fe.metalnessmap,Fe.fog,Fe.lights,{emissive:{value:new lt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:mt.meshphysical_vert,fragmentShader:mt.meshphysical_frag},toon:{uniforms:Gn([Fe.common,Fe.aomap,Fe.lightmap,Fe.emissivemap,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,Fe.gradientmap,Fe.fog,Fe.lights,{emissive:{value:new lt(0)}}]),vertexShader:mt.meshtoon_vert,fragmentShader:mt.meshtoon_frag},matcap:{uniforms:Gn([Fe.common,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,Fe.fog,{matcap:{value:null}}]),vertexShader:mt.meshmatcap_vert,fragmentShader:mt.meshmatcap_frag},points:{uniforms:Gn([Fe.points,Fe.fog]),vertexShader:mt.points_vert,fragmentShader:mt.points_frag},dashed:{uniforms:Gn([Fe.common,Fe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:mt.linedashed_vert,fragmentShader:mt.linedashed_frag},depth:{uniforms:Gn([Fe.common,Fe.displacementmap]),vertexShader:mt.depth_vert,fragmentShader:mt.depth_frag},normal:{uniforms:Gn([Fe.common,Fe.bumpmap,Fe.normalmap,Fe.displacementmap,{opacity:{value:1}}]),vertexShader:mt.meshnormal_vert,fragmentShader:mt.meshnormal_frag},sprite:{uniforms:Gn([Fe.sprite,Fe.fog]),vertexShader:mt.sprite_vert,fragmentShader:mt.sprite_frag},background:{uniforms:{uvTransform:{value:new dt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:mt.background_vert,fragmentShader:mt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new dt}},vertexShader:mt.backgroundCube_vert,fragmentShader:mt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:mt.cube_vert,fragmentShader:mt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:mt.equirect_vert,fragmentShader:mt.equirect_frag},distanceRGBA:{uniforms:Gn([Fe.common,Fe.displacementmap,{referencePosition:{value:new X},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:mt.distanceRGBA_vert,fragmentShader:mt.distanceRGBA_frag},shadow:{uniforms:Gn([Fe.lights,Fe.fog,{color:{value:new lt(0)},opacity:{value:1}}]),vertexShader:mt.shadow_vert,fragmentShader:mt.shadow_frag}};qi.physical={uniforms:Gn([qi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new dt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new dt},clearcoatNormalScale:{value:new Ct(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new dt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new dt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new dt},sheen:{value:0},sheenColor:{value:new lt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new dt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new dt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new dt},transmissionSamplerSize:{value:new Ct},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new dt},attenuationDistance:{value:0},attenuationColor:{value:new lt(0)},specularColor:{value:new lt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new dt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new dt},anisotropyVector:{value:new Ct},anisotropyMap:{value:null},anisotropyMapTransform:{value:new dt}}]),vertexShader:mt.meshphysical_vert,fragmentShader:mt.meshphysical_frag};const Mu={r:0,b:0,g:0},kr=new Ki,N2=new ht;function L2(r,e,t,i,s,l,u){const f=new lt(0);let d=l===!0?0:1,h,m,g=null,v=0,b=null;function E(N){let A=N.isScene===!0?N.background:null;return A&&A.isTexture&&(A=(N.backgroundBlurriness>0?t:e).get(A)),A}function S(N){let A=!1;const P=E(N);P===null?y(f,d):P&&P.isColor&&(y(P,1),A=!0);const F=r.xr.getEnvironmentBlendMode();F==="additive"?i.buffers.color.setClear(0,0,0,1,u):F==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,u),(r.autoClear||A)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function x(N,A){const P=E(A);P&&(P.isCubeTexture||P.mapping===ju)?(m===void 0&&(m=new Bt(new Wn(1,1,1),new hr({name:"BackgroundCubeMaterial",uniforms:oo(qi.backgroundCube.uniforms),vertexShader:qi.backgroundCube.vertexShader,fragmentShader:qi.backgroundCube.fragmentShader,side:ei,depthTest:!1,depthWrite:!1,fog:!1})),m.geometry.deleteAttribute("normal"),m.geometry.deleteAttribute("uv"),m.onBeforeRender=function(F,k,z){this.matrixWorld.copyPosition(z.matrixWorld)},Object.defineProperty(m.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(m)),kr.copy(A.backgroundRotation),kr.x*=-1,kr.y*=-1,kr.z*=-1,P.isCubeTexture&&P.isRenderTargetTexture===!1&&(kr.y*=-1,kr.z*=-1),m.material.uniforms.envMap.value=P,m.material.uniforms.flipEnvMap.value=P.isCubeTexture&&P.isRenderTargetTexture===!1?-1:1,m.material.uniforms.backgroundBlurriness.value=A.backgroundBlurriness,m.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,m.material.uniforms.backgroundRotation.value.setFromMatrix4(N2.makeRotationFromEuler(kr)),m.material.toneMapped=Rt.getTransfer(P.colorSpace)!==Xt,(g!==P||v!==P.version||b!==r.toneMapping)&&(m.material.needsUpdate=!0,g=P,v=P.version,b=r.toneMapping),m.layers.enableAll(),N.unshift(m,m.geometry,m.material,0,0,null)):P&&P.isTexture&&(h===void 0&&(h=new Bt(new Vl(2,2),new hr({name:"BackgroundMaterial",uniforms:oo(qi.background.uniforms),vertexShader:qi.background.vertexShader,fragmentShader:qi.background.fragmentShader,side:Na,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=P,h.material.uniforms.backgroundIntensity.value=A.backgroundIntensity,h.material.toneMapped=Rt.getTransfer(P.colorSpace)!==Xt,P.matrixAutoUpdate===!0&&P.updateMatrix(),h.material.uniforms.uvTransform.value.copy(P.matrix),(g!==P||v!==P.version||b!==r.toneMapping)&&(h.material.needsUpdate=!0,g=P,v=P.version,b=r.toneMapping),h.layers.enableAll(),N.unshift(h,h.geometry,h.material,0,0,null))}function y(N,A){N.getRGB(Mu,Db(r)),i.buffers.color.setClear(Mu.r,Mu.g,Mu.b,A,u)}function T(){m!==void 0&&(m.geometry.dispose(),m.material.dispose(),m=void 0),h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0)}return{getClearColor:function(){return f},setClearColor:function(N,A=1){f.set(N),d=A,y(f,d)},getClearAlpha:function(){return d},setClearAlpha:function(N){d=N,y(f,d)},render:S,addToRenderList:x,dispose:T}}function U2(r,e){const t=r.getParameter(r.MAX_VERTEX_ATTRIBS),i={},s=v(null);let l=s,u=!1;function f(C,H,J,K,ce){let de=!1;const W=g(K,J,H);l!==W&&(l=W,h(l.object)),de=b(C,K,J,ce),de&&E(C,K,J,ce),ce!==null&&e.update(ce,r.ELEMENT_ARRAY_BUFFER),(de||u)&&(u=!1,A(C,H,J,K),ce!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(ce).buffer))}function d(){return r.createVertexArray()}function h(C){return r.bindVertexArray(C)}function m(C){return r.deleteVertexArray(C)}function g(C,H,J){const K=J.wireframe===!0;let ce=i[C.id];ce===void 0&&(ce={},i[C.id]=ce);let de=ce[H.id];de===void 0&&(de={},ce[H.id]=de);let W=de[K];return W===void 0&&(W=v(d()),de[K]=W),W}function v(C){const H=[],J=[],K=[];for(let ce=0;ce<t;ce++)H[ce]=0,J[ce]=0,K[ce]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:H,enabledAttributes:J,attributeDivisors:K,object:C,attributes:{},index:null}}function b(C,H,J,K){const ce=l.attributes,de=H.attributes;let W=0;const le=J.getAttributes();for(const Y in le)if(le[Y].location>=0){const I=ce[Y];let re=de[Y];if(re===void 0&&(Y==="instanceMatrix"&&C.instanceMatrix&&(re=C.instanceMatrix),Y==="instanceColor"&&C.instanceColor&&(re=C.instanceColor)),I===void 0||I.attribute!==re||re&&I.data!==re.data)return!0;W++}return l.attributesNum!==W||l.index!==K}function E(C,H,J,K){const ce={},de=H.attributes;let W=0;const le=J.getAttributes();for(const Y in le)if(le[Y].location>=0){let I=de[Y];I===void 0&&(Y==="instanceMatrix"&&C.instanceMatrix&&(I=C.instanceMatrix),Y==="instanceColor"&&C.instanceColor&&(I=C.instanceColor));const re={};re.attribute=I,I&&I.data&&(re.data=I.data),ce[Y]=re,W++}l.attributes=ce,l.attributesNum=W,l.index=K}function S(){const C=l.newAttributes;for(let H=0,J=C.length;H<J;H++)C[H]=0}function x(C){y(C,0)}function y(C,H){const J=l.newAttributes,K=l.enabledAttributes,ce=l.attributeDivisors;J[C]=1,K[C]===0&&(r.enableVertexAttribArray(C),K[C]=1),ce[C]!==H&&(r.vertexAttribDivisor(C,H),ce[C]=H)}function T(){const C=l.newAttributes,H=l.enabledAttributes;for(let J=0,K=H.length;J<K;J++)H[J]!==C[J]&&(r.disableVertexAttribArray(J),H[J]=0)}function N(C,H,J,K,ce,de,W){W===!0?r.vertexAttribIPointer(C,H,J,ce,de):r.vertexAttribPointer(C,H,J,K,ce,de)}function A(C,H,J,K){S();const ce=K.attributes,de=J.getAttributes(),W=H.defaultAttributeValues;for(const le in de){const Y=de[le];if(Y.location>=0){let ye=ce[le];if(ye===void 0&&(le==="instanceMatrix"&&C.instanceMatrix&&(ye=C.instanceMatrix),le==="instanceColor"&&C.instanceColor&&(ye=C.instanceColor)),ye!==void 0){const I=ye.normalized,re=ye.itemSize,Se=e.get(ye);if(Se===void 0)continue;const Ne=Se.buffer,Q=Se.type,me=Se.bytesPerElement,xe=Q===r.INT||Q===r.UNSIGNED_INT||ye.gpuType===Qp;if(ye.isInterleavedBufferAttribute){const we=ye.data,Ce=we.stride,Ke=ye.offset;if(we.isInstancedInterleavedBuffer){for(let Oe=0;Oe<Y.locationSize;Oe++)y(Y.location+Oe,we.meshPerAttribute);C.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=we.meshPerAttribute*we.count)}else for(let Oe=0;Oe<Y.locationSize;Oe++)x(Y.location+Oe);r.bindBuffer(r.ARRAY_BUFFER,Ne);for(let Oe=0;Oe<Y.locationSize;Oe++)N(Y.location+Oe,re/Y.locationSize,Q,I,Ce*me,(Ke+re/Y.locationSize*Oe)*me,xe)}else{if(ye.isInstancedBufferAttribute){for(let we=0;we<Y.locationSize;we++)y(Y.location+we,ye.meshPerAttribute);C.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=ye.meshPerAttribute*ye.count)}else for(let we=0;we<Y.locationSize;we++)x(Y.location+we);r.bindBuffer(r.ARRAY_BUFFER,Ne);for(let we=0;we<Y.locationSize;we++)N(Y.location+we,re/Y.locationSize,Q,I,re*me,re/Y.locationSize*we*me,xe)}}else if(W!==void 0){const I=W[le];if(I!==void 0)switch(I.length){case 2:r.vertexAttrib2fv(Y.location,I);break;case 3:r.vertexAttrib3fv(Y.location,I);break;case 4:r.vertexAttrib4fv(Y.location,I);break;default:r.vertexAttrib1fv(Y.location,I)}}}}T()}function P(){z();for(const C in i){const H=i[C];for(const J in H){const K=H[J];for(const ce in K)m(K[ce].object),delete K[ce];delete H[J]}delete i[C]}}function F(C){if(i[C.id]===void 0)return;const H=i[C.id];for(const J in H){const K=H[J];for(const ce in K)m(K[ce].object),delete K[ce];delete H[J]}delete i[C.id]}function k(C){for(const H in i){const J=i[H];if(J[C.id]===void 0)continue;const K=J[C.id];for(const ce in K)m(K[ce].object),delete K[ce];delete J[C.id]}}function z(){R(),u=!0,l!==s&&(l=s,h(l.object))}function R(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:f,reset:z,resetDefaultState:R,dispose:P,releaseStatesOfGeometry:F,releaseStatesOfProgram:k,initAttributes:S,enableAttribute:x,disableUnusedAttributes:T}}function P2(r,e,t){let i;function s(h){i=h}function l(h,m){r.drawArrays(i,h,m),t.update(m,i,1)}function u(h,m,g){g!==0&&(r.drawArraysInstanced(i,h,m,g),t.update(m,i,g))}function f(h,m,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,m,0,g);let b=0;for(let E=0;E<g;E++)b+=m[E];t.update(b,i,1)}function d(h,m,g,v){if(g===0)return;const b=e.get("WEBGL_multi_draw");if(b===null)for(let E=0;E<h.length;E++)u(h[E],m[E],v[E]);else{b.multiDrawArraysInstancedWEBGL(i,h,0,m,0,v,0,g);let E=0;for(let S=0;S<g;S++)E+=m[S]*v[S];t.update(E,i,1)}}this.setMode=s,this.render=l,this.renderInstances=u,this.renderMultiDraw=f,this.renderMultiDrawInstances=d}function O2(r,e,t,i){let s;function l(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const k=e.get("EXT_texture_filter_anisotropic");s=r.getParameter(k.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function u(k){return!(k!==Mi&&i.convert(k)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function f(k){const z=k===Hl&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(k!==La&&i.convert(k)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&k!==Oi&&!z)}function d(k){if(k==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";k="mediump"}return k==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=t.precision!==void 0?t.precision:"highp";const m=d(h);m!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",m,"instead."),h=m);const g=t.logarithmicDepthBuffer===!0,v=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),b=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),E=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=r.getParameter(r.MAX_TEXTURE_SIZE),x=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),y=r.getParameter(r.MAX_VERTEX_ATTRIBS),T=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),N=r.getParameter(r.MAX_VARYING_VECTORS),A=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),P=E>0,F=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:l,getMaxPrecision:d,textureFormatReadable:u,textureTypeReadable:f,precision:h,logarithmicDepthBuffer:g,reverseDepthBuffer:v,maxTextures:b,maxVertexTextures:E,maxTextureSize:S,maxCubemapSize:x,maxAttributes:y,maxVertexUniforms:T,maxVaryings:N,maxFragmentUniforms:A,vertexTextures:P,maxSamples:F}}function I2(r){const e=this;let t=null,i=0,s=!1,l=!1;const u=new Yr,f=new dt,d={value:null,needsUpdate:!1};this.uniform=d,this.numPlanes=0,this.numIntersection=0,this.init=function(g,v){const b=g.length!==0||v||i!==0||s;return s=v,i=g.length,b},this.beginShadows=function(){l=!0,m(null)},this.endShadows=function(){l=!1},this.setGlobalState=function(g,v){t=m(g,v,0)},this.setState=function(g,v,b){const E=g.clippingPlanes,S=g.clipIntersection,x=g.clipShadows,y=r.get(g);if(!s||E===null||E.length===0||l&&!x)l?m(null):h();else{const T=l?0:i,N=T*4;let A=y.clippingState||null;d.value=A,A=m(E,v,N,b);for(let P=0;P!==N;++P)A[P]=t[P];y.clippingState=A,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=T}};function h(){d.value!==t&&(d.value=t,d.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function m(g,v,b,E){const S=g!==null?g.length:0;let x=null;if(S!==0){if(x=d.value,E!==!0||x===null){const y=b+S*4,T=v.matrixWorldInverse;f.getNormalMatrix(T),(x===null||x.length<y)&&(x=new Float32Array(y));for(let N=0,A=b;N!==S;++N,A+=4)u.copy(g[N]).applyMatrix4(T,f),u.normal.toArray(x,A),x[A+3]=u.constant}d.value=x,d.needsUpdate=!0}return e.numPlanes=S,e.numIntersection=0,x}}function F2(r){let e=new WeakMap;function t(u,f){return f===np?u.mapping=to:f===ip&&(u.mapping=no),u}function i(u){if(u&&u.isTexture){const f=u.mapping;if(f===np||f===ip)if(e.has(u)){const d=e.get(u).texture;return t(d,u.mapping)}else{const d=u.image;if(d&&d.height>0){const h=new n1(d.height);return h.fromEquirectangularTexture(r,u),e.set(u,h),u.addEventListener("dispose",s),t(h.texture,u.mapping)}else return null}}return u}function s(u){const f=u.target;f.removeEventListener("dispose",s);const d=e.get(f);d!==void 0&&(e.delete(f),d.dispose())}function l(){e=new WeakMap}return{get:i,dispose:l}}const Ks=4,Qv=[.125,.215,.35,.446,.526,.582],Zr=20,Oh=new hm,Jv=new lt;let Ih=null,Fh=0,Bh=0,zh=!1;const jr=(1+Math.sqrt(5))/2,Ys=1/jr,ey=[new X(-jr,Ys,0),new X(jr,Ys,0),new X(-Ys,0,jr),new X(Ys,0,jr),new X(0,jr,-Ys),new X(0,jr,Ys),new X(-1,1,-1),new X(1,1,-1),new X(-1,1,1),new X(1,1,1)],B2=new X;class ty{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100,l={}){const{size:u=256,position:f=B2}=l;Ih=this._renderer.getRenderTarget(),Fh=this._renderer.getActiveCubeFace(),Bh=this._renderer.getActiveMipmapLevel(),zh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(u);const d=this._allocateTargets();return d.depthBuffer=!0,this._sceneToCubeUV(e,i,s,d,f),t>0&&this._blur(d,0,0,t),this._applyPMREM(d),this._cleanup(d),d}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ay(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=iy(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ih,Fh,Bh),this._renderer.xr.enabled=zh,e.scissorTest=!1,Su(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===to||e.mapping===no?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ih=this._renderer.getRenderTarget(),Fh=this._renderer.getActiveCubeFace(),Bh=this._renderer.getActiveMipmapLevel(),zh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:ci,minFilter:ci,generateMipmaps:!1,type:Hl,format:Mi,colorSpace:jn,depthBuffer:!1},s=ny(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ny(e,t,i);const{_lodMax:l}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=z2(l)),this._blurMaterial=k2(l,e,t)}return s}_compileMaterial(e){const t=new Bt(this._lodPlanes[0],e);this._renderer.compile(t,Oh)}_sceneToCubeUV(e,t,i,s,l){const d=new Xn(90,1,t,i),h=[1,-1,1,1,1,1],m=[1,1,1,-1,-1,-1],g=this._renderer,v=g.autoClear,b=g.toneMapping;g.getClearColor(Jv),g.toneMapping=dr,g.autoClear=!1;const E=new Aa({name:"PMREM.Background",side:ei,depthWrite:!1,depthTest:!1}),S=new Bt(new Wn,E);let x=!1;const y=e.background;y?y.isColor&&(E.color.copy(y),e.background=null,x=!0):(E.color.copy(Jv),x=!0);for(let T=0;T<6;T++){const N=T%3;N===0?(d.up.set(0,h[T],0),d.position.set(l.x,l.y,l.z),d.lookAt(l.x+m[T],l.y,l.z)):N===1?(d.up.set(0,0,h[T]),d.position.set(l.x,l.y,l.z),d.lookAt(l.x,l.y+m[T],l.z)):(d.up.set(0,h[T],0),d.position.set(l.x,l.y,l.z),d.lookAt(l.x,l.y,l.z+m[T]));const A=this._cubeSize;Su(s,N*A,T>2?A:0,A,A),g.setRenderTarget(s),x&&g.render(S,d),g.render(e,d)}S.geometry.dispose(),S.material.dispose(),g.toneMapping=b,g.autoClear=v,e.background=y}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===to||e.mapping===no;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ay()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=iy());const l=s?this._cubemapMaterial:this._equirectMaterial,u=new Bt(this._lodPlanes[0],l),f=l.uniforms;f.envMap.value=e;const d=this._cubeSize;Su(t,0,0,3*d,2*d),i.setRenderTarget(t),i.render(u,Oh)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let l=1;l<s;l++){const u=Math.sqrt(this._sigmas[l]*this._sigmas[l]-this._sigmas[l-1]*this._sigmas[l-1]),f=ey[(s-l-1)%ey.length];this._blur(e,l-1,l,u,f)}t.autoClear=i}_blur(e,t,i,s,l){const u=this._pingPongRenderTarget;this._halfBlur(e,u,t,i,s,"latitudinal",l),this._halfBlur(u,e,i,i,s,"longitudinal",l)}_halfBlur(e,t,i,s,l,u,f){const d=this._renderer,h=this._blurMaterial;u!=="latitudinal"&&u!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const m=3,g=new Bt(this._lodPlanes[s],h),v=h.uniforms,b=this._sizeLods[i]-1,E=isFinite(l)?Math.PI/(2*b):2*Math.PI/(2*Zr-1),S=l/E,x=isFinite(l)?1+Math.floor(m*S):Zr;x>Zr&&console.warn(`sigmaRadians, ${l}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${Zr}`);const y=[];let T=0;for(let k=0;k<Zr;++k){const z=k/S,R=Math.exp(-z*z/2);y.push(R),k===0?T+=R:k<x&&(T+=2*R)}for(let k=0;k<y.length;k++)y[k]=y[k]/T;v.envMap.value=e.texture,v.samples.value=x,v.weights.value=y,v.latitudinal.value=u==="latitudinal",f&&(v.poleAxis.value=f);const{_lodMax:N}=this;v.dTheta.value=E,v.mipInt.value=N-i;const A=this._sizeLods[s],P=3*A*(s>N-Ks?s-N+Ks:0),F=4*(this._cubeSize-A);Su(t,P,F,3*A,2*A),d.setRenderTarget(t),d.render(g,Oh)}}function z2(r){const e=[],t=[],i=[];let s=r;const l=r-Ks+1+Qv.length;for(let u=0;u<l;u++){const f=Math.pow(2,s);t.push(f);let d=1/f;u>r-Ks?d=Qv[u-r+Ks-1]:u===0&&(d=0),i.push(d);const h=1/(f-2),m=-h,g=1+h,v=[m,m,g,m,g,g,m,m,g,g,m,g],b=6,E=6,S=3,x=2,y=1,T=new Float32Array(S*E*b),N=new Float32Array(x*E*b),A=new Float32Array(y*E*b);for(let F=0;F<b;F++){const k=F%3*2/3-1,z=F>2?0:-1,R=[k,z,0,k+2/3,z,0,k+2/3,z+1,0,k,z,0,k+2/3,z+1,0,k,z+1,0];T.set(R,S*E*F),N.set(v,x*E*F);const C=[F,F,F,F,F,F];A.set(C,y*E*F)}const P=new zi;P.setAttribute("position",new Yn(T,S)),P.setAttribute("uv",new Yn(N,x)),P.setAttribute("faceIndex",new Yn(A,y)),e.push(P),s>Ks&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function ny(r,e,t){const i=new Jr(r,e,t);return i.texture.mapping=ju,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Su(r,e,t,i,s){r.viewport.set(e,t,i,s),r.scissor.set(e,t,i,s)}function k2(r,e,t){const i=new Float32Array(Zr),s=new X(0,1,0);return new hr({name:"SphericalGaussianBlur",defines:{n:Zr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:gm(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:fr,depthTest:!1,depthWrite:!1})}function iy(){return new hr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:gm(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:fr,depthTest:!1,depthWrite:!1})}function ay(){return new hr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:gm(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:fr,depthTest:!1,depthWrite:!1})}function gm(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function H2(r){let e=new WeakMap,t=null;function i(f){if(f&&f.isTexture){const d=f.mapping,h=d===np||d===ip,m=d===to||d===no;if(h||m){let g=e.get(f);const v=g!==void 0?g.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==v)return t===null&&(t=new ty(r)),g=h?t.fromEquirectangular(f,g):t.fromCubemap(f,g),g.texture.pmremVersion=f.pmremVersion,e.set(f,g),g.texture;if(g!==void 0)return g.texture;{const b=f.image;return h&&b&&b.height>0||m&&b&&s(b)?(t===null&&(t=new ty(r)),g=h?t.fromEquirectangular(f):t.fromCubemap(f),g.texture.pmremVersion=f.pmremVersion,e.set(f,g),f.addEventListener("dispose",l),g.texture):null}}}return f}function s(f){let d=0;const h=6;for(let m=0;m<h;m++)f[m]!==void 0&&d++;return d===h}function l(f){const d=f.target;d.removeEventListener("dispose",l);const h=e.get(d);h!==void 0&&(e.delete(d),h.dispose())}function u(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:u}}function V2(r){const e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=r.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&qr("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function G2(r,e,t,i){const s={},l=new WeakMap;function u(g){const v=g.target;v.index!==null&&e.remove(v.index);for(const E in v.attributes)e.remove(v.attributes[E]);v.removeEventListener("dispose",u),delete s[v.id];const b=l.get(v);b&&(e.remove(b),l.delete(v)),i.releaseStatesOfGeometry(v),v.isInstancedBufferGeometry===!0&&delete v._maxInstanceCount,t.memory.geometries--}function f(g,v){return s[v.id]===!0||(v.addEventListener("dispose",u),s[v.id]=!0,t.memory.geometries++),v}function d(g){const v=g.attributes;for(const b in v)e.update(v[b],r.ARRAY_BUFFER)}function h(g){const v=[],b=g.index,E=g.attributes.position;let S=0;if(b!==null){const T=b.array;S=b.version;for(let N=0,A=T.length;N<A;N+=3){const P=T[N+0],F=T[N+1],k=T[N+2];v.push(P,F,F,k,k,P)}}else if(E!==void 0){const T=E.array;S=E.version;for(let N=0,A=T.length/3-1;N<A;N+=3){const P=N+0,F=N+1,k=N+2;v.push(P,F,F,k,k,P)}}else return;const x=new(Sb(v)?Cb:Rb)(v,1);x.version=S;const y=l.get(g);y&&e.remove(y),l.set(g,x)}function m(g){const v=l.get(g);if(v){const b=g.index;b!==null&&v.version<b.version&&h(g)}else h(g);return l.get(g)}return{get:f,update:d,getWireframeAttribute:m}}function W2(r,e,t){let i;function s(v){i=v}let l,u;function f(v){l=v.type,u=v.bytesPerElement}function d(v,b){r.drawElements(i,b,l,v*u),t.update(b,i,1)}function h(v,b,E){E!==0&&(r.drawElementsInstanced(i,b,l,v*u,E),t.update(b,i,E))}function m(v,b,E){if(E===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,b,0,l,v,0,E);let x=0;for(let y=0;y<E;y++)x+=b[y];t.update(x,i,1)}function g(v,b,E,S){if(E===0)return;const x=e.get("WEBGL_multi_draw");if(x===null)for(let y=0;y<v.length;y++)h(v[y]/u,b[y],S[y]);else{x.multiDrawElementsInstancedWEBGL(i,b,0,l,v,0,S,0,E);let y=0;for(let T=0;T<E;T++)y+=b[T]*S[T];t.update(y,i,1)}}this.setMode=s,this.setIndex=f,this.render=d,this.renderInstances=h,this.renderMultiDraw=m,this.renderMultiDrawInstances=g}function X2(r){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(l,u,f){switch(t.calls++,u){case r.TRIANGLES:t.triangles+=f*(l/3);break;case r.LINES:t.lines+=f*(l/2);break;case r.LINE_STRIP:t.lines+=f*(l-1);break;case r.LINE_LOOP:t.lines+=f*l;break;case r.POINTS:t.points+=f*l;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",u);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function q2(r,e,t){const i=new WeakMap,s=new Ot;function l(u,f,d){const h=u.morphTargetInfluences,m=f.morphAttributes.position||f.morphAttributes.normal||f.morphAttributes.color,g=m!==void 0?m.length:0;let v=i.get(f);if(v===void 0||v.count!==g){let R=function(){k.dispose(),i.delete(f),f.removeEventListener("dispose",R)};v!==void 0&&v.texture.dispose();const b=f.morphAttributes.position!==void 0,E=f.morphAttributes.normal!==void 0,S=f.morphAttributes.color!==void 0,x=f.morphAttributes.position||[],y=f.morphAttributes.normal||[],T=f.morphAttributes.color||[];let N=0;b===!0&&(N=1),E===!0&&(N=2),S===!0&&(N=3);let A=f.attributes.position.count*N,P=1;A>e.maxTextureSize&&(P=Math.ceil(A/e.maxTextureSize),A=e.maxTextureSize);const F=new Float32Array(A*P*4*g),k=new wb(F,A,P,g);k.type=Oi,k.needsUpdate=!0;const z=N*4;for(let C=0;C<g;C++){const H=x[C],J=y[C],K=T[C],ce=A*P*4*C;for(let de=0;de<H.count;de++){const W=de*z;b===!0&&(s.fromBufferAttribute(H,de),F[ce+W+0]=s.x,F[ce+W+1]=s.y,F[ce+W+2]=s.z,F[ce+W+3]=0),E===!0&&(s.fromBufferAttribute(J,de),F[ce+W+4]=s.x,F[ce+W+5]=s.y,F[ce+W+6]=s.z,F[ce+W+7]=0),S===!0&&(s.fromBufferAttribute(K,de),F[ce+W+8]=s.x,F[ce+W+9]=s.y,F[ce+W+10]=s.z,F[ce+W+11]=K.itemSize===4?s.w:1)}}v={count:g,texture:k,size:new Ct(A,P)},i.set(f,v),f.addEventListener("dispose",R)}if(u.isInstancedMesh===!0&&u.morphTexture!==null)d.getUniforms().setValue(r,"morphTexture",u.morphTexture,t);else{let b=0;for(let S=0;S<h.length;S++)b+=h[S];const E=f.morphTargetsRelative?1:1-b;d.getUniforms().setValue(r,"morphTargetBaseInfluence",E),d.getUniforms().setValue(r,"morphTargetInfluences",h)}d.getUniforms().setValue(r,"morphTargetsTexture",v.texture,t),d.getUniforms().setValue(r,"morphTargetsTextureSize",v.size)}return{update:l}}function Y2(r,e,t,i){let s=new WeakMap;function l(d){const h=i.render.frame,m=d.geometry,g=e.get(d,m);if(s.get(g)!==h&&(e.update(g),s.set(g,h)),d.isInstancedMesh&&(d.hasEventListener("dispose",f)===!1&&d.addEventListener("dispose",f),s.get(d)!==h&&(t.update(d.instanceMatrix,r.ARRAY_BUFFER),d.instanceColor!==null&&t.update(d.instanceColor,r.ARRAY_BUFFER),s.set(d,h))),d.isSkinnedMesh){const v=d.skeleton;s.get(v)!==h&&(v.update(),s.set(v,h))}return g}function u(){s=new WeakMap}function f(d){const h=d.target;h.removeEventListener("dispose",f),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:l,dispose:u}}const Gb=new wn,ry=new Fb(1,1),Wb=new wb,Xb=new zT,qb=new Lb,sy=[],oy=[],ly=new Float32Array(16),cy=new Float32Array(9),uy=new Float32Array(4);function yo(r,e,t){const i=r[0];if(i<=0||i>0)return r;const s=e*t;let l=sy[s];if(l===void 0&&(l=new Float32Array(s),sy[s]=l),e!==0){i.toArray(l,0);for(let u=1,f=0;u!==e;++u)f+=t,r[u].toArray(l,f)}return l}function vn(r,e){if(r.length!==e.length)return!1;for(let t=0,i=r.length;t<i;t++)if(r[t]!==e[t])return!1;return!0}function yn(r,e){for(let t=0,i=e.length;t<i;t++)r[t]=e[t]}function $u(r,e){let t=oy[e];t===void 0&&(t=new Int32Array(e),oy[e]=t);for(let i=0;i!==e;++i)t[i]=r.allocateTextureUnit();return t}function j2(r,e){const t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function K2(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vn(t,e))return;r.uniform2fv(this.addr,e),yn(t,e)}}function Z2(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(vn(t,e))return;r.uniform3fv(this.addr,e),yn(t,e)}}function $2(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vn(t,e))return;r.uniform4fv(this.addr,e),yn(t,e)}}function Q2(r,e){const t=this.cache,i=e.elements;if(i===void 0){if(vn(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),yn(t,e)}else{if(vn(t,i))return;uy.set(i),r.uniformMatrix2fv(this.addr,!1,uy),yn(t,i)}}function J2(r,e){const t=this.cache,i=e.elements;if(i===void 0){if(vn(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),yn(t,e)}else{if(vn(t,i))return;cy.set(i),r.uniformMatrix3fv(this.addr,!1,cy),yn(t,i)}}function eC(r,e){const t=this.cache,i=e.elements;if(i===void 0){if(vn(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),yn(t,e)}else{if(vn(t,i))return;ly.set(i),r.uniformMatrix4fv(this.addr,!1,ly),yn(t,i)}}function tC(r,e){const t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function nC(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vn(t,e))return;r.uniform2iv(this.addr,e),yn(t,e)}}function iC(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(vn(t,e))return;r.uniform3iv(this.addr,e),yn(t,e)}}function aC(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vn(t,e))return;r.uniform4iv(this.addr,e),yn(t,e)}}function rC(r,e){const t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function sC(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vn(t,e))return;r.uniform2uiv(this.addr,e),yn(t,e)}}function oC(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(vn(t,e))return;r.uniform3uiv(this.addr,e),yn(t,e)}}function lC(r,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vn(t,e))return;r.uniform4uiv(this.addr,e),yn(t,e)}}function cC(r,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(r.uniform1i(this.addr,s),i[0]=s);let l;this.type===r.SAMPLER_2D_SHADOW?(ry.compareFunction=Mb,l=ry):l=Gb,t.setTexture2D(e||l,s)}function uC(r,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(r.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Xb,s)}function fC(r,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(r.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||qb,s)}function dC(r,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(r.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Wb,s)}function hC(r){switch(r){case 5126:return j2;case 35664:return K2;case 35665:return Z2;case 35666:return $2;case 35674:return Q2;case 35675:return J2;case 35676:return eC;case 5124:case 35670:return tC;case 35667:case 35671:return nC;case 35668:case 35672:return iC;case 35669:case 35673:return aC;case 5125:return rC;case 36294:return sC;case 36295:return oC;case 36296:return lC;case 35678:case 36198:case 36298:case 36306:case 35682:return cC;case 35679:case 36299:case 36307:return uC;case 35680:case 36300:case 36308:case 36293:return fC;case 36289:case 36303:case 36311:case 36292:return dC}}function pC(r,e){r.uniform1fv(this.addr,e)}function mC(r,e){const t=yo(e,this.size,2);r.uniform2fv(this.addr,t)}function gC(r,e){const t=yo(e,this.size,3);r.uniform3fv(this.addr,t)}function _C(r,e){const t=yo(e,this.size,4);r.uniform4fv(this.addr,t)}function vC(r,e){const t=yo(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function yC(r,e){const t=yo(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function bC(r,e){const t=yo(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function xC(r,e){r.uniform1iv(this.addr,e)}function EC(r,e){r.uniform2iv(this.addr,e)}function MC(r,e){r.uniform3iv(this.addr,e)}function SC(r,e){r.uniform4iv(this.addr,e)}function wC(r,e){r.uniform1uiv(this.addr,e)}function TC(r,e){r.uniform2uiv(this.addr,e)}function AC(r,e){r.uniform3uiv(this.addr,e)}function RC(r,e){r.uniform4uiv(this.addr,e)}function CC(r,e,t){const i=this.cache,s=e.length,l=$u(t,s);vn(i,l)||(r.uniform1iv(this.addr,l),yn(i,l));for(let u=0;u!==s;++u)t.setTexture2D(e[u]||Gb,l[u])}function DC(r,e,t){const i=this.cache,s=e.length,l=$u(t,s);vn(i,l)||(r.uniform1iv(this.addr,l),yn(i,l));for(let u=0;u!==s;++u)t.setTexture3D(e[u]||Xb,l[u])}function NC(r,e,t){const i=this.cache,s=e.length,l=$u(t,s);vn(i,l)||(r.uniform1iv(this.addr,l),yn(i,l));for(let u=0;u!==s;++u)t.setTextureCube(e[u]||qb,l[u])}function LC(r,e,t){const i=this.cache,s=e.length,l=$u(t,s);vn(i,l)||(r.uniform1iv(this.addr,l),yn(i,l));for(let u=0;u!==s;++u)t.setTexture2DArray(e[u]||Wb,l[u])}function UC(r){switch(r){case 5126:return pC;case 35664:return mC;case 35665:return gC;case 35666:return _C;case 35674:return vC;case 35675:return yC;case 35676:return bC;case 5124:case 35670:return xC;case 35667:case 35671:return EC;case 35668:case 35672:return MC;case 35669:case 35673:return SC;case 5125:return wC;case 36294:return TC;case 36295:return AC;case 36296:return RC;case 35678:case 36198:case 36298:case 36306:case 35682:return CC;case 35679:case 36299:case 36307:return DC;case 35680:case 36300:case 36308:case 36293:return NC;case 36289:case 36303:case 36311:case 36292:return LC}}class PC{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=hC(t.type)}}class OC{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=UC(t.type)}}class IC{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let l=0,u=s.length;l!==u;++l){const f=s[l];f.setValue(e,t[f.id],i)}}}const kh=/(\w+)(\])?(\[|\.)?/g;function fy(r,e){r.seq.push(e),r.map[e.id]=e}function FC(r,e,t){const i=r.name,s=i.length;for(kh.lastIndex=0;;){const l=kh.exec(i),u=kh.lastIndex;let f=l[1];const d=l[2]==="]",h=l[3];if(d&&(f=f|0),h===void 0||h==="["&&u+2===s){fy(t,h===void 0?new PC(f,r,e):new OC(f,r,e));break}else{let g=t.map[f];g===void 0&&(g=new IC(f),fy(t,g)),t=g}}}class Ou{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const l=e.getActiveUniform(t,s),u=e.getUniformLocation(t,l.name);FC(l,u,this)}}setValue(e,t,i,s){const l=this.map[t];l!==void 0&&l.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let l=0,u=t.length;l!==u;++l){const f=t[l],d=i[f.id];d.needsUpdate!==!1&&f.setValue(e,d.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,l=e.length;s!==l;++s){const u=e[s];u.id in t&&i.push(u)}return i}}function dy(r,e,t){const i=r.createShader(e);return r.shaderSource(i,t),r.compileShader(i),i}const BC=37297;let zC=0;function kC(r,e){const t=r.split(`
`),i=[],s=Math.max(e-6,0),l=Math.min(e+6,t.length);for(let u=s;u<l;u++){const f=u+1;i.push(`${f===e?">":" "} ${f}: ${t[u]}`)}return i.join(`
`)}const hy=new dt;function HC(r){Rt._getMatrix(hy,Rt.workingColorSpace,r);const e=`mat3( ${hy.elements.map(t=>t.toFixed(4))} )`;switch(Rt.getTransfer(r)){case ku:return[e,"LinearTransferOETF"];case Xt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function py(r,e,t){const i=r.getShaderParameter(e,r.COMPILE_STATUS),s=r.getShaderInfoLog(e).trim();if(i&&s==="")return"";const l=/ERROR: 0:(\d+)/.exec(s);if(l){const u=parseInt(l[1]);return t.toUpperCase()+`

`+s+`

`+kC(r.getShaderSource(e),u)}else return s}function VC(r,e){const t=HC(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function GC(r,e){let t;switch(e){case jw:t="Linear";break;case Kw:t="Reinhard";break;case Zw:t="Cineon";break;case $w:t="ACESFilmic";break;case Jw:t="AgX";break;case eT:t="Neutral";break;case Qw:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const wu=new X;function WC(){Rt.getLuminanceCoefficients(wu);const r=wu.x.toFixed(4),e=wu.y.toFixed(4),t=wu.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function XC(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Al).join(`
`)}function qC(r){const e=[];for(const t in r){const i=r[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function YC(r,e){const t={},i=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const l=r.getActiveAttrib(e,s),u=l.name;let f=1;l.type===r.FLOAT_MAT2&&(f=2),l.type===r.FLOAT_MAT3&&(f=3),l.type===r.FLOAT_MAT4&&(f=4),t[u]={type:l.type,location:r.getAttribLocation(e,u),locationSize:f}}return t}function Al(r){return r!==""}function my(r,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function gy(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const jC=/^[ \t]*#include +<([\w\d./]+)>/gm;function Pp(r){return r.replace(jC,ZC)}const KC=new Map;function ZC(r,e){let t=mt[e];if(t===void 0){const i=KC.get(e);if(i!==void 0)t=mt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Pp(t)}const $C=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function _y(r){return r.replace($C,QC)}function QC(r,e,t,i){let s="";for(let l=parseInt(e);l<parseInt(t);l++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+l+" ]").replace(/UNROLLED_LOOP_INDEX/g,l);return s}function vy(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function JC(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===lb?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===Aw?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===Ma&&(e="SHADOWMAP_TYPE_VSM"),e}function eD(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case to:case no:e="ENVMAP_TYPE_CUBE";break;case ju:e="ENVMAP_TYPE_CUBE_UV";break}return e}function tD(r){let e="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case no:e="ENVMAP_MODE_REFRACTION";break}return e}function nD(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case cb:e="ENVMAP_BLENDING_MULTIPLY";break;case qw:e="ENVMAP_BLENDING_MIX";break;case Yw:e="ENVMAP_BLENDING_ADD";break}return e}function iD(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function aD(r,e,t,i){const s=r.getContext(),l=t.defines;let u=t.vertexShader,f=t.fragmentShader;const d=JC(t),h=eD(t),m=tD(t),g=nD(t),v=iD(t),b=XC(t),E=qC(l),S=s.createProgram();let x,y,T=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E].filter(Al).join(`
`),x.length>0&&(x+=`
`),y=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E].filter(Al).join(`
`),y.length>0&&(y+=`
`)):(x=[vy(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+m:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+d:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Al).join(`
`),y=[vy(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,E,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.envMap?"#define "+m:"",t.envMap?"#define "+g:"",v?"#define CUBEUV_TEXEL_WIDTH "+v.texelWidth:"",v?"#define CUBEUV_TEXEL_HEIGHT "+v.texelHeight:"",v?"#define CUBEUV_MAX_MIP "+v.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+d:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==dr?"#define TONE_MAPPING":"",t.toneMapping!==dr?mt.tonemapping_pars_fragment:"",t.toneMapping!==dr?GC("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",mt.colorspace_pars_fragment,VC("linearToOutputTexel",t.outputColorSpace),WC(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Al).join(`
`)),u=Pp(u),u=my(u,t),u=gy(u,t),f=Pp(f),f=my(f,t),f=gy(f,t),u=_y(u),f=_y(f),t.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,x=[b,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,y=["#define varying in",t.glslVersion===hv?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===hv?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const N=T+x+u,A=T+y+f,P=dy(s,s.VERTEX_SHADER,N),F=dy(s,s.FRAGMENT_SHADER,A);s.attachShader(S,P),s.attachShader(S,F),t.index0AttributeName!==void 0?s.bindAttribLocation(S,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(S,0,"position"),s.linkProgram(S);function k(H){if(r.debug.checkShaderErrors){const J=s.getProgramInfoLog(S).trim(),K=s.getShaderInfoLog(P).trim(),ce=s.getShaderInfoLog(F).trim();let de=!0,W=!0;if(s.getProgramParameter(S,s.LINK_STATUS)===!1)if(de=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(s,S,P,F);else{const le=py(s,P,"vertex"),Y=py(s,F,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(S,s.VALIDATE_STATUS)+`

Material Name: `+H.name+`
Material Type: `+H.type+`

Program Info Log: `+J+`
`+le+`
`+Y)}else J!==""?console.warn("THREE.WebGLProgram: Program Info Log:",J):(K===""||ce==="")&&(W=!1);W&&(H.diagnostics={runnable:de,programLog:J,vertexShader:{log:K,prefix:x},fragmentShader:{log:ce,prefix:y}})}s.deleteShader(P),s.deleteShader(F),z=new Ou(s,S),R=YC(s,S)}let z;this.getUniforms=function(){return z===void 0&&k(this),z};let R;this.getAttributes=function(){return R===void 0&&k(this),R};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(S,BC)),C},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(S),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=zC++,this.cacheKey=e,this.usedTimes=1,this.program=S,this.vertexShader=P,this.fragmentShader=F,this}let rD=0;class sD{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),l=this._getShaderStage(i),u=this._getShaderCacheForMaterial(e);return u.has(s)===!1&&(u.add(s),s.usedTimes++),u.has(l)===!1&&(u.add(l),l.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new oD(e),t.set(e,i)),i}}class oD{constructor(e){this.id=rD++,this.code=e,this.usedTimes=0}}function lD(r,e,t,i,s,l,u){const f=new Tb,d=new sD,h=new Set,m=[],g=s.logarithmicDepthBuffer,v=s.vertexTextures;let b=s.precision;const E={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function S(R){return h.add(R),R===0?"uv":`uv${R}`}function x(R,C,H,J,K){const ce=J.fog,de=K.geometry,W=R.isMeshStandardMaterial?J.environment:null,le=(R.isMeshStandardMaterial?t:e).get(R.envMap||W),Y=le&&le.mapping===ju?le.image.height:null,ye=E[R.type];R.precision!==null&&(b=s.getMaxPrecision(R.precision),b!==R.precision&&console.warn("THREE.WebGLProgram.getParameters:",R.precision,"not supported, using",b,"instead."));const I=de.morphAttributes.position||de.morphAttributes.normal||de.morphAttributes.color,re=I!==void 0?I.length:0;let Se=0;de.morphAttributes.position!==void 0&&(Se=1),de.morphAttributes.normal!==void 0&&(Se=2),de.morphAttributes.color!==void 0&&(Se=3);let Ne,Q,me,xe;if(ye){const Nt=qi[ye];Ne=Nt.vertexShader,Q=Nt.fragmentShader}else Ne=R.vertexShader,Q=R.fragmentShader,d.update(R),me=d.getVertexShaderID(R),xe=d.getFragmentShaderID(R);const we=r.getRenderTarget(),Ce=r.state.buffers.depth.getReversed(),Ke=K.isInstancedMesh===!0,Oe=K.isBatchedMesh===!0,xt=!!R.map,Dt=!!R.matcap,it=!!le,V=!!R.aoMap,on=!!R.lightMap,ct=!!R.bumpMap,Ae=!!R.normalMap,Re=!!R.displacementMap,tt=!!R.emissiveMap,De=!!R.metalnessMap,O=!!R.roughnessMap,D=R.anisotropy>0,ne=R.clearcoat>0,fe=R.dispersion>0,be=R.iridescence>0,ge=R.sheen>0,qe=R.transmission>0,Ue=D&&!!R.anisotropyMap,Ve=ne&&!!R.clearcoatMap,Et=ne&&!!R.clearcoatNormalMap,Te=ne&&!!R.clearcoatRoughnessMap,Ge=be&&!!R.iridescenceMap,et=be&&!!R.iridescenceThicknessMap,Ye=ge&&!!R.sheenColorMap,We=ge&&!!R.sheenRoughnessMap,ft=!!R.specularMap,Qe=!!R.specularColorMap,Ht=!!R.specularIntensityMap,Z=qe&&!!R.transmissionMap,Be=qe&&!!R.thicknessMap,ue=!!R.gradientMap,ve=!!R.alphaMap,Pe=R.alphaTest>0,Ie=!!R.alphaHash,at=!!R.extensions;let Zt=dr;R.toneMapped&&(we===null||we.isXRRenderTarget===!0)&&(Zt=r.toneMapping);const dn={shaderID:ye,shaderType:R.type,shaderName:R.name,vertexShader:Ne,fragmentShader:Q,defines:R.defines,customVertexShaderID:me,customFragmentShaderID:xe,isRawShaderMaterial:R.isRawShaderMaterial===!0,glslVersion:R.glslVersion,precision:b,batching:Oe,batchingColor:Oe&&K._colorsTexture!==null,instancing:Ke,instancingColor:Ke&&K.instanceColor!==null,instancingMorph:Ke&&K.morphTexture!==null,supportsVertexTextures:v,outputColorSpace:we===null?r.outputColorSpace:we.isXRRenderTarget===!0?we.texture.colorSpace:jn,alphaToCoverage:!!R.alphaToCoverage,map:xt,matcap:Dt,envMap:it,envMapMode:it&&le.mapping,envMapCubeUVHeight:Y,aoMap:V,lightMap:on,bumpMap:ct,normalMap:Ae,displacementMap:v&&Re,emissiveMap:tt,normalMapObjectSpace:Ae&&R.normalMapType===sT,normalMapTangentSpace:Ae&&R.normalMapType===Eb,metalnessMap:De,roughnessMap:O,anisotropy:D,anisotropyMap:Ue,clearcoat:ne,clearcoatMap:Ve,clearcoatNormalMap:Et,clearcoatRoughnessMap:Te,dispersion:fe,iridescence:be,iridescenceMap:Ge,iridescenceThicknessMap:et,sheen:ge,sheenColorMap:Ye,sheenRoughnessMap:We,specularMap:ft,specularColorMap:Qe,specularIntensityMap:Ht,transmission:qe,transmissionMap:Z,thicknessMap:Be,gradientMap:ue,opaque:R.transparent===!1&&R.blending===Zs&&R.alphaToCoverage===!1,alphaMap:ve,alphaTest:Pe,alphaHash:Ie,combine:R.combine,mapUv:xt&&S(R.map.channel),aoMapUv:V&&S(R.aoMap.channel),lightMapUv:on&&S(R.lightMap.channel),bumpMapUv:ct&&S(R.bumpMap.channel),normalMapUv:Ae&&S(R.normalMap.channel),displacementMapUv:Re&&S(R.displacementMap.channel),emissiveMapUv:tt&&S(R.emissiveMap.channel),metalnessMapUv:De&&S(R.metalnessMap.channel),roughnessMapUv:O&&S(R.roughnessMap.channel),anisotropyMapUv:Ue&&S(R.anisotropyMap.channel),clearcoatMapUv:Ve&&S(R.clearcoatMap.channel),clearcoatNormalMapUv:Et&&S(R.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Te&&S(R.clearcoatRoughnessMap.channel),iridescenceMapUv:Ge&&S(R.iridescenceMap.channel),iridescenceThicknessMapUv:et&&S(R.iridescenceThicknessMap.channel),sheenColorMapUv:Ye&&S(R.sheenColorMap.channel),sheenRoughnessMapUv:We&&S(R.sheenRoughnessMap.channel),specularMapUv:ft&&S(R.specularMap.channel),specularColorMapUv:Qe&&S(R.specularColorMap.channel),specularIntensityMapUv:Ht&&S(R.specularIntensityMap.channel),transmissionMapUv:Z&&S(R.transmissionMap.channel),thicknessMapUv:Be&&S(R.thicknessMap.channel),alphaMapUv:ve&&S(R.alphaMap.channel),vertexTangents:!!de.attributes.tangent&&(Ae||D),vertexColors:R.vertexColors,vertexAlphas:R.vertexColors===!0&&!!de.attributes.color&&de.attributes.color.itemSize===4,pointsUvs:K.isPoints===!0&&!!de.attributes.uv&&(xt||ve),fog:!!ce,useFog:R.fog===!0,fogExp2:!!ce&&ce.isFogExp2,flatShading:R.flatShading===!0,sizeAttenuation:R.sizeAttenuation===!0,logarithmicDepthBuffer:g,reverseDepthBuffer:Ce,skinning:K.isSkinnedMesh===!0,morphTargets:de.morphAttributes.position!==void 0,morphNormals:de.morphAttributes.normal!==void 0,morphColors:de.morphAttributes.color!==void 0,morphTargetsCount:re,morphTextureStride:Se,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numClippingPlanes:u.numPlanes,numClipIntersection:u.numIntersection,dithering:R.dithering,shadowMapEnabled:r.shadowMap.enabled&&H.length>0,shadowMapType:r.shadowMap.type,toneMapping:Zt,decodeVideoTexture:xt&&R.map.isVideoTexture===!0&&Rt.getTransfer(R.map.colorSpace)===Xt,decodeVideoTextureEmissive:tt&&R.emissiveMap.isVideoTexture===!0&&Rt.getTransfer(R.emissiveMap.colorSpace)===Xt,premultipliedAlpha:R.premultipliedAlpha,doubleSided:R.side===Ei,flipSided:R.side===ei,useDepthPacking:R.depthPacking>=0,depthPacking:R.depthPacking||0,index0AttributeName:R.index0AttributeName,extensionClipCullDistance:at&&R.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(at&&R.extensions.multiDraw===!0||Oe)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:R.customProgramCacheKey()};return dn.vertexUv1s=h.has(1),dn.vertexUv2s=h.has(2),dn.vertexUv3s=h.has(3),h.clear(),dn}function y(R){const C=[];if(R.shaderID?C.push(R.shaderID):(C.push(R.customVertexShaderID),C.push(R.customFragmentShaderID)),R.defines!==void 0)for(const H in R.defines)C.push(H),C.push(R.defines[H]);return R.isRawShaderMaterial===!1&&(T(C,R),N(C,R),C.push(r.outputColorSpace)),C.push(R.customProgramCacheKey),C.join()}function T(R,C){R.push(C.precision),R.push(C.outputColorSpace),R.push(C.envMapMode),R.push(C.envMapCubeUVHeight),R.push(C.mapUv),R.push(C.alphaMapUv),R.push(C.lightMapUv),R.push(C.aoMapUv),R.push(C.bumpMapUv),R.push(C.normalMapUv),R.push(C.displacementMapUv),R.push(C.emissiveMapUv),R.push(C.metalnessMapUv),R.push(C.roughnessMapUv),R.push(C.anisotropyMapUv),R.push(C.clearcoatMapUv),R.push(C.clearcoatNormalMapUv),R.push(C.clearcoatRoughnessMapUv),R.push(C.iridescenceMapUv),R.push(C.iridescenceThicknessMapUv),R.push(C.sheenColorMapUv),R.push(C.sheenRoughnessMapUv),R.push(C.specularMapUv),R.push(C.specularColorMapUv),R.push(C.specularIntensityMapUv),R.push(C.transmissionMapUv),R.push(C.thicknessMapUv),R.push(C.combine),R.push(C.fogExp2),R.push(C.sizeAttenuation),R.push(C.morphTargetsCount),R.push(C.morphAttributeCount),R.push(C.numDirLights),R.push(C.numPointLights),R.push(C.numSpotLights),R.push(C.numSpotLightMaps),R.push(C.numHemiLights),R.push(C.numRectAreaLights),R.push(C.numDirLightShadows),R.push(C.numPointLightShadows),R.push(C.numSpotLightShadows),R.push(C.numSpotLightShadowsWithMaps),R.push(C.numLightProbes),R.push(C.shadowMapType),R.push(C.toneMapping),R.push(C.numClippingPlanes),R.push(C.numClipIntersection),R.push(C.depthPacking)}function N(R,C){f.disableAll(),C.supportsVertexTextures&&f.enable(0),C.instancing&&f.enable(1),C.instancingColor&&f.enable(2),C.instancingMorph&&f.enable(3),C.matcap&&f.enable(4),C.envMap&&f.enable(5),C.normalMapObjectSpace&&f.enable(6),C.normalMapTangentSpace&&f.enable(7),C.clearcoat&&f.enable(8),C.iridescence&&f.enable(9),C.alphaTest&&f.enable(10),C.vertexColors&&f.enable(11),C.vertexAlphas&&f.enable(12),C.vertexUv1s&&f.enable(13),C.vertexUv2s&&f.enable(14),C.vertexUv3s&&f.enable(15),C.vertexTangents&&f.enable(16),C.anisotropy&&f.enable(17),C.alphaHash&&f.enable(18),C.batching&&f.enable(19),C.dispersion&&f.enable(20),C.batchingColor&&f.enable(21),R.push(f.mask),f.disableAll(),C.fog&&f.enable(0),C.useFog&&f.enable(1),C.flatShading&&f.enable(2),C.logarithmicDepthBuffer&&f.enable(3),C.reverseDepthBuffer&&f.enable(4),C.skinning&&f.enable(5),C.morphTargets&&f.enable(6),C.morphNormals&&f.enable(7),C.morphColors&&f.enable(8),C.premultipliedAlpha&&f.enable(9),C.shadowMapEnabled&&f.enable(10),C.doubleSided&&f.enable(11),C.flipSided&&f.enable(12),C.useDepthPacking&&f.enable(13),C.dithering&&f.enable(14),C.transmission&&f.enable(15),C.sheen&&f.enable(16),C.opaque&&f.enable(17),C.pointsUvs&&f.enable(18),C.decodeVideoTexture&&f.enable(19),C.decodeVideoTextureEmissive&&f.enable(20),C.alphaToCoverage&&f.enable(21),R.push(f.mask)}function A(R){const C=E[R.type];let H;if(C){const J=qi[C];H=QT.clone(J.uniforms)}else H=R.uniforms;return H}function P(R,C){let H;for(let J=0,K=m.length;J<K;J++){const ce=m[J];if(ce.cacheKey===C){H=ce,++H.usedTimes;break}}return H===void 0&&(H=new aD(r,C,R,l),m.push(H)),H}function F(R){if(--R.usedTimes===0){const C=m.indexOf(R);m[C]=m[m.length-1],m.pop(),R.destroy()}}function k(R){d.remove(R)}function z(){d.dispose()}return{getParameters:x,getProgramCacheKey:y,getUniforms:A,acquireProgram:P,releaseProgram:F,releaseShaderCache:k,programs:m,dispose:z}}function cD(){let r=new WeakMap;function e(u){return r.has(u)}function t(u){let f=r.get(u);return f===void 0&&(f={},r.set(u,f)),f}function i(u){r.delete(u)}function s(u,f,d){r.get(u)[f]=d}function l(){r=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:l}}function uD(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function yy(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function by(){const r=[];let e=0;const t=[],i=[],s=[];function l(){e=0,t.length=0,i.length=0,s.length=0}function u(g,v,b,E,S,x){let y=r[e];return y===void 0?(y={id:g.id,object:g,geometry:v,material:b,groupOrder:E,renderOrder:g.renderOrder,z:S,group:x},r[e]=y):(y.id=g.id,y.object=g,y.geometry=v,y.material=b,y.groupOrder=E,y.renderOrder=g.renderOrder,y.z=S,y.group=x),e++,y}function f(g,v,b,E,S,x){const y=u(g,v,b,E,S,x);b.transmission>0?i.push(y):b.transparent===!0?s.push(y):t.push(y)}function d(g,v,b,E,S,x){const y=u(g,v,b,E,S,x);b.transmission>0?i.unshift(y):b.transparent===!0?s.unshift(y):t.unshift(y)}function h(g,v){t.length>1&&t.sort(g||uD),i.length>1&&i.sort(v||yy),s.length>1&&s.sort(v||yy)}function m(){for(let g=e,v=r.length;g<v;g++){const b=r[g];if(b.id===null)break;b.id=null,b.object=null,b.geometry=null,b.material=null,b.group=null}}return{opaque:t,transmissive:i,transparent:s,init:l,push:f,unshift:d,finish:m,sort:h}}function fD(){let r=new WeakMap;function e(i,s){const l=r.get(i);let u;return l===void 0?(u=new by,r.set(i,[u])):s>=l.length?(u=new by,l.push(u)):u=l[s],u}function t(){r=new WeakMap}return{get:e,dispose:t}}function dD(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new X,color:new lt};break;case"SpotLight":t={position:new X,direction:new X,color:new lt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new X,color:new lt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new X,skyColor:new lt,groundColor:new lt};break;case"RectAreaLight":t={color:new lt,position:new X,halfWidth:new X,halfHeight:new X};break}return r[e.id]=t,t}}}function hD(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}let pD=0;function mD(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function gD(r){const e=new dD,t=hD(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new X);const s=new X,l=new ht,u=new ht;function f(h){let m=0,g=0,v=0;for(let R=0;R<9;R++)i.probe[R].set(0,0,0);let b=0,E=0,S=0,x=0,y=0,T=0,N=0,A=0,P=0,F=0,k=0;h.sort(mD);for(let R=0,C=h.length;R<C;R++){const H=h[R],J=H.color,K=H.intensity,ce=H.distance,de=H.shadow&&H.shadow.map?H.shadow.map.texture:null;if(H.isAmbientLight)m+=J.r*K,g+=J.g*K,v+=J.b*K;else if(H.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(H.sh.coefficients[W],K);k++}else if(H.isDirectionalLight){const W=e.get(H);if(W.color.copy(H.color).multiplyScalar(H.intensity),H.castShadow){const le=H.shadow,Y=t.get(H);Y.shadowIntensity=le.intensity,Y.shadowBias=le.bias,Y.shadowNormalBias=le.normalBias,Y.shadowRadius=le.radius,Y.shadowMapSize=le.mapSize,i.directionalShadow[b]=Y,i.directionalShadowMap[b]=de,i.directionalShadowMatrix[b]=H.shadow.matrix,T++}i.directional[b]=W,b++}else if(H.isSpotLight){const W=e.get(H);W.position.setFromMatrixPosition(H.matrixWorld),W.color.copy(J).multiplyScalar(K),W.distance=ce,W.coneCos=Math.cos(H.angle),W.penumbraCos=Math.cos(H.angle*(1-H.penumbra)),W.decay=H.decay,i.spot[S]=W;const le=H.shadow;if(H.map&&(i.spotLightMap[P]=H.map,P++,le.updateMatrices(H),H.castShadow&&F++),i.spotLightMatrix[S]=le.matrix,H.castShadow){const Y=t.get(H);Y.shadowIntensity=le.intensity,Y.shadowBias=le.bias,Y.shadowNormalBias=le.normalBias,Y.shadowRadius=le.radius,Y.shadowMapSize=le.mapSize,i.spotShadow[S]=Y,i.spotShadowMap[S]=de,A++}S++}else if(H.isRectAreaLight){const W=e.get(H);W.color.copy(J).multiplyScalar(K),W.halfWidth.set(H.width*.5,0,0),W.halfHeight.set(0,H.height*.5,0),i.rectArea[x]=W,x++}else if(H.isPointLight){const W=e.get(H);if(W.color.copy(H.color).multiplyScalar(H.intensity),W.distance=H.distance,W.decay=H.decay,H.castShadow){const le=H.shadow,Y=t.get(H);Y.shadowIntensity=le.intensity,Y.shadowBias=le.bias,Y.shadowNormalBias=le.normalBias,Y.shadowRadius=le.radius,Y.shadowMapSize=le.mapSize,Y.shadowCameraNear=le.camera.near,Y.shadowCameraFar=le.camera.far,i.pointShadow[E]=Y,i.pointShadowMap[E]=de,i.pointShadowMatrix[E]=H.shadow.matrix,N++}i.point[E]=W,E++}else if(H.isHemisphereLight){const W=e.get(H);W.skyColor.copy(H.color).multiplyScalar(K),W.groundColor.copy(H.groundColor).multiplyScalar(K),i.hemi[y]=W,y++}}x>0&&(r.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Fe.LTC_FLOAT_1,i.rectAreaLTC2=Fe.LTC_FLOAT_2):(i.rectAreaLTC1=Fe.LTC_HALF_1,i.rectAreaLTC2=Fe.LTC_HALF_2)),i.ambient[0]=m,i.ambient[1]=g,i.ambient[2]=v;const z=i.hash;(z.directionalLength!==b||z.pointLength!==E||z.spotLength!==S||z.rectAreaLength!==x||z.hemiLength!==y||z.numDirectionalShadows!==T||z.numPointShadows!==N||z.numSpotShadows!==A||z.numSpotMaps!==P||z.numLightProbes!==k)&&(i.directional.length=b,i.spot.length=S,i.rectArea.length=x,i.point.length=E,i.hemi.length=y,i.directionalShadow.length=T,i.directionalShadowMap.length=T,i.pointShadow.length=N,i.pointShadowMap.length=N,i.spotShadow.length=A,i.spotShadowMap.length=A,i.directionalShadowMatrix.length=T,i.pointShadowMatrix.length=N,i.spotLightMatrix.length=A+P-F,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=F,i.numLightProbes=k,z.directionalLength=b,z.pointLength=E,z.spotLength=S,z.rectAreaLength=x,z.hemiLength=y,z.numDirectionalShadows=T,z.numPointShadows=N,z.numSpotShadows=A,z.numSpotMaps=P,z.numLightProbes=k,i.version=pD++)}function d(h,m){let g=0,v=0,b=0,E=0,S=0;const x=m.matrixWorldInverse;for(let y=0,T=h.length;y<T;y++){const N=h[y];if(N.isDirectionalLight){const A=i.directional[g];A.direction.setFromMatrixPosition(N.matrixWorld),s.setFromMatrixPosition(N.target.matrixWorld),A.direction.sub(s),A.direction.transformDirection(x),g++}else if(N.isSpotLight){const A=i.spot[b];A.position.setFromMatrixPosition(N.matrixWorld),A.position.applyMatrix4(x),A.direction.setFromMatrixPosition(N.matrixWorld),s.setFromMatrixPosition(N.target.matrixWorld),A.direction.sub(s),A.direction.transformDirection(x),b++}else if(N.isRectAreaLight){const A=i.rectArea[E];A.position.setFromMatrixPosition(N.matrixWorld),A.position.applyMatrix4(x),u.identity(),l.copy(N.matrixWorld),l.premultiply(x),u.extractRotation(l),A.halfWidth.set(N.width*.5,0,0),A.halfHeight.set(0,N.height*.5,0),A.halfWidth.applyMatrix4(u),A.halfHeight.applyMatrix4(u),E++}else if(N.isPointLight){const A=i.point[v];A.position.setFromMatrixPosition(N.matrixWorld),A.position.applyMatrix4(x),v++}else if(N.isHemisphereLight){const A=i.hemi[S];A.direction.setFromMatrixPosition(N.matrixWorld),A.direction.transformDirection(x),S++}}}return{setup:f,setupView:d,state:i}}function xy(r){const e=new gD(r),t=[],i=[];function s(m){h.camera=m,t.length=0,i.length=0}function l(m){t.push(m)}function u(m){i.push(m)}function f(){e.setup(t)}function d(m){e.setupView(t,m)}const h={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:h,setupLights:f,setupLightsView:d,pushLight:l,pushShadow:u}}function _D(r){let e=new WeakMap;function t(s,l=0){const u=e.get(s);let f;return u===void 0?(f=new xy(r),e.set(s,[f])):l>=u.length?(f=new xy(r),u.push(f)):f=u[l],f}function i(){e=new WeakMap}return{get:t,dispose:i}}const vD=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,yD=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function bD(r,e,t){let i=new um;const s=new Ct,l=new Ct,u=new Ot,f=new g1({depthPacking:rT}),d=new _1,h={},m=t.maxTextureSize,g={[Na]:ei,[ei]:Na,[Ei]:Ei},v=new hr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ct},radius:{value:4}},vertexShader:vD,fragmentShader:yD}),b=v.clone();b.defines.HORIZONTAL_PASS=1;const E=new zi;E.setAttribute("position",new Yn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const S=new Bt(E,v),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=lb;let y=this.type;this.render=function(F,k,z){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||F.length===0)return;const R=r.getRenderTarget(),C=r.getActiveCubeFace(),H=r.getActiveMipmapLevel(),J=r.state;J.setBlending(fr),J.buffers.color.setClear(1,1,1,1),J.buffers.depth.setTest(!0),J.setScissorTest(!1);const K=y!==Ma&&this.type===Ma,ce=y===Ma&&this.type!==Ma;for(let de=0,W=F.length;de<W;de++){const le=F[de],Y=le.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",le,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;s.copy(Y.mapSize);const ye=Y.getFrameExtents();if(s.multiply(ye),l.copy(Y.mapSize),(s.x>m||s.y>m)&&(s.x>m&&(l.x=Math.floor(m/ye.x),s.x=l.x*ye.x,Y.mapSize.x=l.x),s.y>m&&(l.y=Math.floor(m/ye.y),s.y=l.y*ye.y,Y.mapSize.y=l.y)),Y.map===null||K===!0||ce===!0){const re=this.type!==Ma?{minFilter:qn,magFilter:qn}:{};Y.map!==null&&Y.map.dispose(),Y.map=new Jr(s.x,s.y,re),Y.map.texture.name=le.name+".shadowMap",Y.camera.updateProjectionMatrix()}r.setRenderTarget(Y.map),r.clear();const I=Y.getViewportCount();for(let re=0;re<I;re++){const Se=Y.getViewport(re);u.set(l.x*Se.x,l.y*Se.y,l.x*Se.z,l.y*Se.w),J.viewport(u),Y.updateMatrices(le,re),i=Y.getFrustum(),A(k,z,Y.camera,le,this.type)}Y.isPointLightShadow!==!0&&this.type===Ma&&T(Y,z),Y.needsUpdate=!1}y=this.type,x.needsUpdate=!1,r.setRenderTarget(R,C,H)};function T(F,k){const z=e.update(S);v.defines.VSM_SAMPLES!==F.blurSamples&&(v.defines.VSM_SAMPLES=F.blurSamples,b.defines.VSM_SAMPLES=F.blurSamples,v.needsUpdate=!0,b.needsUpdate=!0),F.mapPass===null&&(F.mapPass=new Jr(s.x,s.y)),v.uniforms.shadow_pass.value=F.map.texture,v.uniforms.resolution.value=F.mapSize,v.uniforms.radius.value=F.radius,r.setRenderTarget(F.mapPass),r.clear(),r.renderBufferDirect(k,null,z,v,S,null),b.uniforms.shadow_pass.value=F.mapPass.texture,b.uniforms.resolution.value=F.mapSize,b.uniforms.radius.value=F.radius,r.setRenderTarget(F.map),r.clear(),r.renderBufferDirect(k,null,z,b,S,null)}function N(F,k,z,R){let C=null;const H=z.isPointLight===!0?F.customDistanceMaterial:F.customDepthMaterial;if(H!==void 0)C=H;else if(C=z.isPointLight===!0?d:f,r.localClippingEnabled&&k.clipShadows===!0&&Array.isArray(k.clippingPlanes)&&k.clippingPlanes.length!==0||k.displacementMap&&k.displacementScale!==0||k.alphaMap&&k.alphaTest>0||k.map&&k.alphaTest>0){const J=C.uuid,K=k.uuid;let ce=h[J];ce===void 0&&(ce={},h[J]=ce);let de=ce[K];de===void 0&&(de=C.clone(),ce[K]=de,k.addEventListener("dispose",P)),C=de}if(C.visible=k.visible,C.wireframe=k.wireframe,R===Ma?C.side=k.shadowSide!==null?k.shadowSide:k.side:C.side=k.shadowSide!==null?k.shadowSide:g[k.side],C.alphaMap=k.alphaMap,C.alphaTest=k.alphaTest,C.map=k.map,C.clipShadows=k.clipShadows,C.clippingPlanes=k.clippingPlanes,C.clipIntersection=k.clipIntersection,C.displacementMap=k.displacementMap,C.displacementScale=k.displacementScale,C.displacementBias=k.displacementBias,C.wireframeLinewidth=k.wireframeLinewidth,C.linewidth=k.linewidth,z.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const J=r.properties.get(C);J.light=z}return C}function A(F,k,z,R,C){if(F.visible===!1)return;if(F.layers.test(k.layers)&&(F.isMesh||F.isLine||F.isPoints)&&(F.castShadow||F.receiveShadow&&C===Ma)&&(!F.frustumCulled||i.intersectsObject(F))){F.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,F.matrixWorld);const K=e.update(F),ce=F.material;if(Array.isArray(ce)){const de=K.groups;for(let W=0,le=de.length;W<le;W++){const Y=de[W],ye=ce[Y.materialIndex];if(ye&&ye.visible){const I=N(F,ye,R,C);F.onBeforeShadow(r,F,k,z,K,I,Y),r.renderBufferDirect(z,null,K,I,F,Y),F.onAfterShadow(r,F,k,z,K,I,Y)}}}else if(ce.visible){const de=N(F,ce,R,C);F.onBeforeShadow(r,F,k,z,K,de,null),r.renderBufferDirect(z,null,K,de,F,null),F.onAfterShadow(r,F,k,z,K,de,null)}}const J=F.children;for(let K=0,ce=J.length;K<ce;K++)A(J[K],k,z,R,C)}function P(F){F.target.removeEventListener("dispose",P);for(const z in h){const R=h[z],C=F.target.uuid;C in R&&(R[C].dispose(),delete R[C])}}}const xD={[Kh]:Zh,[$h]:ep,[Qh]:tp,[eo]:Jh,[Zh]:Kh,[ep]:$h,[tp]:Qh,[Jh]:eo};function ED(r,e){function t(){let Z=!1;const Be=new Ot;let ue=null;const ve=new Ot(0,0,0,0);return{setMask:function(Pe){ue!==Pe&&!Z&&(r.colorMask(Pe,Pe,Pe,Pe),ue=Pe)},setLocked:function(Pe){Z=Pe},setClear:function(Pe,Ie,at,Zt,dn){dn===!0&&(Pe*=Zt,Ie*=Zt,at*=Zt),Be.set(Pe,Ie,at,Zt),ve.equals(Be)===!1&&(r.clearColor(Pe,Ie,at,Zt),ve.copy(Be))},reset:function(){Z=!1,ue=null,ve.set(-1,0,0,0)}}}function i(){let Z=!1,Be=!1,ue=null,ve=null,Pe=null;return{setReversed:function(Ie){if(Be!==Ie){const at=e.get("EXT_clip_control");Be?at.clipControlEXT(at.LOWER_LEFT_EXT,at.ZERO_TO_ONE_EXT):at.clipControlEXT(at.LOWER_LEFT_EXT,at.NEGATIVE_ONE_TO_ONE_EXT);const Zt=Pe;Pe=null,this.setClear(Zt)}Be=Ie},getReversed:function(){return Be},setTest:function(Ie){Ie?we(r.DEPTH_TEST):Ce(r.DEPTH_TEST)},setMask:function(Ie){ue!==Ie&&!Z&&(r.depthMask(Ie),ue=Ie)},setFunc:function(Ie){if(Be&&(Ie=xD[Ie]),ve!==Ie){switch(Ie){case Kh:r.depthFunc(r.NEVER);break;case Zh:r.depthFunc(r.ALWAYS);break;case $h:r.depthFunc(r.LESS);break;case eo:r.depthFunc(r.LEQUAL);break;case Qh:r.depthFunc(r.EQUAL);break;case Jh:r.depthFunc(r.GEQUAL);break;case ep:r.depthFunc(r.GREATER);break;case tp:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}ve=Ie}},setLocked:function(Ie){Z=Ie},setClear:function(Ie){Pe!==Ie&&(Be&&(Ie=1-Ie),r.clearDepth(Ie),Pe=Ie)},reset:function(){Z=!1,ue=null,ve=null,Pe=null,Be=!1}}}function s(){let Z=!1,Be=null,ue=null,ve=null,Pe=null,Ie=null,at=null,Zt=null,dn=null;return{setTest:function(Nt){Z||(Nt?we(r.STENCIL_TEST):Ce(r.STENCIL_TEST))},setMask:function(Nt){Be!==Nt&&!Z&&(r.stencilMask(Nt),Be=Nt)},setFunc:function(Nt,In,Fn){(ue!==Nt||ve!==In||Pe!==Fn)&&(r.stencilFunc(Nt,In,Fn),ue=Nt,ve=In,Pe=Fn)},setOp:function(Nt,In,Fn){(Ie!==Nt||at!==In||Zt!==Fn)&&(r.stencilOp(Nt,In,Fn),Ie=Nt,at=In,Zt=Fn)},setLocked:function(Nt){Z=Nt},setClear:function(Nt){dn!==Nt&&(r.clearStencil(Nt),dn=Nt)},reset:function(){Z=!1,Be=null,ue=null,ve=null,Pe=null,Ie=null,at=null,Zt=null,dn=null}}}const l=new t,u=new i,f=new s,d=new WeakMap,h=new WeakMap;let m={},g={},v=new WeakMap,b=[],E=null,S=!1,x=null,y=null,T=null,N=null,A=null,P=null,F=null,k=new lt(0,0,0),z=0,R=!1,C=null,H=null,J=null,K=null,ce=null;const de=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,le=0;const Y=r.getParameter(r.VERSION);Y.indexOf("WebGL")!==-1?(le=parseFloat(/^WebGL (\d)/.exec(Y)[1]),W=le>=1):Y.indexOf("OpenGL ES")!==-1&&(le=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),W=le>=2);let ye=null,I={};const re=r.getParameter(r.SCISSOR_BOX),Se=r.getParameter(r.VIEWPORT),Ne=new Ot().fromArray(re),Q=new Ot().fromArray(Se);function me(Z,Be,ue,ve){const Pe=new Uint8Array(4),Ie=r.createTexture();r.bindTexture(Z,Ie),r.texParameteri(Z,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(Z,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let at=0;at<ue;at++)Z===r.TEXTURE_3D||Z===r.TEXTURE_2D_ARRAY?r.texImage3D(Be,0,r.RGBA,1,1,ve,0,r.RGBA,r.UNSIGNED_BYTE,Pe):r.texImage2D(Be+at,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Pe);return Ie}const xe={};xe[r.TEXTURE_2D]=me(r.TEXTURE_2D,r.TEXTURE_2D,1),xe[r.TEXTURE_CUBE_MAP]=me(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),xe[r.TEXTURE_2D_ARRAY]=me(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),xe[r.TEXTURE_3D]=me(r.TEXTURE_3D,r.TEXTURE_3D,1,1),l.setClear(0,0,0,1),u.setClear(1),f.setClear(0),we(r.DEPTH_TEST),u.setFunc(eo),ct(!1),Ae(av),we(r.CULL_FACE),V(fr);function we(Z){m[Z]!==!0&&(r.enable(Z),m[Z]=!0)}function Ce(Z){m[Z]!==!1&&(r.disable(Z),m[Z]=!1)}function Ke(Z,Be){return g[Z]!==Be?(r.bindFramebuffer(Z,Be),g[Z]=Be,Z===r.DRAW_FRAMEBUFFER&&(g[r.FRAMEBUFFER]=Be),Z===r.FRAMEBUFFER&&(g[r.DRAW_FRAMEBUFFER]=Be),!0):!1}function Oe(Z,Be){let ue=b,ve=!1;if(Z){ue=v.get(Be),ue===void 0&&(ue=[],v.set(Be,ue));const Pe=Z.textures;if(ue.length!==Pe.length||ue[0]!==r.COLOR_ATTACHMENT0){for(let Ie=0,at=Pe.length;Ie<at;Ie++)ue[Ie]=r.COLOR_ATTACHMENT0+Ie;ue.length=Pe.length,ve=!0}}else ue[0]!==r.BACK&&(ue[0]=r.BACK,ve=!0);ve&&r.drawBuffers(ue)}function xt(Z){return E!==Z?(r.useProgram(Z),E=Z,!0):!1}const Dt={[Kr]:r.FUNC_ADD,[Cw]:r.FUNC_SUBTRACT,[Dw]:r.FUNC_REVERSE_SUBTRACT};Dt[Nw]=r.MIN,Dt[Lw]=r.MAX;const it={[Uw]:r.ZERO,[Pw]:r.ONE,[Ow]:r.SRC_COLOR,[Yh]:r.SRC_ALPHA,[Hw]:r.SRC_ALPHA_SATURATE,[zw]:r.DST_COLOR,[Fw]:r.DST_ALPHA,[Iw]:r.ONE_MINUS_SRC_COLOR,[jh]:r.ONE_MINUS_SRC_ALPHA,[kw]:r.ONE_MINUS_DST_COLOR,[Bw]:r.ONE_MINUS_DST_ALPHA,[Vw]:r.CONSTANT_COLOR,[Gw]:r.ONE_MINUS_CONSTANT_COLOR,[Ww]:r.CONSTANT_ALPHA,[Xw]:r.ONE_MINUS_CONSTANT_ALPHA};function V(Z,Be,ue,ve,Pe,Ie,at,Zt,dn,Nt){if(Z===fr){S===!0&&(Ce(r.BLEND),S=!1);return}if(S===!1&&(we(r.BLEND),S=!0),Z!==Rw){if(Z!==x||Nt!==R){if((y!==Kr||A!==Kr)&&(r.blendEquation(r.FUNC_ADD),y=Kr,A=Kr),Nt)switch(Z){case Zs:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case rv:r.blendFunc(r.ONE,r.ONE);break;case sv:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case ov:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",Z);break}else switch(Z){case Zs:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case rv:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case sv:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case ov:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",Z);break}T=null,N=null,P=null,F=null,k.set(0,0,0),z=0,x=Z,R=Nt}return}Pe=Pe||Be,Ie=Ie||ue,at=at||ve,(Be!==y||Pe!==A)&&(r.blendEquationSeparate(Dt[Be],Dt[Pe]),y=Be,A=Pe),(ue!==T||ve!==N||Ie!==P||at!==F)&&(r.blendFuncSeparate(it[ue],it[ve],it[Ie],it[at]),T=ue,N=ve,P=Ie,F=at),(Zt.equals(k)===!1||dn!==z)&&(r.blendColor(Zt.r,Zt.g,Zt.b,dn),k.copy(Zt),z=dn),x=Z,R=!1}function on(Z,Be){Z.side===Ei?Ce(r.CULL_FACE):we(r.CULL_FACE);let ue=Z.side===ei;Be&&(ue=!ue),ct(ue),Z.blending===Zs&&Z.transparent===!1?V(fr):V(Z.blending,Z.blendEquation,Z.blendSrc,Z.blendDst,Z.blendEquationAlpha,Z.blendSrcAlpha,Z.blendDstAlpha,Z.blendColor,Z.blendAlpha,Z.premultipliedAlpha),u.setFunc(Z.depthFunc),u.setTest(Z.depthTest),u.setMask(Z.depthWrite),l.setMask(Z.colorWrite);const ve=Z.stencilWrite;f.setTest(ve),ve&&(f.setMask(Z.stencilWriteMask),f.setFunc(Z.stencilFunc,Z.stencilRef,Z.stencilFuncMask),f.setOp(Z.stencilFail,Z.stencilZFail,Z.stencilZPass)),tt(Z.polygonOffset,Z.polygonOffsetFactor,Z.polygonOffsetUnits),Z.alphaToCoverage===!0?we(r.SAMPLE_ALPHA_TO_COVERAGE):Ce(r.SAMPLE_ALPHA_TO_COVERAGE)}function ct(Z){C!==Z&&(Z?r.frontFace(r.CW):r.frontFace(r.CCW),C=Z)}function Ae(Z){Z!==ww?(we(r.CULL_FACE),Z!==H&&(Z===av?r.cullFace(r.BACK):Z===Tw?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Ce(r.CULL_FACE),H=Z}function Re(Z){Z!==J&&(W&&r.lineWidth(Z),J=Z)}function tt(Z,Be,ue){Z?(we(r.POLYGON_OFFSET_FILL),(K!==Be||ce!==ue)&&(r.polygonOffset(Be,ue),K=Be,ce=ue)):Ce(r.POLYGON_OFFSET_FILL)}function De(Z){Z?we(r.SCISSOR_TEST):Ce(r.SCISSOR_TEST)}function O(Z){Z===void 0&&(Z=r.TEXTURE0+de-1),ye!==Z&&(r.activeTexture(Z),ye=Z)}function D(Z,Be,ue){ue===void 0&&(ye===null?ue=r.TEXTURE0+de-1:ue=ye);let ve=I[ue];ve===void 0&&(ve={type:void 0,texture:void 0},I[ue]=ve),(ve.type!==Z||ve.texture!==Be)&&(ye!==ue&&(r.activeTexture(ue),ye=ue),r.bindTexture(Z,Be||xe[Z]),ve.type=Z,ve.texture=Be)}function ne(){const Z=I[ye];Z!==void 0&&Z.type!==void 0&&(r.bindTexture(Z.type,null),Z.type=void 0,Z.texture=void 0)}function fe(){try{r.compressedTexImage2D(...arguments)}catch(Z){console.error("THREE.WebGLState:",Z)}}function be(){try{r.compressedTexImage3D(...arguments)}catch(Z){console.error("THREE.WebGLState:",Z)}}function ge(){try{r.texSubImage2D(...arguments)}catch(Z){console.error("THREE.WebGLState:",Z)}}function qe(){try{r.texSubImage3D(...arguments)}catch(Z){console.error("THREE.WebGLState:",Z)}}function Ue(){try{r.compressedTexSubImage2D(...arguments)}catch(Z){console.error("THREE.WebGLState:",Z)}}function Ve(){try{r.compressedTexSubImage3D(...arguments)}catch(Z){console.error("THREE.WebGLState:",Z)}}function Et(){try{r.texStorage2D(...arguments)}catch(Z){console.error("THREE.WebGLState:",Z)}}function Te(){try{r.texStorage3D(...arguments)}catch(Z){console.error("THREE.WebGLState:",Z)}}function Ge(){try{r.texImage2D(...arguments)}catch(Z){console.error("THREE.WebGLState:",Z)}}function et(){try{r.texImage3D(...arguments)}catch(Z){console.error("THREE.WebGLState:",Z)}}function Ye(Z){Ne.equals(Z)===!1&&(r.scissor(Z.x,Z.y,Z.z,Z.w),Ne.copy(Z))}function We(Z){Q.equals(Z)===!1&&(r.viewport(Z.x,Z.y,Z.z,Z.w),Q.copy(Z))}function ft(Z,Be){let ue=h.get(Be);ue===void 0&&(ue=new WeakMap,h.set(Be,ue));let ve=ue.get(Z);ve===void 0&&(ve=r.getUniformBlockIndex(Be,Z.name),ue.set(Z,ve))}function Qe(Z,Be){const ve=h.get(Be).get(Z);d.get(Be)!==ve&&(r.uniformBlockBinding(Be,ve,Z.__bindingPointIndex),d.set(Be,ve))}function Ht(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),u.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),m={},ye=null,I={},g={},v=new WeakMap,b=[],E=null,S=!1,x=null,y=null,T=null,N=null,A=null,P=null,F=null,k=new lt(0,0,0),z=0,R=!1,C=null,H=null,J=null,K=null,ce=null,Ne.set(0,0,r.canvas.width,r.canvas.height),Q.set(0,0,r.canvas.width,r.canvas.height),l.reset(),u.reset(),f.reset()}return{buffers:{color:l,depth:u,stencil:f},enable:we,disable:Ce,bindFramebuffer:Ke,drawBuffers:Oe,useProgram:xt,setBlending:V,setMaterial:on,setFlipSided:ct,setCullFace:Ae,setLineWidth:Re,setPolygonOffset:tt,setScissorTest:De,activeTexture:O,bindTexture:D,unbindTexture:ne,compressedTexImage2D:fe,compressedTexImage3D:be,texImage2D:Ge,texImage3D:et,updateUBOMapping:ft,uniformBlockBinding:Qe,texStorage2D:Et,texStorage3D:Te,texSubImage2D:ge,texSubImage3D:qe,compressedTexSubImage2D:Ue,compressedTexSubImage3D:Ve,scissor:Ye,viewport:We,reset:Ht}}function MD(r,e,t,i,s,l,u){const f=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,d=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Ct,m=new WeakMap;let g;const v=new WeakMap;let b=!1;try{b=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function E(O,D){return b?new OffscreenCanvas(O,D):Ol("canvas")}function S(O,D,ne){let fe=1;const be=De(O);if((be.width>ne||be.height>ne)&&(fe=ne/Math.max(be.width,be.height)),fe<1)if(typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&O instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&O instanceof ImageBitmap||typeof VideoFrame<"u"&&O instanceof VideoFrame){const ge=Math.floor(fe*be.width),qe=Math.floor(fe*be.height);g===void 0&&(g=E(ge,qe));const Ue=D?E(ge,qe):g;return Ue.width=ge,Ue.height=qe,Ue.getContext("2d").drawImage(O,0,0,ge,qe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+be.width+"x"+be.height+") to ("+ge+"x"+qe+")."),Ue}else return"data"in O&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+be.width+"x"+be.height+")."),O;return O}function x(O){return O.generateMipmaps}function y(O){r.generateMipmap(O)}function T(O){return O.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:O.isWebGL3DRenderTarget?r.TEXTURE_3D:O.isWebGLArrayRenderTarget||O.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function N(O,D,ne,fe,be=!1){if(O!==null){if(r[O]!==void 0)return r[O];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+O+"'")}let ge=D;if(D===r.RED&&(ne===r.FLOAT&&(ge=r.R32F),ne===r.HALF_FLOAT&&(ge=r.R16F),ne===r.UNSIGNED_BYTE&&(ge=r.R8)),D===r.RED_INTEGER&&(ne===r.UNSIGNED_BYTE&&(ge=r.R8UI),ne===r.UNSIGNED_SHORT&&(ge=r.R16UI),ne===r.UNSIGNED_INT&&(ge=r.R32UI),ne===r.BYTE&&(ge=r.R8I),ne===r.SHORT&&(ge=r.R16I),ne===r.INT&&(ge=r.R32I)),D===r.RG&&(ne===r.FLOAT&&(ge=r.RG32F),ne===r.HALF_FLOAT&&(ge=r.RG16F),ne===r.UNSIGNED_BYTE&&(ge=r.RG8)),D===r.RG_INTEGER&&(ne===r.UNSIGNED_BYTE&&(ge=r.RG8UI),ne===r.UNSIGNED_SHORT&&(ge=r.RG16UI),ne===r.UNSIGNED_INT&&(ge=r.RG32UI),ne===r.BYTE&&(ge=r.RG8I),ne===r.SHORT&&(ge=r.RG16I),ne===r.INT&&(ge=r.RG32I)),D===r.RGB_INTEGER&&(ne===r.UNSIGNED_BYTE&&(ge=r.RGB8UI),ne===r.UNSIGNED_SHORT&&(ge=r.RGB16UI),ne===r.UNSIGNED_INT&&(ge=r.RGB32UI),ne===r.BYTE&&(ge=r.RGB8I),ne===r.SHORT&&(ge=r.RGB16I),ne===r.INT&&(ge=r.RGB32I)),D===r.RGBA_INTEGER&&(ne===r.UNSIGNED_BYTE&&(ge=r.RGBA8UI),ne===r.UNSIGNED_SHORT&&(ge=r.RGBA16UI),ne===r.UNSIGNED_INT&&(ge=r.RGBA32UI),ne===r.BYTE&&(ge=r.RGBA8I),ne===r.SHORT&&(ge=r.RGBA16I),ne===r.INT&&(ge=r.RGBA32I)),D===r.RGB&&ne===r.UNSIGNED_INT_5_9_9_9_REV&&(ge=r.RGB9_E5),D===r.RGBA){const qe=be?ku:Rt.getTransfer(fe);ne===r.FLOAT&&(ge=r.RGBA32F),ne===r.HALF_FLOAT&&(ge=r.RGBA16F),ne===r.UNSIGNED_BYTE&&(ge=qe===Xt?r.SRGB8_ALPHA8:r.RGBA8),ne===r.UNSIGNED_SHORT_4_4_4_4&&(ge=r.RGBA4),ne===r.UNSIGNED_SHORT_5_5_5_1&&(ge=r.RGB5_A1)}return(ge===r.R16F||ge===r.R32F||ge===r.RG16F||ge===r.RG32F||ge===r.RGBA16F||ge===r.RGBA32F)&&e.get("EXT_color_buffer_float"),ge}function A(O,D){let ne;return O?D===null||D===Qr||D===ao?ne=r.DEPTH24_STENCIL8:D===Oi?ne=r.DEPTH32F_STENCIL8:D===Ll&&(ne=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):D===null||D===Qr||D===ao?ne=r.DEPTH_COMPONENT24:D===Oi?ne=r.DEPTH_COMPONENT32F:D===Ll&&(ne=r.DEPTH_COMPONENT16),ne}function P(O,D){return x(O)===!0||O.isFramebufferTexture&&O.minFilter!==qn&&O.minFilter!==ci?Math.log2(Math.max(D.width,D.height))+1:O.mipmaps!==void 0&&O.mipmaps.length>0?O.mipmaps.length:O.isCompressedTexture&&Array.isArray(O.image)?D.mipmaps.length:1}function F(O){const D=O.target;D.removeEventListener("dispose",F),z(D),D.isVideoTexture&&m.delete(D)}function k(O){const D=O.target;D.removeEventListener("dispose",k),C(D)}function z(O){const D=i.get(O);if(D.__webglInit===void 0)return;const ne=O.source,fe=v.get(ne);if(fe){const be=fe[D.__cacheKey];be.usedTimes--,be.usedTimes===0&&R(O),Object.keys(fe).length===0&&v.delete(ne)}i.remove(O)}function R(O){const D=i.get(O);r.deleteTexture(D.__webglTexture);const ne=O.source,fe=v.get(ne);delete fe[D.__cacheKey],u.memory.textures--}function C(O){const D=i.get(O);if(O.depthTexture&&(O.depthTexture.dispose(),i.remove(O.depthTexture)),O.isWebGLCubeRenderTarget)for(let fe=0;fe<6;fe++){if(Array.isArray(D.__webglFramebuffer[fe]))for(let be=0;be<D.__webglFramebuffer[fe].length;be++)r.deleteFramebuffer(D.__webglFramebuffer[fe][be]);else r.deleteFramebuffer(D.__webglFramebuffer[fe]);D.__webglDepthbuffer&&r.deleteRenderbuffer(D.__webglDepthbuffer[fe])}else{if(Array.isArray(D.__webglFramebuffer))for(let fe=0;fe<D.__webglFramebuffer.length;fe++)r.deleteFramebuffer(D.__webglFramebuffer[fe]);else r.deleteFramebuffer(D.__webglFramebuffer);if(D.__webglDepthbuffer&&r.deleteRenderbuffer(D.__webglDepthbuffer),D.__webglMultisampledFramebuffer&&r.deleteFramebuffer(D.__webglMultisampledFramebuffer),D.__webglColorRenderbuffer)for(let fe=0;fe<D.__webglColorRenderbuffer.length;fe++)D.__webglColorRenderbuffer[fe]&&r.deleteRenderbuffer(D.__webglColorRenderbuffer[fe]);D.__webglDepthRenderbuffer&&r.deleteRenderbuffer(D.__webglDepthRenderbuffer)}const ne=O.textures;for(let fe=0,be=ne.length;fe<be;fe++){const ge=i.get(ne[fe]);ge.__webglTexture&&(r.deleteTexture(ge.__webglTexture),u.memory.textures--),i.remove(ne[fe])}i.remove(O)}let H=0;function J(){H=0}function K(){const O=H;return O>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+O+" texture units while this GPU supports only "+s.maxTextures),H+=1,O}function ce(O){const D=[];return D.push(O.wrapS),D.push(O.wrapT),D.push(O.wrapR||0),D.push(O.magFilter),D.push(O.minFilter),D.push(O.anisotropy),D.push(O.internalFormat),D.push(O.format),D.push(O.type),D.push(O.generateMipmaps),D.push(O.premultiplyAlpha),D.push(O.flipY),D.push(O.unpackAlignment),D.push(O.colorSpace),D.join()}function de(O,D){const ne=i.get(O);if(O.isVideoTexture&&Re(O),O.isRenderTargetTexture===!1&&O.version>0&&ne.__version!==O.version){const fe=O.image;if(fe===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(fe.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Q(ne,O,D);return}}t.bindTexture(r.TEXTURE_2D,ne.__webglTexture,r.TEXTURE0+D)}function W(O,D){const ne=i.get(O);if(O.version>0&&ne.__version!==O.version){Q(ne,O,D);return}t.bindTexture(r.TEXTURE_2D_ARRAY,ne.__webglTexture,r.TEXTURE0+D)}function le(O,D){const ne=i.get(O);if(O.version>0&&ne.__version!==O.version){Q(ne,O,D);return}t.bindTexture(r.TEXTURE_3D,ne.__webglTexture,r.TEXTURE0+D)}function Y(O,D){const ne=i.get(O);if(O.version>0&&ne.__version!==O.version){me(ne,O,D);return}t.bindTexture(r.TEXTURE_CUBE_MAP,ne.__webglTexture,r.TEXTURE0+D)}const ye={[io]:r.REPEAT,[cr]:r.CLAMP_TO_EDGE,[zu]:r.MIRRORED_REPEAT},I={[qn]:r.NEAREST,[fb]:r.NEAREST_MIPMAP_NEAREST,[Tl]:r.NEAREST_MIPMAP_LINEAR,[ci]:r.LINEAR,[Cu]:r.LINEAR_MIPMAP_NEAREST,[wa]:r.LINEAR_MIPMAP_LINEAR},re={[oT]:r.NEVER,[hT]:r.ALWAYS,[lT]:r.LESS,[Mb]:r.LEQUAL,[cT]:r.EQUAL,[dT]:r.GEQUAL,[uT]:r.GREATER,[fT]:r.NOTEQUAL};function Se(O,D){if(D.type===Oi&&e.has("OES_texture_float_linear")===!1&&(D.magFilter===ci||D.magFilter===Cu||D.magFilter===Tl||D.magFilter===wa||D.minFilter===ci||D.minFilter===Cu||D.minFilter===Tl||D.minFilter===wa)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(O,r.TEXTURE_WRAP_S,ye[D.wrapS]),r.texParameteri(O,r.TEXTURE_WRAP_T,ye[D.wrapT]),(O===r.TEXTURE_3D||O===r.TEXTURE_2D_ARRAY)&&r.texParameteri(O,r.TEXTURE_WRAP_R,ye[D.wrapR]),r.texParameteri(O,r.TEXTURE_MAG_FILTER,I[D.magFilter]),r.texParameteri(O,r.TEXTURE_MIN_FILTER,I[D.minFilter]),D.compareFunction&&(r.texParameteri(O,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(O,r.TEXTURE_COMPARE_FUNC,re[D.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(D.magFilter===qn||D.minFilter!==Tl&&D.minFilter!==wa||D.type===Oi&&e.has("OES_texture_float_linear")===!1)return;if(D.anisotropy>1||i.get(D).__currentAnisotropy){const ne=e.get("EXT_texture_filter_anisotropic");r.texParameterf(O,ne.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(D.anisotropy,s.getMaxAnisotropy())),i.get(D).__currentAnisotropy=D.anisotropy}}}function Ne(O,D){let ne=!1;O.__webglInit===void 0&&(O.__webglInit=!0,D.addEventListener("dispose",F));const fe=D.source;let be=v.get(fe);be===void 0&&(be={},v.set(fe,be));const ge=ce(D);if(ge!==O.__cacheKey){be[ge]===void 0&&(be[ge]={texture:r.createTexture(),usedTimes:0},u.memory.textures++,ne=!0),be[ge].usedTimes++;const qe=be[O.__cacheKey];qe!==void 0&&(be[O.__cacheKey].usedTimes--,qe.usedTimes===0&&R(D)),O.__cacheKey=ge,O.__webglTexture=be[ge].texture}return ne}function Q(O,D,ne){let fe=r.TEXTURE_2D;(D.isDataArrayTexture||D.isCompressedArrayTexture)&&(fe=r.TEXTURE_2D_ARRAY),D.isData3DTexture&&(fe=r.TEXTURE_3D);const be=Ne(O,D),ge=D.source;t.bindTexture(fe,O.__webglTexture,r.TEXTURE0+ne);const qe=i.get(ge);if(ge.version!==qe.__version||be===!0){t.activeTexture(r.TEXTURE0+ne);const Ue=Rt.getPrimaries(Rt.workingColorSpace),Ve=D.colorSpace===lr?null:Rt.getPrimaries(D.colorSpace),Et=D.colorSpace===lr||Ue===Ve?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,D.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,D.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Et);let Te=S(D.image,!1,s.maxTextureSize);Te=tt(D,Te);const Ge=l.convert(D.format,D.colorSpace),et=l.convert(D.type);let Ye=N(D.internalFormat,Ge,et,D.colorSpace,D.isVideoTexture);Se(fe,D);let We;const ft=D.mipmaps,Qe=D.isVideoTexture!==!0,Ht=qe.__version===void 0||be===!0,Z=ge.dataReady,Be=P(D,Te);if(D.isDepthTexture)Ye=A(D.format===ro,D.type),Ht&&(Qe?t.texStorage2D(r.TEXTURE_2D,1,Ye,Te.width,Te.height):t.texImage2D(r.TEXTURE_2D,0,Ye,Te.width,Te.height,0,Ge,et,null));else if(D.isDataTexture)if(ft.length>0){Qe&&Ht&&t.texStorage2D(r.TEXTURE_2D,Be,Ye,ft[0].width,ft[0].height);for(let ue=0,ve=ft.length;ue<ve;ue++)We=ft[ue],Qe?Z&&t.texSubImage2D(r.TEXTURE_2D,ue,0,0,We.width,We.height,Ge,et,We.data):t.texImage2D(r.TEXTURE_2D,ue,Ye,We.width,We.height,0,Ge,et,We.data);D.generateMipmaps=!1}else Qe?(Ht&&t.texStorage2D(r.TEXTURE_2D,Be,Ye,Te.width,Te.height),Z&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,Te.width,Te.height,Ge,et,Te.data)):t.texImage2D(r.TEXTURE_2D,0,Ye,Te.width,Te.height,0,Ge,et,Te.data);else if(D.isCompressedTexture)if(D.isCompressedArrayTexture){Qe&&Ht&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Be,Ye,ft[0].width,ft[0].height,Te.depth);for(let ue=0,ve=ft.length;ue<ve;ue++)if(We=ft[ue],D.format!==Mi)if(Ge!==null)if(Qe){if(Z)if(D.layerUpdates.size>0){const Pe=$v(We.width,We.height,D.format,D.type);for(const Ie of D.layerUpdates){const at=We.data.subarray(Ie*Pe/We.data.BYTES_PER_ELEMENT,(Ie+1)*Pe/We.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ue,0,0,Ie,We.width,We.height,1,Ge,at)}D.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ue,0,0,0,We.width,We.height,Te.depth,Ge,We.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,ue,Ye,We.width,We.height,Te.depth,0,We.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Qe?Z&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,ue,0,0,0,We.width,We.height,Te.depth,Ge,et,We.data):t.texImage3D(r.TEXTURE_2D_ARRAY,ue,Ye,We.width,We.height,Te.depth,0,Ge,et,We.data)}else{Qe&&Ht&&t.texStorage2D(r.TEXTURE_2D,Be,Ye,ft[0].width,ft[0].height);for(let ue=0,ve=ft.length;ue<ve;ue++)We=ft[ue],D.format!==Mi?Ge!==null?Qe?Z&&t.compressedTexSubImage2D(r.TEXTURE_2D,ue,0,0,We.width,We.height,Ge,We.data):t.compressedTexImage2D(r.TEXTURE_2D,ue,Ye,We.width,We.height,0,We.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Qe?Z&&t.texSubImage2D(r.TEXTURE_2D,ue,0,0,We.width,We.height,Ge,et,We.data):t.texImage2D(r.TEXTURE_2D,ue,Ye,We.width,We.height,0,Ge,et,We.data)}else if(D.isDataArrayTexture)if(Qe){if(Ht&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Be,Ye,Te.width,Te.height,Te.depth),Z)if(D.layerUpdates.size>0){const ue=$v(Te.width,Te.height,D.format,D.type);for(const ve of D.layerUpdates){const Pe=Te.data.subarray(ve*ue/Te.data.BYTES_PER_ELEMENT,(ve+1)*ue/Te.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,ve,Te.width,Te.height,1,Ge,et,Pe)}D.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,Te.width,Te.height,Te.depth,Ge,et,Te.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,Ye,Te.width,Te.height,Te.depth,0,Ge,et,Te.data);else if(D.isData3DTexture)Qe?(Ht&&t.texStorage3D(r.TEXTURE_3D,Be,Ye,Te.width,Te.height,Te.depth),Z&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,Te.width,Te.height,Te.depth,Ge,et,Te.data)):t.texImage3D(r.TEXTURE_3D,0,Ye,Te.width,Te.height,Te.depth,0,Ge,et,Te.data);else if(D.isFramebufferTexture){if(Ht)if(Qe)t.texStorage2D(r.TEXTURE_2D,Be,Ye,Te.width,Te.height);else{let ue=Te.width,ve=Te.height;for(let Pe=0;Pe<Be;Pe++)t.texImage2D(r.TEXTURE_2D,Pe,Ye,ue,ve,0,Ge,et,null),ue>>=1,ve>>=1}}else if(ft.length>0){if(Qe&&Ht){const ue=De(ft[0]);t.texStorage2D(r.TEXTURE_2D,Be,Ye,ue.width,ue.height)}for(let ue=0,ve=ft.length;ue<ve;ue++)We=ft[ue],Qe?Z&&t.texSubImage2D(r.TEXTURE_2D,ue,0,0,Ge,et,We):t.texImage2D(r.TEXTURE_2D,ue,Ye,Ge,et,We);D.generateMipmaps=!1}else if(Qe){if(Ht){const ue=De(Te);t.texStorage2D(r.TEXTURE_2D,Be,Ye,ue.width,ue.height)}Z&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,Ge,et,Te)}else t.texImage2D(r.TEXTURE_2D,0,Ye,Ge,et,Te);x(D)&&y(fe),qe.__version=ge.version,D.onUpdate&&D.onUpdate(D)}O.__version=D.version}function me(O,D,ne){if(D.image.length!==6)return;const fe=Ne(O,D),be=D.source;t.bindTexture(r.TEXTURE_CUBE_MAP,O.__webglTexture,r.TEXTURE0+ne);const ge=i.get(be);if(be.version!==ge.__version||fe===!0){t.activeTexture(r.TEXTURE0+ne);const qe=Rt.getPrimaries(Rt.workingColorSpace),Ue=D.colorSpace===lr?null:Rt.getPrimaries(D.colorSpace),Ve=D.colorSpace===lr||qe===Ue?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,D.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,D.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ve);const Et=D.isCompressedTexture||D.image[0].isCompressedTexture,Te=D.image[0]&&D.image[0].isDataTexture,Ge=[];for(let ve=0;ve<6;ve++)!Et&&!Te?Ge[ve]=S(D.image[ve],!0,s.maxCubemapSize):Ge[ve]=Te?D.image[ve].image:D.image[ve],Ge[ve]=tt(D,Ge[ve]);const et=Ge[0],Ye=l.convert(D.format,D.colorSpace),We=l.convert(D.type),ft=N(D.internalFormat,Ye,We,D.colorSpace),Qe=D.isVideoTexture!==!0,Ht=ge.__version===void 0||fe===!0,Z=be.dataReady;let Be=P(D,et);Se(r.TEXTURE_CUBE_MAP,D);let ue;if(Et){Qe&&Ht&&t.texStorage2D(r.TEXTURE_CUBE_MAP,Be,ft,et.width,et.height);for(let ve=0;ve<6;ve++){ue=Ge[ve].mipmaps;for(let Pe=0;Pe<ue.length;Pe++){const Ie=ue[Pe];D.format!==Mi?Ye!==null?Qe?Z&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Pe,0,0,Ie.width,Ie.height,Ye,Ie.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Pe,ft,Ie.width,Ie.height,0,Ie.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Qe?Z&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Pe,0,0,Ie.width,Ie.height,Ye,We,Ie.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Pe,ft,Ie.width,Ie.height,0,Ye,We,Ie.data)}}}else{if(ue=D.mipmaps,Qe&&Ht){ue.length>0&&Be++;const ve=De(Ge[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,Be,ft,ve.width,ve.height)}for(let ve=0;ve<6;ve++)if(Te){Qe?Z&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,0,0,Ge[ve].width,Ge[ve].height,Ye,We,Ge[ve].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,ft,Ge[ve].width,Ge[ve].height,0,Ye,We,Ge[ve].data);for(let Pe=0;Pe<ue.length;Pe++){const at=ue[Pe].image[ve].image;Qe?Z&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Pe+1,0,0,at.width,at.height,Ye,We,at.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Pe+1,ft,at.width,at.height,0,Ye,We,at.data)}}else{Qe?Z&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,0,0,Ye,We,Ge[ve]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,0,ft,Ye,We,Ge[ve]);for(let Pe=0;Pe<ue.length;Pe++){const Ie=ue[Pe];Qe?Z&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Pe+1,0,0,Ye,We,Ie.image[ve]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ve,Pe+1,ft,Ye,We,Ie.image[ve])}}}x(D)&&y(r.TEXTURE_CUBE_MAP),ge.__version=be.version,D.onUpdate&&D.onUpdate(D)}O.__version=D.version}function xe(O,D,ne,fe,be,ge){const qe=l.convert(ne.format,ne.colorSpace),Ue=l.convert(ne.type),Ve=N(ne.internalFormat,qe,Ue,ne.colorSpace),Et=i.get(D),Te=i.get(ne);if(Te.__renderTarget=D,!Et.__hasExternalTextures){const Ge=Math.max(1,D.width>>ge),et=Math.max(1,D.height>>ge);be===r.TEXTURE_3D||be===r.TEXTURE_2D_ARRAY?t.texImage3D(be,ge,Ve,Ge,et,D.depth,0,qe,Ue,null):t.texImage2D(be,ge,Ve,Ge,et,0,qe,Ue,null)}t.bindFramebuffer(r.FRAMEBUFFER,O),Ae(D)?f.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,fe,be,Te.__webglTexture,0,ct(D)):(be===r.TEXTURE_2D||be>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&be<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,fe,be,Te.__webglTexture,ge),t.bindFramebuffer(r.FRAMEBUFFER,null)}function we(O,D,ne){if(r.bindRenderbuffer(r.RENDERBUFFER,O),D.depthBuffer){const fe=D.depthTexture,be=fe&&fe.isDepthTexture?fe.type:null,ge=A(D.stencilBuffer,be),qe=D.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Ue=ct(D);Ae(D)?f.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Ue,ge,D.width,D.height):ne?r.renderbufferStorageMultisample(r.RENDERBUFFER,Ue,ge,D.width,D.height):r.renderbufferStorage(r.RENDERBUFFER,ge,D.width,D.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,qe,r.RENDERBUFFER,O)}else{const fe=D.textures;for(let be=0;be<fe.length;be++){const ge=fe[be],qe=l.convert(ge.format,ge.colorSpace),Ue=l.convert(ge.type),Ve=N(ge.internalFormat,qe,Ue,ge.colorSpace),Et=ct(D);ne&&Ae(D)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,Et,Ve,D.width,D.height):Ae(D)?f.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Et,Ve,D.width,D.height):r.renderbufferStorage(r.RENDERBUFFER,Ve,D.width,D.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Ce(O,D){if(D&&D.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,O),!(D.depthTexture&&D.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const fe=i.get(D.depthTexture);fe.__renderTarget=D,(!fe.__webglTexture||D.depthTexture.image.width!==D.width||D.depthTexture.image.height!==D.height)&&(D.depthTexture.image.width=D.width,D.depthTexture.image.height=D.height,D.depthTexture.needsUpdate=!0),de(D.depthTexture,0);const be=fe.__webglTexture,ge=ct(D);if(D.depthTexture.format===$s)Ae(D)?f.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,be,0,ge):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,be,0);else if(D.depthTexture.format===ro)Ae(D)?f.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,be,0,ge):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,be,0);else throw new Error("Unknown depthTexture format")}function Ke(O){const D=i.get(O),ne=O.isWebGLCubeRenderTarget===!0;if(D.__boundDepthTexture!==O.depthTexture){const fe=O.depthTexture;if(D.__depthDisposeCallback&&D.__depthDisposeCallback(),fe){const be=()=>{delete D.__boundDepthTexture,delete D.__depthDisposeCallback,fe.removeEventListener("dispose",be)};fe.addEventListener("dispose",be),D.__depthDisposeCallback=be}D.__boundDepthTexture=fe}if(O.depthTexture&&!D.__autoAllocateDepthBuffer){if(ne)throw new Error("target.depthTexture not supported in Cube render targets");Ce(D.__webglFramebuffer,O)}else if(ne){D.__webglDepthbuffer=[];for(let fe=0;fe<6;fe++)if(t.bindFramebuffer(r.FRAMEBUFFER,D.__webglFramebuffer[fe]),D.__webglDepthbuffer[fe]===void 0)D.__webglDepthbuffer[fe]=r.createRenderbuffer(),we(D.__webglDepthbuffer[fe],O,!1);else{const be=O.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ge=D.__webglDepthbuffer[fe];r.bindRenderbuffer(r.RENDERBUFFER,ge),r.framebufferRenderbuffer(r.FRAMEBUFFER,be,r.RENDERBUFFER,ge)}}else if(t.bindFramebuffer(r.FRAMEBUFFER,D.__webglFramebuffer),D.__webglDepthbuffer===void 0)D.__webglDepthbuffer=r.createRenderbuffer(),we(D.__webglDepthbuffer,O,!1);else{const fe=O.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,be=D.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,be),r.framebufferRenderbuffer(r.FRAMEBUFFER,fe,r.RENDERBUFFER,be)}t.bindFramebuffer(r.FRAMEBUFFER,null)}function Oe(O,D,ne){const fe=i.get(O);D!==void 0&&xe(fe.__webglFramebuffer,O,O.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),ne!==void 0&&Ke(O)}function xt(O){const D=O.texture,ne=i.get(O),fe=i.get(D);O.addEventListener("dispose",k);const be=O.textures,ge=O.isWebGLCubeRenderTarget===!0,qe=be.length>1;if(qe||(fe.__webglTexture===void 0&&(fe.__webglTexture=r.createTexture()),fe.__version=D.version,u.memory.textures++),ge){ne.__webglFramebuffer=[];for(let Ue=0;Ue<6;Ue++)if(D.mipmaps&&D.mipmaps.length>0){ne.__webglFramebuffer[Ue]=[];for(let Ve=0;Ve<D.mipmaps.length;Ve++)ne.__webglFramebuffer[Ue][Ve]=r.createFramebuffer()}else ne.__webglFramebuffer[Ue]=r.createFramebuffer()}else{if(D.mipmaps&&D.mipmaps.length>0){ne.__webglFramebuffer=[];for(let Ue=0;Ue<D.mipmaps.length;Ue++)ne.__webglFramebuffer[Ue]=r.createFramebuffer()}else ne.__webglFramebuffer=r.createFramebuffer();if(qe)for(let Ue=0,Ve=be.length;Ue<Ve;Ue++){const Et=i.get(be[Ue]);Et.__webglTexture===void 0&&(Et.__webglTexture=r.createTexture(),u.memory.textures++)}if(O.samples>0&&Ae(O)===!1){ne.__webglMultisampledFramebuffer=r.createFramebuffer(),ne.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,ne.__webglMultisampledFramebuffer);for(let Ue=0;Ue<be.length;Ue++){const Ve=be[Ue];ne.__webglColorRenderbuffer[Ue]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,ne.__webglColorRenderbuffer[Ue]);const Et=l.convert(Ve.format,Ve.colorSpace),Te=l.convert(Ve.type),Ge=N(Ve.internalFormat,Et,Te,Ve.colorSpace,O.isXRRenderTarget===!0),et=ct(O);r.renderbufferStorageMultisample(r.RENDERBUFFER,et,Ge,O.width,O.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ue,r.RENDERBUFFER,ne.__webglColorRenderbuffer[Ue])}r.bindRenderbuffer(r.RENDERBUFFER,null),O.depthBuffer&&(ne.__webglDepthRenderbuffer=r.createRenderbuffer(),we(ne.__webglDepthRenderbuffer,O,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(ge){t.bindTexture(r.TEXTURE_CUBE_MAP,fe.__webglTexture),Se(r.TEXTURE_CUBE_MAP,D);for(let Ue=0;Ue<6;Ue++)if(D.mipmaps&&D.mipmaps.length>0)for(let Ve=0;Ve<D.mipmaps.length;Ve++)xe(ne.__webglFramebuffer[Ue][Ve],O,D,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,Ve);else xe(ne.__webglFramebuffer[Ue],O,D,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,0);x(D)&&y(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(qe){for(let Ue=0,Ve=be.length;Ue<Ve;Ue++){const Et=be[Ue],Te=i.get(Et);t.bindTexture(r.TEXTURE_2D,Te.__webglTexture),Se(r.TEXTURE_2D,Et),xe(ne.__webglFramebuffer,O,Et,r.COLOR_ATTACHMENT0+Ue,r.TEXTURE_2D,0),x(Et)&&y(r.TEXTURE_2D)}t.unbindTexture()}else{let Ue=r.TEXTURE_2D;if((O.isWebGL3DRenderTarget||O.isWebGLArrayRenderTarget)&&(Ue=O.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(Ue,fe.__webglTexture),Se(Ue,D),D.mipmaps&&D.mipmaps.length>0)for(let Ve=0;Ve<D.mipmaps.length;Ve++)xe(ne.__webglFramebuffer[Ve],O,D,r.COLOR_ATTACHMENT0,Ue,Ve);else xe(ne.__webglFramebuffer,O,D,r.COLOR_ATTACHMENT0,Ue,0);x(D)&&y(Ue),t.unbindTexture()}O.depthBuffer&&Ke(O)}function Dt(O){const D=O.textures;for(let ne=0,fe=D.length;ne<fe;ne++){const be=D[ne];if(x(be)){const ge=T(O),qe=i.get(be).__webglTexture;t.bindTexture(ge,qe),y(ge),t.unbindTexture()}}}const it=[],V=[];function on(O){if(O.samples>0){if(Ae(O)===!1){const D=O.textures,ne=O.width,fe=O.height;let be=r.COLOR_BUFFER_BIT;const ge=O.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,qe=i.get(O),Ue=D.length>1;if(Ue)for(let Ve=0;Ve<D.length;Ve++)t.bindFramebuffer(r.FRAMEBUFFER,qe.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ve,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,qe.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ve,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,qe.__webglMultisampledFramebuffer),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,qe.__webglFramebuffer);for(let Ve=0;Ve<D.length;Ve++){if(O.resolveDepthBuffer&&(O.depthBuffer&&(be|=r.DEPTH_BUFFER_BIT),O.stencilBuffer&&O.resolveStencilBuffer&&(be|=r.STENCIL_BUFFER_BIT)),Ue){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,qe.__webglColorRenderbuffer[Ve]);const Et=i.get(D[Ve]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Et,0)}r.blitFramebuffer(0,0,ne,fe,0,0,ne,fe,be,r.NEAREST),d===!0&&(it.length=0,V.length=0,it.push(r.COLOR_ATTACHMENT0+Ve),O.depthBuffer&&O.resolveDepthBuffer===!1&&(it.push(ge),V.push(ge),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,V)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,it))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),Ue)for(let Ve=0;Ve<D.length;Ve++){t.bindFramebuffer(r.FRAMEBUFFER,qe.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ve,r.RENDERBUFFER,qe.__webglColorRenderbuffer[Ve]);const Et=i.get(D[Ve]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,qe.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Ve,r.TEXTURE_2D,Et,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,qe.__webglMultisampledFramebuffer)}else if(O.depthBuffer&&O.resolveDepthBuffer===!1&&d){const D=O.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[D])}}}function ct(O){return Math.min(s.maxSamples,O.samples)}function Ae(O){const D=i.get(O);return O.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&D.__useRenderToTexture!==!1}function Re(O){const D=u.render.frame;m.get(O)!==D&&(m.set(O,D),O.update())}function tt(O,D){const ne=O.colorSpace,fe=O.format,be=O.type;return O.isCompressedTexture===!0||O.isVideoTexture===!0||ne!==jn&&ne!==lr&&(Rt.getTransfer(ne)===Xt?(fe!==Mi||be!==La)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",ne)),D}function De(O){return typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement?(h.width=O.naturalWidth||O.width,h.height=O.naturalHeight||O.height):typeof VideoFrame<"u"&&O instanceof VideoFrame?(h.width=O.displayWidth,h.height=O.displayHeight):(h.width=O.width,h.height=O.height),h}this.allocateTextureUnit=K,this.resetTextureUnits=J,this.setTexture2D=de,this.setTexture2DArray=W,this.setTexture3D=le,this.setTextureCube=Y,this.rebindTextures=Oe,this.setupRenderTarget=xt,this.updateRenderTargetMipmap=Dt,this.updateMultisampleRenderTarget=on,this.setupDepthRenderbuffer=Ke,this.setupFrameBufferTexture=xe,this.useMultisampledRTT=Ae}function SD(r,e){function t(i,s=lr){let l;const u=Rt.getTransfer(s);if(i===La)return r.UNSIGNED_BYTE;if(i===Jp)return r.UNSIGNED_SHORT_4_4_4_4;if(i===em)return r.UNSIGNED_SHORT_5_5_5_1;if(i===pb)return r.UNSIGNED_INT_5_9_9_9_REV;if(i===db)return r.BYTE;if(i===hb)return r.SHORT;if(i===Ll)return r.UNSIGNED_SHORT;if(i===Qp)return r.INT;if(i===Qr)return r.UNSIGNED_INT;if(i===Oi)return r.FLOAT;if(i===Hl)return r.HALF_FLOAT;if(i===mb)return r.ALPHA;if(i===gb)return r.RGB;if(i===Mi)return r.RGBA;if(i===_b)return r.LUMINANCE;if(i===vb)return r.LUMINANCE_ALPHA;if(i===$s)return r.DEPTH_COMPONENT;if(i===ro)return r.DEPTH_STENCIL;if(i===tm)return r.RED;if(i===nm)return r.RED_INTEGER;if(i===yb)return r.RG;if(i===im)return r.RG_INTEGER;if(i===am)return r.RGBA_INTEGER;if(i===Du||i===Nu||i===Lu||i===Uu)if(u===Xt)if(l=e.get("WEBGL_compressed_texture_s3tc_srgb"),l!==null){if(i===Du)return l.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Nu)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Lu)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Uu)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(l=e.get("WEBGL_compressed_texture_s3tc"),l!==null){if(i===Du)return l.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Nu)return l.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Lu)return l.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Uu)return l.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===ap||i===rp||i===sp||i===op)if(l=e.get("WEBGL_compressed_texture_pvrtc"),l!==null){if(i===ap)return l.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===rp)return l.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===sp)return l.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===op)return l.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===lp||i===cp||i===up)if(l=e.get("WEBGL_compressed_texture_etc"),l!==null){if(i===lp||i===cp)return u===Xt?l.COMPRESSED_SRGB8_ETC2:l.COMPRESSED_RGB8_ETC2;if(i===up)return u===Xt?l.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:l.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===fp||i===dp||i===hp||i===pp||i===mp||i===gp||i===_p||i===vp||i===yp||i===bp||i===xp||i===Ep||i===Mp||i===Sp)if(l=e.get("WEBGL_compressed_texture_astc"),l!==null){if(i===fp)return u===Xt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:l.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===dp)return u===Xt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:l.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===hp)return u===Xt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:l.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===pp)return u===Xt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:l.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===mp)return u===Xt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:l.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===gp)return u===Xt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:l.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===_p)return u===Xt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:l.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===vp)return u===Xt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:l.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===yp)return u===Xt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:l.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===bp)return u===Xt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:l.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===xp)return u===Xt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:l.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ep)return u===Xt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:l.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Mp)return u===Xt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:l.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Sp)return u===Xt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:l.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Pu||i===wp||i===Tp)if(l=e.get("EXT_texture_compression_bptc"),l!==null){if(i===Pu)return u===Xt?l.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:l.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===wp)return l.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Tp)return l.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===bb||i===Ap||i===Rp||i===Cp)if(l=e.get("EXT_texture_compression_rgtc"),l!==null){if(i===Pu)return l.COMPRESSED_RED_RGTC1_EXT;if(i===Ap)return l.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Rp)return l.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Cp)return l.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ao?r.UNSIGNED_INT_24_8:r[i]!==void 0?r[i]:null}return{convert:t}}const wD=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,TD=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class AD{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const s=new wn,l=e.properties.get(s);l.__webglTexture=t.texture,(t.depthNear!==i.depthNear||t.depthFar!==i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new hr({vertexShader:wD,fragmentShader:TD,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Bt(new Vl(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class RD extends mo{constructor(e,t){super();const i=this;let s=null,l=1,u=null,f="local-floor",d=1,h=null,m=null,g=null,v=null,b=null,E=null;const S=new AD,x=t.getContextAttributes();let y=null,T=null;const N=[],A=[],P=new Ct;let F=null;const k=new Xn;k.viewport=new Ot;const z=new Xn;z.viewport=new Ot;const R=[k,z],C=new z1;let H=null,J=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let me=N[Q];return me===void 0&&(me=new Rh,N[Q]=me),me.getTargetRaySpace()},this.getControllerGrip=function(Q){let me=N[Q];return me===void 0&&(me=new Rh,N[Q]=me),me.getGripSpace()},this.getHand=function(Q){let me=N[Q];return me===void 0&&(me=new Rh,N[Q]=me),me.getHandSpace()};function K(Q){const me=A.indexOf(Q.inputSource);if(me===-1)return;const xe=N[me];xe!==void 0&&(xe.update(Q.inputSource,Q.frame,h||u),xe.dispatchEvent({type:Q.type,data:Q.inputSource}))}function ce(){s.removeEventListener("select",K),s.removeEventListener("selectstart",K),s.removeEventListener("selectend",K),s.removeEventListener("squeeze",K),s.removeEventListener("squeezestart",K),s.removeEventListener("squeezeend",K),s.removeEventListener("end",ce),s.removeEventListener("inputsourceschange",de);for(let Q=0;Q<N.length;Q++){const me=A[Q];me!==null&&(A[Q]=null,N[Q].disconnect(me))}H=null,J=null,S.reset(),e.setRenderTarget(y),b=null,v=null,g=null,s=null,T=null,Ne.stop(),i.isPresenting=!1,e.setPixelRatio(F),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){l=Q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){f=Q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||u},this.setReferenceSpace=function(Q){h=Q},this.getBaseLayer=function(){return v!==null?v:b},this.getBinding=function(){return g},this.getFrame=function(){return E},this.getSession=function(){return s},this.setSession=async function(Q){if(s=Q,s!==null){if(y=e.getRenderTarget(),s.addEventListener("select",K),s.addEventListener("selectstart",K),s.addEventListener("selectend",K),s.addEventListener("squeeze",K),s.addEventListener("squeezestart",K),s.addEventListener("squeezeend",K),s.addEventListener("end",ce),s.addEventListener("inputsourceschange",de),x.xrCompatible!==!0&&await t.makeXRCompatible(),F=e.getPixelRatio(),e.getSize(P),typeof XRWebGLBinding<"u"&&"createProjectionLayer"in XRWebGLBinding.prototype){let xe=null,we=null,Ce=null;x.depth&&(Ce=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,xe=x.stencil?ro:$s,we=x.stencil?ao:Qr);const Ke={colorFormat:t.RGBA8,depthFormat:Ce,scaleFactor:l};g=new XRWebGLBinding(s,t),v=g.createProjectionLayer(Ke),s.updateRenderState({layers:[v]}),e.setPixelRatio(1),e.setSize(v.textureWidth,v.textureHeight,!1),T=new Jr(v.textureWidth,v.textureHeight,{format:Mi,type:La,depthTexture:new Fb(v.textureWidth,v.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,xe),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:v.ignoreDepthValues===!1,resolveStencilBuffer:v.ignoreDepthValues===!1})}else{const xe={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:l};b=new XRWebGLLayer(s,t,xe),s.updateRenderState({baseLayer:b}),e.setPixelRatio(1),e.setSize(b.framebufferWidth,b.framebufferHeight,!1),T=new Jr(b.framebufferWidth,b.framebufferHeight,{format:Mi,type:La,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:b.ignoreDepthValues===!1,resolveStencilBuffer:b.ignoreDepthValues===!1})}T.isXRRenderTarget=!0,this.setFoveation(d),h=null,u=await s.requestReferenceSpace(f),Ne.setContext(s),Ne.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return S.getDepthTexture()};function de(Q){for(let me=0;me<Q.removed.length;me++){const xe=Q.removed[me],we=A.indexOf(xe);we>=0&&(A[we]=null,N[we].disconnect(xe))}for(let me=0;me<Q.added.length;me++){const xe=Q.added[me];let we=A.indexOf(xe);if(we===-1){for(let Ke=0;Ke<N.length;Ke++)if(Ke>=A.length){A.push(xe),we=Ke;break}else if(A[Ke]===null){A[Ke]=xe,we=Ke;break}if(we===-1)break}const Ce=N[we];Ce&&Ce.connect(xe)}}const W=new X,le=new X;function Y(Q,me,xe){W.setFromMatrixPosition(me.matrixWorld),le.setFromMatrixPosition(xe.matrixWorld);const we=W.distanceTo(le),Ce=me.projectionMatrix.elements,Ke=xe.projectionMatrix.elements,Oe=Ce[14]/(Ce[10]-1),xt=Ce[14]/(Ce[10]+1),Dt=(Ce[9]+1)/Ce[5],it=(Ce[9]-1)/Ce[5],V=(Ce[8]-1)/Ce[0],on=(Ke[8]+1)/Ke[0],ct=Oe*V,Ae=Oe*on,Re=we/(-V+on),tt=Re*-V;if(me.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(tt),Q.translateZ(Re),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),Ce[10]===-1)Q.projectionMatrix.copy(me.projectionMatrix),Q.projectionMatrixInverse.copy(me.projectionMatrixInverse);else{const De=Oe+Re,O=xt+Re,D=ct-tt,ne=Ae+(we-tt),fe=Dt*xt/O*De,be=it*xt/O*De;Q.projectionMatrix.makePerspective(D,ne,fe,be,De,O),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function ye(Q,me){me===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(me.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(s===null)return;let me=Q.near,xe=Q.far;S.texture!==null&&(S.depthNear>0&&(me=S.depthNear),S.depthFar>0&&(xe=S.depthFar)),C.near=z.near=k.near=me,C.far=z.far=k.far=xe,(H!==C.near||J!==C.far)&&(s.updateRenderState({depthNear:C.near,depthFar:C.far}),H=C.near,J=C.far),k.layers.mask=Q.layers.mask|2,z.layers.mask=Q.layers.mask|4,C.layers.mask=k.layers.mask|z.layers.mask;const we=Q.parent,Ce=C.cameras;ye(C,we);for(let Ke=0;Ke<Ce.length;Ke++)ye(Ce[Ke],we);Ce.length===2?Y(C,k,z):C.projectionMatrix.copy(k.projectionMatrix),I(Q,C,we)};function I(Q,me,xe){xe===null?Q.matrix.copy(me.matrixWorld):(Q.matrix.copy(xe.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(me.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(me.projectionMatrix),Q.projectionMatrixInverse.copy(me.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=so*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return C},this.getFoveation=function(){if(!(v===null&&b===null))return d},this.setFoveation=function(Q){d=Q,v!==null&&(v.fixedFoveation=Q),b!==null&&b.fixedFoveation!==void 0&&(b.fixedFoveation=Q)},this.hasDepthSensing=function(){return S.texture!==null},this.getDepthSensingMesh=function(){return S.getMesh(C)};let re=null;function Se(Q,me){if(m=me.getViewerPose(h||u),E=me,m!==null){const xe=m.views;b!==null&&(e.setRenderTargetFramebuffer(T,b.framebuffer),e.setRenderTarget(T));let we=!1;xe.length!==C.cameras.length&&(C.cameras.length=0,we=!0);for(let Oe=0;Oe<xe.length;Oe++){const xt=xe[Oe];let Dt=null;if(b!==null)Dt=b.getViewport(xt);else{const V=g.getViewSubImage(v,xt);Dt=V.viewport,Oe===0&&(e.setRenderTargetTextures(T,V.colorTexture,v.ignoreDepthValues?void 0:V.depthStencilTexture),e.setRenderTarget(T))}let it=R[Oe];it===void 0&&(it=new Xn,it.layers.enable(Oe),it.viewport=new Ot,R[Oe]=it),it.matrix.fromArray(xt.transform.matrix),it.matrix.decompose(it.position,it.quaternion,it.scale),it.projectionMatrix.fromArray(xt.projectionMatrix),it.projectionMatrixInverse.copy(it.projectionMatrix).invert(),it.viewport.set(Dt.x,Dt.y,Dt.width,Dt.height),Oe===0&&(C.matrix.copy(it.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale)),we===!0&&C.cameras.push(it)}const Ce=s.enabledFeatures;if(Ce&&Ce.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&g){const Oe=g.getDepthInformation(xe[0]);Oe&&Oe.isValid&&Oe.texture&&S.init(e,Oe,s.renderState)}}for(let xe=0;xe<N.length;xe++){const we=A[xe],Ce=N[xe];we!==null&&Ce!==void 0&&Ce.update(we,me,h||u)}re&&re(Q,me),me.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:me}),E=null}const Ne=new Vb;Ne.setAnimationLoop(Se),this.setAnimationLoop=function(Q){re=Q},this.dispose=function(){}}}const Hr=new Ki,CD=new ht;function DD(r,e){function t(x,y){x.matrixAutoUpdate===!0&&x.updateMatrix(),y.value.copy(x.matrix)}function i(x,y){y.color.getRGB(x.fogColor.value,Db(r)),y.isFog?(x.fogNear.value=y.near,x.fogFar.value=y.far):y.isFogExp2&&(x.fogDensity.value=y.density)}function s(x,y,T,N,A){y.isMeshBasicMaterial||y.isMeshLambertMaterial?l(x,y):y.isMeshToonMaterial?(l(x,y),g(x,y)):y.isMeshPhongMaterial?(l(x,y),m(x,y)):y.isMeshStandardMaterial?(l(x,y),v(x,y),y.isMeshPhysicalMaterial&&b(x,y,A)):y.isMeshMatcapMaterial?(l(x,y),E(x,y)):y.isMeshDepthMaterial?l(x,y):y.isMeshDistanceMaterial?(l(x,y),S(x,y)):y.isMeshNormalMaterial?l(x,y):y.isLineBasicMaterial?(u(x,y),y.isLineDashedMaterial&&f(x,y)):y.isPointsMaterial?d(x,y,T,N):y.isSpriteMaterial?h(x,y):y.isShadowMaterial?(x.color.value.copy(y.color),x.opacity.value=y.opacity):y.isShaderMaterial&&(y.uniformsNeedUpdate=!1)}function l(x,y){x.opacity.value=y.opacity,y.color&&x.diffuse.value.copy(y.color),y.emissive&&x.emissive.value.copy(y.emissive).multiplyScalar(y.emissiveIntensity),y.map&&(x.map.value=y.map,t(y.map,x.mapTransform)),y.alphaMap&&(x.alphaMap.value=y.alphaMap,t(y.alphaMap,x.alphaMapTransform)),y.bumpMap&&(x.bumpMap.value=y.bumpMap,t(y.bumpMap,x.bumpMapTransform),x.bumpScale.value=y.bumpScale,y.side===ei&&(x.bumpScale.value*=-1)),y.normalMap&&(x.normalMap.value=y.normalMap,t(y.normalMap,x.normalMapTransform),x.normalScale.value.copy(y.normalScale),y.side===ei&&x.normalScale.value.negate()),y.displacementMap&&(x.displacementMap.value=y.displacementMap,t(y.displacementMap,x.displacementMapTransform),x.displacementScale.value=y.displacementScale,x.displacementBias.value=y.displacementBias),y.emissiveMap&&(x.emissiveMap.value=y.emissiveMap,t(y.emissiveMap,x.emissiveMapTransform)),y.specularMap&&(x.specularMap.value=y.specularMap,t(y.specularMap,x.specularMapTransform)),y.alphaTest>0&&(x.alphaTest.value=y.alphaTest);const T=e.get(y),N=T.envMap,A=T.envMapRotation;N&&(x.envMap.value=N,Hr.copy(A),Hr.x*=-1,Hr.y*=-1,Hr.z*=-1,N.isCubeTexture&&N.isRenderTargetTexture===!1&&(Hr.y*=-1,Hr.z*=-1),x.envMapRotation.value.setFromMatrix4(CD.makeRotationFromEuler(Hr)),x.flipEnvMap.value=N.isCubeTexture&&N.isRenderTargetTexture===!1?-1:1,x.reflectivity.value=y.reflectivity,x.ior.value=y.ior,x.refractionRatio.value=y.refractionRatio),y.lightMap&&(x.lightMap.value=y.lightMap,x.lightMapIntensity.value=y.lightMapIntensity,t(y.lightMap,x.lightMapTransform)),y.aoMap&&(x.aoMap.value=y.aoMap,x.aoMapIntensity.value=y.aoMapIntensity,t(y.aoMap,x.aoMapTransform))}function u(x,y){x.diffuse.value.copy(y.color),x.opacity.value=y.opacity,y.map&&(x.map.value=y.map,t(y.map,x.mapTransform))}function f(x,y){x.dashSize.value=y.dashSize,x.totalSize.value=y.dashSize+y.gapSize,x.scale.value=y.scale}function d(x,y,T,N){x.diffuse.value.copy(y.color),x.opacity.value=y.opacity,x.size.value=y.size*T,x.scale.value=N*.5,y.map&&(x.map.value=y.map,t(y.map,x.uvTransform)),y.alphaMap&&(x.alphaMap.value=y.alphaMap,t(y.alphaMap,x.alphaMapTransform)),y.alphaTest>0&&(x.alphaTest.value=y.alphaTest)}function h(x,y){x.diffuse.value.copy(y.color),x.opacity.value=y.opacity,x.rotation.value=y.rotation,y.map&&(x.map.value=y.map,t(y.map,x.mapTransform)),y.alphaMap&&(x.alphaMap.value=y.alphaMap,t(y.alphaMap,x.alphaMapTransform)),y.alphaTest>0&&(x.alphaTest.value=y.alphaTest)}function m(x,y){x.specular.value.copy(y.specular),x.shininess.value=Math.max(y.shininess,1e-4)}function g(x,y){y.gradientMap&&(x.gradientMap.value=y.gradientMap)}function v(x,y){x.metalness.value=y.metalness,y.metalnessMap&&(x.metalnessMap.value=y.metalnessMap,t(y.metalnessMap,x.metalnessMapTransform)),x.roughness.value=y.roughness,y.roughnessMap&&(x.roughnessMap.value=y.roughnessMap,t(y.roughnessMap,x.roughnessMapTransform)),y.envMap&&(x.envMapIntensity.value=y.envMapIntensity)}function b(x,y,T){x.ior.value=y.ior,y.sheen>0&&(x.sheenColor.value.copy(y.sheenColor).multiplyScalar(y.sheen),x.sheenRoughness.value=y.sheenRoughness,y.sheenColorMap&&(x.sheenColorMap.value=y.sheenColorMap,t(y.sheenColorMap,x.sheenColorMapTransform)),y.sheenRoughnessMap&&(x.sheenRoughnessMap.value=y.sheenRoughnessMap,t(y.sheenRoughnessMap,x.sheenRoughnessMapTransform))),y.clearcoat>0&&(x.clearcoat.value=y.clearcoat,x.clearcoatRoughness.value=y.clearcoatRoughness,y.clearcoatMap&&(x.clearcoatMap.value=y.clearcoatMap,t(y.clearcoatMap,x.clearcoatMapTransform)),y.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=y.clearcoatRoughnessMap,t(y.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),y.clearcoatNormalMap&&(x.clearcoatNormalMap.value=y.clearcoatNormalMap,t(y.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(y.clearcoatNormalScale),y.side===ei&&x.clearcoatNormalScale.value.negate())),y.dispersion>0&&(x.dispersion.value=y.dispersion),y.iridescence>0&&(x.iridescence.value=y.iridescence,x.iridescenceIOR.value=y.iridescenceIOR,x.iridescenceThicknessMinimum.value=y.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=y.iridescenceThicknessRange[1],y.iridescenceMap&&(x.iridescenceMap.value=y.iridescenceMap,t(y.iridescenceMap,x.iridescenceMapTransform)),y.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=y.iridescenceThicknessMap,t(y.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),y.transmission>0&&(x.transmission.value=y.transmission,x.transmissionSamplerMap.value=T.texture,x.transmissionSamplerSize.value.set(T.width,T.height),y.transmissionMap&&(x.transmissionMap.value=y.transmissionMap,t(y.transmissionMap,x.transmissionMapTransform)),x.thickness.value=y.thickness,y.thicknessMap&&(x.thicknessMap.value=y.thicknessMap,t(y.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=y.attenuationDistance,x.attenuationColor.value.copy(y.attenuationColor)),y.anisotropy>0&&(x.anisotropyVector.value.set(y.anisotropy*Math.cos(y.anisotropyRotation),y.anisotropy*Math.sin(y.anisotropyRotation)),y.anisotropyMap&&(x.anisotropyMap.value=y.anisotropyMap,t(y.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=y.specularIntensity,x.specularColor.value.copy(y.specularColor),y.specularColorMap&&(x.specularColorMap.value=y.specularColorMap,t(y.specularColorMap,x.specularColorMapTransform)),y.specularIntensityMap&&(x.specularIntensityMap.value=y.specularIntensityMap,t(y.specularIntensityMap,x.specularIntensityMapTransform))}function E(x,y){y.matcap&&(x.matcap.value=y.matcap)}function S(x,y){const T=e.get(y).light;x.referencePosition.value.setFromMatrixPosition(T.matrixWorld),x.nearDistance.value=T.shadow.camera.near,x.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function ND(r,e,t,i){let s={},l={},u=[];const f=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function d(T,N){const A=N.program;i.uniformBlockBinding(T,A)}function h(T,N){let A=s[T.id];A===void 0&&(E(T),A=m(T),s[T.id]=A,T.addEventListener("dispose",x));const P=N.program;i.updateUBOMapping(T,P);const F=e.render.frame;l[T.id]!==F&&(v(T),l[T.id]=F)}function m(T){const N=g();T.__bindingPointIndex=N;const A=r.createBuffer(),P=T.__size,F=T.usage;return r.bindBuffer(r.UNIFORM_BUFFER,A),r.bufferData(r.UNIFORM_BUFFER,P,F),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,N,A),A}function g(){for(let T=0;T<f;T++)if(u.indexOf(T)===-1)return u.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function v(T){const N=s[T.id],A=T.uniforms,P=T.__cache;r.bindBuffer(r.UNIFORM_BUFFER,N);for(let F=0,k=A.length;F<k;F++){const z=Array.isArray(A[F])?A[F]:[A[F]];for(let R=0,C=z.length;R<C;R++){const H=z[R];if(b(H,F,R,P)===!0){const J=H.__offset,K=Array.isArray(H.value)?H.value:[H.value];let ce=0;for(let de=0;de<K.length;de++){const W=K[de],le=S(W);typeof W=="number"||typeof W=="boolean"?(H.__data[0]=W,r.bufferSubData(r.UNIFORM_BUFFER,J+ce,H.__data)):W.isMatrix3?(H.__data[0]=W.elements[0],H.__data[1]=W.elements[1],H.__data[2]=W.elements[2],H.__data[3]=0,H.__data[4]=W.elements[3],H.__data[5]=W.elements[4],H.__data[6]=W.elements[5],H.__data[7]=0,H.__data[8]=W.elements[6],H.__data[9]=W.elements[7],H.__data[10]=W.elements[8],H.__data[11]=0):(W.toArray(H.__data,ce),ce+=le.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,J,H.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function b(T,N,A,P){const F=T.value,k=N+"_"+A;if(P[k]===void 0)return typeof F=="number"||typeof F=="boolean"?P[k]=F:P[k]=F.clone(),!0;{const z=P[k];if(typeof F=="number"||typeof F=="boolean"){if(z!==F)return P[k]=F,!0}else if(z.equals(F)===!1)return z.copy(F),!0}return!1}function E(T){const N=T.uniforms;let A=0;const P=16;for(let k=0,z=N.length;k<z;k++){const R=Array.isArray(N[k])?N[k]:[N[k]];for(let C=0,H=R.length;C<H;C++){const J=R[C],K=Array.isArray(J.value)?J.value:[J.value];for(let ce=0,de=K.length;ce<de;ce++){const W=K[ce],le=S(W),Y=A%P,ye=Y%le.boundary,I=Y+ye;A+=ye,I!==0&&P-I<le.storage&&(A+=P-I),J.__data=new Float32Array(le.storage/Float32Array.BYTES_PER_ELEMENT),J.__offset=A,A+=le.storage}}}const F=A%P;return F>0&&(A+=P-F),T.__size=A,T.__cache={},this}function S(T){const N={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(N.boundary=4,N.storage=4):T.isVector2?(N.boundary=8,N.storage=8):T.isVector3||T.isColor?(N.boundary=16,N.storage=12):T.isVector4?(N.boundary=16,N.storage=16):T.isMatrix3?(N.boundary=48,N.storage=48):T.isMatrix4?(N.boundary=64,N.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),N}function x(T){const N=T.target;N.removeEventListener("dispose",x);const A=u.indexOf(N.__bindingPointIndex);u.splice(A,1),r.deleteBuffer(s[N.id]),delete s[N.id],delete l[N.id]}function y(){for(const T in s)r.deleteBuffer(s[T]);u=[],s={},l={}}return{bind:d,update:h,dispose:y}}class LD{constructor(e={}){const{canvas:t=DT(),context:i=null,depth:s=!0,stencil:l=!1,alpha:u=!1,antialias:f=!1,premultipliedAlpha:d=!0,preserveDrawingBuffer:h=!1,powerPreference:m="default",failIfMajorPerformanceCaveat:g=!1,reverseDepthBuffer:v=!1}=e;this.isWebGLRenderer=!0;let b;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");b=i.getContextAttributes().alpha}else b=u;const E=new Uint32Array(4),S=new Int32Array(4);let x=null,y=null;const T=[],N=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Dn,this.toneMapping=dr,this.toneMappingExposure=1;const A=this;let P=!1,F=0,k=0,z=null,R=-1,C=null;const H=new Ot,J=new Ot;let K=null;const ce=new lt(0);let de=0,W=t.width,le=t.height,Y=1,ye=null,I=null;const re=new Ot(0,0,W,le),Se=new Ot(0,0,W,le);let Ne=!1;const Q=new um;let me=!1,xe=!1;this.transmissionResolutionScale=1;const we=new ht,Ce=new ht,Ke=new X,Oe=new Ot,xt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Dt=!1;function it(){return z===null?Y:1}let V=i;function on(U,$){return t.getContext(U,$)}try{const U={alpha:!0,depth:s,stencil:l,antialias:f,premultipliedAlpha:d,preserveDrawingBuffer:h,powerPreference:m,failIfMajorPerformanceCaveat:g};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${$p}`),t.addEventListener("webglcontextlost",ve,!1),t.addEventListener("webglcontextrestored",Pe,!1),t.addEventListener("webglcontextcreationerror",Ie,!1),V===null){const $="webgl2";if(V=on($,U),V===null)throw on($)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(U){throw console.error("THREE.WebGLRenderer: "+U.message),U}let ct,Ae,Re,tt,De,O,D,ne,fe,be,ge,qe,Ue,Ve,Et,Te,Ge,et,Ye,We,ft,Qe,Ht,Z;function Be(){ct=new V2(V),ct.init(),Qe=new SD(V,ct),Ae=new O2(V,ct,e,Qe),Re=new ED(V,ct),Ae.reverseDepthBuffer&&v&&Re.buffers.depth.setReversed(!0),tt=new X2(V),De=new cD,O=new MD(V,ct,Re,De,Ae,Qe,tt),D=new F2(A),ne=new H2(A),fe=new $1(V),Ht=new U2(V,fe),be=new G2(V,fe,tt,Ht),ge=new Y2(V,be,fe,tt),Ye=new q2(V,Ae,O),Te=new I2(De),qe=new lD(A,D,ne,ct,Ae,Ht,Te),Ue=new DD(A,De),Ve=new fD,Et=new _D(ct),et=new L2(A,D,ne,Re,ge,b,d),Ge=new bD(A,ge,Ae),Z=new ND(V,tt,Ae,Re),We=new P2(V,ct,tt),ft=new W2(V,ct,tt),tt.programs=qe.programs,A.capabilities=Ae,A.extensions=ct,A.properties=De,A.renderLists=Ve,A.shadowMap=Ge,A.state=Re,A.info=tt}Be();const ue=new RD(A,V);this.xr=ue,this.getContext=function(){return V},this.getContextAttributes=function(){return V.getContextAttributes()},this.forceContextLoss=function(){const U=ct.get("WEBGL_lose_context");U&&U.loseContext()},this.forceContextRestore=function(){const U=ct.get("WEBGL_lose_context");U&&U.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(U){U!==void 0&&(Y=U,this.setSize(W,le,!1))},this.getSize=function(U){return U.set(W,le)},this.setSize=function(U,$,se=!0){if(ue.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=U,le=$,t.width=Math.floor(U*Y),t.height=Math.floor($*Y),se===!0&&(t.style.width=U+"px",t.style.height=$+"px"),this.setViewport(0,0,U,$)},this.getDrawingBufferSize=function(U){return U.set(W*Y,le*Y).floor()},this.setDrawingBufferSize=function(U,$,se){W=U,le=$,Y=se,t.width=Math.floor(U*se),t.height=Math.floor($*se),this.setViewport(0,0,U,$)},this.getCurrentViewport=function(U){return U.copy(H)},this.getViewport=function(U){return U.copy(re)},this.setViewport=function(U,$,se,ie){U.isVector4?re.set(U.x,U.y,U.z,U.w):re.set(U,$,se,ie),Re.viewport(H.copy(re).multiplyScalar(Y).round())},this.getScissor=function(U){return U.copy(Se)},this.setScissor=function(U,$,se,ie){U.isVector4?Se.set(U.x,U.y,U.z,U.w):Se.set(U,$,se,ie),Re.scissor(J.copy(Se).multiplyScalar(Y).round())},this.getScissorTest=function(){return Ne},this.setScissorTest=function(U){Re.setScissorTest(Ne=U)},this.setOpaqueSort=function(U){ye=U},this.setTransparentSort=function(U){I=U},this.getClearColor=function(U){return U.copy(et.getClearColor())},this.setClearColor=function(){et.setClearColor(...arguments)},this.getClearAlpha=function(){return et.getClearAlpha()},this.setClearAlpha=function(){et.setClearAlpha(...arguments)},this.clear=function(U=!0,$=!0,se=!0){let ie=0;if(U){let ee=!1;if(z!==null){const Me=z.texture.format;ee=Me===am||Me===im||Me===nm}if(ee){const Me=z.texture.type,Le=Me===La||Me===Qr||Me===Ll||Me===ao||Me===Jp||Me===em,ke=et.getClearColor(),ze=et.getClearAlpha(),rt=ke.r,st=ke.g,$e=ke.b;Le?(E[0]=rt,E[1]=st,E[2]=$e,E[3]=ze,V.clearBufferuiv(V.COLOR,0,E)):(S[0]=rt,S[1]=st,S[2]=$e,S[3]=ze,V.clearBufferiv(V.COLOR,0,S))}else ie|=V.COLOR_BUFFER_BIT}$&&(ie|=V.DEPTH_BUFFER_BIT),se&&(ie|=V.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V.clear(ie)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ve,!1),t.removeEventListener("webglcontextrestored",Pe,!1),t.removeEventListener("webglcontextcreationerror",Ie,!1),et.dispose(),Ve.dispose(),Et.dispose(),De.dispose(),D.dispose(),ne.dispose(),ge.dispose(),Ht.dispose(),Z.dispose(),qe.dispose(),ue.dispose(),ue.removeEventListener("sessionstart",Wl),ue.removeEventListener("sessionend",bo),ki.stop()};function ve(U){U.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function Pe(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const U=tt.autoReset,$=Ge.enabled,se=Ge.autoUpdate,ie=Ge.needsUpdate,ee=Ge.type;Be(),tt.autoReset=U,Ge.enabled=$,Ge.autoUpdate=se,Ge.needsUpdate=ie,Ge.type=ee}function Ie(U){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",U.statusMessage)}function at(U){const $=U.target;$.removeEventListener("dispose",at),Zt($)}function Zt(U){dn(U),De.remove(U)}function dn(U){const $=De.get(U).programs;$!==void 0&&($.forEach(function(se){qe.releaseProgram(se)}),U.isShaderMaterial&&qe.releaseShaderCache(U))}this.renderBufferDirect=function(U,$,se,ie,ee,Me){$===null&&($=xt);const Le=ee.isMesh&&ee.matrixWorld.determinant()<0,ke=Qu(U,$,se,ie,ee);Re.setMaterial(ie,Le);let ze=se.index,rt=1;if(ie.wireframe===!0){if(ze=be.getWireframeAttribute(se),ze===void 0)return;rt=2}const st=se.drawRange,$e=se.attributes.position;let Mt=st.start*rt,St=(st.start+st.count)*rt;Me!==null&&(Mt=Math.max(Mt,Me.start*rt),St=Math.min(St,(Me.start+Me.count)*rt)),ze!==null?(Mt=Math.max(Mt,0),St=Math.min(St,ze.count)):$e!=null&&(Mt=Math.max(Mt,0),St=Math.min(St,$e.count));const Kt=St-Mt;if(Kt<0||Kt===1/0)return;Ht.setup(ee,ie,ke,se,ze);let Lt,ot=We;if(ze!==null&&(Lt=fe.get(ze),ot=ft,ot.setIndex(Lt)),ee.isMesh)ie.wireframe===!0?(Re.setLineWidth(ie.wireframeLinewidth*it()),ot.setMode(V.LINES)):ot.setMode(V.TRIANGLES);else if(ee.isLine){let Je=ie.linewidth;Je===void 0&&(Je=1),Re.setLineWidth(Je*it()),ee.isLineSegments?ot.setMode(V.LINES):ee.isLineLoop?ot.setMode(V.LINE_LOOP):ot.setMode(V.LINE_STRIP)}else ee.isPoints?ot.setMode(V.POINTS):ee.isSprite&&ot.setMode(V.TRIANGLES);if(ee.isBatchedMesh)if(ee._multiDrawInstances!==null)qr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ot.renderMultiDrawInstances(ee._multiDrawStarts,ee._multiDrawCounts,ee._multiDrawCount,ee._multiDrawInstances);else if(ct.get("WEBGL_multi_draw"))ot.renderMultiDraw(ee._multiDrawStarts,ee._multiDrawCounts,ee._multiDrawCount);else{const Je=ee._multiDrawStarts,mn=ee._multiDrawCounts,wt=ee._multiDrawCount,Kn=ze?fe.get(ze).bytesPerElement:1,wi=De.get(ie).currentProgram.getUniforms();for(let Bn=0;Bn<wt;Bn++)wi.setValue(V,"_gl_DrawID",Bn),ot.render(Je[Bn]/Kn,mn[Bn])}else if(ee.isInstancedMesh)ot.renderInstances(Mt,Kt,ee.count);else if(se.isInstancedBufferGeometry){const Je=se._maxInstanceCount!==void 0?se._maxInstanceCount:1/0,mn=Math.min(se.instanceCount,Je);ot.renderInstances(Mt,Kt,mn)}else ot.render(Mt,Kt)};function Nt(U,$,se){U.transparent===!0&&U.side===Ei&&U.forceSinglePass===!1?(U.side=ei,U.needsUpdate=!0,pn(U,$,se),U.side=Na,U.needsUpdate=!0,pn(U,$,se),U.side=Ei):pn(U,$,se)}this.compile=function(U,$,se=null){se===null&&(se=U),y=Et.get(se),y.init($),N.push(y),se.traverseVisible(function(ee){ee.isLight&&ee.layers.test($.layers)&&(y.pushLight(ee),ee.castShadow&&y.pushShadow(ee))}),U!==se&&U.traverseVisible(function(ee){ee.isLight&&ee.layers.test($.layers)&&(y.pushLight(ee),ee.castShadow&&y.pushShadow(ee))}),y.setupLights();const ie=new Set;return U.traverse(function(ee){if(!(ee.isMesh||ee.isPoints||ee.isLine||ee.isSprite))return;const Me=ee.material;if(Me)if(Array.isArray(Me))for(let Le=0;Le<Me.length;Le++){const ke=Me[Le];Nt(ke,se,ee),ie.add(ke)}else Nt(Me,se,ee),ie.add(Me)}),y=N.pop(),ie},this.compileAsync=function(U,$,se=null){const ie=this.compile(U,$,se);return new Promise(ee=>{function Me(){if(ie.forEach(function(Le){De.get(Le).currentProgram.isReady()&&ie.delete(Le)}),ie.size===0){ee(U);return}setTimeout(Me,10)}ct.get("KHR_parallel_shader_compile")!==null?Me():setTimeout(Me,10)})};let In=null;function Fn(U){In&&In(U)}function Wl(){ki.stop()}function bo(){ki.start()}const ki=new Vb;ki.setAnimationLoop(Fn),typeof self<"u"&&ki.setContext(self),this.setAnimationLoop=function(U){In=U,ue.setAnimationLoop(U),U===null?ki.stop():ki.start()},ue.addEventListener("sessionstart",Wl),ue.addEventListener("sessionend",bo),this.render=function(U,$){if($!==void 0&&$.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),$.parent===null&&$.matrixWorldAutoUpdate===!0&&$.updateMatrixWorld(),ue.enabled===!0&&ue.isPresenting===!0&&(ue.cameraAutoUpdate===!0&&ue.updateCamera($),$=ue.getCamera()),U.isScene===!0&&U.onBeforeRender(A,U,$,z),y=Et.get(U,N.length),y.init($),N.push(y),Ce.multiplyMatrices($.projectionMatrix,$.matrixWorldInverse),Q.setFromProjectionMatrix(Ce),xe=this.localClippingEnabled,me=Te.init(this.clippingPlanes,xe),x=Ve.get(U,T.length),x.init(),T.push(x),ue.enabled===!0&&ue.isPresenting===!0){const Me=A.xr.getDepthSensingMesh();Me!==null&&es(Me,$,-1/0,A.sortObjects)}es(U,$,0,A.sortObjects),x.finish(),A.sortObjects===!0&&x.sort(ye,I),Dt=ue.enabled===!1||ue.isPresenting===!1||ue.hasDepthSensing()===!1,Dt&&et.addToRenderList(x,U),this.info.render.frame++,me===!0&&Te.beginShadows();const se=y.state.shadowsArray;Ge.render(se,U,$),me===!0&&Te.endShadows(),this.info.autoReset===!0&&this.info.reset();const ie=x.opaque,ee=x.transmissive;if(y.setupLights(),$.isArrayCamera){const Me=$.cameras;if(ee.length>0)for(let Le=0,ke=Me.length;Le<ke;Le++){const ze=Me[Le];Xl(ie,ee,U,ze)}Dt&&et.render(U);for(let Le=0,ke=Me.length;Le<ke;Le++){const ze=Me[Le];xo(x,U,ze,ze.viewport)}}else ee.length>0&&Xl(ie,ee,U,$),Dt&&et.render(U),xo(x,U,$);z!==null&&k===0&&(O.updateMultisampleRenderTarget(z),O.updateRenderTargetMipmap(z)),U.isScene===!0&&U.onAfterRender(A,U,$),Ht.resetDefaultState(),R=-1,C=null,N.pop(),N.length>0?(y=N[N.length-1],me===!0&&Te.setGlobalState(A.clippingPlanes,y.state.camera)):y=null,T.pop(),T.length>0?x=T[T.length-1]:x=null};function es(U,$,se,ie){if(U.visible===!1)return;if(U.layers.test($.layers)){if(U.isGroup)se=U.renderOrder;else if(U.isLOD)U.autoUpdate===!0&&U.update($);else if(U.isLight)y.pushLight(U),U.castShadow&&y.pushShadow(U);else if(U.isSprite){if(!U.frustumCulled||Q.intersectsSprite(U)){ie&&Oe.setFromMatrixPosition(U.matrixWorld).applyMatrix4(Ce);const Le=ge.update(U),ke=U.material;ke.visible&&x.push(U,Le,ke,se,Oe.z,null)}}else if((U.isMesh||U.isLine||U.isPoints)&&(!U.frustumCulled||Q.intersectsObject(U))){const Le=ge.update(U),ke=U.material;if(ie&&(U.boundingSphere!==void 0?(U.boundingSphere===null&&U.computeBoundingSphere(),Oe.copy(U.boundingSphere.center)):(Le.boundingSphere===null&&Le.computeBoundingSphere(),Oe.copy(Le.boundingSphere.center)),Oe.applyMatrix4(U.matrixWorld).applyMatrix4(Ce)),Array.isArray(ke)){const ze=Le.groups;for(let rt=0,st=ze.length;rt<st;rt++){const $e=ze[rt],Mt=ke[$e.materialIndex];Mt&&Mt.visible&&x.push(U,Le,Mt,se,Oe.z,$e)}}else ke.visible&&x.push(U,Le,ke,se,Oe.z,null)}}const Me=U.children;for(let Le=0,ke=Me.length;Le<ke;Le++)es(Me[Le],$,se,ie)}function xo(U,$,se,ie){const ee=U.opaque,Me=U.transmissive,Le=U.transparent;y.setupLightsView(se),me===!0&&Te.setGlobalState(A.clippingPlanes,se),ie&&Re.viewport(H.copy(ie)),ee.length>0&&ti(ee,$,se),Me.length>0&&ti(Me,$,se),Le.length>0&&ti(Le,$,se),Re.buffers.depth.setTest(!0),Re.buffers.depth.setMask(!0),Re.buffers.color.setMask(!0),Re.setPolygonOffset(!1)}function Xl(U,$,se,ie){if((se.isScene===!0?se.overrideMaterial:null)!==null)return;y.state.transmissionRenderTarget[ie.id]===void 0&&(y.state.transmissionRenderTarget[ie.id]=new Jr(1,1,{generateMipmaps:!0,type:ct.has("EXT_color_buffer_half_float")||ct.has("EXT_color_buffer_float")?Hl:La,minFilter:wa,samples:4,stencilBuffer:l,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Rt.workingColorSpace}));const Me=y.state.transmissionRenderTarget[ie.id],Le=ie.viewport||H;Me.setSize(Le.z*A.transmissionResolutionScale,Le.w*A.transmissionResolutionScale);const ke=A.getRenderTarget();A.setRenderTarget(Me),A.getClearColor(ce),de=A.getClearAlpha(),de<1&&A.setClearColor(16777215,.5),A.clear(),Dt&&et.render(se);const ze=A.toneMapping;A.toneMapping=dr;const rt=ie.viewport;if(ie.viewport!==void 0&&(ie.viewport=void 0),y.setupLightsView(ie),me===!0&&Te.setGlobalState(A.clippingPlanes,ie),ti(U,se,ie),O.updateMultisampleRenderTarget(Me),O.updateRenderTargetMipmap(Me),ct.has("WEBGL_multisampled_render_to_texture")===!1){let st=!1;for(let $e=0,Mt=$.length;$e<Mt;$e++){const St=$[$e],Kt=St.object,Lt=St.geometry,ot=St.material,Je=St.group;if(ot.side===Ei&&Kt.layers.test(ie.layers)){const mn=ot.side;ot.side=ei,ot.needsUpdate=!0,hn(Kt,se,ie,Lt,ot,Je),ot.side=mn,ot.needsUpdate=!0,st=!0}}st===!0&&(O.updateMultisampleRenderTarget(Me),O.updateRenderTargetMipmap(Me))}A.setRenderTarget(ke),A.setClearColor(ce,de),rt!==void 0&&(ie.viewport=rt),A.toneMapping=ze}function ti(U,$,se){const ie=$.isScene===!0?$.overrideMaterial:null;for(let ee=0,Me=U.length;ee<Me;ee++){const Le=U[ee],ke=Le.object,ze=Le.geometry,rt=ie===null?Le.material:ie,st=Le.group;ke.layers.test(se.layers)&&hn(ke,$,se,ze,rt,st)}}function hn(U,$,se,ie,ee,Me){U.onBeforeRender(A,$,se,ie,ee,Me),U.modelViewMatrix.multiplyMatrices(se.matrixWorldInverse,U.matrixWorld),U.normalMatrix.getNormalMatrix(U.modelViewMatrix),ee.onBeforeRender(A,$,se,ie,U,Me),ee.transparent===!0&&ee.side===Ei&&ee.forceSinglePass===!1?(ee.side=ei,ee.needsUpdate=!0,A.renderBufferDirect(se,$,ie,ee,U,Me),ee.side=Na,ee.needsUpdate=!0,A.renderBufferDirect(se,$,ie,ee,U,Me),ee.side=Ei):A.renderBufferDirect(se,$,ie,ee,U,Me),U.onAfterRender(A,$,se,ie,ee,Me)}function pn(U,$,se){$.isScene!==!0&&($=xt);const ie=De.get(U),ee=y.state.lights,Me=y.state.shadowsArray,Le=ee.state.version,ke=qe.getParameters(U,ee.state,Me,$,se),ze=qe.getProgramCacheKey(ke);let rt=ie.programs;ie.environment=U.isMeshStandardMaterial?$.environment:null,ie.fog=$.fog,ie.envMap=(U.isMeshStandardMaterial?ne:D).get(U.envMap||ie.environment),ie.envMapRotation=ie.environment!==null&&U.envMap===null?$.environmentRotation:U.envMapRotation,rt===void 0&&(U.addEventListener("dispose",at),rt=new Map,ie.programs=rt);let st=rt.get(ze);if(st!==void 0){if(ie.currentProgram===st&&ie.lightsStateVersion===Le)return ts(U,ke),st}else ke.uniforms=qe.getUniforms(U),U.onBeforeCompile(ke,A),st=qe.acquireProgram(ke,ze),rt.set(ze,st),ie.uniforms=ke.uniforms;const $e=ie.uniforms;return(!U.isShaderMaterial&&!U.isRawShaderMaterial||U.clipping===!0)&&($e.clippingPlanes=Te.uniform),ts(U,ke),ie.needsLights=ql(U),ie.lightsStateVersion=Le,ie.needsLights&&($e.ambientLightColor.value=ee.state.ambient,$e.lightProbe.value=ee.state.probe,$e.directionalLights.value=ee.state.directional,$e.directionalLightShadows.value=ee.state.directionalShadow,$e.spotLights.value=ee.state.spot,$e.spotLightShadows.value=ee.state.spotShadow,$e.rectAreaLights.value=ee.state.rectArea,$e.ltc_1.value=ee.state.rectAreaLTC1,$e.ltc_2.value=ee.state.rectAreaLTC2,$e.pointLights.value=ee.state.point,$e.pointLightShadows.value=ee.state.pointShadow,$e.hemisphereLights.value=ee.state.hemi,$e.directionalShadowMap.value=ee.state.directionalShadowMap,$e.directionalShadowMatrix.value=ee.state.directionalShadowMatrix,$e.spotShadowMap.value=ee.state.spotShadowMap,$e.spotLightMatrix.value=ee.state.spotLightMatrix,$e.spotLightMap.value=ee.state.spotLightMap,$e.pointShadowMap.value=ee.state.pointShadowMap,$e.pointShadowMatrix.value=ee.state.pointShadowMatrix),ie.currentProgram=st,ie.uniformsList=null,st}function ea(U){if(U.uniformsList===null){const $=U.currentProgram.getUniforms();U.uniformsList=Ou.seqWithValue($.seq,U.uniforms)}return U.uniformsList}function ts(U,$){const se=De.get(U);se.outputColorSpace=$.outputColorSpace,se.batching=$.batching,se.batchingColor=$.batchingColor,se.instancing=$.instancing,se.instancingColor=$.instancingColor,se.instancingMorph=$.instancingMorph,se.skinning=$.skinning,se.morphTargets=$.morphTargets,se.morphNormals=$.morphNormals,se.morphColors=$.morphColors,se.morphTargetsCount=$.morphTargetsCount,se.numClippingPlanes=$.numClippingPlanes,se.numIntersection=$.numClipIntersection,se.vertexAlphas=$.vertexAlphas,se.vertexTangents=$.vertexTangents,se.toneMapping=$.toneMapping}function Qu(U,$,se,ie,ee){$.isScene!==!0&&($=xt),O.resetTextureUnits();const Me=$.fog,Le=ie.isMeshStandardMaterial?$.environment:null,ke=z===null?A.outputColorSpace:z.isXRRenderTarget===!0?z.texture.colorSpace:jn,ze=(ie.isMeshStandardMaterial?ne:D).get(ie.envMap||Le),rt=ie.vertexColors===!0&&!!se.attributes.color&&se.attributes.color.itemSize===4,st=!!se.attributes.tangent&&(!!ie.normalMap||ie.anisotropy>0),$e=!!se.morphAttributes.position,Mt=!!se.morphAttributes.normal,St=!!se.morphAttributes.color;let Kt=dr;ie.toneMapped&&(z===null||z.isXRRenderTarget===!0)&&(Kt=A.toneMapping);const Lt=se.morphAttributes.position||se.morphAttributes.normal||se.morphAttributes.color,ot=Lt!==void 0?Lt.length:0,Je=De.get(ie),mn=y.state.lights;if(me===!0&&(xe===!0||U!==C)){const tn=U===C&&ie.id===R;Te.setState(ie,U,tn)}let wt=!1;ie.version===Je.__version?(Je.needsLights&&Je.lightsStateVersion!==mn.state.version||Je.outputColorSpace!==ke||ee.isBatchedMesh&&Je.batching===!1||!ee.isBatchedMesh&&Je.batching===!0||ee.isBatchedMesh&&Je.batchingColor===!0&&ee.colorTexture===null||ee.isBatchedMesh&&Je.batchingColor===!1&&ee.colorTexture!==null||ee.isInstancedMesh&&Je.instancing===!1||!ee.isInstancedMesh&&Je.instancing===!0||ee.isSkinnedMesh&&Je.skinning===!1||!ee.isSkinnedMesh&&Je.skinning===!0||ee.isInstancedMesh&&Je.instancingColor===!0&&ee.instanceColor===null||ee.isInstancedMesh&&Je.instancingColor===!1&&ee.instanceColor!==null||ee.isInstancedMesh&&Je.instancingMorph===!0&&ee.morphTexture===null||ee.isInstancedMesh&&Je.instancingMorph===!1&&ee.morphTexture!==null||Je.envMap!==ze||ie.fog===!0&&Je.fog!==Me||Je.numClippingPlanes!==void 0&&(Je.numClippingPlanes!==Te.numPlanes||Je.numIntersection!==Te.numIntersection)||Je.vertexAlphas!==rt||Je.vertexTangents!==st||Je.morphTargets!==$e||Je.morphNormals!==Mt||Je.morphColors!==St||Je.toneMapping!==Kt||Je.morphTargetsCount!==ot)&&(wt=!0):(wt=!0,Je.__version=ie.version);let Kn=Je.currentProgram;wt===!0&&(Kn=pn(ie,$,ee));let wi=!1,Bn=!1,bn=!1;const Vt=Kn.getUniforms(),zn=Je.uniforms;if(Re.useProgram(Kn.program)&&(wi=!0,Bn=!0,bn=!0),ie.id!==R&&(R=ie.id,Bn=!0),wi||C!==U){Re.buffers.depth.getReversed()?(we.copy(U.projectionMatrix),LT(we),UT(we),Vt.setValue(V,"projectionMatrix",we)):Vt.setValue(V,"projectionMatrix",U.projectionMatrix),Vt.setValue(V,"viewMatrix",U.matrixWorldInverse);const Tn=Vt.map.cameraPosition;Tn!==void 0&&Tn.setValue(V,Ke.setFromMatrixPosition(U.matrixWorld)),Ae.logarithmicDepthBuffer&&Vt.setValue(V,"logDepthBufFC",2/(Math.log(U.far+1)/Math.LN2)),(ie.isMeshPhongMaterial||ie.isMeshToonMaterial||ie.isMeshLambertMaterial||ie.isMeshBasicMaterial||ie.isMeshStandardMaterial||ie.isShaderMaterial)&&Vt.setValue(V,"isOrthographic",U.isOrthographicCamera===!0),C!==U&&(C=U,Bn=!0,bn=!0)}if(ee.isSkinnedMesh){Vt.setOptional(V,ee,"bindMatrix"),Vt.setOptional(V,ee,"bindMatrixInverse");const tn=ee.skeleton;tn&&(tn.boneTexture===null&&tn.computeBoneTexture(),Vt.setValue(V,"boneTexture",tn.boneTexture,O))}ee.isBatchedMesh&&(Vt.setOptional(V,ee,"batchingTexture"),Vt.setValue(V,"batchingTexture",ee._matricesTexture,O),Vt.setOptional(V,ee,"batchingIdTexture"),Vt.setValue(V,"batchingIdTexture",ee._indirectTexture,O),Vt.setOptional(V,ee,"batchingColorTexture"),ee._colorsTexture!==null&&Vt.setValue(V,"batchingColorTexture",ee._colorsTexture,O));const Nn=se.morphAttributes;if((Nn.position!==void 0||Nn.normal!==void 0||Nn.color!==void 0)&&Ye.update(ee,se,Kn),(Bn||Je.receiveShadow!==ee.receiveShadow)&&(Je.receiveShadow=ee.receiveShadow,Vt.setValue(V,"receiveShadow",ee.receiveShadow)),ie.isMeshGouraudMaterial&&ie.envMap!==null&&(zn.envMap.value=ze,zn.flipEnvMap.value=ze.isCubeTexture&&ze.isRenderTargetTexture===!1?-1:1),ie.isMeshStandardMaterial&&ie.envMap===null&&$.environment!==null&&(zn.envMapIntensity.value=$.environmentIntensity),Bn&&(Vt.setValue(V,"toneMappingExposure",A.toneMappingExposure),Je.needsLights&&Ju(zn,bn),Me&&ie.fog===!0&&Ue.refreshFogUniforms(zn,Me),Ue.refreshMaterialUniforms(zn,ie,Y,le,y.state.transmissionRenderTarget[U.id]),Ou.upload(V,ea(Je),zn,O)),ie.isShaderMaterial&&ie.uniformsNeedUpdate===!0&&(Ou.upload(V,ea(Je),zn,O),ie.uniformsNeedUpdate=!1),ie.isSpriteMaterial&&Vt.setValue(V,"center",ee.center),Vt.setValue(V,"modelViewMatrix",ee.modelViewMatrix),Vt.setValue(V,"normalMatrix",ee.normalMatrix),Vt.setValue(V,"modelMatrix",ee.matrixWorld),ie.isShaderMaterial||ie.isRawShaderMaterial){const tn=ie.uniformsGroups;for(let Tn=0,ns=tn.length;Tn<ns;Tn++){const Zn=tn[Tn];Z.update(Zn,Kn),Z.bind(Zn,Kn)}}return Kn}function Ju(U,$){U.ambientLightColor.needsUpdate=$,U.lightProbe.needsUpdate=$,U.directionalLights.needsUpdate=$,U.directionalLightShadows.needsUpdate=$,U.pointLights.needsUpdate=$,U.pointLightShadows.needsUpdate=$,U.spotLights.needsUpdate=$,U.spotLightShadows.needsUpdate=$,U.rectAreaLights.needsUpdate=$,U.hemisphereLights.needsUpdate=$}function ql(U){return U.isMeshLambertMaterial||U.isMeshToonMaterial||U.isMeshPhongMaterial||U.isMeshStandardMaterial||U.isShadowMaterial||U.isShaderMaterial&&U.lights===!0}this.getActiveCubeFace=function(){return F},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return z},this.setRenderTargetTextures=function(U,$,se){De.get(U.texture).__webglTexture=$,De.get(U.depthTexture).__webglTexture=se;const ie=De.get(U);ie.__hasExternalTextures=!0,ie.__autoAllocateDepthBuffer=se===void 0,ie.__autoAllocateDepthBuffer||ct.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ie.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(U,$){const se=De.get(U);se.__webglFramebuffer=$,se.__useDefaultFramebuffer=$===void 0};const gr=V.createFramebuffer();this.setRenderTarget=function(U,$=0,se=0){z=U,F=$,k=se;let ie=!0,ee=null,Me=!1,Le=!1;if(U){const ze=De.get(U);if(ze.__useDefaultFramebuffer!==void 0)Re.bindFramebuffer(V.FRAMEBUFFER,null),ie=!1;else if(ze.__webglFramebuffer===void 0)O.setupRenderTarget(U);else if(ze.__hasExternalTextures)O.rebindTextures(U,De.get(U.texture).__webglTexture,De.get(U.depthTexture).__webglTexture);else if(U.depthBuffer){const $e=U.depthTexture;if(ze.__boundDepthTexture!==$e){if($e!==null&&De.has($e)&&(U.width!==$e.image.width||U.height!==$e.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");O.setupDepthRenderbuffer(U)}}const rt=U.texture;(rt.isData3DTexture||rt.isDataArrayTexture||rt.isCompressedArrayTexture)&&(Le=!0);const st=De.get(U).__webglFramebuffer;U.isWebGLCubeRenderTarget?(Array.isArray(st[$])?ee=st[$][se]:ee=st[$],Me=!0):U.samples>0&&O.useMultisampledRTT(U)===!1?ee=De.get(U).__webglMultisampledFramebuffer:Array.isArray(st)?ee=st[se]:ee=st,H.copy(U.viewport),J.copy(U.scissor),K=U.scissorTest}else H.copy(re).multiplyScalar(Y).floor(),J.copy(Se).multiplyScalar(Y).floor(),K=Ne;if(se!==0&&(ee=gr),Re.bindFramebuffer(V.FRAMEBUFFER,ee)&&ie&&Re.drawBuffers(U,ee),Re.viewport(H),Re.scissor(J),Re.setScissorTest(K),Me){const ze=De.get(U.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_CUBE_MAP_POSITIVE_X+$,ze.__webglTexture,se)}else if(Le){const ze=De.get(U.texture),rt=$;V.framebufferTextureLayer(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,ze.__webglTexture,se,rt)}else if(U!==null&&se!==0){const ze=De.get(U.texture);V.framebufferTexture2D(V.FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,ze.__webglTexture,se)}R=-1},this.readRenderTargetPixels=function(U,$,se,ie,ee,Me,Le){if(!(U&&U.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ke=De.get(U).__webglFramebuffer;if(U.isWebGLCubeRenderTarget&&Le!==void 0&&(ke=ke[Le]),ke){Re.bindFramebuffer(V.FRAMEBUFFER,ke);try{const ze=U.texture,rt=ze.format,st=ze.type;if(!Ae.textureFormatReadable(rt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ae.textureTypeReadable(st)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}$>=0&&$<=U.width-ie&&se>=0&&se<=U.height-ee&&V.readPixels($,se,ie,ee,Qe.convert(rt),Qe.convert(st),Me)}finally{const ze=z!==null?De.get(z).__webglFramebuffer:null;Re.bindFramebuffer(V.FRAMEBUFFER,ze)}}},this.readRenderTargetPixelsAsync=async function(U,$,se,ie,ee,Me,Le){if(!(U&&U.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ke=De.get(U).__webglFramebuffer;if(U.isWebGLCubeRenderTarget&&Le!==void 0&&(ke=ke[Le]),ke){const ze=U.texture,rt=ze.format,st=ze.type;if(!Ae.textureFormatReadable(rt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ae.textureTypeReadable(st))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if($>=0&&$<=U.width-ie&&se>=0&&se<=U.height-ee){Re.bindFramebuffer(V.FRAMEBUFFER,ke);const $e=V.createBuffer();V.bindBuffer(V.PIXEL_PACK_BUFFER,$e),V.bufferData(V.PIXEL_PACK_BUFFER,Me.byteLength,V.STREAM_READ),V.readPixels($,se,ie,ee,Qe.convert(rt),Qe.convert(st),0);const Mt=z!==null?De.get(z).__webglFramebuffer:null;Re.bindFramebuffer(V.FRAMEBUFFER,Mt);const St=V.fenceSync(V.SYNC_GPU_COMMANDS_COMPLETE,0);return V.flush(),await NT(V,St,4),V.bindBuffer(V.PIXEL_PACK_BUFFER,$e),V.getBufferSubData(V.PIXEL_PACK_BUFFER,0,Me),V.deleteBuffer($e),V.deleteSync(St),Me}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(U,$=null,se=0){U.isTexture!==!0&&(qr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),$=arguments[0]||null,U=arguments[1]);const ie=Math.pow(2,-se),ee=Math.floor(U.image.width*ie),Me=Math.floor(U.image.height*ie),Le=$!==null?$.x:0,ke=$!==null?$.y:0;O.setTexture2D(U,0),V.copyTexSubImage2D(V.TEXTURE_2D,se,0,0,Le,ke,ee,Me),Re.unbindTexture()};const Eo=V.createFramebuffer(),ta=V.createFramebuffer();this.copyTextureToTexture=function(U,$,se=null,ie=null,ee=0,Me=null){U.isTexture!==!0&&(qr("WebGLRenderer: copyTextureToTexture function signature has changed."),ie=arguments[0]||null,U=arguments[1],$=arguments[2],Me=arguments[3]||0,se=null),Me===null&&(ee!==0?(qr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Me=ee,ee=0):Me=0);let Le,ke,ze,rt,st,$e,Mt,St,Kt;const Lt=U.isCompressedTexture?U.mipmaps[Me]:U.image;if(se!==null)Le=se.max.x-se.min.x,ke=se.max.y-se.min.y,ze=se.isBox3?se.max.z-se.min.z:1,rt=se.min.x,st=se.min.y,$e=se.isBox3?se.min.z:0;else{const Nn=Math.pow(2,-ee);Le=Math.floor(Lt.width*Nn),ke=Math.floor(Lt.height*Nn),U.isDataArrayTexture?ze=Lt.depth:U.isData3DTexture?ze=Math.floor(Lt.depth*Nn):ze=1,rt=0,st=0,$e=0}ie!==null?(Mt=ie.x,St=ie.y,Kt=ie.z):(Mt=0,St=0,Kt=0);const ot=Qe.convert($.format),Je=Qe.convert($.type);let mn;$.isData3DTexture?(O.setTexture3D($,0),mn=V.TEXTURE_3D):$.isDataArrayTexture||$.isCompressedArrayTexture?(O.setTexture2DArray($,0),mn=V.TEXTURE_2D_ARRAY):(O.setTexture2D($,0),mn=V.TEXTURE_2D),V.pixelStorei(V.UNPACK_FLIP_Y_WEBGL,$.flipY),V.pixelStorei(V.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),V.pixelStorei(V.UNPACK_ALIGNMENT,$.unpackAlignment);const wt=V.getParameter(V.UNPACK_ROW_LENGTH),Kn=V.getParameter(V.UNPACK_IMAGE_HEIGHT),wi=V.getParameter(V.UNPACK_SKIP_PIXELS),Bn=V.getParameter(V.UNPACK_SKIP_ROWS),bn=V.getParameter(V.UNPACK_SKIP_IMAGES);V.pixelStorei(V.UNPACK_ROW_LENGTH,Lt.width),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,Lt.height),V.pixelStorei(V.UNPACK_SKIP_PIXELS,rt),V.pixelStorei(V.UNPACK_SKIP_ROWS,st),V.pixelStorei(V.UNPACK_SKIP_IMAGES,$e);const Vt=U.isDataArrayTexture||U.isData3DTexture,zn=$.isDataArrayTexture||$.isData3DTexture;if(U.isDepthTexture){const Nn=De.get(U),tn=De.get($),Tn=De.get(Nn.__renderTarget),ns=De.get(tn.__renderTarget);Re.bindFramebuffer(V.READ_FRAMEBUFFER,Tn.__webglFramebuffer),Re.bindFramebuffer(V.DRAW_FRAMEBUFFER,ns.__webglFramebuffer);for(let Zn=0;Zn<ze;Zn++)Vt&&(V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,De.get(U).__webglTexture,ee,$e+Zn),V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,De.get($).__webglTexture,Me,Kt+Zn)),V.blitFramebuffer(rt,st,Le,ke,Mt,St,Le,ke,V.DEPTH_BUFFER_BIT,V.NEAREST);Re.bindFramebuffer(V.READ_FRAMEBUFFER,null),Re.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else if(ee!==0||U.isRenderTargetTexture||De.has(U)){const Nn=De.get(U),tn=De.get($);Re.bindFramebuffer(V.READ_FRAMEBUFFER,Eo),Re.bindFramebuffer(V.DRAW_FRAMEBUFFER,ta);for(let Tn=0;Tn<ze;Tn++)Vt?V.framebufferTextureLayer(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,Nn.__webglTexture,ee,$e+Tn):V.framebufferTexture2D(V.READ_FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,Nn.__webglTexture,ee),zn?V.framebufferTextureLayer(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,tn.__webglTexture,Me,Kt+Tn):V.framebufferTexture2D(V.DRAW_FRAMEBUFFER,V.COLOR_ATTACHMENT0,V.TEXTURE_2D,tn.__webglTexture,Me),ee!==0?V.blitFramebuffer(rt,st,Le,ke,Mt,St,Le,ke,V.COLOR_BUFFER_BIT,V.NEAREST):zn?V.copyTexSubImage3D(mn,Me,Mt,St,Kt+Tn,rt,st,Le,ke):V.copyTexSubImage2D(mn,Me,Mt,St,rt,st,Le,ke);Re.bindFramebuffer(V.READ_FRAMEBUFFER,null),Re.bindFramebuffer(V.DRAW_FRAMEBUFFER,null)}else zn?U.isDataTexture||U.isData3DTexture?V.texSubImage3D(mn,Me,Mt,St,Kt,Le,ke,ze,ot,Je,Lt.data):$.isCompressedArrayTexture?V.compressedTexSubImage3D(mn,Me,Mt,St,Kt,Le,ke,ze,ot,Lt.data):V.texSubImage3D(mn,Me,Mt,St,Kt,Le,ke,ze,ot,Je,Lt):U.isDataTexture?V.texSubImage2D(V.TEXTURE_2D,Me,Mt,St,Le,ke,ot,Je,Lt.data):U.isCompressedTexture?V.compressedTexSubImage2D(V.TEXTURE_2D,Me,Mt,St,Lt.width,Lt.height,ot,Lt.data):V.texSubImage2D(V.TEXTURE_2D,Me,Mt,St,Le,ke,ot,Je,Lt);V.pixelStorei(V.UNPACK_ROW_LENGTH,wt),V.pixelStorei(V.UNPACK_IMAGE_HEIGHT,Kn),V.pixelStorei(V.UNPACK_SKIP_PIXELS,wi),V.pixelStorei(V.UNPACK_SKIP_ROWS,Bn),V.pixelStorei(V.UNPACK_SKIP_IMAGES,bn),Me===0&&$.generateMipmaps&&V.generateMipmap(mn),Re.unbindTexture()},this.copyTextureToTexture3D=function(U,$,se=null,ie=null,ee=0){return U.isTexture!==!0&&(qr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),se=arguments[0]||null,ie=arguments[1]||null,U=arguments[2],$=arguments[3],ee=arguments[4]||0),qr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(U,$,se,ie,ee)},this.initRenderTarget=function(U){De.get(U).__webglFramebuffer===void 0&&O.setupRenderTarget(U)},this.initTexture=function(U){U.isCubeTexture?O.setTextureCube(U,0):U.isData3DTexture?O.setTexture3D(U,0):U.isDataArrayTexture||U.isCompressedArrayTexture?O.setTexture2DArray(U,0):O.setTexture2D(U,0),Re.unbindTexture()},this.resetState=function(){F=0,k=0,z=null,Re.reset(),Ht.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ta}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Rt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Rt._getUnpackColorSpace()}}let Op=!1;var Ly,Uy;try{if(typeof window<"u"){const e=new URLSearchParams(((Ly=window.location)==null?void 0:Ly.search)??"").get("debug")==="1",t=((Uy=window.localStorage)==null?void 0:Uy.getItem("wibbly:debug"))==="1";Op=e||t}}catch{Op=!1}function kt(...r){Op&&console.log(...r)}function UD(r){const e={playerId:r.playerId,kind:r.kind,confidence:r.confidence,tCapture:r.tCapture};return r.vector&&(e.vector=r.vector.z!==void 0?{x:r.vector.x,y:r.vector.y,z:r.vector.z}:{x:r.vector.x,y:r.vector.y}),r.detail&&(e.detail=r.detail),e}function PD(r){const e={playerId:r.playerId,kind:r.kind,confidence:r.confidence,tCapture:r.tCapture};return r.vector&&(e.vector=r.vector),r.detail&&(e.detail=r.detail),e}const OD={maxMessagesPerSec:120,maxMessageChars:16384,minConfidence:0,maxFutureSkewMs:5e3,maxAgeMs:1e4,acceptedKinds:[],expectedPlayerIds:null};class ID{constructor(e={}){He(this,"limits");He(this,"recentMs",[]);He(this,"highSeq",null);this.limits={...OD,...e}}get currentLimits(){return this.limits}admit(e,t){const i=this.limits;if(typeof e!="string"||e.length>i.maxMessageChars)return{ok:!1,reason:"too_large",detail:`${(e==null?void 0:e.length)??0} chars vs limit ${i.maxMessageChars}`};let s;try{s=JSON.parse(e)}catch(f){return{ok:!1,reason:"malformed",detail:`invalid JSON: ${zD(f)}`}}const l=FD(s);if(l)return{ok:!1,reason:"malformed",detail:l};const u=s;if(u.type==="gesture"){const f=BD(u.event,t,i);if(f)return{ok:!1,reason:"invalid_gesture",detail:f};if(i.expectedPlayerIds&&!i.expectedPlayerIds.includes(u.event.playerId))return{ok:!1,reason:"unauthorized_player",detail:`"${u.event.playerId}" not in [${i.expectedPlayerIds.join(", ")}]`}}return this.highSeq!==null&&u.seq<=this.highSeq?{ok:!1,reason:"sequence_replayed",detail:`seq ${u.seq} <= ${this.highSeq}`}:(this.recentMs=this.recentMs.filter(f=>t-f<1e3),this.recentMs.length>=i.maxMessagesPerSec?{ok:!1,reason:"rate_exceeded",detail:`${this.recentMs.length+1}/s vs limit ${i.maxMessagesPerSec}`}:(this.recentMs.push(t),this.highSeq=u.seq,{ok:!0,message:u}))}reset(){this.recentMs=[],this.highSeq=null}}function FD(r){if(typeof r!="object"||r===null||Array.isArray(r))return"not an object";const e=r;return e.type!=="gesture"&&e.type!=="state"?`unknown type ${JSON.stringify(e.type)}`:typeof e.seq!="number"||!Number.isFinite(e.seq)||!Number.isInteger(e.seq)||e.seq<0?`seq must be a non-negative integer, got ${JSON.stringify(e.seq)}`:e.type==="gesture"&&(typeof e.event!="object"||e.event===null)?"gesture message missing event object":null}function BD(r,e,t){const i=r;if(!i||typeof i.playerId!="string"||i.playerId.length===0)return"missing playerId";if(typeof i.kind!="string"||i.kind.length===0)return"missing kind";if(t.acceptedKinds.length>0&&!t.acceptedKinds.includes(i.kind))return`unknown kind ${i.kind}`;if(typeof i.confidence!="number"||!Number.isFinite(i.confidence)||i.confidence<0||i.confidence>1||i.confidence<t.minConfidence)return`implausible confidence ${i.confidence}`;if(typeof i.tCapture!="number"||!Number.isFinite(i.tCapture))return"missing/invalid tCapture";if(i.tCapture>e+t.maxFutureSkewMs)return`tCapture ${i.tCapture-e}ms in the future`;if(e-i.tCapture>t.maxAgeMs)return`tCapture ${e-i.tCapture}ms stale`;if(i.vector!==void 0){const s=i.vector;if(typeof s!="object"||s===null||typeof s.x!="number"||!Number.isFinite(s.x)||typeof s.y!="number"||!Number.isFinite(s.y)||s.z!==void 0&&(typeof s.z!="number"||!Number.isFinite(s.z)))return"malformed vector"}return i.detail!==void 0&&(typeof i.detail!="object"||i.detail===null||Array.isArray(i.detail))?"detail must be a plain object":null}function zD(r){return r instanceof Error?r.message:String(r)}class kD{constructor(e){He(this,"opts");He(this,"now");He(this,"gate");He(this,"transport");He(this,"_status","idle");He(this,"_closed",!1);He(this,"outSeq",0);He(this,"_sentGestures",0);He(this,"_sentStates",0);He(this,"_received",0);He(this,"_dropped",0);this.opts=e,this.transport=e.transport,this.now=e.now??(()=>Date.now()),this.gate=new ID(e.limits??{}),this.transport.onOpen(()=>this.setStatus("connected")),this.transport.onClose(()=>{this._closed||this.setStatus("disconnected")}),this.transport.onError(t=>{var i,s;return(s=(i=this.opts).onError)==null?void 0:s.call(i,t)}),this.transport.onMessage(t=>this.handleMessage(t))}get status(){return this._status}get isConnected(){return this._status==="connected"&&this.transport.isConnected}get stats(){return{sentGestures:this._sentGestures,sentStates:this._sentStates,received:this._received,dropped:this._dropped}}async connect(){if(this._closed)throw new Error("PeerSession is closed; construct a new one");this.setStatus("connecting"),await this.transport.connect(),this.transport.isConnected&&this.setStatus("connected")}sendGesture(e){return this.sendMessage({type:"gesture",seq:this.nextSeq(),event:UD(e)},"gesture")}broadcastState(e){return this.sendMessage({type:"state",seq:this.nextSeq(),state:e},"state")}nextSeq(){return this.outSeq+=1,this.outSeq}sendMessage(e,t){var i,s;try{if(this._closed||!this.isConnected)return{sent:!1,kind:"not_connected"};const l=JSON.stringify(e);return this.transport.send(l)?(t==="gesture"?this._sentGestures+=1:this._sentStates+=1,{sent:!0,seq:e.seq}):{sent:!1,kind:"send_failed"}}catch(l){return(s=(i=this.opts).onError)==null||s.call(i,l),{sent:!1,kind:"error",error:l}}}handleMessage(e){var t,i,s,l,u,f,d,h,m,g;try{const v=this.gate.admit(e,this.now());if(!v.ok){this._dropped+=1,(i=(t=this.opts).onDrop)==null||i.call(t,{kind:"rejected",reason:v.reason,...v.detail!==void 0?{detail:v.detail}:{}},e);return}this._received+=1;const b=v.message;b.type==="gesture"?(l=(s=this.opts).onGestureEvent)==null||l.call(s,PD(b.event)):(f=(u=this.opts).onState)==null||f.call(u,b.state)}catch(v){this._dropped+=1,(h=(d=this.opts).onError)==null||h.call(d,v),(g=(m=this.opts).onDrop)==null||g.call(m,{kind:"error",error:v},e)}}attach(e){return e.onGesture(t=>{this.sendGesture(t)})}disconnect(){this.transport.disconnect(),this.setStatus("disconnected")}close(){var e,t;if(!this._closed){this._closed=!0;try{this.transport.disconnect()}catch(i){(t=(e=this.opts).onError)==null||t.call(e,i)}this.gate.reset(),this.setStatus("closed")}}setStatus(e){var t,i;this._status!==e&&(this._status=e,(i=(t=this.opts).onStatusChange)==null||i.call(t,e))}}function HD({input:r,calibration:e,players:t=[]}){const i=G.useRef(null),s=G.useRef(null),[l,u]=G.useState(!0),[f,d]=G.useState(null),[h,m]=G.useState(()=>e?e.handednessFor("player_1"):"right");G.useEffect(()=>{const b=r==null?void 0:r.videoElement,E=i.current;if(!(!b||!E))return b.style.width="100%",b.style.height="100%",b.style.objectFit="cover",b.style.display="block",b.style.transform="scaleX(-1)",E.appendChild(b),()=>{b.parentElement===E&&E.removeChild(b)}},[r]),G.useEffect(()=>r?r.onPeople(E=>{const S=s.current,x=r.videoElement;if(!S||!x)return;const y=x.videoWidth||480,T=x.videoHeight||360;(S.width!==y||S.height!==T)&&(S.width=y,S.height=T);const N=S.getContext("2d");N&&ib(N,E,{showLabels:E.length>1,highlightArm:A=>e?e.handednessFor(A):"right",trailFor:A=>{var P,F;return((F=(P=r.recognizers[0])==null?void 0:P.historyFor)==null?void 0:F.call(P,A))??[]}})}):void 0,[r,e]),G.useEffect(()=>{if(!r)return;const b=setInterval(()=>d(r.stats),1e3);return()=>clearInterval(b)},[r]);const g=()=>{const b=h==="right"?"left":"right";m(b);const E=t.length>0?t:["player_1"];for(const S of E)e==null||e.setHandedness(S,b)},v=((f==null?void 0:f.peopleLastFrame)??0)>0;return M.createElement("div",{className:`wbcam ${l?"":"is-collapsed"}`},l?M.createElement("div",{className:`wbcam__unit wb-bracket ${v?"is-live":""}`},M.createElement("div",{className:"wbcam__bar"},M.createElement("span",{className:"wbcam__id"},M.createElement("span",{className:`wbcam__rec ${v?"is-tracking":""}`}),"CAM 01"),M.createElement("button",{type:"button",className:"wbcam__collapse",onClick:()=>u(!1),"aria-label":"Collapse camera preview",title:"Collapse camera preview"},M.createElement("svg",{viewBox:"0 0 12 12","aria-hidden":"true"},M.createElement("path",{d:"M2 6 h8",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round"})))),M.createElement("div",{className:"wbcam__frame"},M.createElement("div",{ref:i,className:"wbcam__video"}),M.createElement("canvas",{ref:s,className:"wbcam__overlay"}),!v&&M.createElement("div",{className:"wbcam__searching"},M.createElement("span",{className:"wbcam__searchdot"}),"searching")),M.createElement("div",{className:"wbcam__tele"},M.createElement("span",{className:"wbcam__stat"},M.createElement("b",null,(f==null?void 0:f.peopleLastFrame)??0),M.createElement("i",null,"tracked")),M.createElement("span",{className:"wbcam__stat"},M.createElement("b",null,f?Math.round(f.targetFps):"—"),M.createElement("i",null,"fps")),M.createElement("span",{className:"wbcam__stat"},M.createElement("b",null,(f==null?void 0:f.inferenceMs)!=null?Math.round(f.inferenceMs):"—"),M.createElement("i",null,"ms")),M.createElement("button",{type:"button",className:"wbcam__hand",onClick:g,title:"Switch racket hand"},h==="right"?"R":"L",M.createElement("i",null,"hand")))):M.createElement("button",{type:"button",className:"wbcam__tab",onClick:()=>u(!0),"aria-label":"Show camera preview"},M.createElement("span",{className:`wbcam__rec ${v?"is-tracking":""}`}),"CAM 01"),M.createElement("style",null,`
                .wbcam {
                    position: fixed;
                    left: 16px;
                    bottom: 16px;
                    z-index: 100;
                    font-family: var(--sans, system-ui, sans-serif);
                }

                .wbcam__unit {
                    width: clamp(260px, 26vw, 400px);
                    border-radius: var(--r-lg, 16px);
                    overflow: hidden;
                    background: var(--bg-sunken, #080610);
                    border: 1px solid var(--border-strong, #3D3253);
                    box-shadow: 0 26px 60px -26px rgba(0,0,0,.95), 0 4px 16px rgba(0,0,0,.5);
                }

                /* ── Label bar ─────────────────────────────────────────── */
                .wbcam__bar {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: .42rem .5rem .42rem .62rem;
                    background: var(--bg-primary, #110D17);
                    border-bottom: 1px solid var(--border, #251E33);
                }
                .wbcam__id {
                    display: inline-flex; align-items: center; gap: .42rem;
                    font-family: var(--mono, monospace);
                    font-size: .6rem; font-weight: 700;
                    letter-spacing: .18em; text-transform: uppercase;
                    color: var(--text-2, #A99FB8);
                }
                .wbcam__rec {
                    width: 6px; height: 6px; border-radius: 50%; flex: none;
                    background: var(--text-4, #4B4359);
                }
                .wbcam__rec.is-tracking {
                    background: var(--accent, #FF4D9D);
                    box-shadow: 0 0 8px var(--accent, #FF4D9D);
                    animation: wbcam-pulse 2s ease-in-out infinite;
                }
                @keyframes wbcam-pulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }

                .wbcam__collapse {
                    display: grid; place-items: center;
                    width: 20px; height: 20px; padding: 0;
                    background: transparent; border: 1px solid var(--border, #251E33);
                    border-radius: 4px; color: var(--text-3, #6F6580);
                    cursor: pointer; transition: all .18s ease;
                }
                .wbcam__collapse svg { width: 11px; height: 11px; }
                .wbcam__collapse:hover {
                    color: var(--text, #F4F0F8);
                    border-color: var(--border-bright, #52456E);
                }

                /* ── The picture ───────────────────────────────────────── */
                .wbcam__frame {
                    position: relative;
                    aspect-ratio: 4 / 3;
                    width: 100%;
                    background: #000;
                    overflow: hidden;
                }
                .wbcam__video,
                .wbcam__overlay {
                    position: absolute; inset: 0; width: 100%; height: 100%;
                }
                .wbcam__overlay { transform: scaleX(-1); pointer-events: none; }

                .wbcam__searching {
                    position: absolute; left: 50%; top: 50%;
                    transform: translate(-50%, -50%);
                    display: inline-flex; align-items: center; gap: .4rem;
                    padding: .3rem .6rem; border-radius: 999px;
                    background: rgba(8,6,16,.72);
                    border: 1px solid var(--border, #251E33);
                    font-family: var(--mono, monospace);
                    font-size: .58rem; font-weight: 600;
                    letter-spacing: .18em; text-transform: uppercase;
                    color: var(--text-3, #6F6580);
                }
                .wbcam__searchdot {
                    width: 5px; height: 5px; border-radius: 50%;
                    background: var(--planned, #FFB020);
                    animation: wbcam-pulse 1.5s ease-in-out infinite;
                }

                /* ── Telemetry strip ───────────────────────────────────── */
                .wbcam__tele {
                    display: flex; align-items: stretch;
                    background: var(--bg-primary, #110D17);
                    border-top: 1px solid var(--border, #251E33);
                }
                .wbcam__stat {
                    flex: 1;
                    display: flex; flex-direction: column; align-items: center;
                    gap: .05rem; padding: .4rem .3rem;
                    border-right: 1px solid var(--border, #251E33);
                }
                .wbcam__stat b {
                    font-family: var(--mono, monospace);
                    font-size: .85rem; font-weight: 700;
                    font-variant-numeric: tabular-nums;
                    color: var(--text, #F4F0F8); line-height: 1;
                }
                .wbcam__stat i,
                .wbcam__hand i {
                    font-family: var(--mono, monospace); font-style: normal;
                    font-size: .53rem; font-weight: 600;
                    letter-spacing: .16em; text-transform: uppercase;
                    color: var(--text-4, #4B4359);
                }

                /* The one control in the strip. It IS wired — it writes straight
                   through to Calibration — so it is allowed the accent. */
                .wbcam__hand {
                    flex: 1;
                    display: flex; flex-direction: column; align-items: center;
                    gap: .05rem; padding: .4rem .3rem;
                    background: transparent; border: 0; cursor: pointer;
                    font-family: var(--mono, monospace);
                    font-size: .85rem; font-weight: 700;
                    color: var(--accent, #FF4D9D); line-height: 1;
                    transition: background .18s ease;
                }
                .wbcam__hand:hover { background: var(--accent-dim, rgba(255,77,157,.13)); }

                /* ── Collapsed tab ─────────────────────────────────────── */
                .wbcam__tab {
                    display: inline-flex; align-items: center; gap: .45rem;
                    padding: .45rem .8rem; border-radius: 999px;
                    background: rgba(8,6,16,.86);
                    border: 1px solid var(--border-strong, #3D3253);
                    -webkit-backdrop-filter: blur(10px);
                    backdrop-filter: blur(10px);
                    color: var(--text-2, #A99FB8);
                    font-family: var(--mono, monospace);
                    font-size: .6rem; font-weight: 700;
                    letter-spacing: .18em; text-transform: uppercase;
                    cursor: pointer; transition: all .18s ease;
                }
                .wbcam__tab:hover {
                    color: var(--text, #F4F0F8);
                    border-color: var(--border-bright, #52456E);
                }

                @media (prefers-reduced-motion: reduce) {
                    .wbcam__rec.is-tracking,
                    .wbcam__searchdot { animation: none; }
                }

                @media (max-width: 768px) {
                    .wbcam { left: 10px; bottom: 10px; }
                    .wbcam__unit { width: min(220px, 46vw); }
                    .wbcam__tele .wbcam__stat:nth-child(3) { display: none; }
                }
            `))}function VD(){return{forward:!1,backward:!1,left:!1,right:!1,jump:!1,crouch:!1,attack:!1,secondary_attack:!1,interact:!1,sprint:!1}}function GD(){return{x:0,y:0,delta_x:0,delta_y:0,left_button:!1,right_button:!1,middle_button:!1,scroll:0}}function Ey(r={}){return{keys:{...VD(),...r.keys??{}},mouse:{...GD(),...r.mouse??{}},sequence:r.sequence??0,timestamp_ms:r.timestamp_ms??0}}const WD=["memory","mag_alloc","mag_free","mag_init","mag_step","mag_snapshot","mag_restore","mag_view"];class _m{constructor(e,t){He(this,"config");He(this,"exports");He(this,"enc",new TextEncoder);He(this,"dec",new TextDecoder);He(this,"stepCount",0);this.exports=e,this.config=t}static async instantiate(e,t){const i=await WebAssembly.compile(e),s=WebAssembly.Module.imports(i);if(s.length>0){const d=s.map(h=>`${h.module}::${h.name}`).join(", ");throw new Error(`magnetite module declares host imports (${d}); wibbly's authority runs it with no host, so a build that needs a shim would silently mis-run rather than fail. Rebuild for wasm32-unknown-unknown, which links none.`)}const l=await WebAssembly.instantiate(i,{}),u=l.exports;for(const d of WD)if(!(d in l.exports))throw new Error(`magnetite module is missing required export \`${d}\``);const f=new _m(u,t);return f.writeInit(t),f}get tick(){return this.stepCount}write(e){const t=this.exports.mag_alloc(e.length);return new Uint8Array(this.exports.memory.buffer,t,e.length).set(e),t}writeJson(e){const t=this.enc.encode(JSON.stringify(e));return{ptr:this.write(t),len:t.length}}readPrefixed(e){const i=new DataView(this.exports.memory.buffer).getUint32(e,!0);return this.dec.decode(new Uint8Array(this.exports.memory.buffer,e+4,i))}writeInit(e){const{ptr:t,len:i}=this.writeJson(e);this.exports.mag_init(t,i)}restorePlayers(e){const t={players:e.map(i=>({id:i.id,x:i.x,y:i.y,angle:i.angle??0,hp:100,alive:!0,last_shot_tick:0,score:0})),projectiles:[],tick:0};this.restore(t)}restore(e){const{ptr:t,len:i}=this.writeJson(e);this.exports.mag_restore(t,i)}step(e){const{ptr:t,len:i}=this.writeJson(e),s=this.exports.mag_step(t,i);this.stepCount+=1;const l=this.readPrefixed(s),u=l.match(/"state_hash":\s*(\d+)/),f=u?u[1]:"0";let d=[];try{d=JSON.parse(l).rejects??[]}catch{d=[]}return{rejects:d,state_hash:f}}snapshot(){const e=this.readPrefixed(this.exports.mag_snapshot());return JSON.parse(e)}view(e){const t=this.readPrefixed(this.exports.mag_view(BigInt(e)));return JSON.parse(t)}}function XD(r={}){return{topology:"SingleRoom",max_players:4,tick_hz:60,seed:1,snapshot_every:300,...r}}const qD="magnetite/arena-authority.wasm";async function YD(r=fetch){if(Zp())throw new Error("magnetite authority must not run in demo mode — wasm is blocked by the demo CSP");const e=ob(qD),t=await r(e);if(!t.ok)throw new Error(`magnetite module fetch failed: ${t.status}`);const i=await t.arrayBuffer(),s=await _m.instantiate(i,XD({seed:1,max_players:4}));return s.restorePlayers([{id:1,x:-50,y:0,angle:0},{id:2,x:50,y:0,angle:Math.PI}]),new jD(s)}class jD{constructor(e){this.auth=e,this.lastHash="0",this.rejects=0}step(e={}){const t=this.auth.tick,i=[[1,Ey({keys:{attack:!!e.p1Swing},sequence:t,timestamp_ms:t*16})],[2,Ey({sequence:t,timestamp_ms:t*16})]],s=this.auth.step(i);return this.lastHash=s.state_hash,this.rejects+=s.rejects.length,this.telemetry()}telemetry(){return{ready:!0,tick:this.auth.tick,stateHash:this.lastHash,players:2}}}function KD(r,e,t,i=1){const s=new Yi,l=new Wn(.8,.8,.4),u=new Jn({color:13382451}),f=new Bt(l,u);f.position.y=1.2,s.add(f);const d=new Wn(.6,.6,.6),h=new Jn({color:16770773}),m=new Bt(d,h);m.position.y=1.9,s.add(m);const g=new Wn(.65,.2,.65),v=new Jn({color:16766720}),b=new Bt(g,v);b.position.y=2.3,s.add(b);const E=new Wn(.1,.1,.05),S=new Jn({color:5219583}),x=new Bt(E,S);x.position.set(-.15,1.9,.3),s.add(x);const y=new Bt(E,S);y.position.set(.15,1.9,.3),s.add(y);const T=new Wn(.3,.6,.3),N=new Jn({color:16770773}),A=new Bt(T,N);A.position.set(-.55,1.3,0),s.add(A);const P=new Bt(T,N);P.position.set(.55,1.3,0),s.add(P);const F=new Wn(.35,.8,.35),k=new Jn({color:4487116}),z=new Bt(F,k);z.position.set(-.2,.4,0),s.add(z);const R=new Bt(F,k);R.position.set(.2,.4,0),s.add(R);const C=new Wn(.6,.25,.45),H=new Jn({color:4487116}),J=new Bt(C,H);J.position.y=.75,s.add(J);const K=new Yi,ce=new Wn(.7,.7,.05),de=new Jn({color:16777215}),W=new Bt(ce,de);K.add(W);const le=new Wn(.7,.7,.05),Y=new Aa({color:65280,wireframe:!0,transparent:!0,opacity:.8}),ye=new Bt(le,Y);ye.position.copy(W.position),K.add(ye);const I=new Wn(.08,.6,.08),re=new Jn({color:9127187}),Se=new Bt(I,re);return Se.position.y=-.6,K.add(Se),t===Math.PI/2?(K.position.set(.2,0,.4),P.add(K)):(K.position.set(.2,0,-.4),P.add(K)),K.rotation.z=-Math.PI/4,K.rotation.y=t===Math.PI/2?-Math.PI/8:Math.PI/8,s.scale.set(i,i,i),s.position.set(r,0,e),s.rotation.y=t,s.userData={leftArm:A,rightArm:P,leftLeg:z,rightLeg:R,racketGroup:K,body:f,head:m,hitBox:ye},s}function ZD(r,e,t){const i=e.targetX-r.position.x,s=e.targetZ-r.position.z,l=Math.sqrt(i*i+s*s);let u=2.5;e.isLeftSide===!0&&l>1&&(u=3),e.isLeftSide===!1&&l>1&&(u=3.5,l<3&&(u=4));const f=Math.min(t,1/20),d=Math.max(1,t/f),h=u*Math.min(d,2);if(e.velocity||(e.velocity={x:0,z:0}),l>.05){const m=P=>P<.5?2*P*P:-1+(4-2*P)*P,g=Math.min(l/3,1),b=.3+m(g)*.7,E=i/l*h*b,S=s/l*h*b,x=Math.min(1,f*8);e.velocity.x+=(E-e.velocity.x)*x,e.velocity.z+=(S-e.velocity.z)*x;const y=e.velocity.x*f,T=e.velocity.z*f;r.position.x+=y,r.position.z+=T,e.legPhase+=f*8;const N=Math.sin(e.legPhase)*.4;r.userData.leftLeg.rotation.x=N,r.userData.rightLeg.rotation.x=-N;const A=Math.abs(Math.sin(e.legPhase*2))*.05;if(r.userData.head.position.y=1.9+A,!e.swinging){const P=Math.sin(e.legPhase)*.3;r.userData.leftArm.rotation.x=P,r.userData.rightArm.rotation.x=-P,r.userData.racketGroup.rotation.x=-P*.5}}else{const m=Math.max(0,1-f*12);e.velocity.x*=m,e.velocity.z*=m,r.position.x+=e.velocity.x*f,r.position.z+=e.velocity.z*f,e.swinging||(r.userData.leftLeg.rotation.x=0,r.userData.rightLeg.rotation.x=0,r.userData.head.position.y=1.9,r.userData.leftArm.rotation.x=0,r.userData.rightArm.rotation.x=0,r.userData.racketGroup.rotation.x=0)}}function $D(r,e,t,i){if(e.swinging){const s=Math.min(t,.05);e.swingTime+=s;const u=Math.min(e.swingTime/.25,1);if(i===0){const f=Math.sin(u*Math.PI)*-.8,d=Math.sin(u*Math.PI)*.4,h=Math.sin(u*Math.PI)*-1.2;r.userData.rightArm.rotation.z=f,r.userData.rightArm.rotation.y=d,r.userData.rightArm.rotation.x=h}else{const f=Math.sin(u*Math.PI)*.8,d=Math.sin(u*Math.PI)*-.4,h=Math.sin(u*Math.PI)*-1.2;r.userData.rightArm.rotation.z=f,r.userData.rightArm.rotation.y=d,r.userData.rightArm.rotation.x=h}u>=1&&(e.swinging=!1,e.swingTime=0,r.userData.rightArm.rotation.set(0,0,0))}}function QD(r,e,t,i,s){if(e.swinging||!i.ballInPlay)return;const l=r.userData.racketGroup,u=r.userData.rightArm;new X(i.ballVelocity.x,i.ballVelocity.y,i.ballVelocity.z);const f=new X;l.getWorldPosition(f);const d=1.3,h=t.position.y,m=i.ballVelocity.y,g=-9.8;let v=0;if(m!==0){const S=.5*g,x=m,y=h-d,T=x*x-4*S*y;if(T>=0){const N=(-x+Math.sqrt(T))/(2*S),A=(-x-Math.sqrt(T))/(2*S);v=Math.max(0,Math.min(N>0?N:1/0,A>0?A:1/0))}}const b=new X(t.position.x+i.ballVelocity.x*v,d,t.position.z+i.ballVelocity.z*v);if((s===0&&i.ballVelocity.x<0||s===1&&i.ballVelocity.x>0)&&v>0&&v<2){const S=new X().subVectors(b,r.position),x=Math.atan2(S.z,S.x),y=s===0?Math.PI/2+x*.3:-Math.PI/2+x*.3;if(r.rotation.y=It.lerp(r.rotation.y,y,.12),s===0){const T=Math.atan2(S.z,S.x)*.7,N=Math.atan2(S.y-1.3,Math.sqrt(S.x*S.x+S.z*S.z))*.5,A=Math.atan2(S.y-1.3,S.x)*.3;u.rotation.y=It.lerp(u.rotation.y,T,.18),u.rotation.x=It.lerp(u.rotation.x,N,.18),u.rotation.z=It.lerp(u.rotation.z,A,.12);const P=Math.atan2(S.z,S.x)*.5,F=Math.atan2(S.y-1.3,Math.sqrt(S.x*S.x+S.z*S.z))*.4;l.rotation.y=It.lerp(l.rotation.y,-Math.PI/8+P,.2),l.rotation.x=It.lerp(l.rotation.x,F,.12)}else{const T=Math.atan2(-S.z,-S.x)*.8,N=Math.atan2(S.y-1.3,Math.sqrt(S.x*S.x+S.z*S.z))*.6,A=Math.atan2(S.y-1.3,-S.x)*.4;u.rotation.y=It.lerp(u.rotation.y,T,.22),u.rotation.x=It.lerp(u.rotation.x,N,.22),u.rotation.z=It.lerp(u.rotation.z,-A,.16);const P=Math.atan2(-S.z,-S.x)*.6,F=Math.atan2(S.y-1.3,Math.sqrt(S.x*S.x+S.z*S.z))*.5,k=S.z*.15;l.rotation.y=It.lerp(l.rotation.y,Math.PI/8+P+k,.25),l.rotation.x=It.lerp(l.rotation.x,F,.16)}}else{const S=s===0?Math.PI/2:-Math.PI/2;r.rotation.y=It.lerp(r.rotation.y,S,.08),u.rotation.y=It.lerp(u.rotation.y,0,.08),u.rotation.x=It.lerp(u.rotation.x,0,.08),u.rotation.z=It.lerp(u.rotation.z,0,.08),s===0?(l.rotation.y=It.lerp(l.rotation.y,-Math.PI/8,.08),l.rotation.x=It.lerp(l.rotation.x,0,.08)):(l.rotation.y=It.lerp(l.rotation.y,Math.PI/8,.08),l.rotation.x=It.lerp(l.rotation.x,0,.08))}}function Yb(r,e,t,i){if(!t.ballInPlay)return{x:r.position.x,z:r.position.z};const s=t.ballVelocity,l=e.position,u=1.3,f=l.y,d=s.y,h=-9.8;let m=0;if(Math.abs(d)>.1||Math.abs(f-u)>.1){const x=.5*h,y=d,T=f-u,N=y*y-4*x*T;if(N>=0){const A=(-y+Math.sqrt(N))/(2*x),P=(-y-Math.sqrt(N))/(2*x),F=[A,P].filter(k=>k>0&&k<10);F.length>0&&(m=Math.min(...F))}}(m===0||m>8)&&(Math.abs(d)>.1?m=Math.abs((u-f)/d):m=1);let g=l.x+s.x*m,v=l.z+s.z*m;const b=.7,E=.3;if(i===0){if(g=g-b-E,g=Math.max(-9,Math.min(-2,g)),Math.abs(s.z)>.1){const x=s.z>0?-.3:.3;v=v+x}}else if(g=g+.9+E,g=Math.max(2,Math.min(9,g)),Math.abs(s.z)>.1){const T=s.z>0?-.5:.3;v=v+T-.9}else v=v-.9;v=Math.max(-4.5,Math.min(4.5,v));const S=Math.sqrt(Math.pow(r.position.x-l.x,2)+Math.pow(r.position.z-l.z,2));if(S<3)if(i===0){const x=l.x-.6,y=l.z,T=Math.max(.3,(3-S)/3);g=It.lerp(g,x,T),v=It.lerp(v,y,T)}else{const x=l.x+.8,y=l.z-.8,T=Math.max(.3,(3-S)/3);g=It.lerp(g,x,T),v=It.lerp(v,y,T)}return i===0?g=Math.max(-9,Math.min(-2,g)):g=Math.max(2,Math.min(9,g)),{x:g,z:v}}function JD(r,e,t=null){return t===null&&(t=!r[0].userData.hitBox.visible),r.forEach(i=>{i.userData.hitBox&&(i.userData.hitBox.visible=t)}),e&&e.userData.collisionSphere&&(e.userData.collisionSphere.visible=t),kt(`Hit boxes ${t?"shown":"hidden"}`),t}function My(r,e){if(e===iT)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),r;if(e===Dp||e===xb){let t=r.getIndex();if(t===null){const u=[],f=r.getAttribute("position");if(f!==void 0){for(let d=0;d<f.count;d++)u.push(d);r.setIndex(u),t=r.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),r}const i=t.count-2,s=[];if(e===Dp)for(let u=1;u<=i;u++)s.push(t.getX(0)),s.push(t.getX(u)),s.push(t.getX(u+1));else for(let u=0;u<i;u++)u%2===0?(s.push(t.getX(u)),s.push(t.getX(u+1)),s.push(t.getX(u+2))):(s.push(t.getX(u+2)),s.push(t.getX(u+1)),s.push(t.getX(u)));s.length/3!==i&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const l=r.clone();return l.setIndex(s),l.clearGroups(),l}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),r}class eN extends vo{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new rN(t)}),this.register(function(t){return new sN(t)}),this.register(function(t){return new mN(t)}),this.register(function(t){return new gN(t)}),this.register(function(t){return new _N(t)}),this.register(function(t){return new lN(t)}),this.register(function(t){return new cN(t)}),this.register(function(t){return new uN(t)}),this.register(function(t){return new fN(t)}),this.register(function(t){return new aN(t)}),this.register(function(t){return new dN(t)}),this.register(function(t){return new oN(t)}),this.register(function(t){return new pN(t)}),this.register(function(t){return new hN(t)}),this.register(function(t){return new nN(t)}),this.register(function(t){return new vN(t)}),this.register(function(t){return new yN(t)})}load(e,t,i,s){const l=this;let u;if(this.resourcePath!=="")u=this.resourcePath;else if(this.path!==""){const h=Dl.extractUrlBase(e);u=Dl.resolveURL(h,this.path)}else u=Dl.extractUrlBase(e);this.manager.itemStart(e);const f=function(h){s?s(h):console.error(h),l.manager.itemError(e),l.manager.itemEnd(e)},d=new kb(this.manager);d.setPath(this.path),d.setResponseType("arraybuffer"),d.setRequestHeader(this.requestHeader),d.setWithCredentials(this.withCredentials),d.load(e,function(h){try{l.parse(h,u,function(m){t(m),l.manager.itemEnd(e)},f)}catch(m){f(m)}},i,f)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,i,s){let l;const u={},f={},d=new TextDecoder;if(typeof e=="string")l=JSON.parse(e);else if(e instanceof ArrayBuffer)if(d.decode(new Uint8Array(e,0,4))===jb){try{u[bt.KHR_BINARY_GLTF]=new bN(e)}catch(g){s&&s(g);return}l=JSON.parse(u[bt.KHR_BINARY_GLTF].content)}else l=JSON.parse(d.decode(e));else l=e;if(l.asset===void 0||l.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const h=new UN(l,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});h.fileLoader.setRequestHeader(this.requestHeader);for(let m=0;m<this.pluginCallbacks.length;m++){const g=this.pluginCallbacks[m](h);g.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),f[g.name]=g,u[g.name]=!0}if(l.extensionsUsed)for(let m=0;m<l.extensionsUsed.length;++m){const g=l.extensionsUsed[m],v=l.extensionsRequired||[];switch(g){case bt.KHR_MATERIALS_UNLIT:u[g]=new iN;break;case bt.KHR_DRACO_MESH_COMPRESSION:u[g]=new xN(l,this.dracoLoader);break;case bt.KHR_TEXTURE_TRANSFORM:u[g]=new EN;break;case bt.KHR_MESH_QUANTIZATION:u[g]=new MN;break;default:v.indexOf(g)>=0&&f[g]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+g+'".')}}h.setExtensions(u),h.setPlugins(f),h.parse(i,s)}parseAsync(e,t){const i=this;return new Promise(function(s,l){i.parse(e,t,s,l)})}}function tN(){let r={};return{get:function(e){return r[e]},add:function(e,t){r[e]=t},remove:function(e){delete r[e]},removeAll:function(){r={}}}}const bt={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class nN{constructor(e){this.parser=e,this.name=bt.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let i=0,s=t.length;i<s;i++){const l=t[i];l.extensions&&l.extensions[this.name]&&l.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,l.extensions[this.name].light)}}_loadLight(e){const t=this.parser,i="light:"+e;let s=t.cache.get(i);if(s)return s;const l=t.json,d=((l.extensions&&l.extensions[this.name]||{}).lights||[])[e];let h;const m=new lt(16777215);d.color!==void 0&&m.setRGB(d.color[0],d.color[1],d.color[2],jn);const g=d.range!==void 0?d.range:0;switch(d.type){case"directional":h=new Hb(m),h.target.position.set(0,0,-1),h.add(h.target);break;case"point":h=new O1(m),h.distance=g;break;case"spot":h=new U1(m),h.distance=g,d.spot=d.spot||{},d.spot.innerConeAngle=d.spot.innerConeAngle!==void 0?d.spot.innerConeAngle:0,d.spot.outerConeAngle=d.spot.outerConeAngle!==void 0?d.spot.outerConeAngle:Math.PI/4,h.angle=d.spot.outerConeAngle,h.penumbra=1-d.spot.innerConeAngle/d.spot.outerConeAngle,h.target.position.set(0,0,-1),h.add(h.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+d.type)}return h.position.set(0,0,0),Sa(h,d),d.intensity!==void 0&&(h.intensity=d.intensity),h.name=t.createUniqueName(d.name||"light_"+e),s=Promise.resolve(h),t.cache.add(i,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,i=this.parser,l=i.json.nodes[e],f=(l.extensions&&l.extensions[this.name]||{}).light;return f===void 0?null:this._loadLight(f).then(function(d){return i._getNodeRef(t.cache,f,d)})}}class iN{constructor(){this.name=bt.KHR_MATERIALS_UNLIT}getMaterialType(){return Aa}extendParams(e,t,i){const s=[];e.color=new lt(1,1,1),e.opacity=1;const l=t.pbrMetallicRoughness;if(l){if(Array.isArray(l.baseColorFactor)){const u=l.baseColorFactor;e.color.setRGB(u[0],u[1],u[2],jn),e.opacity=u[3]}l.baseColorTexture!==void 0&&s.push(i.assignTexture(e,"map",l.baseColorTexture,Dn))}return Promise.all(s)}}class aN{constructor(e){this.parser=e,this.name=bt.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const l=s.extensions[this.name].emissiveStrength;return l!==void 0&&(t.emissiveIntensity=l),Promise.resolve()}}class rN{constructor(e){this.parser=e,this.name=bt.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Qi}extendMaterialParams(e,t){const i=this.parser,s=i.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const l=[],u=s.extensions[this.name];if(u.clearcoatFactor!==void 0&&(t.clearcoat=u.clearcoatFactor),u.clearcoatTexture!==void 0&&l.push(i.assignTexture(t,"clearcoatMap",u.clearcoatTexture)),u.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=u.clearcoatRoughnessFactor),u.clearcoatRoughnessTexture!==void 0&&l.push(i.assignTexture(t,"clearcoatRoughnessMap",u.clearcoatRoughnessTexture)),u.clearcoatNormalTexture!==void 0&&(l.push(i.assignTexture(t,"clearcoatNormalMap",u.clearcoatNormalTexture)),u.clearcoatNormalTexture.scale!==void 0)){const f=u.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Ct(f,f)}return Promise.all(l)}}class sN{constructor(e){this.parser=e,this.name=bt.KHR_MATERIALS_DISPERSION}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Qi}extendMaterialParams(e,t){const s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const l=s.extensions[this.name];return t.dispersion=l.dispersion!==void 0?l.dispersion:0,Promise.resolve()}}class oN{constructor(e){this.parser=e,this.name=bt.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Qi}extendMaterialParams(e,t){const i=this.parser,s=i.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const l=[],u=s.extensions[this.name];return u.iridescenceFactor!==void 0&&(t.iridescence=u.iridescenceFactor),u.iridescenceTexture!==void 0&&l.push(i.assignTexture(t,"iridescenceMap",u.iridescenceTexture)),u.iridescenceIor!==void 0&&(t.iridescenceIOR=u.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),u.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=u.iridescenceThicknessMinimum),u.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=u.iridescenceThicknessMaximum),u.iridescenceThicknessTexture!==void 0&&l.push(i.assignTexture(t,"iridescenceThicknessMap",u.iridescenceThicknessTexture)),Promise.all(l)}}class lN{constructor(e){this.parser=e,this.name=bt.KHR_MATERIALS_SHEEN}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Qi}extendMaterialParams(e,t){const i=this.parser,s=i.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const l=[];t.sheenColor=new lt(0,0,0),t.sheenRoughness=0,t.sheen=1;const u=s.extensions[this.name];if(u.sheenColorFactor!==void 0){const f=u.sheenColorFactor;t.sheenColor.setRGB(f[0],f[1],f[2],jn)}return u.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=u.sheenRoughnessFactor),u.sheenColorTexture!==void 0&&l.push(i.assignTexture(t,"sheenColorMap",u.sheenColorTexture,Dn)),u.sheenRoughnessTexture!==void 0&&l.push(i.assignTexture(t,"sheenRoughnessMap",u.sheenRoughnessTexture)),Promise.all(l)}}class cN{constructor(e){this.parser=e,this.name=bt.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Qi}extendMaterialParams(e,t){const i=this.parser,s=i.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const l=[],u=s.extensions[this.name];return u.transmissionFactor!==void 0&&(t.transmission=u.transmissionFactor),u.transmissionTexture!==void 0&&l.push(i.assignTexture(t,"transmissionMap",u.transmissionTexture)),Promise.all(l)}}class uN{constructor(e){this.parser=e,this.name=bt.KHR_MATERIALS_VOLUME}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Qi}extendMaterialParams(e,t){const i=this.parser,s=i.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const l=[],u=s.extensions[this.name];t.thickness=u.thicknessFactor!==void 0?u.thicknessFactor:0,u.thicknessTexture!==void 0&&l.push(i.assignTexture(t,"thicknessMap",u.thicknessTexture)),t.attenuationDistance=u.attenuationDistance||1/0;const f=u.attenuationColor||[1,1,1];return t.attenuationColor=new lt().setRGB(f[0],f[1],f[2],jn),Promise.all(l)}}class fN{constructor(e){this.parser=e,this.name=bt.KHR_MATERIALS_IOR}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Qi}extendMaterialParams(e,t){const s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const l=s.extensions[this.name];return t.ior=l.ior!==void 0?l.ior:1.5,Promise.resolve()}}class dN{constructor(e){this.parser=e,this.name=bt.KHR_MATERIALS_SPECULAR}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Qi}extendMaterialParams(e,t){const i=this.parser,s=i.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const l=[],u=s.extensions[this.name];t.specularIntensity=u.specularFactor!==void 0?u.specularFactor:1,u.specularTexture!==void 0&&l.push(i.assignTexture(t,"specularIntensityMap",u.specularTexture));const f=u.specularColorFactor||[1,1,1];return t.specularColor=new lt().setRGB(f[0],f[1],f[2],jn),u.specularColorTexture!==void 0&&l.push(i.assignTexture(t,"specularColorMap",u.specularColorTexture,Dn)),Promise.all(l)}}class hN{constructor(e){this.parser=e,this.name=bt.EXT_MATERIALS_BUMP}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Qi}extendMaterialParams(e,t){const i=this.parser,s=i.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const l=[],u=s.extensions[this.name];return t.bumpScale=u.bumpFactor!==void 0?u.bumpFactor:1,u.bumpTexture!==void 0&&l.push(i.assignTexture(t,"bumpMap",u.bumpTexture)),Promise.all(l)}}class pN{constructor(e){this.parser=e,this.name=bt.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const i=this.parser.json.materials[e];return!i.extensions||!i.extensions[this.name]?null:Qi}extendMaterialParams(e,t){const i=this.parser,s=i.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();const l=[],u=s.extensions[this.name];return u.anisotropyStrength!==void 0&&(t.anisotropy=u.anisotropyStrength),u.anisotropyRotation!==void 0&&(t.anisotropyRotation=u.anisotropyRotation),u.anisotropyTexture!==void 0&&l.push(i.assignTexture(t,"anisotropyMap",u.anisotropyTexture)),Promise.all(l)}}class mN{constructor(e){this.parser=e,this.name=bt.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,i=t.json,s=i.textures[e];if(!s.extensions||!s.extensions[this.name])return null;const l=s.extensions[this.name],u=t.options.ktx2Loader;if(!u){if(i.extensionsRequired&&i.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,l.source,u)}}class gN{constructor(e){this.parser=e,this.name=bt.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){const t=this.name,i=this.parser,s=i.json,l=s.textures[e];if(!l.extensions||!l.extensions[t])return null;const u=l.extensions[t],f=s.images[u.source];let d=i.textureLoader;if(f.uri){const h=i.options.manager.getHandler(f.uri);h!==null&&(d=h)}return this.detectSupport().then(function(h){if(h)return i.loadTextureImage(e,u.source,d);if(s.extensionsRequired&&s.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return i.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class _N{constructor(e){this.parser=e,this.name=bt.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){const t=this.name,i=this.parser,s=i.json,l=s.textures[e];if(!l.extensions||!l.extensions[t])return null;const u=l.extensions[t],f=s.images[u.source];let d=i.textureLoader;if(f.uri){const h=i.options.manager.getHandler(f.uri);h!==null&&(d=h)}return this.detectSupport().then(function(h){if(h)return i.loadTextureImage(e,u.source,d);if(s.extensionsRequired&&s.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return i.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class vN{constructor(e){this.name=bt.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,i=t.bufferViews[e];if(i.extensions&&i.extensions[this.name]){const s=i.extensions[this.name],l=this.parser.getDependency("buffer",s.buffer),u=this.parser.options.meshoptDecoder;if(!u||!u.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return l.then(function(f){const d=s.byteOffset||0,h=s.byteLength||0,m=s.count,g=s.byteStride,v=new Uint8Array(f,d,h);return u.decodeGltfBufferAsync?u.decodeGltfBufferAsync(m,g,v,s.mode,s.filter).then(function(b){return b.buffer}):u.ready.then(function(){const b=new ArrayBuffer(m*g);return u.decodeGltfBuffer(new Uint8Array(b),m,g,v,s.mode,s.filter),b})})}else return null}}class yN{constructor(e){this.name=bt.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,i=t.nodes[e];if(!i.extensions||!i.extensions[this.name]||i.mesh===void 0)return null;const s=t.meshes[i.mesh];for(const h of s.primitives)if(h.mode!==xi.TRIANGLES&&h.mode!==xi.TRIANGLE_STRIP&&h.mode!==xi.TRIANGLE_FAN&&h.mode!==void 0)return null;const u=i.extensions[this.name].attributes,f=[],d={};for(const h in u)f.push(this.parser.getDependency("accessor",u[h]).then(m=>(d[h]=m,d[h])));return f.length<1?null:(f.push(this.parser.createNodeMesh(e)),Promise.all(f).then(h=>{const m=h.pop(),g=m.isGroup?m.children:[m],v=h[0].count,b=[];for(const E of g){const S=new ht,x=new X,y=new mr,T=new X(1,1,1),N=new u1(E.geometry,E.material,v);for(let A=0;A<v;A++)d.TRANSLATION&&x.fromBufferAttribute(d.TRANSLATION,A),d.ROTATION&&y.fromBufferAttribute(d.ROTATION,A),d.SCALE&&T.fromBufferAttribute(d.SCALE,A),N.setMatrixAt(A,S.compose(x,y,T));for(const A in d)if(A==="_COLOR_0"){const P=d[A];N.instanceColor=new Lp(P.array,P.itemSize,P.normalized)}else A!=="TRANSLATION"&&A!=="ROTATION"&&A!=="SCALE"&&E.geometry.setAttribute(A,d[A]);en.prototype.copy.call(N,E),this.parser.assignFinalMaterial(N),b.push(N)}return m.isGroup?(m.clear(),m.add(...b),m):b[0]}))}}const jb="glTF",wl=12,Sy={JSON:1313821514,BIN:5130562};class bN{constructor(e){this.name=bt.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,wl),i=new TextDecoder;if(this.header={magic:i.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==jb)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const s=this.header.length-wl,l=new DataView(e,wl);let u=0;for(;u<s;){const f=l.getUint32(u,!0);u+=4;const d=l.getUint32(u,!0);if(u+=4,d===Sy.JSON){const h=new Uint8Array(e,wl+u,f);this.content=i.decode(h)}else if(d===Sy.BIN){const h=wl+u;this.body=e.slice(h,h+f)}u+=f}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class xN{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=bt.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const i=this.json,s=this.dracoLoader,l=e.extensions[this.name].bufferView,u=e.extensions[this.name].attributes,f={},d={},h={};for(const m in u){const g=Ip[m]||m.toLowerCase();f[g]=u[m]}for(const m in e.attributes){const g=Ip[m]||m.toLowerCase();if(u[m]!==void 0){const v=i.accessors[e.attributes[m]],b=Js[v.componentType];h[g]=b.name,d[g]=v.normalized===!0}}return t.getDependency("bufferView",l).then(function(m){return new Promise(function(g,v){s.decodeDracoFile(m,function(b){for(const E in b.attributes){const S=b.attributes[E],x=d[E];x!==void 0&&(S.normalized=x)}g(b)},f,h,jn,v)})})}}class EN{constructor(){this.name=bt.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class MN{constructor(){this.name=bt.KHR_MESH_QUANTIZATION}}class Kb extends Gl{constructor(e,t,i,s){super(e,t,i,s)}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,l=e*s*3+s;for(let u=0;u!==s;u++)t[u]=i[l+u];return t}interpolate_(e,t,i,s){const l=this.resultBuffer,u=this.sampleValues,f=this.valueSize,d=f*2,h=f*3,m=s-t,g=(i-t)/m,v=g*g,b=v*g,E=e*h,S=E-h,x=-2*b+3*v,y=b-v,T=1-x,N=y-v+g;for(let A=0;A!==f;A++){const P=u[S+A+f],F=u[S+A+d]*m,k=u[E+A+f],z=u[E+A]*m;l[A]=T*P+N*F+x*k+y*z}return l}}const SN=new mr;class wN extends Kb{interpolate_(e,t,i,s){const l=super.interpolate_(e,t,i,s);return SN.fromArray(l).normalize().toArray(l),l}}const xi={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Js={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},wy={9728:qn,9729:ci,9984:fb,9985:Cu,9986:Tl,9987:wa},Ty={33071:cr,33648:zu,10497:io},Hh={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Ip={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},or={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},TN={CUBICSPLINE:void 0,LINEAR:Pl,STEP:Ul},Vh={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function AN(r){return r.DefaultMaterial===void 0&&(r.DefaultMaterial=new Jn({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Na})),r.DefaultMaterial}function Vr(r,e,t){for(const i in t.extensions)r[i]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[i]=t.extensions[i])}function Sa(r,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(r.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function RN(r,e,t){let i=!1,s=!1,l=!1;for(let h=0,m=e.length;h<m;h++){const g=e[h];if(g.POSITION!==void 0&&(i=!0),g.NORMAL!==void 0&&(s=!0),g.COLOR_0!==void 0&&(l=!0),i&&s&&l)break}if(!i&&!s&&!l)return Promise.resolve(r);const u=[],f=[],d=[];for(let h=0,m=e.length;h<m;h++){const g=e[h];if(i){const v=g.POSITION!==void 0?t.getDependency("accessor",g.POSITION):r.attributes.position;u.push(v)}if(s){const v=g.NORMAL!==void 0?t.getDependency("accessor",g.NORMAL):r.attributes.normal;f.push(v)}if(l){const v=g.COLOR_0!==void 0?t.getDependency("accessor",g.COLOR_0):r.attributes.color;d.push(v)}}return Promise.all([Promise.all(u),Promise.all(f),Promise.all(d)]).then(function(h){const m=h[0],g=h[1],v=h[2];return i&&(r.morphAttributes.position=m),s&&(r.morphAttributes.normal=g),l&&(r.morphAttributes.color=v),r.morphTargetsRelative=!0,r})}function CN(r,e){if(r.updateMorphTargets(),e.weights!==void 0)for(let t=0,i=e.weights.length;t<i;t++)r.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(r.morphTargetInfluences.length===t.length){r.morphTargetDictionary={};for(let i=0,s=t.length;i<s;i++)r.morphTargetDictionary[t[i]]=i}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function DN(r){let e;const t=r.extensions&&r.extensions[bt.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Gh(t.attributes):e=r.indices+":"+Gh(r.attributes)+":"+r.mode,r.targets!==void 0)for(let i=0,s=r.targets.length;i<s;i++)e+=":"+Gh(r.targets[i]);return e}function Gh(r){let e="";const t=Object.keys(r).sort();for(let i=0,s=t.length;i<s;i++)e+=t[i]+":"+r[t[i]]+";";return e}function Fp(r){switch(r){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function NN(r){return r.search(/\.jpe?g($|\?)/i)>0||r.search(/^data\:image\/jpeg/)===0?"image/jpeg":r.search(/\.webp($|\?)/i)>0||r.search(/^data\:image\/webp/)===0?"image/webp":r.search(/\.ktx2($|\?)/i)>0||r.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const LN=new ht;class UN{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new tN,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let i=!1,s=-1,l=!1,u=-1;if(typeof navigator<"u"){const f=navigator.userAgent;i=/^((?!chrome|android).)*safari/i.test(f)===!0;const d=f.match(/Version\/(\d+)/);s=i&&d?parseInt(d[1],10):-1,l=f.indexOf("Firefox")>-1,u=l?f.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||i&&s<17||l&&u<98?this.textureLoader=new N1(this.options.manager):this.textureLoader=new B1(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new kb(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const i=this,s=this.json,l=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(u){return u._markDefs&&u._markDefs()}),Promise.all(this._invokeAll(function(u){return u.beforeRoot&&u.beforeRoot()})).then(function(){return Promise.all([i.getDependencies("scene"),i.getDependencies("animation"),i.getDependencies("camera")])}).then(function(u){const f={scene:u[0][s.scene||0],scenes:u[0],animations:u[1],cameras:u[2],asset:s.asset,parser:i,userData:{}};return Vr(l,f,s),Sa(f,s),Promise.all(i._invokeAll(function(d){return d.afterRoot&&d.afterRoot(f)})).then(function(){for(const d of f.scenes)d.updateMatrixWorld();e(f)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],i=this.json.meshes||[];for(let s=0,l=t.length;s<l;s++){const u=t[s].joints;for(let f=0,d=u.length;f<d;f++)e[u[f]].isBone=!0}for(let s=0,l=e.length;s<l;s++){const u=e[s];u.mesh!==void 0&&(this._addNodeRef(this.meshCache,u.mesh),u.skin!==void 0&&(i[u.mesh].isSkinnedMesh=!0)),u.camera!==void 0&&this._addNodeRef(this.cameraCache,u.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,i){if(e.refs[t]<=1)return i;const s=i.clone(),l=(u,f)=>{const d=this.associations.get(u);d!=null&&this.associations.set(f,d);for(const[h,m]of u.children.entries())l(m,f.children[h])};return l(i,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let i=0;i<t.length;i++){const s=e(t[i]);if(s)return s}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const i=[];for(let s=0;s<t.length;s++){const l=e(t[s]);l&&i.push(l)}return i}getDependency(e,t){const i=e+":"+t;let s=this.cache.get(i);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(l){return l.loadNode&&l.loadNode(t)});break;case"mesh":s=this._invokeOne(function(l){return l.loadMesh&&l.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(l){return l.loadBufferView&&l.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(l){return l.loadMaterial&&l.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(l){return l.loadTexture&&l.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(l){return l.loadAnimation&&l.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(l){return l!=this&&l.getDependency&&l.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(i,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){const i=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(l,u){return i.getDependency(e,u)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],i=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[bt.KHR_BINARY_GLTF].body);const s=this.options;return new Promise(function(l,u){i.load(Dl.resolveURL(t.uri,s.path),l,void 0,function(){u(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(i){const s=t.byteLength||0,l=t.byteOffset||0;return i.slice(l,l+s)})}loadAccessor(e){const t=this,i=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){const u=Hh[s.type],f=Js[s.componentType],d=s.normalized===!0,h=new f(s.count*u);return Promise.resolve(new Yn(h,u,d))}const l=[];return s.bufferView!==void 0?l.push(this.getDependency("bufferView",s.bufferView)):l.push(null),s.sparse!==void 0&&(l.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),l.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(l).then(function(u){const f=u[0],d=Hh[s.type],h=Js[s.componentType],m=h.BYTES_PER_ELEMENT,g=m*d,v=s.byteOffset||0,b=s.bufferView!==void 0?i.bufferViews[s.bufferView].byteStride:void 0,E=s.normalized===!0;let S,x;if(b&&b!==g){const y=Math.floor(v/b),T="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+y+":"+s.count;let N=t.cache.get(T);N||(S=new h(f,y*b,s.count*b/m),N=new r1(S,b/m),t.cache.add(T,N)),x=new lm(N,d,v%b/m,E)}else f===null?S=new h(s.count*d):S=new h(f,v,s.count*d),x=new Yn(S,d,E);if(s.sparse!==void 0){const y=Hh.SCALAR,T=Js[s.sparse.indices.componentType],N=s.sparse.indices.byteOffset||0,A=s.sparse.values.byteOffset||0,P=new T(u[1],N,s.sparse.count*y),F=new h(u[2],A,s.sparse.count*d);f!==null&&(x=new Yn(x.array.slice(),x.itemSize,x.normalized)),x.normalized=!1;for(let k=0,z=P.length;k<z;k++){const R=P[k];if(x.setX(R,F[k*d]),d>=2&&x.setY(R,F[k*d+1]),d>=3&&x.setZ(R,F[k*d+2]),d>=4&&x.setW(R,F[k*d+3]),d>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}x.normalized=E}return x})}loadTexture(e){const t=this.json,i=this.options,l=t.textures[e].source,u=t.images[l];let f=this.textureLoader;if(u.uri){const d=i.manager.getHandler(u.uri);d!==null&&(f=d)}return this.loadTextureImage(e,l,f)}loadTextureImage(e,t,i){const s=this,l=this.json,u=l.textures[e],f=l.images[t],d=(f.uri||f.bufferView)+":"+u.sampler;if(this.textureCache[d])return this.textureCache[d];const h=this.loadImageSource(t,i).then(function(m){m.flipY=!1,m.name=u.name||f.name||"",m.name===""&&typeof f.uri=="string"&&f.uri.startsWith("data:image/")===!1&&(m.name=f.uri);const v=(l.samplers||{})[u.sampler]||{};return m.magFilter=wy[v.magFilter]||ci,m.minFilter=wy[v.minFilter]||wa,m.wrapS=Ty[v.wrapS]||io,m.wrapT=Ty[v.wrapT]||io,m.generateMipmaps=!m.isCompressedTexture&&m.minFilter!==qn&&m.minFilter!==ci,s.associations.set(m,{textures:e}),m}).catch(function(){return null});return this.textureCache[d]=h,h}loadImageSource(e,t){const i=this,s=this.json,l=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(g=>g.clone());const u=s.images[e],f=self.URL||self.webkitURL;let d=u.uri||"",h=!1;if(u.bufferView!==void 0)d=i.getDependency("bufferView",u.bufferView).then(function(g){h=!0;const v=new Blob([g],{type:u.mimeType});return d=f.createObjectURL(v),d});else if(u.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const m=Promise.resolve(d).then(function(g){return new Promise(function(v,b){let E=v;t.isImageBitmapLoader===!0&&(E=function(S){const x=new wn(S);x.needsUpdate=!0,v(x)}),t.load(Dl.resolveURL(g,l.path),E,void 0,b)})}).then(function(g){return h===!0&&f.revokeObjectURL(d),Sa(g,u),g.userData.mimeType=u.mimeType||NN(u.uri),g}).catch(function(g){throw console.error("THREE.GLTFLoader: Couldn't load texture",d),g});return this.sourceCache[e]=m,m}assignTexture(e,t,i,s){const l=this;return this.getDependency("texture",i.index).then(function(u){if(!u)return null;if(i.texCoord!==void 0&&i.texCoord>0&&(u=u.clone(),u.channel=i.texCoord),l.extensions[bt.KHR_TEXTURE_TRANSFORM]){const f=i.extensions!==void 0?i.extensions[bt.KHR_TEXTURE_TRANSFORM]:void 0;if(f){const d=l.associations.get(u);u=l.extensions[bt.KHR_TEXTURE_TRANSFORM].extendTexture(u,f),l.associations.set(u,d)}}return s!==void 0&&(u.colorSpace=s),e[t]=u,u})}assignFinalMaterial(e){const t=e.geometry;let i=e.material;const s=t.attributes.tangent===void 0,l=t.attributes.color!==void 0,u=t.attributes.normal===void 0;if(e.isPoints){const f="PointsMaterial:"+i.uuid;let d=this.cache.get(f);d||(d=new Ib,ji.prototype.copy.call(d,i),d.color.copy(i.color),d.map=i.map,d.sizeAttenuation=!1,this.cache.add(f,d)),i=d}else if(e.isLine){const f="LineBasicMaterial:"+i.uuid;let d=this.cache.get(f);d||(d=new Ob,ji.prototype.copy.call(d,i),d.color.copy(i.color),d.map=i.map,this.cache.add(f,d)),i=d}if(s||l||u){let f="ClonedMaterial:"+i.uuid+":";s&&(f+="derivative-tangents:"),l&&(f+="vertex-colors:"),u&&(f+="flat-shading:");let d=this.cache.get(f);d||(d=i.clone(),l&&(d.vertexColors=!0),u&&(d.flatShading=!0),s&&(d.normalScale&&(d.normalScale.y*=-1),d.clearcoatNormalScale&&(d.clearcoatNormalScale.y*=-1)),this.cache.add(f,d),this.associations.set(d,this.associations.get(i))),i=d}e.material=i}getMaterialType(){return Jn}loadMaterial(e){const t=this,i=this.json,s=this.extensions,l=i.materials[e];let u;const f={},d=l.extensions||{},h=[];if(d[bt.KHR_MATERIALS_UNLIT]){const g=s[bt.KHR_MATERIALS_UNLIT];u=g.getMaterialType(),h.push(g.extendParams(f,l,t))}else{const g=l.pbrMetallicRoughness||{};if(f.color=new lt(1,1,1),f.opacity=1,Array.isArray(g.baseColorFactor)){const v=g.baseColorFactor;f.color.setRGB(v[0],v[1],v[2],jn),f.opacity=v[3]}g.baseColorTexture!==void 0&&h.push(t.assignTexture(f,"map",g.baseColorTexture,Dn)),f.metalness=g.metallicFactor!==void 0?g.metallicFactor:1,f.roughness=g.roughnessFactor!==void 0?g.roughnessFactor:1,g.metallicRoughnessTexture!==void 0&&(h.push(t.assignTexture(f,"metalnessMap",g.metallicRoughnessTexture)),h.push(t.assignTexture(f,"roughnessMap",g.metallicRoughnessTexture))),u=this._invokeOne(function(v){return v.getMaterialType&&v.getMaterialType(e)}),h.push(Promise.all(this._invokeAll(function(v){return v.extendMaterialParams&&v.extendMaterialParams(e,f)})))}l.doubleSided===!0&&(f.side=Ei);const m=l.alphaMode||Vh.OPAQUE;if(m===Vh.BLEND?(f.transparent=!0,f.depthWrite=!1):(f.transparent=!1,m===Vh.MASK&&(f.alphaTest=l.alphaCutoff!==void 0?l.alphaCutoff:.5)),l.normalTexture!==void 0&&u!==Aa&&(h.push(t.assignTexture(f,"normalMap",l.normalTexture)),f.normalScale=new Ct(1,1),l.normalTexture.scale!==void 0)){const g=l.normalTexture.scale;f.normalScale.set(g,g)}if(l.occlusionTexture!==void 0&&u!==Aa&&(h.push(t.assignTexture(f,"aoMap",l.occlusionTexture)),l.occlusionTexture.strength!==void 0&&(f.aoMapIntensity=l.occlusionTexture.strength)),l.emissiveFactor!==void 0&&u!==Aa){const g=l.emissiveFactor;f.emissive=new lt().setRGB(g[0],g[1],g[2],jn)}return l.emissiveTexture!==void 0&&u!==Aa&&h.push(t.assignTexture(f,"emissiveMap",l.emissiveTexture,Dn)),Promise.all(h).then(function(){const g=new u(f);return l.name&&(g.name=l.name),Sa(g,l),t.associations.set(g,{materials:e}),l.extensions&&Vr(s,g,l),g})}createUniqueName(e){const t=zt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,i=this.extensions,s=this.primitiveCache;function l(f){return i[bt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(f,t).then(function(d){return Ay(d,f,t)})}const u=[];for(let f=0,d=e.length;f<d;f++){const h=e[f],m=DN(h),g=s[m];if(g)u.push(g.promise);else{let v;h.extensions&&h.extensions[bt.KHR_DRACO_MESH_COMPRESSION]?v=l(h):v=Ay(new zi,h,t),s[m]={primitive:h,promise:v},u.push(v)}}return Promise.all(u)}loadMesh(e){const t=this,i=this.json,s=this.extensions,l=i.meshes[e],u=l.primitives,f=[];for(let d=0,h=u.length;d<h;d++){const m=u[d].material===void 0?AN(this.cache):this.getDependency("material",u[d].material);f.push(m)}return f.push(t.loadGeometries(u)),Promise.all(f).then(function(d){const h=d.slice(0,d.length-1),m=d[d.length-1],g=[];for(let b=0,E=m.length;b<E;b++){const S=m[b],x=u[b];let y;const T=h[b];if(x.mode===xi.TRIANGLES||x.mode===xi.TRIANGLE_STRIP||x.mode===xi.TRIANGLE_FAN||x.mode===void 0)y=l.isSkinnedMesh===!0?new o1(S,T):new Bt(S,T),y.isSkinnedMesh===!0&&y.normalizeSkinWeights(),x.mode===xi.TRIANGLE_STRIP?y.geometry=My(y.geometry,xb):x.mode===xi.TRIANGLE_FAN&&(y.geometry=My(y.geometry,Dp));else if(x.mode===xi.LINES)y=new h1(S,T);else if(x.mode===xi.LINE_STRIP)y=new fm(S,T);else if(x.mode===xi.LINE_LOOP)y=new p1(S,T);else if(x.mode===xi.POINTS)y=new m1(S,T);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+x.mode);Object.keys(y.geometry.morphAttributes).length>0&&CN(y,l),y.name=t.createUniqueName(l.name||"mesh_"+e),Sa(y,l),x.extensions&&Vr(s,y,x),t.assignFinalMaterial(y),g.push(y)}for(let b=0,E=g.length;b<E;b++)t.associations.set(g[b],{meshes:e,primitives:b});if(g.length===1)return l.extensions&&Vr(s,g[0],l),g[0];const v=new Yi;l.extensions&&Vr(s,v,l),t.associations.set(v,{meshes:e});for(let b=0,E=g.length;b<E;b++)v.add(g[b]);return v})}loadCamera(e){let t;const i=this.json.cameras[e],s=i[i.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return i.type==="perspective"?t=new Xn(It.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):i.type==="orthographic"&&(t=new hm(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),i.name&&(t.name=this.createUniqueName(i.name)),Sa(t,i),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],i=[];for(let s=0,l=t.joints.length;s<l;s++)i.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?i.push(this.getDependency("accessor",t.inverseBindMatrices)):i.push(null),Promise.all(i).then(function(s){const l=s.pop(),u=s,f=[],d=[];for(let h=0,m=u.length;h<m;h++){const g=u[h];if(g){f.push(g);const v=new ht;l!==null&&v.fromArray(l.array,h*16),d.push(v)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[h])}return new cm(f,d)})}loadAnimation(e){const t=this.json,i=this,s=t.animations[e],l=s.name?s.name:"animation_"+e,u=[],f=[],d=[],h=[],m=[];for(let g=0,v=s.channels.length;g<v;g++){const b=s.channels[g],E=s.samplers[b.sampler],S=b.target,x=S.node,y=s.parameters!==void 0?s.parameters[E.input]:E.input,T=s.parameters!==void 0?s.parameters[E.output]:E.output;S.node!==void 0&&(u.push(this.getDependency("node",x)),f.push(this.getDependency("accessor",y)),d.push(this.getDependency("accessor",T)),h.push(E),m.push(S))}return Promise.all([Promise.all(u),Promise.all(f),Promise.all(d),Promise.all(h),Promise.all(m)]).then(function(g){const v=g[0],b=g[1],E=g[2],S=g[3],x=g[4],y=[];for(let T=0,N=v.length;T<N;T++){const A=v[T],P=b[T],F=E[T],k=S[T],z=x[T];if(A===void 0)continue;A.updateMatrix&&A.updateMatrix();const R=i._createAnimationTracks(A,P,F,k,z);if(R)for(let C=0;C<R.length;C++)y.push(R[C])}return new S1(l,void 0,y)})}createNodeMesh(e){const t=this.json,i=this,s=t.nodes[e];return s.mesh===void 0?null:i.getDependency("mesh",s.mesh).then(function(l){const u=i._getNodeRef(i.meshCache,s.mesh,l);return s.weights!==void 0&&u.traverse(function(f){if(f.isMesh)for(let d=0,h=s.weights.length;d<h;d++)f.morphTargetInfluences[d]=s.weights[d]}),u})}loadNode(e){const t=this.json,i=this,s=t.nodes[e],l=i._loadNodeShallow(e),u=[],f=s.children||[];for(let h=0,m=f.length;h<m;h++)u.push(i.getDependency("node",f[h]));const d=s.skin===void 0?Promise.resolve(null):i.getDependency("skin",s.skin);return Promise.all([l,Promise.all(u),d]).then(function(h){const m=h[0],g=h[1],v=h[2];v!==null&&m.traverse(function(b){b.isSkinnedMesh&&b.bind(v,LN)});for(let b=0,E=g.length;b<E;b++)m.add(g[b]);return m})}_loadNodeShallow(e){const t=this.json,i=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const l=t.nodes[e],u=l.name?s.createUniqueName(l.name):"",f=[],d=s._invokeOne(function(h){return h.createNodeMesh&&h.createNodeMesh(e)});return d&&f.push(d),l.camera!==void 0&&f.push(s.getDependency("camera",l.camera).then(function(h){return s._getNodeRef(s.cameraCache,l.camera,h)})),s._invokeAll(function(h){return h.createNodeAttachment&&h.createNodeAttachment(e)}).forEach(function(h){f.push(h)}),this.nodeCache[e]=Promise.all(f).then(function(h){let m;if(l.isBone===!0?m=new Ub:h.length>1?m=new Yi:h.length===1?m=h[0]:m=new en,m!==h[0])for(let g=0,v=h.length;g<v;g++)m.add(h[g]);if(l.name&&(m.userData.name=l.name,m.name=u),Sa(m,l),l.extensions&&Vr(i,m,l),l.matrix!==void 0){const g=new ht;g.fromArray(l.matrix),m.applyMatrix4(g)}else l.translation!==void 0&&m.position.fromArray(l.translation),l.rotation!==void 0&&m.quaternion.fromArray(l.rotation),l.scale!==void 0&&m.scale.fromArray(l.scale);return s.associations.has(m)||s.associations.set(m,{}),s.associations.get(m).nodes=e,m}),this.nodeCache[e]}loadScene(e){const t=this.extensions,i=this.json.scenes[e],s=this,l=new Yi;i.name&&(l.name=s.createUniqueName(i.name)),Sa(l,i),i.extensions&&Vr(t,l,i);const u=i.nodes||[],f=[];for(let d=0,h=u.length;d<h;d++)f.push(s.getDependency("node",u[d]));return Promise.all(f).then(function(d){for(let m=0,g=d.length;m<g;m++)l.add(d[m]);const h=m=>{const g=new Map;for(const[v,b]of s.associations)(v instanceof ji||v instanceof wn)&&g.set(v,b);return m.traverse(v=>{const b=s.associations.get(v);b!=null&&g.set(v,b)}),g};return s.associations=h(l),l})}_createAnimationTracks(e,t,i,s,l){const u=[],f=e.name?e.name:e.uuid,d=[];or[l.path]===or.weights?e.traverse(function(v){v.morphTargetInfluences&&d.push(v.name?v.name:v.uuid)}):d.push(f);let h;switch(or[l.path]){case or.weights:h=lo;break;case or.rotation:h=co;break;case or.position:case or.scale:h=uo;break;default:switch(i.itemSize){case 1:h=lo;break;case 2:case 3:default:h=uo;break}break}const m=s.interpolation!==void 0?TN[s.interpolation]:Pl,g=this._getArrayFromAccessor(i);for(let v=0,b=d.length;v<b;v++){const E=new h(d[v]+"."+or[l.path],t.array,g,m);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(E),u.push(E)}return u}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const i=Fp(t.constructor),s=new Float32Array(t.length);for(let l=0,u=t.length;l<u;l++)s[l]=t[l]*i;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(i){const s=this instanceof co?wN:Kb;return new s(this.times,this.values,this.getValueSize()/3,i)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function PN(r,e,t){const i=e.attributes,s=new Ua;if(i.POSITION!==void 0){const f=t.json.accessors[i.POSITION],d=f.min,h=f.max;if(d!==void 0&&h!==void 0){if(s.set(new X(d[0],d[1],d[2]),new X(h[0],h[1],h[2])),f.normalized){const m=Fp(Js[f.componentType]);s.min.multiplyScalar(m),s.max.multiplyScalar(m)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const l=e.targets;if(l!==void 0){const f=new X,d=new X;for(let h=0,m=l.length;h<m;h++){const g=l[h];if(g.POSITION!==void 0){const v=t.json.accessors[g.POSITION],b=v.min,E=v.max;if(b!==void 0&&E!==void 0){if(d.setX(Math.max(Math.abs(b[0]),Math.abs(E[0]))),d.setY(Math.max(Math.abs(b[1]),Math.abs(E[1]))),d.setZ(Math.max(Math.abs(b[2]),Math.abs(E[2]))),v.normalized){const S=Fp(Js[v.componentType]);d.multiplyScalar(S)}f.max(d)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(f)}r.boundingBox=s;const u=new $i;s.getCenter(u.center),u.radius=s.min.distanceTo(s.max)/2,r.boundingSphere=u}function Ay(r,e,t){const i=e.attributes,s=[];function l(u,f){return t.getDependency("accessor",u).then(function(d){r.setAttribute(f,d)})}for(const u in i){const f=Ip[u]||u.toLowerCase();f in r.attributes||s.push(l(i[u],f))}if(e.indices!==void 0&&!r.index){const u=t.getDependency("accessor",e.indices).then(function(f){r.setIndex(f)});s.push(u)}return Rt.workingColorSpace!==jn&&"COLOR_0"in i&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Rt.workingColorSpace}" not supported.`),Sa(r,e),PN(r,e,t),Promise.all(s).then(function(){return e.targets!==void 0?RN(r,e.targets,t):r})}function ON(r){return new Promise((e,t)=>{new eN().load(ob("models/court.glb"),s=>{kt("Court loaded successfully");const l=s.scene;l.traverse(u=>{u.isMesh&&(u.castShadow=!0,u.receiveShadow=!0,u.material&&(u.material.side=Ei,u.material.needsUpdate=!0))}),r.add(l),e(l)},void 0,s=>{console.error("Error loading court model:",s);const l=IN(r);e(l)})})}function IN(r){const e=new Vl(20,10),t=new Jn({color:5474869,side:Ei}),i=new Bt(e,t);return i.rotation.x=-Math.PI/2,i.position.y=-.01,i.receiveShadow=!0,r.add(i),kt("Using fallback simple court"),i}function FN(r){const e=new Yi,t=new Wu(.105,32,32),i=new Jn({color:16776960}),s=new Bt(t,i);s.castShadow=!0,e.add(s);const l=new Wu(.105,16,16),u=new Aa({color:16711680,wireframe:!0,transparent:!0,opacity:.6}),f=new Bt(l,u);return f.position.copy(s.position),e.add(f),e.position.set(-8,1,0),e.userData={ball:s,collisionSphere:f},r.add(e),e}function Zb(r,e){const i=e.userData.racketGroup.children[0],s=new X;i.getWorldPosition(s);const l=new X(0,0,1),u=new ht;i.updateMatrixWorld(!0),u.copy(i.matrixWorld);const f=new dt().setFromMatrix4(u);l.applyMatrix3(f),r.position.copy(s),r.position.add(l.multiplyScalar(.2))}function BN(r,e,t,i,s){if(!e.ballInPlay&&e.waitingToServe){const l=s[0];Zb(r,l);return}e.ballInPlay&&(e.ballVelocity.y-=9.8*t,r.position.x+=e.ballVelocity.x*t,r.position.y+=e.ballVelocity.y*t,r.position.z+=e.ballVelocity.z*t,r.position.y<.105&&(r.position.y=.105,e.ballVelocity.y=Math.abs(e.ballVelocity.y)*.85,Math.abs(r.position.x)>10&&(kt("Ball out of bounds!"),Ry(r,e,s))),(Math.abs(r.position.x)>12||Math.abs(r.position.z)>7||r.position.y>15)&&(kt("Ball out of bounds!"),Ry(r,e,s)),e.debug&&Math.floor(i.elapsedTime*10)%30===0&&(kt(`Ball pos: (${r.position.x.toFixed(2)}, ${r.position.y.toFixed(2)}, ${r.position.z.toFixed(2)})`),kt(`Ball velocity: (${e.ballVelocity.x.toFixed(2)}, ${e.ballVelocity.y.toFixed(2)}, ${e.ballVelocity.z.toFixed(2)})`)))}function Ry(r,e,t){e.ballInPlay=!1,e.waitingToServe=!0,e.ballApproachId=(e.ballApproachId||0)+1,e.player1LastAttemptedBall=-1,e.player2LastAttemptedBall=-1,e.player1SwingCooldown=0,e.player2SwingCooldown=0;const i=t[0];Zb(r,i),e.ballVelocity.set(0,0,0),kt("Ball reset. Press SPACEBAR to serve again.")}function zN(r,e,t,i,s){const l=r.clone().sub(t);l.applyMatrix3(s.clone().transpose());const u=new X(Math.max(-i.x/2,Math.min(i.x/2,l.x)),Math.max(-i.y/2,Math.min(i.y/2,l.y)),Math.max(-i.z/2,Math.min(i.z/2,l.z)));return l.distanceTo(u)<=e}function kN(r,e){const i=r.userData.racketGroup.children[0],s=new X;i.getWorldPosition(s);const l=new ht;i.updateMatrixWorld(!0),l.copy(i.matrixWorld);const u=new dt().setFromMatrix4(l),f=.63,d=new X(.7*f,.7*f,.05*f);return{position:s,rotation:u,size:d}}function vm(r,e,t,i,s="right",l=1){const u=Number.isFinite(l)?Math.min(1,Math.max(0,l)):1;t.userData.rightArm,t.userData.racketGroup;const f=kN(t),d=.105,h=r.position.clone(),m=zN(h,d,f.position,f.size,f.rotation),g=f.position.distanceTo(h),v=t.userData.rightArm.rotation.x!==0||t.userData.rightArm.rotation.y!==0||t.userData.rightArm.rotation.z!==0;if(kt(`Player ${i+1} - Distance: ${g.toFixed(2)}, Colliding: ${m}, Swinging: ${v}`),!e.ballInPlay&&g<.9&&i===0){e.ballInPlay=!0,e.waitingToServe=!1;const b=new X(0,0,1);b.applyMatrix3(f.rotation);const E=6.5,S=1.8,x=new X(E-t.position.x,0,S-t.position.z);x.normalize();const y=b.clone().multiplyScalar(.3).add(x.multiplyScalar(.7));return y.normalize(),e.ballVelocity.set(y.x*(12+Math.random()*2),6+Math.random(),y.z*(6+Math.random()*2)),e.lastHitBy=i,e.ballApproachId=(e.ballApproachId||0)+1,kt("Ball served toward player 2's actual position with diagonal trajectory!"),!0}else if(g<1.6){const b=new X(0,0,1);b.applyMatrix3(f.rotation);const E=new X(1,0,0);E.applyMatrix3(f.rotation);const S=It.lerp(.7,1,u),x=(12+Math.random()*3)*S,y=5+Math.random()*3;let T=b.clone();return i===0?(T.x<0&&(T.x=Math.abs(T.x)),s==="left"?T.add(E.clone().multiplyScalar(-.5)):s==="right"&&T.add(E.clone().multiplyScalar(.5))):(T.x>0&&(T.x=-Math.abs(T.x)),s==="left"?T.add(E.clone().multiplyScalar(.5)):s==="right"&&T.add(E.clone().multiplyScalar(-.5))),T.normalize(),e.ballVelocity.set(T.x*x,y,T.z*(x*.7)),e.lastHitBy=i,e.ballApproachId=(e.ballApproachId||0)+1,i===0?e.returnToCenter.player1=!0:e.returnToCenter.player2=!0,kt(`Ball hit by player ${i+1} with accurate racket collision! Direction: ${s}`),!0}else return g<.45&&kt(`Player ${i+1} close miss - Distance: ${g.toFixed(2)}, Colliding: ${m}, Swinging: ${v}`),!1}function HN(){return{ballVelocity:new X(0,0,0),ballInPlay:!1,waitingToServe:!0,lastHitBy:null,score:{player1:0,player2:0},debug:!0,lastMoveTime:0,returnToCenter:{player1:!1,player2:!1},usePoseDetection:!0,lastAIUpdate:0,aiUpdateInterval:1e3/30,player1LastSwingCheck:0,player2LastSwingCheck:0,swingCheckInterval:1e3/60,player1SwingCooldown:0,player2SwingCooldown:0,swingCooldownDuration:200,ballApproachId:0,player1LastAttemptedBall:-1,player2LastAttemptedBall:-1}}function VN(){return[{targetX:-6,targetZ:-1.5,isLeftSide:!0,moveTime:0,swinging:!1,swingTime:0,legPhase:0,x:-6,z:-1.5,homeX:-6,homeZ:-1.5},{targetX:6.5,targetZ:1.7,isLeftSide:!1,moveTime:0,swinging:!1,swingTime:0,legPhase:0,x:6.5,z:1.7,homeX:6.5,homeZ:1.7}]}function GN(r,e,t){const i=t.getElapsedTime();if(i-r.lastMoveTime>5+Math.random()*3&&!r.returnToCenter.player1&&!r.returnToCenter.player2&&!r.ballInPlay){r.lastMoveTime=i;const u=e[0];u.targetX=-8+Math.random()*2,u.targetZ=-2+Math.random()*4;const f=e[1];f.targetX=6+Math.random()*2,f.targetZ=-2+Math.random()*4,kt(`Players moving to new idle positions: P1(${u.targetX.toFixed(1)}, ${u.targetZ.toFixed(1)}), P2(${f.targetX.toFixed(1)}, ${f.targetZ.toFixed(1)})`)}}function WN(r,e,t,i){const s=r[0],l=t[0],u=performance.now();if(u-e.lastAIUpdate<e.aiUpdateInterval){u-e.player1LastSwingCheck>=e.swingCheckInterval&&(XN(s,l,i,e),e.player1LastSwingCheck=u);return}if(e.returnToCenter.player1){l.targetX=-6,l.targetZ=-1.5,Math.sqrt(Math.pow(s.position.x- -6,2)+Math.pow(s.position.z- -1.5,2))<1&&(e.returnToCenter.player1=!1);const d=Math.PI/2;s.rotation.y=It.lerp(s.rotation.y,d,.08)}else if(e.ballInPlay){const f=i.position,d=e.ballVelocity;if(d.x<0||f.x<1&&Math.abs(d.x)<4){const m=Yb(s,i,e,0),g=Math.sqrt(Math.pow(s.position.x-f.x,2)+Math.pow(s.position.z-f.z,2));e.debug&&Math.floor(Date.now()/1e3)%4===0&&kt(`Player 1 AI: Ball at (${f.x.toFixed(1)}, ${f.z.toFixed(1)}), Distance: ${g.toFixed(1)}, Moving to: (${m.x.toFixed(1)}, ${m.z.toFixed(1)})`),g<6?(l.targetX=m.x,l.targetZ=m.z):(l.targetX=Math.max(-8,Math.min(-4,f.x-.5)),l.targetZ=Math.max(-2,Math.min(2,f.z*.5)));const v=Math.PI/2;s.rotation.y=It.lerp(s.rotation.y,v,.08)}else{const g=Math.max(-2.5,Math.min(1,-1.5+f.z*.3));l.targetX=-6,l.targetZ=g;const v=Math.PI/2;s.rotation.y=It.lerp(s.rotation.y,v,.08)}}else if(l.targetX=-6,l.targetZ=-1.5,e.waitingToServe){const f=new X(6.5-s.position.x,0,1.7-s.position.z),h=Math.atan2(f.z,f.x)-Math.PI/4;s.rotation.y=It.lerp(s.rotation.y,h,.05)}}function XN(r,e,t,i){const s=performance.now();if(!(s<i.player1SwingCooldown)&&!e.swinging&&i.ballInPlay){const l=t.position,u=Math.sqrt(Math.pow(r.position.x-l.x,2)+Math.pow(r.position.z-l.z,2)),f=i.ballVelocity.x<0;if(i.player1LastAttemptedBall===i.ballApproachId)return;const d=t.position.y>.1&&t.position.y<6,h=u<1.5,m=u<1,g=f||Math.abs(i.ballVelocity.x)<2;d&&g&&(h||m)&&(i.player1LastAttemptedBall=i.ballApproachId,i.player1SwingCooldown=s+i.swingCooldownDuration,e.swinging=!0,e.swingTime=0,vm(t,i,r,0),kt(`Player 1 single swing! Distance: ${u.toFixed(2)}, Approach ID: ${i.ballApproachId}`))}}function qN(r,e,t,i){const s=r[1],l=t[1],u=performance.now();if(u-e.lastAIUpdate<e.aiUpdateInterval){u-e.player2LastSwingCheck>=e.swingCheckInterval&&(YN(s,l,i,e),e.player2LastSwingCheck=u);return}if(e.lastAIUpdate=u,e.returnToCenter.player2)l.targetX=6.5,l.targetZ=1.7,Math.sqrt(Math.pow(s.position.x-6.5,2)+Math.pow(s.position.z-1.7,2))<1&&(e.returnToCenter.player2=!1);else if(e.ballInPlay){const f=i.position,d=e.ballVelocity;if(d.x>0||f.x>1&&Math.abs(d.x)<4){const m=Yb(s,i,e,1),g=Math.sqrt(Math.pow(s.position.x-f.x,2)+Math.pow(s.position.z-f.z,2));e.debug&&Math.floor(Date.now()/1e3)%3===0&&kt(`Player 2 AI: Ball at (${f.x.toFixed(1)}, ${f.z.toFixed(1)}), Distance: ${g.toFixed(1)}, Moving to: (${m.x.toFixed(1)}, ${m.z.toFixed(1)})`),g<8?(l.targetX=m.x,l.targetZ=m.z):(l.targetX=Math.max(3.5,Math.min(8,f.x+.3)),l.targetZ=Math.max(-2,Math.min(2,f.z*.7)))}else{const g=Math.max(-1,Math.min(2.5,1.7+f.z*.2));l.targetX=6.5,l.targetZ=g}}else l.targetX=6.5,l.targetZ=1.7}function YN(r,e,t,i){const s=performance.now();if(!(s<i.player2SwingCooldown)&&!e.swinging&&i.ballInPlay){const l=t.position,u=Math.sqrt(Math.pow(r.position.x-l.x,2)+Math.pow(r.position.z-l.z,2)),f=i.ballVelocity.x>0;if(f&&(i.player2LastAttemptedBall,i.ballApproachId),i.player2LastAttemptedBall===i.ballApproachId)return;const d=t.position.y>.1&&t.position.y<6,h=u<1.5,m=u<1,g=f||Math.abs(i.ballVelocity.x)<2;d&&g&&(h||m)&&(i.player2LastAttemptedBall=i.ballApproachId,i.player2SwingCooldown=s+i.swingCooldownDuration,kt(`🎾 SWING DEBUG - Player 2 at (${r.position.x.toFixed(1)}, ${r.position.z.toFixed(1)}), Ball at (${l.x.toFixed(1)}, ${l.z.toFixed(1)}), Distance: ${u.toFixed(2)}, Ball velocity: (${i.ballVelocity.x.toFixed(1)}, ${i.ballVelocity.z.toFixed(1)})`),e.swinging=!0,e.swingTime=0,vm(t,i,r,1),kt(`Player 2 single swing! Distance: ${u.toFixed(2)}, Approach ID: ${i.ballApproachId}`))}}function jN(r,e,t,i){kt("Starting game!"),r[0].position.set(-6,0,-1.5),r[1].position.set(6.5,0,1.7),r[0].rotation.y=Math.PI/2,r[1].rotation.y=-Math.PI/2;const s=r[0];e.position.set(s.position.x+.6,1.3,s.position.z+.5),t.ballVelocity.set(0,0,0),t.ballInPlay=!1,t.waitingToServe=!0,t.lastHitBy=null,t.lastMoveTime=0,t.returnToCenter={player1:!1,player2:!1},t.ballApproachId=0,t.player1LastAttemptedBall=-1,t.player2LastAttemptedBall=-1,t.player1SwingCooldown=0,t.player2SwingCooldown=0,i[0].targetX=-6,i[0].targetZ=-1.5,i[1].targetX=6.5,i[1].targetZ=1.7,kt("Game started. Press SPACEBAR to serve the ball.")}const KN={VITE_WIBBLY_MODE:"demo"};function ZN(){return yw(KN??{},typeof window<"u"?window:null)}function Cy(r){r&&r.traverse(e=>{var i;(i=e.geometry)==null||i.dispose();const t=Array.isArray(e.material)?e.material:e.material?[e.material]:[];for(const s of t){for(const l of Object.keys(s)){const u=s[l];u&&typeof u=="object"&&u.isTexture&&u.dispose()}s.dispose()}})}function $b({paused:r=!1,settings:e=null,calibration:t=null,onInputState:i=null,onSwing:s=null,onTrackerBackend:l=null,onAuthority:u=null}){const f=G.useRef(null),d=G.useRef([]),h=G.useRef(null),m=G.useRef(null),g=G.useRef(null),v=G.useRef(null),b=G.useRef(HN()),E=G.useRef(VN()),S=G.useRef(null);S.current||(S.current=t??new kl);const x=G.useRef(r);G.useEffect(()=>{x.current=r},[r]);const y=G.useRef(s);G.useEffect(()=>{y.current=s},[s]);const T=G.useRef(l);G.useEffect(()=>{T.current=l},[l]);const N=G.useRef(u);G.useEffect(()=>{N.current=u},[u]);const A=G.useRef(i);G.useEffect(()=>{A.current=i},[i]);const[P,F]=G.useState(null),[k,z]=G.useState([]);return G.useEffect(()=>{var ct;if(!f.current)return;kt("Game initializing...");let R=!1;e&&(typeof e.usePoseDetection=="boolean"&&(b.current.usePoseDetection=e.usePoseDetection),typeof e.debug=="boolean"&&(b.current.debug=e.debug));const C=new a1;C.background=new lt(722960),C.fog=new om(722960,26,74);const H=new Xn(75,window.innerWidth/window.innerHeight,.1,1e3),J=new X,K=new X;function ce(Ae,Re,tt){let O=new X(-4.5,4.8,0).clone();if(tt.ballInPlay){const fe=Re.position,be=Ae.position,ge=new X().addVectors(be,fe).multiplyScalar(.5),qe=Math.max(1,fe.y);O.y=4.8+(qe-1)*.3,O.z=fe.z*.15;const Ue=be.distanceTo(fe);O.x=-4.5-Math.min(Ue*.12,1.2);const Ve=ge.clone();Ve.y+=.5,J.lerp(Ve,.05)}else{const fe=Ae.position.clone();fe.y+=1,J.lerp(fe,.05)}const D=new X().copy(Ae.position).add(O);K.lerp(D,.04),H.position.copy(K),H.lookAt(J)}const de=new LD({antialias:!0});de.setSize(window.innerWidth,window.innerHeight),de.setPixelRatio(Math.min(window.devicePixelRatio,1)),de.shadowMap.enabled=!0,f.current.appendChild(de.domElement);const W=new F1(16777215,1.5);C.add(W);const le=new Hb(16777215,1);le.position.set(5,10,5),le.castShadow=!0,C.add(le),ON(C).then(Ae=>{R&&Cy(Ae)});const Y=FN(C);h.current=Y;const I=[{x:-8,z:0,rotation:Math.PI/2},{x:8,z:0,rotation:-Math.PI/2}].map((Ae,Re)=>{const tt=KD(Ae.x,Ae.z,Ae.rotation,.63);C.add(tt);const De=E.current[Re];return De.x=Ae.x,De.z=Ae.z,De.homeX=Ae.x,De.homeZ=Ae.z,tt});d.current=I,K.set(-12.5,4.8,0),J.set(-8,1,0);function re(){jN(I,Y,b.current,E.current)}async function Se(){var tt,De;const Ae=S.current,Re=new ab({calibration:Ae,trackerConfig:{modelUrl:sb(),preferredBackends:["webgl"],onBackend:O=>{var D;try{(D=T.current)==null||D.call(T,O)}catch(ne){console.warn("onTrackerBackend handler threw:",ne)}}},binder:new eb({maxPlayers:2,claimZones:aw(2),forgetAfterMs:2e3}),recognizers:[new tb({handedness:O=>Ae.handednessFor(O)})],frame:{width:640,height:480,fps:30},onError:O=>console.error("Gesture input error:",O)});Re.onGesture(O=>{var ne,fe;if((ne=g.current)==null||ne.sendGesture(O),O.kind!=="swing"||O.playerId!=="player_1")return;const D=((fe=O.detail)==null?void 0:fe.stroke)==="backhand"?"left":"right";Q(D,O.confidence)}),Re.onPeople(O=>{const D=O.map(ne=>ne.playerId);z(ne=>ne.length===D.length&&ne.every((fe,be)=>fe===D[be])?ne:D);for(const ne of O)Ae.observeReach(ne.playerId,ne)});try{if(await Re.start(),R){Re.stop();return}m.current=Re,F(Re),(tt=A.current)==null||tt.call(A,"live"),kt("Gesture input initialized")}catch(O){console.error("Gesture input unavailable, falling back to keyboard:",O),b.current.usePoseDetection=!1,R||(De=A.current)==null||De.call(A,"keyboard"),Re.stop()}}async function Ne(){const Ae=ZN();if(!Ae)return;bw(rb());const Re=new kD({transport:Ae,limits:{acceptedKinds:["swing"]},onStatusChange:tt=>kt("[peer] session",tt),onError:tt=>console.warn("[peer] transport error:",tt)});try{if(await Re.connect(),R){Re.close();return}g.current=Re,kt("[peer] connected — streaming local gesture events to the peer")}catch(tt){console.warn("[peer] unavailable, continuing with local play:",tt),Re.close()}}function Q(Ae="right",Re=1){var D;kt("Handling swing!",Ae);try{(D=y.current)==null||D.call(y,Ae)}catch(ne){console.warn("onSwing handler threw:",ne)}Dt=!0;const tt=b.current,De=I[0],O=E.current[0];O.swinging||(O.swinging=!0,O.swingTime=0,kt("Player 1 swinging racket!"),vm(Y,tt,De,0,Ae,Re))}function me(Ae){x.current||(kt(`Key pressed: ${Ae.code}`),Ae.code==="Space"?Q():Ae.code==="KeyH"&&JD(I,Y))}const xe=new k1;let we=0,Ce=0,Ke=performance.now(),Oe=60,xt=null,Dt=!1,it=0;function V(){var tt;if(xt=requestAnimationFrame(V),x.current){xe.getDelta(),de.render(C,H);return}const Ae=Math.min(xe.getDelta(),.1);we+=Ae,Ce++;const Re=performance.now();if(Re-Ke>=1e3&&(Oe=Math.round(Ce*1e3/(Re-Ke)),Ce=0,Ke=Re,Oe<30&&b.current.debug&&console.warn(`Low FPS detected: ${Oe} FPS - AI may struggle in deployment`)),b.current.debug&&we>5&&(kt(`Animation loop running... FPS: ${Oe}, Delta: ${Ae.toFixed(3)}s`),we=0),GN(b.current,E.current,xe),BN(Y,b.current,Ae,xe,I),v.current)try{const De=v.current.step({p1Swing:Dt});if(Dt=!1,window.__WIBBLY_MAGNETITE__=De,it+=Ae,it>=.25){it=0;try{(tt=N.current)==null||tt.call(N,De)}catch(O){console.warn("onAuthority handler threw:",O)}}}catch(De){console.warn("magnetite authority step failed; dropping it:",De),v.current=null,window.__WIBBLY_MAGNETITE__={ready:!1,error:String(De&&De.message?De.message:De)}}WN(I,b.current,E.current,Y),qN(I,b.current,E.current,Y),I.forEach((De,O)=>{const D=E.current[O];ZD(De,D,Ae),De.rotation.y=O===0?Math.PI/2:-Math.PI/2,QD(De,D,Y,b.current,O),$D(De,D,Ae,O)}),ce(I[0],Y,b.current),de.render(C,H)}b.current.usePoseDetection?(kt("Starting gesture input setup..."),Se()):(ct=A.current)==null||ct.call(A,"keyboard"),Ne(),Zp()||YD().then(Ae=>{var Re;if(!R){v.current=Ae,window.__WIBBLY_MAGNETITE__=Ae.telemetry();try{(Re=N.current)==null||Re.call(N,Ae.telemetry())}catch(tt){console.warn("onAuthority handler threw:",tt)}}}).catch(Ae=>{console.warn("magnetite authority failed to start:",Ae),window.__WIBBLY_MAGNETITE__={ready:!1,error:String(Ae&&Ae.message?Ae.message:Ae)}}),re(),V(),window.addEventListener("keydown",me),de.domElement.addEventListener("click",re);const on=()=>{H.aspect=window.innerWidth/window.innerHeight,H.updateProjectionMatrix(),de.setSize(window.innerWidth,window.innerHeight)};return window.addEventListener("resize",on),()=>{var Ae;R=!0,xt!==null&&cancelAnimationFrame(xt),window.removeEventListener("keydown",me),window.removeEventListener("resize",on),de.domElement.removeEventListener("click",re),de.dispose(),Cy(C),m.current&&(m.current.stop(),m.current=null),F(null),g.current&&(g.current.close(),g.current=null),v.current=null,typeof window<"u"&&delete window.__WIBBLY_MAGNETITE__,(Ae=f.current)==null||Ae.removeChild(de.domElement)}},[]),M.createElement(M.Fragment,null,M.createElement("div",{ref:f,className:"wb-gamecanvas"}),M.createElement("style",null,`
                .wb-gamecanvas {
                    width: 100%;
                    height: 100vh;
                    height: 100dvh;
                }
            `),P&&M.createElement(HD,{input:P,calibration:S.current,players:k}))}const Tu="player_1",$N=({name:r})=>{const e={fill:"none",stroke:"currentColor",strokeWidth:1.6,strokeLinecap:"round",strokeLinejoin:"round"};return M.createElement("svg",{viewBox:"0 0 20 20",className:"tab-glyph","aria-hidden":"true"},r==="controls"&&M.createElement(M.Fragment,null,M.createElement("rect",{x:"2",y:"6",width:"16",height:"9",rx:"3.5",...e}),M.createElement("path",{d:"M6 10.5 h2.6 M7.3 9.2 v2.6 M12.6 9.8 h.01 M14.2 11.4 h.01",...e})),r==="camera"&&M.createElement(M.Fragment,null,M.createElement("path",{d:"M2.5 7 h3l1.2-1.8h4.6L12.5 7h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-14a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z",...e}),M.createElement("circle",{cx:"9.5",cy:"11",r:"2.8",...e})),r==="settings"&&M.createElement(M.Fragment,null,M.createElement("circle",{cx:"10",cy:"10",r:"2.6",...e}),M.createElement("path",{d:"M10 2.5v2.2M10 15.3v2.2M17.5 10h-2.2M4.7 10H2.5M15.3 4.7l-1.6 1.6M6.3 13.7l-1.6 1.6M15.3 15.3l-1.6-1.6M6.3 6.3 4.7 4.7",...e})),r==="help"&&M.createElement(M.Fragment,null,M.createElement("circle",{cx:"10",cy:"10",r:"7.5",...e}),M.createElement("path",{d:"M7.8 7.8a2.2 2.2 0 1 1 2.9 2.1c-.5.2-.7.6-.7 1.1v.4",...e}),M.createElement("path",{d:"M10 14.4h.01",...e})))},QN=[{id:"controls",label:"Controls"},{id:"camera",label:"Camera"},{id:"settings",label:"Settings"},{id:"help",label:"Help"}],JN=[{id:"follow",name:"Follow cam",description:"Chase camera that tracks behind your player and the ball.",built:!0},{id:"orbital",name:"Free camera",description:"Orbit and zoom with the mouse. No orbital controller exists in the game yet.",built:!1},{id:"fixed",name:"Fixed",description:"Static camera behind the baseline. Not implemented.",built:!1}],Gr=({label:r,note:e,children:t})=>M.createElement("div",{className:"setting-item is-planned wb-blueprint"},M.createElement("div",{className:"planned-head"},M.createElement("span",{className:"planned-label"},r),M.createElement("span",{className:"planned-tag"},"not built")),M.createElement("div",{className:"planned-control"},t,M.createElement("span",{className:"planned-note"},e))),eL=({isOpen:r,onClose:e,onCameraChange:t,currentCamera:i="follow",gameSettings:s,onSettingsChange:l,calibration:u=null,cameraStatus:f="unknown",onRestart:d,onQuit:h})=>{const[m,g]=G.useState("controls"),[v,b]=G.useState(!1),[E,S]=G.useState(()=>u?u.handednessFor(Tu):"right"),x=G.useRef(null),y=G.useRef(null),T=G.useRef(null),N=G.useRef(null);G.useEffect(()=>{!r&&v&&b(!1)},[r,v]),G.useEffect(()=>{r&&u&&S(u.handednessFor(Tu))},[r,u]),G.useEffect(()=>{var z;if(r)return T.current=document.activeElement,(z=y.current)==null||z.focus(),()=>{const R=T.current;R&&typeof R.focus=="function"&&document.contains(R)&&R.focus(),T.current=null}},[r]),G.useEffect(()=>{if(!r)return;const z=R=>{if(R.key!=="Tab"||!x.current)return;const C=x.current.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');if(C.length===0)return;const H=C[0],J=C[C.length-1];R.shiftKey&&document.activeElement===H?(R.preventDefault(),J.focus()):!R.shiftKey&&document.activeElement===J&&(R.preventDefault(),H.focus())};return document.addEventListener("keydown",z),()=>document.removeEventListener("keydown",z)},[r]),G.useEffect(()=>()=>{N.current&&clearTimeout(N.current)},[]);const A=G.useMemo(()=>Array.from({length:22},(z,R)=>({id:R,x:Math.random()*100,size:Math.random()*2.6+1.4,duration:Math.random()*12+11,delay:Math.random()*-20,opacity:Math.random()*.3+.08})),[]),P=()=>{b(!0),N.current=setTimeout(()=>{N.current=null,e==null||e()},220)},F=z=>{u==null||u.setHandedness(Tu,z),S(z)},k=()=>{switch(m){case"controls":return M.createElement("div",{className:"tab-content"},M.createElement("header",{className:"content-header"},M.createElement("p",{className:"content-eyebrow"},"Tab 01"),M.createElement("h3",null,"Controls"),M.createElement("hr",{className:"wb-rule"})),M.createElement("div",{className:"controls-grid"},M.createElement("section",{className:"panel"},M.createElement("h4",null,"Tennis"),M.createElement("div",{className:"control-list"},M.createElement("div",{className:"control-item"},M.createElement("span",{className:"control-key"},"Space"),M.createElement("span",{className:"control-desc"},"Serve, and swing the racket")),M.createElement("div",{className:"control-item"},M.createElement("span",{className:"control-key"},"Arm swing"),M.createElement("span",{className:"control-desc"},"Same as Space, detected from your camera")),M.createElement("div",{className:"control-item"},M.createElement("span",{className:"control-key"},"Click"),M.createElement("span",{className:"control-desc"},"Restart the match")))),M.createElement("section",{className:"panel"},M.createElement("h4",null,"System"),M.createElement("div",{className:"control-list"},M.createElement("div",{className:"control-item"},M.createElement("span",{className:"control-key"},"Esc"),M.createElement("span",{className:"control-desc"},"Open and close this menu (pauses the match)")),M.createElement("div",{className:"control-item"},M.createElement("span",{className:"control-key"},"H"),M.createElement("span",{className:"control-desc"},"Toggle collision hit boxes"))),M.createElement("p",{className:"section-note"},"The mouse does not move the camera: tennis ships one camera and it drives itself."))));case"camera":return M.createElement("div",{className:"tab-content"},M.createElement("header",{className:"content-header"},M.createElement("p",{className:"content-eyebrow"},"Tab 02"),M.createElement("h3",null,"Camera"),M.createElement("hr",{className:"wb-rule"})),M.createElement("section",{className:"panel"},M.createElement("h4",null,"Your webcam"),M.createElement("div",{className:`status-row status-row--${f}`},M.createElement("span",{className:"status-dot"}),M.createElement("span",{className:"status-text"},f==="live"&&"Gesture tracking is running in this tab.",f==="keyboard"&&"No camera — playing on the spacebar.",f==="unknown"&&"Camera state unknown until the pipeline reports in.")),M.createElement("div",{className:"hand-row"},M.createElement("span",{className:"hand-label"},"Racket hand"),M.createElement("div",{className:"hand-toggle",role:"group","aria-label":"Handedness"},["left","right"].map(z=>M.createElement("button",{key:z,type:"button",className:E===z?"is-active":"",onClick:()=>F(z),disabled:!u,"aria-pressed":E===z},z==="left"?"Left":"Right")))),M.createElement("p",{className:"section-note"},"Written to Calibration for ",M.createElement("code",null,Tu),"; the swing recogniser picks it up on the next frame, mid-rally. No restart needed.")),M.createElement("section",{className:"panel"},M.createElement("h4",null,"View perspective"),M.createElement("div",{className:"camera-options"},JN.map(z=>{const R=i===z.id,C=z.built&&typeof t=="function"&&!R;return M.createElement("div",{key:z.id,className:["camera-option",R?"active":"",z.built?"":"is-planned wb-blueprint"].join(" "),role:C?"button":void 0,tabIndex:C?0:void 0,"aria-disabled":!z.built,onClick:()=>C&&t(z.id)},M.createElement("div",{className:`radio-button ${R?"checked":""}`},M.createElement("div",{className:"radio-inner"})),M.createElement("div",{className:"camera-info"},M.createElement("div",{className:"camera-name"},z.name,!z.built&&M.createElement("span",{className:"planned-tag"},"not built"),R&&M.createElement("span",{className:"live-tag"},"running")),M.createElement("div",{className:"camera-desc"},z.description)))})),M.createElement(Gr,{label:"Field of view",note:"The game does not expose its camera yet."},M.createElement("input",{type:"range",min:"45",max:"120",defaultValue:"75",disabled:!0})),M.createElement(Gr,{label:"Camera smoothing",note:"Smoothing is a constant in game.jsx."},M.createElement("input",{type:"range",min:"0",max:"1",step:"0.1",defaultValue:"0.5",disabled:!0}))));case"settings":return M.createElement("div",{className:"tab-content"},M.createElement("header",{className:"content-header"},M.createElement("p",{className:"content-eyebrow"},"Tab 03"),M.createElement("h3",null,"Settings"),M.createElement("hr",{className:"wb-rule"})),M.createElement("div",{className:"settings-grid"},M.createElement("section",{className:"panel"},M.createElement("h4",null,"Input"),M.createElement("div",{className:"setting-item toggle-item"},M.createElement("span",{className:"setting-label"},"Camera gesture input"),M.createElement("label",{className:"toggle"},M.createElement("input",{type:"checkbox",checked:(s==null?void 0:s.usePoseDetection)??!0,onChange:z=>l==null?void 0:l("usePoseDetection",z.target.checked)}),M.createElement("span",{className:"toggle-slider"}))),M.createElement("p",{className:"section-note"},"Turning this off releases the camera entirely and leaves the spacebar. Either way the match restarts, because the pipeline is built once when the game mounts."),M.createElement("div",{className:"setting-item toggle-item"},M.createElement("span",{className:"setting-label"},"Debug logging"),M.createElement("label",{className:"toggle"},M.createElement("input",{type:"checkbox",checked:(s==null?void 0:s.debug)??!1,onChange:z=>l==null?void 0:l("debug",z.target.checked)}),M.createElement("span",{className:"toggle-slider"}))),M.createElement("p",{className:"section-note"},"Frame timing, AI decisions and ball state to the browser console. Also restarts the match.")),M.createElement("section",{className:"panel panel--blueprint"},M.createElement("h4",null,"Not wired up yet",M.createElement("span",{className:"panel-count wb-mono"},"05")),M.createElement("p",{className:"section-note section-note--top"},"These exist in the design and nowhere in the code. They are drawn so the shape of the menu is honest about what is missing, and disabled so they cannot lie."),M.createElement(Gr,{label:"Difficulty",note:"The AI opponent has no difficulty parameter."},M.createElement("select",{disabled:!0,defaultValue:"medium"},M.createElement("option",{value:"medium"},"Medium"))),M.createElement(Gr,{label:"AI opponent",note:"Both players are always AI-driven."},M.createElement("span",{className:"toggle is-disabled"},M.createElement("input",{type:"checkbox",checked:!0,readOnly:!0,disabled:!0}),M.createElement("span",{className:"toggle-slider"}))),M.createElement(Gr,{label:"Graphics quality",note:"The renderer has no quality tiers."},M.createElement("select",{disabled:!0,defaultValue:"high"},M.createElement("option",{value:"high"},"High"))),M.createElement(Gr,{label:"Shadows",note:"Shadow maps are on unconditionally."},M.createElement("span",{className:"toggle is-disabled"},M.createElement("input",{type:"checkbox",checked:!0,readOnly:!0,disabled:!0}),M.createElement("span",{className:"toggle-slider"}))),M.createElement(Gr,{label:"Anti-aliasing",note:"Set once at renderer construction."},M.createElement("span",{className:"toggle is-disabled"},M.createElement("input",{type:"checkbox",checked:!0,readOnly:!0,disabled:!0}),M.createElement("span",{className:"toggle-slider"}))))));case"help":return M.createElement("div",{className:"tab-content"},M.createElement("header",{className:"content-header"},M.createElement("p",{className:"content-eyebrow"},"Tab 04"),M.createElement("h3",null,"How to play"),M.createElement("hr",{className:"wb-rule"})),M.createElement("div",{className:"help-content"},M.createElement("section",{className:"panel"},M.createElement("h4",null,"Getting started"),M.createElement("ol",{className:"help-list"},M.createElement("li",null,"Stand where your head, shoulders and hips are all in frame."),M.createElement("li",null,"Press ",M.createElement("kbd",null,"Space")," to serve."),M.createElement("li",null,"Swing your racket arm — or press ",M.createElement("kbd",null,"Space")," — to return the ball."),M.createElement("li",null,"Timing is the whole game: your player moves to the ball on its own."))),M.createElement("section",{className:"panel"},M.createElement("h4",null,"Camera setup"),M.createElement("ul",{className:"help-list"},M.createElement("li",null,"Roughly two metres back, facing the camera."),M.createElement("li",null,"Light on your face, not behind you — backlight destroys tracking confidence."),M.createElement("li",null,"One person in frame. Tennis routes only the first tracked player to the racket."))),M.createElement("section",{className:"panel"},M.createElement("h4",null,"If tracking misbehaves"),M.createElement("ul",{className:"help-list"},M.createElement("li",null,"Check the racket hand above — a mirrored setting turns forehands into backhands."),M.createElement("li",null,"Swing from the shoulder. The detector watches wrist velocity, not wrist position."),M.createElement("li",null,"If the camera fails outright, the spacebar plays the whole game."))),M.createElement("section",{className:"panel panel--blueprint"},M.createElement("h4",null,"What this build is not"),M.createElement("ul",{className:"help-list help-list--planned"},M.createElement("li",null,"One gesture only: a swing. No punch, pinch or point."),M.createElement("li",null,"One player to the racket, even though the tracker binds two."),M.createElement("li",null,"No network play, no lobbies, no scores kept between sessions.")))));default:return null}};return r?M.createElement("div",{className:`menu-overlay ${v?"closing":""}`,role:"dialog","aria-modal":"true","aria-label":"Game menu"},M.createElement("div",{className:"sparks-container","aria-hidden":"true"},A.map(z=>M.createElement("div",{key:z.id,className:"spark",style:{left:`${z.x}%`,width:`${z.size}px`,height:`${z.size}px`,opacity:z.opacity,animationDuration:`${z.duration}s`,animationDelay:`${z.delay}s`}}))),M.createElement("div",{className:"menu-container wb-bracket is-live",ref:x},M.createElement("header",{className:"menu-header"},M.createElement("div",{className:"menu-title"},M.createElement("span",{className:"menu-eyebrow"},M.createElement("span",{className:"menu-pausebars","aria-hidden":"true"}),"Paused"),M.createElement("span",{className:"title-text"},"Game menu")),M.createElement("button",{className:"close-btn",ref:y,onClick:P,"aria-label":"Resume game"},M.createElement("svg",{viewBox:"0 0 16 16","aria-hidden":"true"},M.createElement("path",{d:"M4 4 L12 12 M12 4 L4 12",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round"})))),M.createElement("div",{className:"menu-body"},M.createElement("nav",{className:"menu-tabs","aria-label":"Menu sections"},QN.map(z=>M.createElement("button",{key:z.id,className:`tab-btn ${m===z.id?"active":""}`,onClick:()=>g(z.id),"aria-current":m===z.id?"page":void 0},M.createElement($N,{name:z.id}),M.createElement("span",{className:"tab-label"},z.label)))),M.createElement("div",{className:"menu-content"},k())),M.createElement("footer",{className:"menu-footer"},M.createElement("div",{className:"footer-left"},h&&M.createElement("button",{className:"footer-btn",onClick:h},"Quit to title"),d&&M.createElement("button",{className:"footer-btn",onClick:d},"Restart match")),M.createElement("button",{className:"apply-btn",onClick:P},M.createElement("span",{className:"btn-text"},"Resume"),M.createElement("span",{className:"btn-key"},"Esc")))),M.createElement("style",null,`
        .menu-overlay {
          position: fixed; inset: 0; z-index: 10000;
          display: flex; align-items: center; justify-content: center;
          padding: clamp(.75rem, 3vw, 2rem);
          background:
            radial-gradient(ellipse at center, rgba(23, 18, 33, .72) 0%, rgba(8, 6, 16, .95) 100%);
          -webkit-backdrop-filter: blur(12px);
          backdrop-filter: blur(12px);
          overflow: hidden;
          font-family: var(--sans, system-ui, sans-serif);
          animation: menuOpen .28s var(--ease, cubic-bezier(.22,.61,.36,1));
        }
        .menu-overlay.closing { animation: menuClose .22s ease-in forwards; }
        @keyframes menuOpen { from { opacity: 0; } to { opacity: 1; } }
        @keyframes menuClose { from { opacity: 1; } to { opacity: 0; } }

        .sparks-container { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .spark {
          position: absolute; bottom: -10px; border-radius: 50%;
          background: var(--accent, #FF4D9D);
          box-shadow: 0 0 8px var(--accent-glow, rgba(255,77,157,.26));
          animation: spark-rise linear infinite;
        }
        @keyframes spark-rise { from { transform: translateY(0); } to { transform: translateY(-110vh); } }

        /* ── Container ──────────────────────────────────────────────────── */

        .menu-container {
          width: 100%; max-width: 1000px;
          max-height: 88vh; max-height: 88dvh;
          display: flex; flex-direction: column; overflow: hidden;
          background: linear-gradient(162deg, var(--bg-secondary, #171221), var(--bg-primary, #110D17));
          border-radius: var(--r-xl, 24px);
          border: 1px solid var(--border-strong, #3D3253);
          box-shadow: var(--shadow-lg, 0 30px 80px -24px rgba(0,0,0,.88));
          animation: containerSlide .34s var(--ease, cubic-bezier(.22,.61,.36,1));
        }
        @keyframes containerSlide {
          from { transform: translateY(14px) scale(.985); opacity: 0; }
          to { transform: none; opacity: 1; }
        }

        /* ── Header ─────────────────────────────────────────────────────── */

        .menu-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.35rem 1.6rem 1.15rem;
          border-bottom: 1px solid var(--border, #251E33);
        }
        .menu-title { display: flex; flex-direction: column; gap: .3rem; }
        .menu-eyebrow {
          display: inline-flex; align-items: center; gap: .45rem;
          font-family: var(--mono, monospace); font-size: .62rem; font-weight: 700;
          letter-spacing: .24em; text-transform: uppercase;
          color: var(--accent, #FF4D9D);
        }
        /* Two bars — the pause glyph, drawn rather than typed. */
        .menu-pausebars {
          width: 9px; height: 10px; flex: none;
          background: linear-gradient(90deg, currentColor 0 3px, transparent 3px 6px, currentColor 6px 9px);
        }
        .title-text {
          font-family: var(--display, system-ui, sans-serif);
          font-weight: 700;
          font-stretch: 112%;
          font-size: 1.65rem; letter-spacing: -.03em; line-height: 1.05;
          color: var(--text, #F4F0F8);
        }

        .close-btn {
          display: grid; place-items: center;
          width: 2.3rem; height: 2.3rem; padding: 0;
          background: transparent;
          border: 1px solid var(--border-strong, #3D3253);
          border-radius: 50%;
          color: var(--text-2, #A99FB8);
          cursor: pointer; transition: all .22s var(--ease, ease);
        }
        .close-btn svg { width: 15px; height: 15px; }
        .close-btn:hover {
          color: var(--accent, #FF4D9D);
          border-color: var(--accent, #FF4D9D);
          transform: rotate(90deg);
        }

        /* ── Body: tab rail + content ───────────────────────────────────── */

        .menu-body { display: grid; grid-template-columns: 190px minmax(0, 1fr); flex: 1; min-height: 0; }

        .menu-tabs {
          display: flex; flex-direction: column; gap: .15rem;
          padding: 1rem .7rem;
          border-right: 1px solid var(--border, #251E33);
          background: rgba(8,6,16,.35);
        }
        .tab-btn {
          display: flex; align-items: center; gap: .65rem;
          padding: .6rem .7rem;
          background: transparent; border: 0; border-radius: var(--r-sm, 6px);
          border-left: 2px solid transparent;
          color: var(--text-3, #6F6580);
          font-family: var(--mono, monospace); font-size: .68rem; font-weight: 600;
          letter-spacing: .14em; text-transform: uppercase;
          cursor: pointer; text-align: left;
          transition: color .18s var(--ease, ease), background .18s var(--ease, ease),
                      border-color .18s var(--ease, ease);
        }
        .tab-btn:hover { color: var(--text-2, #A99FB8); background: rgba(255,255,255,.02); }
        .tab-btn.active {
          color: var(--text, #F4F0F8);
          background: var(--accent-dim, rgba(255,77,157,.13));
          border-left-color: var(--accent, #FF4D9D);
        }
        .tab-glyph { width: 17px; height: 17px; flex: none; }
        .tab-btn.active .tab-glyph { color: var(--accent, #FF4D9D); }

        .menu-content { overflow-y: auto; padding: 1.5rem 1.6rem; min-height: 0; }

        /* ── Content headers ────────────────────────────────────────────── */

        .content-header { margin-bottom: 1.35rem; }
        .content-eyebrow {
          margin: 0 0 .3rem;
          font-family: var(--mono, monospace); font-size: .6rem; font-weight: 600;
          letter-spacing: .24em; text-transform: uppercase; color: var(--text-4, #4B4359);
        }
        .content-header h3 {
          margin: 0 0 .7rem;
          font-family: var(--display, system-ui, sans-serif);
          font-weight: 700;
          font-stretch: 110%;
          font-size: 1.4rem; letter-spacing: -.03em; color: var(--text, #F4F0F8);
        }
        .wb-rule {
          height: 1px; border: 0; margin: 0;
          background: linear-gradient(90deg,
            var(--accent, #FF4D9D) 0, var(--accent, #FF4D9D) 42px,
            var(--border, #251E33) 42px, var(--border, #251E33) 100%);
        }

        /* ── Panels ─────────────────────────────────────────────────────── */

        .controls-grid, .settings-grid, .help-content {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 1rem;
        }
        .panel {
          background: var(--bg-elevated, #1D1729);
          border: 1px solid var(--border, #251E33);
          border-radius: var(--r-lg, 16px);
          padding: 1.15rem;
        }
        .panel + .panel { margin-top: 1rem; }
        /* A whole panel of unbuilt things gets a muted surface so it recedes
           behind the panels that actually do something. */
        .panel--blueprint { background: rgba(8,6,16,.4); border-style: dashed; }

        .panel h4 {
          display: flex; align-items: center; justify-content: space-between; gap: .5rem;
          margin: 0 0 .9rem;
          font-family: var(--mono, monospace); font-size: .66rem; font-weight: 700;
          letter-spacing: .2em; text-transform: uppercase; color: var(--text-2, #A99FB8);
        }
        .panel-count { color: var(--text-4, #4B4359); font-size: .66rem; letter-spacing: .1em; }

        /* ── Controls list ──────────────────────────────────────────────── */

        .control-list { display: flex; flex-direction: column; gap: .4rem; }
        .control-item {
          display: flex; align-items: center; gap: .9rem;
          padding: .6rem .75rem;
          background: var(--bg-sunken, #080610);
          border: 1px solid var(--border, #251E33);
          border-radius: var(--r-md, 10px);
        }
        /* Key caps are live inputs — they may wear the accent. */
        .control-key {
          flex: none; min-width: 96px; text-align: center;
          font-family: var(--mono, monospace); font-size: .66rem; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase;
          color: var(--accent, #FF4D9D);
          background: var(--accent-dim, rgba(255,77,157,.13));
          border: 1px solid var(--accent-line, rgba(255,77,157,.34));
          padding: .3rem .5rem; border-radius: 5px;
        }
        .control-desc { color: var(--text-2, #A99FB8); font-size: .86rem; line-height: 1.4; }

        .section-note {
          margin: .85rem 0 0; padding-left: .8rem;
          border-left: 2px solid var(--border-strong, #3D3253);
          color: var(--text-3, #6F6580); font-size: .78rem; line-height: 1.5;
        }
        .section-note--top { margin: 0 0 .9rem; }
        .section-note code {
          font-family: var(--mono, monospace); font-size: .74rem; color: var(--text-2, #A99FB8);
        }

        /* ── Camera status ──────────────────────────────────────────────── */

        .status-row {
          display: flex; align-items: center; gap: .6rem; margin-bottom: 1rem;
          padding: .6rem .75rem; border-radius: var(--r-md, 10px);
          background: var(--bg-sunken, #080610);
          border: 1px solid var(--border, #251E33);
          color: var(--text-3, #6F6580);
        }
        .status-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: currentColor; }
        .status-row--live { color: var(--shipped, #4ADE80); border-color: var(--shipped-line, rgba(74,222,128,.3)); }
        .status-row--live .status-dot { box-shadow: 0 0 10px currentColor; }
        .status-row--keyboard { color: var(--planned, #FFB020); border-color: var(--planned-line, rgba(255,176,32,.32)); }
        .status-text { color: var(--text-2, #A99FB8); font-size: .85rem; }

        .hand-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
        .hand-label { color: var(--text, #F4F0F8); font-weight: 650; font-size: .88rem; }
        .hand-toggle { display: flex; gap: .3rem; }
        .hand-toggle button {
          padding: .42rem .95rem; border-radius: var(--r-sm, 6px);
          border: 1px solid var(--border-strong, #3D3253);
          background: var(--bg-sunken, #080610);
          color: var(--text-3, #6F6580);
          font-family: var(--mono, monospace); font-size: .68rem; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase;
          cursor: pointer; transition: all .18s var(--ease, ease);
        }
        .hand-toggle button:hover:not(:disabled) { color: var(--text, #F4F0F8); }
        .hand-toggle button.is-active {
          background: var(--accent-dim, rgba(255,77,157,.13));
          border-color: var(--accent, #FF4D9D);
          color: var(--accent, #FF4D9D);
        }
        .hand-toggle button:disabled { opacity: .4; cursor: not-allowed; }

        /* ── View perspective ───────────────────────────────────────────── */

        .camera-options { display: flex; flex-direction: column; gap: .5rem; margin-bottom: 1rem; }
        .camera-option {
          display: flex; align-items: flex-start; gap: .85rem; padding: .85rem;
          background: var(--bg-sunken, #080610);
          border: 1px solid var(--border, #251E33);
          border-radius: var(--r-md, 10px);
          transition: all .2s var(--ease, ease);
        }
        .camera-option[role="button"] { cursor: pointer; }
        .camera-option[role="button"]:hover { border-color: var(--border-bright, #52456E); }
        .camera-option.active {
          border-color: var(--accent, #FF4D9D);
          background: var(--accent-dim, rgba(255,77,157,.13));
        }
        .camera-info { flex: 1; min-width: 0; }
        .camera-name {
          display: flex; align-items: center; gap: .5rem; flex-wrap: wrap;
          font-weight: 650; color: var(--text, #F4F0F8); font-size: .92rem; margin-bottom: .2rem;
        }
        .camera-option.is-planned .camera-name { color: var(--text-2, #A99FB8); }
        .camera-desc { color: var(--text-3, #6F6580); font-size: .8rem; line-height: 1.45; }
        .radio-button {
          width: 16px; height: 16px; flex: none; margin-top: .15rem;
          border: 2px solid var(--border-strong, #3D3253); border-radius: 50%;
          display: grid; place-items: center;
        }
        .radio-button.checked { border-color: var(--accent, #FF4D9D); }
        .radio-inner {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--accent, #FF4D9D);
          transform: scale(0); transition: transform .2s var(--ease, ease);
        }
        .radio-button.checked .radio-inner { transform: scale(1); }

        /* ── Tags ───────────────────────────────────────────────────────── */

        .planned-tag {
          font-family: var(--mono, monospace); font-size: .56rem; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase;
          color: var(--planned, #FFB020);
          background: var(--planned-dim, rgba(255,176,32,.1));
          border: 1px solid var(--planned-line, rgba(255,176,32,.32));
          padding: .1rem .4rem; border-radius: 3px;
        }
        .live-tag {
          font-family: var(--mono, monospace); font-size: .56rem; font-weight: 700;
          letter-spacing: .16em; text-transform: uppercase;
          color: var(--shipped, #4ADE80);
          background: var(--shipped-dim, rgba(74,222,128,.1));
          border: 1px solid var(--shipped-line, rgba(74,222,128,.3));
          padding: .1rem .4rem; border-radius: 3px;
        }

        /* ── Settings rows ──────────────────────────────────────────────── */

        .setting-item {
          display: flex; align-items: center; gap: 1rem; justify-content: space-between;
          padding: .7rem .85rem;
          background: var(--bg-sunken, #080610);
          border: 1px solid var(--border, #251E33);
          border-radius: var(--r-md, 10px);
        }
        .setting-item + .setting-item { margin-top: .45rem; }
        .setting-label { color: var(--text, #F4F0F8); font-weight: 650; font-size: .88rem; }

        /* The blueprint row: dashed amber over hatching, laid out as a stack so
           the reason sits directly under the dead control. The .wb-blueprint
           class in style.css supplies the border and hatch; this is only the
           layout. */
        .setting-item.is-planned {
          flex-direction: column; align-items: stretch; gap: .5rem;
        }
        .planned-head { display: flex; align-items: center; justify-content: space-between; gap: .6rem; }
        .planned-label { color: var(--text-2, #A99FB8); font-weight: 650; font-size: .86rem; }
        .planned-control { display: flex; flex-direction: column; gap: .35rem; }
        .planned-note { color: var(--text-3, #6F6580); font-size: .74rem; line-height: 1.4; }

        .setting-item select, .setting-item input[type="range"] { width: 100%; max-width: 240px; }
        .setting-item select {
          padding: .4rem .65rem; border-radius: var(--r-sm, 6px);
          border: 1px solid var(--border-strong, #3D3253);
          background: var(--bg-elevated, #1D1729); color: var(--text-3, #6F6580);
          font-family: var(--mono, monospace); font-size: .76rem;
        }
        .setting-item :disabled { cursor: not-allowed; opacity: .6; }
        /* A dead range slider must not wear the accent: the accent-color
           property would paint its track magenta, which in this product reads
           as "live". */
        .setting-item input[type="range"]:disabled { accent-color: var(--text-4, #4B4359); }

        /* ── Toggles ────────────────────────────────────────────────────── */

        .toggle { position: relative; display: inline-block; width: 44px; height: 23px; flex: none; }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .toggle-slider {
          position: absolute; inset: 0; cursor: pointer;
          background: var(--bg-elevated, #1D1729);
          border: 1px solid var(--border-strong, #3D3253);
          border-radius: 23px; transition: .25s var(--ease, ease);
        }
        .toggle-slider::before {
          content: ""; position: absolute;
          height: 15px; width: 15px; left: 3px; bottom: 3px;
          background: var(--text-3, #6F6580); border-radius: 50%;
          transition: .25s var(--ease, ease);
        }
        .toggle input:checked + .toggle-slider {
          background: var(--accent-dim, rgba(255,77,157,.13));
          border-color: var(--accent, #FF4D9D);
        }
        .toggle input:checked + .toggle-slider::before {
          transform: translateX(21px); background: var(--accent, #FF4D9D);
        }
        /* A disabled control never wears the accent: in this product magenta
           means "live", so a planned toggle goes grey even when it is "on". */
        .toggle.is-disabled { opacity: .55; }
        .toggle.is-disabled .toggle-slider { cursor: not-allowed; }
        .toggle.is-disabled input:checked + .toggle-slider {
          background: var(--bg-elevated, #1D1729);
          border-color: var(--border-strong, #3D3253);
        }
        .toggle.is-disabled input:checked + .toggle-slider::before {
          background: var(--text-4, #4B4359);
        }

        /* ── Help ───────────────────────────────────────────────────────── */

        .help-list {
          margin: 0; padding-left: 1.1rem;
          color: var(--text-2, #A99FB8); font-size: .86rem; line-height: 1.6;
        }
        .help-list li { margin-bottom: .4rem; }
        .help-list li::marker { color: var(--text-4, #4B4359); }
        .help-list--planned li::marker { color: var(--planned, #FFB020); }
        .help-list kbd {
          font-family: var(--mono, monospace); font-size: .68rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          color: var(--accent, #FF4D9D);
          background: var(--accent-dim, rgba(255,77,157,.13));
          border: 1px solid var(--accent-line, rgba(255,77,157,.34));
          padding: .08rem .32rem; border-radius: 4px;
        }

        /* ── Footer ─────────────────────────────────────────────────────── */

        .menu-footer {
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          padding: 1rem 1.6rem;
          border-top: 1px solid var(--border, #251E33);
          background: rgba(8,6,16,.45);
        }
        .footer-left { display: flex; gap: .45rem; flex-wrap: wrap; }
        .footer-btn {
          padding: .55rem .95rem; border-radius: var(--r-md, 10px);
          background: transparent; border: 1px solid var(--border, #251E33);
          color: var(--text-2, #A99FB8);
          font-family: inherit; font-size: .84rem; font-weight: 600;
          cursor: pointer; transition: all .18s var(--ease, ease);
        }
        .footer-btn:hover { color: var(--text, #F4F0F8); border-color: var(--border-bright, #52456E); }

        .apply-btn {
          display: inline-flex; align-items: center; gap: .6rem;
          padding: .7rem 1.5rem; border-radius: var(--r-md, 10px);
          background: var(--accent, #FF4D9D); border: 1px solid var(--accent, #FF4D9D);
          color: var(--accent-ink, #16000A);
          font-family: inherit; font-size: .92rem; font-weight: 700; cursor: pointer;
          box-shadow: 0 10px 30px -12px var(--accent-glow, rgba(255,77,157,.26));
          transition: all .18s var(--ease, ease);
        }
        .apply-btn:hover { background: var(--accent-hover, #FF7FB8); transform: translateY(-1px); }
        .btn-key {
          font-family: var(--mono, monospace); font-size: .62rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          padding: .12rem .38rem; border-radius: 4px;
          background: rgba(22,0,10,.18); border: 1px solid rgba(22,0,10,.3);
        }

        @media (prefers-reduced-motion: reduce) {
          .sparks-container { display: none; }
          .menu-overlay, .menu-container { animation: none; }
          .close-btn:hover { transform: none; }
        }

        @media (max-width: 820px) {
          .menu-container { max-height: 94vh; max-height: 94dvh; }
          .menu-header, .menu-content, .menu-footer { padding-left: 1.1rem; padding-right: 1.1rem; }
          /* The rail becomes a strip above the content on narrow screens. */
          .menu-body { grid-template-columns: 1fr; }
          .menu-tabs {
            flex-direction: row; overflow-x: auto;
            border-right: 0; border-bottom: 1px solid var(--border, #251E33);
            padding: .6rem 1.1rem;
          }
          .tab-btn { border-left: 0; border-bottom: 2px solid transparent; flex: none; }
          .tab-btn.active { border-left: 0; border-bottom-color: var(--accent, #FF4D9D); }
          .controls-grid, .settings-grid, .help-content { grid-template-columns: 1fr; }
          .menu-footer { flex-direction: column-reverse; align-items: stretch; }
          .apply-btn { justify-content: center; }
        }

        @media (max-width: 480px) {
          .tab-label { display: none; }
          .tab-btn { padding: .6rem .75rem; }
        }
      `)):null};function tL(){const r=Fl(),[e]=G.useState(()=>Qy()),t=G.useRef(null);t.current||(t.current=new kl);const[i,s]=G.useState(()=>IS()),[l,u]=G.useState(!1),[f,d]=G.useState("unknown"),[h,m]=G.useState(null),[g,v]=G.useState(0);G.useEffect(()=>{const S=x=>{x.key==="Escape"&&(x.preventDefault(),u(y=>!y))};return window.addEventListener("keydown",S),()=>window.removeEventListener("keydown",S)},[]);const b=G.useCallback((S,x)=>{s(y=>{if(y[S]===x)return y;const T={...y,[S]:x};return FS(T),T}),v(y=>y+1),d("unknown")},[]),E=G.useCallback(()=>{v(S=>S+1),d("unknown"),u(!1)},[]);return e.seen?M.createElement("div",{className:"wb-play"},M.createElement($b,{key:g,paused:l,settings:i,calibration:t.current,onInputState:d,onAuthority:m}),M.createElement("div",{className:"wb-hud"},M.createElement("button",{type:"button",className:"wb-hud__brand",onClick:()=>r("/"),title:"Quit to title"},"wibbly"),M.createElement("span",{className:"wb-hud__divider","aria-hidden":"true"}),M.createElement("span",{className:`wb-hud__status wb-hud__status--${f}`},M.createElement("span",{className:"wb-hud__dot"}),f==="live"&&"camera tracking",f==="keyboard"&&"spacebar only",f==="unknown"&&"starting…"),(h==null?void 0:h.ready)&&M.createElement("span",{className:"wb-hud__mag",title:"A real magnetite AuthoritativeGame (compiled to wasm) is running in this tab as a SingleRoom authority — the bottom rung of magnetite’s topology ladder. It is the authoritative simulation; it does not verify gesture input."},M.createElement("span",{className:"wb-hud__dot"}),"magnetite · tick ",h.tick),M.createElement("button",{type:"button",className:"wb-hud__menu",onClick:()=>u(!0)},"Menu ",M.createElement("span",{className:"wb-hud__key"},"Esc"))),M.createElement(eL,{isOpen:l,onClose:()=>u(!1),currentCamera:"follow",gameSettings:i,onSettingsChange:b,calibration:t.current,cameraStatus:f,onRestart:E,onQuit:()=>r("/")}),M.createElement("style",null,`
        .wb-play {
          position: relative; width: 100%; overflow: hidden;
          /* Safari reports 100vh as the viewport WITHOUT its toolbars, so a
             100vh play surface is taller than the visible area and the page
             scrolls under the chrome. dvh is the correct unit; the vh line
             remains as the fallback for older engines. */
          height: 100vh;
          height: 100dvh;
        }

        /* ── Score bug ────────────────────────────────────────────────────
           One unit rather than three floating chips: brand, a hairline rule,
           the live input readout, then the menu. Reads as broadcast furniture
           laid over the court. */
        .wb-hud {
          position: fixed; top: 16px; left: 16px; z-index: 1000;
          display: flex; align-items: center; gap: .7rem;
          padding: .38rem .42rem .38rem .85rem;
          border-radius: 12px;
          background: rgba(8, 6, 16, .78);
          border: 1px solid var(--border-strong, #3D3253);
          /* Safari requires the -webkit- prefix for backdrop-filter; without it
             the panel is simply flat, which is a graceful degradation. */
          -webkit-backdrop-filter: blur(14px) saturate(1.2);
          backdrop-filter: blur(14px) saturate(1.2);
          font-family: var(--sans, system-ui, sans-serif);
          box-shadow: 0 18px 44px -20px rgba(0,0,0,.9);
        }

        .wb-hud__brand {
          background: none; border: 0; padding: 0;
          color: var(--text, #F4F0F8);
          font-family: var(--display, system-ui, sans-serif);
          font-weight: 800;
          font-stretch: 106%;
          font-size: 1.02rem; letter-spacing: -.035em;
          text-transform: lowercase; cursor: pointer;
          transition: color .18s ease;
        }
        .wb-hud__brand:hover { color: var(--accent, #FF4D9D); }

        .wb-hud__divider {
          width: 1px; height: 18px; flex: none;
          background: var(--border-strong, #3D3253);
        }

        .wb-hud__status {
          display: inline-flex; align-items: center; gap: .4rem;
          font-family: var(--mono, monospace); font-size: .62rem; font-weight: 600;
          letter-spacing: .16em; text-transform: uppercase;
          color: var(--text-3, #6F6580);
        }
        .wb-hud__dot {
          width: 6px; height: 6px; border-radius: 50%; flex: none;
          background: currentColor;
        }
        .wb-hud__status--live { color: var(--shipped, #4ADE80); }
        .wb-hud__status--live .wb-hud__dot {
          box-shadow: 0 0 8px currentColor;
          animation: wb-hudpulse 2.2s ease-in-out infinite;
        }
        .wb-hud__status--keyboard { color: var(--planned, #FFB020); }
        @keyframes wb-hudpulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }

        /* Live magnetite authority readout. Present only in the full app: the
           demo embed cannot compile wasm under its CSP, so the authority never
           runs there and this chip never appears. */
        .wb-hud__mag {
          display: inline-flex; align-items: center; gap: .4rem;
          font-family: var(--mono, monospace); font-size: .62rem; font-weight: 600;
          letter-spacing: .12em; text-transform: uppercase;
          color: var(--accent, #FF4D9D);
          cursor: help;
        }
        .wb-hud__mag .wb-hud__dot {
          box-shadow: 0 0 8px currentColor;
          animation: wb-hudpulse 2.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .wb-hud__mag .wb-hud__dot { animation: none; }
        }
        @media (max-width: 600px) {
          .wb-hud__mag { display: none; }
        }

        .wb-hud__menu {
          display: inline-flex; align-items: center; gap: .45rem;
          padding: .42rem .8rem; border-radius: 8px;
          background: var(--accent, #FF4D9D); border: 0;
          color: var(--accent-ink, #16000A);
          font-family: inherit; font-size: .8rem; font-weight: 700;
          cursor: pointer; transition: background .18s ease;
        }
        .wb-hud__menu:hover { background: var(--accent-hover, #FF7FB8); }
        .wb-hud__key {
          font-family: var(--mono, monospace); font-size: .58rem; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          padding: .12rem .32rem; border-radius: 4px; background: rgba(22,0,10,.2);
        }

        @media (prefers-reduced-motion: reduce) {
          .wb-hud__status--live .wb-hud__dot { animation: none; }
        }

        @media (max-width: 600px) {
          .wb-hud { top: 10px; left: 10px; gap: .5rem; }
          .wb-hud__status, .wb-hud__divider { display: none; }
        }
      `)):M.createElement(Wy,{to:"/setup",replace:!0})}function nL(){return M.createElement("div",{className:"wb-court"},M.createElement("div",{className:"wb-grain","aria-hidden":"true"}),M.createElement("div",{className:"wb-stage wb-404"},M.createElement("div",{className:"wb-404__inner wb-rise"},M.createElement("p",{className:"wb-eyebrow"},"404 — out of bounds"),M.createElement("h1",{className:"wb-wordmark"},"out"),M.createElement("p",{className:"wb-tagline"},"That route does not exist. The ball landed outside the lines."),M.createElement("div",{className:"wb-404__actions"},M.createElement(Fu,{to:"/",className:"wb-btn wb-btn--primary"},"Back to the title screen"),M.createElement(Fu,{to:"/setup",className:"wb-btn wb-btn--ghost"},"Camera setup"))),M.createElement("svg",{className:"wb-404__mark",viewBox:"0 0 300 120","aria-hidden":"true"},M.createElement("path",{d:"M0 92 H300",stroke:"var(--court-line-bright)",strokeWidth:"2"}),M.createElement("path",{d:"M20 78 Q120 10 236 54",fill:"none",stroke:"var(--accent)",strokeWidth:"2",strokeDasharray:"4 6",strokeLinecap:"round",opacity:".55"}),M.createElement("circle",{cx:"248",cy:"60",r:"7",fill:"var(--accent)"}))),M.createElement("style",null,`
        .wb-404 {
          display: flex; flex-direction: column; align-items: flex-start;
          justify-content: center; min-height: 70vh; gap: 2rem;
        }
        .wb-404__inner { display: flex; flex-direction: column; align-items: flex-start; }
        .wb-404__actions { display: flex; gap: .75rem; flex-wrap: wrap; margin-top: 1.75rem; }
        .wb-404__mark { width: min(300px, 70%); height: auto; opacity: .8; }
      `))}const Dy="player_1",Bp="https://github.com/vul-os/wibbly",iL=6,aL=9e4;function rL(){const r=G.useRef(null);r.current||(r.current=new kl(new nb));const[e,t]=G.useState("intro"),[i,s]=G.useState("right"),[l,u]=G.useState(!1),[f,d]=G.useState("unknown"),[h,m]=G.useState(0),[g,v]=G.useState(null),[b,E]=G.useState("hidden"),[S,x]=G.useState(!0);G.useEffect(()=>{const P=()=>{typeof localStorage<"u"&&Ew(localStorage)};return window.addEventListener("pagehide",P),()=>{window.removeEventListener("pagehide",P),P()}},[]);const y=G.useCallback(P=>{s(P),r.current.setHandedness(Dy,P)},[]);G.useEffect(()=>{r.current.setHandedness(Dy,i)},[i]);const T=G.useCallback(P=>{u(!0),x(P),t("playing")},[]),N=G.useCallback(()=>{m(P=>P+1)},[]),A=G.useCallback(P=>{typeof window<"u"&&(window.__WIBBLY_BACKEND__=P),v(P.cspHostile?"Camera tracking cannot run in this page — swing detection is off. Press space to play.":P.preferred?null:"Camera tracking is running without GPU acceleration, so it will be slow to start and laggy. The spacebar always works.")},[]);return G.useEffect(()=>{h>=iL&&b==="hidden"&&E("open")},[h,b]),G.useEffect(()=>{if(e!=="playing"||b!=="hidden")return;const P=setTimeout(()=>E(F=>F==="hidden"?"open":F),aL);return()=>clearTimeout(P)},[e,b]),e==="intro"?M.createElement("div",{className:"wb-demo wb-demo--intro"},M.createElement(Ny,null),M.createElement("div",{className:"wb-demo__card wb-bracket"},M.createElement("div",{className:"wb-demo__cardhead"},M.createElement("div",{className:"wb-demo__slug"},M.createElement("span",{className:"wb-demo__badge"},"Demo"),M.createElement("span",{className:"wb-demo__slugline"})),M.createElement("h1",null,"Tennis, in this tab."),M.createElement("p",{className:"wb-demo__lede"},"Swing your arm and the racket swings. Your webcam is read locally to work out where your body is — ",M.createElement("strong",null,"frames never leave this tab"),", and there is no server here to send them to.")),M.createElement("div",{className:"wb-demo__row"},M.createElement("span",{className:"wb-demo__label"},"Racket hand"),M.createElement("div",{className:"wb-demo__hands"},["left","right"].map(P=>M.createElement("button",{key:P,type:"button",className:`wb-demo__hand ${i===P?"is-active":""}`,"aria-pressed":i===P,onClick:()=>y(P)},P==="left"?"Left":"Right")))),M.createElement("div",{className:"wb-demo__actions"},M.createElement("button",{type:"button",className:"wb-demo__btn wb-demo__btn--primary",disabled:l,onClick:()=>T(!0)},"Turn on my camera & play"),M.createElement("button",{type:"button",className:"wb-demo__btn",disabled:l,onClick:()=>T(!1)},"Play with the spacebar")),M.createElement("p",{className:"wb-demo__fine"},"Your browser will ask for camera permission next — that prompt comes from the browser, not from us, and inside an embedded page it will name the site you are reading. Nothing is recorded and nothing is saved: this demo writes no cookies and no local storage, so it forgets you completely when you close it."),M.createElement("p",{className:"wb-demo__fine wb-demo__fine--muted"},"This is one game driven by one gesture — a swing — from one player, against a local AI. That is the honest extent of it today."," ",M.createElement("a",{href:Bp,target:"_blank",rel:"noopener noreferrer"},"Source and full status table"),"."))):M.createElement("div",{className:"wb-demo wb-demo--playing"},M.createElement(Ny,null),M.createElement($b,{settings:{usePoseDetection:S,debug:!1},calibration:r.current,onInputState:d,onSwing:N,onTrackerBackend:A}),M.createElement("div",{className:"wb-demo__hud"},M.createElement("span",{className:"wb-demo__badge"},"Demo"),M.createElement("span",{className:`wb-demo__status wb-demo__status--${f}`},M.createElement("span",{className:"wb-demo__statusdot"}),f==="live"&&"camera tracking",f==="keyboard"&&"spacebar",f==="unknown"&&"starting…"),M.createElement("a",{className:"wb-demo__link",href:Bp,target:"_blank",rel:"noopener noreferrer"},"Source")),f==="keyboard"&&M.createElement("div",{className:"wb-demo__toast"},"No camera — press ",M.createElement("kbd",null,"space")," to swing. The game is fully playable this way."),f!=="keyboard"&&g&&M.createElement("div",{className:"wb-demo__toast wb-demo__toast--warn",role:"status"},g),b==="open"&&M.createElement(sL,{onClose:()=>E("dismissed")}),b==="dismissed"&&M.createElement("button",{type:"button",className:"wb-demo__reopen",onClick:()=>E("open")},"Play with a friend?"))}function sL({onClose:r}){return M.createElement("aside",{className:"wb-demo__cta",role:"complementary","aria-label":"About multiplayer"},M.createElement("button",{type:"button",className:"wb-demo__ctaclose",onClick:r,"aria-label":"Dismiss"},"×"),M.createElement("p",{className:"wb-demo__ctaeyebrow"},"The ceiling of one browser tab"),M.createElement("h2",null,"What you are playing is solo. A second player is designed, not built."),M.createElement("p",null,"The pose model, the physics and the AI opponent all ran here. Nothing was hosted. Playing against a real person needs the two browsers to find each other — and wibbly's answer to that is peer-to-peer, not a server. Nobody would run it, and nobody would need to."),M.createElement("p",null,"One player's tab holds authority and simulates the match. A ",M.createElement("strong",null,"WebRTC DataChannel")," ","would carry the other player's gesture events across, opened by a one-time exchange — a link or a QR code — instead of a server in the middle."),M.createElement("p",{className:"wb-demo__ctawarn"},M.createElement("strong",null,"In progress, plainly: wibbly multiplayer does not work yet.")," The transport side is built and tested on its own — the peer session, the WebRTC offer/answer handshake, a compact code for putting a connection in a link — with no code path that touches a server anywhere in it. What is missing is a lobby: nothing in wibbly turns that into a screen you can actually use, so there is no invite link and nothing to click yet."),M.createElement("div",{className:"wb-demo__ctalinks"},M.createElement("a",{className:"wb-demo__btn wb-demo__btn--primary",href:Bp,target:"_blank",rel:"noopener noreferrer"},"Source"),M.createElement("button",{type:"button",className:"wb-demo__btn wb-demo__btn--ghost",onClick:r},"Keep playing")))}function Ny(){return M.createElement("style",null,`
      .wb-demo { position: relative; width: 100%; min-height: 100%; }
      .wb-demo * { box-sizing: border-box; }

      .wb-demo--intro {
        display: flex; align-items: center; justify-content: center;
        min-height: 100vh; min-height: 100dvh;
        padding: clamp(.75rem, 3vw, 2rem);
        background:
          radial-gradient(120% 100% at 50% -10%, rgba(255,77,157,.09) 0%, transparent 58%),
          radial-gradient(100% 80% at 50% 0%, #171221 0%, #0B0810 72%);
      }
      /* vh fallback first, dvh where supported — Safari measures vh against the
         viewport with toolbars hidden, which overflows inside an iframe. */
      .wb-demo--playing { width: 100%; height: 100vh; height: 100dvh; overflow: hidden; }

      /* ── The card ───────────────────────────────────────────────────── */

      .wb-demo__card {
        position: relative;
        width: min(560px, 100%);
        display: flex; flex-direction: column; gap: clamp(.9rem, 2.5vw, 1.3rem);
        padding: clamp(1.2rem, 4vw, 2rem);
        border-radius: 16px;
        background: linear-gradient(162deg, #171221, #110D17);
        border: 1px solid var(--border-strong, #3D3253);
        box-shadow: 0 30px 80px -40px rgba(0,0,0,.92);
        color: var(--text, #F4F0F8);
        font-family: var(--sans, system-ui, -apple-system, sans-serif);
      }
      /* Registration brackets, the product's signature. Defined locally so the
         demo card keeps them even in isolation. */
      .wb-demo__card.wb-bracket::before,
      .wb-demo__card.wb-bracket::after {
        content: ''; position: absolute; width: 16px; height: 16px;
        pointer-events: none; border-style: solid;
        border-color: var(--accent, #FF4D9D);
      }
      .wb-demo__card.wb-bracket::before {
        top: -1px; left: -1px; border-width: 2px 0 0 2px; border-top-left-radius: 3px;
      }
      .wb-demo__card.wb-bracket::after {
        bottom: -1px; right: -1px; border-width: 0 2px 2px 0; border-bottom-right-radius: 3px;
      }

      .wb-demo__cardhead { display: flex; flex-direction: column; gap: .55rem; }
      .wb-demo__slug { display: flex; align-items: center; gap: .6rem; }
      .wb-demo__slugline {
        flex: 1; height: 1px;
        background: linear-gradient(90deg, var(--border-strong, #3D3253), transparent);
      }
      .wb-demo__card h1 {
        margin: 0;
        font-family: var(--display, system-ui, sans-serif);
        font-weight: 800;
        font-stretch: 114%;
        font-size: clamp(1.65rem, 5.5vw, 2.35rem);
        letter-spacing: -.04em; line-height: 1;
      }
      .wb-demo__lede {
        margin: 0; color: var(--text-2, #A99FB8);
        font-size: clamp(.88rem, 2.4vw, .97rem); line-height: 1.58;
      }
      .wb-demo__lede strong { color: var(--text, #F4F0F8); font-weight: 650; }

      .wb-demo__badge {
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .58rem; font-weight: 700;
        letter-spacing: .2em; text-transform: uppercase;
        padding: .2rem .5rem; border-radius: 3px;
        color: var(--accent, #FF4D9D);
        border: 1px solid var(--accent-line, rgba(255,77,157,.34));
        background: var(--accent-dim, rgba(255,77,157,.1));
      }

      /* ── Racket hand ────────────────────────────────────────────────── */

      .wb-demo__row {
        display: flex; align-items: center; gap: .85rem; flex-wrap: wrap;
        padding: .7rem .8rem; border-radius: 10px;
        background: var(--bg-sunken, #080610);
        border: 1px solid var(--border, #251E33);
      }
      .wb-demo__label {
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .6rem; font-weight: 700;
        letter-spacing: .18em; text-transform: uppercase;
        color: var(--text-3, #6F6580);
      }
      .wb-demo__hands { display: flex; gap: .3rem; margin-left: auto; }
      .wb-demo__hand {
        padding: .4rem .95rem; border-radius: 6px;
        border: 1px solid var(--border-strong, #3D3253);
        background: var(--bg-elevated, #1D1729);
        color: var(--text-3, #6F6580);
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .68rem; font-weight: 700;
        letter-spacing: .12em; text-transform: uppercase;
        cursor: pointer; transition: all .16s ease;
      }
      .wb-demo__hand:hover { color: var(--text, #F4F0F8); border-color: var(--border-bright, #52456E); }
      .wb-demo__hand.is-active {
        border-color: var(--accent, #FF4D9D);
        color: var(--accent, #FF4D9D);
        background: var(--accent-dim, rgba(255,77,157,.12));
      }

      /* ── Actions ────────────────────────────────────────────────────── */

      .wb-demo__actions { display: flex; gap: .5rem; flex-wrap: wrap; }
      .wb-demo__btn {
        display: inline-flex; align-items: center; justify-content: center;
        padding: .68rem 1.2rem; border-radius: 9px;
        border: 1px solid var(--border-strong, #3D3253);
        background: var(--bg-elevated, #1D1729);
        color: var(--text, #F4F0F8);
        font: inherit; font-size: .88rem; font-weight: 650;
        cursor: pointer; text-decoration: none; transition: all .16s ease;
      }
      .wb-demo__btn:hover { border-color: var(--border-bright, #52456E); }
      .wb-demo__btn--primary {
        background: var(--accent, #FF4D9D); border-color: var(--accent, #FF4D9D);
        color: var(--accent-ink, #16000A); font-weight: 700;
        box-shadow: 0 10px 30px -12px var(--accent-glow, rgba(255,77,157,.26));
      }
      .wb-demo__btn--primary:hover {
        background: var(--accent-hover, #FF7FB8); border-color: var(--accent-hover, #FF7FB8);
      }
      .wb-demo__btn--ghost { background: none; border-color: transparent; color: var(--text-3, #6F6580); }
      .wb-demo__btn:disabled { opacity: .55; cursor: default; }

      .wb-demo__fine { margin: 0; color: var(--text-3, #6F6580); font-size: .75rem; line-height: 1.58; }
      .wb-demo__fine--muted { padding-top: .8rem; border-top: 1px solid var(--border, #251E33); }
      .wb-demo__fine a { color: var(--accent, #FF4D9D); }

      /* ── In-play chrome ─────────────────────────────────────────────── */

      .wb-demo__hud {
        position: absolute; top: 12px; left: 12px; z-index: 1000;
        display: flex; align-items: center; gap: .6rem;
        padding: .34rem .7rem .34rem .5rem; border-radius: 10px;
        background: rgba(8,6,16,.8);
        border: 1px solid var(--border-strong, #3D3253);
        /* Safari needs the prefix; without it the bar is simply opaque. */
        -webkit-backdrop-filter: blur(12px);
        backdrop-filter: blur(12px);
        font-family: var(--sans, system-ui, sans-serif);
      }
      .wb-demo__status {
        display: inline-flex; align-items: center; gap: .38rem;
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .58rem; font-weight: 600;
        letter-spacing: .16em; text-transform: uppercase;
        color: var(--text-3, #6F6580);
      }
      .wb-demo__statusdot {
        width: 5px; height: 5px; border-radius: 50%; flex: none; background: currentColor;
      }
      .wb-demo__status--live { color: var(--shipped, #4ADE80); }
      .wb-demo__status--live .wb-demo__statusdot {
        box-shadow: 0 0 7px currentColor;
        animation: wb-demopulse 2.2s ease-in-out infinite;
      }
      .wb-demo__status--keyboard { color: var(--planned, #FFB020); }
      @keyframes wb-demopulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }

      .wb-demo__link {
        color: var(--text-3, #6F6580); font-size: .7rem; text-decoration: none;
      }
      .wb-demo__link:hover { color: var(--text, #F4F0F8); }

      .wb-demo__toast {
        position: absolute; left: 50%; bottom: 16px; transform: translateX(-50%);
        z-index: 1000; max-width: calc(100% - 24px);
        display: flex; align-items: center; gap: .4rem;
        padding: .55rem .95rem; border-radius: 8px;
        background: rgba(8,6,16,.9);
        border: 1px solid var(--border-strong, #3D3253);
        color: var(--text-2, #A99FB8);
        font-family: var(--sans, system-ui, sans-serif); font-size: .78rem;
        text-align: center;
      }
      .wb-demo__toast--warn {
        border-color: var(--planned-line, rgba(255,176,32,.32));
        color: var(--planned, #FFB020);
      }
      .wb-demo__toast kbd {
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .68rem; font-weight: 700;
        letter-spacing: .1em; text-transform: uppercase;
        padding: .08rem .34rem; border-radius: 4px;
        background: var(--accent-dim, rgba(255,77,157,.13));
        border: 1px solid var(--accent-line, rgba(255,77,157,.34));
        color: var(--accent, #FF4D9D);
      }

      /* ── multiplayer note ───────────────────────────────────────────── */

      .wb-demo__cta {
        position: absolute; z-index: 1200;
        right: 12px; bottom: 12px; width: min(400px, calc(100% - 24px));
        max-height: min(78dvh, 660px); overflow-y: auto;
        padding: 1.15rem;
        border-radius: 14px;
        background: linear-gradient(162deg, #171221, #110D17);
        border: 1px solid var(--border-strong, #3D3253);
        box-shadow: 0 26px 70px -34px rgba(0,0,0,.95);
        color: var(--text-2, #A99FB8);
        font-family: var(--sans, system-ui, sans-serif);
        font-size: .82rem; line-height: 1.55;
      }
      .wb-demo__cta h2 {
        margin: .35rem 0 .7rem;
        font-family: var(--display, system-ui, sans-serif);
        font-weight: 700;
        font-stretch: 108%;
        color: var(--text, #F4F0F8);
        font-size: 1.12rem; line-height: 1.18; letter-spacing: -.025em;
      }
      .wb-demo__cta p { margin: 0 0 .7rem; }
      .wb-demo__cta strong { color: var(--text, #F4F0F8); font-weight: 650; }
      .wb-demo__ctaeyebrow {
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .58rem; font-weight: 700;
        letter-spacing: .2em; text-transform: uppercase;
        color: var(--accent, #FF4D9D);
      }
      .wb-demo__ctaclose {
        position: absolute; top: 8px; right: 10px;
        background: none; border: 0; color: var(--text-3, #6F6580);
        font-size: 1.2rem; line-height: 1; cursor: pointer; padding: .2rem .35rem;
      }
      .wb-demo__ctaclose:hover { color: var(--text, #F4F0F8); }
      /* The "not built yet" block wears the blueprint language used everywhere
         else in the product for things that are specified and absent. */
      .wb-demo__ctawarn {
        padding: .65rem .7rem; border-radius: 8px;
        border: 1px dashed var(--planned-line, rgba(255,176,32,.32));
        background-image: repeating-linear-gradient(45deg,
          rgba(255,176,32,.05) 0, rgba(255,176,32,.05) 1px,
          transparent 1px, transparent 7px);
        color: #C9BCA6; font-size: .76rem;
      }
      .wb-demo__ctawarn strong { color: var(--planned, #FFB020); }
      .wb-demo__ctawarn code {
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .71rem; color: var(--text, #F4F0F8);
      }
      .wb-demo__ctalinks { display: flex; gap: .45rem; flex-wrap: wrap; margin-top: .85rem; }
      .wb-demo__ctalinks .wb-demo__btn { padding: .5rem .9rem; font-size: .8rem; }

      .wb-demo__reopen {
        position: absolute; right: 12px; bottom: 12px; z-index: 1200;
        padding: .42rem .85rem; border-radius: 999px;
        background: rgba(8,6,16,.85);
        border: 1px solid var(--border-strong, #3D3253);
        color: var(--text-3, #6F6580);
        font-family: var(--mono, ui-monospace, monospace);
        font-size: .62rem; font-weight: 600;
        letter-spacing: .14em; text-transform: uppercase;
        cursor: pointer;
      }
      .wb-demo__reopen:hover { color: var(--text, #F4F0F8); border-color: var(--border-bright, #52456E); }

      @media (prefers-reduced-motion: reduce) {
        .wb-demo__status--live .wb-demo__statusdot { animation: none; }
      }

      /* A narrow iframe column: the CTA becomes a full-width sheet rather than
         a card that overhangs the frame. */
      @media (max-width: 520px) {
        .wb-demo__cta { left: 12px; right: 12px; width: auto; max-height: 70dvh; }
        .wb-demo__actions .wb-demo__btn { flex: 1 1 100%; }
        .wb-demo__row { flex-direction: column; align-items: flex-start; gap: .5rem; }
        .wb-demo__hands { margin-left: 0; }
      }
    `)}function oL(){return Zp()?M.createElement(rL,null):M.createElement(TS,null,M.createElement(nS,null,M.createElement(js,{path:"/",element:M.createElement(kS,null)}),M.createElement(js,{path:"/setup",element:M.createElement(Sw,null)}),M.createElement(js,{path:"/play",element:M.createElement(tL,null)}),M.createElement(js,{path:"/tennis",element:M.createElement(Wy,{to:"/play",replace:!0})}),M.createElement(js,{path:"*",element:M.createElement(nL,null)})))}fM.createRoot(document.getElementById("root")).render(M.createElement(M.StrictMode,null,M.createElement(oL,null)));export{uL as a,cL as c,Py as g};
