import { affiliateUnavailable, affiliateOptions } from '../../_shared/affiliate_unavailable.js';
export const onRequestGET=({request})=>affiliateUnavailable(request,'affiliate_payout_policy');
export const onRequestPOST=({request})=>affiliateUnavailable(request,'affiliate_payout_request');
export const onRequestOptions=()=>affiliateOptions();
