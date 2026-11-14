import{b as C,c as q,a as U,k as A,D as d,d as z,r as K}from"../../DefineExtensionEntry-d9f2f045.js";import{n as V,i as $,a as P}from"../../Shortcut-4461e19e.js";import{c as G}from"../../chunk-E2HJRHOS-fb5a0be5.js";function N(e){const t=new Set,n=document.location.href;for(let o=0;o<e.rangeCount;o++){const a=e.getRangeAt(o).commonAncestorContainer;if(X(a))for(const i of a.querySelectorAll("a"))e.containsNode(i,!0)&&i.href&&i.href&&t.add({link:i.href,headers:null,description:i.innerText,downloadPage:n,suggestedName:null,type:"http"})}return[...t]}function X(e){return e.nodeType===Node.ELEMENT_NODE}const I="ab_dm_popup_class";let E=!1,Z=()=>{};function Y(e){Z=e}function j(e){E&&m(),J(e,()=>{try{Z()}finally{m()}},m),E=!0}function m(){document.removeEventListener("mousedown",m),document.body.querySelectorAll(`.${I}`).forEach(e=>{e.remove()}),E=!1}function J(e,t,n){const o=document.createElement("div"),a=o.attachShadow({mode:"open"}),i=C.i18n.getMessage("selection_popup_download_selected"),r=document.createElement("style");r.textContent=`
    .abdm {
        font-size: 12px;
        color: #aaaaaa;
        background: linear-gradient(to bottom right, #2E3038, #171820);
        display: flex;
        align-items: stretch;
        flex-direction: row;
        cursor: pointer;
        border-radius: 999px;
        border: rgba(255,255,255,25%) solid 1px;
        overflow: hidden;
        user-select: none;
        box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;
    }
    .abdm * {
        transition: background-color ease 300ms;
    }
    .abdm .download-btn .appIcon {
        width: 12px;
        height: 12px;
    }
    .abdm .download-btn > * {
        padding-left: 4px;
        padding-right: 4px;
    }
    .abdm .download-btn {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        padding-left: 4px;
        padding-right: 8px;
        padding-top: 4px;
        padding-bottom: 4px;
    }
    .abdm .download-btn:hover {
        background: rgba(255, 255, 255, 25%);
    }
    .abdm .close-btn {
        background: rgba(255, 255, 255, 5%);
        padding-top: 4px;
        padding-bottom: 4px;
        padding-left: 4px;
        padding-right: 8px;
        display: flex;
        align-items: center;
        height: auto;
    }
    .abdm .close-btn:hover {
        background: rgba(255, 255, 255, 25%);
    }
    `,a.appendChild(r);const s=`
<div dir="ltr" class="abdm">
    <div class="download-btn">
        <div class="appIcon">
            <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M17.9267 0.594672C17.9267 0.266244 17.673 0 17.36 0H14.64C14.327 0 14.0733 0.266244 14.0733 0.594672V11.8934C14.0733 12.2219 13.8196 12.4881 13.5066 12.4881H12.5677C12.1068 12.4881 11.8386 13.0348 12.1066 13.4284L15.5389 18.471C15.7649 18.803 16.2351 18.803 16.4611 18.471L19.8934 13.4284C20.1614 13.0348 19.8932 12.4881 19.4323 12.4881H18.4934C18.1804 12.4881 17.9267 12.2219 17.9267 11.8934V0.594672ZM1.21792 22.1229C0.413852 20.1817 0 18.1011 0 16H4.80088C6.53592 16 7.88743 17.4585 8.5514 19.0615C8.95343 20.0321 9.54272 20.914 10.2856 21.6569C11.0285 22.3997 11.9104 22.989 12.881 23.391C13.8516 23.7931 14.8919 24 15.9424 24C16.993 24 18.0333 23.7931 19.0039 23.391C19.9745 22.989 20.8564 22.3997 21.5993 21.6569C22.3422 20.914 22.9315 20.0321 23.3335 19.0615C23.9975 17.4585 25.349 16 27.084 16H32C32 18.1011 31.5861 20.1817 30.7821 22.1229C29.978 24.0642 28.7994 25.828 27.3137 27.3137C25.828 28.7995 24.0642 29.978 22.1229 30.7821C20.1817 31.5862 18.1011 32 16 32C13.8989 32 11.8183 31.5862 9.87708 30.7821C7.93587 29.978 6.17202 28.7995 4.68629 27.3137C3.20057 25.828 2.022 24.0642 1.21792 22.1229ZM7.84788 3.4742C7.41753 3.82071 7.34399 4.45754 7.68363 4.89659C8.02327 5.33565 8.64748 5.41067 9.07783 5.06416L10.5389 3.88776C10.9692 3.54125 11.0428 2.90443 10.7031 2.46537C10.3635 2.02631 9.73928 1.95129 9.30893 2.2978L7.84788 3.4742ZM24.3121 3.4742C24.7425 3.82071 24.816 4.45754 24.4764 4.89659C24.1367 5.33565 23.5125 5.41067 23.0822 5.06416L21.6211 3.88776C21.1908 3.54125 21.1172 2.90443 21.4569 2.46537C21.7965 2.02631 22.4207 1.95129 22.8511 2.2978L24.3121 3.4742ZM3.02879 11.7691C2.51877 11.5639 2.26836 10.9758 2.46947 10.4555L3.15224 8.68897C3.35335 8.16864 3.92983 7.91316 4.43985 8.11834C4.94986 8.32352 5.20028 8.91166 4.99917 9.43199L4.3164 11.1985C4.11528 11.7188 3.5388 11.9743 3.02879 11.7691ZM29.6905 10.4555C29.8916 10.9758 29.6412 11.5639 29.1312 11.7691C28.6212 11.9743 28.0447 11.7188 27.8436 11.1985L27.1608 9.43199C26.9597 8.91166 27.2101 8.32352 27.7202 8.11834C28.2302 7.91316 28.8067 8.16864 29.0078 8.68897L29.6905 10.4555Z" fill="url(#paint0_linear_526_2322)"/>
                <path d="M27.3137 27.3138C24.3131 30.3144 20.2434 32.0001 16 32.0001C11.7565 32.0001 7.68686 30.3144 4.68628 27.3138V27.3138C6.3723 25.6278 9.09946 25.724 11.2807 26.6871C12.7534 27.3375 14.3589 27.6828 16 27.6828C17.6411 27.6828 19.2466 27.3375 20.7193 26.6871C22.9005 25.724 25.6277 25.6278 27.3137 27.3138V27.3138Z" fill="black" fill-opacity="0.25"/>
                <defs>
                    <linearGradient id="paint0_linear_526_2322" x1="33.3743" y1="15.3424" x2="-1.12085" y2="15.3424" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#C631FF"/>
                        <stop offset="1" stop-color="#4DC4FE"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>
        <span>${i}</span>
    </div>
    <div class="close-btn">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="currentColor"/>
        </svg>
    </div>
</div>
    `,p=document.createElement("div");p.innerHTML=s,a.appendChild(p.firstElementChild),o.classList.add(I),o.style.position="absolute",document.body.append(o);const f=o.getBoundingClientRect().width,u=e.x+f>=window.innerWidth?window.innerWidth-(f+Q()):e.x,W=e.y;return a.querySelector(".download-btn")?.addEventListener("mousedown",v=>{v.stopPropagation(),t()}),a.querySelector(".close-btn")?.addEventListener("mousedown",v=>{v.stopPropagation(),n()}),o.style.zIndex="9999",o.style.top=W+"px",o.style.left=u+"px",o}function Q(){return window.innerWidth-document.body.clientWidth}let l=null,B=!1,c=!1,O;function ee(){if(l)return l;const e=C.i18n.getMessage("download_media_title"),t=document.createElement("div");t.className="abdm-extension",t.style.position="fixed",t.style.top="8px",t.style.left="8px",t.style.zIndex="999999",t.style.display="flex",t.style.flexDirection="column",t.style.alignItems="start",t.style.gap="2px",t.style.direction="ltr";const n=document.createElement("style");n.textContent=`
      .abdm-extension * {
        font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        box-sizing: border-box;
      }
      .abdm-media-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        border-radius: 16px;
        padding: 6px 12px;
        background: linear-gradient(to bottom right, #2E3038, #171820);
        border: rgba(255,255,255,0.25) solid 1px;
        box-shadow: rgba(0,0,0,0.07) 0px 1px 2px, rgba(0,0,0,0.07) 0px 2px 4px, rgba(0,0,0,0.07) 0px 4px 8px;
        cursor: pointer;
        color: #aaaaaa;
        font-size: 12px;
      }
      .abdm-media-header .appIcon,
      .abdm-media-header .title-wrapper,
      .abdm-media-header .abdm-media-close-btn {
        display: flex;
        align-items: center;
      }
      .abdm-media-header .appIcon {
        width: 12px;
        height: 12px;
        flex-shrink: 0;
      }
      .abdm-media-header .title-wrapper {
        gap: 4px;
        user-select: none; /* header text not selectable */
      }
      .abdm-media-header .abdm-media-close-btn {
        cursor: pointer;
        width: 12px;
        height: 12px;
        flex-shrink: 0;
        color: #aaa;
      }
      .abdm-media-header .abdm-media-close-btn:hover {
        color: #fff;
      }
      .abdm-media-list {
        background: linear-gradient(to bottom right, #2E3038, #171820);
        border: rgba(255,255,255,0.25) solid 1px;
        border-radius: 16px;
        overflow: auto;
        color: #ccc;
        font-size: 12px;
        box-shadow: rgba(0,0,0,0.15) 0px 4px 10px;
        margin-top: 4px;
        display: none; /* start hidden */
        max-height: 50vh; /* scroll if too long */
      }
      .abdm-media-item {
        padding: 8px 12px;
        border-bottom: rgba(255,255,255,0.1) solid 1px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: start;
        min-width: 160px;
      }
      .abdm-media-item:last-child {
        border-bottom: none;
      }
      .abdm-media-item:hover {
        background: rgba(255,255,255,0.08);
      }
      .abdm-item-title {
        font-weight: 500;
        color: #fff;
      }
      .abdm-item-details {
        font-size: 10px;
        opacity: 0.7;
      }
    `,t.appendChild(n);const o=`
    <div class="abdm-media-header">
      <div class="appIcon">
        <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M17.9267 0.594672C17.9267 0.266244 17.673 0 17.36 0H14.64C14.327 0 14.0733 0.266244 14.0733 0.594672V11.8934C14.0733 12.2219 13.8196 12.4881 13.5066 12.4881H12.5677C12.1068 12.4881 11.8386 13.0348 12.1066 13.4284L15.5389 18.471C15.7649 18.803 16.2351 18.803 16.4611 18.471L19.8934 13.4284C20.1614 13.0348 19.8932 12.4881 19.4323 12.4881H18.4934C18.1804 12.4881 17.9267 12.2219 17.9267 11.8934V0.594672ZM1.21792 22.1229C0.413852 20.1817 0 18.1011 0 16H4.80088C6.53592 16 7.88743 17.4585 8.5514 19.0615C8.95343 20.0321 9.54272 20.914 10.2856 21.6569C11.0285 22.3997 11.9104 22.989 12.881 23.391C13.8516 23.7931 14.8919 24 15.9424 24C16.993 24 18.0333 23.7931 19.0039 23.391C19.9745 22.989 20.8564 22.3997 21.5993 21.6569C22.3422 20.914 22.9315 20.0321 23.3335 19.0615C23.9975 17.4585 25.349 16 27.084 16H32C32 18.1011 31.5861 20.1817 30.7821 22.1229C29.978 24.0642 28.7994 25.828 27.3137 27.3137C25.828 28.7995 24.0642 29.978 22.1229 30.7821C20.1817 31.5862 18.1011 32 16 32C13.8989 32 11.8183 31.5862 9.87708 30.7821C7.93587 29.978 6.17202 28.7995 4.68629 27.3137C3.20057 25.828 2.022 24.0642 1.21792 22.1229ZM7.84788 3.4742C7.41753 3.82071 7.34399 4.45754 7.68363 4.89659C8.02327 5.33565 8.64748 5.41067 9.07783 5.06416L10.5389 3.88776C10.9692 3.54125 11.0428 2.90443 10.7031 2.46537C10.3635 2.02631 9.73928 1.95129 9.30893 2.2978L7.84788 3.4742ZM24.3121 3.4742C24.7425 3.82071 24.816 4.45754 24.4764 4.89659C24.1367 5.33565 23.5125 5.41067 23.0822 5.06416L21.6211 3.88776C21.1908 3.54125 21.1172 2.90443 21.4569 2.46537C21.7965 2.02631 22.4207 1.95129 22.8511 2.2978L24.3121 3.4742ZM3.02879 11.7691C2.51877 11.5639 2.26836 10.9758 2.46947 10.4555L3.15224 8.68897C3.35335 8.16864 3.92983 7.91316 4.43985 8.11834C4.94986 8.32352 5.20028 8.91166 4.99917 9.43199L4.3164 11.1985C4.11528 11.7188 3.5388 11.9743 3.02879 11.7691ZM29.6905 10.4555C29.8916 10.9758 29.6412 11.5639 29.1312 11.7691C28.6212 11.9743 28.0447 11.7188 27.8436 11.1985L27.1608 9.43199C26.9597 8.91166 27.2101 8.32352 27.7202 8.11834C28.2302 7.91316 28.8067 8.16864 29.0078 8.68897L29.6905 10.4555Z" fill="url(#paint0_linear_526_2322)"/>
                <path d="M27.3137 27.3138C24.3131 30.3144 20.2434 32.0001 16 32.0001C11.7565 32.0001 7.68686 30.3144 4.68628 27.3138V27.3138C6.3723 25.6278 9.09946 25.724 11.2807 26.6871C12.7534 27.3375 14.3589 27.6828 16 27.6828C17.6411 27.6828 19.2466 27.3375 20.7193 26.6871C22.9005 25.724 25.6277 25.6278 27.3137 27.3138V27.3138Z" fill="black" fill-opacity="0.25"/>
                <defs>
                    <linearGradient id="paint0_linear_526_2322" x1="33.3743" y1="15.3424" x2="-1.12085" y2="15.3424" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#C631FF"/>
                        <stop offset="1" stop-color="#4DC4FE"/>
                    </linearGradient>
                </defs>
            </svg>
      </div>
      <div class="title-wrapper">
        <span>${e}</span>
        (<span class="count-text">0</span>)
      </div>
      <div class="abdm-media-close-btn">
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="currentColor"/>
        </svg>
      </div>
    </div>
    <div class="abdm-media-list"></div>
    `,a=document.createElement("div");for(a.innerHTML=o;a.firstChild;)t.appendChild(a.firstChild);const i=t.querySelector(".abdm-media-header"),r=t.querySelector(".abdm-media-list");return i.addEventListener("click",s=>{s.target.classList.contains("abdm-media-close-btn")||(c=!c,r.style.display=c?"block":"none")}),t.querySelector(".abdm-media-close-btn").onclick=()=>{B=!0,t.remove(),l=null},document.body.appendChild(t),l=t,t}function te(){return Array.from(document.querySelectorAll("video, audio")).filter(e=>e instanceof HTMLVideoElement||e instanceof HTMLAudioElement).sort((e,t)=>{const n=e.clientWidth*e.clientHeight;return t.clientWidth*t.clientHeight-n})[0]||null}function ne(e){O=e}function abdmRankMedia(items, player) {
    const duration = media => Number.isFinite(media.durationSeconds) ? media.durationSeconds : 0;
    const matchesDuration = media => {
        const length = duration(media);
        return length > 0 && Number.isFinite(player?.duration) && player.duration > 0 &&
            Math.abs(length - player.duration) <= Math.max(3, player.duration * 0.05);
    };
    const matchesSource = media => Boolean(player?.currentSrc && media.uri === player.currentSrc);
    return [...items].sort((a, b) =>
        Number(matchesDuration(b)) - Number(matchesDuration(a)) ||
        Number(matchesSource(b)) - Number(matchesSource(a)) ||
        duration(b) - duration(a));
}
function oe(e){if(B)return;e=abdmRankMedia(e??[],te());if(!e||e.length===0){l?.remove(),l=null;return}const t=ee(),n=t.querySelector(".count-text");n.textContent=String(e.length);const o=t.querySelector(".abdm-media-list");o.innerHTML="";for(const i of e){const r=document.createElement("div");r.className="abdm-media-item";const s=i.displayName??"Unnamed media",p=[i.duration,i.size,i.resolution,i.bandwidth,i.extension].filter(Boolean).join(" · ");r.innerHTML=`
          <div class="abdm-item-title">${s}</div>
          <div class="abdm-item-details">${p}</div>
        `,r.onclick=()=>{O?.(i)},o.appendChild(r)}const a=te();if(a){const i=a.getBoundingClientRect();t.style.position="absolute",t.style.top=`${Math.max(i.top-t.offsetHeight-2+window.scrollY,2)}px`,t.style.left=`${i.left+window.scrollX}px`}else t.style.position="fixed",t.style.top="8px",t.style.left="8px"}function ie(e){if(!l)return;const t=l.querySelector(".abdm-media-list");if(t){switch(e){case void 0:c=!c;break;default:c=e}t.style.display=c?"block":"none"}}function ae(e){let t=null;const n=o=>{t&&clearTimeout(t),t=setTimeout(o,e)};return n.cancel=()=>{t&&(clearTimeout(t),t=null)},n}let b=null,w=null;function re(){return b===null||w===null?null:{x:b,y:w}}function H(e){b=e.pageX,w=e.pageY}function se(e){b=null,w=null}function le(){document.addEventListener("mousemove",H,!1),document.addEventListener("mouseenter",H,!1),document.addEventListener("mouseleave",se,!1)}const x=new Set;function F(){x.clear()}function de(e=null){const t=[];return e&&(e.ctrlKey&&t.push("Control"),e.altKey&&t.push("Alt"),e.shiftKey&&t.push("Shift"),e.metaKey&&t.push("Meta")),x.forEach(n=>t.push(n)),V(t)}function ce(){document.addEventListener("keydown",e=>{$(e.key)||x.add(P(e.key))}),document.addEventListener("keyup",e=>{x.delete(P(e.key))}),window.addEventListener("blur",function(){F()})}var L,pe=(e,t,n)=>L??(L=new Promise(o=>{const a=r=>{const{data:{cmd:s,scope:p,context:f},ports:u}=r;if(s==="webext-port-offer"&&p===t&&f!==e)return window.removeEventListener("message",a),u[0].onmessage=n,u[0].postMessage("port-accepted"),o(u[0])},i=()=>{const r=new MessageChannel;r.port1.onmessage=s=>{if(s.data==="port-accepted")return window.removeEventListener("message",a),o(r.port1);n?.(s)},window.postMessage({cmd:"webext-port-offer",scope:t,context:e},"*",[r.port2])};window.addEventListener("message",a),e==="window"?setTimeout(i,0):i()})),ue=e=>{let t,n=!1,o,a;return{enable:()=>n=!0,onMessage:i=>o=i,postMessage:async i=>{if(e!=="content-script"&&e!=="window")throw new Error("Endpoint does not use postMessage");if(!n)throw new Error("Communication with window has not been allowed");return me(t),(await a).postMessage(i)},setNamespace:i=>{if(t)throw new Error("Namespace once set cannot be changed");t=i,a=pe(e,i,({data:r})=>o?.(r))}}};function me(e){if(typeof e!="string"||e.trim().length===0)throw new Error(`webext-bridge uses window.postMessage to talk with other "window"(s) for message routingwhich is global/conflicting operation in case there are other scripts using webext-bridge. Call Bridge#setNamespace(nsps) to isolate your app. Example: setNamespace('com.facebook.react-devtools'). Make sure to use same namespace across all your scripts whereever window.postMessage is likely to be used\``)}var _=ue("content-script"),S=G(),g=q("content-script",e=>{e.destination.context==="window"?_.postMessage(e):S.postMessage(e)});_.onMessage(e=>{e.origin={context:"window",tabId:null},g.handleMessage(e)});S.onMessage(g.handleMessage);S.onFailure(e=>{if(e.origin.context==="window"){_.postMessage({type:"error",transactionID:e.transactionId});return}g.endTransaction(e.transactionId)});var{sendMessage:y,onMessage:h}=g;U(g);function M(e){return`AB Download Manager
${e}`}async function R(e){if(A().sendHeaders){const t=await y(d.GET_HEADERS,e.map(n=>n.link));e=e.map((n,o)=>({...n,headers:n.headers??t[o]}))}else e=e.map((t,n)=>({...t,headers:null}));await y(d.ADD_DOWNLOAD,e,"background")}const ge={async getPlatformInfo(){return await y("get_platform",void 0,"background")}},fe={platformInfoProvider:ge},he={name:"ContentScript",providers:fe},T=ae(500);async function D(){const e=window.getSelection();if(e==null){alert(M(C.i18n.getMessage("popup_alert_nothing_selected")));return}let t=N(e);if(t.length==0){alert(M(C.i18n.getMessage("popup_alert_no_link_detected")));return}await R(t)}let k=!0;function Ce(){return k&&A().popupEnabled}const be=z().withType(he).withInit(async()=>{try{le(),ce(),Y(async()=>{D()}),ne(e=>{const t=e.type;R([{link:e.uri,suggestedName:e.suggestedFullName??"",type:t,downloadPage:location.href,headers:e.requestHeaders??null,description:null}]),ie(!1)}),document.addEventListener("selectionchange",()=>{k=!0;const e=window.getSelection();(!e||e.type!=="Range")&&m()}),document.addEventListener("mousedown",()=>{T.cancel()}),document.addEventListener("mouseup",e=>{T(()=>{const t=re();if(!Ce()||t===null)return;const n=window.getSelection();n==null||n.type!=="Range"||N(n).length==0||(k=!1,j(t))}),K(async()=>{try{await y(d.SET_HOLDING_KEY,de(e),"background")}catch{}finally{F()}})}),h(d.SHOW_LOG,e=>{console.log(...e.data)}),h(d.SHOW_ALERT,e=>{alert(M(e.data))}),h(d.CHECK_SELECTED_TEXT_FOR_LINKS,e=>{D()}),h(d.DOWNLOADABLE_MEDIA_DETECTED,e=>{oe(e.data)}),setTimeout(()=>{chrome.runtime.sendMessage({action:"abdmReplayMedia"},()=>{void chrome.runtime.lastError})},0),window.addEventListener("pageshow",event=>{if(event.persisted)setTimeout(()=>{chrome.runtime.sendMessage({action:"abdmReplayMedia"},()=>{void chrome.runtime.lastError})},0)})}catch(e){throw console.log("failed to load ab-dm-extension",e),e}});be.create().start();
