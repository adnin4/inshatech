import { affiliateUnavailable, affiliateOptions } from '../../_shared/affiliate_unavailable.js';
export const onRequestGet = ({ request }) => affiliateUnavailable(request, 'affiliate_payout_policy');
export const onRequestPost = ({ request }) => affiliateUnavailable(request, 'affiliate_payout_request');
export const onRequestOptions = () => affiliateOptions();
