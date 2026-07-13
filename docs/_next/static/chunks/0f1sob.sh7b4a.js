(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,31713,e=>{"use strict";var s=e.i(43476),l=e.i(71645);let a=[{id:"demo-1",name:"石窯パン工房 麦日和",address:"熊本県熊本市中央区上通町 4-12",rating:4.6,reviews:184,website:"https://instagram.com/mugibiyori",status:"sns",score:96},{id:"demo-2",name:"珈琲と菓子 ミモザ",address:"熊本県熊本市東区健軍 2-8-3",rating:4.5,reviews:96,status:"none",score:94},{id:"demo-3",name:"小さな洋食店 灯り",address:"熊本県熊本市中央区新町 1-6-8",rating:4.4,reviews:238,website:"https://tabelog.com/kumamoto/example",status:"portal",score:88},{id:"demo-4",name:"菓子屋 saison",address:"熊本県熊本市南区江越 1-5-2",rating:4.7,reviews:73,website:"https://saison-kumamoto.jp",status:"official",score:54},{id:"demo-5",name:"自家焙煎珈琲 凪",address:"熊本県熊本市西区春日 3-10-4",rating:4.3,reviews:121,website:"https://facebook.com/nagi.coffee",status:"sns",score:86}],n={none:{label:"Webサイトなし",short:"なし"},sns:{label:"SNSのみ",short:"SNS"},portal:{label:"ポータルのみ",short:"媒体"},official:{label:"公式サイトあり",short:"公式"}},i=["instagram.com","facebook.com","x.com","twitter.com","tiktok.com","line.me"],r=["tabelog.com","hotpepper.jp","retty.me","ekiten.jp","jalan.net","beauty.hotpepper.jp"];function t(e){let s=()=>{let s=document.createElement("textarea");s.value=e,s.setAttribute("readonly",""),s.style.position="fixed",s.style.opacity="0",document.body.appendChild(s),s.select(),document.execCommand("copy"),s.remove()};navigator.clipboard?.writeText?navigator.clipboard.writeText(e).catch(s):s()}e.s(["default",0,function(){let[e,o]=(0,l.useState)("熊本市"),[c,d]=(0,l.useState)("パン屋"),[h,x]=(0,l.useState)("4.2"),[j,p]=(0,l.useState)("50"),[m,u]=(0,l.useState)(""),[g,b]=(0,l.useState)(!1),[N,v]=(0,l.useState)(!1),[S,f]=(0,l.useState)(!0),[C,w]=(0,l.useState)(""),[y,A]=(0,l.useState)(a),[k,$]=(0,l.useState)("all"),[P,I]=(0,l.useState)(""),[T,L]=(0,l.useState)(""),[M,G]=(0,l.useState)(!1),[R,E]=(0,l.useState)(""),[U,O]=(0,l.useState)(!1),B=(0,l.useMemo)(()=>y.filter(e=>"all"===k||e.status===k),[y,k]),F=y.filter(e=>"official"!==e.status).length,W=F?Math.round(y.filter(e=>"official"!==e.status).reduce((e,s)=>e+s.score,0)/F):0,D=y.find(e=>e.id===P);async function H(s){if(s.preventDefault(),w(""),!m.trim())return void b(!0);v(!0);try{var l;sessionStorage.setItem("local-signal-api-key",m.trim()),await (l=m.trim(),window.google?.maps?Promise.resolve():new Promise((e,s)=>{let a=document.querySelector("script[data-local-signal-maps]");if(a){a.addEventListener("load",()=>e(),{once:!0}),a.addEventListener("error",()=>s(Error("Google Mapsを読み込めませんでした。")),{once:!0});return}let n=document.createElement("script");n.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(l)}&v=weekly&libraries=places&loading=async`,n.async=!0,n.dataset.localSignalMaps="true",n.onload=()=>e(),n.onerror=()=>s(Error("Google Mapsを読み込めませんでした。")),document.head.appendChild(n)}));let s=await window.google?.maps.importLibrary("places");if(!s?.Place)throw Error("Places APIを利用できませんでした。");let a=(await s.Place.searchByText({textQuery:`${c} ${e}`,fields:["id","displayName","formattedAddress","rating","userRatingCount","websiteURI","googleMapsURI"],language:"ja",region:"jp",minRating:Number(h),maxResultCount:20})).places.filter(e=>(e.userRatingCount??0)>=Number(j)).map((e,s)=>{let l=function(e){if(!e)return"none";let s=e.toLowerCase();return i.some(e=>s.includes(e))?"sns":r.some(e=>s.includes(e))?"portal":"official"}(e.websiteURI),a=e.rating??0,n=e.userRatingCount??0;return{id:e.id??`place-${s}`,name:e.displayName??"名称未取得",address:e.formattedAddress??"住所未取得",rating:a,reviews:n,website:e.websiteURI,mapsUrl:e.googleMapsURI,status:l,score:Math.round(Math.min(100,{none:42,sns:36,portal:28,official:0}[l]+Math.max(0,Math.min(34,(a-3.5)*28))+Math.min(24,10*Math.log10(Math.max(n,1)))))}}).sort((e,s)=>s.score-e.score);A(a),f(!1),$("all"),I(""),L(""),E(""),a.length||w("条件に一致する店舗がありませんでした。口コミ数を下げてお試しください。")}catch(e){w(e instanceof Error?`${e.message} API設定とドメイン制限をご確認ください。`:"検索に失敗しました。")}finally{v(!1)}}function Q(e){I(e),L(""),E(""),G(!1)}function q(s){let l=s??D;if(!l)return;let a=l.website?`${n[l.status].label}（${l.website}）`:n[l.status].label;L(`あなたは、Webディレクター、UXデザイナー、コピーライター、リサーチャー、フロントエンドエンジニアを兼ねる制作責任者です。以下の調査資料を起点に、対象店舗の魅力と信頼性が正しく伝わり、実際に公開・運用できる高品質なホームページを完成させてください。単なる案やワイヤーフレームではなく、現在の作業環境に実装し、ブラウザ確認と修正まで行ってください。

【自動挿入された対象情報】
店舗名：${l.name}
住所：${l.address}
検索地域：${e||"未指定"}
検索時の業種：${c||"未指定（リサーチで特定）"}
Google評価：${l.rating.toFixed(1)}
口コミ数：${l.reviews.toLocaleString()}件
現在のWeb状況：${a}
Googleマップ：${l.mapsUrl??"店舗名と住所から確認してください"}

上記は検索結果から得た初期情報です。業種、店舗名、住所が同一事業者を指すか確認し、誤りや表記揺れがあれば、根拠とともに正しい情報を採用してください。

【必須の進行順序】
必ず「分析 → リサーチ → 設計 → 実装 → ブラウザ確認 → 完成報告」の順に進めてください。途中で軽微な不明点があっても作業を止めず、安全で可逆的な仮置きと「要確認」表示で進行してください。ただし、主目的、主要CTA、法令に関わる表現、課金・送信・公開など不可逆な操作に重大な不明点がある場合だけ確認してください。

1. 分析
- 業種名を機械的に当てはめるのではなく、この店舗に必要なサイトの役割を判断してください。主目的は来店、予約、電話、問い合わせ、購入、採用、認知のうち何か、優先順位を定めます。
- 想定顧客、その人が訪問前に抱く不安や疑問、選ばれる理由、競合との違い、信頼の根拠、主要CTAを整理してください。
- 確認済みの事実、公開情報から妥当に要約できること、未確認事項を分離してください。長い業種別候補一覧は出さず、対象店舗に必要な要素だけを採用します。
- 現在Webサイトがない、またはSNSのみの場合は、営業時間・アクセス・サービス・価格・予約導線を一か所で確認できるホームページ固有の価値を設計に反映してください。

2. リサーチ
- Googleマップ、公式SNS、公式サイトがある場合はそのサイト、業界団体や自治体など信頼できる一次情報を優先し、営業時間、定休日、電話番号、アクセス、駐車場、予約方法、商品・サービス、価格帯、歴史、方針、設備、支払い方法など必要項目を調査してください。
- 重要情報は可能な限り複数ソースで照合し、更新日にも注意します。情報が食い違う場合は断定せず、採用した情報と要確認事項を記録してください。連絡先、価格、営業時間、受賞歴、資格、実績、在庫、効果効能などを推測で作らないでください。
- 口コミは個人の感想として扱い、複数の口コミに共通する傾向を要約します。個人名や長文を無断転載せず、実在しない口コミや数値を作らないでください。
- 医療、美容、健康、法律、金融など表現規制のある業種は、関係法令と広告ガイドラインを確認し、誇大表現、効果保証、比較優良表現を避けてください。
- 調査に使った主要URLと、何を確認したかを制作メモとして残してください。

3. 設計
- ファーストビューだけで「何の店か」「誰に向くか」「どんな価値があるか」「次に何をすればよいか」が分かる情報設計にしてください。店舗名の直後に魅力的なアイキャッチ画像を置き、説明前の大きな空白を作りません。
- 主要CTAは一つに絞って最も目立たせ、電話、予約、問い合わせ、経路、SNSなどは目的に応じて優先順位を付けます。「詳しくはこちら」のような曖昧なボタン名ではなく、押した後の結果が分かる文言を使ってください。
- セクションは対象店舗に必要なものだけを選び、順序も顧客の意思決定に合わせます。基本候補は、アイキャッチ、店舗の方針・物語、選ばれる理由、商品・サービス、利用の流れ、口コミ傾向、店舗情報、アクセス、FAQ、CTAです。商品を急いで見せるより方針や設備が信頼形成に重要な業種では、それらを先に配置してください。
- ナビゲーション、見出し階層、各セクションの役割、CTA導線を実装前に短く定義してください。情報量が少ない場合に空疎なカードや大きな余白で水増ししないでください。

4. コピーとデザイン
- コピーはこの店舗固有の事実と言葉から作り、短く具体的にしてください。「想いをつなぐ」「未来を彩る」「新しい体験」のような根拠の薄いAI的常套句、過剰な感嘆符、同じ説明の反復を避けます。「地域No.1」「絶対」「必ず」など裏付けのない最上級表現は禁止です。
- デザインは業種、価格帯、地域性、店舗の歴史や空気感から一貫した方向性を作ります。既製テンプレートに情報を流し込んだような外観にせず、色、書体、余白、写真比率、罫線、ボタン形状に理由を持たせてください。
- 過剰な角丸カード、三列カードの反復、安っぽい巨大ボタン、全面グラデーション、発光、不要なガラス表現、絵文字アイコン、意味のない装飾を避けます。写真を主役にし、文字オーバーレイが必要な場合は被写体を避けて画像の一部に小さく配置し、全面を色で覆わないでください。
- スクロールアニメーションは、視線誘導に必要なフェード、わずかな移動、画像の穏やかな表示などに限定します。操作を妨げる演出、常時動く装飾、長い待ち時間は避け、prefers-reduced-motionに対応してください。

5. 画像制作の必須ルール
- デモサイトでも画像を単色の仮置きや汎用ストックの反復で済ませず、画像生成機能を使って実写写真のような高品質画像を生成し、実際にサイトへ設定してください。ヒーロー、外観または空間、商品・サービス、手仕事・設備・ディテールなど、構成に必要な複数の異なる画像を用意します。同じ画像の使い回しは禁止です。
- 画像は業種、時間帯、光、素材感、色調、カメラ距離をサイトの世界観に統一しつつ、各画像の役割と構図を変えてください。主役が文字や色のオーバーレイで隠れない構図にします。
- 生成画像を、実在店舗の外観・商品・従業員・顧客を撮影した本物の記録写真であるかのように偽らないでください。生成画像には、視認性を損なわない位置に「イメージ画像」と明記し、完成報告でも区別します。実在する個人を模倣した顔や、確認できないロゴ・表彰・商品表示は生成しません。
- 使用許諾を確認できる公式写真がある場合は、店舗固有の事実を示す箇所ではそちらを優先できます。その場合も出典と利用条件を記録し、Googleマップ、SNS、第三者サイトの画像を無断転載しないでください。公開前に実写真へ差し替えやすい構造とし、必要な撮影カット一覧も報告します。

6. 実装
- 現在のリポジトリ、フレームワーク、既存コンポーネントを確認し、既存の良い部分とユーザー変更を壊さず実装してください。ページを開くだけで主要内容が確認でき、リンク、ナビゲーション、CTA、アニメーションが実際に動く状態にします。
- スマートフォン幅375〜430pxを最優先に設計し、タブレットとPCにも自然に展開してください。横スクロール、文字切れ、要素の重なりをなくし、本文は原則16px以上、タップ領域は原則44px以上を確保します。フォーム入力はiOSで不用意にズームしない文字サイズにします。
- セマンティックHTML、適切な見出し順、画像alt、フォームラベル、キーボード操作、明確なフォーカス表示、十分な色コントラストを確保します。色だけで状態を伝えません。
- title、meta description、OGP、canonical、適切なh1、地域名と業種を自然に含む本文を設定します。確認済み情報が揃う場合はLocalBusiness系の構造化データを実装し、FAQが実際にある場合だけFAQ構造化データを使います。
- バックエンドや外部サービスの設定がない機能を、送信できるように見せかけないでください。電話、地図、予約、SNSなど確認済みリンクを使い、未設定機能は「要設定」と明示します。秘密情報やAPIキーをクライアントコードへ埋め込みません。

7. ブラウザ確認
- 実装後、ローカルブラウザでPC、タブレット、スマートフォン相当の幅を確認してください。ファーストビュー、主要CTA、各セクション、ナビゲーション、画像、リンク、アニメーション、フォームが意図どおり動くか操作します。
- 重なり、はみ出し、横スクロール、広すぎる余白、読みにくい改行、小さすぎる文字、画像のトリミング不良、低いコントラスト、表示崩れ、コンソールエラー、読み込み失敗を点検し、見つけた問題は完成報告の前に修正してください。
- 生成画像がすべて異なり、被写体が見え、「イメージ画像」の表示があることも確認します。可能ならビルドまたはテストも実行してください。

8. 完成報告
最後に、次を簡潔に報告してください。
- サイトの目的、想定顧客、主要CTA
- 採用した構成とデザイン意図
- 実装した機能とアニメーション
- 生成した画像の用途一覧、イメージ画像表示、公式画像を使った場合の出典
- 確認済みの店舗情報と主要な参照URL
- PC・タブレット・スマートフォンで確認した内容と修正結果
- 未確認情報、外部設定が必要な項目、公開前に差し替える内容
- 推奨する実写真の撮影カットと公開前チェック項目

品質基準は「見た目が整っている」だけではありません。対象店舗らしさ、情報の正確さ、顧客が迷わない導線、スマートフォンでの使いやすさ、アクセシビリティ、実装の動作、公開時の誤認防止まで満たして完成としてください。`),G(!1),window.setTimeout(()=>document.getElementById("generated-prompt")?.scrollIntoView({behavior:"smooth",block:"start"}),0)}return(0,s.jsxs)("main",{children:[(0,s.jsxs)("header",{className:"topbar",children:[(0,s.jsxs)("a",{className:"brand",href:"#top","aria-label":"LOCAL SIGNAL ホーム",children:[(0,s.jsxs)("span",{className:"brandMark",children:[(0,s.jsx)("i",{}),(0,s.jsx)("i",{}),(0,s.jsx)("i",{})]}),(0,s.jsxs)("span",{children:[(0,s.jsx)("strong",{children:"LOCAL SIGNAL"}),(0,s.jsx)("small",{children:"まちの可能性を見つける"})]})]}),(0,s.jsxs)("div",{className:"headerActions",children:[(0,s.jsx)("button",{className:"textButton",onClick:()=>b(!0),children:"API設定ガイド"}),(0,s.jsxs)("span",{className:`connection ${m?"ready":""}`,children:[(0,s.jsx)("i",{}),m?"API設定済み":"デモモード"]})]})]}),(0,s.jsxs)("section",{className:"hero",id:"top",children:[(0,s.jsxs)("div",{className:"heroIntro",children:[(0,s.jsx)("p",{className:"overline",children:"LOCAL BUSINESS RESEARCH"}),(0,s.jsxs)("h1",{children:["いい店なのに、",(0,s.jsx)("br",{}),(0,s.jsx)("em",{children:"まだ見つかっていない。"})]}),(0,s.jsx)("p",{className:"heroLead",children:"Googleマップの評価から、Webサイトを持たない地域のお店を発見。提案すべき相手が、数字で見えてきます。"})]}),(0,s.jsxs)("form",{className:"searchPanel",onSubmit:H,children:[(0,s.jsxs)("div",{className:"panelTop",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{className:"stepNumber",children:"01"}),(0,s.jsx)("p",{children:"検索条件を入力"})]}),(0,s.jsx)("button",{type:"button",className:"demoReset",onClick:function(){A(a),f(!0),w(""),$("all"),I(""),L(""),E("")},children:"サンプルを表示"})]}),(0,s.jsxs)("div",{className:"mainFields",children:[(0,s.jsxs)("label",{children:[(0,s.jsx)("span",{children:"地域"}),(0,s.jsx)("input",{value:e,onChange:e=>o(e.target.value),placeholder:"例：熊本市",required:!0})]}),(0,s.jsxs)("label",{children:[(0,s.jsx)("span",{children:"業種"}),(0,s.jsx)("input",{value:c,onChange:e=>d(e.target.value),placeholder:"例：パン屋",required:!0})]})]}),(0,s.jsxs)("div",{className:"subFields",children:[(0,s.jsxs)("label",{children:[(0,s.jsx)("span",{children:"最低評価"}),(0,s.jsxs)("select",{value:h,onChange:e=>x(e.target.value),children:[(0,s.jsx)("option",{value:"4",children:"4.0"}),(0,s.jsx)("option",{value:"4.2",children:"4.2"}),(0,s.jsx)("option",{value:"4.3",children:"4.3"}),(0,s.jsx)("option",{value:"4.5",children:"4.5"})]})]}),(0,s.jsxs)("label",{children:[(0,s.jsx)("span",{children:"最低口コミ数"}),(0,s.jsxs)("select",{value:j,onChange:e=>p(e.target.value),children:[(0,s.jsx)("option",{value:"20",children:"20件"}),(0,s.jsx)("option",{value:"50",children:"50件"}),(0,s.jsx)("option",{value:"100",children:"100件"}),(0,s.jsx)("option",{value:"200",children:"200件"})]})]}),(0,s.jsxs)("label",{className:"apiField",children:[(0,s.jsxs)("span",{children:["Google APIキー ",(0,s.jsx)("button",{type:"button",onClick:()=>b(!0),children:"設定方法"})]}),(0,s.jsx)("input",{type:"password",value:m,onChange:e=>u(e.target.value),placeholder:"この画面から外部送信しません",autoComplete:"off"})]}),(0,s.jsxs)("button",{className:"searchButton",type:"submit",disabled:N,children:[(0,s.jsx)("span",{children:N?"検索中…":"候補を探す"}),(0,s.jsx)("b",{children:"↗"})]})]}),(0,s.jsxs)("p",{className:"privacyNote",children:[(0,s.jsx)("span",{children:"●"})," APIキーはこの端末のセッション内だけで使用し、運営者のサーバーには保存しません。"]})]})]}),(0,s.jsxs)("section",{className:"results","aria-live":"polite",children:[(0,s.jsxs)("div",{className:"resultHeading",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{className:"stepNumber dark",children:"02"}),(0,s.jsx)("p",{children:"営業候補を確認"})]}),(0,s.jsxs)("p",{className:"resultContext",children:[(0,s.jsx)("b",{children:S?"サンプルデータ":`${e}・${c}`}),(0,s.jsxs)("span",{children:[y.length,"件を分析"]})]})]}),(0,s.jsxs)("div",{className:"summaryGrid",children:[(0,s.jsxs)("article",{children:[(0,s.jsx)("span",{children:"見込み候補"}),(0,s.jsxs)("strong",{children:[F,(0,s.jsx)("small",{children:"件"})]}),(0,s.jsx)("p",{children:"公式サイトなし・SNS・媒体のみ"})]}),(0,s.jsxs)("article",{children:[(0,s.jsx)("span",{children:"平均チャンス度"}),(0,s.jsxs)("strong",{children:[W,(0,s.jsx)("small",{children:"/100"})]}),(0,s.jsx)("p",{children:"評価・口コミ・Web状況から算出"})]}),(0,s.jsxs)("article",{className:"breakdown",children:[(0,s.jsx)("span",{children:"Webサイト状況"}),(0,s.jsx)("div",{children:["none","sns","portal","official"].map(e=>(0,s.jsxs)("button",{onClick:()=>$(e),children:[(0,s.jsx)("i",{className:e}),n[e].short,(0,s.jsx)("b",{children:y.filter(s=>s.status===e).length})]},e))})]})]}),(0,s.jsxs)("div",{className:"tableToolbar",children:[(0,s.jsxs)("div",{className:"filterTabs",children:[(0,s.jsx)("button",{className:"all"===k?"active":"",onClick:()=>$("all"),children:"すべて"}),["none","sns","portal","official"].map(e=>(0,s.jsx)("button",{className:k===e?"active":"",onClick:()=>$(e),children:n[e].label},e))]}),(0,s.jsx)("span",{children:"チャンス度順"})]}),(0,s.jsxs)("div",{className:`selectionBar ${D?"hasSelection":""}`,children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{children:D?"選択中":"店舗を1件選択"}),(0,s.jsx)("strong",{children:D?D.name:"ホームページを作る店舗を選んでください"})]}),(0,s.jsxs)("button",{type:"button",onClick:()=>q(),disabled:!D,children:["ホームページ作成用",(0,s.jsx)("br",{}),"プロンプトを生成 ",(0,s.jsx)("b",{children:"↗"})]})]}),C&&(0,s.jsx)("div",{className:"errorMessage",children:C}),(0,s.jsxs)("div",{className:"leadTable",children:[(0,s.jsxs)("div",{className:"tableHead",children:[(0,s.jsx)("span",{children:"選択"}),(0,s.jsx)("span",{children:"店舗"}),(0,s.jsx)("span",{children:"Google評価"}),(0,s.jsx)("span",{children:"Webサイト"}),(0,s.jsx)("span",{children:"チャンス度"}),(0,s.jsx)("span",{})]}),B.map((e,l)=>(0,s.jsxs)("article",{className:`leadRow ${P===e.id?"selected":""}`,children:[(0,s.jsxs)("label",{className:"selectControl","aria-label":`${e.name}を選択`,children:[(0,s.jsx)("input",{type:"radio",name:"selected-store",checked:P===e.id,onChange:()=>Q(e.id)}),(0,s.jsx)("span",{})]}),(0,s.jsxs)("div",{className:"storeCell",children:[(0,s.jsx)("span",{className:"rank",children:String(l+1).padStart(2,"0")}),(0,s.jsxs)("div",{children:[(0,s.jsx)("h2",{children:e.name}),(0,s.jsx)("p",{children:e.address})]})]}),(0,s.jsxs)("div",{className:"ratingCell",children:[(0,s.jsxs)("strong",{children:["★ ",e.rating.toFixed(1)]}),(0,s.jsxs)("span",{children:[e.reviews.toLocaleString(),"件"]})]}),(0,s.jsx)("div",{children:(0,s.jsxs)("span",{className:`statusBadge ${e.status}`,children:[(0,s.jsx)("i",{}),n[e.status].label]})}),(0,s.jsxs)("div",{className:"scoreCell",children:[(0,s.jsx)("div",{children:(0,s.jsx)("i",{style:{width:`${e.score}%`}})}),(0,s.jsx)("strong",{children:e.score})]}),(0,s.jsxs)("div",{className:"rowActions",children:[e.mapsUrl?(0,s.jsx)("a",{href:e.mapsUrl,target:"_blank",rel:"noreferrer","aria-label":`${e.name}をGoogleマップで見る`,children:"地図 ↗"}):(0,s.jsx)("button",{type:"button",onClick:()=>alert("デモデータのため地図リンクはありません。"),children:"地図 ↗"}),"official"!==e.status&&(0,s.jsx)("button",{className:"proposal",type:"button",onClick:()=>{Q(e.id),q(e)},children:"この店舗で作る"})]})]},e.id)),!B.length&&!C&&(0,s.jsx)("div",{className:"emptyState",children:"この条件に該当する店舗はありません。"})]}),T&&D&&(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)("section",{className:"promptBuilder",id:"generated-prompt",children:[(0,s.jsxs)("div",{className:"promptHeader",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{className:"stepNumber",children:"03"}),(0,s.jsx)("p",{children:"作成プロンプト"})]}),(0,s.jsxs)("p",{children:[(0,s.jsx)("strong",{children:D.name})," 専用"]})]}),(0,s.jsxs)("div",{className:"promptBody",children:[(0,s.jsxs)("div",{className:"promptText",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{children:"生成済みプロンプト"}),(0,s.jsx)("button",{type:"button",onClick:function(){T&&(G(!0),window.setTimeout(()=>G(!1),1800),t(T))},children:M?"コピーしました ✓":"コピー"})]}),(0,s.jsx)("textarea",{readOnly:!0,value:T,"aria-label":"生成されたホームページ作成用プロンプト"})]}),(0,s.jsxs)("aside",{className:"codexAction",children:[(0,s.jsx)("p",{className:"overline",children:"NEXT STEP"}),(0,s.jsxs)("h2",{children:["このまま、",(0,s.jsx)("br",{}),"サイト制作へ。"]}),(0,s.jsx)("p",{children:"生成したプロンプトを入力した状態で、新しいCodexタスクを開きます。"}),(0,s.jsxs)("button",{type:"button",onClick:function(){if(!T)return;let e=`codex://threads/new?prompt=${encodeURIComponent(T)}`,s=window.setTimeout(()=>{"visible"===document.visibilityState&&(window.location.href="https://chatgpt.com/download/")},1800);document.addEventListener("visibilitychange",()=>{"hidden"===document.visibilityState&&window.clearTimeout(s)},{once:!0}),window.location.href=e},children:["Codexでホームページを作成 ",(0,s.jsx)("span",{children:"↗"})]}),(0,s.jsx)("small",{children:"Codexが開かない場合は、公式ダウンロードページへ移動します。"}),(0,s.jsx)("a",{href:"https://chatgpt.com/download/",target:"_blank",rel:"noreferrer",children:"Codexをダウンロードする"})]})]})]}),(0,s.jsxs)("section",{className:"salesCta",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{className:"overline",children:"SALES SUPPORT"}),(0,s.jsx)("h2",{children:"魅力を、伝わる言葉に。"}),(0,s.jsx)("p",{children:"選択した店舗に合わせて、電話・DM・フォロー文・PASONA型の提案文をまとめて作成します。"})]}),(0,s.jsxs)("button",{type:"button",onClick:function(){if(!D)return;let e=n[D.status].label;E(`【営業前に必ず確認】
以下はたたき台です。送信前に店舗の実際の口コミ・SNSを確認し、［ ］内を具体的な事実に置き換えてください。営業目的を隠さず、相手の時間を尊重して使用してください。

━━━━━━━━━━━━━━━━━━
1. 最初のDM（短文・許可を取る型）
━━━━━━━━━━━━━━━━━━
${D.name} ご担当者さま

突然のご連絡失礼いたします。Googleマップで拝見し、${D.rating.toFixed(1)}の評価と${D.reviews.toLocaleString()}件もの口コミ、特に「［口コミで繰り返し評価されている具体的な魅力］」が印象に残りました。

一方で、現在は${e}のため、初めて探す方には魅力や基本情報が十分届き切っていない可能性があると感じました。Web制作のご提案なのですが、まず営業資料ではなく、${D.name}さま向けの改善イメージを1枚にまとめてお送りしてもよろしいでしょうか。

不要でしたら、その旨だけお知らせいただければ以後ご連絡いたしません。

━━━━━━━━━━━━━━━━━━
2. 電話の第一声（30秒で許可を取る）
━━━━━━━━━━━━━━━━━━
「突然のお電話失礼いたします。私、地域のお店のWeb制作をしている［名前］と申します。営業のお電話なのですが、30秒だけ要点をお伝えしてもよろしいでしょうか。」

許可をいただけた場合：
「ありがとうございます。${D.name}さまをGoogleマップで拝見し、評価${D.rating.toFixed(1)}・口コミ${D.reviews.toLocaleString()}件と、とても支持されていることが分かりました。ただ、現在は${e}なので、検索から来た新規のお客さまが魅力や営業時間を一度に確認しにくい状態です。店舗専用のホームページ案を無料で1案だけ作ってお見せしたいのですが、送付先を伺ってもよろしいでしょうか。」

「今は必要ない」と言われた場合：
「承知しました。お時間をいただきありがとうございます。今後こちらから繰り返しご連絡することはありません。」

「費用が心配」と言われた場合：
「ご心配はもっともです。契約前提ではなく、まず完成イメージと費用の選択肢をご覧いただき、必要性を感じなければそこで終了できます。」

━━━━━━━━━━━━━━━━━━
3. フォローDM（3〜5日後・1回だけ）
━━━━━━━━━━━━━━━━━━
先日ご連絡した［名前］です。何度も失礼いたします。

${D.name}さまの場合、SNSを置き換えるのではなく、「初めての方が営業時間・場所・こだわりを迷わず確認できるページ」を加えるだけでも効果が期待できます。

ご関心があれば、店舗専用の簡単な構成案をお送りします。今回は見送りの場合、ご返信は不要です。こちらで最後のご連絡といたします。

━━━━━━━━━━━━━━━━━━
4. PASONA型の提案文
━━━━━━━━━━━━━━━━━━
【P｜Problem：問題】
Googleマップで高く評価されていても、公式ホームページがないと、初めてのお客さまは営業時間・商品・お店のこだわりを複数の場所で探さなければなりません。

【A｜Affinity：共感】
日々の営業やSNS更新で忙しい中、ホームページまで自分で作る時間が取れないのは当然です。制作会社へ頼むと高額になりそうで、後回しになる事情もよく分かります。

【S｜Solution：解決】
そこで、GoogleマップやSNSで既に伝わっている${D.name}さまの魅力を整理し、初めての方が必要な情報へすぐ辿り着ける店舗専用サイトをご提案します。SNSはそのまま活かし、ホームページを「情報の案内所」として追加します。

【O｜Offer：提案】
まずは契約前提ではなく、トップページの構成案と完成イメージを1案ご用意します。内容をご覧いただいて、必要性を感じた場合だけ次へ進めます。

【N｜Narrowing down：限定】
一店舗ずつ情報を確認して制作するため、同時にご案内できる件数を絞っています。今月は［対応可能件数］店舗までです。

【A｜Action：行動】
興味がありましたら「構成案希望」と一言ご返信ください。${D.name}さま向けの案をお送りします。

━━━━━━━━━━━━━━━━━━
5. 件名・冒頭フック候補
━━━━━━━━━━━━━━━━━━
- 口コミ${D.reviews.toLocaleString()}件の魅力を、初めての方にも伝えるご提案
- ${D.name}さまの「［具体的な魅力］」を検索でも伝える方法
- SNSはそのままに、店舗情報を一か所にまとめるご提案
- 営業資料ではなく、店舗専用の構成案を1枚お送りします

【避ける表現】
- 「必ず売上が上がる」など根拠のない断定
- 架空の限定数や締切
- 営業目的を隠した友人・客のふり
- 返信がない相手への繰り返し送信
- 口コミ内容を確認せずに使う過剰なお世辞`),O(!1),window.setTimeout(()=>document.getElementById("sales-copy")?.scrollIntoView({behavior:"smooth",block:"start"}),0)},children:["営業用の訴求文を作成 ",(0,s.jsx)("span",{children:"↗"})]})]}),R&&(0,s.jsxs)("section",{className:"salesCopyBuilder",id:"sales-copy",children:[(0,s.jsxs)("header",{children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{className:"stepNumber",children:"04"}),(0,s.jsx)("p",{children:"営業用の訴求文"})]}),(0,s.jsx)("button",{type:"button",onClick:function(){R&&(O(!0),window.setTimeout(()=>O(!1),1800),t(R))},children:U?"すべてコピーしました ✓":"すべてコピー"})]}),(0,s.jsxs)("div",{className:"salesCopyBody",children:[(0,s.jsxs)("aside",{children:[(0,s.jsx)("p",{className:"overline",children:"PASONA FRAMEWORK"}),(0,s.jsxs)("h2",{children:["売り込む前に、",(0,s.jsx)("br",{}),"理解を伝える。"]}),(0,s.jsx)("p",{children:"具体的な評価や口コミに触れ、30秒の許可を取ってから提案へ進む構成です。"}),(0,s.jsxs)("ul",{children:[(0,s.jsx)("li",{children:"営業目的は正直に伝える"}),(0,s.jsx)("li",{children:"店舗固有の事実を入れる"}),(0,s.jsx)("li",{children:"断りやすい出口を用意する"}),(0,s.jsx)("li",{children:"フォローは1回まで"})]})]}),(0,s.jsxs)("div",{children:[(0,s.jsxs)("div",{className:"copyLabel",children:[(0,s.jsxs)("span",{children:[D.name," 専用テンプレート"]}),(0,s.jsx)("small",{children:"［ ］内は実際の情報に置き換えてください"})]}),(0,s.jsx)("textarea",{readOnly:!0,value:R,"aria-label":"生成された営業用の訴求文"})]})]})]})]})]}),(0,s.jsxs)("section",{className:"workflow",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("span",{className:"stepNumber pale",children:"05"}),(0,s.jsx)("p",{children:"見つけた後の流れ"})]}),(0,s.jsxs)("ol",{children:[(0,s.jsxs)("li",{children:[(0,s.jsx)("span",{children:"1"}),(0,s.jsxs)("div",{children:[(0,s.jsx)("strong",{children:"候補を絞る"}),(0,s.jsx)("p",{children:"評価とWeb状況から、提案する価値の高い店舗を選びます。"})]})]}),(0,s.jsxs)("li",{children:[(0,s.jsx)("span",{children:"2"}),(0,s.jsxs)("div",{children:[(0,s.jsx)("strong",{children:"お店を深く知る"}),(0,s.jsx)("p",{children:"口コミ・SNS・競合から、その店ならではの魅力を整理します。"})]})]}),(0,s.jsxs)("li",{children:[(0,s.jsx)("span",{children:"3"}),(0,s.jsxs)("div",{children:[(0,s.jsx)("strong",{children:"デモサイトを作る"}),(0,s.jsx)("p",{children:"情報をCodexへ渡し、店舗に合わせたホームページを形にします。"})]})]})]})]}),(0,s.jsxs)("footer",{children:[(0,s.jsxs)("div",{className:"brand footerBrand",children:[(0,s.jsxs)("span",{className:"brandMark",children:[(0,s.jsx)("i",{}),(0,s.jsx)("i",{}),(0,s.jsx)("i",{})]}),(0,s.jsxs)("span",{children:[(0,s.jsx)("strong",{children:"LOCAL SIGNAL"}),(0,s.jsx)("small",{children:"まちの可能性を見つける"})]})]}),(0,s.jsx)("p",{children:"Google Maps Platformの情報を利用しています。検索結果はGoogleの利用規約に従って表示してください。"}),(0,s.jsx)("span",{children:"β VERSION 0.1"})]}),g&&(0,s.jsx)("div",{className:"modalBackdrop",role:"presentation",onMouseDown:()=>b(!1),children:(0,s.jsxs)("section",{className:"guideModal",role:"dialog","aria-modal":"true","aria-labelledby":"guide-title",onMouseDown:e=>e.stopPropagation(),children:[(0,s.jsx)("button",{className:"modalClose",onClick:()=>b(!1),"aria-label":"閉じる",children:"×"}),(0,s.jsx)("p",{className:"overline",children:"5 MINUTE SETUP"}),(0,s.jsx)("h2",{id:"guide-title",children:"Google APIを設定する"}),(0,s.jsx)("p",{className:"guideLead",children:"費用はあなた自身のGoogle Cloudアカウントで管理されます。APIキーは必ず利用制限を設定してください。"}),(0,s.jsxs)("ol",{className:"guideSteps",children:[(0,s.jsxs)("li",{children:[(0,s.jsx)("span",{children:"1"}),(0,s.jsxs)("div",{children:[(0,s.jsx)("strong",{children:"プロジェクトと請求先を作成"}),(0,s.jsx)("p",{children:"Google Cloud Consoleで新しいプロジェクトを作り、請求先アカウントを紐づけます。"})]})]}),(0,s.jsxs)("li",{children:[(0,s.jsx)("span",{children:"2"}),(0,s.jsxs)("div",{children:[(0,s.jsx)("strong",{children:"2つのAPIを有効化"}),(0,s.jsx)("p",{children:"「Maps JavaScript API」と「Places API (New)」を有効にします。"})]})]}),(0,s.jsxs)("li",{children:[(0,s.jsx)("span",{children:"3"}),(0,s.jsxs)("div",{children:[(0,s.jsx)("strong",{children:"APIキーを制限"}),(0,s.jsx)("p",{children:"アプリケーション制限を「ウェブサイト」、API制限を上記2つだけにします。"})]})]}),(0,s.jsxs)("li",{children:[(0,s.jsx)("span",{children:"4"}),(0,s.jsxs)("div",{children:[(0,s.jsx)("strong",{children:"予算と上限を設定"}),(0,s.jsx)("p",{children:"予算通知とクォータを設定し、想定外の利用を防ぎます。"})]})]})]}),(0,s.jsxs)("a",{className:"consoleLink",href:"https://console.cloud.google.com/google/maps-apis/credentials",target:"_blank",rel:"noreferrer",children:["Google Cloud Consoleを開く ",(0,s.jsx)("span",{children:"↗"})]}),(0,s.jsx)("button",{className:"modalDone",onClick:()=>b(!1),children:"設定したので検索画面へ"})]})})]})}])}]);