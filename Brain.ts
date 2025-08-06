import {
  BodyProcessImages,
  CheckHealthData,
  CreateFavoriteData,
  CreateFavoriteError,
  CreateFavoriteRequest,
  DeleteFavoriteData,
  DeleteFavoriteError,
  DeleteFavoriteParams,
  GetDashboardOverviewData,
  GetDetailedAnalyticsData,
  GetProcessingHistoryData,
  GetProcessingHistoryError,
  GetProcessingHistoryParams,
  GetSupportedFormatsData,
  GetUserFavoritesData,
  HealthCheckData,
  ProcessImagesData,
  ProcessImagesError,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * @description Process uploaded images to target file size with advanced compression options. - **target_size_mb**: Target file size in megabytes - **quality**: Optional JPEG quality override (10-95) - **output_format**: Output format (JPEG, PNG, WebP) - **maintain_aspect_ratio**: Whether to maintain aspect ratio during resize - **compression_strategy**: Compression strategy (auto, lossy, lossless, hybrid) - **preserve_metadata**: Whether to preserve image metadata - **resampling_algorithm**: Algorithm for image resizing - **progressive_jpeg**: Use progressive JPEG encoding - **optimize_png**: Enable PNG optimization - **files**: List of image files to process
   *
   * @tags dbtn/module:image_processing, dbtn/hasAuth
   * @name process_images
   * @summary Process Images
   * @request POST:/routes/image-processing/process
   */
  process_images = (data: BodyProcessImages, params: RequestParams = {}) =>
    this.request<ProcessImagesData, ProcessImagesError>({
      path: `/routes/image-processing/process`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });

  /**
   * @description Health check endpoint for image processing service
   *
   * @tags dbtn/module:image_processing, dbtn/hasAuth
   * @name health_check
   * @summary Health Check
   * @request GET:/routes/image-processing/health
   */
  health_check = (params: RequestParams = {}) =>
    this.request<HealthCheckData, any>({
      path: `/routes/image-processing/health`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get list of supported image formats
   *
   * @tags dbtn/module:image_processing, dbtn/hasAuth
   * @name get_supported_formats
   * @summary Get Supported Formats
   * @request GET:/routes/image-processing/formats
   */
  get_supported_formats = (params: RequestParams = {}) =>
    this.request<GetSupportedFormatsData, any>({
      path: `/routes/image-processing/formats`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get complete dashboard overview including analytics, recent jobs, and favorites
   *
   * @tags dbtn/module:dashboard, dbtn/hasAuth
   * @name get_dashboard_overview
   * @summary Get Dashboard Overview
   * @request GET:/routes/dashboard/overview
   */
  get_dashboard_overview = (params: RequestParams = {}) =>
    this.request<GetDashboardOverviewData, any>({
      path: `/routes/dashboard/overview`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get user's processing history with pagination and filtering
   *
   * @tags dbtn/module:dashboard, dbtn/hasAuth
   * @name get_processing_history
   * @summary Get Processing History
   * @request GET:/routes/dashboard/jobs
   */
  get_processing_history = (query: GetProcessingHistoryParams, params: RequestParams = {}) =>
    this.request<GetProcessingHistoryData, GetProcessingHistoryError>({
      path: `/routes/dashboard/jobs`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Get all user favorite compression settings
   *
   * @tags dbtn/module:dashboard, dbtn/hasAuth
   * @name get_user_favorites
   * @summary Get User Favorites
   * @request GET:/routes/dashboard/favorites
   */
  get_user_favorites = (params: RequestParams = {}) =>
    this.request<GetUserFavoritesData, any>({
      path: `/routes/dashboard/favorites`,
      method: "GET",
      ...params,
    });

  /**
   * @description Create a new favorite compression setting
   *
   * @tags dbtn/module:dashboard, dbtn/hasAuth
   * @name create_favorite
   * @summary Create Favorite
   * @request POST:/routes/dashboard/favorites
   */
  create_favorite = (data: CreateFavoriteRequest, params: RequestParams = {}) =>
    this.request<CreateFavoriteData, CreateFavoriteError>({
      path: `/routes/dashboard/favorites`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Delete a user favorite
   *
   * @tags dbtn/module:dashboard, dbtn/hasAuth
   * @name delete_favorite
   * @summary Delete Favorite
   * @request DELETE:/routes/dashboard/favorites/{favorite_id}
   */
  delete_favorite = ({ favoriteId, ...query }: DeleteFavoriteParams, params: RequestParams = {}) =>
    this.request<DeleteFavoriteData, DeleteFavoriteError>({
      path: `/routes/dashboard/favorites/${favoriteId}`,
      method: "DELETE",
      ...params,
    });

  /**
   * @description Get detailed user analytics
   *
   * @tags dbtn/module:dashboard, dbtn/hasAuth
   * @name get_detailed_analytics
   * @summary Get Detailed Analytics
   * @request GET:/routes/dashboard/analytics
   */
  get_detailed_analytics = (params: RequestParams = {}) =>
    this.request<GetDetailedAnalyticsData, any>({
      path: `/routes/dashboard/analytics`,
      method: "GET",
      ...params,
    });
}
