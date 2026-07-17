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

function copyTextWithFallback(text: string) {
  const legacyCopy = () => {
    const temporary = document.createElement("textarea");
    temporary.value = text;
    temporary.setAttribute("readonly", "");
    temporary.style.position = "fixed";
    temporary.style.opacity = "0";
    document.body.appendChild(temporary);
    temporary.select();
    document.execCommand("copy");
    temporary.remove();
  };
  if (navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(text).catch(legacyCopy);
  } else {
    legacyCopy();
  }
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
  const [salesCopy, setSalesCopy] = useState("");
  const [salesCopied, setSalesCopied] = useState(false);

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
      setSalesCopy("");
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
    setSalesCopy("");
  }

  function selectLead(id: string) {
    setSelectedLeadId(id);
    setGeneratedPrompt("");
    setSalesCopy("");
    setCopied(false);
  }

  function createWebsitePrompt(leadOverride?: Lead) {
    const targetLead = leadOverride ?? selectedLead;
    if (!targetLead) return;
    const websiteInfo = targetLead.website
      ? `${statusMeta[targetLead.status].label}（${targetLead.website}）`
      : statusMeta[targetLead.status].label;
    const prompt = `あなたは、Webディレクター、UXデザイナー、コピーライター、リサーチャー、フロントエンドエンジニアを兼ねる制作責任者です。以下の調査資料を起点に、対象店舗の魅力と信頼性が正しく伝わり、実際に公開・運用できる高品質なホームページを完成させてください。単なる案やワイヤーフレームではなく、現在の作業環境に実装し、ブラウザ確認と修正まで行ってください。

【自動挿入された対象情報】
店舗名：${targetLead.name}
住所：${targetLead.address}
検索地域：${area || "未指定"}
検索時の業種：${category || "未指定（リサーチで特定）"}
Google評価：${targetLead.rating.toFixed(1)}
口コミ数：${targetLead.reviews.toLocaleString()}件
現在のWeb状況：${websiteInfo}
Googleマップ：${targetLead.mapsUrl ?? "店舗名と住所から確認してください"}

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

品質基準は「見た目が整っている」だけではありません。対象店舗らしさ、情報の正確さ、顧客が迷わない導線、スマートフォンでの使いやすさ、アクセシビリティ、実装の動作、公開時の誤認防止まで満たして完成としてください。`;
    setGeneratedPrompt(prompt);
    setCopied(false);
    window.setTimeout(() => document.getElementById("generated-prompt")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  function copyPrompt() {
    if (!generatedPrompt) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
    copyTextWithFallback(generatedPrompt);
  }

  function createSalesCopy() {
    if (!selectedLead) return;
    const siteSituation = statusMeta[selectedLead.status].label;
    const copy = `【営業前に必ず確認】
以下はたたき台です。送信前に店舗の実際の口コミ・SNSを確認し、［ ］内を具体的な事実に置き換えてください。営業目的を隠さず、相手の時間を尊重して使用してください。

━━━━━━━━━━━━━━━━━━
1. 最初のDM（短文・許可を取る型）
━━━━━━━━━━━━━━━━━━
${selectedLead.name} ご担当者さま

突然のご連絡失礼いたします。Googleマップで拝見し、${selectedLead.rating.toFixed(1)}の評価と${selectedLead.reviews.toLocaleString()}件もの口コミ、特に「［口コミで繰り返し評価されている具体的な魅力］」が印象に残りました。

一方で、現在は${siteSituation}のため、初めて探す方には魅力や基本情報が十分届き切っていない可能性があると感じました。Web制作のご提案なのですが、まず営業資料ではなく、${selectedLead.name}さま向けの改善イメージを1枚にまとめてお送りしてもよろしいでしょうか。

不要でしたら、その旨だけお知らせいただければ以後ご連絡いたしません。

━━━━━━━━━━━━━━━━━━
2. 電話の第一声（30秒で許可を取る）
━━━━━━━━━━━━━━━━━━
「突然のお電話失礼いたします。私、地域のお店のWeb制作をしている［名前］と申します。営業のお電話なのですが、30秒だけ要点をお伝えしてもよろしいでしょうか。」

許可をいただけた場合：
「ありがとうございます。${selectedLead.name}さまをGoogleマップで拝見し、評価${selectedLead.rating.toFixed(1)}・口コミ${selectedLead.reviews.toLocaleString()}件と、とても支持されていることが分かりました。ただ、現在は${siteSituation}なので、検索から来た新規のお客さまが魅力や営業時間を一度に確認しにくい状態です。店舗専用のホームページ案を無料で1案だけ作ってお見せしたいのですが、送付先を伺ってもよろしいでしょうか。」

「今は必要ない」と言われた場合：
「承知しました。お時間をいただきありがとうございます。今後こちらから繰り返しご連絡することはありません。」

「費用が心配」と言われた場合：
「ご心配はもっともです。契約前提ではなく、まず完成イメージと費用の選択肢をご覧いただき、必要性を感じなければそこで終了できます。」

━━━━━━━━━━━━━━━━━━
3. フォローDM（3〜5日後・1回だけ）
━━━━━━━━━━━━━━━━━━
先日ご連絡した［名前］です。何度も失礼いたします。

${selectedLead.name}さまの場合、SNSを置き換えるのではなく、「初めての方が営業時間・場所・こだわりを迷わず確認できるページ」を加えるだけでも効果が期待できます。

ご関心があれば、店舗専用の簡単な構成案をお送りします。今回は見送りの場合、ご返信は不要です。こちらで最後のご連絡といたします。

━━━━━━━━━━━━━━━━━━
4. PASONA型の提案文
━━━━━━━━━━━━━━━━━━
【P｜Problem：問題】
Googleマップで高く評価されていても、公式ホームページがないと、初めてのお客さまは営業時間・商品・お店のこだわりを複数の場所で探さなければなりません。

【A｜Affinity：共感】
日々の営業やSNS更新で忙しい中、ホームページまで自分で作る時間が取れないのは当然です。制作会社へ頼むと高額になりそうで、後回しになる事情もよく分かります。

【S｜Solution：解決】
そこで、GoogleマップやSNSで既に伝わっている${selectedLead.name}さまの魅力を整理し、初めての方が必要な情報へすぐ辿り着ける店舗専用サイトをご提案します。SNSはそのまま活かし、ホームページを「情報の案内所」として追加します。

【O｜Offer：提案】
まずは契約前提ではなく、トップページの構成案と完成イメージを1案ご用意します。内容をご覧いただいて、必要性を感じた場合だけ次へ進めます。

【N｜Narrowing down：限定】
一店舗ずつ情報を確認して制作するため、同時にご案内できる件数を絞っています。今月は［対応可能件数］店舗までです。

【A｜Action：行動】
興味がありましたら「構成案希望」と一言ご返信ください。${selectedLead.name}さま向けの案をお送りします。

━━━━━━━━━━━━━━━━━━
5. 件名・冒頭フック候補
━━━━━━━━━━━━━━━━━━
- 口コミ${selectedLead.reviews.toLocaleString()}件の魅力を、初めての方にも伝えるご提案
- ${selectedLead.name}さまの「［具体的な魅力］」を検索でも伝える方法
- SNSはそのままに、店舗情報を一か所にまとめるご提案
- 営業資料ではなく、店舗専用の構成案を1枚お送りします

【避ける表現】
- 「必ず売上が上がる」など根拠のない断定
- 架空の限定数や締切
- 営業目的を隠した友人・客のふり
- 返信がない相手への繰り返し送信
- 口コミ内容を確認せずに使う過剰なお世辞`;
    setSalesCopy(copy);
    setSalesCopied(false);
    window.setTimeout(() => document.getElementById("sales-copy")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  function copySalesCopy() {
    if (!salesCopy) return;
    setSalesCopied(true);
    window.setTimeout(() => setSalesCopied(false), 1800);
    copyTextWithFallback(salesCopy);
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
          <p className="overline">WEBSITE CREATION TOOL</p>
          <h1>見つからない名店に、<br /><em>ホームページを。</em></h1>
          <p className="heroLead">口コミで愛されているのに、検索には出てこないお店。Googleマップの評価からそんなお店を見つけ、その場で専用ホームページの制作へ進めます。</p>
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
            <label className={`apiField ${apiKey ? "isSet" : "needsSetup"}`}><span>Google APIキー <em>必須</em> <button type="button" className="setupButton" onClick={() => setGuideOpen(true)}>設定方法</button></span><input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="未入力だとサンプルデータのみ表示されます" autoComplete="off" /></label>
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
          <><section className="promptBuilder" id="generated-prompt">
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
          <section className="salesCta">
            <div><p className="overline">SALES SUPPORT</p><h2>魅力を、伝わる言葉に。</h2><p>選択した店舗に合わせて、電話・DM・フォロー文・PASONA型の提案文をまとめて作成します。</p></div>
            <button type="button" onClick={createSalesCopy}>営業用の訴求文を作成 <span>↗</span></button>
          </section>
          {salesCopy && (
            <section className="salesCopyBuilder" id="sales-copy">
              <header><div><span className="stepNumber">04</span><p>営業用の訴求文</p></div><button type="button" onClick={copySalesCopy}>{salesCopied ? "すべてコピーしました ✓" : "すべてコピー"}</button></header>
              <div className="salesCopyBody">
                <aside><p className="overline">PASONA FRAMEWORK</p><h2>売り込む前に、<br />理解を伝える。</h2><p>具体的な評価や口コミに触れ、30秒の許可を取ってから提案へ進む構成です。</p><ul><li>営業目的は正直に伝える</li><li>店舗固有の事実を入れる</li><li>断りやすい出口を用意する</li><li>フォローは1回まで</li></ul></aside>
                <div><div className="copyLabel"><span>{selectedLead.name} 専用テンプレート</span><small>［ ］内は実際の情報に置き換えてください</small></div><textarea readOnly value={salesCopy} aria-label="生成された営業用の訴求文" /></div>
              </div>
            </section>
          )}</>
        )}
      </section>

      <section className="workflow">
        <div><span className="stepNumber pale">05</span><p>見つけた後の流れ</p></div>
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
