import { affiliateUnavailable, affiliateOptions } from '../../_shared/affiliate_unavailable.js';
export const onRequestGet = ({ request }) => affiliateUnavailable(request, 'affiliate_statistics');
export const onRequestOptions = () => affiliateOptions();
