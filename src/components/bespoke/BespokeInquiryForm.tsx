"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { fadeInUp } from "@/lib/constants";

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "48px",
  backgroundColor: "rgba(255, 255, 255, 0.02)",
  border: "1px solid rgba(255, 255, 255, 0.14)",
  borderRadius: "0px",
  padding: "0 16px",
  color: "#ffffff",
  fontFamily: "'Poppins', sans-serif",
  fontSize: "13px",
  outline: "none",
  transition: "border-color 0.3s ease, background-color 0.3s ease",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  color: "#c6a45f",
  display: "block",
  marginBottom: "6px",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function focusHandlers() {
  return {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      e.target.style.borderColor = "#c6a45f";
      e.target.style.backgroundColor = "rgba(198, 164, 95, 0.04)";
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      e.target.style.borderColor = "rgba(255, 255, 255, 0.14)";
      e.target.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
    },
  };
}

export default function BespokeInquiryForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    timeFrame: "",
    additionalInfo: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! Your design submission has been received. Our team will contact you shortly.");
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      timeFrame: "",
      additionalInfo: "",
    });
    setImageFile(null);
    setDocumentFile(null);
  };

  const handlers = focusHandlers();

  return (
    <section
      style={{
        padding: "72px 0 80px",
        background: "#000000",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ maxWidth: "840px", margin: "0 auto", padding: "0 24px" }}>
        {/* Form Title */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          style={{ textAlign: "center", marginBottom: "44px" }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
              fontWeight: "500",
              color: "#ffffff",
              letterSpacing: "1px",
              marginBottom: "12px",
              textTransform: "uppercase",
            }}
          >
            SEND US YOUR DESIGN
          </h2>
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "13px",
              color: "#888888",
              lineHeight: 1.7,
              maxWidth: "540px",
              margin: "0 auto",
            }}
          >
            Share your ideas, sketches, or inspiration images with our master jewellers for a custom bespoke quote.
          </p>
        </motion.div>

        {/* Form Body */}
        <motion.form
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
          }}
        >
          {/* First Name */}
          <Field label="First Name">
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              placeholder="Enter first name"
              style={inputStyle}
              {...handlers}
            />
          </Field>

          {/* Last Name */}
          <Field label="Last Name">
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              placeholder="Enter last name"
              style={inputStyle}
              {...handlers}
            />
          </Field>

          {/* Email* */}
          <Field label="Email *">
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="Enter your email"
              style={inputStyle}
              {...handlers}
            />
          </Field>

          {/* Phone* */}
          <Field label="Phone *">
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="Enter phone number"
              style={inputStyle}
              {...handlers}
            />
          </Field>

          {/* Time Frame */}
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Time Frame">
              <input
                type="text"
                value={form.timeFrame}
                onChange={(e) => update("timeFrame", e.target.value)}
                placeholder="e.g. As soon as possible, 2-3 weeks, 1 month"
                style={inputStyle}
                {...handlers}
              />
            </Field>
          </div>

          {/* Any other informations you would like to provide */}
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Any other informations you would like to provide">
              <textarea
                value={form.additionalInfo}
                onChange={(e) => update("additionalInfo", e.target.value)}
                placeholder="Details about diamond preference, ring size, metal choice, or design ideas..."
                rows={4}
                style={{
                  ...inputStyle,
                  height: "auto",
                  padding: "14px 16px",
                  resize: "vertical",
                  minHeight: "120px",
                }}
                {...handlers}
              />
            </Field>
          </div>

          {/* File Upload 1: Choose an Image */}
          <div>
            <Field label="Upload Image">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  padding: "6px 8px 6px 14px",
                  borderRadius: "0px",
                  height: "48px",
                }}
              >
                <span
                  style={{
                    fontSize: "12.5px",
                    color: imageFile ? "#ffffff" : "#777777",
                    fontFamily: "'Poppins', sans-serif",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                  }}
                >
                  {imageFile ? imageFile.name : "No file chosen"}
                </span>
                <label
                  style={{
                    cursor: "pointer",
                    backgroundColor: "#c6a45f",
                    color: "#000000",
                    fontSize: "11px",
                    fontWeight: "600",
                    fontFamily: "'Poppins', sans-serif",
                    letterSpacing: "1px",
                    padding: "10px 16px",
                    borderRadius: "0px",
                    whiteSpace: "nowrap",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  Choose an Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </Field>
          </div>

          {/* File Upload 2: Choose a File */}
          <div>
            <Field label="Upload File">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  padding: "6px 8px 6px 14px",
                  borderRadius: "0px",
                  height: "48px",
                }}
              >
                <span
                  style={{
                    fontSize: "12.5px",
                    color: documentFile ? "#ffffff" : "#777777",
                    fontFamily: "'Poppins', sans-serif",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                  }}
                >
                  {documentFile ? documentFile.name : "No file chosen"}
                </span>
                <label
                  style={{
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    border: "1px solid #c6a45f",
                    color: "#c6a45f",
                    fontSize: "11px",
                    fontWeight: "600",
                    fontFamily: "'Poppins', sans-serif",
                    letterSpacing: "1px",
                    padding: "9px 16px",
                    borderRadius: "0px",
                    whiteSpace: "nowrap",
                    transition: "all 0.3s ease",
                  }}
                >
                  Choose a File
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.cad,.stl,.3ds,.zip"
                    onChange={handleDocumentChange}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </Field>
          </div>

          {/* Submit Button */}
          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              justifyContent: "center",
              marginTop: "16px",
            }}
          >
            <button
              type="submit"
              className="btn-gold"
              style={{
                borderRadius: "0px",
                padding: "16px 48px",
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "2px",
                cursor: "pointer",
                border: "none",
                textTransform: "uppercase",
              }}
            >
              Submit Design
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

