import { affiliateUnavailable, affiliateOptions } from '../../_shared/affiliate_unavailable.js';
export const onRequestGET=({request})=>affiliateUnavailable(request,'affiliate_fraud_status');
export const onRequestPOST=({request})=>affiliateUnavailable(request,'affiliate_fraud_assessment');
export const onRequestOptions=()=>affiliateOptions();
