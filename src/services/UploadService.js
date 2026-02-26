import axios from 'axios';
import { useUploadStore } from '../Store/uploadStore';
import apiClient from '../api/apiClient';

const axiosClientJobs = axios.create({
  baseURL: `${process.env.REACT_APP_UPLOAD_URL}/jobs/`,
  headers: {
    "ngrok-skip-browser-warning": "true"
  }
});

const axiosClientPayment = axios.create({
  baseURL: `${process.env.REACT_APP_UPLOAD_URL}/payments/`,
  headers: {
    "ngrok-skip-browser-warning": "true"
  }
});

class UploadService {
  static Instance() {
    return new UploadService();
  }

  static downloadUrlAsTextFile(jobId) {
    try {
      const currentUrl = window.location.href;

      const textContent = `Your PDF Translation Job Link\n`;
      const textContent2 = `================================\n\n`;
      const textContent3 = `URL: ${currentUrl}\n`;
      const textContent4 = `Job ID: ${jobId}\n`;
      const textContent5 = `Saved at: ${new Date().toLocaleString()}\n\n`;
      const textContent6 = `Simply click the link above or paste it in your browser to continue tracking your translation.\n`;

      const fullContent =
        textContent +
        textContent2 +
        textContent3 +
        textContent4 +
        textContent5 +
        textContent6;

      const blob = new Blob([fullContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `recovery-link-${jobId}.txt`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('URL file downloaded successfully');
    } catch (error) {
      console.error('Failed to download URL file:', error);
    }
  }

  async uploadFile(fileDetails, onProgress) {
    if (!fileDetails.file) {
      throw new Error('No file provided for upload.');
    }

    const response = await axiosClientJobs.post('init', {
      filename: fileDetails.fileName,
      size_bytes: fileDetails.fileSizeInBytes,
      target_language: fileDetails.language,
    });

    const { upload_url, job_id, expires_at } = response.data;

    const newUrl = `${window.location.pathname}?job_id=${job_id}`;
    window.history.pushState({}, '', newUrl);

    const { setJob } = useUploadStore.getState();
    setJob(job_id, expires_at);

    await axios.put(upload_url, fileDetails.file, {
      headers: {
        'Content-Type': 'application/pdf',
        'x-goog-content-length-range': '0,209715200',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (onProgress) {
            onProgress(percentCompleted);
          }
        }
      },
    });

    console.log('File uploaded successfully');

    setTimeout(() => {
      this.pollUploadStatus(job_id);
    }, 5000);
  }

  async getUploadStatus(jobId) {
    const response = await axiosClientJobs.get(`${jobId}/status`);
    return response.data;
  }

  async checkJobExists(jobId) {
    try {
      await axiosClientJobs.get(`${jobId}/status`);
      console.log('Job exists');
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('Job not found');
        return false;
      }
      throw error;
    }
  }

  async createPaymentSession(jobId) {
    const response = await axiosClientPayment.post(`${jobId}/create-payment-order`);
    return response.data;
  }

  async verifyPayment(jobId, paymentId, orderId, signature) {
    const response = await axiosClientPayment.post(`${jobId}/verify-payment`, {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      job_id: jobId
    });

    return response.data;
  }

  async initializeRazorpayPayment(jobId, onSuccess, onError) {
    try {
      if (!window.Razorpay) {
        await this.loadRazorpayScript();
      }

      const paymentData = await this.createPaymentSession(jobId);

      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: paymentData.currency,
        order_id: paymentData.order_id,
        name: 'PDF Translation Service',
        description: `Translation for Job ID: ${jobId}`,
        handler: async (response) => {
          console.log('Payment successful, waiting for webhook verification', response);

          UploadService.downloadUrlAsTextFile(jobId);
          useUploadStore.setState({
            paymentCompleted: true,
            paymentStatus: 'VERIFYING',
            jobStatus: 'VERIFYING'
          });

          if (onSuccess) onSuccess(response);

          setTimeout(() => {
            uploadService.pollForWebhookVerification(jobId);
          }, 2000);
        },
        prefill: {
          email: '',
          contact: ''
        },
        theme: {
          color: '#4F46E5'
        },
        modal: {
          ondismiss: function () {
            console.log('Payment modal closed by user');
            useUploadStore.setState({
              paymentStatus: 'CANCELLED'
            });
          }
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        console.error('Payment failed', response.error);
        useUploadStore.setState({
          paymentStatus: 'FAILED',
          paymentError: response.error.description
        });
        if (onError) onError(response.error);
      });

      rzp.open();
    } catch (error) {
      console.error('Error initializing payment:', error);
      if (onError) onError(error);
      throw error;
    }
  }

  loadRazorpayScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.body.appendChild(script);
    });
  }

  async pollForWebhookVerification(jobId) {
    return new Promise((resolve, reject) => {
      let pollCount = 0;
      const maxPolls = 10;

      const poll = async () => {
        try {
          pollCount++;
          const statusResponse = await this.getUploadStatus(jobId);

          const uiStatus =
            statusResponse.status === 'WEBHOOK_VERIFICATION_PENDING'
              ? 'VERIFYING'
              : statusResponse.status;

          useUploadStore.setState({
            jobStatus: uiStatus,
          });

          if (statusResponse.status === 'QUEUED') {
            useUploadStore.setState({
              jobStatus: 'QUEUED',
              paymentStatus: 'SUCCESS'
            });

            setTimeout(() => {
              this.pollTranslationStatus(jobId);
            }, 5000);

            resolve(statusResponse);
            return true;
          }

          if (statusResponse.status === 'FAILED' || statusResponse.error) {
            useUploadStore.setState({
              jobStatus: 'FAILED',
              paymentStatus: 'FAILED',
              paymentCompleted: false
            });
            reject(new Error(statusResponse.error || 'Payment verification failed'));
            return true;
          }

          if (pollCount >= maxPolls) {
            useUploadStore.setState({
              jobStatus: 'VERIFICATION_TIMEOUT',
              paymentStatus: 'TIMEOUT'
            });
            reject(new Error('Webhook verification timeout after 30 seconds'));
            return true;
          }

          return false;
        } catch (err) {
          reject(err);
          return true;
        }
      };

      poll().then((shouldStop) => {
        if (shouldStop) return;

        const interval = setInterval(async () => {
          const shouldStop = await poll();
          if (shouldStop) clearInterval(interval);
        }, 3000);
      });
    });
  }

  async pollUploadStatus(jobId) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const statusResponse = await this.getUploadStatus(jobId);

          if (statusResponse.error) {
            clearInterval(interval);
            reject(new Error(statusResponse.error));
          }

          if (
            statusResponse.status === 'AWAITING_PAYMENT' &&
            statusResponse.mime_type_verified === true &&
            statusResponse.file_integrity_checked === true
          ) {
            clearInterval(interval);

            useUploadStore.setState({
              isPayable: true,
              amount: statusResponse.calculated_total ?? 0,
              pages: statusResponse.pages_detected ?? 0,
              jobStatus: 'AWAITING_PAYMENT'
            });

            resolve(statusResponse);
          }
        } catch (err) {
          clearInterval(interval);
          reject(err);
        }
      }, 5000);
    });
  }

  async getDownloadUrls(jobId) {
    try {
      const response = await axiosClientJobs.get(`${jobId}/download`);

      if (response.data.pdf_url && response.data.docx_url) {
        return {
          pdf_url: response.data.pdf_url,
          docx_url: response.data.docx_url
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async pollTranslationStatus(jobId) {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const statusResponse = await this.getUploadStatus(jobId);

          useUploadStore.setState({
            jobStatus: statusResponse.status,
            translationProgress: statusResponse.progress || 0,
          });

          if (
            statusResponse.status === 'COMPLETED' ||
            statusResponse.status === 'DOWNLOAD'
          ) {
            let downloadUrls = statusResponse.result_download_urls;

            if (!downloadUrls) {
              downloadUrls = await this.getDownloadUrls(jobId);
            }

            if (downloadUrls) {
              useUploadStore.setState({
                jobStatus: 'COMPLETED',
                downloadUrls: downloadUrls,
                translationProgress: 100,
              });
            }

            resolve(statusResponse);
            return true;
          }

          if (statusResponse.status === 'FAILED' || statusResponse.error) {
            useUploadStore.setState({
              jobStatus: 'FAILED',
            });
            reject(new Error(statusResponse.error || 'Translation failed'));
            return true;
          }

          return false;
        } catch (err) {
          reject(err);
          return true;
        }
      };

      poll().then((shouldStop) => {
        if (shouldStop) return;

        const interval = setInterval(async () => {
          const shouldStop = await poll();
          if (shouldStop) clearInterval(interval);
        }, 40000);
      });
    });
  }
}

const uploadService = UploadService.Instance();
export default uploadService;