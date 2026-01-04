import React from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";

/* ================= TYPES ================= */

interface QRCodeViewProps {
    value: string;
    size?: number;
    type?: "svg" | "canvas";
}

/* ================= COMPONENT ================= */
// ... (rest unchanged)

const QRCodeView: React.FC<QRCodeViewProps> = ({
    value,
    size = 300,
    type = "svg",
}) => {
    if (!value) return <p className="text-gray-500">No QR data</p>; // Added placeholder

    const commonProps = { value, size, level: "M" as const }; // Consistent medium level

    if (type === "canvas") {
        return (
            <>
               
                <QRCodeCanvas
                    {...commonProps}
                    style={{
                        imageRendering: "pixelated",
                        display: "block",
                        margin: "0 auto", // Centered
                    }}
                />
            </>
        );
    }

    return (
        <QRCodeSVG
            {...commonProps}
            style={{ display: "block", margin: "0 auto" }}
        />
    );
};

export default QRCodeView;
