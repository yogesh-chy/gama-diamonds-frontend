import { apiClient } from "./client";

export interface ContactInquiryPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  inquiry_type?:
    | "consultation"
    | "bespoke"
    | "custom_jewellery"
    | "diamond_sourcing"
    | "suggestion"
    | "reach_out"
    | "newsletter"
    | "other";
  message: string;
  timeframe?: string;
  attachment_url?: string;
}

export const contactApi = {
  /**
   * Submit any customer inquiry, thought, suggestion, or consultation request.
   * Immediately notifies the administration via email alert.
   */
  submitInquiry: async (data: ContactInquiryPayload) => {
    const response = await apiClient.post<{ success: boolean; message: string; id?: number }>(
      "/contact/inquire/",
      data
    );
    return response.data;
  },

  /**
   * Subscribe an email address to the Private Circle newsletter.
   */
  subscribeNewsletter: async (email: string) => {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      "/contact/newsletter/",
      { email }
    );
    return response.data;
  },

  /**
   * Optional helper to upload an image or CAD document reference for bespoke inquiries.
   */
  uploadAttachment: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<{ success: boolean; url: string }>(
      "/products/upload/",
      formData
    );
    return response.data;
  },
};

