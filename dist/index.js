"use strict";var __defProp=Object.defineProperty;var __getOwnPropDesc=Object.getOwnPropertyDescriptor;var __getOwnPropNames=Object.getOwnPropertyNames;var __hasOwnProp=Object.prototype.hasOwnProperty;var __export=(target,all)=>{for(var name in all)__defProp(target,name,{get:all[name],enumerable:!0})},__copyProps=(to,from,except,desc)=>{if(from&&typeof from=="object"||typeof from=="function")for(let key of __getOwnPropNames(from))!__hasOwnProp.call(to,key)&&key!==except&&__defProp(to,key,{get:()=>from[key],enumerable:!(desc=__getOwnPropDesc(from,key))||desc.enumerable});return to};var __toCommonJS=mod=>__copyProps(__defProp({},"__esModule",{value:!0}),mod);var src_exports={};__export(src_exports,{DataSet:()=>DataSet,Fez:()=>Fez,Limon:()=>Limon});module.exports=__toCommonJS(src_exports);var DataSet=class _DataSet extends Set{some(predicate){for(let value of this)if(predicate(value,this))return!0;return!1}filter(predicate){let result=new _DataSet;for(let item of this)predicate(item,this)&&result.add(item);return result}random(){let it=this.values(),index=Math.floor(Math.random()*this.size);for(let i=0;i<index;i++)it.next();return it.next().value??null}};function ensureDataSet(map,key){let set=map.get(key)??new DataSet;return map.set(key,set),set}var Fez=class _Fez{constructor(pronunciation){this.pronunciation=pronunciation;this.syllables=[];let syllable=[],excess=[];for(let phoneme of this.pronunciation.phonemes)phoneme.stress!=null?(syllable.length&&this.syllables.push(_Fez.formatSyllable(syllable)),syllable=[phoneme],excess=[]):syllable[0]?.stress&&syllable.length<=syllable[0].stress?syllable.push(phoneme):excess.push(phoneme);syllable.length?(this.lastRawSyllable=_Fez.formatSyllable(syllable.concat(excess)),this.syllables.push(_Fez.formatSyllable(syllable))):(this.lastRawSyllable=this.pronunciation.phonemes.join(" "),this.syllables=[this.lastRawSyllable])}syllables;lastRawSyllable;static formatSyllable(syllable){return syllable.map(phoneme=>phoneme.phoneme).join(" ")}get syllableCount(){return this.syllables.length}get lastSyllable(){return this.syllables[this.syllables.length-1]}};var import_node_cmudict=require("node-cmudict");var Limon=class _Limon{static _instance;_dict;rhymeData;constructor(){this._dict=null,this.rhymeData=new Map}static getInstance(){return _Limon._instance||(_Limon._instance=new _Limon),_Limon._instance}get dict(){return this._dict}get initialized(){return!!(this._dict&&this.rhymeData.size)}setDict(dict){this._dict=dict??(0,import_node_cmudict.getDict)()}init(){this._dict||this.setDict();for(let entry of this._dict.values())for(let pronunciation of entry.pronunciations){let fez=new Fez(pronunciation);if(fez.syllableCount===1){let data=ensureDataSet(this.rhymeData,fez.lastSyllable);data.some(other=>pronunciation.equals(other.pronunciation))||data.add(fez)}}}exec(word){this.initialized||this.init();let formatted=word.trim().toLowerCase(),entry=this._dict.get(formatted);if(!entry)return null;let variations=new DataSet;for(let pronunciation of entry.pronunciations){let fez=new Fez(pronunciation),output=[];for(let i=0;i<fez.syllableCount;i++){let data=this.rhymeData.get(fez.syllables[i]);if(data){let match=(i===fez.syllableCount-1?data.filter(other=>other.lastRawSyllable===fez.lastRawSyllable):data).random();if(match)output.push(match.pronunciation.entry.name);else break}else break}output.length===fez.syllableCount&&variations.add(output.join(""))}return variations.random()}};0&&(module.exports={DataSet,Fez,Limon});
//# sourceMappingURL=index.js.map