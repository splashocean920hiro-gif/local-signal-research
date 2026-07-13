"use client";

import { FormEvent, useMemo, useState } from "react";

type SiteStatus = "none" | "sns" | "portal" | "official";

type Lead = {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviews: number;
  website?: string;
  mapsUrl?: string;
  status: SiteStatus;
  score: number;
};

type PlaceLike = {
  id?: string;
  displayName?: string;
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  websiteURI?: string;
  googleMapsURI?: string;
};

declare global {
  interface Window {
    google?: {
      maps: {
        importLibrary: (name: string) => Promise<{ Place: {
          searchByText: (request: Record<string, unknown>) => Promise<{ places: PlaceLike[] }>;
        } }>;
      };
    };
  }
}

const demoLeads: Lead[] = [
  { id: "demo-1", name: "石窯パン工房 麦日和", address: "熊本県熊本市中央区上通町 4-12", rating: 4.6, reviews: 184, website: "https://instagram.com/mugibiyori", status: "sns", score: 96 },
  { id: "demo-2", name: "珈琲と菓子 ミモザ", address: "熊本県熊本市東区健軍 2-8-3", rating: 4.5, reviews: 96, status: "none", score: 94 },
  { id: "demo-3", name: "小さな洋食店 灯り", address: "熊本県熊本市中央区新町 1-6-8", rating: 4.4, reviews: 238, website: "https://tabelog.com/kumamoto/example", status: "portal", score: 88 },
  { id: "demo-4", name: "菓子屋 saison", address: "熊本県熊本市南区江越 1-5-2", rating: 4.7, reviews: 73, website: "https://saison-kumamoto.jp", status: "official", score: 54 },
  { id: "demo-5", name: "自家焙煎珈琲 凪", address: "熊本県熊本市西区春日 3-10-4", rating: 4.3, reviews: 121, website: "https://facebook.com/nagi.coffee", status: "sns", score: 86 },
];

const statusMeta: Record<SiteStatus, { label: string; short: string }> = {
  none: { label: "Webサイトなし", short: "なし" },
  sns: { label: "SNSのみ", short: "SNS" },
  portal: { label: "ポータルのみ", short: "媒体" },
  official: { label: "公式サイトあり", short: "公式" },
};

const snsDomains = ["instagram.com", "facebook.com", "x.com", "twitter.com", "tiktok.com", "line.me"];
const portalDomains = ["tabelog.com", "hotpepper.jp", "retty.me", "ekiten.jp", "jalan.net", "beauty.hotpepper.jp"];

function classifyWebsite(website?: string): SiteStatus {
  if (!website) return "none";
  const lower = website.toLowerCase();
  if (snsDomains.some((domain) => lower.includes(domain))) return "sns";
  if (portalDomains.some((domain) => lower.includes(domain))) return "portal";
  return "official";
}

function calculateScore(rating: number, reviews: number, status: SiteStatus) {
  const statusScore = { none: 42, sns: 36, portal: 28, official: 0 }[status];
  const ratingScore = Math.max(0, Math.min(34, (rating - 3.5) * 28));
  const reviewScore = Math.min(24, Math.log10(Math.max(reviews, 1)) * 10);
  return Math.round(Math.min(100, statusScore + ratingScore + reviewScore));
}

function loadGoogleMaps(apiKey: string) {
  if (window.google?.maps) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-local-signal-maps]");
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Google Mapsを読み込めませんでした。")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&libraries=places&loading=async`;
    script.async = true;
    script.dataset.localSignalMaps = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Mapsを読み込めませんでした。"));
    document.head.appendChild(script);
  });
}

export default function Home() {
  const [area, setArea] = useState("熊本市");
  const [category, setCategory] = useState("パン屋");
  const [minRating, setMinRating] = useState("4.2");
  const [minReviews, setMinReviews] = useState("50");
  const [apiKey, setApiKey] = useState("");
  const [isGuideOpen, setGuideOpen] = useState(false);
  const [isSearching, setSearching] = useState(false);
  const [isDemo, setDemo] = useState(true);
  const [error, setError] = useState("");
  const [leads, setLeads] = useState<Lead[]>(demoLeads);
  const [activeStatus, setActiveStatus] = useState<SiteStatus | "all">("all");
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => activeStatus === "all" || lead.status === activeStatus);
  }, [leads, activeStatus]);

  const opportunityCount = leads.filter((lead) => lead.status !== "official").length;
  const averageScore = opportunityCount
    ? Math.round(leads.filter((lead) => lead.status !== "official").reduce((sum, lead) => sum + lead.score, 0) / opportunityCount)
    : 0;
  const selectedLead = leads.find((lead) => lead.id === selectedLeadId);

  async function handleSearch(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!apiKey.trim()) {
      setGuideOpen(true);
      return;
    }
    setSearching(true);
    try {
      sessionStorage.setItem("local-signal-api-key", apiKey.trim());
      await loadGoogleMaps(apiKey.trim());
      const library = await window.google?.maps.importLibrary("places");
      if (!library?.Place) throw new Error("Places APIを利用できませんでした。");
      const result = await library.Place.searchByText({
        textQuery: `${category} ${area}`,
        fields: ["id", "displayName", "formattedAddress", "rating", "userRatingCount", "websiteURI", "googleMapsURI"],
        language: "ja",
        region: "jp",
        minRating: Number(minRating),
        maxResultCount: 20,
      });
      const nextLeads = result.places
        .filter((place) => (place.userRatingCount ?? 0) >= Number(minReviews))
        .map((place, index) => {
          const status = classifyWebsite(place.websiteURI);
          const rating = place.rating ?? 0;
          const reviews = place.userRatingCount ?? 0;
          return {
            id: place.id ?? `place-${index}`,
            name: place.displayName ?? "名称未取得",
            address: place.formattedAddress ?? "住所未取得",
            rating,
            reviews,
            website: place.websiteURI,
            mapsUrl: place.googleMapsURI,
            status,
            score: calculateScore(rating, reviews, status),
          } satisfies Lead;
        })
        .sort((a, b) => b.score - a.score);
      setLeads(nextLeads);
      setDemo(false);
      setActiveStatus("all");
      setSelectedLeadId("");
      setGeneratedPrompt("");
      if (!nextLeads.length) setError("条件に一致する店舗がありませんでした。口コミ数を下げてお試しください。");
    } catch (searchError) {
      setError(searchError instanceof Error ? `${searchError.message} API設定とドメイン制限をご確認ください。` : "検索に失敗しました。");
    } finally {
      setSearching(false);
    }
  }

  function restoreDemo() {
    setLeads(demoLeads);
    setDemo(true);
    setError("");
    setActiveStatus("all");
    setSelectedLeadId("");
    setGeneratedPrompt("");
  }

  function selectLead(id: string) {
    setSelectedLeadId(id);
    setGeneratedPrompt("");
    setCopied(false);
  }

  function createWebsitePrompt(leadOverride?: Lead) {
    const targetLead = leadOverride ?? selectedLead;
    if (!targetLead) return;
    const websiteInfo = targetLead.website
      ? `${statusMeta[targetLead.status].label}（${targetLead.website}）`
      : statusMeta[targetLead.status].label;
    const prompt = `あなたは、地域店舗の魅力を引き出すシニアWebデザイナー兼コピーライターです。以下の店舗について公開情報を追加リサーチし、集客と信頼獲得につながる完成度の高いホームページを作成してください。

【対象店舗】
店舗名：${targetLead.name}
住所：${targetLead.address}
Google評価：${targetLead.rating.toFixed(1)}
口コミ数：${targetLead.reviews.toLocaleString()}件
現在のWeb状況：${websiteInfo}
Googleマップ：${targetLead.mapsUrl ?? "店舗名と住所から確認してください"}

【リサーチ】
- Googleマップ、公式SNS、信頼できる公開情報から、営業時間、定休日、電話番号、アクセス、商品・サービス、価格帯、店の歴史、こだわり、口コミ傾向を調査する
- 情報源を照合し、確認できない内容は捏造しない。「要確認」と明示する
- 写真は同じ画像を繰り返さず、店舗・商品・職人・空間・外観など役割の異なる実写画像を使う。利用権限を確認できない画像は仮画像として明示する

【サイト構成】
1. 店名の直後に、店舗の魅力が一目で伝わるアイキャッチ画像と短いメッセージ
2. 店舗の物語、ポリシー、選ばれる理由
3. 主力商品またはサービス
4. 口コミから読み取れる支持される理由
5. 営業時間、住所、アクセス、Googleマップへの導線
6. 電話、予約、問い合わせ、SNSなど最適な行動ボタン

【デザイン要件】
- 店舗の業種と雰囲気に合った独自デザインにし、テンプレート的・AI生成的な見た目を避ける
- 写真を主役にし、文字オーバーレイは写真の一部だけに小さく配置する
- 安っぽい大きな角丸ボタン、過剰なグラデーション、意味のない装飾を避ける
- スマートフォンを最優先し、PC・タブレットにも対応する
- 控えめで自然なスクロールアニメーションを加える
- 読みやすさ、キーボード操作、コントラスト、代替テキストに配慮する

【実装と確認】
- この店舗専用のコピーとデザインで、実際に動作するサイトを実装する
- ローカルブラウザでPC幅とスマホ幅を確認し、重なり、はみ出し、広すぎる余白を修正する
- 最後に、確認できた事実、要確認事項、使用画像の出典または仮画像の区別を簡潔にまとめる`;
    setGeneratedPrompt(prompt);
    setCopied(false);
    window.setTimeout(() => document.getElementById("generated-prompt")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  function copyPrompt() {
    if (!generatedPrompt) return;
    const legacyCopy = () => {
      const temporary = document.createElement("textarea");
      temporary.value = generatedPrompt;
      temporary.setAttribute("readonly", "");
      temporary.style.position = "fixed";
      temporary.style.opacity = "0";
      document.body.appendChild(temporary);
      temporary.select();
      document.execCommand("copy");
      temporary.remove();
    };
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(generatedPrompt).catch(legacyCopy);
    } else {
      legacyCopy();
    }
  }

  function openCodex() {
    if (!generatedPrompt) return;
    const deepLink = `codex://threads/new?prompt=${encodeURIComponent(generatedPrompt)}`;
    const fallbackTimer = window.setTimeout(() => {
      if (document.visibilityState === "visible") window.location.href = "https://chatgpt.com/download/";
    }, 1800);
    const cancelFallback = () => {
      if (document.visibilityState === "hidden") window.clearTimeout(fallbackTimer);
    };
    document.addEventListener("visibilitychange", cancelFallback, { once: true });
    window.location.href = deepLink;
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="LOCAL SIGNAL ホーム">
          <span className="brandMark"><i /><i /><i /></span>
          <span><strong>LOCAL SIGNAL</strong><small>まちの可能性を見つける</small></span>
        </a>
        <div className="headerActions">
          <button className="textButton" onClick={() => setGuideOpen(true)}>API設定ガイド</button>
          <span className={`connection ${apiKey ? "ready" : ""}`}><i />{apiKey ? "API設定済み" : "デモモード"}</span>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="heroIntro">
          <p className="overline">LOCAL BUSINESS RESEARCH</p>
          <h1>いい店なのに、<br /><em>まだ見つかっていない。</em></h1>
          <p className="heroLead">Googleマップの評価から、Webサイトを持たない地域のお店を発見。提案すべき相手が、数字で見えてきます。</p>
        </div>

        <form className="searchPanel" onSubmit={handleSearch}>
          <div className="panelTop">
            <div><span className="stepNumber">01</span><p>検索条件を入力</p></div>
            <button type="button" className="demoReset" onClick={restoreDemo}>サンプルを表示</button>
          </div>
          <div className="mainFields">
            <label><span>地域</span><input value={area} onChange={(e) => setArea(e.target.value)} placeholder="例：熊本市" required /></label>
            <label><span>業種</span><input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="例：パン屋" required /></label>
          </div>
          <div className="subFields">
            <label><span>最低評価</span><select value={minRating} onChange={(e) => setMinRating(e.target.value)}><option value="4">4.0</option><option value="4.2">4.2</option><option value="4.3">4.3</option><option value="4.5">4.5</option></select></label>
            <label><span>最低口コミ数</span><select value={minReviews} onChange={(e) => setMinReviews(e.target.value)}><option value="20">20件</option><option value="50">50件</option><option value="100">100件</option><option value="200">200件</option></select></label>
            <label className="apiField"><span>Google APIキー <button type="button" onClick={() => setGuideOpen(true)}>設定方法</button></span><input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="この画面から外部送信しません" autoComplete="off" /></label>
            <button className="searchButton" type="submit" disabled={isSearching}><span>{isSearching ? "検索中…" : "候補を探す"}</span><b>↗</b></button>
          </div>
          <p className="privacyNote"><span>●</span> APIキーはこの端末のセッション内だけで使用し、運営者のサーバーには保存しません。</p>
        </form>
      </section>

      <section className="results" aria-live="polite">
        <div className="resultHeading">
          <div><span className="stepNumber dark">02</span><p>営業候補を確認</p></div>
          <p className="resultContext"><b>{isDemo ? "サンプルデータ" : `${area}・${category}`}</b><span>{leads.length}件を分析</span></p>
        </div>

        <div className="summaryGrid">
          <article><span>見込み候補</span><strong>{opportunityCount}<small>件</small></strong><p>公式サイトなし・SNS・媒体のみ</p></article>
          <article><span>平均チャンス度</span><strong>{averageScore}<small>/100</small></strong><p>評価・口コミ・Web状況から算出</p></article>
          <article className="breakdown"><span>Webサイト状況</span><div>{(["none", "sns", "portal", "official"] as SiteStatus[]).map((status) => <button key={status} onClick={() => setActiveStatus(status)}><i className={status} />{statusMeta[status].short}<b>{leads.filter((lead) => lead.status === status).length}</b></button>)}</div></article>
        </div>

        <div className="tableToolbar">
          <div className="filterTabs">
            <button className={activeStatus === "all" ? "active" : ""} onClick={() => setActiveStatus("all")}>すべて</button>
            {(["none", "sns", "portal", "official"] as SiteStatus[]).map((status) => <button key={status} className={activeStatus === status ? "active" : ""} onClick={() => setActiveStatus(status)}>{statusMeta[status].label}</button>)}
          </div>
          <span>チャンス度順</span>
        </div>

        <div className={`selectionBar ${selectedLead ? "hasSelection" : ""}`}>
          <div><span>{selectedLead ? "選択中" : "店舗を1件選択"}</span><strong>{selectedLead ? selectedLead.name : "ホームページを作る店舗を選んでください"}</strong></div>
          <button type="button" onClick={() => createWebsitePrompt()} disabled={!selectedLead}>ホームページ作成用<br />プロンプトを生成 <b>↗</b></button>
        </div>

        {error && <div className="errorMessage">{error}</div>}

        <div className="leadTable">
          <div className="tableHead"><span>選択</span><span>店舗</span><span>Google評価</span><span>Webサイト</span><span>チャンス度</span><span /></div>
          {filteredLeads.map((lead, index) => (
            <article className={`leadRow ${selectedLeadId === lead.id ? "selected" : ""}`} key={lead.id}>
              <label className="selectControl" aria-label={`${lead.name}を選択`}><input type="radio" name="selected-store" checked={selectedLeadId === lead.id} onChange={() => selectLead(lead.id)} /><span /></label>
              <div className="storeCell"><span className="rank">{String(index + 1).padStart(2, "0")}</span><div><h2>{lead.name}</h2><p>{lead.address}</p></div></div>
              <div className="ratingCell"><strong>★ {lead.rating.toFixed(1)}</strong><span>{lead.reviews.toLocaleString()}件</span></div>
              <div><span className={`statusBadge ${lead.status}`}><i />{statusMeta[lead.status].label}</span></div>
              <div className="scoreCell"><div><i style={{ width: `${lead.score}%` }} /></div><strong>{lead.score}</strong></div>
              <div className="rowActions">
                {lead.mapsUrl ? <a href={lead.mapsUrl} target="_blank" rel="noreferrer" aria-label={`${lead.name}をGoogleマップで見る`}>地図 ↗</a> : <button type="button" onClick={() => alert("デモデータのため地図リンクはありません。")}>地図 ↗</button>}
                {lead.status !== "official" && <button className="proposal" type="button" onClick={() => { selectLead(lead.id); createWebsitePrompt(lead); }}>この店舗で作る</button>}
              </div>
            </article>
          ))}
          {!filteredLeads.length && !error && <div className="emptyState">この条件に該当する店舗はありません。</div>}
        </div>

        {generatedPrompt && selectedLead && (
          <section className="promptBuilder" id="generated-prompt">
            <div className="promptHeader"><div><span className="stepNumber">03</span><p>作成プロンプト</p></div><p><strong>{selectedLead.name}</strong> 専用</p></div>
            <div className="promptBody">
              <div className="promptText">
                <div><span>生成済みプロンプト</span><button type="button" onClick={copyPrompt}>{copied ? "コピーしました ✓" : "コピー"}</button></div>
                <textarea readOnly value={generatedPrompt} aria-label="生成されたホームページ作成用プロンプト" />
              </div>
              <aside className="codexAction">
                <p className="overline">NEXT STEP</p>
                <h2>このまま、<br />サイト制作へ。</h2>
                <p>生成したプロンプトを入力した状態で、新しいCodexタスクを開きます。</p>
                <button type="button" onClick={openCodex}>Codexでホームページを作成 <span>↗</span></button>
                <small>Codexが開かない場合は、公式ダウンロードページへ移動します。</small>
                <a href="https://chatgpt.com/download/" target="_blank" rel="noreferrer">Codexをダウンロードする</a>
              </aside>
            </div>
          </section>
        )}
      </section>

      <section className="workflow">
        <div><span className="stepNumber pale">04</span><p>見つけた後の流れ</p></div>
        <ol>
          <li><span>1</span><div><strong>候補を絞る</strong><p>評価とWeb状況から、提案する価値の高い店舗を選びます。</p></div></li>
          <li><span>2</span><div><strong>お店を深く知る</strong><p>口コミ・SNS・競合から、その店ならではの魅力を整理します。</p></div></li>
          <li><span>3</span><div><strong>デモサイトを作る</strong><p>情報をCodexへ渡し、店舗に合わせたホームページを形にします。</p></div></li>
        </ol>
      </section>

      <footer><div className="brand footerBrand"><span className="brandMark"><i /><i /><i /></span><span><strong>LOCAL SIGNAL</strong><small>まちの可能性を見つける</small></span></div><p>Google Maps Platformの情報を利用しています。検索結果はGoogleの利用規約に従って表示してください。</p><span>β VERSION 0.1</span></footer>

      {isGuideOpen && (
        <div className="modalBackdrop" role="presentation" onMouseDown={() => setGuideOpen(false)}>
          <section className="guideModal" role="dialog" aria-modal="true" aria-labelledby="guide-title" onMouseDown={(e) => e.stopPropagation()}>
            <button className="modalClose" onClick={() => setGuideOpen(false)} aria-label="閉じる">×</button>
            <p className="overline">5 MINUTE SETUP</p>
            <h2 id="guide-title">Google APIを設定する</h2>
            <p className="guideLead">費用はあなた自身のGoogle Cloudアカウントで管理されます。APIキーは必ず利用制限を設定してください。</p>
            <ol className="guideSteps">
              <li><span>1</span><div><strong>プロジェクトと請求先を作成</strong><p>Google Cloud Consoleで新しいプロジェクトを作り、請求先アカウントを紐づけます。</p></div></li>
              <li><span>2</span><div><strong>2つのAPIを有効化</strong><p>「Maps JavaScript API」と「Places API (New)」を有効にします。</p></div></li>
              <li><span>3</span><div><strong>APIキーを制限</strong><p>アプリケーション制限を「ウェブサイト」、API制限を上記2つだけにします。</p></div></li>
              <li><span>4</span><div><strong>予算と上限を設定</strong><p>予算通知とクォータを設定し、想定外の利用を防ぎます。</p></div></li>
            </ol>
            <a className="consoleLink" href="https://console.cloud.google.com/google/maps-apis/credentials" target="_blank" rel="noreferrer">Google Cloud Consoleを開く <span>↗</span></a>
            <button className="modalDone" onClick={() => setGuideOpen(false)}>設定したので検索画面へ</button>
          </section>
        </div>
      )}
    </main>
  );
}
