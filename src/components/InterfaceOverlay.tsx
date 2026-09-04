interface InterfaceOverlayProps {
  engaged: boolean;
  onToggle: () => void;
}

export function InterfaceOverlay({ engaged, onToggle }: InterfaceOverlayProps) {
  return (
    <section
      className="interface"
      aria-label="Texcra Continuum Craft visualizer"
    >
      <div className="frame" aria-hidden="true">
        <span className="frame-notch frame-notch-top" />
        <span className="frame-notch frame-notch-bottom" />
      </div>

      <header className="masthead">
        <div className="brand-lockup">
          <p className="wordmark">TEXCRA</p>
          <p className="brand-line">Technology&nbsp; / &nbsp;Craftsmanship</p>
        </div>
        <div className="observation">
          <p>Observation TC–01</p>
          <p>A system of care</p>
        </div>
      </header>

      <div className="hero-copy">
        <span className="hero-rule" aria-hidden="true" />
        <p className="eyebrow">Material study / 01</p>
        <h1>
          Continuum
          <br />
          Craft
        </h1>
        <p className="tagline">Precision becomes atmosphere</p>
      </div>

      <button
        className="continuity-panel"
        type="button"
        onClick={onToggle}
        aria-pressed={engaged}
        aria-label={`${engaged ? "Disengage" : "Engage"} continuum flow`}
      >
        <span className="panel-heading">
          Continuity index
          <span className={`signal ${engaged ? "is-live" : ""}`} />
        </span>
        <span className="metric">
          {engaged ? "100.00" : "99.997"}
          <small>%</small>
        </span>
        <span className="panel-divider" />
        <span className="panel-meta">
          △ 0.0001&nbsp;&nbsp; / &nbsp;&nbsp;R ∞
        </span>
        <span className="panel-action">
          {engaged ? "Flow engaged" : "Activate flow"}
        </span>
      </button>

      <footer className="footer-data">
        <p>Persistence&nbsp; · &nbsp;Precision&nbsp; · &nbsp;Scale</p>
        <div className="sequence" aria-hidden="true">
          <span>01</span>
          <span>02</span>
          <span>03</span>
          <span>05</span>
          <span>08</span>
        </div>
      </footer>

      <p className="interaction-hint">
        Drag the ring&nbsp; / &nbsp;move to refract
      </p>
    </section>
  );
}
