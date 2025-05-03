import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const Scanner = ({ onScan }) => {
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: { width: 250, height: 250 }, // Increased scanner box size
      fps: 10,
    });

    scanner.render(
      (result) => {
        scanner.clear().then(() => {
          console.log("✅ Scan result:", result);
          setScanResult(result);
          if (onScan) onScan(result); // Notify parent
        });
      },
      (error) => {
        console.warn("⛔ Scan error:", error);
      }
    );

    return () => {
      scanner
        .clear()
        .catch((e) => console.error("Failed to clear scanner on unmount", e));
    };
  }, [onScan]);

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
    >
      {scanResult ? (
        <div>Result: {scanResult}</div>
      ) : (
        <div id="reader" style={{ width: "100%", maxWidth: "500px" }}></div>
      )}
    </div>
  );
};

export default Scanner;
