import apiClient from "../api/apiClient";

class WalletService {
  static Instance() {
    return new WalletService();
  }

  /**
   * loadRazorpayScript
   * Loads the Razorpay checkout script dynamically if not already present.
   */
  loadRazorpayScript() {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Failed to load Razorpay script"));
      document.body.appendChild(script);
    });
  }

  /**
   * initiateTopUp
   * Calls POST /v1/wallets/top-up/initiate
   */
  async initiateTopUp(packageId) {
    try {
      const response = await apiClient.post("/wallets/top-up/initiate", {
        package_id: packageId,
      });
      return response.data;
    } catch (error) {
      console.error("Error initiating top-up:", error);
      throw error;
    }
  }

  /**
   * Download job files (PDF and DOCX) for a specific job
   * @param jobId - The job ID from the transaction metadata
   * @returns Promise with download URLs
   */
  async downloadJobFiles(jobId) {
    try {
      const response = await apiClient.get(`/org_jobs/${jobId}/download`);
      return response.data;
    } catch (error) {
      console.error("Error downloading job files:", error);
      throw error;
    }
  }

  /**
   * verifyTopUp
   * Calls POST /v1/wallets/top-up/verify
   */
  async verifyTopUp(data) {
    try {
      const response = await apiClient.post("/wallets/top-up/verify", data);
      return response.data;
    } catch (error) {
      console.error("Error verifying top-up:", error);
      throw error;
    }
  }

  /**
   * getTransactions
   * Calls GET /v1/wallets/transactions
   * @param limit - Number of transactions to fetch (default: 50)
   */
  async getTransactions(limit = 50) {
    try {
      const response = await apiClient.get(
        `/wallets/transactions?limit=${limit}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }
}

const walletService = WalletService.Instance();
export default walletService;
