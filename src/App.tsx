import { useMemo, useState } from "react";

type Tab = "home" | "explore" | "map" | "saved" | "profile";
type Screen = Tab | "detail" | "booking" | "confirmation" | "transport" | "add-place" | "host" | "create-listing";

const images = {
  hero: "https://images.unsplash.com/photo-1580851026379-fe731749d344?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=88&w=1200",
  rawanduz: "https://images.unsplash.com/photo-1633933486989-44375b746ae4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
  korek: "https://images.unsplash.com/photo-1673982718205-5c6f42d5d18b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
  valley: "https://images.unsplash.com/photo-1706605095051-cf85a77aa4bd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
  lake: "https://images.unsplash.com/photo-1703413949013-37658fd3da36?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
  villa: "https://images.unsplash.com/photo-1718034102078-3c484debfe4d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=88&w=1000",
  pool: "https://images.unsplash.com/photo-1561986393-193c23e7c3aa?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=86&w=900",
};

const icons: Record<string, React.ReactNode> = {
  home: <><path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.2V21h13V9.2M9 21v-7h6v7"/></>,
  compass: <><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z"/></>,
  map: <><path d="m3 6 5-3 8 3 5-3v15l-5 3-8-3-5 3V6Z"/><path d="M8 3v15M16 6v15"/></>,
  heart: <path d="M20.8 5.8a5.5 5.5 0 0 0-7.8 0L12 6.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z"/>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"/><path d="M10 21h4"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  back: <path d="m15 18-6-6 6-6"/>,
  star: <path d="m12 2.5 2.9 5.9 6.6 1-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5-4.8-4.6 6.6-1L12 2.5Z"/>,
  pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></>,
  car: <><path d="m5 17-2-2v-4l2-5h14l2 5v4l-2 2H5Z"/><path d="M5 17v3M19 17v3M3 11h18"/><circle cx="7" cy="14" r="1"/><circle cx="17" cy="14" r="1"/></>,
  building: <><path d="M4 21V5l8-3 8 3v16M9 21v-4h6v4"/><path d="M8 8h1M15 8h1M8 12h1M15 12h1"/></>,
  key: <><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l2 2M14 9l2 2"/></>,
  tent: <><path d="m3 20 9-17 9 17H3Z"/><path d="m12 3 3 17M9 20l3-6 3 6"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></>,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  camera: <><path d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v10H2V9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="4"/></>,
  filter: <><path d="M4 6h16M7 12h10M10 18h4"/></>,
};

function Icon({ name, size = 21, filled = false }: { name: string; size?: number; filled?: boolean }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>;
}

function Button({ children, onClick, variant = "primary", className = "" }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost"; className?: string }) {
  return <button className={`button button-${variant} ${className}`} onClick={onClick}>{children}</button>;
}

function IconButton({ icon, onClick, active = false, label }: { icon: string; onClick?: () => void; active?: boolean; label: string }) {
  return <button className={`icon-button ${active ? "active" : ""}`} onClick={onClick} aria-label={label}><Icon name={icon} filled={active} /></button>;
}

const properties = [
  { id: 1, name: "Halgurd Pool Villa", location: "Shaqlawa, Erbil", price: 185, rating: "4.9", image: images.villa, tag: "Guest favorite" },
  { id: 2, name: "Korek Mountain Cabin", location: "Korek, Erbil", price: 128, rating: "4.8", image: images.pool, tag: "Rare find" },
  { id: 3, name: "Dukan Lake House", location: "Dukan, Sulaymaniyah", price: 142, rating: "4.7", image: images.lake, tag: "Lake view" },
];

function SectionTitle({ title, eyebrow, onView }: { title: string; eyebrow?: string; onView?: () => void }) {
  return <div className="section-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>{onView && <button className="text-action" onClick={onView}>View all <Icon name="chevron" size={15} /></button>}</div>;
}

function PropertyCard({ item, favorite, onFavorite, onOpen, wide = false }: { item: typeof properties[0]; favorite: boolean; onFavorite: () => void; onOpen: () => void; wide?: boolean }) {
  return <article className={`property-card ${wide ? "wide" : ""}`} onClick={onOpen}>
    <div className="card-image"><img src={item.image} alt={item.name} /><span className="card-tag">{item.tag}</span><div onClick={(event) => event.stopPropagation()}><IconButton icon="heart" active={favorite} onClick={onFavorite} label="Save property" /></div></div>
    <div className="card-copy"><div><h3>{item.name}</h3><p><Icon name="pin" size={14} />{item.location}</p></div><span className="rating"><Icon name="star" size={13} filled /> {item.rating}</span></div>
    <div className="price"><strong>${item.price}</strong> / night</div>
  </article>;
}

function SearchBar({ onFocus, query, setQuery, placeholder = "Where do you want to go?" }: { onFocus?: () => void; query: string; setQuery: (value: string) => void; placeholder?: string }) {
  return <label className="search-bar"><Icon name="search" /><input value={query} onFocus={onFocus} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} /><button aria-label="Search filters"><Icon name="filter" size={18} /></button></label>;
}

function Home({ go, favorites, toggleFavorite }: { go: (s: Screen) => void; favorites: number[]; toggleFavorite: (id: number) => void }) {
  const [query, setQuery] = useState("");
  const categories = [
    ["key", "Farmhouses"], ["building", "Hotels"], ["home", "Villas"], ["car", "Transport"], ["tent", "Cabins"]
  ];
  return <div className="page home-page">
    <header className="topbar">
      <div className="brand"><span className="brand-mark"><Icon name="compass" size={19} /></span><span>RÊGA</span></div>
      <IconButton icon="bell" label="Notifications" />
    </header>
    <main>
      <section className="hero">
        <img src={images.hero} alt="Mountain road in Kurdistan" />
        <div className="hero-overlay" />
        <div className="hero-copy"><span className="weather-pill">18° · Kurdistan Region</span><h1>Find your way<br />to <em>wonder.</em></h1><p>Curated stays and unforgettable places, close to home.</p></div>
        <div className="hero-search"><SearchBar query={query} setQuery={setQuery} onFocus={() => go("explore")} /></div>
      </section>
      <div className="content">
        <div className="welcome"><div><span className="eyebrow">GOOD MORNING, SHILAN</span><h2>What are you in the mood for?</h2></div></div>
        <div className="category-row">
          {categories.map(([icon, label], index) => <button key={label} className="category" onClick={() => go(index === 3 ? "transport" : "explore")}><span><Icon name={icon} /></span>{label}</button>)}
        </div>
        <SectionTitle title="Stays worth the journey" eyebrow="HANDPICKED FOR YOU" onView={() => go("explore")} />
        <div className="horizontal-cards">
          {properties.slice(0, 2).map((p) => <PropertyCard key={p.id} item={p} favorite={favorites.includes(p.id)} onFavorite={() => toggleFavorite(p.id)} onOpen={() => go("detail")} />)}
        </div>
        <SectionTitle title="Explore Kurdistan" eyebrow="TRENDING NOW" onView={() => go("explore")} />
        <button className="editorial-card" onClick={() => go("map")}><img src={images.rawanduz} alt="Rawanduz canyon" /><div className="editorial-overlay" /><div><span>WEEKEND ESCAPE</span><h3>Rawanduz</h3><p>Cliff roads, deep canyons and a different kind of quiet.</p></div><span className="round-arrow"><Icon name="chevron" /></span></button>
        <p className="photo-credit">Regional photography by Aram Sabah and lens zone via Unsplash</p>
      </div>
    </main>
  </div>;
}

function Explore({ go, favorites, toggleFavorite }: { go: (s: Screen) => void; favorites: number[]; toggleFavorite: (id: number) => void }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Farmhouses", "Hotels", "Villas", "Cabins"];
  const shown = useMemo(() => properties.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.location.toLowerCase().includes(query.toLowerCase())), [query]);
  return <div className="page">
    <header className="simple-header"><div><span className="eyebrow">GO SOMEWHERE NEW</span><h1>Explore</h1></div><IconButton icon="map" label="Open map" onClick={() => go("map")} /></header>
    <main className="content explore-content">
      <SearchBar query={query} setQuery={setQuery} placeholder="Search stays, cities, or landmarks" />
      <div className="chip-row">{filters.map(f => <button key={f} onClick={() => setFilter(f)} className={`chip ${filter === f ? "selected" : ""}`}>{f}</button>)}</div>
      <div className="result-line"><span><strong>{shown.length || 0} curated stays</strong><small> Sample availability</small></span><button><Icon name="filter" size={17} /> Filters</button></div>
      <div className="stacked-cards">{shown.length ? shown.map(p => <PropertyCard key={p.id} item={p} wide favorite={favorites.includes(p.id)} onFavorite={() => toggleFavorite(p.id)} onOpen={() => go("detail")} />) : <Empty title="No places found" copy="Try a nearby city or remove a filter." icon="search" />}</div>
    </main>
  </div>;
}

function MapView({ go }: { go: (s: Screen) => void }) {
  const [selected, setSelected] = useState(1);
  return <div className="page map-page">
    <div className="map-canvas">
      <div className="map-top"><button className="map-search" onClick={() => go("explore")}><Icon name="search" /> Search this area</button><IconButton icon="filter" label="Map filters" /></div>
      <span className="map-label erbil">Erbil</span><span className="map-label duhok">Duhok</span><span className="map-label suli">Sulaymaniyah</span>
      {properties.map((p, i) => <button key={p.id} onClick={() => setSelected(p.id)} className={`marker marker-${i + 1} ${selected === p.id ? "selected" : ""}`}>${p.price}</button>)}
      <button className="place-pin" onClick={() => go("add-place")}><Icon name="plus" size={18} /> Share a place</button>
      <div className="map-property"><PropertyCard item={properties[selected - 1]} favorite={false} onFavorite={() => {}} onOpen={() => go("detail")} wide /></div>
    </div>
  </div>;
}

function Detail({ go, favorite, toggleFavorite }: { go: (s: Screen) => void; favorite: boolean; toggleFavorite: () => void }) {
  return <div className="page detail-page">
    <div className="detail-gallery">
      <img src={images.villa} alt="Halgurd Pool Villa" />
      <div className="detail-actions"><IconButton icon="back" label="Go back" onClick={() => go("explore")} /><div><IconButton icon="share" label="Share property" /><IconButton icon="heart" active={favorite} label="Save property" onClick={toggleFavorite} /></div></div>
      <span className="gallery-count">1 / 12</span>
    </div>
    <main className="detail-content">
      <span className="eyebrow">PRIVATE VILLA · SHAQLAWA</span>
      <div className="title-rating"><h1>Halgurd Pool Villa</h1><span className="rating"><Icon name="star" size={14} filled /> 4.9 <small>(sample)</small></span></div>
      <p className="detail-location"><Icon name="pin" size={17} /> Shaqlawa, Erbil Governorate</p>
      <div className="feature-strip"><span><Icon name="users" /><strong>8 guests</strong><small>Maximum</small></span><span><Icon name="home" /><strong>4 bedrooms</strong><small>6 beds</small></span><span><Icon name="key" /><strong>Entire villa</strong><small>Private stay</small></span></div>
      <div className="host-row"><div className="avatar">AK</div><div><strong>Hosted by Akar</strong><small>Sample host · 3 years</small></div><span className="verified"><Icon name="check" size={14} /> Verified</span></div>
      <section className="detail-section"><h2>A quiet retreat above the city</h2><p>Wake to mountain air, slow breakfasts by the pool, and golden evenings overlooking Shaqlawa. Designed for families and friends to reconnect.</p></section>
      <section className="detail-section"><SectionTitle title="What this place offers" /><div className="amenities"><span>Heated pool</span><span>Mountain view</span><span>Full kitchen</span><span>Private garden</span></div></section>
      <button className="mini-map" onClick={() => go("map")}><div className="mini-map-pin"><Icon name="home" size={17} /></div><div><strong>Beautifully secluded</strong><small>Exact location after booking</small></div><Icon name="chevron" /></button>
    </main>
    <div className="booking-bar"><div><span>From</span><strong>$185 <small>/ night</small></strong></div><Button onClick={() => go("booking")}>Check availability</Button></div>
  </div>;
}

function Booking({ go, confirm }: { go: (s: Screen) => void; confirm: () => void }) {
  const [guests, setGuests] = useState(4);
  const [date, setDate] = useState(18);
  return <div className="page booking-page">
    <header className="back-header"><IconButton icon="back" label="Go back" onClick={() => go("detail")} /><div><span className="eyebrow">YOUR STAY</span><h1>Choose your dates</h1></div></header>
    <main className="content">
      <div className="booking-property"><img src={images.villa} alt="" /><div><strong>Halgurd Pool Villa</strong><small>Shaqlawa, Erbil</small><span className="rating"><Icon name="star" size={12} filled /> 4.9</span></div></div>
      <div className="calendar-head"><button><Icon name="back" size={18} /></button><strong>May 2026</strong><button><Icon name="chevron" size={18} /></button></div>
      <div className="calendar-grid">{["S","M","T","W","T","F","S"].map((d, i) => <span className="day-name" key={`${d}-${i}`}>{d}</span>)}{[...Array(31)].map((_, i) => { const day = i + 1; const selected = day >= date && day <= date + 2; return <button onClick={() => setDate(day)} className={`${selected ? "date-selected" : ""} ${day === date ? "date-start" : ""} ${day === date + 2 ? "date-end" : ""}`} key={day}>{day}</button>; })}</div>
      <div className="booking-row"><div><span className="eyebrow">GUESTS</span><strong>{guests} guests</strong></div><div className="stepper"><button onClick={() => setGuests(Math.max(1, guests - 1))}>−</button><span>{guests}</span><button onClick={() => setGuests(Math.min(8, guests + 1))}>+</button></div></div>
      <div className="price-panel"><div><span>$185 × 3 nights</span><strong>$555</strong></div><div><span>Service fee</span><strong>$42</strong></div><div className="total"><span>Total <small>USD</small></span><strong>$597</strong></div><p>This is a prototype. No payment will be processed.</p></div>
    </main>
    <div className="booking-bar single"><Button onClick={confirm}>Confirm sample booking · $597</Button></div>
  </div>;
}

function Confirmation({ go, kind }: { go: (s: Screen) => void; kind: "stay" | "ride" }) {
  const ride = kind === "ride";
  return <div className="page confirmation"><div className="success-mark"><Icon name="check" size={36} /></div><span className="eyebrow">REQUEST RECEIVED</span><h1>{ride ? <>Your private ride<br />is requested.</> : <>Your mountain escape<br />is planned.</>}</h1><p>This is a sample {ride ? "ride request" : "booking"} only. No charge was made and {ride ? "no driver has been dispatched" : "the property has not been reserved"}.</p><div className="ticket"><img src={ride ? images.rawanduz : images.villa} alt="" /><div><span>{ride ? "MAY 18, 2026 · 10:30 AM" : "MAY 18 — 21, 2026"}</span><h3>{ride ? "Erbil Airport → Shaqlawa" : "Halgurd Pool Villa"}</h3><p>{ride ? "Comfort SUV · 4 travelers" : "4 guests · 3 nights"}</p><hr/><div><span>Sample reference</span><strong>{ride ? "RGA-RIDE-82" : "RGA-2048"}</strong></div></div></div><Button onClick={() => go("home")}>Back to home</Button><Button variant="ghost" onClick={() => go("profile")}>View sample trip</Button></div>;
}

function Transport({ go, confirm }: { go: (s: Screen) => void; confirm: () => void }) {
  const [vehicle, setVehicle] = useState("Comfort");
  return <div className="page">
    <header className="back-header"><IconButton icon="back" label="Go back" onClick={() => go("home")} /><div><span className="eyebrow">PRIVATE TRANSFERS</span><h1>Plan a ride</h1></div></header>
    <main className="content">
      <div className="route-card"><div className="route-line"><span className="route-dot start" /><div><small>PICKUP</small><strong>Erbil International Airport</strong></div></div><div className="route-line"><span className="route-dot end" /><div><small>DESTINATION</small><strong>Shaqlawa, Erbil</strong></div></div></div>
      <div className="trip-meta"><span><Icon name="calendar" /><small>DATE</small><strong>May 18, 2026</strong></span><span><Icon name="users" /><small>PASSENGERS</small><strong>4 travelers</strong></span></div>
      <SectionTitle eyebrow="CHOOSE YOUR RIDE" title="Comfort for every journey" />
      <div className="vehicle-list">{[["Standard","Toyota Camry or similar","$38"],["Comfort","Spacious SUV","$54"],["Premium","Private luxury transfer","$82"]].map(v => <button className={vehicle === v[0] ? "selected" : ""} onClick={() => setVehicle(v[0])} key={v[0]}><span className="vehicle-icon"><Icon name="car" /></span><div><strong>{v[0]}</strong><small>{v[1]}</small></div><b>{v[2]}</b></button>)}</div>
      <div className="notice"><Icon name="check" /><p><strong>Clear sample pricing</strong><br/>Includes estimated waiting time and luggage.</p></div>
      <Button className="full" onClick={confirm}>Request sample ride</Button>
    </main>
  </div>;
}

function AddPlace({ go }: { go: (s: Screen) => void }) {
  const [added, setAdded] = useState(false);
  return <div className="page">
    <header className="back-header"><IconButton icon="back" label="Go back" onClick={() => go("map")} /><div><span className="eyebrow">COMMUNITY</span><h1>Share a hidden gem</h1></div></header>
    <main className="content add-place">
      <button className="upload"><Icon name="camera" size={30} /><strong>Add beautiful photos</strong><span>Up to 8 photos · JPG or PNG</span></button>
      <label><span>PLACE NAME</span><input defaultValue="Gali Sherana viewpoint" /></label>
      <label><span>YOUR STORY</span><textarea defaultValue="A peaceful viewpoint surrounded by mountains, best visited just before sunset." /></label>
      <div className="coordinate-map"><span className="map-label">Akre</span><span className="map-crosshair"><Icon name="pin" /></span><div><strong>Pin placed</strong><small>36.747° N, 43.894° E</small></div></div>
      <div className="chip-row"><button className="chip selected">Viewpoint</button><button className="chip">Nature</button><button className="chip">Picnic</button></div>
      <Button className="full" onClick={() => setAdded(true)}>{added ? <><Icon name="check" /> Saved as draft</> : "Share with the community"}</Button>
      {added && <p className="form-note">Draft saved locally for this prototype.</p>}
    </main>
  </div>;
}

function Empty({ title, copy, icon = "heart" }: { title: string; copy: string; icon?: string }) {
  return <div className="empty"><span><Icon name={icon} size={28} /></span><h3>{title}</h3><p>{copy}</p></div>;
}

function Saved({ go, favorites, toggleFavorite }: { go: (s: Screen) => void; favorites: number[]; toggleFavorite: (id: number) => void }) {
  const saved = properties.filter(p => favorites.includes(p.id));
  return <div className="page"><header className="simple-header"><div><span className="eyebrow">YOUR COLLECTION</span><h1>Saved</h1></div></header><main className="content">{saved.length ? <><p className="saved-intro">Places you love, ready whenever you are.</p><div className="stacked-cards">{saved.map(p => <PropertyCard key={p.id} item={p} wide favorite onFavorite={() => toggleFavorite(p.id)} onOpen={() => go("detail")} />)}</div></> : <Empty title="Your next escape starts here" copy="Tap the heart on any stay or destination to keep it close." />}</main></div>;
}

function Profile({ go, dark, setDark, locale, setLocale }: { go: (s: Screen) => void; dark: boolean; setDark: (v: boolean) => void; locale: string; setLocale: (v: string) => void }) {
  const rows = [["calendar","My trips","1 sample itinerary"],["heart","Saved places","Your travel collection"],["star","Reviews","Share your experience"],["bell","Notifications","Travel updates"]];
  return <div className="page"><header className="simple-header profile-head"><div className="profile-avatar">SH</div><div><span className="eyebrow">TRAVELER PROFILE</span><h1>Shilan Hassan</h1><p>Erbil, Kurdistan Region</p></div><IconButton icon="settings" label="Settings" /></header><main className="content profile-content">
    <button className="host-banner" onClick={() => go("host")}><span><Icon name="key" /></span><div><small>YOUR PROVIDER HUB</small><strong>Manage listings & reservations</strong><p>Offer stays or rides with this same account.</p></div><span className="mode-pill">Switch</span></button>
    <div className="unified-note"><Icon name="check" size={17} /><p><strong>One account, both ways.</strong> Book from others and offer your own services—no separate provider profile needed.</p></div>
    <div className="profile-menu">{rows.map(r => <button key={r[1]}><span><Icon name={r[0]} /></span><div><strong>{r[1]}</strong><small>{r[2]}</small></div><Icon name="chevron" size={18} /></button>)}</div>
    <SectionTitle eyebrow="PREFERENCES" title="Make Rêga yours" />
    <div className="settings-card"><div><span><Icon name="moon" /></span><div><strong>Dark appearance</strong><small>Easy on the eyes</small></div><button className={`switch ${dark ? "on" : ""}`} onClick={() => setDark(!dark)}><i /></button></div><div><span><Icon name="globe" /></span><div><strong>Language</strong><small>RTL-ready prototype</small></div><select value={locale} onChange={e => setLocale(e.target.value)}><option value="EN">English</option><option value="KU">کوردی</option><option value="AR">العربية</option></select></div></div>
    <p className="version">RÊGA PROTOTYPE · VERSION 1.0</p>
  </main></div>;
}

function ProviderHub({ go }: { go: (s: Screen) => void }) {
  const [view, setView] = useState<"listings" | "bookings">("listings");
  const [active, setActive] = useState(true);
  return <div className="page provider-page">
    <header className="provider-header"><div className="brand"><span className="brand-mark"><Icon name="compass" size={19} /></span><span>RÊGA</span></div><button onClick={() => go("home")}><Icon name="compass" size={17} /> Switch to exploring</button></header>
    <main>
      <section className="provider-hero"><span className="eyebrow">GOOD MORNING, SHILAN</span><h1>Your provider hub</h1><p>Offer services and book trips from one trusted profile.</p><div className="provider-stats"><span><strong>2</strong><small>Listings</small></span><span><strong>4</strong><small>Requests</small></span><span><strong>$1.2k</strong><small>Sample earnings</small></span></div></section>
      <div className="content provider-content">
        <div className="market-switch"><button className={view === "listings" ? "active" : ""} onClick={() => setView("listings")}>What I offer</button><button className={view === "bookings" ? "active" : ""} onClick={() => setView("bookings")}>What I booked</button></div>
        {view === "listings" ? <>
          <div className="provider-title"><div><span className="eyebrow">YOUR BUSINESS</span><h2>Published listings</h2></div><button onClick={() => go("create-listing")}><Icon name="plus" size={17} /> Add new</button></div>
          <article className="manage-card"><img src={images.villa} alt="Halgurd Pool Villa" /><div className="manage-copy"><span className={`status ${active ? "live" : ""}`}>{active ? "Live" : "Paused"}</span><h3>Halgurd Pool Villa</h3><p>Villa · Shaqlawa</p><div><span><strong>12</strong> views</span><span><strong>3</strong> requests</span></div></div><button className={`switch ${active ? "on" : ""}`} onClick={() => setActive(!active)} aria-label="Toggle listing"><i /></button></article>
          <article className="manage-card"><span className="service-thumb"><Icon name="car" size={30} /></span><div className="manage-copy"><span className="status live">Live</span><h3>Erbil Private Transfers</h3><p>Driver service · Erbil</p><div><span><strong>8</strong> views</span><span><strong>1</strong> request</span></div></div><button className="switch on" aria-label="Toggle listing"><i /></button></article>
          <div className="provider-actions"><button onClick={() => go("create-listing")}><span><Icon name="plus" /></span><strong>Publish a service</strong><small>Property, hotel, or transport</small></button><button onClick={() => go("add-place")}><span><Icon name="pin" /></span><strong>Share a destination</strong><small>Add photos and GPS location</small></button></div>
        </> : <>
          <div className="provider-title"><div><span className="eyebrow">YOUR TRAVEL</span><h2>Bookings as a customer</h2></div></div>
          <div className="dual-booking"><img src={images.pool} alt="Korek Mountain Cabin" /><div><span>UPCOMING · SAMPLE</span><h3>Korek Mountain Cabin</h3><p>May 25–27 · 2 guests</p><Button variant="ghost" onClick={() => go("detail")}>View stay</Button></div></div>
          <div className="unified-note"><Icon name="globe" size={18} /><p>Your customer bookings remain here while you manage services. Switching views never changes your account.</p></div>
        </>}
      </div>
    </main>
  </div>;
}

function CreateListing({ go }: { go: (s: Screen) => void }) {
  const [step, setStep] = useState(1);
  const [kind, setKind] = useState("Villa");
  const isRide = kind === "Transportation";
  const types = [["home","Farmhouse / Villa"],["building","Hotel / Accommodation"],["car","Transportation"],["tent","Vacation home"]];
  return <div className="page host-page"><header className="back-header"><IconButton icon="back" label="Go back" onClick={() => step > 1 ? setStep(step - 1) : go("host")} /><div><span className="eyebrow">PUBLISH WITH YOUR ACCOUNT</span><h1>New listing</h1></div><span className="step-count">{step}/4</span></header><main className="content">
    <div className="progress"><i style={{ width: `${step * 25}%` }} /></div>
    {step === 1 && <><div className="host-illustration"><Icon name="plus" size={36} /></div><span className="eyebrow">CHOOSE A CATEGORY</span><h2 className="host-title">What would you<br/>like to offer?</h2><div className="listing-types">{types.map(([icon,label])=><button key={label} className={kind === label || (kind === "Villa" && label === "Farmhouse / Villa") ? "selected" : ""} onClick={() => setKind(label)}><Icon name={icon} /><strong>{label}</strong>{kind === label || (kind === "Villa" && label === "Farmhouse / Villa") ? <Icon name="check" /> : <Icon name="chevron" />}</button>)}</div></>}
    {step === 2 && <><span className="eyebrow">THE BASICS</span><h2 className="host-title">{isRide ? "Describe your transport service" : "Tell travelers about your place"}</h2><div className="listing-form"><label><span>LISTING TITLE</span><input defaultValue={isRide ? "Erbil private transfers" : "Halgurd family villa"} /></label><label><span>LOCATION</span><input defaultValue="Erbil, Kurdistan Region" /></label><label><span>DESCRIPTION</span><textarea defaultValue={isRide ? "Comfortable private rides for airport transfers and day trips." : "A peaceful private stay with mountain views and space for the whole family."} /></label></div></>}
    {step === 3 && <><span className="eyebrow">AVAILABILITY & PRICE</span><h2 className="host-title">Set clear expectations</h2><div className="counter-list"><div><strong>{isRide ? "Passengers" : "Guests"}</strong><div className="stepper"><button>−</button><span>{isRide ? 4 : 8}</span><button>+</button></div></div>{!isRide && <div><strong>Bedrooms</strong><div className="stepper"><button>−</button><span>4</span><button>+</button></div></div>}</div><div className="listing-form"><label><span>STARTING PRICE · USD</span><input defaultValue={isRide ? "$38 / trip" : "$185 / night"} /></label></div><div className="coordinate-map listing-map"><span className="map-label">Erbil</span><span className="map-crosshair"><Icon name="pin" /></span><div><strong>Service location added</strong><small>Accurate location is shown after confirmation</small></div></div></>}
    {step === 4 && <><div className="host-illustration"><Icon name="check" size={38} /></div><span className="eyebrow">READY TO REVIEW</span><h2 className="host-title">Your {isRide ? "service" : "place"} is ready.</h2><p className="host-copy">Review photos, location, availability, and policies before publishing. This prototype saves a sample listing only; nothing is publicly posted.</p><div className="review-summary"><span><Icon name={isRide ? "car" : "home"} /></span><div><strong>{isRide ? "Erbil private transfers" : "Halgurd family villa"}</strong><small>{kind} · Erbil</small></div><b>{isRide ? "$38 / trip" : "$185 / night"}</b></div></>}
    <Button className="full" onClick={() => step < 4 ? setStep(step + 1) : go("host")}>{step < 4 ? "Continue" : "Save sample listing"}</Button>
  </main></div>;
}

function BottomNav({ active, go }: { active: Tab; go: (s: Screen) => void }) {
  const items: [Tab, string, string][] = [["home","home","Home"],["explore","compass","Explore"],["map","map","Map"],["saved","heart","Saved"],["profile","user","Profile"]];
  return <nav className="bottom-nav">{items.map(([tab, icon, label]) => <button key={tab} className={active === tab ? "active" : ""} onClick={() => go(tab)}><span><Icon name={icon} filled={active === tab && tab === "home"} /></span><small>{label}</small></button>)}</nav>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [tab, setTab] = useState<Tab>("home");
  const [favorites, setFavorites] = useState<number[]>([2]);
  const [dark, setDark] = useState(false);
  const [locale, setLocale] = useState("EN");
  const [confirmationKind, setConfirmationKind] = useState<"stay" | "ride">("stay");
  const go = (next: Screen) => {
    setScreen(next);
    if (["home","explore","map","saved","profile"].includes(next)) setTab(next as Tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const toggleFavorite = (id: number) => setFavorites(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
  const rootClass = `${dark ? "dark" : ""} ${locale !== "EN" ? "rtl" : ""}`;
  const hasNav = ["home","explore","map","saved","profile"].includes(screen);
  return <div className={rootClass}>
    <div className="app-shell">
      {screen === "home" && <Home go={go} favorites={favorites} toggleFavorite={toggleFavorite} />}
      {screen === "explore" && <Explore go={go} favorites={favorites} toggleFavorite={toggleFavorite} />}
      {screen === "map" && <MapView go={go} />}
      {screen === "saved" && <Saved go={go} favorites={favorites} toggleFavorite={toggleFavorite} />}
      {screen === "profile" && <Profile go={go} dark={dark} setDark={setDark} locale={locale} setLocale={setLocale} />}
      {screen === "detail" && <Detail go={go} favorite={favorites.includes(1)} toggleFavorite={() => toggleFavorite(1)} />}
      {screen === "booking" && <Booking go={go} confirm={() => { setConfirmationKind("stay"); go("confirmation"); }} />}
      {screen === "confirmation" && <Confirmation go={go} kind={confirmationKind} />}
      {screen === "transport" && <Transport go={go} confirm={() => { setConfirmationKind("ride"); go("confirmation"); }} />}
      {screen === "add-place" && <AddPlace go={go} />}
      {screen === "host" && <ProviderHub go={go} />}
      {screen === "create-listing" && <CreateListing go={go} />}
      {hasNav && <BottomNav active={tab} go={go} />}
    </div>
  </div>;
}
