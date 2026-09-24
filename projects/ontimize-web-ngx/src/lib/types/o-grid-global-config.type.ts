export type OGridGlobalConfig = {
  /**
   * Configuration related to the grid's loading skeleton behavior.
   * Controls when and how the skeleton loader appears.
   */
  loading: {
    /**
     * Minimum time (in milliseconds) that must pass after a loading event
     * begins before the skeleton loader is displayed.
     *
     * This prevents the skeleton from flashing briefly on very fast operations.
     */
    threshold: number;

    /**
     * Minimum duration (in milliseconds) that the skeleton loader must remain visible
     * once it has appeared, even if the operation finishes quickly.
     *
     * Ensures a smooth visual experience and avoids abrupt hiding.
     */
    minVisible: number;
  };
};
