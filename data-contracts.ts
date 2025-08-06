/** Body_process_images */
export interface BodyProcessImages {
  /**
   * Target Size Mb
   * Target file size in MB
   */
  target_size_mb: number;
  /**
   * Quality
   * JPEG quality (10-95)
   */
  quality?: number | null;
  /**
   * Output Format
   * Output format (JPEG, PNG, WebP)
   * @default "JPEG"
   */
  output_format?: string;
  /**
   * Maintain Aspect Ratio
   * Maintain aspect ratio
   * @default true
   */
  maintain_aspect_ratio?: boolean;
  /**
   * Compression strategy
   * @default "auto"
   */
  compression_strategy?: CompressionStrategy;
  /**
   * Preserve Metadata
   * Preserve image metadata
   * @default false
   */
  preserve_metadata?: boolean;
  /**
   * Resampling algorithm
   * @default "lanczos"
   */
  resampling_algorithm?: ResamplingAlgorithm;
  /**
   * Progressive Jpeg
   * Use progressive JPEG
   * @default true
   */
  progressive_jpeg?: boolean;
  /**
   * Optimize Png
   * Optimize PNG compression
   * @default true
   */
  optimize_png?: boolean;
  /**
   * Files
   * Image files to process
   */
  files: File[];
}

/** CompressionAnalytics */
export interface CompressionAnalytics {
  /** Algorithm Used */
  algorithm_used: string;
  /** Iterations Required */
  iterations_required: number;
  /** Quality Achieved */
  quality_achieved?: number | null;
  /** Size Reduction Percentage */
  size_reduction_percentage: number;
  /** Processing Strategy */
  processing_strategy: string;
  /**
   * Optimization Notes
   * @default []
   */
  optimization_notes?: string[];
}

/** CompressionStrategy */
export enum CompressionStrategy {
  Lossy = "lossy",
  Lossless = "lossless",
  Hybrid = "hybrid",
  Auto = "auto",
}

/** CreateFavoriteRequest */
export interface CreateFavoriteRequest {
  /** Name */
  name: string;
  /** Target Size Mb */
  target_size_mb: number;
  /** Output Format */
  output_format: string;
  /**
   * Compression Strategy
   * @default "auto"
   */
  compression_strategy?: string;
  /**
   * Preserve Metadata
   * @default false
   */
  preserve_metadata?: boolean;
  /**
   * Resampling Algorithm
   * @default "lanczos"
   */
  resampling_algorithm?: string;
  /**
   * Progressive Jpeg
   * @default true
   */
  progressive_jpeg?: boolean;
  /**
   * Optimize Png
   * @default true
   */
  optimize_png?: boolean;
  /**
   * Maintain Aspect Ratio
   * @default true
   */
  maintain_aspect_ratio?: boolean;
  /** Quality */
  quality?: number | null;
}

/** DashboardOverviewResponse */
export interface DashboardOverviewResponse {
  analytics: UserAnalyticsResponse;
  /** Recent Jobs */
  recent_jobs: ProcessingJobResponse[];
  /** Favorites */
  favorites: UserFavoriteResponse[];
  /** Total Jobs */
  total_jobs: number;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** ImageInfo */
export interface ImageInfo {
  /** Filename */
  filename: string;
  /** Original Size Mb */
  original_size_mb: number;
  /** Processed Size Mb */
  processed_size_mb: number;
  /** Width */
  width: number;
  /** Height */
  height: number;
  /** Format */
  format: string;
  /** Compression Ratio */
  compression_ratio: number;
  metadata?: ImageMetadata | null;
  analytics?: CompressionAnalytics | null;
  /**
   * Recommendations
   * @default []
   */
  recommendations?: string[];
}

/** ImageMetadata */
export interface ImageMetadata {
  /** Exif Data */
  exif_data?: Record<string, any> | null;
  /** Color Profile */
  color_profile?: string | null;
  /** Dpi */
  dpi?: any[] | null;
  /** Format Specific */
  format_specific?: Record<string, any> | null;
}

/** ProcessImageResponse */
export interface ProcessImageResponse {
  /** Success */
  success: boolean;
  /** Message */
  message: string;
  /** Images */
  images: ImageInfo[];
  /** Processed Files */
  processed_files: string[];
  /** Processing Time Ms */
  processing_time_ms: number;
  /** Batch Analytics */
  batch_analytics?: Record<string, any> | null;
}

/** ProcessingJobResponse */
export interface ProcessingJobResponse {
  /** Id */
  id: number;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /** Original Filename */
  original_filename: string;
  /** Target Size Mb */
  target_size_mb: number;
  /** Output Format */
  output_format: string;
  /** Compression Strategy */
  compression_strategy: string;
  /** Status */
  status: string;
  /** Original Size Mb */
  original_size_mb?: number | null;
  /** Processed Size Mb */
  processed_size_mb?: number | null;
  /** Compression Ratio */
  compression_ratio?: number | null;
  /** Width */
  width?: number | null;
  /** Height */
  height?: number | null;
  /** Processing Time Ms */
  processing_time_ms?: number | null;
  /** Algorithm Used */
  algorithm_used?: string | null;
  /** Size Reduction Percentage */
  size_reduction_percentage?: number | null;
  /** Optimization Notes */
  optimization_notes?: string[] | null;
  /** Recommendations */
  recommendations?: string[] | null;
  /**
   * Has Thumbnail
   * @default false
   */
  has_thumbnail?: boolean;
  /**
   * Can Redownload
   * @default false
   */
  can_redownload?: boolean;
}

/** ResamplingAlgorithm */
export enum ResamplingAlgorithm {
  Lanczos = "lanczos",
  Bicubic = "bicubic",
  Bilinear = "bilinear",
  Nearest = "nearest",
}

/** UserAnalyticsResponse */
export interface UserAnalyticsResponse {
  /** Total Images Processed */
  total_images_processed: number;
  /** Total Original Size Mb */
  total_original_size_mb: number;
  /** Total Processed Size Mb */
  total_processed_size_mb: number;
  /** Total Space Saved Mb */
  total_space_saved_mb: number;
  /** Total Processing Time Ms */
  total_processing_time_ms: number;
  /** Jpeg Count */
  jpeg_count: number;
  /** Png Count */
  png_count: number;
  /** Webp Count */
  webp_count: number;
  /** Auto Strategy Count */
  auto_strategy_count: number;
  /** Lossy Strategy Count */
  lossy_strategy_count: number;
  /** Lossless Strategy Count */
  lossless_strategy_count: number;
  /** Hybrid Strategy Count */
  hybrid_strategy_count: number;
  /** Daily Stats */
  daily_stats: Record<string, any>;
}

/** UserFavoriteResponse */
export interface UserFavoriteResponse {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Target Size Mb */
  target_size_mb: number;
  /** Output Format */
  output_format: string;
  /** Compression Strategy */
  compression_strategy: string;
  /** Preserve Metadata */
  preserve_metadata: boolean;
  /** Resampling Algorithm */
  resampling_algorithm: string;
  /** Progressive Jpeg */
  progressive_jpeg: boolean;
  /** Optimize Png */
  optimize_png: boolean;
  /** Maintain Aspect Ratio */
  maintain_aspect_ratio: boolean;
  /** Quality */
  quality?: number | null;
  /** Usage Count */
  usage_count: number;
  /** Last Used At */
  last_used_at?: string | null;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type CheckHealthData = HealthResponse;

export type ProcessImagesData = ProcessImageResponse;

export type ProcessImagesError = HTTPValidationError;

export type HealthCheckData = any;

export type GetSupportedFormatsData = any;

export type GetDashboardOverviewData = DashboardOverviewResponse;

export interface GetProcessingHistoryParams {
  /**
   * Limit
   * @default 20
   */
  limit?: number;
  /**
   * Offset
   * @default 0
   */
  offset?: number;
  /** Status */
  status?: string | null;
}

/** Response Get Processing History */
export type GetProcessingHistoryData = ProcessingJobResponse[];

export type GetProcessingHistoryError = HTTPValidationError;

/** Response Get User Favorites */
export type GetUserFavoritesData = UserFavoriteResponse[];

export type CreateFavoriteData = UserFavoriteResponse;

export type CreateFavoriteError = HTTPValidationError;

export interface DeleteFavoriteParams {
  /** Favorite Id */
  favoriteId: number;
}

export type DeleteFavoriteData = any;

export type DeleteFavoriteError = HTTPValidationError;

export type GetDetailedAnalyticsData = UserAnalyticsResponse;
