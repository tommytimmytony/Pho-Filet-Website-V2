import { useState, useRef, useEffect } from "react";

export default function Header() {
  const [hoursOpen, setHoursOpen] = useState(false);
  const disclosureRef = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (disclosureRef.current && !disclosureRef.current.contains(e.target)) {
        setHoursOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setHoursOpen(false);
    }
    document.addEventListener("click", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("click", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="header-content">
        <div className="header-top">
          <a className="brand" href="#" aria-label="Pho Filet home">
            <img src="/logo.jpg" alt="" width="64" height="64" />
            <span>
              <span className="brand-name">Pho Filet</span>
              <span className="brand-location">San Antonio, Texas</span>
            </span>
          </a>
          <div className="hours-disclosure" ref={disclosureRef}>
            <button
              type="button"
              className="hours-toggle"
              aria-expanded={hoursOpen}
              aria-controls="restaurant-details"
              onClick={() => setHoursOpen((prev) => !prev)}
            >
              Hours <span aria-hidden="true">&#9662;</span>
            </button>
            {hoursOpen && (
              <div id="restaurant-details" className="restaurant-details">
                <h2>Opening hours</h2>
                <dl className="weekly-hours">
                  {[
                    ["Monday", "Closed"],
                    ["Tuesday", "11:00 am – 9:00 pm"],
                    ["Wednesday", "11:00 am – 9:00 pm"],
                    ["Thursday", "11:00 am – 9:00 pm"],
                    ["Friday", "11:00 am – 9:00 pm"],
                    ["Saturday", "11:00 am – 9:00 pm"],
                    ["Sunday", "11:00 am – 8:30 pm"],
                  ].map(([day, hours]) => (
                    <div key={day}>
                      <dt>{day}</dt>
                      <dd>{hours}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
        <div className="header-bottom">
          <p className="restaurant-address">
            9910 TX-1604 Loop, San Antonio, TX 78254
          </p>
          <div className="contact-actions">
            <a className="contact-action" href="tel:210-520-5630">
              Call restaurant
              <span className="action-detail">(210) 520-5630</span>
            </a>
            <a
              className="contact-action secondary"
              target="_blank"
              rel="noopener noreferrer"
              href="https://goo.gl/maps/3ZLpLwrPDEQkyua37"
            >
              Get directions
              <span className="action-detail">Opens Google Maps</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
