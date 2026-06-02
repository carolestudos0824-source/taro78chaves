/**
 * Google Play Billing integration using Digital Goods API and Payment Request API for TWA.
 */

export const GOOGLE_PLAY_PRODUCT_ID = "taro78chaves_premium";
export const GOOGLE_PLAY_BASE_PLAN_ID = "monthly-37";

export async function isGooglePlayBillingSupported(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  
  // Check for Digital Goods API support
  const hasDigitalGoods = 'getDigitalGoodsService' in window;
  // Check for Payment Request API support
  const hasPaymentRequest = 'PaymentRequest' in window;
  
  return hasDigitalGoods && hasPaymentRequest;
}

export interface GooglePlayProductDetails {
  itemId: string;
  title: string;
  description: string;
  price: {
    currency: string;
    value: string;
  };
}

export async function getGooglePlayProductDetails(): Promise<GooglePlayProductDetails | null> {
  if (!(await isGooglePlayBillingSupported())) return null;
  
  try {
    const service = await (window as any).getDigitalGoodsService('https://play.google.com/billing');
    const details = await service.getDetails([GOOGLE_PLAY_PRODUCT_ID]);
    
    if (details && details.length > 0) {
      const d = details[0];
      return {
        itemId: d.itemId,
        title: d.title,
        description: d.description,
        price: {
          currency: d.price.currency,
          value: d.price.value
        }
      };
    }
    return null;
  } catch (err) {
    console.error("Error getting Google Play product details:", err);
    return null;
  }
}

export async function startGooglePlayPurchase(userId: string) {
  if (!(await isGooglePlayBillingSupported())) {
    throw new Error("Google Play Billing is not supported on this device/environment.");
  }

  try {
    const paymentMethodData = [{
      supportedMethods: 'https://play.google.com/billing',
      data: {
        sku: GOOGLE_PLAY_PRODUCT_ID,
      }
    }];

    const paymentDetails = {
      total: {
        label: 'Total',
        amount: { currency: 'BRL', value: '37.00' }
      }
    };

    const request = new PaymentRequest(paymentMethodData, paymentDetails);
    const response = await request.show();
    
    // The response contains the purchase details
    // For Google Play Billing, the 'details' object has the purchaseToken
    const { purchaseToken } = (response as any).details;
    
    if (!purchaseToken) {
      await response.complete('fail');
      throw new Error("No purchase token received from Google Play.");
    }

    return {
      purchaseToken,
      response
    };
  } catch (err) {
    console.error("Error during Google Play purchase:", err);
    throw err;
  }
}

export async function acknowledgeGooglePlayPurchase(purchaseToken: string, response: any) {
  try {
    // Complete the payment request UI
    await response.complete('success');
    
    // In TWA, we also need to acknowledge the purchase via the Digital Goods API
    // if we want to confirm it on the client side, but usually we do it on the backend.
    // However, completing the response is essential.
  } catch (err) {
    console.error("Error acknowledging Google Play purchase:", err);
  }
}
