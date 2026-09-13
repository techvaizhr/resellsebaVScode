import{r as e}from"./rolldown-runtime-QTnfLwEv.js";import{m as t}from"./vendor-charts-CkRyfaGy.js";import{s as n}from"./vendor-editor-_X2_vRjM.js";import{n as r,t as i}from"./createServerFn-Bi_fWk9I.js";import{t as a}from"./useServerFn-DYJ7tC_o.js";import{f as o}from"./order-search-DmIu1baf.js";import{Nt as s,S as c,h as l,m as u}from"./vendor-icons-ClLzBSp0.js";import{$ as d,G as f,J as p,M as m,W as h,Y as g}from"./index-DqOmALA-.js";import{t as _}from"./vendor-barcode-BRTZ9W1w.js";import{n as v}from"./app-data-CKEXdl5W.js";import{t as y}from"./auth-middleware-i-C9TUDd.js";import{c as b,n as x,o as S,r as C,s as w,t as T}from"./courier-brand-CGZokMK1.js";var E=e(t(),1),D=i({method:`GET`}).middleware([y]).handler(r(`02213bd497c0eaf0a2687ab1b01d71f96e5763da0a2546216be66a5f5f034170`)),O=i({method:`GET`}).middleware([y]).handler(r(`c73cecbaf7348f9b524e70bab5e2011554ed424328568749bec2a7e553ed6610`));function k(e){let t=0;for(let n=0;n<e.length;n++)t=t*31+e.charCodeAt(n)>>>0;return Math.round(t%360*.618033988749895*360)%360}function A(e,t=.14){return`hsl(${k(e)} 85% 60% / ${t})`}function j(e){return`hsl(${k(e)} 70% 50% / 0.55)`}function M(e){let t=Array.from(new Set(e.filter(e=>!!e)));if(t.length===0)return null;if(t.length===1){let e=t[0];return{mixed:!1,style:{backgroundColor:A(e),borderLeft:`3px solid ${j(e)}`}}}return{mixed:!0,style:{backgroundImage:`linear-gradient(100deg, ${t.slice(0,4).map((e,t,n)=>`${A(e,.18)} ${Math.round(t/Math.max(n.length-1,1)*100)}%`).join(`, `)})`,borderLeft:`3px solid ${j(t[0])}`}}}var N=n();function P({isOpen:e,onClose:t,orderIds:n,onSuccess:r}){let[i,m]=(0,E.useState)(!1),[_,v]=(0,E.useState)(`steadfast`),[y,C]=(0,E.useState)(``),D=a(O),{data:k=[]}=o({queryKey:[`courier-booking-options`],queryFn:()=>D()}),A=(0,E.useMemo)(()=>k.map(e=>e.provider),[k]),j=(0,E.useMemo)(()=>A.map(e=>T[e]).filter(Boolean),[A]),M=(0,E.useMemo)(()=>k.find(e=>e.provider===_)??null,[k,_]),P=M?.stores??[],F=P.length>1;(0,E.useEffect)(()=>{A.length>0&&!A.includes(_)&&v(A[0])},[A]),(0,E.useEffect)(()=>{if(!M)return;let e=typeof window<`u`?window.localStorage.getItem(`courier-store:${M.provider}`)??``:``,t=M.stores.some(t=>t.id===e)&&e||M.defaultStoreId||M.stores[0]?.id||``;C(M.stores.some(e=>e.id===y)?y:t)},[M]);let I=e=>{C(e),typeof window<`u`&&window.localStorage.setItem(`courier-store:${_}`,e)},L=a(b),R=a(w),z=a(S),B=async()=>{if(n.length===0)return;m(!0);let e=0,i=0,a=``;for(let t of n)try{try{let e=await(await fetch(`/api/public/courier/actions`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({action:`book`,provider:_,orderId:t,storeId:y||void 0})})).json();e&&e.success&&(res=e)}catch{}res||(_===`steadfast`?res=await L({data:{orderId:t}}):_===`pathao`?res=await R({data:{orderId:t,...y?{storeId:y}:{}}}):_===`carrybee`&&(res=await z({data:{orderId:t,...y?{storeId:y}:{}}}))),e++}catch(e){if(console.error(`Booking failed for ${t}:`,e),i++,e instanceof Response)try{let t=await e.text();t&&(a=t)}catch{}else e?.message&&(a=e.message)}e>0&&(d.success(`Successfully booked ${e} order(s) with ${_}`),r(),t()),i>0&&d.error(a?`Booking failed: ${a}`:`Failed to book ${i} order(s). Please check courier settings.`),m(!1)},V=A.length===1&&!F;return(0,E.useEffect)(()=>{e&&!i&&V&&n.length>0&&B()},[e,V,n]),V&&e?(0,N.jsx)(h,{open:e,onOpenChange:e=>!i&&!e&&t(),children:(0,N.jsx)(f,{className:`max-w-sm`,children:(0,N.jsxs)(`div`,{className:`flex flex-col items-center justify-center py-8 text-center`,children:[(0,N.jsx)(s,{className:`h-8 w-8 animate-spin text-primary mb-4`}),(0,N.jsxs)(`p`,{className:`text-sm font-medium`,children:[`Booking `,n.length,` order(s) with `,j[0]?.label,`...`]})]})})}):(0,N.jsx)(h,{open:e,onOpenChange:e=>!i&&!e&&t(),children:(0,N.jsxs)(f,{className:`max-w-md`,children:[(0,N.jsx)(p,{children:(0,N.jsxs)(g,{className:`flex items-center gap-2`,children:[(0,N.jsx)(u,{className:`h-5 w-5 text-primary`}),`Courier Booking`]})}),(0,N.jsxs)(`div`,{className:`py-4`,children:[(0,N.jsxs)(`p`,{className:`mb-4 text-sm text-muted-foreground`,children:[`Select a courier provider to book `,n.length,` selected order(s).`]}),(0,N.jsx)(`div`,{className:`grid grid-cols-1 gap-3`,children:j.map(e=>(0,N.jsxs)(`button`,{onClick:()=>v(e.id),className:`flex items-center justify-between rounded-lg border p-4 text-left transition-all hover:bg-accent ${_===e.id?`border-primary bg-primary/5 ring-1 ring-primary`:`border-border`}`,children:[(0,N.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,N.jsx)(x,{provider:e.id,size:30}),(0,N.jsx)(`span`,{className:`font-semibold`,children:e.label})]}),_===e.id&&(0,N.jsx)(`div`,{className:`h-2 w-2 rounded-full bg-primary`})]},e.id))}),P.length>0&&(0,N.jsxs)(`div`,{className:`mt-4`,children:[(0,N.jsxs)(`label`,{className:`mb-1 flex items-center gap-1.5 text-xs font-medium`,children:[(0,N.jsx)(c,{className:`h-3.5 w-3.5`}),` Pickup store`,P.length>1&&(0,N.jsxs)(`span`,{className:`text-muted-foreground`,children:[`(`,P.length,` saved)`]})]}),(0,N.jsx)(`select`,{value:y,onChange:e=>I(e.target.value),className:`w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring`,children:P.map(e=>(0,N.jsxs)(`option`,{value:e.id,children:[e.name||e.id,M?.defaultStoreId===e.id?` (default)`:``]},e.id))})]}),(0,N.jsxs)(`div`,{className:`mt-6 flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-amber-800 border border-amber-200`,children:[(0,N.jsx)(l,{className:`h-5 w-5 shrink-0`}),(0,N.jsx)(`p`,{className:`text-xs leading-relaxed`,children:`Booking will create live consignments in the courier panel. Ensure store configurations are correct before proceeding.`})]})]}),(0,N.jsxs)(`div`,{className:`flex justify-end gap-3 border-t pt-4`,children:[(0,N.jsx)(`button`,{disabled:i,onClick:t,className:`rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50`,children:`Cancel`}),(0,N.jsxs)(`button`,{disabled:i||A.length===0,onClick:B,className:`btn-brand flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold disabled:opacity-50`,children:[i&&(0,N.jsx)(s,{className:`h-4 w-4 animate-spin`}),`Confirm `,_?T[_]?.label:`Courier`,` Booking`]})]})]})})}var F=e(_(),1);async function I(e,t,n){let r=n?.hideCustomer===!0,i=n?.maskPhone===!0;if(!e.length)return;let[a,{data:o},{data:s},{data:c}]=await Promise.all([v(),m.from(`orders`).select(`id,order_number,customer_name,customer_phone,address_line,area,total,reseller_id`).in(`id`,e),m.from(`order_items`).select(`order_id,product_name,quantity`).in(`order_id`,e),m.from(`shipments`).select(`order_id,provider,tracking_id,consignment_id`).in(`order_id`,e)]);if(!o||o.length===0)return;let l=t||a?.label_size||`3x4`,u=a?.site_name||`ResellHub`,d=new Map;s?.forEach(e=>{let t=d.get(e.order_id)||[];t.push(e),d.set(e.order_id,t)});let f=new Map;c?.forEach(e=>f.set(e.order_id,e)),R(o.map(e=>{let t=f.get(e.id),n=e.customer_phone||``,o=i&&n?n.length<=4?`****`:n.slice(0,3)+`*`.repeat(Math.max(n.length-6,4))+n.slice(-2):n;return{orderNumber:e.order_number,storeName:u,storeLogo:a?.logo_url??null,area:e.area,customer:r?null:{name:e.customer_name,phone:o,address:e.address_line},items:(d.get(e.id)||[]).map(e=>({name:e.product_name,qty:e.quantity})),courier:{provider:t?.provider??null,tracking:t?.tracking_id||t?.consignment_id||null},cod:r?null:Number(e.total)}}),l)}function L(e,t=34,n=11){if(!e)return``;try{let r=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);return(0,F.default)(r,String(e),{format:`CODE128`,displayValue:!0,height:t,margin:0,fontSize:n,fontOptions:`bold`,textMargin:2,lineColor:`#000`,background:`transparent`}),r.setAttribute(`style`,`width:100%;height:auto;display:block;`),r.removeAttribute(`width`),r.outerHTML}catch{return``}}function R(e,t=`3x4`){if(!e.length)return;let n=t===`3x3`?`3in`:`4in`,r=t===`3x3`?30:38,i=t===`3x3`?48:60,a=t===`3x3`?18:22,o=window.open(``,`_blank`);o&&(o.document.write(`
    <html>
      <head>
        <title>Shipping Labels - ${t}</title>
        <style>
          @page { size: 3in ${n}; margin: 0.04in; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; }
          .label {
            width: calc(3in - 0.08in);
            height: calc(${n} - 0.08in);
            padding: 0.09in;
            box-sizing: border-box;
            border: 2px solid #000;
            page-break-after: always;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 4px;
            min-width: 0;
            margin-bottom: 1px;
            border-bottom: 2px solid #000;
            padding-bottom: 1px;
          }
          .brand-box { display: flex; align-items: center; flex-shrink: 0; max-width: 40%; }
          .brand-logo { max-height: 24px; max-width: 100%; object-fit: contain; }
          .site-name { font-size: 8.5pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .order-barcode { flex: 0 0 auto; min-width: 0; max-width: 58%; text-align: right; }
          .order-barcode svg { width: 100%; height: auto; display: block; max-height: ${r}px; }

          .courier-section {
            border: 1.5px solid #000;
            border-radius: 4px;
            padding: 4px 5px;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .courier-info { display: flex; flex-direction: column; align-items: center; gap: 2px; flex-shrink: 0; width: 0.62in; }
          .courier-logo { max-height: 16px; max-width: 100%; object-fit: contain; }
          .courier-name { font-size: 6.5pt; font-weight: 900; text-transform: uppercase; color: #000; text-align: center; line-height: 1.1; }
          .courier-barcode { flex: 1; min-width: 0; text-align: center; border-left: 1px dashed #999; padding-left: 5px; }
          .courier-barcode svg { width: 100%; height: auto; display: block; max-height: ${i+12}px; }
          .tracking-pending { font-size: 8pt; font-family: monospace; font-weight: bold; border: 1px dashed #000; padding: 3px 8px; border-radius: 3px; }

          .section-title { font-size: 6.5pt; text-transform: uppercase; color: #666; font-weight: bold; margin-bottom: 2px; letter-spacing: 0.4px; }

          .customer {
            border: 1.5px solid #000;
            padding: 5px;
            margin-bottom: 4px;
            border-radius: 4px;
          }
          .name { font-size: 11.5pt; font-weight: 800; margin-bottom: 2px; color: #000; }
          .phone { font-size: 10pt; font-weight: bold; margin-bottom: 3px; display: block; border-bottom: 1px dashed #000; width: fit-content; }
          .address { font-size: 8pt; line-height: 1.25; font-weight: 500; }

          .items-box {
            border: 1px solid #000;
            padding: 4px;
            flex-grow: 1;
            margin-bottom: 4px;
            border-radius: 4px;
            background: #f9f9f9;
            font-size: 7.5pt;
            overflow: hidden;
          }
          .item-row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 6px;
            margin-bottom: 2px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 2px;
          }
          .item-row:last-child { border-bottom: none; }
          .item-name { flex: 1; min-width: 0; line-height: 1.2; font-size: 7.5pt; }
          .item-qty { font-weight: 900; color: #000; white-space: nowrap; font-size: 8.5pt; }

          .footer {
            margin-top: auto;
            border-top: 2px solid #000;
            padding-top: 3px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 6px;
          }
          .thanks { font-size: 6pt; font-weight: 700; text-transform: uppercase; color: #444; letter-spacing: 0.4px; line-height: 1.2; }
          .cod-badge { background: #000; color: #fff; padding: 3px 8px; border-radius: 4px; text-align: right; }
          .cod-label { font-size: 6pt; text-transform: uppercase; display: block; line-height: 1; }
          .cod-value { font-size: 11pt; font-weight: 900; }
        </style>
      </head>
      <body>
        ${e.map(e=>{let t=L(e.orderNumber,r,14),n=e.courier?.tracking?L(e.courier.tracking,i,a):``,o=C(e.courier?.provider),s=o?.wordmark??null;return`
            <div class="label">
              <div class="header">
                <div class="brand-box">
                  ${e.storeLogo?`<img src="${e.storeLogo}" class="brand-logo" />`:`<div class="site-name">${e.storeName}</div>`}
                </div>
                <div class="order-barcode">${t||`<strong style="font-size:13pt">#${e.orderNumber}</strong>`}</div>
              </div>
              <div class="courier-section">
                <div class="courier-info">
                  ${s?`<img src="${s}" class="courier-logo" />`:``}
                  <div class="courier-name">${o?.label??(e.courier?.provider?String(e.courier.provider):`MANUAL`)}</div>
                </div>
                ${n?`<div class="courier-barcode">${n}</div>`:`<div class="courier-barcode"><span class="tracking-pending">${e.courier?.tracking||`PENDING`}</span></div>`}
              </div>
              <div class="customer">
                ${e.customer?`<div class="section-title">Recipient</div>
                     <div class="name">${e.customer.name}</div>
                     <div class="phone">${e.customer.phone}</div>
                     <div class="address">${e.customer.address}</div>`:`<div class="section-title">Parcel</div>
                     <div class="name">#${e.orderNumber}</div>`}
              </div>
              <div class="items-box">
                <div class="section-title">Order Items</div>
                ${e.items.map(e=>`<div class="item-row"><span class="item-name">${e.name}</span><span class="item-qty">x ${e.qty}</span></div>`).join(``)}
              </div>
              <div class="footer">
                <div class="thanks">Thank you for<br>shopping with us</div>
                ${e.cod==null?``:`<div class="cod-badge">
                       <span class="cod-label">Cash to Collect</span>
                       <span class="cod-value">৳${Number(e.cod).toFixed(0)}</span>
                     </div>`}
              </div>
            </div>
          `}).join(``)}
        <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 500); }<\/script>
      </body>
    </html>
  `),o.document.close())}export{D as a,M as i,I as n,P as r,R as t};