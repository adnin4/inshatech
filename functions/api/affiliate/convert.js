import { affiliateUnavailable, affiliateOptions } from '../../_shared/affiliate_unavailable.js';
export const onRequestPOST=({request})=>affiliateUnavailable(request,'affiliate_conversion');
export const onRequestOptions=()=>affiliateOptions();
