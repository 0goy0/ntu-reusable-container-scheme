import { useEffect, useRef, useState } from 'react';
import CampusMap from '../map/CampusMap';
import { Reveal, SectionHead } from '../ui';
import { useInView } from '../../hooks/scroll';
import { useCanteens } from '../../hooks/useCanteens';
import { freeOf } from '../../lib/routing';
import { DEPOSIT } from '../../data/content';

const STEP_LABELS = ['Borrow', 'Hand to stall', 'Return', 'Refund', 'Wash & move'];
const NO_STEPS = [false, false, false, false, false];
const money = n => `$${n.toFixed(2)}`;
const timeNow = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const clockNow = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M/i, '');
const dateNow = () => new Date().toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });

export default function Demo() {
  const [sectionRef, inView] = useInView({ threshold: 0.05, once: false });
  const { data, adjust, all } = useCanteens(inView);
  const map = useRef(null);
  const timers = useRef([]);
  const logId = useRef(0);
  const [loan, setLoan] = useState(null);
  const [steps, setSteps] = useState(NO_STEPS);
  const [log, setLog] = useState([]);
  const [msg, setMsg] = useState(null);
  const [clock, setClock] = useState(clockNow);

  useEffect(() => {
    const t = setInterval(() => setClock(clockNow()), 10000);
    const pending = timers.current;
    return () => { clearInterval(t); pending.forEach(clearTimeout); };
  }, []);

  const addLog = node => setLog(l => [{ id: ++logId.current, t: timeNow(), node }, ...l]);

  function borrow(c) {
    if (c.stock <= 0) return;
    const id = `RC-${Math.floor(1000 + Math.random() * 9000)}`;
    setLoan({ id, from: c.name });
    setSteps([true, false, false, false, false]);
    setMsg(null);
    adjust(c.id, -1);
    addLog(<>Borrowed <b>{id}</b> at {c.name} · <span className="minus">−{money(DEPOSIT)} deposit held</span></>);
  }

  function handToStall() {
    setSteps(s => [s[0], true, ...s.slice(2)]);
    addLog(<>Handed <b>{loan.id}</b> to the stall. Takeaway packed.</>);
  }

  function giveBack(c) {
    if (freeOf(c) <= 0) return;
    const l = loan;
    setLoan(null);
    setSteps(s => [s[0], s[1], true, true, false]);
    adjust(c.id, 1);
    addLog(<>Returned <b>{l.id}</b> at {c.name}</>);
    addLog(<span className="plus">+{money(DEPOSIT)} deposit refunded</span>);
    setMsg(<>Returned at <b>{c.name}</b>. Your {money(DEPOSIT)} is back. The container is off to be washed…</>);
    timers.current.push(setTimeout(() => {
      // Washed, then sent to the canteen whose machine is emptiest.
      const low = all().filter(x => x.id !== c.id).sort((a, b) => a.stock / a.cap - b.stock / b.cap)[0];
      if (adjust(c.id, -1)) adjust(low.id, 1);
      setSteps(s => [...s.slice(0, 4), true]);
      addLog(<><b>{l.id}</b> washed and redistributed to {low.name}</>);
      setMsg(<>Washed in a commercial dishwasher and sent to <b>{low.name}</b>, which was running low. Loop complete!</>);
    }, 2600));
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setLoan(null);
    setSteps(NO_STEPS);
    setLog([]);
    setMsg(null);
    map.current?.deselect();
  }

  const extraActions = [{
    primary: true,
    label: () => (loan ? 'Return here' : `Borrow here · ${money(DEPOSIT)}`),
    disabled: c => (loan ? freeOf(c) <= 0 : c.stock <= 0),
    run: c => (loan ? giveBack(c) : borrow(c))
  }];

  const badge = loan
    ? { cls: ' active', text: `${loan.id} · borrowed` }
    : steps[3] ? { cls: ' done', text: 'Refunded' } : { cls: '', text: 'No container' };

  const message = msg || (loan
    ? (steps[1]
      ? <>Enjoy your meal! When you're done, tap a canteen with space on the map and press <b>Return here</b>.</>
      : <>Container <b>{loan.id}</b> is yours. Hand it to the stall owner to pack your takeaway.</>)
    : <>Tap any canteen pin on the map, then press <b>Borrow here</b> to pay the {money(DEPOSIT)} deposit.</>);

  return (
    <section className="demo-sec" id="demo" ref={sectionRef}>
      <div className="wrap">
        <SectionHead
          index="04"
          kicker="The product"
          title="Built to plug straight into NTU OmniBus."
          lead="Students already open OmniBus to get around campus. This working prototype shows the scheme as a new tab: live machine capacity on a MazeMap-style map, and a deposit wallet for borrowing and returning. Try the full loop."
        />
      </div>

      <div className="ipad-wrap">
        <Reveal className="ipad" delay={0.1}>
          <div className="ipad-screen">
            <div className="ipad-status">
              <span>{clock}&nbsp;&nbsp;{dateNow()}</span>
              <span>Wi-Fi · 82% <i className="battery" /></span>
            </div>
            <div className="app-bar">
              <span className="app-logo">OmniBus</span>
              <div className="app-tabs"><span>Bus arrivals</span><span className="on">Reusable containers</span><span>Campus map</span></div>
              <span className="live"><i />Live</span>
            </div>
            <div className="app-body">
              <div className="app-map">
                <CampusMap ref={map} data={data} extraActions={extraActions} collapsed />
              </div>
              <aside className="wallet" aria-label="Container deposit wallet">
                <div className="w-title"><h3>Your deposit</h3><span className={`w-badge${badge.cls}`}>{badge.text}</span></div>
                <div className={`w-card${loan ? ' held' : ''}`}>
                  <small>Deposit held</small>
                  <div className="w-held">{money(loan ? DEPOSIT : 0)}</div>
                  <div className="w-id">{loan ? `Borrowed at ${loan.from}` : 'Refundable anytime once returned'}</div>
                </div>
                <p className="w-msg" aria-live="polite">{message}</p>
                <ol className="w-steps">
                  {STEP_LABELS.map((s, i) => <li key={s} className={steps[i] ? 'done' : undefined}>{s}</li>)}
                </ol>
                <div className="w-actions">
                  <button type="button" className="primary" disabled={!loan || steps[1]} onClick={handToStall}>Hand container to stall</button>
                  <div className="row">
                    <button type="button" onClick={() => map.current?.nearest()}>Nearest return spot</button>
                    <button type="button" onClick={reset}>Reset demo</button>
                  </div>
                </div>
                <div className="w-log">
                  <h4>Activity</h4>
                  <ol>
                    {log.length ? log.map(e => <li key={e.id}><time>{e.t}</time><span>{e.node}</span></li>)
                      : <li><time>--:--</time><span className="muted">Nothing yet.</span></li>}
                  </ol>
                </div>
              </aside>
            </div>
            <div className="ipad-home" />
          </div>
        </Reveal>
      </div>
      <p className="demo-note">
        Capacity numbers change every few seconds to simulate other students. North Spine is full on purpose:
        tap it to see the “return elsewhere” suggestion. Drag to pan, Ctrl + scroll to zoom, and zoom in to see hall names.
      </p>
    </section>
  );
}
