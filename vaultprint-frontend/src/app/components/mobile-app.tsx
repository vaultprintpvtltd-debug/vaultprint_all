import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CreditCard, CheckCircle } from "lucide-react";
import logoImage from "../../assets/logo.png";

export function MobileApp() {
  const [step, setStep] = useState<"upload" | "payment" | "otp">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const sid = params.get("sessionId");

  if (!sid) {
    alert("Invalid QR: session missing");
    return;
  }

  setSessionId(sid);
  console.log("📱 Mobile using session:", sid);
}, []);




  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const proceedToPayment = async () => {
  if (!selectedFile) {
  alert("No file selected");
  return;
}

if (!sessionId) {
  alert("Session not created yet");
  return;
}


  setIsProcessing(true);

  const formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("sessionId", sessionId);

  try {
    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    setStep("payment");
  } catch {
    alert("Upload failed");
  } finally {
    setIsProcessing(false);
  }
};


  const processPayment = async () => {
  if (!sessionId) return;

  setIsProcessing(true);

  try {
    const res = await fetch("http://localhost:5000/api/otp/generate-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });

    const data = await res.json();
    setOtp(data.otp);
    setStep("otp");
  } catch {
    alert("OTP generation failed");
  } finally {
    setIsProcessing(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] via-[#2c5282] to-[#1e3a5f]">
      <div className="px-6 py-4 flex items-center gap-3">
        <img src={logoImage} className="h-14" />
        <div>
          <h1 className="text-xl font-bold text-white">VaultPrint</h1>
          <p className="text-white/70 text-xs">Mobile Printing</p>
        </div>
      </div>

      <div className="px-6 py-8">
        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <Upload className="w-14 h-14 mx-auto text-[#1e3a5f]" />
                <h2 className="text-center text-xl font-bold mt-4">Upload File</h2>

                {!selectedFile ? (
                  <label className="block mt-6 cursor-pointer">
                    <div className="border-4 border-dashed rounded-xl p-6 text-center">
                      <FileText className="w-10 h-10 mx-auto" />
                      <p className="mt-2 font-semibold">Tap to select</p>
                    </div>
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                  </label>
                ) : (
                  <div className="mt-4 bg-green-50 p-3 rounded-xl flex items-center gap-2">
                    <CheckCircle className="text-green-600" />
                    <span>{selectedFile.name}</span>
                  </div>
                )}

                <button
                  onClick={proceedToPayment}
                  disabled={!selectedFile || isProcessing}
                  className="w-full mt-6 bg-[#1e3a5f] text-white py-3 rounded-full"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
                <CreditCard className="w-14 h-14 mx-auto text-[#1e3a5f]" />
                <h2 className="text-xl font-bold mt-4">Payment</h2>
                <button
                  onClick={processPayment}
                  className="w-full mt-6 bg-[#1e3a5f] text-white py-3 rounded-full"
                >
                  Pay ₹10
                </button>
              </div>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
                <CheckCircle className="w-20 h-20 mx-auto text-green-500" />
                <p className="text-5xl font-bold mt-4">{otp}</p>
                <p className="text-sm mt-2">Enter this OTP on kiosk</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
