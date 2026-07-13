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

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => activeStatus === "all" || lead.status === activeStatus);
  }, [leads, activeStatus]);

  const opportunityCount = leads.filter((lead) => lead.status !== "official").length;
  const averageScore = opportunityCount
    ? Math.round(leads.filter((lead) => lead.status !== "official").reduce((sum, lead) => sum + lead.score, 0) / opportunityCount)
    : 0;

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

        {error && <div className="errorMessage">{error}</div>}

        <div className="leadTable">
          <div className="tableHead"><span>店舗</span><span>Google評価</span><span>Webサイト</span><span>チャンス度</span><span /></div>
          {filteredLeads.map((lead, index) => (
            <article className="leadRow" key={lead.id}>
              <div className="storeCell"><span className="rank">{String(index + 1).padStart(2, "0")}</span><div><h2>{lead.name}</h2><p>{lead.address}</p></div></div>
              <div className="ratingCell"><strong>★ {lead.rating.toFixed(1)}</strong><span>{lead.reviews.toLocaleString()}件</span></div>
              <div><span className={`statusBadge ${lead.status}`}><i />{statusMeta[lead.status].label}</span></div>
              <div className="scoreCell"><div><i style={{ width: `${lead.score}%` }} /></div><strong>{lead.score}</strong></div>
              <div className="rowActions">
                {lead.mapsUrl ? <a href={lead.mapsUrl} target="_blank" rel="noreferrer" aria-label={`${lead.name}をGoogleマップで見る`}>地図 ↗</a> : <button type="button" onClick={() => alert("デモデータのため地図リンクはありません。")}>地図 ↗</button>}
                {lead.status !== "official" && <button className="proposal" type="button" onClick={() => alert(`${lead.name}向けの提案準備機能は次のバージョンで追加予定です。`)}>提案準備</button>}
              </div>
            </article>
          ))}
          {!filteredLeads.length && !error && <div className="emptyState">この条件に該当する店舗はありません。</div>}
        </div>
      </section>

      <section className="workflow">
        <div><span className="stepNumber pale">03</span><p>見つけた後の流れ</p></div>
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
