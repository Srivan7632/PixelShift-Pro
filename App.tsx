import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUser } from "@stackframe/react";
import { Upload, Zap, Image, Cpu, Download, BarChart3 } from "lucide-react";
import ImageProcessingWorkflow from "components/ImageProcessingWorkflow";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentView, setCurrentView] = useState<'upload' | 'processing'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useUser();
  const navigate = useNavigate();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      setSelectedFiles(files);
      console.log('Files dropped:', files);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setSelectedFiles(files);
    console.log('Files selected:', files);
  }, []);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const startProcessing = () => {
    if (selectedFiles.length > 0) {
      setCurrentView('processing');
    }
  };

  const backToUpload = () => {
    setCurrentView('upload');
  };

  return (
    <div className="cosmic-bg min-h-screen">
      {/* Header with UserButton */}
      <header className="relative z-10 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-bold prismatic-text">PixelShift Pro</h1>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/Dashboard')}
                variant="outline"
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div className="glass-panel rounded-lg p-2">
                <span className="text-sm text-cyan-300">Welcome, {user.displayName || 'User'}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        {currentView === 'upload' ? (
          <>
            {/* Hero Section */}
            <section className="text-center mb-16">
              <div className="floating-panel">
                <h2 className="text-6xl font-bold mb-6 prismatic-text">
                  Next-Gen Image Resizing
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Compress your images to precise file sizes with cutting-edge algorithms. 
                  Built for tech professionals who demand precision and speed.
                </p>
                
                {/* Feature highlights */}
                <div className="flex justify-center gap-8 mb-12">
                  <div className="glass-panel rounded-lg p-4 floating-panel">
                    <Cpu className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">AI-Powered</p>
                  </div>
                  <div className="glass-panel rounded-lg p-4 floating-panel" style={{animationDelay: '1s'}}>
                    <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Lightning Fast</p>
                  </div>
                  <div className="glass-panel rounded-lg p-4 floating-panel" style={{animationDelay: '2s'}}>
                    <Image className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Quality Preserved</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Upload Section */}
            <section className="max-w-4xl mx-auto">
              <Card className={`glass-panel neon-border rounded-2xl p-8 transition-all duration-300 ${
                isDragOver ? 'neon-glow scale-105' : ''
              }`}>
                <div
                  className={`holographic-zone rounded-xl border-2 border-dashed border-cyan-400/30 p-12 text-center transition-all duration-300 ${
                    isDragOver ? 'drag-over border-cyan-400/60' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {selectedFiles.length === 0 ? (
                    <div className="space-y-6">
                      <div className="mx-auto w-24 h-24 rounded-full glass-panel flex items-center justify-center neon-glow-purple">
                        <Upload className="w-12 h-12 text-cyan-400" />
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-semibold mb-2 text-cyan-300">
                          Drop your images here
                        </h3>
                        <p className="text-gray-400 mb-6">
                          or click to select files • JPEG, PNG, WebP supported
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button 
                          onClick={openFileDialog}
                          className="neon-border bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 neon-glow"
                        >
                          <Upload className="w-5 h-5 mr-2" />
                          Select Images
                        </Button>
                        
                        <span className="text-gray-500 text-sm">
                          or drag and drop
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="mx-auto w-24 h-24 rounded-full glass-panel flex items-center justify-center neon-glow">
                        <Image className="w-12 h-12 text-green-400" />
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-semibold mb-2 text-green-300">
                          {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''} ready
                        </h3>
                        <div className="space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="glass-panel rounded-lg p-3 text-left max-w-md mx-auto">
                              <div className="flex items-center justify-between">
                                <span className="text-cyan-300 font-medium">{file.name}</span>
                                <span className="text-gray-400 text-sm">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-4 justify-center">
                        <Button 
                          onClick={() => setSelectedFiles([])}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          Clear
                        </Button>
                        <Button 
                          onClick={startProcessing}
                          className="neon-border bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 neon-glow"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Start Processing
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </section>

            {/* Tech specs section */}
            <section className="mt-16 text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="glass-panel rounded-xl p-6 floating-panel">
                  <h4 className="text-lg font-semibold text-cyan-300 mb-2">Precision Control</h4>
                  <p className="text-gray-400 text-sm">
                    Specify exact file size targets down to the megabyte
                  </p>
                </div>
                <div className="glass-panel rounded-xl p-6 floating-panel" style={{animationDelay: '0.5s'}}>
                  <h4 className="text-lg font-semibold text-purple-300 mb-2">Smart Algorithms</h4>
                  <p className="text-gray-400 text-sm">
                    Advanced compression that preserves visual quality
                  </p>
                </div>
                <div className="glass-panel rounded-xl p-6 floating-panel" style={{animationDelay: '1s'}}>
                  <h4 className="text-lg font-semibold text-pink-300 mb-2">Batch Processing</h4>
                  <p className="text-gray-400 text-sm">
                    Handle multiple images with consistent settings
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <ImageProcessingWorkflow 
            files={selectedFiles} 
            onBack={backToUpload} 
          />
        )}
      </main>
    </div>
  );
}
