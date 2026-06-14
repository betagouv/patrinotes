//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
/* @__NO_SIDE_EFFECTS__ */
function e(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var t = process.env.NODE_ENV === "production" ? {} : Object.freeze({}), n = process.env.NODE_ENV === "production" ? [] : Object.freeze([]), r = () => {}, i = () => !1, a = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), o = (e) => e.startsWith("onUpdate:"), s = Object.assign, c = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), S = (e) => x(e).slice(8, -1), C = (e) => x(e) === "[object Object]", w = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, T = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), E = /* @__PURE__ */ e("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"), D = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, ee = /-\w/g, O = D((e) => e.replace(ee, (e) => e.slice(1).toUpperCase())), te = /\B([A-Z])/g, ne = D((e) => e.replace(te, "-$1").toLowerCase()), re = D((e) => e.charAt(0).toUpperCase() + e.slice(1)), ie = D((e) => e ? `on${re(e)}` : ""), ae = (e, t) => !Object.is(e, t), oe = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, se = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, ce = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, le = (e) => {
	let t = g(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, ue, de = () => ue ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function k(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? he(r) : k(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	} else if (g(e) || v(e)) return e;
}
var fe = /;(?![^(]*\))/g, pe = /:([^]+)/, me = /\/\*[^]*?\*\//g;
function he(e) {
	let t = {};
	return e.replace(me, "").split(fe).forEach((e) => {
		if (e) {
			let n = e.split(pe);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function A(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = A(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var ge = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot", _e = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view", ve = "annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics", ye = /* @__PURE__ */ e(ge), be = /* @__PURE__ */ e(_e), xe = /* @__PURE__ */ e(ve), Se = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", Ce = /* @__PURE__ */ e(Se);
Se + "";
function we(e) {
	return !!e || e === "";
}
function Te(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = Ee(e[r], t[r]);
	return n;
}
function Ee(e, t) {
	if (e === t) return !0;
	let n = m(e), r = m(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = _(e), r = _(t), n || r) return e === t;
	if (n = d(e), r = d(t), n || r) return n && r ? Te(e, t) : !1;
	if (n = v(e), r = v(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !Ee(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
function De(e, t) {
	return e.findIndex((e) => Ee(e, t));
}
var Oe = (e) => !!(e && e.__v_isRef === !0), j = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? Oe(e) ? j(e.value) : JSON.stringify(e, ke, 2) : String(e), ke = (e, t) => Oe(t) ? ke(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Ae(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Ae(e)) } : _(t) ? Ae(t) : v(t) && !d(t) && !C(t) ? String(t) : t, Ae = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e;
//#endregion
//#region node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
function je(e, ...t) {
	console.warn(`[Vue warn] ${e}`, ...t);
}
var Me, Ne = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && Me && (Me.active ? (this.parent = Me, this.index = (Me.scopes ||= []).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = !0;
			let e, t;
			if (this.scopes) for (e = 0, t = this.scopes.length; e < t; e++) this.scopes[e].pause();
			for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].pause();
		}
	}
	resume() {
		if (this._active && this._isPaused) {
			this._isPaused = !1;
			let e, t;
			if (this.scopes) for (e = 0, t = this.scopes.length; e < t; e++) this.scopes[e].resume();
			for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].resume();
		}
	}
	run(e) {
		if (this._active) {
			let t = Me;
			try {
				return Me = this, e();
			} finally {
				Me = t;
			}
		} else process.env.NODE_ENV !== "production" && this._warnOnRun && je("cannot run an inactive effect scope.");
	}
	on() {
		++this._on === 1 && (this.prevScope = Me, Me = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (Me === this) Me = this.prevScope;
			else {
				let e = Me;
				for (; e;) {
					if (e.prevScope === this) {
						e.prevScope = this.prevScope;
						break;
					}
					e = e.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(e) {
		if (this._active) {
			this._active = !1;
			let t, n;
			for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].stop();
			for (this.effects.length = 0, t = 0, n = this.cleanups.length; t < n; t++) this.cleanups[t]();
			if (this.cleanups.length = 0, this.scopes) {
				for (t = 0, n = this.scopes.length; t < n; t++) this.scopes[t].stop(!0);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !e) {
				let e = this.parent.scopes.pop();
				e && e !== this && (this.parent.scopes[this.index] = e, e.index = this.index);
			}
			this.parent = void 0;
		}
	}
};
function Pe() {
	return Me;
}
var M, Fe = /* @__PURE__ */ new WeakSet(), Ie = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Me && (Me.active ? Me.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Fe.has(this) && (Fe.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Be(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, $e(this), Ue(this);
		let e = M, t = Ye;
		M = this, Ye = !0;
		try {
			return this.fn();
		} finally {
			process.env.NODE_ENV !== "production" && M !== this && je("Active effect was not restored correctly - this is likely a Vue internal bug."), We(this), M = e, Ye = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) qe(e);
			this.deps = this.depsTail = void 0, $e(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Fe.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Ge(this) && this.run();
	}
	get dirty() {
		return Ge(this);
	}
}, Le = 0, Re, ze;
function Be(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = ze, ze = e;
		return;
	}
	e.next = Re, Re = e;
}
function Ve() {
	Le++;
}
function He() {
	if (--Le > 0) return;
	if (ze) {
		let e = ze;
		for (ze = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Re;) {
		let t = Re;
		for (Re = void 0; t;) {
			let n = t.next;
			if (t.next = void 0, t.flags &= -9, t.flags & 1) try {
				t.trigger();
			} catch (t) {
				e ||= t;
			}
			t = n;
		}
	}
	if (e) throw e;
}
function Ue(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function We(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), qe(r), Je(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Ge(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Ke(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Ke(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === et) || (e.globalVersion = et, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Ge(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = M, r = Ye;
	M = e, Ye = !0;
	try {
		Ue(e);
		let n = e.fn(e._value);
		(t.version === 0 || ae(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		M = n, Ye = r, We(e), e.flags &= -3;
	}
}
function qe(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), process.env.NODE_ENV !== "production" && n.subsHead === e && (n.subsHead = i), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) qe(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Je(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Ye = !0, Xe = [];
function Ze() {
	Xe.push(Ye), Ye = !1;
}
function Qe() {
	let e = Xe.pop();
	Ye = e === void 0 ? !0 : e;
}
function $e(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = M;
		M = void 0;
		try {
			t();
		} finally {
			M = e;
		}
	}
}
var et = 0, tt = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, nt = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, process.env.NODE_ENV !== "production" && (this.subsHead = void 0);
	}
	track(e) {
		if (!M || !Ye || M === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== M) t = this.activeLink = new tt(M, this), M.deps ? (t.prevDep = M.depsTail, M.depsTail.nextDep = t, M.depsTail = t) : M.deps = M.depsTail = t, rt(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = M.depsTail, t.nextDep = void 0, M.depsTail.nextDep = t, M.depsTail = t, M.deps === t && (M.deps = e);
		}
		return process.env.NODE_ENV !== "production" && M.onTrack && M.onTrack(s({ effect: M }, e)), t;
	}
	trigger(e) {
		this.version++, et++, this.notify(e);
	}
	notify(e) {
		Ve();
		try {
			if (process.env.NODE_ENV !== "production") for (let t = this.subsHead; t; t = t.nextSub) t.sub.onTrigger && !(t.sub.flags & 8) && t.sub.onTrigger(s({ effect: t.sub }, e));
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			He();
		}
	}
};
function rt(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) rt(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), process.env.NODE_ENV !== "production" && e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
	}
}
var it = /* @__PURE__ */ new WeakMap(), at = /* @__PURE__ */ Symbol(process.env.NODE_ENV === "production" ? "" : "Object iterate"), ot = /* @__PURE__ */ Symbol(process.env.NODE_ENV === "production" ? "" : "Map keys iterate"), st = /* @__PURE__ */ Symbol(process.env.NODE_ENV === "production" ? "" : "Array iterate");
function ct(e, t, n) {
	if (Ye && M) {
		let r = it.get(e);
		r || it.set(e, r = /* @__PURE__ */ new Map());
		let i = r.get(n);
		i || (r.set(n, i = new nt()), i.map = r, i.key = n), process.env.NODE_ENV === "production" ? i.track() : i.track({
			target: e,
			type: t,
			key: n
		});
	}
}
function lt(e, t, n, r, i, a) {
	let o = it.get(e);
	if (!o) {
		et++;
		return;
	}
	let s = (o) => {
		o && (process.env.NODE_ENV === "production" ? o.trigger() : o.trigger({
			target: e,
			type: t,
			key: n,
			newValue: r,
			oldValue: i,
			oldTarget: a
		}));
	};
	if (Ve(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && w(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === st || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(st)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(at)), f(e) && s(o.get(ot)));
				break;
			case "delete":
				i || (s(o.get(at)), f(e) && s(o.get(ot)));
				break;
			case "set":
				f(e) && s(o.get(at));
				break;
		}
	}
	He();
}
function ut(e) {
	let t = /* @__PURE__ */ N(e);
	return t === e ? t : (ct(t, "iterate", st), /* @__PURE__ */ $t(e) ? t : t.map(nn));
}
function dt(e) {
	return ct(e = /* @__PURE__ */ N(e), "iterate", st), e;
}
function ft(e, t) {
	return /* @__PURE__ */ Qt(e) ? rn(/* @__PURE__ */ Zt(e) ? nn(t) : t) : nn(t);
}
var pt = {
	__proto__: null,
	[Symbol.iterator]() {
		return mt(this, Symbol.iterator, (e) => ft(this, e));
	},
	concat(...e) {
		return ut(this).concat(...e.map((e) => d(e) ? ut(e) : e));
	},
	entries() {
		return mt(this, "entries", (e) => (e[1] = ft(this, e[1]), e));
	},
	every(e, t) {
		return gt(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return gt(this, "filter", e, t, (e) => e.map((e) => ft(this, e)), arguments);
	},
	find(e, t) {
		return gt(this, "find", e, t, (e) => ft(this, e), arguments);
	},
	findIndex(e, t) {
		return gt(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return gt(this, "findLast", e, t, (e) => ft(this, e), arguments);
	},
	findLastIndex(e, t) {
		return gt(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return gt(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return vt(this, "includes", e);
	},
	indexOf(...e) {
		return vt(this, "indexOf", e);
	},
	join(e) {
		return ut(this).join(e);
	},
	lastIndexOf(...e) {
		return vt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return gt(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return yt(this, "pop");
	},
	push(...e) {
		return yt(this, "push", e);
	},
	reduce(e, ...t) {
		return _t(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return _t(this, "reduceRight", e, t);
	},
	shift() {
		return yt(this, "shift");
	},
	some(e, t) {
		return gt(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return yt(this, "splice", e);
	},
	toReversed() {
		return ut(this).toReversed();
	},
	toSorted(e) {
		return ut(this).toSorted(e);
	},
	toSpliced(...e) {
		return ut(this).toSpliced(...e);
	},
	unshift(...e) {
		return yt(this, "unshift", e);
	},
	values() {
		return mt(this, "values", (e) => ft(this, e));
	}
};
function mt(e, t, n) {
	let r = dt(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ $t(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var ht = Array.prototype;
function gt(e, t, n, r, i, a) {
	let o = dt(e), s = o !== e && !/* @__PURE__ */ $t(e), c = o[t];
	if (c !== ht[t]) {
		let t = c.apply(e, a);
		return s ? nn(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, ft(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function _t(e, t, n, r) {
	let i = dt(e), a = i !== e && !/* @__PURE__ */ $t(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = ft(e, t)), n.call(this, t, ft(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? ft(e, c) : c;
}
function vt(e, t, n) {
	let r = /* @__PURE__ */ N(e);
	ct(r, "iterate", st);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ en(n[0]) ? (n[0] = /* @__PURE__ */ N(n[0]), r[t](...n)) : i;
}
function yt(e, t, n = []) {
	Ze(), Ve();
	let r = (/* @__PURE__ */ N(e))[t].apply(e, n);
	return He(), Qe(), r;
}
var bt = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), xt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function St(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ N(this);
	return ct(t, "has", e), t.hasOwnProperty(e);
}
var Ct = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Wt : Ut : i ? Ht : Vt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = pt[t])) return e;
			if (t === "hasOwnProperty") return St;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ an(e) ? e : n);
		if ((_(t) ? xt.has(t) : bt(t)) || (r || ct(e, "get", t), i)) return o;
		if (/* @__PURE__ */ an(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Jt(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Jt(o) : /* @__PURE__ */ Kt(o) : o;
	}
}, wt = class extends Ct {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let r = /* @__PURE__ */ Qt(i);
			if (!/* @__PURE__ */ $t(n) && !/* @__PURE__ */ Qt(n) && (i = /* @__PURE__ */ N(i), n = /* @__PURE__ */ N(n)), !a && /* @__PURE__ */ an(i) && !/* @__PURE__ */ an(n)) return r ? (process.env.NODE_ENV !== "production" && je(`Set operation on key "${String(t)}" failed: target is readonly.`, e[t]), !0) : (i.value = n, !0);
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ an(e) ? e : r);
		return e === /* @__PURE__ */ N(r) && (o ? ae(n, i) && lt(e, "set", t, n, i) : lt(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && lt(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!_(t) || !xt.has(t)) && ct(e, "has", t), n;
	}
	ownKeys(e) {
		return ct(e, "iterate", d(e) ? "length" : at), Reflect.ownKeys(e);
	}
}, Tt = class extends Ct {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return process.env.NODE_ENV !== "production" && je(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0;
	}
	deleteProperty(e, t) {
		return process.env.NODE_ENV !== "production" && je(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0;
	}
}, Et = /* @__PURE__ */ new wt(), Dt = /* @__PURE__ */ new Tt(), Ot = /* @__PURE__ */ new wt(!0), kt = /* @__PURE__ */ new Tt(!0), At = (e) => e, jt = (e) => Reflect.getPrototypeOf(e);
function Mt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ N(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? At : t ? rn : nn;
		return !t && ct(a, "iterate", l ? ot : at), s(Object.create(u), { next() {
			let { value: e, done: t } = u.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: c ? [d(e[0]), d(e[1])] : d(e),
				done: t
			};
		} });
	};
}
function Nt(e) {
	return function(...t) {
		if (process.env.NODE_ENV !== "production") {
			let n = t[0] ? `on key "${t[0]}" ` : "";
			je(`${re(e)} operation ${n}failed: target is readonly.`, /* @__PURE__ */ N(this));
		}
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Pt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ N(r), a = /* @__PURE__ */ N(n);
			e || (ae(n, a) && ct(i, "get", n), ct(i, "get", a));
			let { has: o } = jt(i), s = t ? At : e ? rn : nn;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && ct(/* @__PURE__ */ N(t), "iterate", at), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ N(n), i = /* @__PURE__ */ N(t);
			return e || (ae(t, i) && ct(r, "has", t), ct(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ N(a), s = t ? At : e ? rn : nn;
			return !e && ct(o, "iterate", at), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: Nt("add"),
		set: Nt("set"),
		delete: Nt("delete"),
		clear: Nt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ N(this), r = jt(n), i = /* @__PURE__ */ N(e), a = !t && !/* @__PURE__ */ $t(e) && !/* @__PURE__ */ Qt(e) ? i : e;
			return r.has.call(n, a) || ae(e, a) && r.has.call(n, e) || ae(i, a) && r.has.call(n, i) || (n.add(a), lt(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ $t(n) && !/* @__PURE__ */ Qt(n) && (n = /* @__PURE__ */ N(n));
			let r = /* @__PURE__ */ N(this), { has: i, get: a } = jt(r), o = i.call(r, e);
			o ? process.env.NODE_ENV !== "production" && Bt(r, i, e) : (e = /* @__PURE__ */ N(e), o = i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? ae(n, s) && lt(r, "set", e, n, s) : lt(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ N(this), { has: n, get: r } = jt(t), i = n.call(t, e);
			i ? process.env.NODE_ENV !== "production" && Bt(t, n, e) : (e = /* @__PURE__ */ N(e), i = n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && lt(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ N(this), t = e.size !== 0, n = process.env.NODE_ENV === "production" ? void 0 : f(e) ? new Map(e) : new Set(e), r = e.clear();
			return t && lt(e, "clear", void 0, void 0, n), r;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Mt(r, e, t);
	}), n;
}
function Ft(e, t) {
	let n = Pt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(u(n, r) && r in t ? n : t, r, i);
}
var It = { get: /* @__PURE__ */ Ft(!1, !1) }, Lt = { get: /* @__PURE__ */ Ft(!1, !0) }, Rt = { get: /* @__PURE__ */ Ft(!0, !1) }, zt = { get: /* @__PURE__ */ Ft(!0, !0) };
function Bt(e, t, n) {
	let r = /* @__PURE__ */ N(n);
	if (r !== n && t.call(e, r)) {
		let t = S(e);
		je(`Reactive ${t} contains both the raw and reactive versions of the same object${t === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
	}
}
var Vt = /* @__PURE__ */ new WeakMap(), Ht = /* @__PURE__ */ new WeakMap(), Ut = /* @__PURE__ */ new WeakMap(), Wt = /* @__PURE__ */ new WeakMap();
function Gt(e) {
	switch (e) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
/* @__NO_SIDE_EFFECTS__ */
function Kt(e) {
	return /* @__PURE__ */ Qt(e) ? e : Xt(e, !1, Et, It, Vt);
}
/* @__NO_SIDE_EFFECTS__ */
function qt(e) {
	return Xt(e, !1, Ot, Lt, Ht);
}
/* @__NO_SIDE_EFFECTS__ */
function Jt(e) {
	return Xt(e, !0, Dt, Rt, Ut);
}
/* @__NO_SIDE_EFFECTS__ */
function Yt(e) {
	return Xt(e, !0, kt, zt, Wt);
}
function Xt(e, t, n, r, i) {
	if (!v(e)) return process.env.NODE_ENV !== "production" && je(`value cannot be made ${t ? "readonly" : "reactive"}: ${String(e)}`), e;
	if (e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Gt(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
/* @__NO_SIDE_EFFECTS__ */
function Zt(e) {
	return /* @__PURE__ */ Qt(e) ? /* @__PURE__ */ Zt(e.__v_raw) : !!(e && e.__v_isReactive);
}
/* @__NO_SIDE_EFFECTS__ */
function Qt(e) {
	return !!(e && e.__v_isReadonly);
}
/* @__NO_SIDE_EFFECTS__ */
function $t(e) {
	return !!(e && e.__v_isShallow);
}
/* @__NO_SIDE_EFFECTS__ */
function en(e) {
	return e ? !!e.__v_raw : !1;
}
/* @__NO_SIDE_EFFECTS__ */
function N(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ N(t) : e;
}
function tn(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && se(e, "__v_skip", !0), e;
}
var nn = (e) => v(e) ? /* @__PURE__ */ Kt(e) : e, rn = (e) => v(e) ? /* @__PURE__ */ Jt(e) : e;
/* @__NO_SIDE_EFFECTS__ */
function an(e) {
	return e ? e.__v_isRef === !0 : !1;
}
/* @__NO_SIDE_EFFECTS__ */
function on(e) {
	return sn(e, !1);
}
function sn(e, t) {
	return /* @__PURE__ */ an(e) ? e : new cn(e, t);
}
var cn = class {
	constructor(e, t) {
		this.dep = new nt(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ N(e), this._value = t ? e : nn(e), this.__v_isShallow = t;
	}
	get value() {
		return process.env.NODE_ENV === "production" ? this.dep.track() : this.dep.track({
			target: this,
			type: "get",
			key: "value"
		}), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ $t(e) || /* @__PURE__ */ Qt(e);
		e = n ? e : /* @__PURE__ */ N(e), ae(e, t) && (this._rawValue = e, this._value = n ? e : nn(e), process.env.NODE_ENV === "production" ? this.dep.trigger() : this.dep.trigger({
			target: this,
			type: "set",
			key: "value",
			newValue: e,
			oldValue: t
		}));
	}
};
function ln(e) {
	return /* @__PURE__ */ an(e) ? e.value : e;
}
var un = {
	get: (e, t, n) => t === "__v_raw" ? e : ln(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ an(i) && !/* @__PURE__ */ an(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function dn(e) {
	return /* @__PURE__ */ Zt(e) ? e : new Proxy(e, un);
}
var fn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new nt(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = et - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && M !== this) return Be(this, !0), !0;
		process.env.NODE_ENV;
	}
	get value() {
		let e = process.env.NODE_ENV === "production" ? this.dep.track() : this.dep.track({
			target: this,
			type: "get",
			key: "value"
		});
		return Ke(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter ? this.setter(e) : process.env.NODE_ENV !== "production" && je("Write operation failed: computed value is readonly");
	}
};
/* @__NO_SIDE_EFFECTS__ */
function pn(e, t, n = !1) {
	let r, i;
	h(e) ? r = e : (r = e.get, i = e.set);
	let a = new fn(r, i, n);
	return process.env.NODE_ENV !== "production" && t && !n && (a.onTrack = t.onTrack, a.onTrigger = t.onTrigger), a;
}
var mn = {}, hn = /* @__PURE__ */ new WeakMap(), gn = void 0;
function _n(e, t = !1, n = gn) {
	if (n) {
		let t = hn.get(n);
		t || hn.set(n, t = []), t.push(e);
	} else process.env.NODE_ENV !== "production" && !t && je("onWatcherCleanup() was called when there was no active watcher to associate with.");
}
function vn(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => {
		(i.onWarn || je)("Invalid watch source: ", e, "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.");
	}, m = (e) => o ? e : /* @__PURE__ */ $t(e) || o === !1 || o === 0 ? yn(e, 1) : yn(e), g, _, v, y, b = !1, x = !1;
	if (/* @__PURE__ */ an(e) ? (_ = () => e.value, b = /* @__PURE__ */ $t(e)) : /* @__PURE__ */ Zt(e) ? (_ = () => m(e), b = !0) : d(e) ? (x = !0, b = e.some((e) => /* @__PURE__ */ Zt(e) || /* @__PURE__ */ $t(e)), _ = () => e.map((e) => {
		if (/* @__PURE__ */ an(e)) return e.value;
		if (/* @__PURE__ */ Zt(e)) return m(e);
		if (h(e)) return f ? f(e, 2) : e();
		process.env.NODE_ENV !== "production" && p(e);
	})) : h(e) ? _ = n ? f ? () => f(e, 2) : e : () => {
		if (v) {
			Ze();
			try {
				v();
			} finally {
				Qe();
			}
		}
		let t = gn;
		gn = g;
		try {
			return f ? f(e, 3, [y]) : e(y);
		} finally {
			gn = t;
		}
	} : (_ = r, process.env.NODE_ENV !== "production" && p(e)), n && o) {
		let e = _, t = o === !0 ? Infinity : o;
		_ = () => yn(e(), t);
	}
	let S = Pe(), C = () => {
		g.stop(), S && S.active && c(S.effects, g);
	};
	if (s && n) {
		let e = n;
		n = (...t) => {
			e(...t), C();
		};
	}
	let w = x ? Array(e.length).fill(mn) : mn, T = (e) => {
		if (!(!(g.flags & 1) || !g.dirty && !e)) if (n) {
			let e = g.run();
			if (o || b || (x ? e.some((e, t) => ae(e, w[t])) : ae(e, w))) {
				v && v();
				let t = gn;
				gn = g;
				try {
					let t = [
						e,
						w === mn ? void 0 : x && w[0] === mn ? [] : w,
						y
					];
					w = e, f ? f(n, 3, t) : n(...t);
				} finally {
					gn = t;
				}
			}
		} else g.run();
	};
	return u && u(T), g = new Ie(_), g.scheduler = l ? () => l(T, !1) : T, y = (e) => _n(e, !1, g), v = g.onStop = () => {
		let e = hn.get(g);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			hn.delete(g);
		}
	}, process.env.NODE_ENV !== "production" && (g.onTrack = i.onTrack, g.onTrigger = i.onTrigger), n ? a ? T(!0) : w = g.run() : l ? l(T.bind(null, !0), !0) : g.run(), C.pause = g.pause.bind(g), C.resume = g.resume.bind(g), C.stop = C, C;
}
function yn(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ an(e)) yn(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) yn(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		yn(e, t, n);
	});
	else if (C(e)) {
		for (let r in e) yn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && yn(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var bn = [];
function xn(e) {
	bn.push(e);
}
function Sn() {
	bn.pop();
}
var Cn = !1;
function P(e, ...t) {
	if (Cn) return;
	Cn = !0, Ze();
	let n = bn.length ? bn[bn.length - 1].component : null, r = n && n.appContext.config.warnHandler, i = wn();
	if (r) An(r, n, 11, [
		e + t.map((e) => e.toString?.call(e) ?? JSON.stringify(e)).join(""),
		n && n.proxy,
		i.map(({ vnode: e }) => `at <${bs(n, e.type)}>`).join("\n"),
		i
	]);
	else {
		let n = [`[Vue warn]: ${e}`, ...t];
		i.length && n.push("\n", ...Tn(i)), console.warn(...n);
	}
	Qe(), Cn = !1;
}
function wn() {
	let e = bn[bn.length - 1];
	if (!e) return [];
	let t = [];
	for (; e;) {
		let n = t[0];
		n && n.vnode === e ? n.recurseCount++ : t.push({
			vnode: e,
			recurseCount: 0
		});
		let r = e.component && e.component.parent;
		e = r && r.vnode;
	}
	return t;
}
function Tn(e) {
	let t = [];
	return e.forEach((e, n) => {
		t.push(...n === 0 ? [] : ["\n"], ...En(e));
	}), t;
}
function En({ vnode: e, recurseCount: t }) {
	let n = t > 0 ? `... (${t} recursive calls)` : "", r = e.component ? e.component.parent == null : !1, i = ` at <${bs(e.component, e.type, r)}`, a = ">" + n;
	return e.props ? [
		i,
		...Dn(e.props),
		a
	] : [i + a];
}
function Dn(e) {
	let t = [], n = Object.keys(e);
	return n.slice(0, 3).forEach((n) => {
		t.push(...On(n, e[n]));
	}), n.length > 3 && t.push(" ..."), t;
}
function On(e, t, n) {
	return g(t) ? (t = JSON.stringify(t), n ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? n ? t : [`${e}=${t}`] : /* @__PURE__ */ an(t) ? (t = On(e, /* @__PURE__ */ N(t.value), !0), n ? t : [
		`${e}=Ref<`,
		t,
		">"
	]) : h(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = /* @__PURE__ */ N(t), n ? t : [`${e}=`, t]);
}
var kn = {
	sp: "serverPrefetch hook",
	bc: "beforeCreate hook",
	c: "created hook",
	bm: "beforeMount hook",
	m: "mounted hook",
	bu: "beforeUpdate hook",
	u: "updated",
	bum: "beforeUnmount hook",
	um: "unmounted hook",
	a: "activated hook",
	da: "deactivated hook",
	ec: "errorCaptured hook",
	rtc: "renderTracked hook",
	rtg: "renderTriggered hook",
	0: "setup function",
	1: "render function",
	2: "watcher getter",
	3: "watcher callback",
	4: "watcher cleanup function",
	5: "native event handler",
	6: "component event handler",
	7: "vnode hook",
	8: "directive hook",
	9: "transition hook",
	10: "app errorHandler",
	11: "app warnHandler",
	12: "ref function",
	13: "async component loader",
	14: "scheduler flush",
	15: "component update",
	16: "app unmount cleanup function"
};
function An(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Mn(e, t, n);
	}
}
function jn(e, t, n, r) {
	if (h(e)) {
		let i = An(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			Mn(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(jn(e[a], t, n, r));
		return i;
	} else process.env.NODE_ENV !== "production" && P(`Invalid value type passed to callWithAsyncErrorHandling(): ${typeof e}`);
}
function Mn(e, n, r, i = !0) {
	let a = n ? n.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: s } = n && n.appContext.config || t;
	if (n) {
		let t = n.parent, i = n.proxy, a = process.env.NODE_ENV === "production" ? `https://vuejs.org/error-reference/#runtime-${r}` : kn[r];
		for (; t;) {
			let n = t.ec;
			if (n) {
				for (let t = 0; t < n.length; t++) if (n[t](e, i, a) === !1) return;
			}
			t = t.parent;
		}
		if (o) {
			Ze(), An(o, null, 10, [
				e,
				i,
				a
			]), Qe();
			return;
		}
	}
	Nn(e, r, a, i, s);
}
function Nn(e, t, n, r = !0, i = !1) {
	if (process.env.NODE_ENV !== "production") {
		let i = kn[t];
		if (n && xn(n), P(`Unhandled error${i ? ` during execution of ${i}` : ""}`), n && Sn(), r) throw e;
		console.error(e);
	} else if (i) throw e;
	else console.error(e);
}
var Pn = [], Fn = -1, In = [], Ln = null, Rn = 0, zn = /* @__PURE__ */ Promise.resolve(), Bn = null, Vn = 100;
function Hn(e) {
	let t = Bn || zn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Un(e) {
	let t = Fn + 1, n = Pn.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = Pn[r], a = Yn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Wn(e) {
	if (!(e.flags & 1)) {
		let t = Yn(e), n = Pn[Pn.length - 1];
		!n || !(e.flags & 2) && t >= Yn(n) ? Pn.push(e) : Pn.splice(Un(t), 0, e), e.flags |= 1, Gn();
	}
}
function Gn() {
	Bn ||= zn.then(Xn);
}
function Kn(e) {
	d(e) ? In.push(...e) : Ln && e.id === -1 ? Ln.splice(Rn + 1, 0, e) : e.flags & 1 || (In.push(e), e.flags |= 1), Gn();
}
function qn(e, t, n = Fn + 1) {
	for (process.env.NODE_ENV !== "production" && (t ||= /* @__PURE__ */ new Map()); n < Pn.length; n++) {
		let r = Pn[n];
		if (r && r.flags & 2) {
			if (e && r.id !== e.uid || process.env.NODE_ENV !== "production" && Zn(t, r)) continue;
			Pn.splice(n, 1), n--, r.flags & 4 && (r.flags &= -2), r(), r.flags & 4 || (r.flags &= -2);
		}
	}
}
function Jn(e) {
	if (In.length) {
		let t = [...new Set(In)].sort((e, t) => Yn(e) - Yn(t));
		if (In.length = 0, Ln) {
			Ln.push(...t);
			return;
		}
		for (Ln = t, process.env.NODE_ENV !== "production" && (e ||= /* @__PURE__ */ new Map()), Rn = 0; Rn < Ln.length; Rn++) {
			let t = Ln[Rn];
			process.env.NODE_ENV !== "production" && Zn(e, t) || (t.flags & 4 && (t.flags &= -2), t.flags & 8 || t(), t.flags &= -2);
		}
		Ln = null, Rn = 0;
	}
}
var Yn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Xn(e) {
	process.env.NODE_ENV !== "production" && (e ||= /* @__PURE__ */ new Map());
	let t = process.env.NODE_ENV === "production" ? r : (t) => Zn(e, t);
	try {
		for (Fn = 0; Fn < Pn.length; Fn++) {
			let e = Pn[Fn];
			if (e && !(e.flags & 8)) {
				if (process.env.NODE_ENV !== "production" && t(e)) continue;
				e.flags & 4 && (e.flags &= -2), An(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2);
			}
		}
	} finally {
		for (; Fn < Pn.length; Fn++) {
			let e = Pn[Fn];
			e && (e.flags &= -2);
		}
		Fn = -1, Pn.length = 0, Jn(e), Bn = null, (Pn.length || In.length) && Xn(e);
	}
}
function Zn(e, t) {
	let n = e.get(t) || 0;
	if (n > Vn) {
		let e = t.i, n = e && ys(e.type);
		return Mn(`Maximum recursive updates exceeded${n ? ` in component <${n}>` : ""}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`, null, 10), !0;
	}
	return e.set(t, n + 1), !1;
}
var Qn = !1, $n = (e) => {
	try {
		return Qn;
	} finally {
		Qn = e;
	}
}, er = /* @__PURE__ */ new Map();
process.env.NODE_ENV !== "production" && (de().__VUE_HMR_RUNTIME__ = {
	createRecord: lr(ir),
	rerender: lr(or),
	reload: lr(sr)
});
var tr = /* @__PURE__ */ new Map();
function nr(e) {
	let t = e.type.__hmrId, n = tr.get(t);
	n ||= (ir(t, e.type), tr.get(t)), n.instances.add(e);
}
function rr(e) {
	tr.get(e.type.__hmrId).instances.delete(e);
}
function ir(e, t) {
	return tr.has(e) ? !1 : (tr.set(e, {
		initialDef: ar(t),
		instances: /* @__PURE__ */ new Set()
	}), !0);
}
function ar(e) {
	return xs(e) ? e.__vccOpts : e;
}
function or(e, t) {
	let n = tr.get(e);
	n && (n.initialDef.render = t, [...n.instances].forEach((e) => {
		t && (e.render = t, ar(e.type).render = t), e.renderCache = [], Qn = !0, e.job.flags & 8 || e.update(), Qn = !1;
	}));
}
function sr(e, t) {
	let n = tr.get(e);
	if (!n) return;
	t = ar(t), cr(n.initialDef, t);
	let r = [...n.instances];
	for (let e = 0; e < r.length; e++) {
		let i = r[e], a = ar(i.type), o = er.get(a);
		o || (a !== n.initialDef && cr(a, t), er.set(a, o = /* @__PURE__ */ new Set())), o.add(i), i.appContext.propsCache.delete(i.type), i.appContext.emitsCache.delete(i.type), i.appContext.optionsCache.delete(i.type), i.ceReload ? (o.add(i), i.ceReload(t.styles), o.delete(i)) : i.parent ? Wn(() => {
			i.job.flags & 8 || (Qn = !0, i.parent.update(), Qn = !1, o.delete(i));
		}) : i.appContext.reload ? i.appContext.reload() : typeof window < "u" ? window.location.reload() : console.warn("[HMR] Root or manually mounted instance modified. Full reload required."), i.root.ce && i !== i.root && i.root.ce._removeChildStyle(a);
	}
	Kn(() => {
		er.clear();
	});
}
function cr(e, t) {
	s(e, t);
	for (let n in e) n !== "__file" && !(n in t) && delete e[n];
}
function lr(e) {
	return (t, n) => {
		try {
			return e(t, n);
		} catch (e) {
			console.error(e), console.warn("[HMR] Something went wrong during Vue component hot-reload. Full reload required.");
		}
	};
}
var ur, dr = [], fr = !1;
function pr(e, ...t) {
	ur ? ur.emit(e, ...t) : fr || dr.push({
		event: e,
		args: t
	});
}
function mr(e, t) {
	ur = e, ur ? (ur.enabled = !0, dr.forEach(({ event: e, args: t }) => ur.emit(e, ...t)), dr = []) : typeof window < "u" && window.HTMLElement && !(window.navigator?.userAgent)?.includes("jsdom") ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((e) => {
		mr(e, t);
	}), setTimeout(() => {
		ur || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, fr = !0, dr = []);
	}, 3e3)) : (fr = !0, dr = []);
}
function hr(e, t) {
	pr("app:init", e, t, {
		Fragment: F,
		Text: xo,
		Comment: So,
		Static: Co
	});
}
function gr(e) {
	pr("app:unmount", e);
}
var _r = /* @__PURE__ */ xr("component:added"), vr = /* @__PURE__ */ xr("component:updated"), yr = /* @__PURE__ */ xr("component:removed"), br = (e) => {
	ur && typeof ur.cleanupBuffer == "function" && !ur.cleanupBuffer(e) && yr(e);
};
/* @__NO_SIDE_EFFECTS__ */
function xr(e) {
	return (t) => {
		pr(e, t.appContext.app, t.uid, t.parent ? t.parent.uid : void 0, t);
	};
}
var Sr = /* @__PURE__ */ wr("perf:start"), Cr = /* @__PURE__ */ wr("perf:end");
function wr(e) {
	return (t, n, r) => {
		pr(e, t.appContext.app, t.uid, t, n, r);
	};
}
function Tr(e, t, n) {
	pr("component:emit", e.appContext.app, e, t, n);
}
var Er = null, Dr = null;
function Or(e) {
	let t = Er;
	return Er = e, Dr = e && e.type.__scopeId || null, t;
}
function kr(e, t = Er, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Oo(-1);
		let i = Or(t), a;
		try {
			a = e(...n);
		} finally {
			Or(i), r._d && Oo(1);
		}
		return process.env.NODE_ENV !== "production" && vr(t), a;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function Ar(e) {
	E(e) && P("Do not use built-in directive ids as custom directive id: " + e);
}
function jr(e, n) {
	if (Er === null) return process.env.NODE_ENV !== "production" && P("withDirectives can only be used inside render functions."), e;
	let r = gs(Er), i = e.dirs ||= [];
	for (let e = 0; e < n.length; e++) {
		let [a, o, s, c = t] = n[e];
		a && (h(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && yn(o), i.push({
			dir: a,
			instance: r,
			value: o,
			oldValue: void 0,
			arg: s,
			modifiers: c
		}));
	}
	return e;
}
function Mr(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (Ze(), jn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Qe());
	}
}
function Nr(e, t) {
	if (process.env.NODE_ENV !== "production" && (!Xo || Xo.isMounted) && P("provide() can only be used inside setup()."), Xo) {
		let n = Xo.provides, r = Xo.parent && Xo.parent.provides;
		r === n && (n = Xo.provides = Object.create(r)), n[e] = t;
	}
}
function Pr(e, t, n = !1) {
	let r = Zo();
	if (r || la) {
		let i = la ? la._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
		process.env.NODE_ENV !== "production" && P(`injection "${String(e)}" not found.`);
	} else process.env.NODE_ENV !== "production" && P("inject() can only be used inside setup() or functional components.");
}
var Fr = /* @__PURE__ */ Symbol.for("v-scx"), Ir = () => {
	{
		let e = Pr(Fr);
		return e || process.env.NODE_ENV !== "production" && P("Server rendering context not provided. Make sure to only call useSSRContext() conditionally in the server build."), e;
	}
};
function Lr(e, t, n) {
	return process.env.NODE_ENV !== "production" && !h(t) && P("`watch(fn, options?)` signature has been moved to a separate API. Use `watchEffect(fn, options?)` instead. `watch` now only supports `watch(source, cb, options?) signature."), Rr(e, t, n);
}
function Rr(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i;
	process.env.NODE_ENV !== "production" && !n && (a !== void 0 && P("watch() \"immediate\" option is only respected when using the watch(source, callback, options?) signature."), o !== void 0 && P("watch() \"deep\" option is only respected when using the watch(source, callback, options?) signature."), l !== void 0 && P("watch() \"once\" option is only respected when using the watch(source, callback, options?) signature."));
	let u = s({}, i);
	process.env.NODE_ENV !== "production" && (u.onWarn = P);
	let d = n && a || !n && c !== "post", f;
	if (as) {
		if (c === "sync") {
			let e = Ir();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = Xo;
	u.call = (e, t, n) => jn(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		so(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : Wn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = vn(e, n, u);
	return as && (f ? f.push(h) : d && h()), h;
}
function zr(e, t, n) {
	let r = this.proxy, i = g(e) ? e.includes(".") ? Br(r, e) : () => r[e] : e.bind(r, r), a;
	h(t) ? a = t : (a = t.handler, n = t);
	let o = es(this), s = Rr(i, a.bind(r), n);
	return o(), s;
}
function Br(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Vr = /* @__PURE__ */ new WeakMap(), Hr = /* @__PURE__ */ Symbol("_vte"), Ur = (e) => e.__isTeleport, Wr = (e) => e && (e.disabled || e.disabled === ""), Gr = (e) => e && (e.defer || e.defer === ""), Kr = (e) => typeof SVGElement < "u" && e instanceof SVGElement, qr = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, Jr = (e, t) => {
	let n = e && e.to;
	if (g(n)) if (t) {
		let r = t(n);
		return process.env.NODE_ENV !== "production" && !r && !Wr(e) && P(`Failed to locate Teleport target with selector "${n}". Note the target element must exist before the component is mounted - i.e. the target cannot be rendered by the component itself, and ideally should be outside of the entire Vue component tree.`), r;
	} else return process.env.NODE_ENV !== "production" && P("Current renderer does not support string target for Teleports. (missing querySelector renderer option)"), null;
	else return process.env.NODE_ENV !== "production" && !n && !Wr(e) && P(`Invalid Teleport target: ${n}`), n;
}, Yr = {
	name: "Teleport",
	__isTeleport: !0,
	process(e, t, n, r, i, a, o, s, c, l) {
		let { mc: u, pc: d, pbc: f, o: { insert: p, querySelector: m, createText: h, createComment: g, parentNode: _ } } = l, v = Wr(t.props), { dynamicChildren: y } = t;
		process.env.NODE_ENV !== "production" && Qn && (c = !1, y = null);
		let b = (e, t, n) => {
			e.shapeFlag & 16 && u(e.children, t, n, i, a, o, s, c);
		}, x = (e = t) => {
			let n = Wr(e.props), r = e.target = Jr(e.props, m), a = ei(r, e, h, p);
			r ? (o !== "svg" && Kr(r) ? o = "svg" : o !== "mathml" && qr(r) && (o = "mathml"), i && i.isCE && (i.ce._teleportTargets || (i.ce._teleportTargets = /* @__PURE__ */ new Set())).add(r), n || (b(e, r, a), $r(e, !1))) : process.env.NODE_ENV !== "production" && !n && P("Invalid Teleport target on mount:", r, `(${typeof r})`);
		}, S = (e) => {
			let t = () => {
				Vr.get(e) === t && (Vr.delete(e), Wr(e.props) && (b(e, _(e.el) || n, e.anchor), $r(e, !0)), x(e));
			};
			Vr.set(e, t), so(t, a);
		};
		if (e == null) {
			let e = t.el = process.env.NODE_ENV === "production" ? h("") : g("teleport start"), i = t.anchor = process.env.NODE_ENV === "production" ? h("") : g("teleport end");
			if (p(e, n, r), p(i, n, r), Gr(t.props) || a && a.pendingBranch) {
				S(t);
				return;
			}
			v && (b(t, n, i), $r(t, !0)), x();
		} else {
			t.el = e.el;
			let r = t.anchor = e.anchor, u = Vr.get(e);
			if (u) {
				u.flags |= 8, Vr.delete(e), S(t);
				return;
			}
			t.targetStart = e.targetStart;
			let p = t.target = e.target, h = t.targetAnchor = e.targetAnchor, g = Wr(e.props), _ = g ? n : p, b = g ? r : h;
			if (o === "svg" || Kr(p) ? o = "svg" : (o === "mathml" || qr(p)) && (o = "mathml"), y ? (f(e.dynamicChildren, y, _, i, a, o, s), mo(e, t, process.env.NODE_ENV === "production")) : c || d(e, t, _, b, i, a, o, s, !1), v) g ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : Xr(t, n, r, l, 1);
			else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
				let e = t.target = Jr(t.props, m);
				e ? Xr(t, e, null, l, 0) : process.env.NODE_ENV !== "production" && P("Invalid Teleport target on update:", p, `(${typeof p})`);
			} else g && Xr(t, p, h, l, 1);
			$r(t, v);
		}
	},
	remove(e, t, n, { um: r, o: { remove: i } }, a) {
		let { shapeFlag: o, children: s, anchor: c, targetStart: l, targetAnchor: u, target: d, props: f } = e, p = a || !Wr(f), m = Vr.get(e);
		if (m && (m.flags |= 8, Vr.delete(e)), d && (i(l), i(u)), a && i(c), !m && o & 16) for (let e = 0; e < s.length; e++) {
			let i = s[e];
			r(i, t, n, p, !!i.dynamicChildren);
		}
	},
	move: Xr,
	hydrate: Zr
};
function Xr(e, t, n, { o: { insert: r }, m: i }, a = 2) {
	a === 0 && r(e.targetAnchor, t, n);
	let { el: o, anchor: s, shapeFlag: c, children: l, props: u } = e, d = a === 2;
	if (d && r(o, t, n), !Vr.has(e) && (!d || Wr(u)) && c & 16) for (let e = 0; e < l.length; e++) i(l[e], t, n, 2);
	d && r(s, t, n);
}
function Zr(e, t, n, r, i, a, { o: { nextSibling: o, parentNode: s, querySelector: c, insert: l, createText: u } }, d) {
	function f(e, n) {
		let r = n;
		for (; r;) {
			if (r && r.nodeType === 8) {
				if (r.data === "teleport start anchor") t.targetStart = r;
				else if (r.data === "teleport anchor") {
					t.targetAnchor = r, e._lpa = t.targetAnchor && o(t.targetAnchor);
					break;
				}
			}
			r = o(r);
		}
	}
	function p(e, t) {
		t.anchor = d(o(e), t, s(e), n, r, i, a);
	}
	let m = t.target = Jr(t.props, c), h = Wr(t.props);
	if (m) {
		let c = m._lpa || m.firstChild;
		t.shapeFlag & 16 && (h ? (p(e, t), f(m, c), t.targetAnchor || ei(m, t, u, l, s(e) === m ? e : null)) : (t.anchor = o(e), f(m, c), t.targetAnchor || ei(m, t, u, l), d(c && o(c), t, m, n, r, i, a))), $r(t, h);
	} else h && t.shapeFlag & 16 && (p(e, t), t.targetStart = e, t.targetAnchor = o(e));
	return t.anchor && o(t.anchor);
}
var Qr = Yr;
function $r(e, t) {
	let n = e.ctx;
	if (n && n.ut) {
		let r, i;
		for (t ? (r = e.el, i = e.anchor) : (r = e.targetStart, i = e.targetAnchor); r && r !== i;) r.nodeType === 1 && r.setAttribute("data-v-owner", n.uid), r = r.nextSibling;
		n.ut();
	}
}
function ei(e, t, n, r, i = null) {
	let a = t.targetStart = n(""), o = t.targetAnchor = n("");
	return a[Hr] = o, e && (r(a, e, i), r(o, e, i)), o;
}
var ti = /* @__PURE__ */ Symbol("_leaveCb");
function ni(e, t) {
	e.shapeFlag & 6 && e.component ? (e.transition = t, ni(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
/* @__NO_SIDE_EFFECTS__ */
function ri(e, t) {
	return h(e) ? /* @__PURE__ */ s({ name: e.name }, t, { setup: e }) : e;
}
function ii(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
var ai = /* @__PURE__ */ new WeakSet();
function oi(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var si = /* @__PURE__ */ new WeakMap();
function ci(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => ci(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (ui(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && ci(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? gs(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e;
	if (process.env.NODE_ENV !== "production" && !f) {
		P("Missing ref owner context. ref cannot be used on hoisted vnodes. A vnode with ref must be created inside the render function.");
		return;
	}
	let m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ N(v), b = v === t ? i : (e) => process.env.NODE_ENV !== "production" && (u(y, e) && !/* @__PURE__ */ an(y[e]) && P(`Template ref "${e}" used on a non-ref value. It will not work in the production build.`), ai.has(y[e])) || oi(_, e) ? !1 : u(y, e), x = (e, t) => !(process.env.NODE_ENV !== "production" && ai.has(e) || t && oi(_, t));
	if (m != null && m !== p) {
		if (li(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ an(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) An(p, f, 12, [l, _]);
	else {
		let t = g(p), n = /* @__PURE__ */ an(p);
		if (t || n) {
			let i = () => {
				if (e.f) {
					let n = t ? b(p) ? v[p] : _[p] : x(p) || !e.k ? p.value : _[e.k];
					if (o) d(n) && c(n, s);
					else if (d(n)) n.includes(s) || n.push(s);
					else if (t) _[p] = [s], b(p) && (v[p] = _[p]);
					else {
						let t = [s];
						x(p, e.k) && (p.value = t), e.k && (_[e.k] = t);
					}
				} else t ? (_[p] = l, b(p) && (v[p] = l)) : n ? (x(p, e.k) && (p.value = l), e.k && (_[e.k] = l)) : process.env.NODE_ENV !== "production" && P("Invalid template ref type:", p, `(${typeof p})`);
			};
			if (l) {
				let t = () => {
					i(), si.delete(e);
				};
				t.id = -1, si.set(e, t), so(t, r);
			} else li(e), i();
		} else process.env.NODE_ENV !== "production" && P("Invalid template ref type:", p, `(${typeof p})`);
	}
}
function li(e) {
	let t = si.get(e);
	t && (t.flags |= 8, si.delete(e));
}
de().requestIdleCallback, de().cancelIdleCallback;
var ui = (e) => !!e.type.__asyncLoader, di = (e) => e.type.__isKeepAlive;
function fi(e, t) {
	mi(e, "a", t);
}
function pi(e, t) {
	mi(e, "da", t);
}
function mi(e, t, n = Xo) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (gi(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) di(e.parent.vnode) && hi(r, t, n, e), e = e.parent;
	}
}
function hi(e, t, n, r) {
	let i = gi(t, e, r, !0);
	Ci(() => {
		c(r[t], i);
	}, n);
}
function gi(e, t, n = Xo, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			Ze();
			let i = es(n), a = jn(t, n, e, r);
			return i(), Qe(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	} else process.env.NODE_ENV !== "production" && P(`${ie(kn[e].replace(/ hook$/, ""))} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`);
}
var _i = (e) => (t, n = Xo) => {
	(!as || e === "sp") && gi(e, (...e) => t(...e), n);
}, vi = _i("bm"), yi = _i("m"), bi = _i("bu"), xi = _i("u"), Si = _i("bum"), Ci = _i("um"), wi = _i("sp"), Ti = _i("rtg"), Ei = _i("rtc");
function Di(e, t = Xo) {
	gi("ec", e, t);
}
var Oi = "components";
function ki(e, t) {
	return Mi(Oi, e, !0, t) || e;
}
var Ai = /* @__PURE__ */ Symbol.for("v-ndc");
function ji(e) {
	return g(e) ? Mi(Oi, e, !1) || e : e || Ai;
}
function Mi(e, t, n = !0, r = !1) {
	let i = Er || Xo;
	if (i) {
		let a = i.type;
		if (e === Oi) {
			let e = ys(a, !1);
			if (e && (e === t || e === O(t) || e === re(O(t)))) return a;
		}
		let o = Ni(i[e] || a[e], t) || Ni(i.appContext[e], t);
		if (!o && r) return a;
		if (process.env.NODE_ENV !== "production" && n && !o) {
			let n = e === Oi ? "\nIf this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement." : "";
			P(`Failed to resolve ${e.slice(0, -1)}: ${t}${n}`);
		}
		return o;
	} else process.env.NODE_ENV !== "production" && P(`resolve${re(e.slice(0, -1))} can only be used in render() or setup().`);
}
function Ni(e, t) {
	return e && (e[t] || e[O(t)] || e[re(O(t))]);
}
function Pi(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ Zt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ $t(e), s = /* @__PURE__ */ Qt(e), e = dt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? rn(nn(e[n])) : nn(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") if (process.env.NODE_ENV !== "production" && (!Number.isInteger(e) || e < 0)) P(`The v-for range expects a positive integer value but got ${e}.`), i = [];
	else {
		i = Array(e);
		for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
	}
	else if (v(e)) if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
	else {
		let n = Object.keys(e);
		i = Array(n.length);
		for (let r = 0, o = n.length; r < o; r++) {
			let o = n[r];
			i[r] = t(e[o], o, r, a && a[r]);
		}
	}
	else i = [];
	return n && (n[r] = i), i;
}
var Fi = (e) => e ? is(e) ? gs(e) : Fi(e.parent) : null, Ii = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => process.env.NODE_ENV === "production" ? e.props : /* @__PURE__ */ Yt(e.props),
	$attrs: (e) => process.env.NODE_ENV === "production" ? e.attrs : /* @__PURE__ */ Yt(e.attrs),
	$slots: (e) => process.env.NODE_ENV === "production" ? e.slots : /* @__PURE__ */ Yt(e.slots),
	$refs: (e) => process.env.NODE_ENV === "production" ? e.refs : /* @__PURE__ */ Yt(e.refs),
	$parent: (e) => Fi(e.parent),
	$root: (e) => Fi(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => Xi(e),
	$forceUpdate: (e) => e.f ||= () => {
		Wn(e.update);
	},
	$nextTick: (e) => e.n ||= Hn.bind(e.proxy),
	$watch: (e) => zr.bind(e)
}), Li = (e) => e === "_" || e === "$", Ri = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), zi = {
	get({ _: e }, n) {
		if (n === "__v_skip") return !0;
		let { ctx: r, setupState: i, data: a, props: o, accessCache: s, type: c, appContext: l } = e;
		if (process.env.NODE_ENV !== "production" && n === "__isVue") return !0;
		if (n[0] !== "$") {
			let e = s[n];
			if (e !== void 0) switch (e) {
				case 1: return i[n];
				case 2: return a[n];
				case 4: return r[n];
				case 3: return o[n];
			}
			else if (Ri(i, n)) return s[n] = 1, i[n];
			else if (a !== t && u(a, n)) return s[n] = 2, a[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else Gi && (s[n] = 0);
		}
		let d = Ii[n], f, p;
		if (d) return n === "$attrs" ? (ct(e.attrs, "get", ""), process.env.NODE_ENV !== "production" && ga()) : process.env.NODE_ENV !== "production" && n === "$slots" && ct(e, "get", n), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
		process.env.NODE_ENV !== "production" && Er && (!g(n) || n.indexOf("__v") !== 0) && (a !== t && Li(n[0]) && u(a, n) ? P(`Property ${JSON.stringify(n)} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`) : e === Er && P(`Property ${JSON.stringify(n)} was accessed during render but is not defined on instance.`));
	},
	set({ _: e }, n, r) {
		let { data: i, setupState: a, ctx: o } = e;
		return Ri(a, n) ? (a[n] = r, !0) : process.env.NODE_ENV !== "production" && a.__isScriptSetup && u(a, n) ? (P(`Cannot mutate <script setup> binding "${n}" from Options API.`), !1) : i !== t && u(i, n) ? (i[n] = r, !0) : u(e.props, n) ? (process.env.NODE_ENV !== "production" && P(`Attempting to mutate prop "${n}". Props are readonly.`), !1) : n[0] === "$" && n.slice(1) in e ? (process.env.NODE_ENV !== "production" && P(`Attempting to mutate public property "${n}". Properties starting with $ are reserved and readonly.`), !1) : (process.env.NODE_ENV !== "production" && n in e.appContext.config.globalProperties ? Object.defineProperty(o, n, {
			enumerable: !0,
			configurable: !0,
			value: r
		}) : o[n] = r, !0);
	},
	has({ _: { data: e, setupState: n, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(r[c] || e !== t && c[0] !== "$" && u(e, c) || Ri(n, c) || u(o, c) || u(i, c) || u(Ii, c) || u(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
process.env.NODE_ENV !== "production" && (zi.ownKeys = (e) => (P("Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead."), Reflect.ownKeys(e)));
function Bi(e) {
	let t = {};
	return Object.defineProperty(t, "_", {
		configurable: !0,
		enumerable: !1,
		get: () => e
	}), Object.keys(Ii).forEach((n) => {
		Object.defineProperty(t, n, {
			configurable: !0,
			enumerable: !1,
			get: () => Ii[n](e),
			set: r
		});
	}), t;
}
function Vi(e) {
	let { ctx: t, propsOptions: [n] } = e;
	n && Object.keys(n).forEach((n) => {
		Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => e.props[n],
			set: r
		});
	});
}
function Hi(e) {
	let { ctx: t, setupState: n } = e;
	Object.keys(/* @__PURE__ */ N(n)).forEach((e) => {
		if (!n.__isScriptSetup) {
			if (Li(e[0])) {
				P(`setup() return property ${JSON.stringify(e)} should not start with "$" or "_" which are reserved prefixes for Vue internals.`);
				return;
			}
			Object.defineProperty(t, e, {
				enumerable: !0,
				configurable: !0,
				get: () => n[e],
				set: r
			});
		}
	});
}
function Ui(e) {
	return d(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function Wi() {
	let e = /* @__PURE__ */ Object.create(null);
	return (t, n) => {
		e[n] ? P(`${t} property "${n}" is already defined in ${e[n]}.`) : e[n] = t;
	};
}
var Gi = !0;
function Ki(e) {
	let t = Xi(e), n = e.proxy, i = e.ctx;
	Gi = !1, t.beforeCreate && Ji(t.beforeCreate, e, "bc");
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: f, beforeMount: p, mounted: m, beforeUpdate: g, updated: _, activated: b, deactivated: x, beforeDestroy: S, beforeUnmount: C, destroyed: w, unmounted: T, render: E, renderTracked: D, renderTriggered: ee, errorCaptured: O, serverPrefetch: te, expose: ne, inheritAttrs: re, components: ie, directives: ae, filters: oe } = t, se = process.env.NODE_ENV === "production" ? null : Wi();
	if (process.env.NODE_ENV !== "production") {
		let [t] = e.propsOptions;
		if (t) for (let e in t) se("Props", e);
	}
	if (u && qi(u, i, se), s) for (let e in s) {
		let t = s[e];
		h(t) ? (process.env.NODE_ENV === "production" ? i[e] = t.bind(n) : Object.defineProperty(i, e, {
			value: t.bind(n),
			configurable: !0,
			enumerable: !0,
			writable: !0
		}), process.env.NODE_ENV !== "production" && se("Methods", e)) : process.env.NODE_ENV !== "production" && P(`Method "${e}" has type "${typeof t}" in the component definition. Did you reference the function correctly?`);
	}
	if (a) {
		process.env.NODE_ENV !== "production" && !h(a) && P("The data option must be a function. Plain object usage is no longer supported.");
		let t = a.call(n, n);
		if (process.env.NODE_ENV !== "production" && y(t) && P("data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>."), !v(t)) process.env.NODE_ENV !== "production" && P("data() should return an object.");
		else if (e.data = /* @__PURE__ */ Kt(t), process.env.NODE_ENV !== "production") for (let e in t) se("Data", e), Li(e[0]) || Object.defineProperty(i, e, {
			configurable: !0,
			enumerable: !0,
			get: () => t[e],
			set: r
		});
	}
	if (Gi = !0, o) for (let e in o) {
		let t = o[e], a = h(t) ? t.bind(n, n) : h(t.get) ? t.get.bind(n, n) : r;
		process.env.NODE_ENV !== "production" && a === r && P(`Computed property "${e}" has no getter.`);
		let s = Ss({
			get: a,
			set: !h(t) && h(t.set) ? t.set.bind(n) : process.env.NODE_ENV === "production" ? r : () => {
				P(`Write operation failed: computed property "${e}" is readonly.`);
			}
		});
		Object.defineProperty(i, e, {
			enumerable: !0,
			configurable: !0,
			get: () => s.value,
			set: (e) => s.value = e
		}), process.env.NODE_ENV !== "production" && se("Computed", e);
	}
	if (c) for (let e in c) Yi(c[e], i, n, e);
	if (l) {
		let e = h(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			Nr(t, e[t]);
		});
	}
	f && Ji(f, e, "c");
	function ce(e, t) {
		d(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (ce(vi, p), ce(yi, m), ce(bi, g), ce(xi, _), ce(fi, b), ce(pi, x), ce(Di, O), ce(Ei, D), ce(Ti, ee), ce(Si, C), ce(Ci, T), ce(wi, te), d(ne)) if (ne.length) {
		let t = e.exposed ||= {};
		ne.forEach((e) => {
			Object.defineProperty(t, e, {
				get: () => n[e],
				set: (t) => n[e] = t,
				enumerable: !0
			});
		});
	} else e.exposed ||= {};
	E && e.render === r && (e.render = E), re != null && (e.inheritAttrs = re), ie && (e.components = ie), ae && (e.directives = ae), te && ii(e);
}
function qi(e, t, n = r) {
	d(e) && (e = ta(e));
	for (let r in e) {
		let i = e[r], a;
		a = v(i) ? "default" in i ? Pr(i.from || r, i.default, !0) : Pr(i.from || r) : Pr(i), /* @__PURE__ */ an(a) ? Object.defineProperty(t, r, {
			enumerable: !0,
			configurable: !0,
			get: () => a.value,
			set: (e) => a.value = e
		}) : t[r] = a, process.env.NODE_ENV !== "production" && n("Inject", r);
	}
}
function Ji(e, t, n) {
	jn(d(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Yi(e, t, n, r) {
	let i = r.includes(".") ? Br(n, r) : () => n[r];
	if (g(e)) {
		let n = t[e];
		h(n) ? Lr(i, n) : process.env.NODE_ENV !== "production" && P(`Invalid watch handler specified by key "${e}"`, n);
	} else if (h(e)) Lr(i, e.bind(n));
	else if (v(e)) if (d(e)) e.forEach((e) => Yi(e, t, n, r));
	else {
		let r = h(e.handler) ? e.handler.bind(n) : t[e.handler];
		h(r) ? Lr(i, r, e) : process.env.NODE_ENV !== "production" && P(`Invalid watch handler specified by key "${e.handler}"`, r);
	}
	else process.env.NODE_ENV !== "production" && P(`Invalid watch option: "${r}"`, e);
}
function Xi(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => Zi(c, e, o, !0)), Zi(c, t, o)), v(t) && a.set(t, c), c;
}
function Zi(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && Zi(e, a, n, !0), i && i.forEach((t) => Zi(e, t, n, !0));
	for (let i in t) if (r && i === "expose") process.env.NODE_ENV !== "production" && P("\"expose\" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.");
	else {
		let r = Qi[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var Qi = {
	data: $i,
	props: ia,
	emits: ia,
	methods: ra,
	computed: ra,
	beforeCreate: na,
	created: na,
	beforeMount: na,
	mounted: na,
	beforeUpdate: na,
	updated: na,
	beforeDestroy: na,
	beforeUnmount: na,
	destroyed: na,
	unmounted: na,
	activated: na,
	deactivated: na,
	errorCaptured: na,
	serverPrefetch: na,
	components: ra,
	directives: ra,
	watch: aa,
	provide: $i,
	inject: ea
};
function $i(e, t) {
	return t ? e ? function() {
		return s(h(e) ? e.call(this, this) : e, h(t) ? t.call(this, this) : t);
	} : t : e;
}
function ea(e, t) {
	return ra(ta(e), ta(t));
}
function ta(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function na(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function ra(e, t) {
	return e ? s(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function ia(e, t) {
	return e ? d(e) && d(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : s(/* @__PURE__ */ Object.create(null), Ui(e), Ui(t ?? {})) : t;
}
function aa(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = s(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = na(e[r], t[r]);
	return n;
}
function oa() {
	return {
		app: null,
		config: {
			isNativeTag: i,
			performance: !1,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var sa = 0;
function ca(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (process.env.NODE_ENV !== "production" && P("root props passed to app.mount() must be an object."), r = null);
		let i = oa(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: sa++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: ws,
			get config() {
				return i.config;
			},
			set config(e) {
				process.env.NODE_ENV !== "production" && P("app.config cannot be replaced. Modify individual options instead.");
			},
			use(e, ...t) {
				return a.has(e) ? process.env.NODE_ENV !== "production" && P("Plugin has already been applied to target app.") : e && h(e.install) ? (a.add(e), e.install(l, ...t)) : h(e) ? (a.add(e), e(l, ...t)) : process.env.NODE_ENV !== "production" && P("A plugin must either be a function or an object with an \"install\" function."), l;
			},
			mixin(e) {
				return i.mixins.includes(e) ? process.env.NODE_ENV !== "production" && P("Mixin has already been applied to target app" + (e.name ? `: ${e.name}` : "")) : i.mixins.push(e), l;
			},
			component(e, t) {
				return process.env.NODE_ENV !== "production" && rs(e, i.config), t ? (process.env.NODE_ENV !== "production" && i.components[e] && P(`Component "${e}" has already been registered in target app.`), i.components[e] = t, l) : i.components[e];
			},
			directive(e, t) {
				return process.env.NODE_ENV !== "production" && Ar(e), t ? (process.env.NODE_ENV !== "production" && i.directives[e] && P(`Directive "${e}" has already been registered in target app.`), i.directives[e] = t, l) : i.directives[e];
			},
			mount(a, o, s) {
				if (c) process.env.NODE_ENV !== "production" && P("App has already been mounted.\nIf you want to remount the same app, move your app creation logic into a factory function and create fresh app instances for each mount - e.g. `const createMyApp = () => createApp(App)`");
				else {
					process.env.NODE_ENV !== "production" && a.__vue_app__ && P("There is already an app instance mounted on the host container.\n If you want to mount another app on the same host container, you need to unmount the previous app by calling `app.unmount()` first.");
					let u = l._ceVNode || z(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), process.env.NODE_ENV !== "production" && (i.reload = () => {
						let t = zo(u);
						t.el = null, e(t, a, s);
					}), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, process.env.NODE_ENV !== "production" && (l._instance = u.component, hr(l, ws)), gs(u.component);
				}
			},
			onUnmount(e) {
				process.env.NODE_ENV !== "production" && typeof e != "function" && P(`Expected function as first argument to app.onUnmount(), but got ${typeof e}`), o.push(e);
			},
			unmount() {
				c ? (jn(o, l._instance, 16), e(null, l._container), process.env.NODE_ENV !== "production" && (l._instance = null, gr(l)), delete l._container.__vue_app__) : process.env.NODE_ENV !== "production" && P("Cannot unmount an app that is not mounted.");
			},
			provide(e, t) {
				return process.env.NODE_ENV !== "production" && e in i.provides && (u(i.provides, e) ? P(`App already provides property with key "${String(e)}". It will be overwritten with the new value.`) : P(`App already provides property with key "${String(e)}" inherited from its parent element. It will be overwritten with the new value.`)), i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = la;
				la = l;
				try {
					return e();
				} finally {
					la = t;
				}
			}
		};
		return l;
	};
}
var la = null, ua = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${O(t)}Modifiers`] || e[`${ne(t)}Modifiers`];
function da(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t;
	if (process.env.NODE_ENV !== "production") {
		let { emitsOptions: t, propsOptions: [i] } = e;
		if (t) if (!(n in t)) (!i || !(ie(O(n)) in i)) && P(`Component emitted event "${n}" but it is neither declared in the emits option nor as an "${ie(O(n))}" prop.`);
		else {
			let e = t[n];
			h(e) && (e(...r) || P(`Invalid event arguments: event validation failed for event "${n}".`));
		}
	}
	let a = r, o = n.startsWith("update:"), s = o && ua(i, n.slice(7));
	if (s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = r.map(ce))), process.env.NODE_ENV !== "production" && Tr(e, n, a), process.env.NODE_ENV !== "production") {
		let t = n.toLowerCase();
		t !== n && i[ie(t)] && P(`Event "${t}" is emitted in component ${bs(e, e.type)} but the handler is registered for "${n}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${ne(n)}" instead of "${n}".`);
	}
	let c, l = i[c = ie(n)] || i[c = ie(O(n))];
	!l && o && (l = i[c = ie(ne(n))]), l && jn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, jn(u, e, 6, a);
	}
}
var fa = /* @__PURE__ */ new WeakMap();
function pa(e, t, n = !1) {
	let r = n ? fa : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, c = !1;
	if (!h(e)) {
		let r = (e) => {
			let n = pa(e, t, !0);
			n && (c = !0, s(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !c ? (v(e) && r.set(e, null), null) : (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o);
}
function ma(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2).replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, ne(t)) || u(e, t));
}
var ha = !1;
function ga() {
	ha = !0;
}
function _a(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [s], slots: c, attrs: l, emit: u, render: d, renderCache: f, props: p, data: m, setupState: h, ctx: g, inheritAttrs: _ } = e, v = Or(e), y, b;
	process.env.NODE_ENV !== "production" && (ha = !1);
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = process.env.NODE_ENV !== "production" && h.__isScriptSetup ? new Proxy(e, { get(e, t, n) {
				return P(`Property '${String(t)}' was accessed via 'this'. Avoid using 'this' in templates.`), Reflect.get(e, t, n);
			} }) : e;
			y = Ho(d.call(t, e, f, process.env.NODE_ENV === "production" ? p : /* @__PURE__ */ Yt(p), h, m, g)), b = l;
		} else {
			let e = t;
			process.env.NODE_ENV !== "production" && l === p && ga(), y = Ho(e.length > 1 ? e(process.env.NODE_ENV === "production" ? p : /* @__PURE__ */ Yt(p), process.env.NODE_ENV === "production" ? {
				attrs: l,
				slots: c,
				emit: u
			} : {
				get attrs() {
					return ga(), /* @__PURE__ */ Yt(l);
				},
				slots: c,
				emit: u
			}) : e(process.env.NODE_ENV === "production" ? p : /* @__PURE__ */ Yt(p), null)), b = t.props ? l : ba(l);
		}
	} catch (t) {
		wo.length = 0, Mn(t, e, 1), y = z(So);
	}
	let x = y, S;
	if (process.env.NODE_ENV !== "production" && y.patchFlag > 0 && y.patchFlag & 2048 && ([x, S] = va(y)), b && _ !== !1) {
		let e = Object.keys(b), { shapeFlag: t } = x;
		if (e.length) {
			if (t & 7) s && e.some(o) && (b = xa(b, s)), x = zo(x, b, !1, !0);
			else if (process.env.NODE_ENV !== "production" && !ha && x.type !== So) {
				let e = Object.keys(l), t = [], n = [];
				for (let r = 0, i = e.length; r < i; r++) {
					let i = e[r];
					a(i) ? o(i) || t.push(i[2].toLowerCase() + i.slice(3)) : n.push(i);
				}
				n.length && P(`Extraneous non-props attributes (${n.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes.`), t.length && P(`Extraneous non-emits event listeners (${t.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option.`);
			}
		}
	}
	return n.dirs && (process.env.NODE_ENV !== "production" && !Sa(x) && P("Runtime directive used on component with non-element root node. The directives will not function as intended."), x = zo(x, null, !1, !0), x.dirs = x.dirs ? x.dirs.concat(n.dirs) : n.dirs), n.transition && (process.env.NODE_ENV !== "production" && !Sa(x) && P("Component inside <Transition> renders non-element root node that cannot be animated."), ni(x, n.transition)), process.env.NODE_ENV !== "production" && S ? S(x) : y = x, Or(v), y;
}
var va = (e) => {
	let t = e.children, n = e.dynamicChildren, r = ya(t, !1);
	if (!r) return [e, void 0];
	if (process.env.NODE_ENV !== "production" && r.patchFlag > 0 && r.patchFlag & 2048) return va(r);
	let i = t.indexOf(r), a = n ? n.indexOf(r) : -1;
	return [Ho(r), (r) => {
		t[i] = r, n && (a > -1 ? n[a] = r : r.patchFlag > 0 && (e.dynamicChildren = [...n, r]));
	}];
};
function ya(e, t = !0) {
	let n;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (jo(i)) {
			if (i.type !== So || i.children === "v-if") {
				if (n) return;
				if (n = i, process.env.NODE_ENV !== "production" && t && n.patchFlag > 0 && n.patchFlag & 2048) return ya(n.children);
			}
		} else return;
	}
	return n;
}
var ba = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, xa = (e, t) => {
	let n = {};
	for (let r in e) (!o(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
}, Sa = (e) => e.shapeFlag & 7 || e.type === So;
function Ca(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (process.env.NODE_ENV !== "production" && (i || s) && Qn || t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? wa(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Ta(o, r, n) && !ma(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? o ? wa(r, o, l) : !0 : !!o;
	return !1;
}
function wa(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (Ta(t, e, a) && !ma(n, a)) return !0;
	}
	return !1;
}
function Ta(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !Ee(r, i) : r !== i;
}
function Ea({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Da = {}, Oa = () => Object.create(Da), ka = (e) => Object.getPrototypeOf(e) === Da;
function Aa(e, t, n, r = !1) {
	let i = {}, a = Oa();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Na(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	process.env.NODE_ENV !== "production" && za(t || {}, i, e), n ? e.props = r ? i : /* @__PURE__ */ qt(i) : e.type.props ? e.props = i : e.props = a, e.attrs = a;
}
function ja(e) {
	for (; e;) {
		if (e.type.__hmrId) return !0;
		e = e.parent;
	}
}
function Ma(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ N(i), [c] = e.propsOptions, l = !1;
	if (!(process.env.NODE_ENV !== "production" && ja(e)) && (r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (ma(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
				else {
					let t = O(o);
					i[t] = Pa(c, s, t, d, e, !1);
				}
				else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		Na(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !u(t, a) && ((r = ne(a)) === a || !u(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Pa(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !u(t, e)) && (delete a[e], l = !0);
	}
	l && lt(e.attrs, "set", ""), process.env.NODE_ENV !== "production" && za(t || {}, i, e);
}
function Na(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (T(t)) continue;
		let l = n[t], d;
		a && u(a, d = O(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : ma(e.emitsOptions, t) || (!(t in i) || l !== i[t]) && (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ N(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = Pa(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function Pa(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = u(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && h(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = es(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === ne(n)) && (r = !0));
	}
	return r;
}
var Fa = /* @__PURE__ */ new WeakMap();
function Ia(e, r, i = !1) {
	let a = i ? Fa : r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [], p = !1;
	if (!h(e)) {
		let t = (e) => {
			p = !0;
			let [t, n] = Ia(e, r, !0);
			s(l, t), n && f.push(...n);
		};
		!i && r.mixins.length && r.mixins.forEach(t), e.extends && t(e.extends), e.mixins && e.mixins.forEach(t);
	}
	if (!c && !p) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		process.env.NODE_ENV !== "production" && !g(c[e]) && P("props must be strings when using array syntax.", c[e]);
		let n = O(c[e]);
		La(n) && (l[n] = t);
	}
	else if (c) {
		process.env.NODE_ENV !== "production" && !v(c) && P("invalid props options", c);
		for (let e in c) {
			let t = O(e);
			if (La(t)) {
				let n = c[e], r = l[t] = d(n) || h(n) ? { type: n } : s({}, n), i = r.type, a = !1, o = !0;
				if (d(i)) for (let e = 0; e < i.length; ++e) {
					let t = i[e], n = h(t) && t.name;
					if (n === "Boolean") {
						a = !0;
						break;
					} else n === "String" && (o = !1);
				}
				else a = h(i) && i.name === "Boolean";
				r[0] = a, r[1] = o, (a || u(r, "default")) && f.push(t);
			}
		}
	}
	let m = [l, f];
	return v(e) && a.set(e, m), m;
}
function La(e) {
	return e[0] !== "$" && !T(e) ? !0 : (process.env.NODE_ENV !== "production" && P(`Invalid prop name: "${e}" is a reserved property.`), !1);
}
function Ra(e) {
	return e === null ? "null" : typeof e == "function" ? e.name || "" : typeof e == "object" && e.constructor && e.constructor.name || "";
}
function za(e, t, n) {
	let r = /* @__PURE__ */ N(t), i = n.propsOptions[0], a = Object.keys(e).map((e) => O(e));
	for (let e in i) {
		let t = i[e];
		t != null && Ba(e, r[e], t, process.env.NODE_ENV === "production" ? r : /* @__PURE__ */ Yt(r), !a.includes(e));
	}
}
function Ba(e, t, n, r, i) {
	let { type: a, required: o, validator: s, skipCheck: c } = n;
	if (o && i) {
		P("Missing required prop: \"" + e + "\"");
		return;
	}
	if (!(t == null && !o)) {
		if (a != null && a !== !0 && !c) {
			let n = !1, r = d(a) ? a : [a], i = [];
			for (let e = 0; e < r.length && !n; e++) {
				let { valid: a, expectedType: o } = Ha(t, r[e]);
				i.push(o || ""), n = a;
			}
			if (!n) {
				P(Ua(e, t, i));
				return;
			}
		}
		s && !s(t, r) && P("Invalid prop: custom validator check failed for prop \"" + e + "\".");
	}
}
var Va = /* @__PURE__ */ e("String,Number,Boolean,Function,Symbol,BigInt");
function Ha(e, t) {
	let n, r = Ra(t);
	if (r === "null") n = e === null;
	else if (Va(r)) {
		let i = typeof e;
		n = i === r.toLowerCase(), !n && i === "object" && (n = e instanceof t);
	} else n = r === "Object" ? v(e) : r === "Array" ? d(e) : e instanceof t;
	return {
		valid: n,
		expectedType: r
	};
}
function Ua(e, t, n) {
	if (n.length === 0) return `Prop type [] for prop "${e}" won't match anything. Did you mean to use type Array instead?`;
	let r = `Invalid prop: type check failed for prop "${e}". Expected ${n.map(re).join(" | ")}`, i = n[0], a = S(t), o = Wa(t, i), s = Wa(t, a);
	return n.length === 1 && Ga(i) && Ka(i, a) && (r += ` with value ${o}`), r += `, got ${a} `, Ga(a) && (r += `with value ${s}.`), r;
}
function Wa(e, t) {
	return _(e) ? e.toString() : t === "String" ? `"${e}"` : t === "Number" ? `${Number(e)}` : `${e}`;
}
function Ga(e) {
	return [
		"string",
		"number",
		"boolean"
	].some((t) => e.toLowerCase() === t);
}
function Ka(...e) {
	return e.every((e) => {
		let t = e.toLowerCase();
		return t !== "boolean" && t !== "symbol";
	});
}
var qa = (e) => e === "_" || e === "_ctx" || e === "$stable", Ja = (e) => d(e) ? e.map(Ho) : [Ho(e)], Ya = (e, t, n) => {
	if (t._n) return t;
	let r = kr((...r) => (process.env.NODE_ENV !== "production" && Xo && !(n === null && Er) && !(n && n.root !== Xo.root) && P(`Slot "${e}" invoked outside of the render function: this will not track dependencies used in the slot. Invoke the slot function inside the render function instead.`), Ja(t(...r))), n);
	return r._c = !1, r;
}, Xa = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (qa(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = Ya(n, i, r);
		else if (i != null) {
			process.env.NODE_ENV !== "production" && P(`Non-function value encountered for slot "${n}". Prefer function slots for better performance.`);
			let e = Ja(i);
			t[n] = () => e;
		}
	}
}, Za = (e, t) => {
	process.env.NODE_ENV !== "production" && !di(e.vnode) && P("Non-function value encountered for default slot. Prefer function slots for better performance.");
	let n = Ja(t);
	e.slots.default = () => n;
}, Qa = (e, t, n) => {
	for (let r in t) (n || !qa(r)) && (e[r] = t[r]);
}, $a = (e, t, n) => {
	let r = e.slots = Oa();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Qa(r, t, n), n && se(r, "_", e, !0)) : Xa(t, r);
	} else t && Za(e, t);
}, eo = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let t = n._;
		t ? process.env.NODE_ENV !== "production" && Qn ? (Qa(a, n, r), lt(e, "set", "$slots")) : r && t === 1 ? o = !1 : Qa(a, n, r) : (o = !n.$stable, Xa(n, a)), s = n;
	} else n && (Za(e, n), s = { default: 1 });
	if (o) for (let e in a) !qa(e) && s[e] == null && delete a[e];
}, to, no;
function ro(e, t) {
	e.appContext.config.performance && ao() && no.mark(`vue-${t}-${e.uid}`), process.env.NODE_ENV !== "production" && Sr(e, t, ao() ? no.now() : Date.now());
}
function io(e, t) {
	if (e.appContext.config.performance && ao()) {
		let n = `vue-${t}-${e.uid}`, r = n + ":end", i = `<${bs(e, e.type)}> ${t}`;
		no.mark(r), no.measure(i, n, r), no.clearMeasures(i), no.clearMarks(n), no.clearMarks(r);
	}
	process.env.NODE_ENV !== "production" && Cr(e, t, ao() ? no.now() : Date.now());
}
function ao() {
	return to === void 0 && (typeof window < "u" && window.performance ? (to = !0, no = window.performance) : to = !1), to;
}
function oo() {
	let e = [];
	if (process.env.NODE_ENV !== "production" && e.length) {
		let t = e.length > 1;
		console.warn(`Feature flag${t ? "s" : ""} ${e.join(", ")} ${t ? "are" : "is"} not explicitly defined. You are running the esm-bundler build of Vue, which expects these compile-time feature flags to be globally injected via the bundler config in order to get better tree-shaking in the production bundle.

For more details, see https://link.vuejs.org/feature-flags.`);
	}
}
var so = bo;
function co(e) {
	return lo(e);
}
function lo(e, i) {
	oo();
	let a = de();
	a.__VUE__ = !0, process.env.NODE_ENV !== "production" && mr(a.__VUE_DEVTOOLS_GLOBAL_HOOK__, a);
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = process.env.NODE_ENV !== "production" && Qn ? !1 : !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Mo(e, t) && (r = be(e), A(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case xo:
				y(e, t, n, r);
				break;
			case So:
				b(e, t, n, r);
				break;
			case Co:
				e == null ? x(t, n, r, o) : process.env.NODE_ENV !== "production" && S(e, t, n, o);
				break;
			case F:
				ie(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? E(e, t, n, r, i, a, o, s, c) : d & 6 ? ae(e, t, n, r, i, a, o, s, c) : d & 64 || d & 128 ? l.process(e, t, n, r, i, a, o, s, c, Ce) : process.env.NODE_ENV !== "production" && P("Invalid VNode type:", l, `(${typeof l})`);
		}
		u != null && i ? ci(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && ci(e.ref, null, a, e, !0);
	}, y = (e, t, n, r) => {
		if (e == null) o(t.el = u(t.children), n, r);
		else {
			let n = t.el = e.el;
			t.children !== e.children && f(n, t.children);
		}
	}, b = (e, t, n, r) => {
		e == null ? o(t.el = d(t.children || ""), n, r) : t.el = e.el;
	}, x = (e, t, n, r) => {
		[e.el, e.anchor] = _(e.children, t, n, r, e.el, e.anchor);
	}, S = (e, t, n, r) => {
		if (t.children !== e.children) {
			let i = h(e.anchor);
			w(e), [t.el, t.anchor] = _(t.children, n, i, r);
		} else t.el = e.el, t.anchor = e.anchor;
	}, C = ({ el: e, anchor: t }, n, r) => {
		let i;
		for (; e && e !== t;) i = h(e), o(e, n, r), e = i;
		o(t, n, r);
	}, w = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, E = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) D(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), te(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, D = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && O(e.children, d, null, r, i, uo(e, a), s, u), _ && Mr(e, null, r, "created"), ee(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !T(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && Ko(f, r, e);
		}
		process.env.NODE_ENV !== "production" && (se(d, "__vnode", e, !0), se(d, "__vueParentComponent", r, !0)), _ && Mr(e, null, r, "beforeMount");
		let v = po(i, g);
		if (v && g.beforeEnter(d), o(d, t, n), (f = m && m.onVnodeMounted) || v || _) {
			let t = process.env.NODE_ENV !== "production" && Qn;
			so(() => {
				let n;
				process.env.NODE_ENV !== "production" && (n = $n(t));
				try {
					f && Ko(f, r, e), v && g.enter(d), _ && Mr(e, null, r, "mounted");
				} finally {
					process.env.NODE_ENV !== "production" && $n(n);
				}
			}, i);
		}
	}, ee = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (process.env.NODE_ENV !== "production" && n.patchFlag > 0 && n.patchFlag & 2048 && (n = ya(n.children) || n), t === n || yo(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ee(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, O = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) v(null, e[l] = s ? Uo(e[l]) : Ho(e[l]), t, n, r, i, a, o, s);
	}, te = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el;
		process.env.NODE_ENV !== "production" && (l.__vnode = n);
		let { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && fo(r, !1), (g = h.onVnodeBeforeUpdate) && Ko(g, r, n, e), f && Mr(n, e, r, "beforeUpdate"), r && fo(r, !0), process.env.NODE_ENV !== "production" && Qn && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? (ne(e.dynamicChildren, d, l, r, i, uo(n, a), o), process.env.NODE_ENV !== "production" && mo(e, n)) : s || fe(e, n, l, null, r, i, uo(n, a), o, !1), u > 0) {
			if (u & 16) re(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && re(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && so(() => {
			g && Ko(g, r, n, e), f && Mr(n, e, r, "updated");
		}, i);
	}, ne = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s];
			v(c, l, c.el && (c.type === F || !Mo(c, l) || c.shapeFlag & 198) ? m(c.el) : n, null, r, i, a, o, !0);
		}
	}, re = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !T(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (T(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, ie = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		process.env.NODE_ENV !== "production" && (Qn || p & 2048) && (p = 0, l = !1, m = null), h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), O(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (ne(e.dynamicChildren, m, n, i, a, s, c), process.env.NODE_ENV === "production" ? (t.key != null || i && t === i.subTree) && mo(e, t, !0) : mo(e, t)) : fe(e, t, n, f, i, a, s, c, l);
	}, ae = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ce(t, n, r, i, a, o, c) : le(e, t, c);
	}, ce = (e, t, n, r, i, a, o) => {
		let s = e.component = Yo(e, r, i);
		if (process.env.NODE_ENV !== "production" && s.type.__hmrId && nr(s), process.env.NODE_ENV !== "production" && (xn(e), ro(s, "mount")), di(e) && (s.ctx.renderer = Ce), process.env.NODE_ENV !== "production" && ro(s, "init"), os(s, !1, o), process.env.NODE_ENV !== "production" && io(s, "init"), process.env.NODE_ENV !== "production" && Qn && (e.el = null), s.asyncDep) {
			if (i && i.registerDep(s, ue, o), !e.el) {
				let r = s.subTree = z(So);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ue(s, e, t, n, i, a, o);
		process.env.NODE_ENV !== "production" && (Sn(), io(s, "mount"));
	}, le = (e, t, n) => {
		let r = t.component = e.component;
		if (Ca(e, t, n)) if (r.asyncDep && !r.asyncResolved) {
			process.env.NODE_ENV !== "production" && xn(t), k(r, t, n), process.env.NODE_ENV !== "production" && Sn();
			return;
		} else r.next = t, r.update();
		else t.el = e.el, r.vnode = t;
	}, ue = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = go(e);
					if (n) {
						t && (t.el = c.el, k(e, t, o)), n.asyncDep.then(() => {
							so(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				process.env.NODE_ENV !== "production" && xn(t || e.vnode), fo(e, !1), t ? (t.el = c.el, k(e, t, o)) : t = c, n && oe(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Ko(d, s, t, c), fo(e, !0), process.env.NODE_ENV !== "production" && ro(e, "render");
				let f = _a(e);
				process.env.NODE_ENV !== "production" && io(e, "render");
				let p = e.subTree;
				e.subTree = f, process.env.NODE_ENV !== "production" && ro(e, "patch"), v(p, f, m(p.el), be(p), e, i, a), process.env.NODE_ENV !== "production" && io(e, "patch"), t.el = f.el, u === null && Ea(e, f.el), r && so(r, i), (d = t.props && t.props.onVnodeUpdated) && so(() => Ko(d, s, t, c), i), process.env.NODE_ENV !== "production" && vr(e), process.env.NODE_ENV !== "production" && Sn();
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = ui(t);
				if (fo(e, !1), l && oe(l), !m && (o = c && c.onVnodeBeforeMount) && Ko(o, d, t), fo(e, !0), s && Te) {
					let t = () => {
						process.env.NODE_ENV !== "production" && ro(e, "render"), e.subTree = _a(e), process.env.NODE_ENV !== "production" && io(e, "render"), process.env.NODE_ENV !== "production" && ro(e, "hydrate"), Te(s, e.subTree, e, i, null), process.env.NODE_ENV !== "production" && io(e, "hydrate");
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0), process.env.NODE_ENV !== "production" && ro(e, "render");
					let o = e.subTree = _a(e);
					process.env.NODE_ENV !== "production" && io(e, "render"), process.env.NODE_ENV !== "production" && ro(e, "patch"), v(null, o, n, r, e, i, a), process.env.NODE_ENV !== "production" && io(e, "patch"), t.el = o.el;
				}
				if (u && so(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					so(() => Ko(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && ui(d.vnode) && d.vnode.shapeFlag & 256) && e.a && so(e.a, i), e.isMounted = !0, process.env.NODE_ENV !== "production" && _r(e), t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Ie(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Wn(u), fo(e, !0), process.env.NODE_ENV !== "production" && (c.onTrack = e.rtc ? (t) => oe(e.rtc, t) : void 0, c.onTrigger = e.rtg ? (t) => oe(e.rtg, t) : void 0), l();
	}, k = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Ma(e, t.props, r, n), eo(e, t.children, n), Ze(), qn(e), Qe();
	}, fe = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				me(l, d, n, r, i, a, o, s, c);
				return;
			} else if (f & 256) {
				pe(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && ye(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? me(l, d, n, r, i, a, o, s, c) : ye(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && O(d, n, r, i, a, o, s, c));
	}, pe = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p;
		for (p = 0; p < f; p++) {
			let n = t[p] = l ? Uo(t[p]) : Ho(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? ye(e, a, o, !0, !1, f) : O(t, r, i, a, o, s, c, l, f);
	}, me = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? Uo(t[u]) : Ho(t[u]);
			if (Mo(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? Uo(t[p]) : Ho(t[p]);
			if (Mo(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? Uo(t[u]) : Ho(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) A(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? Uo(t[u]) : Ho(t[u]);
				e.key != null && (process.env.NODE_ENV !== "production" && g.has(e.key) && P("Duplicate keys found during update:", JSON.stringify(e.key), "Make sure keys are unique."), g.set(e.key, u));
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					A(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Mo(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? A(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? ho(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || vo(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? he(n, r, p, 2) : _--);
			}
		}
	}, he = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			he(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, Ce);
			return;
		}
		if (c === F) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) he(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === Co) {
			C(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) if (r === 0) l.persisted && !a[ti] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), so(() => l.enter(a), i));
		else {
			let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
				e.ctx.isUnmounted ? s(a) : o(a, t, n);
			}, d = () => {
				let e = a._isLeaving || !!a[ti];
				a._isLeaving && a[ti](!0), l.persisted && !e ? u() : r(a, () => {
					u(), c && c();
				});
			};
			i ? i(a, u, d) : d();
		}
		else o(a, t, n);
	}, A = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (Ze(), ci(s, null, n, e, !0), Qe()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !ui(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Ko(_, t, e), u & 6) ve(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Mr(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, Ce, r) : l && !l.hasOnce && (a !== F || d > 0 && d & 64) ? ye(l, t, n, !1, !0) : (a === F && d & 384 || !i && u & 16) && ye(c, t, n), r && ge(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && so(() => {
			_ && Ko(_, t, e), h && Mr(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, ge = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === F) {
			process.env.NODE_ENV !== "production" && e.patchFlag > 0 && e.patchFlag & 2048 && i && !i.persisted ? e.children.forEach((e) => {
				e.type === So ? s(e.el) : ge(e);
			}) : _e(n, r);
			return;
		}
		if (t === Co) {
			w(e);
			return;
		}
		let a = () => {
			s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (e.shapeFlag & 1 && i && !i.persisted) {
			let { leave: t, delayLeave: r } = i, o = () => t(n, a);
			r ? r(e.el, a, o) : o();
		} else a();
	}, _e = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, ve = (e, t, n) => {
		process.env.NODE_ENV !== "production" && e.type.__hmrId && rr(e);
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		_o(c), _o(l), r && oe(r), i.stop(), a && (a.flags |= 8, A(o, e, t, n)), s && so(s, t), so(() => {
			e.isUnmounted = !0;
		}, t), process.env.NODE_ENV !== "production" && br(e);
	}, ye = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) A(e[o], t, n, r, i);
	}, be = (e) => {
		if (e.shapeFlag & 6) return be(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Hr];
		return n ? h(n) : t;
	}, xe = !1, Se = (e, t, n) => {
		let r;
		e == null ? t._vnode && (A(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, xe ||= (xe = !0, qn(r), Jn(), !1);
	}, Ce = {
		p: v,
		um: A,
		m: he,
		r: ge,
		mt: ce,
		mc: O,
		pc: fe,
		pbc: ne,
		n: be,
		o: e
	}, we, Te;
	return i && ([we, Te] = i(Ce)), {
		render: Se,
		hydrate: we,
		createApp: ca(Se, we)
	};
}
function uo({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function fo({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function po(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function mo(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Uo(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && mo(t, a)), a.type === xo && (a.patchFlag === -1 && (a = i[e] = Uo(a)), a.el = t.el), a.type === So && !a.el && (a.el = t.el), process.env.NODE_ENV !== "production" && a.el && (a.el.__vnode = a);
	}
}
function ho(e) {
	let t = e.slice(), n = [0], r, i, a, o, s, c = e.length;
	for (r = 0; r < c; r++) {
		let c = e[r];
		if (c !== 0) {
			if (i = n[n.length - 1], e[i] < c) {
				t[r] = i, n.push(r);
				continue;
			}
			for (a = 0, o = n.length - 1; a < o;) s = a + o >> 1, e[n[s]] < c ? a = s + 1 : o = s;
			c < e[n[a]] && (a > 0 && (t[r] = n[a - 1]), n[a] = r);
		}
	}
	for (a = n.length, o = n[a - 1]; a-- > 0;) n[a] = o, o = t[o];
	return n;
}
function go(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : go(t);
}
function _o(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function vo(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? vo(t.subTree) : null;
}
var yo = (e) => e.__isSuspense;
function bo(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : Kn(e);
}
var F = /* @__PURE__ */ Symbol.for("v-fgt"), xo = /* @__PURE__ */ Symbol.for("v-txt"), So = /* @__PURE__ */ Symbol.for("v-cmt"), Co = /* @__PURE__ */ Symbol.for("v-stc"), wo = [], To = null;
function I(e = !1) {
	wo.push(To = e ? null : []);
}
function Eo() {
	wo.pop(), To = wo[wo.length - 1] || null;
}
var Do = 1;
function Oo(e, t = !1) {
	Do += e, e < 0 && To && t && (To.hasOnce = !0);
}
function ko(e) {
	return e.dynamicChildren = Do > 0 ? To || n : null, Eo(), Do > 0 && To && To.push(e), e;
}
function L(e, t, n, r, i, a) {
	return ko(R(e, t, n, r, i, a, !0));
}
function Ao(e, t, n, r, i) {
	return ko(z(e, t, n, r, i, !0));
}
function jo(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Mo(e, t) {
	if (process.env.NODE_ENV !== "production" && t.shapeFlag & 6 && e.component) {
		let n = er.get(t.type);
		if (n && n.has(e.component)) return e.shapeFlag &= -257, t.shapeFlag &= -513, !1;
	}
	return e.type === t.type && e.key === t.key;
}
var No, Po = (...e) => Lo(...No ? No(e, Er) : e), Fo = ({ key: e }) => e ?? null, Io = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ an(e) || h(e) ? {
	i: Er,
	r: e,
	k: t,
	f: !!n
} : e);
function R(e, t = null, n = null, r = 0, i = null, a = e === F ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Fo(t),
		ref: t && Io(t),
		scopeId: Dr,
		slotScopeIds: null,
		children: n,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag: a,
		patchFlag: r,
		dynamicProps: i,
		dynamicChildren: null,
		appContext: null,
		ctx: Er
	};
	return s ? (Wo(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), process.env.NODE_ENV !== "production" && c.key !== c.key && P("VNode created with invalid key (NaN). VNode type:", c.type), Do > 0 && !o && To && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && To.push(c), c;
}
var z = process.env.NODE_ENV === "production" ? Lo : Po;
function Lo(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Ai) && (process.env.NODE_ENV !== "production" && !e && P(`Invalid vnode type when creating vnode: ${e}.`), e = So), jo(e)) {
		let r = zo(e, t, !0);
		return n && Wo(r, n), Do > 0 && !a && To && (r.shapeFlag & 6 ? To[To.indexOf(e)] = r : To.push(r)), r.patchFlag = -2, r;
	}
	if (xs(e) && (e = e.__vccOpts), t) {
		t = Ro(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = A(e)), v(n) && (/* @__PURE__ */ en(n) && !d(n) && (n = s({}, n)), t.style = k(n));
	}
	let o = g(e) ? 1 : yo(e) ? 128 : Ur(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return process.env.NODE_ENV !== "production" && o & 4 && /* @__PURE__ */ en(e) && (e = /* @__PURE__ */ N(e), P("Vue received a Component that was made a reactive object. This can lead to unnecessary performance overhead and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.", "\nComponent that was made reactive: ", e)), R(e, t, n, r, i, o, a, !0);
}
function Ro(e) {
	return e ? /* @__PURE__ */ en(e) || ka(e) ? s({}, e) : e : null;
}
function zo(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Go(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Fo(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(Io(t)) : [a, Io(t)] : Io(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: process.env.NODE_ENV !== "production" && o === -1 && d(s) ? s.map(Bo) : s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== F ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && zo(e.ssContent),
		ssFallback: e.ssFallback && zo(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce
	};
	return c && r && ni(u, c.clone(u)), u;
}
function Bo(e) {
	let t = zo(e);
	return d(e.children) && (t.children = e.children.map(Bo)), t;
}
function Vo(e = " ", t = 0) {
	return z(xo, null, e, t);
}
function B(e = "", t = !1) {
	return t ? (I(), Ao(So, null, e)) : z(So, null, e);
}
function Ho(e) {
	return e == null || typeof e == "boolean" ? z(So) : d(e) ? z(F, null, e.slice()) : jo(e) ? Uo(e) : z(xo, null, String(e));
}
function Uo(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : zo(e);
}
function Wo(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") if (r & 65) {
		let n = t.default;
		n && (n._c && (n._d = !1), Wo(e, n()), n._c && (n._d = !0));
		return;
	} else {
		n = 32;
		let r = t._;
		!r && !ka(t) ? t._ctx = Er : r === 3 && Er && (Er.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
	}
	else h(t) ? (t = {
		default: t,
		_ctx: Er
	}, n = 32) : (t = String(t), r & 64 ? (n = 16, t = [Vo(t)]) : n = 8);
	e.children = t, e.shapeFlag |= n;
}
function Go(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = A([t.class, r.class]));
		else if (e === "style") t.style = k([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Ko(e, t, n, r = null) {
	jn(e, t, 7, [n, r]);
}
var qo = oa(), Jo = 0;
function Yo(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || qo, o = {
		uid: Jo++,
		vnode: e,
		type: i,
		parent: n,
		appContext: a,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new Ne(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: n ? n.provides : Object.create(a.provides),
		ids: n ? n.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: Ia(i, a),
		emitsOptions: pa(i, a),
		emit: null,
		emitted: null,
		propsDefaults: t,
		inheritAttrs: i.inheritAttrs,
		ctx: t,
		data: t,
		props: t,
		attrs: t,
		slots: t,
		refs: t,
		setupState: t,
		setupContext: null,
		suspense: r,
		suspenseId: r ? r.pendingId : 0,
		asyncDep: null,
		asyncResolved: !1,
		isMounted: !1,
		isUnmounted: !1,
		isDeactivated: !1,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	return process.env.NODE_ENV === "production" ? o.ctx = { _: o } : o.ctx = Bi(o), o.root = n ? n.root : o, o.emit = da.bind(null, o), e.ce && e.ce(o), o;
}
var Xo = null, Zo = () => Xo || Er, Qo, $o;
{
	let e = de(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Qo = t("__VUE_INSTANCE_SETTERS__", (e) => Xo = e), $o = t("__VUE_SSR_SETTERS__", (e) => as = e);
}
var es = (e) => {
	let t = Xo;
	return Qo(e), e.scope.on(), () => {
		e.scope.off(), Qo(t);
	};
}, ts = () => {
	Xo && Xo.scope.off(), Qo(null);
}, ns = /* @__PURE__ */ e("slot,component");
function rs(e, { isNativeTag: t }) {
	(ns(e) || t(e)) && P("Do not use built-in or reserved HTML elements as component id: " + e);
}
function is(e) {
	return e.vnode.shapeFlag & 4;
}
var as = !1;
function os(e, t = !1, n = !1) {
	t && $o(t);
	let { props: r, children: i } = e.vnode, a = is(e);
	Aa(e, r, a, t), $a(e, i, n || t);
	let o = a ? ss(e, t) : void 0;
	return t && $o(!1), o;
}
function ss(e, t) {
	let n = e.type;
	if (process.env.NODE_ENV !== "production") {
		if (n.name && rs(n.name, e.appContext.config), n.components) {
			let t = Object.keys(n.components);
			for (let n = 0; n < t.length; n++) rs(t[n], e.appContext.config);
		}
		if (n.directives) {
			let e = Object.keys(n.directives);
			for (let t = 0; t < e.length; t++) Ar(e[t]);
		}
		n.compilerOptions && ds() && P("\"compilerOptions\" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.");
	}
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, zi), process.env.NODE_ENV !== "production" && Vi(e);
	let { setup: r } = n;
	if (r) {
		Ze();
		let i = e.setupContext = r.length > 1 ? hs(e) : null, a = es(e), o = An(r, e, 0, [process.env.NODE_ENV === "production" ? e.props : /* @__PURE__ */ Yt(e.props), i]), s = y(o);
		if (Qe(), a(), (s || e.sp) && !ui(e) && ii(e), s) {
			if (o.then(ts, ts), t) return o.then((n) => {
				cs(e, n, t);
			}).catch((t) => {
				Mn(t, e, 0);
			});
			e.asyncDep = o, process.env.NODE_ENV !== "production" && !e.suspense && P(`Component <${bs(e, n)}>: setup function returned a promise, but no <Suspense> boundary was found in the parent component tree. A component with async setup() must be nested in a <Suspense> in order to be rendered.`);
		} else cs(e, o, t);
	} else fs(e, t);
}
function cs(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) ? (process.env.NODE_ENV !== "production" && jo(t) && P("setup() should not return VNodes directly - return a render function instead."), process.env.NODE_ENV !== "production" && (e.devtoolsRawSetupState = t), e.setupState = dn(t), process.env.NODE_ENV !== "production" && Hi(e)) : process.env.NODE_ENV !== "production" && t !== void 0 && P(`setup() should return an object. Received: ${t === null ? "null" : typeof t}`), fs(e, n);
}
var ls, us, ds = () => !ls;
function fs(e, t, n) {
	let i = e.type;
	if (!e.render) {
		if (!t && ls && !i.render) {
			let t = i.template || Xi(e).template;
			if (t) {
				process.env.NODE_ENV !== "production" && ro(e, "compile");
				let { isCustomElement: n, compilerOptions: r } = e.appContext.config, { delimiters: a, compilerOptions: o } = i;
				i.render = ls(t, s(s({
					isCustomElement: n,
					delimiters: a
				}, r), o)), process.env.NODE_ENV !== "production" && io(e, "compile");
			}
		}
		e.render = i.render || r, us && us(e);
	}
	{
		let t = es(e);
		Ze();
		try {
			Ki(e);
		} finally {
			Qe(), t();
		}
	}
	process.env.NODE_ENV !== "production" && !i.render && e.render === r && !t && (!ls && i.template ? P("Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias \"vue\" to \"vue/dist/vue.esm-bundler.js\".") : P("Component is missing template or render function: ", i));
}
var ps = process.env.NODE_ENV === "production" ? { get(e, t) {
	return ct(e, "get", ""), e[t];
} } : {
	get(e, t) {
		return ga(), ct(e, "get", ""), e[t];
	},
	set() {
		return P("setupContext.attrs is readonly."), !1;
	},
	deleteProperty() {
		return P("setupContext.attrs is readonly."), !1;
	}
};
function ms(e) {
	return new Proxy(e.slots, { get(t, n) {
		return ct(e, "get", "$slots"), t[n];
	} });
}
function hs(e) {
	let t = (t) => {
		if (process.env.NODE_ENV !== "production" && (e.exposed && P("expose() should be called only once per setup()."), t != null)) {
			let e = typeof t;
			e === "object" && (d(t) ? e = "array" : /* @__PURE__ */ an(t) && (e = "ref")), e !== "object" && P(`expose() should be passed a plain object, received ${e}.`);
		}
		e.exposed = t || {};
	};
	if (process.env.NODE_ENV !== "production") {
		let n, r;
		return Object.freeze({
			get attrs() {
				return n ||= new Proxy(e.attrs, ps);
			},
			get slots() {
				return r ||= ms(e);
			},
			get emit() {
				return (t, ...n) => e.emit(t, ...n);
			},
			expose: t
		});
	} else return {
		attrs: new Proxy(e.attrs, ps),
		slots: e.slots,
		emit: e.emit,
		expose: t
	};
}
function gs(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(dn(tn(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Ii) return Ii[n](e);
		},
		has(e, t) {
			return t in e || t in Ii;
		}
	}) : e.proxy;
}
var _s = /(?:^|[-_])\w/g, vs = (e) => e.replace(_s, (e) => e.toUpperCase()).replace(/[-_]/g, "");
function ys(e, t = !0) {
	return h(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function bs(e, t, n = !1) {
	let r = ys(t);
	if (!r && t.__file) {
		let e = t.__file.match(/([^/\\]+)\.\w+$/);
		e && (r = e[1]);
	}
	if (!r && e) {
		let n = (e) => {
			for (let n in e) if (e[n] === t) return n;
		};
		r = n(e.components) || e.parent && n(e.parent.type.components) || n(e.appContext.components);
	}
	return r ? vs(r) : n ? "App" : "Anonymous";
}
function xs(e) {
	return h(e) && "__vccOpts" in e;
}
var Ss = (e, t) => {
	let n = /* @__PURE__ */ pn(e, t, as);
	if (process.env.NODE_ENV !== "production") {
		let e = Zo();
		e && e.appContext.config.warnRecursiveComputed && (n._warnRecursive = !0);
	}
	return n;
};
function Cs() {
	if (process.env.NODE_ENV === "production" || typeof window > "u") return;
	let e = { style: "color:#3ba776" }, n = { style: "color:#1677ff" }, r = { style: "color:#f5222d" }, i = { style: "color:#eb2f96" }, a = {
		__vue_custom_formatter: !0,
		header(t) {
			if (!v(t)) return null;
			if (t.__isVue) return [
				"div",
				e,
				"VueInstance"
			];
			if (/* @__PURE__ */ an(t)) {
				Ze();
				let n = t.value;
				return Qe(), [
					"div",
					{},
					[
						"span",
						e,
						p(t)
					],
					"<",
					l(n),
					">"
				];
			} else if (/* @__PURE__ */ Zt(t)) return [
				"div",
				{},
				[
					"span",
					e,
					/* @__PURE__ */ $t(t) ? "ShallowReactive" : "Reactive"
				],
				"<",
				l(t),
				`>${/* @__PURE__ */ Qt(t) ? " (readonly)" : ""}`
			];
			else if (/* @__PURE__ */ Qt(t)) return [
				"div",
				{},
				[
					"span",
					e,
					/* @__PURE__ */ $t(t) ? "ShallowReadonly" : "Readonly"
				],
				"<",
				l(t),
				">"
			];
			return null;
		},
		hasBody(e) {
			return e && e.__isVue;
		},
		body(e) {
			if (e && e.__isVue) return [
				"div",
				{},
				...o(e.$)
			];
		}
	};
	function o(e) {
		let n = [];
		e.type.props && e.props && n.push(c("props", /* @__PURE__ */ N(e.props))), e.setupState !== t && n.push(c("setup", e.setupState)), e.data !== t && n.push(c("data", /* @__PURE__ */ N(e.data)));
		let r = u(e, "computed");
		r && n.push(c("computed", r));
		let a = u(e, "inject");
		return a && n.push(c("injected", a)), n.push([
			"div",
			{},
			[
				"span",
				{ style: i.style + ";opacity:0.66" },
				"$ (internal): "
			],
			["object", { object: e }]
		]), n;
	}
	function c(e, t) {
		return t = s({}, t), Object.keys(t).length ? [
			"div",
			{ style: "line-height:1.25em;margin-bottom:0.6em" },
			[
				"div",
				{ style: "color:#476582" },
				e
			],
			[
				"div",
				{ style: "padding-left:1.25em" },
				...Object.keys(t).map((e) => [
					"div",
					{},
					[
						"span",
						i,
						e + ": "
					],
					l(t[e], !1)
				])
			]
		] : ["span", {}];
	}
	function l(e, t = !0) {
		return typeof e == "number" ? [
			"span",
			n,
			e
		] : typeof e == "string" ? [
			"span",
			r,
			JSON.stringify(e)
		] : typeof e == "boolean" ? [
			"span",
			i,
			e
		] : v(e) ? ["object", { object: t ? /* @__PURE__ */ N(e) : e }] : [
			"span",
			r,
			String(e)
		];
	}
	function u(e, t) {
		let n = e.type;
		if (h(n)) return;
		let r = {};
		for (let i in e.ctx) f(n, i, t) && (r[i] = e.ctx[i]);
		return r;
	}
	function f(e, t, n) {
		let r = e[n];
		if (d(r) && r.includes(t) || v(r) && t in r || e.extends && f(e.extends, t, n) || e.mixins && e.mixins.some((e) => f(e, t, n))) return !0;
	}
	function p(e) {
		return /* @__PURE__ */ $t(e) ? "ShallowRef" : e.effect ? "ComputedRef" : "Ref";
	}
	window.devtoolsFormatters ? window.devtoolsFormatters.push(a) : window.devtoolsFormatters = [a];
}
var ws = "3.5.35", Ts = process.env.NODE_ENV === "production" ? r : P;
process.env.NODE_ENV, process.env.NODE_ENV;
//#endregion
//#region node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
var Es = void 0, Ds = typeof window < "u" && window.trustedTypes;
if (Ds) try {
	Es = /* @__PURE__ */ Ds.createPolicy("vue", { createHTML: (e) => e });
} catch (e) {
	process.env.NODE_ENV !== "production" && Ts(`Error creating trusted types policy: ${e}`);
}
var Os = Es ? (e) => Es.createHTML(e) : (e) => e, ks = "http://www.w3.org/2000/svg", As = "http://www.w3.org/1998/Math/MathML", js = typeof document < "u" ? document : null, Ms = js && /* @__PURE__ */ js.createElement("template"), Ns = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? js.createElementNS(ks, e) : t === "mathml" ? js.createElementNS(As, e) : n ? js.createElement(e, { is: n }) : js.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => js.createTextNode(e),
	createComment: (e) => js.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => js.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), !(i === a || !(i = i.nextSibling)););
		else {
			Ms.innerHTML = Os(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Ms.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Ps = /* @__PURE__ */ Symbol("_vtc");
function Fs(e, t, n) {
	let r = e[Ps];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Is = /* @__PURE__ */ Symbol("_vod"), Ls = /* @__PURE__ */ Symbol("_vsh"), Rs = /* @__PURE__ */ Symbol(process.env.NODE_ENV === "production" ? "" : "CSS_VAR_TEXT"), zs = /(?:^|;)\s*display\s*:/;
function Bs(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) if (g(t)) for (let e of t.split(";")) {
			let t = e.slice(0, e.indexOf(":")).trim();
			n[t] ?? Us(r, t, "");
		}
		else for (let e in t) n[e] ?? Us(r, e, "");
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Us(r, i, "") : qs(e, i, !g(t) && t ? t[i] : void 0, o) || Us(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Rs];
			e && (n += ";" + e), r.cssText = n, a = zs.test(n);
		}
	} else t && e.removeAttribute("style");
	Is in e && (e[Is] = a ? r.display : "", e[Ls] && (r.display = "none"));
}
var Vs = /[^\\];\s*$/, Hs = /\s*!important$/;
function Us(e, t, n) {
	if (d(n)) n.forEach((n) => Us(e, t, n));
	else if (n ??= "", process.env.NODE_ENV !== "production" && Vs.test(n) && Ts(`Unexpected semicolon at the end of '${t}' style value: '${n}'`), t.startsWith("--")) e.setProperty(t, n);
	else {
		let r = Ks(e, t);
		Hs.test(n) ? e.setProperty(ne(r), n.replace(Hs, ""), "important") : e[r] = n;
	}
}
var Ws = [
	"Webkit",
	"Moz",
	"ms"
], Gs = {};
function Ks(e, t) {
	let n = Gs[t];
	if (n) return n;
	let r = O(t);
	if (r !== "filter" && r in e) return Gs[t] = r;
	r = re(r);
	for (let n = 0; n < Ws.length; n++) {
		let i = Ws[n] + r;
		if (i in e) return Gs[t] = i;
	}
	return t;
}
function qs(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var Js = "http://www.w3.org/1999/xlink";
function Ys(e, t, n, r, i, a = Ce(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Js, t.slice(6, t.length)) : e.setAttributeNS(Js, t, n) : n == null || a && !we(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function Xs(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Os(n) : n);
		return;
	}
	let a = e.tagName;
	if (t === "value" && a !== "PROGRESS" && !a.includes("-")) {
		let r = a === "OPTION" ? e.getAttribute("value") || "" : e.value, i = n == null ? e.type === "checkbox" ? "on" : "" : String(n);
		(r !== i || !("_value" in e)) && (e.value = i), n ?? e.removeAttribute(t), e._value = n;
		return;
	}
	let o = !1;
	if (n === "" || n == null) {
		let r = typeof e[t];
		r === "boolean" ? n = we(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch (e) {
		process.env.NODE_ENV !== "production" && !o && Ts(`Failed setting prop "${t}" on <${a.toLowerCase()}>: value ${n} is invalid.`, e);
	}
	o && e.removeAttribute(i || t);
}
function Zs(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Qs(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var $s = /* @__PURE__ */ Symbol("_vei");
function ec(e, t, n, r, i = null) {
	let a = e[$s] || (e[$s] = {}), o = a[t];
	if (r && o) o.value = process.env.NODE_ENV === "production" ? r : sc(r, t);
	else {
		let [n, s] = nc(t);
		r ? Zs(e, n, a[t] = oc(process.env.NODE_ENV === "production" ? r : sc(r, t), i), s) : o && (Qs(e, n, o, s), a[t] = void 0);
	}
}
var tc = /(?:Once|Passive|Capture)$/;
function nc(e) {
	let t;
	if (tc.test(e)) {
		t = {};
		let n;
		for (; n = e.match(tc);) e = e.slice(0, e.length - n[0].length), t[n[0].toLowerCase()] = !0;
	}
	return [e[2] === ":" ? e.slice(3) : ne(e.slice(2)), t];
}
var rc = 0, ic = /* @__PURE__ */ Promise.resolve(), ac = () => rc ||= (ic.then(() => rc = 0), Date.now());
function oc(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (d(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && jn(e, t, 5, a);
			}
		} else jn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = ac(), n;
}
function sc(e, t) {
	return h(e) || d(e) ? e : (Ts(`Wrong type passed as event handler to ${t} - did you forget @ or : in front of your prop?
Expected function or array of functions, received type ${typeof e}.`), r);
}
var cc = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, lc = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? Fs(e, r, c) : t === "style" ? Bs(e, n, r) : a(t) ? o(t) || ec(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : uc(e, t, r, c)) ? (Xs(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Ys(e, t, r, c, s, t !== "value")) : e._isVueCE && (dc(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? Xs(e, O(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Ys(e, t, r, c));
};
function uc(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && cc(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return cc(t) && g(n) ? !1 : t in e;
}
function dc(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = O(t);
	return Array.isArray(n) ? n.some((e) => O(e) === r) : Object.keys(n).some((e) => O(e) === r);
}
var fc = {};
/* @__NO_SIDE_EFFECTS__ */
function pc(e, t, n) {
	let r = /* @__PURE__ */ ri(e, t);
	C(r) && (r = s({}, r, t));
	class i extends hc {
		constructor(e) {
			super(r, e, n);
		}
	}
	return i.def = r, i;
}
var mc = typeof HTMLElement < "u" ? HTMLElement : class {}, hc = class e extends mc {
	constructor(e, t = {}, n = Tc) {
		super(), this._def = e, this._props = t, this._createApp = n, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._patching = !1, this._dirty = !1, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._styleAnchors = /* @__PURE__ */ new WeakMap(), this._ob = null, this.shadowRoot && n !== Tc ? this._root = this.shadowRoot : (process.env.NODE_ENV !== "production" && this.shadowRoot && Ts("Custom element has pre-rendered declarative shadow root but is not defined as hydratable. Use `defineSSRCustomElement`."), e.shadowRoot === !1 ? this._root = this : (this.attachShadow(s({}, e.shadowRootOptions, { mode: "open" })), this._root = this.shadowRoot));
	}
	connectedCallback() {
		if (!this.isConnected) return;
		!this.shadowRoot && !this._resolved && this._parseSlots(), this._connected = !0;
		let t = this;
		for (; t &&= t.assignedSlot || t.parentNode || t.host;) if (t instanceof e) {
			this._parent = t;
			break;
		}
		this._instance || (this._resolved ? this._mount(this._def) : t && t._pendingResolve ? this._pendingResolve = t._pendingResolve.then(() => {
			this._pendingResolve = void 0, this._resolveDef();
		}) : this._resolveDef());
	}
	_setParent(e = this._parent) {
		e && (this._instance.parent = e._instance, this._inheritParentContext(e));
	}
	_inheritParentContext(e = this._parent) {
		e && this._app && Object.setPrototypeOf(this._app._context.provides, e._instance.provides);
	}
	disconnectedCallback() {
		this._connected = !1, Hn(() => {
			this._connected || (this._ob &&= (this._ob.disconnect(), null), this._app && this._app.unmount(), this._instance && (this._instance.ce = void 0), this._app = this._instance = null, this._teleportTargets &&= (this._teleportTargets.clear(), void 0));
		});
	}
	_processMutations(e) {
		for (let t of e) this._setAttr(t.attributeName);
	}
	_resolveDef() {
		if (this._pendingResolve) return;
		for (let e = 0; e < this.attributes.length; e++) this._setAttr(this.attributes[e].name);
		this._ob = new MutationObserver(this._processMutations.bind(this)), this._ob.observe(this, { attributes: !0 });
		let e = (e, t = !1) => {
			this._resolved = !0, this._pendingResolve = void 0;
			let { props: n, styles: r } = e, i;
			if (n && !d(n)) for (let e in n) {
				let t = n[e];
				(t === Number || t && t.type === Number) && (e in this._props && (this._props[e] = le(this._props[e])), (i ||= /* @__PURE__ */ Object.create(null))[O(e)] = !0);
			}
			this._numberProps = i, this._resolveProps(e), this.shadowRoot ? this._applyStyles(r) : process.env.NODE_ENV !== "production" && r && Ts("Custom element style injection is not supported when using shadowRoot: false"), this._mount(e);
		}, t = this._def.__asyncLoader;
		t ? this._pendingResolve = t().then((t) => {
			t.configureApp = this._def.configureApp, e(this._def = t, !0);
		}) : e(this._def);
	}
	_mount(e) {
		process.env.NODE_ENV !== "production" && !e.name && (e.name = "VueElement"), this._app = this._createApp(e), this._inheritParentContext(), e.configureApp && e.configureApp(this._app), this._app._ceVNode = this._createVNode(), this._app.mount(this._root);
		let t = this._instance && this._instance.exposed;
		if (t) for (let e in t) u(this, e) ? process.env.NODE_ENV !== "production" && Ts(`Exposed property "${e}" already exists on custom element.`) : Object.defineProperty(this, e, { get: () => ln(t[e]) });
	}
	_resolveProps(e) {
		let { props: t } = e, n = d(t) ? t : Object.keys(t || {});
		for (let e of Object.keys(this)) e[0] !== "_" && n.includes(e) && this._setProp(e, this[e]);
		for (let e of n.map(O)) Object.defineProperty(this, e, {
			get() {
				return this._getProp(e);
			},
			set(t) {
				this._setProp(e, t, !0, !this._patching);
			}
		});
	}
	_setAttr(e) {
		if (e.startsWith("data-v-")) return;
		let t = this.hasAttribute(e), n = t ? this.getAttribute(e) : fc, r = O(e);
		t && this._numberProps && this._numberProps[r] && (n = le(n)), this._setProp(r, n, !1, !0);
	}
	_getProp(e) {
		return this._props[e];
	}
	_setProp(e, t, n = !0, r = !1) {
		if (t !== this._props[e] && (this._dirty = !0, t === fc ? delete this._props[e] : (this._props[e] = t, e === "key" && this._app && (this._app._ceVNode.key = t)), r && this._instance && this._update(), n)) {
			let n = this._ob;
			n && (this._processMutations(n.takeRecords()), n.disconnect()), t === !0 ? this.setAttribute(ne(e), "") : typeof t == "string" || typeof t == "number" ? this.setAttribute(ne(e), t + "") : t || this.removeAttribute(ne(e)), n && n.observe(this, { attributes: !0 });
		}
	}
	_update() {
		let e = this._createVNode();
		this._app && (e.appContext = this._app._context), wc(e, this._root);
	}
	_createVNode() {
		let e = {};
		this.shadowRoot || (e.onVnodeMounted = e.onVnodeUpdated = this._renderSlots.bind(this));
		let t = z(this._def, s(e, this._props));
		return this._instance || (t.ce = (e) => {
			this._instance = e, e.ce = this, e.isCE = !0, process.env.NODE_ENV !== "production" && (e.ceReload = (e) => {
				this._styles && (this._styles.forEach((e) => this._root.removeChild(e)), this._styles.length = 0), this._styleAnchors.delete(this._def), this._applyStyles(e), this._instance = null, this._update();
			});
			let t = (e, t) => {
				this.dispatchEvent(new CustomEvent(e, C(t[0]) ? s({ detail: t }, t[0]) : { detail: t }));
			};
			e.emit = (e, ...n) => {
				t(e, n), ne(e) !== e && t(ne(e), n);
			}, this._setParent();
		}), t;
	}
	_applyStyles(e, t, n) {
		if (!e) return;
		if (t) {
			if (t === this._def || this._styleChildren.has(t)) return;
			this._styleChildren.add(t);
		}
		let r = this._nonce, i = this.shadowRoot, a = n ? this._getStyleAnchor(n) || this._getStyleAnchor(this._def) : this._getRootStyleInsertionAnchor(i), o = null;
		for (let s = e.length - 1; s >= 0; s--) {
			let c = document.createElement("style");
			if (r && c.setAttribute("nonce", r), c.textContent = e[s], i.insertBefore(c, o || a), o = c, s === 0 && (n || this._styleAnchors.set(this._def, c), t && this._styleAnchors.set(t, c)), process.env.NODE_ENV !== "production") if (t) {
				if (t.__hmrId) {
					this._childStyles ||= /* @__PURE__ */ new Map();
					let e = this._childStyles.get(t.__hmrId);
					e || this._childStyles.set(t.__hmrId, e = []), e.push(c);
				}
			} else (this._styles ||= []).push(c);
		}
	}
	_getStyleAnchor(e) {
		if (!e) return null;
		let t = this._styleAnchors.get(e);
		return t && t.parentNode === this.shadowRoot ? t : (t && this._styleAnchors.delete(e), null);
	}
	_getRootStyleInsertionAnchor(e) {
		for (let t = 0; t < e.childNodes.length; t++) {
			let n = e.childNodes[t];
			if (!(n instanceof HTMLStyleElement)) return n;
		}
		return null;
	}
	_parseSlots() {
		let e = this._slots = {}, t;
		for (; t = this.firstChild;) {
			let n = t.nodeType === 1 && t.getAttribute("slot") || "default";
			(e[n] || (e[n] = [])).push(t), this.removeChild(t);
		}
	}
	_renderSlots() {
		let e = this._getSlots(), t = this._instance.type.__scopeId;
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = r.getAttribute("name") || "default", a = this._slots[i], o = r.parentNode;
			if (a) for (let e of a) {
				if (t && e.nodeType === 1) {
					let n = t + "-s", r = document.createTreeWalker(e, 1);
					e.setAttribute(n, "");
					let i;
					for (; i = r.nextNode();) i.setAttribute(n, "");
				}
				o.insertBefore(e, r);
			}
			else for (; r.firstChild;) o.insertBefore(r.firstChild, r);
			o.removeChild(r);
		}
	}
	_getSlots() {
		let e = [this];
		this._teleportTargets && e.push(...this._teleportTargets);
		let t = /* @__PURE__ */ new Set();
		for (let n of e) {
			let e = n.querySelectorAll("slot");
			for (let n = 0; n < e.length; n++) t.add(e[n]);
		}
		return Array.from(t);
	}
	_injectChildStyle(e, t) {
		this._applyStyles(e.styles, e, t);
	}
	_beginPatch() {
		this._patching = !0, this._dirty = !1;
	}
	_endPatch() {
		this._patching = !1, this._dirty && this._instance && this._update();
	}
	_hasShadowRoot() {
		return this._def.shadowRoot !== !1;
	}
	_removeChildStyle(e) {
		if (process.env.NODE_ENV !== "production" && (this._styleChildren.delete(e), this._styleAnchors.delete(e), this._childStyles && e.__hmrId)) {
			let t = this._childStyles.get(e.__hmrId);
			t && (t.forEach((e) => this._root.removeChild(e)), t.length = 0);
		}
	}
}, gc = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => oe(t, e) : t;
}, _c = /* @__PURE__ */ Symbol("_assign"), vc = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		let i = p(t);
		Zs(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? ce(bc(e)) : bc(e));
			e[_c](e.multiple ? i ? new Set(t) : t : t[0]), e._assigning = !0, Hn(() => {
				e._assigning = !1;
			});
		}), e[_c] = gc(r);
	},
	mounted(e, { value: t }) {
		yc(e, t);
	},
	beforeUpdate(e, t, n) {
		e[_c] = gc(n);
	},
	updated(e, { value: t }) {
		e._assigning || yc(e, t);
	}
};
function yc(e, t) {
	let n = e.multiple, r = d(t);
	if (n && !r && !p(t)) {
		process.env.NODE_ENV !== "production" && Ts(`<select multiple v-model> expects an Array or Set value for its binding, but got ${Object.prototype.toString.call(t).slice(8, -1)}.`);
		return;
	}
	for (let i = 0, a = e.options.length; i < a; i++) {
		let a = e.options[i], o = bc(a);
		if (n) if (r) {
			let e = typeof o;
			e === "string" || e === "number" ? a.selected = t.some((e) => String(e) === String(o)) : a.selected = De(t, o) > -1;
		} else a.selected = t.has(o);
		else if (Ee(bc(a), t)) {
			e.selectedIndex !== i && (e.selectedIndex = i);
			return;
		}
	}
	!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
}
function bc(e) {
	return "_value" in e ? e._value : e.value;
}
var xc = /* @__PURE__ */ s({ patchProp: lc }, Ns), Sc;
function Cc() {
	return Sc ||= co(xc);
}
var wc = ((...e) => {
	Cc().render(...e);
}), Tc = ((...e) => {
	let t = Cc().createApp(...e);
	process.env.NODE_ENV !== "production" && (Dc(t), Oc(t));
	let { mount: n } = t;
	return t.mount = (e) => {
		let r = kc(e);
		if (!r) return;
		let i = t._component;
		!h(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Ec(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Ec(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Dc(e) {
	Object.defineProperty(e.config, "isNativeTag", {
		value: (e) => ye(e) || be(e) || xe(e),
		writable: !1
	});
}
function Oc(e) {
	if (ds()) {
		let t = e.config.isCustomElement;
		Object.defineProperty(e.config, "isCustomElement", {
			get() {
				return t;
			},
			set() {
				Ts("The `isCustomElement` config option is deprecated. Use `compilerOptions.isCustomElement` instead.");
			}
		});
		let n = e.config.compilerOptions, r = "The `compilerOptions` config option is only respected when using a build of Vue.js that includes the runtime compiler (aka \"full build\"). Since you are using the runtime-only build, `compilerOptions` must be passed to `@vue/compiler-dom` in the build setup instead.\n- For vue-loader: pass it via vue-loader's `compilerOptions` loader option.\n- For vue-cli: see https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader\n- For vite: pass it via @vitejs/plugin-vue options. See https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-sfc";
		Object.defineProperty(e.config, "compilerOptions", {
			get() {
				return Ts(r), n;
			},
			set() {
				Ts(r);
			}
		});
	}
}
function kc(e) {
	if (g(e)) {
		let t = document.querySelector(e);
		return process.env.NODE_ENV !== "production" && !t && Ts(`Failed to mount app: mount target selector "${e}" returned null.`), t;
	}
	return process.env.NODE_ENV !== "production" && window.ShadowRoot && e instanceof window.ShadowRoot && e.mode === "closed" && Ts("mounting on a ShadowRoot with `{mode: \"closed\"}` may lead to unpredictable bugs"), e;
}
//#endregion
//#region node_modules/vue/dist/vue.runtime.esm-bundler.js
function Ac() {
	Cs();
}
process.env.NODE_ENV !== "production" && Ac();
//#endregion
//#region node_modules/@jpinsonneau/html-to-image/es/util.js
function jc(e, t) {
	if (e.match(/^[a-z]+:\/\//i)) return e;
	if (e.match(/^\/\//)) return window.location.protocol + e;
	if (e.match(/^[a-z]+:/i)) return e;
	let n = document.implementation.createHTMLDocument(), r = n.createElement("base"), i = n.createElement("a");
	return n.head.appendChild(r), n.body.appendChild(i), t && (r.href = t), i.href = e, i.href;
}
var Mc = (() => {
	let e = 0, t = () => `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4);
	return () => (e += 1, `u${t()}${e}`);
})();
function Nc(e) {
	let t = [];
	for (let n = 0, r = e.length; n < r; n++) t.push(e[n]);
	return t;
}
var Pc = null;
function Fc(e = {}) {
	return Pc || (e.includeStyleProperties ? (Pc = e.includeStyleProperties, Pc) : (Pc = Nc(window.getComputedStyle(document.documentElement)), Pc));
}
function Ic(e, t) {
	let n = (e.ownerDocument.defaultView || window).getComputedStyle(e).getPropertyValue(t);
	return n ? parseFloat(n.replace("px", "")) : 0;
}
function Lc(e) {
	let t = Ic(e, "border-left-width"), n = Ic(e, "border-right-width");
	return e.clientWidth + t + n;
}
function Rc(e) {
	let t = Ic(e, "border-top-width"), n = Ic(e, "border-bottom-width");
	return e.clientHeight + t + n;
}
function zc(e, t = {}) {
	return {
		width: t.width || Lc(e),
		height: t.height || Rc(e)
	};
}
function Bc() {
	let e, t;
	try {
		t = process;
	} catch {}
	let n = t && t.env ? t.env.devicePixelRatio : null;
	return n && (e = parseInt(n, 10), Number.isNaN(e) && (e = 1)), e || window.devicePixelRatio || 1;
}
var Vc = 16384;
function Hc(e) {
	(e.width > Vc || e.height > Vc) && (e.width > Vc && e.height > Vc ? e.width > e.height ? (e.height *= Vc / e.width, e.width = Vc) : (e.width *= Vc / e.height, e.height = Vc) : e.width > Vc ? (e.height *= Vc / e.width, e.width = Vc) : (e.width *= Vc / e.height, e.height = Vc));
}
function Uc(e) {
	return new Promise((t, n) => {
		let r = new Image();
		r.onload = () => {
			r.decode().then(() => {
				requestAnimationFrame(() => t(r));
			});
		}, r.onerror = n, r.crossOrigin = "anonymous", r.decoding = "async", r.src = e;
	});
}
async function Wc(e) {
	return Promise.resolve().then(() => new XMLSerializer().serializeToString(e)).then(encodeURIComponent).then((e) => `data:image/svg+xml;charset=utf-8,${e}`);
}
async function Gc(e, t, n) {
	let r = "http://www.w3.org/2000/svg", i = document.createElementNS(r, "svg"), a = document.createElementNS(r, "foreignObject");
	return i.setAttribute("width", `${t}`), i.setAttribute("height", `${n}`), i.setAttribute("viewBox", `0 0 ${t} ${n}`), a.setAttribute("width", "100%"), a.setAttribute("height", "100%"), a.setAttribute("x", "0"), a.setAttribute("y", "0"), a.setAttribute("externalResourcesRequired", "true"), i.appendChild(a), a.appendChild(e), Wc(i);
}
var Kc = (e, t) => {
	if (e instanceof t) return !0;
	let n = Object.getPrototypeOf(e);
	return n === null ? !1 : n.constructor.name === t.name || Kc(n, t);
};
//#endregion
//#region node_modules/@jpinsonneau/html-to-image/es/clone-pseudos.js
function qc(e) {
	let t = e.getPropertyValue("content");
	return `${e.cssText} content: '${t.replace(/'|"/g, "")}';`;
}
function Jc(e, t) {
	return Fc(t).map((t) => `${t}: ${e.getPropertyValue(t)}${e.getPropertyPriority(t) ? " !important" : ""};`).join(" ");
}
function Yc(e, t, n, r) {
	let i = `.${e}:${t}`, a = n.cssText ? qc(n) : Jc(n, r);
	return document.createTextNode(`${i}{${a}}`);
}
function Xc(e, t, n, r) {
	let i = window.getComputedStyle(e, n), a = i.getPropertyValue("content");
	if (a === "" || a === "none") return;
	let o = Mc();
	try {
		t.className = `${t.className} ${o}`;
	} catch {
		return;
	}
	let s = document.createElement("style");
	s.appendChild(Yc(o, n, i, r)), t.appendChild(s);
}
function Zc(e, t, n) {
	Xc(e, t, ":before", n), Xc(e, t, ":after", n);
}
//#endregion
//#region node_modules/@jpinsonneau/html-to-image/es/mimes.js
var Qc = "application/font-woff", $c = "image/jpeg", el = {
	woff: Qc,
	woff2: Qc,
	ttf: "application/font-truetype",
	eot: "application/vnd.ms-fontobject",
	png: "image/png",
	jpg: $c,
	jpeg: $c,
	gif: "image/gif",
	tiff: "image/tiff",
	svg: "image/svg+xml",
	webp: "image/webp"
};
function tl(e) {
	let t = /\.([^./]*?)$/g.exec(e);
	return t ? t[1] : "";
}
function nl(e) {
	return el[tl(e).toLowerCase()] || "";
}
//#endregion
//#region node_modules/@jpinsonneau/html-to-image/es/dataurl.js
function rl(e) {
	return e.split(/,/)[1];
}
function il(e) {
	return e.search(/^(data:)/) !== -1;
}
function al(e, t) {
	return `data:${t};base64,${e}`;
}
async function ol(e, t, n) {
	let r = await fetch(e, t);
	if (r.status === 404) throw Error(`Resource "${r.url}" not found`);
	let i = await r.blob();
	return new Promise((e, t) => {
		let a = new FileReader();
		a.onerror = t, a.onloadend = () => {
			try {
				e(n({
					res: r,
					result: a.result
				}));
			} catch (e) {
				t(e);
			}
		}, a.readAsDataURL(i);
	});
}
var sl = {};
function cl(e, t, n) {
	let r = e.replace(/\?.*/, "");
	return n && (r = e), /ttf|otf|eot|woff2?/i.test(r) && (r = r.replace(/.*\//, "")), t ? `[${t}]${r}` : r;
}
async function ll(e, t, n) {
	let r = cl(e, t, n.includeQueryParams);
	if (sl[r] != null) return sl[r];
	n.cacheBust && (e += (/\?/.test(e) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime());
	let i;
	try {
		i = al(await ol(e, n.fetchRequestInit, ({ res: e, result: n }) => (t ||= e.headers.get("Content-Type") || "", rl(n))), t);
	} catch (t) {
		i = n.imagePlaceholder || "";
		let r = `Failed to fetch resource: ${e}`;
		t && (r = typeof t == "string" ? t : t.message), r && console.warn(r);
	}
	return sl[r] = i, i;
}
//#endregion
//#region node_modules/@jpinsonneau/html-to-image/es/clone-node.js
async function ul(e) {
	let t = e.toDataURL();
	return t === "data:," ? e.cloneNode(!1) : Uc(t);
}
async function dl(e, t) {
	if (e.currentSrc) {
		let t = document.createElement("canvas"), n = t.getContext("2d");
		return t.width = e.clientWidth, t.height = e.clientHeight, n?.drawImage(e, 0, 0, t.width, t.height), Uc(t.toDataURL());
	}
	let n = e.poster;
	return Uc(await ll(n, nl(n), t));
}
async function fl(e, t) {
	try {
		if (e?.contentDocument?.body) return await Sl(e.contentDocument.body, t, !0);
	} catch {}
	return e.cloneNode(!1);
}
async function pl(e, t) {
	return Kc(e, HTMLCanvasElement) ? ul(e) : Kc(e, HTMLVideoElement) ? dl(e, t) : Kc(e, HTMLIFrameElement) ? fl(e, t) : e.cloneNode(hl(e));
}
var ml = (e) => e.tagName != null && e.tagName.toUpperCase() === "SLOT", hl = (e) => e.tagName != null && e.tagName.toUpperCase() === "SVG";
async function gl(e, t, n) {
	if (hl(t)) return t;
	let r = [];
	return r = ml(e) && e.assignedNodes ? Nc(e.assignedNodes()) : Kc(e, HTMLIFrameElement) && e.contentDocument?.body ? Nc(e.contentDocument.body.childNodes) : Nc((e.shadowRoot ?? e).childNodes), r.length === 0 || Kc(e, HTMLVideoElement) || await r.reduce((e, r) => e.then(() => Sl(r, n)).then((e) => {
		e && t.appendChild(e);
	}), Promise.resolve()), t;
}
function _l(e, t, n) {
	let r = t.style;
	if (!r) return;
	let i = window.getComputedStyle(e);
	i.cssText ? (r.cssText = i.cssText, r.transformOrigin = i.transformOrigin) : Fc(n).forEach((n) => {
		let a = i.getPropertyValue(n);
		n === "font-size" && a.endsWith("px") && (a = `${Math.floor(parseFloat(a.substring(0, a.length - 2))) - .1}px`), Kc(e, HTMLIFrameElement) && n === "display" && a === "inline" && (a = "block"), n === "d" && t.getAttribute("d") && (a = `path(${t.getAttribute("d")})`), r.setProperty(n, a, i.getPropertyPriority(n));
	});
}
function vl(e, t) {
	Kc(e, HTMLTextAreaElement) && (t.innerHTML = e.value), Kc(e, HTMLInputElement) && t.setAttribute("value", e.value);
}
function yl(e, t) {
	if (Kc(e, HTMLSelectElement)) {
		let n = t, r = Array.from(n.children).find((t) => e.value === t.getAttribute("value"));
		r && r.setAttribute("selected", "");
	}
}
function bl(e, t, n) {
	return Kc(t, Element) && (_l(e, t, n), Zc(e, t, n), vl(e, t), yl(e, t)), t;
}
async function xl(e, t) {
	let n = e.querySelectorAll ? e.querySelectorAll("use") : [];
	if (n.length === 0) return e;
	let r = {};
	for (let i = 0; i < n.length; i++) {
		let a = n[i].getAttribute("xlink:href");
		if (a) {
			let n = e.querySelector(a), i = document.querySelector(a);
			!n && i && !r[a] && (r[a] = await Sl(i, t, !0));
		}
	}
	let i = Object.values(r);
	if (i.length) {
		let t = "http://www.w3.org/1999/xhtml", n = document.createElementNS(t, "svg");
		n.setAttribute("xmlns", t), n.style.position = "absolute", n.style.width = "0", n.style.height = "0", n.style.overflow = "hidden", n.style.display = "none";
		let r = document.createElementNS(t, "defs");
		n.appendChild(r);
		for (let e = 0; e < i.length; e++) r.appendChild(i[e]);
		e.appendChild(n);
	}
	return e;
}
async function Sl(e, t, n) {
	return !n && t.filter && !t.filter(e) ? null : Promise.resolve(e).then((e) => pl(e, t)).then((n) => gl(e, n, t)).then((n) => bl(e, n, t)).then((e) => xl(e, t));
}
//#endregion
//#region node_modules/@jpinsonneau/html-to-image/es/embed-resources.js
var Cl = /url\((['"]?)([^'"]+?)\1\)/g, wl = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g, Tl = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function El(e) {
	let t = e.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
	return RegExp(`(url\\(['"]?)(${t})(['"]?\\))`, "g");
}
function Dl(e) {
	let t = [];
	return e.replace(Cl, (e, n, r) => (t.push(r), e)), t.filter((e) => !il(e));
}
async function Ol(e, t, n, r, i) {
	try {
		let a = n ? jc(t, n) : t, o = nl(t), s;
		return s = i ? al(await i(a), o) : await ll(a, o, r), e.replace(El(t), `$1${s}$3`);
	} catch {}
	return e;
}
function kl(e, { preferredFontFormat: t }) {
	return t ? e.replace(Tl, (e) => {
		for (;;) {
			let [n, , r] = wl.exec(e) || [];
			if (!r) return "";
			if (r === t) return `src: ${n};`;
		}
	}) : e;
}
function Al(e) {
	return e.search(Cl) !== -1;
}
async function jl(e, t, n) {
	if (!Al(e)) return e;
	let r = kl(e, n);
	return Dl(r).reduce((e, r) => e.then((e) => Ol(e, r, t, n)), Promise.resolve(r));
}
//#endregion
//#region node_modules/@jpinsonneau/html-to-image/es/embed-images.js
async function Ml(e, t, n) {
	let r = t.style?.getPropertyValue(e);
	if (r) {
		let i = await jl(r, null, n);
		return t.style.setProperty(e, i, t.style.getPropertyPriority(e)), !0;
	}
	return !1;
}
async function Nl(e, t) {
	await Ml("background", e, t) || await Ml("background-image", e, t), await Ml("mask", e, t) || await Ml("-webkit-mask", e, t) || await Ml("mask-image", e, t) || await Ml("-webkit-mask-image", e, t);
}
async function Pl(e, t) {
	let n = Kc(e, HTMLImageElement);
	if (!(n && !il(e.src)) && !(Kc(e, SVGImageElement) && !il(e.href.baseVal))) return;
	let r = n ? e.src : e.href.baseVal, i = await ll(r, nl(r), t);
	await new Promise((r, a) => {
		e.onload = r, e.onerror = t.onImageErrorHandler ? (...e) => {
			try {
				r(t.onImageErrorHandler(...e));
			} catch (e) {
				a(e);
			}
		} : a;
		let o = e;
		o.decode &&= r, o.loading === "lazy" && (o.loading = "eager"), n ? (e.srcset = "", e.src = i) : e.href.baseVal = i;
	});
}
async function Fl(e, t) {
	let n = Nc(e.childNodes).map((e) => Il(e, t));
	await Promise.all(n).then(() => e);
}
async function Il(e, t) {
	Kc(e, Element) && (await Nl(e, t), await Pl(e, t), await Fl(e, t));
}
//#endregion
//#region node_modules/@jpinsonneau/html-to-image/es/apply-style.js
function Ll(e, t) {
	let { style: n } = e;
	t.backgroundColor && (n.backgroundColor = t.backgroundColor), t.width && (n.width = `${t.width}px`), t.height && (n.height = `${t.height}px`);
	let r = t.style;
	return r != null && Object.keys(r).forEach((e) => {
		n[e] = r[e];
	}), e;
}
//#endregion
//#region node_modules/@jpinsonneau/html-to-image/es/embed-webfonts.js
var Rl = {};
async function zl(e) {
	let t = Rl[e];
	return t ?? (t = {
		url: e,
		cssText: await (await fetch(e)).text()
	}, Rl[e] = t, t);
}
async function Bl(e, t) {
	let n = e.cssText, r = /url\(["']?([^"')]+)["']?\)/g, i = (n.match(/url\([^)]+\)/g) || []).map(async (i) => {
		let a = i.replace(r, "$1");
		return a.startsWith("https://") || (a = new URL(a, e.url).href), ol(a, t.fetchRequestInit, ({ result: e }) => (n = n.replace(i, `url(${e})`), [i, e]));
	});
	return Promise.all(i).then(() => n);
}
function Vl(e) {
	if (e == null) return [];
	let t = [], n = e.replace(/(\/\*[\s\S]*?\*\/)/gi, ""), r = /* @__PURE__ */ RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi");
	for (;;) {
		let e = r.exec(n);
		if (e === null) break;
		t.push(e[0]);
	}
	n = n.replace(r, "");
	let i = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi, a = /* @__PURE__ */ RegExp("((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})", "gi");
	for (;;) {
		let e = i.exec(n);
		if (e === null) {
			if (e = a.exec(n), e === null) break;
			i.lastIndex = a.lastIndex;
		} else a.lastIndex = i.lastIndex;
		t.push(e[0]);
	}
	return t;
}
async function Hl(e, t) {
	let n = [], r = [];
	return e.forEach((n) => {
		if ("cssRules" in n) try {
			Nc(n.cssRules || []).forEach((e, i) => {
				if (e.type === CSSRule.IMPORT_RULE) {
					let a = i + 1, o = e.href, s = zl(o).then((e) => Bl(e, t)).then((e) => Vl(e).forEach((e) => {
						try {
							n.insertRule(e, e.startsWith("@import") ? a += 1 : n.cssRules.length);
						} catch (t) {
							console.error("Error inserting rule from remote css", {
								rule: e,
								error: t
							});
						}
					})).catch((e) => {
						console.error("Error loading remote css", e.toString());
					});
					r.push(s);
				}
			});
		} catch (i) {
			let a = e.find((e) => e.href == null) || document.styleSheets[0];
			n.href != null && r.push(zl(n.href).then((e) => Bl(e, t)).then((e) => Vl(e).forEach((e) => {
				a.insertRule(e, a.cssRules.length);
			})).catch((e) => {
				console.error("Error loading remote stylesheet", e);
			})), console.error("Error inlining remote css file", i);
		}
	}), Promise.all(r).then(() => (e.forEach((e) => {
		if ("cssRules" in e) try {
			Nc(e.cssRules || []).forEach((e) => {
				n.push(e);
			});
		} catch (t) {
			console.error(`Error while reading CSS rules from ${e.href}`, t);
		}
	}), n));
}
function Ul(e) {
	return e.filter((e) => e.type === CSSRule.FONT_FACE_RULE).filter((e) => Al(e.style.getPropertyValue("src")));
}
async function Wl(e, t) {
	if (e.ownerDocument == null) throw Error("Provided element is not within a Document");
	return Ul(await Hl(Nc(e.ownerDocument.styleSheets), t));
}
function Gl(e) {
	return e.trim().replace(/["']/g, "");
}
function Kl(e) {
	let t = /* @__PURE__ */ new Set();
	function n(e) {
		(e.style.fontFamily || getComputedStyle(e).fontFamily).split(",").forEach((e) => {
			t.add(Gl(e));
		}), Array.from(e.children).forEach((e) => {
			e instanceof HTMLElement && n(e);
		});
	}
	return n(e), t;
}
async function ql(e, t) {
	let n = await Wl(e, t), r = Kl(e);
	return (await Promise.all(n.filter((e) => r.has(Gl(e.style.fontFamily || e.style.getPropertyValue("fontFamily")))).map((e) => {
		let n = e.parentStyleSheet ? e.parentStyleSheet.href : null;
		return jl(e.cssText, n, t);
	}))).join("\n");
}
async function Jl(e, t) {
	let n = t.fontEmbedCSS == null ? t.skipFonts ? null : await ql(e, t) : t.fontEmbedCSS;
	if (n) {
		let t = document.createElement("style"), r = document.createTextNode(n);
		t.appendChild(r), e.firstChild ? e.insertBefore(t, e.firstChild) : e.appendChild(t);
	}
}
//#endregion
//#region node_modules/@jpinsonneau/html-to-image/es/index.js
async function Yl(e, t = {}) {
	let { width: n, height: r } = zc(e, t), i = await Sl(e, t, !0);
	return await Jl(i, t), await Il(i, t), Ll(i, t), await Gc(i, n, r);
}
async function Xl(e, t = {}) {
	let { width: n, height: r } = zc(e, t), i = await Uc(await Yl(e, t)), a = document.createElement("canvas"), o = a.getContext("2d"), s = t.pixelRatio || Bc(), c = t.canvasWidth || n, l = t.canvasHeight || r;
	return a.width = c * s, a.height = l * s, t.skipAutoScale || Hc(a), a.style.width = `${c}`, a.style.height = `${l}`, t.backgroundColor && (o.fillStyle = t.backgroundColor, o.fillRect(0, 0, a.width, a.height)), o.drawImage(i, 0, 0, a.width, a.height), a;
}
async function Zl(e, t = {}) {
	return (await Xl(e, t)).toDataURL();
}
//#endregion
//#region node_modules/@kurkle/color/dist/color.esm.js
function Ql(e) {
	return e + .5 | 0;
}
var $l = (e, t, n) => Math.max(Math.min(e, n), t);
function eu(e) {
	return $l(Ql(e * 2.55), 0, 255);
}
function tu(e) {
	return $l(Ql(e * 255), 0, 255);
}
function nu(e) {
	return $l(Ql(e / 2.55) / 100, 0, 1);
}
function ru(e) {
	return $l(Ql(e * 100), 0, 100);
}
var iu = {
	0: 0,
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	A: 10,
	B: 11,
	C: 12,
	D: 13,
	E: 14,
	F: 15,
	a: 10,
	b: 11,
	c: 12,
	d: 13,
	e: 14,
	f: 15
}, au = [..."0123456789ABCDEF"], ou = (e) => au[e & 15], su = (e) => au[(e & 240) >> 4] + au[e & 15], cu = (e) => (e & 240) >> 4 == (e & 15), lu = (e) => cu(e.r) && cu(e.g) && cu(e.b) && cu(e.a);
function uu(e) {
	var t = e.length, n;
	return e[0] === "#" && (t === 4 || t === 5 ? n = {
		r: 255 & iu[e[1]] * 17,
		g: 255 & iu[e[2]] * 17,
		b: 255 & iu[e[3]] * 17,
		a: t === 5 ? iu[e[4]] * 17 : 255
	} : (t === 7 || t === 9) && (n = {
		r: iu[e[1]] << 4 | iu[e[2]],
		g: iu[e[3]] << 4 | iu[e[4]],
		b: iu[e[5]] << 4 | iu[e[6]],
		a: t === 9 ? iu[e[7]] << 4 | iu[e[8]] : 255
	})), n;
}
var du = (e, t) => e < 255 ? t(e) : "";
function fu(e) {
	var t = lu(e) ? ou : su;
	return e ? "#" + t(e.r) + t(e.g) + t(e.b) + du(e.a, t) : void 0;
}
var pu = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
function mu(e, t, n) {
	let r = t * Math.min(n, 1 - n), i = (t, i = (t + e / 30) % 12) => n - r * Math.max(Math.min(i - 3, 9 - i, 1), -1);
	return [
		i(0),
		i(8),
		i(4)
	];
}
function hu(e, t, n) {
	let r = (r, i = (r + e / 60) % 6) => n - n * t * Math.max(Math.min(i, 4 - i, 1), 0);
	return [
		r(5),
		r(3),
		r(1)
	];
}
function gu(e, t, n) {
	let r = mu(e, 1, .5), i;
	for (t + n > 1 && (i = 1 / (t + n), t *= i, n *= i), i = 0; i < 3; i++) r[i] *= 1 - t - n, r[i] += t;
	return r;
}
function _u(e, t, n, r, i) {
	return e === i ? (t - n) / r + (t < n ? 6 : 0) : t === i ? (n - e) / r + 2 : (e - t) / r + 4;
}
function vu(e) {
	let t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.max(t, n, r), a = Math.min(t, n, r), o = (i + a) / 2, s, c, l;
	return i !== a && (l = i - a, c = o > .5 ? l / (2 - i - a) : l / (i + a), s = _u(t, n, r, l, i), s = s * 60 + .5), [
		s | 0,
		c || 0,
		o
	];
}
function yu(e, t, n, r) {
	return (Array.isArray(t) ? e(t[0], t[1], t[2]) : e(t, n, r)).map(tu);
}
function bu(e, t, n) {
	return yu(mu, e, t, n);
}
function xu(e, t, n) {
	return yu(gu, e, t, n);
}
function Su(e, t, n) {
	return yu(hu, e, t, n);
}
function Cu(e) {
	return (e % 360 + 360) % 360;
}
function wu(e) {
	let t = pu.exec(e), n = 255, r;
	if (!t) return;
	t[5] !== r && (n = t[6] ? eu(+t[5]) : tu(+t[5]));
	let i = Cu(+t[2]), a = t[3] / 100, o = t[4] / 100;
	return r = t[1] === "hwb" ? xu(i, a, o) : t[1] === "hsv" ? Su(i, a, o) : bu(i, a, o), {
		r: r[0],
		g: r[1],
		b: r[2],
		a: n
	};
}
function Tu(e, t) {
	var n = vu(e);
	n[0] = Cu(n[0] + t), n = bu(n), e.r = n[0], e.g = n[1], e.b = n[2];
}
function Eu(e) {
	if (!e) return;
	let t = vu(e), n = t[0], r = ru(t[1]), i = ru(t[2]);
	return e.a < 255 ? `hsla(${n}, ${r}%, ${i}%, ${nu(e.a)})` : `hsl(${n}, ${r}%, ${i}%)`;
}
var Du = {
	x: "dark",
	Z: "light",
	Y: "re",
	X: "blu",
	W: "gr",
	V: "medium",
	U: "slate",
	A: "ee",
	T: "ol",
	S: "or",
	B: "ra",
	C: "lateg",
	D: "ights",
	R: "in",
	Q: "turquois",
	E: "hi",
	P: "ro",
	O: "al",
	N: "le",
	M: "de",
	L: "yello",
	F: "en",
	K: "ch",
	G: "arks",
	H: "ea",
	I: "ightg",
	J: "wh"
}, Ou = {
	OiceXe: "f0f8ff",
	antiquewEte: "faebd7",
	aqua: "ffff",
	aquamarRe: "7fffd4",
	azuY: "f0ffff",
	beige: "f5f5dc",
	bisque: "ffe4c4",
	black: "0",
	blanKedOmond: "ffebcd",
	Xe: "ff",
	XeviTet: "8a2be2",
	bPwn: "a52a2a",
	burlywood: "deb887",
	caMtXe: "5f9ea0",
	KartYuse: "7fff00",
	KocTate: "d2691e",
	cSO: "ff7f50",
	cSnflowerXe: "6495ed",
	cSnsilk: "fff8dc",
	crimson: "dc143c",
	cyan: "ffff",
	xXe: "8b",
	xcyan: "8b8b",
	xgTMnPd: "b8860b",
	xWay: "a9a9a9",
	xgYF: "6400",
	xgYy: "a9a9a9",
	xkhaki: "bdb76b",
	xmagFta: "8b008b",
	xTivegYF: "556b2f",
	xSange: "ff8c00",
	xScEd: "9932cc",
	xYd: "8b0000",
	xsOmon: "e9967a",
	xsHgYF: "8fbc8f",
	xUXe: "483d8b",
	xUWay: "2f4f4f",
	xUgYy: "2f4f4f",
	xQe: "ced1",
	xviTet: "9400d3",
	dAppRk: "ff1493",
	dApskyXe: "bfff",
	dimWay: "696969",
	dimgYy: "696969",
	dodgerXe: "1e90ff",
	fiYbrick: "b22222",
	flSOwEte: "fffaf0",
	foYstWAn: "228b22",
	fuKsia: "ff00ff",
	gaRsbSo: "dcdcdc",
	ghostwEte: "f8f8ff",
	gTd: "ffd700",
	gTMnPd: "daa520",
	Way: "808080",
	gYF: "8000",
	gYFLw: "adff2f",
	gYy: "808080",
	honeyMw: "f0fff0",
	hotpRk: "ff69b4",
	RdianYd: "cd5c5c",
	Rdigo: "4b0082",
	ivSy: "fffff0",
	khaki: "f0e68c",
	lavFMr: "e6e6fa",
	lavFMrXsh: "fff0f5",
	lawngYF: "7cfc00",
	NmoncEffon: "fffacd",
	ZXe: "add8e6",
	ZcSO: "f08080",
	Zcyan: "e0ffff",
	ZgTMnPdLw: "fafad2",
	ZWay: "d3d3d3",
	ZgYF: "90ee90",
	ZgYy: "d3d3d3",
	ZpRk: "ffb6c1",
	ZsOmon: "ffa07a",
	ZsHgYF: "20b2aa",
	ZskyXe: "87cefa",
	ZUWay: "778899",
	ZUgYy: "778899",
	ZstAlXe: "b0c4de",
	ZLw: "ffffe0",
	lime: "ff00",
	limegYF: "32cd32",
	lRF: "faf0e6",
	magFta: "ff00ff",
	maPon: "800000",
	VaquamarRe: "66cdaa",
	VXe: "cd",
	VScEd: "ba55d3",
	VpurpN: "9370db",
	VsHgYF: "3cb371",
	VUXe: "7b68ee",
	VsprRggYF: "fa9a",
	VQe: "48d1cc",
	VviTetYd: "c71585",
	midnightXe: "191970",
	mRtcYam: "f5fffa",
	mistyPse: "ffe4e1",
	moccasR: "ffe4b5",
	navajowEte: "ffdead",
	navy: "80",
	Tdlace: "fdf5e6",
	Tive: "808000",
	TivedBb: "6b8e23",
	Sange: "ffa500",
	SangeYd: "ff4500",
	ScEd: "da70d6",
	pOegTMnPd: "eee8aa",
	pOegYF: "98fb98",
	pOeQe: "afeeee",
	pOeviTetYd: "db7093",
	papayawEp: "ffefd5",
	pHKpuff: "ffdab9",
	peru: "cd853f",
	pRk: "ffc0cb",
	plum: "dda0dd",
	powMrXe: "b0e0e6",
	purpN: "800080",
	YbeccapurpN: "663399",
	Yd: "ff0000",
	Psybrown: "bc8f8f",
	PyOXe: "4169e1",
	saddNbPwn: "8b4513",
	sOmon: "fa8072",
	sandybPwn: "f4a460",
	sHgYF: "2e8b57",
	sHshell: "fff5ee",
	siFna: "a0522d",
	silver: "c0c0c0",
	skyXe: "87ceeb",
	UXe: "6a5acd",
	UWay: "708090",
	UgYy: "708090",
	snow: "fffafa",
	sprRggYF: "ff7f",
	stAlXe: "4682b4",
	tan: "d2b48c",
	teO: "8080",
	tEstN: "d8bfd8",
	tomato: "ff6347",
	Qe: "40e0d0",
	viTet: "ee82ee",
	JHt: "f5deb3",
	wEte: "ffffff",
	wEtesmoke: "f5f5f5",
	Lw: "ffff00",
	LwgYF: "9acd32"
};
function ku() {
	let e = {}, t = Object.keys(Ou), n = Object.keys(Du), r, i, a, o, s;
	for (r = 0; r < t.length; r++) {
		for (o = s = t[r], i = 0; i < n.length; i++) a = n[i], s = s.replace(a, Du[a]);
		a = parseInt(Ou[o], 16), e[s] = [
			a >> 16 & 255,
			a >> 8 & 255,
			a & 255
		];
	}
	return e;
}
var Au;
function ju(e) {
	Au || (Au = ku(), Au.transparent = [
		0,
		0,
		0,
		0
	]);
	let t = Au[e.toLowerCase()];
	return t && {
		r: t[0],
		g: t[1],
		b: t[2],
		a: t.length === 4 ? t[3] : 255
	};
}
var Mu = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
function Nu(e) {
	let t = Mu.exec(e), n = 255, r, i, a;
	if (t) {
		if (t[7] !== r) {
			let e = +t[7];
			n = t[8] ? eu(e) : $l(e * 255, 0, 255);
		}
		return r = +t[1], i = +t[3], a = +t[5], r = 255 & (t[2] ? eu(r) : $l(r, 0, 255)), i = 255 & (t[4] ? eu(i) : $l(i, 0, 255)), a = 255 & (t[6] ? eu(a) : $l(a, 0, 255)), {
			r,
			g: i,
			b: a,
			a: n
		};
	}
}
function Pu(e) {
	return e && (e.a < 255 ? `rgba(${e.r}, ${e.g}, ${e.b}, ${nu(e.a)})` : `rgb(${e.r}, ${e.g}, ${e.b})`);
}
var Fu = (e) => e <= .0031308 ? e * 12.92 : e ** (1 / 2.4) * 1.055 - .055, Iu = (e) => e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
function Lu(e, t, n) {
	let r = Iu(nu(e.r)), i = Iu(nu(e.g)), a = Iu(nu(e.b));
	return {
		r: tu(Fu(r + n * (Iu(nu(t.r)) - r))),
		g: tu(Fu(i + n * (Iu(nu(t.g)) - i))),
		b: tu(Fu(a + n * (Iu(nu(t.b)) - a))),
		a: e.a + n * (t.a - e.a)
	};
}
function Ru(e, t, n) {
	if (e) {
		let r = vu(e);
		r[t] = Math.max(0, Math.min(r[t] + r[t] * n, t === 0 ? 360 : 1)), r = bu(r), e.r = r[0], e.g = r[1], e.b = r[2];
	}
}
function zu(e, t) {
	return e && Object.assign(t || {}, e);
}
function Bu(e) {
	var t = {
		r: 0,
		g: 0,
		b: 0,
		a: 255
	};
	return Array.isArray(e) ? e.length >= 3 && (t = {
		r: e[0],
		g: e[1],
		b: e[2],
		a: 255
	}, e.length > 3 && (t.a = tu(e[3]))) : (t = zu(e, {
		r: 0,
		g: 0,
		b: 0,
		a: 1
	}), t.a = tu(t.a)), t;
}
function Vu(e) {
	return e.charAt(0) === "r" ? Nu(e) : wu(e);
}
var Hu = class e {
	constructor(t) {
		if (t instanceof e) return t;
		let n = typeof t, r;
		n === "object" ? r = Bu(t) : n === "string" && (r = uu(t) || ju(t) || Vu(t)), this._rgb = r, this._valid = !!r;
	}
	get valid() {
		return this._valid;
	}
	get rgb() {
		var e = zu(this._rgb);
		return e && (e.a = nu(e.a)), e;
	}
	set rgb(e) {
		this._rgb = Bu(e);
	}
	rgbString() {
		return this._valid ? Pu(this._rgb) : void 0;
	}
	hexString() {
		return this._valid ? fu(this._rgb) : void 0;
	}
	hslString() {
		return this._valid ? Eu(this._rgb) : void 0;
	}
	mix(e, t) {
		if (e) {
			let n = this.rgb, r = e.rgb, i, a = t === i ? .5 : t, o = 2 * a - 1, s = n.a - r.a, c = ((o * s === -1 ? o : (o + s) / (1 + o * s)) + 1) / 2;
			i = 1 - c, n.r = 255 & c * n.r + i * r.r + .5, n.g = 255 & c * n.g + i * r.g + .5, n.b = 255 & c * n.b + i * r.b + .5, n.a = a * n.a + (1 - a) * r.a, this.rgb = n;
		}
		return this;
	}
	interpolate(e, t) {
		return e && (this._rgb = Lu(this._rgb, e._rgb, t)), this;
	}
	clone() {
		return new e(this.rgb);
	}
	alpha(e) {
		return this._rgb.a = tu(e), this;
	}
	clearer(e) {
		let t = this._rgb;
		return t.a *= 1 - e, this;
	}
	greyscale() {
		let e = this._rgb;
		return e.r = e.g = e.b = Ql(e.r * .3 + e.g * .59 + e.b * .11), this;
	}
	opaquer(e) {
		let t = this._rgb;
		return t.a *= 1 + e, this;
	}
	negate() {
		let e = this._rgb;
		return e.r = 255 - e.r, e.g = 255 - e.g, e.b = 255 - e.b, this;
	}
	lighten(e) {
		return Ru(this._rgb, 2, e), this;
	}
	darken(e) {
		return Ru(this._rgb, 2, -e), this;
	}
	saturate(e) {
		return Ru(this._rgb, 1, e), this;
	}
	desaturate(e) {
		return Ru(this._rgb, 1, -e), this;
	}
	rotate(e) {
		return Tu(this._rgb, e), this;
	}
};
//#endregion
//#region node_modules/chart.js/dist/chunks/helpers.dataset.js
function Uu() {}
var Wu = (() => {
	let e = 0;
	return () => e++;
})();
function V(e) {
	return e == null;
}
function H(e) {
	if (Array.isArray && Array.isArray(e)) return !0;
	let t = Object.prototype.toString.call(e);
	return t.slice(0, 7) === "[object" && t.slice(-6) === "Array]";
}
function U(e) {
	return e !== null && Object.prototype.toString.call(e) === "[object Object]";
}
function Gu(e) {
	return (typeof e == "number" || e instanceof Number) && isFinite(+e);
}
function Ku(e, t) {
	return Gu(e) ? e : t;
}
function W(e, t) {
	return e === void 0 ? t : e;
}
var qu = (e, t) => typeof e == "string" && e.endsWith("%") ? parseFloat(e) / 100 : +e / t, Ju = (e, t) => typeof e == "string" && e.endsWith("%") ? parseFloat(e) / 100 * t : +e;
function Yu(e, t, n) {
	if (e && typeof e.call == "function") return e.apply(n, t);
}
function G(e, t, n, r) {
	let i, a, o;
	if (H(e)) if (a = e.length, r) for (i = a - 1; i >= 0; i--) t.call(n, e[i], i);
	else for (i = 0; i < a; i++) t.call(n, e[i], i);
	else if (U(e)) for (o = Object.keys(e), a = o.length, i = 0; i < a; i++) t.call(n, e[o[i]], o[i]);
}
function Xu(e, t) {
	let n, r, i, a;
	if (!e || !t || e.length !== t.length) return !1;
	for (n = 0, r = e.length; n < r; ++n) if (i = e[n], a = t[n], i.datasetIndex !== a.datasetIndex || i.index !== a.index) return !1;
	return !0;
}
function Zu(e) {
	if (H(e)) return e.map(Zu);
	if (U(e)) {
		let t = Object.create(null), n = Object.keys(e), r = n.length, i = 0;
		for (; i < r; ++i) t[n[i]] = Zu(e[n[i]]);
		return t;
	}
	return e;
}
function Qu(e) {
	return [
		"__proto__",
		"prototype",
		"constructor"
	].indexOf(e) === -1;
}
function $u(e, t, n, r) {
	if (!Qu(e)) return;
	let i = t[e], a = n[e];
	U(i) && U(a) ? ed(i, a, r) : t[e] = Zu(a);
}
function ed(e, t, n) {
	let r = H(t) ? t : [t], i = r.length;
	if (!U(e)) return e;
	n ||= {};
	let a = n.merger || $u, o;
	for (let t = 0; t < i; ++t) {
		if (o = r[t], !U(o)) continue;
		let i = Object.keys(o);
		for (let t = 0, r = i.length; t < r; ++t) a(i[t], e, o, n);
	}
	return e;
}
function td(e, t) {
	return ed(e, t, { merger: nd });
}
function nd(e, t, n) {
	if (!Qu(e)) return;
	let r = t[e], i = n[e];
	U(r) && U(i) ? td(r, i) : Object.prototype.hasOwnProperty.call(t, e) || (t[e] = Zu(i));
}
var rd = {
	"": (e) => e,
	x: (e) => e.x,
	y: (e) => e.y
};
function id(e) {
	let t = e.split("."), n = [], r = "";
	for (let e of t) r += e, r.endsWith("\\") ? r = r.slice(0, -1) + "." : (n.push(r), r = "");
	return n;
}
function ad(e) {
	let t = id(e);
	return (e) => {
		for (let n of t) {
			if (n === "") break;
			e &&= e[n];
		}
		return e;
	};
}
function od(e, t) {
	return (rd[t] || (rd[t] = ad(t)))(e);
}
function sd(e) {
	return e.charAt(0).toUpperCase() + e.slice(1);
}
var cd = (e) => e !== void 0, ld = (e) => typeof e == "function", ud = (e, t) => {
	if (e.size !== t.size) return !1;
	for (let n of e) if (!t.has(n)) return !1;
	return !0;
};
function dd(e) {
	return e.type === "mouseup" || e.type === "click" || e.type === "contextmenu";
}
var K = Math.PI, q = 2 * K, fd = q + K, pd = Infinity, md = K / 180, hd = K / 2, gd = K / 4, _d = K * 2 / 3, vd = Math.log10, yd = Math.sign;
function bd(e, t, n) {
	return Math.abs(e - t) < n;
}
function xd(e) {
	let t = Math.round(e);
	e = bd(e, t, e / 1e3) ? t : e;
	let n = 10 ** Math.floor(vd(e)), r = e / n;
	return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10) * n;
}
function Sd(e) {
	let t = [], n = Math.sqrt(e), r;
	for (r = 1; r < n; r++) e % r === 0 && (t.push(r), t.push(e / r));
	return n === (n | 0) && t.push(n), t.sort((e, t) => e - t).pop(), t;
}
function Cd(e) {
	return typeof e == "symbol" || typeof e == "object" && !!e && !(Symbol.toPrimitive in e || "toString" in e || "valueOf" in e);
}
function wd(e) {
	return !Cd(e) && !isNaN(parseFloat(e)) && isFinite(e);
}
function Td(e, t) {
	let n = Math.round(e);
	return n - t <= e && n + t >= e;
}
function Ed(e, t, n) {
	let r, i, a;
	for (r = 0, i = e.length; r < i; r++) a = e[r][n], isNaN(a) || (t.min = Math.min(t.min, a), t.max = Math.max(t.max, a));
}
function Dd(e) {
	return K / 180 * e;
}
function Od(e) {
	return 180 / K * e;
}
function kd(e) {
	if (!Gu(e)) return;
	let t = 1, n = 0;
	for (; Math.round(e * t) / t !== e;) t *= 10, n++;
	return n;
}
function Ad(e, t) {
	let n = t.x - e.x, r = t.y - e.y, i = Math.sqrt(n * n + r * r), a = Math.atan2(r, n);
	return a < -.5 * K && (a += q), {
		angle: a,
		distance: i
	};
}
function jd(e, t) {
	return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
}
function Md(e, t) {
	return (e - t + fd) % q - K;
}
function Nd(e) {
	return (e % q + q) % q;
}
function Pd(e, t, n, r) {
	let i = Nd(e), a = Nd(t), o = Nd(n), s = Nd(a - i), c = Nd(o - i), l = Nd(i - a), u = Nd(i - o);
	return i === a || i === o || r && a === o || s > c && l < u;
}
function Fd(e, t, n) {
	return Math.max(t, Math.min(n, e));
}
function Id(e) {
	return Fd(e, -32768, 32767);
}
function Ld(e, t, n, r = 1e-6) {
	return e >= Math.min(t, n) - r && e <= Math.max(t, n) + r;
}
function Rd(e, t, n) {
	n ||= ((n) => e[n] < t);
	let r = e.length - 1, i = 0, a;
	for (; r - i > 1;) a = i + r >> 1, n(a) ? i = a : r = a;
	return {
		lo: i,
		hi: r
	};
}
var zd = (e, t, n, r) => Rd(e, n, r ? (r) => {
	let i = e[r][t];
	return i < n || i === n && e[r + 1][t] === n;
} : (r) => e[r][t] < n), Bd = (e, t, n) => Rd(e, n, (r) => e[r][t] >= n);
function Vd(e, t, n) {
	let r = 0, i = e.length;
	for (; r < i && e[r] < t;) r++;
	for (; i > r && e[i - 1] > n;) i--;
	return r > 0 || i < e.length ? e.slice(r, i) : e;
}
var Hd = [
	"push",
	"pop",
	"shift",
	"splice",
	"unshift"
];
function Ud(e, t) {
	if (e._chartjs) {
		e._chartjs.listeners.push(t);
		return;
	}
	Object.defineProperty(e, "_chartjs", {
		configurable: !0,
		enumerable: !1,
		value: { listeners: [t] }
	}), Hd.forEach((t) => {
		let n = "_onData" + sd(t), r = e[t];
		Object.defineProperty(e, t, {
			configurable: !0,
			enumerable: !1,
			value(...t) {
				let i = r.apply(this, t);
				return e._chartjs.listeners.forEach((e) => {
					typeof e[n] == "function" && e[n](...t);
				}), i;
			}
		});
	});
}
function Wd(e, t) {
	let n = e._chartjs;
	if (!n) return;
	let r = n.listeners, i = r.indexOf(t);
	i !== -1 && r.splice(i, 1), !(r.length > 0) && (Hd.forEach((t) => {
		delete e[t];
	}), delete e._chartjs);
}
function Gd(e) {
	let t = new Set(e);
	return t.size === e.length ? e : Array.from(t);
}
var Kd = function() {
	return typeof window > "u" ? function(e) {
		return e();
	} : window.requestAnimationFrame;
}();
function qd(e, t) {
	let n = [], r = !1;
	return function(...i) {
		n = i, r || (r = !0, Kd.call(window, () => {
			r = !1, e.apply(t, n);
		}));
	};
}
function Jd(e, t) {
	let n;
	return function(...r) {
		return t ? (clearTimeout(n), n = setTimeout(e, t, r)) : e.apply(this, r), t;
	};
}
var Yd = (e) => e === "start" ? "left" : e === "end" ? "right" : "center", Xd = (e, t, n) => e === "start" ? t : e === "end" ? n : (t + n) / 2;
function Zd(e, t, n) {
	let r = t.length, i = 0, a = r;
	if (e._sorted) {
		let { iScale: o, vScale: s, _parsed: c } = e, l = e.dataset && e.dataset.options ? e.dataset.options.spanGaps : null, u = o.axis, { min: d, max: f, minDefined: p, maxDefined: m } = o.getUserBounds();
		if (p) {
			if (i = Math.min(zd(c, u, d).lo, n ? r : zd(t, u, o.getPixelForValue(d)).lo), l) {
				let e = c.slice(0, i + 1).reverse().findIndex((e) => !V(e[s.axis]));
				i -= Math.max(0, e);
			}
			i = Fd(i, 0, r - 1);
		}
		if (m) {
			let e = Math.max(zd(c, o.axis, f, !0).hi + 1, n ? 0 : zd(t, u, o.getPixelForValue(f), !0).hi + 1);
			if (l) {
				let t = c.slice(e - 1).findIndex((e) => !V(e[s.axis]));
				e += Math.max(0, t);
			}
			a = Fd(e, i, r) - i;
		} else a = r - i;
	}
	return {
		start: i,
		count: a
	};
}
function Qd(e) {
	let { xScale: t, yScale: n, _scaleRanges: r } = e, i = {
		xmin: t.min,
		xmax: t.max,
		ymin: n.min,
		ymax: n.max
	};
	if (!r) return e._scaleRanges = i, !0;
	let a = r.xmin !== t.min || r.xmax !== t.max || r.ymin !== n.min || r.ymax !== n.max;
	return Object.assign(r, i), a;
}
var $d = (e) => e === 0 || e === 1, ef = (e, t, n) => -(2 ** (10 * --e) * Math.sin((e - t) * q / n)), tf = (e, t, n) => 2 ** (-10 * e) * Math.sin((e - t) * q / n) + 1, nf = {
	linear: (e) => e,
	easeInQuad: (e) => e * e,
	easeOutQuad: (e) => -e * (e - 2),
	easeInOutQuad: (e) => (e /= .5) < 1 ? .5 * e * e : -.5 * (--e * (e - 2) - 1),
	easeInCubic: (e) => e * e * e,
	easeOutCubic: (e) => --e * e * e + 1,
	easeInOutCubic: (e) => (e /= .5) < 1 ? .5 * e * e * e : .5 * ((e -= 2) * e * e + 2),
	easeInQuart: (e) => e * e * e * e,
	easeOutQuart: (e) => -(--e * e * e * e - 1),
	easeInOutQuart: (e) => (e /= .5) < 1 ? .5 * e * e * e * e : -.5 * ((e -= 2) * e * e * e - 2),
	easeInQuint: (e) => e * e * e * e * e,
	easeOutQuint: (e) => --e * e * e * e * e + 1,
	easeInOutQuint: (e) => (e /= .5) < 1 ? .5 * e * e * e * e * e : .5 * ((e -= 2) * e * e * e * e + 2),
	easeInSine: (e) => -Math.cos(e * hd) + 1,
	easeOutSine: (e) => Math.sin(e * hd),
	easeInOutSine: (e) => -.5 * (Math.cos(K * e) - 1),
	easeInExpo: (e) => e === 0 ? 0 : 2 ** (10 * (e - 1)),
	easeOutExpo: (e) => e === 1 ? 1 : -(2 ** (-10 * e)) + 1,
	easeInOutExpo: (e) => $d(e) ? e : e < .5 ? .5 * 2 ** (10 * (e * 2 - 1)) : .5 * (-(2 ** (-10 * (e * 2 - 1))) + 2),
	easeInCirc: (e) => e >= 1 ? e : -(Math.sqrt(1 - e * e) - 1),
	easeOutCirc: (e) => Math.sqrt(1 - --e * e),
	easeInOutCirc: (e) => (e /= .5) < 1 ? -.5 * (Math.sqrt(1 - e * e) - 1) : .5 * (Math.sqrt(1 - (e -= 2) * e) + 1),
	easeInElastic: (e) => $d(e) ? e : ef(e, .075, .3),
	easeOutElastic: (e) => $d(e) ? e : tf(e, .075, .3),
	easeInOutElastic(e) {
		let t = .1125, n = .45;
		return $d(e) ? e : e < .5 ? .5 * ef(e * 2, t, n) : .5 + .5 * tf(e * 2 - 1, t, n);
	},
	easeInBack(e) {
		return e * e * (2.70158 * e - 1.70158);
	},
	easeOutBack(e) {
		return --e * e * (2.70158 * e + 1.70158) + 1;
	},
	easeInOutBack(e) {
		let t = 1.70158;
		return (e /= .5) < 1 ? .5 * (e * e * (((t *= 1.525) + 1) * e - t)) : .5 * ((e -= 2) * e * (((t *= 1.525) + 1) * e + t) + 2);
	},
	easeInBounce: (e) => 1 - nf.easeOutBounce(1 - e),
	easeOutBounce(e) {
		let t = 7.5625, n = 2.75;
		return e < 1 / n ? t * e * e : e < 2 / n ? t * (e -= 1.5 / n) * e + .75 : e < 2.5 / n ? t * (e -= 2.25 / n) * e + .9375 : t * (e -= 2.625 / n) * e + .984375;
	},
	easeInOutBounce: (e) => e < .5 ? nf.easeInBounce(e * 2) * .5 : nf.easeOutBounce(e * 2 - 1) * .5 + .5
};
function rf(e) {
	if (e && typeof e == "object") {
		let t = e.toString();
		return t === "[object CanvasPattern]" || t === "[object CanvasGradient]";
	}
	return !1;
}
function af(e) {
	return rf(e) ? e : new Hu(e);
}
function of(e) {
	return rf(e) ? e : new Hu(e).saturate(.5).darken(.1).hexString();
}
var sf = [
	"x",
	"y",
	"borderWidth",
	"radius",
	"tension"
], cf = [
	"color",
	"borderColor",
	"backgroundColor"
];
function lf(e) {
	e.set("animation", {
		delay: void 0,
		duration: 1e3,
		easing: "easeOutQuart",
		fn: void 0,
		from: void 0,
		loop: void 0,
		to: void 0,
		type: void 0
	}), e.describe("animation", {
		_fallback: !1,
		_indexable: !1,
		_scriptable: (e) => e !== "onProgress" && e !== "onComplete" && e !== "fn"
	}), e.set("animations", {
		colors: {
			type: "color",
			properties: cf
		},
		numbers: {
			type: "number",
			properties: sf
		}
	}), e.describe("animations", { _fallback: "animation" }), e.set("transitions", {
		active: { animation: { duration: 400 } },
		resize: { animation: { duration: 0 } },
		show: { animations: {
			colors: { from: "transparent" },
			visible: {
				type: "boolean",
				duration: 0
			}
		} },
		hide: { animations: {
			colors: { to: "transparent" },
			visible: {
				type: "boolean",
				easing: "linear",
				fn: (e) => e | 0
			}
		} }
	});
}
function uf(e) {
	e.set("layout", {
		autoPadding: !0,
		padding: {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		}
	});
}
var df = /* @__PURE__ */ new Map();
function ff(e, t) {
	t ||= {};
	let n = e + JSON.stringify(t), r = df.get(n);
	return r || (r = new Intl.NumberFormat(e, t), df.set(n, r)), r;
}
function pf(e, t, n) {
	return ff(t, n).format(e);
}
var mf = {
	values(e) {
		return H(e) ? e : "" + e;
	},
	numeric(e, t, n) {
		if (e === 0) return "0";
		let r = this.chart.options.locale, i, a = e;
		if (n.length > 1) {
			let t = Math.max(Math.abs(n[0].value), Math.abs(n[n.length - 1].value));
			(t < 1e-4 || t > 0x38d7ea4c68000) && (i = "scientific"), a = hf(e, n);
		}
		let o = vd(Math.abs(a)), s = isNaN(o) ? 1 : Math.max(Math.min(-1 * Math.floor(o), 20), 0), c = {
			notation: i,
			minimumFractionDigits: s,
			maximumFractionDigits: s
		};
		return Object.assign(c, this.options.ticks.format), pf(e, r, c);
	},
	logarithmic(e, t, n) {
		if (e === 0) return "0";
		let r = n[t].significand || e / 10 ** Math.floor(vd(e));
		return [
			1,
			2,
			3,
			5,
			10,
			15
		].includes(r) || t > .8 * n.length ? mf.numeric.call(this, e, t, n) : "";
	}
};
function hf(e, t) {
	let n = t.length > 3 ? t[2].value - t[1].value : t[1].value - t[0].value;
	return Math.abs(n) >= 1 && e !== Math.floor(e) && (n = e - Math.floor(e)), n;
}
var gf = { formatters: mf };
function _f(e) {
	e.set("scale", {
		display: !0,
		offset: !1,
		reverse: !1,
		beginAtZero: !1,
		bounds: "ticks",
		clip: !0,
		grace: 0,
		grid: {
			display: !0,
			lineWidth: 1,
			drawOnChartArea: !0,
			drawTicks: !0,
			tickLength: 8,
			tickWidth: (e, t) => t.lineWidth,
			tickColor: (e, t) => t.color,
			offset: !1
		},
		border: {
			display: !0,
			dash: [],
			dashOffset: 0,
			width: 1
		},
		title: {
			display: !1,
			text: "",
			padding: {
				top: 4,
				bottom: 4
			}
		},
		ticks: {
			minRotation: 0,
			maxRotation: 50,
			mirror: !1,
			textStrokeWidth: 0,
			textStrokeColor: "",
			padding: 3,
			display: !0,
			autoSkip: !0,
			autoSkipPadding: 3,
			labelOffset: 0,
			callback: gf.formatters.values,
			minor: {},
			major: {},
			align: "center",
			crossAlign: "near",
			showLabelBackdrop: !1,
			backdropColor: "rgba(255, 255, 255, 0.75)",
			backdropPadding: 2
		}
	}), e.route("scale.ticks", "color", "", "color"), e.route("scale.grid", "color", "", "borderColor"), e.route("scale.border", "color", "", "borderColor"), e.route("scale.title", "color", "", "color"), e.describe("scale", {
		_fallback: !1,
		_scriptable: (e) => !e.startsWith("before") && !e.startsWith("after") && e !== "callback" && e !== "parser",
		_indexable: (e) => e !== "borderDash" && e !== "tickBorderDash" && e !== "dash"
	}), e.describe("scales", { _fallback: "scale" }), e.describe("scale.ticks", {
		_scriptable: (e) => e !== "backdropPadding" && e !== "callback",
		_indexable: (e) => e !== "backdropPadding"
	});
}
var vf = Object.create(null), yf = Object.create(null);
function bf(e, t) {
	if (!t) return e;
	let n = t.split(".");
	for (let t = 0, r = n.length; t < r; ++t) {
		let r = n[t];
		e = e[r] || (e[r] = Object.create(null));
	}
	return e;
}
function xf(e, t, n) {
	return typeof t == "string" ? ed(bf(e, t), n) : ed(bf(e, ""), t);
}
var Sf = /* @__PURE__ */ new class {
	constructor(e, t) {
		this.animation = void 0, this.backgroundColor = "rgba(0,0,0,0.1)", this.borderColor = "rgba(0,0,0,0.1)", this.color = "#666", this.datasets = {}, this.devicePixelRatio = (e) => e.chart.platform.getDevicePixelRatio(), this.elements = {}, this.events = [
			"mousemove",
			"mouseout",
			"click",
			"touchstart",
			"touchmove"
		], this.font = {
			family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
			size: 12,
			style: "normal",
			lineHeight: 1.2,
			weight: null
		}, this.hover = {}, this.hoverBackgroundColor = (e, t) => of(t.backgroundColor), this.hoverBorderColor = (e, t) => of(t.borderColor), this.hoverColor = (e, t) => of(t.color), this.indexAxis = "x", this.interaction = {
			mode: "nearest",
			intersect: !0,
			includeInvisible: !1
		}, this.maintainAspectRatio = !0, this.onHover = null, this.onClick = null, this.parsing = !0, this.plugins = {}, this.responsive = !0, this.scale = void 0, this.scales = {}, this.showLine = !0, this.drawActiveElementsOnTop = !0, this.describe(e), this.apply(t);
	}
	set(e, t) {
		return xf(this, e, t);
	}
	get(e) {
		return bf(this, e);
	}
	describe(e, t) {
		return xf(yf, e, t);
	}
	override(e, t) {
		return xf(vf, e, t);
	}
	route(e, t, n, r) {
		let i = bf(this, e), a = bf(this, n), o = "_" + t;
		Object.defineProperties(i, {
			[o]: {
				value: i[t],
				writable: !0
			},
			[t]: {
				enumerable: !0,
				get() {
					let e = this[o], t = a[r];
					return U(e) ? Object.assign({}, t, e) : W(e, t);
				},
				set(e) {
					this[o] = e;
				}
			}
		});
	}
	apply(e) {
		e.forEach((e) => e(this));
	}
}({
	_scriptable: (e) => !e.startsWith("on"),
	_indexable: (e) => e !== "events",
	hover: { _fallback: "interaction" },
	interaction: {
		_scriptable: !1,
		_indexable: !1
	}
}, [
	lf,
	uf,
	_f
]);
function Cf(e) {
	return !e || V(e.size) || V(e.family) ? null : (e.style ? e.style + " " : "") + (e.weight ? e.weight + " " : "") + e.size + "px " + e.family;
}
function wf(e, t, n, r, i) {
	let a = t[i];
	return a || (a = t[i] = e.measureText(i).width, n.push(i)), a > r && (r = a), r;
}
function Tf(e, t, n, r) {
	r ||= {};
	let i = r.data = r.data || {}, a = r.garbageCollect = r.garbageCollect || [];
	r.font !== t && (i = r.data = {}, a = r.garbageCollect = [], r.font = t), e.save(), e.font = t;
	let o = 0, s = n.length, c, l, u, d, f;
	for (c = 0; c < s; c++) if (d = n[c], d != null && !H(d)) o = wf(e, i, a, o, d);
	else if (H(d)) for (l = 0, u = d.length; l < u; l++) f = d[l], f != null && !H(f) && (o = wf(e, i, a, o, f));
	e.restore();
	let p = a.length / 2;
	if (p > n.length) {
		for (c = 0; c < p; c++) delete i[a[c]];
		a.splice(0, p);
	}
	return o;
}
function Ef(e, t, n) {
	let r = e.currentDevicePixelRatio, i = n === 0 ? 0 : Math.max(n / 2, .5);
	return Math.round((t - i) * r) / r + i;
}
function Df(e, t) {
	!t && !e || (t ||= e.getContext("2d"), t.save(), t.resetTransform(), t.clearRect(0, 0, e.width, e.height), t.restore());
}
function Of(e, t, n, r) {
	kf(e, t, n, r, null);
}
function kf(e, t, n, r, i) {
	let a, o, s, c, l, u, d, f, p = t.pointStyle, m = t.rotation, h = t.radius, g = (m || 0) * md;
	if (p && typeof p == "object" && (a = p.toString(), a === "[object HTMLImageElement]" || a === "[object HTMLCanvasElement]")) {
		e.save(), e.translate(n, r), e.rotate(g), e.drawImage(p, -p.width / 2, -p.height / 2, p.width, p.height), e.restore();
		return;
	}
	if (!(isNaN(h) || h <= 0)) {
		switch (e.beginPath(), p) {
			default:
				i ? e.ellipse(n, r, i / 2, h, 0, 0, q) : e.arc(n, r, h, 0, q), e.closePath();
				break;
			case "triangle":
				u = i ? i / 2 : h, e.moveTo(n + Math.sin(g) * u, r - Math.cos(g) * h), g += _d, e.lineTo(n + Math.sin(g) * u, r - Math.cos(g) * h), g += _d, e.lineTo(n + Math.sin(g) * u, r - Math.cos(g) * h), e.closePath();
				break;
			case "rectRounded":
				l = h * .516, c = h - l, o = Math.cos(g + gd) * c, d = Math.cos(g + gd) * (i ? i / 2 - l : c), s = Math.sin(g + gd) * c, f = Math.sin(g + gd) * (i ? i / 2 - l : c), e.arc(n - d, r - s, l, g - K, g - hd), e.arc(n + f, r - o, l, g - hd, g), e.arc(n + d, r + s, l, g, g + hd), e.arc(n - f, r + o, l, g + hd, g + K), e.closePath();
				break;
			case "rect":
				if (!m) {
					c = Math.SQRT1_2 * h, u = i ? i / 2 : c, e.rect(n - u, r - c, 2 * u, 2 * c);
					break;
				}
				g += gd;
			case "rectRot":
				d = Math.cos(g) * (i ? i / 2 : h), o = Math.cos(g) * h, s = Math.sin(g) * h, f = Math.sin(g) * (i ? i / 2 : h), e.moveTo(n - d, r - s), e.lineTo(n + f, r - o), e.lineTo(n + d, r + s), e.lineTo(n - f, r + o), e.closePath();
				break;
			case "crossRot": g += gd;
			case "cross":
				d = Math.cos(g) * (i ? i / 2 : h), o = Math.cos(g) * h, s = Math.sin(g) * h, f = Math.sin(g) * (i ? i / 2 : h), e.moveTo(n - d, r - s), e.lineTo(n + d, r + s), e.moveTo(n + f, r - o), e.lineTo(n - f, r + o);
				break;
			case "star":
				d = Math.cos(g) * (i ? i / 2 : h), o = Math.cos(g) * h, s = Math.sin(g) * h, f = Math.sin(g) * (i ? i / 2 : h), e.moveTo(n - d, r - s), e.lineTo(n + d, r + s), e.moveTo(n + f, r - o), e.lineTo(n - f, r + o), g += gd, d = Math.cos(g) * (i ? i / 2 : h), o = Math.cos(g) * h, s = Math.sin(g) * h, f = Math.sin(g) * (i ? i / 2 : h), e.moveTo(n - d, r - s), e.lineTo(n + d, r + s), e.moveTo(n + f, r - o), e.lineTo(n - f, r + o);
				break;
			case "line":
				o = i ? i / 2 : Math.cos(g) * h, s = Math.sin(g) * h, e.moveTo(n - o, r - s), e.lineTo(n + o, r + s);
				break;
			case "dash":
				e.moveTo(n, r), e.lineTo(n + Math.cos(g) * (i ? i / 2 : h), r + Math.sin(g) * h);
				break;
			case !1:
				e.closePath();
				break;
		}
		e.fill(), t.borderWidth > 0 && e.stroke();
	}
}
function Af(e, t, n) {
	return n ||= .5, !t || e && e.x > t.left - n && e.x < t.right + n && e.y > t.top - n && e.y < t.bottom + n;
}
function jf(e, t) {
	e.save(), e.beginPath(), e.rect(t.left, t.top, t.right - t.left, t.bottom - t.top), e.clip();
}
function Mf(e) {
	e.restore();
}
function Nf(e, t, n, r, i) {
	if (!t) return e.lineTo(n.x, n.y);
	if (i === "middle") {
		let r = (t.x + n.x) / 2;
		e.lineTo(r, t.y), e.lineTo(r, n.y);
	} else i === "after" == !!r ? e.lineTo(n.x, t.y) : e.lineTo(t.x, n.y);
	e.lineTo(n.x, n.y);
}
function Pf(e, t, n, r) {
	if (!t) return e.lineTo(n.x, n.y);
	e.bezierCurveTo(r ? t.cp1x : t.cp2x, r ? t.cp1y : t.cp2y, r ? n.cp2x : n.cp1x, r ? n.cp2y : n.cp1y, n.x, n.y);
}
function Ff(e, t) {
	t.translation && e.translate(t.translation[0], t.translation[1]), V(t.rotation) || e.rotate(t.rotation), t.color && (e.fillStyle = t.color), t.textAlign && (e.textAlign = t.textAlign), t.textBaseline && (e.textBaseline = t.textBaseline);
}
function If(e, t, n, r, i) {
	if (i.strikethrough || i.underline) {
		let a = e.measureText(r), o = t - a.actualBoundingBoxLeft, s = t + a.actualBoundingBoxRight, c = n - a.actualBoundingBoxAscent, l = n + a.actualBoundingBoxDescent, u = i.strikethrough ? (c + l) / 2 : l;
		e.strokeStyle = e.fillStyle, e.beginPath(), e.lineWidth = i.decorationWidth || 2, e.moveTo(o, u), e.lineTo(s, u), e.stroke();
	}
}
function Lf(e, t) {
	let n = e.fillStyle;
	e.fillStyle = t.color, e.fillRect(t.left, t.top, t.width, t.height), e.fillStyle = n;
}
function Rf(e, t, n, r, i, a = {}) {
	let o = H(t) ? t : [t], s = a.strokeWidth > 0 && a.strokeColor !== "", c, l;
	for (e.save(), e.font = i.string, Ff(e, a), c = 0; c < o.length; ++c) l = o[c], a.backdrop && Lf(e, a.backdrop), s && (a.strokeColor && (e.strokeStyle = a.strokeColor), V(a.strokeWidth) || (e.lineWidth = a.strokeWidth), e.strokeText(l, n, r, a.maxWidth)), e.fillText(l, n, r, a.maxWidth), If(e, n, r, l, a), r += Number(i.lineHeight);
	e.restore();
}
function zf(e, t) {
	let { x: n, y: r, w: i, h: a, radius: o } = t;
	e.arc(n + o.topLeft, r + o.topLeft, o.topLeft, 1.5 * K, K, !0), e.lineTo(n, r + a - o.bottomLeft), e.arc(n + o.bottomLeft, r + a - o.bottomLeft, o.bottomLeft, K, hd, !0), e.lineTo(n + i - o.bottomRight, r + a), e.arc(n + i - o.bottomRight, r + a - o.bottomRight, o.bottomRight, hd, 0, !0), e.lineTo(n + i, r + o.topRight), e.arc(n + i - o.topRight, r + o.topRight, o.topRight, 0, -hd, !0), e.lineTo(n + o.topLeft, r);
}
var Bf = /^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/, Vf = /^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;
function Hf(e, t) {
	let n = ("" + e).match(Bf);
	if (!n || n[1] === "normal") return t * 1.2;
	switch (e = +n[2], n[3]) {
		case "px": return e;
		case "%":
			e /= 100;
			break;
	}
	return t * e;
}
var Uf = (e) => +e || 0;
function Wf(e, t) {
	let n = {}, r = U(t), i = r ? Object.keys(t) : t, a = U(e) ? r ? (n) => W(e[n], e[t[n]]) : (t) => e[t] : () => e;
	for (let e of i) n[e] = Uf(a(e));
	return n;
}
function Gf(e) {
	return Wf(e, {
		top: "y",
		right: "x",
		bottom: "y",
		left: "x"
	});
}
function Kf(e) {
	return Wf(e, [
		"topLeft",
		"topRight",
		"bottomLeft",
		"bottomRight"
	]);
}
function qf(e) {
	let t = Gf(e);
	return t.width = t.left + t.right, t.height = t.top + t.bottom, t;
}
function Jf(e, t) {
	e ||= {}, t ||= Sf.font;
	let n = W(e.size, t.size);
	typeof n == "string" && (n = parseInt(n, 10));
	let r = W(e.style, t.style);
	r && !("" + r).match(Vf) && (console.warn("Invalid font style specified: \"" + r + "\""), r = void 0);
	let i = {
		family: W(e.family, t.family),
		lineHeight: Hf(W(e.lineHeight, t.lineHeight), n),
		size: n,
		style: r,
		weight: W(e.weight, t.weight),
		string: ""
	};
	return i.string = Cf(i), i;
}
function Yf(e, t, n, r) {
	let i = !0, a, o, s;
	for (a = 0, o = e.length; a < o; ++a) if (s = e[a], s !== void 0 && (t !== void 0 && typeof s == "function" && (s = s(t), i = !1), n !== void 0 && H(s) && (s = s[n % s.length], i = !1), s !== void 0)) return r && !i && (r.cacheable = !1), s;
}
function Xf(e, t, n) {
	let { min: r, max: i } = e, a = Ju(t, (i - r) / 2), o = (e, t) => n && e === 0 ? 0 : e + t;
	return {
		min: o(r, -Math.abs(a)),
		max: o(i, a)
	};
}
function Zf(e, t) {
	return Object.assign(Object.create(e), t);
}
function Qf(e, t = [""], n, r, i = () => e[0]) {
	let a = n || e;
	return r === void 0 && (r = mp("_fallback", e)), new Proxy({
		[Symbol.toStringTag]: "Object",
		_cacheable: !0,
		_scopes: e,
		_rootScopes: a,
		_fallback: r,
		_getTarget: i,
		override: (n) => Qf([n, ...e], t, a, r)
	}, {
		deleteProperty(t, n) {
			return delete t[n], delete t._keys, delete e[0][n], !0;
		},
		get(n, r) {
			return rp(n, r, () => pp(r, t, e, n));
		},
		getOwnPropertyDescriptor(e, t) {
			return Reflect.getOwnPropertyDescriptor(e._scopes[0], t);
		},
		getPrototypeOf() {
			return Reflect.getPrototypeOf(e[0]);
		},
		has(e, t) {
			return hp(e).includes(t);
		},
		ownKeys(e) {
			return hp(e);
		},
		set(e, t, n) {
			let r = e._storage ||= i();
			return e[t] = r[t] = n, delete e._keys, !0;
		}
	});
}
function $f(e, t, n, r) {
	let i = {
		_cacheable: !1,
		_proxy: e,
		_context: t,
		_subProxy: n,
		_stack: /* @__PURE__ */ new Set(),
		_descriptors: ep(e, r),
		setContext: (t) => $f(e, t, n, r),
		override: (i) => $f(e.override(i), t, n, r)
	};
	return new Proxy(i, {
		deleteProperty(t, n) {
			return delete t[n], delete e[n], !0;
		},
		get(e, t, n) {
			return rp(e, t, () => ip(e, t, n));
		},
		getOwnPropertyDescriptor(t, n) {
			return t._descriptors.allKeys ? Reflect.has(e, n) ? {
				enumerable: !0,
				configurable: !0
			} : void 0 : Reflect.getOwnPropertyDescriptor(e, n);
		},
		getPrototypeOf() {
			return Reflect.getPrototypeOf(e);
		},
		has(t, n) {
			return Reflect.has(e, n);
		},
		ownKeys() {
			return Reflect.ownKeys(e);
		},
		set(t, n, r) {
			return e[n] = r, delete t[n], !0;
		}
	});
}
function ep(e, t = {
	scriptable: !0,
	indexable: !0
}) {
	let { _scriptable: n = t.scriptable, _indexable: r = t.indexable, _allKeys: i = t.allKeys } = e;
	return {
		allKeys: i,
		scriptable: n,
		indexable: r,
		isScriptable: ld(n) ? n : () => n,
		isIndexable: ld(r) ? r : () => r
	};
}
var tp = (e, t) => e ? e + sd(t) : t, np = (e, t) => U(t) && e !== "adapters" && (Object.getPrototypeOf(t) === null || t.constructor === Object);
function rp(e, t, n) {
	if (Object.prototype.hasOwnProperty.call(e, t) || t === "constructor") return e[t];
	let r = n();
	return e[t] = r, r;
}
function ip(e, t, n) {
	let { _proxy: r, _context: i, _subProxy: a, _descriptors: o } = e, s = r[t];
	return ld(s) && o.isScriptable(t) && (s = ap(t, s, e, n)), H(s) && s.length && (s = op(t, s, e, o.isIndexable)), np(t, s) && (s = $f(s, i, a && a[t], o)), s;
}
function ap(e, t, n, r) {
	let { _proxy: i, _context: a, _subProxy: o, _stack: s } = n;
	if (s.has(e)) throw Error("Recursion detected: " + Array.from(s).join("->") + "->" + e);
	s.add(e);
	let c = t(a, o || r);
	return s.delete(e), np(e, c) && (c = up(i._scopes, i, e, c)), c;
}
function op(e, t, n, r) {
	let { _proxy: i, _context: a, _subProxy: o, _descriptors: s } = n;
	if (a.index !== void 0 && r(e)) return t[a.index % t.length];
	if (U(t[0])) {
		let n = t, r = i._scopes.filter((e) => e !== n);
		t = [];
		for (let c of n) {
			let n = up(r, i, e, c);
			t.push($f(n, a, o && o[e], s));
		}
	}
	return t;
}
function sp(e, t, n) {
	return ld(e) ? e(t, n) : e;
}
var cp = (e, t) => e === !0 ? t : typeof e == "string" ? od(t, e) : void 0;
function lp(e, t, n, r, i) {
	for (let a of t) {
		let t = cp(n, a);
		if (t) {
			e.add(t);
			let a = sp(t._fallback, n, i);
			if (a !== void 0 && a !== n && a !== r) return a;
		} else if (t === !1 && r !== void 0 && n !== r) return null;
	}
	return !1;
}
function up(e, t, n, r) {
	let i = t._rootScopes, a = sp(t._fallback, n, r), o = [...e, ...i], s = /* @__PURE__ */ new Set();
	s.add(r);
	let c = dp(s, o, n, a || n, r);
	return c === null || a !== void 0 && a !== n && (c = dp(s, o, a, c, r), c === null) ? !1 : Qf(Array.from(s), [""], i, a, () => fp(t, n, r));
}
function dp(e, t, n, r, i) {
	for (; n;) n = lp(e, t, n, r, i);
	return n;
}
function fp(e, t, n) {
	let r = e._getTarget();
	t in r || (r[t] = {});
	let i = r[t];
	return H(i) && U(n) ? n : i || {};
}
function pp(e, t, n, r) {
	let i;
	for (let a of t) if (i = mp(tp(a, e), n), i !== void 0) return np(e, i) ? up(n, r, e, i) : i;
}
function mp(e, t) {
	for (let n of t) {
		if (!n) continue;
		let t = n[e];
		if (t !== void 0) return t;
	}
}
function hp(e) {
	let t = e._keys;
	return t ||= e._keys = gp(e._scopes), t;
}
function gp(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) for (let e of Object.keys(n).filter((e) => !e.startsWith("_"))) t.add(e);
	return Array.from(t);
}
function _p(e, t, n, r) {
	let { iScale: i } = e, { key: a = "r" } = this._parsing, o = Array(r), s, c, l, u;
	for (s = 0, c = r; s < c; ++s) l = s + n, u = t[l], o[s] = { r: i.parse(od(u, a), l) };
	return o;
}
var vp = 2 ** -52 || 1e-14, yp = (e, t) => t < e.length && !e[t].skip && e[t], bp = (e) => e === "x" ? "y" : "x";
function xp(e, t, n, r) {
	let i = e.skip ? t : e, a = t, o = n.skip ? t : n, s = jd(a, i), c = jd(o, a), l = s / (s + c), u = c / (s + c);
	l = isNaN(l) ? 0 : l, u = isNaN(u) ? 0 : u;
	let d = r * l, f = r * u;
	return {
		previous: {
			x: a.x - d * (o.x - i.x),
			y: a.y - d * (o.y - i.y)
		},
		next: {
			x: a.x + f * (o.x - i.x),
			y: a.y + f * (o.y - i.y)
		}
	};
}
function Sp(e, t, n) {
	let r = e.length, i, a, o, s, c, l = yp(e, 0);
	for (let u = 0; u < r - 1; ++u) if (c = l, l = yp(e, u + 1), !(!c || !l)) {
		if (bd(t[u], 0, vp)) {
			n[u] = n[u + 1] = 0;
			continue;
		}
		i = n[u] / t[u], a = n[u + 1] / t[u], s = i ** 2 + a ** 2, !(s <= 9) && (o = 3 / Math.sqrt(s), n[u] = i * o * t[u], n[u + 1] = a * o * t[u]);
	}
}
function Cp(e, t, n = "x") {
	let r = bp(n), i = e.length, a, o, s, c = yp(e, 0);
	for (let l = 0; l < i; ++l) {
		if (o = s, s = c, c = yp(e, l + 1), !s) continue;
		let i = s[n], u = s[r];
		o && (a = (i - o[n]) / 3, s[`cp1${n}`] = i - a, s[`cp1${r}`] = u - a * t[l]), c && (a = (c[n] - i) / 3, s[`cp2${n}`] = i + a, s[`cp2${r}`] = u + a * t[l]);
	}
}
function wp(e, t = "x") {
	let n = bp(t), r = e.length, i = Array(r).fill(0), a = Array(r), o, s, c, l = yp(e, 0);
	for (o = 0; o < r; ++o) if (s = c, c = l, l = yp(e, o + 1), c) {
		if (l) {
			let e = l[t] - c[t];
			i[o] = e === 0 ? 0 : (l[n] - c[n]) / e;
		}
		a[o] = s ? l ? yd(i[o - 1]) === yd(i[o]) ? (i[o - 1] + i[o]) / 2 : 0 : i[o - 1] : i[o];
	}
	Sp(e, i, a), Cp(e, a, t);
}
function Tp(e, t, n) {
	return Math.max(Math.min(e, n), t);
}
function Ep(e, t) {
	let n, r, i, a, o, s = Af(e[0], t);
	for (n = 0, r = e.length; n < r; ++n) o = a, a = s, s = n < r - 1 && Af(e[n + 1], t), a && (i = e[n], o && (i.cp1x = Tp(i.cp1x, t.left, t.right), i.cp1y = Tp(i.cp1y, t.top, t.bottom)), s && (i.cp2x = Tp(i.cp2x, t.left, t.right), i.cp2y = Tp(i.cp2y, t.top, t.bottom)));
}
function Dp(e, t, n, r, i) {
	let a, o, s, c;
	if (t.spanGaps && (e = e.filter((e) => !e.skip)), t.cubicInterpolationMode === "monotone") wp(e, i);
	else {
		let n = r ? e[e.length - 1] : e[0];
		for (a = 0, o = e.length; a < o; ++a) s = e[a], c = xp(n, s, e[Math.min(a + 1, o - +!r) % o], t.tension), s.cp1x = c.previous.x, s.cp1y = c.previous.y, s.cp2x = c.next.x, s.cp2y = c.next.y, n = s;
	}
	t.capBezierPoints && Ep(e, n);
}
function Op() {
	return typeof window < "u" && typeof document < "u";
}
function kp(e) {
	let t = e.parentNode;
	return t && t.toString() === "[object ShadowRoot]" && (t = t.host), t;
}
function Ap(e, t, n) {
	let r;
	return typeof e == "string" ? (r = parseInt(e, 10), e.indexOf("%") !== -1 && (r = r / 100 * t.parentNode[n])) : r = e, r;
}
var jp = (e) => e.ownerDocument.defaultView.getComputedStyle(e, null);
function Mp(e, t) {
	return jp(e).getPropertyValue(t);
}
var Np = [
	"top",
	"right",
	"bottom",
	"left"
];
function Pp(e, t, n) {
	let r = {};
	n = n ? "-" + n : "";
	for (let i = 0; i < 4; i++) {
		let a = Np[i];
		r[a] = parseFloat(e[t + "-" + a + n]) || 0;
	}
	return r.width = r.left + r.right, r.height = r.top + r.bottom, r;
}
var Fp = (e, t, n) => (e > 0 || t > 0) && (!n || !n.shadowRoot);
function Ip(e, t) {
	let n = e.touches, r = n && n.length ? n[0] : e, { offsetX: i, offsetY: a } = r, o = !1, s, c;
	if (Fp(i, a, e.target)) s = i, c = a;
	else {
		let e = t.getBoundingClientRect();
		s = r.clientX - e.left, c = r.clientY - e.top, o = !0;
	}
	return {
		x: s,
		y: c,
		box: o
	};
}
function Lp(e, t) {
	if ("native" in e) return e;
	let { canvas: n, currentDevicePixelRatio: r } = t, i = jp(n), a = i.boxSizing === "border-box", o = Pp(i, "padding"), s = Pp(i, "border", "width"), { x: c, y: l, box: u } = Ip(e, n), d = o.left + (u && s.left), f = o.top + (u && s.top), { width: p, height: m } = t;
	return a && (p -= o.width + s.width, m -= o.height + s.height), {
		x: Math.round((c - d) / p * n.width / r),
		y: Math.round((l - f) / m * n.height / r)
	};
}
function Rp(e, t, n) {
	let r, i;
	if (t === void 0 || n === void 0) {
		let a = e && kp(e);
		if (!a) t = e.clientWidth, n = e.clientHeight;
		else {
			let e = a.getBoundingClientRect(), o = jp(a), s = Pp(o, "border", "width"), c = Pp(o, "padding");
			t = e.width - c.width - s.width, n = e.height - c.height - s.height, r = Ap(o.maxWidth, a, "clientWidth"), i = Ap(o.maxHeight, a, "clientHeight");
		}
	}
	return {
		width: t,
		height: n,
		maxWidth: r || pd,
		maxHeight: i || pd
	};
}
var zp = (e) => Math.round(e * 10) / 10;
function Bp(e, t, n, r) {
	let i = jp(e), a = Pp(i, "margin"), o = Ap(i.maxWidth, e, "clientWidth") || pd, s = Ap(i.maxHeight, e, "clientHeight") || pd, c = Rp(e, t, n), { width: l, height: u } = c;
	if (i.boxSizing === "content-box") {
		let e = Pp(i, "border", "width"), t = Pp(i, "padding");
		l -= t.width + e.width, u -= t.height + e.height;
	}
	return l = Math.max(0, l - a.width), u = Math.max(0, r ? l / r : u - a.height), l = zp(Math.min(l, o, c.maxWidth)), u = zp(Math.min(u, s, c.maxHeight)), l && !u && (u = zp(l / 2)), (t !== void 0 || n !== void 0) && r && c.height && u > c.height && (u = c.height, l = zp(Math.floor(u * r))), {
		width: l,
		height: u
	};
}
function Vp(e, t, n) {
	let r = t || 1, i = zp(e.height * r), a = zp(e.width * r);
	e.height = zp(e.height), e.width = zp(e.width);
	let o = e.canvas;
	return o.style && (n || !o.style.height && !o.style.width) && (o.style.height = `${e.height}px`, o.style.width = `${e.width}px`), e.currentDevicePixelRatio !== r || o.height !== i || o.width !== a ? (e.currentDevicePixelRatio = r, o.height = i, o.width = a, e.ctx.setTransform(r, 0, 0, r, 0, 0), !0) : !1;
}
var Hp = function() {
	let e = !1;
	try {
		let t = { get passive() {
			return e = !0, !1;
		} };
		Op() && (window.addEventListener("test", null, t), window.removeEventListener("test", null, t));
	} catch {}
	return e;
}();
function Up(e, t) {
	let n = Mp(e, t), r = n && n.match(/^(\d+)(\.\d+)?px$/);
	return r ? +r[1] : void 0;
}
function Wp(e, t, n, r) {
	return {
		x: e.x + n * (t.x - e.x),
		y: e.y + n * (t.y - e.y)
	};
}
function Gp(e, t, n, r) {
	return {
		x: e.x + n * (t.x - e.x),
		y: r === "middle" ? n < .5 ? e.y : t.y : r === "after" ? n < 1 ? e.y : t.y : n > 0 ? t.y : e.y
	};
}
function Kp(e, t, n, r) {
	let i = {
		x: e.cp2x,
		y: e.cp2y
	}, a = {
		x: t.cp1x,
		y: t.cp1y
	}, o = Wp(e, i, n), s = Wp(i, a, n), c = Wp(a, t, n);
	return Wp(Wp(o, s, n), Wp(s, c, n), n);
}
var qp = function(e, t) {
	return {
		x(n) {
			return e + e + t - n;
		},
		setWidth(e) {
			t = e;
		},
		textAlign(e) {
			return e === "center" ? e : e === "right" ? "left" : "right";
		},
		xPlus(e, t) {
			return e - t;
		},
		leftForLtr(e, t) {
			return e - t;
		}
	};
}, Jp = function() {
	return {
		x(e) {
			return e;
		},
		setWidth(e) {},
		textAlign(e) {
			return e;
		},
		xPlus(e, t) {
			return e + t;
		},
		leftForLtr(e, t) {
			return e;
		}
	};
};
function Yp(e, t, n) {
	return e ? qp(t, n) : Jp();
}
function Xp(e, t) {
	let n, r;
	(t === "ltr" || t === "rtl") && (n = e.canvas.style, r = [n.getPropertyValue("direction"), n.getPropertyPriority("direction")], n.setProperty("direction", t, "important"), e.prevTextDirection = r);
}
function Zp(e, t) {
	t !== void 0 && (delete e.prevTextDirection, e.canvas.style.setProperty("direction", t[0], t[1]));
}
function Qp(e) {
	return e === "angle" ? {
		between: Pd,
		compare: Md,
		normalize: Nd
	} : {
		between: Ld,
		compare: (e, t) => e - t,
		normalize: (e) => e
	};
}
function $p({ start: e, end: t, count: n, loop: r, style: i }) {
	return {
		start: e % n,
		end: t % n,
		loop: r && (t - e + 1) % n === 0,
		style: i
	};
}
function em(e, t, n) {
	let { property: r, start: i, end: a } = n, { between: o, normalize: s } = Qp(r), c = t.length, { start: l, end: u, loop: d } = e, f, p;
	if (d) {
		for (l += c, u += c, f = 0, p = c; f < p && o(s(t[l % c][r]), i, a); ++f) l--, u--;
		l %= c, u %= c;
	}
	return u < l && (u += c), {
		start: l,
		end: u,
		loop: d,
		style: e.style
	};
}
function tm(e, t, n) {
	if (!n) return [e];
	let { property: r, start: i, end: a } = n, o = t.length, { compare: s, between: c, normalize: l } = Qp(r), { start: u, end: d, loop: f, style: p } = em(e, t, n), m = [], h = !1, g = null, _, v, y, b = () => c(i, y, _) && s(i, y) !== 0, x = () => s(a, _) === 0 || c(a, y, _), S = () => h || b(), C = () => !h || x();
	for (let e = u, n = u; e <= d; ++e) v = t[e % o], !v.skip && (_ = l(v[r]), _ !== y && (h = c(_, i, a), g === null && S() && (g = s(_, i) === 0 ? e : n), g !== null && C() && (m.push($p({
		start: g,
		end: e,
		loop: f,
		count: o,
		style: p
	})), g = null), n = e, y = _));
	return g !== null && m.push($p({
		start: g,
		end: d,
		loop: f,
		count: o,
		style: p
	})), m;
}
function nm(e, t) {
	let n = [], r = e.segments;
	for (let i = 0; i < r.length; i++) {
		let a = tm(r[i], e.points, t);
		a.length && n.push(...a);
	}
	return n;
}
function rm(e, t, n, r) {
	let i = 0, a = t - 1;
	if (n && !r) for (; i < t && !e[i].skip;) i++;
	for (; i < t && e[i].skip;) i++;
	for (i %= t, n && (a += i); a > i && e[a % t].skip;) a--;
	return a %= t, {
		start: i,
		end: a
	};
}
function im(e, t, n, r) {
	let i = e.length, a = [], o = t, s = e[t], c;
	for (c = t + 1; c <= n; ++c) {
		let n = e[c % i];
		n.skip || n.stop ? s.skip || (r = !1, a.push({
			start: t % i,
			end: (c - 1) % i,
			loop: r
		}), t = o = n.stop ? c : null) : (o = c, s.skip && (t = c)), s = n;
	}
	return o !== null && a.push({
		start: t % i,
		end: o % i,
		loop: r
	}), a;
}
function am(e, t) {
	let n = e.points, r = e.options.spanGaps, i = n.length;
	if (!i) return [];
	let a = !!e._loop, { start: o, end: s } = rm(n, i, a, r);
	return r === !0 ? om(e, [{
		start: o,
		end: s,
		loop: a
	}], n, t) : om(e, im(n, o, s < o ? s + i : s, !!e._fullLoop && o === 0 && s === i - 1), n, t);
}
function om(e, t, n, r) {
	return !r || !r.setContext || !n ? t : sm(e, t, n, r);
}
function sm(e, t, n, r) {
	let i = e._chart.getContext(), a = cm(e.options), { _datasetIndex: o, options: { spanGaps: s } } = e, c = n.length, l = [], u = a, d = t[0].start, f = d;
	function p(e, t, r, i) {
		let a = s ? -1 : 1;
		if (e !== t) {
			for (e += c; n[e % c].skip;) e -= a;
			for (; n[t % c].skip;) t += a;
			e % c !== t % c && (l.push({
				start: e % c,
				end: t % c,
				loop: r,
				style: i
			}), u = i, d = t % c);
		}
	}
	for (let e of t) {
		d = s ? d : e.start;
		let t = n[d % c], a;
		for (f = d + 1; f <= e.end; f++) {
			let s = n[f % c];
			a = cm(r.setContext(Zf(i, {
				type: "segment",
				p0: t,
				p1: s,
				p0DataIndex: (f - 1) % c,
				p1DataIndex: f % c,
				datasetIndex: o
			}))), lm(a, u) && p(d, f - 1, e.loop, u), t = s, u = a;
		}
		d < f - 1 && p(d, f - 1, e.loop, u);
	}
	return l;
}
function cm(e) {
	return {
		backgroundColor: e.backgroundColor,
		borderCapStyle: e.borderCapStyle,
		borderDash: e.borderDash,
		borderDashOffset: e.borderDashOffset,
		borderJoinStyle: e.borderJoinStyle,
		borderWidth: e.borderWidth,
		borderColor: e.borderColor
	};
}
function lm(e, t) {
	if (!t) return !1;
	let n = [], r = function(e, t) {
		return rf(t) ? (n.includes(t) || n.push(t), n.indexOf(t)) : t;
	};
	return JSON.stringify(e, r) !== JSON.stringify(t, r);
}
function um(e, t, n) {
	return e.options.clip ? e[n] : t[n];
}
function dm(e, t) {
	let { xScale: n, yScale: r } = e;
	return n && r ? {
		left: um(n, t, "left"),
		right: um(n, t, "right"),
		top: um(r, t, "top"),
		bottom: um(r, t, "bottom")
	} : t;
}
function fm(e, t) {
	let n = t._clip;
	if (n.disabled) return !1;
	let r = dm(t, e.chartArea);
	return {
		left: n.left === !1 ? 0 : r.left - (n.left === !0 ? 0 : n.left),
		right: n.right === !1 ? e.width : r.right + (n.right === !0 ? 0 : n.right),
		top: n.top === !1 ? 0 : r.top - (n.top === !0 ? 0 : n.top),
		bottom: n.bottom === !1 ? e.height : r.bottom + (n.bottom === !0 ? 0 : n.bottom)
	};
}
var pm = /* @__PURE__ */ new class {
	constructor() {
		this._request = null, this._charts = /* @__PURE__ */ new Map(), this._running = !1, this._lastDate = void 0;
	}
	_notify(e, t, n, r) {
		let i = t.listeners[r], a = t.duration;
		i.forEach((r) => r({
			chart: e,
			initial: t.initial,
			numSteps: a,
			currentStep: Math.min(n - t.start, a)
		}));
	}
	_refresh() {
		this._request ||= (this._running = !0, Kd.call(window, () => {
			this._update(), this._request = null, this._running && this._refresh();
		}));
	}
	_update(e = Date.now()) {
		let t = 0;
		this._charts.forEach((n, r) => {
			if (!n.running || !n.items.length) return;
			let i = n.items, a = i.length - 1, o = !1, s;
			for (; a >= 0; --a) s = i[a], s._active ? (s._total > n.duration && (n.duration = s._total), s.tick(e), o = !0) : (i[a] = i[i.length - 1], i.pop());
			o && (r.draw(), this._notify(r, n, e, "progress")), i.length || (n.running = !1, this._notify(r, n, e, "complete"), n.initial = !1), t += i.length;
		}), this._lastDate = e, t === 0 && (this._running = !1);
	}
	_getAnims(e) {
		let t = this._charts, n = t.get(e);
		return n || (n = {
			running: !1,
			initial: !0,
			items: [],
			listeners: {
				complete: [],
				progress: []
			}
		}, t.set(e, n)), n;
	}
	listen(e, t, n) {
		this._getAnims(e).listeners[t].push(n);
	}
	add(e, t) {
		!t || !t.length || this._getAnims(e).items.push(...t);
	}
	has(e) {
		return this._getAnims(e).items.length > 0;
	}
	start(e) {
		let t = this._charts.get(e);
		t && (t.running = !0, t.start = Date.now(), t.duration = t.items.reduce((e, t) => Math.max(e, t._duration), 0), this._refresh());
	}
	running(e) {
		if (!this._running) return !1;
		let t = this._charts.get(e);
		return !(!t || !t.running || !t.items.length);
	}
	stop(e) {
		let t = this._charts.get(e);
		if (!t || !t.items.length) return;
		let n = t.items, r = n.length - 1;
		for (; r >= 0; --r) n[r].cancel();
		t.items = [], this._notify(e, t, Date.now(), "complete");
	}
	remove(e) {
		return this._charts.delete(e);
	}
}(), mm = "transparent", hm = {
	boolean(e, t, n) {
		return n > .5 ? t : e;
	},
	color(e, t, n) {
		let r = af(e || mm), i = r.valid && af(t || mm);
		return i && i.valid ? i.mix(r, n).hexString() : t;
	},
	number(e, t, n) {
		return e + (t - e) * n;
	}
}, gm = class {
	constructor(e, t, n, r) {
		let i = t[n];
		r = Yf([
			e.to,
			r,
			i,
			e.from
		]);
		let a = Yf([
			e.from,
			i,
			r
		]);
		this._active = !0, this._fn = e.fn || hm[e.type || typeof a], this._easing = nf[e.easing] || nf.linear, this._start = Math.floor(Date.now() + (e.delay || 0)), this._duration = this._total = Math.floor(e.duration), this._loop = !!e.loop, this._target = t, this._prop = n, this._from = a, this._to = r, this._promises = void 0;
	}
	active() {
		return this._active;
	}
	update(e, t, n) {
		if (this._active) {
			this._notify(!1);
			let r = this._target[this._prop], i = n - this._start, a = this._duration - i;
			this._start = n, this._duration = Math.floor(Math.max(a, e.duration)), this._total += i, this._loop = !!e.loop, this._to = Yf([
				e.to,
				t,
				r,
				e.from
			]), this._from = Yf([
				e.from,
				r,
				t
			]);
		}
	}
	cancel() {
		this._active && (this.tick(Date.now()), this._active = !1, this._notify(!1));
	}
	tick(e) {
		let t = e - this._start, n = this._duration, r = this._prop, i = this._from, a = this._loop, o = this._to, s;
		if (this._active = i !== o && (a || t < n), !this._active) {
			this._target[r] = o, this._notify(!0);
			return;
		}
		if (t < 0) {
			this._target[r] = i;
			return;
		}
		s = t / n % 2, s = a && s > 1 ? 2 - s : s, s = this._easing(Math.min(1, Math.max(0, s))), this._target[r] = this._fn(i, o, s);
	}
	wait() {
		let e = this._promises ||= [];
		return new Promise((t, n) => {
			e.push({
				res: t,
				rej: n
			});
		});
	}
	_notify(e) {
		let t = e ? "res" : "rej", n = this._promises || [];
		for (let e = 0; e < n.length; e++) n[e][t]();
	}
}, _m = class {
	constructor(e, t) {
		this._chart = e, this._properties = /* @__PURE__ */ new Map(), this.configure(t);
	}
	configure(e) {
		if (!U(e)) return;
		let t = Object.keys(Sf.animation), n = this._properties;
		Object.getOwnPropertyNames(e).forEach((r) => {
			let i = e[r];
			if (!U(i)) return;
			let a = {};
			for (let e of t) a[e] = i[e];
			(H(i.properties) && i.properties || [r]).forEach((e) => {
				(e === r || !n.has(e)) && n.set(e, a);
			});
		});
	}
	_animateOptions(e, t) {
		let n = t.options, r = ym(e, n);
		if (!r) return [];
		let i = this._createAnimations(r, n);
		return n.$shared && vm(e.options.$animations, n).then(() => {
			e.options = n;
		}, () => {}), i;
	}
	_createAnimations(e, t) {
		let n = this._properties, r = [], i = e.$animations ||= {}, a = Object.keys(t), o = Date.now(), s;
		for (s = a.length - 1; s >= 0; --s) {
			let c = a[s];
			if (c.charAt(0) === "$") continue;
			if (c === "options") {
				r.push(...this._animateOptions(e, t));
				continue;
			}
			let l = t[c], u = i[c], d = n.get(c);
			if (u) if (d && u.active()) {
				u.update(d, l, o);
				continue;
			} else u.cancel();
			if (!d || !d.duration) {
				e[c] = l;
				continue;
			}
			i[c] = u = new gm(d, e, c, l), r.push(u);
		}
		return r;
	}
	update(e, t) {
		if (this._properties.size === 0) {
			Object.assign(e, t);
			return;
		}
		let n = this._createAnimations(e, t);
		if (n.length) return pm.add(this._chart, n), !0;
	}
};
function vm(e, t) {
	let n = [], r = Object.keys(t);
	for (let t = 0; t < r.length; t++) {
		let i = e[r[t]];
		i && i.active() && n.push(i.wait());
	}
	return Promise.all(n);
}
function ym(e, t) {
	if (!t) return;
	let n = e.options;
	if (!n) {
		e.options = t;
		return;
	}
	return n.$shared && (e.options = n = Object.assign({}, n, {
		$shared: !1,
		$animations: {}
	})), n;
}
function bm(e, t) {
	let n = e && e.options || {}, r = n.reverse, i = n.min === void 0 ? t : 0, a = n.max === void 0 ? t : 0;
	return {
		start: r ? a : i,
		end: r ? i : a
	};
}
function xm(e, t, n) {
	if (n === !1) return !1;
	let r = bm(e, n), i = bm(t, n);
	return {
		top: i.end,
		right: r.end,
		bottom: i.start,
		left: r.start
	};
}
function Sm(e) {
	let t, n, r, i;
	return U(e) ? (t = e.top, n = e.right, r = e.bottom, i = e.left) : t = n = r = i = e, {
		top: t,
		right: n,
		bottom: r,
		left: i,
		disabled: e === !1
	};
}
function Cm(e, t) {
	let n = [], r = e._getSortedDatasetMetas(t), i, a;
	for (i = 0, a = r.length; i < a; ++i) n.push(r[i].index);
	return n;
}
function wm(e, t, n, r = {}) {
	let i = e.keys, a = r.mode === "single", o, s, c, l;
	if (t === null) return;
	let u = !1;
	for (o = 0, s = i.length; o < s; ++o) {
		if (c = +i[o], c === n) {
			if (u = !0, r.all) continue;
			break;
		}
		l = e.values[c], Gu(l) && (a || t === 0 || yd(t) === yd(l)) && (t += l);
	}
	return !u && !r.all ? 0 : t;
}
function Tm(e, t) {
	let { iScale: n, vScale: r } = t, i = n.axis === "x" ? "x" : "y", a = r.axis === "x" ? "x" : "y", o = Object.keys(e), s = Array(o.length), c, l, u;
	for (c = 0, l = o.length; c < l; ++c) u = o[c], s[c] = {
		[i]: u,
		[a]: e[u]
	};
	return s;
}
function Em(e, t) {
	let n = e && e.options.stacked;
	return n || n === void 0 && t.stack !== void 0;
}
function Dm(e, t, n) {
	return `${e.id}.${t.id}.${n.stack || n.type}`;
}
function Om(e) {
	let { min: t, max: n, minDefined: r, maxDefined: i } = e.getUserBounds();
	return {
		min: r ? t : -Infinity,
		max: i ? n : Infinity
	};
}
function km(e, t, n) {
	let r = e[t] || (e[t] = {});
	return r[n] || (r[n] = {});
}
function Am(e, t, n, r) {
	for (let i of t.getMatchingVisibleMetas(r).reverse()) {
		let t = e[i.index];
		if (n && t > 0 || !n && t < 0) return i.index;
	}
	return null;
}
function jm(e, t) {
	let { chart: n, _cachedMeta: r } = e, i = n._stacks ||= {}, { iScale: a, vScale: o, index: s } = r, c = a.axis, l = o.axis, u = Dm(a, o, r), d = t.length, f;
	for (let e = 0; e < d; ++e) {
		let n = t[e], { [c]: a, [l]: d } = n, p = n._stacks ||= {};
		f = p[l] = km(i, u, a), f[s] = d, f._top = Am(f, o, !0, r.type), f._bottom = Am(f, o, !1, r.type);
		let m = f._visualValues ||= {};
		m[s] = d;
	}
}
function Mm(e, t) {
	let n = e.scales;
	return Object.keys(n).filter((e) => n[e].axis === t).shift();
}
function Nm(e, t) {
	return Zf(e, {
		active: !1,
		dataset: void 0,
		datasetIndex: t,
		index: t,
		mode: "default",
		type: "dataset"
	});
}
function Pm(e, t, n) {
	return Zf(e, {
		active: !1,
		dataIndex: t,
		parsed: void 0,
		raw: void 0,
		element: n,
		index: t,
		mode: "default",
		type: "data"
	});
}
function Fm(e, t) {
	let n = e.controller.index, r = e.vScale && e.vScale.axis;
	if (r) {
		t ||= e._parsed;
		for (let e of t) {
			let t = e._stacks;
			if (!t || t[r] === void 0 || t[r][n] === void 0) return;
			delete t[r][n], t[r]._visualValues !== void 0 && t[r]._visualValues[n] !== void 0 && delete t[r]._visualValues[n];
		}
	}
}
var Im = (e) => e === "reset" || e === "none", Lm = (e, t) => t ? e : Object.assign({}, e), Rm = (e, t, n) => e && !t.hidden && t._stacked && {
	keys: Cm(n, !0),
	values: null
}, zm = class {
	static defaults = {};
	static datasetElementType = null;
	static dataElementType = null;
	constructor(e, t) {
		this.chart = e, this._ctx = e.ctx, this.index = t, this._cachedDataOpts = {}, this._cachedMeta = this.getMeta(), this._type = this._cachedMeta.type, this.options = void 0, this._parsing = !1, this._data = void 0, this._objectData = void 0, this._sharedOptions = void 0, this._drawStart = void 0, this._drawCount = void 0, this.enableOptionSharing = !1, this.supportsDecimation = !1, this.$context = void 0, this._syncList = [], this.datasetElementType = new.target.datasetElementType, this.dataElementType = new.target.dataElementType, this.initialize();
	}
	initialize() {
		let e = this._cachedMeta;
		this.configure(), this.linkScales(), e._stacked = Em(e.vScale, e), this.addElements(), this.options.fill && !this.chart.isPluginEnabled("filler") && console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options");
	}
	updateIndex(e) {
		this.index !== e && Fm(this._cachedMeta), this.index = e;
	}
	linkScales() {
		let e = this.chart, t = this._cachedMeta, n = this.getDataset(), r = (e, t, n, r) => e === "x" ? t : e === "r" ? r : n, i = t.xAxisID = W(n.xAxisID, Mm(e, "x")), a = t.yAxisID = W(n.yAxisID, Mm(e, "y")), o = t.rAxisID = W(n.rAxisID, Mm(e, "r")), s = t.indexAxis, c = t.iAxisID = r(s, i, a, o), l = t.vAxisID = r(s, a, i, o);
		t.xScale = this.getScaleForId(i), t.yScale = this.getScaleForId(a), t.rScale = this.getScaleForId(o), t.iScale = this.getScaleForId(c), t.vScale = this.getScaleForId(l);
	}
	getDataset() {
		return this.chart.data.datasets[this.index];
	}
	getMeta() {
		return this.chart.getDatasetMeta(this.index);
	}
	getScaleForId(e) {
		return this.chart.scales[e];
	}
	_getOtherScale(e) {
		let t = this._cachedMeta;
		return e === t.iScale ? t.vScale : t.iScale;
	}
	reset() {
		this._update("reset");
	}
	_destroy() {
		let e = this._cachedMeta;
		this._data && Wd(this._data, this), e._stacked && Fm(e);
	}
	_dataCheck() {
		let e = this.getDataset(), t = e.data ||= [], n = this._data;
		if (U(t)) {
			let e = this._cachedMeta;
			this._data = Tm(t, e);
		} else if (n !== t) {
			if (n) {
				Wd(n, this);
				let e = this._cachedMeta;
				Fm(e), e._parsed = [];
			}
			t && Object.isExtensible(t) && Ud(t, this), this._syncList = [], this._data = t;
		}
	}
	addElements() {
		let e = this._cachedMeta;
		this._dataCheck(), this.datasetElementType && (e.dataset = new this.datasetElementType());
	}
	buildOrUpdateElements(e) {
		let t = this._cachedMeta, n = this.getDataset(), r = !1;
		this._dataCheck();
		let i = t._stacked;
		t._stacked = Em(t.vScale, t), t.stack !== n.stack && (r = !0, Fm(t), t.stack = n.stack), this._resyncElements(e), (r || i !== t._stacked) && (jm(this, t._parsed), t._stacked = Em(t.vScale, t));
	}
	configure() {
		let e = this.chart.config, t = e.datasetScopeKeys(this._type), n = e.getOptionScopes(this.getDataset(), t, !0);
		this.options = e.createResolver(n, this.getContext()), this._parsing = this.options.parsing, this._cachedDataOpts = {};
	}
	parse(e, t) {
		let { _cachedMeta: n, _data: r } = this, { iScale: i, _stacked: a } = n, o = i.axis, s = e === 0 && t === r.length ? !0 : n._sorted, c = e > 0 && n._parsed[e - 1], l, u, d;
		if (this._parsing === !1) n._parsed = r, n._sorted = !0, d = r;
		else {
			d = H(r[e]) ? this.parseArrayData(n, r, e, t) : U(r[e]) ? this.parseObjectData(n, r, e, t) : this.parsePrimitiveData(n, r, e, t);
			let i = () => u[o] === null || c && u[o] < c[o];
			for (l = 0; l < t; ++l) n._parsed[l + e] = u = d[l], s && (i() && (s = !1), c = u);
			n._sorted = s;
		}
		a && jm(this, d);
	}
	parsePrimitiveData(e, t, n, r) {
		let { iScale: i, vScale: a } = e, o = i.axis, s = a.axis, c = i.getLabels(), l = i === a, u = Array(r), d, f, p;
		for (d = 0, f = r; d < f; ++d) p = d + n, u[d] = {
			[o]: l || i.parse(c[p], p),
			[s]: a.parse(t[p], p)
		};
		return u;
	}
	parseArrayData(e, t, n, r) {
		let { xScale: i, yScale: a } = e, o = Array(r), s, c, l, u;
		for (s = 0, c = r; s < c; ++s) l = s + n, u = t[l], o[s] = {
			x: i.parse(u[0], l),
			y: a.parse(u[1], l)
		};
		return o;
	}
	parseObjectData(e, t, n, r) {
		let { xScale: i, yScale: a } = e, { xAxisKey: o = "x", yAxisKey: s = "y" } = this._parsing, c = Array(r), l, u, d, f;
		for (l = 0, u = r; l < u; ++l) d = l + n, f = t[d], c[l] = {
			x: i.parse(od(f, o), d),
			y: a.parse(od(f, s), d)
		};
		return c;
	}
	getParsed(e) {
		return this._cachedMeta._parsed[e];
	}
	getDataElement(e) {
		return this._cachedMeta.data[e];
	}
	applyStack(e, t, n) {
		let r = this.chart, i = this._cachedMeta, a = t[e.axis];
		return wm({
			keys: Cm(r, !0),
			values: t._stacks[e.axis]._visualValues
		}, a, i.index, { mode: n });
	}
	updateRangeFromParsed(e, t, n, r) {
		let i = n[t.axis], a = i === null ? NaN : i, o = r && n._stacks[t.axis];
		r && o && (r.values = o, a = wm(r, i, this._cachedMeta.index)), e.min = Math.min(e.min, a), e.max = Math.max(e.max, a);
	}
	getMinMax(e, t) {
		let n = this._cachedMeta, r = n._parsed, i = n._sorted && e === n.iScale, a = r.length, o = this._getOtherScale(e), s = Rm(t, n, this.chart), c = {
			min: Infinity,
			max: -Infinity
		}, { min: l, max: u } = Om(o), d, f;
		function p() {
			f = r[d];
			let t = f[o.axis];
			return !Gu(f[e.axis]) || l > t || u < t;
		}
		for (d = 0; d < a && !(!p() && (this.updateRangeFromParsed(c, e, f, s), i)); ++d);
		if (i) {
			for (d = a - 1; d >= 0; --d) if (!p()) {
				this.updateRangeFromParsed(c, e, f, s);
				break;
			}
		}
		return c;
	}
	getAllParsedValues(e) {
		let t = this._cachedMeta._parsed, n = [], r, i, a;
		for (r = 0, i = t.length; r < i; ++r) a = t[r][e.axis], Gu(a) && n.push(a);
		return n;
	}
	getMaxOverflow() {
		return !1;
	}
	getLabelAndValue(e) {
		let t = this._cachedMeta, n = t.iScale, r = t.vScale, i = this.getParsed(e);
		return {
			label: n ? "" + n.getLabelForValue(i[n.axis]) : "",
			value: r ? "" + r.getLabelForValue(i[r.axis]) : ""
		};
	}
	_update(e) {
		let t = this._cachedMeta;
		this.update(e || "default"), t._clip = Sm(W(this.options.clip, xm(t.xScale, t.yScale, this.getMaxOverflow())));
	}
	update(e) {}
	draw() {
		let e = this._ctx, t = this.chart, n = this._cachedMeta, r = n.data || [], i = t.chartArea, a = [], o = this._drawStart || 0, s = this._drawCount || r.length - o, c = this.options.drawActiveElementsOnTop, l;
		for (n.dataset && n.dataset.draw(e, i, o, s), l = o; l < o + s; ++l) {
			let t = r[l];
			t.hidden || (t.active && c ? a.push(t) : t.draw(e, i));
		}
		for (l = 0; l < a.length; ++l) a[l].draw(e, i);
	}
	getStyle(e, t) {
		let n = t ? "active" : "default";
		return e === void 0 && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(n) : this.resolveDataElementOptions(e || 0, n);
	}
	getContext(e, t, n) {
		let r = this.getDataset(), i;
		if (e >= 0 && e < this._cachedMeta.data.length) {
			let t = this._cachedMeta.data[e];
			i = t.$context ||= Pm(this.getContext(), e, t), i.parsed = this.getParsed(e), i.raw = r.data[e], i.index = i.dataIndex = e;
		} else i = this.$context ||= Nm(this.chart.getContext(), this.index), i.dataset = r, i.index = i.datasetIndex = this.index;
		return i.active = !!t, i.mode = n, i;
	}
	resolveDatasetElementOptions(e) {
		return this._resolveElementOptions(this.datasetElementType.id, e);
	}
	resolveDataElementOptions(e, t) {
		return this._resolveElementOptions(this.dataElementType.id, t, e);
	}
	_resolveElementOptions(e, t = "default", n) {
		let r = t === "active", i = this._cachedDataOpts, a = e + "-" + t, o = i[a], s = this.enableOptionSharing && cd(n);
		if (o) return Lm(o, s);
		let c = this.chart.config, l = c.datasetElementScopeKeys(this._type, e), u = r ? [
			`${e}Hover`,
			"hover",
			e,
			""
		] : [e, ""], d = c.getOptionScopes(this.getDataset(), l), f = Object.keys(Sf.elements[e]), p = c.resolveNamedOptions(d, f, () => this.getContext(n, r, t), u);
		return p.$shared && (p.$shared = s, i[a] = Object.freeze(Lm(p, s))), p;
	}
	_resolveAnimations(e, t, n) {
		let r = this.chart, i = this._cachedDataOpts, a = `animation-${t}`, o = i[a];
		if (o) return o;
		let s;
		if (r.options.animation !== !1) {
			let r = this.chart.config, i = r.datasetAnimationScopeKeys(this._type, t), a = r.getOptionScopes(this.getDataset(), i);
			s = r.createResolver(a, this.getContext(e, n, t));
		}
		let c = new _m(r, s && s.animations);
		return s && s._cacheable && (i[a] = Object.freeze(c)), c;
	}
	getSharedOptions(e) {
		if (e.$shared) return this._sharedOptions ||= Object.assign({}, e);
	}
	includeOptions(e, t) {
		return !t || Im(e) || this.chart._animationsDisabled;
	}
	_getSharedOptions(e, t) {
		let n = this.resolveDataElementOptions(e, t), r = this._sharedOptions, i = this.getSharedOptions(n), a = this.includeOptions(t, i) || i !== r;
		return this.updateSharedOptions(i, t, n), {
			sharedOptions: i,
			includeOptions: a
		};
	}
	updateElement(e, t, n, r) {
		Im(r) ? Object.assign(e, n) : this._resolveAnimations(t, r).update(e, n);
	}
	updateSharedOptions(e, t, n) {
		e && !Im(t) && this._resolveAnimations(void 0, t).update(e, n);
	}
	_setStyle(e, t, n, r) {
		e.active = r;
		let i = this.getStyle(t, r);
		this._resolveAnimations(t, n, r).update(e, { options: !r && this.getSharedOptions(i) || i });
	}
	removeHoverStyle(e, t, n) {
		this._setStyle(e, n, "active", !1);
	}
	setHoverStyle(e, t, n) {
		this._setStyle(e, n, "active", !0);
	}
	_removeDatasetHoverStyle() {
		let e = this._cachedMeta.dataset;
		e && this._setStyle(e, void 0, "active", !1);
	}
	_setDatasetHoverStyle() {
		let e = this._cachedMeta.dataset;
		e && this._setStyle(e, void 0, "active", !0);
	}
	_resyncElements(e) {
		let t = this._data, n = this._cachedMeta.data;
		for (let [e, t, n] of this._syncList) this[e](t, n);
		this._syncList = [];
		let r = n.length, i = t.length, a = Math.min(i, r);
		a && this.parse(0, a), i > r ? this._insertElements(r, i - r, e) : i < r && this._removeElements(i, r - i);
	}
	_insertElements(e, t, n = !0) {
		let r = this._cachedMeta, i = r.data, a = e + t, o, s = (e) => {
			for (e.length += t, o = e.length - 1; o >= a; o--) e[o] = e[o - t];
		};
		for (s(i), o = e; o < a; ++o) i[o] = new this.dataElementType();
		this._parsing && s(r._parsed), this.parse(e, t), n && this.updateElements(i, e, t, "reset");
	}
	updateElements(e, t, n, r) {}
	_removeElements(e, t) {
		let n = this._cachedMeta;
		if (this._parsing) {
			let r = n._parsed.splice(e, t);
			n._stacked && Fm(n, r);
		}
		n.data.splice(e, t);
	}
	_sync(e) {
		if (this._parsing) this._syncList.push(e);
		else {
			let [t, n, r] = e;
			this[t](n, r);
		}
		this.chart._dataChanges.push([this.index, ...e]);
	}
	_onDataPush() {
		let e = arguments.length;
		this._sync([
			"_insertElements",
			this.getDataset().data.length - e,
			e
		]);
	}
	_onDataPop() {
		this._sync([
			"_removeElements",
			this._cachedMeta.data.length - 1,
			1
		]);
	}
	_onDataShift() {
		this._sync([
			"_removeElements",
			0,
			1
		]);
	}
	_onDataSplice(e, t) {
		t && this._sync([
			"_removeElements",
			e,
			t
		]);
		let n = arguments.length - 2;
		n && this._sync([
			"_insertElements",
			e,
			n
		]);
	}
	_onDataUnshift() {
		this._sync([
			"_insertElements",
			0,
			arguments.length
		]);
	}
};
function Bm(e, t) {
	if (!e._cache.$bar) {
		let n = e.getMatchingVisibleMetas(t), r = [];
		for (let t = 0, i = n.length; t < i; t++) r = r.concat(n[t].controller.getAllParsedValues(e));
		e._cache.$bar = Gd(r.sort((e, t) => e - t));
	}
	return e._cache.$bar;
}
function Vm(e) {
	let t = e.iScale, n = Bm(t, e.type), r = t._length, i, a, o, s, c = () => {
		o === 32767 || o === -32768 || (cd(s) && (r = Math.min(r, Math.abs(o - s) || r)), s = o);
	};
	for (i = 0, a = n.length; i < a; ++i) o = t.getPixelForValue(n[i]), c();
	for (s = void 0, i = 0, a = t.ticks.length; i < a; ++i) o = t.getPixelForTick(i), c();
	return r;
}
function Hm(e, t, n, r) {
	let i = n.barThickness, a, o;
	return V(i) ? (a = t.min * n.categoryPercentage, o = n.barPercentage) : (a = i * r, o = 1), {
		chunk: a / r,
		ratio: o,
		start: t.pixels[e] - a / 2
	};
}
function Um(e, t, n, r) {
	let i = t.pixels, a = i[e], o = e > 0 ? i[e - 1] : null, s = e < i.length - 1 ? i[e + 1] : null, c = n.categoryPercentage;
	o === null && (o = a - (s === null ? t.end - t.start : s - a)), s === null && (s = a + a - o);
	let l = a - (a - Math.min(o, s)) / 2 * c;
	return {
		chunk: Math.abs(s - o) / 2 * c / r,
		ratio: n.barPercentage,
		start: l
	};
}
function Wm(e, t, n, r) {
	let i = n.parse(e[0], r), a = n.parse(e[1], r), o = Math.min(i, a), s = Math.max(i, a), c = o, l = s;
	Math.abs(o) > Math.abs(s) && (c = s, l = o), t[n.axis] = l, t._custom = {
		barStart: c,
		barEnd: l,
		start: i,
		end: a,
		min: o,
		max: s
	};
}
function Gm(e, t, n, r) {
	return H(e) ? Wm(e, t, n, r) : t[n.axis] = n.parse(e, r), t;
}
function Km(e, t, n, r) {
	let i = e.iScale, a = e.vScale, o = i.getLabels(), s = i === a, c = [], l, u, d, f;
	for (l = n, u = n + r; l < u; ++l) f = t[l], d = {}, d[i.axis] = s || i.parse(o[l], l), c.push(Gm(f, d, a, l));
	return c;
}
function qm(e) {
	return e && e.barStart !== void 0 && e.barEnd !== void 0;
}
function Jm(e, t, n) {
	return e === 0 ? (t.isHorizontal() ? 1 : -1) * (t.min >= n ? 1 : -1) : yd(e);
}
function Ym(e) {
	let t, n, r, i, a;
	return e.horizontal ? (t = e.base > e.x, n = "left", r = "right") : (t = e.base < e.y, n = "bottom", r = "top"), t ? (i = "end", a = "start") : (i = "start", a = "end"), {
		start: n,
		end: r,
		reverse: t,
		top: i,
		bottom: a
	};
}
function Xm(e, t, n, r) {
	let i = t.borderSkipped, a = {};
	if (!i) {
		e.borderSkipped = a;
		return;
	}
	if (i === !0) {
		e.borderSkipped = {
			top: !0,
			right: !0,
			bottom: !0,
			left: !0
		};
		return;
	}
	let { start: o, end: s, reverse: c, top: l, bottom: u } = Ym(e);
	i === "middle" && n && (e.enableBorderRadius = !0, (n._top || 0) === r ? i = l : (n._bottom || 0) === r ? i = u : (a[Zm(u, o, s, c)] = !0, i = l)), a[Zm(i, o, s, c)] = !0, e.borderSkipped = a;
}
function Zm(e, t, n, r) {
	return r ? (e = Qm(e, t, n), e = $m(e, n, t)) : e = $m(e, t, n), e;
}
function Qm(e, t, n) {
	return e === t ? n : e === n ? t : e;
}
function $m(e, t, n) {
	return e === "start" ? t : e === "end" ? n : e;
}
function eh(e, { inflateAmount: t }, n) {
	e.inflateAmount = t === "auto" ? n === 1 ? .33 : 0 : t;
}
var th = class extends zm {
	static id = "bar";
	static defaults = {
		datasetElementType: !1,
		dataElementType: "bar",
		categoryPercentage: .8,
		barPercentage: .9,
		grouped: !0,
		animations: { numbers: {
			type: "number",
			properties: [
				"x",
				"y",
				"base",
				"width",
				"height"
			]
		} }
	};
	static overrides = { scales: {
		_index_: {
			type: "category",
			offset: !0,
			grid: { offset: !0 }
		},
		_value_: {
			type: "linear",
			beginAtZero: !0
		}
	} };
	parsePrimitiveData(e, t, n, r) {
		return Km(e, t, n, r);
	}
	parseArrayData(e, t, n, r) {
		return Km(e, t, n, r);
	}
	parseObjectData(e, t, n, r) {
		let { iScale: i, vScale: a } = e, { xAxisKey: o = "x", yAxisKey: s = "y" } = this._parsing, c = i.axis === "x" ? o : s, l = a.axis === "x" ? o : s, u = [], d, f, p, m;
		for (d = n, f = n + r; d < f; ++d) m = t[d], p = {}, p[i.axis] = i.parse(od(m, c), d), u.push(Gm(od(m, l), p, a, d));
		return u;
	}
	updateRangeFromParsed(e, t, n, r) {
		super.updateRangeFromParsed(e, t, n, r);
		let i = n._custom;
		i && t === this._cachedMeta.vScale && (e.min = Math.min(e.min, i.min), e.max = Math.max(e.max, i.max));
	}
	getMaxOverflow() {
		return 0;
	}
	getLabelAndValue(e) {
		let { iScale: t, vScale: n } = this._cachedMeta, r = this.getParsed(e), i = r._custom, a = qm(i) ? "[" + i.start + ", " + i.end + "]" : "" + n.getLabelForValue(r[n.axis]);
		return {
			label: "" + t.getLabelForValue(r[t.axis]),
			value: a
		};
	}
	initialize() {
		this.enableOptionSharing = !0, super.initialize();
		let e = this._cachedMeta;
		e.stack = this.getDataset().stack;
	}
	update(e) {
		let t = this._cachedMeta;
		this.updateElements(t.data, 0, t.data.length, e);
	}
	updateElements(e, t, n, r) {
		let i = r === "reset", { index: a, _cachedMeta: { vScale: o } } = this, s = o.getBasePixel(), c = o.isHorizontal(), l = this._getRuler(), { sharedOptions: u, includeOptions: d } = this._getSharedOptions(t, r);
		for (let f = t; f < t + n; f++) {
			let t = this.getParsed(f), n = i || V(t[o.axis]) ? {
				base: s,
				head: s
			} : this._calculateBarValuePixels(f), p = this._calculateBarIndexPixels(f, l), m = (t._stacks || {})[o.axis], h = {
				horizontal: c,
				base: n.base,
				enableBorderRadius: !m || qm(t._custom) || a === m._top || a === m._bottom,
				x: c ? n.head : p.center,
				y: c ? p.center : n.head,
				height: c ? p.size : Math.abs(n.size),
				width: c ? Math.abs(n.size) : p.size
			};
			d && (h.options = u || this.resolveDataElementOptions(f, e[f].active ? "active" : r));
			let g = h.options || e[f].options;
			Xm(h, g, m, a), eh(h, g, l.ratio), this.updateElement(e[f], f, h, r);
		}
	}
	_getStacks(e, t) {
		let { iScale: n } = this._cachedMeta, r = n.getMatchingVisibleMetas(this._type).filter((e) => e.controller.options.grouped), i = n.options.stacked, a = [], o = this._cachedMeta.controller.getParsed(t), s = o && o[n.axis], c = (e) => {
			let t = e._parsed.find((e) => e[n.axis] === s), r = t && t[e.vScale.axis];
			if (V(r) || isNaN(r)) return !0;
		};
		for (let n of r) if (!(t !== void 0 && c(n)) && ((i === !1 || a.indexOf(n.stack) === -1 || i === void 0 && n.stack === void 0) && a.push(n.stack), n.index === e)) break;
		return a.length || a.push(void 0), a;
	}
	_getStackCount(e) {
		return this._getStacks(void 0, e).length;
	}
	_getAxisCount() {
		return this._getAxis().length;
	}
	getFirstScaleIdForIndexAxis() {
		let e = this.chart.scales, t = this.chart.options.indexAxis;
		return Object.keys(e).filter((n) => e[n].axis === t).shift();
	}
	_getAxis() {
		let e = {}, t = this.getFirstScaleIdForIndexAxis();
		for (let n of this.chart.data.datasets) e[W(this.chart.options.indexAxis === "x" ? n.xAxisID : n.yAxisID, t)] = !0;
		return Object.keys(e);
	}
	_getStackIndex(e, t, n) {
		let r = this._getStacks(e, n), i = t === void 0 ? -1 : r.indexOf(t);
		return i === -1 ? r.length - 1 : i;
	}
	_getRuler() {
		let e = this.options, t = this._cachedMeta, n = t.iScale, r = [], i, a;
		for (i = 0, a = t.data.length; i < a; ++i) r.push(n.getPixelForValue(this.getParsed(i)[n.axis], i));
		let o = e.barThickness;
		return {
			min: o || Vm(t),
			pixels: r,
			start: n._startPixel,
			end: n._endPixel,
			stackCount: this._getStackCount(),
			scale: n,
			grouped: e.grouped,
			ratio: o ? 1 : e.categoryPercentage * e.barPercentage
		};
	}
	_calculateBarValuePixels(e) {
		let { _cachedMeta: { vScale: t, _stacked: n, index: r }, options: { base: i, minBarLength: a } } = this, o = i || 0, s = this.getParsed(e), c = s._custom, l = qm(c), u = s[t.axis], d = 0, f = n ? this.applyStack(t, s, n) : u, p, m;
		f !== u && (d = f - u, f = u), l && (u = c.barStart, f = c.barEnd - c.barStart, u !== 0 && yd(u) !== yd(c.barEnd) && (d = 0), d += u);
		let h = !V(i) && !l ? i : d, g = t.getPixelForValue(h);
		if (p = this.chart.getDataVisibility(e) ? t.getPixelForValue(d + f) : g, m = p - g, Math.abs(m) < a) {
			m = Jm(m, t, o) * a, u === o && (g -= m / 2);
			let e = t.getPixelForDecimal(0), i = t.getPixelForDecimal(1);
			g = Math.max(Math.min(g, Math.max(e, i)), Math.min(e, i)), p = g + m, n && !l && (s._stacks[t.axis]._visualValues[r] = t.getValueForPixel(p) - t.getValueForPixel(g));
		}
		if (g === t.getPixelForValue(o)) {
			let e = yd(m) * t.getLineWidthForValue(o) / 2;
			g += e, m -= e;
		}
		return {
			size: m,
			base: g,
			head: p,
			center: p + m / 2
		};
	}
	_calculateBarIndexPixels(e, t) {
		let n = t.scale, r = this.options, i = r.skipNull, a = W(r.maxBarThickness, Infinity), o, s, c = this._getAxisCount();
		if (t.grouped) {
			let n = i ? this._getStackCount(e) : t.stackCount, l = r.barThickness === "flex" ? Um(e, t, r, n * c) : Hm(e, t, r, n * c), u = this.chart.options.indexAxis === "x" ? this.getDataset().xAxisID : this.getDataset().yAxisID, d = this._getAxis().indexOf(W(u, this.getFirstScaleIdForIndexAxis())), f = this._getStackIndex(this.index, this._cachedMeta.stack, i ? e : void 0) + d;
			o = l.start + l.chunk * f + l.chunk / 2, s = Math.min(a, l.chunk * l.ratio);
		} else o = n.getPixelForValue(this.getParsed(e)[n.axis], e), s = Math.min(a, t.min * t.ratio);
		return {
			base: o - s / 2,
			head: o + s / 2,
			center: o,
			size: s
		};
	}
	draw() {
		let e = this._cachedMeta, t = e.vScale, n = e.data, r = n.length, i = 0;
		for (; i < r; ++i) this.getParsed(i)[t.axis] !== null && !n[i].hidden && n[i].draw(this._ctx);
	}
};
function nh(e, t, n) {
	let r = 1, i = 1, a = 0, o = 0;
	if (t < q) {
		let s = e, c = s + t, l = Math.cos(s), u = Math.sin(s), d = Math.cos(c), f = Math.sin(c), p = (e, t, r) => Pd(e, s, c, !0) ? 1 : Math.max(t, t * n, r, r * n), m = (e, t, r) => Pd(e, s, c, !0) ? -1 : Math.min(t, t * n, r, r * n), h = p(0, l, d), g = p(hd, u, f), _ = m(K, l, d), v = m(K + hd, u, f);
		r = (h - _) / 2, i = (g - v) / 2, a = -(h + _) / 2, o = -(g + v) / 2;
	}
	return {
		ratioX: r,
		ratioY: i,
		offsetX: a,
		offsetY: o
	};
}
var rh = class extends zm {
	static id = "doughnut";
	static defaults = {
		datasetElementType: !1,
		dataElementType: "arc",
		animation: {
			animateRotate: !0,
			animateScale: !1
		},
		animations: { numbers: {
			type: "number",
			properties: [
				"circumference",
				"endAngle",
				"innerRadius",
				"outerRadius",
				"startAngle",
				"x",
				"y",
				"offset",
				"borderWidth",
				"spacing"
			]
		} },
		cutout: "50%",
		rotation: 0,
		circumference: 360,
		radius: "100%",
		spacing: 0,
		indexAxis: "r"
	};
	static descriptors = {
		_scriptable: (e) => e !== "spacing",
		_indexable: (e) => e !== "spacing" && !e.startsWith("borderDash") && !e.startsWith("hoverBorderDash")
	};
	static overrides = {
		aspectRatio: 1,
		plugins: { legend: {
			labels: { generateLabels(e) {
				let t = e.data, { labels: { pointStyle: n, textAlign: r, color: i, useBorderRadius: a, borderRadius: o } } = e.legend.options;
				return t.labels.length && t.datasets.length ? t.labels.map((t, s) => {
					let c = e.getDatasetMeta(0).controller.getStyle(s);
					return {
						text: t,
						fillStyle: c.backgroundColor,
						fontColor: i,
						hidden: !e.getDataVisibility(s),
						lineDash: c.borderDash,
						lineDashOffset: c.borderDashOffset,
						lineJoin: c.borderJoinStyle,
						lineWidth: c.borderWidth,
						strokeStyle: c.borderColor,
						textAlign: r,
						pointStyle: n,
						borderRadius: a && (o || c.borderRadius),
						index: s
					};
				}) : [];
			} },
			onClick(e, t, n) {
				n.chart.toggleDataVisibility(t.index), n.chart.update();
			}
		} }
	};
	constructor(e, t) {
		super(e, t), this.enableOptionSharing = !0, this.innerRadius = void 0, this.outerRadius = void 0, this.offsetX = void 0, this.offsetY = void 0;
	}
	linkScales() {}
	parse(e, t) {
		let n = this.getDataset().data, r = this._cachedMeta;
		if (this._parsing === !1) r._parsed = n;
		else {
			let i = (e) => +n[e];
			if (U(n[e])) {
				let { key: e = "value" } = this._parsing;
				i = (t) => +od(n[t], e);
			}
			let a, o;
			for (a = e, o = e + t; a < o; ++a) r._parsed[a] = i(a);
		}
	}
	_getRotation() {
		return Dd(this.options.rotation - 90);
	}
	_getCircumference() {
		return Dd(this.options.circumference);
	}
	_getRotationExtents() {
		let e = q, t = -q;
		for (let n = 0; n < this.chart.data.datasets.length; ++n) if (this.chart.isDatasetVisible(n) && this.chart.getDatasetMeta(n).type === this._type) {
			let r = this.chart.getDatasetMeta(n).controller, i = r._getRotation(), a = r._getCircumference();
			e = Math.min(e, i), t = Math.max(t, i + a);
		}
		return {
			rotation: e,
			circumference: t - e
		};
	}
	update(e) {
		let { chartArea: t } = this.chart, n = this._cachedMeta, r = n.data, i = this.getMaxBorderWidth() + this.getMaxOffset(r) + this.options.spacing, a = Math.max((Math.min(t.width, t.height) - i) / 2, 0), o = Math.min(qu(this.options.cutout, a), 1), s = this._getRingWeight(this.index), { circumference: c, rotation: l } = this._getRotationExtents(), { ratioX: u, ratioY: d, offsetX: f, offsetY: p } = nh(l, c, o), m = (t.width - i) / u, h = (t.height - i) / d, g = Math.max(Math.min(m, h) / 2, 0), _ = Ju(this.options.radius, g), v = (_ - Math.max(_ * o, 0)) / this._getVisibleDatasetWeightTotal();
		this.offsetX = f * _, this.offsetY = p * _, n.total = this.calculateTotal(), this.outerRadius = _ - v * this._getRingWeightOffset(this.index), this.innerRadius = Math.max(this.outerRadius - v * s, 0), this.updateElements(r, 0, r.length, e);
	}
	_circumference(e, t) {
		let n = this.options, r = this._cachedMeta, i = this._getCircumference();
		return t && n.animation.animateRotate || !this.chart.getDataVisibility(e) || r._parsed[e] === null || r.data[e].hidden ? 0 : this.calculateCircumference(r._parsed[e] * i / q);
	}
	updateElements(e, t, n, r) {
		let i = r === "reset", a = this.chart, o = a.chartArea, s = a.options.animation, c = (o.left + o.right) / 2, l = (o.top + o.bottom) / 2, u = i && s.animateScale, d = u ? 0 : this.innerRadius, f = u ? 0 : this.outerRadius, { sharedOptions: p, includeOptions: m } = this._getSharedOptions(t, r), h = this._getRotation(), g;
		for (g = 0; g < t; ++g) h += this._circumference(g, i);
		for (g = t; g < t + n; ++g) {
			let t = this._circumference(g, i), n = e[g], a = {
				x: c + this.offsetX,
				y: l + this.offsetY,
				startAngle: h,
				endAngle: h + t,
				circumference: t,
				outerRadius: f,
				innerRadius: d
			};
			m && (a.options = p || this.resolveDataElementOptions(g, n.active ? "active" : r)), h += t, this.updateElement(n, g, a, r);
		}
	}
	calculateTotal() {
		let e = this._cachedMeta, t = e.data, n = 0, r;
		for (r = 0; r < t.length; r++) {
			let i = e._parsed[r];
			i !== null && !isNaN(i) && this.chart.getDataVisibility(r) && !t[r].hidden && (n += Math.abs(i));
		}
		return n;
	}
	calculateCircumference(e) {
		let t = this._cachedMeta.total;
		return t > 0 && !isNaN(e) ? Math.abs(e) / t * q : 0;
	}
	getLabelAndValue(e) {
		let t = this._cachedMeta, n = this.chart, r = n.data.labels || [], i = pf(t._parsed[e], n.options.locale);
		return {
			label: r[e] || "",
			value: i
		};
	}
	getMaxBorderWidth(e) {
		let t = 0, n = this.chart, r, i, a, o, s;
		if (!e) {
			for (r = 0, i = n.data.datasets.length; r < i; ++r) if (n.isDatasetVisible(r)) {
				a = n.getDatasetMeta(r), e = a.data, o = a.controller;
				break;
			}
		}
		if (!e) return 0;
		for (r = 0, i = e.length; r < i; ++r) s = o.resolveDataElementOptions(r), s.borderAlign !== "inner" && (t = Math.max(t, s.borderWidth || 0, s.hoverBorderWidth || 0));
		return t;
	}
	getMaxOffset(e) {
		let t = 0;
		for (let n = 0, r = e.length; n < r; ++n) {
			let e = this.resolveDataElementOptions(n);
			t = Math.max(t, e.offset || 0, e.hoverOffset || 0);
		}
		return t;
	}
	_getRingWeightOffset(e) {
		let t = 0;
		for (let n = 0; n < e; ++n) this.chart.isDatasetVisible(n) && (t += this._getRingWeight(n));
		return t;
	}
	_getRingWeight(e) {
		return Math.max(W(this.chart.data.datasets[e].weight, 1), 0);
	}
	_getVisibleDatasetWeightTotal() {
		return this._getRingWeightOffset(this.chart.data.datasets.length) || 1;
	}
}, ih = class extends zm {
	static id = "line";
	static defaults = {
		datasetElementType: "line",
		dataElementType: "point",
		showLine: !0,
		spanGaps: !1
	};
	static overrides = { scales: {
		_index_: { type: "category" },
		_value_: { type: "linear" }
	} };
	initialize() {
		this.enableOptionSharing = !0, this.supportsDecimation = !0, super.initialize();
	}
	update(e) {
		let t = this._cachedMeta, { dataset: n, data: r = [], _dataset: i } = t, a = this.chart._animationsDisabled, { start: o, count: s } = Zd(t, r, a);
		this._drawStart = o, this._drawCount = s, Qd(t) && (o = 0, s = r.length), n._chart = this.chart, n._datasetIndex = this.index, n._decimated = !!i._decimated, n.points = r;
		let c = this.resolveDatasetElementOptions(e);
		this.options.showLine || (c.borderWidth = 0), c.segment = this.options.segment, this.updateElement(n, void 0, {
			animated: !a,
			options: c
		}, e), this.updateElements(r, o, s, e);
	}
	updateElements(e, t, n, r) {
		let i = r === "reset", { iScale: a, vScale: o, _stacked: s, _dataset: c } = this._cachedMeta, { sharedOptions: l, includeOptions: u } = this._getSharedOptions(t, r), d = a.axis, f = o.axis, { spanGaps: p, segment: m } = this.options, h = wd(p) ? p : Infinity, g = this.chart._animationsDisabled || i || r === "none", _ = t + n, v = e.length, y = t > 0 && this.getParsed(t - 1);
		for (let n = 0; n < v; ++n) {
			let p = e[n], v = g ? p : {};
			if (n < t || n >= _) {
				v.skip = !0;
				continue;
			}
			let b = this.getParsed(n), x = V(b[f]), S = v[d] = a.getPixelForValue(b[d], n), C = v[f] = i || x ? o.getBasePixel() : o.getPixelForValue(s ? this.applyStack(o, b, s) : b[f], n);
			v.skip = isNaN(S) || isNaN(C) || x, v.stop = n > 0 && Math.abs(b[d] - y[d]) > h, m && (v.parsed = b, v.raw = c.data[n]), u && (v.options = l || this.resolveDataElementOptions(n, p.active ? "active" : r)), g || this.updateElement(p, n, v, r), y = b;
		}
	}
	getMaxOverflow() {
		let e = this._cachedMeta, t = e.dataset, n = t.options && t.options.borderWidth || 0, r = e.data || [];
		if (!r.length) return n;
		let i = r[0].size(this.resolveDataElementOptions(0)), a = r[r.length - 1].size(this.resolveDataElementOptions(r.length - 1));
		return Math.max(n, i, a) / 2;
	}
	draw() {
		let e = this._cachedMeta;
		e.dataset.updateControlPoints(this.chart.chartArea, e.iScale.axis), super.draw();
	}
}, ah = class extends rh {
	static id = "pie";
	static defaults = {
		cutout: 0,
		rotation: 0,
		circumference: 360,
		radius: "100%"
	};
}, oh = class extends zm {
	static id = "radar";
	static defaults = {
		datasetElementType: "line",
		dataElementType: "point",
		indexAxis: "r",
		showLine: !0,
		elements: { line: { fill: "start" } }
	};
	static overrides = {
		aspectRatio: 1,
		scales: { r: { type: "radialLinear" } }
	};
	getLabelAndValue(e) {
		let t = this._cachedMeta.vScale, n = this.getParsed(e);
		return {
			label: t.getLabels()[e],
			value: "" + t.getLabelForValue(n[t.axis])
		};
	}
	parseObjectData(e, t, n, r) {
		return _p.bind(this)(e, t, n, r);
	}
	update(e) {
		let t = this._cachedMeta, n = t.dataset, r = t.data || [], i = t.iScale.getLabels();
		if (n.points = r, e !== "resize") {
			let t = this.resolveDatasetElementOptions(e);
			this.options.showLine || (t.borderWidth = 0);
			let a = {
				_loop: !0,
				_fullLoop: i.length === r.length,
				options: t
			};
			this.updateElement(n, void 0, a, e);
		}
		this.updateElements(r, 0, r.length, e);
	}
	updateElements(e, t, n, r) {
		let i = this._cachedMeta.rScale, a = r === "reset";
		for (let o = t; o < t + n; o++) {
			let t = e[o], n = this.resolveDataElementOptions(o, t.active ? "active" : r), s = i.getPointPositionForValue(o, this.getParsed(o).r), c = a ? i.xCenter : s.x, l = a ? i.yCenter : s.y, u = {
				x: c,
				y: l,
				angle: s.angle,
				skip: isNaN(c) || isNaN(l),
				options: n
			};
			this.updateElement(t, o, u, r);
		}
	}
}, sh = class extends zm {
	static id = "scatter";
	static defaults = {
		datasetElementType: !1,
		dataElementType: "point",
		showLine: !1,
		fill: !1
	};
	static overrides = {
		interaction: { mode: "point" },
		scales: {
			x: { type: "linear" },
			y: { type: "linear" }
		}
	};
	getLabelAndValue(e) {
		let t = this._cachedMeta, n = this.chart.data.labels || [], { xScale: r, yScale: i } = t, a = this.getParsed(e), o = r.getLabelForValue(a.x), s = i.getLabelForValue(a.y);
		return {
			label: n[e] || "",
			value: "(" + o + ", " + s + ")"
		};
	}
	update(e) {
		let t = this._cachedMeta, { data: n = [] } = t, r = this.chart._animationsDisabled, { start: i, count: a } = Zd(t, n, r);
		if (this._drawStart = i, this._drawCount = a, Qd(t) && (i = 0, a = n.length), this.options.showLine) {
			this.datasetElementType || this.addElements();
			let { dataset: i, _dataset: a } = t;
			i._chart = this.chart, i._datasetIndex = this.index, i._decimated = !!a._decimated, i.points = n;
			let o = this.resolveDatasetElementOptions(e);
			o.segment = this.options.segment, this.updateElement(i, void 0, {
				animated: !r,
				options: o
			}, e);
		} else this.datasetElementType &&= (delete t.dataset, !1);
		this.updateElements(n, i, a, e);
	}
	addElements() {
		let { showLine: e } = this.options;
		!this.datasetElementType && e && (this.datasetElementType = this.chart.registry.getElement("line")), super.addElements();
	}
	updateElements(e, t, n, r) {
		let i = r === "reset", { iScale: a, vScale: o, _stacked: s, _dataset: c } = this._cachedMeta, l = this.resolveDataElementOptions(t, r), u = this.getSharedOptions(l), d = this.includeOptions(r, u), f = a.axis, p = o.axis, { spanGaps: m, segment: h } = this.options, g = wd(m) ? m : Infinity, _ = this.chart._animationsDisabled || i || r === "none", v = t > 0 && this.getParsed(t - 1);
		for (let l = t; l < t + n; ++l) {
			let t = e[l], n = this.getParsed(l), m = _ ? t : {}, y = V(n[p]), b = m[f] = a.getPixelForValue(n[f], l), x = m[p] = i || y ? o.getBasePixel() : o.getPixelForValue(s ? this.applyStack(o, n, s) : n[p], l);
			m.skip = isNaN(b) || isNaN(x) || y, m.stop = l > 0 && Math.abs(n[f] - v[f]) > g, h && (m.parsed = n, m.raw = c.data[l]), d && (m.options = u || this.resolveDataElementOptions(l, t.active ? "active" : r)), _ || this.updateElement(t, l, m, r), v = n;
		}
		this.updateSharedOptions(u, r, l);
	}
	getMaxOverflow() {
		let e = this._cachedMeta, t = e.data || [];
		if (!this.options.showLine) {
			let e = 0;
			for (let n = t.length - 1; n >= 0; --n) e = Math.max(e, t[n].size(this.resolveDataElementOptions(n)) / 2);
			return e > 0 && e;
		}
		let n = e.dataset, r = n.options && n.options.borderWidth || 0;
		if (!t.length) return r;
		let i = t[0].size(this.resolveDataElementOptions(0)), a = t[t.length - 1].size(this.resolveDataElementOptions(t.length - 1));
		return Math.max(r, i, a) / 2;
	}
};
function ch() {
	throw Error("This method is not implemented: Check that a complete date adapter is provided.");
}
var lh = { _date: class e {
	static override(t) {
		Object.assign(e.prototype, t);
	}
	options;
	constructor(e) {
		this.options = e || {};
	}
	init() {}
	formats() {
		return ch();
	}
	parse() {
		return ch();
	}
	format() {
		return ch();
	}
	add() {
		return ch();
	}
	diff() {
		return ch();
	}
	startOf() {
		return ch();
	}
	endOf() {
		return ch();
	}
} };
function uh(e, t, n, r) {
	let { controller: i, data: a, _sorted: o } = e, s = i._cachedMeta.iScale, c = e.dataset && e.dataset.options ? e.dataset.options.spanGaps : null;
	if (s && t === s.axis && t !== "r" && o && a.length) {
		let o = s._reversePixels ? Bd : zd;
		if (!r) {
			let r = o(a, t, n);
			if (c) {
				let { vScale: t } = i._cachedMeta, { _parsed: n } = e, a = n.slice(0, r.lo + 1).reverse().findIndex((e) => !V(e[t.axis]));
				r.lo -= Math.max(0, a);
				let o = n.slice(r.hi).findIndex((e) => !V(e[t.axis]));
				r.hi += Math.max(0, o);
			}
			return r;
		} else if (i._sharedOptions) {
			let e = a[0], r = typeof e.getRange == "function" && e.getRange(t);
			if (r) {
				let e = o(a, t, n - r), i = o(a, t, n + r);
				return {
					lo: e.lo,
					hi: i.hi
				};
			}
		}
	}
	return {
		lo: 0,
		hi: a.length - 1
	};
}
function dh(e, t, n, r, i) {
	let a = e.getSortedVisibleDatasetMetas(), o = n[t];
	for (let e = 0, n = a.length; e < n; ++e) {
		let { index: n, data: s } = a[e], { lo: c, hi: l } = uh(a[e], t, o, i);
		for (let e = c; e <= l; ++e) {
			let t = s[e];
			t.skip || r(t, n, e);
		}
	}
}
function fh(e) {
	let t = e.indexOf("x") !== -1, n = e.indexOf("y") !== -1;
	return function(e, r) {
		let i = t ? Math.abs(e.x - r.x) : 0, a = n ? Math.abs(e.y - r.y) : 0;
		return Math.sqrt(i ** 2 + a ** 2);
	};
}
function ph(e, t, n, r, i) {
	let a = [];
	return !i && !e.isPointInArea(t) || dh(e, n, t, function(n, o, s) {
		!i && !Af(n, e.chartArea, 0) || n.inRange(t.x, t.y, r) && a.push({
			element: n,
			datasetIndex: o,
			index: s
		});
	}, !0), a;
}
function mh(e, t, n, r) {
	let i = [];
	function a(e, n, a) {
		let { startAngle: o, endAngle: s } = e.getProps(["startAngle", "endAngle"], r), { angle: c } = Ad(e, {
			x: t.x,
			y: t.y
		});
		Pd(c, o, s) && i.push({
			element: e,
			datasetIndex: n,
			index: a
		});
	}
	return dh(e, n, t, a), i;
}
function hh(e, t, n, r, i, a) {
	let o = [], s = fh(n), c = Infinity;
	function l(n, l, u) {
		let d = n.inRange(t.x, t.y, i);
		if (r && !d) return;
		let f = n.getCenterPoint(i);
		if (!(a || e.isPointInArea(f)) && !d) return;
		let p = s(t, f);
		p < c ? (o = [{
			element: n,
			datasetIndex: l,
			index: u
		}], c = p) : p === c && o.push({
			element: n,
			datasetIndex: l,
			index: u
		});
	}
	return dh(e, n, t, l), o;
}
function gh(e, t, n, r, i, a) {
	return !a && !e.isPointInArea(t) ? [] : n === "r" && !r ? mh(e, t, n, i) : hh(e, t, n, r, i, a);
}
function _h(e, t, n, r, i) {
	let a = [], o = n === "x" ? "inXRange" : "inYRange", s = !1;
	return dh(e, n, t, (e, r, c) => {
		e[o] && e[o](t[n], i) && (a.push({
			element: e,
			datasetIndex: r,
			index: c
		}), s ||= e.inRange(t.x, t.y, i));
	}), r && !s ? [] : a;
}
var vh = {
	evaluateInteractionItems: dh,
	modes: {
		index(e, t, n, r) {
			let i = Lp(t, e), a = n.axis || "x", o = n.includeInvisible || !1, s = n.intersect ? ph(e, i, a, r, o) : gh(e, i, a, !1, r, o), c = [];
			return s.length ? (e.getSortedVisibleDatasetMetas().forEach((e) => {
				let t = s[0].index, n = e.data[t];
				n && !n.skip && c.push({
					element: n,
					datasetIndex: e.index,
					index: t
				});
			}), c) : [];
		},
		dataset(e, t, n, r) {
			let i = Lp(t, e), a = n.axis || "xy", o = n.includeInvisible || !1, s = n.intersect ? ph(e, i, a, r, o) : gh(e, i, a, !1, r, o);
			if (s.length > 0) {
				let t = s[0].datasetIndex, n = e.getDatasetMeta(t).data;
				s = [];
				for (let e = 0; e < n.length; ++e) s.push({
					element: n[e],
					datasetIndex: t,
					index: e
				});
			}
			return s;
		},
		point(e, t, n, r) {
			return ph(e, Lp(t, e), n.axis || "xy", r, n.includeInvisible || !1);
		},
		nearest(e, t, n, r) {
			let i = Lp(t, e), a = n.axis || "xy", o = n.includeInvisible || !1;
			return gh(e, i, a, n.intersect, r, o);
		},
		x(e, t, n, r) {
			return _h(e, Lp(t, e), "x", n.intersect, r);
		},
		y(e, t, n, r) {
			return _h(e, Lp(t, e), "y", n.intersect, r);
		}
	}
}, yh = [
	"left",
	"top",
	"right",
	"bottom"
];
function bh(e, t) {
	return e.filter((e) => e.pos === t);
}
function xh(e, t) {
	return e.filter((e) => yh.indexOf(e.pos) === -1 && e.box.axis === t);
}
function Sh(e, t) {
	return e.sort((e, n) => {
		let r = t ? n : e, i = t ? e : n;
		return r.weight === i.weight ? r.index - i.index : r.weight - i.weight;
	});
}
function Ch(e) {
	let t = [], n, r, i, a, o, s;
	for (n = 0, r = (e || []).length; n < r; ++n) i = e[n], {position: a, options: {stack: o, stackWeight: s = 1}} = i, t.push({
		index: n,
		box: i,
		pos: a,
		horizontal: i.isHorizontal(),
		weight: i.weight,
		stack: o && a + o,
		stackWeight: s
	});
	return t;
}
function wh(e) {
	let t = {};
	for (let n of e) {
		let { stack: e, pos: r, stackWeight: i } = n;
		if (!e || !yh.includes(r)) continue;
		let a = t[e] || (t[e] = {
			count: 0,
			placed: 0,
			weight: 0,
			size: 0
		});
		a.count++, a.weight += i;
	}
	return t;
}
function Th(e, t) {
	let n = wh(e), { vBoxMaxWidth: r, hBoxMaxHeight: i } = t, a, o, s;
	for (a = 0, o = e.length; a < o; ++a) {
		s = e[a];
		let { fullSize: o } = s.box, c = n[s.stack], l = c && s.stackWeight / c.weight;
		s.horizontal ? (s.width = l ? l * r : o && t.availableWidth, s.height = i) : (s.width = r, s.height = l ? l * i : o && t.availableHeight);
	}
	return n;
}
function Eh(e) {
	let t = Ch(e), n = Sh(t.filter((e) => e.box.fullSize), !0), r = Sh(bh(t, "left"), !0), i = Sh(bh(t, "right")), a = Sh(bh(t, "top"), !0), o = Sh(bh(t, "bottom")), s = xh(t, "x"), c = xh(t, "y");
	return {
		fullSize: n,
		leftAndTop: r.concat(a),
		rightAndBottom: i.concat(c).concat(o).concat(s),
		chartArea: bh(t, "chartArea"),
		vertical: r.concat(i).concat(c),
		horizontal: a.concat(o).concat(s)
	};
}
function Dh(e, t, n, r) {
	return Math.max(e[n], t[n]) + Math.max(e[r], t[r]);
}
function Oh(e, t) {
	e.top = Math.max(e.top, t.top), e.left = Math.max(e.left, t.left), e.bottom = Math.max(e.bottom, t.bottom), e.right = Math.max(e.right, t.right);
}
function kh(e, t, n, r) {
	let { pos: i, box: a } = n, o = e.maxPadding;
	if (!U(i)) {
		n.size && (e[i] -= n.size);
		let t = r[n.stack] || {
			size: 0,
			count: 1
		};
		t.size = Math.max(t.size, n.horizontal ? a.height : a.width), n.size = t.size / t.count, e[i] += n.size;
	}
	a.getPadding && Oh(o, a.getPadding());
	let s = Math.max(0, t.outerWidth - Dh(o, e, "left", "right")), c = Math.max(0, t.outerHeight - Dh(o, e, "top", "bottom")), l = s !== e.w, u = c !== e.h;
	return e.w = s, e.h = c, n.horizontal ? {
		same: l,
		other: u
	} : {
		same: u,
		other: l
	};
}
function Ah(e) {
	let t = e.maxPadding;
	function n(n) {
		let r = Math.max(t[n] - e[n], 0);
		return e[n] += r, r;
	}
	e.y += n("top"), e.x += n("left"), n("right"), n("bottom");
}
function jh(e, t) {
	let n = t.maxPadding;
	function r(e) {
		let r = {
			left: 0,
			top: 0,
			right: 0,
			bottom: 0
		};
		return e.forEach((e) => {
			r[e] = Math.max(t[e], n[e]);
		}), r;
	}
	return r(e ? ["left", "right"] : ["top", "bottom"]);
}
function Mh(e, t, n, r) {
	let i = [], a, o, s, c, l, u;
	for (a = 0, o = e.length, l = 0; a < o; ++a) {
		s = e[a], c = s.box, c.update(s.width || t.w, s.height || t.h, jh(s.horizontal, t));
		let { same: o, other: d } = kh(t, n, s, r);
		l |= o && i.length, u ||= d, c.fullSize || i.push(s);
	}
	return l && Mh(i, t, n, r) || u;
}
function Nh(e, t, n, r, i) {
	e.top = n, e.left = t, e.right = t + r, e.bottom = n + i, e.width = r, e.height = i;
}
function Ph(e, t, n, r) {
	let i = n.padding, { x: a, y: o } = t;
	for (let s of e) {
		let e = s.box, c = r[s.stack] || {
			count: 1,
			placed: 0,
			weight: 1
		}, l = s.stackWeight / c.weight || 1;
		if (s.horizontal) {
			let r = t.w * l, a = c.size || e.height;
			cd(c.start) && (o = c.start), e.fullSize ? Nh(e, i.left, o, n.outerWidth - i.right - i.left, a) : Nh(e, t.left + c.placed, o, r, a), c.start = o, c.placed += r, o = e.bottom;
		} else {
			let r = t.h * l, o = c.size || e.width;
			cd(c.start) && (a = c.start), e.fullSize ? Nh(e, a, i.top, o, n.outerHeight - i.bottom - i.top) : Nh(e, a, t.top + c.placed, o, r), c.start = a, c.placed += r, a = e.right;
		}
	}
	t.x = a, t.y = o;
}
var Fh = {
	addBox(e, t) {
		e.boxes ||= [], t.fullSize = t.fullSize || !1, t.position = t.position || "top", t.weight = t.weight || 0, t._layers = t._layers || function() {
			return [{
				z: 0,
				draw(e) {
					t.draw(e);
				}
			}];
		}, e.boxes.push(t);
	},
	removeBox(e, t) {
		let n = e.boxes ? e.boxes.indexOf(t) : -1;
		n !== -1 && e.boxes.splice(n, 1);
	},
	configure(e, t, n) {
		t.fullSize = n.fullSize, t.position = n.position, t.weight = n.weight;
	},
	update(e, t, n, r) {
		if (!e) return;
		let i = qf(e.options.layout.padding), a = Math.max(t - i.width, 0), o = Math.max(n - i.height, 0), s = Eh(e.boxes), c = s.vertical, l = s.horizontal;
		G(e.boxes, (e) => {
			typeof e.beforeLayout == "function" && e.beforeLayout();
		});
		let u = c.reduce((e, t) => t.box.options && t.box.options.display === !1 ? e : e + 1, 0) || 1, d = Object.freeze({
			outerWidth: t,
			outerHeight: n,
			padding: i,
			availableWidth: a,
			availableHeight: o,
			vBoxMaxWidth: a / 2 / u,
			hBoxMaxHeight: o / 2
		}), f = Object.assign({}, i);
		Oh(f, qf(r));
		let p = Object.assign({
			maxPadding: f,
			w: a,
			h: o,
			x: i.left,
			y: i.top
		}, i), m = Th(c.concat(l), d);
		Mh(s.fullSize, p, d, m), Mh(c, p, d, m), Mh(l, p, d, m) && Mh(c, p, d, m), Ah(p), Ph(s.leftAndTop, p, d, m), p.x += p.w, p.y += p.h, Ph(s.rightAndBottom, p, d, m), e.chartArea = {
			left: p.left,
			top: p.top,
			right: p.left + p.w,
			bottom: p.top + p.h,
			height: p.h,
			width: p.w
		}, G(s.chartArea, (t) => {
			let n = t.box;
			Object.assign(n, e.chartArea), n.update(p.w, p.h, {
				left: 0,
				top: 0,
				right: 0,
				bottom: 0
			});
		});
	}
}, Ih = class {
	acquireContext(e, t) {}
	releaseContext(e) {
		return !1;
	}
	addEventListener(e, t, n) {}
	removeEventListener(e, t, n) {}
	getDevicePixelRatio() {
		return 1;
	}
	getMaximumSize(e, t, n, r) {
		return t = Math.max(0, t || e.width), n ||= e.height, {
			width: t,
			height: Math.max(0, r ? Math.floor(t / r) : n)
		};
	}
	isAttached(e) {
		return !0;
	}
	updateConfig(e) {}
}, Lh = class extends Ih {
	acquireContext(e) {
		return e && e.getContext && e.getContext("2d") || null;
	}
	updateConfig(e) {
		e.options.animation = !1;
	}
}, Rh = "$chartjs", zh = {
	touchstart: "mousedown",
	touchmove: "mousemove",
	touchend: "mouseup",
	pointerenter: "mouseenter",
	pointerdown: "mousedown",
	pointermove: "mousemove",
	pointerup: "mouseup",
	pointerleave: "mouseout",
	pointerout: "mouseout"
}, Bh = (e) => e === null || e === "";
function Vh(e, t) {
	let n = e.style, r = e.getAttribute("height"), i = e.getAttribute("width");
	if (e[Rh] = { initial: {
		height: r,
		width: i,
		style: {
			display: n.display,
			height: n.height,
			width: n.width
		}
	} }, n.display = n.display || "block", n.boxSizing = n.boxSizing || "border-box", Bh(i)) {
		let t = Up(e, "width");
		t !== void 0 && (e.width = t);
	}
	if (Bh(r)) if (e.style.height === "") e.height = e.width / (t || 2);
	else {
		let t = Up(e, "height");
		t !== void 0 && (e.height = t);
	}
	return e;
}
var Hh = Hp ? { passive: !0 } : !1;
function Uh(e, t, n) {
	e && e.addEventListener(t, n, Hh);
}
function Wh(e, t, n) {
	e && e.canvas && e.canvas.removeEventListener(t, n, Hh);
}
function Gh(e, t) {
	let n = zh[e.type] || e.type, { x: r, y: i } = Lp(e, t);
	return {
		type: n,
		chart: t,
		native: e,
		x: r === void 0 ? null : r,
		y: i === void 0 ? null : i
	};
}
function Kh(e, t) {
	for (let n of e) if (n === t || n.contains(t)) return !0;
}
function qh(e, t, n) {
	let r = e.canvas, i = new MutationObserver((e) => {
		let t = !1;
		for (let n of e) t ||= Kh(n.addedNodes, r), t &&= !Kh(n.removedNodes, r);
		t && n();
	});
	return i.observe(document, {
		childList: !0,
		subtree: !0
	}), i;
}
function Jh(e, t, n) {
	let r = e.canvas, i = new MutationObserver((e) => {
		let t = !1;
		for (let n of e) t ||= Kh(n.removedNodes, r), t &&= !Kh(n.addedNodes, r);
		t && n();
	});
	return i.observe(document, {
		childList: !0,
		subtree: !0
	}), i;
}
var Yh = /* @__PURE__ */ new Map(), Xh = 0;
function Zh() {
	let e = window.devicePixelRatio;
	e !== Xh && (Xh = e, Yh.forEach((t, n) => {
		n.currentDevicePixelRatio !== e && t();
	}));
}
function Qh(e, t) {
	Yh.size || window.addEventListener("resize", Zh), Yh.set(e, t);
}
function $h(e) {
	Yh.delete(e), Yh.size || window.removeEventListener("resize", Zh);
}
function eg(e, t, n) {
	let r = e.canvas, i = r && kp(r);
	if (!i) return;
	let a = qd((e, t) => {
		let r = i.clientWidth;
		n(e, t), r < i.clientWidth && n();
	}, window), o = new ResizeObserver((e) => {
		let t = e[0], n = t.contentRect.width, r = t.contentRect.height;
		n === 0 && r === 0 || a(n, r);
	});
	return o.observe(i), Qh(e, a), o;
}
function tg(e, t, n) {
	n && n.disconnect(), t === "resize" && $h(e);
}
function ng(e, t, n) {
	let r = e.canvas, i = qd((t) => {
		e.ctx !== null && n(Gh(t, e));
	}, e);
	return Uh(r, t, i), i;
}
var rg = class extends Ih {
	acquireContext(e, t) {
		let n = e && e.getContext && e.getContext("2d");
		return n && n.canvas === e ? (Vh(e, t), n) : null;
	}
	releaseContext(e) {
		let t = e.canvas;
		if (!t[Rh]) return !1;
		let n = t[Rh].initial;
		["height", "width"].forEach((e) => {
			let r = n[e];
			V(r) ? t.removeAttribute(e) : t.setAttribute(e, r);
		});
		let r = n.style || {};
		return Object.keys(r).forEach((e) => {
			t.style[e] = r[e];
		}), t.width = t.width, delete t[Rh], !0;
	}
	addEventListener(e, t, n) {
		this.removeEventListener(e, t);
		let r = e.$proxies ||= {};
		r[t] = ({
			attach: qh,
			detach: Jh,
			resize: eg
		}[t] || ng)(e, t, n);
	}
	removeEventListener(e, t) {
		let n = e.$proxies ||= {}, r = n[t];
		r && (({
			attach: tg,
			detach: tg,
			resize: tg
		}[t] || Wh)(e, t, r), n[t] = void 0);
	}
	getDevicePixelRatio() {
		return window.devicePixelRatio;
	}
	getMaximumSize(e, t, n, r) {
		return Bp(e, t, n, r);
	}
	isAttached(e) {
		let t = e && kp(e);
		return !!(t && t.isConnected);
	}
};
function ig(e) {
	return !Op() || typeof OffscreenCanvas < "u" && e instanceof OffscreenCanvas ? Lh : rg;
}
var ag = class {
	static defaults = {};
	static defaultRoutes = void 0;
	x;
	y;
	active = !1;
	options;
	$animations;
	tooltipPosition(e) {
		let { x: t, y: n } = this.getProps(["x", "y"], e);
		return {
			x: t,
			y: n
		};
	}
	hasValue() {
		return wd(this.x) && wd(this.y);
	}
	getProps(e, t) {
		let n = this.$animations;
		if (!t || !n) return this;
		let r = {};
		return e.forEach((e) => {
			r[e] = n[e] && n[e].active() ? n[e]._to : this[e];
		}), r;
	}
};
function og(e, t) {
	let n = e.options.ticks, r = sg(e), i = Math.min(n.maxTicksLimit || r, r), a = n.major.enabled ? lg(t) : [], o = a.length, s = a[0], c = a[o - 1], l = [];
	if (o > i) return ug(t, l, a, o / i), l;
	let u = cg(a, t, i);
	if (o > 0) {
		let e, n, r = o > 1 ? Math.round((c - s) / (o - 1)) : null;
		for (dg(t, l, u, V(r) ? 0 : s - r, s), e = 0, n = o - 1; e < n; e++) dg(t, l, u, a[e], a[e + 1]);
		return dg(t, l, u, c, V(r) ? t.length : c + r), l;
	}
	return dg(t, l, u), l;
}
function sg(e) {
	let t = e.options.offset, n = e._tickSize(), r = e._length / n + +!t, i = e._maxLength / n;
	return Math.floor(Math.min(r, i));
}
function cg(e, t, n) {
	let r = fg(e), i = t.length / n;
	if (!r) return Math.max(i, 1);
	let a = Sd(r);
	for (let e = 0, t = a.length - 1; e < t; e++) {
		let t = a[e];
		if (t > i) return t;
	}
	return Math.max(i, 1);
}
function lg(e) {
	let t = [], n, r;
	for (n = 0, r = e.length; n < r; n++) e[n].major && t.push(n);
	return t;
}
function ug(e, t, n, r) {
	let i = 0, a = n[0], o;
	for (r = Math.ceil(r), o = 0; o < e.length; o++) o === a && (t.push(e[o]), i++, a = n[i * r]);
}
function dg(e, t, n, r, i) {
	let a = W(r, 0), o = Math.min(W(i, e.length), e.length), s = 0, c, l, u;
	for (n = Math.ceil(n), i && (c = i - r, n = c / Math.floor(c / n)), u = a; u < 0;) s++, u = Math.round(a + s * n);
	for (l = Math.max(a, 0); l < o; l++) l === u && (t.push(e[l]), s++, u = Math.round(a + s * n));
}
function fg(e) {
	let t = e.length, n, r;
	if (t < 2) return !1;
	for (r = e[0], n = 1; n < t; ++n) if (e[n] - e[n - 1] !== r) return !1;
	return r;
}
var pg = (e) => e === "left" ? "right" : e === "right" ? "left" : e, mg = (e, t, n) => t === "top" || t === "left" ? e[t] + n : e[t] - n, hg = (e, t) => Math.min(t || e, e);
function gg(e, t) {
	let n = [], r = e.length / t, i = e.length, a = 0;
	for (; a < i; a += r) n.push(e[Math.floor(a)]);
	return n;
}
function _g(e, t, n) {
	let r = e.ticks.length, i = Math.min(t, r - 1), a = e._startPixel, o = e._endPixel, s = 1e-6, c = e.getPixelForTick(i), l;
	if (!(n && (l = r === 1 ? Math.max(c - a, o - c) : t === 0 ? (e.getPixelForTick(1) - c) / 2 : (c - e.getPixelForTick(i - 1)) / 2, c += i < t ? l : -l, c < a - s || c > o + s))) return c;
}
function vg(e, t) {
	G(e, (e) => {
		let n = e.gc, r = n.length / 2, i;
		if (r > t) {
			for (i = 0; i < r; ++i) delete e.data[n[i]];
			n.splice(0, r);
		}
	});
}
function yg(e) {
	return e.drawTicks ? e.tickLength : 0;
}
function bg(e, t) {
	if (!e.display) return 0;
	let n = Jf(e.font, t), r = qf(e.padding);
	return (H(e.text) ? e.text.length : 1) * n.lineHeight + r.height;
}
function xg(e, t) {
	return Zf(e, {
		scale: t,
		type: "scale"
	});
}
function Sg(e, t, n) {
	return Zf(e, {
		tick: n,
		index: t,
		type: "tick"
	});
}
function Cg(e, t, n) {
	let r = Yd(e);
	return (n && t !== "right" || !n && t === "right") && (r = pg(r)), r;
}
function wg(e, t, n, r) {
	let { top: i, left: a, bottom: o, right: s, chart: c } = e, { chartArea: l, scales: u } = c, d = 0, f, p, m, h = o - i, g = s - a;
	if (e.isHorizontal()) {
		if (p = Xd(r, a, s), U(n)) {
			let e = Object.keys(n)[0], r = n[e];
			m = u[e].getPixelForValue(r) + h - t;
		} else m = n === "center" ? (l.bottom + l.top) / 2 + h - t : mg(e, n, t);
		f = s - a;
	} else {
		if (U(n)) {
			let e = Object.keys(n)[0], r = n[e];
			p = u[e].getPixelForValue(r) - g + t;
		} else p = n === "center" ? (l.left + l.right) / 2 - g + t : mg(e, n, t);
		m = Xd(r, o, i), d = n === "left" ? -hd : hd;
	}
	return {
		titleX: p,
		titleY: m,
		maxWidth: f,
		rotation: d
	};
}
var Tg = class e extends ag {
	constructor(e) {
		super(), this.id = e.id, this.type = e.type, this.options = void 0, this.ctx = e.ctx, this.chart = e.chart, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.width = void 0, this.height = void 0, this._margins = {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		}, this.maxWidth = void 0, this.maxHeight = void 0, this.paddingTop = void 0, this.paddingBottom = void 0, this.paddingLeft = void 0, this.paddingRight = void 0, this.axis = void 0, this.labelRotation = void 0, this.min = void 0, this.max = void 0, this._range = void 0, this.ticks = [], this._gridLineItems = null, this._labelItems = null, this._labelSizes = null, this._length = 0, this._maxLength = 0, this._longestTextCache = {}, this._startPixel = void 0, this._endPixel = void 0, this._reversePixels = !1, this._userMax = void 0, this._userMin = void 0, this._suggestedMax = void 0, this._suggestedMin = void 0, this._ticksLength = 0, this._borderValue = 0, this._cache = {}, this._dataLimitsCached = !1, this.$context = void 0;
	}
	init(e) {
		this.options = e.setContext(this.getContext()), this.axis = e.axis, this._userMin = this.parse(e.min), this._userMax = this.parse(e.max), this._suggestedMin = this.parse(e.suggestedMin), this._suggestedMax = this.parse(e.suggestedMax);
	}
	parse(e, t) {
		return e;
	}
	getUserBounds() {
		let { _userMin: e, _userMax: t, _suggestedMin: n, _suggestedMax: r } = this;
		return e = Ku(e, Infinity), t = Ku(t, -Infinity), n = Ku(n, Infinity), r = Ku(r, -Infinity), {
			min: Ku(e, n),
			max: Ku(t, r),
			minDefined: Gu(e),
			maxDefined: Gu(t)
		};
	}
	getMinMax(e) {
		let { min: t, max: n, minDefined: r, maxDefined: i } = this.getUserBounds(), a;
		if (r && i) return {
			min: t,
			max: n
		};
		let o = this.getMatchingVisibleMetas();
		for (let s = 0, c = o.length; s < c; ++s) a = o[s].controller.getMinMax(this, e), r || (t = Math.min(t, a.min)), i || (n = Math.max(n, a.max));
		return t = i && t > n ? n : t, n = r && t > n ? t : n, {
			min: Ku(t, Ku(n, t)),
			max: Ku(n, Ku(t, n))
		};
	}
	getPadding() {
		return {
			left: this.paddingLeft || 0,
			top: this.paddingTop || 0,
			right: this.paddingRight || 0,
			bottom: this.paddingBottom || 0
		};
	}
	getTicks() {
		return this.ticks;
	}
	getLabels() {
		let e = this.chart.data;
		return this.options.labels || (this.isHorizontal() ? e.xLabels : e.yLabels) || e.labels || [];
	}
	getLabelItems(e = this.chart.chartArea) {
		return this._labelItems ||= this._computeLabelItems(e);
	}
	beforeLayout() {
		this._cache = {}, this._dataLimitsCached = !1;
	}
	beforeUpdate() {
		Yu(this.options.beforeUpdate, [this]);
	}
	update(e, t, n) {
		let { beginAtZero: r, grace: i, ticks: a } = this.options, o = a.sampleSize;
		this.beforeUpdate(), this.maxWidth = e, this.maxHeight = t, this._margins = n = Object.assign({
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		}, n), this.ticks = null, this._labelSizes = null, this._gridLineItems = null, this._labelItems = null, this.beforeSetDimensions(), this.setDimensions(), this.afterSetDimensions(), this._maxLength = this.isHorizontal() ? this.width + n.left + n.right : this.height + n.top + n.bottom, this._dataLimitsCached ||= (this.beforeDataLimits(), this.determineDataLimits(), this.afterDataLimits(), this._range = Xf(this, i, r), !0), this.beforeBuildTicks(), this.ticks = this.buildTicks() || [], this.afterBuildTicks();
		let s = o < this.ticks.length;
		this._convertTicksToLabels(s ? gg(this.ticks, o) : this.ticks), this.configure(), this.beforeCalculateLabelRotation(), this.calculateLabelRotation(), this.afterCalculateLabelRotation(), a.display && (a.autoSkip || a.source === "auto") && (this.ticks = og(this, this.ticks), this._labelSizes = null, this.afterAutoSkip()), s && this._convertTicksToLabels(this.ticks), this.beforeFit(), this.fit(), this.afterFit(), this.afterUpdate();
	}
	configure() {
		let e = this.options.reverse, t, n;
		this.isHorizontal() ? (t = this.left, n = this.right) : (t = this.top, n = this.bottom, e = !e), this._startPixel = t, this._endPixel = n, this._reversePixels = e, this._length = n - t, this._alignToPixels = this.options.alignToPixels;
	}
	afterUpdate() {
		Yu(this.options.afterUpdate, [this]);
	}
	beforeSetDimensions() {
		Yu(this.options.beforeSetDimensions, [this]);
	}
	setDimensions() {
		this.isHorizontal() ? (this.width = this.maxWidth, this.left = 0, this.right = this.width) : (this.height = this.maxHeight, this.top = 0, this.bottom = this.height), this.paddingLeft = 0, this.paddingTop = 0, this.paddingRight = 0, this.paddingBottom = 0;
	}
	afterSetDimensions() {
		Yu(this.options.afterSetDimensions, [this]);
	}
	_callHooks(e) {
		this.chart.notifyPlugins(e, this.getContext()), Yu(this.options[e], [this]);
	}
	beforeDataLimits() {
		this._callHooks("beforeDataLimits");
	}
	determineDataLimits() {}
	afterDataLimits() {
		this._callHooks("afterDataLimits");
	}
	beforeBuildTicks() {
		this._callHooks("beforeBuildTicks");
	}
	buildTicks() {
		return [];
	}
	afterBuildTicks() {
		this._callHooks("afterBuildTicks");
	}
	beforeTickToLabelConversion() {
		Yu(this.options.beforeTickToLabelConversion, [this]);
	}
	generateTickLabels(e) {
		let t = this.options.ticks, n, r, i;
		for (n = 0, r = e.length; n < r; n++) i = e[n], i.label = Yu(t.callback, [
			i.value,
			n,
			e
		], this);
	}
	afterTickToLabelConversion() {
		Yu(this.options.afterTickToLabelConversion, [this]);
	}
	beforeCalculateLabelRotation() {
		Yu(this.options.beforeCalculateLabelRotation, [this]);
	}
	calculateLabelRotation() {
		let e = this.options, t = e.ticks, n = hg(this.ticks.length, e.ticks.maxTicksLimit), r = t.minRotation || 0, i = t.maxRotation, a = r, o, s, c;
		if (!this._isVisible() || !t.display || r >= i || n <= 1 || !this.isHorizontal()) {
			this.labelRotation = r;
			return;
		}
		let l = this._getLabelSizes(), u = l.widest.width, d = l.highest.height, f = Fd(this.chart.width - u, 0, this.maxWidth);
		o = e.offset ? this.maxWidth / n : f / (n - 1), u + 6 > o && (o = f / (n - (e.offset ? .5 : 1)), s = this.maxHeight - yg(e.grid) - t.padding - bg(e.title, this.chart.options.font), c = Math.sqrt(u * u + d * d), a = Od(Math.min(Math.asin(Fd((l.highest.height + 6) / o, -1, 1)), Math.asin(Fd(s / c, -1, 1)) - Math.asin(Fd(d / c, -1, 1)))), a = Math.max(r, Math.min(i, a))), this.labelRotation = a;
	}
	afterCalculateLabelRotation() {
		Yu(this.options.afterCalculateLabelRotation, [this]);
	}
	afterAutoSkip() {}
	beforeFit() {
		Yu(this.options.beforeFit, [this]);
	}
	fit() {
		let e = {
			width: 0,
			height: 0
		}, { chart: t, options: { ticks: n, title: r, grid: i } } = this, a = this._isVisible(), o = this.isHorizontal();
		if (a) {
			let a = bg(r, t.options.font);
			if (o ? (e.width = this.maxWidth, e.height = yg(i) + a) : (e.height = this.maxHeight, e.width = yg(i) + a), n.display && this.ticks.length) {
				let { first: t, last: r, widest: i, highest: a } = this._getLabelSizes(), s = n.padding * 2, c = Dd(this.labelRotation), l = Math.cos(c), u = Math.sin(c);
				if (o) {
					let t = n.mirror ? 0 : u * i.width + l * a.height;
					e.height = Math.min(this.maxHeight, e.height + t + s);
				} else {
					let t = n.mirror ? 0 : l * i.width + u * a.height;
					e.width = Math.min(this.maxWidth, e.width + t + s);
				}
				this._calculatePadding(t, r, u, l);
			}
		}
		this._handleMargins(), o ? (this.width = this._length = t.width - this._margins.left - this._margins.right, this.height = e.height) : (this.width = e.width, this.height = this._length = t.height - this._margins.top - this._margins.bottom);
	}
	_calculatePadding(e, t, n, r) {
		let { ticks: { align: i, padding: a }, position: o } = this.options, s = this.labelRotation !== 0, c = o !== "top" && this.axis === "x";
		if (this.isHorizontal()) {
			let o = this.getPixelForTick(0) - this.left, l = this.right - this.getPixelForTick(this.ticks.length - 1), u = 0, d = 0;
			s ? c ? (u = r * e.width, d = n * t.height) : (u = n * e.height, d = r * t.width) : i === "start" ? d = t.width : i === "end" ? u = e.width : i !== "inner" && (u = e.width / 2, d = t.width / 2), this.paddingLeft = Math.max((u - o + a) * this.width / (this.width - o), 0), this.paddingRight = Math.max((d - l + a) * this.width / (this.width - l), 0);
		} else {
			let n = t.height / 2, r = e.height / 2;
			i === "start" ? (n = 0, r = e.height) : i === "end" && (n = t.height, r = 0), this.paddingTop = n + a, this.paddingBottom = r + a;
		}
	}
	_handleMargins() {
		this._margins && (this._margins.left = Math.max(this.paddingLeft, this._margins.left), this._margins.top = Math.max(this.paddingTop, this._margins.top), this._margins.right = Math.max(this.paddingRight, this._margins.right), this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom));
	}
	afterFit() {
		Yu(this.options.afterFit, [this]);
	}
	isHorizontal() {
		let { axis: e, position: t } = this.options;
		return t === "top" || t === "bottom" || e === "x";
	}
	isFullSize() {
		return this.options.fullSize;
	}
	_convertTicksToLabels(e) {
		this.beforeTickToLabelConversion(), this.generateTickLabels(e);
		let t, n;
		for (t = 0, n = e.length; t < n; t++) V(e[t].label) && (e.splice(t, 1), n--, t--);
		this.afterTickToLabelConversion();
	}
	_getLabelSizes() {
		let e = this._labelSizes;
		if (!e) {
			let t = this.options.ticks.sampleSize, n = this.ticks;
			t < n.length && (n = gg(n, t)), this._labelSizes = e = this._computeLabelSizes(n, n.length, this.options.ticks.maxTicksLimit);
		}
		return e;
	}
	_computeLabelSizes(e, t, n) {
		let { ctx: r, _longestTextCache: i } = this, a = [], o = [], s = Math.floor(t / hg(t, n)), c = 0, l = 0, u, d, f, p, m, h, g, _, v, y, b;
		for (u = 0; u < t; u += s) {
			if (p = e[u].label, m = this._resolveTickFontOptions(u), r.font = h = m.string, g = i[h] = i[h] || {
				data: {},
				gc: []
			}, _ = m.lineHeight, v = y = 0, !V(p) && !H(p)) v = wf(r, g.data, g.gc, v, p), y = _;
			else if (H(p)) for (d = 0, f = p.length; d < f; ++d) b = p[d], !V(b) && !H(b) && (v = wf(r, g.data, g.gc, v, b), y += _);
			a.push(v), o.push(y), c = Math.max(v, c), l = Math.max(y, l);
		}
		vg(i, t);
		let x = a.indexOf(c), S = o.indexOf(l), C = (e) => ({
			width: a[e] || 0,
			height: o[e] || 0
		});
		return {
			first: C(0),
			last: C(t - 1),
			widest: C(x),
			highest: C(S),
			widths: a,
			heights: o
		};
	}
	getLabelForValue(e) {
		return e;
	}
	getPixelForValue(e, t) {
		return NaN;
	}
	getValueForPixel(e) {}
	getPixelForTick(e) {
		let t = this.ticks;
		return e < 0 || e > t.length - 1 ? null : this.getPixelForValue(t[e].value);
	}
	getPixelForDecimal(e) {
		this._reversePixels && (e = 1 - e);
		let t = this._startPixel + e * this._length;
		return Id(this._alignToPixels ? Ef(this.chart, t, 0) : t);
	}
	getDecimalForPixel(e) {
		let t = (e - this._startPixel) / this._length;
		return this._reversePixels ? 1 - t : t;
	}
	getBasePixel() {
		return this.getPixelForValue(this.getBaseValue());
	}
	getBaseValue() {
		let { min: e, max: t } = this;
		return e < 0 && t < 0 ? t : e > 0 && t > 0 ? e : 0;
	}
	getContext(e) {
		let t = this.ticks || [];
		if (e >= 0 && e < t.length) {
			let n = t[e];
			return n.$context ||= Sg(this.getContext(), e, n);
		}
		return this.$context ||= xg(this.chart.getContext(), this);
	}
	_tickSize() {
		let e = this.options.ticks, t = Dd(this.labelRotation), n = Math.abs(Math.cos(t)), r = Math.abs(Math.sin(t)), i = this._getLabelSizes(), a = e.autoSkipPadding || 0, o = i ? i.widest.width + a : 0, s = i ? i.highest.height + a : 0;
		return this.isHorizontal() ? s * n > o * r ? o / n : s / r : s * r < o * n ? s / n : o / r;
	}
	_isVisible() {
		let e = this.options.display;
		return e === "auto" ? this.getMatchingVisibleMetas().length > 0 : !!e;
	}
	_computeGridLineItems(e) {
		let t = this.axis, n = this.chart, r = this.options, { grid: i, position: a, border: o } = r, s = i.offset, c = this.isHorizontal(), l = this.ticks.length + +!!s, u = yg(i), d = [], f = o.setContext(this.getContext()), p = f.display ? f.width : 0, m = p / 2, h = function(e) {
			return Ef(n, e, p);
		}, g, _, v, y, b, x, S, C, w, T, E, D;
		if (a === "top") g = h(this.bottom), x = this.bottom - u, C = g - m, T = h(e.top) + m, D = e.bottom;
		else if (a === "bottom") g = h(this.top), T = e.top, D = h(e.bottom) - m, x = g + m, C = this.top + u;
		else if (a === "left") g = h(this.right), b = this.right - u, S = g - m, w = h(e.left) + m, E = e.right;
		else if (a === "right") g = h(this.left), w = e.left, E = h(e.right) - m, b = g + m, S = this.left + u;
		else if (t === "x") {
			if (a === "center") g = h((e.top + e.bottom) / 2 + .5);
			else if (U(a)) {
				let e = Object.keys(a)[0], t = a[e];
				g = h(this.chart.scales[e].getPixelForValue(t));
			}
			T = e.top, D = e.bottom, x = g + m, C = x + u;
		} else if (t === "y") {
			if (a === "center") g = h((e.left + e.right) / 2);
			else if (U(a)) {
				let e = Object.keys(a)[0], t = a[e];
				g = h(this.chart.scales[e].getPixelForValue(t));
			}
			b = g - m, S = b - u, w = e.left, E = e.right;
		}
		let ee = W(r.ticks.maxTicksLimit, l), O = Math.max(1, Math.ceil(l / ee));
		for (_ = 0; _ < l; _ += O) {
			let e = this.getContext(_), t = i.setContext(e), r = o.setContext(e), a = t.lineWidth, l = t.color, u = r.dash || [], f = r.dashOffset, p = t.tickWidth, m = t.tickColor, h = t.tickBorderDash || [], g = t.tickBorderDashOffset;
			v = _g(this, _, s), v !== void 0 && (y = Ef(n, v, a), c ? b = S = w = E = y : x = C = T = D = y, d.push({
				tx1: b,
				ty1: x,
				tx2: S,
				ty2: C,
				x1: w,
				y1: T,
				x2: E,
				y2: D,
				width: a,
				color: l,
				borderDash: u,
				borderDashOffset: f,
				tickWidth: p,
				tickColor: m,
				tickBorderDash: h,
				tickBorderDashOffset: g
			}));
		}
		return this._ticksLength = l, this._borderValue = g, d;
	}
	_computeLabelItems(e) {
		let t = this.axis, n = this.options, { position: r, ticks: i } = n, a = this.isHorizontal(), o = this.ticks, { align: s, crossAlign: c, padding: l, mirror: u } = i, d = yg(n.grid), f = d + l, p = u ? -l : f, m = -Dd(this.labelRotation), h = [], g, _, v, y, b, x, S, C, w, T, E, D, ee = "middle";
		if (r === "top") x = this.bottom - p, S = this._getXAxisLabelAlignment();
		else if (r === "bottom") x = this.top + p, S = this._getXAxisLabelAlignment();
		else if (r === "left") {
			let e = this._getYAxisLabelAlignment(d);
			S = e.textAlign, b = e.x;
		} else if (r === "right") {
			let e = this._getYAxisLabelAlignment(d);
			S = e.textAlign, b = e.x;
		} else if (t === "x") {
			if (r === "center") x = (e.top + e.bottom) / 2 + f;
			else if (U(r)) {
				let e = Object.keys(r)[0], t = r[e];
				x = this.chart.scales[e].getPixelForValue(t) + f;
			}
			S = this._getXAxisLabelAlignment();
		} else if (t === "y") {
			if (r === "center") b = (e.left + e.right) / 2 - f;
			else if (U(r)) {
				let e = Object.keys(r)[0], t = r[e];
				b = this.chart.scales[e].getPixelForValue(t);
			}
			S = this._getYAxisLabelAlignment(d).textAlign;
		}
		t === "y" && (s === "start" ? ee = "top" : s === "end" && (ee = "bottom"));
		let O = this._getLabelSizes();
		for (g = 0, _ = o.length; g < _; ++g) {
			v = o[g], y = v.label;
			let e = i.setContext(this.getContext(g));
			C = this.getPixelForTick(g) + i.labelOffset, w = this._resolveTickFontOptions(g), T = w.lineHeight, E = H(y) ? y.length : 1;
			let t = E / 2, n = e.color, s = e.textStrokeColor, l = e.textStrokeWidth, d = S;
			a ? (b = C, S === "inner" && (d = g === _ - 1 ? this.options.reverse ? "left" : "right" : g === 0 ? this.options.reverse ? "right" : "left" : "center"), D = r === "top" ? c === "near" || m !== 0 ? -E * T + T / 2 : c === "center" ? -O.highest.height / 2 - t * T + T : -O.highest.height + T / 2 : c === "near" || m !== 0 ? T / 2 : c === "center" ? O.highest.height / 2 - t * T : O.highest.height - E * T, u && (D *= -1), m !== 0 && !e.showLabelBackdrop && (b += T / 2 * Math.sin(m))) : (x = C, D = (1 - E) * T / 2);
			let f;
			if (e.showLabelBackdrop) {
				let t = qf(e.backdropPadding), n = O.heights[g], r = O.widths[g], i = D - t.top, a = 0 - t.left;
				switch (ee) {
					case "middle":
						i -= n / 2;
						break;
					case "bottom":
						i -= n;
						break;
				}
				switch (S) {
					case "center":
						a -= r / 2;
						break;
					case "right":
						a -= r;
						break;
					case "inner":
						g === _ - 1 ? a -= r : g > 0 && (a -= r / 2);
						break;
				}
				f = {
					left: a,
					top: i,
					width: r + t.width,
					height: n + t.height,
					color: e.backdropColor
				};
			}
			h.push({
				label: y,
				font: w,
				textOffset: D,
				options: {
					rotation: m,
					color: n,
					strokeColor: s,
					strokeWidth: l,
					textAlign: d,
					textBaseline: ee,
					translation: [b, x],
					backdrop: f
				}
			});
		}
		return h;
	}
	_getXAxisLabelAlignment() {
		let { position: e, ticks: t } = this.options;
		if (-Dd(this.labelRotation)) return e === "top" ? "left" : "right";
		let n = "center";
		return t.align === "start" ? n = "left" : t.align === "end" ? n = "right" : t.align === "inner" && (n = "inner"), n;
	}
	_getYAxisLabelAlignment(e) {
		let { position: t, ticks: { crossAlign: n, mirror: r, padding: i } } = this.options, a = this._getLabelSizes(), o = e + i, s = a.widest.width, c, l;
		return t === "left" ? r ? (l = this.right + i, n === "near" ? c = "left" : n === "center" ? (c = "center", l += s / 2) : (c = "right", l += s)) : (l = this.right - o, n === "near" ? c = "right" : n === "center" ? (c = "center", l -= s / 2) : (c = "left", l = this.left)) : t === "right" ? r ? (l = this.left + i, n === "near" ? c = "right" : n === "center" ? (c = "center", l -= s / 2) : (c = "left", l -= s)) : (l = this.left + o, n === "near" ? c = "left" : n === "center" ? (c = "center", l += s / 2) : (c = "right", l = this.right)) : c = "right", {
			textAlign: c,
			x: l
		};
	}
	_computeLabelArea() {
		if (this.options.ticks.mirror) return;
		let e = this.chart, t = this.options.position;
		if (t === "left" || t === "right") return {
			top: 0,
			left: this.left,
			bottom: e.height,
			right: this.right
		};
		if (t === "top" || t === "bottom") return {
			top: this.top,
			left: 0,
			bottom: this.bottom,
			right: e.width
		};
	}
	drawBackground() {
		let { ctx: e, options: { backgroundColor: t }, left: n, top: r, width: i, height: a } = this;
		t && (e.save(), e.fillStyle = t, e.fillRect(n, r, i, a), e.restore());
	}
	getLineWidthForValue(e) {
		let t = this.options.grid;
		if (!this._isVisible() || !t.display) return 0;
		let n = this.ticks.findIndex((t) => t.value === e);
		return n >= 0 ? t.setContext(this.getContext(n)).lineWidth : 0;
	}
	drawGrid(e) {
		let t = this.options.grid, n = this.ctx, r = this._gridLineItems ||= this._computeGridLineItems(e), i, a, o = (e, t, r) => {
			!r.width || !r.color || (n.save(), n.lineWidth = r.width, n.strokeStyle = r.color, n.setLineDash(r.borderDash || []), n.lineDashOffset = r.borderDashOffset, n.beginPath(), n.moveTo(e.x, e.y), n.lineTo(t.x, t.y), n.stroke(), n.restore());
		};
		if (t.display) for (i = 0, a = r.length; i < a; ++i) {
			let e = r[i];
			t.drawOnChartArea && o({
				x: e.x1,
				y: e.y1
			}, {
				x: e.x2,
				y: e.y2
			}, e), t.drawTicks && o({
				x: e.tx1,
				y: e.ty1
			}, {
				x: e.tx2,
				y: e.ty2
			}, {
				color: e.tickColor,
				width: e.tickWidth,
				borderDash: e.tickBorderDash,
				borderDashOffset: e.tickBorderDashOffset
			});
		}
	}
	drawBorder() {
		let { chart: e, ctx: t, options: { border: n, grid: r } } = this, i = n.setContext(this.getContext()), a = n.display ? i.width : 0;
		if (!a) return;
		let o = r.setContext(this.getContext(0)).lineWidth, s = this._borderValue, c, l, u, d;
		this.isHorizontal() ? (c = Ef(e, this.left, a) - a / 2, l = Ef(e, this.right, o) + o / 2, u = d = s) : (u = Ef(e, this.top, a) - a / 2, d = Ef(e, this.bottom, o) + o / 2, c = l = s), t.save(), t.lineWidth = i.width, t.strokeStyle = i.color, t.beginPath(), t.moveTo(c, u), t.lineTo(l, d), t.stroke(), t.restore();
	}
	drawLabels(e) {
		if (!this.options.ticks.display) return;
		let t = this.ctx, n = this._computeLabelArea();
		n && jf(t, n);
		let r = this.getLabelItems(e);
		for (let e of r) {
			let n = e.options, r = e.font, i = e.label, a = e.textOffset;
			Rf(t, i, 0, a, r, n);
		}
		n && Mf(t);
	}
	drawTitle() {
		let { ctx: e, options: { position: t, title: n, reverse: r } } = this;
		if (!n.display) return;
		let i = Jf(n.font), a = qf(n.padding), o = n.align, s = i.lineHeight / 2;
		t === "bottom" || t === "center" || U(t) ? (s += a.bottom, H(n.text) && (s += i.lineHeight * (n.text.length - 1))) : s += a.top;
		let { titleX: c, titleY: l, maxWidth: u, rotation: d } = wg(this, s, t, o);
		Rf(e, n.text, 0, 0, i, {
			color: n.color,
			maxWidth: u,
			rotation: d,
			textAlign: Cg(o, t, r),
			textBaseline: "middle",
			translation: [c, l]
		});
	}
	draw(e) {
		this._isVisible() && (this.drawBackground(), this.drawGrid(e), this.drawBorder(), this.drawTitle(), this.drawLabels(e));
	}
	_layers() {
		let t = this.options, n = t.ticks && t.ticks.z || 0, r = W(t.grid && t.grid.z, -1), i = W(t.border && t.border.z, 0);
		return !this._isVisible() || this.draw !== e.prototype.draw ? [{
			z: n,
			draw: (e) => {
				this.draw(e);
			}
		}] : [
			{
				z: r,
				draw: (e) => {
					this.drawBackground(), this.drawGrid(e), this.drawTitle();
				}
			},
			{
				z: i,
				draw: () => {
					this.drawBorder();
				}
			},
			{
				z: n,
				draw: (e) => {
					this.drawLabels(e);
				}
			}
		];
	}
	getMatchingVisibleMetas(e) {
		let t = this.chart.getSortedVisibleDatasetMetas(), n = this.axis + "AxisID", r = [], i, a;
		for (i = 0, a = t.length; i < a; ++i) {
			let a = t[i];
			a[n] === this.id && (!e || a.type === e) && r.push(a);
		}
		return r;
	}
	_resolveTickFontOptions(e) {
		return Jf(this.options.ticks.setContext(this.getContext(e)).font);
	}
	_maxDigits() {
		let e = this._resolveTickFontOptions(0).lineHeight;
		return (this.isHorizontal() ? this.width : this.height) / e;
	}
}, Eg = class {
	constructor(e, t, n) {
		this.type = e, this.scope = t, this.override = n, this.items = Object.create(null);
	}
	isForType(e) {
		return Object.prototype.isPrototypeOf.call(this.type.prototype, e.prototype);
	}
	register(e) {
		let t = Object.getPrototypeOf(e), n;
		kg(t) && (n = this.register(t));
		let r = this.items, i = e.id, a = this.scope + "." + i;
		if (!i) throw Error("class does not have id: " + e);
		return i in r ? a : (r[i] = e, Dg(e, a, n), this.override && Sf.override(e.id, e.overrides), a);
	}
	get(e) {
		return this.items[e];
	}
	unregister(e) {
		let t = this.items, n = e.id, r = this.scope;
		n in t && delete t[n], r && n in Sf[r] && (delete Sf[r][n], this.override && delete vf[n]);
	}
};
function Dg(e, t, n) {
	let r = ed(Object.create(null), [
		n ? Sf.get(n) : {},
		Sf.get(t),
		e.defaults
	]);
	Sf.set(t, r), e.defaultRoutes && Og(t, e.defaultRoutes), e.descriptors && Sf.describe(t, e.descriptors);
}
function Og(e, t) {
	Object.keys(t).forEach((n) => {
		let r = n.split("."), i = r.pop(), a = [e].concat(r).join("."), o = t[n].split("."), s = o.pop(), c = o.join(".");
		Sf.route(a, i, c, s);
	});
}
function kg(e) {
	return "id" in e && "defaults" in e;
}
var Ag = /* @__PURE__ */ new class {
	constructor() {
		this.controllers = new Eg(zm, "datasets", !0), this.elements = new Eg(ag, "elements"), this.plugins = new Eg(Object, "plugins"), this.scales = new Eg(Tg, "scales"), this._typedRegistries = [
			this.controllers,
			this.scales,
			this.elements
		];
	}
	add(...e) {
		this._each("register", e);
	}
	remove(...e) {
		this._each("unregister", e);
	}
	addControllers(...e) {
		this._each("register", e, this.controllers);
	}
	addElements(...e) {
		this._each("register", e, this.elements);
	}
	addPlugins(...e) {
		this._each("register", e, this.plugins);
	}
	addScales(...e) {
		this._each("register", e, this.scales);
	}
	getController(e) {
		return this._get(e, this.controllers, "controller");
	}
	getElement(e) {
		return this._get(e, this.elements, "element");
	}
	getPlugin(e) {
		return this._get(e, this.plugins, "plugin");
	}
	getScale(e) {
		return this._get(e, this.scales, "scale");
	}
	removeControllers(...e) {
		this._each("unregister", e, this.controllers);
	}
	removeElements(...e) {
		this._each("unregister", e, this.elements);
	}
	removePlugins(...e) {
		this._each("unregister", e, this.plugins);
	}
	removeScales(...e) {
		this._each("unregister", e, this.scales);
	}
	_each(e, t, n) {
		[...t].forEach((t) => {
			let r = n || this._getRegistryForType(t);
			n || r.isForType(t) || r === this.plugins && t.id ? this._exec(e, r, t) : G(t, (t) => {
				let r = n || this._getRegistryForType(t);
				this._exec(e, r, t);
			});
		});
	}
	_exec(e, t, n) {
		let r = sd(e);
		Yu(n["before" + r], [], n), t[e](n), Yu(n["after" + r], [], n);
	}
	_getRegistryForType(e) {
		for (let t = 0; t < this._typedRegistries.length; t++) {
			let n = this._typedRegistries[t];
			if (n.isForType(e)) return n;
		}
		return this.plugins;
	}
	_get(e, t, n) {
		let r = t.get(e);
		if (r === void 0) throw Error("\"" + e + "\" is not a registered " + n + ".");
		return r;
	}
}(), jg = class {
	constructor() {
		this._init = void 0;
	}
	notify(e, t, n, r) {
		if (t === "beforeInit" && (this._init = this._createDescriptors(e, !0), this._notify(this._init, e, "install")), this._init === void 0) return;
		let i = r ? this._descriptors(e).filter(r) : this._descriptors(e), a = this._notify(i, e, t, n);
		return t === "afterDestroy" && (this._notify(i, e, "stop"), this._notify(this._init, e, "uninstall"), this._init = void 0), a;
	}
	_notify(e, t, n, r) {
		r ||= {};
		for (let i of e) {
			let e = i.plugin, a = e[n];
			if (Yu(a, [
				t,
				r,
				i.options
			], e) === !1 && r.cancelable) return !1;
		}
		return !0;
	}
	invalidate() {
		V(this._cache) || (this._oldCache = this._cache, this._cache = void 0);
	}
	_descriptors(e) {
		if (this._cache) return this._cache;
		let t = this._cache = this._createDescriptors(e);
		return this._notifyStateChanges(e), t;
	}
	_createDescriptors(e, t) {
		let n = e && e.config, r = W(n.options && n.options.plugins, {}), i = Mg(n);
		return r === !1 && !t ? [] : Pg(e, i, r, t);
	}
	_notifyStateChanges(e) {
		let t = this._oldCache || [], n = this._cache, r = (e, t) => e.filter((e) => !t.some((t) => e.plugin.id === t.plugin.id));
		this._notify(r(t, n), e, "stop"), this._notify(r(n, t), e, "start");
	}
};
function Mg(e) {
	let t = {}, n = [], r = Object.keys(Ag.plugins.items);
	for (let e = 0; e < r.length; e++) n.push(Ag.getPlugin(r[e]));
	let i = e.plugins || [];
	for (let e = 0; e < i.length; e++) {
		let r = i[e];
		n.indexOf(r) === -1 && (n.push(r), t[r.id] = !0);
	}
	return {
		plugins: n,
		localIds: t
	};
}
function Ng(e, t) {
	return !t && e === !1 ? null : e === !0 ? {} : e;
}
function Pg(e, { plugins: t, localIds: n }, r, i) {
	let a = [], o = e.getContext();
	for (let s of t) {
		let t = s.id, c = Ng(r[t], i);
		c !== null && a.push({
			plugin: s,
			options: Fg(e.config, {
				plugin: s,
				local: n[t]
			}, c, o)
		});
	}
	return a;
}
function Fg(e, { plugin: t, local: n }, r, i) {
	let a = e.pluginScopeKeys(t), o = e.getOptionScopes(r, a);
	return n && t.defaults && o.push(t.defaults), e.createResolver(o, i, [""], {
		scriptable: !1,
		indexable: !1,
		allKeys: !0
	});
}
function Ig(e, t) {
	let n = Sf.datasets[e] || {};
	return ((t.datasets || {})[e] || {}).indexAxis || t.indexAxis || n.indexAxis || "x";
}
function Lg(e, t) {
	let n = e;
	return e === "_index_" ? n = t : e === "_value_" && (n = t === "x" ? "y" : "x"), n;
}
function Rg(e, t) {
	return e === t ? "_index_" : "_value_";
}
function zg(e) {
	if (e === "x" || e === "y" || e === "r") return e;
}
function Bg(e) {
	if (e === "top" || e === "bottom") return "x";
	if (e === "left" || e === "right") return "y";
}
function Vg(e, ...t) {
	if (zg(e)) return e;
	for (let n of t) {
		let t = n.axis || Bg(n.position) || e.length > 1 && zg(e[0].toLowerCase());
		if (t) return t;
	}
	throw Error(`Cannot determine type of '${e}' axis. Please provide 'axis' or 'position' option.`);
}
function Hg(e, t, n) {
	if (n[t + "AxisID"] === e) return { axis: t };
}
function Ug(e, t) {
	if (t.data && t.data.datasets) {
		let n = t.data.datasets.filter((t) => t.xAxisID === e || t.yAxisID === e);
		if (n.length) return Hg(e, "x", n[0]) || Hg(e, "y", n[0]);
	}
	return {};
}
function Wg(e, t) {
	let n = vf[e.type] || { scales: {} }, r = t.scales || {}, i = Ig(e.type, t), a = Object.create(null);
	return Object.keys(r).forEach((t) => {
		let o = r[t];
		if (!U(o)) return console.error(`Invalid scale configuration for scale: ${t}`);
		if (o._proxy) return console.warn(`Ignoring resolver passed as options for scale: ${t}`);
		let s = Vg(t, o, Ug(t, e), Sf.scales[o.type]), c = Rg(s, i), l = n.scales || {};
		a[t] = td(Object.create(null), [
			{ axis: s },
			o,
			l[s],
			l[c]
		]);
	}), e.data.datasets.forEach((n) => {
		let i = n.type || e.type, o = n.indexAxis || Ig(i, t), s = (vf[i] || {}).scales || {};
		Object.keys(s).forEach((e) => {
			let t = Lg(e, o), i = n[t + "AxisID"] || t;
			a[i] = a[i] || Object.create(null), td(a[i], [
				{ axis: t },
				r[i],
				s[e]
			]);
		});
	}), Object.keys(a).forEach((e) => {
		let t = a[e];
		td(t, [Sf.scales[t.type], Sf.scale]);
	}), a;
}
function Gg(e) {
	let t = e.options ||= {};
	t.plugins = W(t.plugins, {}), t.scales = Wg(e, t);
}
function Kg(e) {
	return e ||= {}, e.datasets = e.datasets || [], e.labels = e.labels || [], e;
}
function qg(e) {
	return e ||= {}, e.data = Kg(e.data), Gg(e), e;
}
var Jg = /* @__PURE__ */ new Map(), Yg = /* @__PURE__ */ new Set();
function Xg(e, t) {
	let n = Jg.get(e);
	return n || (n = t(), Jg.set(e, n), Yg.add(n)), n;
}
var Zg = (e, t, n) => {
	let r = od(t, n);
	r !== void 0 && e.add(r);
}, Qg = class {
	constructor(e) {
		this._config = qg(e), this._scopeCache = /* @__PURE__ */ new Map(), this._resolverCache = /* @__PURE__ */ new Map();
	}
	get platform() {
		return this._config.platform;
	}
	get type() {
		return this._config.type;
	}
	set type(e) {
		this._config.type = e;
	}
	get data() {
		return this._config.data;
	}
	set data(e) {
		this._config.data = Kg(e);
	}
	get options() {
		return this._config.options;
	}
	set options(e) {
		this._config.options = e;
	}
	get plugins() {
		return this._config.plugins;
	}
	update() {
		let e = this._config;
		this.clearCache(), Gg(e);
	}
	clearCache() {
		this._scopeCache.clear(), this._resolverCache.clear();
	}
	datasetScopeKeys(e) {
		return Xg(e, () => [[`datasets.${e}`, ""]]);
	}
	datasetAnimationScopeKeys(e, t) {
		return Xg(`${e}.transition.${t}`, () => [[`datasets.${e}.transitions.${t}`, `transitions.${t}`], [`datasets.${e}`, ""]]);
	}
	datasetElementScopeKeys(e, t) {
		return Xg(`${e}-${t}`, () => [[
			`datasets.${e}.elements.${t}`,
			`datasets.${e}`,
			`elements.${t}`,
			""
		]]);
	}
	pluginScopeKeys(e) {
		let t = e.id, n = this.type;
		return Xg(`${n}-plugin-${t}`, () => [[`plugins.${t}`, ...e.additionalOptionScopes || []]]);
	}
	_cachedScopes(e, t) {
		let n = this._scopeCache, r = n.get(e);
		return (!r || t) && (r = /* @__PURE__ */ new Map(), n.set(e, r)), r;
	}
	getOptionScopes(e, t, n) {
		let { options: r, type: i } = this, a = this._cachedScopes(e, n), o = a.get(t);
		if (o) return o;
		let s = /* @__PURE__ */ new Set();
		t.forEach((t) => {
			e && (s.add(e), t.forEach((t) => Zg(s, e, t))), t.forEach((e) => Zg(s, r, e)), t.forEach((e) => Zg(s, vf[i] || {}, e)), t.forEach((e) => Zg(s, Sf, e)), t.forEach((e) => Zg(s, yf, e));
		});
		let c = Array.from(s);
		return c.length === 0 && c.push(Object.create(null)), Yg.has(t) && a.set(t, c), c;
	}
	chartOptionScopes() {
		let { options: e, type: t } = this;
		return [
			e,
			vf[t] || {},
			Sf.datasets[t] || {},
			{ type: t },
			Sf,
			yf
		];
	}
	resolveNamedOptions(e, t, n, r = [""]) {
		let i = { $shared: !0 }, { resolver: a, subPrefixes: o } = $g(this._resolverCache, e, r), s = a;
		if (t_(a, t)) {
			i.$shared = !1, n = ld(n) ? n() : n;
			let t = this.createResolver(e, n, o);
			s = $f(a, n, t);
		}
		for (let e of t) i[e] = s[e];
		return i;
	}
	createResolver(e, t, n = [""], r) {
		let { resolver: i } = $g(this._resolverCache, e, n);
		return U(t) ? $f(i, t, void 0, r) : i;
	}
};
function $g(e, t, n) {
	let r = e.get(t);
	r || (r = /* @__PURE__ */ new Map(), e.set(t, r));
	let i = n.join(), a = r.get(i);
	return a || (a = {
		resolver: Qf(t, n),
		subPrefixes: n.filter((e) => !e.toLowerCase().includes("hover"))
	}, r.set(i, a)), a;
}
var e_ = (e) => U(e) && Object.getOwnPropertyNames(e).some((t) => ld(e[t]));
function t_(e, t) {
	let { isScriptable: n, isIndexable: r } = ep(e);
	for (let i of t) {
		let t = n(i), a = r(i), o = (a || t) && e[i];
		if (t && (ld(o) || e_(o)) || a && H(o)) return !0;
	}
	return !1;
}
var n_ = "4.5.1", r_ = [
	"top",
	"bottom",
	"left",
	"right",
	"chartArea"
];
function i_(e, t) {
	return e === "top" || e === "bottom" || r_.indexOf(e) === -1 && t === "x";
}
function a_(e, t) {
	return function(n, r) {
		return n[e] === r[e] ? n[t] - r[t] : n[e] - r[e];
	};
}
function o_(e) {
	let t = e.chart, n = t.options.animation;
	t.notifyPlugins("afterRender"), Yu(n && n.onComplete, [e], t);
}
function s_(e) {
	let t = e.chart, n = t.options.animation;
	Yu(n && n.onProgress, [e], t);
}
function c_(e) {
	return Op() && typeof e == "string" ? e = document.getElementById(e) : e && e.length && (e = e[0]), e && e.canvas && (e = e.canvas), e;
}
var l_ = {}, u_ = (e) => {
	let t = c_(e);
	return Object.values(l_).filter((e) => e.canvas === t).pop();
};
function d_(e, t, n) {
	let r = Object.keys(e);
	for (let i of r) {
		let r = +i;
		if (r >= t) {
			let a = e[i];
			delete e[i], (n > 0 || r > t) && (e[r + n] = a);
		}
	}
}
function f_(e, t, n, r) {
	return !n || e.type === "mouseout" ? null : r ? t : e;
}
var J = class {
	static defaults = Sf;
	static instances = l_;
	static overrides = vf;
	static registry = Ag;
	static version = n_;
	static getChart = u_;
	static register(...e) {
		Ag.add(...e), p_();
	}
	static unregister(...e) {
		Ag.remove(...e), p_();
	}
	constructor(e, t) {
		let n = this.config = new Qg(t), r = c_(e), i = u_(r);
		if (i) throw Error("Canvas is already in use. Chart with ID '" + i.id + "' must be destroyed before the canvas with ID '" + i.canvas.id + "' can be reused.");
		let a = n.createResolver(n.chartOptionScopes(), this.getContext());
		this.platform = new (n.platform || (ig(r)))(), this.platform.updateConfig(n);
		let o = this.platform.acquireContext(r, a.aspectRatio), s = o && o.canvas, c = s && s.height, l = s && s.width;
		if (this.id = Wu(), this.ctx = o, this.canvas = s, this.width = l, this.height = c, this._options = a, this._aspectRatio = this.aspectRatio, this._layers = [], this._metasets = [], this._stacks = void 0, this.boxes = [], this.currentDevicePixelRatio = void 0, this.chartArea = void 0, this._active = [], this._lastEvent = void 0, this._listeners = {}, this._responsiveListeners = void 0, this._sortedMetasets = [], this.scales = {}, this._plugins = new jg(), this.$proxies = {}, this._hiddenIndices = {}, this.attached = !1, this._animationsDisabled = void 0, this.$context = void 0, this._doResize = Jd((e) => this.update(e), a.resizeDelay || 0), this._dataChanges = [], l_[this.id] = this, !o || !s) {
			console.error("Failed to create chart: can't acquire context from the given item");
			return;
		}
		pm.listen(this, "complete", o_), pm.listen(this, "progress", s_), this._initialize(), this.attached && this.update();
	}
	get aspectRatio() {
		let { options: { aspectRatio: e, maintainAspectRatio: t }, width: n, height: r, _aspectRatio: i } = this;
		return V(e) ? t && i ? i : r ? n / r : null : e;
	}
	get data() {
		return this.config.data;
	}
	set data(e) {
		this.config.data = e;
	}
	get options() {
		return this._options;
	}
	set options(e) {
		this.config.options = e;
	}
	get registry() {
		return Ag;
	}
	_initialize() {
		return this.notifyPlugins("beforeInit"), this.options.responsive ? this.resize() : Vp(this, this.options.devicePixelRatio), this.bindEvents(), this.notifyPlugins("afterInit"), this;
	}
	clear() {
		return Df(this.canvas, this.ctx), this;
	}
	stop() {
		return pm.stop(this), this;
	}
	resize(e, t) {
		pm.running(this) ? this._resizeBeforeDraw = {
			width: e,
			height: t
		} : this._resize(e, t);
	}
	_resize(e, t) {
		let n = this.options, r = this.canvas, i = n.maintainAspectRatio && this.aspectRatio, a = this.platform.getMaximumSize(r, e, t, i), o = n.devicePixelRatio || this.platform.getDevicePixelRatio(), s = this.width ? "resize" : "attach";
		this.width = a.width, this.height = a.height, this._aspectRatio = this.aspectRatio, Vp(this, o, !0) && (this.notifyPlugins("resize", { size: a }), Yu(n.onResize, [this, a], this), this.attached && this._doResize(s) && this.render());
	}
	ensureScalesHaveIDs() {
		G(this.options.scales || {}, (e, t) => {
			e.id = t;
		});
	}
	buildOrUpdateScales() {
		let e = this.options, t = e.scales, n = this.scales, r = Object.keys(n).reduce((e, t) => (e[t] = !1, e), {}), i = [];
		t && (i = i.concat(Object.keys(t).map((e) => {
			let n = t[e], r = Vg(e, n), i = r === "r", a = r === "x";
			return {
				options: n,
				dposition: i ? "chartArea" : a ? "bottom" : "left",
				dtype: i ? "radialLinear" : a ? "category" : "linear"
			};
		}))), G(i, (t) => {
			let i = t.options, a = i.id, o = Vg(a, i), s = W(i.type, t.dtype);
			(i.position === void 0 || i_(i.position, o) !== i_(t.dposition)) && (i.position = t.dposition), r[a] = !0;
			let c = null;
			a in n && n[a].type === s ? c = n[a] : (c = new (Ag.getScale(s))({
				id: a,
				type: s,
				ctx: this.ctx,
				chart: this
			}), n[c.id] = c), c.init(i, e);
		}), G(r, (e, t) => {
			e || delete n[t];
		}), G(n, (e) => {
			Fh.configure(this, e, e.options), Fh.addBox(this, e);
		});
	}
	_updateMetasets() {
		let e = this._metasets, t = this.data.datasets.length, n = e.length;
		if (e.sort((e, t) => e.index - t.index), n > t) {
			for (let e = t; e < n; ++e) this._destroyDatasetMeta(e);
			e.splice(t, n - t);
		}
		this._sortedMetasets = e.slice(0).sort(a_("order", "index"));
	}
	_removeUnreferencedMetasets() {
		let { _metasets: e, data: { datasets: t } } = this;
		e.length > t.length && delete this._stacks, e.forEach((e, n) => {
			t.filter((t) => t === e._dataset).length === 0 && this._destroyDatasetMeta(n);
		});
	}
	buildOrUpdateControllers() {
		let e = [], t = this.data.datasets, n, r;
		for (this._removeUnreferencedMetasets(), n = 0, r = t.length; n < r; n++) {
			let r = t[n], i = this.getDatasetMeta(n), a = r.type || this.config.type;
			if (i.type && i.type !== a && (this._destroyDatasetMeta(n), i = this.getDatasetMeta(n)), i.type = a, i.indexAxis = r.indexAxis || Ig(a, this.options), i.order = r.order || 0, i.index = n, i.label = "" + r.label, i.visible = this.isDatasetVisible(n), i.controller) i.controller.updateIndex(n), i.controller.linkScales();
			else {
				let t = Ag.getController(a), { datasetElementType: r, dataElementType: o } = Sf.datasets[a];
				Object.assign(t, {
					dataElementType: Ag.getElement(o),
					datasetElementType: r && Ag.getElement(r)
				}), i.controller = new t(this, n), e.push(i.controller);
			}
		}
		return this._updateMetasets(), e;
	}
	_resetElements() {
		G(this.data.datasets, (e, t) => {
			this.getDatasetMeta(t).controller.reset();
		}, this);
	}
	reset() {
		this._resetElements(), this.notifyPlugins("reset");
	}
	update(e) {
		let t = this.config;
		t.update();
		let n = this._options = t.createResolver(t.chartOptionScopes(), this.getContext()), r = this._animationsDisabled = !n.animation;
		if (this._updateScales(), this._checkEventBindings(), this._updateHiddenIndices(), this._plugins.invalidate(), this.notifyPlugins("beforeUpdate", {
			mode: e,
			cancelable: !0
		}) === !1) return;
		let i = this.buildOrUpdateControllers();
		this.notifyPlugins("beforeElementsUpdate");
		let a = 0;
		for (let e = 0, t = this.data.datasets.length; e < t; e++) {
			let { controller: t } = this.getDatasetMeta(e), n = !r && i.indexOf(t) === -1;
			t.buildOrUpdateElements(n), a = Math.max(+t.getMaxOverflow(), a);
		}
		a = this._minPadding = n.layout.autoPadding ? a : 0, this._updateLayout(a), r || G(i, (e) => {
			e.reset();
		}), this._updateDatasets(e), this.notifyPlugins("afterUpdate", { mode: e }), this._layers.sort(a_("z", "_idx"));
		let { _active: o, _lastEvent: s } = this;
		s ? this._eventHandler(s, !0) : o.length && this._updateHoverStyles(o, o, !0), this.render();
	}
	_updateScales() {
		G(this.scales, (e) => {
			Fh.removeBox(this, e);
		}), this.ensureScalesHaveIDs(), this.buildOrUpdateScales();
	}
	_checkEventBindings() {
		let e = this.options;
		(!ud(new Set(Object.keys(this._listeners)), new Set(e.events)) || !!this._responsiveListeners !== e.responsive) && (this.unbindEvents(), this.bindEvents());
	}
	_updateHiddenIndices() {
		let { _hiddenIndices: e } = this, t = this._getUniformDataChanges() || [];
		for (let { method: n, start: r, count: i } of t) d_(e, r, n === "_removeElements" ? -i : i);
	}
	_getUniformDataChanges() {
		let e = this._dataChanges;
		if (!e || !e.length) return;
		this._dataChanges = [];
		let t = this.data.datasets.length, n = (t) => new Set(e.filter((e) => e[0] === t).map((e, t) => t + "," + e.splice(1).join(","))), r = n(0);
		for (let e = 1; e < t; e++) if (!ud(r, n(e))) return;
		return Array.from(r).map((e) => e.split(",")).map((e) => ({
			method: e[1],
			start: +e[2],
			count: +e[3]
		}));
	}
	_updateLayout(e) {
		if (this.notifyPlugins("beforeLayout", { cancelable: !0 }) === !1) return;
		Fh.update(this, this.width, this.height, e);
		let t = this.chartArea, n = t.width <= 0 || t.height <= 0;
		this._layers = [], G(this.boxes, (e) => {
			n && e.position === "chartArea" || (e.configure && e.configure(), this._layers.push(...e._layers()));
		}, this), this._layers.forEach((e, t) => {
			e._idx = t;
		}), this.notifyPlugins("afterLayout");
	}
	_updateDatasets(e) {
		if (this.notifyPlugins("beforeDatasetsUpdate", {
			mode: e,
			cancelable: !0
		}) !== !1) {
			for (let e = 0, t = this.data.datasets.length; e < t; ++e) this.getDatasetMeta(e).controller.configure();
			for (let t = 0, n = this.data.datasets.length; t < n; ++t) this._updateDataset(t, ld(e) ? e({ datasetIndex: t }) : e);
			this.notifyPlugins("afterDatasetsUpdate", { mode: e });
		}
	}
	_updateDataset(e, t) {
		let n = this.getDatasetMeta(e), r = {
			meta: n,
			index: e,
			mode: t,
			cancelable: !0
		};
		this.notifyPlugins("beforeDatasetUpdate", r) !== !1 && (n.controller._update(t), r.cancelable = !1, this.notifyPlugins("afterDatasetUpdate", r));
	}
	render() {
		this.notifyPlugins("beforeRender", { cancelable: !0 }) !== !1 && (pm.has(this) ? this.attached && !pm.running(this) && pm.start(this) : (this.draw(), o_({ chart: this })));
	}
	draw() {
		let e;
		if (this._resizeBeforeDraw) {
			let { width: e, height: t } = this._resizeBeforeDraw;
			this._resizeBeforeDraw = null, this._resize(e, t);
		}
		if (this.clear(), this.width <= 0 || this.height <= 0 || this.notifyPlugins("beforeDraw", { cancelable: !0 }) === !1) return;
		let t = this._layers;
		for (e = 0; e < t.length && t[e].z <= 0; ++e) t[e].draw(this.chartArea);
		for (this._drawDatasets(); e < t.length; ++e) t[e].draw(this.chartArea);
		this.notifyPlugins("afterDraw");
	}
	_getSortedDatasetMetas(e) {
		let t = this._sortedMetasets, n = [], r, i;
		for (r = 0, i = t.length; r < i; ++r) {
			let i = t[r];
			(!e || i.visible) && n.push(i);
		}
		return n;
	}
	getSortedVisibleDatasetMetas() {
		return this._getSortedDatasetMetas(!0);
	}
	_drawDatasets() {
		if (this.notifyPlugins("beforeDatasetsDraw", { cancelable: !0 }) === !1) return;
		let e = this.getSortedVisibleDatasetMetas();
		for (let t = e.length - 1; t >= 0; --t) this._drawDataset(e[t]);
		this.notifyPlugins("afterDatasetsDraw");
	}
	_drawDataset(e) {
		let t = this.ctx, n = {
			meta: e,
			index: e.index,
			cancelable: !0
		}, r = fm(this, e);
		this.notifyPlugins("beforeDatasetDraw", n) !== !1 && (r && jf(t, r), e.controller.draw(), r && Mf(t), n.cancelable = !1, this.notifyPlugins("afterDatasetDraw", n));
	}
	isPointInArea(e) {
		return Af(e, this.chartArea, this._minPadding);
	}
	getElementsAtEventForMode(e, t, n, r) {
		let i = vh.modes[t];
		return typeof i == "function" ? i(this, e, n, r) : [];
	}
	getDatasetMeta(e) {
		let t = this.data.datasets[e], n = this._metasets, r = n.filter((e) => e && e._dataset === t).pop();
		return r || (r = {
			type: null,
			data: [],
			dataset: null,
			controller: null,
			hidden: null,
			xAxisID: null,
			yAxisID: null,
			order: t && t.order || 0,
			index: e,
			_dataset: t,
			_parsed: [],
			_sorted: !1
		}, n.push(r)), r;
	}
	getContext() {
		return this.$context ||= Zf(null, {
			chart: this,
			type: "chart"
		});
	}
	getVisibleDatasetCount() {
		return this.getSortedVisibleDatasetMetas().length;
	}
	isDatasetVisible(e) {
		let t = this.data.datasets[e];
		if (!t) return !1;
		let n = this.getDatasetMeta(e);
		return typeof n.hidden == "boolean" ? !n.hidden : !t.hidden;
	}
	setDatasetVisibility(e, t) {
		let n = this.getDatasetMeta(e);
		n.hidden = !t;
	}
	toggleDataVisibility(e) {
		this._hiddenIndices[e] = !this._hiddenIndices[e];
	}
	getDataVisibility(e) {
		return !this._hiddenIndices[e];
	}
	_updateVisibility(e, t, n) {
		let r = n ? "show" : "hide", i = this.getDatasetMeta(e), a = i.controller._resolveAnimations(void 0, r);
		cd(t) ? (i.data[t].hidden = !n, this.update()) : (this.setDatasetVisibility(e, n), a.update(i, { visible: n }), this.update((t) => t.datasetIndex === e ? r : void 0));
	}
	hide(e, t) {
		this._updateVisibility(e, t, !1);
	}
	show(e, t) {
		this._updateVisibility(e, t, !0);
	}
	_destroyDatasetMeta(e) {
		let t = this._metasets[e];
		t && t.controller && t.controller._destroy(), delete this._metasets[e];
	}
	_stop() {
		let e, t;
		for (this.stop(), pm.remove(this), e = 0, t = this.data.datasets.length; e < t; ++e) this._destroyDatasetMeta(e);
	}
	destroy() {
		this.notifyPlugins("beforeDestroy");
		let { canvas: e, ctx: t } = this;
		this._stop(), this.config.clearCache(), e && (this.unbindEvents(), Df(e, t), this.platform.releaseContext(t), this.canvas = null, this.ctx = null), delete l_[this.id], this.notifyPlugins("afterDestroy");
	}
	toBase64Image(...e) {
		return this.canvas.toDataURL(...e);
	}
	bindEvents() {
		this.bindUserEvents(), this.options.responsive ? this.bindResponsiveEvents() : this.attached = !0;
	}
	bindUserEvents() {
		let e = this._listeners, t = this.platform, n = (n, r) => {
			t.addEventListener(this, n, r), e[n] = r;
		}, r = (e, t, n) => {
			e.offsetX = t, e.offsetY = n, this._eventHandler(e);
		};
		G(this.options.events, (e) => n(e, r));
	}
	bindResponsiveEvents() {
		this._responsiveListeners ||= {};
		let e = this._responsiveListeners, t = this.platform, n = (n, r) => {
			t.addEventListener(this, n, r), e[n] = r;
		}, r = (n, r) => {
			e[n] && (t.removeEventListener(this, n, r), delete e[n]);
		}, i = (e, t) => {
			this.canvas && this.resize(e, t);
		}, a, o = () => {
			r("attach", o), this.attached = !0, this.resize(), n("resize", i), n("detach", a);
		};
		a = () => {
			this.attached = !1, r("resize", i), this._stop(), this._resize(0, 0), n("attach", o);
		}, t.isAttached(this.canvas) ? o() : a();
	}
	unbindEvents() {
		G(this._listeners, (e, t) => {
			this.platform.removeEventListener(this, t, e);
		}), this._listeners = {}, G(this._responsiveListeners, (e, t) => {
			this.platform.removeEventListener(this, t, e);
		}), this._responsiveListeners = void 0;
	}
	updateHoverStyle(e, t, n) {
		let r = n ? "set" : "remove", i, a, o, s;
		for (t === "dataset" && (i = this.getDatasetMeta(e[0].datasetIndex), i.controller["_" + r + "DatasetHoverStyle"]()), o = 0, s = e.length; o < s; ++o) {
			a = e[o];
			let t = a && this.getDatasetMeta(a.datasetIndex).controller;
			t && t[r + "HoverStyle"](a.element, a.datasetIndex, a.index);
		}
	}
	getActiveElements() {
		return this._active || [];
	}
	setActiveElements(e) {
		let t = this._active || [], n = e.map(({ datasetIndex: e, index: t }) => {
			let n = this.getDatasetMeta(e);
			if (!n) throw Error("No dataset found at index " + e);
			return {
				datasetIndex: e,
				element: n.data[t],
				index: t
			};
		});
		Xu(n, t) || (this._active = n, this._lastEvent = null, this._updateHoverStyles(n, t));
	}
	notifyPlugins(e, t, n) {
		return this._plugins.notify(this, e, t, n);
	}
	isPluginEnabled(e) {
		return this._plugins._cache.filter((t) => t.plugin.id === e).length === 1;
	}
	_updateHoverStyles(e, t, n) {
		let r = this.options.hover, i = (e, t) => e.filter((e) => !t.some((t) => e.datasetIndex === t.datasetIndex && e.index === t.index)), a = i(t, e), o = n ? e : i(e, t);
		a.length && this.updateHoverStyle(a, r.mode, !1), o.length && r.mode && this.updateHoverStyle(o, r.mode, !0);
	}
	_eventHandler(e, t) {
		let n = {
			event: e,
			replay: t,
			cancelable: !0,
			inChartArea: this.isPointInArea(e)
		}, r = (t) => (t.options.events || this.options.events).includes(e.native.type);
		if (this.notifyPlugins("beforeEvent", n, r) === !1) return;
		let i = this._handleEvent(e, t, n.inChartArea);
		return n.cancelable = !1, this.notifyPlugins("afterEvent", n, r), (i || n.changed) && this.render(), this;
	}
	_handleEvent(e, t, n) {
		let { _active: r = [], options: i } = this, a = t, o = this._getActiveElements(e, r, n, a), s = dd(e), c = f_(e, this._lastEvent, n, s);
		n && (this._lastEvent = null, Yu(i.onHover, [
			e,
			o,
			this
		], this), s && Yu(i.onClick, [
			e,
			o,
			this
		], this));
		let l = !Xu(o, r);
		return (l || t) && (this._active = o, this._updateHoverStyles(o, r, t)), this._lastEvent = c, l;
	}
	_getActiveElements(e, t, n, r) {
		if (e.type === "mouseout") return [];
		if (!n) return t;
		let i = this.options.hover;
		return this.getElementsAtEventForMode(e, i.mode, i, r);
	}
};
function p_() {
	return G(J.instances, (e) => e._plugins.invalidate());
}
function m_(e, t, n) {
	let { startAngle: r, x: i, y: a, outerRadius: o, innerRadius: s, options: c } = t, { borderWidth: l, borderJoinStyle: u } = c, d = Math.min(l / o, Nd(r - n));
	if (e.beginPath(), e.arc(i, a, o - l / 2, r + d / 2, n - d / 2), s > 0) {
		let t = Math.min(l / s, Nd(r - n));
		e.arc(i, a, s + l / 2, n - t / 2, r + t / 2, !0);
	} else {
		let t = Math.min(l / 2, o * Nd(r - n));
		if (u === "round") e.arc(i, a, t, n - K / 2, r + K / 2, !0);
		else if (u === "bevel") {
			let o = 2 * t * t, s = -o * Math.cos(n + K / 2) + i, c = -o * Math.sin(n + K / 2) + a, l = o * Math.cos(r + K / 2) + i, u = o * Math.sin(r + K / 2) + a;
			e.lineTo(s, c), e.lineTo(l, u);
		}
	}
	e.closePath(), e.moveTo(0, 0), e.rect(0, 0, e.canvas.width, e.canvas.height), e.clip("evenodd");
}
function h_(e, t, n) {
	let { startAngle: r, pixelMargin: i, x: a, y: o, outerRadius: s, innerRadius: c } = t, l = i / s;
	e.beginPath(), e.arc(a, o, s, r - l, n + l), c > i ? (l = i / c, e.arc(a, o, c, n + l, r - l, !0)) : e.arc(a, o, i, n + hd, r - hd), e.closePath(), e.clip();
}
function g_(e) {
	return Wf(e, [
		"outerStart",
		"outerEnd",
		"innerStart",
		"innerEnd"
	]);
}
function __(e, t, n, r) {
	let i = g_(e.options.borderRadius), a = (n - t) / 2, o = Math.min(a, r * t / 2), s = (e) => {
		let t = (n - Math.min(a, e)) * r / 2;
		return Fd(e, 0, Math.min(a, t));
	};
	return {
		outerStart: s(i.outerStart),
		outerEnd: s(i.outerEnd),
		innerStart: Fd(i.innerStart, 0, o),
		innerEnd: Fd(i.innerEnd, 0, o)
	};
}
function v_(e, t, n, r) {
	return {
		x: n + e * Math.cos(t),
		y: r + e * Math.sin(t)
	};
}
function y_(e, t, n, r, i, a) {
	let { x: o, y: s, startAngle: c, pixelMargin: l, innerRadius: u } = t, d = Math.max(t.outerRadius + r + n - l, 0), f = u > 0 ? u + r + n + l : 0, p = 0, m = i - c;
	if (r) {
		let e = ((u > 0 ? u - r : 0) + (d > 0 ? d - r : 0)) / 2;
		p = (m - (e === 0 ? m : m * e / (e + r))) / 2;
	}
	let h = (m - Math.max(.001, m * d - n / K) / d) / 2, g = c + h + p, _ = i - h - p, { outerStart: v, outerEnd: y, innerStart: b, innerEnd: x } = __(t, f, d, _ - g), S = d - v, C = d - y, w = g + v / S, T = _ - y / C, E = f + b, D = f + x, ee = g + b / E, O = _ - x / D;
	if (e.beginPath(), a) {
		let t = (w + T) / 2;
		if (e.arc(o, s, d, w, t), e.arc(o, s, d, t, T), y > 0) {
			let t = v_(C, T, o, s);
			e.arc(t.x, t.y, y, T, _ + hd);
		}
		let n = v_(D, _, o, s);
		if (e.lineTo(n.x, n.y), x > 0) {
			let t = v_(D, O, o, s);
			e.arc(t.x, t.y, x, _ + hd, O + Math.PI);
		}
		let r = (_ - x / f + (g + b / f)) / 2;
		if (e.arc(o, s, f, _ - x / f, r, !0), e.arc(o, s, f, r, g + b / f, !0), b > 0) {
			let t = v_(E, ee, o, s);
			e.arc(t.x, t.y, b, ee + Math.PI, g - hd);
		}
		let i = v_(S, g, o, s);
		if (e.lineTo(i.x, i.y), v > 0) {
			let t = v_(S, w, o, s);
			e.arc(t.x, t.y, v, g - hd, w);
		}
	} else {
		e.moveTo(o, s);
		let t = Math.cos(w) * d + o, n = Math.sin(w) * d + s;
		e.lineTo(t, n);
		let r = Math.cos(T) * d + o, i = Math.sin(T) * d + s;
		e.lineTo(r, i);
	}
	e.closePath();
}
function b_(e, t, n, r, i) {
	let { fullCircles: a, startAngle: o, circumference: s } = t, c = t.endAngle;
	if (a) {
		y_(e, t, n, r, c, i);
		for (let t = 0; t < a; ++t) e.fill();
		isNaN(s) || (c = o + (s % q || q));
	}
	return y_(e, t, n, r, c, i), e.fill(), c;
}
function x_(e, t, n, r, i) {
	let { fullCircles: a, startAngle: o, circumference: s, options: c } = t, { borderWidth: l, borderJoinStyle: u, borderDash: d, borderDashOffset: f, borderRadius: p } = c, m = c.borderAlign === "inner";
	if (!l) return;
	e.setLineDash(d || []), e.lineDashOffset = f, m ? (e.lineWidth = l * 2, e.lineJoin = u || "round") : (e.lineWidth = l, e.lineJoin = u || "bevel");
	let h = t.endAngle;
	if (a) {
		y_(e, t, n, r, h, i);
		for (let t = 0; t < a; ++t) e.stroke();
		isNaN(s) || (h = o + (s % q || q));
	}
	m && h_(e, t, h), c.selfJoin && h - o >= K && p === 0 && u !== "miter" && m_(e, t, h), a || (y_(e, t, n, r, h, i), e.stroke());
}
var S_ = class extends ag {
	static id = "arc";
	static defaults = {
		borderAlign: "center",
		borderColor: "#fff",
		borderDash: [],
		borderDashOffset: 0,
		borderJoinStyle: void 0,
		borderRadius: 0,
		borderWidth: 2,
		offset: 0,
		spacing: 0,
		angle: void 0,
		circular: !0,
		selfJoin: !1
	};
	static defaultRoutes = { backgroundColor: "backgroundColor" };
	static descriptors = {
		_scriptable: !0,
		_indexable: (e) => e !== "borderDash"
	};
	circumference;
	endAngle;
	fullCircles;
	innerRadius;
	outerRadius;
	pixelMargin;
	startAngle;
	constructor(e) {
		super(), this.options = void 0, this.circumference = void 0, this.startAngle = void 0, this.endAngle = void 0, this.innerRadius = void 0, this.outerRadius = void 0, this.pixelMargin = 0, this.fullCircles = 0, e && Object.assign(this, e);
	}
	inRange(e, t, n) {
		let { angle: r, distance: i } = Ad(this.getProps(["x", "y"], n), {
			x: e,
			y: t
		}), { startAngle: a, endAngle: o, innerRadius: s, outerRadius: c, circumference: l } = this.getProps([
			"startAngle",
			"endAngle",
			"innerRadius",
			"outerRadius",
			"circumference"
		], n), u = (this.options.spacing + this.options.borderWidth) / 2, d = W(l, o - a), f = Pd(r, a, o) && a !== o, p = d >= q || f, m = Ld(i, s + u, c + u);
		return p && m;
	}
	getCenterPoint(e) {
		let { x: t, y: n, startAngle: r, endAngle: i, innerRadius: a, outerRadius: o } = this.getProps([
			"x",
			"y",
			"startAngle",
			"endAngle",
			"innerRadius",
			"outerRadius"
		], e), { offset: s, spacing: c } = this.options, l = (r + i) / 2, u = (a + o + c + s) / 2;
		return {
			x: t + Math.cos(l) * u,
			y: n + Math.sin(l) * u
		};
	}
	tooltipPosition(e) {
		return this.getCenterPoint(e);
	}
	draw(e) {
		let { options: t, circumference: n } = this, r = (t.offset || 0) / 4, i = (t.spacing || 0) / 2, a = t.circular;
		if (this.pixelMargin = t.borderAlign === "inner" ? .33 : 0, this.fullCircles = n > q ? Math.floor(n / q) : 0, n === 0 || this.innerRadius < 0 || this.outerRadius < 0) return;
		e.save();
		let o = (this.startAngle + this.endAngle) / 2;
		e.translate(Math.cos(o) * r, Math.sin(o) * r);
		let s = r * (1 - Math.sin(Math.min(K, n || 0)));
		e.fillStyle = t.backgroundColor, e.strokeStyle = t.borderColor, b_(e, this, s, i, a), x_(e, this, s, i, a), e.restore();
	}
};
function C_(e, t, n = t) {
	e.lineCap = W(n.borderCapStyle, t.borderCapStyle), e.setLineDash(W(n.borderDash, t.borderDash)), e.lineDashOffset = W(n.borderDashOffset, t.borderDashOffset), e.lineJoin = W(n.borderJoinStyle, t.borderJoinStyle), e.lineWidth = W(n.borderWidth, t.borderWidth), e.strokeStyle = W(n.borderColor, t.borderColor);
}
function w_(e, t, n) {
	e.lineTo(n.x, n.y);
}
function T_(e) {
	return e.stepped ? Nf : e.tension || e.cubicInterpolationMode === "monotone" ? Pf : w_;
}
function E_(e, t, n = {}) {
	let r = e.length, { start: i = 0, end: a = r - 1 } = n, { start: o, end: s } = t, c = Math.max(i, o), l = Math.min(a, s), u = i < o && a < o || i > s && a > s;
	return {
		count: r,
		start: c,
		loop: t.loop,
		ilen: l < c && !u ? r + l - c : l - c
	};
}
function D_(e, t, n, r) {
	let { points: i, options: a } = t, { count: o, start: s, loop: c, ilen: l } = E_(i, n, r), u = T_(a), { move: d = !0, reverse: f } = r || {}, p, m, h;
	for (p = 0; p <= l; ++p) m = i[(s + (f ? l - p : p)) % o], !m.skip && (d ? (e.moveTo(m.x, m.y), d = !1) : u(e, h, m, f, a.stepped), h = m);
	return c && (m = i[(s + (f ? l : 0)) % o], u(e, h, m, f, a.stepped)), !!c;
}
function O_(e, t, n, r) {
	let i = t.points, { count: a, start: o, ilen: s } = E_(i, n, r), { move: c = !0, reverse: l } = r || {}, u = 0, d = 0, f, p, m, h, g, _, v = (e) => (o + (l ? s - e : e)) % a, y = () => {
		h !== g && (e.lineTo(u, g), e.lineTo(u, h), e.lineTo(u, _));
	};
	for (c && (p = i[v(0)], e.moveTo(p.x, p.y)), f = 0; f <= s; ++f) {
		if (p = i[v(f)], p.skip) continue;
		let t = p.x, n = p.y, r = t | 0;
		r === m ? (n < h ? h = n : n > g && (g = n), u = (d * u + t) / ++d) : (y(), e.lineTo(t, n), m = r, d = 0, h = g = n), _ = n;
	}
	y();
}
function k_(e) {
	let t = e.options, n = t.borderDash && t.borderDash.length;
	return !e._decimated && !e._loop && !t.tension && t.cubicInterpolationMode !== "monotone" && !t.stepped && !n ? O_ : D_;
}
function A_(e) {
	return e.stepped ? Gp : e.tension || e.cubicInterpolationMode === "monotone" ? Kp : Wp;
}
function j_(e, t, n, r) {
	let i = t._path;
	i || (i = t._path = new Path2D(), t.path(i, n, r) && i.closePath()), C_(e, t.options), e.stroke(i);
}
function M_(e, t, n, r) {
	let { segments: i, options: a } = t, o = k_(t);
	for (let s of i) C_(e, a, s.style), e.beginPath(), o(e, t, s, {
		start: n,
		end: n + r - 1
	}) && e.closePath(), e.stroke();
}
var N_ = typeof Path2D == "function";
function P_(e, t, n, r) {
	N_ && !t.options.segment ? j_(e, t, n, r) : M_(e, t, n, r);
}
var F_ = class extends ag {
	static id = "line";
	static defaults = {
		borderCapStyle: "butt",
		borderDash: [],
		borderDashOffset: 0,
		borderJoinStyle: "miter",
		borderWidth: 3,
		capBezierPoints: !0,
		cubicInterpolationMode: "default",
		fill: !1,
		spanGaps: !1,
		stepped: !1,
		tension: 0
	};
	static defaultRoutes = {
		backgroundColor: "backgroundColor",
		borderColor: "borderColor"
	};
	static descriptors = {
		_scriptable: !0,
		_indexable: (e) => e !== "borderDash" && e !== "fill"
	};
	constructor(e) {
		super(), this.animated = !0, this.options = void 0, this._chart = void 0, this._loop = void 0, this._fullLoop = void 0, this._path = void 0, this._points = void 0, this._segments = void 0, this._decimated = !1, this._pointsUpdated = !1, this._datasetIndex = void 0, e && Object.assign(this, e);
	}
	updateControlPoints(e, t) {
		let n = this.options;
		if ((n.tension || n.cubicInterpolationMode === "monotone") && !n.stepped && !this._pointsUpdated) {
			let r = n.spanGaps ? this._loop : this._fullLoop;
			Dp(this._points, n, e, r, t), this._pointsUpdated = !0;
		}
	}
	set points(e) {
		this._points = e, delete this._segments, delete this._path, this._pointsUpdated = !1;
	}
	get points() {
		return this._points;
	}
	get segments() {
		return this._segments ||= am(this, this.options.segment);
	}
	first() {
		let e = this.segments, t = this.points;
		return e.length && t[e[0].start];
	}
	last() {
		let e = this.segments, t = this.points, n = e.length;
		return n && t[e[n - 1].end];
	}
	interpolate(e, t) {
		let n = this.options, r = e[t], i = this.points, a = nm(this, {
			property: t,
			start: r,
			end: r
		});
		if (!a.length) return;
		let o = [], s = A_(n), c, l;
		for (c = 0, l = a.length; c < l; ++c) {
			let { start: l, end: u } = a[c], d = i[l], f = i[u];
			if (d === f) {
				o.push(d);
				continue;
			}
			let p = s(d, f, Math.abs((r - d[t]) / (f[t] - d[t])), n.stepped);
			p[t] = e[t], o.push(p);
		}
		return o.length === 1 ? o[0] : o;
	}
	pathSegment(e, t, n) {
		return k_(this)(e, this, t, n);
	}
	path(e, t, n) {
		let r = this.segments, i = k_(this), a = this._loop;
		t ||= 0, n ||= this.points.length - t;
		for (let o of r) a &= i(e, this, o, {
			start: t,
			end: t + n - 1
		});
		return !!a;
	}
	draw(e, t, n, r) {
		let i = this.options || {};
		(this.points || []).length && i.borderWidth && (e.save(), P_(e, this, n, r), e.restore()), this.animated && (this._pointsUpdated = !1, this._path = void 0);
	}
};
function I_(e, t, n, r) {
	let i = e.options, { [n]: a } = e.getProps([n], r);
	return Math.abs(t - a) < i.radius + i.hitRadius;
}
var L_ = class extends ag {
	static id = "point";
	parsed;
	skip;
	stop;
	static defaults = {
		borderWidth: 1,
		hitRadius: 1,
		hoverBorderWidth: 1,
		hoverRadius: 4,
		pointStyle: "circle",
		radius: 3,
		rotation: 0
	};
	static defaultRoutes = {
		backgroundColor: "backgroundColor",
		borderColor: "borderColor"
	};
	constructor(e) {
		super(), this.options = void 0, this.parsed = void 0, this.skip = void 0, this.stop = void 0, e && Object.assign(this, e);
	}
	inRange(e, t, n) {
		let r = this.options, { x: i, y: a } = this.getProps(["x", "y"], n);
		return (e - i) ** 2 + (t - a) ** 2 < (r.hitRadius + r.radius) ** 2;
	}
	inXRange(e, t) {
		return I_(this, e, "x", t);
	}
	inYRange(e, t) {
		return I_(this, e, "y", t);
	}
	getCenterPoint(e) {
		let { x: t, y: n } = this.getProps(["x", "y"], e);
		return {
			x: t,
			y: n
		};
	}
	size(e) {
		e = e || this.options || {};
		let t = e.radius || 0;
		t = Math.max(t, t && e.hoverRadius || 0);
		let n = t && e.borderWidth || 0;
		return (t + n) * 2;
	}
	draw(e, t) {
		let n = this.options;
		this.skip || n.radius < .1 || !Af(this, t, this.size(n) / 2) || (e.strokeStyle = n.borderColor, e.lineWidth = n.borderWidth, e.fillStyle = n.backgroundColor, Of(e, n, this.x, this.y));
	}
	getRange() {
		let e = this.options || {};
		return e.radius + e.hitRadius;
	}
};
function R_(e, t) {
	let { x: n, y: r, base: i, width: a, height: o } = e.getProps([
		"x",
		"y",
		"base",
		"width",
		"height"
	], t), s, c, l, u, d;
	return e.horizontal ? (d = o / 2, s = Math.min(n, i), c = Math.max(n, i), l = r - d, u = r + d) : (d = a / 2, s = n - d, c = n + d, l = Math.min(r, i), u = Math.max(r, i)), {
		left: s,
		top: l,
		right: c,
		bottom: u
	};
}
function z_(e, t, n, r) {
	return e ? 0 : Fd(t, n, r);
}
function B_(e, t, n) {
	let r = e.options.borderWidth, i = e.borderSkipped, a = Gf(r);
	return {
		t: z_(i.top, a.top, 0, n),
		r: z_(i.right, a.right, 0, t),
		b: z_(i.bottom, a.bottom, 0, n),
		l: z_(i.left, a.left, 0, t)
	};
}
function V_(e, t, n) {
	let { enableBorderRadius: r } = e.getProps(["enableBorderRadius"]), i = e.options.borderRadius, a = Kf(i), o = Math.min(t, n), s = e.borderSkipped, c = r || U(i);
	return {
		topLeft: z_(!c || s.top || s.left, a.topLeft, 0, o),
		topRight: z_(!c || s.top || s.right, a.topRight, 0, o),
		bottomLeft: z_(!c || s.bottom || s.left, a.bottomLeft, 0, o),
		bottomRight: z_(!c || s.bottom || s.right, a.bottomRight, 0, o)
	};
}
function H_(e) {
	let t = R_(e), n = t.right - t.left, r = t.bottom - t.top, i = B_(e, n / 2, r / 2), a = V_(e, n / 2, r / 2);
	return {
		outer: {
			x: t.left,
			y: t.top,
			w: n,
			h: r,
			radius: a
		},
		inner: {
			x: t.left + i.l,
			y: t.top + i.t,
			w: n - i.l - i.r,
			h: r - i.t - i.b,
			radius: {
				topLeft: Math.max(0, a.topLeft - Math.max(i.t, i.l)),
				topRight: Math.max(0, a.topRight - Math.max(i.t, i.r)),
				bottomLeft: Math.max(0, a.bottomLeft - Math.max(i.b, i.l)),
				bottomRight: Math.max(0, a.bottomRight - Math.max(i.b, i.r))
			}
		}
	};
}
function U_(e, t, n, r) {
	let i = t === null, a = n === null, o = e && !(i && a) && R_(e, r);
	return o && (i || Ld(t, o.left, o.right)) && (a || Ld(n, o.top, o.bottom));
}
function W_(e) {
	return e.topLeft || e.topRight || e.bottomLeft || e.bottomRight;
}
function G_(e, t) {
	e.rect(t.x, t.y, t.w, t.h);
}
function K_(e, t, n = {}) {
	let r = e.x === n.x ? 0 : -t, i = e.y === n.y ? 0 : -t, a = (e.x + e.w === n.x + n.w ? 0 : t) - r, o = (e.y + e.h === n.y + n.h ? 0 : t) - i;
	return {
		x: e.x + r,
		y: e.y + i,
		w: e.w + a,
		h: e.h + o,
		radius: e.radius
	};
}
var q_ = class extends ag {
	static id = "bar";
	static defaults = {
		borderSkipped: "start",
		borderWidth: 0,
		borderRadius: 0,
		inflateAmount: "auto",
		pointStyle: void 0
	};
	static defaultRoutes = {
		backgroundColor: "backgroundColor",
		borderColor: "borderColor"
	};
	constructor(e) {
		super(), this.options = void 0, this.horizontal = void 0, this.base = void 0, this.width = void 0, this.height = void 0, this.inflateAmount = void 0, e && Object.assign(this, e);
	}
	draw(e) {
		let { inflateAmount: t, options: { borderColor: n, backgroundColor: r } } = this, { inner: i, outer: a } = H_(this), o = W_(a.radius) ? zf : G_;
		e.save(), (a.w !== i.w || a.h !== i.h) && (e.beginPath(), o(e, K_(a, t, i)), e.clip(), o(e, K_(i, -t, a)), e.fillStyle = n, e.fill("evenodd")), e.beginPath(), o(e, K_(i, t)), e.fillStyle = r, e.fill(), e.restore();
	}
	inRange(e, t, n) {
		return U_(this, e, t, n);
	}
	inXRange(e, t) {
		return U_(this, e, null, t);
	}
	inYRange(e, t) {
		return U_(this, null, e, t);
	}
	getCenterPoint(e) {
		let { x: t, y: n, base: r, horizontal: i } = this.getProps([
			"x",
			"y",
			"base",
			"horizontal"
		], e);
		return {
			x: i ? (t + r) / 2 : t,
			y: i ? n : (n + r) / 2
		};
	}
	getRange(e) {
		return e === "x" ? this.width / 2 : this.height / 2;
	}
};
function J_(e, t, n) {
	let r = e.segments, i = e.points, a = t.points, o = [];
	for (let e of r) {
		let { start: r, end: s } = e;
		s = Z_(r, s, i);
		let c = Y_(n, i[r], i[s], e.loop);
		if (!t.segments) {
			o.push({
				source: e,
				target: c,
				start: i[r],
				end: i[s]
			});
			continue;
		}
		let l = nm(t, c);
		for (let t of l) {
			let r = Y_(n, a[t.start], a[t.end], t.loop), s = tm(e, i, r);
			for (let e of s) o.push({
				source: e,
				target: t,
				start: { [n]: Q_(c, r, "start", Math.max) },
				end: { [n]: Q_(c, r, "end", Math.min) }
			});
		}
	}
	return o;
}
function Y_(e, t, n, r) {
	if (r) return;
	let i = t[e], a = n[e];
	return e === "angle" && (i = Nd(i), a = Nd(a)), {
		property: e,
		start: i,
		end: a
	};
}
function X_(e, t) {
	let { x: n = null, y: r = null } = e || {}, i = t.points, a = [];
	return t.segments.forEach(({ start: e, end: t }) => {
		t = Z_(e, t, i);
		let o = i[e], s = i[t];
		r === null ? n !== null && (a.push({
			x: n,
			y: o.y
		}), a.push({
			x: n,
			y: s.y
		})) : (a.push({
			x: o.x,
			y: r
		}), a.push({
			x: s.x,
			y: r
		}));
	}), a;
}
function Z_(e, t, n) {
	for (; t > e; t--) {
		let e = n[t];
		if (!isNaN(e.x) && !isNaN(e.y)) break;
	}
	return t;
}
function Q_(e, t, n, r) {
	return e && t ? r(e[n], t[n]) : e ? e[n] : t ? t[n] : 0;
}
function $_(e, t) {
	let n = [], r = !1;
	return H(e) ? (r = !0, n = e) : n = X_(e, t), n.length ? new F_({
		points: n,
		options: { tension: 0 },
		_loop: r,
		_fullLoop: r
	}) : null;
}
function ev(e) {
	return e && e.fill !== !1;
}
function tv(e, t, n) {
	let r = e[t].fill, i = [t], a;
	if (!n) return r;
	for (; r !== !1 && i.indexOf(r) === -1;) {
		if (!Gu(r)) return r;
		if (a = e[r], !a) return !1;
		if (a.visible) return r;
		i.push(r), r = a.fill;
	}
	return !1;
}
function nv(e, t, n) {
	let r = ov(e);
	if (U(r)) return isNaN(r.value) ? !1 : r;
	let i = parseFloat(r);
	return Gu(i) && Math.floor(i) === i ? rv(r[0], t, i, n) : [
		"origin",
		"start",
		"end",
		"stack",
		"shape"
	].indexOf(r) >= 0 && r;
}
function rv(e, t, n, r) {
	return (e === "-" || e === "+") && (n = t + n), n === t || n < 0 || n >= r ? !1 : n;
}
function iv(e, t) {
	let n = null;
	return e === "start" ? n = t.bottom : e === "end" ? n = t.top : U(e) ? n = t.getPixelForValue(e.value) : t.getBasePixel && (n = t.getBasePixel()), n;
}
function av(e, t, n) {
	let r;
	return r = e === "start" ? n : e === "end" ? t.options.reverse ? t.min : t.max : U(e) ? e.value : t.getBaseValue(), r;
}
function ov(e) {
	let t = e.options, n = t.fill, r = W(n && n.target, n);
	return r === void 0 && (r = !!t.backgroundColor), r === !1 || r === null ? !1 : r === !0 ? "origin" : r;
}
function sv(e) {
	let { scale: t, index: n, line: r } = e, i = [], a = r.segments, o = r.points, s = cv(t, n);
	s.push($_({
		x: null,
		y: t.bottom
	}, r));
	for (let e = 0; e < a.length; e++) {
		let t = a[e];
		for (let e = t.start; e <= t.end; e++) lv(i, o[e], s);
	}
	return new F_({
		points: i,
		options: {}
	});
}
function cv(e, t) {
	let n = [], r = e.getMatchingVisibleMetas("line");
	for (let e = 0; e < r.length; e++) {
		let i = r[e];
		if (i.index === t) break;
		i.hidden || n.unshift(i.dataset);
	}
	return n;
}
function lv(e, t, n) {
	let r = [];
	for (let i = 0; i < n.length; i++) {
		let a = n[i], { first: o, last: s, point: c } = uv(a, t, "x");
		if (!(!c || o && s)) {
			if (o) r.unshift(c);
			else if (e.push(c), !s) break;
		}
	}
	e.push(...r);
}
function uv(e, t, n) {
	let r = e.interpolate(t, n);
	if (!r) return {};
	let i = r[n], a = e.segments, o = e.points, s = !1, c = !1;
	for (let e = 0; e < a.length; e++) {
		let t = a[e], r = o[t.start][n], l = o[t.end][n];
		if (Ld(i, r, l)) {
			s = i === r, c = i === l;
			break;
		}
	}
	return {
		first: s,
		last: c,
		point: r
	};
}
var dv = class {
	constructor(e) {
		this.x = e.x, this.y = e.y, this.radius = e.radius;
	}
	pathSegment(e, t, n) {
		let { x: r, y: i, radius: a } = this;
		return t ||= {
			start: 0,
			end: q
		}, e.arc(r, i, a, t.end, t.start, !0), !n.bounds;
	}
	interpolate(e) {
		let { x: t, y: n, radius: r } = this, i = e.angle;
		return {
			x: t + Math.cos(i) * r,
			y: n + Math.sin(i) * r,
			angle: i
		};
	}
};
function fv(e) {
	let { chart: t, fill: n, line: r } = e;
	if (Gu(n)) return pv(t, n);
	if (n === "stack") return sv(e);
	if (n === "shape") return !0;
	let i = mv(e);
	return i instanceof dv ? i : $_(i, r);
}
function pv(e, t) {
	let n = e.getDatasetMeta(t);
	return n && e.isDatasetVisible(t) ? n.dataset : null;
}
function mv(e) {
	return (e.scale || {}).getPointPositionForValue ? gv(e) : hv(e);
}
function hv(e) {
	let { scale: t = {}, fill: n } = e, r = iv(n, t);
	if (Gu(r)) {
		let e = t.isHorizontal();
		return {
			x: e ? r : null,
			y: e ? null : r
		};
	}
	return null;
}
function gv(e) {
	let { scale: t, fill: n } = e, r = t.options, i = t.getLabels().length, a = r.reverse ? t.max : t.min, o = av(n, t, a), s = [];
	if (r.grid.circular) {
		let e = t.getPointPositionForValue(0, a);
		return new dv({
			x: e.x,
			y: e.y,
			radius: t.getDistanceFromCenterForValue(o)
		});
	}
	for (let e = 0; e < i; ++e) s.push(t.getPointPositionForValue(e, o));
	return s;
}
function _v(e, t, n) {
	let r = fv(t), { chart: i, index: a, line: o, scale: s, axis: c } = t, l = o.options, u = l.fill, d = l.backgroundColor, { above: f = d, below: p = d } = u || {}, m = fm(i, i.getDatasetMeta(a));
	r && o.points.length && (jf(e, n), vv(e, {
		line: o,
		target: r,
		above: f,
		below: p,
		area: n,
		scale: s,
		axis: c,
		clip: m
	}), Mf(e));
}
function vv(e, t) {
	let { line: n, target: r, above: i, below: a, area: o, scale: s, clip: c } = t, l = n._loop ? "angle" : t.axis;
	e.save();
	let u = a;
	a !== i && (l === "x" ? (yv(e, r, o.top), xv(e, {
		line: n,
		target: r,
		color: i,
		scale: s,
		property: l,
		clip: c
	}), e.restore(), e.save(), yv(e, r, o.bottom)) : l === "y" && (bv(e, r, o.left), xv(e, {
		line: n,
		target: r,
		color: a,
		scale: s,
		property: l,
		clip: c
	}), e.restore(), e.save(), bv(e, r, o.right), u = i)), xv(e, {
		line: n,
		target: r,
		color: u,
		scale: s,
		property: l,
		clip: c
	}), e.restore();
}
function yv(e, t, n) {
	let { segments: r, points: i } = t, a = !0, o = !1;
	e.beginPath();
	for (let s of r) {
		let { start: r, end: c } = s, l = i[r], u = i[Z_(r, c, i)];
		a ? (e.moveTo(l.x, l.y), a = !1) : (e.lineTo(l.x, n), e.lineTo(l.x, l.y)), o = !!t.pathSegment(e, s, { move: o }), o ? e.closePath() : e.lineTo(u.x, n);
	}
	e.lineTo(t.first().x, n), e.closePath(), e.clip();
}
function bv(e, t, n) {
	let { segments: r, points: i } = t, a = !0, o = !1;
	e.beginPath();
	for (let s of r) {
		let { start: r, end: c } = s, l = i[r], u = i[Z_(r, c, i)];
		a ? (e.moveTo(l.x, l.y), a = !1) : (e.lineTo(n, l.y), e.lineTo(l.x, l.y)), o = !!t.pathSegment(e, s, { move: o }), o ? e.closePath() : e.lineTo(n, u.y);
	}
	e.lineTo(n, t.first().y), e.closePath(), e.clip();
}
function xv(e, t) {
	let { line: n, target: r, property: i, color: a, scale: o, clip: s } = t, c = J_(n, r, i);
	for (let { source: t, target: l, start: u, end: d } of c) {
		let { style: { backgroundColor: c = a } = {} } = t, f = r !== !0;
		e.save(), e.fillStyle = c, Sv(e, o, s, f && Y_(i, u, d)), e.beginPath();
		let p = !!n.pathSegment(e, t), m;
		if (f) {
			p ? e.closePath() : Cv(e, r, d, i);
			let t = !!r.pathSegment(e, l, {
				move: p,
				reverse: !0
			});
			m = p && t, m || Cv(e, r, u, i);
		}
		e.closePath(), e.fill(m ? "evenodd" : "nonzero"), e.restore();
	}
}
function Sv(e, t, n, r) {
	let i = t.chart.chartArea, { property: a, start: o, end: s } = r || {};
	if (a === "x" || a === "y") {
		let t, r, c, l;
		a === "x" ? (t = o, r = i.top, c = s, l = i.bottom) : (t = i.left, r = o, c = i.right, l = s), e.beginPath(), n && (t = Math.max(t, n.left), c = Math.min(c, n.right), r = Math.max(r, n.top), l = Math.min(l, n.bottom)), e.rect(t, r, c - t, l - r), e.clip();
	}
}
function Cv(e, t, n, r) {
	let i = t.interpolate(n, r);
	i && e.lineTo(i.x, i.y);
}
var wv = {
	id: "filler",
	afterDatasetsUpdate(e, t, n) {
		let r = (e.data.datasets || []).length, i = [], a, o, s, c;
		for (o = 0; o < r; ++o) a = e.getDatasetMeta(o), s = a.dataset, c = null, s && s.options && s instanceof F_ && (c = {
			visible: e.isDatasetVisible(o),
			index: o,
			fill: nv(s, o, r),
			chart: e,
			axis: a.controller.options.indexAxis,
			scale: a.vScale,
			line: s
		}), a.$filler = c, i.push(c);
		for (o = 0; o < r; ++o) c = i[o], !(!c || c.fill === !1) && (c.fill = tv(i, o, n.propagate));
	},
	beforeDraw(e, t, n) {
		let r = n.drawTime === "beforeDraw", i = e.getSortedVisibleDatasetMetas(), a = e.chartArea;
		for (let t = i.length - 1; t >= 0; --t) {
			let n = i[t].$filler;
			n && (n.line.updateControlPoints(a, n.axis), r && n.fill && _v(e.ctx, n, a));
		}
	},
	beforeDatasetsDraw(e, t, n) {
		if (n.drawTime !== "beforeDatasetsDraw") return;
		let r = e.getSortedVisibleDatasetMetas();
		for (let t = r.length - 1; t >= 0; --t) {
			let n = r[t].$filler;
			ev(n) && _v(e.ctx, n, e.chartArea);
		}
	},
	beforeDatasetDraw(e, t, n) {
		let r = t.meta.$filler;
		!ev(r) || n.drawTime !== "beforeDatasetDraw" || _v(e.ctx, r, e.chartArea);
	},
	defaults: {
		propagate: !0,
		drawTime: "beforeDatasetDraw"
	}
}, Tv = {
	average(e) {
		if (!e.length) return !1;
		let t, n, r = /* @__PURE__ */ new Set(), i = 0, a = 0;
		for (t = 0, n = e.length; t < n; ++t) {
			let n = e[t].element;
			if (n && n.hasValue()) {
				let e = n.tooltipPosition();
				r.add(e.x), i += e.y, ++a;
			}
		}
		return a === 0 || r.size === 0 ? !1 : {
			x: [...r].reduce((e, t) => e + t) / r.size,
			y: i / a
		};
	},
	nearest(e, t) {
		if (!e.length) return !1;
		let n = t.x, r = t.y, i = Infinity, a, o, s;
		for (a = 0, o = e.length; a < o; ++a) {
			let n = e[a].element;
			if (n && n.hasValue()) {
				let e = jd(t, n.getCenterPoint());
				e < i && (i = e, s = n);
			}
		}
		if (s) {
			let e = s.tooltipPosition();
			n = e.x, r = e.y;
		}
		return {
			x: n,
			y: r
		};
	}
};
function Ev(e, t) {
	return t && (H(t) ? Array.prototype.push.apply(e, t) : e.push(t)), e;
}
function Dv(e) {
	return (typeof e == "string" || e instanceof String) && e.indexOf("\n") > -1 ? e.split("\n") : e;
}
function Ov(e, t) {
	let { element: n, datasetIndex: r, index: i } = t, a = e.getDatasetMeta(r).controller, { label: o, value: s } = a.getLabelAndValue(i);
	return {
		chart: e,
		label: o,
		parsed: a.getParsed(i),
		raw: e.data.datasets[r].data[i],
		formattedValue: s,
		dataset: a.getDataset(),
		dataIndex: i,
		datasetIndex: r,
		element: n
	};
}
function kv(e, t) {
	let n = e.chart.ctx, { body: r, footer: i, title: a } = e, { boxWidth: o, boxHeight: s } = t, c = Jf(t.bodyFont), l = Jf(t.titleFont), u = Jf(t.footerFont), d = a.length, f = i.length, p = r.length, m = qf(t.padding), h = m.height, g = 0, _ = r.reduce((e, t) => e + t.before.length + t.lines.length + t.after.length, 0);
	if (_ += e.beforeBody.length + e.afterBody.length, d && (h += d * l.lineHeight + (d - 1) * t.titleSpacing + t.titleMarginBottom), _) {
		let e = t.displayColors ? Math.max(s, c.lineHeight) : c.lineHeight;
		h += p * e + (_ - p) * c.lineHeight + (_ - 1) * t.bodySpacing;
	}
	f && (h += t.footerMarginTop + f * u.lineHeight + (f - 1) * t.footerSpacing);
	let v = 0, y = function(e) {
		g = Math.max(g, n.measureText(e).width + v);
	};
	return n.save(), n.font = l.string, G(e.title, y), n.font = c.string, G(e.beforeBody.concat(e.afterBody), y), v = t.displayColors ? o + 2 + t.boxPadding : 0, G(r, (e) => {
		G(e.before, y), G(e.lines, y), G(e.after, y);
	}), v = 0, n.font = u.string, G(e.footer, y), n.restore(), g += m.width, {
		width: g,
		height: h
	};
}
function Av(e, t) {
	let { y: n, height: r } = t;
	return n < r / 2 ? "top" : n > e.height - r / 2 ? "bottom" : "center";
}
function jv(e, t, n, r) {
	let { x: i, width: a } = r, o = n.caretSize + n.caretPadding;
	if (e === "left" && i + a + o > t.width || e === "right" && i - a - o < 0) return !0;
}
function Mv(e, t, n, r) {
	let { x: i, width: a } = n, { width: o, chartArea: { left: s, right: c } } = e, l = "center";
	return r === "center" ? l = i <= (s + c) / 2 ? "left" : "right" : i <= a / 2 ? l = "left" : i >= o - a / 2 && (l = "right"), jv(l, e, t, n) && (l = "center"), l;
}
function Nv(e, t, n) {
	let r = n.yAlign || t.yAlign || Av(e, n);
	return {
		xAlign: n.xAlign || t.xAlign || Mv(e, t, n, r),
		yAlign: r
	};
}
function Pv(e, t) {
	let { x: n, width: r } = e;
	return t === "right" ? n -= r : t === "center" && (n -= r / 2), n;
}
function Fv(e, t, n) {
	let { y: r, height: i } = e;
	return t === "top" ? r += n : t === "bottom" ? r -= i + n : r -= i / 2, r;
}
function Iv(e, t, n, r) {
	let { caretSize: i, caretPadding: a, cornerRadius: o } = e, { xAlign: s, yAlign: c } = n, l = i + a, { topLeft: u, topRight: d, bottomLeft: f, bottomRight: p } = Kf(o), m = Pv(t, s), h = Fv(t, c, l);
	return c === "center" ? s === "left" ? m += l : s === "right" && (m -= l) : s === "left" ? m -= Math.max(u, f) + i : s === "right" && (m += Math.max(d, p) + i), {
		x: Fd(m, 0, r.width - t.width),
		y: Fd(h, 0, r.height - t.height)
	};
}
function Lv(e, t, n) {
	let r = qf(n.padding);
	return t === "center" ? e.x + e.width / 2 : t === "right" ? e.x + e.width - r.right : e.x + r.left;
}
function Rv(e) {
	return Ev([], Dv(e));
}
function zv(e, t, n) {
	return Zf(e, {
		tooltip: t,
		tooltipItems: n,
		type: "tooltip"
	});
}
function Bv(e, t) {
	let n = t && t.dataset && t.dataset.tooltip && t.dataset.tooltip.callbacks;
	return n ? e.override(n) : e;
}
var Vv = {
	beforeTitle: Uu,
	title(e) {
		if (e.length > 0) {
			let t = e[0], n = t.chart.data.labels, r = n ? n.length : 0;
			if (this && this.options && this.options.mode === "dataset") return t.dataset.label || "";
			if (t.label) return t.label;
			if (r > 0 && t.dataIndex < r) return n[t.dataIndex];
		}
		return "";
	},
	afterTitle: Uu,
	beforeBody: Uu,
	beforeLabel: Uu,
	label(e) {
		if (this && this.options && this.options.mode === "dataset") return e.label + ": " + e.formattedValue || e.formattedValue;
		let t = e.dataset.label || "";
		t && (t += ": ");
		let n = e.formattedValue;
		return V(n) || (t += n), t;
	},
	labelColor(e) {
		let t = e.chart.getDatasetMeta(e.datasetIndex).controller.getStyle(e.dataIndex);
		return {
			borderColor: t.borderColor,
			backgroundColor: t.backgroundColor,
			borderWidth: t.borderWidth,
			borderDash: t.borderDash,
			borderDashOffset: t.borderDashOffset,
			borderRadius: 0
		};
	},
	labelTextColor() {
		return this.options.bodyColor;
	},
	labelPointStyle(e) {
		let t = e.chart.getDatasetMeta(e.datasetIndex).controller.getStyle(e.dataIndex);
		return {
			pointStyle: t.pointStyle,
			rotation: t.rotation
		};
	},
	afterLabel: Uu,
	afterBody: Uu,
	beforeFooter: Uu,
	footer: Uu,
	afterFooter: Uu
};
function Hv(e, t, n, r) {
	let i = e[t].call(n, r);
	return i === void 0 ? Vv[t].call(n, r) : i;
}
var Uv = class extends ag {
	static positioners = Tv;
	constructor(e) {
		super(), this.opacity = 0, this._active = [], this._eventPosition = void 0, this._size = void 0, this._cachedAnimations = void 0, this._tooltipItems = [], this.$animations = void 0, this.$context = void 0, this.chart = e.chart, this.options = e.options, this.dataPoints = void 0, this.title = void 0, this.beforeBody = void 0, this.body = void 0, this.afterBody = void 0, this.footer = void 0, this.xAlign = void 0, this.yAlign = void 0, this.x = void 0, this.y = void 0, this.height = void 0, this.width = void 0, this.caretX = void 0, this.caretY = void 0, this.labelColors = void 0, this.labelPointStyles = void 0, this.labelTextColors = void 0;
	}
	initialize(e) {
		this.options = e, this._cachedAnimations = void 0, this.$context = void 0;
	}
	_resolveAnimations() {
		let e = this._cachedAnimations;
		if (e) return e;
		let t = this.chart, n = this.options.setContext(this.getContext()), r = n.enabled && t.options.animation && n.animations, i = new _m(this.chart, r);
		return r._cacheable && (this._cachedAnimations = Object.freeze(i)), i;
	}
	getContext() {
		return this.$context ||= zv(this.chart.getContext(), this, this._tooltipItems);
	}
	getTitle(e, t) {
		let { callbacks: n } = t, r = Hv(n, "beforeTitle", this, e), i = Hv(n, "title", this, e), a = Hv(n, "afterTitle", this, e), o = [];
		return o = Ev(o, Dv(r)), o = Ev(o, Dv(i)), o = Ev(o, Dv(a)), o;
	}
	getBeforeBody(e, t) {
		return Rv(Hv(t.callbacks, "beforeBody", this, e));
	}
	getBody(e, t) {
		let { callbacks: n } = t, r = [];
		return G(e, (e) => {
			let t = {
				before: [],
				lines: [],
				after: []
			}, i = Bv(n, e);
			Ev(t.before, Dv(Hv(i, "beforeLabel", this, e))), Ev(t.lines, Hv(i, "label", this, e)), Ev(t.after, Dv(Hv(i, "afterLabel", this, e))), r.push(t);
		}), r;
	}
	getAfterBody(e, t) {
		return Rv(Hv(t.callbacks, "afterBody", this, e));
	}
	getFooter(e, t) {
		let { callbacks: n } = t, r = Hv(n, "beforeFooter", this, e), i = Hv(n, "footer", this, e), a = Hv(n, "afterFooter", this, e), o = [];
		return o = Ev(o, Dv(r)), o = Ev(o, Dv(i)), o = Ev(o, Dv(a)), o;
	}
	_createItems(e) {
		let t = this._active, n = this.chart.data, r = [], i = [], a = [], o = [], s, c;
		for (s = 0, c = t.length; s < c; ++s) o.push(Ov(this.chart, t[s]));
		return e.filter && (o = o.filter((t, r, i) => e.filter(t, r, i, n))), e.itemSort && (o = o.sort((t, r) => e.itemSort(t, r, n))), G(o, (t) => {
			let n = Bv(e.callbacks, t);
			r.push(Hv(n, "labelColor", this, t)), i.push(Hv(n, "labelPointStyle", this, t)), a.push(Hv(n, "labelTextColor", this, t));
		}), this.labelColors = r, this.labelPointStyles = i, this.labelTextColors = a, this.dataPoints = o, o;
	}
	update(e, t) {
		let n = this.options.setContext(this.getContext()), r = this._active, i, a = [];
		if (!r.length) this.opacity !== 0 && (i = { opacity: 0 });
		else {
			let e = Tv[n.position].call(this, r, this._eventPosition);
			a = this._createItems(n), this.title = this.getTitle(a, n), this.beforeBody = this.getBeforeBody(a, n), this.body = this.getBody(a, n), this.afterBody = this.getAfterBody(a, n), this.footer = this.getFooter(a, n);
			let t = this._size = kv(this, n), o = Object.assign({}, e, t), s = Nv(this.chart, n, o), c = Iv(n, o, s, this.chart);
			this.xAlign = s.xAlign, this.yAlign = s.yAlign, i = {
				opacity: 1,
				x: c.x,
				y: c.y,
				width: t.width,
				height: t.height,
				caretX: e.x,
				caretY: e.y
			};
		}
		this._tooltipItems = a, this.$context = void 0, i && this._resolveAnimations().update(this, i), e && n.external && n.external.call(this, {
			chart: this.chart,
			tooltip: this,
			replay: t
		});
	}
	drawCaret(e, t, n, r) {
		let i = this.getCaretPosition(e, n, r);
		t.lineTo(i.x1, i.y1), t.lineTo(i.x2, i.y2), t.lineTo(i.x3, i.y3);
	}
	getCaretPosition(e, t, n) {
		let { xAlign: r, yAlign: i } = this, { caretSize: a, cornerRadius: o } = n, { topLeft: s, topRight: c, bottomLeft: l, bottomRight: u } = Kf(o), { x: d, y: f } = e, { width: p, height: m } = t, h, g, _, v, y, b;
		return i === "center" ? (y = f + m / 2, r === "left" ? (h = d, g = h - a, v = y + a, b = y - a) : (h = d + p, g = h + a, v = y - a, b = y + a), _ = h) : (g = r === "left" ? d + Math.max(s, l) + a : r === "right" ? d + p - Math.max(c, u) - a : this.caretX, i === "top" ? (v = f, y = v - a, h = g - a, _ = g + a) : (v = f + m, y = v + a, h = g + a, _ = g - a), b = v), {
			x1: h,
			x2: g,
			x3: _,
			y1: v,
			y2: y,
			y3: b
		};
	}
	drawTitle(e, t, n) {
		let r = this.title, i = r.length, a, o, s;
		if (i) {
			let c = Yp(n.rtl, this.x, this.width);
			for (e.x = Lv(this, n.titleAlign, n), t.textAlign = c.textAlign(n.titleAlign), t.textBaseline = "middle", a = Jf(n.titleFont), o = n.titleSpacing, t.fillStyle = n.titleColor, t.font = a.string, s = 0; s < i; ++s) t.fillText(r[s], c.x(e.x), e.y + a.lineHeight / 2), e.y += a.lineHeight + o, s + 1 === i && (e.y += n.titleMarginBottom - o);
		}
	}
	_drawColorBox(e, t, n, r, i) {
		let a = this.labelColors[n], o = this.labelPointStyles[n], { boxHeight: s, boxWidth: c } = i, l = Jf(i.bodyFont), u = Lv(this, "left", i), d = r.x(u), f = s < l.lineHeight ? (l.lineHeight - s) / 2 : 0, p = t.y + f;
		if (i.usePointStyle) {
			let t = {
				radius: Math.min(c, s) / 2,
				pointStyle: o.pointStyle,
				rotation: o.rotation,
				borderWidth: 1
			}, n = r.leftForLtr(d, c) + c / 2, l = p + s / 2;
			e.strokeStyle = i.multiKeyBackground, e.fillStyle = i.multiKeyBackground, Of(e, t, n, l), e.strokeStyle = a.borderColor, e.fillStyle = a.backgroundColor, Of(e, t, n, l);
		} else {
			e.lineWidth = U(a.borderWidth) ? Math.max(...Object.values(a.borderWidth)) : a.borderWidth || 1, e.strokeStyle = a.borderColor, e.setLineDash(a.borderDash || []), e.lineDashOffset = a.borderDashOffset || 0;
			let t = r.leftForLtr(d, c), n = r.leftForLtr(r.xPlus(d, 1), c - 2), o = Kf(a.borderRadius);
			Object.values(o).some((e) => e !== 0) ? (e.beginPath(), e.fillStyle = i.multiKeyBackground, zf(e, {
				x: t,
				y: p,
				w: c,
				h: s,
				radius: o
			}), e.fill(), e.stroke(), e.fillStyle = a.backgroundColor, e.beginPath(), zf(e, {
				x: n,
				y: p + 1,
				w: c - 2,
				h: s - 2,
				radius: o
			}), e.fill()) : (e.fillStyle = i.multiKeyBackground, e.fillRect(t, p, c, s), e.strokeRect(t, p, c, s), e.fillStyle = a.backgroundColor, e.fillRect(n, p + 1, c - 2, s - 2));
		}
		e.fillStyle = this.labelTextColors[n];
	}
	drawBody(e, t, n) {
		let { body: r } = this, { bodySpacing: i, bodyAlign: a, displayColors: o, boxHeight: s, boxWidth: c, boxPadding: l } = n, u = Jf(n.bodyFont), d = u.lineHeight, f = 0, p = Yp(n.rtl, this.x, this.width), m = function(n) {
			t.fillText(n, p.x(e.x + f), e.y + d / 2), e.y += d + i;
		}, h = p.textAlign(a), g, _, v, y, b, x, S;
		for (t.textAlign = a, t.textBaseline = "middle", t.font = u.string, e.x = Lv(this, h, n), t.fillStyle = n.bodyColor, G(this.beforeBody, m), f = o && h !== "right" ? a === "center" ? c / 2 + l : c + 2 + l : 0, y = 0, x = r.length; y < x; ++y) {
			for (g = r[y], _ = this.labelTextColors[y], t.fillStyle = _, G(g.before, m), v = g.lines, o && v.length && (this._drawColorBox(t, e, y, p, n), d = Math.max(u.lineHeight, s)), b = 0, S = v.length; b < S; ++b) m(v[b]), d = u.lineHeight;
			G(g.after, m);
		}
		f = 0, d = u.lineHeight, G(this.afterBody, m), e.y -= i;
	}
	drawFooter(e, t, n) {
		let r = this.footer, i = r.length, a, o;
		if (i) {
			let s = Yp(n.rtl, this.x, this.width);
			for (e.x = Lv(this, n.footerAlign, n), e.y += n.footerMarginTop, t.textAlign = s.textAlign(n.footerAlign), t.textBaseline = "middle", a = Jf(n.footerFont), t.fillStyle = n.footerColor, t.font = a.string, o = 0; o < i; ++o) t.fillText(r[o], s.x(e.x), e.y + a.lineHeight / 2), e.y += a.lineHeight + n.footerSpacing;
		}
	}
	drawBackground(e, t, n, r) {
		let { xAlign: i, yAlign: a } = this, { x: o, y: s } = e, { width: c, height: l } = n, { topLeft: u, topRight: d, bottomLeft: f, bottomRight: p } = Kf(r.cornerRadius);
		t.fillStyle = r.backgroundColor, t.strokeStyle = r.borderColor, t.lineWidth = r.borderWidth, t.beginPath(), t.moveTo(o + u, s), a === "top" && this.drawCaret(e, t, n, r), t.lineTo(o + c - d, s), t.quadraticCurveTo(o + c, s, o + c, s + d), a === "center" && i === "right" && this.drawCaret(e, t, n, r), t.lineTo(o + c, s + l - p), t.quadraticCurveTo(o + c, s + l, o + c - p, s + l), a === "bottom" && this.drawCaret(e, t, n, r), t.lineTo(o + f, s + l), t.quadraticCurveTo(o, s + l, o, s + l - f), a === "center" && i === "left" && this.drawCaret(e, t, n, r), t.lineTo(o, s + u), t.quadraticCurveTo(o, s, o + u, s), t.closePath(), t.fill(), r.borderWidth > 0 && t.stroke();
	}
	_updateAnimationTarget(e) {
		let t = this.chart, n = this.$animations, r = n && n.x, i = n && n.y;
		if (r || i) {
			let n = Tv[e.position].call(this, this._active, this._eventPosition);
			if (!n) return;
			let a = this._size = kv(this, e), o = Object.assign({}, n, this._size), s = Nv(t, e, o), c = Iv(e, o, s, t);
			(r._to !== c.x || i._to !== c.y) && (this.xAlign = s.xAlign, this.yAlign = s.yAlign, this.width = a.width, this.height = a.height, this.caretX = n.x, this.caretY = n.y, this._resolveAnimations().update(this, c));
		}
	}
	_willRender() {
		return !!this.opacity;
	}
	draw(e) {
		let t = this.options.setContext(this.getContext()), n = this.opacity;
		if (!n) return;
		this._updateAnimationTarget(t);
		let r = {
			width: this.width,
			height: this.height
		}, i = {
			x: this.x,
			y: this.y
		};
		n = Math.abs(n) < .001 ? 0 : n;
		let a = qf(t.padding), o = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
		t.enabled && o && (e.save(), e.globalAlpha = n, this.drawBackground(i, e, r, t), Xp(e, t.textDirection), i.y += a.top, this.drawTitle(i, e, t), this.drawBody(i, e, t), this.drawFooter(i, e, t), Zp(e, t.textDirection), e.restore());
	}
	getActiveElements() {
		return this._active || [];
	}
	setActiveElements(e, t) {
		let n = this._active, r = e.map(({ datasetIndex: e, index: t }) => {
			let n = this.chart.getDatasetMeta(e);
			if (!n) throw Error("Cannot find a dataset at index " + e);
			return {
				datasetIndex: e,
				element: n.data[t],
				index: t
			};
		}), i = !Xu(n, r), a = this._positionChanged(r, t);
		(i || a) && (this._active = r, this._eventPosition = t, this._ignoreReplayEvents = !0, this.update(!0));
	}
	handleEvent(e, t, n = !0) {
		if (t && this._ignoreReplayEvents) return !1;
		this._ignoreReplayEvents = !1;
		let r = this.options, i = this._active || [], a = this._getActiveElements(e, i, t, n), o = this._positionChanged(a, e), s = t || !Xu(a, i) || o;
		return s && (this._active = a, (r.enabled || r.external) && (this._eventPosition = {
			x: e.x,
			y: e.y
		}, this.update(!0, t))), s;
	}
	_getActiveElements(e, t, n, r) {
		let i = this.options;
		if (e.type === "mouseout") return [];
		if (!r) return t.filter((e) => this.chart.data.datasets[e.datasetIndex] && this.chart.getDatasetMeta(e.datasetIndex).controller.getParsed(e.index) !== void 0);
		let a = this.chart.getElementsAtEventForMode(e, i.mode, i, n);
		return i.reverse && a.reverse(), a;
	}
	_positionChanged(e, t) {
		let { caretX: n, caretY: r, options: i } = this, a = Tv[i.position].call(this, e, t);
		return a !== !1 && (n !== a.x || r !== a.y);
	}
}, Wv = {
	id: "tooltip",
	_element: Uv,
	positioners: Tv,
	afterInit(e, t, n) {
		n && (e.tooltip = new Uv({
			chart: e,
			options: n
		}));
	},
	beforeUpdate(e, t, n) {
		e.tooltip && e.tooltip.initialize(n);
	},
	reset(e, t, n) {
		e.tooltip && e.tooltip.initialize(n);
	},
	afterDraw(e) {
		let t = e.tooltip;
		if (t && t._willRender()) {
			let n = { tooltip: t };
			if (e.notifyPlugins("beforeTooltipDraw", {
				...n,
				cancelable: !0
			}) === !1) return;
			t.draw(e.ctx), e.notifyPlugins("afterTooltipDraw", n);
		}
	},
	afterEvent(e, t) {
		if (e.tooltip) {
			let n = t.replay;
			e.tooltip.handleEvent(t.event, n, t.inChartArea) && (t.changed = !0);
		}
	},
	defaults: {
		enabled: !0,
		external: null,
		position: "average",
		backgroundColor: "rgba(0,0,0,0.8)",
		titleColor: "#fff",
		titleFont: { weight: "bold" },
		titleSpacing: 2,
		titleMarginBottom: 6,
		titleAlign: "left",
		bodyColor: "#fff",
		bodySpacing: 2,
		bodyFont: {},
		bodyAlign: "left",
		footerColor: "#fff",
		footerSpacing: 2,
		footerMarginTop: 6,
		footerFont: { weight: "bold" },
		footerAlign: "left",
		padding: 6,
		caretPadding: 2,
		caretSize: 5,
		cornerRadius: 6,
		boxHeight: (e, t) => t.bodyFont.size,
		boxWidth: (e, t) => t.bodyFont.size,
		multiKeyBackground: "#fff",
		displayColors: !0,
		boxPadding: 0,
		borderColor: "rgba(0,0,0,0)",
		borderWidth: 0,
		animation: {
			duration: 400,
			easing: "easeOutQuart"
		},
		animations: {
			numbers: {
				type: "number",
				properties: [
					"x",
					"y",
					"width",
					"height",
					"caretX",
					"caretY"
				]
			},
			opacity: {
				easing: "linear",
				duration: 200
			}
		},
		callbacks: Vv
	},
	defaultRoutes: {
		bodyFont: "font",
		footerFont: "font",
		titleFont: "font"
	},
	descriptors: {
		_scriptable: (e) => e !== "filter" && e !== "itemSort" && e !== "external",
		_indexable: !1,
		callbacks: {
			_scriptable: !1,
			_indexable: !1
		},
		animation: { _fallback: !1 },
		animations: { _fallback: "animation" }
	},
	additionalOptionScopes: ["interaction"]
}, Gv = (e, t, n, r) => (typeof t == "string" ? (n = e.push(t) - 1, r.unshift({
	index: n,
	label: t
})) : isNaN(t) && (n = null), n);
function Kv(e, t, n, r) {
	let i = e.indexOf(t);
	return i === -1 ? Gv(e, t, n, r) : i === e.lastIndexOf(t) ? i : n;
}
var qv = (e, t) => e === null ? null : Fd(Math.round(e), 0, t);
function Jv(e) {
	let t = this.getLabels();
	return e >= 0 && e < t.length ? t[e] : e;
}
var Yv = class extends Tg {
	static id = "category";
	static defaults = { ticks: { callback: Jv } };
	constructor(e) {
		super(e), this._startValue = void 0, this._valueRange = 0, this._addedLabels = [];
	}
	init(e) {
		let t = this._addedLabels;
		if (t.length) {
			let e = this.getLabels();
			for (let { index: n, label: r } of t) e[n] === r && e.splice(n, 1);
			this._addedLabels = [];
		}
		super.init(e);
	}
	parse(e, t) {
		if (V(e)) return null;
		let n = this.getLabels();
		return t = isFinite(t) && n[t] === e ? t : Kv(n, e, W(t, e), this._addedLabels), qv(t, n.length - 1);
	}
	determineDataLimits() {
		let { minDefined: e, maxDefined: t } = this.getUserBounds(), { min: n, max: r } = this.getMinMax(!0);
		this.options.bounds === "ticks" && (e || (n = 0), t || (r = this.getLabels().length - 1)), this.min = n, this.max = r;
	}
	buildTicks() {
		let e = this.min, t = this.max, n = this.options.offset, r = [], i = this.getLabels();
		i = e === 0 && t === i.length - 1 ? i : i.slice(e, t + 1), this._valueRange = Math.max(i.length - +!n, 1), this._startValue = this.min - (n ? .5 : 0);
		for (let n = e; n <= t; n++) r.push({ value: n });
		return r;
	}
	getLabelForValue(e) {
		return Jv.call(this, e);
	}
	configure() {
		super.configure(), this.isHorizontal() || (this._reversePixels = !this._reversePixels);
	}
	getPixelForValue(e) {
		return typeof e != "number" && (e = this.parse(e)), e === null ? NaN : this.getPixelForDecimal((e - this._startValue) / this._valueRange);
	}
	getPixelForTick(e) {
		let t = this.ticks;
		return e < 0 || e > t.length - 1 ? null : this.getPixelForValue(t[e].value);
	}
	getValueForPixel(e) {
		return Math.round(this._startValue + this.getDecimalForPixel(e) * this._valueRange);
	}
	getBasePixel() {
		return this.bottom;
	}
};
function Xv(e, t) {
	let n = [], { bounds: r, step: i, min: a, max: o, precision: s, count: c, maxTicks: l, maxDigits: u, includeBounds: d } = e, f = i || 1, p = l - 1, { min: m, max: h } = t, g = !V(a), _ = !V(o), v = !V(c), y = (h - m) / (u + 1), b = xd((h - m) / p / f) * f, x, S, C, w;
	if (b < 1e-14 && !g && !_) return [{ value: m }, { value: h }];
	w = Math.ceil(h / b) - Math.floor(m / b), w > p && (b = xd(w * b / p / f) * f), V(s) || (x = 10 ** s, b = Math.ceil(b * x) / x), r === "ticks" ? (S = Math.floor(m / b) * b, C = Math.ceil(h / b) * b) : (S = m, C = h), g && _ && i && Td((o - a) / i, b / 1e3) ? (w = Math.round(Math.min((o - a) / b, l)), b = (o - a) / w, S = a, C = o) : v ? (S = g ? a : S, C = _ ? o : C, w = c - 1, b = (C - S) / w) : (w = (C - S) / b, w = bd(w, Math.round(w), b / 1e3) ? Math.round(w) : Math.ceil(w));
	let T = Math.max(kd(b), kd(S));
	x = 10 ** (V(s) ? T : s), S = Math.round(S * x) / x, C = Math.round(C * x) / x;
	let E = 0;
	for (g && (d && S !== a ? (n.push({ value: a }), S < a && E++, bd(Math.round((S + E * b) * x) / x, a, Zv(a, y, e)) && E++) : S < a && E++); E < w; ++E) {
		let e = Math.round((S + E * b) * x) / x;
		if (_ && e > o) break;
		n.push({ value: e });
	}
	return _ && d && C !== o ? n.length && bd(n[n.length - 1].value, o, Zv(o, y, e)) ? n[n.length - 1].value = o : n.push({ value: o }) : (!_ || C === o) && n.push({ value: C }), n;
}
function Zv(e, t, { horizontal: n, minRotation: r }) {
	let i = Dd(r), a = (n ? Math.sin(i) : Math.cos(i)) || .001, o = .75 * t * ("" + e).length;
	return Math.min(t / a, o);
}
var Qv = class extends Tg {
	constructor(e) {
		super(e), this.start = void 0, this.end = void 0, this._startValue = void 0, this._endValue = void 0, this._valueRange = 0;
	}
	parse(e, t) {
		return V(e) || (typeof e == "number" || e instanceof Number) && !isFinite(+e) ? null : +e;
	}
	handleTickRangeOptions() {
		let { beginAtZero: e } = this.options, { minDefined: t, maxDefined: n } = this.getUserBounds(), { min: r, max: i } = this, a = (e) => r = t ? r : e, o = (e) => i = n ? i : e;
		if (e) {
			let e = yd(r), t = yd(i);
			e < 0 && t < 0 ? o(0) : e > 0 && t > 0 && a(0);
		}
		if (r === i) {
			let t = i === 0 ? 1 : Math.abs(i * .05);
			o(i + t), e || a(r - t);
		}
		this.min = r, this.max = i;
	}
	getTickLimit() {
		let { maxTicksLimit: e, stepSize: t } = this.options.ticks, n;
		return t ? (n = Math.ceil(this.max / t) - Math.floor(this.min / t) + 1, n > 1e3 && (console.warn(`scales.${this.id}.ticks.stepSize: ${t} would result generating up to ${n} ticks. Limiting to 1000.`), n = 1e3)) : (n = this.computeTickLimit(), e ||= 11), e && (n = Math.min(e, n)), n;
	}
	computeTickLimit() {
		return Infinity;
	}
	buildTicks() {
		let e = this.options, t = e.ticks, n = this.getTickLimit();
		n = Math.max(2, n);
		let r = Xv({
			maxTicks: n,
			bounds: e.bounds,
			min: e.min,
			max: e.max,
			precision: t.precision,
			step: t.stepSize,
			count: t.count,
			maxDigits: this._maxDigits(),
			horizontal: this.isHorizontal(),
			minRotation: t.minRotation || 0,
			includeBounds: t.includeBounds !== !1
		}, this._range || this);
		return e.bounds === "ticks" && Ed(r, this, "value"), e.reverse ? (r.reverse(), this.start = this.max, this.end = this.min) : (this.start = this.min, this.end = this.max), r;
	}
	configure() {
		let e = this.ticks, t = this.min, n = this.max;
		if (super.configure(), this.options.offset && e.length) {
			let r = (n - t) / Math.max(e.length - 1, 1) / 2;
			t -= r, n += r;
		}
		this._startValue = t, this._endValue = n, this._valueRange = n - t;
	}
	getLabelForValue(e) {
		return pf(e, this.chart.options.locale, this.options.ticks.format);
	}
}, $v = class extends Qv {
	static id = "linear";
	static defaults = { ticks: { callback: gf.formatters.numeric } };
	determineDataLimits() {
		let { min: e, max: t } = this.getMinMax(!0);
		this.min = Gu(e) ? e : 0, this.max = Gu(t) ? t : 1, this.handleTickRangeOptions();
	}
	computeTickLimit() {
		let e = this.isHorizontal(), t = e ? this.width : this.height, n = Dd(this.options.ticks.minRotation), r = (e ? Math.sin(n) : Math.cos(n)) || .001, i = this._resolveTickFontOptions(0);
		return Math.ceil(t / Math.min(40, i.lineHeight / r));
	}
	getPixelForValue(e) {
		return e === null ? NaN : this.getPixelForDecimal((e - this._startValue) / this._valueRange);
	}
	getValueForPixel(e) {
		return this._startValue + this.getDecimalForPixel(e) * this._valueRange;
	}
}, ey = (e) => Math.floor(vd(e)), ty = (e, t) => 10 ** (ey(e) + t);
function ny(e) {
	return e / 10 ** ey(e) == 1;
}
function ry(e, t, n) {
	let r = 10 ** n, i = Math.floor(e / r);
	return Math.ceil(t / r) - i;
}
function iy(e, t) {
	let n = ey(t - e);
	for (; ry(e, t, n) > 10;) n++;
	for (; ry(e, t, n) < 10;) n--;
	return Math.min(n, ey(e));
}
function ay(e, { min: t, max: n }) {
	t = Ku(e.min, t);
	let r = [], i = ey(t), a = iy(t, n), o = a < 0 ? 10 ** Math.abs(a) : 1, s = 10 ** a, c = i > a ? 10 ** i : 0, l = Math.round((t - c) * o) / o, u = Math.floor((t - c) / s / 10) * s * 10, d = Math.floor((l - u) / 10 ** a), f = Ku(e.min, Math.round((c + u + d * 10 ** a) * o) / o);
	for (; f < n;) r.push({
		value: f,
		major: ny(f),
		significand: d
	}), d >= 10 ? d = d < 15 ? 15 : 20 : d++, d >= 20 && (a++, d = 2, o = a >= 0 ? 1 : o), f = Math.round((c + u + d * 10 ** a) * o) / o;
	let p = Ku(e.max, f);
	return r.push({
		value: p,
		major: ny(p),
		significand: d
	}), r;
}
(class extends Tg {
	static id = "logarithmic";
	static defaults = { ticks: {
		callback: gf.formatters.logarithmic,
		major: { enabled: !0 }
	} };
	constructor(e) {
		super(e), this.start = void 0, this.end = void 0, this._startValue = void 0, this._valueRange = 0;
	}
	parse(e, t) {
		let n = Qv.prototype.parse.apply(this, [e, t]);
		if (n === 0) {
			this._zero = !0;
			return;
		}
		return Gu(n) && n > 0 ? n : null;
	}
	determineDataLimits() {
		let { min: e, max: t } = this.getMinMax(!0);
		this.min = Gu(e) ? Math.max(0, e) : null, this.max = Gu(t) ? Math.max(0, t) : null, this.options.beginAtZero && (this._zero = !0), this._zero && this.min !== this._suggestedMin && !Gu(this._userMin) && (this.min = e === ty(this.min, 0) ? ty(this.min, -1) : ty(this.min, 0)), this.handleTickRangeOptions();
	}
	handleTickRangeOptions() {
		let { minDefined: e, maxDefined: t } = this.getUserBounds(), n = this.min, r = this.max, i = (t) => n = e ? n : t, a = (e) => r = t ? r : e;
		n === r && (n <= 0 ? (i(1), a(10)) : (i(ty(n, -1)), a(ty(r, 1)))), n <= 0 && i(ty(r, -1)), r <= 0 && a(ty(n, 1)), this.min = n, this.max = r;
	}
	buildTicks() {
		let e = this.options, t = ay({
			min: this._userMin,
			max: this._userMax
		}, this);
		return e.bounds === "ticks" && Ed(t, this, "value"), e.reverse ? (t.reverse(), this.start = this.max, this.end = this.min) : (this.start = this.min, this.end = this.max), t;
	}
	getLabelForValue(e) {
		return e === void 0 ? "0" : pf(e, this.chart.options.locale, this.options.ticks.format);
	}
	configure() {
		let e = this.min;
		super.configure(), this._startValue = vd(e), this._valueRange = vd(this.max) - vd(e);
	}
	getPixelForValue(e) {
		return (e === void 0 || e === 0) && (e = this.min), e === null || isNaN(e) ? NaN : this.getPixelForDecimal(e === this.min ? 0 : (vd(e) - this._startValue) / this._valueRange);
	}
	getValueForPixel(e) {
		let t = this.getDecimalForPixel(e);
		return 10 ** (this._startValue + t * this._valueRange);
	}
});
function oy(e) {
	let t = e.ticks;
	if (t.display && e.display) {
		let e = qf(t.backdropPadding);
		return W(t.font && t.font.size, Sf.font.size) + e.height;
	}
	return 0;
}
function sy(e, t, n) {
	return n = H(n) ? n : [n], {
		w: Tf(e, t.string, n),
		h: n.length * t.lineHeight
	};
}
function cy(e, t, n, r, i) {
	return e === r || e === i ? {
		start: t - n / 2,
		end: t + n / 2
	} : e < r || e > i ? {
		start: t - n,
		end: t
	} : {
		start: t,
		end: t + n
	};
}
function ly(e) {
	let t = {
		l: e.left + e._padding.left,
		r: e.right - e._padding.right,
		t: e.top + e._padding.top,
		b: e.bottom - e._padding.bottom
	}, n = Object.assign({}, t), r = [], i = [], a = e._pointLabels.length, o = e.options.pointLabels, s = o.centerPointLabels ? K / a : 0;
	for (let c = 0; c < a; c++) {
		let a = o.setContext(e.getPointLabelContext(c));
		i[c] = a.padding;
		let l = e.getPointPosition(c, e.drawingArea + i[c], s), u = Jf(a.font), d = sy(e.ctx, u, e._pointLabels[c]);
		r[c] = d;
		let f = Nd(e.getIndexAngle(c) + s), p = Math.round(Od(f));
		uy(n, t, f, cy(p, l.x, d.w, 0, 180), cy(p, l.y, d.h, 90, 270));
	}
	e.setCenterPoint(t.l - n.l, n.r - t.r, t.t - n.t, n.b - t.b), e._pointLabelItems = py(e, r, i);
}
function uy(e, t, n, r, i) {
	let a = Math.abs(Math.sin(n)), o = Math.abs(Math.cos(n)), s = 0, c = 0;
	r.start < t.l ? (s = (t.l - r.start) / a, e.l = Math.min(e.l, t.l - s)) : r.end > t.r && (s = (r.end - t.r) / a, e.r = Math.max(e.r, t.r + s)), i.start < t.t ? (c = (t.t - i.start) / o, e.t = Math.min(e.t, t.t - c)) : i.end > t.b && (c = (i.end - t.b) / o, e.b = Math.max(e.b, t.b + c));
}
function dy(e, t, n) {
	let r = e.drawingArea, { extra: i, additionalAngle: a, padding: o, size: s } = n, c = e.getPointPosition(t, r + i + o, a), l = Math.round(Od(Nd(c.angle + hd))), u = gy(c.y, s.h, l), d = my(l), f = hy(c.x, s.w, d);
	return {
		visible: !0,
		x: c.x,
		y: u,
		textAlign: d,
		left: f,
		top: u,
		right: f + s.w,
		bottom: u + s.h
	};
}
function fy(e, t) {
	if (!t) return !0;
	let { left: n, top: r, right: i, bottom: a } = e;
	return !(Af({
		x: n,
		y: r
	}, t) || Af({
		x: n,
		y: a
	}, t) || Af({
		x: i,
		y: r
	}, t) || Af({
		x: i,
		y: a
	}, t));
}
function py(e, t, n) {
	let r = [], i = e._pointLabels.length, a = e.options, { centerPointLabels: o, display: s } = a.pointLabels, c = {
		extra: oy(a) / 2,
		additionalAngle: o ? K / i : 0
	}, l;
	for (let a = 0; a < i; a++) {
		c.padding = n[a], c.size = t[a];
		let i = dy(e, a, c);
		r.push(i), s === "auto" && (i.visible = fy(i, l), i.visible && (l = i));
	}
	return r;
}
function my(e) {
	return e === 0 || e === 180 ? "center" : e < 180 ? "left" : "right";
}
function hy(e, t, n) {
	return n === "right" ? e -= t : n === "center" && (e -= t / 2), e;
}
function gy(e, t, n) {
	return n === 90 || n === 270 ? e -= t / 2 : (n > 270 || n < 90) && (e -= t), e;
}
function _y(e, t, n) {
	let { left: r, top: i, right: a, bottom: o } = n, { backdropColor: s } = t;
	if (!V(s)) {
		let n = Kf(t.borderRadius), c = qf(t.backdropPadding);
		e.fillStyle = s;
		let l = r - c.left, u = i - c.top, d = a - r + c.width, f = o - i + c.height;
		Object.values(n).some((e) => e !== 0) ? (e.beginPath(), zf(e, {
			x: l,
			y: u,
			w: d,
			h: f,
			radius: n
		}), e.fill()) : e.fillRect(l, u, d, f);
	}
}
function vy(e, t) {
	let { ctx: n, options: { pointLabels: r } } = e;
	for (let i = t - 1; i >= 0; i--) {
		let t = e._pointLabelItems[i];
		if (!t.visible) continue;
		let a = r.setContext(e.getPointLabelContext(i));
		_y(n, a, t);
		let o = Jf(a.font), { x: s, y: c, textAlign: l } = t;
		Rf(n, e._pointLabels[i], s, c + o.lineHeight / 2, o, {
			color: a.color,
			textAlign: l,
			textBaseline: "middle"
		});
	}
}
function yy(e, t, n, r) {
	let { ctx: i } = e;
	if (n) i.arc(e.xCenter, e.yCenter, t, 0, q);
	else {
		let n = e.getPointPosition(0, t);
		i.moveTo(n.x, n.y);
		for (let a = 1; a < r; a++) n = e.getPointPosition(a, t), i.lineTo(n.x, n.y);
	}
}
function by(e, t, n, r, i) {
	let a = e.ctx, o = t.circular, { color: s, lineWidth: c } = t;
	!o && !r || !s || !c || n < 0 || (a.save(), a.strokeStyle = s, a.lineWidth = c, a.setLineDash(i.dash || []), a.lineDashOffset = i.dashOffset, a.beginPath(), yy(e, n, o, r), a.closePath(), a.stroke(), a.restore());
}
function xy(e, t, n) {
	return Zf(e, {
		label: n,
		index: t,
		type: "pointLabel"
	});
}
var Sy = class extends Qv {
	static id = "radialLinear";
	static defaults = {
		display: !0,
		animate: !0,
		position: "chartArea",
		angleLines: {
			display: !0,
			lineWidth: 1,
			borderDash: [],
			borderDashOffset: 0
		},
		grid: { circular: !1 },
		startAngle: 0,
		ticks: {
			showLabelBackdrop: !0,
			callback: gf.formatters.numeric
		},
		pointLabels: {
			backdropColor: void 0,
			backdropPadding: 2,
			display: !0,
			font: { size: 10 },
			callback(e) {
				return e;
			},
			padding: 5,
			centerPointLabels: !1
		}
	};
	static defaultRoutes = {
		"angleLines.color": "borderColor",
		"pointLabels.color": "color",
		"ticks.color": "color"
	};
	static descriptors = { angleLines: { _fallback: "grid" } };
	constructor(e) {
		super(e), this.xCenter = void 0, this.yCenter = void 0, this.drawingArea = void 0, this._pointLabels = [], this._pointLabelItems = [];
	}
	setDimensions() {
		let e = this._padding = qf(oy(this.options) / 2), t = this.width = this.maxWidth - e.width, n = this.height = this.maxHeight - e.height;
		this.xCenter = Math.floor(this.left + t / 2 + e.left), this.yCenter = Math.floor(this.top + n / 2 + e.top), this.drawingArea = Math.floor(Math.min(t, n) / 2);
	}
	determineDataLimits() {
		let { min: e, max: t } = this.getMinMax(!1);
		this.min = Gu(e) && !isNaN(e) ? e : 0, this.max = Gu(t) && !isNaN(t) ? t : 0, this.handleTickRangeOptions();
	}
	computeTickLimit() {
		return Math.ceil(this.drawingArea / oy(this.options));
	}
	generateTickLabels(e) {
		Qv.prototype.generateTickLabels.call(this, e), this._pointLabels = this.getLabels().map((e, t) => {
			let n = Yu(this.options.pointLabels.callback, [e, t], this);
			return n || n === 0 ? n : "";
		}).filter((e, t) => this.chart.getDataVisibility(t));
	}
	fit() {
		let e = this.options;
		e.display && e.pointLabels.display ? ly(this) : this.setCenterPoint(0, 0, 0, 0);
	}
	setCenterPoint(e, t, n, r) {
		this.xCenter += Math.floor((e - t) / 2), this.yCenter += Math.floor((n - r) / 2), this.drawingArea -= Math.min(this.drawingArea / 2, Math.max(e, t, n, r));
	}
	getIndexAngle(e) {
		let t = q / (this._pointLabels.length || 1), n = this.options.startAngle || 0;
		return Nd(e * t + Dd(n));
	}
	getDistanceFromCenterForValue(e) {
		if (V(e)) return NaN;
		let t = this.drawingArea / (this.max - this.min);
		return this.options.reverse ? (this.max - e) * t : (e - this.min) * t;
	}
	getValueForDistanceFromCenter(e) {
		if (V(e)) return NaN;
		let t = e / (this.drawingArea / (this.max - this.min));
		return this.options.reverse ? this.max - t : this.min + t;
	}
	getPointLabelContext(e) {
		let t = this._pointLabels || [];
		if (e >= 0 && e < t.length) {
			let n = t[e];
			return xy(this.getContext(), e, n);
		}
	}
	getPointPosition(e, t, n = 0) {
		let r = this.getIndexAngle(e) - hd + n;
		return {
			x: Math.cos(r) * t + this.xCenter,
			y: Math.sin(r) * t + this.yCenter,
			angle: r
		};
	}
	getPointPositionForValue(e, t) {
		return this.getPointPosition(e, this.getDistanceFromCenterForValue(t));
	}
	getBasePosition(e) {
		return this.getPointPositionForValue(e || 0, this.getBaseValue());
	}
	getPointLabelPosition(e) {
		let { left: t, top: n, right: r, bottom: i } = this._pointLabelItems[e];
		return {
			left: t,
			top: n,
			right: r,
			bottom: i
		};
	}
	drawBackground() {
		let { backgroundColor: e, grid: { circular: t } } = this.options;
		if (e) {
			let n = this.ctx;
			n.save(), n.beginPath(), yy(this, this.getDistanceFromCenterForValue(this._endValue), t, this._pointLabels.length), n.closePath(), n.fillStyle = e, n.fill(), n.restore();
		}
	}
	drawGrid() {
		let e = this.ctx, t = this.options, { angleLines: n, grid: r, border: i } = t, a = this._pointLabels.length, o, s, c;
		if (t.pointLabels.display && vy(this, a), r.display && this.ticks.forEach((e, t) => {
			if (t !== 0 || t === 0 && this.min < 0) {
				s = this.getDistanceFromCenterForValue(e.value);
				let n = this.getContext(t), o = r.setContext(n), c = i.setContext(n);
				by(this, o, s, a, c);
			}
		}), n.display) {
			for (e.save(), o = a - 1; o >= 0; o--) {
				let r = n.setContext(this.getPointLabelContext(o)), { color: i, lineWidth: a } = r;
				!a || !i || (e.lineWidth = a, e.strokeStyle = i, e.setLineDash(r.borderDash), e.lineDashOffset = r.borderDashOffset, s = this.getDistanceFromCenterForValue(t.reverse ? this.min : this.max), c = this.getPointPosition(o, s), e.beginPath(), e.moveTo(this.xCenter, this.yCenter), e.lineTo(c.x, c.y), e.stroke());
			}
			e.restore();
		}
	}
	drawBorder() {}
	drawLabels() {
		let e = this.ctx, t = this.options, n = t.ticks;
		if (!n.display) return;
		let r = this.getIndexAngle(0), i, a;
		e.save(), e.translate(this.xCenter, this.yCenter), e.rotate(r), e.textAlign = "center", e.textBaseline = "middle", this.ticks.forEach((r, o) => {
			if (o === 0 && this.min >= 0 && !t.reverse) return;
			let s = n.setContext(this.getContext(o)), c = Jf(s.font);
			if (i = this.getDistanceFromCenterForValue(this.ticks[o].value), s.showLabelBackdrop) {
				e.font = c.string, a = e.measureText(r.label).width, e.fillStyle = s.backdropColor;
				let t = qf(s.backdropPadding);
				e.fillRect(-a / 2 - t.left, -i - c.size / 2 - t.top, a + t.width, c.size + t.height);
			}
			Rf(e, r.label, 0, -i, c, {
				color: s.color,
				strokeColor: s.textStrokeColor,
				strokeWidth: s.textStrokeWidth
			});
		}), e.restore();
	}
	drawTitle() {}
}, Cy = {
	millisecond: {
		common: !0,
		size: 1,
		steps: 1e3
	},
	second: {
		common: !0,
		size: 1e3,
		steps: 60
	},
	minute: {
		common: !0,
		size: 6e4,
		steps: 60
	},
	hour: {
		common: !0,
		size: 36e5,
		steps: 24
	},
	day: {
		common: !0,
		size: 864e5,
		steps: 30
	},
	week: {
		common: !1,
		size: 6048e5,
		steps: 4
	},
	month: {
		common: !0,
		size: 2628e6,
		steps: 12
	},
	quarter: {
		common: !1,
		size: 7884e6,
		steps: 4
	},
	year: {
		common: !0,
		size: 3154e7
	}
}, wy = /* @__PURE__ */ Object.keys(Cy);
function Ty(e, t) {
	return e - t;
}
function Ey(e, t) {
	if (V(t)) return null;
	let n = e._adapter, { parser: r, round: i, isoWeekday: a } = e._parseOpts, o = t;
	return typeof r == "function" && (o = r(o)), Gu(o) || (o = typeof r == "string" ? n.parse(o, r) : n.parse(o)), o === null ? null : (i && (o = i === "week" && (wd(a) || a === !0) ? n.startOf(o, "isoWeek", a) : n.startOf(o, i)), +o);
}
function Dy(e, t, n, r) {
	let i = wy.length;
	for (let a = wy.indexOf(e); a < i - 1; ++a) {
		let e = Cy[wy[a]], i = e.steps ? e.steps : 2 ** 53 - 1;
		if (e.common && Math.ceil((n - t) / (i * e.size)) <= r) return wy[a];
	}
	return wy[i - 1];
}
function Oy(e, t, n, r, i) {
	for (let a = wy.length - 1; a >= wy.indexOf(n); a--) {
		let n = wy[a];
		if (Cy[n].common && e._adapter.diff(i, r, n) >= t - 1) return n;
	}
	return wy[n ? wy.indexOf(n) : 0];
}
function ky(e) {
	for (let t = wy.indexOf(e) + 1, n = wy.length; t < n; ++t) if (Cy[wy[t]].common) return wy[t];
}
function Ay(e, t, n) {
	if (!n) e[t] = !0;
	else if (n.length) {
		let { lo: r, hi: i } = Rd(n, t), a = n[r] >= t ? n[r] : n[i];
		e[a] = !0;
	}
}
function jy(e, t, n, r) {
	let i = e._adapter, a = +i.startOf(t[0].value, r), o = t[t.length - 1].value, s, c;
	for (s = a; s <= o; s = +i.add(s, 1, r)) c = n[s], c >= 0 && (t[c].major = !0);
	return t;
}
function My(e, t, n) {
	let r = [], i = {}, a = t.length, o, s;
	for (o = 0; o < a; ++o) s = t[o], i[s] = o, r.push({
		value: s,
		major: !1
	});
	return a === 0 || !n ? r : jy(e, r, i, n);
}
var Ny = class extends Tg {
	static id = "time";
	static defaults = {
		bounds: "data",
		adapters: {},
		time: {
			parser: !1,
			unit: !1,
			round: !1,
			isoWeekday: !1,
			minUnit: "millisecond",
			displayFormats: {}
		},
		ticks: {
			source: "auto",
			callback: !1,
			major: { enabled: !1 }
		}
	};
	constructor(e) {
		super(e), this._cache = {
			data: [],
			labels: [],
			all: []
		}, this._unit = "day", this._majorUnit = void 0, this._offsets = {}, this._normalized = !1, this._parseOpts = void 0;
	}
	init(e, t = {}) {
		let n = e.time ||= {}, r = this._adapter = new lh._date(e.adapters.date);
		r.init(t), td(n.displayFormats, r.formats()), this._parseOpts = {
			parser: n.parser,
			round: n.round,
			isoWeekday: n.isoWeekday
		}, super.init(e), this._normalized = t.normalized;
	}
	parse(e, t) {
		return e === void 0 ? null : Ey(this, e);
	}
	beforeLayout() {
		super.beforeLayout(), this._cache = {
			data: [],
			labels: [],
			all: []
		};
	}
	determineDataLimits() {
		let e = this.options, t = this._adapter, n = e.time.unit || "day", { min: r, max: i, minDefined: a, maxDefined: o } = this.getUserBounds();
		function s(e) {
			!a && !isNaN(e.min) && (r = Math.min(r, e.min)), !o && !isNaN(e.max) && (i = Math.max(i, e.max));
		}
		(!a || !o) && (s(this._getLabelBounds()), (e.bounds !== "ticks" || e.ticks.source !== "labels") && s(this.getMinMax(!1))), r = Gu(r) && !isNaN(r) ? r : +t.startOf(Date.now(), n), i = Gu(i) && !isNaN(i) ? i : +t.endOf(Date.now(), n) + 1, this.min = Math.min(r, i - 1), this.max = Math.max(r + 1, i);
	}
	_getLabelBounds() {
		let e = this.getLabelTimestamps(), t = Infinity, n = -Infinity;
		return e.length && (t = e[0], n = e[e.length - 1]), {
			min: t,
			max: n
		};
	}
	buildTicks() {
		let e = this.options, t = e.time, n = e.ticks, r = n.source === "labels" ? this.getLabelTimestamps() : this._generate();
		e.bounds === "ticks" && r.length && (this.min = this._userMin || r[0], this.max = this._userMax || r[r.length - 1]);
		let i = this.min, a = this.max, o = Vd(r, i, a);
		return this._unit = t.unit || (n.autoSkip ? Dy(t.minUnit, this.min, this.max, this._getLabelCapacity(i)) : Oy(this, o.length, t.minUnit, this.min, this.max)), this._majorUnit = !n.major.enabled || this._unit === "year" ? void 0 : ky(this._unit), this.initOffsets(r), e.reverse && o.reverse(), My(this, o, this._majorUnit);
	}
	afterAutoSkip() {
		this.options.offsetAfterAutoskip && this.initOffsets(this.ticks.map((e) => +e.value));
	}
	initOffsets(e = []) {
		let t = 0, n = 0, r, i;
		this.options.offset && e.length && (r = this.getDecimalForValue(e[0]), t = e.length === 1 ? 1 - r : (this.getDecimalForValue(e[1]) - r) / 2, i = this.getDecimalForValue(e[e.length - 1]), n = e.length === 1 ? i : (i - this.getDecimalForValue(e[e.length - 2])) / 2);
		let a = e.length < 3 ? .5 : .25;
		t = Fd(t, 0, a), n = Fd(n, 0, a), this._offsets = {
			start: t,
			end: n,
			factor: 1 / (t + 1 + n)
		};
	}
	_generate() {
		let e = this._adapter, t = this.min, n = this.max, r = this.options, i = r.time, a = i.unit || Dy(i.minUnit, t, n, this._getLabelCapacity(t)), o = W(r.ticks.stepSize, 1), s = a === "week" ? i.isoWeekday : !1, c = wd(s) || s === !0, l = {}, u = t, d, f;
		if (c && (u = +e.startOf(u, "isoWeek", s)), u = +e.startOf(u, c ? "day" : a), e.diff(n, t, a) > 1e5 * o) throw Error(t + " and " + n + " are too far apart with stepSize of " + o + " " + a);
		let p = r.ticks.source === "data" && this.getDataTimestamps();
		for (d = u, f = 0; d < n; d = +e.add(d, o, a), f++) Ay(l, d, p);
		return (d === n || r.bounds === "ticks" || f === 1) && Ay(l, d, p), Object.keys(l).sort(Ty).map((e) => +e);
	}
	getLabelForValue(e) {
		let t = this._adapter, n = this.options.time;
		return n.tooltipFormat ? t.format(e, n.tooltipFormat) : t.format(e, n.displayFormats.datetime);
	}
	format(e, t) {
		let n = this.options.time.displayFormats, r = this._unit, i = t || n[r];
		return this._adapter.format(e, i);
	}
	_tickFormatFunction(e, t, n, r) {
		let i = this.options, a = i.ticks.callback;
		if (a) return Yu(a, [
			e,
			t,
			n
		], this);
		let o = i.time.displayFormats, s = this._unit, c = this._majorUnit, l = s && o[s], u = c && o[c], d = n[t], f = c && u && d && d.major;
		return this._adapter.format(e, r || (f ? u : l));
	}
	generateTickLabels(e) {
		let t, n, r;
		for (t = 0, n = e.length; t < n; ++t) r = e[t], r.label = this._tickFormatFunction(r.value, t, e);
	}
	getDecimalForValue(e) {
		return e === null ? NaN : (e - this.min) / (this.max - this.min);
	}
	getPixelForValue(e) {
		let t = this._offsets, n = this.getDecimalForValue(e);
		return this.getPixelForDecimal((t.start + n) * t.factor);
	}
	getValueForPixel(e) {
		let t = this._offsets, n = this.getDecimalForPixel(e) / t.factor - t.end;
		return this.min + n * (this.max - this.min);
	}
	_getLabelSize(e) {
		let t = this.options.ticks, n = this.ctx.measureText(e).width, r = Dd(this.isHorizontal() ? t.maxRotation : t.minRotation), i = Math.cos(r), a = Math.sin(r), o = this._resolveTickFontOptions(0).size;
		return {
			w: n * i + o * a,
			h: n * a + o * i
		};
	}
	_getLabelCapacity(e) {
		let t = this.options.time, n = t.displayFormats, r = n[t.unit] || n.millisecond, i = this._tickFormatFunction(e, 0, My(this, [e], this._majorUnit), r), a = this._getLabelSize(i), o = Math.floor(this.isHorizontal() ? this.width / a.w : this.height / a.h) - 1;
		return o > 0 ? o : 1;
	}
	getDataTimestamps() {
		let e = this._cache.data || [], t, n;
		if (e.length) return e;
		let r = this.getMatchingVisibleMetas();
		if (this._normalized && r.length) return this._cache.data = r[0].controller.getAllParsedValues(this);
		for (t = 0, n = r.length; t < n; ++t) e = e.concat(r[t].controller.getAllParsedValues(this));
		return this._cache.data = this.normalize(e);
	}
	getLabelTimestamps() {
		let e = this._cache.labels || [], t, n;
		if (e.length) return e;
		let r = this.getLabels();
		for (t = 0, n = r.length; t < n; ++t) e.push(Ey(this, r[t]));
		return this._cache.labels = this._normalized ? e : this.normalize(e);
	}
	normalize(e) {
		return Gd(e.sort(Ty));
	}
};
function Py(e, t, n) {
	let r = 0, i = e.length - 1, a, o, s, c;
	n ? (t >= e[r].pos && t <= e[i].pos && ({lo: r, hi: i} = zd(e, "pos", t)), {pos: a, time: s} = e[r], {pos: o, time: c} = e[i]) : (t >= e[r].time && t <= e[i].time && ({lo: r, hi: i} = zd(e, "time", t)), {time: a, pos: s} = e[r], {time: o, pos: c} = e[i]);
	let l = o - a;
	return l ? s + (c - s) * (t - a) / l : s;
}
(class extends Ny {
	static id = "timeseries";
	static defaults = Ny.defaults;
	constructor(e) {
		super(e), this._table = [], this._minPos = void 0, this._tableRange = void 0;
	}
	initOffsets() {
		let e = this._getTimestampsForTable(), t = this._table = this.buildLookupTable(e);
		this._minPos = Py(t, this.min), this._tableRange = Py(t, this.max) - this._minPos, super.initOffsets(e);
	}
	buildLookupTable(e) {
		let { min: t, max: n } = this, r = [], i = [], a, o, s, c, l;
		for (a = 0, o = e.length; a < o; ++a) c = e[a], c >= t && c <= n && r.push(c);
		if (r.length < 2) return [{
			time: t,
			pos: 0
		}, {
			time: n,
			pos: 1
		}];
		for (a = 0, o = r.length; a < o; ++a) l = r[a + 1], s = r[a - 1], c = r[a], Math.round((l + s) / 2) !== c && i.push({
			time: c,
			pos: a / (o - 1)
		});
		return i;
	}
	_generate() {
		let e = this.min, t = this.max, n = super.getDataTimestamps();
		return (!n.includes(e) || !n.length) && n.splice(0, 0, e), (!n.includes(t) || n.length === 1) && n.push(t), n.sort((e, t) => e - t);
	}
	_getTimestampsForTable() {
		let e = this._cache.all || [];
		if (e.length) return e;
		let t = this.getDataTimestamps(), n = this.getLabelTimestamps();
		return e = t.length && n.length ? this.normalize(t.concat(n)) : t.length ? t : n, e = this._cache.all = e, e;
	}
	getDecimalForValue(e) {
		return (Py(this._table, e) - this._minPos) / this._tableRange;
	}
	getValueForPixel(e) {
		let t = this._offsets, n = this.getDecimalForPixel(e) / t.factor - t.end;
		return Py(this._table, n * this._tableRange + this._minPos, !0);
	}
});
//#endregion
//#region src/utils/constants.js
var Fy = [
	{
		department: "Ain",
		department_value: "01",
		region: "Auvergne-Rhône-Alpes",
		region_value: "ARA",
		academy: "Académie de Lyon",
		academy_value: "LYON"
	},
	{
		department: "Aisne",
		department_value: "02",
		region: "Hauts-de-France",
		region_value: "HDF",
		academy: "Académie d’Amiens",
		academy_value: "AMIENS"
	},
	{
		department: "Allier",
		department_value: "03",
		region: "Auvergne-Rhône-Alpes",
		region_value: "ARA",
		academy: "Académie de Clermont-Ferrand",
		academy_value: "CLERMONT-FERRAND"
	},
	{
		department: "Alpes de Haute-Provence",
		department_value: "04",
		region: "Provence-Alpes-Côte d’Azur",
		region_value: "PAC",
		academy: "Académie d’Aix-Marseille",
		academy_value: "AIX-MARSEILLE"
	},
	{
		department: "Hautes-Alpes",
		department_value: "05",
		region: "Provence-Alpes-Côte d’Azur",
		region_value: "PAC",
		academy: "Académie d’Aix-Marseille",
		academy_value: "AIX-MARSEILLE"
	},
	{
		department: "Alpes-Maritimes",
		department_value: "06",
		region: "Provence-Alpes-Côte d’Azur",
		region_value: "PAC",
		academy: "Académie de Nice",
		academy_value: "NICE"
	},
	{
		department: "Ardèche",
		department_value: "07",
		region: "Auvergne-Rhône-Alpes",
		region_value: "ARA",
		academy: "Académie de Grenoble",
		academy_value: "GRENOBLE"
	},
	{
		department: "Ardennes",
		department_value: "08",
		region: "Grand Est",
		region_value: "GES",
		academy: "Académie de Reims",
		academy_value: "REIMS"
	},
	{
		department: "Ariège",
		department_value: "09",
		region: "Occitanie",
		region_value: "OCC",
		academy: "Académie de Toulouse",
		academy_value: "TOULOUSE"
	},
	{
		department: "Aube",
		department_value: "10",
		region: "Grand Est",
		region_value: "GES",
		academy: "Académie de Reims",
		academy_value: "REIMS"
	},
	{
		department: "Aude",
		department_value: "11",
		region: "Occitanie",
		region_value: "OCC",
		academy: "Académie de Montpellier",
		academy_value: "MONTPELLIER"
	},
	{
		department: "Aveyron",
		department_value: "12",
		region: "Occitanie",
		region_value: "OCC",
		academy: "Académie de Toulouse",
		academy_value: "TOULOUSE"
	},
	{
		department: "Bouches-du-Rhône",
		department_value: "13",
		region: "Provence-Alpes-Côte d’Azur",
		region_value: "PAC",
		academy: "Académie d’Aix-Marseille",
		academy_value: "AIX-MARSEILLE"
	},
	{
		department: "Calvados",
		department_value: "14",
		region: "Normandie",
		region_value: "NOR",
		academy: "Académie de Normandie",
		academy_value: "NORMANDIE"
	},
	{
		department: "Cantal",
		department_value: "15",
		region: "Auvergne-Rhône-Alpes",
		region_value: "ARA",
		academy: "Académie de Clermont-Ferrand",
		academy_value: "CLERMONT-FERRAND"
	},
	{
		department: "Charente",
		department_value: "16",
		region: "Nouvelle-Aquitaine",
		region_value: "NAQ",
		academy: "Académie de Poitiers",
		academy_value: "POITIERS"
	},
	{
		department: "Charente-Maritime",
		department_value: "17",
		region: "Nouvelle-Aquitaine",
		region_value: "NAQ",
		academy: "Académie de Poitiers",
		academy_value: "POITIERS"
	},
	{
		department: "Cher",
		department_value: "18",
		region: "Centre-Val de Loire",
		region_value: "CVL",
		academy: "Académie d’Orléans-Tours",
		academy_value: "ORLEANS-TOURS"
	},
	{
		department: "Corrèze",
		department_value: "19",
		region: "Nouvelle-Aquitaine",
		region_value: "NAQ",
		academy: "Académie de Limoges",
		academy_value: "LIMOGES"
	},
	{
		department: "Corse-du-Sud",
		department_value: "2A",
		region: "Corse",
		region_value: "20R",
		academy: "Académie de Corse",
		academy_value: "CORSE"
	},
	{
		department: "Haute-Corse",
		department_value: "2B",
		region: "Corse",
		region_value: "20R",
		academy: "Académie de Corse",
		academy_value: "CORSE"
	},
	{
		department: "Côte-d’Or",
		department_value: "21",
		region: "Bourgogne-Franche-Comté",
		region_value: "BFC",
		academy: "Académie de Dijon",
		academy_value: "DIJON"
	},
	{
		department: "Côtes d’Armor",
		department_value: "22",
		region: "Bretagne",
		region_value: "BRE",
		academy: "Académie de Rennes",
		academy_value: "RENNES"
	},
	{
		department: "Creuse",
		department_value: "23",
		region: "Nouvelle-Aquitaine",
		region_value: "NAQ",
		academy: "Académie de Limoges",
		academy_value: "LIMOGES"
	},
	{
		department: "Dordogne",
		department_value: "24",
		region: "Nouvelle-Aquitaine",
		region_value: "NAQ",
		academy: "Académie de Bordeaux",
		academy_value: "BORDEAUX"
	},
	{
		department: "Doubs",
		department_value: "25",
		region: "Bourgogne-Franche-Comté",
		region_value: "BFC",
		academy: "Académie de Besançon",
		academy_value: "BESANCON"
	},
	{
		department: "Drôme",
		department_value: "26",
		region: "Auvergne-Rhône-Alpes",
		region_value: "ARA",
		academy: "Académie de Grenoble",
		academy_value: "GRENOBLE"
	},
	{
		department: "Eure",
		department_value: "27",
		region: "Normandie",
		region_value: "NOR",
		academy: "Académie de Normandie",
		academy_value: "NORMANDIE"
	},
	{
		department: "Eure-et-Loir",
		department_value: "28",
		region: "Centre-Val de Loire",
		region_value: "CVL",
		academy: "Académie d’Orléans-Tours",
		academy_value: "ORLEANS-TOURS"
	},
	{
		department: "Finistère",
		department_value: "29",
		region: "Bretagne",
		region_value: "BRE",
		academy: "Académie de Rennes",
		academy_value: "RENNES"
	},
	{
		department: "Gard",
		department_value: "30",
		region: "Occitanie",
		region_value: "OCC",
		academy: "Académie de Montpellier",
		academy_value: "MONTPELLIER"
	},
	{
		department: "Haute-Garonne",
		department_value: "31",
		region: "Occitanie",
		region_value: "OCC",
		academy: "Académie de Toulouse",
		academy_value: "TOULOUSE"
	},
	{
		department: "Gers",
		department_value: "32",
		region: "Occitanie",
		region_value: "OCC",
		academy: "Académie de Toulouse",
		academy_value: "TOULOUSE"
	},
	{
		department: "Gironde",
		department_value: "33",
		region: "Nouvelle-Aquitaine",
		region_value: "NAQ",
		academy: "Académie de Bordeaux",
		academy_value: "BORDEAUX"
	},
	{
		department: "Hérault",
		department_value: "34",
		region: "Occitanie",
		region_value: "OCC",
		academy: "Académie de Montpellier",
		academy_value: "MONTPELLIER"
	},
	{
		department: "Ille-et-Vilaine",
		department_value: "35",
		region: "Bretagne",
		region_value: "BRE",
		academy: "Académie de Rennes",
		academy_value: "RENNES"
	},
	{
		department: "Indre",
		department_value: "36",
		region: "Centre-Val de Loire",
		region_value: "CVL",
		academy: "Académie d’Orléans-Tours",
		academy_value: "ORLEANS-TOURS"
	},
	{
		department: "Indre-et-Loire",
		department_value: "37",
		region: "Centre-Val de Loire",
		region_value: "CVL",
		academy: "Académie d’Orléans-Tours",
		academy_value: "ORLEANS-TOURS"
	},
	{
		department: "Isère",
		department_value: "38",
		region: "Auvergne-Rhône-Alpes",
		region_value: "ARA",
		academy: "Académie de Grenoble",
		academy_value: "GRENOBLE"
	},
	{
		department: "Jura",
		department_value: "39",
		region: "Bourgogne-Franche-Comté",
		region_value: "BFC",
		academy: "Académie de Besançon",
		academy_value: "BESANCON"
	},
	{
		department: "Landes",
		department_value: "40",
		region: "Nouvelle-Aquitaine",
		region_value: "NAQ",
		academy: "Académie de Bordeaux",
		academy_value: "BORDEAUX"
	},
	{
		department: "Loir-et-Cher",
		department_value: "41",
		region: "Centre-Val de Loire",
		region_value: "CVL",
		academy: "Académie d’Orléans-Tours",
		academy_value: "ORLEANS-TOURS"
	},
	{
		department: "Loire",
		department_value: "42",
		region: "Auvergne-Rhône-Alpes",
		region_value: "ARA",
		academy: "Académie de Lyon",
		academy_value: "LYON"
	},
	{
		department: "Haute-Loire",
		department_value: "43",
		region: "Auvergne-Rhône-Alpes",
		region_value: "ARA",
		academy: "Académie de Clermont-Ferrand",
		academy_value: "CLERMONT-FERRAND"
	},
	{
		department: "Loire-Atlantique",
		department_value: "44",
		region: "Pays de la Loire",
		region_value: "PDL",
		academy: "Académie de Nantes",
		academy_value: "NANTES"
	},
	{
		department: "Loiret",
		department_value: "45",
		region: "Centre-Val de Loire",
		region_value: "CVL",
		academy: "Académie d’Orléans-Tours",
		academy_value: "ORLEANS-TOURS"
	},
	{
		department: "Lot",
		department_value: "46",
		region: "Occitanie",
		region_value: "OCC",
		academy: "Académie de Toulouse",
		academy_value: "TOULOUSE"
	},
	{
		department: "Lot-et-Garonne",
		department_value: "47",
		region: "Nouvelle-Aquitaine",
		region_value: "NAQ",
		academy: "Académie de Bordeaux",
		academy_value: "BORDEAUX"
	},
	{
		department: "Lozère",
		department_value: "48",
		region: "Occitanie",
		region_value: "OCC",
		academy: "Académie de Montpellier",
		academy_value: "MONTPELLIER"
	},
	{
		department: "Maine-et-Loire",
		department_value: "49",
		region: "Pays de la Loire",
		region_value: "PDL",
		academy: "Académie de Nantes",
		academy_value: "NANTES"
	},
	{
		department: "Manche",
		department_value: "50",
		region: "Normandie",
		region_value: "NOR",
		academy: "Académie de Normandie",
		academy_value: "NORMANDIE"
	},
	{
		department: "Marne",
		department_value: "51",
		region: "Grand Est",
		region_value: "GES",
		academy: "Académie de Reims",
		academy_value: "REIMS"
	},
	{
		department: "Haute-Marne",
		department_value: "52",
		region: "Grand Est",
		region_value: "GES",
		academy: "Académie de Reims",
		academy_value: "REIMS"
	},
	{
		department: "Mayenne",
		department_value: "53",
		region: "Pays de la Loire",
		region_value: "PDL",
		academy: "Académie de Nantes",
		academy_value: "NANTES"
	},
	{
		department: "Meurthe-et-Moselle",
		department_value: "54",
		region: "Grand Est",
		region_value: "GES",
		academy: "Académie de Nancy-Metz",
		academy_value: "NANCY-METZ"
	},
	{
		department: "Meuse",
		department_value: "55",
		region: "Grand Est",
		region_value: "GES",
		academy: "Académie de Nancy-Metz",
		academy_value: "NANCY-METZ"
	},
	{
		department: "Morbihan",
		department_value: "56",
		region: "Bretagne",
		region_value: "BRE",
		academy: "Académie de Rennes",
		academy_value: "RENNES"
	},
	{
		department: "Moselle",
		department_value: "57",
		region: "Grand Est",
		region_value: "GES",
		academy: "Académie de Nancy-Metz",
		academy_value: "NANCY-METZ"
	},
	{
		department: "Nièvre",
		department_value: "58",
		region: "Bourgogne-Franche-Comté",
		region_value: "BFC",
		academy: "Académie de Dijon",
		academy_value: "DIJON"
	},
	{
		department: "Nord",
		department_value: "59",
		region: "Hauts-de-France",
		region_value: "HDF",
		academy: "Académie de Lille",
		academy_value: "LILLE"
	},
	{
		department: "Oise",
		department_value: "60",
		region: "Hauts-de-France",
		region_value: "HDF",
		academy: "Académie d’Amiens",
		academy_value: "AMIENS"
	},
	{
		department: "Orne",
		department_value: "61",
		region: "Normandie",
		region_value: "NOR",
		academy: "Académie de Normandie",
		academy_value: "NORMANDIE"
	},
	{
		department: "Pas-de-Calais",
		department_value: "62",
		region: "Hauts-de-France",
		region_value: "HDF",
		academy: "Académie de Lille",
		academy_value: "LILLE"
	},
	{
		department: "Puy-de-Dôme",
		department_value: "63",
		region: "Auvergne-Rhône-Alpes",
		region_value: "ARA",
		academy: "Académie de Clermont-Ferrand",
		academy_value: "CLERMONT-FERRAND"
	},
	{
		department: "Pyrénées-Atlantiques",
		department_value: "64",
		region: "Nouvelle-Aquitaine",
		region_value: "NAQ",
		academy: "Académie de Bordeaux",
		academy_value: "BORDEAUX"
	},
	{
		department: "Hautes-Pyrénées",
		department_value: "65",
		region: "Occitanie",
		region_value: "OCC",
		academy: "Académie de Toulouse",
		academy_value: "TOULOUSE"
	},
	{
		department: "Pyrénées-Orientales",
		department_value: "66",
		region: "Occitanie",
		region_value: "OCC",
		academy: "Académie de Montpellier",
		academy_value: "MONTPELLIER"
	},
	{
		department: "Bas-Rhin",
		department_value: "67",
		region: "Grand Est",
		region_value: "GES",
		academy: "Académie de Strasbourg",
		academy_value: "STRASBOURG"
	},
	{
		department: "Haut-Rhin",
		department_value: "68",
		region: "Grand Est",
		region_value: "GES",
		academy: "Académie de Strasbourg",
		academy_value: "STRASBOURG"
	},
	{
		department: "Rhône",
		department_value: "69",
		region: "Auvergne-Rhône-Alpes",
		region_value: "ARA",
		academy: "Académie de Lyon",
		academy_value: "LYON"
	},
	{
		department: "Haute-Saône",
		department_value: "70",
		region: "Bourgogne-Franche-Comté",
		region_value: "BFC",
		academy: "Académie de Besançon",
		academy_value: "BESANCON"
	},
	{
		department: "Saône-et-Loire",
		department_value: "71",
		region: "Bourgogne-Franche-Comté",
		region_value: "BFC",
		academy: "Académie de Dijon",
		academy_value: "DIJON"
	},
	{
		department: "Sarthe",
		department_value: "72",
		region: "Pays de la Loire",
		region_value: "PDL",
		academy: "Académie de Nantes",
		academy_value: "NANTES"
	},
	{
		department: "Savoie",
		department_value: "73",
		region: "Auvergne-Rhône-Alpes",
		region_value: "ARA",
		academy: "Académie de Grenoble",
		academy_value: "GRENOBLE"
	},
	{
		department: "Haute-Savoie",
		department_value: "74",
		region: "Auvergne-Rhône-Alpes",
		region_value: "ARA",
		academy: "Académie de Grenoble",
		academy_value: "GRENOBLE"
	},
	{
		department: "Paris",
		department_value: "75",
		region: "Île-de-France",
		region_value: "IDF",
		academy: "Académie de Paris",
		academy_value: "PARIS"
	},
	{
		department: "Seine-Maritime",
		department_value: "76",
		region: "Normandie",
		region_value: "NOR",
		academy: "Académie de Normandie",
		academy_value: "NORMANDIE"
	},
	{
		department: "Seine-et-Marne",
		department_value: "77",
		region: "Île-de-France",
		region_value: "IDF",
		academy: "Académie de Créteil",
		academy_value: "CRETEIL"
	},
	{
		department: "Yvelines",
		department_value: "78",
		region: "Île-de-France",
		region_value: "IDF",
		academy: "Académie de Versailles",
		academy_value: "VERSAILLES"
	},
	{
		department: "Deux-Sèvres",
		department_value: "79",
		region: "Nouvelle-Aquitaine",
		region_value: "NAQ",
		academy: "Académie de Poitiers",
		academy_value: "POITIERS"
	},
	{
		department: "Somme",
		department_value: "80",
		region: "Hauts-de-France",
		region_value: "HDF",
		academy: "Académie d’Amiens",
		academy_value: "AMIENS"
	},
	{
		department: "Tarn",
		department_value: "81",
		region: "Occitanie",
		region_value: "OCC",
		academy: "Académie de Toulouse",
		academy_value: "TOULOUSE"
	},
	{
		department: "Tarn-et-Garonne",
		department_value: "82",
		region: "Occitanie",
		region_value: "OCC",
		academy: "Académie de Toulouse",
		academy_value: "TOULOUSE"
	},
	{
		department: "Var",
		department_value: "83",
		region: "Provence-Alpes-Côte d’Azur",
		region_value: "PAC",
		academy: "Académie de Nice",
		academy_value: "NICE"
	},
	{
		department: "Vaucluse",
		department_value: "84",
		region: "Provence-Alpes-Côte d’Azur",
		region_value: "PAC",
		academy: "Académie d’Aix-Marseille",
		academy_value: "AIX-MARSEILLE"
	},
	{
		department: "Vendée",
		department_value: "85",
		region: "Pays de la Loire",
		region_value: "PDL",
		academy: "Académie de Nantes",
		academy_value: "NANTES"
	},
	{
		department: "Vienne",
		department_value: "86",
		region: "Nouvelle-Aquitaine",
		region_value: "NAQ",
		academy: "Académie de Poitiers",
		academy_value: "POITIERS"
	},
	{
		department: "Haute-Vienne",
		department_value: "87",
		region: "Nouvelle-Aquitaine",
		region_value: "NAQ",
		academy: "Académie de Limoges",
		academy_value: "LIMOGES"
	},
	{
		department: "Vosges",
		department_value: "88",
		region: "Grand Est",
		region_value: "GES",
		academy: "Académie de Nancy-Metz",
		academy_value: "NANCY-METZ"
	},
	{
		department: "Yonne",
		department_value: "89",
		region: "Bourgogne-Franche-Comté",
		region_value: "BFC",
		academy: "Académie de Dijon",
		academy_value: "DIJON"
	},
	{
		department: "Territoire-de-Belfort",
		department_value: "90",
		region: "Bourgogne-Franche-Comté",
		region_value: "BFC",
		academy: "Académie de Besançon",
		academy_value: "BESANCON"
	},
	{
		department: "Essonne",
		department_value: "91",
		region: "Île-de-France",
		region_value: "IDF",
		academy: "Académie de Versailles",
		academy_value: "VERSAILLES"
	},
	{
		department: "Hauts-de-Seine",
		department_value: "92",
		region: "Île-de-France",
		region_value: "IDF",
		academy: "Académie de Versailles",
		academy_value: "VERSAILLES"
	},
	{
		department: "Seine-Saint-Denis",
		department_value: "93",
		region: "Île-de-France",
		region_value: "IDF",
		academy: "Académie de Créteil",
		academy_value: "CRETEIL"
	},
	{
		department: "Val-de-Marne",
		department_value: "94",
		region: "Île-de-France",
		region_value: "IDF",
		academy: "Académie de Créteil",
		academy_value: "CRETEIL"
	},
	{
		department: "Val-d’Oise",
		department_value: "95",
		region: "Île-de-France",
		region_value: "IDF",
		academy: "Académie de Versailles",
		academy_value: "VERSAILLES"
	},
	{
		department: "Guadeloupe",
		department_value: "971",
		region: "Guadeloupe",
		region_value: "971",
		academy: "Académie de Guadeloupe",
		academy_value: "GUADELOUPE"
	},
	{
		department: "Martinique",
		department_value: "972",
		region: "Martinique",
		region_value: "972",
		academy: "Académie de Martinique",
		academy_value: "MARTINIQUE"
	},
	{
		department: "Guyane française",
		department_value: "973",
		region: "Guyane",
		region_value: "973",
		academy: "Académie de Guyane",
		academy_value: "GUYANE"
	},
	{
		department: "La Réunion",
		department_value: "974",
		region: "La Réunion",
		region_value: "974",
		academy: "Académie de La Réunion",
		academy_value: "REUNION"
	},
	{
		department: "Mayotte",
		department_value: "976",
		region: "Mayotte",
		region_value: "976",
		academy: "Académie de Mayotte",
		academy_value: "MAYOTTE"
	}
], Iy = [
	{
		country: "Émirats arabes unis",
		country_value: "AE",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Afghanistan",
		country_value: "AF",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Albanie",
		country_value: "AL",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Arménie",
		country_value: "AM",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Angola",
		country_value: "AO",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Argentine",
		country_value: "AR",
		continent: "Amérique du Sud",
		continent_value: "SA"
	},
	{
		country: "Autriche",
		country_value: "AT",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Australie",
		country_value: "AU",
		continent: "Océanie",
		continent_value: "OC"
	},
	{
		country: "Azerbaïdjan",
		country_value: "AZ",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Bosnie-Herzégovine",
		country_value: "BA",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Bangladesh",
		country_value: "BD",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Belgique",
		country_value: "BE",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Burkina Faso",
		country_value: "BF",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Bulgarie",
		country_value: "BG",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Burundi",
		country_value: "BI",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Bénin",
		country_value: "BJ",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Brunéi Darussalam",
		country_value: "BN",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Bolivie",
		country_value: "BO",
		continent: "Amérique du Sud",
		continent_value: "SA"
	},
	{
		country: "Brésil",
		country_value: "BR",
		continent: "Amérique du Sud",
		continent_value: "SA"
	},
	{
		country: "Bahamas",
		country_value: "BS",
		continent: "Amérique du Nord",
		continent_value: "NA"
	},
	{
		country: "Bhoutan",
		country_value: "BT",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Botswana",
		country_value: "BW",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Biélorussie",
		country_value: "BY",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Belize",
		country_value: "BZ",
		continent: "Amérique du Nord",
		continent_value: "NA"
	},
	{
		country: "Canada",
		country_value: "CA",
		continent: "Amérique du Nord",
		continent_value: "NA"
	},
	{
		country: "République démocratique du Congo",
		country_value: "CD",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "République centrafricaine",
		country_value: "CF",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "République du Congo",
		country_value: "CG",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Suisse",
		country_value: "CH",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Côte d’Ivoire",
		country_value: "CI",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Chili",
		country_value: "CL",
		continent: "Amérique du Sud",
		continent_value: "SA"
	},
	{
		country: "Cameroun",
		country_value: "CM",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Chine",
		country_value: "CN",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Colombie",
		country_value: "CO",
		continent: "Amérique du Sud",
		continent_value: "SA"
	},
	{
		country: "Costa Rica",
		country_value: "CR",
		continent: "Amérique du Nord",
		continent_value: "NA"
	},
	{
		country: "Cuba",
		country_value: "CU",
		continent: "Amérique du Nord",
		continent_value: "NA"
	},
	{
		country: "Chypre",
		country_value: "CY",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Tchéquie",
		country_value: "CZ",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Allemagne",
		country_value: "DE",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Djibouti",
		country_value: "DJ",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Danemark",
		country_value: "DK",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "République dominicaine",
		country_value: "DO",
		continent: "Amérique du Nord",
		continent_value: "NA"
	},
	{
		country: "Algérie",
		country_value: "DZ",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Équateur",
		country_value: "EC",
		continent: "Amérique du Sud",
		continent_value: "SA"
	},
	{
		country: "Estonie",
		country_value: "EE",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Égypte",
		country_value: "EG",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Sahara occidental",
		country_value: "EH",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Érythrée",
		country_value: "ER",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Espagne",
		country_value: "ES",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Éthiopie",
		country_value: "ET",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Finlande",
		country_value: "FI",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Fidji",
		country_value: "FJ",
		continent: "Océanie",
		continent_value: "OC"
	},
	{
		country: "Falkland",
		country_value: "FK",
		continent: "Amérique du Sud",
		continent_value: "SA"
	},
	{
		country: "France",
		country_value: "FR",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Gabon",
		country_value: "GA",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Royaume-Uni",
		country_value: "GB",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Groenland",
		country_value: "GL",
		continent: "Amérique du Nord",
		continent_value: "NA"
	},
	{
		country: "Géorgie",
		country_value: "GE",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Guyane française",
		country_value: "GF",
		continent: "Amérique du Sud",
		continent_value: "SA"
	},
	{
		country: "Ghana",
		country_value: "GH",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Gambie",
		country_value: "GM",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Guinée",
		country_value: "GN",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Guinée équatoriale",
		country_value: "GQ",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Grèce",
		country_value: "GR",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Guatemala",
		country_value: "GT",
		continent: "Amérique du Nord",
		continent_value: "NA"
	},
	{
		country: "Guinée-Bissau",
		country_value: "GW",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Guyana",
		country_value: "GY",
		continent: "Amérique du Sud",
		continent_value: "SA"
	},
	{
		country: "Honduras",
		country_value: "HN",
		continent: "Amérique du Nord",
		continent_value: "NA"
	},
	{
		country: "Croatie",
		country_value: "HR",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Haïti",
		country_value: "HT",
		continent: "Amérique du Nord",
		continent_value: "NA"
	},
	{
		country: "Hongrie",
		country_value: "HU",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Indonésie",
		country_value: "ID",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Irlande",
		country_value: "IE",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Israël",
		country_value: "IL",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Inde",
		country_value: "IN",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Iraq",
		country_value: "IQ",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Iran",
		country_value: "IR",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Islande",
		country_value: "IS",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Italie",
		country_value: "IT",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Jamaïque",
		country_value: "JM",
		continent: "Amérique du Nord",
		continent_value: "NA"
	},
	{
		country: "Jordanie",
		country_value: "JO",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Japon",
		country_value: "JP",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Kenya",
		country_value: "KE",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Kirghizistan",
		country_value: "KG",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Cambodge",
		country_value: "KH",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Corée du Nord",
		country_value: "KP",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Corée du Sud",
		country_value: "KR",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Koweït",
		country_value: "KW",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Kazakhstan",
		country_value: "KZ",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Laos",
		country_value: "LA",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Liban",
		country_value: "LB",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Sri Lanka",
		country_value: "LK",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Libéria",
		country_value: "LR",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Lesotho",
		country_value: "LS",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Lituanie",
		country_value: "LT",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Luxembourg",
		country_value: "LU",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Lettonie",
		country_value: "LV",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Libye",
		country_value: "LY",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Maroc",
		country_value: "MA",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Moldavie",
		country_value: "MD",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Monténégro",
		country_value: "ME",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Madagascar",
		country_value: "MG",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Macédoine du Nord",
		country_value: "MK",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Mali",
		country_value: "ML",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Myanmar",
		country_value: "MM",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Mongolie",
		country_value: "MN",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Mauritanie",
		country_value: "MR",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Malawi",
		country_value: "MW",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Mexique",
		country_value: "MX",
		continent: "Amérique du Nord",
		continent_value: "NA"
	},
	{
		country: "Malaisie",
		country_value: "MY",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Mozambique",
		country_value: "MZ",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Namibie",
		country_value: "NA",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Nouvelle-Calédonie",
		country_value: "NC",
		continent: "Océanie",
		continent_value: "OC"
	},
	{
		country: "Niger",
		country_value: "NE",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Nigéria",
		country_value: "NG",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Nicaragua",
		country_value: "NI",
		continent: "Amérique du Nord",
		continent_value: "NA"
	},
	{
		country: "Pays-Bas",
		country_value: "NL",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Norvège",
		country_value: "NO",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Népal",
		country_value: "NP",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Nouvelle-Zélande",
		country_value: "NZ",
		continent: "Océanie",
		continent_value: "OC"
	},
	{
		country: "Oman",
		country_value: "OM",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Panama",
		country_value: "PA",
		continent: "Amérique du Nord",
		continent_value: "NA"
	},
	{
		country: "Pérou",
		country_value: "PE",
		continent: "Amérique du Sud",
		continent_value: "SA"
	},
	{
		country: "Papouasie-Nouvelle-Guinée",
		country_value: "PG",
		continent: "Océanie",
		continent_value: "OC"
	},
	{
		country: "Philippines",
		country_value: "PH",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Pakistan",
		country_value: "PK",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Pologne",
		country_value: "PL",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Porto Rico",
		country_value: "PR",
		continent: "Amérique du Nord",
		continent_value: "NA"
	},
	{
		country: "Palestine",
		country_value: "PS",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Portugal",
		country_value: "PT",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Paraguay",
		country_value: "PY",
		continent: "Amérique du Sud",
		continent_value: "SA"
	},
	{
		country: "Qatar",
		country_value: "QA",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Roumanie",
		country_value: "RO",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Serbie",
		country_value: "RS",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Russie",
		country_value: "RU",
		continent: "Europe",
		continent_value: "RU"
	},
	{
		country: "Rwanda",
		country_value: "RW",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Arabie saoudite",
		country_value: "SA",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Îles Salomon",
		country_value: "SB",
		continent: "Océanie",
		continent_value: "OC"
	},
	{
		country: "Soudan",
		country_value: "SD",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Suède",
		country_value: "SE",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Slovénie",
		country_value: "SI",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Svalbard et l’Île Jan Mayen",
		country_value: "SJ",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Slovaquie",
		country_value: "SK",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Sierra Leone",
		country_value: "SL",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Sénégal",
		country_value: "SN",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Somalie",
		country_value: "SO",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Suriname",
		country_value: "SR",
		continent: "Amérique du Sud",
		continent_value: "SA"
	},
	{
		country: "Soudan du Sud",
		country_value: "SS",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "El Salvador",
		country_value: "SV",
		continent: "Amérique du Nord",
		continent_value: "NA"
	},
	{
		country: "République arabe syrienne",
		country_value: "SY",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Eswatini",
		country_value: "SZ",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Tchad",
		country_value: "TD",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Terres australes françaises",
		country_value: "TF",
		continent: "Antarctique",
		continent_value: "AN"
	},
	{
		country: "Togo",
		country_value: "TG",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Thaïlande",
		country_value: "TH",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Tadjikistan",
		country_value: "TJ",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Timor-Leste",
		country_value: "TL",
		continent: "Océanie",
		continent_value: "OC"
	},
	{
		country: "Turkménistan",
		country_value: "TM",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Tunisie",
		country_value: "TN",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Turquie",
		country_value: "TR",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Trinité-et-Tobago",
		country_value: "TT",
		continent: "Amérique du Nord",
		continent_value: "NA"
	},
	{
		country: "Taïwan",
		country_value: "TW",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Tanzanie",
		country_value: "TZ",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Ukraine",
		country_value: "UA",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Ouganda",
		country_value: "UG",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "États-Unis d’Amérique",
		country_value: "US",
		continent: "Amérique du Nord",
		continent_value: "NA"
	},
	{
		country: "Uruguay",
		country_value: "UY",
		continent: "Amérique du Sud",
		continent_value: "SA"
	},
	{
		country: "Ouzbékistan",
		country_value: "UZ",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Venezuela",
		country_value: "VE",
		continent: "Amérique du Sud",
		continent_value: "SA"
	},
	{
		country: "Vietnam",
		country_value: "VN",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Vanuatu",
		country_value: "VU",
		continent: "Océanie",
		continent_value: "OC"
	},
	{
		country: "Kosovo",
		country_value: "XK",
		continent: "Europe",
		continent_value: "EU"
	},
	{
		country: "Yémen",
		country_value: "YE",
		continent: "Asie",
		continent_value: "AS"
	},
	{
		country: "Afrique du Sud",
		country_value: "ZA",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Zambie",
		country_value: "ZM",
		continent: "Afrique",
		continent_value: "AF"
	},
	{
		country: "Zimbabwe",
		country_value: "ZW",
		continent: "Afrique",
		continent_value: "AF"
	}
];
//#endregion
//#region src/utils/global.js
J.register(Wv, wv, $v, Yv, L_);
var Ly = (e) => e.charAt(0).toUpperCase() + e.slice(1), Ry = (e) => e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase(), zy = (e) => e == null || e === "" ? "" : isNaN(e) ? e : Number.isInteger(e) ? parseInt(e).toLocaleString("fr-FR") : parseFloat(e).toLocaleString("fr-FR", { maximumFractionDigits: 2 }), By = function() {
	let e = navigator.userAgent || navigator.vendor || window.opera;
	return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0, 4));
}, Vy = (e) => Fy.find((t) => t.department_value === e), Hy = (e) => Fy.find((t) => t.region_value === e), Uy = (e) => Fy.find((t) => t.academy_value === e), Wy = (e) => Iy.find((t) => t.country_value === e), Gy = () => Fy.map((e) => e.department_value), Ky = () => Fy.map((e) => e.region_value), qy = () => Fy.map((e) => e.academy_value), Jy = () => Iy.map((e) => e.country_value), Yy = (e) => Fy.filter((t) => t.region_value === e).map((e) => e.department_value), Xy = (e) => Fy.filter((t) => t.academy_value === e).map((e) => e.department_value), Zy = (e) => Iy.filter((t) => t.continent_value === e).map((e) => e.country_value), Qy = () => {
	J.defaults.font.family = "Marianne", J.defaults.font.size = 12, J.defaults.font.lineHeight = 1.66, J.defaults.color = "#6b6b6b", J.defaults.borderColor = "#cecece";
}, $y = { methods: {
	capitalize: Ly,
	formatNumber: zy
} }, eb = { methods: {
	getDep: Vy,
	getReg: Hy,
	getAca: Uy,
	getCountry: Wy,
	getAllDep: Gy,
	getAllReg: Ky,
	getAllAca: qy,
	getAllCountries: Jy,
	getDepsFromReg: Yy,
	getDepsFromAca: Xy,
	getCountriesFromContinent: Zy
} }, tb = ["id", "aria-labelledby"], nb = { class: "fr-container fr-container--fluid fr-container-md" }, rb = { class: "fr-grid-row fr-grid-row--center" }, ib = { class: "fr-col-12 fr-col-md-8 fr-col-lg-6" }, ab = { class: "fr-modal__body" }, ob = { class: "fr-modal__header" }, sb = ["aria-controls"], cb = { class: "fr-modal__content" }, lb = ["id"], ub = ["innerHTML"], db = {
	__name: "DialogModal",
	props: {
		id: {
			type: String,
			required: !0
		},
		modalTitle: {
			type: String,
			default: ""
		},
		modalContent: {
			type: String,
			default: ""
		}
	},
	setup(e) {
		return (t, n) => (I(), L("dialog", {
			id: "modal-" + e.id,
			"aria-labelledby": "fr-modal-title-modal-" + e.id,
			role: "dialog",
			class: "fr-modal"
		}, [R("div", nb, [R("div", rb, [R("div", ib, [R("div", ab, [R("div", ob, [R("button", {
			class: "fr-btn--close fr-btn",
			title: "Fermer la fenêtre modale",
			"aria-controls": "modal-" + e.id
		}, " Fermer ", 8, sb)]), R("div", cb, [R("h1", {
			id: "fr-modal-title-modal-" + e.id,
			class: "fr-modal__title"
		}, [n[0] ||= R("span", { class: "fr-icon-arrow-right-line fr-icon--lg" }, null, -1), Vo(" " + j(e.modalTitle), 1)], 8, lb), R("div", { innerHTML: e.modalContent }, null, 8, ub)])])])])])], 8, tb));
	}
}, fb = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, pb = ["id"], mb = { class: "fr-p-2w databox_header" }, hb = ["aria-describedby", "title"], gb = ["id"], _b = {
	key: 0,
	class: "fr-text--xs fr-mb-0 fr-text--bold"
}, vb = {
	key: 1,
	class: "fr-text--xs fr-mb-0"
}, yb = { key: 2 }, bb = ["aria-controls", "title"], xb = {
	key: 3,
	class: "fr-translate fr-nav more-actions-menu"
}, Sb = { class: "fr-nav__item fr-nav__item--align-right" }, Cb = ["aria-controls"], wb = ["id"], Tb = { class: "fr-menu__list" }, Eb = { key: 0 }, Db = { key: 1 }, Ob = [
	"id",
	"data-action",
	"data-id",
	"title"
], kb = { class: "fr-px-2w databox_data" }, Ab = {
	key: 0,
	class: "databox_source"
}, jb = { class: "fr-select-group" }, Mb = ["for"], Nb = ["id"], Pb = ["value"], Fb = {
	key: 1,
	class: "databox_tendency"
}, Ib = {
	key: 0,
	class: "fr-text--xs fr-m-0"
}, Lb = ["aria-label"], Rb = {
	key: 1,
	class: "fr-text--xs fr-m-0"
}, zb = {
	class: "fr-badge fr-badge--info fr-badge--no-icon fr-badge--sm fr-ml-1v",
	"aria-label": "Valeur stable"
}, Bb = {
	key: 2,
	class: "fr-text--xs fr-m-0"
}, Vb = ["aria-label"], Hb = { class: "fr-p-2w databox_footer" }, Ub = { class: "fr-text--xs fr-mb-0" }, Wb = {
	key: 0,
	class: "fr-text--xs fr-mb-0"
}, Gb = ["href"], Kb = { key: 1 }, qb = { class: "fr-segmented__elements" }, Jb = { class: "fr-segmented__element" }, Yb = ["id", "name"], Xb = ["for"], Zb = { class: "fr-segmented__element" }, Qb = ["id", "name"], $b = ["for"], ex = { class: "fr-p-2w databox_content" }, tx = { class: "fr-mb-0 text-center" }, nx = {
	key: 0,
	class: "fr-display--xs fr-mb-0 databox_value"
}, rx = ["aria-hidden"], ix = ["id"], ax = ["aria-hidden"], ox = ["id"], sx = ["id"], cx = /* @__PURE__ */ fb({
	__name: "DataBox",
	props: {
		id: {
			type: String,
			required: !0
		},
		name: {
			type: String,
			required: !0
		},
		headingLevel: {
			type: String,
			default: "h3",
			validator: (e) => [
				"h1",
				"h2",
				"h3",
				"h4",
				"h5",
				"h6"
			].includes(e)
		},
		description: {
			type: String,
			default: ""
		},
		tooltipTitle: {
			type: String,
			default: ""
		},
		tooltipContent: {
			type: String,
			default: ""
		},
		modalTitle: {
			type: String,
			default: ""
		},
		modalContent: {
			type: String,
			default: ""
		},
		value: {
			type: [Number, String],
			default: ""
		},
		source: {
			type: String,
			required: !0
		},
		date: {
			type: String,
			required: !0
		},
		linkIa: {
			type: String,
			default: "",
			validator: (e) => e === "" || /^https?:\/\//.test(e)
		},
		textIa: {
			type: String,
			default: ""
		},
		defaultSource: {
			type: String,
			default: null
		},
		trend: {
			type: [Number, String],
			default: null
		},
		segmentedControl: {
			type: [Boolean, String],
			default: !0
		},
		fullscreen: {
			type: [Boolean, String],
			default: !1
		},
		screenshot: {
			type: [Boolean, String],
			default: !1
		},
		download: {
			type: [Boolean, String],
			default: !1
		},
		actions: {
			type: [Array, String],
			default: () => []
		}
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ on([]), r = /* @__PURE__ */ on([]), i = /* @__PURE__ */ on(null), a = /* @__PURE__ */ on("chart");
		yi(async () => {
			await Hn(), n.value = [...document.querySelectorAll(`[databox-id="${t.id}"][databox-type="chart"]`)].map((e) => e.getAttribute("databox-source") || "default"), r.value = [...document.querySelectorAll(`[databox-id="${t.id}"][databox-type="table"]`)].map((e) => e.getAttribute("databox-source") || "global"), i.value = n.value.includes(t.defaultSource) ? t.defaultSource : n.value[0] || r.value[0], a.value = n.value.length > 0 ? "chart" : "table";
		});
		let o = (e) => e.map((e) => ({
			label: e.charAt(0).toUpperCase() + e.slice(1).replace(/-/g, " "),
			value: e
		})), s = Ss(() => typeof t.value == "number" ? t.value.toString() : t.value), c = Ss(() => typeof t.trend == "number" ? t.trend.toString() : t.trend), l = Ss(() => [
			!0,
			"true",
			""
		].includes(t.segmentedControl)), u = Ss(() => [
			!0,
			"true",
			""
		].includes(t.fullscreen)), d = Ss(() => [
			!0,
			"true",
			""
		].includes(t.screenshot)), f = Ss(() => [
			!0,
			"true",
			""
		].includes(t.download)), p = Ss(() => typeof t.actions == "string" ? JSON.parse(t.actions) : t.actions), m = () => {
			let e, a, o = [];
			if (document.querySelector(`[databox-id="${t.id}"][databox-type="table"]`) ? (e = "table", a = document.querySelector(`[databox-id="${t.id}"][databox-type="table"][databox-source="${i.value}"]`), a ||= document.querySelector(`[databox-id="${t.id}"][databox-type="table"]`)) : (e = "chart", a = document.querySelector(`[databox-id="${t.id}"][databox-type="chart"][databox-source="${i.value}"]`), a ||= document.querySelector(`[databox-id="${t.id}"][databox-type="chart"]`)), e === "chart" && n.value.length > 0) {
				let e = JSON.parse(a.getAttribute("x")), t = JSON.parse(a.getAttribute("y")), n = JSON.parse(a.getAttribute("name"));
				o.push(`Indicateur,${n.join(",")}\n`), e[0].forEach((e, n) => {
					o.push(`${e},${t.map((e) => e[n]).join(",")}\n`);
				});
			} else if (e === "table" && r.value.length > 0) {
				if (a.getAttribute("x") && a.getAttribute("y")) {
					let e = JSON.parse(a.getAttribute("x")), t = JSON.parse(a.getAttribute("y")), n = JSON.parse(a.getAttribute("name")), r = a.getAttribute("table-name") ?? "";
					o.push(`${r},${n.join(",")}\n`), e.forEach((e, n) => {
						o.push(`${e},${t.map((e) => e[n]).join(",")}\n`);
					});
				} else if (a.getAttribute("line")) {
					let e = JSON.parse(a.getAttribute("name")), t = JSON.parse(a.getAttribute("line"));
					o.push(`${e.join(",")}\n`), t.forEach((e) => {
						o.push(`${e.join(",")}\n`);
					});
				}
			} else {
				console.warn("No data available to download.");
				return;
			}
			let s = t.name.replace(/[/|\\:*?"<>]/g, " ").trim(), c = new Blob(o, { type: "text/csv" }), l = window.URL.createObjectURL(c), u = document.createElement("a");
			u.href = l, u.download = (s ?? `data-${t.id}-${i.value}`) + ".csv", u.style.display = "none", u.click(), window.URL.revokeObjectURL(l);
		}, h = () => {
			let e = document.getElementById(`container-${t.id}`), n = e.querySelectorAll(`.screenshot-hide-${t.id}`);
			n.forEach((e) => e.style.display = "none");
			let r = e.querySelector(".databox_data"), a = e.querySelector(`#select-${t.id}`), o = e.querySelector(".databox_tendency");
			r.style.display = "block", a && (a.style.boxShadow = "none", a.style.appearance = "none"), o && (o.style.marginTop = "20px"), Zl(e).then((e) => {
				let n = t.name.replace(/[/|\\:*?"<>]/g, " ").trim(), r = document.createElement("a");
				r.href = e, r.download = (n ?? `chart-${t.id}-${i.value}`) + ".png", r.style.display = "none", r.click();
			}).catch((e) => {
				console.error("Erreur lors de la capture d'écran", e);
			}).finally(() => {
				n.forEach((e) => e.style.removeProperty("display")), r.style.removeProperty("display"), a && (a.style.removeProperty("box-shadow"), a.style.removeProperty("appearance")), o && o.style.removeProperty("margin-top");
			});
		};
		return (t, g) => (I(), L("div", {
			id: "container-" + e.id,
			class: "fr-card fr-card--shadow databox"
		}, [
			R("div", mb, [(I(), Ao(ji(e.headingLevel), {
				id: "title-" + e.id,
				class: "fr-h6 fr-mb-0"
			}, {
				default: kr(() => [Vo(j(e.name), 1)]),
				_: 1
			}, 8, ["id"])), R("div", { class: A("flex screenshot-hide-" + e.id) }, [
				e.tooltipTitle || e.tooltipContent ? (I(), L("button", {
					key: 0,
					class: "fr-btn--tooltip fr-btn",
					type: "button",
					"aria-describedby": "tooltip-" + e.id,
					title: "Informations complémentaires sur le graphique " + e.tooltipTitle
				}, " Informations complémentaires sur le graphique ", 8, hb)) : B("", !0),
				e.tooltipTitle || e.tooltipContent ? (I(), L("div", {
					key: 1,
					id: "tooltip-" + e.id,
					class: "fr-tooltip fr-placement",
					role: "tooltip",
					"aria-hidden": "true"
				}, [e.tooltipTitle ? (I(), L("p", _b, j(e.tooltipTitle), 1)) : B("", !0), e.tooltipContent ? (I(), L("p", vb, j(e.tooltipContent), 1)) : B("", !0)], 8, gb)) : B("", !0),
				u.value && e.modalTitle ? (I(), L("div", yb, [R("button", {
					type: "button",
					class: "fr-btn fr-btn--sm fr-icon-fullscreen-line fr-btn--tertiary-no-outline fr-ratio-1x1",
					"data-fr-opened": "false",
					"aria-controls": "modal-" + e.id,
					title: "Afficher la modale " + e.modalTitle
				}, null, 8, bb), (I(), Ao(Qr, { to: "body" }, [z(db, {
					id: e.id,
					"modal-title": e.modalTitle,
					"modal-content": e.modalContent
				}, null, 8, [
					"id",
					"modal-title",
					"modal-content"
				])]))])) : B("", !0),
				d.value || f.value || p.value.length > 0 ? (I(), L("div", xb, [R("div", Sb, [R("button", {
					type: "button",
					class: "fr-btn fr-btn--sm fr-icon-more-line fr-btn--tertiary-no-outline fr-ratio-1x1",
					"aria-controls": "translate-" + e.id,
					"aria-expanded": "false",
					title: "Plus d'actions"
				}, null, 8, Cb), R("div", {
					id: "translate-" + e.id,
					class: "fr-collapse fr-translate__menu fr-menu"
				}, [R("ul", Tb, [
					d.value ? (I(), L("li", Eb, [R("button", {
						type: "button",
						class: "fr-translate__language fr-nav__link",
						title: "Prendre une capture d'écran",
						onClick: g[0] ||= (e) => h()
					}, " Capture d'écran ")])) : B("", !0),
					f.value ? (I(), L("li", Db, [R("button", {
						type: "button",
						class: "fr-translate__language fr-nav__link",
						title: "Télécharger les données en CSV",
						onClick: g[1] ||= (e) => m()
					}, " Télécharger en CSV ")])) : B("", !0),
					(I(!0), L(F, null, Pi(p.value, (t, n) => (I(), L("li", { key: n }, [R("button", {
						id: e.id + "_" + ln(Ry)(t),
						"data-action": ln(Ry)(t),
						"data-id": e.id,
						class: "fr-translate__language fr-nav__link",
						title: t
					}, j(t), 9, Ob)]))), 128))
				])], 8, wb)])])) : B("", !0)
			], 2)]),
			e.description ? (I(), Ao(ji(/<\w+>/.test(e.description) ? "span" : "p"), {
				key: 0,
				class: A([/<\w+>/.test(e.description) ? "" : "fr-text--xs fr-mb-0", "fr-px-2w"]),
				innerHTML: e.description
			}, null, 8, ["class", "innerHTML"])) : B("", !0),
			R("div", kb, [n.value.length > 1 ? (I(), L("div", Ab, [R("div", jb, [R("label", {
				class: "fr-label fr-text--xs fr-mb-0",
				for: "select-" + e.id
			}, " Choisir une source de données ", 8, Mb), jr(R("select", {
				id: "select-" + e.id,
				"onUpdate:modelValue": g[2] ||= (e) => i.value = e,
				name: "select",
				class: "fr-select fr-mt-0"
			}, [(I(!0), L(F, null, Pi(o(n.value), (e) => (I(), L("option", {
				key: e.value,
				value: e.value
			}, j(e.label), 9, Pb))), 128))], 8, Nb), [[vc, i.value]])])])) : B("", !0), c.value ? (I(), L("div", Fb, [c.value.includes("-") ? (I(), L("p", Ib, [g[5] ||= Vo(" En baisse ", -1), R("span", {
				class: "fr-badge fr-badge--error fr-badge--no-icon fr-badge--sm fr-ml-1v",
				"aria-label": "Baisse de " + c.value.replace("-", "").trim()
			}, [R("span", {
				class: A("fr-pr-1v screenshot-hide-" + e.id),
				"aria-hidden": "true"
			}, " ↘ ", 2), Vo(" " + j(c.value.replace("-", "").trim()), 1)], 8, Lb)])) : c.value === "0" ? (I(), L("p", Rb, [g[6] ||= Vo(" Stable ", -1), R("span", zb, [R("span", {
				class: A("fr-pr-1v screenshot-hide-" + e.id),
				"aria-hidden": "true"
			}, " ↔ ", 2), Vo(" " + j(c.value.trim()), 1)])])) : (I(), L("p", Bb, [g[7] ||= Vo(" En hausse ", -1), R("span", {
				class: "fr-badge fr-badge--success fr-badge--no-icon fr-badge--sm fr-ml-1v",
				"aria-label": "Hausse de " + c.value.trim()
			}, [R("span", {
				class: A("fr-pr-1v screenshot-hide-" + e.id),
				"aria-hidden": "true"
			}, " ↗ ", 2), Vo(" " + j(c.value.trim()), 1)], 8, Vb)]))])) : B("", !0)]),
			R("div", Hb, [R("div", null, [R("p", Ub, j(e.source) + ", " + j(e.date), 1), e.textIa ? (I(), L("p", Wb, [g[8] ||= R("span", {
				class: "fr-icon-sparkling-2-line fr-icon--sm",
				"aria-disabled": "true"
			}, null, -1), e.linkIa ? (I(), L("a", {
				key: 0,
				href: e.linkIa,
				target: "_blank",
				rel: "noopener noreferrer"
			}, j(e.textIa), 9, Gb)) : (I(), L("span", Kb, j(e.textIa), 1))])) : B("", !0)]), l.value && n.value.length > 0 ? (I(), L("fieldset", {
				key: 0,
				class: A("fr-segmented fr-segmented--no-legend fr-segmented--sm screenshot-hide-" + e.id)
			}, [g[11] ||= R("legend", { class: "fr-segmented__legend" }, "Choisir votre vue", -1), R("div", qb, [R("div", Jb, [R("input", {
				id: "segmented-chart-" + e.id,
				value: "1",
				type: "radio",
				checked: "",
				name: "segmented-" + e.id,
				onChange: g[3] ||= (e) => a.value = "chart"
			}, null, 40, Yb), R("label", {
				class: "fr-label",
				for: "segmented-chart-" + e.id
			}, [...g[9] ||= [R("span", {
				class: "fr-icon-pie-chart-2-fill fr-icon--sm",
				"aria-hidden": "true"
			}, null, -1), R("span", { class: "fr-sr-only" }, "Vue graphique", -1)]], 8, Xb)]), R("div", Zb, [R("input", {
				id: "segmented-table-" + e.id,
				value: "2",
				type: "radio",
				name: "segmented-" + e.id,
				onChange: g[4] ||= (e) => a.value = "table"
			}, null, 40, Qb), R("label", {
				class: "fr-label",
				for: "segmented-table-" + e.id
			}, [...g[10] ||= [R("span", {
				class: "fr-icon-table-2 fr-icon fr-icon--sm",
				"aria-hidden": "true"
			}, null, -1), R("span", { class: "fr-sr-only" }, "Vue tableau", -1)]], 8, $b)])])], 2)) : B("", !0)]),
			R("div", ex, [
				R("p", tx, [s.value ? (I(), L("strong", nx, j(s.value), 1)) : B("", !0)]),
				s.value ? B("", !0) : (I(), L("div", {
					key: 0,
					class: A(a.value === "table" ? "fr-hidden" : "w-full"),
					"aria-hidden": a.value === "table"
				}, [(I(!0), L(F, null, Pi(n.value, (t, n) => (I(), L("div", {
					id: e.id + "-chart-" + t,
					key: n,
					class: A(i.value === t ? "" : "fr-hidden")
				}, null, 10, ix))), 128))], 10, rx)),
				s.value ? B("", !0) : (I(), L("div", {
					key: 1,
					class: A(a.value === "chart" ? "fr-hidden" : "w-full"),
					"aria-hidden": a.value === "chart"
				}, [(I(!0), L(F, null, Pi(r.value.filter((e) => e !== "global"), (t, n) => (I(), L("div", {
					id: e.id + "-table-" + t,
					key: n,
					class: A(i.value === t ? "" : "fr-hidden")
				}, null, 10, ox))), 128)), r.value.includes("global") ? (I(), L("div", {
					key: 0,
					id: e.id + "-table-global",
					class: A(r.value.includes(i.value) && r.value.length > 1 ? "fr-hidden" : "")
				}, null, 10, sx)) : B("", !0)], 10, ax))
			])
		], 8, pb));
	}
}, [["__scopeId", "data-v-707b4dba"]]), { min: lx, max: ux } = Math, dx = (e, t = 0, n = 1) => lx(ux(t, e), n), fx = (e) => {
	e._clipped = !1, e._unclipped = e.slice(0);
	for (let t = 0; t <= 3; t++) t < 3 ? ((e[t] < 0 || e[t] > 255) && (e._clipped = !0), e[t] = dx(e[t], 0, 255)) : t === 3 && (e[t] = dx(e[t], 0, 1));
	return e;
}, px = {};
for (let e of [
	"Boolean",
	"Number",
	"String",
	"Function",
	"Array",
	"Date",
	"RegExp",
	"Undefined",
	"Null"
]) px[`[object ${e}]`] = e.toLowerCase();
function Y(e) {
	return px[Object.prototype.toString.call(e)] || "object";
}
//#endregion
//#region node_modules/chroma-js/src/utils/unpack.js
var X = (e, t = null) => e.length >= 3 ? Array.prototype.slice.call(e) : Y(e[0]) == "object" && t ? t.split("").filter((t) => e[0][t] !== void 0).map((t) => e[0][t]) : e[0].slice(0), mx = (e) => {
	if (e.length < 2) return null;
	let t = e.length - 1;
	return Y(e[t]) == "string" ? e[t].toLowerCase() : null;
}, { PI: hx, min: gx, max: _x } = Math, vx = (e) => Math.round(e * 100) / 100, yx = (e) => Math.round(e * 100) / 100, bx = hx * 2, xx = hx / 3, Sx = hx / 180, Cx = 180 / hx;
function wx(e) {
	return [...e.slice(0, 3).reverse(), ...e.slice(3)];
}
//#endregion
//#region node_modules/chroma-js/src/io/input.js
var Z = {
	format: {},
	autodetect: []
}, Q = class {
	constructor(...e) {
		let t = this;
		if (Y(e[0]) === "object" && e[0].constructor && e[0].constructor === this.constructor) return e[0];
		let n = mx(e), r = !1;
		if (!n) {
			r = !0, Z.sorted ||= (Z.autodetect = Z.autodetect.sort((e, t) => t.p - e.p), !0);
			for (let t of Z.autodetect) if (n = t.test(...e), n) break;
		}
		if (Z.format[n]) t._rgb = fx(Z.format[n].apply(null, r ? e : e.slice(0, -1)));
		else throw Error("unknown format: " + e);
		t._rgb.length === 3 && t._rgb.push(1);
	}
	toString() {
		return Y(this.hex) == "function" ? this.hex() : `[${this._rgb.join(",")}]`;
	}
}, Tx = "3.2.0", $ = (...e) => new Q(...e);
$.version = Tx;
//#endregion
//#region node_modules/chroma-js/src/colors/w3cx11.js
var Ex = {
	aliceblue: "#f0f8ff",
	antiquewhite: "#faebd7",
	aqua: "#00ffff",
	aquamarine: "#7fffd4",
	azure: "#f0ffff",
	beige: "#f5f5dc",
	bisque: "#ffe4c4",
	black: "#000000",
	blanchedalmond: "#ffebcd",
	blue: "#0000ff",
	blueviolet: "#8a2be2",
	brown: "#a52a2a",
	burlywood: "#deb887",
	cadetblue: "#5f9ea0",
	chartreuse: "#7fff00",
	chocolate: "#d2691e",
	coral: "#ff7f50",
	cornflowerblue: "#6495ed",
	cornsilk: "#fff8dc",
	crimson: "#dc143c",
	cyan: "#00ffff",
	darkblue: "#00008b",
	darkcyan: "#008b8b",
	darkgoldenrod: "#b8860b",
	darkgray: "#a9a9a9",
	darkgreen: "#006400",
	darkgrey: "#a9a9a9",
	darkkhaki: "#bdb76b",
	darkmagenta: "#8b008b",
	darkolivegreen: "#556b2f",
	darkorange: "#ff8c00",
	darkorchid: "#9932cc",
	darkred: "#8b0000",
	darksalmon: "#e9967a",
	darkseagreen: "#8fbc8f",
	darkslateblue: "#483d8b",
	darkslategray: "#2f4f4f",
	darkslategrey: "#2f4f4f",
	darkturquoise: "#00ced1",
	darkviolet: "#9400d3",
	deeppink: "#ff1493",
	deepskyblue: "#00bfff",
	dimgray: "#696969",
	dimgrey: "#696969",
	dodgerblue: "#1e90ff",
	firebrick: "#b22222",
	floralwhite: "#fffaf0",
	forestgreen: "#228b22",
	fuchsia: "#ff00ff",
	gainsboro: "#dcdcdc",
	ghostwhite: "#f8f8ff",
	gold: "#ffd700",
	goldenrod: "#daa520",
	gray: "#808080",
	green: "#008000",
	greenyellow: "#adff2f",
	grey: "#808080",
	honeydew: "#f0fff0",
	hotpink: "#ff69b4",
	indianred: "#cd5c5c",
	indigo: "#4b0082",
	ivory: "#fffff0",
	khaki: "#f0e68c",
	laserlemon: "#ffff54",
	lavender: "#e6e6fa",
	lavenderblush: "#fff0f5",
	lawngreen: "#7cfc00",
	lemonchiffon: "#fffacd",
	lightblue: "#add8e6",
	lightcoral: "#f08080",
	lightcyan: "#e0ffff",
	lightgoldenrod: "#fafad2",
	lightgoldenrodyellow: "#fafad2",
	lightgray: "#d3d3d3",
	lightgreen: "#90ee90",
	lightgrey: "#d3d3d3",
	lightpink: "#ffb6c1",
	lightsalmon: "#ffa07a",
	lightseagreen: "#20b2aa",
	lightskyblue: "#87cefa",
	lightslategray: "#778899",
	lightslategrey: "#778899",
	lightsteelblue: "#b0c4de",
	lightyellow: "#ffffe0",
	lime: "#00ff00",
	limegreen: "#32cd32",
	linen: "#faf0e6",
	magenta: "#ff00ff",
	maroon: "#800000",
	maroon2: "#7f0000",
	maroon3: "#b03060",
	mediumaquamarine: "#66cdaa",
	mediumblue: "#0000cd",
	mediumorchid: "#ba55d3",
	mediumpurple: "#9370db",
	mediumseagreen: "#3cb371",
	mediumslateblue: "#7b68ee",
	mediumspringgreen: "#00fa9a",
	mediumturquoise: "#48d1cc",
	mediumvioletred: "#c71585",
	midnightblue: "#191970",
	mintcream: "#f5fffa",
	mistyrose: "#ffe4e1",
	moccasin: "#ffe4b5",
	navajowhite: "#ffdead",
	navy: "#000080",
	oldlace: "#fdf5e6",
	olive: "#808000",
	olivedrab: "#6b8e23",
	orange: "#ffa500",
	orangered: "#ff4500",
	orchid: "#da70d6",
	palegoldenrod: "#eee8aa",
	palegreen: "#98fb98",
	paleturquoise: "#afeeee",
	palevioletred: "#db7093",
	papayawhip: "#ffefd5",
	peachpuff: "#ffdab9",
	peru: "#cd853f",
	pink: "#ffc0cb",
	plum: "#dda0dd",
	powderblue: "#b0e0e6",
	purple: "#800080",
	purple2: "#7f007f",
	purple3: "#a020f0",
	rebeccapurple: "#663399",
	red: "#ff0000",
	rosybrown: "#bc8f8f",
	royalblue: "#4169e1",
	saddlebrown: "#8b4513",
	salmon: "#fa8072",
	sandybrown: "#f4a460",
	seagreen: "#2e8b57",
	seashell: "#fff5ee",
	sienna: "#a0522d",
	silver: "#c0c0c0",
	skyblue: "#87ceeb",
	slateblue: "#6a5acd",
	slategray: "#708090",
	slategrey: "#708090",
	snow: "#fffafa",
	springgreen: "#00ff7f",
	steelblue: "#4682b4",
	tan: "#d2b48c",
	teal: "#008080",
	thistle: "#d8bfd8",
	tomato: "#ff6347",
	turquoise: "#40e0d0",
	violet: "#ee82ee",
	wheat: "#f5deb3",
	white: "#ffffff",
	whitesmoke: "#f5f5f5",
	yellow: "#ffff00",
	yellowgreen: "#9acd32"
}, Dx = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, Ox = /^#?([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/, kx = (e) => {
	if (e.match(Dx)) {
		(e.length === 4 || e.length === 7) && (e = e.substr(1)), e.length === 3 && (e = e.split(""), e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]);
		let t = parseInt(e, 16);
		return [
			t >> 16,
			t >> 8 & 255,
			t & 255,
			1
		];
	}
	if (e.match(Ox)) {
		(e.length === 5 || e.length === 9) && (e = e.substr(1)), e.length === 4 && (e = e.split(""), e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2] + e[3] + e[3]);
		let t = parseInt(e, 16);
		return [
			t >> 24 & 255,
			t >> 16 & 255,
			t >> 8 & 255,
			Math.round((t & 255) / 255 * 100) / 100
		];
	}
	throw Error(`unknown hex color: ${e}`);
}, { round: Ax } = Math, jx = (...e) => {
	let [t, n, r, i] = X(e, "rgba"), a = mx(e) || "auto";
	i === void 0 && (i = 1), a === "auto" && (a = i < 1 ? "rgba" : "rgb"), t = Ax(t), n = Ax(n), r = Ax(r);
	let o = "000000" + (t << 16 | n << 8 | r).toString(16);
	o = o.substr(o.length - 6);
	let s = "0" + Ax(i * 255).toString(16);
	switch (s = s.substr(s.length - 2), a.toLowerCase()) {
		case "rgba": return `#${o}${s}`;
		case "argb": return `#${s}${o}`;
		default: return `#${o}`;
	}
};
//#endregion
//#region node_modules/chroma-js/src/ops/clipped.js
Q.prototype.name = function() {
	let e = jx(this._rgb, "rgb");
	for (let t of Object.keys(Ex)) if (Ex[t] === e) return t.toLowerCase();
	return e;
}, Z.format.named = (e) => {
	if (e = e.toLowerCase(), Ex[e]) return kx(Ex[e]);
	throw Error("unknown color name: " + e);
}, Z.autodetect.push({
	p: 5,
	test: (e, ...t) => {
		if (!t.length && Y(e) === "string" && Ex[e.toLowerCase()]) return "named";
	}
}), Q.prototype.alpha = function(e, t = !1) {
	return e !== void 0 && Y(e) === "number" ? t ? (this._rgb[3] = e, this) : new Q([
		this._rgb[0],
		this._rgb[1],
		this._rgb[2],
		e
	], "rgb") : this._rgb[3];
}, Q.prototype.clipped = function() {
	return this._rgb._clipped || !1;
};
//#endregion
//#region node_modules/chroma-js/src/io/lab/lab-constants.js
var Mx = {
	Kn: 18,
	labWhitePoint: "d65",
	Xn: .95047,
	Yn: 1,
	Zn: 1.08883,
	t0: .137931034,
	t1: .206896552,
	t2: .12841855,
	t3: .008856452,
	kE: 216 / 24389,
	kKE: 8,
	kK: 24389 / 27,
	RefWhiteRGB: {
		X: .95047,
		Y: 1,
		Z: 1.08883
	},
	MtxRGB2XYZ: {
		m00: .4124564390896922,
		m01: .21267285140562253,
		m02: .0193338955823293,
		m10: .357576077643909,
		m11: .715152155287818,
		m12: .11919202588130297,
		m20: .18043748326639894,
		m21: .07217499330655958,
		m22: .9503040785363679
	},
	MtxXYZ2RGB: {
		m00: 3.2404541621141045,
		m01: -.9692660305051868,
		m02: .055643430959114726,
		m10: -1.5371385127977166,
		m11: 1.8760108454466942,
		m12: -.2040259135167538,
		m20: -.498531409556016,
		m21: .041556017530349834,
		m22: 1.0572251882231791
	},
	As: .9414285350000001,
	Bs: 1.040417467,
	Cs: 1.089532651,
	MtxAdaptMa: {
		m00: .8951,
		m01: -.7502,
		m02: .0389,
		m10: .2664,
		m11: 1.7135,
		m12: -.0685,
		m20: -.1614,
		m21: .0367,
		m22: 1.0296
	},
	MtxAdaptMaI: {
		m00: .9869929054667123,
		m01: .43230526972339456,
		m02: -.008528664575177328,
		m10: -.14705425642099013,
		m11: .5183602715367776,
		m12: .04004282165408487,
		m20: .15996265166373125,
		m21: .0492912282128556,
		m22: .9684866957875502
	}
}, Nx = new Map([
	["a", [1.0985, .35585]],
	["b", [1.0985, .35585]],
	["c", [.98074, 1.18232]],
	["d50", [.96422, .82521]],
	["d55", [.95682, .92149]],
	["d65", [.95047, 1.08883]],
	["e", [
		1,
		1,
		1
	]],
	["f2", [.99186, .67393]],
	["f7", [.95041, 1.08747]],
	["f11", [1.00962, .6435]],
	["icc", [.96422, .82521]]
]);
function Px(e) {
	let t = Nx.get(String(e).toLowerCase());
	if (!t) throw Error("unknown Lab illuminant " + e);
	Mx.labWhitePoint = e, Mx.Xn = t[0], Mx.Zn = t[1];
}
function Fx() {
	return Mx.labWhitePoint;
}
//#endregion
//#region node_modules/chroma-js/src/io/lab/lab2rgb.js
var Ix = (...e) => {
	e = X(e, "lab");
	let [t, n, r] = e, [i, a, o] = Lx(t, n, r), [s, c, l] = zx(i, a, o);
	return [
		s,
		c,
		l,
		e.length > 3 ? e[3] : 1
	];
}, Lx = (e, t, n) => {
	let { kE: r, kK: i, kKE: a, Xn: o, Yn: s, Zn: c } = Mx, l = (e + 16) / 116, u = .002 * t + l, d = l - .005 * n, f = u * u * u, p = d * d * d, m = f > r ? f : (116 * u - 16) / i, h = e > a ? ((e + 16) / 116) ** 3 : e / i, g = p > r ? p : (116 * d - 16) / i;
	return [
		m * o,
		h * s,
		g * c
	];
}, Rx = (e) => {
	let t = Math.sign(e);
	return e = Math.abs(e), (e <= .0031308 ? e * 12.92 : 1.055 * e ** (1 / 2.4) - .055) * t;
}, zx = (e, t, n) => {
	let { MtxAdaptMa: r, MtxAdaptMaI: i, MtxXYZ2RGB: a, RefWhiteRGB: o, Xn: s, Yn: c, Zn: l } = Mx, u = s * r.m00 + c * r.m10 + l * r.m20, d = s * r.m01 + c * r.m11 + l * r.m21, f = s * r.m02 + c * r.m12 + l * r.m22, p = o.X * r.m00 + o.Y * r.m10 + o.Z * r.m20, m = o.X * r.m01 + o.Y * r.m11 + o.Z * r.m21, h = o.X * r.m02 + o.Y * r.m12 + o.Z * r.m22, g = (e * r.m00 + t * r.m10 + n * r.m20) * (p / u), _ = (e * r.m01 + t * r.m11 + n * r.m21) * (m / d), v = (e * r.m02 + t * r.m12 + n * r.m22) * (h / f), y = g * i.m00 + _ * i.m10 + v * i.m20, b = g * i.m01 + _ * i.m11 + v * i.m21, x = g * i.m02 + _ * i.m12 + v * i.m22, S = Rx(y * a.m00 + b * a.m10 + x * a.m20), C = Rx(y * a.m01 + b * a.m11 + x * a.m21), w = Rx(y * a.m02 + b * a.m12 + x * a.m22);
	return [
		S * 255,
		C * 255,
		w * 255
	];
}, Bx = (...e) => {
	let [t, n, r, ...i] = X(e, "rgb"), [a, o, s] = Ux(t, n, r), [c, l, u] = Vx(a, o, s);
	return [
		c,
		l,
		u,
		...i.length > 0 && i[0] < 1 ? [i[0]] : []
	];
};
function Vx(e, t, n) {
	let { Xn: r, Yn: i, Zn: a, kE: o, kK: s } = Mx, c = e / r, l = t / i, u = n / a, d = c > o ? c ** (1 / 3) : (s * c + 16) / 116, f = l > o ? l ** (1 / 3) : (s * l + 16) / 116, p = u > o ? u ** (1 / 3) : (s * u + 16) / 116;
	return [
		116 * f - 16,
		500 * (d - f),
		200 * (f - p)
	];
}
function Hx(e) {
	let t = Math.sign(e);
	return e = Math.abs(e), (e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4) * t;
}
var Ux = (e, t, n) => {
	e = Hx(e / 255), t = Hx(t / 255), n = Hx(n / 255);
	let { MtxRGB2XYZ: r, MtxAdaptMa: i, MtxAdaptMaI: a, Xn: o, Yn: s, Zn: c, As: l, Bs: u, Cs: d } = Mx, f = e * r.m00 + t * r.m10 + n * r.m20, p = e * r.m01 + t * r.m11 + n * r.m21, m = e * r.m02 + t * r.m12 + n * r.m22, h = o * i.m00 + s * i.m10 + c * i.m20, g = o * i.m01 + s * i.m11 + c * i.m21, _ = o * i.m02 + s * i.m12 + c * i.m22, v = f * i.m00 + p * i.m10 + m * i.m20, y = f * i.m01 + p * i.m11 + m * i.m21, b = f * i.m02 + p * i.m12 + m * i.m22;
	return v *= h / l, y *= g / u, b *= _ / d, f = v * a.m00 + y * a.m10 + b * a.m20, p = v * a.m01 + y * a.m11 + b * a.m21, m = v * a.m02 + y * a.m12 + b * a.m22, [
		f,
		p,
		m
	];
};
//#endregion
//#region node_modules/chroma-js/src/ops/get.js
Q.prototype.lab = function() {
	return Bx(this._rgb);
}, Object.assign($, {
	lab: (...e) => new Q(...e, "lab"),
	getLabWhitePoint: Fx,
	setLabWhitePoint: Px
}), Z.format.lab = Ix, Z.autodetect.push({
	p: 2,
	test: (...e) => {
		if (e = X(e, "lab"), Y(e) === "array" && e.length === 3) return "lab";
	}
}), Q.prototype.darken = function(e = 1) {
	let t = this, n = t.lab();
	return n[0] -= Mx.Kn * e, new Q(n, "lab").alpha(t.alpha(), !0);
}, Q.prototype.brighten = function(e = 1) {
	return this.darken(-e);
}, Q.prototype.darker = Q.prototype.darken, Q.prototype.brighter = Q.prototype.brighten, Q.prototype.get = function(e) {
	let [t, n] = e.split("."), r = this[t]();
	if (n) {
		let e = t.indexOf(n) - (t.substr(0, 2) === "ok" ? 2 : 0);
		if (e > -1) return r[e];
		throw Error(`unknown channel ${n} in mode ${t}`);
	} else return r;
};
//#endregion
//#region node_modules/chroma-js/src/ops/luminance.js
var { pow: Wx } = Math, Gx = 1e-7, Kx = 20;
Q.prototype.luminance = function(e, t = "rgb") {
	if (e !== void 0 && Y(e) === "number") {
		if (e === 0) return new Q([
			0,
			0,
			0,
			this._rgb[3]
		], "rgb");
		if (e === 1) return new Q([
			255,
			255,
			255,
			this._rgb[3]
		], "rgb");
		let n = this.luminance(), r = Kx, i = (n, a) => {
			let o = n.interpolate(a, .5, t), s = o.luminance();
			return Math.abs(e - s) < Gx || !r-- ? o : s > e ? i(n, o) : i(o, a);
		};
		return new Q([...(n > e ? i(new Q([
			0,
			0,
			0
		]), this) : i(this, new Q([
			255,
			255,
			255
		]))).rgb(), this._rgb[3]]);
	}
	return qx(...this._rgb.slice(0, 3));
};
var qx = (e, t, n) => (e = Jx(e), t = Jx(t), n = Jx(n), .2126 * e + .7152 * t + .0722 * n), Jx = (e) => (e /= 255, e <= .03928 ? e / 12.92 : Wx((e + .055) / 1.055, 2.4)), Yx = {}, Xx = (e, t, n = .5, ...r) => {
	let i = r[0] || "lrgb";
	if (!Yx[i] && !r.length && (i = Object.keys(Yx)[0]), !Yx[i]) throw Error(`interpolation mode ${i} is not defined`);
	return Y(e) !== "object" && (e = new Q(e)), Y(t) !== "object" && (t = new Q(t)), Yx[i](e, t, n).alpha(e.alpha() + n * (t.alpha() - e.alpha()));
};
//#endregion
//#region node_modules/chroma-js/src/ops/premultiply.js
Q.prototype.mix = Q.prototype.interpolate = function(e, t = .5, ...n) {
	return Xx(this, e, t, ...n);
}, Q.prototype.premultiply = function(e = !1) {
	let t = this._rgb, n = t[3];
	return e ? (this._rgb = [
		t[0] * n,
		t[1] * n,
		t[2] * n,
		n
	], this) : new Q([
		t[0] * n,
		t[1] * n,
		t[2] * n,
		n
	], "rgb");
};
//#endregion
//#region node_modules/chroma-js/src/io/lch/lch2lab.js
var { sin: Zx, cos: Qx } = Math, $x = (...e) => {
	let [t, n, r] = X(e, "lch");
	return isNaN(r) && (r = 0), r *= Sx, [
		t,
		Qx(r) * n,
		Zx(r) * n
	];
}, eS = (...e) => {
	e = X(e, "lch");
	let [t, n, r] = e, [i, a, o] = $x(t, n, r), [s, c, l] = Ix(i, a, o);
	return [
		s,
		c,
		l,
		e.length > 3 ? e[3] : 1
	];
}, tS = (...e) => eS(...wx(X(e, "hcl"))), { sqrt: nS, atan2: rS, round: iS } = Math, aS = (...e) => {
	let [t, n, r] = X(e, "lab"), i = nS(n * n + r * r), a = (rS(r, n) * Cx + 360) % 360;
	return iS(i * 1e4) === 0 && (a = NaN), [
		t,
		i,
		a
	];
}, oS = (...e) => {
	let [t, n, r, ...i] = X(e, "rgb"), [a, o, s] = Bx(t, n, r), [c, l, u] = aS(a, o, s);
	return [
		c,
		l,
		u,
		...i.length > 0 && i[0] < 1 ? [i[0]] : []
	];
};
Q.prototype.lch = function() {
	return oS(this._rgb);
}, Q.prototype.hcl = function() {
	return wx(oS(this._rgb));
}, Object.assign($, {
	lch: (...e) => new Q(...e, "lch"),
	hcl: (...e) => new Q(...e, "hcl")
}), Z.format.lch = eS, Z.format.hcl = tS, ["lch", "hcl"].forEach((e) => Z.autodetect.push({
	p: 2,
	test: (...t) => {
		if (t = X(t, e), Y(t) === "array" && t.length === 3) return e;
	}
})), Q.prototype.saturate = function(e = 1) {
	let t = this, n = t.lch();
	return n[1] += Mx.Kn * e, n[1] < 0 && (n[1] = 0), new Q(n, "lch").alpha(t.alpha(), !0);
}, Q.prototype.desaturate = function(e = 1) {
	return this.saturate(-e);
}, Q.prototype.set = function(e, t, n = !1) {
	let [r, i] = e.split("."), a = this[r]();
	if (i) {
		let e = r.indexOf(i) - (r.substr(0, 2) === "ok" ? 2 : 0);
		if (e > -1) {
			if (Y(t) == "string") switch (t.charAt(0)) {
				case "+":
					a[e] += +t;
					break;
				case "-":
					a[e] += +t;
					break;
				case "*":
					a[e] *= +t.substr(1);
					break;
				case "/":
					a[e] /= +t.substr(1);
					break;
				default: a[e] = +t;
			}
			else if (Y(t) === "number") a[e] = t;
			else throw Error("unsupported value for Color.set");
			let i = new Q(a, r);
			return n ? (this._rgb = i._rgb, this) : i;
		}
		throw Error(`unknown channel ${i} in mode ${r}`);
	} else return a;
}, Q.prototype.tint = function(e = .5, ...t) {
	return Xx(this, "white", e, ...t);
}, Q.prototype.shade = function(e = .5, ...t) {
	return Xx(this, "black", e, ...t);
}, Yx.rgb = (e, t, n) => {
	let r = e._rgb, i = t._rgb;
	return new Q(r[0] + n * (i[0] - r[0]), r[1] + n * (i[1] - r[1]), r[2] + n * (i[2] - r[2]), "rgb");
};
//#endregion
//#region node_modules/chroma-js/src/interpolator/lrgb.js
var { sqrt: sS, pow: cS } = Math;
Yx.lrgb = (e, t, n) => {
	let [r, i, a] = e._rgb, [o, s, c] = t._rgb;
	return new Q(sS(cS(r, 2) * (1 - n) + cS(o, 2) * n), sS(cS(i, 2) * (1 - n) + cS(s, 2) * n), sS(cS(a, 2) * (1 - n) + cS(c, 2) * n), "rgb");
}, Yx.lab = (e, t, n) => {
	let r = e.lab(), i = t.lab();
	return new Q(r[0] + n * (i[0] - r[0]), r[1] + n * (i[1] - r[1]), r[2] + n * (i[2] - r[2]), "lab");
};
//#endregion
//#region node_modules/chroma-js/src/interpolator/_hsx.js
var lS = (e, t, n, r) => {
	let i, a;
	r === "hsl" ? (i = e.hsl(), a = t.hsl()) : r === "hsv" ? (i = e.hsv(), a = t.hsv()) : r === "hcg" ? (i = e.hcg(), a = t.hcg()) : r === "hsi" ? (i = e.hsi(), a = t.hsi()) : r === "lch" || r === "hcl" ? (r = "hcl", i = e.hcl(), a = t.hcl()) : r === "oklch" && (i = e.oklch().reverse(), a = t.oklch().reverse());
	let o, s, c, l, u, d;
	(r.substr(0, 1) === "h" || r === "oklch") && ([o, c, u] = i, [s, l, d] = a);
	let f, p, m, h;
	return !isNaN(o) && !isNaN(s) ? (h = s > o && s - o > 180 ? s - (o + 360) : s < o && o - s > 180 ? s + 360 - o : s - o, p = o + n * h) : isNaN(o) ? isNaN(s) ? p = NaN : (p = s, (u == 1 || u == 0) && r != "hsv" && (f = l)) : (p = o, (d == 1 || d == 0) && r != "hsv" && (f = c)), f === void 0 && (f = c + n * (l - c)), m = u + n * (d - u), r === "oklch" ? new Q([
		m,
		f,
		p
	], r) : new Q([
		p,
		f,
		m
	], r);
}, uS = (e, t, n) => lS(e, t, n, "lch");
Yx.lch = uS, Yx.hcl = uS;
//#endregion
//#region node_modules/chroma-js/src/io/num/num2rgb.js
var dS = (e) => {
	if (Y(e) == "number" && e >= 0 && e <= 16777215) return [
		e >> 16,
		e >> 8 & 255,
		e & 255,
		1
	];
	throw Error("unknown num color: " + e);
}, fS = (...e) => {
	let [t, n, r] = X(e, "rgb");
	return (t << 16) + (n << 8) + r;
};
Q.prototype.num = function() {
	return fS(this._rgb);
}, Object.assign($, { num: (...e) => new Q(...e, "num") }), Z.format.num = dS, Z.autodetect.push({
	p: 5,
	test: (...e) => {
		if (e.length === 1 && Y(e[0]) === "number" && e[0] >= 0 && e[0] <= 16777215) return "num";
	}
}), Yx.num = (e, t, n) => {
	let r = e.num();
	return new Q(r + n * (t.num() - r), "num");
};
//#endregion
//#region node_modules/chroma-js/src/io/hcg/hcg2rgb.js
var { floor: pS } = Math, mS = (...e) => {
	e = X(e, "hcg");
	let [t, n, r] = e, i, a, o;
	r *= 255;
	let s = n * 255;
	if (n === 0) i = a = o = r;
	else {
		t === 360 && (t = 0), t > 360 && (t -= 360), t < 0 && (t += 360), t /= 60;
		let e = pS(t), c = t - e, l = r * (1 - n), u = l + s * (1 - c), d = l + s * c, f = l + s;
		switch (e) {
			case 0:
				[i, a, o] = [
					f,
					d,
					l
				];
				break;
			case 1:
				[i, a, o] = [
					u,
					f,
					l
				];
				break;
			case 2:
				[i, a, o] = [
					l,
					f,
					d
				];
				break;
			case 3:
				[i, a, o] = [
					l,
					u,
					f
				];
				break;
			case 4:
				[i, a, o] = [
					d,
					l,
					f
				];
				break;
			case 5:
				[i, a, o] = [
					f,
					l,
					u
				];
				break;
		}
	}
	return [
		i,
		a,
		o,
		e.length > 3 ? e[3] : 1
	];
}, hS = (...e) => {
	let [t, n, r] = X(e, "rgb"), i = gx(t, n, r), a = _x(t, n, r), o = a - i, s = o * 100 / 255, c = i / (255 - o) * 100, l;
	return o === 0 ? l = NaN : (t === a && (l = (n - r) / o), n === a && (l = 2 + (r - t) / o), r === a && (l = 4 + (t - n) / o), l *= 60, l < 0 && (l += 360)), [
		l,
		s,
		c
	];
};
Q.prototype.hcg = function() {
	return hS(this._rgb);
}, $.hcg = (...e) => new Q(...e, "hcg"), Z.format.hcg = mS, Z.autodetect.push({
	p: 1,
	test: (...e) => {
		if (e = X(e, "hcg"), Y(e) === "array" && e.length === 3) return "hcg";
	}
}), Yx.hcg = (e, t, n) => lS(e, t, n, "hcg");
//#endregion
//#region node_modules/chroma-js/src/io/hsi/hsi2rgb.js
var { cos: gS } = Math, _S = (...e) => {
	e = X(e, "hsi");
	let [t, n, r] = e, i, a, o;
	return isNaN(t) && (t = 0), isNaN(n) && (n = 0), t > 360 && (t -= 360), t < 0 && (t += 360), t /= 360, t < 1 / 3 ? (o = (1 - n) / 3, i = (1 + n * gS(bx * t) / gS(xx - bx * t)) / 3, a = 1 - (o + i)) : t < 2 / 3 ? (t -= 1 / 3, i = (1 - n) / 3, a = (1 + n * gS(bx * t) / gS(xx - bx * t)) / 3, o = 1 - (i + a)) : (t -= 2 / 3, a = (1 - n) / 3, o = (1 + n * gS(bx * t) / gS(xx - bx * t)) / 3, i = 1 - (a + o)), i = dx(r * i * 3), a = dx(r * a * 3), o = dx(r * o * 3), [
		i * 255,
		a * 255,
		o * 255,
		e.length > 3 ? e[3] : 1
	];
}, { min: vS, sqrt: yS, acos: bS } = Math, xS = (...e) => {
	let [t, n, r] = X(e, "rgb");
	t /= 255, n /= 255, r /= 255;
	let i, a = vS(t, n, r), o = (t + n + r) / 3, s = o > 0 ? 1 - a / o : 0;
	return s === 0 ? i = NaN : (i = (t - n + (t - r)) / 2, i /= yS((t - n) * (t - n) + (t - r) * (n - r)), i = bS(i), r > n && (i = bx - i), i /= bx), [
		i * 360,
		s,
		o
	];
};
Q.prototype.hsi = function() {
	return xS(this._rgb);
}, $.hsi = (...e) => new Q(...e, "hsi"), Z.format.hsi = _S, Z.autodetect.push({
	p: 2,
	test: (...e) => {
		if (e = X(e, "hsi"), Y(e) === "array" && e.length === 3) return "hsi";
	}
}), Yx.hsi = (e, t, n) => lS(e, t, n, "hsi");
//#endregion
//#region node_modules/chroma-js/src/io/hsl/hsl2rgb.js
var SS = (...e) => {
	e = X(e, "hsl");
	let [t, n, r] = e, i, a, o;
	if (n === 0) i = a = o = r * 255;
	else {
		let e = [
			0,
			0,
			0
		], s = [
			0,
			0,
			0
		], c = r < .5 ? r * (1 + n) : r + n - r * n, l = 2 * r - c, u = t / 360;
		e[0] = u + 1 / 3, e[1] = u, e[2] = u - 1 / 3;
		for (let t = 0; t < 3; t++) e[t] < 0 && (e[t] += 1), e[t] > 1 && --e[t], 6 * e[t] < 1 ? s[t] = l + (c - l) * 6 * e[t] : 2 * e[t] < 1 ? s[t] = c : 3 * e[t] < 2 ? s[t] = l + (c - l) * (2 / 3 - e[t]) * 6 : s[t] = l;
		[i, a, o] = [
			s[0] * 255,
			s[1] * 255,
			s[2] * 255
		];
	}
	return e.length > 3 ? [
		i,
		a,
		o,
		e[3]
	] : [
		i,
		a,
		o,
		1
	];
}, CS = (...e) => {
	e = X(e, "rgba");
	let [t, n, r] = e;
	t /= 255, n /= 255, r /= 255;
	let i = gx(t, n, r), a = _x(t, n, r), o = (a + i) / 2, s, c;
	return a === i ? (s = 0, c = NaN) : s = o < .5 ? (a - i) / (a + i) : (a - i) / (2 - a - i), t == a ? c = (n - r) / (a - i) : n == a ? c = 2 + (r - t) / (a - i) : r == a && (c = 4 + (t - n) / (a - i)), c *= 60, c < 0 && (c += 360), e.length > 3 && e[3] !== void 0 ? [
		c,
		s,
		o,
		e[3]
	] : [
		c,
		s,
		o
	];
};
Q.prototype.hsl = function() {
	return CS(this._rgb);
}, $.hsl = (...e) => new Q(...e, "hsl"), Z.format.hsl = SS, Z.autodetect.push({
	p: 2,
	test: (...e) => {
		if (e = X(e, "hsl"), Y(e) === "array" && e.length === 3) return "hsl";
	}
}), Yx.hsl = (e, t, n) => lS(e, t, n, "hsl");
//#endregion
//#region node_modules/chroma-js/src/io/hsv/hsv2rgb.js
var { floor: wS } = Math, TS = (...e) => {
	e = X(e, "hsv");
	let [t, n, r] = e, i, a, o;
	if (r *= 255, n === 0) i = a = o = r;
	else {
		t === 360 && (t = 0), t > 360 && (t -= 360), t < 0 && (t += 360), t /= 60;
		let e = wS(t), s = t - e, c = r * (1 - n), l = r * (1 - n * s), u = r * (1 - n * (1 - s));
		switch (e) {
			case 0:
				[i, a, o] = [
					r,
					u,
					c
				];
				break;
			case 1:
				[i, a, o] = [
					l,
					r,
					c
				];
				break;
			case 2:
				[i, a, o] = [
					c,
					r,
					u
				];
				break;
			case 3:
				[i, a, o] = [
					c,
					l,
					r
				];
				break;
			case 4:
				[i, a, o] = [
					u,
					c,
					r
				];
				break;
			case 5:
				[i, a, o] = [
					r,
					c,
					l
				];
				break;
		}
	}
	return [
		i,
		a,
		o,
		e.length > 3 ? e[3] : 1
	];
}, { min: ES, max: DS } = Math, OS = (...e) => {
	e = X(e, "rgb");
	let [t, n, r] = e, i = ES(t, n, r), a = DS(t, n, r), o = a - i, s, c, l;
	return l = a / 255, a === 0 ? (s = NaN, c = 0) : (c = o / a, t === a && (s = (n - r) / o), n === a && (s = 2 + (r - t) / o), r === a && (s = 4 + (t - n) / o), s *= 60, s < 0 && (s += 360)), [
		s,
		c,
		l
	];
};
Q.prototype.hsv = function() {
	return OS(this._rgb);
}, $.hsv = (...e) => new Q(...e, "hsv"), Z.format.hsv = TS, Z.autodetect.push({
	p: 2,
	test: (...e) => {
		if (e = X(e, "hsv"), Y(e) === "array" && e.length === 3) return "hsv";
	}
}), Yx.hsv = (e, t, n) => lS(e, t, n, "hsv");
//#endregion
//#region node_modules/chroma-js/src/utils/multiply-matrices.js
function kS(e, t) {
	let n = e.length;
	Array.isArray(e[0]) || (e = [e]), Array.isArray(t[0]) || (t = t.map((e) => [e]));
	let r = t[0].length, i = t[0].map((e, n) => t.map((e) => e[n])), a = e.map((e) => i.map((t) => Array.isArray(e) ? e.reduce((e, n, r) => e + n * (t[r] || 0), 0) : t.reduce((t, n) => t + n * e, 0)));
	return n === 1 && (a = a[0]), r === 1 ? a.map((e) => e[0]) : a;
}
//#endregion
//#region node_modules/chroma-js/src/io/oklab/oklab2rgb.js
var AS = (...e) => {
	e = X(e, "lab");
	let [t, n, r, ...i] = e, [a, o, s] = jS([
		t,
		n,
		r
	]), [c, l, u] = zx(a, o, s);
	return [
		c,
		l,
		u,
		...i.length > 0 && i[0] < 1 ? [i[0]] : []
	];
};
function jS(e) {
	return kS([
		[
			1.2268798758459243,
			-.5578149944602171,
			.2813910456659647
		],
		[
			-.0405757452148008,
			1.112286803280317,
			-.0717110580655164
		],
		[
			-.0763729366746601,
			-.4214933324022432,
			1.5869240198367816
		]
	], kS([
		[
			1,
			.3963377773761749,
			.2158037573099136
		],
		[
			1,
			-.1055613458156586,
			-.0638541728258133
		],
		[
			1,
			-.0894841775298119,
			-1.2914855480194092
		]
	], e).map((e) => e ** 3));
}
//#endregion
//#region node_modules/chroma-js/src/io/oklab/rgb2oklab.js
var MS = (...e) => {
	let [t, n, r, ...i] = X(e, "rgb");
	return [...NS(Ux(t, n, r)), ...i.length > 0 && i[0] < 1 ? [i[0]] : []];
};
function NS(e) {
	return kS([
		[
			.210454268309314,
			.7936177747023054,
			-.0040720430116193
		],
		[
			1.9779985324311684,
			-2.42859224204858,
			.450593709617411
		],
		[
			.0259040424655478,
			.7827717124575296,
			-.8086757549230774
		]
	], kS([
		[
			.819022437996703,
			.3619062600528904,
			-.1288737815209879
		],
		[
			.0329836539323885,
			.9292868615863434,
			.0361446663506424
		],
		[
			.0481771893596242,
			.2642395317527308,
			.6335478284694309
		]
	], e).map((e) => Math.cbrt(e)));
}
Q.prototype.oklab = function() {
	return MS(this._rgb);
}, Object.assign($, { oklab: (...e) => new Q(...e, "oklab") }), Z.format.oklab = AS, Z.autodetect.push({
	p: 2,
	test: (...e) => {
		if (e = X(e, "oklab"), Y(e) === "array" && e.length === 3) return "oklab";
	}
}), Yx.oklab = (e, t, n) => {
	let r = e.oklab(), i = t.oklab();
	return new Q(r[0] + n * (i[0] - r[0]), r[1] + n * (i[1] - r[1]), r[2] + n * (i[2] - r[2]), "oklab");
}, Yx.oklch = (e, t, n) => lS(e, t, n, "oklch");
//#endregion
//#region node_modules/chroma-js/src/generator/average.js
var { pow: PS, sqrt: FS, PI: IS, cos: LS, sin: RS, atan2: zS } = Math, BS = (e, t = "lrgb", n = null) => {
	let r = e.length;
	n ||= Array.from(Array(r)).map(() => 1);
	let i = r / n.reduce(function(e, t) {
		return e + t;
	});
	if (n.forEach((e, t) => {
		n[t] *= i;
	}), e = e.map((e) => new Q(e)), t === "lrgb") return VS(e, n);
	let a = e.shift(), o = a.get(t), s = [], c = 0, l = 0;
	for (let e = 0; e < o.length; e++) if (o[e] = (o[e] || 0) * n[0], s.push(isNaN(o[e]) ? 0 : n[0]), t.charAt(e) === "h" && !isNaN(o[e])) {
		let t = o[e] / 180 * IS;
		c += LS(t) * n[0], l += RS(t) * n[0];
	}
	let u = a.alpha() * n[0];
	e.forEach((e, r) => {
		let i = e.get(t);
		u += e.alpha() * n[r + 1];
		for (let e = 0; e < o.length; e++) if (!isNaN(i[e])) if (s[e] += n[r + 1], t.charAt(e) === "h") {
			let t = i[e] / 180 * IS;
			c += LS(t) * n[r + 1], l += RS(t) * n[r + 1];
		} else o[e] += i[e] * n[r + 1];
	});
	for (let e = 0; e < o.length; e++) if (t.charAt(e) === "h") {
		let t = zS(l / s[e], c / s[e]) / IS * 180;
		for (; t < 0;) t += 360;
		for (; t >= 360;) t -= 360;
		o[e] = t;
	} else o[e] = o[e] / s[e];
	return u /= r, new Q(o, t).alpha(u > .99999 ? 1 : u, !0);
}, VS = (e, t) => {
	let n = e.length, r = [
		0,
		0,
		0,
		0
	];
	for (let i = 0; i < e.length; i++) {
		let a = e[i], o = t[i] / n, s = a._rgb;
		r[0] += PS(s[0], 2) * o, r[1] += PS(s[1], 2) * o, r[2] += PS(s[2], 2) * o, r[3] += s[3] * o;
	}
	return r[0] = FS(r[0]), r[1] = FS(r[1]), r[2] = FS(r[2]), r[3] > .9999999 && (r[3] = 1), new Q(fx(r));
}, { pow: HS } = Math;
function US(e) {
	let t = "rgb", n = $("#ccc"), r = 0, i = [0, 1], a = [0, 1], o = [], s = [0, 0], c = !1, l = [], u = !1, d = 0, f = 1, p = !1, m = {}, h = !0, g = 1, _ = function(e) {
		if (e ||= ["#fff", "#000"], e && Y(e) === "string" && $.brewer && $.brewer[e.toLowerCase()] && (e = $.brewer[e.toLowerCase()]), Y(e) === "array") {
			e.length === 1 && (e = [e[0], e[0]]), e = e.slice(0);
			for (let t = 0; t < e.length; t++) e[t] = $(e[t]);
			o.length = 0;
			for (let t = 0; t < e.length; t++) o.push(t / (e.length - 1));
		}
		return S(), l = e;
	}, v = function(e) {
		if (c != null) {
			let t = c.length - 1, n = 0;
			for (; n < t && e >= c[n];) n++;
			return n - 1;
		}
		return 0;
	}, y = (e) => e, b = (e) => e, x = function(e, r) {
		let i, a;
		if (r ??= !1, isNaN(e) || e === null) return n;
		a = r ? e : c && c.length > 2 ? v(e) / (c.length - 2) : f === d ? 1 : (e - d) / (f - d), a = b(a), r || (a = y(a)), g !== 1 && (a = HS(a, g)), a = s[0] + a * (1 - s[0] - s[1]), a = dx(a, 0, 1);
		let u = Math.floor(a * 1e4);
		if (h && m[u]) i = m[u];
		else {
			if (Y(l) === "array") for (let e = 0; e < o.length; e++) {
				let n = o[e];
				if (a <= n) {
					i = l[e];
					break;
				}
				if (a >= n && e === o.length - 1) {
					i = l[e];
					break;
				}
				if (a > n && a < o[e + 1]) {
					a = (a - n) / (o[e + 1] - n), i = $.interpolate(l[e], l[e + 1], a, t);
					break;
				}
			}
			else Y(l) === "function" && (i = l(a));
			h && (m[u] = i);
		}
		return i;
	};
	var S = () => m = {};
	_(e);
	let C = function(e) {
		let t = $(x(e));
		return u && t[u] ? t[u]() : t;
	};
	return C.classes = function(e) {
		if (e != null) {
			if (Y(e) === "array") c = e, i = [e[0], e[e.length - 1]];
			else {
				let t = $.analyze(i);
				c = e === 0 ? [t.min, t.max] : $.limits(t, "e", e);
			}
			return C;
		}
		return c;
	}, C.domain = function(e) {
		if (!arguments.length) return a;
		a = e.slice(0), d = e[0], f = e[e.length - 1], o = [];
		let t = l.length;
		if (e.length === t && d !== f) for (let t of Array.from(e)) o.push((t - d) / (f - d));
		else {
			for (let e = 0; e < t; e++) o.push(e / (t - 1));
			if (e.length > 2) {
				let t = e.map((t, n) => n / (e.length - 1)), n = e.map((e) => (e - d) / (f - d));
				n.every((e, n) => t[n] === e) || (b = (e) => {
					if (e <= 0 || e >= 1) return e;
					let r = 0;
					for (; e >= n[r + 1];) r++;
					let i = (e - n[r]) / (n[r + 1] - n[r]);
					return t[r] + i * (t[r + 1] - t[r]);
				});
			}
		}
		return i = [d, f], C;
	}, C.mode = function(e) {
		return arguments.length ? (t = e, S(), C) : t;
	}, C.range = function(e, t) {
		return _(e, t), C;
	}, C.out = function(e) {
		return u = e, C;
	}, C.spread = function(e) {
		return arguments.length ? (r = e, C) : r;
	}, C.correctLightness = function(e) {
		return e ??= !0, p = e, S(), y = p ? function(e) {
			let t = x(0, !0).lab()[0], n = x(1, !0).lab()[0], r = t > n, i = x(e, !0).lab()[0], a = t + (n - t) * e, o = i - a, s = 0, c = 1, l = 20;
			for (; Math.abs(o) > .01 && l-- > 0;) (function() {
				return r && (o *= -1), o < 0 ? (s = e, e += (c - e) * .5) : (c = e, e += (s - e) * .5), i = x(e, !0).lab()[0], o = i - a;
			})();
			return e;
		} : (e) => e, C;
	}, C.padding = function(e) {
		return e == null ? s : (Y(e) === "number" && (e = [e, e]), s = e, C);
	}, C.colors = function(t, n) {
		arguments.length < 2 && (n = "hex");
		let r = [];
		if (arguments.length === 0) r = l.slice(0);
		else if (t === 1) r = [C(.5)];
		else if (t > 1) {
			let e = i[0], n = i[1] - e;
			r = WS(0, t, !1).map((r) => C(e + r / (t - 1) * n));
		} else {
			e = [];
			let t = [];
			if (c && c.length > 2) for (let e = 1, n = c.length, r = 1 <= n; r ? e < n : e > n; r ? e++ : e--) t.push((c[e - 1] + c[e]) * .5);
			else t = i;
			r = t.map((e) => C(e));
		}
		return $[n] && (r = r.map((e) => e[n]())), r;
	}, C.cache = function(e) {
		return e == null ? h : (h = e, C);
	}, C.gamma = function(e) {
		return e == null ? g : (g = e, C);
	}, C.nodata = function(e) {
		return e == null ? n : (n = $(e), C);
	}, C;
}
function WS(e, t, n) {
	let r = [], i = e < t, a = n ? i ? t + 1 : t - 1 : t;
	for (let t = e; i ? t < a : t > a; i ? t++ : t--) r.push(t);
	return r;
}
//#endregion
//#region node_modules/chroma-js/src/generator/bezier.js
var GS = function(e) {
	let t = [1, 1];
	for (let n = 1; n < e; n++) {
		let e = [1];
		for (let n = 1; n <= t.length; n++) e[n] = (t[n] || 0) + t[n - 1];
		t = e;
	}
	return t;
}, KS = function(e) {
	let t, n, r, i;
	if (e = e.map((e) => new Q(e)), e.length === 2) [n, r] = e.map((e) => e.lab()), t = function(e) {
		return new Q([
			0,
			1,
			2
		].map((t) => n[t] + e * (r[t] - n[t])), "lab");
	};
	else if (e.length === 3) [n, r, i] = e.map((e) => e.lab()), t = function(e) {
		return new Q([
			0,
			1,
			2
		].map((t) => (1 - e) * (1 - e) * n[t] + 2 * (1 - e) * e * r[t] + e * e * i[t]), "lab");
	};
	else if (e.length === 4) {
		let a;
		[n, r, i, a] = e.map((e) => e.lab()), t = function(e) {
			return new Q([
				0,
				1,
				2
			].map((t) => (1 - e) * (1 - e) * (1 - e) * n[t] + 3 * (1 - e) * (1 - e) * e * r[t] + 3 * (1 - e) * e * e * i[t] + e * e * e * a[t]), "lab");
		};
	} else if (e.length >= 5) {
		let n, r, i;
		n = e.map((e) => e.lab()), i = e.length - 1, r = GS(i), t = function(e) {
			let t = 1 - e;
			return new Q([
				0,
				1,
				2
			].map((a) => n.reduce((n, o, s) => n + r[s] * t ** (i - s) * e ** s * o[a], 0)), "lab");
		};
	} else throw RangeError("No point in running bezier with only one color.");
	return t;
}, qS = (e) => {
	let t = KS(e);
	return t.scale = () => US(t), t;
}, { round: JS } = Math;
Q.prototype.rgb = function(e = !0) {
	return e === !1 ? this._rgb.slice(0, 3) : this._rgb.slice(0, 3).map(JS);
}, Q.prototype.rgba = function(e = !0) {
	return this._rgb.slice(0, 4).map((t, n) => n < 3 ? e === !1 ? t : JS(t) : t);
}, Object.assign($, { rgb: (...e) => new Q(...e, "rgb") }), Z.format.rgb = (...e) => {
	let t = X(e, "rgba");
	return t[3] === void 0 && (t[3] = 1), t;
}, Z.autodetect.push({
	p: 3,
	test: (...e) => {
		if (e = X(e, "rgba"), Y(e) === "array" && (e.length === 3 || e.length === 4 && Y(e[3]) == "number" && e[3] >= 0 && e[3] <= 1)) return "rgb";
	}
});
//#endregion
//#region node_modules/chroma-js/src/generator/blend.js
var YS = (e, t, n) => {
	if (!YS[n]) throw Error("unknown blend mode " + n);
	return YS[n](e, t);
}, XS = (e) => (t, n) => {
	let r = $(n).rgb(), i = $(t).rgb();
	return $.rgb(e(r, i));
}, ZS = (e) => (t, n) => {
	let r = [];
	return r[0] = e(t[0], n[0]), r[1] = e(t[1], n[1]), r[2] = e(t[2], n[2]), r;
};
YS.normal = XS(ZS((e) => e)), YS.multiply = XS(ZS((e, t) => e * t / 255)), YS.screen = XS(ZS((e, t) => 255 * (1 - (1 - e / 255) * (1 - t / 255)))), YS.overlay = XS(ZS((e, t) => t < 128 ? 2 * e * t / 255 : 255 * (1 - 2 * (1 - e / 255) * (1 - t / 255)))), YS.darken = XS(ZS((e, t) => e > t ? t : e)), YS.lighten = XS(ZS((e, t) => e > t ? e : t)), YS.dodge = XS(ZS((e, t) => e === 255 ? 255 : (e = t / 255 * 255 / (1 - e / 255), e > 255 ? 255 : e))), YS.burn = XS(ZS((e, t) => 255 * (1 - (1 - t / 255) / (e / 255))));
//#endregion
//#region node_modules/chroma-js/src/generator/cubehelix.js
var { pow: QS, sin: $S, cos: eC } = Math;
function tC(e = 300, t = -1.5, n = 1, r = 1, i = [0, 1]) {
	let a = 0, o;
	Y(i) === "array" ? o = i[1] - i[0] : (o = 0, i = [i, i]);
	let s = function(s) {
		let c = bx * ((e + 120) / 360 + t * s), l = QS(i[0] + o * s, r), u = (a === 0 ? n : n[0] + s * a) * l * (1 - l) / 2, d = eC(c), f = $S(c), p = l + u * (-.14861 * d + 1.78277 * f), m = l + u * (-.29227 * d - .90649 * f), h = l + 1.97294 * d * u;
		return $(fx([
			p * 255,
			m * 255,
			h * 255,
			1
		]));
	};
	return s.start = function(t) {
		return t == null ? e : (e = t, s);
	}, s.rotations = function(e) {
		return e == null ? t : (t = e, s);
	}, s.gamma = function(e) {
		return e == null ? r : (r = e, s);
	}, s.hue = function(e) {
		return e == null ? n : (n = e, Y(n) === "array" ? (a = n[1] - n[0], a === 0 && (n = n[1])) : a = 0, s);
	}, s.lightness = function(e) {
		return e == null ? i : (Y(e) === "array" ? (i = e, o = e[1] - e[0]) : (i = [e, e], o = 0), s);
	}, s.scale = () => $.scale(s), s.hue(n), s;
}
//#endregion
//#region node_modules/chroma-js/src/generator/random.js
var nC = "0123456789abcdef", { floor: rC, random: iC } = Math, aC = (e = iC) => {
	let t = "#";
	for (let n = 0; n < 6; n++) t += nC.charAt(rC(e() * 16));
	return new Q(t, "hex");
}, { log: oC, pow: sC, floor: cC, abs: lC } = Math;
function uC(e, t = null) {
	let n = {
		min: Number.MAX_VALUE,
		max: Number.MAX_VALUE * -1,
		sum: 0,
		values: [],
		count: 0
	};
	return Y(e) === "object" && (e = Object.values(e)), e.forEach((e) => {
		t && Y(e) === "object" && (e = e[t]), e != null && !isNaN(e) && (n.values.push(e), n.sum += e, e < n.min && (n.min = e), e > n.max && (n.max = e), n.count += 1);
	}), n.domain = [n.min, n.max], n.limits = (e, t) => dC(n, e, t), n;
}
function dC(e, t = "equal", n = 7) {
	Y(e) == "array" && (e = uC(e));
	let { min: r, max: i } = e, a = e.values.sort((e, t) => e - t);
	if (n === 1) return [r, i];
	let o = [];
	if (t.substr(0, 1) === "c" && (o.push(r), o.push(i)), t.substr(0, 1) === "e") {
		o.push(r);
		for (let e = 1; e < n; e++) o.push(r + e / n * (i - r));
		o.push(i);
	} else if (t.substr(0, 1) === "l") {
		if (r <= 0) throw Error("Logarithmic scales are only possible for values > 0");
		let e = Math.LOG10E * oC(r), t = Math.LOG10E * oC(i);
		o.push(r);
		for (let r = 1; r < n; r++) o.push(sC(10, e + r / n * (t - e)));
		o.push(i);
	} else if (t.substr(0, 1) === "q") {
		o.push(r);
		for (let e = 1; e < n; e++) {
			let t = (a.length - 1) * e / n, r = cC(t);
			if (r === t) o.push(a[r]);
			else {
				let e = t - r;
				o.push(a[r] * (1 - e) + a[r + 1] * e);
			}
		}
		o.push(i);
	} else if (t.substr(0, 1) === "k") {
		let e, t = a.length, s = Array(t), c = Array(n), l = !0, u = 0, d = null;
		d = [], d.push(r);
		for (let e = 1; e < n; e++) d.push(r + e / n * (i - r));
		for (d.push(i); l;) {
			for (let e = 0; e < n; e++) c[e] = 0;
			for (let e = 0; e < t; e++) {
				let t = a[e], r = Number.MAX_VALUE, i;
				for (let a = 0; a < n; a++) {
					let n = lC(d[a] - t);
					n < r && (r = n, i = a), c[i]++, s[e] = i;
				}
			}
			let r = Array(n);
			for (let e = 0; e < n; e++) r[e] = null;
			for (let n = 0; n < t; n++) e = s[n], r[e] === null ? r[e] = a[n] : r[e] += a[n];
			for (let e = 0; e < n; e++) r[e] *= 1 / c[e];
			l = !1;
			for (let e = 0; e < n; e++) if (r[e] !== d[e]) {
				l = !0;
				break;
			}
			d = r, u++, u > 200 && (l = !1);
		}
		let f = {};
		for (let e = 0; e < n; e++) f[e] = [];
		for (let n = 0; n < t; n++) e = s[n], f[e].push(a[n]);
		let p = [];
		for (let e = 0; e < n; e++) p.push(f[e][0]), p.push(f[e][f[e].length - 1]);
		p = p.sort((e, t) => e - t), o.push(p[0]);
		for (let e = 1; e < p.length; e += 2) {
			let t = p[e];
			!isNaN(t) && o.indexOf(t) === -1 && o.push(t);
		}
	}
	return o;
}
//#endregion
//#region node_modules/chroma-js/src/utils/contrast.js
var fC = (e, t) => {
	e = new Q(e), t = new Q(t);
	let n = e.luminance(), r = t.luminance();
	return n > r ? (n + .05) / (r + .05) : (r + .05) / (n + .05);
}, pC = .027, mC = 5e-4, hC = .1, gC = 1.14, _C = .022, vC = 1.414, yC = (e, t) => {
	e = new Q(e), t = new Q(t), e.alpha() < 1 && (e = Xx(t, e, e.alpha(), "rgb"));
	let n = bC(...e.rgb()), r = bC(...t.rgb()), i = n >= _C ? n : n + (_C - n) ** +vC, a = r >= _C ? r : r + (_C - r) ** +vC, o = a ** .56 - i ** .57, s = a ** .65 - i ** .62, c = Math.abs(a - i) < mC ? 0 : i < a ? o * gC : s * gC;
	return (Math.abs(c) < hC ? 0 : c > 0 ? c - pC : c + pC) * 100;
};
function bC(e, t, n) {
	return .2126729 * (e / 255) ** 2.4 + .7151522 * (t / 255) ** 2.4 + .072175 * (n / 255) ** 2.4;
}
//#endregion
//#region node_modules/chroma-js/src/utils/delta-e.js
var { sqrt: xC, pow: SC, min: CC, max: wC, atan2: TC, abs: EC, cos: DC, sin: OC, exp: kC, PI: AC } = Math;
function jC(e, t, n = 1, r = 1, i = 1) {
	var a = function(e) {
		return 360 * e / (2 * AC);
	}, o = function(e) {
		return 2 * AC * e / 360;
	};
	e = new Q(e), t = new Q(t);
	let [s, c, l] = Array.from(e.lab()), [u, d, f] = Array.from(t.lab()), p = (s + u) / 2, m = (xC(SC(c, 2) + SC(l, 2)) + xC(SC(d, 2) + SC(f, 2))) / 2, h = .5 * (1 - xC(SC(m, 7) / (SC(m, 7) + SC(25, 7)))), g = c * (1 + h), _ = d * (1 + h), v = xC(SC(g, 2) + SC(l, 2)), y = xC(SC(_, 2) + SC(f, 2)), b = (v + y) / 2, x = a(TC(l, g)), S = a(TC(f, _)), C = x >= 0 ? x : x + 360, w = S >= 0 ? S : S + 360, T = EC(C - w) > 180 ? (C + w + 360) / 2 : (C + w) / 2, E = 1 - .17 * DC(o(T - 30)) + .24 * DC(o(2 * T)) + .32 * DC(o(3 * T + 6)) - .2 * DC(o(4 * T - 63)), D = w - C;
	D = EC(D) <= 180 ? D : w <= C ? D + 360 : D - 360, D = 2 * xC(v * y) * OC(o(D) / 2);
	let ee = u - s, O = y - v, te = 1 + .015 * SC(p - 50, 2) / xC(20 + SC(p - 50, 2)), ne = 1 + .045 * b, re = 1 + .015 * b * E, ie = 30 * kC(-SC((T - 275) / 25, 2)), ae = -(2 * xC(SC(b, 7) / (SC(b, 7) + SC(25, 7)))) * OC(2 * o(ie));
	return wC(0, CC(100, xC(SC(ee / (n * te), 2) + SC(O / (r * ne), 2) + SC(D / (i * re), 2) + ae * (O / (r * ne)) * (D / (i * re)))));
}
//#endregion
//#region node_modules/chroma-js/src/utils/distance.js
function MC(e, t, n = "lab") {
	e = new Q(e), t = new Q(t);
	let r = e.get(n), i = t.get(n), a = 0;
	for (let e in r) {
		let t = (r[e] || 0) - (i[e] || 0);
		a += t * t;
	}
	return Math.sqrt(a);
}
//#endregion
//#region node_modules/chroma-js/src/utils/valid.js
var NC = (...e) => {
	try {
		return new Q(...e), !0;
	} catch {
		return !1;
	}
}, PC = {
	cool() {
		return US([$.hsl(180, 1, .9), $.hsl(250, .7, .4)]);
	},
	hot() {
		return US([
			"#000",
			"#f00",
			"#ff0",
			"#fff"
		], [
			0,
			.25,
			.75,
			1
		]).mode("rgb");
	}
}, FC = {
	OrRd: [
		"#fff7ec",
		"#fee8c8",
		"#fdd49e",
		"#fdbb84",
		"#fc8d59",
		"#ef6548",
		"#d7301f",
		"#b30000",
		"#7f0000"
	],
	PuBu: [
		"#fff7fb",
		"#ece7f2",
		"#d0d1e6",
		"#a6bddb",
		"#74a9cf",
		"#3690c0",
		"#0570b0",
		"#045a8d",
		"#023858"
	],
	BuPu: [
		"#f7fcfd",
		"#e0ecf4",
		"#bfd3e6",
		"#9ebcda",
		"#8c96c6",
		"#8c6bb1",
		"#88419d",
		"#810f7c",
		"#4d004b"
	],
	Oranges: [
		"#fff5eb",
		"#fee6ce",
		"#fdd0a2",
		"#fdae6b",
		"#fd8d3c",
		"#f16913",
		"#d94801",
		"#a63603",
		"#7f2704"
	],
	BuGn: [
		"#f7fcfd",
		"#e5f5f9",
		"#ccece6",
		"#99d8c9",
		"#66c2a4",
		"#41ae76",
		"#238b45",
		"#006d2c",
		"#00441b"
	],
	YlOrBr: [
		"#ffffe5",
		"#fff7bc",
		"#fee391",
		"#fec44f",
		"#fe9929",
		"#ec7014",
		"#cc4c02",
		"#993404",
		"#662506"
	],
	YlGn: [
		"#ffffe5",
		"#f7fcb9",
		"#d9f0a3",
		"#addd8e",
		"#78c679",
		"#41ab5d",
		"#238443",
		"#006837",
		"#004529"
	],
	Reds: [
		"#fff5f0",
		"#fee0d2",
		"#fcbba1",
		"#fc9272",
		"#fb6a4a",
		"#ef3b2c",
		"#cb181d",
		"#a50f15",
		"#67000d"
	],
	RdPu: [
		"#fff7f3",
		"#fde0dd",
		"#fcc5c0",
		"#fa9fb5",
		"#f768a1",
		"#dd3497",
		"#ae017e",
		"#7a0177",
		"#49006a"
	],
	Greens: [
		"#f7fcf5",
		"#e5f5e0",
		"#c7e9c0",
		"#a1d99b",
		"#74c476",
		"#41ab5d",
		"#238b45",
		"#006d2c",
		"#00441b"
	],
	YlGnBu: [
		"#ffffd9",
		"#edf8b1",
		"#c7e9b4",
		"#7fcdbb",
		"#41b6c4",
		"#1d91c0",
		"#225ea8",
		"#253494",
		"#081d58"
	],
	Purples: [
		"#fcfbfd",
		"#efedf5",
		"#dadaeb",
		"#bcbddc",
		"#9e9ac8",
		"#807dba",
		"#6a51a3",
		"#54278f",
		"#3f007d"
	],
	GnBu: [
		"#f7fcf0",
		"#e0f3db",
		"#ccebc5",
		"#a8ddb5",
		"#7bccc4",
		"#4eb3d3",
		"#2b8cbe",
		"#0868ac",
		"#084081"
	],
	Greys: [
		"#ffffff",
		"#f0f0f0",
		"#d9d9d9",
		"#bdbdbd",
		"#969696",
		"#737373",
		"#525252",
		"#252525",
		"#000000"
	],
	YlOrRd: [
		"#ffffcc",
		"#ffeda0",
		"#fed976",
		"#feb24c",
		"#fd8d3c",
		"#fc4e2a",
		"#e31a1c",
		"#bd0026",
		"#800026"
	],
	PuRd: [
		"#f7f4f9",
		"#e7e1ef",
		"#d4b9da",
		"#c994c7",
		"#df65b0",
		"#e7298a",
		"#ce1256",
		"#980043",
		"#67001f"
	],
	Blues: [
		"#f7fbff",
		"#deebf7",
		"#c6dbef",
		"#9ecae1",
		"#6baed6",
		"#4292c6",
		"#2171b5",
		"#08519c",
		"#08306b"
	],
	PuBuGn: [
		"#fff7fb",
		"#ece2f0",
		"#d0d1e6",
		"#a6bddb",
		"#67a9cf",
		"#3690c0",
		"#02818a",
		"#016c59",
		"#014636"
	],
	Viridis: [
		"#440154",
		"#482777",
		"#3f4a8a",
		"#31678e",
		"#26838f",
		"#1f9d8a",
		"#6cce5a",
		"#b6de2b",
		"#fee825"
	],
	Spectral: [
		"#9e0142",
		"#d53e4f",
		"#f46d43",
		"#fdae61",
		"#fee08b",
		"#ffffbf",
		"#e6f598",
		"#abdda4",
		"#66c2a5",
		"#3288bd",
		"#5e4fa2"
	],
	RdYlGn: [
		"#a50026",
		"#d73027",
		"#f46d43",
		"#fdae61",
		"#fee08b",
		"#ffffbf",
		"#d9ef8b",
		"#a6d96a",
		"#66bd63",
		"#1a9850",
		"#006837"
	],
	RdBu: [
		"#67001f",
		"#b2182b",
		"#d6604d",
		"#f4a582",
		"#fddbc7",
		"#f7f7f7",
		"#d1e5f0",
		"#92c5de",
		"#4393c3",
		"#2166ac",
		"#053061"
	],
	PiYG: [
		"#8e0152",
		"#c51b7d",
		"#de77ae",
		"#f1b6da",
		"#fde0ef",
		"#f7f7f7",
		"#e6f5d0",
		"#b8e186",
		"#7fbc41",
		"#4d9221",
		"#276419"
	],
	PRGn: [
		"#40004b",
		"#762a83",
		"#9970ab",
		"#c2a5cf",
		"#e7d4e8",
		"#f7f7f7",
		"#d9f0d3",
		"#a6dba0",
		"#5aae61",
		"#1b7837",
		"#00441b"
	],
	RdYlBu: [
		"#a50026",
		"#d73027",
		"#f46d43",
		"#fdae61",
		"#fee090",
		"#ffffbf",
		"#e0f3f8",
		"#abd9e9",
		"#74add1",
		"#4575b4",
		"#313695"
	],
	BrBG: [
		"#543005",
		"#8c510a",
		"#bf812d",
		"#dfc27d",
		"#f6e8c3",
		"#f5f5f5",
		"#c7eae5",
		"#80cdc1",
		"#35978f",
		"#01665e",
		"#003c30"
	],
	RdGy: [
		"#67001f",
		"#b2182b",
		"#d6604d",
		"#f4a582",
		"#fddbc7",
		"#ffffff",
		"#e0e0e0",
		"#bababa",
		"#878787",
		"#4d4d4d",
		"#1a1a1a"
	],
	PuOr: [
		"#7f3b08",
		"#b35806",
		"#e08214",
		"#fdb863",
		"#fee0b6",
		"#f7f7f7",
		"#d8daeb",
		"#b2abd2",
		"#8073ac",
		"#542788",
		"#2d004b"
	],
	Set2: [
		"#66c2a5",
		"#fc8d62",
		"#8da0cb",
		"#e78ac3",
		"#a6d854",
		"#ffd92f",
		"#e5c494",
		"#b3b3b3"
	],
	Accent: [
		"#7fc97f",
		"#beaed4",
		"#fdc086",
		"#ffff99",
		"#386cb0",
		"#f0027f",
		"#bf5b17",
		"#666666"
	],
	Set1: [
		"#e41a1c",
		"#377eb8",
		"#4daf4a",
		"#984ea3",
		"#ff7f00",
		"#ffff33",
		"#a65628",
		"#f781bf",
		"#999999"
	],
	Set3: [
		"#8dd3c7",
		"#ffffb3",
		"#bebada",
		"#fb8072",
		"#80b1d3",
		"#fdb462",
		"#b3de69",
		"#fccde5",
		"#d9d9d9",
		"#bc80bd",
		"#ccebc5",
		"#ffed6f"
	],
	Dark2: [
		"#1b9e77",
		"#d95f02",
		"#7570b3",
		"#e7298a",
		"#66a61e",
		"#e6ab02",
		"#a6761d",
		"#666666"
	],
	Paired: [
		"#a6cee3",
		"#1f78b4",
		"#b2df8a",
		"#33a02c",
		"#fb9a99",
		"#e31a1c",
		"#fdbf6f",
		"#ff7f00",
		"#cab2d6",
		"#6a3d9a",
		"#ffff99",
		"#b15928"
	],
	Pastel2: [
		"#b3e2cd",
		"#fdcdac",
		"#cbd5e8",
		"#f4cae4",
		"#e6f5c9",
		"#fff2ae",
		"#f1e2cc",
		"#cccccc"
	],
	Pastel1: [
		"#fbb4ae",
		"#b3cde3",
		"#ccebc5",
		"#decbe4",
		"#fed9a6",
		"#ffffcc",
		"#e5d8bd",
		"#fddaec",
		"#f2f2f2"
	]
}, IC = Object.keys(FC), LC = new Map(IC.map((e) => [e.toLowerCase(), e])), RC = typeof Proxy == "function" ? new Proxy(FC, {
	get(e, t) {
		let n = t.toLowerCase();
		if (LC.has(n)) return e[LC.get(n)];
	},
	getOwnPropertyNames() {
		return Object.getOwnPropertyNames(IC);
	}
}) : FC, zC = (...e) => {
	e = X(e, "cmyk");
	let [t, n, r, i] = e, a = e.length > 4 ? e[4] : 1;
	return i === 1 ? [
		0,
		0,
		0,
		a
	] : [
		t >= 1 ? 0 : 255 * (1 - t) * (1 - i),
		n >= 1 ? 0 : 255 * (1 - n) * (1 - i),
		r >= 1 ? 0 : 255 * (1 - r) * (1 - i),
		a
	];
}, { max: BC } = Math, VC = (...e) => {
	let [t, n, r] = X(e, "rgb");
	t /= 255, n /= 255, r /= 255;
	let i = 1 - BC(t, BC(n, r)), a = i < 1 ? 1 / (1 - i) : 0;
	return [
		(1 - t - i) * a,
		(1 - n - i) * a,
		(1 - r - i) * a,
		i
	];
};
Q.prototype.cmyk = function() {
	return VC(this._rgb);
}, Object.assign($, { cmyk: (...e) => new Q(...e, "cmyk") }), Z.format.cmyk = zC, Z.autodetect.push({
	p: 2,
	test: (...e) => {
		if (e = X(e, "cmyk"), Y(e) === "array" && e.length === 4) return "cmyk";
	}
});
//#endregion
//#region node_modules/chroma-js/src/io/css/hsl2css.js
var HC = (...e) => {
	let t = X(e, "hsla"), n = mx(e) || "lsa";
	return t[0] = vx(t[0] || 0) + "deg", t[1] = vx(t[1] * 100) + "%", t[2] = vx(t[2] * 100) + "%", n === "hsla" || t.length > 3 && t[3] < 1 ? (t[3] = "/ " + (t.length > 3 ? t[3] : 1), n = "hsla") : t.length = 3, `${n.substr(0, 3)}(${t.join(" ")})`;
}, UC = (...e) => {
	let t = X(e, "lab"), n = mx(e) || "lab";
	return t[0] = vx(t[0]) + "%", t[1] = vx(t[1]), t[2] = vx(t[2]), n === "laba" || t.length > 3 && t[3] < 1 ? t[3] = "/ " + (t.length > 3 ? t[3] : 1) : t.length = 3, `lab(${t.join(" ")})`;
}, WC = (...e) => {
	let t = X(e, "lch"), n = mx(e) || "lab";
	return t[0] = vx(t[0]) + "%", t[1] = vx(t[1]), t[2] = isNaN(t[2]) ? "none" : vx(t[2]) + "deg", n === "lcha" || t.length > 3 && t[3] < 1 ? t[3] = "/ " + (t.length > 3 ? t[3] : 1) : t.length = 3, `lch(${t.join(" ")})`;
}, GC = (...e) => {
	let t = X(e, "lab");
	return t[0] = vx(t[0] * 100) + "%", t[1] = yx(t[1]), t[2] = yx(t[2]), t.length > 3 && t[3] < 1 ? t[3] = "/ " + (t.length > 3 ? t[3] : 1) : t.length = 3, `oklab(${t.join(" ")})`;
}, KC = (...e) => {
	let [t, n, r, ...i] = X(e, "rgb"), [a, o, s] = MS(t, n, r), [c, l, u] = aS(a, o, s);
	return [
		c,
		l,
		u,
		...i.length > 0 && i[0] < 1 ? [i[0]] : []
	];
}, qC = (...e) => {
	let t = X(e, "lch");
	return t[0] = vx(t[0] * 100) + "%", t[1] = yx(t[1]), t[2] = isNaN(t[2]) ? "none" : vx(t[2]) + "deg", t.length > 3 && t[3] < 1 ? t[3] = "/ " + (t.length > 3 ? t[3] : 1) : t.length = 3, `oklch(${t.join(" ")})`;
}, { round: JC } = Math, YC = (...e) => {
	let t = X(e, "rgba"), n = mx(e) || "rgb";
	if (n.substr(0, 3) === "hsl") return HC(CS(t), n);
	if (n.substr(0, 3) === "lab") {
		let e = Fx();
		Px("d50");
		let r = UC(Bx(t), n);
		return Px(e), r;
	}
	if (n.substr(0, 3) === "lch") {
		let e = Fx();
		Px("d50");
		let r = WC(oS(t), n);
		return Px(e), r;
	}
	return n.substr(0, 5) === "oklab" ? GC(MS(t)) : n.substr(0, 5) === "oklch" ? qC(KC(t)) : (t[0] = JC(t[0]), t[1] = JC(t[1]), t[2] = JC(t[2]), (n === "rgba" || t.length > 3 && t[3] < 1) && (t[3] = "/ " + (t.length > 3 ? t[3] : 1), n = "rgba"), `${n.substr(0, 3)}(${t.slice(0, n === "rgb" ? 3 : 4).join(" ")})`);
}, XC = (...e) => {
	e = X(e, "lch");
	let [t, n, r, ...i] = e, [a, o, s] = $x(t, n, r), [c, l, u] = AS(a, o, s);
	return [
		c,
		l,
		u,
		...i.length > 0 && i[0] < 1 ? [i[0]] : []
	];
}, ZC = "((?:-?\\d+)|(?:-?\\d+(?:\\.\\d+)?)%|none)", QC = "((?:-?(?:\\d+(?:\\.\\d*)?|\\.\\d+)%?)|none)", $C = "((?:-?(?:\\d+(?:\\.\\d*)?|\\.\\d+)%)|none)", ew = "\\s*", tw = "\\s+", nw = "\\s*,\\s*", rw = "((?:-?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:deg)?)|none)", iw = "\\s*(?:\\/\\s*((?:[01]|[01]?\\.\\d+)|\\d+(?:\\.\\d+)?%))?", aw = RegExp("^rgba?\\(" + ew + [
	ZC,
	ZC,
	ZC
].join(tw) + iw + "\\)$"), ow = RegExp("^rgb\\(" + ew + [
	ZC,
	ZC,
	ZC
].join(nw) + ew + "\\)$"), sw = RegExp("^rgba\\(" + ew + [
	ZC,
	ZC,
	ZC,
	QC
].join(nw) + ew + "\\)$"), cw = RegExp("^hsla?\\(" + ew + [
	rw,
	$C,
	$C
].join(tw) + iw + "\\)$"), lw = RegExp("^hsl?\\(" + ew + [
	rw,
	$C,
	$C
].join(nw) + ew + "\\)$"), uw = /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/, dw = RegExp("^lab\\(" + ew + [
	QC,
	QC,
	QC
].join(tw) + iw + "\\)$"), fw = RegExp("^lch\\(" + ew + [
	QC,
	QC,
	rw
].join(tw) + iw + "\\)$"), pw = RegExp("^oklab\\(" + ew + [
	QC,
	QC,
	QC
].join(tw) + iw + "\\)$"), mw = RegExp("^oklch\\(" + ew + [
	QC,
	QC,
	rw
].join(tw) + iw + "\\)$"), { round: hw } = Math, gw = (e) => e.map((e, t) => t <= 2 ? dx(hw(e), 0, 255) : e), _w = (e, t = 0, n = 100, r = !1) => (typeof e == "string" && e.endsWith("%") && (e = parseFloat(e.substring(0, e.length - 1)) / 100, e = r ? t + (e + 1) * .5 * (n - t) : t + e * (n - t)), +e), vw = (e, t) => e === "none" ? t : e, yw = (e) => {
	if (e = e.toLowerCase().trim(), e === "transparent") return [
		0,
		0,
		0,
		0
	];
	let t;
	if (Z.format.named) try {
		return Z.format.named(e);
	} catch {}
	if ((t = e.match(aw)) || (t = e.match(ow))) {
		let e = t.slice(1, 4);
		for (let t = 0; t < 3; t++) e[t] = +_w(vw(e[t], 0), 0, 255);
		e = gw(e);
		let n = t[4] === void 0 ? 1 : +_w(t[4], 0, 1);
		return e[3] = n, e;
	}
	if (t = e.match(sw)) {
		let e = t.slice(1, 5);
		for (let t = 0; t < 4; t++) e[t] = +_w(e[t], 0, 255);
		return e;
	}
	if ((t = e.match(cw)) || (t = e.match(lw))) {
		let e = t.slice(1, 4);
		e[0] = +vw(e[0].replace("deg", ""), 0), e[1] = _w(vw(e[1], 0), 0, 100) * .01, e[2] = _w(vw(e[2], 0), 0, 100) * .01;
		let n = gw(SS(e));
		return n[3] = t[4] === void 0 ? 1 : +_w(t[4], 0, 1), n;
	}
	if (t = e.match(uw)) {
		let e = t.slice(1, 4);
		e[1] *= .01, e[2] *= .01;
		let n = SS(e);
		for (let e = 0; e < 3; e++) n[e] = hw(n[e]);
		return n[3] = +t[4], n;
	}
	if (t = e.match(dw)) {
		let e = t.slice(1, 4);
		e[0] = _w(vw(e[0], 0), 0, 100), e[1] = _w(vw(e[1], 0), -125, 125, !0), e[2] = _w(vw(e[2], 0), -125, 125, !0);
		let n = Fx();
		Px("d50");
		let r = gw(Ix(e));
		return Px(n), r[3] = t[4] === void 0 ? 1 : +_w(t[4], 0, 1), r;
	}
	if (t = e.match(fw)) {
		let e = t.slice(1, 4);
		e[0] = _w(e[0], 0, 100), e[1] = _w(vw(e[1], 0), 0, 150, !1), e[2] = +vw(e[2].replace("deg", ""), 0);
		let n = Fx();
		Px("d50");
		let r = gw(eS(e));
		return Px(n), r[3] = t[4] === void 0 ? 1 : +_w(t[4], 0, 1), r;
	}
	if (t = e.match(pw)) {
		let e = t.slice(1, 4);
		e[0] = _w(vw(e[0], 0), 0, 1), e[1] = _w(vw(e[1], 0), -.4, .4, !0), e[2] = _w(vw(e[2], 0), -.4, .4, !0);
		let n = gw(AS(e));
		return n[3] = t[4] === void 0 ? 1 : +_w(t[4], 0, 1), n;
	}
	if (t = e.match(mw)) {
		let e = t.slice(1, 4);
		e[0] = _w(vw(e[0], 0), 0, 1), e[1] = _w(vw(e[1], 0), 0, .4, !1), e[2] = +vw(e[2].replace("deg", ""), 0);
		let n = gw(XC(e));
		return n[3] = t[4] === void 0 ? 1 : +_w(t[4], 0, 1), n;
	}
};
yw.test = (e) => aw.test(e) || cw.test(e) || dw.test(e) || fw.test(e) || pw.test(e) || mw.test(e) || ow.test(e) || sw.test(e) || lw.test(e) || uw.test(e) || e === "transparent", Q.prototype.css = function(e) {
	return YC(this._rgb, e);
}, $.css = (...e) => new Q(...e, "css"), Z.format.css = yw, Z.autodetect.push({
	p: 5,
	test: (e, ...t) => {
		if (!t.length && Y(e) === "string" && yw.test(e)) return "css";
	}
}), Z.format.gl = (...e) => {
	let t = X(e, "rgba");
	return t[0] *= 255, t[1] *= 255, t[2] *= 255, t;
}, $.gl = (...e) => new Q(...e, "gl"), Q.prototype.gl = function() {
	let e = this._rgb;
	return [
		e[0] / 255,
		e[1] / 255,
		e[2] / 255,
		e[3]
	];
}, Q.prototype.hex = function(e) {
	return jx(this._rgb, e);
}, $.hex = (...e) => new Q(...e, "hex"), Z.format.hex = kx, Z.autodetect.push({
	p: 4,
	test: (e, ...t) => {
		if (!t.length && Y(e) === "string" && [
			3,
			4,
			5,
			6,
			7,
			8,
			9
		].indexOf(e.length) >= 0) return "hex";
	}
});
//#endregion
//#region node_modules/chroma-js/src/io/temp/temperature2rgb.js
var { log: bw } = Math, xw = (e) => {
	let t = e / 100, n, r, i;
	return t < 66 ? (n = 255, r = t < 6 ? 0 : -155.25485562709179 - .44596950469579133 * (r = t - 2) + 104.49216199393888 * bw(r), i = t < 20 ? 0 : -254.76935184120902 + .8274096064007395 * (i = t - 10) + 115.67994401066147 * bw(i)) : (n = 351.97690566805693 + .114206453784165 * (n = t - 55) - 40.25366309332127 * bw(n), r = 325.4494125711974 + .07943456536662342 * (r = t - 50) - 28.0852963507957 * bw(r), i = 255), [
		n,
		r,
		i,
		1
	];
}, { round: Sw } = Math, Cw = (...e) => {
	let t = X(e, "rgb"), n = t[0], r = t[2], i = 1e3, a = 4e4, o;
	for (; a - i > .4;) {
		o = (a + i) * .5;
		let e = xw(o);
		e[2] / e[0] >= r / n ? a = o : i = o;
	}
	return Sw(o);
};
//#endregion
//#region node_modules/chroma-js/src/io/temp/index.js
Q.prototype.temp = Q.prototype.kelvin = Q.prototype.temperature = function() {
	return Cw(this._rgb);
};
var ww = (...e) => new Q(...e, "temp");
//#endregion
//#region node_modules/chroma-js/index.js
Object.assign($, {
	temp: ww,
	kelvin: ww,
	temperature: ww
}), Z.format.temp = Z.format.kelvin = Z.format.temperature = xw, Q.prototype.oklch = function() {
	return KC(this._rgb);
}, Object.assign($, { oklch: (...e) => new Q(...e, "oklch") }), Z.format.oklch = XC, Z.autodetect.push({
	p: 2,
	test: (...e) => {
		if (e = X(e, "oklch"), Y(e) === "array" && e.length === 3) return "oklch";
	}
}), Object.assign($, {
	analyze: uC,
	average: BS,
	bezier: qS,
	blend: YS,
	brewer: RC,
	Color: Q,
	colors: Ex,
	contrast: fC,
	contrastAPCA: yC,
	cubehelix: tC,
	deltaE: jC,
	distance: MC,
	input: Z,
	interpolate: Xx,
	limits: dC,
	mix: Xx,
	random: aC,
	scale: US,
	scales: PC,
	valid: NC
});
var Tw = $, Ew = {
	light: {
		"dsfr-chart-colors-01": "#5C68E5",
		"dsfr-chart-colors-02": "#82B5F2",
		"dsfr-chart-colors-03": "#29598F",
		"dsfr-chart-colors-04": "#31A7AE",
		"dsfr-chart-colors-05": "#81EEF5",
		"dsfr-chart-colors-06": "#B478F1",
		"dsfr-chart-colors-07": "#CFB1F5",
		"dsfr-chart-colors-08": "#CECECE",
		"dsfr-chart-colors-09": "#DBDAFF",
		"dsfr-chart-colors-10": "#00005F",
		"dsfr-chart-colors-11": "#298641",
		"dsfr-chart-colors-12": "#79D289",
		"dsfr-chart-colors-13": "#EFB900",
		"dsfr-chart-colors-14": "#FFA373",
		"dsfr-chart-colors-15": "#E91719",
		"dsfr-chart-colors-default": "#5C68E5",
		"dsfr-chart-colors-neutral": "#B1B1B1"
	},
	dark: {
		"dsfr-chart-colors-01": "#5C68E5",
		"dsfr-chart-colors-02": "#699BD6",
		"dsfr-chart-colors-03": "#4878B1",
		"dsfr-chart-colors-04": "#00828A",
		"dsfr-chart-colors-05": "#51C1C8",
		"dsfr-chart-colors-06": "#BC8AF2",
		"dsfr-chart-colors-07": "#CFB1F5",
		"dsfr-chart-colors-08": "#A4A4A4",
		"dsfr-chart-colors-09": "#B8B9FF",
		"dsfr-chart-colors-10": "#3647CA",
		"dsfr-chart-colors-11": "#298641",
		"dsfr-chart-colors-12": "#449D57",
		"dsfr-chart-colors-13": "#AF8800",
		"dsfr-chart-colors-14": "#FFA373",
		"dsfr-chart-colors-15": "#E16834",
		"dsfr-chart-colors-default": "#5C68E5",
		"dsfr-chart-colors-neutral": "#808080"
	}
};
//#endregion
//#region src/utils/colors.js
function Dw({ yparse: e = [], tmpColorParse: t = [], highlightIndex: n = [], selectedPalette: r = "" }) {
	let i = [], a = [], o = zw(r);
	for (let s = 0; s < e.length; s++) {
		let c = e[s], l = [], u = [];
		if (t[s]) {
			let e = t[s], n = c && c.length ? c.length : 1;
			l = Array(n).fill(e), u = l.map((e) => Tw(e).darken(.8).hex());
		} else if (r === "neutral" && n.length > 0 && Array.isArray(c)) {
			let e = c && c.length ? c.length : 1;
			for (let t = 0; t < e; t++) {
				let e = n.includes(t) ? Lw() : Rw();
				l.push(e), u.push(Tw(e).darken(.8).hex());
			}
		} else if (r.startsWith("divergent")) {
			let e = c && c.length ? c.length : 1;
			l = Array(e).fill(o[s % o.length]), u = l.map((e) => Tw(e).darken(.8).hex());
		} else if (r === "categorical" || !r) {
			let e = Iw(s, o), t = c && c.length ? c.length : 1;
			l = Array(t).fill(e), u = l.map((e) => Tw(e).darken(.8).hex());
		} else {
			let t = e.flat(), n = Math.min(...t), r = Math.max(...t), i = Tw.scale(o).domain([r, n]);
			l = (c || [n]).map((e) => Tw(i(e)).hex()), u = l.map((e) => Tw(e).darken(.8).hex());
		}
		i.push(l), a.push(u);
	}
	return {
		colorParse: i,
		colorHover: a,
		legendColors: i.map((e) => e[0])
	};
}
function Ow({ vlineParse: e = [], hlineParse: t = [], tmpVlineColorParse: n = [], tmpHlineColorParse: r = [], selectedPalette: i = "" }) {
	let a = zw(i), o = [Iw(0, a)], s = [Tw(o[0]).darken(.8).hex()], c = [Iw(1, a)];
	return {
		colorBarParse: o,
		colorBarHover: s,
		colorParse: c,
		colorHover: [Tw(c[0]).darken(.8).hex()],
		vlineColorParse: e.map((e, t) => n[t] || Rw()),
		hlineColorParse: t.map((e, t) => r[t] || Rw())
	};
}
function kw({ yparse: e = [], tmpColorParse: t = [], selectedPalette: n = "", highlightIndex: r = -1, vlineParse: i = [], tmpVlineColorParse: a = [], hlineParse: o = [], tmpHlineColorParse: s = [] }) {
	let c = zw(n), l = [], u = [];
	for (let n = 0; n < e.length; n++) {
		let e;
		e = t[n] ? t[n] : n === r ? Rw() : Iw(n, c), l.push(e), u.push(Tw(e).darken(.8).hex());
	}
	return {
		colorParse: l,
		colorHover: u,
		vlineColorParse: i.map((e, t) => a[t] || Rw()),
		hlineColorParse: o.map((e, t) => s[t] || Rw())
	};
}
function Aw() {
	return Ew[document.documentElement.getAttribute("data-fr-theme") || "light"] || Ew.light;
}
function jw() {
	let e = Aw();
	return [
		e["dsfr-chart-colors-01"],
		e["dsfr-chart-colors-02"],
		e["dsfr-chart-colors-03"],
		e["dsfr-chart-colors-04"],
		e["dsfr-chart-colors-05"],
		e["dsfr-chart-colors-06"],
		e["dsfr-chart-colors-07"],
		e["dsfr-chart-colors-08"]
	];
}
function Mw() {
	let e = Aw();
	return Tw.scale([e["dsfr-chart-colors-09"], e["dsfr-chart-colors-10"]]).colors(10);
}
function Nw() {
	let e = Aw();
	return Tw.scale([e["dsfr-chart-colors-10"], e["dsfr-chart-colors-09"]]).colors(10);
}
function Pw() {
	let e = Aw();
	return Tw.scale([
		e["dsfr-chart-colors-11"],
		e["dsfr-chart-colors-13"],
		e["dsfr-chart-colors-15"]
	]).colors(4);
}
function Fw() {
	let e = Aw();
	return Tw.scale([
		e["dsfr-chart-colors-15"],
		e["dsfr-chart-colors-13"],
		e["dsfr-chart-colors-11"]
	]).colors(4);
}
function Iw(e, t = jw()) {
	return t[e % t.length];
}
function Lw() {
	return Aw()["dsfr-chart-colors-default"];
}
function Rw() {
	return Aw()["dsfr-chart-colors-neutral"];
}
function zw(e) {
	switch (e) {
		case "default": return [Lw()];
		case "neutral": return [Rw()];
		case "categorical": return jw();
		case "sequentialAscending": return Mw();
		case "sequentialDescending": return Nw();
		case "divergentAscending": return Pw();
		case "divergentDescending": return Fw();
		default: return jw();
	}
}
//#endregion
//#region src/components/BarChart.vue
J.register(th, q_);
var Bw = {
	name: "BarChart",
	mixins: [$y],
	props: {
		databoxId: {
			type: String,
			default: null
		},
		databoxType: {
			type: String,
			default: null
		},
		databoxSource: {
			type: String,
			default: "default"
		},
		x: {
			type: String,
			required: !0
		},
		y: {
			type: String,
			required: !0
		},
		subX: {
			type: String,
			default: null
		},
		subY: {
			type: String,
			default: null
		},
		xMin: {
			type: [Number, String],
			default: ""
		},
		xMax: {
			type: [Number, String],
			default: ""
		},
		yMin: {
			type: [Number, String],
			default: ""
		},
		yMax: {
			type: [Number, String],
			default: ""
		},
		name: {
			type: String,
			default: ""
		},
		stacked: {
			type: [Boolean, String],
			default: !1
		},
		horizontal: {
			type: [Boolean, String],
			default: !1
		},
		barSize: {
			type: [Number, String],
			default: "flex"
		},
		maxBarSize: {
			type: [Number, String],
			default: 32
		},
		date: {
			type: String,
			default: ""
		},
		aspectRatio: {
			type: [Number, String],
			default: 2
		},
		selectedPalette: {
			type: String,
			default: ""
		},
		highlightIndex: {
			type: [Array, String],
			default: () => []
		},
		unitTooltip: {
			type: [String, Array],
			default: ""
		},
		colors: {
			type: [String, Array],
			default: ""
		}
	},
	data() {
		return this.chart = void 0, {
			widgetId: "",
			chartId: "",
			selectedIndex: -1,
			datasets: [],
			labels: [],
			xparse: [],
			yparse: [],
			subXParse: [],
			subYParse: [],
			nameParse: [],
			tmpColorParse: [],
			unitTooltipParse: "",
			colorParse: [],
			colorHover: [],
			legendColors: [],
			isSubChart: !1,
			isSubLevel: !1,
			subTitle: null,
			targetReady: !1
		};
	},
	watch: {
		$props: {
			handler() {
				this.chartId && (this.resetData(), this.getData(), this.createChart());
			},
			deep: !0,
			immediate: !0
		},
		targetReady(e) {
			e && this.$nextTick(() => {
				this.resetData(), this.createChart();
			});
		}
	},
	created() {
		Qy(), this.chartId = `dsfr-chart-${Math.floor(Math.random() * 1e3)}`, this.widgetId = `dsfr-widget-${Math.floor(Math.random() * 1e3)}`;
	},
	mounted() {
		if (!this.databoxId || !this.databoxType) this.resetData(), this.createChart();
		else {
			let e = `${this.databoxId}-${this.databoxType}-${this.databoxSource}`;
			document.getElementById(e) ? this.targetReady = !0 : (this._targetObserver = new MutationObserver(() => {
				document.getElementById(e) && (this._targetObserver.disconnect(), this.targetReady = !0);
			}), this._targetObserver.observe(document.body, {
				childList: !0,
				subtree: !0
			}));
		}
		document.documentElement.addEventListener("dsfr.theme", (e) => {
			this.chartId !== "" && this.changeColors(e.detail.theme);
		});
	},
	beforeUnmount() {
		this._targetObserver && this._targetObserver.disconnect();
	},
	methods: {
		resetData() {
			this.chart && this.chart.destroy(), this.datasets = [], this.labels = [], this.xparse = [], this.yparse = [], this.subXParse = [], this.subYParse = [], this.nameParse = [], this.tmpColorParse = [], this.unitTooltipParse = "", this.highlightIndexParse = [], this.colorParse = [], this.colorHover = [];
		},
		getData() {
			try {
				this.xparse = JSON.parse(this.x), this.yparse = JSON.parse(this.y), this.subXParse = JSON.parse(this.subX), this.subYParse = JSON.parse(this.subY);
			} catch (e) {
				console.error("Erreur lors du parsing des données x ou y:", e);
				return;
			}
			this.subXParse && this.subYParse && (this.isSubChart = !0);
			let e = [];
			if (this.name) try {
				e = JSON.parse(this.name);
			} catch (e) {
				console.error("Erreur lors du parsing de name:", e);
			}
			this.nameParse = [];
			for (let t = 0; t < this.yparse.length; t++) e[t] ? this.nameParse.push(e[t]) : this.nameParse.push(`Série ${t + 1}`);
			this.labels = this.xparse[0], this.loadColors(), this.datasets = this.yparse.map((e, t) => ({
				data: e,
				borderColor: this.colorParse[t],
				backgroundColor: this.colorParse[t],
				hoverBorderColor: this.colorHover[t],
				hoverBackgroundColor: this.colorHover[t],
				barThickness: this.barSize,
				...this.maxBarSize ? { maxBarThickness: this.maxBarSize } : {}
			}));
		},
		choosePalette() {
			return zw(this.selectedPalette);
		},
		loadColors() {
			try {
				this.highlightIndexParse = Array.isArray(this.highlightIndex) ? this.highlightIndex : JSON.parse(this.highlightIndex);
				try {
					this.unitTooltipParse = Array.isArray(this.unitTooltip) ? this.unitTooltip : JSON.parse(this.unitTooltip);
				} catch {
					this.unitTooltipParse = this.unitTooltip;
				}
				if (this.colors) try {
					this.tmpColorParse = Array.isArray(this.colors) ? this.colors : JSON.parse(this.colors);
				} catch {
					this.tmpColorParse = [];
				}
			} catch (e) {
				console.error("Erreur lors du parsing des données highlight-index:", e), this.highlightIndexParse = [];
			}
			let { colorParse: e, colorHover: t, legendColors: n } = Dw({
				yparse: this.yparse,
				tmpColorParse: this.tmpColorParse,
				highlightIndex: this.highlightIndexParse,
				selectedPalette: this.selectedPalette
			});
			this.colorParse = e, this.colorHover = t, this.legendColors = n;
		},
		createChart() {
			this.chart && this.chart.destroy(), this.getData();
			let e = this.$refs[this.chartId].getContext("2d");
			this.chart = new J(e, {
				type: "bar",
				data: {
					labels: this.labels,
					datasets: this.datasets
				},
				options: {
					indexAxis: [
						!0,
						"true",
						""
					].includes(this.horizontal) ? "y" : "x",
					aspectRatio: this.aspectRatio,
					scales: {
						x: {
							offset: ![
								!0,
								"true",
								""
							].includes(this.horizontal),
							stacked: [
								!0,
								"true",
								""
							].includes(this.stacked),
							grid: {
								drawTicks: !1,
								drawOnChartArea: [
									!0,
									"true",
									""
								].includes(this.horizontal)
							},
							ticks: { padding: [
								!0,
								"true",
								""
							].includes(this.horizontal) ? 5 : 15 },
							...this.xMin ? { suggestedMin: this.xMin } : {},
							...this.xMax ? { suggestedMax: this.xMax } : {}
						},
						y: {
							stacked: [
								!0,
								"true",
								""
							].includes(this.stacked),
							offset: [
								!0,
								"true",
								""
							].includes(this.horizontal),
							grid: {
								drawTicks: !1,
								drawOnChartArea: ![
									!0,
									"true",
									""
								].includes(this.horizontal)
							},
							border: { dash: [3] },
							ticks: {
								autoSkip: !1,
								padding: 5
							},
							...this.yMin ? { suggestedMin: this.yMin } : {},
							...this.yMax ? { suggestedMax: this.yMax } : {}
						}
					},
					plugins: {
						legend: { display: !1 },
						tooltip: {
							enabled: !1,
							mode: "index",
							displayColors: !1,
							backgroundColor: "#6b6b6b",
							callbacks: {
								label: (e) => this.datasets.map((t) => this.formatNumber(t.data[e.dataIndex])),
								title: (e) => e[0].label,
								labelTextColor: () => this.colorParse
							},
							external: (e) => {
								let t = (document.getElementById(`${this.databoxId}-${this.databoxType}-${this.databoxSource}`) || this.$el.nextElementSibling).querySelector(".tooltip"), n = e.tooltip;
								if (!t) return;
								if (!n || n.opacity === 0) {
									t.style.opacity = 0;
									return;
								}
								if (t.classList.remove("above", "below", "no-transform"), n.yAlign ? t.classList.add(n.yAlign) : t.classList.add("no-transform"), n.body) {
									let e = n.title || [], r = [n.body.map((e) => e.lines).flat()], i = t.querySelector(".tooltip_header.fr-text--sm.fr-mb-0");
									i.innerText = e[0];
									let a = t.querySelector(".tooltip_value");
									a.innerHTML = "", r[0].forEach((e, t) => {
										if (e && e !== "NaN" && n.dataPoints[t]) {
											let { datasetIndex: r, dataIndex: i } = n.dataPoints[t], o = this.colorParse[r] ? this.colorParse[r][i] : "#000", s = Array.isArray(this.unitTooltipParse) ? this.unitTooltipParse[r] : this.unitTooltipParse, c = `${e}${s ? ` ${s}` : ""}`;
											a.innerHTML += `
                        <div class="tooltip_value-content">
                          <span class="tooltip_dot" style="background-color:${o};"></span>
                          <p class="tooltip_place fr-mb-0">${c}</p>
                        </div>
                      `;
										}
									});
								}
								let { offsetLeft: r, offsetTop: i } = this.chart.canvas, a = Number(this.chart.canvas.style.width.replace(/\D/g, "")), o = Number(this.chart.canvas.style.height.replace(/\D/g, "")), s = r + n.caretX + 10, c = i + n.caretY - 20;
								s + t.clientWidth > r + a && (s = r + n.caretX - t.clientWidth - 10), c + t.clientHeight > i + .9 * o && (c = i + n.caretY - t.clientHeight + 20), s < r && (s = r + n.caretX - t.clientWidth / 2, c = i + n.caretY - t.clientHeight - 20), t.style.position = "absolute", t.style.padding = `${n.padding}px ${n.padding}px`, t.style.pointerEvents = "none", t.style.left = `${s}px`, t.style.top = `${c}px`, t.style.opacity = 1;
							}
						}
					},
					onClick: (e) => {
						if (!this.subYParse) return;
						let t = this.chart.getElementsAtEventForMode(e, "nearest", { intersect: !0 }, !0);
						if (t.length > 0) {
							let { index: e } = t[0], n = this.chart.data.labels[e];
							if (!this.subYParse[e]) return;
							this.subTitle ||= n, this.subYParse[e] && !this.isSubLevel && (this.updateChart(e), this.isSubLevel = !0, this.selectedIndex = e);
						}
					}
				}
			});
		},
		changeColors(e) {
			this.loadColors(), this.chart.data.datasets.forEach((e, t) => {
				e.borderColor = this.colorParse[t], e.backgroundColor = this.colorParse[t], e.hoverBorderColor = this.colorHover[t], e.hoverBackgroundColor = this.colorHover[t];
			}), this.chart.options.scales.x.ticks.color = e === "dark" ? "#cecece" : J.defaults.color, this.chart.options.scales.y.ticks.color = e === "dark" ? "#cecece" : J.defaults.color, this.chart.update("none");
		},
		updateChart(e) {
			let t = this.subYParse[e];
			!t || t.length === 0 || (this.chart.data.labels = this.subXParse[e], this.chart.data.datasets[0].data = this.subYParse[e], this.chart.update());
		},
		resetSub() {
			this.isSubLevel = !1, this.subTitle = null, this.chart.data.labels = this.xparse[0], this.chart.data.datasets[0].data = this.yparse[0], this.chart.update(), this.selectedIndex = -1;
		}
	}
}, Vw = ["data-index", "data-sub-chart"], Hw = { class: "fr-col-12" }, Uw = { class: "chart" }, Ww = {
	key: 1,
	class: "fr-mb-0"
}, Gw = ["aria-labelledby", "aria-label"], Kw = { class: "chart_legend fr-mb-0 fr-mt-4v" }, qw = { class: "fr-text--sm fr-text--bold fr-ml-1w fr-mb-0" }, Jw = {
	key: 1,
	class: "flex fr-mt-1w"
}, Yw = { class: "fr-text--xs" };
function Xw(e, t, n, r, i, a) {
	return !n.databoxId || i.targetReady ? (I(), Ao(Qr, {
		key: 0,
		to: "#" + n.databoxId + "-" + n.databoxType + "-" + n.databoxSource,
		disabled: !n.databoxId
	}, [R("div", {
		ref: i.widgetId,
		class: "widget_container fr-grid-row",
		"data-index": i.selectedIndex,
		"data-sub-chart": i.isSubChart
	}, [R("div", Hw, [R("div", Uw, [
		t[1] ||= R("div", { class: "tooltip" }, [R("div", { class: "tooltip_header fr-text--sm fr-mb-0" }), R("div", { class: "tooltip_body" }, [R("div", { class: "tooltip_value" })])], -1),
		i.isSubChart ? (I(), L("div", {
			key: 0,
			class: A(i.isSubLevel ? "" : "fr-mt-6v"),
			style: {
				textAlign: "center",
				position: "relative"
			}
		}, [i.isSubLevel ? (I(), L("button", {
			key: 0,
			class: "fr-btn fr-btn--sm fr-icon-arrow-go-back-fill fr-btn--icon-left fr-btn--tertiary-no-outline fr-ml-4w",
			style: {
				position: "absolute",
				left: 0
			},
			onClick: t[0] ||= (...e) => a.resetSub && a.resetSub(...e)
		}, " Retour ")) : B("", !0), i.subTitle ? (I(), L("p", Ww, j(i.subTitle), 1)) : B("", !0)], 2)) : B("", !0),
		R("canvas", {
			ref: i.chartId,
			role: "img",
			"aria-labelledby": n.databoxId ? "title-" + n.databoxId : null,
			"aria-label": n.databoxId ? null : "Graphique en barres"
		}, null, 8, Gw),
		R("div", Kw, [(I(!0), L(F, null, Pi(i.nameParse, (t, n) => (I(), L("div", {
			key: n,
			class: "flex fr-mt-3v fr-mb-1v"
		}, [R("span", {
			class: "legend_dot",
			style: k({ "background-color": i.legendColors[n] })
		}, null, 4), R("p", qw, j(e.capitalize(t)), 1)]))), 128))]),
		n.date ? (I(), L("div", Jw, [R("p", Yw, "Mise à jour : " + j(n.date), 1)])) : B("", !0)
	])])], 8, Vw)], 8, ["to", "disabled"])) : B("", !0);
}
var Zw = /* @__PURE__ */ fb(Bw, [["render", Xw]]);
//#endregion
//#region src/components/BarLineChart.vue
J.register(ih, F_);
var Qw = {
	name: "BarLineChart",
	mixins: [$y],
	props: {
		databoxId: {
			type: String,
			default: null
		},
		databoxType: {
			type: String,
			default: null
		},
		databoxSource: {
			type: String,
			default: "default"
		},
		x: {
			type: String,
			required: !0
		},
		yBar: {
			type: String,
			required: !0
		},
		yLine: {
			type: String,
			required: !0
		},
		xMin: {
			type: [Number, String],
			default: ""
		},
		xMax: {
			type: [Number, String],
			default: ""
		},
		yBarMin: {
			type: [Number, String],
			default: ""
		},
		yBarMax: {
			type: [Number, String],
			default: ""
		},
		yLineMin: {
			type: [Number, String],
			default: ""
		},
		yLineMax: {
			type: [Number, String],
			default: ""
		},
		nameBar: {
			type: String,
			default: ""
		},
		nameLine: {
			type: String,
			default: ""
		},
		barSize: {
			type: [Number, String],
			default: "flex"
		},
		maxBarSize: {
			type: [Number, String],
			default: 32
		},
		vline: {
			type: String,
			default: ""
		},
		vlinecolor: {
			type: String,
			default: ""
		},
		vlinename: {
			type: String,
			default: ""
		},
		hline: {
			type: String,
			default: ""
		},
		hlinecolor: {
			type: String,
			default: ""
		},
		hlinename: {
			type: String,
			default: ""
		},
		date: {
			type: String,
			default: ""
		},
		aspectRatio: {
			type: [Number, String],
			default: 2
		},
		selectedPalette: {
			type: String,
			default: ""
		},
		unitTooltipBar: {
			type: String,
			default: ""
		},
		unitTooltipLine: {
			type: String,
			default: ""
		}
	},
	data() {
		return this.chart = void 0, {
			widgetId: "",
			chartId: "",
			datasets: [],
			labels: [],
			xparse: [],
			ybarparse: [],
			ylineparse: [],
			vlineParse: [],
			vlineColorParse: [],
			tmpVlineColorParse: [],
			vlineNameParse: [],
			hlineParse: [],
			hlineColorParse: [],
			tmpHlineColorParse: [],
			hlineNameParse: [],
			colorParse: [],
			colorBarParse: [],
			colorHover: [],
			colorBarHover: [],
			targetReady: !1
		};
	},
	watch: {
		$props: {
			handler() {
				this.chartId && (this.resetData(), this.getData(), this.createChart());
			},
			deep: !0,
			immediate: !0
		},
		targetReady(e) {
			e && this.$nextTick(() => {
				this.resetData(), this.createChart();
			});
		}
	},
	created() {
		Qy(), this.chartId = `dsfr-chart-${Math.floor(Math.random() * 1e3)}`, this.widgetId = `dsfr-widget-${Math.floor(Math.random() * 1e3)}`;
	},
	mounted() {
		if (!this.databoxId || !this.databoxType) this.resetData(), this.createChart();
		else {
			let e = `${this.databoxId}-${this.databoxType}-${this.databoxSource}`;
			document.getElementById(e) ? this.targetReady = !0 : (this._targetObserver = new MutationObserver(() => {
				document.getElementById(e) && (this._targetObserver.disconnect(), this.targetReady = !0);
			}), this._targetObserver.observe(document.body, {
				childList: !0,
				subtree: !0
			}));
		}
		document.documentElement.addEventListener("dsfr.theme", (e) => {
			this.chartId !== "" && this.changeColors(e.detail.theme);
		});
	},
	beforeUnmount() {
		this._targetObserver && this._targetObserver.disconnect();
	},
	methods: {
		resetData() {
			this.chart && this.chart.destroy(), this.datasets = [], this.labels = [], this.xparse = [], this.ybarparse = [], this.ylineparse = [], this.vlineParse = [], this.vlineColorParse = [], this.tmpVlineColorParse = [], this.vlineNameParse = [], this.hlineParse = [], this.hlineColorParse = [], this.tmpHlineColorParse = [], this.hlineNameParse = [], this.colorParse = [], this.colorBarParse = [], this.colorHover = [], this.colorBarHover = [];
		},
		getData() {
			try {
				this.xparse = JSON.parse(this.x), this.ybarparse = JSON.parse(this.yBar), this.ylineparse = JSON.parse(this.yLine);
			} catch (e) {
				console.error("Erreur lors du parsing des données x ou y-bar ou y-line:", e);
				return;
			}
			if (this.vline) {
				this.vlineParse = JSON.parse(this.vline);
				let e = [];
				this.vlinename && (e = JSON.parse(this.vlinename)), this.vlinecolor && (this.tmpVlineColorParse = JSON.parse(this.vlinecolor));
				for (let t = 0; t < this.vlineParse.length; t++) e[t] ? this.vlineNameParse.push(e[t]) : this.vlineNameParse.push(`V${t + 1}`);
			}
			if (this.hline) {
				this.hlineParse = JSON.parse(this.hline);
				let e = [];
				this.hlinename && (e = JSON.parse(this.hlinename)), this.hlinecolor && (this.tmpHlineColorParse = JSON.parse(this.hlinecolor));
				for (let t = 0; t < this.hlineParse.length; t++) e[t] ? this.hlineNameParse.push(e[t]) : this.hlineNameParse.push(`H${t + 1}`);
			}
			this.labels = this.xparse, this.loadColors(), this.datasets = [{
				data: this.ybarparse,
				type: "bar",
				borderColor: this.colorBarParse[0],
				backgroundColor: this.colorBarParse[0],
				hoverBorderColor: this.colorBarHover[0],
				hoverBackgroundColor: this.colorBarHover[0],
				pointRadius: 5,
				pointHoverRadius: 5,
				barThickness: this.barSize,
				...this.maxBarSize ? { maxBarThickness: this.maxBarSize } : {},
				barPercentage: .5
			}, {
				data: this.ylineparse,
				type: "line",
				borderColor: this.colorParse[0],
				backgroundColor: this.colorParse[0],
				hoverBorderColor: this.colorHover[0],
				hoverBackgroundColor: this.colorHover[0],
				pointBorderColor: this.colorParse[0],
				pointBackgroundColor: this.colorParse[0],
				pointHoverBorderColor: this.colorHover[0],
				pointHoverBackgroundColor: this.colorHover[0],
				pointRadius: 5,
				pointHoverRadius: 5,
				yAxisID: "yLine",
				tension: .4
			}];
		},
		choosePalette() {
			return zw(this.selectedPalette);
		},
		loadColors() {
			let { colorBarParse: e, colorBarHover: t, colorParse: n, colorHover: r, vlineColorParse: i, hlineColorParse: a } = Ow({
				vlineParse: this.vlineParse,
				hlineParse: this.hlineParse,
				tmpVlineColorParse: this.tmpVlineColorParse,
				tmpHlineColorParse: this.tmpHlineColorParse,
				selectedPalette: this.selectedPalette
			});
			this.colorBarParse = e, this.colorBarHover = t, this.colorParse = n, this.colorHover = r, this.vlineColorParse = i, this.hlineColorParse = a;
		},
		createChart() {
			this.chart && this.chart.destroy(), this.getData();
			let e = this.$refs[this.chartId].getContext("2d");
			this.chart = new J(e, {
				data: {
					labels: this.labels,
					datasets: this.datasets
				},
				plugins: [{
					afterDatasetDraw: (e) => {
						this.vlineParse && this.vlineParse.forEach((t, n) => {
							let { ctx: r } = e, i = e.scales.x.getPixelForValue(t);
							r.save(), r.beginPath(), r.moveTo(i, e.scales.y.bottom), r.strokeStyle = this.vlineColorParse[n], r.lineWidth = 3, r.setLineDash([10, 5]), r.lineTo(i, e.scales.y.top), r.stroke(), r.restore();
						}), this.hlineParse && this.hlineParse.forEach((t, n) => {
							let { ctx: r } = e, i = e.scales.y.getPixelForValue(t);
							r.save(), r.beginPath(), r.moveTo(e.scales.x.left, i), r.strokeStyle = this.hlineColorParse[n], r.lineWidth = 3, r.setLineDash([10, 5]), r.lineTo(e.scales.x.right, i), r.stroke(), r.restore();
						});
					},
					afterDraw: (e) => {
						if (e.tooltip?._active && e.tooltip?._active.length) {
							let { ctx: t } = e, { x: n } = e.tooltip.getActiveElements()[0].element.tooltipPosition(), { index: r } = e.tooltip._active[0], i = e.scales.y.getPixelForValue(this.ybarparse[r]), a = e.scales.yLine.getPixelForValue(this.ylineparse[r]);
							t.save(), t.beginPath(), t.moveTo(n, e.scales.y.top), t.lineTo(n, e.scales.y.bottom), t.lineWidth = 1, t.strokeStyle = this.colorPrecisionBar, t.setLineDash([10, 5]), t.stroke(), t.restore(), t.save(), t.beginPath(), t.moveTo(e.scales.x.right, a), t.lineTo(n, a), t.lineWidth = 1, t.strokeStyle = this.colorPrecisionBar, t.setLineDash([10, 5]), t.stroke(), t.restore(), t.save(), t.beginPath(), t.moveTo(e.scales.x.left, i), t.lineTo(n, i), t.lineWidth = 1, t.strokeStyle = this.colorPrecisionBar, t.setLineDash([10, 5]), t.stroke(), t.restore();
						}
					}
				}],
				options: {
					aspectRatio: this.aspectRatio,
					scales: {
						x: {
							offset: !0,
							grid: {
								drawTicks: !1,
								drawOnChartArea: !1
							},
							...this.xMin ? { suggestedMin: this.xMin } : {},
							...this.xMax ? { suggestedMax: this.xMax } : {}
						},
						y: {
							type: "linear",
							position: "left",
							grid: { drawTicks: !1 },
							border: { dash: [3] },
							ticks: {
								padding: 10,
								maxTicksLimit: 5,
								callback: (e) => Math.abs(e) >= 1e9 ? `${e / 1e9}B` : Math.abs(e) >= 1e6 ? `${e / 1e6}M` : Math.abs(e) >= 1e3 ? `${e / 1e3}K` : e
							},
							...this.yBarMin ? { suggestedMin: this.yBarMin } : {},
							...this.yBarMax ? { suggestedMax: this.yBarMax } : {}
						},
						yLine: {
							type: "linear",
							position: "right",
							id: "yLine",
							beginAtZero: !0,
							grid: { drawTicks: !1 },
							border: { dash: [3] },
							ticks: {
								autoSkip: !1,
								padding: 10,
								maxTicksLimit: 5,
								callback: (e) => Math.abs(e) >= 1e9 ? `${e / 1e9}B` : Math.abs(e) >= 1e6 ? `${e / 1e6}M` : Math.abs(e) >= 1e3 ? `${e / 1e3}K` : e
							},
							...this.yLineMin ? { suggestedMin: this.yLineMin } : {},
							...this.yLineMax ? { suggestedMax: this.yLineMax } : {}
						}
					},
					plugins: {
						legend: { display: !1 },
						tooltip: {
							enabled: !1,
							displayColors: !1,
							backgroundColor: "#6b6b6b",
							callbacks: {
								label: (e) => this.datasets.map((t) => this.formatNumber(t.data[e.dataIndex])),
								title: (e) => e[0].label,
								labelTextColor: () => this.colorParse
							},
							external: (e) => {
								let t = (document.getElementById(`${this.databoxId}-${this.databoxType}-${this.databoxSource}`) || this.$el.nextElementSibling).querySelector(".tooltip"), n = e.tooltip;
								if (!t) return;
								if (!n || n.opacity === 0) {
									t.style.opacity = 0;
									return;
								}
								if (t.classList.remove("above", "below", "no-transform"), n.yAlign ? t.classList.add(n.yAlign) : t.classList.add("no-transform"), n.body) {
									let e = n.title || [], r = n.body.map((e) => e.lines), i = t.querySelector(".tooltip_header.fr-text--sm.fr-mb-0");
									i.innerText = e[0];
									let a = t.querySelector(".tooltip_value");
									a.innerHTML = "", r[0].forEach((e, t) => {
										if (e && e !== "NaN") {
											let n = t === 0 ? `${e}${this.unitTooltipBar ? ` ${this.unitTooltipBar}` : ""}` : `${e}${this.unitTooltipLine ? ` ${this.unitTooltipLine}` : ""}`;
											a.innerHTML += `
                        <div class="tooltip_value-content">
                          <span class="tooltip_dot" style="background-color:${[this.colorBarParse, this.colorParse][t]};"></span>
                          <p class="tooltip_place fr-mb-0">${n}</p>
                        </div>
                      `;
										}
									});
								}
								let { offsetLeft: r, offsetTop: i } = this.chart.canvas, a = Number(this.chart.canvas.style.width.replace(/\D/g, "")), o = Number(this.chart.canvas.style.height.replace(/\D/g, "")), s = r + n.caretX + 10, c = i + n.caretY - 20;
								s + t.clientWidth > r + a && (s = r + n.caretX - t.clientWidth - 10), c + t.clientHeight > i + .9 * o && (c = i + n.caretY - t.clientHeight + 20), s < r && (s = r + n.caretX - t.clientWidth / 2, c = i + n.caretY - t.clientHeight - 20), t.style.position = "absolute", t.style.padding = `${n.padding}px ${n.padding}px`, t.style.pointerEvents = "none", t.style.left = `${s}px`, t.style.top = `${c}px`, t.style.opacity = 1;
							}
						}
					}
				}
			});
		},
		changeColors(e) {
			this.loadColors(), this.chart.data.datasets.forEach((e) => {
				e.borderColor = this.colorParse[0], e.backgroundColor = this.colorBarParse[0], e.hoverBorderColor = this.colorHover[0], e.hoverBackgroundColor = this.colorBarHover[0], e.pointBorderColor = this.colorParse[0], e.pointBackgroundColor = this.colorParse[0], e.pointHoverBorderColor = this.colorHover[0], e.pointHoverBackgroundColor = this.colorHover[0];
			}), this.chart.options.scales.x.ticks.color = e === "dark" ? "#cecece" : J.defaults.color, this.chart.options.scales.y.ticks.color = e === "dark" ? "#cecece" : J.defaults.color, this.chart.options.scales.yLine.ticks.color = e === "dark" ? "#cecece" : J.defaults.color, this.chart.update("none");
		}
	}
}, $w = { class: "fr-col-12" }, eT = { class: "chart" }, tT = ["aria-labelledby", "aria-label"], nT = { class: "chart_legend fr-mb-0 fr-mt-4v" }, rT = { class: "flex fr-mt-3v fr-mb-1v" }, iT = { class: "fr-text--sm fr-text--bold fr-ml-1w fr-mb-0" }, aT = { class: "flex fr-mt-3v fr-mb-1v" }, oT = { class: "fr-text--sm fr-text--bold fr-ml-1w fr-mb-0" }, sT = { class: "fr-text--sm fr-text--bold fr-ml-1w fr-mb-0" }, cT = { class: "fr-text--sm fr-text--bold fr-ml-1w fr-mb-0" }, lT = {
	key: 0,
	class: "flex fr-mt-1w"
}, uT = { class: "fr-text--xs" };
function dT(e, t, n, r, i, a) {
	return !n.databoxId || i.targetReady ? (I(), Ao(Qr, {
		key: 0,
		to: "#" + n.databoxId + "-" + n.databoxType + "-" + n.databoxSource,
		disabled: !n.databoxId
	}, [R("div", {
		ref: i.widgetId,
		class: "widget_container fr-grid-row"
	}, [R("div", $w, [R("div", eT, [
		t[0] ||= R("div", { class: "tooltip" }, [R("div", { class: "tooltip_header fr-text--sm fr-mb-0" }), R("div", { class: "tooltip_body" }, [R("div", { class: "tooltip_value" })])], -1),
		R("canvas", {
			ref: i.chartId,
			role: "img",
			"aria-labelledby": n.databoxId ? "title-" + n.databoxId : null,
			"aria-label": n.databoxId ? null : "Graphique en ligne / Diagramme en barres"
		}, null, 8, tT),
		R("div", nT, [R("div", rT, [R("span", {
			class: "legend_dot",
			style: k({ "background-color": i.colorBarParse })
		}, null, 4), R("p", iT, j(e.capitalize(n.nameBar)), 1)]), R("div", aT, [R("span", {
			class: "legend_dot",
			style: k({ "background-color": i.colorParse })
		}, null, 4), R("p", oT, j(e.capitalize(n.nameLine)), 1)])]),
		(I(!0), L(F, null, Pi(i.hlineNameParse, (t, n) => (I(), L("div", {
			key: n,
			class: "flex"
		}, [
			R("span", {
				class: "legend_dash_line",
				style: k({ "background-color": i.hlineColorParse[n] })
			}, null, 4),
			R("span", {
				class: "legend_dash_line legend_dash_line_end",
				style: k({ "background-color": i.hlineColorParse[n] })
			}, null, 4),
			R("p", sT, j(e.capitalize(t)), 1)
		]))), 128)),
		(I(!0), L(F, null, Pi(i.vlineNameParse, (t, n) => (I(), L("div", {
			key: n,
			class: "flex"
		}, [
			R("span", {
				class: "legend_dash_line",
				style: k({ "background-color": i.vlineColorParse[n] })
			}, null, 4),
			R("span", {
				class: "legend_dash_line legend_dash_line_end",
				style: k({ "background-color": i.vlineColorParse[n] })
			}, null, 4),
			R("p", cT, j(e.capitalize(t)), 1)
		]))), 128)),
		n.date ? (I(), L("div", lT, [R("p", uT, "Mise à jour : " + j(n.date), 1)])) : B("", !0)
	])])], 512)], 8, ["to", "disabled"])) : B("", !0);
}
var fT = /* @__PURE__ */ fb(Qw, [["render", dT]]), pT = {
	name: "GaugeChart",
	mixins: [$y],
	props: {
		databoxId: {
			type: String,
			default: null
		},
		databoxType: {
			type: String,
			default: null
		},
		databoxSource: {
			type: String,
			default: "default"
		},
		value: {
			type: [Number, String],
			default: 0
		},
		percent: {
			type: [Number, String],
			default: null
		},
		init: {
			type: [Number, String],
			required: !0
		},
		target: {
			type: [Number, String],
			required: !0
		},
		initDate: {
			type: String,
			default: ""
		},
		targetDate: {
			type: String,
			default: ""
		},
		height: {
			type: String,
			default: "2rem"
		},
		legend: {
			type: [Boolean, String],
			default: !0
		},
		date: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			widgetId: "",
			percentage: 0,
			width: "",
			tmpColorParse: [],
			colorParse: "",
			targetReady: !1
		};
	},
	watch: {
		$props: {
			handler() {
				this.widgetId && this.createChart();
			},
			deep: !0,
			immediate: !0
		},
		targetReady(e) {
			e && this.$nextTick(() => {
				this.createChart();
			});
		}
	},
	created() {
		this.widgetId = `dsfr-widget-${Math.floor(Math.random() * 1e3)}`;
	},
	mounted() {
		if (!this.databoxId || !this.databoxType) this.createChart();
		else {
			let e = `${this.databoxId}-${this.databoxType}-${this.databoxSource}`;
			document.getElementById(e) ? this.targetReady = !0 : (this._targetObserver = new MutationObserver(() => {
				document.getElementById(e) && (this._targetObserver.disconnect(), this.targetReady = !0);
			}), this._targetObserver.observe(document.body, {
				childList: !0,
				subtree: !0
			}));
		}
		document.documentElement.addEventListener("dsfr.theme", (e) => {
			this.widgetId !== "" && this.changeColors(e.detail.theme);
		});
	},
	beforeUnmount() {
		this._targetObserver && this._targetObserver.disconnect();
	},
	methods: {
		createChart() {
			this.loadColors(), this.percent === null ? this.percentage = Math.round(100 * (Number(this.value) - Number(this.init)) / (this.target - this.init)) : this.percentage = Math.round(this.percent), this.width = Math.min(100, this.percentage);
		},
		loadColors() {
			let { colorParse: e } = Dw({
				yparse: [null],
				tmpColorParse: this.tmpColorParse,
				selectedPalette: "default"
			});
			this.colorParse = e;
		},
		changeColors(e) {
			this.loadColors();
		}
	}
}, mT = { class: "fr-col-12" }, hT = { class: "chart" }, gT = { class: "gauge-container" }, _T = { class: "jauge-text fr-text fr-text--sm fr-text-inverted--grey fr-pl-1w" }, vT = { class: "gauge-container" }, yT = { class: "fr-text--xs fr-text-mention--grey fr-mt-1w fr-mb-0" }, bT = { class: "fr-text--xs fr-text-mention--grey fr-mt-1w fr-mb-0 fr-ml-auto fr-mr-0" }, xT = {
	key: 0,
	class: "gauge-container"
}, ST = { class: "fr-text--xs fr-text-mention--grey" }, CT = { class: "fr-text--xs fr-text-mention--grey fr-ml-auto fr-mr-0" }, wT = {
	key: 1,
	class: "flex"
}, TT = {
	key: 2,
	class: "flex fr-mt-3v fr-mb-1v"
}, ET = {
	key: 3,
	class: "flex fr-mt-1w"
}, DT = { class: "fr-text--xs" };
function OT(e, t, n, r, i, a) {
	return !n.databoxId || i.targetReady ? (I(), Ao(Qr, {
		key: 0,
		to: "#" + n.databoxId + "-" + n.databoxType + "-" + n.databoxSource,
		disabled: !n.databoxId
	}, [R("div", {
		ref: i.widgetId,
		class: "widget_container fr-grid-row"
	}, [R("div", mT, [R("div", hT, [
		R("div", gT, [R("div", {
			class: "jauge",
			style: k({ height: n.height })
		}, [R("div", {
			class: "jauge-fill",
			style: k({
				width: i.width + "%",
				backgroundColor: i.colorParse
			})
		}, [R("span", _T, j(i.percentage) + "%", 1)], 4)], 4)]),
		R("div", vT, [R("p", yT, j(e.formatNumber(n.init)), 1), R("p", bT, j(e.formatNumber(n.target)), 1)]),
		n.initDate && n.targetDate ? (I(), L("div", xT, [R("p", ST, j(n.initDate), 1), R("p", CT, j(n.targetDate), 1)])) : B("", !0),
		[
			!0,
			"true",
			""
		].includes(n.legend) ? (I(), L("div", wT, [...t[0] ||= [R("span", { class: "legend_dot target_legend" }, null, -1), R("p", { class: "fr-text--sm fr-text--bold fr-ml-2v fr-mb-0" }, "Valeur cible", -1)]])) : B("", !0),
		[
			!0,
			"true",
			""
		].includes(n.legend) ? (I(), L("div", TT, [R("span", {
			class: "legend_dot",
			style: k({ backgroundColor: i.colorParse })
		}, null, 4), t[1] ||= R("p", { class: "fr-text--sm fr-text--bold fr-ml-2v fr-mb-0" }, "Valeur actuelle", -1)])) : B("", !0),
		n.date ? (I(), L("div", ET, [R("p", DT, "Mise à jour : " + j(n.date), 1)])) : B("", !0)
	])])], 512)], 8, ["to", "disabled"])) : B("", !0);
}
var kT = /* @__PURE__ */ fb(pT, [["render", OT], ["__scopeId", "data-v-2a1a80ab"]]);
//#endregion
//#region src/components/LineChart.vue
J.register(ih, F_);
var AT = {
	name: "LineChart",
	mixins: [$y],
	props: {
		databoxId: {
			type: String,
			default: null
		},
		databoxType: {
			type: String,
			default: null
		},
		databoxSource: {
			type: String,
			default: "default"
		},
		x: {
			type: String,
			required: !0
		},
		y: {
			type: String,
			required: !0
		},
		xMin: {
			type: [Number, String],
			default: ""
		},
		xMax: {
			type: [Number, String],
			default: ""
		},
		yMin: {
			type: [Number, String],
			default: ""
		},
		yMax: {
			type: [Number, String],
			default: ""
		},
		name: {
			type: String,
			default: ""
		},
		vline: {
			type: String,
			default: ""
		},
		vlinecolor: {
			type: String,
			default: ""
		},
		vlinename: {
			type: String,
			default: ""
		},
		hline: {
			type: String,
			default: ""
		},
		hlinecolor: {
			type: String,
			default: ""
		},
		hlinename: {
			type: String,
			default: ""
		},
		date: {
			type: String,
			default: ""
		},
		aspectRatio: {
			type: [Number, String],
			default: 2
		},
		selectedPalette: {
			type: String,
			default: ""
		},
		unitTooltip: {
			type: String,
			default: ""
		}
	},
	data() {
		return this.chart = void 0, {
			widgetId: "",
			chartId: "",
			datasets: [],
			labels: [],
			xAxisType: "",
			xparse: [],
			yparse: [],
			nameParse: [],
			tmpColorParse: [],
			colorParse: [],
			vlineParse: [],
			vlineColorParse: [],
			tmpVlineColorParse: [],
			vlineNameParse: [],
			hlineParse: [],
			hlineColorParse: [],
			tmpHlineColorParse: [],
			hlineNameParse: [],
			colorHover: [],
			targetReady: !1
		};
	},
	watch: {
		$props: {
			handler() {
				this.chartId && (this.resetData(), this.getData(), this.createChart());
			},
			deep: !0,
			immediate: !0
		},
		targetReady(e) {
			e && this.$nextTick(() => {
				this.resetData(), this.createChart();
			});
		}
	},
	created() {
		Qy(), this.chartId = `dsfr-chart-${Math.floor(Math.random() * 1e3)}`, this.widgetId = `dsfr-widget-${Math.floor(Math.random() * 1e3)}`;
	},
	mounted() {
		if (!this.databoxId || !this.databoxType) this.resetData(), this.createChart();
		else {
			let e = `${this.databoxId}-${this.databoxType}-${this.databoxSource}`;
			document.getElementById(e) ? this.targetReady = !0 : (this._targetObserver = new MutationObserver(() => {
				document.getElementById(e) && (this._targetObserver.disconnect(), this.targetReady = !0);
			}), this._targetObserver.observe(document.body, {
				childList: !0,
				subtree: !0
			}));
		}
		document.documentElement.addEventListener("dsfr.theme", (e) => {
			this.chartId !== "" && this.changeColors(e.detail.theme);
		});
	},
	beforeUnmount() {
		this._targetObserver && this._targetObserver.disconnect();
	},
	methods: {
		resetData() {
			this.chart && this.chart.destroy(), this.datasets = [], this.labels = [], this.xAxisType = "", this.xparse = [], this.yparse = [], this.nameParse = [], this.tmpColorParse = [], this.colorParse = [], this.vlineParse = [], this.vlineColorParse = [], this.tmpVlineColorParse = [], this.vlineNameParse = [], this.hlineParse = [], this.hlineColorParse = [], this.tmpHlineColorParse = [], this.hlineNameParse = [], this.colorHover = [];
		},
		getData() {
			try {
				this.xparse = JSON.parse(this.x), this.yparse = JSON.parse(this.y);
			} catch (e) {
				console.error("Erreur lors du parsing des données x ou y:", e);
				return;
			}
			let e = [];
			if (this.name) try {
				e = JSON.parse(this.name);
			} catch (e) {
				console.error("Erreur lors du parsing de name:", e);
			}
			this.nameParse = [];
			for (let t = 0; t < this.yparse.length; t++) e[t] ? this.nameParse.push(e[t]) : this.nameParse.push(`Série ${t + 1}`);
			if (this.vline) {
				this.vlineParse = JSON.parse(this.vline);
				let e = [];
				this.vlinename && (e = JSON.parse(this.vlinename)), this.vlinecolor && (this.tmpVlineColorParse = JSON.parse(this.vlinecolor));
				for (let t = 0; t < this.vlineParse.length; t++) e[t] ? this.vlineNameParse.push(e[t]) : this.vlineNameParse.push(`V${t + 1}`);
			}
			if (this.hline) {
				this.hlineParse = JSON.parse(this.hline);
				let e = [];
				this.hlinename && (e = JSON.parse(this.hlinename)), this.hlinecolor && (this.tmpHlineColorParse = JSON.parse(this.hlinecolor));
				for (let t = 0; t < this.hlineParse.length; t++) e[t] ? this.hlineNameParse.push(e[t]) : this.hlineNameParse.push(`H${t + 1}`);
			}
			this.labels = this.xparse[0], this.xAxisType = parseFloat(this.labels[0]) == this.labels[0] ? "linear" : "category", this.loadColors(), this.datasets = this.yparse.map((e, t) => ({
				data: e,
				fill: !1,
				pointRadius: 5,
				pointHoverRadius: 5,
				borderColor: this.colorParse[t],
				backgroundColor: this.colorParse[t],
				hoverBorderColor: this.colorHover[t],
				hoverBackgroundColor: this.colorHover[t],
				pointBorderColor: this.colorParse[t],
				pointBackgroundColor: this.colorParse[t],
				pointHoverBackgroundColor: this.colorHover[t],
				pointHoverBorderColor: this.colorHover[t],
				borderWidth: 2,
				tension: .4
			}));
		},
		loadColors() {
			this.colorParse = [], this.colorHover = [];
			let e = this.choosePalette();
			for (let t = 0; t < this.yparse.length; t++) if (this.tmpColorParse[t]) {
				let e = this.tmpColorParse[t];
				this.colorParse.push(e), this.colorHover.push(Tw(e).brighten(.5).hex());
			} else {
				let n = Iw(t, e);
				this.colorParse.push(n), this.colorHover.push(Tw(n).brighten(.5).hex());
			}
			this.vlineColorParse = [];
			for (let e = 0; e < this.vlineParse.length; e++) this.tmpVlineColorParse[e] ? this.vlineColorParse.push(this.tmpVlineColorParse[e]) : this.vlineColorParse.push(Rw());
			this.hlineColorParse = [];
			for (let e = 0; e < this.hlineParse.length; e++) this.tmpHlineColorParse[e] ? this.hlineColorParse.push(this.tmpHlineColorParse[e]) : this.hlineColorParse.push(Rw());
		},
		choosePalette() {
			return zw(this.selectedPalette);
		},
		changeColors(e) {
			this.loadColors(), this.chart.data.datasets.forEach((e, t) => {
				e.borderColor = this.colorParse[t], e.backgroundColor = this.colorParse[t], e.hoverBorderColor = this.colorHover[t], e.hoverBackgroundColor = this.colorHover[t], e.pointBorderColor = this.colorParse[t], e.pointBackgroundColor = this.colorParse[t], e.pointHoverBorderColor = this.colorHover[t], e.pointHoverBackgroundColor = this.colorHover[t];
			}), this.chart.options.scales.x.ticks.color = e === "dark" ? "#cecece" : J.defaults.color, this.chart.options.scales.y.ticks.color = e === "dark" ? "#cecece" : J.defaults.color, this.chart.update("none");
		},
		createChart() {
			this.chart && this.chart.destroy(), this.getData();
			let e = this.$refs[this.chartId].getContext("2d");
			this.chart = new J(e, {
				type: "line",
				data: {
					labels: this.labels,
					datasets: this.datasets
				},
				plugins: [{
					afterDatasetDraw: (e) => {
						this.vlineParse && this.vlineParse.forEach((t, n) => {
							let { ctx: r } = e, i = e.scales.x.getPixelForValue(t);
							r.save(), r.beginPath(), r.moveTo(i, e.scales.y.bottom), r.strokeStyle = this.vlineColorParse[n], r.lineWidth = 3, r.setLineDash([10, 5]), r.lineTo(i, e.scales.y.top), r.stroke(), r.restore();
						}), this.hlineParse && this.hlineParse.forEach((t, n) => {
							let { ctx: r } = e, i = e.scales.y.getPixelForValue(t);
							r.save(), r.beginPath(), r.moveTo(e.scales.x.left, i), r.strokeStyle = this.hlineColorParse[n], r.lineWidth = 3, r.setLineDash([10, 5]), r.lineTo(e.scales.x.right, i), r.stroke(), r.restore();
						});
					},
					afterDraw: (e) => {
						if (e.tooltip?._active && e.tooltip?._active.length) {
							let { ctx: t } = e, { x: n } = e.tooltip.getActiveElements()[0].element.tooltipPosition(), { index: r } = e.tooltip._active[0];
							t.save(), t.beginPath(), t.moveTo(n, e.scales.y.top), t.lineTo(n, e.scales.y.bottom), t.lineWidth = 1, t.strokeStyle = this.colorPrecisionBar, t.setLineDash([10, 5]), t.stroke(), t.restore(), this.yparse.forEach((n) => {
								let i = e.scales.y.getPixelForValue(n[r]);
								t.save(), t.beginPath(), t.moveTo(e.scales.x.left, i), t.lineTo(e.scales.x.right, i), t.lineWidth = 1, t.strokeStyle = this.colorPrecisionBar, t.setLineDash([10, 5]), t.stroke(), t.restore();
							});
						}
					}
				}],
				options: {
					aspectRatio: this.aspectRatio,
					scales: {
						x: {
							offset: !0,
							type: this.xAxisType,
							grid: { drawOnChartArea: !1 },
							ticks: {
								padding: 10,
								callback: (e) => this.xAxisType === "category" ? this.labels[e] : e
							},
							...this.xMin ? { suggestedMin: this.xMin } : {},
							...this.xMax ? { suggestedMax: this.xMax } : {}
						},
						y: {
							grid: { drawTicks: !1 },
							border: { dash: [3] },
							ticks: {
								autoSkip: !1,
								padding: 5,
								maxTicksLimit: 5,
								callback: (e) => Math.abs(e) >= 1e9 ? `${e / 1e9}B` : Math.abs(e) >= 1e6 ? `${e / 1e6}M` : Math.abs(e) >= 1e3 ? `${e / 1e3}K` : e
							},
							...this.yMin ? { suggestedMin: this.yMin } : {},
							...this.yMax ? { suggestedMax: this.yMax } : {}
						}
					},
					plugins: {
						legend: { display: !1 },
						tooltip: {
							enabled: !1,
							displayColors: !1,
							backgroundColor: "#6b6b6b",
							callbacks: {
								label: (e) => this.datasets.map((t) => this.formatNumber(t.data[e.dataIndex])),
								title: (e) => e[0].label,
								labelTextColor: () => this.colorParse
							},
							external: (e) => {
								let t = (document.getElementById(`${this.databoxId}-${this.databoxType}-${this.databoxSource}`) || this.$el.nextElementSibling).querySelector(".tooltip"), n = e.tooltip;
								if (!t) return;
								if (!n || n.opacity === 0) {
									t.style.opacity = 0;
									return;
								}
								if (t.classList.remove("above", "below", "no-transform"), n.yAlign ? t.classList.add(n.yAlign) : t.classList.add("no-transform"), n.body) {
									let e = n.title || [], r = n.body.map((e) => e.lines), i = t.querySelector(".tooltip_header.fr-text--sm.fr-mb-0");
									i.innerText = e[0];
									let a = t.querySelector(".tooltip_value");
									a.innerHTML = "", r[0].forEach((e, t) => {
										if (e && e !== "NaN") {
											let n = `${e}${this.unitTooltip ? ` ${this.unitTooltip}` : ""}`;
											a.innerHTML += `
                        <div class="tooltip_value-content">
                          <span class="tooltip_dot" style="background-color:${this.colorParse[t]};"></span>
                          <p class="tooltip_place fr-mb-0">${n}</p>
                        </div>
                      `;
										}
									});
								}
								let { offsetLeft: r, offsetTop: i } = this.chart.canvas, a = Number(this.chart.canvas.style.width.replace(/\D/g, "")), o = Number(this.chart.canvas.style.height.replace(/\D/g, "")), s = r + n.caretX + 10, c = i + n.caretY - 20;
								s + t.clientWidth > r + a && (s = r + n.caretX - t.clientWidth - 10), c + t.clientHeight > i + .9 * o && (c = i + n.caretY - t.clientHeight + 20), s < r && (s = r + n.caretX - t.clientWidth / 2, c = i + n.caretY - t.clientHeight - 20), t.style.position = "absolute", t.style.padding = `${n.padding}px ${n.padding}px`, t.style.pointerEvents = "none", t.style.left = `${s}px`, t.style.top = `${c}px`, t.style.opacity = 1;
							}
						}
					}
				}
			});
		}
	}
}, jT = { class: "fr-col-12" }, MT = { class: "chart" }, NT = ["aria-labelledby", "aria-label"], PT = { class: "chart_legend fr-mb-0 fr-mt-4v" }, FT = { class: "fr-text--sm fr-text--bold fr-ml-1w fr-mb-0" }, IT = { class: "fr-text--sm fr-text--bold fr-ml-1w fr-mb-0" }, LT = { class: "fr-text--sm fr-text--bold fr-ml-1w fr-mb-0" }, RT = {
	key: 0,
	class: "flex fr-mt-1w"
}, zT = { class: "fr-text--xs" };
function BT(e, t, n, r, i, a) {
	return !n.databoxId || i.targetReady ? (I(), Ao(Qr, {
		key: 0,
		to: "#" + n.databoxId + "-" + n.databoxType + "-" + n.databoxSource,
		disabled: !n.databoxId
	}, [R("div", {
		ref: i.widgetId,
		class: "widget_container fr-grid-row"
	}, [R("div", jT, [R("div", MT, [
		t[0] ||= R("div", { class: "tooltip" }, [R("div", { class: "tooltip_header fr-text--sm fr-mb-0" }), R("div", { class: "tooltip_body" }, [R("div", { class: "tooltip_value" })])], -1),
		R("canvas", {
			ref: i.chartId,
			role: "img",
			"aria-labelledby": n.databoxId ? "title-" + n.databoxId : null,
			"aria-label": n.databoxId ? null : "Graphique en ligne"
		}, null, 8, NT),
		R("div", PT, [(I(!0), L(F, null, Pi(i.nameParse, (t, n) => (I(), L("div", {
			key: n,
			class: "flex fr-mt-3v fr-mb-1v"
		}, [R("span", {
			class: "legend_dot",
			style: k({ "background-color": i.colorParse[n] })
		}, null, 4), R("p", FT, j(e.capitalize(t)), 1)]))), 128))]),
		(I(!0), L(F, null, Pi(i.hlineNameParse, (t, n) => (I(), L("div", {
			key: n,
			class: "flex fr-mt-3v"
		}, [
			R("span", {
				class: "legend_dash_line",
				style: k({ "background-color": i.hlineColorParse[n] })
			}, null, 4),
			R("span", {
				class: "legend_dash_line legend_dash_line_end",
				style: k({ "background-color": i.hlineColorParse[n] })
			}, null, 4),
			R("p", IT, j(e.capitalize(t)), 1)
		]))), 128)),
		(I(!0), L(F, null, Pi(i.vlineNameParse, (t, n) => (I(), L("div", {
			key: n,
			class: "flex fr-mt-3v fr-mb-1v"
		}, [
			R("span", {
				class: "legend_dash_line",
				style: k({ "background-color": i.vlineColorParse[n] })
			}, null, 4),
			R("span", {
				class: "legend_dash_line legend_dash_line_end",
				style: k({ "background-color": i.vlineColorParse[n] })
			}, null, 4),
			R("p", LT, j(e.capitalize(t)), 1)
		]))), 128)),
		n.date ? (I(), L("div", RT, [R("p", zT, "Mise à jour : " + j(n.date), 1)])) : B("", !0)
	])])], 512)], 8, ["to", "disabled"])) : B("", !0);
}
var VT = /* @__PURE__ */ fb(AT, [["render", BT]]), HT = { class: "map_info fr-col-12 fr-col-lg-3" }, UT = { key: 0 }, WT = { class: "flex fr-text--sm fr-text--bold fr-mb-2w" }, GT = { class: "fr-text--sm fr-text--bold fr-mb-1v" }, KT = { class: "fr-text--md fr-text--bold fr-my-0" }, qT = { class: "scale fr-mt-auto" }, JT = { class: "scale_values" }, YT = { class: "min fr-text--sm fr-text--bold fr-mb-0" }, XT = { class: "max fr-text--sm fr-text--bold fr-mb-0" }, ZT = /* @__PURE__ */ fb({
	__name: "MapInfo",
	props: { data: {
		type: Object,
		required: !0
	} },
	setup(e) {
		let t = e, n = Ss(() => `linear-gradient(90deg,${t.data.colorMin} 0%,${t.data.colorMax} 100%)`);
		return (t, r) => (I(), L("div", HT, [
			e.data.valueNat !== null || e.data.valueReg !== null ? (I(), L("div", UT, [
				R("p", {
					class: "fr-text--xs fr-text--bold fr-mb-1v",
					style: k({ color: e.data.textMention })
				}, j(e.data.names) + ", " + j(e.data.level), 5),
				R("p", {
					class: "fr-text--xs fr-text--bold fr-mb-2w",
					style: k({ color: e.data.textMention })
				}, j(ln(zy)(e.data.value)), 5),
				r[0] ||= R("div", { class: "sep fr-mb-2w" }, null, -1)
			])) : B("", !0),
			R("div", null, [
				R("p", {
					class: "fr-text--xs fr-mb-1v",
					style: k({ color: e.data.textMention })
				}, " Localisation ", 4),
				R("p", WT, [R("span", null, j(e.data.localisation), 1)]),
				e.data.date ? (I(), L("p", {
					key: 0,
					class: "fr-text--xs fr-mb-1v",
					style: k({ color: e.data.textMention })
				}, " Mise à jour : " + j(e.data.date), 5)) : B("", !0),
				R("p", GT, j(e.data.names), 1),
				R("p", KT, j(ln(zy)(e.data.valueNat || e.data.valueReg || e.data.value)), 1)
			]),
			R("div", qT, [
				r[1] ||= R("div", { class: "sep fr-my-2w" }, null, -1),
				R("p", {
					class: "fr-text--xs fr-mb-1w",
					style: k({ color: e.data.textMention })
				}, " Légende ", 4),
				R("div", {
					class: "scale_container",
					style: k({ background: n.value })
				}, null, 4),
				R("div", JT, [R("span", YT, j(ln(zy)(e.data.min)), 1), R("span", XT, j(ln(zy)(e.data.max)), 1)])
			])
		]));
	}
}, [["__scopeId", "data-v-35c0f0e9"]]), QT = ["viewBox"], $T = ["stroke"], eE = {
	__name: "France",
	props: {
		config: {
			type: Object,
			required: !0
		},
		onClick: {
			type: Function,
			required: !0
		},
		onDblClick: {
			type: Function,
			required: !0
		},
		onEnter: {
			type: Function,
			required: !0
		},
		onLeave: {
			type: Function,
			required: !0
		}
	},
	setup(e) {
		return (t, n) => (I(), L("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: e.config.viewBox
		}, [R("g", {
			fill: "#5C68E5",
			stroke: e.config.colorStroke,
			"stroke-width": ".2%"
		}, [
			R("path", {
				class: "FR-2A",
				style: k({ display: e.config.displayPath["FR-2A"] }),
				d: "M930 907v3l3 3 6 4 1 3-4 1-5 1v2l2 2v8l8 2 3 1 2 4-2 2-2 1-3 4-2 3 1 6h6l1 1 5-2 2 1-3 6 3 2-5 3-2 7 8 2 11 1-5 5s-2-1-3-1v1c0 2-3 6-3 7l4 3 6 4 12 4 4 1 3 2-2 3h6l1 3h5l2-7-4-1 5-5-1-2v-3l7-4v-4h-4l-3 2v-4h5l2-4 2-13-1-5v-5l-7 4h-7l-1-5 1-1-2-2-1-9-1-2h-4l-2-1v-6l-2-2-2-1-4-5v-3h-5l-2-5h-6l-4-4 1-2-2-1h-5l-2-1h-8v-2z",
				onClick: n[0] ||= (t) => e.onClick(t),
				onDblclick: n[1] ||= (t) => e.onDblClick(),
				onMouseenter: n[2] ||= (t) => e.onEnter(t),
				onMouseleave: n[3] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-2B",
				style: k({ display: e.config.displayPath["FR-2B"] }),
				d: "m990 834-5 4v4l3 3-3 3 1 3-2 2v3l4 4v5l-2 4-3 1-3-3h-5l-1-1h-4l-4 4-2 6-9 2-7 6-2 4-3-1-2-2-1 6-3 1v6l1 3-4 3-1 3h4v2h7l2 1h6l2 1-1 2 4 4h6l2 5h5v3l3 5 3 1 2 2v6l2 2h4l1 1 1 9 2 2-1 1 1 5h7l7-4-1-11 9-12v-20l-4-7-1-22-2-4-5-4-1-13 2-6-2-10-2-8-2-2z",
				onClick: n[4] ||= (t) => e.onClick(t),
				onDblclick: n[5] ||= (t) => e.onDblClick(),
				onMouseenter: n[6] ||= (t) => e.onEnter(t),
				onMouseleave: n[7] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-13",
				style: k({ display: e.config.displayPath["FR-13"] }),
				d: "m686 750-10 5-3 20-11-2-3 8 3 4-12 7-3 8h11l15 1 3 3h-5l-4 6 16 3 12-2-7-6 5-4 7 3 3 7 20 1 6-3 1 4-6 5h8l-1 4-2 2h17l9 3 1 1v-7l3-3 3-2v-2l-3-2h-3l-2-2 3-3v-1l-3-1v-3h7l2-1-6-6v-7l-4-3 3-7 8-5-6-4-4 3-10 3-7-1-15-6h-8l-7-3-3-4-5-6-13-5h-1z",
				onClick: n[8] ||= (t) => e.onClick(t),
				onDblclick: n[9] ||= (t) => e.onDblClick(),
				onMouseenter: n[10] ||= (t) => e.onEnter(t),
				onMouseleave: n[11] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-84",
				style: k({ display: e.config.displayPath["FR-84"] }),
				d: "M699 697h-5l-4 6 1 7 6 1-1 2-5 1-5 5-1-2 1-7-2-2-10 1-2 4 1 1 6 10v8l11 11v4l-4 3 13 5 5 6 3 4 7 3h9l14 6 8 1 9-3 4-3 1-2-7-9h-9v-3l3-3v-4l-6-3-1-5 4-2v-4l-4-1-1-5h-3l-6-5-1-4-10-1-7-1-1-4 2-5-4 4-8-1-1-3 5-6z",
				onClick: n[12] ||= (t) => e.onClick(t),
				onDblclick: n[13] ||= (t) => e.onDblClick(),
				onMouseenter: n[14] ||= (t) => e.onEnter(t),
				onMouseleave: n[15] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-83",
				style: k({ display: e.config.displayPath["FR-83"] }),
				d: "M830 756h-6l-2 2h-10l-9 6-6-4-9 3-1 4-7 5-12-8-9 3-1 2 7 4-8 6-4 6 4 3v7l6 6-2 1h-7v3l4 1v1l-3 3 1 2h3l3 2v2l-3 2-3 3v7l1 2 6 2 2 8 4 1 4-3 6-4 11 1v3l-4 2h9l-2-2-1-5 5-3 5 2h2l2 3 3-2v-5l3-2h8l2-4 5 2 6-3v-9h-8l6-3 3-4 1-6 10-1 6-7-4-4v-2l-2-2 2-2v-4l-5-2h-2l-4-3v-8l-5-1-4-1-1-4z",
				onClick: n[16] ||= (t) => e.onClick(t),
				onDblclick: n[17] ||= (t) => e.onDblClick(),
				onMouseenter: n[18] ||= (t) => e.onEnter(t),
				onMouseleave: n[19] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-04",
				style: k({ display: e.config.displayPath["FR-04"] }),
				d: "m841 665-4 6-5 4-2 3-5 1v3l-2 2-2 5h-11l-6-3-4 3-6-1-2 3h2v6h-1l-6-3v-3l-4-3h-2v4h-3l-6 4-4 6-1 4h2l1 5h-2l-4-3-2 1 1 2 5 7-3 1-3-2h-6l-6 6v2l-2-3-3-2-2 5-3 3h-2l1 5 4 1v4l-4 2 1 5 6 3v4l-3 3v3h8l8 9 9-3 12 8 7-5 1-4 10-3 5 4 9-6h10l2-2h6l-2-4 2-2v-2h5l1-2 5-3 4 3 2-2-6-5-6-6-3-1v-5l-4-6 2-8 1-5 4-3v-4l5-3h1v-7l5-1-3-3-3-1-2-4 1-4 7-7-1-5h1z",
				onClick: n[20] ||= (t) => e.onClick(t),
				onDblclick: n[21] ||= (t) => e.onDblClick(),
				onMouseenter: n[22] ||= (t) => e.onEnter(t),
				onMouseleave: n[23] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-06",
				style: k({ display: e.config.displayPath["FR-06"] }),
				d: "M841 698h-1l-5 3v4l-4 3-1 5-2 8 4 6v5l3 1 6 6 6 5-2 2-4-3-5 3-1 2h-5v2l-2 2 2 4-4 2 1 4h4l5 2v7l4 4h2l5 2v3l-2 3 2 1v3l4 4 1-9 7 2 2-3h4v-11l9-1 7-6h6l1-4 6-4-4-8 6-5-1-5 8-3 2-8-1-5-2-3-2-5h-5l-17 6h-5l-10-7-9-3h-5v-6z",
				onClick: n[24] ||= (t) => e.onClick(t),
				onDblclick: n[25] ||= (t) => e.onDblClick(),
				onMouseenter: n[26] ||= (t) => e.onEnter(t),
				onMouseleave: n[27] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-05",
				style: k({ display: e.config.displayPath["FR-05"] }),
				d: "m810 619-3 1-1 6-6 1-1-6-2-2-7 1-2 2-2 8 1 2h8l1 5 3 1v8h-7l-2 3-9-1-4 4-4-2-4 4 1 3-2 3h-10v4l3 2-1 2-6 3-7 1-3 6v5l4 3-4 5-5-3h-6v3l3 3-4 3 1 6 13 3 2 5h3l-1 11 6-5h6l3 2 3-1-5-7-1-2 2-1 4 3h2l-1-5h-2l1-4 4-6 6-4h3v-4h2l4 3v3l6 3h2l-1-6h-2l2-3 6 1 4-3 6 3h11l2-5 2-2v-3l5-1 1-3 6-4 4-6 5 1 3-4h4v-3l-5-3-1-10-4-1h-5l-10-4-1-11-6-2-1-4-3-5z",
				onClick: n[28] ||= (t) => e.onClick(t),
				onDblclick: n[29] ||= (t) => e.onDblClick(),
				onMouseenter: n[30] ||= (t) => e.onEnter(t),
				onMouseleave: n[31] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-48",
				style: k({ display: e.config.displayPath["FR-48"] }),
				d: "m577 643-10 4-3 6-7-4-5 16-5 12 7 9v7l5 4v8l2 13 6 2-1 4 9-1 3 1-2 2 11 7 10-2 1-2-1-3 4-1 6 5 9 1 4-7v-5l3-3-2-1v-7l-6-6h5l2-2 2-4-2-1 1-7-6-7-3-13-9-12-7 2-1-6h-4v5l-10 3z",
				onClick: n[32] ||= (t) => e.onClick(t),
				onDblclick: n[33] ||= (t) => e.onDblClick(),
				onMouseenter: n[34] ||= (t) => e.onEnter(t),
				onMouseleave: n[35] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-03",
				style: k({ display: e.config.displayPath["FR-03"] }),
				d: "m541 451-5 6h-3l-3 4-3-4-10 9v6l2 2v2l-5 4-5-1-9 2-4 5-2 4 4 6v4l3 4 2-4 3 5 4 2 4 9v3l6 4 3-1 2-6h2v-3l4-1 1 2 5-5h5l1 2-2 3 3 5 1 2 9 5 12 2h3l5 1 4-3 3 2 1 4 4 1h6l1 4 5 2v-2h9l-1-21-2-5 1-4 6-1 8-6v-14l-3-4h-5l-2-3h-7l-1-2v-5l-8-14-3-2-7 9-3 1-1-5-3-2-2 3h-5l-1-3-4 2-3 2-5-4-6-3v-5z",
				onClick: n[36] ||= (t) => e.onClick(t),
				onDblclick: n[37] ||= (t) => e.onDblClick(),
				onMouseenter: n[38] ||= (t) => e.onEnter(t),
				onMouseleave: n[39] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-30",
				style: k({ display: e.config.displayPath["FR-30"] }),
				d: "m624 696-2 4-2 2h-5l6 6v7l2 1-3 3v5l-4 7-9-1-6-5-4 1 1 3-1 3-10 1-11-7-2 2v5l-4 1 1 4 5 1h6l1 7-6 3v4l5 2v2l2 2 2-2h3l1 3h4l2-7h3l5-6h6l1 9 2 3 4-2 6 3 2 4 11 6 4 10v4l-7 4-5 4 6 1v7h13l3-8 12-7-3-4 3-8 11 2 2-20 15-8v-4l-11-11v-8l-6-10-13-7-1 5-5 1-2-6-5 1-1 7-4-1-8-6-4 2v-10z",
				onClick: n[40] ||= (t) => e.onClick(t),
				onDblclick: n[41] ||= (t) => e.onDblClick(),
				onMouseenter: n[42] ||= (t) => e.onEnter(t),
				onMouseleave: n[43] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-11",
				style: k({ display: e.config.displayPath["FR-11"] }),
				d: "m491 802-1 7-6-2h-7v-3l-4 1-7 2-3-4-5 4 2 4-6 2-1 6-5 2 5 5-1 3 17 8 2 13v6l1 9h-9l-3 4 12 9 7-3 8 9-1 1h1l15-7-4-5v-6h34l-1-5 8-4 10 7 4 2v-22l-4 1-4-6 3-5 6 6 6-4 3-4 1-4h-5l-1-5h-5l-4-7-4 1-3-2-1-6-2 1 1 4h-5v6l-7 3-3-7-5 3-4-3-1-5 3-4-2-4h-11l-11-2z",
				onClick: n[44] ||= (t) => e.onClick(t),
				onDblclick: n[45] ||= (t) => e.onDblClick(),
				onMouseenter: n[46] ||= (t) => e.onEnter(t),
				onMouseleave: n[47] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-34",
				style: k({ display: e.config.displayPath["FR-34"] }),
				d: "m604 747-5 6h-3l-2 7h-4l-1-3h-3l-2 2-2-2v-3l-5-2v2l-7 1-3 3 1 6h-5l-6-3h-3v4l1 10h-10l-2 4-13 5-5-4-3 5-2 5 6 5-2 7-8 2 2 4-3 4 1 5 4 3 5-3 3 7 7-3v-6h5l-1-4 2-1 1 6 3 2 4-1 4 7h5l1 5h5v-2l13-3 1-4h11l3-4 19-16 12-8h5l5-4 7-4v-5l-4-9-11-6-2-5-6-3-4 2-2-2-1-9z",
				onClick: n[48] ||= (t) => e.onClick(t),
				onDblclick: n[49] ||= (t) => e.onDblClick(),
				onMouseenter: n[50] ||= (t) => e.onEnter(t),
				onMouseleave: n[51] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-66",
				style: k({ display: e.config.displayPath["FR-66"] }),
				d: "m539 858-8 4 1 5h-34v6l4 5-15 7h-14l-1 3-6 2-4 4-12 2 1 4 6 5 10 3v6l6 5h5l6-8 7-1 12 4 10 8 3-3h3l2 2 2-2 1-5 11-2 3-5 6-2h7l5 5 6 1v-6l-3-4-5-2-1-32-5-2z",
				onClick: n[52] ||= (t) => e.onClick(t),
				onDblclick: n[53] ||= (t) => e.onDblClick(),
				onMouseenter: n[54] ||= (t) => e.onEnter(t),
				onMouseleave: n[55] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-15",
				style: k({ display: e.config.displayPath["FR-15"] }),
				d: "m512 590-1 4 2 5-2 2h-4l-4-4-3-2v10l-7 5-4 6 1 6-2 3-2 6h-2l-3 4 2 2 1 4-4 3 1 12 7 5-5 10 5 2-2 6 4 1 3-5h5l1 1h11l2-4 3-1 1-8h2v-9l11-9 1 1 1 7 7-1 1 10h4l1 11 3 3 5-11 5-16 7 4 3-7 9-3v-3l-2-3-4-2 2-3-2-2h2l3-2-4-1-2-2-1-7-2-2-2-6h-8l-2-5h-2l-2 3-5-1-5-7-2-1-4-2-2 3h-6l-3-7z",
				onClick: n[56] ||= (t) => e.onClick(t),
				onDblclick: n[57] ||= (t) => e.onDblClick(),
				onMouseenter: n[58] ||= (t) => e.onEnter(t),
				onMouseleave: n[59] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-43",
				style: k({ display: e.config.displayPath["FR-43"] }),
				d: "m571 595-2 2v2h-4l-4 3-6 1-2 2h1l2 5h8l2 6 2 2 1 7 1 2 5 1-3 2h-2l2 2-2 3 4 2 2 3v3h1l6 17 9-3 1-5h4l1 6 7-2 8 10 6-8 9-7h9l3-9h5l1-7h5l-1-2-1-5 2-4 5-2 2-8-5-6h-6l1-6-11-5h-4l-8 6-8-2-1 2-5-2-3-3-2 4-5-1-3-2-2 5-4-2-2-4h-3l-2-2-4 1h-5l-2-1-2 1z",
				onClick: n[60] ||= (t) => e.onClick(t),
				onDblclick: n[61] ||= (t) => e.onDblClick(),
				onMouseenter: n[62] ||= (t) => e.onEnter(t),
				onMouseleave: n[63] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-63",
				style: k({ display: e.config.displayPath["FR-63"] }),
				d: "m537 509-5 5v-2l-5 1v3h-2l-2 6-3 1-5-4v8l3 4 1 7-4 3-1 5-4 2-7 4 1 3 8 9 1 5-3 5v5l2 3 1 6-1 2 11 4 3 6h6l2-2 4 1 2 1 5 7 5 1 2-3h1l2-2 6-1 4-3h4v-3l2-1 1 2 2-1 2 1h5l4-2 2 3h3l2 4 4 1 2-4 3 2 5 1 2-4 3 3 5 1 1-1-2-1-1-4 6-7-3-12-9-6-4-9-5-6 2-8 3-3-6-5v-1l-5-2-2-4h-5l-4-1-1-4-3-2-4 2-5-1-4 1-11-2-9-5-1-3-3-4 2-4-1-1z",
				onClick: n[64] ||= (t) => e.onClick(t),
				onDblclick: n[65] ||= (t) => e.onDblClick(),
				onMouseenter: n[66] ||= (t) => e.onEnter(t),
				onMouseleave: n[67] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-65",
				style: k({ display: e.config.displayPath["FR-65"] }),
				d: "m315 784-3 2 6 10-3 4 2 4 5 6-4 5-5 13-10 8 2 5-2 2-5-1-2 12-3 2v7h1l6 3 7 6 1 4 5 5h5l12-5 5 6 7 1 2-4 4 1 7 1-1-19h4l3 1 2-2v-4l5-2-2-7-2-2-4 2 2-4-1-4-6-4 1-3 3-6 4-1v-3l3-3 1-3-6-3h-9l-1-3h-5l-1-3h-5l-1 1h-5v-3l-4-2 1-1 1-4-1-1-2-5-4-1-4-2v-6z",
				onClick: n[68] ||= (t) => e.onClick(t),
				onDblclick: n[69] ||= (t) => e.onDblClick(),
				onMouseenter: n[70] ||= (t) => e.onEnter(t),
				onMouseleave: n[71] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-64",
				style: k({ display: e.config.displayPath["FR-64"] }),
				d: "m302 785-5 3-10-1-1-1-7 2-5 1-4-3-5 2-1-2h-5l-3 2h-9l-4 3h-9l-1 2-2-1 2-3-4-3-6 5h-9l-11-5-1 3-8 10-7 3h-4v4l4 4h6l1 5 5 1 1-4 7 3 4 1 1 5-2 2v7l-5 2v3l3 4 6 2 1-6 3-3-1 5 3 3h6l3 4 9 2 8 5h14l1 7 9 7 4 5 4-2 3-1 2 2 3-2 7-4v-7l3-2 2-12 5 1 2-2-2-5 9-8 6-13 4-5-5-6-2-4 3-4-6-10-9-1z",
				onClick: n[72] ||= (t) => e.onClick(t),
				onDblclick: n[73] ||= (t) => e.onDblClick(),
				onMouseenter: n[74] ||= (t) => e.onEnter(t),
				onMouseleave: n[75] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-40",
				style: k({ display: e.config.displayPath["FR-40"] }),
				d: "m243 684-12 6h-3l-6 34-8 32-3 12-2 9-6 9 11 5h9l6-5 4 4-2 2 2 1 1-2h9l4-4 9 1 3-2h5l1 2 5-2 3 3 6-1 7-2 1 1 10 1 5-3-2-5 2-7 4-4-1-7 3-3-5-7 4-4 4-1 4 2 5-5 1 6 2 2 4-1v-4l1-3-1-2 1-7 4-4-2-3h-4l-5-2-7 1-2-8-4-6h-2l1 6v2l-7 1-6-3-2-8-4-5h-3l-1-3-3-2-6-2 2-2v-2l-2-2-3-1h-6l-4 4h-3l-4-3-6 3-3-2 2-3 1-5z",
				onClick: n[76] ||= (t) => e.onClick(t),
				onDblclick: n[77] ||= (t) => e.onDblClick(),
				onMouseenter: n[78] ||= (t) => e.onEnter(t),
				onMouseleave: n[79] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-33",
				style: k({ display: e.config.displayPath["FR-33"] }),
				d: "m245 575-6 9-2 30-4 30-4 24v6l3-8 5-6 7 6 1 2 2 3-9 1-2-3-3 2-1 5-4 6v8h3l11-6 7 2-1 4-2 4 3 1 6-2 4 3h3l3-4 7-1 2 2 2 2v2l-1 2 6 2 3 2v3h4l4 5 2 8 6 2h6v-8h2l3 5 6-1 3-3-1-3-2-2 1-4h3l4-2-2-4-1-4 3-5 5-8 4-4 3-1v-4h-3l-2-4 1-3 5-1 3-1 4-1-1-7 4-2-5-3-4 5h-11l-1-2-4-2 3-3v-4l-1-2v-1l3-3 1-5 2-6-2-3h-4l-2-2-1 4-4-2-5 2-4-1-9-8h-5l-1-12-10-1v-5l-2 1h-10v3l3 10v11l-1 2-2-8-5-20-19-17 1-7-4-1z",
				onClick: n[80] ||= (t) => e.onClick(t),
				onDblclick: n[81] ||= (t) => e.onDblClick(),
				onMouseenter: n[82] ||= (t) => e.onEnter(t),
				onMouseleave: n[83] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-24",
				style: k({ display: e.config.displayPath["FR-24"] }),
				d: "m372 566-3 6h-6v9l-17 12v12l-7 7-3 3-7-1-4 7-1 2 1 3h4l2 3-2 5-1 6-3 2v2l1 1v4l-2 3 3 2 1 3 11-1 4-5 5 3-4 2 1 7 5 4 1 7 5 2 3-3h8l3-3h3v3h8l1-2h3l3 3v3l-3 1 1 2 4 1 4-4h4l3 3 5 2 1-1 3-3 1-6h7l6-8h-3v-4l6-1v-4l3-1 4-6-4-4v-4l3-2-3-5v-8h-8l-3-2 3-3-4-4 3-3-3-2v-5l7-6-4-3-2-6-8-1-2-2 5-2-2-3-8-1-2-7-11-1-3 3-2 1-3-4 1-4-2-4z",
				onClick: n[84] ||= (t) => e.onClick(t),
				onDblclick: n[85] ||= (t) => e.onDblClick(),
				onMouseenter: n[86] ||= (t) => e.onEnter(t),
				onMouseleave: n[87] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-47",
				style: k({ display: e.config.displayPath["FR-47"] }),
				d: "M345 664h-4l-3 1-5 1-1 4 2 3 3 1v3l-3 1-3 4-6 8-2 5 1 5 1 3-4 2h-3l-1 4 3 2v3l-3 3-5 1v1l2 8 7-1 5 2h4l2 3-4 4-1 7 1 2 1-3 5 4 5-6 3 4 6-1 7-1 2-5 11-1 6 5 2-2 3-1-1-5 5-1 7-2-2-4 3-3 1-6-4-5 3-8 6 3 7-1-3-8-3-11h7l2-4-6-2-3-3h-4l-4 4-4-1-1-2 3-1v-3l-3-3-3-1-2 2h-7v-2h-2l-4 3h-8l-3 3-5-2-1-7-5-4z",
				onClick: n[88] ||= (t) => e.onClick(t),
				onDblclick: n[89] ||= (t) => e.onDblClick(),
				onMouseenter: n[90] ||= (t) => e.onEnter(t),
				onMouseleave: n[91] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-46",
				style: k({ display: e.config.displayPath["FR-46"] }),
				d: "m441 634-7 4h-1l-3 2v4l4 4-4 6-3 1v4l-6 1v3l3 1-6 8h-8v6l-3 3-2 5h-7l3 11 3 7 4-1 1 2-3 3 2 4h3l3 4h3l2-3 1 1v3l1 4h7l5-5 3-1 1 2 2 4h3l1-7 5 1 3-4 6 1 8-4v1l2-2-3-5-1-7 4-3h2l6-6h3l1-2h7l2-2 1-2-3-1 2-6-5-2 5-10-6-5-2-13-6-2-4 4-2-3-6 6h-4l-8-10z",
				onClick: n[92] ||= (t) => e.onClick(t),
				onDblclick: n[93] ||= (t) => e.onDblClick(),
				onMouseenter: n[94] ||= (t) => e.onEnter(t),
				onMouseleave: n[95] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-09",
				style: k({ display: e.config.displayPath["FR-09"] }),
				d: "m422 817-2 2-1 1 5 4 1 2-1 2-8 1-2 3v1l3 1 2 2-2 3h-2l-4-3-4-2-5 1-7 4v7l2 1-1 5-8 2-4 4v7l2 1-3 3 1 1 11 3h5l7 7h15l6 9 6-2 15 2 1 7 12-2 4-4 6-2 1-3 14-1-8-9-7 3-12-9 3-4h9l-1-9v-6l-2-13-17-8v-3l-3-4-3 1-4 1-7-4h-2l3 4-1 2h-6l-1-4-3-5z",
				onClick: n[96] ||= (t) => e.onClick(t),
				onDblclick: n[97] ||= (t) => e.onDblClick(),
				onMouseenter: n[98] ||= (t) => e.onEnter(t),
				onMouseleave: n[99] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-32",
				style: k({ display: e.config.displayPath["FR-32"] }),
				d: "m368 735-11 1-2 5-7 1-6 1-3-4-5 6-5-4-2 6v4l-4 1-2-2-1-6-5 5-4-2-4 1-4 4 5 8-3 2 1 7-4 4-2 7 3 5 9 1 3-2h6v6l4 2 4 1 2 5 1 1-1 4-1 1 4 2v3h5l1-1h5l1 3h5l1 3h9l6 3 1-1 4-2 6-8 12 1 5 3 2-2 3-8 3-7 7-3 3-2-1-2-3-1-2-3h-2l-4-4v-3l-6-6-1-3-3 1-1-2 2-3-3-3v-4l-2-3h-7v-4l4-3v-4l4-1-2-2-3 2h-5l-2-2h-1l-1 2z",
				onClick: n[100] ||= (t) => e.onClick(t),
				onDblclick: n[101] ||= (t) => e.onDblClick(),
				onMouseenter: n[102] ||= (t) => e.onEnter(t),
				onMouseleave: n[103] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-31",
				style: k({ display: e.config.displayPath["FR-31"] }),
				d: "m437 754-5 2-2 3-2-2-4-1v3l-3 1 4 2-3 4-8 2-3-4h-4l-2 1h-10l-1 1 1 3 6 6v3l4 4h2l2 3 3 1 1 2-3 2-7 3-3 7-3 8-2 2-5-3-12-1-7 8-3 2-2 4-3 3v3l-4 1-3 6-1 3 6 4 1 4-2 4 4-2 2 2 2 7-5 2v4l-2 2-3-2h-4l1 20 14 1 1-18 5 1 8 4 3-3-2-1v-7l4-4 8-2 1-5-2-1v-7l7-4 5-1 4 2 4 3h2l2-3-2-2-3-1v-1l2-3 8-1 1-2-1-2-5-4 1-1 2-2h3l3 5 1 4h6l1-3-3-3h2l7 4 4-1 3-1-1-1 5-2 1-5 6-3-2-4 5-4 3 4 7-2h2v-7h-4l-5-1-4-5-2-3-8-3-2-3 2-1v-4l-2-2-4-6v-4l-1-1-4-4-2-5z",
				onClick: n[104] ||= (t) => e.onClick(t),
				onDblclick: n[105] ||= (t) => e.onDblClick(),
				onMouseenter: n[106] ||= (t) => e.onEnter(t),
				onMouseleave: n[107] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-82",
				style: k({ display: e.config.displayPath["FR-82"] }),
				d: "m391 703-3 8 4 5-1 6-3 3 2 4-7 2-5 1 1 5-3 1 2 2h5l3-2 2 2-4 1v4l-4 3v4h7l2 3v4l3 3-2 3 1 2 4-2h10l2-1h4l3 4 8-2 3-4-4-2 3-1v-3l4 1 2 2 2-3 5-2 2 1 2-3-3-3h6l2-4 4-4h-4l2-5 11-2 4-2 5-2 2-2-2-5 3-6h-6v-8l-8 3-5-1-4 4-5-1-1 7h-3l-1-4-1-2-3 1-6 5h-7l-1-4v-4l-3 3h-3l-3-4h-3l-2-4 3-3v-2h-5v2l-7 1z",
				onClick: n[108] ||= (t) => e.onClick(t),
				onDblclick: n[109] ||= (t) => e.onDblClick(),
				onMouseenter: n[110] ||= (t) => e.onEnter(t),
				onMouseleave: n[111] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-12",
				style: k({ display: e.config.displayPath["FR-12"] }),
				d: "m529 645-11 9v9h-2l-1 8-3 1-2 4h-11l-1-1h-5l-3 5h-1l-1 2-2 2h-7l-1 2h-3l-6 6h-2l-4 3 1 7 3 5-2 2v8h5l-3 6 3 6 3-2 1 3 4-4h6l7 4 10 2 4 7 6 2 3 8-1 3 4 7v3l7 9 6 3 4-1 2-3 3 1 6 4h10l-1-11v-3h3l6 3h5l-1-6 3-3 7-1v-5l6-3-1-7h-6l-5-1-1-4 4-1v-5l4-4-3-1-9 1 1-4-6-2-2-13v-8l-5-4 1-7-11-13-1-10h-4l-1-11-8 1v-6z",
				onClick: n[112] ||= (t) => e.onClick(t),
				onDblclick: n[113] ||= (t) => e.onDblClick(),
				onMouseenter: n[114] ||= (t) => e.onEnter(t),
				onMouseleave: n[115] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-81",
				style: k({ display: e.config.displayPath["FR-81"] }),
				d: "M484 726h-6l-4 4-1-3-3 2-1-1-1 2-5 2-5 2-11 2-1 5h4l-4 4-2 4h-6l3 3-2 3 1 1 1 4 4 5 1 1 1 4 3 5 3 3v4l-3 1 2 3 8 4 2 2 4 5 5 1h4v7l2-1v3h7l6 2 1-7h3l11 2h11l8-2 2-7-6-5 2-5 3-5 5 4 13-5 2-4-6-4-3-1-2 3-4 1-6-3-7-9v-4l-4-6 1-3-3-7-6-3-4-7-10-2z",
				onClick: n[116] ||= (t) => e.onClick(t),
				onDblclick: n[117] ||= (t) => e.onDblClick(),
				onMouseenter: n[118] ||= (t) => e.onEnter(t),
				onMouseleave: n[119] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-01",
				style: k({ display: e.config.displayPath["FR-01"] }),
				d: "M692 478h-4l-2 5-7 26-1 3-1 8-2 3v12l-1 3 7 4h3l4 4 1 6 5-1 7 2v-1h4l5 4 4-2 3-7 2-3 3 1 3 2 2 5 14 18 5-3v-7h5v-12l3-2v-11l1 1v-4l-2-4 1-10 4 2 2-3 3-1 4-3h-4v-7l4-3h7v-4l-2-1 5-7-1-2-6-4-15 17h-10v-5l-6-2-7 7-5 1v-5l-5-2-7-10-7-3-2-5h-3l-4 2-3 1z",
				onClick: n[120] ||= (t) => e.onClick(t),
				onDblclick: n[121] ||= (t) => e.onDblClick(),
				onMouseenter: n[122] ||= (t) => e.onEnter(t),
				onMouseleave: n[123] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-38",
				style: k({ display: e.config.displayPath["FR-38"] }),
				d: "m719 544-2 3-3 7-4 2-5-4h-4v5l5 4-8 10-10 3-8 2 5 5 1 3-8 4v11h-1l2 5 7 2 4-2 5-3 7 5h6l3 6-1 3v6l-1 6v1h3l6 2 9 2 3-2 2-3h1v29l2 2h5l5 3 4 3h3l2 2 7 1v-1l-3-2v-4h10l2-3-1-3 4-4 4 2 4-4 9 1 2-3h7v-8l-3-1-1-5h-8l-1-2 2-8 2-2-2-3-4-2-2 2 1-3v-3l-3-3 1-8 4-2-1-5-7-7h-3l-2 3-5-7-2 1-3 5 2 3-1 1-3-2-10-2-4-8v-3l-4-5-1-2-14-18-2-5-3-2z",
				onClick: n[124] ||= (t) => e.onClick(t),
				onDblclick: n[125] ||= (t) => e.onDblClick(),
				onMouseenter: n[126] ||= (t) => e.onEnter(t),
				onMouseleave: n[127] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-74",
				style: k({ display: e.config.displayPath["FR-74"] }),
				d: "m808 484-8 2-8 6-2-3h-4l-4 8 1 3 4 4-8 4-4 5h-8l-4 3-4 1-1 3-4-2-1 10 2 4v4l3 2v10l7 2 3 5h6l2-2h3l5 6 2 2 6-1 2-3 2-7 3-2 3-8 4-3 2 1 1 2-2 3 4 4h5l4 6-1 2 4-3 3-3 2 1v-7l12-5 2-3-1-8-8-8-3 1v-9l-6-3-1-3 4-4v-5l-6-7v-5z",
				onClick: n[128] ||= (t) => e.onClick(t),
				onDblclick: n[129] ||= (t) => e.onDblClick(),
				onMouseenter: n[130] ||= (t) => e.onEnter(t),
				onMouseleave: n[131] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-42",
				style: k({ display: e.config.displayPath["FR-42"] }),
				d: "m611 506-6 1-1 4 2 5 1 21h-9v3l6 5-3 3-2 8 5 6 4 9 9 6 3 12-6 7 1 4 10 3 8-6h3l12 5-1 6h6l5 5h3l6-2 2-7 9-5v-11h1l-5-1-3 2-4-2 4-5-1-4-12-2-10-9v-3l2-2v-3l-3-2 3-3v-5l-5-4v-5l-3-3v-4l-2-5 3-3v-7h7l2-2-2-4v-4l-2-1-1 7h-4l-3 3-2-2-12-2-4 3h-3l-1-3-5-1-1-5z",
				onClick: n[132] ||= (t) => e.onClick(t),
				onDblclick: n[133] ||= (t) => e.onDblClick(),
				onMouseenter: n[134] ||= (t) => e.onEnter(t),
				onMouseleave: n[135] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-69",
				style: k({ display: e.config.displayPath["FR-69"] }),
				d: "M671 501h-4l-3 4-2-3-4 3-4-3h-4l-1 1-1 4 2 2v3l2 4-1 2h-8v7l-3 3 2 6v3l3 3v5l5 4v5l-3 4 3 1v3l-2 2v3l10 9 12 2 1 4-4 4 4 2 3-1 5 1 7-4-1-3-5-5 8-2 10-3 8-10-5-4v-4l-7-2-5 1-1-6-4-4h-3l-7-4 1-3v-12l2-3 1-8-1 2h-3l-1-7z",
				onClick: n[136] ||= (t) => e.onClick(t),
				onDblclick: n[137] ||= (t) => e.onDblClick(),
				onMouseenter: n[138] ||= (t) => e.onEnter(t),
				onMouseleave: n[139] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-73",
				style: k({ display: e.config.displayPath["FR-73"] }),
				d: "M754 535v11l-3 2v12h-5v7l-5 3 1 2 4 5v3l5 8 9 2 3 2 1-1-2-3 3-5 2-1 5 7 2-3h3l7 7 1 5-4 2-1 8 3 3v3l-1 3 2-2 4 2 2 3 7-1 2 2 1 6 6-1 1-6 3-1h7l11-4 4 2h4v-4l5-3 2-2 9-3 1-7-1-2 5-9-5-2-2-5-9-6s1-11-1-13c-2 0-7 1-7 1l-5-7v-5l-2-1-3 3-4 3 1-2-4-6h-5l-4-4 2-3-1-2-3-1-3 3-3 8-3 2-2 7-2 3-6 1-2-2-5-6h-3l-2 2h-6l-3-5-7-2v-10z",
				onClick: n[140] ||= (t) => e.onClick(t),
				onDblclick: n[141] ||= (t) => e.onDblClick(),
				onMouseenter: n[142] ||= (t) => e.onEnter(t),
				onMouseleave: n[143] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-07",
				style: k({ display: e.config.displayPath["FR-07"] }),
				d: "m677 599-8 5-2 7-6 2h-3l-2 9-5 2-2 4 1 5 1 2h-6v7h-5l-3 9h-9l-9 7-6 8 1 2 3 13 6 6-1 8 8 5v10l4-2 8 6 4 1 1-7 5-1 2 5h5l1-5 12 6 2-4 5-1v-7l-1-2h-2v-3l2-3-2-3 1-7 4-5v-8l-1-9 3-1 1-4 3-7 2-5-3-8-2-6-3-11v-15h-1z",
				onClick: n[144] ||= (t) => e.onClick(t),
				onDblclick: n[145] ||= (t) => e.onDblClick(),
				onMouseenter: n[146] ||= (t) => e.onEnter(t),
				onMouseleave: n[147] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-26",
				style: k({ display: e.config.displayPath["FR-26"] }),
				d: "m695 601-5 3-4 2-5-2v15l3 11 2 6 3 8-2 5-3 7-1 4-4 1 2 9v8l-4 5-1 7 1 3-1 3v3h2l1 2v7h5l2 2-1 7 1 2 5-5 5-1 1-2-6-1-1-7 4-6h5l5 5-5 6 1 3 8 1 4-4-2 5v4l8 1 10 1 2 4 5 5h5l3-3 2-6 3 3 2 3 1-14h-3l-2-5-13-3-1-6 4-3-4-3 1-3h6l5 3 4-5-4-3v-5l3-6 7-1 6-3 1-1-7-1-2-2h-3l-4-3-5-3h-5l-2-2v-29h-1l-2 3-3 2-9-2-6-2-3 1v-2l1-6v-5l1-4-4-6h-5z",
				onClick: n[148] ||= (t) => e.onClick(t),
				onDblclick: n[149] ||= (t) => e.onDblClick(),
				onMouseenter: n[150] ||= (t) => e.onEnter(t),
				onMouseleave: n[151] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-17",
				style: k({ display: e.config.displayPath["FR-17"] }),
				d: "m260 492-5 1-11 6 3 3-6 5-1 3-5 1-3-3-7-1-1-4-4-3-6 3 3 5h5l6 4 3 3 8-1 2 4 4 1 2 5 4 1-1 4-4-1-1 3 3 4-2 8h-4v5l1 2h-5l-1-3 4-4-2-3-1-1-1-9-6-1-5-6-1 13 8 6 1 7 2 8v8l5-1 7 6 5 3 1 4 4 1 11 11 3 13h10l2-2 1 5 9 1 1 12h6l8 9h4l5-2 4 2 3-6 2-5-7-5-2-3-4-4-7 1-3-1v-2l4-1v-1l-3-1-2-1 5-4v-3l-2-2 1-2 1-4-3-3-2-3-4-5-3-1 2-4h-1l-1-8-3-2 4-2h6l2-2h4l1 2h4l3-1 1-7 3-11-3-3-1-4-5-3-7-4-8 1-5-7h-7l-6-5v-2l-4-5-1-5-5-4-7 3z",
				onClick: n[152] ||= (t) => e.onClick(t),
				onDblclick: n[153] ||= (t) => e.onDblClick(),
				onMouseenter: n[154] ||= (t) => e.onEnter(t),
				onMouseleave: n[155] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-19",
				style: k({ display: e.config.displayPath["FR-19"] }),
				d: "m475 561-1 3-6 2-3 4h-2l-4-1-3 4-4 1-3 5h-4l-2 2h-7l-3 4-2-1-5 6-5-2-2 5 2 4 4 3-7 6v5l3 2-3 3 4 4-3 3 3 2h8v8l3 5h1l7-4 10 4 7 10h4l6-6 2 3 4-4 5 2 1 1 4-3-1-4-2-2 3-4h2l2-6 2-3-1-6 4-6 7-5v-9l3 1 4 4h4l2-2-2-5 2-6-1-6-2-3v-5l3-5-1-5-1-1-3 3h-7l-3 3h-4l-4-3-1-3h-9l-2-2z",
				onClick: n[156] ||= (t) => e.onClick(t),
				onDblclick: n[157] ||= (t) => e.onDblClick(),
				onMouseenter: n[158] ||= (t) => e.onEnter(t),
				onMouseleave: n[159] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-23",
				style: k({ display: e.config.displayPath["FR-23"] }),
				d: "m457 487-2 6h-6l-2-1h-4l-3-2-7 7v6l-4 8 1 5 5 1 3 8 3 3-1 15 7-2 2 3-4 4v3l4 1 6-1 2-3h1l-1 5 6 2 4 4v2h-2v4l2 2 1-1 6-1 1-4h3l2 2h9l2 3 3 3h4l3-3h7l3-3-7-8-1-3 7-4 4-2 1-5 4-3-1-7-3-4-1-11-4-9-4-2-3-5-2 4-3-4v-4l-4-6-12 1-7-2z",
				onClick: n[160] ||= (t) => e.onClick(t),
				onDblclick: n[161] ||= (t) => e.onDblClick(),
				onMouseenter: n[162] ||= (t) => e.onEnter(t),
				onMouseleave: n[163] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-87",
				style: k({ display: e.config.displayPath["FR-87"] }),
				d: "m427 493-3 3-10-1h-1l-6 1-5 4v4h-7l-5 6-3 2 3 3-1 9-2 4 3 3h5l1 5 1 4-7 1-3 1 1 9-5 3-3 1-2 5h-3l-1 6h8l2 4-1 4 3 4 2-1 3-3 11 1 2 7 8 1 2 3-5 2 2 2 8 1v2l2-4 5 1 5-6 2 1 3-4h7l2-2h4l3-5 4-1 3-4 4 1h2l2-3-2-2v-4h2v-2l-4-4-6-2 1-5h-1l-2 3-7 1-3-1v-3l4-4-2-4-7 3 1-15-3-3-3-8-5-1-1-5 4-8v-6 1z",
				onClick: n[164] ||= (t) => e.onClick(t),
				onDblclick: n[165] ||= (t) => e.onDblClick(),
				onMouseenter: n[166] ||= (t) => e.onEnter(t),
				onMouseleave: n[167] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-86",
				style: k({ display: e.config.displayPath["FR-86"] }),
				d: "m333 409-7 8-2 3 1 8h3v4l2 6 2 5-3 2 1 2-1 3v1l3 3v2l-2 3-4 6 4 2 2 3-2 4v2l-3 4v3h2v8l3 2-2 3 1 2 3 4 2-3v-1l3-2 2 2v5l-2 3-2 5 2 4 6 2-1 3-5 1 4 6 7-1 5-1 6 3 2-2-1-5 3-2 3 4 2 3 7-3 3-3h6l3 2 1-7-3-3 3-2 5-6h7v-5l5-3 9-2 1-5-4-2-2-8h-6l-3-4-7-5 1-5v-7l-6-6-1-5-6-7-3-8-2-1-3-4-3 2 1 3-9 3h-11v-12l-9-2v-4l-6-2-2-5h-3z",
				onClick: n[168] ||= (t) => e.onClick(t),
				onDblclick: n[169] ||= (t) => e.onDblClick(),
				onMouseenter: n[170] ||= (t) => e.onEnter(t),
				onMouseleave: n[171] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-16",
				style: k({ display: e.config.displayPath["FR-16"] }),
				d: "m365 519-3 2 1 5-2 2-6-3-5 1-7 1-4-6h-2l-6 4-5 1v2l-3 4 1 1-4 3-2 11-1 7-3 1h-4l-1-2h-4l-2 2h-6l-4 2 3 2 1 8h1l-2 3 3 2 4 4 2 4 3 3-1 4-1 2 2 2v3l-5 3 2 2 3 1v1l-4 1v2l3 1 7-1 4 4 2 3 7 5 2-2 7 1 3-3 7-7v-12l17-12v-9h6l3-6h2l1-6h3l2-5 3-1 5-3-1-9 3-1 7-1-1-4-1-5h-5l-3-3 2-4v-3l-3-1h-6l-3 3-7 3-2-3z",
				onClick: n[172] ||= (t) => e.onClick(t),
				onDblclick: n[173] ||= (t) => e.onDblClick(),
				onMouseenter: n[174] ||= (t) => e.onEnter(t),
				onMouseleave: n[175] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-79",
				style: k({ display: e.config.displayPath["FR-79"] }),
				d: "m320 416-10 1-9 1-10 1v5l-5 3-11-2-7 3 3 5v4l9 8-2 4 6 7-3 3 4 6 1 10-2 3 2 4-2 5v3l3-3 3 4-5 3-1 2-5 1-4 2h-1l1 6 4 4v2l5 5h8l5 7 8-1 7 4 5 3 1 4 3 3 3-2-1-2 3-4v-2l5-1 6-4 7-1 1-3-6-2-2-4 2-5 2-3v-6l-2-1-3 1v2l-2 3-3-4-1-2 2-3-3-2v-8h-2v-3l3-4v-2l2-4-2-3-4-2 4-6 2-3v-2l-3-3v-1l1-3-1-2 3-2-2-5-2-6v-4h-3l-1-8v1l-3-2z",
				onClick: n[176] ||= (t) => e.onClick(t),
				onDblclick: n[177] ||= (t) => e.onDblClick(),
				onMouseenter: n[178] ||= (t) => e.onEnter(t),
				onMouseleave: n[179] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-22",
				style: k({ display: e.config.displayPath["FR-22"] }),
				d: "m113 220-3 3-8 1-2 2-6-4-7 5 2 4-5 7-2 9 5 1-1 4 3 2-2 3-3 1 1 4 4 1-4 1v5l3 3v11l-1 2 1 5 6 1v3l4 1 3-2 2 2 7 2 5-3 2-3h4l6 5 5-1 4 4h2l2 3h5l1-2 2 4 4 1 6-3v-4l4-1h3l3 5 7 1 4-4 4-9 5-2 2-3 3 2 6-1 2-16 1-7-1-4-3-1-2-11-3 3-7-1v4l-5 1v-5l-4-1-2 2v-7l-4 4-7-2-2 5-13 7v4h-3v-7l-8-4 1-6-7-5v-6l-5-1v-6l-4-1 1-4h-8l-1 4z",
				onClick: n[180] ||= (t) => e.onClick(t),
				onDblclick: n[181] ||= (t) => e.onDblClick(),
				onMouseenter: n[182] ||= (t) => e.onEnter(t),
				onMouseleave: n[183] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-85",
				style: k({ display: e.config.displayPath["FR-85"] }),
				d: "m240 417-2 3h-6l3 3-2 6-6 2-2-2 1-6-1-3h-4l-2 2 1 9 3 4-3 3-5-1-7-2-2-6h-5l-6-3-2-4-7-4-10 14-1 9 11 10v4h3l7 20 7 4 8 7h8l3 7h8l4 6 8 4v-6l2 2 11-6 5-1 2 6 7-3 6 4 4-2 5-1 1-2 5-3-3-4-3 3v-3l2-5-2-4 2-3-1-10-4-6 3-3-6-7 2-4-9-8v-4l-3-5-5-4h-9l-3-2-4-1-5-4z",
				onClick: n[184] ||= (t) => e.onClick(t),
				onDblclick: n[185] ||= (t) => e.onDblClick(),
				onMouseenter: n[186] ||= (t) => e.onEnter(t),
				onMouseleave: n[187] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-50",
				style: k({ display: e.config.displayPath["FR-50"] }),
				d: "m205 136-1 3 7 7v7l-3 4 2 2h1v7l2 6 8 9 2 9 2 2v13l4 9v10l-4 9 5 13 8 2v4l-3 2h-7l1 4 2 7 6 5 3 1 3-4h3l4-5 4 3h4l3 1v1l6 1 4-3 5 2 6-5 2-7v-3l1-3-4-4-9-6h-7l-7-9 6-2 2-5-3-2 3-3 2 2 5-3 3-4 1-5-2-4 2-2-3-4 3-4-3-3-2 4-5-3-7-6v-3l2-3v-3h-4v-8l-10-11 3-8h4l-3-9-16-1-8 6-9-6z",
				onClick: n[188] ||= (t) => e.onClick(t),
				onDblclick: n[189] ||= (t) => e.onDblClick(),
				onMouseenter: n[190] ||= (t) => e.onEnter(t),
				onMouseleave: n[191] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-56",
				style: k({ display: e.config.displayPath["FR-56"] }),
				d: "m88 289-6 3h-4l-5 3v3l3 7 1 5 10 2 4 4 2-3 3 4-2 2v5h-3l-2 4h-4l-2 7 4 6 6 2 2-4-1 4 5 2 7 7 2 4-1 5-1 4 5 4 2-3-2-3v-6l4 1 2-5 1 3 4 4 3-4-3-5 4 6 5-1-1-3 5 2 4 4-2 3-5-2-5-2-3 3 4 2 3 5 20-2 5 1-2 2v4h2l3-3 2 2h6l7-4 10-3 1-11 2-1-4-7 3-3-1-1-1-2 3-1 3-4-1-3h-3l-1-4 2-3-3-6-4-2h-5l-2-1v-2l3-2 1-6-1-4-1 1h-7l-3-6h-3l-4 1v4l-6 4-4-2-2-4-2 2h-4l-2-3h-2l-4-4-5 1-6-5-5 1-1 3-6 3-7-3-1-2-3 2h-4v-3l-6-2z",
				onClick: n[192] ||= (t) => e.onClick(t),
				onDblclick: n[193] ||= (t) => e.onDblClick(),
				onMouseenter: n[194] ||= (t) => e.onEnter(t),
				onMouseleave: n[195] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-29",
				style: k({ display: e.config.displayPath["FR-29"] }),
				d: "m60 231-5 4-4-2-8 1-1 4-5 1-1-4-8 1v3h-6l-2-2-3 2-1 4H7l-6 6 5 4-6 4 2 4-2 7 6 1 2-2 1 1 14-1 9-7-8 8 1 3 7-3-1 5h7v3l-8-1-7-2-9-3-5 5 7 3-1 9 2-1 4-6 8 4 3 1 2 5-2 4h-9l-8 1-12 1-2 3 3 2h4l4 3 4-1 8 9 2 9-3 5 8 2h8l2-4-4-4 4 1h3l6 3h3v-7l2 7 5 7 10 1v-2l2 3 7 1h4l1 1 1-7h4l3-4h2l1-5 1-2-3-3-2 2-4-4-9-1-2-6-3-7v-2l5-4h4l6-3-1-4 1-2v-11l-3-3v-5l4-1-4-1-1-4 3-1 2-3-3-2 1-4-5-1 2-9-6-4-10 1v7h-3v-3h-5z",
				onClick: n[196] ||= (t) => e.onClick(t),
				onDblclick: n[197] ||= (t) => e.onDblClick(),
				onMouseenter: n[198] ||= (t) => e.onEnter(t),
				onMouseleave: n[199] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-35",
				style: k({ display: e.config.displayPath["FR-35"] }),
				d: "m199 244-4 3 3 12 3 1 1 3-1 7-2 16-6 1-3-2-2 3-5 2-4 9-3 3 1 3-1 6-3 3v2l2 1h5l5 2 3 6-3 3 1 4h4v4l-3 3-3 2 2 1v2l-3 2 4 7 7-3 22-2 2-4 3-3 8-1 1-4h5l3 5 8 2 1-3 2-7 5-11 2-2 6 1v-10l-2-2v-11l-1-3v-6l3-4v-7l-2-1 1-11-3-1h-4l-4-3-4 5h-3l-3 4h-3l-6-6-2-7-1-4h-18l-7-4 5-6z",
				onClick: n[200] ||= (t) => e.onClick(t),
				onDblclick: n[201] ||= (t) => e.onDblClick(),
				onMouseenter: n[202] ||= (t) => e.onEnter(t),
				onMouseleave: n[203] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-44",
				style: k({ display: e.config.displayPath["FR-44"] }),
				d: "m230 336-1 4-8 1-3 4-1 3-23 2-9 5-1 10-10 4-7 3h-5l-3-2-3 3h-1l1 1-6 7 1 1 2 3-4 5 4 2 7 2v-3l4 5h7l5-5h6l-7 3 1 4 1 3-4 4h-4l1 5 7-1 10 9h-1l7 4 2 4 6 3h5l2 6 7 2 5 1 3-3-3-4-1-9 2-2h4l1 3-1 6 2 2 6-2 2-6-3-3h6l2-3h2l5 4 3 1v-4l-2-4h-6l2-2v-3l3-1 1-4-1-1v-5h-4l-4-5v-3l4-3 8-1h11l4-2-1-7-6-5h-6l-2-1v-6l4-4-3-4-3-6-3-3v-4l-1-1-7-2-3-4z",
				onClick: n[204] ||= (t) => e.onClick(t),
				onDblclick: n[205] ||= (t) => e.onDblClick(),
				onMouseenter: n[206] ||= (t) => e.onEnter(t),
				onMouseleave: n[207] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-49",
				style: k({ display: e.config.displayPath["FR-49"] }),
				d: "m247 341-1 2h-1v5l4 2 3 7 3 4-4 4v6l2 1 6-1 6 5 1 8-4 2h-11l-8 1-4 2v4l4 5h4v5l2 1-2 4-3 1v3l-2 2h6l3 4v4l3 2h9l5 4 7-3 11 2 5-3v-5l10-1 9-1 10-1 1 3 3 2 2-4 7-8h3l4-15 5-6v-8l4-5v-2l-2-2 1-3-5-1-15-10-14-4h-5v-4l-4-2h-3l-6-3-5 5h-9l-4-2-11-4-2 3-6-3h-6z",
				onClick: n[208] ||= (t) => e.onClick(t),
				onDblclick: n[209] ||= (t) => e.onDblClick(),
				onMouseenter: n[210] ||= (t) => e.onEnter(t),
				onMouseleave: n[211] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-72",
				style: k({ display: e.config.displayPath["FR-72"] }),
				d: "M358 273h-9l-10 9h-5l-7 2-2 4-1 7 1 5-6 5-1 3 1 3-2 3 1 2h-6l-1 3 3 6-1 2-2 2-5 1-1 1 2 2v11l-1 3 3 2v4h5l14 4 15 10 5 1 3-4 7 5h4l-2-8 4 3 2-3 11-3-2-5 3-3 5-2 5-6v-7h4l1-5 1-8-4-3 3-5 4-6-5-3-5-1-5-7h-1l-1 3v-2h-7l-4-6-6-2-2-13z",
				onClick: n[212] ||= (t) => e.onClick(t),
				onDblclick: n[213] ||= (t) => e.onDblClick(),
				onMouseenter: n[214] ||= (t) => e.onEnter(t),
				onMouseleave: n[215] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-53",
				style: k({ display: e.config.displayPath["FR-53"] }),
				d: "M321 263h-3l-2 4-5 2-10-1-10 5-3-2-6 4-4-3-2-5-6-2-3 3-6-1-1 10 2 1v7l-3 4v6l1 3v11l2 2v10l-6-1-2 2-5 11-2 7-1 1 7 1h5l6 4 3-3 10 4 5 2h9l4-5 7 3h4l1-3v-11l-2-2 1-2h5l2-2 1-2-3-6 1-3h6l-1-2 2-4-1-2 1-3 6-5-1-4 1-8 2-4 7-2h-1l-2-6-5-2-1-8z",
				onClick: n[216] ||= (t) => e.onClick(t),
				onDblclick: n[217] ||= (t) => e.onDblClick(),
				onMouseenter: n[218] ||= (t) => e.onEnter(t),
				onMouseleave: n[219] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-14",
				style: k({ display: e.config.displayPath["FR-14"] }),
				d: "m359 173-9 2-13 8-16 6-12-7-30-4-7-4-10 3v4l-2 2v3l7 7 5 2 2-4 3 3-3 4 3 4-2 2 2 4-1 5-3 5-5 2-2-1-3 2 3 3-2 4-6 2 7 9h7l5 4 7-3 6-6 7 2 7-4 4-2 4 5 7-2 6 4 7-3 7-5 4-5h3l1 3h2l1-3 7-1 2 1 7-1 2-4-1-3-4-1v-3l3-2 1-4-2-8-5-7 4-2v-1l-4-1z",
				onClick: n[220] ||= (t) => e.onClick(t),
				onDblclick: n[221] ||= (t) => e.onDblClick(),
				onMouseenter: n[222] ||= (t) => e.onEnter(t),
				onMouseleave: n[223] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-61",
				style: k({ display: e.config.displayPath["FR-61"] }),
				d: "m366 223-7 1-2-1-7 1-1 3h-2l-1-3h-3l-4 5-7 5-7 3-6-4-7 2-4-5-4 2-7 4-7-2-6 6-7 3 4 2 4 4-1 3v3l-2 7-6 6 2 4 4 3 6-4 3 2 10-5 10 1 5-2 2-4h3l4 3 1 8 5 2 2 6h6l10-9h9l3 4 2 13 6 2 4 6h7v2l1-4h1l6 8 3 1v-9l-2-3-1-3 6-3 5-1 4-5-1-13-8-7v-6l-6-4 2-4-2-5-5-2-3-3-2-5-10-1-3-4z",
				onClick: n[224] ||= (t) => e.onClick(t),
				onDblclick: n[225] ||= (t) => e.onDblClick(),
				onMouseenter: n[226] ||= (t) => e.onEnter(t),
				onMouseleave: n[227] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-28",
				style: k({ display: e.config.displayPath["FR-28"] }),
				d: "m441 225-2 2v6l-8 4v5l-2 2h-9l-4-1-13 7h-5l-5 4 1 1v6l8 7v13l-3 5-6 1-5 3 1 3 2 3v9h1l5 3-2 3 4 2 5-1h4v1l-4 2 3 1h5l2 5 3 1 2 5 8 3 5-1 4-4 4 1 1-2v-3l2-1 3 2 3-2v-2l2-2 3 1 2 2 4-2h5l3-3 2-7h3l-1-7 3-3-1-2 1-1h-1l-1-9-1-2-1-4-7-2-3-4-1-7-5-1v-4l-6-4-2-6 2-4-2-3v-4l1-4-3-3-1-4z",
				onClick: n[228] ||= (t) => e.onClick(t),
				onDblclick: n[229] ||= (t) => e.onDblClick(),
				onMouseenter: n[230] ||= (t) => e.onEnter(t),
				onMouseleave: n[231] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-89",
				style: k({ display: e.config.displayPath["FR-89"] }),
				d: "m572 283-3 3-14-1-6 3-3 6 3 3-4 5-4 4 7 6 2 6 4 5v6l-9 8 3 4v5l-6 4h-7l1 4 5 6 1 6 1 4-2 1 5 1h3l2-3h2l3 2-1 3 3 2h3l5 3 2-1 2 2 2-1 3-2 4 1 2-1v-6h1l1 3 4 3v4h6l8 7 5 1v-3l2-3 1 3-1 2 1 2 3-1h3v5l3 2 2-1 6-4v-1l-4-2v-4l4-1 1-2-1-2v-4l3-4 4-9 1-4 3-1v-1l-2-1v-3l5-3 1-5-2-3h-3l-1-1v-4l4-3v-3l-1-2-2 4-2-1-2-4-8 4-14-1-2-4-4-5v-7l-6-7-4 3-6-5 1-10-9-10h-5l-2-2z",
				onClick: n[232] ||= (t) => e.onClick(t),
				onDblclick: n[233] ||= (t) => e.onDblClick(),
				onMouseenter: n[234] ||= (t) => e.onEnter(t),
				onMouseleave: n[235] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-70",
				style: k({ display: e.config.displayPath["FR-70"] }),
				d: "m766 317-6 1-2 3-3 3-3-3-1 1 1 2-4 2 1 3-3 2v5h-6v2l-5 1v5h4l-2 2-1 8h-3l-6 1-6-1-5 1v4l4 1 3 6 1 3-5 5-2 1-2 2 4 1 1 6h3l1 8 1 1v1l3 1 3 3h5l2-2h6l7-6h2l3-2 7 1 6-5 4-1 2-4 3-1 3-5 5-4 5-1 3 3 7-1v-4l3-1 2-3h4l3-3v-9l-1-6v-4l3-2 3-2-12-7-3-3-3-2-3 1-1 2-2 2h-2l-6-6h-7l-4 2-2 1-5-4v-4z",
				onClick: n[236] ||= (t) => e.onClick(t),
				onDblclick: n[237] ||= (t) => e.onDblClick(),
				onMouseenter: n[238] ||= (t) => e.onEnter(t),
				onMouseleave: n[239] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-76",
				style: k({ display: e.config.displayPath["FR-76"] }),
				d: "m431 106-2 3-16 12-27 7-18 6-15 8-9 13-1 10 7 6 10 2h-1l8-1 4-4 3-1 4 6h5l2 4 8-1 9 6-5 2 4 3h2l3 5h4l1-3-3-2 9-3 9-1 2-6 5-4 8-1 10 5 5 1 1-3 3-5 1-2h-3v-6l-2-4 1-7 1-4h-2l1-4 4-4-4-6-1-7-16-15-2-4h-4z",
				onClick: n[240] ||= (t) => e.onClick(t),
				onDblclick: n[241] ||= (t) => e.onDblClick(),
				onMouseenter: n[242] ||= (t) => e.onEnter(t),
				onMouseleave: n[243] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-27",
				style: k({ display: e.config.displayPath["FR-27"] }),
				d: "m374 167-3 1-4 4-8 1 1 14 4 1v1l-4 2 5 7 2 8-1 4-3 2v3l4 1 1 3-3 9 3 3 10 1 2 5 3 3 5 2 2 5-2 4 5 3 5-4h5l13-7 4 2h9l2-3v-5l8-4v-6l1-2v-1l2-2-3-1v-2l-2-3 2-2 10-3 2-4 2-8 3-4 1-4 3 2 2-1-1-3-1-8-4-3-5-1-10-5-8 1-5 3-2 7-9 1-9 3 3 2-1 3h-4l-3-5h-2l-4-3 5-2-9-6-8 1-2-4h-5z",
				onClick: n[244] ||= (t) => e.onClick(t),
				onDblclick: n[245] ||= (t) => e.onDblClick(),
				onMouseenter: n[246] ||= (t) => e.onEnter(t),
				onMouseleave: n[247] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-37",
				style: k({ display: e.config.displayPath["FR-37"] }),
				d: "m376 356 1 2-11 3-2 3-4-3 2 8h-4l-7-5-4 7 2 2v2l-4 5 1 8-6 7-4 14 2 6 6 2v4l9 2v12h10l10-3-1-4 3-1 3 4 2 1 3 8 6 7 1 5 5 6 3-1 4-3 3-15 2-5 1-7 6-2 4 1 2 2 3-4 3-3v-3h3l1-3-3-4 1-2-2-2-6-8h-7l-2-3v-12l-3-8v-9l-4-1-4-3h-1l-4 3-2-2-1-3 3-2v-1l-1-1z",
				onClick: n[248] ||= (t) => e.onClick(t),
				onDblclick: n[249] ||= (t) => e.onDblClick(),
				onMouseenter: n[250] ||= (t) => e.onEnter(t),
				onMouseleave: n[251] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-45",
				style: k({ display: e.config.displayPath["FR-45"] }),
				d: "m490 289-5 4-10 1-1 1 1 2-3 3 1 7h-3l-2 7-3 3h-5l-4 2-2-2-3-1-2 2v3l-3 1-3-2-2 1v3l-1 2h4v2l-2 4v2h2l2 2v2l-4 4 2 5v2l4 3h4l3 3 1 4 3 4 4-1 2-3h5l2 2h3l2-2h13l3 5 4 1 3 3h4l1-2h2l3 4h6l2 2 4 6 2 1h2v-5h3l2 3 2 1 4-1-1-1v-4l7-2-1-4-1-6-5-6-1-4h8l5-4v-5l-3-4 9-8v-6l-4-5-2-6-7-6-9 5v-3h-4l-1 3h-14l-4 2-3-2 6-4-1-7-4-2-4-5-9-1z",
				onClick: n[252] ||= (t) => e.onClick(t),
				onDblclick: n[253] ||= (t) => e.onDblClick(),
				onMouseenter: n[254] ||= (t) => e.onEnter(t),
				onMouseleave: n[255] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-36",
				style: k({ display: e.config.displayPath["FR-36"] }),
				d: "m455 401-3 1h-4l-6 2-1 3-1-1h-6l-3 2-3 1-1 2 3 4-1 3h-3v3l-3 3-3 4-2-2-4-1-6 2-1 7-2 5-3 15-4 3-3 1h1v7l-1 5 7 5 3 4h6l2 8 4 2-1 6h-3 1l10 1 3-3 6 5 7-8 3 2h4l2 1h6l2-6 18 3 7 1h3l1-3 3-4v-3l-3-4 1-1v-5l2-2v-1l-3-2-1-4-5-3v-3l4-2v-2l-4-3-1-2 3-1-1-2 5-4-1-1h-3l-2-2v-2l2-3v-2l-4-6v-5l-2-1h-5l-4 1h-5l-2-2-1-2 4-3v-4l-5-4z",
				onClick: n[256] ||= (t) => e.onClick(t),
				onDblclick: n[257] ||= (t) => e.onDblClick(),
				onMouseenter: n[258] ||= (t) => e.onEnter(t),
				onMouseleave: n[259] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-41",
				style: k({ display: e.config.displayPath["FR-41"] }),
				d: "m395 311-2 3-3 5 4 3-1 8-1 5h-4v7l-5 6-5 2-3 3 1 3 18 1 1 1v1l-3 2 1 3 2 2 4-3h1l4 3 4 1v9l3 7v13l2 3h7l6 9 1 1h1l3-1 3-2h6l1 1 1-3 6-2h4l3-1 3 3 5 4 5-1v-4l2-3h2l2 2 7-1 5-2-1-2-1-2v-3l3-6 5-2v-4l1-2-3-1-2-4-4-1-1-2 5-4 5-3-3-4h-13l-2 2h-3l-2-2h-5l-2 3-4 1-3-4-1-4-3-3h-4l-4-3v-2l-2-5 4-4v-2l-2-2h-2v-2l2-3v-3h-3l-5-1-4 4-5 1-8-2-2-6-3-1-2-4h-5l-3-2 4-2v-1h-4l-5 1z",
				onClick: n[260] ||= (t) => e.onClick(t),
				onDblclick: n[261] ||= (t) => e.onDblClick(),
				onMouseenter: n[262] ||= (t) => e.onEnter(t),
				onMouseleave: n[263] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-18",
				style: k({ display: e.config.displayPath["FR-18"] }),
				d: "m493 363-5 3-5 4v2l5 1 2 4 3 1-1 2v4l-5 2-3 6v3l1 2 1 2-5 2-7 1-2-2h-2l-2 3v4l-5 1v4l-4 3 1 2 2 2h5l4-1h5l2 2v4l4 6v2l-2 3v2l2 2h3l1 1-5 4 1 2-3 1 1 2 4 3v2l-4 2v3l5 3 1 4 3 2v1l-2 2v5l-1 1 3 4v3l-3 4v3l8-1 2-4 4-5 9-2 5 1 5-4v-2l-2-2v-6l10-9 3 4 3-4h3l5-6h9v2l3-9-2-3v-5l1-9-4-4 1-9-4-7v-5l-6-5-2-5 4-4v-7l-4-4-4 1-1-1-3-3h-3v5h-2l-2-1-4-6-2-2h-6l-3-4h-2l-1 2h-4l-3-3-4-1z",
				onClick: n[264] ||= (t) => e.onClick(t),
				onDblclick: n[265] ||= (t) => e.onDblClick(),
				onMouseenter: n[266] ||= (t) => e.onEnter(t),
				onMouseleave: n[267] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-21",
				style: k({ display: e.config.displayPath["FR-21"] }),
				d: "M655 320v5l-5 2h-12l1 3v3l-4 2v5l1 1h3l2 2-1 6-5 3v3l2 1v1l-3 1-1 4-4 8-3 5v4l1 2-1 2-4 1v4l4 2 1 3-1 4v3l2 3 5 1 2 4v1l-2 1v3h1l7 8 7-1 6 5 5 4v4l5 1 4 3 11-3 8-3h3l1-2h4l3 2 4-1 4-3 3 1v-1l3-1-1-2-1-2 2-3 6-3v-3l3-3 2-2-1-3 1-4 1-6h1v-2l-1-1-1-8h-3l-1-5-4-2 2-2 2-1 5-5-1-3-3-6-4-1-1 4-8 2-1-2-6-8-3 2h-4l-2-3-6 1v-7l-3-2 4-5-8-11-6-7-6-3z",
				onClick: n[268] ||= (t) => e.onClick(t),
				onDblclick: n[269] ||= (t) => e.onDblClick(),
				onMouseenter: n[270] ||= (t) => e.onEnter(t),
				onMouseleave: n[271] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-58",
				style: k({ display: e.config.displayPath["FR-58"] }),
				d: "m551 369-2 3h-3l-5-1-5 1v4l5 5v7l-4 4 2 5 6 5v5l4 7-1 9 4 4-1 9v5l2 3-3 9v3l6 3 5 4 3-2 4-2 1 3h5l2-3 3 2 1 5 3-1 7-9 3 2 1 1 5-3h3l2 4h3l3-3h3l3-3 2-1 1-2 5 1 1-2-3-2v-2l4-2v-2l-4-2v-8l-2-1 2-3 1-1 2-3-2-1-2-3 3-4 4-2h5v-4l2-1v-1l-2-4-6-1-1-3v-3l1-4-1-2-6 4-2 1-3-2v-5h-3l-3 1-1-2 2-2-2-3-2 3v3h-5l-8-8h-6v-4l-4-3-1-3h-1v6l-2 1-4-1-3 2h-2l-2-1-2 1-5-3h-3l-3-2 1-3-3-2z",
				onClick: n[272] ||= (t) => e.onClick(t),
				onDblclick: n[273] ||= (t) => e.onDblClick(),
				onMouseenter: n[274] ||= (t) => e.onEnter(t),
				onMouseleave: n[275] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-71",
				style: k({ display: e.config.displayPath["FR-71"] }),
				d: "M633 413v1h-5l-4 2-3 4 2 3 2 1-1 3-2 1-2 3 2 2v7l4 2v2l-4 2v2l3 2-1 2-5-1-1 2-2 1-3 3h-3l-3 3h-3l-2-4h-3l-5 3 7 13v5l1 2h7l2 3h5l3 4v14l-8 6h1l1 6 5 1 1 3h3l4-3 12 2 2 2 3-3h4l2-11 1-1h4l4 3 4-3 2 3 3-4h4l2 6 1 7h3l2-5 7-26 2-5h4l4 3 3-1 4-2h3l2 5 2 1 10-1 4-3-2-2-4-2-1-5 4-3 1-6-3-5-2-3 1-1v-4l-3-2v-3l8-1 1-3h-3l-2-2h-4l-3-6h-3v-4l-3-1-4 3-4 1-3-1-4-1-1 2h-3l-8 3-11 3-4-3-5-1v-4l-5-4-6-5-7 1-7-8z",
				onClick: n[276] ||= (t) => e.onClick(t),
				onDblclick: n[277] ||= (t) => e.onDblClick(),
				onMouseenter: n[278] ||= (t) => e.onEnter(t),
				onMouseleave: n[279] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-39",
				style: k({ display: e.config.displayPath["FR-39"] }),
				d: "M725 394v1h-1l-1 6-1 4 1 3-2 2-3 3v3l-6 3-2 3 1 2 1 2-3 1v5h3l3 6h4l2 2h3l-1 3-8 1v3l3 2v4l-1 1 2 3 3 5-1 6-4 3 1 5 4 2 2 2-4 3-10 1 5 2 7 10 5 2v5l5-1 7-7 6 2v5h10l15-17v-8l6-6-4-2 1-2h-5v-3l3-3-1-2-2-4 7-2 2-4 1-4-5-5-4-1-8-2v-8l-1-5-6 1-10-4 1-3 3-6v-3l-2-4-5-3v-6h-4l-1 2h-5l-3-3z",
				onClick: n[280] ||= (t) => e.onClick(t),
				onDblclick: n[281] ||= (t) => e.onDblClick(),
				onMouseenter: n[282] ||= (t) => e.onEnter(t),
				onMouseleave: n[283] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-51",
				style: k({ display: e.config.displayPath["FR-51"] }),
				d: "m607 176-4 2 1 4h-8l-7 5v9l5 3 2 4h-9v4l3 2-2 2-3 2 1 2h4l2 3-3 2-3 7-5 3-2 4-2 2 1 2-3 2-1 5 3 2 1 5-2 3 2 3h5v1h1l7 7 8-2 11-7h6l6-4 7-4h6l1 7 6 10h8l10-2 7 3 8-6 1-9 8-1v-6l-7-5v-3l2-5-2-2 2-5 4-2 3-9-6 1 4-4-3-8-2-5 3-3-2-1-1-2-3-3-4 4h-1l-2-2h-8l-2 2h-2l-3-5h-4l-2 1h-4l-6-5-4-1-2-2-7-5h-9v3l-2 1z",
				onClick: n[284] ||= (t) => e.onClick(t),
				onDblclick: n[285] ||= (t) => e.onDblClick(),
				onMouseenter: n[286] ||= (t) => e.onEnter(t),
				onMouseleave: n[287] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-60",
				style: k({ display: e.config.displayPath["FR-60"] }),
				d: "m459 141-2 2-1 4h2l-1 4-1 7 2 4v6h3l-1 2-3 5-1 3 4 3 1 8 1 3-2 1-3-2-1 4 2 3 2 4 10 1 7-1 4-4 6 4 3 2 4-1 4-2 8 4 8 5 2 3 4-3 4 2 2 2 4-1 2-3 5 3 6-2 3 1 4-3 2-1h1l1-5-3-3-4-3-2 3-1 1-1-6 4-1-1-5h-4l2-4 6-1 2-9 4-2-5-3 2-3v-11l-1-9-8 1-5-1-9 3-9 8-6-3h-7l-5-5-9-3-13 1-3-2h-6l-5 1-2-1v-4l-1-1z",
				onClick: n[288] ||= (t) => e.onClick(t),
				onDblclick: n[289] ||= (t) => e.onDblClick(),
				onMouseenter: n[290] ||= (t) => e.onEnter(t),
				onMouseleave: n[291] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-62",
				style: k({ display: e.config.displayPath["FR-62"] }),
				d: "m482 9-20 3-16 13v50l5 1 2 4 4-1 3-3 3 1 7 5 2-1 2 4 7 3v4l5 2 4-2 9-1 2 2 5-2 2 4-6 3v5l2 2h2l1-3 3-2 3 2 8 3h3v-4l5 3v3l-2 3 4-2 3-1 2 2v3l5-3h9l2-4-1-2h-7l-2-1 4-2h6l1-6 2-2v-3l-4-3h-5l-1-1 3-2 1-2-3-2-3-4v-2l5-3 1-2-4-2-2-4-6-1-7-2v-7l4-3-2-4h-3l-3 4-11-1-9-2-5-5v-5l4-1-4-3h-8l-4-12-8-12z",
				onClick: n[292] ||= (t) => e.onClick(t),
				onDblclick: n[293] ||= (t) => e.onDblClick(),
				onMouseenter: n[294] ||= (t) => e.onEnter(t),
				onMouseleave: n[295] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-59",
				style: k({ display: e.config.displayPath["FR-59"] }),
				d: "m512 0-11 6-18 2h-2l8 12 4 12h8l4 3-4 1v5l5 5 9 2 11 1 3-4h3l2 4-4 3v7l7 2h6l2 5 4 2-1 2-5 2v3l3 4 3 2-1 2-3 2 1 1h5l4 3v3l-2 2-1 6h-6l-4 2h6l3 1 1 2-2 4 3 3 3 1 3-2h4l1 2h1l5-3 4 3 6-4h2l3 2 6-4 2 1 2 2h9v3l4-3h2l2 4 7 2 2-1h-1v-4l7-4-1-7-7-2 2-1v-5l5-4-1-3-12-9-20 1-2 4h-3l1-13-6-7-5 1-2-3-7 3-3-3h-5l-1-5-1-14-3-2v-2h-2l-1-4h-5l-9 3-4 5h-5l-2-3-1-4-4-4h-5l-2-4v-6l2-4-1-6z",
				onClick: n[296] ||= (t) => e.onClick(t),
				onDblclick: n[297] ||= (t) => e.onDblClick(),
				onMouseenter: n[298] ||= (t) => e.onEnter(t),
				onMouseleave: n[299] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-02",
				style: k({ display: e.config.displayPath["FR-02"] }),
				d: "m591 107-6 5-3-3h-2l-6 4-4-3-5 3h-1l-1-2h-4l-3 2v5l-4 5v5l-3 3v5l2 7 2 13v11l-2 3 5 3-4 2-2 9-6 1-2 4h4l1 5-4 1 1 6 1-1 2-3 4 3 3 3-1 5 3 3 1 8 10 9 3 1 2 4 6 2 1-1 2-4 5-3 3-7 3-2-2-3h-4l-1-2 3-2 2-2-3-2v-4h9l-2-4-5-3v-9l7-6h8l-1-3 4-2 7 4 2-1v-12l1-4 1-5-4-3 1-3 6-1v-5l6-3 1-4-2-3 1-6 3-2-3-7 1-6h-7l-2 1-7-2-2-4h-2l-4 4-1-4h-8l-2-2z",
				onClick: n[300] ||= (t) => e.onClick(t),
				onDblclick: n[301] ||= (t) => e.onDblClick(),
				onMouseenter: n[302] ||= (t) => e.onEnter(t),
				onMouseleave: n[303] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-80",
				style: k({ display: e.config.displayPath["FR-80"] }),
				d: "m446 75-1 12 8 7v4l-10-6-12 14 3 1h4l2 4 16 15 1 7 4 6-2 2h5l1 1v4l2 1 5-1h6l3 2 13-1 9 3 5 5h7l6 3 9-8 9-3 5 1 8-1-1-4-2-7v-4l3-4v-5l4-5v-5l-3-1-4-3h-8l-6 3v-3l-1-2-3 1-4 2 2-3v-3l-5-3v4h-3l-8-3-3-2-3 2-1 3h-2l-2-2v-5l6-4-2-3-5 2-2-2-9 1-4 2-5-2v-4l-7-3-2-4-2 1-7-5-3-1-3 3-4 1-2-4z",
				onClick: n[304] ||= (t) => e.onClick(t),
				onDblclick: n[305] ||= (t) => e.onDblClick(),
				onMouseenter: n[306] ||= (t) => e.onEnter(t),
				onMouseleave: n[307] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-08",
				style: k({ display: e.config.displayPath["FR-08"] }),
				d: "m663 96-3 5-4 3v8l-4 3-8 2-4 2-5-4h-7l-1 7 3 6-3 3v5l1 3-1 4-6 3v5l-6 1-1 3 4 3-1 4-1 5v9h9l7 5 2 2 4 1 6 5h4l2-1h4l3 5h2l2-3 8 1 2 2h1l4-4 3 3v-2l5-2 2-2-2-4v-2l4-3 1-8-4-5 1-3 4-6 1 1h6l2 2 3-2 3-4h-3l-1-7-3-3-10-1-2-4-3-3-12-1-1-8 2-2v-3l-6-4 1-4 2-3-3-2 4-4v-6l-1-2h-6z",
				onClick: n[308] ||= (t) => e.onClick(t),
				onDblclick: n[309] ||= (t) => e.onDblClick(),
				onMouseenter: n[310] ||= (t) => e.onEnter(t),
				onMouseleave: n[311] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-10",
				style: k({ display: e.config.displayPath["FR-10"] }),
				d: "m629 249-7 4-6 4h-6l-11 7-8 2-7-7h-1v1l-5 3v4l-3 3-2 8v5l2 2h4l10 10-2 10 7 5 4-3 5 7 1 7 4 5 2 4 14 1 8-4 2 4h2l2-4h12l5-2v-5h11l1 1-1-5-3-2 4-3 6-1 3-3-1-13-1-8-7-2-6-9v-6l2-4-3-1-10 2h-8l-6-10-1-7z",
				onClick: n[312] ||= (t) => e.onClick(t),
				onDblclick: n[313] ||= (t) => e.onDblClick(),
				onMouseenter: n[314] ||= (t) => e.onEnter(t),
				onMouseleave: n[315] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-52",
				style: k({ display: e.config.displayPath["FR-52"] }),
				d: "m684 251-8 1-1 9-8 6-4-2-2 4v6l6 9 7 2 1 8 1 13-3 3-6 1-4 3 3 2 1 5 5 2 6 7 8 11-4 5 3 2v7l6-1 2 3h4l3-1 6 7 1 2 8-2 1-4v-4l5-1 6 1 6-1h3l1-8 2-2h-4v-5l5-1v-2h6v-5l3-2-1-3h1l-3-3-4 1v-7l-10-5 2-10 4-2-1-3-5-1-1-5h-5l-5-6-5-1-3-4 3-3-7-8-4-1-8-4-5-5-7-1z",
				onClick: n[316] ||= (t) => e.onClick(t),
				onDblclick: n[317] ||= (t) => e.onDblClick(),
				onMouseenter: n[318] ||= (t) => e.onEnter(t),
				onMouseleave: n[319] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-67",
				style: k({ display: e.config.displayPath["FR-67"] }),
				d: "m872 200-7 2-3 5v6l-3 2h-2l-5-3-4 3h-4l-4-4-7-1-3-2-2-5-3 3-2 9-5 1v5l5 2 4 2-2 4 3 2 6-4 10 5-4 8v3l3 3-2 7-7 8-4-1 3 3-2 6 2 10 6 2v1h5l3 3 3 4h7l3 9 6 2v-1l9-18-1-11 5-14 1-12 9-7v-4l4-5h2l4-3-1-6 3-9 5-1-5-4-9-1-8-4-5 3-3-3z",
				onClick: n[320] ||= (t) => e.onClick(t),
				onDblclick: n[321] ||= (t) => e.onDblClick(),
				onMouseenter: n[322] ||= (t) => e.onEnter(t),
				onMouseleave: n[323] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-54",
				style: k({ display: e.config.displayPath["FR-54"] }),
				d: "m726 156-4 4h-7l-2 2v5l2 3-1 2-1 3 1 1 2-1 1-3 4-1 6-1 3 2 1 3 1 3v3l2 2v2l-2 2v5l2 2v7l2 2 3 2-1 2 4 4-3 4v2l4 2v2h-4l-2 2v2l3 3-3 7-2 6 1 4v6l1 3h2l2 2h-4l-2 2v2l3 3v5l4-1h5v6h2l-2 2v2l3 1 3 3 12-1 2-4h6l2-2 3 2 3-1h5l4-1 4-3 2 2v-5l3-1 1 5h5l4 1h2l6-2 3-3 3-3 5-2 4-1-2-2h5l-5-2-6-4-5-4h-6l-7-4h-5v-2l-8-4-10-4h-4l-2-5-7-9h-7l-3-4h-6l1-6-8-4 1-5h4v-4l1-3-3-3 3-5-2-5-2-2-5-10 2-3v-5h-5l-7-7z",
				onClick: n[324] ||= (t) => e.onClick(t),
				onDblclick: n[325] ||= (t) => e.onDblClick(),
				onMouseenter: n[326] ||= (t) => e.onEnter(t),
				onMouseleave: n[327] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-77",
				style: k({ display: e.config.displayPath["FR-77"] }),
				d: "m552 208-2 1-4 3-3-1-6 2-5-3-2 3h-4l-2-1-4-2-4 3v-1l-2 10 3 13v8l-3 8v4l-3 3 2 10-1 2-2 9 3 3-8 6v7l2 3 4 2 1 7-6 4 3 3 4-3h14l1-3h4v3l9-5 4-4 4-5-3-3 3-6 6-3 14 1 3-3h1v-6l2-7 3-3v-4l5-3v-2h-6l-1-3 2-3-1-5-3-2 1-5 3-2-1-2 1-1-6-2-2-4-3-1-10-9-1-8z",
				onClick: n[328] ||= (t) => e.onClick(t),
				onDblclick: n[329] ||= (t) => e.onDblClick(),
				onMouseenter: n[330] ||= (t) => e.onEnter(t),
				onMouseleave: n[331] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-68",
				style: k({ display: e.config.displayPath["FR-68"] }),
				d: "M844 282h-5l-4 8-4 8 1 6-4 8-6 5v14l-4 4v1l1 2 6 1 6 5 2 2-1 4-2 4 1 4 5-1 1 4 2 8 4-1-1 4 3 2h13l7-5 1-8 3-5-5-5-2-6 3-4v-9l2-4v-8l3-4-4-5v-11l-5-2-4-9h-7l-3-4z",
				onClick: n[332] ||= (t) => e.onClick(t),
				onDblclick: n[333] ||= (t) => e.onDblClick(),
				onMouseenter: n[334] ||= (t) => e.onEnter(t),
				onMouseleave: n[335] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-55",
				style: k({ display: e.config.displayPath["FR-55"] }),
				d: "m705 152-3 5-3 2-3-3h-5l-1-1-4 7-1 2 4 6-1 7-4 3v2l2 4-2 2-5 2 1 4 2 1-3 3 2 5 3 8-4 4 6-1-3 9-4 2-2 6 2 1-2 5v3l7 5 1 13 7 1 5 5 8 4 4 1 7 8-1 1 7-1v-3l7-1v-3h2v2l5-1 3-3h-1v-5l-4-3v-2l3-2h4l-2-2h-1l-2-3v-6l-1-4 2-6 3-7-3-3v-2l2-2h4v-2l-4-2v-2l3-4-4-4 1-2-3-2-2-2v-7l-2-2v-5l2-2v-2l-2-1v-4l-1-3-1-3-3-2-6 2h-4l-2 3-1 2-1-2 1-2 1-3-2-3v-4h-2l-1-7-3-3h-2z",
				onClick: n[336] ||= (t) => e.onClick(t),
				onDblclick: n[337] ||= (t) => e.onDblClick(),
				onMouseenter: n[338] ||= (t) => e.onEnter(t),
				onMouseleave: n[339] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-57",
				style: k({ display: e.config.displayPath["FR-57"] }),
				d: "M765 160h-5l-4 4-1 1h-6l-2-2h-1v6l-2 2 5 10 2 2 2 5-3 5 3 3-1 3v4h-4v5l7 4v6h5l3 4h7l7 9 2 5h5l9 4 8 4v2h5l7 4h6l6 4 5 4 5 2 6-7 2-7-2-3-1-3 5-8-10-5-6 4-4-2 2-4-4-2-5-2v-5l5-1 2-9 3-3 2 5 4 2 7 1 3 4h4l4-3 5 3h2l3-2v-6l3-5-3-3-7-5-3-4-8 1-5 5h-13l-3-2c-.9-2-2.3-3.7-4-5h-1c-2 0-5-2-5-2l-5 2v4l-6 1-4-7-2-1v-5l-5-2-1-9-3-3-8-4h-3l-1 1h-4l-5-4z",
				onClick: n[340] ||= (t) => e.onClick(t),
				onDblclick: n[341] ||= (t) => e.onDblClick(),
				onMouseenter: n[342] ||= (t) => e.onEnter(t),
				onMouseleave: n[343] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-88",
				style: k({ display: e.config.displayPath["FR-88"] }),
				d: "m832 262-4 1-5 2-3 4-3 2-6 2h-2l-4-1h-5l-1-5-3 1v5l-2-2-4 3-4 1h-5l-3 1-3-2-2 2h-6l-2 4-12 1-2-3-4-1v-2l2-2h-2v-6h-6l-2 1-3 3-5 2v-3h-2v3l-7 1v3l-7 1-2 3 3 3 5 1 5 6h5l1 5 5 1 1 3-4 2-2 10 10 5v7l4-1 3 3 3-2-1-2 1-1 3 3 4-3 1-3 6-1 2 1v4l5 4 2-1 4-2h7l6 6h2l2-2 1-2 3-1 3 2 3 3 12 6 4-4v-14l6-5 4-8-1-6 4-8 4-9-7-2-1-10 2-6z",
				onClick: n[344] ||= (t) => e.onClick(t),
				onDblclick: n[345] ||= (t) => e.onDblClick(),
				onMouseenter: n[346] ||= (t) => e.onEnter(t),
				onMouseleave: n[347] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-91",
				style: k({ display: e.config.displayPath["FR-91"] }),
				d: "m491 244-3 2-4 1-1 4-5 3-1 4 3 4-4 5h-5l2 3-2 3-1 5 2 1v4l1 2 1 9 11-1 5-4 4 3 9 1 2 2v-7l8-6-3-3 2-9 1-2-2-10 3-3v-4l-4-2h-7l-3-2-3 1-6-3z",
				onClick: n[348] ||= (t) => e.onClick(t),
				onDblclick: n[349] ||= (t) => e.onDblClick(),
				onMouseenter: n[350] ||= (t) => e.onEnter(t),
				onMouseleave: n[351] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-78",
				style: k({ display: e.config.displayPath["FR-78"] }),
				d: "m449 211-10 3-2 2 2 3v2l3 1-2 2v2l1-1 3 4 1 4 3 3-1 4v4l2 3-2 4 2 6 6 4v4h5l1 8 3 4 6 1 1-5 2-3-2-3h5l4-5-3-4 1-4 5-3 1-4 4-1 3-2v1-1l-3-3-2-6 3-7-1-5-7-4h-8l-9-6-6 2z",
				onClick: n[352] ||= (t) => e.onClick(t),
				onDblclick: n[353] ||= (t) => e.onDblClick(),
				onMouseenter: n[354] ||= (t) => e.onEnter(t),
				onMouseleave: n[355] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-95",
				style: k({ display: e.config.displayPath["FR-95"] }),
				d: "m456 195-3 4-2 8-2 4 9 4 6-2 9 6h8l7 4 1 5h1l6-3 10-1 5-2 4-3 1-7-2-2-8-5-8-4-4 2-4 1-3-2-6-4-4 4-7 1-10-1-2-4z",
				onClick: n[356] ||= (t) => e.onClick(t),
				onDblclick: n[357] ||= (t) => e.onDblClick(),
				onMouseenter: n[358] ||= (t) => e.onEnter(t),
				onMouseleave: n[359] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-93",
				style: k({ display: e.config.displayPath["FR-93"] }),
				d: "m515 219-4 3-5 2-10 1 1 1h1v3h-1v2h5l1 2 1 4 1-1 2-1h2l3 2 2 2 1 1h2v-5l-3-13z",
				onClick: n[360] ||= (t) => e.onClick(t),
				onDblclick: n[361] ||= (t) => e.onDblClick(),
				onMouseenter: n[362] ||= (t) => e.onEnter(t),
				onMouseleave: n[363] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-75",
				style: k({ display: e.config.displayPath["FR-75"] }),
				d: "M502 231h-5l-2 1-1 1h-1l-2 2v2l3 1 4 2h3l2-1 4 1v-3h-2v1h-2l1-1-1-4z",
				onClick: n[364] ||= (t) => e.onClick(t),
				onDblclick: n[365] ||= (t) => e.onDblClick(),
				onMouseenter: n[366] ||= (t) => e.onEnter(t),
				onMouseleave: n[367] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-92",
				style: k({ display: e.config.displayPath["FR-92"] }),
				d: "m496 225-6 3h-1l-3 7 2 6 3 4 5 4 2-1-1-2 1-3-1-1 1-2-4-2-3-1v-2l2-2h1l1-1 2-1v-2h1v-3h-1z",
				onClick: n[368] ||= (t) => e.onClick(t),
				onDblclick: n[369] ||= (t) => e.onDblClick(),
				onMouseenter: n[370] ||= (t) => e.onEnter(t),
				onMouseleave: n[371] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-94",
				style: k({ display: e.config.displayPath["FR-94"] }),
				d: "m507 235-2 1-1 1-1 1h2v-1h2v3l-4-1-2 1h-3l-1 2 1 1-1 3 1 2 1-1 4 2h7l4 2 3-8v-3h-2l-1-1-2-2-3-2z",
				onClick: n[372] ||= (t) => e.onClick(t),
				onDblclick: n[373] ||= (t) => e.onDblClick(),
				onMouseenter: n[374] ||= (t) => e.onEnter(t),
				onMouseleave: n[375] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-25",
				style: k({ display: e.config.displayPath["FR-25"] }),
				d: "m811 361-1 1h-4l-2 3-3 1v4l-7 1-3-3-5 1-5 4-3 5-3 1-2 4-4 1-6 5h-7l-3 1h-2l-7 6h-3v6l5 3 2 3v4l-3 6-1 3 10 4 6-1 1 6v7l8 2 4 1 5 5-1 4-2 4-7 2 2 4 1 2-3 3v3h5l22-21-1-17 8-4 6-3 5-4v-8l5-2 12-13-2-5 4-1 4-6-2-3-9 2v-1l8-10z",
				onClick: n[376] ||= (t) => e.onClick(t),
				onDblclick: n[377] ||= (t) => e.onDblClick(),
				onMouseenter: n[378] ||= (t) => e.onEnter(t),
				onMouseleave: n[379] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-90",
				style: k({ display: e.config.displayPath["FR-90"] }),
				d: "m818 336-3 2-3 2v5l1 5v9l-2 2 22 11 1-2 5-1-2-8-1-4-5 1-1-4 2-4v-4l-1-2-6-5-6-1z",
				onClick: n[380] ||= (t) => e.onClick(t),
				onDblclick: n[381] ||= (t) => e.onDblClick(),
				onMouseenter: n[382] ||= (t) => e.onEnter(t),
				onMouseleave: n[383] ||= (t) => e.onLeave(t)
			}, null, 36)
		], 8, $T)], 8, QT));
	}
}, tE = ["viewBox"], nE = ["stroke"], rE = {
	__name: "FranceReg",
	props: {
		config: {
			type: Object,
			required: !0
		},
		onClick: {
			type: Function,
			required: !0
		},
		onDblClick: {
			type: Function,
			required: !0
		},
		onEnter: {
			type: Function,
			required: !0
		},
		onLeave: {
			type: Function,
			required: !0
		}
	},
	setup(e) {
		return (t, n) => (I(), L("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: e.config.viewBox
		}, [R("g", {
			fill: "#5C68E5",
			stroke: e.config.colorStroke,
			"stroke-width": ".2%"
		}, [
			R("path", {
				class: "FR-20R",
				style: k({ display: e.config.displayPath["FR-20R"] }),
				d: "m1010 932-9 12 1 11v5l1 5-2 13-2 4h-5v4l3-2h4v4l-7 4v3l1 2-5 5 4 1-2 7h-5l-1-3h-6l2-3-3-2-4-1-12-4-6-4-4-3c0-1 3-5 3-7v-1c1 0 3 1 3 1l5-5-11-1-8-2 2-7 5-3-3-2 3-6-2-1-5 2-1-1h-6l-1-6 2-3 3-4 2-1 2-2-2-4-3-1-8-2v-8l-2-2v-2l5-1 4-1-1-3-6-4-3-3v-3h3l1-3 4-3-1-3v-6l3-1 1-6 2 2 3 1 2-4 7-6 9-2 2-6 4-4h4l1 1h5l3 3 3-1 2-4v-5l-4-4v-3l2-2-1-3 3-3-3-3v-4l5-4 3 2 2 2 2 8 2 10-2 6 1 13 5 4 2 4 1 22 4 7z",
				onClick: n[0] ||= (t) => e.onClick(t),
				onDblclick: n[1] ||= (t) => e.onDblClick(),
				onMouseenter: n[2] ||= (t) => e.onEnter(t),
				onMouseleave: n[3] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-PAC",
				style: k({ display: e.config.displayPath["FR-PAC"] }),
				d: "m903 734-8 3 1 5-6 5 4 8-6 4-1 4h-6l-7 6-9 1v11h-4l-2 3-7-2-1 9-6 7-10 1-1 6-3 4-6 3h8v9l-6 3-5-2-2 4h-8l-3 2v5l-3 2-2-3h-2l-5-2-5 3 1 5 2 2h-9l4-2v-3l-11-1-6 4-4 3-4-1-2-8-6-2-1-2-1-1-9-3h-17l2-2 1-4h-8l6-5-1-4-6 3-20-1-3-7-7-3-5 4 7 6-12 2-16-3 4-6h5l-3-3-15-1h-11l3-8 12-7-3-4 3-8 11 2 3-20 10-5 4-3v-4l-11-11v-8l-6-10-1-1 2-4 10-1 2 2-1 7 1 2 5-5 5-1 1-2-6-1-1-7 4-6h5l5 5-5 6 1 3 8 1 4-4-2 5 1 4 7 1 10 1 1 4 6 5h5l3-3 2-5 3 2 2 3 1-14h-3l-2-5-13-3-1-6 4-3-3-3v-3h6l5 3 4-5-4-3v-5l3-6 7-1 6-3 1-2-3-2v-4h10l2-3-1-3 4-4 4 2 4-4 9 1 2-3h7v-8l-3-1-1-5h-8l-1-2 2-8 2-2 7-1 2 2 1 6 6-1 1-6 3-1h7l3 5 1 4 6 2 1 11 10 4h5l4 1 1 10 5 3v3h-4l-3 4h-1l1 5-7 7-1 4 2 4 3 1 3 3-5 1v7l8 5v6h5l9 3 10 7h5l17-6h5l2 5 2 3 1 5z",
				onClick: n[4] ||= (t) => e.onClick(t),
				onDblclick: n[5] ||= (t) => e.onDblClick(),
				onMouseenter: n[6] ||= (t) => e.onEnter(t),
				onMouseleave: n[7] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-OCC",
				style: k({ display: e.config.displayPath["FR-OCC"] }),
				d: "M690 743v4l-15 8-2 20-11-2-3 8 3 4-12 7-3 8h-13v-7l-6-1h-5l-12 8-19 16-3 4h-11l-1 4-13 3v2l-1 4-3 4-6 4-6-6-3 5 4 6 4-1v22l1 32 5 2 3 4v6l-6-1-5-5h-7l-6 2-3 5-11 2-1 5-2 2-2-2h-3l-3 3-10-8-12-4-7 1-6 8h-5l-6-5v-6l-10-3-6-5-1-4-1-7-15-2-6 2-6-9h-15l-7-7h-5l-11-3-1-1-8-4-5-1-1 18-14-1-7-1-4-1-2 4-7-1-5-6-12 5h-5l-5-5-1-4-7-6-6-3h-1v-7l3-2 2-12 5 1 2-2-2-5 10-8 5-13 4-5-5-6-2-4 3-4-6-10-9-1-3-5 2-7 4-4-1-7 3-2-5-8 4-4 4-1 4 2 5-5 1 6 2 2 4-1v-4l2-6 5 4 5-6 3 4 6-1 7-1 2-5 11-1 6 5 1-2h1l3-1-1-5 5-1 7-2-2-4 3-3 1-6-4-5 3-8 6 3 7-1v-1l-3-7-3-11h7l2-5 3-3v-6h8l6-8-3-1v-3l6-1v-4l3-1 4-6-4-4v-4l3-2h1l7-4 9 4 8 10h4l6-6 2 3 4-4 6 2 2 13 6 5-5 10 5 2-2 6 3 1h1l3-5h5l1 1h11l2-4 3-1 1-8h2v-9l11-9 1 2v6l8-1 1 11h4l1 10 3.1 3.7L552 665l5-16 7 4 3-6 10-4 6 17 10-3v-5h4l1 6 7-2 9 12 3 13 6 7-1 7 2 1 6 4v10l4-2 8 6 4 1 1-7 5-1 2 6 5-1 1-5 13 7 6 10v8z",
				onClick: n[8] ||= (t) => e.onClick(t),
				onDblclick: n[9] ||= (t) => e.onDblClick(),
				onMouseenter: n[10] ||= (t) => e.onEnter(t),
				onMouseleave: n[11] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-ARA",
				style: k({ display: e.config.displayPath["FR-ARA"] }),
				d: "m852 596 1 2-1 7-9 3-2 2-5 3v4h-4l-4-2-11 4h-7l-3 1-1 6-6 1-1-6-2-2-7 1-2 2-2 8 1 2h8l1 5 3 1v8h-7l-2 3-9-1-4 4-4-2-4 4 1 3-2 3h-10v4l3 2v1l-1 1-6 3-7 1-3 6v5l4 3-4 5-5-3h-6l-1 3 4 3-4 3 1 6 13 3 2 5h3l-1 14-2-3-3-3-2 6-3 3h-5l-5-5-2-4-10-1-8-1v-4l2-5-4 4-8-1-1-3 5-6-5-5h-5l-4 6 1 7 6 1-1 2-5 1-5 5-1-2 1-7-2-2h-5l-5 1-2 4-12-6-1 5h-5l-2-5-5 1-1 7-4-1-8-6-4 2v-10l-8-5 1-8-6-6-3-13-1-2-8-10-7 2-1-6h-4l-1 5-9 3-6-17h-1l-9 3-3 7-7-4-5 16-5 11-3-3-1-11h-4l-1-10-7 1-1-7-1-1-11 9v9h-2l-1 8-3 1-2 4h-11l-1-1h-5l-3 5-4-1 2-6-5-2 5-10-7-5-1-12 4-3-1-4-2-2 3-4h2l2-6 2-3-1-6 4-6 7-5v-10l3 2 4 4h4l2-2-2-5 1-4 1-2-1-6-2-3v-5l3-5-1-5-8-9-1-3 7-4 4-2 1-5 4-3-1-7-3-4v-7.3l-1-.7v-3l-4-9-4-2-3-5-2 4-3-4v-4l-4-6 2-4 4-5 9-2 5 1 5-4v-2l-2-2v-6l10-9 3 4 3-4h3l5-6h9v5l6 3 5 4 3-2 4-2 1 3h5l2-3 3 2 1 5 3-1 7-9 3 2 8 14v5l1 2h7l2 3h5l3 4v14l-8 6 1 1 1 5 5 1 1 3h3l4-3 12 2 2 2 3-3h4l1-7 1-4 1-1h4l4 3 4-3 2 3 3-4h4l2 6 1 7h3l1-2 1-3 7-26 2-5h4l4 3 3-1 4-2h3l2 5 7 3 7 10 5 2v5l5-1 7-7 6 2v5h10l15-17 6 4 1 2-5 7 2 1v4h-7l-4 3v7h12l4-5 8-4-4-4-1-3 4-8h4l2 3 8-6 8-2h13v5l6 7v5l-4 4 1 3 6 3v9l3-1 8 8 1 8-2 3-12 5v12l5 7s5-1 7-1c2 2 1 13 1 13l9 6 2 5 5 2z",
				onClick: n[12] ||= (t) => e.onClick(t),
				onDblclick: n[13] ||= (t) => e.onDblClick(),
				onMouseenter: n[14] ||= (t) => e.onEnter(t),
				onMouseleave: n[15] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-NAQ",
				style: k({ display: e.config.displayPath["FR-NAQ"] }),
				d: "m519 538-4 3-1 5-4 2-7 4 1 3 7 8 1 1 1 5-3 5v5l2 3 1 6-2 6 2 5-2 2h-4l-4-4-3-1v9l-7 5-4 6 1 6-2 3-2 6h-2l-3 4 2 2 1 4-4 3-1-1-5-2-4 4-2-3-6 6h-4l-7-10-10-4-7 4h-1l-3 2v4l4 4-4 6-3 1v4l-6 1v4h3l-6 8h-7l-1 6-3.8 3.8.8.2-2 4h-7l3 11 3 8-7 1-6-3-3 8 4 5-1 6-3 3 2 4-7 2-5 1 1 5-3 1-2 2-6-5-11 1-2 5-7 1-6 1-3-4-5 6-5-4-2 6v4l-4 1-2-2-1-6-5 5-4-2-4 1-4 4 5 7-3 3 1 7-4 4-2 7 2 5h1l9 1 6 10-3 4 2 4 5 6-4 5-6 13-9 8 2 5-2 2-5-1-2 12-3 2v7l-7 4-3 2-2-2-3 1-4 2-4-5-9-7-1-7h-14l-8-5-9-2-3-4h-6l-3-3 1-5-3 3-1 6-6-2-3-4v-3l5-2v-7l2-2-1-5-4-1-7-3-1 4-5-1-1-5h-6l-4-4v-4h4l7-3 8-10 1-3 6-9 2-9 11-44 6-34v-8l4-6 1-5 3-2 2 3 9-1-2-3-1-2-7-6-5 6-3 8v-6l4-24 4-30 2-30 6-9v-1l4 1-1 7 19 17 7 28 1-2v-11l-3-10v-2l-3-13-11-11-4-1-1-4-5-3-7-6-5 1v-8l-2-8-1-7-8-6 1-13 5 6 6 1 1 9 1 1 2 3-4 4 1 3h5l-1-2v-5h4l2-8-3-4 1-3 4 1 1-4-4-1-2-5-4-1-2-4-8 1-3-3-6-4h-5l-3-5 6-3 4 3 1 4 7 1 3 3 5-1 1-3 6-5-3-3 11-6 5-1 2 6 7-3 5 4h1l4-2 5-1 1-2 5-3-3-4-3 3v-3l2-5-2-4 2-3-1-10-4-6 3-3-6-7 2-4-9-8v-4l-3-5 7-3 11 2 5-3v-5l10-1 9-1 10-1 1 3 3 2v-1l2-3 7-8v1h3l2 5 6 2v4l9 2v12h11l9-3-1-3 3-2 3 4 2 1 3 8 6 7 1 5 6 6v7l-1 5 7 5 3 4h6l2 8 4 2-1 5-2 1 10 1 3-3 6 5v-1l7-7 3 2h4l2 1h6l2-6 18 2 7 2 12-1 4 6v4l3 4 2-4 3 5 4 2 4 9 1 11 3 4z",
				onClick: n[16] ||= (t) => e.onClick(t),
				onDblclick: n[17] ||= (t) => e.onDblClick(),
				onMouseenter: n[18] ||= (t) => e.onEnter(t),
				onMouseleave: n[19] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-BRE",
				style: k({ display: e.config.displayPath["FR-BRE"] }),
				d: "M259 289v6l1 3v11l2 2v10l-6-1-2 2-5 11-2 7-1 3-8-2-3-5h-5l-1 4-8 1-3 3-2 4-22 2-7 3-2 1-1 11-10 3-7 4h-6l-2-2-3 3h-2v-4l2-2-5-1-20 2-3-5-4-2 3-3 10 4 2-3-4-4-5-2 1 3-5 1-4-6 3 5-3 4-4-4-1-3-2 5-4-1v6l2 3-2 3-5-4 1-4 1-5-2-4-7-7-5-2 1-4-2 4-6-2-4-6 .2-.8-.2-.2h-4l-7-1-2-3v2l-10-1-5-7-2-7v7h-3l-6-3h-3l-4-1 4 4-2 4h-8l-8-2 3-5-2-9-8-9-4 1-4-3H4l-3-2 2-3 12-1 8-1h9l2-4-2-5-3-1-8-4-4 6-2 1 1-9-7-3 5-5 9 3 7 2 8 1v-3h-7l1-5-7 3-1-3 8-8-9 7-14 1-1-1-2 2-6-1 2-7-2-4 6-4-5-4 6-6h9l1-4 3-2 2 2h6v-3l8-1 1 4 5-1 1-4 8-1 4 2 5-4v8h5v3h3v-7l10-1 6 4 5-7-2-4 7-5 6 4 2-2 8-1 3-3 2 5 1-4h8l-1 4 4 1v6l5 1v6l7 5-1 6 8 4v7h3v-4l13-7 2-5 7 2 4-4v7l2-2 4 1v5l5-1v-4l7 1 2.2-2.2-.2-.8 4-3h9l-5 6 7 4h18l1 4 2 7 6 6h3l3-4h3l4-5 4 3h4l3 1-1 11 2 1v7z",
				onClick: n[20] ||= (t) => e.onClick(t),
				onDblclick: n[21] ||= (t) => e.onDblClick(),
				onMouseenter: n[22] ||= (t) => e.onEnter(t),
				onMouseleave: n[23] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-PDL",
				style: k({ display: e.config.displayPath["FR-PDL"] }),
				d: "m390 319 4 3-1 8-1 5h-4v7l-5 6-5 2-3 3 2 5-11 3-2 3-4-3 2 8h-4l-7-5-3 4-1 3 2 2v2l-4 5v8l-5 6-4 15h-3l-7 8-2 4-3-2-1-3-10 1-9 1-10 1v5l-5 3-11-2-7 3 3 5v4l9 8-2 4 6 7-3 3 4 6 1 10-2 3 2 4-2 5v3l3-3 3 4-5 3-1 2-5 1-4 2-6-4-7 3-2-6-5 1-11 6-2-2v6l-8-4-4-6h-8l-3-7h-8l-8-7-7-4-7-20h-3v-4l-11-10 1-9 10-14h1l-10-9-7 1-1-5h4l4-4-1-3-1-4 7-3h-6l-5 5h-7l-4-5v3l-7-2-4-2 4-5-2-3-1-1 6-7-1-1h1l3-3 3 2h5l7-3 10-4 1-10 9-5 23-2 1-3 3-4 8-1 1-4 5 1 3 4 7 2h1l.9-1.9-.9-.1 1-1 2-7 5-11 2-2 6 1v-10l-2-2v-11l-1-3v-6l3-4v-7l-2-1 1-10 6 1 3-3 6 2 2 5 4 3 6-4 3 2 10-5 10 1 5-2 2-4h3l4 3 1 8 5 2 2 6h6l10-9h9l3 4 2 13 6 2 4 6h7v2l1-3h1l5 7 5 1 5 3-4 6z",
				onClick: n[24] ||= (t) => e.onClick(t),
				onDblclick: n[25] ||= (t) => e.onDblClick(),
				onMouseenter: n[26] ||= (t) => e.onEnter(t),
				onMouseleave: n[27] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-CVL",
				style: k({ display: e.config.displayPath["FR-CVL"] }),
				d: "m554 329-9 8 3 4v5l-5 4h-8l1 4 5 6 1 6 1 4-7 2v4l5 5v7l-4 4 2 5 6 5v5l4 7-1 9 4 4-1 9v5l2 3-3 9v-2h-9l-5 6h-3l-3 4-3-4-10 9v6l2 2v2l-5 4-5-1-9 2-4 5-2 4-8 1h-4l-7-1-18-3-2 6h-6l-2-1h-4l-3-2-7 8-6-5-3 3-10-1h2l1-6-4-2-2-8h-6l-3-4-7-5 1-5v-7h-1l-5-6-1-5-6-7-3-8-2-1-3-4-3 1 1 4-10 3h-10v-12l-9-2v-4l-6-2-2-6 4-14 6-7-1-8 4-5v-2l-2-2 4-7 7 5h4l-2-8 4 3 2-3 11-3-1-2-1-3 3-3 5-2 5-6v-7h4l1-5 1-8-4-3 3-5 4-6-5-3h-1v-9l-2-3-1-3 5-3 6-1 3-5v-13l-8-7v-6l-1-1 5-4h5l13-7 4 1h9l2-2v-5l8-4v-6l2-2 3 4 1 4 3 3-1 4v4l2 3-2 4 2 6 6 4v4l5 1 1 7 3 4 7 2 1 4 1 2 1 9h1l10-1 5-4 4 3 9 1 4 5 4 2 1 7-6 4 3 2 4-2h14l1-3h4v3l9-5 7 6 2 6 4 5z",
				onClick: n[28] ||= (t) => e.onClick(t),
				onDblclick: n[29] ||= (t) => e.onDblClick(),
				onMouseenter: n[30] ||= (t) => e.onEnter(t),
				onMouseleave: n[31] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-NOR",
				style: k({ display: e.config.displayPath["FR-NOR"] }),
				d: "m462 192-2 1-3-2-1 4-3 4-2 8-2 4-10 3-2 2 2 3v2l3 1-2 2v1l-1 2v6l-8 4v5l-2 3h-9l-4-2-13 7h-5l-5 4-5-3 6 4v6l8 7 1 13-4 5-5 1-6 3 1 3 2 3v9l-3-1-6-8h-1l-1 4v-2h-7l-4-6-6-2-2-13-3-4h-9l-10 9h-6l-2-6-5-2-1-8-4-3h-3l-2 4-5 2-10-1-10 5-3-2-6 4-4-3-2-4v-1l-5-2-4 3-6-1v-1l-3-1h-4l-4-3-4 5h-3l-3 4-3-1-6-5-2-7-1-4h7l3-2v-4l-8-2-5-13 4-9v-10l-4-9v-13l-2-2-2-9-8-9-2-6v-7h-1l-2-2 3-4v-7l-7-7 1-3 14 4 9 6 8-6 16 1 3 9h-4l-3 8 10 11v8h4l10-3 7 4 30 4 12 7 16-6 13-8 9-2h1l-.4-.1-9.6-1.9-7-6 1-10 9-13 15-8 18-6 27-7 16-12 2-3 3 1h4l2 4 16 15 1 7 4 6-4 4-1 4h2l-1 4-1 7 2 4v6h3l-1 2-3 5-1 3 4 3 1 8z",
				onClick: n[32] ||= (t) => e.onClick(t),
				onDblclick: n[33] ||= (t) => e.onDblClick(),
				onMouseenter: n[34] ||= (t) => e.onEnter(t),
				onMouseleave: n[35] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-HDF",
				style: k({ display: e.config.displayPath["FR-HDF"] }),
				d: "m626 136 2 3-1 4-6 3v5l-6 1-1 3 4 3-1 5-1 4v12l-2 1-7-4-4 2 1 3h-8l-7 6v9l5 3 2 4h-9v4l3 2-2 2-3 2 1 2h4l2 3-3 2-3 7-5 3-2 4-1 1-6-2-2-4-3-1-10-9-1-8-3-3h-1l-2 1-4 3-3-1-6 2-5-3-2 3-4 1-2-2-4-2-4 3-2-3-8-5-8-4-4 2-4 1-9-6-4 4-7 1-10-1-2-4-2-3 1-4 3 2 2-1-1-3-1-8-4-3 1-3 3-5 1-2h-3v-6l-2-4 1-7 1-4h-2l1-4 4-4-4-6-1-7-16-15-2-4h-4l-3-1 12-14 10 6v-4l-8-7 1-12V25l16-13 19.7-2.9.3-.1-1-1h2l18-2 11-6 5 9 1 6-2 4v6l2 4h5l4 4 1 4 2 3h5l4-5 9-3h5l1 4h2v2l3 2 1 14 1 5h5l3 3 7-3 2 3 5-1 6 7-1 13h3l2-4 20-1 12 9 1 3-5 4v5l-2 1 7 2 1 7-7 4v4h8l-1 6 3 7-3 2z",
				onClick: n[36] ||= (t) => e.onClick(t),
				onDblclick: n[37] ||= (t) => e.onDblClick(),
				onMouseenter: n[38] ||= (t) => e.onEnter(t),
				onMouseleave: n[39] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-IDF",
				style: k({ display: e.config.displayPath["FR-IDF"] }),
				d: "M583 258v2l-5 3v4l-3 3-2 7v6h-1l-3 3-14-1-6 3-3 6 3 3-4 5-4 4-9 5v-3h-4l-1 3h-14l-4 3-3-3 6-4-1-7-4-2-2-3-2-2-9-1-4-3-5 4-11 1-1-9-1-2v-4l-2-1-6-1-3-4-1-8h-5v-4l-6-4-2-6 2-4-2-3v-4l1-4-3-3-1-4-3-4-1 1v-2l2-2-3-1v-2l-2-3 2-2 10-3 2-4 2-8 3-4 2 3 2 4 10 1 7-1 4-4 9 6 4-1 4-2 8 4 8 5 2 2v1l4-3 6 3h4l2-3 5 3 6-2 3 1 4-3 2-1 4 3 1 8 10 9 3 1 2 4 6 2-1 1 1 2-3 2-1 5 3 2 1 5-2 3 1 3z",
				onClick: n[40] ||= (t) => e.onClick(t),
				onDblclick: n[41] ||= (t) => e.onDblClick(),
				onMouseenter: n[42] ||= (t) => e.onEnter(t),
				onMouseleave: n[43] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-GES",
				style: k({ display: e.config.displayPath["FR-GES"] }),
				d: "m901 210-3 9 1 6-4 3h-2l-4 5v4l-9 7-1 12-5 14 1 11-9 18v12l4 5-3 4v8l-2 4v9l-3 4 2 6 5 5-3 5-1 8-7 5h-13l-3-2 1-4-4 1-3-12-5 1-1-4 2-4-1-6-6-5-6-1-1-2-12-7-3-3-3-2-3 1-1 2-2 2h-2l-6-6h-7l-6 3-5-4v-4l-2-1-6 1-1 3-4 3-3-3-1 1 1 2-3 2h-1l1 3-3 2v5h-6v2l-5 1v5h4l-2 2-1 8h-3l-6 1-6-1-5 1v4l-1 4-8 2-1-2-6-7-3 1h-4l-2-3-6 1v-7l-3-2 4-5-8-11-6-7-5-2-1-1h-11v5l-5 2h-12l-2 4h-2l-2-4-8 4-14-1-2-4-4-5-1-7-5-7-4 3-7-5 2-10-10-10h-4l-2-2v-5l2-8 3-3v-4l5-3v-2h-5l-2-3 2-3-1-5-3-2 1-5 3-2-1-2 2-2 2-4 5-3 3-7 3-2-2-3h-4l-1-2 3-2 2-2-3-2v-4h9l-2-4-5-3v-9l7-5h8l-1-4 4-2 7 4 2-1v-12l1-5 1-4-4-3 1-3 6-1v-5l6-3 1-4-1-3v-5l3-3-3-6 1-7h7l5 4 4-2 8-2 4-3v-8l4-3 3-5v-1h6l1 2v6l-4 4 3 2-2 3-1 4 6 4v3l-2 2 1 8 12 1 3 3 2 4 10 1 3 3 1 7h3v1h2l3 3 1 7h2v-1l2-2h7l4-4h8l7 7h6l2 2h6l5-5h6l5 4h4l1-1h3l8 4 3 3 1 9 5 2v5l2 1 4 7 6-1v-4l5-2s3 2 5 2h1a13 13 0 0 1 4 5l3 2h13l5-5 8-1 3 4 7 5 3 3 7-2h4l3 3 5-3 8 4 9 1 5 4z",
				onClick: n[44] ||= (t) => e.onClick(t),
				onDblclick: n[45] ||= (t) => e.onDblClick(),
				onMouseenter: n[46] ||= (t) => e.onEnter(t),
				onMouseleave: n[47] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "FR-BFC",
				style: k({ display: e.config.displayPath["FR-BFC"] }),
				d: "m834 380 2 3-4 6-4 1 2 5-12 13-5 2v8l-5 4-14 7 1 17-22 21-1 2 4 2-6 6v8l-15 17h-10v-5l-6-2-7 7-5 1v-5l-5-2-7-10-5-2-2-1-2-5h-3l-4 2-3 1-4-3h-4l-2 5-7 26-2 5h-3l-1-7-2-6h-4l-3 4-2-3-4 3-4-3h-4l-1 1-2 11h-4l-3 3-2-2-12-2-4 3h-3l-1-3-5-1-1-6h-1l8-6v-14l-3-4h-5l-2-3h-7l-1-2v-5l-7-13-1-1-3-2-7 9-3 1-1-5-3-2-2 3h-5l-1-3-4 2-3 2-5-4-6-3v-3l3-9-2-3v-5l1-9-4-4 1-9-4-7v-5l-6-5-2-5 4-4v-7l-5-5v-4l5-1 2-1-1-4-1-6-5-6-1-4h7l6-4v-5l-3-4 9-8v-6l-4-5-2-6-7-6 4-4 4-5-3-3 3-6 6-3 14 1 3-3h1l2 2h5l9 10-1 10 6 5 4-3 6 7v7l4 5 2 4 14 1 8-4 2 4 2 1 2-4 1 2-1-3h12l5-2v-5h11l6 3 6 7 8 11-4 5 3 2v7l6-1 2 3h4l3-2 6 8 1 2 8-2 1-4v-4l5-1 6 1 6-1h3l1-8 2-2h-4v-5l5-1v-2h6v-5l3-2-1-3 4-2-1-2 1-1 3 3 3-3 2-3 6-1 2 1v4l5 4 6-3h7l6 6h2l2-2 1-2 3-1 3 2 3 3 12 7 1 2 6 1 6 5 1 2v4l-2 4 1 4 5-1 3 12-5 1-1 2-.6-.3-7.4 9.3v1z",
				onClick: n[48] ||= (t) => e.onClick(t),
				onDblclick: n[49] ||= (t) => e.onDblClick(),
				onMouseenter: n[50] ||= (t) => e.onEnter(t),
				onMouseleave: n[51] ||= (t) => e.onLeave(t)
			}, null, 36)
		], 8, nE)], 8, tE));
	}
}, iE = ["viewBox"], aE = ["stroke"], oE = {
	__name: "FranceAca",
	props: {
		config: {
			type: Object,
			required: !0
		},
		onClick: {
			type: Function,
			required: !0
		},
		onDblClick: {
			type: Function,
			required: !0
		},
		onEnter: {
			type: Function,
			required: !0
		},
		onLeave: {
			type: Function,
			required: !0
		}
	},
	setup(e) {
		return (t, n) => (I(), L("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: e.config.viewBox
		}, [R("g", {
			fill: "#5C68E5",
			stroke: e.config.colorStroke,
			"stroke-width": ".2%"
		}, [
			R("path", {
				class: "CORSE",
				style: k({ display: e.config.displayPath.CORSE }),
				d: "m1010 932-9 12 1 11v5l1 5-2 13-2 4h-5v4l3-2h4v4l-7 4v3l1 2-5 5 4 1-2 7h-5l-1-3h-6l2-3-3-2-4-1-12-4-6-4-4-3c0-1 3-5 3-7v-1c1 0 3 1 3 1l5-5-11-1-8-2 2-7 5-3-3-2 3-6-2-1-5 2-1-1h-6l-1-6 2-3 3-4 2-1 2-2-2-4-3-1-8-2v-8l-2-2v-2l5-1 4-1-1-3-6-4-3-3v-3h3l1-3 4-3-1-3v-6l3-1 1-6 2 2 3 1 2-4 7-6 9-2 2-6 4-4h4l1 1h5l3 3 3-1 2-4v-5l-4-4v-3l2-2-1-3 3-3-3-3v-4l5-4 3 2 2 2 2 8 2 10-2 6 1 13 5 4 2 4 1 22 4 7z",
				onClick: n[0] ||= (t) => e.onClick(t),
				onDblclick: n[1] ||= (t) => e.onDblClick(),
				onMouseenter: n[2] ||= (t) => e.onEnter(t),
				onMouseleave: n[3] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "NICE",
				style: k({ display: e.config.displayPath.NICE }),
				d: "m903 734-8 3 1 5-6 5 4 8-6 4-1 4h-6l-7 6-9 1v11h-4l-2 3-7-2-1 9-6 7-10 1-1 6-3 4-6 3h8v9l-6 3-5-2-2 4h-8l-3 2v5l-3 2-2-3h-2l-5-2-5 3 1 5 2 2h-9l4-2v-3l-11-1-6 4-4 3-4-1-2-8-6-2-1-2v-7l3-3 3-2v-2l-3-2h-3l-1-2 3-3v-1l-4-1v-3h7l2-1-6-6v-7l-4-3 4-6 8-6-7-4 1-2 9-3 12 8 7-5 1-4 9-3 6 4 9-6h10l2-2h6l-2-4 2-2v-2h5l1-2 5-3 4 3 2-2-6-5-6-6-3-1v-5l-4-6 2-8 1-5 4-3v-4l5-3h1l8 5v6h5l9 3 10 7h5l17-6h5l2 5 2 3 1 5z",
				onClick: n[4] ||= (t) => e.onClick(t),
				onDblclick: n[5] ||= (t) => e.onDblClick(),
				onMouseenter: n[6] ||= (t) => e.onEnter(t),
				onMouseleave: n[7] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "AIX-MARSEILLE",
				style: k({ display: e.config.displayPath["AIX-MARSEILLE"] }),
				d: "M853 659v3h-4l-3 4h-1l1 5-7 7-1 4 2 4 3 1 3 3-5 1v7h-1l-5 3v4l-4 3-1 5-2 8 4 6v5l3 1 6 6 6 5-2 2-4-3-5 3-1 2h-5v2l-2 2 2 4h-6l-2 2h-10l-9 6-5-4-10 3-1 4-7 5-12-8-9 3-1 2 6 4-8 5-3 7 4 3v7l6 6-2 1h-7v3l3 1v1l-3 3 2 2h3l3 2v2l-3 2-3 3v7l-1-1-9-3h-17l2-2 1-4h-8l6-5-1-4-6 3-20-1-3-7-7-3-5 4 7 6-12 2-16-3 4-6h5l-3-3-15-1h-11l3-8 12-7-3-4 3-8 11 2 3-20 10-5 4-3v-4l-11-11v-8l-6-10-1-1 2-4 10-1 2 2-1 7 1 2 5-5 5-1 1-2-6-1-1-7 4-6h5l5 5-5 6 1 3 8 1 4-4-2 5 1 4 7 1 10 1 1 4 6 5h5l3-3 2-5 3 2 2 3v-3l1-11h-3l-2-5-13-3-1-6 4-3-3-3v-3h6l5 3 4-5-4-3v-5l3-6 7-1 6-3 1-2-3-2v-4h10l2-3-1-3 4-4 4 2 4-4 9 1 2-3h7v-8l-3-1-1-5h-8l-1-2 2-8 2-2 7-1 2 2 1 6 6-1 1-6 3-1h7l3 5 1 4 6 2 1 11 10 4h5l4 1 1 10z",
				onClick: n[8] ||= (t) => e.onClick(t),
				onDblclick: n[9] ||= (t) => e.onDblClick(),
				onMouseenter: n[10] ||= (t) => e.onEnter(t),
				onMouseleave: n[11] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "MONTPELLIER",
				style: k({ display: e.config.displayPath.MONTPELLIER }),
				d: "M690 743v4l-15 8-2 20-11-2-3 8 3 4-12 7-3 8h-13v-7l-6-1h-5l-12 8-19 16-3 4h-11l-1 4-13 3v2l-1 4-3 4-6 4-6-6-3 5 4 6 4-1v22l1 32 5 2 3 4v6l-6-1-5-5h-7l-6 2-3 5-11 2-1 5-2 2-2-2h-3l-3 3-10-8-12-4-7 1-6 8h-5l-6-5v-6l-10-3-6-5-1-4 12-2 4-4 6-2 1-3h13l1-1-8-9-7 3-12-9 3-4h9l-1-9v-6l-2-13-17-8 1-3-5-5 5-2 1-6 6-2-2-4 5-4 3 4 7-2 4-1v3h7l6 2 1-7h3l11 2h11l8-2 2-7-6-5 2-5 3-5 5 4 13-5 2-4h10l-1-10v-4h3l6 3h5l-1-6 3-3 7-1v-5l6-3-1-7h-6l-5-1-1-4 4-1v-5l4-4-3-1-9 1 1-4-6-2-2-13v-8l-5-4v-7l-7-9 5-12 5-16 7 4 3-6 10-4 6 17 10-3v-5h4l1 6 7-2 9 12 3 13 6 7-1 7 2 1 6 4v10l4-2 8 6 4 1 1-7 5-1 2 6 5-1 1-5 13 7 6 10v8z",
				onClick: n[12] ||= (t) => e.onClick(t),
				onDblclick: n[13] ||= (t) => e.onDblClick(),
				onMouseenter: n[14] ||= (t) => e.onEnter(t),
				onMouseleave: n[15] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "CLERMONT-FERRAND",
				style: k({ display: e.config.displayPath["CLERMONT-FERRAND"] }),
				d: "m658 614-2 8-5 2-2 4 1 5 1 2h-5l-1 7h-5l-3 9h-9l-9 7-6 8-8-10-7 2-1-6h-4l-1 5-9 3-6-17h-1l-9 3-3 7-7-4-5 16-5 11-3-3-1-11h-4l-1-10-7 1-1-7-1-1-11 9v9h-2l-1 8-3 1-2 4h-11l-1-1h-5l-3 5-4-1 2-6-5-2 5-10-7-5-1-12 4-3-1-4-2-2 3-4h2l2-6 2-3-1-6 4-6 7-5v-10l3 2 4 4h4l2-2-2-5 1-4 1-2-1-6-2-3v-5l3-5-1-5-8-9-1-3 7-4 4-2 1-5 4-3-1-7-3-4v-7.3l-1-.7v-3l-4-9-4-2-3-5-2 4-3-4v-4l-4-6 2-4 4-5 9-2 5 1 5-4v-2l-2-2v-6l10-9 3 4 3-4h3l5-6h9v5l6 3 5 4 3-2 4-2 1 3h5l2-3 3 2 1 5 3-1 7-9 3 2 8 14v5l1 2h7l2 3h5l3 4v14l-8 6-6 1-1 4 2 5 1 21h-9v3l6 5-3 3-2 8 5 6 4 9 9 6 3 12-6 7 1 4 2 1 8 2 8-6h4l11 5-1 6h6z",
				onClick: n[16] ||= (t) => e.onClick(t),
				onDblclick: n[17] ||= (t) => e.onDblClick(),
				onMouseenter: n[18] ||= (t) => e.onEnter(t),
				onMouseleave: n[19] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "BORDEAUX",
				style: k({ display: e.config.displayPath.BORDEAUX }),
				d: "m434 648-4 6-3 1v4l-6 1v4h3l-6 8h-7l-1 6-3.8 3.8.8.2-2 4h-7l3 11 3 8-7 1-6-3-3 8 4 5-1 6-3 3 2 4-7 2-5 1 1 5-3 1-2 2-6-5-11 1-2 5-7 1-6 1-3-4-5 6-5-4-2 6v4l-4 1-2-2-1-6-5 5-4-2-4 1-4 4 5 7-3 3 1 7-4 4-2 7 2 5h1l9 1 6 10-3 4 2 4 5 6-4 5-6 13-9 8 2 5-2 2-5-1-2 12-3 2v7l-7 4-3 2-2-2-3 1-4 2-4-5-9-7-1-7h-14l-8-5-9-2-3-4h-6l-3-3 1-5-3 3-1 6-6-2-3-4v-3l5-2v-7l2-2-1-5-4-1-7-3-1 4-5-1-1-5h-6l-4-4v-4h4l7-3 8-10 1-3 6-9 2-9 11-44 6-34v-8l4-6 1-5 3-2 2 3 9-1-2-3-1-2-7-6-5 6-3 8v-6l4-24 4-30 2-30 6-9v-1l4 1-1 7 19 17 7 28 1-2v-11l-3-10v-3h10l2-1v5l10 1 1 12h5l9 8 4 1 5-2 4 2 1-4 1.5 1.5-.5-1.5 1-2 4-7 7 1 10-10v-12l17-12v-9h6l3-6h10l2 4-1 4 3 4 2-1 3-3 11 1 2 7 8 1 2 3-5 2 2 2 8 1 2 6 4 3-7 6v5l3 2-3 3 4 4-3 3 3 2h8v8l3 5-3 2v4z",
				onClick: n[20] ||= (t) => e.onClick(t),
				onDblclick: n[21] ||= (t) => e.onDblClick(),
				onMouseenter: n[22] ||= (t) => e.onEnter(t),
				onMouseleave: n[23] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "TOULOUSE",
				style: k({ display: e.config.displayPath.TOULOUSE }),
				d: "m583 746-6 3v5l-7 1-3 3 1 6h-5l-6-3h-3v3l1 11h-10l-2 4-13 5-5-4-3 5-2 5 6 5-2 7-8 2h-11l-11-2h-3l-1 7-6-2h-7v-3l-2 1h-2l-7 2-3-4-5 4 2 4-6 3-1 5-5 2 1 1 3 4v3l17 8 2 13v6l1 9h-9l-3 4 12 9 7-3 8 9-14 1-1 3-6 2-4 4-12 2-1-7-15-2-6 2-6-9h-15l-7-7h-5l-11-3-1-1-8-4-5-1-1 18-14-1-7-1-4-1-2 4-7-1-5-6-12 5h-5l-5-5-1-4-7-6-6-3h-1v-7l3-2 2-12 5 1 2-2-2-5 10-8 5-13 4-5-5-6-2-4 3-4-6-10-9-1-3-5 2-7 4-4-1-7 3-2-5-8 4-4 4-1 4 2 5-5 1 6 2 2 4-1v-4l2-6 5 4 5-6 3 4 6-1 7-1 2-5 11-1 6 5 1-2h1l3-1-1-5 5-1 7-2-2-4 3-3 1-6-4-5 3-8 6 3 7-1v-1l-3-7-3-11h7l2-5 3-3v-6h8l6-8-3-1v-3l6-1v-4l3-1 4-6-4-4v-4l3-2h1l7-4 9 4 8 10h4l6-6 2 3 4-4 6 2 2 13 6 5-5 10 5 2-2 6 3 1h1l3-5h5l1 1h11l2-4 3-1 1-8h2v-9l11-9 1 2v6l8-1 1 11h4l1 10 11 13-1 7 5 4v8l2 13 6 2-1 4 9-1 3 1-4 4v5l-4 1 1 4 5 1h6z",
				onClick: n[24] ||= (t) => e.onClick(t),
				onDblclick: n[25] ||= (t) => e.onDblClick(),
				onMouseenter: n[26] ||= (t) => e.onEnter(t),
				onMouseleave: n[27] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "GRENOBLE",
				style: k({ display: e.config.displayPath.GRENOBLE }),
				d: "m852 596 1 2-1 7-9 3-2 2-5 3v4h-4l-4-2-11 4h-7l-3 1-1 6-6 1-1-6-2-2-7 1-2 2-2 8 1 2h8l1 5 3 1v8h-7l-2 3-9-1-4 4-4-2-4 4 1 3-2 3h-10v4l3 2v1l-1 1-6 3-7 1-3 6v5l4 3-4 5-5-3h-6l-1 3 4 3-4 3 1 6 13 3 2 5h3l-1 14-2-3-3-3-2 6-3 3h-5l-5-5-2-4-10-1-8-1v-4l2-5-4 4-8-1-1-3 5-6-5-5h-5l-4 6 1 7 6 1-1 2-5 1-5 5-1-2 1-7-2-2h-5l-5 1-2 4-12-6-1 5h-5l-2-5-5 1-1 7-4-1-8-6-4 2v-10l-8-5 1-8-6-6-3-13-1-2 6-8 9-7h9l3-9h5v-7h6l-1-2-1-5 2-4 5-2 2-9h3l6-2 2-7 8-5h1v-11l8-4-1-3-5-5 8-2 10-3 8-10-5-4v-5h4l5 4 4-2 3-7 2-3 3 1 3 2 2 5 14 18 5-3v-7h5v-12l3-2v-11l1 .8V532l-2-4 1-10 4 2 1-3 4-1 4-3h8l4-5 8-4-4-4-1-3 4-8h4l2 3 8-6 8-2h13v5l6 7v5l-4 4 1 3 6 3v9l3-1 8 8 1 8-2 3-12 5v12l5 7s5-1 7-1c2 2 1 13 1 13l9 6 2 5 5 2z",
				onClick: n[28] ||= (t) => e.onClick(t),
				onDblclick: n[29] ||= (t) => e.onDblClick(),
				onMouseenter: n[30] ||= (t) => e.onEnter(t),
				onMouseleave: n[31] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "LIMOGES",
				style: k({ display: e.config.displayPath.LIMOGES }),
				d: "m519 538-4 3-1 5-4 2-7 4 1 3 7 8 1 1 1 5-3 5v5l2 3 1 6-2 6 2 5-2 2h-4l-4-4-3-1v9l-7 5-4 6 1 6-2 3-2 6h-2l-3 4 2 2 1 4-4 3-1-1-5-2-4 4-2-3-6 6h-4l-7-10-10-4-7 4h-1l-3-5v-8h-8l-3-2 3-3-4-4 3-3-3-2v-5l7-6-4-3-2-4v-2l-8-1-2-2 5-2-2-3-8-1-2-7-11-1-3 3-2 1-3-4 1-4-2-4h-8l1-6h3l2-5 3-1 5-3-1-9 3-1 7-1-1-4-1-5h-5l-3-3 2-4 1-9-3-3 3-2 5-6h7v-4l5-4 6-1h1l10 1 3-3 6 5v-1l7-7 3 2h4l2 1h6l2-6 18 2 7 2 12-1 4 6v4l3 4 2-4 3 5 4 2 4 9 1 11 3 4z",
				onClick: n[32] ||= (t) => e.onClick(t),
				onDblclick: n[33] ||= (t) => e.onDblClick(),
				onMouseenter: n[34] ||= (t) => e.onEnter(t),
				onMouseleave: n[35] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "POITIERS",
				style: k({ display: e.config.displayPath.POITIERS }),
				d: "m417 489-1 5-9 2-5 3v5h-7l-5 6-3 2 3 3-1 7v2l-2 4 3 3h5l1 5 1 4-7 1-3 1 1 9-5 3-3 1-2 5h-3l-1 6h-2l-3 6h-6v9l-17 12v12l-10 10-7-1-2 2-2 5-3 6-4-2-5 2h-4l-8-9h-6l-1-12-9-1-1-5-2 2h-10l-3-13-11-11-4-1-1-4-5-3-7-6-5 1v-8l-2-8-1-7-8-6 1-13 5 6 6 1 1 9 1 1 2 3-4 4 1 3h5l-1-2v-5h4l2-8-3-4 1-3 4 1 1-4-4-1-2-5-4-1-2-4-8 1-3-3-6-4h-5l-3-5 6-3 4 3 1 4 7 1 3 3 5-1 1-3 6-5-3-3 11-6 5-1 2 6 7-3 5 4h1l4-2 5-1 1-2 5-3-3-4-3 3v-3l2-5-2-4 2-3-1-10-4-6 3-3-6-7 2-4-9-8v-4l-3-5 7-3 11 2 5-3v-5l10-1 9-1 10-1 1 3 3 2v-1l2-3 7-8v1h3l2 5 6 2v4l9 2v12h11l9-3-1-3 3-2 3 4 2 1 3 8 6 7 1 5 6 6v7l-1 5 7 5 3 4h6l2 8z",
				onClick: n[36] ||= (t) => e.onClick(t),
				onDblclick: n[37] ||= (t) => e.onDblClick(),
				onMouseenter: n[38] ||= (t) => e.onEnter(t),
				onMouseleave: n[39] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "RENNES",
				style: k({ display: e.config.displayPath.RENNES }),
				d: "M259 289v6l1 3v11l2 2v10l-6-1-2 2-5 11-2 7-1 3-8-2-3-5h-5l-1 4-8 1-3 3-2 4-22 2-9 4-1 11-10 3-7 4h-6l-2-2-3 3h-2v-4l2-2-5-1-20 2-3-5-4-2 3-3 10 4 2-3-4-4-5-2 1 3-5 1-1-1-3 4-4-4-1-3-2 5-4-1v6l2 3-2 3-5-4 1-4 1-5-2-4-7-7-5-2 1-4-2 4-6-2-4-6 .2-.8-.2-.2h-4l-7-1-2-3v2l-10-1-5-7-2-7v7h-3l-6-3h-3l-4-1 4 4-2 4h-8l-8-2 3-5-2-9-8-9-4 1-4-3H4l-3-2 2-3 12-1 8-1h9l2-4-2-5-3-1-8-4-4 6-2 1 1-9-7-3 5-5 9 3 7 2 8 1v-3h-7l1-5-7 3-1-3 8-8-9 7-14 1-1-1-2 2-6-1 2-7-2-4 6-4-5-4 6-6h9l1-4 3-2 2 2h6v-3l8-1 1 4 5-1 1-4 8-1 4 2 5-4v8h5v3h3v-7l10-1 6 4 5-7-2-4 7-5 6 4 2-2 8-1 3-3 2 5 1-4h8l-1 4 4 1v6l5 1v6l7 5-1 6 8 4v7h3v-4l13-7 2-5 7 2 4-4v7l2-2 4 1v5l5-1v-4l7 1 2.2-2.2-.2-.8 4-3h9l-5 6 7 4h18l1 4 2 7 6 5 3 1 3-4h3l4-5 4 3h4l3 1-1 11 2 1v7z",
				onClick: n[40] ||= (t) => e.onClick(t),
				onDblclick: n[41] ||= (t) => e.onDblClick(),
				onMouseenter: n[42] ||= (t) => e.onEnter(t),
				onMouseleave: n[43] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "NANTES",
				style: k({ display: e.config.displayPath.NANTES }),
				d: "m390 319 4 3-1 8-1 5h-4v7l-5 6-5 2-3 3 2 5-11 3-2 3-4-3 2 8h-4l-7-5-3 4-1 3 2 2v2l-4 5v8l-5 6-4 15h-3l-7 8-2 4-3-2-1-3-10 1-9 1-10 1v5l-5 3-11-2-7 3 3 5v4l9 8-2 4 6 7-3 3 4 6 1 10-2 3 2 4-2 5v3l3-3 3 4-5 3-1 2-5 1-4 2-6-4-7 3-2-6-5 1-11 6-2-2v6l-8-4-4-6h-8l-3-7h-8l-8-7-7-4-7-20h-3v-4l-11-10 1-9 10-14h1l-10-9-7 1-1-5h4l4-4-1-3-1-4 7-3h-6l-5 5h-7l-4-5v3l-7-2-4-2 4-5-2-3-1-1 6-7-1-1h1l3-3 3 2h5l7-3 10-4 1-10 9-5 23-2 1-3 3-4 8-1 1-4 5 1 3 4 7 2h1l.9-1.9.9.2-.8-.3-.1.1-.9-.1 1-1 2-7 5-11 2-2 6 1v-10l-2-2v-11l-1-3v-6l3-4v-7l-2-1 1-10 6 1 3-3 6 2 2 5 4 3 6-4 3 2 10-5 10 1 5-2 2-4h3l4 3 1 8 5 2 2 6h6l10-9h9l3 4 2 13 6 2 4 6h7v2l1-3h1l5 7 5 1 5 3-4 6z",
				onClick: n[44] ||= (t) => e.onClick(t),
				onDblclick: n[45] ||= (t) => e.onDblClick(),
				onMouseenter: n[46] ||= (t) => e.onEnter(t),
				onMouseleave: n[47] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "ORLEANS-TOURS",
				style: k({ display: e.config.displayPath["ORLEANS-TOURS"] }),
				d: "m554 329-9 8 3 4v5l-5 4h-8l1 4 5 6 1 6 1 4-7 2v4l5 5v7l-4 4 2 5 6 5v5l4 7-1 9 4 4-1 9v5l2 3-3 9v-2h-9l-5 6h-3l-3 4-3-4-10 9v6l2 2v2l-5 4-5-1-9 2-4 5-2 4-8 1h-4l-7-1-18-3-2 6h-6l-2-1h-4l-3-2-7 8-6-5-3 3-10-1h2l1-6-4-2-2-8h-6l-3-4-7-5 1-5v-7h-1l-5-6-1-5-6-7-3-8-2-1-3-4-3 1 1 4-10 3h-10v-12l-9-2v-4l-6-2-2-6 4-14 6-7-1-8 4-5v-2l-2-2 4-7 7 5h4l-2-8 4 3 2-3 11-3-1-2-1-3 3-3 5-2 5-6v-7h4l1-5 1-8-4-3 3-5 4-6-5-3h-1v-9l-2-3-1-3 5-3 6-1 3-5v-13l-8-7v-6l-1-1 5-4h5l13-7 4 1h9l2-2v-5l8-4v-6l2-2 3 4 1 4 3 3-1 4v4l2 3-2 4 2 6 6 4v4l5 1 1 7 3 4 7 2 1 4 1 2 1 9h1l10-1 5-4 4 3 9 1 4 5 4 2 1 7-6 4 3 2 4-2h14l1-3h4v3l9-5 7 6 2 6 4 5z",
				onClick: n[48] ||= (t) => e.onClick(t),
				onDblclick: n[49] ||= (t) => e.onDblClick(),
				onMouseenter: n[50] ||= (t) => e.onEnter(t),
				onMouseleave: n[51] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "DIJON",
				style: k({ display: e.config.displayPath.DIJON }),
				d: "M725 393v2h-1l-1 6-1 4 1 3-5 5v3l-6 3-2 3 2 4-3 1v5h3l3 6h4l2 2h3l-1 3-8 1v3l3 2v4l-1 1 2 3 3 5-1 6-4 3 1 5 4 2 2 2-4 3-10 1-2-1-2-5h-3l-4 2-3 1-4-3h-4l-2 5-7 26-2 5h-3l-1-7-2-6h-4l-3 4-2-3-4 3-4-3h-4l-1 1-2 11h-4l-3 3-2-2-12-2-4 3h-3l-1-3-5-1-1-6h-1l8-6v-14l-3-4h-5l-2-3h-7l-1-2v-5l-7-13-1-1-3-2-7 9-3 1-1-5-3-2-2 3h-5l-1-3-4 2-3 2-5-4-6-3v-3l3-9-2-3v-5l1-9-4-4 1-9-4-7v-5l-6-5-2-5 4-4v-7l-5-5v-4l5-1 2-1-1-4-1-6-5-6-1-4h7l6-4v-5l-3-4 9-8v-6l-4-5-2-6-7-6 4-4 4-5-3-3 3-6 6-3 14 1 3-3h1l2 2h5l9 10-1 10 6 5 4-3 6 7v7l4 5 2 4 14 1 8-4 2 4h2l2-4h12l5-2v-5h11l6 3 6 7 8 11-4 5 3 2v7l6-1 2 3h4l3-2 6 8 1 2 8-2 1-4 4 1 3 6 1 3-5 5-2 1-2 2 4 2 1 5h3l1 8z",
				onClick: n[52] ||= (t) => e.onClick(t),
				onDblclick: n[53] ||= (t) => e.onDblClick(),
				onMouseenter: n[54] ||= (t) => e.onEnter(t),
				onMouseleave: n[55] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "NORMANDIE",
				style: k({ display: e.config.displayPath.NORMANDIE }),
				d: "m462 192-2 1-3-2-1 4-3 4-2 8-2 4-10 3-2 2 2 3v2l3 1-2 2v1l-1 2v6l-8 4v5l-2 3h-9l-4-2-13 7h-5l-5 4 1 1v6l8 7 1 13-4 5-5 1-6 3 1 3 2 3v9l-3-1-6-8h-1l-1 4v-2h-7l-4-6-6-2-2-13-3-4h-9l-10 9h-6l-2-6-5-2-1-8-4-3h-3l-2 4-5 2-10-1-10 5-3-2-6 4-4-3-2-4v-1l-5-2-4 3-6-1v-1l-3-1h-4l-4-3-4 5h-3l-3 4-3-1-6-5-2-7-1-4h7l3-2v-4l-8-2-5-13 4-9v-10l-4-9v-13l-2-2-2-9-8-9-2-6v-7h-1l-2-2 3-4v-7l-7-7 1-3 14 4 9 6 8-6 16 1 3 9h-4l-3 8 10 11v8h4l10-3 7 4 30 4 12 7 16-6 13-8 9-2h1l-10-2-7-6 1-10 9-13 15-8 18-6 27-7 16-12 2-3 3 1h4l2 4 16 15 1 7 4 6-4 4-1 4h2l-1 4-1 7 2 4v6h3l-1 2-3 5-1 3 4 3 1 8z",
				onClick: n[56] ||= (t) => e.onClick(t),
				onDblclick: n[57] ||= (t) => e.onDblClick(),
				onMouseenter: n[58] ||= (t) => e.onEnter(t),
				onMouseleave: n[59] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "LILLE",
				style: k({ display: e.config.displayPath.LILLE }),
				d: "M620 115h1l-2 1-7-2-2-4h-2l-4 3v-3h-9l-2-2-2-1-6 4-3-2h-2l-6 4-4-3-5 3h-1l-1-2h-4l-3 2-3-1-3-3h-9l-5 3v-3l-2-2-3 1-4 2 2-3v-3l-5-3v4h-3l-8-3-3-2-3 2-1 3h-2l-2-2v-5l6-3-2-4-5 2-2-2-9 1-4 2-5-2v-4l-7-3-2-4-2 1-7-5-3-1-3 3-4 1-2-4-5-1V25l16-13 19.7-2.9.3-.1-1-1h2l18-2 11-6 5 9 1 6-2 4v6l2 4h5l4 4 1 4 2 3h5l4-5 9-3h5l1 4h2v2l3 2 1 14 1 5h5l3 3 7-3 2 3 5-1 6 7-1 13h3l2-4 20-1 12 9 1 3-5 4v5l-2 1 7 2 1 7-7 4z",
				onClick: n[60] ||= (t) => e.onClick(t),
				onDblclick: n[61] ||= (t) => e.onDblClick(),
				onMouseenter: n[62] ||= (t) => e.onEnter(t),
				onMouseleave: n[63] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "AMIENS",
				style: k({ display: e.config.displayPath.AMIENS }),
				d: "m626 136 2 3-1 4-6 3v5l-6 1-1 3 4 3-1 5-1 4v12l-2 1-7-4-4 2 1 3h-8l-7 6v9l5 3 2 4h-9v4l3 2-2 2-3 2 1 2h4l2 3-3 2-3 7-5 3-2 4-1 1-6-2-2-4-3-1-10-9-1-8-3-3h-1l-2 1-4 3-3-1-6 2-5-3-2 3-4 1-2-2-4-2-4 3-2-3-8-5-8-4-4 2-4 1-9-6-4 4-7 1-10-1-2-4-2-3 1-4 3 2 2-1-1-3-1-8-4-3 1-3 3-5 1-2h-3v-6l-2-4 1-7 1-4h-2l1-4 4-4-4-6-1-7-16-15-2-4h-4l-3-1 12-14 10 6v-4l-8-7 1-12 5 1 2 4 4-1 3-3 3 1 7 5 2-1 2 4 7 3v4l5 2 4-2 9-1 2 2 5-2 2 3-6 4v5l2 2h2l1-3 3-2 3 2 8 3h3v-4l5 3v3l-2 3 4-2 3-1 1 2v3l6-3h8l4 3 3 1 3-2h4l1 2h1l5-3 4 3 6-4h2l3 3 6-5 2 1 2 2h8l1 4 4-4h2l2 4 7 2 2-1h7l-1 6 3 7-3 2z",
				onClick: n[64] ||= (t) => e.onClick(t),
				onDblclick: n[65] ||= (t) => e.onDblClick(),
				onMouseenter: n[66] ||= (t) => e.onEnter(t),
				onMouseleave: n[67] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "REIMS",
				style: k({ display: e.config.displayPath.REIMS }),
				d: "m748 326 1 3-3 2v5h-6v2l-5 1v5h4l-2 2-1 8h-3l-6 1-6-1-5 1v4l-1 4-8 2-1-2-6-7-3 1h-4l-2-3-6 1v-7l-3-2 4-5-8-11-6-7-5-2-1-1h-11v5l-5 2h-12l-2 4h-2l-2-4-8 4-14-1-2-4-4-5-1-7-5-7-4 3-7-5 2-10-10-10h-4l-2-2v-5l2-8 3-3v-4l5-3v-2h-5l-2-3 2-3-1-5-3-2 1-5 3-2-1-2 2-2 2-4 5-3 3-7 3-2-2-3h-4l-1-2 3-2 2-2-3-2v-4h9l-2-4-5-3v-9l7-5h8l-1-4 4-2 7 4 2-1v-12l1-5 1-4-4-3 1-3 6-1v-5l6-3 1-4-1-3v-5l3-3-3-6 1-7h7l5 4 4-2 8-2 4-3v-8l4-3 3-5v-1h6l1 2v6l-4 4 3 2-2 3-1 4 6 4v3l-2 2 1 8 12 1 3 3 2 4 10 1 3 3 1 7h3l-3 4-3 2-2-2h-6l-1-1-4 6-1 3 4 5-1 8-4 3v2l2 4-2 2-5 2v2l1 2 2 1-3 3 2 5 3 8-4 4 6-1-3 9-4 2-2 5 2 2-2 5v3l7 5v6l1 7 7 1 5 5 8 4 4 1 7 8-3 3 3 4 5 1 5 6h5l1 5 5 1 1 3-4 2-2 10 10 5v7l4-1 3 3z",
				onClick: n[68] ||= (t) => e.onClick(t),
				onDblclick: n[69] ||= (t) => e.onDblClick(),
				onMouseenter: n[70] ||= (t) => e.onEnter(t),
				onMouseleave: n[71] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "STRASBOURG",
				style: k({ display: e.config.displayPath.STRASBOURG }),
				d: "m901 210-3 9 1 6-4 3h-2l-4 5v4l-9 7-1 12-5 14 1 11-9 18v12l4 5-3 4v8l-2 4v9l-3 4 2 6 5 5-3 5-1 8-7 5h-13l-3-2 1-4-4 1-3-12-5 1-1-4 2-4 1-4-2-2-6-5-6-1-1-2v-1l4-4v-14l6-5 4-8-1-6 8-16v-1l-6-2-2-10 2-6-3-3 4 1 7-8 2-7-3-3v-3l4-8-10-5-6 4-3-2 2-4-4-2-5-2v-5l5-1 2-9 3-3 2 5 3 2 7 1 4 4h4l4-3 5 3h2l3-2v-6l3-5 7-2h4l3 3 5-3 8 4 9 1 5 4z",
				onClick: n[72] ||= (t) => e.onClick(t),
				onDblclick: n[73] ||= (t) => e.onDblClick(),
				onMouseenter: n[74] ||= (t) => e.onEnter(t),
				onMouseleave: n[75] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "NANCY-METZ",
				style: k({ display: e.config.displayPath["NANCY-METZ"] }),
				d: "m865 202-3 5v6l-3 2h-2l-5-3-4 3h-4l-3-4-7-1-4-2-2-5-3 3-2 9-5 1v5l5 2 4 2-2 4 4 2 6-4 10 5-5 8 1 3 2 3-2 7-6 7h-5l3 3-2 6 1 10 7 2-4 9-4 8 1 6-4 8-6 5v14l-4 4-12-6-3-3-3-2-3 1-1 2-2 2h-2l-6-6h-7l-6 3-5-4v-4l-2-1-6 1-1 3-4 3-3-3-1 1 1 2-3 2-3-3-4 1v-7l-10-5 2-10 4-2-1-3-5-1-1-5h-5l-5-6-5-1-3-3 2-3 1-1-7-8-4-1-8-4-5-5-7-1-1-13-7-5v-3l2-5-2-1 2-6 4-2 3-9-6 1 4-4-3-8-2-5 3-3-2-1-1-4 5-2 2-2-2-4v-2l4-3 1-7-4-6 1-2 4-7 1 1h5l3 3 3-2 3-5v1h2l3 3 1 7h2v-1l2-2h7l4-4h8l7 7h6l2 2h6l5-5h6l5 4h4l1-1h3l8 4 3 3 1 9 5 2v5l2 1 4 7 6-1v-4l5-2s3 2 5 2h1a13 13 0 0 1 4 5l3 2h13l5-5 8-1 3 4 7 5z",
				onClick: n[76] ||= (t) => e.onClick(t),
				onDblclick: n[77] ||= (t) => e.onDblClick(),
				onMouseenter: n[78] ||= (t) => e.onEnter(t),
				onMouseleave: n[79] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "VERSAILLES",
				style: k({ display: e.config.displayPath.VERSAILLES }),
				d: "m506 224-10 1 1 1h1v3h-1v2l-2 1-1 1h-1l-2 2v2l3 1 4 2-1 2 1 1-1 3 .9 1.7 2.1-.7 3 2h7l4 2v4l-3 3 2 10-1 2-2 9 3 3-8 6v7l-2-2-9-1-4-3-5 4-11 1-1-9-1-2v-4l-2-1-6-1-3-4-1-8h-5v-4l-6-4-2-6 2-4-2-3v-4l1-4-3-3-1-4-3-4-1 1v-2l2-2-3-1v-2l-2-3 2-2 10-3 2-4 2-8 3-4 2 3 2 4 10 1 7-1 4-4 9 6 4-1 4-2 8 4 8 5 2 2-1 7-4 3z",
				onClick: n[80] ||= (t) => e.onClick(t),
				onDblclick: n[81] ||= (t) => e.onDblClick(),
				onMouseenter: n[82] ||= (t) => e.onEnter(t),
				onMouseleave: n[83] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "CRETEIL",
				style: k({ display: e.config.displayPath.CRETEIL }),
				d: "M583 258v2l-5 3v4l-3 3-2 7v6h-1l-3 3-14-1-6 3-3 6 3 3-4 5-4 4-9 5v-3h-4l-1 3h-14l-4 3-3-3 6-4-1-7-4-2-2-3v-7l8-6-3-3 2-9 1-2-2-10 3-3v-4l-4-2h-7l-4-2-1 1-1-2 1-3-1-1 1-2h3l2-1 4 1v-3h-2v1h-2l1-1-1-4-1-2h-5v-2h1v-3h-1l-1-1 10-1 5-2 3.5-2.6 1.5-7.4v1l4-3 6 3h4l2-3 5 3 6-2 3 1 4-3 2-1 4 3 1 8 10 9 3 1 2 4 6 2-1 1 1 2-3 2-1 5 3 2 1 5-2 3 1 3z",
				onClick: n[84] ||= (t) => e.onClick(t),
				onDblclick: n[85] ||= (t) => e.onDblClick(),
				onMouseenter: n[86] ||= (t) => e.onEnter(t),
				onMouseleave: n[87] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "PARIS",
				style: k({ display: e.config.displayPath.PARIS }),
				d: "M502 231h-5l-2 1-1 1h-1l-2 2v2l3 1 4 2h3l2-1 4 1v-3h-2v1h-2l1-1-1-4z",
				onClick: n[88] ||= (t) => e.onClick(t),
				onDblclick: n[89] ||= (t) => e.onDblClick(),
				onMouseenter: n[90] ||= (t) => e.onEnter(t),
				onMouseleave: n[91] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "BESANCON",
				style: k({ display: e.config.displayPath.BESANCON }),
				d: "m834 380 2 3-4 6-4 1 2 5-12 13-5 2v8l-5 4-14 7 1 17-22 21-1 2 4 2-6 6v8l-15 17h-10v-5l-6-2-7 7-5 1v-5l-5-2-7-10-5-2 10-1 4-3-2-2-4-2-1-5 4-3 1-6-3-5-2-3 1-1v-4l-3-2v-3l8-1 1-3h-3l-2-2h-4l-3-6h-3v-5l3-1-2-4 2-3 6-3v-3l5-5-1-3 1-4 1-6h1v-2l-1-1-1-8h-3l-1-6-4-1 2-2 2-1 5-5-1-3-3-6-4-1v-4l5-1 6 1 6-1h3l1-8 2-2h-4v-5l5-1v-2h6v-5l3-2-1-3 4-2-1-2 1-1 3 3 3-3 2-3 6-1 2 1v4l5 4 6-3h7l6 6h2l2-2 1-2 3-1 3 2 3 3 12 7 1 2 6 1 6 5 1 2v4l-2 4 1 4 5-1 3 12-5 1-1 2-.6-.3-7.4 9.3v1z",
				onClick: n[92] ||= (t) => e.onClick(t),
				onDblclick: n[93] ||= (t) => e.onDblClick(),
				onMouseenter: n[94] ||= (t) => e.onEnter(t),
				onMouseleave: n[95] ||= (t) => e.onLeave(t)
			}, null, 36),
			R("path", {
				class: "LYON",
				style: k({ display: e.config.displayPath.LYON }),
				d: "m772 498 2 1v4h-7l-4 3v7h4l-4 3-3 1-2 3-4-2-1 10 2 4v4l-1-1v11l-3 2v12h-5v7l-5 3-14-18-2-5-3-2-3-1-2 3-3 7-4 2-5-4h-4v5l5 4-8 10-10 3-8 2 5 5 1 3-7 4h-1v11l-9 5-2 7-6 2h-3l-5-5h-6l1-6-12-5h-3l-8 6-10-3-1-4 6-7-3-12-9-6-4-9-5-6 2-8 3-3-6-5v-3h9l-1-21-2-5 1-4 6-1 1 1 1 5 5 1 1 3h3l4-3 12 2 2 2 3-3h4l1-7 1-4 1-1h4l4 3 4-3 2 3 3-4h4l2 6 1 7h3l1-2 1-3 7-26 2-5h4l4 3 3-1 4-2h3l2 5 7 3 7 10 5 2v5l5-1 7-7 6 2v5h10l15-17 6 4 1 2z",
				onClick: n[96] ||= (t) => e.onClick(t),
				onDblclick: n[97] ||= (t) => e.onDblClick(),
				onMouseenter: n[98] ||= (t) => e.onEnter(t),
				onMouseleave: n[99] ||= (t) => e.onLeave(t)
			}, null, 36)
		], 8, aE)], 8, iE));
	}
}, sE = {
	xmlns: "http://www.w3.org/2000/svg",
	viewBox: "0 0 57 50"
}, cE = ["stroke"], lE = {
	__name: "Guadeloupe",
	props: {
		config: {
			type: Object,
			required: !0
		},
		onClick: {
			type: Function,
			required: !0
		},
		onDblClick: {
			type: Function,
			required: !0
		},
		onEnter: {
			type: Function,
			required: !0
		},
		onLeave: {
			type: Function,
			required: !0
		}
	},
	setup(e) {
		return (t, n) => (I(), L("svg", sE, [R("g", {
			fill: "#5C68E5",
			stroke: e.config.colorStroke,
			"stroke-width": "0.2%"
		}, [R("path", {
			class: "FR-971 GUADELOUPE",
			d: "m22.8 0-.2.2-2 1.2-.7.5-.3.4-1 1.3-.7 1v.6l.4.7.4 2.5.5.1.6.3.4.3.3.3V11l-.2.3-1.3.3-.6.7-1.1 3.8-.3 1v1l.3.8.7.9.9.7 1.1.7 1.4.5 1.4.3 1.2-.2 2.3-1 12-2.8 1 .3.6.2 2 .5h.5l.7-.6-.3-.4-1.3-.4-3.7-2.6-.7-.3-.4-.3-1.5-1.3-.7-.4-.8-.1h-1.3l-.7-.4-.5.5-1-.5-.8-.6-.7-.8-.7-1-.5-1.1-.1-.7.1-1.9-.3-1.8-.8-1.5-1.2-1.2L23 .1zm-6 16.2-.5-.5-.8.2-.7.5-.3.8-.7-.8-.3-.2-.2.2H13l-.5-.2 1-.5-1.2-1.4L10 13l-2.5-1-1.7-.3-.6-.3-.5-.6-.6-.4-1.3.3-1 .9-1.1 2-.7.6.3.9-.3 2.2v1.2l.4.8.5.8.4.8-.4 1 1 2.6v5.6l1 2.5.5.4.3.7.2.8.5.8.8.7.7.5.6.5.5 1-.5.5.4 1 .1.4 3.5-1.5 3.1-1.9 2.2-2.6.5-3.7-.4-3.9L15 24l-.1-3.3.4-.7 1.2-.3.5-.1-.5-1.4.4-1.6zm-2.4-4.6.6-.2-.2-.2-.3-.1h-.3l-.3.5.2.3zm40.6.2-1.7-.5-1.7.7-2.7 2.3-.9.5 1.6.2 2-.9zm-8 11.8v.2l.2-.2zm-.7.7h.5l.2-.4h-1.4l.5.4zm-5.2 17-.3-1-.5-.6-.5-.4-.8-2-1.3-1.2-1.7-.3-1.5.8-1.2 1.4-.5.8-.2 1-.6 1-.3.4.2.3.3.2.2.4.2.6v.5l1 1.8 2 .4 2.3-.6 1.7-.9.8-.6.4-.5.2-.7zM15.7 45v-.2l-.5-.1-.4.2-.3.7-.4.2-.3.3.2.3.7-.2.8-.5.3-.4zm-1.6-.1h-.4l.2.2h.3zm-2.3.6-.7.4-.3 1 .8.4.6-.4.2-.6-.4-.5zm2.6 2.5v-.3l-.3-.2v.2zm-1.5-.3.2.1h.1v-.1z",
			onClick: n[0] ||= (t) => e.onClick(t),
			onDblclick: n[1] ||= (t) => e.onDblClick(),
			onMouseenter: n[2] ||= (t) => e.onEnter(t),
			onMouseleave: n[3] ||= (t) => e.onLeave(t)
		}, null, 32)], 8, cE)]));
	}
}, uE = {
	xmlns: "http://www.w3.org/2000/svg",
	viewBox: "0 0 43 50"
}, dE = ["stroke"], fE = {
	__name: "Martinique",
	props: {
		config: {
			type: Object,
			required: !0
		},
		onClick: {
			type: Function,
			required: !0
		},
		onDblClick: {
			type: Function,
			required: !0
		},
		onEnter: {
			type: Function,
			required: !0
		},
		onLeave: {
			type: Function,
			required: !0
		}
	},
	setup(e) {
		return (t, n) => (I(), L("svg", uE, [R("g", {
			fill: "#5C68E5",
			stroke: e.config.colorStroke,
			"stroke-width": "0.2%"
		}, [R("path", {
			class: "FR-972 MARTINIQUE",
			d: "m35.1 48 1.4-.1 1.1-.5 1-1.4 1.2-3 1.2-.5v-.7l-.6-1.2-.3-1.7-.6-1.4-1.2-.6.3-.5.1-.3.3-.3.6-.3-.8-1.1-.3-1.2v-1.3l.4-1.3-1.3.7.1-.8-.1-1-.3-.7-.7-.3-1-.3-.3-.6-.2-.7-.2-.5-2-1.2-.8-.8-.6-1.5.6-.3.3-.2.4-.2h.7l-3.3-1.5-.8 1.2-.9-.3-.1-.9 1.2-.6-.8-.8 2.7-1.5-.5-.6-.6-.3-.7-.1-.9.4-.2-2.3.3-1.9.8-.6 1.1 2 2.1-2.2-.2-.6.3-.4.6-.4.6-.6h-2.3l-2.3.6-2 1-1.4 1.2-1.7-3.6-1.2-.3-.5-.7-.2-.9-.4-.8-1.6-1-3.8-1.8-4.4-2.8L9.1 0 5.7.1 1.8 2.3l-.9.8-.6 1.1L0 5.6l.3 1.5.7 1.2 2.8 3 .7 1 .6 1.2.2 1.3-.2.6-.3.7-.2.7.4.7.4.5.3.5.3.5v.7l.8 1.8 1.7 1.7 3.5 2.5.4.4.6 1.2.4.5.6.1 2.1-.1h2.1l1.1-.2 1.5-.5.2 1.7.7 1.4.8 1.1.3.6-.7 1.5-1.4.6-1.5-.5-1.1-1.6-.8.9-2.6 1.2-2.7 2.9.9.5.5.4.1.4-.1.7 2.2 3.1.8.5 1.5-.2 2.4-1 1.5-.3 5.8.8 2.7-.5.6.2-.1 1 1.6.1 1.6-1 1.3-.5 1 1.4-.1 1.5-1 .6-1.1.3-.6 1.1.4 1.5z",
			onClick: n[0] ||= (t) => e.onClick(t),
			onDblclick: n[1] ||= (t) => e.onDblClick(),
			onMouseenter: n[2] ||= (t) => e.onEnter(t),
			onMouseleave: n[3] ||= (t) => e.onLeave(t)
		}, null, 32)], 8, dE)]));
	}
}, pE = {
	xmlns: "http://www.w3.org/2000/svg",
	viewBox: "0 0 40 50"
}, mE = ["stroke"], hE = {
	__name: "Guyane",
	props: {
		config: {
			type: Object,
			required: !0
		},
		onClick: {
			type: Function,
			required: !0
		},
		onDblClick: {
			type: Function,
			required: !0
		},
		onEnter: {
			type: Function,
			required: !0
		},
		onLeave: {
			type: Function,
			required: !0
		}
	},
	setup(e) {
		return (t, n) => (I(), L("svg", pE, [R("g", {
			fill: "#5C68E5",
			stroke: e.config.colorStroke,
			"stroke-width": "0.2%"
		}, [R("path", {
			class: "FR-973 GUYANE",
			d: "m7.8 0 .3.1.3.1h1l.2.1.3.2h.1l.2.1.1.1.2.1.2.1.2.1.2.2.3.1h.1l.1.1h.1l.5.3h.1l.2.1h.1l.1.1h.1l.1.1h.1v.1h.1l.1.1.2.1h.1l.4.2v.2l.1-.1v-.1h1l.2.1h.1l.4.1.1.1h.3l.2-.1-.1-.1h.1v-.1h.2v-.1l.3.1.2.1v.1l.3.1h.1l.2.1.2.1h.1l.1.1h.2v.1h.1v.1h.1v.1h.1l.1.1.1.1h.1l.1.1h.1l.3.2.3-.1h.1l.3.2h.2l.3.2.4.2.1.1h.1v.1l.2.1h.1l.1.1h.1l.1.2v-.1l.1-.1v.1h.1l.1.1v.1l.1.1.1.1h.1l-.1.1h-.1.1l.1.1v-.1l.1.1h.1l.2.2v-.1l.1.1.1.1.1.1v.2h.1l.1.1.1.1v.2h.1v.1l.2.2.1.1h.1l.1.1.1.1.1.1h.2l.1.2.2.3h.1l.1.1h-.1v.1l.1.1.1.1h.1l.2.1.2.3h.1v.1l.1.1.1.1.2.1h.2V9l.1.1.1.1.1.1h.1l.1.1.1.1h.1v.1h.1l.1.1.1.1.1.1h.1v.1h.1v.1h.1l.1.1v.1h.1v.1l.1.1.1.2.1.1.2.2h.3l.1-.1v-.1h-.1v-.1h.2v-.1.1-.1l.1.1.1-.1h.1l.1.1h.1v.1l.2.1.1.1.1.1h-.1v.2l.1.1h.1l.1.1.2.3h.2l.1.1.1.1.1.1v.2h.1v-.1l.1.1h.1v.1h.1l.1.1v.2h.1l.1.1v-.1l-.1-.1.1.1h.1v.2h.1v-.1l.1.1v.1h.1v.1h.1l-.1-.1.2.2h.1l.1.1h.1l.1.1h.1l.1.1h.1v.1h.1v.1h-.1.1l.1.1.1.1v-.1.2h.1v.2h.1-.1l.2.1.2.2h.4l.4-.2v-.1h.3l.1.1h.1v.1h.1l.1.1h.1l.1.1.1.1.1.1h.1l-.1.1h.2v.1l.1.2h.1l-.1-.1h.1v.3-.1.1h.1v.3l.1.1v.4l.1.1v.6l.1.2h.1v.1h.1v.2h-.1v.2h.1v.1l.1.1h.1l.1.2h.3v-.1h.1v.2h-.1l-.1.1v.1l-.1.1-.1.1.1.2v.2l.1.2.1.1v.1l.1.1.1.2h.1v.2l.1.1h.1v.1l.1.1.6-.1-.1.6v.3l-.1.2-.2.3v.2l-.1.5-.2.4-.1.1-.1.1-.3.1-.2.1-.2.1-.3.2-.2.4-.1.1-.1.1v.6l-.2.2-.2.3-.1.2-.2.1-.5.5-.2.1-.2.2-.2.1v.1l.1.3v.2l-.2.1h-.3l-.1.1-.1.1-.2.5v.4l-.1.3-.3.3-.2.1-.3.8v.1h-.1l-.1.1v.1l-.2.4v.1l-.2.2-.2.3-.5.9-.1.2-.3.3v.2l-.1.2-.1.1-.4.5h-.1l-.1-.1-.1.1-.3.2-.2.4v.3h-.2l-.1.1h-.1l-.1.3-.1.1.1.1h-.2v.1l.1.1v.3l.2.1v.2l-.1.2-.2.3v.1l-.1.1v.2l-.2.2-.1.5-.2.1v.4h.1l.1.1h-.1l-.1.2h-.3l-.1.1-.3.5-.4.9v.2l-.1.1.1.1-.2.2-.1.2-.1.2-.1.3-.2.4h-.2l-.1.1v.1l.1.1v.3h.1l.1.1v.3l-.1.1v.1h-.1l-.1.1v.2l.1.1-.1.1-.3.3-.1.2-.1.1-.1.1H25l-.2.1h.1v.2h-.2v.1h-.1l-.1.1v.1l-.1.2v.2l-.1.1-.1.2H24l-.2.1-.1.1h-.1v.1l-.1.1h-.1l-.4.2h-.1v.1h-.1l-.1.1-.1.1h-.1l-.2.1h-.2l-.1.1v.1h-.2l.1.1-.1.1-.2.1v.2l-.1.1-.1.2-.1.2-.1.2h-.3l-.1-.1v.2l-.1.1h-.2l-.4.1-.2-.1h-.1l-.1-.1h-.3l-.1-.1-.1-.1-.2-.3h-.3l-.1-.1-.2.1-.1-.1-.1.1h-.7l-.1-.1-.1-.1-.2-.4-.1-.1-.1-.1h-.2l-.3-.1-.2-.1-.2.1-.4.1-.3.1h-.6l-.2-.1-.3-.5-.2-.1-.1-.1-.2.1h-.2l-.3.2-.3.1h-.3l-.1.1-.3.1h-.5l-.5.1-.2-.1h-.1l-.3-.1-.3-.3-.1-.1-.1-.3v-.1l-.2-.1h-.1l-.1.1-.2.2-.1.2v.1l-.2.1h-.6l-.4.4h-.1l-.1-.2h-.2v.1l-.1.1v.4l-.2.2-.2.1h-.1l-.3.1-.1.2-.2.1h-.1l-.2-.1h-.2L6 47l-.1.1-.1.3v.2l-.1.2-.1.1h-.1l-.1-.1H5l-.1-.2-.1-.3h-.4l-.9.3h-.2l-.3-.1h-.3l-.1-.1-.1-.2-.1-.1-.1-.2-.1-.1h-.5l-.2-.1h-.4l-.2-.1-.3-.4H.5l-.1-.1H.1L0 46v-.1l.1-.1h.2v-.1l-.1-.1.5-.1h.1l.1-.1.1-.1h.2l.2-.2V45l-.1-.2-.1-.3.1-.5v-.2l.2.1.1-.1.3-.3.1-.1v-.1l.1-.1h.1l.1-.2.1-.1.2-.5-.1-.2h.1l.1-.1V42l.1-.3.1-.1.1-.1-.1-.1v-.1l.2-.3.2-.2h.1l.1-.2.1-.4v-.1h.1V40h.2l.1-.2v-.1h.1l.1-.1h-.1l.1-.1.1-.1v-.2h.1v-.6h.2l.1-.1v-.3h-.2V38l.1-.3v-.2l.1-.1.1-.1v-.4H5l-.1-.1h-.1l-.1-.1-.1-.2h.1l.1-.1v-.3l-.1-.2-.1-.2v-.1l.2-.2-.1-.2.1-.1-.1-.2v-.1l-.1-.1h-.1l-.1.1h-.1v-.1l.1-.1v-.1h-.1v-.1h.1l.1-.3.1-.2-.1-.1.1-.1h.2l.1-.1v-.1l.1-.1.1-.1v-.2l.2-.2.2-.2.2-.2H6l.1-.2.1-.1.1-.5.1-.3v-.1l.2-.2.1-.1.1-.2.1-.1-.1-.3.2-.4v-.9l.1-.3v-.1l.1-.1.1-.1v-.1l-.1-.2-.1-.2-.1-.2h-.1l-.2.2h-.2l-.1-.1v-.2l-.2-.1-.2-.3V27l-.1-.3-.2-.4-.3-.5h-.7l-.2-.1v-.2l.1-.2v-.1l-.1-.1-.4-.1-.2-.2-.1-.2-.1-.1v-.1l-.2-.1-.1-.2-.1-.1-.1-.3-.1-.3-.2-.4-.1-.1-.2-.1h-.1l-.1-.1-.1-.1v-.2l.2-.2.1-.2v-.3l.2-.3.1-.1-.1-.1-.1-.1-.2-.1-.2-.1-.3-.1v-.3l.1-.3v-.5l-.1-.3v-.6l-.2-.4-.1-.1-.1-.1V18l-.1-.3-.1-.1V17l-.2-.7.1-.2.3-.2v-.1l.1-.3v-.4l-.1-.1-.2-.3.1-.2v-.8l-.2-.2h-.2l-.1-.1.1-.4v-.2l-.1-.3v-.8l-.1-.4v-.1l.1-.1.1-.2.1-.2.1-.1V10l.1-.3.1-.3.1-.4.2-.2.2-.2.2-.2v-.2l.1-.1.1-.1.1-.2.3-.5.3-.6.4-.3L4 6l.2-.1.2-.1.3-.4.3-.1.2-.1.1-.1v-.4l.1-.2.4-.4.2-.4.5-.5.2-.2.1-.3.1-.4v-.6l.1-.1v-.3l.1-.2.1-.1.1-.2h.1V.4l.1-.1.1-.2V0z",
			onClick: n[0] ||= (t) => e.onClick(t),
			onDblclick: n[1] ||= (t) => e.onDblClick(),
			onMouseenter: n[2] ||= (t) => e.onEnter(t),
			onMouseleave: n[3] ||= (t) => e.onLeave(t)
		}, null, 32)], 8, mE)]));
	}
}, gE = {
	xmlns: "http://www.w3.org/2000/svg",
	viewBox: "0 0 56 50"
}, _E = ["stroke"], vE = {
	__name: "Reunion",
	props: {
		config: {
			type: Object,
			required: !0
		},
		onClick: {
			type: Function,
			required: !0
		},
		onDblClick: {
			type: Function,
			required: !0
		},
		onEnter: {
			type: Function,
			required: !0
		},
		onLeave: {
			type: Function,
			required: !0
		}
	},
	setup(e) {
		return (t, n) => (I(), L("svg", gE, [R("g", {
			fill: "#5C68E5",
			stroke: e.config.colorStroke,
			"stroke-width": "0.2%"
		}, [R("path", {
			class: "FR-974 REUNION",
			d: "m20.4 0-1 .5-1.6-.3-1.7.5-.6.2-3.7 2.8-.6.9-1.3.6-.6.1-.2-.3.1.3h.2v.6l-1-.2.5-.2v-.4l-1 .2-1.6-.5-.5.2-.1.9H6v-.3l.3.1-.2.7-.3-.2-.1.6.1-.6.1-.1h-.3l-.1 1.1-.3.5.5 1.9-.4 2.2-2 1.6-.7.3-1-.2L0 15.2v.6l.6 1-.2 2.4.8 1.2 2 1.6-.1.4 1.6 1.7.1 1.7.8.3.5.7v2l-.6 1.9.5.4.6 2.1 1.6.9.8.8v.4l.9.6.3.9-.2.4.7.7 2.2.3 2.1.7.8.5 1.9 2.3.8.4 1.7.2.5.3.2.7.9.5 1 .1-.4-.1h.4l.1-.3-.1.6h.2l.3.4 1.5-.1 1.9.9 1.3.3 1.1 1 .3-.3 1.5.5 1.3-.5.3.4.8.3.9.8 2.4-.5.8.7 1.2-.7 1 .2.8-.9 2.5.2 1.6-.7 2-.1.5-.5 1.7.2 1.9-1.4.9-1.2.1-.6-.5-2 .4-2-.4-.8-.2-1.8.7-3 .5-1.2.9-1 .1-1.6.9-.2-.3-1.7.2-.5-.7-.7-.1-.8-1.4-.6-1.2-1.1-1.3-.2-.9-1.5-.8-.7-.5-1-1.6-1.8-.6-1 .1-.8-1.3-1.7-.8-.4-.5-.9-.2-3.6-.3-1.3-1.2-1.9L39.1 5l-1.2-.8-1-.4-1.7-.2-2.5-1.4-.9.2-2-.6-.7.4-.8-.1L25.1 1l-1.4.3h-1.4z",
			onClick: n[0] ||= (t) => e.onClick(t),
			onDblclick: n[1] ||= (t) => e.onDblClick(),
			onMouseenter: n[2] ||= (t) => e.onEnter(t),
			onMouseleave: n[3] ||= (t) => e.onLeave(t)
		}, null, 32)], 8, _E)]));
	}
}, yE = {
	xmlns: "http://www.w3.org/2000/svg",
	viewBox: "0 0 38 50"
}, bE = ["stroke"], xE = {
	__name: "Mayotte",
	props: {
		config: {
			type: Object,
			required: !0
		},
		onClick: {
			type: Function,
			required: !0
		},
		onDblClick: {
			type: Function,
			required: !0
		},
		onEnter: {
			type: Function,
			required: !0
		},
		onLeave: {
			type: Function,
			required: !0
		}
	},
	setup(e) {
		return (t, n) => (I(), L("svg", yE, [R("g", {
			fill: "#5C68E5",
			stroke: e.config.colorStroke,
			"stroke-width": "0.2%"
		}, [R("path", {
			class: "FR-976 MAYOTTE",
			d: "M30.8 19.5V19l-.3-.2h-.2v.4l.1.1h.3zl.2.1v.3h.4v.1l.2.1h.2l.2.2h-.1.1l.2.2.2.1v.1l.1.1.2.6.4.4.2.4v.8h.1v.2l.2.1h.1l.2.1h.2l.2.5h.2v-.1L34 23v-1l.1-.1v-.1l.2-.2v-.1h.1v-.1h.9v-.2h.1l.1-.2.2-.2v-.2h-.2v-.4l-.2-.1v-.3l.2-.1v-.3l.2-.1h.1v.2h.1l.1-.1v-.3h-.5V19l.3-.3-.2-.2h-.2v-.1h-.1v-1H35l-.1-.1v-.1l-.1-.1-.1-.1h-.1v-.2h-.1l-.1-.1h-.1v-.3h-.1v-.1l-.2-.1v.1h-.1v.2h-.1v.1l-.2.1v.2l-.3.3-.2.2-.1.1-.2.2-.3.2-.7.7-.4.6.1.1h.2v-.1h.2l.2-.1v-.3H32v-.2h.1v.3h.1v-.1h.1v-.3h.4v.4l-.3.2v.2l-.2.2-.3.3v.3h-.3v-.2h-.2l-.2-.1.1-.1h.3v-.2.1H31h.2l.1-.3h-.1zM16.6 48l.2-.1.2-.1.1-.2h.1l.1-.3.2-.3v-.2h.2v-.2l.2-.2V46h-.1v-.3l-.2-.1v-.3h.1v-.1h.1l.2-.1v-.2h.1l.1-.1h1.1v.1h.1v.1l.2.1v.4h.1l.2.3v.8l.1.2v.1l.1.1v.3h.5V47h-.1l-.1-.1v-.4l.1-.1v-.2h.1l.1-.2h.3l.3-.1h.1l.2.1h.2l.2.2h.2v.1h.2V46l.1-.1.2-.1h.1v-.2l.1-.1h.1v-.1h.3V45h.1l.1-.2h.1l.2-.2-.1-.1h-.8v.2h-.2l-.4-.2-.1-.1-.1-.1-.2-.3h-.6l-.2-.2-.2-.1-.2-.2h-.1l-.2-.1-.1-.2-.1-.4v-.4l-.1-.1v-.2l-.2-.1-.1-.2h-.2l-.1-.1v-.2h-.1l-.2-.3V41l.2-.3v-.2h.1l.1-.2h.4l.2.1h.2l.2.1V40l-.3-.5-.1-.1v-.5l.2-.2.1-.3.1-.1v-.1l.1-.1h.3l.1-.1h.2v-.3h-.1v-.4l.2-.1.1-.2h1.1v.1h.1v.1l.2.1.3.1h.7l.4.2v-.1l-.4-.1h-.2v-.2h-.1V37h-.2v-.2l-.2-.1H23l-.1-1.4.2-.8-.1-.3h.1l.2-.1.3-.2h.1l.1-.1h.3v-.1h.3v-.1h.3v-.3h.1l.2-.2.2-.2h.3v-.3h-.2V32h.2v-.3h.1l.2-.2.2-.2V31h-.4l-.4.1-.2.1-.2-.2-.2-.3v-.1l.1-.5h.1v-.2l-.1-.1h-.2l-.2.1-.3-.2-.1-.1h-.1l-.3-.2V29l-.1-.2v-.1l-.1-.1H23v.1h-.2l-.1-.1v-.4l-.1-.1h-.1v-.6l.1-.1h-.1v-.1h-.1v-.2l-.2-.1v-.2h-.1v-.3l.1-.2h.1v-.1l.1-.1V26h.1l.2-.2v-.2h.3v-.1h-.6v-.4l.1-.4h.2v-.2h.1v-.1l.3-.2h.4l.1-.1v-.4h.1v-.3l.2-.2v-.4h.1l.1-.1.2-.2h.1v-.2l.1-.1.2-.1.3-.3h.2v-.2h.1v-.8h.1l.2-.1v-.1l.2-.1.2-.2.3-.3.3-.2.1-.1h.4v-.2h.2l.1-.1h.1v.1l.1.1h.3v-.1h.1V19h-.5l-.1-.1v-.2h-.1v-.2h.1v-.2h-.3v-.1l-.3-.1v.1l-.2-.1v-.4h.1v-.1h.1l.1-.1v-.2h.1v-.1l.1-.2v-.3h.3v.7h-.1v.2H27v.3h.5l.1-.3.1-.5h.1v-.4l.5-.1v-.1l-.1-.3H28l-.2-.4v-.2l.1-.1v-.3l-.1-.1h-.5V15H27v-.1l-.2-.1h.1v-.3l-.3-.1V14h-.2l-.5.1-.2-.1v-.3H25v-.2h-.1v-.2h-.1v-.2l.2-.1.1-.5H25v.3h-.2v.1h-.1v-.1h-.4v-.3H24v-.2h-.4l-.1-.1v-.1l-.2.1v.1h-.9l-.1-.1v-.1H22V12h-.7v-.1H21l-.1.1v.1h-.5l-.6-.2-.1-.2h-.1l-.2-.1v-.1l-.1-.3-.2-.2-.2-.3-.2.1v.1h-.1v.2h.1l.3.1v.4h-.2v-.2h-.3v.1l.1.2h.1l-.4.3v.2l-.4.5-.5.2-.5-.1v-.6h-.1V12h-2.1l.2-.3-.2-.2-.2-.2-.2-.3v-.6l-.2-.1-.1-.2h-.1l-.1-.2h-.2l-.1-.2v-.8l.4-.2h.2V9h.2v-.5l-.2.1h-.3l-.2-.1-.2-.1h-.2L13 8l-.2-.1-.2-.2h-.3l-.1-.1v-.1H12v-.3l-.1-.1v-.3h.3v-.1l-.1-.1-.1-.2h-.4v-.1l-.1-.2V6h-.8v-.2h-.1v-.2h.1l.1-.1.1-.2.1-.1h-.3v-.1h-.4l-.1-.1H10v-.2h-.5v-.1h-.4L9 4.5v-.4h.1V4h.2l.1-.1h.1v-.2h.3l.1-.1h.2v-.1h.3v-.1h.2l.1-.1h.4l.1-.1h-.3v-.1h-.2v-.3l.1-.1v-.4h.2l.1-.1v-.1h.2V2h-.1v-.1H11v.3h-.1l-.1.1v.1h-.1v.1h-.1v.1h-.2l-.1.1v.1H10V3h-.4l-.1-.1h-.1V3h.1v.6h-.2v.1h-.1v.1H9V4h-.4v.5h-.1v.1h-.2l-.1.1v.8l.1.1v.1l-.1.1-.1.1-.2.1h-.1l-.2.1-.2.1h-.6L6.6 6h-.3v-.1h-.1v.2h.1l.2.1h.2l.1.1.1.1H7v.9h-.1v.1h-.1l-.1.2v.1h-.2v-.1h-.2v.1h.1v.1h.1V8h-.1l-.1.1v.1h-.1v.1H6l-.1.1h-.2v.1h-.1l-.1.1-.3-.1h-.6v-.1h-.4v.2H4v.2l-.2.1h.3v.7H4v.3l-.2.1v.2l-.1.1-.2.3-.2.1v.1l-.1.1v.1l-.2.2h-.3v.2h1.4l.3.1h.2l.1.1v.1l.1.1v.1l.2.2-.1.1-.2.1v.3l-.1.3-.1.1h-.1l-.2.2-.2.2-.4.1-.2.1v.2l-.3.2-.1.2v.5l.1.1.1.1h.1l.1.1.1.2H4v.2l.1.1v.2h.3l.1-.1.1-.2v-.1l.2-.1h.7l.1.1.1.1h.1v.3H6v.3h.2v.1l.4.2h.1v.1h.1v.1l.2.2v.1h.1v.1h.1v.1h.2v.1l.3.1.3-.3.7.2.2.1.1.1h.1v.1l.2.2.1.2h.2l.1-.1h.1v-.2h.2v-.2l.1-.1V17l.2-.2h.2v.2h.2v.1l-.1.1v.2h.1v.2l.1.2v.2h-.2v.9h-.2v.1h-.1l-.1.1v.1H10l-.1.1h-.2v.3h.1l.1.1.1.2v.3h.1v.2l1.2.1v-.1l.2.1v.3l-.7.2-.2.1v.4h-.1v.7l.4.4v.5h.1v.2h.1v.8h-.2v.7l-.1.3-.1.3-.2.5v.1l.3.2h.7l.1.1h.4l.1.1h.1l.2.2h.2v.4l-.1.2h-1l-.3.2-.3-.2h-.2v.2l-.3.4-.2.2-.2.2h-.5v.2l.1.1h.2v.1l.1.1h.1v.1h.1v.1l.1.1.1.1v.2h.1v.1h.2v.1h.2v.1l.1.1v.1h.7v.1h.2l.2.1v.1l.2.2v.3h.2v.3l.1.1v.1h.1v.1l.1.1v.1l.1.2h.2v.1l.2.2v.1l.2.1v.2h.4l.2.1v.1h.2l.3.7h.4l.1.1h.2v.4l.2.5v.6h.3l.1.1v.4l.1.2h.2l.1.2.1.1.1.1v.2l.1.1v.3l.1.2.1.2v.1l.1.2v.6l-.3.9-.4.4-1 .3h-.6l-.6-.4-.3-.2v-.2l-.2-.1h-.3l-.4-.2-.2-.1-.1-.1H12V38h-.4l-.2-.1h-.1v-.2H11l-.1-.2h-.1l-.2-.4v-1.3l.1-.1v-.5l-.3-.3-.1-.1v-.2h-.6l-.1-.1H7.4l-.2.1h-.5v.4H7l.1.1h.1l.3.5.2.5v.3l.2.1v.5l.2.1v.3l.2.2.1.1h.3l.2.3v.1l.1.1v.2l-.2.1v.2h.4l.2-.2.2-.1h.2v-.2h.6l.2.2.1.2.2.2v.6l-.1.1h-.1v.6l-.1.1v.4l-.1.2-.1.2-.2.2-.2.2-.1.2-.2.2-.1.2h-.3l-.2.1-.2.1-.3.2h-.1l-.1.1-.1.1H8v.4h-.1v.1H8l.2-.1h.3l.4.3.6.4.5-.3h.4l.2-.3.2-.2.1-.2v-.1l.7.3v1.4l-.1.1-.2.1v.8l.2.4-.2.4-.2.2v.4h.2l.1.2.1.2v.1h.1V47l.3-.8V46l.4-.4.2-.1h.2l.2-.1.3.1.3.1h.1v.3l.2.4-.2.5.1.2v.4l.3-.1h.2l.1-.1h.2V47l.1-.2h.4l.4.1v.3l.2.3v.3l.2.1h.3zM1 0 .9.3v.1L.8.5H.7L.5.8H.3v.1H0V1l.1.2v.2h.4l.1-.1h.2l.2.1.2.2.2.1.1.2v.4l-.1.1h-.2v.1l-.1.2v.2l.1-.2v-.2h.6l.2-.2V2l.2-.1v-.1h.2l.3-.2H3v-.3l-.1-.1h-.1L2.4 1V.7H2V.5L1.7.3h-.2V.2h-.2z",
			onClick: n[0] ||= (t) => e.onClick(t),
			onDblclick: n[1] ||= (t) => e.onDblClick(),
			onMouseenter: n[2] ||= (t) => e.onEnter(t),
			onMouseleave: n[3] ||= (t) => e.onLeave(t)
		}, null, 32)], 8, bE)]));
	}
}, SE = ["viewBox"], CE = ["stroke"], wE = {
	France: eE,
	FranceReg: rE,
	FranceAca: oE,
	Guadeloupe: lE,
	Martinique: fE,
	Guyane: hE,
	Reunion: vE,
	Mayotte: xE,
	World: {
		__name: "World",
		props: {
			config: {
				type: Object,
				required: !0
			},
			onClick: {
				type: Function,
				required: !0
			},
			onDblClick: {
				type: Function,
				required: !0
			},
			onEnter: {
				type: Function,
				required: !0
			},
			onLeave: {
				type: Function,
				required: !0
			}
		},
		setup(e) {
			return (t, n) => (I(), L("svg", {
				xmlns: "http://www.w3.org/2000/svg",
				viewBox: e.config.viewBox
			}, [R("g", {
				fill: "#5C68E5",
				stroke: e.config.colorStroke,
				"stroke-width": ".1%"
			}, [
				R("path", {
					id: "United Arab Emirates",
					class: "AE",
					style: k({ display: e.config.displayPath.AE }),
					d: "m619.9 393.7.5-.1v.8l2.3-.5 2.3.1 1.7.1 1.9-2 2.1-2 1.8-2 .5 1.1.4 2.4H632l-.3 2 .5.5-1.2.6v1.2l-.9 1.3v1.2l-.6.6-8.4-1.5-1.1-3z",
					onClick: n[0] ||= (t) => e.onClick(t),
					onDblclick: n[1] ||= (t) => e.onDblClick(),
					onMouseenter: n[2] ||= (t) => e.onEnter(t),
					onMouseleave: n[3] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Afghanistan",
					class: "AF",
					style: k({ display: e.config.displayPath.AF }),
					d: "m646.9 356.9 2.8 1.3 2.1-.5.6-1.5 2.3-.5 1.5-1 .6-2.9 2.4-.7.4-1.2 1.3 1h2.4l2.1.8.9.4 2-1 1 .6.9-1.6h1.6l.5-.5.3-1.4 1.2-1.2 1.5.8-.3 1 .9.2-.3 3 1 1.1 1-.7 1.3-.3 1.8-1.6 1.9.3h2.9l.5 1-1.6.3-1.5.7-3.2.4-3 .7-1.6 1.5.6 1.5.3 1.7-1.4 1.4.2 1.3-.8 1.3-2.7-.2 1.1 2.3-1.7.8-1.2 2 .1 2-1 1-1.1-.4-2.2.4-.3 1h-2l-1.6 1.8-.1 2.7-3.7 1.4-2-.3-.5.7-1.7-.4-2.8.5-4.7-1.7 2.6-2.9-.2-2.1-2.2-.6-.2-2-1-2.7 1.3-1.8-1.2-.5.7-2.5z",
					onClick: n[4] ||= (t) => e.onClick(t),
					onDblclick: n[5] ||= (t) => e.onDblClick(),
					onMouseenter: n[6] ||= (t) => e.onEnter(t),
					onMouseleave: n[7] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Albania",
					class: "AL",
					style: k({ display: e.config.displayPath.AL }),
					d: "m533 334.7-.4 1.2.4 1.6 1.2 1v.9l-1 .5-.2 1.2-1.2 1.8-.5-.3v-.8l-1.6-1.2-.3-1.7.3-2.6.3-1.1-.4-.6-.2-1.2 1.2-1.9.2.7.7-.3.6 1 .7.4z",
					onClick: n[8] ||= (t) => e.onClick(t),
					onDblclick: n[9] ||= (t) => e.onDblClick(),
					onMouseenter: n[10] ||= (t) => e.onEnter(t),
					onMouseleave: n[11] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Armenia",
					class: "AM",
					style: k({ display: e.config.displayPath.AM }),
					d: "m597.5 337.5 3.9-.6.5 1 1.1.6-.6 1 1.5 1.2-.8 1.2 1.2 1 1.3.6v2.5h-1l-1.1-2v-.6h-1.2l-.9-1-.5.2-1.2-1.1-2-1 .2-1.7z",
					onClick: n[12] ||= (t) => e.onClick(t),
					onDblclick: n[13] ||= (t) => e.onDblClick(),
					onMouseenter: n[14] ||= (t) => e.onEnter(t),
					onMouseleave: n[15] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Angola",
					class: "AO",
					style: k({ display: e.config.displayPath.AO }),
					d: "m521 479.8.7 2 .8 1.7.7 1 1 1.4 1.9-.2 1-.4 1.5.4.4-.7.7-1.6 1.7-.1.2-.5h1.4l-.2 1h3.4v1.7l.6 1.1-.4 1.7.2 1.7 1 1-.2 3.5.7-.3h1.2l1.7-.4 1.3.2.3.9-.3 1.4.5 1.3-.4 1 .2 1h-5.8l-.2 9.2 2 2.4 1.7 1.8-5.1 1.2-6.8-.4-2-1.4-11.3.1-.4.2-1.7-1.3h-1.8l-1.7.4-1.3.6-.3-1.9.4-2.5 1-2.7.1-1.2 1-2.6.6-1.2 1.6-1.8.9-1.3.3-2.1-.2-1.6-.8-1-.8-1.7-.6-1.7.1-.6.9-1.1-.9-2.8-.6-1.8-1.4-1.8.3-.6 1.2-.3h.8l1-.3zm-10.9-.6-.7.3-.7-2 1-1.3 1-.4 1 1-1 .5-.5.7z",
					onClick: n[16] ||= (t) => e.onClick(t),
					onDblclick: n[17] ||= (t) => e.onDblClick(),
					onMouseenter: n[18] ||= (t) => e.onEnter(t),
					onMouseleave: n[19] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Argentina",
					class: "AR",
					style: k({ display: e.config.displayPath.AR }),
					d: "m291.6 649-2.7.2-1.4-1.8-1.7-.1h-3v-10.6l1.1 2.2 1.4 3.5 3.6 2.9 4 1.2zm1.5-122.5 1.7 2.2 1-2.5 3.2.1.5.7 5.1 5 2.3.4 3.5 2.2 2.8 1.2.4 1.4-2.7 4.7 2.8.9 3.2.5 2.2-.5 2.5-2.4.5-2.8 1.4-.6 1.4 1.8v2.5l-2.4 1.7-2 1.3-3 3.1-3.8 4.4-.7 2.6-.8 3.3v3.3l-.5.8-.3 2.1-.2 1.8 3.6 3-.4 2.3 1.8 1.5-.2 1.7-2.7 4.5-4.1 2-5.6.7-3.1-.4.6 2.2-.6 2.7.5 1.8-1.7 1.3-2.8.5-2.7-1.3-1.1 1 .4 3.7 1.9 1.1 1.5-1.2.9 2-2.6 1.2-2.3 2.3-.4 4-.6 2h-2.7l-2.2 2.1-.8 3 2.8 3 2.6.8-1 3.8-3.2 2.3-1.8 5-2.6 1.8-1.2 2 1 4.7 1.8 2.6-1.2-.2-2.6-.7-6.7-.6-1.2-2.7V628l-1.8.3-1-1.6-.3-4.6 2.2-1.9.9-2.7-.3-2 1.4-3.6 1-5.4-.2-2.3 1.2-.7-.3-1.5-1.3-.8 1-1.6-1.4-1.5-.6-4.4 1.1-.8-.5-4.5.7-3.7.8-3.3 1.6-1.3-.8-3.4v-3.2l2.1-2.3v-2.9l1.5-3.3v-3l-.7-.7-1.3-5.7 1.8-3.3-.3-3.1 1-3 1.8-2.9 2-2-.8-1.2.6-1-.1-5.1 3-1.5 1-3.2-.4-.7 2.4-2.8z",
					onClick: n[20] ||= (t) => e.onClick(t),
					onDblclick: n[21] ||= (t) => e.onDblClick(),
					onMouseenter: n[22] ||= (t) => e.onEnter(t),
					onMouseleave: n[23] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Austria",
					class: "AT",
					style: k({ display: e.config.displayPath.AT }),
					d: "m522.9 309.9-.2 1.7H521l.5.9-1 2.6-.5.7-2.4.1-1.4 1-2.3-.4-4-1-.7-1.5-2.7.8-.4.7-1.7-.6H503l-1.3-.8.5-1-.2-.8.9-.2 1.4 1.2.4-1.1 2.5.2 2-.8 1.3.1 1 .9.2-.7-.4-2.7 1-.6 1-2 2 1.4 1.6-1.7 1-.3 2.2 1.3 1.3-.2 1.3.8-.2.5z",
					onClick: n[24] ||= (t) => e.onClick(t),
					onDblclick: n[25] ||= (t) => e.onDblClick(),
					onMouseenter: n[26] ||= (t) => e.onEnter(t),
					onMouseleave: n[27] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Australia",
					class: "AU",
					style: k({ display: e.config.displayPath.AU }),
					d: "m883 588.2 2.6 1.2 1.6-.5 2.2-.7 1.6.3.2 4.4-1 1.3-.2 3-1-1-2 2.7-.5-.2-1.7-.2-1.8-3.2-.4-2.5-1.6-3.3.1-1.7zm-5.2-86.1 1 2.3 1.8-1.1 1 1.2 1.3 1.1-.3 1.3.6 2.5.4 1.4.7.4.8 2.5-.3 1.5 1 2 3 1.5 2 1.4 1.8 1.3-.4.7 1.6 2 1.1 3.2 1.2-.7 1.1 1.3.7-.4.5 3.2 2 1.8 1.3 1.2 2.1 2.5.8 2.5.1 1.8-.2 1.9 1.4 2.7-.2 2.8-.5 1.5-.8 2.8.1 1.9-.5 2.3-1.3 3-2 1.7-1 2.6-1 1.6-.9 3-1 1.7-.7 2.5-.4 2.4.1 1.2-1.6 1.2-3.1.1-2.6 1.5-1.3 1.3-1.7 1.6-2.3-1.6-1.7-.6.4-1.9-1.5.7-2.5 2.6-2.4-1-1.6-.6-1.6-.2-2.7-1-1.8-2.2-.5-2.7-.7-1.7-1.4-1.4-2.7-.4 1-1.7-.7-2.5-1.4 2.3-2.5.7 1.5-2 .4-1.9 1-1.6-.1-2.5-2.3 2.9-1.8 1.1-1 2.7-2.2-1.4v-1.8l-1.7-2.4-1.5-1.3.6-.7-3.6-2-2-.1-2.7-1.6-5 .3-3.7 1.2-3.1 1-2.7-.2-3 1.7-2.4.8-.6 1.8-1 1.3-2.4.1-1.7.3-2.5-.6-2 .4-2 .1-1.6 1.8-.9-.1-1.4 1-1.3 1-2-.1h-2l-3-2.2-1.4-.6v-2l1.4-.4.5-.8v-1.2l.2-2.3-.3-2-1.4-3.2-.5-1.9.1-1.8-1.1-2v-1l-1.3-1.3-.4-2.4-1.6-2.5-.4-1.4 1.3 1.4-1-2.9 1.4 1 .8 1.1v-1.6l-1.4-2.4-.3-1-.6-.9.3-1.8.6-.7.3-1.5-.3-1.8 1.2-2.2.2 2.3 1.2-2 2.3-1 1.3-1.3 2.2-1.1 1.2-.3.8.4 2.2-1.1 1.7-.3.4-.7.8-.3 1.5.1 3-.9 1.5-1.3.7-1.5 1.7-1.5.1-1.2v-1.6l2-2.5 1.2 2.5 1.2-.5-1-1.4.9-1.4 1.2.6.4-2.2 1.5-1.4.7-1.2 1.4-.5v-.8l1.2.4.1-.7 1.2-.4 1.4-.4 2 1.3 1.6 1.7h1.8l1.7.3-.5-1.6 1.3-2.3 1.3-.7-.5-.8 1.2-1.6 1.7-1 1.5.3 2.3-.5V496l-2-1 1.4-.4 1.9.7 1.5 1.2 2.3.7.8-.3 1.8.9 1.6-.8 1 .2.7-.5 1.3 1.4-.7 1.5-1.1 1.2h-1l.4 1.2-.9 1.5-1 1.4.2.8 2.3 1.6 2.1.9 1.5 1 2 1.7h.8l1.5.8.4.9 2.7 1 1.8-1 .6-1.6.5-1.3.4-1.6.8-2.3-.3-1.4.2-.8-.4-1.7.4-2.1.5-.6-.4-1 .7-1.5.5-1.5v-.8l1.1-1 .8 1.3.2 1.8.7.3.1 1.2 1 1.5.3 1.6z",
					onClick: n[28] ||= (t) => e.onClick(t),
					onDblclick: n[29] ||= (t) => e.onDblClick(),
					onMouseenter: n[30] ||= (t) => e.onEnter(t),
					onMouseleave: n[31] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Azerbaijan",
					class: "AZ",
					style: k({ display: e.config.displayPath.AZ }),
					d: "m601.4 342.5.9 1h1.2v.5l1.1 2-1.9-.4-1.4-1.7-.4-1.4.5.1zm6.7-5.5 1.2.3.5-1 1.7-1.5 1.4 2 1.5 2.6 1.3.2.8 1-2.3.3-.5 2.8-.4 1.2-1 .9v1.8l-.7.1-1.7-1.8 1-1.8-.9-1-1 .2-3.4 2.7v-2.5l-1.3-.6-1.2-1 .8-1.2-1.5-1.2.6-1-1-.6-.7-1 .7-.6 2.1 1 1.5.3.4-.4-1.4-2 .8-.6.8.2z",
					onClick: n[32] ||= (t) => e.onClick(t),
					onDblclick: n[33] ||= (t) => e.onDblClick(),
					onMouseenter: n[34] ||= (t) => e.onEnter(t),
					onMouseleave: n[35] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Bosnia and Herzegovina",
					class: "BA",
					style: k({ display: e.config.displayPath.BA }),
					d: "M528.5 323.1h1l-.6 1.7 1.3 1.5-.4 1.8-.7.2-.5.4-.9.9-.4 2-2.5-1.4-1-1.6-1.1-.8-1.3-1.5-.6-1.2-1.4-1.8.6-1.7 1 1 .6-.9h1.3l2.4.6h2z",
					onClick: n[36] ||= (t) => e.onClick(t),
					onDblclick: n[37] ||= (t) => e.onDblClick(),
					onMouseenter: n[38] ||= (t) => e.onEnter(t),
					onMouseleave: n[39] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Bangladesh",
					class: "BD",
					style: k({ display: e.config.displayPath.BD }),
					d: "M735 400.4v2.2l-1-.5.2 2.4-.8-1.6-.1-1.5-.6-1.4-1.1-1.8-2.6-.1.3 1.3-1 1.6-1.1-.6-.4.6-.8-.4-1.1-.2-.4-2.5-1-2.3.5-1.8-1.8-.9.6-1 1.8-1.2-2-1.7 1-2 2.2 1.3 1.3.1.3 2.2 2.6.4h2.6l1.7.5-1.3 2.6-1.3.1-.9 1.8 1.6 1.6.4-2h.8z",
					onClick: n[40] ||= (t) => e.onClick(t),
					onDblclick: n[41] ||= (t) => e.onDblClick(),
					onMouseenter: n[42] ||= (t) => e.onEnter(t),
					onMouseleave: n[43] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Belgium",
					class: "BE",
					style: k({ display: e.config.displayPath.BE }),
					d: "m484.6 296 2 .3 2.6-1 1.8 2 1.5 1-.3 3-.7.1-.3 2.5-2.5-2-1.4.4-2-2.1-1.3-1.8h-1.3l-.4-1.6z",
					onClick: n[44] ||= (t) => e.onClick(t),
					onDblclick: n[45] ||= (t) => e.onDblClick(),
					onMouseenter: n[46] ||= (t) => e.onEnter(t),
					onMouseleave: n[47] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Burkina Faso",
					class: "BF",
					style: k({ display: e.config.displayPath.BF }),
					d: "m467.3 436.4-1.9-.7h-1.3l-1 .8-1.2-.6-.5-1-1.3-.6-.2-1.6.8-1.2v-1l2.1-2.3.4-2 .8-.7 1.4.4 1.2-.6.3-.7 2.2-1.3.5-1 2.7-1.1 1.5-.4.7.5h1.8l-.2 1.4.4 1.3 1.5 1.9.1 1.4 3.3.6-.1 2-.6.8-1.4.3-.6 1.2-1 .4-2.4-.1-1.3-.2-.9.4-1.2-.2-4.9.2v1.6z",
					onClick: n[48] ||= (t) => e.onClick(t),
					onDblclick: n[49] ||= (t) => e.onDblClick(),
					onMouseenter: n[50] ||= (t) => e.onEnter(t),
					onMouseleave: n[51] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Bulgaria",
					class: "BG",
					style: k({ display: e.config.displayPath.BG }),
					d: "m538.8 325.6.8 1.6 1-.3 2.2.6 4.2.2 1.3-1 3.3-1 2 1.5 1.7.4-1.4 1.6-1 2.7.9 2.2-2.5-.5-2.8 1.2v1.8l-2.6.4-2-1.3-2.2 1-2-.1-.3-2.5-1.4-1.2.5-.5-.3-.5.4-1.2 1.1-1.2-1.4-1.6-.2-1.5z",
					onClick: n[52] ||= (t) => e.onClick(t),
					onDblclick: n[53] ||= (t) => e.onDblClick(),
					onMouseenter: n[54] ||= (t) => e.onEnter(t),
					onMouseleave: n[55] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Burundi",
					class: "BI",
					style: k({ display: e.config.displayPath.BI }),
					d: "m557.5 476-.2-3.4-.7-1.3 1.7.2.9-1.6 1.5.2.1 1.1.7.6v1l-.7.5-1.1 1.5-1 1z",
					onClick: n[56] ||= (t) => e.onClick(t),
					onDblclick: n[57] ||= (t) => e.onDblClick(),
					onMouseenter: n[58] ||= (t) => e.onEnter(t),
					onMouseleave: n[59] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Benin",
					class: "BJ",
					style: k({ display: e.config.displayPath.BJ }),
					d: "m482.8 446-2.3.3-.7-2 .1-6.4-.5-.6-.1-1.4-1-1-.9-.8.4-1.5 1-.4.5-1.2 1.4-.3.6-.8 1-.8h1l2 1.6v1l.6 1.6-.5 1.1.2.8-1.3 1.8-.9.8-.5 1.8v1.8z",
					onClick: n[60] ||= (t) => e.onClick(t),
					onDblclick: n[61] ||= (t) => e.onDblClick(),
					onMouseenter: n[62] ||= (t) => e.onEnter(t),
					onMouseleave: n[63] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Brunei Darussalam",
					class: "BN",
					style: k({ display: e.config.displayPath.BN }),
					d: "m795.5 450.8 1-1 2.5-1.6-.2 1.4-.1 1.8-1.4-.1-.6 1z",
					onClick: n[64] ||= (t) => e.onClick(t),
					onDblclick: n[65] ||= (t) => e.onDblClick(),
					onMouseenter: n[66] ||= (t) => e.onEnter(t),
					onMouseleave: n[67] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Bolivia",
					class: "BO",
					style: k({ display: e.config.displayPath.BO }),
					d: "m299 526.4-3.2-.2-1 2.4-1.7-2.1-3.7-.8-2.3 2.8-2 .4-1.1-4.2-1.5-3.3.9-2.9-1.5-1.2-.4-2.2-1.4-2 1.8-3.1-1.2-2.4.6-1-.5-1 1.1-1.5v-2.5l.2-2 .6-1-2.4-4.5 2 .2h1.5l.7-.9 2.4-1.1 1.5-1.1 3.7-.5-.3 2.1.3 1.1-.2 2 3 2.5 3.2.4 1 1.1 2 .6 1.1.8h1.8l1.6.8.1 1.7.6.8v1.3h-.8l1 3.4 5.4.1-.4 1.7.3 1.1 1.6.9.6 1.8-.5 2.3-.7 1.3.2 1.7-.8.6v-1l-2.7-1.4h-2.6l-4.9.8-1.3 2.6-.1 1.6-1.1 3.6z",
					onClick: n[68] ||= (t) => e.onClick(t),
					onDblclick: n[69] ||= (t) => e.onDblClick(),
					onMouseenter: n[70] ||= (t) => e.onEnter(t),
					onMouseleave: n[71] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Brazil",
					class: "BR",
					style: k({ display: e.config.displayPath.BR }),
					d: "m313.7 551.8 3.7-4.4 3.2-3 1.9-1.3 2.3-1.8v-2.5l-1.3-1.7-1.4.5.5-1.7.4-1.9v-1.6l-1-.6-1 .5-1-.1-.4-1.2-.3-2.8-.5-.9-1.9-.8-1.1.6-3-.6.2-4-.8-1.7.8-.6-.2-1.7.7-1.3.5-2.3-.6-1.8-1.6-.9-.3-1.1.4-1.7-5.3-.1-1.1-3.4h.8v-1.3l-.6-.8V502l-1.7-.8h-1.8l-1.1-.8-2-.6-1-1-3.2-.5-3-2.6.2-1.9-.3-1 .3-2.2-3.7.5-1.5 1-2.4 1.2-.7.9h-1.4l-2.1-.2-1.6.5-1.3-.4.2-4.3-2.3 1.7H273l-1.1-1.6-1.9-.1.6-1.2-1.5-1.8-1.2-2.5.7-.5v-1.2l1.7-.8-.2-1.5.7-1 .2-1.3 3.2-2 2.3-.4.4-.5 2.5.2 1.2-7.7.1-1.2-.4-1.6-1.3-1v-2l1.6-.5.6.3v-1l-1.6-.3v-1.8h5.5l.9-.9.8.9.5 1.6.5-.3 1.6 1.5 2.2-.2.5-.9 2-.6 1.3-.5.3-1.1 2-.9-.2-.5-2.3-.3-.4-1.7v-1.9l-1.2-.7.5-.3 2.1.4 2.3.7.8-.7 2-.4 3.1-1 1-1.1-.3-.8 1.4-.1.7.6-.4 1.2 1 .4.6 1.4-.8 1-.4 2.3.7 1.4.2 1.3 1.7 1.3 1.4.2.3-.6 1-.1 1.2-.5.9-.7 1.5.2.7-.1 1.6.2.2-.6-.5-.5.3-.8 1.1.2 1.4-.2 1.6.5 1.2.6.9-.7h.6l.4.9 1.3-.2 1-1 1-2.1 1.6-2.6 1-.1.7 1.5 1.5 4.9 1.5.4.1 2-2.1 2.3.9.8 5 .4v2.8l2.2-1.8 3.5 1 4.6 1.7 1.4 1.6-.4 1.6 3.2-.9 5.5 1.5 4.2-.1 4.1 2.3 3.6 3.1 2.1.8 2.4.1 1 1 1 3.5.5 1.7-1.1 4.7-1.5 1.8-4 4-1.7 3.1-2 2.5h-.8l-.8 2.2.2 5.4-.7 4.5-.4 1.9-.8 1.1-.5 4-2.9 3.9-.4 3-2.3 1.4-.7 1.8h-3l-4.4 1.1-2 1.4-3.2.9-3.2 2.4-2.4 3-.4 2.4.4 1.7-.5 3.2-.6 1.6-2 1.7-3 5.7-2.6 2.6-1.9 1.5-1.2 3.2-1.9 1.9-.8-2 1.3-1.5-1.7-2.2-2.2-1.9-2.8-2h-1l-2.9-2.4z",
					onClick: n[72] ||= (t) => e.onClick(t),
					onDblclick: n[73] ||= (t) => e.onDblClick(),
					onMouseenter: n[74] ||= (t) => e.onEnter(t),
					onMouseleave: n[75] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Bahamas",
					class: "BS",
					style: k({ display: e.config.displayPath.BS }),
					d: "m257.9 395.2-.7.2-.7-1.8-1-.9.5-2 .9.2 1 2.5zm-.8-8.7-3.1.5-.2-1.1 1.3-.3 1.9.1zm2.3 0-.5 2.2-.5-.4v-1.6l-1.2-1.3v-.3z",
					onClick: n[76] ||= (t) => e.onClick(t),
					onDblclick: n[77] ||= (t) => e.onDblClick(),
					onMouseenter: n[78] ||= (t) => e.onEnter(t),
					onMouseleave: n[79] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Bhutan",
					class: "BT",
					style: k({ display: e.config.displayPath.BT }),
					d: "m732.4 382.8 1.1 1-.2 2H731l-2.4-.2-1.7.5-2.6-1.2v-.6l1.8-2.4 1.5-.8 2 .8h1.5z",
					onClick: n[80] ||= (t) => e.onClick(t),
					onDblclick: n[81] ||= (t) => e.onDblClick(),
					onMouseenter: n[82] ||= (t) => e.onEnter(t),
					onMouseleave: n[83] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Botswana",
					class: "BW",
					style: k({ display: e.config.displayPath.BW }),
					d: "m547.2 516 .5.5 1 1.7 3 3.2 1.3.4v1l.8 1.9 2.2.5 1.8 1.3-4 2.2-2.5 2.3-1 2-.8 1.2-1.5.2-.5 1.5-.3 1-1.8.7-2.3-.2-1.3-.8-1.2-.4-1.4.7-.6 1.5-1.4 1-1.4 1.3-2 .3-.6-1 .3-2-1.7-2.9-.8-.5v-8.8l2.8-.1V515h2.2l4.3-1.1 1 1.2 1.9-1.2h.8l1.6-.6.5.2z",
					onClick: n[84] ||= (t) => e.onClick(t),
					onDblclick: n[85] ||= (t) => e.onDblClick(),
					onMouseenter: n[86] ||= (t) => e.onEnter(t),
					onMouseleave: n[87] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Belarus",
					class: "BY",
					style: k({ display: e.config.displayPath.BY }),
					d: "m541.1 284 2.7.1 3-1.8.7-2.7 2.3-1.6-.3-2.2 1.7-.8 3-2 3 1.3.4 1.2 1.5-.6 2.7 1.2.3 2.3-.6 1.4 1.8 3.1 1 .9v.8l1.8.9.8 1.2-1 1-2.3-.1-.6.4.7 1.6.7 2.9-2.4.3-.9 1-.2 2.2-1-.4-2.6.2-.8-1-1 .7-1-.6-2.3-.1-3.1-1-2.8-.4H544l-1.5 1.3-1.4.2v-2l-.9-2.2 1.7-1V288l-.8-1.7z",
					onClick: n[88] ||= (t) => e.onClick(t),
					onDblclick: n[89] ||= (t) => e.onDblClick(),
					onMouseenter: n[90] ||= (t) => e.onEnter(t),
					onMouseleave: n[91] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Belize",
					class: "BZ",
					style: k({ display: e.config.displayPath.BZ }),
					d: "M225.3 413v-.5l.3-.1.5.3 1-1.7h.6v.4h.5v.8l-.5 1.2.3.5-.3 1 .1.3-.3 1.5-.5.8h-.5l-.6 1h-.8l.2-3.2z",
					onClick: n[92] ||= (t) => e.onClick(t),
					onDblclick: n[93] ||= (t) => e.onDblClick(),
					onMouseenter: n[94] ||= (t) => e.onEnter(t),
					onMouseleave: n[95] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Canada",
					class: "CA",
					style: k({ display: e.config.displayPath.CA }),
					d: "m199 96.2-.3-5.9 3.6.6 1.7 1 3.3 4.9-.7 5-4.2 2.7-2.3-3zm13 12.8.4-1.5-2-2.5-5.6-.2.7 3.7 5.3.9zm36.4 47 3 5 .9.6 3-1.3 3 .2 3 .3-.2-2.6-4.8-5.4-6.5-1-1.3.6zM183 93l-2.7 4.2 6.2.5 4.6 4.5 4.6 1.5-1.1-5.7-2.1-6.7L185 86l-5.5-2 .2 5.7zm26-10 5-.1-2.1 4V92l3 5.7 5.7 1.8 5-1 5.2-10.7 3.8-4.5-3.3-5-2.2-10.6-4.6-3.2-4.8-3.7-3.5-9.5-6.6 1 1.3 4-3 1.3L206 63l-1.9 7.5 1.8 7.3zm-63.8 53.4 4 2 12.6-1.4-5.8 4.8.3 3.4 4.3-.2 7-4.6 9.6-1.7 1.7-5.2-.5-5.6-3-.5-2.5 2-1-4.2-1-5.7-2.9-1.4-2.6 4.4 4 11-4.9-.8-5-6.8-7.8-4-2.7 3.4zm22.6-42-3.7-3-1.5-.7-2.9 4.3v2h4.7zm-1.5 12.3 1-4-4-2.1-4.1 1.3-2.3 4.3 4.2 4.2zm29.1 33.2 4.6-1.1 1.3-8.3v-6L199 119l-.2 1.6-4-.7-4.2 4.1-3-.4.2 9 4.6-.9-.1 6.5zm-3.3 45.6-5-4-4.7-4.1-1-6.2-1.7-9-3.1-3.8-2.8-1.5-2.5 1.4 2 9.6-1.4 3.7-2.3-9-2.5-3-3.2 4.7-4-4.7-6.2 2.8 1.4-4.4-2.8-1.9-7.5 5.9-2 3.7-2.3 6.7 4.9 2.4 4.3-.2-6.5 3.5 1.5 3.1 4 .2 6-.7 5.4 2-3.7 1.4-4-.3-4.3 1.4-1.8.8 3.4 6.4 2.5-.9 3.8 2.2 1.5 3.6 5-.7 7.1-1.2 5.3-2.6 3.3-.5 4.8 2.1 5 1.2 1-2.8-1.8-3 4.6-.7zm7.8-1-2 3.6-2.5 2.5 3.9 3.5 2.2-.8 3.8 2.3 1.8-2.7-1.7-3-.9-1.6-1.7-1.4zM182.2 155l-2-2.2-3.8.4-1 1.4 4.4 6.7zm28.7 13.2 3-7 3.4-1.8 4.2-8.8-5.4-2.4-5.8-.4-2.8 2.8-1.5 4.2v4.8l1.7 8.2zm17.2-23 5.8-.2 8-1.6 3.6 1.2 4.2-2.2 1.7-2.9-.6-4.5-3-4.2-4.6-.8-5.7 1-4.5 2.4-4-1-3.8-.4-1.8-2.7-3.2-2.7.6-4.4-2.4-4h-5.5l-3.1-4-5.8-.7-1 5 3.2 3.8 5.8 1.5 2.8 5 .3 5.7 1 6 7.4 3.4zm-89-18.3 5.2-5 2.6-.7 2.2-4.2.3-9.8-3.8 2-4.3-.2-5.8 8.2-4.7 9 3.8 2.4zm72.2 16.2 1.5-4.2-1-3.4-2.5-4-4 3-1.5 5 3.4 2.8zm-8.4 11.4-.7-2.9-5 1.3-3.3-2.1-3.4 4.8 3.1 6.2-5.7-1.1v3l7 7 1.9 3.4 2.7.7 4.6-3.4.5-8.2-4.3-4zm-74 153.7-1.1-2.3-2.8-1.8-1.4-2-1-1.5-2.6-.5-1.7-.7-3-1-.2 1.1 1 2.4 3 .8.5 1.2 2.5 1.5.8 1.5 4.6 2zm121.8-77.6-2-2.1-2.1.5-.3-3-3.2-2.1-3-2.3-1.7-1.7-1.4 1-.5-3-2-.5-1 6.1-.4 5.1-2.4 3.2 3.8-.6 1 3.6 4-3.2 2.7-3.4 1.6 2.9 4.3 1.5zM130 178.1l7.4-4.2V170l3.5-6.4 6.9-6.7 3.5-2.5-3-4.2-2.8-3-7.1-.5-4-2.1-9.5 1.6 2.8 6.2-2.5 6.4-2 7-1.1 3.8 6.4 4.7zm134.3 27.3.3-1v-3.2l-2.2-2.1-2.6 1-1.2 4.2.7 3.6 3.1-.4zm23.8 7.5 4.4 6.6 3.4 2.9 5-8 .8-4.9-4.4-.4-4-6.7-4.5-1.7-6.6-5 5.2-3.6-2.7-7.5-2.4-3.3-6.8-3.4-2.9-5.5-5.2 2-.4-4-3.8-4.2-6.2-4.7-2.7 3.7-5.5 2.6.4-6-4.8-10-7.1 4-2.6 7.7-2.2-6 2-6.3-7.2 2.6-2.9 4-2.2 8.4 1 9 4 .1-3 4 2.3 3 4.6 1.2 5.9 2.4 10.2 1.8 5-1 1.6-2.5 2.2 2.8 2.5.5 3 5-1.9 2 5.7 2.6 4.3 3.6 1 2.6.8 3.2-3.6 7-1 3.4 1 2.4-5.8.9-5.3.1-1.8 4.9 2.4 2.2 8-1v-2l4.1 3.2 4.2 3.3-1 1.8 3.4 3 6 3.5 7.6 2.4-.4-2-3-3.7-4-5.4 7.1 5 3.6 1.7 1-4.5-1.9-6.3-1.2-1.7-3.8-3-3-4 .4-3.9zM222.4 51.3l2.3 7.3 5 6 9.8-1.2 6.3 2-4.4 6-2.2-1.7-7.7-.8 1.2 8.4 4 6-.8 5.2-5 3.5-2.3 5.4 4.6 2.7 3.8 8.5-7.5-5.7-1.7 1 1.4 9.4-5.2 2.8.3 5.8 5.3.7 4.2 1.4 8.2-1.8 7.4 3.2 7.5-7.2v-3l-4.9.5-.4-2.8 4-3.9 1.3-5.1 4.3-3.9 2.7-4.7-2.3-7.1 1.9-2.7-3.9-1.9 8.5-1.6 1.9-3 5.8-2.6 4.8-13.5 4.6-5 6.6-11h-6.1l2.5-4.3 6.8-4 6.8-8.9.2-5.7-5.2-6-6-3-7.5-1.8-6-1.5-6.1-1.5-8.1 4-1.5-2.5-8.6 1-5 2.5-3.7 3.7-2.1 11.7-3.1-6-3.5-1.1-4.1 8-5.5 3.3-3.3.7-4.1 3.8.6 6.6zm74.4 265-1-2-1 1.3.6 1.4 3.6 1.7 1-.3 1.4-1.6h-2.6zm-57-77.8.6 1.6 2 .1 3.2-3.3v-1.2h-3.8zm62 66.4-2.8-1.8-3.7-1-1 .3 2.7 2 3.6 1.4 1.3-.1zm25 4.8-.4-2.2-2 .7 1-3.1-2.9-1.3-1.3 1-2.5-1.2 1-1.5-1.9-1-1.8 1.6 1.9-3.9 1.5-2.8.5-1.2-1.3-.2-2.4 1.6-1.8 2.5-2.9 7-2.3 2.5 1.2 1.1-1.7 1.5.4 1.2 5.4.2 3-.3 2.7 1-2 2h1.7l3.3-3.5.7.5-.6 3.4 1.9.8 1.2-.2 1.2-3.6zm-21.2 4.8-2.8 4.5-4.7.6-3.6-2-1-3-.8-4.5 2.6-2.9-2.5-2-4.1.4-6 3.5-4.4 5.5-2.4.6 3.2-3.8 4-5.5 3.6-2 2.4-3 2.9-.3h4.2l6 .9 4.7-.7 3.6-3.6 4.6-1.6 2-1.6 2-1.7-.2-5.2-1-1.8-2.3-.6-1-4-1.9-1.6-4.5-1.3-2.5-2.8-3.7-2.8 1.1-3.2-3-6.3-3.7-6.9-2.2-5-1.9 2.7-2.6 6-4.1 3-2-3.2-2.6-.8-1-7 .2-4.8-5-.4-.9-2.3-3.4-3.5-2.7-2-2.3 1.6-2.9-.6-4.8-1.6-2 1.4 1 9.1 1.2 5.2-3.3 5.7 3.4 4 2 4.5.2 3.4-1.6 3.5-3.2 3.4-4.4 2.3 2 2.6 1.4 7.4-1.5 4.6-2.2 1.5-4.2-4.3-2-5.2-.9-4.7.5-4.2-3-.5-4.7-.3-3-2-3.5-1.4-2-2.4-2.8-2-5.2-2.2-3.9 1-1.3-3.9-1.3-5-4-.9v-6.4l1.2-4.5 3-6.6 3.4-4.9 3.3-.7.2-4 2.2-2.8 4-.4 3.2-4.4.9-2.9 2.7-5.7.8-3.5 3 2.1 3.8-1 5.5-5 .4-3.6-2-4 2-4-.1-3.9-3.8-4-4.1-1.1-4-.6-.1 8.7-2 6.5-3 5.3-2.7-5 .8-5.5-3.3-5-3.8 6v-8l-5.2-1.6 2.5-4-3.8-9.6-2.8-3.9-3.7-1.4-3.4 6.4-.2 9.3 3.3 3.3 3 5-1.3 7.6-2.2-.2-1.8 6v-7l-4.3-2.7-2.5 1.4.3 4.6-4-.1-4.4 1.1-5-3.3-3.1.6-2.8-4.1-2.3-1.9-2.2.8-3.4.4-1.9 2.6 2.9 3.2-3 3.7-3-4.4-2.4 1.3-7.6.8-5-1.6 3.9-3.7-3.8-4-2.8.6-3.8-1.3-6.6-3-4.3-3.3-3.4-.5-1 2.4-3.5 1.3-.3-6.1-3.8 5.5-4.7-7.4-2-.8-.6 3.9-2 1.9-2-3.4-4.6 2-4.2 3.6-4.2-1L95 191l-2.4 3.3-3-.7-4.4-3.8-5.2-2V251l2.7.2 2.8 1.5 2 2.5 2.4 3.6 2.8-3 2.8-1.9 1.5 2.9 1.8 2.2 2.6 2.4 1.8 3.8 2.8 5.9 4.8 3.2v3.1l-1.5 2.4v2.4l3.5 3.5.5 3.8 3.6 2-.4 2.7 1.5 4 5 1.8 2 1.9 5.5 4.2h78v-1.6h1l.5 2.3.8.7 2 .3 2.9.7 2.7 1.3 2.3-.6 3.4 1 1.1-1.6 1.6-.6.7-1 .6-.6 2.6.9h2l.6.6 1 2.4 3 .6-.4 1.2 1.1 1.2-.5 1.6 1.2.5-.6 1.4h.8l.5-.5.5.9 2.1.5h2.2l2.2.4 2.6.8.9 1.3 1.8 3-1 1.3-2.2-.5-1.4-2.5.3 2.5-1.3 2.2.2 1.8-.3 1.1-1.8 1.3-1.3 2-.6 1.4 1.5.2 2-1.2 1.3-1 .9-.2 1.5.4.7-.6 1.4-.5 2.5-.5-.3-1.1h-.1l-.9.2-1.1-.3.8-1.3.9-.5 2-.6 2.3-.5 1.3.7.8-.8.8-.6.6.3 3-2.6 1.2-.8h9.4l.3-1 1-.2 1.1-.6 1-1.8.9-3.2 2.1-3 1 1 1.8-.7 1.3 1.2v5.5l1.8 2.3 3.1-.5 4.5-.1-4.9 3.2.1 3.3 2.2.3 3.1-2.8 2.8-1.6 6.2-2.3 3.5-2.6-1.8-1.5zm-53.7-71.1 1.1-3.2-.7-1.2-1.2-.1-1 1.8-.2.4.8 1.8zm-142.6 36.4 1.5-2.3zm-3.5 3.3-2.6.4-1.4-.7-.1 1.6.5 2 1.4 1.5 1 2.1 1.7 2.1h1.2l-2.5-3.7z",
					onClick: n[96] ||= (t) => e.onClick(t),
					onDblclick: n[97] ||= (t) => e.onDblClick(),
					onMouseenter: n[98] ||= (t) => e.onEnter(t),
					onMouseleave: n[99] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Democratic Republic of Congo",
					class: "CD",
					style: k({ display: e.config.displayPath.CD }),
					d: "m561.7 453.6-.2 3.3 1.2.3-1 1-1 .8-1 1.4-.7 1.3-.1 2.3-.7 1v2.1l-.8.8-.1 1.7-.4.2-.3 1.5.7 1.3.2 3.3.5 2.6-.3 1.5.6 1.6 1.6 1.5 1.5 3.6-1-.3-3.8.5-.8.3-.8 1.8.6 1.3-.5 3.3-.3 2.9.8.5 2 1 .7-.4.2 3h-2.1l-1.2-1.6-1-1.2-2.2-.4-.6-1.5-1.7 1-2.2-.5-1-1.2-1.8-.3h-1.3l-.1-.8h-1l-1.3-.3-1.7.5-1.2-.1-.7.3.1-3.4-1-1-.1-1.8.4-1.7-.6-1v-1.9h-3.4l.2-1h-1.4l-.2.6h-1.7l-.7 1.7-.4.7-1.6-.4-.9.4-1.9.2-1-1.4-.7-1-.8-1.6-.7-2.1h-8.2l-1 .3h-.8l-1.2.3-.4-.9.7-.3.1-1.2.5-.7 1-.6.7.3 1-1h1.5l.2.8 1 .4 1.7-1.7 1.6-1.4.7-.9V471l1.2-2.7 1.2-1.4 1.9-1.3.3-1v-1l.5-1-.1-1.5.3-2.5.6-1.7.8-1.5.2-1.7.2-2 1.1-1.4 1.5-.8 2.4.9 1.7 1 2 .3 2.2.5.8-1.6.4-.2 1.3.2 3.1-1.4 1.1.6h1l.3-.7 1-.3 2.2.3h1.8l1-.2 1.6 2.3 1.3.3.7-.4 1.3.1 1.6-.5.6 1.1z",
					onClick: n[100] ||= (t) => e.onClick(t),
					onDblclick: n[101] ||= (t) => e.onDblClick(),
					onMouseenter: n[102] ||= (t) => e.onEnter(t),
					onMouseleave: n[103] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Central African Republic",
					class: "CF",
					style: k({ display: e.config.displayPath.CF }),
					d: "m518 442.7 2.4-.3.5-.7h.5l.7.7 3.5-1 1.2-1.2 1.5-1-.3-1 .8-.2 2.7.2 2.6-1.3 2-3.1 1.5-1.2 1.8-.5.3 1.3 1.6 1.7v1.2l-.4 1.2.1.8 1 .8 2.1 1.3 1.6 1.1v1l1.9 1.4 1.1 1.2.8 1.7 2 1.1.5.9-1 .3h-1.7l-2.1-.4-1 .3-.5.6-.9.1-1.1-.6-3.1 1.4-1.3-.2-.4.2-.8 1.6-2.1-.5-2-.3-1.9-1-2.3-1-1.5 1-1 1.4-.3 2-1.8-.2-2-.5-1.6 1.5-1.5 2.6-.2-.8-.2-1.3-1.2-1-1-1.4-.3-1-1.4-1.4.3-.8-.3-1.2.2-2.2.7-.5z",
					onClick: n[104] ||= (t) => e.onClick(t),
					onDblclick: n[105] ||= (t) => e.onDblClick(),
					onMouseenter: n[106] ||= (t) => e.onEnter(t),
					onMouseleave: n[107] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Republic of Congo",
					class: "CG",
					style: k({ display: e.config.displayPath.CG }),
					d: "m511.7 476.7-1-1-1 .5-1 1.2-2.3-3 2-1.5-1-1.8 1-.7 1.9-.3.2-1.3 1.5 1.3 2.5.2.9-1.4.3-1.8-.3-2.2-1.3-1.6 1.2-3.2-.7-.6-2.1.2-.8-1.4.2-1.2h3.6l2.2.8 2.3.7.1-1.5 1.5-2.6 1.7-1.5 1.9.5 1.8.1-.2 1.7-.8 1.5-.6 1.7-.3 2.5.1 1.6-.4 1v1l-.4.9-1.9 1.3-1.2 1.4-1.3 2.7.1 2.3-.7 1-1.6 1.3-1.7 1.8-1-.6-.2-.7h-1.5l-1 1z",
					onClick: n[108] ||= (t) => e.onClick(t),
					onDblclick: n[109] ||= (t) => e.onDblClick(),
					onMouseenter: n[110] ||= (t) => e.onEnter(t),
					onMouseleave: n[111] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Switzerland",
					class: "CH",
					style: k({ display: e.config.displayPath.CH }),
					d: "M502.2 312.3v.8l-.4 1 1.3.7 1.4.1-.2 1.7-1.2.7-2.1-.5-.6 1.6-1.3.2-.5-.7-1.6 1.4-1.4.2-1.2-.9-1-1.8-1.3.7v-1.9l2.1-2.3v-1l1.2.4.8-.7h2.4l.5-1z",
					onClick: n[112] ||= (t) => e.onClick(t),
					onDblclick: n[113] ||= (t) => e.onDblClick(),
					onMouseenter: n[114] ||= (t) => e.onEnter(t),
					onMouseleave: n[115] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Côte d'Ivoire",
					class: "CI",
					style: k({ display: e.config.displayPath.CI }),
					d: "M467.2 449.5H466l-2-.6h-1.8l-3.3.6-2 .8-2.7 1h-.6l.2-2.4.3-.3v-1.1l-1.3-1.2-.9-.2-.8-.8.6-1.2-.2-1.4v-.8h.5l.2-1.2-.2-.6.3-.4 1-.3-.7-2.2-.7-1.2.3-1 .5-.2.4-.2.8.4h2.1l.6-.8h.4l.9-.3.4 1.2.6-.3 1.2-.5 1.3.7.5.9 1.2.6 1-.7 1.3-.1 2 .7.7 4-1.2 2.4-.7 3.1 1.2 2.5z",
					onClick: n[116] ||= (t) => e.onClick(t),
					onDblclick: n[117] ||= (t) => e.onDblClick(),
					onMouseenter: n[118] ||= (t) => e.onEnter(t),
					onMouseleave: n[119] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Chile",
					class: "CL",
					style: k({ display: e.config.displayPath.CL }),
					d: "M282.8 636.7v10.6h3l1.7.1-1 2-2.3 1.5-1.4-.1-1.7-.4-2-1.5-3-.7-3.5-2.7-2.8-2.6-3.9-5.2 2.3 1 4 3 3.7 1.8 1.4-2.2 1-3.2 2.5-2zm1.2-112 1 4.2 2-.4.4.7-1 3.2-3 1.5.1 5.1-.6 1 .9 1.3-2 2-1.9 2.9-1 2.9.3 3-1.7 3.4 1.3 5.7.7.6v3.1l-1.6 3.3v2.9l-2 2.3v3.2l.8 3.4-1.7 1.3-.7 3.3-.7 3.7.5 4.5-1.2.8.7 4.4 1.3 1.5-1 1.6 1.3.8.3 1.5-1.2.7.3 2.3-1 5.4-1.5 3.5.3 2.1-.9 2.7-2.1 1.9.3 4.6 1 1.6 1.8-.3v3.3l1.1 2.7 6.8.6 2.6.7h-2.5l-1.3 1-2.6 1.8-.4 4.3-1.2.1-3.2-1.5-3.2-3.2-3.5-2.7-.9-2.8.8-2.7-1.4-3-.3-7.2 1.2-4 3-3.3-4.3-1.2 2.6-3.5 1-6.6 3.1 1.4 1.5-8-2-1-.8 4.8-1.8-.6 1-5.4.9-6.8 1.3-2.5-.9-3.5-.2-4 1.2-.1 1.7-5.6 2-5.4 1.1-5-.6-5 .8-2.6-.3-4 1.6-3.8.6-6 .8-6.4 1-6.8-.3-4.8-.6-4.2 1.5-.7.7-1.5 1.4 2 .4 2 1.4 1.3-.8 2.9z",
					onClick: n[120] ||= (t) => e.onClick(t),
					onDblclick: n[121] ||= (t) => e.onDblClick(),
					onMouseenter: n[122] ||= (t) => e.onEnter(t),
					onMouseleave: n[123] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Cameroon",
					class: "CM",
					style: k({ display: e.config.displayPath.CM }),
					d: "M512 457h-.4l-1.7.3-1.7-.4-1.3.2h-4.6l.4-2.3-1-1.8-1.4-.5-.5-1.2-.7-.4v-.8l.7-2 1.3-2.7h.8l1.7-1.7h1l1.7 1.1 1.9-1 .3-1 .6-1.2.4-1.4 1.5-1.2.6-2 .6-.6.4-1.5.7-1.8 2.4-2.2.1-1 .3-.4-1-1.2v-.9l.8-.1 1.1 1.8.2 1.9-.1 1.9 1.5 2.5h-1.5l-.8.2-1.3-.3-.6 1.4 1.6 1.6 1.3.5.4 1.2.8 1.9-.4.8-1.4 2.8-.7.5-.2 2.2.3 1.2-.2.8 1.3 1.4.2 1 1 1.5 1.3.9.1 1.3.4.8-.2 1.5-2.3-.7-2.2-.7z",
					onClick: n[124] ||= (t) => e.onClick(t),
					onDblclick: n[125] ||= (t) => e.onDblClick(),
					onMouseenter: n[126] ||= (t) => e.onEnter(t),
					onMouseleave: n[127] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "China",
					class: "CN",
					style: k({ display: e.config.displayPath.CN }),
					d: "m784.6 410.4-2.4 1.4-2.3-.9v-2.5l1.3-1.4 3-.8h1.7l.6 1.2-1.2 1.3zM833.2 303l4.9 1.4 3.3 3 1.1 4h4.3l2.4-1.7 4.6-1.2-1.4 3.7-1.1 1.5-1 4.5-1.9 3.9-3.4-.7-2.4 1.4.8 3.3-.4 4.6h-1.5v2l-1.8-2.2-1 2.1-4.4 1.6.4 2-2.4-.1-1.3-1.2-2 2.6-3 2-2.3 2.4-4 1-2 1.7-3 1 1.5-1.7-.6-1.4 2.2-2.4-1.5-2-2.4 1.3-3.2 2.6-1.7 2.3-2.8.2-1.4 1.7 1.5 2.4 2.3.6v1.5l2.3 1 3.1-2.5 2.5 1.4 1.8.1.5 1.8-4 1-1.3 1.9-2.7 1.7-1.5 2.4 3 1.9 1.2 3.3 1.7 3 1.9 2.5v2.5l-1.8.9.6 1.7 1.7 1-.4 2.6-.8 2.5-1.5.3-2 3.4-2.3 4.1-2.6 3.7-4 2.8-3.8 2.6-3.2.3-1.7 1.3-1-1-1.5 1.6-4 1.5-3 .4-.9 3.2-1.5.1-.8-2.1.7-1.2-3.8-1-1.3.6-2.8-.8-1.4-1.2.5-1.8-2.6-.5-1.3-1.2-2.4 1.6-2.7.4h-2.3l-1.5.7-1.4.5.4 3.4h-1.5l-.3-.8V401l-2.1.8-1.2-.5-2.1-1.1.8-2.6-1.8-.5-.6-2.8-3 .5.4-3.7 2.6-2.5.1-2.6v-2.4l-1.3-.8-1-1.8-1.6.2-3-.4 1-1.4-1.3-2-2 1.4-2.4-.8-3.2 2-2.6 2.4-2.2.4-1.3-.9h-1.5l-2-.8-1.5.8-1.8 2.4-.2-2.5-1.8.6-3.2-.3-3.2-.7-2.3-1.4-2.2-.6-.9-1.6-1.6-.4-2.8-2.1-2.3-1-1.1.8-4-2.3-2.7-2-.8-3.7 2 .5.1-1.7-1-1.7.2-2.8-3-4-4.6-1.4-.8-2.6-2.1-1.6-.5-1-.4-2v-1.4l-1.6-.9-1 .4-.7-3.3.8-.8-.4-.9 2.7-1.7 2-.7 3 .4 1-2.3 3.6-.5 1-1.4 4.4-2 .4-1-.2-2 1.9-1-2.5-6.8 5.5-1.6 1.5-.9 2-7.3 5.5 1.4 1.6-1.9.1-4.2 2.4-.3 2.1-2.9 1.1-.3.7 3 2.4 2.2 4 1.5 2 3.4-1.2 4.7 1 1.7 3.4.7 3.8.6 3.4 2.4 1.7.4 1.3 3.6 1.6 2.3 3.1-.1 5.8.8 3.7-.5 2.8.6 4.1 2.3h3.4l1.3 1.1 3.2-2 4.6-1.3 4.2-.1 3.2-1.4 2-2 2-1.3-.4-1.3-1-1.5 1.5-2.5 1.6.3 2.9.8 2.8-2 4.3-1.6 2-2.7 2-1.2 4-.5 2.3.5.3-1.5-2.6-2.9-2.2-1.3-2.2 1.5-2.7-.6-1.6.5-.8-1.7 2-4.2 1.4-3.3 3.4 1.7 4-2.8-.1-2 2.5-4.6 1.6-1.5v-2.5l-1.6-1.1 2.3-2.3 3.5-.9 3.7-.1 4.2 1.4 2.5 1.7 1.7 4.6 1 2 1 2.7z",
					onClick: n[128] ||= (t) => e.onClick(t),
					onDblclick: n[129] ||= (t) => e.onDblClick(),
					onMouseenter: n[130] ||= (t) => e.onEnter(t),
					onMouseleave: n[131] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Colombia",
					class: "CO",
					style: k({ display: e.config.displayPath.CO }),
					d: "m264 463.8-1.3-.7-1.4-.9-.8.5-2.3-.4-.7-1.2h-.5l-2.8-1.6-.4-.8 1-.2-.1-1.4.7-1 1.3-.2 1.2-1.8 1.1-1.4-1-.7.5-1.6-.6-2.6.6-.7-.5-2.4-1.1-1.5.3-1.3 1 .2.5-.9-.7-1.6.4-.5 1.4.1 2.1-2 1.2-.2v-1l.5-2.4 1.6-1.3h1.8l.2-.6 2.2.2 2.2-1.4 1.1-.7 1.4-1.3 1 .1.7.8-.6 1-1.7.4-.8 1.4-1 .9-.9 1-.3 2-.8 1.7 1.5.2.3 1.3.6.6.3 1.1-.4 1 .1.6.7.3.7 1 3.6-.3 1.6.3 2 2.5 1.1-.3 2 .1 1.6-.3 1 .5-.5 1.5-.6 1-.2 2 .5 1.8.8.8.1.6-1.4 1.4 1 .6.8 1 .8 2.8-.5.3-.5-1.6-.8-.9-1 1h-5.4v1.7l1.7.2-.1 1.1-.6-.3-1.6.5v2l1.3 1 .4 1.6v1.2l-1.3 7.7-1.4-1.5h-.9l1.9-3-2.2-1.2-1.7.2-1-.5-1.5.8-2.1-.4-1.7-2.9-1.3-.7-.9-1.3-1.8-1.4z",
					onClick: n[132] ||= (t) => e.onClick(t),
					onDblclick: n[133] ||= (t) => e.onDblClick(),
					onMouseenter: n[134] ||= (t) => e.onEnter(t),
					onMouseleave: n[135] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Costa Rica",
					class: "CR",
					style: k({ display: e.config.displayPath.CR }),
					d: "m242.6 440.4-1.5-.6-.6-.6.4-.5-.1-.6-.8-.7-1.1-.6-1-.3-.2-.9-.7-.5.2.9-.6.6-.6-.7-1-.3-.3-.6v-.9l.4-.9-.8-.3.6-.6.4-.4 1.9.8.6-.4 1 .3.4.5.8.2.7-.6.7 1.6 1 1.1 1.4 1.2-1 .3v1.1l.5.4-.4.4.1.5-.2.5z",
					onClick: n[136] ||= (t) => e.onClick(t),
					onDblclick: n[137] ||= (t) => e.onDblClick(),
					onMouseenter: n[138] ||= (t) => e.onEnter(t),
					onMouseleave: n[139] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Cuba",
					class: "CU",
					style: k({ display: e.config.displayPath.CU }),
					d: "m244.6 397 2.4.2h2.2l2.6 1 1.2 1.1 2.6-.3 1 .7 2.3 1.9 1.8 1.3h1l1.6.6-.2.8 2 .1 2.2 1.3-.4.7-1.8.3-2 .2-1.9-.3-4 .3 2-1.6-1.2-.8-1.8-.2-1-.9-.7-1.7-1.6.2-2.6-.8-.8-.7-3.7-.4-1-.6 1.1-.8-2.7-.1-2 1.5H240l-.4.8-1.4.3-1.2-.3 1.5-.9.6-1 1.3-.7 1.4-.6 2.1-.3z",
					onClick: n[140] ||= (t) => e.onClick(t),
					onDblclick: n[141] ||= (t) => e.onDblClick(),
					onMouseenter: n[142] ||= (t) => e.onEnter(t),
					onMouseleave: n[143] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Cyprus",
					class: "CY",
					style: k({ display: e.config.displayPath.CY }),
					d: "m570.3 358.3 1.9-1.5-2.6 1h-2l-.4.8h-.2l-1.3.2.6 1.3 1.4.5 2.9-1.4v-.3z",
					onClick: n[144] ||= (t) => e.onClick(t),
					onDblclick: n[145] ||= (t) => e.onDblClick(),
					onMouseenter: n[146] ||= (t) => e.onEnter(t),
					onMouseleave: n[147] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Czech Republic",
					class: "CZ",
					style: k({ display: e.config.displayPath.CZ }),
					d: "m522.8 307.9-1.3-.8-1.3.2-2.2-1.3-1 .3-1.5 1.7-2.1-1.3-1.6-1.9-1.4-1-.3-1.8-.5-1.3 2-1 1-1 2-1 .8-.8.7.5 1.3-.4 1.3 1.4 2 .4v1.2l1.4.9.4-1.1 2 .5.2 1.3 2.1.3 1.3 2.1h-.8l-.5.8-.6.2-.2 1-.5.2-.1.4-1 .4h-1.2z",
					onClick: n[148] ||= (t) => e.onClick(t),
					onDblclick: n[149] ||= (t) => e.onDblClick(),
					onMouseenter: n[150] ||= (t) => e.onEnter(t),
					onMouseleave: n[151] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Germany",
					class: "DE",
					style: k({ display: e.config.displayPath.DE }),
					d: "m503 279 .1 1.8 2.9 1.1v1.7l2.8-.9 1.6-1.3 3.1 1.9 1.3 1.5.7 2.4-.8 1.3 1 1.6.7 2.4-.2 1.6 1.2 2.9-1.3.4-.7-.5-.7.9-2 .8-1 1.1-2.1 1 .5 1.3.3 1.8 1.4 1 1.6 1.9-1 2-1 .5.4 2.7-.3.7-.9-.9h-1.3l-2 .7-2.5-.2-.4 1-1.4-1-.9.1-3-1.2-.5.9h-2.4l.3-3 1.5-3-4-.7-1.4-1.1.2-2-.6-1 .3-2.9-.5-4.7h1.7l.7-1.7.7-4.2-.5-1.6.6-1 2.3-.2.5 1 2-2.3-.7-1.8-.1-2.8 2 .7z",
					onClick: n[152] ||= (t) => e.onClick(t),
					onDblclick: n[153] ||= (t) => e.onDblClick(),
					onMouseenter: n[154] ||= (t) => e.onEnter(t),
					onMouseleave: n[155] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Djibouti",
					class: "DJ",
					style: k({ display: e.config.displayPath.DJ }),
					d: "m596 427.7.7.9v1.2l-1.7.7 1.2.7-1 1.6-.6-.5-.7.2h-1.6v-1l-.2-.7 1-1.4.9-1.2 1.2.2z",
					onClick: n[156] ||= (t) => e.onClick(t),
					onDblclick: n[157] ||= (t) => e.onDblClick(),
					onMouseenter: n[158] ||= (t) => e.onEnter(t),
					onMouseleave: n[159] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Denmark",
					class: "DK",
					style: k({ display: e.config.displayPath.DK }),
					d: "m510.8 275.8-1.7 4-2.9-2.8-.4-2 4.1-1.7zm-5-4.2-.6 1.9-.9-.6-2 3.6.8 2.4-1.8.8-2.1-.7-1.2-2.7v-5.1l.4-1.4.8-1.5 2.5-.4 1-1.4 2.2-1.5v2.7l-1 1.7.4 1.4z",
					onClick: n[160] ||= (t) => e.onClick(t),
					onDblclick: n[161] ||= (t) => e.onDblClick(),
					onMouseenter: n[162] ||= (t) => e.onEnter(t),
					onMouseleave: n[163] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Dominican Republic",
					class: "DO",
					style: k({ display: e.config.displayPath.DO }),
					d: "m274.2 407.4.3-.6h2.2l1.7.8h.7l.5 1h1.6l-.1.8 1.2.1 1.4 1.1-1 1.2-1.4-.6h-2.2l-.5.5-1 .2-.5-.8-1 .5-1 2-.8-.5-.1-.8v-.8l-.7-1 .7-.4.2-1.1z",
					onClick: n[164] ||= (t) => e.onClick(t),
					onDblclick: n[165] ||= (t) => e.onDblClick(),
					onMouseenter: n[166] ||= (t) => e.onEnter(t),
					onMouseleave: n[167] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Algeria",
					class: "DZ",
					style: k({ display: e.config.displayPath.DZ }),
					d: "m508.9 396-9.6 5.8-8.1 5.9-4 1.3-3 .3-.1-1.9-1.3-.5-1.8-.8-.6-1.4-9.5-6.6-9.4-6.6-10.6-7.5v-4.6l4.6-2.4 2.8-.5 2.3-.8 1-1.6 3.3-1.3.1-2.4 1.6-.3 1.3-1.2 3.7-.6.5-1.3-.7-.7-1-3.5-.2-2-1-2.2 2.7-2 3-.5 1.8-1.5 2.7-1 4.7-.6 4.7-.3 1.4.5 2.6-1.4h3l1.1.8 2-.2-.6 1.8.4 3.3-.6 2.8-1.7 1.9.2 2.5 2.3 2v.8l1.7 1.3 1.2 5.9 1 2.8.1 1.5-.5 2.6.2 1.4-.4 1.8.3 2-1.1 1.2 1.6 2.3.1 1.3 1 1.7 1.3-.6 2.3 1.5z",
					onClick: n[168] ||= (t) => e.onClick(t),
					onDblclick: n[169] ||= (t) => e.onDblClick(),
					onMouseenter: n[170] ||= (t) => e.onEnter(t),
					onMouseleave: n[171] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Ecuador",
					class: "EC",
					style: k({ display: e.config.displayPath.EC }),
					d: "m250.1 472.9 1.5-2.1-.6-1.2-1 1.3-1.8-1.3.6-.7-.5-2.6 1-.4.5-1.7 1-1.8-.1-1.1 1.5-.7 2-1 2.8 1.5h.5l.7 1.2 2.3.4.8-.5 1.4 1 1.2.6.4 2.1-.9 1.8-3 3-3.4 1-1.7 2.5-.5 1.9-1.6 1.1-1.2-1.4-1.1-.3-1.2.2v-1l.7-.7z",
					onClick: n[172] ||= (t) => e.onClick(t),
					onDblclick: n[173] ||= (t) => e.onDblClick(),
					onMouseenter: n[174] ||= (t) => e.onEnter(t),
					onMouseleave: n[175] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Estonia",
					class: "EE",
					style: k({ display: e.config.displayPath.EE }),
					d: "m543.4 264.7.4-3.1-1 .7-1.9-2-.2-3 3.5-1.6 3.6-.8 3 1 3-.2.3 1-2 3 .9 5-1.2 1.7h-2.3l-2.5-2-1.2-.6z",
					onClick: n[176] ||= (t) => e.onClick(t),
					onDblclick: n[177] ||= (t) => e.onDblClick(),
					onMouseenter: n[178] ||= (t) => e.onEnter(t),
					onMouseleave: n[179] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Egypt",
					class: "EG",
					style: k({ display: e.config.displayPath.EG }),
					d: "m573.2 377.3-.8 1.3-.6 2.4-.8 1.6-.6.6-1-1-1.2-1.5-2-4.5-.3.3 1.1 3.3 1.8 3.2 2 4.9 1.1 1.7 1 1.7 2.4 3.4-.5.5v2l3.3 2.7.5.6h-33.2v-22.4l-.9-2.6.7-2-.4-1.4 1-1.5h3.7l2.7.8 2.8 1 1.3.5 2.2-1 1.1-1 2.5-.3 2 .4.8 1.7.6-1.1 2.3.8 2.2.2 1.3-.9z",
					onClick: n[180] ||= (t) => e.onClick(t),
					onDblclick: n[181] ||= (t) => e.onDblClick(),
					onMouseenter: n[182] ||= (t) => e.onEnter(t),
					onMouseleave: n[183] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Western Sahara",
					class: "EH",
					style: k({ display: e.config.displayPath.EH }),
					d: "M438.6 383h3.6l8.7.1h-12.4l-1.9 3.3-1.8 1.1-1 2-.1 1.6-.8 1.8-.9.5-1.6 2-1 2 .3 1-1 1.7-1 .8-.2 1.4v1.2l.5-1h11l-.5-4.3.7-1.6 2.6-.2-.1-7.9 9.2.2V383z",
					onClick: n[184] ||= (t) => e.onClick(t),
					onDblclick: n[185] ||= (t) => e.onDblClick(),
					onMouseenter: n[186] ||= (t) => e.onEnter(t),
					onMouseleave: n[187] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Eritrea",
					class: "ER",
					style: k({ display: e.config.displayPath.ER }),
					d: "m594 428.2-1-1-1.1-1.6-1.2-1-.8-1-2.4-1.1h-2l-.6-.6-1.7.6-1.7-1.3-.8 2.2-3.3-.6-.3-1.2 1.2-4.2.3-2 .9-.8 2-.5 1.5-1.7 1.6 3.4.8 2.6 1.5 1.5 3.8 2.7 1.6 1.6 1.5 1.7.9 1 1.3.8-.8.7z",
					onClick: n[188] ||= (t) => e.onClick(t),
					onDblclick: n[189] ||= (t) => e.onDblClick(),
					onMouseenter: n[190] ||= (t) => e.onEnter(t),
					onMouseleave: n[191] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Spain",
					class: "ES",
					style: k({ display: e.config.displayPath.ES }),
					d: "M450 334.6v-2.7l-1-1.7 3.9-2.7 3.4.6h3.8l3 .7 2.3-.2 4.5.1 1.1 1.5 5.2 1.7 1-.8 3.2 1.7 3.2-.5.2 2.2-2.7 2.5-3.6.8-.2 1.2-1.7 2-1.1 3 1 2-1.6 1.7-.6 2.3-2 .7-2 2.7H463l-1.7 1.2-1.1 1.3-1.4-.3-1-1.2-.8-2-2.6-.5-.3-1.2 1-1.3.4-1-1-1 .9-2.4-1.2-2.1 1.2-.3.2-1.8.4-.5v-2.9l1.3-1-.7-1.8-1.7-.2-.5.5h-1.6l-.7-1.8-1.2.5z",
					onClick: n[192] ||= (t) => e.onClick(t),
					onDblclick: n[193] ||= (t) => e.onDblClick(),
					onMouseenter: n[194] ||= (t) => e.onEnter(t),
					onMouseleave: n[195] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Ethiopia",
					class: "ET",
					style: k({ display: e.config.displayPath.ET }),
					d: "m581.5 421.2 1.7 1.3 1.7-.6.7.6h1.9l2.4 1.1.8 1 1.2 1 1.1 1.6 1 1-1 1.2-1 1.4.3.8v.8h1.6l.7-.1.6.5-.6 1 1 1.5 1 1.4 1.1 1 9.2 3.3h2.4l-8 8.4-3.6.2-2.5 2h-1.8l-.8.9h-2l-1-1-2.6 1.2-.8 1.2-1.9-.3-.6-.3H582l-3.5-2.3h-2l-1-1v-1.5l-1.4-.5-1.6-3-1.3-.7-.5-1-1.4-1.5-1.7-.2 1-1.6h1.4l.4-.9v-2.5l.8-3 1.3-.8.3-1.2 1.2-2.1 1.7-1.4 1.2-2.9.4-2.4 3.3.6z",
					onClick: n[196] ||= (t) => e.onClick(t),
					onDblclick: n[197] ||= (t) => e.onDblClick(),
					onMouseenter: n[198] ||= (t) => e.onEnter(t),
					onMouseleave: n[199] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Finland",
					class: "FI",
					style: k({ display: e.config.displayPath.FI }),
					d: "m555.4 193.1-.4 5.4 4.3 5-2.6 5.5 3.3 8-2 5.7 2.6 4.9-1.1 4 4.1 4.3-1 3.2-2.6 3.4-6 7.4-5.1.5-5 2-4.5 1.2-1.6-3-2.8-2 .7-5.7-1.4-5.4 1.3-3.5 2.6-4 6.4-7 1.9-1.4-.3-2.8-4-3.2-.9-2.7v-11.2l-4.4-5.1-3.8-3.8 1.7-2.1 3.1 4.1 3.7-.4 3 2 2.7-3.5 1.4-5.9 4.3-2.7 3.6 3.2z",
					onClick: n[200] ||= (t) => e.onClick(t),
					onDblclick: n[201] ||= (t) => e.onDblClick(),
					onMouseenter: n[202] ||= (t) => e.onEnter(t),
					onMouseleave: n[203] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Fiji",
					class: "FJ",
					style: k({ display: e.config.displayPath.FJ }),
					d: "m980.5 508.6-.3 1.4-.3.2-1.7.7-1.8.6-.4-1 1.4-.7 1-.1 1.5-1zm-5.8 4.3-1.3-.3-1 1 .2 1.2 1.6.4 1.7-.4.5-1.5-1-.9z",
					onClick: n[204] ||= (t) => e.onClick(t),
					onDblclick: n[205] ||= (t) => e.onDblClick(),
					onMouseenter: n[206] ||= (t) => e.onEnter(t),
					onMouseleave: n[207] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Falkland Islands",
					class: "FK",
					style: k({ display: e.config.displayPath.FK }),
					d: "m303.7 633.1 3.3-2.7 2.4 1.2 1.7-1.8 2.2 2-.8 1.6-3.8 1.3-1.3-1.6-2.3 2z",
					onClick: n[208] ||= (t) => e.onClick(t),
					onDblclick: n[209] ||= (t) => e.onDblClick(),
					onMouseenter: n[210] ||= (t) => e.onEnter(t),
					onMouseleave: n[211] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "France",
					class: "FR",
					style: k({ display: e.config.displayPath.FR }),
					d: "m502 333.5-.9 3-1.2-.8-.7-2.6.6-1.4 1.8-1.4zm-16.7-33.3 2 2 1.4-.3 2.5 2 .6.4.8-.1 1.3 1 4 .9-1.4 2.9-.3 3-.8.7-1.3-.4.1 1-2 2.3v1.9l1.3-.7 1 1.8-.2 1.1.8 1.5-1 1.3.8 3 1.5.5-.3 1.7-2.6 2.1-5.5-1-4 1.2-.4 2.3-3.2.5-3.2-1.7-1 .8-5.2-1.7-1-1.5 1.4-2.3.5-8-2.9-4.2-2-2-4.4-1.7-.2-3 3.6-1 4.7 1.1-.9-4.8 2.7 1.9 6.5-3.4.8-3.6 2.5-1 .4 1.6 1.3.1z",
					onClick: n[212] ||= (t) => e.onClick(t),
					onDblclick: n[213] ||= (t) => e.onDblClick(),
					onMouseenter: n[214] ||= (t) => e.onEnter(t),
					onMouseleave: n[215] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Gabon",
					class: "GA",
					style: k({ display: e.config.displayPath.GA }),
					d: "m506.4 474.5-3-2.8-1.8-2.3-1.7-3 .1-.8.6-1 .7-2 .6-2 1-.2h4v-3.3l1.3-.2 1.7.4 1.7-.4.3.2-.2 1.2.8 1.4 2-.2.8.6-1.2 3.2 1.3 1.6.3 2.2-.4 1.8-.8 1.4-2.5-.2-1.5-1.3-.2 1.3-1.9.3-1 .7 1 1.8z",
					onClick: n[216] ||= (t) => e.onClick(t),
					onDblclick: n[217] ||= (t) => e.onDblClick(),
					onMouseenter: n[218] ||= (t) => e.onEnter(t),
					onMouseleave: n[219] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "United Kingdom of Great Britain and Northern Ireland",
					class: "GB",
					style: k({ display: e.config.displayPath.GB }),
					d: "m459.4 281-1.5 3.3-2.1-1H454l.6-2.5-.6-2.6 2.4-.2zm7.4-20.8-3 5.8 2.9-.7h3l-.7 4.2-2.5 4.5 3 .3.1.6 2.5 5.8 2 .7 1.7 5.4.8 1.9 3.4.9-.4 2.9-1.4 1.3 1.1 2.3-2.5 2.4h-3.7l-4.8 1.1-1.3-.8-1.9 2-2.6-.5-2 1.7-1.4-.9 4-4.6 2.6-1-4.4-.7-.8-1.8 3-1.4-1.6-2.5.5-3 4.2.3.4-2.7-1.9-3-3.4-.9-.7-1.3 1-2.2-.9-1.4-1.5 2.4-.2-4.8-1.4-2.6 1-5.4 2.2-4.3 2.3.4z",
					onClick: n[220] ||= (t) => e.onClick(t),
					onDblclick: n[221] ||= (t) => e.onDblClick(),
					onMouseenter: n[222] ||= (t) => e.onEnter(t),
					onMouseleave: n[223] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Greenland",
					class: "GL",
					style: k({ display: e.config.displayPath.GL }),
					d: "m344.1 24 9.4-13.7 9.9 1 3.6-8.9 9.9-2.4 22.4 3.2 17.5 18.5-5.2 8.3-10.7 1-15 2 1.3 3.6 10-2.2 8.4 7 5.4-6.2 2.4 7.1-3.1 11 7.1-7 13.6-7.5 8.4 3.8 1.6 8.2-11.4 12.6-1.6 4-9 2.8 6.5.8-3.2 11.5L420 92v15.2l3.5 8.4-4.4.5-4.6 3.9 5.1 6.3.7 9.6-3 1 3.6 9.2-6.2.7 3.3 4.1-1 3.6-4 1.5h-3.8l3.5 6.5v4.1l-5.5-3.8-1.5 2.5 3.8 2.3 3.7 5.4 1 7-5 1.6-2.1-3.3-3.5-5 1 6-3.3 4.3 7.4.4 3.9.4-7.5 7-7.7 6.2-8.1 2.6h-3.1l-3 3-3.8 7.5-6 5-2 .2-3.7 1.7-4 1.6-2.5 4.1v4.6l-1.4 4.1-4.6 5 1.1 4.7-1.2 4.8-1.5 5.6-4 .3-4-4.6h-5.7l-2.7-3.2-1.9-5.8-4.8-7.7-1.4-4.1-.4-6-4-6.2 1.1-5.2-1.9-2.5 2.8-8.6 4.2-2.9 1.1-3.2.6-6.3-3.2 2.9-1.5 1.1-2.5 1.2-3.5-2.6-.2-5.6 1.1-4.5h2.6l5.8 2.2-4.9-5.5-2.5-3-2.8 1.3-2.3-2.2 3.1-8.5-1.7-3.6-2.2-6.7-3.4-10.9-3.5-4.2V133l-7.5-6.7-6-.8-7.5.4-6.8.9-3.3-3.8-4.8-7.6 7.3-4 5.7-.7-12-3.3-6.4-5.5.4-5.3 10.6-6.9 10.3-7.1 1-5.7-7.5-5.7 2.5-6.7 9.7-12.3 4-2-1.1-8.6 6.6-5.2 8.7-3.2 8.6-.2 3 6.3L334 28l6.7 7.8 3.9 1.6 5.8 6.4-6.6-10.8z",
					onClick: n[224] ||= (t) => e.onClick(t),
					onDblclick: n[225] ||= (t) => e.onDblClick(),
					onMouseenter: n[226] ||= (t) => e.onEnter(t),
					onMouseleave: n[227] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Georgia",
					class: "GE",
					style: k({ display: e.config.displayPath.GE }),
					d: "m591.8 335.9.4-1.6-.7-2.6-1.6-1.4-1.6-.5-1-1.1.3-.5 2.4.7 4.1.6 3.8 1.8.5.7 1.7-.6 2.6.8.9 1.6 1.8.8-.8.5 1.4 2-.4.5-1.5-.2-2-1-.7.5-4 .6-2.6-1.8z",
					onClick: n[228] ||= (t) => e.onClick(t),
					onDblclick: n[229] ||= (t) => e.onDblClick(),
					onMouseenter: n[230] ||= (t) => e.onEnter(t),
					onMouseleave: n[231] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "French Guiana",
					class: "GF",
					style: k({ display: e.config.displayPath.GF }),
					d: "m327.9 456.4-1 1-1.4.3-.4-.8-.6-.1-.9.7-1.2-.5.7-1.2.2-1.3.5-1.2-1-1.6-.3-2 1.5-2.4 1 .3 2 .7 3 2.4.4 1.1-1.7 2.6z",
					onClick: n[232] ||= (t) => e.onClick(t),
					onDblclick: n[233] ||= (t) => e.onDblClick(),
					onMouseenter: n[234] ||= (t) => e.onEnter(t),
					onMouseleave: n[235] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Ghana",
					class: "GH",
					style: k({ display: e.config.displayPath.GH }),
					d: "m478.2 446.8-4.4 1.7-1.5 1-2.6.8-2.5-.8.2-1.1-1.2-2.5.7-3.1 1.2-2.4-.8-4-.4-2.1.1-1.6 4.9-.2 1.2.2 1-.4 1.2.2-.2.9 1.2 1.5v2l.3 2.2.6 1-.6 2.6.3 1.4.7 1.8z",
					onClick: n[236] ||= (t) => e.onClick(t),
					onDblclick: n[237] ||= (t) => e.onDblClick(),
					onMouseenter: n[238] ||= (t) => e.onEnter(t),
					onMouseleave: n[239] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Gambia",
					class: "GM",
					style: k({ display: e.config.displayPath.GM }),
					d: "m428 426.4.4-1.2 3-.1.7-.7h.9l1 .7h1l.9-.5.5.8-1.2.7H434l-1.2-.7-1 .7h-.5l-.7.4z",
					onClick: n[240] ||= (t) => e.onClick(t),
					onDblclick: n[241] ||= (t) => e.onDblClick(),
					onMouseenter: n[242] ||= (t) => e.onEnter(t),
					onMouseleave: n[243] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Guinea",
					class: "GN",
					style: k({ display: e.config.displayPath.GN }),
					d: "m451.6 442-.8-.2-.6 1.2h-.8l-.5-.6.2-1.2-1.2-1.7-.7.3h-.6l-.8.3v-1l-.4-.8v-.8l-.5-1.2-.8-1h-2.3l-.6.5h-.8l-.5.7-.3.8-1.5 1.2-1.2-1.7-1.1-1-.7-.4-.7-.6-.3-1.3-.5-.6-.8-.5 1.3-1.3h.8l.8-.5h.6l.4-.4-.2-.9.3-.3v-1h1.4l2 .8.6-.1.2-.3 1.6.2.4-.2.1 1.1h.5l.7-.4.5.1.8.7 1.1.3.8-.7 1-.3.6-.4h.6l.6.7.3.8 1.2 1.1-.6.8-.1.9.6-.3.3.3-.1.9.8.8-.5.2-.2 1 .6 1.1.7 2.3-1 .4-.3.3.2.6-.2 1.2z",
					onClick: n[244] ||= (t) => e.onClick(t),
					onDblclick: n[245] ||= (t) => e.onDblClick(),
					onMouseenter: n[246] ||= (t) => e.onEnter(t),
					onMouseleave: n[247] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Equatorial Guinea",
					class: "GQ",
					style: k({ display: e.config.displayPath.GQ }),
					d: "m501.9 460.6-.6-.5 1-3h4.6v3.3h-4z",
					onClick: n[248] ||= (t) => e.onClick(t),
					onDblclick: n[249] ||= (t) => e.onDblClick(),
					onMouseenter: n[250] ||= (t) => e.onEnter(t),
					onMouseleave: n[251] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Greece",
					class: "GR",
					style: k({ display: e.config.displayPath.GR }),
					d: "m541.7 356.7 1.5 1.2 2.2-.2 2.1.2v.6l1.5-.4-.4 1-4 .3v-.5l-3.4-.7zm8.1-21-.8 2.4-.7.4-1.7-.1-1.5-.4-3.4 1 2 2-1.4.6h-1.6l-1.5-1.8-.5.8.6 2.1 1.4 1.7-1 .8 1.5 1.7 1.4 1v2l-1.3-1.1-1.2.2.8 1.8-1 .2-1-.7 1.3 4h-.6l-.5-1.3h-.5l-.3 1.3-.4-.3v-.8l-.5-1h-.6v.8l-.2.3-.6-.5-.4-1 .5-.6-.3-.8-.4-.3-.4-.1-.5-1 .5-.5.4-.5.6.1.2-.4.6-.1.7.4.5.2.4-.6-1-.1-.5-.2-1.2.3h-1.2l-1.1-1.6-.2-.3.2-.6-1.5-1.1-.2-1 1.3-1.8.2-1.2 1-.6v-1l1.8-.3 1-.8 1.6.1.5-.6.5-.2 2 .1 2.3-1 2 1.3 2.5-.3v-1.9z",
					onClick: n[252] ||= (t) => e.onClick(t),
					onDblclick: n[253] ||= (t) => e.onDblClick(),
					onMouseenter: n[254] ||= (t) => e.onEnter(t),
					onMouseleave: n[255] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Guatemala",
					class: "GT",
					style: k({ display: e.config.displayPath.GT }),
					d: "m222.6 424.8-1.4-.6h-1.7l-1.3-.6-1.5-1.2v-.8l.4-.7-.4-.5 1.3-2.4h3.6v-1l-.4-.1-.3-.7-1-.6-1-1h1.2v-1.7h5.2v2.4l-.2 3.3h.8l1 .5.2-.5.8.4-1.3 1.1-1.3.8-.2.6.2.5-.6.8-.6.1.1.4-.5.3-1 .7z",
					onClick: n[256] ||= (t) => e.onClick(t),
					onDblclick: n[257] ||= (t) => e.onDblClick(),
					onMouseenter: n[258] ||= (t) => e.onEnter(t),
					onMouseleave: n[259] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Guinea-Bissau",
					class: "GW",
					style: k({ display: e.config.displayPath.GW }),
					d: "m432.8 432.4-1.5-1.1-1.2-.2-.6-.8v-.5l-.8-.6-.2-.6 1.5-.5 1 .1.7-.3 5.1.1v1l-.3.3.2 1-.4.3h-.6l-.8.5h-.8z",
					onClick: n[260] ||= (t) => e.onClick(t),
					onDblclick: n[261] ||= (t) => e.onDblClick(),
					onMouseenter: n[262] ||= (t) => e.onEnter(t),
					onMouseleave: n[263] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Guyana",
					class: "GY",
					style: k({ display: e.config.displayPath.GY }),
					d: "m307.7 440 1.8 1 1.8 1.9v1.4h1.1l1.5 1.4 1.1 1-.4 2.5-1.7.8.1.6-.5 1.5 1.3 2h.8l.4 1.6 1.7 2.4h-.7l-1.5-.1-1 .7-1.2.5-.9.1-.3.6-1.4-.2-1.7-1.3-.2-1.3-.7-1.4.4-2.4.8-1-.6-1.2-1-.5.4-1.2-.7-.6H305l-2-2 .8-.8v-1.3l1.7-.5.7-.5-1-1 .3-1z",
					onClick: n[264] ||= (t) => e.onClick(t),
					onDblclick: n[265] ||= (t) => e.onDblClick(),
					onMouseenter: n[266] ||= (t) => e.onEnter(t),
					onMouseleave: n[267] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Honduras",
					class: "HN",
					style: k({ display: e.config.displayPath.HN }),
					d: "m230.4 426.9-.5-.9-.8-.2.2-1.2-.4-.3-.6-.2-1.2.3-.1-.3-.8-.5-.6-.6-.9-.2.6-.8-.2-.5.2-.6 1.3-.8 1.3-1h.3l.6-.5h.8l.3.2.4-.1 1.3.2h1.3l.9-.4.3-.3 1 .2.6.2.7-.1.6-.3 1.3.4.4.1.9.5.8.7 1 .4.7.8h-1l-.3.4-1 .3h-.7l-.6.4-.6-.1-.5-.5-.3.1-.3.7h-.3v.6l-1 .8-.5.3-.3.4-.8-.6-.7.8H232v1.4h-.3l-.4.7z",
					onClick: n[268] ||= (t) => e.onClick(t),
					onDblclick: n[269] ||= (t) => e.onDblClick(),
					onMouseenter: n[270] ||= (t) => e.onEnter(t),
					onMouseleave: n[271] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Croatia",
					class: "HR",
					style: k({ display: e.config.displayPath.HR }),
					d: "m528 319 .7 1.5 1 1.1-1.2 1.5-1.2-.9h-2l-2.4-.6-1.3.1-.6.8-1-.9-.6 1.7 1.4 1.8.6 1.2 1.3 1.5 1 .8 1.1 1.6 2.5 1.5-.3.6-2.6-1.4-1.7-1.4-2.5-1.1-2.4-2.9.6-.3-1.3-1.6v-1.4l-1.9-.6-.8 1.7-.9-1.3.1-1.4h.1l2 .1.5-.7 1 .7h1v-1l1-.5.3-1.6 2.2-1 .9.4 2 1.8 2.4.7z",
					onClick: n[272] ||= (t) => e.onClick(t),
					onDblclick: n[273] ||= (t) => e.onDblClick(),
					onMouseenter: n[274] ||= (t) => e.onEnter(t),
					onMouseleave: n[275] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Haiti",
					class: "HT",
					style: k({ display: e.config.displayPath.HT }),
					d: "M270 406.8h1.8l2.4.6.2 1.6-.2 1-.7.6.8.9-.1.8-1.9-.5-1.3.2-1.7-.2-1.3.5-1.5-1 .2-.9 2.6.5 2.1.2 1-.7-1.2-1.2V408l-1.8-.4z",
					onClick: n[276] ||= (t) => e.onClick(t),
					onDblclick: n[277] ||= (t) => e.onDblClick(),
					onMouseenter: n[278] ||= (t) => e.onEnter(t),
					onMouseleave: n[279] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Hungary",
					class: "HU",
					style: k({ display: e.config.displayPath.HU }),
					d: "m520.7 315.1 1-2.6-.6-1h1.5l.3-1.6 1.4 1 1 .5 2.4-.5.2-.9 1.1-.1 1.4-.6.3.2 1.3-.5.7-1 .9-.2 3 1.2.6-.4 1.5 1.1.2 1.2-1.7.8-1.3 2.8-1.7 2.8-2.2.8-1.8-.2-2.2 1-1 .6-2.3-.7-2.1-1.8-.9-.5-.6-1.3z",
					onClick: n[280] ||= (t) => e.onClick(t),
					onDblclick: n[281] ||= (t) => e.onDblClick(),
					onMouseenter: n[282] ||= (t) => e.onEnter(t),
					onMouseleave: n[283] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Indonesia",
					class: "ID",
					style: k({ display: e.config.displayPath.ID }),
					d: "m813.7 492-1.2.1-3.7-2 2.6-.5 1.5.8 1 .9zm10.4-.2-2.4.6-.3-.3.3-1 1.2-1.7 2.7-1.1.3.5v.9zm-18.3-5.8 1 .8 1.8-.3.7 1.2-3.3.6-2 .4h-1.4l1-1.7h1.5zm14 0-.3 1.6-4.3.8-3.7-.4v-1l2.2-.6 1.8.8 1.9-.2zm-40-3.7 5.4.3.6-1.2 5.2 1.4 1 1.8 4.2.5 3.5 1.7-3.2 1-3.1-1h-2.5l-3-.2-2.6-.5-3.2-1-2-.4-1.2.4-5.2-1.2-.4-1.2-2.6-.2 1.9-2.7 3.4.2 2.3 1 1.1.3zm73.2-1.6-1.4 2-.3-2.2.5-1 .6-1 .6.9zm-21-7.7-1 1-2-.6-.5-1.2h2.8zm9-1 1.1 2.1-2.4-1.1-2.3-.2-1.6.1h-2l.7-1.6 3.5-.1zm10.4-5.4.8 4.5 2.8 1.7 2.4-3 3.2-1.7h2.5l2.4 1 2 1 3 .5.1 9.1v9.2l-2.4-2.3-2.9-.6-.7.8-3.5.1 1.2-2.3 1.8-.8-.8-3-1.3-2.4-5.5-2.3-2.3-.3-4.2-2.6-.8 1.4-1 .3-.7-1v-1.3l-2.2-1.3 3-1h2l-.2-.7H846l-1.1-1.7-2.5-.5-1.2-1.4 3.8-.7 1.4-.9 4.5 1.2zm-25-7.2-2.2 2.8-2.2.5-2.7-.5-4.6.1-2.5.4-.4 2.1 2.5 2.5 1.5-1.2 5.3-1-.3 1.3-1.2-.4-1.2 1.6-2.5 1.1 2.7 3.6-.5 1 2.5 3.1v1.9l-1.5.8-1.1-1 1.3-2.3-2.7 1.1-.7-.8.3-1-2-1.7.2-2.7-1.8.9.2 3.2.1 4-1.8.4-1.2-.8.8-2.6-.4-2.7h-1.2l-.8-1.9 1.1-1.8.4-2.2 1.4-4.2.6-1.2 2.4-2 2.2.8 3.5.4 3.2-.2 2.8-2zm9.7.8-.2 2.5-1.4-.3-.4 1.7 1.1 1.5-.8.3-1.1-1.8-.8-3.5.5-2.3 1-1 .1 1.5 1.7.3zm-30.3-2 3.1 2.7-3.3.3-1 1.9.2 2.5-2.7 2-.1 2.7-1 4.3-.5-1-3.2 1.2-1-1.7-2-.1-1.5-1-3.3 1-1-1.3-1.9.2-2.3-.3-.4-3.8-1.4-.8-1.4-2.3-.4-2.5.4-2.6 1.6-1.8.5 1.9 2 1.5 1.7-.5 1.8.2 1.7-1.5 1.3-.2 2.6.8 2.3-.6 1.5-3.9 1-1 1-3.1h3.2l2.5.4-1.6 2.6 2 2.6zM772 479.8h-3.1l-2.4-2.3-3.6-2.2-1.2-1.7-2.1-2.3-1.4-2.1-2.2-3.9-2.4-2.3-.8-2.4-1-2.2-2.6-1.7-1.5-2.4-2-1.6-3-3-.2-1.5 1.8.1 4.3.6 2.5 2.7 2.2 1.9 1.5 1.2 2.7 3h2.8l2.4 1.9 1.6 2.3 2.1 1.3-1 2.3 1.5 1h1l.5 2 1 1.5 2 .3 1.4 1.7-.7 3.5z",
					onClick: n[284] ||= (t) => e.onClick(t),
					onDblclick: n[285] ||= (t) => e.onDblClick(),
					onMouseenter: n[286] ||= (t) => e.onEnter(t),
					onMouseleave: n[287] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Ireland",
					class: "IE",
					style: k({ display: e.config.displayPath.IE }),
					d: "m457.9 284.3.4 3.3-2 4.2-5 2.6-4-.6 2.3-4.8-1.5-4.8 3.8-3.7 2.1-2.3.6 2.6-.6 2.6h1.8z",
					onClick: n[288] ||= (t) => e.onClick(t),
					onDblclick: n[289] ||= (t) => e.onDblClick(),
					onMouseenter: n[290] ||= (t) => e.onEnter(t),
					onMouseleave: n[291] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Israel",
					class: "IL",
					style: k({ display: e.config.displayPath.IL }),
					d: "m575.4 366.8-.5 1-1-.4-.6 2.2.7.4-.7.4-.1.9 1.3-.5v1.3l-1.3 5.2-1.9-5.6.8-1-.1-.2.7-1.6.6-2.5.4-.8h1l.2-.6h.8v1.3z",
					onClick: n[292] ||= (t) => e.onClick(t),
					onDblclick: n[293] ||= (t) => e.onDblClick(),
					onMouseenter: n[294] ||= (t) => e.onEnter(t),
					onMouseleave: n[295] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "India",
					class: "IN",
					style: k({ display: e.config.displayPath.IN }),
					d: "m693.5 357.4 3 4-.3 2.8 1.1 1.7v1.7l-2-.5.7 3.7 2.8 2 3.9 2.3-1.8 1.4-1 3 2.6 1.2 2.7 1.6 3.6 1.8 3.9.4 1.6 1.6 2.2.3 3.3.7h2.4l.3-1.3-.4-2 .2-1.4 1.7-.6.3 2.5v.6l2.6 1.2 1.8-.5 2.3.2h2.3l.2-2-1.1-1 2.2-.4 2.6-2.4 3.2-2 2.4.8 2-1.4 1.3 2-1 1.4 3 .4.3 1.2-1 .6.2 2-2-.6-3.6 2.1v1.8l-1.5 2.6-.1 1.5-1.3 2.5-2.2-.7v3.2l-.7 1 .3 1.3-1.4.7-1.5-4.8h-.8l-.4 2-1.5-1.6.8-1.7 1.3-.2 1.3-2.6-1.6-.6-2.7.1-2.6-.4-.3-2.2-1.3-.1-2.2-1.4-1 2.1 2 1.7-1.7 1.1-.7 1.1 1.8.9-.5 1.8 1 2.3.4 2.5-.4 1h-2l-3.4.6.2 2.3-1.5 1.8-4 2-3.2 3.4-2.1 1.9-2.8 1.9v1.3l-1.4.7-2.5 1-1.3.2-.9 2.2.6 3.8.2 2.3-1.2 2.8v4.8l-1.5.1-1.3 2.2.9.9-2.6.8-1 2-1 .7-2.7-2.6-1.3-4-1-2.8-1-1.4-1.5-2.7-.7-3.6-.5-1.8-2.6-4-1.1-5.6-.9-3.8v-3.5l-.5-2.8-4 1.8-2-.4-3.7-3.6 1.3-1.1-.8-1.2-3.3-2.6 1.9-2h6.2l-.6-2.7-1.6-1.5-.3-2.4-1.8-1.4 3-3.3 3.3.2 3-3.3 1.7-3.2 2.7-3.3v-2.3l2.4-2-2.3-1.6-1-2.2-1-3 1.4-1.4 4.3.8 3-.5z",
					onClick: n[296] ||= (t) => e.onClick(t),
					onDblclick: n[297] ||= (t) => e.onDblClick(),
					onMouseenter: n[298] ||= (t) => e.onEnter(t),
					onMouseleave: n[299] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Iraq",
					class: "IQ",
					style: k({ display: e.config.displayPath.IQ }),
					d: "m602.6 355.8 1.8 1 .3 2-1.5 1.2-.6 2.6 2 3.2 3.4 1.8 1.4 2.5-.4 2.4h.9v1.7l1.5 1.7-1.6-.1-2-.3-2 3-5.2-.2-7.9-6.5-4.2-2.3-3.4-.9-1-4 6.1-3.5 1-4.1-.2-2.5 1.6-.9 1.4-2.2 1.2-.5 3.3.4 1 1 1.3-.7z",
					onClick: n[300] ||= (t) => e.onClick(t),
					onDblclick: n[301] ||= (t) => e.onDblClick(),
					onMouseenter: n[302] ||= (t) => e.onEnter(t),
					onMouseleave: n[303] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Iran",
					class: "IR",
					style: k({ display: e.config.displayPath.IR }),
					d: "m626.4 351.5 2.5-.6 2-2h1.9l1.2-.6 2 .3 3.1 1.8 2.2.4 3.2 3 2.1.2.3 2.9-1.2 4.3-.7 2.4 1.2.5-1.2 1.8 1 2.7.1 2 2.1.6.3 2.1-2.6 3 1.4 1.6 1.2 2 2.6 1.3.1 2.8 1.3.5.3 1.5-4 1.6-1.1 3.6-5.3-1-3-.7-3.2-.4-1.2-3.8-1.4-.6-2.1.6-2.8 1.5-3.5-1-2.8-2.4-2.7-1-1.9-3-2-4.2-1.5.5-1.8-1-1 1.2-1.6-1.7v-1.7h-1l.5-2.4-1.4-2.5-3.5-1.8-2-3.2.7-2.6 1.5-1.2-.3-2-1.8-1-1.8-4.2-1.5-2.8.5-1-.9-4.2 2-1 .4 1.3 1.4 1.7 2 .5 1-.1 3.3-2.7 1-.3.8 1.1-1 1.8 1.8 1.8.7-.1.9 2.6 2.7.7 2 1.8 3.9.6 4.4-1z",
					onClick: n[304] ||= (t) => e.onClick(t),
					onDblclick: n[305] ||= (t) => e.onDblClick(),
					onMouseenter: n[306] ||= (t) => e.onEnter(t),
					onMouseleave: n[307] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Iceland",
					class: "IS",
					style: k({ display: e.config.displayPath.IS }),
					d: "m434.6 212.4-.7 4.5 3.2 4.6-3.7 5-8 4.4-2.5 1.2-3.6-1-7.9-2 2.8-2.8-6.1-3.2 5-1.3-.2-2-5.8-1.6 1.8-4.4 4.3-1 4.4 4.6 4.2-3.7 3.6 2 4.5-3.8z",
					onClick: n[308] ||= (t) => e.onClick(t),
					onDblclick: n[309] ||= (t) => e.onDblClick(),
					onMouseenter: n[310] ||= (t) => e.onEnter(t),
					onMouseleave: n[311] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Italy",
					class: "IT",
					style: k({ display: e.config.displayPath.IT }),
					d: "m518.8 347.9-1 2.8.4 1-.6 1.8-2.2-1.3-1.4-.4-3.9-1.7.4-1.9 3.3.4 2.8-.4zM501 337l1.7 2.6-.4 4.8-1.3-.2-1.1 1.2-1.1-1-.1-4.4-.6-2 1.5.1zm8.8-21.6 4 1-.2 2 .6 1.7-2.2-.6-2.3 1.4.2 2-.4 1.1 1 2 2.6 2 1.4 3.2 3.1 3h2.2l.7.8-.8.8 2.5 1.3 2 1.1 2.5 2 .3.6-.5 1.3-1.6-1.7-2.4-.6-1.2 2.4 2 1.3-.3 2-1.2.1-1.5 3-1.2.4v-1l.6-2 .6-.7-1-2.1-1-1.8-1-.5-1-1.6-1.7-.6-1.2-1.5-2.1-.3-2.2-1.6-2.5-2.5-2-2.2-.8-3.8-1.4-.4-2.3-1.3-1.3.5-1.6 1.8-1.2.3.3-1.7-1.5-.5-.7-3 1-1.2-.9-1.5.2-1.2 1.2.9 1.3-.2 1.6-1.4.5.7 1.3-.1.6-1.7 2 .5 1.3-.6.3-1.7 1.7.6.3-.8 2.8-.7z",
					onClick: n[312] ||= (t) => e.onClick(t),
					onDblclick: n[313] ||= (t) => e.onDblClick(),
					onMouseenter: n[314] ||= (t) => e.onEnter(t),
					onMouseleave: n[315] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Jamaica",
					class: "JM",
					style: k({ display: e.config.displayPath.JM }),
					d: "m257.8 411 1.8.2 1.5.7.5.8h-2l-.8.6-1.6-.5-1.6-1 .3-.7 1.2-.2z",
					onClick: n[316] ||= (t) => e.onClick(t),
					onDblclick: n[317] ||= (t) => e.onDblClick(),
					onMouseenter: n[318] ||= (t) => e.onEnter(t),
					onMouseleave: n[319] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Jordan",
					class: "JO",
					style: k({ display: e.config.displayPath.JO }),
					d: "m575 367.9.4-1 3.1 1.2 5.5-3.5 1.1 4-.5.5-5.6 1.7 2.8 3.2-1 .6-.4 1-2.1.5-.7 1.2-1.2 1-3.1-.6-.1-.4 1.4-5.2-.1-1.3.4-1z",
					onClick: n[320] ||= (t) => e.onClick(t),
					onDblclick: n[321] ||= (t) => e.onDblClick(),
					onMouseenter: n[322] ||= (t) => e.onEnter(t),
					onMouseleave: n[323] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Japan",
					class: "JP",
					style: k({ display: e.config.displayPath.JP }),
					d: "m852.8 362 .3 1.2-1.6 2-1.1-1-1.4.7-.8 2-1.8-1v-1.6l1.5-2 1.6.4 1.2-1.4zm17.7-10.3-1 2.8.5 1.7-1.5 2.5-3.6 1.6-5 .2-4 3.8-1.8-1.3-.1-2.5-4.9.8-3.3 1.5-3.3.1 2.9 2.5-2 5.6-1.7 1.3-1.4-1.2.7-3-1.8-1-1.1-2.2 2.7-1 1.4-2.2 2.8-1.7 2.1-2.3 5.6-1 3 .6 3-6.1 1.8 1.6 4-3.5 1.7-1.4 1.7-4.3-.4-4.1 1.1-2.4 3-.6 1.6 5-.1 3-2.6 3.6zm8.3-25.9 2 .8 2-1.6.5 4.3-4.1 1-2.5 3.8-4.4-2.5-1.5 4-3.1.1-.4-3.7 1.4-3 3-.1.8-5.4.8-3.1 3.3 4.1z",
					onClick: n[324] ||= (t) => e.onClick(t),
					onDblclick: n[325] ||= (t) => e.onDblClick(),
					onMouseenter: n[326] ||= (t) => e.onEnter(t),
					onMouseleave: n[327] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Kenya",
					class: "KE",
					style: k({ display: e.config.displayPath.KE }),
					d: "m590.2 465.8 1.6 2.3-2 1-.6 1.3-1 .2-.5 2-.9 1-.5 1.9-1.1 1-4-2.9-.2-1.6-10.2-5.7-.5-.3v-3l.8-1 1.4-1.9 1-2-1.2-3.2-.4-1.4-1.3-2 1.7-1.6 2-1.9 1.4.5v1.6l1 .9h1.9l3.5 2.4h1.6l.6.2 1.9.3.8-1.2 2.6-1.2 1 1h2l-2.4 3.1z",
					onClick: n[328] ||= (t) => e.onClick(t),
					onDblclick: n[329] ||= (t) => e.onDblClick(),
					onMouseenter: n[330] ||= (t) => e.onEnter(t),
					onMouseleave: n[331] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Kyrgyzstan",
					class: "KG",
					style: k({ display: e.config.displayPath.KG }),
					d: "m674.2 333.1.6-1.7 1.9-.5 4.6 1.3.4-2.2 1.6-.8 4 1.6 1-.4h4.7l4.2.5 1.4 1.3 1.7.6-.4.8-4.4 2-1 1.6-3.6.4-1 2.3-3-.4-2 .7-2.7 1.7.4.9-.8.8-5.3.5-3.4-1.1-3 .2.2-2 3 .6 1-1.2 2.2.4 3.6-2.7-3.3-2-2 1-2.1-1.4 2.3-2.4z",
					onClick: n[332] ||= (t) => e.onClick(t),
					onDblclick: n[333] ||= (t) => e.onDblClick(),
					onMouseenter: n[334] ||= (t) => e.onEnter(t),
					onMouseleave: n[335] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Cambodia",
					class: "KH",
					style: k({ display: e.config.displayPath.KH }),
					d: "m765.4 433.6-1.1-1.5-1.4-3-.7-3.4 1.8-2.3 3.6-.6 2.7.4 2.3 1.1 1.3-2 2.4 1.1.7 2-.4 3.4-4.7 2.1 1.3 1.8-3 .2-2.4 1.1z",
					onClick: n[336] ||= (t) => e.onClick(t),
					onDblclick: n[337] ||= (t) => e.onDblClick(),
					onMouseenter: n[338] ||= (t) => e.onEnter(t),
					onMouseleave: n[339] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "North Korea",
					class: "KP",
					style: k({ display: e.config.displayPath.KP }),
					d: "m841.6 332.6.3.7-1-.2-1.2 1.2-.9 1.3.1 2.7-1.4.8-.5.6-1 1.1-2 .6-1.2 1v1.6l-.4.4 1.1.6 1.6 1.5-.4.9-1.2.2-2 .2-1 1.6-1.3-.1-.2.3-1.3-.7-.4.7-.8.3v-.7l-.8-.3-.8-.6.8-1.6.7-.4-.3-.6.7-2-.2-.6-1.6-.4-1.3-1 2.3-2.3 3-2 2-2.6 1.3 1.2 2.4.1-.4-2 4.3-1.6 1.1-2.1z",
					onClick: n[340] ||= (t) => e.onClick(t),
					onDblclick: n[341] ||= (t) => e.onDblClick(),
					onMouseenter: n[342] ||= (t) => e.onEnter(t),
					onMouseleave: n[343] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "South Korea",
					class: "KR",
					style: k({ display: e.config.displayPath.KR }),
					d: "m835.1 346.5 2.4 4.2.7 2.3v4l-1 1.8-2.5.7-2.3 1.4-2.5.3-.3-1.8.5-2.6-1.2-3.6 2-.6-1.9-3 .2-.3h1.3l1-1.5 2-.2 1.2-.2z",
					onClick: n[344] ||= (t) => e.onClick(t),
					onDblclick: n[345] ||= (t) => e.onDblClick(),
					onMouseenter: n[346] ||= (t) => e.onEnter(t),
					onMouseleave: n[347] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Kuwait",
					class: "KW",
					style: k({ display: e.config.displayPath.KW }),
					d: "m609.8 375.8.6 1.4-.3.7.9 2.4h-2l-.7-1.4-2.5-.3 2-3.1z",
					onClick: n[348] ||= (t) => e.onClick(t),
					onDblclick: n[349] ||= (t) => e.onDblClick(),
					onMouseenter: n[350] ||= (t) => e.onEnter(t),
					onMouseleave: n[351] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Kazakhstan",
					class: "KZ",
					style: k({ display: e.config.displayPath.KZ }),
					d: "m674.2 333.1-1.6.7-3.7 2.6-1.2 2.7h-1l-.8-1.8h-3.6l-.6-3.1h-1.3l.2-3.9-3.4-2.8-4.8.3-3.3.6-2.6-3.5-2.3-1.5-4.4-2.8-.5-.4-7.2 2.4v14.1l-1.4.2-2-3-1.8-1-3.2.8-1.2 1.2-.2-.9.7-1.6-.5-1.3-3.3-1.3-1.3-3.4-1.5-1-.1-1.3 2.7.4.1-3 2.4-.6 2.5.6.5-3.9-.5-2.5-2.8.2-2.4-1-3.3 1.8-2.6.9-1.4-.7.3-2.1-1.8-2.8-2 .2-2.5-2.9 1.7-3.2-.9-.9 2.3-4.7 2.9 2.5.3-3.2 5.8-4.8 4.4-.2 6.2 3.1 3.3 1.8 3-1.9h4.4l3.6 2.3.8-1.4 4 .2.6-2-4.5-3.2 2.7-2.2-.5-1.2 2.6-1.2-2-3.2 1.3-1.7L658 282l1.4-1.2 7-1.8 2.5-2 5 1 1 5 2.9-1.1 3.6 1.6-.3 2.6 2.7-.3 7-4.5-1 1.5 3.6 3.7 6.3 11.6 1.5-2.4 3.8 2.6 4-1.2 1.6.8 1.3 2.6 2 .8 1.2 1.9 3.6-.6 1.5 2.6-2.1 2.9-2.4.4-.1 4.1-1.6 1.9-5.5-1.4-2 7.3-1.5.9-5.5 1.6 2.5 6.7-2 1 .3 2.2-1.7-.6-1.4-1.3-4.2-.4-4.6-.1-1 .4-4-1.6-1.7.8-.4 2.2-4.6-1.3-1.9.6z",
					onClick: n[352] ||= (t) => e.onClick(t),
					onDblclick: n[353] ||= (t) => e.onDblClick(),
					onMouseenter: n[354] ||= (t) => e.onEnter(t),
					onMouseleave: n[355] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Lao People's Democratic Republic",
					class: "LA",
					style: k({ display: e.config.displayPath.LA }),
					d: "m770.3 423.2.9-1.3.1-2.4-2.3-2.6-.1-2.8-2.2-2.4-2-.2-.7 1h-1.6l-.8-.4-3 1.7v-2.6l.6-3.1-1.9-.1-.1-1.8-1.2-1 .6-1 2.4-2 .2.7 1.5.1-.4-3.4 1.4-.5 1.7 2.4 1.2 2.7h3.5l1 2.6-1.7.8-.8 1 3.3 1.8 2.4 3.5 1.7 2.6 2.1 2 .8 2-.6 3-2.4-1.1-1.3 2z",
					onClick: n[356] ||= (t) => e.onClick(t),
					onDblclick: n[357] ||= (t) => e.onDblClick(),
					onMouseenter: n[358] ||= (t) => e.onEnter(t),
					onMouseleave: n[359] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Lebanon",
					class: "LB",
					style: k({ display: e.config.displayPath.LB }),
					d: "M575.7 365h-.8l-.2.6h-1l1-2.8 1.4-2.4 1.4.1.4 1.3-1.5 1.3z",
					onClick: n[360] ||= (t) => e.onClick(t),
					onDblclick: n[361] ||= (t) => e.onDblClick(),
					onMouseenter: n[362] ||= (t) => e.onEnter(t),
					onMouseleave: n[363] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Sri Lanka",
					class: "LK",
					style: k({ display: e.config.displayPath.LK }),
					d: "m704.6 442.4-.5 2.9-1.1.8-2.5.6-1.3-2.2-.5-4 1.3-4.6 2 1.6 1.2 2z",
					onClick: n[364] ||= (t) => e.onClick(t),
					onDblclick: n[365] ||= (t) => e.onDblClick(),
					onMouseenter: n[366] ||= (t) => e.onEnter(t),
					onMouseleave: n[367] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Liberia",
					class: "LR",
					style: k({ display: e.config.displayPath.LR }),
					d: "M453.6 451.2h-.7L450 450l-2.5-2.1-2.4-1.6-2-1.8.8-.9.1-.8 1.3-1.5 1.3-1.3h.6l.7-.4 1.2 1.7-.2 1.2.5.6h.8l.6-1.2.8.1-.1.8.2 1.4-.6 1.2.8.8 1 .2 1.1 1.2.1 1-.3.4z",
					onClick: n[368] ||= (t) => e.onClick(t),
					onDblclick: n[369] ||= (t) => e.onDblClick(),
					onMouseenter: n[370] ||= (t) => e.onEnter(t),
					onMouseleave: n[371] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Lesotho",
					class: "LS",
					style: k({ display: e.config.displayPath.LS }),
					d: "m556.5 547.8 1 1-.9 1.5-.5 1-1.5.5-.5 1-1 .4-2.1-2.5 1.5-2 1.5-1.3 1.3-.6z",
					onClick: n[372] ||= (t) => e.onClick(t),
					onDblclick: n[373] ||= (t) => e.onDblClick(),
					onMouseenter: n[374] ||= (t) => e.onEnter(t),
					onMouseleave: n[375] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Lithuania",
					class: "LT",
					style: k({ display: e.config.displayPath.LT }),
					d: "m539 282-.2-1.1.3-1.4-1.3-.7-3-.9-.5-4.1 3.2-1.6 4.7.3 2.8-.5.4 1 1.4.4 2.7 2.4.3 2.2-2.3 1.6-.6 2.7-3 1.8H541l-.7-1.5z",
					onClick: n[376] ||= (t) => e.onClick(t),
					onDblclick: n[377] ||= (t) => e.onDblClick(),
					onMouseenter: n[378] ||= (t) => e.onEnter(t),
					onMouseleave: n[379] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Luxembourg",
					class: "LU",
					style: k({ display: e.config.displayPath.LU }),
					d: "m492.2 301.3.6 1-.2 1.9h-.8l-.6-.3.3-2.4z",
					onClick: n[380] ||= (t) => e.onClick(t),
					onDblclick: n[381] ||= (t) => e.onDblClick(),
					onMouseenter: n[382] ||= (t) => e.onEnter(t),
					onMouseleave: n[383] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Latvia",
					class: "LV",
					style: k({ display: e.config.displayPath.LV }),
					d: "M534.3 273.8v-3.9l1.5-3.2 2.6-1.8 2.2 3.9 2.3-.1.5-4 2.4-1 1.2.7 2.5 2h2.3l1.3 1.2.3 2.5.9 3-3 1.9-1.8.8-2.7-2.4-1.4-.3-.4-1-2.8.4-4.7-.3z",
					onClick: n[384] ||= (t) => e.onClick(t),
					onDblclick: n[385] ||= (t) => e.onDblClick(),
					onMouseenter: n[386] ||= (t) => e.onEnter(t),
					onMouseleave: n[387] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Libya",
					class: "LY",
					style: k({ display: e.config.displayPath.LY }),
					d: "m516.9 398-2 1-1.6-1.6-4.4-1.3-1.2-2-2.2-1.4-1.4.6-1-1.7v-1.3l-1.7-2.3 1.1-1.3-.2-2 .3-1.7-.2-1.4.5-2.6-.1-1.5-1-2.8 1.4-.8.3-1.3-.4-1.4 2-1.2.8-1.1 1.4-1 .2-2.5 3.3 1.2 1.1-.3 2.4.5 3.7 1.5 1.3 3 2.5.6 4 1.3 3 1.6 1.3-.8 1.4-1.5-.7-2.5 1-1.6 2-1.6 1.9-.4 3.8.7 1 1.4h1l.8.6 2.8.4.7 1-1 1.6.4 1.4-.7 2 .9 2.6v28.4H542v1.2l-11.2-5.7-11.2-5.7z",
					onClick: n[388] ||= (t) => e.onClick(t),
					onDblclick: n[389] ||= (t) => e.onDblClick(),
					onMouseenter: n[390] ||= (t) => e.onEnter(t),
					onMouseleave: n[391] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Morocco",
					class: "MA",
					style: k({ display: e.config.displayPath.MA }),
					d: "M451 383.1v-3.7l4.5-2.4 2.8-.5 2.3-.8 1-1.6 3.3-1.3.1-2.4 1.6-.3 1.3-1.2 3.7-.6.5-1.3-.7-.7-1-3.5-.2-2-1-2.2H468l-3-.8-2.6.2-1.7-1.5h-2l-1 2.1-1.8 3.5-2.1 1.4-2.8 1.6-1.8 2.2-.4 1.7-1 2.9.6 4-2.3 2.7-1.4.8-2.2 2.2-2.6.3-1.3 1.2h12.3-12.3z",
					onClick: n[392] ||= (t) => e.onClick(t),
					onDblclick: n[393] ||= (t) => e.onDblClick(),
					onMouseenter: n[394] ||= (t) => e.onEnter(t),
					onMouseleave: n[395] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Moldova",
					class: "MD",
					style: k({ display: e.config.displayPath.MD }),
					d: "m549.9 309.5.7-.7 1.8-.4 2 1.3 1.2.2 1.3 1.1-.2 1.4 1 .7.4 1.7 1 1-.2.6.5.5-.7.3-1.7-.2-.2-.5-.6.3.2.7-.8 1.3-.5 1.4-.7.4-.5-1.8.3-1.7v-1.8l-1.7-2.5-.9-1.7-.9-1.2z",
					onClick: n[396] ||= (t) => e.onClick(t),
					onDblclick: n[397] ||= (t) => e.onDblClick(),
					onMouseenter: n[398] ||= (t) => e.onEnter(t),
					onMouseleave: n[399] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Montenegro",
					class: "ME",
					style: k({ display: e.config.displayPath.ME }),
					d: "m530.8 332.2-.2-.7-1.2 1.9.2 1.2-.6-.3-.8-1.2-1.2-.8.3-.6.4-2.1 1-1 .4-.3.8.7.4.5 1 .4 1 .8-.2.3-.6.9z",
					onClick: n[400] ||= (t) => e.onClick(t),
					onDblclick: n[401] ||= (t) => e.onDblClick(),
					onMouseenter: n[402] ||= (t) => e.onEnter(t),
					onMouseleave: n[403] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Madagascar",
					class: "MG",
					style: k({ display: e.config.displayPath.MG }),
					d: "m614.2 498.4.7 1.2.7 1.9.5 3.5.7 1.3-.3 1.4-.5.9-1-1.7-.5.8.6 2.2-.3 1.2-.8.7-.1 2.4-1.1 3.5-1.4 4-1.8 5.7-1 4.2-1.3 3.6-2.3.7-2.4 1.3-1.6-.8-2.3-1-.7-1.7-.2-2.7-1-2.4-.3-2.2.5-2.1 1.3-.6v-1l1.4-2.2.2-1.9-.6-1.4-.6-1.9-.2-2.6 1-1.7.4-1.8 1.4-.1 1.5-.6 1-.6h1.3l1.6-1.6 2.3-1.8.9-1.5-.4-1.2 1.2.4 1.5-2v-1.7l1-1.3z",
					onClick: n[404] ||= (t) => e.onClick(t),
					onDblclick: n[405] ||= (t) => e.onDblClick(),
					onMouseenter: n[406] ||= (t) => e.onEnter(t),
					onMouseleave: n[407] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Macedonia",
					class: "MK",
					style: k({ display: e.config.displayPath.MK }),
					d: "M533 334.7h.3l.2-.8 1.6-.6.6-.1 1-.2h1.3l1.4 1.1.2 2.5-.5.1-.5.7-1.5-.1-1 .8-2 .3-1-.9-.5-1.6z",
					onClick: n[408] ||= (t) => e.onClick(t),
					onDblclick: n[409] ||= (t) => e.onDblClick(),
					onMouseenter: n[410] ||= (t) => e.onEnter(t),
					onMouseleave: n[411] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Mali",
					class: "ML",
					style: k({ display: e.config.displayPath.ML }),
					d: "m441.1 422.2 1-.5.4-1.7h1l1.9.7 1.6-.5 1 .2.5-.7h11.2l.7-2-.5-.4-1.4-12.7-1.3-13 4.3-.1 9.4 6.6 9.5 6.6.6 1.4 1.8.8 1.3.5v1.9l3.1-.3v6.8l-1.5 1.9-.2 1.8-2.5.4-3.9.3-1 1-1.8.1h-1.8l-.7-.5-1.5.4-2.7 1.2-.5.9-2.2 1.3-.3.7-1.2.6-1.4-.4-.7.7-.5 2-2.2 2.3v1l-.7 1.2.2 1.6-1.2.5-.6.3-.4-1.2-.9.3h-.4l-.6.8h-2l-.8-.4-.4.2-.8-.8.1-.9-.3-.3-.6.3v-1l.7-.7-1.2-1.1-.3-.8-.6-.7h-.6l-.7.4-.9.3-.7.7-1.2-.3-.8-.7h-.5l-.7.3h-.5l-.1-1 .1-1-.2-1-1-.9-.6-1.6z",
					onClick: n[412] ||= (t) => e.onClick(t),
					onDblclick: n[413] ||= (t) => e.onDblClick(),
					onMouseenter: n[414] ||= (t) => e.onEnter(t),
					onMouseleave: n[415] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Myanmar",
					class: "MM",
					style: k({ display: e.config.displayPath.MM }),
					d: "m754.4 406-1.7 1.2-2 .2-1.2 3.2-1.2.5 1.3 2.6 1.8 2 1.2 2-1 2.5-1 .6.6 1.4 2 2.3.2 1.6v1.3l1 2.6-1.5 2.7-1.3 2.9-.3-2.1.9-2.2-1-1.7.3-3-1.2-1.6-.9-3.4-.5-3.7-1.2-2.4-1.9 1.5-3.1 2-1.6-.2-1.8-.7 1-3.6-.6-2.7-2.2-3.4.4-1-1.7-.5-2-2.4-.1-2.4 1 .5v-2.2l1.4-.7-.3-1.3.6-1 .1-3.2 2.2.7 1.3-2.5.1-1.5 1.5-2.6v-1.8l3.6-2.1 2 .5-.2-1.9 1-.6-.3-1.2 1.7-.2 1 1.9 1.1.7.1 2.4v2.6l-2.7 2.5-.4 3.7 3-.5.6 2.8 1.8.6-.8 2.5 2 1.1 1.3.6 2-1 .2 1.3-2.4 2-.6 1z",
					onClick: n[416] ||= (t) => e.onClick(t),
					onDblclick: n[417] ||= (t) => e.onDblClick(),
					onMouseenter: n[418] ||= (t) => e.onEnter(t),
					onMouseleave: n[419] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Mongolia",
					class: "MN",
					style: k({ display: e.config.displayPath.MN }),
					d: "m721.3 304.9 3-.8 5.3-3.7 4.3-2 2.4 1.3h3l1.8 2 2.8.2 4 1.1 2.8-3-1.2-2.6 3-4.7 3 2 2.6.4 3.3 1.2.6 3.3 4 1.8 2.6-.8 3.5-.5 2.9.5 2.7 2.1 1.7 2.2h2.6l3.5.7 2.6-1 3.7-.8 4.1-3 1.7.4 1.5 1.5 3.3-.4-1.4 3.3-2 4.2.8 1.7 1.6-.5 2.7.6 2.2-1.5 2.2 1.3 2.6 3-.3 1.4-2.2-.5-4.1.5-2 1.2-2 2.7-4.3 1.5-2.8 2.1-2.9-.8-1.6-.4-1.4 2.6.9 1.5.4 1.3-2 1.3-2 2-3.2 1.3-4.2.2-4.6 1.3-3.2 2-1.3-1.1H765l-4.1-2.3-2.8-.6-3.7.5-5.8-.8h-3.1l-1.6-2.2-1.3-3.6-1.7-.4-3.4-2.5-3.8-.5-3.4-.7-1-1.7 1.1-4.7-2-3.4-4-1.5-2.3-2.2z",
					onClick: n[420] ||= (t) => e.onClick(t),
					onDblclick: n[421] ||= (t) => e.onDblClick(),
					onMouseenter: n[422] ||= (t) => e.onEnter(t),
					onMouseleave: n[423] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Mauritania",
					class: "MR",
					style: k({ display: e.config.displayPath.MR }),
					d: "m441.1 422.2-1.8-2-1.7-2-1.9-.9-1.3-.8h-1.6l-1.4.6-1.3-.2-1 1-.2-1.6.7-1.5.4-2.7-.3-3-.4-1.4.3-1.5-.7-1.4-1.5-1.3.6-1h11l-.5-4.3.7-1.6 2.6-.2-.1-7.9 9.2.2V384l10.6 7.5h-4.3l1.3 13.1 1.4 12.7.5.3-.7 2-11.2.1-.4.7-1.1-.2-1.6.5-2-.8-.9.1-.4 1.7z",
					onClick: n[424] ||= (t) => e.onClick(t),
					onDblclick: n[425] ||= (t) => e.onDblClick(),
					onMouseenter: n[426] ||= (t) => e.onEnter(t),
					onMouseleave: n[427] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Malawi",
					class: "MW",
					style: k({ display: e.config.displayPath.MW }),
					d: "m572.2 495.7-.8 2.2.8 3.7h1l1 .8 1.1 2.1.3 3.8-1.3.6-.8 2-1.9-1.8-.1-2 .5-1.4-.1-1.2-1.1-.7-.8.3-1.6-1.4-1.5-.7.9-2.7.8-1-.5-2.4.6-2.3.4-.7-.7-2.4-1.3-1.3 2.8.5.5.8 1 1.3z",
					onClick: n[428] ||= (t) => e.onClick(t),
					onDblclick: n[429] ||= (t) => e.onDblClick(),
					onMouseenter: n[430] ||= (t) => e.onEnter(t),
					onMouseleave: n[431] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Mexico",
					class: "MX",
					style: k({ display: e.config.displayPath.MX }),
					d: "m202.9 388.7-1.1 2.7-.5 2.2-.2 4.1-.3 1.5.5 1.6.9 1.5.6 2.3 1.8 2.2.7 1.7 1 1.5 3 .8 1.2 1.2 2.5-.9 2-.2 2.2-.6 1.8-.5 1.7-1.2.7-1.7.2-2.5.5-.9 2-.8 2.9-.6h2.5l1.7-.2.6.6v1.5l-1.6 1.7-.6 1.9.5.5-.4 1.2-.7 2.3-.7-.7H227l-1 1.8-.5-.3-.3.1v.5H220v1.6h-1.3l1 1 1.1.6.3.7.5.1-.1 1H218l-1.3 2.4.4.5-.4.7v.8l-3.2-3-1.5-1-2.2-.8-1.6.3-2.3 1-1.4.3-2-.7-2-.6-2.7-1.3-2-.4-3.3-1.4-2.3-1.4-.7-.8-1.6-.1-2.8-1-1.2-1.3-3-1.7-1.4-1.8-.7-1.5 1-.3-.4-.8.7-.8v-1l-1-1.4-.2-1.2-1-1.5-2.4-3-2.8-2.4-1.4-2-2.4-1.2-.5-.7.4-2-1.4-.7-1.7-1.5-.7-2.2-1.5-.3-1.6-1.6-1.3-1.6-.1-1-1.6-2.4-1-2.5.1-1.2-2-1.3-1 .1-1.6-.9-.4 1.4.4 1.5.3 2.4 1 1.4 2 2.2.5.7.5.3.3 1h.5l.6 2 .8.9.6 1 1.8 1.7 1 2.8.8 1.4.7 1.4.2 1.7h1.3l1.2 1.4 1 1.4v.6l-1.3 1h-.5l-.7-1.8-1.8-1.7-2-1.5-1.5-.8.1-2.2-.4-1.7-1.4-1-1.9-1.4-.4.4-.7-.8-1.7-.7-1.6-1.9.2-.2 1.1.2 1-1.2.2-1.4-2.2-2.3-1.6-.9-1-2-1.1-2.1-1.3-2.6-1.2-3 3.2-.2 3.6-.4-.3.6 4.3 1.6 6.4 2.4h7.8V370h4.8l1 1.1 1.5 1 1.6 1.5 1 1.7.7 1.8 1.4 1 2.3.9 1.8-2.6h2.3l2 1.3 1.4 2.2 1 1.8 1.6 1.8.6 2.2.8 1.5 2.2 1 2 .6z",
					onClick: n[432] ||= (t) => e.onClick(t),
					onDblclick: n[433] ||= (t) => e.onDblClick(),
					onMouseenter: n[434] ||= (t) => e.onEnter(t),
					onMouseleave: n[435] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Malaysia",
					class: "MY",
					style: k({ display: e.config.displayPath.MY }),
					d: "m758.7 446 .2 1.5 1.8-.3 1-1.2.6.3 1.6 1.7 1.2 1.9.2 1.8-.3 1.3.2 1 .3 1.6 1 .8 1 2.4v1l-2 .2-2.6-2-3.4-2.3-.3-1.4-1.6-1.9-.4-2.3-1-1.5.3-2-.6-1.3.5-.5zm49.1 4.9-2 1-2.4-.5H800l-1 3.1-1 1-1.5 3.9-2.3.6-2.6-.8-1.3.2-1.7 1.5-1.8-.2-1.8.5-1.9-1.5-.5-1.9 2 1 2.3-.6.5-2.3 1.2-.5 3.4-.6 2-2.3 1.4-1.7 1.3 1.4.5-1 1.4.2.1-1.8.2-1.4 2.1-2 1.4-2.1h1.2l1.4 1.4.1 1.2 1.9.8 2.3.8-.2 1.1-1.9.2z",
					onClick: n[436] ||= (t) => e.onClick(t),
					onDblclick: n[437] ||= (t) => e.onDblClick(),
					onMouseenter: n[438] ||= (t) => e.onEnter(t),
					onMouseleave: n[439] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Mozambique",
					class: "MZ",
					style: k({ display: e.config.displayPath.MZ }),
					d: "m572.2 495.7 2-.2 3.4.8.8-.4h2l1-1 1.6.1 3-1 2.3-1.7.5 1.3-.2 2.8.4 2.5v4.5l.6 1.4-.9 2-1 2-1.8 1.8-2.6 1.1-3.1 1.5-3.2 3.1-1.1.6-2 2-1.1.7-.2 2.1 1.3 2.3.5 1.8v.9l.6-.2-.1 3-.5 1.4.7.5-.4 1.3-1.2 1-2.3 1.1-3.4 1.7-1.2 1.1.2 1.3.7.2-.2 1.7h-2.1l-.3-1.4-.4-1.4-.2-1.1.5-3.5-.7-2.1-1.4-4.3 3-3.4.7-2.2.4-.2.3-1.8-.4-.9.1-2.1.6-2v-3.8l-1.5-1-1.3-.1-.6-.7-1.3-.7-2.4.1-.2-1-.2-2.1 8.5-2.4 1.6 1.4.8-.3 1 .7.2 1.2-.5 1.3.1 2 1.9 1.9.8-2 1.3-.6-.3-3.8-1.2-2-1-1h-1l-.7-3.6z",
					onClick: n[440] ||= (t) => e.onClick(t),
					onDblclick: n[441] ||= (t) => e.onDblClick(),
					onMouseenter: n[442] ||= (t) => e.onEnter(t),
					onMouseleave: n[443] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Namibia",
					class: "NA",
					style: k({ display: e.config.displayPath.NA }),
					d: "m521 546.5-2-2.4-1.1-2.2-.6-3-.7-2.3-1-4.7v-3.7l-.4-1.6-1-1.3-1.5-2.4-1.5-3.6-.6-1.8-2.3-3-.2-2.2 1.4-.5 1.7-.5h1.8l1.7 1.4.4-.2 11.4-.1 1.9 1.4 6.8.4 5.1-1.2 2.3-.7 1.9.2 1 .6v.3l-1.5.6h-.9l-1.7 1.2-1.1-1.2-4.3 1-2.1.1-.1 10.6H531v20.5l-2.5 1.6-1.5.2-1.7-.6-1.3-.2-.5-1.4-1-.8z",
					onClick: n[444] ||= (t) => e.onClick(t),
					onDblclick: n[445] ||= (t) => e.onDblClick(),
					onMouseenter: n[446] ||= (t) => e.onEnter(t),
					onMouseleave: n[447] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "New Caledonia",
					class: "NC",
					style: k({ display: e.config.displayPath.NC }),
					d: "m940 523.5 2.4 1.8 1.4 1.4-1 .8-1.6-.9-2-1.3-1.8-1.6-1.8-2.1-.4-1h1.2l1.6 1 1.2 1z",
					onClick: n[448] ||= (t) => e.onClick(t),
					onDblclick: n[449] ||= (t) => e.onDblClick(),
					onMouseenter: n[450] ||= (t) => e.onEnter(t),
					onMouseleave: n[451] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Niger",
					class: "NE",
					style: k({ display: e.config.displayPath.NE }),
					d: "M481.3 429.9v-2l-3.2-.6v-1.4l-1.6-1.9-.4-1.3.2-1.4h1.8l1-1.1 3.9-.3 2.4-.4.3-1.8 1.5-2V409l4-1.3 8-5.9 9.7-5.7 4.4 1.3 1.6 1.7 2-1.2.7 4.7 1 .8v1l1.2 1-.6 1.2-1 6-.2 3.8-3.6 2.7-1.2 3.8 1.2 1.1v1.9h1.8l-.3 1.4-.8.1v1h-.6l-1.9-3.1-.7-.2-2.1 1.6-2.2-.8-1.5-.1-.8.3h-1.7l-1.6 1.2h-1.5l-3.4-1.4-1.3.7h-1.4l-1-1.2-2.9-1-3 .3-.7.6-.4 1.7-.8 1.1-.2 2.6-2.2-1.7h-1z",
					onClick: n[452] ||= (t) => e.onClick(t),
					onDblclick: n[453] ||= (t) => e.onDblClick(),
					onMouseenter: n[454] ||= (t) => e.onEnter(t),
					onMouseleave: n[455] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Nigeria",
					class: "NG",
					style: k({ display: e.config.displayPath.NG }),
					d: "m499 450-2.8 1h-1l-1.2.6-2.2-.1-1.5-1.7-1-2-2-2-2 .1h-2.5l.2-4.5-.1-1.8.5-1.8.9-.8 1.3-1.8-.2-.7.5-1.2-.6-1.7v-1l.3-2.5.8-1.1.4-1.7.7-.6 3-.3 2.8 1 1 1.1h1.5l1.3-.6 3.4 1.5 1.5-.1 1.6-1.2h1.7l.8-.4 1.5.2 2.1.9 2.2-1.7.7.2 1.9 3.1h.5l1.1 1-.3.6-.1 1-2.4 2.1-.7 1.8-.4 1.5-.6.6-.6 2-1.5 1.2-.4 1.4-.7 1.1-.2 1.2-2 1-1.5-1.2h-1l-1.7 1.7h-.9l-1.3 2.7z",
					onClick: n[456] ||= (t) => e.onClick(t),
					onDblclick: n[457] ||= (t) => e.onDblClick(),
					onMouseenter: n[458] ||= (t) => e.onEnter(t),
					onMouseleave: n[459] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Nicaragua",
					class: "NI",
					style: k({ display: e.config.displayPath.NI }),
					d: "m235 432.3-1-.9-1.3-1.1-.7-1-1.2-.9-1.4-1.3.3-.4.5.4.2-.2.9-.1.3-.7h.5l-.1-1.4h1.3l.5-.8.9.6.3-.4.5-.3 1-.8v-.6h.3l.3-.7h.3l.5.4.6.1.6-.4h.7l1-.3.4-.4h1l-.3.3-.2.7.3 1-.6 1-.3 1.1-.1 1.3.1.7.1 1.3-.4.3-.3 1.2.2.8-.6.7.2.8.4.4-.7.6-.8-.2-.5-.5-.9-.3-.6.4-1.8-.8z",
					onClick: n[460] ||= (t) => e.onClick(t),
					onDblclick: n[461] ||= (t) => e.onDblClick(),
					onMouseenter: n[462] ||= (t) => e.onEnter(t),
					onMouseleave: n[463] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Netherlands",
					class: "NL",
					style: k({ display: e.config.displayPath.NL }),
					d: "m492.3 286 2.3.1.5 1.6-.7 4.2-.7 1.7H492l.5 4.7-1.5-1-1.8-2-2.6 1-2-.4 1.4-1.2 2.4-6.8z",
					onClick: n[464] ||= (t) => e.onClick(t),
					onDblclick: n[465] ||= (t) => e.onDblClick(),
					onMouseenter: n[466] ||= (t) => e.onEnter(t),
					onMouseleave: n[467] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Norway",
					class: "NO",
					style: k({ display: e.config.displayPath.NO }),
					d: "m554.2 175.6 8.8 6.3-3.6 2.2 3 5-4.7 3.3-2.3.7 1.2-5.6-3.6-3.2-4.3 2.7-1.4 5.9-2.7 3.4-3-1.8-3.6.3-3.2-4.1-1.6 2-1.8.4-.4 5-5.3-1.1-.7 4.2h-2.7l-1.9 5.2-2.8 7.9-4.3 9.5 1 2.2-1 2.5h-2.7l-1.9 5.8.2 8 1.8 3-1 6.8-2.3 3.8-1.2 3.1-1.9-3.3-5.5 6.3-3.8 1.2-3.8-2.7-1-5.9-1-13.2 2.6-3.9 7.4-5.2 5.6-6.6 5.1-9.3 6.8-13.7 4.7-5.7 7.7-9.9 6.1-3.6 4.6.5 4.3-7 5.1.3z",
					onClick: n[468] ||= (t) => e.onClick(t),
					onDblclick: n[469] ||= (t) => e.onDblClick(),
					onMouseenter: n[470] ||= (t) => e.onEnter(t),
					onMouseleave: n[471] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Nepal",
					class: "NP",
					style: k({ display: e.config.displayPath.NP }),
					d: "m722.3 382.5-.2 1.3.4 2-.3 1.2h-2.4l-3.3-.6-2.2-.3-1.6-1.6-3.9-.4-3.6-1.8-2.7-1.6-2.7-1.2 1.1-3 1.8-1.4 1.1-.8 2.3 1 2.8 2.1 1.6.5 1 1.5 2.1.6 2.3 1.4 3.2.7z",
					onClick: n[472] ||= (t) => e.onClick(t),
					onDblclick: n[473] ||= (t) => e.onDblClick(),
					onMouseenter: n[474] ||= (t) => e.onEnter(t),
					onMouseleave: n[475] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "New Zealand",
					class: "NZ",
					style: k({ display: e.config.displayPath.NZ }),
					d: "m960.4 588.6.6 1.6 2-1.5.8 1.5v1.6l-1 1.7-1.8 2.8-1.5 1.6 1 1.8h-2.1l-2.4 1.5-.8 2.6-1.6 4-2.2 1.9-1.4 1.1h-2.5l-1.9-1.4-3-.3-.5-1.5 1.5-3 3.6-3.8 1.8-.7 2-1.5 2.4-2 1.7-2 1.2-2.8 1-1 .5-2 2-1.7zm4.4-17 2 3.7.1-2.4 1.3 1 .4 2.6 2.3 1.2 1.9.2 1.6-1.3 1.4.4-.7 3.1-.8 2.1H972l-.7 1 .2 1.6-.4.7-1 2-1.4 2.5-2.2 1.5-.5-1-1.2-.5 1.7-3-1-2-3-1.5.1-1.3 2-1.3.5-2.7-.1-2.3-1.2-2.4.1-.6-1.3-1.4-2.2-3-1.2-2.4 1-.3 1.6 1.9 2.2.9z",
					onClick: n[476] ||= (t) => e.onClick(t),
					onDblclick: n[477] ||= (t) => e.onDblClick(),
					onMouseenter: n[478] ||= (t) => e.onEnter(t),
					onMouseleave: n[479] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Oman",
					class: "OM",
					style: k({ display: e.config.displayPath.OM }),
					d: "m640.3 403.2-1 2-1.3-.1-.6.7-.5 1.5.4 2-.3.3h-1.3l-1.7 1.1-.3 1.4-.6.7h-1.8l-1 .7v1.2l-1.4.8-1.6-.3-1.8 1-1.3.1-1-2-2.2-4.8 8.5-3 1.8-6-1.3-2.1.1-1.2.8-1.3v-1.2l1.3-.6-.5-.5.2-2h1.5l1.2 2.1 1.6 1.1 2 .4 1.7.6 1.3 1.7.7 1 1 .4v.7l-1 1.8-.4.8zm-7-14.6-.3.6-.5-1 .8-1.1.3.2z",
					onClick: n[480] ||= (t) => e.onClick(t),
					onDblclick: n[481] ||= (t) => e.onDblClick(),
					onMouseenter: n[482] ||= (t) => e.onEnter(t),
					onMouseleave: n[483] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Panama",
					class: "PA",
					style: k({ display: e.config.displayPath.PA }),
					d: "m256.9 443.2-1-.8-.6-1.5.7-.8-.7-.2-.5-.9-1.4-.8-1.2.2-.6 1-1.1.7h-.6l-.3.7 1.3 1.5-.7.4-.4.4-1.3.1-.5-1.7-.4.5-1-.1-.5-1.2-1.1-.2-.8-.3H243v.6l-.4-.4.2-.6.2-.5-.1-.5.4-.4-.6-.4v-1.1l1.1-.3 1 1v.6l1 .2.3-.3.8.7 1.4-.2 1.2-.7 1.7-.6 1-.8 1.5.1-.1.3 1.6.1 1.2.5 1 .9 1 .7-.4.5.7 1.6-.6.9-.9-.2z",
					onClick: n[484] ||= (t) => e.onClick(t),
					onDblclick: n[485] ||= (t) => e.onDblClick(),
					onMouseenter: n[486] ||= (t) => e.onEnter(t),
					onMouseleave: n[487] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Peru",
					class: "PE",
					style: k({ display: e.config.displayPath.PE }),
					d: "m280.1 513.1-.7 1.5-1.5.8-2.8-1.7-.2-1.2-5.6-3-5-3-2.2-1.9-1.1-2.3.4-.9-2.3-3.7-2.8-5.2-2.7-5.7-1.1-1.3-.9-2-2.2-1.9-2-1 1-1.3-1.4-2.7.9-2 2.2-1.7.3 1.1-.8.7.1 1 1.2-.2 1.1.3 1.2 1.4 1.6-1.1.5-2 1.7-2.4 3.4-1 3-3 1-1.8-.5-2 .8-.4 1.8 1.4 1 1.3 1.2.7 1.7 3 2 .3 1.6-.8 1 .5 1.7-.2 2.2 1.3-1.9 2.8h.9l1.4 1.6-2.6-.2-.3.5-2.3.5-3.2 1.9-.2 1.3-.7 1 .2 1.5-1.7.8v1.2l-.7.5 1.2 2.5 1.5 1.8-.6 1.2 1.9.1 1 1.5 2.5.1 2.3-1.7-.2 4.3 1.3.4 1.6-.5 2.4 4.6-.6 1-.1 2v2.4l-1.2 1.4.5 1-.6 1 1.2 2.5z",
					onClick: n[488] ||= (t) => e.onClick(t),
					onDblclick: n[489] ||= (t) => e.onDblClick(),
					onMouseenter: n[490] ||= (t) => e.onEnter(t),
					onMouseleave: n[491] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Papua New Guinea",
					class: "PG",
					style: k({ display: e.config.displayPath.PG }),
					d: "m912.3 482.4-.8.3-1.2-1-1.2-1.9-.6-2 .4-.4.3.9.8.6 1.4 1.8 1.3 1zm-11-3.7-1.4.2-.4.8-1.6.7-1.4.6H895l-2.3-.8-1.6-.8.2-.8 2.6.4 1.5-.2.4-1.4h.4l.3 1.4 1.6-.2.8-1 1.5-1-.3-1.6h1.7l.6.4v1.6zM888 484l2.5 1.9 1.8 3 1.6-.1-.1 1.2 2.2.5-.9.5 3 1.2-.3.8-1.9.2-.7-.7-2.4-.3-2.8-.5-2.2-1.8-1.6-1.5-1.4-2.5-3.7-1.2-2.4.8-1.7 1 .4 2-2.2 1-1.6-.5-2.9-.1v-9.2l-.1-9 4.9 1.9 5.2 1.6 1.9 1.4 1.5 1.4.5 1.6 4.6 1.8.7 1.5-2.6.3zm16.6-8-.9.7-.5-1.7-.6-1-1.3-1-1.6-1.2-2-.8.8-.6 1.5.7 1 .6 1.1.7 1.1 1.2 1 .9z",
					onClick: n[492] ||= (t) => e.onClick(t),
					onDblclick: n[493] ||= (t) => e.onDblClick(),
					onMouseenter: n[494] ||= (t) => e.onEnter(t),
					onMouseleave: n[495] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Philippines",
					class: "PH",
					style: k({ display: e.config.displayPath.PH }),
					d: "m829.6 439.9.3 1.8.2 1.6-1 2.6-1-2.9-1.3 1.4.9 2.1-.8 1.3-3.3-1.6-.8-2 .8-1.4-1.7-1.3-1 1.2-1.2-.1-2.1 1.5-.5-.8 1.1-2.4 1.8-.8 1.5-1 1 1.3 2.1-.8.5-1.3h2l-.2-2.2 2.3 1.3.2 1.4zm-6.7-5.3-1 1-1 1.7-.8.9-1.7-2 .6-.7.7-.8.3-1.8 1.5-.2-.4 2 2-2.8zm-15.4 2.7-3.7 2.7 1.4-2 2-1.7 1.7-2 1.4-2.8.5 2.3-1.8 1.6zm9.5-7.3 1.7.9h1.8v1.2l-1.4 1.2-1.8.8v-1.3l.1-1.4zm10.1-.7.8 3.1-2.1-.7v1l.7 1.7-1.3.6-.1-2-.9-.1-.4-1.7 1.6.2v-1.1l-1.7-2.2h2.7zm-11.1-2.6-.7 2.4-1.2-1.4-1.5-2.2 2.4.1zm-.6-15.8 1.7.9 1-.8.2.8-.5 1.2 1 2-.8 2.5-1.6 1-.5 2.3.7 2.3 1.4.3 1.3-.4 3.5 1.6-.3 1.6 1 .7-.4 1.3-2.1-1.4-1-1.5-.8 1-1.8-1.7-2.5.4-1.4-.6.1-1.2.9-.7-.8-.7-.4 1-1.4-1.6-.4-1.2-.1-2.8 1.1 1 .3-4.6 1-2.7z",
					onClick: n[496] ||= (t) => e.onClick(t),
					onDblclick: n[497] ||= (t) => e.onDblClick(),
					onMouseenter: n[498] ||= (t) => e.onEnter(t),
					onMouseleave: n[499] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Pakistan",
					class: "PK",
					style: k({ display: e.config.displayPath.PK }),
					d: "m686 351.8 2 1.6.9 2.7 4.6 1.3-2.7 2.9-3.1.5-4.3-.8-1.4 1.4 1 3 1 2.2 2.3 1.7-2.4 1.9v2.3l-2.7 3.3-1.8 3.2-2.9 3.3-3.2-.2-3.1 3.3 1.8 1.4.3 2.4 1.6 1.5.6 2.7h-6.2l-1.9 2-2-.8-.9-2.2-2.1-2.3-5.2.6h-4.6l-4 .5 1.1-3.6 4-1.6-.2-1.5-1.3-.5v-2.8l-2.7-1.4-1.2-1.9-1.4-1.7 4.7 1.7 2.8-.5 1.7.4.6-.7 2 .3 3.6-1.4v-2.7l1.6-1.9h2.1l.3-.9 2.2-.4 1 .3 1.1-1-.1-1.9 1.1-2 1.8-.8-1-2.3 2.6.2.8-1.3-.1-1.3 1.3-1.4-.3-1.7-.6-1.5 1.6-1.5 3-.7 3.2-.4 1.5-.7z",
					onClick: n[500] ||= (t) => e.onClick(t),
					onDblclick: n[501] ||= (t) => e.onDblClick(),
					onMouseenter: n[502] ||= (t) => e.onEnter(t),
					onMouseleave: n[503] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Poland",
					class: "PL",
					style: k({ display: e.config.displayPath.PL }),
					d: "m517.4 297-1.2-2.9.2-1.6-.7-2.4-1-1.7.8-1.2-.7-2.4 2-1.4 4.3-2.2 3.6-1.6 2.8.8.2 1.2h2.7l3.4.6 5.2-.1 1.4.5.7 1.5.1 2 .8 1.8v1.9l-1.7 1 .9 2v2l1.4 4-.3 1.2-1.4.5-2.5 3.6.7 2-.6-.3-2.7-1.7-2 .6-1.3-.4-1.7 1-1.4-1.6-1.1.6-.2-.3-1.3-2.1-2-.3-.3-1.3-2-.5-.4 1.1-1.5-.9.2-1.2-2.1-.4z",
					onClick: n[504] ||= (t) => e.onClick(t),
					onDblclick: n[505] ||= (t) => e.onDblClick(),
					onMouseenter: n[506] ||= (t) => e.onEnter(t),
					onMouseleave: n[507] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Puerto Rico",
					class: "PR",
					style: k({ display: e.config.displayPath.PR }),
					d: "m289.4 410.9 1.4.3.6.5-.8.8H287l-.2-1.2.4-.4z",
					onClick: n[508] ||= (t) => e.onClick(t),
					onDblclick: n[509] ||= (t) => e.onDblClick(),
					onMouseenter: n[510] ||= (t) => e.onEnter(t),
					onMouseleave: n[511] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Palestine",
					class: "PS",
					style: k({ display: e.config.displayPath.PS }),
					d: "M575 367.9v2l-.5 1-1.3.4.1-.9.7-.4-.7-.4.6-2.2z",
					onClick: n[512] ||= (t) => e.onClick(t),
					onDblclick: n[513] ||= (t) => e.onDblClick(),
					onMouseenter: n[514] ||= (t) => e.onEnter(t),
					onMouseleave: n[515] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Portugal",
					class: "PT",
					style: k({ display: e.config.displayPath.PT }),
					d: "m450 334.6 1-1 1-.5.8 1.8h1.6l.5-.5 1.7.2.7 1.8-1.3 1v3l-.4.4-.2 1.8-1.2.3 1.2 2.1-.8 2.4 1 1-.4 1-1 1.3.2 1.2-1.2.9-1.4-.5-1.5.4.4-2.8-.2-2.1-1.3-.4-.7-1.3.3-2.4 1-1.3.3-1.5.6-2.2-.1-1.5-.6-1.4z",
					onClick: n[516] ||= (t) => e.onClick(t),
					onDblclick: n[517] ||= (t) => e.onDblClick(),
					onMouseenter: n[518] ||= (t) => e.onEnter(t),
					onMouseleave: n[519] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Paraguay",
					class: "PY",
					style: k({ display: e.config.displayPath.PY }),
					d: "m299.5 527 1.1-3.6v-1.6l1.4-2.6 4.9-.9h2.6l2.6 1.6v.9l.9 1.7-.2 4 3 .6 1.1-.6 1.9.8.5 1 .3 2.7.3 1.2 1 .1 1.1-.5 1 .6v1.6l-.4 1.9-.5 1.7-.5 2.8-2.5 2.4-2.2.5-3.2-.5-2.8-.8 2.8-4.8-.4-1.3-3-1.2-3.4-2.3-2.2-.5z",
					onClick: n[520] ||= (t) => e.onClick(t),
					onDblclick: n[521] ||= (t) => e.onDblClick(),
					onMouseenter: n[522] ||= (t) => e.onEnter(t),
					onMouseleave: n[523] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Qatar",
					class: "QA",
					style: k({ display: e.config.displayPath.QA }),
					d: "m617.7 392.2-.2-2.3.8-1.6.8-.3.8 1v1.7l-.6 1.9-.7.2z",
					onClick: n[524] ||= (t) => e.onClick(t),
					onDblclick: n[525] ||= (t) => e.onDblClick(),
					onMouseenter: n[526] ||= (t) => e.onEnter(t),
					onMouseleave: n[527] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Romania",
					class: "RO",
					style: k({ display: e.config.displayPath.RO }),
					d: "m539 310.9 1.1-1 1.8.5h1.8l1.3 1 1-.6 2-.4.7-1h1.2l.8.5 1 1.2.8 1.7 1.6 2.5.1 1.8-.3 1.7.5 1.8 1.3.8 1.3-.7 1.3.7v1l-1.3.9-.9-.4-.8 4.7-1.6-.4-2-1.4-3.4.9-1.3 1-4.2-.2-2.1-.6-1.1.3-.8-1.6-.5-.7.6-.7-.7-.5-.9 1-1.6-1.2-.2-1.7-1.7-.9-.3-1.3-1.5-1.6 2.2-.7 1.7-2.8 1.3-2.8z",
					onClick: n[528] ||= (t) => e.onClick(t),
					onDblclick: n[529] ||= (t) => e.onDblClick(),
					onMouseenter: n[530] ||= (t) => e.onEnter(t),
					onMouseleave: n[531] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Serbia",
					class: "RS",
					style: k({ display: e.config.displayPath.RS }),
					d: "m533.8 320.9 1.7 1 .2 1.6 1.6 1.1 1-.9.6.5-.6.7.5.7-.7.8.2 1.5 1.4 1.6-1 1.2-.5 1.2.3.5-.5.5h-1.3l-1 .3v-.3l.3-.4.3-1h-.4l-.5-.6-.5-.2-.4-.6-.5-.3-.4-.5-.5.2-.4 1.3-.7.2.3-.3-1-.8-1-.4-.4-.5-.8-.7.7-.2.4-1.8-1.3-1.5.7-1.7h-1l1-1.5-.9-1.1-.7-1.6 2.2-1 1.8.2 1.5 1.5z",
					onClick: n[532] ||= (t) => e.onClick(t),
					onDblclick: n[533] ||= (t) => e.onDblClick(),
					onMouseenter: n[534] ||= (t) => e.onEnter(t),
					onMouseleave: n[535] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Russia",
					class: "RU",
					style: k({ display: e.config.displayPath.RU }),
					d: "m1008.3 215.8-2.8 3-4.6.6v6.5l-1.2 1.3-2.6-.2-2.2-2.2-3.7-2-.6-2.8-2.9-1.1-3.2.8-1.5-2.3.6-2.6-3.3 1.7 1.2 3.2-1.6 2.8-3.6 3-3.6-.6 2.5 3.5 1.7 5.2 1.3 1.6.3 2.6-.7 1.6-5.3-1.4-7.8 4.6-2.5.6-4.3 4.1-4 3.5-1 2.6-4-3.9-7.4 4.4-1.3-2-2.7 2.3-3.7-.7-1 3.6-3.3 5.2.1 2.2 3.2 1.1-.4 7.5-2.6.2-1.2 4.1 1.2 2.1-4.9 2.5-1 5.4-4.2 1.1-.8 4.7-4 4.2-1-3.1-1.3-6.7-1.5-10.6 1.3-7 2.4-3 .1-2.5 4.4-1.2 5-6.8 4.8-5.7 5-4.6 2.3-8.3-3.4.5-1.7 4.9-7 6.4-2.4-7.2-7.2 2-7 9.6 2.3 3.4-6.3 1.4-4.3.5.2-4-4.4-.7-3.4 2.7-8.6-1-9.2 1.6-9.1 10.4-10.8 11.7 4.5.7 1.3 3 2.8 1 1.8-2.4 3 .3 4 5.2.2 4-2.2 4.5-.3 5.2-1.2 6.9-4.2 6-1 2.8-3.8 4.7-3.8 4.5-1.8 2.3-3.7 2.2h-1.8l-1.8-1.8-3.7 2.8-.5 1.3-.3-.7v-2h1.4l.4-4.6-.8-3.3 2.4-1.4 3.4.7 2-4 .9-4.4 1-1.5 1.5-3.8-4.6 1.3-2.4 1.6h-4.3l-1.1-4-3.3-3-4.9-1.3-1-4.3-1-2.7-1-2-1.8-4.6-2.5-1.7-4.2-1.4-3.7.1-3.5.9-2.3 2.3 1.6 1v2.6l-1.6 1.5-2.5 4.7v2l-4 2.7-3.3-1.7-3.3.4-1.5-1.5-1.7-.4-4 3-3.8.7-2.6 1-3.5-.6h-2.6l-1.7-2.2-2.7-2-2.9-.6-3.5.5-2.7.8-4-1.8-.5-3.3-3.3-1.2-2.5-.5-3.1-1.9-3 4.7 1.2 2.6-2.7 3-4-1-2.9-.2-1.9-2-2.9-.1-2.4-1.4-4.3 2-5.3 3.8-3 .8-1 .3-1.6-2.6-3.6.6-1.2-1.9-2-.8-1.3-2.6-1.5-.8-4 1.2-4-2.6-1.4 2.3-6.3-11.6-3.6-3.6 1-1.5-7 4.5-2.7.2.3-2.5-3.6-1.7-3 1.2-.8-5-5-1-2.6 2-7 1.8-1.4 1.1-10.5 1.7-1.3 1.6 2 3.2-2.6 1.2.5 1.3-2.7 2.2 4.5 3.1-.7 2.1-3.9-.2-.8 1.3-3.6-2.3-4.4.1-3 1.9-3.3-1.8-6.2-3h-4.4l-5.8 4.9-.3 3.2-3-2.6-2.2 4.8.9.9-1.7 3.2 2.4 2.8h2.1l1.8 2.7-.3 2 1.4.7-1.3 2.4-2.7.7-2.8 4 2.6 3.8-.3 2.6 3 4.4-1.6 1.5-.5 1-1.2-.3-2-2.2-.7-.2-1.8-.8-.9-1.6-2.6-.8-1.7.6-.5-.7-3.8-1.8-4.1-.6-2.4-.7-.3.5-3.6-3.3-3.2-1.5-2.4-2.3 2-.7 2.3-3.3-1.5-1.6 4.1-1.7v-.9l-2.6.7.1-1.8 1.5-1.2 2.7-.3.4-1.4-.6-2.3 1.1-2.3v-1.2l-4.1-1.4h-1.7l-1.7-2-2.2.7-3.5-1.6v-.9l-1-1.9-2.2-.2-.2-1.4.7-1-1.8-2.5-3 .5-.8-.3-.7 1-1-.1-.7-3-.7-1.5.6-.4 2.2.1 1.1-1-.8-1.2-1.9-.9.2-.8-1.2-1-1.7-3 .6-1.4-.3-2.3-2.7-1.2-1.5.6-.4-1.2-3-1.3-.9-3-.2-2.4-1.3-1.2 1.2-1.7-.9-5 2-3-.4-1 3.2-3.1-3-2.7 6-7.4 2.7-3.5 1-3-4.1-4.3 1.1-4.2-2.5-4.8 1.9-5.8-3.3-8 2.6-5.4-4.3-5 .4-5.4 2.3-.7 4.8-3.2 2.8-2.8 4.7 4.8 7.6 2 10.6 8.6 2.2 3.5.2 4.8-3.1 3.7-4.6 1.8-12.5-5.3-2.1.9 4.6 5.1.1 3.2.2 6.7 3.6 2 2.2 1.6.4-3-1.7-2.9 1.8-2.5 6.8 4.1 2.3-1.6-1.9-4.9 6.6-6.7 2.5.4 2.7 2.4 1.6-4.8-2.3-4.3 1.3-4.4-2-4.7 7.8 2.5 1.6 4.2-3.5.9v4l2.2 2.5 4.3-1.6.7-4.6 5.9-3.5 9.8-6.6 2 .4-2.7 4.7 3.5.7 2-2.5 5.2-.2 4.2-3.2 3.2 4.6 3.2-5.1-3-4.6 1.5-2.6 8.3 2.4 3.9 2.5 10.1 8.8 2-4-3-4.1v-1.7l-3.4-.8 1-3.8-1.6-6.5V177l5.1-8 1.9-8.4 2-2 7.5 2.6.5 5.2-2.6 7.3 1.7 2.7 1 6-.7 11 3 4.8-1.1 5-5.5 10.2 3.2 1 1.1-2.5 3-1.8.8-3.6 2.5-3.5-1.7-4.2 1.3-5.1-3-.6-.7-4.5 2.2-8.2-3.6-7 5-6.1-.6-6.6 1.4-.2 1.4 5.1-1 8.7 3 1.6-1.4-6.4 4.7-3.5 5.9-.5 5.1 5.1-2.5-7.6-.2-10.3 4.8-2 6.8.5 6-1.4-2.2-5.3 3.2-7 3.3-.4 5.4-5.5 7.4-1.5 1-3.1 7.3-1.1 2.3 2.6 6.3-6.2 5.1.2.8-5.3 2.7-5.3 6.6-5.3 4.8 4.2-3.8 3.1 6.3 2 .8 6 2.6-3 8.2.2 6.3 5.8 2.2 4.4-.7 5.8-3 3.3-7.4 5.9-2.1 3 3.4 1.5 4.2 2.6 2.5-2 1.4 6.4 1.3-2.5 4.4-1.6 9 1.7.7 4.5 11.7 1.5.2-7.5 6 1.7h4.4l4.6 5.1 1.3 6-1.7 3.9 3.5 7 4.4 3.5 2.7-9.2 4.5 4 4.8-2.4 5.4 2.7 2.1-2.4 4.6 1.2-2-8.4 3.7-4 25.3 6 2.4 5.3 7.3 6.7 11.4-1.6 5.5 1.4 2.4 3.5-.4 6 3.5 2.3 3.7-1.6 5-.3 5.3 1.6 5.3-.9 4.9 7 3.4-2.5-2.2-5 1.2-3.7 9 2.3 5.8-.5 8 3.9 4 3.4 6.9 5.9 7.3 7.3-.2 4.5 1.9 1.7-.7-5.1 7.6 1zm-127.5 90.4-2.8-7.6-1.1-4.5v-4.5l-1-4.5-.7-3.2-1.2.7 1 2.2-2.5 2.2-.2 6.3 1.6 4.4-.1 5.8-.7 3.3.3 4.5-.3 4 .6 3.4 1.8-3.1 2.1 2.4.1-2.8-2.7-4.2 1.7-6.2zm-343-27.4-3-.9-3.8 1.6-.6 2.1 3.4.6 5.2-.1-.2-1.2.3-1.4zM980 178.7l3.6-.6 2.9-2 .2-1.2-4-2.5h-2.4l-.4.3-3.5 3.7.5 2.7zm-110-27.1-2.6 3.9.5.5 5.8 1h4.2l-.3-2.6-4-3.8zm24.6-9.6 3.3-4.2-7-2.9-5.3-1.7-.7 3.6 5.3 4.3zm-25-1.7 10.2.3 2.3-8.1-10.2-6-7.4-.6-3.7 2.2-1.5 7.8 5.6 7zm-247.2 26-2.9 2 .4 4.8 5.1 2.3.7 3.8 9.2 1.1 1.7-.7-5.4-7.1-.6-7.5 4.4-9.2 4.2-9.8 8.7-10.2 8.6-5.3 10-5.7 1.8-3.7-2-4.9-5.4 1.6-4.8 4.5-9.4 2.2-9.2 7.4-6.3 5.9.8 4.9-6.7 9 2.5 1.2-5.5 8.3zm147.5-68 .8-5.7-7.1-8.3-2.1-1-2.3 1.7-5.1 18.6zM605.6 69l3 4 3.4-2.8.3-2.7 2.6-1.3 3.7-2.2 1.1-2.6-4.2-3.9-2.6 3-1.6 4-.6-4.6-4.2.2-5.5 3.1 6.2.6zM737 82l4.6 5.8 7.8 4.2 6.2-1.8.7-13.6-6.5-16-5.5-9-6 4-7.3 11.9 3.8 3.2z",
					onClick: n[536] ||= (t) => e.onClick(t),
					onDblclick: n[537] ||= (t) => e.onDblClick(),
					onMouseenter: n[538] ||= (t) => e.onEnter(t),
					onMouseleave: n[539] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Rwanda",
					class: "RW",
					style: k({ display: e.config.displayPath.RW }),
					d: "m560.5 466.6 1.2 1.5-.2 1.7-.8.3-1.5-.2-.9 1.6-1.7-.2.3-1.5.4-.2v-1.7l.9-.8.7.3z",
					onClick: n[540] ||= (t) => e.onClick(t),
					onDblclick: n[541] ||= (t) => e.onDblClick(),
					onMouseenter: n[542] ||= (t) => e.onEnter(t),
					onMouseleave: n[543] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Saudi Arabia",
					class: "SA",
					style: k({ display: e.config.displayPath.SA }),
					d: "m595.2 417.2-.4-1.2-.8-.9-.2-1.2-1.5-1-1.5-2.5-.8-2.4-1.9-2-1.2-.5-2-2.9-.2-2v-1.8l-1.5-3.4-1.3-1.2-1.5-.6-1-1.8.2-.7-.8-1.6-.8-.6-1.1-2.4-1.7-2.5-1.5-2.1h-1.3l.4-1.8.1-1 .4-1.4 3 .6 1.3-1 .7-1.2 2.1-.4.5-1.1.9-.6-2.8-3.2 5.6-1.7.5-.5 3.4 1 4.2 2.2 8 6.5 5.1.3 2.5.3.7 1.5h2l1.1 2.6 1.4.8.5 1 1.9 1.4.1 1.3-.2 1 .3 1 .8.9.4 1 .4.8.9.6.7-.2.6 1.1v.7l1.2 3.1 8.4 1.5.5-.6 1.3 2.1-1.8 6-8.5 3-8 1-2.6 1.4-2 3-1.4.6-.7-1-1 .1-2.7-.2-.6-.3h-3.2l-.8.3-1.1-.8-.8 1.5.3 1.2z",
					onClick: n[544] ||= (t) => e.onClick(t),
					onDblclick: n[545] ||= (t) => e.onDblClick(),
					onMouseenter: n[546] ||= (t) => e.onEnter(t),
					onMouseleave: n[547] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Solomon Islands",
					class: "SB",
					style: k({ display: e.config.displayPath.SB }),
					d: "m929.8 492.8.8 1-2-.1-1-1.7 1.6.7zm-3.5-1.8h-1.1l-1.8-.2-.5-.5.1-1 1.9.4.9.6zm2.3-.7-.4.5-2.1-2.5-.6-1.7h1l1 2.3zm-5-3.6v.6l-2.2-1.2-1.5-1-1-1 .4-.3 1.3.7 2.3 1.3zm-6.6-2.8-.6.2-1.2-.7-1.2-1.1.2-.5 1.6 1.2z",
					onClick: n[548] ||= (t) => e.onClick(t),
					onDblclick: n[549] ||= (t) => e.onDblClick(),
					onMouseenter: n[550] ||= (t) => e.onEnter(t),
					onMouseleave: n[551] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Sudan",
					class: "SD",
					style: k({ display: e.config.displayPath.SD }),
					d: "M570.5 436.9h-.4v-1.5l-.3-1-1.4-1-.4-2.1.4-2.1-1.3-.2-.2.6-1.7.2.7.8.2 1.7-1.5 1.6-1.4 2-1.5.3-2.3-1.6-1.1.5-.3.9-1.4.5-.1.6h-2.8l-.4-.6h-2l-1 .4-.8-.2-1.5-1.7-.4-.8-2 .4-.8 1.3-.7 2.6-1 .5-.9.3-.2-.2-1-.8-.1-.8.4-1.2V435l-1.6-1.7-.3-1.2v-.7l-1-.9V429l-.6-1.1-1 .1.2-1 .8-1.2-.3-1.2.9-.9-.6-.6.7-1.8 1.3-2.2 2.4.3-.1-11.7v-1.2h3.3v-6h33.2l1 3-.7.5.4 3 1 3.6 1.1.7 1.6 1.1-1.5 1.7-2 .4-1 1-.2 1.9-1.2 4.2.3 1.2-.4 2.4-1.2 2.9-1.7 1.4-1.2 2.1-.3 1.2-1.3.8-.8 3z",
					onClick: n[552] ||= (t) => e.onClick(t),
					onDblclick: n[553] ||= (t) => e.onDblClick(),
					onMouseenter: n[554] ||= (t) => e.onEnter(t),
					onMouseleave: n[555] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Sweden",
					class: "SE",
					style: k({ display: e.config.displayPath.SE }),
					d: "m537.5 217.5-2.8 4.7.5 4-4.5 5.1-5.4 5.4-2 8.4 2 4 2.6 3.2-2.5 6.2-3 1.3-1 8.8-1.6 4.8-3.4-.5-1.6 4-3.3.2-.9-4.7-2.3-5.8-2.1-7.6 1.2-3.1 2.3-3.8 1-6.7-1.8-3-.2-8 1.8-6 2.8.1 1-2.5-1-2.2 4.3-9.5 2.8-8 1.9-5.2h2.7l.7-4.1 5.3 1.2.4-5.1 1.7-.3 3.8 3.8 4.4 5.1V213l1 2.7z",
					onClick: n[556] ||= (t) => e.onClick(t),
					onDblclick: n[557] ||= (t) => e.onDblClick(),
					onMouseenter: n[558] ||= (t) => e.onEnter(t),
					onMouseleave: n[559] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Slovenia",
					class: "SI",
					style: k({ display: e.config.displayPath.SI }),
					d: "m514 316.5 2.3.3 1.4-.9 2.4-.1.6-.7h.4l.6 1.4-2.2 1.1-.3 1.6-1 .4v1.2l-1-.1-1-.7-.5.7-2-.1.6-.4-.6-1.7z",
					onClick: n[560] ||= (t) => e.onClick(t),
					onDblclick: n[561] ||= (t) => e.onDblClick(),
					onMouseenter: n[562] ||= (t) => e.onEnter(t),
					onMouseleave: n[563] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Svalbard and Jan Mayen",
					class: "SJ",
					style: k({ display: e.config.displayPath.SJ }),
					d: "m544.6 104.5-6.3 5.3-5-3 2-3.4-1.7-4.3 5.8-2.8 1.1 5.2zm-18.2-26.7 9.3 11.3-7.1 5.7-1.6 10-2.4 2.5-1.3 10.5-3.4.5-6-7.6 2.5-4.6-4.2-3.9-5.5-11.8-2.2-11.8 7.7-5.7 1.5 5.6 4-.3 1-5.4 4.2-.5zm20.2-11.5 5.5 5.8-4.2 8.6-8 1.8-8.4-2.6-.5-4.3-4-.3-3-7.5 8.6-4.7 4 4.1 3-5z",
					onClick: n[564] ||= (t) => e.onClick(t),
					onDblclick: n[565] ||= (t) => e.onDblClick(),
					onMouseenter: n[566] ||= (t) => e.onEnter(t),
					onMouseleave: n[567] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Slovakia",
					class: "SK",
					style: k({ display: e.config.displayPath.SK }),
					d: "m528.1 304 .2.3 1.1-.6 1.4 1.5 1.7-.9 1.3.4 2-.6 2.7 1.7-.8 1-.5 1.8-.6.4-3-1.2-1 .2-.6 1-1.3.5-.3-.2-1.4.6-1.1.1-.2.9-2.4.5-1-.5-1.4-1-.3-1.5.2-.5.4-1 1.3.1.9-.4v-.4l.6-.2.2-1 .6-.2.5-.8z",
					onClick: n[568] ||= (t) => e.onClick(t),
					onDblclick: n[569] ||= (t) => e.onDblClick(),
					onMouseenter: n[570] ||= (t) => e.onEnter(t),
					onMouseleave: n[571] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Sierra Leone",
					class: "SL",
					style: k({ display: e.config.displayPath.SL }),
					d: "m443.2 444.4-.8-.2-2-1.1-1.4-1.5-.5-1-.4-2.1 1.5-1.2.3-.8.5-.6.8-.1.6-.5h2.3l.8 1 .6 1.2-.1.8.4.7v1l.8-.1-1.3 1.3-1.3 1.5-.1.8z",
					onClick: n[572] ||= (t) => e.onClick(t),
					onDblclick: n[573] ||= (t) => e.onDblClick(),
					onMouseenter: n[574] ||= (t) => e.onEnter(t),
					onMouseleave: n[575] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Senegal",
					class: "SN",
					style: k({ display: e.config.displayPath.SN }),
					d: "m428.4 425.2-1.2-2.3-1.4-1 1.3-.5 1.3-2 .7-1.6 1-.9 1.3.3 1.4-.7h1.6l1.3.8 1.9.8 1.7 2.1 1.8 2 .2 1.8.5 1.6 1 .9.3 1-.1 1-.4.1-1.6-.2-.2.3h-.6l-2-.6h-1.4l-5.1-.2-.8.3h-1l-1.4.4-.5-2.2h2.6l.7-.3h.5l1-.7 1.2.6h1.2l1.2-.6-.5-.8-1 .5h-.8l-1.1-.7h-1l-.6.7z",
					onClick: n[576] ||= (t) => e.onClick(t),
					onDblclick: n[577] ||= (t) => e.onDblClick(),
					onMouseenter: n[578] ||= (t) => e.onEnter(t),
					onMouseleave: n[579] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Somalia",
					class: "SO",
					style: k({ display: e.config.displayPath.SO }),
					d: "M618.6 430.4v-.8h-1.1l-1.3 1-1.5.3-1.3.4h-.9l-1.6.2-1 .5-1.4.2-2.5.9-3 .3-2.7.7H599l-1.3-1.2-.6-1.1-.9-.6-1 1.6-.6 1 1 1.5 1 1.4 1.1 1 9.2 3.3h2.4l-8 8.4-3.6.2-2.5 2h-1.8l-.8.9-2.4 3.1v10.2l1.6 2.3.7-.7.6-1.4 3.1-3.4 2.6-2.2 4.2-2.7 2.8-2.3 3.3-3.8 2.4-3.1 2.4-4.1 1.7-3.6 1.4-3.2.8-3 .6-1V432z",
					onClick: n[580] ||= (t) => e.onClick(t),
					onDblclick: n[581] ||= (t) => e.onDblClick(),
					onMouseenter: n[582] ||= (t) => e.onEnter(t),
					onMouseleave: n[583] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Suriname",
					class: "SR",
					style: k({ display: e.config.displayPath.SR }),
					d: "m315 446.7 3.4.6.3-.5 2.3-.2 3 .7-1.5 2.4.2 2 1.1 1.6-.5 1.2-.2 1.3-.7 1.1-1.6-.5-1.4.2-1-.2-.4.8.5.6-.2.5-1.6-.2-1.7-2.4-.4-1.6h-.9l-1.2-2 .5-1.5-.1-.6 1.7-.8z",
					onClick: n[584] ||= (t) => e.onClick(t),
					onDblclick: n[585] ||= (t) => e.onDblClick(),
					onMouseenter: n[586] ||= (t) => e.onEnter(t),
					onMouseleave: n[587] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "South Sudan",
					class: "SS",
					style: k({ display: e.config.displayPath.SS }),
					d: "M570.5 436.9v2.2l-.4.9h-1.5l-1 1.6 1.8.2 1.4 1.4.5 1.1 1.3.7 1.6 3-1.9 1.9-1.7 1.6-1.7 1.3h-2l-2.3.7-1.7-.7-1.2.8-2.5-1.9-.6-1.1-1.6.5-1.3-.1-.7.4-1.3-.3-1.7-2.3-.4-.9-2.1-1.1-.7-1.7-1.2-1.2-1.9-1.5v-.9l-1.6-1.1-1.9-1.1.9-.3 1-.6.7-2.5.7-1.3 2-.4.5.8 1.5 1.6.8.3 1-.5 2 .1.4.6h2.8v-.6l1.5-.5.3-.9 1-.5 2.4 1.6 1.5-.3 1.4-2 1.5-1.6-.2-1.7-.7-.8 1.7-.2.2-.6 1.3.2-.4 2.1.4 2 1.4 1.2.3 1v1.4z",
					onClick: n[588] ||= (t) => e.onClick(t),
					onDblclick: n[589] ||= (t) => e.onDblClick(),
					onMouseenter: n[590] ||= (t) => e.onEnter(t),
					onMouseleave: n[591] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "El Salvador",
					class: "SV",
					style: k({ display: e.config.displayPath.SV }),
					d: "m229 425.8-.2.6h-1.6l-1-.3-1.2-.6-1.6-.1-.8-.6.1-.5 1-.7.5-.3-.1-.4.6-.1.9.2.6.6.8.4.1.4 1.2-.3.6.2.4.3z",
					onClick: n[592] ||= (t) => e.onClick(t),
					onDblclick: n[593] ||= (t) => e.onDblClick(),
					onMouseenter: n[594] ||= (t) => e.onEnter(t),
					onMouseleave: n[595] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Syria",
					class: "SY",
					style: k({ display: e.config.displayPath.SY }),
					d: "m584 364.6-5.5 3.5-3-1.3h-.1l.3-.5v-1.4l.7-1.8 1.5-1.3-.4-1.3-1.3-.2-.3-2.6.7-1.4.8-.7.7-.8.2-2 .9.7 3-1 1.6.7h2.3l3.2-1.3h1.5l3.2-.5-1.4 2.2-1.6.9.3 2.5-1 4.1z",
					onClick: n[596] ||= (t) => e.onClick(t),
					onDblclick: n[597] ||= (t) => e.onDblClick(),
					onMouseenter: n[598] ||= (t) => e.onEnter(t),
					onMouseleave: n[599] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Eswatini",
					class: "SZ",
					style: k({ display: e.config.displayPath.SZ }),
					d: "m565.2 540.7-.6 1.4-1.6.4-1.7-1.7v-1.1l.7-1.2.3-.9.8-.2 1.4.6.4 1.4z",
					onClick: n[600] ||= (t) => e.onClick(t),
					onDblclick: n[601] ||= (t) => e.onDblClick(),
					onMouseenter: n[602] ||= (t) => e.onEnter(t),
					onMouseleave: n[603] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Chad",
					class: "TD",
					style: k({ display: e.config.displayPath.TD }),
					d: "m515.9 427.3.3-1.4h-1.8V424l-1.2-1 1.2-3.9 3.6-2.7.1-3.8 1.1-6 .6-1.2-1.1-1v-1l-1.1-.8-.7-4.7 2.8-1.6L531 402l11.2 5.7.1 11.7-2.4-.2-1.3 2-.7 1.9.6.6-1 1 .4 1-.8 1.3-.2 1 1-.1.5 1v1.7l1 .9v.6l-1.7.5-1.4 1.2-2 3-2.7 1.4-2.7-.2-.8.3.3 1-1.5 1-1.2 1-3.5 1.1-.7-.6h-.5l-.5.6-2.3.3.4-.8-.9-2-.4-1.1-1.2-.5-1.6-1.6.6-1.4 1.3.3.8-.2h1.5l-1.5-2.5.1-2-.2-1.8z",
					onClick: n[604] ||= (t) => e.onClick(t),
					onDblclick: n[605] ||= (t) => e.onDblClick(),
					onMouseenter: n[606] ||= (t) => e.onEnter(t),
					onMouseleave: n[607] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "French Southern Territories",
					class: "TF",
					style: k({ display: e.config.displayPath.TF }),
					d: "m668.5 619 1.8 1.4 2.7.5v.8l-.7 2-4.3.3v-2.3l.4-1.8z",
					onClick: n[608] ||= (t) => e.onClick(t),
					onDblclick: n[609] ||= (t) => e.onDblClick(),
					onMouseenter: n[610] ||= (t) => e.onEnter(t),
					onMouseleave: n[611] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Togo",
					class: "TG",
					style: k({ display: e.config.displayPath.TG }),
					d: "m480.5 446.3-2.3.5-.6-1-.7-1.7-.3-1.4.6-2.6-.6-1-.3-2.2v-2l-1.2-1.5.2-.9h2.5l-.4 1.6.9.8 1 1v1.4l.6.6-.1 6.4z",
					onClick: n[612] ||= (t) => e.onClick(t),
					onDblclick: n[613] ||= (t) => e.onDblClick(),
					onMouseenter: n[614] ||= (t) => e.onEnter(t),
					onMouseleave: n[615] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Thailand",
					class: "TH",
					style: k({ display: e.config.displayPath.TH }),
					d: "m762.9 429.2-2.5-1.3H758l.4-2.2h-2.5l-.2 3.1-1.5 4.2-1 2.5.3 2 1.8.1 1.1 2.6.5 2.4 1.6 1.6 1.7.4 1.4 1.4-.9 1.2-1.8.3-.2-1.4-2.3-1.3-.5.5-1.1-1-.5-1.4-1.5-1.6-1.4-1.3-.4 1.6-.5-1.6.3-1.7.8-2.7 1.3-3 1.6-2.6-1.1-2.6v-1.3l-.3-1.6-1.9-2.3-.6-1.4 1-.6 1-2.5-1.2-2-1.8-2-1.3-2.6 1.2-.5 1.2-3.2 2-.2 1.7-1.2 1.6-.7 1.2.9.1 1.8h2l-.8 3.2.1 2.6 3-1.7.8.5h1.6l.6-1.1 2.1.2 2.2 2.4.1 2.8 2.3 2.6-.1 2.4-1 1.3-2.6-.4-3.6.6-1.8 2.3z",
					onClick: n[616] ||= (t) => e.onClick(t),
					onDblclick: n[617] ||= (t) => e.onDblClick(),
					onMouseenter: n[618] ||= (t) => e.onEnter(t),
					onMouseleave: n[619] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Tajikistan",
					class: "TJ",
					style: k({ display: e.config.displayPath.TJ }),
					d: "m674.4 340.6-1 1.1-3.1-.6-.3 2.1 3-.2 3.5 1.1 5.3-.5.7 3.3 1-.3 1.7.8-.1 1.3.4 2h-3l-1.8-.2-1.8 1.6-1.2.3-1 .7-1.1-1.1.3-3-.9-.1.3-1.1-1.5-.8-1.2 1.2-.3 1.4-.4.6-1.7-.1-1 1.6-.9-.7-2 1.1-.9-.4 1.6-3.6-.6-2.6-2-.9.7-1.6 2.3.2 1.4-2 .8-2.3 3.8-1-.6 1.8.4 1z",
					onClick: n[620] ||= (t) => e.onClick(t),
					onDblclick: n[621] ||= (t) => e.onDblClick(),
					onMouseenter: n[622] ||= (t) => e.onEnter(t),
					onMouseleave: n[623] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Timor-Leste",
					class: "TL",
					style: k({ display: e.config.displayPath.TL }),
					d: "m825.7 488.3.3-.7 2.4-.6 2-.1.8-.4 1 .4-1 .7-2.9 1.3-2.3.8v-.9z",
					onClick: n[624] ||= (t) => e.onClick(t),
					onDblclick: n[625] ||= (t) => e.onDblClick(),
					onMouseenter: n[626] ||= (t) => e.onEnter(t),
					onMouseleave: n[627] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Turkmenistan",
					class: "TM",
					style: k({ display: e.config.displayPath.TM }),
					d: "m646.9 356.9-.3-3h-2l-3.3-3.1-2.2-.4-3.1-1.8-2-.3-1.2.6h-1.9l-2 2-2.5.6-.5-2.5.4-3.7-2.2-1.2.8-2.5-1.9-.2.6-3.1 2.7 1 2.4-1.3-2-2.2-.8-2.2-2.3 1-.3 2.7-.8-2.4 1.2-1.2 3.2-.8 1.9 1 2 3 1.4-.2h3.1l-.4-2 2.4-1.2 2.3-2.2 3.8 2 .3 3 1 .7 3.1-.1 1 .6 1.3 3.8 3.3 2.5 1.8 1.7 3 1.8 3.6 1.5v2.1h-.9l-1.3-1-.5 1.3-2.3.6-.6 2.8-1.6 1-2.2.6-.5 1.5-2.2.5z",
					onClick: n[628] ||= (t) => e.onClick(t),
					onDblclick: n[629] ||= (t) => e.onDblClick(),
					onMouseenter: n[630] ||= (t) => e.onEnter(t),
					onMouseleave: n[631] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Tunisia",
					class: "TN",
					style: k({ display: e.config.displayPath.TN }),
					d: "m501.8 374.7-1.2-5.9-1.7-1.3v-.8l-2.3-2-.2-2.5 1.7-1.9.6-2.8-.4-3.3.6-1.8 3-1.4 2 .4-.1 1.8 2.4-1.3.2.7-1.4 1.7v1.6l1 .8-.4 3-1.9 1.7.5 1.8h1.5l.7 1.7 1 .5v2.6l-1.5.9-.8 1-2 1.3.3 1.4-.2 1.3z",
					onClick: n[632] ||= (t) => e.onClick(t),
					onDblclick: n[633] ||= (t) => e.onDblClick(),
					onMouseenter: n[634] ||= (t) => e.onEnter(t),
					onMouseleave: n[635] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Turkey",
					class: "TR",
					style: k({ display: e.config.displayPath.TR }),
					d: "m578.8 336.6 4 1.4 3.2-.5 2.4.3 3.4-2 3-.1 2.6 1.8.5 1.3-.2 1.8 2 .9 1.1 1-1.9 1 .9 4.2-.5 1.1 1.5 2.8-1.4.6-1-.9-3.2-.4-1.2.5-3.2.6-1.5-.1-3.2 1.3h-2.3l-1.5-.6-3.1 1-1-.7v1.9l-.8.8-.8.7-1-1.6 1-1.3-1.7.3-2.3-.8-2 2-4.2.4-2.3-1.8-3-.1-.6 1.4-2 .4-2.7-1.8h-3L551 350l-2-2 1.3-2.7-1.8-1.7 3.1-3.5 4.3-.2 1.2-2.8 5.4.5 3.3-2.4 3.3-1 4.6-.1zm-27.3 2.4-2.3 2-1-1.7.1-.8.7-.4.9-2.3-1.4-1 2.8-1.2 2.5.5.3 1.4 2.4 1.2-.5 1-3.3.1z",
					onClick: n[636] ||= (t) => e.onClick(t),
					onDblclick: n[637] ||= (t) => e.onDblClick(),
					onMouseenter: n[638] ||= (t) => e.onEnter(t),
					onMouseleave: n[639] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Trinidad and Tobago",
					class: "TT",
					style: k({ display: e.config.displayPath.TT }),
					d: "m302.3 433.2 1.6-.3h.6l-.1 2.2-2.3.3-.6-.3.9-.7z",
					onClick: n[640] ||= (t) => e.onClick(t),
					onDblclick: n[641] ||= (t) => e.onDblClick(),
					onMouseenter: n[642] ||= (t) => e.onEnter(t),
					onMouseleave: n[643] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Taiwan",
					class: "TW",
					style: k({ display: e.config.displayPath.TW }),
					d: "M816.7 393.3 815 398l-1.2 2.5-1.5-2.5-.3-2.3 1.7-3 2.2-2.3 1.3 1z",
					onClick: n[644] ||= (t) => e.onClick(t),
					onDblclick: n[645] ||= (t) => e.onDblClick(),
					onMouseenter: n[646] ||= (t) => e.onEnter(t),
					onMouseleave: n[647] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Tanzania",
					class: "TZ",
					style: k({ display: e.config.displayPath.TZ }),
					d: "m570.3 466 .5.3L581 472l.1 1.6 4 2.8-1.2 3.5.1 1.6 1.8 1 .1.7-.7 1.7.1.9-.2 1.3 1 1.8 1.2 2.8 1 .6-2.2 1.6-3.1 1.1h-1.7l-1 .8-2 .1-.7.4-3.3-.8-2.1.2-.8-3.9-1-1.3-.5-.8-2.8-.5-1.6-.8-1.8-.5-1-.5-1.3-.7-1.5-3.6-1.6-1.5-.6-1.6.3-1.5-.5-2.6 1.2-.1 1-1 1-1.5.8-.6v-.9l-.6-.6-.2-1 .8-.4.2-1.7-1.2-1.6 1-.3h3.1z",
					onClick: n[648] ||= (t) => e.onClick(t),
					onDblclick: n[649] ||= (t) => e.onDblClick(),
					onMouseenter: n[650] ||= (t) => e.onEnter(t),
					onMouseleave: n[651] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Ukraine",
					class: "UA",
					style: k({ display: e.config.displayPath.UA }),
					d: "m564.4 292.5 1 .2.7-1 .9.2 2.9-.5 1.8 2.6-.7 1 .2 1.3 2.3.2 1 2-.1.8 3.6 1.6 2.1-.7 1.7 2h1.7l4.1 1.4v1.2l-1.1 2.3.6 2.3-.4 1.4-2.7.3-1.5 1.2v1.8l-2.3.3-1.9 1.3-2.6.3-2.4 1.5-1.3 1 1.5 1.5 1.3 1 2.9-.3-.6 1.4-3 .7-3.9 2.3-1.5-.8.6-1.9-3-1.1.5-.8 3.1-1.6-.4-.8-.4.4-.5-.3-4.3-1-.2-1.5-2.6.5-1 2.2-2.2 3-1.3-.7-1.3.7-1.3-.8.7-.4.5-1.4.8-1.3-.2-.7.6-.3.2.5 1.7.1.7-.2-.5-.5.2-.6-1-1-.4-1.7-1-.7.2-1.4-1.3-1.1-1.1-.2-2-1.3-2 .4-.6.6h-1.2l-.7 1-2 .4-1 .7-1.3-1h-1.8l-1.8-.5-1.2.9-.2-1.2-1.5-1.1.5-1.7.8-1.1.6.2-.7-1.9 2.5-3.6 1.4-.5.3-1.2-1.4-4 1.4-.1 1.5-1.2 2.2-.1 2.8.3 3.1 1.1h2.2l1 .7 1.1-.7.8 1 2.5-.2 1.1.4.2-2.2.9-1z",
					onClick: n[652] ||= (t) => e.onClick(t),
					onDblclick: n[653] ||= (t) => e.onDblClick(),
					onMouseenter: n[654] ||= (t) => e.onEnter(t),
					onMouseleave: n[655] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Uganda",
					class: "UG",
					style: k({ display: e.config.displayPath.UG }),
					d: "M564.6 466.3h-3l-1 .3-1.7.8-.7-.3v-2l.7-1.1.1-2.3.6-1.3 1-1.4 1.2-.8.9-1-1.2-.3.2-3.3 1.2-.8 1.7.7 2.3-.7h2l1.7-1.3 1.3 2 .4 1.4 1.2 3.2-1 2-1.4 1.8-.8 1.2v3z",
					onClick: n[656] ||= (t) => e.onClick(t),
					onDblclick: n[657] ||= (t) => e.onDblClick(),
					onMouseenter: n[658] ||= (t) => e.onEnter(t),
					onMouseleave: n[659] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "United States of America",
					class: "US",
					style: k({ display: e.config.displayPath.US }),
					d: "m109.3 279.8-1.6-1.8-2.5-1.6-.8-4.4-3.6-4-1.5-5-2.7-.4-4.4-.1-3.3-1.5-5.8-5.7-2.7-1-4.9-2-3.9.5-5.5-2.6-3.3-2.5-3.1 1.3.6 3.9-1.6.3-3.2 1.2-2.5 1.9-3.1 1.1-.4-3.2 1.2-5.5 3-1.8-.7-1.5-3.6 3.2-2 3.8-4 4 2 2.6-2.6 3.9-3 2.2-2.8 1.6-.7 2.3-4.4 2.6-.8 2.3-3.3 2.2-2-.4-2.6 1.4-2.8 1.6-2.3 1.7-4.9 1.4-.4-.9 3-2.2 2.8-1.5 3-2.7 3.5-.6 1.4-2 3.9-3.1.6-1 2-1.9.5-4 1.5-3.1-3.3 1.6-.9-1-1.5 2-1.8-2.7-.8 2-1-2.8-2.8 2.2h-1.7l-.3-3.2.5-2-1.8-2-3.6 1-2.4-2.6-2-1.4v-3.2l-2-2.5 1-3.4 2.3-3.4 1-3.1 2.2-.5 2 1 2.2-3 2 .6 2.2-2-.5-3-1.6-1 2.1-2.6h-1.7l-3 1.5-.9 1.4-2.2-1.4-4 .7-4-1.5-1.2-2.7-3.6-3.9 4-2.9 6.2-3.4h2.3l-.4 3.5 6-.3-2.3-4.3-3.5-2.7-2-3.7-2.6-3.1-3.9-2.4 1.6-4 5-.3 3.5-3.6.7-3.9 2.8-4 2.7-.9 5.4-3.7 2.5.6 4.3-4.7 4.3 1.9 2 3.8 1.3-1.6 4.7.5-.2 2 4.3 1.4 2.9-.9 5.9 2.7 5.4.8 2.1 1 3.8-1.3 4.2 2.5 3 1v63.2l2.8.1 2.7 1.6 2 2.4 2.5 3.6 2.7-3 2.8-1.8 1.5 2.8 2 2.3 2.5 2.4 1.7 3.8 2.9 5.9 4.8 3.2v3zm175.9 34.4-1.3-1.2-1.8.7-1-1-2.1 3-.9 3.2-1 1.8-1.2.7-.9.2-.2 1h-9.5l-1.2.7-3 2.7.4.6.1 1.5-2 1.2-2.4-.3-2.2-.1-1.3.4.3 1.2v.3l-2.4 2.3-2.1 1.1-1.5.5-1.6 1-2 .5-1.4-.2-1.8-.7 1-1.5.6-1.3 1.3-2-.1-1.6-.5-2.3-1-.4-1.8 1.7h-.6l-.1-1 1.5-1.5.3-1.8-.2-1.8-2.1-1.6-2.4-.8-.4 1.5-.6.4-.5 2-.3-1.3-1 1-.8 1.2-.7 2-.1 1.6.9 2.4-.1 2.5-1.1 1.8-.6.5-.8.5h-1l-.2-.3-.7-2v-1.9l-.3-1.8.5-2.2.6-2.7 1.5-3h-.4l-2 2.5-.5-.5 1.1-1.4 1.7-2.6 2-.3 2.1-.8 2.2.4h.1l2.5-.3-1.4-1.7h-.8l-.8-.2-.6-1.2-2.8.4-2.5.9-2-1.6-1.5-.5.9-2.2-2.5 1.4-2.3 1.3-2.1 1-1.7-1.3-2.8.8v-.6l1.9-1.7 2-1.7 2.8-1.3-3.4-1.1-2.3.5-2.7-1.3-2.9-.6-2-.3-.8-.7-.5-2.4h-1v1.7h-77.6l1 3.5.4 3.4-.7 1-1.5-3.8-4-1.5-.4.9.9 1.9.9 3.5.5 5.4-.4 3.6-.3 3.6-1.1 3.6.9 2.9v3.2l-.5 3 1.5 2 .4 3 2.1 3 1.3 1.1-.1.9 2.3 4.8 2.7 3.5.4 1.8.7.6 2.6.3 1 1h1.5l.4 1 1.3.4 1.8 2 .5 1.7 3.1-.3 3.6-.3-.3.6 4.3 1.6 6.4 2.3h7.8V370h4.8l1 1.2 1.5 1 1.7 1.5.9 1.7.7 1.7 1.4 1 2.4 1 1.7-2.6h2.3l2 1.2 1.4 2.2 1 1.9 1.6 1.8.7 2.2.8 1.4 2.1 1 2 .7 1.1-.1-.5-1-.1-1.6v-2.1l.6-1.4 1.6-1.6 2.8-1.3 2.5-2.4 2.4-.7 1.7-.3 2 .8 2.5-.4 2 1.7h2.1l1-.6 1.1.5.5-.4-.6-.6V376l-.4-.9 1.1-.5 2.2-.2 2.5.3 3.1-.4 1.8.8 1.4 1.5.5.2 2.8-1.5 1 .5 2.3 2.7.8 1.8-.6 2 .4 1.3 1.3 2.4 1.5 2.7 1 .7.5 1.3 1.4.4.8-.4.7-1.9.1-1.2.1-2-1.3-3.7v-1.4l-1.3-2.3-1-2.7-.4-2.3.4-2.3 1.3-2 1.6-1.5 3.1-2.1.4-1.2 1.4-1.2 1.4-.2 1.9-2 2.9-1 1.7-2.5-.3-3.5-.3-1.2-.8-.2-.2-3.4-1.9-1.1 1.9.5-.6-2.2.5-1.6.3 3 1.5 1.3-1 2.4.4.2 1.5-2.8 1-1.4-.1-1.4-.7-.6-.6-2 1 1 .6.2.2.9 2-2.8.6-2.6-.8-.2.8-1v.4h1.7l4-1-.9-.8-4 .7 2.3-1 1.6-.2 1.2-.2 2-.7 1.4.1 2-.6.1-1-.8-1 .3 1.4h-1.2l-.9-2v-2l.5-.9 1.5-2.3 3-1.1 2.8-1.4 3-1.9-.5-1.3-1.8-2.2zM45.6 263.8l-1.5.8-2.5 1.9.4 2.4 1.4 1.3 2.8-2 2.5-2.4-1.2-1.7zM0 235.2l2-1.2.3-.7-2.3-.7zm8.5 15.4-2.8 1 1.7 1.5 1.9 1 1.7-.8-.3-2.2zm97.4 32.5-2.7.4-1.4-.7-.1 1.6.5 2 1.4 1.5 1 2.1 1.7 2.1h1.2l-2.5-3.7zM37 403.8l-1-.3-.2.3v.1l.3.3.5.6 1-.2.1-.4zm-3-.6 1.5.1.1-.3-1.3-.1zm6 3.3-.6-.2-1-.5-.2-.1-.2.3.2.6-.5.4-.1.4.4 1v.9l.6.4.4-.5 1-.5 1-.6.1-.1-.7-1zm-8-5.1-.7.4.1.1.4.7 1 .1h.2l.1-.1-.8-1zm-4.3-1.6-.5.3-.1.2 1 .6.3-.3-.1-.7z",
					onClick: n[660] ||= (t) => e.onClick(t),
					onDblclick: n[661] ||= (t) => e.onDblClick(),
					onMouseenter: n[662] ||= (t) => e.onEnter(t),
					onMouseleave: n[663] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Uruguay",
					class: "UY",
					style: k({ display: e.config.displayPath.UY }),
					d: "m313.7 551.8 1.8-.3 2.8 2.5 1-.1 3 2 2.1 1.9 1.7 2.2-1.3 1.6.8 1.9-1.2 2.1-3.2 1.9-2-.7-1.6.4-2.6-1.5-1.9.1-1.7-1.8.3-2.2.6-.7v-3.4l.7-3.3z",
					onClick: n[664] ||= (t) => e.onClick(t),
					onDblclick: n[665] ||= (t) => e.onDblClick(),
					onMouseenter: n[666] ||= (t) => e.onEnter(t),
					onMouseleave: n[667] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Uzbekistan",
					class: "UZ",
					style: k({ display: e.config.displayPath.UZ }),
					d: "M661.8 351v-2.2l-3.7-1.5-3-1.8-1.7-1.7-3.3-2.5-1.3-3.8-1-.6-3 .1-1-.7-.4-3-3.8-2-2.3 2.2-2.4 1.3.4 1.8-3.1.1-.1-14.1 7.2-2.4.5.4 4.4 2.8 2.3 1.5 2.6 3.5 3.3-.6 4.8-.3 3.4 2.8-.2 3.8h1.3l.6 3.1 3.6.1.7 1.8h1l1.3-2.7 3.7-2.6 1.6-.7.8.4-2.3 2.4 2 1.4 2-1 3.4 2-3.6 2.7-2.1-.4-1.2.1-.4-1 .6-1.7-3.8.9-.9 2.3-1.3 2-2.3-.2-.7 1.6 2 .9.6 2.6-1.6 3.6-2-.7z",
					onClick: n[668] ||= (t) => e.onClick(t),
					onDblclick: n[669] ||= (t) => e.onDblClick(),
					onMouseenter: n[670] ||= (t) => e.onEnter(t),
					onMouseleave: n[671] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Venezuela",
					class: "VE",
					style: k({ display: e.config.displayPath.VE }),
					d: "m275.3 430.4-.1.6-1.7.4 1 1.2-.1 1.5-1.2 1.7 1 2.2 1.2-.2.7-2-.9-1-.1-2.2 3.4-1.1-.3-1.4 1-.9 1 2 2 .1 1.7 1.6.2 1h2.5l3-.3 1.6 1.2 2.1.4 1.6-1v-.6l3.5-.2h3.4l-2.4.8 1 1.3 2.2.3 2 1.3.5 2.3h1.5l1.1.6-2.2 1.6-.3 1 1 1.1-.7.5-1.7.5v1.3l-.7.8 1.9 2 .3.9-1 1-3.1 1-2 .5-.8.7-2.3-.7-2-.4-.6.3 1.3.7-.1 1.9.4 1.7 2.3.3.2.6-2 .8-.4 1.1-1.1.5-2 .6-.6.9-2.2.2-1.6-1.5-.8-2.8-.8-1-1-.6 1.4-1.4v-.6l-.9-.8-.5-1.9.2-2 .6-1 .5-1.4-1-.5-1.5.3-2-.1-1.2.3-2-2.4-1.6-.4-3.6.3-.7-1-.7-.2v-.6l.3-1-.3-1.2-.6-.6-.3-1.3-1.5-.2.8-1.7.3-2 .8-1 1.1-.9.8-1.4z",
					onClick: n[672] ||= (t) => e.onClick(t),
					onDblclick: n[673] ||= (t) => e.onDblClick(),
					onMouseenter: n[674] ||= (t) => e.onEnter(t),
					onMouseleave: n[675] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Vietnam",
					class: "VN",
					style: k({ display: e.config.displayPath.VN }),
					d: "m778.2 401.9-3.7 2.5-2.4 2.8-.6 2 2.2 3.2 2.6 3.8 2.5 1.8 1.7 2.3 1.3 5.3-.4 5-2.3 2-3.2 1.8-2.3 2.3-3.5 2.6-1-1.8.8-1.9-2.1-1.6 2.4-1.1 3-.2-1.3-1.8 4.7-2.1.4-3.5-.7-1.9.6-2.9-.8-2-2-2-1.9-2.6-2.3-3.5-3.3-1.7.8-1 1.8-.9-1.1-2.6h-3.5l-1.2-2.7-1.7-2.4 1.5-.7h2.3l2.7-.3 2.4-1.7 1.3 1.2 2.6.5-.5 1.8 1.4 1.2z",
					onClick: n[676] ||= (t) => e.onClick(t),
					onDblclick: n[677] ||= (t) => e.onDblClick(),
					onMouseenter: n[678] ||= (t) => e.onEnter(t),
					onMouseleave: n[679] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Vanuatu",
					class: "VU",
					style: k({ display: e.config.displayPath.VU }),
					d: "m945.9 509.9-1 .4-.9-1.3.1-.8zm-2.1-4.4.5 2.3-.8-.4-.6.2-.4-.8v-2.2z",
					onClick: n[680] ||= (t) => e.onClick(t),
					onDblclick: n[681] ||= (t) => e.onDblClick(),
					onMouseenter: n[682] ||= (t) => e.onEnter(t),
					onMouseleave: n[683] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Kosovo",
					class: "XK",
					style: k({ display: e.config.displayPath.XK }),
					d: "m533.5 334-.2.7h-.3l-.2-1.4-.7-.4-.6-1 .5-.9.7-.2.4-1.3.5-.2.4.5.5.3.4.6.5.2.5.7h.4l-.3.9-.3.4v.3l-.6.1z",
					onClick: n[684] ||= (t) => e.onClick(t),
					onDblclick: n[685] ||= (t) => e.onDblClick(),
					onMouseenter: n[686] ||= (t) => e.onEnter(t),
					onMouseleave: n[687] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Yemen",
					class: "YE",
					style: k({ display: e.config.displayPath.YE }),
					d: "m624.2 416.3-2 .8-.6 1.3v1l-2.9 1.2-4.5 1.4-2.5 2-1.2.1-.8-.1-1.7 1.2-1.8.5-2.3.2-.7.1-.6.8-.8.2-.4.7H600l-.9.3-2-.1-.7-1.7.1-1.5-.4-.9-.6-2.1-.8-1.2.6-.1-.3-1.4.3-.5-.1-1.3 1.2-1-.3-1.1.8-1.5 1.1.8.8-.3h3.2l.5.3 2.8.2 1-.1.7 1 1.3-.5 2-3 2.7-1.4 8-1.1 2.3 4.8z",
					onClick: n[688] ||= (t) => e.onClick(t),
					onDblclick: n[689] ||= (t) => e.onDblClick(),
					onMouseenter: n[690] ||= (t) => e.onEnter(t),
					onMouseleave: n[691] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "South Africa",
					class: "ZA",
					style: k({ display: e.config.displayPath.ZA }),
					d: "m563.6 548.7-.5.5-1.2 1.6-.8 1.7-1.6 2.3-3.2 3.4-2 2-2 1.5-3 1.3-1.4.1-.4 1-1.7-.5-1.4.6-3-.7-1.7.5-1.2-.2-2.8 1.3-2.4.5-1.8 1.3-1.2.1-1.2-1.2h-1l-1.2-1.6-.1.5-.4-1v-1.9l-.9-2.2 1-.6-.2-2.5-1.8-3-1.4-2.8-2-4.2 1.3-1.5 1.1.8.5 1.4 1.3.2 1.7.6 1.5-.2 2.5-1.6v-11.6l.8.5 1.7 3-.3 1.8.6 1.1 2-.3 1.4-1.4 1.4-1 .6-1.4 1.4-.7 1.2.4 1.3.8 2.3.2 1.8-.7.3-1 .5-1.5 1.5-.2.8-1.2 1-2 2.5-2.3 4-2.2h1.1l1.4.5 1-.3 1.4.3 1.3 4.2.8 2.2-.5 3.4.2 1.2-1.4-.6-.8.2-.3 1-.7 1v1.2l1.7 1.7 1.6-.4.6-1.4h2l-.6 2.3-.3 2.7-.8 1.4zm-7.1-1-1.2-1-1.3.7-1.5 1.3-1.5 2 2 2.5 1-.3.6-1 1.5-.6.5-1 .9-1.6z",
					onClick: n[692] ||= (t) => e.onClick(t),
					onDblclick: n[693] ||= (t) => e.onDblClick(),
					onMouseenter: n[694] ||= (t) => e.onEnter(t),
					onMouseleave: n[695] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Zambia",
					class: "ZM",
					style: k({ display: e.config.displayPath.ZM }),
					d: "m567.1 489.2 1.3 1.3.7 2.4-.4.7-.6 2.3.5 2.4-.8 1-.9 2.6 1.5.8-8.5 2.4.2 2-2 .4-1.7 1.2-.3 1-1 .2-2.5 2.4-1.5 1.9h-1l-.9-.3-3.1-.3-.5-.2v-.3l-1.1-.6-1.9-.2-2.3.7-1.8-1.8-1.9-2.4.1-9.2h5.9l-.2-1 .4-1-.5-1.3.3-1.4-.3-.9h1l.1 1 1.3-.1 1.8.3 1 1.2 2.2.4 1.7-.9.6 1.5 2.2.4 1 1.3 1.2 1.5h2.1l-.2-3-.8.5-2-1.1-.7-.5.4-2.9.4-3.3-.6-1.3.8-1.8.8-.3 3.7-.5 1.1.3 1.2.7 1.1.5 1.8.5z",
					onClick: n[696] ||= (t) => e.onClick(t),
					onDblclick: n[697] ||= (t) => e.onDblClick(),
					onMouseenter: n[698] ||= (t) => e.onEnter(t),
					onMouseleave: n[699] ||= (t) => e.onLeave(t)
				}, null, 36),
				R("path", {
					id: "Zimbabwe",
					class: "ZW",
					style: k({ display: e.config.displayPath.ZW }),
					d: "m562.7 527-1.5-.3-1 .4-1.3-.6h-1.1l-1.8-1.3-2.2-.5-.8-1.9v-1l-1.2-.4-3.2-3.2-.9-1.7-.5-.5-1.1-2.4 3.1.3 1 .4.9-.1 1.5-1.9 2.5-2.4 1-.2.3-1 1.6-1.2 2.1-.4.2 1.1h2.4l1.3.6.6.7 1.3.2 1.5 1v3.6l-.6 2-.1 2.3.4.8-.3 1.8-.4.2-.7 2.2z",
					onClick: n[700] ||= (t) => e.onClick(t),
					onDblclick: n[701] ||= (t) => e.onDblClick(),
					onMouseenter: n[702] ||= (t) => e.onEnter(t),
					onMouseleave: n[703] ||= (t) => e.onLeave(t)
				}, null, 36)
			], 8, CE)], 8, SE));
		}
	}
}, TE = {
	name: "MapChart",
	components: {
		MapInfo: ZT,
		...wE
	},
	mixins: [{ methods: {
		...eb.methods,
		formatNumber: zy
	} }],
	props: {
		databoxId: {
			type: String,
			default: null
		},
		databoxType: {
			type: String,
			default: null
		},
		databoxSource: {
			type: String,
			default: "default"
		},
		data: {
			type: String,
			required: !0
		},
		value: {
			type: [Number, String],
			default: ""
		},
		date: {
			type: String,
			default: ""
		},
		level: {
			type: String,
			default: "dep"
		},
		name: {
			type: String,
			default: "Données"
		},
		selectedPalette: {
			type: String,
			default: "sequentialAscending"
		}
	},
	data() {
		return {
			dataParse: {},
			widgetId: "",
			scaleMin: 0,
			scaleMax: 0,
			colorLeft: "",
			colorRight: "",
			isDep: !0,
			isReg: !1,
			isAca: !1,
			isWorld: !1,
			zoomDep: "",
			InfoProps: {
				localisation: "",
				level: "",
				names: [],
				min: 0,
				max: 0,
				colorMin: "",
				colorMax: "",
				value: 0,
				valueNat: null,
				date: ""
			},
			MapProps: {
				viewBox: "0 0 1010 1010",
				displayPath: {},
				colorStroke: "#FFFFFF"
			},
			tooltip: {
				top: "0px",
				left: "0px",
				visibility: "hidden",
				value: null,
				place: ""
			},
			displayFrance: "",
			displayGuadeloupe: "",
			displayMartinique: "",
			displayMayotte: "",
			displayReunion: "",
			displayGuyane: "",
			dromColor: "#6b6b6b",
			targetReady: !1
		};
	},
	watch: {
		$props: {
			handler() {
				this.widgetId && this.createChart();
			},
			deep: !0,
			immediate: !0
		},
		targetReady(e) {
			e && this.$nextTick(() => {
				this.createChart();
			});
		}
	},
	created() {
		this.widgetId = `dsfr-widget-${Math.floor(Math.random() * 1e3)}`, this.isDep = this.level === "dep", this.isReg = this.level === "reg", this.isAca = this.level === "aca", this.isWorld = this.level === "monde";
	},
	mounted() {
		if (!this.databoxId || !this.databoxType) this.createChart(), this.$forceUpdate();
		else {
			let e = `${this.databoxId}-${this.databoxType}-${this.databoxSource}`;
			document.getElementById(e) ? this.targetReady = !0 : (this._targetObserver = new MutationObserver(() => {
				document.getElementById(e) && (this._targetObserver.disconnect(), this.targetReady = !0);
			}), this._targetObserver.observe(document.body, {
				childList: !0,
				subtree: !0
			}));
		}
		document.documentElement.addEventListener("dsfr.theme", (e) => {
			this.widgetId !== "" && this.changeColors(e.detail.theme);
		});
	},
	beforeUnmount() {
		this._targetObserver && this._targetObserver.disconnect();
	},
	methods: {
		createChart() {
			let e = this.$refs[this.widgetId];
			try {
				this.dataParse = JSON.parse(this.data);
			} catch (e) {
				console.error("Erreur lors du parsing des données data:", e);
				return;
			}
			let t = this.choosePalette();
			this.colorLeft = t[0], this.colorRight = t[t.length - 1], this.InfoProps.colorMin = this.colorLeft, this.InfoProps.colorMax = this.colorRight, this.InfoProps.date = this.date, this.InfoProps.names = this.name;
			let n = [], r = [];
			if (this.MapProps.displayPath = {}, this.zoomDep) {
				let e = this.zoomDep.split(" ");
				for (let t of e) if (this.dataParse[t] !== void 0) {
					if (this.isDep) {
						let e = this.getDep(t).region_value;
						r = this.getDepsFromReg(e);
					} else if (this.isReg) r = this.getAllReg();
					else if (this.isAca) r = this.getAllAca();
					else if (this.isWorld) {
						let e = this.getCountry(t).continent_value;
						r = this.getCountriesFromContinent(e);
					}
				}
				for (let e of r) n.push(this.dataParse[e]);
			} else for (let e in this.dataParse) n.push(this.dataParse[e]);
			n = n.filter((e) => e != null), this.scaleMin = n.length > 0 ? Math.min(...n) : 0, this.scaleMax = n.length > 0 ? Math.max(...n) : 0;
			let i = Tw.scale([this.colorLeft, this.colorRight]).domain([this.scaleMin, this.scaleMax]), a = [], o = [], s = [], c = [];
			for (let t in this.dataParse) {
				let n = this.isAca || this.isWorld ? t : `FR-${t}`, l = e.getElementsByClassName(n);
				if (l.length === 0) {
					console.warn(`L'élément de la carte n'existe pas pour la valeur ${n}, veuillez le supprimer de vos données.`);
					continue;
				}
				if (!this.zoomDep) l[0].setAttribute("fill", i(this.dataParse[t])), l[0].setAttribute("stroke", this.MapProps.colorStroke), l[0].setAttribute("stroke-width", "0.2%"), this.MapProps.displayPath[n] = "";
				else {
					let e = l[0].getBBox(), u = this.zoomDep.split(" ");
					for (let d of u) this.dataParse[d] !== void 0 && (d === t ? (l[0].setAttribute("fill", i(this.dataParse[d])), l[0].setAttribute("stroke", "#1212FF"), l[0].setAttribute("stroke-width", 2), l[0].parentNode.appendChild(l[0]), this.MapProps.displayPath[n] = "", a.push(e.x), s.push(e.y), o.push(e.x + e.width), c.push(e.y + e.height)) : r.includes(t) ? (l[0].setAttribute("fill", i(this.dataParse[t]).alpha(.6)), l[0].setAttribute("stroke", this.MapProps.colorStroke), l[0].setAttribute("stroke-width", "0.2%"), this.MapProps.displayPath[n] = "", a.push(e.x), s.push(e.y), o.push(e.x + e.width), c.push(e.y + e.height)) : (l[0].setAttribute("fill", "rgba(255, 255, 255, 0)"), this.MapProps.displayPath[n] = "none"));
				}
			}
			if (this.zoomDep) {
				let e = this.zoomDep.split(" ");
				for (let t of e) {
					if (this.dataParse[t] === void 0) continue;
					let e = Math.min(...a), n = Math.min(...s), r = Math.max(...o), i = Math.max(...c), l = r - e, u = i - n, d = Math.max(l, u);
					this.MapProps.viewBox = `${e} ${n} ${d} ${d}`, this.InfoProps.level = "en France", this.isDep ? this.InfoProps.localisation = this.getDep(t).department : this.isReg ? this.InfoProps.localisation = this.getReg(t).region : this.isAca ? this.InfoProps.localisation = this.getAca(t).academy : this.isWorld && (this.InfoProps.level = "dans le monde", this.InfoProps.localisation = this.getCountry(t).country), this.InfoProps.value = this.value, this.InfoProps.valueNat = this.dataParse[t], this.isDep && (this.displayFrance = "none", this.displayGuadeloupe = "none", this.displayMartinique = "none", this.displayMayotte = "none", this.displayReunion = "none", this.displayGuyane = "none", t === "971" ? this.displayGuadeloupe = "" : t === "972" ? this.displayMartinique = "" : t === "973" ? this.displayGuyane = "" : t === "974" ? this.displayReunion = "" : t === "976" ? this.displayMayotte = "" : this.displayFrance = "");
				}
			} else this.isWorld ? (this.InfoProps.localisation = "Monde", this.InfoProps.level = "dans le monde", this.MapProps.viewBox = "0 0 1010 710") : (this.InfoProps.localisation = "France", this.InfoProps.level = "en France", this.MapProps.viewBox = "0 0 1010 1010"), this.InfoProps.value = this.value, this.InfoProps.valueNat = null, this.displayFrance = "", this.displayGuadeloupe = "", this.displayMartinique = "", this.displayMayotte = "", this.displayReunion = "", this.displayGuyane = "";
			this.InfoProps.names = this.name, this.InfoProps.min = this.scaleMin, this.InfoProps.max = this.scaleMax, this.InfoProps.colorMin = this.colorLeft, this.InfoProps.colorMax = this.colorRight;
		},
		displayTooltip(e) {
			if (By()) return;
			let t = this.$refs[this.widgetId], n = e.target.className.baseVal, r = n.replace("FR-", "").split(" "), i = t.getElementsByClassName(n);
			i[0].style.opacity = .8, this.tooltip.value = null;
			for (let e of r) this.dataParse[e] !== void 0 && (this.tooltip.value = this.dataParse[e]), this.isDep && this.getDep(e) ? this.tooltip.place = this.getDep(e).department : this.isReg && this.getReg(e) ? this.tooltip.place = this.getReg(e).region : this.isAca && this.getAca(e) ? this.tooltip.place = this.getAca(e).academy : this.isWorld && this.getCountry(e) && (this.tooltip.place = this.getCountry(e).country);
			let a = t.querySelector(".map_container").getBoundingClientRect(), o = t.querySelector(".map_tooltip").getBoundingClientRect(), s = e.target.getBoundingClientRect(), c = window.innerWidth > 1e3 ? window.innerWidth / 30 : window.innerWidth / 15, l = s.x - a.x + o.width - c, u = s.y - a.y;
			l + o.width + c > a.x && (l = s.x / 2 - a.x + o.width + c / 2), this.tooltip.top = `${u}px`, this.tooltip.left = `${l}px`, this.tooltip.visibility = "visible";
		},
		hideTooltip(e) {
			if (By()) return;
			this.tooltip.visibility = "hidden";
			let t = this.$refs[this.widgetId], n = e.target.className.baseVal, r = t.getElementsByClassName(n);
			r[0].style.opacity = 1;
		},
		changeGeoLevel(e) {
			this.zoomDep = e.target.className.baseVal.replace("FR-", ""), this.createChart();
		},
		resetGeoFilters() {
			this.zoomDep = "", this.createChart();
		},
		choosePalette() {
			return zw(this.selectedPalette);
		},
		changeColors(e) {
			e === "light" ? (this.dromColor = "#6b6b6b", this.MapProps.colorStroke = "#FFFFFF") : (this.dromColor = "#cecece", this.MapProps.colorStroke = "#161616"), this.createChart();
		}
	}
}, EE = { class: "fr-col-12 fr-col-lg-9 align-stretch" }, DE = { class: "map" }, OE = { class: "tooltip_header fr-text--sm fr-mb-0" }, kE = { class: "tooltip_body" }, AE = { class: "tooltip_value-content" }, jE = { class: "tooltip_value" }, ME = {
	key: 3,
	class: "map_container no_select"
}, NE = {
	key: 4,
	class: "map_sub_container fr-grid-row no_select"
};
function PE(e, t, n, r, i, a) {
	let o = ki("MapInfo"), s = ki("france"), c = ki("france-reg"), l = ki("france-aca"), u = ki("world"), d = ki("guadeloupe"), f = ki("martinique"), p = ki("guyane"), m = ki("reunion"), h = ki("mayotte");
	return !n.databoxId || i.targetReady ? (I(), Ao(Qr, {
		key: 0,
		to: "#" + n.databoxId + "-" + n.databoxType + "-" + n.databoxSource,
		disabled: !n.databoxId
	}, [R("div", {
		ref: i.widgetId,
		class: "widget_container fr-grid-row"
	}, [z(o, { data: i.InfoProps }, null, 8, ["data"]), R("div", EE, [i.zoomDep ? (I(), L("button", {
		key: 0,
		class: "fr-btn fr-btn--sm fr-icon-arrow-go-back-fill fr-btn--icon-left fr-btn--tertiary-no-outline fr-ml-4w",
		onClick: t[0] ||= (...e) => a.resetGeoFilters && a.resetGeoFilters(...e)
	}, " Retour ")) : B("", !0), R("div", DE, [
		R("div", {
			class: "map_tooltip",
			style: k({
				top: i.tooltip.top,
				left: i.tooltip.left,
				visibility: i.tooltip.visibility
			})
		}, [R("div", OE, j(i.tooltip.place), 1), R("div", kE, [R("div", AE, [R("div", jE, j(e.formatNumber(i.tooltip.value)), 1)])])], 4),
		i.isDep ? (I(), L("div", {
			key: 0,
			class: "map_container no_select",
			style: k({ display: i.displayFrance })
		}, [z(s, {
			config: i.MapProps,
			"on-click": a.changeGeoLevel,
			"on-dbl-click": a.resetGeoFilters,
			"on-enter": a.displayTooltip,
			"on-leave": a.hideTooltip
		}, null, 8, [
			"config",
			"on-click",
			"on-dbl-click",
			"on-enter",
			"on-leave"
		])], 4)) : B("", !0),
		i.isReg ? (I(), L("div", {
			key: 1,
			class: "map_container no_select",
			style: k({ display: i.displayFrance })
		}, [z(c, {
			config: i.MapProps,
			"on-click": a.changeGeoLevel,
			"on-dbl-click": a.resetGeoFilters,
			"on-enter": a.displayTooltip,
			"on-leave": a.hideTooltip
		}, null, 8, [
			"config",
			"on-click",
			"on-dbl-click",
			"on-enter",
			"on-leave"
		])], 4)) : B("", !0),
		i.isAca ? (I(), L("div", {
			key: 2,
			class: "map_container no_select",
			style: k({ display: i.displayFrance })
		}, [z(l, {
			config: i.MapProps,
			"on-click": a.changeGeoLevel,
			"on-dbl-click": a.resetGeoFilters,
			"on-enter": a.displayTooltip,
			"on-leave": a.hideTooltip
		}, null, 8, [
			"config",
			"on-click",
			"on-dbl-click",
			"on-enter",
			"on-leave"
		])], 4)) : B("", !0),
		i.isWorld ? (I(), L("div", ME, [z(u, {
			config: i.MapProps,
			"on-click": a.changeGeoLevel,
			"on-dbl-click": a.resetGeoFilters,
			"on-enter": a.displayTooltip,
			"on-leave": a.hideTooltip
		}, null, 8, [
			"config",
			"on-click",
			"on-dbl-click",
			"on-enter",
			"on-leave"
		])])) : B("", !0),
		i.isWorld ? B("", !0) : (I(), L("div", NE, [
			R("div", {
				class: "drom fr-col-sm",
				style: k({ display: i.displayGuadeloupe })
			}, [R("span", {
				class: "fr-text--xs fr-my-1w",
				style: k({ color: i.dromColor })
			}, " Guadeloupe ", 4), z(d, {
				height: "50",
				config: i.MapProps,
				"on-click": a.changeGeoLevel,
				"on-dbl-click": a.resetGeoFilters,
				"on-enter": a.displayTooltip,
				"on-leave": a.hideTooltip
			}, null, 8, [
				"config",
				"on-click",
				"on-dbl-click",
				"on-enter",
				"on-leave"
			])], 4),
			R("div", {
				class: "drom fr-col-sm",
				style: k({ display: i.displayMartinique })
			}, [R("span", {
				class: "fr-text--xs fr-my-1w",
				style: k({ color: i.dromColor })
			}, " Martinique ", 4), z(f, {
				height: "50",
				config: i.MapProps,
				"on-click": a.changeGeoLevel,
				"on-dbl-click": a.resetGeoFilters,
				"on-enter": a.displayTooltip,
				"on-leave": a.hideTooltip
			}, null, 8, [
				"config",
				"on-click",
				"on-dbl-click",
				"on-enter",
				"on-leave"
			])], 4),
			R("div", {
				class: "drom fr-col-sm",
				style: k({ display: i.displayGuyane })
			}, [R("span", {
				class: "fr-text--xs fr-my-1w",
				style: k({ color: i.dromColor })
			}, " Guyane ", 4), z(p, {
				height: "50",
				config: i.MapProps,
				"on-click": a.changeGeoLevel,
				"on-dbl-click": a.resetGeoFilters,
				"on-enter": a.displayTooltip,
				"on-leave": a.hideTooltip
			}, null, 8, [
				"config",
				"on-click",
				"on-dbl-click",
				"on-enter",
				"on-leave"
			])], 4),
			R("div", {
				class: "drom fr-col-sm",
				style: k({ display: i.displayReunion })
			}, [R("span", {
				class: "fr-text--xs fr-my-1w",
				style: k({ color: i.dromColor })
			}, " La Réunion ", 4), z(m, {
				height: "50",
				config: i.MapProps,
				"on-click": a.changeGeoLevel,
				"on-dbl-click": a.resetGeoFilters,
				"on-enter": a.displayTooltip,
				"on-leave": a.hideTooltip
			}, null, 8, [
				"config",
				"on-click",
				"on-dbl-click",
				"on-enter",
				"on-leave"
			])], 4),
			R("div", {
				class: "drom fr-col-sm",
				style: k({ display: i.displayMayotte })
			}, [R("span", {
				class: "fr-text--xs fr-my-1w",
				style: k({ color: i.dromColor })
			}, " Mayotte ", 4), z(h, {
				height: "50",
				config: i.MapProps,
				"on-click": a.changeGeoLevel,
				"on-dbl-click": a.resetGeoFilters,
				"on-enter": a.displayTooltip,
				"on-leave": a.hideTooltip
			}, null, 8, [
				"config",
				"on-click",
				"on-dbl-click",
				"on-enter",
				"on-leave"
			])], 4)
		]))
	])])], 512)], 8, ["to", "disabled"])) : B("", !0);
}
var FE = /* @__PURE__ */ fb(TE, [["render", PE], ["__scopeId", "data-v-8b58c073"]]), IE = {
	name: "MapChartReg",
	components: {
		MapInfo: ZT,
		...wE
	},
	mixins: [{ methods: {
		...eb.methods,
		formatNumber: zy
	} }],
	props: {
		databoxId: {
			type: String,
			default: null
		},
		databoxType: {
			type: String,
			default: null
		},
		databoxSource: {
			type: String,
			default: "default"
		},
		data: {
			type: String,
			required: !0
		},
		value: {
			type: [Number, String],
			default: ""
		},
		date: {
			type: String,
			default: ""
		},
		region: {
			type: String,
			required: !0
		},
		name: {
			type: String,
			default: "Données"
		},
		selectedPalette: {
			type: String,
			default: "sequentialAscending"
		}
	},
	data() {
		return {
			dataParse: {},
			widgetId: "",
			scaleMin: 0,
			scaleMax: 0,
			colorLeft: "",
			colorRight: "",
			zoomDep: "",
			InfoProps: {
				localisation: "",
				level: "",
				names: [],
				min: 0,
				max: 0,
				colorMin: "",
				colorMax: "",
				value: 0,
				valueReg: null,
				date: ""
			},
			MapProps: {
				viewBox: "0 0 1010 1010",
				displayPath: {},
				colorStroke: "#FFFFFF"
			},
			tooltip: {
				top: "0px",
				left: "0px",
				visibility: "hidden",
				value: null,
				place: ""
			},
			displayFrance: "",
			displayGuadeloupe: "",
			displayMartinique: "",
			displayMayotte: "",
			displayReunion: "",
			displayGuyane: "",
			dromColor: "#6b6b6b",
			targetReady: !1
		};
	},
	watch: {
		$props: {
			handler() {
				this.widgetId && this.createChart();
			},
			deep: !0,
			immediate: !0
		},
		targetReady(e) {
			e && this.$nextTick(() => {
				this.createChart();
			});
		}
	},
	created() {
		this.widgetId = `dsfr-widget-${Math.floor(Math.random() * 1e3)}`;
	},
	mounted() {
		if (!this.databoxId || !this.databoxType) this.createChart(), this.$forceUpdate();
		else {
			let e = `${this.databoxId}-${this.databoxType}-${this.databoxSource}`;
			document.getElementById(e) ? this.targetReady = !0 : (this._targetObserver = new MutationObserver(() => {
				document.getElementById(e) && (this._targetObserver.disconnect(), this.targetReady = !0);
			}), this._targetObserver.observe(document.body, {
				childList: !0,
				subtree: !0
			}));
		}
		document.documentElement.addEventListener("dsfr.theme", (e) => {
			this.widgetId !== "" && this.changeColors(e.detail.theme);
		});
	},
	beforeUnmount() {
		this._targetObserver && this._targetObserver.disconnect();
	},
	methods: {
		createChart() {
			let e = this.$refs[this.widgetId];
			try {
				this.dataParse = JSON.parse(this.data);
			} catch (e) {
				console.error("Erreur lors du parsing des données data:", e);
				return;
			}
			let t = this.choosePalette();
			this.colorLeft = t[0], this.colorRight = t[t.length - 1], this.InfoProps.colorMin = this.colorLeft, this.InfoProps.colorMax = this.colorRight, this.InfoProps.date = this.date, this.InfoProps.names = this.name;
			let n = [];
			this.MapProps.displayPath = {};
			let r = this.getDepsFromReg(this.region);
			for (let e of r) this.dataParse[e] !== void 0 && n.push(this.dataParse[e]);
			n = n.filter((e) => e != null), this.scaleMin = n.length > 0 ? Math.min(...n) : 0, this.scaleMax = n.length > 0 ? Math.max(...n) : 0;
			let i = Tw.scale([this.colorLeft, this.colorRight]).domain([this.scaleMin, this.scaleMax]), a = [], o = [], s = [], c = [];
			for (let t of this.getAllDep()) {
				let n = `FR-${t}`, r = e.getElementsByClassName(n);
				if (r.length === 0) {
					console.warn(`L'élément de la carte n'existe pas pour la valeur ${n}, veuillez le supprimer de vos données.`);
					continue;
				}
				r[0].setAttribute("fill", "rgba(255, 255, 255, 0)"), this.MapProps.displayPath[n] = "none";
			}
			for (let t of r) {
				let n = `FR-${t}`, l = e.getElementsByClassName(n);
				if (l.length === 0) {
					console.warn(`L'élément de la carte n'existe pas pour la valeur ${n}, veuillez le supprimer de vos données.`);
					continue;
				}
				if (!this.zoomDep) {
					if (r.includes(t)) {
						let e = l[0].getBBox();
						l[0].setAttribute("fill", i(this.dataParse[t])), l[0].setAttribute("stroke", this.MapProps.colorStroke), l[0].setAttribute("stroke-width", "0.2%"), this.MapProps.displayPath[n] = "", a.push(e.x), s.push(e.y), o.push(e.x + e.width), c.push(e.y + e.height);
					}
				} else if (this.zoomDep === t) {
					let e = l[0].getBBox();
					l[0].setAttribute("fill", i(this.dataParse[t])), l[0].setAttribute("stroke", "#1212FF"), l[0].setAttribute("stroke-width", 2), l[0].parentNode.appendChild(l[0]), this.MapProps.displayPath[n] = "", a.push(e.x), s.push(e.y), o.push(e.x + e.width), c.push(e.y + e.height);
				} else if (r.includes(t)) {
					let e = l[0].getBBox();
					l[0].setAttribute("fill", i(this.dataParse[t]).alpha(.6)), l[0].setAttribute("stroke", this.MapProps.colorStroke), l[0].setAttribute("stroke-width", "0.2%"), this.MapProps.displayPath[n] = "", a.push(e.x), s.push(e.y), o.push(e.x + e.width), c.push(e.y + e.height);
				}
			}
			if (a.length && s.length && o.length && c.length) {
				let e = Math.min(...a), t = Math.min(...s), n = Math.max(...o), r = Math.max(...c), i = n - e, l = r - t, u = Math.max(i, l);
				this.MapProps.viewBox = `${e} ${t} ${u} ${u}`;
			}
			this.InfoProps.level = `dans la région ${this.getReg(this.region).region}`, this.zoomDep ? this.InfoProps.localisation = this.getDep(this.zoomDep).department : this.InfoProps.localisation = this.getReg(this.region).region, this.InfoProps.value = this.value, this.InfoProps.valueReg = this.dataParse[this.zoomDep], this.displayFrance = "none", this.displayGuadeloupe = "none", this.displayMartinique = "none", this.displayMayotte = "none", this.displayReunion = "none", this.displayGuyane = "none", this.region === "971" ? this.displayGuadeloupe = "" : this.region === "972" ? this.displayMartinique = "" : this.region === "973" ? this.displayGuyane = "" : this.region === "974" ? this.displayReunion = "" : this.region === "976" ? this.displayMayotte = "" : this.displayFrance = "", this.InfoProps.min = this.scaleMin, this.InfoProps.max = this.scaleMax;
		},
		displayTooltip(e) {
			if (By()) return;
			let t = this.$refs[this.widgetId], n = e.target.className.baseVal, r = n.replace("FR-", "").split(" "), i = t.getElementsByClassName(n);
			i[0].style.opacity = .8, this.tooltip.value = null;
			for (let e of r) this.dataParse[e] !== void 0 && (this.tooltip.value = this.dataParse[e]), this.getDep(e) && (this.tooltip.place = this.getDep(e).department);
			let a = t.querySelector(".map_container").getBoundingClientRect(), o = t.querySelector(".map_tooltip").getBoundingClientRect(), s = e.target.getBoundingClientRect(), c = window.innerWidth > 1e3 ? window.innerWidth / 30 : window.innerWidth / 15, l = s.x - a.x + o.width - c, u = s.y - a.y;
			l + o.width + c > a.x && (l = s.x / 2 - a.x + o.width + c / 2), this.tooltip.top = `${u}px`, this.tooltip.left = `${l}px`, this.tooltip.visibility = "visible";
		},
		hideTooltip(e) {
			if (By()) return;
			this.tooltip.visibility = "hidden";
			let t = this.$refs[this.widgetId], n = e.target.className.baseVal, r = t.getElementsByClassName(n);
			r[0].style.opacity = 1;
		},
		changeGeoLevel(e) {
			this.zoomDep = e.target.className.baseVal.replace("FR-", "").split(" ")[0], this.createChart();
		},
		resetGeoFilters() {
			this.zoomDep = "", this.createChart();
		},
		choosePalette() {
			return zw(this.selectedPalette);
		},
		changeColors(e) {
			e === "light" ? (this.dromColor = "#6b6b6b", this.MapProps.colorStroke = "#FFFFFF") : (this.dromColor = "#cecece", this.MapProps.colorStroke = "#161616"), this.createChart();
		}
	}
}, LE = { class: "fr-col-12 fr-col-lg-9 align-stretch" }, RE = { class: "map" }, zE = { class: "tooltip_header fr-text--sm fr-mb-0" }, BE = { class: "tooltip_body" }, VE = { class: "tooltip_value-content" }, HE = { class: "tooltip_value" }, UE = { class: "map_sub_container fr-grid-row no_select" };
function WE(e, t, n, r, i, a) {
	let o = ki("MapInfo"), s = ki("france"), c = ki("guadeloupe"), l = ki("martinique"), u = ki("guyane"), d = ki("reunion"), f = ki("mayotte");
	return !n.databoxId || i.targetReady ? (I(), Ao(Qr, {
		key: 0,
		to: "#" + n.databoxId + "-" + n.databoxType + "-" + n.databoxSource,
		disabled: !n.databoxId
	}, [R("div", {
		ref: i.widgetId,
		class: "widget_container fr-grid-row"
	}, [z(o, { data: i.InfoProps }, null, 8, ["data"]), R("div", LE, [i.zoomDep ? (I(), L("button", {
		key: 0,
		class: "fr-btn fr-btn--sm fr-icon-arrow-go-back-fill fr-btn--icon-left fr-btn--tertiary-no-outline fr-ml-4w",
		onClick: t[0] ||= (...e) => a.resetGeoFilters && a.resetGeoFilters(...e)
	}, " Retour ")) : B("", !0), R("div", RE, [
		R("div", {
			class: "map_tooltip",
			style: k({
				top: i.tooltip.top,
				left: i.tooltip.left,
				visibility: i.tooltip.visibility
			})
		}, [R("div", zE, j(i.tooltip.place), 1), R("div", BE, [R("div", VE, [R("div", HE, j(e.formatNumber(i.tooltip.value)), 1)])])], 4),
		R("div", {
			class: "map_container no_select",
			style: k({ display: i.displayFrance })
		}, [z(s, {
			config: i.MapProps,
			"on-click": a.changeGeoLevel,
			"on-dbl-click": a.resetGeoFilters,
			"on-enter": a.displayTooltip,
			"on-leave": a.hideTooltip
		}, null, 8, [
			"config",
			"on-click",
			"on-dbl-click",
			"on-enter",
			"on-leave"
		])], 4),
		R("div", UE, [
			R("div", {
				class: "drom fr-col-sm",
				style: k({ display: i.displayGuadeloupe })
			}, [z(c, {
				config: i.MapProps,
				"on-click": a.changeGeoLevel,
				"on-dbl-click": a.resetGeoFilters,
				"on-enter": a.displayTooltip,
				"on-leave": a.hideTooltip
			}, null, 8, [
				"config",
				"on-click",
				"on-dbl-click",
				"on-enter",
				"on-leave"
			])], 4),
			R("div", {
				class: "drom fr-col-sm",
				style: k({ display: i.displayMartinique })
			}, [z(l, {
				config: i.MapProps,
				"on-click": a.changeGeoLevel,
				"on-dbl-click": a.resetGeoFilters,
				"on-enter": a.displayTooltip,
				"on-leave": a.hideTooltip
			}, null, 8, [
				"config",
				"on-click",
				"on-dbl-click",
				"on-enter",
				"on-leave"
			])], 4),
			R("div", {
				class: "drom fr-col-sm",
				style: k({ display: i.displayGuyane })
			}, [z(u, {
				config: i.MapProps,
				"on-click": a.changeGeoLevel,
				"on-dbl-click": a.resetGeoFilters,
				"on-enter": a.displayTooltip,
				"on-leave": a.hideTooltip
			}, null, 8, [
				"config",
				"on-click",
				"on-dbl-click",
				"on-enter",
				"on-leave"
			])], 4),
			R("div", {
				class: "drom fr-col-sm",
				style: k({ display: i.displayReunion })
			}, [z(d, {
				config: i.MapProps,
				"on-click": a.changeGeoLevel,
				"on-dbl-click": a.resetGeoFilters,
				"on-enter": a.displayTooltip,
				"on-leave": a.hideTooltip
			}, null, 8, [
				"config",
				"on-click",
				"on-dbl-click",
				"on-enter",
				"on-leave"
			])], 4),
			R("div", {
				class: "drom fr-col-sm",
				style: k({ display: i.displayMayotte })
			}, [z(f, {
				config: i.MapProps,
				"on-click": a.changeGeoLevel,
				"on-dbl-click": a.resetGeoFilters,
				"on-enter": a.displayTooltip,
				"on-leave": a.hideTooltip
			}, null, 8, [
				"config",
				"on-click",
				"on-dbl-click",
				"on-enter",
				"on-leave"
			])], 4)
		])
	])])], 512)], 8, ["to", "disabled"])) : B("", !0);
}
var GE = /* @__PURE__ */ fb(IE, [["render", WE], ["__scopeId", "data-v-ac1e987e"]]);
//#endregion
//#region src/components/PieChart.vue
J.register(rh, ah, S_);
var KE = {
	name: "PieChart",
	mixins: [$y],
	props: {
		databoxId: {
			type: String,
			default: null
		},
		databoxType: {
			type: String,
			default: null
		},
		databoxSource: {
			type: String,
			default: "default"
		},
		x: {
			type: String,
			required: !0
		},
		y: {
			type: String,
			required: !0
		},
		subX: {
			type: String,
			default: null
		},
		subY: {
			type: String,
			default: null
		},
		name: {
			type: String,
			default: ""
		},
		fill: {
			type: [Boolean, String],
			default: !1
		},
		date: {
			type: String,
			default: ""
		},
		aspectRatio: {
			type: [Number, String],
			default: 2
		},
		selectedPalette: {
			type: String,
			default: ""
		},
		unitTooltip: {
			type: String,
			default: ""
		}
	},
	data() {
		return this.chart = void 0, {
			widgetId: "",
			chartId: "",
			selectedIndex: -1,
			datasets: [],
			labels: [],
			xparse: [],
			yparse: [],
			subXParse: [],
			subYParse: [],
			nameParse: [],
			tmpColorParse: [],
			colorParse: [],
			colorHover: [],
			isSubChart: !1,
			isSubLevel: !1,
			subTitle: null,
			targetReady: !1
		};
	},
	watch: {
		$props: {
			handler() {
				this.chartId && (this.resetData(), this.getData(), this.createChart());
			},
			deep: !0,
			immediate: !0
		},
		targetReady(e) {
			e && this.$nextTick(() => {
				this.resetData(), this.createChart();
			});
		}
	},
	created() {
		Qy(), this.chartId = `dsfr-chart-${Math.floor(Math.random() * 1e3)}`, this.widgetId = `dsfr-widget-${Math.floor(Math.random() * 1e3)}`;
	},
	mounted() {
		if (!this.databoxId || !this.databoxType) this.resetData(), this.createChart();
		else {
			let e = `${this.databoxId}-${this.databoxType}-${this.databoxSource}`;
			document.getElementById(e) ? this.targetReady = !0 : (this._targetObserver = new MutationObserver(() => {
				document.getElementById(e) && (this._targetObserver.disconnect(), this.targetReady = !0);
			}), this._targetObserver.observe(document.body, {
				childList: !0,
				subtree: !0
			}));
		}
		document.documentElement.addEventListener("dsfr.theme", (e) => {
			this.chartId !== "" && this.changeColors(e.detail.theme);
		});
	},
	beforeUnmount() {
		this._targetObserver && this._targetObserver.disconnect();
	},
	methods: {
		resetData() {
			this.chart && this.chart.destroy(), this.datasets = [], this.labels = [], this.xparse = [], this.yparse = [], this.subXParse = [], this.subYParse = [], this.nameParse = [], this.tmpColorParse = [], this.colorParse = [], this.colorHover = [];
		},
		getData() {
			try {
				this.xparse = JSON.parse(this.x), this.yparse = JSON.parse(this.y), this.subXParse = JSON.parse(this.subX), this.subYParse = JSON.parse(this.subY);
			} catch (e) {
				console.error("Erreur lors du parsing des données x ou y:", e);
				return;
			}
			this.subXParse && this.subYParse && (this.isSubChart = !0);
			let e = [];
			if (this.name) try {
				e = JSON.parse(this.name);
			} catch (e) {
				console.error("Erreur lors du parsing de name:", e);
			}
			this.nameParse = [];
			for (let t = 0; t < this.yparse[0].length; t++) e[t] ? this.nameParse.push(e[t]) : this.nameParse.push(`Série ${t + 1}`);
			this.labels = this.xparse[0], this.loadColors(), this.datasets = this.yparse.map((e, t) => ({
				data: e,
				borderColor: this.colorParse[t],
				backgroundColor: this.colorParse[t],
				hoverBorderColor: this.colorHover[t],
				hoverBackgroundColor: this.colorHover[t]
			}));
		},
		createChart() {
			this.chart && this.chart.destroy(), this.getData();
			let e = this.$refs[this.chartId].getContext("2d");
			this.chart = new J(e, {
				type: [
					!0,
					"true",
					""
				].includes(this.fill) ? "pie" : "doughnut",
				data: {
					labels: this.labels,
					datasets: this.datasets
				},
				options: {
					aspectRatio: this.aspectRatio,
					layout: { padding: {
						left: 50,
						right: 50,
						top: 0,
						bottom: 0
					} },
					plugins: {
						legend: { display: !1 },
						tooltip: {
							enabled: !1,
							displayColors: !1,
							backgroundColor: "#6b6b6b",
							callbacks: {
								label: (e) => this.datasets.map((t) => this.formatNumber(t.data[e.dataIndex])),
								title: (e) => e[0].label,
								labelTextColor: () => this.colorParse
							},
							external: (e) => {
								let t = (document.getElementById(`${this.databoxId}-${this.databoxType}-${this.databoxSource}`) ?? this.$el.nextElementSibling).querySelector(".tooltip"), n = e.tooltip;
								if (!t) return;
								if (!n || n.opacity === 0) {
									t.style.opacity = 0;
									return;
								}
								if (t.classList.remove("above", "below", "no-transform"), n.yAlign ? t.classList.add(n.yAlign) : t.classList.add("no-transform"), n.body) {
									let e = n.title || [], r = n.body.map((e) => e.lines), i = t.querySelector(".tooltip_header.fr-text--sm.fr-mb-0");
									i.innerText = e[0];
									let a = t.querySelector(".tooltip_value");
									a.innerHTML = "", r[0].forEach((e, t) => {
										if (e && e !== "NaN" && n.dataPoints[t]) {
											let { datasetIndex: r, dataIndex: i } = n.dataPoints[t], o = this.colorParse[r] ? this.colorParse[r][i] : "#000", s = `${e}${this.unitTooltip ? ` ${this.unitTooltip}` : ""}`;
											a.innerHTML += `
                        <div class="tooltip_value-content">
                          <span class="tooltip_dot" style="background-color:${o};"></span>
                          <p class="tooltip_place fr-mb-0">${s}</p>
                        </div>
                      `;
										}
									});
								}
								let { offsetLeft: r, offsetTop: i } = this.chart.canvas, a = Number(this.chart.canvas.style.width.replace(/\D/g, "")), o = Number(this.chart.canvas.style.height.replace(/\D/g, "")), s = r + n.caretX + 10, c = i + n.caretY - 20;
								s + t.clientWidth > r + a && (s = r + n.caretX - t.clientWidth - 10), c + t.clientHeight > i + .9 * o && (c = i + n.caretY - t.clientHeight + 20), s < r && (s = r + n.caretX - t.clientWidth / 2, c = i + n.caretY - t.clientHeight - 20), t.style.position = "absolute", t.style.padding = `${n.padding}px ${n.padding}px`, t.style.pointerEvents = "none", t.style.left = `${s}px`, t.style.top = `${c}px`, t.style.opacity = 1;
							}
						}
					},
					onClick: (e) => {
						if (!this.subYParse) return;
						let t = this.chart.getElementsAtEventForMode(e, "nearest", { intersect: !0 }, !0);
						if (t.length > 0) {
							let { index: e } = t[0], n = this.chart.data.labels[e];
							if (!this.subYParse[e]) return;
							this.subTitle || (this.subTitle = n, this.nameParse = this.subXParse[e]), this.subYParse[e] && !this.isSubLevel && (this.updateChart(e), this.isSubLevel = !0, this.selectedIndex = e);
						}
					}
				}
			});
		},
		loadColors() {
			let e = this.yparse;
			(this.selectedPalette === "" || this.selectedPalette === "categorical") && (e = this.yparse[0]);
			let { colorParse: t, colorHover: n } = Dw({
				yparse: e,
				tmpColorParse: this.tmpColorParse,
				selectedPalette: this.selectedPalette
			});
			this.colorParse = [t.flat()], this.colorHover = [n.flat()];
		},
		choosePalette() {
			return zw(this.selectedPalette);
		},
		changeColors(e) {
			this.loadColors(), this.chart.data.datasets.forEach((e, t) => {
				e.borderColor = this.colorParse[t], e.backgroundColor = this.colorParse[t], e.hoverBorderColor = this.colorHover[t], e.hoverBackgroundColor = this.colorHover[t];
			}), this.chart.update("none");
		},
		updateChart(e) {
			let t = this.subYParse[e];
			!t || t.length === 0 || (this.chart.data.labels = this.subXParse[e], this.chart.data.datasets[0].data = this.subYParse[e], this.chart.update());
		},
		resetSub() {
			this.isSubLevel = !1, this.subTitle = null;
			let e = [];
			if (this.name) try {
				e = JSON.parse(this.name);
			} catch (e) {
				console.error("Erreur lors du parsing de name:", e);
			}
			this.nameParse = [];
			for (let t = 0; t < this.yparse[0].length; t++) e[t] ? this.nameParse.push(e[t]) : this.nameParse.push(`Série ${t + 1}`);
			this.chart.data.labels = this.xparse[0], this.chart.data.datasets[0].data = this.yparse[0], this.chart.update(), this.selectedIndex = -1;
		}
	}
}, qE = ["data-index", "data-sub-chart"], JE = { class: "fr-col-12" }, YE = { class: "chart" }, XE = {
	key: 1,
	class: "fr-mb-0"
}, ZE = ["aria-labelledby", "aria-label"], QE = { class: "chart_legend fr-mb-0 fr-mt-4v" }, $E = { class: "fr-text--sm fr-text--bold fr-ml-1w fr-mb-0" }, eD = {
	key: 0,
	class: "flex fr-mt-1w"
}, tD = { class: "fr-text--xs" };
function nD(e, t, n, r, i, a) {
	return !n.databoxId || i.targetReady ? (I(), Ao(Qr, {
		key: 0,
		to: "#" + n.databoxId + "-" + n.databoxType + "-" + n.databoxSource,
		disabled: !n.databoxId
	}, [R("div", {
		ref: i.widgetId,
		class: "widget_container fr-grid-row",
		"data-index": i.selectedIndex,
		"data-sub-chart": i.isSubChart
	}, [R("div", JE, [R("div", YE, [
		t[1] ||= R("div", { class: "tooltip" }, [R("div", { class: "tooltip_header fr-text--sm fr-mb-0" }), R("div", { class: "tooltip_body" }, [R("div", { class: "tooltip_value" })])], -1),
		i.isSubChart ? (I(), L("div", {
			key: 0,
			class: A(i.isSubLevel ? "" : "fr-mt-6v"),
			style: {
				textAlign: "center",
				position: "relative"
			}
		}, [i.isSubLevel ? (I(), L("button", {
			key: 0,
			class: "fr-btn fr-btn--sm fr-icon-arrow-go-back-fill fr-btn--icon-left fr-btn--tertiary-no-outline fr-ml-4w",
			style: {
				position: "absolute",
				left: 0
			},
			onClick: t[0] ||= (...e) => a.resetSub && a.resetSub(...e)
		}, " Retour ")) : B("", !0), i.subTitle ? (I(), L("p", XE, j(i.subTitle), 1)) : B("", !0)], 2)) : B("", !0),
		R("canvas", {
			ref: i.chartId,
			role: "img",
			"aria-labelledby": n.databoxId ? "title-" + n.databoxId : null,
			"aria-label": n.databoxId ? null : "Diagramme circulaire"
		}, null, 8, ZE),
		R("div", QE, [(I(!0), L(F, null, Pi(i.nameParse, (t, n) => (I(), L("div", {
			key: n,
			class: "flex fr-mt-3v fr-mb-1v"
		}, [R("span", {
			class: "legend_dot",
			style: k({ "background-color": i.colorParse[0][n] })
		}, null, 4), R("p", $E, j(e.capitalize(t)), 1)]))), 128)), n.date ? (I(), L("div", eD, [R("p", tD, "Mise à jour : " + j(n.date), 1)])) : B("", !0)])
	])])], 8, qE)], 8, ["to", "disabled"])) : B("", !0);
}
var rD = /* @__PURE__ */ fb(KE, [["render", nD]]);
//#endregion
//#region src/components/RadarChart.vue
J.register(oh, Sy);
var iD = {
	name: "RadarChart",
	mixins: [$y],
	props: {
		databoxId: {
			type: String,
			default: null
		},
		databoxType: {
			type: String,
			default: null
		},
		databoxSource: {
			type: String,
			default: "default"
		},
		x: {
			type: String,
			required: !0
		},
		y: {
			type: String,
			required: !0
		},
		scaleMin: {
			type: [Number, String],
			default: null
		},
		scaleMax: {
			type: [Number, String],
			default: null
		},
		name: {
			type: String,
			default: ""
		},
		date: {
			type: String,
			default: ""
		},
		aspectRatio: {
			type: [Number, String],
			default: 2
		},
		selectedPalette: {
			type: String,
			default: ""
		},
		unitTooltip: {
			type: String,
			default: ""
		}
	},
	data() {
		return this.chart = void 0, {
			widgetId: "",
			chartId: "",
			datasets: [],
			labels: [],
			xparse: [],
			yparse: [],
			nameParse: [],
			tmpColorParse: [],
			colorParse: [],
			colorHover: [],
			targetReady: !1
		};
	},
	watch: {
		$props: {
			handler() {
				this.chartId && (this.resetData(), this.getData(), this.createChart());
			},
			deep: !0,
			immediate: !0
		},
		targetReady(e) {
			e && this.$nextTick(() => {
				this.resetData(), this.createChart();
			});
		}
	},
	created() {
		Qy(), this.chartId = `dsfr-chart-${Math.floor(Math.random() * 1e3)}`, this.widgetId = `dsfr-widget-${Math.floor(Math.random() * 1e3)}`;
	},
	mounted() {
		if (!this.databoxId || !this.databoxType) this.resetData(), this.createChart();
		else {
			let e = `${this.databoxId}-${this.databoxType}-${this.databoxSource}`;
			document.getElementById(e) ? this.targetReady = !0 : (this._targetObserver = new MutationObserver(() => {
				document.getElementById(e) && (this._targetObserver.disconnect(), this.targetReady = !0);
			}), this._targetObserver.observe(document.body, {
				childList: !0,
				subtree: !0
			}));
		}
		document.documentElement.addEventListener("dsfr.theme", (e) => {
			this.chartId !== "" && this.changeColors(e.detail.theme);
		});
	},
	beforeUnmount() {
		this._targetObserver && this._targetObserver.disconnect();
	},
	methods: {
		resetData() {
			this.chart && this.chart.destroy(), this.datasets = [], this.labels = [], this.xparse = [], this.yparse = [], this.nameParse = [], this.tmpColorParse = [], this.colorParse = [], this.colorHover = [];
		},
		getData() {
			try {
				this.xparse = JSON.parse(this.x), this.yparse = JSON.parse(this.y);
			} catch (e) {
				console.error("Erreur lors du parsing des données x ou y:", e);
				return;
			}
			let e = [];
			if (this.name) try {
				e = JSON.parse(this.name);
			} catch (e) {
				console.error("Erreur lors du parsing de name:", e);
			}
			this.nameParse = [];
			for (let t = 0; t < this.yparse.length; t++) e[t] ? this.nameParse.push(e[t]) : this.nameParse.push(`Série ${t + 1}`);
			this.labels = this.xparse[0], this.loadColors(), this.datasets = this.yparse.map((e, t) => ({
				data: e,
				fill: !0,
				pointRadius: 5,
				pointHoverRadius: 5,
				borderColor: this.colorParse[t],
				backgroundColor: Tw(this.colorParse[t]).alpha(.3).hex(),
				hoverBorderColor: this.colorHover[t],
				hoverBackgroundColor: this.colorHover[t],
				pointBorderColor: this.colorParse[t],
				pointBackgroundColor: this.colorParse[t],
				pointHoverBackgroundColor: this.colorHover[t],
				pointHoverBorderColor: this.colorHover[t]
			}));
		},
		loadColors() {
			let { colorParse: e, colorHover: t } = Dw({
				yparse: this.yparse.map(() => [1]),
				tmpColorParse: this.tmpColorParse,
				selectedPalette: this.selectedPalette
			});
			this.colorParse = e.map((e) => e[0]), this.colorHover = t.map((e) => e[0]);
		},
		choosePalette() {
			return zw(this.selectedPalette);
		},
		changeColors(e) {
			this.loadColors(), this.chart.data.datasets.forEach((e, t) => {
				e.borderColor = this.colorParse[t], e.backgroundColor = Tw(this.colorParse[t]).alpha(.3).hex(), e.hoverBorderColor = this.colorHover[t], e.hoverBackgroundColor = this.colorHover[t], e.pointBorderColor = this.colorParse[t], e.pointBackgroundColor = this.colorParse[t], e.pointHoverBackgroundColor = this.colorHover[t], e.pointHoverBorderColor = this.colorHover[t];
			}), this.chart.options.scales.r.pointLabels.color = e === "dark" ? "#cecece" : J.defaults.color, this.chart.update("none");
		},
		createChart() {
			this.chart && this.chart.destroy(), this.getData();
			let e = this.$refs[this.chartId].getContext("2d");
			this.chart = new J(e, {
				type: "radar",
				data: {
					labels: this.labels,
					datasets: this.datasets
				},
				options: {
					aspectRatio: this.aspectRatio,
					scales: { r: {
						angleLines: {
							display: !0,
							borderDash: [3, 3]
						},
						ticks: { display: !1 },
						grid: { color: "#6b6b6b" },
						suggestedMin: this.scaleMin,
						suggestedMax: this.scaleMax
					} },
					plugins: {
						legend: { display: !1 },
						tooltip: {
							enabled: !1,
							mode: "index",
							displayColors: !1,
							backgroundColor: "#6b6b6b",
							callbacks: {
								label: (e) => this.datasets.map((t) => this.formatNumber(t.data[e.dataIndex])),
								title: (e) => e[0].label,
								labelTextColor: () => this.colorParse
							},
							external: (e) => {
								let t = (document.getElementById(`${this.databoxId}-${this.databoxType}-${this.databoxSource}`) || this.$el.nextElementSibling).querySelector(".tooltip"), n = e.tooltip;
								if (!t) return;
								if (!n || n.opacity === 0) {
									t.style.opacity = 0;
									return;
								}
								if (t.classList.remove("above", "below", "no-transform"), n.yAlign ? t.classList.add(n.yAlign) : t.classList.add("no-transform"), n.body) {
									let e = [this.xparse[0][n.dataPoints[0].dataIndex]], r = n.body.map((e) => e.lines), i = t.querySelector(".tooltip_header.fr-text--sm.fr-mb-0");
									i.innerText = e[0];
									let a = t.querySelector(".tooltip_value");
									a.innerHTML = "", r[0].forEach((e, t) => {
										if (e && e !== "NaN") {
											let n = `${e}${this.unitTooltip ? ` ${this.unitTooltip}` : ""}`;
											a.innerHTML += `
                        <div class="tooltip_value-content">
                          <span class="tooltip_dot" style="background-color:${this.colorParse[t]};"></span>
                          <p class="tooltip_place fr-mb-0">${n}</p>
                        </div>
                      `;
										}
									});
								}
								let { offsetLeft: r, offsetTop: i } = this.chart.canvas, a = Number(this.chart.canvas.style.width.replace(/\D/g, "")), o = Number(this.chart.canvas.style.height.replace(/\D/g, "")), s = r + n.caretX + 10, c = i + n.caretY - 20;
								s + t.clientWidth > r + a && (s = r + n.caretX - t.clientWidth - 10), c + t.clientHeight > i + .9 * o && (c = i + n.caretY - t.clientHeight + 20), s < r && (s = r + n.caretX - t.clientWidth / 2, c = i + n.caretY - t.clientHeight - 20), t.style.position = "absolute", t.style.padding = `${n.padding}px ${n.padding}px`, t.style.pointerEvents = "none", t.style.left = `${s}px`, t.style.top = `${c}px`, t.style.opacity = 1;
							}
						}
					}
				}
			});
		}
	}
}, aD = { class: "fr-col-12" }, oD = { class: "chart" }, sD = ["aria-labelledby", "aria-label"], cD = { class: "chart_legend fr-mb-0 fr-mt-4v" }, lD = { class: "fr-text--sm fr-text--bold fr-ml-1w fr-mb-0" }, uD = {
	key: 0,
	class: "flex fr-mt-1w"
}, dD = { class: "fr-text--xs" };
function fD(e, t, n, r, i, a) {
	return !n.databoxId || i.targetReady ? (I(), Ao(Qr, {
		key: 0,
		to: "#" + n.databoxId + "-" + n.databoxType + "-" + n.databoxSource,
		disabled: !n.databoxId
	}, [R("div", {
		ref: i.widgetId,
		class: "widget_container fr-grid-row"
	}, [R("div", aD, [R("div", oD, [
		t[0] ||= R("div", { class: "tooltip" }, [R("div", { class: "tooltip_header fr-text--sm fr-mb-0" }), R("div", { class: "tooltip_body" }, [R("div", { class: "tooltip_value" })])], -1),
		R("canvas", {
			ref: i.chartId,
			role: "img",
			"aria-labelledby": n.databoxId ? "title-" + n.databoxId : null,
			"aria-label": n.databoxId ? null : "Diagramme en étoile"
		}, null, 8, sD),
		R("div", cD, [(I(!0), L(F, null, Pi(i.nameParse, (t, n) => (I(), L("div", {
			key: n,
			class: "flex fr-mt-3v fr-mb-1v"
		}, [R("span", {
			class: "legend_dot",
			style: k({ "background-color": i.colorParse[n] })
		}, null, 4), R("p", lD, j(e.capitalize(t)), 1)]))), 128))]),
		n.date ? (I(), L("div", uD, [R("p", dD, "Mise à jour : " + j(n.date), 1)])) : B("", !0)
	])])], 512)], 8, ["to", "disabled"])) : B("", !0);
}
var pD = /* @__PURE__ */ fb(iD, [["render", fD]]);
//#endregion
//#region src/components/ScatterChart.vue
J.register(sh);
var mD = {
	name: "ScatterChart",
	mixins: [$y],
	props: {
		databoxId: {
			type: String,
			default: null
		},
		databoxType: {
			type: String,
			default: null
		},
		databoxSource: {
			type: String,
			default: "default"
		},
		x: {
			type: String,
			required: !0
		},
		y: {
			type: String,
			required: !0
		},
		xMin: {
			type: [Number, String],
			default: ""
		},
		xMax: {
			type: [Number, String],
			default: ""
		},
		yMin: {
			type: [Number, String],
			default: ""
		},
		yMax: {
			type: [Number, String],
			default: ""
		},
		name: {
			type: String,
			default: ""
		},
		vline: {
			type: String,
			default: ""
		},
		vlinecolor: {
			type: String,
			default: ""
		},
		vlinename: {
			type: String,
			default: ""
		},
		hline: {
			type: String,
			default: ""
		},
		hlinecolor: {
			type: String,
			default: ""
		},
		hlinename: {
			type: String,
			default: ""
		},
		showLine: {
			type: [Boolean, String],
			default: !1
		},
		date: {
			type: String,
			default: ""
		},
		aspectRatio: {
			type: [Number, String],
			default: 2
		},
		selectedPalette: {
			type: String,
			default: ""
		},
		unitTooltip: {
			type: String,
			default: ""
		}
	},
	data() {
		return this.chart = void 0, {
			widgetId: "",
			chartId: "",
			datasets: [],
			labels: [],
			xAxisType: "",
			xparse: [],
			yparse: [],
			nameParse: [],
			tmpColorParse: [],
			colorParse: [],
			vlineParse: [],
			vlineColorParse: [],
			tmpVlineColorParse: [],
			vlineNameParse: [],
			hlineParse: [],
			hlineColorParse: [],
			tmpHlineColorParse: [],
			hlineNameParse: [],
			colorHover: [],
			targetReady: !1
		};
	},
	watch: {
		$props: {
			handler() {
				this.chartId && (this.resetData(), this.getData(), this.createChart());
			},
			deep: !0,
			immediate: !0
		},
		targetReady(e) {
			e && this.$nextTick(() => {
				this.resetData(), this.createChart();
			});
		}
	},
	created() {
		Qy(), this.chartId = `dsfr-chart-${Math.floor(Math.random() * 1e3)}`, this.widgetId = `dsfr-widget-${Math.floor(Math.random() * 1e3)}`;
	},
	mounted() {
		if (!this.databoxId || !this.databoxType) this.resetData(), this.createChart();
		else {
			let e = `${this.databoxId}-${this.databoxType}-${this.databoxSource}`;
			document.getElementById(e) ? this.targetReady = !0 : (this._targetObserver = new MutationObserver(() => {
				document.getElementById(e) && (this._targetObserver.disconnect(), this.targetReady = !0);
			}), this._targetObserver.observe(document.body, {
				childList: !0,
				subtree: !0
			}));
		}
		document.documentElement.addEventListener("dsfr.theme", (e) => {
			this.chartId !== "" && this.changeColors(e.detail.theme);
		});
	},
	beforeUnmount() {
		this._targetObserver && this._targetObserver.disconnect();
	},
	methods: {
		resetData() {
			this.chart && this.chart.destroy(), this.datasets = [], this.labels = [], this.xAxisType = "", this.xparse = [], this.yparse = [], this.nameParse = [], this.tmpColorParse = [], this.colorParse = [], this.vlineParse = [], this.vlineColorParse = [], this.tmpVlineColorParse = [], this.vlineNameParse = [], this.hlineParse = [], this.hlineColorParse = [], this.tmpHlineColorParse = [], this.hlineNameParse = [], this.colorHover = [];
		},
		getData() {
			try {
				this.xparse = JSON.parse(this.x), this.yparse = JSON.parse(this.y);
			} catch (e) {
				console.error("Erreur lors du parsing des données x ou y:", e);
				return;
			}
			let e = [];
			if (this.name) try {
				e = JSON.parse(this.name);
			} catch (e) {
				console.error("Erreur lors du parsing de name:", e);
			}
			this.nameParse = [];
			for (let t = 0; t < this.yparse.length; t++) e[t] ? this.nameParse.push(e[t]) : this.nameParse.push(`Série ${t + 1}`);
			if (this.vline) {
				this.vlineParse = JSON.parse(this.vline);
				let e = [];
				this.vlinename && (e = JSON.parse(this.vlinename)), this.vlinecolor && (this.tmpVlineColorParse = JSON.parse(this.vlinecolor));
				for (let t = 0; t < this.vlineParse.length; t++) e[t] ? this.vlineNameParse.push(e[t]) : this.vlineNameParse.push(`V${t + 1}`);
			}
			if (this.hline) {
				this.hlineParse = JSON.parse(this.hline);
				let e = [];
				this.hlinename && (e = JSON.parse(this.hlinename)), this.hlinecolor && (this.tmpHlineColorParse = JSON.parse(this.hlinecolor));
				for (let t = 0; t < this.hlineParse.length; t++) e[t] ? this.hlineNameParse.push(e[t]) : this.hlineNameParse.push(`H${t + 1}`);
			}
			this.labels = this.xparse[0], this.xAxisType = parseFloat(this.labels[0]) == this.labels[0] ? "linear" : "category", this.loadColors(), this.datasets = this.yparse.map((e, t) => ({
				data: e,
				fill: !1,
				pointRadius: 5,
				pointHoverRadius: 5,
				borderColor: this.colorParse[t],
				backgroundColor: this.colorParse[t],
				hoverBorderColor: this.colorHover[t],
				hoverBackgroundColor: this.colorHover[t],
				pointBorderColor: this.colorParse[t],
				pointBackgroundColor: this.colorParse[t],
				pointHoverBackgroundColor: this.colorHover[t],
				pointHoverBorderColor: this.colorHover[t],
				showLine: [
					!0,
					"true",
					""
				].includes(this.showLine),
				borderWidth: 2,
				tension: .4
			}));
		},
		createChart() {
			this.chart && this.chart.destroy(), this.getData();
			let e = this.$refs[this.chartId].getContext("2d");
			this.chart = new J(e, {
				type: "scatter",
				data: {
					labels: this.labels,
					datasets: this.datasets
				},
				plugins: [{
					afterDatasetDraw: (e) => {
						this.vlineParse && this.vlineParse.forEach((t, n) => {
							let { ctx: r } = e, i = e.scales.x.getPixelForValue(t);
							r.save(), r.beginPath(), r.moveTo(i, e.scales.y.bottom), r.strokeStyle = this.vlineColorParse[n], r.lineWidth = 3, r.setLineDash([10, 5]), r.lineTo(i, e.scales.y.top), r.stroke(), r.restore();
						}), this.hlineParse && this.hlineParse.forEach((t, n) => {
							let { ctx: r } = e, i = e.scales.y.getPixelForValue(t);
							r.save(), r.beginPath(), r.moveTo(e.scales.x.left, i), r.strokeStyle = this.hlineColorParse[n], r.lineWidth = 3, r.setLineDash([10, 5]), r.lineTo(e.scales.x.right, i), r.stroke(), r.restore();
						});
					},
					afterDraw: (e) => {
						if (e.tooltip?._active && e.tooltip?._active.length) {
							let { ctx: t } = e, { x: n } = e.tooltip.getActiveElements()[0].element.tooltipPosition(), { index: r } = e.tooltip._active[0];
							t.save(), t.beginPath(), t.moveTo(n, e.scales.y.top), t.lineTo(n, e.scales.y.bottom), t.lineWidth = 1, t.strokeStyle = this.colorPrecisionBar, t.setLineDash([10, 5]), t.stroke(), t.restore(), this.yparse.forEach((n) => {
								let i = e.scales.y.getPixelForValue(n[r]);
								t.save(), t.beginPath(), t.moveTo(e.scales.x.left, i), t.lineTo(e.scales.x.right, i), t.lineWidth = 1, t.strokeStyle = this.colorPrecisionBar, t.setLineDash([10, 5]), t.stroke(), t.restore();
							});
						}
					}
				}],
				options: {
					aspectRatio: this.aspectRatio,
					scales: {
						x: {
							offset: !0,
							type: this.xAxisType,
							grid: { drawOnChartArea: !1 },
							ticks: {
								padding: 10,
								callback: (e) => this.xAxisType === "category" ? this.labels[e] : e
							},
							...this.xMin ? { suggestedMin: this.xMin } : {},
							...this.xMax ? { suggestedMax: this.xMax } : {}
						},
						y: {
							grid: { drawTicks: !1 },
							border: { dash: [3] },
							ticks: {
								autoSkip: !1,
								padding: 5,
								maxTicksLimit: 5,
								callback: (e) => Math.abs(e) >= 1e9 ? `${e / 1e9}B` : Math.abs(e) >= 1e6 ? `${e / 1e6}M` : Math.abs(e) >= 1e3 ? `${e / 1e3}K` : e
							},
							...this.yMin ? { suggestedMin: this.yMin } : {},
							...this.yMax ? { suggestedMax: this.yMax } : {}
						}
					},
					plugins: {
						legend: { display: !1 },
						tooltip: {
							enabled: !1,
							displayColors: !1,
							backgroundColor: "#6b6b6b",
							callbacks: {
								label: (e) => this.datasets.map((t) => this.formatNumber(t.data[e.dataIndex])),
								title: (e) => e[0].label,
								labelTextColor: () => this.colorParse
							},
							external: (e) => {
								let t = (document.getElementById(`${this.databoxId}-${this.databoxType}-${this.databoxSource}`) || this.$el.nextElementSibling).querySelector(".tooltip"), n = e.tooltip;
								if (!t) return;
								if (!n || n.opacity === 0) {
									t.style.opacity = 0;
									return;
								}
								if (t.classList.remove("above", "below", "no-transform"), n.yAlign ? t.classList.add(n.yAlign) : t.classList.add("no-transform"), n.body) {
									let e = n.title || [], r = n.body.map((e) => e.lines), i = t.querySelector(".tooltip_header.fr-text--sm.fr-mb-0");
									i.innerText = e[0];
									let a = t.querySelector(".tooltip_value");
									a.innerHTML = "", r[0].forEach((e, t) => {
										if (e && e !== "NaN") {
											let n = `${e}${this.unitTooltip ? ` ${this.unitTooltip}` : ""}`;
											a.innerHTML += `
                        <div class="tooltip_value-content">
                          <span class="tooltip_dot" style="background-color:${this.colorParse[t]};"></span>
                          <p class="tooltip_place fr-mb-0">${n}</p>
                        </div>
                      `;
										}
									});
								}
								let { offsetLeft: r, offsetTop: i } = this.chart.canvas, a = Number(this.chart.canvas.style.width.replace(/\D/g, "")), o = Number(this.chart.canvas.style.height.replace(/\D/g, "")), s = r + n.caretX + 10, c = i + n.caretY - 20;
								s + t.clientWidth > r + a && (s = r + n.caretX - t.clientWidth - 10), c + t.clientHeight > i + .9 * o && (c = i + n.caretY - t.clientHeight + 20), s < r && (s = r + n.caretX - t.clientWidth / 2, c = i + n.caretY - t.clientHeight - 20), t.style.position = "absolute", t.style.padding = `${n.padding}px ${n.padding}px`, t.style.pointerEvents = "none", t.style.left = `${s}px`, t.style.top = `${c}px`, t.style.opacity = 1;
							}
						}
					}
				}
			});
		},
		loadColors() {
			let { colorParse: e, colorHover: t, vlineColorParse: n, hlineColorParse: r } = kw({
				yparse: this.yparse,
				tmpColorParse: this.tmpColorParse,
				selectedPalette: this.selectedPalette,
				vlineParse: this.vlineParse,
				tmpVlineColorParse: this.tmpVlineColorParse,
				hlineParse: this.hlineParse,
				tmpHlineColorParse: this.tmpHlineColorParse
			});
			this.colorParse = e, this.colorHover = t, this.vlineColorParse = n, this.hlineColorParse = r;
		},
		choosePalette() {
			return zw(this.selectedPalette);
		},
		changeColors(e) {
			this.loadColors(), this.chart.data.datasets.forEach((e, t) => {
				e.borderColor = this.colorParse[t], e.backgroundColor = this.colorParse[t], e.hoverBorderColor = this.colorHover[t], e.hoverBackgroundColor = this.colorHover[t], e.pointBorderColor = this.colorParse[t], e.pointBackgroundColor = this.colorParse[t], e.pointHoverBorderColor = this.colorHover[t], e.pointHoverBackgroundColor = this.colorHover[t];
			}), this.chart.options.scales.x.ticks.color = e === "dark" ? "#cecece" : J.defaults.color, this.chart.options.scales.y.ticks.color = e === "dark" ? "#cecece" : J.defaults.color, this.chart.update("none");
		}
	}
}, hD = { class: "fr-col-12" }, gD = { class: "chart" }, _D = ["aria-labelledby", "aria-label"], vD = { class: "chart_legend fr-mb-0 fr-mt-4v" }, yD = { class: "fr-text--sm fr-text--bold fr-ml-1w fr-mb-0" }, bD = { class: "fr-text--sm fr-text--bold fr-ml-1w fr-mb-0" }, xD = { class: "fr-text--sm fr-text--bold fr-ml-1w fr-mb-0" }, SD = {
	key: 0,
	class: "flex fr-mt-1w"
}, CD = { class: "fr-text--xs" };
function wD(e, t, n, r, i, a) {
	return !n.databoxId || i.targetReady ? (I(), Ao(Qr, {
		key: 0,
		to: "#" + n.databoxId + "-" + n.databoxType + "-" + n.databoxSource,
		disabled: !n.databoxId
	}, [R("div", {
		ref: i.widgetId,
		class: "widget_container fr-grid-row"
	}, [R("div", hD, [R("div", gD, [
		t[0] ||= R("div", { class: "tooltip" }, [R("div", { class: "tooltip_header fr-text--sm fr-mb-0" }), R("div", { class: "tooltip_body" }, [R("div", { class: "tooltip_value" })])], -1),
		R("canvas", {
			ref: i.chartId,
			role: "img",
			"aria-labelledby": n.databoxId ? "title-" + n.databoxId : null,
			"aria-label": n.databoxId ? null : "Nuage de points"
		}, null, 8, _D),
		R("div", vD, [(I(!0), L(F, null, Pi(i.nameParse, (t, n) => (I(), L("div", {
			key: n,
			class: "flex fr-mt-3v fr-mb-1v"
		}, [R("span", {
			class: "legend_dot",
			style: k({ "background-color": i.colorParse[n] })
		}, null, 4), R("p", yD, j(e.capitalize(t)), 1)]))), 128))]),
		(I(!0), L(F, null, Pi(i.hlineNameParse, (t, n) => (I(), L("div", {
			key: n,
			class: "flex fr-mt-3v"
		}, [
			R("span", {
				class: "legend_dash_line",
				style: k({ "background-color": i.hlineColorParse[n] })
			}, null, 4),
			R("span", {
				class: "legend_dash_line legend_dash_line_end",
				style: k({ "background-color": i.hlineColorParse[n] })
			}, null, 4),
			R("p", bD, j(e.capitalize(t)), 1)
		]))), 128)),
		(I(!0), L(F, null, Pi(i.vlineNameParse, (t, n) => (I(), L("div", {
			key: n,
			class: "flex fr-mt-3v fr-mb-1v"
		}, [
			R("span", {
				class: "legend_dash_line",
				style: k({ "background-color": i.vlineColorParse[n] })
			}, null, 4),
			R("span", {
				class: "legend_dash_line legend_dash_line_end",
				style: k({ "background-color": i.vlineColorParse[n] })
			}, null, 4),
			R("p", xD, j(e.capitalize(t)), 1)
		]))), 128)),
		n.date ? (I(), L("div", SD, [R("p", CD, "Mise à jour : " + j(n.date), 1)])) : B("", !0)
	])])], 512)], 8, ["to", "disabled"])) : B("", !0);
}
var TD = /* @__PURE__ */ fb(mD, [["render", wD]]), ED = {
	name: "TableChart",
	mixins: [$y],
	props: {
		databoxId: {
			type: String,
			default: null
		},
		databoxType: {
			type: String,
			default: null
		},
		databoxSource: {
			type: String,
			default: "global"
		},
		x: {
			type: String,
			default: ""
		},
		y: {
			type: String,
			default: ""
		},
		subX: {
			type: String,
			default: null
		},
		subY: {
			type: String,
			default: null
		},
		line: {
			type: String,
			default: ""
		},
		maxOverflow: {
			type: [Number, String],
			default: 128
		},
		name: {
			type: String,
			default: ""
		},
		tableName: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			widgetId: "",
			tableId: "",
			xparse: [],
			yparse: [],
			subXParse: [],
			subYParse: [],
			lineParse: [],
			nameParse: [],
			selectedIndex: -1,
			targetReady: !1
		};
	},
	watch: {
		$props: {
			handler() {
				this.tableId && (this.resetData(), this.getData());
			},
			deep: !0,
			immediate: !0
		},
		targetReady(e) {
			e && this.$nextTick(() => {
				this.resetData(), this.getData(), this.observeRelatedChart();
			});
		}
	},
	created() {
		this.tableId = `dsfr-table-${Math.floor(Math.random() * 1e3)}`, this.widgetId = `dsfr-widget-${Math.floor(Math.random() * 1e3)}`;
	},
	mounted() {
		if (!this.databoxId || !this.databoxType) this.resetData(), this.getData(), this.observeRelatedChart();
		else {
			let e = `${this.databoxId}-${this.databoxType}-${this.databoxSource}`;
			document.getElementById(e) ? this.targetReady = !0 : (this._targetObserver = new MutationObserver(() => {
				document.getElementById(e) && (this._targetObserver.disconnect(), this.targetReady = !0);
			}), this._targetObserver.observe(document.body, {
				childList: !0,
				subtree: !0
			}));
		}
	},
	beforeUnmount() {
		this._targetObserver && this._targetObserver.disconnect(), this._indexObserver && this._indexObserver.disconnect();
	},
	methods: {
		resetData() {
			this.xparse = [], this.yparse = [], this.lineParse = [], this.nameParse = [];
		},
		getData() {
			if (this.x && this.y) try {
				this.xparse = JSON.parse(this.x ?? "[]"), this.yparse = JSON.parse(this.y ?? "[]"), this.subXParse = JSON.parse(this.subX), this.subYParse = JSON.parse(this.subY);
			} catch (e) {
				console.error("Erreur lors du parsing des données x ou y:", e);
				return;
			}
			if (this.line) try {
				this.lineParse = JSON.parse(this.line ?? "[]");
			} catch (e) {
				console.error("Erreur lors du parsing des données line:", e);
				return;
			}
			let e = [];
			if (this.name) try {
				e = JSON.parse(this.name);
			} catch (e) {
				console.error("Erreur lors du parsing de name:", e);
			}
			this.nameParse = [];
			for (let t = 0; t < this.yparse.length; t++) e[t] ? this.nameParse.push(e[t]) : this.nameParse.push(`Série ${t + 1}`);
			for (let t = 0; t < (this.lineParse.length ? this.lineParse[0].length : 0); t++) e[t] ? this.nameParse.push(e[t]) : this.nameParse.push(`Série ${t + 1}`);
		},
		getClass(e) {
			let t = "";
			return typeof e == "string" && e.replace(/<[^>]*>/g, "").length > parseInt(this.maxOverflow) && (t += "cell-overflow "), typeof e == "number" ? t += "cell-number " : t += "cell-text ", t;
		},
		observeRelatedChart() {
			let e = this.databoxSource === "global" ? "default" : `${this.databoxSource}`, t = document.querySelector(`#${this.databoxId}-chart-${e} .widget_container`), n = {
				attributes: !0,
				subtree: !1,
				childList: !1
			};
			t && (this._indexObserver = new MutationObserver((e) => {
				for (let t of e) t.attributeName === "data-index" && (this.selectedIndex = parseInt(t.target.getAttribute("data-index")), this.selectedIndex === -1 ? (this.xparse = JSON.parse(this.x), this.yparse = JSON.parse(this.y)) : (this.xparse = this.subXParse[this.selectedIndex], this.yparse = [this.subYParse[this.selectedIndex]]));
			}), this._indexObserver.observe(t, n));
		}
	}
}, DD = { class: "fr-table__wrapper" }, OD = { class: "fr-table__container" }, kD = { class: "fr-table__content" }, AD = ["aria-labelledby", "aria-label"], jD = {
	key: 0,
	scope: "col"
}, MD = ["innerHTML"];
function ND(e, t, n, r, i, a) {
	return !n.databoxId || i.targetReady ? (I(), Ao(Qr, {
		key: 0,
		to: "#" + n.databoxId + "-" + n.databoxType + "-" + n.databoxSource,
		disabled: !n.databoxId
	}, [R("div", {
		ref: i.widgetId,
		class: "widget_container"
	}, [R("div", {
		ref: i.tableId,
		class: "fr-table",
		style: {
			maxHeight: "30rem",
			overflow: "auto"
		}
	}, [R("div", DD, [R("div", OD, [R("div", kD, [R("table", {
		"aria-labelledby": n.databoxId ? "title-" + n.databoxId : null,
		"aria-label": n.databoxId ? null : "Tableau de données"
	}, [R("thead", null, [R("tr", null, [i.xparse.length ? (I(), L("th", jD, j(n.tableName), 1)) : B("", !0), (I(!0), L(F, null, Pi(i.nameParse, (e, t) => (I(), L("th", {
		key: t,
		scope: "col"
	}, j(e), 1))), 128))])]), R("tbody", null, [(I(!0), L(F, null, Pi(i.xparse, (t, n) => (I(), L("tr", { key: n }, [R("td", { class: A(a.getClass(t)) }, j(t), 3), (I(!0), L(F, null, Pi(i.yparse, (t, r) => (I(), L("td", {
		key: r,
		class: A(a.getClass(t[n]))
	}, j(e.formatNumber(t[n])), 3))), 128))]))), 128)), (I(!0), L(F, null, Pi(i.lineParse, (e, t) => (I(), L("tr", { key: t }, [(I(!0), L(F, null, Pi(e, (e, t) => (I(), L("td", {
		key: t,
		class: A(a.getClass(e)),
		innerHTML: e
	}, null, 10, MD))), 128))]))), 128))])], 8, AD)])])])], 512)], 512)], 8, ["to", "disabled"])) : B("", !0);
}
var PD = /* @__PURE__ */ fb(ED, [["render", ND], ["__scopeId", "data-v-ddfd6e22"]]);
customElements.define("data-box", /* @__PURE__ */ pc(cx, { shadowRoot: !1 })), customElements.define("bar-chart", /* @__PURE__ */ pc(Zw, { shadowRoot: !1 })), customElements.define("bar-line-chart", /* @__PURE__ */ pc(fT, { shadowRoot: !1 })), customElements.define("gauge-chart", /* @__PURE__ */ pc(kT, { shadowRoot: !1 })), customElements.define("line-chart", /* @__PURE__ */ pc(VT, { shadowRoot: !1 })), customElements.define("map-chart", /* @__PURE__ */ pc(FE, { shadowRoot: !1 })), customElements.define("map-chart-reg", /* @__PURE__ */ pc(GE, { shadowRoot: !1 })), customElements.define("pie-chart", /* @__PURE__ */ pc(rD, { shadowRoot: !1 })), customElements.define("radar-chart", /* @__PURE__ */ pc(pD, { shadowRoot: !1 })), customElements.define("scatter-chart", /* @__PURE__ */ pc(TD, { shadowRoot: !1 })), customElements.define("table-chart", /* @__PURE__ */ pc(PD, { shadowRoot: !1 }));
//#endregion
