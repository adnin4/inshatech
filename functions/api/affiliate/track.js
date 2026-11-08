import { affiliateUnavailable, affiliateOptions } from '../../_shared/affiliate_unavailable.js';
export const onRequestPost = ({ request }) => affiliateUnavailable(request, 'affiliate_click_tracking');
export const onRequestOptions = () => affiliateOptions();
