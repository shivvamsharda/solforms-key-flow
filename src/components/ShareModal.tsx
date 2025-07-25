import { useState, useEffect } from "react";
import { Copy, Download, QrCode, Code, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import QRCodeCanvas from "qrcode";

interface ShareModalProps {
  formId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ formId, isOpen, onClose }: ShareModalProps) {
  const [shareLink, setShareLink] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (formId && isOpen) {
      const link = `${window.location.origin}/form/${formId}`;
      setShareLink(link);
      generateQRCode(link);
    }
  }, [formId, isOpen]);

  const generateQRCode = async (url: string) => {
    try {
      const qrDataUrl = await QRCodeCanvas.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The form link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Copy failed",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.download = `form-${formId}-qr.png`;
      link.href = qrCodeDataUrl;
      link.click();
    }
  };

  const embedCode = `<iframe src="${shareLink}" width="100%" height="600" frameborder="0"></iframe>`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Share Your Form
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Share Link Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Form Link</label>
            <div className="flex gap-2">
              <Input 
                value={shareLink} 
                readOnly 
                className="flex-1"
              />
              <Button 
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="px-3"
              >
                {copied ? <span className="text-green-600">✓</span> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">QR Code</label>
            <div className="flex flex-col items-center space-y-3 p-4 border rounded-lg">
              {qrCodeDataUrl && (
                <img 
                  src={qrCodeDataUrl} 
                  alt="Form QR Code" 
                  className="w-32 h-32"
                />
              )}
              <Button 
                onClick={downloadQRCode}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          </div>

          {/* Embed Code Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Embed Code</label>
            <Textarea 
              value={embedCode}
              readOnly 
              className="text-xs font-mono"
              rows={3}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}