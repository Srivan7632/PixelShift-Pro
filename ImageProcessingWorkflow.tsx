import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import brain from "brain";
import { ProcessImageResponse, ImageInfo, CompressionStrategy, ResamplingAlgorithm } from "types";
import {
  Download,
  Image,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2,
  Settings,
  Eye,
  X,
  ArrowRight,
  FileImage,
  ChevronDown,
  ChevronRight,
  Info,
  Cpu,
  Gauge,
  Database
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  files: File[];
  onBack: () => void;
}

type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

interface ProcessingState {
  status: ProcessingStatus;
  progress: number;
  message: string;
  results?: ProcessImageResponse;
  error?: string;
}

export default function ImageProcessingWorkflow({ files, onBack }: Props) {
  const [targetSize, setTargetSize] = useState<string>('1.0');
  const [outputFormat, setOutputFormat] = useState<string>('JPEG');
  const [quality, setQuality] = useState<string>('');
  
  // Advanced settings state
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [compressionStrategy, setCompressionStrategy] = useState<CompressionStrategy>(CompressionStrategy.Auto);
  const [preserveMetadata, setPreserveMetadata] = useState<boolean>(false);
  const [resamplingAlgorithm, setResamplingAlgorithm] = useState<ResamplingAlgorithm>(ResamplingAlgorithm.Lanczos);
  const [progressiveJpeg, setProgressiveJpeg] = useState<boolean>(true);
  const [optimizePng, setOptimizePng] = useState<boolean>(true);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  
  const [processing, setProcessing] = useState<ProcessingState>({
    status: 'idle',
    progress: 0,
    message: 'Ready to process'
  });
  const [selectedPreview, setSelectedPreview] = useState<number | null>(null);

  const validateInputs = useCallback(() => {
    const size = parseFloat(targetSize);
    if (isNaN(size) || size <= 0 || size > 50) {
      toast.error('Target size must be between 0.1 and 50 MB');
      return false;
    }

    if (quality && (parseInt(quality) < 10 || parseInt(quality) > 95)) {
      toast.error('Quality must be between 10 and 95');
      return false;
    }

    if (files.length === 0) {
      toast.error('No files selected');
      return false;
    }

    if (files.length > 10) {
      toast.error('Maximum 10 files allowed');
      return false;
    }

    return true;
  }, [targetSize, quality, files]);

  const processImages = useCallback(async () => {
    if (!validateInputs()) return;

    setProcessing({ status: 'uploading', progress: 10, message: 'Preparing upload...' });

    try {
      // Simulate upload progress
      for (let i = 10; i <= 50; i += 10) {
        setProcessing(prev => ({ ...prev, progress: i, message: `Uploading files... ${i}%` }));
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setProcessing({ status: 'processing', progress: 60, message: 'Processing images with advanced compression...' });

      const formData = {
        target_size_mb: parseFloat(targetSize),
        output_format: outputFormat,
        maintain_aspect_ratio: maintainAspectRatio,
        compression_strategy: compressionStrategy,
        preserve_metadata: preserveMetadata,
        resampling_algorithm: resamplingAlgorithm,
        progressive_jpeg: progressiveJpeg,
        optimize_png: optimizePng,
        files: files,
        ...(quality && { quality: parseInt(quality) })
      };

      console.log('Sending advanced processing request:', formData);

      const response = await brain.process_images(formData);
      const result = await response.json() as ProcessImageResponse;

      console.log('Advanced processing response:', result);

      if (result.success) {
        setProcessing({
          status: 'completed',
          progress: 100,
          message: `Successfully processed ${result.images.length} image(s) using ${compressionStrategy} strategy in ${result.processing_time_ms}ms`,
          results: result
        });
        toast.success(`Images processed with ${compressionStrategy} compression!`);
      } else {
        throw new Error(result.message || 'Processing failed');
      }
    } catch (error: any) {
      console.error('Processing error:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Processing failed';
      setProcessing({
        status: 'error',
        progress: 0,
        message: errorMessage,
        error: errorMessage
      });
      toast.error(errorMessage);
    }
  }, [files, targetSize, outputFormat, quality, maintainAspectRatio, compressionStrategy, preserveMetadata, resamplingAlgorithm, progressiveJpeg, optimizePng, validateInputs]);

  const downloadImage = useCallback((base64Data: string, filename: string, format: string) => {
    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: `image/${format.toLowerCase()}` });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `processed_${filename}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`Downloaded ${filename}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    }
  }, []);

  const downloadAll = useCallback(() => {
    if (!processing.results) return;
    
    processing.results.processed_files.forEach((base64Data, index) => {
      const imageInfo = processing.results!.images[index];
      setTimeout(() => {
        downloadImage(base64Data, imageInfo.filename, imageInfo.format);
      }, index * 100); // Stagger downloads
    });
  }, [processing.results, downloadImage]);

  const reset = useCallback(() => {
    setProcessing({ status: 'idle', progress: 0, message: 'Ready to process' });
    setSelectedPreview(null);
  }, []);

  const getStatusIcon = () => {
    switch (processing.status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Settings className="w-6 h-6 text-purple-400" />;
    }
  };

  const getStatusColor = () => {
    switch (processing.status) {
      case 'uploading':
        return 'bg-cyan-500';
      case 'processing':
        return 'bg-purple-500';
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <ArrowRight className="w-4 h-4 rotate-180 mr-2" />
            Back
          </Button>
          <h3 className="text-2xl font-bold text-cyan-300">Process Images</h3>
        </div>
        <Badge variant="outline" className="border-purple-500 text-purple-300">
          {files.length} file{files.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Panel */}
        <Card className="glass-panel neon-border rounded-xl p-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-purple-400" />
              <h4 className="text-lg font-semibold text-purple-300">Processing Settings</h4>
            </div>

            {/* Target Size Input */}
            <div className="space-y-2">
              <Label htmlFor="targetSize" className="text-cyan-300 font-medium">
                Target File Size (MB)
              </Label>
              <Input
                id="targetSize"
                type="number"
                min="0.1"
                max="50"
                step="0.1"
                value={targetSize}
                onChange={(e) => setTargetSize(e.target.value)}
                placeholder="1.0"
                className="glass-panel border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
                disabled={processing.status === 'uploading' || processing.status === 'processing'}
              />
              <p className="text-xs text-gray-400">Enter desired file size (0.1 - 50 MB)</p>
            </div>

            {/* Output Format */}
            <div className="space-y-2">
              <Label className="text-cyan-300 font-medium">Output Format</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat} disabled={processing.status === 'uploading' || processing.status === 'processing'}>
                <SelectTrigger className="glass-panel border-gray-600 text-white focus:border-cyan-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-panel border-gray-600">
                  <SelectItem value="JPEG">JPEG (Best compression)</SelectItem>
                  <SelectItem value="PNG">PNG (Lossless)</SelectItem>
                  <SelectItem value="WEBP">WebP (Modern format)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quality Override */}
            <div className="space-y-2">
              <Label htmlFor="quality" className="text-cyan-300 font-medium">
                Quality Override (Optional)
              </Label>
              <Input
                id="quality"
                type="number"
                min="10"
                max="95"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                placeholder="Auto"
                className="glass-panel border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
                disabled={processing.status === 'uploading' || processing.status === 'processing'}
              />
              <p className="text-xs text-gray-400">Leave empty for auto-optimization (10-95)</p>
            </div>

            {/* Advanced Settings */}
            <TooltipProvider>
              <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-purple-500 text-purple-300 hover:bg-purple-500/10 transition-all duration-300"
                    disabled={processing.status === 'uploading' || processing.status === 'processing'}
                  >
                    <Cpu className="w-4 h-4 mr-2" />
                    Advanced Compression Settings
                    {showAdvanced ? (
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    ) : (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 mt-4">
                  <div className="glass-panel rounded-lg p-4 border border-purple-500/30 space-y-4">
                    
                    {/* Compression Strategy */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Label className="text-purple-300 font-medium">Compression Strategy</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent className="glass-panel border-gray-600 text-white max-w-xs">
                            <p className="text-sm">
                              <strong>Auto:</strong> Smart strategy selection<br/>
                              <strong>Lossy:</strong> Aggressive compression<br/>
                              <strong>Lossless:</strong> No quality loss<br/>
                              <strong>Hybrid:</strong> Tries lossless first
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Select 
                        value={compressionStrategy} 
                        onValueChange={(value) => setCompressionStrategy(value as CompressionStrategy)}
                        disabled={processing.status === 'uploading' || processing.status === 'processing'}
                      >
                        <SelectTrigger className="glass-panel border-gray-600 text-white focus:border-purple-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-panel border-gray-600">
                          <SelectItem value={CompressionStrategy.Auto}>Auto (Recommended)</SelectItem>
                          <SelectItem value={CompressionStrategy.Lossy}>Lossy (Aggressive)</SelectItem>
                          <SelectItem value={CompressionStrategy.Lossless}>Lossless (High Quality)</SelectItem>
                          <SelectItem value={CompressionStrategy.Hybrid}>Hybrid (Smart)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Resampling Algorithm */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Label className="text-purple-300 font-medium">Resampling Algorithm</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="w-4 h-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent className="glass-panel border-gray-600 text-white max-w-xs">
                            <p className="text-sm">
                              Algorithm used for resizing images. Lanczos provides best quality.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Select 
                        value={resamplingAlgorithm} 
                        onValueChange={(value) => setResamplingAlgorithm(value as ResamplingAlgorithm)}
                        disabled={processing.status === 'uploading' || processing.status === 'processing'}
                      >
                        <SelectTrigger className="glass-panel border-gray-600 text-white focus:border-purple-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-panel border-gray-600">
                          <SelectItem value={ResamplingAlgorithm.Lanczos}>Lanczos (Best Quality)</SelectItem>
                          <SelectItem value={ResamplingAlgorithm.Bicubic}>Bicubic (Good)</SelectItem>
                          <SelectItem value={ResamplingAlgorithm.Bilinear}>Bilinear (Fast)</SelectItem>
                          <SelectItem value={ResamplingAlgorithm.Nearest}>Nearest (Fastest)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Advanced Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Maintain Aspect Ratio */}
                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2">
                          <Label className="text-purple-300 text-sm">Maintain Aspect</Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-3 h-3 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent className="glass-panel border-gray-600 text-white">
                              <p className="text-sm">Keep original width/height ratio</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Switch 
                          checked={maintainAspectRatio} 
                          onCheckedChange={setMaintainAspectRatio}
                          disabled={processing.status === 'uploading' || processing.status === 'processing'}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>

                      {/* Preserve Metadata */}
                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2">
                          <Label className="text-purple-300 text-sm">Preserve Metadata</Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-3 h-3 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent className="glass-panel border-gray-600 text-white">
                              <p className="text-sm">Keep EXIF, color profiles, etc.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Switch 
                          checked={preserveMetadata} 
                          onCheckedChange={setPreserveMetadata}
                          disabled={processing.status === 'uploading' || processing.status === 'processing'}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>

                      {/* Progressive JPEG */}
                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2">
                          <Label className="text-purple-300 text-sm">Progressive JPEG</Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-3 h-3 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent className="glass-panel border-gray-600 text-white">
                              <p className="text-sm">Better loading for web display</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Switch 
                          checked={progressiveJpeg} 
                          onCheckedChange={setProgressiveJpeg}
                          disabled={processing.status === 'uploading' || processing.status === 'processing' || outputFormat !== 'JPEG'}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>

                      {/* Optimize PNG */}
                      <div className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2">
                          <Label className="text-purple-300 text-sm">Optimize PNG</Label>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-3 h-3 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent className="glass-panel border-gray-600 text-white">
                              <p className="text-sm">Better PNG compression</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Switch 
                          checked={optimizePng} 
                          onCheckedChange={setOptimizePng}
                          disabled={processing.status === 'uploading' || processing.status === 'processing' || outputFormat !== 'PNG'}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </TooltipProvider>

            <Separator className="bg-gray-700" />

            {/* Process Button */}
            <Button
              onClick={processImages}
              disabled={processing.status === 'uploading' || processing.status === 'processing'}
              className="w-full neon-border bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold transition-all duration-300 neon-glow"
            >
              {processing.status === 'uploading' || processing.status === 'processing' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Start Processing
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Status Panel */}
        <Card className="glass-panel neon-border rounded-xl p-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              {getStatusIcon()}
              <h4 className="text-lg font-semibold text-cyan-300">Processing Status</h4>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">{processing.message}</span>
                <span className="text-gray-300">{processing.progress}%</span>
              </div>
              <Progress
                value={processing.progress}
                className="h-3 bg-gray-700"
              />
              <div className={`h-1 rounded-full transition-all duration-300 ${getStatusColor()}`} style={{ width: `${processing.progress}%` }} />
            </div>

            {/* Error Display */}
            {processing.status === 'error' && (
              <div className="glass-panel rounded-lg p-4 border border-red-500">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-300 font-medium">Processing Error</span>
                </div>
                <p className="text-red-200 text-sm">{processing.error}</p>
                <Button
                  onClick={reset}
                  variant="outline"
                  size="sm"
                  className="mt-3 border-red-500 text-red-300 hover:bg-red-500/10"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Success Actions */}
            {processing.status === 'completed' && processing.results && (
              <div className="space-y-4">
                <div className="glass-panel rounded-lg p-4 border border-green-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-300 font-medium">Processing Complete!</span>
                  </div>
                  <p className="text-green-200 text-sm">
                    {processing.results.images.length} images processed in {processing.results.processing_time_ms}ms
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={downloadAll}
                    className="flex-1 neon-border bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white font-semibold transition-all duration-300 neon-glow"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                  <Button
                    onClick={reset}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Results Preview */}
      {processing.status === 'completed' && processing.results && (
        <div className="space-y-6">
          {/* Batch Analytics */}
          {processing.results.batch_analytics && (
            <Card className="glass-panel neon-border rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Database className="w-5 h-5 text-yellow-400" />
                <h4 className="text-lg font-semibold text-yellow-300">Batch Analytics</h4>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="glass-panel rounded-lg p-3 border border-yellow-500/30">
                  <div className="text-xs text-gray-400 mb-1">Total Original</div>
                  <div className="text-lg font-bold text-yellow-300">
                    {(processing.results.batch_analytics.total_original_size_mb || 0).toFixed(2)} MB
                  </div>
                </div>
                <div className="glass-panel rounded-lg p-3 border border-green-500/30">
                  <div className="text-xs text-gray-400 mb-1">Total Processed</div>
                  <div className="text-lg font-bold text-green-300">
                    {(processing.results.batch_analytics.total_processed_size_mb || 0).toFixed(2)} MB
                  </div>
                </div>
                <div className="glass-panel rounded-lg p-3 border border-purple-500/30">
                  <div className="text-xs text-gray-400 mb-1">Avg Compression</div>
                  <div className="text-lg font-bold text-purple-300">
                    {(processing.results.batch_analytics.average_compression_ratio || 0).toFixed(1)}x
                  </div>
                </div>
                <div className="glass-panel rounded-lg p-3 border border-cyan-500/30">
                  <div className="text-xs text-gray-400 mb-1">Total Iterations</div>
                  <div className="text-lg font-bold text-cyan-300">
                    {processing.results.batch_analytics.total_iterations || 0}
                  </div>
                </div>
              </div>
              
              {/* Strategies Used */}
              {processing.results.batch_analytics.strategies_used && Object.keys(processing.results.batch_analytics.strategies_used).length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-400">Compression Strategies Used:</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(processing.results.batch_analytics.strategies_used).map(([strategy, count]) => (
                      <Badge key={strategy} variant="outline" className="border-purple-500 text-purple-300 text-xs">
                        {strategy}: {count as number}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}
          
          {/* Individual Results */}
          <Card className="glass-panel neon-border rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Eye className="w-5 h-5 text-pink-400" />
              <h4 className="text-lg font-semibold text-pink-300">Processing Results</h4>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {processing.results.images.map((image, index) => (
                <div key={index} className="glass-panel rounded-lg p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileImage className="w-5 h-5 text-cyan-400" />
                      <span className="font-medium text-cyan-300 truncate">
                        {image.filename}
                      </span>
                    </div>
                    <Badge variant="outline" className="border-purple-500 text-purple-300">
                      {image.format}
                    </Badge>
                  </div>

                  {/* Before/After Comparison */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-300">Before</div>
                      <div className="glass-panel rounded p-3 border border-red-500/30">
                        <div className="text-lg font-bold text-red-300">{image.original_size_mb} MB</div>
                        <div className="text-xs text-gray-400">{image.width}×{image.height}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-300">After</div>
                      <div className="glass-panel rounded p-3 border border-green-500/30">
                        <div className="text-lg font-bold text-green-300">{image.processed_size_mb} MB</div>
                        <div className="text-xs text-gray-400">{image.compression_ratio}x reduction</div>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Analytics */}
                  {image.analytics && (
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-purple-300">Technical Details</div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Algorithm:</span>
                          <span className="text-cyan-300 font-mono">{image.analytics.algorithm_used}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Strategy:</span>
                          <span className="text-purple-300 font-mono">{image.analytics.processing_strategy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Iterations:</span>
                          <span className="text-yellow-300">{image.analytics.iterations_required}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Reduction:</span>
                          <span className="text-green-300">{image.analytics.size_reduction_percentage?.toFixed(1)}%</span>
                        </div>
                        {image.analytics.quality_achieved && (
                          <div className="flex justify-between col-span-2">
                            <span className="text-gray-400">Final Quality:</span>
                            <span className="text-orange-300">{image.analytics.quality_achieved}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Optimization Notes */}
                      {image.analytics.optimization_notes && image.analytics.optimization_notes.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs text-gray-400">Optimizations Applied:</div>
                          <div className="space-y-1">
                            {image.analytics.optimization_notes.map((note, noteIndex) => (
                              <div key={noteIndex} className="text-xs text-gray-300 bg-gray-800/50 rounded px-2 py-1">
                                • {note}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recommendations */}
                  {image.recommendations && image.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-orange-300">Recommendations</div>
                      <div className="space-y-1">
                        {image.recommendations.map((rec, recIndex) => (
                          <div key={recIndex} className="text-xs text-orange-200 bg-orange-900/20 rounded px-2 py-1 border border-orange-500/20">
                            💡 {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata Info */}
                  {image.metadata && preserveMetadata && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-blue-300">Metadata Preserved</div>
                      <div className="text-xs text-blue-200 bg-blue-900/20 rounded px-2 py-1 border border-blue-500/20">
                        ✓ EXIF data, color profiles, and technical metadata retained
                      </div>
                    </div>
                  )}

                  {/* Download Button */}
                  <Button
                    onClick={() => downloadImage(processing.results!.processed_files[index], image.filename, image.format)}
                    className="w-full neon-border bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold transition-all duration-300 neon-glow"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download {image.filename}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
