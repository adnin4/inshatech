import { affiliateUnavailable, affiliateOptions } from '../../_shared/affiliate_unavailable.js';
export const onRequestGET=({request})=>affiliateUnavailable(request,'affiliate_statistics');
export const onRequestOptions=()=>affiliateOptions();
