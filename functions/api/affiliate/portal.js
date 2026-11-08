import { affiliateUnavailable, affiliateOptions } from '../../_shared/affiliate_unavailable.js';
export const onRequestGet = ({ request }) => affiliateUnavailable(request, 'affiliate_portal_summary');
export const onRequestOptions = () => affiliateOptions();
