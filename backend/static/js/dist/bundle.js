/*! For license information please see bundle.js.LICENSE.txt */
(()=>{var e,t,r,n,i={8099:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(7117);function i(e,t,r){return void 0===t&&(t=new Uint8Array(2)),void 0===r&&(r=0),t[r+0]=e>>>8,t[r+1]=e>>>0,t}function o(e,t,r){return void 0===t&&(t=new Uint8Array(2)),void 0===r&&(r=0),t[r+0]=e>>>0,t[r+1]=e>>>8,t}function a(e,t){return void 0===t&&(t=0),e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3]}function s(e,t){return void 0===t&&(t=0),(e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3])>>>0}function c(e,t){return void 0===t&&(t=0),e[t+3]<<24|e[t+2]<<16|e[t+1]<<8|e[t]}function l(e,t){return void 0===t&&(t=0),(e[t+3]<<24|e[t+2]<<16|e[t+1]<<8|e[t])>>>0}function u(e,t,r){return void 0===t&&(t=new Uint8Array(4)),void 0===r&&(r=0),t[r+0]=e>>>24,t[r+1]=e>>>16,t[r+2]=e>>>8,t[r+3]=e>>>0,t}function d(e,t,r){return void 0===t&&(t=new Uint8Array(4)),void 0===r&&(r=0),t[r+0]=e>>>0,t[r+1]=e>>>8,t[r+2]=e>>>16,t[r+3]=e>>>24,t}function h(e,t,r){return void 0===t&&(t=new Uint8Array(8)),void 0===r&&(r=0),u(e/4294967296>>>0,t,r),u(e>>>0,t,r+4),t}function p(e,t,r){return void 0===t&&(t=new Uint8Array(8)),void 0===r&&(r=0),d(e>>>0,t,r),d(e/4294967296>>>0,t,r+4),t}t.readInt16BE=function(e,t){return void 0===t&&(t=0),(e[t+0]<<8|e[t+1])<<16>>16},t.readUint16BE=function(e,t){return void 0===t&&(t=0),(e[t+0]<<8|e[t+1])>>>0},t.readInt16LE=function(e,t){return void 0===t&&(t=0),(e[t+1]<<8|e[t])<<16>>16},t.readUint16LE=function(e,t){return void 0===t&&(t=0),(e[t+1]<<8|e[t])>>>0},t.writeUint16BE=i,t.writeInt16BE=i,t.writeUint16LE=o,t.writeInt16LE=o,t.readInt32BE=a,t.readUint32BE=s,t.readInt32LE=c,t.readUint32LE=l,t.writeUint32BE=u,t.writeInt32BE=u,t.writeUint32LE=d,t.writeInt32LE=d,t.readInt64BE=function(e,t){void 0===t&&(t=0);var r=a(e,t),n=a(e,t+4);return 4294967296*r+n-4294967296*(n>>31)},t.readUint64BE=function(e,t){return void 0===t&&(t=0),4294967296*s(e,t)+s(e,t+4)},t.readInt64LE=function(e,t){void 0===t&&(t=0);var r=c(e,t);return 4294967296*c(e,t+4)+r-4294967296*(r>>31)},t.readUint64LE=function(e,t){void 0===t&&(t=0);var r=l(e,t);return 4294967296*l(e,t+4)+r},t.writeUint64BE=h,t.writeInt64BE=h,t.writeUint64LE=p,t.writeInt64LE=p,t.readUintBE=function(e,t,r){if(void 0===r&&(r=0),e%8!=0)throw new Error("readUintBE supports only bitLengths divisible by 8");if(e/8>t.length-r)throw new Error("readUintBE: array is too short for the given bitLength");for(var n=0,i=1,o=e/8+r-1;o>=r;o--)n+=t[o]*i,i*=256;return n},t.readUintLE=function(e,t,r){if(void 0===r&&(r=0),e%8!=0)throw new Error("readUintLE supports only bitLengths divisible by 8");if(e/8>t.length-r)throw new Error("readUintLE: array is too short for the given bitLength");for(var n=0,i=1,o=r;o<r+e/8;o++)n+=t[o]*i,i*=256;return n},t.writeUintBE=function(e,t,r,i){if(void 0===r&&(r=new Uint8Array(e/8)),void 0===i&&(i=0),e%8!=0)throw new Error("writeUintBE supports only bitLengths divisible by 8");if(!n.isSafeInteger(t))throw new Error("writeUintBE value must be an integer");for(var o=1,a=e/8+i-1;a>=i;a--)r[a]=t/o&255,o*=256;return r},t.writeUintLE=function(e,t,r,i){if(void 0===r&&(r=new Uint8Array(e/8)),void 0===i&&(i=0),e%8!=0)throw new Error("writeUintLE supports only bitLengths divisible by 8");if(!n.isSafeInteger(t))throw new Error("writeUintLE value must be an integer");for(var o=1,a=i;a<i+e/8;a++)r[a]=t/o&255,o*=256;return r},t.readFloat32BE=function(e,t){return void 0===t&&(t=0),new DataView(e.buffer,e.byteOffset,e.byteLength).getFloat32(t)},t.readFloat32LE=function(e,t){return void 0===t&&(t=0),new DataView(e.buffer,e.byteOffset,e.byteLength).getFloat32(t,!0)},t.readFloat64BE=function(e,t){return void 0===t&&(t=0),new DataView(e.buffer,e.byteOffset,e.byteLength).getFloat64(t)},t.readFloat64LE=function(e,t){return void 0===t&&(t=0),new DataView(e.buffer,e.byteOffset,e.byteLength).getFloat64(t,!0)},t.writeFloat32BE=function(e,t,r){return void 0===t&&(t=new Uint8Array(4)),void 0===r&&(r=0),new DataView(t.buffer,t.byteOffset,t.byteLength).setFloat32(r,e),t},t.writeFloat32LE=function(e,t,r){return void 0===t&&(t=new Uint8Array(4)),void 0===r&&(r=0),new DataView(t.buffer,t.byteOffset,t.byteLength).setFloat32(r,e,!0),t},t.writeFloat64BE=function(e,t,r){return void 0===t&&(t=new Uint8Array(8)),void 0===r&&(r=0),new DataView(t.buffer,t.byteOffset,t.byteLength).setFloat64(r,e),t},t.writeFloat64LE=function(e,t,r){return void 0===t&&(t=new Uint8Array(8)),void 0===r&&(r=0),new DataView(t.buffer,t.byteOffset,t.byteLength).setFloat64(r,e,!0),t}},5439:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(8099),i=r(7309),o=20;function a(e,t,r){for(var i=1634760805,a=857760878,s=2036477234,c=1797285236,l=r[3]<<24|r[2]<<16|r[1]<<8|r[0],u=r[7]<<24|r[6]<<16|r[5]<<8|r[4],d=r[11]<<24|r[10]<<16|r[9]<<8|r[8],h=r[15]<<24|r[14]<<16|r[13]<<8|r[12],p=r[19]<<24|r[18]<<16|r[17]<<8|r[16],f=r[23]<<24|r[22]<<16|r[21]<<8|r[20],g=r[27]<<24|r[26]<<16|r[25]<<8|r[24],w=r[31]<<24|r[30]<<16|r[29]<<8|r[28],b=t[3]<<24|t[2]<<16|t[1]<<8|t[0],m=t[7]<<24|t[6]<<16|t[5]<<8|t[4],y=t[11]<<24|t[10]<<16|t[9]<<8|t[8],v=t[15]<<24|t[14]<<16|t[13]<<8|t[12],x=i,C=a,k=s,E=c,P=l,$=u,S=d,_=h,A=p,I=f,O=g,T=w,N=b,R=m,j=y,B=v,M=0;M<o;M+=2)P=(P^=A=A+(N=(N^=x=x+P|0)>>>16|N<<16)|0)>>>20|P<<12,$=($^=I=I+(R=(R^=C=C+$|0)>>>16|R<<16)|0)>>>20|$<<12,S=(S^=O=O+(j=(j^=k=k+S|0)>>>16|j<<16)|0)>>>20|S<<12,_=(_^=T=T+(B=(B^=E=E+_|0)>>>16|B<<16)|0)>>>20|_<<12,S=(S^=O=O+(j=(j^=k=k+S|0)>>>24|j<<8)|0)>>>25|S<<7,_=(_^=T=T+(B=(B^=E=E+_|0)>>>24|B<<8)|0)>>>25|_<<7,$=($^=I=I+(R=(R^=C=C+$|0)>>>24|R<<8)|0)>>>25|$<<7,P=(P^=A=A+(N=(N^=x=x+P|0)>>>24|N<<8)|0)>>>25|P<<7,$=($^=O=O+(B=(B^=x=x+$|0)>>>16|B<<16)|0)>>>20|$<<12,S=(S^=T=T+(N=(N^=C=C+S|0)>>>16|N<<16)|0)>>>20|S<<12,_=(_^=A=A+(R=(R^=k=k+_|0)>>>16|R<<16)|0)>>>20|_<<12,P=(P^=I=I+(j=(j^=E=E+P|0)>>>16|j<<16)|0)>>>20|P<<12,_=(_^=A=A+(R=(R^=k=k+_|0)>>>24|R<<8)|0)>>>25|_<<7,P=(P^=I=I+(j=(j^=E=E+P|0)>>>24|j<<8)|0)>>>25|P<<7,S=(S^=T=T+(N=(N^=C=C+S|0)>>>24|N<<8)|0)>>>25|S<<7,$=($^=O=O+(B=(B^=x=x+$|0)>>>24|B<<8)|0)>>>25|$<<7;n.writeUint32LE(x+i|0,e,0),n.writeUint32LE(C+a|0,e,4),n.writeUint32LE(k+s|0,e,8),n.writeUint32LE(E+c|0,e,12),n.writeUint32LE(P+l|0,e,16),n.writeUint32LE($+u|0,e,20),n.writeUint32LE(S+d|0,e,24),n.writeUint32LE(_+h|0,e,28),n.writeUint32LE(A+p|0,e,32),n.writeUint32LE(I+f|0,e,36),n.writeUint32LE(O+g|0,e,40),n.writeUint32LE(T+w|0,e,44),n.writeUint32LE(N+b|0,e,48),n.writeUint32LE(R+m|0,e,52),n.writeUint32LE(j+y|0,e,56),n.writeUint32LE(B+v|0,e,60)}function s(e,t,r,n,o){if(void 0===o&&(o=0),32!==e.length)throw new Error("ChaCha: key size must be 32 bytes");if(n.length<r.length)throw new Error("ChaCha: destination is shorter than source");var s,l;if(0===o){if(8!==t.length&&12!==t.length)throw new Error("ChaCha nonce must be 8 or 12 bytes");l=(s=new Uint8Array(16)).length-t.length,s.set(t,l)}else{if(16!==t.length)throw new Error("ChaCha nonce with counter must be 16 bytes");s=t,l=o}for(var u=new Uint8Array(64),d=0;d<r.length;d+=64){a(u,s,e);for(var h=d;h<d+64&&h<r.length;h++)n[h]=r[h]^u[h-d];c(s,0,l)}return i.wipe(u),0===o&&i.wipe(s),n}function c(e,t,r){for(var n=1;r--;)n=n+(255&e[t])|0,e[t]=255&n,n>>>=8,t++;if(n>0)throw new Error("ChaCha: counter overflow")}t.streamXOR=s,t.stream=function(e,t,r,n){return void 0===n&&(n=0),i.wipe(r),s(e,t,r,r,n)}},5501:(e,t,r)=>{"use strict";var n=r(5439),i=r(3027),o=r(7309),a=r(8099),s=r(4153);t.Cv=32,t.WH=12,t.pg=16;var c=new Uint8Array(16),l=function(){function e(e){if(this.nonceLength=t.WH,this.tagLength=t.pg,e.length!==t.Cv)throw new Error("ChaCha20Poly1305 needs 32-byte key");this._key=new Uint8Array(e)}return e.prototype.seal=function(e,t,r,i){if(e.length>16)throw new Error("ChaCha20Poly1305: incorrect nonce length");var a=new Uint8Array(16);a.set(e,a.length-e.length);var s=new Uint8Array(32);n.stream(this._key,a,s,4);var c,l=t.length+this.tagLength;if(i){if(i.length!==l)throw new Error("ChaCha20Poly1305: incorrect destination length");c=i}else c=new Uint8Array(l);return n.streamXOR(this._key,a,t,c,4),this._authenticate(c.subarray(c.length-this.tagLength,c.length),s,c.subarray(0,c.length-this.tagLength),r),o.wipe(a),c},e.prototype.open=function(e,t,r,i){if(e.length>16)throw new Error("ChaCha20Poly1305: incorrect nonce length");if(t.length<this.tagLength)return null;var a=new Uint8Array(16);a.set(e,a.length-e.length);var c=new Uint8Array(32);n.stream(this._key,a,c,4);var l=new Uint8Array(this.tagLength);if(this._authenticate(l,c,t.subarray(0,t.length-this.tagLength),r),!s.equal(l,t.subarray(t.length-this.tagLength,t.length)))return null;var u,d=t.length-this.tagLength;if(i){if(i.length!==d)throw new Error("ChaCha20Poly1305: incorrect destination length");u=i}else u=new Uint8Array(d);return n.streamXOR(this._key,a,t.subarray(0,t.length-this.tagLength),u,4),o.wipe(a),u},e.prototype.clean=function(){return o.wipe(this._key),this},e.prototype._authenticate=function(e,t,r,n){var s=new i.Poly1305(t);n&&(s.update(n),n.length%16>0&&s.update(c.subarray(n.length%16))),s.update(r),r.length%16>0&&s.update(c.subarray(r.length%16));var l=new Uint8Array(8);n&&a.writeUint64LE(n.length,l),s.update(l),a.writeUint64LE(r.length,l),s.update(l);for(var u=s.digest(),d=0;d<u.length;d++)e[d]=u[d];s.clean(),o.wipe(u),o.wipe(l)},e}();t.OK=l},4153:(e,t)=>{"use strict";function r(e,t){if(e.length!==t.length)return 0;for(var r=0,n=0;n<e.length;n++)r|=e[n]^t[n];return 1&r-1>>>8}Object.defineProperty(t,"__esModule",{value:!0}),t.select=function(e,t,r){return~(e-1)&t|e-1&r},t.lessOrEqual=function(e,t){return(0|e)-(0|t)-1>>>31&1},t.compare=r,t.equal=function(e,t){return 0!==e.length&&0!==t.length&&0!==r(e,t)}},9984:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.isSerializableHash=function(e){return void 0!==e.saveState&&void 0!==e.restoreState&&void 0!==e.cleanSavedState}},512:(e,t,r)=>{"use strict";var n=r(5629),i=r(7309),o=function(){function e(e,t,r,i){void 0===r&&(r=new Uint8Array(0)),this._counter=new Uint8Array(1),this._hash=e,this._info=i;var o=n.hmac(this._hash,r,t);this._hmac=new n.HMAC(e,o),this._buffer=new Uint8Array(this._hmac.digestLength),this._bufpos=this._buffer.length}return e.prototype._fillBuffer=function(){this._counter[0]++;var e=this._counter[0];if(0===e)throw new Error("hkdf: cannot expand more");this._hmac.reset(),e>1&&this._hmac.update(this._buffer),this._info&&this._hmac.update(this._info),this._hmac.update(this._counter),this._hmac.finish(this._buffer),this._bufpos=0},e.prototype.expand=function(e){for(var t=new Uint8Array(e),r=0;r<t.length;r++)this._bufpos===this._buffer.length&&this._fillBuffer(),t[r]=this._buffer[this._bufpos++];return t},e.prototype.clean=function(){this._hmac.clean(),i.wipe(this._buffer),i.wipe(this._counter),this._bufpos=0},e}();t.t=o},5629:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(9984),i=r(4153),o=r(7309),a=function(){function e(e,t){this._finished=!1,this._inner=new e,this._outer=new e,this.blockSize=this._outer.blockSize,this.digestLength=this._outer.digestLength;var r=new Uint8Array(this.blockSize);t.length>this.blockSize?this._inner.update(t).finish(r).clean():r.set(t);for(var i=0;i<r.length;i++)r[i]^=54;for(this._inner.update(r),i=0;i<r.length;i++)r[i]^=106;this._outer.update(r),n.isSerializableHash(this._inner)&&n.isSerializableHash(this._outer)&&(this._innerKeyedState=this._inner.saveState(),this._outerKeyedState=this._outer.saveState()),o.wipe(r)}return e.prototype.reset=function(){if(!n.isSerializableHash(this._inner)||!n.isSerializableHash(this._outer))throw new Error("hmac: can't reset() because hash doesn't implement restoreState()");return this._inner.restoreState(this._innerKeyedState),this._outer.restoreState(this._outerKeyedState),this._finished=!1,this},e.prototype.clean=function(){n.isSerializableHash(this._inner)&&this._inner.cleanSavedState(this._innerKeyedState),n.isSerializableHash(this._outer)&&this._outer.cleanSavedState(this._outerKeyedState),this._inner.clean(),this._outer.clean()},e.prototype.update=function(e){return this._inner.update(e),this},e.prototype.finish=function(e){return this._finished?(this._outer.finish(e),this):(this._inner.finish(e),this._outer.update(e.subarray(0,this.digestLength)).finish(e),this._finished=!0,this)},e.prototype.digest=function(){var e=new Uint8Array(this.digestLength);return this.finish(e),e},e.prototype.saveState=function(){if(!n.isSerializableHash(this._inner))throw new Error("hmac: can't saveState() because hash doesn't implement it");return this._inner.saveState()},e.prototype.restoreState=function(e){if(!n.isSerializableHash(this._inner)||!n.isSerializableHash(this._outer))throw new Error("hmac: can't restoreState() because hash doesn't implement it");return this._inner.restoreState(e),this._outer.restoreState(this._outerKeyedState),this._finished=!1,this},e.prototype.cleanSavedState=function(e){if(!n.isSerializableHash(this._inner))throw new Error("hmac: can't cleanSavedState() because hash doesn't implement it");this._inner.cleanSavedState(e)},e}();t.HMAC=a,t.hmac=function(e,t,r){var n=new a(e,t);n.update(r);var i=n.digest();return n.clean(),i},t.equal=i.equal},7117:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.mul=Math.imul||function(e,t){var r=65535&e,n=65535&t;return r*n+((e>>>16&65535)*n+r*(t>>>16&65535)<<16>>>0)|0},t.add=function(e,t){return e+t|0},t.sub=function(e,t){return e-t|0},t.rotl=function(e,t){return e<<t|e>>>32-t},t.rotr=function(e,t){return e<<32-t|e>>>t},t.isInteger=Number.isInteger||function(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e},t.MAX_SAFE_INTEGER=9007199254740991,t.isSafeInteger=function(e){return t.isInteger(e)&&e>=-t.MAX_SAFE_INTEGER&&e<=t.MAX_SAFE_INTEGER}},3027:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(4153),i=r(7309);t.DIGEST_LENGTH=16;var o=function(){function e(e){this.digestLength=t.DIGEST_LENGTH,this._buffer=new Uint8Array(16),this._r=new Uint16Array(10),this._h=new Uint16Array(10),this._pad=new Uint16Array(8),this._leftover=0,this._fin=0,this._finished=!1;var r=e[0]|e[1]<<8;this._r[0]=8191&r;var n=e[2]|e[3]<<8;this._r[1]=8191&(r>>>13|n<<3);var i=e[4]|e[5]<<8;this._r[2]=7939&(n>>>10|i<<6);var o=e[6]|e[7]<<8;this._r[3]=8191&(i>>>7|o<<9);var a=e[8]|e[9]<<8;this._r[4]=255&(o>>>4|a<<12),this._r[5]=a>>>1&8190;var s=e[10]|e[11]<<8;this._r[6]=8191&(a>>>14|s<<2);var c=e[12]|e[13]<<8;this._r[7]=8065&(s>>>11|c<<5);var l=e[14]|e[15]<<8;this._r[8]=8191&(c>>>8|l<<8),this._r[9]=l>>>5&127,this._pad[0]=e[16]|e[17]<<8,this._pad[1]=e[18]|e[19]<<8,this._pad[2]=e[20]|e[21]<<8,this._pad[3]=e[22]|e[23]<<8,this._pad[4]=e[24]|e[25]<<8,this._pad[5]=e[26]|e[27]<<8,this._pad[6]=e[28]|e[29]<<8,this._pad[7]=e[30]|e[31]<<8}return e.prototype._blocks=function(e,t,r){for(var n=this._fin?0:2048,i=this._h[0],o=this._h[1],a=this._h[2],s=this._h[3],c=this._h[4],l=this._h[5],u=this._h[6],d=this._h[7],h=this._h[8],p=this._h[9],f=this._r[0],g=this._r[1],w=this._r[2],b=this._r[3],m=this._r[4],y=this._r[5],v=this._r[6],x=this._r[7],C=this._r[8],k=this._r[9];r>=16;){var E=e[t+0]|e[t+1]<<8;i+=8191&E;var P=e[t+2]|e[t+3]<<8;o+=8191&(E>>>13|P<<3);var $=e[t+4]|e[t+5]<<8;a+=8191&(P>>>10|$<<6);var S=e[t+6]|e[t+7]<<8;s+=8191&($>>>7|S<<9);var _=e[t+8]|e[t+9]<<8;c+=8191&(S>>>4|_<<12),l+=_>>>1&8191;var A=e[t+10]|e[t+11]<<8;u+=8191&(_>>>14|A<<2);var I=e[t+12]|e[t+13]<<8;d+=8191&(A>>>11|I<<5);var O=e[t+14]|e[t+15]<<8,T=0,N=T;N+=i*f,N+=o*(5*k),N+=a*(5*C),N+=s*(5*x),T=(N+=c*(5*v))>>>13,N&=8191,N+=l*(5*y),N+=u*(5*m),N+=d*(5*b),N+=(h+=8191&(I>>>8|O<<8))*(5*w);var R=T+=(N+=(p+=O>>>5|n)*(5*g))>>>13;R+=i*g,R+=o*f,R+=a*(5*k),R+=s*(5*C),T=(R+=c*(5*x))>>>13,R&=8191,R+=l*(5*v),R+=u*(5*y),R+=d*(5*m),R+=h*(5*b),T+=(R+=p*(5*w))>>>13,R&=8191;var j=T;j+=i*w,j+=o*g,j+=a*f,j+=s*(5*k),T=(j+=c*(5*C))>>>13,j&=8191,j+=l*(5*x),j+=u*(5*v),j+=d*(5*y),j+=h*(5*m);var B=T+=(j+=p*(5*b))>>>13;B+=i*b,B+=o*w,B+=a*g,B+=s*f,T=(B+=c*(5*k))>>>13,B&=8191,B+=l*(5*C),B+=u*(5*x),B+=d*(5*v),B+=h*(5*y);var M=T+=(B+=p*(5*m))>>>13;M+=i*m,M+=o*b,M+=a*w,M+=s*g,T=(M+=c*f)>>>13,M&=8191,M+=l*(5*k),M+=u*(5*C),M+=d*(5*x),M+=h*(5*v);var U=T+=(M+=p*(5*y))>>>13;U+=i*y,U+=o*m,U+=a*b,U+=s*w,T=(U+=c*g)>>>13,U&=8191,U+=l*f,U+=u*(5*k),U+=d*(5*C),U+=h*(5*x);var L=T+=(U+=p*(5*v))>>>13;L+=i*v,L+=o*y,L+=a*m,L+=s*b,T=(L+=c*w)>>>13,L&=8191,L+=l*g,L+=u*f,L+=d*(5*k),L+=h*(5*C);var D=T+=(L+=p*(5*x))>>>13;D+=i*x,D+=o*v,D+=a*y,D+=s*m,T=(D+=c*b)>>>13,D&=8191,D+=l*w,D+=u*g,D+=d*f,D+=h*(5*k);var z=T+=(D+=p*(5*C))>>>13;z+=i*C,z+=o*x,z+=a*v,z+=s*y,T=(z+=c*m)>>>13,z&=8191,z+=l*b,z+=u*w,z+=d*g,z+=h*f;var W=T+=(z+=p*(5*k))>>>13;W+=i*k,W+=o*C,W+=a*x,W+=s*v,T=(W+=c*y)>>>13,W&=8191,W+=l*m,W+=u*b,W+=d*w,W+=h*g,i=N=8191&(T=(T=((T+=(W+=p*f)>>>13)<<2)+T|0)+(N&=8191)|0),o=R+=T>>>=13,a=j&=8191,s=B&=8191,c=M&=8191,l=U&=8191,u=L&=8191,d=D&=8191,h=z&=8191,p=W&=8191,t+=16,r-=16}this._h[0]=i,this._h[1]=o,this._h[2]=a,this._h[3]=s,this._h[4]=c,this._h[5]=l,this._h[6]=u,this._h[7]=d,this._h[8]=h,this._h[9]=p},e.prototype.finish=function(e,t){void 0===t&&(t=0);var r,n,i,o,a=new Uint16Array(10);if(this._leftover){for(o=this._leftover,this._buffer[o++]=1;o<16;o++)this._buffer[o]=0;this._fin=1,this._blocks(this._buffer,0,16)}for(r=this._h[1]>>>13,this._h[1]&=8191,o=2;o<10;o++)this._h[o]+=r,r=this._h[o]>>>13,this._h[o]&=8191;for(this._h[0]+=5*r,r=this._h[0]>>>13,this._h[0]&=8191,this._h[1]+=r,r=this._h[1]>>>13,this._h[1]&=8191,this._h[2]+=r,a[0]=this._h[0]+5,r=a[0]>>>13,a[0]&=8191,o=1;o<10;o++)a[o]=this._h[o]+r,r=a[o]>>>13,a[o]&=8191;for(a[9]-=8192,n=(1^r)-1,o=0;o<10;o++)a[o]&=n;for(n=~n,o=0;o<10;o++)this._h[o]=this._h[o]&n|a[o];for(this._h[0]=65535&(this._h[0]|this._h[1]<<13),this._h[1]=65535&(this._h[1]>>>3|this._h[2]<<10),this._h[2]=65535&(this._h[2]>>>6|this._h[3]<<7),this._h[3]=65535&(this._h[3]>>>9|this._h[4]<<4),this._h[4]=65535&(this._h[4]>>>12|this._h[5]<<1|this._h[6]<<14),this._h[5]=65535&(this._h[6]>>>2|this._h[7]<<11),this._h[6]=65535&(this._h[7]>>>5|this._h[8]<<8),this._h[7]=65535&(this._h[8]>>>8|this._h[9]<<5),i=this._h[0]+this._pad[0],this._h[0]=65535&i,o=1;o<8;o++)i=(this._h[o]+this._pad[o]|0)+(i>>>16)|0,this._h[o]=65535&i;return e[t+0]=this._h[0]>>>0,e[t+1]=this._h[0]>>>8,e[t+2]=this._h[1]>>>0,e[t+3]=this._h[1]>>>8,e[t+4]=this._h[2]>>>0,e[t+5]=this._h[2]>>>8,e[t+6]=this._h[3]>>>0,e[t+7]=this._h[3]>>>8,e[t+8]=this._h[4]>>>0,e[t+9]=this._h[4]>>>8,e[t+10]=this._h[5]>>>0,e[t+11]=this._h[5]>>>8,e[t+12]=this._h[6]>>>0,e[t+13]=this._h[6]>>>8,e[t+14]=this._h[7]>>>0,e[t+15]=this._h[7]>>>8,this._finished=!0,this},e.prototype.update=function(e){var t,r=0,n=e.length;if(this._leftover){(t=16-this._leftover)>n&&(t=n);for(var i=0;i<t;i++)this._buffer[this._leftover+i]=e[r+i];if(n-=t,r+=t,this._leftover+=t,this._leftover<16)return this;this._blocks(this._buffer,0,16),this._leftover=0}if(n>=16&&(t=n-n%16,this._blocks(e,r,t),r+=t,n-=t),n){for(i=0;i<n;i++)this._buffer[this._leftover+i]=e[r+i];this._leftover+=n}return this},e.prototype.digest=function(){if(this._finished)throw new Error("Poly1305 was finished");var e=new Uint8Array(16);return this.finish(e),e},e.prototype.clean=function(){return i.wipe(this._buffer),i.wipe(this._r),i.wipe(this._h),i.wipe(this._pad),this._leftover=0,this._fin=0,this._finished=!0,this},e}();t.Poly1305=o,t.oneTimeAuth=function(e,t){var r=new o(e);r.update(t);var n=r.digest();return r.clean(),n},t.equal=function(e,r){return e.length===t.DIGEST_LENGTH&&r.length===t.DIGEST_LENGTH&&n.equal(e,r)}},1416:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.randomStringForEntropy=t.randomString=t.randomUint32=t.randomBytes=t.defaultRandomSource=void 0;const n=r(6008),i=r(8099),o=r(7309);function a(e,r=t.defaultRandomSource){return r.randomBytes(e)}t.defaultRandomSource=new n.SystemRandomSource,t.randomBytes=a,t.randomUint32=function(e=t.defaultRandomSource){const r=a(4,e),n=(0,i.readUint32LE)(r);return(0,o.wipe)(r),n};const s="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";function c(e,r=s,n=t.defaultRandomSource){if(r.length<2)throw new Error("randomString charset is too short");if(r.length>256)throw new Error("randomString charset is too long");let i="";const c=r.length,l=256-256%c;for(;e>0;){const t=a(Math.ceil(256*e/l),n);for(let n=0;n<t.length&&e>0;n++){const o=t[n];o<l&&(i+=r.charAt(o%c),e--)}(0,o.wipe)(t)}return i}t.randomString=c,t.randomStringForEntropy=function(e,r=s,n=t.defaultRandomSource){return c(Math.ceil(e/(Math.log(r.length)/Math.LN2)),r,n)}},5455:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.BrowserRandomSource=void 0,t.BrowserRandomSource=class{constructor(){this.isAvailable=!1,this.isInstantiated=!1;const e="undefined"!=typeof self?self.crypto||self.msCrypto:null;e&&void 0!==e.getRandomValues&&(this._crypto=e,this.isAvailable=!0,this.isInstantiated=!0)}randomBytes(e){if(!this.isAvailable||!this._crypto)throw new Error("Browser random byte generator is not available.");const t=new Uint8Array(e);for(let e=0;e<t.length;e+=65536)this._crypto.getRandomValues(t.subarray(e,e+Math.min(t.length-e,65536)));return t}}},8871:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.NodeRandomSource=void 0;const n=r(7309);t.NodeRandomSource=class{constructor(){this.isAvailable=!1,this.isInstantiated=!1;{const e=r(5883);e&&e.randomBytes&&(this._crypto=e,this.isAvailable=!0,this.isInstantiated=!0)}}randomBytes(e){if(!this.isAvailable||!this._crypto)throw new Error("Node.js random byte generator is not available.");let t=this._crypto.randomBytes(e);if(t.length!==e)throw new Error("NodeRandomSource: got fewer bytes than requested");const r=new Uint8Array(e);for(let e=0;e<r.length;e++)r[e]=t[e];return(0,n.wipe)(t),r}}},6008:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.SystemRandomSource=void 0;const n=r(5455),i=r(8871);t.SystemRandomSource=class{constructor(){return this.isAvailable=!1,this.name="",this._source=new n.BrowserRandomSource,this._source.isAvailable?(this.isAvailable=!0,void(this.name="Browser")):(this._source=new i.NodeRandomSource,this._source.isAvailable?(this.isAvailable=!0,void(this.name="Node")):void 0)}randomBytes(e){if(!this.isAvailable)throw new Error("System random byte generator is not available.");return this._source.randomBytes(e)}}},3294:(e,t,r)=>{"use strict";var n=r(8099),i=r(7309);t.k=32,t.cn=64;var o=function(){function e(){this.digestLength=t.k,this.blockSize=t.cn,this._state=new Int32Array(8),this._temp=new Int32Array(64),this._buffer=new Uint8Array(128),this._bufferLength=0,this._bytesHashed=0,this._finished=!1,this.reset()}return e.prototype._initState=function(){this._state[0]=1779033703,this._state[1]=3144134277,this._state[2]=1013904242,this._state[3]=2773480762,this._state[4]=1359893119,this._state[5]=2600822924,this._state[6]=528734635,this._state[7]=1541459225},e.prototype.reset=function(){return this._initState(),this._bufferLength=0,this._bytesHashed=0,this._finished=!1,this},e.prototype.clean=function(){i.wipe(this._buffer),i.wipe(this._temp),this.reset()},e.prototype.update=function(e,t){if(void 0===t&&(t=e.length),this._finished)throw new Error("SHA256: can't update because hash was finished.");var r=0;if(this._bytesHashed+=t,this._bufferLength>0){for(;this._bufferLength<this.blockSize&&t>0;)this._buffer[this._bufferLength++]=e[r++],t--;this._bufferLength===this.blockSize&&(s(this._temp,this._state,this._buffer,0,this.blockSize),this._bufferLength=0)}for(t>=this.blockSize&&(r=s(this._temp,this._state,e,r,t),t%=this.blockSize);t>0;)this._buffer[this._bufferLength++]=e[r++],t--;return this},e.prototype.finish=function(e){if(!this._finished){var t=this._bytesHashed,r=this._bufferLength,i=t/536870912|0,o=t<<3,a=t%64<56?64:128;this._buffer[r]=128;for(var c=r+1;c<a-8;c++)this._buffer[c]=0;n.writeUint32BE(i,this._buffer,a-8),n.writeUint32BE(o,this._buffer,a-4),s(this._temp,this._state,this._buffer,0,a),this._finished=!0}for(c=0;c<this.digestLength/4;c++)n.writeUint32BE(this._state[c],e,4*c);return this},e.prototype.digest=function(){var e=new Uint8Array(this.digestLength);return this.finish(e),e},e.prototype.saveState=function(){if(this._finished)throw new Error("SHA256: cannot save finished state");return{state:new Int32Array(this._state),buffer:this._bufferLength>0?new Uint8Array(this._buffer):void 0,bufferLength:this._bufferLength,bytesHashed:this._bytesHashed}},e.prototype.restoreState=function(e){return this._state.set(e.state),this._bufferLength=e.bufferLength,e.buffer&&this._buffer.set(e.buffer),this._bytesHashed=e.bytesHashed,this._finished=!1,this},e.prototype.cleanSavedState=function(e){i.wipe(e.state),e.buffer&&i.wipe(e.buffer),e.bufferLength=0,e.bytesHashed=0},e}();t.mE=o;var a=new Int32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]);function s(e,t,r,i,o){for(;o>=64;){for(var s=t[0],c=t[1],l=t[2],u=t[3],d=t[4],h=t[5],p=t[6],f=t[7],g=0;g<16;g++){var w=i+4*g;e[g]=n.readUint32BE(r,w)}for(g=16;g<64;g++){var b=e[g-2],m=(b>>>17|b<<15)^(b>>>19|b<<13)^b>>>10,y=((b=e[g-15])>>>7|b<<25)^(b>>>18|b<<14)^b>>>3;e[g]=(m+e[g-7]|0)+(y+e[g-16]|0)}for(g=0;g<64;g++)m=(((d>>>6|d<<26)^(d>>>11|d<<21)^(d>>>25|d<<7))+(d&h^~d&p)|0)+(f+(a[g]+e[g]|0)|0)|0,y=((s>>>2|s<<30)^(s>>>13|s<<19)^(s>>>22|s<<10))+(s&c^s&l^c&l)|0,f=p,p=h,h=d,d=u+m|0,u=l,l=c,c=s,s=m+y|0;t[0]+=s,t[1]+=c,t[2]+=l,t[3]+=u,t[4]+=d,t[5]+=h,t[6]+=p,t[7]+=f,i+=64,o-=64}return i}t.vp=function(e){var t=new o;t.update(e);var r=t.digest();return t.clean(),r}},7309:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.wipe=function(e){for(var t=0;t<e.length;t++)e[t]=0;return e}},7664:(e,t,r)=>{"use strict";t.gi=t.Au=t.KS=t.kz=void 0;const n=r(1416),i=r(7309);function o(e){const t=new Float64Array(16);if(e)for(let r=0;r<e.length;r++)t[r]=e[r];return t}t.kz=32,t.KS=32;const a=new Uint8Array(32);a[0]=9;const s=o([56129,1]);function c(e){let t=1;for(let r=0;r<16;r++){let n=e[r]+t+65535;t=Math.floor(n/65536),e[r]=n-65536*t}e[0]+=t-1+37*(t-1)}function l(e,t,r){const n=~(r-1);for(let r=0;r<16;r++){const i=n&(e[r]^t[r]);e[r]^=i,t[r]^=i}}function u(e,t,r){for(let n=0;n<16;n++)e[n]=t[n]+r[n]}function d(e,t,r){for(let n=0;n<16;n++)e[n]=t[n]-r[n]}function h(e,t,r){let n,i,o=0,a=0,s=0,c=0,l=0,u=0,d=0,h=0,p=0,f=0,g=0,w=0,b=0,m=0,y=0,v=0,x=0,C=0,k=0,E=0,P=0,$=0,S=0,_=0,A=0,I=0,O=0,T=0,N=0,R=0,j=0,B=r[0],M=r[1],U=r[2],L=r[3],D=r[4],z=r[5],W=r[6],F=r[7],H=r[8],G=r[9],q=r[10],Z=r[11],V=r[12],Y=r[13],K=r[14],X=r[15];n=t[0],o+=n*B,a+=n*M,s+=n*U,c+=n*L,l+=n*D,u+=n*z,d+=n*W,h+=n*F,p+=n*H,f+=n*G,g+=n*q,w+=n*Z,b+=n*V,m+=n*Y,y+=n*K,v+=n*X,n=t[1],a+=n*B,s+=n*M,c+=n*U,l+=n*L,u+=n*D,d+=n*z,h+=n*W,p+=n*F,f+=n*H,g+=n*G,w+=n*q,b+=n*Z,m+=n*V,y+=n*Y,v+=n*K,x+=n*X,n=t[2],s+=n*B,c+=n*M,l+=n*U,u+=n*L,d+=n*D,h+=n*z,p+=n*W,f+=n*F,g+=n*H,w+=n*G,b+=n*q,m+=n*Z,y+=n*V,v+=n*Y,x+=n*K,C+=n*X,n=t[3],c+=n*B,l+=n*M,u+=n*U,d+=n*L,h+=n*D,p+=n*z,f+=n*W,g+=n*F,w+=n*H,b+=n*G,m+=n*q,y+=n*Z,v+=n*V,x+=n*Y,C+=n*K,k+=n*X,n=t[4],l+=n*B,u+=n*M,d+=n*U,h+=n*L,p+=n*D,f+=n*z,g+=n*W,w+=n*F,b+=n*H,m+=n*G,y+=n*q,v+=n*Z,x+=n*V,C+=n*Y,k+=n*K,E+=n*X,n=t[5],u+=n*B,d+=n*M,h+=n*U,p+=n*L,f+=n*D,g+=n*z,w+=n*W,b+=n*F,m+=n*H,y+=n*G,v+=n*q,x+=n*Z,C+=n*V,k+=n*Y,E+=n*K,P+=n*X,n=t[6],d+=n*B,h+=n*M,p+=n*U,f+=n*L,g+=n*D,w+=n*z,b+=n*W,m+=n*F,y+=n*H,v+=n*G,x+=n*q,C+=n*Z,k+=n*V,E+=n*Y,P+=n*K,$+=n*X,n=t[7],h+=n*B,p+=n*M,f+=n*U,g+=n*L,w+=n*D,b+=n*z,m+=n*W,y+=n*F,v+=n*H,x+=n*G,C+=n*q,k+=n*Z,E+=n*V,P+=n*Y,$+=n*K,S+=n*X,n=t[8],p+=n*B,f+=n*M,g+=n*U,w+=n*L,b+=n*D,m+=n*z,y+=n*W,v+=n*F,x+=n*H,C+=n*G,k+=n*q,E+=n*Z,P+=n*V,$+=n*Y,S+=n*K,_+=n*X,n=t[9],f+=n*B,g+=n*M,w+=n*U,b+=n*L,m+=n*D,y+=n*z,v+=n*W,x+=n*F,C+=n*H,k+=n*G,E+=n*q,P+=n*Z,$+=n*V,S+=n*Y,_+=n*K,A+=n*X,n=t[10],g+=n*B,w+=n*M,b+=n*U,m+=n*L,y+=n*D,v+=n*z,x+=n*W,C+=n*F,k+=n*H,E+=n*G,P+=n*q,$+=n*Z,S+=n*V,_+=n*Y,A+=n*K,I+=n*X,n=t[11],w+=n*B,b+=n*M,m+=n*U,y+=n*L,v+=n*D,x+=n*z,C+=n*W,k+=n*F,E+=n*H,P+=n*G,$+=n*q,S+=n*Z,_+=n*V,A+=n*Y,I+=n*K,O+=n*X,n=t[12],b+=n*B,m+=n*M,y+=n*U,v+=n*L,x+=n*D,C+=n*z,k+=n*W,E+=n*F,P+=n*H,$+=n*G,S+=n*q,_+=n*Z,A+=n*V,I+=n*Y,O+=n*K,T+=n*X,n=t[13],m+=n*B,y+=n*M,v+=n*U,x+=n*L,C+=n*D,k+=n*z,E+=n*W,P+=n*F,$+=n*H,S+=n*G,_+=n*q,A+=n*Z,I+=n*V,O+=n*Y,T+=n*K,N+=n*X,n=t[14],y+=n*B,v+=n*M,x+=n*U,C+=n*L,k+=n*D,E+=n*z,P+=n*W,$+=n*F,S+=n*H,_+=n*G,A+=n*q,I+=n*Z,O+=n*V,T+=n*Y,N+=n*K,R+=n*X,n=t[15],v+=n*B,x+=n*M,C+=n*U,k+=n*L,E+=n*D,P+=n*z,$+=n*W,S+=n*F,_+=n*H,A+=n*G,I+=n*q,O+=n*Z,T+=n*V,N+=n*Y,R+=n*K,j+=n*X,o+=38*x,a+=38*C,s+=38*k,c+=38*E,l+=38*P,u+=38*$,d+=38*S,h+=38*_,p+=38*A,f+=38*I,g+=38*O,w+=38*T,b+=38*N,m+=38*R,y+=38*j,i=1,n=o+i+65535,i=Math.floor(n/65536),o=n-65536*i,n=a+i+65535,i=Math.floor(n/65536),a=n-65536*i,n=s+i+65535,i=Math.floor(n/65536),s=n-65536*i,n=c+i+65535,i=Math.floor(n/65536),c=n-65536*i,n=l+i+65535,i=Math.floor(n/65536),l=n-65536*i,n=u+i+65535,i=Math.floor(n/65536),u=n-65536*i,n=d+i+65535,i=Math.floor(n/65536),d=n-65536*i,n=h+i+65535,i=Math.floor(n/65536),h=n-65536*i,n=p+i+65535,i=Math.floor(n/65536),p=n-65536*i,n=f+i+65535,i=Math.floor(n/65536),f=n-65536*i,n=g+i+65535,i=Math.floor(n/65536),g=n-65536*i,n=w+i+65535,i=Math.floor(n/65536),w=n-65536*i,n=b+i+65535,i=Math.floor(n/65536),b=n-65536*i,n=m+i+65535,i=Math.floor(n/65536),m=n-65536*i,n=y+i+65535,i=Math.floor(n/65536),y=n-65536*i,n=v+i+65535,i=Math.floor(n/65536),v=n-65536*i,o+=i-1+37*(i-1),i=1,n=o+i+65535,i=Math.floor(n/65536),o=n-65536*i,n=a+i+65535,i=Math.floor(n/65536),a=n-65536*i,n=s+i+65535,i=Math.floor(n/65536),s=n-65536*i,n=c+i+65535,i=Math.floor(n/65536),c=n-65536*i,n=l+i+65535,i=Math.floor(n/65536),l=n-65536*i,n=u+i+65535,i=Math.floor(n/65536),u=n-65536*i,n=d+i+65535,i=Math.floor(n/65536),d=n-65536*i,n=h+i+65535,i=Math.floor(n/65536),h=n-65536*i,n=p+i+65535,i=Math.floor(n/65536),p=n-65536*i,n=f+i+65535,i=Math.floor(n/65536),f=n-65536*i,n=g+i+65535,i=Math.floor(n/65536),g=n-65536*i,n=w+i+65535,i=Math.floor(n/65536),w=n-65536*i,n=b+i+65535,i=Math.floor(n/65536),b=n-65536*i,n=m+i+65535,i=Math.floor(n/65536),m=n-65536*i,n=y+i+65535,i=Math.floor(n/65536),y=n-65536*i,n=v+i+65535,i=Math.floor(n/65536),v=n-65536*i,o+=i-1+37*(i-1),e[0]=o,e[1]=a,e[2]=s,e[3]=c,e[4]=l,e[5]=u,e[6]=d,e[7]=h,e[8]=p,e[9]=f,e[10]=g,e[11]=w,e[12]=b,e[13]=m,e[14]=y,e[15]=v}function p(e,t){h(e,t,t)}function f(e,t){const r=new Uint8Array(32),n=new Float64Array(80),i=o(),a=o(),f=o(),g=o(),w=o(),b=o();for(let t=0;t<31;t++)r[t]=e[t];r[31]=127&e[31]|64,r[0]&=248,function(e,t){for(let r=0;r<16;r++)e[r]=t[2*r]+(t[2*r+1]<<8);e[15]&=32767}(n,t);for(let e=0;e<16;e++)a[e]=n[e];i[0]=g[0]=1;for(let e=254;e>=0;--e){const t=r[e>>>3]>>>(7&e)&1;l(i,a,t),l(f,g,t),u(w,i,f),d(i,i,f),u(f,a,g),d(a,a,g),p(g,w),p(b,i),h(i,f,i),h(f,a,w),u(w,i,f),d(i,i,f),p(a,i),d(f,g,b),h(i,f,s),u(i,i,g),h(f,f,i),h(i,g,b),h(g,a,n),p(a,w),l(i,a,t),l(f,g,t)}for(let e=0;e<16;e++)n[e+16]=i[e],n[e+32]=f[e],n[e+48]=a[e],n[e+64]=g[e];const m=n.subarray(32),y=n.subarray(16);!function(e,t){const r=o();for(let e=0;e<16;e++)r[e]=t[e];for(let e=253;e>=0;e--)p(r,r),2!==e&&4!==e&&h(r,r,t);for(let t=0;t<16;t++)e[t]=r[t]}(m,m),h(y,y,m);const v=new Uint8Array(32);return function(e,t){const r=o(),n=o();for(let e=0;e<16;e++)n[e]=t[e];c(n),c(n),c(n);for(let e=0;e<2;e++){r[0]=n[0]-65517;for(let e=1;e<15;e++)r[e]=n[e]-65535-(r[e-1]>>16&1),r[e-1]&=65535;r[15]=n[15]-32767-(r[14]>>16&1);const e=r[15]>>16&1;r[14]&=65535,l(n,r,1-e)}for(let t=0;t<16;t++)e[2*t]=255&n[t],e[2*t+1]=n[t]>>8}(v,y),v}t.Au=function(e){const r=(0,n.randomBytes)(32,e),o=function(e){if(e.length!==t.KS)throw new Error(`x25519: seed must be ${t.KS} bytes`);const r=new Uint8Array(e);return{publicKey:(n=r,f(n,a)),secretKey:r};var n}(r);return(0,i.wipe)(r),o},t.gi=function(e,r,n=!1){if(e.length!==t.kz)throw new Error("X25519: incorrect secret key length");if(r.length!==t.kz)throw new Error("X25519: incorrect public key length");const i=f(e,r);if(n){let e=0;for(let t=0;t<i.length;t++)e|=i[t];if(0===e)throw new Error("X25519: invalid shared key")}return i}},9528:(e,t,r)=>{"use strict";const n=r(610),i=r(4020),o=r(500),a=r(2806),s=Symbol("encodeFragmentIdentifier");function c(e){if("string"!=typeof e||1!==e.length)throw new TypeError("arrayFormatSeparator must be single character string")}function l(e,t){return t.encode?t.strict?n(e):encodeURIComponent(e):e}function u(e,t){return t.decode?i(e):e}function d(e){return Array.isArray(e)?e.sort():"object"==typeof e?d(Object.keys(e)).sort(((e,t)=>Number(e)-Number(t))).map((t=>e[t])):e}function h(e){const t=e.indexOf("#");return-1!==t&&(e=e.slice(0,t)),e}function p(e){const t=(e=h(e)).indexOf("?");return-1===t?"":e.slice(t+1)}function f(e,t){return t.parseNumbers&&!Number.isNaN(Number(e))&&"string"==typeof e&&""!==e.trim()?e=Number(e):!t.parseBooleans||null===e||"true"!==e.toLowerCase()&&"false"!==e.toLowerCase()||(e="true"===e.toLowerCase()),e}function g(e,t){c((t=Object.assign({decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1},t)).arrayFormatSeparator);const r=function(e){let t;switch(e.arrayFormat){case"index":return(e,r,n)=>{t=/\[(\d*)\]$/.exec(e),e=e.replace(/\[\d*\]$/,""),t?(void 0===n[e]&&(n[e]={}),n[e][t[1]]=r):n[e]=r};case"bracket":return(e,r,n)=>{t=/(\[\])$/.exec(e),e=e.replace(/\[\]$/,""),t?void 0!==n[e]?n[e]=[].concat(n[e],r):n[e]=[r]:n[e]=r};case"colon-list-separator":return(e,r,n)=>{t=/(:list)$/.exec(e),e=e.replace(/:list$/,""),t?void 0!==n[e]?n[e]=[].concat(n[e],r):n[e]=[r]:n[e]=r};case"comma":case"separator":return(t,r,n)=>{const i="string"==typeof r&&r.includes(e.arrayFormatSeparator),o="string"==typeof r&&!i&&u(r,e).includes(e.arrayFormatSeparator);r=o?u(r,e):r;const a=i||o?r.split(e.arrayFormatSeparator).map((t=>u(t,e))):null===r?r:u(r,e);n[t]=a};case"bracket-separator":return(t,r,n)=>{const i=/(\[\])$/.test(t);if(t=t.replace(/\[\]$/,""),!i)return void(n[t]=r?u(r,e):r);const o=null===r?[]:r.split(e.arrayFormatSeparator).map((t=>u(t,e)));void 0!==n[t]?n[t]=[].concat(n[t],o):n[t]=o};default:return(e,t,r)=>{void 0!==r[e]?r[e]=[].concat(r[e],t):r[e]=t}}}(t),n=Object.create(null);if("string"!=typeof e)return n;if(!(e=e.trim().replace(/^[?#&]/,"")))return n;for(const i of e.split("&")){if(""===i)continue;let[e,a]=o(t.decode?i.replace(/\+/g," "):i,"=");a=void 0===a?null:["comma","separator","bracket-separator"].includes(t.arrayFormat)?a:u(a,t),r(u(e,t),a,n)}for(const e of Object.keys(n)){const r=n[e];if("object"==typeof r&&null!==r)for(const e of Object.keys(r))r[e]=f(r[e],t);else n[e]=f(r,t)}return!1===t.sort?n:(!0===t.sort?Object.keys(n).sort():Object.keys(n).sort(t.sort)).reduce(((e,t)=>{const r=n[t];return Boolean(r)&&"object"==typeof r&&!Array.isArray(r)?e[t]=d(r):e[t]=r,e}),Object.create(null))}t.extract=p,t.parse=g,t.stringify=(e,t)=>{if(!e)return"";c((t=Object.assign({encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:","},t)).arrayFormatSeparator);const r=r=>t.skipNull&&null==e[r]||t.skipEmptyString&&""===e[r],n=function(e){switch(e.arrayFormat){case"index":return t=>(r,n)=>{const i=r.length;return void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,[l(t,e),"[",i,"]"].join("")]:[...r,[l(t,e),"[",l(i,e),"]=",l(n,e)].join("")]};case"bracket":return t=>(r,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,[l(t,e),"[]"].join("")]:[...r,[l(t,e),"[]=",l(n,e)].join("")];case"colon-list-separator":return t=>(r,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,[l(t,e),":list="].join("")]:[...r,[l(t,e),":list=",l(n,e)].join("")];case"comma":case"separator":case"bracket-separator":{const t="bracket-separator"===e.arrayFormat?"[]=":"=";return r=>(n,i)=>void 0===i||e.skipNull&&null===i||e.skipEmptyString&&""===i?n:(i=null===i?"":i,0===n.length?[[l(r,e),t,l(i,e)].join("")]:[[n,l(i,e)].join(e.arrayFormatSeparator)])}default:return t=>(r,n)=>void 0===n||e.skipNull&&null===n||e.skipEmptyString&&""===n?r:null===n?[...r,l(t,e)]:[...r,[l(t,e),"=",l(n,e)].join("")]}}(t),i={};for(const t of Object.keys(e))r(t)||(i[t]=e[t]);const o=Object.keys(i);return!1!==t.sort&&o.sort(t.sort),o.map((r=>{const i=e[r];return void 0===i?"":null===i?l(r,t):Array.isArray(i)?0===i.length&&"bracket-separator"===t.arrayFormat?l(r,t)+"[]":i.reduce(n(r),[]).join("&"):l(r,t)+"="+l(i,t)})).filter((e=>e.length>0)).join("&")},t.parseUrl=(e,t)=>{t=Object.assign({decode:!0},t);const[r,n]=o(e,"#");return Object.assign({url:r.split("?")[0]||"",query:g(p(e),t)},t&&t.parseFragmentIdentifier&&n?{fragmentIdentifier:u(n,t)}:{})},t.stringifyUrl=(e,r)=>{r=Object.assign({encode:!0,strict:!0,[s]:!0},r);const n=h(e.url).split("?")[0]||"",i=t.extract(e.url),o=t.parse(i,{sort:!1}),a=Object.assign(o,e.query);let c=t.stringify(a,r);c&&(c=`?${c}`);let u=function(e){let t="";const r=e.indexOf("#");return-1!==r&&(t=e.slice(r)),t}(e.url);return e.fragmentIdentifier&&(u=`#${r[s]?l(e.fragmentIdentifier,r):e.fragmentIdentifier}`),`${n}${c}${u}`},t.pick=(e,r,n)=>{n=Object.assign({parseFragmentIdentifier:!0,[s]:!1},n);const{url:i,query:o,fragmentIdentifier:c}=t.parseUrl(e,n);return t.stringifyUrl({url:i,query:a(o,r),fragmentIdentifier:c},n)},t.exclude=(e,r,n)=>{const i=Array.isArray(r)?e=>!r.includes(e):(e,t)=>!r(e,t);return t.pick(e,i,n)}},3368:(e,t,r)=>{"use strict";r.d(t,{RELAY_JSONRPC:()=>n}),r(1882);const n={waku:{publish:"waku_publish",batchPublish:"waku_batchPublish",subscribe:"waku_subscribe",batchSubscribe:"waku_batchSubscribe",subscription:"waku_subscription",unsubscribe:"waku_unsubscribe",batchUnsubscribe:"waku_batchUnsubscribe"},irn:{publish:"irn_publish",batchPublish:"irn_batchPublish",subscribe:"irn_subscribe",batchSubscribe:"irn_batchSubscribe",subscription:"irn_subscription",unsubscribe:"irn_unsubscribe",batchUnsubscribe:"irn_batchUnsubscribe"},iridium:{publish:"iridium_publish",batchPublish:"iridium_batchPublish",subscribe:"iridium_subscribe",batchSubscribe:"iridium_batchSubscribe",subscription:"iridium_subscription",unsubscribe:"iridium_unsubscribe",batchUnsubscribe:"iridium_batchUnsubscribe"}}},1882:()=>{},6900:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=r(655);n.__exportStar(r(6869),t),n.__exportStar(r(8033),t)},6869:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ONE_THOUSAND=t.ONE_HUNDRED=void 0,t.ONE_HUNDRED=100,t.ONE_THOUSAND=1e3},8033:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ONE_YEAR=t.FOUR_WEEKS=t.THREE_WEEKS=t.TWO_WEEKS=t.ONE_WEEK=t.THIRTY_DAYS=t.SEVEN_DAYS=t.FIVE_DAYS=t.THREE_DAYS=t.ONE_DAY=t.TWENTY_FOUR_HOURS=t.TWELVE_HOURS=t.SIX_HOURS=t.THREE_HOURS=t.ONE_HOUR=t.SIXTY_MINUTES=t.THIRTY_MINUTES=t.TEN_MINUTES=t.FIVE_MINUTES=t.ONE_MINUTE=t.SIXTY_SECONDS=t.THIRTY_SECONDS=t.TEN_SECONDS=t.FIVE_SECONDS=t.ONE_SECOND=void 0,t.ONE_SECOND=1,t.FIVE_SECONDS=5,t.TEN_SECONDS=10,t.THIRTY_SECONDS=30,t.SIXTY_SECONDS=60,t.ONE_MINUTE=t.SIXTY_SECONDS,t.FIVE_MINUTES=5*t.ONE_MINUTE,t.TEN_MINUTES=10*t.ONE_MINUTE,t.THIRTY_MINUTES=30*t.ONE_MINUTE,t.SIXTY_MINUTES=60*t.ONE_MINUTE,t.ONE_HOUR=t.SIXTY_MINUTES,t.THREE_HOURS=3*t.ONE_HOUR,t.SIX_HOURS=6*t.ONE_HOUR,t.TWELVE_HOURS=12*t.ONE_HOUR,t.TWENTY_FOUR_HOURS=24*t.ONE_HOUR,t.ONE_DAY=t.TWENTY_FOUR_HOURS,t.THREE_DAYS=3*t.ONE_DAY,t.FIVE_DAYS=5*t.ONE_DAY,t.SEVEN_DAYS=7*t.ONE_DAY,t.THIRTY_DAYS=30*t.ONE_DAY,t.ONE_WEEK=t.SEVEN_DAYS,t.TWO_WEEKS=2*t.ONE_WEEK,t.THREE_WEEKS=3*t.ONE_WEEK,t.FOUR_WEEKS=4*t.ONE_WEEK,t.ONE_YEAR=365*t.ONE_DAY},6736:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=r(655);n.__exportStar(r(4273),t),n.__exportStar(r(7001),t),n.__exportStar(r(2939),t),n.__exportStar(r(6900),t)},2939:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),r(655).__exportStar(r(8766),t)},8766:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.IWatch=void 0,t.IWatch=class{}},3207:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.fromMiliseconds=t.toMiliseconds=void 0;const n=r(6900);t.toMiliseconds=function(e){return e*n.ONE_THOUSAND},t.fromMiliseconds=function(e){return Math.floor(e/n.ONE_THOUSAND)}},3873:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.delay=void 0,t.delay=function(e){return new Promise((t=>{setTimeout((()=>{t(!0)}),e)}))}},4273:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=r(655);n.__exportStar(r(3873),t),n.__exportStar(r(3207),t)},7001:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Watch=void 0;class r{constructor(){this.timestamps=new Map}start(e){if(this.timestamps.has(e))throw new Error(`Watch already started for label: ${e}`);this.timestamps.set(e,{started:Date.now()})}stop(e){const t=this.get(e);if(void 0!==t.elapsed)throw new Error(`Watch already stopped for label: ${e}`);const r=Date.now()-t.started;this.timestamps.set(e,{started:t.started,elapsed:r})}get(e){const t=this.timestamps.get(e);if(void 0===t)throw new Error(`No timestamp found for label: ${e}`);return t}elapsed(e){const t=this.get(e);return t.elapsed||Date.now()-t.started}}t.Watch=r,t.default=r},2873:(e,t)=>{"use strict";function r(e){let t;return"undefined"!=typeof window&&void 0!==window[e]&&(t=window[e]),t}function n(e){const t=r(e);if(!t)throw new Error(`${e} is not defined in Window`);return t}Object.defineProperty(t,"__esModule",{value:!0}),t.getLocalStorage=t.getLocalStorageOrThrow=t.getCrypto=t.getCryptoOrThrow=t.getLocation=t.getLocationOrThrow=t.getNavigator=t.getNavigatorOrThrow=t.getDocument=t.getDocumentOrThrow=t.getFromWindowOrThrow=t.getFromWindow=void 0,t.getFromWindow=r,t.getFromWindowOrThrow=n,t.getDocumentOrThrow=function(){return n("document")},t.getDocument=function(){return r("document")},t.getNavigatorOrThrow=function(){return n("navigator")},t.getNavigator=function(){return r("navigator")},t.getLocationOrThrow=function(){return n("location")},t.getLocation=function(){return r("location")},t.getCryptoOrThrow=function(){return n("crypto")},t.getCrypto=function(){return r("crypto")},t.getLocalStorageOrThrow=function(){return n("localStorage")},t.getLocalStorage=function(){return r("localStorage")}},5755:(e,t,r)=>{"use strict";t.D=void 0;const n=r(2873);t.D=function(){let e,t;try{e=n.getDocumentOrThrow(),t=n.getLocationOrThrow()}catch(e){return null}function r(...t){const r=e.getElementsByTagName("meta");for(let e=0;e<r.length;e++){const n=r[e],i=["itemprop","property","name"].map((e=>n.getAttribute(e))).filter((e=>!!e&&t.includes(e)));if(i.length&&i){const e=n.getAttribute("content");if(e)return e}}return""}const i=function(){let t=r("name","og:site_name","og:title","twitter:title");return t||(t=e.title),t}();return{description:r("description","og:description","twitter:description","keywords"),url:t.origin,icons:function(){const r=e.getElementsByTagName("link"),n=[];for(let e=0;e<r.length;e++){const i=r[e],o=i.getAttribute("rel");if(o&&o.toLowerCase().indexOf("icon")>-1){const e=i.getAttribute("href");if(e)if(-1===e.toLowerCase().indexOf("https:")&&-1===e.toLowerCase().indexOf("http:")&&0!==e.indexOf("//")){let r=t.protocol+"//"+t.host;if(0===e.indexOf("/"))r+=e;else{const n=t.pathname.split("/");n.pop(),r+=n.join("/")+"/"+e}n.push(r)}else if(0===e.indexOf("//")){const r=t.protocol+e;n.push(r)}else n.push(e)}}return n}(),name:i}}},9742:(e,t)=>{"use strict";t.byteLength=function(e){var t=s(e),r=t[0],n=t[1];return 3*(r+n)/4-n},t.toByteArray=function(e){var t,r,o=s(e),a=o[0],c=o[1],l=new i(function(e,t,r){return 3*(t+r)/4-r}(0,a,c)),u=0,d=c>0?a-4:a;for(r=0;r<d;r+=4)t=n[e.charCodeAt(r)]<<18|n[e.charCodeAt(r+1)]<<12|n[e.charCodeAt(r+2)]<<6|n[e.charCodeAt(r+3)],l[u++]=t>>16&255,l[u++]=t>>8&255,l[u++]=255&t;return 2===c&&(t=n[e.charCodeAt(r)]<<2|n[e.charCodeAt(r+1)]>>4,l[u++]=255&t),1===c&&(t=n[e.charCodeAt(r)]<<10|n[e.charCodeAt(r+1)]<<4|n[e.charCodeAt(r+2)]>>2,l[u++]=t>>8&255,l[u++]=255&t),l},t.fromByteArray=function(e){for(var t,n=e.length,i=n%3,o=[],a=16383,s=0,l=n-i;s<l;s+=a)o.push(c(e,s,s+a>l?l:s+a));return 1===i?(t=e[n-1],o.push(r[t>>2]+r[t<<4&63]+"==")):2===i&&(t=(e[n-2]<<8)+e[n-1],o.push(r[t>>10]+r[t>>4&63]+r[t<<2&63]+"=")),o.join("")};for(var r=[],n=[],i="undefined"!=typeof Uint8Array?Uint8Array:Array,o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=0;a<64;++a)r[a]=o[a],n[o.charCodeAt(a)]=a;function s(e){var t=e.length;if(t%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=e.indexOf("=");return-1===r&&(r=t),[r,r===t?0:4-r%4]}function c(e,t,n){for(var i,o,a=[],s=t;s<n;s+=3)i=(e[s]<<16&16711680)+(e[s+1]<<8&65280)+(255&e[s+2]),a.push(r[(o=i)>>18&63]+r[o>>12&63]+r[o>>6&63]+r[63&o]);return a.join("")}n["-".charCodeAt(0)]=62,n["_".charCodeAt(0)]=63},8764:(e,t,r)=>{"use strict";const n=r(9742),i=r(645),o="function"==typeof Symbol&&"function"==typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):null;t.Buffer=c,t.SlowBuffer=function(e){return+e!=e&&(e=0),c.alloc(+e)},t.INSPECT_MAX_BYTES=50;const a=2147483647;function s(e){if(e>a)throw new RangeError('The value "'+e+'" is invalid for option "size"');const t=new Uint8Array(e);return Object.setPrototypeOf(t,c.prototype),t}function c(e,t,r){if("number"==typeof e){if("string"==typeof t)throw new TypeError('The "string" argument must be of type string. Received type number');return d(e)}return l(e,t,r)}function l(e,t,r){if("string"==typeof e)return function(e,t){if("string"==typeof t&&""!==t||(t="utf8"),!c.isEncoding(t))throw new TypeError("Unknown encoding: "+t);const r=0|g(e,t);let n=s(r);const i=n.write(e,t);return i!==r&&(n=n.slice(0,i)),n}(e,t);if(ArrayBuffer.isView(e))return function(e){if(Y(e,Uint8Array)){const t=new Uint8Array(e);return p(t.buffer,t.byteOffset,t.byteLength)}return h(e)}(e);if(null==e)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e);if(Y(e,ArrayBuffer)||e&&Y(e.buffer,ArrayBuffer))return p(e,t,r);if("undefined"!=typeof SharedArrayBuffer&&(Y(e,SharedArrayBuffer)||e&&Y(e.buffer,SharedArrayBuffer)))return p(e,t,r);if("number"==typeof e)throw new TypeError('The "value" argument must not be of type number. Received type number');const n=e.valueOf&&e.valueOf();if(null!=n&&n!==e)return c.from(n,t,r);const i=function(e){if(c.isBuffer(e)){const t=0|f(e.length),r=s(t);return 0===r.length||e.copy(r,0,0,t),r}return void 0!==e.length?"number"!=typeof e.length||K(e.length)?s(0):h(e):"Buffer"===e.type&&Array.isArray(e.data)?h(e.data):void 0}(e);if(i)return i;if("undefined"!=typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof e[Symbol.toPrimitive])return c.from(e[Symbol.toPrimitive]("string"),t,r);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e)}function u(e){if("number"!=typeof e)throw new TypeError('"size" argument must be of type number');if(e<0)throw new RangeError('The value "'+e+'" is invalid for option "size"')}function d(e){return u(e),s(e<0?0:0|f(e))}function h(e){const t=e.length<0?0:0|f(e.length),r=s(t);for(let n=0;n<t;n+=1)r[n]=255&e[n];return r}function p(e,t,r){if(t<0||e.byteLength<t)throw new RangeError('"offset" is outside of buffer bounds');if(e.byteLength<t+(r||0))throw new RangeError('"length" is outside of buffer bounds');let n;return n=void 0===t&&void 0===r?new Uint8Array(e):void 0===r?new Uint8Array(e,t):new Uint8Array(e,t,r),Object.setPrototypeOf(n,c.prototype),n}function f(e){if(e>=a)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+a.toString(16)+" bytes");return 0|e}function g(e,t){if(c.isBuffer(e))return e.length;if(ArrayBuffer.isView(e)||Y(e,ArrayBuffer))return e.byteLength;if("string"!=typeof e)throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof e);const r=e.length,n=arguments.length>2&&!0===arguments[2];if(!n&&0===r)return 0;let i=!1;for(;;)switch(t){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":return q(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return Z(e).length;default:if(i)return n?-1:q(e).length;t=(""+t).toLowerCase(),i=!0}}function w(e,t,r){let n=!1;if((void 0===t||t<0)&&(t=0),t>this.length)return"";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return"";if((r>>>=0)<=(t>>>=0))return"";for(e||(e="utf8");;)switch(e){case"hex":return I(this,t,r);case"utf8":case"utf-8":return $(this,t,r);case"ascii":return _(this,t,r);case"latin1":case"binary":return A(this,t,r);case"base64":return P(this,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return O(this,t,r);default:if(n)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),n=!0}}function b(e,t,r){const n=e[t];e[t]=e[r],e[r]=n}function m(e,t,r,n,i){if(0===e.length)return-1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),K(r=+r)&&(r=i?0:e.length-1),r<0&&(r=e.length+r),r>=e.length){if(i)return-1;r=e.length-1}else if(r<0){if(!i)return-1;r=0}if("string"==typeof t&&(t=c.from(t,n)),c.isBuffer(t))return 0===t.length?-1:y(e,t,r,n,i);if("number"==typeof t)return t&=255,"function"==typeof Uint8Array.prototype.indexOf?i?Uint8Array.prototype.indexOf.call(e,t,r):Uint8Array.prototype.lastIndexOf.call(e,t,r):y(e,[t],r,n,i);throw new TypeError("val must be string, number or Buffer")}function y(e,t,r,n,i){let o,a=1,s=e.length,c=t.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(e.length<2||t.length<2)return-1;a=2,s/=2,c/=2,r/=2}function l(e,t){return 1===a?e[t]:e.readUInt16BE(t*a)}if(i){let n=-1;for(o=r;o<s;o++)if(l(e,o)===l(t,-1===n?0:o-n)){if(-1===n&&(n=o),o-n+1===c)return n*a}else-1!==n&&(o-=o-n),n=-1}else for(r+c>s&&(r=s-c),o=r;o>=0;o--){let r=!0;for(let n=0;n<c;n++)if(l(e,o+n)!==l(t,n)){r=!1;break}if(r)return o}return-1}function v(e,t,r,n){r=Number(r)||0;const i=e.length-r;n?(n=Number(n))>i&&(n=i):n=i;const o=t.length;let a;for(n>o/2&&(n=o/2),a=0;a<n;++a){const n=parseInt(t.substr(2*a,2),16);if(K(n))return a;e[r+a]=n}return a}function x(e,t,r,n){return V(q(t,e.length-r),e,r,n)}function C(e,t,r,n){return V(function(e){const t=[];for(let r=0;r<e.length;++r)t.push(255&e.charCodeAt(r));return t}(t),e,r,n)}function k(e,t,r,n){return V(Z(t),e,r,n)}function E(e,t,r,n){return V(function(e,t){let r,n,i;const o=[];for(let a=0;a<e.length&&!((t-=2)<0);++a)r=e.charCodeAt(a),n=r>>8,i=r%256,o.push(i),o.push(n);return o}(t,e.length-r),e,r,n)}function P(e,t,r){return 0===t&&r===e.length?n.fromByteArray(e):n.fromByteArray(e.slice(t,r))}function $(e,t,r){r=Math.min(e.length,r);const n=[];let i=t;for(;i<r;){const t=e[i];let o=null,a=t>239?4:t>223?3:t>191?2:1;if(i+a<=r){let r,n,s,c;switch(a){case 1:t<128&&(o=t);break;case 2:r=e[i+1],128==(192&r)&&(c=(31&t)<<6|63&r,c>127&&(o=c));break;case 3:r=e[i+1],n=e[i+2],128==(192&r)&&128==(192&n)&&(c=(15&t)<<12|(63&r)<<6|63&n,c>2047&&(c<55296||c>57343)&&(o=c));break;case 4:r=e[i+1],n=e[i+2],s=e[i+3],128==(192&r)&&128==(192&n)&&128==(192&s)&&(c=(15&t)<<18|(63&r)<<12|(63&n)<<6|63&s,c>65535&&c<1114112&&(o=c))}}null===o?(o=65533,a=1):o>65535&&(o-=65536,n.push(o>>>10&1023|55296),o=56320|1023&o),n.push(o),i+=a}return function(e){const t=e.length;if(t<=S)return String.fromCharCode.apply(String,e);let r="",n=0;for(;n<t;)r+=String.fromCharCode.apply(String,e.slice(n,n+=S));return r}(n)}t.kMaxLength=a,c.TYPED_ARRAY_SUPPORT=function(){try{const e=new Uint8Array(1),t={foo:function(){return 42}};return Object.setPrototypeOf(t,Uint8Array.prototype),Object.setPrototypeOf(e,t),42===e.foo()}catch(e){return!1}}(),c.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(c.prototype,"parent",{enumerable:!0,get:function(){if(c.isBuffer(this))return this.buffer}}),Object.defineProperty(c.prototype,"offset",{enumerable:!0,get:function(){if(c.isBuffer(this))return this.byteOffset}}),c.poolSize=8192,c.from=function(e,t,r){return l(e,t,r)},Object.setPrototypeOf(c.prototype,Uint8Array.prototype),Object.setPrototypeOf(c,Uint8Array),c.alloc=function(e,t,r){return function(e,t,r){return u(e),e<=0?s(e):void 0!==t?"string"==typeof r?s(e).fill(t,r):s(e).fill(t):s(e)}(e,t,r)},c.allocUnsafe=function(e){return d(e)},c.allocUnsafeSlow=function(e){return d(e)},c.isBuffer=function(e){return null!=e&&!0===e._isBuffer&&e!==c.prototype},c.compare=function(e,t){if(Y(e,Uint8Array)&&(e=c.from(e,e.offset,e.byteLength)),Y(t,Uint8Array)&&(t=c.from(t,t.offset,t.byteLength)),!c.isBuffer(e)||!c.isBuffer(t))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(e===t)return 0;let r=e.length,n=t.length;for(let i=0,o=Math.min(r,n);i<o;++i)if(e[i]!==t[i]){r=e[i],n=t[i];break}return r<n?-1:n<r?1:0},c.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},c.concat=function(e,t){if(!Array.isArray(e))throw new TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return c.alloc(0);let r;if(void 0===t)for(t=0,r=0;r<e.length;++r)t+=e[r].length;const n=c.allocUnsafe(t);let i=0;for(r=0;r<e.length;++r){let t=e[r];if(Y(t,Uint8Array))i+t.length>n.length?(c.isBuffer(t)||(t=c.from(t)),t.copy(n,i)):Uint8Array.prototype.set.call(n,t,i);else{if(!c.isBuffer(t))throw new TypeError('"list" argument must be an Array of Buffers');t.copy(n,i)}i+=t.length}return n},c.byteLength=g,c.prototype._isBuffer=!0,c.prototype.swap16=function(){const e=this.length;if(e%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let t=0;t<e;t+=2)b(this,t,t+1);return this},c.prototype.swap32=function(){const e=this.length;if(e%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let t=0;t<e;t+=4)b(this,t,t+3),b(this,t+1,t+2);return this},c.prototype.swap64=function(){const e=this.length;if(e%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let t=0;t<e;t+=8)b(this,t,t+7),b(this,t+1,t+6),b(this,t+2,t+5),b(this,t+3,t+4);return this},c.prototype.toString=function(){const e=this.length;return 0===e?"":0===arguments.length?$(this,0,e):w.apply(this,arguments)},c.prototype.toLocaleString=c.prototype.toString,c.prototype.equals=function(e){if(!c.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e||0===c.compare(this,e)},c.prototype.inspect=function(){let e="";const r=t.INSPECT_MAX_BYTES;return e=this.toString("hex",0,r).replace(/(.{2})/g,"$1 ").trim(),this.length>r&&(e+=" ... "),"<Buffer "+e+">"},o&&(c.prototype[o]=c.prototype.inspect),c.prototype.compare=function(e,t,r,n,i){if(Y(e,Uint8Array)&&(e=c.from(e,e.offset,e.byteLength)),!c.isBuffer(e))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof e);if(void 0===t&&(t=0),void 0===r&&(r=e?e.length:0),void 0===n&&(n=0),void 0===i&&(i=this.length),t<0||r>e.length||n<0||i>this.length)throw new RangeError("out of range index");if(n>=i&&t>=r)return 0;if(n>=i)return-1;if(t>=r)return 1;if(this===e)return 0;let o=(i>>>=0)-(n>>>=0),a=(r>>>=0)-(t>>>=0);const s=Math.min(o,a),l=this.slice(n,i),u=e.slice(t,r);for(let e=0;e<s;++e)if(l[e]!==u[e]){o=l[e],a=u[e];break}return o<a?-1:a<o?1:0},c.prototype.includes=function(e,t,r){return-1!==this.indexOf(e,t,r)},c.prototype.indexOf=function(e,t,r){return m(this,e,t,r,!0)},c.prototype.lastIndexOf=function(e,t,r){return m(this,e,t,r,!1)},c.prototype.write=function(e,t,r,n){if(void 0===t)n="utf8",r=this.length,t=0;else if(void 0===r&&"string"==typeof t)n=t,r=this.length,t=0;else{if(!isFinite(t))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0)}const i=this.length-t;if((void 0===r||r>i)&&(r=i),e.length>0&&(r<0||t<0)||t>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");let o=!1;for(;;)switch(n){case"hex":return v(this,e,t,r);case"utf8":case"utf-8":return x(this,e,t,r);case"ascii":case"latin1":case"binary":return C(this,e,t,r);case"base64":return k(this,e,t,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return E(this,e,t,r);default:if(o)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),o=!0}},c.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};const S=4096;function _(e,t,r){let n="";r=Math.min(e.length,r);for(let i=t;i<r;++i)n+=String.fromCharCode(127&e[i]);return n}function A(e,t,r){let n="";r=Math.min(e.length,r);for(let i=t;i<r;++i)n+=String.fromCharCode(e[i]);return n}function I(e,t,r){const n=e.length;(!t||t<0)&&(t=0),(!r||r<0||r>n)&&(r=n);let i="";for(let n=t;n<r;++n)i+=X[e[n]];return i}function O(e,t,r){const n=e.slice(t,r);let i="";for(let e=0;e<n.length-1;e+=2)i+=String.fromCharCode(n[e]+256*n[e+1]);return i}function T(e,t,r){if(e%1!=0||e<0)throw new RangeError("offset is not uint");if(e+t>r)throw new RangeError("Trying to access beyond buffer length")}function N(e,t,r,n,i,o){if(!c.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(t>i||t<o)throw new RangeError('"value" argument is out of bounds');if(r+n>e.length)throw new RangeError("Index out of range")}function R(e,t,r,n,i){W(t,n,i,e,r,7);let o=Number(t&BigInt(4294967295));e[r++]=o,o>>=8,e[r++]=o,o>>=8,e[r++]=o,o>>=8,e[r++]=o;let a=Number(t>>BigInt(32)&BigInt(4294967295));return e[r++]=a,a>>=8,e[r++]=a,a>>=8,e[r++]=a,a>>=8,e[r++]=a,r}function j(e,t,r,n,i){W(t,n,i,e,r,7);let o=Number(t&BigInt(4294967295));e[r+7]=o,o>>=8,e[r+6]=o,o>>=8,e[r+5]=o,o>>=8,e[r+4]=o;let a=Number(t>>BigInt(32)&BigInt(4294967295));return e[r+3]=a,a>>=8,e[r+2]=a,a>>=8,e[r+1]=a,a>>=8,e[r]=a,r+8}function B(e,t,r,n,i,o){if(r+n>e.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function M(e,t,r,n,o){return t=+t,r>>>=0,o||B(e,0,r,4),i.write(e,t,r,n,23,4),r+4}function U(e,t,r,n,o){return t=+t,r>>>=0,o||B(e,0,r,8),i.write(e,t,r,n,52,8),r+8}c.prototype.slice=function(e,t){const r=this.length;(e=~~e)<0?(e+=r)<0&&(e=0):e>r&&(e=r),(t=void 0===t?r:~~t)<0?(t+=r)<0&&(t=0):t>r&&(t=r),t<e&&(t=e);const n=this.subarray(e,t);return Object.setPrototypeOf(n,c.prototype),n},c.prototype.readUintLE=c.prototype.readUIntLE=function(e,t,r){e>>>=0,t>>>=0,r||T(e,t,this.length);let n=this[e],i=1,o=0;for(;++o<t&&(i*=256);)n+=this[e+o]*i;return n},c.prototype.readUintBE=c.prototype.readUIntBE=function(e,t,r){e>>>=0,t>>>=0,r||T(e,t,this.length);let n=this[e+--t],i=1;for(;t>0&&(i*=256);)n+=this[e+--t]*i;return n},c.prototype.readUint8=c.prototype.readUInt8=function(e,t){return e>>>=0,t||T(e,1,this.length),this[e]},c.prototype.readUint16LE=c.prototype.readUInt16LE=function(e,t){return e>>>=0,t||T(e,2,this.length),this[e]|this[e+1]<<8},c.prototype.readUint16BE=c.prototype.readUInt16BE=function(e,t){return e>>>=0,t||T(e,2,this.length),this[e]<<8|this[e+1]},c.prototype.readUint32LE=c.prototype.readUInt32LE=function(e,t){return e>>>=0,t||T(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},c.prototype.readUint32BE=c.prototype.readUInt32BE=function(e,t){return e>>>=0,t||T(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},c.prototype.readBigUInt64LE=J((function(e){F(e>>>=0,"offset");const t=this[e],r=this[e+7];void 0!==t&&void 0!==r||H(e,this.length-8);const n=t+256*this[++e]+65536*this[++e]+this[++e]*2**24,i=this[++e]+256*this[++e]+65536*this[++e]+r*2**24;return BigInt(n)+(BigInt(i)<<BigInt(32))})),c.prototype.readBigUInt64BE=J((function(e){F(e>>>=0,"offset");const t=this[e],r=this[e+7];void 0!==t&&void 0!==r||H(e,this.length-8);const n=t*2**24+65536*this[++e]+256*this[++e]+this[++e],i=this[++e]*2**24+65536*this[++e]+256*this[++e]+r;return(BigInt(n)<<BigInt(32))+BigInt(i)})),c.prototype.readIntLE=function(e,t,r){e>>>=0,t>>>=0,r||T(e,t,this.length);let n=this[e],i=1,o=0;for(;++o<t&&(i*=256);)n+=this[e+o]*i;return i*=128,n>=i&&(n-=Math.pow(2,8*t)),n},c.prototype.readIntBE=function(e,t,r){e>>>=0,t>>>=0,r||T(e,t,this.length);let n=t,i=1,o=this[e+--n];for(;n>0&&(i*=256);)o+=this[e+--n]*i;return i*=128,o>=i&&(o-=Math.pow(2,8*t)),o},c.prototype.readInt8=function(e,t){return e>>>=0,t||T(e,1,this.length),128&this[e]?-1*(255-this[e]+1):this[e]},c.prototype.readInt16LE=function(e,t){e>>>=0,t||T(e,2,this.length);const r=this[e]|this[e+1]<<8;return 32768&r?4294901760|r:r},c.prototype.readInt16BE=function(e,t){e>>>=0,t||T(e,2,this.length);const r=this[e+1]|this[e]<<8;return 32768&r?4294901760|r:r},c.prototype.readInt32LE=function(e,t){return e>>>=0,t||T(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},c.prototype.readInt32BE=function(e,t){return e>>>=0,t||T(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},c.prototype.readBigInt64LE=J((function(e){F(e>>>=0,"offset");const t=this[e],r=this[e+7];void 0!==t&&void 0!==r||H(e,this.length-8);const n=this[e+4]+256*this[e+5]+65536*this[e+6]+(r<<24);return(BigInt(n)<<BigInt(32))+BigInt(t+256*this[++e]+65536*this[++e]+this[++e]*2**24)})),c.prototype.readBigInt64BE=J((function(e){F(e>>>=0,"offset");const t=this[e],r=this[e+7];void 0!==t&&void 0!==r||H(e,this.length-8);const n=(t<<24)+65536*this[++e]+256*this[++e]+this[++e];return(BigInt(n)<<BigInt(32))+BigInt(this[++e]*2**24+65536*this[++e]+256*this[++e]+r)})),c.prototype.readFloatLE=function(e,t){return e>>>=0,t||T(e,4,this.length),i.read(this,e,!0,23,4)},c.prototype.readFloatBE=function(e,t){return e>>>=0,t||T(e,4,this.length),i.read(this,e,!1,23,4)},c.prototype.readDoubleLE=function(e,t){return e>>>=0,t||T(e,8,this.length),i.read(this,e,!0,52,8)},c.prototype.readDoubleBE=function(e,t){return e>>>=0,t||T(e,8,this.length),i.read(this,e,!1,52,8)},c.prototype.writeUintLE=c.prototype.writeUIntLE=function(e,t,r,n){e=+e,t>>>=0,r>>>=0,n||N(this,e,t,r,Math.pow(2,8*r)-1,0);let i=1,o=0;for(this[t]=255&e;++o<r&&(i*=256);)this[t+o]=e/i&255;return t+r},c.prototype.writeUintBE=c.prototype.writeUIntBE=function(e,t,r,n){e=+e,t>>>=0,r>>>=0,n||N(this,e,t,r,Math.pow(2,8*r)-1,0);let i=r-1,o=1;for(this[t+i]=255&e;--i>=0&&(o*=256);)this[t+i]=e/o&255;return t+r},c.prototype.writeUint8=c.prototype.writeUInt8=function(e,t,r){return e=+e,t>>>=0,r||N(this,e,t,1,255,0),this[t]=255&e,t+1},c.prototype.writeUint16LE=c.prototype.writeUInt16LE=function(e,t,r){return e=+e,t>>>=0,r||N(this,e,t,2,65535,0),this[t]=255&e,this[t+1]=e>>>8,t+2},c.prototype.writeUint16BE=c.prototype.writeUInt16BE=function(e,t,r){return e=+e,t>>>=0,r||N(this,e,t,2,65535,0),this[t]=e>>>8,this[t+1]=255&e,t+2},c.prototype.writeUint32LE=c.prototype.writeUInt32LE=function(e,t,r){return e=+e,t>>>=0,r||N(this,e,t,4,4294967295,0),this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e,t+4},c.prototype.writeUint32BE=c.prototype.writeUInt32BE=function(e,t,r){return e=+e,t>>>=0,r||N(this,e,t,4,4294967295,0),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},c.prototype.writeBigUInt64LE=J((function(e,t=0){return R(this,e,t,BigInt(0),BigInt("0xffffffffffffffff"))})),c.prototype.writeBigUInt64BE=J((function(e,t=0){return j(this,e,t,BigInt(0),BigInt("0xffffffffffffffff"))})),c.prototype.writeIntLE=function(e,t,r,n){if(e=+e,t>>>=0,!n){const n=Math.pow(2,8*r-1);N(this,e,t,r,n-1,-n)}let i=0,o=1,a=0;for(this[t]=255&e;++i<r&&(o*=256);)e<0&&0===a&&0!==this[t+i-1]&&(a=1),this[t+i]=(e/o>>0)-a&255;return t+r},c.prototype.writeIntBE=function(e,t,r,n){if(e=+e,t>>>=0,!n){const n=Math.pow(2,8*r-1);N(this,e,t,r,n-1,-n)}let i=r-1,o=1,a=0;for(this[t+i]=255&e;--i>=0&&(o*=256);)e<0&&0===a&&0!==this[t+i+1]&&(a=1),this[t+i]=(e/o>>0)-a&255;return t+r},c.prototype.writeInt8=function(e,t,r){return e=+e,t>>>=0,r||N(this,e,t,1,127,-128),e<0&&(e=255+e+1),this[t]=255&e,t+1},c.prototype.writeInt16LE=function(e,t,r){return e=+e,t>>>=0,r||N(this,e,t,2,32767,-32768),this[t]=255&e,this[t+1]=e>>>8,t+2},c.prototype.writeInt16BE=function(e,t,r){return e=+e,t>>>=0,r||N(this,e,t,2,32767,-32768),this[t]=e>>>8,this[t+1]=255&e,t+2},c.prototype.writeInt32LE=function(e,t,r){return e=+e,t>>>=0,r||N(this,e,t,4,2147483647,-2147483648),this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24,t+4},c.prototype.writeInt32BE=function(e,t,r){return e=+e,t>>>=0,r||N(this,e,t,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},c.prototype.writeBigInt64LE=J((function(e,t=0){return R(this,e,t,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))})),c.prototype.writeBigInt64BE=J((function(e,t=0){return j(this,e,t,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))})),c.prototype.writeFloatLE=function(e,t,r){return M(this,e,t,!0,r)},c.prototype.writeFloatBE=function(e,t,r){return M(this,e,t,!1,r)},c.prototype.writeDoubleLE=function(e,t,r){return U(this,e,t,!0,r)},c.prototype.writeDoubleBE=function(e,t,r){return U(this,e,t,!1,r)},c.prototype.copy=function(e,t,r,n){if(!c.isBuffer(e))throw new TypeError("argument should be a Buffer");if(r||(r=0),n||0===n||(n=this.length),t>=e.length&&(t=e.length),t||(t=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===e.length||0===this.length)return 0;if(t<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),e.length-t<n-r&&(n=e.length-t+r);const i=n-r;return this===e&&"function"==typeof Uint8Array.prototype.copyWithin?this.copyWithin(t,r,n):Uint8Array.prototype.set.call(e,this.subarray(r,n),t),i},c.prototype.fill=function(e,t,r,n){if("string"==typeof e){if("string"==typeof t?(n=t,t=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!c.isEncoding(n))throw new TypeError("Unknown encoding: "+n);if(1===e.length){const t=e.charCodeAt(0);("utf8"===n&&t<128||"latin1"===n)&&(e=t)}}else"number"==typeof e?e&=255:"boolean"==typeof e&&(e=Number(e));if(t<0||this.length<t||this.length<r)throw new RangeError("Out of range index");if(r<=t)return this;let i;if(t>>>=0,r=void 0===r?this.length:r>>>0,e||(e=0),"number"==typeof e)for(i=t;i<r;++i)this[i]=e;else{const o=c.isBuffer(e)?e:c.from(e,n),a=o.length;if(0===a)throw new TypeError('The value "'+e+'" is invalid for argument "value"');for(i=0;i<r-t;++i)this[i+t]=o[i%a]}return this};const L={};function D(e,t,r){L[e]=class extends r{constructor(){super(),Object.defineProperty(this,"message",{value:t.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${e}]`,this.stack,delete this.name}get code(){return e}set code(e){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:e,writable:!0})}toString(){return`${this.name} [${e}]: ${this.message}`}}}function z(e){let t="",r=e.length;const n="-"===e[0]?1:0;for(;r>=n+4;r-=3)t=`_${e.slice(r-3,r)}${t}`;return`${e.slice(0,r)}${t}`}function W(e,t,r,n,i,o){if(e>r||e<t){const n="bigint"==typeof t?"n":"";let i;throw i=o>3?0===t||t===BigInt(0)?`>= 0${n} and < 2${n} ** ${8*(o+1)}${n}`:`>= -(2${n} ** ${8*(o+1)-1}${n}) and < 2 ** ${8*(o+1)-1}${n}`:`>= ${t}${n} and <= ${r}${n}`,new L.ERR_OUT_OF_RANGE("value",i,e)}!function(e,t,r){F(t,"offset"),void 0!==e[t]&&void 0!==e[t+r]||H(t,e.length-(r+1))}(n,i,o)}function F(e,t){if("number"!=typeof e)throw new L.ERR_INVALID_ARG_TYPE(t,"number",e)}function H(e,t,r){if(Math.floor(e)!==e)throw F(e,r),new L.ERR_OUT_OF_RANGE(r||"offset","an integer",e);if(t<0)throw new L.ERR_BUFFER_OUT_OF_BOUNDS;throw new L.ERR_OUT_OF_RANGE(r||"offset",`>= ${r?1:0} and <= ${t}`,e)}D("ERR_BUFFER_OUT_OF_BOUNDS",(function(e){return e?`${e} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"}),RangeError),D("ERR_INVALID_ARG_TYPE",(function(e,t){return`The "${e}" argument must be of type number. Received type ${typeof t}`}),TypeError),D("ERR_OUT_OF_RANGE",(function(e,t,r){let n=`The value of "${e}" is out of range.`,i=r;return Number.isInteger(r)&&Math.abs(r)>2**32?i=z(String(r)):"bigint"==typeof r&&(i=String(r),(r>BigInt(2)**BigInt(32)||r<-(BigInt(2)**BigInt(32)))&&(i=z(i)),i+="n"),n+=` It must be ${t}. Received ${i}`,n}),RangeError);const G=/[^+/0-9A-Za-z-_]/g;function q(e,t){let r;t=t||1/0;const n=e.length;let i=null;const o=[];for(let a=0;a<n;++a){if(r=e.charCodeAt(a),r>55295&&r<57344){if(!i){if(r>56319){(t-=3)>-1&&o.push(239,191,189);continue}if(a+1===n){(t-=3)>-1&&o.push(239,191,189);continue}i=r;continue}if(r<56320){(t-=3)>-1&&o.push(239,191,189),i=r;continue}r=65536+(i-55296<<10|r-56320)}else i&&(t-=3)>-1&&o.push(239,191,189);if(i=null,r<128){if((t-=1)<0)break;o.push(r)}else if(r<2048){if((t-=2)<0)break;o.push(r>>6|192,63&r|128)}else if(r<65536){if((t-=3)<0)break;o.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(r<1114112))throw new Error("Invalid code point");if((t-=4)<0)break;o.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return o}function Z(e){return n.toByteArray(function(e){if((e=(e=e.split("=")[0]).trim().replace(G,"")).length<2)return"";for(;e.length%4!=0;)e+="=";return e}(e))}function V(e,t,r,n){let i;for(i=0;i<n&&!(i+r>=t.length||i>=e.length);++i)t[i+r]=e[i];return i}function Y(e,t){return e instanceof t||null!=e&&null!=e.constructor&&null!=e.constructor.name&&e.constructor.name===t.name}function K(e){return e!=e}const X=function(){const e="0123456789abcdef",t=new Array(256);for(let r=0;r<16;++r){const n=16*r;for(let i=0;i<16;++i)t[n+i]=e[r]+e[i]}return t}();function J(e){return"undefined"==typeof BigInt?Q:e}function Q(){throw new Error("BigInt not supported")}},7484:function(e){e.exports=function(){"use strict";var e=6e4,t=36e5,r="millisecond",n="second",i="minute",o="hour",a="day",s="week",c="month",l="quarter",u="year",d="date",h="Invalid Date",p=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,f=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,g={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(e){var t=["th","st","nd","rd"],r=e%100;return"["+e+(t[(r-20)%10]||t[r]||t[0])+"]"}},w=function(e,t,r){var n=String(e);return!n||n.length>=t?e:""+Array(t+1-n.length).join(r)+e},b={s:w,z:function(e){var t=-e.utcOffset(),r=Math.abs(t),n=Math.floor(r/60),i=r%60;return(t<=0?"+":"-")+w(n,2,"0")+":"+w(i,2,"0")},m:function e(t,r){if(t.date()<r.date())return-e(r,t);var n=12*(r.year()-t.year())+(r.month()-t.month()),i=t.clone().add(n,c),o=r-i<0,a=t.clone().add(n+(o?-1:1),c);return+(-(n+(r-i)/(o?i-a:a-i))||0)},a:function(e){return e<0?Math.ceil(e)||0:Math.floor(e)},p:function(e){return{M:c,y:u,w:s,d:a,D:d,h:o,m:i,s:n,ms:r,Q:l}[e]||String(e||"").toLowerCase().replace(/s$/,"")},u:function(e){return void 0===e}},m="en",y={};y[m]=g;var v="$isDayjsObject",x=function(e){return e instanceof P||!(!e||!e[v])},C=function e(t,r,n){var i;if(!t)return m;if("string"==typeof t){var o=t.toLowerCase();y[o]&&(i=o),r&&(y[o]=r,i=o);var a=t.split("-");if(!i&&a.length>1)return e(a[0])}else{var s=t.name;y[s]=t,i=s}return!n&&i&&(m=i),i||!n&&m},k=function(e,t){if(x(e))return e.clone();var r="object"==typeof t?t:{};return r.date=e,r.args=arguments,new P(r)},E=b;E.l=C,E.i=x,E.w=function(e,t){return k(e,{locale:t.$L,utc:t.$u,x:t.$x,$offset:t.$offset})};var P=function(){function g(e){this.$L=C(e.locale,null,!0),this.parse(e),this.$x=this.$x||e.x||{},this[v]=!0}var w=g.prototype;return w.parse=function(e){this.$d=function(e){var t=e.date,r=e.utc;if(null===t)return new Date(NaN);if(E.u(t))return new Date;if(t instanceof Date)return new Date(t);if("string"==typeof t&&!/Z$/i.test(t)){var n=t.match(p);if(n){var i=n[2]-1||0,o=(n[7]||"0").substring(0,3);return r?new Date(Date.UTC(n[1],i,n[3]||1,n[4]||0,n[5]||0,n[6]||0,o)):new Date(n[1],i,n[3]||1,n[4]||0,n[5]||0,n[6]||0,o)}}return new Date(t)}(e),this.init()},w.init=function(){var e=this.$d;this.$y=e.getFullYear(),this.$M=e.getMonth(),this.$D=e.getDate(),this.$W=e.getDay(),this.$H=e.getHours(),this.$m=e.getMinutes(),this.$s=e.getSeconds(),this.$ms=e.getMilliseconds()},w.$utils=function(){return E},w.isValid=function(){return!(this.$d.toString()===h)},w.isSame=function(e,t){var r=k(e);return this.startOf(t)<=r&&r<=this.endOf(t)},w.isAfter=function(e,t){return k(e)<this.startOf(t)},w.isBefore=function(e,t){return this.endOf(t)<k(e)},w.$g=function(e,t,r){return E.u(e)?this[t]:this.set(r,e)},w.unix=function(){return Math.floor(this.valueOf()/1e3)},w.valueOf=function(){return this.$d.getTime()},w.startOf=function(e,t){var r=this,l=!!E.u(t)||t,h=E.p(e),p=function(e,t){var n=E.w(r.$u?Date.UTC(r.$y,t,e):new Date(r.$y,t,e),r);return l?n:n.endOf(a)},f=function(e,t){return E.w(r.toDate()[e].apply(r.toDate("s"),(l?[0,0,0,0]:[23,59,59,999]).slice(t)),r)},g=this.$W,w=this.$M,b=this.$D,m="set"+(this.$u?"UTC":"");switch(h){case u:return l?p(1,0):p(31,11);case c:return l?p(1,w):p(0,w+1);case s:var y=this.$locale().weekStart||0,v=(g<y?g+7:g)-y;return p(l?b-v:b+(6-v),w);case a:case d:return f(m+"Hours",0);case o:return f(m+"Minutes",1);case i:return f(m+"Seconds",2);case n:return f(m+"Milliseconds",3);default:return this.clone()}},w.endOf=function(e){return this.startOf(e,!1)},w.$set=function(e,t){var s,l=E.p(e),h="set"+(this.$u?"UTC":""),p=(s={},s[a]=h+"Date",s[d]=h+"Date",s[c]=h+"Month",s[u]=h+"FullYear",s[o]=h+"Hours",s[i]=h+"Minutes",s[n]=h+"Seconds",s[r]=h+"Milliseconds",s)[l],f=l===a?this.$D+(t-this.$W):t;if(l===c||l===u){var g=this.clone().set(d,1);g.$d[p](f),g.init(),this.$d=g.set(d,Math.min(this.$D,g.daysInMonth())).$d}else p&&this.$d[p](f);return this.init(),this},w.set=function(e,t){return this.clone().$set(e,t)},w.get=function(e){return this[E.p(e)]()},w.add=function(r,l){var d,h=this;r=Number(r);var p=E.p(l),f=function(e){var t=k(h);return E.w(t.date(t.date()+Math.round(e*r)),h)};if(p===c)return this.set(c,this.$M+r);if(p===u)return this.set(u,this.$y+r);if(p===a)return f(1);if(p===s)return f(7);var g=(d={},d[i]=e,d[o]=t,d[n]=1e3,d)[p]||1,w=this.$d.getTime()+r*g;return E.w(w,this)},w.subtract=function(e,t){return this.add(-1*e,t)},w.format=function(e){var t=this,r=this.$locale();if(!this.isValid())return r.invalidDate||h;var n=e||"YYYY-MM-DDTHH:mm:ssZ",i=E.z(this),o=this.$H,a=this.$m,s=this.$M,c=r.weekdays,l=r.months,u=r.meridiem,d=function(e,r,i,o){return e&&(e[r]||e(t,n))||i[r].slice(0,o)},p=function(e){return E.s(o%12||12,e,"0")},g=u||function(e,t,r){var n=e<12?"AM":"PM";return r?n.toLowerCase():n};return n.replace(f,(function(e,n){return n||function(e){switch(e){case"YY":return String(t.$y).slice(-2);case"YYYY":return E.s(t.$y,4,"0");case"M":return s+1;case"MM":return E.s(s+1,2,"0");case"MMM":return d(r.monthsShort,s,l,3);case"MMMM":return d(l,s);case"D":return t.$D;case"DD":return E.s(t.$D,2,"0");case"d":return String(t.$W);case"dd":return d(r.weekdaysMin,t.$W,c,2);case"ddd":return d(r.weekdaysShort,t.$W,c,3);case"dddd":return c[t.$W];case"H":return String(o);case"HH":return E.s(o,2,"0");case"h":return p(1);case"hh":return p(2);case"a":return g(o,a,!0);case"A":return g(o,a,!1);case"m":return String(a);case"mm":return E.s(a,2,"0");case"s":return String(t.$s);case"ss":return E.s(t.$s,2,"0");case"SSS":return E.s(t.$ms,3,"0");case"Z":return i}return null}(e)||i.replace(":","")}))},w.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},w.diff=function(r,d,h){var p,f=this,g=E.p(d),w=k(r),b=(w.utcOffset()-this.utcOffset())*e,m=this-w,y=function(){return E.m(f,w)};switch(g){case u:p=y()/12;break;case c:p=y();break;case l:p=y()/3;break;case s:p=(m-b)/6048e5;break;case a:p=(m-b)/864e5;break;case o:p=m/t;break;case i:p=m/e;break;case n:p=m/1e3;break;default:p=m}return h?p:E.a(p)},w.daysInMonth=function(){return this.endOf(c).$D},w.$locale=function(){return y[this.$L]},w.locale=function(e,t){if(!e)return this.$L;var r=this.clone(),n=C(e,t,!0);return n&&(r.$L=n),r},w.clone=function(){return E.w(this.$d,this)},w.toDate=function(){return new Date(this.valueOf())},w.toJSON=function(){return this.isValid()?this.toISOString():null},w.toISOString=function(){return this.$d.toISOString()},w.toString=function(){return this.$d.toUTCString()},g}(),$=P.prototype;return k.prototype=$,[["$ms",r],["$s",n],["$m",i],["$H",o],["$W",a],["$M",c],["$y",u],["$D",d]].forEach((function(e){$[e[1]]=function(t){return this.$g(t,e[0],e[1])}})),k.extend=function(e,t){return e.$i||(e(t,P,k),e.$i=!0),k},k.locale=C,k.isDayjs=x,k.unix=function(e){return k(1e3*e)},k.en=y[m],k.Ls=y,k.p={},k}()},4110:function(e){e.exports=function(){"use strict";return function(e,t,r){e=e||{};var n=t.prototype,i={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function o(e,t,r,i){return n.fromToBase(e,t,r,i)}r.en.relativeTime=i,n.fromToBase=function(t,n,o,a,s){for(var c,l,u,d=o.$locale().relativeTime||i,h=e.thresholds||[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],p=h.length,f=0;f<p;f+=1){var g=h[f];g.d&&(c=a?r(t).diff(o,g.d,!0):o.diff(t,g.d,!0));var w=(e.rounding||Math.round)(Math.abs(c));if(u=c>0,w<=g.r||!g.r){w<=1&&f>0&&(g=h[f-1]);var b=d[g.l];s&&(w=s(""+w)),l="string"==typeof b?b.replace("%d",w):b(w,n,g.l,u);break}}if(n)return l;var m=u?d.future:d.past;return"function"==typeof m?m(l):m.replace("%s",l)},n.to=function(e,t){return o(e,t,this,!0)},n.from=function(e,t){return o(e,t,this)};var a=function(e){return e.$u?r.utc():r()};n.toNow=function(e){return this.to(a(this),e)},n.fromNow=function(e){return this.from(a(this),e)}}}()},660:function(e){e.exports=function(){"use strict";return function(e,t,r){r.updateLocale=function(e,t){var n=r.Ls[e];if(n)return(t?Object.keys(t):[]).forEach((function(e){n[e]=t[e]})),n}}}()},4020:e=>{"use strict";var t="%[a-f0-9]{2}",r=new RegExp("("+t+")|([^%]+?)","gi"),n=new RegExp("("+t+")+","gi");function i(e,t){try{return[decodeURIComponent(e.join(""))]}catch(e){}if(1===e.length)return e;t=t||1;var r=e.slice(0,t),n=e.slice(t);return Array.prototype.concat.call([],i(r),i(n))}function o(e){try{return decodeURIComponent(e)}catch(o){for(var t=e.match(r)||[],n=1;n<t.length;n++)t=(e=i(t,n).join("")).match(r)||[];return e}}e.exports=function(e){if("string"!=typeof e)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof e+"`");try{return e=e.replace(/\+/g," "),decodeURIComponent(e)}catch(t){return function(e){for(var t={"%FE%FF":"��","%FF%FE":"��"},r=n.exec(e);r;){try{t[r[0]]=decodeURIComponent(r[0])}catch(e){var i=o(r[0]);i!==r[0]&&(t[r[0]]=i)}r=n.exec(e)}t["%C2"]="�";for(var a=Object.keys(t),s=0;s<a.length;s++){var c=a[s];e=e.replace(new RegExp(c,"g"),t[c])}return e}(e)}}},5987:e=>{"use strict";var t={single_source_shortest_paths:function(e,r,n){var i={},o={};o[r]=0;var a,s,c,l,u,d,h,p=t.PriorityQueue.make();for(p.push(r,0);!p.empty();)for(c in s=(a=p.pop()).value,l=a.cost,u=e[s]||{})u.hasOwnProperty(c)&&(d=l+u[c],h=o[c],(void 0===o[c]||h>d)&&(o[c]=d,p.push(c,d),i[c]=s));if(void 0!==n&&void 0===o[n]){var f=["Could not find a path from ",r," to ",n,"."].join("");throw new Error(f)}return i},extract_shortest_path_from_predecessor_list:function(e,t){for(var r=[],n=t;n;)r.push(n),e[n],n=e[n];return r.reverse(),r},find_path:function(e,r,n){var i=t.single_source_shortest_paths(e,r,n);return t.extract_shortest_path_from_predecessor_list(i,n)},PriorityQueue:{make:function(e){var r,n=t.PriorityQueue,i={};for(r in e=e||{},n)n.hasOwnProperty(r)&&(i[r]=n[r]);return i.queue=[],i.sorter=e.sorter||n.default_sorter,i},default_sorter:function(e,t){return e.cost-t.cost},push:function(e,t){var r={value:e,cost:t};this.queue.push(r),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return 0===this.queue.length}}};e.exports=t},2378:e=>{"use strict";e.exports=function(e){for(var t=[],r=e.length,n=0;n<r;n++){var i=e.charCodeAt(n);if(i>=55296&&i<=56319&&r>n+1){var o=e.charCodeAt(n+1);o>=56320&&o<=57343&&(i=1024*(i-55296)+o-56320+65536,n+=1)}i<128?t.push(i):i<2048?(t.push(i>>6|192),t.push(63&i|128)):i<55296||i>=57344&&i<65536?(t.push(i>>12|224),t.push(i>>6&63|128),t.push(63&i|128)):i>=65536&&i<=1114111?(t.push(i>>18|240),t.push(i>>12&63|128),t.push(i>>6&63|128),t.push(63&i|128)):t.push(239,191,189)}return new Uint8Array(t).buffer}},6729:e=>{"use strict";var t=Object.prototype.hasOwnProperty,r="~";function n(){}function i(e,t,r){this.fn=e,this.context=t,this.once=r||!1}function o(e,t,n,o,a){if("function"!=typeof n)throw new TypeError("The listener must be a function");var s=new i(n,o||e,a),c=r?r+t:t;return e._events[c]?e._events[c].fn?e._events[c]=[e._events[c],s]:e._events[c].push(s):(e._events[c]=s,e._eventsCount++),e}function a(e,t){0==--e._eventsCount?e._events=new n:delete e._events[t]}function s(){this._events=new n,this._eventsCount=0}Object.create&&(n.prototype=Object.create(null),(new n).__proto__||(r=!1)),s.prototype.eventNames=function(){var e,n,i=[];if(0===this._eventsCount)return i;for(n in e=this._events)t.call(e,n)&&i.push(r?n.slice(1):n);return Object.getOwnPropertySymbols?i.concat(Object.getOwnPropertySymbols(e)):i},s.prototype.listeners=function(e){var t=r?r+e:e,n=this._events[t];if(!n)return[];if(n.fn)return[n.fn];for(var i=0,o=n.length,a=new Array(o);i<o;i++)a[i]=n[i].fn;return a},s.prototype.listenerCount=function(e){var t=r?r+e:e,n=this._events[t];return n?n.fn?1:n.length:0},s.prototype.emit=function(e,t,n,i,o,a){var s=r?r+e:e;if(!this._events[s])return!1;var c,l,u=this._events[s],d=arguments.length;if(u.fn){switch(u.once&&this.removeListener(e,u.fn,void 0,!0),d){case 1:return u.fn.call(u.context),!0;case 2:return u.fn.call(u.context,t),!0;case 3:return u.fn.call(u.context,t,n),!0;case 4:return u.fn.call(u.context,t,n,i),!0;case 5:return u.fn.call(u.context,t,n,i,o),!0;case 6:return u.fn.call(u.context,t,n,i,o,a),!0}for(l=1,c=new Array(d-1);l<d;l++)c[l-1]=arguments[l];u.fn.apply(u.context,c)}else{var h,p=u.length;for(l=0;l<p;l++)switch(u[l].once&&this.removeListener(e,u[l].fn,void 0,!0),d){case 1:u[l].fn.call(u[l].context);break;case 2:u[l].fn.call(u[l].context,t);break;case 3:u[l].fn.call(u[l].context,t,n);break;case 4:u[l].fn.call(u[l].context,t,n,i);break;default:if(!c)for(h=1,c=new Array(d-1);h<d;h++)c[h-1]=arguments[h];u[l].fn.apply(u[l].context,c)}}return!0},s.prototype.on=function(e,t,r){return o(this,e,t,r,!1)},s.prototype.once=function(e,t,r){return o(this,e,t,r,!0)},s.prototype.removeListener=function(e,t,n,i){var o=r?r+e:e;if(!this._events[o])return this;if(!t)return a(this,o),this;var s=this._events[o];if(s.fn)s.fn!==t||i&&!s.once||n&&s.context!==n||a(this,o);else{for(var c=0,l=[],u=s.length;c<u;c++)(s[c].fn!==t||i&&!s[c].once||n&&s[c].context!==n)&&l.push(s[c]);l.length?this._events[o]=1===l.length?l[0]:l:a(this,o)}return this},s.prototype.removeAllListeners=function(e){var t;return e?(t=r?r+e:e,this._events[t]&&a(this,t)):(this._events=new n,this._eventsCount=0),this},s.prototype.off=s.prototype.removeListener,s.prototype.addListener=s.prototype.on,s.prefixed=r,s.EventEmitter=s,e.exports=s},2806:e=>{"use strict";e.exports=function(e,t){for(var r={},n=Object.keys(e),i=Array.isArray(t),o=0;o<n.length;o++){var a=n[o],s=e[a];(i?-1!==t.indexOf(a):t(a,s,e))&&(r[a]=s)}return r}},645:(e,t)=>{t.read=function(e,t,r,n,i){var o,a,s=8*i-n-1,c=(1<<s)-1,l=c>>1,u=-7,d=r?i-1:0,h=r?-1:1,p=e[t+d];for(d+=h,o=p&(1<<-u)-1,p>>=-u,u+=s;u>0;o=256*o+e[t+d],d+=h,u-=8);for(a=o&(1<<-u)-1,o>>=-u,u+=n;u>0;a=256*a+e[t+d],d+=h,u-=8);if(0===o)o=1-l;else{if(o===c)return a?NaN:1/0*(p?-1:1);a+=Math.pow(2,n),o-=l}return(p?-1:1)*a*Math.pow(2,o-n)},t.write=function(e,t,r,n,i,o){var a,s,c,l=8*o-i-1,u=(1<<l)-1,d=u>>1,h=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,p=n?0:o-1,f=n?1:-1,g=t<0||0===t&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(s=isNaN(t)?1:0,a=u):(a=Math.floor(Math.log(t)/Math.LN2),t*(c=Math.pow(2,-a))<1&&(a--,c*=2),(t+=a+d>=1?h/c:h*Math.pow(2,1-d))*c>=2&&(a++,c/=2),a+d>=u?(s=0,a=u):a+d>=1?(s=(t*c-1)*Math.pow(2,i),a+=d):(s=t*Math.pow(2,d-1)*Math.pow(2,i),a=0));i>=8;e[r+p]=255&s,p+=f,s/=256,i-=8);for(a=a<<i|s,l+=i;l>0;e[r+p]=255&a,p+=f,a/=256,l-=8);e[r+p-f]|=128*g}},2592:(e,t,r)=>{const n=r(7138),i=r(5115),o=r(6907),a=r(3776);function s(e,t,r,o,a){const s=[].slice.call(arguments,1),c=s.length,l="function"==typeof s[c-1];if(!l&&!n())throw new Error("Callback required as last argument");if(!l){if(c<1)throw new Error("Too few arguments provided");return 1===c?(r=t,t=o=void 0):2!==c||t.getContext||(o=r,r=t,t=void 0),new Promise((function(n,a){try{const a=i.create(r,o);n(e(a,t,o))}catch(e){a(e)}}))}if(c<2)throw new Error("Too few arguments provided");2===c?(a=r,r=t,t=o=void 0):3===c&&(t.getContext&&void 0===a?(a=o,o=void 0):(a=o,o=r,r=t,t=void 0));try{const n=i.create(r,o);a(null,e(n,t,o))}catch(e){a(e)}}t.create=i.create,t.toCanvas=s.bind(null,o.render),t.toDataURL=s.bind(null,o.renderToDataURL),t.toString=s.bind(null,(function(e,t,r){return a.render(e,r)}))},7138:e=>{e.exports=function(){return"function"==typeof Promise&&Promise.prototype&&Promise.prototype.then}},1845:(e,t,r)=>{const n=r(242).getSymbolSize;t.getRowColCoords=function(e){if(1===e)return[];const t=Math.floor(e/7)+2,r=n(e),i=145===r?26:2*Math.ceil((r-13)/(2*t-2)),o=[r-7];for(let e=1;e<t-1;e++)o[e]=o[e-1]-i;return o.push(6),o.reverse()},t.getPositions=function(e){const r=[],n=t.getRowColCoords(e),i=n.length;for(let e=0;e<i;e++)for(let t=0;t<i;t++)0===e&&0===t||0===e&&t===i-1||e===i-1&&0===t||r.push([n[e],n[t]]);return r}},8260:(e,t,r)=>{const n=r(6910),i=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function o(e){this.mode=n.ALPHANUMERIC,this.data=e}o.getBitsLength=function(e){return 11*Math.floor(e/2)+e%2*6},o.prototype.getLength=function(){return this.data.length},o.prototype.getBitsLength=function(){return o.getBitsLength(this.data.length)},o.prototype.write=function(e){let t;for(t=0;t+2<=this.data.length;t+=2){let r=45*i.indexOf(this.data[t]);r+=i.indexOf(this.data[t+1]),e.put(r,11)}this.data.length%2&&e.put(i.indexOf(this.data[t]),6)},e.exports=o},7245:e=>{function t(){this.buffer=[],this.length=0}t.prototype={get:function(e){const t=Math.floor(e/8);return 1==(this.buffer[t]>>>7-e%8&1)},put:function(e,t){for(let r=0;r<t;r++)this.putBit(1==(e>>>t-r-1&1))},getLengthInBits:function(){return this.length},putBit:function(e){const t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),e&&(this.buffer[t]|=128>>>this.length%8),this.length++}},e.exports=t},3280:e=>{function t(e){if(!e||e<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=e,this.data=new Uint8Array(e*e),this.reservedBit=new Uint8Array(e*e)}t.prototype.set=function(e,t,r,n){const i=e*this.size+t;this.data[i]=r,n&&(this.reservedBit[i]=!0)},t.prototype.get=function(e,t){return this.data[e*this.size+t]},t.prototype.xor=function(e,t,r){this.data[e*this.size+t]^=r},t.prototype.isReserved=function(e,t){return this.reservedBit[e*this.size+t]},e.exports=t},3424:(e,t,r)=>{const n=r(2378),i=r(6910);function o(e){this.mode=i.BYTE,"string"==typeof e&&(e=n(e)),this.data=new Uint8Array(e)}o.getBitsLength=function(e){return 8*e},o.prototype.getLength=function(){return this.data.length},o.prototype.getBitsLength=function(){return o.getBitsLength(this.data.length)},o.prototype.write=function(e){for(let t=0,r=this.data.length;t<r;t++)e.put(this.data[t],8)},e.exports=o},5393:(e,t,r)=>{const n=r(4908),i=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],o=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];t.getBlocksCount=function(e,t){switch(t){case n.L:return i[4*(e-1)+0];case n.M:return i[4*(e-1)+1];case n.Q:return i[4*(e-1)+2];case n.H:return i[4*(e-1)+3];default:return}},t.getTotalCodewordsCount=function(e,t){switch(t){case n.L:return o[4*(e-1)+0];case n.M:return o[4*(e-1)+1];case n.Q:return o[4*(e-1)+2];case n.H:return o[4*(e-1)+3];default:return}}},4908:(e,t)=>{t.L={bit:1},t.M={bit:0},t.Q={bit:3},t.H={bit:2},t.isValid=function(e){return e&&void 0!==e.bit&&e.bit>=0&&e.bit<4},t.from=function(e,r){if(t.isValid(e))return e;try{return function(e){if("string"!=typeof e)throw new Error("Param is not a string");switch(e.toLowerCase()){case"l":case"low":return t.L;case"m":case"medium":return t.M;case"q":case"quartile":return t.Q;case"h":case"high":return t.H;default:throw new Error("Unknown EC Level: "+e)}}(e)}catch(e){return r}}},6526:(e,t,r)=>{const n=r(242).getSymbolSize;t.getPositions=function(e){const t=n(e);return[[0,0],[t-7,0],[0,t-7]]}},1642:(e,t,r)=>{const n=r(242),i=n.getBCHDigit(1335);t.getEncodedBits=function(e,t){const r=e.bit<<3|t;let o=r<<10;for(;n.getBCHDigit(o)-i>=0;)o^=1335<<n.getBCHDigit(o)-i;return 21522^(r<<10|o)}},9729:(e,t)=>{const r=new Uint8Array(512),n=new Uint8Array(256);!function(){let e=1;for(let t=0;t<255;t++)r[t]=e,n[e]=t,e<<=1,256&e&&(e^=285);for(let e=255;e<512;e++)r[e]=r[e-255]}(),t.log=function(e){if(e<1)throw new Error("log("+e+")");return n[e]},t.exp=function(e){return r[e]},t.mul=function(e,t){return 0===e||0===t?0:r[n[e]+n[t]]}},5442:(e,t,r)=>{const n=r(6910),i=r(242);function o(e){this.mode=n.KANJI,this.data=e}o.getBitsLength=function(e){return 13*e},o.prototype.getLength=function(){return this.data.length},o.prototype.getBitsLength=function(){return o.getBitsLength(this.data.length)},o.prototype.write=function(e){let t;for(t=0;t<this.data.length;t++){let r=i.toSJIS(this.data[t]);if(r>=33088&&r<=40956)r-=33088;else{if(!(r>=57408&&r<=60351))throw new Error("Invalid SJIS character: "+this.data[t]+"\nMake sure your charset is UTF-8");r-=49472}r=192*(r>>>8&255)+(255&r),e.put(r,13)}},e.exports=o},7126:(e,t)=>{t.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};function r(e,r,n){switch(e){case t.Patterns.PATTERN000:return(r+n)%2==0;case t.Patterns.PATTERN001:return r%2==0;case t.Patterns.PATTERN010:return n%3==0;case t.Patterns.PATTERN011:return(r+n)%3==0;case t.Patterns.PATTERN100:return(Math.floor(r/2)+Math.floor(n/3))%2==0;case t.Patterns.PATTERN101:return r*n%2+r*n%3==0;case t.Patterns.PATTERN110:return(r*n%2+r*n%3)%2==0;case t.Patterns.PATTERN111:return(r*n%3+(r+n)%2)%2==0;default:throw new Error("bad maskPattern:"+e)}}t.isValid=function(e){return null!=e&&""!==e&&!isNaN(e)&&e>=0&&e<=7},t.from=function(e){return t.isValid(e)?parseInt(e,10):void 0},t.getPenaltyN1=function(e){const t=e.size;let r=0,n=0,i=0,o=null,a=null;for(let s=0;s<t;s++){n=i=0,o=a=null;for(let c=0;c<t;c++){let t=e.get(s,c);t===o?n++:(n>=5&&(r+=n-5+3),o=t,n=1),t=e.get(c,s),t===a?i++:(i>=5&&(r+=i-5+3),a=t,i=1)}n>=5&&(r+=n-5+3),i>=5&&(r+=i-5+3)}return r},t.getPenaltyN2=function(e){const t=e.size;let r=0;for(let n=0;n<t-1;n++)for(let i=0;i<t-1;i++){const t=e.get(n,i)+e.get(n,i+1)+e.get(n+1,i)+e.get(n+1,i+1);4!==t&&0!==t||r++}return 3*r},t.getPenaltyN3=function(e){const t=e.size;let r=0,n=0,i=0;for(let o=0;o<t;o++){n=i=0;for(let a=0;a<t;a++)n=n<<1&2047|e.get(o,a),a>=10&&(1488===n||93===n)&&r++,i=i<<1&2047|e.get(a,o),a>=10&&(1488===i||93===i)&&r++}return 40*r},t.getPenaltyN4=function(e){let t=0;const r=e.data.length;for(let n=0;n<r;n++)t+=e.data[n];return 10*Math.abs(Math.ceil(100*t/r/5)-10)},t.applyMask=function(e,t){const n=t.size;for(let i=0;i<n;i++)for(let o=0;o<n;o++)t.isReserved(o,i)||t.xor(o,i,r(e,o,i))},t.getBestMask=function(e,r){const n=Object.keys(t.Patterns).length;let i=0,o=1/0;for(let a=0;a<n;a++){r(a),t.applyMask(a,e);const n=t.getPenaltyN1(e)+t.getPenaltyN2(e)+t.getPenaltyN3(e)+t.getPenaltyN4(e);t.applyMask(a,e),n<o&&(o=n,i=a)}return i}},6910:(e,t,r)=>{const n=r(3114),i=r(7007);t.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},t.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},t.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},t.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},t.MIXED={bit:-1},t.getCharCountIndicator=function(e,t){if(!e.ccBits)throw new Error("Invalid mode: "+e);if(!n.isValid(t))throw new Error("Invalid version: "+t);return t>=1&&t<10?e.ccBits[0]:t<27?e.ccBits[1]:e.ccBits[2]},t.getBestModeForData=function(e){return i.testNumeric(e)?t.NUMERIC:i.testAlphanumeric(e)?t.ALPHANUMERIC:i.testKanji(e)?t.KANJI:t.BYTE},t.toString=function(e){if(e&&e.id)return e.id;throw new Error("Invalid mode")},t.isValid=function(e){return e&&e.bit&&e.ccBits},t.from=function(e,r){if(t.isValid(e))return e;try{return function(e){if("string"!=typeof e)throw new Error("Param is not a string");switch(e.toLowerCase()){case"numeric":return t.NUMERIC;case"alphanumeric":return t.ALPHANUMERIC;case"kanji":return t.KANJI;case"byte":return t.BYTE;default:throw new Error("Unknown mode: "+e)}}(e)}catch(e){return r}}},1085:(e,t,r)=>{const n=r(6910);function i(e){this.mode=n.NUMERIC,this.data=e.toString()}i.getBitsLength=function(e){return 10*Math.floor(e/3)+(e%3?e%3*3+1:0)},i.prototype.getLength=function(){return this.data.length},i.prototype.getBitsLength=function(){return i.getBitsLength(this.data.length)},i.prototype.write=function(e){let t,r,n;for(t=0;t+3<=this.data.length;t+=3)r=this.data.substr(t,3),n=parseInt(r,10),e.put(n,10);const i=this.data.length-t;i>0&&(r=this.data.substr(t),n=parseInt(r,10),e.put(n,3*i+1))},e.exports=i},6143:(e,t,r)=>{const n=r(9729);t.mul=function(e,t){const r=new Uint8Array(e.length+t.length-1);for(let i=0;i<e.length;i++)for(let o=0;o<t.length;o++)r[i+o]^=n.mul(e[i],t[o]);return r},t.mod=function(e,t){let r=new Uint8Array(e);for(;r.length-t.length>=0;){const e=r[0];for(let i=0;i<t.length;i++)r[i]^=n.mul(t[i],e);let i=0;for(;i<r.length&&0===r[i];)i++;r=r.slice(i)}return r},t.generateECPolynomial=function(e){let r=new Uint8Array([1]);for(let i=0;i<e;i++)r=t.mul(r,new Uint8Array([1,n.exp(i)]));return r}},5115:(e,t,r)=>{const n=r(242),i=r(4908),o=r(7245),a=r(3280),s=r(1845),c=r(6526),l=r(7126),u=r(5393),d=r(2882),h=r(3103),p=r(1642),f=r(6910),g=r(6130);function w(e,t,r){const n=e.size,i=p.getEncodedBits(t,r);let o,a;for(o=0;o<15;o++)a=1==(i>>o&1),o<6?e.set(o,8,a,!0):o<8?e.set(o+1,8,a,!0):e.set(n-15+o,8,a,!0),o<8?e.set(8,n-o-1,a,!0):o<9?e.set(8,15-o-1+1,a,!0):e.set(8,15-o-1,a,!0);e.set(n-8,8,1,!0)}function b(e,t,r,i){let p;if(Array.isArray(e))p=g.fromArray(e);else{if("string"!=typeof e)throw new Error("Invalid data");{let n=t;if(!n){const t=g.rawSplit(e);n=h.getBestVersionForData(t,r)}p=g.fromString(e,n||40)}}const b=h.getBestVersionForData(p,r);if(!b)throw new Error("The amount of data is too big to be stored in a QR Code");if(t){if(t<b)throw new Error("\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: "+b+".\n")}else t=b;const m=function(e,t,r){const i=new o;r.forEach((function(t){i.put(t.mode.bit,4),i.put(t.getLength(),f.getCharCountIndicator(t.mode,e)),t.write(i)}));const a=8*(n.getSymbolTotalCodewords(e)-u.getTotalCodewordsCount(e,t));for(i.getLengthInBits()+4<=a&&i.put(0,4);i.getLengthInBits()%8!=0;)i.putBit(0);const s=(a-i.getLengthInBits())/8;for(let e=0;e<s;e++)i.put(e%2?17:236,8);return function(e,t,r){const i=n.getSymbolTotalCodewords(t),o=i-u.getTotalCodewordsCount(t,r),a=u.getBlocksCount(t,r),s=a-i%a,c=Math.floor(i/a),l=Math.floor(o/a),h=l+1,p=c-l,f=new d(p);let g=0;const w=new Array(a),b=new Array(a);let m=0;const y=new Uint8Array(e.buffer);for(let e=0;e<a;e++){const t=e<s?l:h;w[e]=y.slice(g,g+t),b[e]=f.encode(w[e]),g+=t,m=Math.max(m,t)}const v=new Uint8Array(i);let x,C,k=0;for(x=0;x<m;x++)for(C=0;C<a;C++)x<w[C].length&&(v[k++]=w[C][x]);for(x=0;x<p;x++)for(C=0;C<a;C++)v[k++]=b[C][x];return v}(i,e,t)}(t,r,p),y=n.getSymbolSize(t),v=new a(y);return function(e,t){const r=e.size,n=c.getPositions(t);for(let t=0;t<n.length;t++){const i=n[t][0],o=n[t][1];for(let t=-1;t<=7;t++)if(!(i+t<=-1||r<=i+t))for(let n=-1;n<=7;n++)o+n<=-1||r<=o+n||(t>=0&&t<=6&&(0===n||6===n)||n>=0&&n<=6&&(0===t||6===t)||t>=2&&t<=4&&n>=2&&n<=4?e.set(i+t,o+n,!0,!0):e.set(i+t,o+n,!1,!0))}}(v,t),function(e){const t=e.size;for(let r=8;r<t-8;r++){const t=r%2==0;e.set(r,6,t,!0),e.set(6,r,t,!0)}}(v),function(e,t){const r=s.getPositions(t);for(let t=0;t<r.length;t++){const n=r[t][0],i=r[t][1];for(let t=-2;t<=2;t++)for(let r=-2;r<=2;r++)-2===t||2===t||-2===r||2===r||0===t&&0===r?e.set(n+t,i+r,!0,!0):e.set(n+t,i+r,!1,!0)}}(v,t),w(v,r,0),t>=7&&function(e,t){const r=e.size,n=h.getEncodedBits(t);let i,o,a;for(let t=0;t<18;t++)i=Math.floor(t/3),o=t%3+r-8-3,a=1==(n>>t&1),e.set(i,o,a,!0),e.set(o,i,a,!0)}(v,t),function(e,t){const r=e.size;let n=-1,i=r-1,o=7,a=0;for(let s=r-1;s>0;s-=2)for(6===s&&s--;;){for(let r=0;r<2;r++)if(!e.isReserved(i,s-r)){let n=!1;a<t.length&&(n=1==(t[a]>>>o&1)),e.set(i,s-r,n),o--,-1===o&&(a++,o=7)}if(i+=n,i<0||r<=i){i-=n,n=-n;break}}}(v,m),isNaN(i)&&(i=l.getBestMask(v,w.bind(null,v,r))),l.applyMask(i,v),w(v,r,i),{modules:v,version:t,errorCorrectionLevel:r,maskPattern:i,segments:p}}t.create=function(e,t){if(void 0===e||""===e)throw new Error("No input text");let r,o,a=i.M;return void 0!==t&&(a=i.from(t.errorCorrectionLevel,i.M),r=h.from(t.version),o=l.from(t.maskPattern),t.toSJISFunc&&n.setToSJISFunction(t.toSJISFunc)),b(e,r,a,o)}},2882:(e,t,r)=>{const n=r(6143);function i(e){this.genPoly=void 0,this.degree=e,this.degree&&this.initialize(this.degree)}i.prototype.initialize=function(e){this.degree=e,this.genPoly=n.generateECPolynomial(this.degree)},i.prototype.encode=function(e){if(!this.genPoly)throw new Error("Encoder not initialized");const t=new Uint8Array(e.length+this.degree);t.set(e);const r=n.mod(t,this.genPoly),i=this.degree-r.length;if(i>0){const e=new Uint8Array(this.degree);return e.set(r,i),e}return r},e.exports=i},7007:(e,t)=>{const r="[0-9]+";let n="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";n=n.replace(/u/g,"\\u");const i="(?:(?![A-Z0-9 $%*+\\-./:]|"+n+")(?:.|[\r\n]))+";t.KANJI=new RegExp(n,"g"),t.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g"),t.BYTE=new RegExp(i,"g"),t.NUMERIC=new RegExp(r,"g"),t.ALPHANUMERIC=new RegExp("[A-Z $%*+\\-./:]+","g");const o=new RegExp("^"+n+"$"),a=new RegExp("^"+r+"$"),s=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");t.testKanji=function(e){return o.test(e)},t.testNumeric=function(e){return a.test(e)},t.testAlphanumeric=function(e){return s.test(e)}},6130:(e,t,r)=>{const n=r(6910),i=r(1085),o=r(8260),a=r(3424),s=r(5442),c=r(7007),l=r(242),u=r(5987);function d(e){return unescape(encodeURIComponent(e)).length}function h(e,t,r){const n=[];let i;for(;null!==(i=e.exec(r));)n.push({data:i[0],index:i.index,mode:t,length:i[0].length});return n}function p(e){const t=h(c.NUMERIC,n.NUMERIC,e),r=h(c.ALPHANUMERIC,n.ALPHANUMERIC,e);let i,o;return l.isKanjiModeEnabled()?(i=h(c.BYTE,n.BYTE,e),o=h(c.KANJI,n.KANJI,e)):(i=h(c.BYTE_KANJI,n.BYTE,e),o=[]),t.concat(r,i,o).sort((function(e,t){return e.index-t.index})).map((function(e){return{data:e.data,mode:e.mode,length:e.length}}))}function f(e,t){switch(t){case n.NUMERIC:return i.getBitsLength(e);case n.ALPHANUMERIC:return o.getBitsLength(e);case n.KANJI:return s.getBitsLength(e);case n.BYTE:return a.getBitsLength(e)}}function g(e,t){let r;const c=n.getBestModeForData(e);if(r=n.from(t,c),r!==n.BYTE&&r.bit<c.bit)throw new Error('"'+e+'" cannot be encoded with mode '+n.toString(r)+".\n Suggested mode is: "+n.toString(c));switch(r!==n.KANJI||l.isKanjiModeEnabled()||(r=n.BYTE),r){case n.NUMERIC:return new i(e);case n.ALPHANUMERIC:return new o(e);case n.KANJI:return new s(e);case n.BYTE:return new a(e)}}t.fromArray=function(e){return e.reduce((function(e,t){return"string"==typeof t?e.push(g(t,null)):t.data&&e.push(g(t.data,t.mode)),e}),[])},t.fromString=function(e,r){const i=function(e){const t=[];for(let r=0;r<e.length;r++){const i=e[r];switch(i.mode){case n.NUMERIC:t.push([i,{data:i.data,mode:n.ALPHANUMERIC,length:i.length},{data:i.data,mode:n.BYTE,length:i.length}]);break;case n.ALPHANUMERIC:t.push([i,{data:i.data,mode:n.BYTE,length:i.length}]);break;case n.KANJI:t.push([i,{data:i.data,mode:n.BYTE,length:d(i.data)}]);break;case n.BYTE:t.push([{data:i.data,mode:n.BYTE,length:d(i.data)}])}}return t}(p(e,l.isKanjiModeEnabled())),o=function(e,t){const r={},i={start:{}};let o=["start"];for(let a=0;a<e.length;a++){const s=e[a],c=[];for(let e=0;e<s.length;e++){const l=s[e],u=""+a+e;c.push(u),r[u]={node:l,lastCount:0},i[u]={};for(let e=0;e<o.length;e++){const a=o[e];r[a]&&r[a].node.mode===l.mode?(i[a][u]=f(r[a].lastCount+l.length,l.mode)-f(r[a].lastCount,l.mode),r[a].lastCount+=l.length):(r[a]&&(r[a].lastCount=l.length),i[a][u]=f(l.length,l.mode)+4+n.getCharCountIndicator(l.mode,t))}}o=c}for(let e=0;e<o.length;e++)i[o[e]].end=0;return{map:i,table:r}}(i,r),a=u.find_path(o.map,"start","end"),s=[];for(let e=1;e<a.length-1;e++)s.push(o.table[a[e]].node);return t.fromArray(s.reduce((function(e,t){const r=e.length-1>=0?e[e.length-1]:null;return r&&r.mode===t.mode?(e[e.length-1].data+=t.data,e):(e.push(t),e)}),[]))},t.rawSplit=function(e){return t.fromArray(p(e,l.isKanjiModeEnabled()))}},242:(e,t)=>{let r;const n=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];t.getSymbolSize=function(e){if(!e)throw new Error('"version" cannot be null or undefined');if(e<1||e>40)throw new Error('"version" should be in range from 1 to 40');return 4*e+17},t.getSymbolTotalCodewords=function(e){return n[e]},t.getBCHDigit=function(e){let t=0;for(;0!==e;)t++,e>>>=1;return t},t.setToSJISFunction=function(e){if("function"!=typeof e)throw new Error('"toSJISFunc" is not a valid function.');r=e},t.isKanjiModeEnabled=function(){return void 0!==r},t.toSJIS=function(e){return r(e)}},3114:(e,t)=>{t.isValid=function(e){return!isNaN(e)&&e>=1&&e<=40}},3103:(e,t,r)=>{const n=r(242),i=r(5393),o=r(4908),a=r(6910),s=r(3114),c=n.getBCHDigit(7973);function l(e,t){return a.getCharCountIndicator(e,t)+4}function u(e,t){let r=0;return e.forEach((function(e){const n=l(e.mode,t);r+=n+e.getBitsLength()})),r}t.from=function(e,t){return s.isValid(e)?parseInt(e,10):t},t.getCapacity=function(e,t,r){if(!s.isValid(e))throw new Error("Invalid QR Code version");void 0===r&&(r=a.BYTE);const o=8*(n.getSymbolTotalCodewords(e)-i.getTotalCodewordsCount(e,t));if(r===a.MIXED)return o;const c=o-l(r,e);switch(r){case a.NUMERIC:return Math.floor(c/10*3);case a.ALPHANUMERIC:return Math.floor(c/11*2);case a.KANJI:return Math.floor(c/13);case a.BYTE:default:return Math.floor(c/8)}},t.getBestVersionForData=function(e,r){let n;const i=o.from(r,o.M);if(Array.isArray(e)){if(e.length>1)return function(e,r){for(let n=1;n<=40;n++)if(u(e,n)<=t.getCapacity(n,r,a.MIXED))return n}(e,i);if(0===e.length)return 1;n=e[0]}else n=e;return function(e,r,n){for(let i=1;i<=40;i++)if(r<=t.getCapacity(i,n,e))return i}(n.mode,n.getLength(),i)},t.getEncodedBits=function(e){if(!s.isValid(e)||e<7)throw new Error("Invalid QR Code version");let t=e<<12;for(;n.getBCHDigit(t)-c>=0;)t^=7973<<n.getBCHDigit(t)-c;return e<<12|t}},6907:(e,t,r)=>{const n=r(9653);t.render=function(e,t,r){let i=r,o=t;void 0!==i||t&&t.getContext||(i=t,t=void 0),t||(o=function(){try{return document.createElement("canvas")}catch(e){throw new Error("You need to specify a canvas element")}}()),i=n.getOptions(i);const a=n.getImageWidth(e.modules.size,i),s=o.getContext("2d"),c=s.createImageData(a,a);return n.qrToImageData(c.data,e,i),function(e,t,r){e.clearRect(0,0,t.width,t.height),t.style||(t.style={}),t.height=r,t.width=r,t.style.height=r+"px",t.style.width=r+"px"}(s,o,a),s.putImageData(c,0,0),o},t.renderToDataURL=function(e,r,n){let i=n;void 0!==i||r&&r.getContext||(i=r,r=void 0),i||(i={});const o=t.render(e,r,i),a=i.type||"image/png",s=i.rendererOpts||{};return o.toDataURL(a,s.quality)}},3776:(e,t,r)=>{const n=r(9653);function i(e,t){const r=e.a/255,n=t+'="'+e.hex+'"';return r<1?n+" "+t+'-opacity="'+r.toFixed(2).slice(1)+'"':n}function o(e,t,r){let n=e+t;return void 0!==r&&(n+=" "+r),n}t.render=function(e,t,r){const a=n.getOptions(t),s=e.modules.size,c=e.modules.data,l=s+2*a.margin,u=a.color.light.a?"<path "+i(a.color.light,"fill")+' d="M0 0h'+l+"v"+l+'H0z"/>':"",d="<path "+i(a.color.dark,"stroke")+' d="'+function(e,t,r){let n="",i=0,a=!1,s=0;for(let c=0;c<e.length;c++){const l=Math.floor(c%t),u=Math.floor(c/t);l||a||(a=!0),e[c]?(s++,c>0&&l>0&&e[c-1]||(n+=a?o("M",l+r,.5+u+r):o("m",i,0),i=0,a=!1),l+1<t&&e[c+1]||(n+=o("h",s),s=0)):i++}return n}(c,s,a.margin)+'"/>',h='viewBox="0 0 '+l+" "+l+'"',p='<svg xmlns="http://www.w3.org/2000/svg" '+(a.width?'width="'+a.width+'" height="'+a.width+'" ':"")+h+' shape-rendering="crispEdges">'+u+d+"</svg>\n";return"function"==typeof r&&r(null,p),p}},9653:(e,t)=>{function r(e){if("number"==typeof e&&(e=e.toString()),"string"!=typeof e)throw new Error("Color should be defined as hex string");let t=e.slice().replace("#","").split("");if(t.length<3||5===t.length||t.length>8)throw new Error("Invalid hex color: "+e);3!==t.length&&4!==t.length||(t=Array.prototype.concat.apply([],t.map((function(e){return[e,e]})))),6===t.length&&t.push("F","F");const r=parseInt(t.join(""),16);return{r:r>>24&255,g:r>>16&255,b:r>>8&255,a:255&r,hex:"#"+t.slice(0,6).join("")}}t.getOptions=function(e){e||(e={}),e.color||(e.color={});const t=void 0===e.margin||null===e.margin||e.margin<0?4:e.margin,n=e.width&&e.width>=21?e.width:void 0,i=e.scale||4;return{width:n,scale:n?4:i,margin:t,color:{dark:r(e.color.dark||"#000000ff"),light:r(e.color.light||"#ffffffff")},type:e.type,rendererOpts:e.rendererOpts||{}}},t.getScale=function(e,t){return t.width&&t.width>=e+2*t.margin?t.width/(e+2*t.margin):t.scale},t.getImageWidth=function(e,r){const n=t.getScale(e,r);return Math.floor((e+2*r.margin)*n)},t.qrToImageData=function(e,r,n){const i=r.modules.size,o=r.modules.data,a=t.getScale(i,n),s=Math.floor((i+2*n.margin)*a),c=n.margin*a,l=[n.color.light,n.color.dark];for(let t=0;t<s;t++)for(let r=0;r<s;r++){let u=4*(t*s+r),d=n.color.light;t>=c&&r>=c&&t<s-c&&r<s-c&&(d=l[o[Math.floor((t-c)/a)*i+Math.floor((r-c)/a)]?1:0]),e[u++]=d.r,e[u++]=d.g,e[u++]=d.b,e[u]=d.a}}},500:e=>{"use strict";e.exports=(e,t)=>{if("string"!=typeof e||"string"!=typeof t)throw new TypeError("Expected the arguments to be of type `string`");if(""===t)return[e];const r=e.indexOf(t);return-1===r?[e]:[e.slice(0,r),e.slice(r+t.length)]}},610:e=>{"use strict";e.exports=e=>encodeURIComponent(e).replace(/[!'()*]/g,(e=>`%${e.charCodeAt(0).toString(16).toUpperCase()}`))},655:(e,t,r)=>{"use strict";r.r(t),r.d(t,{__assign:()=>o,__asyncDelegator:()=>v,__asyncGenerator:()=>y,__asyncValues:()=>x,__await:()=>m,__awaiter:()=>u,__classPrivateFieldGet:()=>P,__classPrivateFieldSet:()=>$,__createBinding:()=>h,__decorate:()=>s,__exportStar:()=>p,__extends:()=>i,__generator:()=>d,__importDefault:()=>E,__importStar:()=>k,__makeTemplateObject:()=>C,__metadata:()=>l,__param:()=>c,__read:()=>g,__rest:()=>a,__spread:()=>w,__spreadArrays:()=>b,__values:()=>f});var n=function(e,t){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])},n(e,t)};function i(e,t){function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}var o=function(){return o=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var i in t=arguments[r])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},o.apply(this,arguments)};function a(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var i=0;for(n=Object.getOwnPropertySymbols(e);i<n.length;i++)t.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(e,n[i])&&(r[n[i]]=e[n[i]])}return r}function s(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}function c(e,t){return function(r,n){t(r,n,e)}}function l(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}function u(e,t,r,n){return new(r||(r=Promise))((function(i,o){function a(e){try{c(n.next(e))}catch(e){o(e)}}function s(e){try{c(n.throw(e))}catch(e){o(e)}}function c(e){var t;e.done?i(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(a,s)}c((n=n.apply(e,t||[])).next())}))}function d(e,t){var r,n,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;a;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,n=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!((i=(i=a.trys).length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}}function h(e,t,r,n){void 0===n&&(n=r),e[n]=t[r]}function p(e,t){for(var r in e)"default"===r||t.hasOwnProperty(r)||(t[r]=e[r])}function f(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function g(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,o=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=o.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=o.return)&&r.call(o)}finally{if(i)throw i.error}}return a}function w(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(g(arguments[t]));return e}function b(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;var n=Array(e),i=0;for(t=0;t<r;t++)for(var o=arguments[t],a=0,s=o.length;a<s;a++,i++)n[i]=o[a];return n}function m(e){return this instanceof m?(this.v=e,this):new m(e)}function y(e,t,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n,i=r.apply(e,t||[]),o=[];return n={},a("next"),a("throw"),a("return"),n[Symbol.asyncIterator]=function(){return this},n;function a(e){i[e]&&(n[e]=function(t){return new Promise((function(r,n){o.push([e,t,r,n])>1||s(e,t)}))})}function s(e,t){try{(r=i[e](t)).value instanceof m?Promise.resolve(r.value.v).then(c,l):u(o[0][2],r)}catch(e){u(o[0][3],e)}var r}function c(e){s("next",e)}function l(e){s("throw",e)}function u(e,t){e(t),o.shift(),o.length&&s(o[0][0],o[0][1])}}function v(e){var t,r;return t={},n("next"),n("throw",(function(e){throw e})),n("return"),t[Symbol.iterator]=function(){return this},t;function n(n,i){t[n]=e[n]?function(t){return(r=!r)?{value:m(e[n](t)),done:"return"===n}:i?i(t):t}:i}}function x(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t,r=e[Symbol.asyncIterator];return r?r.call(e):(e=f(e),t={},n("next"),n("throw"),n("return"),t[Symbol.asyncIterator]=function(){return this},t);function n(r){t[r]=e[r]&&function(t){return new Promise((function(n,i){!function(e,t,r,n){Promise.resolve(n).then((function(t){e({value:t,done:r})}),t)}(n,i,(t=e[r](t)).done,t.value)}))}}}function C(e,t){return Object.defineProperty?Object.defineProperty(e,"raw",{value:t}):e.raw=t,e}function k(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t.default=e,t}function E(e){return e&&e.__esModule?e:{default:e}}function P(e,t){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return t.get(e)}function $(e,t,r){if(!t.has(e))throw new TypeError("attempted to set private field on non-instance");return t.set(e,r),r}},5883:()=>{},248:(e,t,r)=>{"use strict";r.d(t,{E:()=>a});var n=r(7484),i=r(660),o=r(4110);n.extend(o),n.extend(i),n.updateLocale("en",{relativeTime:{future:"in %s",past:"%s ago",s:"%s sec",m:"1 min",mm:"%d min",h:"1 hr",hh:"%d hrs",d:"1 d",dd:"%d d",M:"1 mo",MM:"%d mo",y:"1 yr",yy:"%d yr"}});const a={getYear:(e=(new Date).toISOString())=>n(e).year(),getRelativeDateFromNow:e=>n(e).fromNow(!0)}},4201:(e,t,r)=>{"use strict";r.d(t,{AccountController:()=>c,ApiController:()=>$,WM:()=>g,fz:()=>Z,Lr:()=>B,ConnectionController:()=>W,ConnectorController:()=>b,bq:()=>o,j1:()=>a,Xs:()=>I,IN:()=>R,NetworkController:()=>x,OptionsController:()=>k,Ie:()=>y,RouterController:()=>T,yD:()=>H,SnackController:()=>U,MO:()=>p,ThemeController:()=>q,sl:()=>D});var n=r(6828);function i(e,t,r,i){let o=e[t];return(0,n.Ld)(e,(()=>{const n=e[t];Object.is(o,n)||r(o=n)}),i)}Symbol();const o={FOUR_MINUTES_MS:24e4,TEN_SEC_MS:1e4,ONE_SEC_MS:1e3,RESTRICTED_TIMEZONES:["ASIA/SHANGHAI","ASIA/URUMQI","ASIA/CHONGQING","ASIA/HARBIN","ASIA/KASHGAR","ASIA/MACAU","ASIA/HONG_KONG","ASIA/MACAO","ASIA/BEIJING","ASIA/HARBIN"]},a={isMobile:()=>"undefined"!=typeof window&&Boolean(window.matchMedia("(pointer:coarse)").matches||/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)),isAndroid(){const e=navigator.userAgent.toLowerCase();return a.isMobile()&&e.includes("android")},isIos(){const e=navigator.userAgent.toLowerCase();return a.isMobile()&&(e.includes("iphone")||e.includes("ipad"))},isClient:()=>"undefined"!=typeof window,isPairingExpired:e=>!e||e-Date.now()<=o.TEN_SEC_MS,isAllowedRetry:e=>Date.now()-e>=o.ONE_SEC_MS,copyToClopboard(e){navigator.clipboard.writeText(e)},getPairingExpiry:()=>Date.now()+o.FOUR_MINUTES_MS,getPlainAddress:e=>e.split(":")[2],wait:async e=>new Promise((t=>{setTimeout(t,e)})),debounce(e,t=500){let r;return(...n)=>{r&&clearTimeout(r),r=setTimeout((function(){e(...n)}),t)}},isHttpUrl:e=>e.startsWith("http://")||e.startsWith("https://"),formatNativeUrl(e,t){if(a.isHttpUrl(e))return this.formatUniversalUrl(e,t);let r=e;return r.includes("://")||(r=e.replaceAll("/","").replaceAll(":",""),r=`${r}://`),r.endsWith("/")||(r=`${r}/`),{redirect:`${r}wc?uri=${encodeURIComponent(t)}`,href:r}},formatUniversalUrl(e,t){if(!a.isHttpUrl(e))return this.formatNativeUrl(e,t);let r=e;return r.endsWith("/")||(r=`${r}/`),{redirect:`${r}wc?uri=${encodeURIComponent(t)}`,href:r}},openHref(e,t){window.open(e,t,"noreferrer noopener")},async preloadImage(e){const t=new Promise(((t,r)=>{const n=new Image;n.onload=t,n.onerror=r,n.crossOrigin="anonymous",n.src=e}));return Promise.race([t,a.wait(2e3)])},formatBalance(e,t){let r;if("0"===e)r="0.000";else if("string"==typeof e){const t=Number(e);t&&(r=t.toString().match(/^-?\d+(?:\.\d{0,3})?/u)?.[0])}return r?`${r} ${t}`:"0.000"},isRestrictedRegion(){try{const{timeZone:e}=(new Intl.DateTimeFormat).resolvedOptions(),t=e.toUpperCase();return o.RESTRICTED_TIMEZONES.includes(t)}catch{return!1}},getApiUrl:()=>a.isRestrictedRegion()?"https://api.web3modal.org":"https://api.web3modal.com",getBlockchainApiUrl:()=>a.isRestrictedRegion()?"https://rpc.walletconnect.org":"https://rpc.walletconnect.com",getAnalyticsUrl:()=>a.isRestrictedRegion()?"https://pulse.walletconnect.org":"https://pulse.walletconnect.com",getUUID:()=>crypto?.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/gu,(e=>{const t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)}))},s=(0,n.sj)({isConnected:!1}),c={state:s,subscribe:e=>(0,n.Ld)(s,(()=>e(s))),subscribeKey:(e,t)=>i(s,e,t),setIsConnected(e){s.isConnected=e},setCaipAddress(e){s.caipAddress=e,s.address=e?a.getPlainAddress(e):void 0},setBalance(e,t){s.balance=e,s.balanceSymbol=t},setProfileName(e){s.profileName=e},setProfileImage(e){s.profileImage=e},setAddressExplorerUrl(e){s.addressExplorerUrl=e},resetAccount(){s.isConnected=!1,s.caipAddress=void 0,s.address=void 0,s.balance=void 0,s.balanceSymbol=void 0,s.profileName=void 0,s.profileImage=void 0,s.addressExplorerUrl=void 0}};class l{constructor({baseUrl:e}){this.baseUrl=e}async get({headers:e,...t}){const r=this.createUrl(t);return(await fetch(r,{method:"GET",headers:e})).json()}async getBlob({headers:e,...t}){const r=this.createUrl(t);return(await fetch(r,{method:"GET",headers:e})).blob()}async post({body:e,headers:t,...r}){const n=this.createUrl(r);return(await fetch(n,{method:"POST",headers:t,body:e?JSON.stringify(e):void 0})).json()}async put({body:e,headers:t,...r}){const n=this.createUrl(r);return(await fetch(n,{method:"PUT",headers:t,body:e?JSON.stringify(e):void 0})).json()}async delete({body:e,headers:t,...r}){const n=this.createUrl(r);return(await fetch(n,{method:"DELETE",headers:t,body:e?JSON.stringify(e):void 0})).json()}createUrl({path:e,params:t}){const r=new URL(e,this.baseUrl);return t&&Object.entries(t).forEach((([e,t])=>{t&&r.searchParams.append(e,t)})),r}}const u="WALLETCONNECT_DEEPLINK_CHOICE",d="@w3m/recent",h="@w3m/connected_wallet_image_url",p={setWalletConnectDeepLink({href:e,name:t}){try{localStorage.setItem(u,JSON.stringify({href:e,name:t}))}catch{console.info("Unable to set WalletConnect deep link")}},getWalletConnectDeepLink(){try{const e=localStorage.getItem(u);if(e)return JSON.parse(e)}catch{console.info("Unable to get WalletConnect deep link")}},deleteWalletConnectDeepLink(){try{localStorage.removeItem(u)}catch{console.info("Unable to delete WalletConnect deep link")}},setWeb3ModalRecent(e){try{const t=p.getRecentWallets();t.find((t=>t.id===e.id))||(t.unshift(e),t.length>2&&t.pop(),localStorage.setItem(d,JSON.stringify(t)))}catch{console.info("Unable to set Web3Modal recent")}},getRecentWallets(){try{const e=localStorage.getItem(d);return e?JSON.parse(e):[]}catch{console.info("Unable to get Web3Modal recent")}return[]},setConnectedWalletImageUrl(e){try{localStorage.setItem(h,e)}catch{console.info("Unable to set Connected Wallet Image Url")}},getConnectedWalletImageUrl(){try{return localStorage.getItem(h)}catch{console.info("Unable to set Connected Wallet Image Url")}}},f=(0,n.sj)({walletImages:{},networkImages:{},connectorImages:{},tokenImages:{}}),g={state:f,subscribeNetworkImages:e=>(0,n.Ld)(f.networkImages,(()=>e(f.networkImages))),subscribeKey:(e,t)=>i(f,e,t),setWalletImage(e,t){f.walletImages[e]=t},setNetworkImage(e,t){f.networkImages[e]=t},setConnectorImage(e,t){f.connectorImages[e]=t},setTokenImage(e,t){f.tokenImages[e]=t}},w=(0,n.sj)({connectors:[]}),b={state:w,subscribeKey:(e,t)=>i(w,e,t),setConnectors(e){w.connectors=e.map((e=>(0,n.iH)(e)))},addConnector(e){w.connectors.push((0,n.iH)(e))},getConnectors:()=>w.connectors},m=(0,n.sj)({open:!1,selectedNetworkId:void 0}),y={state:m,subscribe:e=>(0,n.Ld)(m,(()=>e(m))),set(e){Object.assign(m,{...m,...e})}},v=(0,n.sj)({supportsAllNetworks:!0,isDefaultCaipNetwork:!1}),x={state:v,subscribeKey:(e,t)=>i(v,e,t),_getClient(){if(!v._client)throw new Error("NetworkController client not set");return v._client},setClient(e){v._client=(0,n.iH)(e)},setCaipNetwork(e){v.caipNetwork=e,y.set({selectedNetworkId:e?.id})},setDefaultCaipNetwork(e){v.caipNetwork=e,y.set({selectedNetworkId:e?.id}),v.isDefaultCaipNetwork=!0},setRequestedCaipNetworks(e){v.requestedCaipNetworks=e},async getApprovedCaipNetworksData(){const e=await this._getClient().getApprovedCaipNetworksData();v.supportsAllNetworks=e.supportsAllNetworks,v.approvedCaipNetworkIds=e.approvedCaipNetworkIds},async switchActiveNetwork(e){await this._getClient().switchCaipNetwork(e),v.caipNetwork=e},resetNetwork(){v.isDefaultCaipNetwork||(v.caipNetwork=void 0),v.approvedCaipNetworkIds=void 0,v.supportsAllNetworks=!0}},C=(0,n.sj)({projectId:"",sdkType:"w3m",sdkVersion:"html-wagmi-undefined"}),k={state:C,subscribeKey:(e,t)=>i(C,e,t),setProjectId(e){C.projectId=e},setIncludeWalletIds(e){C.includeWalletIds=e},setExcludeWalletIds(e){C.excludeWalletIds=e},setFeaturedWalletIds(e){C.featuredWalletIds=e},setTokens(e){C.tokens=e},setTermsConditionsUrl(e){C.termsConditionsUrl=e},setPrivacyPolicyUrl(e){C.privacyPolicyUrl=e},setCustomWallets(e){C.customWallets=e},setEnableAnalytics(e){C.enableAnalytics=e},setSdkVersion(e){C.sdkVersion=e},setMetadata(e){C.metadata=e}},E=new l({baseUrl:a.getApiUrl()}),P=(0,n.sj)({page:1,count:0,featured:[],recommended:[],wallets:[],search:[]}),$={state:P,subscribeKey:(e,t)=>i(P,e,t),_getApiHeaders(){const{projectId:e,sdkType:t,sdkVersion:r}=k.state;return{"x-project-id":e,"x-sdk-type":t,"x-sdk-version":r}},async _fetchWalletImage(e){const t=`${E.baseUrl}/getWalletImage/${e}`,r=await E.getBlob({path:t,headers:$._getApiHeaders()});g.setWalletImage(e,URL.createObjectURL(r))},async _fetchNetworkImage(e){const t=`${E.baseUrl}/public/getAssetImage/${e}`,r=await E.getBlob({path:t,headers:$._getApiHeaders()});g.setNetworkImage(e,URL.createObjectURL(r))},async _fetchConnectorImage(e){const t=`${E.baseUrl}/public/getAssetImage/${e}`,r=await E.getBlob({path:t,headers:$._getApiHeaders()});g.setConnectorImage(e,URL.createObjectURL(r))},async fetchNetworkImages(){const{requestedCaipNetworks:e}=x.state,t=e?.map((({imageId:e})=>e)).filter(Boolean);t&&await Promise.allSettled(t.map((e=>$._fetchNetworkImage(e))))},async fetchConnectorImages(){const{connectors:e}=b.state,t=e.map((({imageId:e})=>e)).filter(Boolean);await Promise.allSettled(t.map((e=>$._fetchConnectorImage(e))))},async fetchFeaturedWallets(){const{featuredWalletIds:e}=k.state;if(e?.length){const{data:t}=await E.get({path:"/getWallets",headers:$._getApiHeaders(),params:{page:"1",entries:e?.length?String(e.length):"4",include:e?.join(",")}});t.sort(((t,r)=>e.indexOf(t.id)-e.indexOf(r.id)));const r=t.map((e=>e.image_id)).filter(Boolean);await Promise.allSettled(r.map((e=>$._fetchWalletImage(e)))),P.featured=t}},async fetchRecommendedWallets(){const{includeWalletIds:e,excludeWalletIds:t,featuredWalletIds:r}=k.state,n=[...t??[],...r??[]].filter(Boolean),{data:i,count:o}=await E.get({path:"/getWallets",headers:$._getApiHeaders(),params:{page:"1",entries:"4",include:e?.join(","),exclude:n?.join(",")}}),a=p.getRecentWallets(),s=i.map((e=>e.image_id)).filter(Boolean),c=a.map((e=>e.image_id)).filter(Boolean);await Promise.allSettled([...s,...c].map((e=>$._fetchWalletImage(e)))),P.recommended=i,P.count=o??0},async fetchWallets({page:e}){const{includeWalletIds:t,excludeWalletIds:r,featuredWalletIds:n}=k.state,i=[...P.recommended.map((({id:e})=>e)),...r??[],...n??[]].filter(Boolean),{data:o,count:s}=await E.get({path:"/getWallets",headers:$._getApiHeaders(),params:{page:String(e),entries:"40",include:t?.join(","),exclude:i.join(",")}}),c=o.map((e=>e.image_id)).filter(Boolean);await Promise.allSettled([...c.map((e=>$._fetchWalletImage(e))),a.wait(300)]),P.wallets=[...P.wallets,...o],P.count=s>P.count?s:P.count,P.page=e},async searchWallet({search:e}){const{includeWalletIds:t,excludeWalletIds:r}=k.state;P.search=[];const{data:n}=await E.get({path:"/getWallets",headers:$._getApiHeaders(),params:{page:"1",entries:"100",search:e,include:t?.join(","),exclude:r?.join(",")}}),i=n.map((e=>e.image_id)).filter(Boolean);await Promise.allSettled([...i.map((e=>$._fetchWalletImage(e))),a.wait(300)]),P.search=n},prefetch(){P.prefetchPromise=Promise.race([Promise.allSettled([$.fetchFeaturedWallets(),$.fetchRecommendedWallets(),$.fetchNetworkImages(),$.fetchConnectorImages()]),a.wait(3e3)])}},S=new l({baseUrl:a.getAnalyticsUrl()}),_=["MODAL_CREATED"],A=(0,n.sj)({timestamp:Date.now(),data:{type:"track",event:"MODAL_CREATED"}}),I={state:A,subscribe:e=>(0,n.Ld)(A,(()=>e(A))),_getApiHeaders(){const{projectId:e,sdkType:t,sdkVersion:r}=k.state;return{"x-project-id":e,"x-sdk-type":t,"x-sdk-version":r}},async _sendAnalyticsEvent(e){try{if(_.includes(e.data.event)||"undefined"==typeof window)return;await S.post({path:"/e",headers:I._getApiHeaders(),body:{eventId:a.getUUID(),url:window.location.href,domain:window.location.hostname,timestamp:e.timestamp,props:e.data}})}catch{}},sendEvent(e){A.timestamp=Date.now(),A.data=e,k.state.enableAnalytics&&I._sendAnalyticsEvent(A)}},O=(0,n.sj)({view:"Connect",history:["Connect"]}),T={state:O,subscribeKey:(e,t)=>i(O,e,t),push(e,t){e!==O.view&&(O.view=e,O.history.push(e),O.data=t)},reset(e){O.view=e,O.history=[e]},replace(e){O.history.length>1&&O.history.at(-1)!==e&&(O.view=e,O.history[O.history.length-1]=e)},goBack(){if(O.history.length>1){O.history.pop();const[e]=O.history.slice(-1);e&&(O.view=e)}}},N=(0,n.sj)({open:!1}),R={state:N,subscribeKey:(e,t)=>i(N,e,t),async open(e){await $.state.prefetchPromise,e?.view?T.reset(e.view):c.state.isConnected?T.reset("Account"):T.reset("Connect"),N.open=!0,y.set({open:!0}),I.sendEvent({type:"track",event:"MODAL_OPEN"})},close(){N.open=!1,y.set({open:!1}),I.sendEvent({type:"track",event:"MODAL_CLOSE"})}},j=new l({baseUrl:a.getBlockchainApiUrl()}),B={fetchIdentity:({caipChainId:e,address:t})=>j.get({path:`/v1/identity/${t}`,params:{chainId:e,projectId:k.state.projectId}}),fetchTransactions({account:e,projectId:t,cursor:r}){const n=r?{cursor:r}:{};return j.get({path:`/v1/account/${e}/history?projectId=${t}`,params:n})}},M=(0,n.sj)({message:"",variant:"success",open:!1}),U={state:M,subscribeKey:(e,t)=>i(M,e,t),showSuccess(e){M.message=e,M.variant="success",M.open=!0},showError(e){M.message=e,M.variant="error",M.open=!0},hide(){M.open=!1}},L=(0,n.sj)({transactions:[],transactionsByYear:{},loading:!1,empty:!1,next:void 0}),D={state:L,subscribe:e=>(0,n.Ld)(L,(()=>e(L))),async fetchTransactions(e){const{projectId:t}=k.state;if(!t||!e)throw new Error("Transactions can't be fetched without a projectId and an accountAddress");L.loading=!0;try{const r=await B.fetchTransactions({account:e,projectId:t,cursor:L.next}),n=this.filterSpamTransactions(r.data),i=[...L.transactions,...n];L.loading=!1,L.transactions=i,L.transactionsByYear=this.groupTransactionsByYear(L.transactionsByYear,n),L.empty=0===i.length,L.next=r.next?r.next:void 0}catch(r){I.sendEvent({type:"track",event:"ERROR_FETCH_TRANSACTIONS",properties:{address:e,projectId:t,cursor:L.next}}),U.showError("Failed to fetch transactions"),L.loading=!1,L.empty=!0}},groupTransactionsByYear(e={},t=[]){const r=e;return t.forEach((e=>{const t=new Date(e.metadata.minedAt).getFullYear();r[t]||(r[t]=[]),r[t]?.push(e)})),r},filterSpamTransactions:e=>e.filter((e=>!e.transfers.every((e=>!0===e.nft_info?.flags.is_spam)))),resetTransactions(){L.transactions=[],L.transactionsByYear={},L.loading=!1,L.empty=!1,L.next=void 0}},z=(0,n.sj)({wcError:!1,buffering:!1}),W={state:z,subscribeKey:(e,t)=>i(z,e,t),_getClient(){if(!z._client)throw new Error("ConnectionController client not set");return z._client},setClient(e){z._client=(0,n.iH)(e)},connectWalletConnect(){z.wcPromise=this._getClient().connectWalletConnect((e=>{z.wcUri=e,z.wcPairingExpiry=a.getPairingExpiry()}))},async connectExternal(e){await(this._getClient().connectExternal?.(e))},checkInstalled(e){return this._getClient().checkInstalled?.(e)},resetWcConnection(){z.wcUri=void 0,z.wcPairingExpiry=void 0,z.wcPromise=void 0,z.wcLinking=void 0,z.recentWallet=void 0,D.resetTransactions(),p.deleteWalletConnectDeepLink()},setWcLinking(e){z.wcLinking=e},setWcError(e){z.wcError=e,z.buffering=!1},setRecentWallet(e){z.recentWallet=e},setBuffering(e){z.buffering=e},async disconnect(){await this._getClient().disconnect(),this.resetWcConnection()}},F=(0,n.sj)({status:"uninitialized"}),H={state:F,subscribeKey:(e,t)=>i(F,e,t),subscribe:e=>(0,n.Ld)(F,(()=>e(F))),_getClient(){if(!F._client)throw new Error("SIWEController client not set");return F._client},setSIWEClient(e){F._client=(0,n.iH)(e),F.status="ready"},setNonce(e){F.nonce=e},setStatus(e){F.status=e},setMessage(e){F.message=e},setSession(e){F.session=e}},G=(0,n.sj)({themeMode:"dark",themeVariables:{}}),q={state:G,subscribe:e=>(0,n.Ld)(G,(()=>e(G))),setThemeMode(e){G.themeMode=e},setThemeVariables(e){G.themeVariables={...G.themeVariables,...e}}},Z={getWalletImage:e=>e?.image_url?e?.image_url:e?.image_id?g.state.walletImages[e.image_id]:void 0,getNetworkImage:e=>e?.imageUrl?e?.imageUrl:e?.imageId?g.state.networkImages[e.imageId]:void 0,getConnectorImage:e=>e?.imageUrl?e.imageUrl:e?.imageId?g.state.connectorImages[e.imageId]:void 0}},6541:(e,t,r)=>{"use strict";r.r(t),r.d(t,{W3mModal:()=>u});var n=r(4201),i=r(684),o=r(7229),a=r(3215);const s=o.iv`
  :host {
    z-index: var(--w3m-z-index);
    display: block;
    backface-visibility: hidden;
    will-change: opacity;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    background-color: var(--wui-cover);
  }

  @keyframes zoom-in {
    0% {
      transform: scale(0.95) translateY(0);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes slide-in {
    0% {
      transform: scale(1) translateY(50px);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  wui-card {
    max-width: 360px;
    width: 100%;
    position: relative;
    animation-delay: 0.3s;
    animation-duration: 0.2s;
    animation-name: zoom-in;
    animation-fill-mode: backwards;
    animation-timing-function: var(--wui-ease-out-power-2);
    outline: none;
  }

  wui-flex {
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  @media (max-height: 700px) and (min-width: 431px) {
    wui-flex {
      align-items: flex-start;
    }

    wui-card {
      margin: var(--wui-spacing-xxl) 0px;
    }
  }

  @media (max-width: 430px) {
    wui-flex {
      align-items: flex-end;
    }

    wui-card {
      max-width: 100%;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-bottom: none;
      animation-name: slide-in;
    }
  }
`;var c=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};const l="scroll-lock";let u=class extends o.oi{constructor(){super(),this.unsubscribe=[],this.abortController=void 0,this.open=n.IN.state.open,this.initializeTheming(),n.ApiController.prefetch(),this.unsubscribe.push(n.IN.subscribeKey("open",(e=>e?this.onOpen():this.onClose()))),n.Xs.sendEvent({type:"track",event:"MODAL_LOADED"})}disconnectedCallback(){this.unsubscribe.forEach((e=>e())),this.onRemoveKeyboardListener()}render(){return this.open?o.dy`
          <wui-flex @click=${this.onOverlayClick.bind(this)}>
            <wui-card role="alertdialog" aria-modal="true" tabindex="0">
              <w3m-header></w3m-header>
              <w3m-router></w3m-router>
              <w3m-snackbar></w3m-snackbar>
            </wui-card>
          </wui-flex>
        `:null}onOverlayClick(e){e.target===e.currentTarget&&n.IN.close()}initializeTheming(){const{themeVariables:e,themeMode:t}=n.ThemeController.state,r=i.UiHelperUtil.getColorTheme(t);(0,i.initializeTheming)(e,r)}async onClose(){this.onScrollUnlock(),await this.animate([{opacity:1},{opacity:0}],{duration:200,easing:"ease",fill:"forwards"}).finished,n.SnackController.hide(),this.open=!1,this.onRemoveKeyboardListener()}async onOpen(){this.onScrollLock(),this.open=!0,await this.animate([{opacity:0},{opacity:1}],{duration:200,easing:"ease",fill:"forwards",delay:300}).finished,this.onAddKeyboardListener()}onScrollLock(){const e=document.createElement("style");e.dataset.w3m=l,e.textContent="\n      html, body {\n        touch-action: none;\n        overflow: hidden;\n        overscroll-behavior: contain;\n      }\n      w3m-modal {\n        pointer-events: auto;\n      }\n    ",document.head.appendChild(e)}onScrollUnlock(){const e=document.head.querySelector(`style[data-w3m="${l}"]`);e&&e.remove()}onAddKeyboardListener(){this.abortController=new AbortController;const e=this.shadowRoot?.querySelector("wui-card");e?.focus(),window.addEventListener("keydown",(t=>{if("Escape"===t.key)n.IN.close();else if("Tab"===t.key){const{tagName:r}=t.target;!r||r.includes("W3M-")||r.includes("WUI-")||e?.focus()}}),this.abortController)}onRemoveKeyboardListener(){this.abortController?.abort(),this.abortController=void 0}};u.styles=s,c([(0,a.SB)()],u.prototype,"open",void 0),u=c([(0,i.customElement)("w3m-modal")],u)},684:(e,t,r)=>{"use strict";r.r(t),r.d(t,{TransactionUtil:()=>$n,UiHelperUtil:()=>rt,WuiAccountButton:()=>ft,WuiAllWalletsImage:()=>vt,WuiAvatar:()=>ct,WuiButton:()=>kt,WuiCard:()=>w,WuiCardSelect:()=>Rt,WuiCardSelectLoader:()=>St,WuiChip:()=>Mt,WuiConnectButton:()=>Dt,WuiCtaButton:()=>Ft,WuiEmailInput:()=>sr,WuiFlex:()=>ot,WuiGrid:()=>yn,WuiIcon:()=>we,WuiIconBox:()=>dt,WuiIconLink:()=>ur,WuiImage:()=>ye,WuiInputElement:()=>pr,WuiInputNumeric:()=>wr,WuiInputText:()=>ir,WuiLink:()=>yr,WuiListItem:()=>Cr,WuiListWallet:()=>Mr,WuiLoadingHexagon:()=>xe,WuiLoadingSpinner:()=>Ee,WuiLoadingThumbnail:()=>Se,WuiLogo:()=>Dr,WuiLogoSelect:()=>Fr,WuiNetworkButton:()=>qr,WuiNetworkImage:()=>Ot,WuiOtp:()=>Yr,WuiQrCode:()=>tn,WuiSearchBar:()=>nn,WuiSeparator:()=>Cn,WuiShimmer:()=>Ie,WuiSnackbar:()=>sn,WuiTabs:()=>un,WuiTag:()=>Rr,WuiText:()=>Me,WuiTooltip:()=>pn,WuiTransactionListItem:()=>Ar,WuiTransactionListItemLoader:()=>Or,WuiTransactionVisual:()=>$r,WuiVisual:()=>et,WuiVisualThumbnail:()=>wn,WuiWalletImage:()=>bt,customElement:()=>f,initializeTheming:()=>s,setColorTheme:()=>c,setThemeVariables:()=>l});var n=r(7229);let i,o,a;function s(e,t){i=document.createElement("style"),o=document.createElement("style"),a=document.createElement("style"),i.textContent=u(e).core.cssText,o.textContent=u(e).dark.cssText,a.textContent=u(e).light.cssText,document.head.appendChild(i),document.head.appendChild(o),document.head.appendChild(a),c(t)}function c(e){o&&a&&("light"===e?(o.removeAttribute("media"),a.media="enabled"):(a.removeAttribute("media"),o.media="enabled"))}function l(e){i&&o&&a&&(i.textContent=u(e).core.cssText,o.textContent=u(e).dark.cssText,a.textContent=u(e).light.cssText)}function u(e){return{core:n.iv`
      :root {
        --w3m-color-mix-strength: ${(0,n.$m)(e?.["--w3m-color-mix-strength"]?`${e["--w3m-color-mix-strength"]}%`:"0%")};
        --w3m-font-family: ${(0,n.$m)(e?.["--w3m-font-family"]||"-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif")};
        --w3m-font-size-master: ${(0,n.$m)(e?.["--w3m-font-size-master"]||"10px")};
        --w3m-border-radius-master: ${(0,n.$m)(e?.["--w3m-border-radius-master"]||"4px")};
        --w3m-z-index: ${(0,n.$m)(e?.["--w3m-z-index"]||100)};

        --wui-font-family: var(--w3m-font-family);

        --wui-font-size-micro: var(--w3m-font-size-master);
        --wui-font-size-tiny: calc(var(--w3m-font-size-master) * 1.2);
        --wui-font-size-small: calc(var(--w3m-font-size-master) * 1.4);
        --wui-font-size-paragraph: calc(var(--w3m-font-size-master) * 1.6);
        --wui-font-size-large: calc(var(--w3m-font-size-master) * 2);

        --wui-border-radius-5xs: var(--w3m-border-radius-master);
        --wui-border-radius-4xs: calc(var(--w3m-border-radius-master) * 1.5);
        --wui-border-radius-3xs: calc(var(--w3m-border-radius-master) * 2);
        --wui-border-radius-xxs: calc(var(--w3m-border-radius-master) * 3);
        --wui-border-radius-xs: calc(var(--w3m-border-radius-master) * 4);
        --wui-border-radius-s: calc(var(--w3m-border-radius-master) * 5);
        --wui-border-radius-m: calc(var(--w3m-border-radius-master) * 7);
        --wui-border-radius-l: calc(var(--w3m-border-radius-master) * 9);
        --wui-border-radius-3xl: calc(var(--w3m-border-radius-master) * 20);

        --wui-font-weight-light: 400;
        --wui-font-weight-regular: 500;
        --wui-font-weight-medium: 600;
        --wui-font-weight-bold: 700;

        --wui-letter-spacing-large: -0.8px;
        --wui-letter-spacing-paragraph: -0.64px;
        --wui-letter-spacing-small: -0.56px;
        --wui-letter-spacing-tiny: -0.48px;
        --wui-letter-spacing-micro: -0.2px;

        --wui-spacing-0: 0px;
        --wui-spacing-4xs: 2px;
        --wui-spacing-3xs: 4px;
        --wui-spacing-xxs: 6px;
        --wui-spacing-2xs: 7px;
        --wui-spacing-xs: 8px;
        --wui-spacing-1xs: 10px;
        --wui-spacing-s: 12px;
        --wui-spacing-m: 14px;
        --wui-spacing-l: 16px;
        --wui-spacing-2l: 18px;
        --wui-spacing-xl: 20px;
        --wui-spacing-xxl: 24px;
        --wui-spacing-2xl: 32px;
        --wui-spacing-3xl: 40px;
        --wui-spacing-4xl: 90px;

        --wui-icon-box-size-xxs: 14px;
        --wui-icon-box-size-xs: 20px;
        --wui-icon-box-size-sm: 24px;
        --wui-icon-box-size-md: 32px;
        --wui-icon-box-size-lg: 40px;

        --wui-icon-size-inherit: inherit;
        --wui-icon-size-xxs: 10px;
        --wui-icon-size-xs: 12px;
        --wui-icon-size-sm: 14px;
        --wui-icon-size-md: 16px;
        --wui-icon-size-mdl: 18px;
        --wui-icon-size-lg: 20px;
        --wui-icon-size-xl: 24px;

        --wui-wallet-image-size-inherit: inherit;
        --wui-wallet-image-size-sm: 40px;
        --wui-wallet-image-size-md: 56px;
        --wui-wallet-image-size-lg: 80px;

        --wui-box-size-md: 100px;
        --wui-box-size-lg: 120px;

        --wui-ease-out-power-2: cubic-bezier(0, 0, 0.22, 1);
        --wui-ease-out-power-1: cubic-bezier(0, 0, 0.55, 1);

        --wui-ease-in-power-3: cubic-bezier(0.66, 0, 1, 1);
        --wui-ease-in-power-2: cubic-bezier(0.45, 0, 1, 1);
        --wui-ease-in-power-1: cubic-bezier(0.3, 0, 1, 1);

        --wui-ease-inout-power-1: cubic-bezier(0.45, 0, 0.55, 1);

        --wui-duration-lg: 200ms;
        --wui-duration-md: 125ms;
        --wui-duration-sm: 75ms;

        --wui-path-network: path(
          'M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z'
        );

        --wui-path-network-lg: path(
          'M78.3244 18.926L50.1808 2.45078C45.7376 -0.150261 40.2624 -0.150262 35.8192 2.45078L7.6756 18.926C3.23322 21.5266 0.5 26.3301 0.5 31.5248V64.4752C0.5 69.6699 3.23322 74.4734 7.6756 77.074L35.8192 93.5492C40.2624 96.1503 45.7376 96.1503 50.1808 93.5492L78.3244 77.074C82.7668 74.4734 85.5 69.6699 85.5 64.4752V31.5248C85.5 26.3301 82.7668 21.5266 78.3244 18.926Z'
        );

        --wui-color-inherit: inherit;

        --wui-color-inverse-100: #fff;
        --wui-color-inverse-000: #000;

        --wui-cover: rgba(0, 0, 0, 0.3);

        --wui-color-modal-bg: var(--wui-color-modal-bg-base);

        --wui-color-blue-100: var(--wui-color-blue-base-100);
        --wui-color-blue-015: var(--wui-color-accent-base-015);

        --wui-color-accent-100: var(--wui-color-accent-base-100);
        --wui-color-accent-090: var(--wui-color-accent-base-090);
        --wui-color-accent-080: var(--wui-color-accent-base-080);

        --wui-accent-glass-090: var(--wui-accent-glass-base-090);
        --wui-accent-glass-080: var(--wui-accent-glass-base-080);
        --wui-accent-glass-020: var(--wui-accent-glass-base-020);
        --wui-accent-glass-015: var(--wui-accent-glass-base-015);
        --wui-accent-glass-010: var(--wui-accent-glass-base-010);
        --wui-accent-glass-005: var(--wui-accent-glass-base-005);
        --wui-accent-glass-002: var(--wui-accent-glass-base-002);

        --wui-color-fg-100: var(--wui-color-fg-base-100);
        --wui-color-fg-125: var(--wui-color-fg-base-125);
        --wui-color-fg-150: var(--wui-color-fg-base-150);
        --wui-color-fg-175: var(--wui-color-fg-base-175);
        --wui-color-fg-200: var(--wui-color-fg-base-200);
        --wui-color-fg-225: var(--wui-color-fg-base-225);
        --wui-color-fg-250: var(--wui-color-fg-base-250);
        --wui-color-fg-275: var(--wui-color-fg-base-275);
        --wui-color-fg-300: var(--wui-color-fg-base-300);

        --wui-color-bg-100: var(--wui-color-bg-base-100);
        --wui-color-bg-125: var(--wui-color-bg-base-125);
        --wui-color-bg-150: var(--wui-color-bg-base-150);
        --wui-color-bg-175: var(--wui-color-bg-base-175);
        --wui-color-bg-200: var(--wui-color-bg-base-200);
        --wui-color-bg-225: var(--wui-color-bg-base-225);
        --wui-color-bg-250: var(--wui-color-bg-base-250);
        --wui-color-bg-275: var(--wui-color-bg-base-275);
        --wui-color-bg-300: var(--wui-color-bg-base-300);

        --wui-color-success-100: var(--wui-color-success-base-100);
        --wui-color-error-100: var(--wui-color-error-base-100);

        --wui-icon-box-bg-error-100: var(--wui-icon-box-bg-error-base-100);
        --wui-icon-box-bg-blue-100: var(--wui-icon-box-bg-blue-base-100);
        --wui-icon-box-bg-success-100: var(--wui-icon-box-bg-success-base-100);
        --wui-icon-box-bg-inverse-100: var(--wui-icon-box-bg-inverse-base-100);

        --wui-all-wallets-bg-100: var(--wui-all-wallets-bg-base-100);

        --wui-avatar-border: var(--wui-avatar-border-base);

        --wui-thumbnail-border: var(--wui-thumbnail-border-base);

        --wui-box-shadow-blue: rgba(71, 161, 255, 0.16);
      }

      @supports (background: color-mix(in srgb, white 50%, black)) {
        :root {
          --wui-color-modal-bg: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-modal-bg-base)
          );

          --wui-box-shadow-blue: color-mix(in srgb, var(--wui-color-accent-100) 16%, transparent);

          --wui-color-accent-090: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 90%,
            var(--w3m-default)
          );
          --wui-color-accent-080: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 80%,
            var(--w3m-default)
          );

          --wui-color-accent-090: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 90%,
            transparent
          );
          --wui-color-accent-080: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 80%,
            transparent
          );

          --wui-accent-glass-090: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 90%,
            transparent
          );
          --wui-accent-glass-080: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 80%,
            transparent
          );
          --wui-accent-glass-020: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 20%,
            transparent
          );
          --wui-accent-glass-015: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 15%,
            transparent
          );
          --wui-accent-glass-010: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 10%,
            transparent
          );
          --wui-accent-glass-005: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 5%,
            transparent
          );
          --wui-color-accent-002: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 2%,
            transparent
          );

          --wui-color-fg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-base-100)
          );
          --wui-color-fg-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-base-125)
          );
          --wui-color-fg-150: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-base-150)
          );
          --wui-color-fg-175: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-base-175)
          );
          --wui-color-fg-200: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-base-200)
          );
          --wui-color-fg-225: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-base-225)
          );
          --wui-color-fg-250: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-base-250)
          );
          --wui-color-fg-275: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-base-275)
          );
          --wui-color-fg-300: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-base-300)
          );

          --wui-color-bg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-base-100)
          );
          --wui-color-bg-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-base-125)
          );
          --wui-color-bg-150: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-base-150)
          );
          --wui-color-bg-175: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-base-175)
          );
          --wui-color-bg-200: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-base-200)
          );
          --wui-color-bg-225: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-base-225)
          );
          --wui-color-bg-250: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-base-250)
          );
          --wui-color-bg-275: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-base-275)
          );
          --wui-color-bg-300: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-base-300)
          );

          --wui-color-success-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-success-base-100)
          );
          --wui-color-error-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-error-base-100)
          );

          --wui-icon-box-bg-error-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-error-base-100)
          );
          --wui-icon-box-bg-accent-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-blue-base-100)
          );
          --wui-icon-box-bg-success-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-success-base-100)
          );
          --wui-icon-box-bg-inverse-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-inverse-base-100)
          );

          --wui-all-wallets-bg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-all-wallets-bg-base-100)
          );

          --wui-avatar-border: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-avatar-border-base)
          );

          --wui-thumbnail-border: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-thumbnail-border-base)
          );
        }
      }
    `,light:n.iv`
      :root {
        --w3m-color-mix: ${(0,n.$m)(e?.["--w3m-color-mix"]||"#fff")};
        --w3m-accent: ${(0,n.$m)(e?.["--w3m-accent"]||"#47a1ff")};
        --w3m-default: #fff;

        --wui-color-modal-bg-base: #191a1a;

        --wui-color-blue-base-100: #47a1ff;

        --wui-color-accent-base-100: var(--w3m-accent);
        --wui-color-accent-base-090: #59aaff;
        --wui-color-accent-base-080: #6cb4ff;

        --wui-accent-glass-base-090: rgba(71, 161, 255, 0.9);
        --wui-accent-glass-base-080: rgba(71, 161, 255, 0.8);
        --wui-accent-glass-base-020: rgba(71, 161, 255, 0.2);
        --wui-accent-glass-base-015: rgba(71, 161, 255, 0.15);
        --wui-accent-glass-base-010: rgba(71, 161, 255, 0.1);
        --wui-accent-glass-base-005: rgba(71, 161, 255, 0.05);
        --wui-accent-glass-base-002: rgba(71, 161, 255, 0.02);

        --wui-color-fg-base-100: #e4e7e7;
        --wui-color-fg-base-125: #d0d5d5;
        --wui-color-fg-base-150: #a8b1b1;
        --wui-color-fg-base-175: #a8b0b0;
        --wui-color-fg-base-200: #949e9e;
        --wui-color-fg-base-225: #868f8f;
        --wui-color-fg-base-250: #788080;
        --wui-color-fg-base-275: #788181;
        --wui-color-fg-base-300: #6e7777;

        --wui-color-bg-base-100: #141414;
        --wui-color-bg-base-125: #191a1a;
        --wui-color-bg-base-150: #1e1f1f;
        --wui-color-bg-base-175: #222525;
        --wui-color-bg-base-200: #272a2a;
        --wui-color-bg-base-225: #2c3030;
        --wui-color-bg-base-250: #313535;
        --wui-color-bg-base-275: #363b3b;
        --wui-color-bg-base-300: #3b4040;

        --wui-color-success-base-100: #26d962;
        --wui-color-error-base-100: #f25a67;

        --wui-icon-box-bg-error-base-100: #3c2426;
        --wui-icon-box-bg-blue-base-100: #20303f;
        --wui-icon-box-bg-success-base-100: #1f3a28;
        --wui-icon-box-bg-inverse-base-100: #243240;

        --wui-all-wallets-bg-base-100: #222b35;

        --wui-avatar-border-base: #252525;

        --wui-thumbnail-border-base: #252525;

        --wui-gray-glass-001: rgba(255, 255, 255, 0.01);
        --wui-gray-glass-002: rgba(255, 255, 255, 0.02);
        --wui-gray-glass-005: rgba(255, 255, 255, 0.05);
        --wui-gray-glass-010: rgba(255, 255, 255, 0.1);
        --wui-gray-glass-015: rgba(255, 255, 255, 0.15);
        --wui-gray-glass-020: rgba(255, 255, 255, 0.2);
        --wui-gray-glass-025: rgba(255, 255, 255, 0.25);
        --wui-gray-glass-030: rgba(255, 255, 255, 0.3);
        --wui-gray-glass-060: rgba(255, 255, 255, 0.6);
        --wui-gray-glass-080: rgba(255, 255, 255, 0.8);
      }
    `,dark:n.iv`
      :root {
        --w3m-color-mix: ${(0,n.$m)(e?.["--w3m-color-mix"]||"#000")};
        --w3m-accent: ${(0,n.$m)(e?.["--w3m-accent"]||"#3396ff")};
        --w3m-default: #000;

        --wui-color-modal-bg-base: #fff;

        --wui-color-blue-base-100: #3396ff;

        --wui-color-accent-base-100: var(--w3m-accent);
        --wui-color-accent-base-090: #2d7dd2;
        --wui-color-accent-base-080: #2978cc;

        --wui-accent-glass-base-090: rgba(51, 150, 255, 0.9);
        --wui-accent-glass-base-080: rgba(51, 150, 255, 0.8);
        --wui-accent-glass-base-020: rgba(51, 150, 255, 0.2);
        --wui-accent-glass-base-015: rgba(51, 150, 255, 0.15);
        --wui-accent-glass-base-010: rgba(51, 150, 255, 0.1);
        --wui-accent-glass-base-005: rgba(51, 150, 255, 0.05);
        --wui-accent-glass-base-002: rgba(51, 150, 255, 0.02);

        --wui-color-fg-base-100: #141414;
        --wui-color-fg-base-125: #2d3131;
        --wui-color-fg-base-150: #474d4d;
        --wui-color-fg-base-175: #636d6d;
        --wui-color-fg-base-200: #798686;
        --wui-color-fg-base-225: #828f8f;
        --wui-color-fg-base-250: #8b9797;
        --wui-color-fg-base-275: #95a0a0;
        --wui-color-fg-base-300: #9ea9a9;

        --wui-color-bg-base-100: #ffffff;
        --wui-color-bg-base-125: #f5fafa;
        --wui-color-bg-base-150: #f3f8f8;
        --wui-color-bg-base-175: #eef4f4;
        --wui-color-bg-base-200: #eaf1f1;
        --wui-color-bg-base-225: #e5eded;
        --wui-color-bg-base-250: #e1e9e9;
        --wui-color-bg-base-275: #dce7e7;
        --wui-color-bg-base-300: #d8e3e3;

        --wui-color-success-base-100: #26b562;
        --wui-color-error-base-100: #f05142;

        --wui-icon-box-bg-error-base-100: #f4dfdd;
        --wui-icon-box-bg-blue-base-100: #d9ecfb;
        --wui-icon-box-bg-success-base-100: #daf0e4;
        --wui-icon-box-bg-inverse-base-100: #dcecfc;

        --wui-all-wallets-bg-base-100: #e8f1fa;

        --wui-avatar-border-base: #f3f4f4;

        --wui-thumbnail-border-base: #eaefef;

        --wui-gray-glass-001: rgba(0, 0, 0, 0.01);
        --wui-gray-glass-002: rgba(0, 0, 0, 0.02);
        --wui-gray-glass-005: rgba(0, 0, 0, 0.05);
        --wui-gray-glass-010: rgba(0, 0, 0, 0.1);
        --wui-gray-glass-015: rgba(0, 0, 0, 0.15);
        --wui-gray-glass-020: rgba(0, 0, 0, 0.2);
        --wui-gray-glass-025: rgba(0, 0, 0, 0.25);
        --wui-gray-glass-030: rgba(0, 0, 0, 0.3);
        --wui-gray-glass-060: rgba(0, 0, 0, 0.6);
        --wui-gray-glass-080: rgba(0, 0, 0, 0.8);
      }
    `}}const d=n.iv`
  *,
  *::after,
  *::before,
  :host {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-style: normal;
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    font-family: var(--wui-font-family);
    backface-visibility: hidden;
  }
`,h=n.iv`
  button,
  a {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-lg);
    outline: none;
    border: 1px solid transparent;
    column-gap: var(--wui-spacing-3xs);
    background-color: transparent;
    text-decoration: none;
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-gray-glass-005);
    }

    button:active:enabled {
      transition: all var(--wui-ease-out-power-2) var(--wui-duration-sm);
      background-color: var(--wui-gray-glass-010);
    }

    button[data-variant='fill']:hover:enabled {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='accentBg']:hover:enabled {
      background: var(--wui-accent-glass-015);
    }

    button[data-variant='accentBg']:active:enabled {
      background: var(--wui-accent-glass-020);
    }
  }

  button:disabled {
    cursor: not-allowed;
    background-color: var(--wui-gray-glass-005);
  }

  button[data-variant='shade']:disabled,
  button[data-variant='accent']:disabled,
  button[data-variant='accentBg']:disabled {
    background-color: var(--wui-gray-glass-010);
    color: var(--wui-gray-glass-015);
    filter: grayscale(1);
  }

  button:disabled > wui-wallet-image,
  button:disabled > wui-all-wallets-image,
  button:disabled > wui-network-image,
  button:disabled > wui-image,
  button:disabled > wui-icon-box,
  button:disabled > wui-transaction-visual,
  button:disabled > wui-logo {
    filter: grayscale(1);
  }

  button:focus-visible,
  a:focus-visible {
    border: 1px solid var(--wui-color-accent-100);
    background-color: var(--wui-gray-glass-005);
    -webkit-box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
    -moz-box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
    box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
  }

  button[data-variant='fill']:focus-visible {
    background-color: var(--wui-color-accent-090);
  }

  button[data-variant='fill'] {
    color: var(--wui-color-inverse-100);
    background-color: var(--wui-color-accent-100);
  }

  button[data-variant='fill']:disabled {
    color: var(--wui-gray-glass-015);
    background-color: var(--wui-gray-glass-015);
  }

  button[data-variant='fill']:disabled > wui-icon {
    color: var(--wui-gray-glass-015);
  }

  button[data-variant='shade'] {
    color: var(--wui-color-fg-200);
  }

  button[data-variant='accent'],
  button[data-variant='accentBg'] {
    color: var(--wui-color-accent-100);
  }

  button[data-variant='accentBg'] {
    background: var(--wui-accent-glass-010);
    border: 1px solid var(--wui-accent-glass-010);
  }

  button[data-variant='fullWidth'] {
    width: 100%;
    border-radius: var(--wui-border-radius-xs);
    height: 56px;
    border: none;
    background-color: var(--wui-gray-glass-002);
    color: var(--wui-color-fg-200);
    gap: var(--wui-spacing-xs);
  }

  button:active:enabled {
    background-color: var(--wui-gray-glass-010);
  }

  button[data-variant='fill']:active:enabled {
    background-color: var(--wui-color-accent-080);
    border: 1px solid var(--wui-gray-glass-010);
  }

  input {
    border: none;
    outline: none;
    appearance: none;
  }
`,p=n.iv`
  .wui-color-inherit {
    color: var(--wui-color-inherit);
  }

  .wui-color-accent-100 {
    color: var(--wui-color-accent-100);
  }

  .wui-color-error-100 {
    color: var(--wui-color-error-100);
  }

  .wui-color-success-100 {
    color: var(--wui-color-success-100);
  }

  .wui-color-inverse-100 {
    color: var(--wui-color-inverse-100);
  }

  .wui-color-inverse-000 {
    color: var(--wui-color-inverse-000);
  }

  .wui-color-fg-100 {
    color: var(--wui-color-fg-100);
  }

  .wui-color-fg-200 {
    color: var(--wui-color-fg-200);
  }

  .wui-color-fg-300 {
    color: var(--wui-color-fg-300);
  }

  .wui-bg-color-inherit {
    background-color: var(--wui-color-inherit);
  }

  .wui-bg-color-blue-100 {
    background-color: var(--wui-color-accent-100);
  }

  .wui-bg-color-error-100 {
    background-color: var(--wui-color-error-100);
  }

  .wui-bg-color-success-100 {
    background-color: var(--wui-color-success-100);
  }

  .wui-bg-color-inverse-100 {
    background-color: var(--wui-color-inverse-100);
  }

  .wui-bg-color-inverse-000 {
    background-color: var(--wui-color-inverse-000);
  }

  .wui-bg-color-fg-100 {
    background-color: var(--wui-color-fg-100);
  }

  .wui-bg-color-fg-200 {
    background-color: var(--wui-color-fg-200);
  }

  .wui-bg-color-fg-300 {
    background-color: var(--wui-color-fg-300);
  }
`;function f(e){return function(t){return"function"==typeof t?function(e,t){return customElements.get(e)||customElements.define(e,t),t}(e,t):function(e,t){const{kind:r,elements:n}=t;return{kind:r,elements:n,finisher(t){customElements.get(e)||customElements.define(e,t)}}}(e,t)}}const g=n.iv`
  :host {
    display: block;
    border-radius: clamp(0px, var(--wui-border-radius-l), 44px);
    border: 1px solid var(--wui-gray-glass-005);
    background-color: var(--wui-color-modal-bg);
    overflow: hidden;
  }
`;let w=class extends n.oi{render(){return n.dy`<slot></slot>`}};w.styles=[d,g],w=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}([f("wui-card")],w);var b=r(3215);const m=n.iv`
  :host {
    display: flex;
    aspect-ratio: 1 / 1;
    color: var(--local-color);
    width: var(--local-width);
  }

  svg {
    width: inherit;
    height: inherit;
    object-fit: contain;
    object-position: center;
  }
`,y=n.YP`<svg fill="none" viewBox="0 0 24 24">
  <path
    style="fill: var(--wui-color-accent-100);"
    d="M10.2 6.6a3.6 3.6 0 1 1-7.2 0 3.6 3.6 0 0 1 7.2 0ZM21 6.6a3.6 3.6 0 1 1-7.2 0 3.6 3.6 0 0 1 7.2 0ZM10.2 17.4a3.6 3.6 0 1 1-7.2 0 3.6 3.6 0 0 1 7.2 0ZM21 17.4a3.6 3.6 0 1 1-7.2 0 3.6 3.6 0 0 1 7.2 0Z"
  />
</svg>`,v=n.YP`
<svg width="36" height="36">
  <path
    d="M28.724 0H7.271A7.269 7.269 0 0 0 0 7.272v21.46A7.268 7.268 0 0 0 7.271 36H28.73A7.272 7.272 0 0 0 36 28.728V7.272A7.275 7.275 0 0 0 28.724 0Z"
    fill="url(#a)"
  />
  <path
    d="m17.845 8.271.729-1.26a1.64 1.64 0 1 1 2.843 1.638l-7.023 12.159h5.08c1.646 0 2.569 1.935 1.853 3.276H6.434a1.632 1.632 0 0 1-1.638-1.638c0-.909.73-1.638 1.638-1.638h4.176l5.345-9.265-1.67-2.898a1.642 1.642 0 0 1 2.844-1.638l.716 1.264Zm-6.317 17.5-1.575 2.732a1.64 1.64 0 1 1-2.844-1.638l1.17-2.025c1.323-.41 2.398-.095 3.249.931Zm13.56-4.954h4.262c.909 0 1.638.729 1.638 1.638 0 .909-.73 1.638-1.638 1.638h-2.367l1.597 2.772c.45.788.185 1.782-.602 2.241a1.642 1.642 0 0 1-2.241-.603c-2.69-4.666-4.711-8.159-6.052-10.485-1.372-2.367-.391-4.743.576-5.549 1.075 1.846 2.682 4.631 4.828 8.348Z"
    fill="#fff"
  />
  <defs>
    <linearGradient id="a" x1="18" y1="0" x2="18" y2="36" gradientUnits="userSpaceOnUse">
      <stop stop-color="#18BFFB" />
      <stop offset="1" stop-color="#2072F3" />
    </linearGradient>
  </defs>
</svg>`,x=n.YP`<svg fill="none" viewBox="0 0 40 40">
  <g clip-path="url(#a)">
    <g clip-path="url(#b)">
      <circle cx="20" cy="19.89" r="20" fill="#000" />
      <g clip-path="url(#c)">
        <path
          fill="#fff"
          d="M28.77 23.3c-.69 1.99-2.75 5.52-4.87 5.56-1.4.03-1.86-.84-3.46-.84-1.61 0-2.12.81-3.45.86-2.25.1-5.72-5.1-5.72-9.62 0-4.15 2.9-6.2 5.42-6.25 1.36-.02 2.64.92 3.47.92.83 0 2.38-1.13 4.02-.97.68.03 2.6.28 3.84 2.08-3.27 2.14-2.76 6.61.75 8.25ZM24.2 7.88c-2.47.1-4.49 2.69-4.2 4.84 2.28.17 4.47-2.39 4.2-4.84Z"
        />
      </g>
    </g>
  </g>
  <defs>
    <clipPath id="a"><rect width="40" height="40" fill="#fff" rx="20" /></clipPath>
    <clipPath id="b"><path fill="#fff" d="M0 0h40v40H0z" /></clipPath>
    <clipPath id="c"><path fill="#fff" d="M8 7.89h24v24H8z" /></clipPath>
  </defs>
</svg>`,C=n.YP`<svg fill="none" viewBox="0 0 14 15">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M7 1.99a1 1 0 0 1 1 1v7.58l2.46-2.46a1 1 0 0 1 1.41 1.42L7.7 13.69a1 1 0 0 1-1.41 0L2.12 9.53A1 1 0 0 1 3.54 8.1L6 10.57V3a1 1 0 0 1 1-1Z"
    clip-rule="evenodd"
  />
</svg>`,k=n.YP`<svg fill="none" viewBox="0 0 14 15">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M13 7.99a1 1 0 0 1-1 1H4.4l2.46 2.46a1 1 0 1 1-1.41 1.41L1.29 8.7a1 1 0 0 1 0-1.41L5.46 3.1a1 1 0 0 1 1.41 1.42L4.41 6.99H12a1 1 0 0 1 1 1Z"
    clip-rule="evenodd"
  />
</svg>`,E=n.YP`<svg fill="none" viewBox="0 0 14 15">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M1 7.99a1 1 0 0 1 1-1h7.58L7.12 4.53A1 1 0 1 1 8.54 3.1l4.16 4.17a1 1 0 0 1 0 1.41l-4.16 4.17a1 1 0 1 1-1.42-1.41l2.46-2.46H2a1 1 0 0 1-1-1Z"
    clip-rule="evenodd"
  />
</svg>`,P=n.YP`<svg fill="none" viewBox="0 0 14 15">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M7 13.99a1 1 0 0 1-1-1V5.4L3.54 7.86a1 1 0 0 1-1.42-1.41L6.3 2.28a1 1 0 0 1 1.41 0l4.17 4.17a1 1 0 1 1-1.41 1.41L8 5.4v7.59a1 1 0 0 1-1 1Z"
    clip-rule="evenodd"
  />
</svg>`,$=n.YP`<svg fill="none" viewBox="0 0 20 20">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M4 6.4a1 1 0 0 1-.46.89 6.98 6.98 0 0 0 .38 6.18A7 7 0 0 0 16.46 7.3a1 1 0 0 1-.47-.92 7 7 0 0 0-12 .03Zm-2.02-.5a9 9 0 1 1 16.03 8.2A9 9 0 0 1 1.98 5.9Z"
    clip-rule="evenodd"
  />
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M6.03 8.63c-1.46-.3-2.72-.75-3.6-1.35l-.02-.01-.14-.11a1 1 0 0 1 1.2-1.6l.1.08c.6.4 1.52.74 2.69 1 .16-.99.39-1.88.67-2.65.3-.79.68-1.5 1.15-2.02A2.58 2.58 0 0 1 9.99 1c.8 0 1.45.44 1.92.97.47.52.84 1.23 1.14 2.02.29.77.52 1.66.68 2.64a8 8 0 0 0 2.7-1l.26-.18h.48a1 1 0 0 1 .12 2c-.86.51-2.01.91-3.34 1.18a22.24 22.24 0 0 1-.03 3.19c1.45.29 2.7.73 3.58 1.31a1 1 0 0 1-1.1 1.68c-.6-.4-1.56-.76-2.75-1-.15.8-.36 1.55-.6 2.2-.3.79-.67 1.5-1.14 2.02-.47.53-1.12.97-1.92.97-.8 0-1.45-.44-1.91-.97a6.51 6.51 0 0 1-1.15-2.02c-.24-.65-.44-1.4-.6-2.2-1.18.24-2.13.6-2.73.99a1 1 0 1 1-1.1-1.67c.88-.58 2.12-1.03 3.57-1.31a22.03 22.03 0 0 1-.04-3.2Zm2.2-1.7c.15-.86.34-1.61.58-2.24.24-.65.51-1.12.76-1.4.25-.28.4-.29.42-.29.03 0 .17.01.42.3.25.27.52.74.77 1.4.23.62.43 1.37.57 2.22a19.96 19.96 0 0 1-3.52 0Zm-.18 4.6a20.1 20.1 0 0 1-.03-2.62 21.95 21.95 0 0 0 3.94 0 20.4 20.4 0 0 1-.03 2.63 21.97 21.97 0 0 0-3.88 0Zm.27 2c.13.66.3 1.26.49 1.78.24.65.51 1.12.76 1.4.25.28.4.29.42.29.03 0 .17-.01.42-.3.25-.27.52-.74.77-1.4.19-.5.36-1.1.49-1.78a20.03 20.03 0 0 0-3.35 0Z"
    clip-rule="evenodd"
  />
</svg>`,S=n.YP`<svg fill="none" viewBox="0 0 14 15">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M12.04 2.65c.47.3.6.91.3 1.38l-5.78 9a1 1 0 0 1-1.61.1L1.73 9.27A1 1 0 1 1 3.27 8L5.6 10.8l5.05-7.85a1 1 0 0 1 1.38-.3Z"
    clip-rule="evenodd"
  />
</svg>`,_=n.YP`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M1.46 4.96a1 1 0 0 1 1.41 0L8 10.09l5.13-5.13a1 1 0 1 1 1.41 1.41l-5.83 5.84a1 1 0 0 1-1.42 0L1.46 6.37a1 1 0 0 1 0-1.41Z"
    clip-rule="evenodd"
  />
</svg>`,A=n.YP`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M11.04 1.46a1 1 0 0 1 0 1.41L5.91 8l5.13 5.13a1 1 0 1 1-1.41 1.41L3.79 8.71a1 1 0 0 1 0-1.42l5.84-5.83a1 1 0 0 1 1.41 0Z"
    clip-rule="evenodd"
  />
</svg>`,I=n.YP`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M4.96 14.54a1 1 0 0 1 0-1.41L10.09 8 4.96 2.87a1 1 0 0 1 1.41-1.41l5.84 5.83a1 1 0 0 1 0 1.42l-5.84 5.83a1 1 0 0 1-1.41 0Z"
    clip-rule="evenodd"
  />
</svg>`,O=n.YP`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M14.54 11.04a1 1 0 0 1-1.41 0L8 5.92l-5.13 5.12a1 1 0 1 1-1.41-1.41l5.83-5.84a1 1 0 0 1 1.42 0l5.83 5.84a1 1 0 0 1 0 1.41Z"
    clip-rule="evenodd"
  />
</svg>`,T=n.YP`<svg width="36" height="36" fill="none">
  <path
    fill="#fff"
    fill-opacity=".05"
    d="M0 14.94c0-5.55 0-8.326 1.182-10.4a9 9 0 0 1 3.359-3.358C6.614 0 9.389 0 14.94 0h6.12c5.55 0 8.326 0 10.4 1.182a9 9 0 0 1 3.358 3.359C36 6.614 36 9.389 36 14.94v6.12c0 5.55 0 8.326-1.182 10.4a9 9 0 0 1-3.359 3.358C29.386 36 26.611 36 21.06 36h-6.12c-5.55 0-8.326 0-10.4-1.182a9 9 0 0 1-3.358-3.359C0 29.386 0 26.611 0 21.06v-6.12Z"
  />
  <path
    stroke="#fff"
    stroke-opacity=".05"
    d="M14.94.5h6.12c2.785 0 4.84 0 6.46.146 1.612.144 2.743.43 3.691.97a8.5 8.5 0 0 1 3.172 3.173c.541.948.826 2.08.971 3.692.145 1.62.146 3.675.146 6.459v6.12c0 2.785 0 4.84-.146 6.46-.145 1.612-.43 2.743-.97 3.691a8.5 8.5 0 0 1-3.173 3.172c-.948.541-2.08.826-3.692.971-1.62.145-3.674.146-6.459.146h-6.12c-2.784 0-4.84 0-6.46-.146-1.612-.145-2.743-.43-3.691-.97a8.5 8.5 0 0 1-3.172-3.173c-.541-.948-.827-2.08-.971-3.692C.5 25.9.5 23.845.5 21.06v-6.12c0-2.784 0-4.84.146-6.46.144-1.612.43-2.743.97-3.691A8.5 8.5 0 0 1 4.79 1.617C5.737 1.076 6.869.79 8.48.646 10.1.5 12.156.5 14.94.5Z"
  />
  <path
    fill="url(#a)"
    d="M17.998 10.8h12.469a14.397 14.397 0 0 0-24.938.001l6.234 10.798.006-.001a7.19 7.19 0 0 1 6.23-10.799Z"
  />
  <path
    fill="url(#b)"
    d="m24.237 21.598-6.234 10.798A14.397 14.397 0 0 0 30.47 10.798H18.002l-.002.006a7.191 7.191 0 0 1 6.237 10.794Z"
  />
  <path
    fill="url(#c)"
    d="M11.765 21.601 5.531 10.803A14.396 14.396 0 0 0 18.001 32.4l6.235-10.798-.004-.004a7.19 7.19 0 0 1-12.466.004Z"
  />
  <path fill="#fff" d="M18 25.2a7.2 7.2 0 1 0 0-14.4 7.2 7.2 0 0 0 0 14.4Z" />
  <path fill="#1A73E8" d="M18 23.7a5.7 5.7 0 1 0 0-11.4 5.7 5.7 0 0 0 0 11.4Z" />
  <defs>
    <linearGradient
      id="a"
      x1="6.294"
      x2="41.1"
      y1="5.995"
      y2="5.995"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#D93025" />
      <stop offset="1" stop-color="#EA4335" />
    </linearGradient>
    <linearGradient
      id="b"
      x1="20.953"
      x2="37.194"
      y1="32.143"
      y2="2.701"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#FCC934" />
      <stop offset="1" stop-color="#FBBC04" />
    </linearGradient>
    <linearGradient
      id="c"
      x1="25.873"
      x2="9.632"
      y1="31.2"
      y2="1.759"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#1E8E3E" />
      <stop offset="1" stop-color="#34A853" />
    </linearGradient>
  </defs>
</svg>`,N=n.YP`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M7 2.99a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-7 5a7 7 0 1 1 14 0 7 7 0 0 1-14 0Zm7-4a1 1 0 0 1 1 1v2.58l1.85 1.85a1 1 0 0 1-1.41 1.42L6.29 8.69A1 1 0 0 1 6 8v-3a1 1 0 0 1 1-1Z"
    clip-rule="evenodd"
  />
</svg>`,R=n.YP`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M2.54 2.54a1 1 0 0 1 1.42 0L8 6.6l4.04-4.05a1 1 0 1 1 1.42 1.42L9.4 8l4.05 4.04a1 1 0 0 1-1.42 1.42L8 9.4l-4.04 4.05a1 1 0 0 1-1.42-1.42L6.6 8 2.54 3.96a1 1 0 0 1 0-1.42Z"
    clip-rule="evenodd"
  />
</svg>`,j=n.YP`<svg fill="none" viewBox="0 0 20 20">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M10 3a7 7 0 0 0-6.85 8.44l8.29-8.3C10.97 3.06 10.49 3 10 3Zm3.49.93-9.56 9.56c.32.55.71 1.06 1.16 1.5L15 5.1a7.03 7.03 0 0 0-1.5-1.16Zm2.7 2.8-9.46 9.46a7 7 0 0 0 9.46-9.46ZM1.99 5.9A9 9 0 1 1 18 14.09 9 9 0 0 1 1.98 5.91Z"
    clip-rule="evenodd"
  />
</svg>`,B=n.YP`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm10.66-2.65a1 1 0 0 1 .23 1.06L9.83 9.24a1 1 0 0 1-.59.58l-2.83 1.06A1 1 0 0 1 5.13 9.6l1.06-2.82a1 1 0 0 1 .58-.59L9.6 5.12a1 1 0 0 1 1.06.23ZM7.9 7.89l-.13.35.35-.13.12-.35-.34.13Z"
    clip-rule="evenodd"
  />
</svg>`,M=n.YP`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M9.5 0h1.67c.68 0 1.26 0 1.73.04.5.05.97.14 1.42.4.52.3.95.72 1.24 1.24.26.45.35.92.4 1.42.04.47.04 1.05.04 1.73V6.5c0 .69 0 1.26-.04 1.74-.05.5-.14.97-.4 1.41-.3.52-.72.95-1.24 1.25-.45.25-.92.35-1.42.4-.43.03-.95.03-1.57.03 0 .62 0 1.14-.04 1.57-.04.5-.14.97-.4 1.42-.29.52-.72.95-1.24 1.24-.44.26-.92.35-1.41.4-.48.04-1.05.04-1.74.04H4.83c-.68 0-1.26 0-1.73-.04-.5-.05-.97-.14-1.42-.4-.52-.3-.95-.72-1.24-1.24a3.39 3.39 0 0 1-.4-1.42A20.9 20.9 0 0 1 0 11.17V9.5c0-.69 0-1.26.04-1.74.05-.5.14-.97.4-1.41.3-.52.72-.95 1.24-1.25.45-.25.92-.35 1.42-.4.43-.03.95-.03 1.57-.03 0-.62 0-1.14.04-1.57.04-.5.14-.97.4-1.42.29-.52.72-.95 1.24-1.24.44-.26.92-.35 1.41-.4A20.9 20.9 0 0 1 9.5 0ZM4.67 6.67c-.63 0-1.06 0-1.4.03-.35.03-.5.09-.6.14-.2.12-.38.3-.5.5-.05.1-.1.24-.14.6C2 8.32 2 8.8 2 9.54v1.59c0 .73 0 1.22.03 1.6.04.35.1.5.15.6.11.2.29.38.5.5.09.05.24.1.6.14.37.03.86.03 1.6.03h1.58c.74 0 1.22 0 1.6-.03.36-.04.5-.1.6-.15.2-.11.38-.29.5-.5.05-.09.1-.24.14-.6.03-.33.03-.76.03-1.39-.6 0-1.13 0-1.57-.04-.5-.04-.97-.14-1.41-.4-.52-.29-.95-.72-1.25-1.24a3.39 3.39 0 0 1-.4-1.41c-.03-.44-.03-.96-.03-1.57Zm3.27-4.64c-.36.04-.5.1-.6.15-.2.11-.38.29-.5.5-.05.09-.1.24-.14.6-.03.37-.03.86-.03 1.6v1.58c0 .74 0 1.22.03 1.6.03.36.09.5.14.6.12.2.3.38.5.5.1.05.24.1.6.14.38.03.86.03 1.6.03h1.59c.73 0 1.22 0 1.6-.03.35-.03.5-.09.6-.14.2-.12.38-.3.5-.5.05-.1.1-.24.14-.6.03-.38.03-.86.03-1.6V4.87c0-.73 0-1.22-.03-1.6a1.46 1.46 0 0 0-.15-.6c-.11-.2-.29-.38-.5-.5-.09-.05-.24-.1-.6-.14-.37-.03-.86-.03-1.6-.03H9.55c-.74 0-1.22 0-1.6.03Z"
    clip-rule="evenodd"
  />
</svg>`,U=n.YP` <svg fill="none" viewBox="0 0 13 4">
  <path fill="currentColor" d="M.5 0h12L8.9 3.13a3.76 3.76 0 0 1-4.8 0L.5 0Z" />
</svg>`,L=n.YP`<svg fill="none" viewBox="0 0 20 20">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M13.66 2H6.34c-1.07 0-1.96 0-2.68.08-.74.08-1.42.25-2.01.68a4 4 0 0 0-.89.89c-.43.6-.6 1.27-.68 2.01C0 6.38 0 7.26 0 8.34v.89c0 1.07 0 1.96.08 2.68.08.74.25 1.42.68 2.01a4 4 0 0 0 .89.89c.6.43 1.27.6 2.01.68a27 27 0 0 0 2.68.08h7.32a27 27 0 0 0 2.68-.08 4.03 4.03 0 0 0 2.01-.68 4 4 0 0 0 .89-.89c.43-.6.6-1.27.68-2.01.08-.72.08-1.6.08-2.68v-.89c0-1.07 0-1.96-.08-2.68a4.04 4.04 0 0 0-.68-2.01 4 4 0 0 0-.89-.89c-.6-.43-1.27-.6-2.01-.68C15.62 2 14.74 2 13.66 2ZM2.82 4.38c.2-.14.48-.25 1.06-.31C4.48 4 5.25 4 6.4 4h7.2c1.15 0 1.93 0 2.52.07.58.06.86.17 1.06.31a2 2 0 0 1 .44.44c.14.2.25.48.31 1.06.07.6.07 1.37.07 2.52v.77c0 1.15 0 1.93-.07 2.52-.06.58-.17.86-.31 1.06a2 2 0 0 1-.44.44c-.2.14-.48.25-1.06.32-.6.06-1.37.06-2.52.06H6.4c-1.15 0-1.93 0-2.52-.06-.58-.07-.86-.18-1.06-.32a2 2 0 0 1-.44-.44c-.14-.2-.25-.48-.31-1.06C2 11.1 2 10.32 2 9.17V8.4c0-1.15 0-1.93.07-2.52.06-.58.17-.86.31-1.06a2 2 0 0 1 .44-.44Z"
    clip-rule="evenodd"
  />
  <path fill="currentColor" d="M6.14 17.57a1 1 0 1 0 0 2h7.72a1 1 0 1 0 0-2H6.14Z" />
</svg>`,D=n.YP`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M6.07 1h.57a1 1 0 0 1 0 2h-.52c-.98 0-1.64 0-2.14.06-.48.05-.7.14-.84.24-.13.1-.25.22-.34.35-.1.14-.2.35-.25.83-.05.5-.05 1.16-.05 2.15v2.74c0 .99 0 1.65.05 2.15.05.48.14.7.25.83.1.14.2.25.34.35.14.1.36.2.84.25.5.05 1.16.05 2.14.05h.52a1 1 0 0 1 0 2h-.57c-.92 0-1.69 0-2.3-.07a3.6 3.6 0 0 1-1.8-.61c-.3-.22-.57-.49-.8-.8a3.6 3.6 0 0 1-.6-1.79C.5 11.11.5 10.35.5 9.43V6.58c0-.92 0-1.7.06-2.31a3.6 3.6 0 0 1 .62-1.8c.22-.3.48-.57.79-.79a3.6 3.6 0 0 1 1.8-.61C4.37 1 5.14 1 6.06 1ZM9.5 3a1 1 0 0 1 1.42 0l4.28 4.3a1 1 0 0 1 0 1.4L10.93 13a1 1 0 0 1-1.42-1.42L12.1 9H6.8a1 1 0 1 1 0-2h5.3L9.51 4.42a1 1 0 0 1 0-1.41Z"
    clip-rule="evenodd"
  />
</svg>`,z=n.YP`<svg fill="none" viewBox="0 0 40 40">
  <g clip-path="url(#a)">
    <g clip-path="url(#b)">
      <circle cx="20" cy="19.89" r="20" fill="#5865F2" />
      <path
        fill="#fff"
        fill-rule="evenodd"
        d="M25.71 28.15C30.25 28 32 25.02 32 25.02c0-6.61-2.96-11.98-2.96-11.98-2.96-2.22-5.77-2.15-5.77-2.15l-.29.32c3.5 1.07 5.12 2.61 5.12 2.61a16.75 16.75 0 0 0-10.34-1.93l-.35.04a15.43 15.43 0 0 0-5.88 1.9s1.71-1.63 5.4-2.7l-.2-.24s-2.81-.07-5.77 2.15c0 0-2.96 5.37-2.96 11.98 0 0 1.73 2.98 6.27 3.13l1.37-1.7c-2.6-.79-3.6-2.43-3.6-2.43l.58.35.09.06.08.04.02.01.08.05a17.25 17.25 0 0 0 4.52 1.58 14.4 14.4 0 0 0 8.3-.86c.72-.27 1.52-.66 2.37-1.21 0 0-1.03 1.68-3.72 2.44.61.78 1.35 1.67 1.35 1.67Zm-9.55-9.6c-1.17 0-2.1 1.03-2.1 2.28 0 1.25.95 2.28 2.1 2.28 1.17 0 2.1-1.03 2.1-2.28.01-1.25-.93-2.28-2.1-2.28Zm7.5 0c-1.17 0-2.1 1.03-2.1 2.28 0 1.25.95 2.28 2.1 2.28 1.17 0 2.1-1.03 2.1-2.28 0-1.25-.93-2.28-2.1-2.28Z"
        clip-rule="evenodd"
      />
    </g>
  </g>
  <defs>
    <clipPath id="a"><rect width="40" height="40" fill="#fff" rx="20" /></clipPath>
    <clipPath id="b"><path fill="#fff" d="M0 0h40v40H0z" /></clipPath>
  </defs>
</svg>`,W=n.YP`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    d="M4.25 7a.63.63 0 0 0-.63.63v3.97c0 .28-.2.51-.47.54l-.75.07a.93.93 0 0 1-.9-.47A7.51 7.51 0 0 1 5.54.92a7.5 7.5 0 0 1 9.54 4.62c.12.35.06.72-.16 1-.74.97-1.68 1.78-2.6 2.44V4.44a.64.64 0 0 0-.63-.64h-1.06c-.35 0-.63.3-.63.64v5.5c0 .23-.12.42-.32.5l-.52.23V6.05c0-.36-.3-.64-.64-.64H7.45c-.35 0-.64.3-.64.64v4.97c0 .25-.17.46-.4.52a5.8 5.8 0 0 0-.45.11v-4c0-.36-.3-.65-.64-.65H4.25ZM14.07 12.4A7.49 7.49 0 0 1 3.6 14.08c4.09-.58 9.14-2.5 11.87-6.6v.03a7.56 7.56 0 0 1-1.41 4.91Z"
  />
</svg>`,F=n.YP`<svg fill="none" viewBox="0 0 14 15">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M6.71 2.99a.57.57 0 0 0-.57.57 1 1 0 0 1-1 1c-.58 0-.96 0-1.24.03-.27.03-.37.07-.42.1a.97.97 0 0 0-.36.35c-.04.08-.09.21-.11.67a2.57 2.57 0 0 1 0 5.13c.02.45.07.6.11.66.09.15.21.28.36.36.07.04.21.1.67.12a2.57 2.57 0 0 1 5.12 0c.46-.03.6-.08.67-.12a.97.97 0 0 0 .36-.36c.03-.04.07-.14.1-.41.02-.29.03-.66.03-1.24a1 1 0 0 1 1-1 .57.57 0 0 0 0-1.15 1 1 0 0 1-1-1c0-.58 0-.95-.03-1.24a1.04 1.04 0 0 0-.1-.42.97.97 0 0 0-.36-.36 1.04 1.04 0 0 0-.42-.1c-.28-.02-.65-.02-1.24-.02a1 1 0 0 1-1-1 .57.57 0 0 0-.57-.57ZM5.15 13.98a1 1 0 0 0 .99-1v-.78a.57.57 0 0 1 1.14 0v.78a1 1 0 0 0 .99 1H8.36a66.26 66.26 0 0 0 .73 0 3.78 3.78 0 0 0 1.84-.38c.46-.26.85-.64 1.1-1.1.23-.4.32-.8.36-1.22.02-.2.03-.4.03-.63a2.57 2.57 0 0 0 0-4.75c0-.23-.01-.44-.03-.63a2.96 2.96 0 0 0-.35-1.22 2.97 2.97 0 0 0-1.1-1.1c-.4-.22-.8-.31-1.22-.35a8.7 8.7 0 0 0-.64-.04 2.57 2.57 0 0 0-4.74 0c-.23 0-.44.02-.63.04-.42.04-.83.13-1.22.35-.46.26-.84.64-1.1 1.1-.33.57-.37 1.2-.39 1.84a21.39 21.39 0 0 0 0 .72v.1a1 1 0 0 0 1 .99h.78a.57.57 0 0 1 0 1.15h-.77a1 1 0 0 0-1 .98v.1a63.87 63.87 0 0 0 0 .73c0 .64.05 1.27.38 1.83.26.47.64.85 1.1 1.11.56.32 1.2.37 1.84.38a20.93 20.93 0 0 0 .72 0h.1Z"
    clip-rule="evenodd"
  />
</svg>`,H=n.YP`<svg fill="none" viewBox="0 0 14 15">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M3.74 3.99a1 1 0 0 1 1-1H11a1 1 0 0 1 1 1v6.26a1 1 0 0 1-2 0V6.4l-6.3 6.3a1 1 0 0 1-1.4-1.42l6.29-6.3H4.74a1 1 0 0 1-1-1Z"
    clip-rule="evenodd"
  />
</svg>`,G=n.YP`<svg fill="none" viewBox="0 0 40 40">
  <g clip-path="url(#a)">
    <g clip-path="url(#b)">
      <circle cx="20" cy="19.89" r="20" fill="#1877F2" />
      <g clip-path="url(#c)">
        <path
          fill="#fff"
          d="M26 12.38h-2.89c-.92 0-1.61.38-1.61 1.34v1.66H26l-.36 4.5H21.5v12H17v-12h-3v-4.5h3V12.5c0-3.03 1.6-4.62 5.2-4.62H26v4.5Z"
        />
      </g>
    </g>
    <path
      fill="#1877F2"
      d="M40 20a20 20 0 1 0-23.13 19.76V25.78H11.8V20h5.07v-4.4c0-5.02 3-7.79 7.56-7.79 2.19 0 4.48.4 4.48.4v4.91h-2.53c-2.48 0-3.25 1.55-3.25 3.13V20h5.54l-.88 5.78h-4.66v13.98A20 20 0 0 0 40 20Z"
    />
    <path
      fill="#fff"
      d="m27.79 25.78.88-5.78h-5.55v-3.75c0-1.58.78-3.13 3.26-3.13h2.53V8.2s-2.3-.39-4.48-.39c-4.57 0-7.55 2.77-7.55 7.78V20H11.8v5.78h5.07v13.98a20.15 20.15 0 0 0 6.25 0V25.78h4.67Z"
    />
  </g>
  <defs>
    <clipPath id="a"><rect width="40" height="40" fill="#fff" rx="20" /></clipPath>
    <clipPath id="b"><path fill="#fff" d="M0 0h40v40H0z" /></clipPath>
    <clipPath id="c"><path fill="#fff" d="M8 7.89h24v24H8z" /></clipPath>
  </defs>
</svg>`,q=n.YP`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M0 3a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1Zm2.63 5.25a1 1 0 0 1 1-1h8.75a1 1 0 1 1 0 2H3.63a1 1 0 0 1-1-1Zm2.62 5.25a1 1 0 0 1 1-1h3.5a1 1 0 0 1 0 2h-3.5a1 1 0 0 1-1-1Z"
    clip-rule="evenodd"
  />
</svg>`,Z=n.YP`<svg fill="none" viewBox="0 0 40 40">
  <g clip-path="url(#a)">
    <g clip-path="url(#b)">
      <circle cx="20" cy="19.89" r="20" fill="#1B1F23" />
      <g clip-path="url(#c)">
        <path
          fill="#fff"
          d="M8 19.89a12 12 0 1 1 15.8 11.38c-.6.12-.8-.26-.8-.57v-3.3c0-1.12-.4-1.85-.82-2.22 2.67-.3 5.48-1.31 5.48-5.92 0-1.31-.47-2.38-1.24-3.22.13-.3.54-1.52-.12-3.18 0 0-1-.32-3.3 1.23a11.54 11.54 0 0 0-6 0c-2.3-1.55-3.3-1.23-3.3-1.23a4.32 4.32 0 0 0-.12 3.18 4.64 4.64 0 0 0-1.24 3.22c0 4.6 2.8 5.63 5.47 5.93-.34.3-.65.83-.76 1.6-.69.31-2.42.84-3.5-1 0 0-.63-1.15-1.83-1.23 0 0-1.18-.02-.09.73 0 0 .8.37 1.34 1.76 0 0 .7 2.14 4.03 1.41v2.24c0 .31-.2.68-.8.57A12 12 0 0 1 8 19.9Z"
        />
      </g>
    </g>
  </g>
  <defs>
    <clipPath id="a"><rect width="40" height="40" fill="#fff" rx="20" /></clipPath>
    <clipPath id="b"><path fill="#fff" d="M0 0h40v40H0z" /></clipPath>
    <clipPath id="c"><path fill="#fff" d="M8 7.89h24v24H8z" /></clipPath>
  </defs>
</svg>`,V=n.YP`<svg fill="none" viewBox="0 0 40 40">
  <g clip-path="url(#a)">
    <g clip-path="url(#b)">
      <circle cx="20" cy="19.89" r="20" fill="#fff" fill-opacity=".05" />
      <g clip-path="url(#c)">
        <path
          fill="#4285F4"
          d="M20 17.7v4.65h6.46a5.53 5.53 0 0 1-2.41 3.61l3.9 3.02c2.26-2.09 3.57-5.17 3.57-8.82 0-.85-.08-1.67-.22-2.46H20Z"
        />
        <path
          fill="#34A853"
          d="m13.27 22.17-.87.67-3.11 2.42A12 12 0 0 0 20 31.9c3.24 0 5.96-1.07 7.94-2.9l-3.9-3.03A7.15 7.15 0 0 1 20 27.12a7.16 7.16 0 0 1-6.72-4.94v-.01Z"
        />
        <path
          fill="#FBBC05"
          d="M9.29 14.5a11.85 11.85 0 0 0 0 10.76l3.99-3.1a7.19 7.19 0 0 1 0-4.55l-4-3.1Z"
        />
        <path
          fill="#EA4335"
          d="M20 12.66c1.77 0 3.34.61 4.6 1.8l3.43-3.44A11.51 11.51 0 0 0 20 7.89c-4.7 0-8.74 2.69-10.71 6.62l3.99 3.1A7.16 7.16 0 0 1 20 12.66Z"
        />
      </g>
    </g>
  </g>
  <defs>
    <clipPath id="a"><rect width="40" height="40" fill="#fff" rx="20" /></clipPath>
    <clipPath id="b"><path fill="#fff" d="M0 0h40v40H0z" /></clipPath>
    <clipPath id="c"><path fill="#fff" d="M8 7.89h24v24H8z" /></clipPath>
  </defs>
</svg>`,Y=n.YP`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    d="M8.51 5.66a.83.83 0 0 0-.57-.2.83.83 0 0 0-.52.28.8.8 0 0 0-.25.52 1 1 0 0 1-2 0c0-.75.34-1.43.81-1.91a2.75 2.75 0 0 1 4.78 1.92c0 1.24-.8 1.86-1.25 2.2l-.04.03c-.47.36-.5.43-.5.65a1 1 0 1 1-2 0c0-1.25.8-1.86 1.24-2.2l.04-.04c.47-.36.5-.43.5-.65 0-.3-.1-.49-.24-.6ZM9.12 11.87a1.13 1.13 0 1 1-2.25 0 1.13 1.13 0 0 1 2.25 0Z"
  />
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6a6 6 0 1 0 0 12A6 6 0 0 0 8 2Z"
    clip-rule="evenodd"
  />
</svg>`,K=n.YP`<svg fill="none" viewBox="0 0 14 15">
  <path
    fill="currentColor"
    d="M6 10.49a1 1 0 1 0 2 0v-2a1 1 0 0 0-2 0v2ZM7 4.49a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
  />
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M7 14.99a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-7a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"
    clip-rule="evenodd"
  />
</svg>`,X=n.YP`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M4.83 1.34h6.34c.68 0 1.26 0 1.73.04.5.05.97.15 1.42.4.52.3.95.72 1.24 1.24.26.45.35.92.4 1.42.04.47.04 1.05.04 1.73v3.71c0 .69 0 1.26-.04 1.74-.05.5-.14.97-.4 1.41-.3.52-.72.95-1.24 1.25-.45.25-.92.35-1.42.4-.47.03-1.05.03-1.73.03H4.83c-.68 0-1.26 0-1.73-.04-.5-.04-.97-.14-1.42-.4-.52-.29-.95-.72-1.24-1.24a3.39 3.39 0 0 1-.4-1.41A20.9 20.9 0 0 1 0 9.88v-3.7c0-.7 0-1.27.04-1.74.05-.5.14-.97.4-1.42.3-.52.72-.95 1.24-1.24.45-.25.92-.35 1.42-.4.47-.04 1.05-.04 1.73-.04ZM3.28 3.38c-.36.03-.51.08-.6.14-.21.11-.39.29-.5.5a.8.8 0 0 0-.08.19l5.16 3.44c.45.3 1.03.3 1.48 0L13.9 4.2a.79.79 0 0 0-.08-.2c-.11-.2-.29-.38-.5-.5-.09-.05-.24-.1-.6-.13-.37-.04-.86-.04-1.6-.04H4.88c-.73 0-1.22 0-1.6.04ZM14 6.54 9.85 9.31a3.33 3.33 0 0 1-3.7 0L2 6.54v3.3c0 .74 0 1.22.03 1.6.04.36.1.5.15.6.11.2.29.38.5.5.09.05.24.1.6.14.37.03.86.03 1.6.03h6.25c.73 0 1.22 0 1.6-.03.35-.03.5-.09.6-.14.2-.12.38-.3.5-.5.05-.1.1-.24.14-.6.03-.38.03-.86.03-1.6v-3.3Z"
    clip-rule="evenodd"
  />
</svg>`,J=n.YP`<svg fill="none" viewBox="0 0 20 20">
  <path fill="currentColor" d="M10.81 5.81a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M3 4.75A4.75 4.75 0 0 1 7.75 0h4.5A4.75 4.75 0 0 1 17 4.75v10.5A4.75 4.75 0 0 1 12.25 20h-4.5A4.75 4.75 0 0 1 3 15.25V4.75ZM7.75 2A2.75 2.75 0 0 0 5 4.75v10.5A2.75 2.75 0 0 0 7.75 18h4.5A2.75 2.75 0 0 0 15 15.25V4.75A2.75 2.75 0 0 0 12.25 2h-4.5Z"
    clip-rule="evenodd"
  />
</svg>`,Q=n.YP`<svg fill="none" viewBox="0 0 22 20">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M16.32 13.62a3.14 3.14 0 1 1-.99 1.72l-1.6-.93a3.83 3.83 0 0 1-3.71 1 3.66 3.66 0 0 1-1.74-1l-1.6.94a3.14 3.14 0 1 1-1-1.73l1.6-.94a3.7 3.7 0 0 1 0-2 3.81 3.81 0 0 1 1.8-2.33c.29-.17.6-.3.92-.38V6.1a3.14 3.14 0 1 1 2 0l-.01.02v1.85H12a3.82 3.82 0 0 1 2.33 1.8 3.7 3.7 0 0 1 .39 2.91l1.6.93ZM2.6 16.54a1.14 1.14 0 0 0 1.98-1.14 1.14 1.14 0 0 0-1.98 1.14ZM11 2.01a1.14 1.14 0 1 0 0 2.28 1.14 1.14 0 0 0 0-2.28Zm1.68 10.45c.08-.19.14-.38.16-.58v-.05l.02-.13v-.13a1.92 1.92 0 0 0-.24-.8l-.11-.15a1.89 1.89 0 0 0-.74-.6 1.86 1.86 0 0 0-.77-.17h-.19a1.97 1.97 0 0 0-.89.34 1.98 1.98 0 0 0-.61.74 1.99 1.99 0 0 0-.16.9v.05a1.87 1.87 0 0 0 .24.74l.1.15c.12.16.26.3.42.42l.16.1.13.07.04.02a1.84 1.84 0 0 0 .76.17h.17a2 2 0 0 0 .91-.35 1.78 1.78 0 0 0 .52-.58l.03-.05a.84.84 0 0 0 .05-.11Zm5.15 4.5a1.14 1.14 0 0 0 1.14-1.97 1.13 1.13 0 0 0-1.55.41c-.32.55-.13 1.25.41 1.56Z"
    clip-rule="evenodd"
  />
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M4.63 9.43a1.5 1.5 0 1 0 1.5-2.6 1.5 1.5 0 0 0-1.5 2.6Zm.32-1.55a.5.5 0 0 1 .68-.19.5.5 0 0 1 .18.68.5.5 0 0 1-.68.19.5.5 0 0 1-.18-.68ZM17.94 8.88a1.5 1.5 0 1 1-2.6-1.5 1.5 1.5 0 1 1 2.6 1.5ZM16.9 7.69a.5.5 0 0 0-.68.19.5.5 0 0 0 .18.68.5.5 0 0 0 .68-.19.5.5 0 0 0-.18-.68ZM9.75 17.75a1.5 1.5 0 1 1 2.6 1.5 1.5 1.5 0 1 1-2.6-1.5Zm1.05 1.18a.5.5 0 0 0 .68-.18.5.5 0 0 0-.18-.68.5.5 0 0 0-.68.18.5.5 0 0 0 .18.68Z"
    clip-rule="evenodd"
  />
</svg>`,ee=n.YP`<svg fill="none" viewBox="0 0 20 20">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M9.13 1h1.71c1.46 0 2.63 0 3.56.1.97.1 1.8.33 2.53.85a5 5 0 0 1 1.1 1.11c.53.73.75 1.56.86 2.53.1.93.1 2.1.1 3.55v1.72c0 1.45 0 2.62-.1 3.55-.1.97-.33 1.8-.86 2.53a5 5 0 0 1-1.1 1.1c-.73.53-1.56.75-2.53.86-.93.1-2.1.1-3.55.1H9.13c-1.45 0-2.62 0-3.56-.1-.96-.1-1.8-.33-2.52-.85a5 5 0 0 1-1.1-1.11 5.05 5.05 0 0 1-.86-2.53c-.1-.93-.1-2.1-.1-3.55V9.14c0-1.45 0-2.62.1-3.55.1-.97.33-1.8.85-2.53a5 5 0 0 1 1.1-1.1 5.05 5.05 0 0 1 2.53-.86C6.51 1 7.67 1 9.13 1ZM5.79 3.09a3.1 3.1 0 0 0-1.57.48 3 3 0 0 0-.66.67c-.24.32-.4.77-.48 1.56-.1.82-.1 1.88-.1 3.4v1.6c0 1.15 0 2.04.05 2.76l.41-.42c.5-.5.93-.92 1.32-1.24.41-.33.86-.6 1.43-.7a3 3 0 0 1 .94 0c.35.06.66.2.95.37a17.11 17.11 0 0 0 .8.45c.1-.08.2-.2.41-.4l.04-.03a27 27 0 0 1 1.95-1.84 4.03 4.03 0 0 1 1.91-.94 4 4 0 0 1 1.25 0c.73.11 1.33.46 1.91.94l.64.55V9.2c0-1.52 0-2.58-.1-3.4a3.1 3.1 0 0 0-.48-1.56 3 3 0 0 0-.66-.67 3.1 3.1 0 0 0-1.56-.48C13.37 3 12.3 3 10.79 3h-1.6c-1.52 0-2.59 0-3.4.09Zm11.18 10-.04-.05a26.24 26.24 0 0 0-1.83-1.74c-.45-.36-.73-.48-.97-.52a2 2 0 0 0-.63 0c-.24.04-.51.16-.97.52-.46.38-1.01.93-1.83 1.74l-.02.02c-.17.18-.34.34-.49.47a2.04 2.04 0 0 1-1.08.5 1.97 1.97 0 0 1-1.25-.27l-.79-.46-.02-.02a.65.65 0 0 0-.24-.1 1 1 0 0 0-.31 0c-.08.02-.21.06-.49.28-.3.24-.65.59-1.2 1.14l-.56.56-.65.66a3 3 0 0 0 .62.6c.33.24.77.4 1.57.49.81.09 1.88.09 3.4.09h1.6c1.52 0 2.58 0 3.4-.09a3.1 3.1 0 0 0 1.56-.48 3 3 0 0 0 .66-.67c.24-.32.4-.77.49-1.56l.07-1.12Zm-8.02-1.03ZM4.99 7a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z"
    clip-rule="evenodd"
  />
</svg>`,te=n.YP`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M8 0a1 1 0 0 1 1 1v5.38a1 1 0 0 1-2 0V1a1 1 0 0 1 1-1ZM5.26 2.6a1 1 0 0 1-.28 1.39 5.46 5.46 0 1 0 6.04 0 1 1 0 1 1 1.1-1.67 7.46 7.46 0 1 1-8.25 0 1 1 0 0 1 1.4.28Z"
    clip-rule="evenodd"
  />
</svg>`,re=n.YP` <svg
  width="36"
  height="36"
  fill="none"
>
  <path
    d="M0 8a8 8 0 0 1 8-8h20a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8V8Z"
    fill="#fff"
    fill-opacity=".05"
  />
  <path
    d="m18.262 17.513-8.944 9.49v.01a2.417 2.417 0 0 0 3.56 1.452l.026-.017 10.061-5.803-4.703-5.132Z"
    fill="#EA4335"
  />
  <path
    d="m27.307 15.9-.008-.008-4.342-2.52-4.896 4.36 4.913 4.912 4.325-2.494a2.42 2.42 0 0 0 .008-4.25Z"
    fill="#FBBC04"
  />
  <path
    d="M9.318 8.997c-.05.202-.084.403-.084.622V26.39c0 .218.025.42.084.621l9.246-9.247-9.246-8.768Z"
    fill="#4285F4"
  />
  <path
    d="m18.33 18 4.627-4.628-10.053-5.828a2.427 2.427 0 0 0-3.586 1.444L18.329 18Z"
    fill="#34A853"
  />
  <path
    d="M8 .5h20A7.5 7.5 0 0 1 35.5 8v20a7.5 7.5 0 0 1-7.5 7.5H8A7.5 7.5 0 0 1 .5 28V8A7.5 7.5 0 0 1 8 .5Z"
    stroke="#fff"
    stroke-opacity=".05"
  />
</svg>`,ne=n.YP`<svg fill="none" viewBox="0 0 20 20">
  <path
    fill="currentColor"
    d="M3 6a3 3 0 0 1 3-3h1a1 1 0 1 0 0-2H6a5 5 0 0 0-5 5v1a1 1 0 0 0 2 0V6ZM13 1a1 1 0 1 0 0 2h1a3 3 0 0 1 3 3v1a1 1 0 1 0 2 0V6a5 5 0 0 0-5-5h-1ZM3 13a1 1 0 1 0-2 0v1a5 5 0 0 0 5 5h1a1 1 0 1 0 0-2H6a3 3 0 0 1-3-3v-1ZM19 13a1 1 0 1 0-2 0v1a3 3 0 0 1-3 3h-1a1 1 0 1 0 0 2h1.01a5 5 0 0 0 5-5v-1ZM5.3 6.36c-.04.2-.04.43-.04.89s0 .7.05.89c.14.52.54.92 1.06 1.06.19.05.42.05.89.05.46 0 .7 0 .88-.05A1.5 1.5 0 0 0 9.2 8.14c.06-.2.06-.43.06-.89s0-.7-.06-.89A1.5 1.5 0 0 0 8.14 5.3c-.19-.05-.42-.05-.88-.05-.47 0-.7 0-.9.05a1.5 1.5 0 0 0-1.05 1.06ZM10.8 6.36c-.04.2-.04.43-.04.89s0 .7.05.89c.14.52.54.92 1.06 1.06.19.05.42.05.89.05.46 0 .7 0 .88-.05a1.5 1.5 0 0 0 1.06-1.06c.06-.2.06-.43.06-.89s0-.7-.06-.89a1.5 1.5 0 0 0-1.06-1.06c-.19-.05-.42-.05-.88-.05-.47 0-.7 0-.9.05a1.5 1.5 0 0 0-1.05 1.06ZM5.26 12.75c0-.46 0-.7.05-.89a1.5 1.5 0 0 1 1.06-1.06c.19-.05.42-.05.89-.05.46 0 .7 0 .88.05.52.14.93.54 1.06 1.06.06.2.06.43.06.89s0 .7-.06.89a1.5 1.5 0 0 1-1.06 1.06c-.19.05-.42.05-.88.05-.47 0-.7 0-.9-.05a1.5 1.5 0 0 1-1.05-1.06c-.05-.2-.05-.43-.05-.89ZM10.8 11.86c-.04.2-.04.43-.04.89s0 .7.05.89c.14.52.54.92 1.06 1.06.19.05.42.05.89.05.46 0 .7 0 .88-.05a1.5 1.5 0 0 0 1.06-1.06c.06-.2.06-.43.06-.89s0-.7-.06-.89a1.5 1.5 0 0 0-1.06-1.06c-.19-.05-.42-.05-.88-.05-.47 0-.7 0-.9.05a1.5 1.5 0 0 0-1.05 1.06Z"
  />
</svg>`,ie=n.YP`<svg fill="none" viewBox="0 0 14 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M3.94 1.04a1 1 0 0 1 .7 1.23l-.48 1.68a5.85 5.85 0 0 1 8.53 4.32 5.86 5.86 0 0 1-11.4 2.56 1 1 0 0 1 1.9-.57 3.86 3.86 0 1 0 1.83-4.5l1.87.53a1 1 0 0 1-.55 1.92l-4.1-1.15a1 1 0 0 1-.69-1.23l1.16-4.1a1 1 0 0 1 1.23-.7Z"
    clip-rule="evenodd"
  />
</svg>`,oe=n.YP`<svg fill="none" viewBox="0 0 20 20">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M9.36 4.21a5.14 5.14 0 1 0 0 10.29 5.14 5.14 0 0 0 0-10.29ZM1.64 9.36a7.71 7.71 0 1 1 14 4.47l2.52 2.5a1.29 1.29 0 1 1-1.82 1.83l-2.51-2.51A7.71 7.71 0 0 1 1.65 9.36Z"
    clip-rule="evenodd"
  />
</svg>`,ae=n.YP`<svg fill="none" viewBox="0 0 20 20">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M6.76.3a1 1 0 0 1 0 1.4L4.07 4.4h9a1 1 0 1 1 0 2h-9l2.69 2.68a1 1 0 1 1-1.42 1.42L.95 6.09a1 1 0 0 1 0-1.4l4.4-4.4a1 1 0 0 1 1.4 0Zm6.49 9.21a1 1 0 0 1 1.41 0l4.39 4.4a1 1 0 0 1 0 1.4l-4.39 4.4a1 1 0 0 1-1.41-1.42l2.68-2.68h-9a1 1 0 0 1 0-2h9l-2.68-2.68a1 1 0 0 1 0-1.42Z"
    clip-rule="evenodd"
  />
</svg>`,se=n.YP`<svg width="10" height="10" viewBox="0 0 10 10">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M3.77986 0.566631C4.0589 0.845577 4.0589 1.29784 3.77986 1.57678L3.08261 2.2738H6.34184C6.73647 2.2738 7.05637 2.5936 7.05637 2.98808C7.05637 3.38257 6.73647 3.70237 6.34184 3.70237H3.08261L3.77986 4.39938C4.0589 4.67833 4.0589 5.13059 3.77986 5.40954C3.50082 5.68848 3.04841 5.68848 2.76937 5.40954L0.852346 3.49316C0.573306 3.21421 0.573306 2.76195 0.852346 2.48301L2.76937 0.566631C3.04841 0.287685 3.50082 0.287685 3.77986 0.566631ZM6.22 4.59102C6.49904 4.31208 6.95145 4.31208 7.23049 4.59102L9.14751 6.5074C9.42655 6.78634 9.42655 7.23861 9.14751 7.51755L7.23049 9.43393C6.95145 9.71287 6.49904 9.71287 6.22 9.43393C5.94096 9.15498 5.94096 8.70272 6.22 8.42377L6.91725 7.72676L3.65802 7.72676C3.26339 7.72676 2.94349 7.40696 2.94349 7.01247C2.94349 6.61798 3.26339 6.29819 3.65802 6.29819L6.91725 6.29819L6.22 5.60117C5.94096 5.32223 5.94096 4.86997 6.22 4.59102Z"
    clip-rule="evenodd"
  />
</svg>`,ce=n.YP`<svg fill="none" viewBox="0 0 14 14">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M3.48 2.18a1 1 0 0 1 1.41 0l2.68 2.68a1 1 0 1 1-1.41 1.42l-.98-.98v4.56a1 1 0 0 1-2 0V5.3l-.97.98A1 1 0 0 1 .79 4.86l2.69-2.68Zm6.34 2.93a1 1 0 0 1 1 1v4.56l.97-.98a1 1 0 1 1 1.42 1.42l-2.69 2.68a1 1 0 0 1-1.41 0l-2.68-2.68a1 1 0 0 1 1.41-1.42l.98.98V6.1a1 1 0 0 1 1-1Z"
    clip-rule="evenodd"
  />
</svg>`,le=n.YP`<svg fill="none" viewBox="0 0 40 40">
  <g clip-path="url(#a)">
    <g clip-path="url(#b)">
      <circle cx="20" cy="19.89" r="20" fill="#5865F2" />
      <path
        fill="#fff"
        fill-rule="evenodd"
        d="M25.71 28.15C30.25 28 32 25.02 32 25.02c0-6.61-2.96-11.98-2.96-11.98-2.96-2.22-5.77-2.15-5.77-2.15l-.29.32c3.5 1.07 5.12 2.61 5.12 2.61a16.75 16.75 0 0 0-10.34-1.93l-.35.04a15.43 15.43 0 0 0-5.88 1.9s1.71-1.63 5.4-2.7l-.2-.24s-2.81-.07-5.77 2.15c0 0-2.96 5.37-2.96 11.98 0 0 1.73 2.98 6.27 3.13l1.37-1.7c-2.6-.79-3.6-2.43-3.6-2.43l.58.35.09.06.08.04.02.01.08.05a17.25 17.25 0 0 0 4.52 1.58 14.4 14.4 0 0 0 8.3-.86c.72-.27 1.52-.66 2.37-1.21 0 0-1.03 1.68-3.72 2.44.61.78 1.35 1.67 1.35 1.67Zm-9.55-9.6c-1.17 0-2.1 1.03-2.1 2.28 0 1.25.95 2.28 2.1 2.28 1.17 0 2.1-1.03 2.1-2.28.01-1.25-.93-2.28-2.1-2.28Zm7.5 0c-1.17 0-2.1 1.03-2.1 2.28 0 1.25.95 2.28 2.1 2.28 1.17 0 2.1-1.03 2.1-2.28 0-1.25-.93-2.28-2.1-2.28Z"
        clip-rule="evenodd"
      />
    </g>
  </g>
  <defs>
    <clipPath id="a"><rect width="40" height="40" fill="#fff" rx="20" /></clipPath>
    <clipPath id="b"><path fill="#fff" d="M0 0h40v40H0z" /></clipPath>
  </defs>
</svg> `,ue=n.YP`<svg fill="none" viewBox="0 0 40 40">
  <g clip-path="url(#a)">
    <g clip-path="url(#b)">
      <circle cx="20" cy="19.89" r="20" fill="#5A3E85" />
      <g clip-path="url(#c)">
        <path
          fill="#fff"
          d="M18.22 25.7 20 23.91h3.34l2.1-2.1v-6.68H15.4v8.78h2.82v1.77Zm3.87-8.16h1.25v3.66H22.1v-3.66Zm-3.34 0H20v3.66h-1.25v-3.66ZM20 7.9a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm6.69 14.56-3.66 3.66h-2.72l-1.77 1.78h-1.88V26.1H13.3v-9.82l.94-2.4H26.7v8.56Z"
        />
      </g>
    </g>
  </g>
  <defs>
    <clipPath id="a"><rect width="40" height="40" fill="#fff" rx="20" /></clipPath>
    <clipPath id="b"><path fill="#fff" d="M0 0h40v40H0z" /></clipPath>
    <clipPath id="c"><path fill="#fff" d="M8 7.89h24v24H8z" /></clipPath>
  </defs>
</svg>`,de=n.YP`<svg fill="none" viewBox="0 0 40 40">
  <g clip-path="url(#a)">
    <g clip-path="url(#b)">
      <circle cx="20" cy="19.89" r="20" fill="#1D9BF0" />
      <path
        fill="#fff"
        d="M30 13.81c-.74.33-1.53.55-2.36.65.85-.51 1.5-1.32 1.8-2.27-.79.47-1.66.8-2.6 1a4.1 4.1 0 0 0-7 3.73c-3.4-.17-6.42-1.8-8.45-4.28a4.1 4.1 0 0 0 1.27 5.47c-.67-.02-1.3-.2-1.86-.5a4.1 4.1 0 0 0 3.3 4.07c-.58.15-1.21.19-1.86.07a4.1 4.1 0 0 0 3.83 2.85A8.25 8.25 0 0 1 10 26.3a11.62 11.62 0 0 0 6.29 1.84c7.62 0 11.92-6.44 11.66-12.2.8-.59 1.5-1.3 2.05-2.13Z"
      />
    </g>
  </g>
  <defs>
    <clipPath id="a"><rect width="40" height="40" fill="#fff" rx="20" /></clipPath>
    <clipPath id="b"><path fill="#fff" d="M0 0h40v40H0z" /></clipPath>
  </defs>
</svg>`,he=n.YP`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    d="m14.36 4.74.01.42c0 4.34-3.3 9.34-9.34 9.34A9.3 9.3 0 0 1 0 13.03a6.6 6.6 0 0 0 4.86-1.36 3.29 3.29 0 0 1-3.07-2.28c.5.1 1 .07 1.48-.06A3.28 3.28 0 0 1 .64 6.11v-.04c.46.26.97.4 1.49.41A3.29 3.29 0 0 1 1.11 2.1a9.32 9.32 0 0 0 6.77 3.43 3.28 3.28 0 0 1 5.6-3 6.59 6.59 0 0 0 2.08-.8 3.3 3.3 0 0 1-1.45 1.82A6.53 6.53 0 0 0 16 3.04c-.44.66-1 1.23-1.64 1.7Z"
  />
</svg>`,pe=n.YP`
  <svg fill="none" viewBox="0 0 48 44">
    <path
      style="fill: var(--wui-color-bg-300);"
      d="M4.56 8.64c-1.23 1.68-1.23 4.08-1.23 8.88v8.96c0 4.8 0 7.2 1.23 8.88.39.55.87 1.02 1.41 1.42C7.65 38 10.05 38 14.85 38h14.3c4.8 0 7.2 0 8.88-1.22a6.4 6.4 0 0 0 1.41-1.42c.83-1.14 1.1-2.6 1.19-4.92a6.4 6.4 0 0 0 5.16-4.65c.21-.81.21-1.8.21-3.79 0-1.98 0-2.98-.22-3.79a6.4 6.4 0 0 0-5.15-4.65c-.1-2.32-.36-3.78-1.19-4.92a6.4 6.4 0 0 0-1.41-1.42C36.35 6 33.95 6 29.15 6h-14.3c-4.8 0-7.2 0-8.88 1.22a6.4 6.4 0 0 0-1.41 1.42Z"
    />
    <path
      style="fill: var(--wui-color-fg-200);"
      fill-rule="evenodd"
      d="M2.27 11.33a6.4 6.4 0 0 1 6.4-6.4h26.66a6.4 6.4 0 0 1 6.4 6.4v1.7a6.4 6.4 0 0 1 5.34 6.3v5.34a6.4 6.4 0 0 1-5.34 6.3v1.7a6.4 6.4 0 0 1-6.4 6.4H8.67a6.4 6.4 0 0 1-6.4-6.4V11.33ZM39.6 31.07h-6.93a9.07 9.07 0 1 1 0-18.14h6.93v-1.6a4.27 4.27 0 0 0-4.27-4.26H8.67a4.27 4.27 0 0 0-4.27 4.26v21.34a4.27 4.27 0 0 0 4.27 4.26h26.66a4.27 4.27 0 0 0 4.27-4.26v-1.6Zm-6.93-16a6.93 6.93 0 0 0 0 13.86h8a4.27 4.27 0 0 0 4.26-4.26v-5.34a4.27 4.27 0 0 0-4.26-4.26h-8Z"
      clip-rule="evenodd"
    />
  </svg>
`;var fe=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};const ge={allWallets:y,appStore:v,chromeStore:T,apple:x,arrowBottom:C,arrowLeft:k,arrowRight:E,arrowTop:P,browser:$,checkmark:S,chevronBottom:_,chevronLeft:A,chevronRight:I,chevronTop:O,clock:N,close:R,compass:B,coinPlaceholder:j,copy:M,cursor:U,desktop:L,disconnect:D,discord:z,etherscan:W,extension:F,externalLink:H,facebook:G,filters:q,github:Z,google:V,helpCircle:Y,infoCircle:K,mail:X,mobile:J,networkPlaceholder:Q,nftPlaceholder:ee,off:te,playStore:re,qrCode:ne,refresh:ie,search:oe,swapHorizontal:ae,swapHorizontalBold:se,swapVertical:ce,telegram:le,twitch:ue,twitter:de,twitterIcon:he,wallet:n.YP`<svg fill="none" viewBox="0 0 20 20">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M0 5.5c0-1.8 1.46-3.25 3.25-3.25H14.5c1.8 0 3.25 1.46 3.25 3.25v.28A3.25 3.25 0 0 1 20 8.88v2.24c0 1.45-.94 2.68-2.25 3.1v.28c0 1.8-1.46 3.25-3.25 3.25H3.25A3.25 3.25 0 0 1 0 14.5v-9Zm15.75 8.88h-2.38a4.38 4.38 0 0 1 0-8.76h2.38V5.5c0-.69-.56-1.25-1.25-1.25H3.25C2.56 4.25 2 4.81 2 5.5v9c0 .69.56 1.25 1.25 1.25H14.5c.69 0 1.25-.56 1.25-1.25v-.13Zm-2.38-6.76a2.37 2.37 0 1 0 0 4.75h3.38c.69 0 1.25-.55 1.25-1.24V8.87c0-.69-.56-1.24-1.25-1.24h-3.38Z"
    clip-rule="evenodd"
  />
</svg>`,walletConnect:n.YP`<svg fill="none" viewBox="0 0 96 67">
  <path
    fill="currentColor"
    d="M25.32 18.8a32.56 32.56 0 0 1 45.36 0l1.5 1.47c.63.62.63 1.61 0 2.22l-5.15 5.05c-.31.3-.82.3-1.14 0l-2.07-2.03a22.71 22.71 0 0 0-31.64 0l-2.22 2.18c-.31.3-.82.3-1.14 0l-5.15-5.05a1.55 1.55 0 0 1 0-2.22l1.65-1.62Zm56.02 10.44 4.59 4.5c.63.6.63 1.6 0 2.21l-20.7 20.26c-.62.61-1.63.61-2.26 0L48.28 41.83a.4.4 0 0 0-.56 0L33.03 56.21c-.63.61-1.64.61-2.27 0L10.07 35.95a1.55 1.55 0 0 1 0-2.22l4.59-4.5a1.63 1.63 0 0 1 2.27 0L31.6 43.63a.4.4 0 0 0 .57 0l14.69-14.38a1.63 1.63 0 0 1 2.26 0l14.69 14.38a.4.4 0 0 0 .57 0l14.68-14.38a1.63 1.63 0 0 1 2.27 0Z"
  />
  <path
    stroke="#000"
    stroke-opacity=".1"
    d="M25.67 19.15a32.06 32.06 0 0 1 44.66 0l1.5 1.48c.43.42.43 1.09 0 1.5l-5.15 5.05a.31.31 0 0 1-.44 0l-2.07-2.03a23.21 23.21 0 0 0-32.34 0l-2.22 2.18a.31.31 0 0 1-.44 0l-5.15-5.05a1.05 1.05 0 0 1 0-1.5l1.65-1.63ZM81 29.6l4.6 4.5c.42.41.42 1.09 0 1.5l-20.7 20.26c-.43.43-1.14.43-1.57 0L48.63 41.47a.9.9 0 0 0-1.26 0L32.68 55.85c-.43.43-1.14.43-1.57 0L10.42 35.6a1.05 1.05 0 0 1 0-1.5l4.59-4.5a1.13 1.13 0 0 1 1.57 0l14.68 14.38a.9.9 0 0 0 1.27 0l-.35-.35.35.35L47.22 29.6a1.13 1.13 0 0 1 1.56 0l14.7 14.38a.9.9 0 0 0 1.26 0L79.42 29.6a1.13 1.13 0 0 1 1.57 0Z"
  />
</svg>`,walletPlaceholder:pe,warningCircle:n.YP`<svg fill="none" viewBox="0 0 20 20">
  <path
    fill="currentColor"
    d="M11 6.67a1 1 0 1 0-2 0v2.66a1 1 0 0 0 2 0V6.67ZM10 14.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
  />
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-7 9a7 7 0 1 1 14 0 7 7 0 0 1-14 0Z"
    clip-rule="evenodd"
  />
</svg>`};let we=class extends n.oi{constructor(){super(...arguments),this.size="md",this.name="copy",this.color="fg-300"}render(){return this.style.cssText=`\n      --local-color: var(--wui-color-${this.color});\n      --local-width: var(--wui-icon-size-${this.size});\n    `,n.dy`${ge[this.name]}`}};we.styles=[d,p,m],fe([(0,b.Cb)()],we.prototype,"size",void 0),fe([(0,b.Cb)()],we.prototype,"name",void 0),fe([(0,b.Cb)()],we.prototype,"color",void 0),we=fe([f("wui-icon")],we);const be=n.iv`
  :host {
    display: block;
    width: 100%;
    height: 100%;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: inherit;
  }
`;var me=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let ye=class extends n.oi{constructor(){super(...arguments),this.src="./path/to/image.jpg",this.alt="Image"}render(){return n.dy`<img src=${this.src} alt=${this.alt} />`}};ye.styles=[d,p,be],me([(0,b.Cb)()],ye.prototype,"src",void 0),me([(0,b.Cb)()],ye.prototype,"alt",void 0),ye=me([f("wui-image")],ye);const ve=n.iv`
  :host {
    display: block;
    width: var(--wui-box-size-lg);
    height: var(--wui-box-size-lg);
  }

  svg {
    width: var(--wui-box-size-lg);
    height: var(--wui-box-size-lg);
    fill: none;
    stroke: transparent;
    stroke-linecap: round;
    transition: all var(--wui-ease-in-power-3) var(--wui-duration-lg);
  }

  use {
    stroke: var(--wui-color-accent-100);
    stroke-width: 2px;
    stroke-dasharray: 54, 118;
    stroke-dashoffset: 172;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`;let xe=class extends n.oi{render(){return n.dy`
      <svg viewBox="0 0 54 59">
        <path
          id="wui-loader-path"
          d="M17.22 5.295c3.877-2.277 5.737-3.363 7.72-3.726a11.44 11.44 0 0 1 4.12 0c1.983.363 3.844 1.45 7.72 3.726l6.065 3.562c3.876 2.276 5.731 3.372 7.032 4.938a11.896 11.896 0 0 1 2.06 3.63c.683 1.928.688 4.11.688 8.663v7.124c0 4.553-.005 6.735-.688 8.664a11.896 11.896 0 0 1-2.06 3.63c-1.3 1.565-3.156 2.66-7.032 4.937l-6.065 3.563c-3.877 2.276-5.737 3.362-7.72 3.725a11.46 11.46 0 0 1-4.12 0c-1.983-.363-3.844-1.449-7.72-3.726l-6.065-3.562c-3.876-2.276-5.731-3.372-7.032-4.938a11.885 11.885 0 0 1-2.06-3.63c-.682-1.928-.688-4.11-.688-8.663v-7.124c0-4.553.006-6.735.688-8.664a11.885 11.885 0 0 1 2.06-3.63c1.3-1.565 3.156-2.66 7.032-4.937l6.065-3.562Z"
        />
        <use xlink:href="#wui-loader-path"></use>
      </svg>
    `}};xe.styles=[d,ve],xe=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}([f("wui-loading-hexagon")],xe);const Ce=n.iv`
  :host {
    display: flex;
  }

  :host([data-size='sm']) > svg {
    width: 12px;
    height: 12px;
  }

  :host([data-size='md']) > svg {
    width: 14px;
    height: 14px;
  }

  :host([data-size='lg']) > svg {
    width: 24px;
    height: 24px;
  }

  svg {
    animation: rotate 2s linear infinite;
    transition: all var(--wui-ease-in-power-3) var(--wui-duration-lg);
  }

  circle {
    fill: none;
    stroke: var(--local-color);
    stroke-width: 4px;
    stroke-dasharray: 1, 124;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  :host([data-size='md']) > svg > circle {
    stroke-width: 6px;
  }

  :host([data-size='sm']) > svg > circle {
    stroke-width: 8px;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 124;
      stroke-dashoffset: 0;
    }

    50% {
      stroke-dasharray: 90, 124;
      stroke-dashoffset: -35;
    }

    100% {
      stroke-dashoffset: -125;
    }
  }
`;var ke=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Ee=class extends n.oi{constructor(){super(...arguments),this.color="accent-100",this.size="lg"}render(){return this.style.cssText=`--local-color: var(--wui-color-${this.color});`,this.dataset.size=this.size,n.dy`<svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50"></circle>
    </svg>`}};Ee.styles=[d,Ce],ke([(0,b.Cb)()],Ee.prototype,"color",void 0),ke([(0,b.Cb)()],Ee.prototype,"size",void 0),Ee=ke([f("wui-loading-spinner")],Ee);const Pe=n.iv`
  :host {
    display: block;
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  svg {
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
    transition: all var(--wui-ease-in-power-3) var(--wui-duration-lg);
  }

  rect {
    fill: none;
    stroke: var(--wui-color-accent-100);
    stroke-width: 4px;
    stroke-linecap: round;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`;var $e=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Se=class extends n.oi{constructor(){super(...arguments),this.radius=36}render(){return this.svgLoaderTemplate()}svgLoaderTemplate(){const e=this.radius>50?50:this.radius,t=36-e,r=116+t,i=245+t,o=360+1.75*t;return n.dy`
      <svg viewBox="0 0 110 110" width="110" height="110">
        <rect
          x="2"
          y="2"
          width="106"
          height="106"
          rx=${e}
          stroke-dasharray="${r} ${i}"
          stroke-dashoffset=${o}
        />
      </svg>
    `}};Se.styles=[d,Pe],$e([(0,b.Cb)({type:Number})],Se.prototype,"radius",void 0),Se=$e([f("wui-loading-thumbnail")],Se);const _e=n.iv`
  :host {
    display: block;
    box-shadow: inset 0 0 0 1px var(--wui-gray-glass-005);
    background: linear-gradient(
      120deg,
      var(--wui-color-bg-200) 5%,
      var(--wui-color-bg-200) 48%,
      var(--wui-color-bg-300) 55%,
      var(--wui-color-bg-300) 60%,
      var(--wui-color-bg-300) calc(60% + 10px),
      var(--wui-color-bg-200) calc(60% + 12px),
      var(--wui-color-bg-200) 100%
    );
    background-size: 250%;
    animation: shimmer 3s linear infinite reverse;
  }

  @keyframes shimmer {
    from {
      background-position: -250% 0;
    }
    to {
      background-position: 250% 0;
    }
  }
`;var Ae=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Ie=class extends n.oi{constructor(){super(...arguments),this.width="",this.height="",this.borderRadius="m"}render(){return this.style.cssText=`\n      width: ${this.width};\n      height: ${this.height};\n      border-radius: clamp(0px,var(--wui-border-radius-${this.borderRadius}), 40px);\n    `,n.dy`<slot></slot>`}};Ie.styles=[_e],Ae([(0,b.Cb)()],Ie.prototype,"width",void 0),Ae([(0,b.Cb)()],Ie.prototype,"height",void 0),Ae([(0,b.Cb)()],Ie.prototype,"borderRadius",void 0),Ie=Ae([f("wui-shimmer")],Ie);var Oe=r(3692);const Te=e=>(...t)=>({_$litDirective$:e,values:t});class Ne{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,r){this._$Ct=e,this._$AM=t,this._$Ci=r}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const Re=Te(class extends Ne{constructor(e){if(super(e),1!==e.type||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter((t=>e[t])).join(" ")+" "}update(e,[t]){if(void 0===this.it){this.it=new Set,void 0!==e.strings&&(this.st=new Set(e.strings.join(" ").split(/\s/).filter((e=>""!==e))));for(const e in t)t[e]&&!this.st?.has(e)&&this.it.add(e);return this.render(t)}const r=e.element.classList;for(const e of this.it)e in t||(r.remove(e),this.it.delete(e));for(const e in t){const n=!!t[e];n===this.it.has(e)||this.st?.has(e)||(n?(r.add(e),this.it.add(e)):(r.remove(e),this.it.delete(e)))}return Oe.Jb}}),je=n.iv`
  :host {
    display: flex !important;
  }

  slot {
    display: inline-block;
    font-style: normal;
    font-family: var(--wui-font-family);
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'case' on;
    line-height: 130%;
    font-weight: var(--wui-font-weight-regular);
    overflow: inherit;
    text-overflow: inherit;
    text-align: var(--local-align);
    color: var(--local-color);
  }

  .wui-font-large-500,
  .wui-font-large-600,
  .wui-font-large-700 {
    font-size: var(--wui-font-size-large);
    letter-spacing: var(--wui-letter-spacing-large);
  }

  .wui-font-paragraph-500,
  .wui-font-paragraph-600,
  .wui-font-paragraph-700 {
    font-size: var(--wui-font-size-paragraph);
    letter-spacing: var(--wui-letter-spacing-paragraph);
  }

  .wui-font-small-400,
  .wui-font-small-500,
  .wui-font-small-600 {
    font-size: var(--wui-font-size-small);
    letter-spacing: var(--wui-letter-spacing-small);
  }

  .wui-font-tiny-500,
  .wui-font-tiny-600 {
    font-size: var(--wui-font-size-tiny);
    letter-spacing: var(--wui-letter-spacing-tiny);
  }

  .wui-font-micro-700,
  .wui-font-micro-600 {
    font-size: var(--wui-font-size-micro);
    letter-spacing: var(--wui-letter-spacing-micro);
    text-transform: uppercase;
  }

  .wui-font-small-400 {
    font-weight: var(--wui-font-weight-light);
  }

  .wui-font-large-700,
  .wui-font-paragraph-700,
  .wui-font-micro-700 {
    font-weight: var(--wui-font-weight-bold);
  }

  .wui-font-large-600,
  .wui-font-paragraph-600,
  .wui-font-small-600,
  .wui-font-tiny-600,
  .wui-font-micro-600 {
    font-weight: var(--wui-font-weight-medium);
  }
`;var Be=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Me=class extends n.oi{constructor(){super(...arguments),this.variant="paragraph-500",this.color="fg-300",this.align="left"}render(){const e={[`wui-font-${this.variant}`]:!0,[`wui-color-${this.color}`]:!0};return this.style.cssText=`\n      --local-align: ${this.align};\n      --local-color: var(--wui-color-${this.color});\n    `,n.dy`<slot class=${Re(e)}></slot>`}};Me.styles=[d,je],Be([(0,b.Cb)()],Me.prototype,"variant",void 0),Be([(0,b.Cb)()],Me.prototype,"color",void 0),Be([(0,b.Cb)()],Me.prototype,"align",void 0),Me=Be([f("wui-text")],Me);const Ue=n.YP`<svg fill="none" viewBox="0 0 60 60">
  <rect width="60" height="60" fill="#1DC956" rx="30" />
  <circle cx="30" cy="30" r="3" fill="#fff" />
  <path
    fill="#2BEE6C"
    stroke="#fff"
    stroke-width="2"
    d="m45.32 17.9-.88-.42.88.42.02-.05c.1-.2.21-.44.26-.7l-.82-.15.82.16a2 2 0 0 0-.24-1.4c-.13-.23-.32-.42-.47-.57a8.42 8.42 0 0 1-.04-.04l-.04-.04a2.9 2.9 0 0 0-.56-.47l-.51.86.5-.86a2 2 0 0 0-1.4-.24c-.26.05-.5.16-.69.26l-.05.02-15.05 7.25-.1.05c-1.14.55-1.85.89-2.46 1.37a7 7 0 0 0-1.13 1.14c-.5.6-.83 1.32-1.38 2.45l-.05.11-7.25 15.05-.02.05c-.1.2-.21.43-.26.69a2 2 0 0 0 .24 1.4l.85-.5-.85.5c.13.23.32.42.47.57l.04.04.04.04c.15.15.34.34.56.47a2 2 0 0 0 1.41.24l-.2-.98.2.98c.25-.05.5-.17.69-.26l.05-.02-.42-.87.42.87 15.05-7.25.1-.05c1.14-.55 1.85-.89 2.46-1.38a7 7 0 0 0 1.13-1.13 12.87 12.87 0 0 0 1.43-2.56l7.25-15.05Z"
  />
  <path
    fill="#1DC956"
    d="M33.38 32.72 30.7 29.3 15.86 44.14l.2.2a1 1 0 0 0 1.14.2l15.1-7.27a3 3 0 0 0 1.08-4.55Z"
  />
  <path
    fill="#86F999"
    d="m26.62 27.28 2.67 3.43 14.85-14.85-.2-.2a1 1 0 0 0-1.14-.2l-15.1 7.27a3 3 0 0 0-1.08 4.55Z"
  />
  <circle cx="30" cy="30" r="3" fill="#fff" transform="rotate(45 30 30)" />
  <rect width="59" height="59" x=".5" y=".5" stroke="#062B2B" stroke-opacity=".1" rx="29.5" />
</svg> `,Le=n.YP`<svg viewBox="0 0 60 60" fill="none">
  <g clip-path="url(#clip0_7734_50402)">
    <path
      d="M0 24.9C0 15.6485 0 11.0228 1.97053 7.56812C3.3015 5.23468 5.23468 3.3015 7.56812 1.97053C11.0228 0 15.6485 0 24.9 0H35.1C44.3514 0 48.9772 0 52.4319 1.97053C54.7653 3.3015 56.6985 5.23468 58.0295 7.56812C60 11.0228 60 15.6485 60 24.9V35.1C60 44.3514 60 48.9772 58.0295 52.4319C56.6985 54.7653 54.7653 56.6985 52.4319 58.0295C48.9772 60 44.3514 60 35.1 60H24.9C15.6485 60 11.0228 60 7.56812 58.0295C5.23468 56.6985 3.3015 54.7653 1.97053 52.4319C0 48.9772 0 44.3514 0 35.1V24.9Z"
      fill="#EB8B47"
    />
    <path
      d="M0.5 24.9C0.5 20.2652 0.50047 16.8221 0.744315 14.105C0.987552 11.3946 1.46987 9.45504 2.40484 7.81585C3.69145 5.56019 5.56019 3.69145 7.81585 2.40484C9.45504 1.46987 11.3946 0.987552 14.105 0.744315C16.8221 0.50047 20.2652 0.5 24.9 0.5H35.1C39.7348 0.5 43.1779 0.50047 45.895 0.744315C48.6054 0.987552 50.545 1.46987 52.1841 2.40484C54.4398 3.69145 56.3086 5.56019 57.5952 7.81585C58.5301 9.45504 59.0124 11.3946 59.2557 14.105C59.4995 16.8221 59.5 20.2652 59.5 24.9V35.1C59.5 39.7348 59.4995 43.1779 59.2557 45.895C59.0124 48.6054 58.5301 50.545 57.5952 52.1841C56.3086 54.4398 54.4398 56.3086 52.1841 57.5952C50.545 58.5301 48.6054 59.0124 45.895 59.2557C43.1779 59.4995 39.7348 59.5 35.1 59.5H24.9C20.2652 59.5 16.8221 59.4995 14.105 59.2557C11.3946 59.0124 9.45504 58.5301 7.81585 57.5952C5.56019 56.3086 3.69145 54.4398 2.40484 52.1841C1.46987 50.545 0.987552 48.6054 0.744315 45.895C0.50047 43.1779 0.5 39.7348 0.5 35.1V24.9Z"
      stroke="#062B2B"
      stroke-opacity="0.1"
    />
    <path
      d="M19 52C24.5228 52 29 47.5228 29 42C29 36.4772 24.5228 32 19 32C13.4772 32 9 36.4772 9 42C9 47.5228 13.4772 52 19 52Z"
      fill="#FF974C"
      stroke="white"
      stroke-width="2"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M42.8437 8.3264C42.4507 7.70891 41.5493 7.70891 41.1564 8.32641L28.978 27.4638C28.5544 28.1295 29.0326 29.0007 29.8217 29.0007H54.1783C54.9674 29.0007 55.4456 28.1295 55.022 27.4638L42.8437 8.3264Z"
      fill="white"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M42.3348 11.6456C42.659 11.7608 42.9061 12.1492 43.4005 12.926L50.7332 24.4488C51.2952 25.332 51.5763 25.7737 51.5254 26.1382C51.4915 26.3808 51.3698 26.6026 51.1833 26.7614C50.9031 27 50.3796 27 49.3327 27H34.6673C33.6204 27 33.0969 27 32.8167 26.7614C32.6302 26.6026 32.5085 26.3808 32.4746 26.1382C32.4237 25.7737 32.7048 25.332 33.2669 24.4488L40.5995 12.926C41.0939 12.1492 41.341 11.7608 41.6652 11.6456C41.8818 11.5687 42.1182 11.5687 42.3348 11.6456ZM35.0001 26.999C38.8661 26.999 42.0001 23.865 42.0001 19.999C42.0001 23.865 45.1341 26.999 49.0001 26.999H35.0001Z"
      fill="#FF974C"
    />
    <path
      d="M10.1061 9.35712C9.9973 9.67775 9.99867 10.0388 9.99978 10.3323C9.99989 10.3611 10 10.3893 10 10.4167V25.5833C10 25.6107 9.99989 25.6389 9.99978 25.6677C9.99867 25.9612 9.9973 26.3222 10.1061 26.6429C10.306 27.2317 10.7683 27.694 11.3571 27.8939C11.6777 28.0027 12.0388 28.0013 12.3323 28.0002C12.3611 28.0001 12.3893 28 12.4167 28H19C24.5228 28 29 23.5228 29 18C29 12.4772 24.5228 8 19 8H12.4167C12.3893 8 12.3611 7.99989 12.3323 7.99978C12.0388 7.99867 11.6778 7.9973 11.3571 8.10614C10.7683 8.306 10.306 8.76834 10.1061 9.35712Z"
      fill="#FF974C"
      stroke="white"
      stroke-width="2"
    />
    <circle cx="19" cy="18" r="4" fill="#EB8B47" stroke="white" stroke-width="2" />
    <circle cx="19" cy="42" r="4" fill="#EB8B47" stroke="white" stroke-width="2" />
  </g>
  <defs>
    <clipPath id="clip0_7734_50402">
      <rect width="60" height="60" fill="white" />
    </clipPath>
  </defs>
</svg> `,De=n.YP`<svg fill="none" viewBox="0 0 60 60">
  <g clip-path="url(#a)">
    <path
      fill="#1DC956"
      d="M0 25.01c0-9.25 0-13.88 1.97-17.33a15 15 0 0 1 5.6-5.6C11.02.11 15.65.11 24.9.11h10.2c9.25 0 13.88 0 17.33 1.97a15 15 0 0 1 5.6 5.6C60 11.13 60 15.76 60 25v10.2c0 9.25 0 13.88-1.97 17.33a15 15 0 0 1-5.6 5.6c-3.45 1.97-8.08 1.97-17.33 1.97H24.9c-9.25 0-13.88 0-17.33-1.97a15 15 0 0 1-5.6-5.6C0 49.1 0 44.46 0 35.21v-10.2Z"
    />
    <path
      fill="#2BEE6C"
      d="M16.1 60c-3.82-.18-6.4-.64-8.53-1.86a15 15 0 0 1-5.6-5.6C.55 50.06.16 46.97.04 41.98L4.2 40.6a4 4 0 0 0 2.48-2.39l4.65-12.4a2 2 0 0 1 2.5-1.2l2.53.84a2 2 0 0 0 2.43-1l2.96-5.94a2 2 0 0 1 3.7.32l3.78 12.58a2 2 0 0 0 3.03 1.09l3.34-2.23a2 2 0 0 0 .65-.7l5.3-9.72a2 2 0 0 1 1.42-1.01l4.14-.69a2 2 0 0 1 1.6.44l3.9 3.24a2 2 0 0 0 2.7-.12l4.62-4.63c.08 2.2.08 4.8.08 7.93v10.2c0 9.25 0 13.88-1.97 17.33a15 15 0 0 1-5.6 5.6c-2.13 1.22-4.7 1.68-8.54 1.86H16.11Z"
    />
    <path
      fill="#fff"
      d="m.07 43.03-.05-2.1 3.85-1.28a3 3 0 0 0 1.86-1.79l4.66-12.4a3 3 0 0 1 3.75-1.8l2.53.84a1 1 0 0 0 1.21-.5l2.97-5.94a3 3 0 0 1 5.56.48l3.77 12.58a1 1 0 0 0 1.51.55l3.34-2.23a1 1 0 0 0 .33-.35l5.3-9.71a3 3 0 0 1 2.14-1.53l4.13-.69a3 3 0 0 1 2.41.66l3.9 3.24a1 1 0 0 0 1.34-.06l5.28-5.28c.05.85.08 1.75.1 2.73L56 22.41a3 3 0 0 1-4.04.19l-3.9-3.25a1 1 0 0 0-.8-.21l-4.13.69a1 1 0 0 0-.72.5l-5.3 9.72a3 3 0 0 1-.97 1.05l-3.34 2.23a3 3 0 0 1-4.53-1.63l-3.78-12.58a1 1 0 0 0-1.85-.16l-2.97 5.94a3 3 0 0 1-3.63 1.5l-2.53-.84a1 1 0 0 0-1.25.6l-4.65 12.4a5 5 0 0 1-3.1 3L.07 43.02Z"
    />
    <path
      fill="#fff"
      fill-rule="evenodd"
      d="M49.5 19a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"
      clip-rule="evenodd"
    />
    <path fill="#fff" d="M45 .28v59.66l-2 .1V.19c.7.02 1.37.05 2 .1Z" />
    <path fill="#2BEE6C" d="M47.5 19a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" />
    <path
      stroke="#fff"
      stroke-opacity=".1"
      d="M.5 25.01c0-4.63 0-8.08.24-10.8.25-2.7.73-4.64 1.66-6.28a14.5 14.5 0 0 1 5.42-5.41C9.46 1.58 11.39 1.1 14.1.85A133 133 0 0 1 24.9.61h10.2c4.63 0 8.08 0 10.8.24 2.7.25 4.65.73 6.28 1.67a14.5 14.5 0 0 1 5.42 5.4c.93 1.65 1.41 3.58 1.66 6.3.24 2.71.24 6.16.24 10.79v10.2c0 4.64 0 8.08-.24 10.8-.25 2.7-.73 4.65-1.66 6.28a14.5 14.5 0 0 1-5.42 5.42c-1.63.93-3.57 1.41-6.28 1.66-2.72.24-6.17.24-10.8.24H24.9c-4.63 0-8.08 0-10.8-.24-2.7-.25-4.64-.73-6.28-1.66a14.5 14.5 0 0 1-5.42-5.42C1.47 50.66 1 48.72.74 46.01A133 133 0 0 1 .5 35.2v-10.2Z"
    />
  </g>
  <defs>
    <clipPath id="a"><path fill="#fff" d="M0 0h60v60H0z" /></clipPath>
  </defs>
</svg>`,ze=n.YP`<svg fill="none" viewBox="0 0 60 60">
  <g clip-path="url(#a)">
    <rect width="60" height="60" fill="#C653C6" rx="30" />
    <path
      fill="#E87DE8"
      d="M57.98.01v19.5a4.09 4.09 0 0 0-2.63 2.29L50.7 34.2a2 2 0 0 1-2.5 1.2l-2.53-.84a2 2 0 0 0-2.42 1l-2.97 5.94a2 2 0 0 1-3.7-.32L32.8 28.6a2 2 0 0 0-3.02-1.09l-3.35 2.23a2 2 0 0 0-.64.7l-5.3 9.72a2 2 0 0 1-1.43 1.01l-4.13.69a2 2 0 0 1-1.61-.44l-3.9-3.24a2 2 0 0 0-2.69.12L2.1 42.93.02 43V.01h57.96Z"
    />
    <path
      fill="#fff"
      d="m61.95 16.94.05 2.1-3.85 1.28a3 3 0 0 0-1.86 1.79l-4.65 12.4a3 3 0 0 1-3.76 1.8l-2.53-.84a1 1 0 0 0-1.2.5l-2.98 5.94a3 3 0 0 1-5.55-.48l-3.78-12.58a1 1 0 0 0-1.5-.55l-3.35 2.23a1 1 0 0 0-.32.35l-5.3 9.72a3 3 0 0 1-2.14 1.52l-4.14.69a3 3 0 0 1-2.41-.66l-3.9-3.24a1 1 0 0 0-1.34.06l-5.28 5.28c-.05-.84-.08-1.75-.1-2.73l3.97-3.96a3 3 0 0 1 4.04-.19l3.89 3.25a1 1 0 0 0 .8.21l4.14-.68a1 1 0 0 0 .71-.51l5.3-9.71a3 3 0 0 1 .97-1.06l3.34-2.23a3 3 0 0 1 4.54 1.63l3.77 12.58a1 1 0 0 0 1.86.16l2.96-5.93a3 3 0 0 1 3.64-1.5l2.52.83a1 1 0 0 0 1.25-.6l4.66-12.4a5 5 0 0 1 3.1-2.99l4.43-1.48Z"
    />
    <path
      fill="#fff"
      fill-rule="evenodd"
      d="M35.5 27a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"
      clip-rule="evenodd"
    />
    <path fill="#fff" d="M31 0v60h-2V0h2Z" />
    <path fill="#E87DE8" d="M33.5 27a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" />
  </g>
  <rect width="59" height="59" x=".5" y=".5" stroke="#fff" stroke-opacity=".1" rx="29.5" />
  <defs>
    <clipPath id="a"><rect width="60" height="60" fill="#fff" rx="30" /></clipPath>
  </defs>
</svg> `,We=n.YP`<svg fill="none" viewBox="0 0 60 60">
  <g clip-path="url(#a)">
    <rect width="60" height="60" fill="#987DE8" rx="30" />
    <path
      fill="#fff"
      fill-rule="evenodd"
      d="m15.48 28.37 11.97-19.3a3 3 0 0 1 5.1 0l11.97 19.3a6 6 0 0 1 .9 3.14v.03a6 6 0 0 1-1.16 3.56L33.23 50.2a4 4 0 0 1-6.46 0L15.73 35.1a6 6 0 0 1-1.15-3.54v-.03a6 6 0 0 1 .9-3.16Z"
      clip-rule="evenodd"
    />
    <path
      fill="#643CDD"
      d="M30.84 10.11a1 1 0 0 0-.84-.46V24.5l12.6 5.53a2 2 0 0 0-.28-1.4L30.84 10.11Z"
    />
    <path
      fill="#BDADEB"
      d="M30 9.65a1 1 0 0 0-.85.46L17.66 28.64a2 2 0 0 0-.26 1.39L30 24.5V9.65Z"
    />
    <path
      fill="#643CDD"
      d="M30 50.54a1 1 0 0 0 .8-.4l11.24-15.38c.3-.44-.2-1-.66-.73l-9.89 5.68a3 3 0 0 1-1.5.4v10.43Z"
    />
    <path
      fill="#BDADEB"
      d="m17.97 34.76 11.22 15.37c.2.28.5.41.8.41V40.11a3 3 0 0 1-1.49-.4l-9.88-5.68c-.47-.27-.97.3-.65.73Z"
    />
    <path
      fill="#401AB3"
      d="M42.6 30.03 30 24.5v13.14a3 3 0 0 0 1.5-.4l10.14-5.83a2 2 0 0 0 .95-1.38Z"
    />
    <path
      fill="#7C5AE2"
      d="M30 37.64V24.46l-12.6 5.57a2 2 0 0 0 .97 1.39l10.13 5.82a3 3 0 0 0 1.5.4Z"
    />
  </g>
  <rect width="59" height="59" x=".5" y=".5" stroke="#fff" stroke-opacity=".1" rx="29.5" />
  <defs>
    <clipPath id="a"><rect width="60" height="60" fill="#fff" rx="30" /></clipPath>
  </defs>
</svg> `,Fe=n.YP`<svg fill="none" viewBox="0 0 60 60">
  <rect width="60" height="60" fill="#1DC956" rx="3" />
  <path
    fill="#1FAD7E"
    stroke="#fff"
    stroke-width="2"
    d="m30.49 29.13-.49-.27-.49.27-12.77 7.1-.05.02c-.86.48-1.58.88-2.1 1.24-.54.37-1.04.81-1.28 1.45a3 3 0 0 0 0 2.12c.24.63.74 1.08 1.27 1.45.53.36 1.25.76 2.11 1.24l.05.03 6.33 3.51.17.1c2.33 1.3 3.72 2.06 5.22 2.32a9 9 0 0 0 3.08 0c1.5-.26 2.9-1.03 5.22-2.32l.18-.1 6.32-3.51.05-.03a26.9 26.9 0 0 0 2.1-1.24 3.21 3.21 0 0 0 1.28-1.45l-.94-.35.94.35a3 3 0 0 0 0-2.12l-.94.35.94-.35a3.21 3.21 0 0 0-1.27-1.45c-.53-.36-1.25-.76-2.11-1.24l-.05-.03-12.77-7.1Z"
  />
  <path
    fill="#2BEE6C"
    stroke="#fff"
    stroke-width="2"
    d="m30.49 19.13-.49-.27-.49.27-12.77 7.1-.05.02c-.86.48-1.58.88-2.1 1.24-.54.37-1.04.81-1.28 1.45a3 3 0 0 0 0 2.12c.24.63.74 1.08 1.27 1.45.53.36 1.25.76 2.11 1.24l.05.03 6.33 3.51.17.1c2.33 1.3 3.72 2.06 5.22 2.32a9 9 0 0 0 3.08 0c1.5-.26 2.9-1.03 5.22-2.32l.18-.1 6.32-3.51.05-.03a26.9 26.9 0 0 0 2.1-1.24 3.21 3.21 0 0 0 1.28-1.45l-.94-.35.94.35a3 3 0 0 0 0-2.12l-.94.35.94-.35a3.21 3.21 0 0 0-1.27-1.45c-.53-.36-1.25-.76-2.11-1.24l-.05-.03-12.77-7.1Z"
  />
  <path
    fill="#86F999"
    stroke="#fff"
    stroke-width="2"
    d="m46.69 21.06-.94-.35.94.35a3 3 0 0 0 0-2.12l-.94.35.94-.35a3.21 3.21 0 0 0-1.27-1.45c-.53-.36-1.25-.76-2.11-1.24l-.05-.03-6.32-3.51-.18-.1c-2.33-1.3-3.72-2.06-5.22-2.33a9 9 0 0 0-3.08 0c-1.5.27-2.9 1.04-5.22 2.33l-.17.1-6.33 3.51-.05.03c-.86.48-1.58.88-2.1 1.24-.54.37-1.04.81-1.28 1.45a3 3 0 0 0 0 2.12c.24.63.74 1.08 1.27 1.45.53.36 1.25.76 2.11 1.24l.05.03 6.33 3.51.17.1c2.33 1.3 3.72 2.06 5.22 2.32a9 9 0 0 0 3.08 0c1.5-.26 2.9-1.03 5.22-2.32l.18-.1 6.32-3.51.05-.03a26.9 26.9 0 0 0 2.1-1.24 3.21 3.21 0 0 0 1.28-1.45Z"
  />
  <rect width="59" height="59" x=".5" y=".5" stroke="#fff" stroke-opacity=".1" rx="2.5" />
</svg>`,He=n.YP`<svg fill="none" viewBox="0 0 60 60">
  <rect width="60" height="60" fill="#C653C6" rx="3" />
  <path
    fill="#fff"
    d="M20.03 15.22C20 15.6 20 16.07 20 17v2.8c0 1.14 0 1.7-.2 2.12-.15.31-.3.5-.58.71-.37.28-1.06.42-2.43.7-.59.12-1.11.29-1.6.51a9 9 0 0 0-4.35 4.36C10 30 10 32.34 10 37c0 4.66 0 7 .84 8.8a9 9 0 0 0 4.36 4.36C17 51 19.34 51 24 51h12c4.66 0 7 0 8.8-.84a9 9 0 0 0 4.36-4.36C50 44 50 41.66 50 37c0-4.66 0-7-.84-8.8a9 9 0 0 0-4.36-4.36c-.48-.22-1-.39-1.6-.5-1.36-.29-2.05-.43-2.42-.7-.27-.22-.43-.4-.58-.72-.2-.42-.2-.98-.2-2.11V17c0-.93 0-1.4-.03-1.78a9 9 0 0 0-8.19-8.19C31.4 7 30.93 7 30 7s-1.4 0-1.78.03a9 9 0 0 0-8.19 8.19Z"
  />
  <path
    fill="#E87DE8"
    d="M22 17c0-.93 0-1.4.04-1.78a7 7 0 0 1 6.18-6.18C28.6 9 29.07 9 30 9s1.4 0 1.78.04a7 7 0 0 1 6.18 6.18c.04.39.04.85.04 1.78v4.5a1.5 1.5 0 0 1-3 0V17c0-.93 0-1.4-.08-1.78a4 4 0 0 0-3.14-3.14C31.39 12 30.93 12 30 12s-1.4 0-1.78.08a4 4 0 0 0-3.14 3.14c-.08.39-.08.85-.08 1.78v4.5a1.5 1.5 0 0 1-3 0V17Z"
  />
  <path
    fill="#E87DE8"
    fill-rule="evenodd"
    d="M12 36.62c0-4.32 0-6.48.92-8.09a7 7 0 0 1 2.61-2.61C17.14 25 19.3 25 23.62 25h6.86c.46 0 .7 0 .9.02 2.73.22 4.37 2.43 4.62 4.98.27-2.7 2.11-5 5.02-5A6.98 6.98 0 0 1 48 31.98v5.4c0 4.32 0 6.48-.92 8.09a7 7 0 0 1-2.61 2.61c-1.61.92-3.77.92-8.09.92h-5.86c-.46 0-.7 0-.9-.02-2.73-.22-4.37-2.43-4.62-4.98-.26 2.58-1.94 4.82-4.71 4.99l-.7.01c-.55 0-.82 0-1.05-.02a7 7 0 0 1-6.52-6.52c-.02-.23-.02-.5-.02-1.05v-4.79Zm21.24-.27a4 4 0 1 0-6.48 0 31.28 31.28 0 0 1 1.57 2.23c.17.4.17.81.17 1.24V42.5a1.5 1.5 0 0 0 3 0V39.82c0-.43 0-.85.17-1.24.09-.2.58-.87 1.57-2.23Z"
    clip-rule="evenodd"
  />
  <rect width="59" height="59" x=".5" y=".5" stroke="#fff" stroke-opacity=".1" rx="2.5" />
</svg>`,Ge=n.YP`<svg fill="none" viewBox="0 0 60 60">
  <g clip-path="url(#a)">
    <path
      fill="#EB8B47"
      d="M0 24.9c0-9.25 0-13.88 1.97-17.33a15 15 0 0 1 5.6-5.6C11.02 0 15.65 0 24.9 0h10.2c9.25 0 13.88 0 17.33 1.97a15 15 0 0 1 5.6 5.6C60 11.02 60 15.65 60 24.9v10.2c0 9.25 0 13.88-1.97 17.33a15 15 0 0 1-5.6 5.6C48.98 60 44.35 60 35.1 60H24.9c-9.25 0-13.88 0-17.33-1.97a15 15 0 0 1-5.6-5.6C0 48.98 0 44.35 0 35.1V24.9Z"
    />
    <path
      stroke="#062B2B"
      stroke-opacity=".1"
      d="M.5 24.9c0-4.64 0-8.08.24-10.8.25-2.7.73-4.65 1.66-6.28A14.5 14.5 0 0 1 7.82 2.4C9.46 1.47 11.39 1 14.1.74A133 133 0 0 1 24.9.5h10.2c4.63 0 8.08 0 10.8.24 2.7.25 4.65.73 6.28 1.66a14.5 14.5 0 0 1 5.42 5.42c.93 1.63 1.41 3.57 1.66 6.28.24 2.72.24 6.16.24 10.8v10.2c0 4.63 0 8.08-.24 10.8-.25 2.7-.73 4.64-1.66 6.28a14.5 14.5 0 0 1-5.42 5.41c-1.63.94-3.57 1.42-6.28 1.67-2.72.24-6.17.24-10.8.24H24.9c-4.63 0-8.08 0-10.8-.24-2.7-.25-4.64-.73-6.28-1.67a14.5 14.5 0 0 1-5.42-5.4C1.47 50.53 1 48.6.74 45.88A133 133 0 0 1 .5 35.1V24.9Z"
    />
    <path
      fill="#FF974C"
      stroke="#fff"
      stroke-width="2"
      d="M39.2 29.2a13 13 0 1 0-18.4 0l1.3 1.28a12.82 12.82 0 0 1 2.1 2.39 6 6 0 0 1 .6 1.47c.2.76.2 1.56.2 3.17v11.24c0 1.08 0 1.61.13 2.12a4 4 0 0 0 .41.98c.26.45.64.83 1.4 1.6l.3.29c.65.65.98.98 1.36 1.09.26.07.54.07.8 0 .38-.11.7-.44 1.36-1.1l3.48-3.47c.65-.65.98-.98 1.09-1.36a1.5 1.5 0 0 0 0-.8c-.1-.38-.44-.7-1.1-1.36l-.47-.48c-.65-.65-.98-.98-1.09-1.36a1.5 1.5 0 0 1 0-.8c.1-.38.44-.7 1.1-1.36l.47-.48c.65-.65.98-.98 1.09-1.36a1.5 1.5 0 0 0 0-.8c-.1-.38-.44-.7-1.1-1.36l-.48-.5c-.65-.64-.98-.97-1.08-1.35a1.5 1.5 0 0 1 0-.79c.1-.38.42-.7 1.06-1.36l5.46-5.55Z"
    />
    <circle cx="30" cy="17" r="4" fill="#EB8B47" stroke="#fff" stroke-width="2" />
  </g>
  <defs>
    <clipPath id="a"><path fill="#fff" d="M0 0h60v60H0z" /></clipPath>
  </defs>
</svg> `,qe=n.YP`<svg fill="none" viewBox="0 0 60 60">
  <g clip-path="url(#a)">
    <rect width="60" height="60" fill="#00ACE6" rx="30" />
    <circle cx="64" cy="39" r="50" fill="#1AC6FF" stroke="#fff" stroke-width="2" />
    <circle cx="78" cy="30" r="50" fill="#4DD2FF" stroke="#fff" stroke-width="2" />
    <circle cx="72" cy="15" r="35" fill="#80DFFF" stroke="#fff" stroke-width="2" />
    <circle cx="34" cy="-17" r="45" stroke="#fff" stroke-width="2" />
    <circle cx="34" cy="-5" r="50" stroke="#fff" stroke-width="2" />
    <circle cx="30" cy="45" r="4" fill="#4DD2FF" stroke="#fff" stroke-width="2" />
    <circle cx="39.5" cy="27.5" r="4" fill="#80DFFF" stroke="#fff" stroke-width="2" />
    <circle cx="16" cy="24" r="4" fill="#19C6FF" stroke="#fff" stroke-width="2" />
  </g>
  <rect width="59" height="59" x=".5" y=".5" stroke="#062B2B" stroke-opacity=".1" rx="29.5" />
  <defs>
    <clipPath id="a"><rect width="60" height="60" fill="#fff" rx="30" /></clipPath>
  </defs>
</svg>`,Ze=n.YP`<svg fill="none" viewBox="0 0 60 60">
  <g clip-path="url(#a)">
    <rect width="60" height="60" fill="#C653C6" rx="3" />
    <path
      fill="#E87DE8"
      stroke="#fff"
      stroke-width="2"
      d="M52.1 47.34c0-4.24-1.44-9.55-5.9-12.4a2.86 2.86 0 0 0-1.6-3.89v-.82c0-1.19-.52-2.26-1.35-3a4.74 4.74 0 0 0-2.4-6.26v-5.5a11.31 11.31 0 1 0-22.63 0v2.15a3.34 3.34 0 0 0-1.18 5.05 4.74 4.74 0 0 0-.68 6.44A5.22 5.22 0 0 0 14 35.92c-3.06 4.13-6.1 8.3-6.1 15.64 0 2.67.37 4.86.74 6.39a20.3 20.3 0 0 0 .73 2.39l.02.04v.01l.92-.39-.92.4.26.6h38.26l.3-.49-.87-.51.86.5.02-.01.03-.07a16.32 16.32 0 0 0 .57-1.05c.36-.72.85-1.74 1.33-2.96a25.51 25.51 0 0 0 1.94-9.07Z"
    />
    <path
      fill="#fff"
      fill-rule="evenodd"
      d="M26.5 29.5c-3-.5-5.5-3-5.5-7v-7c0-.47 0-.7.03-.9a3 3 0 0 1 2.58-2.57c.2-.03.42-.03.89-.03 2 0 2.5-2.5 2.5-2.5s0 2.5 2.5 2.5c1.4 0 2.1 0 2.65.23a3 3 0 0 1 1.62 1.62c.23.55.23 1.25.23 2.65v6c0 4-3 7-6.5 7 1.35.23 4 0 6.5-2v9.53C34 38.5 31.5 40 28 40s-6-1.5-6-2.97L24 34l2.5 1.5v-6ZM26 47h4.5c2.5 0 3 4 3 5.5h-3l-1-1.5H26v-4Zm-6.25 5.5H24V57h-8c0-1 1-4.5 3.75-4.5Z"
      clip-rule="evenodd"
    />
  </g>
  <rect width="59" height="59" x=".5" y=".5" stroke="#fff" stroke-opacity=".1" rx="2.5" />
  <defs>
    <clipPath id="a"><rect width="60" height="60" fill="#fff" rx="3" /></clipPath>
  </defs>
</svg> `,Ve=n.YP`<svg fill="none" viewBox="0 0 60 60">
  <rect width="60" height="60" fill="#794CFF" rx="3" />
  <path
    fill="#987DE8"
    stroke="#fff"
    stroke-width="2"
    d="M33 22.5v-1H16v5H8.5V36H13v-5h3v7.5h17V31h1v7.5h17v-17H34v5h-1v-4Z"
  />
  <path fill="#fff" d="M37.5 25h10v10h-10z" />
  <path fill="#4019B2" d="M42.5 25h5v10h-5z" />
  <path fill="#fff" d="M19.5 25h10v10h-10z" />
  <path fill="#4019B2" d="M24.5 25h5v10h-5z" />
  <path fill="#fff" d="M12 30.5h4V37h-4v-6.5Z" />
  <rect width="59" height="59" x=".5" y=".5" stroke="#fff" stroke-opacity=".1" rx="2.5" />
</svg>`,Ye=n.YP`<svg
  viewBox="0 0 60 60"
  fill="none"
>
  <g clip-path="url(#1)">
    <rect width="60" height="60" rx="30" fill="#00ACE6" />
    <path
      d="M59 73C59 89.0163 46.0163 102 30 102C13.9837 102 1 89.0163 1 73C1 56.9837 12 44 30 44C48 44 59 56.9837 59 73Z"
      fill="#1AC6FF"
      stroke="white"
      stroke-width="2"
    />
    <path
      d="M18.6904 19.9015C19.6264 15.3286 23.3466 11.8445 27.9708 11.2096C29.3231 11.024 30.6751 11.0238 32.0289 11.2096C36.6532 11.8445 40.3733 15.3286 41.3094 19.9015C41.4868 20.7681 41.6309 21.6509 41.7492 22.5271C41.8811 23.5041 41.8811 24.4944 41.7492 25.4715C41.6309 26.3476 41.4868 27.2304 41.3094 28.097C40.3733 32.6699 36.6532 36.154 32.0289 36.7889C30.6772 36.9744 29.3216 36.9743 27.9708 36.7889C23.3466 36.154 19.6264 32.6699 18.6904 28.097C18.513 27.2304 18.3689 26.3476 18.2506 25.4715C18.1186 24.4944 18.1186 23.5041 18.2506 22.5271C18.3689 21.6509 18.513 20.7681 18.6904 19.9015Z"
      fill="#1AC6FF"
      stroke="white"
      stroke-width="2"
    />
    <circle cx="24.5" cy="23.5" r="1.5" fill="white" />
    <circle cx="35.5" cy="23.5" r="1.5" fill="white" />
    <path
      d="M31 20L28 28H32"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>
  <rect x="0.5" y="0.5" width="59" height="59" rx="29.5" stroke="white" stroke-opacity="0.1" />
  <defs>
    <clipPath id="1">
      <rect width="60" height="60" rx="30" fill="white" />
    </clipPath>
  </defs>
</svg> `,Ke=n.YP`<svg viewBox="0 0 60 60" fill="none">
  <g clip-path="url(#1)">
    <path
      d="M0 24.9C0 15.6485 0 11.0228 1.97053 7.56812C3.3015 5.23468 5.23468 3.3015 7.56812 1.97053C11.0228 0 15.6485 0 24.9 0H35.1C44.3514 0 48.9772 0 52.4319 1.97053C54.7653 3.3015 56.6985 5.23468 58.0295 7.56812C60 11.0228 60 15.6485 60 24.9V35.1C60 44.3514 60 48.9772 58.0295 52.4319C56.6985 54.7653 54.7653 56.6985 52.4319 58.0295C48.9772 60 44.3514 60 35.1 60H24.9C15.6485 60 11.0228 60 7.56812 58.0295C5.23468 56.6985 3.3015 54.7653 1.97053 52.4319C0 48.9772 0 44.3514 0 35.1V24.9Z"
      fill="#794CFF"
    />
    <path
      d="M0.5 24.9C0.5 20.2652 0.50047 16.8221 0.744315 14.105C0.987552 11.3946 1.46987 9.45504 2.40484 7.81585C3.69145 5.56019 5.56019 3.69145 7.81585 2.40484C9.45504 1.46987 11.3946 0.987552 14.105 0.744315C16.8221 0.50047 20.2652 0.5 24.9 0.5H35.1C39.7348 0.5 43.1779 0.50047 45.895 0.744315C48.6054 0.987552 50.545 1.46987 52.1841 2.40484C54.4398 3.69145 56.3086 5.56019 57.5952 7.81585C58.5301 9.45504 59.0124 11.3946 59.2557 14.105C59.4995 16.8221 59.5 20.2652 59.5 24.9V35.1C59.5 39.7348 59.4995 43.1779 59.2557 45.895C59.0124 48.6054 58.5301 50.545 57.5952 52.1841C56.3086 54.4398 54.4398 56.3086 52.1841 57.5952C50.545 58.5301 48.6054 59.0124 45.895 59.2557C43.1779 59.4995 39.7348 59.5 35.1 59.5H24.9C20.2652 59.5 16.8221 59.4995 14.105 59.2557C11.3946 59.0124 9.45504 58.5301 7.81585 57.5952C5.56019 56.3086 3.69145 54.4398 2.40484 52.1841C1.46987 50.545 0.987552 48.6054 0.744315 45.895C0.50047 43.1779 0.5 39.7348 0.5 35.1V24.9Z"
      stroke="#062B2B"
      stroke-opacity="0.1"
    />
    <path
      d="M35.1403 31.5016C35.1193 30.9637 35.388 30.4558 35.8446 30.1707C36.1207 29.9982 36.4761 29.8473 36.7921 29.7685C37.3143 29.6382 37.8664 29.7977 38.2386 30.1864C38.8507 30.8257 39.3004 31.6836 39.8033 32.408C40.2796 33.0942 41.4695 33.2512 41.9687 32.5047C42.4839 31.7341 42.9405 30.8229 43.572 30.1399C43.9375 29.7447 44.4866 29.5756 45.0111 29.6967C45.3283 29.7701 45.6863 29.9147 45.9655 30.0823C46.4269 30.3595 46.7045 30.8626 46.6928 31.4008C46.6731 32.3083 46.3764 33.2571 46.2158 34.1473C46.061 35.0048 46.9045 35.8337 47.7592 35.664C48.6464 35.4878 49.5899 35.1747 50.497 35.1391C51.0348 35.1181 51.5427 35.3868 51.8279 35.8433C52.0004 36.1195 52.1513 36.4749 52.2301 36.7908C52.3604 37.3131 52.2009 37.8651 51.8121 38.2374C51.1729 38.8495 50.3151 39.2991 49.5908 39.8019C48.9046 40.2782 48.7473 41.4683 49.4939 41.9675C50.2644 42.4827 51.1757 42.9393 51.8587 43.5708C52.2539 43.9362 52.423 44.4854 52.3018 45.0099C52.2285 45.3271 52.0839 45.6851 51.9162 45.9642C51.6391 46.4257 51.1359 46.7032 50.5978 46.6916C49.6903 46.6719 48.7417 46.3753 47.8516 46.2146C46.9939 46.0598 46.1648 46.9035 46.3346 47.7583C46.5108 48.6454 46.8239 49.5888 46.8594 50.4958C46.8805 51.0336 46.6117 51.5415 46.1552 51.8267C45.879 51.9992 45.5236 52.15 45.2077 52.2289C44.6854 52.3592 44.1334 52.1997 43.7611 51.8109C43.1491 51.1718 42.6996 50.314 42.1968 49.5897C41.7203 48.9034 40.5301 48.7463 40.0309 49.493C39.5157 50.2634 39.0592 51.1746 38.4278 51.8574C38.0623 52.2527 37.5132 52.4218 36.9887 52.3006C36.6715 52.2273 36.3135 52.0826 36.0343 51.915C35.5729 51.6379 35.2953 51.1347 35.307 50.5966C35.3267 49.6891 35.6233 48.7405 35.7839 47.8505C35.9388 46.9928 35.0951 46.1636 34.2402 46.3334C33.3531 46.5096 32.4098 46.8227 31.5028 46.8582C30.9649 46.8793 30.457 46.6105 30.1719 46.154C29.9994 45.8778 29.8485 45.5224 29.7697 45.2065C29.6394 44.6842 29.7989 44.1322 30.1877 43.7599C30.8269 43.1479 31.6847 42.6982 32.4091 42.1954C33.0954 41.7189 33.2522 40.5289 32.5056 40.0297C31.7351 39.5145 30.824 39.058 30.1411 38.4265C29.7459 38.0611 29.5768 37.5119 29.698 36.9875C29.7713 36.6702 29.9159 36.3122 30.0836 36.0331C30.3607 35.5717 30.8638 35.2941 31.402 35.3058C32.3095 35.3255 33.2583 35.6221 34.1485 35.7828C35.006 35.9376 35.8349 35.094 35.6652 34.2393C35.489 33.3521 35.1759 32.4087 35.1403 31.5016Z"
      fill="#906EF7"
      stroke="white"
      stroke-width="2"
    />
    <path
      d="M20.7706 8.22357C20.9036 7.51411 21.5231 7 22.2449 7H23.7551C24.4769 7 25.0964 7.51411 25.2294 8.22357C25.5051 9.69403 25.4829 11.6321 27.1202 12.2606C27.3092 12.3331 27.4958 12.4105 27.6798 12.4926C29.2818 13.2072 30.6374 11.8199 31.8721 10.9752C32.4678 10.5676 33.2694 10.6421 33.7798 11.1525L34.8477 12.2204C35.3581 12.7308 35.4326 13.5323 35.025 14.128C34.1802 15.3627 32.7931 16.7183 33.5077 18.3202C33.5898 18.5043 33.6672 18.6909 33.7398 18.88C34.3683 20.5171 36.3061 20.4949 37.7764 20.7706C38.4859 20.9036 39 21.5231 39 22.2449V23.7551C39 24.4769 38.4859 25.0964 37.7764 25.2294C36.3061 25.5051 34.3685 25.483 33.7401 27.1201C33.6675 27.3093 33.59 27.4961 33.5079 27.6803C32.7934 29.282 34.1803 30.6374 35.025 31.8719C35.4326 32.4677 35.3581 33.2692 34.8477 33.7796L33.7798 34.8475C33.2694 35.3579 32.4678 35.4324 31.8721 35.0248C30.6376 34.1801 29.2823 32.7934 27.6806 33.508C27.4962 33.5903 27.3093 33.6678 27.12 33.7405C25.483 34.3688 25.5051 36.3062 25.2294 37.7764C25.0964 38.4859 24.4769 39 23.7551 39H22.2449C21.5231 39 20.9036 38.4859 20.7706 37.7764C20.4949 36.3062 20.517 34.3688 18.88 33.7405C18.6908 33.6678 18.5039 33.5903 18.3196 33.5081C16.7179 32.7936 15.3625 34.1804 14.1279 35.0251C13.5322 35.4327 12.7307 35.3582 12.2203 34.8478L11.1524 33.7799C10.642 33.2695 10.5675 32.4679 10.9751 31.8722C11.8198 30.6376 13.2067 29.2822 12.4922 27.6804C12.41 27.4962 12.3325 27.3093 12.2599 27.1201C11.6315 25.483 9.69392 25.5051 8.22357 25.2294C7.51411 25.0964 7 24.4769 7 23.7551V22.2449C7 21.5231 7.51411 20.9036 8.22357 20.7706C9.69394 20.4949 11.6317 20.5171 12.2602 18.88C12.3328 18.6909 12.4103 18.5042 12.4924 18.3201C13.207 16.7181 11.8198 15.3625 10.975 14.1278C10.5674 13.5321 10.6419 12.7305 11.1523 12.2201L12.2202 11.1522C12.7306 10.6418 13.5322 10.5673 14.1279 10.9749C15.3626 11.8197 16.7184 13.2071 18.3204 12.4925C18.5044 12.4105 18.6909 12.3331 18.8799 12.2606C20.5171 11.6321 20.4949 9.69403 20.7706 8.22357Z"
      fill="#906EF7"
      stroke="white"
      stroke-width="2"
    />
    <circle cx="23" cy="23" r="6" fill="#794CFF" stroke="white" stroke-width="2" />
    <circle cx="41" cy="41" r="4" fill="#794CFF" stroke="white" stroke-width="2" />
  </g>
  <defs>
    <clipPath id="1">
      <rect width="60" height="60" fill="white" />
    </clipPath>
  </defs>
</svg> `,Xe=n.iv`
  :host {
    display: block;
    width: 55px;
    height: 55px;
  }
`;var Je=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};const Qe={browser:Ue,dao:Le,defi:De,defiAlt:ze,eth:We,layers:Fe,lock:He,login:Ge,network:qe,nft:Ze,noun:Ve,profile:Ye,system:Ke};let et=class extends n.oi{constructor(){super(...arguments),this.name="browser"}render(){return n.dy`${Qe[this.name]}`}};et.styles=[d,Xe],Je([(0,b.Cb)()],et.prototype,"name",void 0),et=Je([f("wui-visual")],et);var tt=r(796);const rt={getSpacingStyles:(e,t)=>Array.isArray(e)?e[t]?`var(--wui-spacing-${e[t]})`:void 0:"string"==typeof e?`var(--wui-spacing-${e})`:void 0,getFormattedDate:e=>new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"}).format(e),getHostName:e=>new URL(e).hostname,getTruncateString:({string:e,charsStart:t,charsEnd:r,truncate:n})=>e.length<=t+r?e:"end"===n?`${e.substring(0,t)}...`:"start"===n?`...${e.substring(e.length-r)}`:`${e.substring(0,Math.floor(t))}...${e.substring(e.length-Math.floor(r))}`,generateAvatarColors(e){const t=e.toLowerCase().replace(/^0x/iu,"").substring(0,6),r=this.hexToRgb(t),n=[];for(let e=0;e<5;e+=1){const t=this.tintColor(r,.15*e);n.push(`rgb(${t[0]}, ${t[1]}, ${t[2]})`)}return`\n    --local-color-1: ${n[0]};\n    --local-color-2: ${n[1]};\n    --local-color-3: ${n[2]};\n    --local-color-4: ${n[3]};\n    --local-color-5: ${n[4]};\n   `},hexToRgb(e){const t=parseInt(e,16);return[t>>16&255,t>>8&255,255&t]},tintColor(e,t){const[r,n,i]=e;return[Math.round(r+(255-r)*t),Math.round(n+(255-n)*t),Math.round(i+(255-i)*t)]},isNumber:e=>/^[0-9]+$/u.test(e),getColorTheme:e=>e||("undefined"!=typeof window&&window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":"dark")},nt=n.iv`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
  }
`;var it=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let ot=class extends n.oi{render(){return this.style.cssText=`\n      flex-direction: ${this.flexDirection};\n      flex-wrap: ${this.flexWrap};\n      flex-basis: ${this.flexBasis};\n      flex-grow: ${this.flexGrow};\n      flex-shrink: ${this.flexShrink};\n      align-items: ${this.alignItems};\n      justify-content: ${this.justifyContent};\n      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};\n      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};\n      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};\n      padding-top: ${this.padding&&rt.getSpacingStyles(this.padding,0)};\n      padding-right: ${this.padding&&rt.getSpacingStyles(this.padding,1)};\n      padding-bottom: ${this.padding&&rt.getSpacingStyles(this.padding,2)};\n      padding-left: ${this.padding&&rt.getSpacingStyles(this.padding,3)};\n      margin-top: ${this.margin&&rt.getSpacingStyles(this.margin,0)};\n      margin-right: ${this.margin&&rt.getSpacingStyles(this.margin,1)};\n      margin-bottom: ${this.margin&&rt.getSpacingStyles(this.margin,2)};\n      margin-left: ${this.margin&&rt.getSpacingStyles(this.margin,3)};\n    `,n.dy`<slot></slot>`}};ot.styles=[d,nt],it([(0,b.Cb)()],ot.prototype,"flexDirection",void 0),it([(0,b.Cb)()],ot.prototype,"flexWrap",void 0),it([(0,b.Cb)()],ot.prototype,"flexBasis",void 0),it([(0,b.Cb)()],ot.prototype,"flexGrow",void 0),it([(0,b.Cb)()],ot.prototype,"flexShrink",void 0),it([(0,b.Cb)()],ot.prototype,"alignItems",void 0),it([(0,b.Cb)()],ot.prototype,"justifyContent",void 0),it([(0,b.Cb)()],ot.prototype,"columnGap",void 0),it([(0,b.Cb)()],ot.prototype,"rowGap",void 0),it([(0,b.Cb)()],ot.prototype,"gap",void 0),it([(0,b.Cb)()],ot.prototype,"padding",void 0),it([(0,b.Cb)()],ot.prototype,"margin",void 0),ot=it([f("wui-flex")],ot);const at=n.iv`
  :host {
    display: block;
    width: 64px;
    height: 64px;
    border-radius: var(--wui-border-radius-3xl);
    box-shadow: 0 0 0 8px var(--wui-gray-glass-005);
    overflow: hidden;
    position: relative;
  }

  :host([data-variant='generated']) {
    --mixed-local-color-1: var(--local-color-1);
    --mixed-local-color-2: var(--local-color-2);
    --mixed-local-color-3: var(--local-color-3);
    --mixed-local-color-4: var(--local-color-4);
    --mixed-local-color-5: var(--local-color-5);
  }

  @supports (background: color-mix(in srgb, white 50%, black)) {
    :host([data-variant='generated']) {
      --mixed-local-color-1: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-1)
      );
      --mixed-local-color-2: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-2)
      );
      --mixed-local-color-3: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-3)
      );
      --mixed-local-color-4: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-4)
      );
      --mixed-local-color-5: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-5)
      );
    }
  }

  :host([data-variant='generated']) {
    box-shadow: 0 0 0 8px var(--wui-gray-glass-005);
    background: radial-gradient(
      75.29% 75.29% at 64.96% 24.36%,
      #fff 0.52%,
      var(--mixed-local-color-5) 31.25%,
      var(--mixed-local-color-3) 51.56%,
      var(--mixed-local-color-2) 65.63%,
      var(--mixed-local-color-1) 82.29%,
      var(--mixed-local-color-4) 100%
    );
  }

  :host([data-variant='default']) {
    box-shadow: 0 0 0 8px var(--wui-gray-glass-005);
    background: radial-gradient(
      75.29% 75.29% at 64.96% 24.36%,
      #fff 0.52%,
      #f5ccfc 31.25%,
      #dba4f5 51.56%,
      #9a8ee8 65.63%,
      #6493da 82.29%,
      #6ebdea 100%
    );
  }
`;var st=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let ct=class extends n.oi{constructor(){super(...arguments),this.imageSrc=void 0,this.alt=void 0,this.address=void 0}render(){return n.dy`${this.visualTemplate()}`}visualTemplate(){if(this.imageSrc)return this.dataset.variant="image",n.dy`<wui-image src=${this.imageSrc} alt=${this.alt??"avatar"}></wui-image>`;if(this.address){this.dataset.variant="generated";const e=rt.generateAvatarColors(this.address);return this.style.cssText=e,null}return this.dataset.variant="default",null}};ct.styles=[d,at],st([(0,b.Cb)()],ct.prototype,"imageSrc",void 0),st([(0,b.Cb)()],ct.prototype,"alt",void 0),st([(0,b.Cb)()],ct.prototype,"address",void 0),ct=st([f("wui-avatar")],ct);const lt=n.iv`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    background-color: var(--wui-gray-glass-020);
    border-radius: var(--local-border-radius);
    box-shadow: 0 0 0 1px var(--local-border);
    width: var(--local-size);
    height: var(--local-size);
    min-height: var(--local-size);
    min-width: var(--local-size);
  }

  @supports (background: color-mix(in srgb, white 50%, black)) {
    :host {
      background-color: color-mix(in srgb, var(--local-bg-value) var(--local-bg-mix), transparent);
    }
  }
`;var ut=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let dt=class extends n.oi{constructor(){super(...arguments),this.size="md",this.backgroundColor="accent-100",this.iconColor="accent-100",this.background="transparent",this.border=!1,this.borderColor="wui-color-bg-125",this.icon="copy"}render(){const e=this.iconSize||this.size,t="lg"===this.size,r=t?"12%":"16%",i=t?"xxs":"3xl",o="gray"===this.background,a="opaque"===this.background,s="accent-100"===this.backgroundColor&&a||"success-100"===this.backgroundColor&&a||"error-100"===this.backgroundColor&&a||"inverse-100"===this.backgroundColor&&a;let c=`var(--wui-color-${this.backgroundColor})`;return s?c=`var(--wui-icon-box-bg-${this.backgroundColor})`:o&&(c=`var(--wui-gray-${this.backgroundColor})`),this.style.cssText=`\n       --local-bg-value: ${c};\n       --local-bg-mix: ${s||o?"100%":r};\n       --local-border-radius: var(--wui-border-radius-${i});\n       --local-size: var(--wui-icon-box-size-${this.size});\n       --local-border: ${"wui-color-bg-125"===this.borderColor?"2px":"1px"} solid ${this.border?`var(--${this.borderColor})`:"transparent"}\n   `,n.dy` <wui-icon color=${this.iconColor} size=${e} name=${this.icon}></wui-icon> `}};dt.styles=[d,h,lt],ut([(0,b.Cb)()],dt.prototype,"size",void 0),ut([(0,b.Cb)()],dt.prototype,"backgroundColor",void 0),ut([(0,b.Cb)()],dt.prototype,"iconColor",void 0),ut([(0,b.Cb)()],dt.prototype,"iconSize",void 0),ut([(0,b.Cb)()],dt.prototype,"background",void 0),ut([(0,b.Cb)({type:Boolean})],dt.prototype,"border",void 0),ut([(0,b.Cb)()],dt.prototype,"borderColor",void 0),ut([(0,b.Cb)()],dt.prototype,"icon",void 0),dt=ut([f("wui-icon-box")],dt);const ht=n.iv`
  :host {
    display: block;
  }

  button {
    border-radius: var(--wui-border-radius-3xl);
    background: var(--wui-gray-glass-002);
    display: flex;
    gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-3xs) var(--wui-spacing-xs) var(--wui-spacing-3xs)
      var(--wui-spacing-xs);
    border: 1px solid var(--wui-gray-glass-005);
  }

  button:disabled {
    background: var(--wui-gray-glass-015);
  }

  button:disabled > wui-text {
    color: var(--wui-gray-glass-015);
  }

  button:disabled > wui-flex > wui-text {
    color: var(--wui-gray-glass-015);
  }

  button:disabled > wui-image,
  button:disabled > wui-icon-box,
  button:disabled > wui-flex > wui-avatar {
    filter: grayscale(1);
  }

  button:has(wui-image) {
    padding: var(--wui-spacing-3xs) var(--wui-spacing-3xs) var(--wui-spacing-3xs)
      var(--wui-spacing-xs);
  }

  wui-text {
    color: var(--wui-color-fg-100);
  }

  wui-flex > wui-text {
    color: var(--wui-color-fg-200);
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-lg);
  }

  wui-image,
  wui-icon-box {
    border-radius: var(--wui-border-radius-3xl);
    width: 24px;
    height: 24px;
    box-shadow: 0 0 0 2px var(--wui-gray-glass-005);
  }

  wui-flex {
    border-radius: var(--wui-border-radius-3xl);
    border: 1px solid var(--wui-gray-glass-005);
    background: var(--wui-gray-glass-005);
    padding: 4px var(--wui-spacing-m) 4px var(--wui-spacing-xxs);
  }

  wui-flex.local-no-balance {
    border-radius: 0px;
    border: none;
    background: transparent;
  }

  wui-avatar {
    width: 20px;
    height: 20px;
    box-shadow: 0 0 0 2px var(--wui-accent-glass-010);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled > wui-flex > wui-text {
      color: var(--wui-color-fg-175);
    }

    button:active:enabled > wui-flex > wui-text {
      color: var(--wui-color-fg-175);
    }
  }
`;var pt=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let ft=class extends n.oi{constructor(){super(...arguments),this.networkSrc=void 0,this.avatarSrc=void 0,this.balance=void 0,this.disabled=!1,this.isProfileName=!1,this.address=""}render(){return n.dy`
      <button ?disabled=${this.disabled}>
        ${this.balanceTemplate()}
        <wui-flex
          gap="xxs"
          alignItems="center"
          class=${(0,tt.o)(this.balance?void 0:"local-no-balance")}
        >
          <wui-avatar
            .imageSrc=${this.avatarSrc}
            alt=${this.address}
            address=${this.address}
          ></wui-avatar>
          <wui-text variant="paragraph-600" color="inherit">
            ${rt.getTruncateString({string:this.address,charsStart:this.isProfileName?18:4,charsEnd:this.isProfileName?0:6,truncate:this.isProfileName?"end":"middle"})}
          </wui-text>
        </wui-flex>
      </button>
    `}balanceTemplate(){if(this.balance){const e=this.networkSrc?n.dy`<wui-image src=${this.networkSrc}></wui-image>`:n.dy`
            <wui-icon-box
              size="sm"
              iconColor="fg-200"
              backgroundColor="fg-300"
              icon="networkPlaceholder"
            ></wui-icon-box>
          `;return n.dy`
        ${e}
        <wui-text variant="paragraph-600" color="inherit"> ${this.balance} </wui-text>
      `}return null}};ft.styles=[d,h,ht],pt([(0,b.Cb)()],ft.prototype,"networkSrc",void 0),pt([(0,b.Cb)()],ft.prototype,"avatarSrc",void 0),pt([(0,b.Cb)()],ft.prototype,"balance",void 0),pt([(0,b.Cb)({type:Boolean})],ft.prototype,"disabled",void 0),pt([(0,b.Cb)({type:Boolean})],ft.prototype,"isProfileName",void 0),pt([(0,b.Cb)()],ft.prototype,"address",void 0),ft=pt([f("wui-account-button")],ft);const gt=n.iv`
  :host {
    position: relative;
    border-radius: inherit;
    overflow: hidden;
    background-color: var(--wui-gray-glass-002);
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--local-size);
    height: var(--local-size);
    border-radius: var(--local-border-radius);
  }

  :host::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-gray-glass-010);
    pointer-events: none;
  }

  :host([name='Extension'])::after {
    border: 1px solid var(--wui-accent-glass-010);
  }

  :host([data-wallet-icon='allWallets']) {
    background-color: var(--wui-all-wallets-bg-100);
  }

  :host([data-wallet-icon='allWallets'])::after {
    border: 1px solid var(--wui-accent-glass-010);
  }

  wui-icon[data-parent-size='inherit'] {
    width: 75%;
    height: 75%;
    align-items: center;
  }

  wui-icon[data-parent-size='sm'] {
    width: 18px;
    height: 18px;
  }

  wui-icon[data-parent-size='md'] {
    width: 24px;
    height: 24px;
  }

  wui-icon[data-parent-size='lg'] {
    width: 42px;
    height: 42px;
  }

  wui-icon[data-parent-size='full'] {
    width: 100%;
    height: 100%;
  }
`;var wt=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let bt=class extends n.oi{constructor(){super(...arguments),this.size="md",this.name=""}render(){let e="xxs";return e="lg"===this.size?"m":"md"===this.size?"xs":"xxs",this.style.cssText=`\n       --local-border-radius: var(--wui-border-radius-${e});\n       --local-size: var(--wui-wallet-image-size-${this.size});\n   `,this.walletIcon&&(this.dataset.walletIcon=this.walletIcon),n.dy` ${this.templateVisual()}`}templateVisual(){return this.imageSrc?n.dy`<wui-image src=${this.imageSrc} alt=${this.name}></wui-image>`:this.walletIcon?n.dy`<wui-icon
        data-parent-size="md"
        size="md"
        color="inherit"
        name=${this.walletIcon}
      ></wui-icon>`:n.dy`<wui-icon
      data-parent-size=${this.size}
      size="inherit"
      color="inherit"
      name="walletPlaceholder"
    ></wui-icon>`}};bt.styles=[d,gt],wt([(0,b.Cb)()],bt.prototype,"size",void 0),wt([(0,b.Cb)()],bt.prototype,"name",void 0),wt([(0,b.Cb)()],bt.prototype,"imageSrc",void 0),wt([(0,b.Cb)()],bt.prototype,"walletIcon",void 0),bt=wt([f("wui-wallet-image")],bt);const mt=n.iv`
  :host {
    position: relative;
    border-radius: var(--wui-border-radius-xxs);
    width: 40px;
    height: 40px;
    overflow: hidden;
    background: var(--wui-gray-glass-002);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--wui-spacing-4xs);
    padding: 3.75px !important;
  }

  :host::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-gray-glass-010);
    pointer-events: none;
  }

  :host > wui-wallet-image {
    width: 14px;
    height: 14px;
    border-radius: var(--wui-border-radius-5xs);
  }
`;var yt=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let vt=class extends n.oi{constructor(){super(...arguments),this.walletImages=[]}render(){const e=this.walletImages.length<4;return n.dy`${this.walletImages.slice(0,4).map((({src:e,walletName:t})=>n.dy`
          <wui-wallet-image
            size="inherit"
            imageSrc=${e}
            name=${(0,tt.o)(t)}
          ></wui-wallet-image>
        `))}
    ${e?[...Array(4-this.walletImages.length)].map((()=>n.dy` <wui-wallet-image size="inherit" name=""></wui-wallet-image>`)):null}`}};vt.styles=[d,mt],yt([(0,b.Cb)({type:Array})],vt.prototype,"walletImages",void 0),vt=yt([f("wui-all-wallets-image")],vt);const xt=n.iv`
  :host {
    width: var(--local-width);
    position: relative;
  }

  button {
    border: 1px solid var(--wui-gray-glass-010);
    border-radius: var(--wui-border-radius-m);
    width: var(--local-width);
  }

  button:disabled {
    border: 1px solid var(--wui-gray-glass-010);
  }

  button[data-size='sm'] {
    padding: 6px 12px;
  }

  ::slotted(*) {
    transition: opacity 200ms ease-in-out;
    opacity: var(--local-opacity-100);
  }

  button > wui-text {
    transition: opacity 200ms ease-in-out;
    opacity: var(--local-opacity-100);
  }

  button[data-size='md'] {
    padding: 9px var(--wui-spacing-l) 9px var(--wui-spacing-l);
  }

  wui-loading-spinner {
    position: absolute;
    left: 50%;
    top: 50%;
    transition: all 200ms ease-in-out;
    transform: translate(-50%, -50%);
    opacity: var(--local-opacity-000);
  }
`;var Ct=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let kt=class extends n.oi{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.fullWidth=!1,this.loading=!1,this.variant="fill"}render(){this.style.cssText=`\n    --local-width: ${this.fullWidth?"100%":"auto"};\n    --local-opacity-100: ${this.loading?0:1};\n    --local-opacity-000: ${this.loading?1:0};`;const e="md"===this.size?"paragraph-600":"small-600";return n.dy`
      <button
        data-variant=${this.variant}
        data-size=${this.size}
        ?disabled=${this.disabled||this.loading}
        ontouchstart
      >
        ${this.loadingTemplate()}
        <slot name="iconLeft"></slot>
        <wui-text variant=${e} color="inherit">
          <slot></slot>
        </wui-text>
        <slot name="iconRight"></slot>
      </button>
    `}loadingTemplate(){return this.loading?n.dy`<wui-loading-spinner color="fg-300"></wui-loading-spinner>`:n.dy``}};kt.styles=[d,h,xt],Ct([(0,b.Cb)()],kt.prototype,"size",void 0),Ct([(0,b.Cb)({type:Boolean})],kt.prototype,"disabled",void 0),Ct([(0,b.Cb)({type:Boolean})],kt.prototype,"fullWidth",void 0),Ct([(0,b.Cb)({type:Boolean})],kt.prototype,"loading",void 0),Ct([(0,b.Cb)()],kt.prototype,"variant",void 0),kt=Ct([f("wui-button")],kt);const Et=n.YP`<svg  viewBox="0 0 48 54" fill="none">
  <path
    d="M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z"
  />
</svg>`,Pt=n.iv`
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 76px;
    row-gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-xs) 10px;
    background-color: var(--wui-gray-glass-002);
    border-radius: clamp(0px, var(--wui-border-radius-xs), 20px);
    position: relative;
  }

  wui-shimmer[data-type='network'] {
    border: none;
    -webkit-clip-path: var(--wui-path-network);
    clip-path: var(--wui-path-network);
  }

  svg {
    position: absolute;
    width: 48px;
    height: 54px;
    z-index: 1;
  }

  svg > path {
    stroke: var(--wui-gray-glass-010);
    stroke-width: 1px;
  }
`;var $t=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let St=class extends n.oi{constructor(){super(...arguments),this.type="wallet"}render(){return n.dy`
      ${this.shimmerTemplate()}
      <wui-shimmer width="56px" height="20px" borderRadius="xs"></wui-shimmer>
    `}shimmerTemplate(){return"network"===this.type?n.dy` <wui-shimmer
          data-type=${this.type}
          width="48px"
          height="54px"
          borderRadius="xs"
        ></wui-shimmer>
        ${Et}`:n.dy`<wui-shimmer width="56px" height="56px" borderRadius="xs"></wui-shimmer>`}};St.styles=[d,h,Pt],$t([(0,b.Cb)()],St.prototype,"type",void 0),St=$t([f("wui-card-select-loader")],St);const _t=n.YP`<svg width="86" height="96" fill="none">
  <path
    d="M78.3244 18.926L50.1808 2.45078C45.7376 -0.150261 40.2624 -0.150262 35.8192 2.45078L7.6756 18.926C3.23322 21.5266 0.5 26.3301 0.5 31.5248V64.4752C0.5 69.6699 3.23322 74.4734 7.6756 77.074L35.8192 93.5492C40.2624 96.1503 45.7376 96.1503 50.1808 93.5492L78.3244 77.074C82.7668 74.4734 85.5 69.6699 85.5 64.4752V31.5248C85.5 26.3301 82.7668 21.5266 78.3244 18.926Z"
  />
</svg>`,At=n.iv`
  :host {
    position: relative;
    border-radius: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--local-width);
    height: var(--local-height);
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    fill: var(--wui-gray-glass-002);
  }

  svg > path {
    stroke: var(--local-stroke);
    transition: stroke var(--wui-ease-out-power-1) var(--wui-duration-lg);
  }

  wui-image {
    width: 100%;
    height: 100%;
    -webkit-clip-path: var(--local-path);
    clip-path: var(--local-path);
    background: var(--wui-gray-glass-002);
  }

  wui-icon {
    transform: translateY(-5%);
    width: var(--local-icon-size);
    height: var(--local-icon-size);
  }
`;var It=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Ot=class extends n.oi{constructor(){super(...arguments),this.size="md",this.name="uknown",this.selected=!1}render(){const e="lg"===this.size;return this.style.cssText=`\n      --local-stroke: ${this.selected?"var(--wui-color-accent-100)":"var(--wui-gray-glass-010)"};\n      --local-path: ${e?"var(--wui-path-network-lg)":"var(--wui-path-network)"};\n      --local-width: ${e?"86px":"48px"};\n      --local-height: ${e?"96px":"54px"};\n      --local-icon-size: ${e?"42px":"24px"};\n    `,n.dy`${this.templateVisual()} ${e?_t:Et}`}templateVisual(){return this.imageSrc?n.dy`<wui-image src=${this.imageSrc} alt=${this.name}></wui-image>`:n.dy`<wui-icon size="inherit" color="fg-200" name="networkPlaceholder"></wui-icon>`}};Ot.styles=[d,At],It([(0,b.Cb)()],Ot.prototype,"size",void 0),It([(0,b.Cb)()],Ot.prototype,"name",void 0),It([(0,b.Cb)()],Ot.prototype,"imageSrc",void 0),It([(0,b.Cb)({type:Boolean})],Ot.prototype,"selected",void 0),Ot=It([f("wui-network-image")],Ot);const Tt=n.iv`
  button {
    flex-direction: column;
    width: 76px;
    row-gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-xs) var(--wui-spacing-0);
    background-color: var(--wui-gray-glass-002);
    border-radius: clamp(0px, var(--wui-border-radius-xs), 20px);
  }

  button > wui-text {
    color: var(--wui-color-fg-100);
    max-width: 64px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
  }

  button:disabled > wui-text {
    color: var(--wui-gray-glass-015);
  }

  [data-selected='true'] {
    background-color: var(--wui-accent-glass-020);
  }

  @media (hover: hover) and (pointer: fine) {
    [data-selected='true']:hover:enabled {
      background-color: var(--wui-accent-glass-015);
    }
  }

  [data-selected='true']:active:enabled {
    background-color: var(--wui-accent-glass-010);
  }
`;var Nt=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Rt=class extends n.oi{constructor(){super(...arguments),this.name="Unknown",this.type="wallet",this.imageSrc=void 0,this.disabled=!1,this.selected=!1}render(){return n.dy`
      <button data-selected=${(0,tt.o)(this.selected)} ?disabled=${this.disabled} ontouchstart>
        ${this.imageTemplate()}
        <wui-text variant="tiny-500" color=${this.selected?"accent-100":"inherit"}>
          ${this.name}
        </wui-text>
      </button>
    `}imageTemplate(){return"network"===this.type?n.dy`
        <wui-network-image
          .selected=${this.selected}
          imageSrc=${(0,tt.o)(this.imageSrc)}
          name=${this.name}
        >
        </wui-network-image>
      `:n.dy`
      <wui-wallet-image size="md" imageSrc=${(0,tt.o)(this.imageSrc)} name=${this.name}>
      </wui-wallet-image>
    `}};Rt.styles=[d,h,Tt],Nt([(0,b.Cb)()],Rt.prototype,"name",void 0),Nt([(0,b.Cb)()],Rt.prototype,"type",void 0),Nt([(0,b.Cb)()],Rt.prototype,"imageSrc",void 0),Nt([(0,b.Cb)({type:Boolean})],Rt.prototype,"disabled",void 0),Nt([(0,b.Cb)({type:Boolean})],Rt.prototype,"selected",void 0),Rt=Nt([f("wui-card-select")],Rt);const jt=n.iv`
  a {
    border: 1px solid var(--wui-gray-glass-010);
    border-radius: var(--wui-border-radius-3xl);
  }

  wui-image {
    border-radius: var(--wui-border-radius-3xl);
    overflow: hidden;
  }

  a.disabled > wui-icon,
  a.disabled > wui-image {
    filter: grayscale(1);
  }

  a[data-variant='fill'] {
    color: var(--wui-color-inverse-100);
    background-color: var(--wui-color-accent-100);
  }

  a[data-variant='shade'] {
    background-color: transparent;
    background-color: var(--wui-gray-glass-010);
    color: var(--wui-color-fg-200);
  }

  a[data-variant='transparent'] {
    column-gap: var(--wui-spacing-xxs);
    background-color: transparent;
    padding: 7px var(--wui-spacing-s) 7px 10px;
    color: var(--wui-color-fg-150);
  }

  a[data-variant='transparent']:has(wui-text:first-child) {
    padding: 7px var(--wui-spacing-s);
  }

  a[data-variant='fill'],
  a[data-variant='shade'] {
    column-gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-xxs) var(--wui-spacing-m) var(--wui-spacing-xxs)
      var(--wui-spacing-xs);
  }

  a[data-variant='fill']:has(wui-text:first-child),
  a[data-variant='shade']:has(wui-text:first-child) {
    padding: 8.5px var(--wui-spacing-m) 9.5px var(--wui-spacing-m);
  }

  a[data-variant='fill'] > wui-image,
  a[data-variant='shade'] > wui-image {
    width: 24px;
    height: 24px;
  }

  a[data-variant='fill'] > wui-image {
    border: 1px solid var(--wui-color-accent-090);
  }

  a[data-variant='shade'] > wui-image {
    border: 1px solid var(--wui-gray-glass-010);
  }

  a[data-variant='fill'] > wui-icon,
  a[data-variant='shade'] > wui-icon {
    width: 14px;
    height: 14px;
  }

  a[data-variant='transparent'] > wui-image {
    width: 14px;
    height: 14px;
  }

  a[data-variant='transparent'] > wui-icon {
    width: 12px;
    height: 12px;
  }

  a[data-variant='fill']:focus-visible {
    background-color: var(--wui-color-accent-090);
  }

  a[data-variant='shade']:focus-visible {
    background-color: var(--wui-gray-glass-015);
  }

  a[data-variant='transparent']:focus-visible {
    background-color: var(--wui-gray-glass-005);
  }

  a.disabled {
    color: var(--wui-gray-glass-015);
    background-color: var(--wui-gray-glass-015);
    pointer-events: none;
  }

  @media (hover: hover) and (pointer: fine) {
    a[data-variant='fill']:hover {
      background-color: var(--wui-color-accent-090);
    }

    a[data-variant='shade']:hover {
      background-color: var(--wui-gray-glass-015);
    }

    a[data-variant='transparent']:hover {
      background-color: var(--wui-gray-glass-005);
    }
  }

  a[data-variant='fill']:active {
    background-color: var(--wui-color-accent-080);
  }

  a[data-variant='shade']:active {
    background-color: var(--wui-gray-glass-020);
  }

  a[data-variant='transparent']:active {
    background-color: var(--wui-gray-glass-010);
  }
`;var Bt=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Mt=class extends n.oi{constructor(){super(...arguments),this.variant="fill",this.imageSrc=void 0,this.disabled=!1,this.icon="externalLink",this.href=""}render(){const e="transparent"===this.variant?"small-600":"paragraph-600";return n.dy`
      <a
        rel="noreferrer"
        target="_blank"
        href=${this.href}
        class=${this.disabled?"disabled":""}
        data-variant=${this.variant}
      >
        ${this.imageTemplate()}
        <wui-text variant=${e} color="inherit">
          ${rt.getHostName(this.href)}
        </wui-text>
        <wui-icon name=${this.icon} color="inherit" size="inherit"></wui-icon>
      </a>
    `}imageTemplate(){return this.imageSrc?n.dy`<wui-image src=${this.imageSrc}></wui-image>`:null}};Mt.styles=[d,h,jt],Bt([(0,b.Cb)()],Mt.prototype,"variant",void 0),Bt([(0,b.Cb)()],Mt.prototype,"imageSrc",void 0),Bt([(0,b.Cb)({type:Boolean})],Mt.prototype,"disabled",void 0),Bt([(0,b.Cb)()],Mt.prototype,"icon",void 0),Bt([(0,b.Cb)()],Mt.prototype,"href",void 0),Mt=Bt([f("wui-chip")],Mt);const Ut=n.iv`
  :host {
    position: relative;
    display: block;
  }

  button {
    background: var(--wui-color-accent-100);
    border: 1px solid var(--wui-gray-glass-010);
    border-radius: var(--wui-border-radius-m);
    gap: var(--wui-spacing-xs);
  }

  button.loading {
    background: var(--wui-gray-glass-010);
    border: 1px solid var(--wui-gray-glass-010);
    pointer-events: none;
  }

  button:disabled {
    background-color: var(--wui-gray-glass-015);
    border: 1px solid var(--wui-gray-glass-010);
  }

  button:disabled > wui-text {
    color: var(--wui-gray-glass-015);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-accent-090);
    }

    button:active:enabled {
      background-color: var(--wui-color-accent-080);
    }
  }

  button:focus-visible {
    border: 1px solid var(--wui-gray-glass-010);
    background-color: var(--wui-color-accent-090);
    -webkit-box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
    -moz-box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
    box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
  }

  button[data-size='sm'] {
    padding: 6.75px 10px 7.25px;
  }

  ::slotted(*) {
    transition: opacity 200ms ease-in-out;
    opacity: var(--local-opacity-100);
  }

  button > wui-text {
    transition: opacity 200ms ease-in-out;
    opacity: var(--local-opacity-100);
    color: var(--wui-color-inverse-100);
  }

  button[data-size='md'] {
    padding: 9px var(--wui-spacing-l) 9px var(--wui-spacing-l);
  }

  button[data-size='md'] + wui-text {
    padding-left: var(--wui-spacing-3xs);
  }

  wui-loading-spinner {
    width: 14px;
    height: 14px;
  }

  wui-loading-spinner::slotted(svg) {
    width: 10px !important;
    height: 10px !important;
  }

  button[data-size='sm'] > wui-loading-spinner {
    width: 12px;
    height: 12px;
  }
`;var Lt=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Dt=class extends n.oi{constructor(){super(...arguments),this.size="md",this.loading=!1}render(){const e="md"===this.size?"paragraph-600":"small-600";return n.dy`
      <button data-size=${this.size} ?disabled=${this.loading} ontouchstart>
        ${this.loadingTemplate()}
        <wui-text variant=${e} color=${this.loading?"accent-100":"inherit"}>
          <slot></slot>
        </wui-text>
      </button>
    `}loadingTemplate(){return this.loading?n.dy`<wui-loading-spinner size=${this.size} color="accent-100"></wui-loading-spinner>`:null}};Dt.styles=[d,h,Ut],Lt([(0,b.Cb)()],Dt.prototype,"size",void 0),Lt([(0,b.Cb)({type:Boolean})],Dt.prototype,"loading",void 0),Dt=Lt([f("wui-connect-button")],Dt);const zt=n.iv`
  wui-flex {
    width: 100%;
    background-color: var(--wui-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }
`;var Wt=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Ft=class extends n.oi{constructor(){super(...arguments),this.disabled=!1,this.label="",this.buttonLabel=""}render(){return n.dy`
      <wui-flex
        justifyContent="space-between"
        alignItems="center"
        .padding=${["1xs","2l","1xs","2l"]}
      >
        <wui-text variant="paragraph-500" colo="fg-200">${this.label}</wui-text>
        <wui-button size="sm" variant="accent">
          ${this.buttonLabel}
          <wui-icon size="sm" color="inherit" slot="iconRight" name="chevronRight"></wui-icon>
        </wui-button>
      </wui-flex>
    `}};Ft.styles=[d,h,zt],Wt([(0,b.Cb)({type:Boolean})],Ft.prototype,"disabled",void 0),Wt([(0,b.Cb)()],Ft.prototype,"label",void 0),Wt([(0,b.Cb)()],Ft.prototype,"buttonLabel",void 0),Ft=Wt([f("wui-cta-button")],Ft);const{D:Ht}=Oe._$LH,Gt=(e,t)=>{const r=e._$AN;if(void 0===r)return!1;for(const e of r)e._$AO?.(t,!1),Gt(e,t);return!0},qt=e=>{let t,r;do{if(void 0===(t=e._$AM))break;r=t._$AN,r.delete(e),e=t}while(0===r?.size)},Zt=e=>{for(let t;t=e._$AM;e=t){let r=t._$AN;if(void 0===r)t._$AN=r=new Set;else if(r.has(e))break;r.add(e),Kt(t)}};function Vt(e){void 0!==this._$AN?(qt(this),this._$AM=e,Zt(this)):this._$AM=e}function Yt(e,t=!1,r=0){const n=this._$AH,i=this._$AN;if(void 0!==i&&0!==i.size)if(t)if(Array.isArray(n))for(let e=r;e<n.length;e++)Gt(n[e],!1),qt(n[e]);else null!=n&&(Gt(n,!1),qt(n));else Gt(this,e)}const Kt=e=>{2==e.type&&(e._$AP??=Yt,e._$AQ??=Vt)};class Xt extends Ne{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,r){super._$AT(e,t,r),Zt(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(Gt(this,e),qt(this))}setValue(e){if((e=>void 0===this._$Ct.strings)())this._$Ct._$AI(e,this);else{const t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}const Jt=()=>new Qt;class Qt{}const er=new WeakMap,tr=Te(class extends Xt{render(e){return Oe.Ld}update(e,[t]){const r=t!==this.G;return r&&void 0!==this.G&&this.ot(void 0),(r||this.rt!==this.lt)&&(this.G=t,this.ct=e.options?.host,this.ot(this.lt=e.element)),Oe.Ld}ot(e){if("function"==typeof this.G){const t=this.ct??globalThis;let r=er.get(t);void 0===r&&(r=new WeakMap,er.set(t,r)),void 0!==r.get(this.G)&&this.G.call(this.ct,void 0),r.set(this.G,e),void 0!==e&&this.G.call(this.ct,e)}else this.G.value=e}get rt(){return"function"==typeof this.G?er.get(this.ct??globalThis)?.get(this.G):this.G?.value}disconnected(){this.rt===this.lt&&this.ot(void 0)}reconnected(){this.ot(this.lt)}}),rr=n.iv`
  :host {
    position: relative;
    width: 100%;
    display: inline-block;
    color: var(--wui-color-fg-275);
  }

  input {
    width: 100%;
    border-radius: var(--wui-border-radius-xxs);
    border: 1px solid var(--wui-gray-glass-005);
    background: var(--wui-gray-glass-005);
    font-size: var(--wui-font-size-paragraph);
    font-weight: var(--wui-font-weight-regular);
    letter-spacing: var(--wui-letter-spacing-paragraph);
    color: var(--wui-color-fg-100);
    transition: all var(--wui-ease-inout-power-1) var(--wui-duration-lg);
    caret-color: var(--wui-color-accent-100);
  }

  input:disabled {
    cursor: not-allowed;
    border: 1px solid var(--wui-gray-glass-010);
    background: var(--wui-gray-glass-015);
  }

  input:disabled::placeholder,
  input:disabled + wui-icon {
    color: var(--wui-color-fg-300);
  }

  input::placeholder {
    color: var(--wui-color-fg-275);
  }

  input:focus:enabled {
    transition: all var(--wui-ease-out-power-2) var(--wui-duration-sm);
    background-color: var(--wui-gray-glass-010);
    border: 1px solid var(--wui-color-accent-100);
    -webkit-box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
    -moz-box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
    box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
  }

  input:hover:enabled {
    background-color: var(--wui-gray-glass-010);
  }

  wui-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .wui-size-sm {
    padding: 9px var(--wui-spacing-m) 10px var(--wui-spacing-s);
  }

  wui-icon + .wui-size-sm {
    padding: 9px var(--wui-spacing-m) 10px 36px;
  }

  wui-icon[data-input='sm'] {
    left: var(--wui-spacing-s);
  }

  .wui-size-md {
    padding: 15px var(--wui-spacing-m) var(--wui-spacing-l) var(--wui-spacing-m);
  }

  wui-icon + .wui-size-md {
    padding: 15px var(--wui-spacing-m) var(--wui-spacing-l) 42px;
  }

  wui-icon[data-input='md'] {
    left: var(--wui-spacing-m);
  }

  input:placeholder-shown ~ ::slotted(wui-input-element),
  input:placeholder-shown ~ ::slotted(wui-icon) {
    opacity: 0;
    pointer-events: none;
  }

  ::slotted(wui-input-element),
  ::slotted(wui-icon) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition: all var(--wui-ease-in-power-2) var(--wui-duration-md);
  }

  ::slotted(wui-input-element) {
    right: var(--wui-spacing-m);
  }

  ::slotted(wui-icon) {
    right: 0px;
  }
`;var nr=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let ir=class extends n.oi{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.placeholder="",this.type="text",this.inputElementRef=Jt()}render(){const e=`wui-size-${this.size}`;return n.dy` ${this.templateIcon()}
      <input
        ${tr(this.inputElementRef)}
        class=${e}
        type=${this.type}
        enterkeyhint=${(0,tt.o)(this.enterKeyHint)}
        ?disabled=${this.disabled}
        placeholder=${this.placeholder}
        @input=${this.dispatchInputChangeEvent.bind(this)}
      />
      <slot></slot>`}templateIcon(){return this.icon?n.dy`<wui-icon
        data-input=${this.size}
        size="md"
        color="inherit"
        name=${this.icon}
      ></wui-icon>`:null}dispatchInputChangeEvent(){this.dispatchEvent(new CustomEvent("inputChange",{detail:this.inputElementRef.value?.value,bubbles:!0,composed:!0}))}};ir.styles=[d,h,rr],nr([(0,b.Cb)()],ir.prototype,"size",void 0),nr([(0,b.Cb)()],ir.prototype,"icon",void 0),nr([(0,b.Cb)({type:Boolean})],ir.prototype,"disabled",void 0),nr([(0,b.Cb)()],ir.prototype,"placeholder",void 0),nr([(0,b.Cb)()],ir.prototype,"type",void 0),nr([(0,b.Cb)()],ir.prototype,"keyHint",void 0),ir=nr([f("wui-input-text")],ir);const or=n.iv`
  :host {
    position: relative;
    display: inline-block;
  }

  wui-icon {
    padding: var(--wui-spacing-xl);
    cursor: pointer;
    transition: all var(--wui-duration-lg) var(--wui-ease-in-power-1);
  }

  wui-icon:hover {
    color: var(--wui-color-fg-200) !important;
  }

  wui-icon::part(chevronRight) {
    width: 12px;
    height: 12px;
  }

  wui-text {
    margin: var(--wui-spacing-xxs) var(--wui-spacing-m) var(--wui-spacing-0) var(--wui-spacing-m);
  }
`;var ar=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let sr=class extends n.oi{render(){return n.dy`
      <wui-input-text placeholder="Email" icon="mail" size="md">
        <wui-icon size="inherit" color="fg-100" name="chevronRight"></wui-icon>
      </wui-input-text>
      ${this.templateError()}
    `}templateError(){return this.errorMessage?n.dy`<wui-text variant="tiny-500" color="error-100">${this.errorMessage}</wui-text>`:null}};sr.styles=[d,or],ar([(0,b.Cb)()],sr.prototype,"errorMessage",void 0),sr=ar([f("wui-email-input")],sr);const cr=n.iv`
  button {
    border-radius: var(--wui-border-radius-xxs);
    color: var(--wui-color-fg-100);
    padding: var(--wui-spacing-2xs);
  }

  @media (max-width: 700px) {
    button {
      padding: var(--wui-spacing-s);
    }
  }

  button > wui-icon {
    pointer-events: none;
  }

  button:disabled > wui-icon {
    color: var(--wui-color-bg-300) !important;
  }

  button:disabled {
    background-color: transparent;
  }
`;var lr=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let ur=class extends n.oi{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.icon="copy",this.iconColor="inherit"}render(){return n.dy`
      <button ?disabled=${this.disabled} ontouchstart>
        <wui-icon color=${this.iconColor} size=${this.size} name=${this.icon}></wui-icon>
      </button>
    `}};ur.styles=[d,h,p,cr],lr([(0,b.Cb)()],ur.prototype,"size",void 0),lr([(0,b.Cb)({type:Boolean})],ur.prototype,"disabled",void 0),lr([(0,b.Cb)()],ur.prototype,"icon",void 0),lr([(0,b.Cb)()],ur.prototype,"iconColor",void 0),ur=lr([f("wui-icon-link")],ur);const dr=n.iv`
  button {
    background-color: var(--wui-color-fg-300);
    border-radius: var(--wui-border-radius-4xs);
    width: 16px;
    height: 16px;
  }

  button:disabled {
    background-color: var(--wui-color-bg-300);
  }

  wui-icon {
    color: var(--wui-color-bg-200) !important;
  }

  button:focus-visible {
    background-color: var(--wui-color-fg-250);
    border: 1px solid var(--wui-color-accent-100);
  }

  button:active:enabled {
    background-color: var(--wui-color-fg-225);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-fg-250);
    }
  }
`;var hr=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let pr=class extends n.oi{constructor(){super(...arguments),this.icon="copy"}render(){return n.dy`
      <button>
        <wui-icon color="inherit" size="xxs" name=${this.icon}></wui-icon>
      </button>
    `}};pr.styles=[d,h,dr],hr([(0,b.Cb)()],pr.prototype,"icon",void 0),pr=hr([f("wui-input-element")],pr);const fr=n.iv`
  :host {
    position: relative;
    display: inline-block;
  }

  input {
    width: 50px;
    height: 50px;
    background: var(--wui-gray-glass-005);
    border-radius: var(--wui-border-radius-xs);
    border: 1px solid var(--wui-gray-glass-005);
    font-family: var(--wui-font-family);
    font-size: var(--wui-font-size-large);
    font-weight: var(--wui-font-weight-regular);
    letter-spacing: var(--wui-letter-spacing-large);
    text-align: center;
    color: var(--wui-color-fg-100);
    caret-color: var(--wui-color-accent-100);
    transition: all var(--wui-ease-inout-power-1) var(--wui-duration-lg);
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: textfield;
    padding: 0px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  input:disabled {
    cursor: not-allowed;
    border: 1px solid var(--wui-gray-glass-010);
    background: var(--wui-gray-glass-015);
  }

  input:focus:enabled {
    transition: all var(--wui-ease-out-power-2) var(--wui-duration-sm);
    background-color: var(--wui-gray-glass-010);
    border: 1px solid var(--wui-color-accent-100);
    -webkit-box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
    -moz-box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
    box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
  }

  input:hover:enabled {
    background-color: var(--wui-gray-glass-010);
  }
`;var gr=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let wr=class extends n.oi{constructor(){super(...arguments),this.disabled=!1}render(){return n.dy`<input
      type="number"
      maxlength="1"
      inputmode="numeric"
      autofocus
      ?disabled=${this.disabled}
    /> `}};wr.styles=[d,h,fr],gr([(0,b.Cb)({type:Boolean})],wr.prototype,"disabled",void 0),wr=gr([f("wui-input-numeric")],wr);const br=n.iv`
  button {
    padding: var(--wui-spacing-4xs) var(--wui-spacing-xxs);
    border-radius: var(--wui-border-radius-3xs);
    background-color: transparent;
    color: var(--wui-color-accent-100);
  }

  button:disabled {
    background-color: transparent;
    color: var(--wui-gray-glass-015);
  }
`;var mr=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let yr=class extends n.oi{constructor(){super(...arguments),this.disabled=!1,this.color="inherit"}render(){return n.dy`
      <button ?disabled=${this.disabled} ontouchstart>
        <slot name="iconLeft"></slot>
        <wui-text variant="small-600" color=${this.color}>
          <slot></slot>
        </wui-text>
        <slot name="iconRight"></slot>
      </button>
    `}};yr.styles=[d,h,br],mr([(0,b.Cb)({type:Boolean})],yr.prototype,"disabled",void 0),mr([(0,b.Cb)()],yr.prototype,"color",void 0),yr=mr([f("wui-link")],yr);const vr=n.iv`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 11px 18px 11px var(--wui-spacing-s);
    width: 100%;
    background-color: var(--wui-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-250);
  }

  button[data-iconvariant='square'],
  button[data-iconvariant='square-blue'] {
    padding: 6px 18px 6px 9px;
  }

  button > wui-flex {
    flex: 1;
  }

  button > wui-image {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 2px var(--wui-gray-glass-005);
    border-radius: var(--wui-border-radius-3xl);
  }

  button > wui-icon {
    width: 36px;
    height: 36px;
  }

  button > wui-icon-box[data-variant='blue'] {
    box-shadow: 0 0 0 2px var(--wui-accent-glass-005);
  }

  button > wui-icon-box[data-variant='overlay'] {
    box-shadow: 0 0 0 2px var(--wui-gray-glass-005);
  }

  button > wui-icon-box[data-variant='square-blue'] {
    border-radius: var(--wui-border-radius-3xs);
    position: relative;
    border: none;
    width: 36px;
    height: 36px;
  }

  button > wui-icon-box[data-variant='square-blue']::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-accent-glass-010);
    pointer-events: none;
  }

  button > wui-icon:last-child {
    width: 14px;
    height: 14px;
  }

  button:disabled {
    background-color: var(--wui-gray-glass-015);
    color: var(--wui-gray-glass-015);
  }

  button[data-loading='true'] > wui-icon {
    transition: opacity 200ms ease-in-out;
    opacity: 0;
  }

  wui-loading-spinner {
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
  }
`;var xr=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Cr=class extends n.oi{constructor(){super(...arguments),this.variant="icon",this.disabled=!1,this.imageSrc=void 0,this.alt=void 0,this.chevron=!1,this.loading=!1}render(){return n.dy`
      <button
        ?disabled=${!!this.loading||Boolean(this.disabled)}
        data-loading=${this.loading}
        data-iconvariant=${(0,tt.o)(this.iconVariant)}
        ontouchstart
      >
        ${this.loadingTemplate()} ${this.visualTemplate()}
        <wui-flex gap="3xs">
          <slot></slot>
        </wui-flex>
        ${this.chevronTemplate()}
      </button>
    `}visualTemplate(){if("image"===this.variant&&this.imageSrc)return n.dy`<wui-image src=${this.imageSrc} alt=${this.alt??"list item"}></wui-image>`;if("square"===this.iconVariant&&this.icon&&"icon"===this.variant)return n.dy`<wui-icon name=${this.icon}></wui-icon>`;if("icon"===this.variant&&this.icon&&this.iconVariant){const e=["blue","square-blue"].includes(this.iconVariant)?"accent-100":"fg-200",t="square-blue"===this.iconVariant?"mdl":"md",r=this.iconSize?this.iconSize:t;return n.dy`
        <wui-icon-box
          data-variant=${this.iconVariant}
          icon=${this.icon}
          iconSize=${r}
          background="transparent"
          iconColor=${e}
          backgroundColor=${e}
          size=${t}
        ></wui-icon-box>
      `}return null}loadingTemplate(){return this.loading?n.dy`<wui-loading-spinner color="fg-300"></wui-loading-spinner>`:n.dy``}chevronTemplate(){return this.chevron?n.dy`<wui-icon size="inherit" color="fg-200" name="chevronRight"></wui-icon>`:null}};var kr;Cr.styles=[d,h,vr],xr([(0,b.Cb)()],Cr.prototype,"icon",void 0),xr([(0,b.Cb)()],Cr.prototype,"iconSize",void 0),xr([(0,b.Cb)()],Cr.prototype,"variant",void 0),xr([(0,b.Cb)()],Cr.prototype,"iconVariant",void 0),xr([(0,b.Cb)({type:Boolean})],Cr.prototype,"disabled",void 0),xr([(0,b.Cb)()],Cr.prototype,"imageSrc",void 0),xr([(0,b.Cb)()],Cr.prototype,"alt",void 0),xr([(0,b.Cb)({type:Boolean})],Cr.prototype,"chevron",void 0),xr([(0,b.Cb)({type:Boolean})],Cr.prototype,"loading",void 0),Cr=xr([f("wui-list-item")],Cr),function(e){e.approve="approved",e.bought="bought",e.borrow="borrowed",e.burn="burnt",e.cancel="canceled",e.claim="claimed",e.deploy="deployed",e.deposit="deposited",e.execute="executed",e.mint="minted",e.receive="received",e.repay="repaid",e.send="sent",e.sell="sold",e.stake="staked",e.trade="swapped",e.unstake="unstaked",e.withdraw="withdrawn"}(kr||(kr={}));const Er=n.iv`
  :host > wui-flex {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 40px;
    height: 40px;
    box-shadow: inset 0 0 0 1px var(--wui-gray-glass-005);
    background-color: var(--wui-gray-glass-005);
  }

  :host > wui-flex wui-image {
    display: block;
    z-index: -1;
  }

  :host > wui-flex,
  :host > wui-flex wui-image,
  .swap-images-container,
  .swap-images-container.nft,
  wui-image.nft {
    border-top-left-radius: var(--local-left-border-radius);
    border-top-right-radius: var(--local-right-border-radius);
    border-bottom-left-radius: var(--local-left-border-radius);
    border-bottom-right-radius: var(--local-right-border-radius);
  }

  wui-icon {
    width: 20px;
    height: 20px;
  }

  wui-icon-box {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(20%, 20%);
  }

  .swap-images-container {
    position: relative;
    width: 40px;
    height: 40px;
    overflow: hidden;
  }

  .swap-images-container wui-image:first-child {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 0;
    left: 0%;
    clip-path: inset(0px calc(50% + 2px) 0px 0%);
  }

  .swap-images-container wui-image:last-child {
    clip-path: inset(0px 0px 0px calc(50% + 2px));
  }
`;var Pr=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let $r=class extends n.oi{constructor(){super(...arguments),this.images=[],this.secondImage={type:void 0,url:""}}render(){const[e,t]=this.images,r="NFT"===e?.type,i=r?"var(--wui-border-radius-xxs)":"var(--wui-border-radius-s)",o=(t?.url?"NFT"===t.type:r)?"var(--wui-border-radius-xxs)":"var(--wui-border-radius-s)";return this.style.cssText=`\n    --local-left-border-radius: ${i};\n    --local-right-border-radius: ${o};\n    `,n.dy`<wui-flex> ${this.templateVisual()} ${this.templateIcon()} </wui-flex>`}templateVisual(){const[e,t]=this.images,r=e?.type;return 2===this.images.length&&(e?.url||t?.url)?n.dy`<div class="swap-images-container">
        ${e?.url?n.dy`<wui-image src=${e.url} alt="Transaction image"></wui-image>`:null}
        ${t?.url?n.dy`<wui-image src=${t.url} alt="Transaction image"></wui-image>`:null}
      </div>`:e?.url?n.dy`<wui-image src=${e.url} alt="Transaction image"></wui-image>`:"NFT"===r?n.dy`<wui-icon size="inherit" color="fg-200" name="nftPlaceholder"></wui-icon>`:n.dy`<wui-icon size="inherit" color="fg-200" name="coinPlaceholder"></wui-icon>`}templateIcon(){let e,t="accent-100";return e=this.getIcon(),this.status&&(t=this.getStatusColor()),e?n.dy`
      <wui-icon-box
        size="xxs"
        iconColor=${t}
        backgroundColor=${t}
        background="opaque"
        icon=${e}
        ?border=${!0}
        borderColor="wui-color-bg-125"
      ></wui-icon-box>
    `:null}getDirectionIcon(){switch(this.direction){case"in":return"arrowBottom";case"out":return"arrowTop";default:return}}getIcon(){return this.onlyDirectionIcon?this.getDirectionIcon():"trade"===this.type?"swapHorizontalBold":"approve"===this.type?"checkmark":"cancel"===this.type?"close":this.getDirectionIcon()}getStatusColor(){switch(this.status){case"confirmed":return"success-100";case"failed":return"error-100";case"pending":return"inverse-100";default:return"accent-100"}}};$r.styles=[Er],Pr([(0,b.Cb)()],$r.prototype,"type",void 0),Pr([(0,b.Cb)()],$r.prototype,"status",void 0),Pr([(0,b.Cb)()],$r.prototype,"direction",void 0),Pr([(0,b.Cb)()],$r.prototype,"onlyDirectionIcon",void 0),Pr([(0,b.Cb)()],$r.prototype,"images",void 0),Pr([(0,b.Cb)()],$r.prototype,"secondImage",void 0),$r=Pr([f("wui-transaction-visual")],$r);const Sr=n.iv`
  :host > wui-flex:first-child {
    align-items: center;
    column-gap: var(--wui-spacing-s);
    padding: 6.5px var(--wui-spacing-l) 6.5px var(--wui-spacing-xs);
    width: 100%;
  }

  :host > wui-flex:first-child wui-text:nth-child(1) {
    text-transform: capitalize;
  }

  wui-transaction-visual {
    width: 40px;
    height: 40px;
  }

  wui-flex {
    flex: 1;
  }

  :host wui-flex wui-flex {
    overflow: hidden;
  }

  :host .description-container wui-text span {
    word-break: break-all;
  }

  :host .description-container wui-text {
    overflow: hidden;
  }

  :host .description-separator-icon {
    margin: 0px 6px;
  }

  :host wui-text > span {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
`;var _r=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Ar=class extends n.oi{constructor(){super(...arguments),this.type="approve",this.onlyDirectionIcon=!1,this.images=[]}render(){return n.dy`
      <wui-flex>
        <wui-transaction-visual
          status=${this.status}
          direction=${this.direction}
          type=${this.type}
          onlyDirectionIcon=${this.onlyDirectionIcon}
          .images=${this.images}
        ></wui-transaction-visual>
        <wui-flex flexDirection="column" gap="3xs">
          <wui-text variant="paragraph-600" color="fg-100">
            ${kr[this.type]}
          </wui-text>
          <wui-flex class="description-container">
            ${this.templateDescription()} ${this.templateSecondDescription()}
          </wui-flex>
        </wui-flex>
        <wui-text variant="micro-700" color="fg-300"><span>${this.date}</span></wui-text>
      </wui-flex>
    `}templateDescription(){const e=this.descriptions?.[0];return e?n.dy`
          <wui-text variant="small-500" color="fg-200">
            <span>${e}</span>
          </wui-text>
        `:null}templateSecondDescription(){const e=this.descriptions?.[1];return e?n.dy`
          <wui-icon class="description-separator-icon" size="xxs" name="arrowRight"></wui-icon>
          <wui-text variant="small-400" color="fg-200">
            <span>${e}</span>
          </wui-text>
        `:null}};Ar.styles=[d,Sr],_r([(0,b.Cb)()],Ar.prototype,"type",void 0),_r([(0,b.Cb)()],Ar.prototype,"descriptions",void 0),_r([(0,b.Cb)()],Ar.prototype,"date",void 0),_r([(0,b.Cb)()],Ar.prototype,"onlyDirectionIcon",void 0),_r([(0,b.Cb)()],Ar.prototype,"status",void 0),_r([(0,b.Cb)()],Ar.prototype,"direction",void 0),_r([(0,b.Cb)()],Ar.prototype,"images",void 0),Ar=_r([f("wui-transaction-list-item")],Ar);const Ir=n.iv`
  :host > wui-flex:first-child {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
  }

  wui-flex {
    display: flex;
    flex: 1;
  }
`;let Or=class extends n.oi{render(){return n.dy`
      <wui-flex alignItems="center">
        <wui-shimmer width="40px" height="40px"></wui-shimmer>
        <wui-flex flexDirection="column" gap="2xs">
          <wui-shimmer width="72px" height="16px" borderRadius="4xs"></wui-shimmer>
          <wui-shimmer width="148px" height="14px" borderRadius="4xs"></wui-shimmer>
        </wui-flex>
        <wui-shimmer width="24px" height="12px" borderRadius="5xs"></wui-shimmer>
      </wui-flex>
    `}};Or.styles=[d,Ir],Or=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}([f("wui-transaction-list-item-loader")],Or);const Tr=n.iv`
  :host {
    display: block;
    padding: 3.5px 5px !important;
    border-radius: var(--wui-border-radius-5xs);
  }

  :host([data-variant='main']) {
    background-color: var(--wui-accent-glass-015);
    color: var(--wui-color-accent-100);
  }

  :host([data-variant='shade']) {
    background-color: var(--wui-gray-glass-010);
    color: var(--wui-color-fg-200);
  }

  :host([data-variant='success']) {
    background-color: var(--wui-icon-box-bg-success-100);
    color: var(--wui-color-success-100);
  }

  :host([data-variant='error']) {
    background-color: var(--wui-icon-box-bg-error-100);
    color: var(--wui-color-error-100);
  }
`;var Nr=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Rr=class extends n.oi{constructor(){super(...arguments),this.variant="main"}render(){return this.dataset.variant=this.variant,n.dy`
      <wui-text data-variant=${this.variant} variant="micro-700" color="inherit">
        <slot></slot>
      </wui-text>
    `}};Rr.styles=[d,Tr],Nr([(0,b.Cb)()],Rr.prototype,"variant",void 0),Rr=Nr([f("wui-tag")],Rr);const jr=n.iv`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
    background-color: var(--wui-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-100);
  }

  button > wui-text:nth-child(2) {
    display: flex;
    flex: 1;
  }

  wui-icon {
    color: var(--wui-color-fg-200) !important;
  }

  button:disabled {
    background-color: var(--wui-gray-glass-015);
    color: var(--wui-gray-glass-015);
  }

  button:disabled > wui-tag {
    background-color: var(--wui-gray-glass-010);
    color: var(--wui-color-fg-300);
  }
`;var Br=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Mr=class extends n.oi{constructor(){super(...arguments),this.walletImages=[],this.imageSrc="",this.name="",this.disabled=!1,this.showAllWallets=!1}render(){return n.dy`
      <button ?disabled=${this.disabled} ontouchstart>
        ${this.templateAllWallets()} ${this.templateWalletImage()}
        <wui-text variant="paragraph-500" color="inherit">${this.name}</wui-text>
        ${this.templateStatus()}
      </button>
    `}templateAllWallets(){return this.showAllWallets&&this.imageSrc?n.dy` <wui-all-wallets-image .imageeSrc=${this.imageSrc}> </wui-all-wallets-image> `:this.showAllWallets&&this.walletIcon?n.dy` <wui-wallet-image .walletIcon=${this.walletIcon} size="sm"> </wui-wallet-image> `:null}templateWalletImage(){return!this.showAllWallets&&this.imageSrc?n.dy`<wui-wallet-image
        size="sm"
        imageSrc=${this.imageSrc}
        name=${this.name}
      ></wui-wallet-image>`:this.showAllWallets||this.imageSrc?null:n.dy`<wui-wallet-image size="sm" name=${this.name}></wui-wallet-image>`}templateStatus(){return this.tagLabel&&this.tagVariant?n.dy`<wui-tag variant=${this.tagVariant}>${this.tagLabel}</wui-tag>`:this.icon?n.dy`<wui-icon color="inherit" size="sm" name=${this.icon}></wui-icon>`:null}};Mr.styles=[d,h,jr],Br([(0,b.Cb)({type:Array})],Mr.prototype,"walletImages",void 0),Br([(0,b.Cb)()],Mr.prototype,"imageSrc",void 0),Br([(0,b.Cb)()],Mr.prototype,"name",void 0),Br([(0,b.Cb)()],Mr.prototype,"tagLabel",void 0),Br([(0,b.Cb)()],Mr.prototype,"tagVariant",void 0),Br([(0,b.Cb)()],Mr.prototype,"icon",void 0),Br([(0,b.Cb)()],Mr.prototype,"walletIcon",void 0),Br([(0,b.Cb)({type:Boolean})],Mr.prototype,"disabled",void 0),Br([(0,b.Cb)({type:Boolean})],Mr.prototype,"showAllWallets",void 0),Mr=Br([f("wui-list-wallet")],Mr);const Ur=n.iv`
  :host {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-3xl);
    border: 1px solid var(--wui-gray-glass-010);
    overflow: hidden;
  }

  wui-icon {
    width: 100%;
    height: 100%;
  }
`;var Lr=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Dr=class extends n.oi{constructor(){super(...arguments),this.logo="google"}render(){return n.dy`<wui-icon color="inherit" size="inherit" name=${this.logo}></wui-icon> `}};Dr.styles=[d,Ur],Lr([(0,b.Cb)()],Dr.prototype,"logo",void 0),Dr=Lr([f("wui-logo")],Dr);const zr=n.iv`
  :host {
    display: block;
  }

  button {
    width: 50px;
    height: 50px;
    background: var(--wui-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }
`;var Wr=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Fr=class extends n.oi{constructor(){super(...arguments),this.logo="google",this.disabled=!1}render(){return n.dy`
      <button ?disabled=${this.disabled} ontouchstart>
        <wui-logo logo=${this.logo}></wui-logo>
      </button>
    `}};Fr.styles=[d,h,zr],Wr([(0,b.Cb)()],Fr.prototype,"logo",void 0),Wr([(0,b.Cb)({type:Boolean})],Fr.prototype,"disabled",void 0),Fr=Wr([f("wui-logo-select")],Fr);const Hr=n.iv`
  :host {
    display: block;
  }

  button {
    border-radius: var(--wui-border-radius-3xl);
    display: flex;
    gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-2xs) var(--wui-spacing-s) var(--wui-spacing-2xs)
      var(--wui-spacing-xs);
    border: 1px solid var(--wui-gray-glass-010);
    background-color: var(--wui-gray-glass-005);
    color: var(--wui-color-fg-100);
  }

  button:disabled {
    border: 1px solid var(--wui-gray-glass-005);
    background-color: var(--wui-gray-glass-015);
    color: var(--wui-gray-glass-015);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-gray-glass-010);
    }

    button:active:enabled {
      background-color: var(--wui-gray-glass-015);
    }
  }

  wui-image,
  wui-icon-box {
    border-radius: var(--wui-border-radius-3xl);
    width: 24px;
    height: 24px;
    box-shadow: 0 0 0 2px var(--wui-gray-glass-005);
  }
`;var Gr=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let qr=class extends n.oi{constructor(){super(...arguments),this.imageSrc=void 0,this.disabled=!1}render(){return n.dy`
      <button ?disabled=${this.disabled}>
        ${this.visualTemplate()}
        <wui-text variant="paragraph-600" color="inherit">
          <slot></slot>
        </wui-text>
      </button>
    `}visualTemplate(){return this.imageSrc?n.dy`<wui-image src=${this.imageSrc}></wui-image>`:n.dy`
      <wui-icon-box
        size="sm"
        iconColor="inverse-100"
        backgroundColor="fg-100"
        icon="networkPlaceholder"
      ></wui-icon-box>
    `}};qr.styles=[d,h,Hr],Gr([(0,b.Cb)()],qr.prototype,"imageSrc",void 0),Gr([(0,b.Cb)({type:Boolean})],qr.prototype,"disabled",void 0),qr=Gr([f("wui-network-button")],qr);const Zr=n.iv`
  :host {
    position: relative;
    display: block;
  }
`;var Vr=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Yr=class extends n.oi{constructor(){super(...arguments),this.length=6,this.numerics=[],this.handleKeyDown=(e,t)=>{const r=e.target,n=this.getInputElement(r);if(!n)return;["ArrowLeft","ArrowRight","Shift","Delete"].includes(e.key)&&e.preventDefault();const i=n.selectionStart;switch(e.key){case"ArrowLeft":i&&n.setSelectionRange(i+1,i+1),this.focusInputField("prev",t);break;case"ArrowRight":case"Shift":this.focusInputField("next",t);break;case"Delete":case"Backspace":""===n.value?this.focusInputField("prev",t):n.value=""}},this.focusInputField=(e,t)=>{if("next"===e){const e=t+1,r=this.numerics[e<this.length?e:t],n=r?this.getInputElement(r):void 0;n&&n.focus()}if("prev"===e){const e=t-1,r=this.numerics[e>-1?e:t],n=r?this.getInputElement(r):void 0;n&&n.focus()}}}firstUpdated(){const e=this.shadowRoot?.querySelectorAll("wui-input-numeric");e&&(this.numerics=Array.from(e))}render(){return n.dy`
      <wui-flex gap="xxs">
        ${[...Array(this.length)].map(((e,t)=>n.dy`
            <wui-input-numeric
              @input=${e=>this.handleInput(e,t)}
              @keydown=${e=>this.handleKeyDown(e,t)}
            >
            </wui-input-numeric>
          `))}
      </wui-flex>
    `}handleInput(e,t){const r=e.target,n=this.getInputElement(r);if(n){const r=n.value;"insertFromPaste"===e.inputType?this.handlePaste(n,r,t):rt.isNumber(r)&&e.data?(n.value=e.data,this.focusInputField("next",t)):n.value=""}}handlePaste(e,t,r){const n=t[0];if(n&&rt.isNumber(n)){e.value=n;const i=t.substring(1);if(r+1<this.length&&i.length){const e=this.numerics[r+1],t=e?this.getInputElement(e):void 0;t&&this.handlePaste(t,i,r+1)}else this.focusInputField("next",r)}else e.value=""}getInputElement(e){return e.shadowRoot?.querySelector("input")?e.shadowRoot.querySelector("input"):null}};Yr.styles=[d,Zr],Vr([(0,b.Cb)({type:Number})],Yr.prototype,"length",void 0),Yr=Vr([f("wui-otp")],Yr);var Kr=r(2592);function Xr(e,t,r){return e!==t&&(e-t<0?t-e:e-t)<=r+.1}const Jr={generate(e,t,r){const i="#141414",o=[],a=function(e,t){const r=Array.prototype.slice.call(Kr.create(e,{errorCorrectionLevel:"Q"}).modules.data,0),n=Math.sqrt(r.length);return r.reduce(((e,t,r)=>(r%n==0?e.push([t]):e[e.length-1].push(t))&&e),[])}(e),s=t/a.length,c=[{x:0,y:0},{x:1,y:0},{x:0,y:1}];c.forEach((({x:e,y:t})=>{const r=(a.length-7)*s*e,l=(a.length-7)*s*t,u=.45;for(let e=0;e<c.length;e+=1){const t=s*(7-2*e);o.push(n.YP`
            <rect
              fill=${2===e?i:"transparent"}
              width=${0===e?t-5:t}
              rx= ${0===e?(t-5)*u:t*u}
              ry= ${0===e?(t-5)*u:t*u}
              stroke=${i}
              stroke-width=${0===e?5:0}
              height=${0===e?t-5:t}
              x= ${0===e?l+s*e+2.5:l+s*e}
              y= ${0===e?r+s*e+2.5:r+s*e}
            />
          `)}}));const l=Math.floor((r+25)/s),u=a.length/2-l/2,d=a.length/2+l/2-1,h=[];a.forEach(((e,t)=>{e.forEach(((e,r)=>{if(a[t][r]&&!(t<7&&r<7||t>a.length-8&&r<7||t<7&&r>a.length-8||t>u&&t<d&&r>u&&r<d)){const e=t*s+s/2,n=r*s+s/2;h.push([e,n])}}))}));const p={};return h.forEach((([e,t])=>{p[e]?p[e]?.push(t):p[e]=[t]})),Object.entries(p).map((([e,t])=>{const r=t.filter((e=>t.every((t=>!Xr(e,t,s)))));return[Number(e),r]})).forEach((([e,t])=>{t.forEach((t=>{o.push(n.YP`<circle cx=${e} cy=${t} fill=${i} r=${s/2.5} />`)}))})),Object.entries(p).filter((([e,t])=>t.length>1)).map((([e,t])=>{const r=t.filter((e=>t.some((t=>Xr(e,t,s)))));return[Number(e),r]})).map((([e,t])=>{t.sort(((e,t)=>e<t?-1:1));const r=[];for(const e of t){const t=r.find((t=>t.some((t=>Xr(e,t,s)))));t?t.push(e):r.push([e])}return[e,r.map((e=>[e[0],e[e.length-1]]))]})).forEach((([e,t])=>{t.forEach((([t,r])=>{o.push(n.YP`
              <line
                x1=${e}
                x2=${e}
                y1=${t}
                y2=${r}
                stroke=${i}
                stroke-width=${s/1.25}
                stroke-linecap="round"
              />
            `)}))})),o}},Qr=n.iv`
  :host {
    position: relative;
    user-select: none;
    display: block;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    width: var(--local-size);
  }

  :host([data-theme='dark']) {
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px);
    background-color: var(--wui-color-inverse-100);
    padding: var(--wui-spacing-l);
  }

  :host([data-theme='light']) {
    box-shadow: 0 0 0 1px var(--wui-color-bg-125);
    background-color: var(--wui-color-bg-125);
  }

  svg:first-child,
  wui-image,
  wui-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }

  wui-image {
    width: 25%;
    height: 25%;
    border-radius: var(--wui-border-radius-xs);
  }

  wui-icon {
    width: 100%;
    height: 100%;
    color: #3396ff !important;
    transform: translateY(-50%) translateX(-50%) scale(0.25);
  }
`;var en=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let tn=class extends n.oi{constructor(){super(...arguments),this.uri="",this.size=0,this.theme="dark",this.imageSrc=void 0,this.alt=void 0}render(){return this.dataset.theme=this.theme,this.style.cssText=`--local-size: ${this.size}px`,n.dy`${this.templateVisual()} ${this.templateSvg()}`}templateSvg(){const e="light"===this.theme?this.size:this.size-32;return n.YP`
      <svg height=${e} width=${e}>
        ${Jr.generate(this.uri,e,e/4)}
      </svg>
    `}templateVisual(){return this.imageSrc?n.dy`<wui-image src=${this.imageSrc} alt=${this.alt??"logo"}></wui-image>`:n.dy`<wui-icon size="inherit" color="inherit" name="walletConnect"></wui-icon>`}};tn.styles=[d,Qr],en([(0,b.Cb)()],tn.prototype,"uri",void 0),en([(0,b.Cb)({type:Number})],tn.prototype,"size",void 0),en([(0,b.Cb)()],tn.prototype,"theme",void 0),en([(0,b.Cb)()],tn.prototype,"imageSrc",void 0),en([(0,b.Cb)()],tn.prototype,"alt",void 0),tn=en([f("wui-qr-code")],tn);const rn=n.iv`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }
`;let nn=class extends n.oi{constructor(){super(...arguments),this.inputComponentRef=Jt()}render(){return n.dy`
      <wui-input-text
        ${tr(this.inputComponentRef)}
        placeholder="Search wallet"
        icon="search"
        type="search"
        enterKeyHint="search"
        size="sm"
      >
        <wui-input-element @click=${this.clearValue} icon="close"></wui-input-element>
      </wui-input-text>
    `}clearValue(){const e=this.inputComponentRef.value,t=e?.inputElementRef.value;t&&(t.value="",t.focus(),t.dispatchEvent(new Event("input")))}};nn.styles=[d,rn],nn=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}([f("wui-search-bar")],nn);const on=n.iv`
  :host {
    display: flex;
    column-gap: var(--wui-spacing-xs);
    align-items: center;
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    border-radius: var(--wui-border-radius-3xl);
    border: 1px solid var(--wui-gray-glass-005);
    background-color: var(--wui-color-bg-175);
    box-shadow:
      0px 14px 64px -4px rgba(0, 0, 0, 0.15),
      0px 8px 22px -6px rgba(0, 0, 0, 0.15);
  }
`;var an=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let sn=class extends n.oi{constructor(){super(...arguments),this.backgroundColor="accent-100",this.iconColor="accent-100",this.icon="checkmark",this.message=""}render(){return n.dy`
      <wui-icon-box
        size="xs"
        iconColor=${this.iconColor}
        backgroundColor=${this.backgroundColor}
        icon=${this.icon}
      ></wui-icon-box>
      <wui-text variant="paragraph-500" color="fg-100">${this.message}</wui-text>
    `}};sn.styles=[d,on],an([(0,b.Cb)()],sn.prototype,"backgroundColor",void 0),an([(0,b.Cb)()],sn.prototype,"iconColor",void 0),an([(0,b.Cb)()],sn.prototype,"icon",void 0),an([(0,b.Cb)()],sn.prototype,"message",void 0),sn=an([f("wui-snackbar")],sn);const cn=n.iv`
  :host {
    display: inline-flex;
    background-color: var(--wui-gray-glass-002);
    border-radius: var(--wui-border-radius-3xl);
    padding: var(--wui-spacing-3xs);
    position: relative;
    height: 36px;
    overflow: hidden;
  }

  :host::before {
    content: '';
    position: absolute;
    pointer-events: none;
    top: 4px;
    left: 4px;
    display: block;
    width: var(--local-tab-width);
    height: 28px;
    border-radius: var(--wui-border-radius-3xl);
    background-color: var(--wui-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-gray-glass-002);
    transform: translateX(calc(var(--local-tab) * var(--local-tab-width)));
    transition: transform var(--wui-ease-out-power-2) var(--wui-duration-lg);
  }

  :host([data-type='flex'])::before {
    left: 3px;
    transform: translateX(calc((var(--local-tab) * 34px) + (var(--local-tab) * 4px)));
  }

  :host([data-type='flex']) {
    display: flex;
    padding: 0px 0px 0px 12px;
    gap: 4px;
  }

  :host([data-type='flex']) > button > wui-text {
    position: absolute;
    left: 18px;
    opacity: 0;
  }

  button[data-active='true'] > wui-icon,
  button[data-active='true'] > wui-text {
    color: var(--wui-color-fg-100);
  }

  button[data-active='false'] > wui-icon,
  button[data-active='false'] > wui-text {
    color: var(--wui-color-fg-200);
  }

  button[data-active='true']:disabled,
  button[data-active='false']:disabled {
    background-color: transparent;
    opacity: 0.5;
    cursor: not-allowed;
  }

  button[data-active='true']:disabled > wui-text {
    color: var(--wui-color-fg-200);
  }

  button[data-active='false']:disabled > wui-text {
    color: var(--wui-color-fg-300);
  }

  button > wui-icon,
  button > wui-text {
    pointer-events: none;
    transition: all var(--wui-ease-out-power-2) var(--wui-duration-lg);
  }

  button {
    width: var(--local-tab-width);
  }

  :host([data-type='flex']) > button {
    width: 34px;
    position: relative;
    display: flex;
    justify-content: flex-start;
  }

  button:hover:enabled,
  button:active:enabled {
    background-color: transparent !important;
  }

  button:hover:enabled > wui-icon,
  button:active:enabled > wui-icon {
    color: var(--wui-color-fg-125);
  }

  button:hover:enabled > wui-text,
  button:active:enabled > wui-text {
    color: var(--wui-color-fg-125);
  }

  button {
    border-radius: var(--wui-border-radius-3xl);
  }
`;var ln=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let un=class extends n.oi{constructor(){super(...arguments),this.tabs=[],this.onTabChange=()=>null,this.buttons=[],this.disabled=!1,this.activeTab=0,this.localTabWidth="100px",this.isDense=!1}render(){return this.isDense=this.tabs.length>3,this.style.cssText=`\n      --local-tab: ${this.activeTab};\n      --local-tab-width: ${this.localTabWidth};\n    `,this.dataset.type=this.isDense?"flex":"block",this.tabs.map(((e,t)=>{const r=t===this.activeTab;return n.dy`
        <button
          ?disabled=${this.disabled}
          @click=${()=>this.onTabClick(t)}
          data-active=${r}
        >
          <wui-icon size="sm" color="inherit" name=${e.icon}></wui-icon>
          <wui-text variant="small-600" color="inherit"> ${e.label} </wui-text>
        </button>
      `}))}firstUpdated(){this.shadowRoot&&this.isDense&&(this.buttons=[...this.shadowRoot.querySelectorAll("button")],setTimeout((()=>{this.animateTabs(0,!0)}),0))}onTabClick(e){this.buttons&&this.animateTabs(e,!1),this.activeTab=e,this.onTabChange(e)}animateTabs(e,t){const r=this.buttons[this.activeTab],n=this.buttons[e],i=r?.querySelector("wui-text"),o=n?.querySelector("wui-text"),a=n?.getBoundingClientRect(),s=o?.getBoundingClientRect();r&&i&&!t&&e!==this.activeTab&&(i.animate([{opacity:0}],{duration:50,easing:"ease",fill:"forwards"}),r.animate([{width:"34px"}],{duration:500,easing:"ease",fill:"forwards"})),n&&a&&s&&o&&(e!==this.activeTab||t)&&(this.localTabWidth=`${Math.round(a.width+s.width)+6}px`,n.animate([{width:`${a.width+s.width}px`}],{duration:t?0:500,fill:"forwards",easing:"ease"}),o.animate([{opacity:1}],{duration:t?0:125,delay:t?0:200,fill:"forwards",easing:"ease"}))}};un.styles=[d,h,cn],ln([(0,b.Cb)({type:Array})],un.prototype,"tabs",void 0),ln([(0,b.Cb)()],un.prototype,"onTabChange",void 0),ln([(0,b.Cb)({type:Array})],un.prototype,"buttons",void 0),ln([(0,b.Cb)({type:Boolean})],un.prototype,"disabled",void 0),ln([(0,b.SB)()],un.prototype,"activeTab",void 0),ln([(0,b.SB)()],un.prototype,"localTabWidth",void 0),ln([(0,b.SB)()],un.prototype,"isDense",void 0),un=ln([f("wui-tabs")],un);const dn=n.iv`
  :host {
    display: block;
    padding: 9px var(--wui-spacing-s) 10px var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xxs);
    background-color: var(--wui-color-fg-100);
    color: var(--wui-color-bg-100);
    position: relative;
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
  }

  wui-icon[data-placement='top'] {
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 95%);
  }

  wui-icon[data-placement='bottom'] {
    top: 0;
    left: 50%;
    transform: translate(-50%, -95%) rotate(180deg);
  }

  wui-icon[data-placement='right'] {
    top: 50%;
    left: 0;
    transform: translate(-65%, -50%) rotate(90deg);
  }

  wui-icon[data-placement='left'] {
    top: 50%;
    right: 0%;
    transform: translate(65%, -50%) rotate(270deg);
  }
`;var hn=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let pn=class extends n.oi{constructor(){super(...arguments),this.placement="top",this.message=""}render(){return n.dy`<wui-icon
        data-placement=${this.placement}
        color="fg-100"
        size="inherit"
        name="cursor"
      ></wui-icon>
      <wui-text color="inherit" variant="small-500">${this.message}</wui-text>`}};pn.styles=[d,h,dn],hn([(0,b.Cb)()],pn.prototype,"placement",void 0),hn([(0,b.Cb)()],pn.prototype,"message",void 0),pn=hn([f("wui-tooltip")],pn);const fn=n.iv`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 64px;
    box-shadow: 0 0 0 8px var(--wui-thumbnail-border);
    border-radius: var(--local-border-radius);
    overflow: hidden;
  }

  wui-icon {
    width: 32px;
    height: 32px;
  }
`;var gn=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let wn=class extends n.oi{render(){return this.style.cssText=`--local-border-radius: ${this.borderRadiusFull?"1000px":"20px"};`,n.dy`${this.templateVisual()}`}templateVisual(){return this.imageSrc?n.dy`<wui-image src=${this.imageSrc} alt=${this.alt??""}></wui-image>`:n.dy`<wui-icon
      data-parent-size="md"
      size="inherit"
      color="inherit"
      name="walletPlaceholder"
    ></wui-icon>`}};wn.styles=[d,fn],gn([(0,b.Cb)()],wn.prototype,"imageSrc",void 0),gn([(0,b.Cb)()],wn.prototype,"alt",void 0),gn([(0,b.Cb)({type:Boolean})],wn.prototype,"borderRadiusFull",void 0),wn=gn([f("wui-visual-thumbnail")],wn);const bn=n.iv`
  :host {
    display: grid;
    width: inherit;
    height: inherit;
  }
`;var mn=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let yn=class extends n.oi{render(){return this.style.cssText=`\n      grid-template-rows: ${this.gridTemplateRows};\n      grid-template-columns: ${this.gridTemplateColumns};\n      justify-items: ${this.justifyItems};\n      align-items: ${this.alignItems};\n      justify-content: ${this.justifyContent};\n      align-content: ${this.alignContent};\n      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};\n      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};\n      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};\n      padding-top: ${this.padding&&rt.getSpacingStyles(this.padding,0)};\n      padding-right: ${this.padding&&rt.getSpacingStyles(this.padding,1)};\n      padding-bottom: ${this.padding&&rt.getSpacingStyles(this.padding,2)};\n      padding-left: ${this.padding&&rt.getSpacingStyles(this.padding,3)};\n      margin-top: ${this.margin&&rt.getSpacingStyles(this.margin,0)};\n      margin-right: ${this.margin&&rt.getSpacingStyles(this.margin,1)};\n      margin-bottom: ${this.margin&&rt.getSpacingStyles(this.margin,2)};\n      margin-left: ${this.margin&&rt.getSpacingStyles(this.margin,3)};\n    `,n.dy`<slot></slot>`}};yn.styles=[d,bn],mn([(0,b.Cb)()],yn.prototype,"gridTemplateRows",void 0),mn([(0,b.Cb)()],yn.prototype,"gridTemplateColumns",void 0),mn([(0,b.Cb)()],yn.prototype,"justifyItems",void 0),mn([(0,b.Cb)()],yn.prototype,"alignItems",void 0),mn([(0,b.Cb)()],yn.prototype,"justifyContent",void 0),mn([(0,b.Cb)()],yn.prototype,"alignContent",void 0),mn([(0,b.Cb)()],yn.prototype,"columnGap",void 0),mn([(0,b.Cb)()],yn.prototype,"rowGap",void 0),mn([(0,b.Cb)()],yn.prototype,"gap",void 0),mn([(0,b.Cb)()],yn.prototype,"padding",void 0),mn([(0,b.Cb)()],yn.prototype,"margin",void 0),yn=mn([f("wui-grid")],yn);const vn=n.iv`
  :host {
    position: relative;
    display: flex;
    width: 100%;
    height: 1px;
    background-color: var(--wui-gray-glass-005);
    justify-content: center;
    align-items: center;
  }

  :host > wui-text {
    position: absolute;
    padding: 0px 10px;
    background-color: var(--wui-color-bg-125);
  }
`;var xn=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Cn=class extends n.oi{constructor(){super(...arguments),this.text=""}render(){return n.dy`${this.template()}`}template(){return this.text?n.dy`<wui-text variant="small-500" color="fg-200">${this.text}</wui-text>`:null}};Cn.styles=[d,vn],xn([(0,b.Cb)()],Cn.prototype,"text",void 0),Cn=xn([f("wui-separator")],Cn);var kn=r(248);const En=["receive","deposit","borrow","claim"],Pn=["withdraw","repay","burn"],$n={getTransactionGroupTitle:e=>e===kn.E.getYear()?"This Year":e,getTransactionImages(e){const[t,r]=e,n=Boolean(t)&&e?.every((e=>Boolean(e.nft_info))),i=e?.length>1;return 2!==e?.length||n?i?e.map((e=>this.getTransactionImage(e))):[this.getTransactionImage(t)]:[this.getTransactionImage(t),this.getTransactionImage(r)]},getTransactionImage:e=>({type:$n.getTransactionTransferTokenType(e),url:$n.getTransactionImageURL(e)}),getTransactionImageURL(e){let t=null;const r=Boolean(e?.nft_info),n=Boolean(e?.fungible_info);return e&&r?t=e?.nft_info?.content?.preview?.url:e&&n&&(t=e?.fungible_info?.icon?.url),t},getTransactionTransferTokenType:e=>e?.fungible_info?"FUNGIBLE":e?.nft_info?"NFT":null,getTransactionDescriptions(e){const t=e.metadata?.operationType,r=e.transfers,n=e.transfers?.length>0,i=e.transfers?.length>1,o=n&&r?.every((e=>Boolean(e.fungible_info))),[a,s]=r;let c=this.getTransferDescription(a),l=this.getTransferDescription(s);if(!n)return"send"!==t&&"receive"!==t||!o?[e.metadata.status]:(c=rt.getTruncateString({string:e.metadata.sentFrom,charsStart:4,charsEnd:6,truncate:"middle"}),l=rt.getTruncateString({string:e.metadata.sentTo,charsStart:4,charsEnd:6,truncate:"middle"}),[c,l]);if(i)return r.map((e=>this.getTransferDescription(e)));let u="";return En.includes(t)?u="+":Pn.includes(t)&&(u="-"),c=u.concat(c),[c]},getTransferDescription(e){let t="";return e?(e?.nft_info?t=e?.nft_info?.name||"-":e?.fungible_info&&(t=this.getFungibleTransferDescription(e)||"-"),t):t},getFungibleTransferDescription(e){return e?[this.getQuantityFixedValue(e?.quantity.numeric),e?.fungible_info?.symbol].join(" ").trim():null},getQuantityFixedValue:e=>e?parseFloat(e).toFixed(3):null}},3692:(e,t,r)=>{"use strict";r.d(t,{Jb:()=>$,Ld:()=>S,YP:()=>P,_$LH:()=>z,dy:()=>E,sY:()=>F});const n=globalThis,i=n.trustedTypes,o=i?i.createPolicy("lit-html",{createHTML:e=>e}):void 0,a="$lit$",s=`lit$${(Math.random()+"").slice(9)}$`,c="?"+s,l=`<${c}>`,u=document,d=()=>u.createComment(""),h=e=>null===e||"object"!=typeof e&&"function"!=typeof e,p=Array.isArray,f=e=>p(e)||"function"==typeof e?.[Symbol.iterator],g="[ \t\n\f\r]",w=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,b=/-->/g,m=/>/g,y=RegExp(`>|${g}(?:([^\\s"'>=/]+)(${g}*=${g}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),v=/'/g,x=/"/g,C=/^(?:script|style|textarea|title)$/i,k=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),E=k(1),P=k(2),$=Symbol.for("lit-noChange"),S=Symbol.for("lit-nothing"),_=new WeakMap,A=u.createTreeWalker(u,129);function I(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==o?o.createHTML(t):t}const O=(e,t)=>{const r=e.length-1,n=[];let i,o=2===t?"<svg>":"",c=w;for(let t=0;t<r;t++){const r=e[t];let u,d,h=-1,p=0;for(;p<r.length&&(c.lastIndex=p,d=c.exec(r),null!==d);)p=c.lastIndex,c===w?"!--"===d[1]?c=b:void 0!==d[1]?c=m:void 0!==d[2]?(C.test(d[2])&&(i=RegExp("</"+d[2],"g")),c=y):void 0!==d[3]&&(c=y):c===y?">"===d[0]?(c=i??w,h=-1):void 0===d[1]?h=-2:(h=c.lastIndex-d[2].length,u=d[1],c=void 0===d[3]?y:'"'===d[3]?x:v):c===x||c===v?c=y:c===b||c===m?c=w:(c=y,i=void 0);const f=c===y&&e[t+1].startsWith("/>")?" ":"";o+=c===w?r+l:h>=0?(n.push(u),r.slice(0,h)+a+r.slice(h)+s+f):r+s+(-2===h?t:f)}return[I(e,o+(e[r]||"<?>")+(2===t?"</svg>":"")),n]};class T{constructor({strings:e,_$litType$:t},r){let n;this.parts=[];let o=0,l=0;const u=e.length-1,h=this.parts,[p,f]=O(e,t);if(this.el=T.createElement(p,r),A.currentNode=this.el.content,2===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(n=A.nextNode())&&h.length<u;){if(1===n.nodeType){if(n.hasAttributes())for(const e of n.getAttributeNames())if(e.endsWith(a)){const t=f[l++],r=n.getAttribute(e).split(s),i=/([.?@])?(.*)/.exec(t);h.push({type:1,index:o,name:i[2],strings:r,ctor:"."===i[1]?M:"?"===i[1]?U:"@"===i[1]?L:B}),n.removeAttribute(e)}else e.startsWith(s)&&(h.push({type:6,index:o}),n.removeAttribute(e));if(C.test(n.tagName)){const e=n.textContent.split(s),t=e.length-1;if(t>0){n.textContent=i?i.emptyScript:"";for(let r=0;r<t;r++)n.append(e[r],d()),A.nextNode(),h.push({type:2,index:++o});n.append(e[t],d())}}}else if(8===n.nodeType)if(n.data===c)h.push({type:2,index:o});else{let e=-1;for(;-1!==(e=n.data.indexOf(s,e+1));)h.push({type:7,index:o}),e+=s.length-1}o++}}static createElement(e,t){const r=u.createElement("template");return r.innerHTML=e,r}}function N(e,t,r=e,n){if(t===$)return t;let i=void 0!==n?r._$Co?.[n]:r._$Cl;const o=h(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),void 0===o?i=void 0:(i=new o(e),i._$AT(e,r,n)),void 0!==n?(r._$Co??=[])[n]=i:r._$Cl=i),void 0!==i&&(t=N(e,i._$AS(e,t.values),i,n)),t}class R{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:r}=this._$AD,n=(e?.creationScope??u).importNode(t,!0);A.currentNode=n;let i=A.nextNode(),o=0,a=0,s=r[0];for(;void 0!==s;){if(o===s.index){let t;2===s.type?t=new j(i,i.nextSibling,this,e):1===s.type?t=new s.ctor(i,s.name,s.strings,this,e):6===s.type&&(t=new D(i,this,e)),this._$AV.push(t),s=r[++a]}o!==s?.index&&(i=A.nextNode(),o++)}return A.currentNode=u,n}p(e){let t=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}class j{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,n){this.type=2,this._$AH=S,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=N(this,e,t),h(e)?e===S||null==e||""===e?(this._$AH!==S&&this._$AR(),this._$AH=S):e!==this._$AH&&e!==$&&this._(e):void 0!==e._$litType$?this.g(e):void 0!==e.nodeType?this.$(e):f(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==S&&h(this._$AH)?this._$AA.nextSibling.data=e:this.$(u.createTextNode(e)),this._$AH=e}g(e){const{values:t,_$litType$:r}=e,n="number"==typeof r?this._$AC(e):(void 0===r.el&&(r.el=T.createElement(I(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===n)this._$AH.p(t);else{const e=new R(n,this),r=e.u(this.options);e.p(t),this.$(r),this._$AH=e}}_$AC(e){let t=_.get(e.strings);return void 0===t&&_.set(e.strings,t=new T(e)),t}T(e){p(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,n=0;for(const i of e)n===t.length?t.push(r=new j(this.k(d()),this.k(d()),this,this.options)):r=t[n],r._$AI(i),n++;n<t.length&&(this._$AR(r&&r._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e&&e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class B{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,n,i){this.type=1,this._$AH=S,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=i,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=S}_$AI(e,t=this,r,n){const i=this.strings;let o=!1;if(void 0===i)e=N(this,e,t,0),o=!h(e)||e!==this._$AH&&e!==$,o&&(this._$AH=e);else{const n=e;let a,s;for(e=i[0],a=0;a<i.length-1;a++)s=N(this,n[r+a],t,a),s===$&&(s=this._$AH[a]),o||=!h(s)||s!==this._$AH[a],s===S?e=S:e!==S&&(e+=(s??"")+i[a+1]),this._$AH[a]=s}o&&!n&&this.O(e)}O(e){e===S?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class M extends B{constructor(){super(...arguments),this.type=3}O(e){this.element[this.name]=e===S?void 0:e}}class U extends B{constructor(){super(...arguments),this.type=4}O(e){this.element.toggleAttribute(this.name,!!e&&e!==S)}}class L extends B{constructor(e,t,r,n,i){super(e,t,r,n,i),this.type=5}_$AI(e,t=this){if((e=N(this,e,t,0)??S)===$)return;const r=this._$AH,n=e===S&&r!==S||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,i=e!==S&&(r===S||n);n&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class D{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){N(this,e)}}const z={j:a,P:s,A:c,C:1,M:O,L:R,R:f,V:N,D:j,I:B,H:U,N:L,U:M,B:D},W=n.litHtmlPolyfillSupport;W?.(T,j),(n.litHtmlVersions??=[]).push("3.1.0");const F=(e,t,r)=>{const n=r?.renderBefore??t;let i=n._$litPart$;if(void 0===i){const e=r?.renderBefore??null;n._$litPart$=i=new j(t.insertBefore(d(),e),e,void 0,r??{})}return i._$AI(e),i}},3215:(e,t,r)=>{"use strict";r.d(t,{Cb:()=>a,SB:()=>s});var n=r(2202);const i={attribute:!0,type:String,converter:n.Ts,reflect:!1,hasChanged:n.Qu},o=(e=i,t,r)=>{const{kind:n,metadata:o}=r;let a=globalThis.litPropertyMetadata.get(o);if(void 0===a&&globalThis.litPropertyMetadata.set(o,a=new Map),a.set(r.name,e),"accessor"===n){const{name:n}=r;return{set(r){const i=t.get.call(this);t.set.call(this,r),this.requestUpdate(n,i,e)},init(t){return void 0!==t&&this.C(n,void 0,e),t}}}if("setter"===n){const{name:n}=r;return function(r){const i=this[n];t.call(this,r),this.requestUpdate(n,i,e)}}throw Error("Unsupported decorator location: "+n)};function a(e){return(t,r)=>"object"==typeof r?o(e,t,r):((e,t,r)=>{const n=t.hasOwnProperty(r);return t.constructor.createProperty(r,n?{...e,wrapped:!0}:e),n?Object.getOwnPropertyDescriptor(t,r):void 0})(e,t,r)}function s(e){return a({...e,state:!0,attribute:!1})}},796:(e,t,r)=>{"use strict";r.d(t,{o:()=>i});var n=r(3692);const i=e=>e??n.Ld},7229:(e,t,r)=>{"use strict";r.d(t,{oi:()=>_,iv:()=>u,dy:()=>n.dy,YP:()=>n.YP,$m:()=>l}),r(2202);var n=r(3692);const i=globalThis,o=i.ShadowRoot&&(void 0===i.ShadyCSS||i.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,a=Symbol(),s=new WeakMap;class c{constructor(e,t,r){if(this._$cssResult$=!0,r!==a)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(o&&void 0===e){const r=void 0!==t&&1===t.length;r&&(e=s.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&s.set(t,e))}return e}toString(){return this.cssText}}const l=e=>new c("string"==typeof e?e:e+"",void 0,a),u=(e,...t)=>{const r=1===e.length?e[0]:t.reduce(((t,r,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[n+1]),e[0]);return new c(r,e,a)},d=(e,t)=>{if(o)e.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const r of t){const t=document.createElement("style"),n=i.litNonce;void 0!==n&&t.setAttribute("nonce",n),t.textContent=r.cssText,e.appendChild(t)}},h=o?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return l(t)})(e):e,{is:p,defineProperty:f,getOwnPropertyDescriptor:g,getOwnPropertyNames:w,getOwnPropertySymbols:b,getPrototypeOf:m}=Object,y=globalThis,v=y.trustedTypes,x=v?v.emptyScript:"",C=y.reactiveElementPolyfillSupport,k=(e,t)=>e,E={toAttribute(e,t){switch(t){case Boolean:e=e?x:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=null!==e;break;case Number:r=null===e?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch(e){r=null}}return r}},P=(e,t)=>!p(e,t),$={attribute:!0,type:String,converter:E,reflect:!1,hasChanged:P};Symbol.metadata??=Symbol("metadata"),y.litPropertyMetadata??=new WeakMap;class S extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),n=this.getPropertyDescriptor(e,r,t);void 0!==n&&f(this.prototype,e,n)}}static getPropertyDescriptor(e,t,r){const{get:n,set:i}=g(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get(){return n?.call(this)},set(t){const o=n?.call(this);i.call(this,t),this.requestUpdate(e,o,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(k("elementProperties")))return;const e=m(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(k("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(k("properties"))){const e=this.properties,t=[...w(e),...b(e)];for(const r of t)this.createProperty(r,e[r])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,r]of t)this.elementProperties.set(e,r)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const r=this._$Eu(e,t);void 0!==r&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const e of r)t.unshift(h(e))}else void 0!==e&&t.push(h(e));return t}static _$Eu(e,t){const r=t.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$Eg=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$ES(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$E_??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$E_?.delete(e)}_$ES(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return d(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$E_?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$E_?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$EO(e,t){const r=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,r);if(void 0!==n&&!0===r.reflect){const i=(void 0!==r.converter?.toAttribute?r.converter:E).toAttribute(t,r.type);this._$Em=e,null==i?this.removeAttribute(n):this.setAttribute(n,i),this._$Em=null}}_$AK(e,t){const r=this.constructor,n=r._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=r.getPropertyOptions(n),i="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:E;this._$Em=n,this[n]=i.fromAttribute(t,e.type),this._$Em=null}}requestUpdate(e,t,r,n=!1,i){if(void 0!==e){if(r??=this.constructor.getPropertyOptions(e),!(r.hasChanged??P)(n?i:this[e],t))return;this.C(e,t,r)}!1===this.isUpdatePending&&(this._$Eg=this._$EP())}C(e,t,r){this._$AL.has(e)||this._$AL.set(e,t),!0===r.reflect&&this._$Em!==e&&(this._$Ej??=new Set).add(e)}async _$EP(){this.isUpdatePending=!0;try{await this._$Eg}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,r]of e)!0!==r.wrapped||this._$AL.has(t)||void 0===this[t]||this.C(t,this[t],r)}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$E_?.forEach((e=>e.hostUpdate?.())),this.update(t)):this._$ET()}catch(t){throw e=!1,this._$ET(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$E_?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$ET(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Eg}shouldUpdate(e){return!0}update(e){this._$Ej&&=this._$Ej.forEach((e=>this._$EO(e,this[e]))),this._$ET()}updated(e){}firstUpdated(e){}}S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[k("elementProperties")]=new Map,S[k("finalized")]=new Map,C?.({ReactiveElement:S}),(y.reactiveElementVersions??=[]).push("2.0.2");class _ extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=(0,n.sY)(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return n.Jb}}_._$litElement$=!0,_.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:_});const A=globalThis.litElementPolyfillSupport;A?.({LitElement:_}),(globalThis.litElementVersions??=[]).push("4.0.2")},2202:(e,t,r)=>{"use strict";r.d(t,{Ts:()=>x,Qu:()=>C});const n=globalThis,i=n.ShadowRoot&&(void 0===n.ShadyCSS||n.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),a=new WeakMap;class s{constructor(e,t,r){if(this._$cssResult$=!0,r!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const r=void 0!==t&&1===t.length;r&&(e=a.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&a.set(t,e))}return e}toString(){return this.cssText}}const c=(e,t)=>{if(i)e.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const r of t){const t=document.createElement("style"),i=n.litNonce;void 0!==i&&t.setAttribute("nonce",i),t.textContent=r.cssText,e.appendChild(t)}},l=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return(e=>new s("string"==typeof e?e:e+"",void 0,o))(t)})(e):e,{is:u,defineProperty:d,getOwnPropertyDescriptor:h,getOwnPropertyNames:p,getOwnPropertySymbols:f,getPrototypeOf:g}=Object,w=globalThis,b=w.trustedTypes,m=b?b.emptyScript:"",y=w.reactiveElementPolyfillSupport,v=(e,t)=>e,x={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=null!==e;break;case Number:r=null===e?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch(e){r=null}}return r}},C=(e,t)=>!u(e,t),k={attribute:!0,type:String,converter:x,reflect:!1,hasChanged:C};Symbol.metadata??=Symbol("metadata"),w.litPropertyMetadata??=new WeakMap;class E extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=k){if(t.state&&(t.attribute=!1),this._$Ei(),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),n=this.getPropertyDescriptor(e,r,t);void 0!==n&&d(this.prototype,e,n)}}static getPropertyDescriptor(e,t,r){const{get:n,set:i}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get(){return n?.call(this)},set(t){const o=n?.call(this);i.call(this,t),this.requestUpdate(e,o,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??k}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=g(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...p(e),...f(e)];for(const r of t)this.createProperty(r,e[r])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,r]of t)this.elementProperties.set(e,r)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const r=this._$Eu(e,t);void 0!==r&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const e of r)t.unshift(l(e))}else void 0!==e&&t.push(l(e));return t}static _$Eu(e,t){const r=t.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$Eg=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$ES(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$E_??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$E_?.delete(e)}_$ES(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return c(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$E_?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$E_?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$EO(e,t){const r=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,r);if(void 0!==n&&!0===r.reflect){const i=(void 0!==r.converter?.toAttribute?r.converter:x).toAttribute(t,r.type);this._$Em=e,null==i?this.removeAttribute(n):this.setAttribute(n,i),this._$Em=null}}_$AK(e,t){const r=this.constructor,n=r._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=r.getPropertyOptions(n),i="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:x;this._$Em=n,this[n]=i.fromAttribute(t,e.type),this._$Em=null}}requestUpdate(e,t,r,n=!1,i){if(void 0!==e){if(r??=this.constructor.getPropertyOptions(e),!(r.hasChanged??C)(n?i:this[e],t))return;this.C(e,t,r)}!1===this.isUpdatePending&&(this._$Eg=this._$EP())}C(e,t,r){this._$AL.has(e)||this._$AL.set(e,t),!0===r.reflect&&this._$Em!==e&&(this._$Ej??=new Set).add(e)}async _$EP(){this.isUpdatePending=!0;try{await this._$Eg}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,r]of e)!0!==r.wrapped||this._$AL.has(t)||void 0===this[t]||this.C(t,this[t],r)}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$E_?.forEach((e=>e.hostUpdate?.())),this.update(t)):this._$ET()}catch(t){throw e=!1,this._$ET(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$E_?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$ET(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Eg}shouldUpdate(e){return!0}update(e){this._$Ej&&=this._$Ej.forEach((e=>this._$EO(e,this[e]))),this._$ET()}updated(e){}firstUpdated(e){}}E.elementStyles=[],E.shadowRootOptions={mode:"open"},E[v("elementProperties")]=new Map,E[v("finalized")]=new Map,y?.({ReactiveElement:E}),(w.reactiveElementVersions??=[]).push("2.0.2")},3160:(e,t,r)=>{"use strict";r.d(t,{E:()=>i});var n=r(6867);function i(e=0){return null!=globalThis.Buffer&&null!=globalThis.Buffer.allocUnsafe?(0,n.P)(globalThis.Buffer.allocUnsafe(e)):new Uint8Array(e)}},605:(e,t,r)=>{"use strict";r.d(t,{z:()=>o});var n=r(3160),i=r(6867);function o(e,t){t||(t=e.reduce(((e,t)=>e+t.length),0));const r=(0,n.E)(t);let o=0;for(const t of e)r.set(t,o),o+=t.length;return(0,i.P)(r)}},2217:(e,t,r)=>{"use strict";r.d(t,{m:()=>o});var n=r(5114),i=r(6867);function o(e,t="utf8"){const r=n.Z[t];if(!r)throw new Error(`Unsupported encoding "${t}"`);return"utf8"!==t&&"utf-8"!==t||null==globalThis.Buffer||null==globalThis.Buffer.from?r.decoder.decode(`${r.prefix}${e}`):(0,i.P)(globalThis.Buffer.from(e,"utf-8"))}},7466:(e,t,r)=>{"use strict";r.d(t,{BB:()=>o.B,mL:()=>i.m,zo:()=>n.z});var n=r(605),i=r(2217),o=r(2263)},2263:(e,t,r)=>{"use strict";r.d(t,{B:()=>i});var n=r(5114);function i(e,t="utf8"){const r=n.Z[t];if(!r)throw new Error(`Unsupported encoding "${t}"`);return"utf8"!==t&&"utf-8"!==t||null==globalThis.Buffer||null==globalThis.Buffer.from?r.encoder.encode(e).substring(1):globalThis.Buffer.from(e.buffer,e.byteOffset,e.byteLength).toString("utf8")}},6867:(e,t,r)=>{"use strict";function n(e){return null!=globalThis.Buffer?new Uint8Array(e.buffer,e.byteOffset,e.byteLength):e}r.d(t,{P:()=>n})},5114:(e,t,r)=>{"use strict";r.d(t,{Z:()=>ze});var n={};r.r(n),r.d(n,{identity:()=>S});var i={};r.r(i),r.d(i,{base2:()=>_});var o={};r.r(o),r.d(o,{base8:()=>A});var a={};r.r(a),r.d(a,{base10:()=>I});var s={};r.r(s),r.d(s,{base16:()=>O,base16upper:()=>T});var c={};r.r(c),r.d(c,{base32:()=>N,base32hex:()=>M,base32hexpad:()=>L,base32hexpadupper:()=>D,base32hexupper:()=>U,base32pad:()=>j,base32padupper:()=>B,base32upper:()=>R,base32z:()=>z});var l={};r.r(l),r.d(l,{base36:()=>W,base36upper:()=>F});var u={};r.r(u),r.d(u,{base58btc:()=>H,base58flickr:()=>G});var d={};r.r(d),r.d(d,{base64:()=>q,base64pad:()=>Z,base64url:()=>V,base64urlpad:()=>Y});var h={};r.r(h),r.d(h,{base256emoji:()=>Q});var p={};r.r(p),r.d(p,{sha256:()=>xe,sha512:()=>Ce});var f={};r.r(f),r.d(f,{identity:()=>Ee});var g={};r.r(g),r.d(g,{code:()=>$e,decode:()=>_e,encode:()=>Se,name:()=>Pe});var w={};r.r(w),r.d(w,{code:()=>Te,decode:()=>Re,encode:()=>Ne,name:()=>Oe});const b=function(e,t){if(e.length>=255)throw new TypeError("Alphabet too long");for(var r=new Uint8Array(256),n=0;n<r.length;n++)r[n]=255;for(var i=0;i<e.length;i++){var o=e.charAt(i),a=o.charCodeAt(0);if(255!==r[a])throw new TypeError(o+" is ambiguous");r[a]=i}var s=e.length,c=e.charAt(0),l=Math.log(s)/Math.log(256),u=Math.log(256)/Math.log(s);function d(e){if("string"!=typeof e)throw new TypeError("Expected String");if(0===e.length)return new Uint8Array;var t=0;if(" "!==e[t]){for(var n=0,i=0;e[t]===c;)n++,t++;for(var o=(e.length-t)*l+1>>>0,a=new Uint8Array(o);e[t];){var u=r[e.charCodeAt(t)];if(255===u)return;for(var d=0,h=o-1;(0!==u||d<i)&&-1!==h;h--,d++)u+=s*a[h]>>>0,a[h]=u%256>>>0,u=u/256>>>0;if(0!==u)throw new Error("Non-zero carry");i=d,t++}if(" "!==e[t]){for(var p=o-i;p!==o&&0===a[p];)p++;for(var f=new Uint8Array(n+(o-p)),g=n;p!==o;)f[g++]=a[p++];return f}}}return{encode:function(t){if(t instanceof Uint8Array||(ArrayBuffer.isView(t)?t=new Uint8Array(t.buffer,t.byteOffset,t.byteLength):Array.isArray(t)&&(t=Uint8Array.from(t))),!(t instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(0===t.length)return"";for(var r=0,n=0,i=0,o=t.length;i!==o&&0===t[i];)i++,r++;for(var a=(o-i)*u+1>>>0,l=new Uint8Array(a);i!==o;){for(var d=t[i],h=0,p=a-1;(0!==d||h<n)&&-1!==p;p--,h++)d+=256*l[p]>>>0,l[p]=d%s>>>0,d=d/s>>>0;if(0!==d)throw new Error("Non-zero carry");n=h,i++}for(var f=a-n;f!==a&&0===l[f];)f++;for(var g=c.repeat(r);f<a;++f)g+=e.charAt(l[f]);return g},decodeUnsafe:d,decode:function(e){var r=d(e);if(r)return r;throw new Error(`Non-${t} character`)}}},m=(new Uint8Array(0),e=>{if(e instanceof Uint8Array&&"Uint8Array"===e.constructor.name)return e;if(e instanceof ArrayBuffer)return new Uint8Array(e);if(ArrayBuffer.isView(e))return new Uint8Array(e.buffer,e.byteOffset,e.byteLength);throw new Error("Unknown type, must be binary type")});class y{constructor(e,t,r){this.name=e,this.prefix=t,this.baseEncode=r}encode(e){if(e instanceof Uint8Array)return`${this.prefix}${this.baseEncode(e)}`;throw Error("Unknown type, must be binary type")}}class v{constructor(e,t,r){if(this.name=e,this.prefix=t,void 0===t.codePointAt(0))throw new Error("Invalid prefix character");this.prefixCodePoint=t.codePointAt(0),this.baseDecode=r}decode(e){if("string"==typeof e){if(e.codePointAt(0)!==this.prefixCodePoint)throw Error(`Unable to decode multibase string ${JSON.stringify(e)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);return this.baseDecode(e.slice(this.prefix.length))}throw Error("Can only multibase decode strings")}or(e){return C(this,e)}}class x{constructor(e){this.decoders=e}or(e){return C(this,e)}decode(e){const t=e[0],r=this.decoders[t];if(r)return r.decode(e);throw RangeError(`Unable to decode multibase string ${JSON.stringify(e)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`)}}const C=(e,t)=>new x({...e.decoders||{[e.prefix]:e},...t.decoders||{[t.prefix]:t}});class k{constructor(e,t,r,n){this.name=e,this.prefix=t,this.baseEncode=r,this.baseDecode=n,this.encoder=new y(e,t,r),this.decoder=new v(e,t,n)}encode(e){return this.encoder.encode(e)}decode(e){return this.decoder.decode(e)}}const E=({name:e,prefix:t,encode:r,decode:n})=>new k(e,t,r,n),P=({prefix:e,name:t,alphabet:r})=>{const{encode:n,decode:i}=b(r,t);return E({prefix:e,name:t,encode:n,decode:e=>m(i(e))})},$=({name:e,prefix:t,bitsPerChar:r,alphabet:n})=>E({prefix:t,name:e,encode:e=>((e,t,r)=>{const n="="===t[t.length-1],i=(1<<r)-1;let o="",a=0,s=0;for(let n=0;n<e.length;++n)for(s=s<<8|e[n],a+=8;a>r;)a-=r,o+=t[i&s>>a];if(a&&(o+=t[i&s<<r-a]),n)for(;o.length*r&7;)o+="=";return o})(e,n,r),decode:t=>((e,t,r,n)=>{const i={};for(let e=0;e<t.length;++e)i[t[e]]=e;let o=e.length;for(;"="===e[o-1];)--o;const a=new Uint8Array(o*r/8|0);let s=0,c=0,l=0;for(let t=0;t<o;++t){const o=i[e[t]];if(void 0===o)throw new SyntaxError(`Non-${n} character`);c=c<<r|o,s+=r,s>=8&&(s-=8,a[l++]=255&c>>s)}if(s>=r||255&c<<8-s)throw new SyntaxError("Unexpected end of data");return a})(t,n,r,e)}),S=E({prefix:"\0",name:"identity",encode:e=>{return t=e,(new TextDecoder).decode(t);var t},decode:e=>(e=>(new TextEncoder).encode(e))(e)}),_=$({prefix:"0",name:"base2",alphabet:"01",bitsPerChar:1}),A=$({prefix:"7",name:"base8",alphabet:"01234567",bitsPerChar:3}),I=P({prefix:"9",name:"base10",alphabet:"0123456789"}),O=$({prefix:"f",name:"base16",alphabet:"0123456789abcdef",bitsPerChar:4}),T=$({prefix:"F",name:"base16upper",alphabet:"0123456789ABCDEF",bitsPerChar:4}),N=$({prefix:"b",name:"base32",alphabet:"abcdefghijklmnopqrstuvwxyz234567",bitsPerChar:5}),R=$({prefix:"B",name:"base32upper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",bitsPerChar:5}),j=$({prefix:"c",name:"base32pad",alphabet:"abcdefghijklmnopqrstuvwxyz234567=",bitsPerChar:5}),B=$({prefix:"C",name:"base32padupper",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",bitsPerChar:5}),M=$({prefix:"v",name:"base32hex",alphabet:"0123456789abcdefghijklmnopqrstuv",bitsPerChar:5}),U=$({prefix:"V",name:"base32hexupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV",bitsPerChar:5}),L=$({prefix:"t",name:"base32hexpad",alphabet:"0123456789abcdefghijklmnopqrstuv=",bitsPerChar:5}),D=$({prefix:"T",name:"base32hexpadupper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",bitsPerChar:5}),z=$({prefix:"h",name:"base32z",alphabet:"ybndrfg8ejkmcpqxot1uwisza345h769",bitsPerChar:5}),W=P({prefix:"k",name:"base36",alphabet:"0123456789abcdefghijklmnopqrstuvwxyz"}),F=P({prefix:"K",name:"base36upper",alphabet:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"}),H=P({name:"base58btc",prefix:"z",alphabet:"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"}),G=P({name:"base58flickr",prefix:"Z",alphabet:"123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"}),q=$({prefix:"m",name:"base64",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",bitsPerChar:6}),Z=$({prefix:"M",name:"base64pad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",bitsPerChar:6}),V=$({prefix:"u",name:"base64url",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",bitsPerChar:6}),Y=$({prefix:"U",name:"base64urlpad",alphabet:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",bitsPerChar:6}),K=Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂"),X=K.reduce(((e,t,r)=>(e[r]=t,e)),[]),J=K.reduce(((e,t,r)=>(e[t.codePointAt(0)]=r,e)),[]),Q=E({prefix:"🚀",name:"base256emoji",encode:function(e){return e.reduce(((e,t)=>e+X[t]),"")},decode:function(e){const t=[];for(const r of e){const e=J[r.codePointAt(0)];if(void 0===e)throw new Error(`Non-base256emoji character: ${r}`);t.push(e)}return new Uint8Array(t)}});var ee=128,te=-128,re=Math.pow(2,31),ne=Math.pow(2,7),ie=Math.pow(2,14),oe=Math.pow(2,21),ae=Math.pow(2,28),se=Math.pow(2,35),ce=Math.pow(2,42),le=Math.pow(2,49),ue=Math.pow(2,56),de=Math.pow(2,63);const he=function e(t,r,n){r=r||[];for(var i=n=n||0;t>=re;)r[n++]=255&t|ee,t/=128;for(;t&te;)r[n++]=255&t|ee,t>>>=7;return r[n]=0|t,e.bytes=n-i+1,r},pe=function(e){return e<ne?1:e<ie?2:e<oe?3:e<ae?4:e<se?5:e<ce?6:e<le?7:e<ue?8:e<de?9:10},fe=(e,t,r=0)=>(he(e,t,r),t),ge=e=>pe(e),we=(e,t)=>{const r=t.byteLength,n=ge(e),i=n+ge(r),o=new Uint8Array(i+r);return fe(e,o,0),fe(r,o,n),o.set(t,i),new be(e,r,t,o)};class be{constructor(e,t,r,n){this.code=e,this.size=t,this.digest=r,this.bytes=n}}const me=({name:e,code:t,encode:r})=>new ye(e,t,r);class ye{constructor(e,t,r){this.name=e,this.code=t,this.encode=r}digest(e){if(e instanceof Uint8Array){const t=this.encode(e);return t instanceof Uint8Array?we(this.code,t):t.then((e=>we(this.code,e)))}throw Error("Unknown type, must be binary type")}}const ve=e=>async t=>new Uint8Array(await crypto.subtle.digest(e,t)),xe=me({name:"sha2-256",code:18,encode:ve("SHA-256")}),Ce=me({name:"sha2-512",code:19,encode:ve("SHA-512")}),ke=m,Ee={code:0,name:"identity",encode:ke,digest:e=>we(0,ke(e))},Pe="raw",$e=85,Se=e=>m(e),_e=e=>m(e),Ae=new TextEncoder,Ie=new TextDecoder,Oe="json",Te=512,Ne=e=>Ae.encode(JSON.stringify(e)),Re=e=>JSON.parse(Ie.decode(e));class je{constructor(e,t,r,n){this.code=t,this.version=e,this.multihash=r,this.bytes=n,this.byteOffset=n.byteOffset,this.byteLength=n.byteLength,this.asCID=this,this._baseCache=new Map,Object.defineProperties(this,{byteOffset:cid_hidden,byteLength:cid_hidden,code:readonly,version:readonly,multihash:readonly,bytes:readonly,_baseCache:cid_hidden,asCID:cid_hidden})}toV0(){if(0===this.version)return this;{const{code:e,multihash:t}=this;if(e!==DAG_PB_CODE)throw new Error("Cannot convert a non dag-pb CID to CIDv0");if(t.code!==SHA_256_CODE)throw new Error("Cannot convert non sha2-256 multihash CID to CIDv0");return je.createV0(t)}}toV1(){switch(this.version){case 0:{const{code:e,digest:t}=this.multihash,r=Digest.create(e,t);return je.createV1(this.code,r)}case 1:return this;default:throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`)}}equals(e){return e&&this.code===e.code&&this.version===e.version&&Digest.equals(this.multihash,e.multihash)}toString(e){const{bytes:t,version:r,_baseCache:n}=this;return 0===r?toStringV0(t,n,e||base58btc.encoder):toStringV1(t,n,e||base32.encoder)}toJSON(){return{code:this.code,version:this.version,hash:this.multihash.bytes}}get[Symbol.toStringTag](){return"CID"}[Symbol.for("nodejs.util.inspect.custom")](){return"CID("+this.toString()+")"}static isCID(e){return deprecate(/^0\.0/,IS_CID_DEPRECATION),!(!e||!e[cidSymbol]&&e.asCID!==e)}get toBaseEncodedString(){throw new Error("Deprecated, use .toString()")}get codec(){throw new Error('"codec" property is deprecated, use integer "code" property instead')}get buffer(){throw new Error("Deprecated .buffer property, use .bytes to get Uint8Array instead")}get multibaseName(){throw new Error('"multibaseName" property is deprecated')}get prefix(){throw new Error('"prefix" property is deprecated')}static asCID(e){if(e instanceof je)return e;if(null!=e&&e.asCID===e){const{version:t,code:r,multihash:n,bytes:i}=e;return new je(t,r,n,i||encodeCID(t,r,n.bytes))}if(null!=e&&!0===e[cidSymbol]){const{version:t,multihash:r,code:n}=e,i=Digest.decode(r);return je.create(t,n,i)}return null}static create(e,t,r){if("number"!=typeof t)throw new Error("String codecs are no longer supported");switch(e){case 0:if(t!==DAG_PB_CODE)throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`);return new je(e,t,r,r.bytes);case 1:{const n=encodeCID(e,t,r.bytes);return new je(e,t,r,n)}default:throw new Error("Invalid version")}}static createV0(e){return je.create(0,DAG_PB_CODE,e)}static createV1(e,t){return je.create(1,e,t)}static decode(e){const[t,r]=je.decodeFirst(e);if(r.length)throw new Error("Incorrect length");return t}static decodeFirst(e){const t=je.inspectBytes(e),r=t.size-t.multihashSize,n=coerce(e.subarray(r,r+t.multihashSize));if(n.byteLength!==t.multihashSize)throw new Error("Incorrect length");const i=n.subarray(t.multihashSize-t.digestSize),o=new Digest.Digest(t.multihashCode,t.digestSize,i,n);return[0===t.version?je.createV0(o):je.createV1(t.codec,o),e.subarray(t.size)]}static inspectBytes(e){const t=()=>{const[t,r]=varint.decode(e.subarray(0));return t};let r=t(),n=DAG_PB_CODE;if(18===r||1===r&&t(),0!==r&&1!==r)throw new RangeError(`Invalid CID version ${r}`);const i=t(),o=t(),a=0+o;return{version:r,codec:n,multihashCode:i,digestSize:o,multihashSize:a-0,size:a}}static parse(e,t){const[r,n]=parseCIDtoBytes(e,t),i=je.decode(n);return i._baseCache.set(r,e),i}}Symbol.for("@ipld/js-cid/CID");const Be={...n,...i,...o,...a,...s,...c,...l,...u,...d,...h};var Me=r(3160);function Ue(e,t,r,n){return{name:e,prefix:t,encoder:{name:e,prefix:t,encode:r},decoder:{decode:n}}}const Le=Ue("utf8","u",(e=>"u"+new TextDecoder("utf8").decode(e)),(e=>(new TextEncoder).encode(e.substring(1)))),De=Ue("ascii","a",(e=>{let t="a";for(let r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return t}),(e=>{e=e.substring(1);const t=(0,Me.E)(e.length);for(let r=0;r<e.length;r++)t[r]=e.charCodeAt(r);return t})),ze={utf8:Le,"utf-8":Le,hex:Be.base16,latin1:De,ascii:De,binary:De,...Be}},6828:(e,t,r)=>{"use strict";r.d(t,{sj:()=>d,iH:()=>f,CO:()=>p,Ld:()=>h}),Symbol();const n=Symbol(),i=Object.getPrototypeOf,o=new WeakMap,a=(e,t=!0)=>{o.set(e,t)},s=e=>"object"==typeof e&&null!==e,c=new WeakMap,l=new WeakSet,[u]=((e=Object.is,t=((e,t)=>new Proxy(e,t)),r=(e=>s(e)&&!l.has(e)&&(Array.isArray(e)||!(Symbol.iterator in e))&&!(e instanceof WeakMap)&&!(e instanceof WeakSet)&&!(e instanceof Error)&&!(e instanceof Number)&&!(e instanceof Date)&&!(e instanceof String)&&!(e instanceof RegExp)&&!(e instanceof ArrayBuffer)),u=(e=>{switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:throw e}}),d=new WeakMap,h=((e,t,r=u)=>{const n=d.get(e);if((null==n?void 0:n[0])===t)return n[1];const i=Array.isArray(e)?[]:Object.create(Object.getPrototypeOf(e));return a(i,!0),d.set(e,[t,i]),Reflect.ownKeys(e).forEach((t=>{if(Object.getOwnPropertyDescriptor(i,t))return;const n=Reflect.get(e,t),o={value:n,enumerable:!0,configurable:!0};if(l.has(n))a(n,!1);else if(n instanceof Promise)delete o.value,o.get=()=>r(n);else if(c.has(n)){const[e,t]=c.get(n);o.value=h(e,t(),r)}Object.defineProperty(i,t,o)})),Object.preventExtensions(i)}),p=new WeakMap,f=[1,1],g=(a=>{if(!s(a))throw new Error("object required");const u=p.get(a);if(u)return u;let d=f[0];const w=new Set,b=(e,t=++f[0])=>{d!==t&&(d=t,w.forEach((r=>r(e,t))))};let m=f[1];const y=e=>(t,r)=>{const n=[...t];n[1]=[e,...n[1]],b(n,r)},v=new Map,x=e=>{var t;const r=v.get(e);r&&(v.delete(e),null==(t=r[1])||t.call(r))},C=Array.isArray(a)?[]:Object.create(Object.getPrototypeOf(a)),k=t(C,{deleteProperty(e,t){const r=Reflect.get(e,t);x(t);const n=Reflect.deleteProperty(e,t);return n&&b(["delete",[t],r]),n},set(t,a,u,d){const h=Reflect.has(t,a),f=Reflect.get(t,a,d);if(h&&(e(f,u)||p.has(u)&&e(f,p.get(u))))return!0;var m;x(a),s(u)&&(u=(e=>e&&(o.has(e)?o.get(e):i(e)===Object.prototype||i(e)===Array.prototype))(m=u)&&m[n]||null||u);let C=u;if(u instanceof Promise)u.then((e=>{u.status="fulfilled",u.value=e,b(["resolve",[a],e])})).catch((e=>{u.status="rejected",u.reason=e,b(["reject",[a],e])}));else{!c.has(u)&&r(u)&&(C=g(u));const e=!l.has(C)&&c.get(C);e&&((e,t)=>{if(v.has(e))throw new Error("prop listener already exists");if(w.size){const r=t[3](y(e));v.set(e,[t,r])}else v.set(e,[t])})(a,e)}return Reflect.set(t,a,C,d),b(["set",[a],u,f]),!0}});p.set(a,k);const E=[C,(e=++f[1])=>(m===e||w.size||(m=e,v.forEach((([t])=>{const r=t[1](e);r>d&&(d=r)}))),d),h,e=>(w.add(e),1===w.size&&v.forEach((([e,t],r)=>{if(t)throw new Error("remove already exists");const n=e[3](y(r));v.set(r,[e,n])})),()=>{w.delete(e),0===w.size&&v.forEach((([e,t],r)=>{t&&(t(),v.set(r,[e]))}))})];return c.set(k,E),Reflect.ownKeys(a).forEach((e=>{const t=Object.getOwnPropertyDescriptor(a,e);"value"in t&&(k[e]=a[e],delete t.value,delete t.writable),Object.defineProperty(C,e,t)})),k}))=>[g,c,l,e,t,r,u,d,h,p,f])();function d(e={}){return u(e)}function h(e,t,r){const n=c.get(e);let i;n||console.warn("Please use proxy object");const o=[],a=n[3];let s=!1;const l=a((e=>{o.push(e),r?t(o.splice(0)):i||(i=Promise.resolve().then((()=>{i=void 0,s&&t(o.splice(0))})))}));return s=!0,()=>{s=!1,l()}}function p(e,t){const r=c.get(e);r||console.warn("Please use proxy object");const[n,i,o]=r;return o(n,i(),t)}function f(e){return l.add(e),e}},4503:(e,t,r)=>{"use strict";function n(e){return"string"==typeof e?{address:e,type:"json-rpc"}:e}r.d(t,{T:()=>n})},84:(e,t,r)=>{"use strict";r.d(t,{R:()=>y});var n=r(4503),i=r(6693);const o="0x82ad56cb";var a=r(2027),s=r(377),c=r(5980),l=r(7210),u=r(7799),d=r(7864),h=r(2106),p=r(6445),f=r(7469),g=r(1163),w=r(4688),b=r(2357),m=r(7531);async function y(e,t){const{account:y=e.account,batch:v=Boolean(e.batch?.multicall),blockNumber:x,blockTag:C="latest",accessList:k,data:E,gas:P,gasPrice:$,maxFeePerGas:S,maxPriorityFeePerGas:_,nonce:A,to:I,value:O,...T}=t,N=y?(0,n.T)(y):void 0;try{(0,m.F)(t);const r=(x?(0,h.eC)(x):void 0)||C,n=e.chain?.formatters?.transactionRequest?.format,a=(n||w.tG)({...(0,g.K)(T,{format:n}),from:N?.address,accessList:k,data:E,gas:P,gasPrice:$,maxFeePerGas:S,maxPriorityFeePerGas:_,nonce:A,to:I,value:O});if(v&&function({request:e}){const{data:t,to:r,...n}=e;return!(!t||t.startsWith(o)||!r||Object.values(n).filter((e=>void 0!==e)).length>0)}({request:a}))try{return await async function(e,t){const{batchSize:r=1024,wait:n=0}="object"==typeof e.batch?.multicall?e.batch.multicall:{},{blockNumber:o,blockTag:a="latest",data:p,multicallAddress:f,to:g}=t;let w=f;if(!w){if(!e.chain)throw new s.pZ;w=(0,d.L)({blockNumber:o,chain:e.chain,contract:"multicall3"})}const m=(o?(0,h.eC)(o):void 0)||a,{schedule:y}=(0,b.S)({id:`${e.uid}.${m}`,wait:n,shouldSplitBatch(e){const t=e.reduce(((e,{data:t})=>e+(t.length-2)),0);return t>2*r},fn:async t=>{const r=t.map((e=>({allowFailure:!0,callData:e.data,target:e.to}))),n=(0,u.R)({abi:i.F8,args:[r],functionName:"aggregate3"}),o=await e.request({method:"eth_call",params:[{data:n,to:w},m]});return(0,l.k)({abi:i.F8,args:[r],functionName:"aggregate3",data:o||"0x"})}}),[{returnData:v,success:x}]=await y({data:p,to:g});if(!x)throw new c.VQ({data:v});return"0x"===v?{data:void 0}:{data:v}}(e,{...a,blockNumber:x,blockTag:C})}catch(e){if(!(e instanceof s.pZ||e instanceof s.mm))throw e}const p=await e.request({method:"eth_call",params:r?[a,r]:[a]});return"0x"===p?{data:void 0}:{data:p}}catch(n){const i=function(e){if(!(e instanceof a.G))return;const t=e.walk();return"object"==typeof t.data?t.data.data:t.data}(n),{offchainLookup:o,offchainLookupSignature:s}=await r.e(770).then(r.bind(r,9770));if(i?.slice(0,10)===s&&I)return{data:await o(e,{data:i,to:I})};throw function(e,{docsPath:t,...r}){const n=(()=>{const t=(0,f.k)(e,r);return t instanceof p.cj?e:t})();return new c.cg(n,{docsPath:t,...r})}(n,{...t,account:N,chain:e.chain})}}},6693:(e,t,r)=>{"use strict";r.d(t,{$o:()=>l,F8:()=>n,X$:()=>c,du:()=>a,k3:()=>o,nZ:()=>s});const n=[{inputs:[{components:[{name:"target",type:"address"},{name:"allowFailure",type:"bool"},{name:"callData",type:"bytes"}],name:"calls",type:"tuple[]"}],name:"aggregate3",outputs:[{components:[{name:"success",type:"bool"},{name:"returnData",type:"bytes"}],name:"returnData",type:"tuple[]"}],stateMutability:"view",type:"function"}],i=[{inputs:[],name:"ResolverNotFound",type:"error"},{inputs:[],name:"ResolverWildcardNotSupported",type:"error"}],o=[...i,{name:"resolve",type:"function",stateMutability:"view",inputs:[{name:"name",type:"bytes"},{name:"data",type:"bytes"}],outputs:[{name:"",type:"bytes"},{name:"address",type:"address"}]}],a=[...i,{name:"reverse",type:"function",stateMutability:"view",inputs:[{type:"bytes",name:"reverseName"}],outputs:[{type:"string",name:"resolvedName"},{type:"address",name:"resolvedAddress"},{type:"address",name:"reverseResolver"},{type:"address",name:"resolver"}]}],s=[{name:"text",type:"function",stateMutability:"view",inputs:[{name:"name",type:"bytes32"},{name:"key",type:"string"}],outputs:[{name:"",type:"string"}]}],c=[{name:"addr",type:"function",stateMutability:"view",inputs:[{name:"name",type:"bytes32"}],outputs:[{name:"",type:"address"}]},{name:"addr",type:"function",stateMutability:"view",inputs:[{name:"name",type:"bytes32"},{name:"coinType",type:"uint256"}],outputs:[{name:"",type:"bytes"}]}],l=[{inputs:[{internalType:"address",name:"_signer",type:"address"},{internalType:"bytes32",name:"_hash",type:"bytes32"},{internalType:"bytes",name:"_signature",type:"bytes"}],stateMutability:"nonpayable",type:"constructor"}]},1746:(e,t,r)=>{"use strict";r.d(t,{$:()=>n,Up:()=>i,hZ:()=>o});const n={1:"An `assert` condition failed.",17:"Arithmic operation resulted in underflow or overflow.",18:"Division or modulo by zero (e.g. `5 / 0` or `23 % 0`).",33:"Attempted to convert to an invalid type.",34:"Attempted to access a storage byte array that is incorrectly encoded.",49:"Performed `.pop()` on an empty array",50:"Array index is out of bounds.",65:"Allocated too much memory or created an array which is too large.",81:"Attempted to call a zero-initialized variable of internal function type."},i={inputs:[{name:"message",type:"string"}],name:"Error",type:"error"},o={inputs:[{name:"reason",type:"uint256"}],name:"Panic",type:"error"}},4192:(e,t,r)=>{"use strict";r.d(t,{Bd:()=>o,Zn:()=>i,ez:()=>n});const n={gwei:9,wei:18},i={ether:-9,wei:9},o={ether:-18,gwei:-9}},7412:(e,t,r)=>{"use strict";r.d(t,{CI:()=>k,FM:()=>f,Gy:()=>x,KY:()=>y,M4:()=>d,MX:()=>m,SM:()=>v,cO:()=>s,dh:()=>C,fM:()=>a,fs:()=>h,gr:()=>u,hn:()=>E,lC:()=>g,mv:()=>w,wM:()=>P,wb:()=>l,xB:()=>c,xL:()=>b,yP:()=>p});var n=r(522),i=r(9135),o=r(2027);class a extends o.G{constructor({docsPath:e}){super(["A constructor was not found on the ABI.","Make sure you are using the correct ABI and that the constructor exists on it."].join("\n"),{docsPath:e}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"AbiConstructorNotFoundError"})}}class s extends o.G{constructor({docsPath:e}){super(["Constructor arguments were provided (`args`), but a constructor parameters (`inputs`) were not found on the ABI.","Make sure you are using the correct ABI, and that the `inputs` attribute on the constructor exists."].join("\n"),{docsPath:e}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"AbiConstructorParamsNotFoundError"})}}class c extends o.G{constructor({data:e,params:t,size:r}){super([`Data size of ${r} bytes is too small for given parameters.`].join("\n"),{metaMessages:[`Params: (${(0,n.h)(t,{includeName:!0})})`,`Data:   ${e} (${r} bytes)`]}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"AbiDecodingDataSizeTooSmallError"}),Object.defineProperty(this,"data",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"params",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"size",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.data=e,this.params=t,this.size=r}}class l extends o.G{constructor(){super('Cannot decode zero data ("0x") with ABI parameters.'),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"AbiDecodingZeroDataError"})}}class u extends o.G{constructor({expectedLength:e,givenLength:t,type:r}){super([`ABI encoding array length mismatch for type ${r}.`,`Expected length: ${e}`,`Given length: ${t}`].join("\n")),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"AbiEncodingArrayLengthMismatchError"})}}class d extends o.G{constructor({expectedSize:e,value:t}){super(`Size of bytes "${t}" (bytes${(0,i.d)(t)}) does not match expected size (bytes${e}).`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"AbiEncodingBytesSizeMismatchError"})}}class h extends o.G{constructor({expectedLength:e,givenLength:t}){super(["ABI encoding params/values length mismatch.",`Expected length (params): ${e}`,`Given length (values): ${t}`].join("\n")),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"AbiEncodingLengthMismatchError"})}}class p extends o.G{constructor(e,{docsPath:t}){super([`Encoded error signature "${e}" not found on ABI.`,"Make sure you are using the correct ABI and that the error exists on it.",`You can look up the decoded signature here: https://openchain.xyz/signatures?query=${e}.`].join("\n"),{docsPath:t}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"AbiErrorSignatureNotFoundError"}),Object.defineProperty(this,"signature",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.signature=e}}class f extends o.G{constructor({docsPath:e}){super("Cannot extract event signature from empty topics.",{docsPath:e}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"AbiEventSignatureEmptyTopicsError"})}}class g extends o.G{constructor(e,{docsPath:t}){super([`Encoded event signature "${e}" not found on ABI.`,"Make sure you are using the correct ABI and that the event exists on it.",`You can look up the signature here: https://openchain.xyz/signatures?query=${e}.`].join("\n"),{docsPath:t}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"AbiEventSignatureNotFoundError"})}}class w extends o.G{constructor(e,{docsPath:t}={}){super([`Event ${e?`"${e}" `:""}not found on ABI.`,"Make sure you are using the correct ABI and that the event exists on it."].join("\n"),{docsPath:t}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"AbiEventNotFoundError"})}}class b extends o.G{constructor(e,{docsPath:t}={}){super([`Function ${e?`"${e}" `:""}not found on ABI.`,"Make sure you are using the correct ABI and that the function exists on it."].join("\n"),{docsPath:t}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"AbiFunctionNotFoundError"})}}class m extends o.G{constructor(e,{docsPath:t}){super([`Function "${e}" does not contain any \`outputs\` on ABI.`,"Cannot decode function result without knowing what the parameter types are.","Make sure you are using the correct ABI and that the function exists on it."].join("\n"),{docsPath:t}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"AbiFunctionOutputsNotFoundError"})}}class y extends o.G{constructor({expectedSize:e,givenSize:t}){super(`Expected bytes${e}, got bytes${t}.`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"BytesSizeMismatchError"})}}class v extends o.G{constructor({abiItem:e,data:t,params:r,size:i}){super([`Data size of ${i} bytes is too small for non-indexed event parameters.`].join("\n"),{metaMessages:[`Params: (${(0,n.h)(r,{includeName:!0})})`,`Data:   ${t} (${i} bytes)`]}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"DecodeLogDataMismatch"}),Object.defineProperty(this,"abiItem",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"data",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"params",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"size",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.abiItem=e,this.data=t,this.params=r,this.size=i}}class x extends o.G{constructor({abiItem:e,param:t}){super([`Expected a topic for indexed event parameter${t.name?` "${t.name}"`:""} on event "${(0,n.t)(e,{includeName:!0})}".`].join("\n")),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"DecodeLogTopicsMismatch"}),Object.defineProperty(this,"abiItem",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.abiItem=e}}class C extends o.G{constructor(e,{docsPath:t}){super([`Type "${e}" is not a valid encoding type.`,"Please provide a valid ABI type."].join("\n"),{docsPath:t}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"InvalidAbiEncodingType"})}}class k extends o.G{constructor(e,{docsPath:t}){super([`Type "${e}" is not a valid decoding type.`,"Please provide a valid ABI type."].join("\n"),{docsPath:t}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"InvalidAbiDecodingType"})}}class E extends o.G{constructor(e){super([`Value "${e}" is not a valid array.`].join("\n")),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"InvalidArrayError"})}}class P extends o.G{constructor(e){super([`"${e}" is not a valid definition type.`,'Valid types: "function", "event", "error"'].join("\n")),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"InvalidDefinitionTypeError"})}}},6087:(e,t,r)=>{"use strict";r.d(t,{b:()=>i});var n=r(2027);class i extends n.G{constructor({address:e}){super(`Address "${e}" is invalid.`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"InvalidAddressError"})}}},2027:(e,t,r)=>{"use strict";r.d(t,{G:()=>i});var n=r(8673);class i extends Error{constructor(e,t={}){super(),Object.defineProperty(this,"details",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"docsPath",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"metaMessages",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"shortMessage",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ViemError"}),Object.defineProperty(this,"version",{enumerable:!0,configurable:!0,writable:!0,value:(0,n.bo)()});const r=t.cause instanceof i?t.cause.details:t.cause?.message?t.cause.message:t.details,o=t.cause instanceof i&&t.cause.docsPath||t.docsPath;this.message=[e||"An error occurred.","",...t.metaMessages?[...t.metaMessages,""]:[],...o?[`Docs: https://viem.sh${o}.html${t.docsSlug?`#${t.docsSlug}`:""}`]:[],...r?[`Details: ${r}`]:[],`Version: ${this.version}`].join("\n"),t.cause&&(this.cause=t.cause),this.details=r,this.docsPath=o,this.metaMessages=t.metaMessages,this.shortMessage=e}walk(e){return o(this,e)}}function o(e,t){return t?.(e)?e:e&&"object"==typeof e&&"cause"in e?o(e.cause,t):t?null:e}},377:(e,t,r)=>{"use strict";r.d(t,{Bk:()=>a,Yl:()=>o,mm:()=>i,pZ:()=>s});var n=r(2027);class i extends n.G{constructor({blockNumber:e,chain:t,contract:r}){super(`Chain "${t.name}" does not support contract "${r.name}".`,{metaMessages:["This could be due to any of the following:",...e&&r.blockCreated&&r.blockCreated>e?[`- The contract "${r.name}" was not deployed until block ${r.blockCreated} (current block ${e}).`]:[`- The chain does not have the contract "${r.name}" configured.`]]}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ChainDoesNotSupportContract"})}}class o extends n.G{constructor({chain:e,currentChainId:t}){super(`The current chain of the wallet (id: ${t}) does not match the target chain for the transaction (id: ${e.id} – ${e.name}).`,{metaMessages:[`Current Chain ID:  ${t}`,`Expected Chain ID: ${e.id} – ${e.name}`]}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ChainMismatchError"})}}class a extends n.G{constructor(){super(["No chain was provided to the request.","Please provide a chain with the `chain` argument on the Action, or by supplying a `chain` to WalletClient."].join("\n")),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ChainNotFoundError"})}}class s extends n.G{constructor(){super("No chain was provided to the Client."),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ClientChainNotConfiguredError"})}}},5980:(e,t,r)=>{"use strict";r.d(t,{cg:()=>w,uq:()=>b,Lu:()=>m,Dk:()=>y,VQ:()=>v});var n=r(4503),i=r(1746),o=r(6899),a=r(522),s=r(6070);function c({abiItem:e,args:t,includeFunctionName:r=!0,includeName:n=!1}){if("name"in e&&"inputs"in e&&e.inputs)return`${r?e.name:""}(${e.inputs.map(((e,r)=>`${n&&e.name?`${e.name}: `:""}${"object"==typeof t[r]?(0,s.P)(t[r]):t[r]}`)).join(", ")})`}var l=r(840),u=r(9625),d=r(7795),h=r(7412),p=r(2027),f=r(3639),g=r(8673);class w extends p.G{constructor(e,{account:t,docsPath:r,chain:i,data:o,gas:a,gasPrice:s,maxFeePerGas:c,maxPriorityFeePerGas:l,nonce:h,to:p,value:g}){const w=t?(0,n.T)(t):void 0,b=(0,f.xr)({from:w?.address,to:p,value:void 0!==g&&`${(0,u.d)(g)} ${i?.nativeCurrency?.symbol||"ETH"}`,data:o,gas:a,gasPrice:void 0!==s&&`${(0,d.o)(s)} gwei`,maxFeePerGas:void 0!==c&&`${(0,d.o)(c)} gwei`,maxPriorityFeePerGas:void 0!==l&&`${(0,d.o)(l)} gwei`,nonce:h});super(e.shortMessage,{cause:e,docsPath:r,metaMessages:[...e.metaMessages?[...e.metaMessages," "]:[],"Raw Call Arguments:",b].filter(Boolean)}),Object.defineProperty(this,"cause",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"CallExecutionError"}),this.cause=e}}class b extends p.G{constructor(e,{abi:t,args:r,contractAddress:n,docsPath:i,functionName:o,sender:s}){const u=(0,l.m)({abi:t,args:r,name:o}),d=u?c({abiItem:u,args:r,includeFunctionName:!1,includeName:!1}):void 0,h=u?(0,a.t)(u,{includeName:!0}):void 0,p=(0,f.xr)({address:n&&(0,g.CR)(n),function:h,args:d&&"()"!==d&&`${[...Array(o?.length??0).keys()].map((()=>" ")).join("")}${d}`,sender:s});super(e.shortMessage||`An unknown error occurred while executing the contract function "${o}".`,{cause:e,docsPath:i,metaMessages:[...e.metaMessages?[...e.metaMessages," "]:[],"Contract Call:",p].filter(Boolean)}),Object.defineProperty(this,"abi",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"args",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"cause",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"contractAddress",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"formattedArgs",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"functionName",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"sender",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ContractFunctionExecutionError"}),this.abi=t,this.args=r,this.cause=e,this.contractAddress=n,this.functionName=o,this.sender=s}}class m extends p.G{constructor({abi:e,data:t,functionName:r,message:n}){let s,l,u,d,p;if(t&&"0x"!==t)try{l=(0,o.p)({abi:e,data:t});const{abiItem:r,errorName:n,args:s}=l;if("Error"===n)d=s[0];else if("Panic"===n){const[e]=s;d=i.$[e]}else{const e=r?(0,a.t)(r,{includeName:!0}):void 0,t=r&&s?c({abiItem:r,args:s,includeFunctionName:!1,includeName:!1}):void 0;u=[e?`Error: ${e}`:"",t&&"()"!==t?`       ${[...Array(n?.length??0).keys()].map((()=>" ")).join("")}${t}`:""]}}catch(e){s=e}else n&&(d=n);s instanceof h.yP&&(p=s.signature,u=[`Unable to decode signature "${p}" as it was not found on the provided ABI.`,"Make sure you are using the correct ABI and that the error exists on it.",`You can look up the decoded signature here: https://openchain.xyz/signatures?query=${p}.`]),super(d&&"execution reverted"!==d||p?[`The contract function "${r}" reverted with the following ${p?"signature":"reason"}:`,d||p].join("\n"):`The contract function "${r}" reverted.`,{cause:s,metaMessages:u}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ContractFunctionRevertedError"}),Object.defineProperty(this,"data",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"reason",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"signature",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.data=l,this.reason=d,this.signature=p}}class y extends p.G{constructor({functionName:e}){super(`The contract function "${e}" returned no data ("0x").`,{metaMessages:["This could be due to any of the following:",`  - The contract does not have the function "${e}",`,"  - The parameters passed to the contract function may be invalid, or","  - The address is not a contract."]}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ContractFunctionZeroDataError"})}}class v extends p.G{constructor({data:e,message:t}){super(t||""),Object.defineProperty(this,"code",{enumerable:!0,configurable:!0,writable:!0,value:3}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"RawContractError"}),Object.defineProperty(this,"data",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.data=e}}},9760:(e,t,r)=>{"use strict";r.d(t,{$:()=>o,m:()=>i});var n=r(2027);class i extends n.G{constructor({offset:e,position:t,size:r}){super(`Slice ${"start"===t?"starting":"ending"} at offset "${e}" is out-of-bounds (size: ${r}).`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"SliceOffsetOutOfBoundsError"})}}class o extends n.G{constructor({size:e,targetSize:t,type:r}){super(`${r.charAt(0).toUpperCase()}${r.slice(1).toLowerCase()} size (${e}) exceeds padding size (${t}).`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"SizeExceedsPaddingSizeError"})}}},7788:(e,t,r)=>{"use strict";r.d(t,{Cd:()=>o,J5:()=>i,M6:()=>a});var n=r(2027);class i extends n.G{constructor({max:e,min:t,signed:r,size:n,value:i}){super(`Number "${i}" is not in safe ${n?`${8*n}-bit ${r?"signed":"unsigned"} `:""}integer range ${e?`(${t} to ${e})`:`(above ${t})`}`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"IntegerOutOfRangeError"})}}class o extends n.G{constructor(e){super(`Hex value "${e}" is not a valid boolean. The hex value must be "0x0" (false) or "0x1" (true).`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"InvalidHexBooleanError"})}}class a extends n.G{constructor({givenSize:e,maxSize:t}){super(`Size cannot exceed ${t} bytes. Given size: ${e} bytes.`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"SizeOverflowError"})}}},6445:(e,t,r)=>{"use strict";r.d(t,{C_:()=>d,G$:()=>s,Hh:()=>a,M_:()=>o,WF:()=>h,ZI:()=>c,cj:()=>w,cs:()=>g,dR:()=>p,pZ:()=>f,se:()=>u,vU:()=>l});var n=r(7795),i=r(2027);class o extends i.G{constructor({cause:e,message:t}={}){const r=t?.replace("execution reverted: ","")?.replace("execution reverted","");super(`Execution reverted ${r?`with reason: ${r}`:"for an unknown reason"}.`,{cause:e}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ExecutionRevertedError"})}}Object.defineProperty(o,"code",{enumerable:!0,configurable:!0,writable:!0,value:3}),Object.defineProperty(o,"nodeMessage",{enumerable:!0,configurable:!0,writable:!0,value:/execution reverted/});class a extends i.G{constructor({cause:e,maxFeePerGas:t}={}){super(`The fee cap (\`maxFeePerGas\`${t?` = ${(0,n.o)(t)} gwei`:""}) cannot be higher than the maximum allowed value (2^256-1).`,{cause:e}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"FeeCapTooHigh"})}}Object.defineProperty(a,"nodeMessage",{enumerable:!0,configurable:!0,writable:!0,value:/max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/});class s extends i.G{constructor({cause:e,maxFeePerGas:t}={}){super(`The fee cap (\`maxFeePerGas\`${t?` = ${(0,n.o)(t)}`:""} gwei) cannot be lower than the block base fee.`,{cause:e}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"FeeCapTooLow"})}}Object.defineProperty(s,"nodeMessage",{enumerable:!0,configurable:!0,writable:!0,value:/max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/});class c extends i.G{constructor({cause:e,nonce:t}={}){super(`Nonce provided for the transaction ${t?`(${t}) `:""}is higher than the next one expected.`,{cause:e}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"NonceTooHighError"})}}Object.defineProperty(c,"nodeMessage",{enumerable:!0,configurable:!0,writable:!0,value:/nonce too high/});class l extends i.G{constructor({cause:e,nonce:t}={}){super([`Nonce provided for the transaction ${t?`(${t}) `:""}is lower than the current nonce of the account.`,"Try increasing the nonce or find the latest nonce with `getTransactionCount`."].join("\n"),{cause:e}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"NonceTooLowError"})}}Object.defineProperty(l,"nodeMessage",{enumerable:!0,configurable:!0,writable:!0,value:/nonce too low|transaction already imported|already known/});class u extends i.G{constructor({cause:e,nonce:t}={}){super(`Nonce provided for the transaction ${t?`(${t}) `:""}exceeds the maximum allowed nonce.`,{cause:e}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"NonceMaxValueError"})}}Object.defineProperty(u,"nodeMessage",{enumerable:!0,configurable:!0,writable:!0,value:/nonce has max value/});class d extends i.G{constructor({cause:e}={}){super(["The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."].join("\n"),{cause:e,metaMessages:["This error could arise when the account does not have enough funds to:"," - pay for the total gas fee,"," - pay for the value to send."," ","The cost of the transaction is calculated as `gas * gas fee + value`, where:"," - `gas` is the amount of gas needed for transaction to execute,"," - `gas fee` is the gas fee,"," - `value` is the amount of ether to send to the recipient."]}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"InsufficientFundsError"})}}Object.defineProperty(d,"nodeMessage",{enumerable:!0,configurable:!0,writable:!0,value:/insufficient funds/});class h extends i.G{constructor({cause:e,gas:t}={}){super(`The amount of gas ${t?`(${t}) `:""}provided for the transaction exceeds the limit allowed for the block.`,{cause:e}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"IntrinsicGasTooHighError"})}}Object.defineProperty(h,"nodeMessage",{enumerable:!0,configurable:!0,writable:!0,value:/intrinsic gas too high|gas limit reached/});class p extends i.G{constructor({cause:e,gas:t}={}){super(`The amount of gas ${t?`(${t}) `:""}provided for the transaction is too low.`,{cause:e}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"IntrinsicGasTooLowError"})}}Object.defineProperty(p,"nodeMessage",{enumerable:!0,configurable:!0,writable:!0,value:/intrinsic gas too low/});class f extends i.G{constructor({cause:e}){super("The transaction type is not supported for this chain.",{cause:e}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"TransactionTypeNotSupportedError"})}}Object.defineProperty(f,"nodeMessage",{enumerable:!0,configurable:!0,writable:!0,value:/transaction type not valid/});class g extends i.G{constructor({cause:e,maxPriorityFeePerGas:t,maxFeePerGas:r}={}){super([`The provided tip (\`maxPriorityFeePerGas\`${t?` = ${(0,n.o)(t)} gwei`:""}) cannot be higher than the fee cap (\`maxFeePerGas\`${r?` = ${(0,n.o)(r)} gwei`:""}).`].join("\n"),{cause:e}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"TipAboveFeeCapError"})}}Object.defineProperty(g,"nodeMessage",{enumerable:!0,configurable:!0,writable:!0,value:/max priority fee per gas higher than max fee per gas|tip higher than fee cap/});class w extends i.G{constructor({cause:e}){super(`An error occurred while executing: ${e?.shortMessage}`,{cause:e}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"UnknownNodeError"})}}},8863:(e,t,r)=>{"use strict";r.d(t,{Gg:()=>a,W5:()=>l,bs:()=>c,c9:()=>s});var n=r(6070),i=r(2027),o=r(8673);class a extends i.G{constructor({body:e,details:t,headers:r,status:i,url:a}){super("HTTP request failed.",{details:t,metaMessages:[i&&`Status: ${i}`,`URL: ${(0,o.Gr)(a)}`,e&&`Request body: ${(0,n.P)(e)}`].filter(Boolean)}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"HttpRequestError"}),Object.defineProperty(this,"body",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"headers",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"status",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"url",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.body=e,this.headers=r,this.status=i,this.url=a}}class s extends i.G{constructor({body:e,details:t,url:r}){super("WebSocket request failed.",{details:t,metaMessages:[`URL: ${(0,o.Gr)(r)}`,`Request body: ${(0,n.P)(e)}`]}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"WebSocketRequestError"})}}class c extends i.G{constructor({body:e,error:t,url:r}){super("RPC Request failed.",{cause:t,details:t.message,metaMessages:[`URL: ${(0,o.Gr)(r)}`,`Request body: ${(0,n.P)(e)}`]}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"RpcRequestError"}),Object.defineProperty(this,"code",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.code=t.code}}class l extends i.G{constructor({body:e,url:t}){super("The request took too long to respond.",{details:"The request timed out.",metaMessages:[`URL: ${(0,o.Gr)(t)}`,`Request body: ${(0,n.P)(e)}`]}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"TimeoutError"})}}},3639:(e,t,r)=>{"use strict";r.d(t,{Bh:()=>u,Yb:()=>d,j3:()=>c,mc:()=>h,mk:()=>l,xY:()=>s,xr:()=>a});var n=r(9625),i=r(7795),o=r(2027);function a(e){const t=Object.entries(e).map((([e,t])=>void 0===t||!1===t?null:[e,t])).filter(Boolean),r=t.reduce(((e,[t])=>Math.max(e,t.length)),0);return t.map((([e,t])=>`  ${`${e}:`.padEnd(r+1)}  ${t}`)).join("\n")}class s extends o.G{constructor(){super(["Cannot specify both a `gasPrice` and a `maxFeePerGas`/`maxPriorityFeePerGas`.","Use `maxFeePerGas`/`maxPriorityFeePerGas` for EIP-1559 compatible networks, and `gasPrice` for others."].join("\n")),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"FeeConflictError"})}}class c extends o.G{constructor({transaction:e}){super("Cannot infer a transaction type from provided transaction.",{metaMessages:["Provided Transaction:","{",a(e),"}","","To infer the type, either provide:","- a `type` to the Transaction, or","- an EIP-1559 Transaction with `maxFeePerGas`, or","- an EIP-2930 Transaction with `gasPrice` & `accessList`, or","- a Legacy Transaction with `gasPrice`"]}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"InvalidSerializableTransactionError"})}}class l extends o.G{constructor(e,{account:t,docsPath:r,chain:o,data:s,gas:c,gasPrice:l,maxFeePerGas:u,maxPriorityFeePerGas:d,nonce:h,to:p,value:f}){const g=a({chain:o&&`${o?.name} (id: ${o?.id})`,from:t?.address,to:p,value:void 0!==f&&`${(0,n.d)(f)} ${o?.nativeCurrency?.symbol||"ETH"}`,data:s,gas:c,gasPrice:void 0!==l&&`${(0,i.o)(l)} gwei`,maxFeePerGas:void 0!==u&&`${(0,i.o)(u)} gwei`,maxPriorityFeePerGas:void 0!==d&&`${(0,i.o)(d)} gwei`,nonce:h});super(e.shortMessage,{cause:e,docsPath:r,metaMessages:[...e.metaMessages?[...e.metaMessages," "]:[],"Request Arguments:",g].filter(Boolean)}),Object.defineProperty(this,"cause",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"TransactionExecutionError"}),this.cause=e}}class u extends o.G{constructor({blockHash:e,blockNumber:t,blockTag:r,hash:n,index:i}){let o="Transaction";r&&void 0!==i&&(o=`Transaction at block time "${r}" at index "${i}"`),e&&void 0!==i&&(o=`Transaction at block hash "${e}" at index "${i}"`),t&&void 0!==i&&(o=`Transaction at block number "${t}" at index "${i}"`),n&&(o=`Transaction with hash "${n}"`),super(`${o} could not be found.`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"TransactionNotFoundError"})}}class d extends o.G{constructor({hash:e}){super(`Transaction receipt with hash "${e}" could not be found. The Transaction may not be processed on a block yet.`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"TransactionReceiptNotFoundError"})}}class h extends o.G{constructor({hash:e}){super(`Timed out while waiting for transaction with hash "${e}" to be confirmed.`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"WaitForTransactionReceiptTimeoutError"})}}},8673:(e,t,r)=>{"use strict";r.d(t,{CR:()=>n,Gr:()=>i,bo:()=>o});const n=e=>e,i=e=>e,o=()=>"viem@1.19.12"},4450:(e,t,r)=>{"use strict";r.d(t,{r:()=>u});var n=r(7412),i=r(5775),o=r(9135),a=r(3972),s=r(1836),c=r(5946),l=r(5444);function u(e,t){if("0x"===t&&e.length>0)throw new n.wb;if((0,o.d)(t)&&(0,o.d)(t)<32)throw new n.xB({data:t,params:e,size:(0,o.d)(t)});return function({data:e,params:t}){const r=[];let i=0;for(let a=0;a<t.length;a++){if(i>=(0,o.d)(e))throw new n.xB({data:e,params:t,size:(0,o.d)(e)});const s=t[a],{consumed:c,value:l}=d({data:e,param:s,position:i});r.push(l),i+=c}return r}({data:t,params:e})}function d({data:e,param:t,position:r}){const o=(0,l.S)(t.type);if(o){const[n,i]=o;return function(e,{param:t,length:r,position:n}){if(!r){const r=(0,c.ly)((0,a.tP)(e,n,n+32,{strict:!0})),i=(0,c.ly)((0,a.tP)(e,r,r+32,{strict:!0}));let o=0;const s=[];for(let n=0;n<i;++n){const n=d({data:(0,a.tP)(e,r+32),param:t,position:o});o+=n.consumed,s.push(n.value)}return{value:s,consumed:32}}if(h(t)){const i=(0,l.S)(t.type),o=!i?.[0];let s=0;const u=[];for(let i=0;i<r;++i){const r=(0,c.ly)((0,a.tP)(e,n,n+32,{strict:!0})),l=d({data:(0,a.tP)(e,r),param:t,position:o?s:32*i});s+=l.consumed,u.push(l.value)}return{value:u,consumed:32}}let i=0;const o=[];for(let a=0;a<r;++a){const r=d({data:e,param:t,position:n+i});i+=r.consumed,o.push(r.value)}return{value:o,consumed:i}}(e,{length:n,param:{...t,type:i},position:r})}if("tuple"===t.type)return function(e,{param:t,position:r}){const n=0===t.components.length||t.components.some((({name:e})=>!e)),i=n?[]:{};let o=0;if(h(t)){const s=(0,c.ly)((0,a.tP)(e,r,r+32,{strict:!0}));for(let r=0;r<t.components.length;++r){const c=t.components[r],l=d({data:(0,a.tP)(e,s),param:c,position:o});o+=l.consumed,i[n?r:c?.name]=l.value}return{consumed:32,value:i}}for(let a=0;a<t.components.length;++a){const s=t.components[a],c=d({data:e,param:s,position:r+o});o+=c.consumed,i[n?a:s?.name]=c.value}return{consumed:o,value:i}}(e,{param:t,position:r});if("string"===t.type)return function(e,{position:t}){const r=(0,c.ly)((0,a.tP)(e,t,t+32,{strict:!0})),n=(0,c.ly)((0,a.tP)(e,r,r+32,{strict:!0}));if(0===n)return{consumed:32,value:""};return{consumed:32,value:(0,c.rR)((0,s.f)((0,a.tP)(e,r+32,r+32+n,{strict:!0})))}}(e,{position:r});if(t.type.startsWith("bytes"))return function(e,{param:t,position:r}){const[n,i]=t.type.split("bytes");if(!i){const t=(0,c.ly)((0,a.tP)(e,r,r+32,{strict:!0})),n=(0,c.ly)((0,a.tP)(e,t,t+32,{strict:!0}));return 0===n?{consumed:32,value:"0x"}:{consumed:32,value:(0,a.tP)(e,t+32,t+32+n,{strict:!0})}}return{consumed:32,value:(0,a.tP)(e,r,r+parseInt(i),{strict:!0})}}(e,{param:t,position:r});const u=(0,a.tP)(e,r,r+32,{strict:!0});if(t.type.startsWith("uint")||t.type.startsWith("int"))return function(e,{param:t}){const r=t.type.startsWith("int");return{consumed:32,value:parseInt(t.type.split("int")[1]||"256")>48?(0,c.y_)(e,{signed:r}):(0,c.ly)(e,{signed:r})}}(u,{param:t});if("address"===t.type)return function(e){return{consumed:32,value:(0,i.x)((0,a.tP)(e,-20))}}(u);if("bool"===t.type)return function(e){return{consumed:32,value:(0,c.XA)(e)}}(u);throw new n.CI(t.type,{docsPath:"/docs/contract/decodeAbiParameters"})}function h(e){const{type:t}=e;if("string"===t)return!0;if("bytes"===t)return!0;if(t.endsWith("[]"))return!0;if("tuple"===t)return e.components?.some(h);const r=(0,l.S)(e.type);return!(!r||!h({...e,type:r[1]}))}},6899:(e,t,r)=>{"use strict";r.d(t,{p:()=>l});var n=r(1746),i=r(7412),o=r(3972),a=r(552),s=r(4450),c=r(522);function l({abi:e,data:t}){const r=(0,o.tP)(t,0,4);if("0x"===r)throw new i.wb;const l=[...e||[],n.Up,n.hZ].find((e=>"error"===e.type&&r===(0,a.o)((0,c.t)(e))));if(!l)throw new i.yP(r,{docsPath:"/docs/contract/decodeErrorResult"});return{abiItem:l,args:"inputs"in l&&l.inputs&&l.inputs.length>0?(0,s.r)(l.inputs,(0,o.tP)(t,4)):void 0,errorName:l.name}}},7210:(e,t,r)=>{"use strict";r.d(t,{k:()=>s});var n=r(7412),i=r(4450),o=r(840);const a="/docs/contract/decodeFunctionResult";function s({abi:e,args:t,functionName:r,data:s}){let c=e[0];if(r&&(c=(0,o.m)({abi:e,args:t,name:r}),!c))throw new n.xL(r,{docsPath:a});if("function"!==c.type)throw new n.xL(void 0,{docsPath:a});if(!c.outputs)throw new n.MX(c.name,{docsPath:a});const l=(0,i.r)(c.outputs,s);return l&&l.length>1?l:l&&1===l.length?l[0]:void 0}},5444:(e,t,r)=>{"use strict";r.d(t,{E:()=>d,S:()=>f});var n=r(7412),i=r(6087),o=r(9321),a=r(7040),s=r(1769),c=r(9135),l=r(3972),u=r(2106);function d(e,t){if(e.length!==t.length)throw new n.fs({expectedLength:e.length,givenLength:t.length});const r=function({params:e,values:t}){const r=[];for(let n=0;n<e.length;n++)r.push(h({param:e[n],value:t[n]}));return r}({params:e,values:t}),i=p(r);return 0===i.length?"0x":i}function h({param:e,value:t}){const r=f(e.type);if(r){const[i,o]=r;return function(e,{length:t,param:r}){const i=null===t;if(!Array.isArray(e))throw new n.hn(e);if(!i&&e.length!==t)throw new n.gr({expectedLength:t,givenLength:e.length,type:`${r.type}[${t}]`});let o=!1;const s=[];for(let t=0;t<e.length;t++){const n=h({param:r,value:e[t]});n.dynamic&&(o=!0),s.push(n)}if(i||o){const e=p(s);if(i){const t=(0,u.eC)(s.length,{size:32});return{dynamic:!0,encoded:s.length>0?(0,a.zo)([t,e]):t}}if(o)return{dynamic:!0,encoded:e}}return{dynamic:!1,encoded:(0,a.zo)(s.map((({encoded:e})=>e)))}}(t,{length:i,param:{...e,type:o}})}if("tuple"===e.type)return function(e,{param:t}){let r=!1;const n=[];for(let i=0;i<t.components.length;i++){const o=t.components[i],a=h({param:o,value:e[Array.isArray(e)?i:o.name]});n.push(a),a.dynamic&&(r=!0)}return{dynamic:r,encoded:r?p(n):(0,a.zo)(n.map((({encoded:e})=>e)))}}(t,{param:e});if("address"===e.type)return function(e){if(!(0,o.U)(e))throw new i.b({address:e});return{dynamic:!1,encoded:(0,s.gc)(e.toLowerCase())}}(t);if("bool"===e.type)return function(e){return{dynamic:!1,encoded:(0,s.gc)((0,u.C4)(e))}}(t);if(e.type.startsWith("uint")||e.type.startsWith("int"))return function(e,{signed:t}){return{dynamic:!1,encoded:(0,u.eC)(e,{size:32,signed:t})}}(t,{signed:e.type.startsWith("int")});if(e.type.startsWith("bytes"))return function(e,{param:t}){const[,r]=t.type.split("bytes"),i=(0,c.d)(e);if(!r){let t=e;return i%32!=0&&(t=(0,s.gc)(t,{dir:"right",size:32*Math.ceil((e.length-2)/2/32)})),{dynamic:!0,encoded:(0,a.zo)([(0,s.gc)((0,u.eC)(i,{size:32})),t])}}if(i!==parseInt(r))throw new n.M4({expectedSize:parseInt(r),value:e});return{dynamic:!1,encoded:(0,s.gc)(e,{dir:"right"})}}(t,{param:e});if("string"===e.type)return function(e){const t=(0,u.$G)(e),r=Math.ceil((0,c.d)(t)/32),n=[];for(let e=0;e<r;e++)n.push((0,s.gc)((0,l.tP)(t,32*e,32*(e+1)),{dir:"right"}));return{dynamic:!0,encoded:(0,a.zo)([(0,s.gc)((0,u.eC)((0,c.d)(t),{size:32})),...n])}}(t);throw new n.dh(e.type,{docsPath:"/docs/contract/encodeAbiParameters"})}function p(e){let t=0;for(let r=0;r<e.length;r++){const{dynamic:n,encoded:i}=e[r];t+=n?32:(0,c.d)(i)}const r=[],n=[];let i=0;for(let o=0;o<e.length;o++){const{dynamic:a,encoded:s}=e[o];a?(r.push((0,u.eC)(t+i,{size:32})),n.push(s),i+=(0,c.d)(s)):r.push(s)}return(0,a.zo)([...r,...n])}function f(e){const t=e.match(/^(.*)\[(\d+)?\]$/);return t?[t[2]?Number(t[2]):null,t[1]]:void 0}},7799:(e,t,r)=>{"use strict";r.d(t,{R:()=>l});var n=r(7412),i=r(7040),o=r(552),a=r(5444),s=r(522),c=r(840);function l({abi:e,args:t,functionName:r}){let l=e[0];if(r&&(l=(0,c.m)({abi:e,args:t,name:r}),!l))throw new n.xL(r,{docsPath:"/docs/contract/encodeFunctionData"});if("function"!==l.type)throw new n.xL(void 0,{docsPath:"/docs/contract/encodeFunctionData"});const u=(0,s.t)(l),d=(0,o.o)(u),h="inputs"in l&&l.inputs?(0,a.E)(l.inputs,t??[]):void 0;return(0,i.SM)([d,h??"0x"])}},522:(e,t,r)=>{"use strict";r.d(t,{h:()=>o,t:()=>i});var n=r(7412);function i(e,{includeName:t=!1}={}){if("function"!==e.type&&"event"!==e.type&&"error"!==e.type)throw new n.wM(e.type);return`${e.name}(${o(e.inputs,{includeName:t})})`}function o(e,{includeName:t=!1}={}){return e?e.map((e=>function(e,{includeName:t}){return e.type.startsWith("tuple")?`(${o(e.components,{includeName:t})})${e.type.slice(5)}`:e.type+(t&&e.name?` ${e.name}`:"")}(e,{includeName:t}))).join(t?", ":","):""}},840:(e,t,r)=>{"use strict";r.d(t,{m:()=>s});var n=r(5102),i=r(4092),o=r(552),a=r(9321);function s({abi:e,args:t=[],name:r}){const a=(0,n.v)(r,{strict:!1}),s=e.filter((e=>a?"function"===e.type?(0,o.o)(e)===r:"event"===e.type&&(0,i.e)(e)===r:"name"in e&&e.name===r));if(0!==s.length){if(1===s.length)return s[0];for(const e of s)if("inputs"in e)if(t&&0!==t.length){if(e.inputs&&0!==e.inputs.length&&e.inputs.length===t.length&&t.every(((t,r)=>{const n="inputs"in e&&e.inputs[r];return!!n&&c(t,n)})))return e}else if(!e.inputs||0===e.inputs.length)return e;return s[0]}}function c(e,t){const r=typeof e,n=t.type;switch(n){case"address":return(0,a.U)(e);case"bool":return"boolean"===r;case"function":case"string":return"string"===r;default:return"tuple"===n&&"components"in t?Object.values(t.components).every(((t,r)=>c(Object.values(e)[r],t))):/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(n)?"number"===r||"bigint"===r:/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(n)?"string"===r||e instanceof Uint8Array:!!/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(n)&&Array.isArray(e)&&e.every((e=>c(e,{...t,type:n.replace(/(\[[0-9]{0,}\])$/,"")})))}}},5775:(e,t,r)=>{"use strict";r.d(t,{K:()=>c,x:()=>s});var n=r(6087),i=r(1187),o=r(3199),a=r(9321);function s(e,t){const r=t?`${t}${e.toLowerCase()}`:e.substring(2).toLowerCase(),n=(0,o.w)((0,i.qX)(r),"bytes"),a=(t?r.substring(`${t}0x`.length):r).split("");for(let e=0;e<40;e+=2)n[e>>1]>>4>=8&&a[e]&&(a[e]=a[e].toUpperCase()),(15&n[e>>1])>=8&&a[e+1]&&(a[e+1]=a[e+1].toUpperCase());return`0x${a.join("")}`}function c(e,t){if(!(0,a.U)(e))throw new n.b({address:e});return s(e,t)}},9321:(e,t,r)=>{"use strict";r.d(t,{U:()=>i});const n=/^0x[a-fA-F0-9]{40}$/;function i(e){return n.test(e)}},7864:(e,t,r)=>{"use strict";r.d(t,{L:()=>i});var n=r(377);function i({blockNumber:e,chain:t,contract:r}){const i=t?.contracts?.[r];if(!i)throw new n.mm({chain:t,contract:{name:r}});if(e&&i.blockCreated&&i.blockCreated>e)throw new n.mm({blockNumber:e,chain:t,contract:{name:r,blockCreated:i.blockCreated}});return i.address}},7040:(e,t,r)=>{"use strict";function n(e){return"string"==typeof e[0]?i(e):function(e){let t=0;for(const r of e)t+=r.length;const r=new Uint8Array(t);let n=0;for(const t of e)r.set(t,n),n+=t.length;return r}(e)}function i(e){return`0x${e.reduce(((e,t)=>e+t.replace("0x","")),"")}`}r.d(t,{SM:()=>i,zo:()=>n})},5102:(e,t,r)=>{"use strict";function n(e,{strict:t=!0}={}){return!!e&&"string"==typeof e&&(t?/^0x[0-9a-fA-F]*$/.test(e):e.startsWith("0x"))}r.d(t,{v:()=>n})},1769:(e,t,r)=>{"use strict";r.d(t,{gc:()=>o,vk:()=>i});var n=r(9760);function i(e,{dir:t,size:r=32}={}){return"string"==typeof e?o(e,{dir:t,size:r}):function(e,{dir:t,size:r=32}={}){if(null===r)return e;if(e.length>r)throw new n.$({size:e.length,targetSize:r,type:"bytes"});const i=new Uint8Array(r);for(let n=0;n<r;n++){const o="right"===t;i[o?n:r-n-1]=e[o?n:e.length-n-1]}return i}(e,{dir:t,size:r})}function o(e,{dir:t,size:r=32}={}){if(null===r)return e;const i=e.replace("0x","");if(i.length>2*r)throw new n.$({size:Math.ceil(i.length/2),targetSize:r,type:"hex"});return`0x${i["right"===t?"padEnd":"padStart"](2*r,"0")}`}},9135:(e,t,r)=>{"use strict";r.d(t,{d:()=>i});var n=r(5102);function i(e){return(0,n.v)(e,{strict:!1})?Math.ceil((e.length-2)/2):e.length}},3972:(e,t,r)=>{"use strict";r.d(t,{tP:()=>a});var n=r(9760),i=r(5102),o=r(9135);function a(e,t,r,{strict:n}={}){return(0,i.v)(e,{strict:!1})?function(e,t,r,{strict:n}={}){s(e,t);const i=`0x${e.replace("0x","").slice(2*(t??0),2*(r??e.length))}`;return n&&c(i,t,r),i}(e,t,r,{strict:n}):function(e,t,r,{strict:n}={}){s(e,t);const i=e.slice(t,r);return n&&c(i,t,r),i}(e,t,r,{strict:n})}function s(e,t){if("number"==typeof t&&t>0&&t>(0,o.d)(e)-1)throw new n.m({offset:t,position:"start",size:(0,o.d)(e)})}function c(e,t,r){if("number"==typeof t&&"number"==typeof r&&(0,o.d)(e)!==r-t)throw new n.m({offset:r,position:"end",size:(0,o.d)(e)})}},1836:(e,t,r)=>{"use strict";function n(e,{dir:t="left"}={}){let r="string"==typeof e?e.replace("0x",""):e,n=0;for(let e=0;e<r.length-1&&"0"===r["left"===t?e:r.length-e-1].toString();e++)n++;return r="left"===t?r.slice(n):r.slice(0,r.length-n),"string"==typeof e?(1===r.length&&"right"===t&&(r=`${r}0`),`0x${r.length%2==1?`0${r}`:r}`):r}r.d(t,{f:()=>n})},5946:(e,t,r)=>{"use strict";r.d(t,{XA:()=>l,Yf:()=>s,ly:()=>u,rR:()=>d,y_:()=>c});var n=r(7788),i=r(9135),o=r(1836),a=r(1187);function s(e,{size:t}){if((0,i.d)(e)>t)throw new n.M6({givenSize:(0,i.d)(e),maxSize:t})}function c(e,t={}){const{signed:r}=t;t.size&&s(e,{size:t.size});const n=BigInt(e);if(!r)return n;const i=(e.length-2)/2;return n<=(1n<<8n*BigInt(i)-1n)-1n?n:n-BigInt(`0x${"f".padStart(2*i,"f")}`)-1n}function l(e,t={}){let r=e;if(t.size&&(s(r,{size:t.size}),r=(0,o.f)(r)),"0x00"===(0,o.f)(r))return!1;if("0x01"===(0,o.f)(r))return!0;throw new n.Cd(r)}function u(e,t={}){return Number(c(e,t))}function d(e,t={}){let r=(0,a.nr)(e);return t.size&&(s(r,{size:t.size}),r=(0,o.f)(r,{dir:"right"})),(new TextDecoder).decode(r)}},1187:(e,t,r)=>{"use strict";r.d(t,{O0:()=>l,nr:()=>h,qX:()=>p});var n=r(2027),i=r(5102),o=r(1769),a=r(5946),s=r(2106);const c=new TextEncoder;function l(e,t={}){return"number"==typeof e||"bigint"==typeof e?function(e,t){return h((0,s.eC)(e,t))}(e,t):"boolean"==typeof e?function(e,t={}){const r=new Uint8Array(1);return r[0]=Number(e),"number"==typeof t.size?((0,a.Yf)(r,{size:t.size}),(0,o.vk)(r,{size:t.size})):r}(e,t):(0,i.v)(e)?h(e,t):p(e,t)}const u={zero:48,nine:57,A:65,F:70,a:97,f:102};function d(e){return e>=u.zero&&e<=u.nine?e-u.zero:e>=u.A&&e<=u.F?e-(u.A-10):e>=u.a&&e<=u.f?e-(u.a-10):void 0}function h(e,t={}){let r=e;t.size&&((0,a.Yf)(r,{size:t.size}),r=(0,o.vk)(r,{dir:"right",size:t.size}));let i=r.slice(2);i.length%2&&(i=`0${i}`);const s=i.length/2,c=new Uint8Array(s);for(let e=0,t=0;e<s;e++){const r=d(i.charCodeAt(t++)),o=d(i.charCodeAt(t++));if(void 0===r||void 0===o)throw new n.G(`Invalid byte sequence ("${i[t-2]}${i[t-1]}" in "${i}").`);c[e]=16*r+o}return c}function p(e,t={}){const r=c.encode(e);return"number"==typeof t.size?((0,a.Yf)(r,{size:t.size}),(0,o.vk)(r,{dir:"right",size:t.size})):r}},2106:(e,t,r)=>{"use strict";r.d(t,{$G:()=>h,C4:()=>c,NC:()=>s,ci:()=>l,eC:()=>u});var n=r(7788),i=r(1769),o=r(5946);const a=Array.from({length:256},((e,t)=>t.toString(16).padStart(2,"0")));function s(e,t={}){return"number"==typeof e||"bigint"==typeof e?u(e,t):"string"==typeof e?h(e,t):"boolean"==typeof e?c(e,t):l(e,t)}function c(e,t={}){const r=`0x${Number(e)}`;return"number"==typeof t.size?((0,o.Yf)(r,{size:t.size}),(0,i.vk)(r,{size:t.size})):r}function l(e,t={}){let r="";for(let t=0;t<e.length;t++)r+=a[e[t]];const n=`0x${r}`;return"number"==typeof t.size?((0,o.Yf)(n,{size:t.size}),(0,i.vk)(n,{dir:"right",size:t.size})):n}function u(e,t={}){const{signed:r,size:o}=t,a=BigInt(e);let s;o?s=r?(1n<<8n*BigInt(o)-1n)-1n:2n**(8n*BigInt(o))-1n:"number"==typeof e&&(s=BigInt(Number.MAX_SAFE_INTEGER));const c="bigint"==typeof s&&r?-s-1n:0;if(s&&a>s||a<c){const t="bigint"==typeof e?"n":"";throw new n.J5({max:s?`${s}${t}`:void 0,min:`${c}${t}`,signed:r,size:o,value:`${e}${t}`})}const l=`0x${(r&&a<0?(1n<<BigInt(8*o))+BigInt(a):a).toString(16)}`;return o?(0,i.vk)(l,{size:o}):l}const d=new TextEncoder;function h(e,t={}){return l(d.encode(e),t)}},7469:(e,t,r)=>{"use strict";r.d(t,{k:()=>o});var n=r(2027),i=r(6445);function o(e,t){const r=(e.details||"").toLowerCase(),o=e.walk((e=>e.code===i.M_.code));return o instanceof n.G?new i.M_({cause:e,message:o.details}):i.M_.nodeMessage.test(r)?new i.M_({cause:e,message:e.details}):i.Hh.nodeMessage.test(r)?new i.Hh({cause:e,maxFeePerGas:t?.maxFeePerGas}):i.G$.nodeMessage.test(r)?new i.G$({cause:e,maxFeePerGas:t?.maxFeePerGas}):i.ZI.nodeMessage.test(r)?new i.ZI({cause:e,nonce:t?.nonce}):i.vU.nodeMessage.test(r)?new i.vU({cause:e,nonce:t?.nonce}):i.se.nodeMessage.test(r)?new i.se({cause:e,nonce:t?.nonce}):i.C_.nodeMessage.test(r)?new i.C_({cause:e}):i.WF.nodeMessage.test(r)?new i.WF({cause:e,gas:t?.gas}):i.dR.nodeMessage.test(r)?new i.dR({cause:e,gas:t?.gas}):i.pZ.nodeMessage.test(r)?new i.pZ({cause:e}):i.cs.nodeMessage.test(r)?new i.cs({cause:e,maxFeePerGas:t?.maxFeePerGas,maxPriorityFeePerGas:t?.maxPriorityFeePerGas}):new i.cj({cause:e})}},1163:(e,t,r)=>{"use strict";function n(e,{format:t}){if(!t)return{};const r={};return function t(n){const i=Object.keys(n);for(const o of i)o in e&&(r[o]=e[o]),n[o]&&"object"==typeof n[o]&&!Array.isArray(n[o])&&t(n[o])}(t(e||{})),r}r.d(t,{K:()=>n})},4688:(e,t,r)=>{"use strict";r.d(t,{tG:()=>o});var n=r(2106);const i={legacy:"0x0",eip2930:"0x1",eip1559:"0x2"};function o(e){return{...e,gas:void 0!==e.gas?(0,n.eC)(e.gas):void 0,gasPrice:void 0!==e.gasPrice?(0,n.eC)(e.gasPrice):void 0,maxFeePerGas:void 0!==e.maxFeePerGas?(0,n.eC)(e.maxFeePerGas):void 0,maxPriorityFeePerGas:void 0!==e.maxPriorityFeePerGas?(0,n.eC)(e.maxPriorityFeePerGas):void 0,nonce:void 0!==e.nonce?(0,n.eC)(e.nonce):void 0,type:void 0!==e.type?i[e.type]:void 0,value:void 0!==e.value?(0,n.eC)(e.value):void 0}}},4092:(e,t,r)=>{"use strict";r.d(t,{e:()=>a});var n=r(1187),i=r(9574),o=r(3199);const a=e=>{return t=(e=>(0,i.r)(e))(e),(0,o.w)((0,n.O0)(t));var t}},552:(e,t,r)=>{"use strict";r.d(t,{o:()=>s});var n=r(3972),i=r(1187),o=r(9574),a=r(3199);const s=e=>{return(0,n.tP)((t=(0,o.r)(e),(0,a.w)((0,i.O0)(t))),0,4);var t}},9574:(e,t,r)=>{"use strict";r.d(t,{r:()=>s});const n=/^tuple(?<array>(\[(\d*)\])*)$/;function i(e){let t=e.type;if(n.test(e.type)&&"components"in e){t="(";const r=e.components.length;for(let n=0;n<r;n++)t+=i(e.components[n]),n<r-1&&(t+=", ");const o=function(e,t){const r=e.exec(t);return r?.groups}(n,e.type);return t+=`)${o?.array??""}`,i({...e,type:t})}return"indexed"in e&&e.indexed&&(t=`${t} indexed`),e.name?`${t} ${e.name}`:t}function o(e){let t="";const r=e.length;for(let n=0;n<r;n++)t+=i(e[n]),n!==r-1&&(t+=", ");return t}var a=r(2027);const s=e=>{var t;return function(e){let t=!0,r="",n=0,i="",o=!1;for(let a=0;a<e.length;a++){const s=e[a];if(["(",")",","].includes(s)&&(t=!0),"("===s&&n++,")"===s&&n--,t)if(0!==n)" "!==s?(i+=s,r+=s):","!==e[a-1]&&","!==r&&",("!==r&&(r="",t=!1);else if(" "===s&&["event","function",""].includes(i))i="";else if(i+=s,")"===s){o=!0;break}}if(!o)throw new a.G("Unable to normalize signature.");return i}("string"==typeof e?e:"function"===(t=e).type?`function ${t.name}(${o(t.inputs)})${t.stateMutability&&"nonpayable"!==t.stateMutability?` ${t.stateMutability}`:""}${t.outputs.length?` returns (${o(t.outputs)})`:""}`:"event"===t.type?`event ${t.name}(${o(t.inputs)})`:"error"===t.type?`error ${t.name}(${o(t.inputs)})`:"constructor"===t.type?`constructor(${o(t.inputs)})${"payable"===t.stateMutability?" payable":""}`:"fallback"===t.type?"fallback()":"receive() external payable")}},3199:(e,t,r)=>{"use strict";function n(e){if(!Number.isSafeInteger(e)||e<0)throw new Error(`Wrong positive integer: ${e}`)}function i(e,...t){if(!(e instanceof Uint8Array))throw new Error("Expected Uint8Array");if(t.length>0&&!t.includes(e.length))throw new Error(`Expected Uint8Array of length ${t}, not of length=${e.length}`)}function o(e,t=!0){if(e.destroyed)throw new Error("Hash instance has been destroyed");if(t&&e.finished)throw new Error("Hash#digest() has already been called")}r.d(t,{w:()=>I});const a=BigInt(2**32-1),s=BigInt(32);function c(e,t=!1){return t?{h:Number(e&a),l:Number(e>>s&a)}:{h:0|Number(e>>s&a),l:0|Number(e&a)}}function l(e,t=!1){let r=new Uint32Array(e.length),n=new Uint32Array(e.length);for(let i=0;i<e.length;i++){const{h:o,l:a}=c(e[i],t);[r[i],n[i]]=[o,a]}return[r,n]}if(68!==new Uint8Array(new Uint32Array([287454020]).buffer)[0])throw new Error("Non little-endian hardware is not supported");function u(e){if("string"==typeof e&&(e=function(e){if("string"!=typeof e)throw new Error("utf8ToBytes expected string, got "+typeof e);return new Uint8Array((new TextEncoder).encode(e))}(e)),!(e instanceof Uint8Array))throw new Error("expected Uint8Array, got "+typeof e);return e}class d{clone(){return this._cloneInto()}}const[h,p,f]=[[],[],[]],g=BigInt(0),w=BigInt(1),b=BigInt(2),m=BigInt(7),y=BigInt(256),v=BigInt(113);for(let e=0,t=w,r=1,n=0;e<24;e++){[r,n]=[n,(2*r+3*n)%5],h.push(2*(5*n+r)),p.push((e+1)*(e+2)/2%64);let i=g;for(let e=0;e<7;e++)t=(t<<w^(t>>m)*v)%y,t&b&&(i^=w<<(w<<BigInt(e))-w);f.push(i)}const[x,C]=l(f,!0),k=(e,t,r)=>r>32?((e,t,r)=>t<<r-32|e>>>64-r)(e,t,r):((e,t,r)=>e<<r|t>>>32-r)(e,t,r),E=(e,t,r)=>r>32?((e,t,r)=>e<<r-32|t>>>64-r)(e,t,r):((e,t,r)=>t<<r|e>>>32-r)(e,t,r);class P extends d{constructor(e,t,r,i=!1,o=24){if(super(),this.blockLen=e,this.suffix=t,this.outputLen=r,this.enableXOF=i,this.rounds=o,this.pos=0,this.posOut=0,this.finished=!1,this.destroyed=!1,n(r),0>=this.blockLen||this.blockLen>=200)throw new Error("Sha3 supports only keccak-f1600 function");var a;this.state=new Uint8Array(200),this.state32=(a=this.state,new Uint32Array(a.buffer,a.byteOffset,Math.floor(a.byteLength/4)))}keccak(){!function(e,t=24){const r=new Uint32Array(10);for(let n=24-t;n<24;n++){for(let t=0;t<10;t++)r[t]=e[t]^e[t+10]^e[t+20]^e[t+30]^e[t+40];for(let t=0;t<10;t+=2){const n=(t+8)%10,i=(t+2)%10,o=r[i],a=r[i+1],s=k(o,a,1)^r[n],c=E(o,a,1)^r[n+1];for(let r=0;r<50;r+=10)e[t+r]^=s,e[t+r+1]^=c}let t=e[2],i=e[3];for(let r=0;r<24;r++){const n=p[r],o=k(t,i,n),a=E(t,i,n),s=h[r];t=e[s],i=e[s+1],e[s]=o,e[s+1]=a}for(let t=0;t<50;t+=10){for(let n=0;n<10;n++)r[n]=e[t+n];for(let n=0;n<10;n++)e[t+n]^=~r[(n+2)%10]&r[(n+4)%10]}e[0]^=x[n],e[1]^=C[n]}r.fill(0)}(this.state32,this.rounds),this.posOut=0,this.pos=0}update(e){o(this);const{blockLen:t,state:r}=this,n=(e=u(e)).length;for(let i=0;i<n;){const o=Math.min(t-this.pos,n-i);for(let t=0;t<o;t++)r[this.pos++]^=e[i++];this.pos===t&&this.keccak()}return this}finish(){if(this.finished)return;this.finished=!0;const{state:e,suffix:t,pos:r,blockLen:n}=this;e[r]^=t,0!=(128&t)&&r===n-1&&this.keccak(),e[n-1]^=128,this.keccak()}writeInto(e){o(this,!1),i(e),this.finish();const t=this.state,{blockLen:r}=this;for(let n=0,i=e.length;n<i;){this.posOut>=r&&this.keccak();const o=Math.min(r-this.posOut,i-n);e.set(t.subarray(this.posOut,this.posOut+o),n),this.posOut+=o,n+=o}return e}xofInto(e){if(!this.enableXOF)throw new Error("XOF is not possible for this instance");return this.writeInto(e)}xof(e){return n(e),this.xofInto(new Uint8Array(e))}digestInto(e){if(function(e,t){i(e);const r=t.outputLen;if(e.length<r)throw new Error(`digestInto() expects output buffer of length at least ${r}`)}(e,this),this.finished)throw new Error("digest() was already called");return this.writeInto(e),this.destroy(),e}digest(){return this.digestInto(new Uint8Array(this.outputLen))}destroy(){this.destroyed=!0,this.state.fill(0)}_cloneInto(e){const{blockLen:t,suffix:r,outputLen:n,rounds:i,enableXOF:o}=this;return e||(e=new P(t,r,n,o,i)),e.state32.set(this.state32),e.pos=this.pos,e.posOut=this.posOut,e.finished=this.finished,e.rounds=i,e.suffix=r,e.outputLen=n,e.enableXOF=o,e.destroyed=this.destroyed,e}}const $=((e,t,r)=>function(e){const t=t=>e().update(u(t)).digest(),r=e();return t.outputLen=r.outputLen,t.blockLen=r.blockLen,t.create=()=>e(),t}((()=>new P(t,e,r))))(1,136,32);var S=r(5102),_=r(1187),A=r(2106);function I(e,t){const r=t||"hex",n=$((0,S.v)(e,{strict:!1})?(0,_.O0)(e):e);return"bytes"===r?n:(0,A.NC)(n)}},2357:(e,t,r)=>{"use strict";r.d(t,{S:()=>i});const n=new Map;function i({fn:e,id:t,shouldSplitBatch:r,wait:i=0,sort:o}){const a=async()=>{const t=c();s();const r=t.map((({args:e})=>e));0!==r.length&&e(r).then((e=>{o&&Array.isArray(e)&&e.sort(o);for(let r=0;r<t.length;r++){const{pendingPromise:n}=t[r];n.resolve?.([e[r],e])}})).catch((e=>{for(let r=0;r<t.length;r++){const{pendingPromise:n}=t[r];n.reject?.(e)}}))},s=()=>n.delete(t),c=()=>n.get(t)||[],l=e=>n.set(t,[...c(),e]);return{flush:s,async schedule(e){const t={},n=new Promise(((e,r)=>{t.resolve=e,t.reject=r})),o=r?.([...c().map((({args:e})=>e)),e]);return o&&a(),c().length>0?(l({args:e,pendingPromise:t}),n):(l({args:e,pendingPromise:t}),setTimeout(a,i),n)}}}},6070:(e,t,r)=>{"use strict";r.d(t,{P:()=>n});const n=(e,t,r)=>JSON.stringify(e,((e,r)=>{const n="bigint"==typeof r?r.toString():r;return"function"==typeof t?t(e,n):n}),r)},7531:(e,t,r)=>{"use strict";r.d(t,{F:()=>c});var n=r(4503),i=r(6087),o=r(6445),a=r(3639),s=r(9321);function c(e){const{account:t,gasPrice:r,maxFeePerGas:c,maxPriorityFeePerGas:l,to:u}=e,d=t?(0,n.T)(t):void 0;if(d&&!(0,s.U)(d.address))throw new i.b({address:d.address});if(u&&!(0,s.U)(u))throw new i.b({address:u});if(void 0!==r&&(void 0!==c||void 0!==l))throw new a.xY;if(c&&c>2n**256n-1n)throw new o.Hh({maxFeePerGas:c});if(l&&c&&l>c)throw new o.cs({maxFeePerGas:c,maxPriorityFeePerGas:l})}},9625:(e,t,r)=>{"use strict";r.d(t,{d:()=>o});var n=r(4192),i=r(5229);function o(e,t="wei"){return(0,i.b)(e,n.ez[t])}},7795:(e,t,r)=>{"use strict";r.d(t,{o:()=>o});var n=r(4192),i=r(5229);function o(e,t="wei"){return(0,i.b)(e,n.Zn[t])}},5229:(e,t,r)=>{"use strict";function n(e,t){let r=e.toString();const n=r.startsWith("-");n&&(r=r.slice(1)),r=r.padStart(t,"0");let[i,o]=[r.slice(0,r.length-t),r.slice(r.length-t)];return o=o.replace(/(0+)$/,""),`${n?"-":""}${i||"0"}${o?`.${o}`:""}`}r.d(t,{b:()=>n})}},o={};function a(e){var t=o[e];if(void 0!==t)return t.exports;var r=o[e]={id:e,loaded:!1,exports:{}};return i[e].call(r.exports,r,r.exports,a),r.loaded=!0,r.exports}a.m=i,a.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return a.d(t,{a:t}),t},t=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,a.t=function(r,n){if(1&n&&(r=this(r)),8&n)return r;if("object"==typeof r&&r){if(4&n&&r.__esModule)return r;if(16&n&&"function"==typeof r.then)return r}var i=Object.create(null);a.r(i);var o={};e=e||[null,t({}),t([]),t(t)];for(var s=2&n&&r;"object"==typeof s&&!~e.indexOf(s);s=t(s))Object.getOwnPropertyNames(s).forEach((e=>o[e]=()=>r[e]));return o.default=()=>r,a.d(i,o),i},a.d=(e,t)=>{for(var r in t)a.o(t,r)&&!a.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},a.f={},a.e=e=>Promise.all(Object.keys(a.f).reduce(((t,r)=>(a.f[r](e,t),t)),[])),a.u=e=>e+".bundle.js",a.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r={},n="backend:",a.l=(e,t,i,o)=>{if(r[e])r[e].push(t);else{var s,c;if(void 0!==i)for(var l=document.getElementsByTagName("script"),u=0;u<l.length;u++){var d=l[u];if(d.getAttribute("src")==e||d.getAttribute("data-webpack")==n+i){s=d;break}}s||(c=!0,(s=document.createElement("script")).charset="utf-8",s.timeout=120,a.nc&&s.setAttribute("nonce",a.nc),s.setAttribute("data-webpack",n+i),s.src=e),r[e]=[t];var h=(t,n)=>{s.onerror=s.onload=null,clearTimeout(p);var i=r[e];if(delete r[e],s.parentNode&&s.parentNode.removeChild(s),i&&i.forEach((e=>e(n))),t)return t(n)},p=setTimeout(h.bind(null,void 0,{type:"timeout",target:s}),12e4);s.onerror=h.bind(null,s.onerror),s.onload=h.bind(null,s.onload),c&&document.head.appendChild(s)}},a.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),(()=>{var e;a.g.importScripts&&(e=a.g.location+"");var t=a.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var r=t.getElementsByTagName("script");if(r.length)for(var n=r.length-1;n>-1&&!e;)e=r[n--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),a.p=e})(),(()=>{var e={179:0};a.f.j=(t,r)=>{var n=a.o(e,t)?e[t]:void 0;if(0!==n)if(n)r.push(n[2]);else{var i=new Promise(((r,i)=>n=e[t]=[r,i]));r.push(n[2]=i);var o=a.p+a.u(t),s=new Error;a.l(o,(r=>{if(a.o(e,t)&&(0!==(n=e[t])&&(e[t]=void 0),n)){var i=r&&("load"===r.type?"missing":r.type),o=r&&r.target&&r.target.src;s.message="Loading chunk "+t+" failed.\n("+i+": "+o+")",s.name="ChunkLoadError",s.type=i,s.request=o,n[1](s)}}),"chunk-"+t,t)}};var t=(t,r)=>{var n,i,[o,s,c]=r,l=0;if(o.some((t=>0!==e[t]))){for(n in s)a.o(s,n)&&(a.m[n]=s[n]);c&&c(a)}for(t&&t(r);l<o.length;l++)i=o[l],a.o(e,i)&&e[i]&&e[i][0](),e[i]=0},r=self.webpackChunkbackend=self.webpackChunkbackend||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})(),(()=>{"use strict";var e=class extends Error{constructor({chainId:e,connectorId:t}){super(`Chain "${e}" not configured for connector "${t}".`),this.name="ChainNotConfiguredForConnectorError"}},t=class extends Error{constructor(){super(...arguments),this.name="ConnectorNotFoundError",this.message="Connector not found"}};function r(e){return"string"==typeof e?Number.parseInt(e,"0x"===e.trim().substring(0,2)?16:10):"bigint"==typeof e?Number(e):e}var n=a(6729);function i(e,t={}){const{fees:r=e.fees,formatters:n=e.formatters,serializers:i=e.serializers}=t;return{...e,fees:r,formatters:n,serializers:i}}const o=i({id:1,network:"homestead",name:"Ethereum",nativeCurrency:{name:"Ether",symbol:"ETH",decimals:18},rpcUrls:{alchemy:{http:["https://eth-mainnet.g.alchemy.com/v2"],webSocket:["wss://eth-mainnet.g.alchemy.com/v2"]},infura:{http:["https://mainnet.infura.io/v3"],webSocket:["wss://mainnet.infura.io/ws/v3"]},default:{http:["https://cloudflare-eth.com"]},public:{http:["https://cloudflare-eth.com"]}},blockExplorers:{etherscan:{name:"Etherscan",url:"https://etherscan.io"},default:{name:"Etherscan",url:"https://etherscan.io"}},contracts:{ensRegistry:{address:"0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"},ensUniversalResolver:{address:"0xc0497E381f536Be9ce14B0dD3817cBcAe57d2F62",blockCreated:16966585},multicall3:{address:"0xca11bde05977b3631167028862be2a173976ca11",blockCreated:14353601}}}),s=i({id:5,network:"goerli",name:"Goerli",nativeCurrency:{name:"Goerli Ether",symbol:"ETH",decimals:18},rpcUrls:{alchemy:{http:["https://eth-goerli.g.alchemy.com/v2"],webSocket:["wss://eth-goerli.g.alchemy.com/v2"]},infura:{http:["https://goerli.infura.io/v3"],webSocket:["wss://goerli.infura.io/ws/v3"]},default:{http:["https://rpc.ankr.com/eth_goerli"]},public:{http:["https://rpc.ankr.com/eth_goerli"]}},blockExplorers:{etherscan:{name:"Etherscan",url:"https://goerli.etherscan.io"},default:{name:"Etherscan",url:"https://goerli.etherscan.io"}},contracts:{ensRegistry:{address:"0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"},ensUniversalResolver:{address:"0x56522D00C410a43BFfDF00a9A569489297385790",blockCreated:8765204},multicall3:{address:"0xca11bde05977b3631167028862be2a173976ca11",blockCreated:6507670}},testnet:!0});var c=(e,t,r)=>{if(!t.has(e))throw TypeError("Cannot "+r)},l=(e,t,r)=>(c(e,t,"read from private field"),r?r.call(e):t.get(e)),u=(e,t,r)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,r)},d=(e,t,r,n)=>(c(e,t,"write to private field"),n?n.call(e,r):t.set(e,r),r),h=(e,t,r)=>(c(e,t,"access private method"),r),p=class extends n{constructor({chains:e=[o,s],options:t}){super(),this.chains=e,this.options=t}getBlockExplorerUrls(e){const{default:t,...r}=e.blockExplorers??{};if(t)return[t.url,...Object.values(r).map((e=>e.url))]}isChainUnsupported(e){return!this.chains.some((t=>t.id===e))}setStorage(e){this.storage=e}},f=a(5775),g=a(2027),w=a(8863);class b extends g.G{constructor(e,{code:t,docsPath:r,metaMessages:n,shortMessage:i}){super(i,{cause:e,docsPath:r,metaMessages:n||e?.metaMessages}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"RpcError"}),Object.defineProperty(this,"code",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.name=e.name,this.code=e instanceof w.bs?e.code:t??-1}}class m extends b{constructor(e,t){super(e,t),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ProviderRpcError"}),Object.defineProperty(this,"data",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.data=t.data}}class y extends b{constructor(e){super(e,{code:y.code,shortMessage:"Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ParseRpcError"})}}Object.defineProperty(y,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32700});class v extends b{constructor(e){super(e,{code:v.code,shortMessage:"JSON is not a valid request object."}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"InvalidRequestRpcError"})}}Object.defineProperty(v,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32600});class x extends b{constructor(e){super(e,{code:x.code,shortMessage:"The method does not exist / is not available."}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"MethodNotFoundRpcError"})}}Object.defineProperty(x,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32601});class C extends b{constructor(e){super(e,{code:C.code,shortMessage:["Invalid parameters were provided to the RPC method.","Double check you have provided the correct parameters."].join("\n")}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"InvalidParamsRpcError"})}}Object.defineProperty(C,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32602});class k extends b{constructor(e){super(e,{code:k.code,shortMessage:"An internal error was received."}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"InternalRpcError"})}}Object.defineProperty(k,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32603});class E extends b{constructor(e){super(e,{code:E.code,shortMessage:["Missing or invalid parameters.","Double check you have provided the correct parameters."].join("\n")}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"InvalidInputRpcError"})}}Object.defineProperty(E,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32e3});class P extends b{constructor(e){super(e,{code:P.code,shortMessage:"Requested resource not found."}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ResourceNotFoundRpcError"})}}Object.defineProperty(P,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32001});class $ extends b{constructor(e){super(e,{code:$.code,shortMessage:"Requested resource not available."}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ResourceUnavailableRpcError"})}}Object.defineProperty($,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32002});class S extends b{constructor(e){super(e,{code:S.code,shortMessage:"Transaction creation failed."}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"TransactionRejectedRpcError"})}}Object.defineProperty(S,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32003});class _ extends b{constructor(e){super(e,{code:_.code,shortMessage:"Method is not implemented."}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"MethodNotSupportedRpcError"})}}Object.defineProperty(_,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32004});class A extends b{constructor(e){super(e,{code:A.code,shortMessage:"Request exceeds defined limit."}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"LimitExceededRpcError"})}}Object.defineProperty(A,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32005});class I extends b{constructor(e){super(e,{code:I.code,shortMessage:"Version of JSON-RPC protocol is not supported."}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"JsonRpcVersionUnsupportedError"})}}Object.defineProperty(I,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32006});class O extends m{constructor(e){super(e,{code:O.code,shortMessage:"User rejected the request."}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"UserRejectedRequestError"})}}Object.defineProperty(O,"code",{enumerable:!0,configurable:!0,writable:!0,value:4001});class T extends m{constructor(e){super(e,{code:T.code,shortMessage:"The requested method and/or account has not been authorized by the user."}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"UnauthorizedProviderError"})}}Object.defineProperty(T,"code",{enumerable:!0,configurable:!0,writable:!0,value:4100});class N extends m{constructor(e){super(e,{code:N.code,shortMessage:"The Provider does not support the requested method."}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"UnsupportedProviderMethodError"})}}Object.defineProperty(N,"code",{enumerable:!0,configurable:!0,writable:!0,value:4200});class R extends m{constructor(e){super(e,{code:R.code,shortMessage:"The Provider is disconnected from all chains."}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ProviderDisconnectedError"})}}Object.defineProperty(R,"code",{enumerable:!0,configurable:!0,writable:!0,value:4900});class j extends m{constructor(e){super(e,{code:j.code,shortMessage:"The Provider is not connected to the requested chain."}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ChainDisconnectedError"})}}Object.defineProperty(j,"code",{enumerable:!0,configurable:!0,writable:!0,value:4901});class B extends m{constructor(e){super(e,{code:B.code,shortMessage:"An error occurred when attempting to switch chain."}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"SwitchChainError"})}}Object.defineProperty(B,"code",{enumerable:!0,configurable:!0,writable:!0,value:4902});class M extends b{constructor(e){super(e,{shortMessage:"An unknown RPC error occurred."}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"UnknownRpcError"})}}var U=a(4503);const L=256;let D,z=L;function W(e=11){if(!D||z+e>2*L){D="",z=0;for(let e=0;e<L;e++)D+=(256+256*Math.random()|0).toString(16).substring(1)}return D.substring(z,z+++e)}function F(e){const{batch:t,cacheTime:r=e.pollingInterval??4e3,key:n="base",name:i="Base Client",pollingInterval:o=4e3,type:a="base"}=e,s=e.chain,c=e.account?(0,U.T)(e.account):void 0,{config:l,request:u,value:d}=e.transport({chain:s,pollingInterval:o}),h={account:c,batch:t,cacheTime:r,chain:s,key:n,name:i,pollingInterval:o,request:u,transport:{...l,...d},type:a,uid:W()};return Object.assign(h,{extend:function e(t){return r=>{const n=r(t);for(const e in h)delete n[e];const i={...t,...n};return Object.assign(i,{extend:e(i)})}}(h)})}var H=a(5946);async function G(e){const t=await e.request({method:"eth_chainId"});return(0,H.ly)(t)}var q=a(2106),Z=a(7412),V=a(7040),Y=a(5444);const K="/docs/contract/encodeDeployData";function X({abi:e,args:t,bytecode:r}){if(!t||0===t.length)return r;const n=e.find((e=>"type"in e&&"constructor"===e.type));if(!n)throw new Z.fM({docsPath:K});if(!("inputs"in n))throw new Z.cO({docsPath:K});if(!n.inputs||0===n.inputs.length)throw new Z.cO({docsPath:K});const i=(0,Y.E)(n.inputs,t);return(0,V.SM)([r,i])}class J extends g.G{constructor({docsPath:e}={}){super(["Could not find an Account to execute with this Action.","Please provide an Account with the `account` argument on the Action, or by supplying an `account` to the WalletClient."].join("\n"),{docsPath:e,docsSlug:"account"}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"AccountNotFoundError"})}}var Q=a(377);function ee({chain:e,currentChainId:t}){if(!e)throw new Q.Bk;if(t!==e.id)throw new Q.Yl({chain:e,currentChainId:t})}var te=a(6445),re=a(3639),ne=a(7469),ie=a(1163),oe=a(4688);function ae(e,t,r){return n=>e[t.name||r]?.(n)??t(e,n)}var se=a(7531),ce=a(7795);class le extends g.G{constructor(){super("`baseFeeMultiplier` must be greater than 1."),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"BaseFeeScalarError"})}}class ue extends g.G{constructor(){super("Chain does not support EIP-1559 fees."),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"Eip1559FeesNotSupportedError"})}}class de extends g.G{constructor({maxPriorityFeePerGas:e}){super(`\`maxFeePerGas\` cannot be less than the \`maxPriorityFeePerGas\` (${(0,ce.o)(e)} gwei).`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"MaxFeePerGasTooLowError"})}}class he extends g.G{constructor({blockHash:e,blockNumber:t}){let r="Block";e&&(r=`Block at hash "${e}"`),t&&(r=`Block at number "${t}"`),super(`${r} could not be found.`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"BlockNotFoundError"})}}const pe={"0x0":"legacy","0x1":"eip2930","0x2":"eip1559"};function fe(e){const t={...e,blockHash:e.blockHash?e.blockHash:null,blockNumber:e.blockNumber?BigInt(e.blockNumber):null,chainId:e.chainId?(0,H.ly)(e.chainId):void 0,gas:e.gas?BigInt(e.gas):void 0,gasPrice:e.gasPrice?BigInt(e.gasPrice):void 0,maxFeePerGas:e.maxFeePerGas?BigInt(e.maxFeePerGas):void 0,maxPriorityFeePerGas:e.maxPriorityFeePerGas?BigInt(e.maxPriorityFeePerGas):void 0,nonce:e.nonce?(0,H.ly)(e.nonce):void 0,to:e.to?e.to:null,transactionIndex:e.transactionIndex?Number(e.transactionIndex):null,type:e.type?pe[e.type]:void 0,typeHex:e.type?e.type:void 0,value:e.value?BigInt(e.value):void 0,v:e.v?BigInt(e.v):void 0};return t.yParity=(()=>{if(e.yParity)return Number(e.yParity);if("bigint"==typeof t.v){if(0n===t.v||27n===t.v)return 0;if(1n===t.v||28n===t.v)return 1;if(t.v>=35n)return t.v%2n===0n?1:0}})(),"legacy"===t.type&&(delete t.accessList,delete t.maxFeePerGas,delete t.maxPriorityFeePerGas,delete t.yParity),"eip2930"===t.type&&(delete t.maxFeePerGas,delete t.maxPriorityFeePerGas),t}function ge(e){const t=e.transactions?.map((e=>"string"==typeof e?e:fe(e)));return{...e,baseFeePerGas:e.baseFeePerGas?BigInt(e.baseFeePerGas):null,difficulty:e.difficulty?BigInt(e.difficulty):void 0,gasLimit:e.gasLimit?BigInt(e.gasLimit):void 0,gasUsed:e.gasUsed?BigInt(e.gasUsed):void 0,hash:e.hash?e.hash:null,logsBloom:e.logsBloom?e.logsBloom:null,nonce:e.nonce?e.nonce:null,number:e.number?BigInt(e.number):null,size:e.size?BigInt(e.size):void 0,timestamp:e.timestamp?BigInt(e.timestamp):void 0,transactions:t,totalDifficulty:e.totalDifficulty?BigInt(e.totalDifficulty):null}}async function we(e,{blockHash:t,blockNumber:r,blockTag:n,includeTransactions:i}={}){const o=n??"latest",a=i??!1,s=void 0!==r?(0,q.eC)(r):void 0;let c=null;if(c=t?await e.request({method:"eth_getBlockByHash",params:[t,a]}):await e.request({method:"eth_getBlockByNumber",params:[s||o,a]}),!c)throw new he({blockHash:t,blockNumber:r});return(e.chain?.formatters?.block?.format||ge)(c)}async function be(e){const t=await e.request({method:"eth_gasPrice"});return BigInt(t)}async function me(e,t){const{block:r,chain:n=e.chain,request:i}=t||{};if("function"==typeof n?.fees?.defaultPriorityFee){const t=r||await ae(e,we,"getBlock")({});return n.fees.defaultPriorityFee({block:t,client:e,request:i})}if(void 0!==n?.fees?.defaultPriorityFee)return n?.fees?.defaultPriorityFee;try{const t=await e.request({method:"eth_maxPriorityFeePerGas"});return(0,H.y_)(t)}catch{const[t,n]=await Promise.all([r?Promise.resolve(r):ae(e,we,"getBlock")({}),ae(e,be,"getGasPrice")({})]);if("bigint"!=typeof t.baseFeePerGas)throw new ue;const i=n-t.baseFeePerGas;return i<0n?0n:i}}async function ye(e,t){const{block:r,chain:n=e.chain,request:i,type:o="eip1559"}=t||{},a=await(async()=>"function"==typeof n?.fees?.baseFeeMultiplier?n.fees.baseFeeMultiplier({block:r,client:e,request:i}):n?.fees?.baseFeeMultiplier??1.2)();if(a<1)throw new le;const s=10**(a.toString().split(".")[1]?.length??0),c=e=>e*BigInt(Math.ceil(a*s))/BigInt(s),l=r||await ae(e,we,"getBlock")({});if("function"==typeof n?.fees?.estimateFeesPerGas)return n.fees.estimateFeesPerGas({block:r,client:e,multiply:c,request:i,type:o});if("eip1559"===o){if("bigint"!=typeof l.baseFeePerGas)throw new ue;const t=i?.maxPriorityFeePerGas?i.maxPriorityFeePerGas:await me(e,{block:l,chain:n,request:i}),r=c(l.baseFeePerGas);return{maxFeePerGas:i?.maxFeePerGas??r+t,maxPriorityFeePerGas:t}}return{gasPrice:i?.gasPrice??c(await ae(e,be,"getGasPrice")({}))}}var ve=a(9625);class xe extends g.G{constructor(e,{account:t,docsPath:r,chain:n,data:i,gas:o,gasPrice:a,maxFeePerGas:s,maxPriorityFeePerGas:c,nonce:l,to:u,value:d}){const h=(0,re.xr)({from:t?.address,to:u,value:void 0!==d&&`${(0,ve.d)(d)} ${n?.nativeCurrency?.symbol||"ETH"}`,data:i,gas:o,gasPrice:void 0!==a&&`${(0,ce.o)(a)} gwei`,maxFeePerGas:void 0!==s&&`${(0,ce.o)(s)} gwei`,maxPriorityFeePerGas:void 0!==c&&`${(0,ce.o)(c)} gwei`,nonce:l});super(e.shortMessage,{cause:e,docsPath:r,metaMessages:[...e.metaMessages?[...e.metaMessages," "]:[],"Estimate Gas Arguments:",h].filter(Boolean)}),Object.defineProperty(this,"cause",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"EstimateGasExecutionError"}),this.cause=e}}async function Ce(e,t){const r=t.account??e.account;if(!r)throw new J({docsPath:"/docs/actions/public/estimateGas"});const n=(0,U.T)(r);try{const{accessList:r,blockNumber:i,blockTag:o,data:a,gas:s,gasPrice:c,maxFeePerGas:l,maxPriorityFeePerGas:u,nonce:d,to:h,value:p,...f}="local"===n.type?await Ee(e,t):t,g=(i?(0,q.eC)(i):void 0)||o;(0,se.F)(t);const w=e.chain?.formatters?.transactionRequest?.format,b=(w||oe.tG)({...(0,ie.K)(f,{format:w}),from:n.address,accessList:r,data:a,gas:s,gasPrice:c,maxFeePerGas:l,maxPriorityFeePerGas:u,nonce:d,to:h,value:p}),m=await e.request({method:"eth_estimateGas",params:g?[b,g]:[b]});return BigInt(m)}catch(r){throw function(e,{docsPath:t,...r}){const n=(()=>{const t=(0,ne.k)(e,r);return t instanceof te.cj?e:t})();return new xe(n,{docsPath:t,...r})}(r,{...t,account:n,chain:e.chain})}}async function ke(e,{address:t,blockTag:r="latest",blockNumber:n}){const i=await e.request({method:"eth_getTransactionCount",params:[t,n?(0,q.eC)(n):r]});return(0,H.ly)(i)}async function Ee(e,t){const{account:r=e.account,chain:n,gas:i,nonce:o,type:a}=t;if(!r)throw new J;const s=(0,U.T)(r),c=await ae(e,we,"getBlock")({blockTag:"latest"}),l={...t,from:s.address};if(void 0===o&&(l.nonce=await ae(e,ke,"getTransactionCount")({address:s.address,blockTag:"pending"})),void 0===a)try{l.type=function(e){if(e.type)return e.type;if(void 0!==e.maxFeePerGas||void 0!==e.maxPriorityFeePerGas)return"eip1559";if(void 0!==e.gasPrice)return void 0!==e.accessList?"eip2930":"legacy";throw new re.j3({transaction:e})}(l)}catch{l.type="bigint"==typeof c.baseFeePerGas?"eip1559":"legacy"}if("eip1559"===l.type){const{maxFeePerGas:r,maxPriorityFeePerGas:i}=await ye(e,{block:c,chain:n,request:l});if(void 0===t.maxPriorityFeePerGas&&t.maxFeePerGas&&t.maxFeePerGas<i)throw new de({maxPriorityFeePerGas:i});l.maxPriorityFeePerGas=i,l.maxFeePerGas=r}else{if(void 0!==t.maxFeePerGas||void 0!==t.maxPriorityFeePerGas)throw new ue;const{gasPrice:r}=await ye(e,{block:c,chain:n,request:l,type:"legacy"});l.gasPrice=r}return void 0===i&&(l.gas=await ae(e,Ce,"estimateGas")({...l,account:{address:s.address,type:"json-rpc"}})),(0,se.F)(l),l}async function Pe(e,{serializedTransaction:t}){return e.request({method:"eth_sendRawTransaction",params:[t]})}async function $e(e,t){const{account:r=e.account,chain:n=e.chain,accessList:i,data:o,gas:a,gasPrice:s,maxFeePerGas:c,maxPriorityFeePerGas:l,nonce:u,to:d,value:h,...p}=t;if(!r)throw new J({docsPath:"/docs/actions/wallet/sendTransaction"});const f=(0,U.T)(r);try{let r;if((0,se.F)(t),null!==n&&(r=await ae(e,G,"getChainId")({}),ee({currentChainId:r,chain:n})),"local"===f.type){const t=await ae(e,Ee,"prepareTransactionRequest")({account:f,accessList:i,chain:n,data:o,gas:a,gasPrice:s,maxFeePerGas:c,maxPriorityFeePerGas:l,nonce:u,to:d,value:h,...p});r||(r=await ae(e,G,"getChainId")({}));const g=n?.serializers?.transaction,w=await f.signTransaction({...t,chainId:r},{serializer:g});return await ae(e,Pe,"sendRawTransaction")({serializedTransaction:w})}const g=e.chain?.formatters?.transactionRequest?.format,w=(g||oe.tG)({...(0,ie.K)(p,{format:g}),accessList:i,data:o,from:f.address,gas:a,gasPrice:s,maxFeePerGas:c,maxPriorityFeePerGas:l,nonce:u,to:d,value:h});return await e.request({method:"eth_sendTransaction",params:[w]})}catch(e){throw function(e,{docsPath:t,...r}){const n=(()=>{const t=(0,ne.k)(e,r);return t instanceof te.cj?e:t})();return new re.mk(n,{docsPath:t,...r})}(e,{...t,account:f,chain:t.chain||void 0})}}var Se=a(5102),_e=a(6070),Ae=a(6087),Ie=a(9321),Oe=a(9135);const Te=/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/,Ne=/^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;function Re({domain:e,message:t,primaryType:r,types:n}){const i=n,o=(e,t)=>{for(const r of e){const{name:e,type:n}=r,a=n,s=t[e],c=a.match(Ne);if(c&&("number"==typeof s||"bigint"==typeof s)){const[e,t,r]=c;(0,q.eC)(s,{signed:"int"===t,size:parseInt(r)/8})}if("address"===a&&"string"==typeof s&&!(0,Ie.U)(s))throw new Ae.b({address:s});const l=a.match(Te);if(l){const[e,t]=l;if(t&&(0,Oe.d)(s)!==parseInt(t))throw new Z.KY({expectedSize:parseInt(t),givenSize:(0,Oe.d)(s)})}const u=i[a];u&&o(u,s)}};if(i.EIP712Domain&&e&&o(i.EIP712Domain,e),"EIP712Domain"!==r){const e=i[r];o(e,t)}}function je({domain:e}){return["string"==typeof e?.name&&{name:"name",type:"string"},e?.version&&{name:"version",type:"string"},"number"==typeof e?.chainId&&{name:"chainId",type:"uint256"},e?.verifyingContract&&{name:"verifyingContract",type:"address"},e?.salt&&{name:"salt",type:"bytes32"}].filter(Boolean)}var Be=a(7799);function Me(e){return{addChain:t=>async function(e,{chain:t}){const{id:r,name:n,nativeCurrency:i,rpcUrls:o,blockExplorers:a}=t;await e.request({method:"wallet_addEthereumChain",params:[{chainId:(0,q.eC)(r),chainName:n,nativeCurrency:i,rpcUrls:o.default.http,blockExplorerUrls:a?Object.values(a).map((({url:e})=>e)):void 0}]})}(e,t),deployContract:t=>function(e,{abi:t,args:r,bytecode:n,...i}){return $e(e,{...i,data:X({abi:t,args:r,bytecode:n})})}(e,t),getAddresses:()=>async function(e){return"local"===e.account?.type?[e.account.address]:(await e.request({method:"eth_accounts"})).map((e=>(0,f.x)(e)))}(e),getChainId:()=>G(e),getPermissions:()=>async function(e){return await e.request({method:"wallet_getPermissions"})}(e),prepareTransactionRequest:t=>Ee(e,t),requestAddresses:()=>async function(e){return(await e.request({method:"eth_requestAccounts"})).map((e=>(0,f.K)(e)))}(e),requestPermissions:t=>async function(e,t){return e.request({method:"wallet_requestPermissions",params:[t]})}(e,t),sendRawTransaction:t=>Pe(e,t),sendTransaction:t=>$e(e,t),signMessage:t=>async function(e,{account:t=e.account,message:r}){if(!t)throw new J({docsPath:"/docs/actions/wallet/signMessage"});const n=(0,U.T)(t);if("local"===n.type)return n.signMessage({message:r});const i="string"==typeof r?(0,q.$G)(r):r.raw instanceof Uint8Array?(0,q.NC)(r.raw):r.raw;return e.request({method:"personal_sign",params:[i,n.address]})}(e,t),signTransaction:t=>async function(e,t){const{account:r=e.account,chain:n=e.chain,...i}=t;if(!r)throw new J({docsPath:"/docs/actions/wallet/signTransaction"});const o=(0,U.T)(r);(0,se.F)({account:o,...t});const a=await ae(e,G,"getChainId")({});null!==n&&ee({currentChainId:a,chain:n});const s=n?.formatters||e.chain?.formatters,c=s?.transactionRequest?.format||oe.tG;return"local"===o.type?o.signTransaction({...i,chainId:a},{serializer:e.chain?.serializers?.transaction}):await e.request({method:"eth_signTransaction",params:[{...c(i),chainId:(0,q.eC)(a),from:o.address}]})}(e,t),signTypedData:t=>async function(e,{account:t=e.account,domain:r,message:n,primaryType:i,types:o}){if(!t)throw new J({docsPath:"/docs/actions/wallet/signTypedData"});const a=(0,U.T)(t),s={EIP712Domain:je({domain:r}),...o};if(Re({domain:r,message:n,primaryType:i,types:s}),"local"===a.type)return a.signTypedData({domain:r,primaryType:i,types:s,message:n});const c=(0,_e.P)({domain:r??{},primaryType:i,types:s,message:n},((e,t)=>(0,Se.v)(t)?t.toLowerCase():t));return e.request({method:"eth_signTypedData_v4",params:[a.address,c]})}(e,t),switchChain:t=>async function(e,{id:t}){await e.request({method:"wallet_switchEthereumChain",params:[{chainId:(0,q.eC)(t)}]})}(e,t),watchAsset:t=>async function(e,t){return await e.request({method:"wallet_watchAsset",params:t})}(e,t),writeContract:t=>async function(e,{abi:t,address:r,args:n,dataSuffix:i,functionName:o,...a}){const s=(0,Be.R)({abi:t,args:n,functionName:o});return await ae(e,$e,"sendTransaction")({data:`${s}${i?i.replace("0x",""):""}`,to:r,...a})}(e,t)}}function Ue(e){const{key:t="wallet",name:r="Wallet Client",transport:n}=e;return F({...e,key:t,name:r,transport:e=>n({...e,retryCount:0}),type:"walletClient"}).extend(Me)}async function Le(e){return new Promise((t=>setTimeout(t,e)))}function De(e,{delay:t=100,retryCount:r=2,shouldRetry:n=(()=>!0)}={}){return new Promise(((i,o)=>{const a=async({count:s=0}={})=>{try{const t=await e();i(t)}catch(e){if(s<r&&await n({count:s,error:e}))return(async({error:e})=>{const r="function"==typeof t?t({count:s,error:e}):t;r&&await Le(r),a({count:s+1})})({error:e});o(e)}};a()}))}const ze=e=>"code"in e?-1!==e.code&&-32004!==e.code&&-32005!==e.code&&-32042!==e.code&&-32603!==e.code:!!(e instanceof w.Gg&&e.status)&&403!==e.status&&408!==e.status&&413!==e.status&&429!==e.status&&500!==e.status&&502!==e.status&&503!==e.status&&504!==e.status;function We(e,{retryDelay:t=150,retryCount:r=3}={}){return async n=>De((async()=>{try{return await e(n)}catch(e){const t=e;switch(t.code){case y.code:throw new y(t);case v.code:throw new v(t);case x.code:throw new x(t);case C.code:throw new C(t);case k.code:throw new k(t);case E.code:throw new E(t);case P.code:throw new P(t);case $.code:throw new $(t);case S.code:throw new S(t);case _.code:throw new _(t);case A.code:throw new A(t);case I.code:throw new I(t);case O.code:throw new O(t);case T.code:throw new T(t);case N.code:throw new N(t);case R.code:throw new R(t);case j.code:throw new j(t);case B.code:throw new B(t);case 5e3:throw new O(t);default:if(e instanceof g.G)throw e;throw new M(t)}}}),{delay:({count:e,error:r})=>{if(r&&r instanceof w.Gg){const e=r?.headers?.get("Retry-After");if(e?.match(/\d/))return 1e3*parseInt(e)}return~~(1<<e)*t},retryCount:r,shouldRetry:({error:e})=>!ze(e)})}function Fe({key:e,name:t,request:r,retryCount:n=3,retryDelay:i=150,timeout:o,type:a},s){return{config:{key:e,name:t,request:r,retryCount:n,retryDelay:i,timeout:o,type:a},request:We(r,{retryCount:n,retryDelay:i}),value:s}}function He(e,t={}){const{key:r="custom",name:n="Custom Provider",retryDelay:i}=t;return({retryCount:o})=>Fe({key:r,name:n,request:e.request.bind(e),retryCount:t.retryCount??o,retryDelay:i,type:"custom"})}var Ge,qe,Ze,Ve=class extends p{constructor({chains:e,options:t}={}){const n={shimDisconnect:!0,getProvider(){if("undefined"==typeof window)return;const e=window.ethereum;return e?.providers&&e.providers.length>0?e.providers[0]:e},...t};super({chains:e,options:n}),this.id="injected",u(this,Ge,void 0),this.shimDisconnectKey=`${this.id}.shimDisconnect`,this.onAccountsChanged=e=>{0===e.length?this.emit("disconnect"):this.emit("change",{account:(0,f.K)(e[0])})},this.onChainChanged=e=>{const t=r(e),n=this.isChainUnsupported(t);this.emit("change",{chain:{id:t,unsupported:n}})},this.onDisconnect=async e=>{1013===e.code&&await this.getProvider()&&await this.getAccount()||(this.emit("disconnect"),this.options.shimDisconnect&&this.storage?.removeItem(this.shimDisconnectKey))};const i=n.getProvider();if("string"==typeof n.name)this.name=n.name;else if(i){const e=function(e){if(!e)return"Injected";const t=e=>e.isApexWallet?"Apex Wallet":e.isAvalanche?"Core Wallet":e.isBackpack?"Backpack":e.isBifrost?"Bifrost Wallet":e.isBitKeep?"BitKeep":e.isBitski?"Bitski":e.isBlockWallet?"BlockWallet":e.isBraveWallet?"Brave Wallet":e.isCoin98?"Coin98 Wallet":e.isCoinbaseWallet?"Coinbase Wallet":e.isDawn?"Dawn Wallet":e.isDefiant?"Defiant":e.isDesig?"Desig Wallet":e.isEnkrypt?"Enkrypt":e.isExodus?"Exodus":e.isFordefi?"Fordefi":e.isFrame?"Frame":e.isFrontier?"Frontier Wallet":e.isGamestop?"GameStop Wallet":e.isHaqqWallet?"HAQQ Wallet":e.isHyperPay?"HyperPay Wallet":e.isImToken?"ImToken":e.isHaloWallet?"Halo Wallet":e.isKuCoinWallet?"KuCoin Wallet":e.isMathWallet?"MathWallet":e.isNovaWallet?"Nova Wallet":e.isOkxWallet||e.isOKExWallet?"OKX Wallet":e.isOktoWallet?"Okto Wallet":e.isOneInchIOSWallet||e.isOneInchAndroidWallet?"1inch Wallet":e.isOneKey?"OneKey Wallet":e.isOpera?"Opera":e.isPhantom?"Phantom":e.isPortal?"Ripio Portal":e.isRabby?"Rabby Wallet":e.isRainbow?"Rainbow":e.isSafePal?"SafePal Wallet":e.isStatus?"Status":e.isSubWallet?"SubWallet":e.isTalisman?"Talisman":e.isTally?"Taho":e.isTokenPocket?"TokenPocket":e.isTokenary?"Tokenary":e.isTrust||e.isTrustWallet?"Trust Wallet":e.isTTWallet?"TTWallet":e.isXDEFI?"XDEFI Wallet":e.isZeal?"Zeal":e.isZerion?"Zerion":e.isMetaMask?"MetaMask":void 0;if(e.providers?.length){const r=new Set;let n=1;for(const i of e.providers){let e=t(i);e||(e=`Unknown Wallet #${n}`,n+=1),r.add(e)}const i=[...r];return i.length?i:i[0]??"Injected"}return t(e)??"Injected"}(i);n.name?this.name=n.name(e):this.name="string"==typeof e?e:e[0]}else this.name="Injected";this.ready=!!i}async connect({chainId:e}={}){try{const r=await this.getProvider();if(!r)throw new t;r.on&&(r.on("accountsChanged",this.onAccountsChanged),r.on("chainChanged",this.onChainChanged),r.on("disconnect",this.onDisconnect)),this.emit("message",{type:"connecting"});const n=await r.request({method:"eth_requestAccounts"}),i=(0,f.K)(n[0]);let o=await this.getChainId(),a=this.isChainUnsupported(o);return e&&o!==e&&(o=(await this.switchChain(e)).id,a=this.isChainUnsupported(o)),this.options.shimDisconnect&&this.storage?.setItem(this.shimDisconnectKey,!0),{account:i,chain:{id:o,unsupported:a}}}catch(e){if(this.isUserRejectedRequestError(e))throw new O(e);if(-32002===e.code)throw new $(e);throw e}}async disconnect(){const e=await this.getProvider();e?.removeListener&&(e.removeListener("accountsChanged",this.onAccountsChanged),e.removeListener("chainChanged",this.onChainChanged),e.removeListener("disconnect",this.onDisconnect),this.options.shimDisconnect&&this.storage?.removeItem(this.shimDisconnectKey))}async getAccount(){const e=await this.getProvider();if(!e)throw new t;const r=await e.request({method:"eth_accounts"});return(0,f.K)(r[0])}async getChainId(){const e=await this.getProvider();if(!e)throw new t;return e.request({method:"eth_chainId"}).then(r)}async getProvider(){const e=this.options.getProvider();return e&&d(this,Ge,e),l(this,Ge)}async getWalletClient({chainId:e}={}){const[t,r]=await Promise.all([this.getProvider(),this.getAccount()]),n=this.chains.find((t=>t.id===e));if(!t)throw new Error("provider is required.");return Ue({account:r,chain:n,transport:He(t)})}async isAuthorized(){try{if(this.options.shimDisconnect&&!this.storage?.getItem(this.shimDisconnectKey))return!1;if(!await this.getProvider())throw new t;return!!await this.getAccount()}catch{return!1}}async switchChain(r){const n=await this.getProvider();if(!n)throw new t;const i=(0,q.eC)(r);try{return await Promise.all([n.request({method:"wallet_switchEthereumChain",params:[{chainId:i}]}),new Promise((e=>this.on("change",(({chain:t})=>{t?.id===r&&e()}))))]),this.chains.find((e=>e.id===r))??{id:r,name:`Chain ${i}`,network:`${i}`,nativeCurrency:{name:"Ether",decimals:18,symbol:"ETH"},rpcUrls:{default:{http:[""]},public:{http:[""]}}}}catch(t){const o=this.chains.find((e=>e.id===r));if(!o)throw new e({chainId:r,connectorId:this.id});if(4902===t.code||4902===t?.data?.originalError?.code)try{if(await n.request({method:"wallet_addEthereumChain",params:[{chainId:i,chainName:o.name,nativeCurrency:o.nativeCurrency,rpcUrls:[o.rpcUrls.public?.http[0]??""],blockExplorerUrls:this.getBlockExplorerUrls(o)}]}),await this.getChainId()!==r)throw new O(new Error("User rejected switch after adding network."));return o}catch(e){throw new O(e)}if(this.isUserRejectedRequestError(t))throw new O(t);throw new B(t)}}async watchAsset({address:e,decimals:r=18,image:n,symbol:i}){const o=await this.getProvider();if(!o)throw new t;return o.request({method:"wallet_watchAsset",params:{type:"ERC20",options:{address:e,decimals:r,image:n,symbol:i}}})}isUserRejectedRequestError(e){return 4001===e.code}};function Ye(e=[],t=[]){return[...new Set([...e,...t])]}Ge=new WeakMap,qe=new WeakMap,Ze=new WeakMap,a(5501),a(512),a(1416),a(3294),a(7664),a(7466),a(6736),a(2873),a(5755),a(9528),a(3368),Object.defineProperty,Object.getOwnPropertySymbols,Object.prototype.hasOwnProperty,Object.prototype.propertyIsEnumerable,Object.defineProperty,Object.getOwnPropertySymbols,Object.prototype.hasOwnProperty,Object.prototype.propertyIsEnumerable;var Ke=Object.defineProperty,Xe=Object.defineProperties,Je=Object.getOwnPropertyDescriptors,Qe=Object.getOwnPropertySymbols,et=Object.prototype.hasOwnProperty,tt=Object.prototype.propertyIsEnumerable,rt=(e,t,r)=>t in e?Ke(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,nt=(e,t)=>{for(var r in t||(t={}))et.call(t,r)&&rt(e,r,t[r]);if(Qe)for(var r of Qe(t))tt.call(t,r)&&rt(e,r,t[r]);return e},it=(e,t)=>Xe(e,Je(t));function ot(e){return e.includes(":")}function at(e){return ot(e)?e.split(":")[0]:e}function st(e){var t,r,n;const i={};if(!function(e){return Object.getPrototypeOf(e)===Object.prototype&&Object.keys(e).length}(e))return i;for(const[o,a]of Object.entries(e)){const e=ot(o)?[o]:a.chains,s=a.methods||[],c=a.events||[],l=at(o);i[l]=it(nt({},i[l]),{chains:Ye(e,null==(t=i[l])?void 0:t.chains),methods:Ye(s,null==(r=i[l])?void 0:r.methods),events:Ye(c,null==(n=i[l])?void 0:n.events)})}return i}var ct,lt,ut,dt,ht,pt,ft,gt,wt,bt,mt,yt,vt,xt,Ct,kt,Et,Pt,$t,St,_t="eip155",At="requestedChains",It="wallet_addEthereumChain";ct=new WeakMap,lt=new WeakMap,ut=new WeakSet,dt=async function(){return l(this,lt)||"undefined"==typeof window||d(this,lt,h(this,ht,pt).call(this)),l(this,lt)},ht=new WeakSet,pt=async function(){const{EthereumProvider:e}=await a.e(228).then(a.bind(a,5228)),t=this.chains.map((({id:e})=>e));if(t.length){const{projectId:r,showQrModal:n=!0,qrModalOptions:i,metadata:o,relayUrl:a}=this.options;d(this,ct,await e.init({showQrModal:n,qrModalOptions:i,projectId:r,optionalChains:t,rpcMap:Object.fromEntries(this.chains.map((e=>[e.id,e.rpcUrls.default.http[0]]))),metadata:o,relayUrl:a}))}},ft=new WeakSet,gt=function(){if(h(this,$t,St).call(this).includes(It))return!1;if(!this.options.isNewChainsStale)return!1;const e=h(this,Ct,kt).call(this),t=this.chains.map((({id:e})=>e)),r=h(this,Et,Pt).call(this);return!(r.length&&!r.some((e=>t.includes(e)))||t.every((t=>e.includes(t))))},wt=new WeakSet,bt=function(){l(this,ct)&&(h(this,mt,yt).call(this),l(this,ct).on("accountsChanged",this.onAccountsChanged),l(this,ct).on("chainChanged",this.onChainChanged),l(this,ct).on("disconnect",this.onDisconnect),l(this,ct).on("session_delete",this.onDisconnect),l(this,ct).on("display_uri",this.onDisplayUri),l(this,ct).on("connect",this.onConnect))},mt=new WeakSet,yt=function(){l(this,ct)&&(l(this,ct).removeListener("accountsChanged",this.onAccountsChanged),l(this,ct).removeListener("chainChanged",this.onChainChanged),l(this,ct).removeListener("disconnect",this.onDisconnect),l(this,ct).removeListener("session_delete",this.onDisconnect),l(this,ct).removeListener("display_uri",this.onDisplayUri),l(this,ct).removeListener("connect",this.onConnect))},vt=new WeakSet,xt=function(e){this.storage?.setItem(At,e)},Ct=new WeakSet,kt=function(){return this.storage?.getItem(At)??[]},Et=new WeakSet,Pt=function(){if(!l(this,ct))return[];const e=l(this,ct).session?.namespaces;if(!e)return[];const t=st(e),r=t[_t]?.chains?.map((e=>parseInt(e.split(":")[1]||"")));return r??[]},$t=new WeakSet,St=function(){if(!l(this,ct))return[];const e=l(this,ct).session?.namespaces;if(!e)return[];const t=st(e),r=t[_t]?.methods;return r??[]};var Ot=(e,t,r)=>{if(!t.has(e))throw TypeError("Cannot "+r)},Tt=(e,t,r)=>(Ot(e,t,"read from private field"),r?r.call(e):t.get(e)),Nt=(e,t,r)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,r)},Rt=(e,t,r,n)=>(Ot(e,t,"write to private field"),n?n.call(e,r):t.set(e,r),r),jt=a(6693),Bt=a(7210),Mt=a(7864),Ut=a(1836),Lt=a(1746),Dt=a(5980);function zt(e,t){if(!(e instanceof g.G))return!1;const r=e.walk((e=>e instanceof Dt.Lu));return r instanceof Dt.Lu&&("ResolverNotFound"===r.data?.errorName||"ResolverWildcardNotSupported"===r.data?.errorName||!!r.reason?.includes("Wildcard on non-extended resolvers is not supported")||"reverse"===t&&r.reason===Lt.$[50])}var Wt=a(1187),Ft=a(3199);function Ht(e){if(66!==e.length)return null;if(0!==e.indexOf("["))return null;if(65!==e.indexOf("]"))return null;const t=`0x${e.slice(1,65)}`;return(0,Se.v)(t)?t:null}function Gt(e){let t=new Uint8Array(32).fill(0);if(!e)return(0,q.ci)(t);const r=e.split(".");for(let e=r.length-1;e>=0;e-=1){const n=Ht(r[e]),i=n?(0,Wt.O0)(n):(0,Ft.w)((0,Wt.qX)(r[e]),"bytes");t=(0,Ft.w)((0,V.zo)([t,i]),"bytes")}return(0,q.ci)(t)}function qt(e){const t=new Uint8Array(32).fill(0);return e?Ht(e)||(0,Ft.w)((0,Wt.qX)(e)):(0,q.ci)(t)}function Zt(e){const t=e.replace(/^\.|\.$/gm,"");if(0===t.length)return new Uint8Array(1);const r=new Uint8Array((0,Wt.qX)(t).byteLength+2);let n=0;const i=t.split(".");for(let e=0;e<i.length;e++){let t=(0,Wt.qX)(i[e]);t.byteLength>255&&(t=(0,Wt.qX)(`[${qt(i[e]).slice(2)}]`)),r[n]=t.length,r.set(t,n+1),n+=t.length+1}return r.byteLength!==n+1?r.slice(0,n+1):r}const Vt=3;function Yt(e,{abi:t,address:r,args:n,docsPath:i,functionName:o,sender:a}){const{code:s,data:c,message:l,shortMessage:u}=e instanceof Dt.VQ?e:e instanceof g.G?e.walk((e=>"data"in e))||e.walk():{},d=e instanceof Z.wb?new Dt.Dk({functionName:o}):[Vt,k.code].includes(s)&&(c||l||u)?new Dt.Lu({abi:t,data:"object"==typeof c?c.data:c,functionName:o,message:u??l}):e;return new Dt.uq(d,{abi:t,args:n,contractAddress:r,docsPath:i,functionName:o,sender:a})}var Kt=a(84);async function Xt(e,{abi:t,address:r,args:n,functionName:i,...o}){const a=(0,Be.R)({abi:t,args:n,functionName:i});try{const{data:s}=await ae(e,Kt.R,"call")({data:a,to:r,...o});return(0,Bt.k)({abi:t,args:n,functionName:i,data:s||"0x"})}catch(e){throw Yt(e,{abi:t,address:r,args:n,docsPath:"/docs/contract/readContract",functionName:i})}}class Jt extends g.G{constructor({data:e}){super("Unable to extract image from metadata. The metadata may be malformed or invalid.",{metaMessages:["- Metadata must be a JSON object with at least an `image`, `image_url` or `image_data` property.","",`Provided data: ${JSON.stringify(e)}`]}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"EnsAvatarInvalidMetadataError"})}}class Qt extends g.G{constructor({reason:e}){super(`ENS NFT avatar URI is invalid. ${e}`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"EnsAvatarInvalidNftUriError"})}}class er extends g.G{constructor({uri:e}){super(`Unable to resolve ENS avatar URI "${e}". The URI may be malformed, invalid, or does not respond with a valid image.`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"EnsAvatarUriResolutionError"})}}class tr extends g.G{constructor({namespace:e}){super(`ENS NFT avatar namespace "${e}" is not supported. Must be "erc721" or "erc1155".`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"EnsAvatarUnsupportedNamespaceError"})}}const rr=/(?<protocol>https?:\/\/[^\/]*|ipfs:\/|ipns:\/|ar:\/)?(?<root>\/)?(?<subpath>ipfs\/|ipns\/)?(?<target>[\w\-.]+)(?<subtarget>\/.*)?/,nr=/^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})(\/(?<target>[\w\-.]+))?(?<subtarget>\/.*)?$/,ir=/^data:([a-zA-Z\-/+]*);base64,([^"].*)/,or=/^data:([a-zA-Z\-/+]*)?(;[a-zA-Z0-9].*?)?(,)/;function ar(e,t){return e?e.endsWith("/")?e.slice(0,-1):e:t}function sr({uri:e,gatewayUrls:t}){const r=ir.test(e);if(r)return{uri:e,isOnChain:!0,isEncoded:r};const n=ar(t?.ipfs,"https://ipfs.io"),i=ar(t?.arweave,"https://arweave.net"),o=e.match(rr),{protocol:a,subpath:s,target:c,subtarget:l=""}=o?.groups||{},u="ipns:/"===a||"ipns/"===s,d="ipfs:/"===a||"ipfs/"===s||nr.test(e);if(e.startsWith("http")&&!u&&!d){let r=e;return t?.arweave&&(r=e.replace(/https:\/\/arweave.net/g,t?.arweave)),{uri:r,isOnChain:!1,isEncoded:!1}}if((u||d)&&c)return{uri:`${n}/${u?"ipns":"ipfs"}/${c}${l}`,isOnChain:!1,isEncoded:!1};if("ar:/"===a&&c)return{uri:`${i}/${c}${l||""}`,isOnChain:!1,isEncoded:!1};let h=e.replace(or,"");if(h.startsWith("<svg")&&(h=`data:image/svg+xml;base64,${btoa(h)}`),h.startsWith("data:")||h.startsWith("{"))return{uri:h,isOnChain:!0,isEncoded:!1};throw new er({uri:e})}function cr(e){if("object"!=typeof e||!("image"in e)&&!("image_url"in e)&&!("image_data"in e))throw new Jt({data:e});return e.image||e.image_url||e.image_data}async function lr({gatewayUrls:e,uri:t}){const{uri:r,isOnChain:n}=sr({uri:t,gatewayUrls:e});if(n)return r;const i=await async function(e){try{const t=await fetch(e,{method:"HEAD"});if(200===t.status){const e=t.headers.get("content-type");return e?.startsWith("image/")}return!1}catch(t){return("object"!=typeof t||void 0===t.response)&&!!globalThis.hasOwnProperty("Image")&&new Promise((t=>{const r=new Image;r.onload=()=>{t(!0)},r.onerror=()=>{t(!1)},r.src=e}))}}(r);if(i)return r;throw new er({uri:t})}async function ur(e,{blockNumber:t,blockTag:r,name:n,key:i,universalResolverAddress:o}){let a=o;if(!a){if(!e.chain)throw new Error("client chain not configured. universalResolverAddress is required.");a=(0,Mt.L)({blockNumber:t,chain:e.chain,contract:"ensUniversalResolver"})}try{const o=await ae(e,Xt,"readContract")({address:a,abi:jt.k3,functionName:"resolve",args:[(0,q.NC)(Zt(n)),(0,Be.R)({abi:jt.nZ,functionName:"text",args:[Gt(n),i]})],blockNumber:t,blockTag:r});if("0x"===o[0])return null;const s=(0,Bt.k)({abi:jt.nZ,functionName:"text",data:o[0]});return""===s?null:s}catch(e){if(zt(e,"resolve"))return null;throw e}}function dr(e,{method:t}){const r={};return"fallback"===e.transport.type&&e.transport.onResponse?.((({method:e,response:n,status:i,transport:o})=>{"success"===i&&t===e&&(r[n]=o.request)})),t=>r[t]||e.request}class hr extends g.G{constructor(e){super(`Filter type "${e}" is not supported.`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"FilterTypeNotSupportedError"})}}var pr=a(4092),fr=a(522),gr=a(840);function wr({abi:e,eventName:t,args:r}){let n=e[0];if(t&&(n=(0,gr.m)({abi:e,args:r,name:t}),!n))throw new Z.mv(t,{docsPath:"/docs/contract/encodeEventTopics"});if("event"!==n.type)throw new Z.mv(void 0,{docsPath:"/docs/contract/encodeEventTopics"});const i=(0,fr.t)(n),o=(0,pr.e)(i);let a=[];if(r&&"inputs"in n){const e=n.inputs?.filter((e=>"indexed"in e&&e.indexed)),t=Array.isArray(r)?r:Object.values(r).length>0?e?.map((e=>r[e.name]))??[]:[];t.length>0&&(a=e?.map(((e,r)=>Array.isArray(t[r])?t[r].map(((n,i)=>br({param:e,value:t[r][i]}))):t[r]?br({param:e,value:t[r]}):null))??[])}return[o,...a]}function br({param:e,value:t}){if("string"===e.type||"bytes"===e.type)return(0,Ft.w)((0,Wt.O0)(t));if("tuple"===e.type||e.type.match(/^(.*)\[(\d+)?\]$/))throw new hr(e.type);return(0,Y.E)([e],[t])}async function mr(e,{address:t,abi:r,args:n,eventName:i,fromBlock:o,strict:a,toBlock:s}){const c=dr(e,{method:"eth_newFilter"}),l=i?wr({abi:r,args:n,eventName:i}):void 0,u=await e.request({method:"eth_newFilter",params:[{address:t,fromBlock:"bigint"==typeof o?(0,q.eC)(o):o,toBlock:"bigint"==typeof s?(0,q.eC)(s):s,topics:l}]});return{abi:r,args:n,eventName:i,id:u,request:c(u),strict:a,type:"event"}}async function yr(e,{address:t,args:r,event:n,events:i,fromBlock:o,strict:a,toBlock:s}={}){const c=i??(n?[n]:void 0),l=dr(e,{method:"eth_newFilter"});let u=[];c&&(u=[c.flatMap((e=>wr({abi:[e],eventName:e.name,args:r})))],n&&(u=u[0]));const d=await e.request({method:"eth_newFilter",params:[{address:t,fromBlock:"bigint"==typeof o?(0,q.eC)(o):o,toBlock:"bigint"==typeof s?(0,q.eC)(s):s,...u.length?{topics:u}:{}}]});return{abi:c,args:r,eventName:n?n.name:void 0,fromBlock:o,id:d,request:l(d),strict:a,toBlock:s,type:"event"}}async function vr(e){const t=dr(e,{method:"eth_newPendingTransactionFilter"}),r=await e.request({method:"eth_newPendingTransactionFilter"});return{id:r,request:t(r),type:"transaction"}}const xr=new Map,Cr=new Map;const kr=e=>`blockNumber.${e}`;async function Er(e,{cacheTime:t=e.cacheTime,maxAge:r}={}){const n=await async function(e,{cacheKey:t,cacheTime:r=1/0}){const n=function(e){const t=(e,t)=>({clear:()=>t.delete(e),get:()=>t.get(e),set:r=>t.set(e,r)}),r=t(e,xr),n=t(e,Cr);return{clear:()=>{r.clear(),n.clear()},promise:r,response:n}}(t),i=n.response.get();if(i&&r>0&&(new Date).getTime()-i.created.getTime()<r)return i.data;let o=n.promise.get();o||(o=e(),n.promise.set(o));try{const e=await o;return n.response.set({created:new Date,data:e}),e}finally{n.promise.clear()}}((()=>e.request({method:"eth_blockNumber"})),{cacheKey:kr(e.uid),cacheTime:r??t});return BigInt(n)}var Pr=a(4450);const $r="/docs/contract/decodeEventLog";function Sr({abi:e,data:t,strict:r,topics:n}){const i=r??!0,[o,...a]=n;if(!o)throw new Z.FM({docsPath:$r});const s=e.find((e=>"event"===e.type&&o===(0,pr.e)((0,fr.t)(e))));if(!s||!("name"in s)||"event"!==s.type)throw new Z.lC(o,{docsPath:$r});const{name:c,inputs:l}=s,u=l?.some((e=>!("name"in e&&e.name)));let d=u?[]:{};const h=l.filter((e=>"indexed"in e&&e.indexed));for(let e=0;e<h.length;e++){const t=h[e],r=a[e];if(!r)throw new Z.Gy({abiItem:s,param:t});d[t.name||e]=_r({param:t,value:r})}const p=l.filter((e=>!("indexed"in e&&e.indexed)));if(p.length>0)if(t&&"0x"!==t)try{const e=(0,Pr.r)(p,t);if(e)if(u)d=[...d,...e];else for(let t=0;t<p.length;t++)d[p[t].name]=e[t]}catch(e){if(i){if(e instanceof Z.xB)throw new Z.SM({abiItem:s,data:e.data,params:e.params,size:e.size});throw e}}else if(i)throw new Z.SM({abiItem:s,data:"0x",params:p,size:0});return{eventName:c,args:Object.values(d).length>0?d:void 0}}function _r({param:e,value:t}){return"string"===e.type||"bytes"===e.type||"tuple"===e.type||e.type.match(/^(.*)\[(\d+)?\]$/)?t:((0,Pr.r)([e],t)||[])[0]}function Ar(e,{args:t,eventName:r}={}){return{...e,blockHash:e.blockHash?e.blockHash:null,blockNumber:e.blockNumber?BigInt(e.blockNumber):null,logIndex:e.logIndex?Number(e.logIndex):null,transactionHash:e.transactionHash?e.transactionHash:null,transactionIndex:e.transactionIndex?Number(e.transactionIndex):null,...r?{args:t,eventName:r}:{}}}async function Ir(e,{address:t,blockHash:r,fromBlock:n,toBlock:i,event:o,events:a,args:s,strict:c}={}){const l=c??!1,u=a??(o?[o]:void 0);let d,h=[];return u&&(h=[u.flatMap((e=>wr({abi:[e],eventName:e.name,args:s})))],o&&(h=h[0])),d=r?await e.request({method:"eth_getLogs",params:[{address:t,topics:h,blockHash:r}]}):await e.request({method:"eth_getLogs",params:[{address:t,topics:h,fromBlock:"bigint"==typeof n?(0,q.eC)(n):n,toBlock:"bigint"==typeof i?(0,q.eC)(i):i}]}),d.map((e=>{try{const{eventName:t,args:r}=u?Sr({abi:u,data:e.data,topics:e.topics,strict:l}):{eventName:void 0,args:void 0};return Ar(e,{args:r,eventName:t})}catch(t){let r,n;if(t instanceof Z.SM||t instanceof Z.Gy){if(l)return;r=t.abiItem.name,n=t.abiItem.inputs?.some((e=>!("name"in e&&e.name)))}return Ar(e,{args:n?[]:{},eventName:r})}})).filter(Boolean)}async function Or(e,{abi:t,address:r,args:n,blockHash:i,eventName:o,fromBlock:a,toBlock:s,strict:c}){const l=o?(0,gr.m)({abi:t,name:o}):void 0,u=l?void 0:t.filter((e=>"event"===e.type));return ae(e,Ir,"getLogs")({address:r,args:n,blockHash:i,event:l,events:u,fromBlock:a,toBlock:s,strict:c})}async function Tr(e,{filter:t}){const r="strict"in t&&t.strict;return(await t.request({method:"eth_getFilterChanges",params:[t.id]})).map((e=>{if("string"==typeof e)return e;try{const{eventName:n,args:i}="abi"in t&&t.abi?Sr({abi:t.abi,data:e.data,topics:e.topics,strict:r}):{eventName:void 0,args:void 0};return Ar(e,{args:i,eventName:n})}catch(r){let n,i;if(r instanceof Z.SM||r instanceof Z.Gy){if("strict"in t&&t.strict)return;n=r.abiItem.name,i=r.abiItem.inputs?.some((e=>!("name"in e&&e.name)))}return Ar(e,{args:i?[]:{},eventName:n})}})).filter(Boolean)}async function Nr(e,{blockHash:t,blockNumber:r,blockTag:n,hash:i,index:o}){const a=n||"latest",s=void 0!==r?(0,q.eC)(r):void 0;let c=null;if(i?c=await e.request({method:"eth_getTransactionByHash",params:[i]}):t?c=await e.request({method:"eth_getTransactionByBlockHashAndIndex",params:[t,(0,q.eC)(o)]}):(s||a)&&(c=await e.request({method:"eth_getTransactionByBlockNumberAndIndex",params:[s||a,(0,q.eC)(o)]})),!c)throw new re.Bh({blockHash:t,blockNumber:r,blockTag:a,hash:i,index:o});return(e.chain?.formatters?.transaction?.format||fe)(c)}const Rr={"0x0":"reverted","0x1":"success"};function jr(e){return{...e,blockNumber:e.blockNumber?BigInt(e.blockNumber):null,contractAddress:e.contractAddress?e.contractAddress:null,cumulativeGasUsed:e.cumulativeGasUsed?BigInt(e.cumulativeGasUsed):null,effectiveGasPrice:e.effectiveGasPrice?BigInt(e.effectiveGasPrice):null,gasUsed:e.gasUsed?BigInt(e.gasUsed):null,logs:e.logs?e.logs.map((e=>Ar(e))):null,to:e.to?e.to:null,transactionIndex:e.transactionIndex?(0,H.ly)(e.transactionIndex):null,status:e.status?Rr[e.status]:null,type:e.type?pe[e.type]||e.type:null}}async function Br(e,{hash:t}){const r=await e.request({method:"eth_getTransactionReceipt",params:[t]});if(!r)throw new re.Yb({hash:t});return(e.chain?.formatters?.transactionReceipt?.format||jr)(r)}async function Mr(e,{filter:t}){return t.request({method:"eth_uninstallFilter",params:[t.id]})}const Ur="Ethereum Signed Message:\n",Lr="0x60806040523480156200001157600080fd5b50604051620007003803806200070083398101604081905262000034916200056f565b6000620000438484846200004f565b9050806000526001601ff35b600080846001600160a01b0316803b806020016040519081016040528181526000908060200190933c90507f6492649264926492649264926492649264926492649264926492649264926492620000a68462000451565b036200021f57600060608085806020019051810190620000c79190620005ce565b8651929550909350915060000362000192576000836001600160a01b031683604051620000f5919062000643565b6000604051808303816000865af19150503d806000811462000134576040519150601f19603f3d011682016040523d82523d6000602084013e62000139565b606091505b5050905080620001905760405162461bcd60e51b815260206004820152601e60248201527f5369676e617475726556616c696461746f723a206465706c6f796d656e74000060448201526064015b60405180910390fd5b505b604051630b135d3f60e11b808252906001600160a01b038a1690631626ba7e90620001c4908b90869060040162000661565b602060405180830381865afa158015620001e2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200020891906200069d565b6001600160e01b031916149450505050506200044a565b805115620002b157604051630b135d3f60e11b808252906001600160a01b03871690631626ba7e9062000259908890889060040162000661565b602060405180830381865afa15801562000277573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200029d91906200069d565b6001600160e01b031916149150506200044a565b8251604114620003195760405162461bcd60e51b815260206004820152603a6024820152600080516020620006e083398151915260448201527f3a20696e76616c6964207369676e6174757265206c656e677468000000000000606482015260840162000187565b620003236200046b565b506020830151604080850151855186939260009185919081106200034b576200034b620006c9565b016020015160f81c9050601b81148015906200036b57508060ff16601c14155b15620003cf5760405162461bcd60e51b815260206004820152603b6024820152600080516020620006e083398151915260448201527f3a20696e76616c6964207369676e617475726520762076616c75650000000000606482015260840162000187565b6040805160008152602081018083528a905260ff83169181019190915260608101849052608081018390526001600160a01b038a169060019060a0016020604051602081039080840390855afa1580156200042e573d6000803e3d6000fd5b505050602060405103516001600160a01b031614955050505050505b9392505050565b60006020825110156200046357600080fd5b508051015190565b60405180606001604052806003906020820280368337509192915050565b6001600160a01b03811681146200049f57600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b60005b83811015620004d5578181015183820152602001620004bb565b50506000910152565b600082601f830112620004f057600080fd5b81516001600160401b03808211156200050d576200050d620004a2565b604051601f8301601f19908116603f01168101908282118183101715620005385762000538620004a2565b816040528381528660208588010111156200055257600080fd5b62000565846020830160208901620004b8565b9695505050505050565b6000806000606084860312156200058557600080fd5b8351620005928162000489565b6020850151604086015191945092506001600160401b03811115620005b657600080fd5b620005c486828701620004de565b9150509250925092565b600080600060608486031215620005e457600080fd5b8351620005f18162000489565b60208501519093506001600160401b03808211156200060f57600080fd5b6200061d87838801620004de565b935060408601519150808211156200063457600080fd5b50620005c486828701620004de565b6000825162000657818460208701620004b8565b9190910192915050565b828152604060208201526000825180604084015262000688816060850160208701620004b8565b601f01601f1916919091016060019392505050565b600060208284031215620006b057600080fd5b81516001600160e01b0319811681146200044a57600080fd5b634e487b7160e01b600052603260045260246000fdfe5369676e617475726556616c696461746f72237265636f7665725369676e6572";async function Dr(e,{address:t,hash:r,signature:n,...i}){const o=(0,Se.v)(n)?n:(0,q.NC)(n);try{const{data:n}=await ae(e,Kt.R,"call")({data:X({abi:jt.$o,args:[t,r,o],bytecode:Lr}),...i});return a=n??"0x0",s="0x1",function(e,t){if(e.length!==t.length)return!1;for(let r=0;r<e.length;r++)if(e[r]!==t[r])return!1;return!0}((0,Se.v)(a)?(0,Wt.O0)(a):a,(0,Se.v)(s)?(0,Wt.O0)(s):s)}catch(e){if(e instanceof Dt.cg)return!1;throw e}var a,s}function zr({domain:e,message:t,primaryType:r,types:n}){const i=void 0===e?{}:e,o={EIP712Domain:je({domain:i}),...n};Re({domain:i,message:t,primaryType:r,types:o});const a=["0x1901"];return i&&a.push(function({domain:e,types:t}){return Wr({data:e,primaryType:"EIP712Domain",types:t})}({domain:i,types:o})),"EIP712Domain"!==r&&a.push(Wr({data:t,primaryType:r,types:o})),(0,Ft.w)((0,V.zo)(a))}function Wr({data:e,primaryType:t,types:r}){const n=Fr({data:e,primaryType:t,types:r});return(0,Ft.w)(n)}function Fr({data:e,primaryType:t,types:r}){const n=[{type:"bytes32"}],i=[Hr({primaryType:t,types:r})];for(const o of r[t]){const[t,a]=qr({types:r,name:o.name,type:o.type,value:e[o.name]});n.push(t),i.push(a)}return(0,Y.E)(n,i)}function Hr({primaryType:e,types:t}){const r=(0,q.NC)(function({primaryType:e,types:t}){let r="";const n=Gr({primaryType:e,types:t});n.delete(e);const i=[e,...Array.from(n).sort()];for(const e of i)r+=`${e}(${t[e].map((({name:e,type:t})=>`${t} ${e}`)).join(",")})`;return r}({primaryType:e,types:t}));return(0,Ft.w)(r)}function Gr({primaryType:e,types:t},r=new Set){const n=e.match(/^\w*/u),i=n?.[0];if(r.has(i)||void 0===t[i])return r;r.add(i);for(const e of t[i])Gr({primaryType:e.type,types:t},r);return r}function qr({types:e,name:t,type:r,value:n}){if(void 0!==e[r])return[{type:"bytes32"},(0,Ft.w)(Fr({data:n,primaryType:r,types:e}))];if("bytes"===r)return n="0x"+((n.length%2?"0":"")+n.slice(2)),[{type:"bytes32"},(0,Ft.w)(n)];if("string"===r)return[{type:"bytes32"},(0,Ft.w)((0,q.NC)(n))];if(r.lastIndexOf("]")===r.length-1){const i=r.slice(0,r.lastIndexOf("[")),o=n.map((r=>qr({name:t,type:i,types:e,value:r})));return[{type:"bytes32"},(0,Ft.w)((0,Y.E)(o.map((([e])=>e)),o.map((([,e])=>e))))]}return[{type:r},n]}BigInt(0),BigInt(1),BigInt(2);const Zr=new Map,Vr=new Map;let Yr=0;function Kr(e,t,r){const n=++Yr,i=()=>Zr.get(e)||[],o=()=>{const t=Vr.get(e);1===i().length&&t&&t(),(()=>{const t=i();Zr.set(e,t.filter((e=>e.id!==n)))})()},a=i();if(Zr.set(e,[...a,{id:n,fns:t}]),a&&a.length>0)return o;const s={};for(const e in t)s[e]=(...t)=>{const r=i();if(0!==r.length)for(const n of r)n.fns[e]?.(...t)};const c=r(s);return"function"==typeof c&&Vr.set(e,c),o}function Xr(e,{emitOnBegin:t,initialWaitTime:r,interval:n}){let i=!0;const o=()=>i=!1;return(async()=>{let a;t&&(a=await e({unpoll:o}));const s=await(r?.(a))??n;await Le(s);const c=async()=>{i&&(await e({unpoll:o}),await Le(n),c())};c()})(),o}function Jr(e,{emitOnBegin:t=!1,emitMissed:r=!1,onBlockNumber:n,onError:i,poll:o,pollingInterval:a=e.pollingInterval}){let s;return(void 0!==o?o:"webSocket"!==e.transport.type)?Kr((0,_e.P)(["watchBlockNumber",e.uid,t,r,a]),{onBlockNumber:n,onError:i},(n=>Xr((async()=>{try{const t=await ae(e,Er,"getBlockNumber")({cacheTime:0});if(s){if(t===s)return;if(t-s>1&&r)for(let e=s+1n;e<t;e++)n.onBlockNumber(e,s),s=e}(!s||t>s)&&(n.onBlockNumber(t,s),s=t)}catch(e){n.onError?.(e)}}),{emitOnBegin:t,interval:a}))):(()=>{let t=!0,r=()=>t=!1;return(async()=>{try{const{unsubscribe:o}=await e.transport.subscribe({params:["newHeads"],onData(e){if(!t)return;const r=(0,H.y_)(e.result?.number);n(r,s),s=r},onError(e){i?.(e)}});r=o,t||r()}catch(e){i?.(e)}})(),r})()}function Qr(e){return{call:t=>(0,Kt.R)(e,t),createBlockFilter:()=>async function(e){const t=dr(e,{method:"eth_newBlockFilter"}),r=await e.request({method:"eth_newBlockFilter"});return{id:r,request:t(r),type:"block"}}(e),createContractEventFilter:t=>mr(e,t),createEventFilter:t=>yr(e,t),createPendingTransactionFilter:()=>vr(e),estimateContractGas:t=>async function(e,{abi:t,address:r,args:n,functionName:i,...o}){const a=(0,Be.R)({abi:t,args:n,functionName:i});try{return await ae(e,Ce,"estimateGas")({data:a,to:r,...o})}catch(e){const a=o.account?(0,U.T)(o.account):void 0;throw Yt(e,{abi:t,address:r,args:n,docsPath:"/docs/contract/estimateContractGas",functionName:i,sender:a?.address})}}(e,t),estimateGas:t=>Ce(e,t),getBalance:t=>async function(e,{address:t,blockNumber:r,blockTag:n="latest"}){const i=r?(0,q.eC)(r):void 0,o=await e.request({method:"eth_getBalance",params:[t,i||n]});return BigInt(o)}(e,t),getBlock:t=>we(e,t),getBlockNumber:t=>Er(e,t),getBlockTransactionCount:t=>async function(e,{blockHash:t,blockNumber:r,blockTag:n="latest"}={}){const i=void 0!==r?(0,q.eC)(r):void 0;let o;return o=t?await e.request({method:"eth_getBlockTransactionCountByHash",params:[t]}):await e.request({method:"eth_getBlockTransactionCountByNumber",params:[i||n]}),(0,H.ly)(o)}(e,t),getBytecode:t=>async function(e,{address:t,blockNumber:r,blockTag:n="latest"}){const i=void 0!==r?(0,q.eC)(r):void 0,o=await e.request({method:"eth_getCode",params:[t,i||n]});if("0x"!==o)return o}(e,t),getChainId:()=>G(e),getContractEvents:t=>Or(e,t),getEnsAddress:t=>async function(e,{blockNumber:t,blockTag:r,coinType:n,name:i,universalResolverAddress:o}){let a=o;if(!a){if(!e.chain)throw new Error("client chain not configured. universalResolverAddress is required.");a=(0,Mt.L)({blockNumber:t,chain:e.chain,contract:"ensUniversalResolver"})}try{const o=(0,Be.R)({abi:jt.X$,functionName:"addr",...null!=n?{args:[Gt(i),BigInt(n)]}:{args:[Gt(i)]}}),s=await ae(e,Xt,"readContract")({address:a,abi:jt.k3,functionName:"resolve",args:[(0,q.NC)(Zt(i)),o],blockNumber:t,blockTag:r});if("0x"===s[0])return null;const c=(0,Bt.k)({abi:jt.X$,args:null!=n?[Gt(i),BigInt(n)]:void 0,functionName:"addr",data:s[0]});return"0x"===c||"0x00"===(0,Ut.f)(c)?null:c}catch(e){if(zt(e,"resolve"))return null;throw e}}(e,t),getEnsAvatar:t=>async function(e,{blockNumber:t,blockTag:r,gatewayUrls:n,name:i,universalResolverAddress:o}){const a=await ae(e,ur,"getEnsText")({blockNumber:t,blockTag:r,key:"avatar",name:i,universalResolverAddress:o});if(!a)return null;try{return await async function(e,{gatewayUrls:t,record:r}){return/eip155:/i.test(r)?async function(e,{gatewayUrls:t,record:r}){const n=function(e){let t=e;t.startsWith("did:nft:")&&(t=t.replace("did:nft:","").replace(/_/g,"/"));const[r,n,i]=t.split("/"),[o,a]=r.split(":"),[s,c]=n.split(":");if(!o||"eip155"!==o.toLowerCase())throw new Qt({reason:"Only EIP-155 supported"});if(!a)throw new Qt({reason:"Chain ID not found"});if(!c)throw new Qt({reason:"Contract address not found"});if(!i)throw new Qt({reason:"Token ID not found"});if(!s)throw new Qt({reason:"ERC namespace not found"});return{chainID:parseInt(a),namespace:s.toLowerCase(),contractAddress:c,tokenID:i}}(r),i=await async function(e,{nft:t}){if("erc721"===t.namespace)return Xt(e,{address:t.contractAddress,abi:[{name:"tokenURI",type:"function",stateMutability:"view",inputs:[{name:"tokenId",type:"uint256"}],outputs:[{name:"",type:"string"}]}],functionName:"tokenURI",args:[BigInt(t.tokenID)]});if("erc1155"===t.namespace)return Xt(e,{address:t.contractAddress,abi:[{name:"uri",type:"function",stateMutability:"view",inputs:[{name:"_id",type:"uint256"}],outputs:[{name:"",type:"string"}]}],functionName:"uri",args:[BigInt(t.tokenID)]});throw new tr({namespace:t.namespace})}(e,{nft:n}),{uri:o,isOnChain:a,isEncoded:s}=sr({uri:i,gatewayUrls:t});if(a&&(o.includes("data:application/json;base64,")||o.startsWith("{"))){const e=s?atob(o.replace("data:application/json;base64,","")):o;return lr({uri:cr(JSON.parse(e)),gatewayUrls:t})}let c=n.tokenID;return"erc1155"===n.namespace&&(c=c.replace("0x","").padStart(64,"0")),async function({gatewayUrls:e,uri:t}){try{const r=await fetch(t).then((e=>e.json()));return await lr({gatewayUrls:e,uri:cr(r)})}catch{throw new er({uri:t})}}({gatewayUrls:t,uri:o.replace(/(?:0x)?{id}/,c)})}(e,{gatewayUrls:t,record:r}):lr({uri:r,gatewayUrls:t})}(e,{record:a,gatewayUrls:n})}catch{return null}}(e,t),getEnsName:t=>async function(e,{address:t,blockNumber:r,blockTag:n,universalResolverAddress:i}){let o=i;if(!o){if(!e.chain)throw new Error("client chain not configured. universalResolverAddress is required.");o=(0,Mt.L)({blockNumber:r,chain:e.chain,contract:"ensUniversalResolver"})}const a=`${t.toLowerCase().substring(2)}.addr.reverse`;try{const[i,s]=await ae(e,Xt,"readContract")({address:o,abi:jt.du,functionName:"reverse",args:[(0,q.NC)(Zt(a))],blockNumber:r,blockTag:n});return t.toLowerCase()!==s.toLowerCase()?null:i}catch(e){if(zt(e,"reverse"))return null;throw e}}(e,t),getEnsResolver:t=>async function(e,{blockNumber:t,blockTag:r,name:n,universalResolverAddress:i}){let o=i;if(!o){if(!e.chain)throw new Error("client chain not configured. universalResolverAddress is required.");o=(0,Mt.L)({blockNumber:t,chain:e.chain,contract:"ensUniversalResolver"})}const[a]=await ae(e,Xt,"readContract")({address:o,abi:[{inputs:[{type:"bytes"}],name:"findResolver",outputs:[{type:"address"},{type:"bytes32"}],stateMutability:"view",type:"function"}],functionName:"findResolver",args:[(0,q.NC)(Zt(n))],blockNumber:t,blockTag:r});return a}(e,t),getEnsText:t=>ur(e,t),getFeeHistory:t=>async function(e,{blockCount:t,blockNumber:r,blockTag:n="latest",rewardPercentiles:i}){const o=r?(0,q.eC)(r):void 0;return{baseFeePerGas:(a=await e.request({method:"eth_feeHistory",params:[(0,q.eC)(t),o||n,i]})).baseFeePerGas.map((e=>BigInt(e))),gasUsedRatio:a.gasUsedRatio,oldestBlock:BigInt(a.oldestBlock),reward:a.reward?.map((e=>e.map((e=>BigInt(e)))))};var a}(e,t),estimateFeesPerGas:t=>async function(e,t){return ye(e,t)}(e,t),getFilterChanges:e=>Tr(0,e),getFilterLogs:e=>async function(e,{filter:t}){const r=t.strict??!1;return(await t.request({method:"eth_getFilterLogs",params:[t.id]})).map((e=>{try{const{eventName:n,args:i}="abi"in t&&t.abi?Sr({abi:t.abi,data:e.data,topics:e.topics,strict:r}):{eventName:void 0,args:void 0};return Ar(e,{args:i,eventName:n})}catch(r){let n,i;if(r instanceof Z.SM||r instanceof Z.Gy){if("strict"in t&&t.strict)return;n=r.abiItem.name,i=r.abiItem.inputs?.some((e=>!("name"in e&&e.name)))}return Ar(e,{args:i?[]:{},eventName:n})}})).filter(Boolean)}(0,e),getGasPrice:()=>be(e),getLogs:t=>Ir(e,t),getProof:t=>async function(e,{address:t,blockNumber:r,blockTag:n,storageKeys:i}){const o=n??"latest",a=void 0!==r?(0,q.eC)(r):void 0;return s=await e.request({method:"eth_getProof",params:[t,i,a||o]}),{...s,balance:s.balance?BigInt(s.balance):void 0,nonce:s.nonce?(0,H.ly)(s.nonce):void 0,storageProof:s.storageProof?(c=s.storageProof,c.map((e=>({...e,value:BigInt(e.value)})))):void 0};var s,c}(e,t),estimateMaxPriorityFeePerGas:t=>async function(e,t){return me(e,t)}(e,t),getStorageAt:t=>async function(e,{address:t,blockNumber:r,blockTag:n="latest",slot:i}){const o=void 0!==r?(0,q.eC)(r):void 0;return await e.request({method:"eth_getStorageAt",params:[t,i,o||n]})}(e,t),getTransaction:t=>Nr(e,t),getTransactionConfirmations:t=>async function(e,{hash:t,transactionReceipt:r}){const[n,i]=await Promise.all([ae(e,Er,"getBlockNumber")({}),t?ae(e,Nr,"getBlockNumber")({hash:t}):void 0]),o=r?.blockNumber||i?.blockNumber;return o?n-o+1n:0n}(e,t),getTransactionCount:t=>ke(e,t),getTransactionReceipt:t=>Br(e,t),multicall:t=>async function(e,t){const{allowFailure:r=!0,batchSize:n,blockNumber:i,blockTag:o,contracts:a,multicallAddress:s}=t,c=n??("object"==typeof e.batch?.multicall&&e.batch.multicall.batchSize||1024);let l=s;if(!l){if(!e.chain)throw new Error("client chain not configured. multicallAddress is required.");l=(0,Mt.L)({blockNumber:i,chain:e.chain,contract:"multicall3"})}const u=[[]];let d=0,h=0;for(let e=0;e<a.length;e++){const{abi:t,address:n,args:i,functionName:o}=a[e];try{const e=(0,Be.R)({abi:t,args:i,functionName:o});h+=(e.length-2)/2,c>0&&h>c&&u[d].length>0&&(d++,h=(e.length-2)/2,u[d]=[]),u[d]=[...u[d],{allowFailure:!0,callData:e,target:n}]}catch(e){const a=Yt(e,{abi:t,address:n,args:i,docsPath:"/docs/contract/multicall",functionName:o});if(!r)throw a;u[d]=[...u[d],{allowFailure:!0,callData:"0x",target:n}]}}const p=await Promise.allSettled(u.map((t=>ae(e,Xt,"readContract")({abi:jt.F8,address:l,args:[t],blockNumber:i,blockTag:o,functionName:"aggregate3"})))),f=[];for(let e=0;e<p.length;e++){const t=p[e];if("rejected"===t.status){if(!r)throw t.reason;for(let r=0;r<u[e].length;r++)f.push({status:"failure",error:t.reason,result:void 0});continue}const n=t.value;for(let t=0;t<n.length;t++){const{returnData:i,success:o}=n[t],{callData:s}=u[e][t],{abi:c,address:l,functionName:d,args:h}=a[f.length];try{if("0x"===s)throw new Z.wb;if(!o)throw new Dt.VQ({data:i});const e=(0,Bt.k)({abi:c,args:h,data:i,functionName:d});f.push(r?{result:e,status:"success"}:e)}catch(e){const t=Yt(e,{abi:c,address:l,args:h,docsPath:"/docs/contract/multicall",functionName:d});if(!r)throw t;f.push({error:t,result:void 0,status:"failure"})}}}if(f.length!==a.length)throw new g.G("multicall results mismatch");return f}(e,t),prepareTransactionRequest:t=>Ee(e,t),readContract:t=>Xt(e,t),sendRawTransaction:t=>Pe(e,t),simulateContract:t=>async function(e,{abi:t,address:r,args:n,dataSuffix:i,functionName:o,...a}){const s=a.account?(0,U.T)(a.account):void 0,c=(0,Be.R)({abi:t,args:n,functionName:o});try{const{data:s}=await ae(e,Kt.R,"call")({batch:!1,data:`${c}${i?i.replace("0x",""):""}`,to:r,...a});return{result:(0,Bt.k)({abi:t,args:n,functionName:o,data:s||"0x"}),request:{abi:t,address:r,args:n,dataSuffix:i,functionName:o,...a}}}catch(e){throw Yt(e,{abi:t,address:r,args:n,docsPath:"/docs/contract/simulateContract",functionName:o,sender:s?.address})}}(e,t),verifyMessage:t=>async function(e,{address:t,message:r,signature:n,...i}){const o=function(e,t){const r="string"==typeof e?(0,Wt.qX)(e):e.raw instanceof Uint8Array?e.raw:(0,Wt.O0)(e.raw),n=(0,Wt.qX)(`${Ur}${r.length}`);return(0,Ft.w)((0,V.zo)([n,r]),void 0)}(r);return Dr(e,{address:t,hash:o,signature:n,...i})}(e,t),verifyTypedData:t=>async function(e,{address:t,signature:r,message:n,primaryType:i,types:o,domain:a,...s}){return Dr(e,{address:t,hash:zr({message:n,primaryType:i,types:o,domain:a}),signature:r,...s})}(e,t),uninstallFilter:e=>Mr(0,e),waitForTransactionReceipt:t=>async function(e,{confirmations:t=1,hash:r,onReplaced:n,pollingInterval:i=e.pollingInterval,timeout:o}){const a=(0,_e.P)(["waitForTransactionReceipt",e.uid,r]);let s,c,l,u=!1;return new Promise(((d,h)=>{o&&setTimeout((()=>h(new re.mc({hash:r}))),o);const p=Kr(a,{onReplaced:n,resolve:d,reject:h},(n=>{const o=ae(e,Jr,"watchBlockNumber")({emitMissed:!0,emitOnBegin:!0,poll:!0,pollingInterval:i,async onBlockNumber(i){if(u)return;let a=i;const d=e=>{o(),e(),p()};try{if(l){if(t>1&&(!l.blockNumber||a-l.blockNumber+1n<t))return;return void d((()=>n.resolve(l)))}if(s||(u=!0,await De((async()=>{s=await ae(e,Nr,"getTransaction")({hash:r}),s.blockNumber&&(a=s.blockNumber)}),{delay:({count:e})=>200*~~(1<<e),retryCount:6}),u=!1),l=await ae(e,Br,"getTransactionReceipt")({hash:r}),t>1&&(!l.blockNumber||a-l.blockNumber+1n<t))return;d((()=>n.resolve(l)))}catch(r){if(s&&(r instanceof re.Bh||r instanceof re.Yb))try{c=s,u=!0;const r=await De((()=>ae(e,we,"getBlock")({blockNumber:a,includeTransactions:!0})),{delay:({count:e})=>200*~~(1<<e),retryCount:6,shouldRetry:({error:e})=>e instanceof he});u=!1;const i=r.transactions.find((({from:e,nonce:t})=>e===c.from&&t===c.nonce));if(!i)return;if(l=await ae(e,Br,"getTransactionReceipt")({hash:i.hash}),t>1&&(!l.blockNumber||a-l.blockNumber+1n<t))return;let o="replaced";i.to===c.to&&i.value===c.value?o="repriced":i.from===i.to&&0n===i.value&&(o="cancelled"),d((()=>{n.onReplaced?.({reason:o,replacedTransaction:c,transaction:i,transactionReceipt:l}),n.resolve(l)}))}catch(e){d((()=>n.reject(e)))}else d((()=>n.reject(r)))}}})}))}))}(e,t),watchBlocks:t=>function(e,{blockTag:t="latest",emitMissed:r=!1,emitOnBegin:n=!1,onBlock:i,onError:o,includeTransactions:a,poll:s,pollingInterval:c=e.pollingInterval}){const l=void 0!==s?s:"webSocket"!==e.transport.type,u=a??!1;let d;return l?Kr((0,_e.P)(["watchBlocks",e.uid,r,n,u,c]),{onBlock:i,onError:o},(i=>Xr((async()=>{try{const n=await ae(e,we,"getBlock")({blockTag:t,includeTransactions:u});if(n.number&&d?.number){if(n.number===d.number)return;if(n.number-d.number>1&&r)for(let t=d?.number+1n;t<n.number;t++){const r=await ae(e,we,"getBlock")({blockNumber:t,includeTransactions:u});i.onBlock(r,d),d=r}}(!d?.number||"pending"===t&&!n?.number||n.number&&n.number>d.number)&&(i.onBlock(n,d),d=n)}catch(e){i.onError?.(e)}}),{emitOnBegin:n,interval:c}))):(()=>{let t=!0,r=()=>t=!1;return(async()=>{try{const{unsubscribe:n}=await e.transport.subscribe({params:["newHeads"],onData(r){if(!t)return;const n=(e.chain?.formatters?.block?.format||ge)(r.result);i(n,d),d=n},onError(e){o?.(e)}});r=n,t||r()}catch(e){o?.(e)}})(),r})()}(e,t),watchBlockNumber:t=>Jr(e,t),watchContractEvent:t=>function(e,{abi:t,address:r,args:n,batch:i=!0,eventName:o,onError:a,onLogs:s,poll:c,pollingInterval:l=e.pollingInterval,strict:u}){return(void 0!==c?c:"webSocket"!==e.transport.type)?(()=>{const c=(0,_e.P)(["watchContractEvent",r,n,i,e.uid,o,l]),d=u??!1;return Kr(c,{onLogs:s,onError:a},(a=>{let s,c,u=!1;const h=Xr((async()=>{if(u)try{let l;if(c)l=await ae(e,Tr,"getFilterChanges")({filter:c});else{const i=await ae(e,Er,"getBlockNumber")({});l=s&&s!==i?await ae(e,Or,"getContractEvents")({abi:t,address:r,args:n,eventName:o,fromBlock:s+1n,toBlock:i,strict:d}):[],s=i}if(0===l.length)return;if(i)a.onLogs(l);else for(const e of l)a.onLogs([e])}catch(e){c&&e instanceof E&&(u=!1),a.onError?.(e)}else{try{c=await ae(e,mr,"createContractEventFilter")({abi:t,address:r,args:n,eventName:o,strict:d})}catch{}u=!0}}),{emitOnBegin:!0,interval:l});return async()=>{c&&await ae(e,Mr,"uninstallFilter")({filter:c}),h()}}))})():(()=>{let i=!0,c=()=>i=!1;return(async()=>{try{const l=o?wr({abi:t,eventName:o,args:n}):[],{unsubscribe:d}=await e.transport.subscribe({params:["logs",{address:r,topics:l}],onData(e){if(!i)return;const r=e.result;try{const{eventName:e,args:n}=Sr({abi:t,data:r.data,topics:r.topics,strict:u}),i=Ar(r,{args:n,eventName:e});s([i])}catch(e){let t,n;if(e instanceof Z.SM||e instanceof Z.Gy){if(u)return;t=e.abiItem.name,n=e.abiItem.inputs?.some((e=>!("name"in e&&e.name)))}const i=Ar(r,{args:n?[]:{},eventName:t});s([i])}},onError(e){a?.(e)}});c=d,i||c()}catch(e){a?.(e)}})(),c})()}(e,t),watchEvent:t=>function(e,{address:t,args:r,batch:n=!0,event:i,events:o,onError:a,onLogs:s,poll:c,pollingInterval:l=e.pollingInterval,strict:u}){const d=void 0!==c?c:"webSocket"!==e.transport.type,h=u??!1;return d?Kr((0,_e.P)(["watchEvent",t,r,n,e.uid,i,l]),{onLogs:s,onError:a},(a=>{let s,c,u=!1;const d=Xr((async()=>{if(u)try{let l;if(c)l=await ae(e,Tr,"getFilterChanges")({filter:c});else{const n=await ae(e,Er,"getBlockNumber")({});l=s&&s!==n?await ae(e,Ir,"getLogs")({address:t,args:r,event:i,events:o,fromBlock:s+1n,toBlock:n}):[],s=n}if(0===l.length)return;if(n)a.onLogs(l);else for(const e of l)a.onLogs([e])}catch(e){c&&e instanceof E&&(u=!1),a.onError?.(e)}else{try{c=await ae(e,yr,"createEventFilter")({address:t,args:r,event:i,events:o,strict:h})}catch{}u=!0}}),{emitOnBegin:!0,interval:l});return async()=>{c&&await ae(e,Mr,"uninstallFilter")({filter:c}),d()}})):(()=>{let n=!0,c=()=>n=!1;return(async()=>{try{const l=o??(i?[i]:void 0);let d=[];l&&(d=[l.flatMap((e=>wr({abi:[e],eventName:e.name,args:r})))],i&&(d=d[0]));const{unsubscribe:p}=await e.transport.subscribe({params:["logs",{address:t,topics:d}],onData(e){if(!n)return;const t=e.result;try{const{eventName:e,args:r}=Sr({abi:l,data:t.data,topics:t.topics,strict:h}),n=Ar(t,{args:r,eventName:e});s([n])}catch(e){let r,n;if(e instanceof Z.SM||e instanceof Z.Gy){if(u)return;r=e.abiItem.name,n=e.abiItem.inputs?.some((e=>!("name"in e&&e.name)))}const i=Ar(t,{args:n?[]:{},eventName:r});s([i])}},onError(e){a?.(e)}});c=p,n||c()}catch(e){a?.(e)}})(),c})()}(e,t),watchPendingTransactions:t=>function(e,{batch:t=!0,onError:r,onTransactions:n,poll:i,pollingInterval:o=e.pollingInterval}){return(void 0!==i?i:"webSocket"!==e.transport.type)?Kr((0,_e.P)(["watchPendingTransactions",e.uid,t,o]),{onTransactions:n,onError:r},(r=>{let n;const i=Xr((async()=>{try{if(!n)try{return void(n=await ae(e,vr,"createPendingTransactionFilter")({}))}catch(e){throw i(),e}const o=await ae(e,Tr,"getFilterChanges")({filter:n});if(0===o.length)return;if(t)r.onTransactions(o);else for(const e of o)r.onTransactions([e])}catch(e){r.onError?.(e)}}),{emitOnBegin:!0,interval:o});return async()=>{n&&await ae(e,Mr,"uninstallFilter")({filter:n}),i()}})):(()=>{let t=!0,i=()=>t=!1;return(async()=>{try{const{unsubscribe:o}=await e.transport.subscribe({params:["newPendingTransactions"],onData(e){if(!t)return;const r=e.result;n([r])},onError(e){r?.(e)}});i=o,t||i()}catch(e){r?.(e)}})(),i})()}(e,t)}}function en(e){const{key:t="public",name:r="Public Client"}=e;return F({...e,key:t,name:r,type:"publicClient"}).extend(Qr)}function tn(e,t={}){const{key:r="fallback",name:n="Fallback",rank:i=!1,retryCount:o,retryDelay:a}=t;return({chain:t,pollingInterval:s=4e3,timeout:c})=>{let l=e,u=()=>{};const d=Fe({key:r,name:n,async request({method:e,params:r}){const n=async(i=0)=>{const o=l[i]({chain:t,retryCount:0,timeout:c});try{const t=await o.request({method:e,params:r});return u({method:e,params:r,response:t,transport:o,status:"success"}),t}catch(t){if(u({error:t,method:e,params:r,transport:o,status:"error"}),ze(t))throw t;if(i===l.length-1)throw t;return n(i+1)}};return n()},retryCount:o,retryDelay:a,type:"fallback"},{onResponse:e=>u=e,transports:l.map((e=>e({chain:t,retryCount:0})))});if(i){const e="object"==typeof i?i:{};!function({chain:e,interval:t=4e3,onTransports:r,sampleCount:n=10,timeout:i=1e3,transports:o,weights:a={}}){const{stability:s=.7,latency:c=.3}=a,l=[],u=async()=>{const a=await Promise.all(o.map((async t=>{const r=t({chain:e,retryCount:0,timeout:i}),n=Date.now();let o,a;try{await r.request({method:"net_listening"}),a=1}catch{a=0}finally{o=Date.now()}return{latency:o-n,success:a}})));l.push(a),l.length>n&&l.shift();const d=Math.max(...l.map((e=>Math.max(...e.map((({latency:e})=>e)))))),h=o.map(((e,t)=>{const r=l.map((e=>e[t].latency)),n=1-r.reduce(((e,t)=>e+t),0)/r.length/d,i=l.map((e=>e[t].success)),o=i.reduce(((e,t)=>e+t),0)/i.length;return 0===o?[0,t]:[c*n+s*o,t]})).sort(((e,t)=>t[0]-e[0]));r(h.map((([,e])=>o[e]))),await Le(t),u()};u()}({chain:t,interval:e.interval??s,onTransports:e=>l=e,sampleCount:e.sampleCount,timeout:e.timeout,transports:l,weights:e.weights})}return d}}class rn extends g.G{constructor(){super("No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.",{docsPath:"/docs/clients/intro"})}}var nn=a(2357);const on=function(){if("undefined"!=typeof WebSocket)return WebSocket;if(void 0!==global.WebSocket)return global.WebSocket;if(void 0!==window.WebSocket)return window.WebSocket;if(void 0!==self.WebSocket)return self.WebSocket;throw new Error("`WebSocket` is not supported in this environment")}();function an(e,{errorInstance:t=new Error("timed out"),timeout:r,signal:n}){return new Promise(((i,o)=>{(async()=>{let a;try{const s=new AbortController;r>0&&(a=setTimeout((()=>{n?s.abort():o(t)}),r)),i(await e({signal:s?.signal}))}catch(e){"AbortError"===e.name&&o(t),o(e)}finally{clearTimeout(a)}})()}))}let sn=0;const cn=new Map;async function ln(e){let t=cn.get(e);if(t)return t;const{schedule:r}=(0,nn.S)({id:e,fn:async()=>{const r=new on(e),n=new Map,i=new Map,o=({data:e})=>{const t=JSON.parse(e),r="eth_subscription"===t.method,o=r?t.params.subscription:t.id,a=r?i:n,s=a.get(o);s&&s({data:e}),r||a.delete(o)},a=()=>{cn.delete(e),r.removeEventListener("close",a),r.removeEventListener("message",o)};return r.addEventListener("close",a),r.addEventListener("message",o),r.readyState===on.CONNECTING&&await new Promise(((e,t)=>{r&&(r.onopen=e,r.onerror=t)})),t=Object.assign(r,{requests:n,subscriptions:i}),cn.set(e,t),[t]}}),[n,[i]]=await r();return i}const un={http:async function(e,{body:t,fetchOptions:r={},timeout:n=1e4}){const{headers:i,method:o,signal:a}=r;try{const s=await an((async({signal:s})=>await fetch(e,{...r,body:Array.isArray(t)?(0,_e.P)(t.map((e=>({jsonrpc:"2.0",id:e.id??sn++,...e})))):(0,_e.P)({jsonrpc:"2.0",id:t.id??sn++,...t}),headers:{...i,"Content-Type":"application/json"},method:o||"POST",signal:a||(n>0?s:void 0)})),{errorInstance:new w.W5({body:t,url:e}),timeout:n,signal:!0});let c;if(c=s.headers.get("Content-Type")?.startsWith("application/json")?await s.json():await s.text(),!s.ok)throw new w.Gg({body:t,details:(0,_e.P)(c.error)||s.statusText,headers:s.headers,status:s.status,url:e});return c}catch(r){if(r instanceof w.Gg)throw r;if(r instanceof w.W5)throw r;throw new w.Gg({body:t,details:r.message,url:e})}},webSocket:function(e,{body:t,onResponse:r}){if(e.readyState===e.CLOSED||e.readyState===e.CLOSING)throw new w.c9({body:t,url:e.url,details:"Socket is closed."});const n=sn++,i=({data:o})=>{const a=JSON.parse(o);"number"==typeof a.id&&n!==a.id||(r?.(a),"eth_subscribe"===t.method&&"string"==typeof a.result&&e.subscriptions.set(a.result,i),"eth_unsubscribe"===t.method&&e.subscriptions.delete(t.params?.[0]))};return e.requests.set(n,i),e.send(JSON.stringify({jsonrpc:"2.0",...t,id:n})),e},webSocketAsync:async function(e,{body:t,timeout:r=1e4}){return an((()=>new Promise((r=>un.webSocket(e,{body:t,onResponse:r})))),{errorInstance:new w.W5({body:t,url:e.url}),timeout:r})}};var dn=a(4192);function hn(e,t){let r;try{r=e()}catch(e){return}return{getItem:e=>{var n;const i=e=>null===e?null:JSON.parse(e,null==t?void 0:t.reviver),o=null!=(n=r.getItem(e))?n:null;return o instanceof Promise?o.then(i):i(o)},setItem:(e,n)=>r.setItem(e,JSON.stringify(n,null==t?void 0:t.replacer)),removeItem:e=>r.removeItem(e)}}const pn=e=>t=>{try{const r=e(t);return r instanceof Promise?r:{then:e=>pn(e)(r),catch(e){return this}}}catch(e){return{then(e){return this},catch:t=>pn(t)(e)}}},fn=e=>{let t;const r=new Set,n=(e,n)=>{const i="function"==typeof e?e(t):e;if(!Object.is(i,t)){const e=t;t=(null!=n?n:"object"!=typeof i)?i:Object.assign({},t,i),r.forEach((r=>r(t,e)))}},i=()=>t,o={setState:n,getState:i,subscribe:e=>(r.add(e),()=>r.delete(e)),destroy:()=>{console.warn("[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."),r.clear()}};return t=e(n,i,o),o};var gn=a(5229);function wn(e,t){if(Object.is(e,t))return!0;if("object"!=typeof e||null===e||"object"!=typeof t||null===t)return!1;if(e instanceof Map&&t instanceof Map){if(e.size!==t.size)return!1;for(const[r,n]of e)if(!Object.is(n,t.get(r)))return!1;return!0}if(e instanceof Set&&t instanceof Set){if(e.size!==t.size)return!1;for(const r of e)if(!t.has(r))return!1;return!0}const r=Object.keys(e);if(r.length!==Object.keys(t).length)return!1;for(let n=0;n<r.length;n++)if(!Object.prototype.hasOwnProperty.call(t,r[n])||!Object.is(e[r[n]],t[r[n]]))return!1;return!0}Error;var bn=class extends Error{constructor({chainId:e,connectorId:t}){super(`Chain "${e}" not configured${t?` for connector "${t}"`:""}.`),this.name="ChainNotConfigured"}},mn=class extends Error{constructor(){super(...arguments),this.name="ConnectorAlreadyConnectedError",this.message="Connector already connected"}},yn=class extends Error{constructor(){super(...arguments),this.name="ConfigChainsNotFound",this.message="No chains were found on the wagmi config. Some functions that require a chain may not work."}},vn=class extends Error{constructor({connector:e}){super(`"${e.name}" does not support programmatic chain switching.`),this.name="SwitchChainNotSupportedError"}},xn=(e,{find:t,replace:r})=>e&&t(e)?r(e):"object"!=typeof e?e:Array.isArray(e)?e.map((e=>xn(e,{find:t,replace:r}))):e instanceof Object?Object.entries(e).reduce(((e,[n,i])=>({...e,[n]:xn(i,{find:t,replace:r})})),{}):e;function Cn(e){const t=JSON.parse(e),r=xn(t,{find:e=>"string"==typeof e&&e.startsWith("#bigint."),replace:e=>BigInt(e.replace("#bigint.",""))});return r}function kn(e){return"number"==typeof e?e:"wei"===e?0:Math.abs(dn.Bd[e])}function En(e,t){return e.slice(0,t).join(".")||"."}function Pn(e,t){const{length:r}=e;for(let n=0;n<r;++n)if(e[n]===t)return n+1;return 0}function $n(e,t,r,n){return JSON.stringify(e,function(e,t){const r="function"==typeof t,n=[],i=[];return function(o,a){if("object"==typeof a)if(n.length){const e=Pn(n,this);0===e?n[n.length]=this:(n.splice(e),i.splice(e)),i[i.length]=o;const s=Pn(n,a);if(0!==s)return r?t.call(this,o,a,En(i,s)):`[ref=${En(i,s)}]`}else n[0]=a,i[0]=o;return e.call(this,o,a)}}(((e,r)=>{const n="bigint"==typeof r?`#bigint.${r.toString()}`:r;return t?.(e,n)||n}),n),r??void 0)}var Sn={getItem:e=>"",setItem:(e,t)=>null,removeItem:e=>null};function _n({deserialize:e=Cn,key:t="wagmi",serialize:r=$n,storage:n}){return{...n,getItem:(r,i=null)=>{const o=n.getItem(`${t}.${r}`);try{return o?e(o):i}catch(e){return console.warn(e),i}},setItem:(e,i)=>{if(null===i)n.removeItem(`${t}.${e}`);else try{n.setItem(`${t}.${e}`,r(i))}catch(e){console.error(e)}},removeItem:e=>n.removeItem(`${t}.${e}`)}}var An,In,On,Tn,Nn,Rn="store";function jn(){if(!Nn)throw new Error("No wagmi config found. Ensure you have set up a config: https://wagmi.sh/react/config");return Nn}async function Bn({chainId:e,connector:t}){const r=jn(),n=r.connector;if(n&&t.id===n.id)throw new mn;try{r.setState((e=>({...e,status:"connecting"})));const n=await t.connect({chainId:e});return r.setLastUsedConnector(t.id),r.setState((e=>({...e,connector:t,chains:t?.chains,data:n,status:"connected"}))),r.storage.setItem("connected",!0),{...n,connector:t}}catch(e){throw r.setState((e=>({...e,status:e.connector?"connected":"disconnected"}))),e}}async function Mn(){const e=jn();e.connector&&await e.connector.disconnect(),e.clearState(),e.storage.removeItem("connected")}An=new WeakMap,In=new WeakMap,On=new WeakSet,Tn=function(){const e=e=>{this.setState((t=>({...t,data:{...t.data,...e}})))},t=()=>{this.clearState()},r=e=>{this.setState((t=>({...t,error:e})))};this.store.subscribe((({connector:e})=>e),((n,i)=>{i?.off?.("change",e),i?.off?.("disconnect",t),i?.off?.("error",r),n&&(n.on?.("change",e),n.on?.("disconnect",t),n.on?.("error",r))}));const{publicClient:n,webSocketPublicClient:i}=this.args;("function"==typeof n||"function"==typeof i)&&this.store.subscribe((({data:e})=>e?.chain?.id),(e=>{this.setState((t=>({...t,publicClient:this.getPublicClient({chainId:e}),webSocketPublicClient:this.getWebSocketPublicClient({chainId:e})})))}))};var Un=[{type:"event",name:"Approval",inputs:[{indexed:!0,name:"owner",type:"address"},{indexed:!0,name:"spender",type:"address"},{indexed:!1,name:"value",type:"uint256"}]},{type:"event",name:"Transfer",inputs:[{indexed:!0,name:"from",type:"address"},{indexed:!0,name:"to",type:"address"},{indexed:!1,name:"value",type:"uint256"}]},{type:"function",name:"allowance",stateMutability:"view",inputs:[{name:"owner",type:"address"},{name:"spender",type:"address"}],outputs:[{name:"",type:"uint256"}]},{type:"function",name:"approve",stateMutability:"nonpayable",inputs:[{name:"spender",type:"address"},{name:"amount",type:"uint256"}],outputs:[{name:"",type:"bool"}]},{type:"function",name:"balanceOf",stateMutability:"view",inputs:[{name:"account",type:"address"}],outputs:[{name:"",type:"uint256"}]},{type:"function",name:"decimals",stateMutability:"view",inputs:[],outputs:[{name:"",type:"uint8"}]},{type:"function",name:"name",stateMutability:"view",inputs:[],outputs:[{name:"",type:"string"}]},{type:"function",name:"symbol",stateMutability:"view",inputs:[],outputs:[{name:"",type:"string"}]},{type:"function",name:"totalSupply",stateMutability:"view",inputs:[],outputs:[{name:"",type:"uint256"}]},{type:"function",name:"transfer",stateMutability:"nonpayable",inputs:[{name:"recipient",type:"address"},{name:"amount",type:"uint256"}],outputs:[{name:"",type:"bool"}]},{type:"function",name:"transferFrom",stateMutability:"nonpayable",inputs:[{name:"sender",type:"address"},{name:"recipient",type:"address"},{name:"amount",type:"uint256"}],outputs:[{name:"",type:"bool"}]}],Ln=[{type:"event",name:"Approval",inputs:[{indexed:!0,name:"owner",type:"address"},{indexed:!0,name:"spender",type:"address"},{indexed:!1,name:"value",type:"uint256"}]},{type:"event",name:"Transfer",inputs:[{indexed:!0,name:"from",type:"address"},{indexed:!0,name:"to",type:"address"},{indexed:!1,name:"value",type:"uint256"}]},{type:"function",name:"allowance",stateMutability:"view",inputs:[{name:"owner",type:"address"},{name:"spender",type:"address"}],outputs:[{name:"",type:"uint256"}]},{type:"function",name:"approve",stateMutability:"nonpayable",inputs:[{name:"spender",type:"address"},{name:"amount",type:"uint256"}],outputs:[{name:"",type:"bool"}]},{type:"function",name:"balanceOf",stateMutability:"view",inputs:[{name:"account",type:"address"}],outputs:[{name:"",type:"uint256"}]},{type:"function",name:"decimals",stateMutability:"view",inputs:[],outputs:[{name:"",type:"uint8"}]},{type:"function",name:"name",stateMutability:"view",inputs:[],outputs:[{name:"",type:"bytes32"}]},{type:"function",name:"symbol",stateMutability:"view",inputs:[],outputs:[{name:"",type:"bytes32"}]},{type:"function",name:"totalSupply",stateMutability:"view",inputs:[],outputs:[{name:"",type:"uint256"}]},{type:"function",name:"transfer",stateMutability:"nonpayable",inputs:[{name:"recipient",type:"address"},{name:"amount",type:"uint256"}],outputs:[{name:"",type:"bool"}]},{type:"function",name:"transferFrom",stateMutability:"nonpayable",inputs:[{name:"sender",type:"address"},{name:"recipient",type:"address"},{name:"amount",type:"uint256"}],outputs:[{name:"",type:"bool"}]}];function Dn({chainId:e}={}){const t=jn();return e&&t.getPublicClient({chainId:e})||t.publicClient}async function zn({contracts:e,blockNumber:t,blockTag:r,...n}){const{allowFailure:i=!0}=n;try{const n=Dn(),o=e.reduce(((e,t,r)=>{const i=t.chainId??n.chain.id;return{...e,[i]:[...e[i]||[],{contract:t,index:r}]}}),{}),a=()=>Object.entries(o).map((([e,n])=>async function({chainId:e,contracts:t,blockNumber:r,blockTag:n,...i}){const o=Dn({chainId:e});if(!o.chains)throw new yn;if(e&&o.chain.id!==e)throw new bn({chainId:e});return o.multicall({allowFailure:i.allowFailure??!0,blockNumber:r,blockTag:n,contracts:t})}({allowFailure:i,chainId:parseInt(e),contracts:n.map((({contract:e})=>e)),blockNumber:t,blockTag:r}))),s=(await Promise.all(a())).flat(),c=Object.values(o).flatMap((e=>e.map((({index:e})=>e))));return s.reduce(((e,t,r)=>(e&&(e[c[r]]=t),e)),[])}catch(n){if(n instanceof Dt.uq)throw n;const o=()=>e.map((e=>async function({address:e,account:t,chainId:r,abi:n,args:i,functionName:o,blockNumber:a,blockTag:s}){return Dn({chainId:r}).readContract({abi:n,address:e,account:t,functionName:o,args:i,blockNumber:a,blockTag:s})}({...e,blockNumber:t,blockTag:r})));return i?(await Promise.allSettled(o())).map((e=>"fulfilled"===e.status?{result:e.value,status:"success"}:{error:e.reason,result:void 0,status:"failure"})):await Promise.all(o())}}function Wn(){const{data:e,connector:t,status:r}=jn();switch(r){case"connected":return{address:e?.account,connector:t,isConnected:!0,isConnecting:!1,isDisconnected:!1,isReconnecting:!1,status:r};case"reconnecting":return{address:e?.account,connector:t,isConnected:!!e?.account,isConnecting:!1,isDisconnected:!1,isReconnecting:!0,status:r};case"connecting":return{address:e?.account,connector:t,isConnected:!1,isConnecting:!0,isDisconnected:!1,isReconnecting:!1,status:r};case"disconnected":return{address:void 0,connector:void 0,isConnected:!1,isConnecting:!1,isDisconnected:!0,isReconnecting:!1,status:r}}}function Fn(){const e=jn(),t=e.data?.chain?.id,r=e.chains??[],n=[...e.publicClient?.chains||[],...r].find((e=>e.id===t))??{id:t,name:`Chain ${t}`,network:`${t}`,nativeCurrency:{name:"Ether",decimals:18,symbol:"ETH"},rpcUrls:{default:{http:[""]},public:{http:[""]}}};return{chain:t?{...n,...e.data?.chain,id:t}:void 0,chains:r}}function Hn(e,{selector:t=(e=>e)}={}){const r=jn().subscribe((({data:e,connector:r,status:n})=>t({address:e?.account,connector:r,status:n})),(()=>e(Wn())),{equalityFn:wn});return r}var Gn=a(4201),qn=a(684),Zn=a(7229),Vn=a(3215),Yn=a(796),Kn=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Xn=class extends Zn.oi{constructor(){super(),this.unsubscribe=[],this.networkImages=Gn.WM.state.networkImages,this.disabled=!1,this.balance="show",this.address=Gn.AccountController.state.address,this.balanceVal=Gn.AccountController.state.balance,this.balanceSymbol=Gn.AccountController.state.balanceSymbol,this.profileName=Gn.AccountController.state.profileName,this.profileImage=Gn.AccountController.state.profileImage,this.network=Gn.NetworkController.state.caipNetwork,this.unsubscribe.push(Gn.AccountController.subscribe((e=>{e.isConnected?(this.address=e.address,this.balanceVal=e.balance,this.profileName=e.profileName,this.profileImage=e.profileImage,this.balanceSymbol=e.balanceSymbol):(this.address="",this.balanceVal="",this.profileName="",this.profileImage="",this.balanceSymbol="")})),Gn.NetworkController.subscribeKey("caipNetwork",(e=>this.network=e)))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){const e=this.networkImages[this.network?.imageId??""],t="show"===this.balance;return Zn.dy`
      <wui-account-button
        .disabled=${Boolean(this.disabled)}
        address=${(0,Yn.o)(this.profileName??this.address)}
        ?isProfileName=${Boolean(this.profileName)}
        networkSrc=${(0,Yn.o)(e)}
        avatarSrc=${(0,Yn.o)(this.profileImage)}
        balance=${t?Gn.j1.formatBalance(this.balanceVal,this.balanceSymbol):""}
        @click=${this.onClick.bind(this)}
      >
      </wui-account-button>
    `}onClick(){Gn.IN.open()}};Kn([(0,Vn.Cb)({type:Boolean})],Xn.prototype,"disabled",void 0),Kn([(0,Vn.Cb)()],Xn.prototype,"balance",void 0),Kn([(0,Vn.SB)()],Xn.prototype,"address",void 0),Kn([(0,Vn.SB)()],Xn.prototype,"balanceVal",void 0),Kn([(0,Vn.SB)()],Xn.prototype,"balanceSymbol",void 0),Kn([(0,Vn.SB)()],Xn.prototype,"profileName",void 0),Kn([(0,Vn.SB)()],Xn.prototype,"profileImage",void 0),Kn([(0,Vn.SB)()],Xn.prototype,"network",void 0),Xn=Kn([(0,qn.customElement)("w3m-account-button")],Xn);var Jn=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Qn=class extends Zn.oi{constructor(){super(),this.unsubscribe=[],this.disabled=!1,this.balance=void 0,this.size=void 0,this.label=void 0,this.loadingLabel=void 0,this.isAccount=Gn.AccountController.state.isConnected,this.unsubscribe.push(Gn.AccountController.subscribeKey("isConnected",(e=>{this.isAccount=e})))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){return this.isAccount?Zn.dy`
          <w3m-account-button
            .disabled=${Boolean(this.disabled)}
            balance=${(0,Yn.o)(this.balance)}
          >
          </w3m-account-button>
        `:Zn.dy`
          <w3m-connect-button
            size=${(0,Yn.o)(this.size)}
            label=${(0,Yn.o)(this.label)}
            loadingLabel=${(0,Yn.o)(this.loadingLabel)}
          ></w3m-connect-button>
        `}};Jn([(0,Vn.Cb)({type:Boolean})],Qn.prototype,"disabled",void 0),Jn([(0,Vn.Cb)()],Qn.prototype,"balance",void 0),Jn([(0,Vn.Cb)()],Qn.prototype,"size",void 0),Jn([(0,Vn.Cb)()],Qn.prototype,"label",void 0),Jn([(0,Vn.Cb)()],Qn.prototype,"loadingLabel",void 0),Jn([(0,Vn.SB)()],Qn.prototype,"isAccount",void 0),Qn=Jn([(0,qn.customElement)("w3m-button")],Qn);var ei=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let ti=class extends Zn.oi{constructor(){super(),this.unsubscribe=[],this.size="md",this.label="Connect Wallet",this.loadingLabel="Connecting...",this.open=Gn.IN.state.open,this.unsubscribe.push(Gn.IN.subscribeKey("open",(e=>this.open=e)))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){return Zn.dy`
      <wui-connect-button
        size=${(0,Yn.o)(this.size)}
        .loading=${this.open}
        @click=${this.onClick.bind(this)}
      >
        ${this.open?this.loadingLabel:this.label}
      </wui-connect-button>
    `}onClick(){this.open?Gn.IN.close():Gn.IN.open()}};ei([(0,Vn.Cb)()],ti.prototype,"size",void 0),ei([(0,Vn.Cb)()],ti.prototype,"label",void 0),ei([(0,Vn.Cb)()],ti.prototype,"loadingLabel",void 0),ei([(0,Vn.SB)()],ti.prototype,"open",void 0),ti=ei([(0,qn.customElement)("w3m-connect-button")],ti),a(6541);var ri=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let ni=class extends Zn.oi{constructor(){super(),this.unsubscribe=[],this.disabled=!1,this.network=Gn.NetworkController.state.caipNetwork,this.connected=Gn.AccountController.state.isConnected,this.unsubscribe.push(Gn.NetworkController.subscribeKey("caipNetwork",(e=>this.network=e)),Gn.AccountController.subscribeKey("isConnected",(e=>this.connected=e)))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){return Zn.dy`
      <wui-network-button
        .disabled=${Boolean(this.disabled)}
        imageSrc=${(0,Yn.o)(Gn.fz.getNetworkImage(this.network))}
        @click=${this.onClick.bind(this)}
      >
        ${this.network?.name??(this.connected?"Unknown Network":"Select Network")}
      </wui-network-button>
    `}onClick(){Gn.IN.open({view:"Networks"})}};ri([(0,Vn.Cb)({type:Boolean})],ni.prototype,"disabled",void 0),ri([(0,Vn.SB)()],ni.prototype,"network",void 0),ri([(0,Vn.SB)()],ni.prototype,"connected",void 0),ni=ri([(0,qn.customElement)("w3m-network-button")],ni);const ii=Zn.iv`
  :host {
    display: block;
    will-change: transform, opacity;
  }
`;var oi=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let ai=class extends Zn.oi{constructor(){super(),this.resizeObserver=void 0,this.prevHeight="0px",this.prevHistoryLength=1,this.unsubscribe=[],this.view=Gn.RouterController.state.view,this.unsubscribe.push(Gn.RouterController.subscribeKey("view",(e=>this.onViewChange(e))))}firstUpdated(){this.resizeObserver=new ResizeObserver((async([e])=>{const t=`${e?.contentRect.height}px`;"0px"!==this.prevHeight&&(await this.animate([{height:this.prevHeight},{height:t}],{duration:150,easing:"ease",fill:"forwards"}).finished,this.style.height="auto"),this.prevHeight=t})),this.resizeObserver.observe(this.getWrapper())}disconnectedCallback(){this.resizeObserver?.unobserve(this.getWrapper()),this.unsubscribe.forEach((e=>e()))}render(){return Zn.dy`<div>${this.viewTemplate()}</div>`}viewTemplate(){switch(this.view){case"Connect":default:return Zn.dy`<w3m-connect-view></w3m-connect-view>`;case"ConnectingWalletConnect":return Zn.dy`<w3m-connecting-wc-view></w3m-connecting-wc-view>`;case"ConnectingExternal":return Zn.dy`<w3m-connecting-external-view></w3m-connecting-external-view>`;case"ConnectingSiwe":return Zn.dy`<w3m-connecting-siwe-view></w3m-connecting-siwe-view>`;case"AllWallets":return Zn.dy`<w3m-all-wallets-view></w3m-all-wallets-view>`;case"Networks":return Zn.dy`<w3m-networks-view></w3m-networks-view>`;case"SwitchNetwork":return Zn.dy`<w3m-network-switch-view></w3m-network-switch-view>`;case"Account":return Zn.dy`<w3m-account-view></w3m-account-view>`;case"WhatIsAWallet":return Zn.dy`<w3m-what-is-a-wallet-view></w3m-what-is-a-wallet-view>`;case"WhatIsANetwork":return Zn.dy`<w3m-what-is-a-network-view></w3m-what-is-a-network-view>`;case"GetWallet":return Zn.dy`<w3m-get-wallet-view></w3m-get-wallet-view>`;case"Downloads":return Zn.dy`<w3m-downloads-view></w3m-downloads-view>`;case"Transactions":return Zn.dy`<w3m-transactions-view></w3m-transactions-view>`}}async onViewChange(e){const{history:t}=Gn.RouterController.state;let r=-10,n=10;t.length<this.prevHistoryLength&&(r=10,n=-10),this.prevHistoryLength=t.length,await this.animate([{opacity:1,transform:"translateX(0px)"},{opacity:0,transform:`translateX(${r}px)`}],{duration:150,easing:"ease",fill:"forwards"}).finished,this.view=e,await this.animate([{opacity:0,transform:`translateX(${n}px)`},{opacity:1,transform:"translateX(0px)"}],{duration:150,easing:"ease",fill:"forwards",delay:50}).finished}getWrapper(){return this.shadowRoot?.querySelector("div")}};ai.styles=ii,oi([(0,Vn.SB)()],ai.prototype,"view",void 0),ai=oi([(0,qn.customElement)("w3m-router")],ai);const si=Zn.iv`
  wui-flex {
    width: 100%;
  }

  :host > wui-flex:first-child {
    transform: translateY(calc(var(--wui-spacing-xxs) * -1));
  }

  wui-icon-link {
    margin-right: calc(var(--wui-icon-box-size-md) * -1);
  }
`;var ci=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let li=class extends Zn.oi{constructor(){super(),this.usubscribe=[],this.networkImages=Gn.WM.state.networkImages,this.address=Gn.AccountController.state.address,this.profileImage=Gn.AccountController.state.profileImage,this.profileName=Gn.AccountController.state.profileName,this.balance=Gn.AccountController.state.balance,this.balanceSymbol=Gn.AccountController.state.balanceSymbol,this.network=Gn.NetworkController.state.caipNetwork,this.disconecting=!1,this.usubscribe.push(Gn.AccountController.subscribe((e=>{e.address?(this.address=e.address,this.profileImage=e.profileImage,this.profileName=e.profileName,this.balance=e.balance,this.balanceSymbol=e.balanceSymbol):Gn.IN.close()})),Gn.NetworkController.subscribeKey("caipNetwork",(e=>{e?.id&&(this.network=e)})))}disconnectedCallback(){this.usubscribe.forEach((e=>e()))}render(){if(!this.address)throw new Error("w3m-account-view: No account provided");const e=this.networkImages[this.network?.imageId??""];return Zn.dy`
      <wui-flex
        flexDirection="column"
        .padding=${["0","s","m","s"]}
        alignItems="center"
        gap="l"
      >
        <wui-avatar
          alt=${this.address}
          address=${this.address}
          imageSrc=${(0,Yn.o)(this.profileImage)}
        ></wui-avatar>

        <wui-flex flexDirection="column" alignItems="center">
          <wui-flex gap="3xs" alignItems="center" justifyContent="center">
            <wui-text variant="large-600" color="fg-100">
              ${this.profileName?qn.UiHelperUtil.getTruncateString({string:this.profileName,charsStart:20,charsEnd:0,truncate:"end"}):qn.UiHelperUtil.getTruncateString({string:this.address,charsStart:4,charsEnd:6,truncate:"middle"})}
            </wui-text>
            <wui-icon-link
              size="md"
              icon="copy"
              iconColor="fg-200"
              @click=${this.onCopyAddress}
            ></wui-icon-link>
          </wui-flex>
          <wui-flex gap="s" flexDirection="column" alignItems="center">
            <wui-text variant="paragraph-500" color="fg-200">
              ${Gn.j1.formatBalance(this.balance,this.balanceSymbol)}
            </wui-text>

            ${this.explorerBtnTemplate()}
          </wui-flex>
        </wui-flex>
      </wui-flex>

      <wui-flex flexDirection="column" gap="xs" .padding=${["0","s","s","s"]}>
        <wui-list-item
          .variant=${e?"image":"icon"}
          iconVariant="overlay"
          icon="networkPlaceholder"
          imageSrc=${(0,Yn.o)(e)}
          ?chevron=${this.isAllowedNetworkSwitch()}
          @click=${this.onNetworks.bind(this)}
        >
          <wui-text variant="paragraph-500" color="fg-100">
            ${this.network?.name??"Unknown"}
          </wui-text>
        </wui-list-item>
        <wui-list-item
          iconVariant="blue"
          icon="swapHorizontalBold"
          iconSize="sm"
          ?chevron=${!0}
          @click=${this.onTransactions.bind(this)}
        >
          <wui-text variant="paragraph-500" color="fg-100">Activity</wui-text>
        </wui-list-item>
        <wui-list-item
          variant="icon"
          iconVariant="overlay"
          icon="disconnect"
          ?chevron=${!1}
          .loading=${this.disconecting}
          @click=${this.onDisconnect.bind(this)}
        >
          <wui-text variant="paragraph-500" color="fg-200">Disconnect</wui-text>
        </wui-list-item>
      </wui-flex>
    `}explorerBtnTemplate(){const{addressExplorerUrl:e}=Gn.AccountController.state;return e?Zn.dy`
      <wui-button size="sm" variant="shade" @click=${this.onExplorer.bind(this)}>
        <wui-icon size="sm" color="inherit" slot="iconLeft" name="compass"></wui-icon>
        Block Explorer
        <wui-icon size="sm" color="inherit" slot="iconRight" name="externalLink"></wui-icon>
      </wui-button>
    `:null}isAllowedNetworkSwitch(){const{requestedCaipNetworks:e}=Gn.NetworkController.state,t=!!e&&e.length>1,r=e?.find((({id:e})=>e===this.network?.id));return t||!r}onCopyAddress(){try{this.address&&(Gn.j1.copyToClopboard(this.address),Gn.SnackController.showSuccess("Address copied"))}catch{Gn.SnackController.showError("Failed to copy")}}onNetworks(){this.isAllowedNetworkSwitch()&&Gn.RouterController.push("Networks")}onTransactions(){Gn.Xs.sendEvent({type:"track",event:"CLICK_TRANSACTIONS"}),Gn.RouterController.push("Transactions")}async onDisconnect(){try{this.disconecting=!0,await Gn.ConnectionController.disconnect(),Gn.Xs.sendEvent({type:"track",event:"DISCONNECT_SUCCESS"}),Gn.IN.close()}catch{Gn.Xs.sendEvent({type:"track",event:"DISCONNECT_ERROR"}),Gn.SnackController.showError("Failed to disconnect")}finally{this.disconecting=!1}}onExplorer(){const{addressExplorerUrl:e}=Gn.AccountController.state;e&&Gn.j1.openHref(e,"_blank")}};li.styles=si,ci([(0,Vn.SB)()],li.prototype,"address",void 0),ci([(0,Vn.SB)()],li.prototype,"profileImage",void 0),ci([(0,Vn.SB)()],li.prototype,"profileName",void 0),ci([(0,Vn.SB)()],li.prototype,"balance",void 0),ci([(0,Vn.SB)()],li.prototype,"balanceSymbol",void 0),ci([(0,Vn.SB)()],li.prototype,"network",void 0),ci([(0,Vn.SB)()],li.prototype,"disconecting",void 0),li=ci([(0,qn.customElement)("w3m-account-view")],li);var ui=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let di=class extends Zn.oi{constructor(){super(...arguments),this.search="",this.onDebouncedSearch=Gn.j1.debounce((e=>{this.search=e}))}render(){const e=this.search.length>=2;return Zn.dy`
      <wui-flex padding="s" gap="s">
        <wui-search-bar @inputChange=${this.onInputChange.bind(this)}></wui-search-bar>
        ${this.qrButtonTemplate()}
      </wui-flex>
      ${e?Zn.dy`<w3m-all-wallets-search query=${this.search}></w3m-all-wallets-search>`:Zn.dy`<w3m-all-wallets-list></w3m-all-wallets-list>`}
    `}onInputChange(e){this.onDebouncedSearch(e.detail)}qrButtonTemplate(){return Gn.j1.isMobile()?Zn.dy`
        <wui-icon-box
          size="lg"
          iconSize="xl"
          iconColor="accent-100"
          backgroundColor="accent-100"
          icon="qrCode"
          background="transparent"
          border
          borderColor="wui-accent-glass-010"
          @click=${this.onWalletConnectQr.bind(this)}
        ></wui-icon-box>
      `:null}onWalletConnectQr(){Gn.RouterController.push("ConnectingWalletConnect")}};ui([(0,Vn.SB)()],di.prototype,"search",void 0),di=ui([(0,qn.customElement)("w3m-all-wallets-view")],di);const hi=Zn.iv`
  wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
  }

  wui-flex::-webkit-scrollbar {
    display: none;
  }
`;var pi=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let fi=class extends Zn.oi{constructor(){super(),this.unsubscribe=[],this.connectors=Gn.ConnectorController.state.connectors,this.unsubscribe.push(Gn.ConnectorController.subscribeKey("connectors",(e=>this.connectors=e)))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){return Zn.dy`
      <wui-flex flexDirection="column" padding="s" gap="xs">
        ${this.walletConnectConnectorTemplate()} ${this.recentTemplate()}
        ${this.announcedTemplate()} ${this.injectedTemplate()} ${this.featuredTemplate()}
        ${this.customTemplate()} ${this.recommendedTemplate()} ${this.connectorsTemplate()}
        ${this.allWalletsTemplate()}
      </wui-flex>
      <w3m-legal-footer></w3m-legal-footer>
    `}walletConnectConnectorTemplate(){if(Gn.j1.isMobile())return null;const e=this.connectors.find((e=>"WALLET_CONNECT"===e.type));return e?Zn.dy`
      <wui-list-wallet
        imageSrc=${(0,Yn.o)(Gn.fz.getConnectorImage(e))}
        name=${e.name??"Unknown"}
        @click=${()=>this.onConnector(e)}
        tagLabel="qr code"
        tagVariant="main"
      >
      </wui-list-wallet>
    `:null}customTemplate(){const{customWallets:e}=Gn.OptionsController.state;return e?.length?this.filterOutDuplicateWallets(e).map((e=>Zn.dy`
        <wui-list-wallet
          imageSrc=${(0,Yn.o)(Gn.fz.getWalletImage(e))}
          name=${e.name??"Unknown"}
          @click=${()=>this.onConnectWallet(e)}
        >
        </wui-list-wallet>
      `)):null}featuredTemplate(){const{featured:e}=Gn.ApiController.state;return e.length?this.filterOutDuplicateWallets(e).map((e=>Zn.dy`
        <wui-list-wallet
          imageSrc=${(0,Yn.o)(Gn.fz.getWalletImage(e))}
          name=${e.name??"Unknown"}
          @click=${()=>this.onConnectWallet(e)}
        >
        </wui-list-wallet>
      `)):null}recentTemplate(){return Gn.MO.getRecentWallets().map((e=>Zn.dy`
        <wui-list-wallet
          imageSrc=${(0,Yn.o)(Gn.fz.getWalletImage(e))}
          name=${e.name??"Unknown"}
          @click=${()=>this.onConnectWallet(e)}
          tagLabel="recent"
          tagVariant="shade"
        >
        </wui-list-wallet>
      `))}announcedTemplate(){return this.connectors.map((e=>"ANNOUNCED"!==e.type?null:Zn.dy`
        <wui-list-wallet
          imageSrc=${(0,Yn.o)(Gn.fz.getConnectorImage(e))}
          name=${e.name??"Unknown"}
          @click=${()=>this.onConnector(e)}
          tagLabel="installed"
          tagVariant="success"
        >
        </wui-list-wallet>
      `))}injectedTemplate(){const e=this.connectors.find((e=>"ANNOUNCED"===e.type));return this.connectors.map((t=>"INJECTED"!==t.type?null:Gn.ConnectionController.checkInstalled()?Zn.dy`
        <wui-list-wallet
          imageSrc=${(0,Yn.o)(Gn.fz.getConnectorImage(t))}
          name=${t.name??"Unknown"}
          @click=${()=>this.onConnector(t)}
          tagLabel=${(0,Yn.o)(e?void 0:"installed")}
          tagVariant=${(0,Yn.o)(e?void 0:"success")}
        >
        </wui-list-wallet>
      `:null))}connectorsTemplate(){return this.connectors.map((e=>["WALLET_CONNECT","INJECTED","ANNOUNCED"].includes(e.type)?null:Zn.dy`
        <wui-list-wallet
          imageSrc=${(0,Yn.o)(Gn.fz.getConnectorImage(e))}
          name=${e.name??"Unknown"}
          @click=${()=>this.onConnector(e)}
        >
        </wui-list-wallet>
      `))}allWalletsTemplate(){const e=10*Math.floor(Gn.ApiController.state.count/10);return Zn.dy`
      <wui-list-wallet
        name="All Wallets"
        walletIcon="allWallets"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${`${e}+`}
        tagVariant="shade"
      ></wui-list-wallet>
    `}recommendedTemplate(){const{recommended:e}=Gn.ApiController.state,{customWallets:t,featuredWalletIds:r}=Gn.OptionsController.state,{connectors:n}=Gn.ConnectorController.state,i=Gn.MO.getRecentWallets(),o=n.filter((e=>"ANNOUNCED"===e.type));if(r||t||!e.length)return null;const a=o.length+i.length,s=Math.max(0,2-a);return this.filterOutDuplicateWallets(e).slice(0,s).map((e=>Zn.dy`
        <wui-list-wallet
          imageSrc=${(0,Yn.o)(Gn.fz.getWalletImage(e))}
          name=${e?.name??"Unknown"}
          @click=${()=>this.onConnectWallet(e)}
        >
        </wui-list-wallet>
      `))}onConnector(e){"WALLET_CONNECT"===e.type?Gn.j1.isMobile()?Gn.RouterController.push("AllWallets"):Gn.RouterController.push("ConnectingWalletConnect"):Gn.RouterController.push("ConnectingExternal",{connector:e})}filterOutDuplicateWallets(e){const{connectors:t}=Gn.ConnectorController.state,r=Gn.MO.getRecentWallets().map((e=>e.id)),n=t.map((e=>e.info?.rdns)).filter(Boolean);return e.filter((e=>!r.includes(e.id)&&!n.includes(e.rdns??void 0)))}onAllWallets(){Gn.Xs.sendEvent({type:"track",event:"CLICK_ALL_WALLETS"}),Gn.RouterController.push("AllWallets")}onConnectWallet(e){Gn.RouterController.push("ConnectingWalletConnect",{wallet:e})}};fi.styles=hi,pi([(0,Vn.SB)()],fi.prototype,"connectors",void 0),fi=pi([(0,qn.customElement)("w3m-connect-view")],fi);const gi=Zn.iv`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: calc(var(--wui-spacing-3xs) * -1);
    bottom: calc(var(--wui-spacing-3xs) * -1);
    opacity: 0;
    transform: scale(0.5);
    transition: all var(--wui-ease-out-power-2) var(--wui-duration-lg);
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px var(--wui-spacing-l);
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }
`;var wi=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};class bi extends Zn.oi{constructor(){super(),this.wallet=Gn.RouterController.state.data?.wallet,this.connector=Gn.RouterController.state.data?.connector,this.timeout=void 0,this.secondaryBtnLabel="Try again",this.secondaryBtnIcon="refresh",this.secondaryLabel="Accept connection request in the wallet",this.onConnect=void 0,this.onRender=void 0,this.onAutoConnect=void 0,this.isWalletConnect=!0,this.unsubscribe=[],this.imageSrc=Gn.fz.getWalletImage(this.wallet)??Gn.fz.getConnectorImage(this.connector),this.name=this.wallet?.name??this.connector?.name??"Wallet",this.isRetrying=!1,this.uri=Gn.ConnectionController.state.wcUri,this.error=Gn.ConnectionController.state.wcError,this.ready=!1,this.showRetry=!1,this.buffering=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(Gn.ConnectionController.subscribeKey("wcUri",(e=>{this.uri=e,this.isRetrying&&this.onRetry&&(this.isRetrying=!1,this.onConnect?.())})),Gn.ConnectionController.subscribeKey("wcError",(e=>this.error=e)),Gn.ConnectionController.subscribeKey("buffering",(e=>this.buffering=e)))}firstUpdated(){this.onAutoConnect?.(),this.showRetry=!this.onAutoConnect}disconnectedCallback(){this.unsubscribe.forEach((e=>e())),clearTimeout(this.timeout)}render(){this.onRender?.(),this.onShowRetry();const e=this.error?"Connection can be declined if a previous request is still active":this.secondaryLabel;let t=`Continue in ${this.name}`;return this.buffering&&(t="Connecting..."),this.error&&(t="Connection declined"),Zn.dy`
      <wui-flex
        data-error=${(0,Yn.o)(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-wallet-image size="lg" imageSrc=${(0,Yn.o)(this.imageSrc)}></wui-wallet-image>

          ${this.error?null:this.loaderTemplate()}

          <wui-icon-box
            backgroundColor="error-100"
            background="opaque"
            iconColor="error-100"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text variant="paragraph-500" color=${this.error?"error-100":"fg-100"}>
            ${t}
          </wui-text>
          <wui-text align="center" variant="small-500" color="fg-200">${e}</wui-text>
        </wui-flex>

        <wui-button
          variant="accent"
          ?disabled=${!this.error&&this.buffering}
          @click=${this.onTryAgain.bind(this)}
        >
          <wui-icon color="inherit" slot="iconLeft" name=${this.secondaryBtnIcon}></wui-icon>
          ${this.secondaryBtnLabel}
        </wui-button>
      </wui-flex>

      ${this.isWalletConnect?Zn.dy`
            <wui-flex .padding=${["0","xl","xl","xl"]} justifyContent="center">
              <wui-link @click=${this.onCopyUri} color="fg-200">
                <wui-icon size="sm" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
                Copy Link
              </wui-link>
            </wui-flex>
          `:null}

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onShowRetry(){if(this.error&&!this.showRetry){this.showRetry=!0;const e=this.shadowRoot?.querySelector("wui-button");e.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"})}}onTryAgain(){this.buffering||(Gn.ConnectionController.setWcError(!1),this.onRetry?(this.isRetrying=!0,this.onRetry?.()):this.onConnect?.())}loaderTemplate(){const e=Gn.ThemeController.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4;return Zn.dy`<wui-loading-thumbnail radius=${9*t}></wui-loading-thumbnail>`}onCopyUri(){try{this.uri&&(Gn.j1.copyToClopboard(this.uri),Gn.SnackController.showSuccess("Link copied"))}catch{Gn.SnackController.showError("Failed to copy")}}}bi.styles=gi,wi([(0,Vn.SB)()],bi.prototype,"uri",void 0),wi([(0,Vn.SB)()],bi.prototype,"error",void 0),wi([(0,Vn.SB)()],bi.prototype,"ready",void 0),wi([(0,Vn.SB)()],bi.prototype,"showRetry",void 0),wi([(0,Vn.SB)()],bi.prototype,"buffering",void 0),wi([(0,Vn.Cb)({type:Boolean})],bi.prototype,"isMobile",void 0),wi([(0,Vn.Cb)()],bi.prototype,"onRetry",void 0);const mi={INJECTED:"browser",ANNOUNCED:"browser"};let yi=class extends bi{constructor(){if(super(),!this.connector)throw new Error("w3m-connecting-view: No connector provided");Gn.Xs.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.connector.name??"Unknown",platform:mi[this.connector.type]??"external"}}),this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),this.isWalletConnect=!1}async onConnectProxy(){try{this.error=!1,this.connector&&(this.connector.imageUrl&&Gn.MO.setConnectedWalletImageUrl(this.connector.imageUrl),await Gn.ConnectionController.connectExternal(this.connector),Gn.IN.close(),Gn.Xs.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"external"}}))}catch(e){Gn.Xs.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:e?.message??"Unknown"}}),this.error=!0}}};yi=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}([(0,qn.customElement)("w3m-connecting-external-view")],yi);let vi=class extends Zn.oi{constructor(){super(...arguments),this.dappUrl=Gn.OptionsController.state.metadata?.url,this.dappName=Gn.OptionsController.state.metadata?.name}render(){return Zn.dy`
      <wui-flex justifyContent="center" .padding=${["2xl","0","xxl","0"]}>
        <w3m-connecting-siwe></w3m-connecting-siwe>
      </wui-flex>
      <wui-flex
        .padding=${["0","4xl","l","4xl"]}
        gap="s"
        justifyContent="space-between"
      >
        <wui-text variant="paragraph-500" align="center" color="fg-100"
          >${this.dappName??"Dapp"} wants to connect to your wallet</wui-text
        >
      </wui-flex>
      ${this.urlTemplate()}
      <wui-flex
        .padding=${["0","3xl","l","3xl"]}
        gap="s"
        justifyContent="space-between"
      >
        <wui-text variant="small-400" align="center" color="fg-200"
          >Sign this message to prove you own this wallet and to continue</wui-text
        >
      </wui-flex>
      <wui-flex .padding=${["l","xl","xl","xl"]} gap="s" justifyContent="space-between">
        <wui-button size="md" ?fullwidth=${!0} variant="shade" @click=${this.onCancel.bind(this)}>
          Cancel
        </wui-button>
        <wui-button size="md" ?fullwidth=${!0} variant="fill" @click=${this.onSign.bind(this)}>
          Sign
        </wui-button>
      </wui-flex>
    `}urlTemplate(){return this.dappUrl?Zn.dy`<wui-flex .padding=${["0","0","l","0"]} justifyContent="center">
        <wui-button size="sm" variant="accentBg" @click=${this.onDappLink.bind(this)}>
          ${this.dappUrl}
          <wui-icon size="sm" color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-button>
      </wui-flex>`:null}onDappLink(){this.dappUrl&&Gn.j1.openHref(this.dappUrl,"_blank")}onSign(){}onCancel(){Gn.RouterController.goBack()}};vi=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}([(0,qn.customElement)("w3m-connecting-siwe-view")],vi);var xi=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Ci=class extends Zn.oi{constructor(){super(),this.interval=void 0,this.lastRetry=Date.now(),this.wallet=Gn.RouterController.state.data?.wallet,this.platform=void 0,this.platforms=[],this.initializeConnection(),this.interval=setInterval(this.initializeConnection.bind(this),Gn.bq.TEN_SEC_MS)}disconnectedCallback(){clearTimeout(this.interval)}render(){return this.wallet?(this.determinePlatforms(),Zn.dy`
      ${this.headerTemplate()}
      <div>${this.platformTemplate()}</div>
    `):Zn.dy`<w3m-connecting-wc-qrcode></w3m-connecting-wc-qrcode>`}async initializeConnection(e=!1){try{const{wcPairingExpiry:t}=Gn.ConnectionController.state;if(e||Gn.j1.isPairingExpired(t)){if(Gn.ConnectionController.connectWalletConnect(),this.wallet){const e=Gn.fz.getWalletImage(this.wallet);e&&Gn.MO.setConnectedWalletImageUrl(e)}else{const e=Gn.ConnectorController.state.connectors.find((e=>"WALLET_CONNECT"===e.type)),t=Gn.fz.getConnectorImage(e);t&&Gn.MO.setConnectedWalletImageUrl(t)}await Gn.ConnectionController.state.wcPromise,this.finalizeConnection(),Gn.IN.close()}}catch(e){Gn.Xs.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:e?.message??"Unknown"}}),Gn.ConnectionController.setWcError(!0),Gn.j1.isAllowedRetry(this.lastRetry)&&(Gn.SnackController.showError("Declined"),this.lastRetry=Date.now(),this.initializeConnection(!0))}}finalizeConnection(){const{wcLinking:e,recentWallet:t}=Gn.ConnectionController.state;e&&Gn.MO.setWalletConnectDeepLink(e),t&&Gn.MO.setWeb3ModalRecent(t),Gn.Xs.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:e?"mobile":"qrcode"}})}determinePlatforms(){if(!this.wallet)throw new Error("w3m-connecting-wc-view:determinePlatforms No wallet");if(this.platform)return;const{mobile_link:e,desktop_link:t,webapp_link:r,injected:n,rdns:i}=this.wallet,o=n?.map((({injected_id:e})=>e)).filter(Boolean),a=i?[i]:o??[],s=a.length,c=e,l=r,u=Gn.ConnectionController.checkInstalled(a),d=s&&u,h=t&&!Gn.j1.isMobile();d&&this.platforms.push("browser"),c&&this.platforms.push(Gn.j1.isMobile()?"mobile":"qrcode"),l&&this.platforms.push("web"),h&&this.platforms.push("desktop"),!d&&s&&this.platforms.push("unsupported"),this.platform=this.platforms[0]}platformTemplate(){switch(this.platform){case"browser":return Zn.dy`<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;case"desktop":return Zn.dy`
          <w3m-connecting-wc-desktop .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-desktop>
        `;case"web":return Zn.dy`
          <w3m-connecting-wc-web .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-web>
        `;case"mobile":return Zn.dy`
          <w3m-connecting-wc-mobile isMobile .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-mobile>
        `;case"qrcode":return Zn.dy`<w3m-connecting-wc-qrcode></w3m-connecting-wc-qrcode>`;default:return Zn.dy`<w3m-connecting-wc-unsupported></w3m-connecting-wc-unsupported>`}}headerTemplate(){return this.platforms.length>1?Zn.dy`
      <w3m-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </w3m-connecting-header>
    `:null}async onSelectPlatform(e){const t=this.shadowRoot?.querySelector("div");t&&(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.platform=e,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}};xi([(0,Vn.SB)()],Ci.prototype,"platform",void 0),xi([(0,Vn.SB)()],Ci.prototype,"platforms",void 0),Ci=xi([(0,qn.customElement)("w3m-connecting-wc-view")],Ci);let ki=class extends Zn.oi{constructor(){super(...arguments),this.wallet=Gn.RouterController.state.data?.wallet}render(){if(!this.wallet)throw new Error("w3m-downloads-view");return Zn.dy`
      <wui-flex gap="xs" flexDirection="column" .padding=${["s","s","l","s"]}>
        ${this.chromeTemplate()} ${this.iosTemplate()} ${this.androidTemplate()}
        ${this.homepageTemplate()}
      </wui-flex>
    `}chromeTemplate(){return this.wallet?.chrome_store?Zn.dy`<wui-list-item
      variant="icon"
      icon="chromeStore"
      iconVariant="square"
      @click=${this.onChromeStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">Chrome Extension</wui-text>
    </wui-list-item>`:null}iosTemplate(){return this.wallet?.app_store?Zn.dy`<wui-list-item
      variant="icon"
      icon="appStore"
      iconVariant="square"
      @click=${this.onAppStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">iOS App</wui-text>
    </wui-list-item>`:null}androidTemplate(){return this.wallet?.play_store?Zn.dy`<wui-list-item
      variant="icon"
      icon="playStore"
      iconVariant="square"
      @click=${this.onPlayStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">Android App</wui-text>
    </wui-list-item>`:null}homepageTemplate(){return this.wallet?.homepage?Zn.dy`
      <wui-list-item
        variant="icon"
        icon="browser"
        iconVariant="square-blue"
        @click=${this.onHomePage.bind(this)}
        chevron
      >
        <wui-text variant="paragraph-500" color="fg-100">Website</wui-text>
      </wui-list-item>
    `:null}onChromeStore(){this.wallet?.chrome_store&&Gn.j1.openHref(this.wallet.chrome_store,"_blank")}onAppStore(){this.wallet?.app_store&&Gn.j1.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&Gn.j1.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&Gn.j1.openHref(this.wallet.homepage,"_blank")}};ki=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}([(0,qn.customElement)("w3m-downloads-view")],ki);let Ei=class extends Zn.oi{render(){return Zn.dy`
      <wui-flex flexDirection="column" padding="s" gap="xs">
        ${this.recommendedWalletsTemplate()}
        <wui-list-wallet
          name="Explore all"
          showAllWallets
          walletIcon="allWallets"
          icon="externalLink"
          @click=${()=>{Gn.j1.openHref("https://walletconnect.com/explorer?type=wallet","_blank")}}
        ></wui-list-wallet>
      </wui-flex>
    `}recommendedWalletsTemplate(){const{recommended:e,featured:t}=Gn.ApiController.state,{customWallets:r}=Gn.OptionsController.state;return[...t,...r??[],...e].slice(0,4).map((e=>Zn.dy`
        <wui-list-wallet
          name=${e.name??"Unknown"}
          tagVariant="main"
          imageSrc=${(0,Yn.o)(Gn.fz.getWalletImage(e))}
          @click=${()=>{Gn.j1.openHref(e.homepage??"https://walletconnect.com/explorer","_blank")}}
        ></wui-list-wallet>
      `))}};Ei=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}([(0,qn.customElement)("w3m-get-wallet-view")],Ei);const Pi=Zn.iv`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-hexagon {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: 4px;
    bottom: 0;
    opacity: 0;
    transform: scale(0.5);
    z-index: 1;
    transition: all var(--wui-ease-out-power-2) var(--wui-duration-lg);
  }

  wui-button {
    display: none;
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  wui-button[data-retry='true'] {
    display: block;
    opacity: 1;
  }
`;var $i=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Si=class extends Zn.oi{constructor(){super(),this.network=Gn.RouterController.state.data?.network,this.unsubscribe=[],this.showRetry=!1,this.error=!1,this.currentNetwork=Gn.NetworkController.state.caipNetwork,this.unsubscribe.push(Gn.NetworkController.subscribeKey("caipNetwork",(e=>{e?.id!==this.currentNetwork?.id&&Gn.RouterController.goBack()})))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}firstUpdated(){this.onSwitchNetwork()}render(){if(!this.network)throw new Error("w3m-network-switch-view: No network provided");this.onShowRetry();const e=this.error?"Switch declined":"Approve in wallet",t=this.error?"Switch can be declined if chain is not supported by a wallet or previous request is still active":"Accept connection request in your wallet";return Zn.dy`
      <wui-flex
        data-error=${this.error}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","3xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-network-image
            size="lg"
            imageSrc=${(0,Yn.o)(Gn.fz.getNetworkImage(this.network))}
          ></wui-network-image>

          ${this.error?null:Zn.dy`<wui-loading-hexagon></wui-loading-hexagon>`}

          <wui-icon-box
            backgroundColor="error-100"
            background="opaque"
            iconColor="error-100"
            icon="close"
            size="sm"
            ?border=${!0}
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text align="center" variant="paragraph-500" color="fg-100">${e}</wui-text>
          <wui-text align="center" variant="small-500" color="fg-200">${t}</wui-text>
        </wui-flex>

        <wui-button
          data-retry=${this.showRetry}
          variant="fill"
          .disabled=${!this.error}
          @click=${this.onSwitchNetwork.bind(this)}
        >
          <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
          Try again
        </wui-button>
      </wui-flex>
    `}onShowRetry(){if(this.error&&!this.showRetry){this.showRetry=!0;const e=this.shadowRoot?.querySelector("wui-button");e.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"})}}async onSwitchNetwork(){try{this.error=!1,this.network&&(await Gn.NetworkController.switchActiveNetwork(this.network),Gn.RouterController.goBack())}catch{this.error=!0}}};Si.styles=Pi,$i([(0,Vn.SB)()],Si.prototype,"showRetry",void 0),$i([(0,Vn.SB)()],Si.prototype,"error",void 0),$i([(0,Vn.SB)()],Si.prototype,"currentNetwork",void 0),Si=$i([(0,qn.customElement)("w3m-network-switch-view")],Si);var _i=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Ai=class extends Zn.oi{constructor(){super(),this.unsubscribe=[],this.caipNetwork=Gn.NetworkController.state.caipNetwork,this.unsubscribe.push(Gn.NetworkController.subscribeKey("caipNetwork",(e=>this.caipNetwork=e)))}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){return Zn.dy`
      <wui-grid padding="s" gridTemplateColumns="repeat(4, 1fr)" rowGap="l" columnGap="xs">
        ${this.networksTemplate()}
      </wui-grid>

      <wui-separator></wui-separator>

      <wui-flex padding="s" flexDirection="column" gap="m" alignItems="center">
        <wui-text variant="small-500" color="fg-300" align="center">
          Your connected wallet may not support some of the networks available for this dApp
        </wui-text>
        <wui-link @click=${this.onNetworkHelp.bind(this)}>
          <wui-icon size="xs" color="accent-100" slot="iconLeft" name="helpCircle"></wui-icon>
          What is a network
        </wui-link>
      </wui-flex>
    `}onNetworkHelp(){Gn.Xs.sendEvent({type:"track",event:"CLICK_NETWORK_HELP"}),Gn.RouterController.push("WhatIsANetwork")}networksTemplate(){const{approvedCaipNetworkIds:e,requestedCaipNetworks:t,supportsAllNetworks:r}=Gn.NetworkController.state,n=e,i=t;return n?.length&&i?.sort(((e,t)=>n.indexOf(t.id)-n.indexOf(e.id))),i?.map((e=>Zn.dy`
        <wui-card-select
          .selected=${this.caipNetwork?.id===e.id}
          imageSrc=${(0,Yn.o)(Gn.fz.getNetworkImage(e))}
          type="network"
          name=${e.name??e.id}
          @click=${()=>this.onSwitchNetwork(e)}
          .disabled=${!r&&!n?.includes(e.id)}
        ></wui-card-select>
      `))}async onSwitchNetwork(e){const{isConnected:t}=Gn.AccountController.state,{approvedCaipNetworkIds:r,supportsAllNetworks:n,caipNetwork:i}=Gn.NetworkController.state;t&&i?.id!==e.id?r?.includes(e.id)?await Gn.NetworkController.switchActiveNetwork(e):n&&Gn.RouterController.push("SwitchNetwork",{network:e}):t||(Gn.NetworkController.setCaipNetwork(e),Gn.RouterController.push("Connect"))}};_i([(0,Vn.SB)()],Ai.prototype,"caipNetwork",void 0),Ai=_i([(0,qn.customElement)("w3m-networks-view")],Ai);var Ii=a(248);const Oi=Zn.iv`
  :host > wui-flex:first-child {
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }
`;var Ti=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};const Ni="last-transaction";let Ri=class extends Zn.oi{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.address=Gn.AccountController.state.address,this.transactions=Gn.sl.state.transactions,this.transactionsByYear=Gn.sl.state.transactionsByYear,this.loading=Gn.sl.state.loading,this.empty=Gn.sl.state.empty,this.next=Gn.sl.state.next,this.unsubscribe.push(Gn.AccountController.subscribe((e=>{e.isConnected&&this.address!==e.address&&(this.address=e.address,Gn.sl.resetTransactions(),Gn.sl.fetchTransactions(e.address))})),Gn.sl.subscribe((e=>{this.transactions=e.transactions,this.transactionsByYear=e.transactionsByYear,this.loading=e.loading,this.empty=e.empty,this.next=e.next})))}firstUpdated(){0===this.transactions.length&&Gn.sl.fetchTransactions(this.address),this.createPaginationObserver()}updated(){this.setPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach((e=>e()))}render(){return Zn.dy`
      <wui-flex flexDirection="column" padding="s" gap="s">
        ${this.empty?null:this.templateTransactionsByYear()}
        ${this.loading?this.templateLoading():null}
        ${!this.loading&&this.empty?this.templateEmpty():null}
      </wui-flex>
    `}templateTransactionsByYear(){const e=Object.keys(this.transactionsByYear).sort().reverse();return e.map(((t,r)=>{const n=r===e.length-1,i=parseInt(t,10),o=qn.TransactionUtil.getTransactionGroupTitle(i),a=this.transactionsByYear[i];return a?Zn.dy`
        <wui-flex flexDirection="column" gap="sm">
          <wui-flex
            alignItems="center"
            flexDirection="row"
            .padding=${["xs","s","s","s"]}
          >
            <wui-text variant="paragraph-500" color="fg-200">${o}</wui-text>
          </wui-flex>
          <wui-flex flexDirection="column" gap="xs">
            ${this.templateTransactions(a,n)}
          </wui-flex>
        </wui-flex>
      `:null}))}templateRenderTransaction(e,t){const{date:r,descriptions:n,direction:i,isAllNFT:o,images:a,status:s,transfers:c,type:l}=this.getTransactionListItemProps(e),u=c?.length>1;return 2!==c?.length||o?u?c.map(((e,n)=>{const i=qn.TransactionUtil.getTransferDescription(e),o=t&&n===c.length-1;return Zn.dy` <wui-transaction-list-item
          date=${r}
          direction=${e.direction}
          id=${o&&this.next?Ni:""}
          status=${s}
          type=${l}
          onlyDirectionIcon=${!0}
          .images=${[a?.[n]]}
          .descriptions=${[i]}
        ></wui-transaction-list-item>`})):Zn.dy`
      <wui-transaction-list-item
        date=${r}
        direction=${i}
        id=${t&&this.next?Ni:""}
        status=${s}
        type=${l}
        .images=${a}
        .descriptions=${n}
      ></wui-transaction-list-item>
    `:Zn.dy`
        <wui-transaction-list-item
          date=${r}
          direction=${i}
          id=${t&&this.next?Ni:""}
          status=${s}
          type=${l}
          .images=${a}
          .descriptions=${n}
        ></wui-transaction-list-item>
      `}templateTransactions(e,t){return e.map(((r,n)=>{const i=t&&n===e.length-1;return Zn.dy`${this.templateRenderTransaction(r,i)}`}))}templateEmpty(){return Zn.dy`
      <wui-flex
        flexGrow="1"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        .padding=${["3xl","xl","3xl","xl"]}
        gap="xl"
      >
        <wui-icon-box
          backgroundColor="glass-005"
          background="gray"
          iconColor="fg-200"
          icon="wallet"
          size="lg"
          ?border=${!0}
          borderColor="wui-color-bg-125"
        ></wui-icon-box>
        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text align="center" variant="paragraph-500" color="fg-100"
            >No Transactions yet</wui-text
          >
          <wui-text align="center" variant="small-500" color="fg-200"
            >Start trading on dApps <br />
            to grow your wallet!</wui-text
          >
        </wui-flex>
      </wui-flex>
    `}templateLoading(){return Array(7).fill(Zn.dy` <wui-transaction-list-item-loader></wui-transaction-list-item-loader> `).map((e=>e))}createPaginationObserver(){const{projectId:e}=Gn.OptionsController.state;this.paginationObserver=new IntersectionObserver((([t])=>{t?.isIntersecting&&!this.loading&&(Gn.sl.fetchTransactions(this.address),Gn.Xs.sendEvent({type:"track",event:"LOAD_MORE_TRANSACTIONS",properties:{address:this.address,projectId:e,cursor:this.next}}))}),{}),this.setPaginationObserver()}setPaginationObserver(){this.paginationObserver?.disconnect();const e=this.shadowRoot?.querySelector(`#${Ni}`);e&&this.paginationObserver?.observe(e)}getTransactionListItemProps(e){const t=Ii.E.getRelativeDateFromNow(e?.metadata?.minedAt),r=qn.TransactionUtil.getTransactionDescriptions(e),n=e?.transfers,i=e?.transfers?.[0],o=Boolean(i)&&e?.transfers?.every((e=>Boolean(e.nft_info))),a=qn.TransactionUtil.getTransactionImages(n);return{date:t,direction:i?.direction,descriptions:r,isAllNFT:o,images:a,status:e.metadata?.status,transfers:n,type:e.metadata?.operationType}}};Ri.styles=Oi,Ti([(0,Vn.SB)()],Ri.prototype,"address",void 0),Ti([(0,Vn.SB)()],Ri.prototype,"transactions",void 0),Ti([(0,Vn.SB)()],Ri.prototype,"transactionsByYear",void 0),Ti([(0,Vn.SB)()],Ri.prototype,"loading",void 0),Ti([(0,Vn.SB)()],Ri.prototype,"empty",void 0),Ti([(0,Vn.SB)()],Ri.prototype,"next",void 0),Ri=Ti([(0,qn.customElement)("w3m-transactions-view")],Ri);const ji=[{images:["network","layers","system"],title:"The system’s nuts and bolts",text:"A network is what brings the blockchain to life, as this technical infrastructure allows apps to access the ledger and smart contract services."},{images:["noun","defiAlt","dao"],title:"Designed for different uses",text:"Each network is designed differently, and may therefore suit certain apps and experiences."}];let Bi=class extends Zn.oi{render(){return Zn.dy`
      <wui-flex
        flexDirection="column"
        .padding=${["xxl","xl","xl","xl"]}
        alignItems="center"
        gap="xl"
      >
        <w3m-help-widget .data=${ji}></w3m-help-widget>
        <wui-button
          variant="fill"
          size="sm"
          @click=${()=>{Gn.j1.openHref("https://ethereum.org/en/developers/docs/networks/","_blank")}}
        >
          Learn more
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-button>
      </wui-flex>
    `}};Bi=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}([(0,qn.customElement)("w3m-what-is-a-network-view")],Bi);const Mi=[{images:["login","profile","lock"],title:"One login for all of web3",text:"Log in to any app by connecting your wallet. Say goodbye to countless passwords!"},{images:["defi","nft","eth"],title:"A home for your digital assets",text:"A wallet lets you store, send and receive digital assets like cryptocurrencies and NFTs."},{images:["browser","noun","dao"],title:"Your gateway to a new web",text:"With your wallet, you can explore and interact with DeFi, NFTs, DAOs, and much more."}];let Ui=class extends Zn.oi{render(){return Zn.dy`
      <wui-flex
        flexDirection="column"
        .padding=${["xxl","xl","xl","xl"]}
        alignItems="center"
        gap="xl"
      >
        <w3m-help-widget .data=${Mi}></w3m-help-widget>
        <wui-button variant="fill" size="sm" @click=${this.onGetWallet.bind(this)}>
          <wui-icon color="inherit" slot="iconLeft" name="wallet"></wui-icon>
          Get a Wallet
        </wui-button>
      </wui-flex>
    `}onGetWallet(){Gn.Xs.sendEvent({type:"track",event:"CLICK_GET_WALLET"}),Gn.RouterController.push("GetWallet")}};Ui=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}([(0,qn.customElement)("w3m-what-is-a-wallet-view")],Ui);const Li=Zn.iv`
  wui-grid {
    max-height: clamp(360px, 400px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 76px);
  }

  @media (max-width: 435px) {
    wui-grid {
      grid-template-columns: repeat(auto-fill, 77px);
    }
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    padding-top: var(--wui-spacing-l);
    padding-bottom: var(--wui-spacing-l);
    justify-content: center;
    grid-column: 1 / span 4;
  }
`;var Di=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};const zi="local-paginator";let Wi=class extends Zn.oi{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.initial=!Gn.ApiController.state.wallets.length,this.wallets=Gn.ApiController.state.wallets,this.recommended=Gn.ApiController.state.recommended,this.featured=Gn.ApiController.state.featured,this.unsubscribe.push(Gn.ApiController.subscribeKey("wallets",(e=>this.wallets=e)),Gn.ApiController.subscribeKey("recommended",(e=>this.recommended=e)),Gn.ApiController.subscribeKey("featured",(e=>this.featured=e)))}firstUpdated(){this.initialFetch(),this.createPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach((e=>e())),this.paginationObserver?.disconnect()}render(){return Zn.dy`
      <wui-grid
        data-scroll=${!this.initial}
        .padding=${["0","s","s","s"]}
        columnGap="xxs"
        rowGap="l"
        justifyContent="space-between"
      >
        ${this.initial?this.shimmerTemplate(16):this.walletsTemplate()}
        ${this.paginationLoaderTemplate()}
      </wui-grid>
    `}async initialFetch(){const e=this.shadowRoot?.querySelector("wui-grid");this.initial&&e&&(await Gn.ApiController.fetchWallets({page:1}),await e.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.initial=!1,e.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}shimmerTemplate(e,t){return[...Array(e)].map((()=>Zn.dy`
        <wui-card-select-loader type="wallet" id=${(0,Yn.o)(t)}></wui-card-select-loader>
      `))}walletsTemplate(){return[...this.featured,...this.recommended,...this.wallets].map((e=>Zn.dy`
        <wui-card-select
          imageSrc=${(0,Yn.o)(Gn.fz.getWalletImage(e))}
          type="wallet"
          name=${e.name}
          @click=${()=>this.onConnectWallet(e)}
        ></wui-card-select>
      `))}paginationLoaderTemplate(){const{wallets:e,recommended:t,featured:r,count:n}=Gn.ApiController.state,i=window.innerWidth<352?3:4,o=e.length+t.length;let a=Math.ceil(o/i)*i-o+i;return a-=e.length?r.length%i:0,0===n||[...r,...e,...t].length<n?this.shimmerTemplate(a,zi):null}createPaginationObserver(){const e=this.shadowRoot?.querySelector(`#${zi}`);e&&(this.paginationObserver=new IntersectionObserver((([e])=>{if(e?.isIntersecting&&!this.initial){const{page:e,count:t,wallets:r}=Gn.ApiController.state;r.length<t&&Gn.ApiController.fetchWallets({page:e+1})}})),this.paginationObserver.observe(e))}onConnectWallet(e){const{connectors:t}=Gn.ConnectorController.state,r=t.find((({explorerId:t})=>t===e.id));r?Gn.RouterController.push("ConnectingExternal",{connector:r}):Gn.RouterController.push("ConnectingWalletConnect",{wallet:e})}};Wi.styles=Li,Di([(0,Vn.SB)()],Wi.prototype,"initial",void 0),Di([(0,Vn.SB)()],Wi.prototype,"wallets",void 0),Di([(0,Vn.SB)()],Wi.prototype,"recommended",void 0),Di([(0,Vn.SB)()],Wi.prototype,"featured",void 0),Wi=Di([(0,qn.customElement)("w3m-all-wallets-list")],Wi);const Fi=Zn.iv`
  wui-grid,
  wui-loading-spinner,
  wui-flex {
    height: 360px;
  }

  wui-grid {
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    justify-content: center;
    align-items: center;
  }
`;var Hi=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Gi=class extends Zn.oi{constructor(){super(...arguments),this.prevQuery="",this.loading=!0,this.query=""}render(){return this.onSearch(),this.loading?Zn.dy`<wui-loading-spinner color="accent-100"></wui-loading-spinner>`:this.walletsTemplate()}async onSearch(){this.query!==this.prevQuery&&(this.prevQuery=this.query,this.loading=!0,await Gn.ApiController.searchWallet({search:this.query}),this.loading=!1)}walletsTemplate(){const{search:e}=Gn.ApiController.state;return e.length?Zn.dy`
      <wui-grid
        .padding=${["0","s","s","s"]}
        gridTemplateColumns="repeat(4, 1fr)"
        rowGap="l"
        columnGap="xs"
      >
        ${e.map((e=>Zn.dy`
            <wui-card-select
              imageSrc=${(0,Yn.o)(Gn.fz.getWalletImage(e))}
              type="wallet"
              name=${e.name}
              @click=${()=>this.onConnectWallet(e)}
            ></wui-card-select>
          `))}
      </wui-grid>
    `:Zn.dy`
        <wui-flex justifyContent="center" alignItems="center" gap="s" flexDirection="column">
          <wui-icon-box
            size="lg"
            iconColor="fg-200"
            backgroundColor="fg-300"
            icon="wallet"
            background="transparent"
          ></wui-icon-box>
          <wui-text color="fg-200" variant="paragraph-500">No Wallet found</wui-text>
        </wui-flex>
      `}onConnectWallet(e){const{connectors:t}=Gn.ConnectorController.state,r=t.find((({explorerId:t})=>t===e.id));r?Gn.RouterController.push("ConnectingExternal",{connector:r}):Gn.RouterController.push("ConnectingWalletConnect",{wallet:e})}};Gi.styles=Fi,Hi([(0,Vn.SB)()],Gi.prototype,"loading",void 0),Hi([(0,Vn.Cb)()],Gi.prototype,"query",void 0),Gi=Hi([(0,qn.customElement)("w3m-all-wallets-search")],Gi);var qi=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let Zi=class extends Zn.oi{constructor(){super(),this.platformTabs=[],this.unsubscribe=[],this.platforms=[],this.onSelectPlatfrom=void 0,this.buffering=!1,this.unsubscribe.push(Gn.ConnectionController.subscribeKey("buffering",(e=>this.buffering=e)))}disconnectCallback(){this.unsubscribe.forEach((e=>e()))}render(){const e=this.generateTabs();return Zn.dy`
      <wui-flex justifyContent="center" .padding=${["l","0","0","0"]}>
        <wui-tabs
          ?disabled=${this.buffering}
          .tabs=${e}
          .onTabChange=${this.onTabChange.bind(this)}
        ></wui-tabs>
      </wui-flex>
    `}generateTabs(){const e=this.platforms.map((e=>"browser"===e?{label:"Browser",icon:"extension",platform:"browser"}:"mobile"===e?{label:"Mobile",icon:"mobile",platform:"mobile"}:"qrcode"===e?{label:"Mobile",icon:"mobile",platform:"qrcode"}:"web"===e?{label:"Webapp",icon:"browser",platform:"web"}:"desktop"===e?{label:"Desktop",icon:"desktop",platform:"desktop"}:{label:"Browser",icon:"extension",platform:"unsupported"}));return this.platformTabs=e.map((({platform:e})=>e)),e}onTabChange(e){const t=this.platformTabs[e];t&&this.onSelectPlatfrom?.(t)}};qi([(0,Vn.Cb)({type:Array})],Zi.prototype,"platforms",void 0),qi([(0,Vn.Cb)()],Zi.prototype,"onSelectPlatfrom",void 0),qi([(0,Vn.SB)()],Zi.prototype,"buffering",void 0),Zi=qi([(0,qn.customElement)("w3m-connecting-header")],Zi);let Vi=class extends bi{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-browser: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),Gn.Xs.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser"}})}async onConnectProxy(){try{this.error=!1;const{connectors:e}=Gn.ConnectorController.state,t=e.find((e=>"ANNOUNCED"===e.type&&e.info?.rdns===this.wallet?.rdns)),r=e.find((e=>"INJECTED"===e.type));t?await Gn.ConnectionController.connectExternal(t):r&&await Gn.ConnectionController.connectExternal(r),Gn.IN.close(),Gn.Xs.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"browser"}})}catch(e){Gn.Xs.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:e?.message??"Unknown"}}),this.error=!0}}};Vi=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}([(0,qn.customElement)("w3m-connecting-wc-browser")],Vi);let Yi=class extends bi{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-desktop: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),Gn.Xs.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"desktop"}})}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0,this.timeout=setTimeout((()=>{this.onConnect?.()}),200))}onConnectProxy(){if(this.wallet?.desktop_link&&this.uri)try{this.error=!1;const{desktop_link:e,name:t}=this.wallet,{redirect:r,href:n}=Gn.j1.formatNativeUrl(e,this.uri);Gn.ConnectionController.setWcLinking({name:t,href:n}),Gn.ConnectionController.setRecentWallet(this.wallet),Gn.j1.openHref(r,"_self")}catch{this.error=!0}}};Yi=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}([(0,qn.customElement)("w3m-connecting-wc-desktop")],Yi);let Ki=class extends bi{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-mobile: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),document.addEventListener("visibilitychange",this.onBuffering.bind(this)),Gn.Xs.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"mobile"}})}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this.onBuffering.bind(this))}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onConnectProxy(){if(this.wallet?.mobile_link&&this.uri)try{this.error=!1;const{mobile_link:e,name:t}=this.wallet,{redirect:r,href:n}=Gn.j1.formatNativeUrl(e,this.uri);Gn.ConnectionController.setWcLinking({name:t,href:n}),Gn.ConnectionController.setRecentWallet(this.wallet),Gn.j1.openHref(r,"_self")}catch{this.error=!0}}onBuffering(){const e=Gn.j1.isIos();"visible"===document?.visibilityState&&!this.error&&e&&(Gn.ConnectionController.setBuffering(!0),setTimeout((()=>{Gn.ConnectionController.setBuffering(!1)}),5e3))}};Ki=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}([(0,qn.customElement)("w3m-connecting-wc-mobile")],Ki);const Xi=Zn.iv`
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px) !important;
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: 200ms;
    animation-timing-function: ease;
    animation-name: fadein;
    animation-fill-mode: forwards;
  }
`;let Ji=class extends bi{constructor(){super(),this.forceUpdate=()=>{this.requestUpdate()},window.addEventListener("resize",this.forceUpdate),Gn.Xs.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet?.name??"WalletConnect",platform:"qrcode"}})}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("resize",this.forceUpdate)}render(){return this.onRenderProxy(),Zn.dy`
      <wui-flex padding="xl" flexDirection="column" gap="xl" alignItems="center">
        <wui-shimmer borderRadius="l" width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>

        <wui-text variant="paragraph-500" color="fg-100">
          Scan this QR Code with your phone
        </wui-text>

        <wui-link @click=${this.onCopyUri} color="fg-200">
          <wui-icon size="sm" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
          Copy Link
        </wui-link>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onRenderProxy(){!this.ready&&this.uri&&(this.timeout=setTimeout((()=>{this.ready=!0}),200))}qrCodeTemplate(){if(!this.uri||!this.ready)return null;const e=this.getBoundingClientRect().width-40,t=this.wallet?this.wallet.name:void 0;return Gn.ConnectionController.setWcLinking(void 0),Gn.ConnectionController.setRecentWallet(this.wallet),Zn.dy`<wui-qr-code
      size=${e}
      theme=${Gn.ThemeController.state.themeMode}
      uri=${this.uri}
      imageSrc=${(0,Yn.o)(Gn.fz.getWalletImage(this.wallet))}
      alt=${(0,Yn.o)(t)}
    ></wui-qr-code>`}};Ji.styles=Xi,Ji=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}([(0,qn.customElement)("w3m-connecting-wc-qrcode")],Ji);const Qi=Zn.iv`
  :host {
    display: flex;
    justify-content: center;
    gap: var(--wui-spacing-2xl);
  }

  wui-visual-thumbnail:nth-child(1) {
    z-index: 1;
  }
`;let eo=class extends Zn.oi{constructor(){super(...arguments),this.dappImageUrl=Gn.OptionsController.state.metadata?.icons,this.walletImageUrl=Gn.MO.getConnectedWalletImageUrl()}firstUpdated(){const e=this.shadowRoot?.querySelectorAll("wui-visual-thumbnail");e?.[0]&&this.createAnimation(e[0],"translate(18px)"),e?.[1]&&this.createAnimation(e[1],"translate(-18px)")}render(){return Zn.dy`
      <wui-visual-thumbnail
        ?borderRadiusFull=${!0}
        .imageSrc=${this.dappImageUrl?.[0]}
      ></wui-visual-thumbnail>
      <wui-visual-thumbnail .imageSrc=${this.walletImageUrl}></wui-visual-thumbnail>
    `}createAnimation(e,t){e.animate([{transform:"translateX(0px)"},{transform:t}],{duration:1600,easing:"cubic-bezier(0.56, 0, 0.48, 1)",direction:"alternate",iterations:1/0})}};eo.styles=Qi,eo=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}([(0,qn.customElement)("w3m-connecting-siwe")],eo);let to=class extends Zn.oi{constructor(){if(super(),this.wallet=Gn.RouterController.state.data?.wallet,!this.wallet)throw new Error("w3m-connecting-wc-unsupported: No wallet provided");Gn.Xs.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser"}})}render(){return Zn.dy`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-wallet-image
          size="lg"
          imageSrc=${(0,Yn.o)(Gn.fz.getWalletImage(this.wallet))}
        ></wui-wallet-image>

        <wui-text variant="paragraph-500" color="fg-100">Not Detected</wui-text>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}};to=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}([(0,qn.customElement)("w3m-connecting-wc-unsupported")],to);let ro=class extends bi{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-web: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.secondaryBtnLabel="Open",this.secondaryLabel="Open and continue in a new browser tab",this.secondaryBtnIcon="externalLink",Gn.Xs.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"web"}})}onConnectProxy(){if(this.wallet?.webapp_link&&this.uri)try{this.error=!1;const{webapp_link:e,name:t}=this.wallet,{redirect:r,href:n}=Gn.j1.formatUniversalUrl(e,this.uri);Gn.ConnectionController.setWcLinking({name:t,href:n}),Gn.ConnectionController.setRecentWallet(this.wallet),Gn.j1.openHref(r,"_blank")}catch{this.error=!0}}};ro=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}([(0,qn.customElement)("w3m-connecting-wc-web")],ro);const no=Zn.iv`
  wui-icon-link[data-hidden='true'] {
    opacity: 0 !important;
    pointer-events: none;
  }
`;var io=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};function oo(){const e=Gn.RouterController.state.data?.connector?.name,t=Gn.RouterController.state.data?.wallet?.name,r=Gn.RouterController.state.data?.network?.name,n=t??e;return{Connect:"Connect Wallet",Account:void 0,ConnectingExternal:n??"Connect Wallet",ConnectingWalletConnect:n??"WalletConnect",ConnectingSiwe:"Sign In",Networks:"Choose Network",SwitchNetwork:r??"Switch Network",AllWallets:"All Wallets",WhatIsANetwork:"What is a network?",WhatIsAWallet:"What is a wallet?",GetWallet:"Get a Wallet",Downloads:n?`Get ${n}`:"Downloads",Transactions:"Activity"}}let ao=class extends Zn.oi{constructor(){super(),this.unsubscribe=[],this.heading=oo()[Gn.RouterController.state.view],this.buffering=!1,this.showBack=!1,this.unsubscribe.push(Gn.RouterController.subscribeKey("view",(e=>{this.onViewChange(e),this.onHistoryChange()})),Gn.ConnectionController.subscribeKey("buffering",(e=>this.buffering=e)))}disconnectCallback(){this.unsubscribe.forEach((e=>e()))}render(){return Zn.dy`
      <wui-flex .padding=${this.getPadding()} justifyContent="space-between" alignItems="center">
        ${this.dynamicButtonTemplate()} ${this.titleTemplate()}
        <wui-icon-link
          ?disabled=${this.buffering}
          icon="close"
          @click=${Gn.IN.close}
        ></wui-icon-link>
      </wui-flex>
      ${this.separatorTemplate()}
    `}onWalletHelp(){Gn.Xs.sendEvent({type:"track",event:"CLICK_WALLET_HELP"}),Gn.RouterController.push("WhatIsAWallet")}titleTemplate(){return Zn.dy`<wui-text variant="paragraph-700" color="fg-100">${this.heading}</wui-text>`}dynamicButtonTemplate(){const{view:e}=Gn.RouterController.state,t="Connect"===e;return this.showBack?Zn.dy`<wui-icon-link
        id="dynamic"
        icon="chevronLeft"
        ?disabled=${this.buffering}
        @click=${Gn.RouterController.goBack}
      ></wui-icon-link>`:Zn.dy`<wui-icon-link
      data-hidden=${!t}
      id="dynamic"
      icon="helpCircle"
      @click=${this.onWalletHelp.bind(this)}
    ></wui-icon-link>`}separatorTemplate(){return this.heading?Zn.dy`<wui-separator></wui-separator>`:null}getPadding(){return this.heading?["l","2l","l","2l"]:["l","2l","0","2l"]}async onViewChange(e){const t=this.shadowRoot?.querySelector("wui-text");if(t){const r=oo()[e];await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.heading=r,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"})}}async onHistoryChange(){const{history:e}=Gn.RouterController.state,t=this.shadowRoot?.querySelector("#dynamic");e.length>1&&!this.showBack&&t?(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!0,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"})):e.length<=1&&this.showBack&&t&&(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}};ao.styles=[no],io([(0,Vn.SB)()],ao.prototype,"heading",void 0),io([(0,Vn.SB)()],ao.prototype,"buffering",void 0),io([(0,Vn.SB)()],ao.prototype,"showBack",void 0),ao=io([(0,qn.customElement)("w3m-header")],ao);var so=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let co=class extends Zn.oi{constructor(){super(...arguments),this.data=[]}render(){return Zn.dy`
      <wui-flex flexDirection="column" alignItems="center" gap="l">
        ${this.data.map((e=>Zn.dy`
            <wui-flex flexDirection="column" alignItems="center" gap="xl">
              <wui-flex flexDirection="row" justifyContent="center" gap="1xs">
                ${e.images.map((e=>Zn.dy`<wui-visual name=${e}></wui-visual>`))}
              </wui-flex>
            </wui-flex>
            <wui-flex flexDirection="column" alignItems="center" gap="xxs">
              <wui-text variant="paragraph-500" color="fg-100" align="center">
                ${e.title}
              </wui-text>
              <wui-text variant="small-500" color="fg-200" align="center">${e.text}</wui-text>
            </wui-flex>
          `))}
      </wui-flex>
    `}};so([(0,Vn.Cb)({type:Array})],co.prototype,"data",void 0),co=so([(0,qn.customElement)("w3m-help-widget")],co);const lo=Zn.iv`
  wui-flex {
    background-color: var(--wui-gray-glass-005);
  }

  a {
    text-decoration: none;
    color: var(--wui-color-fg-175);
    font-weight: 600;
  }
`;let uo=class extends Zn.oi{render(){const{termsConditionsUrl:e,privacyPolicyUrl:t}=Gn.OptionsController.state;return e||t?Zn.dy`
      <wui-flex .padding=${["m","s","s","s"]} justifyContent="center">
        <wui-text color="fg-250" variant="small-500" align="center">
          By connecting your wallet, you agree to our <br />
          ${this.termsTemplate()} ${this.andTemplate()} ${this.privacyTemplate()}
        </wui-text>
      </wui-flex>
    `:null}andTemplate(){const{termsConditionsUrl:e,privacyPolicyUrl:t}=Gn.OptionsController.state;return e&&t?"and":""}termsTemplate(){const{termsConditionsUrl:e}=Gn.OptionsController.state;return e?Zn.dy`<a href=${e}>Terms of Service</a>`:null}privacyTemplate(){const{privacyPolicyUrl:e}=Gn.OptionsController.state;return e?Zn.dy`<a href=${e}>Privacy Policy</a>`:null}};uo.styles=[lo],uo=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}([(0,qn.customElement)("w3m-legal-footer")],uo);const ho=Zn.iv`
  :host {
    display: block;
    padding: 0 var(--wui-spacing-xl) var(--wui-spacing-xl);
  }
`;var po=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};let fo=class extends Zn.oi{constructor(){super(...arguments),this.wallet=void 0}render(){if(!this.wallet)return this.style.display="none",null;const{name:e,app_store:t,play_store:r,chrome_store:n,homepage:i}=this.wallet,o=Gn.j1.isMobile(),a=Gn.j1.isIos(),s=Gn.j1.isAndroid(),c=[t,r,i,n].filter(Boolean).length>1,l=qn.UiHelperUtil.getTruncateString({string:e,charsStart:12,charsEnd:0,truncate:"end"});return c&&!o?Zn.dy`
        <wui-cta-button
          label=${`Don't have ${l}?`}
          buttonLabel="Get"
          @click=${()=>Gn.RouterController.push("Downloads",{wallet:this.wallet})}
        ></wui-cta-button>
      `:!c&&i?Zn.dy`
        <wui-cta-button
          label=${`Don't have ${l}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `:t&&a?Zn.dy`
        <wui-cta-button
          label=${`Don't have ${l}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `:r&&s?Zn.dy`
        <wui-cta-button
          label=${`Don't have ${l}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `:(this.style.display="none",null)}onAppStore(){this.wallet?.app_store&&Gn.j1.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&Gn.j1.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&Gn.j1.openHref(this.wallet.homepage,"_blank")}};fo.styles=[ho],po([(0,Vn.Cb)({type:Object})],fo.prototype,"wallet",void 0),fo=po([(0,qn.customElement)("w3m-mobile-download-links")],fo);const go=Zn.iv`
  :host {
    display: block;
    position: absolute;
    opacity: 0;
    pointer-events: none;
    top: 11px;
    left: 50%;
  }
`;var wo=function(e,t,r,n){var i,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var s=e.length-1;s>=0;s--)(i=e[s])&&(a=(o<3?i(a):o>3?i(t,r,a):i(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a};const bo={success:{backgroundColor:"success-100",iconColor:"success-100",icon:"checkmark"},error:{backgroundColor:"error-100",iconColor:"error-100",icon:"close"}};let mo=class extends Zn.oi{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.open=Gn.SnackController.state.open,this.unsubscribe.push(Gn.SnackController.subscribeKey("open",(e=>{this.open=e,this.onOpen()})))}disconnectedCallback(){clearTimeout(this.timeout),this.unsubscribe.forEach((e=>e()))}render(){const{message:e,variant:t}=Gn.SnackController.state,r=bo[t];return Zn.dy`
      <wui-snackbar
        message=${e}
        backgroundColor=${r.backgroundColor}
        iconColor=${r.iconColor}
        icon=${r.icon}
      ></wui-snackbar>
    `}onOpen(){clearTimeout(this.timeout),this.open?(this.animate([{opacity:0,transform:"translateX(-50%) scale(0.85)"},{opacity:1,transform:"translateX(-50%) scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.timeout=setTimeout((()=>Gn.SnackController.hide()),2500)):this.animate([{opacity:1,transform:"translateX(-50%) scale(1)"},{opacity:0,transform:"translateX(-50%) scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"})}};mo.styles=go,wo([(0,Vn.SB)()],mo.prototype,"open",void 0),mo=wo([(0,qn.customElement)("w3m-snackbar")],mo);let yo=!1;class vo{constructor(e){this.initPromise=void 0,this.setIsConnected=e=>{Gn.AccountController.setIsConnected(e)},this.setCaipAddress=e=>{Gn.AccountController.setCaipAddress(e)},this.setBalance=(e,t)=>{Gn.AccountController.setBalance(e,t)},this.setProfileName=e=>{Gn.AccountController.setProfileName(e)},this.setProfileImage=e=>{Gn.AccountController.setProfileImage(e)},this.resetAccount=()=>{Gn.AccountController.resetAccount()},this.setCaipNetwork=e=>{Gn.NetworkController.setCaipNetwork(e)},this.getCaipNetwork=()=>Gn.NetworkController.state.caipNetwork,this.setRequestedCaipNetworks=e=>{Gn.NetworkController.setRequestedCaipNetworks(e)},this.getApprovedCaipNetworksData=()=>Gn.NetworkController.getApprovedCaipNetworksData(),this.resetNetwork=()=>{Gn.NetworkController.resetNetwork()},this.setConnectors=e=>{Gn.ConnectorController.setConnectors(e)},this.addConnector=e=>{Gn.ConnectorController.addConnector(e)},this.getConnectors=()=>Gn.ConnectorController.getConnectors(),this.resetWcConnection=()=>{Gn.ConnectionController.resetWcConnection()},this.fetchIdentity=e=>Gn.Lr.fetchIdentity(e),this.setAddressExplorerUrl=e=>{Gn.AccountController.setAddressExplorerUrl(e)},this.setSIWENonce=e=>{Gn.yD.setNonce(e)},this.setSIWESession=e=>{Gn.yD.setSession(e)},this.setSIWEStatus=e=>{Gn.yD.setStatus(e)},this.setSIWEMessage=e=>{Gn.yD.setMessage(e)},this.getSIWENonce=()=>Gn.yD.state.nonce,this.getSIWESession=()=>Gn.yD.state.session,this.getSIWEStatus=()=>Gn.yD.state.status,this.getSIWEMessage=()=>Gn.yD.state.message,this.initControllers(e),this.initOrContinue()}async open(e){await this.initOrContinue(),Gn.IN.open(e)}async close(){await this.initOrContinue(),Gn.IN.close()}getThemeMode(){return Gn.ThemeController.state.themeMode}getThemeVariables(){return Gn.ThemeController.state.themeVariables}setThemeMode(e){Gn.ThemeController.setThemeMode(e),(0,qn.setColorTheme)(Gn.ThemeController.state.themeMode)}setThemeVariables(e){Gn.ThemeController.setThemeVariables(e),(0,qn.setThemeVariables)(Gn.ThemeController.state.themeVariables)}subscribeTheme(e){return Gn.ThemeController.subscribe(e)}getState(){return{...Gn.Ie.state}}subscribeState(e){return Gn.Ie.subscribe(e)}getEvent(){return{...Gn.Xs.state}}subscribeEvents(e){return Gn.Xs.subscribe(e)}subscribeSIWEState(e){return Gn.yD.subscribe(e)}initControllers(e){Gn.NetworkController.setClient(e.networkControllerClient),Gn.NetworkController.setDefaultCaipNetwork(e.defaultChain),Gn.OptionsController.setProjectId(e.projectId),Gn.OptionsController.setIncludeWalletIds(e.includeWalletIds),Gn.OptionsController.setExcludeWalletIds(e.excludeWalletIds),Gn.OptionsController.setFeaturedWalletIds(e.featuredWalletIds),Gn.OptionsController.setTokens(e.tokens),Gn.OptionsController.setTermsConditionsUrl(e.termsConditionsUrl),Gn.OptionsController.setPrivacyPolicyUrl(e.privacyPolicyUrl),Gn.OptionsController.setCustomWallets(e.customWallets),Gn.OptionsController.setEnableAnalytics(e.enableAnalytics),Gn.OptionsController.setSdkVersion(e._sdkVersion),Gn.ConnectionController.setClient(e.connectionControllerClient),e.siweControllerClient&&Gn.yD.setSIWEClient(e.siweControllerClient),e.metadata&&Gn.OptionsController.setMetadata(e.metadata),e.themeMode&&Gn.ThemeController.setThemeMode(e.themeMode),e.themeVariables&&Gn.ThemeController.setThemeVariables(e.themeVariables)}async initOrContinue(){return this.initPromise||yo||!Gn.j1.isClient()||(yo=!0,this.initPromise=new Promise((async e=>{await Promise.all([Promise.resolve().then(a.bind(a,684)),Promise.resolve().then(a.bind(a,6541))]);const t=document.createElement("w3m-modal");document.body.insertAdjacentElement("beforeend",t),e()}))),this.initPromise}}const xo="walletConnect",Co="injected",ko="coinbaseWallet",Eo="safe",Po="ledger",$o="eip6963",So="eip155",_o="3.4.0",Ao={ConnectorExplorerIds:{[ko]:"fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",[Eo]:"225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f",[Po]:"19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927"},EIP155NetworkImageIds:{1:"692ed6ba-e569-459a-556a-776476829e00",42161:"600a9a04-c1b9-42ca-6785-9b4b6ff85200",43114:"30c46e53-e989-45fb-4549-be3bd4eb3b00",56:"93564157-2e8e-4ce7-81df-b264dbee9b00",250:"06b26297-fe0c-4733-5d6b-ffa5498aac00",10:"ab9c186a-c52f-464b-2906-ca59d760a400",137:"41d04d42-da3b-4453-8506-668cc0727900",100:"02b53f6a-e3d4-479e-1cb4-21178987d100",9001:"f926ff41-260d-4028-635e-91913fc28e00",324:"b310f07f-4ef7-49f3-7073-2a0a39685800",314:"5a73b3dd-af74-424e-cae0-0de859ee9400",4689:"34e68754-e536-40da-c153-6ef2e7188a00",1088:"3897a66d-40b9-4833-162f-a2c90531c900",1284:"161038da-44ae-4ec7-1208-0ea569454b00",1285:"f1d73bb6-5450-4e18-38f7-fb6484264a00",7777777:"845c60df-d429-4991-e687-91ae45791600",42220:"ab781bbc-ccc6-418d-d32d-789b15da1f00",8453:"7289c336-3981-4081-c5f4-efc26ac64a00",1313161554:"3ff73439-a619-4894-9262-4470c773a100"},ConnectorImageIds:{[ko]:"0c2840c3-5b04-4c44-9661-fbd4b49e1800",[Eo]:"461db637-8616-43ce-035a-d89b8a1d5800",[Po]:"54a1aa77-d202-4f8d-0fb2-5d2bb6db0300",[xo]:"ef1a1fcf-7fe8-4d69-bd6d-fda1345b4400",[Co]:"07ba87ed-43aa-4adf-4540-9e6a2b9cae00"},ConnectorNamesMap:{[Co]:"Browser Wallet",[xo]:"WalletConnect",[ko]:"Coinbase",[Po]:"Ledger",[Eo]:"Safe"},ConnectorTypesMap:{[Co]:"INJECTED",[xo]:"WALLET_CONNECT",[$o]:"ANNOUNCED"}},Io={caipNetworkIdToNumber:e=>e?Number(e.split(":")[1]):void 0,getCaipTokens(e){if(!e)return;const t={};return Object.entries(e).forEach((([e,r])=>{t[`${So}:${e}`]=r})),t}};function Oo(e){if(e)return{id:`${So}:${e.id}`,name:e.name,imageId:Ao.EIP155NetworkImageIds[e.id]}}var To,No,Ro=function(e,t,r,n,i){if("m"===n)throw new TypeError("Private method is not writable");if("a"===n&&!i)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!i:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===n?i.call(e,r):i?i.value=r:t.set(e,r),r},jo=function(e,t,r,n){if("a"===r&&!n)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!n:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===r?n:"a"===r?n.call(e):n?n.value:t.get(e)};const Bo="connectedRdns";To=new WeakMap,No=new WeakMap;var Mo=a(8764);"undefined"!=typeof window&&(window.Buffer||(window.Buffer=Mo.Buffer),window.global||(window.global=window),window.process||(window.process={}),window.process?.env||(window.process={env:{}}));const Uo=Gn.j1.getBlockchainApiUrl(),Lo="e52d8ed47789f1f007851fd6faf4850b",{chains:Do,publicClient:zo}=function(e,t,{batch:r={multicall:{wait:32}},pollingInterval:n=4e3,rank:i,retryCount:o,retryDelay:a,stallTimeout:s}={}){if(!e.length)throw new Error("must have at least one chain");let c=[];const l={},u={};for(const r of e){let e=!1;for(const n of t){const t=n(r);t&&(e=!0,c.some((({id:e})=>e===r.id))||(c=[...c,t.chain]),l[r.id]=[...l[r.id]||[],...t.rpcUrls.http],t.rpcUrls.webSocket&&(u[r.id]=[...u[r.id]||[],...t.rpcUrls.webSocket]))}if(!e)throw new Error([`Could not find valid provider configuration for chain "${r.name}".\n`,"You may need to add `jsonRpcProvider` to `configureChains` with the chain's RPC URLs.","Read more: https://wagmi.sh/core/providers/jsonRpc"].join("\n"))}return{chains:c,publicClient:({chainId:t})=>{const u=c.find((e=>e.id===t))??e[0],d=l[u.id];if(!d||!d[0])throw new Error(`No providers configured for chain "${u.id}"`);const h=en({batch:r,chain:u,transport:tn(d.map((e=>function(e,t={}){const{batch:r,fetchOptions:n,key:i="http",name:o="HTTP JSON-RPC",retryDelay:a}=t;return({chain:s,retryCount:c,timeout:l})=>{const{batchSize:u=1e3,wait:d=0}="object"==typeof r?r:{},h=t.retryCount??c,p=l??t.timeout??1e4,f=e||s?.rpcUrls.default.http[0];if(!f)throw new rn;return Fe({key:i,name:o,async request({method:t,params:i}){const o={method:t,params:i},{schedule:a}=(0,nn.S)({id:`${e}`,wait:d,shouldSplitBatch:e=>e.length>u,fn:e=>un.http(f,{body:e,fetchOptions:n,timeout:p}),sort:(e,t)=>e.id-t.id}),[{error:s,result:c}]=await(async e=>r?a(e):[await un.http(f,{body:e,fetchOptions:n,timeout:p})])(o);if(s)throw new w.bs({body:o,error:s,url:f});return c},retryCount:h,retryDelay:a,timeout:p,type:"http"},{fetchOptions:n,url:e})}}(e,{timeout:s}))),{rank:i,retryCount:o,retryDelay:a}),pollingInterval:n});return Object.assign(h,{chains:c})},webSocketPublicClient:({chainId:t})=>{const l=c.find((e=>e.id===t))??e[0],d=u[l.id];if(!d||!d[0])return;const h=en({batch:r,chain:l,transport:tn(d.map((e=>function(e,t={}){const{key:r="webSocket",name:n="WebSocket JSON-RPC",retryDelay:i}=t;return({chain:o,retryCount:a,timeout:s})=>{const c=t.retryCount??a,l=s??t.timeout??1e4,u=e||o?.rpcUrls.default.webSocket?.[0];if(!u)throw new rn;return Fe({key:r,name:n,async request({method:e,params:t}){const r={method:e,params:t},n=await ln(u),{error:i,result:o}=await un.webSocketAsync(n,{body:r,timeout:l});if(i)throw new w.bs({body:r,error:i,url:u});return o},retryCount:c,retryDelay:i,timeout:l,type:"webSocket"},{getSocket:()=>ln(u),async subscribe({params:e,onData:t,onError:r}){const n=await ln(u),{result:i}=await new Promise(((i,o)=>un.webSocket(n,{body:{method:"eth_subscribe",params:e},onResponse(e){if(e.error)return o(e.error),void r?.(e.error);"number"!=typeof e.id?"eth_subscription"===e.method&&t(e.params):i(e)}})));return{subscriptionId:i,unsubscribe:async()=>new Promise((e=>un.webSocket(n,{body:{method:"eth_unsubscribe",params:[i]},onResponse:e})))}}})}}(e,{timeout:s}))),{rank:i,retryCount:o,retryDelay:a}),pollingInterval:n});return Object.assign(h,{chains:c})}}}([o],[function({projectId:e}){return function(t){if(![1,5,11155111,10,420,42161,421613,137,80001,42220,1313161554,1313161555,56,97,43114,43113,100,8453,84531,7777777,999,324,280].includes(t.id))return null;const r=`${Uo}/v1/?chainId=${So}:${t.id}&projectId=${e}`;return{chain:{...t,rpcUrls:{...t.rpcUrls,default:{http:[r]}}},rpcUrls:{http:[r]}}}}({projectId:Lo}),function(e){return e.rpcUrls.public.http[0]?{chain:e,rpcUrls:e.rpcUrls.public}:null}]),Wo={name:"SocialPass",description:"SocialPass",url:"https://socialpass.io",icons:["https://socialpass.io/static/images/SVG-05.svg"]},Fo=function(e){const t=new class{constructor({autoConnect:e=!1,connectors:t=[new Ve],publicClient:r,storage:n=_n({storage:"undefined"!=typeof window?window.localStorage:Sn}),logger:i={warn:console.warn},webSocketPublicClient:o}){Nt(this,On),this.publicClients=new Map,this.webSocketPublicClients=new Map,Nt(this,An,void 0),Nt(this,In,void 0),this.args={autoConnect:e,connectors:t,logger:i,publicClient:r,storage:n,webSocketPublicClient:o};let a,s="disconnected";if(e)try{const e=n.getItem(Rn),t=e?.state?.data;s=t?.account?"reconnecting":"connecting",a=t?.chain?.id}catch(e){}const c="function"==typeof t?t():t;var l,u,d,h;c.forEach((e=>e.setStorage(n))),this.store=(h=((e,t)=>"getStorage"in t||"serialize"in t||"deserialize"in t?(console.warn("[DEPRECATED] `getStorage`, `serialize` and `deserialize` options are deprecated. Use `storage` option instead."),((e,t)=>(r,n,i)=>{let o={getStorage:()=>localStorage,serialize:JSON.stringify,deserialize:JSON.parse,partialize:e=>e,version:0,merge:(e,t)=>({...t,...e}),...t},a=!1;const s=new Set,c=new Set;let l;try{l=o.getStorage()}catch(e){}if(!l)return e(((...e)=>{console.warn(`[zustand persist middleware] Unable to update item '${o.name}', the given storage is currently unavailable.`),r(...e)}),n,i);const u=pn(o.serialize),d=()=>{const e=o.partialize({...n()});let t;const r=u({state:e,version:o.version}).then((e=>l.setItem(o.name,e))).catch((e=>{t=e}));if(t)throw t;return r},h=i.setState;i.setState=(e,t)=>{h(e,t),d()};const p=e(((...e)=>{r(...e),d()}),n,i);let f;const g=()=>{var e;if(!l)return;a=!1,s.forEach((e=>e(n())));const t=(null==(e=o.onRehydrateStorage)?void 0:e.call(o,n()))||void 0;return pn(l.getItem.bind(l))(o.name).then((e=>{if(e)return o.deserialize(e)})).then((e=>{if(e){if("number"!=typeof e.version||e.version===o.version)return e.state;if(o.migrate)return o.migrate(e.state,e.version);console.error("State loaded from storage couldn't be migrated since no migrate function was provided")}})).then((e=>{var t;return f=o.merge(e,null!=(t=n())?t:p),r(f,!0),d()})).then((()=>{null==t||t(f,void 0),a=!0,c.forEach((e=>e(f)))})).catch((e=>{null==t||t(void 0,e)}))};return i.persist={setOptions:e=>{o={...o,...e},e.getStorage&&(l=e.getStorage())},clearStorage:()=>{null==l||l.removeItem(o.name)},getOptions:()=>o,rehydrate:()=>g(),hasHydrated:()=>a,onHydrate:e=>(s.add(e),()=>{s.delete(e)}),onFinishHydration:e=>(c.add(e),()=>{c.delete(e)})},g(),f||p})(e,t)):((e,t)=>(r,n,i)=>{let o={storage:hn((()=>localStorage)),partialize:e=>e,version:0,merge:(e,t)=>({...t,...e}),...t},a=!1;const s=new Set,c=new Set;let l=o.storage;if(!l)return e(((...e)=>{console.warn(`[zustand persist middleware] Unable to update item '${o.name}', the given storage is currently unavailable.`),r(...e)}),n,i);const u=()=>{const e=o.partialize({...n()});return l.setItem(o.name,{state:e,version:o.version})},d=i.setState;i.setState=(e,t)=>{d(e,t),u()};const h=e(((...e)=>{r(...e),u()}),n,i);let p;const f=()=>{var e,t;if(!l)return;a=!1,s.forEach((e=>{var t;return e(null!=(t=n())?t:h)}));const i=(null==(t=o.onRehydrateStorage)?void 0:t.call(o,null!=(e=n())?e:h))||void 0;return pn(l.getItem.bind(l))(o.name).then((e=>{if(e){if("number"!=typeof e.version||e.version===o.version)return e.state;if(o.migrate)return o.migrate(e.state,e.version);console.error("State loaded from storage couldn't be migrated since no migrate function was provided")}})).then((e=>{var t;return p=o.merge(e,null!=(t=n())?t:h),r(p,!0),u()})).then((()=>{null==i||i(p,void 0),p=n(),a=!0,c.forEach((e=>e(p)))})).catch((e=>{null==i||i(void 0,e)}))};return i.persist={setOptions:e=>{o={...o,...e},e.storage&&(l=e.storage)},clearStorage:()=>{null==l||l.removeItem(o.name)},getOptions:()=>o,rehydrate:()=>f(),hasHydrated:()=>a,onHydrate:e=>(s.add(e),()=>{s.delete(e)}),onFinishHydration:e=>(c.add(e),()=>{c.delete(e)})},o.skipHydration||f(),p||h})(e,t))((()=>({connectors:c,publicClient:this.getPublicClient({chainId:a}),status:s,webSocketPublicClient:this.getWebSocketPublicClient({chainId:a})})),{name:Rn,storage:n,partialize:t=>({...e&&{data:{account:t?.data?.account,chain:t?.data?.chain}},chains:t?.chains}),version:2}),d=(e,t,r)=>{const n=r.subscribe;return r.subscribe=(e,t,i)=>{let o=e;if(t){const n=(null==i?void 0:i.equalityFn)||Object.is;let a=e(r.getState());o=r=>{const i=e(r);if(!n(a,i)){const e=a;t(a=i,e)}},(null==i?void 0:i.fireImmediately)&&t(a,a)}return n(o)},h(e,t,r)},d?fn(d):fn),this.storage=n,Rt(this,In,n?.getItem("wallet")),(this,l=On,u=Tn,Ot(this,l,"access private method"),u).call(this),e&&"undefined"!=typeof window&&setTimeout((async()=>await this.autoConnect()),0)}get chains(){return this.store.getState().chains}get connectors(){return this.store.getState().connectors}get connector(){return this.store.getState().connector}get data(){return this.store.getState().data}get error(){return this.store.getState().error}get lastUsedChainId(){return this.data?.chain?.id}get publicClient(){return this.store.getState().publicClient}get status(){return this.store.getState().status}get subscribe(){return this.store.subscribe}get webSocketPublicClient(){return this.store.getState().webSocketPublicClient}setState(e){const t="function"==typeof e?e(this.store.getState()):e;this.store.setState(t,!0)}clearState(){this.setState((e=>({...e,chains:void 0,connector:void 0,data:void 0,error:void 0,status:"disconnected"})))}async destroy(){this.connector&&await(this.connector.disconnect?.()),Rt(this,An,!1),this.clearState(),this.store.destroy()}async autoConnect(){if(Tt(this,An))return;Rt(this,An,!0),this.setState((e=>({...e,status:e.data?.account?"reconnecting":"connecting"})));const e=Tt(this,In)?[...this.connectors].sort((e=>e.id===Tt(this,In)?-1:1)):this.connectors;let t=!1;for(const r of e){if(!r.ready||!r.isAuthorized)continue;if(!await r.isAuthorized())continue;const e=await r.connect();this.setState((t=>({...t,connector:r,chains:r?.chains,data:e,status:"connected"}))),t=!0;break}return t||this.setState((e=>({...e,data:void 0,status:"disconnected"}))),Rt(this,An,!1),this.data}setConnectors(e){this.args={...this.args,connectors:e};const t="function"==typeof e?e():e;t.forEach((e=>e.setStorage(this.args.storage))),this.setState((e=>({...e,connectors:t})))}getPublicClient({chainId:e}={}){let t=this.publicClients.get(-1);if(t&&t?.chain.id===e)return t;if(t=this.publicClients.get(e??-1),t)return t;const{publicClient:r}=this.args;return t="function"==typeof r?r({chainId:e}):r,this.publicClients.set(e??-1,t),t}setPublicClient(e){const t=this.data?.chain?.id;this.args={...this.args,publicClient:e},this.publicClients.clear(),this.setState((e=>({...e,publicClient:this.getPublicClient({chainId:t})})))}getWebSocketPublicClient({chainId:e}={}){let t=this.webSocketPublicClients.get(-1);if(t&&t?.chain.id===e)return t;if(t=this.webSocketPublicClients.get(e??-1),t)return t;const{webSocketPublicClient:r}=this.args;return t="function"==typeof r?r({chainId:e}):r,t&&this.webSocketPublicClients.set(e??-1,t),t}setWebSocketPublicClient(e){const t=this.data?.chain?.id;this.args={...this.args,webSocketPublicClient:e},this.webSocketPublicClients.clear(),this.setState((e=>({...e,webSocketPublicClient:this.getWebSocketPublicClient({chainId:t})})))}setLastUsedConnector(e=null){this.storage?.setItem("wallet",e)}}(e);return Nn=t,t}({autoConnect:!0,connectors:[new class extends p{constructor(e){super({...e,options:{isNewChainsStale:!0,...e.options}}),u(this,ut),u(this,ht),u(this,ft),u(this,wt),u(this,mt),u(this,vt),u(this,Ct),u(this,Et),u(this,$t),this.id="walletConnect",this.name="WalletConnect",this.ready=!0,u(this,ct,void 0),u(this,lt,void 0),this.onAccountsChanged=e=>{0===e.length?this.emit("disconnect"):this.emit("change",{account:(0,f.K)(e[0])})},this.onChainChanged=e=>{const t=Number(e),r=this.isChainUnsupported(t);this.emit("change",{chain:{id:t,unsupported:r}})},this.onDisconnect=()=>{h(this,vt,xt).call(this,[]),this.emit("disconnect")},this.onDisplayUri=e=>{this.emit("message",{type:"display_uri",data:e})},this.onConnect=()=>{this.emit("connect",{})},h(this,ut,dt).call(this)}async connect({chainId:e,pairingTopic:t}={}){try{let r=e;if(!r){const e=this.storage?.getItem("store"),t=e?.state?.data?.chain?.id;r=t&&!this.isChainUnsupported(t)?t:this.chains[0]?.id}if(!r)throw new Error("No chains found on connector.");const n=await this.getProvider();h(this,wt,bt).call(this);const i=h(this,ft,gt).call(this);if(n.session&&i&&await n.disconnect(),!n.session||i){const e=this.chains.filter((e=>e.id!==r)).map((e=>e.id));this.emit("message",{type:"connecting"}),await n.connect({pairingTopic:t,optionalChains:[r,...e]}),h(this,vt,xt).call(this,this.chains.map((({id:e})=>e)))}const o=await n.enable(),a=(0,f.K)(o[0]),s=await this.getChainId();return{account:a,chain:{id:s,unsupported:this.isChainUnsupported(s)}}}catch(e){if(/user rejected/i.test(e?.message))throw new O(e);throw e}}async disconnect(){const e=await this.getProvider();try{await e.disconnect()}catch(e){if(!/No matching key/i.test(e.message))throw e}finally{h(this,mt,yt).call(this),h(this,vt,xt).call(this,[])}}async getAccount(){const{accounts:e}=await this.getProvider();return(0,f.K)(e[0])}async getChainId(){const{chainId:e}=await this.getProvider();return e}async getProvider({chainId:e}={}){return l(this,ct)||await h(this,ut,dt).call(this),e&&await this.switchChain(e),l(this,ct)}async getWalletClient({chainId:e}={}){const[t,r]=await Promise.all([this.getProvider({chainId:e}),this.getAccount()]),n=this.chains.find((t=>t.id===e));if(!t)throw new Error("provider is required.");return Ue({account:r,chain:n,transport:He(t)})}async isAuthorized(){try{const[e,t]=await Promise.all([this.getAccount(),this.getProvider()]),r=h(this,ft,gt).call(this);if(!e)return!1;if(r&&t.session){try{await t.disconnect()}catch{}return!1}return!0}catch{return!1}}async switchChain(e){const t=this.chains.find((t=>t.id===e));if(!t)throw new B(new Error("chain not found on connector."));try{const r=await this.getProvider(),n=h(this,Et,Pt).call(this),i=h(this,$t,St).call(this);if(!n.includes(e)&&i.includes(It)){await r.request({method:It,params:[{chainId:(0,q.eC)(t.id),blockExplorerUrls:[t.blockExplorers?.default?.url],chainName:t.name,nativeCurrency:t.nativeCurrency,rpcUrls:[...t.rpcUrls.default.http]}]});const n=h(this,Ct,kt).call(this);n.push(e),h(this,vt,xt).call(this,n)}return await r.request({method:"wallet_switchEthereumChain",params:[{chainId:(0,q.eC)(e)}]}),t}catch(e){if(/user rejected request/i.test("string"==typeof e?e:e?.message))throw new O(e);throw new B(e)}}}({chains:Do,options:{projectId:Lo,showQrModal:!1,metadata:Wo}}),new class extends Ve{constructor(e){super({chains:e.chains,options:{shimDisconnect:!0}}),this.id="eip6963",this.name="EIP6963",To.set(this,void 0),No.set(this,void 0),Ro(this,To,this.options.getProvider(),"f")}async connect(e){const t=await super.connect(e);return jo(this,No,"f")&&this.storage?.setItem(Bo,jo(this,No,"f").info.rdns),t}async disconnect(){await super.disconnect(),this.storage?.removeItem(Bo),Ro(this,No,void 0,"f")}async isAuthorized(e){const t=this.storage?.getItem(Bo);if(t){if(!e||t!==e.info.rdns)return!0;Ro(this,No,e,"f")}return super.isAuthorized()}async getProvider(){return Promise.resolve(jo(this,No,"f")?.provider??jo(this,To,"f"))}setEip6963Wallet(e){Ro(this,No,e,"f")}}({chains:Do}),new Ve({chains:Do,options:{shimDisconnect:!0}}),new class extends p{constructor({chains:e,options:t}){super({chains:e,options:{reloadOnDisconnect:!1,...t}}),this.id="coinbaseWallet",this.name="Coinbase Wallet",this.ready=!0,u(this,qe,void 0),u(this,Ze,void 0),this.onAccountsChanged=e=>{0===e.length?this.emit("disconnect"):this.emit("change",{account:(0,f.K)(e[0])})},this.onChainChanged=e=>{const t=r(e),n=this.isChainUnsupported(t);this.emit("change",{chain:{id:t,unsupported:n}})},this.onDisconnect=()=>{this.emit("disconnect")}}async connect({chainId:e}={}){try{const t=await this.getProvider();t.on("accountsChanged",this.onAccountsChanged),t.on("chainChanged",this.onChainChanged),t.on("disconnect",this.onDisconnect),this.emit("message",{type:"connecting"});const r=await t.enable(),n=(0,f.K)(r[0]);let i=await this.getChainId(),o=this.isChainUnsupported(i);return e&&i!==e&&(i=(await this.switchChain(e)).id,o=this.isChainUnsupported(i)),{account:n,chain:{id:i,unsupported:o}}}catch(e){if(/(user closed modal|accounts received is empty)/i.test(e.message))throw new O(e);throw e}}async disconnect(){if(!l(this,Ze))return;const e=await this.getProvider();e.removeListener("accountsChanged",this.onAccountsChanged),e.removeListener("chainChanged",this.onChainChanged),e.removeListener("disconnect",this.onDisconnect),e.disconnect(),e.close()}async getAccount(){const e=await this.getProvider(),t=await e.request({method:"eth_accounts"});return(0,f.K)(t[0])}async getChainId(){return r((await this.getProvider()).chainId)}async getProvider(){if(!l(this,Ze)){let e=(await Promise.all([a.e(811),a.e(439)]).then(a.t.bind(a,5811,19))).default;"function"!=typeof e&&"function"==typeof e.default&&(e=e.default),d(this,qe,new e(this.options));const t=l(this,qe).walletExtension?.getChainId(),r=this.chains.find((e=>this.options.chainId?e.id===this.options.chainId:e.id===t))||this.chains[0],n=this.options.chainId||r?.id,i=this.options.jsonRpcUrl||r?.rpcUrls.default.http[0];d(this,Ze,l(this,qe).makeWeb3Provider(i,n))}return l(this,Ze)}async getWalletClient({chainId:e}={}){const[t,r]=await Promise.all([this.getProvider(),this.getAccount()]),n=this.chains.find((t=>t.id===e));if(!t)throw new Error("provider is required.");return Ue({account:r,chain:n,transport:He(t)})}async isAuthorized(){try{return!!await this.getAccount()}catch{return!1}}async switchChain(t){const r=await this.getProvider(),n=(0,q.eC)(t);try{return await r.request({method:"wallet_switchEthereumChain",params:[{chainId:n}]}),this.chains.find((e=>e.id===t))??{id:t,name:`Chain ${n}`,network:`${n}`,nativeCurrency:{name:"Ether",decimals:18,symbol:"ETH"},rpcUrls:{default:{http:[""]},public:{http:[""]}}}}catch(i){const o=this.chains.find((e=>e.id===t));if(!o)throw new e({chainId:t,connectorId:this.id});if(4902===i.code)try{return await r.request({method:"wallet_addEthereumChain",params:[{chainId:n,chainName:o.name,nativeCurrency:o.nativeCurrency,rpcUrls:[o.rpcUrls.public?.http[0]??""],blockExplorerUrls:this.getBlockExplorerUrls(o)}]}),o}catch(e){throw new O(e)}throw new B(i)}}async watchAsset({address:e,decimals:t=18,image:r,symbol:n}){return(await this.getProvider()).request({method:"wallet_watchAsset",params:{type:"ERC20",options:{address:e,decimals:t,image:r,symbol:n}}})}}({chains:Do,options:{appName:Wo.name}})],publicClient:zo});var Ho;Ho={wagmiConfig:Fo,projectId:Lo,chains:Do,themeMode:document.documentElement.getAttribute("data-bs-theme"),themeVariables:{"--w3m-font-family":"var(--bs-body-font-family)","--w3m-accent":"var(--bs-primary)"}},new class extends vo{constructor(e){const{wagmiConfig:r,siweConfig:n,chains:i,defaultChain:o,tokens:a,_sdkVersion:s,...c}=e;if(!r)throw new Error("web3modal:constructor - wagmiConfig is undefined");if(!c.projectId)throw new Error("web3modal:constructor - projectId is undefined");if(!r.connectors.find((e=>e.id===xo)))throw new Error("web3modal:constructor - WalletConnectConnector is required");const l={connectWalletConnect:async e=>{const t=r.connectors.find((e=>e.id===xo));if(!t)throw new Error("connectionControllerClient:getWalletConnectUri - connector is undefined");t.on("message",(r=>{"display_uri"===r.type&&(e(r.data),t.removeAllListeners())}));const n=Io.caipNetworkIdToNumber(this.getCaipNetwork()?.id);await Bn({connector:t,chainId:n})},connectExternal:async({id:e,provider:t,info:n})=>{const i=r.connectors.find((t=>t.id===e));if(!i)throw new Error("connectionControllerClient:connectExternal - connector is undefined");t&&n&&i.id===$o&&i.setEip6963Wallet?.({provider:t,info:n});const o=Io.caipNetworkIdToNumber(this.getCaipNetwork()?.id);await Bn({connector:i,chainId:o})},checkInstalled:e=>{const t=this.getConnectors().filter((e=>"ANNOUNCED"===e.type)),r=this.getConnectors().find((e=>"INJECTED"===e.type));if(!e)return Boolean(window.ethereum);if(t.length){const r=e.some((e=>t.some((t=>t.info?.rdns===e))));if(r)return!0}return!!r&&!!window?.ethereum&&e.some((e=>Boolean(window.ethereum?.[String(e)])))},disconnect:Mn};super({networkControllerClient:{switchCaipNetwork:async e=>{const r=Io.caipNetworkIdToNumber(e?.id);r&&await async function({chainId:e}){const{connector:r}=jn();if(!r)throw new t;if(!r.switchChain)throw new vn({connector:r});return r.switchChain(e)}({chainId:r})},async getApprovedCaipNetworksData(){const e=localStorage.getItem("wagmi.wallet");if(e?.includes(xo)){const e=r.connectors.find((e=>e.id===xo));if(!e)throw new Error("networkControllerClient:getApprovedCaipNetworks - connector is undefined");const t=await e.getProvider(),n=t.signer?.session?.namespaces,i=n?.[So]?.methods,o=n?.[So]?.chains;return{supportsAllNetworks:i?.includes("wallet_addEthereumChain"),approvedCaipNetworkIds:o}}return{approvedCaipNetworkIds:void 0,supportsAllNetworks:!0}}},connectionControllerClient:l,siweControllerClient:n,defaultChain:Oo(o),tokens:Io.getCaipTokens(a),_sdkVersion:s??`html-wagmi-${_o}`,...c}),this.hasSyncedConnectedAccount=!1,this.options=void 0,this.options=e,this.syncRequestedNetworks(i),this.syncConnectors(r),this.listenConnectors(r),Hn((()=>this.syncAccount())),function(e,{selector:t=(e=>e)}={}){jn().subscribe((({data:e,chains:r})=>t({chainId:e?.chain?.id,chains:r})),(()=>e(Fn())),{equalityFn:wn})}((()=>this.syncNetwork()))}getState(){const e=super.getState();return{...e,selectedNetworkId:Io.caipNetworkIdToNumber(e.selectedNetworkId)}}subscribeState(e){return super.subscribeState((t=>e({...t,selectedNetworkId:Io.caipNetworkIdToNumber(t.selectedNetworkId)})))}syncRequestedNetworks(e){const t=e?.map((e=>({id:`${So}:${e.id}`,name:e.name,imageId:Ao.EIP155NetworkImageIds[e.id],imageUrl:this.options?.chainImages?.[e.id]})));this.setRequestedCaipNetworks(t??[])}async syncAccount(){const{address:e,isConnected:t}=Wn(),{chain:r}=Fn();if(this.resetAccount(),t&&e&&r){const n=`${So}:${r.id}:${e}`;this.setIsConnected(t),this.setCaipAddress(n),await Promise.all([this.syncProfile(e),this.syncBalance(e,r),this.getApprovedCaipNetworksData()]),this.hasSyncedConnectedAccount=!0}else!t&&this.hasSyncedConnectedAccount&&(this.resetWcConnection(),this.resetNetwork())}async syncNetwork(){const{address:e,isConnected:t}=Wn(),{chain:r}=Fn();if(r){const n=String(r.id),i=`${So}:${n}`;if(this.setCaipNetwork({id:i,name:r.name,imageId:Ao.EIP155NetworkImageIds[r.id],imageUrl:this.options?.chainImages?.[r.id]}),t&&e){const t=`${So}:${r.id}:${e}`;if(this.setCaipAddress(t),r.blockExplorers?.default?.url){const t=`${r.blockExplorers.default.url}/address/${e}`;this.setAddressExplorerUrl(t)}else this.setAddressExplorerUrl(void 0);this.hasSyncedConnectedAccount&&await this.syncBalance(e,r)}}}async syncProfile(e){try{const{name:t,avatar:r}=await this.fetchIdentity({caipChainId:`${So}:${o.id}`,address:e});this.setProfileName(t),this.setProfileImage(r)}catch{const t=await async function({address:e,chainId:t}){return Dn({chainId:t}).getEnsName({address:(0,f.K)(e)})}({address:e,chainId:o.id});if(t){this.setProfileName(t);const e=await async function({name:e,chainId:t}){const{normalize:r}=await a.e(849).then(a.bind(a,4849)),n=Dn({chainId:t});return await n.getEnsAvatar({name:r(e)})}({name:t,chainId:o.id});e&&this.setProfileImage(e)}}}async syncBalance(e,t){const r=await async function({address:e,chainId:t,formatUnits:r,token:n}){const i=jn(),o=Dn({chainId:t});if(n){const i=async({abi:i})=>{const o={abi:i,address:n,chainId:t},[a,s,c]=await zn({allowFailure:!1,contracts:[{...o,functionName:"balanceOf",args:[e]},{...o,functionName:"decimals"},{...o,functionName:"symbol"}]});return{decimals:s,formatted:(0,gn.b)(a??"0",kn(r??s)),symbol:c,value:a}};try{return await i({abi:Un})}catch(e){if(e instanceof Dt.uq){const{symbol:e,...t}=await i({abi:Ln});return{symbol:(0,H.rR)((0,Ut.f)(e,{dir:"right"})),...t}}throw e}}const a=[...i.publicClient.chains||[],...i.chains??[]],s=await o.getBalance({address:e}),c=a.find((e=>e.id===o.chain.id));return{decimals:c?.nativeCurrency.decimals??18,formatted:(0,gn.b)(s??"0",kn(r??18)),symbol:c?.nativeCurrency.symbol??"ETH",value:s}}({address:e,chainId:t.id,token:this.options?.tokens?.[t.id]?.address});this.setBalance(r.formatted,r.symbol)}syncConnectors(e){const t=[];e.connectors.forEach((({id:e,name:r})=>{e!==$o&&t.push({id:e,explorerId:Ao.ConnectorExplorerIds[e],imageId:Ao.ConnectorImageIds[e],imageUrl:this.options?.connectorImages?.[e],name:Ao.ConnectorNamesMap[e]??r,type:Ao.ConnectorTypesMap[e]??"EXTERNAL"})})),this.setConnectors(t)}eip6963EventHandler(e,t){if(t.detail){const{info:r,provider:n}=t.detail;this.getConnectors().find((e=>e.name===r.name))||(this.addConnector({id:$o,type:"ANNOUNCED",imageUrl:r.icon??this.options?.connectorImages?.[$o],name:r.name,provider:n,info:r}),e.isAuthorized({info:r,provider:n}))}}listenConnectors(e){const t=e.connectors.find((e=>e.id===$o));if("undefined"!=typeof window&&t){const e=this.eip6963EventHandler.bind(this,t);window.addEventListener("eip6963:announceProvider",e),window.dispatchEvent(new Event("eip6963:requestProvider"))}}}({...Ho,_sdkVersion:`html-wagmi-${_o}`}),window.signWallet=async function(e,r){if(r.preventDefault(),document.getElementById("wallet-address-error-message").classList.add("d-none"),document.getElementById("wallet-signature-error-message").classList.add("d-none"),""!==document.getElementById("id_wallet_address").value){try{const r=await async function(e){const r=await async function({chainId:e}={}){const t=jn();return await(t.connector?.getWalletClient?.({chainId:e}))||null}();if(!r)throw new t;return await r.signMessage({message:e.message})}({message:e});document.getElementById("id_signed_message").value=r}catch(e){document.getElementById("id_signed_message").value=""}""===document.getElementById("id_signed_message").value?(document.getElementById("checkout-submit-btn").removeAttribute("disabled"),document.getElementById("checkout-submit-btn").innerHTML='<strong class="antialiased">Get Tickets</strong>',document.getElementById("wallet-signature-error-message").classList.remove("d-none")):(document.getElementById("checkout-submit-btn").setAttribute("disabled","disabled"),document.getElementById("checkout-submit-btn").innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...',document.getElementById("asset_ownership_form").submit())}else document.getElementById("wallet-address-error-message").classList.remove("d-none")},Hn((e=>{e.address&&(document.getElementById("id_wallet_address").value=e.address),e.address||(document.getElementById("id_wallet_address").value="")}))})()})();