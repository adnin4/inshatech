import { affiliateUnavailable, affiliateOptions } from '../../_shared/affiliate_unavailable.js';
export const onRequestPost = ({ request }) => affiliateUnavailable(request, 'affiliate_attribution');
export const onRequestOptions = () => affiliateOptions();
