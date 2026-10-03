"use client";

import { useState, useEffect, useRef } from "react";
import { QrCode, Search, CheckCircle, AlertCircle, XCircle, Camera, CameraOff, Upload } from "lucide-react";
import jsQR from "jsqr";
import * as pdfjsLib from "pdfjs-dist";

// Need to set workerSrc for pdf.js to work in browser
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

type ValidationResult = { status: 'success' | 'checked_in_success' | 'error' | 'already_checked_in', message?: string, data?: any };

export default function AdminCheckInPage() {
  const [ticketId, setTicketId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<any>(null);

  const [multipleResults, setMultipleResults] = useState<ValidationResult[]>([]);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  
  const [recentCheckins, setRecentCheckins] = useState<any[]>([]);

  const fetchRecentCheckins = async () => {
    try {
      const res = await fetch("/api/admin/recent-checkins");
      const data = await res.json();
      if (data.success) {
        setRecentCheckins(data.checkins);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchRecentCheckins();
  }, []);

  // Core Validate Logic (can return data instead of setting state)
  const validateToken = async (code: string): Promise<ValidationResult> => {
    try {
      const res = await fetch("/api/admin/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), action: "validate" }),
      });
      const data = await res.json();
      
      if (data.success) {
        return { status: 'success', data };
      } else {
        if (data.error === "ALREADY CHECKED IN") {
           return { status: 'already_checked_in', data };
        } else {
           return { status: 'error', message: data.error };
        }
      }
    } catch (err) {
      return { status: 'error', message: "Failed to connect to server" };
    }
  };

  const performValidate = async (code: string) => {
    setIsLoading(true);
    setResult(null);
    setMultipleResults([]);
    
    const valResult = await validateToken(code);
    setResult(valResult);
    
    setIsLoading(false);
    setTicketId(""); 
  };

  const performCheckIn = async (code: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), action: "checkin" }),
      });
      const data = await res.json();
      
      if (data.success) {
        setResult({ status: 'checked_in_success', data });
      } else {
        if (data.error === "ALREADY CHECKED IN") {
           setResult({ status: 'already_checked_in', data });
        } else {
           setResult({ status: 'error', message: data.error });
        }
      }
    } catch (err) {
      setResult({ status: 'error', message: "Failed to connect to server" });
    } finally {
      setIsLoading(false);
      setMultipleResults([]); // Clear multiple list if they selected one
      fetchRecentCheckins(); // Update history immediately
    }
  };

  const handleValidateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId) return;
    await performValidate(ticketId);
  };

  useEffect(() => {
    if (isScanning && !scannerRef.current) {
       import("html5-qrcode").then((module) => {
         const Html5Qrcode = module.Html5Qrcode;
         const scanner = new Html5Qrcode("qr-reader");
         scannerRef.current = scanner;

         scanner.start(
           { facingMode: "environment" },
           { fps: 10, qrbox: { width: 250, height: 250 } },
           (decodedText: string) => {
             // Stop scanning on success
             if (scannerRef.current) {
                 try {
                   if (scannerRef.current.getState() === 2) {
                     scannerRef.current.stop().then(() => {
                         if (scannerRef.current) scannerRef.current.clear();
                         scannerRef.current = null;
                         setIsScanning(false);
                         performValidate(decodedText);
                     }).catch((e: any) => console.error(e));
                   } else {
                     scannerRef.current.clear();
                     scannerRef.current = null;
                     setIsScanning(false);
                     performValidate(decodedText);
                   }
                 } catch (e) {
                   scannerRef.current = null;
                   setIsScanning(false);
                   performValidate(decodedText);
                 }
             }
           },
           (err: any) => {
             // Ignore frame errors
           }
         ).catch((err: any) => {
           console.error("Camera start error", err);
           setResult({ status: 'error', message: "Camera permission denied or not available." });
           setIsScanning(false);
           scannerRef.current = null;
         });
       });
    }

    return () => {
      if (scannerRef.current) {
         try {
           if (scannerRef.current.getState() === 2) {
             scannerRef.current.stop().then(() => {
                 if (scannerRef.current) scannerRef.current.clear();
                 scannerRef.current = null;
             }).catch((e: any) => console.error(e));
           } else {
             scannerRef.current.clear();
             scannerRef.current = null;
           }
         } catch (e) {
           scannerRef.current = null;
         }
      }
    };
  }, [isScanning]);

  const stopCamera = () => {
    setIsScanning(false);
    if (scannerRef.current) {
       try {
         if (scannerRef.current.getState() === 2) {
           scannerRef.current.stop().then(() => {
               if (scannerRef.current) scannerRef.current.clear();
               scannerRef.current = null;
           }).catch((e: any) => console.error(e));
         } else {
           scannerRef.current.clear();
           scannerRef.current = null;
         }
       } catch (e) {
         scannerRef.current = null;
       }
    }
  };

  // UPLOAD FALLBACK LOGIC
  const processImageFile = async (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve([]);
          
          // Downscale huge images to avoid jsQR memory issues / timeouts
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            const ratio = Math.min(maxDim / width, maxDim / height);
            width = width * ratio;
            height = height * ratio;
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          const imageData = ctx.getImageData(0, 0, width, height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            resolve([code.data]);
          } else {
            resolve([]);
          }
        };
        img.onerror = () => resolve([]);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve([]);
      reader.readAsDataURL(file);
    });
  };

  const processPdfFile = async (file: File): Promise<string[]> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const foundQrs = new Set<string>();
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        // Render at 2.0 scale to ensure QR is large enough for jsQR
        const viewport = page.getViewport({ scale: 2.0 }); 
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport } as any).promise;
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          foundQrs.add(code.data);
        }
      }
      return Array.from(foundQrs);
    } catch (err) {
      console.error("PDF Processing Error:", err);
      return [];
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingUpload(true);
    setResult(null);
    setMultipleResults([]);
    
    // Stop camera if running
    stopCamera();

    try {
      let qrs: string[] = [];
      if (file.type === "application/pdf") {
        qrs = await processPdfFile(file);
      } else if (file.type.startsWith("image/")) {
        qrs = await processImageFile(file);
      } else {
        setResult({ status: 'error', message: "Unsupported file type. Please upload an image or PDF." });
        return;
      }

      if (qrs.length === 0) {
        setResult({ status: 'error', message: "QR CODE NOT DETECTED. Please upload a clearer image of the QR code or use the camera scanner." });
      } else if (qrs.length === 1) {
        // Exactly one QR found -> validate immediately
        await performValidate(qrs[0]);
      } else {
        // Multiple QRs found (e.g. multi-page PDF)
        // Validate all of them to show ticket info
        const results = await Promise.all(qrs.map(qr => validateToken(qr)));
        setMultipleResults(results);
      }
    } catch (err) {
      setResult({ status: 'error', message: "Error processing the uploaded file." });
    } finally {
      setIsProcessingUpload(false);
      if (e.target) e.target.value = ''; // Reset input
    }
  };

  // UI Components
  const renderValidationResult = (res: ValidationResult) => {
    return (
      <div className={`p-8 rounded-xl border shadow-xl ${
        res.status === 'success' ? 'bg-blue-900/20 border-blue-500/50' :
        res.status === 'checked_in_success' ? 'bg-green-900/20 border-green-500/50' :
        res.status === 'already_checked_in' ? 'bg-red-900/20 border-red-500/50' :
        'bg-red-900/20 border-red-500/50'
      }`}>
        
        {/* HEADER STATUS */}
        <div className="text-center border-b border-white/10 pb-6 mb-6">
          <div className="flex justify-center mb-4">
            {res.status === 'success' && <CheckCircle className="text-blue-500 w-16 h-16" />}
            {res.status === 'checked_in_success' && <CheckCircle className="text-green-500 w-16 h-16" />}
            {res.status === 'already_checked_in' && <XCircle className="text-red-500 w-16 h-16" />}
            {res.status === 'error' && <XCircle className="text-red-500 w-16 h-16" />}
          </div>
          <h3 className={`text-3xl font-bold uppercase mb-2 ${
            res.status === 'success' ? 'text-blue-400' :
            res.status === 'checked_in_success' ? 'text-green-400' :
            res.status === 'already_checked_in' ? 'text-red-500' :
            'text-red-500'
          }`}>
            {res.status === 'success' ? '✓ VALID TICKET' :
             res.status === 'checked_in_success' ? '✓ CHECK-IN SUCCESSFUL' :
             res.status === 'already_checked_in' ? '❌ ALREADY USED' :
             '❌ INVALID TICKET'}
          </h3>
          
          {res.status !== 'checked_in_success' && (
             <p className={`text-xl font-bold uppercase ${
               res.status === 'success' ? 'text-blue-300' : 'text-red-400'
             }`}>
               {res.status === 'success' ? 'ENTRY ALLOWED' : 'ENTRY DENIED'}
             </p>
          )}
        </div>

        {/* INVALID ERROR MESSAGE */}
        {res.status === 'error' && (
          <div className="text-center text-gray-300 text-lg">
            <p>{res.message === "INVALID PASS (Not Found)" ? "This QR code is not associated with a valid RANG RAAS ticket." : res.message}</p>
          </div>
        )}

        {/* SUCCESS / VALIDATE */}
        {res.status === 'success' && res.data?.ticket && res.data?.booking && (
          <div className="space-y-4 text-center">
            <div className="text-lg">
              <p><span className="text-gray-400">Customer:</span> <span className="text-white font-medium">{res.data.booking.customer}</span></p>
              <p><span className="text-gray-400">Booking:</span> <span className="text-white font-mono">{res.data.booking.bookingId}</span></p>
              <p><span className="text-gray-400">Pass:</span> <span className="text-white capitalize">{res.data.booking.passType}</span></p>
            </div>
            
            <div className="py-4 border-y border-white/10 text-lg">
              <p><span className="text-gray-400">Tickets Purchased:</span> <span className="text-white font-medium">{res.data.ticket.totalTickets}</span></p>
              <p><span className="text-gray-400">Scanned Ticket:</span> <span className="text-white font-bold">{res.data.ticket.ticketNumber} OF {res.data.ticket.totalTickets}</span></p>
              <p><span className="text-gray-400">Ticket ID:</span> <span className="text-gold font-mono font-bold">{res.data.ticket.ticketId}</span></p>
            </div>

            <div className="pt-2 text-green-400 font-bold text-xl uppercase">
              ✓ NOT USED
            </div>

            <div className="pt-6">
              <button 
                onClick={() => performCheckIn(res.data.ticket.ticketId)}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
              >
                {isLoading ? "PROCESSING..." : `[ CHECK IN TICKET ]`}
              </button>
            </div>
          </div>
        )}

        {/* CHECK-IN SUCCESSFUL */}
        {res.status === 'checked_in_success' && res.data?.ticket && (
          <div className="text-center space-y-4 text-lg">
            <p className="font-bold text-white text-xl">Ticket {res.data.ticket.ticketNumber} OF {res.data.ticket.totalTickets}</p>
            <p className="font-mono text-gold font-bold">{res.data.ticket.ticketId}</p>
            
            <div className="pt-4 mt-4 border-t border-white/10">
              <p className="text-gray-400 mb-1">Entry recorded at:</p>
              <p className="text-white font-medium">
                 {new Date(res.data.ticket.checkedInAt).toLocaleString('en-IN', {
                   timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric',
                   hour: '2-digit', minute: '2-digit', hour12: true
                 }).replace(/am/i, 'AM').replace(/pm/i, 'PM')}
              </p>
            </div>
            {res.data.ticket.checkedInByEmail && (
              <div className="pt-2">
                <p className="text-gray-400 mb-1">Checked By:</p>
                <p className="text-white font-medium">{res.data.ticket.checkedInByEmail}</p>
              </div>
            )}
          </div>
        )}

        {/* ALREADY USED (DUPLICATE) */}
        {res.status === 'already_checked_in' && res.data?.ticket && (
          <div className="text-center space-y-4 text-lg">
            <p className="font-bold text-white text-xl">Ticket {res.data.ticket.ticketNumber} OF {res.data.ticket.totalTickets}</p>
            <p className="font-mono text-gold font-bold">{res.data.ticket.ticketId}</p>
            
            <div className="pt-4 mt-4 border-t border-white/10">
              <p className="text-gray-400 mb-1">Checked in at:</p>
              <p className="text-red-400 font-medium">
                 {res.data.ticket.checkedInAt ? new Date(res.data.ticket.checkedInAt).toLocaleString('en-IN', {
                   timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric',
                   hour: '2-digit', minute: '2-digit', hour12: true
                 }).replace(/am/i, 'AM').replace(/pm/i, 'PM') : 'Unknown'}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
          <QrCode className="text-gold" size={32} />
        </div>
        <h1 className="text-3xl font-playfair font-bold text-white mb-2">Check-in Attendee</h1>
        <p className="text-gray-400">Scan QR code or use an alternative method.</p>
      </div>

      {/* CAMERA SCANNER VIEW */}
      {isScanning && (
        <div className="bg-black border border-white/10 rounded-xl p-8 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-bold text-white flex items-center gap-2"><Camera size={20}/> CAMERA SCANNER</h2>
          </div>
          <div id="qr-reader" className="w-full text-black bg-black rounded overflow-hidden min-h-[300px]"></div>
          <button 
            onClick={stopCamera}
            className="w-full mt-6 bg-red-600/20 text-red-400 py-3 rounded-lg font-bold hover:bg-red-600/30 transition-colors flex items-center justify-center gap-2"
          >
            <CameraOff size={20} /> [ STOP CAMERA ]
          </button>
        </div>
      )}

      {/* CHECK-IN OPTIONS */}
      {!isScanning && !result && multipleResults.length === 0 && (
        <div className="space-y-6 mb-8 bg-black border border-white/10 rounded-xl p-8 shadow-lg">
           
           <button 
             onClick={() => { setResult(null); setIsScanning(true); }}
             className="w-full bg-gold text-black py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(220,179,101,0.2)] hover:bg-gold-light transition-all flex items-center justify-center gap-2"
           >
             <Camera size={24} /> SCAN WITH CAMERA
           </button>
           
           <div className="relative flex items-center py-2">
             <div className="flex-grow border-t border-white/10"></div>
             <span className="flex-shrink-0 mx-4 text-gray-500 font-medium text-sm">CAN'T SCAN THE QR?</span>
             <div className="flex-grow border-t border-white/10"></div>
           </div>

           <div className="text-center">
             <p className="text-gray-400 text-sm mb-4">Upload the customer's E-Pass (PDF) or QR image.</p>
             <label className={`w-full ${isProcessingUpload ? 'bg-blue-600/50 cursor-wait' : 'bg-blue-600 hover:bg-blue-500 cursor-pointer'} text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 block`}>
               <input 
                 type="file" 
                 accept="image/*,application/pdf" 
                 className="hidden" 
                 onChange={handleFileUpload} 
                 disabled={isProcessingUpload}
               />
               <Upload size={24} /> {isProcessingUpload ? "PROCESSING..." : "📤 UPLOAD E-PASS / QR"}
             </label>
           </div>
        </div>
      )}

      {/* MANUAL INPUT FALLBACK */}
      {!isScanning && !result && multipleResults.length === 0 && (
        <div className="bg-black border border-white/10 rounded-xl p-8 shadow-lg mb-8">
          <p className="text-gray-500 font-medium text-sm mb-4 text-center uppercase">Or enter manually</p>
          <form onSubmit={handleValidateSubmit} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="ENTER TICKET ID"
                value={ticketId}
                onChange={e => setTicketId(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-lg text-white font-mono text-lg focus:border-gold outline-none uppercase"
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading || !ticketId}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-bold disabled:opacity-50 transition-colors"
            >
              {isLoading ? "..." : "[ VALIDATE ]"}
            </button>
          </form>
        </div>
      )}

      {/* MULTIPLE TICKETS SELECTION (PDF UPLOAD) */}
      {multipleResults.length > 0 && !result && (
        <div className="mt-8 bg-black border border-white/10 rounded-xl p-8 shadow-xl">
           <h3 className="text-2xl font-bold text-gold uppercase mb-2">{multipleResults.length} TICKETS FOUND</h3>
           <p className="text-gray-400 mb-6">The uploaded document contains multiple tickets. Select the ticket to check in:</p>
           
           <div className="space-y-4">
             {multipleResults.map((res, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                   {res.status === 'error' ? (
                      <div className="text-red-400">Invalid QR detected</div>
                   ) : res.data?.ticket ? (
                      <div className="w-full flex justify-between items-center">
                        <div>
                          <div className="text-white font-bold text-lg mb-1">Ticket {res.data.ticket.ticketNumber} of {res.data.ticket.totalTickets}</div>
                          <div className="text-gray-400 font-mono text-sm">Ticket ID: {res.data.ticket.ticketId}</div>
                        </div>
                        <button 
                          onClick={() => setResult(res)} // Show full validation result for this specific ticket
                          className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-500 transition-colors"
                        >
                          [ CHECK THIS TICKET ]
                        </button>
                      </div>
                   ) : (
                     <div className="text-red-400">Unknown Ticket</div>
                   )}
                </div>
             ))}
           </div>
           
           <button 
             onClick={() => setMultipleResults([])}
             className="w-full mt-6 bg-white/5 text-white py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
           >
             CANCEL UPLOAD
           </button>
        </div>
      )}

      {/* RESULT AREA */}
      {result && (
        <div className="mt-8">
          {renderValidationResult(result)}

          {/* SCAN NEXT TICKET BUTTON */}
          <div className="mt-6">
             <button 
               onClick={() => { 
                 setResult(null); 
                 setIsScanning(true); 
               }}
               className="w-full bg-gold text-black py-4 rounded-xl font-bold text-lg hover:bg-gold-light transition-all shadow-lg flex justify-center items-center gap-2"
             >
               <Camera size={24} /> [ SCAN NEXT TICKET ]
             </button>
          </div>
          {/* OR UPLOAD ANOTHER */}
          <div className="mt-4">
             <button 
               onClick={() => setResult(null)}
               className="w-full bg-white/5 text-gray-300 py-3 rounded-xl font-bold hover:bg-white/10 hover:text-white transition-all flex justify-center items-center gap-2"
             >
               [ CHOOSE DIFFERENT METHOD ]
             </button>
          </div>
        </div>
      )}

      {/* RECENT CHECK-INS */}
      {!isScanning && (
        <div className="mt-12">
          <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-4">
            RECENT CHECK-INS
          </h3>
          {recentCheckins.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent check-ins.</p>
          ) : (
            <div className="space-y-4">
              {recentCheckins.map((rc, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <CheckCircle className="text-green-500 w-5 h-5" />
                       <span className="text-green-400 font-bold uppercase tracking-wider text-sm">CHECKED IN</span>
                    </div>
                    <div className="text-gold font-mono font-bold text-lg mb-1">{rc.ticketId}</div>
                    <div className="text-white font-medium mb-1">Ticket {rc.ticketNumber} OF {rc.totalTickets}</div>
                    <div className="text-gray-400 text-sm">
                      <p><span className="text-gray-500">Customer:</span> {rc.customer}</p>
                      <p><span className="text-gray-500">Booking:</span> {rc.bookingId}</p>
                    </div>
                  </div>
                  <div className="text-left md:text-right border-t border-white/10 md:border-t-0 pt-3 md:pt-0">
                    <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Entry Time</p>
                    <p className="text-white font-medium mb-3">
                       {new Date(rc.checkedInAt).toLocaleString('en-IN', {
                         timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric',
                         hour: '2-digit', minute: '2-digit', hour12: true
                       }).replace(/am/i, 'AM').replace(/pm/i, 'PM')}
                    </p>
                    <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Checked By</p>
                    <p className="text-gray-300 font-medium">{rc.checkedInByEmail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
