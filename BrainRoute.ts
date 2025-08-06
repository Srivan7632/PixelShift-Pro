import {
  BodyProcessImages,
  CheckHealthData,
  CreateFavoriteData,
  CreateFavoriteRequest,
  DeleteFavoriteData,
  GetDashboardOverviewData,
  GetDetailedAnalyticsData,
  GetProcessingHistoryData,
  GetSupportedFormatsData,
  GetUserFavoritesData,
  HealthCheckData,
  ProcessImagesData,
} from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * @description Process uploaded images to target file size with advanced compression options. - **target_size_mb**: Target file size in megabytes - **quality**: Optional JPEG quality override (10-95) - **output_format**: Output format (JPEG, PNG, WebP) - **maintain_aspect_ratio**: Whether to maintain aspect ratio during resize - **compression_strategy**: Compression strategy (auto, lossy, lossless, hybrid) - **preserve_metadata**: Whether to preserve image metadata - **resampling_algorithm**: Algorithm for image resizing - **progressive_jpeg**: Use progressive JPEG encoding - **optimize_png**: Enable PNG optimization - **files**: List of image files to process
   * @tags dbtn/module:image_processing, dbtn/hasAuth
   * @name process_images
   * @summary Process Images
   * @request POST:/routes/image-processing/process
   */
  export namespace process_images {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BodyProcessImages;
    export type RequestHeaders = {};
    export type ResponseBody = ProcessImagesData;
  }

  /**
   * @description Health check endpoint for image processing service
   * @tags dbtn/module:image_processing, dbtn/hasAuth
   * @name health_check
   * @summary Health Check
   * @request GET:/routes/image-processing/health
   */
  export namespace health_check {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HealthCheckData;
  }

  /**
   * @description Get list of supported image formats
   * @tags dbtn/module:image_processing, dbtn/hasAuth
   * @name get_supported_formats
   * @summary Get Supported Formats
   * @request GET:/routes/image-processing/formats
   */
  export namespace get_supported_formats {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetSupportedFormatsData;
  }

  /**
   * @description Get complete dashboard overview including analytics, recent jobs, and favorites
   * @tags dbtn/module:dashboard, dbtn/hasAuth
   * @name get_dashboard_overview
   * @summary Get Dashboard Overview
   * @request GET:/routes/dashboard/overview
   */
  export namespace get_dashboard_overview {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetDashboardOverviewData;
  }

  /**
   * @description Get user's processing history with pagination and filtering
   * @tags dbtn/module:dashboard, dbtn/hasAuth
   * @name get_processing_history
   * @summary Get Processing History
   * @request GET:/routes/dashboard/jobs
   */
  export namespace get_processing_history {
    export type RequestParams = {};
    export type RequestQuery = {
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
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetProcessingHistoryData;
  }

  /**
   * @description Get all user favorite compression settings
   * @tags dbtn/module:dashboard, dbtn/hasAuth
   * @name get_user_favorites
   * @summary Get User Favorites
   * @request GET:/routes/dashboard/favorites
   */
  export namespace get_user_favorites {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetUserFavoritesData;
  }

  /**
   * @description Create a new favorite compression setting
   * @tags dbtn/module:dashboard, dbtn/hasAuth
   * @name create_favorite
   * @summary Create Favorite
   * @request POST:/routes/dashboard/favorites
   */
  export namespace create_favorite {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateFavoriteRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CreateFavoriteData;
  }

  /**
   * @description Delete a user favorite
   * @tags dbtn/module:dashboard, dbtn/hasAuth
   * @name delete_favorite
   * @summary Delete Favorite
   * @request DELETE:/routes/dashboard/favorites/{favorite_id}
   */
  export namespace delete_favorite {
    export type RequestParams = {
      /** Favorite Id */
      favoriteId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteFavoriteData;
  }

  /**
   * @description Get detailed user analytics
   * @tags dbtn/module:dashboard, dbtn/hasAuth
   * @name get_detailed_analytics
   * @summary Get Detailed Analytics
   * @request GET:/routes/dashboard/analytics
   */
  export namespace get_detailed_analytics {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetDetailedAnalyticsData;
  }
}
