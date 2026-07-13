const breads = [
  {
    name: "Pain de Campagne",
    jp: "田舎パン",
    price: "¥680",
    note: "北海道小麦・自家製酵母",
    shape: "round",
  },
  {
    name: "Croissant au Beurre",
    jp: "発酵バターのクロワッサン",
    price: "¥360",
    note: "フランス産発酵バター",
    shape: "crescent",
  },
  {
    name: "Baguette Tradition",
    jp: "バゲット・トラディション",
    price: "¥420",
    note: "石臼挽き小麦・海塩",
    shape: "long",
  },
];

function Wheat() {
  return (
    <span className="wheat" aria-hidden="true">
      <i /><i /><i /><i /><i /><b />
    </span>
  );
}

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <div className="grain" aria-hidden="true" />
        <nav className="nav shell" aria-label="メインナビゲーション">
          <a className="wordmark" href="#top" aria-label="ブーランジュリー ミュゲ ホーム">
            <span className="mark">M</span>
            <span>
              <strong>BOULANGERIE</strong>
              <em>MUGUET</em>
            </span>
          </a>
          <div className="navLinks">
            <a href="#breads">パン</a>
            <a href="#story">私たちのこと</a>
            <a href="#visit">店舗案内</a>
          </div>
          <a className="navCta" href="#visit">本日の営業時間</a>
        </nav>

        <div className="heroInner shell">
          <div className="heroCopy">
            <p className="eyebrow"><span />EST. 1987 · KAMAKURA<span /></p>
            <h1>
              日々に、<br />
              <i>小さな</i>豊かさを。
            </h1>
            <p className="lead">
              石窯から生まれる、香ばしい音。<br />
              ゆっくりと発酵させたパンと、丁寧に淹れた珈琲を。
            </p>
            <div className="heroActions">
              <a className="button primary" href="#breads">今日のパンを見る <span>↗</span></a>
              <a className="textLink" href="#story">ミュゲの物語 <span>→</span></a>
            </div>
          </div>

          <div className="heroVisual" aria-label="焼きたてのカンパーニュのイラスト">
            <div className="halo" />
            <div className="steam steam1">⌁</div>
            <div className="steam steam2">⌁</div>
            <div className="steam steam3">⌁</div>
            <div className="bread heroBread">
              <span /><span /><span />
            </div>
            <Wheat />
            <div className="stamp">
              <span>BAKED</span>
              <strong>07:30</strong>
              <span>THIS MORNING</span>
            </div>
          </div>
        </div>

        <div className="heroFoot shell">
          <p><span className="pulse" /> ただいま、焼きたてです</p>
          <a href="#breads" aria-label="下へスクロール">SCROLL <i>↓</i></a>
          <p className="weather">鎌倉・扇ガ谷 <span>14°C</span></p>
        </div>
      </section>

      <section className="ticker" aria-label="お店のこだわり">
        <div>
          <span>天然酵母</span><i>✦</i><span>国産小麦</span><i>✦</i><span>石窯焼き</span><i>✦</i>
          <span>天然酵母</span><i>✦</i><span>国産小麦</span><i>✦</i><span>石窯焼き</span><i>✦</i>
        </div>
      </section>

      <section className="breads section shell" id="breads">
        <header className="sectionHead">
          <div>
            <p className="kicker">FROM THE OVEN</p>
            <h2>今日の焼き上がり</h2>
          </div>
          <p>その日の気温と湿度を見ながら、<br />毎朝少しずつ表情の違うパンを焼いています。</p>
        </header>

        <div className="breadGrid">
          {breads.map((item, index) => (
            <article className="breadCard" key={item.name} style={{ "--delay": `${index * 120}ms` } as React.CSSProperties}>
              <div className={`breadStage ${item.shape}`}>
                <span className="number">0{index + 1}</span>
                <div className={`bread miniBread ${item.shape}`}><span /><span /><span /></div>
                <span className="flour" aria-hidden="true" />
              </div>
              <div className="cardInfo">
                <p>{item.name}</p>
                <h3>{item.jp}</h3>
                <div><span>{item.note}</span><strong>{item.price}</strong></div>
              </div>
            </article>
          ))}
        </div>
        <a className="button outline" href="#visit">すべてのパンは店頭で <span>→</span></a>
      </section>

      <section className="story" id="story">
        <div className="storyInner shell">
          <div className="ovenScene" aria-hidden="true">
            <div className="arch">
              <div className="fire"><i /><i /><i /></div>
              <span className="ovenBread" />
            </div>
            <p>OUR STONE OVEN<br /><b>since 1987</b></p>
          </div>
          <div className="storyCopy">
            <p className="kicker light">OUR PHILOSOPHY</p>
            <h2>時間がおいしく<br />してくれる。</h2>
            <p className="dropcap">急がず、余計なものを加えず。小麦と水と塩、そして季節の空気に耳を澄ませます。低温で一晩寝かせた生地は、翌朝、石窯の炎の中で香り高いパンになります。</p>
            <p>つくる人にも、食べる人にも、心地よい時間でありますように。</p>
            <div className="signature">Haru M.</div>
            <small>二代目パン職人　村瀬 春</small>
          </div>
        </div>
      </section>

      <section className="visit section shell" id="visit">
        <div className="visitCard">
          <div className="visitIntro">
            <p className="kicker">COME SAY HELLO</p>
            <h2>パンの香りを<br />たどって、お越しください。</h2>
            <p>古い洋館を改装した小さなお店です。窓辺に8席のカフェをご用意しています。</p>
          </div>
          <div className="details">
            <div>
              <span>ADDRESS</span>
              <p>神奈川県鎌倉市扇ガ谷 2-8-14<br />鎌倉駅 西口より徒歩8分</p>
            </div>
            <div>
              <span>OPEN</span>
              <p>水–日　8:00–17:00<br />月・火　定休日</p>
            </div>
            <div>
              <span>TELEPHONE</span>
              <p>0467-00-1987</p>
            </div>
          </div>
          <a className="roundLink" href="https://maps.google.com" aria-label="地図を開く">MAP <span>↗</span></a>
        </div>
      </section>

      <footer>
        <div className="shell footerInner">
          <div className="footerBrand"><span className="mark">M</span><strong>BOULANGERIE MUGUET</strong></div>
          <p>パンと珈琲と、静かな朝。</p>
          <div><a href="#top">Instagram</a><a href="#top">Online Shop</a></div>
          <small>© 2026 BOULANGERIE MUGUET</small>
        </div>
      </footer>
    </main>
  );
}
