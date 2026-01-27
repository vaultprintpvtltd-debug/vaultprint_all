//so first otp suthentication is a mess and also the session and image upload is also not working majorly due to mongoDB connection error which results in not sessionid store and thus 500 error.So first fix otp authentication and session and image upload and then we will work on the print and payment part.
import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { motion } from 'motion/react';
import {
  Upload,
  Smartphone,
  CreditCard,
  KeyRound,
  Printer,
  CheckCircle,
} from 'lucide-react';
import logoImage from '../../assets/logo.png';

export function KioskDisplay() {
  const [showOtpEntry, setShowOtpEntry] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);

  const kioskUrl = 'https://www.vaultprintpvtltd.online/';

  useEffect(() => {
    const timer = setTimeout(() => {
      // Demo placeholder
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }

      if (newOtp.every((digit) => digit !== '') && !isVerified) {
        setTimeout(() => setIsVerified(true), 500);
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] via-[#2c5282] to-[#1e3a5f] flex flex-col">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center gap-4">
            <img src={logoImage} alt="VaultPrint" className="h-24 w-auto" />
            <div>
              <h1 className="text-3xl font-bold text-white">VaultPrint</h1>
              <p className="text-white/80 text-sm">
                Self-Service Printing Kiosk
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {!showOtpEntry ? (
            <div className="bg-white rounded-3xl shadow-2xl p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[#1e3a5f] mb-4">
                  Welcome to VaultPrint
                </h2>
                <p className="text-xl text-gray-600">
                  Get your documents printed in 3 easy steps
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* QR */}
                <div className="text-center">
                  <div className="bg-white p-8 rounded-2xl shadow-lg inline-block border-4 border-[#1e3a5f]">
                    <QRCode value={kioskUrl} size={280} />
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-2 text-[#1e3a5f]">
                    <Smartphone className="w-6 h-6" />
                    <p className="text-lg font-semibold">
                      Scan with your phone
                    </p>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-6">
                  <StepCard
                    icon={<Smartphone className="w-8 h-8" />}
                    number="1"
                    title="Scan the QR Code"
                    description="Use your phone's camera to scan the QR code"
                  />
                  <StepCard
                    icon={<Upload className="w-8 h-8" />}
                    number="2"
                    title="Upload Your File"
                    description="Select and upload the document from your phone"
                  />
                  <StepCard
                    icon={<CreditCard className="w-8 h-8" />}
                    number="3"
                    title="Make Payment"
                    description="Complete the secure payment"
                  />
                  <StepCard
                    icon={<KeyRound className="w-8 h-8" />}
                    number="4"
                    title="Enter OTP"
                    description="Enter the OTP shown on your phone"
                  />
                  <StepCard
                    icon={<Printer className="w-8 h-8" />}
                    number="5"
                    title="Collect Print"
                    description="Your document prints instantly"
                  />
                </div>
              </div>

              <div className="mt-12 text-center">
                <button
                  onClick={() => setShowOtpEntry(true)}
                  className="bg-[#1e3a5f] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#2c5282] transition-all shadow-lg"
                >
                  Ready to Enter OTP →
                </button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-2xl p-12"
            >
              {!isVerified ? (
                <>
                  <div className="text-center mb-12">
                    <KeyRound className="w-20 h-20 text-[#1e3a5f] mx-auto mb-6" />
                    <h2 className="text-4xl font-bold text-[#1e3a5f] mb-4">
                      Enter Your OTP
                    </h2>
                    <p className="text-xl text-gray-600">
                      Check your phone for the 6-digit code
                    </p>
                  </div>

                  <div className="flex justify-center gap-4 mb-12">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOtpChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-16 h-20 text-center text-3xl font-bold border-4 border-[#1e3a5f] rounded-xl"
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-32 h-32 text-green-500 mx-auto mb-8" />
                  <h2 className="text-5xl font-bold text-green-600 mb-6">
                    Verified!
                  </h2>
                  <p className="text-2xl text-gray-700 mb-8">
                    Your document is printing now...
                  </p>
                  <Printer className="w-24 h-24 text-[#1e3a5f] mx-auto animate-pulse" />
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function StepCard({
  icon,
  number,
  title,
  description,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border-2 border-blue-100">
      <div className="w-12 h-12 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white font-bold">
        {number}
      </div>

      <div>
        <div className="flex items-center gap-2 text-[#1e3a5f] mb-1">
          {icon}
          <h3 className="font-bold">{title}</h3>
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}
