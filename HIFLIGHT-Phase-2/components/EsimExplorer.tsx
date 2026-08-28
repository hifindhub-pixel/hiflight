const AIRALO_LINK = "https://airalo.tpk.lu/uQBzbNMH";
const alternatives = [
  { name: "Saily", href: "https://saily.tpk.lu/WTzGQa9T", mark: "S", tone: "blue", description: "Une application claire pour préparer et activer sa connexion avant le départ." },
  { name: "Yesim", href: "https://yesim.tpk.lu/QYk4GCvP", mark: "Y", tone: "green", description: "Des forfaits par pays, région ou zone mondiale selon votre itinéraire." },
] as const;

export default function EsimExplorer() {
  return (
    <>
      <section className="market-hero esim"><div>
        <h1>Le monde dans votre poche,<br /><span>dès l’atterrissage.</span></h1>
        <p className="esim-hero-copy">Choisissez votre destination, consultez les forfaits disponibles et partez connecté sans changer de carte SIM physique.</p>
        <section className="esim-airalo-shell" aria-label="Recherche de forfaits eSIM Airalo">
          <div className="esim-airalo-card">
            <header>
              <div><span className="esim-airalo-mark">A</span><p><strong>Airalo</strong><small>Partenaire eSIM HiFlight</small></p></div>
              <b>Plus de 200 destinations</b>
            </header>
            <div className="esim-airalo-content">
              <div>
                <span className="esim-airalo-kicker">Votre connexion de voyage</span>
                <h2>Choisissez le forfait adapté à votre destination.</h2>
                <p>Consultez les volumes de données, les durées et les prix disponibles directement chez Airalo.</p>
                <a href={AIRALO_LINK} target="_blank" rel="nofollow sponsored noopener">Voir les forfaits Airalo</a>
              </div>
              <ul>
                <li><strong>Local</strong><span>Un forfait pour votre destination</span></li>
                <li><strong>Régional</strong><span>Plusieurs pays avec une seule eSIM</span></li>
                <li><strong>Mondial</strong><span>Une couverture pensée pour les grands voyages</span></li>
              </ul>
            </div>
          </div>
        </section>
        <p className="hero-disclaimer">Les prix, volumes de données, durées et compatibilités sont confirmés sur le site du partenaire.</p>
      </div></section>

      <section className="esim-results section">
        <div className="esim-results-head"><div><h2>Deux alternatives,<br />une connexion partout.</h2></div><p>Comparez aussi les conditions et la couverture proposées par d’autres spécialistes avant de choisir votre forfait.</p></div>
        <div className="esim-alternatives">
          {alternatives.map((provider) => <article className="esim-provider" key={provider.name}>
            <div className={`esim-provider-mark ${provider.tone}`}>{provider.mark}</div>
            <h3>{provider.name}</h3><p>{provider.description}</p>
            <ul><li>Activation 100 % numérique</li><li>Forfaits selon la destination</li><li>Votre SIM principale reste en place</li></ul>
            <a href={provider.href} target="_blank" rel="nofollow sponsored noopener">Découvrir les forfaits <span aria-hidden="true">→</span></a>
          </article>)}
          <article className="esim-photo-card"><div><span>Prêt avant le décollage</span><h3>Installez aujourd’hui.<br />Activez à l’arrivée.</h3></div></article>
        </div>

        <div className="esim-how"><h2>Connecté dès l’atterrissage.</h2><div><article><h3>Choisissez votre forfait</h3><p>Sélectionnez le pays, le volume de données et la durée adaptés.</p></article><article><h3>Installez-le avant de partir</h3><p>Scannez le QR code reçu après votre achat, avant le départ.</p></article><article><h3>Activez-le à l’arrivée</h3><p>Activez l’eSIM à l’arrivée et gardez votre numéro principal.</p></article></div></div>
      </section>
    </>
  );
}
