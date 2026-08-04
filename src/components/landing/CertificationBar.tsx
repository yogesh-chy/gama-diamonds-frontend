"use client";

export default function CertificationBar() {
  const partners = [
    { title: "NAJ", subtitle: "National Association of Jewellers" },
    { title: "Goldsmiths", subtitle: "Hallmark of The Goldsmiths' Company" },
    { title: "GIA", subtitle: "Gemological Institute of America" },
    { title: "IGI", subtitle: "International Gemological Institute" },
    { title: "Stop Blood Diamonds", subtitle: "Conflict-Free Sourcing" },
  ];

  return (
    <section
      style={{
        padding: "48px 0 60px",
        background: "#050505",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "24px 40px",
          }}
        >
          {partners.map((partner, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "10px 20px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#080808",
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#ffffff",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "2px",
                }}
              >
                ✦ {partner.title}
              </span>
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "8.5px",
                  color: "#c6a45f",
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                }}
              >
                {partner.subtitle}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
